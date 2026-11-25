// Real dates for a plan with a clock (dragology final.md §3.2, D2): a day is a whole-day offset from
// the plan's first day (`clock.origin`, an ISO date). With the workdays rule a task's days are working
// days: the schedule runs on working-day indices and a date is found for each. No date library:
// UTC arithmetic and short English names, the same on a server and in every browser.
import type { Workshop } from './model'

const DAY = 864e5
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** A real calendar date as YYYY-MM-DD, as UTC milliseconds; NaN for anything else. */
export function isoTime(iso: unknown): number {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return NaN
  const at = Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))
  return new Date(at).toISOString().slice(0, 10) === iso ? at : NaN
}

/** The date `offset` days after `origin`. */
export const isoAt = (origin: string, offset: number) => new Date(isoTime(origin) + Math.round(offset) * DAY).toISOString().slice(0, 10)
/** Whole days from `origin` to `iso`. */
export const offsetOf = (origin: string, iso: string) => Math.round((isoTime(iso) - isoTime(origin)) / DAY)
/** 0 Sunday … 6 Saturday. */
export const weekdayAt = (origin: string, offset: number) => new Date(isoTime(origin) + Math.floor(offset) * DAY).getUTCDay()
export const weekendAt = (origin: string, offset: number) => { const day = weekdayAt(origin, offset); return day === 0 || day === 6 }

/** "Thu, Dec 17" (American order). */
export function dateName(origin: string, offset: number): string {
  const at = new Date(isoTime(origin) + Math.floor(offset) * DAY)
  return weekdays[at.getUTCDay()] + ', ' + monthNames[at.getUTCMonth()] + ' ' + at.getUTCDate()
}
/** "Dec 17" for a date given as ISO. */
export function shortDate(iso: string): string {
  const at = new Date(isoTime(iso))
  return monthNames[at.getUTCMonth()] + ' ' + at.getUTCDate()
}

/** The first Monday on or after `today` (YYYY-MM-DD; left out, today): where a new plan starts. */
export function nextMonday(today?: string): string {
  const now = isoTime(today) || Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), new Date().getUTCDate())
  const iso = new Date(now).toISOString().slice(0, 10)
  return isoAt(iso, (8 - new Date(now).getUTCDay()) % 7)
}

/**
 * The day a person names, as an offset from the plan's first day: "Dec 20", "20 Dec", "Thu 14" (the
 * next 14th on a Thursday-or-any day from the start), "Jan 3", "2027-01-04", "May" (its first day).
 * Dates before the start mean the next year. Null when the words are not a date.
 */
export function dayFromWords(origin: string, words: string, after = 0): number | null {
  const text = words.trim().replace(/[,.]/g, ' ').replace(/\s+/g, ' ').toLowerCase()
  if (isoTime(text)) return offsetOf(origin, text)
  const month = (name: string) => monthNames.findIndex(m => name.startsWith(m.toLowerCase()))
  const start = new Date(isoTime(origin) + after * DAY)
  let m: RegExpExecArray | null
  let day: number, mon: number
  if ((m = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})$/.exec(text)) && month(m[2]) >= 0) { day = +m[1]; mon = month(m[2]) }
  else if ((m = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(text)) && month(m[1]) >= 0) { day = +m[2]; mon = month(m[1]) }
  else if ((m = /^(?:early\s+)?([a-z]{3,9})$/.exec(text)) && month(m[1]) >= 0) { day = 1; mon = month(m[1]) }
  else if ((m = /^(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(text))) {
    // "Thu 14": the next 14th from the start.
    for (let k = 0; k < 13; k++) {
      const at = Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + k, +m[1])
      if (new Date(at).getUTCDate() === +m[1] && at >= start.getTime()) return Math.round((at - isoTime(origin)) / DAY)
    }
    return null
  } else return null
  for (const year of [start.getUTCFullYear(), start.getUTCFullYear() + 1]) {
    const at = Date.UTC(year, mon, day)
    if (new Date(at).getUTCDate() !== day) return null
    if (at >= start.getTime() || year > start.getUTCFullYear()) return Math.round((at - isoTime(origin)) / DAY)
  }
  return null
}

/** The plan's clock: a first day and whether days are working days. Undefined for a plan counted in day numbers. */
export interface PlanClock { origin: string; workdays: boolean }

/** Working-day index ↔ calendar offset for a plan: the identity without the workdays rule. */
export interface DayMap {
  /** Calendar offset of working-day index `i` (a fraction keeps its part of that day). */
  cal(i: number): number
  /** Working days before calendar offset `d`. */
  idx(d: number): number
}
const identity: DayMap = { cal: i => i, idx: d => d }

/** The day map of a clock (cached per origin: a plan asks it often while a bar is dragged). */
const maps = new Map<string, DayMap>()
export function dayMap(clock: PlanClock | undefined): DayMap {
  if (!clock?.workdays) return identity
  const known = maps.get(clock.origin)
  if (known) return known
  // Working days of the next three years: index → offset.
  const days: number[] = []
  for (let d = 0; days.length < 800; d++) if (!weekendAt(clock.origin, d)) days.push(d)
  const map: DayMap = {
    cal(i) {
      const whole = Math.floor(i), part = i - whole
      if (whole < 0) return whole
      return (days[Math.min(whole, days.length - 1)] ?? whole) + part
    },
    idx(d) {
      let lo = 0, hi = days.length
      while (lo < hi) { const mid = (lo + hi) >> 1; if (days[mid] < d) lo = mid + 1; else hi = mid }
      return lo
    },
  }
  maps.set(clock.origin, map)
  return map
}

/** A board's clock, with whether its workdays rule is on. */
export function clockOf(board: Pick<Workshop, 'clock' | 'behaviour'>): PlanClock | undefined {
  if (!board.clock) return undefined
  return { origin: board.clock.origin, workdays: Boolean(board.behaviour?.rules.some(rule => rule.on && rule.kind === 'workdays')) }
}
