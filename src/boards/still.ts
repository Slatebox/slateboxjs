// slateboxjs/boards/still: one renderer for a slate's boards anywhere it is shown read-only (the app's slate cards and
// previews, the library gallery, the marketing site), with the same attachWorkshop and kits the live canvas uses
// (library spec §7.2; owner, 2026-11-23: "the preview should match the final view").
//
// A still is the board read-only, its chrome at the board's size; a draft (a library preview) wears its dashed frame.
// Both are laid out as a desktop canvas shows them, whatever the size of the card they are drawn into.
//
// Everything the renderer needs from the rest of the engine is fetched with import() on first use: the workshop model
// (attachWorkshop), the kits (slateboxjs/boards, slateboxjs/boards/nest) and the rulebook. A page that never draws a
// board never loads them, and a host that already loaded them (the app's canvas, the site's replays) shares the same
// module, so there is one copy of the rule registry. renderStill also needs the canvas: it fetches slateboxjs itself
// unless the host hands it a Slate class.
import type { Workshop, WorkshopNoteStyle, AttachedWorkshop } from '../workshops/model'

type Box = { x: number; y: number; width: number; height: number }
type Point = { x: number; y: number }

/** The boards drawn by a kit of their own (slateboxjs/boards); a nested board's kit is a chunk of its own too. */
export const KIT_KINDS = ['launch-plan', 'hiring-plan', 'pipeline', 'budget', 'nest']

// How a board's lanes and cards look on a slate: the family, size and corners of the note a new slate starts with, with
// dark text because lanes keep the workshop's own pale fills. Cards are drawn as the slate's own notes (workshopStyle).
export const workshopNoteStyle = {
  fontFamily: 'Manrope',
  fontSize: 18,
  laneFontSize: 20,
  captionFontSize: 14,
  textColor: '#1d2b2a',
  borderColor: '#c5ccc4',
  borderWidth: 1,
  cornerRadius: 10,
}

const lanePitch = 244
const finite = (value: unknown): value is number => Number.isFinite(value)

/**
 * How many lanes sit side by side on a canvas this wide. One to a row on a phone, so card text stays at its full size;
 * on a wider canvas as many as fit at 70% or more. A map keeps its stations where its author put them.
 */
export function lanesPerRow(width: number, workshop: any): number | undefined {
  const lanes = workshop?.lanes?.length ?? 0
  if (!lanes || workshop.lanes[0].station) return undefined
  if (width < 600) return 1
  const fit = Math.floor(width / (lanePitch * 0.7))
  return fit >= lanes ? undefined : Math.max(2, fit)
}

/**
 * Where a slate's first board sits when the slate has not recorded a place for it: to the right of the slate's own
 * notes, level with their top, or near the corner of an empty slate. The same rule attachWorkshop applies on the canvas.
 */
export function workshopOrigin(options: any, nodes: any[] | undefined): Point {
  const saved = options?.workshopOrigin
  if (finite(saved?.x) && finite(saved?.y)) return { x: saved.x, y: saved.y }
  const notes = (nodes ?? []).filter(node => finite(node?.options?.xPos) && finite(node?.options?.yPos))
  if (!notes.length) return { x: 40, y: 40 }
  const right = Math.max(...notes.map(({ options: o }) => o.xPos + (Number(o.width) || 0)))
  const top = Math.min(...notes.map(({ options: o }) => o.yPos))
  return { x: Math.round(right + 80), y: Math.round(top) }
}

/** A note's type size as the canvas reads it: a number of pixels, or "14pt" as a new slate stores it. */
function pixels(size: unknown): number | undefined {
  if (typeof size === 'number') return size
  const match = /^([\d.]+)\s*(pt|px)?$/.exec(String(size ?? '').trim())
  if (!match) return undefined
  return Math.round(Number(match[1]) * (match[2] === 'pt' ? 4 / 3 : 1))
}

type ModelModule = typeof import('../workshops/model')
let modelModule: Promise<ModelModule> | null = null
const loadModel = () => (modelModule ??= import('../workshops/model'))

