// A grid sheet's geometry (snap-grid spec §1): true page sizes at 96 px per inch, cells that share what the margins and
// gutters leave, spans that cover their gutters, the smallest cell a page takes, and the cell under a point.
import { describe, expect, it } from 'vitest'
import { cellAt, cellBox, cellSize, cellSizeProblem, freeCells, pageSize, printSize, reflow, type GridFields } from '../../src/workshops/gridGeometry'
import type { Workshop } from '../../src/workshops/model'

const letter = (rows: number, cols: number, gutter = 0.125): GridFields => ({ page: { size: 'letter', orientation: 'portrait', margin: 0.5 }, cells: { rows, cols, gutter } })

describe('grid geometry', () => {
  it('a Letter portrait page of 4 by 2 cells has cells of exactly 354 × 231', () => {
    expect(pageSize(letter(4, 2))).toEqual({ width: 816, height: 1056 })
    expect(cellSize(letter(4, 2))).toEqual({ width: 354, height: 231 })
    expect(cellBox(letter(4, 2), { row: 0, col: 0 })).toEqual({ x: 48, y: 48, width: 354, height: 231 })
    expect(cellBox(letter(4, 2), { row: 3, col: 1 })).toEqual({ x: 414, y: 777, width: 354, height: 231 })
  })

  it('A4 landscape turns the page, and its 3 by 4 cells share it', () => {
    const a4: GridFields = { page: { size: 'a4', orientation: 'landscape', margin: 0.5 }, cells: { rows: 3, cols: 4, gutter: 0.125 } }
    expect(pageSize(a4)).toEqual({ width: 1122.52, height: 793.7 })
    expect(cellSize(a4)).toEqual({ width: 247.63, height: 224.57 })
    expect(printSize(a4)).toEqual({ in: [11.69, 8.27], pt: [841.89, 595.28] })
    expect(printSize(letter(4, 2))).toEqual({ in: [8.5, 11], pt: [612, 792] })
  })

  it('a span covers the gutters between its cells', () => {
    expect(cellBox(letter(4, 2), { row: 1, col: 0, rows: 2, cols: 2 })).toEqual({ x: 48, y: 291, width: 354 * 2 + 12, height: 231 * 2 + 12 })
  })

  it('cells under ¾ inch are refused, in words that say how many fit', () => {
    expect(cellSizeProblem(letter(4, 2))).toBeNull()
    const wide: GridFields = { page: { size: 'letter', orientation: 'portrait', margin: 1 }, cells: { rows: 4, cols: 8, gutter: 0.25 } }
    expect(cellSizeProblem(wide)).toBe('Cells would be under ¾ inch wide: use 6 columns or fewer on Letter portrait.')
    expect(cellSizeProblem(letter(12, 2, 0.5))).toBe('Cells would be under ¾ inch tall: use 8 rows or fewer on Letter portrait.')
  })

  it('cellAt reads back the cell a box was drawn at, every cell of the page', () => {
    const grid = letter(6, 5)
    for (let row = 0; row < 6; row++) for (let col = 0; col < 5; col++) {
      const box = cellBox(grid, { row, col })
      expect(cellAt(grid, { x: box.x + box.width / 2, y: box.y + box.height / 2 })).toEqual({ row, col })
      expect(cellAt(grid, { x: box.x + 1, y: box.y + 1 })).toEqual({ row, col })
    }
    expect(cellAt(grid, { x: 2, y: 2 })).toEqual({ row: 0, col: 0 })
    expect(cellAt(grid, { x: -5, y: 10 })).toBeNull()
  })

  it('free cells and a reflow that keeps, moves, shrinks or sends a tile back', () => {
    const board = { version: 1, kind: 'grid', title: 't', grid: letter(2, 3), lanes: [{ id: 'tray', label: 'Tiles' }, { id: 'page-1', label: 'Page 1' }], cards: [
      { id: 'a', label: 'Map', laneId: 'page-1', tile: { type: 'image' }, cell: { row: 0, col: 1, rows: 2, cols: 2 } },
      { id: 'b', label: 'Title', laneId: 'page-1', tile: { type: 'heading' }, cell: { row: 0, col: 0 } },
    ] } as unknown as Workshop
    expect(freeCells(board, 'page-1')).toEqual([{ row: 1, col: 0 }])
    const two = reflow({ ...board, grid: letter(2, 2) }, 'tray')
    expect(two.board.cards.find(card => card.id === 'a')!.cell).toEqual({ row: 0, col: 1, rows: 2 })
    expect(two.sent).toEqual([])
    const one = reflow({ ...board, grid: letter(1, 1) }, 'tray')
    expect(one.board.cards.find(card => card.id === 'b')!.cell).toEqual({ row: 0, col: 0 })
    expect(one.board.cards.find(card => card.id === 'a')).toMatchObject({ laneId: 'tray' })
    expect(one.board.cards.find(card => card.id === 'a')!.cell).toBeUndefined()
    expect(one.sent).toEqual([{ label: 'Map', span: { rows: 2, cols: 2 } }])
  })
})
