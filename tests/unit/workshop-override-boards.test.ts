import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, checkWorkshopReplacement, validateWorkshop, workshopCandidate, workshopCardText, workshopHardLimit, workshopOverrideCandidate,
  workshopRefusal, workshopStampOverrides,
  type Workshop, type WorkshopEdit, type WorkshopEditResult,
} from '../../src/workshops/model'
import {
  budgetCaption, budgetOver, checkNestMove, pipelineCaption, pipelineForecast, pipelineStageOver, sampleBudget, samplePipeline, runwayMonths, hiringPlanSample, pastTheLine,
} from '../../src/workshops/rules'
import { brokenWaits, launchFinish, scheduleLaunch } from '../../src/workshops/schedule'
import { discoveryTreeSample } from '../../src/workshops/samples'
import { sampleLaunchPlan, launchPlanSample, presetRules } from '../../src/workshops/launchPlan'
import { checkWorkshopMove } from '../../src/workshops/behaviour'

// Moving a card anyway on every smart component (owner, 2026-11-23: "dropping the card where it shouldn't go should be
// possible with a confirmation ... standard in the smart components"). What an override means on each board, so the
// numbers it computes stay true: a pipeline's forecast and stage limits, a budget's money, a plan's critical path,
// line and runway, a nested board's piles. Hard limits stay refused.

