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

import { prefersReducedMotion } from './DragPolicy'

export type AgentStepStatus = 'todo' | 'doing' | 'done' | 'skipped' | 'stopped'

export interface AgentPresenceRecord {
  /** Stable per token and slate; never a token id. */
  agentKey: string
  /** "Ada's agent" or "Ada's agent · Client name". */
  label: string
  initial: string
  colorIndex: number
  /** Note ids, or card-<id> / lane-<id> for a workshop. */
  targets: string[]
  plan?: { steps: { text: string; status: AgentStepStatus }[]; current: number } | null
  /** What the run is doing when it sent no plan (the save's message). */
  message?: string | null
  status: 'live' | 'done' | 'stopped'
  updatedAt: number | string | Date
  endedAt?: number | string | Date | null
  expiresAt: number | string | Date
}

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
  shown(): { agentKey: string; label: string; step: string | null; x: number; y: number; opacity: number; compact: boolean; lines: string[] }[]
  destroy(): void
}

/** Agent colours. People's colours never use these; the shape, not only the colour, says "agent". */
export const AGENT_PALETTE: readonly string[] = Object.freeze(['#6d28d9', '#0f766e', '#a16207', '#be185d', '#1d4ed8', '#4d7c0f'])

export const AGENT_GLIDE_MS = 400
export const AGENT_VISIT_MS = 250
export const AGENT_MAX_VISITS = 5
export const AGENT_HOLD_MS = 6000
export const AGENT_FADE_MS = 600
export const AGENT_MAX_DRAWN = 6
const CARD_WIDTH = 240
const NARROW = 600

const GLYPH: Record<AgentStepStatus, string> = { todo: '○', doing: '◌', done: '✓', skipped: '–', stopped: '■' }

const time = (value: number | string | Date | null | undefined): number | null => {
  if (value === null || value === undefined) return null
  const ms = value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value)
  return Number.isFinite(ms) ? ms : null
}

const clip = (text: string, max: number) => (text.length > max ? text.slice(0, max - 1).trimEnd() + '…' : text)
/** Text as it is drawn: one line of plain characters (the server cleans it; this keeps the canvas safe anyway). */
const plainLine = (text: unknown) => String(text ?? '').replace(/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u180e\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g, '').replace(/\s+/g, ' ').trim()

/** The step a tag shows: the plan's current step, or the save's message when there is no plan. */
export function agentStepText(record: AgentPresenceRecord): string | null {
  const steps = record.plan?.steps ?? []
  if (steps.length) {
    const doing = steps.findIndex(step => step.status === 'doing')
    const stopped = steps.findIndex(step => step.status === 'stopped')
    if (stopped >= 0) return 'Stopped: ' + plainLine(steps[stopped].text)
    if (steps.every(item => item.status === 'done' || item.status === 'skipped')) return 'Done'
    const index = doing >= 0 ? doing : Math.min(Math.max(record.plan!.current ?? 0, 0), steps.length - 1)
    return plainLine(steps[index].text)
  }
  const message = plainLine(record.message ?? '')
  return message || null
}

/** The checklist lines a record shows, each with its glyph. */
export function agentChecklist(record: AgentPresenceRecord): string[] {
  return (record.plan?.steps ?? []).map(step => GLYPH[step.status] + ' ' + (step.status === 'stopped' ? 'Stopped: ' : '') + plainLine(step.text))
}

/**
 * Which records are drawn at `now`, and how: a live record until it expires (a run that went
 * silent), an ended one for holdMs and then fading for fadeMs. At most `max`, newest first.
 */
