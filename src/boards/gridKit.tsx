// Grid kit (snap-grid spec §4): a grid sheet on a live slate, as real notes. The tray of tiles down the left; the pages
// side by side to its right, each a white note at true page size (Letter 816 × 1056 at 96 px per inch); every tile a
// note exactly at its cell's box. A held tile snaps to the cell under its top-left corner when that cell is free for its
// span, else to the nearest free cell within one cell, else it stays where it was. A stamp held over a page makes a copy
// there and stays in the tray. Over the tray a tile goes back to it. The cells and margins are drawn faintly on the
// board layer, for the view only: no print or PDF shows them. On a phone a page is scaled to the screen's width and the
// tray goes under the pages; the notes are always what is true.
import {
  appearanceEditsBetween, applyWorkshopEdits, type BoardLayerState, type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopCard, type WorkshopEdit,
} from '../workshops/model'
import {
  GRID_TRAY, cellAt, cellBox, cellSize, defaultSpan, gridCaption, gridCardText, gridPages, pageSize, printSize, spanOf, tileName, type GridCell,
} from '../workshops/grid'
import { gridQrPicture } from '../workshops/gridQr'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { inside } from '../workshops/boardSpecs'
import { tint, withMark } from './shared'
import { partNotes } from './readouts'
import { HEADER_SLOT } from '../workshops/laneHeader'

const TRAY = 220, TOP = 84, GAP = 48, STACK = 8
const r2 = (n: number) => Math.round(n * 100) / 100

/** Where each page and the tray sit, and the scale a page is drawn at (1, or less on a phone). */
export function gridFrames(board: Workshop, layout: WorkshopBoardLayout = {}) {
  const grid = board.grid!
  const page = pageSize(grid)
  const narrow = Boolean(layout.narrow)
  const scale = narrow ? Math.min(1, Math.max(280, (layout.width ?? 358) - 16) / page.width) : 1
  const w = r2(page.width * scale), h = r2(page.height * scale)
  const pages = gridPages(board).map((lane, i) => narrow
    ? { id: lane.id, x: 8, y: TOP + i * (h + TOP), width: w, height: h }
    : { id: lane.id, x: TRAY + 24 + i * (w + GAP), y: TOP, width: w, height: h })
  // A tray tile is drawn at a cell's size, scaled to the tray's width.
  const cell = cellSize(grid)
  const trayWidth = narrow ? w : TRAY - 16
  const tile = { width: r2(Math.min(trayWidth, cell.width)), height: r2(Math.min(trayWidth, cell.width) * cell.height / cell.width) }
  const below = narrow ? (pages.at(-1)!.y + h + 24) : 0
  return { scale, pages, tile, narrow, tray: narrow ? { x: 2, y: below, width: w + 12 } : { x: 2, y: 0, width: TRAY - 4 } }
}

/** A tile's box on the board (page origin plus its cell's box, at the page's scale). */
function tileBox(board: Workshop, frame: { x: number; y: number }, scale: number, cell: GridCell) {
  const box = cellBox(board.grid!, cell)
  return { x: r2(frame.x + box.x * scale), y: r2(frame.y + box.y * scale), width: r2(box.width * scale), height: r2(box.height * scale) }
}

const rounded = (w: number, h: number, r: number) => `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`
/** A speech bubble: rounded, with a tail at its foot on the left. */
const bubble = (w: number, h: number) => {
  const r = Math.min(18, w / 4, h / 4), b = Math.max(r * 2, h - 16), tx = Math.min(w / 3, 40)
  return `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${b - r} Q ${w} ${b} ${w - r} ${b} H ${tx + 18} L ${tx} ${h} L ${tx + 4} ${b} H ${r} Q 0 ${b} 0 ${b - r} V ${r} Q 0 0 ${r} 0 Z`
}
/** A box with N rules across it, under its name: answer lines. */
const ruled = (w: number, h: number, lines: number, top: number) => {
  const gap = (h - top - 8) / Math.max(1, lines)
  let d = `M 0 0 H ${w} V ${h} H 0 Z`
  for (let i = 1; i <= lines; i++) d += ` M 10 ${r2(top + gap * i)} H ${r2(w - 10)}`
  return d
}
const lineCount = (card: WorkshopCard) => Math.max(1, Math.min(20, Number.parseInt(card.tile?.body ?? '', 10) || 3))

