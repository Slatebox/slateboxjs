import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, checkWorkshopReplacement, decodeWorkshopFragment, describeWorkshopEdits, encodeWorkshopFragment, validateWorkshop, workshopCandidate, workshopCardAsNote, workshopCardNoteText, workshopLaneCaption, workshopNoteCandidate, workshopNoteRefusal, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { launchLinkRefusal, launchPlanLimits, sampleLaunchPlan, scheduleLaunch } from '../../src/workshops/rules'
import { workshopEditsBetween, launchLinkTargets } from '../../src/boards'

const plan = validateWorkshop(sampleLaunchPlan())
const apply = (board: Workshop, edits: WorkshopEdit[]) => applyWorkshopEdits(board, edits)
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = apply(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result.workshop
}
const refusal = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = apply(board, edits)
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const times = (board: Workshop) => Object.fromEntries([...scheduleLaunch(board)].map(([id, t]) => [id, [t.start, t.end, t.slack, t.critical]]))

describe('launch plan schedule', () => {
  it('derives every start from what a task waits on, and finds the critical path', () => {
    // Against the plan's own finish (day 12): Design → Build → QA has no slack; Copy has ten days.
    expect(times(plan)).toEqual({ design: [0, 4, 0, true], build: [4, 10, 0, true], copy: [0, 2, 10, false], qa: [10, 12, 0, true] })
    const slid = ok(plan, [{ kind: 'set_task', card: 'Copy', lag: 3 }])
    expect(times(slid).copy).toEqual([3, 5, 7, false])
    expect([...scheduleLaunch(slid)].filter(([, t]) => t.critical).map(([id]) => id)).toEqual(['design', 'build', 'qa'])
    expect(workshopLaneCaption(plan, 'engineering')).toBe('2 tasks · 2 on the critical path')
    expect(workshopLaneCaption(plan, 'product')).toBe('2 tasks · 1 on the critical path')
  })

  it('never stores a start: a saved plan with one is read without it', () => {
    const saved = validateWorkshop({ ...plan, cards: plan.cards.map(card => ({ ...card, start: 9 })) })
    expect(saved.cards.every(card => !('start' in card))).toBe(true)
  })
})

describe('launch plan constraint: every task ends by launch day', () => {
  it('refuses a stretch that pushes a later task past launch, in the words a person sees', () => {
    const late = refusal(plan, [{ kind: 'set_task', card: 'Build', duration: 9 }])
    expect(late.reason).toBe('That pushes QA to day 15, after launch on day 14.')
    expect(late.limits).toEqual({ field: 'duration', min: 1, max: 8, reasons: { min: 'A task takes at least 1 day.', max: 'That pushes QA to day 15, after launch on day 14.' } })
    expect(ok(plan, [{ kind: 'set_task', card: 'Build', duration: 8 }]).cards.find(card => card.id === 'build')!.duration).toBe(8)
  })

  it('refuses a task that itself ends after launch', () => {
    expect(refusal(plan, [{ kind: 'set_task', card: 'Copy', lag: 13 }]).reason).toBe('That ends on day 15, after launch on day 14.')
    expect(launchPlanLimits(plan, { cardId: 'copy', field: 'lag' }).max).toBe(12)
  })

  it('refuses launch day before the last task ends, and a saved plan that runs late', () => {
    expect(refusal(plan, [{ kind: 'set_launch_day', day: 11 }]).reason).toBe('That pushes QA to day 12, after launch on day 11.')
    expect(() => validateWorkshop({ ...plan, launch: { day: 11 } })).toThrow('QA ends on day 12, after launch on day 11.')
  })

  it('refuses a cycle and a link that is there, and offers only the tasks a bar may be dropped on', () => {
    expect(launchLinkRefusal(plan, 'design', 'qa')).toBe('QA already waits on Design, so Design can\'t wait on QA.')
    expect(launchLinkRefusal(plan, 'build', 'design')).toBe('Build already waits on Design.')
    expect(launchLinkTargets(plan, 'design')).toEqual(['copy'])
    expect(launchLinkTargets(plan, 'copy').sort()).toEqual(['build', 'design', 'qa'])
    expect(refusal(plan, [{ kind: 'link_tasks', card: 'Design', waitsOn: 'QA' }]).reason).toBe('QA already waits on Design, so Design can\'t wait on QA.')
  })

  it('keeps a task where it was when it is linked, so a slid task can still wait on another', () => {
    const slid = ok(plan, [{ kind: 'set_task', card: 'Copy', lag: 3 }])
    const linked = ok(slid, [{ kind: 'link_tasks', card: 'Copy', waitsOn: 'QA' }])
    expect(times(linked).copy).toEqual([12, 14, 0, true])
    expect(linked.cards.find(card => card.id === 'copy')).toEqual({ id: 'copy', label: 'Copy', laneId: 'product', duration: 2, dependsOn: ['qa'] })
    const unlinked = ok(linked, [{ kind: 'unlink_tasks', card: 'Copy', waitsOn: 'QA' }])
    expect(times(unlinked).copy).toEqual([12, 14, 0, true])
  })

  it('moves a task to another team without moving it in time', () => {
    const moved = workshopCandidate(plan, 'copy', 'engineering')!
    expect(times(moved)).toEqual(times(plan))
    expect(ok(plan, [{ kind: 'move_card', card: 'Copy', lane: 'Engineering' }])).toEqual(moved)
  })
})

