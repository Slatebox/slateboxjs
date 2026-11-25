// Launch plan kit: tasks as bars in team swimlanes on a day grid, arrows for what waits on what,
// the critical path, and a launch-day line. Bars slide (lag) and link by Dragology; each bar has a grip on
// both edges (shown on the bar that is selected or under the pointer, and always on a phone): the end grip
// changes its length, the start grip moves its start and keeps its end, read through the plan's calendar.
// A dated plan says real dates and shades weekends when days are working days; its freezes are
// hatched bands a dragged bar hops (one Dragology branch per legal run, joined by withBranchTransition);
// a soft line lets a bar past it, in red. The hiring plan is the same kit: each hire's recruiting bar,
// then its cost to the plan's end, the runway readout and the funding round's line; on a phone it is read-only.
import { lessThan, moreThan, param } from 'dragology'
import { laneColors, workshopOverrideLine, type BoardLayerState, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type PartPlace, type WorkshopEdit } from '../workshops/model'
import { waitsRefusal, cascadeStops, dayWords, dragTaskEdge, holdOthers, launchFinish, launchHard, launchLinkRefusal, launchOverrun, launchPlanLimits, legalRuns, lineWord, moveLaunch, movePlanStart, planWeeksProblem, scheduleLaunch, snapStep, startHandle, startHandleCard, tryTask, withLink, withTaskValue, type EdgeValues, type TaskEdge } from '../workshops/launchPlan'
import { checkTime, pastTheLine } from '../workshops/timeRules'
import { clockOf, dayMap, isoAt, offsetOf, shortDate, weekdayAt } from '../workshops/calendar'
import { hireStarts, runwayMonths, runwayWords } from '../workshops/hiringPlan'
import { money } from '../workshops/numbers'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, partsGeometry } from '../workshops/boardSpecs'
import { overInk, tint } from './shared'
import { brokenWaits } from '../workshops/schedule'
import { handleLabel, launchLinkTargets, partNotes, workshopEditsBetween } from './readouts'
import { HEADER_SLOT } from '../workshops/laneHeader'

const CRITICAL = '#c2410c'
/** The grips on a dated plan's first day and a hiring plan's last week (a card id never starts with "_"). */
const FIRST = 'handle-_first', LAST = 'handle-_last'
const BAR = 32
/** A phone row's bar: a whole finger's height. */
const PHONE_BAR = 44
/**
 * How far an edge grip's box reaches over its bar: on a laptop up to 22px of a 44px box, less on a short bar so
 * its middle is still there to slide it; on a phone none of it (a finger's 44px box sits past the edge), so a
 * press on a short bar moves the bar.
 */
