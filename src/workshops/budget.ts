// Budget: an envelope split between teams. The allocations always add up to the total, each
// stays between its team's floor and cap, and a team's line items fit inside what it was given.
import type { Workshop, WorkshopCard, WorkshopLane } from './model'
// The rule modules take the model's own helpers from the model, so they share its chunk instead of copying it.
import { registerWorkshopRules, said } from './model'
import type { BusinessBoardRules, BusinessEditTools, WorkshopLimits } from './kinds'
import type { WorkshopEdit } from './edits'
import { amountLimits, amountOf, currencyOf, money, moneyExact, nextCardId, noteNumbers, ownField } from './numbers'
import { amountRules } from './pipeline'

export function budgetCommitted(board: Workshop, laneId: string): number {
  return board.cards.reduce((sum, card) => sum + (card.laneId === laneId ? card.amount ?? 0 : 0), 0)
}

/** The least a team's allocation may be: its floor, or what it has committed if that is more. */
const lowest = (board: Workshop, lane: WorkshopLane) => Math.max(lane.floor ?? 0, budgetCommitted(board, lane.id))

export function validateBudget(board: Workshop): string | null {
  const envelope = board.budget
  if (!envelope) return 'A budget needs a total.'
  if (board.cards.length > 16) return 'A budget holds up to 16 line items.'
  const sum = board.lanes.reduce((total, lane) => total + (lane.allocation ?? 0), 0)
  if (sum !== envelope.total) return `The teams' allocations add up to ${money(sum, envelope.currency)}, not ${money(envelope.total, envelope.currency)}.`
  for (const lane of board.lanes) {
    if (lane.allocation === undefined) return `Give ${lane.label} an allocation.`
    if (lane.floor !== undefined && lane.cap !== undefined && lane.floor > lane.cap) return `${lane.label}'s floor is above its cap.`
    if (lane.floor !== undefined && lane.allocation < lane.floor) return `${lane.label}'s floor is ${money(lane.floor, envelope.currency)}.`
    if (lane.cap !== undefined && lane.allocation > lane.cap) return `${lane.label}'s cap is ${money(lane.cap, envelope.currency)}.`
    const committed = budgetCommitted(board, lane.id)
    if (committed > lane.allocation) return `${lane.label} commits ${money(committed, envelope.currency)} of ${money(lane.allocation, envelope.currency)}.`
  }
  if (board.cards.some(card => card.amount === undefined)) return 'Give every line item a cost.'
  return null
}

/** Why the line item may not go to that team; null when it may. */
export function budgetRefusal(board: Workshop, cardId: string, laneId: string): string | null {
  const card = board.cards.find(item => item.id === cardId)
  const lane = board.lanes.find(item => item.id === laneId)
  if (!card || !lane) return 'That move is not available.'
  if (card.laneId === laneId) return null
  const left = (lane.allocation ?? 0) - budgetCommitted(board, laneId)
  const currency = board.budget?.currency
  if ((card.amount ?? 0) > left) return `${lane.label} has ${money(left, currency)} left. ${card.label} costs ${money(card.amount ?? 0, currency)}.`
  return null
}

export function planBudgetMove(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || budgetRefusal(board, cardId, laneId) !== null) return null
  if (card.laneId === laneId) return board
  return { ...board, cards: [...board.cards.filter(item => item !== card), { ...card, laneId }] }
}

/** Move `amount` from one team's allocation to another's. The total stays (set_budget_total changes it). Unchecked: see budgetShiftRefusal. */
export function shiftBudget(board: Workshop, from: string, to: string, amount: number): Workshop {
  return { ...board, lanes: board.lanes.map(lane => lane.id === from ? { ...lane, allocation: (lane.allocation ?? 0) - amount }
    : lane.id === to ? { ...lane, allocation: (lane.allocation ?? 0) + amount } : lane) }
}

/**
 * How far money may move between two teams: `min` and `max` of the amount moved from `from`
 * to `to`, with the sentence for the bound at each end (the team that stops it).
 */