/**
 * What a card looks like on this slate: the slate's own first note with words on it, so a card and a note side by side
 * are the same kind of thing. A slate with no notes yet draws its cards as the canvas draws a note made there by a
 * double-click. Accepts stored notes (xPos, foregroundColor, vectorPath) and live ones (x, fontColor, shape).
 */
export function workshopCardLook(nodes: any[] | undefined, model: Pick<ModelModule, 'DEFAULT_NOTE_STYLE' | 'workshopCardLookOf'>) {
  const note = (nodes ?? []).map(node => node?.options ?? {}).find(o => String(o.text ?? '').trim() && !o.isComment && !o.image)
  if (!note) {
    const plain: any = model.DEFAULT_NOTE_STYLE
    // At the app's reading size, so a card on a phone stays readable at 100%.
    return { backgroundColor: plain.backgroundColor, textColor: plain.fontColor, fontFamily: plain.fontFamily, fontSize: workshopNoteStyle.fontSize,
      borderColor: plain.borderColor, borderWidth: plain.borderWidth, cornerRadius: 0 }
  }
  const rounded = [note.vectorPath, note.shape, note.shapeHint].some(value => /rounded/i.test(String(value ?? '')))
  const look: any = model.workshopCardLookOf({
    backgroundColor: note.backgroundColor, textColor: note.fontColor ?? note.foregroundColor, fontFamily: note.fontFamily,
    fontSize: pixels(note.fontSize), borderColor: note.borderColor, borderWidth: note.borderWidth,
  } as any)
  return look || rounded ? { ...look, cornerRadius: rounded ? workshopNoteStyle.cornerRadius : 0 } : undefined
}

/** The style a board is drawn in on a slate holding `nodes`: the lanes in the lane style, the cards as the slate's own notes. */
export function workshopStyle(nodes: any[] | undefined, model: Pick<ModelModule, 'DEFAULT_NOTE_STYLE' | 'workshopCardLookOf'>): WorkshopNoteStyle {
  const card = workshopCardLook(nodes, model)
  return (card ? { ...workshopNoteStyle, card } : workshopNoteStyle) as WorkshopNoteStyle
}

const boardIdPattern = /^[a-z0-9]{1,12}$/
const isBoard = (record: any) => record?.model?.kind === 'workshop' && Boolean(record.model.workshop)
const order = (id: string) => Number(/^b(\d+)$/.exec(id)?.[1] ?? Infinity)

export interface StillBoard { id: string; workshop: Workshop; origin: Point | null }

/**
 * Every board a saved slate holds, first board first. The first board (creative) sits at options.workshopOrigin, or
 * beside the slate's notes when none is stored; each further board (boards.<id>, b2, b3, … in the order they were
 * added) at its own origin, null when not recorded.
 */
export function slateBoards(slate: any): StillBoard[] {
  const out: StillBoard[] = []
  if (isBoard(slate?.creative)) out.push({ id: 'main', workshop: slate.creative.model.workshop, origin: workshopOrigin(slate.options, slate.nodes) })
  const stored = slate?.boards && typeof slate.boards === 'object' && !Array.isArray(slate.boards) ? slate.boards : {}
  const further = Object.entries(stored).filter(([id, record]) => boardIdPattern.test(id) && id !== 'main' && isBoard(record))
    .sort(([a], [b]) => order(a) - order(b) || (a < b ? -1 : a > b ? 1 : 0))
  for (const [id, record] of further as [string, any][]) {
    out.push({ id, workshop: record.model.workshop, origin: finite(record.origin?.x) && finite(record.origin?.y) ? { x: record.origin.x, y: record.origin.y } : null })
  }
  return out
}

/** Whether a saved slate holds a board (its first in creative, any further in boards). */
export const holdsBoards = (slate: any) => slateBoards(slate).length > 0

export interface BoardKit { kit?: unknown; layoutFor: (width: number) => any }

