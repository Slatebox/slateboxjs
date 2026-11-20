// Launch plan kit: tasks as bars in team swimlanes on a day grid, arrows for what waits on what,
// the critical path, and a launch-day line. Bars slide (lag), stretch (length) and link by Dragology.
import { lessThan, moreThan, param } from 'dragology'
import {
  laneColors, launchFinish, launchLinkRefusal, launchOverrun, launchPlanLimits, scheduleLaunch,
  withLink, withTaskValue, type BoardLayerState, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type PartPlace, type WorkshopEdit,
} from '../workshops/model'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, partsGeometry } from '../workshops/boardSpecs'
import { tint } from './shared'
import { handleLabel, launchLinkTargets, partNotes, workshopEditsBetween } from './readouts'

const CRITICAL = '#c2410c'
const BAR = 32

export interface LaunchGeometry {
  parts: PartPlace[]
  width: number
  height: number
  narrow: boolean
  /** Where day 0 is, and how wide a day is. */
  x0: number
  dayW: number
  /** Top of the day grid, and of the axis labels. */
  gridTop: number
  axisY: number
  bars: Map<string, { x: number; y: number; width: number; height: number }>
}

/** Where every note of a launch plan goes, in board coordinates. The native notes and Dragology both read it. */
export function launchLayout(board: Workshop, layout: WorkshopBoardLayout = {}): LaunchGeometry {
  const narrow = Boolean(layout.narrow)
  const day = board.launch!.day
  const times = scheduleLaunch(board)
  const parts: PartPlace[] = []
  const bars = new Map<string, { x: number; y: number; width: number; height: number }>()
  const width = narrow ? Math.max(300, layout.width ?? 390) : Math.max(720, layout.width ?? 1200)
  const x0 = narrow ? 8 : 168
  const dayW = narrow ? (width - 88) / day : (width - x0 - 40) / day
  const color = (laneId: string) => laneColors[board.lanes.findIndex(lane => lane.id === laneId) % laneColors.length]
  const bar = (cardId: string, y: number) => {
    const card = board.cards.find(item => item.id === cardId)!
    const t = times.get(cardId)!
    const box = { x: x0 + t.start * dayW, y, width: card.duration! * dayW, height: narrow ? 28 : BAR }
    bars.set(cardId, box)
    parts.push({ name: 'card-' + cardId, ...box, text: narrow ? '' : `${card.label} · ${card.duration}d`,
      fill: narrow ? color(card.laneId) : '#fffdf6', line: t.critical ? CRITICAL : '#667872', lineWidth: t.critical ? 2.5 : 1, fontSize: 13 })
    parts.push({ name: 'handle-' + cardId, x: box.x + box.width - 22, y: box.y + box.height / 2 - 22, width: 44, height: 44 })
  }
  let y: number, gridTop: number, axisY: number
  if (narrow) {
    // A legend of teams on top (each is where a note becomes a task in that team), then one row per task.
    const chip = (width - 16 - 8 * (board.lanes.length - 1)) / board.lanes.length
    board.lanes.forEach((lane, i) => {
      const x = 8 + i * (chip + 8)
      parts.push({ name: 'column-' + lane.id, x, y: 30, width: chip, height: 72, fill: tint(color(lane.id), 0.6), line: tint(color(lane.id), 0.1) })
      parts.push({ name: 'lane-' + lane.id, x: x + 4, y: 34, width: chip - 8, height: 28, text: lane.label, fill: color(lane.id), fontSize: 14 })
      parts.push({ name: 'caption-' + lane.id, x: x + 4, y: 64, width: chip - 8, height: 34, text: '', fill: 'transparent', lineWidth: 0, fontSize: 11 })
    })
    axisY = 124
    gridTop = 130
    y = 138
    for (const card of board.cards) { bar(card.id, y + 20); y += 56 }
  } else {
    axisY = 48
    gridTop = 56
    y = gridTop
    for (const lane of board.lanes) {
      const tasks = board.cards.filter(card => card.laneId === lane.id)
      const height = Math.max(92, tasks.length * 44 + 20)
      parts.push({ name: 'column-' + lane.id, x: 0, y, width, height, fill: tint(color(lane.id), 0.65), line: tint(color(lane.id), 0.1) })
      parts.push({ name: 'lane-' + lane.id, x: 8, y: y + 8, width: x0 - 24, height: 32, text: lane.label, fill: color(lane.id), fontSize: 15 })
      parts.push({ name: 'caption-' + lane.id, x: 8, y: y + 44, width: x0 - 24, height: 40, text: '', fill: 'transparent', lineWidth: 0, fontSize: 12 })
      tasks.forEach((card, i) => bar(card.id, y + 10 + i * 44))
      y += height + 4
    }
  }
  parts.push({ name: 'handle-launch', x: x0 + day * dayW - 22, y: narrow ? 104 : 4, width: 44, height: 44 })
  return { parts, width, height: y + 8, narrow, x0, dayW, gridTop, axisY, bars }
}

