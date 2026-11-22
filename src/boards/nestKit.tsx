// Nest kit (dragology final.md §3.4, §3.5, §5 gaps 2, 5, 6): lists in lists on a live slate, as real notes.
// Three layouts of one board: piles (clusters: a pile's notes stacked under it, piles side by side, ranked by
// the rank rule), a tree (outcome over opportunities over solutions, joined by lines) and, on a phone, an
// outline (44px rows, indented by depth). A held card is carried by Dragology to the nearest place the rules
// allow (d.closest over every legal slot under every card, withFloating, whenFar); everything under it comes
// with it. Held over a card it may not go under, the rule says why. Let go in empty space on the piles, the
// empty-drop rule says where it goes (a new pile, or the tray). In an outline a card dragged right goes
// under the row above it, and left comes out: indent and outdent are where the card is let go.
import {
  type BoardLayerState, type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopCard, type WorkshopEdit,
} from '../workshops/model'
import { nestRules, checkNest, nestAreas, nestCardText, nestEmptyDrop, nestKids, nestLegal, nestPlace, nestRoots, nestSubtree, type NestSpot } from '../workshops/nest'
import { createBoardLayer, layerInk, type LayerShape } from '../workshops/boardLayer'
import { headlessDrag, inside, partsGeometry } from '../workshops/boardSpecs'
import { tint } from './shared'
import { partNotes } from './readouts'

const fills: Record<string, string> = { pile: '#fbdfac', theme: '#efd7dc', outcome: '#d5e9e3', opportunity: '#dedef4', problem: '#efd7dc', cause: '#fbdfac', action: '#dcebf3' }
const fillOf = (card: WorkshopCard) => fills[card.role ?? ''] ?? '#fffdf6'
const CARD = 64, GAP = 8, TRAY = 220, TOP = 84

type Shape = 'clusters' | 'tree' | 'outline'
const shapeOf = (board: Workshop, layout: WorkshopBoardLayout): Shape => layout.narrow ? 'outline' : board.nest?.layout ?? 'clusters'

/** The cards in drawing order: the top of an area (ranked), each followed by what is under it. */
function walk(board: Workshop, laneId: string): { card: WorkshopCard; depth: number }[] {
  const out: { card: WorkshopCard; depth: number }[] = []
  const visit = (card: WorkshopCard, depth: number) => {
    out.push({ card, depth })
    for (const kid of nestKids(board, card.id)) visit(kid, depth + 1)
  }
  for (const root of nestRoots(board, laneId)) visit(root, 0)
  return out
}

// A card's words come from the rules module (what a pile counts), so the drawing and every sentence agree.
const text = nestCardText