const gripIn = (narrow: boolean, width: number) => narrow ? 0 : Math.min(22, Math.max(4, Math.floor(width / 3)))

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
  // A hard line with a task moved past it anyway (it carries the mark) spans to that task's end, so the bar and its
  // mark stay on the board.
  const anyway = !hiring && launchHard(board) && board.cards.some(card => card.override)
  const day = hiring ? board.hiring!.weeks * 7 : launchHard(board)
    ? Math.max(board.launch!.day, anyway ? Math.max(...[...times.values()].map(t => Math.ceil(t.to))) : 0) : Math.ceil(board.launch!.day * 4 / 3)
  const late = pastTheLine(board)
  const parts: PartPlace[] = []
  const bars = new Map<string, { x: number; y: number; width: number; height: number }>()
  const x0 = narrow ? 8 : 168
  const room = narrow ? 88 : x0 + 40
  // A line being dragged keeps the day width it started with (layout.dayWidth): a later line draws the days it
  // adds, and the plan grows to the right under the pointer, instead of every day narrowing to fit. It never grows
  // past layout.maxWidth (the next board on the slate): there the days narrow instead.
  const fits = narrow ? Math.max(300, layout.width ?? 390) : Math.max(720, layout.width ?? 1200)
  const grown = layout.dayWidth ? Math.max(fits, Math.ceil(room + day * layout.dayWidth)) : fits
  const width = layout.maxWidth !== undefined && grown > layout.maxWidth ? Math.max(fits, Math.floor(layout.maxWidth)) : grown
  const dayW = layout.dayWidth && width === grown ? layout.dayWidth : (width - room) / day
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
    // Its grips: the start edge, then the end edge, each at least 24px to a finger. A hiring plan on a phone is read-only: no grips.
    if (!(hiring && narrow)) {
      const inward = gripIn(narrow, box.width), reach = narrow ? 44 : 22, y = box.y + box.height / 2 - 22
      // On a phone the start grip stays on the screen: at the plan's left edge it reaches a little over the bar.
      const sx = narrow ? Math.max(-12, box.x - reach) : box.x - reach
      parts.push({ name: startHandle(cardId), x: sx, y, width: Math.max(24, box.x + inward - sx), height: 44 })
      parts.push({ name: 'handle-' + cardId, x: box.x + box.width - inward, y, width: inward + reach, height: 44 })
    }
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
      // The team's name leaves its color button's slot on its right, in the gutter before the days (laneHeader.ts).
      parts.push({ name: 'lane-' + lane.id, x: 8, y: y + 8, width: x0 - 24 - HEADER_SLOT, height: 32, text: lane.label, fill: color(lane.id), fontSize: 15 })
      parts.push({ name: 'caption-' + lane.id, x: 8, y: y + 44, width: x0 - 24, height: 40, text: '', fill: 'transparent', lineWidth: 0, fontSize: 13 })
      tasks.forEach((card, i) => bar(card.id, y + 10 + i * 44))
      y += height + 4
    }
  }
  if (!hiring) parts.push({ name: 'handle-launch', x: x0 + board.launch!.day * dayW - 22, y: narrow ? 104 : 4, width: 44, height: 44 })
  else if (board.hiring!.funding && !narrow) parts.push({ name: 'handle-funding', x: x0 + board.hiring!.funding.day * dayW - 22, y: 4, width: 44, height: 44 })
  // A dated plan's two ends: its first day, and a hiring plan's last week (a launch plan ends at its line). A hiring plan on a phone is read-only.
  if (board.clock && !(hiring && narrow)) parts.push({ name: FIRST, x: x0 - 22, y: narrow ? 104 : 8, width: 44, height: 44 })
  if (hiring && !narrow) parts.push({ name: LAST, x: x0 + day * dayW - 22, y: 8, width: 44, height: 44 })
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

/** How wide a phone task's words are drawn (13px; the layer measures nothing, so a generous average glyph). */
export const phoneWordsWidth = (words: string, bold = false) => Math.ceil(words.length * 13 * (bold ? 0.6 : 0.56))

