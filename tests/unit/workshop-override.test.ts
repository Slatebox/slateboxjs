import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, checkWorkshopReplacement, validateWorkshop, workshopCandidate, workshopCardText, workshopHardLimit, workshopOverrideCandidate,
  workshopOverrideLine, workshopRefusal, workshopStampOverrides,
  type Workshop, type WorkshopEdit, type WorkshopEditResult,
} from '../../src/workshops/model'
import { samplePipeline } from '../../src/workshops/rules'
import { checkWorkshopMove } from '../../src/workshops/behaviour'
import { catalogPreset } from '../../src/workshops/catalog'

// Moving a card anyway (owner, 2026-11-23): a drop the rules refuse is offered with the rule's sentence as "Move
// anyway" / "Cancel". Confirmed, the card moves, marked with who and when; Undo puts it back. Only hard limits stay
// refused. Every surface asks the same functions: the drag, the chat, the server and exec's check_move.

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

// The owner's board: a decision path whose token ("asdf") already reached Decide.
const decision = validateWorkshop({ ...catalogPreset('decision-path'), cards: [{ id: 'token', label: 'asdf', laneId: 'decide' }] })
const team = ok(apply(validateWorkshop({
  version: 1, title: 'Team board',
  lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' }, { id: 'done', label: 'Done' }],
  cards: [{ id: 'billing', label: 'Billing', laneId: 'todo' }, { id: 'search', label: 'Search', laneId: 'doing' },
    { id: 'auth', label: 'Auth', laneId: 'review', allowedLaneIds: ['review', 'done'] }],
}), { kind: 'add_rule', rule: { kind: 'capacity', where: 'Doing', max: 1 } }))

