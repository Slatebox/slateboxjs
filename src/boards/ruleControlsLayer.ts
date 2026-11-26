// The rule controls' drawing (library spec §4.3): native shapes in the board's own layer (a group of
// the slate's canvas, in board coordinates, beside the chrome's), never an HTML overlay. Drawn with
// the canvas's own SVG document, as the chrome and the board layer are, so it is the same on both
// engine shapes (SVG.js and the legacy one): it only needs the slate's canvas node.
//
// Every control is a real button: a pointer taps or drags it, a finger the same (44 by 44 at the
// chrome's scale), a long press or a right-click holds it, and the keyboard reaches it with Tab
// (Enter or Space taps, the arrows drag a step, Shift+Enter holds, Delete removes). A gesture becomes
// the control's edits, handed to the host (onRuleEdit), which saves them through the same door a drag
// takes. While the host saves, the control says so; then it flashes its new sentence beside itself.
import type { RuleControl, RuleControlLook } from '../workshops/ruleControls'
import type { WorkshopEdit } from '../workshops/edits'

export interface RuleControlsLayerOptions {
  /** The edits a gesture made, and what the control says it does; true once they are saved. */
  onRuleEdit?: (edits: WorkshopEdit[], sentence: string) => Promise<boolean> | boolean
  /** Where the board's origin is (world units): the layer is drawn in board coordinates. */
  origin?: { x: number; y: number }
  /** Tell a screen reader something (the host's live region). */
  announce?: (text: string) => void
}

export interface RuleControlsLayer {
  update(controls: RuleControl[], origin?: { x: number; y: number }): void
  remove(): void
}

const svgNS = 'http://www.w3.org/2000/svg'
/** How long a pointer rests on a control before its hint shows (ms). */
export const HINT_DELAY = 400
/** The controls' colours: the chrome's tokens (light and dark), with these defaults behind them. */
export const controlInk = {
  on: 'var(--slatebox-board-focus, #1f4a3a)',
  onInk: 'var(--slatebox-board-focus-ink, #ffffff)',
  off: 'var(--slatebox-board-badge, #ffffff)',
  offLine: 'var(--slatebox-board-control-line, #9aa69f)',
  ink: 'var(--slatebox-board-ink, #34433f)',
  line: 'var(--slatebox-board-accept, #1f7a5c)',
  warn: 'var(--slatebox-board-preview, #a8761b)',
  refuse: 'var(--slatebox-board-refuse, #c2410c)',
  halo: 'var(--slatebox-board-halo, #ffffff)',
  ghost: 'var(--slatebox-board-grid, #b9c2bb)',
  chip: 'var(--slatebox-board-chip, #f2efe4)',
}
const font = 'var(--slatebox-board-font, system-ui, sans-serif)'
const fallback = (color: string) => /var\([^,]+,\s*([^)]+)\)/.exec(color)?.[1].trim() ?? color

function el(name: string, attributes: Record<string, string | number>, paint?: { fill?: string; stroke?: string }) {
  const node = document.createElementNS(svgNS, name) as SVGElement
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, String(value))
  if (paint?.fill) { node.setAttribute('fill', fallback(paint.fill)); node.style.setProperty('fill', paint.fill) }
  if (paint?.stroke) { node.setAttribute('stroke', fallback(paint.stroke)); node.style.setProperty('stroke', paint.stroke) }
  return node
}

