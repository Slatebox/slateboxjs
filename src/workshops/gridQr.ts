// A grid sheet's QR code tile: its web address drawn as a QR code, as a picture the tile keeps (an SVG data address,
// which workshopKeepsPicture accepts). Made here from the address every time it is drawn, so the board stores only
// the address. The encoder is uqr (MIT, vendored in src/vendor/uqr with its license).
import { renderSVG } from '../vendor/uqr/index.js'

const cache = new Map<string, string>()

/** Base64 of a string of ASCII (an SVG the encoder wrote), in a browser and in node alike. */
function base64(text: string): string {
  if (typeof btoa === 'function') return btoa(text)
  return (globalThis as unknown as { Buffer: { from(text: string): { toString(encoding: string): string } } }).Buffer.from(text).toString('base64')
}

/** The QR code of a web address as an SVG data address, or null for no address or one too long to encode. */
export function gridQrPicture(link: string | undefined): string | null {
  if (!link) return null
  const hit = cache.get(link)
  if (hit) return hit
  let svg: string
  try { svg = renderSVG(link, { ecc: 'M', border: 2, pixelSize: 8 }) } catch { return null }
  const src = 'data:image/svg+xml;base64,' + base64(svg)
  if (cache.size > 200) cache.clear()
  cache.set(link, src)
  return src
}
