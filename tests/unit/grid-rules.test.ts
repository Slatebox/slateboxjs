// The grid sheet's rules (snap-grid spec §1–§3): what validateWorkshop refuses (overlap, the page's edge, a stamp on a
// page, a tray tile with a cell, the 121st tile), the reflow a new grid or page makes, a page duplicated (and shuffled),
// tiles placed, and the rulebook's grid family: its sentences, its refusals, Move anyway for a limit (never for an
// overlap), what a page needs (said, never blocking), and its contradictions.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { behaviourLines, ruleSentence } from '../../src/workshops/behaviour'
import { bingoSample, flashcardSample, gridCaption, gridPrintProblems, gridSheet, worksheetSample, gridFromNote } from '../../src/workshops/rules'

const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-25T10:00:00.000Z' }
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const sheet = () => validateWorkshop(worksheetSample())
const card = (board: Workshop, label: string) => board.cards.find(item => item.label === label)!
const base = (cards: unknown[], rows = 4, cols = 2) => ({ version: 1, kind: 'grid', title: 'Sheet', grid: { page: { size: 'letter', orientation: 'portrait', margin: 0.5 }, cells: { rows, cols, gutter: 0.125 } },
  lanes: [{ id: 'tray', label: 'Tiles' }, { id: 'page-1', label: 'Page 1' }], cards })

describe('a grid sheet holds together', () => {
  it('the samples are valid sheets', () => {
    for (const make of [worksheetSample, bingoSample, flashcardSample]) expect(() => validateWorkshop(make())).not.toThrow()
  })

  it('refuses an overlap, the page’s edge, a stamp on a page, a tray tile with a cell, a page tile without one', () => {
    const title = { id: 't', label: 'Title', laneId: 'page-1', tile: { type: 'heading' }, cell: { row: 0, col: 0 } }
    expect(() => validateWorkshop(base([title, { id: 'm', label: 'Map', laneId: 'page-1', tile: { type: 'image' }, cell: { row: 0, col: 0 } }])))
      .toThrow('“Map” and “Title” both sit on row 1, column 1 of Page 1.')
    expect(() => validateWorkshop(base([{ id: 'm', label: 'Map', laneId: 'page-1', tile: { type: 'image' }, cell: { row: 0, col: 1, cols: 2 } }])))
      .toThrow('“Map” runs past the page’s edge: it’s 2 columns wide from column 2 of 2.')
    expect(() => validateWorkshop(base([{ id: 's', label: 'Question', laneId: 'page-1', tile: { type: 'question', stamp: true }, cell: { row: 0, col: 0 } }])))
      .toThrow('A stamp stays in the tray.')
    expect(() => validateWorkshop(base([{ id: 's', label: 'Question', laneId: 'tray', tile: { type: 'question' }, cell: { row: 0, col: 0 } }])))
      .toThrow('A tile in the tray has no cell.')
    expect(() => validateWorkshop(base([{ id: 's', label: 'Question', laneId: 'page-1', tile: { type: 'question' } }]))).toThrow('A tile on a page sits in a cell.')
    expect(() => validateWorkshop(base([{ id: 'w', label: 'Words', laneId: 'tray', tile: { type: 'word-bank', words: ['a', 'b'] } }]))).toThrow('A word bank holds 3 to 24 words.')
    expect(() => validateWorkshop(base([{ id: 'q', label: 'Site', laneId: 'tray', tile: { type: 'qr', link: 'javascript:alert(1)' } }]))).toThrow('A QR code links to a web address.')
    expect(() => validateWorkshop(base([{ id: 'p', label: 'Pic', laneId: 'tray', tile: { type: 'image', image: { alt: 'x', src: 'ftp://x/y.png' } } }]))).toThrow('A tile keeps a picture by its web address, or held in the page.')
  })

  it('holds 120 tiles, and refuses the 121st', () => {
    const tiles = Array.from({ length: 120 }, (_, i) => ({ id: 'x' + i, label: 'Tile ' + i, laneId: 'tray', tile: { type: 'term' } }))
    expect(validateWorkshop(base(tiles)).cards).toHaveLength(120)
    expect(() => validateWorkshop(base([...tiles, { id: 'y', label: 'One more', laneId: 'tray', tile: { type: 'term' } }]))).toThrow('A grid sheet holds up to 120 tiles.')
    expect(refused(validateWorkshop(base(tiles)), [{ kind: 'add_tile', type: 'term', label: 'One more' }]).reason).toBe('A grid sheet holds up to 120 tiles. Remove one first.')
  })
})