export function budgetShiftLimits(board: Workshop, from: string, to: string): WorkshopLimits {
  const a = board.lanes.find(lane => lane.id === from)!, b = board.lanes.find(lane => lane.id === to)!
  const currency = board.budget?.currency
  const reason = (lane: WorkshopLane, low: boolean) => {
    if (!low) return `${lane.label}'s cap is ${money(lane.cap!, currency)}.`
    const committed = budgetCommitted(board, lane.id)
    return committed >= (lane.floor ?? 0) ? `${lane.label} already commits ${money(committed, currency)}.` : `${lane.label}'s floor is ${money(lane.floor!, currency)}.`
  }
  const bound = (options: { value: number; why: string }[]) => options.reduce((best, item) => item.value < best.value ? item : best)
  // Giving to `to`: `from` may fall to its lowest, `to` may rise to its cap.
  const up = bound([{ value: a.allocation! - lowest(board, a), why: reason(a, true) },
    ...(b.cap !== undefined ? [{ value: b.cap - b.allocation!, why: reason(b, false) }] : [])])
  // Taking from `to`: the reverse.
  const down = bound([{ value: b.allocation! - lowest(board, b), why: reason(b, true) },
    ...(a.cap !== undefined ? [{ value: a.cap - a.allocation!, why: reason(a, false) }] : [])])
  return { field: 'amount', min: -down.value, max: up.value, reasons: { min: down.why, max: up.why } }
}

export function budgetShiftRefusal(board: Workshop, from: string, to: string, amount: number): string | null {
  if (from === to) return 'Choose two different teams.'
  if (!Number.isFinite(amount) || !Number.isInteger(amount)) return 'Move a whole amount.'
  const limits = budgetShiftLimits(board, from, to)
  if (amount > limits.max) return limits.reasons.max!
  if (amount < limits.min) return limits.reasons.min!
  // Money moves in the board's steps, as the divider snaps; a move that stops exactly at a
  // team's bound (what a commitment, floor or cap allows) is the one exception.
  const step = board.budget?.step
  if (step && amount % step !== 0 && amount !== limits.max && amount !== limits.min) return `Move money in steps of ${money(step, board.budget?.currency)}.`
  return null
}

/**
 * The divider between team `laneId` and the next team: how far it may move, as money given to
 * `laneId` (positive) or taken from it (negative), and why it stops.
 */
export function budgetLimits(board: Workshop, ref: { laneId: string }): WorkshopLimits {
  const at = board.lanes.findIndex(lane => lane.id === ref.laneId)
  const next = board.lanes[at + 1]
  if (at < 0 || !next) return { field: 'amount', min: 0, max: 0, reasons: {} }
  return budgetShiftLimits(board, next.id, ref.laneId)
}

/** Which edge of the envelope a total moves at: the last team's (end) or the first team's (start). */
export type BudgetEdge = 'start' | 'end'

/** The least and most the total may be: what the teams must keep (floors, commitments), and their caps added up (none when a team has no cap). */
export function budgetTotalBounds(board: Workshop): { min: number; max: number } {
  const min = board.lanes.reduce((sum, lane) => sum + lowest(board, lane), 0)
  const max = board.lanes.every(lane => lane.cap !== undefined) ? board.lanes.reduce((sum, lane) => sum + lane.cap!, 0) : 1e9
  return { min: Math.max(1, min), max }
}

/**
 * The budget with its total set to `amount` at `edge`: the team at that edge gains or gives the difference, then
 * the next team in, and so on, each within its cap and never below its floor or what it commits. The sentence
 * when no team can take it, with the smallest (or largest) total that fits.
 */