/** Fill in each lane's caption (the kit draws the words the model says). */
function withCaptions(board: Workshop, geometry: LaunchGeometry, caption: (laneId: string) => string) {
  for (const part of geometry.parts) if (part.name.startsWith('caption-')) part.text = caption(part.name.slice(8))
  return geometry
}

/** The elbow from the end of `from` to the start of `to`, with its arrowhead pointing into `to`. */
function elbow(from: { x: number; y: number; width: number; height: number }, to: { x: number; y: number; width: number; height: number }) {
  const end = from.x + from.width
  const sx = Math.max(from.x + 4, end - 10)
  const below = to.y + to.height / 2 > from.y + from.height / 2
  const sy = below ? from.y + from.height : from.y
  const ty = to.y + to.height / 2
  return { d: `M ${sx} ${sy} V ${ty} H ${to.x}`, arrow: { x: to.x, y: ty, angle: 0 } }
}

function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  const g = launchLayout(board, state.layout)
  const day = board.launch!.day
  const times = scheduleLaunch(board)
  const shapes: LayerShape[] = []
  // The day grid, with a label at the start of each week.
  for (let d = 0; d <= day; d++) {
    const x = g.x0 + d * g.dayW
    const week = d % 7 === 0
    if (!week && g.dayW < 6) continue
    shapes.push({ t: 'line', x1: x, y1: g.gridTop, x2: x, y2: g.height - 8, color: week ? layerInk.week : layerInk.faint, width: week ? 1 : 0.5 })
    if (week) shapes.push({ t: 'text', x: x + 3, y: g.axisY, text: g.narrow ? 'W' + (d / 7 + 1) : 'Week ' + (d / 7 + 1), color: layerInk.ink, size: 11 })
  }
  // What waits on what: elbows into each task, the critical ones in the critical colour. Click one to remove it.
  for (const card of board.cards) {
    for (const id of card.dependsOn ?? []) {
      const from = g.bars.get(id), to = g.bars.get(card.id)
      if (!from || !to) continue
      const tight = times.get(id)!.critical && times.get(card.id)!.critical
      const before = board.cards.find(item => item.id === id)!.label
      shapes.push({ t: 'path', ...elbow(from, to), color: tight ? CRITICAL : layerInk.ink, width: tight ? 2 : 1.5,
        unlink: { cardId: card.id, waitsOn: id, label: `Remove the link: ${card.label} waits on ${before}` } })
    }
    const t = times.get(card.id)!, box = g.bars.get(card.id)!
    if (g.narrow) shapes.push({ t: 'text', x: 8, y: box.y - 6, text: `${card.label} · ${card.duration}d`, color: layerInk.ink, size: 13, bold: t.critical })
    if (!t.critical) shapes.push({ t: 'text', x: box.x + box.width + 24, y: box.y + box.height / 2 + 4, text: '+' + t.slack + 'd', color: layerInk.ink, size: 11, role: 'slack-' + card.id })
  }
  // Launch day: a line, its grip and its label.
  const lx = g.x0 + day * g.dayW
  shapes.push({ t: 'line', x1: lx, y1: g.narrow ? 112 : 26, x2: lx, y2: g.height - 8, color: layerInk.launch, width: 2, dash: '6 4' })
  shapes.push({ t: 'rect', x: lx - 4, y: g.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: layerInk.launch })
  for (const card of board.cards) {
    // Each bar's length grip: 8px seen, 44px under the pointer (the handle note).
    const box = g.bars.get(card.id)!
    shapes.push({ t: 'rect', x: box.x + box.width - 5, y: box.y + 4, w: 4, h: box.height - 8, rx: 2, color: layerInk.ink, opacity: 0.55 })
  }
  const finish = launchFinish(board)
  shapes.push({ t: 'text', x: g.narrow ? 8 : g.x0, y: g.narrow ? 18 : 20, text: `Done day ${finish} · launch day ${day}`,
    color: state.refused ? layerInk.refuse : layerInk.ink, size: 14, bold: true, role: 'header' })
  if (state.clamp) {
    const part = g.parts.find(item => item.name === state.clamp!.name)
    if (part) shapes.push({ t: 'text', x: Math.min(part.x + 40, g.width - 4), y: part.y + 14, text: state.clamp.text, color: layerInk.refuse, size: 13,
      anchor: part.x + 40 > g.width - 160 ? 'end' : 'start', bold: true, role: 'clamp' })
  }
  return shapes
}

