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
import type { NodeJSON } from '../core/Serialization'
import { prefersReducedMotion, type DragPolicy, type NodeCapabilities, type WorldPoint } from '../core/DragPolicy'
import {
  behaviourNote, businessKind, validateWorkshop, workshopBoardScope, workshopFreeSpot, workshopCandidate, workshopCardAsNote, workshopCardAsNoteRefusal, workshopCardLines, workshopCardLookOf, workshopCardNoteText, workshopDestinations,
  workshopLaneCaption, workshopLaneHeld, workshopLanePlaces, workshopLineRefusal, workshopLinesOf, workshopNewLine, workshopNodeIds, workshopNoteCandidate, workshopRules,
  workshopCardLabelOf, workshopKeepsLink, workshopNoteIdOf, workshopKeepsPicture, workshopNoteRefusal, workshopRefusal, workshopRenamedLines, workshopStandInId, workshopTakesLines, workshopTakesNotes, workshopToSlate, workshopWithLine,
  workshopWithoutLine, type Workshop, type WorkshopBoardLayout, type WorkshopCard, type WorkshopCardAsNote, type WorkshopCardLook,
  type WorkshopLine, type WorkshopNoteOffer, type WorkshopNoteStyle,
} from './model'
import { applyWorkshopEdits, type WorkshopEdit } from './edits'
import { createBoardLayer } from './boardLayer'
import { mapEditsBetween, mapGripLabel, mapGripNotes, mapGripOf, mapGripSize, mapPathDrop, mapStationAt, paintMap } from './mapPaths'

/**
 * What a person changed. A move names the card and its new lane; a rename names the lane or
 * card and its new label. `noteToCard`: an ordinary note became card `cardId` at the foot of
 * `laneId`, or just before card `before` when that is where an undo puts it back (it left the
 * slate's drawing). `asNote` is what the note had that the card does not show (line breaks,
 * shape, size), kept for its way back. `cardToNote`: card `cardId` left the board and is now
 * the ordinary note `noteId` in the drawing. A note's lines stay joined to it either way:
 * `noteToCard.lines` are the note's lines as the drawing had them (a card's lines are the board's,
 * see Workshop.lines). `line`: a person drew or changed a line with a card at one end (`set`), or
 * took one away (`remove`, its id). `via: 'undo'`: the change is this person's undo or redo putting
 * a trade back, not a gesture of their own (a host says nothing about it that a drop would).
 */
export interface WorkshopChangeEvent {
  cardId?: string
  laneId?: string
  rename?: { laneId?: string; cardId?: string; label: string }
  noteToCard?: { noteId: string; label: string; look?: WorkshopCardLook; asNote?: WorkshopCardAsNote; before?: string; lines?: WorkshopLine[]; under?: string }
  cardToNote?: { noteId: string }
  line?: { set: WorkshopLine; remove?: undefined } | { remove: string; set?: undefined }
  /**
   * A business board's change as edits for applyWorkshopEdits (every drag, handle, key and rename on a
   * launch plan, pipeline or budget): a server applies them to its board as it stands, so two people
   * changing different tasks or deals both keep their change.
   */
  edits?: WorkshopEdit[]
  via?: 'undo'
}

/** One note a board kit draws: its artwork name (lane-, card-, caption-, column-, handle-, gauge-), box from the origin and look. */
export interface PartPlace {
  name: string
  x: number
  y: number
  width: number
  height: number
  text?: string
  fill?: string
  ink?: string
  line?: string
  lineWidth?: number
  fontSize?: number
}

/** What a board layer is told on each redraw. */
export interface BoardLayerState {
  origin: { x: number; y: number }
  layout: WorkshopBoardLayout
  /** A continuous drag held at a bound: the handle and the sentence shown beside it. */
  clamp: { name: string; text: string } | null
  /** The board on show is a preview the rules refuse. */
  refused: boolean
  /** Draw above this element (the last lane column), so the layer sits under every other note. */
  above?: Element | null
  /** A person clicked the arrow from `waitsOn` to `cardId` (launch plan). */
  onUnlink?(cardId: string, waitsOn: string): void
  /** What the canvas shows of the board now, in board coordinates: words the board says are set inside it. */
  view?: { x: number; y: number; width: number; height: number } | null
  /** Say something to a screen reader (the slate's announcer). */
  announce?(text: string): void
  /** The card the person is on: selected, under the pointer, or held by one of its grips (a plan shows that bar's grips). */
  focus?: string | null
  /** The host has put the whole board in focus (setFocused): a kit shows what only a board in focus shows (a plan's span grips, a map's path controls). */
  boardFocused?: boolean
  /** A map's path the person picked outside focus ("from>to"), outlined; the host offers "Change this board". */
  picked?: string | null
  /** A map's grip size in board units: a finger's on screen at the zoom the board is shown at (mapGripSize). */
  gripSize?: number
  /** A person picked a map's path (outside focus). */
  onPick?(key: string): void
}

export interface BoardLayer {
  draw(board: Workshop, preview: Workshop | null, state: BoardLayerState): void
  destroy(): void
}

/** What a handle drag means at a pointer position: the board to show, and why it stops when it is held at a bound. */
export interface HandleResult {
  next: Workshop; clampedReason?: string; refusal?: string
  /** The layout to draw `next` in while the grip is held (a plan's line keeps its day width and the plan grows); left out, the board's own. */
  layout?: WorkshopBoardLayout
}

/**
 * Everything a business board (launch plan, pipeline, budget) adds to the native drawing: where its
 * notes go, its board layer, its Dragology chooser and handles, and its keys. Kits come from
 * slateboxjs/boards (kitFor(kind)), loaded only for a slate that holds one of these boards.
 */
export interface WorkshopBoardKit {
  places(board: Workshop, layout: WorkshopBoardLayout): { parts: PartPlace[]; width: number; height: number }
  /** The parts as slate notes at `origin`, in the host's note style. */
  notes(board: Workshop, layout: WorkshopBoardLayout, origin: { x: number; y: number }, style: WorkshopNoteStyle): NodeJSON[]
  /** The edits that turn one board into another (WorkshopChangeEvent.edits). */
  editsBetween(before: Workshop, after: Workshop): WorkshopEdit[]
  /** What a screen reader calls a handle. */
  label?(board: Workshop, part: string): string | null
  layer(slate: any): BoardLayer
  /** Always used for this kind: the lane under the pointer is never the whole answer. */
  chooser: WorkshopCandidateChooser
  /**
   * Why a drop at this point is refused (an illegal stage, a task that may not wait on that one); null when it is not.
   * `lands`: the chooser still places the card where the rules let it (a plan's bar stops at its line or hops a
   * freeze), and the reason is said beside it; when that place is where the card already is, the drop is refused.
   */
  refusalAt(board: Workshop, cardId: string, grab: { x: number; y: number }, point: { x: number; y: number }, layout: WorkshopBoardLayout): { laneId: string; reason: string; lands?: boolean } | null
  handleDrag(board: Workshop, handleId: string, grab: { x: number; y: number }, layout: WorkshopBoardLayout): ((point: { x: number; y: number }) => HandleResult) | null
  keyEdit?(board: Workshop, part: string, key: { key: string; shiftKey: boolean }): WorkshopEdit[] | null
  /**
   * A key that offers a choice on a focused part (a launch plan's L: what this task waits on). Null when
   * the key means nothing here; a sentence when there is nothing to choose. The key again offers the next
   * choice, Enter makes it, Escape cancels.
   */
  keyChoices?(board: Workshop, part: string, key: string): { said: string; edits: WorkshopEdit[] }[] | string | null
  /** What a screen reader is told a focused card's keys do, after its name. */
  cardKeys?: string
  /** Outline the lanes a held card may go to. Off for a launch plan, where every team takes every task. */
  laneCues: boolean
  /** The card a part belongs to (a card, or one of its grips); null for any other part. Left out, only a card's own note. */
  cardOfPart?(board: Workshop, part: string): string | null
  /** A nest board: the card an ordinary note dropped at this point sits under; null for none. */
  noteUnder?(board: Workshop, point: { x: number; y: number }, layout: WorkshopBoardLayout): string | null
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

/**
 * The one workshop note that is selected: a card or a lane; or a map's path the person picked (outside focus,
 * where a path is fixed: the host offers "Change this board"). Null when the selection is anything else.
 */
export type WorkshopSelection = { cardId: string } | { laneId: string } | { path: { from: string; to: string } } | null

/**
 * Chooses the board a pointer position means while a card is held. Called once as
 * the drag begins with the board, the card and where on the card it was grabbed;
 * returns a function from a pointer position (in board coordinates: world units
 * from the artwork's origin) to the board that a drop there would produce. Return
 * null to leave the choice to the lane under the pointer.
 */
export type WorkshopCandidateChooser = (board: Workshop, cardId: string, grab: { x: number; y: number }, layout?: WorkshopBoardLayout) =>
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
  /** Required for a launch plan, a pipeline or a budget: its kit from slateboxjs/boards. */
  kit?: WorkshopBoardKit
  /**
   * The board's scope on a slate of many boards (1 to 12 lowercase letters and digits): each of its notes
   * is named `<scope>:<name>` (`b2:card-<id>`, see workshopNodeIds.of), so two boards made from one preset
   * never share a name, and a board only ever treats its own notes as its parts. Left out, or `main`, the
   * notes keep the names a slate of one board has always had.
   */
  scope?: string
  /**
   * The boxes (world units) a note this board puts "beside the board" must stay clear of: the other boards
   * on the slate. Asked each time (a card taken to the canvas, a note a lane refuses, a keyboard move off
   * the lanes); the note goes past them along its row.
   */
  avoid?: () => { x: number; y: number; width: number; height: number }[]
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
  /**
   * Put the board in focus (true) or take it out (false): the host's "Change this board" is about
   * this board. Every note of the board carries `data-workshop-focused` while it is in focus, through
   * redraws, so a kit can show what only a focused board shows and assistive tools can tell. Focus
   * changes nothing a person can move; it is the host's to give and to take away.
   */
  setFocused(focused: boolean): void
  /** Whether the board is in focus (setFocused). */
  readonly focused: boolean
}

type Kind = 'lane' | 'card' | 'caption' | 'column' | 'image' | 'handle' | 'gauge'
/** A change package for collaborators. */
type SlatePackageLike = { type: string; data: Record<string, unknown> }
type Outcome =
  | { kind: 'outside' }
  | { kind: 'home' }
  | { kind: 'refused'; laneId: string; reason: string; near?: boolean }
  | { kind: 'candidate'; laneId: string; next: Workshop; said?: string }

