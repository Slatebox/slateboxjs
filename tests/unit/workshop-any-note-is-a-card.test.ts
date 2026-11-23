import { describe, expect, it } from 'vitest'
import * as model from '../../src/workshops/model'
import { applyWorkshopEdits } from '../../src/workshops/edits'

/**
 * Any note becomes a card (owner decision 2026-11-21, "no need to restrict this either"). A lane
 * refuses a note only for the board's own rules (its capacity, a board that keeps its own cards,
 * the 24-card limit) or when the board has moved on; never for the note's words, look, shape,
 * picture, link or lines. An empty note is an empty card, and back.
 */

const { validateWorkshop, workshopNoteCandidate, workshopNoteRefusal, workshopCardAsNote } = model
const m = model as any

const board = validateWorkshop({
  version: 1, title: 'Plan',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 1 }],
  cards: [{ id: 'alpha', label: 'Alpha', laneId: 'now' }],
})

describe('an empty note is an empty card', () => {
  it('becomes a card with no words, counts in its lane and is kept as it is', () => {
    expect(workshopNoteRefusal(board, 'now', { id: 'blank', label: '   ' })).toBeNull()
    const next = workshopNoteCandidate(board, 'now', { id: 'blank', label: '' })!
    expect(next.cards.at(-1)).toEqual({ id: 'blank', label: '', laneId: 'now' })
    expect(validateWorkshop(next)).toEqual(next)
    expect(m.workshopLaneCaption(next, 'now')).toBe('2')
    // And back: an empty card leaves the lanes as an empty note.
    expect(workshopCardAsNote(next, 'blank')!.cards.map(card => card.id)).toEqual(['alpha'])
  })

  it('is what a card renamed to nothing is, and what an agent adds without words', () => {
    const renamed = applyWorkshopEdits(board, [{ kind: 'rename_card', card: { id: 'alpha' }, label: '' }]) as any
    expect(renamed.workshop.cards[0]).toEqual({ id: 'alpha', label: '', laneId: 'now' })
    const added = applyWorkshopEdits(board, [{ kind: 'add_card', lane: 'Now' }]) as any
    expect(added.workshop.cards.at(-1)).toMatchObject({ label: '', laneId: 'now' })
    expect(added.report.edits[0].said).toBe('Added an empty card to “Now”.')
    // A lane still needs a name.
    expect(() => validateWorkshop({ ...board, lanes: [{ id: 'now', label: '' }, board.lanes[1]] })).toThrow()
  })
})

describe('a note becomes a card whatever its words, look, shape, picture or link', () => {
  it('long words: the card shows the first 80 characters, and the note gets all of them back', () => {
    const words = 'word '.repeat(40).trim()
    expect(workshopNoteRefusal(board, 'now', { id: 'long', label: words })).toBeNull()
    const card = workshopNoteCandidate(board, 'now', { id: 'long', label: words })!.cards.at(-1)!
    expect(card.label.length).toBeLessThanOrEqual(80)
    expect(card.label.endsWith('…')).toBe(true)
    expect(card.asNote?.text).toBe(words)
    expect(m.workshopCardLabelOf(words)).toBe(card.label)
  })

  it('a look or shape a card cannot draw: it keeps what it can and leaves out the rest', () => {
    const next = workshopNoteCandidate(board, 'now', { id: 'odd', label: 'Odd', look: { backgroundColor: 'url(javascript:1)', textColor: '#112233' } as any,
      asNote: { shape: 'url(x)', width: 1e9, height: 70 } as any })!
    expect(next.cards.at(-1)).toEqual({ id: 'odd', label: 'Odd', laneId: 'now', look: { textColor: '#112233' }, asNote: { height: 70 } })
  })

  it('a picture and a link go with the card and come back with the note', () => {
    const asNote = { image: { src: 'https://cdn.example.org/a.png', width: 640, height: 480 }, link: { type: 'externalUrl', data: { url: 'https://example.org/x' }, show: true } }
    const next = workshopNoteCandidate(board, 'now', { id: 'pic', label: 'Pic', asNote } as any)!
    expect(next.cards.at(-1)!.asNote).toEqual(asNote)
    expect(validateWorkshop(next)).toEqual(next)
    // (Restated 2026-11-21, coordinator: a picture held in the page goes with the card; the host stores it.)
    expect(m.workshopKeepsPicture('data:image/png;base64,AAAA')).toBe(true)
    expect(m.workshopKeepsPicture('/files/a.png')).toBe(true)
    expect(m.workshopKeepsLink({ data: 'https://example.org' })).toBe(true)
  })

  it('a line whose look cannot be drawn keeps its ends', () => {
    const next = workshopNoteCandidate(board, 'now', { id: 'n1', label: 'N', lines: [{ id: 'n1->alpha', parentId: 'n1', childId: 'alpha', lineColor: 'url(x)' }] } as any)!
    expect(next.lines).toEqual([{ id: 'n1->alpha', parentId: 'n1', childId: 'alpha' }])
  })
})

describe('what still keeps a note a note: the board\'s own rules', () => {
  it('a full lane, a full board, a board that keeps its own cards, a lane that is gone; and words a card cannot show as plain text (flagged)', () => {
    const full = workshopNoteCandidate(board, 'later', { id: 'one', label: 'One' })!
    expect(workshopNoteRefusal(full, 'later', { id: 'two', label: 'Two' })).toBe('It already holds 1 of 1 card.')
    const crowded = validateWorkshop({ ...board, cards: Array.from({ length: 24 }, (_, i) => ({ id: 'c' + i, label: 'C' + i, laneId: 'now' })) })
    expect(workshopNoteRefusal(crowded, 'now', { id: 'n', label: 'One more' })).toBe('This board is at its size limit of 24 cards. Remove a card to make room.')
    // (Restated 2026-11-22, owner: "notes ALWAYS convert on boards". A release plan takes a note as a 1-point
    // feature; a board that truly keeps its own cards, a startup experience, says so.)
    expect(workshopNoteRefusal(m.releasePlan, m.releasePlan.lanes[0].id, { id: 'n', label: 'N' })).toBeNull()
    expect(workshopNoteRefusal(m.createInterviewWorkshop(), 'interviews', { id: 'n', label: 'N' })).toMatch(/^This workshop keeps the cards it came with/)
    expect(workshopNoteRefusal(board, 'gone', { id: 'n', label: 'N' })).toBe('That lane is no longer on the board.')
    // (Restated 2026-11-21, coordinator: words with markup are kept verbatim, not refused.)
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: '<b>Hi</b>' })).toBeNull()
  })
})