/** How one tile is drawn: one table, every kind (spec §4 "Tile looks"). */
export function tileLook(board: Workshop, card: WorkshopCard, box: { width: number; height: number }, scale = 1): Omit<PartPlace, 'name' | 'x' | 'y' | 'width' | 'height'> {
  const tile = card.tile!
  const words = withMark(gridCardText(board, card), card)
  const s = (n: number) => Math.max(8, Math.round(n * scale))
  const page = { fill: '#ffffff', ink: '#1b2421', line: '#3b4643' }
  switch (tile.type) {
    case 'heading': return { ...page, text: words, weight: 'bold', fontSize: s(28), lineWidth: 0 }
    case 'text': return { ...page, text: words, fontSize: s(15), lineWidth: 0, textXAlign: 'left', textYAlign: 'top' }
    case 'question': return { ...page, text: words, fontSize: s(15), lineWidth: 0, textXAlign: 'left', textYAlign: 'top' }
    case 'answer-lines': return { ...page, text: words, fontSize: s(13), line: '#8a948f', lineWidth: 1, textXAlign: 'left', textYAlign: 'top',
      vectorPath: ruled(box.width, box.height, lineCount(card), Math.min(box.height / 3, s(13) * 1.6 + 8)) }
    case 'word-bank': return { ...page, text: words, fontSize: s(15), lineWidth: 2 }
    case 'image': case 'diagram': return tile.image?.src
      ? { ...page, text: '', lineWidth: 0, image: tile.image.src }
      : { fill: '#f7f8f6', ink: '#5b6662', line: '#8a948f', lineWidth: 1.5, borderStyle: 'dashed', text: words, fontSize: s(14) }
    case 'qr': {
      const src = gridQrPicture(tile.link)
      return src ? { ...page, text: card.label, fontSize: s(12), lineWidth: 0, image: src, textYAlign: 'bottom' }
        : { fill: '#f7f8f6', ink: '#5b6662', line: '#8a948f', lineWidth: 1.5, borderStyle: 'dashed', text: card.label + '\nNo web address yet', fontSize: s(13) }
    }
    case 'panel': return { ...page, text: words, fontSize: s(14), lineWidth: 3, line: '#1b2421', textYAlign: 'bottom', ...(tile.image?.src && { image: tile.image.src }) }
    case 'speech': return { ...page, text: words, fontSize: s(15), lineWidth: 1.5, vectorPath: bubble(box.width, box.height) }
    case 'term': return { ...page, text: words, fontSize: s(20), lineWidth: 1 }
    case 'sticker': return { fill: '#fde68a', ink: '#5b3407', line: '#b45309', lineWidth: 2, text: words, fontSize: s(16), weight: 'bold',
      vectorPath: rounded(box.width, box.height, Math.min(24, box.width / 4, box.height / 4)), ...(tile.image?.src && { image: tile.image.src, textYAlign: 'bottom' }) }
  }
}

/** Where every note of a grid sheet goes, in board coordinates. */
export function gridLayout(board: Workshop, layout: WorkshopBoardLayout = {}): { parts: PartPlace[]; width: number; height: number } {
  const f = gridFrames(board, layout)
  const parts: PartPlace[] = []
  const header = (laneId: string, x: number, y: number, width: number) => {
    parts.push({ name: 'lane-' + laneId, x, y, width: width - HEADER_SLOT, height: 40, text: board.lanes.find(lane => lane.id === laneId)!.label, fill: laneId === GRID_TRAY ? '#e9e5da' : '#d5e9e3', fontSize: 16 })
    parts.push({ name: 'caption-' + laneId, x, y: y + 44, width, height: 26, text: gridCaption(board, laneId), fill: 'transparent', lineWidth: 0, fontSize: 14 })
  }
  for (const page of f.pages) {
    header(page.id, page.x, page.y - TOP + 6, Math.min(page.width, 640))
    parts.push({ name: 'column-' + page.id, x: page.x, y: page.y, width: page.width, height: page.height, fill: '#ffffff', line: '#b8bfb6', lineWidth: 1 })
    for (const card of board.cards.filter(item => item.laneId === page.id && item.cell)) {
      const box = tileBox(board, page, f.scale, card.cell!)
      parts.push({ name: 'card-' + card.id, ...box, ...tileLook(board, card, box, f.scale) })
    }
  }
  // The tray: its stamps first, then tiles taken off a page, stacked at a cell's size.
  const trayTop = f.tray.y
  header(GRID_TRAY, 8, trayTop + 6, f.tray.width - 12)
  const loose = board.cards.filter(card => card.laneId === GRID_TRAY).sort((a, b) => Number(Boolean(b.tile?.stamp)) - Number(Boolean(a.tile?.stamp)))
  let y = trayTop + TOP
  for (const card of loose) {
    const box = { x: 8, y, width: f.tile.width, height: f.tile.height }
    parts.push({ name: 'card-' + card.id, ...box, ...tileLook(board, card, box, f.tile.width / cellSize(board.grid!).width) })
    y += f.tile.height + STACK
  }
  const last = f.pages.at(-1)!
  const width = f.narrow ? last.width + 16 : last.x + last.width + 16
  const trayHeight = y + f.tile.height + 24 - trayTop
  const height = f.narrow ? trayTop + trayHeight : Math.max(TOP + last.height + 24, trayHeight)
  parts.unshift({ name: 'column-' + GRID_TRAY, x: f.tray.x, y: trayTop, width: f.tray.width, height: f.narrow ? trayHeight : height, fill: tint('#e9e5da', 0.5), line: tint('#e9e5da', 0.1) })
  return { parts, width: r2(width), height: r2(height) }
}

