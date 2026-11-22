// Launch plan kit: tasks as bars in team swimlanes on a day grid, arrows for what waits on what,
// the critical path, and a launch-day line. Bars slide (lag), stretch (length) and link by Dragology.
// A dated plan says real dates and shades weekends when days are working days; its freezes are
// hatched bands a dragged bar hops (one Dragology branch per legal run, joined by withBranchTransition);
// a soft line lets a bar past it, in red. The hiring plan is the same kit: each hire's recruiting bar,
// then its cost to the plan's end, the runway readout and the funding round's line; on a phone it is read-only.
import { lessThan, moreThan, param } from 'dragology'
import { laneColors, type BoardLayerState, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type PartPlace, type WorkshopEdit } from '../workshops/model'
import { cascadeStops, dayWords, holdOthers, launchFinish, launchHard, launchLinkRefusal, launchOverrun, launchPlanLimits, legalRuns, lineWord, scheduleLaunch, snapStep, tryTask, withLink, withTaskValue } from '../workshops/launchPlan'
import { checkTime, pastTheLine } from '../workshops/timeRules'
import { clockOf, dayMap, isoAt, offsetOf, shortDate, weekdayAt } from '../workshops/calendar'
import { hireStarts, runwayMonths, runwayWords } from '../workshops/hiringPlan'
import { money } from '../workshops/numbers'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, partsGeometry } from '../workshops/boardSpecs'
import { tint } from './shared'
import { handleLabel, launchLinkTargets, partNotes, workshopEditsBetween } from './readouts'