describe('launch plan sync, save, load and undo', () => {
  it('keeps both people\'s edits when they change different tasks (each applied to the board as the server has it)', () => {
    const ada = workshopEditsBetween(plan, ok(plan, [{ kind: 'set_task', card: 'Copy', lag: 3 }]))
    const ben = workshopEditsBetween(plan, ok(plan, [{ kind: 'set_task', card: 'Build', duration: 7 }]))
    expect(ada).toEqual([{ kind: 'set_task', card: { id: 'copy' }, duration: 2, lag: 3 }])
    const server = ok(ok(plan, ada), ben)
    expect(server.cards.find(card => card.id === 'copy')!.lag).toBe(3)
    expect(server.cards.find(card => card.id === 'build')!.duration).toBe(7)
  })

  it('makes the last change to the same field win', () => {
    const first = ok(plan, [{ kind: 'set_task', card: 'Copy', lag: 3 }])
    expect(ok(first, [{ kind: 'set_task', card: { id: 'copy' }, duration: 2, lag: 5 }]).cards.find(card => card.id === 'copy')!.lag).toBe(5)
  })

  it('saves and loads as plain data, through JSON and a link', () => {
    const changed = ok(plan, [{ kind: 'link_tasks', card: 'Copy', waitsOn: 'Design' }, { kind: 'set_launch_day', day: 20 }])
    expect(validateWorkshop(JSON.parse(JSON.stringify(changed)))).toEqual(changed)
    expect(decodeWorkshopFragment(encodeWorkshopFragment(changed))).toEqual(changed)
  })

  it('undoes a change by going back to the board before it, as a whole-board save the guards allow', () => {
    const after = ok(plan, [{ kind: 'set_task', card: 'Build', duration: 8 }, { kind: 'link_tasks', card: 'Copy', waitsOn: 'Design' }])
    expect(checkWorkshopReplacement(after, plan)).toBeNull()
    const back = ok(after, workshopEditsBetween(after, plan))
    expect(back.cards).toEqual(plan.cards)
    expect(back).toEqual(plan)
  })

  it('keeps its kind and its teams', () => {
    expect(checkWorkshopReplacement(plan, { ...plan, kind: undefined, launch: undefined } as Workshop)).toMatch(/stays one/)
    expect(refusal(plan, [{ kind: 'add_lane', label: 'Sales' }]).reason).toBe('A launch plan keeps the teams it came with. You can rename them and move tasks between them.')
    expect(describeWorkshopEdits(plan).filter(entry => entry.accepted).map(entry => entry.kind)).toEqual(expect.arrayContaining(['set_task', 'link_tasks', 'unlink_tasks', 'set_launch_day', 'add_card', 'move_card']))
  })
})

