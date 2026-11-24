// Agents on the canvas: a named pointer for every agent run that is saving to the slate, with its
// plan as a short checklist beside it.
//
// The records come from the host (the app publishes them from its server, never from the relay),
// so nothing a person's page sets can draw an agent here, and nothing drawn here is a person's
// cursor: people are round arrow cursors (Collab.ts), agents a hexagon with a pointer chevron.
//
// This module only reads the slate's public canvas, its notes and its view box. It draws in its
// own svg.js group above the notes, in world coordinates; the pointer, tag and checklist are
// counter-scaled so they stay the same size on screen at every zoom.

// The person's reduced-motion setting (as DragPolicy reads it; kept here so this entry shares no chunk).
function prefersReducedMotion(): boolean {
  try {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

import {
  AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, AGENT_SAY_MS, agentChecklist, agentName, agentOrigin, agentSaying, agentStepText, clip, plainLine,
  safeIconUrl, time, visibleAgents, type AgentPresenceRecord, type AgentStepStatus,
} from './agentPresenceText'

export {
  AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, AGENT_SAY_MS, agentChecklist, agentName, agentOrigin, agentSaying, agentStepText, safeIconUrl,
  visibleAgents, clip, plainLine, type AgentPresenceRecord, type AgentStepStatus,
}
// The live suggestions an agent makes (ghost frames, tags, Keep and Discard) are their own entry, slateboxjs/suggestions,
// loaded when the first suggestion arrives; it takes the helpers below from this entry instead of carrying a copy.

export interface AgentPresenceOptions {
  now?: () => number
  /** Jump instead of glide (defaults to the person's reduced-motion setting). */
  reducedMotion?: () => boolean
  /** How long the final checklist stays after a run ends, then how long it fades. */
  holdMs?: number
  fadeMs?: number
  /** At most this many agents are drawn: the most recently active. */
  maxAgents?: number
  /** Called when a tag is tapped, with whether its list is now open. */
  onToggle?: (agentKey: string, open: boolean) => void
  /**
   * Screen pixels at each edge of the canvas that the host covers with something of its own (a call strip over
   * the bottom of the canvas, say). Pointers, tags and checklists are kept out of them, as out of the edge itself.
   */
  insets?: () => { top?: number; right?: number; bottom?: number; left?: number } | null | undefined
  /**
   * An agent working out of view gets a marker at the edge of the view ("Research is working →"); pressing it
   * brings the view to the agent. By default the canvas's own camera pans there, keeping the zoom.
   */
  goTo?: (point: { x: number; y: number }, agentKey: string) => void
}

export interface AgentPresence {
  set(records: AgentPresenceRecord[]): void
  /** Open or close an agent's full checklist (the tag does this when tapped). */
  expand(agentKey: string, open?: boolean): void
  /** What is drawn now, for hosts and tests. */
  shown(): { agentKey: string; label: string; step: string | null; x: number; y: number; opacity: number; compact: boolean; lines: string[]; side: { right: boolean; down: boolean }; offscreen: boolean }[]
  destroy(): void
}

export const AGENT_GLIDE_MS = 400
/** One beat of a choreographed run: the pointer's leg to each spot when it visits several in turn. */
export const AGENT_BEAT_MS = 450
export const AGENT_MAX_VISITS = 5
const CARD_WIDTH = 240
const NARROW = 600
/** Where the tag starts from the pointer's tip, in screen pixels (past the avatar). */
const TAG_DX = 40
const TAG_DY = 30
/** The suggestions' labels an agent's tag keeps off (drawn by slateboxjs/suggestions), and every line of words. */
const LABELS = '[data-suggestion-tag], [data-suggestion-all]'
const WORDS = 'text, ' + LABELS


interface Drawn {
  key: string
  group: any
  body: any
  record: AgentPresenceRecord
  targetsKey: string
  /** Whether its targets were found when it was routed: a save's notes can arrive after its record. */
  found: boolean
  x: number
  y: number
  path: { x: number; y: number; ms: number }[]
  leg: { fromX: number; fromY: number; startedAt: number } | null
  open: boolean
  opacity: number
  compact: boolean
  lines: string[]
  step: string | null
  /** Which side of the pointer its tag is on. */
  side?: { right: boolean; down: boolean }
  /** The side its route chose for its last target, or null when it points at no note. */
  routedSide?: { right: boolean; down: boolean } | null
  /** The tag block size and zoom the route was chosen for. */
  routedFor?: string
}

export interface Box { x: number; y: number; w: number; h: number }
/** How much of box a covers box b (area, world units). */
export const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
/** A note's box in world units, or null. */
export function boxOf(node: any): Box | null {
  const o = node?.options
  if (!o || ![o.x, o.y, o.width, o.height].every(value => typeof value === 'number' && Number.isFinite(value))) return null
  return { x: o.x, y: o.y, w: o.width, h: o.height }
}
/** An agent's colour from its colorIndex (any integer). */
export const agentColor = (index: unknown) => AGENT_PALETTE[(((Number(index) || 0) % AGENT_PALETTE.length) + AGENT_PALETTE.length) % AGENT_PALETTE.length]
/** The agent mark: a hexagon's points, centred at (cx, cy) with radius r. */
export const hexPoints = (cx: number, cy: number, r: number) => Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 6 + (i * Math.PI) / 3
  return (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2)
}).join(' ')
/**
 * Screen pixels per world unit as the canvas element fits its view box (preserveAspectRatio: "slice" crops the longer
 * side, "meet" or none adds room around it), with the view box; null when the canvas has no size yet.
 */