const CRITICAL = '#c2410c'
const BAR = 32
/** A phone row's bar: a whole finger's height. */
const PHONE_BAR = 44
/** How far a length grip's 44px box reaches back over its bar's end: on a phone none of it, so a press on a short bar moves the bar. */
const gripBack = (narrow: boolean) => narrow ? 0 : 22

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
  const hiring = board.kind === 'hiring-plan'
  const times = scheduleLaunch(board)
  // The days the grid spans: launch day (a third more on a soft line, for what slips past it), or a hiring plan's weeks.
  // It never depends on where the tasks are, so a held bar's day stays the same width.
  const day = hiring ? board.hiring!.weeks * 7 : launchHard(board) ? board.launch!.day : Math.ceil(board.launch!.day * 4 / 3)
  const late = pastTheLine(board)
  const parts: PartPlace[] = []
  const bars = new Map<string, { x: number; y: number; width: number; height: number }>()
  const width = narrow ? Math.max(300, layout.width ?? 390) : Math.max(720, layout.width ?? 1200)
  const x0 = narrow ? 8 : 168
  const dayW = narrow ? (width - 88) / day : (width - x0 - 40) / day
  const color = (laneId: string) => laneColors[board.lanes.findIndex(lane => lane.id === laneId) % laneColors.length]
  const bar = (cardId: string, y: number) => {
    const card = board.cards.find(item => item.id === cardId)!
    const t = times.get(cardId)!
    const box = { x: x0 + t.from * dayW, y, width: (t.to - t.from) * dayW, height: narrow ? PHONE_BAR : BAR }
    bars.set(cardId, box)
    const red = late.has(cardId)
    parts.push({ name: 'card-' + cardId, ...box, text: narrow ? '' : hiring ? card.label : `${card.label} · ${card.duration}d`,
      fill: red ? '#fde3d7' : narrow ? color(card.laneId) : hiring ? tint(color(card.laneId), 0.45) : '#fffdf6',
      line: red || t.critical && !hiring ? CRITICAL : '#667872', lineWidth: red || t.critical && !hiring ? 2.5 : 1, fontSize: 13 })
    // A hiring plan on a phone is read-only: no grips.
    if (!(hiring && narrow)) parts.push({ name: 'handle-' + cardId, x: box.x + box.width - gripBack(narrow), y: box.y + box.height / 2 - 22, width: 44, height: 44 })
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
    // Each row: its words, then a 44px bar, with 4px between one bar and the next row's words.
    for (const card of board.cards) { bar(card.id, y + 20); y += 64 }
  } else {
    axisY = 48
    gridTop = 56
    y = gridTop
    for (const lane of board.lanes) {
      const tasks = board.cards.filter(card => card.laneId === lane.id)
      const height = Math.max(92, tasks.length * 44 + 20)
      parts.push({ name: 'column-' + lane.id, x: 0, y, width, height, fill: tint(color(lane.id), 0.65), line: tint(color(lane.id), 0.1) })
      parts.push({ name: 'lane-' + lane.id, x: 8, y: y + 8, width: x0 - 24, height: 32, text: lane.label, fill: color(lane.id), fontSize: 15 })
      parts.push({ name: 'caption-' + lane.id, x: 8, y: y + 44, width: x0 - 24, height: 40, text: '', fill: 'transparent', lineWidth: 0, fontSize: 13 })
      tasks.forEach((card, i) => bar(card.id, y + 10 + i * 44))
      y += height + 4
    }
  }
  if (!hiring) parts.push({ name: 'handle-launch', x: x0 + board.launch!.day * dayW - 22, y: narrow ? 104 : 4, width: 44, height: 44 })
  else if (board.hiring!.funding && !narrow) parts.push({ name: 'handle-funding', x: x0 + board.hiring!.funding.day * dayW - 22, y: 4, width: 44, height: 44 })
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
  const hiring = board.kind === 'hiring-plan'
  const times = scheduleLaunch(board)
  const day = Math.round((g.width - (g.narrow ? 88 : g.x0 + 40)) / g.dayW)
  const clock = clockOf(board)
  const shapes: LayerShape[] = []
  // Weekends, shaded where days are working days; then each freeze, hatched, with its name.
  if (clock?.workdays) for (let d = 0; d < day; d++) if (weekdayAt(clock.origin, d) === 6) {
    shapes.push({ t: 'rect', x: g.x0 + d * g.dayW, y: g.gridTop, w: 2 * g.dayW, h: g.height - 8 - g.gridTop, color: layerInk.track, opacity: 0.7 })
  }
  for (const rule of board.behaviour?.rules ?? []) if (clock && rule.on && rule.kind === 'blackout') {
    const from = offsetOf(clock.origin, rule.start), to = offsetOf(clock.origin, rule.end) + 1
    const x = g.x0 + Math.max(0, from) * g.dayW, w = (Math.min(day, to) - Math.max(0, from)) * g.dayW
    if (w <= 0) continue
    shapes.push({ t: 'rect', x, y: g.gridTop, w, h: g.height - 8 - g.gridTop, color: layerInk.refuse, opacity: 0.12 })
    for (let hx = x; hx < x + w; hx += 10) shapes.push({ t: 'line', x1: hx, y1: g.gridTop, x2: Math.min(x + w, hx + 10), y2: g.gridTop + 10, color: layerInk.refuse, width: 0.6 })
    shapes.push({ t: 'text', x: x + 3, y: g.gridTop + 22, text: rule.label + ' · ' + shortDate(rule.start) + '–' + shortDate(rule.end), color: layerInk.refuse, size: 11, bold: true })
  }
  // The day grid, with a label at the start of each week (a dated plan: its Monday's date; a hiring plan: each month).
  for (let d = 0; d <= day; d++) {
    const x = g.x0 + d * g.dayW
    const week = clock ? weekdayAt(clock.origin, d) === 1 : d % 7 === 0
    if (!week && g.dayW < 6) continue
    shapes.push({ t: 'line', x1: x, y1: g.gridTop, x2: x, y2: g.height - 8, color: week ? layerInk.week : layerInk.faint, width: week ? 1 : 0.5 })
    const month = hiring && clock && isoAt(clock.origin, d).slice(8) <= '07' && week
    const label = !clock ? (g.narrow ? 'W' : 'Week ') + (d / 7 + 1) : hiring ? (month ? shortDate(isoAt(clock.origin, d)).replace(/^\d+ /, '') : '') : shortDate(isoAt(clock.origin, d))
    if (week && label && (!clock || hiring || g.dayW * 7 > 44)) shapes.push({ t: 'text', x: x + 3, y: g.axisY, text: label, color: layerInk.ink, size: 12 })
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
    if (hiring) {
      // From the first day: the band's cost, to the plan's end.
      const band = board.hiring!.bands.find(item => item.id === card.band)
      const x = box.x + box.width, end = g.x0 + day * g.dayW
      if (end > x) shapes.push({ t: 'rect', x, y: box.y + box.height / 2 - 3, w: end - x, h: 6, rx: 3, color: layerInk.bar, opacity: 0.45 })
      shapes.push({ t: 'text', x: g.narrow ? 8 : Math.min(x + 6, end - 120), y: g.narrow ? box.y - 6 : box.y + box.height / 2 - 6,
        text: (g.narrow ? card.label + ' · ' : '') + 'starts ' + shortDate(isoAt(clock!.origin, hireStarts(board, card.id))) + (band ? ' · ' + money(band.monthly, board.hiring!.currency) + '/mo' : ''),
        color: layerInk.ink, size: 12, role: 'start-' + card.id })
      continue
    }
    if (g.narrow) shapes.push({ t: 'text', x: 8, y: box.y - 6, text: `${card.label} · ${card.duration}d`, color: layerInk.ink, size: 13, bold: t.critical })
    if (!t.critical) shapes.push({ t: 'text', x: box.x + box.width + (g.narrow ? 48 : 24), y: box.y + box.height / 2 + 4, text: '+' + t.slack + 'd', color: layerInk.ink, size: 12, role: 'slack-' + card.id })
  }
  if (hiring) {
    // The runway readout, red under a floor the plan keeps; the round's line and its grip.
    const months = runwayMonths(board)
    const floor = board.behaviour?.rules.find(rule => rule.on && rule.kind === 'deadline')
    const low = floor && floor.kind === 'deadline' && months < floor.floor!
    shapes.push({ t: 'text', x: g.narrow ? 8 : g.x0, y: g.narrow ? 18 : 20, text: 'Runway with these hires: ' + runwayWords(months),
      color: low || state.refused ? layerInk.refuse : layerInk.ink, size: 14, bold: true, role: 'header' })
    const round = board.hiring!.funding
    if (round && round.day <= day) {
      const fx = g.x0 + round.day * g.dayW
      shapes.push({ t: 'line', x1: fx, y1: 26, x2: fx, y2: g.height - 8, color: layerInk.accept, width: 2, dash: '6 4' })
      if (!g.narrow) shapes.push({ t: 'rect', x: fx - 4, y: 26, w: 8, h: 18, rx: 4, color: layerInk.accept })
      // On the header's row, clear of the month labels and of the runway readout.
      shapes.push({ t: 'text', x: Math.max(fx + 8, g.narrow ? 8 : g.x0 + 330), y: g.narrow ? 40 : 20, text: 'Round +' + money(round.amount, board.hiring!.currency) + ' · ' + shortDate(isoAt(clock!.origin, round.day)), color: layerInk.accept, size: 12, bold: true })
    }
    if (g.narrow) shapes.push({ t: 'text', x: 8, y: 58, text: 'Read-only here: say a change in the chat.', color: layerInk.ink, size: 12 })
    if (state.clamp) {
      const part = g.parts.find(item => item.name === state.clamp!.name)
      if (part) shapes.push(...saidNear(g, shapes, state.clamp.text, part, state.view))
    }
    return shapes
  }
  // Launch day: a line, its grip and its label.
  const lx = g.x0 + board.launch!.day * g.dayW
  shapes.push({ t: 'line', x1: lx, y1: g.narrow ? 112 : 26, x2: lx, y2: g.height - 8, color: layerInk.launch, width: 2, dash: '6 4' })
  shapes.push({ t: 'rect', x: lx - 4, y: g.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: layerInk.launch })
  for (const card of board.cards) {
    // Each bar's length grip: 8px seen, 44px under the pointer (the handle note). On a phone it sits just past the bar's end.
    const box = g.bars.get(card.id)!
    shapes.push({ t: 'rect', x: box.x + box.width + (g.narrow ? 4 : -5), y: box.y + 4, w: g.narrow ? 6 : 4, h: box.height - 8, rx: 2, color: layerInk.ink, opacity: 0.55 })
  }
  const finish = launchFinish(board)
  const done = Math.max(0, ...[...times.values()].map(t => t.to))
  shapes.push({ t: 'text', x: g.narrow ? 8 : g.x0, y: g.narrow ? 18 : 20,
    text: clock ? 'Done ' + dayWords(board, Math.ceil(done) - 1) + ' · ' + lineWord(board) + ' ' + dayWords(board, board.launch!.day) : `Done day ${finish} · launch day ${board.launch!.day}`,
    color: state.refused ? layerInk.refuse : layerInk.ink, size: 14, bold: true, role: 'header' })
  if (state.clamp) {
    const part = g.parts.find(item => item.name === state.clamp!.name)
    if (part) shapes.push(...saidNear(g, shapes, state.clamp.text, part, state.view))
  }
  return shapes
}

