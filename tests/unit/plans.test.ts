// The plans on the rulebook (dragology final.md D2 and D3): dated launch plans with working days, a hard
// or soft line, overlap, snap, freezes, push or stop, locks; the hiring plan with its runway floor.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, checkWorkshopReplacement, describeWorkshopEdits, validateWorkshop, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { behaviourLines, ruleSentence } from '../../src/workshops/behaviour'
import {
  behaviourEditsBetween, catalogSamples, checkTime, dayFromWords, goLiveSample, hireLagFor, hiringPlanSample, launchPlanSample, legalRuns, pastTheLine,
  planDrags, runwayMonths, sampleLaunchPlan, scheduleLaunch,
} from '../../src/workshops/rules'
import { launchLayout, launchPlanKit } from '../../src/boards'
import { catalog, catalogPreset } from '../../src/workshops/catalog'

const today = '2026-11-21' // a Saturday: plans start Monday 23 Nov
const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-22T10:00:00.000Z' }
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result.workshop
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused.reason
}
const launch = () => validateWorkshop(launchPlanSample(today))
const hiring = () => validateWorkshop(hiringPlanSample(today))
const rule = (board: Workshop, body: Record<string, unknown>) => ok(board, [{ kind: 'add_rule', rule: body as never }])
const ruleId = (board: Workshop, kind: string) => board.behaviour!.rules.find(item => item.kind === kind)!.id

describe('real dates and working days', () => {
  it('a 3-day task from Thursday ends Monday with working days, and Saturday without', () => {
    const base: Workshop = { version: 1, kind: 'launch-plan', title: 'Days', launch: { day: 30 }, clock: { origin: '2026-11-26' }, // a Thursday
      lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [{ id: 'x', label: 'X', laneId: 'a', duration: 3 }] }
    const calendar = validateWorkshop({ ...base, behaviour: { version: 1, rev: 0, rules: [] } })
    const working = rule(calendar, { kind: 'workdays' })
    const last = (board: Workshop) => scheduleLaunch(board).get('x')!.to - 1
    expect(last(calendar)).toBe(2) // Sat 28 Nov
    expect(last(working)).toBe(4) // Mon 30 Nov
    expect(ruleSentence(working.behaviour!.rules[0], working)).toBe('Days are working days: weekends don’t count.')
  })

  it('reads the dates people say', () => {
    const origin = '2026-11-23'
    expect(dayFromWords(origin, 'Dec 20')).toBe(27)
    expect(dayFromWords(origin, '20 Dec')).toBe(27)
    expect(dayFromWords(origin, 'Jan 3')).toBe(41)
    expect(dayFromWords(origin, 'Thu 14 Jan')).toBe(52)
    expect(dayFromWords(origin, 'May')).toBe(159)
    expect(dayFromWords(origin, '2026-12-07')).toBe(14)
    expect(dayFromWords(origin, 'soon')).toBeNull()
  })

  it('the library’s launch plan is dated, in working days, with a Marketing row and its rules on the note', () => {
    const plan = launch()
    expect(plan.clock).toEqual({ origin: '2026-11-23' })
    expect(plan.lanes.map(lane => lane.label)).toEqual(['Product', 'Engineering', 'Marketing'])
    expect(behaviourLines(plan)).toEqual(['Days are working days: weekends don’t count.', 'Launch is a hard line: every task ends by Fri 11 Dec.', 'A slip pushes the tasks that wait on it.'])
    // QA's last day is Tue 8 Dec (working day 11); launch is Fri 11 Dec.
    expect(refused(plan, [{ kind: 'set_task', card: 'Design', lag: 3 }])).toBe('QA would run until Fri 11 Dec; launch is Fri 11 Dec.')
    expect(ok(plan, [{ kind: 'set_task', card: 'Design', lag: 2 }]).cards.find(card => card.id === 'build')!.lag).toBeUndefined()
  })

  it('a plan in day numbers keeps its sentences, and a plan without rules keeps its built-in line', () => {
    const plain = validateWorkshop(sampleLaunchPlan())
    expect(refused(plain, [{ kind: 'set_task', card: 'Build', duration: 9 }])).toBe('That pushes QA to day 15, after launch on day 14.')
    expect(behaviourLines(plain)).toEqual(['Every task ends by launch.', 'A slip pushes the tasks that wait on it.'])
    expect(() => validateWorkshop({ ...plain, behaviour: { version: 1, rev: 1, rules: [{ id: 'r', on: true, severity: 'refuse', set: { by: 'x', at: 'y', via: 'chat' }, kind: 'workdays' }] } }))
      .toThrow('Working days and freezes need dates; this plan counts day numbers.')
  })
})