const ACCEPT = '#1f7a5c', OFFER = '#5b9a85', REFUSE = '#c2410c'
/** The outline of what a host's proposal adds or changes: dashed, so it reads as not yet kept. */
const PROPOSED = '#2f5fd0'
/** The everyday names of the slate's shapes (ShapeRegistry), as the app's shape notice uses them. */
const SHAPE_WORDS: Record<string, string> = {
  diamond: 'diamond', rhombus: 'diamond', ellipse: 'oval', oval: 'oval', circle: 'circle', star: 'star', triangle: 'triangle',
  pentagon: 'pentagon', hexagon: 'hexagon', octagon: 'octagon', trapezium: 'trapezium', parallelogram: 'parallelogram',
  rarrow: 'arrow', larrow: 'arrow', arrow: 'arrow', stickynote: 'sticky note',
}
const decoration: Partial<NodeCapabilities> = { canMove: false, canSelect: false }

/** What an artwork name (lane-<id>, card-<id>, ...) draws. */
function partOf(name: string): { kind: Kind; key: string } | null {
  const match = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(name)
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
  const scope = workshopBoardScope(options.scope)
  let value = validateWorkshop(workshop)
  const kit = options.kit
  /**
   * A launch plan, pipeline or budget with no kit can be shown, but not played: its lanes and
   * cards are drawn as plain notes, view-only (a host that has not loaded slateboxjs/boards, or
   * a build that predates it, still opens the slate). Playing one needs its kit.
   */
  const kitless = (model: Workshop) => Boolean(businessKind(model)) && !kit
  if (kitless(value) && !options.readOnly) throw new Error(`A ${value.kind} board needs its kit: pass kit: kitFor('${value.kind}') from slateboxjs/boards.`)
  // A map has a layer of its own: its paths' hit areas (picked outside focus, removed in focus) and a held grip's words.
  const layer = kit?.layer(slate) ?? (value.lanes[0]?.station ? createBoardLayer(slate, paintMap) : undefined)
  /** A map's path picked outside focus ("from>to"), until the selection moves on. */
  let picked: string | null = null
  /** The notes that were selected when a path was picked (its pick cleared them). */
  let pickCleared = new Set<string>()
  /** A handle being dragged, and what the pointer last meant. */
  let grip: { name: string; follow: (point: { x: number; y: number }) => HandleResult; last: HandleResult | null } | null = null
  let proposal: Workshop | null = null
  /** What the host asked for; a board without its kit is view-only whatever it asks. */
  let wantedReadOnly = Boolean(options.readOnly)
  let readOnly = wantedReadOnly || kitless(value)
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
  let held: { cardId: string; evaluate: ((point: { x: number; y: number }) => Workshop) | null; grab?: { x: number; y: number }; outcome: Outcome } | null = null
  /** A keyboard move on show: to a lane, or (laneId null) off the lanes to the canvas on one side. */
  let staged: { cardId: string; laneId: string | null; side?: -1 | 1; spot?: { x: number; y: number }; next: Workshop } | null = null
  // A choice offered by a key on a focused part (keyChoices): the part, the key, the choices and the one on show.
  let picking: { node: string; key: string; choices: { said: string; edits: WorkshopEdit[]; next: Workshop; done: string }[]; at: number } | null = null
  /** An ordinary note being dragged over the board, and what a drop where it is would do. */
  let hovering: { noteId: string; laneId: string | null; refusal: string | null; open: string[] } | null = null
  /** A card whose note was given another id than the card's (the board or the slate had it already): note id → card id. */
  const pairs = new Map<string, string>()
  /** Cards made from notes, by note id: where the note was, so the new card comes from there. */
  const arrivals = new Map<string, { x: number; y: number }>()
  let flash: { laneId: string; reason: string; timer: ReturnType<typeof setTimeout> } | null = null
  /** A handle whose drop was refused: its sentence stays beside it for a while, in the refuse colour. */
  let gripRefusal: { name: string; reason: string; timer: ReturnType<typeof setTimeout> } | null = null
  function showGripRefusal(name: string, reason: string) {
    if (gripRefusal) clearTimeout(gripRefusal.timer)
    gripRefusal = { name, reason, timer: setTimeout(() => { gripRefusal = null; if (!destroyed) draw(proposal ?? value) }, 3000) }
  }
  let pending: Promise<void> = Promise.resolve()
  let wanted: { model: Workshop; skip?: string; grip?: string; animate: boolean } | null = null
  let layout: WorkshopBoardLayout = layoutOf(options.layout)
  /** The layout the board on show is drawn in: the board's own, or a held grip's (a plan growing under a dragged line). */
  let drawnLayout: WorkshopBoardLayout = layout
  const style: WorkshopNoteStyle = { ...options.style }
  /** What each lane's column says of a drop while a card is held or staged (see the data-workshop-drop attribute). */
  let drops = new Map<string, 'open' | 'over' | 'refused' | 'closed'>()
  // The notes a shown proposal adds or changes (drawn dashed, and tagged for assistive tools and tests).
  let proposed = new Set<string>()
  /** What onSelect was last told, as a string to compare. */
  let told: string | null = null
  /** The host has put this board in focus (setFocused). */
  let focused = false
  /** A map's grip size, a finger's at the zoom it is shown at; kept while the map is in focus (watchGripZoom). */
  let gripSize = mapGripSize(1)
  let stopWatchingZoom: (() => void) | null = null
  /** A press on a lane's caption or column that may be a tap: it selects that lane when it ends where it began. */
  let tapping: { pointerId: number; laneId: string; x: number; y: number } | null = null
  let tapTimer: ReturnType<typeof setTimeout> | null = null
  /** A selected note is being redrawn after undo, redo or a load; its selection is about to come back. */
  let reselecting = false
  /**
   * The board's lines as they are drawn, by line id: the card note that holds the connector (a
   * line is always held by a card, so it is never saved with the drawing), the note at its other
   * end (null for a free end, on no note), and what was drawn, to compare.
   */
  const drawnLines = new Map<string, { holder: any; other: any; swapped: boolean; key: string }>()
  // An impossible layout is refused before anything is drawn.
  geometry(value)

  const origin = options.origin ? { x: options.origin.x, y: options.origin.y } : besideExistingContent(slate)

  /** A board of many on one slate names its notes in its scope (`b2:card-<id>`); the first board has no prefix. */
  const prefix = scope ? scope + ':' : ''
  /**
   * The artwork name a note of this workshop draws: its id, unless it had to take another, without the
   * board's scope. Null for an id that is not in this board's scope (another board's note).
   */
  const nameOf = (id: string): string | null => drawnAs.get(id) ?? (!prefix ? id : id.startsWith(prefix) ? id.slice(prefix.length) : null)
  const kindOf = (id: string) => {
    const name = nameOf(id)
    return name === null ? null : partOf(name)
  }
  /** The id of the note that draws `name`: the name (in the board's scope) wherever the slate's document leaves it free. */
  function noteId(name: string): string {
    const given = standIn.get(name)
    if (given) return given
    const own = prefix + name
    // Ours already, under its own name, or nobody's yet.
    if ((owned.has(own) && !drawnAs.has(own)) || !slate.nodes.one?.(own)) return own
    const id = workshopStandInId(own, candidate => Boolean(slate.nodes.one?.(candidate)) || drawnAs.has(candidate))
    standIn.set(name, id)
    drawnAs.set(id, name)
    console.warn(`WORKSHOP: the slate already has a note named "${own}". It stays the slate's own; the workshop draws its note as "${id}".`)
    return id
  }
  /** Where a note put just beside the board goes: there, or along its row past the other boards (options.avoid). */
  function besideSpot(spot: { x: number; y: number; width: number; height: number }, side: 1 | -1 = 1) {
    let avoid: { x: number; y: number; width: number; height: number }[] = []
    try {
      avoid = options.avoid?.() ?? []
    } catch (error) {
      console.warn('WORKSHOP: avoid threw; the note goes just beside the board', error)
    }
    return avoid.length ? workshopFreeSpot(spot, avoid, side) : { x: spot.x, y: spot.y }
  }

  const policy: DragPolicy = {
    governs(node: any) {
      if (owned.get(node.id) !== node) return null
      const kind = kindOf(node.id)?.kind
      // A card is a note: lines are drawn to and from it as to any note, on a board that trades notes and cards.
      if (kind === 'card') return { canMove: !readOnly, canEditText: !readOnly && !proposal && value.kind !== 'release-plan', canConnect: acceptsLines() }
      if (kind === 'lane') return { canMove: false, canEditText: !readOnly && !proposal }
      // A grip pulled sideways (a plan's edge, launch day, a budget's divider on a laptop) says so under the pointer.
      if (kind === 'handle') return { canMove: !readOnly && !proposal, canEditText: false, ...(!layout.narrow && { cursor: kit ? 'ew-resize' : 'grab' }) }
      return decoration
    },
    onStart(node: any, point) {
      const part = kindOf(node.id)!
      const grab = { x: point.x - (node.options.x ?? 0), y: point.y - (node.options.y ?? 0) }
      if (part.kind === 'handle') {
        const follow = readOnly || proposal ? null : kit ? kit.handleDrag(value, nameOf(node.id)!, grab, layout) : mapGripDrag(nameOf(node.id)!)
        if (!follow) return false
        endFlash()
        clearStaged()
        if (gripRefusal) { clearTimeout(gripRefusal.timer); gripRefusal = null }
        grip = { name: nameOf(node.id)!, follow, last: null }
        return true
      }
      const cardId = part.key
      if (readOnly || proposal || !value.cards.some(card => card.id === cardId)) return false
      endFlash()
      clearStaged()
      let evaluate: ((point: { x: number; y: number }) => Workshop) | null = null
      try {
        evaluate = (kit?.chooser ?? options.chooseCandidate)?.(value, cardId, grab, layout) ?? null
      } catch (error) {
        console.warn('WORKSHOP: chooseCandidate threw; using the lane under the pointer', error)
      }
      held = { cardId, evaluate, grab, outcome: { kind: 'home' } }
      draw(value, { skip: cardId })
      return true
    },
    onMove(_node, point) {
      if (grip) {
        grip.last = grip.follow(local(point))
        draw(grip.last.next, { grip: grip.name, layout: grip.last.layout })
        tell(options.onPreview, grip.last.next === value ? null : grip.last.next)
        return
      }
      if (!held) return
      const outcome = decide(held.cardId, point, held.evaluate)
      if (sameOutcome(outcome, held.outcome)) return
      held.outcome = outcome
      const candidate = outcome.kind === 'candidate' ? outcome.next : null
      draw(candidate ?? value, { skip: held.cardId })
      tell(options.onPreview, candidate)
    },
    onEnd(node: any, point) {
      if (grip) {
        const { follow, name } = grip
        const result = follow(local(point))
        grip = null
        tell(options.onPreview, null)
        if (result.refusal) {
          // Said on screen as well as aloud: the sentence stays beside the handle, which goes back.
          showGripRefusal(name, result.refusal)
          draw(value)
          slate.announce?.(result.refusal)
          tell(options.onRefuse, { laneId: null, reason: result.refusal })
        } else if (!commitKit(result.next, {})) draw(value)
        const slot = slotOf(value, nameOf(node.id)!)
        return slot ? { accept: true, settle: slot } : { accept: false }
      }
      if (!held) return { accept: false }
      const { cardId, evaluate } = held
      const outcome = decide(cardId, point, evaluate)
      const card = value.cards.find(item => item.id === cardId)!
      held = null
      tell(options.onPreview, null)
      if (outcome.kind === 'candidate' && kit) {
        if (!commitKit(outcome.next, { cardId, laneId: outcome.laneId }, cardId)) { draw(value, { skip: cardId }); return { accept: false } }
        // Landed where the rules let it: the rule that stopped it says why, beside it.
        if (outcome.said) { showGripRefusal('card-' + cardId, outcome.said); slate.announce?.(outcome.said) }
        const slot = slotOf(value, nameOf(node.id)!)
        return slot ? { accept: true, settle: slot } : { accept: true }
      }
      if (outcome.kind === 'candidate') {
        value = outcome.next
        draw(value, { skip: cardId })
        const lane = value.lanes.find(item => item.id === outcome.laneId)!
        slate.announce?.(`${cardName(card)} moved to ${lane.label}. ${workshopLaneCaption(value, lane.id)}.`)
        tell(options.onChange, value, { cardId, laneId: outcome.laneId })
        const slot = slotOf(value, nameOf(node.id)!)
        return slot ? { accept: true, settle: slot } : { accept: true }
      }
      if (outcome.kind === 'refused') {
        refuse(cardName(card), { cardId, laneId: outcome.laneId, reason: outcome.reason })
        // A plan's bar that could go nowhere its rules let it: the rule says why beside the bar.
        if (outcome.near) showGripRefusal('card-' + cardId, outcome.reason)
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
          slate.announce?.(`${cardName(card)} was not dropped on a lane. It stays where it was.`)
          tell(options.onRefuse, { cardId, laneId: null, reason: '' })
        }
      }
      return { accept: false }
    },
    onCancel(node: any) {
      if (grip) {
        grip = null
        tell(options.onPreview, null)
        draw(value)
        return
      }
      const card = held && value.cards.find(item => item.id === held!.cardId)
      held = null
      tell(options.onPreview, null)
      draw(value, { skip: kindOf(node.id)?.key })
      if (card) slate.announce?.(`Move cancelled. ${cardName(card)} stays where it was.`)
    },
    onTextCommit(node: any, text, previous) {
      const target = kindOf(node.id)
      if (!target || readOnly || proposal) return false
      let label = text.replace(/\s+/g, ' ').trim()
      const edits: WorkshopEdit[] = []
      // On a business board the numbers typed on a card are its days or its amount.
      const business = businessKind(value)
      const read = business && target.kind === 'card' ? workshopRules(business).renamed(value, target.key, label) : null
      if (read) {
        label = read.label
        edits.push(...read.edits)
      }
      const rename = target.kind === 'lane' ? { laneId: target.key, label } : { cardId: target.key, label }
      edits.unshift(target.kind === 'lane' ? { kind: 'rename_lane', lane: { id: target.key }, label } : { kind: 'rename_card', card: { id: target.key }, label })
      // The rule every surface renames by: the edit reducer, with its sentence when it refuses.
      const renamed = applyWorkshopEdits(value, edits)
      if ('refused' in renamed) {
        const { reason } = renamed.refused
        slate.announce?.(`${previous} keeps its name. ${reason}`)
        tell(options.onRefuse, { ...(target.kind === 'lane' ? { laneId: target.key } : { cardId: target.key }), rename, reason })
        return false
      }
      if (JSON.stringify(renamed.workshop) === JSON.stringify(value)) { draw(value); return false }
      value = renamed.workshop
      draw(value)
      slate.announce?.(read ? renamed.report.edits.map(edit => edit.said).join(' ') : `${previous} renamed to ${label}.`)
      tell(options.onChange, value, { rename, ...(kit ? { edits } : {}) })
      // A business card is redrawn with its numbers; the note's text is the board's to set.
      return read ? false : label
    },
    onKeyDown(node: any, event) {
      const target = kindOf(node.id)
      if (readOnly || proposal || held || grip || event.ctrlKey || event.metaKey || event.altKey) return false
      if (picking && (picking.node !== node.id || !['Enter', 'Escape'].includes(event.key) && event.key.toLowerCase() !== picking.key)) endPicking()
      if (picking && event.key === 'Escape') {
        event.preventDefault()
        endPicking()
        slate.announce?.('Cancelled. Nothing changed.')
        return true
      }
      if (picking && event.key === 'Enter') {
        event.preventDefault()
        const chosen = picking.choices[picking.at]
        picking = null
        tell(options.onPreview, null)
        // The edits chosen are the change: made by the reducer already, sent as they are.
        value = chosen.next
        draw(value)
        slate.announce?.(chosen.done)
        tell(options.onChange, value, { ...(target?.kind === 'card' ? { cardId: target.key } : {}), edits: chosen.edits })
        return true
      }
      const offered = kit?.keyChoices?.(value, nameOf(node.id)!, event.key)
      if (offered) {
        event.preventDefault()
        const choices: { said: string; edits: WorkshopEdit[]; next: Workshop; done: string }[] = []
        const why: string[] = []
        for (const choice of typeof offered === 'string' ? [] : offered) {
          const made = applyWorkshopEdits(value, choice.edits)
          if ('refused' in made) why.push(`${choice.said}: ${made.refused.reason}`)
          else choices.push({ ...choice, next: made.workshop, done: made.report.edits.map(edit => edit.said).join(' ') })
        }
        if (!choices.length) {
          slate.announce?.(typeof offered === 'string' ? offered : why.join(' '))
          return true
        }
        const at = picking && picking.node === node.id ? (picking.at + 1) % choices.length : 0
        picking = { node: node.id, key: event.key.toLowerCase(), choices, at }
        draw(choices[at].next)
        tell(options.onPreview, choices[at].next)
        const more = choices.length > 1 ? ` (${at + 1} of ${choices.length}). Press ${event.key.toUpperCase()} for the next,` : '. Press'
        slate.announce?.(`${choices[at].said}${more} Enter to make it, Escape to cancel.`)
        return true
      }
      const keyed = kit?.keyEdit?.(value, nameOf(node.id)!, { key: event.key, shiftKey: event.shiftKey })
      if (keyed) {
        event.preventDefault()
        const result = applyWorkshopEdits(value, keyed)
        if ('refused' in result) {
          slate.announce?.(result.refused.reason)
          tell(options.onRefuse, { laneId: result.refused.laneId, ...(target?.kind === 'card' ? { cardId: target.key } : {}), reason: result.refused.reason })
        } else commitKit(result.workshop, target?.kind === 'card' ? { cardId: target.key } : {})
        return true
      }
      if (target?.kind !== 'card') return false
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
        const before = value
        value = next
        draw(value)
        reveal(laneId)
        tell(options.onPreview, null)
        const lane = value.lanes.find(item => item.id === laneId)!
        slate.announce?.(`${cardName(card)} moved to ${lane.label}. ${workshopLaneCaption(value, laneId)}.`)
        tell(options.onChange, value, { cardId: card.id, laneId, ...(kit ? { edits: kit.editsBetween(before, value) } : {}) })
        return true
      }
      if (event.key === 'Escape') {
        event.preventDefault()
        clearStaged()
        slate.announce?.(`Move cancelled. ${cardName(card)} stays where it was.`)
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
      drawnLines.clear()
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
    const under = laneId && kit?.noteUnder?.(value, local(point), layout)
    if (under) offer.under = under
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
    const under = kit?.noteUnder?.(value, local(point), layout)
    if (under) offer.under = under
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
    const { width } = geometry(value)
    const spot = besideSpot({ x: origin.x + width + 32, y: o.y ?? origin.y, width: o.width ?? 0, height: o.height ?? 0 })
    const x = Math.round(spot.x), y = Math.round(spot.y)
    node.position(x, y, () => slate.updateSelectionResizeRotate?.(), undefined, prefersReducedMotion() ? 0 : 180)
    slate.broadcast?.('onNodesMove', { nodeOptions: [v2NodeToV1({ ...node.options, x, y })] })
  }
  policy.undoState = () => ({ cards: value.cards.map(card => ({ ...card })), pairs: [...pairs], lines: (value.lines ?? []).map(line => ({ ...line })) })
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
      // This board held the card at that step too, so the note is not this card: another board on the
      // slate has a card by the same id (two boards made from one preset), and only that board lets it go.
      if (recorded.has(cardId)) continue
      // Its lines stay joined to the note: a line to a note is the drawing's again (the record holds it).
      value = validateWorkshop({ ...value, cards: value.cards.filter(item => item !== card), lines: workshopRenamedLines(value.lines, cardId, noteId) })
      draw(value)
      const answer = tell(options.onChange, value, { cardId, cardToNote: { noteId }, via: 'undo' })
      slate.holdTrade?.(noteId, answer)
      watch(answer)
    }
    // A note this step took away is a card again, in the lane it was in.
    for (const noteId of notes.removed) {
      const cardId = cardOf(noteId)
      const card = recorded.get(cardId)
      if (!card || value.cards.some(item => item.id === cardId)) continue
      // The lines it had as a card come back with it.
      const recordedLines = ((state?.lines ?? []) as WorkshopLine[]).filter(line => line.parentId === cardId || line.childId === cardId)
      // Its words with its numbers ("Audit log · 3 points"), so it comes back as it was, points and all.
      const words = workshopCardNoteText(value, card)
      const offer = { id: cardId, label: words, ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}),
        ...(recordedLines.length ? { lines: recordedLines } : {}) }
      const lane = [card.laneId, ...value.lanes.map(item => item.id)].find(id => workshopNoteCandidate(value, id, offer))
      if (!lane) {
        slate.announce?.(`${cardName(card)} could not go back on the board: there is no room for it.`)
        continue
      }
      value = inRecordedPlace(workshopNoteCandidate(value, lane, offer)!, cardId, state?.cards ?? [])
      if (cardId !== noteId) pairs.set(noteId, cardId)
      draw(value)
      // Where it went back among the cards, so every copy of the board puts it in the same place.
      const at = value.cards.findIndex(item => item.id === cardId)
      const before = value.cards.slice(at + 1).find(item => item.laneId === lane)?.id
      const answer = tell(options.onChange, value, { cardId, laneId: lane, noteToCard: { noteId, label: words, ...(card.look ? { look: card.look } : {}),
        ...(card.asNote ? { asNote: card.asNote } : {}), ...(before ? { before } : {}),
        ...(recordedLines.length ? { lines: workshopRenamedLines(recordedLines, cardId, noteId) } : {}) }, via: 'undo' })
      slate.holdTrade?.(noteId, answer)
      watch(answer)
    }
    // The lines between cards and notes are as they were at that step.
    if (Array.isArray(state?.lines)) restoreLines(state.lines as WorkshopLine[])
  }
  // A note at one end of a line of the board arrived (the drawing loaded after the board, a
  // collaborator's note, an undo): the line is drawn to it.
  let joining = false
  policy.onNodeAdded = (node: any) => {
    if (destroyed || joining || owned.get(node.id) === node) return
    if (!(value.lines ?? []).some(line => line.parentId === node.id || line.childId === node.id)) return
    joining = true
    queueMicrotask(() => { joining = false; if (!destroyed) showCurrent() })
  }
  // A person drew, changed or took away a line with a card at one end. The engine has drawn it
  // already; once the gesture that made it is over, the board takes it (or the line goes, and the
  // reason is said).
  policy.onLine = (type: string, data: any) => {
    if (destroyed) return
    queueMicrotask(() => { if (!destroyed) lineChanged(type, data) })
  }

  const releasePolicy = slate.setDragPolicy(policy)
  const stopWatchingSelection: (() => void) | undefined = (options.onSelect || layer) ? slate.onSelectionChange?.(() => { reportSelection(); refocus() }) : undefined
  // The card under the pointer (a plan shows its grips while it is there).
  let hovered: string | null = null
  const onHover = (event: Event) => {
    const target = (event.target as Element | null)?.closest?.('[data-node-id]')
    const id = target?.getAttribute('data-node-id') ?? null
    const next = id && owned.has(id) ? focusOfNote(id) : null
    if (next === hovered) return
    hovered = next
    refocus()
  }
  if (layer) slate.element?.addEventListener?.('pointerover', onHover)
  // Any press on the slate ends a keyboard-staged move: the person has moved on. A press on a lane's
  // caption or the empty part of its column may be a tap, which selects the lane as a tap on its
  // header does: on a phone or from the keyboard, selecting a lane is how a host offers the board's
  // own controls (Boards S2a). A press that moves is a pan or a marquee, never a tap, and a tap
  // followed by another press is a double-click (a note made in the lane), so the lane is selected
  // only once the double-click's time has passed. Only the primary button taps (a right-click is
  // the menu's). A press on a line is the line's (it selects the line, to change its ends or take
  // it away). A press that clears a selection, a note's or a line's, is a deselect, as a click on
  // empty canvas is; only moving from one of this board's lanes to another is a tap.
  const onPress = (event?: PointerEvent) => {
    if (staged) clearStaged()
    // A press anywhere but on a map's path ends that path's pick.
    if (picked && !(event?.target as Element | null)?.closest?.('[data-board-pick]')) {
      picked = null
      if (layerShown) paintLayer(layerShown)
      queueMicrotask(reportSelection)
    }
    tapping = null
    if (tapTimer) { clearTimeout(tapTimer); tapTimer = null }
    // Captions and columns take no pointer of their own (they are drawn under the cards), so the
    // press lands on the canvas: what it is on is found by where it is.
    if (!event || destroyed || typeof slate.clientToWorld !== 'function') return
    if (typeof event.button === 'number' && event.button !== 0) return
    if ((event.target as Element | null)?.closest?.('[data-node-id], [data-connection-id]')) return
    if (slate.getSelectedLine?.()) return
    const lanes = new Set(value.lanes.map(lane => noteId(workshopNodeIds.lane(lane.id))))
    if ((slate.getSelectedNodes?.() ?? []).some((node: any) => !lanes.has(node?.id))) return
    const parts = value.lanes.flatMap(lane => [workshopNodeIds.caption(lane.id), workshopNodeIds.column(lane.id)])
      .map(name => owned.get(noteId(name))).filter(Boolean)
    const hit = parts.length ? slate.hitTestNodes?.(slate.clientToWorld({ x: event.clientX, y: event.clientY }), parts, { padding: 0 }) : null
    const part = hit ? kindOf(hit.id) : null
    if (part) tapping = { pointerId: event.pointerId, laneId: part.key, x: event.clientX, y: event.clientY }
  }
  const onLift = (event: PointerEvent) => {
    const tap = tapping
    tapping = null
    if (!tap || event.pointerId !== tap.pointerId || Math.hypot(event.clientX - tap.x, event.clientY - tap.y) > 6) return
    tapTimer = setTimeout(() => {
      tapTimer = null
      if (destroyed || held || grip || !value.lanes.some(lane => lane.id === tap.laneId)) return
      if ((slate.getSelectedNodes?.() ?? []).length || slate.getSelectedLine?.() || slate.element?.ownerDocument?.querySelector?.('.sb-inline-editor')) return
      const lane = owned.get(noteId(workshopNodeIds.lane(tap.laneId)))
      if (lane) slate.selectNodes?.([lane])
    }, 350)
  }
  const onLost = () => { tapping = null }
  slate.element?.addEventListener?.('pointerdown', onPress, true)
  slate.element?.ownerDocument?.addEventListener?.('pointerup', onLift, true)
  slate.element?.ownerDocument?.addEventListener?.('pointercancel', onLost, true)
  draw(value, { animate: false })

  // ─── Rules ───────────────────────────────────────────────────────

  /** What dropping the card at `point` would do. */
  function decide(cardId: string, point: WorldPoint, evaluate: ((point: { x: number; y: number }) => Workshop) | null): Outcome {
    const card = value.cards.find(item => item.id === cardId)
    if (!card) return { kind: 'outside' }
    if (kit) {
      // A business board: its own refusals first, then always its chooser.
      const at = local(point)
      const refused = kit.refusalAt(value, cardId, held?.grab ?? { x: 0, y: 0 }, at, layout)
      if (refused && !refused.lands) return { kind: 'refused', laneId: refused.laneId, reason: refused.reason }
      const { width, height } = geometry(value)
      if (at.x < -40 || at.y < -40 || at.x > width + 40 || at.y > height + 40) return { kind: 'outside' }
      let chosen: Workshop = value
      try { chosen = evaluate?.(at) ?? value } catch (error) { console.warn('WORKSHOP: the board kit\'s chooser threw', error) }
      if (JSON.stringify(chosen) === JSON.stringify(value)) return refused ? { kind: 'refused', laneId: refused.laneId, reason: refused.reason, near: true } : { kind: 'home' }
      return { kind: 'candidate', laneId: chosen.cards.find(item => item.id === cardId)?.laneId ?? card.laneId, next: chosen, ...(refused && { said: refused.reason }) }
    }
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
    if (kit) return false
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
        slate.announce?.(`${cardName(card)} is back in ${back.label}.`)
        return
      }
      if (open.includes(back)) {
        const next = workshopCandidate(value, cardId, back.id)!
        staged = { cardId, laneId: back.id, next }
        draw(next)
        reveal(back.id, next)
        tell(options.onPreview, next)
        slate.announce?.(`${cardName(card)} to ${back.label}: ${workshopLaneCaption(next, back.id)}. Press Enter to move it, Escape to cancel.`)
        return
      }
      const reason = workshopRefusal(value, cardId, back.id) ?? 'That move is not available.'
      endFlash()
      flash = { laneId: back.id, reason, timer: setTimeout(() => endFlash(), 1500) }
      draw(proposal ?? value)
      reveal(back.id, proposal ?? value)
      slate.announce?.(`${cardName(card)} can't move to ${back.label}. ${reason}`)
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
        slate.announce?.(`${cardName(card)} has no lane to move to on that side.`)
        return
      }
      const reason = workshopRefusal(value, cardId, closed.id) ?? 'That move is not available.'
      flash = { laneId: closed.id, reason, timer: setTimeout(() => endFlash(), 1500) }
      draw(staged?.next ?? proposal ?? value)
      reveal(closed.id, staged?.next ?? proposal ?? value)
      slate.announce?.(`${cardName(card)} can't move to ${closed.label}. ${reason}`)
      tell(options.onRefuse, { cardId, laneId: closed.id, reason })
      return
    }
    if (target.id === card.laneId) {
      clearStaged()
      reveal(target.id, proposal ?? value)
      slate.announce?.(`${cardName(card)} is back in ${target.label}.`)
      return
    }
    const next = workshopCandidate(value, cardId, target.id)!
    staged = { cardId, laneId: target.id, next }
    draw(next)
    reveal(target.id, next)
    tell(options.onPreview, next)
    slate.announce?.(`${cardName(card)} to ${target.label}: ${workshopLaneCaption(next, target.id)}. Press Enter to move it, Escape to cancel.`)
  }

  /**
   * Bring a lane into view when a keyboard move goes to one that is off screen (a
   * wrapped board on a small screen), by the shortest pan that shows its column.
   */
  function reveal(laneId: string, shown: Workshop = value) {
    const place = kit ? partBox(shown, workshopNodeIds.column(laneId)) : workshopLanePlaces(shown, { layout, rows: heldRows() }).places.find(item => item.laneId === laneId)
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
    // A note selected on the slate ends a path's pick (not the selection the pick itself cleared, which may
    // still be reported while it goes).
    if (picked && selected.some((node: any) => !pickCleared.has(node.id))) { picked = null; if (layerShown) paintLayer(layerShown) }
    const [from, to] = picked ? picked.split('>') : []
    const selection: WorkshopSelection = only?.kind === 'card' ? { cardId: only.key } : only?.kind === 'lane' ? { laneId: only.key }
      : from && to && !only ? { path: { from, to } } : null
    const key = selection ? JSON.stringify(selection) : null
    if (key === told) return
    told = key
    tell(options.onSelect, selection)
  }

  /** Put back the board a key's choice was showing. */
  function endPicking() {
    if (!picking) return
    picking = null
    draw(value)
    tell(options.onPreview, null)
  }

  function clearStaged() {
    if (!staged) return
    staged = null
    tell(options.onPreview, null)
    draw(proposal ?? value)
  }

  /** Stage a card's move off the lanes, just beside the board on that side, where it would become a note. */
  function stageOff(card: WorkshopCard, side: -1 | 1) {
    const { width } = geometry(value)
    const drawnCard = owned.get(noteId(workshopNodeIds.card(card.id)))?.options
    const cardWidth = drawnCard?.width ?? 228
    const spot = besideSpot({ x: side > 0 ? origin.x + width + 32 : origin.x - cardWidth - 32, y: drawnCard?.y ?? origin.y,
      width: cardWidth, height: drawnCard?.height ?? 76 }, side)
    const next = workshopCardAsNote(value, card.id)!
    staged = { cardId: card.id, laneId: null, side, spot, next: value }
    draw(value)
    tell(options.onPreview, next)
    slate.announce?.(`${cardName(card)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`)
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
    if (words.trim() !== label && words.length <= 4000) asNote.text = words.trim()
    if (typeof o.shape === 'string' && /^[a-z]{1,24}$/i.test(o.shape)) asNote.shape = o.shape
    for (const key of ['width', 'height'] as const) if (Number.isFinite(o[key]) && o[key] >= 10 && o[key] <= 4000) asNote[key] = Math.round(o[key])
    // Its picture and its link come back with the note.
    if (workshopKeepsPicture(o.image)) {
      asNote.image = { src: o.image }
      for (const [key, from] of [['width', 'imageOrigWidth'], ['height', 'imageOrigHeight']] as const) {
        if (Number.isFinite(o[from]) && o[from] >= 1 && o[from] <= 20000) asNote.image[key] = o[from]
      }
    }
    if (o.link?.data && workshopKeepsLink({ ...(o.link.type ? { type: o.link.type } : {}), data: o.link.data, ...(typeof o.link.show === 'boolean' ? { show: o.link.show } : {}) })) {
      asNote.link = { ...(o.link.type ? { type: o.link.type } : {}), data: o.link.data, ...(typeof o.link.show === 'boolean' ? { show: o.link.show } : {}) }
    }
    const lines = linesOfNote(node)
    return { id: node.id as string, label, ...(look ? { look } : {}), ...(Object.keys(asNote).length ? { asNote } : {}), ...(lines.length ? { lines } : {}) }
  }

  /**
   * Every line an ordinary note has: the drawing's connectors from it and to it (one whose end is
   * free on the canvas too), and the board's lines between it and a card. They stay joined to the
   * card it becomes.
   */
  function linesOfNote(node: any): WorkshopLine[] {
    const found = new Map<string, WorkshopLine>()
    const ours = (id: unknown) => typeof id === 'string' && Boolean(owned.get(id)) && owned.get(id) === slate.nodes.one(id)
    for (const link of node.relationships?.getAssociations?.() ?? []) {
      if (link.targetPoint || !ours(link.childId)) found.set(link.id, lineOf(link))
    }
    for (const other of slate.nodes?.allNodes ?? []) {
      if (other === node || ours(other.id)) continue
      for (const link of other.relationships?.getAssociations?.() ?? []) {
        if (link.childId === node.id && !link.targetPoint) found.set(link.id, lineOf(link))
      }
    }
    for (const line of workshopLinesOf(value, node.id)) found.set(line.id, line)
    return [...found.values()]
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
    // On a map the notes become cards free of the step's limit, which counts tokens: one note or several alike.
    const held = workshopLaneHeld(value, laneId)
    if (lane.capacity !== undefined && !lane.station && held + entries.length > lane.capacity) {
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
    // A note keeps its lines as a card, a line whose end is free on the canvas too (owner 2026-11-22).
    // A picture or a link goes with the card and comes back with the note, unless the card cannot keep it.
    if (node.options?.image && !workshopKeepsPicture(node.options.image)) return 'A note with a picture kept in the page itself stays a note.'
    const link = node.options?.link
    if (link?.data && !workshopKeepsLink({ ...(link.type ? { type: link.type } : {}), data: link.data })) return 'A note with this link stays a note.'
    return null
  }

  const noteName = (label: string) => label || 'This note'
  /** What a card is called in a sentence: its words, or that it has none. */
  const cardName = (card: { label: string }) => card.label || 'The empty card'
  /**
   * What a screen reader hears of a note's shape as it joins or leaves the board: the card is
   * drawn as the board draws its cards, and the shape comes back when it is dragged off. A box
   * looks the same either way, so it says nothing (the app's notice says the same to the eye).
   */
  const shapeWord = (shape?: string) => {
    const key = String(shape ?? '').toLowerCase()
    return key === '' || key === 'rectangle' || key === 'roundedrectangle' ? null : (SHAPE_WORDS[key] ?? 'shape')
  }
  const article = (word: string) => (/^[aeiou]/i.test(word) ? 'an ' : 'a ') + word
  const joinedShape = (cards: { label: string; asNote?: { shape?: string } }[]) => {
    const shaped = cards.flatMap(card => { const word = shapeWord(card.asNote?.shape); return word ? [{ card, word }] : [] })
    if (!shaped.length) return ''
    if (cards.length === 1) {
      const { word } = shaped[0]
      return word === 'shape' ? ' It had its own shape: drag it off the board to get it back.' : ` It was ${article(word)}: drag it off the board to get its ${word} back.`
    }
    return ' ' + shaped.map(({ card, word }) => word === 'shape' ? `${cardName(card)} had its own shape` : `${cardName(card)} was ${article(word)}`).join('; ')
      + ': drag a card off the board to get its shape back.'
  }
  const leftShape = (shape?: string) => {
    const word = shapeWord(shape)
    return !word ? '' : word === 'shape' ? ' It has its shape back.' : ` It is ${article(word)} again.`
  }

  // ─── Lines ───────────────────────────────────────────────────────

  /** Whether a person may draw lines to and from this board's cards now. */
  function acceptsLines() {
    // Lines join the cards of a board of plain lanes: a business board's cards are notes, but carry no lines.
    return !destroyed && !readOnly && !proposal && !viewer() && workshopTakesLines(value)
  }

  /** A connector as the board keeps a line: its ends and its look, nothing a connector does not draw. */
  function lineOf(link: Record<string, any>): WorkshopLine {
    const line: Record<string, unknown> = { id: link.id, parentId: link.parentId, childId: link.childId }
    for (const key of ['lineColor', 'lineOpacity', 'lineWidth', 'lineDash', 'lineType', 'lineCurveType', 'lineCurviness', 'lineEffect',
      'showParentArrow', 'showChildArrow', 'label'] as const) {
      const item = link[key]
      if (item !== undefined && item !== null && item !== '') line[key] = item
    }
    // A pinned end keeps its spot on the note's edge wherever the line goes.
    for (const key of ['sourceAnchor', 'targetAnchor'] as const) {
      const spot = link[key]
      if (spot && Number.isFinite(spot.x) && Number.isFinite(spot.y)) line[key] = { x: spot.x, y: spot.y }
    }
    // A free end stays at its point on the canvas, pinned to no note.
    const point = link.targetPoint
    if (point && Number.isFinite(point.x) && Number.isFinite(point.y)) {
      line.targetPoint = { x: point.x, y: point.y }
      delete line.targetAnchor
    }
    return line as unknown as WorkshopLine
  }

  /** A line as drawn from its other end: the arrows and the pins change places. */
  function turned<T extends Record<string, any>>(line: T, from: Record<string, any>): T {
    const out: Record<string, any> = { ...line }
    out.showParentArrow = from.showChildArrow ?? true
    out.showChildArrow = from.showParentArrow ?? false
    delete out.sourceAnchor
    delete out.targetAnchor
    if (from.targetAnchor) out.sourceAnchor = from.targetAnchor
    if (from.sourceAnchor) out.targetAnchor = from.sourceAnchor
    return out as T
  }

  /** What a note of the slate is to the board: a card (by its card id), an ordinary note (by its id), or neither. */
  function refOf(node: any): string | null {
    if (!node || slate.nodes.one(node.id) !== node) return null
    if (owned.get(node.id) === node) {
      const part = kindOf(node.id)
      return part?.kind === 'card' && value.cards.some(card => card.id === part.key) ? part.key : null
    }
    return node.options?.isComment ? null : node.id
  }

  /** The note a line's end names on `model`: the card's note, or the ordinary note. */
  function endOf(model: Workshop, ref: string): any {
    if (model.cards.some(card => card.id === ref)) {
      const node = owned.get(noteId(workshopNodeIds.card(ref)))
      return node?.relationships && node.svgGroup ? node : null
    }
    const node = slate.nodes.one(ref)
    return node && owned.get(ref) !== node && node.svgGroup ? node : null
  }

  /**
   * Join ordinary notes with lines that are the drawing's (a card's lines once it is a note).
   * Returns the packages that tell collaborators of them.
   */
  function joinNotes(lines: WorkshopLine[]): SlatePackageLike[] {
    const packages: SlatePackageLike[] = []
    for (const line of lines) {
      const parent = slate.nodes.one(line.parentId)
      if (!parent?.relationships || owned.get(parent.id) === parent || parent.relationships.hasAssociationId?.(line.id)) continue
      // A free end goes back to its point on the canvas.
      if (line.targetPoint) {
        const association = parent.relationships.addFloatingAssociation(line.targetPoint, v1AssociationToV2(line))
        packages.push({ type: 'addRelationship', data: { ...association } })
        continue
      }
      const child = slate.nodes.one(line.childId)
      if (!child || owned.get(child.id) === child) continue
      const association = parent.relationships.addAssociation(child, v1AssociationToV2(line))
      packages.push({ type: 'addRelationship', data: { ...association } })
    }
    return packages
  }

  /**
   * Draw the board's lines on `model`. A line is always held by a card's note (a line from a note
   * to a card is held by the card, its arrows the other way round), so the slate never saves it
   * with the drawing: the board keeps it.
   */
  function drawLines(model: Workshop) {
    const wanted = new Set<string>()
    for (const line of model.lines ?? []) {
      if (line.targetPoint) {
        // A free end: the card holds the line, to its point on the canvas.
        const holder = endOf(model, line.parentId)
        if (!holder || owned.get(holder.id) !== holder) continue
        const link: Record<string, unknown> = { ...line, parentId: holder.id }
        const key = JSON.stringify(link)
        wanted.add(line.id)
        const was = drawnLines.get(line.id)
        if (was && was.key === key && was.holder === holder && !was.other && holder.relationships.hasAssociationId?.(line.id)) continue
        if (was && slate.nodes.one(was.holder.id) === was.holder) was.holder.relationships?.removeAssociation?.(line.id)
        holder.relationships.addFloatingAssociation(line.targetPoint, v1AssociationToV2(link))
        drawnLines.set(line.id, { holder, other: null, swapped: false, key })
        continue
      }
      const parent = endOf(model, line.parentId), child = endOf(model, line.childId)
      if (!parent || !child || parent === child) continue
      const swapped = owned.get(parent.id) !== parent
      const holder = swapped ? child : parent, other = swapped ? parent : child
      const link: Record<string, unknown> = swapped
        ? turned({ ...line, parentId: holder.id, childId: other.id }, line)
        : { ...line, parentId: holder.id, childId: other.id }
      const key = JSON.stringify(link)
      wanted.add(line.id)
      const was = drawnLines.get(line.id)
      if (was && was.key === key && was.holder === holder && was.other === other && holder.relationships.hasAssociationId?.(line.id)) continue
      if (was && slate.nodes.one(was.holder.id) === was.holder) was.holder.relationships?.removeAssociation?.(line.id)
      holder.relationships.addAssociation(other, v1AssociationToV2(link))
      drawnLines.set(line.id, { holder, other, swapped, key })
    }
    for (const [lineId, was] of [...drawnLines]) {
      if (wanted.has(lineId)) continue
      if (slate.nodes.one(was.holder.id) === was.holder && was.holder.relationships?.hasAssociationId?.(lineId)) was.holder.relationships.removeAssociation(lineId)
      drawnLines.delete(lineId)
    }
  }

  /** Take a connector the engine drew off the slate, as the board's host (nothing is sent). */
  function unlink(data: { parentId?: string; id?: string; childId?: string }) {
    const parent = data.parentId ? slate.nodes.one(data.parentId) : null
    const key = data.id ?? data.childId
    if (!parent?.relationships || !key) return
    slate.withPolicyAuthority(() => { if (parent.relationships.hasAssociationId?.(key) || !data.id) parent.relationships.removeAssociation(key) })
  }

  /**
   * A board line whose end a person is moving: the engine takes the line off and adds it again,
   * with the same id, where the end was let go. Both arrive before this is settled, so the move
   * is one change (or is put back), never a line taken away.
   */
  let moving: { lineId: string } | null = null

  /** A line the engine drew, changed or took away with a card at one end: the board takes the change, or it is undone. */
  function lineChanged(type: string, data: any) {
    if (type === 'addRelationship') {
      // One of the board's own lines being drawn again is nothing new.
      if (drawnLines.get(data?.id)?.holder.id === data?.parentId) return
      const free = Boolean(data?.targetPoint)
      const parent = slate.nodes.one(data?.parentId), child = free ? null : slate.nodes.one(data?.childId)
      const from = refOf(parent), to = free ? null : refOf(child)
      const moved = moving?.lineId === data?.id ? value.lines?.find(line => line.id === data?.id) : undefined
      if (moved) moving = null
      const refuse = (reason: string) => {
        unlink(data)
        // A moved end goes back where it was: the line is the board's as before.
        if (moved) draw(proposal ?? value)
        slate.announce?.(reason)
        tell(options.onRefuse, { reason, laneId: null })
      }
      if (!acceptsLines()) { unlink(data); if (moved) draw(proposal ?? value); return }
      // A card's line ends on a note, on another card, or free on the canvas (a free end is held by its card).
      if (!from || (!to && !free)) return refuse(moved ? 'A card\'s line ends on a note or another card, so that end went back.' : 'A line from a card ends on a note or another card.')
      const far = free ? String(data.childId) : to!
      if (moved) {
        const parentCard = value.cards.some(card => card.id === from), childCard = !free && value.cards.some(card => card.id === to)
        // Neither end on a card now: the line is the drawing's, as the engine has drawn it.
        if (!parentCard && !childCard) return commitLine({ remove: moved.id })
        const line: WorkshopLine = { ...lineOf(data), id: moved.id, parentId: from, childId: far }
        const reason = workshopLineRefusal(value, line)
        if (reason) return refuse(reason)
        unlink(data)
        commitLine({ set: line })
        return
      }
      const line = workshopNewLine(value, from, far, lineOf(data))
      const reason = workshopLineRefusal(value, line)
      if (reason) return refuse(reason)
      unlink(data)
      commitLine({ set: line })
      return
    }
    if (type === 'removeRelationship') {
      const lineId = [...drawnLines].find(([id, was]) => (id === data?.id || (!data?.id && was.other?.id === data?.childId)) && was.holder.id === data?.parentId)?.[0]
      if (!lineId) return
      const was = drawnLines.get(lineId)!
      drawnLines.delete(lineId)
      // A note or card at either end that has left the slate took the line off with it: the board keeps it for when it is back.
      if (slate.nodes.one(was.holder.id) !== was.holder || (was.other && slate.nodes.one(was.other.id) !== was.other) || !acceptsLines()) {
        if (acceptsLines() || destroyed) return
        // A viewer cannot take a line away: it is drawn again.
        return draw(proposal ?? value)
      }
      // An end being moved: its add, already on its way, decides. Taken away only when none comes
      // to the board (an end moved so that no card holds the line keeps it in the drawing).
      moving = { lineId }
      queueMicrotask(() => {
        if (destroyed || moving?.lineId !== lineId) return
        moving = null
        commitLine({ remove: lineId })
      })
      return
    }
    if (type === 'onLinePropertiesChanged') {
      for (const item of Array.isArray(data) ? data : [data]) {
        const entry = [...drawnLines].find(([id, was]) => id === item?.associationId && was.holder.id === item?.id)
        if (!entry) continue
        const [lineId, was] = entry
        const line = value.lines?.find(item => item.id === lineId)
        const link = was.holder.relationships?.getAssociations?.().find((item: any) => item.id === lineId)
        if (!line || !link) continue
        if (!acceptsLines()) { draw(proposal ?? value); continue }
        const look = lineOf(link)
        const next: WorkshopLine = was.swapped
          ? turned({ ...look, id: line.id, parentId: line.parentId, childId: line.childId }, look)
          : { ...look, id: line.id, parentId: line.parentId, childId: line.childId }
        if (JSON.stringify(validateLine(next)) === JSON.stringify(line)) continue
        // The look it was drawn with is now the line's: the next drawing must not take it back.
        drawnLines.set(lineId, { ...was, key: '' })
        commitLine({ set: next })
      }
    }
  }

  /** The line as the board would keep it, or null when it cannot be kept. */
  function validateLine(line: WorkshopLine): WorkshopLine | null {
    return workshopWithLine({ ...value, lines: [] }, line)?.lines?.[0] ?? null
  }

  /**
   * Draw or take away one line on the board, as one undo step, and tell the host. A host that
   * cannot save it has the board put back as it was.
   */
  function commitLine(change: { set: WorkshopLine } | { remove: string }) {
    const before = value.lines?.find(line => line.id === ('set' in change ? change.set.id : change.remove))
    const next = 'set' in change ? workshopWithLine(value, change.set) : workshopWithoutLine(value, change.remove)
    if (!next || next === value) return
    slate.beginHostStep?.()
    value = next
    slate.endHostStep?.()
    draw(proposal ?? value)
    const line = 'set' in change ? change.set : before!
    const ends = [line.parentId, line.childId].map(ref => value.cards.find(card => card.id === ref)?.label ?? slate.nodes.one(ref)?.options?.text?.replace(/\s+/g, ' ').trim() ?? '')
    const named = (index: number) => ends[index] || (index === 1 && line.targetPoint ? 'a point on the canvas' : 'a note')
    slate.announce?.('set' in change
      ? (before ? `The line from ${named(0)} to ${named(1)} changed.` : line.targetPoint ? `${named(0)} has a line to a point on the canvas.` : `${named(0)} is joined to ${named(1)}.`)
      : `The line from ${named(0)} to ${named(1)} was taken away.`)
    const answer = tell(options.onChange, value, { line: change } as WorkshopChangeEvent)
    watch(answer, () => {
      // Not saved: the line is as it was, unless the board has moved on since.
      if (destroyed || value !== next) return
      const back = before ? workshopWithLine(value, before) : 'set' in change ? workshopWithoutLine(value, change.set.id) : null
      if (back) { value = back; draw(proposal ?? value) }
    })
  }

  /** Put the board's lines back as a record of the undo history has them, telling the host of each change. */
  function restoreLines(recorded: WorkshopLine[]) {
    const want = new Map(recorded.map(line => [line.id, line]))
    const have = new Map((value.lines ?? []).map(line => [line.id, line]))
    for (const lineId of have.keys()) if (!want.has(lineId)) commitLine({ remove: lineId })
    for (const [lineId, line] of want) {
      if (JSON.stringify(have.get(lineId)) === JSON.stringify(line)) continue
      if (workshopLineRefusal(value, line) === null) commitLine({ set: line })
    }
  }

  /**
   * Ordinary notes become cards at the foot of `laneId`: they leave the drawing and the board
   * gains the cards, as one undo step. Each card comes from where its note was let go.
   * The note leaves this screen at once, but collaborators hear of it only once the host has
   * saved the trade: refused, or the page gone first, nobody else ever saw it go.
   */
  function adopt(entries: { node: any; offer: WorkshopNoteOffer; from?: WorldPoint }[], laneId: string) {
    let next = value
    const renamed = new Map<string, string>()
    const made = entries.map(({ node, offer, from }) => {
      // A note carried with this one became a card under another id: its lines name that card.
      let lines = offer.lines
      for (const [from, to] of renamed) lines = workshopRenamedLines(lines, from, to)
      next = workshopNoteCandidate(next, laneId, { ...offer, ...(lines ? { lines } : {}) })!
      const card = next.cards[next.cards.length - 1]
      if (card.id !== node.id) renamed.set(node.id, card.id)
      // Should the host not save it, the note goes back where it started, with the lines it had in the drawing.
      const kept = { ...(node.options ?? {}), ...(from ? { x: from.x, y: from.y } : {}) }
      return { node, card, kept, lines: workshopRenamedLines(lines ?? [], node.id, card.id), under: offer.under }
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
      ? `${cardName(made[0].card)} is now a card in ${lane.label}. ${workshopLaneCaption(value, laneId)}.${joinedShape([made[0].card])}`
      : `${names(made.map(({ card }) => cardName(card)))} are now cards in ${lane.label}. ${workshopLaneCaption(value, laneId)}.${joinedShape(made.map(({ card }) => card))}`)
    for (const { node, card, kept, lines, under } of made) {
      // The note's words as the card keeps them, numbers and all ("Audit log · 3 points"): the host makes the same card of them.
      const change = { cardId: card.id, laneId, noteToCard: { noteId: node.id as string, label: workshopCardNoteText(value, card), ...(under && { under }),
        ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}), ...(lines.length ? { lines } : {}) } }
      const dropCard = () => {
        if (value !== committed || !value.cards.some(item => item.id === card.id)) return
        value = validateWorkshop({ ...value, cards: value.cards.filter(item => item.id !== card.id), lines: workshopRenamedLines(value.lines, card.id, node.id) })
        committed = value
        draw(value)
      }
      const answer = tell(options.onChange, value, change)
      slate.holdTrade?.(node.id, answer)
      hear(answer, () => {
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
          // Its lines to other notes are the drawing's again; nobody else saw them go either.
          const toNotes = workshopRenamedLines(lines, card.id, node.id).filter(line => !value.cards.some(item => item.id === line.parentId || item.id === line.childId))
          back?.ready?.then?.(() => { if (!destroyed) onlyHere(() => joinNotes(toNotes)) })
        }
        slate.announce?.(`${cardName(card)} could not be saved as a card. It is a note on the canvas again.`)
      }, () => {
        // Someone else put this note on the board first: their card is the note now.
        if (destroyed) return
        dropCard()
        slate.keepTrade?.(node.id)
        slate.announce?.(`Someone else put ${cardName(card)} on the board first.`)
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
    const drawnCard = drawn.get(noteId(workshopNodeIds.card(cardId))) ?? {}
    // The note comes back under the id of the note the card was made from, unless the slate uses it now.
    const wanted = workshopNoteIdOf(card)
    const id = slate.nodes.one(wanted) ? 'node_' + Math.random().toString(36).slice(2, 11) + '_' + Date.now() : wanted
    // Its lines stay joined to the note: those to other cards stay on the board, those to notes are the drawing's.
    const cardLines = workshopLinesOf(value, cardId)
    const { leave } = workshopCardLines(value, cardId, id)
    const next = workshopCardAsNote(value, cardId, id)!
    const round = (style.cornerRadius ?? 0) > 0
    const kept = card.asNote
    // The words it had, line breaks and all, unless the card has been renamed since.
    const words = kept?.text !== undefined && workshopCardLabelOf(kept.text) === card.label ? kept.text : workshopCardNoteText(value, card)
    const note: Record<string, unknown> = {
      id, x: Math.round(at.x), y: Math.round(at.y), width: kept?.width ?? drawnCard.width ?? 228, height: kept?.height ?? drawnCard.height ?? 76, text: words,
      shape: kept?.shape ?? (round ? 'roundedrectangle' : 'rectangle'),
      backgroundColor: card.look?.backgroundColor ?? drawnCard.backgroundColor, fontColor: card.look?.textColor ?? drawnCard.foregroundColor,
      fontSize: card.look?.fontSize ?? drawnCard.fontSize, borderColor: card.look?.borderColor ?? drawnCard.borderColor,
      borderWidth: card.look?.borderWidth ?? drawnCard.borderWidth,
      ...((card.look?.fontFamily ?? drawnCard.fontFamily) ? { fontFamily: card.look?.fontFamily ?? drawnCard.fontFamily } : {}),
    }
    if (kept?.image) Object.assign(note, { image: kept.image.src, ...(kept.image.width ? { imageOrigWidth: kept.image.width } : {}),
      ...(kept.image.height ? { imageOrigHeight: kept.image.height } : {}) })
    if (kept?.link) note.link = { ...kept.link }
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
    // The lines to notes are joined to the note once it is drawn, on this screen only until the save.
    const joined: Promise<SlatePackageLike[]> = Promise.resolve(added?.ready).then(() =>
      destroyed || !added || slate.nodes.one(id) !== added ? [] : onlyHere(() => joinNotes(leave))).catch(() => [])
    added?.ready?.then?.(() => {
      if (destroyed || slate.nodes.one(id) !== added) return
      const select = () => slate.selectNodes?.([added])
      if (typeof slate.withoutAnnouncements === 'function') slate.withoutAnnouncements(select)
      else select()
    })
    slate.announce?.(`${cardName(card)} is now a note on the canvas. ${fromLane.label}: ${workshopLaneCaption(value, fromLane.id)}.${leftShape(kept?.shape)}`)
    const dropNote = () => {
      if (slate.nodes.one(id) !== added) return
      slate.beginHostStep?.()
      onlyHere(() => slate.removeNode(id))
      slate.endHostStep?.()
    }
    const answer = tell(options.onChange, value, { cardId, cardToNote: { noteId: id } })
    slate.holdTrade?.(id, answer)
    hear(answer, () => {
      // Saved: collaborators, and the host's drawing save, hear of the note as it is now, and of its lines.
      joined.then(lines => {
        if (added && slate.nodes.one(id) === added) slate.sendHeld?.([{ type: 'onNodeAdded', data: { id, nodeOptions: v2NodeToV1(added.options) } }, ...lines])
      })
    }, () => {
      // The host could not save it: the note leaves the canvas and the card comes back, in its
      // place, unless the host has drawn a newer board.
      if (destroyed) return
      dropNote()
      if (value === committed && !value.cards.some(item => item.id === cardId)) {
        const offer = { id: cardId, label: card.label, ...(card.look ? { look: card.look } : {}), ...(card.asNote ? { asNote: card.asNote } : {}),
          ...(cardLines.length ? { lines: cardLines } : {}) }
        const back = workshopNoteCandidate(value, card.laneId, offer, before)
        if (back) { value = back; draw(value) }
      }
      slate.announce?.(`${cardName(card)} could not be saved as a note. It is a card again.`)
    }, () => {
      // Someone else took this card off the lanes first: their note is the card now.
      if (destroyed) return
      dropNote()
      // Their note may have the id this person's copy had: it is drawn as the server has it.
      slate.keepTrade?.(id)
      slate.announce?.(`Someone else took ${cardName(card)} off the lanes first.`)
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
    slate.announce?.(`${cardLabel || 'The empty card'} can't move to ${lane?.label ?? 'that lane'}. ${refusal.reason}`)
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
    const nodes = notesOf(model, heldRows())
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
      const open = workshopDestinations(value, moving)
      if (!kit || kit.laneCues) for (const lane of open) if (lane.id !== from) { outline(lane.id, OFFER, 2); drops.set(lane.id, 'open') }
      // A business board dims the stages a held card may not go to.
      if (kit?.laneCues) for (const lane of value.lanes) if (!open.includes(lane)) {
        const column = byId.get(workshopNodeIds.column(lane.id))
        if (column) column.backgroundColor = '#e9e8e2'
        drops.set(lane.id, 'closed')
      }
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

  function draw(model: Workshop, how: { skip?: string; grip?: string; animate?: boolean; layout?: WorkshopBoardLayout } = {}) {
    if (destroyed) return
    drawnLayout = how.layout ?? layout
    wanted = { model, skip: how.skip, grip: how.grip, animate: how.animate !== false }
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
        if (kindOf(id)?.kind === 'handle') node.svgGroup?.front?.()
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

  function settle(nodes: ReturnType<typeof artwork>, how: { model: Workshop; skip?: string; grip?: string; animate: boolean }) {
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
        if (id !== (how.skip && noteId(workshopNodeIds.card(how.skip))) && id !== (how.grip && noteId(how.grip)) && placed) {
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
        node.svgGroup.node.toggleAttribute?.('data-workshop-focused', focused)
        // What the outline colours say, said in the document too: which lanes take the card in hand.
        const part = kindOf(id)
        if (part?.kind === 'column') {
          const drop = drops.get(part.key)
          if (drop) node.svgGroup.node.setAttribute('data-workshop-drop', drop)
          else node.svgGroup.node.removeAttribute('data-workshop-drop')
        }
        if (part?.kind === 'handle') node.svgGroup.front?.()
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
      drawLines(how.model)
    })
    paintLayer(how.model)
    slate.notifyNodeChanged?.()
  }

  /** The board on show the layer was last drawn from. */
  let layerShown: Workshop | null = null
  /** The card a note of this board belongs to (a card, or one of a plan's grips). */
  function focusOfNote(id: string): string | null {
    const part = kindOf(id)
    if (!part) return null
    if (part.kind === 'card') return part.key
    return kit?.cardOfPart?.(value, nameOf(id)!) ?? null
  }
  /** The card the person is on: held by a grip, held, under the pointer, or the one selected. */
  function focusNow(): string | null {
    if (grip) return kit?.cardOfPart?.(value, grip.name) ?? null
    if (held) return held.cardId
    if (hovered) return hovered
    const selected: any[] = destroyed ? [] : slate.getSelectedNodes?.() ?? []
    return selected.length === 1 && owned.get(selected[0].id) === selected[0] ? focusOfNote(selected[0].id) : null
  }
  let layerFocus: string | null = null
  /** The selection or the pointer moved to another card: the layer redraws (a plan's grips follow). */
  function refocus() {
    if (destroyed || !layer || !layerShown) return
    if (focusNow() === layerFocus) return
    paintLayer(layerShown)
  }

  function paintLayer(shown: Workshop) {
    if (layer) {
      layerShown = shown
      layerFocus = focusNow()
      // Under every note but the lane columns, drawn from what is on show.
      // The lane column drawn last (columns are sent to the back one by one, so not the last lane's).
      const above = value.lanes.map(lane => owned.get(noteId(workshopNodeIds.column(lane.id)))?.svgGroup?.node as Element | undefined)
        .reduce<Element | null>((top, node) => !node ? top : !top || top.compareDocumentPosition(node) & 4 ? node : top, null)
      const seen = slate.canvas?.viewbox?.()
      const view = seen && [seen.x, seen.y, seen.width, seen.height].every(Number.isFinite)
        ? { x: seen.x - origin.x, y: seen.y - origin.y, width: seen.width, height: seen.height } : null
      layer.draw(value, shown === value ? null : shown, { origin, layout: drawnLayout, above, view, announce: text => slate.announce?.(text), focus: layerFocus,
        boardFocused: focused, picked, onPick: pickPath, gripSize,
        clamp: grip?.last?.clampedReason ? { name: grip.name, text: grip.last.clampedReason }
          : held?.outcome.kind === 'candidate' && held.outcome.said ? { name: 'card-' + held.cardId, text: held.outcome.said }
          : !grip && gripRefusal ? { name: gripRefusal.name, text: gripRefusal.reason } : null,
        refused: Boolean(grip?.last?.refusal) || (!grip && Boolean(gripRefusal)),
        onUnlink: (cardId, waitsOn) => {
          if (readOnly || proposal || held || grip || viewer()) return
          // A map's path in focus: removed (cardId is where it leads, waitsOn where it starts).
          const edit: WorkshopEdit = value.lanes[0]?.station ? { kind: 'disconnect_stations', from: { id: waitsOn }, to: { id: cardId } }
            : { kind: 'unlink_tasks', card: { id: cardId }, waitsOn: { id: waitsOn } }
          const result = applyWorkshopEdits(value, [edit])
          if ('refused' in result) slate.announce?.(result.refused.reason)
          else commitKit(result.workshop, value.lanes[0]?.station ? { laneId: waitsOn } : { cardId })
        } })
    }
  }

  /** Board coordinates (world units from the artwork's origin) of a world point. */
  function local(point: WorldPoint) {
    return { x: point.x - origin.x, y: point.y - origin.y }
  }

  /** The size of a board as drawn now, and (for a kit) its parts. */
  function geometry(model: Workshop) {
    if (kit) return kit.places(model, drawnLayout)
    return { ...workshopLanePlaces(model, { layout }), parts: [] as PartPlace[] }
  }

  /** A kit part's box in board coordinates, with the shape a lane place has. */
  function partBox(model: Workshop, name: string) {
    const part = kit!.places(model, drawnLayout).parts.find(item => item.name === name)
    return part ? { x: part.x, y: part.y, width: part.width, height: part.height } : undefined
  }

  /** The notes for a model: the kit's parts, or the lanes and cards of workshopToSlate. */
  /** The slate's zoom now (screen px per board unit), or 1 before it can say. */
  function zoomNow(): number {
    try { const zoom = slate.getZoom?.(); return typeof zoom === 'number' && zoom > 0 ? zoom : 1 } catch { return 1 }
  }

  /**
   * While a map is in focus its grips and path hit areas stay a finger's size on screen: the host fits the board
   * after putting it in focus (a phone shows it at about half size) and a person may zoom, so once the view has
   * settled the grips are drawn again at the new size. Never while a grip or a card is held.
   */
  function watchGripZoom() {
    stopWatchingZoom?.()
    stopWatchingZoom = null
    gripSize = mapGripSize(zoomNow())
    const svg: Element | undefined = slate.canvas?.node
    if (!mapGripsShown() || !svg || typeof MutationObserver === 'undefined') return
    let timer: ReturnType<typeof setTimeout> | null = null
    const settle = () => {
      timer = null
      if (destroyed || !mapGripsShown()) return
      if (grip || held) { timer = setTimeout(settle, 250); return }
      const next = mapGripSize(zoomNow())
      if (Math.abs(next - gripSize) < 2) return
      gripSize = next
      draw(proposal ?? value)
    }
    const observer = new MutationObserver(() => { if (timer) clearTimeout(timer); timer = setTimeout(settle, 200) })
    observer.observe(svg, { attributes: true, attributeFilter: ['viewBox'] })
    stopWatchingZoom = () => { observer.disconnect(); if (timer) clearTimeout(timer) }
  }

  /** Whether a map shows its path grips: in focus, for a person who may change it. */
  function mapGripsShown() {
    return !kit && Boolean(value.lanes[0]?.station) && focused && !readOnly && !proposal && !viewer()
  }

  /**
   * A map's grip held (in focus): over a step the map shows the path it would make, or holds and says why it
   * cannot; let go, it is one change, the path edits chat and exec make. Over no step (or a link grip over its
   * own step) nothing changes.
   */
  function mapGripDrag(name: string): ((point: { x: number; y: number }) => HandleResult) | null {
    const grip = mapGripOf(name)
    if (!grip || !mapGripsShown()) return null
    const start = value
    return point => {
      const at = mapStationAt(start, point)
      const drop = mapPathDrop(start, grip, grip.kind === 'link' && at === grip.from ? null : at)
      return drop.next ? { next: drop.next } : { next: start, clampedReason: drop.refusal!, refusal: drop.refusal! }
    }
  }

  /** A map's path picked outside focus: it is the selection, outlined, and the host offers "Change this board". */
  function pickPath(key: string) {
    if (destroyed || focused) return
    // The slate's selection goes first (its change reports the selection afresh), then the path is picked.
    const selected: any[] = slate.getSelectedNodes?.() ?? []
    pickCleared = new Set(selected.map((node: any) => node.id))
    picked = key
    if (selected.length) slate.clearSelection?.()
    if (layerShown) paintLayer(layerShown)
    reportSelection()
    const [from, to] = key.split('>')
    const name = (id: string) => value.lanes.find(lane => lane.id === id)?.label ?? id
    slate.announce?.(`Path from ${name(from)} to ${name(to)}. A map's paths stay as they are; change this board to edit them.`)
  }

  function notesOf(model: Workshop, rows?: number[]): NodeJSON[] {
    if (!kit) {
      const nodes = workshopToSlate(model, { native: true, origin, rows, layout, style }).nodes
      // A map in focus shows its path grips (from the committed map, so a held grip is never taken away under the pointer).
      return mapGripsShown() ? [...nodes, ...mapGripNotes(value, origin, gripSize)] : nodes
    }
    const nodes = kit.notes(model, drawnLayout, origin, style)
    // A business board with a rulebook: its "How this board behaves" note, under the kit's notes.
    if (model.behaviour && nodes.length) {
      const boxes = nodes.map(node => node.options as { xPos: number; yPos: number; width: number; height: number })
      const left = Math.min(...boxes.map(box => box.xPos)), right = Math.max(...boxes.map(box => box.xPos + box.width))
      const note = behaviourNote(model, { x: left, y: Math.max(...boxes.map(box => box.yPos + box.height)) + 16, width: Math.min(right - left, 484) }, style)
      if (note) nodes.push(note)
    }
    return nodes
  }

  /**
   * Commit a business board's change: the edits between the boards, made by the reducer every surface
   * uses, so a drag can never keep what the rules would refuse. False when nothing was kept.
   */
  function commitKit(next: Workshop, ids: { cardId?: string; laneId?: string }, skip?: string): boolean {
    // A map's grips change its paths: the path edits between the maps (chat's and exec's).
    const edits = kit ? kit.editsBetween(value, next) : mapEditsBetween(value, next)
    if (!edits.length) return false
    const result = applyWorkshopEdits(value, edits)
    if ('refused' in result) {
      slate.announce?.(result.refused.reason)
      tell(options.onRefuse, { ...ids, laneId: result.refused.laneId, reason: result.refused.reason })
      return false
    }
    value = result.workshop
    draw(value, { skip })
    slate.announce?.(result.report.edits.map(edit => edit.said).join(' '))
    tell(options.onChange, value, { ...ids, edits })
    return true
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
      return card && lane ? `${card.label || 'Empty card'}, in ${lane.label}${kit?.cardKeys ? '. ' + kit.cardKeys : ''}` : null
    }
    return target?.kind === 'handle' ? (kit ? kit.label?.(model, nameOf(id)!) ?? null : mapGripLabel(model, nameOf(id)!)) : null
  }

  function slotOf(model: Workshop, nodeId: string) {
    const options = notesOf(model).find(node => node.options.id === nodeId)?.options
    return options ? { x: options.xPos as number, y: options.yPos as number } : null
  }

  function cancelGestures() {
    if (held || grip) slate.cancelGovernedDrag?.('host')
    held = null
    grip = null
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
      const { width } = geometry(value)
      const drawnCard = owned.get(noteId(workshopNodeIds.card(cardId)))?.options
      const card = value.cards.find(item => item.id === cardId)
      // The note is as big as the note the card was made from, or as the card.
      release(cardId, besideSpot({ x: origin.x + width + 32, y: drawnCard?.y ?? origin.y,
        width: card?.asNote?.width ?? drawnCard?.width ?? 228, height: card?.asNote?.height ?? drawnCard?.height ?? 76 }))
      return null
    },
    get value() { return value },
    get origin() { return { ...origin } },
    get layout() { return { ...layout } },
    get bounds() {
      const { width, height } = geometry(value)
      return { x: origin.x, y: origin.y, width, height }
    },
    get focused() { return focused },
    setFocused(next) {
      if (destroyed) return
      const was = focused
      focused = Boolean(next)
      for (const node of owned.values()) node.svgGroup?.node?.toggleAttribute?.('data-workshop-focused', focused)
      if (was === focused) return
      // In focus a map's paths are editable (its grips, a path removed by a click) and a plan's span grips say
      // what they are: drawn again. A path picked outside focus is the one being changed now.
      if (picked) { picked = null; queueMicrotask(reportSelection) }
      if (!kit && value.lanes[0]?.station) { cancelGestures(); watchGripZoom(); draw(proposal ?? value) }
      else if (layerShown) paintLayer(layerShown)
    },
    setLayout(next) {
      if (destroyed) throw new Error('This workshop has been detached.')
      const wantedLayout = layoutOf(next)
      if (kit) kit.places(value, wantedLayout)
      else workshopLanePlaces(value, { layout: wantedLayout })
      if (JSON.stringify(wantedLayout) === JSON.stringify(layout)) return
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
      const wasReadOnly = readOnly
      readOnly = wantedReadOnly || kitless(value)
      draw(proposal ?? value)
      if (readOnly !== wasReadOnly) slate.refreshGovernance?.()
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
      wantedReadOnly = Boolean(next)
      const effective = wantedReadOnly || kitless(value)
      if (destroyed || readOnly === effective) return
      cancelGestures()
      readOnly = effective
      draw(proposal ?? value)
      slate.refreshGovernance?.()
    },
    destroy() {
      if (destroyed) return
      cancelGestures()
      destroyed = true
      stopWatchingZoom?.()
      if (gripRefusal) clearTimeout(gripRefusal.timer)
      slate.element?.removeEventListener?.('pointerdown', onPress, true)
      if (tapTimer) clearTimeout(tapTimer)
      slate.element?.ownerDocument?.removeEventListener?.('pointerup', onLift, true)
      slate.element?.ownerDocument?.removeEventListener?.('pointercancel', onLost, true)
      stopWatchingSelection?.()
      if (layer) slate.element?.removeEventListener?.('pointerover', onHover)
      slate.withPolicyAuthority(() => {
        for (const [lineId, was] of drawnLines) if (slate.nodes.one(was.holder.id) === was.holder) was.holder.relationships?.removeAssociation?.(lineId)
        for (const [linkId, link] of links) link.parent.relationships?.removeAssociation(linkId)
        for (const [id, node] of owned) {
          slate.deselectNode?.(node)
          node.editor?.cancelInline?.()
          if (slate.nodes.one(id) === node) slate.nodes.remove(id)
        }
      })
      links.clear()
      drawnLines.clear()
      owned.clear()
      drawn.clear()
      standIn.clear()
      drawnAs.clear()
      releasePolicy()
      layer?.destroy()
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
  // The committed board does not change while a card is held, so the same lane means the same candidate
  // (a business board's candidates differ within a lane too: a task slid along its row).
  if (a.kind === 'candidate' && b.kind === 'candidate') return a.said === b.said && (a.next === b.next || JSON.stringify(a.next) === JSON.stringify(b.next))
  return a.kind === b.kind && (a as any).laneId === (b as any).laneId && (a as any).reason === (b as any).reason
}

/** Only the layout fields a board uses. */
function layoutOf(input?: WorkshopBoardLayout): WorkshopBoardLayout {
  const out: WorkshopBoardLayout = {}
  if (input?.lanesPerRow !== undefined) out.lanesPerRow = input.lanesPerRow
  if (input?.narrow) out.narrow = true
  if (input?.width !== undefined) out.width = input.width
  return out
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