function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  const g = launchLayout(board, state.layout)
  const hiring = board.kind === 'hiring-plan'
  const times = scheduleLaunch(board)
  const day = Math.round((g.width - (g.narrow ? 88 : g.x0 + 40)) / g.dayW)
  const clock = clockOf(board)
  const shapes: LayerShape[] = []
  // Weekends, shaded where days are working days; then each freeze, hatched, with its name.
  if (clock?.workdays) for (let d = 0; d < day; d++) if (weekdayAt(clock.origin, d) === 6) {
    shapes.push({ t: 'rect', x: g.x0 + d * g.dayW, y: g.gridTop, w: 2 * g.dayW, h: g.height - 8 - g.gridTop, color: g.narrow ? layerInk.canvasTrack : layerInk.track, opacity: 0.7 })
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
    shapes.push({ t: 'line', x1: x, y1: g.gridTop, x2: x, y2: g.height - 8, color: g.narrow ? (week ? layerInk.canvasWeek : layerInk.canvasFaint) : week ? layerInk.week : layerInk.faint, width: week ? 1 : 0.5 })
    const month = hiring && clock && isoAt(clock.origin, d).slice(8) <= '07' && week
    const label = !clock ? (g.narrow ? 'W' : 'Week ') + (d / 7 + 1) : hiring ? (month ? shortDate(isoAt(clock.origin, d)).replace(/ \d+$/, '') : '') : shortDate(isoAt(clock.origin, d))
    if (week && label && (!clock || hiring || g.dayW * 7 > 44)) shapes.push({ t: 'text', x: x + 3, y: g.axisY, text: label, color: layerInk.canvasInk, size: 12 })
  }
  // What waits on what: elbows into each task, the critical ones in the critical colour. Click one to remove it. A wait
  // a task moved anyway breaks (it starts before what it waits on ends) is drawn broken, in red.
  const broken = new Set(brokenWaits(board).map(item => item.from + '>' + item.to))
  for (const card of board.cards) {
    for (const id of card.dependsOn ?? []) {
      const from = g.bars.get(id), to = g.bars.get(card.id)
      if (!from || !to) continue
      const tight = times.get(id)!.critical && times.get(card.id)!.critical
      const before = board.cards.find(item => item.id === id)!.label
      const breaks = broken.has(id + '>' + card.id)
      shapes.push({ t: 'path', ...elbow(from, to), color: breaks ? layerInk.refuse : tight ? CRITICAL : layerInk.ink, width: breaks || tight ? 2 : 1.5,
        ...(breaks && { dash: '5 4', role: 'broken-' + id + '-' + card.id }),
        unlink: { cardId: card.id, waitsOn: id, label: breaks ? `Remove the link: ${card.label} waits on ${before}, and starts before it ends` : `Remove the link: ${card.label} waits on ${before}` } })
    }
    // A task moved anyway says so beside its bar: who and when.
    const mark = workshopOverrideLine(card)
    const t = times.get(card.id)!, box = g.bars.get(card.id)!
    if (hiring) {
      // From the first day: the band's cost, to the plan's end.
      const band = board.hiring!.bands.find(item => item.id === card.band)
      const x = box.x + box.width, end = g.x0 + day * g.dayW
      if (end > x) shapes.push({ t: 'rect', x, y: box.y + box.height / 2 - 3, w: end - x, h: 6, rx: 3, color: layerInk.bar, opacity: 0.45 })
      shapes.push({ t: 'text', x: g.narrow ? 8 : Math.min(x + 6, end - 120), y: g.narrow ? box.y - 6 : box.y + box.height / 2 - 6,
        text: (g.narrow ? card.label + ' · ' : '') + 'starts ' + shortDate(isoAt(clock!.origin, hireStarts(board, card.id))) + (band ? ' · ' + money(band.monthly, board.hiring!.currency) + '/mo' : '') + (mark ? ' · ' + mark : ''),
        color: mark ? overInk.ink : layerInk.ink, size: 12, role: 'start-' + card.id })
      continue
    }
    // On a phone a task's words sit above its own bar, from its start, clear of its grips (beside the bar, within its
    // height) and of the arrows at the plan's left; a bar too near the right edge ends its words at its end. A halo of the
    // canvas's colour keeps an arrow passing under them from cutting a letter.
    if (g.narrow) {
      const words = `${card.label} · ${card.duration}d` + (mark ? ' · moved anyway' : '')
      const wide = phoneWordsWidth(words, t.critical)
      const fromStart = box.x + 2 + wide <= g.width - 8
      shapes.push({ t: 'text', x: fromStart ? box.x + 2 : Math.max(8 + wide, Math.min(g.width - 8, box.x + box.width)), anchor: fromStart ? 'start' : 'end', y: box.y - 7,
        text: words, color: layerInk.canvasInk, size: 13, bold: t.critical, halo: layerInk.halo, role: 'words-' + card.id })
    }
    if (!t.critical) shapes.push({ t: 'text', x: box.x + box.width + (g.narrow ? 48 : 24), y: box.y + box.height / 2 + 4, text: '+' + t.slack + 'd', color: g.narrow ? layerInk.canvasInk : layerInk.ink, size: 12, role: 'slack-' + card.id })
    if (mark && !g.narrow) shapes.push({ t: 'text', x: box.x + box.width + (t.critical ? 24 : 64), y: box.y + box.height / 2 + 4, text: mark, color: overInk.ink, size: 12, halo: layerInk.halo, role: 'mark-' + card.id })
  }
  // The plan's ends: its first day (a dated plan) and a hiring plan's last week, each a short bar on the grid's edge.
  if (clock && !(hiring && g.narrow)) shapes.push({ t: 'rect', x: g.x0 - 3, y: g.gridTop - 22, w: 6, h: 22, rx: 3, color: layerInk.ink, opacity: 0.7, role: 'edge-first' })
  if (hiring && !g.narrow) shapes.push({ t: 'rect', x: g.x0 + day * g.dayW - 3, y: g.gridTop - 22, w: 6, h: 22, rx: 3, color: layerInk.ink, opacity: 0.7, role: 'edge-last' })
  // The board in focus (the gear's "Change this board"): its span's two ends say what they are and when, under the
  // grid, so a person sees what the start edge and the line grips move (owner addendum, 2026-11-22).
  if (state.boardFocused && clock) {
    // In the strip between the last row and what the board puts under it (its rules note, 16 below), so nothing covers them.
    const at = g.height + 2
    shapes.push({ t: 'text', x: g.x0, y: at, text: 'Starts ' + dayWords(board, 0), color: layerInk.accept, size: 11, bold: true, anchor: 'start', role: 'span-start' })
    const end = hiring ? 'Ends ' + dayWords(board, board.hiring!.weeks * 7 - 1) : lineWord(board).charAt(0).toUpperCase() + lineWord(board).slice(1) + ' ' + dayWords(board, board.launch!.day)
    const ex = g.x0 + (hiring ? day : board.launch!.day) * g.dayW
    shapes.push({ t: 'text', x: ex, y: at, text: end, color: hiring ? layerInk.ink : layerInk.launch, size: 11, bold: true, anchor: 'end', role: 'span-end' })
  }
  // Each bar's two grips, above its bar: on the selected or hovered bar on a laptop, on every bar on a phone (a hiring plan's phone view is read-only).
  if (!(hiring && g.narrow)) for (const card of board.cards) {
    if (!g.narrow && state.focus !== card.id) continue
    const box = g.bars.get(card.id)!
    const y = box.y + 6, h = box.height - 12
    const [sx, ex] = g.narrow ? [box.x - 10, box.x + box.width + 4] : [box.x + 3, box.x + box.width - 9]
    // Bold on the bar in hand; quieter where every bar shows them.
    const opacity = g.narrow ? 0.55 : 0.8
    shapes.push({ t: 'rect', x: sx, y, w: 6, h, rx: 3, color: layerInk.ink, opacity, role: 'grip-start-' + card.id },
      { t: 'rect', x: ex, y, w: 6, h, rx: 3, color: layerInk.ink, opacity, role: 'grip-end-' + card.id })
  }
  if (hiring) {
    // The runway readout, red under a floor the plan keeps; the round's line and its grip.
    const months = runwayMonths(board)
    const floor = board.behaviour?.rules.find(rule => rule.on && rule.kind === 'deadline')
    const low = floor && floor.kind === 'deadline' && months < floor.floor!
    shapes.push({ t: 'text', x: g.narrow ? 8 : g.x0, y: g.narrow ? 18 : 20, text: 'Runway with these hires: ' + runwayWords(months),
      color: low || state.refused ? layerInk.refuse : layerInk.canvasInk, size: 14, bold: true, role: 'header' })
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
  const finish = launchFinish(board)
  const done = Math.max(0, ...[...times.values()].map(t => t.to))
  shapes.push({ t: 'text', x: g.narrow ? 8 : g.x0, y: g.narrow ? 18 : 20,
    text: clock ? 'Done ' + dayWords(board, Math.ceil(done) - 1) + ' · ' + lineWord(board) + ' ' + dayWords(board, board.launch!.day) : `Done day ${finish} · launch day ${board.launch!.day}`,
    color: state.refused ? layerInk.refuse : layerInk.canvasInk, size: 14, bold: true, role: 'header' })
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
  // The first day a day (a week on a hiring plan), every task keeping its dates; a hiring plan's last week a week.
  if (part === FIRST && board.clock) return [{ kind: 'set_plan_start', start: isoAt(board.clock.origin, Math.sign(step) * (board.kind === 'hiring-plan' ? 7 : Math.abs(step) > 1 ? 7 : 1)) }]
  if (part === LAST && board.hiring) return [{ kind: 'set_plan_weeks', weeks: board.hiring.weeks + Math.sign(step) }]
  // The start grip moves the start and keeps the end: a step later is a step shorter.
  const from = startHandleCard(part), task = from !== null && board.cards.find(item => item.id === from)
  if (task) return [{ kind: 'set_task', card: { id: task.id }, duration: task.duration! - step, lag: (task.lag ?? 0) + step }]
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
    // A drop the rules refuse may be made anyway once the person agrees (set_task with override): asked on the drop.
    const anyway = (lag: number) => {
      const edit = { kind: 'set_task' as const, card: { id: cardId }, lag }
      return { edit, to: taskWords(board, edit) }
    }
    const step = snapStep(board)
    // Never before the plan's first day (a hard limit): a drag far to the left asks for the first day it may start.
    const ready = scheduleLaunch(board).get(cardId)!.start - (card.lag ?? 0)
    const first = (lag: number) => Math.max(lag, -ready)
    if (ruled(board)) {
      // The day under the bar's start, through the calendar (a weekend is drawn, but not counted on a working-day plan).
      const t = scheduleLaunch(board).get(cardId)!
      const day = Math.round(t.from + (point.x - grab.x - g.bars.get(cardId)!.x) / g.dayW)
      const lag = (card.lag ?? 0) + dayMap(clockOf(board)).idx(day) - t.start
      const snapped = first(Math.round(lag / step) * step)
      // Well before what it waits on ends (more than a step: a small overshoot still stops at the earliest start):
      // refused, and offered anyway. A task with nothing to wait on stops at the first day.
      if (snapped < -step && card.dependsOn?.length) return { laneId: card.laneId, reason: waitsRefusal(board, cardId, snapped)!, override: anyway(snapped) }
      const tried = tryTask(board, cardId, { lag: Math.max(0, snapped) })
      return typeof tried === 'string' ? { laneId: card.laneId, reason: tried, lands: true, override: anyway(Math.max(0, snapped)) } : null
    }
    const snapped = first(Math.round(wanted / step) * step)
    if (snapped < -step && card.dependsOn?.length) return { laneId: card.laneId, reason: waitsRefusal(board, cardId, snapped)!, override: anyway(snapped) }
    const limits = launchPlanLimits(board, { cardId, field: 'lag' })
    if (wanted > limits.max) return { laneId: card.laneId, reason: launchOverrun(withTaskValue(board, { cardId, field: 'lag' }, wanted), cardId) ?? limits.reasons.max!, override: anyway(wanted) }
    return null
  },
  handleDrag(board, handleId, grab, layout) {
    const g = launchLayout(board, layout)
    if (board.kind === 'hiring-plan' && layout.narrow) return null
    // A task's start or end grip.
    const from = startHandleCard(handleId)
    if (from !== null) return board.cards.some(card => card.id === from) ? edgeGrip(board, from, 'start', grab, g, handleId) : null
    const ends = handleId.slice('handle-'.length)
    if (board.cards.some(card => card.id === ends)) return edgeGrip(board, ends, 'end', grab, g, handleId)
    if (handleId === 'handle-launch') return launchGrip(board, grab, g, layout)
    if (handleId === 'handle-funding' && board.hiring?.funding) return fundingGrip(board, grab, g)
    if (handleId === FIRST && board.clock) return firstDayGrip(board, grab, g, layout)
    if (handleId === LAST && board.hiring) return lastWeekGrip(board, grab, g, layout)
    return null
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(board, point, layout) {
    const g = launchLayout(board, layout)
    if (g.narrow || point.x < g.x0) return null
    return (point.x - g.x0) / g.dayW
  },
  keyEdit,
  overrideWords: taskWords,
  keyChoices,
  cardKeys: 'Left and Right move it a day, Shift changes its length, L chooses what it waits on.',
  cardOfPart(board, part) {
    const id = startHandleCard(part) ?? (/^(?:card|handle)-(.+)$/.exec(part)?.[1] ?? null)
    return id !== null && board.cards.some(card => card.id === id) ? id : null
  },
}

