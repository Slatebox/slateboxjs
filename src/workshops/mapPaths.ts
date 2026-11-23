// A map's paths (boards S2b, owner 2026-11-22: "A map's paths are fixed in normal use: no endpoint handles outside
// focus; selecting one offers Change this board. Editable on purpose in gear focus (add/remove/re-route) and via
// chat, one undo per change, collaborators see it, exec/MCP equivalents"). The paths are the stations' `next`
// lists, drawn as the slate's connectors between the step columns, which take no pointer. This module is what a
// person can do with them on the canvas: pick one (outside focus: the host offers "Change this board"), remove one
// (in focus), draw one from a step's grip, or move a path's end to another step. Every change is the edits chat
// and exec make (connect_stations, disconnect_stations), decided by the one reducer.
import type { NodeJSON } from '../core/Serialization'
import { roundedBox, workshopLanePlaces, type Workshop, type WorkshopEdit } from './model'
import { layerInk, type LayerShape } from './boardLayer'
import type { BoardLayerState } from './native'

/** A grip on a map in focus: draw a new path from a step, or move the end of a path to another step. */
export type MapGrip = { kind: 'link'; from: string } | { kind: 'route'; from: string; to: string }
const LINK = 'handle-_link-', ROUTE = 'handle-_route-'
/** A grip's least size in board units: a finger's at 100% zoom. */
const GRIP = 40
/** What a finger needs on screen, in CSS px: a grip and a path's hit area are never smaller there. */
const FINGER = 44

/**
 * A grip's size in board units at `zoom` (screen px per board unit): a finger's on screen, on a laptop and on a
 * phone alike. A map fitted to a phone in focus is drawn at about half size, so its grips are drawn larger.
 */
export function mapGripSize(zoom: number): number {
  const z = Number.isFinite(zoom) && zoom > 0 ? zoom : 1
  return Math.min(160, Math.max(GRIP, Math.ceil(FINGER / z)))
}

/** The grip an artwork name draws, or null for any other part. */
export function mapGripOf(name: string): MapGrip | null {
  if (name.startsWith(LINK)) return { kind: 'link', from: name.slice(LINK.length) }
  if (name.startsWith(ROUTE)) {
    const [from, to] = name.slice(ROUTE.length).split('~')
    return from && to ? { kind: 'route', from, to } : null
  }
  return null
}

const isMap = (board: Workshop) => Boolean(board.lanes[0]?.station)
const labelOf = (board: Workshop, id: string) => board.lanes.find(lane => lane.id === id)?.label ?? id

/** Each step's column, in board coordinates, as the native artwork draws it. */
function columns(board: Workshop) {
  const { places } = workshopLanePlaces(board)
  return new Map(places.map(place => [place.laneId, { x: place.x + 2, y: place.y, width: place.width - 4, height: place.height }]))
}

/** Where the line from the centre of `box` toward `toward` leaves the box, `pad` further on. */
function edgePoint(box: { x: number; y: number; width: number; height: number }, toward: { x: number; y: number }, pad = 4) {
  const cx = box.x + box.width / 2, cy = box.y + box.height / 2
  const dx = toward.x - cx, dy = toward.y - cy
  const tx = dx ? (box.width / 2) / Math.abs(dx) : Infinity, ty = dy ? (box.height / 2) / Math.abs(dy) : Infinity
  const t = Math.min(tx, ty)
  const len = Math.hypot(dx, dy) || 1
  return { x: cx + dx * t + (dx / len) * pad, y: cy + dy * t + (dy / len) * pad }
}

/** One path between two steps, clear of both columns (board coordinates): where its hit area and its end grip go. */
export interface MapPathSegment { key: string; from: string; to: string; x1: number; y1: number; x2: number; y2: number }

/** Every path of the map, in the order the steps list them. */
export function mapPathSegments(board: Workshop): MapPathSegment[] {
  if (!isMap(board)) return []
  const boxes = columns(board)
  const segments: MapPathSegment[] = []
  for (const lane of board.lanes) {
    const a = boxes.get(lane.id)
    if (!a) continue
    for (const to of lane.station!.next) {
      const b = boxes.get(to)
      if (!b) continue
      const ca = { x: a.x + a.width / 2, y: a.y + a.height / 2 }, cb = { x: b.x + b.width / 2, y: b.y + b.height / 2 }
      // A little inside each column, so a short path between two neighbours is still a finger's target.
      const p = edgePoint(a, cb, -8), q = edgePoint(b, ca, -8)
      segments.push({ key: lane.id + '>' + to, from: lane.id, to, x1: p.x, y1: p.y, x2: q.x, y2: q.y })
    }
  }
  return segments
}

/** The step whose column holds this point (board coordinates), or null. */
export function mapStationAt(board: Workshop, point: { x: number; y: number }): string | null {
  for (const [laneId, box] of columns(board)) {
    if (point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) return laneId
  }
  return null
}

/**
 * The grips a map in focus shows, as notes at `origin`: one at each step's bottom-right corner to draw a new path
 * from it, and one at the end of each path to move that end to another step. Each is a finger's size.
 */