/** The faint cell guides and margin lines of each page (data-export-never: for the view only). */
function guides(board: Workshop, state: BoardLayerState): LayerShape[] {
  const f = gridFrames(board, state.layout)
  const grid = board.grid!
  const shapes: LayerShape[] = []
  for (const page of f.pages) {
    const m = grid.page.margin * 96 * f.scale
    shapes.push({ t: 'path', d: `M ${page.x + m} ${page.y + m} H ${page.x + page.width - m} V ${page.y + page.height - m} H ${page.x + m} Z`, color: layerInk.week, width: 1, dash: '6 4', role: 'grid-margin' })
    for (let row = 0; row < grid.cells.rows; row++) for (let col = 0; col < grid.cells.cols; col++) {
      const box = tileBox(board, page, f.scale, { row, col })
      shapes.push({ t: 'rect', x: box.x, y: box.y, w: box.width, h: box.height, color: layerInk.faint, opacity: 0.35, role: 'grid-cell' })
    }
  }
  return shapes
}

/** The page under a point (padded a little), with its frame. */
function pageAt(board: Workshop, point: { x: number; y: number }, layout: WorkshopBoardLayout, pad = 24) {
  const f = gridFrames(board, layout)
  return { f, page: f.pages.find(page => inside(page, point, pad)) ?? null }
}

/** The span a held tile takes on a page: its own there, else its kind's default (a heading the full row). */
function heldSpan(board: Workshop, card: WorkshopCard, pageId: string) {
  return card.laneId === pageId && card.cell ? spanOf(card.cell) : defaultSpan(board, card.tile!.type)
}

type Drop = { board: Workshop } | { refused: string; laneId: string; override?: { edit: WorkshopEdit; to?: string } } | null

/**
 * What letting a tile go at a point makes: placed at the cell under its box's top-left corner (or a stamp's copy
 * there); when that cell is taken or too near the edge for its span, the nearest free cell within one cell; over the
 * tray, back in the tray. Null where it stays as it is.
 */
