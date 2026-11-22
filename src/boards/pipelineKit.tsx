// Sales pipeline kit: stages as lanes under a forecast gauge. A deal is carried to the nearest stage
// the rules allow; the gauge is drawn from the board on show, so it moves while a deal is in the air.
import {
  laneColors, workshopCandidate, workshopDestinations, type BoardLayerState, type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout,
} from '../workshops/model'
import { pipelineCaption, pipelineForecast, pipelineRefusal } from '../workshops/pipeline'
import { money } from '../workshops/numbers'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, orColumnUnder, partsGeometry } from '../workshops/boardSpecs'
import { tint } from './shared'
import { partNotes, pipelineGauge, workshopEditsBetween } from './readouts'

const GAUGE = 76

/** Where every note of a pipeline goes, in board coordinates. */
export function pipelineLayout(board: Workshop, layout: WorkshopBoardLayout = {}) {
  const narrow = Boolean(layout.narrow)
  const parts: PartPlace[] = []
  const counts = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  const color = (i: number) => board.lanes[i].role === 'won' ? '#bfe3cf' : board.lanes[i].role === 'lost' ? '#e4dcdc' : laneColors[i % laneColors.length]
  let width: number, height: number
  if (narrow) {
    // Stages one under another, each the full width; the gauge stays above them.
    width = Math.max(300, layout.width ?? 390)
    let y = GAUGE
    board.lanes.forEach((lane, i) => {
      const h = 96 + (counts[i] + 1) * 64
      parts.push({ name: 'column-' + lane.id, x: 2, y, width: width - 4, height: h, fill: tint(color(i), 0.6), line: tint(color(i), 0.1) })
      // The stage's name takes the room it needs; its caption ("3 deals · $170k · 60%") the rest, at the size of the
      // deals' words on up to three lines (a refusal is a sentence), so a phone that shows two stages at once still sets it at 12px or more.
      const pill = (width - 16) * 0.36
      parts.push({ name: 'lane-' + lane.id, x: 8, y: y + 6, width: pill, height: 36, text: lane.label, fill: color(i), fontSize: 15 })
      parts.push({ name: 'caption-' + lane.id, x: 8 + pill + 6, y: y + 6, width: width - 16 - pill - 6, height: 56, text: pipelineCaption(board, lane.id), fill: 'transparent', lineWidth: 0, fontSize: 15 })
      board.cards.filter(card => card.laneId === lane.id).forEach((card, k) =>
        parts.push({ name: 'card-' + card.id, x: 8, y: y + 72 + k * 64, width: width - 16, height: 56, text: cardText(board, card.id), fontSize: 15 }))
      y += h + 10
    })
    height = y
  } else {
    const pitch = 244
    const most = Math.max(...counts)
    const h = 116 + (most + 1) * 88
    board.lanes.forEach((lane, i) => {
      const x = i * pitch
      parts.push({ name: 'column-' + lane.id, x: x + 2, y: GAUGE, width: pitch - 4, height: h, fill: tint(color(i), 0.6), line: tint(color(i), 0.1) })
      parts.push({ name: 'lane-' + lane.id, x: x + 8, y: GAUGE + 6, width: 228, height: 58, text: lane.label, fill: color(i), fontSize: 16 })
      parts.push({ name: 'caption-' + lane.id, x: x + 8, y: GAUGE + 66, width: 228, height: 48, text: pipelineCaption(board, lane.id), fill: 'transparent', lineWidth: 0, fontSize: 15 })
      board.cards.filter(card => card.laneId === lane.id).forEach((card, k) =>
        parts.push({ name: 'card-' + card.id, x: x + 8, y: GAUGE + 116 + k * 88, width: 228, height: 76, text: cardText(board, card.id), fontSize: 15 }))
    })
    width = board.lanes.length * pitch
    height = GAUGE + h
  }
  parts.push({ name: 'gauge-forecast', x: 0, y: 0, width: Math.min(width, 520), height: 34, text: pipelineGauge(board), fill: 'transparent', lineWidth: 0, fontSize: 17 })
  return { parts, width, height }
}

function cardText(board: Workshop, cardId: string) {
  const card = board.cards.find(item => item.id === cardId)!
  return card.amount === undefined ? card.label + '\nno amount yet' : card.label + '\n' + money(card.amount, board.forecast!.currency)
}

function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  const { width } = pipelineLayout(board, state.layout)
  const target = board.forecast!.target, forecast = pipelineForecast(board)
  const scale = Math.max(target * 1.25, forecast)
  const span = width - 8
  const reached = forecast >= target
  return [
    { t: 'rect', x: 4, y: 42, w: span, h: 14, rx: 7, color: layerInk.track },
    { t: 'rect', x: 4, y: 42, w: span * forecast / scale, h: 14, rx: 7, color: reached ? layerInk.accept : layerInk.bar },
    { t: 'line', x1: 4 + span * target / scale, y1: 36, x2: 4 + span * target / scale, y2: 62, color: layerInk.ink, width: 2 },
    { t: 'text', x: 4 + span * target / scale, y: 72, text: 'Target ' + money(target, board.forecast!.currency), color: layerInk.ink, size: 14, anchor: 'middle' },
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
      return reason ? { laneId: lane.id, reason } : null
    }
    return null
  },
  handleDrag: () => null,
}
