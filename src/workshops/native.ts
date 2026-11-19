/**
 * native.ts - run a workshop as real notes on a live Slate.
 *
 * attachWorkshop draws a validated workshop model onto a Slate the host already
 * has (pan, zoom, minimap, selection, inline editing and all) and keeps the notes
 * in step with the model. The model stays the one saved source of truth: the notes
 * are its drawing, they are never written into the slate's own document, and the
 * workshop's rules decide where a card may be dropped.
 *
 * Plain JavaScript, no React. The only thing it asks of the engine is the drag
 * policy in core/DragPolicy.ts.
 */

import { v1AssociationToV2, v1NodeToV2 } from '../core/compat'
import { prefersReducedMotion, type DragPolicy, type NodeCapabilities, type WorldPoint } from '../core/DragPolicy'
import {
  validateWorkshop, workshopCandidate, workshopDestinations, workshopLaneCaption, workshopNodeIds,
  workshopRefusal, workshopToSlate, type Workshop,
} from './model'

/** What a person changed. A move names the card and its new lane; a rename names the lane or card and its new label. */
export interface WorkshopChangeEvent {
  cardId?: string
  laneId?: string
  rename?: { laneId?: string; cardId?: string; label: string }
}

/** A change the workshop's rules did not allow, with the reason as a sentence (empty when the card was dropped outside every lane). */
export interface WorkshopRefusalEvent {
  cardId?: string
  laneId?: string | null
  rename?: { laneId?: string; cardId?: string; label: string }
  reason: string
}

/**
 * Chooses the board a pointer position means while a card is held. Called once as
 * the drag begins with the board, the card and where on the card it was grabbed;
 * returns a function from a pointer position (in board coordinates: world units
 * from the artwork's origin) to the board that a drop there would produce. Return
 * null to leave the choice to the lane under the pointer.
 */
export type WorkshopCandidateChooser = (board: Workshop, cardId: string, grab: { x: number; y: number }) =>
  ((point: { x: number; y: number }) => Workshop) | null

export interface AttachWorkshopOptions {
  /** A move or rename was committed. `next` is validated; the host persists it. */
  onChange?: (next: Workshop, change: WorkshopChangeEvent) => void
  /** A drop or rename was refused. */
  onRefuse?: (refusal: WorkshopRefusalEvent) => void
  /** The board a held or keyboard-staged card would produce, or null when there is none. */
  onPreview?: (candidate: Workshop | null) => void
  /** Draw the same artwork with nothing draggable or editable. */
  readOnly?: boolean
  /** Top-left corner of the artwork in world units. Defaults to the right of what the slate already holds. */
  origin?: { x: number; y: number }
  /** Replace how a pointer position picks among the legal boards (see dragologyCandidates). */
  chooseCandidate?: WorkshopCandidateChooser
}

export interface AttachedWorkshop {
  /** Redraw from a new model, moving only what changed. A drag in progress is cancelled first. */
  update(next: Workshop): void
  /** Show a proposed model without committing it; null restores the committed one. Cards cannot be moved while a proposal is shown. */
  preview(candidate: Workshop | null): void
  /** Switch between playable and view-only. */
  setReadOnly(readOnly: boolean): void
  /**
   * Show the refusal cue on a lane (outline, reason on its caption, announcement)
   * for a move the host itself had to turn down, such as a save that lost a race.
   */
  refuse(laneId: string, reason: string): void
  /** Remove the workshop's notes and its policy. Every other note on the slate is left as it was. */
  destroy(): void
  /** The committed model. */
  readonly value: Workshop
  /** Where the artwork's top-left corner is, in world units. */
  readonly origin: { x: number; y: number }
  /** Resolves once the artwork for the current model is on the slate. */
  whenDrawn(): Promise<void>
}

type Kind = 'lane' | 'card' | 'caption' | 'column' | 'image'
type Outcome =
  | { kind: 'outside' }
  | { kind: 'home' }
  | { kind: 'refused'; laneId: string; reason: string }
  | { kind: 'candidate'; laneId: string; next: Workshop }

const ACCEPT = '#1f7a5c', OFFER = '#5b9a85', REFUSE = '#c2410c'
const decoration: Partial<NodeCapabilities> = { canMove: false, canSelect: false }