interface Box { x: number; y: number; w: number; h: number }
const SAID_SIZE = 13
const SAID_LINE = 16
/** A generous width for a letter of bold system-ui words at this size (about 0.58em), so an estimate never runs short. */
const letter = (size: number, bold?: boolean) => size * (bold ? 0.64 : 0.6)
const clear = (a: Box, b: Box) => a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
function textBox(shape: Extract<LayerShape, { t: 'text' }>): Box {
  const size = shape.size ?? 13, w = shape.text.length * letter(size, shape.bold)
  const x = shape.anchor === 'end' ? shape.x - w : shape.anchor === 'middle' ? shape.x - w / 2 : shape.x
  return { x, y: shape.y - size, w, h: size * 1.3 }
}
/** Words on lines no wider than `max` letters, broken between words. */
function wrap(text: string, max: number): string[] {
  const lines: string[] = []
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const last = lines.at(-1)
    if (last !== undefined && last.length + 1 + word.length <= max) lines[lines.length - 1] = last + ' ' + word
    else lines.push(word)
  }
  return lines
}
let saidMemo: { key: string; shapes: LayerShape[] } | null = null
/**
 * The words a held or refused grip says (why it stops, why it was refused), set where they lie over no bar and no
 * other words of the plan: in clear space on the day grid, as near the grip as there is room, on as few lines as fit.
 * A bar, a row's name, the header, a week label and a slack figure are kept clear; grid lines and arrows may pass
 * under the words. Only when the plan has no such space are they set beside the grip, as before.
 */