/** Where every note of a nest board goes, in board coordinates. */
export function nestLayout(board: Workshop, layout: WorkshopBoardLayout = {}): { parts: PartPlace[]; width: number; height: number } {
  const shape = shapeOf(board, layout)
  const { main, tray } = nestAreas(board)
  const parts: PartPlace[] = []
  const header = (laneId: string, x: number, y: number, width: number, caption: string) => {
    parts.push({ name: 'lane-' + laneId, x, y, width, height: 40, text: board.lanes.find(lane => lane.id === laneId)!.label, fill: laneId === tray ? '#e9e5da' : '#d5e9e3', fontSize: 16 })
    parts.push({ name: 'caption-' + laneId, x, y: y + 44, width, height: 26, text: caption, fill: 'transparent', lineWidth: 0, fontSize: 14 })
  }
  const caption = (laneId: string) => nestRules.caption(board, laneId)
  const card = (item: WorkshopCard, x: number, y: number, width: number, height = CARD) =>
    parts.push({ name: 'card-' + item.id, x, y, width, height, text: text(board, item), fill: fillOf(item), fontSize: 14 })

  if (shape === 'outline') {
    // One column: the board's rows, then the tray's. A row's indent is its depth.
    const width = Math.max(300, layout.width ?? 358)
    let y = 0
    for (const laneId of [main, tray]) {
      const top = y
      header(laneId, 8, y + 6, width - 16, caption(laneId))
      y += 82
      for (const { card: item, depth } of walk(board, laneId)) {
        card(item, 8 + 20 * depth, y, width - 16 - 20 * depth, 44)
        y += 52
      }
      y += 44
      parts.unshift({ name: 'column-' + laneId, x: 2, y: top, width: width - 4, height: y - top, fill: tint(laneId === tray ? '#e9e5da' : '#d5e9e3', 0.6), line: tint('#d5e9e3', 0.1) })
      y += 10
    }
    return { parts, width, height: y }
  }

  // The tray, down the left.
  const loose = walk(board, tray)
  header(tray, 8, 6, TRAY - 16, caption(tray))
  loose.forEach(({ card: item }, i) => card(item, 8, TOP + i * (CARD + GAP), TRAY - 16))
  const trayHeight = TOP + Math.max(1, loose.length + 1) * (CARD + GAP)
  const left = TRAY + 16
  let width: number, height: number
  if (shape === 'clusters') {
    // Piles side by side, four to a row; each pile's cards stacked under it, indented by depth.
    const pitch = 220, perRow = 4, roots = nestRoots(board, main)
    let y = TOP, rowHeight = 0
    roots.forEach((root, i) => {
      if (i && i % perRow === 0) { y += rowHeight + 16; rowHeight = 0 }
      const x = left + (i % perRow) * pitch
      let at = y
      const block = (item: WorkshopCard, depth: number) => {
        card(item, x + 12 * depth, at, 208 - 12 * depth, depth ? CARD : 56)
        at += (depth ? CARD : 56) + 6
        for (const kid of nestKids(board, item.id)) block(kid, depth + 1)
      }
      block(root, 0)
      rowHeight = Math.max(rowHeight, at - y)
    })
    // Room after the last pile: empty space, where a card let go starts a pile (or goes to the tray).
    width = left + perRow * pitch + 8
    height = Math.max(trayHeight, y + rowHeight + CARD + 40)
    header(main, left, 6, Math.min(width - left - 8, 640), caption(main))
  } else {
    // A tree: each card centred over what is under it; the leaves side by side.
    const step = 192, rise = CARD + 44
    let next = 0, deepest = 0
    const place = (item: WorkshopCard, depth: number): number => {
      deepest = Math.max(deepest, depth)
      const kids = nestKids(board, item.id)
      const xs = kids.map(kid => place(kid, depth + 1))
      const slot = xs.length ? (xs[0] + xs[xs.length - 1]) / 2 : next++
      card(item, left + slot * step, TOP + depth * rise, 176)
      return slot
    }
    for (const root of nestKids(board, null, main)) place(root, 0)
    width = left + Math.max(3, next) * step + 8
    height = Math.max(trayHeight, TOP + (deepest + 1) * rise + 56)
    header(main, left, 6, Math.min(width - left - 8, 640), caption(main))
  }
  parts.unshift({ name: 'column-' + main, x: left - 6, y: 0, width: width - left + 4, height, fill: tint('#d5e9e3', 0.75), line: tint('#d5e9e3', 0.1) },
    { name: 'column-' + tray, x: 2, y: 0, width: TRAY - 4, height, fill: tint('#e9e5da', 0.5), line: tint('#e9e5da', 0.1) })
  return { parts, width, height }
}

/** The lines of a tree: from each card down to each card under it. */
function paint(board: Workshop, state: BoardLayerState): LayerShape[] {
  if (shapeOf(board, state.layout) !== 'tree') return []
  const { parts } = nestLayout(board, state.layout)
  const at = new Map(parts.map(part => [part.name, part]))
  return board.cards.flatMap(card => {
    const from = card.parentId && at.get('card-' + card.parentId), to = at.get('card-' + card.id)
    if (!from || !to) return []
    const x1 = from.x + from.width / 2, y1 = from.y + from.height, x2 = to.x + to.width / 2, y2 = to.y, mid = (y1 + y2) / 2
    return [{ t: 'path' as const, d: `M ${x1} ${y1} V ${mid} H ${x2} V ${y2}`, color: layerInk.week, width: 2 }]
  })
}

/** The card part under a point, leaving out `skip` (the held card and what is under it). */
function cardAt(parts: PartPlace[], point: { x: number; y: number }, skip: Set<string>): string | null {
  for (let i = parts.length - 1; i >= 0; i--) {
    const part = parts[i]
    if (part.name.startsWith('card-') && !skip.has(part.name.slice(5)) && inside(part, point)) return part.name.slice(5)
  }
  return null
}

/** The card a drop on `hit` goes under: in a tree the card itself; on piles and in an outline, a pile (or a card with cards under it) itself, otherwise the card it is in. */
function underFor(board: Workshop, shape: Shape, hit: string): string | null {
  const card = board.cards.find(item => item.id === hit)!
  if (card.laneId === nestAreas(board).tray) return null
  if (shape === 'tree' || !card.parentId || board.cards.some(item => item.parentId === hit)) return hit
  return card.parentId
}