/** A control's glyph, in a 12 by 12 box at (x, y), `size` wide. */
function glyph(icon: RuleControlLook['icon'], x: number, y: number, size: number, color: string): SVGElement | null {
  const d: Record<string, string> = {
    // An archive box (a bin keeps what is dropped in it; it never deletes): a lid, a box, a handle.
    bin: 'M1.5 2 L10.5 2 L10.5 4.5 L1.5 4.5 Z M2.5 4.5 L2.5 10.5 L9.5 10.5 L9.5 4.5 M4.5 6.8 L7.5 6.8',
    gate: 'M3 6 L9 6 L9 11 L3 11 Z M4.5 6 L4.5 4 Q6 1.5 7.5 4 L7.5 6',
    oneway: 'M1 6 L10 6 M7 3 L10 6 L7 9',
    twoway: 'M1 6 L11 6 M4 3 L1 6 L4 9 M8 3 L11 6 L8 9',
    step: 'M4 2 L8 6 L4 10',
    minus: 'M2.5 6 L9.5 6',
    plus: 'M2.5 6 L9.5 6 M6 2.5 L6 9.5',
    flag: 'M3 11 L3 1.5 L10 3.5 L3 6',
    push: 'M1 6 L7 6 M4.5 3.5 L7 6 L4.5 8.5 M9.5 2 L9.5 10',
    snap: 'M1 2 L1 10 M4 2 L4 10 M7 2 L7 10 M10 2 L10 10 M1 6 L10 6',
    drop: 'M6 1 L6 8 M3 5 L6 8 L9 5 M2 11 L10 11',
    rank: 'M2 10 L2 6 M6 10 L6 3 M10 10 L10 1',
    depth: 'M3 1 L3 11 M9 1 L9 11 M3 3 L9 3 M3 6 L9 6 M3 9 L9 9',
    holds: 'M6 1 L6 4 M2 7 L2 11 M6 7 L6 11 M10 7 L10 11 M2 7 L10 7 M6 4 L6 7',
    // A drop of paint: the lane's color.
    color: 'M6 1.5 C6 1.5 2.5 5.6 2.5 7.8 A3.5 3.5 0 0 0 9.5 7.8 C9.5 5.6 6 1.5 6 1.5 Z',
  }
  if (!icon || !d[icon]) return null
  const s = size / 12
  return el('path', { d: d[icon], transform: `translate(${x} ${y}) scale(${s})`, fill: 'none', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    'vector-effect': 'non-scaling-stroke', 'pointer-events': 'none' }, { stroke: color })
}

function text(x: number, y: number, words: string, size: number, color: string, anchor: 'start' | 'middle' = 'start', bold = false, halo = false) {
  const node = el('text', { x, y, 'font-size': size, 'text-anchor': anchor, 'font-family': 'system-ui, sans-serif', 'pointer-events': 'none', ...(bold ? { 'font-weight': 600 } : {}),
    ...(halo ? { 'stroke-width': 4, 'stroke-linejoin': 'round', 'paint-order': 'stroke' } : {}) }, { fill: color, ...(halo ? { stroke: controlInk.halo } : {}) })
  node.style.setProperty('font-family', font)
  node.textContent = words
  return node
}

