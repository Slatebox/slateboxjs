// Budget kit: one envelope split into team segments sized by allocation. A divider between two
// teams moves money from one to the other (the total stays); the envelope's two outer edges grow or
// shrink the total (set_budget_total); a line item moves only to a team with room for it.
import { inOrder } from 'dragology'
import {
  laneColors, workshopCandidate, workshopDestinations, type BoardLayerState, type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopEdit,
} from '../workshops/model'
import { budgetCaption, budgetCommitted, budgetLimits, budgetOver, budgetRefusal, budgetTotalBounds, shiftBudget, withBudgetTotal, type BudgetEdge } from '../workshops/budget'
import { money } from '../workshops/numbers'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, orColumnUnder, partsGeometry } from '../workshops/boardSpecs'
import { overInk, tint, withMark } from './shared'
import { budgetHeader, handleLabel, partNotes, workshopEditsBetween } from './readouts'

const TOP = 48
const ENVELOPE = 960
/** How tall the whole envelope is on a phone, before a band grows to hold its items. */
const TALL = 900

/** Each team's segment of the envelope, and every note, in board coordinates. */
export function budgetLayout(board: Workshop, layout: WorkshopBoardLayout = {}) {
  const narrow = Boolean(layout.narrow)
  const total = board.budget!.total
  // The scale: the envelope's width (a phone's height) is its total, or a held edge's starting total.
  const scale = layout.gaugeScale ?? total
  // A held start edge keeps the end where it was: the envelope starts as far in (or out) as the total changed.
  const lead = layout.gaugeAnchor === 'start' ? (scale - total) : 0
  const parts: PartPlace[] = []
  const segments: { laneId: string; start: number; size: number }[] = []
  const counts = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  let width: number, height: number
  if (narrow) {
    // A vertical envelope: bands as tall as their share of it, and never too short for their items.
    width = Math.max(300, layout.width ?? 390)
    let y = TOP + lead / scale * TALL
    board.lanes.forEach((lane, i) => {
      const size = Math.max(100 + (counts[i] + 1) * 64, lane.allocation! / scale * TALL)
      segments.push({ laneId: lane.id, start: y, size })
      y += size
    })
    height = y + 8
  } else {
    let x = lead / scale * ENVELOPE
    for (const lane of board.lanes) {
      segments.push({ laneId: lane.id, start: x, size: lane.allocation! / scale * ENVELOPE })
      x += lane.allocation! / scale * ENVELOPE
    }
    width = Math.max(ENVELOPE, x)
    height = TOP + 100 + (Math.max(...counts) + 1) * 64
  }
  board.lanes.forEach((lane, i) => {
    const { start, size } = segments[i]
    const color = laneColors[i % laneColors.length]
    const box = narrow ? { x: 2, y: start + 1, width: width - 4, height: size - 2 } : { x: start + 1, y: TOP, width: Math.max(4, size - 2), height: height - TOP }
    const inner = { x: box.x + 5, y: box.y, width: Math.max(10, box.width - 10) }
    // A team over its money (a line item moved there anyway) is drawn in red, and its caption says by how much.
    const over = budgetOver(board, lane.id) > 0
    parts.push({ name: 'column-' + lane.id, ...box, ...(over ? { fill: overInk.fill, line: overInk.line, lineWidth: 2 } : { fill: tint(color, 0.6), line: tint(color, 0.1) }) })
    // On a phone the team's name takes what it needs and its caption ("$400k · $245k committed") the rest, a little
    // at the size of its line items and on up to two lines, so two teams framed at once still read at 12px or more.
    const pill = narrow ? inner.width * 0.36 : inner.width
    parts.push({ name: 'lane-' + lane.id, x: inner.x, y: inner.y + 6, width: pill, height: 32, text: lane.label, fill: color, fontSize: 15 })
    parts.push({ name: 'caption-' + lane.id, x: narrow ? inner.x + pill + 6 : inner.x, y: inner.y + (narrow ? 6 : 40), width: narrow ? inner.width - pill - 6 : inner.width,
      height: narrow ? 50 : 40, text: narrow ? budgetCaption(board, lane.id).replace(' · ', '\n') : budgetCaption(board, lane.id), fill: 'transparent', lineWidth: 0, fontSize: narrow ? 15 : 12, ...(over && { ink: overInk.ink }) })
    board.cards.filter(card => card.laneId === lane.id).forEach((card, k) =>
      parts.push({ name: 'card-' + card.id, x: inner.x, y: inner.y + 100 + k * 64, width: inner.width, height: 56,
        text: withMark(card.label + '\n' + money(card.amount!, board.budget!.currency), card), fontSize: 14 }))
    // The divider after this team (not after the last): 44px under the pointer.
    if (i < board.lanes.length - 1) {
      const edge = start + size
      parts.push(narrow ? { name: 'handle-' + lane.id, x: width - 96, y: edge - 22, width: 88, height: 44 }
        : { name: 'handle-' + lane.id, x: edge - 22, y: TOP - 6, width: 44, height: 48 })
    }
  })
  // The envelope's two outer edges: 44px under the pointer (a finger's size on a phone), the total's grips.
  const first = segments[0], last = segments.at(-1)!
  for (const [name, edge] of [[FIRST, first.start], [LAST, last.start + last.size]] as const) {
    parts.push(narrow ? { name, x: width - 96, y: edge - 22, width: 88, height: 44 } : { name, x: edge - 22, y: TOP - 6, width: 44, height: 48 })
  }
  return { parts, width, height, segments, narrow, k: (narrow ? TALL : ENVELOPE) / scale }
}