function gridDrop(board: Workshop, cardId: string, grab: { x: number; y: number }, point: { x: number; y: number }, layout: WorkshopBoardLayout): Drop {
  const card = board.cards.find(item => item.id === cardId)
  if (!card?.tile) return null
  const { f, page } = pageAt(board, point, layout)
  if (!page) {
    const tray = gridLayout(board, layout).parts.find(part => part.name === 'column-' + GRID_TRAY)
    if (card.laneId === GRID_TRAY || !inside(tray, point)) return null
    const made = applyWorkshopEdits(board, [{ kind: 'place_tile', card: { id: cardId }, page: { id: GRID_TRAY }, row: 1, col: 1 }])
    return 'refused' in made ? null : { board: made.workshop }
  }
  const grid = board.grid!
  const span = heldSpan(board, card, page.id)
  const size = cellSize(grid)
  const box = { x: (point.x - grab.x - page.x) / f.scale, y: (point.y - grab.y - page.y) / f.scale }
  const target = cellAt(grid, { x: Math.min(pageSize(grid).width, Math.max(0, box.x + size.width / 2)), y: Math.min(pageSize(grid).height, Math.max(0, box.y + size.height / 2)) })
  if (!target) return null
  const place = (row: number, col: number, override = false) => applyWorkshopEdits(board, [{ kind: 'place_tile', card: { id: cardId }, page: { id: page.id }, row: row + 1, col: col + 1,
    ...(span.rows > 1 && { rows: span.rows }), ...(span.cols > 1 && { cols: span.cols }), ...(override && { override: true }) }])
  const first = place(target.row, target.col)
  if (!('refused' in first)) return { board: first.workshop }
  // A rule refused it (a limit, the sheet's tiles): no other cell answers that; it may be placed anyway.
  if (first.refused.overridable) {
    return { refused: first.refused.reason, laneId: page.id, override: { edit: { kind: 'place_tile', card: { id: cardId }, page: { id: page.id }, row: target.row + 1, col: target.col + 1,
      ...(span.rows > 1 && { rows: span.rows }), ...(span.cols > 1 && { cols: span.cols }), override: true }, to: 'to ' + board.lanes.find(lane => lane.id === page.id)!.label + ', row ' + (target.row + 1) + ', column ' + (target.col + 1) } }
  }
  // The nearest free cell within one cell of the box's centre.
  const center = { x: box.x + size.width * span.cols / 2, y: box.y + size.height * span.rows / 2 }
  const near: { row: number; col: number; d: number }[] = []
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const row = target.row + dr, col = target.col + dc
    if ((!dr && !dc) || row < 0 || col < 0) continue
    const at = cellBox(grid, { row, col, rows: span.rows, cols: span.cols })
    near.push({ row, col, d: Math.hypot(at.x + at.width / 2 - center.x, at.y + at.height / 2 - center.y) })
  }
  for (const spot of near.sort((a, b) => a.d - b.d)) {
    const made = place(spot.row, spot.col)
    if (!('refused' in made)) return { board: made.workshop }
  }
  return { refused: first.refused.reason, laneId: page.id }
}

/** For a drag: the board each rounded pointer position means, worked out once. */
function gridChooser(board: Workshop, cardId: string, grab: { x: number; y: number }, layout: WorkshopBoardLayout) {
  const seen = new Map<string, Workshop>()
  return (point: { x: number; y: number }) => {
    const key = Math.round(point.x) + ':' + Math.round(point.y)
    if (!seen.has(key)) {
      const made = gridDrop(board, cardId, grab, point, layout)
      if (seen.size > 400) seen.clear()
      seen.set(key, made && 'board' in made ? made.board : board)
    }
    return seen.get(key)!
  }
}

const cellOf = (card: WorkshopCard) => card.cell ? { row: card.cell.row + 1, col: card.cell.col + 1, ...(card.cell.rows && { rows: card.cell.rows }), ...(card.cell.cols && { cols: card.cell.cols }) } : null
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)

/**
 * The edits that turn one grid sheet into another: what a drag, a key, a rename or a kept chat change made. The page and
 * grid first (they reflow), then pages added and removed, tiles removed, new tiles (a stamp's copy is a new tile), then
 * tiles placed (in an order the cells let through: one leaving a cell before another takes it), changed and renamed.
 */