const roundDays = (board: Workshop): Workshop => ({ ...board, cards: board.cards.map(card => {
  const next = { ...card, duration: Math.max(1, Math.round(card.duration!)), lag: Math.max(0, Math.round(card.lag ?? 0)) }
  if (!next.lag) delete (next as { lag?: number }).lag
  return next
}), launch: { day: Math.round(board.launch!.day) } })

/** The edits a key makes on a launch plan: Left and Right move a bar a day, Shift changes its length; on the launch grip they move launch day. */
function keyEdit(board: Workshop, part: string, { key, shiftKey }: { key: string; shiftKey: boolean }): WorkshopEdit[] | null {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return null
  const step = key === 'ArrowLeft' ? -1 : 1
  if (part === 'handle-launch') return [{ kind: 'set_launch_day', day: board.launch!.day + step }]
  const match = /^(card|handle)-(.+)$/.exec(part)
  const card = match && board.cards.find(item => item.id === match[2])
  if (!card) return null
  return shiftKey || match![1] === 'handle' ? [{ kind: 'set_task', card: { id: card.id }, duration: card.duration! + step }]
    : [{ kind: 'set_task', card: { id: card.id }, lag: (card.lag ?? 0) + step }]
}

export const launchPlanKit: WorkshopBoardKit = {
  laneCues: false,
  notes(board, layout, origin, style) { return partNotes(launchPlanKit.places(board, layout).parts, board, origin, style) },
  editsBetween: workshopEditsBetween,
  label: handleLabel,
  places(board, layout) {
    const g = withCaptions(board, launchLayout(board, layout), laneId => {
      const tasks = board.cards.filter(card => card.laneId === laneId)
      const times = scheduleLaunch(board)
      return `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ${tasks.filter(card => times.get(card.id)!.critical).length} on the critical path`
    })
    return { parts: g.parts, width: g.width, height: g.height }
  },
  layer: slate => createBoardLayer(slate, paint),
  chooser(board, cardId, grab, layout = {}) {
    const i = board.cards.findIndex(card => card.id === cardId)
    if (i < 0) return null
    return chooserFor(board, cardId, i, launchLinkTargets(board, cardId), grab, layout)
  },
  refusalAt(board, cardId, grab, point, layout) {
    const g = launchLayout(board, layout)
    // Over another task's bar: that task is a link target, or the reason it is not.
    for (const other of board.cards) {
      if (other.id === cardId || !inside(g.bars.get(other.id), point)) continue
      const why = launchLinkRefusal(board, cardId, other.id)
      return why ? { laneId: other.laneId, reason: why } : null
    }
    // Slid past launch: where the pointer wants the task to start.
    const card = board.cards.find(item => item.id === cardId)!
    const wanted = (card.lag ?? 0) + Math.round((point.x - grab.x - g.bars.get(cardId)!.x) / g.dayW)
    const limits = launchPlanLimits(board, { cardId, field: 'lag' })
    if (wanted > limits.max) return { laneId: card.laneId, reason: launchOverrun(withTaskValue(board, { cardId, field: 'lag' }, wanted), cardId) ?? limits.reasons.max! }
    return null
  },
  handleDrag(board, handleId, grab, layout) {
    const g = launchLayout(board, layout)
    const render = (state: Workshop) => partsGeometry(launchLayout(state, layout).parts)
    if (handleId === 'handle-launch') {
      const limits = launchPlanLimits(board, { field: 'day' })
      const follow = headlessDrag(board, handleId, grab, render, (d, state) =>
        d.vary(state, param('launch', 'day'), { constraint: (s: Workshop) => [moreThan(s.launch!.day, launchFinish(s) - 0.001), lessThan(s.launch!.day, 120)] }).onDrop(roundDays))
      return point => {
        const wanted = Math.round((point.x - grab.x + 22 - g.x0) / g.dayW)
        const next = follow?.(point) ?? withTaskValue(board, { field: 'day' }, Math.min(limits.max, Math.max(limits.min, wanted)))
        if (wanted < limits.min) return { next, clampedReason: limits.reasons.min, refusal: launchOverrun(withTaskValue(board, { field: 'day' }, Math.max(5, wanted))) ?? undefined }
        return { next }
      }
    }
    const cardId = handleId.slice('handle-'.length)
    const i = board.cards.findIndex(card => card.id === cardId)
    if (i < 0) return null
    const ref = { cardId, field: 'duration' as const }
    const limits = launchPlanLimits(board, ref)
    const day = board.launch!.day
    const follow = headlessDrag(board, handleId, grab, render, (d, state) =>
      d.vary(state, param('cards', i, 'duration'), { constraint: (s: Workshop) => [moreThan(s.cards[i].duration!, 1), lessThan(launchFinish(s), day + 0.001)] }).onDrop(roundDays))
    const bar = g.bars.get(cardId)!
    return point => {
      const wanted = Math.round((point.x - grab.x + 22 - bar.x) / g.dayW)
      const clamped = Math.min(limits.max, Math.max(limits.min, wanted))
      const next = follow?.(point) ?? withTaskValue(board, ref, clamped)
      if (wanted > limits.max) {
        return { next, clampedReason: `Launch is day ${day}.`, refusal: launchOverrun(withTaskValue(board, ref, Math.min(60, wanted)), cardId) ?? limits.reasons.max }
      }
      if (wanted < limits.min) return { next, clampedReason: limits.reasons.min }
      return { next }
    }
  },
  keyEdit,
}

