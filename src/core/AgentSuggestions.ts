// What agents suggest, live on the canvas: every change an agent proposes is drawn in place as a
// ghost for everyone on the slate. One agent action (one ask) is one group: a dashed frame around
// its new notes, ONE tag naming the agent and what it suggests ("3 notes, 2 lines"), and Keep all /
// Discard all at the frame's corner for people who may edit. Keep and Discard for a single note
// show only on the ghost under the pointer or with keyboard focus; lines carry no buttons (a line
// is kept with both its ends and goes with either). Tags and buttons are placed so none overlap.
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
// This is its own entry (slateboxjs/suggestions), loaded when the first suggestion arrives. It shares no
// chunk with the canvas: a host passes the engine's own mapping of stored notes (compat.v1NodeToV2) as
// toNode; without one, the stored position, size and text are mapped here. What it has in common with the
// agents' pointers (names, colours, the hexagon, boxes, the canvas's scale) it takes from the presence entry
// (slateboxjs/presence), which a page with suggestions has loaded already.
import { agentColor, agentName, boxOf, canvasZoom, clip, hexPoints, overlap, plainLine, type Box } from './AgentPresence'

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
  /** Keep all / Discard all on an action's frame: the host saves (or drops) its waiting items at once. */
  onKeepAll?: (actionId: string) => void
  onDiscardAll?: (actionId: string) => void
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
  /** Whether Keep and Discard are drawn on it (a new note's show under the pointer or with focus). */
  controls: boolean
  /** Its action's frame: the box around the action's new notes (null when it adds none). */
  frame: { x: number; y: number; w: number; h: number } | null
}

/** One action's group as drawn: its frame, its one tag, and its Keep all / Discard all (world boxes). */
export interface ShownGroup {
  actionId: string
  frame: { x: number; y: number; w: number; h: number }
  tag: { x: number; y: number; w: number; h: number }
  all: { x: number; y: number; w: number; h: number } | null
  words: string
}

export interface AgentSuggestions {
  set(actions: SuggestionAction[]): void
  shown(): ShownSuggestion[]
  /** Each action's frame, tag and Keep all / Discard all, as drawn. */
  groups(): ShownGroup[]
  /** Keep or Discard one suggestion, as its buttons do (for keyboard hosts and tests). */
  keep(ref: SuggestionRef): void
  discard(ref: SuggestionRef): void
  /** Keep all / Discard all of one action, as its frame's buttons do. */
  keepAll(actionId: string): void
  discardAll(actionId: string): void
  destroy(): void
}

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

const WORDS: [SuggestionKind, string, string][] = [['add', 'note', 'notes'], ['update', 'change', 'changes'], ['remove', 'removal', 'removals'], ['link', 'line', 'lines'], ['unlink', 'line removed', 'lines removed']]
/** What an action's waiting items are, in a few words: "3 notes, 2 lines". */
export function groupWords(items: SuggestionItem[]): string {
  return WORDS.map(([kind, one, many]) => {
    const n = items.filter(item => item.kind === kind).length
    return n ? n + ' ' + (n === 1 ? one : many) : ''
  }).filter(Boolean).join(', ')
}

