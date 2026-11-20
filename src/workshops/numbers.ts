// The numbers a note's words carry onto a business board, and how a board writes them back.
// "Copy 3d", "Copy 3 days", "Contractor $45k", "Acme €1.2M", "Northwind 40k".

/** What a note says, split into its name and the numbers written on it. */
export interface NoteNumbers {
  /** The words without the number. */
  label: string
  /** Whole days, from "3d" or "3 days". */
  days?: number
  /** Whole currency units, from "$45k", "€1.2M", "40k" or "45000". */
  amount?: number
  /** The currency sign written with the amount, when there was one. */
  currency?: string
}

const daysPattern = /(?:^|\s)(\d{1,3})\s*(?:d|days?)\b\.?/i
const moneyPattern = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/

/** Read the days and the amount written on a note. A plain number counts as an amount only with a sign or k/M. */
export function readNoteNumbers(text: string): NoteNumbers {
  let rest = String(text ?? '').replace(/\s+/g, ' ').trim()
  const found: NoteNumbers = { label: rest }
  const days = daysPattern.exec(rest)
  if (days) {
    found.days = Number(days[1])
    rest = (rest.slice(0, days.index) + ' ' + rest.slice(days.index + days[0].length))
  }
  const money = moneyPattern.exec(rest)
  if (money && (money[1] || money[3] || Number(money[2].replace(',', '')) >= 1000)) {
    const scale = /k/i.test(money[3] ?? '') ? 1e3 : /m/i.test(money[3] ?? '') ? 1e6 : 1
    found.amount = Math.round(Number(money[2].replace(',', money[3] ? '.' : '')) * scale)
    if (money[1]) found.currency = money[1]
    rest = rest.slice(0, money.index) + ' ' + rest.slice(money.index + money[0].length)
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

/** "1 day", "3 days". */
export const days = (n: number) => n + (n === 1 ? ' day' : ' days')
