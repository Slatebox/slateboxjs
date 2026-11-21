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
  AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, agentChecklist, agentStepText, clip, plainLine, time, visibleAgents,
  type AgentPresenceRecord, type AgentStepStatus,
} from './agentPresenceText'

export { AGENT_FADE_MS, AGENT_HOLD_MS, AGENT_MAX_DRAWN, AGENT_PALETTE, agentChecklist, agentStepText, visibleAgents, type AgentPresenceRecord, type AgentStepStatus }

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
}

export interface AgentPresence {
  set(records: AgentPresenceRecord[]): void
  /** Open or close an agent's full checklist (the tag does this when tapped). */
  expand(agentKey: string, open?: boolean): void
  /** What is drawn now, for hosts and tests. */
  shown(): { agentKey: string; label: string; step: string | null; x: number; y: number; opacity: number; compact: boolean; lines: string[]; side: { right: boolean; down: boolean } }[]
  destroy(): void
}

export const AGENT_GLIDE_MS = 400
export const AGENT_VISIT_MS = 250
export const AGENT_MAX_VISITS = 5
const CARD_WIDTH = 240
const NARROW = 600
/** Where the tag starts from the pointer's tip, in screen pixels (past the avatar). */
const TAG_DX = 40
const TAG_DY = 30


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

interface Box { x: number; y: number; w: number; h: number }
const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))

/**
 * Which side of its pointer an agent's tag (and open checklist) goes: right and down unless that
 * leaves the view or covers words. Tried in order: right-down, left-down, right-up, left-up; the
 * first that stays in view and covers no target note wins, else the one that covers least (a
 * target note's words count three times another note's, and anything off screen counts most).
 * `at` is the pointer, `size` the tag block in screen pixels, `scale` screen pixels per world unit.
 */
