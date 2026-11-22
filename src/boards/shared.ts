/** Blend a #rrggbb colour toward white. */
export function tint(hex: string, amount: number) {
  const channel = (i: number) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')
  return '#' + channel(1) + channel(3) + channel(5)
}