/**
 * A task's start or end grip: where the pointer has taken the edge, in the plan's days (dragTaskEdge), shown as
 * the plan would be. At a bound (a day long, what it waits on) the grip holds and says why; past a rule (the
 * hard line, a freeze, a lock) the nearest edge the rules take is shown with the rule's sentence, and the drop
 * is refused in it, the bar going back.
 */
function edgeGrip(board: Workshop, cardId: string, edge: TaskEdge, grab: { x: number; y: number }, g: LaunchGeometry, name: string) {
  const part = g.parts.find(item => item.name === name)
  if (!part) return null
  return (point: { x: number; y: number }) => {
    // How far the grip has moved, in calendar days of the grid (a weekend is drawn, so it is a day of pixels).
    const drag = dragTaskEdge(board, cardId, edge, (point.x - grab.x - part.x) / g.dayW)
    if (drag.next) return { next: drag.next, ...(drag.reason && { clampedReason: drag.reason }) }
    // Past a rule: the bar goes back, and the person is asked whether to set it there anyway (set_task with override).
    const lag = drag.values.lag, end = startDay(board, cardId, lag) + calendarDays(board, cardId, lag, drag.values.duration) - 1
    return { next: nearestLegal(board, cardId, drag.values) ?? board, clampedReason: drag.refusal!, refusal: drag.refusal!,
      override: { edit: { kind: 'set_task', card: { id: cardId }, lag, duration: drag.values.duration },
        to: edge === 'start' || board.kind === 'hiring-plan' ? taskWords(board, { kind: 'set_task', card: { id: cardId }, lag, duration: drag.values.duration }) : 'to end ' + dayWords(board, end) } }
  }
}

