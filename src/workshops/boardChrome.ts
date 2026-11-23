// A board's chrome: drawn from data in the board's own layer and never saved. Its title, its rules as a
// legend of chips and as badges where they act (a column's bin or gate on its header, a path rule on the seam
// between two columns), the focus frame with its "Editing" and "Done" tags, and a draft's dashed frame with
// its "Preview · not added yet" tag. Rules stay data: every chip and badge is generated from the board's
// rulebook by boardLegend, so it cannot drift from what the rules do, and a rule a column's counter already
// shows ("2 / 3") is not said again. Nothing here is a note: it is never saved, exported as a note, or a card.
import type { Workshop, WorkshopBoardLayout } from './model'
import { rulebook, rulebookLoaded } from './kinds'
import { renderLayerShapes, type LayerShape } from './boardLayer'

/** Colours of the chrome, as tokens a host sets (light and dark) with these defaults behind them. */
export const chromeInk = {
  title: 'var(--slatebox-board-title, #1f3d33)',
  chip: 'var(--slatebox-board-chip, #f2efe4)',
  chipInk: 'var(--slatebox-board-chip-ink, #3d4b46)',
  focus: 'var(--slatebox-board-focus, #1f4a3a)',
  focusInk: 'var(--slatebox-board-focus-ink, #ffffff)',
  preview: 'var(--slatebox-board-preview, #8a6a1f)',
  previewFill: 'var(--slatebox-board-preview-fill, #f6cf86)',
  previewInk: 'var(--slatebox-board-preview-ink, #1f3d33)',
  halo: 'var(--slatebox-board-halo, #ffffff)',
  badge: 'var(--slatebox-board-badge, #ffffff)',
  badgeLine: 'var(--slatebox-board-grid, #d9ddd5)',
  badgeInk: 'var(--slatebox-board-ink, #34433f)',
}

export type LegendIcon = 'bin' | 'gate' | 'step' | 'oneway' | 'clock' | 'flag' | 'push' | 'lock' | 'rule'

/** One thing a board's legend says: an icon, a few words, and where on the board the same icon stands (if anywhere). */
export interface LegendItem {
  icon: LegendIcon
  /** A few words ("One column at a time"); the rule's full sentence stays the refusal and the chat's answer. */
  text: string
  /** A rule that only warns: its chip is outlined dashed. */
  warn?: boolean
  /** The column whose header carries the icon. */
  lane?: string
  /** The seams (from column, to column) that carry the icon. */
  seams?: [string, string][]
}

interface RuleData { kind: string; on?: boolean; severity?: string; lane?: string; into?: string; needs?: string[]; from?: string; to?: string[]; noSkip?: boolean }

const labelOf = (board: Workshop, id: string) => board.lanes.find(lane => lane.id === id)?.label ?? id
const trim = (sentence: string) => sentence.replace(/\.$/, '')
const fieldWords: Record<string, string> = { amount: 'an amount', owner: 'an owner', due: 'a date', estimate: 'an estimate' }

/**
 * What a board's legend says, from its rules (as data). A column's limit is left out: its counter says it.
 * - A board of columns: its rulebook's rules that are on (a bin, a gate, a path).
 * - A launch plan, hiring plan or pipeline: its own sentences, a few words each (the rulebook must have loaded;
 *   until it has, the legend is empty).
 * - A map: nothing (its stations say what they hold).
 */
export function boardLegend(board: Workshop): LegendItem[] {
  if (board.lanes[0]?.station) return []
  if (board.kind) return kitLegend(board)
  const items: LegendItem[] = []
  const lanes = board.lanes.map(lane => lane.id)
  const rules = ((board.behaviour as { rules?: RuleData[] } | undefined)?.rules ?? []).filter(rule => rule.on !== false)
  for (const rule of rules) {
    const warn = rule.severity === 'warn' || undefined
    const at = (item: LegendItem) => items.push(warn ? { ...item, warn } : item)
    if (rule.kind === 'bin' && rule.lane) at({ icon: 'bin', text: labelOf(board, rule.lane) + ' is a bin', lane: rule.lane })
    else if (rule.kind === 'gate' && rule.into) at({ icon: 'gate', text: labelOf(board, rule.into) + ' needs ' + (rule.needs ?? []).map(need => fieldWords[need] ?? need).join(' and '), lane: rule.into })
    else if (rule.kind === 'path' && rule.from) {
      if (!rule.to) at({ icon: 'step', text: 'One column at a time', seams: lanes.slice(1).map((id, i) => [lanes[i], id] as [string, string]) })
      else {
        const from = rule.from
        const seams = rule.to.filter(id => Math.abs(lanes.indexOf(id) - lanes.indexOf(from)) === 1).map(id => [from, id] as [string, string])
        at({ icon: 'oneway', text: labelOf(board, from) + ' → ' + rule.to.map(id => labelOf(board, id)).join(' or ') + ' only', seams })
      }
    }
  }
  return items
}