/** The envelope's outer grips: its start (the first team's side) and its end (the last team's). A lane id never starts with "_". */
const FIRST = 'handle-_first', LAST = 'handle-_last'
const edgeOf = (part: string): BudgetEdge | null => part === FIRST ? 'start' : part === LAST ? 'end' : null

function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  const g = budgetLayout(board, state.layout)
  const total = board.budget!.total
  const shapes: LayerShape[] = [{ t: 'text', x: 4, y: 28, text: budgetHeader(board), color: layerInk.ink, size: 16, bold: true, role: 'header' }]
  board.lanes.forEach((lane, i) => {
    const seg = g.segments[i]
    const allocation = lane.allocation!, committed = budgetCommitted(board, lane.id)
    // The committed fill, and the floor and cap ticks, measured along the envelope.
    if (g.narrow) {
      const y = seg.start + 50, x = 8, w = g.width - 16
      shapes.push({ t: 'rect', x, y, w, h: 10, rx: 5, color: layerInk.track })
      shapes.push({ t: 'rect', x, y, w: Math.min(w, w * committed / allocation || 0), h: 10, rx: 5, color: committed > allocation ? layerInk.refuse : layerInk.bar })
      if (lane.floor !== undefined) shapes.push({ t: 'line', x1: x + w * lane.floor / allocation, y1: y - 4, x2: x + w * lane.floor / allocation, y2: y + 14, color: layerInk.ink, width: 2 })
    } else {
      const k = g.k, y = TOP + 86
      shapes.push({ t: 'rect', x: seg.start + 6, y, w: seg.size - 12, h: 10, rx: 5, color: layerInk.track })
      shapes.push({ t: 'rect', x: seg.start + 6, y, w: Math.max(0, Math.min(seg.size - 12, (seg.size - 12) * committed / allocation || 0)), h: 10, rx: 5, color: committed > allocation ? layerInk.refuse : layerInk.bar })
      if (lane.floor !== undefined) shapes.push({ t: 'line', x1: seg.start + lane.floor * k, y1: y - 6, x2: seg.start + lane.floor * k, y2: y + 16, color: layerInk.ink, width: 2 })
      if (lane.cap !== undefined && seg.start + lane.cap * k <= g.width) shapes.push({ t: 'line', x1: seg.start + lane.cap * k, y1: y - 6, x2: seg.start + lane.cap * k, y2: y + 16, color: layerInk.refuse, width: 2, dash: '3 2' })
    }
    if (i < board.lanes.length - 1) {
      const edge = seg.start + seg.size
      shapes.push(g.narrow ? { t: 'line', x1: 2, y1: edge, x2: g.width - 2, y2: edge, color: layerInk.ink, width: 2 }
        : { t: 'line', x1: edge, y1: TOP, x2: edge, y2: g.height, color: layerInk.ink, width: 2 })
      shapes.push(g.narrow ? { t: 'rect', x: g.width - 68, y: edge - 4, w: 32, h: 8, rx: 4, color: layerInk.ink }
        : { t: 'rect', x: edge - 4, y: TOP + 2, w: 8, h: 30, rx: 4, color: layerInk.ink })
    }
  })
  // The total's two grips, on the envelope's outer edges.
  for (const seg of [g.segments[0], g.segments.at(-1)!]) {
    const edge = seg === g.segments[0] ? seg.start : seg.start + seg.size
    shapes.push(g.narrow ? { t: 'rect', x: g.width - 68, y: edge - 4, w: 32, h: 8, rx: 4, color: layerInk.ink, opacity: 0.7, role: 'edge-' + (seg === g.segments[0] ? 'first' : 'last') }
      : { t: 'rect', x: edge - 4, y: TOP + 2, w: 8, h: 30, rx: 4, color: layerInk.ink, opacity: 0.7, role: 'edge-' + (seg === g.segments[0] ? 'first' : 'last') })
  }
  if (state.clamp) {
    const part = g.parts.find(item => item.name === state.clamp!.name)
    if (part) shapes.push({ t: 'text', x: g.narrow ? 8 : Math.min(Math.max(part.x + 22, 120), g.width - 120), y: g.narrow ? part.y + 8 : TOP - 12,
      text: state.clamp.text, color: layerInk.refuse, size: 13, bold: true, anchor: g.narrow ? 'start' : 'middle', role: 'clamp' })
  }
  return shapes
}

