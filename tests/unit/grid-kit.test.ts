// The grid kit (snap-grid spec §4): every tile a note exactly at its cell's box, a held tile that snaps to the cell under
// its corner (or the nearest free one, or stays), a stamp that copies itself and stays, the tray, the keys, ordinary
// notes dropped on a page, a tile dragged off the board as a note again, and guides no export shows.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, workshopCardNoteWords, workshopNoteCandidate, workshopNoteRefusal, type BoardLayerState, type Workshop } from '../../src/workshops/model'
import '../../src/workshops/behaviour'
import { cellBox, worksheetSample } from '../../src/workshops/rules'
import { kitFor } from '../../src/boards'
import { gridFrames, gridKit, gridLayout, gridPrintPages } from '../../src/boards/grid'
import { partNotes } from '../../src/boards/readouts'

const sheet = () => validateWorkshop(worksheetSample())
const part = (board: Workshop, name: string) => gridLayout(board).parts.find(item => item.name === name)!
const byLabel = (board: Workshop, label: string) => board.cards.find(card => card.label === label)!
/** The pointer that holds a tile by its top-left corner (grab 0) over a page's cell, in board coordinates. */
const over = (board: Workshop, row: number, col: number, dx = 4, dy = 4) => {
  const page = gridFrames(board).pages[0], box = cellBox(board.grid!, { row, col })
  return { x: page.x + box.x + dx, y: page.y + box.y + dy }
}

