import { describe, expect, it } from 'vitest'
import * as model from '../../src/workshops/model'
import { applyWorkshopEdits } from '../../src/workshops/edits'

/**
 * Content never refuses a trade (coordinator decisions, 2026-11-21): words with markup are kept
 * verbatim (only true control characters go), a picture held in the page goes with the card (the
 * host stores it), an old note id that a card cannot have gives the card a fresh id and the card
 * remembers the note's. The 24-card cap stays, and says it is the board's size limit.
 */
const { validateWorkshop, workshopNoteCandidate, workshopNoteRefusal } = model
const m = model as any
const board = validateWorkshop({ version: 1, title: 'Plan', lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later' }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }] })

describe('words are kept as typed', () => {
  it('a note with markup is a card with the same words; control characters go, line breaks and tabs are spaces', () => {
    const words = '<img src=x onerror="alert(1)"> <b>Hi</b>\u0007\tthere'
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: words })).toBeNull()
    const card = workshopNoteCandidate(board, 'now', { id: 'n', label: words })!.cards.at(-1)!
    expect(card.label).toBe('<img src=x onerror="alert(1)"> <b>Hi</b> there')
    expect(validateWorkshop({ ...board, cards: [card] }).cards[0].label).toBe(card.label)
    // The note's own words, line breaks and all, are kept for it.
    const kept = workshopNoteCandidate(board, 'now', { id: 'm', label: '<a> b', asNote: { text: '<a>\nb\u0001' } })!.cards.at(-1)!
    expect(kept.asNote).toEqual({ text: '<a>\nb' })
    // A card renamed with markup is renamed; a lane still takes plain names only.
    expect((applyWorkshopEdits(board, [{ kind: 'rename_card', card: { id: 'alpha' }, label: '<i>A</i>' }]) as any).workshop.cards[0].label).toBe('<i>A</i>')
    expect(() => validateWorkshop({ ...board, lanes: [{ id: 'now', label: '<b>Now</b>' }, board.lanes[1]] })).toThrow()
  })
})

describe('a picture held in the page goes with the card', () => {
  it('is kept for the host to store; anything but a picture is not', () => {
    const src = 'data:image/png;base64,iVBORw0KGgo='
    expect(m.workshopKeepsPicture(src)).toBe(true)
    expect(m.workshopKeepsPicture('data:text/html;base64,PHNjcmlwdD4=')).toBe(false)
    const next = workshopNoteCandidate(board, 'now', { id: 'pic', label: 'Pic', asNote: { image: { src } } } as any)!
    expect(next.cards.at(-1)!.asNote).toEqual({ image: { src } })
  })
})

describe('an old note id a card cannot have', () => {
  it('gives the card a fresh id, remembers the note\'s, and the note comes back under it; its lines stay joined', () => {
    const next = workshopNoteCandidate(board, 'now', { id: 'old.note id', label: 'Old', lines: [{ id: 'l1', parentId: 'old.note id', childId: 'other.old' }] } as any)!
    const card = next.cards.at(-1)!
    expect(card.id).toMatch(/^card-\d+$/)
    expect(card.noteId).toBe('old.note id')
    expect(next.lines).toEqual([{ id: 'l1', parentId: card.id, childId: 'other.old' }])
    expect(m.workshopNoteIdOf(card)).toBe('old.note id')
    expect(m.workshopCardLines(next, card.id, 'old.note id').leave).toEqual([{ id: 'l1', parentId: 'old.note id', childId: 'other.old' }])
  })
})

describe('the board size limit', () => {
  it('says it is the board\'s limit, not something about the note', () => {
    const crowded = validateWorkshop({ ...board, cards: Array.from({ length: 24 }, (_, i) => ({ id: 'c' + i, label: 'C' + i, laneId: 'now' })) })
    expect(workshopNoteRefusal(crowded, 'now', { id: 'n', label: 'One more' })).toBe('This board is at its size limit of 24 cards. Remove a card to make room.')
  })
})
