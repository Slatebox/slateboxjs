// The part of a business board that is not notes: grid lines, axis labels, arrows, the launch-day
// line, the forecast bar, budget fills and ticks, a plan bar's grips, and the reason a held handle stopped. One svg.js
// group per attached board, in world coordinates, under the board's notes and above its lane
// columns; the words a held or refused handle says go in a second group above every note. It is drawn from the board on show (committed or preview), never saved, and goes with destroy().
import type { Workshop } from './model'
import type { BoardLayer, BoardLayerState } from './native'

export type LayerShape =
  | { t: 'line'; x1: number; y1: number; x2: number; y2: number; color: string; width?: number; dash?: string }
  /** A box; `role` names it in the document (data-board-layer), and a `grip-` role is drawn above the notes, on its bar. */
  | { t: 'rect'; x: number; y: number; w: number; h: number; color: string; rx?: number; opacity?: number; role?: string }
  /**
   * A path; `arrow` puts an arrowhead at its end. `unlink` makes a 24px stroke under it, a button that removes
   * that link: a click, Enter or Space removes it; a tap first selects it, and a second tap removes it (`armed`:
   * what it says while it waits for that tap). `pick` makes the same stroke a button that selects it (a map's path).
   */
  | { t: 'path'; d: string; color: string; width?: number; hit?: number; fill?: string; dash?: string; role?: string
      /** How strong the line is (stroke-opacity; a fill keeps its own). */
      strokeOpacity?: number
      arrow?: { x: number; y: number; angle: number }; unlink?: { cardId: string; waitsOn: string; label: string; armed?: string }
      pick?: { key: string; label: string } }
  /** Words; `lines` sets `text` on several lines (each line a tspan, `lineHeight` apart), whose words together are `text`. */
  | { t: 'text'; x: number; y: number; text: string; color: string; size?: number; anchor?: 'start' | 'middle' | 'end'; bold?: boolean; role?: string; lines?: string[]; lineHeight?: number
      /** A ring of `halo` (the canvas's colour) behind the words, so a line or an arrow under them never cuts a letter. */
      halo?: string }

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
  /** Words set on the canvas itself (a plan's header and dates), not on a lane's pale fill: they follow the slate's background. */
  canvasInk: 'var(--slatebox-board-canvas-ink, #34433f)',
  /** A phone's plan rows lie on the canvas: their grid, week lines and tracks follow the slate's background too. */
  canvasFaint: 'var(--slatebox-board-canvas-grid, #d9ddd5)',
  canvasWeek: 'var(--slatebox-board-canvas-week, #b5bdb3)',
  canvasTrack: 'var(--slatebox-board-canvas-track, #e4e7df)',
  /** The canvas's own colour, for a halo behind words. */
  halo: 'var(--slatebox-board-halo, #ffffff)',
}

/** The layer's type: the host's board font when it sets one. */
const layerFont = 'var(--slatebox-board-font, system-ui, sans-serif)'

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

/** A link selected by a tap, waiting for a second tap to be removed. */
export interface LinkSelection { armed: string | null; arm(key: string | null): void }