const roundTo = (amount: number, step: number) => Math.round(amount / step) * step

export const budgetKit: WorkshopBoardKit = {
  laneCues: true,
  notes: (board, layout, origin, style) => partNotes(budgetLayout(board, layout).parts, board, origin, style),
  editsBetween: workshopEditsBetween,
  label: handleLabel,
  places(board, layout) {
    const { parts, width, height } = budgetLayout(board, layout)
    return { parts, width, height }
  },
  layer: slate => createBoardLayer(slate, paint),
  chooser(board, cardId, grab, layout = {}) {
    const legal = workshopDestinations(board, cardId).map(lane => workshopCandidate(board, cardId, lane.id)!)
    if (legal.length < 2) return null
    return orColumnUnder(headlessDrag(board, 'card-' + cardId, grab, state => partsGeometry(budgetLayout(state, layout).parts), (d, state) =>
      d.closest(legal).withFloating({ ghost: { opacity: 0.3 } }).whenFar(state)), board, cardId, budgetLayout(board, layout).parts, legal)
  },
  refusalAt(board, cardId, _grab, point, layout) {
    const { parts } = budgetLayout(board, layout)
    const card = board.cards.find(item => item.id === cardId)!
    for (const lane of board.lanes) {
      if (lane.id === card.laneId || !inside(parts.find(part => part.name === 'column-' + lane.id), point)) continue
      const reason = budgetRefusal(board, cardId, lane.id)
      // Refused, it may still be moved anyway once the person agrees (the native layer asks, unless it is a hard limit).
      return reason ? { laneId: lane.id, reason, override: { edit: { kind: 'move_card', card: { id: cardId }, lane: { id: lane.id } } } } : null
    }
    return null
  },
  handleDrag(board, handleId, grab, layout) {
    const outer = edgeOf(handleId)
    if (outer) return totalGrip(board, outer, handleId, grab, layout)
    const laneId = handleId.slice('handle-'.length)
    const i = board.lanes.findIndex(lane => lane.id === laneId)
    const next = board.lanes[i + 1]
    if (i < 0 || !next) return null
    const limits = budgetLimits(board, { laneId })
    const step = board.budget!.step
    // Money given to this team by the next one: kept inside both teams' bounds, then snapped to the step.
    const settle = (amount: number) => {
      const snapped = Math.min(limits.max, Math.max(limits.min, roundTo(amount, step)))
      return shiftBudget(board, next.id, laneId, snapped)
    }
    const g = budgetLayout(board, layout)
    const perUnit = g.narrow ? TALL / board.budget!.total : ENVELOPE / board.budget!.total
    const handle = g.parts.find(part => part.name === handleId)!
    const follow = headlessDrag(board, handleId, grab, state => partsGeometry(budgetLayout(state, layout).parts), d =>
      d.varyFunc([0], ([amount]) => shiftBudget(board, next.id, laneId, amount), { constraint: (s: Workshop) => [
        ...inOrder([limits.min, s.lanes[i].allocation! - board.lanes[i].allocation!, limits.max]),
      ] }))
    return point => {
      const moved = g.narrow ? point.y - grab.y - handle.y : point.x - grab.x - handle.x
      const wanted = moved / perUnit
      const chosen = follow?.(point)
      const amount = chosen ? chosen.lanes[i].allocation! - board.lanes[i].allocation! : wanted
      const result = { next: settle(amount) }
      if (wanted > limits.max + step / 2) return { ...result, clampedReason: limits.reasons.max }
      if (wanted < limits.min - step / 2) return { ...result, clampedReason: limits.reasons.min }
      return result
    }
  },
  keyEdit(board, part, { key }) {
    if (key !== 'ArrowLeft' && key !== 'ArrowRight' && key !== 'ArrowUp' && key !== 'ArrowDown') return null
    // An outer edge: outward (Left or Up at the start, Right or Down at the end) grows the total a step, inward shrinks it.
    const outer = edgeOf(part)
    if (outer) {
      const out = outer === 'start' ? key === 'ArrowLeft' || key === 'ArrowUp' : key === 'ArrowRight' || key === 'ArrowDown'
      return [{ kind: 'set_budget_total', amount: board.budget!.total + (out ? 1 : -1) * board.budget!.step, edge: outer }]
    }
    const laneId = /^handle-(.+)$/.exec(part)?.[1]
    const at = board.lanes.findIndex(lane => lane.id === laneId)
    const next = board.lanes[at + 1]
    if (at < 0 || !next) return null
    const more = key === 'ArrowRight' || key === 'ArrowDown'
    const step = board.budget!.step
    const edit: WorkshopEdit = more ? { kind: 'shift_budget', from: { id: next.id }, to: { id: laneId! }, amount: step }
      : { kind: 'shift_budget', from: { id: laneId! }, to: { id: next.id }, amount: step }
    return [edit]
  },
}