/**
 * The Dragology spec for a bar: dropped on another task it waits on that task; anywhere else it
 * slides along its row (lag) or to another team's row, never past launch.
 */
function chooserFor(board: Workshop, cardId: string, i: number, targets: string[], grab: { x: number; y: number }, layout: WorkshopBoardLayout) {
  const day = board.launch!.day
  const render = (state: Workshop) => partsGeometry(launchLayout(state, layout).parts, targets.map(id => 'card-' + id))
  const follow = headlessDrag(board, 'card-' + cardId, grab, render, (d, state) => {
    // A phone draws one row per task: there is no other team's row to slide into.
    const lanes = layout.narrow ? state.lanes.filter(lane => lane.id === state.cards[i].laneId) : state.lanes
    const slide = d.closest(lanes.map(lane => d.vary({ ...state, cards: state.cards.map((card, at) => at === i ? { ...card, laneId: lane.id, lag: card.lag ?? 0 } : card) },
      param('cards', i, 'lag'), { constraint: (s: Workshop) => [moreThan(s.cards[i].lag ?? 0, -0.001), lessThan(launchFinish(s), day + 0.001)] })))
    if (!targets.length) return slide.onDrop(roundDays)
    return d.closest(targets.map(target => d.dropTarget('target-' + target, withLink(state, cardId, target))))
      .withFloating({ ghost: { opacity: 0.35 } })
      .whenFar(slide)
      .withBranchTransition(120)
      .onDrop(roundDays)
  })
  return follow ? (point: { x: number; y: number }) => roundDays(follow(point)) : null
}