function kindOf(id: string): { kind: Kind; key: string } | null {
  const match = /^(lane|card|caption|column|image)-(.+)$/.exec(id)
  return match ? { kind: match[1] as Kind, key: match[2] } : null
}

/**
 * Draw `workshop` on `slate` as native notes and let people play it.
 *
 * @example
 * const board = attachWorkshop(slate, model, {
 *   onChange: (next, change) => save(next),
 *   onRefuse: ({ reason }) => toast(reason),
 * })
 * board.update(modelFromServer)
 * board.destroy()
 */
export function attachWorkshop(slate: any, workshop: Workshop, options: AttachWorkshopOptions = {}): AttachedWorkshop {
  let value = validateWorkshop(workshop)
  let proposal: Workshop | null = null
  let readOnly = Boolean(options.readOnly)
  let destroyed = false
  const owned = new Map<string, any>()
  const drawn = new Map<string, Record<string, any>>()
  const links = new Map<string, { parentId: string; childId: string; parent: any; child: any }>()
  /** Names the workshop could not draw because the slate's own document holds a note by that name. */
  const taken = new Set<string>()
  let held: { cardId: string; evaluate: ((point: { x: number; y: number }) => Workshop) | null; outcome: Outcome } | null = null
  let staged: { cardId: string; laneId: string; next: Workshop } | null = null
  let flash: { laneId: string; reason: string; timer: ReturnType<typeof setTimeout> } | null = null
  let pending: Promise<void> = Promise.resolve()
  let wanted: { model: Workshop; skip?: string; animate: boolean } | null = null

  const origin = options.origin ? { x: options.origin.x, y: options.origin.y } : besideExistingContent(slate)

  const names = artworkIds(value)
  for (const node of slate.nodes.allNodes) {
    if (names.has(node.id)) {
      throw new Error(`This slate already has a note named "${node.id}". A workshop draws its own lane and card notes.`)
    }
  }

  const policy: DragPolicy = {
    governs(node: any) {
      if (owned.get(node.id) !== node) return null
      const kind = kindOf(node.id)?.kind
      if (kind === 'card') return { canMove: !readOnly, canEditText: !readOnly && !proposal && value.kind !== 'release-plan' }
      if (kind === 'lane') return { canMove: false, canEditText: !readOnly && !proposal }
      return decoration
    },
    onStart(node: any, point) {
      const cardId = kindOf(node.id)!.key
      if (readOnly || proposal || !value.cards.some(card => card.id === cardId)) return false
      endFlash()
      clearStaged()
      const grab = { x: point.x - (node.options.x ?? 0), y: point.y - (node.options.y ?? 0) }
      let evaluate: ((point: { x: number; y: number }) => Workshop) | null = null
      try {
        evaluate = options.chooseCandidate?.(value, cardId, grab) ?? null
      } catch (error) {
        console.warn('WORKSHOP: chooseCandidate threw; using the lane under the pointer', error)
      }
      held = { cardId, evaluate, outcome: { kind: 'home' } }
      draw(value, { skip: cardId })
      return true
    },
    onMove(_node, point) {
      if (!held) return
      const outcome = decide(held.cardId, point, held.evaluate)
      if (sameOutcome(outcome, held.outcome)) return
      held.outcome = outcome
      const candidate = outcome.kind === 'candidate' ? outcome.next : null
      draw(candidate ?? value, { skip: held.cardId })
      tell(options.onPreview, candidate)
    },
    onEnd(node: any, point) {
      if (!held) return { accept: false }
      const { cardId, evaluate } = held
      const outcome = decide(cardId, point, evaluate)
      const card = value.cards.find(item => item.id === cardId)!
      held = null
      tell(options.onPreview, null)
      if (outcome.kind === 'candidate') {
        value = outcome.next
        draw(value, { skip: cardId })
        const lane = value.lanes.find(item => item.id === outcome.laneId)!
        slate.announce?.(`${card.label} moved to ${lane.label}. ${workshopLaneCaption(value, lane.id)}.`)
        tell(options.onChange, value, { cardId, laneId: outcome.laneId })
        const slot = slotOf(value, node.id)
        return slot ? { accept: true, settle: slot } : { accept: true }
      }
      if (outcome.kind === 'refused') {
        refuse(card.label, { cardId, laneId: outcome.laneId, reason: outcome.reason })
      } else {
        draw(value, { skip: cardId })
        if (outcome.kind === 'outside') {
          slate.announce?.(`${card.label} was not dropped on a lane. It stays where it was.`)
          tell(options.onRefuse, { cardId, laneId: null, reason: '' })
        }
      }
      return { accept: false }
    },
    onCancel(node: any) {
      const card = held && value.cards.find(item => item.id === held!.cardId)
      held = null
      tell(options.onPreview, null)
      draw(value, { skip: node.id.replace(/^card-/, '') })
      if (card) slate.announce?.(`Move cancelled. ${card.label} stays where it was.`)
    },
    onTextCommit(node: any, text, previous) {
      const target = kindOf(node.id)
      if (!target || readOnly || proposal) return false
      const label = text.replace(/\s+/g, ' ').trim()
      const rename = target.kind === 'lane' ? { laneId: target.key, label } : { cardId: target.key, label }
      let next: Workshop
      try {
        next = validateWorkshop(target.kind === 'lane'
          ? { ...value, lanes: value.lanes.map(lane => lane.id === target.key ? { ...lane, label } : lane) }
          : { ...value, cards: value.cards.map(card => card.id === target.key ? { ...card, label } : card) })
      } catch (error) {
        const reason = error instanceof Error ? error.message : 'That name is not allowed.'
        slate.announce?.(`${previous} keeps its name. ${reason}`)
        tell(options.onRefuse, { ...(target.kind === 'lane' ? { laneId: target.key } : { cardId: target.key }), rename, reason })
        return false
      }
      if (label === previous) return false
      value = next
      draw(value)
      slate.announce?.(`${previous} renamed to ${label}.`)
      tell(options.onChange, value, { rename })
      return label
    },
    onKeyDown(node: any, event) {
      const target = kindOf(node.id)
      if (target?.kind !== 'card' || readOnly || proposal || held) return false
      if (event.ctrlKey || event.metaKey || event.altKey) return false
      const card = value.cards.find(item => item.id === target.key)
      if (!card) return false
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        stage(card.id, event.key === 'ArrowLeft' ? -1 : 1)
        return true
      }
      if (staged?.cardId !== card.id) return false
      if (event.key === 'Enter') {
        event.preventDefault()
        const { laneId, next } = staged
        staged = null
        value = next
        draw(value)
        tell(options.onPreview, null)
        const lane = value.lanes.find(item => item.id === laneId)!
        slate.announce?.(`${card.label} moved to ${lane.label}. ${workshopLaneCaption(value, laneId)}.`)
        tell(options.onChange, value, { cardId: card.id, laneId })
        return true
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        clearStaged()
        slate.announce?.(`Move cancelled. ${card.label} stays where it was.`)
        return true
      }
      return false
    },
    onNotesReplaced() {
      // loadJSON / undo / redo cleared every note, ours included.
      const selected: string[] = (slate.getSelectedNodes?.() ?? []).filter((node: any) => owned.get(node.id) === node).map((node: any) => node.id)
      owned.clear()
      drawn.clear()
      links.clear()
      held = null
      staged = null
      draw(proposal ?? value, { animate: false })
      // The card or lane that was selected is a new note now; a person working by
      // keyboard keeps their place on it.
      if (selected.length === 1) {
        pending = pending.then(() => {
          const node = owned.get(selected[0])
          if (destroyed || !node || (slate.getSelectedNodes?.() ?? []).length) return
          const select = () => slate.selectNodes?.([node])
          if (typeof slate.withoutAnnouncements === 'function') slate.withoutAnnouncements(select)
          else select()
        })
      }
    },
  }

  const release = slate.setDragPolicy(policy)
  // Any press on the slate ends a keyboard-staged move: the person has moved on.
  const onPress = () => { if (staged) clearStaged() }
  slate.element?.addEventListener?.('pointerdown', onPress, true)
  draw(value, { animate: false })

  // ─── Rules ───────────────────────────────────────────────────────

  /** What dropping the card at `point` would do. */
  function decide(cardId: string, point: WorldPoint, evaluate: ((point: { x: number; y: number }) => Workshop) | null): Outcome {
    const card = value.cards.find(item => item.id === cardId)
    if (!card) return { kind: 'outside' }
    const columns = value.lanes.map(lane => owned.get(workshopNodeIds.column(lane.id))).filter(Boolean)
    // Columns are drawn 4 units apart; the padding closes that seam.
    const hit = slate.hitTestNodes(point, columns, { padding: 2 })
    const laneId = hit ? kindOf(hit.id)!.key : null
    if (!laneId) return { kind: 'outside' }
    if (laneId === card.laneId) return { kind: 'home' }
    const allowed = workshopCandidate(value, cardId, laneId)
    if (!allowed) return { kind: 'refused', laneId, reason: workshopRefusal(value, cardId, laneId) ?? 'That move is not available.' }
    if (!evaluate) return { kind: 'candidate', laneId, next: allowed }
    // The chooser (Dragology's spec, when the host supplies it) picks among the legal boards.
    let chosen: Workshop | null = null
    try {
      chosen = evaluate({ x: point.x - origin.x, y: point.y - origin.y })
    } catch (error) {
      console.warn('WORKSHOP: the candidate chooser threw; using the lane under the pointer', error)
      return { kind: 'candidate', laneId, next: allowed }
    }
    const chosenLane = chosen?.cards.find(item => item.id === cardId)?.laneId
    if (!chosen || !chosenLane || chosenLane === card.laneId) return { kind: 'home' }
    return { kind: 'candidate', laneId: chosenLane, next: chosen }
  }

  function stage(cardId: string, step: -1 | 1) {
    const card = value.cards.find(item => item.id === cardId)!
    const lanes = workshopDestinations(value, cardId)
    const at = staged?.cardId === cardId ? staged.laneId : card.laneId
    const target = lanes[lanes.findIndex(lane => lane.id === at) + step]
    endFlash()
    if (!target) {
      // A lane on that side that the rules close gets the same refusal a drop on it
      // would: the cue on the lane, the reason announced, and onRefuse.
      const closed = value.lanes[value.lanes.findIndex(lane => lane.id === at) + step]
      if (!closed) {
        slate.announce?.(`${card.label} has no lane to move to on that side.`)
        return
      }
      const reason = workshopRefusal(value, cardId, closed.id) ?? 'That move is not available.'
      flash = { laneId: closed.id, reason, timer: setTimeout(() => endFlash(), 1500) }
      draw(staged?.next ?? proposal ?? value)
      slate.announce?.(`${card.label} can't move to ${closed.label}. ${reason}`)
      tell(options.onRefuse, { cardId, laneId: closed.id, reason })
      return
    }
    if (target.id === card.laneId) {
      clearStaged()
      slate.announce?.(`${card.label} is back in ${target.label}.`)
      return
    }
    const next = workshopCandidate(value, cardId, target.id)!
    staged = { cardId, laneId: target.id, next }
    draw(next)
    tell(options.onPreview, next)
    slate.announce?.(`${card.label} to ${target.label}: ${workshopLaneCaption(next, target.id)}. Press Enter to move it, Escape to cancel.`)
  }

  function clearStaged() {
    if (!staged) return
    staged = null
    tell(options.onPreview, null)
    draw(proposal ?? value)
  }

  function refuse(cardLabel: string, refusal: { cardId: string; laneId: string; reason: string }) {
    endFlash(false)
    flash = { laneId: refusal.laneId, reason: refusal.reason, timer: setTimeout(() => endFlash(), 1500) }
    draw(value, { skip: refusal.cardId })
    const lane = value.lanes.find(item => item.id === refusal.laneId)
    slate.announce?.(`${cardLabel} can't move to ${lane?.label ?? 'that lane'}. ${refusal.reason}`)
    tell(options.onRefuse, refusal)
  }

  function endFlash(redraw = true) {
    if (!flash) return
    clearTimeout(flash.timer)
    flash = null
    if (redraw && !destroyed) showCurrent()
  }

  /**
   * Draw again what is on show at this moment: the board a held card is over, a move
   * staged from the keyboard, a host's proposal, or the committed board. A card in
   * the hand stays in the hand.
   */
  function showCurrent() {
    draw(held && held.outcome.kind === 'candidate' ? held.outcome.next : staged?.next ?? proposal ?? value, { skip: held?.cardId })
  }

  // ─── Drawing ─────────────────────────────────────────────────────

  /** The notes for `model`, with the cues of the moment (legal lanes, the lane under the pointer, a refusal) laid over them. */
  function artwork(model: Workshop) {
    // While a card is held or staged the columns keep the committed board's height,
    // so the lane under the pointer does not change shape beneath it.
    const rows = held || staged ? Math.max(...value.lanes.map(lane => value.cards.filter(card => card.laneId === lane.id).length)) : 0
    const nodes = workshopToSlate(model, { native: true, origin, rows }).nodes
    const byId = new Map(nodes.map(node => [node.options.id as string, node.options]))
    const outline = (laneId: string, color: string, width: number, header = false) => {
      const column = byId.get(workshopNodeIds.column(laneId))
      if (column) { column.borderColor = color; column.borderWidth = width; delete column.borderStyle }
      const lane = header && byId.get(workshopNodeIds.lane(laneId))
      if (lane) { lane.borderColor = color; lane.borderWidth = width }
    }
    const moving = held?.cardId ?? staged?.cardId
    if (moving) {
      const from = value.cards.find(card => card.id === moving)?.laneId
      for (const lane of workshopDestinations(value, moving)) if (lane.id !== from) outline(lane.id, OFFER, 2)
      const over = held ? held.outcome : staged ? { kind: 'candidate' as const, laneId: staged.laneId } : null
      if (over?.kind === 'candidate') outline(over.laneId, ACCEPT, 3, true)
      if (over?.kind === 'refused') outline(over.laneId, REFUSE, 3)
    }
    if (flash) {
      outline(flash.laneId, REFUSE, 3, true)
      const caption = byId.get(workshopNodeIds.caption(flash.laneId))
      if (caption) { caption.text = flash.reason; caption.foregroundColor = '#b42318' }
    }
    return nodes
  }

  function draw(model: Workshop, how: { skip?: string; animate?: boolean } = {}) {
    if (destroyed) return
    wanted = { model, skip: how.skip, animate: how.animate !== false }
    const nodes = artwork(model)
    const waiting: Promise<void>[] = []
    for (const { options: v1 } of nodes) {
      const id = v1.id as string
      if (owned.has(id)) continue
      // A note of the slate's own that already has this name (a loaded document can
      // hold one) stays that document's note: it is never taken over, hidden from
      // saves or removed with the workshop. The workshop goes without that note.
      if (slate.nodes.one?.(id)) {
        if (!taken.has(id)) console.warn(`WORKSHOP: the slate already has a note named "${id}"; the workshop cannot draw its own.`)
        taken.add(id)
        continue
      }
      taken.delete(id)
      const node = slate.nodes.add(v1NodeToV2(v1))
      owned.set(id, node)
      drawn.set(id, { ...v1 })
      if (node.ready) waiting.push(node.ready.then(() => {
        if (owned.get(id) !== node) return
        node.applyGovernance?.()
        if (kindOf(id)?.kind === 'column') node.toBack?.(false)
        const label = accessibleName(wanted?.model ?? model, id)
        if (label) node.svgGroup?.node?.setAttribute('aria-label', label)
      }).catch(() => undefined))
    }
    const request = wanted
    pending = Promise.all([pending, ...waiting]).then(() => {
      // Only the latest request is applied; earlier ones were superseded while notes were being created.
      if (destroyed || wanted !== request) return
      settle(artwork(request.model), request)
    }).catch(error => console.warn('WORKSHOP: could not draw the workshop', error))
  }

  function settle(nodes: ReturnType<typeof artwork>, how: { model: Workshop; skip?: string; animate: boolean }) {
    const keep = new Set(nodes.map(node => node.options.id as string))
    const selected: any[] = slate.getSelectedNodes?.() ?? []
    slate.withPolicyAuthority(() => {
      for (const [id, node] of [...owned]) {
        if (keep.has(id)) continue
        for (const [linkId, link] of [...links]) {
          if (link.parentId !== id && link.childId !== id) continue
          link.parent.relationships?.removeAssociation(linkId)
          links.delete(linkId)
        }
        slate.deselectNode?.(node)
        node.editor?.cancelInline?.()
        owned.delete(id)
        drawn.delete(id)
        slate.nodes.remove(id)
      }
      for (const { options: v1 } of nodes) {
        const id = v1.id as string
        const node = owned.get(id)
        if (!node?.svgGroup) continue
        const before = drawn.get(id) ?? {}
        const editing = node.editor?.isInlineEditing?.()
        if (v1.fontSize !== before.fontSize || v1.foregroundColor !== before.foregroundColor) {
          node.options.fontSize = v1.fontSize
          node.options.fontColor = v1.foregroundColor
          node.applyTextStyle?.()
        }
        if (v1.text !== before.text && !editing) node.setText?.(v1.text)
        if (v1.width !== before.width || v1.height !== before.height) {
          if (v1.vectorPath) {
            node.options.width = v1.width
            node.options.height = v1.height
            node.setShape?.(node.options.shape, v1.vectorPath)
            if (kindOf(id)?.kind === 'column') node.toBack?.(false)
          } else node.setSize?.(v1.width, v1.height)
        }
        if (v1.backgroundColor !== before.backgroundColor) node.setColors?.(v1.backgroundColor)
        if (v1.borderColor !== before.borderColor || v1.borderWidth !== before.borderWidth || v1.borderStyle !== before.borderStyle) {
          node.options.borderColor = v1.borderColor
          node.options.borderWidth = v1.borderWidth
          node.options.borderStyle = v1.borderStyle
          node.applyBorder?.()
        }
        const placed = v1.xPos !== before.xPos || v1.yPos !== before.yPos ||
          Math.abs((node.options.x ?? 0) - v1.xPos) > 0.5 || Math.abs((node.options.y ?? 0) - v1.yPos) > 0.5
        // The held card is under the pointer; the engine settles it or glides it back.
        if (id !== (how.skip && workshopNodeIds.card(how.skip)) && placed) {
          // A selected note takes its outline with it (a card staged or moved from the
          // keyboard, or moved by a new model, is still the selection). The outline is
          // put away while the note glides and comes back where it comes to rest, as
          // after a drag, so it is never left round the place the note has just left.
          const glide = how.animate && !prefersReducedMotion() ? 180 : 0
          const outline = selected.includes(node) ? () => {
            if (!destroyed && owned.get(id) === node && (slate.getSelectedNodes?.() ?? []).includes(node)) slate.updateSelectionResizeRotate?.()
          } : undefined
          if (outline && glide && selected.length === 1) node.resizeRotate?.disable?.()
          node.position(v1.xPos, v1.yPos, outline, undefined, glide)
        }
        const label = accessibleName(how.model, id)
        if (label && node.svgGroup.node.getAttribute('aria-label') !== label) node.svgGroup.node.setAttribute('aria-label', label)
        drawn.set(id, { ...v1 })
      }
      const wantedLinks = new Map<string, Record<string, any>>()
      for (const node of nodes) for (const link of node.relationships.associations) wantedLinks.set(link.id as string, link)
      for (const [linkId, link] of [...links]) {
        if (wantedLinks.has(linkId) && owned.get(link.parentId) === link.parent && owned.get(link.childId) === link.child) continue
        link.parent.relationships?.removeAssociation(linkId)
        links.delete(linkId)
      }
      for (const [linkId, link] of wantedLinks) {
        if (links.has(linkId)) continue
        const parent = owned.get(link.parentId), child = owned.get(link.childId)
        if (!parent?.relationships || !child?.svgGroup) continue
        parent.relationships.addAssociation(child, v1AssociationToV2(link))
        links.set(linkId, { parentId: link.parentId, childId: link.childId, parent, child })
      }
    })
    slate.notifyNodeChanged?.()
  }

  /** What a screen reader calls a lane or a card: its name, and for a lane how full it is. */
  function accessibleName(model: Workshop, id: string) {
    const target = kindOf(id)
    if (target?.kind === 'lane') {
      const lane = model.lanes.find(item => item.id === target.key)
      return lane ? `${lane.label}, ${workshopLaneCaption(model, lane.id)}` : null
    }
    if (target?.kind === 'card') {
      const card = model.cards.find(item => item.id === target.key)
      const lane = card && model.lanes.find(item => item.id === card.laneId)
      return card && lane ? `${card.label}, in ${lane.label}` : null
    }
    return null
  }

  function slotOf(model: Workshop, nodeId: string) {
    const options = workshopToSlate(model, { native: true, origin }).nodes.find(node => node.options.id === nodeId)?.options
    return options ? { x: options.xPos as number, y: options.yPos as number } : null
  }

  function cancelGestures() {
    if (held) slate.cancelGovernedDrag?.('host')
    held = null
    if (staged) { staged = null; tell(options.onPreview, null) }
    endFlash(false)
  }

  return {
    get value() { return value },
    get origin() { return { ...origin } },
    whenDrawn: () => pending,
    update(next) {
      if (destroyed) throw new Error('This workshop has been detached.')
      const model = validateWorkshop(next)
      cancelGestures()
      value = model
      draw(proposal ?? value)
    },
    preview(candidate) {
      if (destroyed) throw new Error('This workshop has been detached.')
      const model = candidate ? validateWorkshop(candidate) : null
      cancelGestures()
      proposal = model
      draw(proposal ?? value)
      slate.refreshGovernance?.()
    },
    refuse(laneId, reason) {
      const lane = value.lanes.find(item => item.id === laneId)
      if (destroyed || !lane) return
      endFlash(false)
      flash = { laneId, reason, timer: setTimeout(() => endFlash(), 1500) }
      showCurrent()
      slate.announce?.(`${lane.label}: ${reason}`)
    },
    setReadOnly(next) {
      if (destroyed || readOnly === Boolean(next)) return
      cancelGestures()
      readOnly = Boolean(next)
      draw(proposal ?? value)
      slate.refreshGovernance?.()
    },
    destroy() {
      if (destroyed) return
      cancelGestures()
      destroyed = true
      slate.element?.removeEventListener?.('pointerdown', onPress, true)
      slate.withPolicyAuthority(() => {
        for (const [linkId, link] of links) link.parent.relationships?.removeAssociation(linkId)
        for (const [id, node] of owned) {
          slate.deselectNode?.(node)
          node.editor?.cancelInline?.()
          if (slate.nodes.one(id) === node) slate.nodes.remove(id)
        }
      })
      links.clear()
      owned.clear()
      drawn.clear()
      release()
      slate.notifyNodeChanged?.()
    },
  }
}