describe('the seven time rules', () => {
  it('a soft line lets a task slip past launch, shown in red; the hard line refuses it', () => {
    const plan = launch()
    const soft = ok(plan, [{ kind: 'set_rule', rule: ruleId(plan, 'deadline'), severity: 'warn' }])
    expect(behaviourLines(soft)).toContain('Launch is a soft line: a task may slip past it, shown in red.')
    const slipped = ok(soft, [{ kind: 'set_task', card: 'Design', lag: 5 }])
    expect([...pastTheLine(slipped)]).toEqual(['build', 'qa'])
    const verdict = checkTime(soft, slipped)
    expect(verdict).toEqual({ ok: true, warnings: ['That would run until Fri 11 Dec; launch is Fri 11 Dec.'.replace('That would run until Fri 11 Dec', 'QA would run until Tue 15 Dec')] })
    // Back to a hard line while QA is past it: the plan can't be read that way, so the edit is refused.
    expect(refused(slipped, [{ kind: 'set_rule', rule: ruleId(plan, 'deadline'), severity: 'refuse' }])).toBe('QA would run until Tue 15 Dec; launch is Fri 11 Dec.')
    // A slip said far past the hard line (chat, exec) is refused in the line's words, as the drag is.
    expect(refused(plan, [{ kind: 'set_task', card: 'QA', lag: 30 }])).toMatch(/^QA would run until \w{3} \d+ \w{3}; launch is Fri 11 Dec\.$/)
  })

  it('stop instead of push: a slip stops at the tasks waiting on it, and holds them where they are', () => {
    const plan = launch()
    const stop = ok(plan, [{ kind: 'set_rule', rule: ruleId(plan, 'cascade'), onConflict: 'stop' }])
    expect(behaviourLines(stop)).toContain('A slip stops at the tasks that wait on it.')
    expect(refused(stop, [{ kind: 'set_task', card: 'Design', lag: 1 }])).toBe('Design would end after Build starts on Fri 27 Nov. Build waits on it, and a slip stops at the tasks that wait on it.')
    // Copy has three days before the launch post: it can slip two, and the post stays on its day.
    const post = scheduleLaunch(stop).get('post')!.from
    const slipped = ok(stop, [{ kind: 'set_task', card: 'Copy', lag: 2 }])
    expect(scheduleLaunch(slipped).get('post')!.from).toBe(post)
    expect(slipped.cards.find(card => card.id === 'post')!.lag).toBe(1)
    expect(refused(stop, [{ kind: 'set_task', card: 'Copy', lag: 4 }])).toMatch(/^Copy would end after Launch post starts/)
  })

  it('a freeze refuses a task that would run into it; one already in it stays', () => {
    const plan = launch()
    const frozen = rule(plan, { kind: 'blackout', start: '2026-11-26', end: '2026-11-27', label: 'code freeze' })
    expect(behaviourLines(frozen)).toContain('Nothing ships in code freeze, 26 Nov – 27 Nov.')
    // Design (23 – 26 Nov) already runs into the freeze and stays; Copy moving into it is refused.
    expect(refused(frozen, [{ kind: 'set_task', card: 'Copy', lag: 3 }])).toBe('Copy would run into code freeze (26 Nov – 27 Nov).')
    expect(ok(frozen, [{ kind: 'set_task', card: 'Copy', lag: 5 }]).cards.find(card => card.id === 'copy')!.lag).toBe(5)
    // The legal starts of Copy are two runs, either side of the freeze (and the launch post's line): the drag hops it.
    expect(legalRuns(frozen, 'copy', 'lag')).toEqual([[0, 1], [5, 7]])
    expect(refused(frozen, [{ kind: 'add_rule', rule: { kind: 'blackout', start: '2026-12-09', end: '2026-12-01', label: 'x' } as never }])).toBe('A freeze runs from one date to the same or a later one.')
  })

  it('overlap per team, snap to weeks, locked tasks', () => {
    const plan = launch()
    const apart = rule(plan, { kind: 'overlap', lane: 'Product' })
    expect(behaviourLines(apart)).toContain('Product’s tasks can’t overlap.')
    // Design and Copy already overlap: they stay; moving Copy within Design's days is still refused.
    expect(refused(apart, [{ kind: 'set_task', card: 'Copy', lag: 1 }])).toBe('Copy and Design would overlap in Product. Product’s tasks can’t overlap.')
    expect(ok(apart, [{ kind: 'set_task', card: 'Copy', lag: 4 }]).cards.find(card => card.id === 'copy')!.lag).toBe(4)
    const weeks = rule(plan, { kind: 'snap', unit: 'week' })
    expect(refused(weeks, [{ kind: 'set_task', card: 'Copy', duration: 3 }])).toBe('Tasks snap to whole weeks.')
    expect(ok(weeks, [{ kind: 'set_task', card: 'Copy', duration: 5 }]).cards.find(card => card.id === 'copy')!.duration).toBe(5)
    expect(legalRuns(weeks, 'copy', 'lag').flat().every(value => value % 5 === 0)).toBe(true)
    const locked = rule(plan, { kind: 'locked', cards: ['QA'] })
    expect(behaviourLines(locked)).toContain('QA is locked.')
    expect(refused(locked, [{ kind: 'set_task', card: 'Design', lag: 1 }])).toBe('QA is locked: it stays on Mon 7 Dec.')
    expect(refused(locked, [{ kind: 'remove_card', card: 'QA' }])).toBe('A locked task stays on the plan. Unlock it first.')
  })

  it('names one rule per refusal, by a fixed order, over every pair of the seven', () => {
    // One slip (Design 4 working days later, into a freeze, past a locked Build, over Docs, off the weeks, past launch) breaks each rule that checks.
    const base = validateWorkshop({ ...launchPlanSample(today), behaviour: undefined,
      cards: [...launchPlanSample(today).cards, { id: 'docs', label: 'Docs', laneId: 'engineering', duration: 2, lag: 12 }] })
    const bodies: Record<string, Record<string, unknown>> = {
      locked: { kind: 'locked', cards: ['build'] }, cascade: { kind: 'cascade', onConflict: 'stop' },
      blackout: { kind: 'blackout', start: '2026-11-27', end: '2026-11-27', label: 'offsite' }, overlap: { kind: 'overlap', lane: 'engineering' },
      snap: { kind: 'snap', unit: 'week' }, deadline: { kind: 'deadline', at: 'launch' }, workdays: { kind: 'workdays' },
    }
    const order = ['locked', 'cascade', 'blackout', 'overlap', 'snap', 'deadline']
    const kinds = Object.keys(bodies)
    let pairs = 0
    for (const a of kinds) for (const b of kinds) {
      if (a >= b) continue
      const rules = [bodies[a], bodies[b]].map((body, i) => ({ id: 'r' + i, on: true, severity: 'refuse', set: { by: 'x', at: 'y', via: 'chat' }, ...body }))
      const board = { ...base, behaviour: { version: 1 as const, rev: 1, rules: rules as never } }
      const after = { ...board, cards: board.cards.map(card => card.id === 'design' ? { ...card, lag: 4 } : card) }
      const verdict = checkTime(board, after)
      const expected = [a, b].filter(kind => order.includes(kind)).sort((x, y) => order.indexOf(x) - order.indexOf(y))[0]
      expect('refused' in verdict, a + ' + ' + b).toBe(true)
      if ('refused' in verdict) {
        expect(board.behaviour.rules.find(item => item.id === verdict.refused.ruleId)!.kind, a + ' + ' + b).toBe(expected)
        const alone = checkTime({ ...board, behaviour: { ...board.behaviour, rules: board.behaviour.rules.filter(item => item.kind === expected || item.kind === 'workdays') } },
          { ...after, behaviour: { ...board.behaviour, rules: board.behaviour.rules.filter(item => item.kind === expected || item.kind === 'workdays') } })
        expect('refused' in alone && alone.refused.sentence).toBe(verdict.refused.sentence)
      }
      pairs++
    }
    expect(pairs).toBe(21)
  })

  it('validates: one line, one slip rule, kinds a plan takes, and rules read no words', () => {
    const plan = launch()
    expect(refused(plan, [{ kind: 'add_rule', rule: { kind: 'deadline', at: 'launch' } }])).toBe('There is already a launch line. Change that one instead.')
    expect(refused(plan, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'Product', max: 2 } }])).toBe('This board does not know the rule capacity.')
    expect(refused(plan, [{ kind: 'add_rule', rule: { kind: 'snap', unit: 'week', label: 'x' } as never }])).toBe('A snap rule does not take label.')
    const lanes = validateWorkshop(catalogPreset('team-board'))
    expect(refused(lanes, [{ kind: 'add_rule', rule: { kind: 'workdays' } }])).toBe('This board does not know the rule workdays.')
    expect(describeWorkshopEdits(plan).some(edit => edit.kind === 'add_rule')).toBe(true)
  })

  it('a whole-board save keeps the rules: a slip past the hard line is refused, a rule change comes back as edits', () => {
    const plan = launch()
    const slipped = { ...plan, cards: plan.cards.map(card => card.id === 'design' ? { ...card, lag: 3 } : card) }
    expect(checkWorkshopReplacement(plan, slipped)).toBe('QA would run until Fri 11 Dec; launch is Fri 11 Dec.')
    const stop = ok(plan, [{ kind: 'set_rule', rule: ruleId(plan, 'cascade'), onConflict: 'stop' }, { kind: 'add_rule', rule: { kind: 'locked', cards: ['QA'] } }])
    expect(behaviourEditsBetween(plan, stop)).toEqual([{ kind: 'add_rule', rule: { kind: 'locked', cards: [{ id: 'qa' }] } }, { kind: 'set_rule', rule: 'rule-3', onConflict: 'stop' }])
  })

  it('a whole-board save keeps what no edit changes: the first day (a lock or a freeze is not slid by it), the line’s name, and rules change on their own', () => {
    const locked = rule(launch(), { kind: 'locked', cards: ['QA'] })
    expect(checkWorkshopReplacement(locked, { ...locked, clock: { origin: '2026-12-07' } })).toBe('A plan keeps its first day. Move tasks, or launch, instead.')
    const undated = rule(validateWorkshop({ ...launch(), behaviour: { version: 1, rev: 0, rules: [] } }), { kind: 'locked', cards: ['QA'] })
    expect(checkWorkshopReplacement(undated, { ...undated, clock: undefined })).toBe('A plan keeps its first day. Move tasks, or launch, instead.')
    expect(checkWorkshopReplacement(launch(), { ...launch(), launch: { day: 18, name: 'go-live' } })).toBe('A plan keeps what it calls its line.')
    // A rule added and a task moved in one save: the move would never be checked by the rule that came with it.
    const plan = launch()
    const freeze = ok(plan, [{ kind: 'add_rule', rule: { kind: 'blackout', start: '2026-11-23', end: '2026-12-31', label: 'freeze' } }])
    const both = { ...freeze, cards: freeze.cards.map(card => card.id === 'copy' ? { ...card, lag: 2 } : card) }
    expect(checkWorkshopReplacement(plan, both)).toBe('Change the rules on their own, then move tasks.')
    expect(checkWorkshopReplacement(plan, freeze)).toBeNull()
    // Moving a task on its own still answers to the rules.
    expect(checkWorkshopReplacement(freeze, both)).toMatch(/^Copy would run into freeze/)
  })
})