/**
 * The place a card held over `hit` means: in a tree, under it; over a pile (or a card with cards under it),
 * into it, last; over any other card, beside it: before it, or after it when held over its lower half.
 */
function spotAt(board: Workshop, shape: Shape, hit: string, point: { x: number; y: number }, part: PartPlace, cardId: string): NestSpot {
  const card = board.cards.find(item => item.id === hit)!
  const under = underFor(board, shape, hit)
  if (under === hit) return { laneId: card.laneId, under: hit, before: null }
  const parent = card.parentId ?? null
  const siblings = (parent ? nestKids(board, parent) : nestKids(board, null, card.laneId)).filter(item => item.id !== cardId)
  const lower = point.y > part.y + part.height / 2
  return { laneId: card.laneId, under: parent, before: lower ? siblings[siblings.findIndex(item => item.id === hit) + 1]?.id ?? null : hit }
}

const same = (a: Workshop, b: Workshop) => a === b || JSON.stringify(a.cards) === JSON.stringify(b.cards)

/** The edits that turn one nest board into another: what a drag, a far drop, a key or a rename made. */
export function nestEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] {
  const edits: WorkshopEdit[] = []
  const was = new Map(before.cards.map(card => [card.id, card]))
  const done = new Set<string>()
  // A pile a far drop started, with the one card in it: start_pile.
  for (const pile of after.cards) {
    if (was.has(pile.id) || pile.parentId || pile.role !== 'pile') continue
    const kids = after.cards.filter(card => card.parentId === pile.id)
    if (kids.length !== 1 || !was.has(kids[0].id)) continue
    edits.push({ kind: 'start_pile', card: { id: kids[0].id }, ...(pile.label !== 'New pile' && { label: pile.label }) })
    done.add(pile.id).add(kids[0].id)
  }
  for (const card of after.cards) {
    if (done.has(card.id)) continue
    const old = was.get(card.id)
    if (!old) {
      edits.push({ kind: 'add_card', lane: { id: card.laneId }, label: card.label, ...(card.parentId && { under: { id: card.parentId } }),
        ...(card.role && { role: card.role }), ...(card.source && { source: card.source }) })
      continue
    }
    if (old.label !== card.label) edits.push({ kind: 'rename_card', card: { id: card.id }, label: card.label })
    // A card carried with the one above it keeps its parent and place: only what moved is said.
    if (old.parentId !== card.parentId || old.order !== card.order || (old.laneId !== card.laneId && !card.parentId)) {
      const siblings = card.parentId ? nestKids(after, card.parentId) : nestKids(after, null, card.laneId)
      const next = siblings[siblings.findIndex(item => item.id === card.id) + 1]
      edits.push({ kind: 'nest_card', card: { id: card.id }, ...(card.parentId ? { under: { id: card.parentId } } : { lane: { id: card.laneId } }), ...(next && { before: { id: next.id } }) })
    }
    if (card.role && old.role !== card.role) edits.push({ kind: 'set_role', card: { id: card.id }, role: card.role })
  }
  for (const card of before.cards) if (!after.cards.some(item => item.id === card.id)) edits.push({ kind: 'remove_card', card: { id: card.id } })
  for (const lane of after.lanes) {
    const old = before.lanes.find(item => item.id === lane.id)
    if (old && old.label !== lane.label) edits.push({ kind: 'rename_lane', lane: { id: lane.id }, label: lane.label })
  }
  if (after.nest && before.nest?.layout !== after.nest.layout) edits.push({ kind: 'set_layout', layout: after.nest.layout })
  if (before.title !== after.title) edits.push({ kind: 'rename_workshop', title: after.title })
  return edits
}