/**
 * Call a host callback. One that throws is reported and otherwise ignored: by then
 * the workshop has already made up its mind, and its notes must end up where its
 * model says whatever becomes of the host's own code.
 */
function tell<A extends unknown[]>(callback: ((...args: A) => void) | undefined, ...args: A) {
  try {
    callback?.(...args)
  } catch (error) {
    console.error('WORKSHOP: a host callback threw', error)
  }
}

function sameOutcome(a: Outcome, b: Outcome) {
  // The committed board does not change while a card is held, so the same lane means the same candidate.
  return a.kind === b.kind && (a as any).laneId === (b as any).laneId
}

function artworkIds(model: Workshop) {
  return new Set(workshopToSlate(model, { native: true }).nodes.map(node => node.options.id as string))
}

/** To the right of whatever the slate already holds, level with its top; a small margin on an empty slate. */
function besideExistingContent(slate: any) {
  const nodes: any[] = slate.nodes?.allNodes ?? []
  if (!nodes.length) return { x: 40, y: 40 }
  let right = -Infinity, top = Infinity
  for (const node of nodes) {
    right = Math.max(right, (node.options.x ?? 0) + (node.options.width ?? 0))
    top = Math.min(top, node.options.y ?? 0)
  }
  return { x: Math.round(right + 80), y: Math.round(top) }
}
