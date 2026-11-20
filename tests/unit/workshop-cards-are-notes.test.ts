import { describe, expect, it } from 'vitest'
import {
  createBudgetWorkshop, nightTransfer, releasePlan, validateWorkshop, workshopCardAsNote, workshopCardAsNoteRefusal,
  workshopNoteCandidate, workshopNoteRefusal, workshopTakesNotes, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { DEFAULT_NOTE_STYLE } from '../../src/core/NoteDefaults'

/** Two lanes: Later holds one card, Gamma may only be in Now, and an outcome hangs on Beta. */
const board: Workshop = validateWorkshop({
  version: 1, title: 'What ships now?',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 1 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'now' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] },
  ],
  signals: [{ id: 'ship', label: 'Ship', cardId: 'beta', laneId: 'later', whenPresent: 'Beta waits.', whenAbsent: 'Beta ships.' }],
})

describe('a note becomes a card under the lane\'s rules', () => {
  it('adds the note as a card in that lane, under its own id, with its words and its look', () => {
    const look = { backgroundColor: '#f0d399', textColor: '#24372d', fontFamily: 'Georgia, serif', fontSize: 16, borderColor: '#627569', borderWidth: 2 }
    const next = workshopNoteCandidate(board, 'later', { id: 'node_k2j_1700', label: '  Call  Sam ', look })!
    expect(next.cards.at(-1)).toEqual({ id: 'node_k2j_1700', label: 'Call Sam', laneId: 'later', look })
    expect(next.cards.slice(0, 3)).toEqual(board.cards)
    expect(validateWorkshop(next)).toEqual(next)
  })

  it('refuses a full lane with the sentence a refused card move gets', () => {
    const full = workshopNoteCandidate(board, 'later', { id: 'one', label: 'One' })!
    expect(workshopNoteCandidate(full, 'later', { id: 'two', label: 'Two' })).toBeNull()
    expect(workshopNoteRefusal(full, 'later', { id: 'two', label: 'Two' })).toBe('It already holds 1 of 1 card.')
    expect(workshopNoteRefusal(board, 'later', { id: 'two', label: 'Two' })).toBeNull()
  })

  it('refuses a note with no words, too many words, or markup, and a board that is full', () => {
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: '   ' })).toBe('A card needs some words. Type on the note first.')
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: 'x'.repeat(81) })).toBe('A card holds up to 80 characters. Shorten the note first.')
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: '<b>Hi</b>' })).toBe('A card holds plain words only.')
    const crowded = validateWorkshop({ ...board, signals: undefined, cards: Array.from({ length: 24 }, (_, i) => ({ id: 'c' + i, label: 'C' + i, laneId: 'now' })) })
    expect(workshopNoteRefusal(crowded, 'now', { id: 'n', label: 'One more' })).toBe('A workshop holds up to 24 cards.')
  })

  it('gives the card a fresh id when the note\'s id is already a lane or card, or is not one a card can have', () => {
    expect(workshopNoteCandidate(board, 'now', { id: 'alpha', label: 'Alpha again' })!.cards.at(-1)!.id).toBe('card-1')
    expect(workshopNoteCandidate(board, 'now', { id: 'now', label: 'Now again' })!.cards.at(-1)!.id).toBe('card-1')
    expect(workshopNoteCandidate(board, 'now', { id: 'has space', label: 'Spaced' })!.cards.at(-1)!.id).toBe('card-1')
  })

  it('takes notes only on a lane board: a map, a release plan and a startup experience keep their own cards', () => {
    expect(workshopTakesNotes(board)).toBe(true)
    for (const other of [nightTransfer, releasePlan, createBudgetWorkshop()]) {
      expect(workshopTakesNotes(other)).toBe(false)
      expect(workshopNoteCandidate(other, other.lanes[0].id, { id: 'n', label: 'Note' })).toBeNull()
      expect(workshopNoteRefusal(other, other.lanes[0].id, { id: 'n', label: 'Note' })).toMatch(/\.$/)
    }
  })

  it('keeps only a look it can draw', () => {
    expect(() => validateWorkshop({ ...board, cards: [{ id: 'x', label: 'X', laneId: 'now', look: { backgroundColor: 'url(javascript:1)' } }] })).toThrow()
    expect(() => validateWorkshop({ ...board, cards: [{ id: 'x', label: 'X', laneId: 'now', look: { fontSize: 900 } }] })).toThrow()
    expect(validateWorkshop({ ...board, signals: undefined, cards: [{ id: 'x', label: 'X', laneId: 'now', look: { backgroundColor: '#abc', extra: 1 } }] }).cards[0])
      .toEqual({ id: 'x', label: 'X', laneId: 'now', look: { backgroundColor: '#abc' } })
  })
})

