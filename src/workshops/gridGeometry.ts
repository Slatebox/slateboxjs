// A grid sheet's geometry (snap-grid spec §1): pure numbers, no DOM, no drawing.
//
// A sheet is a page of equal cells. Sizes are kept in inches on the board (margin, gutter) and drawn at 96 px per inch,
// rounded to 2 decimals, so a Letter portrait page is 816 × 1056 and its cells are the same box on the canvas, in the
// print and in the PDF. Rows and columns are 0-based here (stored), 1-based in every sentence a person reads.
import type { Workshop, WorkshopCard } from './model'

export const PX_PER_INCH = 96
/** The smallest a cell may be either way: three quarters of an inch. */
export const MIN_CELL = 72

export type GridPageSize = 'letter' | 'a4'
export type GridOrientation = 'portrait' | 'landscape'
export interface GridFields {
  page: { size: GridPageSize; orientation: GridOrientation; margin: number }
  cells: { rows: number; cols: number; gutter: number }
}
export interface GridCell { row: number; col: number; rows?: number; cols?: number }
export interface Box { x: number; y: number; width: number; height: number }

const r2 = (n: number) => Math.round(n * 100) / 100
const pages: Record<GridPageSize, [number, number]> = { letter: [816, 1056], a4: [793.7, 1122.52] }
/** A page's size in inches and in PDF points, for a print and a PDF of it. */
const inches: Record<GridPageSize, [number, number]> = { letter: [8.5, 11], a4: [8.27, 11.69] }
const points: Record<GridPageSize, [number, number]> = { letter: [612, 792], a4: [595.28, 841.89] }
const turned = <T>(pair: [T, T], orientation: GridOrientation): [T, T] => orientation === 'landscape' ? [pair[1], pair[0]] : pair

/** "Letter", "A4". */
export const pageName = (size: GridPageSize) => size === 'a4' ? 'A4' : 'Letter'

/** The page in px (96 per inch), turned for landscape. */
export function pageSize(fields: Pick<GridFields, 'page'>): { width: number; height: number } {
  const [width, height] = turned(pages[fields.page.size], fields.page.orientation)
  return { width, height }
}

/** The page as a print and a PDF size it: inches (CSS @page, the svg's width) and points (pdf-lib). */
export function printSize(fields: Pick<GridFields, 'page'>): { in: [number, number]; pt: [number, number] } {
  return { in: turned(inches[fields.page.size], fields.page.orientation), pt: turned(points[fields.page.size], fields.page.orientation) }
}

/** One cell's size in px: what is left of the page after its margins and gutters, shared equally. */
export function cellSize(fields: GridFields): { width: number; height: number } {
  const { width: W, height: H } = pageSize(fields)
  const m = fields.page.margin * PX_PER_INCH, g = fields.cells.gutter * PX_PER_INCH
  return { width: r2((W - 2 * m - (fields.cells.cols - 1) * g) / fields.cells.cols), height: r2((H - 2 * m - (fields.cells.rows - 1) * g) / fields.cells.rows) }
}

/** The most columns (or rows) this page takes with cells at least ¾ inch across. */
function most(fields: GridFields, along: 'cols' | 'rows'): number {
  for (let n = along === 'cols' ? 8 : 12; n > 1; n--) {
    const size = cellSize({ ...fields, cells: { ...fields.cells, [along]: n } })
    if ((along === 'cols' ? size.width : size.height) >= MIN_CELL) return n
  }
  return 1
}

/** Why this page and grid make cells too small, as a sentence; null when every cell is at least ¾ inch either way. */
export function cellSizeProblem(fields: GridFields): string | null {
  const size = cellSize(fields)
  const on = pageName(fields.page.size) + ' ' + fields.page.orientation
  if (size.width < MIN_CELL) {
    const n = most(fields, 'cols')
    return `Cells would be under ¾ inch wide: use ${n} ${n === 1 ? 'column' : 'columns'} or fewer on ${on}.`
  }
  if (size.height < MIN_CELL) {
    const n = most(fields, 'rows')
    return `Cells would be under ¾ inch tall: use ${n} ${n === 1 ? 'row' : 'rows'} or fewer on ${on}.`
  }
  return null
}

/** A cell's span, 1 by 1 when it says none. */
export const spanOf = (cell: GridCell) => ({ rows: cell.rows ?? 1, cols: cell.cols ?? 1 })

/** The box of a (spanned) cell on its page, in px from the page's top-left corner: the gutters it covers included. */
export function cellBox(fields: GridFields, cell: GridCell): Box {
  const size = cellSize(fields)
  const m = fields.page.margin * PX_PER_INCH, g = fields.cells.gutter * PX_PER_INCH
  const { rows, cols } = spanOf(cell)
  return { x: r2(m + cell.col * (size.width + g)), y: r2(m + cell.row * (size.height + g)),
    width: r2(cols * size.width + (cols - 1) * g), height: r2(rows * size.height + (rows - 1) * g) }
}

/** The cell under a point on the page (px from its top-left corner): the nearest one within the margins; null off the page. */
export function cellAt(fields: GridFields, point: { x: number; y: number }): { row: number; col: number } | null {
  const { width: W, height: H } = pageSize(fields)
  if (point.x < 0 || point.y < 0 || point.x > W || point.y > H) return null
  const size = cellSize(fields)
  const m = fields.page.margin * PX_PER_INCH, g = fields.cells.gutter * PX_PER_INCH
  const clamp = (n: number, top: number) => Math.max(0, Math.min(top - 1, n))
  return { row: clamp(Math.floor((point.y - m + g / 2) / (size.height + g)), fields.cells.rows), col: clamp(Math.floor((point.x - m + g / 2) / (size.width + g)), fields.cells.cols) }
}

