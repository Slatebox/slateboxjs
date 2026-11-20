// Sales pipeline: deals move through stages one at a time, a won deal needs an amount, a stage
// may hold only so many deals, and the forecast weighs each open deal by its stage's chance.
import type { Workshop, WorkshopLane } from './model'
import type { WorkshopLimits } from './launchPlan'
import { money } from './numbers'

const open = (lane: WorkshopLane) => !lane.role

/** Σ amount × chance over open stages, plus every won amount. */
export function pipelineForecast(board: Workshop): number {
  let sum = 0
  for (const card of board.cards) {
    const lane = board.lanes.find(item => item.id === card.laneId)!
    sum += (card.amount ?? 0) * (lane.role === 'won' ? 1 : lane.role === 'lost' ? 0 : lane.probability ?? 0)
  }
  return Math.round(sum)
}

export function validatePipeline(board: Workshop): string | null {
  if (board.lanes.length < 3) return 'A pipeline has 3 to 5 stages.'
  if (board.cards.length > 16) return 'A pipeline holds up to 16 deals.'
  if (!board.forecast) return 'A pipeline needs a forecast target.'
  if (board.lanes.filter(lane => lane.role === 'won').length > 1 || board.lanes.filter(lane => lane.role === 'lost').length > 1) {
    return 'A pipeline has one Won stage and one Lost stage at most.'
  }
  if (board.lanes.filter(open).length < 1) return 'A pipeline needs an open stage.'
  for (const lane of board.lanes) {
    if (open(lane) && lane.probability === undefined) return `Give ${lane.label} a chance to win, from 0 to 100%.`
    const held = board.cards.filter(card => card.laneId === lane.id).length
    if (lane.capacity !== undefined && held > lane.capacity) return `${lane.label} already holds ${held} of ${lane.capacity} deals.`
  }
  const won = board.lanes.find(lane => lane.role === 'won')
  const unpriced = won && board.cards.find(card => card.laneId === won.id && card.amount === undefined)
  if (unpriced) return `${unpriced.label} needs an amount before it can be won. Write it on the card, like '${unpriced.label} $40k'.`
  return null
}

/** Why the deal may not move to that stage; null when it may (or is there already). */
export function pipelineRefusal(board: Workshop, cardId: string, laneId: string): string | null {
  const card = board.cards.find(item => item.id === cardId)
  const to = board.lanes.find(item => item.id === laneId)
  if (!card || !to) return 'That move is not available.'
  const from = board.lanes.find(item => item.id === card.laneId)!
  if (from === to) return null
  const stages = board.lanes.filter(open)
  if (from.role === 'won' && to.role !== 'lost') return 'A won deal stays won. Move it to Lost if it fell through.'
  if (from.role === 'lost' && to.role === 'won') return `Reopen ${card.label} in an open stage first.`
  if (to.role === 'won' || (open(from) && open(to) && stages.indexOf(to) > stages.indexOf(from))) {
    const next = stages[stages.indexOf(from) + 1] ?? board.lanes.find(lane => lane.role === 'won')!
    if (next !== to) return `Deals move one stage at a time. ${card.label} is in ${from.label}, so ${next.label} comes first.`
  }
  if (to.role === 'won' && card.amount === undefined) {
    return `${card.label} needs an amount before it can be won. Write it on the card, like '${card.label} $40k'.`
  }
  const held = board.cards.filter(item => item.laneId === to.id).length
  if (to.capacity !== undefined && held >= to.capacity) return `${to.label} already holds ${held} of ${to.capacity} deals.`
  return null
}

export function planPipelineMove(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || pipelineRefusal(board, cardId, laneId) !== null) return null
  if (card.laneId === laneId) return board
  // The deal goes to the foot of its new stage.
  return { ...board, cards: [...board.cards.filter(item => item !== card), { ...card, laneId }] }
}

export function pipelineCaption(board: Workshop, laneId: string): string {
  const lane = board.lanes.find(item => item.id === laneId)!
  const deals = board.cards.filter(card => card.laneId === laneId)
  const sum = deals.reduce((total, card) => total + (card.amount ?? 0), 0)
  const chance = lane.role === 'won' ? 1 : lane.role === 'lost' ? 0 : lane.probability ?? 0
  return `${deals.length} ${deals.length === 1 ? 'deal' : 'deals'} · ${money(sum, board.forecast?.currency)} · ${Math.round(chance * 100)}%`
}


export function pipelineLimits(_board: Workshop, ref: { field: 'amount' | 'target' }): WorkshopLimits {
  return ref.field === 'target'
    ? { field: 'target', min: 1, max: 1e9, reasons: { min: 'A target is more than nothing.', max: 'A target is at most 1,000,000,000.' } }
    : { field: 'amount', min: 0, max: 1e9, reasons: { min: 'An amount is not below zero.', max: 'An amount is at most 1,000,000,000.' } }
}

export function samplePipeline(): Workshop {
  return {
    version: 1, kind: 'pipeline', title: 'Q3 sales pipeline', forecast: { target: 250000, currency: '$' },
    lanes: [
      { id: 'lead', label: 'Lead', probability: 0.1 }, { id: 'qualified', label: 'Qualified', probability: 0.3 },
      { id: 'proposal', label: 'Proposal', probability: 0.6, capacity: 3 }, { id: 'won', label: 'Won', role: 'won' },
      { id: 'lost', label: 'Lost', role: 'lost' },
    ],
    cards: [
      { id: 'northwind', label: 'Northwind', laneId: 'lead', amount: 40000 },
      { id: 'globex', label: 'Globex', laneId: 'lead', amount: 60000 },
      { id: 'acme', label: 'Acme', laneId: 'qualified', amount: 25000 },
      { id: 'brightline', label: 'Brightline', laneId: 'proposal', amount: 55000 },
      { id: 'copperleaf', label: 'Copperleaf', laneId: 'proposal', amount: 80000 },
      { id: 'harbor', label: 'Harbor & Co', laneId: 'proposal', amount: 35000 },
      { id: 'bluefin', label: 'Bluefin', laneId: 'won', amount: 70000 },
    ],
  }
}
