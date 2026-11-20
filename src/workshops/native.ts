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

import { v1AssociationToV2, v1NodeToV2, v2NodeToV1 } from '../core/compat'
import { prefersReducedMotion, type DragPolicy, type NodeCapabilities, type WorldPoint } from '../core/DragPolicy'
import {
  validateWorkshop, workshopCandidate, workshopCardAsNote, workshopCardAsNoteRefusal, workshopCardLookOf, workshopDestinations,
  workshopLaneCaption, workshopLanePlaces, workshopNodeIds, workshopNoteCandidate, workshopNoteRefusal, workshopRefusal,
  workshopStandInId, workshopTakesNotes, workshopToSlate, type Workshop, type WorkshopBoardLayout, type WorkshopCard,
  type WorkshopCardAsNote, type WorkshopCardLook, type WorkshopNoteOffer, type WorkshopNoteStyle,
} from './model'
import { applyWorkshopEdits } from './edits'

/**
 * What a person changed. A move names the card and its new lane; a rename names the lane or
 * card and its new label. `noteToCard`: an ordinary note became card `cardId` at the foot of
 * `laneId`, or just before card `before` when that is where an undo puts it back (it left the
 * slate's drawing). `asNote` is what the note had that the card does not show (line breaks,
 * shape, size), kept for its way back. `cardToNote`: card `cardId` left the board and is now
 * the ordinary note `noteId` in the drawing.
 */
export interface WorkshopChangeEvent {
  cardId?: string
  laneId?: string
  rename?: { laneId?: string; cardId?: string; label: string }
  noteToCard?: { noteId: string; label: string; look?: WorkshopCardLook; asNote?: WorkshopCardAsNote; before?: string }
  cardToNote?: { noteId: string }
}

/**
 * A change the workshop's rules did not allow, with the reason as a sentence (empty when a card
 * that cannot become a note was dropped outside every lane). `noteId` names an ordinary note
 * a lane refused.
 */
export interface WorkshopRefusalEvent {
  cardId?: string
  noteId?: string
  laneId?: string | null
  rename?: { laneId?: string; cardId?: string; label: string }
  reason: string
}

/** The one workshop note that is selected: a card or a lane. Null when the selection is anything else. */
export type WorkshopSelection = { cardId: string } | { laneId: string } | null

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
  /**
   * A move, rename or conversion was committed. `next` is validated; the host persists it.
   * For a conversion, return a promise of what the save came to. The conversion shows on this
   * screen at once, but collaborators (and the slate's onSlateChanged) hear of it only once
   * the promise says true; until then the slate holds its drawing saves (Slate.whenHeldSettled).
   * A host that returns no promise has saved it already.
   * - true: it was saved, and is sent to collaborators.
   * - false (or a rejected promise): it was refused. The drawing is put back (the note returns to the canvas, or
   *   leaves it again). The board is put back too, unless the host has drawn a newer one.
   * - 'taken': someone else made this same trade first (they put the note in a lane, or took
   *   the card off the lanes). This person's copy of the note leaves the canvas, nothing is
   *   brought back, and the board is the host's to draw.
   * - anything else (the host went away before it knew): nothing is sent or put back.
   */
  onChange?: (next: Workshop, change: WorkshopChangeEvent) => void | Promise<boolean | 'taken' | void>
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
  /** Wrap the lanes into rows, for a host too narrow for all of them side by side. Change it later with setLayout. */
  layout?: WorkshopBoardLayout
  /** Draw lanes and cards in the host's note style. What is left out is what an ordinary engine note gets. */
  style?: WorkshopNoteStyle
  /**
   * The selection came to rest on one card or one lane of this workshop, moved from
   * one to another, or left them (null): for a host that talks about what is
   * selected. Also called with null when the workshop is destroyed with one selected.
   */
  onSelect?: (selection: WorkshopSelection) => void
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
  /**
   * Arrange the lanes differently (a phone turned on its side, a pane opened beside
   * the canvas). The same notes glide to their new places; a drag in progress is
   * cancelled first.
   */
  setLayout(layout: WorkshopBoardLayout): void
  /**
   * Take a card off the lanes as an ordinary note just beside the board, as a drop on the
   * canvas would (a conversation's "make this a note"). Null when it was done; otherwise the
   * reason it stays a card.
   */
  toCanvas(cardId: string): string | null
  /** Remove the workshop's notes and its policy. Every other note on the slate is left as it was. */
  destroy(): void
  /** The committed model. */
  readonly value: Workshop
  /** Where the artwork's top-left corner is, in world units. */
  readonly origin: { x: number; y: number }
  /** The layout in use. */
  readonly layout: WorkshopBoardLayout
  /** The box the committed board fills in the current layout, in world units (for slate.fitToWidth). */
  readonly bounds: { x: number; y: number; width: number; height: number }
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
/** The outline of what a host's proposal adds or changes: dashed, so it reads as not yet kept. */
const PROPOSED = '#2f5fd0'
const decoration: Partial<NodeCapabilities> = { canMove: false, canSelect: false }