function saidNear(g: LaunchGeometry, shapes: LayerShape[], text: string, part: PartPlace, view?: BoardLayerState['view']): LayerShape[] {
  const busy: Box[] = [...g.bars.values()].map(bar => ({ x: bar.x - 4, y: bar.y - 3, w: bar.width + 8, h: bar.height + 6 }))
  for (const shape of shapes) {
    if (shape.t === 'text') busy.push(textBox(shape))
    else if (shape.t === 'rect') busy.push({ x: shape.x - 2, y: shape.y - 2, w: shape.w + 4, h: shape.h + 4 })
  }
  // Inside the plan, and inside what the canvas shows of it (a panel beside the canvas, a view panned part way).
  let left = g.narrow ? 6 : g.x0 + 2, right = g.width - 4, top = g.gridTop + 2, bottom = g.height - 6
  if (view && Math.min(right, view.x + view.width - 8) - Math.max(left, view.x + 8) >= 160) {
    left = Math.max(left, view.x + 8); right = Math.min(right, view.x + view.width - 8)
    if (Math.min(bottom, view.y + view.height - 8) - Math.max(top, view.y + 8) >= 40) { top = Math.max(top, view.y + 8); bottom = Math.min(bottom, view.y + view.height - 8) }
  }
  const grip = { x: part.x + part.width / 2, y: part.y + part.height / 2 }
  const key = JSON.stringify([text, grip, left, right, top, bottom, busy.map(box => [box.x, box.y, box.w, box.h].map(Math.round))])
  if (saidMemo?.key === key) return saidMemo.shapes
  const em = letter(SAID_SIZE, true), wide = Math.floor((right - left) / em)
  const choices = new Map<string, string[]>()
  for (const share of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const lines = wrap(text, Math.max(8, Math.floor(wide * share)))
    if (lines.length <= 4) choices.set(lines.join('\n'), lines)
  }
  let best: { box: Box; lines: string[]; score: number } | null = null
  for (const lines of choices.values()) {
    const w = Math.max(...lines.map(line => line.length)) * em, h = lines.length * SAID_LINE + 2
    if (w > right - left) continue
    for (let y = top; y + h <= bottom; y += 3) {
      for (let x = left; x + w <= right; x += 6) {
        const box = { x, y, w, h }
        // How far the words are from the grip, and a little for each extra line.
        const dx = Math.max(box.x - grip.x, 0, grip.x - (box.x + box.w)), dy = Math.max(box.y - grip.y, 0, grip.y - (box.y + box.h))
        const score = Math.hypot(dx, dy) + (lines.length - 1) * 24
        if (best && score >= best.score) continue
        if (busy.every(other => clear(box, other))) best = { box, lines, score }
      }
    }
  }
  const said: LayerShape[] = best
    ? [{ t: 'text', x: best.box.x, y: best.box.y + SAID_SIZE - 1, text, lines: best.lines, lineHeight: SAID_LINE, color: layerInk.refuse, size: SAID_SIZE, bold: true, role: 'clamp' }]
    : [{ t: 'text', x: Math.min(part.x + 40, g.width - 4), y: part.y + 14, text, color: layerInk.refuse, size: SAID_SIZE,
      anchor: part.x + 40 > g.width - 160 ? 'end' : 'start', bold: true, role: 'clamp' }]
  saidMemo = { key, shapes: said }
  return said
}

