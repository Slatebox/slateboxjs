// Sales pipeline: deals move through stages one at a time, a won deal needs an amount, a stage
// may hold only so many deals, and the forecast weighs each open deal by its stage's chance.
import type { Workshop, WorkshopCard, WorkshopLane } from './model'
// The rule modules take the model's own helpers from the model, so they share its chunk instead of copying it.
import { registerWorkshopRules, said, workshopLaneOverridden } from './model'
import type { BusinessBoardRules, BusinessEditTools, WorkshopLimits } from './kinds'
import type { WorkshopEdit } from './edits'
import { amountLimits, amountOf, currencyOf, money, nextCardId, noteNumbers, ownField, renamedNumbers } from './numbers'

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
    // A deal moved anyway may fill a stage past its limit: the stage says so (pipelineCaption).
    if (lane.capacity !== undefined && held > lane.capacity && !workshopLaneOverridden(board, lane.id)) return `${lane.label} already holds ${held} of ${lane.capacity} deals.`
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
  if (to.role === 'won' && card.amount === undefined) {
    return `${card.label} needs an amount before it can be won. Write it on the card, like '${card.label} $40k'.`
  }
  // Every rule the move breaks, so a move made anyway names each: a stage skipped, and a stage at its limit.
  const broken: string[] = []
  if (to.role === 'won' || (open(from) && open(to) && stages.indexOf(to) > stages.indexOf(from))) {
    const next = stages[stages.indexOf(from) + 1] ?? board.lanes.find(lane => lane.role === 'won')!
    if (next !== to) broken.push(`Deals move one stage at a time. ${card.label} is in ${from.label}, so ${next.label} comes first.`)
  }
  const held = board.cards.filter(item => item.laneId === to.id).length
  if (to.capacity !== undefined && held >= to.capacity) broken.push(`${to.label} already holds ${held} of ${to.capacity} deals.`)
  return broken.length ? broken.join(' ') : null
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
  const over = lane.capacity !== undefined && deals.length > lane.capacity ? ` · over its limit of ${lane.capacity}` : ''
  return `${deals.length} ${deals.length === 1 ? 'deal' : 'deals'} · ${money(sum, board.forecast?.currency)} · ${Math.round(chance * 100)}%${over}`
}

/** Whether a stage holds more deals than its limit (a deal moved anyway): drawn in red. */
export function pipelineStageOver(board: Workshop, laneId: string): boolean {
  const lane = board.lanes.find(item => item.id === laneId)
  return Boolean(lane && lane.capacity !== undefined && board.cards.filter(card => card.laneId === laneId).length > lane.capacity)
}


export function pipelineLimits(_board: Workshop, ref: { field: 'amount' | 'target' }): WorkshopLimits {
  return ref.field === 'target'
    ? { field: 'target', min: 1, max: 1e9, reasons: { min: 'A target is more than nothing.', max: 'A target is at most 1,000,000,000.' } }
    : amountLimits
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

/** A deal or line item's amount on the board ("Acme\n$25k") and as a note again ("Acme · $25k"). */
const amountText = (board: Workshop, card: WorkshopCard, between: string) =>
  card.amount === undefined ? card.label : card.label + between + money(card.amount, board.forecast?.currency ?? board.budget?.currency)

/** The parts a pipeline and a budget share: amounts on cards, read and written the same way. */
export const amountRules = {
  readCard(raw: Record<string, unknown>, card: WorkshopCard) {
    if (raw.amount !== undefined) card.amount = amountOf(raw.amount, 0, 1e9, 'An amount is a whole amount, not below zero.')
  },
  cardText: (board: Workshop, card: WorkshopCard) => amountText(board, card, '\n'),
  noteText: (board: Workshop, card: WorkshopCard) => amountText(board, card, ' · '),
  renamed(_board: Workshop, cardId: string, text: string) {
    const read = renamedNumbers(text)
    return { label: read.label, edits: read.amount !== undefined ? [{ kind: 'set_amount' as const, card: { id: cardId }, amount: read.amount }] : [] }
  },
}

/** The pipeline's part of the one gate (see kinds.ts). */
export const pipelineRules: BusinessBoardRules = {
  ...amountRules,
  kind: 'pipeline',
  cards: [16, 'A pipeline holds up to 16 deals.'],
  readLane(raw, lane) {
    if (raw.role !== undefined) {
      if (raw.role !== 'won' && raw.role !== 'lost') throw new Error('A stage is won, lost or open.')
      lane.role = raw.role
    }
    if (raw.probability !== undefined) lane.probability = amountOf(raw.probability, 0, 1, 'A stage\'s chance is from 0 to 100%.', true)
  },
  readBoard(raw, board) {
    const forecast = ownField(raw, 'forecast', 'A pipeline needs a forecast target.')
    board.forecast = { target: amountOf(forecast.target, 1, 1e9, 'A target is a whole amount above zero.'), currency: currencyOf(forecast.currency) }
  },
  validate: validatePipeline,
  planMove: planPipelineMove,
  refusal: pipelineRefusal,
  caption: pipelineCaption,
  fromNote(_board, text, unnamed) {
    const read = noteNumbers(text, unnamed)
    return { label: read.label, ...(read.amount !== undefined && { amount: read.amount }) }
  },
  newCard: () => 'deal',
  edit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools) {
    const currency = board.forecast!.currency
    switch (edit.kind) {
      case 'add_card': {
        const target = t.lane(edit.lane)
        const label = edit.label?.trim() || 'New deal'
        const card: WorkshopCard = { id: nextCardId(board), label, laneId: target.id }
        if (edit.amount !== undefined) {
          if (!Number.isInteger(edit.amount) || edit.amount < amountLimits.min) t.refuse(amountLimits.reasons.min, { laneId: target.id, limits: amountLimits })
          if (edit.amount > amountLimits.max) t.refuse(amountLimits.reasons.max, { laneId: target.id, limits: amountLimits })
          card.amount = edit.amount
        }
        if (target.role) t.refuse('A new deal starts in an open stage, not in ' + target.label + '.', { laneId: target.id })
        const held = board.cards.filter(item => item.laneId === target.id).length
        if (target.capacity !== undefined && held >= target.capacity) t.refuse(target.label + ' already holds ' + held + ' of ' + target.capacity + ' deals.', { laneId: target.id })
        return t.done(t.settle({ ...board, cards: [...board.cards, card] }, target.id), 'Added ' + said(label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: card.id })
      }
      case 'set_amount': {
        const item = t.card(edit.card)
        const at = { laneId: item.laneId, cardId: item.id, limits: amountLimits }
        if (!Number.isInteger(edit.amount) || edit.amount < amountLimits.min || edit.amount > amountLimits.max) {
          t.refuse(edit.amount < amountLimits.min ? amountLimits.reasons.min : amountLimits.reasons.max, at)
        }
        item.amount = edit.amount
        return t.done(t.settle(board, item.laneId, item.id), said(item.label) + ' is now ' + money(edit.amount, currency) + '.', { laneId: item.laneId, cardId: item.id })
      }
      case 'set_target': {
        const limits = pipelineLimits(board, { field: 'target' })
        if (!Number.isInteger(edit.amount) || edit.amount < 1 || edit.amount > limits.max) t.refuse(edit.amount < 1 ? limits.reasons.min! : limits.reasons.max!, { limits })
        board.forecast!.target = edit.amount
        return t.done(t.settle(board), 'The target is now ' + money(edit.amount, currency) + '.')
      }
    }
    return null
  },
}
registerWorkshopRules(pipelineRules)
