import { workshopOverrideLine, type WorkshopCard } from '../workshops/model'

/** A card's words with its move-anyway mark under them ("Moved anyway by Sam · 23 Nov"), when it was moved anyway. */
export function withMark(text: string, card: Pick<WorkshopCard, 'override'>): string {
  const line = workshopOverrideLine(card)
  return line ? text + '\n' + line : text
}

/** What a lane over its limit or its money is drawn in: a pale red, edged in the refusal colour. */
export const overInk = { fill: '#fde3d7', line: '#c2410c', ink: '#9a3412' }

/** Blend a #rrggbb colour toward white. */
export function tint(hex: string, amount: number) {
  const channel = (i: number) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')
  return '#' + channel(1) + channel(3) + channel(5)
}
