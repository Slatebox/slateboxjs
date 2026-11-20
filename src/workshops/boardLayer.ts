// The part of a business board that is not notes: grid lines, axis labels, arrows, the launch-day
// line, the forecast bar, budget fills and ticks, and the reason a held handle stopped. One svg.js
// group per attached board, in world coordinates, under the board's notes and above its lane
// columns; the words a held or refused handle says go in a second group above every note. It is drawn from the board on show (committed or preview), never saved, and goes with destroy().
import type { Workshop } from './model'
import type { BoardLayer, BoardLayerState } from './native'

export type LayerShape =
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: string }
  | { t: 'rect'; x: number; y: number; w: number; h: number; color: string; rx?: number; opacity?: number }
  /** A path; `arrow` puts an arrowhead at its end, `unlink` makes a 12px stroke under it that removes that link when clicked. */
  | { t: 'path'; d: string; color: string; width?: number; arrow?: { x: number; y: number; angle: number }; unlink?: { cardId: string; waitsOn: string; label: string } }
  | { t: 'text'; x: number; y: number; text: string; color: string; size?: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; role?: string }

/** Colours of the layer, as CSS custom properties with the board's own colours behind them. */
export const layerInk = {
  ink: 'var(--slatebox-board-ink, #34433f)',
  faint: 'var(--slatebox-board-grid, #d9ddd5)',
  week: 'var(--slatebox-board-week, #b5bdb3)',
  accept: 'var(--slatebox-board-accept, #1f7a5c)',
  refuse: 'var(--slatebox-board-refuse, #c2410c)',
  bar: 'var(--slatebox-board-bar, #3f6f8e)',
  track: 'var(--slatebox-board-track, #e4e7df)',
  launch: 'var(--slatebox-board-launch, #7b3fa0)',
}

const svgNS = 'http://www.w3.org/2000/svg'

/** The fallback hex inside a var(--name, #hex) colour, for attributes that cannot read custom properties. */
const fallback = (color: string) => /var\([^,]+,\s*([^)]+)\)/.exec(color)?.[1].trim() ?? color

function element(name: string, attributes: Record<string, string | number>, paint?: { fill?: string; stroke?: string }) {
  const node = document.createElementNS(svgNS, name)
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value))
  if (paint?.fill) { node.setAttribute('fill', fallback(paint.fill)); node.style.setProperty('fill', paint.fill) }
  if (paint?.stroke) { node.setAttribute('stroke', fallback(paint.stroke)); node.style.setProperty('stroke', paint.stroke) }
  return node
}

/** Draw `shapes` into `group`, replacing what was there. */
export function renderLayerShapes(group: SVGGElement, shapes: LayerShape[], onUnlink?: (cardId: string, waitsOn: string) => void) {
  while (group.firstChild) group.removeChild(group.firstChild)
  for (const shape of shapes) {
    if (shape.t === 'line') {
      group.appendChild(element('line', { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2, 'stroke-width': shape.width ?? 1,
        ...(shape.dash ? { 'stroke-dasharray': shape.dash } : {}) }, { stroke: shape.color }))
    } else if (shape.t === 'rect') {
      group.appendChild(element('rect', { x: shape.x, y: shape.y, width: Math.max(0, shape.w), height: Math.max(0, shape.h), rx: shape.rx ?? 0,
        ...(shape.opacity !== undefined ? { opacity: shape.opacity } : {}) }, { fill: shape.color }))
    } else if (shape.t === 'text') {
      const text = element('text', { x: shape.x, y: shape.y, 'font-size': shape.size ?? 13, 'text-anchor': shape.anchor ?? 'start',
        'font-family': 'system-ui, sans-serif', ...(shape.bold ? { 'font-weight': 600 } : {}), ...(shape.role ? { 'data-board-layer': shape.role } : {}) }, { fill: shape.color })
      // Words are set as text, never as markup.
      text.textContent = shape.text
      group.appendChild(text)
    } else {
      if (shape.unlink && onUnlink) {
        const { cardId, waitsOn, label } = shape.unlink
        const hit = element('path', { d: shape.d, fill: 'none', 'stroke-width': 12, 'pointer-events': 'stroke', cursor: 'pointer',
          'data-board-link': waitsOn + '>' + cardId, 'aria-label': label, role: 'button' }, { stroke: 'transparent' })
        hit.addEventListener('pointerdown', event => event.stopPropagation())
        hit.addEventListener('click', event => { event.stopPropagation(); onUnlink(cardId, waitsOn) })
        group.appendChild(hit)
      }
      group.appendChild(element('path', { d: shape.d, fill: 'none', 'stroke-width': shape.width ?? 1.5, 'pointer-events': 'none' }, { stroke: shape.color }))
      if (shape.arrow) {
        const { x, y, angle } = shape.arrow
        group.appendChild(element('path', { d: 'M0 0 L-8 -4.5 L-8 4.5 Z', transform: `translate(${x} ${y}) rotate(${angle})`, 'pointer-events': 'none' }, { fill: shape.color }))
      }
    }
  }
}

/**
 * The layer for one attached board. `paint` says what to draw for the board on show; the
 * committed board is passed too, for what a preview is compared against.
 */
export function createBoardLayer(slate: any, paint: (shown: Workshop, state: BoardLayerState, committed: Workshop) => LayerShape[]): BoardLayer {
  const root: SVGSVGElement | undefined = slate?.canvas?.node
  const group = document.createElementNS(svgNS, 'g') as SVGGElement
  group.setAttribute('data-board-layer', '')
  group.setAttribute('pointer-events', 'none')
  // The words a held or refused handle says (why it stops, why it was refused) go above every
  // note, so a bar or a card never covers them.
  const top = document.createElementNS(svgNS, 'g') as SVGGElement
  top.setAttribute('data-board-layer-top', '')
  top.setAttribute('pointer-events', 'none')
  let gone = false
  return {
    draw(board, preview, state) {
      if (gone || !root) return
      const { origin } = state
      const shapes = paint(preview ?? board, state, board)
      const said = (shape: LayerShape) => shape.t === 'text' && (shape.role === 'clamp' || shape.role === 'refusal')
      for (const layer of [group, top]) layer.setAttribute('transform', `translate(${origin.x} ${origin.y})`)
      renderLayerShapes(group, shapes.filter(shape => !said(shape)), state.onUnlink)
      renderLayerShapes(top, shapes.filter(said))
      // Above the lane columns, under every other note.
      const above = state.above && state.above.parentNode === root ? state.above : null
      const before = above ? above.nextSibling : root.firstChild
      if (group.parentNode !== root || group.previousSibling !== above) root.insertBefore(group, before === group ? group.nextSibling : before)
      // Last in the canvas: above every note, the board's own and the slate's.
      if (top.firstChild && root.lastChild !== top) root.appendChild(top)
      else if (!top.firstChild && top.parentNode) top.remove()
    },
    destroy() {
      gone = true
      group.remove()
      top.remove()
    },
  }
}
