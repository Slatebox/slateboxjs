import { describe, expect, it } from 'vitest'
import * as model from '../../src/workshops/model'
import { applyWorkshopEdits, describeWorkshopEdits, type WorkshopEdit } from '../../src/workshops/edits'
import { serializeNode } from '../../src/core/Serialization'

/**
 * Connected cards (owner decision 2026-11-21): a note joined to other notes by lines may become a
 * card, and keeps its lines; lines are drawn between cards and notes, and between cards. A card's
 * lines are the board's (Workshop.lines); a line between two ordinary notes is the drawing's.
 */

const { validateWorkshop, workshopNoteCandidate, workshopNoteRefusal } = model
const m = model as any

const board = validateWorkshop({
  version: 1, title: 'What ships now?',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 2 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'now' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] },
  ],
})

/** A line from the note "sing" to the note "plain", as the slate saves a connector. */
const singToPlain = { id: 'sing->plain', parentId: 'sing', childId: 'plain', lineColor: '#666666', lineWidth: 3, lineType: 'bezier', showChildArrow: true, showParentArrow: false }
/** A line from the note "plain" to the card "alpha". */
const plainToAlpha = { id: 'plain->alpha', parentId: 'plain', childId: 'alpha', showChildArrow: true }

describe('a workshop keeps the lines joined to its cards', () => {
  it('keeps a line with a card at either end, with its look, and checks it', () => {
    const next = validateWorkshop({ ...board, lines: [{ ...plainToAlpha, lineColor: '#c2410c', lineDash: 'dashed', label: 'needs' }, { id: 'a-b', parentId: 'alpha', childId: 'beta' }] })
    expect(next.lines).toEqual([
      { id: 'plain->alpha', parentId: 'plain', childId: 'alpha', lineColor: '#c2410c', lineDash: 'dashed', showChildArrow: true, label: 'needs' },
      { id: 'a-b', parentId: 'alpha', childId: 'beta' },
    ])
    expect(validateWorkshop(next)).toEqual(next)
  })

  it('leaves out a line with no card at either end: it is the drawing\'s', () => {
    expect(validateWorkshop({ ...board, lines: [singToPlain] }).lines).toBeUndefined()
  })

  it('refuses a malformed line, a line to itself, a repeated id and more lines than it holds', () => {
    expect(() => validateWorkshop({ ...board, lines: [{ ...plainToAlpha, lineColor: 'url(javascript:x)' }] })).toThrow()
    expect(() => validateWorkshop({ ...board, lines: [{ ...plainToAlpha, label: '<b>' }] })).toThrow()
    expect(() => validateWorkshop({ ...board, lines: [{ id: 'x', parentId: 'alpha', childId: 'alpha' }] })).toThrow()
    expect(() => validateWorkshop({ ...board, lines: [plainToAlpha, plainToAlpha] })).toThrow(/Duplicate line ID/)
    const many = Array.from({ length: m.maxWorkshopLines + 1 }, (_, i) => ({ id: 'l' + i, parentId: 'n' + i, childId: 'alpha' }))
    expect(() => validateWorkshop({ ...board, lines: many })).toThrow(/up to 96 lines/)
  })
})

describe('a note with lines becomes a card and keeps them', () => {
  it('is no longer refused for its lines', () => {
    expect(workshopNoteRefusal(board, 'later', { id: 'plain', label: 'Plain', lines: [singToPlain] } as any)).toBeNull()
  })

  it('takes its lines onto the board, joined to the card', () => {
    const next = workshopNoteCandidate(board, 'later', { id: 'plain', label: 'Plain', lines: [singToPlain, plainToAlpha] } as any)!
    expect(next.cards.at(-1)).toMatchObject({ id: 'plain', laneId: 'later' })
    expect(next.lines).toEqual([
      { id: 'sing->plain', parentId: 'sing', childId: 'plain', lineColor: '#666666', lineWidth: 3, lineType: 'bezier', showChildArrow: true, showParentArrow: false },
      { id: 'plain->alpha', parentId: 'plain', childId: 'alpha', showChildArrow: true },
    ])
  })

  it('names the card under its own id when the note had to take another', () => {
    // A lane is called "later": a note called "later" becomes a card with a fresh id.
    const next = workshopNoteCandidate(board, 'now', { id: 'later', label: 'Later note', lines: [{ id: 'later->sing', parentId: 'later', childId: 'sing' }] } as any)!
    const card = next.cards.at(-1)!
    expect(card.id).not.toBe('later')
    expect(next.lines).toEqual([{ id: 'later->sing', parentId: card.id, childId: 'sing' }])
  })

  it('refuses lines it cannot keep, with a reason about the lines', () => {
    expect(workshopNoteRefusal(board, 'later', { id: 'plain', label: 'Plain', lines: [{ id: 'x', parentId: 'plain', childId: 'plain' }] } as any))
      .toBe('This note\'s lines can\'t be kept on a card.')
  })
})

