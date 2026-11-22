// A hiring plan's runway (dragology final.md §3.3, D3): cash in the bank, less the monthly burn without new
// hires and each hire's role band from the day they start (cost is per band, never per person), plus a
// funding round on the day it closes. Counted a week at a time; months are 52/12 weeks.
import type { Workshop } from './model'
import { scheduleLaunch } from './schedule'

/** The most runway a plan says: ten years. */
export const runwayCap = 120

/** Months of runway with these hires, to a tenth (runwayCap at most). */
export function runwayMonths(board: Workshop): number {
  const plan = board.hiring
  if (!plan) return runwayCap
  const times = scheduleLaunch(board)
  const starts = board.cards.map(card => ({ day: times.get(card.id)!.to, monthly: plan.bands.find(band => band.id === card.band)?.monthly ?? 0 }))
  let cash = plan.cash
  for (let week = 0; week < runwayCap * 52 / 12; week++) {
    const day = week * 7
    if (plan.funding && plan.funding.day >= day && plan.funding.day < day + 7) cash += plan.funding.amount
    const spend = (plan.burn + starts.reduce((sum, hire) => sum + (hire.day <= day ? hire.monthly : 0), 0)) * 12 / 52
    if (cash < spend) return Math.floor((week + Math.max(0, cash) / spend) * 12 / 52 * 10) / 10
    cash -= spend
  }
  return runwayCap
}

/** "14.6 months", or "10 years or more". */
export const runwayWords = (months: number) => months >= runwayCap ? '10 years or more' : months + (months === 1 ? ' month' : ' months')