export function gridEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] {
  const pre: WorkshopEdit[] = []
  const a = before.grid!, b = after.grid!
  if (!same(a.page, b.page)) pre.push({ kind: 'set_page', ...(a.page.size !== b.page.size && { size: b.page.size }), ...(a.page.orientation !== b.page.orientation && { orientation: b.page.orientation }),
    ...(a.page.margin !== b.page.margin && { margin: b.page.margin }) })
  if (!same(a.cells, b.cells)) pre.push({ kind: 'set_grid', ...(a.cells.rows !== b.cells.rows && { rows: b.cells.rows }), ...(a.cells.cols !== b.cells.cols && { cols: b.cells.cols }),
    ...(a.cells.gutter !== b.cells.gutter && { gutter: b.cells.gutter }) })
  const apply = (board: Workshop, list: WorkshopEdit[]) => {
    if (!list.length) return board
    const made = applyWorkshopEdits(board, list)
    return 'refused' in made ? board : made.workshop
  }
  const base = apply(before, pre)
  const head: WorkshopEdit[] = []
  for (const lane of after.lanes) if (!base.lanes.some(item => item.id === lane.id)) head.push({ kind: 'add_page', label: lane.label })
  for (const lane of base.lanes) if (!after.lanes.some(item => item.id === lane.id)) head.push({ kind: 'remove_lane', lane: { id: lane.id } })
  const was = new Map(base.cards.map(card => [card.id, card]))
  for (const card of base.cards) if (!after.cards.some(item => item.id === card.id) && after.lanes.some(lane => lane.id === card.laneId)) head.push({ kind: 'remove_card', card: { id: card.id } })
  // Tiles taken off a page first, so the cells they leave are free for what comes next.
  const toTray: WorkshopEdit[] = [], placed: WorkshopEdit[] = [], rest: WorkshopEdit[] = []
  for (const card of after.cards) {
    const old = was.get(card.id)
    const tile = card.tile!
    if (!old) {
      const cell = cellOf(card)
      placed.push({ kind: 'add_tile', type: tile.type, label: card.label, ...(tile.body && { body: tile.body }), ...(tile.words && { words: tile.words }),
        ...(tile.image && (tile.image.src ? { image: { src: tile.image.src, alt: tile.image.alt } } : { alt: tile.image.alt })), ...(tile.link && { link: tile.link }), ...(tile.stamp && { stamp: true }),
        page: { id: card.laneId }, ...(cell ?? {}) } as WorkshopEdit)
      continue
    }
    if (card.laneId === GRID_TRAY && old.laneId !== GRID_TRAY) toTray.push({ kind: 'place_tile', card: { id: card.id }, page: { id: GRID_TRAY }, row: 1, col: 1 })
    else if (card.laneId !== GRID_TRAY && (old.laneId !== card.laneId || !same(old.cell, card.cell))) {
      const cell = cellOf(card)!
      placed.push({ kind: 'place_tile', card: { id: card.id }, page: { id: card.laneId }, row: cell.row, col: cell.col, rows: cell.rows ?? 1, cols: cell.cols ?? 1,
        ...(card.override && !same(card.override, old.override) && { override: true }) })
    }
    if (old.label !== card.label) rest.push({ kind: 'rename_card', card: { id: card.id }, label: card.label })
    const then = old.tile!
    if (!same(then, tile)) {
      rest.push({ kind: 'set_tile', card: { id: card.id }, ...(then.type !== tile.type && { type: tile.type }), ...(then.body !== tile.body && { body: tile.body ?? '' }),
        ...(!same(then.words, tile.words) && tile.words && { words: tile.words }),
        ...(!same(then.image, tile.image) && (tile.image ? (tile.image.src ? { image: { src: tile.image.src, alt: tile.image.alt } } : { alt: tile.image.alt }) : { image: null })),
        ...(then.link !== tile.link && { link: tile.link ?? '' }) } as WorkshopEdit)
    }
  }
  // Placements in an order the cells let through: each one that fits now, then the next.
  let current = apply(base, [...head, ...toTray])
  const ordered: WorkshopEdit[] = []
  let left = [...placed]
  while (left.length) {
    const next = left.find(edit => !('refused' in applyWorkshopEdits(current, [edit])))
    if (!next) { ordered.push(...left); break }
    current = apply(current, [next])
    ordered.push(next)
    left = left.filter(edit => edit !== next)
  }
  for (const lane of after.lanes) {
    const old = base.lanes.find(item => item.id === lane.id)
    if (old && old.label !== lane.label) rest.push({ kind: 'rename_lane', lane: { id: lane.id }, label: lane.label })
  }
  if (before.title !== after.title) rest.push({ kind: 'rename_workshop', title: after.title })
  return [...pre, ...head, ...toTray, ...ordered, ...rest, ...appearanceEditsBetween(before, after)]
}

/** The pages to print or save as a PDF: each page's frame on the slate (its note), the notes on it, and its size. */
export function gridPrintPages(board: Workshop, layout: WorkshopBoardLayout = {}, origin: { x: number; y: number } = { x: 0, y: 0 }, pageIds?: string[]) {
  const f = gridFrames(board, layout)
  const size = printSize(board.grid!)
  return f.pages.filter(page => !pageIds || pageIds.includes(page.id)).map(page => ({
    pageId: page.id, label: board.lanes.find(lane => lane.id === page.id)!.label,
    frame: { x: r2(origin.x + page.x), y: r2(origin.y + page.y), width: page.width, height: page.height },
    nodeIds: ['column-' + page.id, ...board.cards.filter(card => card.laneId === page.id).map(card => 'card-' + card.id)],
    size,
  }))
}

