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

  // (Restated 2026-11-21, owner decision: an empty note and a note with long words become cards; see
  // workshop-any-note-is-a-card.test.ts. Markup and a full board still keep a note a note.)
  it('refuses a note with markup, and a board that is full', () => {
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: '   ' })).toBeNull()
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: 'x'.repeat(81) })).toBeNull()
    // (Restated 2026-11-21, coordinator: markup is kept verbatim; the 24-card cap says it is the board's size limit.)
    expect(workshopNoteRefusal(board, 'now', { id: 'n', label: '<b>Hi</b>' })).toBeNull()
    const crowded = validateWorkshop({ ...board, signals: undefined, cards: Array.from({ length: 24 }, (_, i) => ({ id: 'c' + i, label: 'C' + i, laneId: 'now' })) })
    expect(workshopNoteRefusal(crowded, 'now', { id: 'n', label: 'One more' })).toBe('This board is at its size limit of 24 cards. Remove a card to make room.')
  })

  it('gives the card a fresh id when the note\'s id is already a lane or card, or is not one a card can have', () => {
    expect(workshopNoteCandidate(board, 'now', { id: 'alpha', label: 'Alpha again' })!.cards.at(-1)!.id).toBe('card-1')
    expect(workshopNoteCandidate(board, 'now', { id: 'now', label: 'Now again' })!.cards.at(-1)!.id).toBe('card-1')
    expect(workshopNoteCandidate(board, 'now', { id: 'has space', label: 'Spaced' })!.cards.at(-1)!.id).toBe('card-1')
  })

  // (Restated 2026-11-22, owner: "notes ALWAYS convert on boards", maps included: a note dropped on a station is a
  // card there, a release plan's a feature. Only a startup experience, whose cards are what it is about, keeps its own
  // and says so. See boards-s2b.test.ts.)
  it('takes notes on every board: a map and a release plan make cards of them; a startup experience says why it keeps its own', () => {
    expect(workshopTakesNotes(board)).toBe(true)
    for (const other of [nightTransfer, releasePlan]) {
      expect(workshopTakesNotes(other)).toBe(true)
      expect(workshopNoteCandidate(other, other.lanes.at(-1)!.id, { id: 'n', label: 'Note' })!.cards.at(-1)!.id).toBe('n')
    }
    expect(workshopNoteCandidate(createBudgetWorkshop(), 'reserve', { id: 'n', label: 'Note' })).toBeNull()
    expect(workshopNoteRefusal(createBudgetWorkshop(), 'reserve', { id: 'n', label: 'Note' })).toMatch(/^This workshop keeps the cards it came with: .+\.$/)
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

  // (Restated 2026-11-22: a map's token stays on the map, a feature others depend on stays a card, and a startup
  // experience's cards stay; a release plan's other features leave as notes, with their points.)
  it('leaves a map\'s token, a feature others depend on and a startup experience\'s cards where they are', () => {
    expect(workshopCardAsNote(nightTransfer, 'rider')).toBeNull()
    expect(workshopCardAsNote(releasePlan, 'guardrails')).toBeNull()
    expect(workshopCardAsNote(releasePlan, 'billing')!.cards.map(card => card.id)).toEqual(['guardrails', 'invite', 'export'])
    expect(workshopCardAsNote(createBudgetWorkshop(), 'fund-0')).toBeNull()
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

describe('a host that draws its cards as its own notes', () => {
  it('passes a card look that cards take and lanes do not', () => {
    const style = { fontFamily: 'Manrope', textColor: '#1d2b2a', card: { backgroundColor: '#699bc3', textColor: 'rgba(255, 255, 255, 0.87)', fontSize: 18, cornerRadius: 12 } }
    const nodes = workshopToSlate(board, { native: true, style }).nodes
    const card = nodes.find(node => node.options.id === 'card-alpha')!.options
    const lane = nodes.find(node => node.options.id === 'lane-now')!.options
    expect(card).toMatchObject({ backgroundColor: '#699bc3', foregroundColor: 'rgba(255, 255, 255, 0.87)', fontSize: 18, fontFamily: 'Manrope' })
    expect(card.vectorPath).toContain('Q 228 0 228 12')
    expect(lane.foregroundColor).toBe('#1d2b2a')
    // A card made from a note still keeps that note's own look over the host's.
    const next = workshopNoteCandidate(board, 'now', { id: 'own', label: 'Own', look: { backgroundColor: '#f0d399' } })!
    expect(workshopToSlate(next, { native: true, style }).nodes.find(node => node.options.id === 'card-own')!.options.backgroundColor).toBe('#f0d399')
  })
})

describe('a note and a card trade places without losing what the note had (cards-fix)', () => {
  it('keeps the note\'s line breaks, shape and size with the card, and validates them', () => {
    const asNote = { text: 'First line\nSecond line', shape: 'ellipse', width: 120, height: 70 }
    const next = workshopNoteCandidate(board, 'now', { id: 'shaped', label: 'First line Second line', asNote })!
    expect(next.cards.at(-1)).toEqual({ id: 'shaped', label: 'First line Second line', laneId: 'now', asNote })
    expect(validateWorkshop(next)).toEqual(next)
    // (Restated 2026-11-21, coordinator: the note's words are kept verbatim, markup included.)
    expect(validateWorkshop({ ...board, signals: undefined, cards: [{ id: 'x', label: 'X', laneId: 'now', asNote: { text: '<script>' } }] }).cards[0].asNote).toEqual({ text: '<script>' })
    expect(() => validateWorkshop({ ...board, signals: undefined, cards: [{ id: 'x', label: 'X', laneId: 'now', asNote: { width: 1e9 } }] })).toThrow()
    expect(() => validateWorkshop({ ...board, signals: undefined, cards: [{ id: 'x', label: 'X', laneId: 'now', asNote: { shape: 'url(x)' } }] })).toThrow()
    expect(validateWorkshop({ ...board, signals: undefined, cards: [{ id: 'x', label: 'X', laneId: 'now', asNote: { width: 90, extra: 1 } }] }).cards[0])
      .toEqual({ id: 'x', label: 'X', laneId: 'now', asNote: { width: 90 } })
  })

  it('puts a card back before the card it was in front of, so an undo restores the order', () => {
    const next = workshopNoteCandidate(board, 'now', { id: 'back', label: 'Back' }, 'beta')!
    expect(next.cards.map(card => card.id)).toEqual(['alpha', 'back', 'beta', 'gamma'])
    // A card that is no longer in that lane, or is gone, puts it at the foot.
    expect(workshopNoteCandidate(board, 'later', { id: 'back', label: 'Back' }, 'beta')!.cards.map(card => card.id)).toEqual(['alpha', 'beta', 'gamma', 'back'])
    expect(workshopNoteCandidate(board, 'now', { id: 'back', label: 'Back' }, 'gone')!.cards.map(card => card.id)).toEqual(['alpha', 'beta', 'gamma', 'back'])
  })
})