/** What an artwork name (lane-<id>, card-<id>, ...) draws. */
function partOf(name: string): { kind: Kind; key: string } | null {
  const match = /^(lane|card|caption|column|image)-(.+)$/.exec(name)
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
  /**
   * The slate's own document may already hold a note called lane-<id> or card-<id>.
   * That note stays the document's; the workshop draws its own under another id.
   * `standIn` maps an artwork name to the id its note was given, `drawnAs` back again.
   */
  const standIn = new Map<string, string>()
  const drawnAs = new Map<string, string>()
  let held: { cardId: string; evaluate: ((point: { x: number; y: number }) => Workshop) | null; outcome: Outcome } | null = null
  /** A keyboard move on show: to a lane, or (laneId null) off the lanes to the canvas on one side. */
  let staged: { cardId: string; laneId: string | null; side?: -1 | 1; spot?: { x: number; y: number }; next: Workshop } | null = null
  /** An ordinary note being dragged over the board, and what a drop where it is would do. */
  let hovering: { noteId: string; laneId: string | null; refusal: string | null; open: string[] } | null = null
  /** A card whose note was given another id than the card's (the board or the slate had it already): note id → card id. */
  const pairs = new Map<string, string>()
  /** Cards made from notes, by note id: where the note was, so the new card comes from there. */
  const arrivals = new Map<string, { x: number; y: number }>()
  let flash: { laneId: string; reason: string; timer: ReturnType<typeof setTimeout> } | null = null
  let pending: Promise<void> = Promise.resolve()
  let wanted: { model: Workshop; skip?: string; animate: boolean } | null = null
  let layout: WorkshopBoardLayout = options.layout?.lanesPerRow === undefined ? {} : { lanesPerRow: options.layout.lanesPerRow }
  const style: WorkshopNoteStyle = { ...options.style }
  /** What each lane's column says of a drop while a card is held or staged (see the data-workshop-drop attribute). */
  let drops = new Map<string, 'open' | 'over' | 'refused'>()
  // The notes a shown proposal adds or changes (drawn dashed, and tagged for assistive tools and tests).
  let proposed = new Set<string>()
  /** What onSelect was last told, as a string to compare. */
  let told: string | null = null
  /** A selected note is being redrawn after undo, redo or a load; its selection is about to come back. */
  let reselecting = false
  // An impossible layout is refused before anything is drawn.
  workshopLanePlaces(value, { layout })

  const origin = options.origin ? { x: options.origin.x, y: options.origin.y } : besideExistingContent(slate)

  /** The artwork name a note of this workshop draws: its id, unless it had to take another. */
  const nameOf = (id: string) => drawnAs.get(id) ?? id
  const kindOf = (id: string) => partOf(nameOf(id))
  /** The id of the note that draws `name`: the name itself wherever the slate's document leaves it free. */
  function noteId(name: string): string {
    const given = standIn.get(name)
    if (given) return given
    // Ours already, under its own name, or nobody's yet.
    if ((owned.has(name) && !drawnAs.has(name)) || !slate.nodes.one?.(name)) return name
    const id = workshopStandInId(name, candidate => Boolean(slate.nodes.one?.(candidate)) || drawnAs.has(candidate))
    standIn.set(name, id)
    drawnAs.set(id, name)
    console.warn(`WORKSHOP: the slate already has a note named "${name}". It stays the slate's own; the workshop draws its note as "${id}".`)
    return id
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
        const slot = slotOf(value, nameOf(node.id))
        return slot ? { accept: true, settle: slot } : { accept: true }
      }
      if (outcome.kind === 'refused') {
        refuse(card.label, { cardId, laneId: outcome.laneId, reason: outcome.reason })
      } else if (outcome.kind === 'outside' && workshopTakesNotes(value) && !viewer()) {
        // Off the lanes, on the canvas: the card becomes an ordinary note there, or says why it may not.
        const reason = workshopCardAsNoteRefusal(value, cardId)
        if (!reason) {
          release(cardId, { x: node.options.x ?? 0, y: node.options.y ?? 0 })
          return { accept: true }
        }
        draw(value, { skip: cardId })
        slate.announce?.(reason)
        tell(options.onRefuse, { cardId, laneId: null, reason })
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
      draw(value, { skip: kindOf(node.id)?.key })
      if (card) slate.announce?.(`Move cancelled. ${card.label} stays where it was.`)
    },
    onTextCommit(node: any, text, previous) {
      const target = kindOf(node.id)
      if (!target || readOnly || proposal) return false
      const label = text.replace(/\s+/g, ' ').trim()
      const rename = target.kind === 'lane' ? { laneId: target.key, label } : { cardId: target.key, label }
      // The rule every surface renames by: the edit reducer, with its sentence when it refuses.
      const renamed = applyWorkshopEdits(value, [target.kind === 'lane'
        ? { kind: 'rename_lane', lane: { id: target.key }, label } : { kind: 'rename_card', card: { id: target.key }, label }])
      if ('refused' in renamed) {
        const { reason } = renamed.refused
        slate.announce?.(`${previous} keeps its name. ${reason}`)
        tell(options.onRefuse, { ...(target.kind === 'lane' ? { laneId: target.key } : { cardId: target.key }), rename, reason })
        return false
      }
      if (label === previous) return false
      value = renamed.workshop
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
      // Up and Down mean something once the lanes are in more than one row.
      if ((event.key === 'ArrowUp' || event.key === 'ArrowDown') && stacked()) {
        event.preventDefault()
        stage(card.id, event.key === 'ArrowUp' ? -1 : 1, true)
        return true
      }
      if (staged?.cardId !== card.id) return false
      if (event.key === 'Enter') {
        event.preventDefault()
        const { laneId, next, spot } = staged
        staged = null
        if (laneId === null) {
          tell(options.onPreview, null)
          release(card.id, spot!)
          return true
        }
        value = next
        draw(value)
        reveal(laneId)
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
      reselecting = selected.length === 1
      owned.clear()
      drawn.clear()
      links.clear()
      // The document that was loaded decides afresh which names are free.
      standIn.clear()
      drawnAs.clear()
      held = null
      staged = null
      draw(proposal ?? value, { animate: false })
      // The card or lane that was selected is a new note now; a person working by
      // keyboard keeps their place on it.
      if (selected.length === 1) {
        pending = pending.then(() => {
          reselecting = false
          const node = owned.get(selected[0])
          if (!destroyed && node && !(slate.getSelectedNodes?.() ?? []).length) {
            const select = () => slate.selectNodes?.([node])
            if (typeof slate.withoutAnnouncements === 'function') slate.withoutAnnouncements(select)
            else select()
          }
          reportSelection()
        })
      }
    },
  }

  // An ordinary note carried over the board: the lanes say what a drop would do.
  policy.onFreeMove = (node: any, point: WorldPoint) => {
    if (!acceptsNotes() || node.options?.isComment) return clearHover()
    const laneId = laneAt(point)
    const offer = offerOf(node)
    const open = value.lanes.filter(lane => !noteObstacle(node) && workshopNoteRefusal(value, lane.id, offer) === null).map(lane => lane.id)
    const refusal = laneId ? noteObstacle(node) ?? workshopNoteRefusal(value, laneId, offer) : null
    if (hovering && hovering.noteId === node.id && hovering.laneId === laneId && hovering.refusal === refusal) return
    hovering = { noteId: node.id, laneId, refusal, open }
    showCurrent()
  }
  // An ordinary note dropped on a lane becomes a card there, or the lane says why not and it goes back.
  policy.onFreeDrop = (node: any, point: WorldPoint, from?: WorldPoint) => {
    clearHover()
    if (!acceptsNotes() || node.options?.isComment) return
    const laneId = laneAt(point)
    if (!laneId) return
    const offer = offerOf(node)
    const lane = value.lanes.find(item => item.id === laneId)!
    const reason = noteObstacle(node) ?? workshopNoteRefusal(value, laneId, offer)
    if (reason) {
      endFlash(false)
      flash = { laneId, reason, timer: setTimeout(() => endFlash(), 1500) }
      showCurrent()
      slate.announce?.(`${noteName(offer.label)} can't go in ${lane.label}. ${reason}`)
      tell(options.onRefuse, { noteId: node.id, laneId, reason })
      return 'refused'
    }
    adopt([{ node, offer, from }], laneId)
    return 'taken'
  }
  // Several ordinary notes carried together and dropped on a lane: all become cards there as
  // one step, or none do, they all go back, and the lane says why.
  policy.onFreeGroupDrop = (nodes: any[], point: WorldPoint, from?: WorldPoint[]) => {
    clearHover()
    if (!acceptsNotes() || nodes.some(node => node.options?.isComment)) return
    const laneId = laneAt(point)
    if (!laneId) return
    const lane = value.lanes.find(item => item.id === laneId)!
    const entries = nodes.map(node => ({ node, offer: offerOf(node) }))
    const reason = groupRefusal(entries, laneId)
    if (reason) {
      endFlash(false)
      flash = { laneId, reason, timer: setTimeout(() => endFlash(), 1500) }
      showCurrent()
      slate.announce?.(`${names(entries.map(entry => noteName(entry.offer.label)))} can't go in ${lane.label}. ${reason}`)
      for (const { node } of entries) tell(options.onRefuse, { noteId: node.id, laneId, reason })
      return 'refused'
    }
    adopt(entries.map((entry, at) => ({ ...entry, from: from?.[at] })), laneId)
    return 'taken'
  }
  // A note whose words were typed while it sits on a lane (a double-click there makes one) is
  // dropped there: it becomes a card in that lane, or moves out beside the board and the lane
  // says why. A note never sits on a lane looking like a card without being one.
  policy.onFreeTextCommit = (node: any) => {
    if (!acceptsNotes() || node.options?.isComment || !slate.nodes.one(node.id)) return
    const o = node.options ?? {}
    const laneId = laneAt({ x: (o.x ?? 0) + (o.width ?? 0) / 2, y: (o.y ?? 0) + (o.height ?? 0) / 2 })
    if (!laneId) return
    const offer = offerOf(node)
    const lane = value.lanes.find(item => item.id === laneId)!
    const reason = noteObstacle(node) ?? workshopNoteRefusal(value, laneId, offer)
    if (!reason) {
      adopt([{ node, offer }], laneId)
      return
    }
    endFlash(false)
    flash = { laneId, reason, timer: setTimeout(() => endFlash(), 1500) }
    showCurrent()
    slate.announce?.(`${noteName(offer.label)} can't go in ${lane.label}. ${reason} It is beside the board.`)
    tell(options.onRefuse, { noteId: node.id, laneId, reason })
    const { width } = workshopLanePlaces(value, { layout })
    const x = Math.round(origin.x + width + 32), y = Math.round(o.y ?? origin.y)
    node.position(x, y, () => slate.updateSelectionResizeRotate?.(), undefined, prefersReducedMotion() ? 0 : 180)
    slate.broadcast?.('onNodesMove', { nodeOptions: [v2NodeToV1({ ...node.options, x, y })] })
  }
  policy.undoState = () => ({ cards: value.cards.map(card => ({ ...card })), pairs: [...pairs] })
  policy.onUndoRestore = (state: any, notes: { added: string[]; removed: string[] }) => {
    if (destroyed) return
    const recorded = new Map<string, WorkshopCard>((state?.cards ?? []).map((card: WorkshopCard) => [card.id, card]))
    const kept = new Map<string, string>(state?.pairs ?? [])
    const cardOf = (noteId: string) => pairs.get(noteId) ?? kept.get(noteId) ?? noteId
    // A note this step brought back was a card since: it leaves the board.
    for (const noteId of notes.added) {
      const cardId = cardOf(noteId)
      const card = value.cards.find(item => item.id === cardId)
      if (!card) continue
      value = validateWorkshop({ ...value, cards: value.cards.filter(item => item !== card) })
      draw(value)
      watch(tell(options.onChange, value, { cardId, cardToNote: { noteId } }))
    }
    // A note this step took away is a card again, in the lane it was in.
    for (const noteId of notes.removed) {
      const cardId = cardOf(noteId)
      const card = recorded.get(cardId)
      if (!card || value.cards.some(item => item.id === cardId)) continue
      const offer = { id: cardId, label: card.label, ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}) }
      const lane = [card.laneId, ...value.lanes.map(item => item.id)].find(id => workshopNoteCandidate(value, id, offer))
      if (!lane) {
        slate.announce?.(`${card.label} could not go back on the board: there is no room for it.`)
        continue
      }
      value = inRecordedPlace(workshopNoteCandidate(value, lane, offer)!, cardId, state?.cards ?? [])
      if (cardId !== noteId) pairs.set(noteId, cardId)
      draw(value)
      // Where it went back among the cards, so every copy of the board puts it in the same place.
      const at = value.cards.findIndex(item => item.id === cardId)
      const before = value.cards.slice(at + 1).find(item => item.laneId === lane)?.id
      watch(tell(options.onChange, value, { cardId, laneId: lane, noteToCard: { noteId, label: card.label, ...(card.look ? { look: card.look } : {}),
        ...(card.asNote ? { asNote: card.asNote } : {}), ...(before ? { before } : {}) } }))
    }
  }

  const releasePolicy = slate.setDragPolicy(policy)
  const stopWatchingSelection: (() => void) | undefined = options.onSelect && slate.onSelectionChange?.(() => reportSelection())
  // Any press on the slate ends a keyboard-staged move: the person has moved on.
  const onPress = () => { if (staged) clearStaged() }
  slate.element?.addEventListener?.('pointerdown', onPress, true)
  draw(value, { animate: false })

  // ─── Rules ───────────────────────────────────────────────────────

  /** What dropping the card at `point` would do. */
  function decide(cardId: string, point: WorldPoint, evaluate: ((point: { x: number; y: number }) => Workshop) | null): Outcome {
    const card = value.cards.find(item => item.id === cardId)
    if (!card) return { kind: 'outside' }
    const columns = value.lanes.map(lane => owned.get(noteId(workshopNodeIds.column(lane.id)))).filter(Boolean)
    // Columns are drawn 4 units apart, and rows of lanes 12; the padding closes both seams.
    const hit = slate.hitTestNodes(point, columns, { padding: 6 })
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

  /** Whether the lanes are in more than one row: wrapped by the layout, or a map with stations above one another. */
  function stacked() {
    return new Set(workshopLanePlaces(value, { layout }).places.map(place => place.row)).size > 1
  }

  /**
   * Stage a keyboard move one lane along (Left and Right: reading order, on through
   * the rows) or, with `vertical`, to the lane above or below in the same column.
   */
  function stage(cardId: string, step: -1 | 1, vertical = false) {
    const card = value.cards.find(item => item.id === cardId)!
    const open = workshopDestinations(value, cardId)
    // Staged off the lanes: the arrow back toward the board comes in at its near end.
    const off = staged?.cardId === cardId && staged.laneId === null ? staged.side : undefined
    if (off !== undefined) {
      if (vertical || step === off) return
      const back = off > 0 ? value.lanes[value.lanes.length - 1] : value.lanes[0]
      clearStaged()
      if (back.id === card.laneId) {
        reveal(back.id, proposal ?? value)
        slate.announce?.(`${card.label} is back in ${back.label}.`)
        return
      }
      if (open.includes(back)) {
        const next = workshopCandidate(value, cardId, back.id)!
        staged = { cardId, laneId: back.id, next }
        draw(next)
        reveal(back.id, next)
        tell(options.onPreview, next)
        slate.announce?.(`${card.label} to ${back.label}: ${workshopLaneCaption(next, back.id)}. Press Enter to move it, Escape to cancel.`)
        return
      }
      const reason = workshopRefusal(value, cardId, back.id) ?? 'That move is not available.'
      endFlash()
      flash = { laneId: back.id, reason, timer: setTimeout(() => endFlash(), 1500) }
      draw(proposal ?? value)
      reveal(back.id, proposal ?? value)
      slate.announce?.(`${card.label} can't move to ${back.label}. ${reason}`)
      tell(options.onRefuse, { cardId, laneId: back.id, reason })
      return
    }
    const at = staged?.cardId === cardId ? staged.laneId! : card.laneId
    // The lanes on that side, nearest first: every lane along the reading order, or
    // the lanes of this column in the rows above or below.
    let side: typeof value.lanes
    if (vertical) {
      const { places } = workshopLanePlaces(value, { layout })
      const here = places.find(place => place.laneId === at)!
      side = places.filter(place => place.column === here.column && (place.row - here.row) * step > 0)
        .sort((a, b) => (a.row - b.row) * step)
        .map(place => value.lanes.find(lane => lane.id === place.laneId)!)
    } else {
      const index = value.lanes.findIndex(lane => lane.id === at)
      side = step > 0 ? value.lanes.slice(index + 1) : value.lanes.slice(0, index).reverse()
    }
    const target = side.find(lane => open.includes(lane))
    endFlash()
    if (!target) {
      // A lane on that side that the rules close gets the same refusal a drop on it
      // would: the cue on the lane, the reason announced, and onRefuse.
      const closed = side[0]
      if (!closed) {
        // Past the first or the last lane is the canvas: on a board of plain lanes the card may
        // leave the lanes there as an ordinary note.
        if (!vertical && workshopTakesNotes(value)) {
          const reason = workshopCardAsNoteRefusal(value, cardId)
          if (reason) {
            slate.announce?.(reason)
            tell(options.onRefuse, { cardId, laneId: null, reason })
            return
          }
          stageOff(card, step)
          return
        }
        slate.announce?.(`${card.label} has no lane to move to on that side.`)
        return
      }
      const reason = workshopRefusal(value, cardId, closed.id) ?? 'That move is not available.'
      flash = { laneId: closed.id, reason, timer: setTimeout(() => endFlash(), 1500) }
      draw(staged?.next ?? proposal ?? value)
      reveal(closed.id, staged?.next ?? proposal ?? value)
      slate.announce?.(`${card.label} can't move to ${closed.label}. ${reason}`)
      tell(options.onRefuse, { cardId, laneId: closed.id, reason })
      return
    }
    if (target.id === card.laneId) {
      clearStaged()
      reveal(target.id, proposal ?? value)
      slate.announce?.(`${card.label} is back in ${target.label}.`)
      return
    }
    const next = workshopCandidate(value, cardId, target.id)!
    staged = { cardId, laneId: target.id, next }
    draw(next)
    reveal(target.id, next)
    tell(options.onPreview, next)
    slate.announce?.(`${card.label} to ${target.label}: ${workshopLaneCaption(next, target.id)}. Press Enter to move it, Escape to cancel.`)
  }

  /**
   * Bring a lane into view when a keyboard move goes to one that is off screen (a
   * wrapped board on a small screen), by the shortest pan that shows its column.
   */
  function reveal(laneId: string, shown: Workshop = value) {
    const place = workshopLanePlaces(shown, { layout, rows: heldRows() }).places.find(item => item.laneId === laneId)
    const view = slate.canvas?.viewbox?.()
    if (!place || !view || !(view.width > 0) || !(view.height > 0)) return
    const margin = 16
    const shift = (start: number, size: number, from: number, extent: number) => {
      if (size + margin * 2 >= extent) return start - margin - from
      if (start - margin < from) return start - margin - from
      if (start + size + margin > from + extent) return start + size + margin - (from + extent)
      return 0
    }
    const x = shift(origin.x + place.x, place.width, view.x, view.width)
    const y = shift(origin.y + place.y, place.height, view.y, view.height)
    if (x || y) slate.panBy?.({ x, y })
  }

  /** The selection, as the host hears it: the one card or lane of this workshop that is selected, or null. */
  function reportSelection() {
    if (!options.onSelect || reselecting) return
    const selected: any[] = destroyed ? [] : slate.getSelectedNodes?.() ?? []
    const only = selected.length === 1 && owned.get(selected[0].id) === selected[0] ? kindOf(selected[0].id) : null
    const selection: WorkshopSelection = only?.kind === 'card' ? { cardId: only.key } : only?.kind === 'lane' ? { laneId: only.key } : null
    const key = selection ? JSON.stringify(selection) : null
    if (key === told) return
    told = key
    tell(options.onSelect, selection)
  }

  function clearStaged() {
    if (!staged) return
    staged = null
    tell(options.onPreview, null)
    draw(proposal ?? value)
  }

  /** Stage a card's move off the lanes, just beside the board on that side, where it would become a note. */
  function stageOff(card: WorkshopCard, side: -1 | 1) {
    const { width } = workshopLanePlaces(value, { layout })
    const drawnCard = owned.get(noteId(workshopNodeIds.card(card.id)))?.options
    const cardWidth = drawnCard?.width ?? 228
    const spot = { x: side > 0 ? origin.x + width + 32 : origin.x - cardWidth - 32, y: drawnCard?.y ?? origin.y }
    const next = workshopCardAsNote(value, card.id)!
    staged = { cardId: card.id, laneId: null, side, spot, next: value }
    draw(value)
    tell(options.onPreview, next)
    slate.announce?.(`${card.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`)
  }

  // ─── Notes and cards ─────────────────────────────────────────────

  /** Whether the slate's own events say this person may not edit (a viewer, or comments only). */
  function viewer() {
    return Boolean(slate.isReadOnly?.() || slate.isCommentOnly?.())
  }

  /** Whether an ordinary note dropped on this board can become a card now. */
  function acceptsNotes() {
    return !destroyed && !readOnly && !proposal && !held && !viewer() && workshopTakesNotes(value)
  }

  function clearHover() {
    if (!hovering) return
    hovering = null
    if (!destroyed) showCurrent()
  }

  /** The lane whose column is under a world point, or null. */
  function laneAt(point: WorldPoint) {
    const columns = value.lanes.map(lane => owned.get(noteId(workshopNodeIds.column(lane.id)))).filter(Boolean)
    const hit = slate.hitTestNodes(point, columns, { padding: 6 })
    return hit ? kindOf(hit.id)?.key ?? null : null
  }

  /**
   * What an ordinary note offers a lane: its id, its words in one line, its look, and what it
   * has that a card does not show (its line breaks, shape and size), kept for its way back.
   */
  function offerOf(node: any): WorkshopNoteOffer {
    const o = node.options ?? {}
    const look = workshopCardLookOf({ backgroundColor: o.backgroundColor, textColor: o.fontColor, fontFamily: o.fontFamily,
      fontSize: o.fontSize, borderColor: o.borderColor, borderWidth: o.borderWidth })
    const words = String(o.text ?? '')
    const label = words.replace(/\s+/g, ' ').trim()
    const asNote: WorkshopCardAsNote = {}
    if (words.trim() !== label && words.length <= 400) asNote.text = words.trim()
    if (typeof o.shape === 'string' && /^[a-z]{1,24}$/i.test(o.shape)) asNote.shape = o.shape
    for (const key of ['width', 'height'] as const) if (Number.isFinite(o[key]) && o[key] >= 10 && o[key] <= 4000) asNote[key] = Math.round(o[key])
    return { id: node.id as string, label, ...(look ? { look } : {}), ...(Object.keys(asNote).length ? { asNote } : {}) }
  }

  /** "A", "A and B", "A, B and C". */
  function names(list: string[]) {
    return list.length > 1 ? list.slice(0, -1).join(', ') + ' and ' + list.at(-1) : list[0] ?? ''
  }

  /** Why a lane can't take all of these notes at once; null when it can. */
  function groupRefusal(entries: { node: any; offer: WorkshopNoteOffer }[], laneId: string): string | null {
    for (const { node } of entries) {
      const obstacle = noteObstacle(node)
      if (obstacle) return obstacle
    }
    const lane = value.lanes.find(item => item.id === laneId)!
    const held = value.cards.filter(item => item.laneId === laneId).length
    if (lane.capacity !== undefined && held + entries.length > lane.capacity) {
      const room = lane.capacity - held
      return room > 0 ? `It has room for ${room} more ${room === 1 ? 'card' : 'cards'}.` : `It already holds ${held} of ${lane.capacity} ${lane.capacity === 1 ? 'card' : 'cards'}.`
    }
    let board = value
    for (const { offer } of entries) {
      const reason = workshopNoteRefusal(board, laneId, offer)
      if (reason) return reason
      board = workshopNoteCandidate(board, laneId, offer)!
    }
    return null
  }

  /** What about a note, rather than about the lane, keeps it a note. Null when nothing does. */
  function noteObstacle(node: any): string | null {
    const joined = (node.relationships?.associations?.length ?? 0) > 0 || (slate.nodes?.allNodes ?? []).some((other: any) =>
      other !== node && (other.relationships?.associations ?? []).some((link: any) => link.child === node || link.childId === node.id))
    if (joined) return 'A note joined to other notes by lines stays a note. Remove its lines first.'
    if (node.options?.image) return 'A note with a picture stays a note.'
    if (node.options?.link?.show && node.options.link.data) return 'A note with a link stays a note. Remove its link first.'
    return null
  }

  const noteName = (label: string) => label || 'This note'

  /**
   * Ordinary notes become cards at the foot of `laneId`: they leave the drawing and the board
   * gains the cards, as one undo step. Each card comes from where its note was let go.
   * The note leaves this screen at once, but collaborators hear of it only once the host has
   * saved the trade: refused, or the page gone first, nobody else ever saw it go.
   */
  function adopt(entries: { node: any; offer: WorkshopNoteOffer; from?: WorldPoint }[], laneId: string) {
    let next = value
    const made = entries.map(({ node, offer, from }) => {
      next = workshopNoteCandidate(next, laneId, offer)!
      // Should the host not save it, the note goes back where it started.
      const kept = { ...(node.options ?? {}), ...(from ? { x: from.x, y: from.y } : {}) }
      return { node, card: next.cards[next.cards.length - 1], kept }
    })
    slate.beginHostStep?.()
    value = next
    // The board as this step left it: a refusal puts the board back only while nothing newer was drawn.
    let committed = value
    for (const { node, card } of made) {
      if (card.id !== node.id) pairs.set(node.id, card.id)
      arrivals.set(noteId(workshopNodeIds.card(card.id)), { x: node.options?.x ?? 0, y: node.options?.y ?? 0 })
      onlyHere(() => slate.removeNode(node.id))
    }
    slate.endHostStep?.()
    draw(value)
    // A card is selected on its own: the first of them keeps the person's place.
    keepPlaceOn(noteId(workshopNodeIds.card(made[0].card.id)))
    const lane = value.lanes.find(item => item.id === laneId)!
    slate.announce?.(made.length === 1
      ? `${made[0].card.label} is now a card in ${lane.label}. ${workshopLaneCaption(value, laneId)}.`
      : `${names(made.map(({ card }) => card.label))} are now cards in ${lane.label}. ${workshopLaneCaption(value, laneId)}.`)
    for (const { node, card, kept } of made) {
      const change = { cardId: card.id, laneId, noteToCard: { noteId: node.id as string, label: card.label,
        ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}) } }
      const dropCard = () => {
        if (value !== committed || !value.cards.some(item => item.id === card.id)) return
        value = validateWorkshop({ ...value, cards: value.cards.filter(item => item.id !== card.id) })
        committed = value
        draw(value)
      }
      hear(tell(options.onChange, value, change), () => {
        // Saved: now collaborators, and the host's drawing save, hear that the note is gone.
        slate.sendHeld?.([{ type: 'onNodeDeleted', data: { id: node.id, isComment: false } }])
      }, () => {
        // The host could not save it: the note goes back on the canvas, as it was. Nobody else
        // saw it go, so nothing is sent.
        if (destroyed) return
        dropCard()
        if (!slate.nodes.one(kept.id)) {
          slate.beginHostStep?.()
          const back = onlyHere(() => slate.addNode({ ...kept }))
          if (back) back.announcedByCreator = true
          slate.endHostStep?.()
        }
        slate.announce?.(`${card.label} could not be saved as a card. It is a note on the canvas again.`)
      }, () => {
        // Someone else put this note on the board first: their card is the note now.
        if (destroyed) return
        dropCard()
        slate.announce?.(`Someone else put ${card.label} on the board first.`)
      })
    }
  }

  /**
   * A card leaves the lanes as an ordinary note at `at`, saved with the drawing, as one
   * undo step. The note is drawn as the card was, and gets back what the note it was made
   * from had (its line breaks, shape and size).
   */
  function release(cardId: string, at: { x: number; y: number }) {
    const card = value.cards.find(item => item.id === cardId)!
    const fromLane = value.lanes.find(item => item.id === card.laneId)!
    const place = value.cards.findIndex(item => item.id === cardId)
    const before = value.cards.slice(place + 1).find(item => item.laneId === card.laneId)?.id
    const next = workshopCardAsNote(value, cardId)!
    const drawnCard = drawn.get(noteId(workshopNodeIds.card(cardId))) ?? {}
    const id = slate.nodes.one(cardId) ? 'node_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now() : cardId
    const round = (style.cornerRadius ?? 0) > 0
    const kept = card.asNote
    // The words it had, line breaks and all, unless the card has been renamed since.
    const words = kept?.text !== undefined && kept.text.replace(/\s+/g, ' ').trim() === card.label ? kept.text : card.label
    const note: Record<string, unknown> = {
      id, x: Math.round(at.x), y: Math.round(at.y), width: kept?.width ?? drawnCard.width ?? 228, height: kept?.height ?? drawnCard.height ?? 76, text: words,
      shape: kept?.shape ?? (round ? 'roundedrectangle' : 'rectangle'),
      backgroundColor: card.look?.backgroundColor ?? drawnCard.backgroundColor, fontColor: card.look?.textColor ?? drawnCard.foregroundColor,
      fontSize: card.look?.fontSize ?? drawnCard.fontSize, borderColor: card.look?.borderColor ?? drawnCard.borderColor,
      borderWidth: card.look?.borderWidth ?? drawnCard.borderWidth,
      ...((card.look?.fontFamily ?? drawnCard.fontFamily) ? { fontFamily: card.look?.fontFamily ?? drawnCard.fontFamily } : {}),
    }
    for (const key of Object.keys(note)) if (note[key] === undefined) delete note[key]
    slate.beginHostStep?.()
    value = next
    const committed = value
    if (id !== cardId) pairs.set(id, cardId)
    else pairs.delete(id)
    // Collaborators hear of the note only once the host has saved the trade.
    const added = onlyHere(() => slate.addNode(note))
    if (added) added.announcedByCreator = true
    slate.endHostStep?.()
    draw(value)
    added?.ready?.then?.(() => {
      if (destroyed || slate.nodes.one(id) !== added) return
      const select = () => slate.selectNodes?.([added])
      if (typeof slate.withoutAnnouncements === 'function') slate.withoutAnnouncements(select)
      else select()
    })
    slate.announce?.(`${card.label} is now a note on the canvas. ${fromLane.label}: ${workshopLaneCaption(value, fromLane.id)}.`)
    const dropNote = () => {
      if (slate.nodes.one(id) !== added) return
      slate.beginHostStep?.()
      onlyHere(() => slate.removeNode(id))
      slate.endHostStep?.()
    }
    hear(tell(options.onChange, value, { cardId, cardToNote: { noteId: id } }), () => {
      // Saved: collaborators, and the host's drawing save, hear of the note as it is now.
      if (added && slate.nodes.one(id) === added) slate.sendHeld?.([{ type: 'onNodeAdded', data: { id, nodeOptions: v2NodeToV1(added.options) } }])
    }, () => {
      // The host could not save it: the note leaves the canvas and the card comes back, in its
      // place, unless the host has drawn a newer board.
      if (destroyed) return
      dropNote()
      if (value === committed && !value.cards.some(item => item.id === cardId)) {
        const offer = { id: cardId, label: card.label, ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}) }
        const back = workshopNoteCandidate(value, card.laneId, offer, before)
        if (back) { value = back; draw(value) }
      }
      slate.announce?.(`${card.label} could not be saved as a note. It is a card again.`)
    }, () => {
      // Someone else took this card off the lanes first: their note is the card now.
      if (destroyed) return
      dropNote()
      slate.announce?.(`Someone else took ${card.label} off the lanes first.`)
    })
  }

  /** The board with `cardId` back at the place among the cards it had in a recorded board. */
  function inRecordedPlace(board: Workshop, cardId: string, recorded: WorkshopCard[]): Workshop {
    const order = recorded.map(card => card.id)
    const at = order.indexOf(cardId)
    const card = board.cards.find(item => item.id === cardId)
    if (at < 0 || !card) return board
    const rest = board.cards.filter(item => item !== card)
    const before = rest.findIndex(item => { const index = order.indexOf(item.id); return index > at })
    rest.splice(before < 0 ? rest.length : before, 0, card)
    return validateWorkshop({ ...board, cards: rest })
  }

  /** Select the card that a note became, once it is drawn, so a person working by keyboard keeps their place. */
  function keepPlaceOn(id: string) {
    pending = pending.then(() => {
      const node = owned.get(id)
      if (destroyed || !node) return
      const select = () => slate.selectNodes?.([node])
      if (typeof slate.withoutAnnouncements === 'function') slate.withoutAnnouncements(select)
      else select()
    })
  }

  /** Make a change on this screen only (see Slate.onlyHere); a slate without it makes it as usual. */
  function onlyHere<T>(change: () => T): T {
    return typeof slate.onlyHere === 'function' ? slate.onlyHere(change) : change()
  }

  /**
   * Hear what the host's save of a trade came to: `saved` once it says true (at once for a host
   * that does not answer with a promise), `refused` when it says false or fails, `taken` when
   * someone else made the same trade first, and nothing for any other answer (the host went away
   * before it knew). The slate holds its drawing saves until then.
   */
  function hear(answer: unknown, saved: () => void, refused: () => void, taken: () => void) {
    if (!answer || typeof (answer as any).then !== 'function') return saved()
    const settled = (answer as Promise<unknown>).then(result => {
      if (result === true) saved()
      else if (result === false) refused()
      else if (result === 'taken') taken()
    }, () => refused())
    slate.holdUntil?.(settled)
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
    const nodes = workshopToSlate(model, { native: true, origin, rows: heldRows(), layout, style }).nodes
    const byId = new Map(nodes.map(node => [node.options.id as string, node.options]))
    const outline = (laneId: string, color: string, width: number, header = false) => {
      const column = byId.get(workshopNodeIds.column(laneId))
      if (column) { column.borderColor = color; column.borderWidth = width; delete column.borderStyle }
      const lane = header && byId.get(workshopNodeIds.lane(laneId))
      if (lane) { lane.borderColor = color; lane.borderWidth = width }
    }
    const moving = held?.cardId ?? staged?.cardId
    drops = new Map()
    if (moving) {
      const from = value.cards.find(card => card.id === moving)?.laneId
      for (const lane of workshopDestinations(value, moving)) if (lane.id !== from) { outline(lane.id, OFFER, 2); drops.set(lane.id, 'open') }
      const over = held ? held.outcome : staged?.laneId ? { kind: 'candidate' as const, laneId: staged.laneId } : null
      if (over?.kind === 'candidate') { outline(over.laneId, ACCEPT, 3, true); drops.set(over.laneId, 'over') }
      if (over?.kind === 'refused') { outline(over.laneId, REFUSE, 3); drops.set(over.laneId, 'refused') }
    }
    if (hovering && !moving) {
      for (const laneId of hovering.open) if (laneId !== hovering.laneId) { outline(laneId, OFFER, 2); drops.set(laneId, 'open') }
      if (hovering.laneId && !hovering.refusal) { outline(hovering.laneId, ACCEPT, 3, true); drops.set(hovering.laneId, 'over') }
      if (hovering.laneId && hovering.refusal) { outline(hovering.laneId, REFUSE, 3); drops.set(hovering.laneId, 'refused') }
    }
    if (staged?.laneId === null && staged.spot) {
      // Staged off the lanes from the keyboard: the card waits beside the board.
      const card = byId.get(workshopNodeIds.card(staged.cardId))
      if (card) { card.xPos = staged.spot.x; card.yPos = staged.spot.y }
    }
    if (flash) {
      drops.set(flash.laneId, 'refused')
      outline(flash.laneId, REFUSE, 3, true)
      const caption = byId.get(workshopNodeIds.caption(flash.laneId))
      if (caption) { caption.text = flash.reason; caption.foregroundColor = '#b42318' }
    }
    // A proposal looks provisional where it differs from the committed board: each card it adds,
    // moves or renames and each lane it adds or changes is outlined dashed.
    proposed = new Set()
    if (proposal && model === proposal) {
      const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b)
      const mark = (id: string) => {
        const options = byId.get(id)
        if (!options) return
        options.borderStyle = 'dashed'
        options.borderColor = PROPOSED
        options.borderWidth = 2
        proposed.add(noteId(id))
      }
      for (const card of model.cards) if (!same(card, value.cards.find(item => item.id === card.id))) mark(workshopNodeIds.card(card.id))
      for (const lane of model.lanes) if (!same(lane, value.lanes.find(item => item.id === lane.id))) mark(workshopNodeIds.lane(lane.id))
    }
    // Each note under the id it is drawn as, and each connector between those ids.
    for (const node of nodes) {
      node.options.id = noteId(node.options.id as string)
      for (const link of node.relationships.associations) {
        link.parentId = noteId(link.parentId as string)
        link.childId = noteId(link.childId as string)
      }
    }
    return nodes
  }

  /**
   * While a card is held or staged each lane keeps at least the committed board's
   * height, so the lane under the pointer does not change shape beneath it.
   */
  function heldRows() {
    return held || staged ? value.lanes.map(lane => value.cards.filter(card => card.laneId === lane.id).length) : undefined
  }

  function draw(model: Workshop, how: { skip?: string; animate?: boolean } = {}) {
    if (destroyed) return
    wanted = { model, skip: how.skip, animate: how.animate !== false }
    const nodes = artwork(model)
    const waiting: Promise<void>[] = []
    for (const { options: v1 } of nodes) {
      const id = v1.id as string
      if (owned.has(id)) continue
      const arrival = arrivals.get(id)
      arrivals.delete(id)
      const start = arrival && how.animate !== false && !prefersReducedMotion() ? { ...v1, xPos: arrival.x, yPos: arrival.y } : v1
      const node = slate.nodes.add(v1NodeToV2(start))
      owned.set(id, node)
      drawn.set(id, { ...start })
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
        const name = drawnAs.get(id)
        if (name) { drawnAs.delete(id); standIn.delete(name) }
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
        if (id !== (how.skip && noteId(workshopNodeIds.card(how.skip))) && placed) {
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
        if (proposed.has(id)) node.svgGroup.node.setAttribute('data-workshop-proposed', '')
        else node.svgGroup.node.removeAttribute('data-workshop-proposed')
        // What the outline colours say, said in the document too: which lanes take the card in hand.
        const part = kindOf(id)
        if (part?.kind === 'column') {
          const drop = drops.get(part.key)
          if (drop) node.svgGroup.node.setAttribute('data-workshop-drop', drop)
          else node.svgGroup.node.removeAttribute('data-workshop-drop')
        }
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
    const options = workshopToSlate(model, { native: true, origin, layout, style }).nodes.find(node => node.options.id === nodeId)?.options
    return options ? { x: options.xPos as number, y: options.yPos as number } : null
  }

  function cancelGestures() {
    if (held) slate.cancelGovernedDrag?.('host')
    held = null
    if (staged) { staged = null; tell(options.onPreview, null) }
    endFlash(false)
  }

  return {
    toCanvas(cardId: string) {
      if (destroyed || readOnly || viewer()) return 'This workshop is view-only here.'
      if (!value.cards.some(card => card.id === cardId)) return 'That card is no longer on the board.'
      const reason = workshopCardAsNoteRefusal(value, cardId)
      if (reason) return reason
      if (staged) clearStaged()
      // A proposal on show (the conversation's own preview of this) gives way to the board.
      if (proposal) { cancelGestures(); proposal = null; draw(value); slate.refreshGovernance?.() }
      // Just beside the board, level with where the card is drawn.
      const { width } = workshopLanePlaces(value, { layout })
      const drawnCard = owned.get(noteId(workshopNodeIds.card(cardId)))?.options
      release(cardId, { x: origin.x + width + 32, y: drawnCard?.y ?? origin.y })
      return null
    },
    get value() { return value },
    get origin() { return { ...origin } },
    get layout() { return { ...layout } },
    get bounds() {
      const { width, height } = workshopLanePlaces(value, { layout })
      return { x: origin.x, y: origin.y, width, height }
    },
    setLayout(next) {
      if (destroyed) throw new Error('This workshop has been detached.')
      const wantedLayout: WorkshopBoardLayout = next?.lanesPerRow === undefined ? {} : { lanesPerRow: next.lanesPerRow }
      workshopLanePlaces(value, { layout: wantedLayout })
      if (wantedLayout.lanesPerRow === layout.lanesPerRow) return
      cancelGestures()
      layout = wantedLayout
      draw(proposal ?? value)
    },
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
      stopWatchingSelection?.()
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
      standIn.clear()
      drawnAs.clear()
      releasePolicy()
      reselecting = false
      reportSelection()
      slate.notifyNodeChanged?.()
    },
  }
}

/**
 * Call a host callback. One that throws is reported and otherwise ignored: by then
 * the workshop has already made up its mind, and its notes must end up where its
 * model says whatever becomes of the host's own code.
 */
function tell<A extends unknown[], R>(callback: ((...args: A) => R) | undefined, ...args: A): R | undefined {
  try {
    return callback?.(...args)
  } catch (error) {
    console.error('WORKSHOP: a host callback threw', error)
    return undefined
  }
}

/** Run `failed` when a host's answer to a change is a promise of false: it could not save it. */
/**
 * Hear what a host's save of a change came to: `refused` when it says false, `taken` when it
 * says someone else made the same trade first. Nothing happens for any other answer.
 */
function watch(answer: unknown, refused?: () => void, taken?: () => void) {
  if (!answer || typeof (answer as any).then !== 'function') return
  ;(answer as Promise<unknown>).then(saved => {
    if (saved === false) refused?.()
    else if (saved === 'taken') taken?.()
  }, () => undefined)
}

function sameOutcome(a: Outcome, b: Outcome) {
  // The committed board does not change while a card is held, so the same lane means the same candidate.
  return a.kind === b.kind && (a as any).laneId === (b as any).laneId
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