/** A plan's or a pipeline's legend: its own sentences in a chip's few words. */
function kitLegend(board: Workshop): LegendItem[] {
  if (!rulebookLoaded()) return []
  let lines: string[]
  try { lines = rulebook().lines(board) } catch { return [] }
  const items: LegendItem[] = []
  for (const line of lines) {
    const text = trim(line)
    // A stage's limit is its counter's to say; a parking area's note says what it is on the board itself.
    if (/ holds \d+$/.test(text) || / holds cards not placed yet/.test(text)) continue
    const warn = / \(a warning only\)$/.test(text) || undefined
    const icon: LegendIcon = /weekend|working day|whole week/i.test(text) ? 'clock' : /slip|push/i.test(text) ? 'push'
      : /hard line|ends by|launch|go-live/i.test(text) ? 'flag' : /lock/i.test(text) ? 'lock' : /one stage at a time/i.test(text) ? 'step' : 'rule'
    items.push({ icon, text: shorten(text), ...(warn && { warn }) })
  }
  return items
}

/** The plans' and pipelines' sentences, in a chip's few words. */
function shorten(text: string): string {
  const plain = text.replace(/ \(a warning only\)$/, '')
  if (/^Days are working days/i.test(plain)) return 'Weekends skipped'
  if (/^A slip pushes the/i.test(plain)) return 'A slip pushes what waits'
  if (/ is a hard line/i.test(plain)) return 'Hard line'
  if (/^Every task ends by (.*)$/i.test(plain)) return plain.replace(/^Every task ends by (.*)$/i, 'Ends by $1')
  if (/^Hires snap to whole weeks$/i.test(plain)) return 'Whole weeks'
  if (/^Deals move one stage at a time$/i.test(plain)) return 'One stage at a time'
  if (/^A won deal needs an amount$/i.test(plain)) return 'Won needs an amount'
  return plain.length > 46 ? plain.slice(0, 44).replace(/\s+\S*$/, '') + '…' : plain
}

/** The width of words at a type size (the layer measures nothing: an average glyph is about half an em). */
export const chromeTextWidth = (text: string, size: number, bold = false) => Math.ceil(text.length * size * (bold ? 0.58 : 0.52))

function icon(kind: LegendIcon, x: number, y: number, color: string, size = 12): LayerShape[] {
  const s = size / 12
  // Points move to (x, y); an arc's radii only scale.
  const at = (d: string) => d.replace(/A(\d+(?:\.\d+)?),(\d+(?:\.\d+)?)/g, (_, rx, ry) => `A${+rx * s} ${+ry * s}`)
    .replace(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, a, b) => `${+(x + +a * s).toFixed(1)},${+(y + +b * s).toFixed(1)}`)
  const path = (d: string, width = 1.6): LayerShape => ({ t: 'path', d: at(d), color, width: width * s })
  switch (kind) {
    case 'bin': return [path('M2,3 L10,3 M4.5,3 L4.5,1.5 L7.5,1.5 L7.5,3 M3,3 L3.8,11 L8.2,11 L9,3')]
    case 'gate': return [path('M2,11 L2,3 L10,3 L10,11 M6,3 L6,11 M2,7 L10,7')]
    case 'step': return [path('M4,2 L8,6 L4,10', 1.8)]
    case 'oneway': return [path('M1,6 L10,6 M7,3 L10,6 L7,9', 1.8)]
    case 'clock': return [path('M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,3.5 L6,6 L8,7.5')]
    case 'flag': return [path('M3,11 L3,1.5 L10,3.5 L3,6')]
    case 'push': return [path('M1,6 L7,6 M4.5,3.5 L7,6 L4.5,8.5 M9.5,2 L9.5,10', 1.7)]
    case 'lock': return [path('M3,6 L9,6 L9,11 L3,11 Z M4.5,6 L4.5,4 Q6,1.5 7.5,4 L7.5,6')]
    default: return [path('M6,1 A5,5 0 1 1 6,11 A5,5 0 1 1 6,1 M6,4 L6,6.5 M6,8.5 L6,8.6', 1.7)]
  }
}

