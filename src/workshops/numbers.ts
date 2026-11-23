// The numbers a note's words carry onto a business board, and how a board writes them back.
// "Copy 3d", "Copy 3 days", "Contractor $45k", "Acme €1.2M", "Northwind 40k".

/** What a note says, split into its name and the numbers written on it. */
export interface NoteNumbers {
  /** The words without the number. */
  label: string
  /** Whole days, from "3d" or "3 days" (part of a day is a whole one), or weeks of five days ("2w", "6 weeks"). */
  days?: number
  /** Whole currency units, from "$45k", "€1.2M", "40k" or "45000". */
  amount?: number
  /** The currency sign written with the amount, when there was one. */
  currency?: string
}

// Days ("3d", "3 days", "0.5d": part of a day takes a whole one) or weeks ("2w", "6 weeks": five working days each).
const daysPattern = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i
const moneyPattern = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g

/**
 * Read the days and the amount written on a note. A plain number counts as an amount only with
 * a sign or k/M, or from 1000 up; a number with a sign or k/M wins over a bare one, so
 * "2026 offsite $12k" is $12k for "2026 offsite".
 */
export function readNoteNumbers(text: string): NoteNumbers {
  let rest = String(text ?? '').replace(/\s+/g, ' ').trim()
  const found: NoteNumbers = { label: rest }
  const days = daysPattern.exec(rest)
  if (days) {
    const count = Number(days[1].replace(',', '.'))
    const weeks = /^w/i.test(days[2])
    found.days = Math.max(1, Math.ceil(weeks ? count * 5 : count))
    rest = (rest.slice(0, days.index) + ' ' + rest.slice(days.index + days[0].length))
  }
  const candidates = [...rest.matchAll(moneyPattern)].filter(match => match[1] || match[3] || Number(match[2].replace(',', '')) >= 1000)
  const money = candidates.find(match => match[1] || match[3]) ?? candidates[0]
  if (money) {
    const scale = /k/i.test(money[3] ?? '') ? 1e3 : /m/i.test(money[3] ?? '') ? 1e6 : 1
    found.amount = Math.round(Number(money[2].replace(',', money[3] ? '.' : '')) * scale)
    if (money[1]) found.currency = money[1]
    rest = rest.slice(0, money.index) + ' ' + rest.slice(money.index! + money[0].length)
  }
  found.label = rest.replace(/\s+/g, ' ').replace(/\s*[·,;:-]\s*$/, '').trim()
  return found
}

/** "$45k", "$1.2M", "$320k", "$900": short money for captions and sentences. */
export function money(amount: number, currency = '$'): string {
  const sign = amount < 0 ? '-' : ''
  const n = Math.abs(amount)
  const short = (value: number, unit: string) => (Math.round(value * 10) / 10).toString() + unit
  const body = n >= 1e6 ? short(n / 1e6, 'M') : n >= 1e3 ? short(n / 1e3, 'k') : String(Math.round(n))
  return sign + currency + body
}

/** Money without rounding away a step: "$1.25M", "$1.205M", "$890k", "$12.5k". */
export function moneyExact(amount: number, currency = '$'): string {
  const sign = amount < 0 ? '-' : ''
  const n = Math.abs(amount)
  const body = n >= 1e6 ? +(n / 1e6).toFixed(6) + 'M' : n >= 1e3 ? +(n / 1e3).toFixed(3) + 'k' : String(Math.round(n))
  return sign + currency + body
}

/** "1 day", "3 days". */
export const days = (n: number) => n + (n === 1 ? ' day' : ' days')

// ---------------------------------------------------------------------------------------------
// What the three business boards' rules share: a card made from a note or an add_card edit.

/** The bounds every amount keeps, and their sentences. */
export const amountLimits = { field: 'amount', min: 0, max: 1e9, reasons: { min: 'An amount is not below zero.', max: 'An amount is at most 1,000,000,000.' } }

/** A note's words as a card's name and number. A note with no words of its own (empty, or only a number) is named `unnamed`. */
export function noteNumbers(text: string, unnamed: string): NoteNumbers {
  const read = readNoteNumbers(text)
  return read.label ? read : { ...read, label: unnamed }
}

/** A card's new words: its name without the number typed on it, and that number. */
export function renamedNumbers(text: string): NoteNumbers {
  const read = readNoteNumbers(text)
  return read.label ? read : { label: text }
}

/** The next free card id on a board: card-1, card-2… */
export function nextCardId(board: { lanes: { id: string }[]; cards: { id: string }[] }): string {
  const ids = new Set([...board.lanes, ...board.cards].map(item => item.id))
  let n = 1
  while (ids.has('card-' + n)) n++
  return 'card-' + n
}

/** A whole (or, with `fraction`, any) number from `low` to `high`, or the sentence `why`. */
export function amountOf(value: unknown, low: number, high: number, why: string, fraction = false): number {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high || (!fraction && !Number.isInteger(value))) throw new Error(why)
  return value
}

/** A currency sign ($ € £ ¥ ₹) or a three-letter code and a space. */
export function currencyOf(value: unknown): string {
  if (typeof value !== 'string' || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(value)) throw new Error('Use a currency sign such as $ or €.')
  return value
}

/** A board's own object field (its launch, forecast or budget), or the sentence when it is missing. */
export function ownField(raw: Record<string, unknown>, key: string, missing: string): Record<string, unknown> {
  const value = raw[key]
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(missing)
  return value as Record<string, unknown>
}