/** Draw `shapes` into `group`, replacing what was there. */
export function renderLayerShapes(group: SVGGElement, shapes: LayerShape[], onUnlink?: (cardId: string, waitsOn: string) => void, links?: LinkSelection,
  onPick?: (key: string) => void) {
  // A link button that has the keyboard's focus keeps it across a redraw.
  const active = typeof document !== 'undefined' ? document.activeElement : null
  const focused = active && group.contains(active) ? active.getAttribute('data-board-link') : null
  while (group.firstChild) group.removeChild(group.firstChild)
  const buttons: SVGElement[] = []
  for (const shape of shapes) {
    if (shape.t === 'line') {
      group.appendChild(element('line', { x1: shape.x1, y1: shape.y1, x2: shape.x2, y2: shape.y2, 'stroke-width': shape.width ?? 1,
        ...(shape.dash ? { 'stroke-dasharray': shape.dash } : {}) }, { stroke: shape.color }))
    } else if (shape.t === 'rect') {
      group.appendChild(element('rect', { x: shape.x, y: shape.y, width: Math.max(0, shape.w), height: Math.max(0, shape.h), rx: shape.rx ?? 0,
        ...(shape.opacity !== undefined ? { opacity: shape.opacity } : {}), ...(shape.role ? { 'data-board-layer': shape.role } : {}) }, { fill: shape.color }))
    } else if (shape.t === 'text') {
      const text = element('text', { x: shape.x, y: shape.y, 'font-size': shape.size ?? 13, 'text-anchor': shape.anchor ?? 'start',
        'font-family': 'system-ui, sans-serif', ...(shape.bold ? { 'font-weight': 600 } : {}), ...(shape.role ? { 'data-board-layer': shape.role } : {}),
        ...(shape.halo ? { 'stroke-width': 4, 'stroke-linejoin': 'round', 'paint-order': 'stroke' } : {}) }, { fill: shape.color, ...(shape.halo ? { stroke: shape.halo } : {}) })
      text.style.setProperty('font-family', layerFont)
      // Words are set as text, never as markup.
      if (shape.lines && shape.lines.length > 1) {
        // One text element, one tspan a line: its words read as the one sentence (a space ends every line but the last).
        shape.lines.forEach((line, i) => {
          const span = element('tspan', { x: shape.x, dy: i ? shape.lineHeight ?? Math.round((shape.size ?? 13) * 1.25) : 0 })
          span.textContent = i < shape.lines!.length - 1 ? line + ' ' : line
          text.appendChild(span)
        })
      } else text.textContent = shape.text
      group.appendChild(text)
    } else {
      if (shape.unlink && onUnlink) {
        const { cardId, waitsOn, label } = shape.unlink
        const key = waitsOn + '>' + cardId
        const armed = links?.armed === key
        const hit = element('path', { d: shape.d, fill: 'none', 'stroke-width': shape.hit ?? 24, 'stroke-linecap': 'round', 'pointer-events': 'stroke', cursor: 'pointer',
          'data-board-link': key, 'aria-label': armed ? label + '. ' + (shape.unlink.armed ?? 'Tap again to remove it') + '.' : label, role: 'button', tabindex: 0,
          ...(armed ? { 'data-armed': '', opacity: 0.3 } : {}) }, { stroke: armed ? layerInk.refuse : 'transparent' })
        let touch = false
        hit.addEventListener('pointerdown', event => { event.stopPropagation(); touch = event.pointerType === 'touch' || event.pointerType === 'pen' })
        hit.addEventListener('click', event => {
          event.stopPropagation()
          // On a touch screen a tap near an arrow selects it; only a second tap on it removes it.
          if (touch && links && links.armed !== key) { links.arm(key); return }
          links?.arm(null)
          onUnlink(cardId, waitsOn)
        })
        hit.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          event.stopPropagation()
          onUnlink(cardId, waitsOn)
        })
        // The keyboard's focus shows on the link it is on.
        hit.addEventListener('focus', () => { hit.style.setProperty('stroke', layerInk.accept); hit.setAttribute('opacity', '0.35') })
        hit.addEventListener('blur', () => { if (!armed) { hit.style.setProperty('stroke', 'transparent'); hit.removeAttribute('opacity') } })
        group.appendChild(hit)
        buttons.push(hit)
      } else if (shape.pick && onPick) {
        const { key, label } = shape.pick
        const hit = element('path', { d: shape.d, fill: 'none', 'stroke-width': shape.hit ?? 24, 'stroke-linecap': 'round', 'pointer-events': 'stroke', cursor: 'pointer',
          'data-board-link': key, 'data-board-pick': '', 'aria-label': label, role: 'button', tabindex: 0 }, { stroke: 'transparent' })
        hit.addEventListener('pointerdown', event => event.stopPropagation())
        hit.addEventListener('click', event => { event.stopPropagation(); onPick(key) })
        hit.addEventListener('keydown', event => {
          if (event.key !== 'Enter' && event.key !== ' ') return
          event.preventDefault()
          event.stopPropagation()
          onPick(key)
        })
        hit.addEventListener('focus', () => { hit.style.setProperty('stroke', layerInk.accept); hit.setAttribute('opacity', '0.35') })
        hit.addEventListener('blur', () => { hit.style.setProperty('stroke', 'transparent'); hit.removeAttribute('opacity') })
        group.appendChild(hit)
        buttons.push(hit)
      }
      group.appendChild(element('path', { d: shape.d, fill: 'none', 'stroke-width': shape.width ?? 1.5, 'pointer-events': 'none',
        ...(shape.dash ? { 'stroke-dasharray': shape.dash } : {}), ...(shape.role ? { 'data-board-layer': shape.role } : {}),
        ...(shape.strokeOpacity !== undefined ? { 'stroke-opacity': shape.strokeOpacity } : {}),
        ...(shape.fill ? { 'stroke-linecap': 'round', 'stroke-linejoin': 'round' } : {}) },
        { stroke: shape.color === 'none' ? 'transparent' : shape.color, ...(shape.fill && shape.fill !== 'none' ? { fill: shape.fill } : {}) }))
      if (shape.arrow) {
        const { x, y, angle } = shape.arrow
        group.appendChild(element('path', { d: 'M0 0 L-8 -4.5 L-8 4.5 Z', transform: `translate(${x} ${y}) rotate(${angle})`, 'pointer-events': 'none' }, { fill: shape.color }))
      }
      if (shape.unlink && links?.armed === shape.unlink.waitsOn + '>' + shape.unlink.cardId && shape.arrow) {
        const note = element('text', { x: shape.arrow.x - 6, y: shape.arrow.y - 14, 'font-size': 13, 'font-weight': 600, 'text-anchor': 'end',
          'font-family': 'system-ui, sans-serif', 'pointer-events': 'none', 'data-board-layer': 'unlink-armed' }, { fill: layerInk.refuse })
        note.textContent = shape.unlink.armed ?? 'Tap again to remove this link'
        group.appendChild(note)
      }
    }
  }
  if (focused) buttons.find(button => button.getAttribute('data-board-link') === focused)?.focus({ preventScroll: true })
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
  // A tapped link waits a few seconds for the second tap that removes it.
  let last: [Workshop, Workshop | null, BoardLayerState] | null = null
  let disarm: ReturnType<typeof setTimeout> | undefined
  const links: LinkSelection = {
    armed: null,
    arm(key) {
      clearTimeout(disarm)
      links.armed = key
      if (key) {
        disarm = setTimeout(() => links.arm(null), 5000)
        last?.[2].announce?.(last[2].boardFocused && last[0].lanes[0]?.station ? 'Path selected. Tap it again to remove it.' : 'Link selected. Tap it again to remove it.')
      }
      if (last) layer.draw(...last)
    },
  }
  const layer: BoardLayer = {
    draw(board, preview, state) {
      if (gone || !root) return
      last = [board, preview, state]
      const { origin } = state
      const shapes = paint(preview ?? board, state, board)
      // The words a held or refused handle says, and a bar's grips, go above every note.
      const said = (shape: LayerShape) => shape.t === 'text' && (shape.role === 'clamp' || shape.role === 'refusal') || shape.t === 'rect' && Boolean(shape.role?.startsWith('grip-'))
      // A board in focus says so on its layer too, so a host can bring the rest of the canvas down (boardChromeStyles).
      for (const layer of [group, top]) { layer.setAttribute('transform', `translate(${origin.x} ${origin.y})`); layer.toggleAttribute('data-workshop-focused', Boolean(state.boardFocused)) }
      renderLayerShapes(group, shapes.filter(shape => !said(shape)), state.onUnlink, links, state.onPick)
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
      clearTimeout(disarm)
      group.remove()
      top.remove()
    },
  }
  return layer
}