/** A rounded box as a path (a frame, a chip, a badge). */
const roundRect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${x + r},${y} H${x + w - r} A${r},${r} 0 0 1 ${x + w},${y + r} V${y + h - r} A${r},${r} 0 0 1 ${x + w - r},${y + h} H${x + r} A${r},${r} 0 0 1 ${x},${y + h - r} V${y + r} A${r},${r} 0 0 1 ${x + r},${y} Z`

interface ChipLook { fill?: string; ink?: string; line?: string; bold?: boolean; role?: string }

/** A chip's width at a scale. */
function chipWidth(item: { icon?: LegendIcon; text: string }, k: number, bold = false) {
  return Math.round(10 * k + (item.icon ? 17 * k : 0) + chromeTextWidth(item.text, 13 * k, bold) + 10 * k)
}

function chip(x: number, y: number, item: { icon?: LegendIcon; text: string; warn?: boolean }, k: number, look: ChipLook = {}): LayerShape[] {
  const h = 24 * k, pad = 10 * k, iconW = item.icon ? 17 * k : 0
  const width = chipWidth(item, k, look.bold)
  const ink = look.ink ?? chromeInk.chipInk
  const shapes: LayerShape[] = [{ t: 'path', d: roundRect(x, y, width, h, h / 2), color: item.warn ? chromeInk.preview : look.line ?? 'none', width: 1,
    fill: look.fill ?? chromeInk.chip, ...(item.warn && { dash: '3 3' }), ...(look.role && { role: look.role + '-box' }) }]
  if (item.icon) shapes.push(...icon(item.icon, x + pad, y + 6 * k, ink, 12 * k))
  shapes.push({ t: 'text', x: x + pad + iconW, y: y + 16.5 * k, text: item.text, color: ink, size: 13 * k, role: look.role ?? 'legend', ...(look.bold && { bold: true }) })
  return shapes
}

/** A badge on the board: an icon in a small circle (a column's header corner, or a seam). */
function badge(kind: LegendIcon, cx: number, cy: number, role: string): LayerShape[] {
  return [{ t: 'path', d: roundRect(cx - 11, cy - 11, 22, 22, 11), color: chromeInk.badgeLine, width: 1, fill: chromeInk.badge, role },
    ...icon(kind, cx - 6, cy - 6, chromeInk.badgeInk)]
}

export interface ChromeOptions {
  /** The board's layout (columns per row), as it is drawn: where a badge stands. */
  layout?: WorkshopBoardLayout
  /** The board is in focus: a solid frame with "Editing" and "Done". */
  focused?: boolean
  /** The board is a draft not yet added (a library preview): a dashed frame tagged "Preview · not added yet". */
  draft?: boolean
  /** The chrome's type scale: max(1, 0.75 / zoom), at most 2.5, so a board's name stays readable in an overview of many boards. */
  scale?: number
  /** A phone: the legend starts on the row under the title. */
  narrow?: boolean
  /** Where each column is drawn (board coordinates), for the badges. A kit or a map has none. */
  places?: { laneId: string; x: number; y: number; width: number; row: number }[]
}

/** The words of the draft tag. */
export const DRAFT_TAG = 'Preview · not added yet'

/** Where the chrome's parts go, in board coordinates (0,0 is the board's origin, `size` its drawn box). */
export function boardChromeLayout(board: Workshop, size: { x?: number; y?: number; width: number; height: number }, options: ChromeOptions = {}) {
  const left = size.x ?? 0, top = size.y ?? 0
  const legend = boardLegend(board)
  const k = Math.min(2.5, Math.max(1, options.scale ?? 1))
  const titleSize = 18 * k, rowH = 30 * k
  // The legend wraps first-fit within the board's width (at least 640 on a wide screen), so it never runs into the next board.
  const maxX = left + Math.max(size.width, options.narrow ? 0 : Math.min(640, size.width + 120))
  const placed: { x: number; row: number; item: LegendItem; width: number }[] = []
  // A name longer than the board is shortened to fit it (with "…"), so it never runs into the next board when zoomed out.
  let title = board.title
  const room = Math.max(size.width - 4, titleSize * 4)
  if (chromeTextWidth(title, titleSize, true) > room) {
    const fits = Math.max(3, Math.floor(room / (titleSize * 0.58)) - 1)
    title = title.slice(0, fits).replace(/\s+\S*$/, '').replace(/[\s,.;:–-]+$/, '') + '…'
  }
  // Each row's next free x; a phone starts the chips on the row under the name.
  const ends: number[] = [left + 2 + chromeTextWidth(title, titleSize, true) + 14 * k]
  if (options.narrow && legend.length) { ends[0] = Infinity; ends.push(left + 2) }
  for (const item of legend) {
    const width = chipWidth(item, k)
    let row = ends.findIndex(end => end + width <= maxX)
    if (row < 0) { ends.push(left + 2); row = ends.length - 1 }
    placed.push({ x: ends[row], row, item, width })
    ends[row] += width + 6 * k
  }
  const rows = Math.max(1, ...placed.map(p => p.row + 1))
  // The last row ends 14 above the board.
  const titleY = top - 14 * k - rows * rowH
  const framed = Boolean(options.focused || options.draft)
  const frame = framed ? { x: left - 16, y: titleY - 18 * k, width: size.width + 32, height: top + size.height + 16 - (titleY - 18 * k) } : null
  // The topmost thing the chrome draws: a frame's tag stands half above its line.
  const above = frame ? frame.y - 12 * k : titleY
  return { k, legend, placed, rows, title, titleY, titleSize, rowH, frame, top: above }
}

/** The chrome of one board in board coordinates: its title row, and in focus or as a draft its frame and tags. */
export function boardChromeShapes(board: Workshop, size: { x?: number; y?: number; width: number; height: number }, options: ChromeOptions = {}): LayerShape[] {
  const { k, placed, title, titleY, titleSize, rowH, frame } = boardChromeLayout(board, size, options)
  const left = size.x ?? 0
  const shapes: LayerShape[] = []
  if (frame) {
    shapes.push({ t: 'path', d: roundRect(frame.x, frame.y, frame.width, frame.height, 18), color: options.focused ? chromeInk.focus : chromeInk.preview, width: 2,
      ...(!options.focused && { dash: '8 6' }), role: options.focused ? 'focus-frame' : 'draft-frame' })
  }
  shapes.push({ t: 'text', x: left + 2, y: titleY + 19 * k, text: title, color: chromeInk.title, size: titleSize, bold: true, role: 'board-title' })
  for (const p of placed) shapes.push(...chip(p.x, titleY + p.row * rowH + 2 * k, p.item, k))
  if (frame) {
    const tagY = frame.y - 12 * k
    if (options.focused) {
      const editing = { text: 'Editing' }
      shapes.push(...chip(frame.x + 18, tagY, editing, k, { fill: chromeInk.focus, ink: chromeInk.focusInk, bold: true, role: 'focus-tag' }))
      shapes.push(...chip(frame.x + 18 + chipWidth(editing, k, true) + 6 * k, tagY, { text: 'Done' }, k,
        { fill: chromeInk.halo, ink: chromeInk.focus, line: chromeInk.focus, bold: true, role: 'focus-done' }))
    } else {
      shapes.push(...chip(frame.x + 18, tagY, { text: DRAFT_TAG }, k, { fill: chromeInk.previewFill, ink: chromeInk.previewInk, bold: true, role: 'draft-tag' }))
    }
  }
  return shapes
}

/** The badges where the rules act (a column's header corner, the seam between two columns): drawn above the board's notes. */
export function boardBadgeShapes(board: Workshop, options: ChromeOptions = {}): LayerShape[] {
  const places = options.places
  if (!places?.length || board.kind || board.lanes[0]?.station) return []
  const shapes: LayerShape[] = []
  const place = (id: string) => places.find(item => item.laneId === id)
  for (const item of boardLegend(board)) {
    const at = item.lane ? place(item.lane) : undefined
    if (at) shapes.push(...badge(item.icon, at.x + at.width - 22, at.y + 18, 'badge-' + item.lane))
    for (const [from, to] of item.seams ?? []) {
      const a = place(from), b = place(to)
      // Only between two columns side by side: a wrapped row has no seam.
      if (!a || !b || a.row !== b.row) continue
      shapes.push(...badge(item.icon, (a.x + a.width + b.x) / 2, a.y + 35, 'seam-' + from + '>' + to))
    }
  }
  return shapes
}

/** What a screen reader hears of a board's chrome: its title, then its legend. */
export function boardChromeLabel(board: Workshop): string {
  const legend = boardLegend(board).map(item => item.text)
  return legend.length ? board.title + ': ' + legend.join(', ') : board.title
}

/**
 * The styles a host adds once for boards: the board in focus brings the rest of the canvas down to 32% while the
 * host's canvas element carries the `focusing` class, and a draft's notes are see-through.
 */
export const boardChromeStyles = `
.focusing [data-node-id]:not([data-workshop-focused]),
.focusing g[data-board-layer=""]:not([data-workshop-focused]),
.focusing g[data-board-layer-top]:not([data-workshop-focused]),
.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }
[data-node-id][data-workshop-draft] { opacity: .78; }
@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }
`

const svgNS = 'http://www.w3.org/2000/svg'

export interface BoardChromeState extends ChromeOptions {
  board: Workshop
  /** The board's scope on a slate of many boards ('main' for the first): said on the chrome's groups (data-board-scope). */
  scope?: string
  origin: { x: number; y: number }
  /** The board's drawn box, in board coordinates. */
  size: { width: number; height: number }
  /** The first of the board's notes in the canvas: the title row goes just under it (under every note of the board). */
  under?: Element | null
  /** A person pressed "Done" on the focus frame. */
  onDone?: () => void
}

export interface BoardChrome {
  draw(state: BoardChromeState): void
  destroy(): void
}

/** The chrome of one attached board: a group under the board's notes (title, legend, frame) and one above them (badges). */
export function createBoardChrome(slate: any): BoardChrome {
  const root: SVGSVGElement | undefined = slate?.canvas?.node
  const under = typeof document !== 'undefined' ? document.createElementNS(svgNS, 'g') as SVGGElement : null
  const over = typeof document !== 'undefined' ? document.createElementNS(svgNS, 'g') as SVGGElement : null
  for (const group of [under, over]) {
    group?.setAttribute('data-board-chrome', '')
    group?.setAttribute('pointer-events', 'none')
  }
  over?.setAttribute('data-board-badges', '')
  let gone = false
  return {
    draw(state) {
      if (gone || !root || !under || !over) return
      const options: ChromeOptions = { layout: state.layout, focused: state.focused, draft: state.draft, scale: state.scale, narrow: state.narrow, places: state.places }
      for (const group of [under, over]) {
        group.setAttribute('transform', `translate(${state.origin.x} ${state.origin.y})`)
        group.toggleAttribute('data-workshop-focused', Boolean(state.focused))
        group.toggleAttribute('data-workshop-draft', Boolean(state.draft))
        group.setAttribute('data-board-scope', state.scope ?? 'main')
      }
      under.setAttribute('role', 'group')
      under.setAttribute('aria-label', boardChromeLabel(state.board))
      renderLayerShapes(under, boardChromeShapes(state.board, { width: state.size.width, height: state.size.height }, options))
      renderLayerShapes(over, boardBadgeShapes(state.board, options))
      // "Done" is a real button: a click, Enter or Space takes the board out of focus.
      const done = under.querySelector('[data-board-layer="focus-done-box"]')
      if (done && state.onDone) {
        const onDone = state.onDone
        done.setAttribute('role', 'button')
        done.setAttribute('tabindex', '0')
        done.setAttribute('aria-label', 'Done changing ' + state.board.title)
        done.setAttribute('pointer-events', 'all')
        done.setAttribute('cursor', 'pointer')
        done.addEventListener('pointerdown', event => event.stopPropagation())
        done.addEventListener('click', event => { event.stopPropagation(); onDone() })
        done.addEventListener('keydown', event => {
          const key = (event as KeyboardEvent).key
          if (key !== 'Enter' && key !== ' ') return
          event.preventDefault()
          event.stopPropagation()
          onDone()
        })
      }
      // Under the board's notes (so a card is never covered), above anything drawn before the board.
      const first = state.under && state.under.parentNode === root ? state.under : null
      if (first) { if (under.nextSibling !== first) root.insertBefore(under, first) }
      else if (under.parentNode !== root) root.insertBefore(under, root.firstChild)
      // Badges above every note of the board.
      if (over.firstChild) { if (root.lastChild !== over) root.appendChild(over) }
      else if (over.parentNode) over.remove()
    },
    destroy() {
      gone = true
      under?.remove()
      over?.remove()
    },
  }
}
