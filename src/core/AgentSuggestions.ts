// What agents suggest, live on the canvas: every change an agent proposes is drawn in place as a
// ghost for everyone on the slate, with Keep and Discard right on it for people who may edit.
//
//   add      a ghost note: a native note of the engine, drawn at the agent's place for it, see-through
//            and dashed in the agent's colour. Nobody can move, edit or connect it, and the engine
//            leaves it out of saves, undo, exports and what it sends to collaborators (a governed note
//            that does not persist, as a conversation preview is).
//   update   the real note, outlined, with what the agent would change it to.
//   remove   the real note, outlined in red: "Suggests removing this note".
//   link     a dashed line between two notes (either may be a ghost).
//   unlink   the line, outlined in red: "Suggests removing this line".
//
// The records come from the host (the app publishes them from its server, never from the relay),
// so nothing a page broadcasts can draw a suggestion. Keep and Discard only call the host back;
// the host decides who may and saves through its own checks. The ghost of note `id` is the engine
// note `ghost-<id>`, so an agent's pointer can point at it before it is kept (AgentPresence routes
// to any note id).
//
// Either engine shape may be passed: the v2 Slate, or the v1 facade that wraps it (slate.v2).
// This entry shares no chunk with the canvas: a host passes the engine's own mapping of stored notes
// (compat.v1NodeToV2) as toNode; without one, the stored position, size and text are mapped here.
import { AGENT_PALETTE, agentName, clip, plainLine } from './agentPresenceText'

/** A stored (v1) note's options as the engine's, for a ghost: position, size and words, the rest as stored. */
function storedNote(v1: Record<string, any>): Record<string, any> {
  const { xPos, yPos, ...rest } = v1
  return { ...rest, x: Number(xPos ?? v1.x) || 0, y: Number(yPos ?? v1.y) || 0 }
}

export const GHOST_PREFIX = 'ghost-'
export const ghostIdOf = (nodeId: string) => GHOST_PREFIX + nodeId

export type SuggestionKind = 'add' | 'update' | 'remove' | 'link' | 'unlink'
export type SuggestionState = 'pending' | 'kept' | 'discarded' | 'applied' | 'undone' | 'refused'

export interface SuggestionItem {
  id: string
  kind: SuggestionKind
  state: SuggestionState
  nodeId?: string | null
  /** add: the note as it would be stored (v1 JSON: { options, relationships }); remove: the note as it was. */
  node?: { options: Record<string, any>; relationships?: any } | null
  /** update: the note's fields the agent changes, and what they were. */
  changes?: Record<string, any> | null
  previous?: Record<string, any> | null
  /** link / unlink: the note that holds the line, and the line. */
  parentId?: string | null
  association?: { id: string; parentId?: string; childId?: string; [key: string]: any } | null
}

export interface SuggestionAction {
  actionId: string
  agentId?: string | null
  label: string
  initial?: string
  colorIndex: number
  origin?: 'visiting' | 'invited' | 'slatebox' | null
  via?: string | null
  invitedBy?: string | null
  message?: string | null
  items: SuggestionItem[]
}

export interface SuggestionRef { actionId: string; itemId: string }

export interface AgentSuggestionsOptions {
  /** Whether this person may Keep and Discard (an editor). Without it the ghosts show with no buttons. */
  canAct?: () => boolean
  onKeep?: (ref: SuggestionRef) => void
  onDiscard?: (ref: SuggestionRef) => void
  /** Turns a stored (v1) note's options into the engine's: pass compat.v1NodeToV2 (the default maps position, size and words). */
  toNode?: (v1: Record<string, any>) => Record<string, any>
}

export interface ShownSuggestion {
  actionId: string
  itemId: string
  kind: SuggestionKind
  nodeId: string | null
  ghostId: string | null
  label: string
  box: { x: number; y: number; w: number; h: number } | null
  /** Whether Keep and Discard are drawn on it. */
  controls: boolean
}

export interface AgentSuggestions {
  set(actions: SuggestionAction[]): void
  shown(): ShownSuggestion[]
  /** Keep or Discard one suggestion, as its buttons do (for keyboard hosts and tests). */
  keep(ref: SuggestionRef): void
  discard(ref: SuggestionRef): void
  destroy(): void
}