/** Fetch what a board needs to be drawn as itself: its kit (business boards) and the rulebook (a board with rules, and any kit board). */
export async function loadBoardKit(workshop: any): Promise<BoardKit> {
  const needsKit = KIT_KINDS.includes(workshop?.kind)
  const model = await loadModel()
  const [kits] = await Promise.all([
    needsKit ? import('./index') : null,
    workshop?.kind === 'nest' ? import('./nest') : null,
    // A kit board's legend is its rulebook's sentences (boardChrome kitLegend), so a kit board needs it too.
    (workshop?.behaviour || needsKit) && !model.rulebookLoaded() ? import('../workshops/behaviour') : null,
  ])
  return kits
    ? { kit: kits.kitFor(workshop.kind), layoutFor: (width: number) => kits.boardLayoutFor(width) }
    : { kit: undefined, layoutFor: (width: number) => ({ lanesPerRow: lanesPerRow(width, workshop) }) }
}

/** The engine's board chrome styles, added to the page once unless the host has added its own (same element id). */
async function ensureChromeStyles(model: ModelModule) {
  if (typeof document === 'undefined' || document.getElementById('sb-board-chrome')) return
  const style = document.createElement('style')
  style.id = 'sb-board-chrome'
  style.textContent = model.boardChromeStyles
  document.head.appendChild(style)
}

export interface DrawBoardOptions {
  /** 'still' (read-only, a card's picture) or 'draft' (dashed, see-through, view-only, scope pv). */
  how?: 'still' | 'draft'
  origin?: Point
  scope?: string
  /** The screen width the board is laid out for. */
  width?: number
  style?: WorkshopNoteStyle
}

/**
 * Draw a board with the one renderer: `how` is 'draft' (dashed, see-through, view-only, scope pv) or 'still'
 * (read-only; a card's picture). `width` is the screen width the board is laid out for: a still is laid out as a
 * desktop canvas shows it, whatever the size of the card it is drawn into.
 */
export async function drawBoard(engine: any, workshop: Workshop, { how = 'still', origin, scope, width = 1440, style }: DrawBoardOptions = {}): Promise<AttachedWorkshop> {
  const model = await loadModel()
  await ensureChromeStyles(model)
  const { kit, layoutFor } = await loadBoardKit(workshop)
  return model.attachWorkshop(engine, workshop, {
    readOnly: true, origin, layout: layoutFor(width), style: style ?? workshopStyle(engine.freeNodes?.() ?? [], model),
    // A draft wears its dashed frame; a still's chrome scales with the board, as an export's does.
    ...(how === 'draft' ? { draft: true } : { still: true }),
    ...((scope || how === 'draft') && { scope: scope ?? 'pv' }),
    ...(kit ? { kit } : {}),
  } as any)
}

/**
 * Draw every board a saved slate holds onto a still canvas (a slate's card), each where the canvas puts it: the first
 * at the slate's workshop origin, a further board at its own origin and in its scope (b2:…). A board this build cannot
 * draw is left off the picture rather than failing the list. → the attached boards (destroy each to take them away).
 */
export async function drawSlateBoards(engine: any, slate: any, { width = 1440 }: { width?: number } = {}): Promise<AttachedWorkshop[]> {
  const own = Array.isArray(slate?.nodes) ? slate.nodes : []
  const style = workshopStyle(own, await loadModel())
  const drawn: AttachedWorkshop[] = []
  for (const board of slateBoards(slate)) {
    if (!board.origin) continue
    const main = board.id === 'main'
    try {
      const attached = await drawBoard(engine, board.workshop, { how: 'still', origin: board.origin, scope: main ? undefined : board.id, width, style })
      await attached.whenDrawn?.()
      drawn.push(attached)
    } catch (err) {
      console.warn('A board on this slate could not be drawn on its picture.', err)
    }
  }
  return drawn
}

/** A slate holding one board and nothing else: how a smart component (a library item's board) is drawn as a still. */
export function componentSlate(workshop: Workshop, name?: string): any {
  return { options: { name: name ?? (workshop as any)?.title ?? 'Board', workshopOrigin: { x: 40, y: 40 } }, nodes: [], creative: { model: { kind: 'workshop', workshop } } }
}