/** The cell (1-based) under a point of a page, for a note let go there. */
function noteCell(board: Workshop, point: { x: number; y: number }, layout: WorkshopBoardLayout) {
  const { f, page } = pageAt(board, point, layout, 0)
  if (!page) return null
  const cell = cellAt(board.grid!, { x: (point.x - page.x) / f.scale, y: (point.y - page.y) / f.scale })
  return cell ? { row: cell.row + 1, col: cell.col + 1 } : null
}

export const gridKit: WorkshopBoardKit = {
  laneCues: false,
  places: (board, layout) => gridLayout(board, layout),
  notes: (board, layout, origin, style) => partNotes(gridLayout(board, layout).parts, board, origin, style),
  editsBetween: gridEditsBetween,
  layer: slate => createBoardLayer(slate, guides, { exportNever: true }),
  cardKeys: 'Arrows move it a cell, Shift and an arrow make it bigger or smaller, Delete puts it back in the tray.',
  label(board, part) {
    const card = board.cards.find(item => 'card-' + item.id === part)
    if (!card?.tile) return null
    const kind = tileName(card.tile.type).toLowerCase()
    if (card.laneId === GRID_TRAY) return card.label + ', ' + kind + (card.tile.stamp ? ' stamp, in the tray: dropping it on a page makes a copy' : ', in the tray')
    const { rows, cols } = spanOf(card.cell!)
    return card.label + ', ' + kind + ', on ' + board.lanes.find(lane => lane.id === card.laneId)!.label + ', row ' + (card.cell!.row + 1) + ', column ' + (card.cell!.col + 1) + (rows * cols > 1 ? ', ' + rows + ' by ' + cols : '')
  },
  chooser: (board, cardId, grab, layout = {}) => gridChooser(board, cardId, grab, layout),
  refusalAt(board, cardId, grab, point, layout) {
    const made = gridDrop(board, cardId, grab, point, layout)
    return made && 'refused' in made ? { laneId: made.laneId, reason: made.refused, ...(made.override && { override: made.override }) } : null
  },
  overrideWords(board, edit) {
    if (edit.kind !== 'place_tile') return undefined
    const lane = board.lanes.find(item => typeof edit.page === 'object' && item.id === edit.page.id)
    return 'to ' + (lane?.label ?? 'the page') + ', row ' + edit.row + ', column ' + edit.col
  },
  noteCell,
  keyEdit(board, part, key) {
    const card = board.cards.find(item => 'card-' + item.id === part)
    if (!card?.tile) return null
    const ref = { id: card.id }
    if (card.laneId === GRID_TRAY) {
      // In the tray: Right (or Enter) puts it (a stamp's copy) in the first free cell of the first page.
      if (key.key !== 'ArrowRight' && key.key !== 'Enter') return null
      const pageId = board.lanes[1].id
      const span = defaultSpan(board, card.tile.type)
      for (const want of [span, { rows: 1, cols: 1 }]) {
        for (let row = 0; row < board.grid!.cells.rows; row++) for (let col = 0; col < board.grid!.cells.cols; col++) {
          const edit: WorkshopEdit = { kind: 'place_tile', card: ref, page: { id: pageId }, row: row + 1, col: col + 1, rows: want.rows, cols: want.cols }
          if (!('refused' in applyWorkshopEdits(board, [edit]))) return [edit]
        }
      }
      return null
    }
    if (key.key === 'Delete' || key.key === 'Backspace') return [{ kind: 'place_tile', card: ref, page: { id: GRID_TRAY }, row: 1, col: 1 }]
    const step: Record<string, [number, number]> = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }
    const move = step[key.key]
    if (!move || !card.cell) return null
    const span = spanOf(card.cell)
    const at = { row: card.cell.row + 1, col: card.cell.col + 1 }
    // Shift: Right and Down make it a cell bigger, Left and Up a cell smaller.
    const next = key.shiftKey
      ? { ...at, rows: Math.max(1, span.rows + move[0]), cols: Math.max(1, span.cols + move[1]) }
      : { row: at.row + move[0], col: at.col + move[1], rows: span.rows, cols: span.cols }
    if (next.row < 1 || next.col < 1 || (next.rows === span.rows && next.cols === span.cols && next.row === at.row && next.col === at.col)) return null
    return [{ kind: 'place_tile', card: ref, page: { id: card.laneId }, ...next }]
  },
  handleDrag: () => null,
}