export const nestKit: WorkshopBoardKit = {
  laneCues: true,
  places: (board, layout) => nestLayout(board, layout),
  notes: (board, layout, origin, style) => partNotes(nestLayout(board, layout).parts, board, origin, style),
  editsBetween: nestEditsBetween,
  layer: slate => createBoardLayer(slate, paint),
  cardKeys: 'Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.',
  label(board, part) {
    const card = board.cards.find(item => 'card-' + item.id === part)
    if (!card) return null
    const parent = board.cards.find(item => item.id === card.parentId)
    return card.label + (card.role ? ', ' + card.role : '') + (parent ? ', under ' + parent.label : ', in ' + board.lanes.find(lane => lane.id === card.laneId)!.label)
  },
  chooser(board, cardId, grab, layout = {}) {
    const places = nestLegal(board, cardId)
    const legal = places.map(item => item.next)
    const { main, tray } = nestAreas(board)
    const card = board.cards.find(item => item.id === cardId)!
    const shape = shapeOf(board, layout)
    const choose = legal.length > 1 ? headlessDrag(board, 'card-' + cardId, grab, state => partsGeometry(nestLayout(state, layout).parts), (d, state) =>
      d.closest(legal, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(state, { gapIn: 40, gapOut: 56 })) : null
    const { parts } = nestLayout(board, layout)
    const moving = new Set(nestSubtree(board, cardId))
    let far: Workshop | null | undefined
    return point => {
      // Held over another card: the place that card means, when the rules allow it (an outline goes by depth instead).
      const hit = shape === 'outline' ? null : cardAt(parts, point, moving)
      if (hit) {
        const spot = spotAt(board, shape, hit, point, parts.find(part => part.name === 'card-' + hit)!, cardId)
        const found = places.find(item => item.spot.laneId === spot.laneId && item.spot.under === spot.under && item.spot.before === spot.before)
        if (found) return found.next
      }
      const chosen = choose ? choose(point) : board
      if (!same(chosen, board)) return chosen
      // Let go in the tray: the foot of the tray.
      if (card.laneId !== tray && inside(parts.find(part => part.name === 'column-' + tray), point)) {
        return nestPlace(board, cardId, { laneId: tray, under: null, before: null }) ?? board
      }
      // Let go in empty space on the board: where the empty-drop rule sends it.
      if (inside(parts.find(part => part.name === 'column-' + main), point) && !cardAt(parts, point, new Set())) {
        if (far === undefined) far = nestEmptyDrop(board, cardId)
        return far ?? board
      }
      return chosen
    }
  },
  refusalAt(board, cardId, _grab, point, layout) {
    const shape = shapeOf(board, layout)
    if (shape === 'outline') return null
    const { parts } = nestLayout(board, layout)
    const hit = cardAt(parts, point, new Set(nestSubtree(board, cardId)))
    const under = hit && underFor(board, shape, hit)
    const card = board.cards.find(item => item.id === cardId)!
    if (!under || under === card.parentId) return null
    const next = nestPlace(board, cardId, { laneId: nestAreas(board).main, under, before: null })
    const verdict = next && board.behaviour ? checkNest(board, next) : null
    return verdict && 'refused' in verdict ? { laneId: nestAreas(board).main, reason: verdict.refused.sentence } : null
  },
  noteUnder(board, point, layout) {
    const hit = cardAt(nestLayout(board, layout).parts, point, new Set())
    return hit ? underFor(board, shapeOf(board, layout), hit) : null
  },
  keyEdit(board, part, key) {
    const card = board.cards.find(item => 'card-' + item.id === part)
    if (!card) return null
    const siblings = card.parentId ? nestKids(board, card.parentId) : nestKids(board, null, card.laneId)
    const at = siblings.findIndex(item => item.id === card.id)
    const ref = { id: card.id }
    const where = (parentId: string | undefined) => parentId ? { under: { id: parentId } } : { lane: { id: card.laneId } }
    switch (key.key) {
      case 'ArrowRight':
        return at > 0 && card.laneId !== nestAreas(board).tray ? [{ kind: 'nest_card', card: ref, under: { id: siblings[at - 1].id } }] : null
      case 'ArrowLeft': {
        const parent = board.cards.find(item => item.id === card.parentId)
        if (!parent) return null
        const around = parent.parentId ? nestKids(board, parent.parentId) : nestKids(board, null, parent.laneId)
        const after = around[around.findIndex(item => item.id === parent.id) + 1]
        return [{ kind: 'nest_card', card: ref, ...where(parent.parentId), ...(after && { before: { id: after.id } }) }]
      }
      case 'ArrowUp':
        return at > 0 ? [{ kind: 'nest_card', card: ref, ...where(card.parentId), before: { id: siblings[at - 1].id } }] : null
      case 'ArrowDown':
        return at >= 0 && at < siblings.length - 1 ? [{ kind: 'nest_card', card: ref, ...where(card.parentId), ...(siblings[at + 2] && { before: { id: siblings[at + 2].id } }) }] : null
    }
    return null
  },
  handleDrag: () => null,
}
