import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, behaviourNote, checkWorkshopReplacement, describeWorkshopEdits, validateWorkshop, workshopCandidate, workshopCardAsNote, workshopDestinations, workshopLaneCaption,
  workshopNoteCandidate, workshopNoteRefusal, workshopRefusal, workshopToSlate, workshopNodeIds,
  type Workshop, type WorkshopEdit, type WorkshopEditResult,
} from '../../src/workshops/model'
import { samplePipeline } from '../../src/workshops/rules'
import { behaviourDiff, behaviourLines, behaviourOf, checkBehaviour, checkWorkshopMove } from '../../src/workshops/behaviour'

// The rulebook (dragology final.md §4, D1): behaviour as data on lane boards and the pipeline.
// One check(before, after) decides every surface: a drag's candidates, the edit reducer, a whole-board
// save and exec's check_move. Sentences are generated from the rule, never stored.

const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const no = (result: WorkshopEditResult) => {
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-21T10:00:00.000Z' }
const apply = (board: Workshop, ...edits: WorkshopEdit[]) => applyWorkshopEdits(board, edits, tim)

const team = validateWorkshop({
  version: 1, title: 'Team board',
  lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' }, { id: 'wont', label: "Won't do" }],
  cards: [
    { id: 'billing', label: 'Billing', laneId: 'todo' }, { id: 'search', label: 'Search', laneId: 'doing' },
    { id: 'export', label: 'Export', laneId: 'review' }, { id: 'auth', label: 'Auth', laneId: 'review' },
    { id: 'docs', label: 'Docs', laneId: 'review' },
  ],
})
const pipeline = validateWorkshop(samplePipeline())

describe('behaviour as data', () => {
  it('stores rules on the board, validated by the one gate, with a revision', () => {
    const next = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    const behaviour = behaviourOf(next)
    expect(behaviour.rev).toBe(1)
    expect(behaviour.rules).toEqual([{ id: 'rule-1', kind: 'capacity', where: 'review', max: 2, on: true, severity: 'refuse',
      set: { by: 'Tim', at: '2026-11-21T10:00:00.000Z', via: 'chat' } }])
    expect(validateWorkshop(JSON.parse(JSON.stringify(next)))).toEqual(next)
    expect(() => validateWorkshop({ ...next, behaviour: { version: 2, rev: 0, rules: [] } })).toThrow('Unsupported behaviour version.')
    expect(() => validateWorkshop({ ...next, behaviour: { ...next.behaviour, rules: [{ ...next.behaviour!.rules[0], kind: 'teleport' }] } }))
      .toThrow('This board does not know the rule teleport.')
  })

  it('never moves what is already there: a new limit shows 3 of 2 and refuses only the next arrival', () => {
    const next = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    expect(next.cards.filter(card => card.laneId === 'review')).toHaveLength(3)
    expect(workshopLaneCaption(next, 'review')).toBe('3 / 2')
    expect(workshopCandidate(next, 'search', 'review')).toBeNull()
    expect(workshopRefusal(next, 'search', 'review')).toBe('Review holds 2. It has 3.')
    // Leaving the full lane is always fine.
    expect(workshopCandidate(next, 'export', 'done')).not.toBeNull()
  })

  it('names exactly one rule per refusal, in a fixed priority (path, gate, capacity)', () => {
    let next = ok(apply(team,
      { kind: 'add_rule', rule: { kind: 'capacity', where: 'Done', max: 1 } },
      { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Review'] } }))
    next = ok(apply(next, { kind: 'move_card', card: 'Export', lane: 'Done' }))
    const verdict = checkWorkshopMove(next, 'Search', 'Done')
    // Refused, and a person may confirm it anyway ("Move anyway", workshop-override.test.ts).
    expect(verdict).toEqual({ refused: { sentence: 'From Doing, cards go only to Review.', ruleId: 'rule-2', nearest: 'Review', overridable: true,
      set: { by: 'Tim', at: '2026-11-21T10:00:00.000Z', via: 'chat' } } })
    expect(checkWorkshopMove(next, 'Billing', 'Done')).toMatchObject({ refused: { sentence: 'Done holds 1. It has 1.', ruleId: 'rule-1' } })
    expect(checkWorkshopMove(next, 'Search', 'Review')).toEqual({ ok: true, warnings: [] })
  })

  it('moves one lane at a time when told to, and a bin takes any card whatever the other rules say', () => {
    const next = ok(apply(team,
      { kind: 'add_rule', rule: { kind: 'path', from: 'any', noSkip: true } },
      { kind: 'add_rule', rule: { kind: 'bin', lane: "Won't do" } }))
    expect(workshopDestinations(next, 'billing').map(lane => lane.id)).toEqual(['todo', 'doing', 'wont'])
    expect(workshopRefusal(next, 'billing', 'review')).toBe('Cards move one column at a time. Billing is in To do, so Doing comes first.')
    expect(behaviourLines(next)).toEqual(['Cards move one column at a time.', "Won't do archives cards: they stay on the board, never deleted."])
  })

  it('warns instead of refusing when the rule says so: the drop lands, with the sentence', () => {
    const next = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2, severity: 'warn' } }))
    expect(workshopCandidate(next, 'search', 'review')).not.toBeNull()
    expect(checkWorkshopMove(next, 'Search', 'Review')).toEqual({ ok: true, warnings: ['Review holds 2. It has 3.'] })
    expect(behaviourLines(next)).toEqual(['Review holds 2 (a warning only).'])
  })

  it('a gate asks for a field the board has (a pipeline’s amount), never for words on the card', () => {
    const lanesGate = no(apply(team, { kind: 'add_rule', rule: { kind: 'gate', into: 'Done', needs: ['amount'] } }))
    expect(lanesGate.reason).toBe('Cards on this board carry no amount, so a column can’t ask for one.')
    expect(no(apply(team, { kind: 'add_rule', rule: { kind: 'gate', into: 'Done', needs: ['label'] } } as WorkshopEdit)).reason)
      .toBe('A rule reads a card’s fields, never its words.')
    const gated = ok(apply(pipeline, { kind: 'add_rule', rule: { kind: 'gate', into: 'Qualified', needs: ['amount'] } }))
    const fresh = ok(apply(gated, { kind: 'add_card', lane: 'Lead', label: 'Initech' }))
    expect(workshopRefusal(fresh, fresh.cards.at(-1)!.id, 'qualified')).toBe('Qualified needs an amount. Initech has none.')
    expect(workshopRefusal(fresh, 'globex', 'qualified')).toBeNull()
  })

  it('rules move capacity off the lane for lane boards and the pipeline, and keep the pipeline’s own rules', () => {
    const next = ok(apply(pipeline, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Qualified', max: 1 } }))
    expect(workshopRefusal(next, 'northwind', 'qualified')).toBe('Qualified holds 1. It has 1.')
    // The pipeline's own one-stage-at-a-time rule still answers first, in its own words.
    expect(workshopRefusal(next, 'northwind', 'won')).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
    expect(behaviourLines(next)).toEqual(['Deals move one stage at a time.', 'A won deal needs an amount.', 'Proposal holds 3.', 'Qualified holds 1.'])
  })

  it('refuses contradictions at edit time, with a sentence', () => {
    const capped = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    expect(no(apply(capped, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 3 } })).reason)
      .toBe('Review already has a limit. Change it instead.')
    expect(no(apply(team, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Doing'] } })).reason)
      .toBe('A path leads to another column.')
    const binned = ok(apply(team, { kind: 'add_rule', rule: { kind: 'bin', lane: "Won't do" } }))
    expect(no(apply(binned, { kind: 'add_rule', rule: { kind: 'capacity', where: "Won't do", max: 2 } })).reason)
      .toBe("Won't do archives cards, so it takes every card.")
    let many = team
    for (let i = 0; i < 4; i++) many = ok(apply(many, { kind: 'add_rule', rule: { kind: 'capacity', where: team.lanes[i].label, max: 9 } }))
    expect(behaviourOf(many).rules).toHaveLength(4)
    expect(() => validateWorkshop({ ...many, behaviour: { ...many.behaviour, rules: Array.from({ length: 13 }, (_, i) => ({ ...many.behaviour!.rules[0], id: 'r' + i })) } }))
      .toThrow('A board has up to 12 rules.')
    const map = validateWorkshop({ version: 1, title: 'Map', lanes: [
      { id: 'a', label: 'A', station: { column: 0, row: 0, next: ['b'], outcome: 'A' } },
      { id: 'b', label: 'B', station: { column: 1, row: 0, next: [], outcome: 'B' } }], cards: [{ id: 't', label: 'T', laneId: 'a' }] })
    expect(no(apply(map, { kind: 'add_rule', rule: { kind: 'bin', lane: 'B' } })).code).toBe('not_on_this_board')
  })

  it('set_rule and remove_rule change one rule, bump the revision and keep the audit line', () => {
    const one = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    const raised = ok(applyWorkshopEdits(one, [{ kind: 'set_rule', rule: 'rule-1', max: 3 }], { actor: { by: 'Ana', via: 'exec' }, now: '2026-11-22T09:00:00.000Z' }))
    expect(behaviourOf(raised).rev).toBe(2)
    expect(behaviourOf(raised).rules[0]).toMatchObject({ max: 3, set: { by: 'Ana', via: 'exec', at: '2026-11-22T09:00:00.000Z' } })
    const off = ok(apply(raised, { kind: 'set_rule', rule: 'rule-1', on: false }))
    expect(workshopCandidate(off, 'search', 'review')).not.toBeNull()
    expect(behaviourLines(off)).toEqual([])
    const gone = ok(apply(off, { kind: 'remove_rule', rule: 'rule-1' }))
    expect(behaviourOf(gone)).toMatchObject({ rev: 4, rules: [] })
    expect(no(apply(gone, { kind: 'remove_rule', rule: 'rule-9' })).code).toBe('unknown_reference')
    // Removing a lane takes the rules that named it.
    const emptied = ok(apply(one, { kind: 'move_card', card: 'Export', lane: 'Done' }, { kind: 'move_card', card: 'Auth', lane: 'Done' },
      { kind: 'move_card', card: 'Docs', lane: 'Done' }, { kind: 'remove_lane', lane: 'Review' }))
    expect(behaviourOf(emptied).rules).toEqual([])
  })

  it('says a rule edit as a diff, with what already breaks the new rules', () => {
    const one = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 3 } }))
    const two = ok(apply(one, { kind: 'set_rule', rule: 'rule-1', max: 2 }, { kind: 'add_rule', rule: { kind: 'bin', lane: "Won't do" } }))
    expect(behaviourDiff(one, two)).toEqual({ from: 1, to: 3, lines: ['~ Review holds 3. → Review holds 2.', "+ Won't do archives cards: they stay on the board, never deleted."],
      over: ['Review shows 3 of 2.'] })
    expect(behaviourDiff(team, team)).toEqual({ from: 0, to: 0, lines: [], over: [] })
  })

  it('checks every surface with the same verdict: the reducer, a whole-board save and a note dropped on a lane', () => {
    const next = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    expect(no(apply(next, { kind: 'move_card', card: 'Search', lane: 'Review' })).reason).toBe('Review holds 2. It has 3.')
    expect(no(apply(next, { kind: 'add_card', lane: 'Review', label: 'Copy' })).reason).toBe('Review holds 2. It has 3.')
    const moved = { ...next, cards: next.cards.map(card => card.id === 'search' ? { ...card, laneId: 'review' } : card) }
    expect(checkWorkshopReplacement(next, moved)).toBe('Review holds 2. It has 3.')
    expect(checkBehaviour(next, moved)).toMatchObject({ refused: { sentence: 'Review holds 2. It has 3.', ruleId: 'rule-1' } })
    expect(workshopNoteRefusal(next, 'review', { id: 'n1', label: 'Copy' })).toBe('Review holds 2. It has 3.')
    expect(workshopNoteCandidate(next, 'review', { id: 'n1', label: 'Copy' })).toBeNull()
    expect(workshopNoteCandidate(next, 'done', { id: 'n1', label: 'Copy' })).not.toBeNull()
  })

  it('a card dragged off the board becomes a note under every rule set', () => {
    const next = ok(apply(team,
      { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 1 } },
      { kind: 'add_rule', rule: { kind: 'path', from: 'any', noSkip: true } },
      { kind: 'add_rule', rule: { kind: 'bin', lane: "Won't do" } }))
    for (const card of next.cards) expect(workshopCardAsNote(next, card.id)).not.toBeNull()
  })

  // Restated for board polish (decided behaviour changed): a board's rules are its chrome (a legend above it,
  // boardLegend), never a "How this board behaves" note on the canvas. The note's sentences stay for a host to show.
  it('draws no “How this board behaves” note; behaviourNote still says the sentences', () => {
    const next = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }, { kind: 'add_rule', rule: { kind: 'bin', lane: "Won't do" } }))
    expect(workshopToSlate(next, { native: true }).nodes.some(node => node.options.id === workshopNodeIds.rules)).toBe(false)
    expect(behaviourNote(next, { x: 0, y: 0, width: 240 })!.options.text).toBe(['How this board behaves', ...behaviourLines(next)].join('\n'))
    // A board without a rulebook has no sentences.
    expect(behaviourNote(team, { x: 0, y: 0, width: 240 })).toBeNull()
  })

  it('publishes the rule edits in the edit table for lane boards and the pipeline only', () => {
    const lanes = describeWorkshopEdits(team).filter(entry => /_rule$/.test(entry.kind))
    expect(lanes.map(entry => [entry.kind, entry.accepted])).toEqual([['add_rule', true], ['set_rule', true], ['remove_rule', true]])
    expect(describeWorkshopEdits(pipeline).find(entry => entry.kind === 'add_rule')!.accepted).toBe(true)
    expect(lanes[0].schema).toMatchObject({ required: ['kind', 'rule'] })
  })
})