export function withBudgetTotal(board: Workshop, amount: number, edge: BudgetEdge = 'end'): Workshop | string {
  const currency = board.budget!.currency
  if (!Number.isInteger(amount) || amount < 1) return 'A total is a whole amount above zero.'
  const bounds = budgetTotalBounds(board)
  if (amount < bounds.min) return 'The teams keep ' + moneyExact(bounds.min, currency) + ' between them: their floors and what they commit. The smallest total that fits is ' + moneyExact(bounds.min, currency) + '.'
  if (amount > bounds.max) return 'Every team is at its cap. The largest total that fits is ' + moneyExact(bounds.max, currency) + '.'
  let left = amount - board.budget!.total
  const lanes = board.lanes.map(lane => ({ ...lane }))
  for (const lane of edge === 'end' ? [...lanes].reverse() : lanes) {
    if (!left) break
    const room = left > 0 ? (lane.cap ?? Infinity) - lane.allocation! : lowest(board, lane) - lane.allocation!
    const by = left > 0 ? Math.min(left, room) : Math.max(left, room)
    lane.allocation! += by
    left -= by
  }
  return { ...board, budget: { ...board.budget!, total: amount }, lanes }
}

/** What a whole-board save may change of a budget's total: only what set_budget_total makes, at either edge. */
export function budgetTotalFixed(before: Workshop, after: Workshop): string | null {
  if (before.budget?.total === after.budget?.total) return null
  const alloc = (board: Workshop) => JSON.stringify(board.lanes.map(lane => [lane.id, lane.allocation]))
  const made = (['end', 'start'] as const).map(edge => withBudgetTotal(before, after.budget!.total, edge)).filter((item): item is Workshop => typeof item !== 'string')
  return made.some(board => alloc(board) === alloc(after)) ? null : 'The total changes only at the envelope’s edges: drag one, or say the new total.'
}

export function budgetCaption(board: Workshop, laneId: string): string {
  const lane = board.lanes.find(item => item.id === laneId)!
  const currency = board.budget?.currency
  return `${money(lane.allocation ?? 0, currency)} · ${money(budgetCommitted(board, laneId), currency)} committed`
}


export function sampleBudget(): Workshop {
  return {
    version: 1, kind: 'budget', title: 'Next year’s budget', budget: { total: 1200000, currency: '$', step: 5000 },
    lanes: [
      { id: 'product', label: 'Product', allocation: 400000, floor: 300000 },
      { id: 'sales', label: 'Sales', allocation: 400000 },
      { id: 'design', label: 'Design', allocation: 150000 },
      { id: 'marketing', label: 'Marketing', allocation: 250000, cap: 300000 },
    ],
    cards: [
      { id: 'contractor', label: 'Contractor', laneId: 'product', amount: 45000 },
      { id: 'licences', label: 'Platform licences', laneId: 'product', amount: 200000 },
      { id: 'hires', label: 'Two account executives', laneId: 'sales', amount: 320000 },
      { id: 'panel', label: 'Research panel', laneId: 'design', amount: 120000 },
      { id: 'ads', label: 'Launch ads', laneId: 'marketing', amount: 150000 },
    ],
  }
}