export function agentTagSide(at: { x: number; y: number }, size: { w: number; h: number }, scale: number, view: Box | null, targets: Box[], others: Box[] = []): { right: boolean; down: boolean } {
  const sides = [{ right: true, down: true }, { right: false, down: true }, { right: true, down: false }, { right: false, down: false }]
  let best = sides[0], bestScore = Infinity
  for (const side of sides) {
    const score = tagScore(agentTagBox(at, size, scale, side), view, targets, others)
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

/** The tag block an agent draws, in screen pixels: its tag, and its checklist when that shows. */
function blockSize(record: AgentPresenceRecord, showList: boolean) {
  const label = clip(plainLine(record.label), 48)
  const step = agentStepText(record)
  const stepLine = step ? clip(step, 40) : ''
  // Bold 12px words take about 7px a letter, the 11px step about 6.3px: the tag is wide enough for both.
  const width = Math.max(96, Math.min(CARD_WIDTH, 16 + Math.max(7 * label.length, 6.3 * stepLine.length)))
  const height = stepLine ? 38 : 22
  const rows = showList ? (record.plan?.steps ?? []).length : 0
  return { width, height, w: Math.max(width, rows ? CARD_WIDTH : 0), h: height + (rows ? 6 + 12 + rows * 18 : 0) }
}

/**
 * Where on a target note the pointer goes, and which way its tag points from there: inside one
 * of the note's corners, with the tag outward from that corner. Lower right first; the first
 * corner whose tag stays in view and off the note (and, where it can, off other notes) wins,
 * else the one that covers least.
 */
export function agentAnchor(note: Box, size: { w: number; h: number }, scale: number, view: Box | null, others: Box[] = []): { x: number; y: number; side: { right: boolean; down: boolean } } {
  const inset = Math.min(8, note.w / 4, note.h / 4)
  const corners = [
    { x: note.x + note.w - inset, y: note.y + note.h - inset, side: { right: true, down: true } },
    { x: note.x + inset, y: note.y + note.h - inset, side: { right: false, down: true } },
    { x: note.x + note.w - inset, y: note.y + inset, side: { right: true, down: false } },
    { x: note.x + inset, y: note.y + inset, side: { right: false, down: false } },
  ]
  let best = corners[0], bestScore = Infinity
  for (const corner of corners) {
    const score = tagScore(agentTagBox(corner, size, scale, corner.side), view, [note], others)
    if (score <= 1e-9) return corner
    if (score < bestScore) { best = corner; bestScore = score }
  }
  return best
}

function tagScore(box: Box, view: Box | null, targets: Box[], others: Box[]) {
  const outside = view ? box.w * box.h - overlap(box, view) : 0
  return outside * 10 + targets.reduce((sum, target) => sum + overlap(box, target), 0) * 3 + others.reduce((sum, other) => sum + overlap(box, other), 0)
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
    layer.attr({ 'data-agent-presence': '', 'pointer-events': 'none' })
    return layer
  }

  // Screen pixels per world unit: the container's width over the view box's.
  // What the canvas shows: its view box as the element fits it (preserveAspectRatio: "slice" crops the longer side,
  // "meet" or none adds room around it), and screen pixels per world unit. Null when the canvas has no size yet.
  function shownBox(): { view: Box; scale: number } | null {
    try {
      const box = slate.canvas.viewbox()
      const rect = slate.canvas.node?.getBoundingClientRect?.()
      if (!box?.width || !box?.height || !rect?.width || !rect?.height) return null
      const fit = String(slate.canvas.node?.getAttribute?.('preserveAspectRatio') || 'xMidYMid meet')
      const sx = rect.width / box.width, sy = rect.height / box.height
      const scale = fit === 'none' ? sx : /slice/.test(fit) ? Math.max(sx, sy) : Math.min(sx, sy)
      const w = rect.width / scale, h = rect.height / scale
      return { view: { x: box.x + (box.width - w) / 2, y: box.y + (box.height - h) / 2, w, h }, scale }
    } catch { return null }
  }
  function zoom(): number {
    const shown = shownBox()
    if (shown) return shown.scale
    try {
      const z = slate.getZoom?.()
      if (typeof z === 'number' && z > 0) return z
    } catch { /* no pan-zoom yet */ }
    return 1
  }
  const screenWidth = () => {
    try { return slate.canvas.node?.getBoundingClientRect?.().width || (typeof window !== 'undefined' ? window.innerWidth : 1024) } catch { return 1024 }
  }

  // Where a target is drawn: the centre of its note. Workshop cards and lanes are notes named card-<id> and lane-<id>.
  function centreOf(id: string): { x: number; y: number } | null {
    const node = slate.nodes?.one?.(id) ?? slate.nodes?.allNodes?.find?.((n: any) => n?.options?.name === id)
    const o = node?.options
    if (!o || typeof o.x !== 'number' || typeof o.y !== 'number') return null
    return { x: o.x + (o.width || 0) / 2, y: o.y + (o.height || 0) / 2 }
  }
  // A note's box in world units, or null.
  function boxOf(node: any): Box | null {
    const o = node?.options
    if (!o || ![o.x, o.y, o.width, o.height].every(value => typeof value === 'number' && Number.isFinite(value))) return null
    return { x: o.x, y: o.y, w: o.width, h: o.height }
  }
  const noteOf = (id: string) => slate.nodes?.one?.(id) ?? slate.nodes?.allNodes?.find?.((n: any) => n?.options?.name === id)
  const noteBoxes = (): Box[] => (slate.nodes?.allNodes ?? []).map(boxOf).filter((box: Box | null): box is Box => Boolean(box))
  const sameBox = (a: Box, b: Box) => a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h

  // Where the notes are, as a key: a note that moved or changed size changes it.
  function notesKey(): string {
    return noteBoxes().map(box => [box.x, box.y, box.w, box.h].map(Math.round).join(',')).join(';')
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
  function restingPoint(index: number, size: { w: number; h: number } = { w: CARD_WIDTH, h: 38 }, scale = 1): { x: number; y: number; side: { right: boolean; down: boolean } | null } {
    const view = viewBox()
    if (view) {
      const m = 8 / scale, step = (index * 64) / scale
      const corners = [
        { x: view.x + m, y: view.y + m + step, side: { right: true, down: true } },
        { x: view.x + view.w - m, y: view.y + m + step, side: { right: false, down: true } },
        { x: view.x + m, y: view.y + view.h - m - step, side: { right: true, down: false } },
        { x: view.x + view.w - m, y: view.y + view.h - m - step, side: { right: false, down: false } },
      ]
      const notes = noteBoxes()
      let best = corners[0], bestScore = Infinity
      for (const corner of corners) {
        const score = tagScore(agentTagBox(corner, size, scale, corner.side), view, [], notes)
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
    const color = AGENT_PALETTE[((record.colorIndex % AGENT_PALETTE.length) + AGENT_PALETTE.length) % AGENT_PALETTE.length]
    const step = agentStepText(record)
    const lines = agentChecklist(record)
    const showList = lines.length > 0 && (item.open || !compact)
    const label = clip(plainLine(record.label), 48)
    item.body?.remove()
    const body = item.group.group()
    item.body = body
    // The pointer chevron, its tip at the agent's point.
    body.path('M0 0 L14 5 L7 7 L5 14 Z').fill(color).stroke({ color: '#fff', width: 1.5 }).attr('stroke-linejoin', 'round')
    // The hexagon avatar with the owner's initial and a small spark.
    const hex = body.group().attr('data-agent-avatar', '')
    const r = 11, cx = 24, cy = 24
    const points = Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI / 6 + (i * Math.PI) / 3
      return (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2)
    }).join(' ')
    hex.polygon(points).fill(color).stroke({ color: '#fff', width: 1.5 })
    hex.text((t: any) => t.plain(clip(plainLine(record.initial).toUpperCase(), 1) || '?'))
      .font({ size: 11, weight: 700, family: 'Roboto, Helvetica, Arial, sans-serif', anchor: 'middle' })
      .fill('#fff').attr({ x: cx, y: cy + 4 })
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
    const side = item.routedSide ?? agentTagSide(resting, size, scale, viewBox(), [], noteBoxes())
    const left = side.right ? TAG_DX : -(TAG_DX + size.w)
    const top = side.down ? TAG_DY : -(TAG_DY + size.h)
    item.side = side
    // The avatar goes to the same side as its tag.
    if (!side.right || !side.down) hex.attr('transform', `translate(${side.right ? 0 : -2 * cx} ${side.down ? 0 : -2 * cy})`)
    tag.attr('data-agent-side', (side.right ? 'right' : 'left') + '-' + (side.down ? 'down' : 'up'))
    tag.rect(width, height).radius(7).move(left, top).fill('#fff').stroke({ color, width: 1.5 })
    tag.text((t: any) => t.plain(label)).font({ size: 12, weight: 600, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill(color).attr({ x: left + 8, y: top + 15 })
    if (stepLine) tag.text((t: any) => t.plain(stepLine)).font({ size: 11, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill('#374151').attr({ x: left + 8, y: top + 31 })
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
    const all = noteBoxes()
    const boxes = record.targets.map(id => boxOf(noteOf(id))).filter((box): box is Box => Boolean(box))
    const anchors = boxes.slice(0, AGENT_MAX_VISITS).map(box => agentAnchor(box, size, scale, view, all.filter(other => !sameBox(other, box))))
    if (!anchors.length) {
      const point = restingPoint(index, size, scale)
      return { legs: [{ x: point.x, y: point.y, ms: AGENT_GLIDE_MS }], side: point.side }
    }
    const ms = anchors.length === 1 ? AGENT_GLIDE_MS : AGENT_VISIT_MS
    return { legs: anchors.map(anchor => ({ x: anchor.x, y: anchor.y, ms })), side: anchors[anchors.length - 1].side }
  }

  const targetsFound = (record: AgentPresenceRecord) => record.targets.some(id => centreOf(id) !== null)

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

  function render() {
    if (destroyed) return
    const at = now()
    const shown = visibleAgents(records, at, { holdMs, fadeMs, max })
    const keep = new Set(shown.map(item => item.record.agentKey))
    for (const [key, item] of drawn) if (!keep.has(key)) { item.group.remove(); drawn.delete(key) }
    if (!shown.length) { schedule(null); return }
    const group = ensureLayer()
    group.front?.()
    const scale = zoom()
    const compact = shown.length >= 2 || screenWidth() < NARROW
    shown.forEach(({ record, opacity }, index) => {
      let item = drawn.get(record.agentKey)
      const targetsKey = record.targets.join('\u0000')
      const open = opened.has(record.agentKey)
      const size = blockSize(record, agentChecklist(record).length > 0 && (open || !compact))
      // A tag that grew (a list opened, a longer step) or a new zoom may need another corner.
      // A pan or zoom moves what is on screen: the corner and side are chosen again for the view as it is now.
      const routedFor = [size.w, size.h, scale.toFixed(4), viewKey(), notesKey()].join(',')
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
    const fading = shown.some(item => item.opacity < 1)
    const nextChange = Math.min(...shown.map(item => item.record.status === 'live' && time(item.record.endedAt) === null
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
    let lastView = viewKey(), lastNotes = notesKey(), settledNotes = lastNotes
    watch = setInterval(() => {
      if (destroyed || !drawn.size) return
      const view = viewKey(), notes = notesKey()
      // Notes that moved under a tag (a card someone dropped there) count once they have stayed put for a beat, so a
      // drag in progress does not send the pointer from corner to corner.
      const notesSettled = notes === lastNotes && notes !== settledNotes
      lastNotes = notes
      if (Math.abs(zoom() - lastScale) > 1e-6 || view !== lastView || notesSettled) { lastView = view; settledNotes = notes; render() }
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
        opacity: item.opacity, compact: item.compact, lines: item.lines, side: item.side ?? { right: true, down: true } }))
    },
    destroy() {
      destroyed = true
      schedule(null)
      if (watch !== null) clearInterval(watch)
      for (const item of drawn.values()) item.group.remove()
      drawn.clear()
      layer?.remove()
      layer = null
    },
  }
  return api
}