/** The box a slate's notes fill, in world units (stored notes: xPos, yPos, width, height). */
export function notesBox(nodes: any[] | undefined): Box | null {
  const boxes = (nodes ?? []).map(node => node?.options ?? {}).filter(o => finite(o.xPos) && finite(o.yPos))
    .map(o => ({ x: o.xPos, y: o.yPos, width: Number(o.width) || 0, height: Number(o.height) || 0 }))
  return union(boxes)
}

function union(boxes: Box[]): Box | null {
  if (!boxes.length) return null
  const x = Math.min(...boxes.map(b => b.x)), y = Math.min(...boxes.map(b => b.y))
  const right = Math.max(...boxes.map(b => b.x + b.width)), bottom = Math.max(...boxes.map(b => b.y + b.height))
  return { x, y, width: right - x, height: bottom - y }
}

/** The viewbox that shows `frame` whole and centred in a host `w` by `h` pixels, with `pad` world units around it. */
export function fitViewbox(frame: Box, w: number, h: number, pad = 24): Box {
  const fw = frame.width + pad * 2, fh = frame.height + pad * 2
  const scale = Math.min(w / fw, h / fh)
  const vw = w / scale, vh = h / scale
  return { x: frame.x - pad + (fw - vw) / 2, y: frame.y - pad + (fh - vh) / 2, width: vw, height: vh }
}

export interface StillOptions {
  /** The world box to show; by default everything the slate holds (its notes and each board with its chrome). */
  frame?: Box
  /** The screen width the boards are laid out for (1440: as a desktop canvas shows them). */
  width?: number
  /** The canvas class to draw with (slateboxjs's Slate); fetched from slateboxjs when not given. */
  Slate?: any
}

export interface Still {
  /** The read-only canvas. */
  slate: any
  /** The boards drawn on it. */
  boards: AttachedWorkshop[]
  /** The world box shown. */
  frame: Box
  /** Fit the frame to the host again (a resize). */
  fit(): void
  /** Take the picture away: the boards, the observer and the canvas. */
  destroy(): void
}

/**
 * Render a read-only still of a slate's JSON into `host`: a read-only canvas, the slate's notes, each board it holds
 * drawn by its kit (drawSlateBoards), the whole fitted to the host and kept fitted when it resizes. A smart component
 * is drawn by passing componentSlate(workshop). → the still, to destroy when the host goes.
 */
export async function renderStill(host: HTMLElement, slateJson: any, { frame, width = 1440, Slate }: StillOptions = {}): Promise<Still> {
  const Canvas = Slate ?? (await import('slateboxjs' as string)).Slate
  const slate = new Canvas(host, {
    name: slateJson?.options?.name, enabled: false, showMultiSelect: false, showUndoRedo: false, showZoom: false, showbirdsEye: false,
    viewPort: { showCoordinates: false, allowDrag: false }, panZoom: { enabled: false }, events: { isReadOnly: () => true },
  })
  const { creative: _creative, boards: _boards, ...notesOnly } = slateJson ?? {}
  await slate.loadJSON({ ...notesOnly, nodes: Array.isArray(slateJson?.nodes) ? slateJson.nodes : [] }, false, true)
  const boards = await drawSlateBoards(slate, slateJson, { width })
  const shown = frame ?? union([notesBox(slateJson?.nodes), ...boards.map(board => board.frame ?? board.bounds)].filter(Boolean) as Box[]) ?? { x: 0, y: 0, width: 800, height: 450 }
  const fit = () => {
    const w = host.clientWidth, h = host.clientHeight
    if (!w || !h) return
    const box = fitViewbox(shown, w, h)
    slate.canvas?.viewbox?.(box.x, box.y, box.width, box.height)
  }
  fit()
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(fit)
  observer?.observe(host)
  host.dataset.stillDrawn = 'true'
  return {
    slate, boards, frame: shown, fit,
    destroy() {
      observer?.disconnect()
      for (const board of boards) { try { board.destroy() } catch { /* already gone */ } }
      try { slate.destroy?.() } catch { /* already gone */ }
      host.replaceChildren()
      delete host.dataset.stillDrawn
    },
  }
}