describe('a phrase changes the next drag (headless Dragology replay)', () => {
  const grab = { x: 10, y: 10 }
  const dropAt = (board: Workshop, cardId: string, dx: number) => {
    const bar = launchLayout(board, { width: 1200 }).bars.get(cardId)!
    const choose = launchPlanKit.chooser(board, cardId, grab, { width: 1200 })!
    return choose({ x: bar.x + grab.x + dx, y: bar.y + grab.y })
  }
  it('QA dragged far right stops at the hard line; on a soft line the same pointer path takes it past', () => {
    const plan = launch()
    const hard = dropAt(plan, 'qa', 400)
    expect(scheduleLaunch(hard).get('qa')!.end).toBe(14)
    const soft = ok(plan, [{ kind: 'set_rule', rule: ruleId(plan, 'deadline'), severity: 'warn' }])
    expect(scheduleLaunch(dropAt(soft, 'qa', 400)).get('qa')!.end).toBeGreaterThan(14)
    expect(planDrags(soft)).not.toBe(planDrags(plan))
  })
  it('a bar dropped inside a freeze lands on the nearest legal side', () => {
    const frozen = rule(launch(), { kind: 'blackout', start: '2026-11-26', end: '2026-11-27', label: 'code freeze' })
    const dayW = launchLayout(frozen, { width: 1200 }).dayW
    const dropped = dropAt(frozen, 'copy', 3.5 * dayW) // into the freeze
    expect([1, 5]).toContain(dropped.cards.find(card => card.id === 'copy')!.lag)
  })
  it('under stop, dragging Design later holds Build: the drop is Design where it was', () => {
    const plan = launch()
    const stop = ok(plan, [{ kind: 'set_rule', rule: ruleId(plan, 'cascade'), onConflict: 'stop' }])
    const dropped = dropAt(stop, 'design', 200)
    expect(scheduleLaunch(dropped).get('build')!.start).toBe(scheduleLaunch(stop).get('build')!.start)
    expect(dropped.cards.find(card => card.id === 'design')!.lag ?? 0).toBe(0)
  })
  it('past a rule, a ruled plan’s bar lands where the rules let it and says why (refusalAt lands); a plan without rules refuses', () => {
    const plan = launch()
    const g = launchLayout(plan, { width: 1200 })
    const bar = g.bars.get('design')!
    const far = { x: bar.x + grab.x + g.dayW * 6, y: bar.y + grab.y }
    expect(launchPlanKit.refusalAt(plan, 'design', grab, far, { width: 1200 })).toEqual({ laneId: 'product', reason: 'QA would run until Tue 15 Dec; launch is Fri 11 Dec.', lands: true })
    expect(launchPlanKit.refusalAt(plan, 'design', grab, { x: bar.x + grab.x + g.dayW, y: bar.y + grab.y }, { width: 1200 })).toBeNull()
    const plain = validateWorkshop(sampleLaunchPlan())
    const p = launchLayout(plain, { width: 1200 }), pb = p.bars.get('design')!
    expect(launchPlanKit.refusalAt(plain, 'design', grab, { x: pb.x + grab.x + p.dayW * 6, y: pb.y + grab.y }, { width: 1200 })).toEqual({ laneId: 'product', reason: 'That pushes QA to day 18, after launch on day 14.' })
  })
  it('a drag frame stays inside the budget: layout of 12 tasks on 4 teams in under 4 ms', () => {
    const lanes = ['a', 'b', 'c', 'd'].map(id => ({ id, label: id.toUpperCase() }))
    const cards = Array.from({ length: 12 }, (_, i) => ({ id: 't' + i, label: 'T' + i, laneId: lanes[i % 4].id, duration: 2, ...(i > 3 && { dependsOn: ['t' + (i - 4)] }) }))
    const board = validateWorkshop({ ...launchPlanSample(today), lanes, cards, launch: { day: 40 } })
    const times: number[] = []
    for (let i = 0; i < 60; i++) { const t = performance.now(); launchLayout(board, { width: 1200 }); times.push(performance.now() - t) }
    expect(times.sort((a, b) => a - b)[30]).toBeLessThan(4)
  })
})