describe('launch plan notes and cards', () => {
  it('turns a note into a task with the days written on it, or two days', () => {
    const docs = workshopNoteCandidate(plan, 'product', { id: 'n1', label: 'Docs 3d' })!
    expect(docs.cards.at(-1)).toEqual({ id: 'n1', label: 'Docs', laneId: 'product', duration: 3 })
    expect(workshopNoteCandidate(plan, 'product', { id: 'n2', label: 'Docs' })!.cards.at(-1)!.duration).toBe(2)
    expect(workshopNoteRefusal(plan, 'product', { id: 'n3', label: 'Docs 20d' })).toBe('That ends on day 20, after launch on day 14.')
  })

  it('sends a task back to the canvas with its days as words, and lets what waited on it start sooner', () => {
    expect(workshopCardNoteText(plan, plan.cards.find(card => card.id === 'copy')!)).toBe('Copy · 2 days')
    const left = workshopCardAsNote(plan, 'build')!
    expect(left.cards.find(card => card.id === 'qa')!.dependsOn).toBeUndefined()
  })

  it('adds a task by edit with its days, lag and what it waits on', () => {
    const next = ok(plan, [{ kind: 'add_card', lane: 'Engineering', label: 'Docs', duration: 1, waitsOn: ['QA'] }])
    expect(next.cards.at(-1)).toEqual({ id: 'card-1', label: 'Docs', laneId: 'engineering', duration: 1, dependsOn: ['qa'] })
    expect(refusal(plan, [{ kind: 'add_card', lane: 'Engineering', label: 'Docs', duration: 3, waitsOn: ['QA'] }]).reason).toBe('That ends on day 15, after launch on day 14.')
    expect(refusal(plan, [{ kind: 'add_card', lane: 'Engineering', label: 'Docs', amount: 4 }]).reason).toBe('Only a pipeline\'s deals and a budget\'s line items carry an amount.')
  })
})

describe('a launch plan on a phone and from the keyboard (phase 2 review M2, M3)', () => {
  it('draws each phone row a 44px bar, with its length grip past the bar\'s end, never over it', async () => {
    const { launchLayout } = await import('../../src/boards/launchPlanKit')
    const g = launchLayout(plan, { narrow: true, width: 360 })
    for (const card of plan.cards) {
      const bar = g.bars.get(card.id)!
      expect(bar.height).toBe(44)
      const grip = g.parts.find(part => part.name === 'handle-' + card.id)!
      expect(grip.x).toBe(bar.x + bar.width)
      expect(grip.width).toBe(44)
    }
    // On a laptop the grip still straddles the end, as before.
    const wide = launchLayout(plan, { width: 1200 })
    const build = wide.bars.get('build')!
    expect(wide.parts.find(part => part.name === 'handle-build')!.x).toBe(build.x + build.width - 22)
  })

  it('L on a focused bar offers what it may wait on, then what it waits on; the edits are the reducer\'s', async () => {
    const { launchPlanKit } = await import('../../src/boards/launchPlanKit')
    const copy = launchPlanKit.keyChoices!(plan, 'card-copy', 'l') as { said: string; edits: WorkshopEdit[] }[]
    expect(copy.map(choice => choice.said)).toContain('Copy waits on QA')
    const qa = copy.find(choice => choice.said === 'Copy waits on QA')!
    const linked = ok(plan, qa.edits)
    expect(linked.cards.find(card => card.id === 'copy')!.dependsOn).toEqual(['qa'])
    const back = launchPlanKit.keyChoices!(linked, 'card-copy', 'L') as { said: string; edits: WorkshopEdit[] }[]
    expect(back.map(choice => choice.said)).toContain('Copy stops waiting on QA')
    expect(launchPlanKit.keyChoices!(plan, 'card-copy', 'k')).toBeNull()
    expect(launchPlanKit.keyChoices!(plan, 'handle-copy', 'l')).toBeNull()
    expect(launchPlanKit.cardKeys).toMatch(/L chooses what it waits on/)
  })
})