interface Box { x: number; y: number; w: number; h: number }

/** The suggestions still waiting, in order, each with its action. */
export function pendingItems(actions: SuggestionAction[]): { action: SuggestionAction; item: SuggestionItem }[] {
  const out: { action: SuggestionAction; item: SuggestionItem }[] = []
  for (const action of Array.isArray(actions) ? actions : []) {
    if (!action || typeof action.actionId !== 'string') continue
    for (const item of Array.isArray(action.items) ? action.items : [])
      if (item && item.state === 'pending' && typeof item.id === 'string') out.push({ action, item })
  }
  return out
}

// A ghost note is drawn, never touched: no selecting, moving, resizing, editing, connecting or
// deleting it, and it is left out of saves, undo, exports and collaboration.
const INERT = Object.freeze({
  canMove: false, canResize: false, canRotate: false, canDelete: false, canDuplicate: false,
  canConnect: false, canEditText: false, canSelect: false, persist: false, exportable: false,
})

const FONT = 'Roboto, Helvetica, Arial, sans-serif'
const REMOVE_COLOR = '#b91c1c'

/** Where the segment from a's centre to b's centre leaves box a (so a line starts at a note's edge). */
function edgePoint(a: Box, b: Box): { x: number; y: number } {
  const cx = a.x + a.w / 2, cy = a.y + a.h / 2
  const dx = b.x + b.w / 2 - cx, dy = b.y + b.h / 2 - cy
  if (!dx && !dy) return { x: cx, y: cy }
  const tx = dx ? a.w / 2 / Math.abs(dx) : Infinity
  const ty = dy ? a.h / 2 / Math.abs(dy) : Infinity
  const t = Math.min(tx, ty, 1)
  return { x: cx + dx * t, y: cy + dy * t }
}

/** What an update changes, in words: its new text, or what kind of change it is. */
function updateWords(item: SuggestionItem): string {
  const changes = item.changes || {}
  if (typeof changes.text === 'string') return 'Suggests: “' + clip(plainLine(changes.text), 48) + '”'
  const keys = Object.keys(changes)
  const moves = keys.some(key => ['xPos', 'yPos', 'x', 'y'].includes(key))
  const sizes = keys.some(key => ['width', 'height'].includes(key))
  if (moves && keys.every(key => ['xPos', 'yPos', 'x', 'y'].includes(key))) return 'Suggests moving it here'
  if (sizes && keys.every(key => ['width', 'height'].includes(key))) return 'Suggests resizing it'
  return 'Suggests restyling it'
}