const round = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`

/** A control's hint: its own (an action: "Change color (now: own)"), or the first sentence of its label ("Make To do a bin that archives cards"), short enough to sit by it. */
export function hintOf(control: RuleControl): string {
  if (control.hint) return control.hint.length > 42 ? control.hint.slice(0, 41).replace(/\s+\S*$/, '') + '…' : control.hint
  const first = control.label.split(/\.\s/)[0].replace(/\.$/, '').replace(/\s*\([^)]*\)/g, '')
  return first.length > 42 ? first.slice(0, 41).replace(/\s+\S*$/, '') + '…' : first
}

/** A hint's words in lines of at most `most` glyphs, two at most (the second cut with an ellipsis); a line keeps its trailing space. */
export function hintLines(words: string, most: number): string[] {
  if (words.length <= most) return [words]
  const cut = words.lastIndexOf(' ', most)
  const first = cut > 0 ? words.slice(0, cut + 1) : words.slice(0, most)
  let rest = words.slice(first.length)
  if (rest.length > most) rest = rest.slice(0, most - 1).replace(/\s+\S*$/, '') + '…'
  return [first, rest]
}

/** The visible part of one control (the hit area is drawn separately), at a drag offset. */
function drawLook(control: RuleControl, offset: { dx: number; dy: number }, said: string | null, busy: boolean): SVGGElement {
  const g = el('g', { 'pointer-events': 'none' }) as SVGGElement
  const { hit, look } = control
  const k = hit.height / 44
  const cx = hit.x + hit.width / 2, cy = hit.y + hit.height / 2
  const color = look.warn ? controlInk.warn : controlInk.line
  if (look.shape === 'line') {
    const y = (look.y ?? cy) + offset.dy
    g.appendChild(el('line', { x1: look.x1 ?? hit.x, x2: look.x2 ?? hit.x + hit.width, y1: y, y2: y, 'stroke-width': look.on ? 2.5 : 1.5, 'stroke-dasharray': look.on ? '8 5' : '3 5',
      'stroke-linecap': 'round', ...(look.on ? {} : { opacity: 0.7 }) }, { stroke: look.on ? color : controlInk.offLine }))
    // A pointer-only line (its lane's header says the value) shows its grip alone at rest, and its words while dragged.
    const words = said ?? (control.pointerOnly ? '' : look.label ?? '')
    const w = words || busy ? Math.max(84 * k, (Math.max(words.length, busy ? 7 : 0) * 13 * 0.56 + 40) * k) : 40 * k, h = 26 * k
    g.appendChild(el('path', { d: round(cx - w / 2, y - h / 2, w, h, h / 2), 'stroke-width': 1.5 }, { fill: look.on ? controlInk.off : controlInk.chip, stroke: look.on ? color : controlInk.offLine }))
    // The grip: up and down chevrons, a line to drag.
    g.appendChild(el('path', { d: `M${cx - w / 2 + 10 * k} ${y - 2 * k} l${4 * k} ${-4 * k} l${4 * k} ${4 * k} M${cx - w / 2 + 10 * k} ${y + 2 * k} l${4 * k} ${4 * k} l${4 * k} ${-4 * k}`,
      fill: 'none', 'stroke-width': 1.6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, { stroke: look.on ? color : controlInk.ink }))
    if (words || busy) g.appendChild(text(cx + 8 * k, y + 4.5 * k, busy ? 'Saving…' : words, 13 * k, look.on ? controlInk.ink : controlInk.ink, 'middle', Boolean(look.on)))
  } else if (look.shape === 'value') {
    // The limit's value between − and +: a pill of words, no button (the steps either side say it to a screen reader).
    const h = Math.min(30, hit.height - 8), y = cy - h / 2
    g.appendChild(el('path', { d: round(hit.x, y, hit.width, h, h / 2), 'stroke-width': 1 }, { fill: look.on ? controlInk.off : controlInk.chip, stroke: controlInk.offLine }))
    g.appendChild(text(cx, cy + 4.5, look.label ?? '', 13, controlInk.ink, 'middle', Boolean(look.on)))
  } else if (look.shape === 'chip') {
    const h = 30 * k, y = cy - h / 2
    g.appendChild(el('path', { d: round(hit.x, y, hit.width, h, h / 2), 'stroke-width': 1.2, ...(look.warn ? { 'stroke-dasharray': '3 3' } : {}) },
      { fill: look.on ? controlInk.on : controlInk.chip, stroke: look.on ? controlInk.on : controlInk.offLine }))
    const ink = look.on ? controlInk.onInk : controlInk.ink
    const icon = glyph(look.icon, hit.x + 12 * k, cy - 6.5 * k, 13 * k, ink)
    if (icon) g.appendChild(icon)
    g.appendChild(text(hit.x + (icon ? 32 : 14) * k, cy + 4.5 * k, busy ? 'Saving…' : look.label ?? '', 13 * k, ink, 'start', Boolean(look.on)))
  } else if (look.shape === 'badge' || look.shape === 'step') {
    const r = (look.shape === 'step' ? 13 : 15) * k
    const filled = look.shape === 'badge' ? Boolean(look.on) : false
    // Every round button reads as one: a solid ring (an off toggle is an outlined button, never a dashed placeholder), its glyph in ink.
    g.appendChild(el('circle', { cx, cy, r, 'stroke-width': 1.4 },
      { fill: look.swatch ?? (filled ? controlInk.on : controlInk.off), stroke: look.swatch ? controlInk.ink : filled ? controlInk.on : look.shape === 'step' && look.on ? color : controlInk.offLine }))
    const icon = glyph(look.icon, cx - 7 * k, cy - 7 * k, 14 * k, filled ? controlInk.onInk : controlInk.ink)
    if (icon) g.appendChild(icon)
    if (busy) g.appendChild(el('circle', { cx, cy, r: r + 3 * k, fill: 'none', 'stroke-width': 2, 'stroke-dasharray': '4 4' }, { stroke: controlInk.line }))
  } else if (look.shape === 'ghost') {
    // A ghost column is as tall as the columns beside it: its words and + take the chrome's scale from its width (64 a finger's scale).
    const gk = Math.min(k, hit.width / 64)
    g.appendChild(el('path', { d: round(hit.x, hit.y, hit.width, hit.height, 10 * gk), 'stroke-width': 1.6, 'stroke-dasharray': '6 5' }, { fill: 'none', stroke: controlInk.ghost }))
    const icon = glyph('plus', cx - 9 * gk, cy - 16 * gk, 18 * gk, controlInk.ink)
    if (icon) g.appendChild(icon)
    g.appendChild(text(cx, cy + 18 * gk, busy ? 'Adding…' : 'Column', 12 * gk, controlInk.ink, 'middle'))
  } else if (look.shape === 'ladder') {
    const x = look.x1 ?? cx, top = look.y ?? hit.y, gap = look.rungGap ?? 30 * k, rungs = look.rungs ?? 6
    const lit = Math.max(1, Math.min(rungs, Math.round((look.lit ?? rungs) + offset.dy / gap)))
    const bottom = top + (rungs - 1) * gap
    for (const side of [-10 * k, 10 * k]) g.appendChild(el('line', { x1: x + side, x2: x + side, y1: top - 6 * k, y2: bottom + 6 * k, 'stroke-width': 1.5 }, { stroke: controlInk.offLine }))
    for (let i = 0; i < rungs; i++) {
      const on = i < lit && (look.on || offset.dy !== 0)
      g.appendChild(el('line', { x1: x - 10 * k, x2: x + 10 * k, y1: top + i * gap, y2: top + i * gap, 'stroke-width': on ? 3 : 1.5, 'stroke-linecap': 'round' }, { stroke: on ? color : controlInk.offLine }))
    }
    const y = top + (lit - 1) * gap
    const words = said ?? look.label ?? ''
    g.appendChild(el('circle', { cx: x, cy: y, r: 12 * k, 'stroke-width': 1.6 }, { fill: controlInk.off, stroke: look.on ? color : controlInk.ink }))
    g.appendChild(el('path', { d: `M${x - 4 * k} ${y - 1 * k} l${4 * k} ${-4 * k} l${4 * k} ${4 * k} M${x - 4 * k} ${y + 1 * k} l${4 * k} ${4 * k} l${4 * k} ${-4 * k}`, fill: 'none', 'stroke-width': 1.5 }, { stroke: controlInk.ink }))
    g.appendChild(text(x, top - 16 * k, busy ? 'Saving…' : 'Depth', 12 * k, controlInk.ink, 'middle', true, true))
    if (said || offset.dy) g.appendChild(text(x + 18 * k, y + 4 * k, words, 12 * k, controlInk.ink, 'start', true, true))
  }
  return g
}

/** Draw a board's rule controls on `slate`, in board coordinates at `options.origin`. */
export function drawRuleControls(slate: unknown, boardId: string, controls: RuleControl[], options: RuleControlsLayerOptions = {}): RuleControlsLayer {
  const root: SVGSVGElement | undefined = (slate as { canvas?: { node?: SVGSVGElement } } | null)?.canvas?.node
  if (!root || typeof document === 'undefined') return { update() {}, remove() {} }
  const group = document.createElementNS(svgNS, 'g') as SVGGElement
  group.setAttribute('data-rule-controls', '')
  group.setAttribute('data-board-scope', boardId)
  group.setAttribute('role', 'group')
  group.setAttribute('aria-label', 'How this board behaves: controls')
  // Drawn for editing only: no picture of the slate (an export, a presentation's snapshot) carries a control or its hint.
  group.setAttribute('data-export-never', '')
  let current = controls
  let origin = options.origin ?? { x: 0, y: 0 }
  let gone = false
  /** A control waiting for its save, and the one that flashes its sentence. */
  let busy: string | null = null
  let flash: { id: string; ok: boolean; until: number } | null = null
  let flashTimer: ReturnType<typeof setTimeout> | undefined
  /** A drag in progress: the control, where it began, and how far it has gone. */
  type Held = { control: RuleControl; start: { x: number; y: number }; delta: { dx: number; dy: number }; moved: boolean; holdTimer?: ReturnType<typeof setTimeout>; holdDone: boolean; pointerId: number }
  let held = null as Held | null

  const toBoard = (event: PointerEvent) => {
    const matrix = group.getScreenCTM?.()
    if (!matrix || typeof root.createSVGPoint !== 'function') return { x: event.clientX, y: event.clientY }
    const point = root.createSVGPoint()
    point.x = event.clientX
    point.y = event.clientY
    const at = point.matrixTransform(matrix.inverse())
    return { x: at.x, y: at.y }
  }

  async function commit(control: RuleControl, edits: WorkshopEdit[] | undefined, said: string) {
    if (!edits?.length || busy || gone) return
    busy = control.id
    render()
    let ok = false
    try { ok = Boolean(await options.onRuleEdit?.(edits, said)) } catch { ok = false }
    busy = null
    if (gone) return
    flash = { id: control.id, ok, until: Date.now() + 2000 }
    clearTimeout(flashTimer)
    flashTimer = setTimeout(() => { flash = null; render() }, 2000)
    render()
    const now = current.find(item => item.id === control.id)
    options.announce?.(ok ? (now?.state.sentence ?? said) + '.' : 'Not changed.')
  }

  function render() {
    if (gone) return
    const active = document.activeElement
    const focused = active && group.contains(active) ? active.getAttribute('data-rule-control') : null
    while (group.firstChild) group.removeChild(group.firstChild)
    group.setAttribute('transform', `translate(${origin.x} ${origin.y})`)
    // A lane's controls are one group to a screen reader ("Lead controls"), in the order they are drawn: the DOM's order is
    // the visual order, so Tab goes name row, then strip, left to right, a lane at a time.
    const groups = new Map<string, SVGGElement>()
    const into = (control: RuleControl, item: SVGGElement) => {
      if (!control.group) { group.appendChild(item); return }
      let lane = groups.get(control.group)
      if (!lane) {
        lane = el('g', { role: 'group', 'aria-label': control.group + ' controls', 'data-rule-group': control.group }) as SVGGElement
        groups.set(control.group, lane)
        group.appendChild(lane)
      }
      lane.appendChild(item)
    }
    for (const control of current) {
      if (control.look.shape === 'value') {
        // Words, not a button: no Tab stop, and hidden from a screen reader (the − and + beside it name the value).
        const words = el('g', { 'data-rule-readout': control.id, 'aria-hidden': 'true', 'pointer-events': 'none' }) as SVGGElement
        words.appendChild(drawLook(control, { dx: 0, dy: 0 }, null, false))
        into(control, words)
        continue
      }
      const dragging = held?.control.id === control.id && held.moved
      const offset = dragging ? held!.delta : { dx: 0, dy: 0 }
      const said = dragging ? control.gestures.preview?.(offset) ?? null : null
      const item = el('g', { 'data-rule-control': control.id, 'data-primitive': control.primitive, role: control.gestures.drag ? 'slider' : 'button', tabindex: control.pointerOnly ? -1 : 0,
        ...(control.pointerOnly ? { 'aria-hidden': 'true' } : {}), ...(control.disabled ? { 'aria-disabled': 'true' } : {}),
        'aria-label': control.label, ...(control.pressed !== undefined && !control.gestures.drag ? { 'aria-pressed': String(control.pressed) } : {}),
        ...(control.gestures.drag ? { 'aria-valuetext': control.state.sentence } : {}), cursor: control.disabled ? 'not-allowed' : control.gestures.drag ? (control.gestures.axis === 'x' ? 'ew-resize' : 'ns-resize') : 'pointer' }) as SVGGElement
      item.style.setProperty('outline', 'none')
      const look = drawLook(control, offset, said, busy === control.id)
      // A button that cannot act now is drawn faint; its hint and label say why.
      if (control.disabled) look.setAttribute('opacity', '0.5')
      item.appendChild(look)
      const { hit } = control
      // The hit area: a finger's size at least, and follows a dragged line.
      const area = el('rect', { x: hit.x, y: hit.y + (control.look.shape === 'line' || control.look.shape === 'ladder' ? offset.dy : 0), width: hit.width, height: hit.height,
        rx: Math.min(hit.width, hit.height) / 2, 'pointer-events': 'all', 'data-rule-hit': '' }, { fill: 'transparent' })
      area.style.setProperty('touch-action', 'none')
      item.appendChild(area)
      // The keyboard's focus shows as a ring.
      const ring = el('rect', { x: hit.x - 3, y: hit.y - 3 + (control.look.shape === 'line' ? offset.dy : 0), width: hit.width + 6, height: hit.height + 6, rx: Math.min(hit.width, hit.height) / 2 + 3,
        fill: 'none', 'stroke-width': 2.5, 'pointer-events': 'none', 'data-rule-focus': '', opacity: 0 }, { stroke: controlInk.line })
      item.appendChild(ring)
      // What a tap does, in words, on hover and on focus: a glyph alone (a box, a +) never has to be guessed.
      // A limit line says it on its own pill. A <title> gives the full words to a pointer's tooltip. A header control says
      // it under the header (hintAt), never over a lane's name; elsewhere just above the control.
      const tip = el('title', {}) as SVGElement
      tip.textContent = control.label
      item.appendChild(tip)
      const scale = Math.min(hit.width, hit.height) / 44
      const hintWords = control.look.shape === 'line' || control.look.shape === 'ladder' ? null : hintOf(control)
      // A hint on a backing pill (it may lie over a card), kept inside its column (hintBounds): never across the next one.
      // Too long for its column, it wraps onto a second line.
      const hintSize = 12 * scale, glyphW = hintSize * 0.58, pad = 8 * scale, lineH = hintSize * 1.3
      const room = control.hintBounds ? control.hintBounds.right - control.hintBounds.left : Infinity
      const lines = hintWords ? hintLines(hintWords, Math.max(8, Math.floor((room - pad * 2) / glyphW))) : []
      const hintW = lines.length ? Math.max(...lines.map(line => line.trimEnd().length)) * glyphW + pad * 2 : 0
      const hintH = 22 * scale + (lines.length - 1) * lineH
      let hintX = control.hintAt?.x ?? hit.x + hit.width / 2
      const hintY = control.hintAt?.y ?? hit.y - 8 * scale
      if (control.hintBounds) {
        const { left, right } = control.hintBounds
        hintX = hintW >= right - left ? (left + right) / 2 : Math.max(left + hintW / 2, Math.min(right - hintW / 2, hintX))
      }
      const back = lines.length ? el('path', { d: round(hintX - hintW / 2, hintY - 16 * scale, hintW, hintH, 11 * scale), 'stroke-width': 1, 'pointer-events': 'none', 'data-rule-hint-back': '' },
        { fill: controlInk.off, stroke: controlInk.offLine }) : null
      const hint = lines.length ? text(hintX, hintY, lines.length === 1 ? lines[0] : '', hintSize, controlInk.ink, 'middle', true, false) : null
      if (hint && lines.length > 1) {
        // Each line its own tspan; a line keeps its trailing space, so the hint's words read whole (textContent).
        lines.forEach((line, i) => {
          const span = document.createElementNS(svgNS, 'tspan')
          span.setAttribute('x', String(hintX))
          span.setAttribute('dy', String(i ? lineH : 0))
          span.textContent = line
          hint.appendChild(span)
        })
      }
      // Hidden two ways (opacity and visibility), so no copy of the canvas that drops one of them shows a hint at rest.
      const show = (on: boolean) => {
        for (const node of [back, hint]) {
          node?.setAttribute('opacity', on ? '1' : '0')
          node?.setAttribute('visibility', on ? 'visible' : 'hidden')
        }
      }
      if (back && hint) { hint.setAttribute('data-rule-hint', ''); item.appendChild(back); item.appendChild(hint); show(false) }
      // A pointer's hint waits a moment: a control just drawn under a resting pointer (a lane selected by a click) says
      // nothing until the pointer stays on it. The keyboard's focus says it at once.
      let hover: ReturnType<typeof setTimeout> | undefined
      item.addEventListener('focus', () => { ring.setAttribute('opacity', '1'); show(true) })
      item.addEventListener('blur', () => { ring.setAttribute('opacity', '0'); show(false) })
      item.addEventListener('pointerenter', () => { clearTimeout(hover); hover = setTimeout(() => { if (!gone && item.isConnected) show(true) }, HINT_DELAY) })
      item.addEventListener('pointerleave', () => { clearTimeout(hover); if (document.activeElement !== item) show(false) })
      wire(item, control)
      if (flash?.id === control.id && flash.until > Date.now()) {
        const words = flash.ok ? control.state.sentence : 'Not changed'
        item.appendChild(text(hintX, control.hintAt ? hintY : hit.y - 8 * (hit.height / 44), words, 13 * scale, flash.ok ? controlInk.line : controlInk.refuse, 'middle', true, true))
        item.setAttribute('data-rule-flash', words)
      }
      into(control, item)
    }
    // Above every note of the slate, as the chrome's badges are.
    if (root!.lastChild !== group) root!.appendChild(group)
    if (focused) (group.querySelector(`[data-rule-control="${CSS.escape ? CSS.escape(focused) : focused}"]`) as SVGGElement | null)?.focus({ preventScroll: true })
  }

  function wire(item: SVGGElement, control: RuleControl) {
    const stop = (event: Event) => event.stopPropagation()
    item.addEventListener('mousedown', stop)
    item.addEventListener('touchstart', stop, { passive: true })
    item.addEventListener('dblclick', event => { event.stopPropagation(); event.preventDefault() })
    item.addEventListener('pointerdown', event => {
      event.stopPropagation()
      event.preventDefault()
      if (busy || held) return
      const mine: Held = { control, start: toBoard(event), delta: { dx: 0, dy: 0 }, moved: false, holdDone: false, pointerId: event.pointerId }
      held = mine
      // The drag is followed on the window: the control is drawn again as it moves.
      const move = (moved: PointerEvent) => {
        if (held !== mine || moved.pointerId !== mine.pointerId) return
        const at = toBoard(moved)
        const delta = { dx: at.x - mine.start.x, dy: at.y - mine.start.y }
        if (!mine.moved && Math.hypot(delta.dx, delta.dy) < 5) return
        if (!mine.control.gestures.drag) return
        moved.preventDefault()
        mine.moved = true
        clearTimeout(mine.holdTimer)
        mine.delta = mine.control.gestures.axis === 'x' ? { dx: delta.dx, dy: 0 } : { dx: 0, dy: delta.dy }
        render()
      }
      const finish = (ended: PointerEvent) => {
        if (ended.pointerId !== mine.pointerId) return
        window.removeEventListener('pointermove', move, true)
        window.removeEventListener('pointerup', finish, true)
        window.removeEventListener('pointercancel', finish, true)
        if (held !== mine) return
        held = null
        clearTimeout(mine.holdTimer)
        const live = mine.control
        if (ended.type === 'pointercancel' || mine.holdDone) { render(); return }
        ended.stopPropagation()
        if (mine.moved && live.gestures.drag) {
          const said = live.gestures.preview?.(mine.delta) ?? live.label
          const edits = live.gestures.drag(mine.delta)
          render()
          void commit(live, edits, said)
        } else if (live.gestures.tap) void commit(live, live.gestures.tap, live.label)
        else render()
      }
      window.addEventListener('pointermove', move, true)
      window.addEventListener('pointerup', finish, true)
      window.addEventListener('pointercancel', finish, true)
      if (control.gestures.hold) {
        mine.holdTimer = setTimeout(() => {
          if (held !== mine || mine.moved) return
          mine.holdDone = true
          void commit(mine.control, mine.control.gestures.hold, mine.control.label)
        }, 550)
      }
    })
    item.addEventListener('click', stop)
    item.addEventListener('contextmenu', event => {
      event.preventDefault()
      event.stopPropagation()
      if (control.gestures.hold) void commit(control, control.gestures.hold, control.label)
    })
    item.addEventListener('keydown', event => {
      const key = event.key
      const { gestures } = control
      let edits: WorkshopEdit[] | undefined
      if ((key === 'Enter' || key === ' ') && event.shiftKey && gestures.hold) edits = gestures.hold
      else if (key === 'Enter' || key === ' ') edits = gestures.tap
      else if ((key === 'Delete' || key === 'Backspace') && gestures.remove) edits = gestures.remove
      else if (gestures.drag && gestures.step && /^Arrow(Up|Down|Left|Right)$/.test(key)) {
        const sign = key === 'ArrowUp' || key === 'ArrowLeft' ? -1 : 1
        edits = gestures.drag(gestures.axis === 'x' ? { dx: sign * gestures.step, dy: 0 } : { dx: 0, dy: sign * gestures.step })
      } else return
      event.preventDefault()
      event.stopPropagation()
      void commit(control, edits, control.label)
    })
  }

  render()
  return {
    update(next, at) {
      if (gone) return
      current = next
      if (at) origin = at
      // A drag in progress keeps going on the control it began on, as long as it is still there.
      if (held && !next.some(item => item.id === held!.control.id)) held = null
      else if (held) held = { ...held, control: next.find(item => item.id === held!.control.id)! }
      render()
    },
    remove() {
      gone = true
      clearTimeout(flashTimer)
      if (held) clearTimeout(held.holdTimer)
      group.remove()
    },
  }
}