const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const no = (result: WorkshopEditResult) => {
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const sam = { by: 'Sam', at: '2026-11-23T09:30:00.000Z' }
const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-23T10:00:00.000Z' }
const apply = (board: Workshop, ...edits: WorkshopEdit[]) => applyWorkshopEdits(board, edits, tim)
const card = (board: Workshop, id: string) => board.cards.find(item => item.id === id)!

describe('moving a card anyway on a sales pipeline', () => {
  const pipeline = validateWorkshop(samplePipeline())

  it('skips a stage: the forecast counts the deal where it is, marked with who and when; Undo is one step', () => {
    // Northwind is a Lead: Proposal is two stages on, and full (3 of 3).
    const sentence = workshopRefusal(pipeline, 'northwind', 'proposal')!
    // Every rule it breaks is named: the dialog asks about both, and the mark keeps both.
    expect(sentence).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first. Proposal already holds 3 of 3 deals.')
    expect(workshopHardLimit(pipeline, 'northwind', 'proposal')).toBeNull()
    expect(checkWorkshopMove(pipeline, 'northwind', 'proposal')).toMatchObject({ refused: { sentence, overridable: true } })
    const moved = workshopOverrideCandidate(pipeline, 'northwind', 'proposal', sam)!
    expect(card(moved, 'northwind')).toMatchObject({ laneId: 'proposal', override: { by: 'Sam', at: sam.at, sentence, from: 'lead' } })
    // 40k at 10% became 40k at 60%: the forecast is worked out again.
    expect(pipelineForecast(moved) - pipelineForecast(pipeline)).toBe(40000 * 0.6 - 40000 * 0.1)
    // The stage is now past its limit of 3, and says so (drawn in red).
    expect(pipelineStageOver(moved, 'proposal')).toBe(true)
    expect(pipelineCaption(moved, 'proposal')).toMatch(/4 deals · .* · 60% · over its limit of 3$/)
    expect(workshopCardText(moved, card(moved, 'northwind'))).toBe('Northwind\n$40k\nMoved anyway by Sam · 23 Nov')
    // Undo: back to Lead is an ordinary move, and it takes the mark with it.
    const back = workshopCandidate(moved, 'northwind', 'lead')!
    expect(card(back, 'northwind').override).toBeUndefined()
    expect(pipelineForecast(back)).toBe(pipelineForecast(pipeline))
    expect(checkWorkshopReplacement(moved, pipeline)).toBeNull()
  })

  it('takes move_card override over exec and chat, stamped by the actor; a refusal says overridable', () => {
    const refused = no(apply(pipeline, { kind: 'move_card', card: 'Northwind', lane: 'Proposal' }))
    expect(refused).toMatchObject({ code: 'refused', overridable: true })
    const made = ok(apply(pipeline, { kind: 'move_card', card: 'Northwind', lane: 'Proposal', override: true }))
    expect(card(made, 'northwind').override).toMatchObject({ by: 'Tim', at: tim.now, from: 'lead' })
    // A won deal reopened anyway; a lost deal won anyway (it has an amount).
    expect(card(ok(apply(pipeline, { kind: 'move_card', card: 'Bluefin', lane: 'Lead', override: true })), 'bluefin').laneId).toBe('lead')
  })

  it('keeps its hard limit: a deal with no amount is never won, even anyway (the forecast could not count it)', () => {
    const unpriced = validateWorkshop({ ...pipeline, cards: [...pipeline.cards, { id: 'nova', label: 'Nova', laneId: 'proposal' }].filter(item => item.id !== 'harbor') })
    expect(workshopOverrideCandidate(unpriced, 'nova', 'won', sam)).toBeNull()
    expect(workshopHardLimit(unpriced, 'nova', 'won')).toBe('Nova needs an amount before it can be won. Write it on the card, like \'Nova $40k\'.')
    expect(checkWorkshopMove(unpriced, 'nova', 'won')).toMatchObject({ refused: { overridable: false } })
    expect(no(apply(unpriced, { kind: 'move_card', card: 'Nova', lane: 'Won', override: true })).overridable).toBeUndefined()
  })
})

describe('moving a card anyway on a budget', () => {
  const budget = validateWorkshop(sampleBudget())

  it('goes over a team’s money: the team says by how much, in red, until money moves to it or the item leaves', () => {
    // Design has 150k and commits 120k (30k left); Launch ads cost 150k.
    const sentence = workshopRefusal(budget, 'ads', 'design')!
    expect(sentence).toBe('Design has $30k left. Launch ads costs $150k.')
    const moved = workshopOverrideCandidate(budget, 'ads', 'design', sam)!
    expect(card(moved, 'ads')).toMatchObject({ laneId: 'design', override: { by: 'Sam', sentence, from: 'marketing' } })
    expect(budgetOver(moved, 'design')).toBe(120000)
    expect(budgetCaption(moved, 'design')).toBe('$150k · $270k committed · over budget by $120k')
    // The envelope still adds up; the over team gives no money away, and may take some.
    const fix = ok(apply(moved, { kind: 'shift_budget', from: 'Sales', to: 'Design', amount: 50000 }))
    expect(budgetOver(fix, 'design')).toBe(70000)
    expect(no(apply(moved, { kind: 'shift_budget', from: 'Design', to: 'Sales', amount: 5000 })).reason).toMatch(/Design/)
    // A new item can't join a team that is over.
    expect(no(apply(moved, { kind: 'add_card', lane: 'Design', label: 'Survey', amount: 5000 })).reason).toBe('Design is over budget by $120k. Survey costs $5k.')
    // Undo: the item goes back; Design is in budget again and the mark is gone.
    const back = workshopCandidate(moved, 'ads', 'marketing')!
    expect(budgetOver(back, 'design')).toBe(0)
    expect(card(back, 'ads').override).toBeUndefined()
  })

  it('is refused without override, overridable, and check_move says so', () => {
    expect(no(apply(budget, { kind: 'move_card', card: 'Launch ads', lane: 'Design' }))).toMatchObject({ overridable: true })
    expect(checkWorkshopMove(budget, 'ads', 'design')).toMatchObject({ refused: { overridable: true } })
  })
})

describe('moving a task anyway on a launch plan', () => {
  // Design (4) → Build (6) → QA (2) ends day 12; launch is day 14, a hard line (no rules: the built-in line).
  const plan = validateWorkshop(sampleLaunchPlan())

  it('past its dependency: it starts before what it waits on ends, the line between them is broken, the critical path is worked out again', () => {
    // Build may not start before Design ends.
    const refusal = no(apply(plan, { kind: 'set_task', card: 'Build', lag: -2 }))
    expect(refusal).toMatchObject({ code: 'refused', overridable: true, reason: 'Build waits on Design: it starts day 4 at the earliest.' })
    const made = applyWorkshopEdits(plan, [{ kind: 'set_task', card: 'Build', lag: -2, override: true }], tim)
    const moved = ok(made)
    expect(card(moved, 'build')).toMatchObject({ lag: -2, override: { by: 'Tim', sentence: 'Build waits on Design: it starts day 4 at the earliest.', from: 'engineering', was: { lag: 0, duration: 6 } } })
    expect(scheduleLaunch(moved).get('build')).toMatchObject({ start: 2, end: 8 })
    // QA follows Build: the finish comes in two days, and Copy's slack shrinks with it (the critical path, worked out again).
    expect(launchFinish(plan)).toBe(12)
    expect(launchFinish(moved)).toBe(10)
    expect(scheduleLaunch(plan).get('copy')!.slack).toBe(10)
    expect(scheduleLaunch(moved).get('copy')!.slack).toBe(8)
    expect(['design', 'build', 'qa'].every(id => scheduleLaunch(moved).get(id)!.critical)).toBe(true)
    // The line from Design to Build is drawn broken, in red.
    expect(brokenWaits(moved)).toEqual([{ from: 'design', to: 'build' }])
    expect(brokenWaits(plan)).toEqual([])
    expect('refused' in made ? '' : made.report.edits[0].said).toMatch(/^Moved “Build” anyway: it runs day 2 to day 7\. Build waits on Design/)
    // Undo: the whole board put back passes the plan's rules.
    expect(checkWorkshopReplacement(moved, plan)).toBeNull()
    // An ordinary move back takes the mark with it.
    expect(card(ok(apply(moved, { kind: 'set_task', card: 'Build', lag: 0 })), 'build').override).toBeUndefined()
  })

  it('never before the plan’s first day, and a task’s days stay in their range (hard limits)', () => {
    expect(no(apply(plan, { kind: 'set_task', card: 'Build', lag: -5, override: true })).reason).toBe('Build can’t start before the plan’s first day.')
    expect(no(apply(plan, { kind: 'set_task', card: 'Build', duration: 61, override: true })).reason).toBe('A task takes 1 to 60 days.')
    expect(no(apply(plan, { kind: 'set_task', card: 'Design', lag: -1 })).overridable).toBeUndefined()
  })

  it('past the hard line: the late task is drawn in red, and the plan can still be worked on', () => {
    const refusal = no(apply(plan, { kind: 'set_task', card: 'QA', duration: 5 }))
    expect(refusal).toMatchObject({ overridable: true })
    const late = ok(apply(plan, { kind: 'set_task', card: 'QA', duration: 5, override: true }))
    expect(launchFinish(late)).toBe(15)
    expect([...pastTheLine(late)]).toEqual(['qa'])
    expect(card(late, 'qa').override).toMatchObject({ sentence: refusal.reason, was: { lag: 0, duration: 2 } })
    // Copy can still move, as long as it does not run late itself.
    expect(scheduleLaunch(ok(apply(late, { kind: 'set_task', card: 'Copy', lag: 3 }))).get('copy')!.start).toBe(3)
    expect(no(apply(late, { kind: 'set_task', card: 'Copy', lag: 13 })).overridable).toBe(true)
  })

  it('past a rule of its rulebook (a lock): moved, marked, and the rule is not asked again of that move', () => {
    const ruled = validateWorkshop({ ...launchPlanSample('2026-11-23'), behaviour: presetRules([{ kind: 'deadline', at: 'launch' }, { kind: 'locked', cards: ['copy'] }]) })
    const refused = no(apply(ruled, { kind: 'set_task', card: 'Copy', lag: 2 }))
    expect(refused).toMatchObject({ overridable: true, reason: expect.stringMatching(/^Copy is locked/) })
    const moved = ok(apply(ruled, { kind: 'set_task', card: 'Copy', lag: 2, override: true }))
    expect(card(moved, 'copy')).toMatchObject({ lag: 2, override: { by: 'Tim', sentence: refused.reason } })
    // Its team changed anyway too: the lock refuses, the move is overridable.
    expect(checkWorkshopMove(ruled, 'copy', 'marketing')).toMatchObject({ refused: { overridable: true } })
    expect(card(workshopOverrideCandidate(ruled, 'copy', 'marketing', sam)!, 'copy')).toMatchObject({ laneId: 'marketing', override: { from: 'product' } })
  })

  it('stamps a whole plan saved over the stored one: the saver marks a task moved in time past a rule', () => {
    const page = { ...plan, cards: plan.cards.map(item => item.id === 'build' ? { ...item, lag: -2, override: { by: 'Mallory', at: '2020-01-01T00:00:00.000Z', sentence: 'x', from: 'engineering', was: { lag: 0 } } } : item) }
    const stamped = workshopStampOverrides(plan, page, sam)
    expect(card(stamped, 'build').override).toEqual({ by: 'Sam', at: sam.at, sentence: 'Build waits on Design: it starts day 4 at the earliest.', from: 'engineering', was: { lag: 0, duration: 6 } })
    // A mark on a move no rule refused is dropped.
    const legal = { ...plan, cards: plan.cards.map(item => item.id === 'copy' ? { ...item, lag: 2, override: { by: 'X', at: sam.at, sentence: 'x', from: 'product', was: { lag: 0 } } } : item) }
    expect(card(workshopStampOverrides(plan, legal, sam), 'copy').override).toBeUndefined()
  })
})

describe('moving a hire anyway on a hiring plan', () => {
  const plan = validateWorkshop({ ...hiringPlanSample('2026-11-23'), behaviour: presetRules([{ kind: 'snap', unit: 'week' }, { kind: 'deadline', at: 'runway', floor: 15.1 }, { kind: 'locked', cards: ['ae-2'] }]) })

  it('past the runway floor: the runway is worked out again with the hire where it is', () => {
    // Bring the designer forward: more months paid, less runway.
    const refused = no(apply(plan, { kind: 'set_task', card: 'Designer', lag: 0 }))
    expect(refused).toMatchObject({ overridable: true, reason: expect.stringMatching(/^That takes runway to .*Runway stays above 15.1 months\.$/) })
    const moved = ok(apply(plan, { kind: 'set_task', card: 'Designer', lag: 0, override: true }))
    expect(runwayMonths(moved)).toBeLessThan(runwayMonths(plan))
    expect(runwayMonths(moved)).toBeLessThan(15.1)
    expect(card(moved, 'designer').override).toMatchObject({ by: 'Tim', was: { lag: 56, duration: 42 } })
  })

  it('into another team past a lock: moved, marked, the runway counts it', () => {
    expect(checkWorkshopMove(plan, 'ae-2', 'engineering')).toMatchObject({ refused: { overridable: true } })
    const moved = ok(apply(plan, { kind: 'move_card', card: 'AE #2', lane: 'Engineering', override: true }))
    expect(card(moved, 'ae-2')).toMatchObject({ laneId: 'engineering', override: { from: 'sales' } })
    expect(runwayMonths(moved)).toBe(runwayMonths(plan))
  })
})

describe('moving a card anyway on a nested board', () => {
  const tree = validateWorkshop(discoveryTreeSample())

  it('nests a card under a parent the rules forbid: marked, the rule not asked again; Undo puts it back', () => {
    const refused = no(apply(tree, { kind: 'nest_card', card: 'CSV import', under: 'Activation to 40%' }))
    expect(refused).toMatchObject({ reason: 'Solutions sit under an opportunity.', overridable: true })
    expect(checkNestMove(tree, 'CSV import', { under: 'Activation to 40%' })).toMatchObject({ refused: { overridable: true } })
    const made = applyWorkshopEdits(tree, [{ kind: 'nest_card', card: 'CSV import', under: 'Activation to 40%', override: true }], tim)
    const moved = ok(made)
    expect(card(moved, 'csv-import')).toMatchObject({ parentId: 'outcome', override: { by: 'Tim', sentence: 'Solutions sit under an opportunity.', from: 'tree', was: { parentId: 'slow-onboarding' } } })
    expect('refused' in made ? '' : made.report.edits[0].said).toBe('Moved “CSV import” under “Activation to 40%” anyway. Solutions sit under an opportunity.')
    expect(workshopCardText(moved, card(moved, 'csv-import'))).toMatch(/Moved anyway by Tim · 23 Nov$/)
    // Undo: back under its opportunity, an ordinary move, without the mark.
    const back = ok(apply(moved, { kind: 'nest_card', card: 'CSV import', under: 'Onboarding is slow' }))
    expect(card(back, 'csv-import').override).toBeUndefined()
    expect(checkWorkshopReplacement(moved, tree)).toBeNull()
  })

  it('keeps its structure: never under itself or a card under it, never nested in the tray', () => {
    expect(no(apply(tree, { kind: 'nest_card', card: 'Onboarding is slow', under: 'CSV import', override: true })).reason).toBe('A card can’t go under itself or a card under it.')
    expect(checkNestMove(tree, 'Onboarding is slow', { under: 'CSV import' })).toMatchObject({ refused: { overridable: false } })
  })
})

describe('the hard limits that stay', () => {
  it('a release plan and a startup experience are never moved past a rule', () => {
    const release = validateWorkshop({ version: 1, kind: 'release-plan', title: 'Releases',
      lanes: [{ id: 'r1', label: 'R1', capacity: 3 }, { id: 'r2', label: 'R2', capacity: 3 }],
      cards: [{ id: 'a', label: 'A', laneId: 'r1', points: 3 }, { id: 'b', label: 'B', laneId: 'r2', points: 2 }] })
    expect(workshopCandidate(release, 'b', 'r1')).toBeNull()
    expect(workshopOverrideCandidate(release, 'b', 'r1', sam)).toBeNull()
    expect(() => validateWorkshop({ ...release, cards: release.cards.map(item => item.id === 'b' ? { ...item, override: { by: 'x', at: sam.at, sentence: 'x', from: 'r1' } } : item) }))
      .toThrow('A release plan’s and a startup experience’s cards are never moved past a rule.')
  })
})

// Review of 2026-11-23: what a move made anyway leaves behind, and what may happen to the card after.
describe('after a move made anyway', () => {
  it('reports every move made anyway in a list of edits, even when a later edit moves the card on (the exec gate holds it)', () => {
    const pipeline = validateWorkshop(samplePipeline())
    // A won deal stays won: Bluefin to Qualified alone is refused.
    expect(no(apply(pipeline, { kind: 'move_card', card: 'Bluefin', lane: 'Qualified' })).overridable).toBe(true)
    const made = apply(pipeline, { kind: 'move_card', card: 'Bluefin', lane: 'Lead', override: true }, { kind: 'move_card', card: 'Bluefin', lane: 'Qualified' })
    if ('refused' in made) throw new Error(made.refused.reason)
    // The second move took the mark away (Qualified takes a deal from Lead), but the report still names the first.
    expect(made.report.overrides).toEqual([{ index: 0, cardId: 'bluefin', laneId: 'lead', fromLaneId: 'won', sentence: 'A won deal stays won. Move it to Lost if it fell through.' }])
    // An ordinary list reports none.
    const plain = apply(pipeline, { kind: 'move_card', card: 'Northwind', lane: 'Qualified' })
    expect('refused' in plain ? null : plain.report.overrides).toBeUndefined()
  })

  it('a late task moved anyway may still be nudged, or moved to another team: its mark stays while it is still late', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const late = ok(apply(plan, { kind: 'set_task', card: 'QA', duration: 8, override: true }))
    const mark = card(late, 'qa').override
    expect(mark).toMatchObject({ by: 'Tim' })
    // A day shorter, still late: the change is made, and the mark is the same one (who, when, the rule).
    const shorter = ok(applyWorkshopEdits(late, [{ kind: 'set_task', card: 'QA', duration: 6 }], { actor: { by: 'Ann', via: 'chat' }, now: '2026-11-24T08:00:00.000Z' }))
    expect(card(shorter, 'qa')).toMatchObject({ duration: 6, override: mark })
    // To another team, still late: the same.
    const product = ok(apply(late, { kind: 'move_card', card: 'QA', lane: 'Product' }))
    expect(card(product, 'qa')).toMatchObject({ laneId: 'product', override: mark })
    // Back by the line: the mark goes.
    expect(card(ok(apply(late, { kind: 'set_task', card: 'QA', duration: 2 })), 'qa').override).toBeUndefined()
    // Making it later still is refused, and may be made anyway (a new mark).
    expect(no(apply(late, { kind: 'set_task', card: 'QA', duration: 9 })).overridable).toBe(true)
    // A task made longer anyway, then a day shorter but still pushing QA past the line.
    const build = ok(apply(plan, { kind: 'set_task', card: 'Build', duration: 10, override: true }))
    expect(card(ok(apply(build, { kind: 'set_task', card: 'Build', duration: 9 })), 'build').override).toEqual(card(build, 'build').override)
  })

  it('a task that starts before what it waits on ends keeps its mark when it moves to another team', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const early = ok(apply(plan, { kind: 'set_task', card: 'Build', lag: -2, override: true }))
    const moved = ok(apply(early, { kind: 'move_card', card: 'Build', lane: 'Product' }))
    expect(card(moved, 'build')).toMatchObject({ laneId: 'product', lag: -2, override: card(early, 'build').override })
  })

  it('a team over its money may lower an item’s cost, never raise it; its refusals say by how much it is over', () => {
    const budget = validateWorkshop(sampleBudget())
    const over = workshopOverrideCandidate(budget, 'ads', 'design', sam)!
    expect(budgetOver(ok(apply(over, { kind: 'set_amount', card: 'Launch ads', amount: 140000 })), 'design')).toBe(110000)
    expect(budgetOver(ok(apply(over, { kind: 'set_amount', card: 'Research panel', amount: 110000 })), 'design')).toBe(110000)
    expect(no(apply(over, { kind: 'set_amount', card: 'Research panel', amount: 130000 })).reason).toBe('Design is over budget by $120k. Research panel costs $130k.')
  })

  it('a card going back where it came from by an ordinary move is held to the rules as they are now', () => {
    const tree = validateWorkshop(discoveryTreeSample())
    const ruleId = (board: Workshop) => board.behaviour!.rules.find(rule => rule.kind === 'children')!.id
    const tight = ok(apply(tree, { kind: 'remove_rule', rule: ruleId(tree) } as WorkshopEdit, { kind: 'add_rule', rule: { kind: 'children', role: 'opportunity', max: 2 } } as unknown as WorkshopEdit))
    // CSV import nested under the outcome anyway, from Onboarding is slow (which then holds 1 of 2).
    const moved = ok(apply(tight, { kind: 'nest_card', card: 'CSV import', under: 'Activation to 40%', override: true }))
    // A teammate fills Onboarding is slow to its limit.
    const full = ok(apply(moved, { kind: 'nest_card', card: 'Reconcile with finance', under: 'Onboarding is slow' }))
    // Back under it: refused by its limit (and may be made anyway), never let through unmarked.
    expect(no(apply(full, { kind: 'nest_card', card: 'CSV import', under: 'Onboarding is slow' }))).toMatchObject({ overridable: true })
    // With room there, back is an ordinary move and the mark goes.
    expect(card(ok(apply(moved, { kind: 'nest_card', card: 'CSV import', under: 'Onboarding is slow' })), 'csv-import').override).toBeUndefined()
  })

  it('a task moved anyway names every rule the move breaks, for what waits on it too', () => {
    const ruled = validateWorkshop({ ...launchPlanSample('2026-11-23'), behaviour: presetRules([{ kind: 'deadline', at: 'launch' }, { kind: 'locked', cards: ['qa'] }]) })
    // Build three weeks later: QA, which waits on it, leaves its locked days and runs past launch.
    const refused = no(apply(ruled, { kind: 'set_task', card: 'Build', lag: 15 }))
    expect(refused.overridable).toBe(true)
    expect(refused.reason).toMatch(/^QA is locked: it stays on .*\. QA would run until .*; launch is .*\.$/)
    const moved = ok(apply(ruled, { kind: 'set_task', card: 'Build', lag: 15, override: true }))
    // The person agreed to the sentence the mark keeps.
    expect(card(moved, 'build').override!.sentence).toBe(refused.reason)
  })

  it('a whole plan saved with a task moved to another team and in time keeps its mark', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const page = { ...plan, cards: plan.cards.map(item => item.id === 'build' ? { ...item, laneId: 'product', lag: -2, override: { by: 'X', at: sam.at, sentence: 'x', from: 'engineering', was: { lag: 0 } } } : item) }
    expect(card(workshopStampOverrides(plan, page, sam), 'build')).toMatchObject({ laneId: 'product', lag: -2, override: { by: 'Sam', from: 'engineering' } })
  })
})