describe('a card leaves the lanes as an ordinary note', () => {
  it('takes the card out of the board', () => {
    expect(workshopCardAsNote(board, 'alpha')!.cards.map(card => card.id)).toEqual(['beta', 'gamma'])
    expect(workshopCardAsNoteRefusal(board, 'alpha')).toBeNull()
  })

  it('keeps a card that an outcome or a lane rule depends on, and says why', () => {
    expect(workshopCardAsNote(board, 'beta')).toBeNull()
    expect(workshopCardAsNoteRefusal(board, 'beta')).toBe('An outcome on this board depends on Beta, so it stays a card.')
    expect(workshopCardAsNote(board, 'gamma')).toBeNull()
    expect(workshopCardAsNoteRefusal(board, 'gamma')).toBe('Gamma may only be in Now, so it stays a card.')
  })

  it('leaves the cards of a map, a release plan and a startup experience where they are', () => {
    expect(workshopCardAsNote(nightTransfer, 'rider')).toBeNull()
    expect(workshopCardAsNote(releasePlan, releasePlan.cards[0].id)).toBeNull()
  })
})

describe('a card looks like an ordinary note', () => {
  const cardOf = (model: Workshop, id: string, style?: Record<string, unknown>) =>
    workshopToSlate(model, { native: true, ...(style ? { style } : {}) }).nodes.find(node => node.options.id === 'card-' + id)!.options

  it('with no style: the fill, border, type and square corners of an engine note', () => {
    const card = cardOf(board, 'alpha')
    expect(card.backgroundColor).toBe(DEFAULT_NOTE_STYLE.backgroundColor)
    expect(DEFAULT_NOTE_STYLE.backgroundColor).toBe('#f0f0f0')
    expect([card.borderColor, card.borderWidth, card.foregroundColor, card.fontSize]).toEqual(
      [DEFAULT_NOTE_STYLE.borderColor, DEFAULT_NOTE_STYLE.borderWidth, DEFAULT_NOTE_STYLE.fontColor, DEFAULT_NOTE_STYLE.fontSize])
    expect(card.vectorPath).not.toContain('Q')
  })

  it('with a host style: the host\'s note fill as well as its type and border', () => {
    expect(cardOf(board, 'alpha', { backgroundColor: '#ffffff', borderColor: '#c5ccc4' })).toMatchObject({ backgroundColor: '#ffffff', borderColor: '#c5ccc4' })
  })

  it('a card that was a note keeps the note\'s own look', () => {
    const look = { backgroundColor: '#f0d399', textColor: '#24372d', fontFamily: 'Georgia, serif', fontSize: 16, borderColor: '#627569', borderWidth: 2 }
    const next = workshopNoteCandidate(board, 'now', { id: 'kept', label: 'Kept', look })!
    expect(cardOf(next, 'kept', { backgroundColor: '#ffffff' })).toMatchObject({
      backgroundColor: '#f0d399', foregroundColor: '#24372d', fontFamily: 'Georgia, serif', fontSize: 16, borderColor: '#627569', borderWidth: 2,
    })
  })

  it('a map\'s token keeps its token colour: it is a playing piece, not a card', () => {
    expect(cardOf(nightTransfer, 'rider').backgroundColor).toBe('#ffda75')
  })
})