export function visibleAgents(records: AgentPresenceRecord[], now: number, { holdMs = AGENT_HOLD_MS, fadeMs = AGENT_FADE_MS, max = AGENT_MAX_DRAWN } = {}) {
  const out: { record: AgentPresenceRecord; opacity: number; until: number }[] = []
  for (const record of records) {
    if (!record || typeof record.agentKey !== 'string') continue
    const expires = time(record.expiresAt)
    const ended = time(record.endedAt)
    if (record.status === 'live' && ended === null) {
      if (expires === null || now >= expires) continue
      out.push({ record, opacity: 1, until: expires })
      continue
    }
    const end = ended ?? time(record.updatedAt) ?? now
    const fadeAt = end + holdMs
    if (now >= fadeAt + fadeMs) continue
    out.push({ record, opacity: now <= fadeAt ? 1 : 1 - (now - fadeAt) / fadeMs, until: fadeAt + fadeMs })
  }
  out.sort((a, b) => (time(b.record.updatedAt) ?? 0) - (time(a.record.updatedAt) ?? 0))
  return out.slice(0, max)
}

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
  function zoom(): number {
    try {
      const box = slate.canvas.viewbox()
      const width = slate.canvas.node?.getBoundingClientRect?.().width || 0
      if (box?.width && width) return width / box.width
    } catch { /* jsdom or a detached canvas */ }
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
  // With no target yet (a plan before the first save), the pointer waits at the top left of the notes.
  function restingPoint(index: number): { x: number; y: number } {
    let x = Infinity, y = Infinity
    for (const node of slate.nodes?.allNodes ?? []) {
      const o = node?.options
      if (typeof o?.x === 'number' && typeof o?.y === 'number') { x = Math.min(x, o.x); y = Math.min(y, o.y) }
    }
    if (!Number.isFinite(x)) {
      try { const box = slate.canvas.viewbox(); x = box.x + box.width * 0.25; y = box.y + box.height * 0.25 } catch { x = 100; y = 100 }
    }
    return { x: x - 40, y: y - 40 + index * 64 }
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
    const width = Math.max(96, Math.min(CARD_WIDTH, 16 + 6.6 * Math.max(label.length, stepLine.length)))
    const height = stepLine ? 38 : 22
    tag.rect(width, height).radius(7).move(40, 30).fill('#fff').stroke({ color, width: 1.5 })
    tag.text((t: any) => t.plain(label)).font({ size: 12, weight: 600, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill(color).attr({ x: 48, y: 45 })
    if (stepLine) tag.text((t: any) => t.plain(stepLine)).font({ size: 11, family: 'Roboto, Helvetica, Arial, sans-serif' }).fill('#374151').attr({ x: 48, y: 61 })
    const toggle = (event: Event) => { event.stopPropagation?.(); api.expand(record.agentKey) }
    tag.on('pointerdown', (event: Event) => event.stopPropagation?.())
    tag.on('click', toggle)
    tag.on('keydown', (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault?.(); toggle(event) } })
    // The plan, as a compact card under the tag.
    if (showList) {
      const card = body.group().attr('data-agent-plan', '')
      const rows = lines.length
      card.rect(CARD_WIDTH, 12 + rows * 18).radius(8).move(40, 30 + height + 6).fill('#ffffff').stroke({ color: '#d1d5db', width: 1 }).attr('fill-opacity', 0.97)
      lines.forEach((line, index) => {
        const status = record.plan!.steps[index].status
        const row = card.text((t: any) => t.plain(clip(line, 38)))
          .font({ size: 12, family: 'Roboto, Helvetica, Arial, sans-serif', weight: status === 'doing' ? 600 : 400 })
          .fill(status === 'done' || status === 'skipped' ? '#6b7280' : '#111827')
          .attr({ x: 50, y: 30 + height + 6 + 20 + index * 18 })
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
  // visit to each of several (up to five), in order.
  function routeTo(record: AgentPresenceRecord, index: number) {
    const points = record.targets.map(centreOf).filter((p): p is { x: number; y: number } => Boolean(p))
    if (!points.length) return [{ ...restingPoint(index), ms: AGENT_GLIDE_MS }]
    if (points.length === 1) return [{ ...points[0], ms: AGENT_GLIDE_MS }]
    return points.slice(0, AGENT_MAX_VISITS).map(point => ({ ...point, ms: AGENT_VISIT_MS }))
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
      if (!item) {
        const start = routeTo(record, index)
        const first = start[0]
        item = { key: record.agentKey, group: group.group().attr({ 'data-agent': record.agentKey }), body: null, record, targetsKey,
          found: targetsFound(record), x: first.x, y: first.y, path: start.slice(1), leg: null, open: opened.has(record.agentKey), opacity, compact, lines: [], step: null }
        drawn.set(record.agentKey, item)
      } else if (item.targetsKey !== targetsKey || (!item.found && targetsFound(record))) {
        item.path = routeTo(record, index)
        item.leg = null
        item.found = targetsFound(record)
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

  // Follow the view: a pan or zoom re-scales the tags. Cheap: it only runs while an agent is drawn.
  let watch: ReturnType<typeof setInterval> | null = null
  const watchZoom = () => {
    if (watch !== null) return
    watch = setInterval(() => {
      if (destroyed || !drawn.size) return
      if (Math.abs(zoom() - lastScale) > 1e-6) render()
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
        opacity: item.opacity, compact: item.compact, lines: item.lines }))
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