describe('what a board shows of a move made anyway', () => {
  it('a budget says a team is over in its header, on a caption line of its own, with room for the mark', async () => {
    const { budgetHeader } = await import('../../src/boards/readouts')
    const { budgetLayout } = await import('../../src/boards/budgetKit')
    const budget = validateWorkshop(sampleBudget())
    const over = workshopOverrideCandidate(budget, 'ads', 'design', sam)!
    expect(budgetHeader(budget)).toBe('$1.2M · balanced')
    expect(budgetHeader(over)).toBe('$1.2M · 1 team over budget')
    for (const narrow of [false, true]) {
      const parts = budgetLayout(over, { narrow, width: 390 }).parts
      const caption = parts.find(part => part.name === 'caption-design')!
      expect(caption.text).toMatch(/\nover budget by \$120k$/)
      const ads = parts.find(part => part.name === 'card-ads')!, panel = parts.find(part => part.name === 'card-panel')!
      // The marked item is a line taller than an unmarked one, and nothing overlaps.
      expect(ads.height).toBe(panel.height + 18)
      expect(ads.y >= panel.y + panel.height || panel.y >= ads.y + ads.height).toBe(true)
      expect(Math.min(ads.y, panel.y)).toBeGreaterThanOrEqual(caption.y + caption.height)
    }
  })

  it('a pipeline says a stage is over its limit on a caption line of its own', async () => {
    const { pipelineLayout } = await import('../../src/boards/pipelineKit')
    const moved = workshopOverrideCandidate(validateWorkshop(samplePipeline()), 'northwind', 'proposal', sam)!
    expect(pipelineLayout(moved).parts.find(part => part.name === 'caption-proposal')!.text).toMatch(/· 60%\nover its limit of 3$/)
  })

  it('a hiring plan’s dialog names the day the hire starts work, as its bar says it', async () => {
    const { taskWords } = await import('../../src/boards/launchPlanKit')
    const { hireStarts } = await import('../../src/workshops/hiringPlan')
    const { dayWords, withTaskValue } = await import('../../src/workshops/launchPlan')
    const plan = validateWorkshop(hiringPlanSample('2026-11-23'))
    const words = taskWords(plan, { kind: 'set_task', card: { id: 'eng-2' }, lag: 0 })!
    const next = withTaskValue(plan, { cardId: 'eng-2', field: 'lag' }, 0)
    expect(words).toBe('to start work ' + dayWords(next, hireStarts(next, 'eng-2')) + ' (recruiting from ' + dayWords(next, scheduleLaunch(next).get('eng-2')!.from) + ')')
  })

  it('a hard line spans to a task moved past it anyway, so its bar stays on the board', async () => {
    const { launchLayout } = await import('../../src/boards/launchPlanKit')
    const plan = validateWorkshop(sampleLaunchPlan())
    const late = ok(apply(plan, { kind: 'set_task', card: 'QA', duration: 8, override: true }))
    const g = launchLayout(late)
    const qa = g.bars.get('qa')!
    expect(qa.x + qa.width).toBeLessThanOrEqual(g.width)
  })
})

describe('a pipeline stage over its limit', () => {
  it('makes room for its caption line: no deal lies over it', async () => {
    const { pipelineLayout } = await import('../../src/boards/pipelineKit')
    const moved = workshopOverrideCandidate(validateWorkshop(samplePipeline()), 'northwind', 'proposal', sam)!
    const parts = pipelineLayout(moved).parts
    const caption = parts.find(part => part.name === 'caption-proposal')!
    const first = parts.filter(part => part.name.startsWith('card-') && part.x === caption.x).sort((a, b) => a.y - b.y)[0]
    expect(caption.height).toBeGreaterThanOrEqual(72)
    expect(first.y).toBeGreaterThanOrEqual(caption.y + caption.height)
  })
})