describe('a new grid or page reflows the tiles', () => {
  const two = () => validateWorkshop(base([
    { id: 'title', label: 'Title', laneId: 'page-1', tile: { type: 'heading' }, cell: { row: 0, col: 0, cols: 2 } },
    { id: 'map', label: 'Map', laneId: 'page-1', tile: { type: 'image', image: { alt: 'A map' } }, cell: { row: 1, col: 0, rows: 2, cols: 2 } },
    { id: 'q', label: 'Where is it?', laneId: 'page-1', tile: { type: 'question' }, cell: { row: 3, col: 1 } },
  ]))
  it('2 to 3 columns keeps every tile where it is', () => {
    const made = ok(two(), [{ kind: 'set_grid', cols: 3 }])
    expect(made.report.edits[0].said).toBe('Made it 3 columns.')
    expect(made.workshop.cards.map(item => item.cell)).toEqual([{ row: 0, col: 0, cols: 2 }, { row: 1, col: 0, rows: 2, cols: 2 }, { row: 3, col: 1 }])
  })
  it('3 to 2 columns moves what no longer fits, and sends what has no room back to the tray, by name', () => {
    const wide = ok(two(), [{ kind: 'set_grid', cols: 3 }, { kind: 'place_tile', card: 'Map', page: 'Page 1', row: 2, col: 2, rows: 2, cols: 2 }]).workshop
    const made = ok(wide, [{ kind: 'set_grid', cols: 2, rows: 3 }])
    expect(made.report.edits[0].said).toBe('Made it 3 rows by 2 columns. “Where is it?” went back to the tray: no 1 by 1 room left.')
    expect(card(made.workshop, 'Map').cell).toEqual({ row: 1, col: 0, rows: 2, cols: 2 })
    expect(card(made.workshop, 'Where is it?').laneId).toBe('tray')
    expect(card(made.workshop, 'Where is it?').cell).toBeUndefined()
  })
  it('A4 landscape reflows a tall page', () => {
    const made = ok(two(), [{ kind: 'set_page', size: 'a4', orientation: 'landscape' }, { kind: 'set_grid', rows: 2, cols: 4 }])
    expect(made.report.edits[0].said).toBe('Made it A4 landscape.')
    expect(made.workshop.grid!.page).toEqual({ size: 'a4', orientation: 'landscape', margin: 0.5 })
    expect(card(made.workshop, 'Title').cell).toEqual({ row: 0, col: 0, cols: 2 })
    expect(card(made.workshop, 'Map').cell).toEqual({ row: 0, col: 2, rows: 2, cols: 2 })
    expect(card(made.workshop, 'Where is it?').cell).toEqual({ row: 1, col: 0 })
  })
  it('too many columns are refused with how many fit', () => {
    expect(refused(two(), [{ kind: 'set_page', margin: 1 }, { kind: 'set_grid', cols: 8, gutter: 0.25 }]).reason).toBe('Cells would be under ¾ inch wide: use 6 columns or fewer on Letter portrait.')
  })
})

describe('pages', () => {
  it('a copy of a page has new tiles, and a page past the cap is refused', () => {
    const made = ok(sheet(), [{ kind: 'add_page', copyOf: 'Page 1' }]).workshop
    const one = made.cards.filter(item => item.laneId === 'page-1'), two = made.cards.filter(item => item.laneId === 'page-2')
    expect(made.lanes.map(lane => lane.label)).toEqual(['Tiles', 'Page 1', 'Page 2'])
    expect(two.map(item => item.label)).toEqual(one.map(item => item.label).sort((a, b) => one.findIndex(x => x.label === a) - one.findIndex(x => x.label === b)))
    expect(two.every(item => !one.some(other => other.id === item.id))).toBe(true)
    const tiles = Array.from({ length: 105 }, (_, i) => ({ id: 'x' + i, label: 'Tile ' + i, laneId: 'tray', tile: { type: 'term' } }))
    const full = validateWorkshop({ ...sheet(), cards: [...sheet().cards, ...tiles] })
    expect(refused(full, [{ kind: 'add_page', copyOf: 'Page 1' }]).reason).toBe('Page 2 would need 7 more tiles; a sheet holds 120.')
    expect(refused(sheet(), [{ kind: 'remove_lane', lane: 'Page 1' }]).reason).toBe('Page 1 stays: a sheet has at least one page.')
    const gone = ok(made, [{ kind: 'remove_lane', lane: 'Page 2' }])
    expect(gone.report.edits[0].said).toBe('Removed “Page 2” and its 7 tiles.')
  })

  it('a shuffled bingo copy is the same every time, differs from the first card, and keeps Free in the centre', () => {
    const board = validateWorkshop(bingoSample())
    const a = ok(board, [{ kind: 'add_page', copyOf: 'Page 1', shuffle: true }]).workshop
    const b = ok(board, [{ kind: 'add_page', copyOf: 'Page 1', shuffle: true }]).workshop
    const terms = (sheet: Workshop, page: string) => sheet.cards.filter(item => item.laneId === page && item.tile?.type === 'term').map(item => item.label + '@' + item.cell!.row + ':' + item.cell!.col)
    expect(terms(a, 'page-2')).toEqual(terms(b, 'page-2'))
    expect(terms(a, 'page-2')).not.toEqual(terms(a, 'page-1').map(t => t))
    expect(terms(a, 'page-2')).toContain('Free@3:2')
    expect(new Set(terms(a, 'page-2').map(t => t.split('@')[0]))).toEqual(new Set(terms(a, 'page-1').map(t => t.split('@')[0])))
  })
})

