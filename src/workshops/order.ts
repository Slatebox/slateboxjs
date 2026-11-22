// Fractional order keys (dragology final.md §2.2, §5 gap 4): a card's place among its siblings is a short
// string ('a', 'aV', 'b'), so a card put between two others takes a key between theirs and nothing else
// is renumbered. Two people inserting at the same place at the same moment each get a key between the
// same neighbours; siblings sort by key and then by id, so every copy of the board puts them in the same
// order, and the server, which makes each insert on the board as it stands, gives the later one a key of
// its own. Base 62, compared as plain strings; a key never ends in '0', so there is always room below it.

const digits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'

/** Whether a stored order key is one this module could have made. */
export const isOrderKey = (key: unknown): key is string => typeof key === 'string' && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(key)

function midpoint(a: string, b: string | null): string {
  if (b !== null) {
    // The common prefix stays; the key is made between what follows it.
    let n = 0
    while ((a[n] ?? '0') === b[n]) n++
    if (n > 0) return b.slice(0, n) + midpoint(a.slice(n), b.slice(n))
  }
  const low = a ? digits.indexOf(a[0]) : 0
  const high = b !== null ? digits.indexOf(b[0]) : digits.length
  if (high - low > 1) return digits[Math.round((low + high) / 2)]
  if (b && b.length > 1) return b.slice(0, 1)
  return digits[low] + midpoint(a.slice(1), null)
}

/** A key after `a` and before `b` (either may be missing: the first or the last place). */
export function orderBetween(a?: string | null, b?: string | null): string {
  if (a && b && a >= b) throw new Error('Order keys out of order.')
  return midpoint(a ?? '', b ?? null)
}

/** Sort siblings by their key, then by id (two keys made at once are equal; the id settles it). A card without a key comes first. */
export const byOrder = <T extends { id: string; order?: string }>(a: T, b: T) =>
  (a.order ?? '') < (b.order ?? '') ? -1 : (a.order ?? '') > (b.order ?? '') ? 1 : a.id < b.id ? -1 : a.id > b.id ? 1 : 0

/** `count` keys in order, for cards laid down together (a sample, a paste). */
export function orderKeys(count: number): string[] {
  const keys: string[] = []
  for (let i = 0; i < count; i++) keys.push(orderBetween(keys[i - 1] ?? null, null))
  return keys
}