export function mapGripNotes(board: Workshop, origin: { x: number; y: number }, size = GRIP): NodeJSON[] {
  if (!isMap(board)) return []
  const boxes = columns(board)
  const scale = size / GRIP
  const grip = (id: string, cx: number, cy: number, name: string, link: boolean): NodeJSON => ({ options: {
    id, name, text: link ? '+' : '', xPos: origin.x + cx - size / 2, yPos: origin.y + cy - size / 2, width: size, height: size,
    shapeHint: 'rectangle', vectorPath: roundedBox(size, size, size / 2),
    backgroundColor: link ? '#2f5fd0' : '#fffef8', foregroundColor: link ? '#ffffff' : '#2f5fd0', borderColor: link ? '#ffffff' : '#2f5fd0', borderWidth: Math.round(3 * scale),
    fontSize: Math.round(22 * scale) }, relationships: { associations: [] } })
  const notes: NodeJSON[] = []
  for (const lane of board.lanes) {
    const box = boxes.get(lane.id)
    // At the step's bottom-right corner: clear of its name and of the gear over the board's top-right corner.
    if (box) notes.push(grip(LINK + lane.id, box.x + box.width, box.y + box.height, 'Draw a path from ' + lane.label, true))
  }
  for (const s of mapPathSegments(board)) {
    // On the arrowhead, at the edge of the step it leads to, so it reads as the path's end and leaves the rest of
    // the path to its own click.
    notes.push(grip(ROUTE + s.from + '~' + s.to, s.x2, s.y2, 'End of the path from ' + labelOf(board, s.from) + ' to ' + labelOf(board, s.to), false))
  }
  return notes
}

/** What a screen reader calls a map's grip. */
export function mapGripLabel(board: Workshop, name: string): string | null {
  const grip = mapGripOf(name)
  if (!grip) return null
  return grip.kind === 'link' ? `Draw a path from ${labelOf(board, grip.from)}: drag it onto another step.`
    : `End of the path from ${labelOf(board, grip.from)} to ${labelOf(board, grip.to)}: drag it onto another step to move the path there.`
}

/**
 * A grip let go over step `laneId` (null: over no step): the map it makes, or the sentence that refuses it.
 * A link grip opens a path from its step; a route grip moves its path's end there (one change). Let go
 * where nothing changes, the map is as it was.
 */
export function mapPathDrop(board: Workshop, grip: MapGrip, laneId: string | null): { next: Workshop | null; refusal?: string } {
  if (laneId === null || (grip.kind === 'route' && laneId === grip.to)) return { next: board }
  const from = board.lanes.find(lane => lane.id === grip.from)
  if (!from?.station || !board.lanes.some(lane => lane.id === laneId)) return { next: board }
  if (laneId === from.id) return { next: null, refusal: 'A path joins two different steps.' }
  if (from.station.next.includes(laneId)) return { next: null, refusal: `${from.label} already leads to ${labelOf(board, laneId)}.` }
  const kept = grip.kind === 'route' ? from.station.next.filter(id => id !== grip.to) : from.station.next
  const lanes = board.lanes.map(lane => lane.id === from.id ? { ...lane, station: { ...lane.station!, next: [...kept, laneId] } } : lane)
  return { next: { ...board, lanes } }
}

/** The path edits between two maps: every path taken away, then every path opened (chat's and exec's edits). */
export function mapEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] {
  const gone: WorkshopEdit[] = [], made: WorkshopEdit[] = []
  for (const lane of after.lanes) {
    const was = before.lanes.find(item => item.id === lane.id)?.station?.next ?? []
    const now = lane.station?.next ?? []
    for (const to of was) if (!now.includes(to)) gone.push({ kind: 'disconnect_stations', from: { id: lane.id }, to: { id: to } })
    for (const to of now) if (!was.includes(to)) made.push({ kind: 'connect_stations', from: { id: lane.id }, to: { id: to } })
  }
  return [...gone, ...made]
}

/**
 * A map's layer: under each path a hit area. Outside focus it picks the path (the host offers "Change this
 * board"); in focus it removes it (a click, Enter or Space; on a touch screen a tap selects it and a second tap
 * removes it). The picked path is outlined. A held grip's sentence is said beside it.
 */
export function paintMap(board: Workshop, state: BoardLayerState): LayerShape[] {
  const shapes: LayerShape[] = []
  const focused = Boolean(state.boardFocused)
  // A path's hit area is a finger's thickness on screen, as its grips are (mapGripSize).
  const size = state.gripSize ?? GRIP
  const hit = Math.max(24, size * FINGER / GRIP)
  for (const s of mapPathSegments(board)) {
    const route = labelOf(board, s.from) + ' to ' + labelOf(board, s.to)
    const d = `M ${s.x1} ${s.y1} L ${s.x2} ${s.y2}`
    const picked = !focused && state.picked === s.key
    shapes.push(focused
      ? { t: 'path', d, color: 'transparent', width: 3, hit, unlink: { cardId: s.to, waitsOn: s.from, label: 'Remove the path from ' + route, armed: 'Tap again to remove this path' } }
      : { t: 'path', d, color: picked ? layerInk.accept : 'transparent', width: picked ? 5 : 3, hit, pick: { key: s.key, label: 'Path from ' + route + (picked ? ', selected' : '') } })
  }
  if (state.clamp) {
    const grip = mapGripNotes(board, { x: 0, y: 0 }, size).find(note => note.options.id === state.clamp!.name)?.options
    const x = grip ? (grip.xPos as number) + size + 6 : 0, y = grip ? (grip.yPos as number) + size / 2 + 5 : 0
    shapes.push({ t: 'text', x, y, text: state.clamp.text, color: layerInk.refuse, size: 13, bold: true, role: 'clamp' })
  }
  return shapes
}
