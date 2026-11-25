// Sales pipeline kit: stages as lanes under a forecast gauge. A deal is carried to the nearest stage
// the rules allow; the gauge is drawn from the board on show, so it moves while a deal is in the air.
import {
  laneColors, workshopCandidate, workshopDestinations, type BoardLayerState, type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopEdit,
} from '../workshops/model'
import { pipelineCaption, pipelineForecast, pipelineLimits, pipelineRefusal, pipelineStageOver } from '../workshops/pipeline'
import { money } from '../workshops/numbers'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, orColumnUnder, partsGeometry } from '../workshops/boardSpecs'
import { overInk, tint, withMark } from './shared'
import { partNotes, pipelineGauge, workshopEditsBetween } from './readouts'
import { HEADER_SLOT, LANE_NAME_HEIGHT } from '../workshops/laneHeader'

const GAUGE = 76

/** Where every note of a pipeline goes, in board coordinates. */
export function pipelineLayout(board: Workshop, layout: WorkshopBoardLayout = {}) {
  const narrow = Boolean(layout.narrow)
  const parts: PartPlace[] = []
  const counts = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  const color = (i: number) => board.lanes[i].role === 'won' ? '#bfe3cf' : board.lanes[i].role === 'lost' ? '#e4dcdc' : laneColors[i % laneColors.length]
  // A stage past its limit (a deal moved there anyway) is drawn in red, and its caption says so.
  const column = (i: number) => pipelineStageOver(board, board.lanes[i].id) ? { fill: overInk.fill, line: overInk.line, lineWidth: 2 } : { fill: tint(color(i), 0.6), line: tint(color(i), 0.1) }
  const over = (i: number) => pipelineStageOver(board, board.lanes[i].id) ? { ink: overInk.ink } : {}
  let width: number, height: number
  if (narrow) {
    // Stages one under another, each the full width; the gauge stays above them.
    width = Math.max(300, layout.width ?? 390)
    let y = GAUGE
    board.lanes.forEach((lane, i) => {
      // A deal that carries its move-anyway mark is a line taller, so its words stay at 12px or more.
      const marked = board.cards.filter(card => card.laneId === lane.id && card.override).length
      // Its header (laneHeader.ts): the name, its color button's slot, the caption, and under them the strip of − and +.
      const h = 138 + (counts[i] + 1) * 64 + marked * 18
      parts.push({ name: 'column-' + lane.id, x: 2, y, width: width - 4, height: h, ...column(i) })
      // The stage's name takes the room it needs; its caption ("3 deals · $170k · 60%") the rest, at the size of the
      // deals' words on up to three lines (a refusal is a sentence), so a phone that shows two stages at once still sets it at 12px or more.
      const pill = Math.floor((width - 16) * 0.36)
      parts.push({ name: 'lane-' + lane.id, x: 8, y: y + 6, width: pill, height: LANE_NAME_HEIGHT, text: lane.label, fill: color(i), fontSize: 15 })
      parts.push({ name: 'caption-' + lane.id, x: 8 + pill + HEADER_SLOT, y: y + 6, width: width - 16 - pill - HEADER_SLOT, height: 56, text: pipelineCaption(board, lane.id).replace(' · over its limit', '\nover its limit'), fill: 'transparent', lineWidth: 0, fontSize: 15, ...over(i) })
      let top = y + 114
      for (const card of board.cards.filter(item => item.laneId === lane.id)) {
        const tall = card.override ? 18 : 0
        parts.push({ name: 'card-' + card.id, x: 8, y: top, width: width - 16, height: 56 + tall, text: cardText(board, card.id), fontSize: 15 })
        top += 64 + tall
      }
      y += h + 10
    })
    height = y
  } else {
    const pitch = 244
    const most = Math.max(...counts)
    // A stage over its limit says so on a caption line of its own: every stage's deals move down to make room for it.
    const room = board.lanes.some(lane => pipelineStageOver(board, lane.id)) ? 24 : 0
    // The header (laneHeader.ts): the name and its color button's slot, the caption, then the strip of the stage's
    // controls just above its deals, reserved whether or not the controls show.
    const h = 148 + room + (most + 1) * 88
    board.lanes.forEach((lane, i) => {
      const x = i * pitch
      parts.push({ name: 'column-' + lane.id, x: x + 2, y: GAUGE, width: pitch - 4, height: h, ...column(i) })
      parts.push({ name: 'lane-' + lane.id, x: x + 8, y: GAUGE + 6, width: 228 - HEADER_SLOT, height: LANE_NAME_HEIGHT, text: lane.label, fill: color(i), fontSize: 16 })
      parts.push({ name: 'caption-' + lane.id, x: x + 8, y: GAUGE + 48, width: 228, height: 48 + room, text: pipelineCaption(board, lane.id).replace(' · over its limit', '\nover its limit'), fill: 'transparent', lineWidth: 0, fontSize: 15, ...over(i) })
      board.cards.filter(card => card.laneId === lane.id).forEach((card, k) =>
        parts.push({ name: 'card-' + card.id, x: x + 8, y: GAUGE + 148 + room + k * 88, width: 228, height: 76, text: cardText(board, card.id), fontSize: 15 }))
    })
    width = board.lanes.length * pitch
    height = GAUGE + h
  }
  parts.push({ name: 'gauge-forecast', x: 0, y: 0, width: Math.min(width, 520), height: 34, text: pipelineGauge(board), fill: 'transparent', lineWidth: 0, fontSize: 17 })
  // The target's grip, on its mark on the gauge: a finger's 44px.
  parts.push({ name: 'handle-target', x: targetX(board, layout, width) - 22, y: 27, width: 44, height: 44 })
  return { parts, width, height }
}