describe('moving a card anyway', () => {
  it('is offered on a map: the token goes back to a step with no path to it, marked with who, when and the rule', () => {
    expect(workshopCandidate(decision, 'token', 'question')).toBeNull()
    const sentence = workshopRefusal(decision, 'token', 'question')
    expect(sentence).toBe("The question can't be reached from Decide.")
    expect(workshopHardLimit(decision, 'token', 'question')).toBeNull()
    const moved = workshopOverrideCandidate(decision, 'token', 'question', sam)!
    const token = moved.cards[0]
    expect(token.laneId).toBe('question')
    expect(token.override).toEqual({ by: 'Sam', at: sam.at, sentence, from: 'decide' })
    // Visible on the card: who and when, under its name.
    expect(workshopOverrideLine(token)).toBe('Moved anyway by Sam · Nov 23')
    expect(workshopCardText(moved, token)).toBe('asdf\nMoved anyway by Sam · Nov 23')
    // A stored board keeps the mark.
    expect(validateWorkshop(JSON.parse(JSON.stringify(moved))).cards[0].override).toEqual(token.override)
  })

  it('is offered on a lane board for a rule (a full lane) and for a lane the card may not go in', () => {
    const full = workshopOverrideCandidate(team, 'billing', 'doing', sam)!
    expect(full.cards.find(card => card.id === 'billing')!.override!.sentence).toBe(workshopRefusal(team, 'billing', 'doing'))
    expect(full.cards.filter(card => card.laneId === 'doing')).toHaveLength(2)
    const outside = workshopOverrideCandidate(team, 'auth', 'todo', sam)!
    expect(outside.cards.find(card => card.id === 'auth')).toMatchObject({ laneId: 'todo', override: { from: 'review', sentence: "This card can't go in To do." } })
  })

  it('is not an override when the rules allow the move, and an ordinary move takes the mark off', () => {
    expect(workshopOverrideCandidate(team, 'billing', 'review', sam)).toBeNull()
    const moved = workshopOverrideCandidate(team, 'billing', 'doing', sam)!
    const onward = workshopCandidate(moved, 'billing', 'review')!
    expect(onward.cards.find(card => card.id === 'billing')!.override).toBeUndefined()
  })

  it('goes back where it came from in one step, past the rule (Undo)', () => {
    const moved = workshopOverrideCandidate(team, 'billing', 'doing', sam)!
    const back = workshopCandidate(moved, 'billing', 'todo')!
    expect(back.cards.find(card => card.id === 'billing')).toEqual({ id: 'billing', label: 'Billing', laneId: 'todo' })
    // The whole board put back (a save of the Undo) passes the rulebook too.
    expect(checkWorkshopReplacement(moved, team)).toBeNull()
  })

  it('keeps the hard limits: what would leave a board that does not add up, a release plan and a card that is not there', () => {
    // A deal with no amount is never won, even anyway: the forecast could not count it (business boards take overrides
    // otherwise: workshop-override-boards.test.ts).
    const pipeline = validateWorkshop({ ...samplePipeline(), cards: [...samplePipeline().cards.filter(card => card.id !== 'harbor'), { id: 'nova', label: 'Nova', laneId: 'proposal' }] })
    expect(workshopCandidate(pipeline, 'nova', 'won')).toBeNull()
    expect(workshopOverrideCandidate(pipeline, 'nova', 'won', sam)).toBeNull()
    expect(workshopHardLimit(pipeline, 'nova', 'won')).toBe(workshopRefusal(pipeline, 'nova', 'won'))
    expect(workshopHardLimit(decision, 'nobody', 'question')).toBe('That card or lane is no longer on the board.')
    const release = validateWorkshop({ version: 1, kind: 'release-plan', title: 'Releases', lanes: [{ id: 'r1', label: 'R1', capacity: 3 }, { id: 'r2', label: 'R2', capacity: 3 }],
      cards: [{ id: 'a', label: 'A', laneId: 'r1', points: 3 }, { id: 'b', label: 'B', laneId: 'r2', points: 2 }] })
    expect(workshopOverrideCandidate(release, 'b', 'r1', sam)).toBeNull()
    expect(() => validateWorkshop({ ...release, cards: release.cards.map((card, i) => i ? { ...card, override: { by: 'x', at: sam.at, sentence: 'x', from: 'r1' } } : card) }))
      .toThrow('A release plan’s and a startup experience’s cards are never moved past a rule.')
  })

  it('refuses a move_card edit with overridable, and makes it with override true, stamped by the actor', () => {
    const refusal = no(apply(decision, { kind: 'move_card', card: 'asdf', lane: 'The question' }))
    expect(refusal).toMatchObject({ code: 'refused', reason: "The question can't be reached from Decide.", overridable: true })
    const made = apply(decision, { kind: 'move_card', card: 'asdf', lane: 'The question', override: true })
    const board = ok(made)
    expect(board.cards[0].override).toEqual({ by: 'Tim', at: tim.now, sentence: "The question can't be reached from Decide.", from: 'decide' })
    expect('refused' in made ? '' : made.report.edits[0].said).toBe('Moved “asdf” to “The question” anyway. The question can\'t be reached from Decide.')
    // A rulebook rule too.
    expect(ok(apply(team, { kind: 'move_card', card: 'Billing', lane: 'Doing', override: true })).cards.find(card => card.id === 'billing')!.override!.by).toBe('Tim')
    // A hard limit is refused with override true, and says it is not overridable.
    const pipeline = validateWorkshop({ ...samplePipeline(), cards: [...samplePipeline().cards.filter(card => card.id !== 'harbor'), { id: 'nova', label: 'Nova', laneId: 'proposal' }] })
    const hard = no(apply(pipeline, { kind: 'move_card', card: { id: 'nova' }, lane: { id: 'won' }, override: true }))
    expect(hard.overridable).toBeUndefined()
    expect(no(apply(pipeline, { kind: 'move_card', card: { id: 'nova' }, lane: { id: 'won' } })).overridable).toBeUndefined()
  })

  it('check_move says whether a refusal may be made anyway', () => {
    expect(checkWorkshopMove(decision, 'token', 'question')).toMatchObject({ refused: { sentence: "The question can't be reached from Decide.", overridable: true } })
    expect(checkWorkshopMove(team, 'billing', 'doing')).toMatchObject({ refused: { overridable: true } })
    expect(checkWorkshopMove(decision, 'nobody', 'question')).toMatchObject({ refused: { overridable: false } })
  })

  it('stamps a whole board saved over the stored one: the saver, never what the page wrote', () => {
    const page = { ...decision, cards: [{ ...decision.cards[0], laneId: 'question', override: { by: 'Mallory', at: '2020-01-01T00:00:00.000Z', sentence: 'fake', from: 'decide' } }] }
    const stamped = workshopStampOverrides(decision, page, sam)
    expect(stamped.cards[0].override).toEqual({ by: 'Sam', at: sam.at, sentence: "The question can't be reached from Decide.", from: 'decide' })
    // A mark on a card that did not move stays as stored; a mark on a move no rule refused is dropped.
    const moved = workshopOverrideCandidate(team, 'billing', 'doing', sam)!
    const forged = { ...moved, cards: moved.cards.map(card => card.id === 'billing' ? { ...card, override: { ...card.override!, by: 'Mallory' } } : card) }
    expect(workshopStampOverrides(moved, forged, { by: 'Tim', at: tim.now }).cards.find(card => card.id === 'billing')!.override!.by).toBe('Sam')
    const legal = { ...team, cards: team.cards.map(card => card.id === 'billing' ? { ...card, laneId: 'review', override: { by: 'X', at: sam.at, sentence: 'x', from: 'todo' } } : card) }
    expect(workshopStampOverrides(team, legal, sam).cards.find(card => card.id === 'billing')!.override).toBeUndefined()
  })
})