export function screenScale(slate: any): { box: { x: number; y: number; width: number; height: number }; rect: DOMRect; scale: number } | null {
  try {
    const box = slate.canvas.viewbox()
    const rect = slate.canvas.node?.getBoundingClientRect?.()
    if (!box?.width || !box?.height || !rect?.width || !rect?.height) return null
    const fit = String(slate.canvas.node?.getAttribute?.('preserveAspectRatio') || 'xMidYMid meet')
    const sx = rect.width / box.width, sy = rect.height / box.height
    return { box, rect, scale: fit === 'none' ? sx : /slice/.test(fit) ? Math.max(sx, sy) : Math.min(sx, sy) }
  } catch { return null }
}
/** The canvas's scale, else the pan-zoom's, else 1. */
export function canvasZoom(slate: any): number {
  const shown = screenScale(slate)
  if (shown) return shown.scale
  try {
    const z = slate.getZoom?.()
    if (typeof z === 'number' && z > 0) return z
  } catch { /* no pan-zoom yet */ }
  return 1
}

/**
 * Which side of its pointer an agent's tag (and open checklist) goes: right and down unless that
 * leaves the view or covers words. Tried in order: right-down, left-down, right-up, left-up; the
 * first that stays in view and covers no target note wins, else the one that covers least (a
 * target note's words count three times another note's, and anything off screen counts most).
 * `at` is the pointer, `size` the tag block in screen pixels, `scale` screen pixels per world unit.
 */
export function agentTagSide(at: { x: number; y: number }, size: { w: number; h: number }, scale: number, view: Box | null, targets: Box[], others: Box[] = [], words?: Box[]): { right: boolean; down: boolean } {
  const sides = [{ right: true, down: true }, { right: false, down: true }, { right: true, down: false }, { right: false, down: false }]
  let best = sides[0], bestScore = Infinity
  for (const side of sides) {
    const score = sideScore(at, size, scale, side, view, targets, others, words)
    if (score <= 1e-9) return side
    if (score < bestScore) { best = side; bestScore = score }
  }
  return best
}

/** The world box the tag block takes on one side of its pointer. */
export function agentTagBox(at: { x: number; y: number }, size: { w: number; h: number }, scale: number, side: { right: boolean; down: boolean }): Box {
  const left = side.right ? TAG_DX : -(TAG_DX + size.w)
  const top = side.down ? TAG_DY : -(TAG_DY + size.h)
  return { x: at.x + left / scale, y: at.y + top / scale, w: size.w / scale, h: size.h / scale }
}

/**
 * Where the tag block is drawn on one side: as agentTagBox, slid back inside the view where it would leave it (as
 * draw() does for a pointer on screen), so a side is judged by where its words would really be.
 */
export function agentTagPlaced(at: { x: number; y: number }, size: { w: number; h: number }, scale: number, side: { right: boolean; down: boolean }, view: Box | null): Box {
  const box = agentTagBox(at, size, scale, side)
  if (!view || at.x < view.x || at.x > view.x + view.w || at.y < view.y || at.y > view.y + view.h) return box
  const m = 4 / scale
  if (box.w <= view.w - 2 * m) box.x = Math.min(Math.max(box.x, view.x + m), view.x + view.w - m - box.w)
  if (box.h <= view.h - 2 * m) box.y = Math.min(Math.max(box.y, view.y + m), view.y + view.h - m - box.h)
  return box
}

/** The tag block an agent draws, in screen pixels: its tag, and its checklist when that shows. */
function blockSize(record: AgentPresenceRecord, showList: boolean) {
  const label = agentName(record)
  const step = agentStepText(record)
  const stepLine = step ? clip(step, 40) : ''
  // Bold 12px words take about 7px a letter, the 12px step about 6.8px: the tag is wide enough for both.
  const width = Math.max(96, Math.min(CARD_WIDTH, 16 + Math.max(7 * label.length, 6.8 * stepLine.length)))
  const height = stepLine ? 40 : 22
  const rows = showList ? (record.plan?.steps ?? []).length : 0
  return { width, height, w: Math.max(width, rows ? CARD_WIDTH : 0), h: height + (rows ? 6 + 12 + rows * 18 : 0) }
}

/**
 * Where on a target note the pointer goes, and which way its tag points from there: inside one
 * of the note's corners, with the tag outward from that corner. Lower right first; the first
 * corner whose tag stays in view and off the note (and, where it can, off other notes) wins,
 * else the one that covers least.
 */
export function agentAnchor(note: Box, size: { w: number; h: number }, scale: number, view: Box | null, others: Box[] = [], words?: Box[]): { x: number; y: number; side: { right: boolean; down: boolean } } {
  const inset = Math.min(8, note.w / 4, note.h / 4)
  const corners = [
    { x: note.x + note.w - inset, y: note.y + note.h - inset, side: { right: true, down: true } },
    { x: note.x + inset, y: note.y + note.h - inset, side: { right: false, down: true } },
    { x: note.x + note.w - inset, y: note.y + inset, side: { right: true, down: false } },
    { x: note.x + inset, y: note.y + inset, side: { right: false, down: false } },
  ]
  let best = corners[0], bestScore = Infinity
  for (const corner of corners) {
    const score = sideScore(corner, size, scale, corner.side, view, [note], others, words)
    if (score <= 1e-9) return corner
    if (score < bestScore) { best = corner; bestScore = score }
  }
  return best
}