/**
 * Where a set_task made anyway takes its task, in words (the "Move anyway?" dialog's title): "to start Tue 1 Dec", "to
 * end Mon 28 Dec" when only its days change, and on a hiring plan the day the hire starts work, as the board says it
 * ("to start work Mon 15 Feb (recruiting from Mon 21 Dec)").
 */
export function taskWords(board: Workshop, edit: WorkshopEdit): string | undefined {
  if (edit.kind !== 'set_task') return undefined
  const id = typeof edit.card === 'object' && edit.card && 'id' in edit.card ? (edit.card as { id: string }).id : null
  const card = id ? board.cards.find(item => item.id === id) : undefined
  if (!card) return undefined
  let next = board
  if (edit.lag !== undefined) next = withTaskValue(next, { cardId: card.id, field: 'lag' }, edit.lag)
  if (edit.duration !== undefined) next = withTaskValue(next, { cardId: card.id, field: 'duration' }, edit.duration)
  const t = scheduleLaunch(next).get(card.id)!
  if (board.kind === 'hiring-plan' && board.clock) {
    return 'to start work ' + dayWords(next, hireStarts(next, card.id)) + ' (recruiting from ' + dayWords(next, t.from) + ')'
  }
  const sameStart = edit.lag === undefined || edit.lag === (card.lag ?? 0)
  return sameStart && edit.duration !== undefined && edit.duration !== card.duration ? 'to end ' + dayWords(next, t.to - 1) : 'to start ' + dayWords(next, t.from)
}