describe('placing tiles, and the rules', () => {
  it('a taken cell refuses, by what is in it; the page’s edge says where the room runs out', () => {
    expect(refused(sheet(), [{ kind: 'place_tile', card: 'Question', page: 'Page 1', row: 2, col: 1 }]).reason).toBe('That cell holds “Adding fractions”.')
    expect(refused(sheet(), [{ kind: 'place_tile', card: 'Question', page: 'Page 1', row: 6, col: 2, rows: 2, cols: 1 }]).reason).toBe('A 2 by 1 question needs 2 free rows here; row 6 is the last.')
  })

  it('a stamp drop makes a copy and the stamp stays; a move to the tray clears the cell; a move to a page asks where', () => {
    const made = ok(sheet(), [{ kind: 'place_tile', card: 'Question', page: 'Page 1', row: 5, col: 2 }]).workshop
    const stamp = sheet().cards.find(item => item.label === 'Question')!
    expect(made.cards.find(item => item.id === stamp.id)).toMatchObject({ laneId: 'tray', tile: { stamp: true } })
    const copy = made.cards.at(-1)!
    expect(copy).toMatchObject({ label: 'Question', laneId: 'page-1', cell: { row: 4, col: 1 } })
    expect(copy.tile!.stamp).toBeUndefined()
    const back = ok(made, [{ kind: 'move_card', card: { id: copy.id }, lane: 'Tiles' }]).workshop
    expect(back.cards.find(item => item.id === copy.id)!.cell).toBeUndefined()
    expect(refused(back, [{ kind: 'move_card', card: { id: copy.id }, lane: 'Page 1' }]).reason).toBe('Say where on the page: row and column.')
  })

  it('a limit refuses with its own sentence and may be broken anyway; an overlap never may', () => {
    const board = sheet()
    const limit = refused(board, [{ kind: 'place_tile', card: 'Heading', page: 'Page 1', row: 5, col: 1 }])
    expect(limit.reason).toBe('Page 1 already has its 1 heading.')
    expect(limit.overridable).toBe(true)
    const anyway = ok(board, [{ kind: 'place_tile', card: 'Heading', page: 'Page 1', row: 5, col: 1, override: true }])
    expect(anyway.workshop.cards.at(-1)!.override).toMatchObject({ by: 'Tim', sentence: 'Page 1 already has its 1 heading.' })
    const overlap = refused(board, [{ kind: 'place_tile', card: 'Question', page: 'Page 1', row: 2, col: 1 }])
    expect(overlap.overridable).toBeUndefined()
    expect(refused(board, [{ kind: 'place_tile', card: 'Question', page: 'Page 1', row: 2, col: 1, override: true }]).reason).toBe('That cell holds “Adding fractions”.')
  })

  it('a sheet’s tiles: another kind is refused, and may be added anyway', () => {
    const board = ok(sheet(), [{ kind: 'add_rule', rule: { kind: 'tileTypes', types: ['heading', 'question', 'answer-lines', 'word-bank'] } as never }]).workshop
    expect(ruleSentence(board.behaviour!.rules.at(-1)!, board)).toBe('This sheet uses headings, questions, answer lines and word banks.')
    expect(refused(board, [{ kind: 'add_tile', type: 'qr', label: 'Class site', link: 'https://example.org' }]).reason).toBe('QR codes aren’t one of this sheet’s tiles.')
    const pictures = ok(sheet(), [{ kind: 'add_rule', rule: { kind: 'tileSpan', type: 'image', rows: 2, cols: 2 } as never }]).workshop
    expect(ruleSentence(pictures.behaviour!.rules.at(-1)!, pictures)).toBe('Pictures can span up to 2 by 2 cells.')
  })

  it('what a page needs never blocks a drag: it is said in the caption and before printing', () => {
    const board = sheet()
    const empty = ok(board, [{ kind: 'add_page' }]).workshop
    expect(gridCaption(empty, 'page-2')).toBe('Letter · 6 × 2 · 0 of 12 cells · Needs a heading')
    expect(gridCaption(empty, 'page-1')).toBe('Letter · 6 × 2 · 9 of 12 cells')
    expect(gridPrintProblems(empty)).toEqual(['Page 2 needs a heading.'])
    // A question dropped on the page that needs a heading lands.
    expect(() => ok(empty, [{ kind: 'place_tile', card: 'Question', page: 'Page 2', row: 2, col: 1 }])).not.toThrow()
  })

  it('a rulebook that contradicts itself is refused in words; the note’s lines are the rules’ sentences', () => {
    const board = sheet()
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'tileNeeds', type: 'heading', atLeast: 2, per: 'page' } as never }]).reason)
      .toBe('Every page needs 2 headings, but a page holds at most 1.')
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'tileTypes', types: ['question', 'answer-lines', 'word-bank'] } as never }]).reason)
      .toBe('Every page needs a heading, but headings aren’t one of this sheet’s tiles.')
  }, 10000)

  it('the note’s lines', () => {
    expect(behaviourLines(sheet())).toEqual(['Tiles snap to free cells; none overlap.', 'A page holds at most 1 heading.', 'Every page needs a heading.', 'A page holds at most 6 questions.'])
  })

  it('a note makes the tile its words say', () => {
    const board = sheet()
    expect(gridFromNote(board, 'Plants need light', 'New tile')).toEqual({ label: 'Plants need light', type: 'text' })
    expect(gridFromNote(board, 'Question 1 What grows?', 'New tile', { id: 'n', label: 'Question 1 What grows?', asNote: { text: 'Question 1\nWhat grows?' } }))
      .toEqual({ label: 'Question 1', type: 'question', body: 'What grows?' })
    expect(gridFromNote(board, 'A fern', 'New tile', { id: 'n', label: 'A fern', asNote: { image: { src: 'https://example.org/fern.png' } } }))
      .toEqual({ label: 'A fern', type: 'image', image: { src: 'https://example.org/fern.png', alt: 'A fern' } })
  })

  it('gridSheet makes a sheet from stamps and tiles', () => {
    const made = validateWorkshop(gridSheet('Tiny', { page: { size: 'letter', orientation: 'portrait', margin: 0.5 }, cells: { rows: 2, cols: 2, gutter: 0.125 } },
      [['Term', { type: 'term' }]], [['Sun', { type: 'term' }, { row: 0, col: 0 }]], [{ kind: 'tileTypes', types: ['term'] }]))
    expect(made.cards.map(item => [item.laneId, item.label])).toEqual([['tray', 'Term'], ['page-1', 'Sun']])
  })
})

describe('what a tile says', () => {
  it('says a name once when its words already say it', async () => {
    const { gridCardText } = await import('../../src/workshops/rules')
    const board = validateWorkshop(worksheetSample())
    const tile = (label: string, t: Record<string, unknown>) => ({ id: 'x', label, laneId: 'tray', tile: t }) as never
    expect(gridCardText(board, tile('What fraction is shaded?', { type: 'question', body: 'What fraction is shaded? The circle is split in two.' }))).toBe('What fraction is shaded? The circle is split in two.')
    expect(gridCardText(board, tile('Shade the bar', { type: 'question', body: 'Shade 3/8 of the bar.' }))).toBe('Shade the bar\nShade 3/8 of the bar.')
    expect(gridCardText(board, tile('half, third, whole', { type: 'word-bank', words: ['half', 'third', 'whole'] }))).toBe('half · third · whole')
    expect(gridCardText(board, tile('Words to use', { type: 'word-bank', words: ['half', 'third', 'whole'] }))).toBe('Words to use\nhalf · third · whole')
  })
})