/** Whole days (the dragged task to whole steps of the plan's snap), and the markers on whole days. */
const roundDays = (board: Workshop, step = 1, cardId?: string): Workshop => {
  const near = (value: number, unit: number) => Math.round(value / unit) * unit
  const out: Workshop = { ...board, cards: board.cards.map(card => {
    const unit = card.id === cardId ? step : 1
    const next = { ...card, duration: Math.max(unit, near(card.duration!, unit)), lag: Math.max(0, near(card.lag ?? 0, unit)) }
    if (!next.lag) delete (next as { lag?: number }).lag
    return next
  }) }
  if (board.launch) out.launch = { ...board.launch, day: Math.round(board.launch.day) }
  if (board.hiring?.funding) out.hiring = { ...board.hiring, funding: { ...board.hiring.funding, day: Math.round(board.hiring.funding.day) } }
  return out
}
/** Whether the plan's rules (not the built-in line) decide its drags. */
const ruled = (board: Workshop) => Boolean(board.behaviour) || board.kind === 'hiring-plan'

/**
 * L on a focused bar: what it may wait on (each task it can be linked to), then what it already waits on
 * (to stop waiting). The way to make "Copy waits on QA" without a pointer.
 */
function keyChoices(board: Workshop, part: string, key: string) {
  if (key !== 'l' && key !== 'L') return null
  const match = /^card-(.+)$/.exec(part)
  const card = match && board.cards.find(item => item.id === match[1])
  if (!card) return null
  const name = (id: string) => board.cards.find(item => item.id === id)?.label ?? id
  const choices: { said: string; edits: WorkshopEdit[] }[] = [
    ...launchLinkTargets(board, card.id).map(id => ({ said: `${card.label} waits on ${name(id)}`,
      edits: [{ kind: 'link_tasks', card: { id: card.id }, waitsOn: { id } }] as WorkshopEdit[] })),
    ...(card.dependsOn ?? []).map(id => ({ said: `${card.label} stops waiting on ${name(id)}`,
      edits: [{ kind: 'unlink_tasks', card: { id: card.id }, waitsOn: { id } }] as WorkshopEdit[] })),
  ]
  return choices.length ? choices : `${card.label} has no task it can wait on.`
}