/** The calendar day a task starts on with `lag` (what it waits on as it is). */
function startDay(board: Workshop, cardId: string, lag: number): number {
  return scheduleLaunch(withTaskValue(board, { cardId, field: 'lag' }, lag)).get(cardId)!.from
}

/** How many calendar days a task with `lag` and `duration` spans (weekends count where days are working days). */
function calendarDays(board: Workshop, cardId: string, lag: number, duration: number): number {
  const t = scheduleLaunch(withTaskValue(withTaskValue(board, { cardId, field: 'lag' }, lag), { cardId, field: 'duration' }, duration)).get(cardId)!
  return t.to - t.from
}

/** From values the rules refuse back toward the task as it is, the first the rules take: what a held grip shows. */
function nearestLegal(board: Workshop, cardId: string, wanted: EdgeValues): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)!
  const step = snapStep(board), lag = card.lag ?? 0, duration = card.duration ?? 1
  // The start edge moves lag and length together (the end stays); the end edge moves only the length.
  const towards = (from: number, to: number) => Math.sign(to - from) * step
  for (let at = { ...wanted }; at.lag !== lag || at.duration !== duration;) {
    if (at.lag !== lag) { const move = towards(at.lag, lag); at = { lag: at.lag + move, duration: at.duration - move } }
    else at = { lag, duration: at.duration + towards(at.duration, duration) }
    const tried = tryTask(board, cardId, { lag: at.lag, duration: at.duration })
    if (typeof tried !== 'string') return tried
  }
  return null
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

/**
 * Launch day's grip (go-live, or whatever the plan calls its line): the pointer's days from where the line was, on
 * the scale the drag started with, so a later line draws the days it adds and the plan grows under the pointer
 * (the drag's layout keeps the day width). It lands on a working day where weekends don't count (later: the
 * Monday after; earlier: the Friday before). Before the tasks end, a hard line refuses it in the plan's sentence
 * with the earliest day that fits, shown there while held; the drop goes back. The drop is one set_launch_day.
 */