describe('the go-live sample', () => {
  it('two tracks, Us and Customer, toward a go-live date', () => {
    const plan = validateWorkshop(goLiveSample(today))
    expect(plan.lanes.map(lane => lane.label)).toEqual(['Us', 'Customer'])
    expect(behaviourLines(plan)).toContain('Go-live is a hard line: every task ends by Fri 18 Dec.')
    expect(refused(plan, [{ kind: 'set_task', card: 'Configure', duration: 14 }])).toBe('Sign-off would run until Mon 21 Dec; go-live is Fri 18 Dec.')
  })
})

describe('the hiring plan with runway', () => {
  it('reads runway from cash, burn, the round and each band from a hire’s first day', () => {
    const plan = hiring()
    expect(runwayMonths(plan)).toBe(15.1)
    expect(runwayMonths({ ...plan, hiring: { ...plan.hiring!, funding: undefined } })).toBeLessThan(10)
    // A later designer saves money: runway grows.
    const later = ok(plan, [{ kind: 'set_task', card: 'Designer', lag: 112 }])
    expect(runwayMonths(later)).toBeGreaterThan(runwayMonths(plan))
  })

  it('a runway floor refuses a hire that takes runway below it, in its sentence', () => {
    const floor = rule(hiring(), { kind: 'deadline', at: 'runway', floor: 15 })
    expect(behaviourLines(floor)).toContain('Runway stays above 15 months.')
    expect(refused(floor, [{ kind: 'set_task', card: 'AE #2', lag: 0 }])).toBe('That takes runway to 14.8 months. Runway stays above 15 months.')
    expect(ok(floor, [{ kind: 'set_task', card: 'AE #2', lag: 70 }]).cards.find(card => card.id === 'ae-2')!.lag).toBe(70)
    expect(legalRuns(floor, 'ae-2', 'lag')[0][0]).toBeGreaterThan(0)
    // Raising a band's cost is a change of money, not a move: the floor still holds against later moves.
    expect(refused(floor, [{ kind: 'set_band_cost', band: 'AE', monthly: 30000 }])).toMatch(/^That takes runway to 1\d\.\d months\. Runway stays above 15 months\.$/)
    expect(refused(floor, [{ kind: 'set_funding', day: 400 }])).toMatch(/^That takes runway to \d+\.\d months\. Runway stays above 15 months\.$/)
    expect(refused(floor, [{ kind: 'add_card', lane: 'Sales', label: 'AE #3' }])).toMatch(/^That takes runway to 14\.\d months\. Runway stays above 15 months\.$/)
  })

  it('a whole-board save keeps the money no edit changes: cash, burn, currency, the round’s size and the bands; a band’s cost and the round’s day still answer to the floor', () => {
    const plan = rule(hiring(), { kind: 'deadline', at: 'runway', floor: 15 })
    const fixed = 'A hiring plan keeps its cash, burn, round and role bands. Say what a band costs, or when the round closes, instead.'
    for (const change of [{ cash: 5000000 }, { burn: 1 }, { currency: '€' }, { weeks: 26 }, { funding: { day: 210, amount: 9000000 } }, { funding: undefined },
      { bands: plan.hiring!.bands.map((band, i) => i ? band : { ...band, label: 'Staff eng' }) }]) {
      expect(checkWorkshopReplacement(plan, { ...plan, hiring: { ...plan.hiring!, ...change } as never })).toBe(fixed)
    }
    const pricier = { ...plan, hiring: { ...plan.hiring!, bands: plan.hiring!.bands.map(band => band.id === 'ae' ? { ...band, monthly: 30000 } : band) } }
    expect(checkWorkshopReplacement(plan, pricier)).toMatch(/^That takes runway to 1\d\.\d months\. Runway stays above 15 months\.$/)
    const cheaper = { ...plan, hiring: { ...plan.hiring!, bands: plan.hiring!.bands.map(band => band.id === 'ae' ? { ...band, monthly: 9000 } : band) } }
    expect(checkWorkshopReplacement(plan, cheaper)).toBeNull()
    expect(checkWorkshopReplacement(plan, { ...plan, hiring: { ...plan.hiring!, funding: { ...plan.hiring!.funding!, day: 400 } } })).toMatch(/Runway stays above 15 months\.$/)
  })

  it('cost is per role band, never per person: a salary on a hire does not pass', () => {
    const plan = hiring()
    for (const key of ['salary', 'amount', 'monthly', 'cost']) {
      expect(() => validateWorkshop({ ...plan, cards: plan.cards.map((card, i) => i ? card : { ...card, [key]: 180000 }) })).toThrow('Cost is per role band, never per person. Say what the band costs instead.')
    }
    expect(refused(plan, [{ kind: 'add_card', lane: 'Sales', label: 'AE #3', amount: 9000 }])).toBe('Only a launch plan\'s tasks take days and wait on each other.'.replace('Only a launch plan\'s tasks take days and wait on each other.', 'Only a pipeline\'s deals and a budget\'s line items carry an amount.'))
  })

  it('bands, the round, a new hire, and a hire moved to a month', () => {
    const plan = hiring()
    const pricier = ok(plan, [{ kind: 'set_band_cost', band: 'Senior eng', monthly: 16000 }])
    expect(pricier.hiring!.bands[0].monthly).toBe(16000)
    expect(runwayMonths(pricier)).toBeLessThan(runwayMonths(plan))
    const june = dayFromWords(plan.clock!.origin, 'June')!
    const result = applyWorkshopEdits(plan, [{ kind: 'set_funding', day: june }], tim)
    // An earlier round changes nothing while cash lasts; a round that slips past it cuts runway to the cash alone.
    expect('workshop' in result && result.report.edits[0].said).toBe('The round now closes Tue 1 Jun. Runway with these hires: 15.1 months.')
    const slips = ok(plan, [{ kind: 'set_funding', day: dayFromWords(plan.clock!.origin, 'November')! }])
    expect(runwayMonths(slips)).toBeLessThan(10)
    expect(refused(rule(plan, { kind: 'deadline', at: 'runway', floor: 15 }), [{ kind: 'set_funding', day: dayFromWords(plan.clock!.origin, 'November')! }]))
      .toMatch(/^That takes runway to \d\.\d months\. Runway stays above 15 months\.$/)
    const added = ok(plan, [{ kind: 'add_card', lane: 'Sales', label: 'Sales AE', lag: hireLagFor(plan, 'ae-1', 210) }])
    expect(added.cards.at(-1)).toMatchObject({ label: 'Sales AE', band: 'ae', duration: 42 })
    const may = dayFromWords(plan.clock!.origin, 'May')!
    const moved = ok(plan, [{ kind: 'set_task', card: 'Designer', lag: hireLagFor(plan, 'designer', may) }])
    expect(scheduleLaunch(moved).get('designer')!.to).toBeGreaterThanOrEqual(may)
    expect(scheduleLaunch(moved).get('designer')!.to - may).toBeLessThan(7)
    expect(refused(plan, [{ kind: 'set_launch_day', day: 30 }])).toMatch(/^Only a launch plan/)
  })

  it('on a phone it is read-only: no grips, and a held hire stays where it is', () => {
    const plan = hiring()
    const narrow = { narrow: true, width: 358 }
    expect(launchLayout(plan, narrow).parts.some(part => part.name.startsWith('handle-'))).toBe(false)
    const choose = launchPlanKit.chooser(plan, 'designer', { x: 4, y: 4 }, narrow)!
    expect(choose({ x: 300, y: 200 })).toBe(plan)
    expect(launchPlanKit.handleDrag(plan, 'handle-designer', { x: 4, y: 4 }, narrow)).toBeNull()
    // On a laptop the round has a grip.
    expect(launchLayout(plan, { width: 1200 }).parts.some(part => part.name === 'handle-funding')).toBe(true)
  })
})

describe('the library lists the plans', () => {
  it('each plan entry builds a valid board from its sample, and its loop caption is a line of its note', () => {
    for (const id of ['launch-plan', 'customer-go-live', 'hiring-plan']) {
      const entry = catalog.find(item => item.id === id)!
      const board = validateWorkshop(catalogPreset(id, undefined, catalogSamples))
      expect(behaviourLines(board)).toContain(entry.loop.caption)
      expect(entry.rules.length).toBeGreaterThan(1)
      expect(entry.moves[0].rule).toBeDefined()
    }
    expect(catalog.find(item => item.id === 'hiring-plan')!.build).toEqual({ kind: 'hiring-plan', sample: 'hiring-plan' })
  })
})