/**
 * What a tag block costs where it would go. Off screen costs most. Where the canvas's words are known (`words`: every
 * line of text drawn on it, a note's, a board's figures, a person's name or another agent's tag), covering words costs
 * next most, the note it works on a little, and any other note's empty paper next to nothing; otherwise a target note
 * counts three times another note.
 */
/** A side judged where its tag would be drawn (slid into view), and a little worse when it has to slide at all. */
function sideScore(at: { x: number; y: number }, size: { w: number; h: number }, scale: number, side: { right: boolean; down: boolean }, view: Box | null, targets: Box[], others: Box[], words?: Box[]) {
  const raw = agentTagBox(at, size, scale, side)
  const slid = view ? (raw.w * raw.h - overlap(raw, view)) * 0.5 : 0
  return tagScore(agentTagPlaced(at, size, scale, side, view), view, targets, others, words) + slid
}

function tagScore(box: Box, view: Box | null, targets: Box[], others: Box[], words?: Box[]) {
  const outside = view ? box.w * box.h - overlap(box, view) : 0
  const sum = (list: Box[]) => list.reduce((total, other) => total + overlap(box, other), 0)
  if (words?.length) return outside * 10 + sum(words) * 4 + sum(targets) + sum(others) * 0.05
  return outside * 10 + sum(targets) * 3 + sum(others)
}