describe('the grid kit', () => {
  it('is the grid sheet’s kit once slateboxjs/boards/grid loads', () => {
    expect(kitFor('grid')).toBe(gridKit)
  })

  it('draws each tile as a note exactly at its cell’s box, on a page note at true size', () => {
    const board = sheet()
    const page = part(board, 'column-page-1')
    expect({ width: page.width, height: page.height }).toEqual({ width: 816, height: 1056 })
    const notes = partNotes(gridLayout(board).parts, board, { x: 100, y: 50 }, {})
    for (const card of board.cards.filter(item => item.laneId === 'page-1')) {
      const box = cellBox(board.grid!, card.cell!)
      const note = notes.find(item => item.options.id === 'card-' + card.id)!.options
      expect({ x: note.xPos, y: note.yPos, width: note.width, height: note.height }).toEqual({ x: 100 + page.x + box.x, y: 50 + page.y + box.y, width: box.width, height: box.height })
    }
    expect(gridPrintPages(board, {}, { x: 100, y: 50 })[0]).toMatchObject({ pageId: 'page-1', frame: { x: 100 + page.x, y: 50 + page.y, width: 816, height: 1056 }, size: { in: [8.5, 11], pt: [612, 792] } })
  })

  it('a stamp held over a free cell makes a copy there, and the stamp stays in the tray', () => {
    const board = sheet()
    const stamp = byLabel(board, 'Question')
    const next = gridKit.chooser(board, stamp.id, { x: 0, y: 0 })!(over(board, 4, 1))
    expect(next.cards.find(card => card.id === stamp.id)).toMatchObject({ laneId: 'tray', tile: { stamp: true } })
    const copy = next.cards.at(-1)!
    expect(copy).toMatchObject({ label: 'Question', laneId: 'page-1', cell: { row: 4, col: 1 } })
  })

  it('over a taken cell it snaps to the nearest free cell within one; with none it stays and says why', () => {
    const board = sheet()
    const stamp = byLabel(board, 'Question')
    // Row 4, column 1 (0-based 3, 0) holds “Compare”; the free cell beside it (3, 1) is the nearest.
    const near = gridKit.chooser(board, stamp.id, { x: 0, y: 0 })!(over(board, 3, 0, 300, 4))
    expect(near.cards.at(-1)!.cell).toEqual({ row: 3, col: 1 })
    // A board whose page is full around row 1: the tile stays where it was.
    const full = validateWorkshop({ ...board, cards: [...board.cards, { id: 'f1', label: 'Filler one', laneId: 'page-1', tile: { type: 'text' }, cell: { row: 3, col: 1 } },
      { id: 'f2', label: 'Filler two', laneId: 'page-1', tile: { type: 'text' }, cell: { row: 4, col: 0 } }, { id: 'f3', label: 'Filler three', laneId: 'page-1', tile: { type: 'text' }, cell: { row: 4, col: 1 } }] })
    const held = gridKit.chooser(full, stamp.id, { x: 0, y: 0 })!(over(full, 1, 0))
    expect(held).toBe(full)
    expect(gridKit.refusalAt(full, stamp.id, { x: 0, y: 0 }, over(full, 1, 0), {})).toEqual({ laneId: 'page-1', reason: 'That cell holds “Adding fractions”.' })
  })

  it('a limit refuses with its sentence and offers Move anyway; a tile held over the tray goes back to it, its cell cleared', () => {
    const board = sheet()
    const refusal = gridKit.refusalAt(board, byLabel(board, 'Heading').id, { x: 0, y: 0 }, over(board, 4, 0), {})!
    expect(refusal.reason).toBe('Page 1 already has its 1 heading.')
    expect(refusal.override?.edit).toMatchObject({ kind: 'place_tile', row: 5, col: 1, override: true })
    const tile = byLabel(board, 'Compare')
    const tray = part(board, 'column-tray')
    const back = gridKit.chooser(board, tile.id, { x: 0, y: 0 })!({ x: tray.x + 20, y: tray.y + 400 })
    expect(back.cards.find(card => card.id === tile.id)!.laneId).toBe('tray')
    expect(back.cards.find(card => card.id === tile.id)!.cell).toBeUndefined()
  })

  it('keys: arrows move a cell, Shift and an arrow grow or shrink it within its rule, Delete puts it back in the tray', () => {
    const board = sheet()
    const compare = 'card-' + byLabel(board, 'Compare').id
    expect(gridKit.keyEdit!(board, compare, { key: 'ArrowRight', shiftKey: false })).toEqual([{ kind: 'place_tile', card: { id: byLabel(board, 'Compare').id }, page: { id: 'page-1' }, row: 4, col: 2, rows: 1, cols: 1 }])
    expect(gridKit.keyEdit!(board, compare, { key: 'ArrowDown', shiftKey: true })).toEqual([{ kind: 'place_tile', card: { id: byLabel(board, 'Compare').id }, page: { id: 'page-1' }, row: 4, col: 1, rows: 2, cols: 1 }])
    expect(gridKit.keyEdit!(board, compare, { key: 'ArrowLeft', shiftKey: false })).toBeNull()
    expect(gridKit.keyEdit!(board, compare, { key: 'Delete', shiftKey: false })).toEqual([{ kind: 'place_tile', card: { id: byLabel(board, 'Compare').id }, page: { id: 'tray' }, row: 1, col: 1 }])
    // A span rule holds Shift and an arrow to it.
    const ruled = validateWorkshop({ ...board, behaviour: { ...board.behaviour!, rules: [...board.behaviour!.rules,
      { id: 'span', kind: 'tileSpan', type: 'question', rows: 1, cols: 1, on: true, severity: 'refuse', set: { by: 'Tim', at: '2026-11-25T00:00:00.000Z', via: 'chat' } } as never] } })
    const bigger = gridKit.keyEdit!(ruled, compare, { key: 'ArrowDown', shiftKey: true })!
    expect((applyWorkshopEdits(ruled, bigger) as { refused: { reason: string } }).refused.reason).toBe('Questions can span up to 1 by 1 cells.')
  })

  it('an ordinary note dropped on a page becomes the tile its words make, in the cell under it', () => {
    const board = sheet()
    const plain = workshopNoteCandidate(board, 'page-1', { id: 'n1', label: 'Show every step.', cell: { row: 5, col: 2 } })!
    expect(plain.cards.at(-1)).toMatchObject({ id: 'n1', label: 'Show every step.', laneId: 'page-1', tile: { type: 'text' }, cell: { row: 4, col: 1 } })
    const asked = workshopNoteCandidate(board, 'page-1', { id: 'n2', label: 'Seeds What do seeds need?', asNote: { text: 'Seeds\nWhat do seeds need?' }, cell: { row: 5, col: 2 } })!
    expect(asked.cards.at(-1)).toMatchObject({ label: 'Seeds', tile: { type: 'question', body: 'What do seeds need?' } })
    const picture = workshopNoteCandidate(board, 'page-1', { id: 'n3', label: 'A fern', asNote: { image: { src: 'https://example.org/fern.png', width: 300, height: 200 } }, cell: { row: 5, col: 2 } })!
    expect(picture.cards.at(-1)).toMatchObject({ tile: { type: 'image', image: { src: 'https://example.org/fern.png', alt: 'A fern' } }, asNote: { image: { src: 'https://example.org/fern.png' } } })
    expect(workshopNoteRefusal(board, 'page-1', { id: 'n4', label: 'Taken', cell: { row: 2, col: 1 } })).toBe('That cell holds “Adding fractions”.')
    // The tile off the board is a note again, with its words.
    expect(workshopCardNoteWords(asked, asked.cards.at(-1)!)).toBe('Seeds\nWhat do seeds need?')
    expect(workshopCardNoteWords(board, byLabel(board, 'Words to use'))).toBe('Words to use\nnumerator, denominator, equivalent, whole')
    // A 25th note lands: a sheet holds 120 tiles.
    let many = board
    for (let i = many.cards.length; i < 25; i++) many = workshopNoteCandidate(many, 'tray', { id: 'm' + i, label: 'Term ' + i })!
    expect(workshopNoteCandidate(many, 'tray', { id: 'm25', label: 'Twenty-fifth' })).not.toBeNull()
  })

  it('the cell guides are for the view only: the layer is marked data-export-never', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const layer = gridKit.layer({ canvas: { node: svg } })
    const state: BoardLayerState = { origin: { x: 0, y: 0 }, layout: {}, clamp: null, refused: false }
    layer.draw(sheet(), null, state)
    const group = svg.querySelector('[data-board-layer]')!
    expect(group.hasAttribute('data-export-never')).toBe(true)
    expect(group.querySelectorAll('[data-board-layer="grid-cell"]').length).toBe(12)
    layer.destroy()
  })

  it('edits between two sheets replay a drag: a stamp’s copy, a move, a tile back to the tray', () => {
    const board = sheet()
    const stamp = byLabel(board, 'Question')
    const copied = gridKit.chooser(board, stamp.id, { x: 0, y: 0 })!(over(board, 4, 1))
    const edits = gridKit.editsBetween(board, copied)
    expect(edits).toEqual([{ kind: 'add_tile', type: 'question', label: 'Question', body: 'What is 1/2 + 1/4?', page: { id: 'page-1' }, row: 5, col: 2 }])
    expect((applyWorkshopEdits(board, edits) as { workshop: Workshop }).workshop.cards).toEqual(copied.cards)
    const moved = gridKit.chooser(copied, byLabel(copied, 'Compare').id, { x: 0, y: 0 })!(over(copied, 4, 0))
    expect((applyWorkshopEdits(copied, gridKit.editsBetween(copied, moved)) as { workshop: Workshop }).workshop.cards).toEqual(moved.cards)
  })
})