function launchGrip(board: Workshop, grab: { x: number; y: number }, g: LaunchGeometry, layout: WorkshopBoardLayout) {
  const part = g.parts.find(item => item.name === 'handle-launch')
  if (!part) return null
  const keep: WorkshopBoardLayout = { ...layout, dayWidth: g.dayW }
  return (point: { x: number; y: number }) => {
    const move = moveLaunch(board, board.launch!.day + Math.round((point.x - grab.x - part.x) / g.dayW))
    if (move.next) return { next: move.next, layout: keep, ...(move.reason && { clampedReason: move.reason }) }
    // Held at the nearest day the rules take on the way back to where it was, saying why.
    let shown: Workshop = board
    const toward = Math.sign(board.launch!.day - move.day)
    for (let day = move.day + toward; toward && day !== board.launch!.day; day += toward) {
      const tried = moveLaunch(board, day)
      if (tried.next) { shown = tried.next; break }
    }
    return { next: shown, layout: keep, clampedReason: move.refusal!, refusal: move.refusal! }
  }
}

/**
 * A dated plan's first day: earlier adds days at the front, later takes them away; every task, the line and a
 * round keep their dates (a task that would start before the new first day starts on it). The grid keeps the day
 * width the drag started with, so the plan grows or shrinks on the right under the pointer. On working days
 * a weekend lands on the working day toward where it was going; a hiring plan moves in weeks. Refused by the
 * rules (a task pushed past the line, a lock, the 120 days), it says why and the latest first day that fits.
 */
function firstDayGrip(board: Workshop, grab: { x: number; y: number }, g: LaunchGeometry, layout: WorkshopBoardLayout) {
  const part = g.parts.find(item => item.name === FIRST)
  if (!part) return null
  const keep: WorkshopBoardLayout = { ...layout, dayWidth: g.dayW }
  return (point: { x: number; y: number }) => {
    const move = movePlanStart(board, (point.x - grab.x - part.x) / g.dayW)
    if (move.next) return { next: move.next, layout: keep }
    return { next: board, layout: keep, clampedReason: move.refusal!, refusal: move.refusal! }
  }
}

/** A hiring plan's last week: a week at a time, never before a hire starts or the round closes, 13 to 104 weeks. */
function lastWeekGrip(board: Workshop, grab: { x: number; y: number }, g: LaunchGeometry, layout: WorkshopBoardLayout) {
  const part = g.parts.find(item => item.name === LAST)
  if (!part) return null
  const keep: WorkshopBoardLayout = { ...layout, dayWidth: g.dayW }
  const weeks = board.hiring!.weeks
  return (point: { x: number; y: number }) => {
    const wanted = weeks + Math.round((point.x - grab.x - part.x) / g.dayW / 7)
    const why = planWeeksProblem(board, wanted)
    if (!why) return { next: { ...board, hiring: { ...board.hiring!, weeks: wanted } }, layout: keep }
    return { next: board, layout: keep, clampedReason: why, refusal: why }
  }
}

/** A hiring plan's funding round: its grip moves it in the plan's steps (a week where it snaps to weeks), on the plan's weeks, as its rules allow. */
function fundingGrip(board: Workshop, grab: { x: number; y: number }, g: LaunchGeometry) {
  const part = g.parts.find(item => item.name === 'handle-funding')
  if (!part) return null
  const from = board.hiring!.funding!.day, step = snapStep(board), last = board.hiring!.weeks * 7
  const set = (day: number): Workshop => ({ ...board, hiring: { ...board.hiring!, funding: { ...board.hiring!.funding!, day } } })
  return (point: { x: number; y: number }) => {
    const wanted = from + Math.round((point.x - grab.x - part.x) / g.dayW / step) * step
    const day = Math.min(last, Math.max(0, wanted))
    const why = planProblem0(board, set(day))
    if (why) return { next: board, clampedReason: why, refusal: why }
    return { next: set(day), ...(day !== wanted && { clampedReason: day > wanted ? 'The round closes on the plan’s first day at the earliest.' : 'The round closes within the plan’s ' + board.hiring!.weeks + ' weeks.' }) }
  }
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