/** The budget's part of the one gate (see kinds.ts). */
export const budgetRules: BusinessBoardRules = {
  ...amountRules,
  kind: 'budget',
  cards: [16, 'A budget holds up to 16 line items.'],
  readLane(raw, lane) {
    for (const key of ['allocation', 'floor', 'cap'] as const) if (raw[key] !== undefined) lane[key] = amountOf(raw[key], 0, 1e9, 'Team amounts are whole amounts.')
  },
  readBoard(raw, board) {
    const budget = ownField(raw, 'budget', 'A budget needs a total.')
    board.budget = { total: amountOf(budget.total, 1, 1e9, 'A total is a whole amount above zero.'), currency: currencyOf(budget.currency),
      step: budget.step === undefined ? 5000 : amountOf(budget.step, 1, 1e9, 'A step is a whole amount above zero.') }
  },
  validate: validateBudget,
  fixed: budgetTotalFixed,
  planMove: planBudgetMove,
  refusal: budgetRefusal,
  caption: budgetCaption,
  fromNote(board, text, unnamed) {
    const read = noteNumbers(text, unnamed)
    if (read.amount !== undefined) return { label: read.label, amount: read.amount }
    // An empty note is a line item the person names and prices next: one step of the budget to start.
    if (!text.trim()) return { label: read.label, amount: board.budget!.step }
    return 'Write the cost on the note, like \'Contractor $45k\', then drop it.'
  },
  newCard: () => 'line item',
  edit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools) {
    const currency = board.budget!.currency
    switch (edit.kind) {
      case 'add_card': {
        const target = t.lane(edit.lane)
        const label = edit.label?.trim() || 'New line item'
        if (edit.amount === undefined) t.refuse('Give the line item a cost, like \'Contractor $45k\'.', { laneId: target.id })
        const least = { ...amountLimits, min: 1 }
        if (!Number.isInteger(edit.amount) || edit.amount < 1) t.refuse('A line item costs something.', { laneId: target.id, limits: least })
        if (edit.amount > amountLimits.max) t.refuse(amountLimits.reasons.max, { laneId: target.id, limits: amountLimits })
        const left = target.allocation! - budgetCommitted(board, target.id)
        if (edit.amount > left) t.refuse(target.label + ' has ' + money(left, currency) + ' left. ' + label + ' costs ' + money(edit.amount, currency) + '.', { laneId: target.id })
        const card: WorkshopCard = { id: nextCardId(board), label, laneId: target.id, amount: edit.amount }
        return t.done(t.settle({ ...board, cards: [...board.cards, card] }, target.id), 'Added ' + said(label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: card.id })
      }
      case 'set_amount': {
        const item = t.card(edit.card)
        const lane = board.lanes.find(other => other.id === item.laneId)!
        const left = lane.allocation! - budgetCommitted(board, lane.id) + (item.amount ?? 0)
        const limits = { field: 'amount', min: 1, max: left, reasons: { min: 'A line item costs something.', max: said(lane.label) + ' has ' + money(left, currency) + ' for it.' } }
        const at = { laneId: item.laneId, cardId: item.id, limits }
        if (edit.amount > left) t.refuse(lane.label + ' has ' + money(left - (item.amount ?? 0), currency) + ' left. ' + item.label + ' costs ' + money(edit.amount, currency) + '.', { ...at, laneId: lane.id })
        if (!Number.isInteger(edit.amount) || edit.amount < limits.min) t.refuse(limits.reasons.min, at)
        item.amount = edit.amount
        return t.done(t.settle(board, item.laneId, item.id), said(item.label) + ' is now ' + money(edit.amount, currency) + '.', { laneId: item.laneId, cardId: item.id })
      }
      case 'set_budget_total': {
        const edge = edit.edge ?? 'end'
        const next = withBudgetTotal(board, edit.amount, edge)
        if (typeof next === 'string') t.refuse(next, { limits: { field: 'amount', ...budgetTotalBounds(board), reasons: {} } })
        const made = next as Workshop
        const changed = made.lanes.filter((lane, i) => lane.allocation !== board.lanes[i].allocation).map(lane => lane.label + ' ' + moneyExact(lane.allocation!, currency))
        return t.done(t.settle(made), 'The budget is now ' + moneyExact(edit.amount, currency) + (changed.length ? ': ' + changed.join(', ') + '.' : '.'))
      }
      case 'shift_budget': {
        const from = t.lane(edit.from), to = t.lane(edit.to)
        const why = budgetShiftRefusal(board, from.id, to.id, edit.amount)
        if (why) t.refuse(why, { laneId: from.id, ...(from.id !== to.id && { limits: budgetShiftLimits(board, from.id, to.id) }) })
        return t.done(t.settle(shiftBudget(board, from.id, to.id, edit.amount), to.id), 'Moved ' + money(edit.amount, currency) + ' from ' + said(from.label) + ' to ' + said(to.label) + '.', { laneId: to.id })
      }
    }
    return null
  },
}
registerWorkshopRules(budgetRules)