const union = (a: Box | null, b: Box | null): Box | null =>
  (!a || !b ? a || b : { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.max(a.x + a.w, b.x + b.w) - Math.min(a.x, b.x), h: Math.max(a.y + a.h, b.y + b.h) - Math.min(a.y, b.y) })

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
  let groupList: ShownGroup[] = []
  // The ghost whose own Keep and Discard show, kept across redraws, and what showed them: a mouse over it, a tap
  // (a finger has no hover: a tap shows them, the next tap hides them) or keyboard focus.
  let hovered: string | null = null
  let shownBy: 'pointer' | 'tap' | 'focus' = 'pointer'
  // Set while the layer is redrawn: the focus a redraw takes away (and gives back) hides nothing.
  let redrawing = false

  const release = typeof slate.setDragPolicy === 'function'
    ? slate.setDragPolicy({
      governs: (node: any) => (typeof node?.id === 'string' && ghosts.has(node.id) ? INERT : null),
      onEnd: () => ({ accept: false }),
      // A load from the room replaced every note, the ghosts too: draw them again.
      onNotesReplaced() { ghosts.clear(); sync(true) },
    })
    : () => {}

  const authority = <T>(fn: () => T): T => (typeof slate.withPolicyAuthority === 'function' ? slate.withPolicyAuthority(fn) : fn())

  function ensureLayer() {
    if (layer && layer.node?.isConnected !== false && layer.node?.parentNode) return layer
    layer = slate.canvas.group()
    // data-export-never: drawn for the view only, so no picture of the slate shows it (Export).
    layer.attr({ 'data-agent-suggestions': '', 'data-export-never': '' })
    return layer
  }

  const noteOf = (id: string | null | undefined) => (id ? slate.nodes?.one?.(id) : undefined)
  // A note as drawn now: the real one, or else its ghost.
  const boxFor = (id: string | null | undefined): Box | null => (id ? boxOf(noteOf(id)) ?? boxOf(noteOf(ghostIdOf(id))) : null)

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
          // The note drew itself over the overlay: put the overlay back on top (no redraw: a ghost being tapped or
          // pointed at keeps its buttons and its focus), and redraw only if the note's box is not what was drawn.
          render(false)
          raise()
        }).catch(() => undefined)
      }
    })
  }

  // ---- the overlay: outlines, words, lines, Keep and Discard --------------------------------
  function button(parent: any, x: number, label: string, aria: string, primary: boolean, color: string, act: () => void, kind = primary ? 'keep' : 'discard') {
    const width = Math.round(18 + 6.8 * label.length)
    const group = parent.group().attr({ role: 'button', tabindex: 0, 'aria-label': aria, cursor: 'pointer', 'pointer-events': 'all',
      'data-suggestion-button': kind })
    group.rect(width, 22).radius(11).move(x, 0).fill(primary ? color : '#ffffff').stroke({ color, width: 1.5 })
    group.text((t: any) => t.plain(label)).font({ size: 12, weight: 600, family: FONT, anchor: 'middle' })
      .fill(primary ? '#ffffff' : color).attr({ x: x + width / 2, y: 15 })
    const fire = (event: Event) => { event.stopPropagation?.(); event.preventDefault?.(); act() }
    // A click acts only when it was pressed on this button (or comes from a keyboard or a screen reader: detail 0). A
    // tap that shows a small ghost's buttons is followed by the browser's click at the same spot, now over a button
    // that was not there when the finger came down: that click must not keep or discard anything. Pressed means a
    // pointerdown here; the mousedown a browser sends after a tap is not one (it comes with that click).
    let pressed = false
    group.on('pointerdown', (event: Event) => { pressed = true; event.stopPropagation?.() })
    // That mousedown would also take the focus to this button (Discard, under the finger that only meant to show it):
    // the focus stays where the tap put it (the ghost). A press here, by mouse or a later tap, focuses it as usual.
    group.on('mousedown', (event: Event) => { event.stopPropagation?.(); if (!pressed) event.preventDefault?.() })
    group.on('click', (event: MouseEvent) => {
      const ok = pressed || !event.detail
      pressed = false
      if (ok) fire(event)
      else { event.stopPropagation?.(); event.preventDefault?.() }
    })
    group.on('keydown', (event: KeyboardEvent) => { if (event.key === 'Enter' || event.key === ' ') fire(event) })
    return width
  }

  // A row of two buttons, screen-sized, at world point `at`, offset by (dx, dy) screen pixels (dx < 0:
  // the row's right edge there). [label, words a screen reader hears, kind, act] each; the first is primary.
  function row(group: any, attrs: Record<string, string>, at: { x: number; y: number }, scale: number, color: string, buttons: [string, string, string, () => void][], dx: number, dy: number) {
    const holder = group.group().attr(attrs)
    const line = holder.group()
    let x = 0
    buttons.forEach(([label, aria, kind, act], i) => { x += button(line, x, label, aria, !i, color, act, kind) + 6 })
    holder.transform({ translateX: at.x, translateY: at.y, scale: 1 / scale, originX: 0, originY: 0 })
    line.attr('transform', `translate(${dx < 0 ? dx - x + 6 : dx} ${dy})`)
    return holder
  }
  // Keep / Discard of one item; Keep all / Discard all of one action (12px a letter... measured as button() does).
  const ALL_W = Math.round(18 + 6.8 * 8) + 6 + Math.round(18 + 6.8 * 11)
  const tagWidth = (words: string) => Math.round(28 + 7 * clip(words, 64).length)
  const itemButtons = (action: SuggestionAction, item: SuggestionItem, keepLabel: string, what: string): [string, string, string, () => void][] => {
    // Said as "the suggestion from Excalidraw, added by Ada", never "Excalidraw · added by Ada's suggestion".
    const from = ' the suggestion from ' + nameOf(action).replace(/ · /g, ', ') + ': ' + what
    const ref = { actionId: action.actionId, itemId: item.id }
    return [[keepLabel, keepLabel + from, 'keep', () => api.keep(ref)], ['Discard', 'Discard' + from, 'discard', () => api.discard(ref)]]
  }

  // A small tag (the agent's hexagon and words) with its top left at a world point.
  function tag(group: any, at: { x: number; y: number }, scale: number, words: string, color: string) {
    const holder = group.group().attr({ 'data-suggestion-tag': '', 'pointer-events': 'none' })
    const text = clip(words, 64)
    holder.rect(tagWidth(words), 22).radius(11).fill('#ffffff').stroke({ color, width: 1.2 }).attr('fill-opacity', 0.95)
    holder.polygon(hexPoints(12, 12, 6)).fill(color)
    holder.text((t: any) => t.plain(text)).font({ size: 12, family: FONT }).fill('#111827').attr({ x: 22, y: 16 })
    holder.transform({ translateX: at.x, translateY: at.y, scale: 1 / scale, originX: 0, originY: 0 })
  }

  // Show or hide one ghost's own Keep and Discard (no redraw, so the pointer stays where it is). Focus coming to the
  // ghost they already show for leaves them as they are (a tap focuses what it tapped, after it showed them).
  function reveal(itemId: string | null, by: typeof shownBy = 'pointer') {
    if (by === 'focus' && itemId !== null && itemId === hovered) return
    hovered = itemId
    shownBy = by
    layer?.node?.querySelectorAll?.('[data-on-hover]').forEach((el: SVGGElement) => show(el, el.getAttribute('data-suggestion-controls') === itemId))
  }
  // Hidden by display and visibility both: WebKit still measures (and a test still sees) the buttons of an SVG group
  // that is only display: none.
  const show = (el: SVGGElement, on: boolean) => { el.style.display = on ? '' : 'none'; el.style.visibility = on ? '' : 'hidden' }

  // Run `move` (which takes the layer's elements out of the page), then give the focus back to the element that had it.
  function keepingFocus(move: () => void) {
    const active = typeof document !== 'undefined' ? (document.activeElement as Element | null) : null
    const inLayer = Boolean(active && layer?.node?.contains?.(active))
    const hit = inLayer ? active!.closest('[data-suggestion-hit]')?.getAttribute('data-suggestion-hit') : null
    const button = inLayer ? active!.closest('[data-suggestion-button]') : null
    const holder = button?.parentElement?.closest('[data-suggestion-controls], [data-suggestion-all]')
    const at = (name: string, value: string | null) => `[${name}="${String(value).replace(/["\\]/g, '\\$&')}"]`
    const again = hit != null ? at('data-suggestion-hit', hit)
      : button && holder ? (holder.hasAttribute('data-suggestion-all') ? at('data-suggestion-all', holder.getAttribute('data-suggestion-all')) : at('data-suggestion-controls', holder.getAttribute('data-suggestion-controls')))
        + ' ' + at('data-suggestion-button', button.getAttribute('data-suggestion-button')) : null
    redrawing = true
    try { move() } finally { redrawing = false }
    if (again && document.activeElement !== active) (layer?.node?.querySelector?.(again) as SVGElement | null)?.focus?.({ preventScroll: true })
  }

  // The overlay above the notes, and the agents' pointers above it. Moved only when something is drawn over it.
  function raise() {
    const node = layer?.node as SVGGElement | undefined
    const parent = node?.parentNode
    if (!node || !parent) return
    const pointers = [...parent.children].find(child => child.hasAttribute('data-agent-presence'))
    if (node.nextElementSibling && node.nextElementSibling !== pointers) keepingFocus(() => parent.appendChild(node))
    if (pointers?.nextElementSibling) parent.appendChild(pointers)
  }

  function render(force = false) {
    if (destroyed) return
    const scale = canvasZoom(slate)
    const pending = pendingItems(actions)
    // Everything drawn comes from this key: the host publishing the same suggestions again (every change to any of
    // them reaches every page) redraws nothing, so a ghost being tapped or pointed at is not replaced under the finger.
    const key = JSON.stringify([scale.toFixed(4), canAct(), notesKey(pending), pending.map(({ action, item }) =>
      [action.actionId, action.label, action.colorIndex, action.origin, action.via, action.invitedBy, item])])
    const connected = Boolean(layer?.node?.isConnected)
    if (!force && key === lastKey && (connected || !pending.length)) return
    lastKey = key
    if (hovered && !pending.some(({ item }) => item.id === hovered)) hovered = null
    const group = ensureLayer()
    keepingFocus(() => { group.clear(); draw(group, scale, pending) })
    raise()
    if (!pending.length) { layer?.remove(); layer = null; groupList = [] }
  }

  function draw(group: any, scale: number, pending: { action: SuggestionAction; item: SuggestionItem }[]) {
    const acting = canAct()
    const shown: ShownSuggestion[] = []
    const groups: ShownGroup[] = []
    const byAction = new Map<string, { action: SuggestionAction; items: SuggestionItem[]; frame: Box | null }>()
    for (const { action, item } of pending) {
      const entry = byAction.get(action.actionId) ?? { action, items: [], frame: null }
      entry.items.push(item)
      byAction.set(action.actionId, entry)
      // The frame: the box round the action's ghosts.
      if (item.kind === 'add') entry.frame = union(entry.frame, boxOf(noteOf(ghostIdOf(item.nodeId || ''))))
    }
    // An action of lines only (no new notes): its frame is round the notes its lines join (one end
    // when the other is gone), so its Keep all / Discard all are still on the canvas.
    for (const entry of byAction.values())
      if (!entry.frame) for (const item of entry.items)
        if (item.kind === 'link' || item.kind === 'unlink') entry.frame = union(union(entry.frame, boxFor(item.parentId ?? item.association?.parentId)), boxFor(item.association?.childId))
    const pad = 6 / scale, line = 28 / scale
    const sp = (x: number, y: number, w: number): Box => ({ x, y, w, h: 22 / scale })
    const frames = [...byAction.values()].filter(e => e.frame).map(e => (e.frame = { x: e.frame!.x - 2 * pad, y: e.frame!.y - 2 * pad, w: e.frame!.w + 4 * pad, h: e.frame!.h + 4 * pad }))
    // What the tags and buttons already drawn take, every frame and every real note: none may cover another.
    const taken: Box[] = [...frames]
    for (const node of slate.nodes?.allNodes || []) if (!ghosts.has(node?.id)) { const b = boxOf(node); if (b) taken.push(b) }
    // The first spot that covers nothing taken (its own frame aside); else, of those spots and the
    // ones further down, the one that covers least. Taken from then on.
    const place = (spots: Box[], own: Box | null) => {
      const others = taken.filter(o => o !== own)
      const cover = (s: Box) => others.reduce((sum, o) => sum + overlap(s, o), 0)
      let spot = spots.find(s => !cover(s))
      if (!spot) {
        const more = [...spots, ...[1, 2, 3, 4].map(n => ({ ...spots[0], y: spots[0].y - n * line })), ...[1, 2, 3, 4].map(n => ({ ...spots[1] ?? spots[0], y: (spots[1] ?? spots[0]).y + n * line }))]
        spot = more.reduce((best, s) => (cover(s) < cover(best) ? s : best))
      }
      taken.push(spot)
      return spot
    }
    for (const { action, items, frame } of byAction.values()) {
      const color = agentColor(action.colorIndex)
      const name = nameOf(action)
      const action_g = group.group().attr({ 'data-suggestion-group': action.actionId })
      if (frame) {
        const words = groupWords(items)
        action_g.rect(frame.w, frame.h).move(frame.x, frame.y).radius(10 / scale).fill('none')
          .stroke({ color, width: 1.5 / scale, dasharray: `${10 / scale} ${6 / scale}` }).attr({ 'pointer-events': 'none', 'data-suggestion-frame': action.actionId })
        // One tag: above the frame's top left, else under its bottom left, else inside its top edge.
        const tw = tagWidth(name + ' · ' + words) / scale
        const at = place([sp(frame.x, frame.y - line, tw), sp(frame.x, frame.y + frame.h + pad, tw), sp(frame.x + pad, frame.y + pad, tw)], frame)
        tag(action_g, at, scale, name + ' · ' + words, color)
        // Keep all / Discard all: under the frame's bottom right, else above its top right, else under its left.
        const aw = ALL_W / scale
        const right = frame.x + frame.w - aw
        const all = acting ? place([sp(right, frame.y + frame.h + pad, aw), sp(right, frame.y - line, aw), sp(frame.x, frame.y + frame.h + line + pad, aw)], frame) : null
        const whose = ' of the suggestion from ' + name.replace(/ · /g, ', ') + ': ' + words
        if (all) row(action_g, { 'data-suggestion-all': action.actionId }, all, scale, color,
          [['Keep all', 'Keep all' + whose, 'keep-all', () => api.keepAll(action.actionId)], ['Discard all', 'Discard all' + whose, 'discard-all', () => api.discardAll(action.actionId)]], 0, 0)
        groups.push({ actionId: action.actionId, frame, tag: at, all, words })
      }
      for (const item of items) {
        const item_g = action_g.group().attr({ 'data-suggestion': item.id, 'data-suggestion-kind': item.kind, 'data-action': action.actionId })
        const dash = { color: item.kind === 'remove' || item.kind === 'unlink' ? REMOVE_COLOR : color, width: 2 / scale, dasharray: `${8 / scale} ${5 / scale}` }
        let box: Box | null = null
        let drawn = false
        if (item.kind === 'link' || item.kind === 'unlink') {
          const from = boxFor(item.parentId ?? item.association?.parentId)
          const to = boxFor(item.association?.childId)
          if (!from || !to) { item_g.remove(); continue }
          const a = edgePoint(from, to), b = edgePoint(to, from)
          item_g.line(a.x, a.y, b.x, b.y).stroke({ ...dash, width: 2.5 / scale }).attr({ 'pointer-events': 'none', 'data-suggestion-line': '' })
          box = { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y), w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) }
          // A line carries no tag and no buttons: it is kept with both its ends, and goes with either.
          item_g.attr({ role: 'img', 'aria-label': name + (item.kind === 'unlink' ? ' suggests removing this line' : ' suggests this line') })
        } else {
          box = boxOf(noteOf(item.kind === 'add' ? ghostIdOf(item.nodeId || '') : item.nodeId))
          if (!box) { item_g.remove(); continue }
          item_g.rect(box.w + 2 * pad, box.h + 2 * pad).move(box.x - pad, box.y - pad).radius(pad).fill('none').stroke(dash)
            .attr({ 'pointer-events': 'none', 'data-suggestion-outline': '' })
          const text = plainLine(item.kind === 'add' ? item.node?.options?.text ?? '' : noteOf(item.nodeId)?.options?.text ?? '')
          if (item.kind === 'add') {
            if (acting) {
              // A ghost is inert (no pointer events): an invisible box over it in this layer hears the
              // pointer and takes keyboard focus, and shows its own Keep and Discard just inside it.
              item_g.rect(box.w, box.h).move(box.x, box.y).fill('#fff').attr({ 'fill-opacity': 0, 'pointer-events': 'all', tabindex: 0, role: 'group',
                'aria-label': 'Suggested by ' + name + ': ' + clip(text, 60) + '. Keep or discard it alone.', 'data-suggestion-hit': item.id })
              const holder = row(item_g, { 'data-suggestion-controls': item.id, 'data-on-hover': '' }, { x: box.x + box.w, y: box.y + box.h }, scale, color, itemButtons(action, item, 'Keep', 'add “' + clip(text, 40) + '”'), -6, -28)
              if (hovered !== item.id) show(holder.node, false)
              const node = item_g.node as SVGGElement
              // A touch has no hover (its pointerleave comes as the finger lifts): a tap shows them, another hides them.
              node.addEventListener('pointerenter', (event: PointerEvent) => { if (event.pointerType !== 'touch') reveal(item.id) })
              node.addEventListener('pointerleave', (event: PointerEvent) => { if (event.pointerType !== 'touch' && hovered === item.id && shownBy === 'pointer' && !node.contains(document.activeElement)) reveal(null) })
              // A tap shows them; a tap on the ghost they show for (by a tap or focus) hides them. Shown by a mouse that
              // has since left without a word (its ghost was redrawn under it), they are not this ghost's to hide.
              node.addEventListener('pointerup', (event: PointerEvent) => {
                if (event.pointerType !== 'touch' || (event.target as Element)?.closest?.('[data-suggestion-button]')) return
                const showing = !(hovered === item.id && shownBy !== 'pointer')
                reveal(showing ? item.id : null, 'tap')
                // The tap's focus goes to the ghost it tapped (its own Keep and Discard now show inside it), never to a
                // button that appeared under the finger: Discard is pressed only by a tap of its own.
                if (showing) (node.querySelector('[data-suggestion-hit]') as SVGElement | null)?.focus?.({ preventScroll: true })
              })
              node.addEventListener('focusin', () => reveal(item.id, 'focus'))
              node.addEventListener('focusout', (event: FocusEvent) => { if (!redrawing && hovered === item.id && !node.contains(event.relatedTarget as Node | null)) reveal(null) })
              drawn = true
            }
          } else {
            // A change to a real note keeps its own tag and buttons there (no frame holds it).
            const update = item.kind === 'update'
            const words = name + ' — ' + (update ? updateWords(item) : 'Suggests removing this note')
            const tw = tagWidth(words) / scale
            tag(item_g, place([sp(box.x - pad, box.y - pad - line, tw), sp(box.x - pad, box.y + box.h + 2 * pad, tw)], null), scale, words, update ? color : REMOVE_COLOR)
            if (acting) {
              row(item_g, { 'data-suggestion-controls': item.id }, { x: box.x + box.w + pad, y: box.y + box.h + pad }, scale, color, itemButtons(action, item, update ? 'Keep' : 'Remove',
                update ? updateWords(item).replace(/^Suggests/, 'change “' + clip(text, 24) + '”,').replace(/: “/, ' to “') : 'remove “' + clip(text, 40) + '”'), -1, 6)
              drawn = true
            }
          }
        }
        shown.push({ actionId: action.actionId, itemId: item.id, kind: item.kind, nodeId: item.nodeId ?? null,
          ghostId: item.kind === 'add' && item.nodeId ? ghostIdOf(item.nodeId) : null, label: name, box, controls: drawn, frame })
      }
    }
    groupList = groups
    shownList = shown
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

  function sync(force = false) {
    if (destroyed) return
    syncGhosts()
    render(force)
  }

  // Follow the view and the notes: a pan, a zoom or a moved note redraws the overlay (only while something waits).
  const watch = setInterval(() => { if (!destroyed && pendingItems(actions).length) render(false) }, 250)

  function all(actionId: string, keep: boolean) {
    if (!canAct()) return
    const whole = keep ? options.onKeepAll : options.onDiscardAll
    if (whole) return whole(actionId)
    // Lines follow their ends; an action of lines only keeps or discards its lines.
    const mine = pendingItems(actions).filter(({ action }) => action.actionId === actionId)
    const adds = mine.some(({ item }) => item.kind === 'add')
    for (const { item } of mine) if (!adds || item.kind !== 'link') (keep ? options.onKeep : options.onDiscard)?.({ actionId, itemId: item.id })
  }

  const api: AgentSuggestions = {
    set(next) {
      if (destroyed) return
      actions = Array.isArray(next) ? next.filter(action => action && typeof action.actionId === 'string') : []
      sync()
    },
    shown: () => shownList.map(item => ({ ...item, box: item.box && { ...item.box }, frame: item.frame && { ...item.frame } })),
    groups: () => groupList.map(g => ({ ...g })),
    keep(ref) { if (canAct()) options.onKeep?.(ref) },
    discard(ref) { if (canAct()) options.onDiscard?.(ref) },
    // Without the host's own Keep all, each waiting item of the action is kept or discarded in turn.
    keepAll: id => all(id, true),
    discardAll: id => all(id, false),
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