export function createAgentSuggestions(host: any, options: AgentSuggestionsOptions = {}): AgentSuggestions {
  // Either shape: the v1 facade keeps the engine's own slate on .v2.
  const slate = host?.v2 && typeof host.v2.canvas?.group === 'function' ? host.v2 : host
  const toNode = options.toNode ?? storedNote
  const canAct = () => (options.canAct ? Boolean(options.canAct()) : false)
  let actions: SuggestionAction[] = []
  let layer: any = null
  let destroyed = false
  let lastKey = ''
  // ghost id -> { node, json } for every ghost note drawn
  const ghosts = new Map<string, { node: any; json: string }>()
  let shownList: ShownSuggestion[] = []

  const release = typeof slate.setDragPolicy === 'function'
    ? slate.setDragPolicy({
      governs: (node: any) => (typeof node?.id === 'string' && ghosts.has(node.id) ? INERT : null),
      onEnd: () => ({ accept: false }),
      // A load from the room replaced every note, the ghosts too: draw them again.
      onNotesReplaced() { ghosts.clear(); sync() },
    })
    : () => {}

  const authority = <T>(fn: () => T): T => (typeof slate.withPolicyAuthority === 'function' ? slate.withPolicyAuthority(fn) : fn())

  function ensureLayer() {
    if (layer && layer.node?.isConnected !== false && layer.node?.parentNode) return layer
    layer = slate.canvas.group()
    layer.attr({ 'data-agent-suggestions': '' })
    return layer
  }

  function zoom(): number {
    try {
      const box = slate.canvas.viewbox()
      const rect = slate.canvas.node?.getBoundingClientRect?.()
      if (box?.width && rect?.width) return rect.width / box.width
    } catch { /* no canvas size yet */ }
    try {
      const z = slate.getZoom?.()
      if (typeof z === 'number' && z > 0) return z
    } catch { /* no pan-zoom yet */ }
    return 1
  }

  const noteOf = (id: string | null | undefined) => (id ? slate.nodes?.one?.(id) : undefined)
  function boxOf(node: any): Box | null {
    const o = node?.options
    if (!o || ![o.x, o.y, o.width, o.height].every(value => typeof value === 'number' && Number.isFinite(value))) return null
    return { x: o.x, y: o.y, w: o.width, h: o.height }
  }
  // A note as drawn now: the real one, or else its ghost.
  const boxFor = (id: string | null | undefined): Box | null => (id ? boxOf(noteOf(id)) ?? boxOf(noteOf(ghostIdOf(id))) : null)

  const colorOf = (action: SuggestionAction) =>
    AGENT_PALETTE[((Number(action.colorIndex) % AGENT_PALETTE.length) + AGENT_PALETTE.length) % AGENT_PALETTE.length] || AGENT_PALETTE[0]
  const nameOf = (action: SuggestionAction) => agentName(action)

  // ---- ghost notes (native, inert) ---------------------------------------------------------
  function syncGhosts() {
    const wanted = new Map<string, { item: SuggestionItem; action: SuggestionAction }>()
    for (const { action, item } of pendingItems(actions))
      if (item.kind === 'add' && item.nodeId && item.node?.options) wanted.set(ghostIdOf(item.nodeId), { item, action })
    authority(() => {
      for (const [id, ghost] of ghosts) {
        const want = wanted.get(id)
        if (want && JSON.stringify(want.item.node) === ghost.json && slate.nodes?.one?.(id) === ghost.node) continue
        if (slate.nodes?.one?.(id) === ghost.node) slate.nodes.remove(id)
        ghosts.delete(id)
      }
      for (const [id, { item, action }] of wanted) {
        if (ghosts.has(id)) continue
        // The real note is already on the slate (kept a moment ago): no ghost beside it.
        if (item.nodeId && noteOf(item.nodeId)) continue
        const v1 = { ...item.node!.options, id }
        let node: any
        try {
          node = slate.nodes.add(toNode(v1))
        } catch {
          continue
        }
        ghosts.set(id, { node, json: JSON.stringify(item.node) })
        Promise.resolve(node?.ready).then(() => {
          if (destroyed || ghosts.get(id)?.node !== node) return
          node.applyGovernance?.()
          const group = node.svgGroup?.node as SVGGElement | undefined
          if (!group) return
          group.style.opacity = '0.72'
          group.style.pointerEvents = 'none'
          group.setAttribute('data-agent-ghost', item.nodeId || '')
          group.setAttribute('aria-label', 'Suggested by ' + nameOf(action) + ', not kept yet: ' + plainLine(item.node?.options?.text ?? ''))
          render(true)
        }).catch(() => undefined)
      }
    })
  }

  // ---- the overlay: outlines, words, lines, Keep and Discard --------------------------------
  function button(parent: any, x: number, label: string, aria: string, primary: boolean, color: string, act: () => void) {
    const width = Math.round(18 + 6.8 * label.length)
    const group = parent.group().attr({ role: 'button', tabindex: 0, 'aria-label': aria, cursor: 'pointer', 'pointer-events': 'all',
      'data-suggestion-button': primary ? 'keep' : 'discard' })
    group.rect(width, 22).radius(11).move(x, 0).fill(primary ? color : '#ffffff').stroke({ color, width: 1.5 })
    group.text((t: any) => t.plain(label)).font({ size: 12, weight: 600, family: FONT, anchor: 'middle' })
      .fill(primary ? '#ffffff' : color).attr({ x: x + width / 2, y: 15 })
    const fire = (event: Event) => { event.stopPropagation?.(); event.preventDefault?.(); act() }
    group.on('pointerdown', (event: Event) => event.stopPropagation?.())
    group.on('mousedown', (event: Event) => event.stopPropagation?.())
    group.on('click', fire)
    group.on('keydown', (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') fire(event) })
    return width
  }

  // Keep and Discard, screen-sized: under a note with their right edge at (x, y) in world units, or
  // centred on (x, y) for a line.
  function controls(group: any, at: { x: number; y: number }, scale: number, action: SuggestionAction, item: SuggestionItem, keepLabel: string, what: string, centred = false) {
    const color = colorOf(action)
    const ref = { actionId: action.actionId, itemId: item.id }
    const holder = group.group().attr({ 'data-suggestion-controls': item.id })
    const row = holder.group()
    let x = 0
    // Said as "the suggestion from Excalidraw, added by Ada", never "Excalidraw · added by Ada's suggestion".
    const from = ' the suggestion from ' + nameOf(action).replace(/ · /g, ', ') + ': ' + what
    x += button(row, x, keepLabel, keepLabel + from, true, color, () => api.keep(ref)) + 6
    x += button(row, x, 'Discard', 'Discard' + from, false, color, () => api.discard(ref))
    holder.transform({ translateX: at.x, translateY: at.y, scale: 1 / scale, originX: 0, originY: 0 })
    row.attr('transform', centred ? `translate(${-x / 2} -11)` : `translate(${-x} 6)`)
  }

  // A small tag over a ghost: the agent's hexagon and name.
  function tag(group: any, at: { x: number; y: number }, scale: number, action: SuggestionAction, words: string, color: string) {
    const holder = group.group().attr({ 'data-suggestion-tag': '', 'pointer-events': 'none' })
    const text = clip(words, 64)
    const width = Math.round(28 + 7 * text.length)
    holder.rect(width, 22).radius(11).move(0, -28).fill('#ffffff').stroke({ color, width: 1.2 }).attr('fill-opacity', 0.95)
    const r = 6, cx = 12, cy = -16
    const points = Array.from({ length: 6 }, (_, i) => {
      const a = Math.PI / 6 + (i * Math.PI) / 3
      return (cx + r * Math.cos(a)).toFixed(2) + ',' + (cy + r * Math.sin(a)).toFixed(2)
    }).join(' ')
    holder.polygon(points).fill(color)
    holder.text((t: any) => t.plain(text)).font({ size: 12, family: FONT }).fill('#111827').attr({ x: 22, y: -12 })
    holder.transform({ translateX: at.x, translateY: at.y, scale: 1 / scale, originX: 0, originY: 0 })
  }

  function render(force = false) {
    if (destroyed) return
    const scale = zoom()
    const pending = pendingItems(actions)
    const key = JSON.stringify([scale.toFixed(4), canAct(), pending.map(({ item }) => item.id + ':' + item.kind), notesKey(pending)])
    if (!force && key === lastKey) return
    lastKey = key
    const group = ensureLayer()
    group.clear()
    group.front?.()
    // The agents' pointers stay above the suggestions.
    try {
      const pointers = slate.canvas.node?.querySelector?.('[data-agent-presence]')
      pointers?.parentNode?.appendChild(pointers)
    } catch { /* no pointers drawn */ }
    const acting = canAct()
    const shown: ShownSuggestion[] = []
    for (const { action, item } of pending) {
      const color = colorOf(action)
      const name = nameOf(action)
      const item_g = group.group().attr({ 'data-suggestion': item.id, 'data-suggestion-kind': item.kind, 'data-action': action.actionId })
      const dash = { color: item.kind === 'remove' || item.kind === 'unlink' ? REMOVE_COLOR : color, width: 2 / scale, dasharray: `${8 / scale} ${5 / scale}` }
      let box: Box | null = null
      let at: { x: number; y: number } | null = null
      let keepLabel = 'Keep'
      let what = ''
      if (item.kind === 'add' || item.kind === 'update' || item.kind === 'remove') {
        box = item.kind === 'add' ? boxOf(noteOf(ghostIdOf(item.nodeId || ''))) : boxOf(noteOf(item.nodeId))
        if (!box) { item_g.remove(); continue }
        const pad = 6 / scale
        item_g.rect(box.w + 2 * pad, box.h + 2 * pad).move(box.x - pad, box.y - pad).radius(6 / scale).fill('none').stroke(dash)
          .attr({ 'pointer-events': 'none', 'data-suggestion-outline': '' })
        at = { x: box.x + box.w + pad, y: box.y + box.h + pad }
        const text = plainLine(item.kind === 'add' ? item.node?.options?.text ?? '' : noteOf(item.nodeId)?.options?.text ?? '')
        if (item.kind === 'add') { what = 'add “' + clip(text, 40) + '”'; tag(item_g, { x: box.x - pad, y: box.y - pad }, scale, action, name, color) }
        if (item.kind === 'update') {
          what = updateWords(item).replace(/^Suggests/, 'change “' + clip(text, 24) + '”,').replace(/: “/, ' to “')
          tag(item_g, { x: box.x - pad, y: box.y - pad }, scale, action, name + ' — ' + updateWords(item), color)
        }
        if (item.kind === 'remove') {
          keepLabel = 'Remove'
          what = 'remove “' + clip(text, 40) + '”'
          tag(item_g, { x: box.x - pad, y: box.y - pad }, scale, action, name + ' — Suggests removing this note', REMOVE_COLOR)
        }
      } else {
        const association = item.association || null
        const from = boxFor(item.parentId ?? association?.parentId)
        const to = boxFor(association?.childId)
        if (!from || !to) { item_g.remove(); continue }
        const a = edgePoint(from, to), b = edgePoint(to, from)
        item_g.line(a.x, a.y, b.x, b.y).stroke({ ...dash, width: 2.5 / scale }).attr({ 'pointer-events': 'none', 'data-suggestion-line': '' })
        const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
        box = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) }
        at = mid
        if (item.kind === 'unlink') { keepLabel = 'Remove'; what = 'remove a line' } else what = 'draw a line'
        // A line carries no tag over the notes it joins: its dashes are the agent's colour, and it says whose to a screen reader.
        item_g.attr({ role: 'img', 'aria-label': name + (item.kind === 'unlink' ? ' suggests removing this line' : ' suggests this line') })
      }
      if (acting && at) controls(item_g, at, scale, action, item, keepLabel, what, item.kind === 'link' || item.kind === 'unlink')
      shown.push({ actionId: action.actionId, itemId: item.id, kind: item.kind, nodeId: item.nodeId ?? null,
        ghostId: item.kind === 'add' && item.nodeId ? ghostIdOf(item.nodeId) : null, label: name, box, controls: Boolean(acting && at) })
    }
    shownList = shown
    if (!pending.length) { layer?.remove(); layer = null }
  }

  // Where the notes the suggestions sit on are, as a key: a note that moved redraws its outline.
  function notesKey(pending: { item: SuggestionItem }[]): string {
    const ids = new Set<string>()
    for (const { item } of pending) {
      if (item.nodeId) { ids.add(item.nodeId); ids.add(ghostIdOf(item.nodeId)) }
      if (item.parentId) ids.add(item.parentId)
      if (item.association?.childId) { ids.add(item.association.childId); ids.add(ghostIdOf(item.association.childId)) }
    }
    return [...ids].map(id => { const b = boxOf(noteOf(id)); return b ? id + ':' + [b.x, b.y, b.w, b.h].map(Math.round).join(',') : '' }).join(';')
  }

  function sync() {
    if (destroyed) return
    syncGhosts()
    render(true)
  }

  // Follow the view and the notes: a pan, a zoom or a moved note redraws the overlay (only while something waits).
  const watch = setInterval(() => { if (!destroyed && pendingItems(actions).length) render(false) }, 250)

  const api: AgentSuggestions = {
    set(next) {
      if (destroyed) return
      actions = Array.isArray(next) ? next.filter(action => action && typeof action.actionId === 'string') : []
      sync()
    },
    shown: () => shownList.map(item => ({ ...item, box: item.box ? { ...item.box } : null })),
    keep(ref) { if (canAct()) options.onKeep?.(ref) },
    discard(ref) { if (canAct()) options.onDiscard?.(ref) },
    destroy() {
      if (destroyed) return
      destroyed = true
      clearInterval(watch)
      authority(() => {
        for (const [id, ghost] of ghosts) if (slate.nodes?.one?.(id) === ghost.node) slate.nodes.remove(id)
      })
      ghosts.clear()
      try { release() } catch { /* the slate is gone */ }
      layer?.remove()
      layer = null
    },
  }
  return api
}