describe('a card with lines becomes a note and keeps them', () => {
  const connected = validateWorkshop({ ...board, lines: [
    { id: 'sing->alpha', parentId: 'sing', childId: 'alpha' }, { id: 'alpha->beta', parentId: 'alpha', childId: 'beta' }, { id: 'beta->x', parentId: 'beta', childId: 'x' },
  ] })

  it('keeps the lines to other cards on the board and gives the lines to notes back to the drawing', () => {
    const next = m.workshopCardAsNote(connected, 'alpha')
    expect(next.cards.map((card: any) => card.id)).toEqual(['beta', 'gamma'])
    expect(next.lines).toEqual([{ id: 'alpha->beta', parentId: 'alpha', childId: 'beta' }, { id: 'beta->x', parentId: 'beta', childId: 'x' }])
    expect(m.workshopCardLines(connected, 'alpha')).toEqual({
      stay: [{ id: 'alpha->beta', parentId: 'alpha', childId: 'beta' }],
      leave: [{ id: 'sing->alpha', parentId: 'sing', childId: 'alpha' }],
    })
  })

  it('names the note by the id it took when the card\'s own was in use', () => {
    const next = m.workshopCardAsNote(connected, 'alpha', 'node_new')
    expect(next.lines).toEqual([{ id: 'alpha->beta', parentId: 'node_new', childId: 'beta' }, { id: 'beta->x', parentId: 'beta', childId: 'x' }])
    expect(m.workshopCardLines(connected, 'alpha', 'node_new').leave).toEqual([{ id: 'sing->alpha', parentId: 'sing', childId: 'node_new' }])
  })
})

describe('lines are drawn and taken away by the board\'s rules', () => {
  it('draws a line between a card and a note, or two cards, under a fresh id', () => {
    const first = m.workshopNewLine(board, 'alpha', 'beta')
    expect(first).toEqual({ id: 'alpha->beta', parentId: 'alpha', childId: 'beta', showChildArrow: true })
    const once = m.workshopWithLine(board, first)
    expect(m.workshopNewLine(once, 'alpha', 'beta').id).toBe('alpha->beta~2')
    expect(m.workshopWithLine(once, { ...first, lineColor: '#123456' }).lines).toEqual([{ ...first, lineColor: '#123456' }])
    expect(m.workshopWithoutLine(once, 'alpha->beta').lines).toBeUndefined()
  })

  it('refuses a line with no card, or to a lane', () => {
    expect(m.workshopLineRefusal(board, { id: 'a', parentId: 'one', childId: 'two' })).toBe('That card is no longer on the board.')
    expect(m.workshopLineRefusal(board, { id: 'a', parentId: 'alpha', childId: 'now' })).toBe('A line joins notes and cards, not lanes.')
    expect(m.workshopWithLine(board, { id: 'a', parentId: 'one', childId: 'two' })).toBeNull()
  })

  it('takes a removed card\'s lines with it', () => {
    const joined = validateWorkshop({ ...board, lines: [{ id: 'a-b', parentId: 'alpha', childId: 'beta' }, { id: 'b-g', parentId: 'beta', childId: 'gamma' }] })
    expect(m.workshopWithoutCardLines(joined, 'alpha').lines).toEqual([{ id: 'b-g', parentId: 'beta', childId: 'gamma' }])
  })
})

describe('agents and the conversation draw lines through the edit table', () => {
  const apply = (b: any, ...edits: WorkshopEdit[]) => applyWorkshopEdits(b, edits as any) as any

  it('lists the line edits for a lane board, and says why other boards do not take them', () => {
    const kinds = describeWorkshopEdits(board).filter(entry => entry.accepted).map(entry => entry.kind)
    expect(kinds).toEqual(expect.arrayContaining(['connect_cards', 'disconnect_cards', 'connect_note', 'disconnect_note']))
    const release = describeWorkshopEdits(model.releasePlan).find(entry => entry.kind === 'connect_cards')!
    expect(release.accepted).toBe(false)
    expect(release.refusal).toMatch(/Lines join the cards of a lane workshop/)
  })

  it('connects two cards by name, a card and a note by the note\'s id, and takes them away again', () => {
    const joined = apply(board, { kind: 'connect_cards', card: 'Alpha', to: 'Beta', label: 'blocks' } as any,
      { kind: 'connect_note', card: 'Gamma', note: 'node_k2j_1700', direction: 'from_note' } as any)
    expect(joined.workshop.lines).toEqual([
      { id: 'alpha->beta', parentId: 'alpha', childId: 'beta', showChildArrow: true, label: 'blocks' },
      { id: 'node_k2j_1700->gamma', parentId: 'node_k2j_1700', childId: 'gamma', showChildArrow: true },
    ])
    expect(joined.report.edits.map((edit: any) => edit.said)).toEqual(['Drew a line from “Alpha” to “Beta”.', 'Drew a line from the note node_k2j_1700 to “Gamma”.'])
    const parted = apply(joined.workshop, { kind: 'disconnect_cards', card: 'Beta', to: 'Alpha' } as any, { kind: 'disconnect_note', card: 'Gamma', note: 'node_k2j_1700' } as any)
    expect(parted.workshop.lines).toBeUndefined()
  })

  it('removes a card with its lines', () => {
    const joined = apply(board, { kind: 'connect_cards', card: 'Alpha', to: 'Beta' } as any).workshop
    expect(apply(joined, { kind: 'remove_card', card: 'Alpha' } as any).workshop.lines).toBeUndefined()
  })
})

describe('the drawing does not save a line to a card', () => {
  it('leaves out a connector whose other end is a note its host draws (a card)', () => {
    const card = { id: 'card-alpha' }, note = { id: 'note' }
    const slate = { nodes: { one: (id: string) => (id === 'card-alpha' ? card : id === 'note' ? note : undefined) }, isDerivedNode: (node: any) => node === card }
    const json = serializeNode({
      id: 'plain', slate, options: { id: 'plain', x: 0, y: 0, width: 10, height: 10 },
      relationships: { serialize: () => ({ associations: [
        { id: 'plain->card-alpha', parentId: 'plain', childId: 'card-alpha' }, { id: 'plain->note', parentId: 'plain', childId: 'note' },
      ] }) },
    })
    expect(json.relationships.associations.map((a: any) => a.id)).toEqual(['plain->note'])
  })
})