/** The edits a key makes on a launch plan: Left and Right move a bar a day, Shift changes its length; on the launch grip they move launch day. */
function keyEdit(board: Workshop, part: string, { key, shiftKey }: { key: string; shiftKey: boolean }): WorkshopEdit[] | null {
  if (key !== 'ArrowLeft' && key !== 'ArrowRight') return null
  const step = (key === 'ArrowLeft' ? -1 : 1) * snapStep(board)
  if (part === 'handle-launch') return [{ kind: 'set_launch_day', day: board.launch!.day + Math.sign(step) }]
  if (part === 'handle-funding') return [{ kind: 'set_funding', day: board.hiring!.funding!.day + Math.sign(step) * 7 }]
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
      if (board.kind === 'hiring-plan') return tasks.length + (tasks.length === 1 ? ' hire' : ' hires')
      return `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ${tasks.filter(card => times.get(card.id)!.critical).length} on the critical path`
    })
    return { parts: g.parts, width: g.width, height: g.height }
  },
  layer: slate => createBoardLayer(slate, paint),
  chooser(board, cardId, grab, layout = {}) {
    const i = board.cards.findIndex(card => card.id === cardId)
    if (i < 0) return null
    // A hiring plan on a phone is read-only: a held hire stays where it is.
    if (board.kind === 'hiring-plan' && layout.narrow) return () => board
    return (ruled(board) ? ruledChooser : chooserFor)(board, cardId, i, launchLinkTargets(board, cardId), grab, layout)
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
    if (ruled(board)) {
      // The day under the bar's start, through the calendar (a weekend is drawn, but not counted on a working-day plan).
      const t = scheduleLaunch(board).get(cardId)!
      const day = Math.round(t.from + (point.x - grab.x - g.bars.get(cardId)!.x) / g.dayW)
      const lag = (card.lag ?? 0) + dayMap(clockOf(board)).idx(day) - t.start
      const step = snapStep(board), tried = tryTask(board, cardId, { lag: Math.max(0, Math.round(lag / step) * step) })
      return typeof tried === 'string' ? { laneId: card.laneId, reason: tried, lands: true } : null
    }
    const limits = launchPlanLimits(board, { cardId, field: 'lag' })
    if (wanted > limits.max) return { laneId: card.laneId, reason: launchOverrun(withTaskValue(board, { cardId, field: 'lag' }, wanted), cardId) ?? limits.reasons.max! }
    return null
  },
  handleDrag(board, handleId, grab, layout) {
    const g = launchLayout(board, layout)
    const render = (state: Workshop) => partsGeometry(launchLayout(state, layout).parts)
    if (board.kind === 'hiring-plan' && layout.narrow) return null
    if (ruled(board)) return ruledHandle(board, handleId, grab, layout, g, render)
    if (handleId === 'handle-launch') {
      const limits = launchPlanLimits(board, { field: 'day' })
      const follow = headlessDrag(board, handleId, grab, render, (d, state) =>
        d.vary(state, param('launch', 'day'), { constraint: (s: Workshop) => [moreThan(s.launch!.day, launchFinish(s) - 0.001), lessThan(s.launch!.day, 120)] }).onDrop(state => roundDays(state)))
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
      d.vary(state, param('cards', i, 'duration'), { constraint: (s: Workshop) => [moreThan(s.cards[i].duration!, 1), lessThan(launchFinish(s), day + 0.001)] }).onDrop(state => roundDays(state)))
    const bar = g.bars.get(cardId)!
    return point => {
      const wanted = Math.round((point.x - grab.x + gripBack(g.narrow) - bar.x) / g.dayW)
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
  keyChoices,
  cardKeys: 'Left and Right move it a day, Shift changes its length, L chooses what it waits on.',
}

/**
 * A ruled plan's bar: one Dragology branch per run of legal starts on each team's row (a freeze, a lock,
 * an overlap or the line split the row), joined by withBranchTransition, so a dragged bar hops a hatched
 * band instead of landing in it. A slip that stops holds the tasks waiting on it as the bar moves.
 */
function ruledChooser(board: Workshop, cardId: string, i: number, targets: string[], grab: { x: number; y: number }, layout: WorkshopBoardLayout) {
  const step = snapStep(board), stop = cascadeStops(board), own = board.cards[i].laneId
  const shown = (state: Workshop) => {
    if (!stop) return state
    const held = holdOthers(board, state, new Set([cardId]))
    return typeof held === 'string' ? state : held
  }
  const settle = (state: Workshop) => shown(roundDays(state, step, cardId))
  const render = (state: Workshop) => partsGeometry(launchLayout(shown(state), layout).parts, targets.map(id => 'card-' + id))
  const lanes = layout.narrow ? [own] : board.lanes.map(lane => lane.id)
  const runs = lanes.flatMap(laneId => legalRuns(board, cardId, 'lag', laneId === own ? undefined : laneId).map(run => ({ laneId, run })))
  if (!runs.length) return () => board
  const follow = headlessDrag(board, 'card-' + cardId, grab, render, (d, state) => {
    const slide = d.closest(runs.map(({ laneId, run: [low, high] }) => d.vary({ ...state, cards: state.cards.map((card, at) => at === i ? { ...card, laneId, lag: Math.min(high, Math.max(low, card.lag ?? 0)) } : card) },
      param('cards', i, 'lag'), { constraint: (s: Workshop) => [moreThan(s.cards[i].lag ?? 0, low - 0.49), lessThan(s.cards[i].lag ?? 0, high + 0.49)] }))).withBranchTransition(100)
    if (!targets.length) return slide.onDrop(settle)
    return d.closest(targets.map(target => d.dropTarget('target-' + target, withLink(state, cardId, target))))
      .withFloating({ ghost: { opacity: 0.35 } })
      .whenFar(slide)
      .withBranchTransition(120)
      .onDrop(settle)
  })
  return follow ? (point: { x: number; y: number }) => settle(follow(point)) : null
}

/** A ruled plan's grips: a bar's length, launch day or the funding round, each over its legal runs, with the rule's sentence past them. */
function ruledHandle(board: Workshop, handleId: string, grab: { x: number; y: number }, layout: WorkshopBoardLayout, g: LaunchGeometry,
  render: (state: Workshop) => ReturnType<typeof partsGeometry>) {
  const runsOf = (values: number[], ok: (value: number) => boolean) => {
    const runs: [number, number][] = []
    for (const value of values) if (ok(value)) {
      const last = runs.at(-1)
      if (last && last[1] === value - (values[1] - values[0])) last[1] = value
      else runs.push([value, value])
    }
    return runs
  }
  const span = (from: number, to: number, step: number) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, k) => from + k * step)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const vary = (path: any[], read: (s: Workshop) => number, runs: [number, number][], step: number, cardId?: string) =>
    headlessDrag(board, handleId, grab, render, (d, state) => d.closest(runs.map(([low, high]) => d.vary(state, (param as (...keys: unknown[]) => never)(...path),
      { constraint: (s: Workshop) => [moreThan(read(s), low - 0.49), lessThan(read(s), high + 0.49)] }))).withBranchTransition(100).onDrop(s => roundDays(s, step, cardId)))
  const result = (follow: ((point: { x: number; y: number }) => Workshop) | null, wanted: (point: { x: number; y: number }) => number, legal: (value: number) => string | null, set: (value: number) => Workshop) =>
    (point: { x: number; y: number }) => {
      const value = wanted(point)
      const why = legal(value)
      const next = follow?.(point) ?? (why ? board : set(value))
      return why ? { next, clampedReason: why, refusal: why } : { next }
    }
  if (handleId === 'handle-launch' || handleId === 'handle-funding') {
    const launch = handleId === 'handle-launch'
    const set = (value: number) => launch ? withTaskValue(board, { field: 'day' }, value) : { ...board, hiring: { ...board.hiring!, funding: { ...board.hiring!.funding!, day: value } } }
    const why = (value: number) => {
      if (launch && (value < 5 || value > 120)) return 'Launch day is a whole day from 5 to 120.'
      if (launch && launchHard(board) && value < launchPlanLimits(board, { field: 'day' }).min) return launchOverrun(set(value)) ?? 'Every task ends by ' + lineWord(board) + '.'
      return planProblem0(board, set(value))
    }
    const values = launch ? span(5, 120, 1) : span(0, board.hiring!.weeks * 7, 1)
    const runs = runsOf(values, value => !why(value))
    const follow = runs.length ? vary(launch ? ['launch', 'day'] : ['hiring', 'funding', 'day'], s => launch ? s.launch!.day : s.hiring!.funding!.day, runs, 1) : null
    return result(follow, point => Math.round((point.x - grab.x + 22 - g.x0) / g.dayW), why, set)
  }
  const cardId = handleId.slice('handle-'.length)
  const i = board.cards.findIndex(card => card.id === cardId)
  if (i < 0) return null
  const step = snapStep(board), bar = g.bars.get(cardId)!
  const runs = legalRuns(board, cardId, 'duration')
  const follow = runs.length ? vary(['cards', i, 'duration'], s => s.cards[i].duration!, runs, step, cardId) : null
  const why = (value: number) => { const tried = tryTask(board, cardId, { duration: Math.max(step, Math.round(value / step) * step) }); return typeof tried === 'string' ? tried : null }
  return result(follow, point => board.cards[i].duration! + Math.round((point.x - grab.x + gripBack(g.narrow) - bar.x - bar.width) / g.dayW), why,
    value => withTaskValue(board, { cardId, field: 'duration' }, value))
}
/** The plan's rules on a whole-board change (a marker moved): the sentence, or null. */
function planProblem0(board: Workshop, next: Workshop): string | null {
  const verdict = board.behaviour ? checkTime(board, next) : null
  return verdict && 'refused' in verdict ? verdict.refused.sentence : null
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
    if (!targets.length) return slide.onDrop(state => roundDays(state))
    return d.closest(targets.map(target => d.dropTarget('target-' + target, withLink(state, cardId, target))))
      .withFloating({ ghost: { opacity: 0.35 } })
      .whenFar(slide)
      .withBranchTransition(120)
      .onDrop(state => roundDays(state))
  })
  return follow ? (point: { x: number; y: number }) => roundDays(follow(point)) : null
}