/**
 * An outer edge of the envelope: dragged out it grows the total, in it shrinks it, in the board's steps, on the scale
 * the drag started with (the envelope grows or shrinks at that edge under the pointer; the other edge stays). The team
 * at that edge gains or gives first (withBudgetTotal). Below what the teams keep (or above every cap) it holds at the
 * bound, says the smallest (largest) total that fits, and the drop is refused. One set_budget_total on the drop.
 */
function totalGrip(board: Workshop, edge: BudgetEdge, name: string, grab: { x: number; y: number }, layout: WorkshopBoardLayout) {
  const g = budgetLayout(board, layout)
  const part = g.parts.find(item => item.name === name)
  if (!part) return null
  const total = board.budget!.total, step = board.budget!.step
  const keep: WorkshopBoardLayout = { ...layout, gaugeScale: total, ...(edge === 'start' && { gaugeAnchor: 'start' as const }) }
  const bounds = budgetTotalBounds(board)
  return (point: { x: number; y: number }) => {
    const moved = (g.narrow ? point.y - grab.y - part.y : point.x - grab.x - part.x) / g.k
    const amount = total + roundTo(edge === 'end' ? moved : -moved, step)
    const made = withBudgetTotal(board, amount, edge)
    if (typeof made !== 'string') return { next: made, layout: keep }
    // Held at the bound it passed, saying why; let go there, it is refused and goes back.
    const held = withBudgetTotal(board, Math.min(bounds.max, Math.max(bounds.min, amount)), edge)
    return { next: typeof held === 'string' ? board : held, layout: keep, clampedReason: made, refusal: made }
  }
}