/** What the gauge spans: the scale a held target keeps, or a quarter past the target (the forecast, if more). */
const gaugeScale = (board: Workshop, layout: WorkshopBoardLayout = {}) => layout.gaugeScale ?? Math.max(board.forecast!.target * 1.25, pipelineForecast(board))
/** Where the target's mark is on a gauge `width` wide. */
const targetX = (board: Workshop, layout: WorkshopBoardLayout, width: number) => 4 + (width - 8) * board.forecast!.target / gaugeScale(board, layout)
/** The target moves in steps of about a hundredth of the gauge: $1k, $5k, $10k, $50k, … */
export function targetStep(scale: number): number {
  for (const step of [1000, 5000, 10000, 50000, 100000, 500000, 1e6, 5e6, 1e7]) if (step * 100 >= scale) return step
  return 5e7
}

/** The target's keys: Left and Right lower and raise it a step. */
function keyEdit(board: Workshop, part: string, { key }: { key: string; shiftKey: boolean }): WorkshopEdit[] | null {
  if (part !== 'handle-target' || (key !== 'ArrowLeft' && key !== 'ArrowRight')) return null
  const step = targetStep(gaugeScale(board))
  return [{ kind: 'set_target', amount: Math.max(step, board.forecast!.target + (key === 'ArrowLeft' ? -step : step)) }]
}

function cardText(board: Workshop, cardId: string) {
  const card = board.cards.find(item => item.id === cardId)!
  return withMark(card.amount === undefined ? card.label + '\nno amount yet' : card.label + '\n' + money(card.amount, board.forecast!.currency), card)
}

function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  const { width } = pipelineLayout(board, state.layout)
  const target = board.forecast!.target, forecast = pipelineForecast(board)
  const scale = gaugeScale(board, state.layout)
  // A target held past the gauge's end draws the gauge on to it.
  const span = Math.max(width - 8, (width - 8) * target * 1.1 / scale)
  const reached = forecast >= target
  return [
    { t: 'rect', x: 4, y: 42, w: span, h: 14, rx: 7, color: layerInk.track },
    { t: 'rect', x: 4, y: 42, w: (width - 8) * forecast / scale, h: 14, rx: 7, color: reached ? layerInk.accept : layerInk.bar },
    { t: 'line', x1: targetX(board, state.layout, width), y1: 36, x2: targetX(board, state.layout, width), y2: 62, color: layerInk.ink, width: 2 },
    { t: 'rect', x: targetX(board, state.layout, width) - 4, y: 30, w: 8, h: 12, rx: 4, color: layerInk.ink, role: 'edge-target' },
    { t: 'text', x: targetX(board, state.layout, width), y: 72, text: 'Target ' + money(target, board.forecast!.currency), color: layerInk.ink, size: 14, anchor: 'middle' },
  ]
}

export const pipelineKit: WorkshopBoardKit = {
  laneCues: true,
  places: (board, layout) => pipelineLayout(board, layout),
  notes: (board, layout, origin, style) => partNotes(pipelineLayout(board, layout).parts, board, origin, style),
  editsBetween: workshopEditsBetween,
  layer: slate => createBoardLayer(slate, paint),
  chooser(board, cardId, grab, layout = {}) {
    // The legal boards, one per stage the rules allow (the deal at the foot of that stage), and the board itself.
    const legal = workshopDestinations(board, cardId).map(lane => workshopCandidate(board, cardId, lane.id)!)
    if (legal.length < 2) return null
    return orColumnUnder(headlessDrag(board, 'card-' + cardId, grab, state => partsGeometry(pipelineLayout(state, layout).parts), (d, state) =>
      d.closest(legal, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(state, { gapIn: 40, gapOut: 56 })), board, cardId, pipelineLayout(board, layout).parts, legal)
  },
  refusalAt(board, cardId, _grab, point, layout) {
    const { parts } = pipelineLayout(board, layout)
    const card = board.cards.find(item => item.id === cardId)!
    for (const lane of board.lanes) {
      if (lane.id === card.laneId || !inside(parts.find(part => part.name === 'column-' + lane.id), point)) continue
      const reason = pipelineRefusal(board, cardId, lane.id)
      // Refused, it may still be moved anyway once the person agrees (the native layer asks, unless it is a hard limit).
      return reason ? { laneId: lane.id, reason, override: { edit: { kind: 'move_card', card: { id: cardId }, lane: { id: lane.id } } } } : null
    }
    return null
  },
  /**
   * The target's grip: dragged right it raises the target, left it lowers it, in the gauge's steps, on the scale the
   * drag started with (the gauge draws on past its end for a target held beyond it). One set_target on the drop.
   */
  handleDrag(board, handleId, grab, layout) {
    if (handleId !== 'handle-target') return null
    const g = pipelineLayout(board, layout)
    const part = g.parts.find(item => item.name === 'handle-target')!
    const scale = gaugeScale(board, layout), step = targetStep(scale), per = scale / (g.width - 8)
    const keep: WorkshopBoardLayout = { ...layout, gaugeScale: scale }
    const limits = pipelineLimits(board, { field: 'target' })
    return point => {
      const wanted = board.forecast!.target + Math.round((point.x - grab.x - part.x) * per / step) * step
      const amount = Math.min(limits.max, Math.max(step, wanted))
      const next = { ...board, forecast: { ...board.forecast!, target: amount } }
      return { next, layout: keep, ...(amount !== wanted && { clampedReason: amount < wanted ? limits.reasons.max! : 'A target is at least ' + money(step, board.forecast!.currency) + '.' }) }
    }
  },
  keyEdit,
  label: (board, part) => part === 'handle-target' ? 'Target, ' + money(board.forecast!.target, board.forecast!.currency) + '. Left and Right change it by ' + money(targetStep(gaugeScale(board)), board.forecast!.currency) + '.' : null,
}
