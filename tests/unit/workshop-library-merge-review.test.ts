import { describe, expect, it } from 'vitest'
import '../../src/workshops/behaviour'
import {
  applyWorkshopEdits, validateWorkshop, workshopCardLines, workshopLineRefusal, workshopNewLine, workshopNoteCandidate, workshopNoteIdOf, workshopWithLine,
  type Workshop, type WorkshopEdit,
} from '../../src/workshops/model'
import { describeWorkshopEdits } from '../../src/workshops/edits'
import { samplePipeline } from '../../src/workshops/rules'
import { catalogSamples } from '../../src/workshops/samples'

// The review of the library merged onto main (connected cards, cards-are-notes): each finding as a test.

const business: [string, () => Workshop][] = (['launch-plan', 'hiring-plan', 'pipeline', 'budget', 'sort-evidence'] as const)
  .map(kind => [kind, () => validateWorkshop((catalogSamples as Record<string, () => Workshop>)[kind]())])
const refusal = (board: Workshop, ...edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  return 'refused' in result ? result.refused.reason : null
}

describe('a business board takes no lines', () => {
  it.each(business)('%s: a line from a card is refused, and a stored one is not kept', (_, make) => {
    const board = make()
    const [a, b] = board.cards
    const toNote = workshopNewLine(board, a.id, 'note-xyz')
    expect(workshopLineRefusal(board, toNote)).toMatch(/Lines join the cards of a lane workshop/)
    expect(workshopWithLine(board, toNote)).toBeNull()
    expect(workshopWithLine(board, workshopNewLine(board, a.id, b.id))).toBeNull()
    expect(validateWorkshop({ ...board, lines: [{ id: 'l1', parentId: a.id, childId: b.id }] }).lines).toBeUndefined()
  })

  it('workshopWithLine on samplePipeline() is null', () => {
    const board = samplePipeline()
    expect(workshopWithLine(board, workshopNewLine(board, board.cards[0].id, board.cards[1].id))).toBeNull()
  })

  it.each(business)('%s: the line edits are refused with a sentence', (_, make) => {
    const board = make()
    for (const kind of ['connect_cards', 'disconnect_cards', 'connect_note', 'disconnect_note']) {
      const entry = describeWorkshopEdits(board).find(item => item.kind === kind)!
      expect(entry.accepted).toBe(false)
      expect(entry.refusal).toMatch(/Cards on this board carry no lines/)
    }
    expect(refusal(board, { kind: 'connect_cards', card: { id: board.cards[0].id }, to: { id: board.cards[1].id } })).toMatch(/carry no lines/)
  })

  it('a board of plain lanes still takes lines', () => {
    const board = validateWorkshop({ version: 1, title: 'Plain', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
      cards: [{ id: 'x', label: 'X', laneId: 'a' }, { id: 'y', label: 'Y', laneId: 'b' }] })
    expect(workshopWithLine(board, workshopNewLine(board, 'x', 'y'))!.lines).toHaveLength(1)
  })
})

describe('a business board card is named, in plain text', () => {
  it('rename_card to an empty name is refused on samplePipeline()', () => {
    const board = samplePipeline()
    expect(refusal(board, { kind: 'rename_card', card: { id: board.cards[0].id }, label: '' })).toMatch(/1 to 80 characters/)
  })

  it.each(business)('%s: an empty or markup name is refused, a plain one kept', (_, make) => {
    const board = make()
    const target = { id: board.cards[0].id }
    expect(refusal(board, { kind: 'rename_card', card: target, label: '' })).not.toBeNull()
    expect(refusal(board, { kind: 'rename_card', card: target, label: '<img src=x onerror=1>' })).toMatch(/plain text/)
    expect(refusal(board, { kind: 'rename_card', card: target, label: 'Renamed' })).toBeNull()
  })

  it('validateWorkshop refuses a markup or empty card name on a pipeline, and keeps a plain lane card\'s', () => {
    const board = samplePipeline()
    expect(() => validateWorkshop({ ...board, cards: board.cards.map((card, i) => i ? card : { ...card, label: '<img src=x onerror=1>' }) })).toThrow(/plain text/)
    expect(() => validateWorkshop({ ...board, cards: board.cards.map((card, i) => i ? card : { ...card, label: '' }) })).toThrow(/1 to 80/)
    const plain = validateWorkshop({ version: 1, title: 'Plain', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [{ id: 'x', label: '', laneId: 'a' }] })
    expect(plain.cards[0].label).toBe('')
  })
})

describe('a note with an older id keeps it on a business board', () => {
  const oldId = 'node.1700000000000:abc'
  it('the card remembers the note\'s id and gives it back on the way out (samplePipeline round trip)', () => {
    const board = samplePipeline()
    const next = workshopNoteCandidate(board, board.lanes[0].id, { id: oldId, label: 'Acme 5000' })!
    const card = next.cards.at(-1)!
    expect(card.id).not.toBe(oldId)
    expect(card.noteId).toBe(oldId)
    expect(workshopNoteIdOf(card)).toBe(oldId)
    expect(validateWorkshop(JSON.parse(JSON.stringify(next))).cards.at(-1)!.noteId).toBe(oldId)
    expect(workshopCardLines(next, card.id)).toEqual({ stay: [], leave: [] })
  })

  it('a note whose id a card can take keeps no noteId', () => {
    const board = samplePipeline()
    const card = workshopNoteCandidate(board, board.lanes[0].id, { id: 'note-77', label: 'Acme 5000' })!.cards.at(-1)!
    expect(card.id).toBe('note-77')
    expect(card.noteId).toBeUndefined()
  })
})