export function createAgentPresence(slate: any, options: AgentPresenceOptions = {}): AgentPresence {
  const now = options.now ?? (() => Date.now())
  const reduced = options.reducedMotion ?? prefersReducedMotion
  const holdMs = options.holdMs ?? AGENT_HOLD_MS
  const fadeMs = options.fadeMs ?? AGENT_FADE_MS
  const max = options.maxAgents ?? AGENT_MAX_DRAWN
  const drawn = new Map<string, Drawn>()
  const opened = new Set<string>()
  let records: AgentPresenceRecord[] = []
  let layer: any = null
  let frame: number | null = null
  let timer: ReturnType<typeof setTimeout> | null = null
  let destroyed = false
  let lastScale = 0

  const ensureLayer = () => {
    if (layer && layer.node?.isConnected !== false && layer.node?.parentNode) return layer
    layer = slate.canvas.group()
    // data-export-never: drawn for the view only, so no picture of the slate shows it (Export).
    layer.attr({ 'data-agent-presence': '', 'data-export-never': '', 'pointer-events': 'none' })
    return layer
  }

  // Screen pixels per world unit: the container's width over the view box's.
  // What the canvas shows: its view box as the element fits it (preserveAspectRatio: "slice" crops the longer side,
  // "meet" or none adds room around it), and screen pixels per world unit. Null when the canvas has no size yet.
  function shownBox(): { view: Box; scale: number } | null {
    try {
      const fitted = screenScale(slate)
      if (!fitted) return null
      const { box, rect, scale } = fitted
      const w = rect.width / scale, h = rect.height / scale
      const full = { x: box.x + (box.width - w) / 2, y: box.y + (box.height - h) / 2, w, h }
      // A page may show only part of the canvas element (a host that clips it): the view is what is left of it.
      let left = rect.left, top = rect.top, right = rect.right, bottom = rect.bottom
      for (let el = slate.canvas.node?.parentElement; el && el !== document.body; el = el.parentElement) {
        const style = getComputedStyle(el)
        if (style.overflow === 'visible' && style.overflowX === 'visible' && style.overflowY === 'visible') continue
        const clip = el.getBoundingClientRect()
        if (!clip.width || !clip.height) continue
        left = Math.max(left, clip.left); top = Math.max(top, clip.top); right = Math.min(right, clip.right); bottom = Math.min(bottom, clip.bottom)
      }
      // What the host covers at its edges is not view either.
      const cover = options.insets?.() || {}
      left += Math.max(0, cover.left ?? 0); right -= Math.max(0, cover.right ?? 0); top += Math.max(0, cover.top ?? 0); bottom -= Math.max(0, cover.bottom ?? 0)
      if (right - left < 1 || bottom - top < 1) return { view: full, scale }
      return { view: { x: full.x + (left - rect.left) / scale, y: full.y + (top - rect.top) / scale, w: (right - left) / scale, h: (bottom - top) / scale }, scale }
    } catch { return null }
  }
  const zoom = () => canvasZoom(slate)
  const screenWidth = () => {
    try { return slate.canvas.node?.getBoundingClientRect?.().width || (typeof window !== 'undefined' ? window.innerWidth : 1024) } catch { return 1024 }
  }

  // Where a target is drawn: the centre of its note. Workshop cards and lanes are notes named card-<id> and lane-<id> (scoped b2:card-<id> on a slate of many boards).
  function centreOf(id: string): { x: number; y: number } | null {
    const node = slate.nodes?.one?.(id) ?? slate.nodes?.allNodes?.find?.((n: any) => n?.options?.name === id)
    const o = node?.options
    if (!o || typeof o.x !== 'number' || typeof o.y !== 'number') return null
    return { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 }
  }
  const noteOf = (id: string) => slate.nodes?.one?.(id) ?? slate.nodes?.allNodes?.find?.((n: any) => n?.options?.name === id)
  const noteBoxes = (): Box[] => (slate.nodes?.allNodes ?? []).map(boxOf).filter((box: Box | null): box is Box => Boolean(box))
  const sameBox = (a: Box, b: Box) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h
  // Every line of words drawn on the canvas, as world boxes: notes' text, a board's figures and sentences, people's
  // names, the tags of agents other than `except`, and the suggestions' tags and Keep all / Discard all (whole, so an
  // agent's own tag never sits on a group's). Empty where the page cannot measure text (no layout).
  function wordBoxes(except?: string): Box[] {
    try {
      const svg = slate.canvas?.node as SVGSVGElement | undefined
      const matrix = svg?.getScreenCTM?.()?.inverse?.()
      if (!svg || !matrix) return []
      const own = except ? layer?.node?.querySelector?.(`[data-agent="${CSS.escape(except)}"]`) : null
      const boxes: Box[] = []
      for (const text of svg.querySelectorAll(WORDS)) {
        if (own?.contains(text) || !text.textContent?.trim()) continue
        const rect = text.getBoundingClientRect()
        if (rect.width < 1 || rect.height < 1) continue
        const a = new DOMPoint(rect.left, rect.top).matrixTransform(matrix), b = new DOMPoint(rect.right, rect.bottom).matrixTransform(matrix)
        boxes.push({ x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) })
      }
      return boxes
    } catch { return [] }
  }

  // Where the notes are, as a key: a note that moved or changed size changes it.
  function notesKey(): string {
    return noteBoxes().map(box => [box.x, box.y, box.w, box.h].map(Math.round).join(',')).join(';')
  }
  // Where the suggestions' labels are on screen, to the nearest 8 pixels: a group's tag that appears or moves changes it.
  function labelsKey(): string {
    try {
      return [...(slate.canvas?.node?.querySelectorAll?.(LABELS) ?? [])].map((el: Element) => {
        const r = el.getBoundingClientRect()
        return [r.left, r.top, r.width, r.height].map(value => Math.round(value / 8)).join(',')
      }).join(';')
    } catch { return '' }
  }
  // The view as a key, to the nearest 8 screen pixels: a pan or zoom changes it, a jitter does not.
  function viewKey(): string {
    const view = viewBox(), scale = zoom()
    return view ? [view.x, view.y, view.w, view.h].map(value => Math.round((value * scale) / 8)).join(':') : ''
  }
  function viewBox(): Box | null {
    const shown = shownBox()
    if (shown) return shown.view
    try {
      const box = slate.canvas.viewbox()
      if (box && [box.x, box.y, box.width, box.height].every((value: number) => Number.isFinite(value)) && box.width > 0 && box.height > 0)
        return { x: box.x, y: box.y, w: box.width, h: box.height }
    } catch { /* no canvas yet */ }
    return null
  }

  // With no target yet (a plan before the first save), the pointer waits in a corner of the view: the one whose tag
  // covers the fewest notes' words, its tag pointing inward. Several such agents stack down (or up) from it. With no
  // view box, above and left of the notes.
  function restingPoint(index: number, size: { w: number; h: number } = { w: CARD_WIDTH, h: 38 }, scale = 1, words: Box[] = []): { x: number; y: number; side: { right: boolean; down: boolean } | null } {
    const view = viewBox()
    if (view) {
      // The pointer's tip sits far enough in from a right or bottom edge that its chevron (14px) is seen whole.
      const m = 8 / scale, tip = 16 / scale, step = (index * 64) / scale
      const corners = [
        { x: view.x + m, y: view.y + m + step, side: { right: true, down: true } },
        { x: view.x + view.w - m - tip, y: view.y + m + step, side: { right: false, down: true } },
        { x: view.x + m, y: view.y + view.h - m - tip - step, side: { right: true, down: false } },
        { x: view.x + view.w - m - tip, y: view.y + view.h - m - tip - step, side: { right: false, down: false } },
      ]
      const notes = noteBoxes()
      let best = corners[0], bestScore = Infinity
      for (const corner of corners) {
        const score = sideScore(corner, size, scale, corner.side, view, [], notes, words)
        if (score <= 1e-9) return corner
        if (score < bestScore) { best = corner; bestScore = score }
      }
      return best
    }
    let x = Infinity, y = Infinity
    for (const node of slate.nodes?.allNodes ?? []) {
      const o = node?.options
      if (typeof o?.x === 'number' && typeof o?.y === 'number') { x = Math.min(x, o.x); y = Math.min(y, o.y) }
    }
    if (!Number.isFinite(x)) { x = 100; y = 100 }
    return { x: x - 40, y: y - 40 + index * 64, side: null }
  }

  function draw(item: Drawn, scale: number, compact: boolean) {
    const { record } = item
    const color = agentColor(record.colorIndex)
    const step = agentStepText(record)
    const lines = agentChecklist(record)
    const showList = lines.length > 0 && (item.open || !compact)
    const label = agentName(record)
    item.body?.remove()
    const body = item.group.group()
    item.body = body
    // The pointer chevron, its tip at the agent's point.
    body.path('M0 0 L14 5 L7 7 L5 14 Z').fill(color).stroke({ color: '#fff', width: 1.5 }).attr('stroke-linejoin', 'round')
    // The hexagon avatar with the owner's initial and a small spark.
    const hex = body.group().attr('data-agent-avatar', '')
    const r = 11, cx = 24, cy = 24
    hex.polygon(hexPoints(cx, cy, r)).fill(color).stroke({ color: '#fff', width: 1.5 })
    const icon = safeIconUrl(record.iconUrl)
    if (icon) {
      // An invited agent's own icon, inside the hexagon (the host proxied it); the hexagon still says "agent".
      const round = hex.clip()
      round.add(hex.circle(14).center(cx, cy))
      hex.image(icon).size(14, 14).move(cx - 7, cy - 7).attr({ 'data-agent-icon': '', preserveAspectRatio: 'xMidYMid slice' }).clipWith(round)
    } else {
      hex.text((t: any) => t.plain(clip(plainLine(record.initial).toUpperCase(), 1) || '?'))
        .font({ size: 12, weight: 700, family: 'Roboto, Helvetica, Arial, sans-serif', anchor: 'middle' })
        .fill('#fff').attr({ x: cx, y: cy + 4 })
    }
    hex.path('M35 10 L36.5 13.5 L40 15 L36.5 16.5 L35 20 L33.5 16.5 L30 15 L33.5 13.5 Z').fill('#fde68a').stroke({ color, width: 0.8 })
    // The tag: who, and what it is doing now. Tapping it opens or closes the checklist.
    const tag = body.group().attr({ 'data-agent-tag': '', 'pointer-events': 'all', cursor: lines.length ? 'pointer' : 'default', role: 'button',
      tabindex: lines.length ? 0 : -1, 'aria-expanded': String(showList), 'aria-label': label + (step ? ': ' + step : '') })
    const stepLine = step ? clip(step, 40) : ''
    const size = blockSize(record, showList)
    const { width, height } = size
    // The tag and its list go on the side of the pointer that keeps them in view and off the
    // words of the notes it works on (routeTo chose the corner for that), and, with no note to
    // point at, of every other note.
    const resting = item.path.length ? item.path[item.path.length - 1] : { x: item.x, y: item.y }
    const view = viewBox()
    // Only for a pointer that is itself on screen: an agent at a note the camera is not showing keeps its tag beside it,
    // on the side away from the view, so no part of it is cut by the view's edge.
    const pointerShown = view && resting.x >= view.x && resting.x <= view.x + view.w && resting.y >= view.y && resting.y <= view.y + view.h
    let side = item.routedSide ?? agentTagSide(resting, size, scale, view, [], noteBoxes(), wordBoxes(record.agentKey))
    if (view && !pointerShown) {
      const sides = [side, { right: !side.right, down: side.down }, { right: side.right, down: !side.down }, { right: !side.right, down: !side.down }]
      side = sides.reduce((best, next) => overlap(agentTagBox(resting, size, scale, next), view) < overlap(agentTagBox(resting, size, scale, best), view) ? next : best)
    }
    let left = side.right ? TAG_DX : -(TAG_DX + size.w)
    let top = side.down ? TAG_DY : -(TAG_DY + size.h)
    // When no side keeps the whole tag on screen (a phone framing a note edge to edge), the tag slides back inside the
    // view: its words are never cut off, even if it then sits beside the pointer rather than off its corner.
    if (view && pointerShown) {
      const m = 4, at = resting
      const x0 = (view.x - at.x) * scale + m, x1 = (view.x + view.w - at.x) * scale - m
      const y0 = (view.y - at.y) * scale + m, y1 = (view.y + view.h - at.y) * scale - m
      if (size.w <= x1 - x0) left = Math.min(Math.max(left, x0), x1 - size.w)
      if (size.h <= y1 - y0) top = Math.min(Math.max(top, y0), y1 - size.h)
    }
    item.side = side
    // The avatar goes to the same side as its tag, unless that side of the pointer is past the edge of the view.
    let avatarRight = side.right, avatarDown = side.down
    if (view && pointerShown) {
      // The hexagon and the spark beside it reach 40px from the pointer.
      const reach = 42 / scale
      if (avatarRight && resting.x + reach > view.x + view.w) avatarRight = false
      else if (!avatarRight && resting.x - reach < view.x) avatarRight = true
      if (avatarDown && resting.y + reach > view.y + view.h) avatarDown = false
      else if (!avatarDown && resting.y - reach < view.y) avatarDown = true
    }
    if (!avatarRight || !avatarDown) hex.attr('transform', `translate(${avatarRight ? 0 : -2 * cx} ${avatarDown ? 0 : -2 * cy})`)
    tag.attr('data-agent-side', (side.right ? 'right' : 'left') + '-' + (side.down ? 'down' : 'up'))
    tag.rect(width, height).radius(7).move(left, top).fill('#fff').stroke({ color, width: 1.5 })
    tag.text((t: any) => t.plain(label)).font({ size: 12, weight: 600, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill(color).attr({ x: left + 8, y: top + 15 })
    if (stepLine) tag.text((t: any) => t.plain(stepLine)).font({ size: 12, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill('#374151').attr({ x: left + 8, y: top + 32 })
    const toggle = (event: Event) => { event.stopPropagation?.(); api.expand(record.agentKey) }
    tag.on('pointerdown', (event: Event) => event.stopPropagation?.())
    tag.on('click', toggle)
    tag.on('keydown', (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault?.(); toggle(event) } })
    // The plan, as a compact card under the tag.
    if (showList) {
      const card = body.group().attr('data-agent-plan', '')
      const rows = lines.length
      card.rect(CARD_WIDTH, 12 + rows * 18).radius(8).move(left, top + height + 6).fill('#ffffff').stroke({ color: '#d1d5db', width: 1 }).attr('fill-opacity', 0.97)
      lines.forEach((line, index) => {
        const status = record.plan!.steps[index].status
        const row = card.text((t: any) => t.plain(clip(line, 38)))
          .font({ size: 12, family: 'Roboto, Helvetica, Arial, sans-serif', weight: status === 'doing' ? 600 : 400 })
          .fill(status === 'done' || status === 'skipped' ? '#6b7280' : '#111827')
          .attr({ x: left + 10, y: top + height + 6 + 20 + index * 18 })
        row.attr('data-step-status', status)
      })
    }
    // What the agent says now, in a bubble over its pointer (a short status line for a few seconds).
    const saying = agentSaying(record, now())
    if (saying) {
      const words = clip(saying, 60)
      const w = Math.max(48, Math.min(260, 16 + 6.6 * words.length)), h = 24
      // Away from the tag: over the pointer when the tag hangs below it, under the avatar when the tag is above.
      const bx = avatarRight ? 8 : -8 - w, by = side.down ? -h - 14 : 46
      const bubble = body.group().attr({ 'data-agent-say': '', role: 'status', 'aria-label': label + ' says: ' + words })
      bubble.rect(w, h).radius(12).move(bx, by).fill('#ffffff').stroke({ color, width: 1.5 })
      const tailX = avatarRight ? bx + 14 : bx + w - 14
      if (side.down) {
        bubble.path(`M${tailX - 5} ${by + h - 0.5} L${tailX} ${by + h + 7} L${tailX + 5} ${by + h - 0.5} Z`).fill('#ffffff').stroke({ color, width: 1.5 })
        bubble.rect(12, 3).move(tailX - 6, by + h - 2).fill('#ffffff')
      }
      bubble.text((t: any) => t.plain(words)).font({ size: 12, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill('#111827').attr({ x: bx + 8, y: by + 16 })
    }
    body.element('title').words(label + (step ? ' — ' + step : ''))
    item.compact = compact
    item.lines = lines
    item.step = step
    item.group.transform({ translateX: item.x, translateY: item.y, scale: 1 / scale, originX: 0, originY: 0 })
    item.group.attr('opacity', item.opacity)
    lastScale = scale
  }

  function place(item: Drawn, scale: number) {
    item.group.transform({ translateX: item.x, translateY: item.y, scale: 1 / scale, originX: 0, originY: 0 })
    item.group.attr('opacity', item.opacity)
  }

  // The legs a pointer travels to a save's targets: one glide to a single target, or a short
  // visit to each of several (up to five), in order. Each leg ends inside a corner of its note,
  // the corner from which the tag points into view and off the note. `side` is the last leg's.
  function routeTo(record: AgentPresenceRecord, index: number, size: { w: number; h: number }, scale: number) {
    const view = viewBox()
    const all = noteBoxes(), words = wordBoxes(record.agentKey)
    const boxes = record.targets.map(id => boxOf(noteOf(id))).filter((box): box is Box => Boolean(box))
    const anchors = boxes.slice(0, AGENT_MAX_VISITS).map(box => agentAnchor(box, size, scale, view, all.filter(other => !sameBox(other, box)), words))
    // An empty spot first (where a suggestion is about to land), then its notes: one beat each.
    const spot = pointOf(record)
    if (!anchors.length) {
      if (spot) return { legs: [{ x: spot.x, y: spot.y, ms: AGENT_GLIDE_MS }], side: agentTagSide(spot, size, scale, view, [], all, words) }
      const point = restingPoint(index, size, scale, words)
      return { legs: [{ x: point.x, y: point.y, ms: AGENT_GLIDE_MS }], side: point.side }
    }
    const ms = anchors.length === 1 && !spot ? AGENT_GLIDE_MS : AGENT_BEAT_MS
    const legs = anchors.map(anchor => ({ x: anchor.x, y: anchor.y, ms }))
    if (spot) legs.unshift({ x: spot.x, y: spot.y, ms: AGENT_BEAT_MS })
    return { legs, side: anchors[anchors.length - 1].side }
  }

  const targetsFound = (record: AgentPresenceRecord) => record.targets.some(id => centreOf(id) !== null)
  // The record's empty spot, when it names a finite one.
  const pointOf = (record: AgentPresenceRecord) => {
    const p = record.point
    return p && Number.isFinite(p.x) && Number.isFinite(p.y) ? { x: Number(p.x), y: Number(p.y) } : null
  }
  // What the pointer is routed by: its targets and its spot.
  const routeKey = (record: AgentPresenceRecord) => {
    const p = pointOf(record)
    return record.targets.join('\u0000') + (p ? '@' + p.x + ',' + p.y : '')
  }

  const ease = (t: number) => 1 - Math.pow(1 - t, 3)

  // Moves each pointer along its legs; true while any is still travelling.
  function travel(at: number): boolean {
    let moving = false
    for (const item of drawn.values()) {
      while (item.path.length) {
        const target = item.path[0]
        if (reduced() || target.ms <= 0) { item.x = target.x; item.y = target.y; item.path.shift(); item.leg = null; continue }
        if (!item.leg) item.leg = { fromX: item.x, fromY: item.y, startedAt: at }
        const t = Math.min(1, (at - item.leg.startedAt) / target.ms)
        const k = ease(t)
        item.x = item.leg.fromX + (target.x - item.leg.fromX) * k
        item.y = item.leg.fromY + (target.y - item.leg.fromY) * k
        if (t < 1) { moving = true; break }
        item.path.shift()
        item.leg = item.path.length ? { fromX: item.x, fromY: item.y, startedAt: at } : null
      }
    }
    return moving
  }

  // Agents working out of view: a marker at the view's edge, toward each, that brings the view there.
  const markers = new Map<string, { group: any; words: string; arrow: string }>()
  const restingOf = (item: Drawn) => (item.path.length ? item.path[item.path.length - 1] : { x: item.x, y: item.y })
  const offView = (point: { x: number; y: number }, view: Box | null) =>
    Boolean(view) && !(point.x >= view!.x && point.x <= view!.x + view!.w && point.y >= view!.y && point.y <= view!.y + view!.h)
  function arrowFor(point: { x: number; y: number }, view: Box): string {
    const dx = point.x < view.x ? -1 : point.x > view.x + view.w ? 1 : 0
    const dy = point.y < view.y ? -1 : point.y > view.y + view.h ? 1 : 0
    return ({ '-1,-1': '↖', '0,-1': '↑', '1,-1': '↗', '-1,0': '←', '1,0': '→', '-1,1': '↙', '0,1': '↓', '1,1': '↘' } as Record<string, string>)[`${dx},${dy}`] || '→'
  }
  function goTo(point: { x: number; y: number }, agentKey: string) {
    if (options.goTo) return options.goTo(point, agentKey)
    try {
      slate.camera?.flyTo?.({ state: { cx: point.x, cy: point.y } }, { reduced: reduced() })?.catch?.(() => {})
    } catch { /* no camera: nothing to move */ }
  }
  function drawMarkers(scale: number) {
    const view = viewBox()
    const keep = new Set<string>()
    for (const item of drawn.values()) {
      const at = restingOf(item)
      if (!view || item.opacity <= 0 || !offView(at, view)) continue
      keep.add(item.key)
      const label = clip(agentName(item.record), 32)
      const arrow = arrowFor(at, view)
      const words = `${label} is working`
      let marker = markers.get(item.key)
      if (!marker || marker.words !== words || marker.arrow !== arrow) {
        marker?.group.remove()
        const color = agentColor(item.record.colorIndex)
        const leftArrow = arrow === '←' || arrow === '↖' || arrow === '↙'
        const text = leftArrow ? `${arrow} ${words}` : `${words} ${arrow}`
        const group = ensureLayer().group().attr({ 'data-agent-edge': item.key, 'pointer-events': 'all', cursor: 'pointer', role: 'button', tabindex: 0,
          'aria-label': `${words} out of view. Show where.` })
        const width = Math.round(20 + 7 * text.length)
        group.rect(width, 26).radius(13).fill('#ffffff').stroke({ color, width: 1.5 }).attr('fill-opacity', 0.97)
        group.text((t: any) => t.plain(text)).font({ size: 12, weight: 600, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill(color).attr({ x: 10, y: 17 })
        const go = (event: Event) => { event.stopPropagation?.(); goTo(restingOf(drawn.get(item.key) ?? item), item.key) }
        group.on('pointerdown', (event: Event) => event.stopPropagation?.())
        group.on('click', go)
        group.on('keydown', (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault?.(); go(event) } })
        marker = { group, words, arrow }
        ;(marker as any).width = width
        markers.set(item.key, marker)
      }
      // Inside the view, on the edge toward the agent, a little in from it; several stack.
      const m = 12 / scale
      const w = ((marker as any).width as number) / scale, h = 26 / scale
      const stack = [...keep].indexOf(item.key) * (32 / scale)
      const x = Math.min(Math.max(at.x - w / 2, view.x + m), view.x + view.w - w - m)
      const y = Math.min(Math.max(at.y - h / 2 + stack, view.y + m), view.y + view.h - h - m)
      marker.group.transform({ translateX: x, translateY: y, scale: 1 / scale, originX: 0, originY: 0 })
    }
    for (const [key, marker] of markers) if (!keep.has(key)) { marker.group.remove(); markers.delete(key) }
  }

  function render() {
    if (destroyed) return
    const at = now()
    const shown = visibleAgents(records, at, { holdMs, fadeMs, max })
    const keep = new Set(shown.map(item => item.record.agentKey))
    for (const [key, item] of drawn) if (!keep.has(key)) { item.group.remove(); drawn.delete(key) }
    if (!shown.length) { for (const marker of markers.values()) marker.group.remove(); markers.clear(); schedule(null); return }
    const group = ensureLayer()
    group.front?.()
    const scale = zoom()
    const compact = shown.length >= 2 || screenWidth() < NARROW
    shown.forEach(({ record, opacity }, index) => {
      let item = drawn.get(record.agentKey)
      const targetsKey = routeKey(record)
      const open = opened.has(record.agentKey)
      const size = blockSize(record, agentChecklist(record).length > 0 && (open || !compact))
      // A tag that grew (a list opened, a longer step) or a new zoom may need another corner.
      // A pan or zoom moves what is on screen: the corner and side are chosen again for the view as it is now.
      const routedFor = [size.w, size.h, scale.toFixed(4), viewKey(), notesKey(), labelsKey()].join(',')
      if (!item) {
        const route = routeTo(record, index, size, scale)
        const first = route.legs[0]
        item = { key: record.agentKey, group: group.group().attr({ 'data-agent': record.agentKey }), body: null, record, targetsKey,
          found: targetsFound(record), x: first.x, y: first.y, path: route.legs.slice(1), leg: null, open, opacity, compact, lines: [], step: null,
          routedSide: route.side, routedFor }
        drawn.set(record.agentKey, item)
      } else if (item.targetsKey !== targetsKey || (!item.found && targetsFound(record))) {
        const route = routeTo(record, index, size, scale)
        item.path = route.legs
        item.leg = null
        item.found = targetsFound(record)
        item.routedSide = route.side
        item.routedFor = routedFor
      } else if (item.routedFor !== routedFor && item.found) {
        // Same notes: go to the corner that suits the tag as it is now (only the last one matters).
        const route = routeTo(record, index, size, scale)
        const last = route.legs[route.legs.length - 1]
        const at = item.path.length ? item.path[item.path.length - 1] : { x: item.x, y: item.y }
        if (last.x !== at.x || last.y !== at.y) { item.path = [{ ...last, ms: AGENT_GLIDE_MS }]; item.leg = null }
        item.routedSide = route.side
        item.routedFor = routedFor
      }
      item.targetsKey = targetsKey
      item.record = record
      item.opacity = Math.max(0, Math.min(1, opacity))
      item.open = opened.has(record.agentKey)
      draw(item, scale, compact)
    })
    // Keep moving, fading and expiring on the agents' own clock.
    const moving = travel(at)
    for (const item of drawn.values()) place(item, scale)
    drawMarkers(scale)
    const fading = shown.some(item => item.opacity < 1)
    // A bubble ends on its own time too.
    const bubbles = shown.map(item => (agentSaying(item.record, at) ? (time(item.record.sayAt ?? null) ?? at) + AGENT_SAY_MS : Infinity))
    const nextChange = Math.min(...bubbles, ...shown.map(item => item.record.status === 'live' && time(item.record.endedAt) === null
      ? item.until : (time(item.record.endedAt) ?? time(item.record.updatedAt) ?? at) + holdMs))
    schedule(moving || fading ? 'frame' : Math.max(16, nextChange - at))
  }

  function tick() {
    frame = null
    if (destroyed) return
    const at = now()
    const moving = travel(at)
    const scale = zoom()
    const shown = visibleAgents(records, at, { holdMs, fadeMs, max })
    const fading = shown.some(item => item.opacity < 1) || drawn.size !== shown.length
    if (fading || Math.abs(scale - lastScale) > 1e-6) { render(); return }
    for (const item of drawn.values()) place(item, scale)
    if (!moving) drawMarkers(scale)
    if (moving) schedule('frame')
  }

  function schedule(when: 'frame' | number | null) {
    if (frame !== null) { cancelAnimationFrame(frame); frame = null }
    if (timer !== null) { clearTimeout(timer); timer = null }
    if (when === null || destroyed) return
    if (when === 'frame') frame = requestAnimationFrame(tick)
    else timer = setTimeout(render, Math.min(when, 60000))
  }

  // Follow the view: a pan or zoom re-scales the tags and chooses their side again. Cheap: it only runs while an agent is drawn.
  let watch: ReturnType<typeof setInterval> | null = null
  const watchZoom = () => {
    if (watch !== null) return
    let lastView = viewKey(), lastNotes = notesKey(), settledNotes = lastNotes, lastLabels = labelsKey()
    watch = setInterval(() => {
      if (destroyed || !drawn.size) return
      const view = viewKey(), notes = notesKey(), labels = labelsKey()
      // Notes that moved under a tag (a card someone dropped there) count once they have stayed put for a beat, so a
      // drag in progress does not send the pointer from corner to corner.
      const notesSettled = notes === lastNotes && notes !== settledNotes
      lastNotes = notes
      if (Math.abs(zoom() - lastScale) > 1e-6 || view !== lastView || notesSettled || labels !== lastLabels) { lastView = view; settledNotes = notes; lastLabels = labels; render() }
    }, 250)
  }

  const api: AgentPresence = {
    set(next) {
      if (destroyed) return
      records = Array.isArray(next) ? next.filter(record => record && typeof record.agentKey === 'string') : []
      render()
      watchZoom()
    },
    expand(agentKey, open) {
      const now = open ?? !opened.has(agentKey)
      if (now) opened.add(agentKey)
      else opened.delete(agentKey)
      options.onToggle?.(agentKey, now)
      render()
    },
    shown() {
      return [...drawn.values()].map(item => ({ agentKey: item.key, label: item.record.label, step: item.step, x: item.x, y: item.y,
        opacity: item.opacity, compact: item.compact, lines: item.lines, side: item.side ?? { right: true, down: true }, offscreen: markers.has(item.key) }))
    },
    destroy() {
      destroyed = true
      schedule(null)
      if (watch !== null) clearInterval(watch)
      for (const item of drawn.values()) item.group.remove()
      drawn.clear()
      markers.clear()
      layer?.remove()
      layer = null
    },
  }
  return api
}