/** Whether a span at a cell stays inside the grid. */
export const inBounds = (fields: GridFields, cell: GridCell) => {
  const { rows, cols } = spanOf(cell)
  return cell.row >= 0 && cell.col >= 0 && cell.row + rows <= fields.cells.rows && cell.col + cols <= fields.cells.cols
}

const keysOf = (cell: GridCell) => {
  const { rows, cols } = spanOf(cell)
  const out: string[] = []
  for (let r = cell.row; r < cell.row + rows; r++) for (let c = cell.col; c < cell.col + cols; c++) out.push(r + ':' + c)
  return out
}

type Placed = Pick<Workshop, 'cards'>
const placedOn = (board: Placed, pageId: string) => board.cards.filter(card => card.laneId === pageId && card.cell)

/** Which tile holds each cell of a page ("row:col" → card id). */
export function occupancy(board: Placed, pageId: string, exceptId?: string): Map<string, string> {
  const held = new Map<string, string>()
  for (const card of placedOn(board, pageId)) {
    if (card.id === exceptId) continue
    for (const key of keysOf(card.cell!)) if (!held.has(key)) held.set(key, card.id)
  }
  return held
}

/** Whether a span fits at a cell of a page: null when it does, else why ('bounds', or the tile that holds a cell it needs). */
export function fits(board: Placed & { grid?: GridFields }, pageId: string, cell: GridCell, exceptId?: string): null | { reason: 'bounds' } | { reason: 'taken'; by: string } {
  if (!board.grid || !inBounds(board.grid, cell)) return { reason: 'bounds' }
  const held = occupancy(board, pageId, exceptId)
  for (const key of keysOf(cell)) {
    const by = held.get(key)
    if (by) return { reason: 'taken', by }
  }
  return null
}

/** Every cell of a page where a span fits, in reading order (row by row). */
export function freeCells(board: Placed & { grid?: GridFields }, pageId: string, span: { rows?: number; cols?: number } = {}, exceptId?: string): { row: number; col: number }[] {
  const grid = board.grid
  if (!grid) return []
  const out: { row: number; col: number }[] = []
  for (let row = 0; row < grid.cells.rows; row++) for (let col = 0; col < grid.cells.cols; col++) {
    if (!fits(board, pageId, { row, col, ...span }, exceptId)) out.push({ row, col })
  }
  return out
}

/** How many cells of a page tiles cover. */
export const usedCells = (board: Placed, pageId: string) => occupancy(board, pageId).size

/** Cards in reading order: by page, then row, then column. */
export function readingOrder(board: Pick<Workshop, 'cards' | 'lanes'>): WorkshopCard[] {
  const page = (card: WorkshopCard) => board.lanes.findIndex(lane => lane.id === card.laneId)
  return [...board.cards].sort((a, b) => page(a) - page(b) || (a.cell?.row ?? 0) - (b.cell?.row ?? 0) || (a.cell?.col ?? 0) - (b.cell?.col ?? 0))
}

/**
 * The board with every placed tile in a cell of the grid it has now (after its page or grid changed): a tile keeps its
 * cell when it still fits; otherwise, in reading order, it takes the first free cell that fits its span, its span
 * shrunk to fit when no cell takes it whole. A tile that still finds no room goes back to the tray (its cell cleared),
 * and is named in `sent`, with why.
 */
export function reflow<T extends Workshop>(board: T, trayId: string): { board: T; sent: { label: string; span: { rows: number; cols: number } }[] } {
  const grid = board.grid!
  const placed = readingOrder(board).filter(card => card.cell && card.laneId !== trayId)
  const kept: WorkshopCard[] = board.cards.filter(card => !card.cell || card.laneId === trayId).map(card => ({ ...card }))
  const sent: { label: string; span: { rows: number; cols: number } }[] = []
  const later: WorkshopCard[] = []
  const so = () => ({ cards: kept, grid })
  for (const card of placed) {
    const cell = { ...card.cell! }
    if (inBounds(grid, cell) && !fits(so(), card.laneId, cell)) kept.push({ ...card, cell })
    else later.push(card)
  }
  for (const card of later) {
    const want = spanOf(card.cell!)
    const spans: { rows: number; cols: number }[] = []
    for (let rows = Math.min(want.rows, grid.cells.rows); rows >= 1; rows--) for (let cols = Math.min(want.cols, grid.cells.cols); cols >= 1; cols--) spans.push({ rows, cols })
    spans.sort((a, b) => b.rows * b.cols - a.rows * a.cols)
    let landed = false
    for (const span of spans) {
      const free = freeCells(so(), card.laneId, span)[0]
      if (!free) continue
      const cell: GridCell = { row: free.row, col: free.col, ...(span.rows > 1 && { rows: span.rows }), ...(span.cols > 1 && { cols: span.cols }) }
      kept.push({ ...card, cell })
      landed = true
      break
    }
    if (!landed) {
      const { cell: _, ...loose } = card
      kept.push({ ...loose, laneId: trayId })
      sent.push({ label: card.label, span: want })
    }
  }
  const order = new Map(board.cards.map((card, i) => [card.id, i]))
  kept.sort((a, b) => order.get(a.id)! - order.get(b.id)!)
  return { board: { ...board, cards: kept }, sent }
}
