export * from './offlineHandoff'
export * from './listeningRoom'
import { planReleaseMove, releaseLoad, validateRelease } from './release'
export { releaseLoad, releasePlan } from './release'
import { applyWorkshopEdits, type WorkshopEdit } from './edits'
import { rulebook } from './kinds'
import type { Behaviour } from './behaviour'
export type { Behaviour, BehaviourRule, BehaviourVerdict, RuleAudit, RuleBody, RuleInput, RuleKindId, WorkshopMoveCheck } from './behaviour'
import { workshopNewCardName, workshopRules } from './kinds'
export { registerRulebook, rulebook, rulebookLoaded, registerWorkshopRules, workshopRulesLoaded, workshopRules, workshopNewCardName, type RulebookHooks, type BusinessBoardRules, type BusinessEditStep, type BusinessEditTools,
  type WorkshopFieldReader, type WorkshopLimits } from './kinds'
import type { NodeJSON, SlateJSON } from '../core/Serialization'
import { DEFAULT_NOTE_STYLE } from '../core/NoteDefaults'
/** How the engine draws an ordinary note when nothing says otherwise: what a card looks like with no style. */
export { DEFAULT_NOTE_STYLE }

export interface StationImage {
  src: string
  alt: string
}

export interface WorkshopLane {
  id: string
  label: string
  capacity?: number
  /** Pipeline: the chance a deal in this open stage is won, 0 to 1. */
  probability?: number
  /** Pipeline: the stage that holds won deals, or lost ones. */
  role?: 'won' | 'lost'
  /** Budget: what this team is given, and the least and most it may be given. */
  allocation?: number
  floor?: number
  cap?: number
  station?: { column: number; row: number; next: string[]; outcome: string; image?: StationImage }
}

export interface WorkshopCard {
  id: string
  label: string
  laneId: string
  allowedLaneIds?: string[]
  points?: number
  dependsOn?: string[]
  /** Launch plan: whole days the task takes, and whole days it waits after what it depends on. */
  duration?: number
  lag?: number
  /** Pipeline and budget: whole currency units. */
  amount?: number
  /** Hiring plan: the role band the hire is in (cost is per band, never per person). */
  band?: string
  /** Nest board: the card it sits under, what it is (pile, outcome…), its place among its siblings (a fractional key), who said it, and numbers chat added. */
  parentId?: string
  role?: string
  order?: string
  source?: string
  fields?: Record<string, number>
  /** Nest board with owners (Goals & owners): the team that owns it, by id. */
  owner?: string
  /** How the card is drawn when it differs from the board's: the look of the note it was made from. */
  look?: WorkshopCardLook
  /** What the note it was made from had that a card does not show, so it comes back as it was. */
  asNote?: WorkshopCardAsNote
  /** The id of the note it was made from, when the card could not take it: the note comes back under it. */
  noteId?: string
  /**
   * Map: a card the paths don't constrain (a note dropped on a step becomes one): it goes to any step and back to
   * the canvas. A map's token is a card without it, and only the token follows the paths (boards S2b).
   */
  free?: true
  /**
   * A move made anyway, past the rule that refused it, once the person confirmed it ("Move anyway"): who, when, the
   * rule's sentence, and the lane it came from (Undo puts it back there). Shown on the card. Lane boards and maps only.
   */
  override?: WorkshopOverride
}

/** A card moved past a rule (WorkshopCard.override). */
export interface WorkshopOverride {
  by: string
  /** ISO time. */
  at: string
  /** The rule's sentence, as the refusal said it. */
  sentence: string
  /** The lane the card was in before. */
  from: string
  /**
   * What else the move changed, as it was before, where it is more than the lane (Undo puts these back too): a plan's
   * task moved in time (its `lag` and `duration`), a nested board's card moved under another (`parentId`, null at the
   * top of its area).
   */
  was?: { lag?: number; duration?: number; parentId?: string | null }
}

/**
 * What an ordinary note had that its card does not show: its words with their line breaks,
 * its shape and its size. A card dropped on the canvas becomes that note again.
 */
export interface WorkshopCardAsNote {
  text?: string
  shape?: string
  width?: number
  height?: number
  /** Its picture (an http(s) or site address), with the picture's own size. */
  image?: { src: string; width?: number; height?: number }
  /** Its link, as a note keeps one. */
  link?: { type?: string; data: string | Record<string, string>; show?: boolean }
}

/** The look of one card: what an ordinary note dropped on a lane brings with it. */
export interface WorkshopCardLook {
  backgroundColor?: string
  textColor?: string
  fontFamily?: string
  fontSize?: number
  borderColor?: string
  borderWidth?: number
}

/**
 * A line with a card at one end or both: an ordinary connector, drawn and edited like any other.
 * `parentId` and `childId` name a card on this board by its id, or an ordinary note of the slate's
 * drawing by its note id. A line between two ordinary notes belongs to the drawing, not here: when
 * a card becomes a note again, its lines to notes go back to the drawing. The rest of the fields
 * are the connector's look, as the slate saves a connector.
 */
export interface WorkshopLine {
  id: string
  parentId: string
  childId: string
  lineColor?: string
  lineOpacity?: number
  lineWidth?: number
  lineDash?: 'solid' | 'dashed' | 'dotted'
  lineType?: string
  lineCurveType?: 'cubic' | 'quadratic'
  lineCurviness?: number
  lineEffect?: string
  showParentArrow?: boolean
  showChildArrow?: boolean
  label?: string
  /** An end pinned to one spot on its note's edge ({x, y} in 0..1 on the unturned note); none follows its note. */
  sourceAnchor?: WorkshopLineAnchor
  targetAnchor?: WorkshopLineAnchor
  /**
   * A free end: the line ends at this point on the canvas, on no note. Only the far end of a line
   * held by a card is free (`parentId` names the card; `childId` is the free end's own id, as the
   * slate saves it). The point stays where it is when the card moves, as a free end does on the
   * canvas, and the line goes back to the drawing with it when the card becomes a note.
   */
  targetPoint?: WorkshopLinePoint
}

/** A point on the canvas where a line's free end is. */
export interface WorkshopLinePoint { x: number; y: number }

/** A spot on a note's edge, as a pinned line end keeps it (see core/LineEnds.ts). */
export interface WorkshopLineAnchor { x: number; y: number }

export interface WorkshopSignal {
  id: string
  label: string
  cardId: string
  laneId: string
  whenPresent: string
  whenAbsent: string
}

export interface ResolvedWorkshopSignal extends WorkshopSignal {
  present: boolean
  text: string
}

export interface Workshop {
  experience?: StartupExperience
  version: 1
  kind?: WorkshopKind
  title: string
  /** Launch plan: the day every task must end by (a go-live names it). */
  launch?: { day: number; name?: string }
  /** Launch and hiring plans: the plan's first day (YYYY-MM-DD); days are offsets from it. */
  clock?: { origin: string }
  /** Hiring plan: cash, monthly burn without new hires, the role bands and a funding round. */
  hiring?: HiringFields
  /** Nest board: how it is drawn (piles or a tree), the number fields chat added, and merged cards' new homes. */
  nest?: NestFields
  /** Pipeline: the forecast target, and the currency sign amounts are written with. */
  forecast?: { target: number; currency: string }
  /** Budget: the envelope, its currency sign and the step allocations snap to. */
  budget?: { total: number; currency: string; step: number }
  lanes: WorkshopLane[]
  /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
  presentationOrder?: string[]
  signals?: WorkshopSignal[]
  cards: WorkshopCard[]
  /** The lines joined to its cards (see WorkshopLine). */
  lines?: WorkshopLine[]
  /** How the board behaves, as data: its rulebook (behaviour.ts). Lane boards and pipelines only. */
  behaviour?: Behaviour
}

/** The kinds of board with rules of their own. A board without a kind is a board of plain lanes. */
export type WorkshopKind = 'release-plan' | BusinessBoardKind

/** A hiring plan's money: what a role band costs a month (loaded), on one team. */
export interface HiringBand { id: string; label: string; monthly: number; lane: string }
export interface HiringFields { cash: number; burn: number; currency: string; weeks: number; bands: HiringBand[]; funding?: { day: number; amount: number } }
/** The business boards: drawn by a board kit (slateboxjs/boards) on a live slate. */
export type BusinessBoardKind = 'launch-plan' | 'pipeline' | 'budget' | 'hiring-plan' | 'nest'
export const businessBoardKinds: readonly BusinessBoardKind[] = ['launch-plan', 'pipeline', 'budget', 'hiring-plan', 'nest']
export interface NestFields {
  /** Piles, a tree, or a 2 by 2 (impact × effort: cards placed by two scores). */
  layout: 'clusters' | 'tree' | 'matrix'
  /** Fields cards carry: numbers (a money sign for money), or yes/no flags (1 for yes). */
  fields?: { id: string; label: string; currency?: string; flag?: true }[]
  aliases?: [string, string][]
  /** A 2 by 2: the fields its across and up axes read (scores 0 to 10). */
  axes?: [string, string]
  /** The teams that own cards (Goals & owners). */
  owners?: { id: string; label: string }[]
}
export function businessKind(board: Pick<Workshop, 'kind'>): BusinessBoardKind | undefined {
  return businessBoardKinds.includes(board.kind as BusinessBoardKind) ? board.kind as BusinessBoardKind : undefined
}

function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Expected a workshop object.')
  return value as Record<string, unknown>
}

function label(value: unknown, limit = 80): string {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > limit) {
    throw new Error(`Labels must contain 1 to ${limit} characters.`)
  }
  if (/[<>\u0000-\u001f]/.test(value)) throw new Error('Use plain text without markup or control characters.')
  return value.trim()
}

/** A card's words: up to 80 characters of plain text, or none. */
function cardLabel(value: unknown): string {
  if (value === undefined || value === null) return ''
  if (typeof value !== 'string') throw new Error('Labels must contain 1 to 80 characters.')
  // A card's words are kept as typed, markup included (every view shows them as text). Only
  // control characters go; line breaks and tabs are spaces.
  const words = oneLine(value)
  if (words.length > 80) throw new Error('A card holds up to 80 characters.')
  return words
}

/** Words in one line: control characters taken out, line breaks, tabs and runs of spaces as one space. */
function oneLine(words: string): string {
  return words.replace(/[\t\n\r\f\v]/g, ' ').replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim()
}

/** The ids a note of the drawing may have: a card's kind of id, or an older note's, any text without control characters. */
const notePattern = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/
function noteRef(value: unknown): string {
  if (typeof value !== 'string' || !notePattern.test(value)) throw new Error('A line names its notes by their ids.')
  return value
}

/** The id of the note a card stands for: the note it was made from, when that note's id is not the card's. */
export function workshopNoteIdOf(card: Pick<WorkshopCard, 'id' | 'noteId'>): string {
  return card.noteId ?? card.id
}

/** The words a card shows for a note's words: its words in one line, the first 80 characters of longer ones. */
export function workshopCardLabelOf(words: string): string {
  const line = oneLine(String(words ?? ''))
  if (line.length <= 80) return line
  const cut = line.slice(0, 79)
  const space = cut.lastIndexOf(' ')
  return (space > 40 ? cut.slice(0, space) : cut).trimEnd() + '…'
}

function stationImage(input: unknown): StationImage {
  const raw = record(input)
  let url: URL
  try { url = new URL(label(raw.src, 2048)) }
  catch { throw new Error('Use a full HTTPS address for the image.') }
  if (url.protocol !== 'https:' || url.username || url.password || url.href.length > 2048) {
    throw new Error('Use an HTTPS image address without sign-in details.')
  }
  return { src: url.href, alt: label(raw.alt, 240) }
}

function id(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value)) {
    throw new Error('IDs must be short alphanumeric slugs.')
  }
  return value
}

const colour = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/
const family = /^[A-Za-z0-9 ,'"_-]{1,120}$/

/** A card's look: only colours, a type family and sizes the canvas can draw. Anything else is left out. */
function cardLook(input: unknown): WorkshopCardLook | undefined {
  const raw = record(input)
  const look: WorkshopCardLook = {}
  const paint = (value: unknown) => {
    if (typeof value !== 'string' || !colour.test(value)) throw new Error('Use a colour such as #f0f0f0 for a card.')
    return value
  }
  const size = (value: unknown, low: number, high: number) => {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high) throw new Error('A card size is out of range.')
    return value
  }
  if (raw.backgroundColor !== undefined) look.backgroundColor = paint(raw.backgroundColor)
  if (raw.textColor !== undefined) look.textColor = paint(raw.textColor)
  if (raw.borderColor !== undefined) look.borderColor = paint(raw.borderColor)
  if (raw.fontFamily !== undefined) {
    if (typeof raw.fontFamily !== 'string' || !family.test(raw.fontFamily)) throw new Error('Use a plain type family for a card.')
    look.fontFamily = raw.fontFamily
  }
  if (raw.fontSize !== undefined) look.fontSize = size(raw.fontSize, 6, 200)
  if (raw.borderWidth !== undefined) look.borderWidth = size(raw.borderWidth, 0, 20)
  return Object.keys(look).length ? look : undefined
}

/** The parts of a note's look a card can keep; anything a card cannot draw is left out. Undefined when nothing is left. */
export function workshopCardLookOf(input: Record<string, unknown>): WorkshopCardLook | undefined {
  const look: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input ?? {})) {
    if (value === undefined) continue
    try { if (cardLook({ [key]: value })) look[key] = value } catch { /* not something a card can draw */ }
  }
  return cardLook(look)
}

/** A picture's address a card can keep for its note: http(s) or on this site, not one held in the page. */
export function workshopKeepsPicture(src: unknown): boolean {
  if (typeof src !== 'string' || !src) return false
  // A picture held in the page goes with the card; its host stores it and the card keeps the address.
  if (/^data:image\/(?:png|jpe?g|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/i.test(src)) return src.length <= 16_000_000
  if (src.length > 4096) return false
  if (/^\/(?!\/)/.test(src)) return true
  try { return ['https:', 'http:'].includes(new URL(src).protocol) } catch { return false }
}

/** Whether a card can keep a note's link for it. */
export function workshopKeepsLink(link: unknown): boolean {
  try { return Boolean(cardAsNote({ link })) } catch { return false }
}

/** What a card keeps of the note it was made from: its words, shape, size, picture and link. */
function cardAsNote(input: unknown): WorkshopCardAsNote | undefined {
  const raw = record(input)
  const kept: WorkshopCardAsNote = {}
  if (raw.text !== undefined) {
    if (typeof raw.text !== 'string') throw new Error('A card keeps the note\'s words as text.')
    // Kept as typed, line breaks and tabs included; other control characters go.
    const text = raw.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
    if (text.length > 4000) throw new Error('A card keeps up to 4000 characters of the note\'s words.')
    kept.text = text
  }
  if (raw.image !== undefined) {
    const image = record(raw.image)
    if (!workshopKeepsPicture(image.src)) throw new Error('A card keeps a picture by its web address only.')
    kept.image = { src: image.src as string }
    for (const key of ['width', 'height'] as const) {
      const size = image[key]
      if (size === undefined) continue
      if (typeof size !== 'number' || !Number.isFinite(size) || size < 1 || size > 20000) throw new Error('A picture size is out of range.')
      kept.image[key] = size
    }
  }
  if (raw.link !== undefined) {
    const link = record(raw.link)
    const data = link.data
    const plainData = typeof data === 'string' ? data.length <= 2048
      : Boolean(data) && typeof data === 'object' && !Array.isArray(data) && JSON.stringify(data).length <= 2048 &&
        Object.values(data as object).every(item => typeof item === 'string')
    if (!plainData || (link.type !== undefined && (typeof link.type !== 'string' || !/^[A-Za-z]{1,40}$/.test(link.type))) ||
        (link.show !== undefined && typeof link.show !== 'boolean')) throw new Error('A card keeps a link as a note does.')
    kept.link = { ...(link.type !== undefined ? { type: link.type as string } : {}), data: data as string | Record<string, string>,
      ...(link.show !== undefined ? { show: link.show as boolean } : {}) }
  }
  if (raw.shape !== undefined) {
    if (typeof raw.shape !== 'string' || !/^[a-z]{1,24}$/i.test(raw.shape)) throw new Error('A card keeps a shape by its name only.')
    kept.shape = raw.shape
  }
  for (const key of ['width', 'height'] as const) {
    const size = raw[key]
    if (size === undefined) continue
    if (typeof size !== 'number' || !Number.isFinite(size) || size < 10 || size > 4000) throw new Error('A note size is out of range.')
    kept[key] = size
  }
  return Object.keys(kept).length ? kept : undefined
}

/** How many lines a workshop's cards may have between them. */
export const maxWorkshopLines = 96
const lineIdPattern = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/
const lineDashes = ['solid', 'dashed', 'dotted']
/** How far from the canvas's middle a free line end may be. */
const maxLinePoint = 10_000_000

/** One line, as a connector of the slate is saved: only the fields a connector draws. */
function workshopLine(input: unknown): WorkshopLine {
  const raw = record(input)
  if (typeof raw.id !== 'string' || !lineIdPattern.test(raw.id)) throw new Error('A line needs a short id.')
  const line: WorkshopLine = { id: raw.id, parentId: noteRef(raw.parentId), childId: noteRef(raw.childId) }
  if (line.parentId === line.childId) throw new Error('A line joins two different notes.')
  const number = (key: keyof WorkshopLine, low: number, high: number) => {
    const value = raw[key]
    if (value === undefined || value === null) return
    if (typeof value !== 'number' || !Number.isFinite(value) || value < low || value > high) throw new Error('A line\'s look is out of range.')
    ;(line as any)[key] = value
  }
  if (raw.lineColor !== undefined && raw.lineColor !== null) {
    if (typeof raw.lineColor !== 'string' || !colour.test(raw.lineColor)) throw new Error('Use a colour such as #666666 for a line.')
    line.lineColor = raw.lineColor
  }
  number('lineOpacity', 0, 1)
  number('lineWidth', 0, 40)
  number('lineCurviness', -10, 10)
  if (raw.lineDash !== undefined && raw.lineDash !== null) {
    if (!lineDashes.includes(raw.lineDash as string)) throw new Error('A line is solid, dashed or dotted.')
    line.lineDash = raw.lineDash as WorkshopLine['lineDash']
  }
  if (raw.lineType !== undefined && raw.lineType !== null) {
    if (typeof raw.lineType !== 'string' || !/^[a-z]{1,24}$/i.test(raw.lineType)) throw new Error('A line keeps its kind by its name only.')
    line.lineType = raw.lineType
  }
  if (raw.lineCurveType !== undefined && raw.lineCurveType !== null) {
    if (raw.lineCurveType !== 'cubic' && raw.lineCurveType !== 'quadratic') throw new Error('A line curves cubic or quadratic.')
    line.lineCurveType = raw.lineCurveType
  }
  if (raw.lineEffect !== undefined && raw.lineEffect !== null && raw.lineEffect !== '') {
    if (typeof raw.lineEffect !== 'string' || !/^[a-z-]{1,24}$/i.test(raw.lineEffect)) throw new Error('A line keeps its effect by its name only.')
    line.lineEffect = raw.lineEffect
  }
  for (const key of ['showParentArrow', 'showChildArrow'] as const) {
    if (raw[key] === undefined || raw[key] === null) continue
    if (typeof raw[key] !== 'boolean') throw new Error('A line\'s arrows are on or off.')
    line[key] = raw[key] as boolean
  }
  if (raw.label !== undefined && raw.label !== null && raw.label !== '') {
    if (typeof raw.label !== 'string' || raw.label.length > 200 || /[<>\u0000-\u001f]/.test(raw.label)) throw new Error('A line\'s label is plain words, up to 200 characters.')
    line.label = raw.label
  }
  // A free end is a point on the canvas (see WorkshopLine.targetPoint), pinned to no note.
  if (raw.targetPoint !== undefined && raw.targetPoint !== null) {
    const point = record(raw.targetPoint)
    const onCanvas = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= maxLinePoint
    if (!onCanvas(point.x) || !onCanvas(point.y) || Object.keys(point).some(name => name !== 'x' && name !== 'y')) {
      throw new Error('A free line end is a point on the canvas.')
    }
    line.targetPoint = { x: Math.round((point.x as number) * 100) / 100, y: Math.round((point.y as number) * 100) / 100 }
  }
  // A pinned end keeps its spot on the note's edge.
  for (const key of ['sourceAnchor', 'targetAnchor'] as const) {
    if (key === 'targetAnchor' && line.targetPoint) continue
    const anchor = raw[key]
    if (anchor === undefined || anchor === null) continue
    const spot = record(anchor)
    const inside = (n: unknown) => typeof n === 'number' && Number.isFinite(n) && n >= 0 && n <= 1
    if (!inside(spot.x) || !inside(spot.y) || Object.keys(spot).some(name => name !== 'x' && name !== 'y')) throw new Error('A pinned line end is a spot on its note\'s edge.')
    line[key] = { x: spot.x as number, y: spot.y as number }
  }
  return line
}

/**
 * The lines of a board with these cards. A line with no card at either end is the drawing's, not
 * the board's, and is left out (its card has left the board); so is a free-ended line whose card
 * has left. A line whose far end is on a card has no free end.
 */
function workshopLines(input: unknown, cardIds: Set<string>): WorkshopLine[] {
  if (!Array.isArray(input)) throw new Error('A workshop\'s lines are a list.')
  const lines = input.map(workshopLine).map(line => freeEndOf(line, cardIds))
    .filter(line => line.targetPoint ? cardIds.has(line.parentId) : cardIds.has(line.parentId) || cardIds.has(line.childId))
  unique(lines.map(line => line.id), 'line ID')
  if (lines.length > maxWorkshopLines) throw new Error(`A workshop holds up to ${maxWorkshopLines} lines.`)
  return lines
}

/** `line` without a free end when its far end names a card: that end is on the card. */
function freeEndOf(line: WorkshopLine, cardIds: Set<string>): WorkshopLine {
  if (!line.targetPoint || !cardIds.has(line.childId)) return line
  const { targetPoint: _point, ...onCard } = line
  return onCard
}

function unique(values: string[], what: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${what}.`)
}

/** Resolve the original lanes for playback without changing their board positions or rules. */
export function workshopPresentationLanes({ lanes, presentationOrder }: Pick<Workshop, 'lanes' | 'presentationOrder'>): WorkshopLane[] {
  if (presentationOrder === undefined) return lanes.slice()
  if (!Array.isArray(presentationOrder) || presentationOrder.length !== lanes.length ||
      new Set(presentationOrder).size !== lanes.length) {
    throw new Error('Presentation order must include every lane exactly once.')
  }
  return Array.from(presentationOrder, key => {
    const lane = lanes.find(lane => lane.id === key)
    if (!lane) throw new Error('Presentation order refers to an unknown lane.')
    return lane
  })
}

/** Resolve authored outcomes against this exact committed or transient candidate board. */
export function resolveWorkshopSignals(board: Workshop): ResolvedWorkshopSignal[] {
  return (board.signals ?? []).map(signal => {
    const present = board.cards.some(card => card.id === signal.cardId && card.laneId === signal.laneId)
    return { ...signal, present, text: present ? signal.whenPresent : signal.whenAbsent }
  })
}

const laneNodeId = (id: string) => 'lane-' + id
const cardNodeId = (id: string) => 'card-' + id
const imageNodeId = (id: string) => 'image-' + id

export interface WorkshopPresentationScene {
  lane: WorkshopLane
  cards: WorkshopCard[]
  signals: ResolvedWorkshopSignal[]
  /** Native node IDs for this viewpoint in the artwork produced by workshopToSlate. */
  nodeIds: string[]
}

/**
 * Describe each authored viewpoint from the committed state, including empty lanes. `scope`: the
 * board's scope on a slate of many boards (see workshopNodeIds.of), so the node ids are that board's.
 */
export function workshopPresentationScenes(board: Workshop, options: { scope?: string } = {}): WorkshopPresentationScene[] {
  const outcomes = resolveWorkshopSignals(board)
  const ids = workshopNodeIds.of(options.scope)
  return workshopPresentationLanes(board).map(lane => {
    const cards = board.cards.filter(card => card.laneId === lane.id)
    const signals = outcomes.filter(signal => signal.laneId === lane.id)
    const nodeIds = [ids.lane(lane.id)]
    if (lane.station?.image) nodeIds.push(ids.image(lane.id))
    return { lane, cards, signals, nodeIds: [...nodeIds, ...cards.map(card => ids.card(card.id))] }
  })
}

const maxWorkshopLanes = 5
export const maxWorkshopCards = 24
const mapGridSize = 3

// Treat agent output and stored drafts alike. Only declarative fields survive.
/** A stored move-anyway record (WorkshopOverride), read strictly. */
function overrideOf(input: unknown, laneIds: string[], laneId: string): WorkshopOverride {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('A move made anyway says who made it, when, and past which rule.')
  const raw = input as Record<string, unknown>
  const text = (value: unknown, most: number) => typeof value === 'string' && value.trim().length > 0 && value.length <= most && !/[\u0000-\u001f\u007f<>]/.test(value)
  const was = raw.was === undefined ? undefined : wasOf(raw.was)
  // A move within the lane (a plan's task in time, a card nested under another) says what it changed besides.
  if (!text(raw.by, 80) || !text(raw.at, 40) || Number.isNaN(Date.parse(raw.at as string)) || !text(raw.sentence, 300) ||
    typeof raw.from !== 'string' || !laneIds.includes(raw.from) || (raw.from === laneId && !was) || Object.keys(raw).some(key => !['by', 'at', 'sentence', 'from', 'was'].includes(key))) {
    throw new Error('A move made anyway says who made it, when, past which rule, and the lane it came from.')
  }
  return { by: raw.by as string, at: raw.at as string, sentence: raw.sentence as string, from: raw.from, ...(was && { was }) }
}

/** A move-anyway record's `was` (WorkshopOverride.was), read strictly. */
function wasOf(input: unknown): NonNullable<WorkshopOverride['was']> {
  const bad = () => new Error('A move made anyway says what it changed as it was before.')
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw bad()
  const raw = input as Record<string, unknown>
  const keys = Object.keys(raw)
  if (!keys.length || keys.some(key => !['lag', 'duration', 'parentId'].includes(key))) throw bad()
  const was: NonNullable<WorkshopOverride['was']> = {}
  for (const key of ['lag', 'duration'] as const) {
    if (raw[key] === undefined) continue
    const n = raw[key]
    if (typeof n !== 'number' || !Number.isInteger(n) || Math.abs(n) > 1000) throw bad()
    was[key] = n
  }
  if (raw.parentId !== undefined) {
    if (raw.parentId !== null && (typeof raw.parentId !== 'string' || !/^[A-Za-z0-9_-]{1,64}$/.test(raw.parentId))) throw bad()
    was.parentId = raw.parentId as string | null
  }
  return was
}

export function validateWorkshop(input: unknown): Workshop {
  const value = record(input)
  if (value.version !== 1) throw new Error('Unsupported workshop version.')
  if (value.kind !== undefined && value.kind !== 'release-plan' && !businessKind(value)) throw new Error('Unsupported workshop kind.')
  const release = value.kind === 'release-plan'
  const business = businessKind(value)
  // A launch plan's, pipeline's or budget's own fields and rule: its registered rules (kinds.ts).
  const rules = business ? workshopRules(business) : undefined
  const read = { id }
  const title = label(value.title, 120)
  if (!Array.isArray(value.lanes) || value.lanes.length < 2 || value.lanes.length > maxWorkshopLanes) {
    throw new Error('A workshop needs 2 to 5 lanes.')
  }
  // Each kind holds its own number of cards (a nest board 40); a board of plain lanes 24.
  const most = rules?.cards ?? [maxWorkshopCards, 'A workshop supports up to 24 cards.']
  if (!Array.isArray(value.cards) || value.cards.length > most[0]) throw new Error(most[1])

  const lanes: WorkshopLane[] = value.lanes.map(item => {
    const raw = record(item)
    const lane: WorkshopLane = { id: id(raw.id), label: label(raw.label) }
    if (raw.capacity !== undefined && business && business !== 'pipeline') throw new Error('Only a pipeline\'s stages hold a set number of cards.')
    if (raw.capacity !== undefined) {
      const limit = release ? 576 : 24
      if (typeof raw.capacity !== 'number' || !Number.isInteger(raw.capacity) || raw.capacity < 1 || raw.capacity > limit) {
        throw new Error(`Lane capacity must be a whole number from 1 to ${limit}.`)
      }
      lane.capacity = raw.capacity
    }
    rules?.readLane?.(raw, lane, read)
    if (raw.station !== undefined) {
      const point = record(raw.station)
      const coordinate = (n: unknown) => {
        if (typeof n !== 'number' || !Number.isInteger(n) || n < 0 || n >= mapGridSize) {
          throw new Error('Use map coordinates from 0 to 2.')
        }
        return n
      }
      if (!Array.isArray(point.next) || point.next.length > 4) throw new Error('A station needs a list of onward stops.')
      const next = point.next.map(id)
      unique(next, 'onward stop')
      lane.station = { column: coordinate(point.column), row: coordinate(point.row), next, outcome: label(point.outcome, 160) }
      if (point.image !== undefined) lane.station.image = stationImage(point.image)
    }
    return lane
  })
  const laneIds = lanes.map(lane => lane.id)
  unique(laneIds, 'lane ID')
  if (business && lanes.some(lane => lane.station)) throw new Error('A business board has no map stations.')
  if ((release || lanes.some(lane => lane.station)) && !value.cards.length) {
    throw new Error('Maps and release plans need at least one card.')
  }
  // A card made from a note is free of a map's paths; the map keeps at least one token, the piece they constrain.
  if (lanes.some(lane => lane.station) && value.cards.every(item => (item as Record<string, unknown>)?.free === true)) {
    throw new Error('A map needs at least one token.')
  }
  if (lanes.some(lane => lane.station)) {
    if (!lanes.every(lane => lane.station)) throw new Error('Give every station on the map a position.')
    unique(lanes.map(lane => lane.station!.column + ',' + lane.station!.row), 'map position')
    for (const lane of lanes) {
      if (lane.station!.next.some(key => key === lane.id || !laneIds.includes(key))) throw new Error('Connect each stop to another station on this map.')
    }
  }
  const cards: WorkshopCard[] = value.cards.map(item => {
    const raw = record(item)
    // A card may be empty, as a note may: an empty note dropped on a lane is an empty card. A
    // business board's card is a task, deal, line item, hire or pile: it is named, in plain text.
    const card: WorkshopCard = { id: id(raw.id), label: business ? label(raw.label) : cardLabel(raw.label), laneId: id(raw.laneId) }
    if (!laneIds.includes(card.laneId)) throw new Error('Card refers to an unknown lane.')
    if (raw.override !== undefined) {
      if (release || value.experience !== undefined) throw new Error('A release plan’s and a startup experience’s cards are never moved past a rule.')
      card.override = overrideOf(raw.override, laneIds, card.laneId)
    }
    if (raw.allowedLaneIds !== undefined) {
      if (!Array.isArray(raw.allowedLaneIds) || raw.allowedLaneIds.length > lanes.length) throw new Error('Invalid allowed lanes.')
      card.allowedLaneIds = raw.allowedLaneIds.map(id)
      unique(card.allowedLaneIds, 'allowed lane')
      // A card moved anyway may stand in a lane its list leaves out.
      if ((!card.allowedLaneIds.includes(card.laneId) && !card.override) || !card.allowedLaneIds.every(key => laneIds.includes(key))) {
        throw new Error('Allowed lanes must exist and include the starting lane.')
      }
    }
    if (raw.look !== undefined) {
      const look = cardLook(raw.look)
      if (look) card.look = look
    }
    if (raw.asNote !== undefined) {
      const kept = cardAsNote(raw.asNote)
      if (kept) card.asNote = kept
    }
    if (raw.noteId !== undefined && raw.noteId !== card.id) card.noteId = noteRef(raw.noteId)
    if (raw.free !== undefined) {
      if (raw.free !== true || !lanes.some(lane => lane.station)) throw new Error('Only a map’s cards can be free of its paths.')
      card.free = true
    }
    rules?.readCard(raw, card, read)
    if (release) {
      if (typeof raw.points !== 'number' || !Number.isInteger(raw.points) || raw.points < 1 || raw.points > 24) {
        throw new Error('Give each feature 1 to 24 effort points.')
      }
      card.points = raw.points
      if (raw.dependsOn !== undefined) {
        if (!Array.isArray(raw.dependsOn) || raw.dependsOn.length > 23) throw new Error('Invalid release dependencies.')
        card.dependsOn = raw.dependsOn.map(id)
        unique(card.dependsOn, 'dependency')
      }
    }
    return card
  })
  unique(cards.map(card => card.id), 'card ID')
  const board: Workshop = { version: 1, title, lanes, cards }
  if (value.experience !== undefined) {
    const experience = record(value.experience)
    if (experience.version !== 1 || (experience.kind !== 'customer-interviews' && experience.kind !== 'experiment-budget')) {
      throw new Error('Unsupported workshop experience.')
    }
    board.experience = {version: 1, kind: experience.kind}
  }
  if (value.signals !== undefined) {
    if (!Array.isArray(value.signals) || value.signals.length > 24) throw new Error('A workshop supports up to 24 placement outcomes.')
    board.signals = value.signals.map(item => {
      const raw = record(item)
      const cardId = id(raw.cardId), laneId = id(raw.laneId)
      if (!cards.some(card => card.id === cardId) || !laneIds.includes(laneId)) {
        throw new Error('Each placement outcome must refer to a card and lane on this board.')
      }
      return { id: id(raw.id), label: label(raw.label), cardId, laneId,
        whenPresent: label(raw.whenPresent, 160), whenAbsent: label(raw.whenAbsent, 160) }
    })
    unique(board.signals.map(signal => signal.id), 'placement outcome ID')
  }
  // Lines join the cards of a board of plain lanes only: a business board's cards carry none.
  if (value.lines !== undefined && !business) {
    const lines = workshopLines(value.lines, new Set(cards.map(card => card.id)))
    if (lines.length) board.lines = lines
  }
  if (value.presentationOrder !== undefined) {
    if (!Array.isArray(value.presentationOrder)) throw new Error('Presentation order must be a list of lane IDs.')
    board.presentationOrder = workshopPresentationLanes({ lanes, presentationOrder: value.presentationOrder }).map(lane => lane.id)
  }
  if (value.behaviour !== undefined) {
    board.behaviour = rulebook().validate(value.behaviour, { ...board, kind: value.kind as Workshop['kind'] })
  }
  if (release) {
    board.kind = 'release-plan'
    validateRelease(board)
    return board
  }
  if (business && rules) {
    board.kind = business
    rules.readBoard(value, board, read)
    const problem = rules.validate(board)
    if (problem) throw new Error(problem)
    return board
  }
  // A card moved anyway past a lane's limit does not make the board unreadable: the lane shows it is over ("3 of 2").
  for (const lane of lanes) {
    if (workshopLaneHeld({ cards: cards.filter(card => !card.override) }, lane.id) > (lane.capacity ?? Infinity)) {
      throw new Error(`Lane "${lane.label}" exceeds its capacity.`)
    }
  }
  return board
}

/**
 * The cards a lane's limit counts: every card, except on a map, where a step's limit counts tokens only. A card made
 * from a note there (free) is free of the paths and of the limit alike, wherever it is checked (boards S2b).
 */
export function workshopLaneHeld(board: Pick<Workshop, 'cards'>, laneId: string): number {
  return board.cards.filter(card => card.laneId === laneId && !card.free).length
}

const maxWorkshopFragmentLength = 65536

/** Build the fragment for /new/workshop from portable workshop data. */
export function encodeWorkshopFragment(value: Workshop): string {
  const model = JSON.stringify(validateWorkshop(value))
  const fragment = '#' + new URLSearchParams({ model }).toString()
  if (fragment.length > maxWorkshopFragmentLength) throw new Error('This workshop is too large to open from a link.')
  return fragment
}

/** Read location.hash before creating a slate. Only the validated model is imported. */
export function decodeWorkshopFragment(fragment: string): Workshop {
  if (fragment.length > maxWorkshopFragmentLength) throw new Error('This workshop is too large to open from a link.')
  const params = new URLSearchParams(fragment.slice(1))
  const model = params.get('model')
  if (!fragment.startsWith('#') || !model || Array.from(params.keys()).length !== 1) {
    throw new Error('This link needs one workshop model.')
  }
  let value: unknown
  try {
    value = JSON.parse(model)
  } catch {
    throw new Error('This link contains unreadable workshop data.')
  }
  return validateWorkshop(value)
}

/** The board a business kind's own rule makes of a move; undefined for every other board. */
function planBusinessMove(board: Workshop, cardId: string, laneId: string): Workshop | null | undefined {
  const kind = businessKind(board)
  return kind ? workshopRules(kind).planMove(board, cardId, laneId) : undefined
}

export function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[] {
  if (businessKind(board)) return board.lanes.filter(lane => planBusinessMove(board, card.id, lane.id))
  if (board.kind === 'release-plan') return board.lanes.filter(lane => planReleaseMove(board, card, lane.id) !== null)
  const station = board.lanes.find(lane => lane.id === card.laneId)?.station
  // On a map only the token follows the paths, and a step's limit counts tokens: a card made from a note goes anywhere.
  if (station && card.free) return board.lanes
  return board.lanes.filter(lane =>
    lane.id === card.laneId || ((!station || station.next.includes(lane.id)) && (!card.allowedLaneIds || card.allowedLaneIds.includes(lane.id)) &&
      workshopLaneHeld(board, lane.id) < (lane.capacity ?? Infinity)))
}

export function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop {
  const card = board.cards.find(item => item.id === cardId)
  const business = planBusinessMove(board, cardId, laneId)
  if (business !== undefined) {
    if (!business) throw new Error('Move is unavailable.')
    return business
  }
  if (card && board.kind === 'release-plan') {
    const candidate = planReleaseMove(board, card, laneId)
    if (!candidate) throw new Error('Move is unavailable.')
    return candidate
  }
  if (!card || !availableLanes(board, card).some(lane => lane.id === laneId)) throw new Error('Move is unavailable.')
  if (card.laneId === laneId) return board
  return { ...board, cards: board.cards.map(item => item === card ? withoutOverride({ ...card, laneId }) : item) }
}

/**
 * `next`, an ordinary edit of `before` that moved card `cardId`, with the card's move-anyway mark taken away once the
 * card stands where no rule refuses it. While the card is still past a rule (a late task nudged a day earlier but still
 * late, a task that still starts before what it waits on ends, a deal moved on to a stage still over its limit) the
 * mark stays as it was: who, when and the rule they agreed to break. Otherwise the board would refuse an ordinary
 * nudge of a card moved anyway, and that refusal could not be made anyway either.
 */
export function workshopShedMark(before: Workshop, next: Workshop, cardId: string): Workshop {
  const card = next.cards.find(item => item.id === cardId)
  if (!card?.override) return next
  const plain = { ...next, cards: next.cards.map(item => item.id === cardId ? withoutOverride(item) : item) }
  let due = false
  try { validateWorkshop(plain) } catch { due = true }
  const kind = businessKind(before)
  if (!due && kind) due = workshopRules(kind).pastRule?.(plain, cardId) ?? false
  if (!due && before.behaviour) due = 'refused' in rulebook().check(before, plain)
  return due ? next : plain
}

/** A card as an ordinary move leaves it: no longer marked as moved anyway. */
function withoutOverride(card: WorkshopCard): WorkshopCard {
  if (!card.override) return card
  const { override: _override, ...rest } = card
  return rest
}

/**
 * The board a move would produce, for every kind of workshop: `board` itself when the
 * card is already in that lane, or null when the move is unavailable.
 *
 * This is the one question each board asks before a drag, a preview or a commit.
 * Release plans answer with planReleaseMove (which may bring dependent features
 * along), a startup experience with planStartupMove (an interview dropped on the
 * occupied prototype swaps with it, or is refused when the one there cannot leave),
 * and everything else with the lane rules: capacity, allowedLaneIds and, on a map,
 * the stations reachable from here.
 */
export function workshopCandidate(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const made = kindCandidate(board, cardId, laneId)
  if (!made || made === board) return made
  // An ordinary move takes the card's move-anyway mark with it, once the card stands where no rule refuses it.
  const next = workshopShedMark(board, made, cardId)
  if (!board.behaviour) return next
  return 'refused' in rulebook().check(board, next) ? null : next
}

// ─── Moving a card anyway ────────────────────────────────────────────
// A drop the rules refuse is offered as "Move anyway" (owner, 2026-11-23: "dropping the card where it shouldn't go
// should be possible with a confirmation ... standard in the smart components"). Confirmed, the card moves and carries
// who, when and the rule it broke (WorkshopCard.override), shown on the card; Undo puts it back in one step. The drag,
// the chat, the server and exec's check_move all ask these same functions.
//
// What a move made anyway means on each board, so the numbers it computes stay true:
// - lane boards and maps: the card stands in the lane (a lane past its limit says "3 of 2");
// - a sales pipeline: the deal skips stages, leaves Won, or fills a stage past its limit; the forecast counts it where
//   it is, and the stage says it is over its limit;
// - a budget: the line item goes to a team that has not got the money; the team commits more than it was given, and
//   its lane says by how much, in red, until money moves to it or the item leaves;
// - a launch plan: a task moves past its rule (a lock, a freeze, an overlap, the hard line) or starts before what it
//   waits on ends; the critical path and the finish are worked out again, a task past the line is drawn in red and a
//   dependency it starts before is drawn broken, in red (edits.ts set_task override);
// - a hiring plan: a hire moves past its rule (a lock, the runway floor, a slip that stops) or into another team;
//   the runway is worked out again with the hire where it is;
// - a nested board: a card goes under a parent its rules say it may not sit under (a role, a depth, a parent's
//   limit); the piles and their ranks are worked out again (edits.ts nest_card override).
//
// Hard limits, refused even with a confirmation (workshopHardLimit):
// - a card or lane that is not on the board: there is nothing to move;
// - a release plan and a startup experience: every card is points or an interview the board itself places;
// - what would leave a board that can't be read: a won deal with no amount (the forecast can't count it), a task
//   that starts before the plan's first day or waits in a circle, a card under itself or nested in the tray, more
//   cards than a board holds, a number out of its range.
// Nothing else is a hard limit: a full lane, a lane a card is not allowed in, a column skipped, a gate, a bin, a step
// with no path to it, and every rule of a plan, a pipeline, a budget and a nested board.

/** Whether a move refused on this board may be made anyway: every board but release plans and startup experiences. */
function takesOverrides(board: Workshop): boolean {
  return board.kind !== 'release-plan' && !board.experience
}

/** Whether either board carries a move-anyway mark at all: the checks below are asked only then. */
export function workshopHasMarks(before: Pick<Workshop, 'cards'>, after: Pick<Workshop, 'cards'>): boolean {
  return before.cards.some(card => card.override) || after.cards.some(card => card.override)
}

/** Whether `card` (on the board after a change) was moved anyway by that change: marked now, and not as it was. */
export function workshopFreshOverride(before: Workshop, card: WorkshopCard): boolean {
  if (!card.override) return false
  const old = before.cards.find(item => item.id === card.id)?.override
  return !old || JSON.stringify(old) !== JSON.stringify(card.override)
}

/** Whether `card`, moved anyway before (on `before`), is back where the move took it from: an Undo. */
export function workshopOverrideUndone(before: Workshop, card: WorkshopCard): boolean {
  const old = before.cards.find(item => item.id === card.id)?.override
  if (!old || card.override) return false
  const was = old.was ?? {}
  return card.laneId === old.from && (was.lag === undefined || (card.lag ?? 0) === was.lag) &&
    (was.duration === undefined || card.duration === was.duration) && (was.parentId === undefined || (card.parentId ?? null) === was.parentId)
}

/** The lanes of `laneId` that hold a card moved anyway: the lane may be past its limit (or its money) because of it. */
export function workshopLaneOverridden(board: Pick<Workshop, 'cards'>, laneId: string): boolean {
  return board.cards.some(card => card.laneId === laneId && card.override !== undefined)
}

/**
 * Why this refused move may not be made even with a confirmation, as a sentence; null when it may be made anyway
 * (or needs no override at all). See "Moving a card anyway" above for the hard limits.
 */
export function workshopHardLimit(board: Workshop, cardId: string, laneId: string): string | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !board.lanes.some(lane => lane.id === laneId)) return 'That card or lane is no longer on the board.'
  if (card.laneId === laneId || workshopCandidate(board, cardId, laneId)) return null
  if (workshopOverrideCandidate(board, cardId, laneId, { by: 'check', at: new Date(0).toISOString() })) return null
  return workshopRefusal(board, cardId, laneId) ?? 'That move is not available.'
}

/** A who for a mark: a name of plain words, at most 80 letters. */
function overrideWho(who: { by: string; at: string }): { by: string; at: string } {
  return { by: String(who.by || 'Someone').replace(/[\u0000-\u001f\u007f<>]/g, '').slice(0, 80) || 'Someone', at: who.at }
}

/** The mark a card moved anyway carries: who, when, the rule's sentence and where it came from. */
export function workshopOverrideMark(card: WorkshopCard, sentence: string, who: { by: string; at: string }, was?: WorkshopOverride['was']): WorkshopOverride {
  return { ...overrideWho(who), sentence: (sentence || 'That move is not available.').slice(0, 300), from: card.laneId, ...(was && { was }) }
}

/**
 * The board a refused move makes once the person confirmed it ("Move anyway"): the card in that lane, marked with who
 * (`by`), when (`at`, ISO), the rule's sentence and the lane it came from. Null when the move needs no override
 * (workshopCandidate has it) or when it is a hard limit (workshopHardLimit says why).
 */
export function workshopOverrideCandidate(board: Workshop, cardId: string, laneId: string, who: { by: string; at: string }): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || card.laneId === laneId || !board.lanes.some(lane => lane.id === laneId) || !takesOverrides(board)) return null
  if (workshopCandidate(board, cardId, laneId)) return null
  const sentence = workshopRefusal(board, cardId, laneId) ?? 'That move is not available.'
  // Only the rulebook refused: the move as the board's kind makes it. Otherwise (a path, a limit, the lanes a card may go
  // in, a pipeline's stages, a budget's money) the card simply goes there: on a business board, to the foot of the lane.
  const kind = kindCandidate(board, cardId, laneId)
  const base = kind && kind !== board ? kind
    : businessKind(board) ? { ...board, cards: [...board.cards.filter(item => item.id !== cardId), card] } : board
  const override = workshopOverrideMark(card, sentence, who)
  try {
    return validateWorkshop({ ...base, cards: base.cards.map(item => item.id === cardId ? { ...withoutOverride(item), laneId, override } : item) })
  } catch {
    return null
  }
}

/**
 * A whole board sent to replace `before` (a kept chat proposal, an Undo) with its move-anyway marks made true by the
 * one who saves it: a card that moved past a rule is marked with `who` and the rule `before` refused it by; a mark on
 * a card that did not move stays as stored; a mark on a move no rule refused, or on a new card, is dropped. A page
 * never writes who moved a card anyway. A plan's task moved in time and a card nested under another are checked by the
 * edit that makes them (set_task, nest_card with override).
 */
export function workshopStampOverrides(before: Workshop, after: Workshop, who: { by: string; at: string }): Workshop {
  const was = new Map(before.cards.map(card => [card.id, card]))
  if (!after.cards.some(card => card.override || was.get(card.id)?.override)) return after
  const cards = after.cards.map(card => {
    const old = was.get(card.id)
    const plain = withoutOverride(card)
    if (!old) return plain
    const moved = old.laneId !== card.laneId
    const shifted = (old.lag ?? 0) !== (card.lag ?? 0) || old.duration !== card.duration || (old.parentId ?? null) !== (card.parentId ?? null)
    if (!moved && !shifted) return old.override ? { ...plain, override: old.override } : plain
    if (!card.override) return plain
    if (moved && !shifted) {
      const forced = workshopOverrideCandidate(before, card.id, card.laneId, who)?.cards.find(item => item.id === card.id)?.override
      return forced ? { ...plain, override: forced } : plain
    }
    // In time or under another card: the edit that makes it, made anyway, says whether it is a move past a rule.
    // A plan's task moved to another team and in time in one save is both edits, each made anyway (in time first, so
    // the mark says the team it came from).
    const plan = before.kind === 'launch-plan' || before.kind === 'hiring-plan'
    const edits: WorkshopEdit[] = businessKind(before) === 'nest'
      ? [{ kind: 'nest_card', card: { id: card.id }, ...(card.parentId ? { under: { id: card.parentId } } : { lane: { id: card.laneId } }), override: true }]
      : plan ? [{ kind: 'set_task', card: { id: card.id }, lag: card.lag ?? 0, duration: card.duration ?? 1, override: true },
        ...(moved ? [{ kind: 'move_card', card: { id: card.id }, lane: { id: card.laneId }, override: true } as WorkshopEdit] : [])] : []
    if (!edits.length) return plain
    const made = applyWorkshopEdits(before, edits, { actor: { by: overrideWho(who).by, via: 'chat' }, now: who.at })
    const forced = 'refused' in made ? undefined : made.workshop.cards.find(item => item.id === card.id)
    return forced?.override && forced.laneId === card.laneId && (forced.lag ?? 0) === (card.lag ?? 0) && forced.duration === card.duration &&
      (forced.parentId ?? null) === (card.parentId ?? null) ? { ...plain, override: forced.override } : plain
  })
  return { ...after, cards }
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
/** What a card moved anyway says under its name: "Moved anyway by Sam · 23 Nov". */
export function workshopOverrideLine(card: Pick<WorkshopCard, 'override'>): string | null {
  if (!card.override) return null
  // The day where it is read (the viewer's clock): a move made late in the evening is that evening's day, not UTC's.
  const when = new Date(card.override.at)
  const day = Number.isNaN(when.getTime()) ? '' : ' · ' + when.getDate() + ' ' + months[when.getMonth()]
  return 'Moved anyway by ' + card.override.by + day
}

/** The board a move would produce by the board kind's own rules, before its rulebook is asked. */
function kindCandidate(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
  if (card.laneId === laneId) return board
  if (board.kind === 'release-plan') return planReleaseMove(board, card, laneId)
  const business = planBusinessMove(board, cardId, laneId)
  if (business !== undefined) return business
  const experience = planStartupMove(board, cardId, laneId)
  if (experience) return experience
  // The prototype holds one interview. When the experience cannot make room there
  // (the interview in it has nowhere to go), the lane rules must not stack a second one in.
  if (laneId === 'prototype' && startupExperienceKind(board) === 'customer-interviews') return null
  return availableLanes(board, card).some(lane => lane.id === laneId) ? moveWorkshopCard(board, cardId, laneId) : null
}

/** Every lane the card may be dropped in, including the one it is in. */
export function workshopDestinations(board: Workshop, cardId: string): WorkshopLane[] {
  return board.lanes.filter(lane => workshopCandidate(board, cardId, lane.id) !== null)
}

/** Why workshopCandidate refuses this move, as a sentence for the person moving the card. Null when the move is available. */
export function workshopRefusal(board: Workshop, cardId: string, laneId: string): string | null {
  const allowed = kindCandidate(board, cardId, laneId)
  if (allowed !== null) {
    const verdict = allowed === board || !board.behaviour ? null : rulebook().check(board, allowed)
    return verdict && 'refused' in verdict ? verdict.refused.sentence : null
  }
  const card = board.cards.find(item => item.id === cardId)
  const lane = board.lanes.find(item => item.id === laneId)
  if (!card || !lane) return 'That move is not available.'
  const business = businessKind(board)
  const own = business && workshopRules(business).refusal
  if (own) return own(board, cardId, laneId)
  const cannot = `This card can't go in ${lane.label}.`
  if (card.allowedLaneIds && !card.allowedLaneIds.includes(laneId)) return cannot
  if (board.kind === 'release-plan') {
    if (lane.capacity === undefined) return cannot
    const used = releaseLoad(board, laneId)
    // Without the budget the move is legal exactly when the budget was the obstacle.
    const unbounded = { ...board, lanes: board.lanes.map(item => item === lane ? { id: lane.id, label: lane.label } : item) }
    const moved = planReleaseMove(unbounded, card, laneId)
    if (!moved) return cannot
    return `Needs ${releaseLoad(moved, laneId) - used} points. It already holds ${used} of ${lane.capacity} points.`
  }
  const source = board.lanes.find(item => item.id === card.laneId)
  if (source?.station && !card.free && !source.station.next.includes(laneId)) return `${lane.label} can't be reached from ${source.label}.`
  const held = workshopLaneHeld(board, laneId)
  if (lane.capacity !== undefined && held >= lane.capacity && !(source?.station && card.free)) {
    const unit = source?.station ? (lane.capacity === 1 ? 'token' : 'tokens') : lane.capacity === 1 ? 'card' : 'cards'
    return `It already holds ${held} of ${lane.capacity} ${unit}.`
  }
  return cannot
}

/**
 * Whether an ordinary note dropped on this board is offered to it. Every board is (boards S2b, owner: "notes
 * ALWAYS convert on boards"): a map makes it a card at the step (free of the paths: the token stays the only
 * piece they constrain), a release plan a feature with the points written on it. A board that truly cannot
 * hold one more card (a startup experience, whose cards are its interviews or its budget) refuses it in its
 * own sentence (workshopNoteRefusal), shown on the board, never ignored.
 */
export function workshopTakesNotes(_board: Workshop): boolean {
  return true
}

/**
 * Whether lines join this board's cards to notes and to each other: a board of plain lanes. A map's paths are its
 * lines, and a business board's, a release plan's and a startup experience's cards carry none.
 */
export function workshopTakesLines(board: Workshop): boolean {
  return !board.kind && !board.lanes.some(lane => lane.station) && !startupExperienceKind(board)
}

/** Why a startup experience holds no card made from a note: its cards are what the experience is about. */
function experienceRefusal(board: Workshop): string | null {
  const kind = startupExperienceKind(board)
  if (!kind) return null
  return 'This workshop keeps the cards it came with: ' + (kind === 'customer-interviews' ? 'its cards are its interviews.' : 'each card is $200 of its budget.') + ' Keep the note beside it.'
}

/** A release plan's feature from a note's words: its name, and the points written on it ("Audit log · 3 points"), or 1. */
function releaseFeature(words: string): { label: string; points: number } {
  const text = oneLine(words)
  const m = /^(.*?)\s*(?:[·•,:;–—-]\s*)?(\d{1,2})\s*(?:pts?|points?)\.?$/i.exec(text)
  const points = m ? Number(m[2]) : 1
  const label = (m ? m[1] : text).trim()
  return { label: label.slice(0, 80) || 'Feature', points: Math.min(24, Math.max(1, points)) }
}

/** An ordinary note offered to a lane: its id, its words and how it is drawn. */
export interface WorkshopNoteOffer {
  id: string
  label: string
  look?: WorkshopCardLook
  /** What the note has that the card will not show (line breaks, shape, size), kept for its way back. */
  asNote?: WorkshopCardAsNote
  /** The note's lines, with the note named by `id`: they stay joined to the card it becomes. */
  lines?: WorkshopLine[]
  /** Nest board: the card it was dropped on, to sit under. */
  under?: string
  /** Launch or hiring plan: the calendar day (from the plan's first day) it was let go on: its task starts there, snapped by the plan's rules. */
  day?: number
}

const idPattern = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/

/** The id a card made from a note takes: the note's own, unless the board uses it or a card cannot have it. */
function cardIdFor(board: Workshop, preferred: string) {
  const used = new Set([...board.lanes, ...board.cards, ...(board.signals ?? [])].map(item => item.id))
  return typeof preferred === 'string' && idPattern.test(preferred) && !used.has(preferred) ? preferred : nextWorkshopId(board, 'card')
}

/** Why `note` may not become a card in `laneId`, as a sentence; null when it may. */
export function workshopNoteRefusal(board: Workshop, laneId: string, note: WorkshopNoteOffer): string | null {
  const lane = board.lanes.find(item => item.id === laneId)
  if (!lane) return 'That lane is no longer on the board.'
  const experience = experienceRefusal(board)
  if (experience) return experience
  if (board.kind === 'release-plan') {
    // A feature with the points written on the note, by the release's points budget.
    if (board.cards.length >= maxWorkshopCards) return `This board is at its size limit of ${maxWorkshopCards} cards. Remove a card to make room.`
    if (Array.isArray(note?.lines) ? note.lines.length : note?.lines !== undefined) return 'A note joined to other notes by lines stays a note on this board.'
    const made = releaseNote(board, laneId, note)
    return made ? null : workshopRefusal(releaseNoteBoard(board, laneId, note), cardIdFor(board, note.id), laneId)
  }
  // A business board makes its card by its own rules, from the note's words and the number on it.
  // Its cards carry no lines, so a note joined to others by lines stays a note there.
  if (businessKind(board)) {
    if (Array.isArray(note.lines) ? note.lines.length : note.lines !== undefined) return 'A note joined to other notes by lines stays a note on this board.'
    const made = businessNote(board, laneId, note)
    return typeof made === 'string' ? made : ruleRefusal(board, made)
  }
  // A note becomes a card whatever its words, look, shape or lines: empty (the card takes the board's
  // name for a new item, workshopNewCardName), long (the card shows the first 80 characters and keeps the
  // rest for the note), or styled in a way a card does not draw.
  // Only words a card could not show as plain text (markup) keep it a note.
  if (board.cards.length >= maxWorkshopCards) return `This board is at its size limit of ${maxWorkshopCards} cards. Remove a card to make room.`
  // A map's lines are its paths: its cards carry none, so a note joined to others by lines stays a note, and says so.
  const map = board.lanes.some(item => item.station)
  if (map && (Array.isArray(note?.lines) ? note.lines.length : note?.lines !== undefined)) return 'A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.'
  // On a map the card is free of the step's limit, which counts tokens (workshopLaneHeld).
  const held = workshopLaneHeld(board, laneId)
  if (lane.capacity !== undefined && !map && held >= lane.capacity) return `It already holds ${held} of ${lane.capacity} ${lane.capacity === 1 ? 'card' : 'cards'}.`
  if (note.lines !== undefined) {
    const lines = offeredLines(note.lines)
    if (!lines) return 'A line of this note can\'t be joined to a card.'
    const ids = new Set((board.lines ?? []).map(line => line.id))
    if ((board.lines?.length ?? 0) + lines.filter(line => !ids.has(line.id)).length > maxWorkshopLines) {
      return `A workshop holds up to ${maxWorkshopLines} lines.`
    }
  }
  return ruleRefusal(board, { ...board, cards: [...board.cards, { id: cardIdFor(board, note.id), label: workshopCardLabelOf(noteWords(note) || workshopNewCardName(board)), laneId }] })
}

/** The rulebook's sentence when `next` breaks a rule of `board`; null when it keeps them. */
function ruleRefusal(board: Workshop, next: Workshop): string | null {
  if (!board.behaviour) return null
  const verdict = rulebook().check(board, next)
  return 'refused' in verdict ? verdict.refused.sentence : null
}

/** The parts of a note's look a card can draw. */
function keptLook(input: unknown): WorkshopCardLook | undefined {
  try { return input && typeof input === 'object' ? workshopCardLookOf(input as Record<string, unknown>) : undefined } catch { return undefined }
}

/** The parts of what a note had that a card can keep for it (its words, shape, size, picture, link). */
function keptAsNote(input: unknown): WorkshopCardAsNote | undefined {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return undefined
  const kept: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(input)) {
    try { if (cardAsNote({ [key]: value })) kept[key] = value } catch { /* not something a card can keep */ }
  }
  return Object.keys(kept).length ? cardAsNote(kept) : undefined
}

/** A note's lines as a card keeps them (their look as far as a line can be drawn), or null when one cannot be joined at all. */
function offeredLines(input: unknown): WorkshopLine[] | null {
  const list = Array.isArray(input) ? input : [input]
  const lines: WorkshopLine[] = []
  for (const raw of list) {
    let line: WorkshopLine | null = null
    try { line = workshopLine(raw) } catch {
      // Its look aside, the line itself: its ends, and the point of a free end.
      const bare = (point: boolean) => { const { id: lineId, parentId, childId, targetPoint } = record(raw); return workshopLine({ id: lineId, parentId, childId, ...(point ? { targetPoint } : {}) }) }
      // A free end whose point cannot be read cannot be drawn anywhere: the note says so rather than lose it.
      const free = (raw as any)?.targetPoint !== undefined && (raw as any)?.targetPoint !== null
      try { line = bare(true) } catch { try { line = free ? null : bare(false) } catch { line = null } }
    }
    if (!line) return null
    lines.push(line)
  }
  return lines
}

/** `line` with every end named `from` renamed `to`. */
function renamedLine(line: WorkshopLine, from: string, to: string): WorkshopLine {
  if (from === to || (line.parentId !== from && line.childId !== from)) return line
  return { ...line, parentId: line.parentId === from ? to : line.parentId, childId: line.childId === from ? to : line.childId }
}

/** `lines` with every end named `from` renamed `to` (a note that became a card under another id, or the way back). */
export function workshopRenamedLines<T extends WorkshopLine[] | undefined>(lines: T, from: string, to: string): T {
  return (lines ? lines.map(line => renamedLine(line, from, to)) : lines) as T
}

/** `lines` added to the board's own, each in place of a line of the board with the same id. */
function withLines(board: Workshop, lines: WorkshopLine[]): WorkshopLine[] {
  const added = new Map(lines.map(line => [line.id, line]))
  return [...(board.lines ?? []).filter(line => !added.has(line.id)), ...added.values()]
}

/**
 * The board with `note` as a card in `laneId`, or null when the lane's rules refuse it
 * (workshopNoteRefusal says why). The card goes at the foot of the lane, or just before the
 * card `before` when that card is in the lane (a card put back by an undo returns to its
 * place). The card keeps the note's id where it can.
 */
export function workshopNoteCandidate(board: Workshop, laneId: string, note: WorkshopNoteOffer, before?: string): Workshop | null {
  if (workshopNoteRefusal(board, laneId, note) !== null) return null
  if (board.kind === 'release-plan') return releaseNote(board, laneId, note, before)
  if (businessKind(board)) {
    const made = businessNote(board, laneId, note) as Workshop
    const card = made.cards[made.cards.length - 1]
    const at = before === undefined ? -1 : board.cards.findIndex(item => item.id === before && item.laneId === laneId)
    return at < 0 ? made : { ...made, cards: [...board.cards.slice(0, at), card, ...board.cards.slice(at)] }
  }
  const look = keptLook(note.look)
  const typed = noteWords(note)
  // An empty note takes the board's name for a new item, and remembers it had no words for its way back.
  const words = typed || workshopNewCardName(board)
  let asNote = keptAsNote(note.asNote)
  if (!typed) asNote = { ...asNote, text: '' }
  // Words longer than a card shows are kept for the note.
  if (words.length > 80 && asNote?.text === undefined && words.length <= 4000) asNote = { ...asNote, text: words }
  const cardId = cardIdFor(board, note.id)
  // A card that could not take the note's id remembers it, so the note comes back under it.
  const noteId = cardId !== note.id && typeof note.id === 'string' && notePattern.test(note.id) ? note.id : undefined
  // On a map the card is free of the paths: the token stays the only piece they constrain.
  const free = board.lanes.some(item => item.station)
  const card: WorkshopCard = { id: cardId, label: workshopCardLabelOf(words), laneId,
    ...(look ? { look } : {}), ...(asNote ? { asNote } : {}), ...(noteId ? { noteId } : {}), ...(free ? { free: true as const } : {}) }
  const at = before === undefined ? -1 : board.cards.findIndex(item => item.id === before && item.laneId === laneId)
  const cards = at < 0 ? [...board.cards, card] : [...board.cards.slice(0, at), card, ...board.cards.slice(at)]
  // The note's lines stay joined to it: to the card, under the card's id.
  const lines = note.lines === undefined ? undefined
    : withLines(board, offeredLines(note.lines)!.map(line => renamedLine(line, note.id, card.id)))
  return validateWorkshop({ ...board, cards, ...(lines ? { lines } : {}) })
}

/** A release plan with the note as a feature at the foot of `laneId` (or before `before`), unchecked. */
function releaseNoteBoard(board: Workshop, laneId: string, note: WorkshopNoteOffer, before?: string): Workshop {
  const { label, points } = releaseFeature(typeof note.label === 'string' ? note.label : '')
  const cardId = cardIdFor(board, note.id)
  const noteId = cardId !== note.id && typeof note.id === 'string' && notePattern.test(note.id) ? note.id : undefined
  const card: WorkshopCard = { id: cardId, label, laneId: board.lanes[board.lanes.length - 1].id, points, ...(noteId ? { noteId } : {}) }
  const at = before === undefined ? -1 : board.cards.findIndex(item => item.id === before && item.laneId === laneId)
  return { ...board, cards: at < 0 ? [...board.cards, card] : [...board.cards.slice(0, at), card, ...board.cards.slice(at)] }
}

/**
 * A release plan with the note as a feature in `laneId`: the points written on it, or 1, by the release's
 * points budget (planReleaseMove); null when the budget refuses it. The feature is placed as a move from the
 * last lane (the unplanned one) would place it, so the release's own rules decide.
 */
function releaseNote(board: Workshop, laneId: string, note: WorkshopNoteOffer, before?: string): Workshop | null {
  const staged = releaseNoteBoard(board, laneId, note, before)
  const cardId = cardIdFor(board, note.id)
  const card = staged.cards.find(item => item.id === cardId)!
  if (card.laneId === laneId) return validateWorkshop(staged)
  const moved = planReleaseMove(staged, card, laneId)
  return moved ? validateWorkshop(moved) : null
}

/**
 * The board with a note as a card on a business board (its words, and the number written on it: a task's
 * days, two when none is written), made by the edit every surface adds a card with; or why it may not be.
 */
function businessNote(board: Workshop, laneId: string, note: WorkshopNoteOffer): Workshop | string {
  const typed = noteWords(note)
  // A card made without words (an empty note, or one with only a number) takes the board's name for a new item.
  const read = workshopRules(businessKind(board)!).fromNote(board, typed, workshopNewCardName(board, note.under))
  if (typeof read === 'string') return read
  const made = applyWorkshopEdits(board, [{ kind: 'add_card', lane: { id: laneId }, ...read, ...(note.under && { under: { id: note.under } }) }])
  if ('refused' in made) return made.refused.reason
  const cards = made.workshop.cards
  const cardId = cardIdFor(board, note.id)
  // A card that could not take the note's id remembers it, so the note comes back under it.
  const noteId = cardId !== note.id && typeof note.id === 'string' && notePattern.test(note.id) ? note.id : undefined
  // The card keeps the note's look and what the note had that the card does not show (its shape,
  // size, line breaks), so a diamond dragged off the board is a diamond again (boards S1).
  const look = keptLook(note.look)
  // An empty note remembers it had no words, so it leaves the board empty again.
  const asNote = typed ? keptAsNote(note.asNote) : { ...keptAsNote(note.asNote), text: '' }
  cards[cards.length - 1] = { ...cards[cards.length - 1], id: cardId, ...(noteId ? { noteId } : {}),
    ...(look ? { look } : {}), ...(asNote ? { asNote } : {}) }
  // On a plan, the task starts on the day it was let go on, where the plan's rules allow (else at the start, as before).
  const rules = workshopRules(businessKind(board)!)
  if (typeof note.day === 'number' && Number.isFinite(note.day) && rules.landNote) return rules.landNote(made.workshop, cardId, note.day)
  return made.workshop
}

/** A note's words in one line; empty for a note with none. */
function noteWords(note: Pick<WorkshopNoteOffer, 'label'>): string {
  return typeof note?.label === 'string' ? oneLine(note.label) : ''
}

/**
 * The words a card takes back to the canvas as a note: none for a card made from an empty note and
 * still called by the board's name for a new item; the note's own words (line breaks and all) unless
 * the card has been renamed since; otherwise its words as the board writes them ("Copy · 3 days").
 */
export function workshopCardNoteWords(board: Workshop, card: WorkshopCard): string {
  const kept = card.asNote?.text
  if (kept === '' && (card.label === workshopNewCardName(board, card.parentId) || card.label === workshopNewCardName(board))) return ''
  return kept !== undefined && kept !== '' && workshopCardLabelOf(kept) === card.label ? kept : workshopCardNoteText(board, card)
}

/** What a card says on the board: its name, with its points, days or amount. */
export function workshopCardText(board: Workshop, card: WorkshopCard): string {
  if (board.kind === 'release-plan') return card.label + '\n' + card.points + ' points'
  const business = businessKind(board)
  // A card moved anyway says so, under its words: who and when (the rule it broke is in its label for assistive tools).
  const line = workshopOverrideLine(card)
  const text = business ? workshopRules(business).cardText(board, card) : card.label
  return line ? text + '\n' + line : text
}

/** The words a card takes back to the canvas as a note, numbers and all: "Copy · 3 days", "Acme · $25k". */
export function workshopCardNoteText(board: Workshop, card: WorkshopCard): string {
  // A release plan's feature takes its points with it, so it comes back with them.
  if (board.kind === 'release-plan') return card.label + ' · ' + card.points + (card.points === 1 ? ' point' : ' points')
  const business = businessKind(board)
  return business ? workshopRules(business).noteText(board, card) : card.label
}

/** Why the card may not leave the lanes as an ordinary note; null when it may. */
export function workshopCardAsNoteRefusal(board: Workshop, cardId: string): string | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card) return 'That card is no longer on the board.'
  if (startupExperienceKind(board)) return 'This card stays on the board.'
  if (board.lanes.some(lane => lane.station) && !card.free) return 'The token stays on the map.'
  if (board.kind === 'release-plan') {
    const needs = board.cards.find(item => item.dependsOn?.includes(cardId))
    if (needs) return `${needs.label} depends on ${card.label}, so it stays a card.`
  }
  if (board.kind === 'launch-plan' && board.cards.length === 1) return 'A launch plan needs at least one task.'
  if ((board.signals ?? []).some(signal => signal.cardId === cardId)) return `An outcome on this board depends on ${card.label}, so it stays a card.`
  if (board.cards.some(item => item.parentId === cardId)) return `${card.label} has cards under it, so it stays a card. Move them first.`
  if (card.allowedLaneIds && card.allowedLaneIds.length < board.lanes.length) {
    const names = card.allowedLaneIds.map(id => board.lanes.find(lane => lane.id === id)!.label)
    const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' or ' + names.at(-1) : names[0]
    return `${card.label} may only be in ${list}, so it stays a card.`
  }
  return null
}

/**
 * The board without the card, for a card taken off the lanes as an ordinary note; null when it
 * must stay. The card's lines stay joined to the note, named `noteId` (the card's own id unless
 * the note had to take another): a line to another card stays on the board, and a line to an
 * ordinary note leaves it for the drawing (see workshopCardLines).
 */
export function workshopCardAsNote(board: Workshop, cardId: string, noteId: string = noteIdOfCard(board, cardId)): Workshop | null {
  if (workshopCardAsNoteRefusal(board, cardId) !== null) return null
  // What waited on the task now waits on nothing in its place, from where it started.
  const rest = board.cards.filter(item => item.id !== cardId).map(item => {
    if (!item.dependsOn?.includes(cardId)) return item
    const next = { ...item, dependsOn: item.dependsOn.filter(id => id !== cardId) }
    if (!next.dependsOn.length) delete (next as WorkshopCard).dependsOn
    return next
  })
  const lines = board.lines?.map(line => renamedLine(line, cardId, noteId))
  return validateWorkshop({ ...board, cards: rest, ...(lines ? { lines } : {}) })
}

/**
 * The lines of card `cardId` once it is the ordinary note `noteId`: those that stay on the board
 * (another card is at their other end) and those that leave it, joining two ordinary notes of the
 * drawing now. Both name the note by `noteId`.
 */
export function workshopCardLines(board: Workshop, cardId: string, noteId: string = noteIdOfCard(board, cardId)): { stay: WorkshopLine[]; leave: WorkshopLine[] } {
  const others = new Set(board.cards.filter(card => card.id !== cardId).map(card => card.id))
  const touching = (board.lines ?? []).filter(line => line.parentId === cardId || line.childId === cardId)
    .map(line => renamedLine(line, cardId, noteId))
  const stays = (line: WorkshopLine) => others.has(line.parentId) || others.has(line.childId)
  return { stay: touching.filter(stays), leave: touching.filter(line => !stays(line)) }
}

function noteIdOfCard(board: Workshop, cardId: string): string {
  const card = board.cards.find(item => item.id === cardId)
  return card ? workshopNoteIdOf(card) : cardId
}

/** The lines of the board with `id` at either end. */
export function workshopLinesOf(board: Workshop, id: string): WorkshopLine[] {
  return (board.lines ?? []).filter(line => line.parentId === id || line.childId === id)
}

/** Why `line` may not be drawn on the board, as a sentence; null when it may. */
export function workshopLineRefusal(board: Workshop, line: WorkshopLine): string | null {
  if (board.kind) return workshopLinesSentence
  let drawn: WorkshopLine
  try { drawn = workshopLine(line) } catch (error) { return error instanceof Error ? error.message : 'That line can\'t be drawn.' }
  const cards = new Set(board.cards.map(card => card.id))
  drawn = freeEndOf(drawn, cards)
  // A free end hangs from the card that holds the line.
  if (drawn.targetPoint ? !cards.has(drawn.parentId) : !cards.has(drawn.parentId) && !cards.has(drawn.childId)) return 'That card is no longer on the board.'
  if (board.lanes.some(lane => lane.id === drawn.parentId || lane.id === drawn.childId)) return 'A line joins notes and cards, not lanes.'
  const known = (board.lines ?? []).some(item => item.id === drawn.id)
  if (!known && (board.lines?.length ?? 0) >= maxWorkshopLines) return `A workshop holds up to ${maxWorkshopLines} lines.`
  return null
}

/** Why a board with a kind (a release plan, a map, a business board) takes no lines. */
export const workshopLinesSentence = 'Lines join the cards of a lane workshop to notes and to each other.'

/** The board with `line` drawn, in place of a line with the same id; null when it may not be (see workshopLineRefusal). */
export function workshopWithLine(board: Workshop, line: WorkshopLine): Workshop | null {
  if (workshopLineRefusal(board, line) !== null) return null
  return validateWorkshop({ ...board, lines: withLines(board, [workshopLine(line)]) })
}

/** The board without the line `lineId` (the same board when it has no such line). */
export function workshopWithoutLine(board: Workshop, lineId: string): Workshop {
  if (!(board.lines ?? []).some(line => line.id === lineId)) return board
  return validateWorkshop({ ...board, lines: board.lines!.filter(line => line.id !== lineId) })
}

/**
 * A new line from `parentId` to `childId` (a card, or an ordinary note), with an arrow at the
 * child as the canvas draws one. Its id is the canvas's own for a first line between the two, and
 * the next free one after that.
 */
export function workshopNewLine(board: Workshop, parentId: string, childId: string, look: Partial<WorkshopLine> = {}): WorkshopLine {
  const used = new Set((board.lines ?? []).map(line => line.id))
  let lineId = `${parentId}->${childId}`
  for (let n = 2; used.has(lineId); n++) lineId = `${parentId}->${childId}~${n}`
  return workshopLine({ showChildArrow: true, ...look, id: lineId, parentId, childId })
}

/** The board without card `cardId`'s lines: a card removed from the board takes its lines with it. */
export function workshopWithoutCardLines(board: Workshop, cardId: string): Workshop {
  const lines = (board.lines ?? []).filter(line => line.parentId !== cardId && line.childId !== cardId)
  return lines.length === (board.lines?.length ?? 0) ? board : { ...board, lines }
}

/**
 * The counter under a column's name: how full it is, or what its cards add up to. One format everywhere:
 * "2 / 3" with a limit, "2" without; a step whose cards came from notes says those apart ("1 / 1 · +2").
 * A screen reader hears it in words (workshopLaneSpoken).
 */
export function workshopLaneCaption(board: Workshop, laneId: string): string {
  return laneCaption(board, laneId, false)
}

/** What a screen reader hears of a column's counter: "2 of 3", "2 cards", "1 of 1 · 2 cards", "5 of 8 points". */
export function workshopLaneSpoken(board: Workshop, laneId: string): string {
  return laneCaption(board, laneId, true)
}

function laneCaption(board: Workshop, laneId: string, spoken: boolean): string {
  const lane = board.lanes.find(item => item.id === laneId)
  if (!lane) return ''
  if (board.kind === 'release-plan') {
    const used = releaseLoad(board, laneId)
    return lane.capacity ? used + (spoken ? ' of ' : ' / ') + lane.capacity + ' points' : used + ' points'
  }
  const business = businessKind(board)
  if (business) return workshopRules(business).caption(board, laneId)
  const budget = workshopBudgetResult(board, laneId)
  if (budget) return '$' + budget.amount + ' · ' + budget.description
  const count = board.cards.filter(card => card.laneId === laneId).length
  const limit = board.behaviour ? rulebook().laneLimit(board, laneId) : lane.capacity
  // A step's limit counts its tokens: "1 / 1", with the cards made from notes beside them said apart.
  const counted = workshopLaneHeld(board, laneId)
  const cards = (n: number) => n + (n === 1 ? ' card' : ' cards')
  if (spoken) {
    if (limit !== undefined && counted !== count) return counted + ' of ' + limit + ' · ' + cards(count - counted)
    return limit !== undefined ? count + ' of ' + limit : cards(count)
  }
  if (limit !== undefined && counted !== count) return counted + ' / ' + limit + ' · +' + (count - counted)
  return limit !== undefined ? count + ' / ' + limit : String(count)
}

/** Whether a column holds as many as its limit lets it (its counter pill takes the header's colour). */
export function workshopLaneFull(board: Workshop, laneId: string): boolean {
  const lane = board.lanes.find(item => item.id === laneId)
  if (!lane || lane.station || businessKind(board) || board.kind === 'release-plan') return false
  const limit = board.behaviour ? rulebook().laneLimit(board, laneId) : lane.capacity
  return limit !== undefined && workshopLaneHeld(board, laneId) >= limit
}

export const workshopLayout = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }
export const laneColors = ['#d5e9e3', '#fbdfac', '#dedef4', '#dcebf3', '#efd7dc']

/**
 * Where each lane starts. `held` (cards per lane on the committed board) keeps a map's
 * rows the height they had when a card was picked up, so no station moves under the pointer.
 */
export function workshopPositions(board: Workshop, layout = workshopLayout, stationGap = 28, held?: number[]) {
  const { pitch, row, top } = layout
  const map = Boolean(board.lanes[0].station)
  const rows = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  const rowHeight = top + Math.max(1, ...(held ?? rows)) * row + 36
  const points = board.lanes.map((lane, index) => ({
    x: map ? lane.station!.column * (pitch + stationGap) : index * pitch,
    y: map ? lane.station!.row * rowHeight : 0,
  }))
  return { points, width: Math.max(...points.map(p => p.x)) + pitch,
    height: Math.max(...points.map((p, i) => p.y + top + (map ? Math.max(1, rows[i]) : rows[i] + 1) * row)) }
}

/** Start with two empty, editable lanes. IDs have no special meaning to the renderer. */
export function createLaneWorkshop(): Workshop {
  return { version: 1, title: 'Untitled workshop',
    lanes: [{ id: 'lane-1', label: 'Lane 1' }, { id: 'lane-2', label: 'Lane 2' }], cards: [] }
}

export function nextWorkshopId(board: Workshop, prefix: string): string {
  const used = new Set([...board.lanes, ...board.cards, ...(board.signals ?? [])].map(item => item.id))
  let n = 1
  while (used.has(prefix + '-' + n)) n++
  return prefix + '-' + n
}

function ordinaryWorkshop(input: Workshop): Workshop {
  const board = validateWorkshop(input)
  if (board.kind || board.lanes[0].station) throw new Error('Choose a lane workshop to add lanes or cards.')
  return board
}

export function addWorkshopLane(input: Workshop, lane: Pick<WorkshopLane, 'label' | 'capacity'>): Workshop {
  const board = ordinaryWorkshop(input)
  const id = nextWorkshopId(board, 'lane')
  board.lanes.push({ id, label: lane.label, ...(lane.capacity === undefined ? {} : { capacity: lane.capacity }) })
  board.presentationOrder?.push(id)
  return validateWorkshop(board)
}

export function addWorkshopCard(input: Workshop, laneId: string, card: Pick<WorkshopCard, 'label' | 'allowedLaneIds'>): Workshop {
  const board = ordinaryWorkshop(input)
  board.cards.push({ id: nextWorkshopId(board, 'card'), label: card.label, laneId,
    ...(card.allowedLaneIds === undefined ? {} : { allowedLaneIds: card.allowedLaneIds }) })
  return validateWorkshop(board)
}

/** A fresh editable map, with enough structure to move a token or add a second path. */
export function createWorkshopMap(): Workshop {
  return {
    version: 1, title: 'Untitled map',
    lanes: [
      { id: 'start', label: 'Start', station: { column: 0, row: 0, next: ['next'], outcome: 'The token is at the start.' } },
      { id: 'next', label: 'Next step', station: { column: 1, row: 0, next: [], outcome: 'The token has reached the next step.' } },
    ],
    cards: [{ id: 'token', label: 'Token', laneId: 'start' }],
  }
}

/** Append a destination without moving any existing stations or relaxing token restrictions. */
export function addWorkshopBranch(board: Workshop, fromStationId: string, branch: { label: string; outcome: string; image?: StationImage }): Workshop {
  const map = validateWorkshop(board)
  if (map.kind || !map.lanes[0].station) throw new Error('Add branches to an interactive map.')
  const source = map.lanes.find(lane => lane.id === fromStationId)
  if (!source?.station) throw new Error('Choose a station on this map.')
  if (map.lanes.length >= maxWorkshopLanes) throw new Error('A map can have up to five stations.')
  const name = label(branch?.label)
  const outcome = label(branch?.outcome, 160)
  const nextId = nextWorkshopId(map, 'station')

  let position: { column: number; row: number } | undefined
  let closest = Infinity
  for (let row = 0; row < mapGridSize; row++) {
    for (let column = 0; column < mapGridSize; column++) {
      if (map.lanes.some(lane => lane.station!.column === column && lane.station!.row === row)) continue
      const distance = Math.abs(source.station.column - column) + Math.abs(source.station.row - row)
      if (distance < closest) {
        closest = distance
        position = { column, row }
      }
    }
  }
  if (!position) throw new Error('There is no free station position.')
  // validateWorkshop returned a fresh document, independent of the caller's board.
  source.station.next.push(nextId)
  map.lanes.push({ id: nextId, label: name, station: { ...position, next: [], outcome, ...(branch.image === undefined ? {} : { image: stationImage(branch.image) }) } })
  map.presentationOrder?.push(nextId)
  return map
}

export const nightTransfer: Workshop = {
  version: 1, title: 'Can the last train meet the shuttle?',
  lanes: [
    { id: 'platform', label: 'Last train', station: { column: 0, row: 0, next: ['stairs', 'lift'], outcome: 'The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves.' } },
    { id: 'stairs', label: 'East stairs', station: { column: 1, row: 0, next: ['platform'], outcome: 'The east doors open onto the closed platform. Follow the signs back to the lift.' } },
    { id: 'lift', label: 'Market St lift', station: { column: 0, row: 1, next: ['shuttle'], outcome: 'The lift opens on Market Street. The marked path leads to shuttle bay B.' } },
    { id: 'shuttle', label: 'Shuttle · Bay B', station: { column: 1, row: 1, next: [], outcome: 'The rider makes the connection. Run it again to try the other exit.' } },
  ],
  cards: [{ id: 'rider', label: 'Last rider', laneId: 'platform' }],
}

/** How the native artwork arranges a board's lanes. */
export interface WorkshopBoardLayout {
  /** Business boards: draw the narrow (phone) arrangement. */
  narrow?: boolean
  /** Business boards: the world width the board should fill. */
  width?: number
  /**
   * Plans: how wide a day is drawn, in world units. A grip being dragged (launch day) keeps the day width it
   * started with, so a later line draws the days it adds and the plan grows past `width`. Left out, the
   * plan's days fill `width`.
   */
  dayWidth?: number
  /**
   * Plans: the widest a held grip may draw the plan (on a slate of many boards, the room before the next board).
   * A plan that would grow past it while held keeps this width and its days narrow instead. Left out, it grows.
   */
  maxWidth?: number
  /**
   * A pipeline's gauge or a budget's envelope: the amount the board's width spans. A target or an envelope edge being
   * dragged keeps the scale it started with. Left out, the gauge fits target and forecast, and the envelope its total.
   */
  gaugeScale?: number
  /** A budget whose start edge is held: the envelope's end stays where it was, and it grows or shrinks at the start. */
  gaugeAnchor?: 'start' | 'end'
  /**
   * How many lanes sit side by side before the next lane starts a new row. Leave it
   * out for every lane in one row. A narrow host passes 1 or 2 so each lane stays
   * wide enough to read. A map ignores it: its stations stay where they were authored.
   */
  lanesPerRow?: number
}

/**
 * How the native artwork's notes are drawn, so they match the host's ordinary
 * notes. Anything left out is what an ordinary engine note gets (DEFAULT_NOTE_STYLE).
 * Sizes are world units: CSS pixels at 100% zoom.
 */
export interface WorkshopNoteStyle {
  /** Type family of every lane, caption and card. */
  fontFamily?: string
  /** Card text. A label too long for its card at this size is set smaller, never below 11. */
  fontSize?: number
  /** Lane names. Defaults to two more than the card text. */
  laneFontSize?: number
  /** The caption under each lane name. Defaults to one less than the card text. */
  captionFontSize?: number
  /** Text of lanes, captions and cards. */
  textColor?: string
  /** Fill of the cards: the host's ordinary note fill. Defaults to an engine note's. */
  backgroundColor?: string
  /** Outline of lane headers and cards. */
  borderColor?: string
  borderWidth?: number
  /** Corner radius of lane headers and cards; 0 is a square-cornered note. */
  cornerRadius?: number
  /**
   * How cards are drawn when they should look like the host's own notes rather than like the
   * lanes: fill, text, type, border and corners. Overrides the fields above for cards only.
   */
  card?: WorkshopCardLook & { cornerRadius?: number }
}

export interface WorkshopArtworkOptions {
  /**
   * Draw for a live slate instead of a presentation: notes in the canvas's own
   * type, a `caption-<lane>` line under each lane name, and a `column-<lane>`
   * shape behind each lane. Lane and card notes keep their `lane-<id>` and
   * `card-<id>` names.
   */
  native?: boolean
  /** Where the artwork's top-left corner goes, in the slate's world units. */
  origin?: { x: number; y: number }
  /**
   * Draw each lane column at least this many cards tall: one number for every
   * lane, or one per lane in lane order. A board keeps its shape (and its drop
   * zones) while a held card previews a board with shorter lanes.
   */
  rows?: number | number[]
  /** Native artwork only: wrap the lanes into rows. */
  layout?: WorkshopBoardLayout
  /** Native artwork only: draw the notes in the host's note style. */
  style?: WorkshopNoteStyle
  /**
   * Native artwork only: ids of the notes the slate's own document holds. A workshop
   * note whose name one of them already has is drawn under another id (see
   * workshopStandInId), so the artwork can be laid beside those notes as it is.
   */
  beside?: Iterable<string>
  /**
   * The board's scope on a slate of many boards: every note is named `<scope>:<name>` (and its
   * connectors join those names). Left out, or `main`, the names are the ones a slate of one board has.
   */
  scope?: string
}

const captionNodeId = (id: string) => 'caption-' + id
const columnNodeId = (id: string) => 'column-' + id
/** The "How this board behaves" note: not a lane- or card- part, so a live board treats it as decoration. */
const rulesNodeId = 'rules-board'

/**
 * A board's scope on a slate of many boards, checked: 1 to 12 lowercase letters and digits. `main` (the
 * slate's first board) and no scope at all are the same thing: undefined, the names a slate of one board has.
 */
export function workshopBoardScope(scope?: string | null): string | undefined {
  if (scope === undefined || scope === null || scope === 'main') return undefined
  if (typeof scope !== 'string' || !/^[a-z0-9]{1,12}$/.test(scope)) throw new Error('A board scope is 1 to 12 lowercase letters and digits.')
  return scope
}

/** The id a board's note is drawn under: `<scope>:<name>`, or the name itself for the first board. */
export function workshopScopedId(name: string, scope?: string | null): string {
  const checked = workshopBoardScope(scope)
  return checked ? checked + ':' + name : name
}

/** The names of one board's notes, in its scope. */
export interface WorkshopNodeNames {
  lane(id: string): string
  card(id: string): string
  image(id: string): string
  caption(id: string): string
  column(id: string): string
  rules: string
}

/**
 * The names of the notes workshopToSlate draws for a lane or a card. `of(scope)`: the same names for
 * one board of a slate that holds several (`b2:card-<id>`); `of('main')` and `of()` are these names.
 */
export const workshopNodeIds = { lane: laneNodeId, card: cardNodeId, image: imageNodeId, caption: captionNodeId, column: columnNodeId, rules: rulesNodeId,
  of(scope?: string | null): WorkshopNodeNames {
    const checked = workshopBoardScope(scope)
    const at = (name: string) => checked ? checked + ':' + name : name
    return { lane: id => at(laneNodeId(id)), card: id => at(cardNodeId(id)), image: id => at(imageNodeId(id)), caption: id => at(captionNodeId(id)),
      column: id => at(columnNodeId(id)), rules: at(rulesNodeId) }
  },
}

/** Name every note of an artwork, and the ends of its connectors, in a board's scope (nothing changes for the first board). */
function scopeArtwork(nodes: NodeJSON[], scope?: string) {
  if (!scope) return
  const at = (name: unknown) => scope + ':' + name
  for (const item of nodes) {
    item.options.id = at(item.options.id)
    for (const link of item.relationships.associations) {
      if (link.id !== undefined) link.id = at(link.id)
      link.parentId = at(link.parentId)
      link.childId = at(link.childId)
    }
  }
}

/**
 * The id a workshop note takes when the slate's own document already has a note by
 * its name: `<name>--2`, or the first number after that which `taken` leaves free.
 * The document's note keeps its id. One rule for the live canvas and for every
 * drawing made of it.
 */
export function workshopStandInId(name: string, taken: (id: string) => boolean): string {
  let n = 2
  while (taken(`${name}--${n}`)) n++
  return `${name}--${n}`
}

/** A note's outline: a box with rounded corners (none at radius 0). */
export function roundedBox(width: number, height: number, radius: number) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2)), w = width, h = height
  if (!r) return `M 0 0 H ${w} V ${h} H 0 Z`
  return `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`
}

/** Blend a #rrggbb colour toward white. */
function tint(hex: string, amount: number) {
  const channel = (i: number) => Math.round(parseInt(hex.slice(i, i + 2), 16) * (1 - amount) + 255 * amount).toString(16).padStart(2, '0')
  return '#' + channel(1) + channel(3) + channel(5)
}

/**
 * The largest size from `size` down to 11 at which `text` fits a note of this
 * width and height. An estimate (the engine wraps by measuring): short names keep
 * the reading size, long ones step down so their lines stay inside the note.
 */
function fittingFontSize(text: string, size: number, width: number, height: number) {
  for (let candidate = size; candidate > 11; candidate--) {
    const perLine = Math.max(1, Math.floor(width / (candidate * 0.55)))
    const lines = text.split('\n').reduce((count, line) => count + Math.max(1, Math.ceil(line.length / perLine)), 0)
    if (lines * candidate * 1.3 <= height) return candidate
  }
  return Math.min(size, 11)
}

const stationImageHeight = 152
const stationImageSpace = stationImageHeight + 12
/** World units between one row of lanes and the next when a layout wraps them. */
const laneRowGap = 12

function lanesPerRow(layout: WorkshopBoardLayout | undefined, most: number) {
  const wanted = layout?.lanesPerRow
  if (wanted === undefined) return most
  if (typeof wanted !== 'number' || !Number.isInteger(wanted) || wanted < 1) throw new Error('lanesPerRow must be a whole number, 1 or more.')
  return Math.min(wanted, most)
}

/** One lane's place in the native artwork: its column box from the artwork's origin, and its cell in the grid of lanes. */
export interface WorkshopLanePlace {
  laneId: string
  x: number
  y: number
  width: number
  height: number
  column: number
  row: number
}

/**
 * Where the native artwork puts each lane, in lane order, and how large the whole
 * board is. The same arithmetic workshopToSlate({ native: true }) draws with, for a
 * host that fits the board to its screen or needs to know which lane is above which.
 */
export function workshopLanePlaces(input: Workshop, options: Pick<WorkshopArtworkOptions, 'layout' | 'rows'> = {}): { places: WorkshopLanePlace[]; width: number; height: number } {
  const board = validateWorkshop(input)
  const { pitch, row, top } = workshopLayout
  const counts = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  const least = (index: number) => Math.max(counts[index], (Array.isArray(options.rows) ? options.rows[index] : options.rows) ?? 0)
  const map = Boolean(board.lanes[0].station)
  const hasImages = board.lanes.some(lane => lane.station?.image)
  const perRow = lanesPerRow(options.layout, board.lanes.length)
  const places: WorkshopLanePlace[] = []
  if (map) {
    // A map's stations stay where their author put them: the layout wraps lanes, not a diagram.
    // While a card is held every row keeps its committed height; only the target station grows, downward.
    const { points } = workshopPositions(board, undefined, undefined, Array.isArray(options.rows) ? options.rows : undefined)
    board.lanes.forEach((lane, index) => places.push({ laneId: lane.id, x: points[index].x,
      y: points[index].y + (hasImages ? lane.station!.row * stationImageSpace : 0), width: pitch,
      height: top + (lane.station!.image ? stationImageSpace : 0) + Math.max(1, least(index)) * row,
      column: lane.station!.column, row: lane.station!.row }))
  } else {
    // Every lane column in a row is as tall as the fullest lane of that row plus
    // one free slot, so the board reads as columns and each column is one drop zone.
    // A board's rules are its chrome (boardChrome.ts), drawn above the board and never a note.
    let y = 0
    for (let first = 0; first < board.lanes.length; first += perRow) {
      const band = board.lanes.slice(first, first + perRow)
      const height = top + (Math.max(...band.map((_, column) => least(first + column))) + 1) * row
      band.forEach((lane, column) => places.push({ laneId: lane.id, x: column * pitch, y, width: pitch, height, column, row: first / perRow }))
      y += height + laneRowGap
    }
  }
  return { places, width: Math.max(...places.map(place => place.x + place.width)), height: Math.max(...places.map(place => place.y + place.height)) }
}


function nativeWorkshopToSlate(board: Workshop, options: WorkshopArtworkOptions): SlateJSON {
  const { pitch, width, row, height, top } = workshopLayout
  const origin = options.origin ?? { x: 0, y: 0 }
  const map = Boolean(board.lanes[0].station)
  const { places } = workshopLanePlaces(board, options)
  const style = options.style ?? {}
  const ink = style.textColor ?? DEFAULT_NOTE_STYLE.fontColor
  const line = style.borderColor ?? DEFAULT_NOTE_STYLE.borderColor
  const lineWidth = style.borderWidth ?? DEFAULT_NOTE_STYLE.borderWidth
  const radius = style.cornerRadius ?? 0
  const cardSize = style.fontSize ?? DEFAULT_NOTE_STYLE.fontSize
  const laneSize = style.laneFontSize ?? cardSize + 2
  const captionSize = style.captionFontSize ?? Math.max(11, cardSize - 1)
  const nodes: NodeJSON[] = []
  const note = (options: Record<string, unknown>) => {
    // Each note's outline is drawn at its own size, so corners stay round and the
    // border stays even however wide or tall the note is.
    const item: NodeJSON = { options: { shapeHint: 'rectangle', vectorPath: roundedBox(options.width as number, options.height as number, radius),
      foregroundColor: ink, borderColor: line, borderWidth: lineWidth,
      ...(style.fontFamily ? { fontFamily: style.fontFamily } : {}), ...options }, relationships: { associations: [] } }
    nodes.push(item)
    return item
  }
  board.lanes.forEach((lane, index) => {
    const place = places[index]
    const x = origin.x + place.x, y = origin.y + place.y
    const image = lane.station?.image
    note({ id: columnNodeId(lane.id), text: '', name: lane.label, xPos: x + 2, yPos: y, width: pitch - 4, height: place.height,
      vectorPath: roundedBox(pitch - 4, place.height, radius ? radius + 2 : 0),
      backgroundColor: map ? '#fcf9ed' : tint(laneColors[index], 0.6), borderColor: map ? '#a8b5aa' : tint(laneColors[index], 0.1), borderWidth: 1,
      ...(map ? { borderStyle: 'dashed' } : {}) })
    note({ id: laneNodeId(lane.id), text: lane.label, name: lane.label, xPos: x + 8, yPos: y + 6, width, height: 58,
      backgroundColor: laneColors[index], fontSize: fittingFontSize(lane.label, laneSize, width - 16, 50) })
    // The counter: a small pill under the column's name ("2 / 3", "2"), centred; a full column's pill takes the
    // header's colour. A map's station shows its token itself: no counter.
    const counter = map ? '' : workshopLaneCaption(board, lane.id)
    const pillSize = captionSize
    const pillW = map ? width : Math.min(width, Math.max(40, Math.ceil(counter.length * pillSize * 0.6) + 24))
    note({ id: captionNodeId(lane.id), text: counter, name: lane.label, xPos: x + 8 + Math.round((width - pillW) / 2), yPos: y + 68, width: pillW, height: 22,
      vectorPath: roundedBox(pillW, 22, map ? 0 : 11), backgroundColor: map ? 'transparent' : workshopLaneFull(board, lane.id) ? laneColors[index % laneColors.length] : 'rgba(255,255,255,0.72)',
      borderWidth: 0, fontSize: pillSize })
    if (image) {
      nodes.push({ options: { id: imageNodeId(lane.id), name: image.alt, text: '', xPos: x + 8, yPos: y + top, width, height: stationImageHeight,
        shapeHint: 'rectangle', image: image.src, borderWidth: 0 }, relationships: { associations: [] } })
    }
    board.cards.filter(card => card.laneId === lane.id).forEach((card, i) => {
      const text = workshopCardText(board, card)
      const cardWidth = map ? width - 20 : width, cardHeight = map ? height - 6 : height
      // A card is drawn as the slate draws an ordinary note (a map's token is a playing piece of
      // its own). A card made from a note keeps that note's look.
      const token = map && !card.free
      const look = token ? {} : { ...style.card, ...card.look }
      const corner = token ? radius : style.card?.cornerRadius ?? radius
      note({ id: cardNodeId(card.id), text, name: card.label,
        xPos: x + (map ? 18 : 8), yPos: y + top + (image ? stationImageSpace : 0) + i * row, width: cardWidth, height: cardHeight,
        ...(corner !== radius ? { vectorPath: roundedBox(cardWidth, cardHeight, corner) } : {}),
        backgroundColor: token ? '#ffda75' : look.backgroundColor ?? style.backgroundColor ?? DEFAULT_NOTE_STYLE.backgroundColor,
        ...(look.textColor ? { foregroundColor: look.textColor } : {}), ...(look.fontFamily ? { fontFamily: look.fontFamily } : {}),
        ...(look.borderColor ? { borderColor: look.borderColor } : {}), ...(look.borderWidth !== undefined ? { borderWidth: look.borderWidth } : {}),
        fontSize: fittingFontSize(text, look.fontSize ?? cardSize, cardWidth - 16, cardHeight - 8) })
    })
  })
  const byId = new Map(nodes.map(item => [item.options.id as string, item]))
  for (const lane of board.lanes) {
    if (!lane.station) continue
    // A station's onward stops are joined zone to zone, so the line runs in the gap
    // between two stations and never over a station's caption or its token.
    byId.get(columnNodeId(lane.id))!.relationships.associations = lane.station.next.map(key => ({ id: lane.id + '-to-' + key,
      parentId: columnNodeId(lane.id), childId: columnNodeId(key), lineType: 'straight', lineColor: '#506b61', lineWidth: 2, showChildArrow: true }))
  }
  if (board.kind === 'release-plan') {
    for (const card of board.cards) {
      for (const prerequisite of card.dependsOn ?? []) {
        const parentId = cardNodeId(prerequisite), childId = cardNodeId(card.id)
        byId.get(parentId)!.relationships.associations.push({ id: `dependency-${prerequisite.length}-${prerequisite}-${card.id}`,
          parentId, childId, lineType: 'straight', lineColor: '#566a67', lineWidth: 2, showChildArrow: true })
      }
    }
  }
  scopeArtwork(nodes, workshopBoardScope(options.scope))
  if (options.beside) {
    const theirs = new Set(options.beside)
    const used = new Set(nodes.map(item => item.options.id as string))
    const drawnAs = new Map<string, string>()
    for (const name of [...used]) {
      if (!theirs.has(name)) continue
      const id = workshopStandInId(name, candidate => theirs.has(candidate) || used.has(candidate))
      used.add(id)
      drawnAs.set(name, id)
    }
    const as = (name: unknown) => drawnAs.get(name as string) ?? name
    for (const item of nodes) {
      item.options.id = as(item.options.id)
      for (const link of item.relationships.associations) {
        link.parentId = as(link.parentId)
        link.childId = as(link.childId)
      }
    }
  }
  return { options: { name: board.title }, shareId: '', nodes }
}

/**
 * The "How this board behaves" note of a board with a rulebook (behaviour.ts draws it); null without one. No board
 * draws it any more (a board's rules are its chrome: boardLegend); it stays for a host that shows the sentences.
 */
export function behaviourNote(board: Workshop, box: { x: number; y: number; width: number }, style: WorkshopNoteStyle = {}): NodeJSON | null {
  return board.behaviour ? rulebook().note(board, box, style) : null
}

/**
 * Draw a workshop as slate notes. With no options this is the presentation artwork
 * the app and its snapshots already consume; `{ native: true }` is the artwork
 * attachWorkshop keeps on a live slate.
 */
export function workshopToSlate(input: Workshop, options?: WorkshopArtworkOptions): SlateJSON {
  const board = validateWorkshop(input)
  const scope = workshopBoardScope(options?.scope)
  if (options?.native) return nativeWorkshopToSlate(board, options)
  const { width, row, height, top } = workshopLayout
  const nodes: NodeJSON[] = []
  function node(key: string, text: string, x: number, y: number, h: number, fill: string) {
    nodes.push({ options: { id: key, text, name: text, xPos: x, yPos: y, width, height: h,
      shapeHint: 'rectangle', backgroundColor: fill, foregroundColor: '#18302d', fontSize: 18,
      borderColor: '#667872', borderWidth: 1 }, relationships: { associations: [] } })
  }
  const { points } = workshopPositions(board)
  const imageHeight = 152
  const imageSpace = imageHeight + 12
  const hasImages = board.lanes.some(lane => lane.station?.image)
  board.lanes.forEach((lane, column) => {
    const x = points[column].x
    const y = points[column].y + (hasImages ? (lane.station?.row ?? 0) * imageSpace : 0)
    const image = lane.station?.image
    const label = board.kind === 'release-plan' ? lane.label + '\n' +
      (lane.capacity ? releaseLoad(board, lane.id) + ' / ' + lane.capacity + ' points' : releaseLoad(board, lane.id) + ' points') : lane.label
    node(laneNodeId(lane.id), label, x, y, top - 12, laneColors[column])
    if (image) {
      nodes.push({ options: { id: imageNodeId(lane.id), name: image.alt, text: '',
        xPos: x, yPos: y + top, width, height: imageHeight, shapeHint: 'rectangle',
        image: image.src, borderWidth: 0 }, relationships: { associations: [] } })
    }
    board.cards.filter(card => card.laneId === lane.id).forEach((card, i) =>
      node(cardNodeId(card.id), workshopCardText(board, card), x, y + top + (image ? imageSpace : 0) + i * row, height, '#fffdf6'))
  })
  for (const lane of board.lanes) {
    if (!lane.station) continue
    const heading = nodes.find(n => n.options.id === laneNodeId(lane.id))!
    heading.relationships.associations = lane.station.next.map(key => ({ id: lane.id + '-to-' + key, parentId: heading.options.id, childId: laneNodeId(key), lineType: 'straight', lineColor: '#506b61', lineWidth: 2, showChildArrow: true }))
    heading.options.text = lane.label + '\n' + lane.station.outcome
    heading.options.fontSize = 13
  }
  if (board.kind === 'release-plan') {
    const byId = new Map(nodes.map(n => [n.options.id, n]))
    for (const card of board.cards) {
      for (const prerequisite of card.dependsOn ?? []) {
        const parentId = cardNodeId(prerequisite), childId = cardNodeId(card.id)
        byId.get(parentId)!.relationships.associations.push({
          id: `dependency-${prerequisite.length}-${prerequisite}-${card.id}`, parentId, childId, lineType: 'straight',
          lineColor: '#566a67', lineWidth: 2, showChildArrow: true,
        })
      }
    }
  }
  scopeArtwork(nodes, scope)
  return { options: { name: board.title }, shareId: '', nodes }
}

/** What a board kit tells workshopReserve: its size in a layout (WorkshopBoardKit.places). */
export interface WorkshopReserveKit {
  places(board: Workshop, layout: WorkshopBoardLayout): { width: number; height: number }
}

/**
 * The room a board needs on a slate of many boards: the widest it can become on a desktop, and how
 * tall it is now (a board grows downward only), in world units. A host places boards side by side
 * in these boxes, so one never grows into the next.
 * - A board of lanes: five lanes (the most a board has), or a map's own width when that is wider.
 * - A launch plan, hiring plan, pipeline, budget or nested board: its kit's desktop width (a launch
 *   plan's is 1200), or `layout.width` when the board is pinned to a width (a desktop layout's). It needs its kit.
 *   A plan held by a grip grows to the right under the pointer only as far as the next board allows
 *   (attachWorkshop's `avoid`, as `layout.maxWidth`); past that its days narrow, and it fits again when let go.
 * A phone's narrow layout is never the reserve: it is always smaller than the desktop one.
 */
export function workshopReserve(input: Workshop, layout: WorkshopBoardLayout = {}, kit?: WorkshopReserveKit): { width: number; height: number } {
  const board = validateWorkshop(input)
  // A phone's width is not the board's: the width a board is pinned to counts only on a desktop layout.
  const pinned = layout.narrow ? undefined : layout.width
  if (businessKind(board)) {
    if (!kit) throw new Error(`A ${board.kind} board's room needs its kit: pass kitFor('${board.kind}') from slateboxjs/boards.`)
    const { width, height } = kit.places(board, pinned !== undefined ? { width: pinned } : {})
    return { width: Math.max(width, pinned ?? 0), height }
  }
  const { width, height } = workshopLanePlaces(board, {})
  return { width: Math.max(maxWorkshopLanes * workshopLayout.pitch, width), height }
}

/**
 * Where a note set "beside a board" goes so it is clear of other boards: `spot` itself when nothing
 * in `avoid` is within `gap` of it on its row, otherwise moved along its row (to the right, or with
 * side -1 to the left) past each box in the way. Only x changes.
 */
export function workshopFreeSpot(spot: { x: number; y: number; width: number; height: number }, avoid: { x: number; y: number; width: number; height: number }[],
  side: 1 | -1 = 1, gap = 32): { x: number; y: number } {
  let x = spot.x
  const boxes = avoid.filter(box => [box.x, box.y, box.width, box.height].every(Number.isFinite))
  for (let tries = 0; tries <= boxes.length; tries++) {
    const hit = boxes.find(box => x < box.x + box.width + gap && x + spot.width > box.x - gap && spot.y < box.y + box.height + gap && spot.y + spot.height > box.y - gap)
    if (!hit) break
    x = side > 0 ? hit.x + hit.width + gap : hit.x - gap - spot.width
  }
  return { x: Math.round(x), y: Math.round(spot.y) }
}

export const industrialWorkshop: Workshop = {
  version: 1,
  title: 'Which field trials should run before the winter shutdown?',
  lanes: [{ id: 'proposed', label: 'Proposed trials' }, { id: 'pilot', label: 'Fund this quarter', capacity: 2 },
    { id: 'evidence', label: 'Gather evidence' }],
  cards: [
    { id: 'sensors', label: 'Test bearing sensors on line four', laneId: 'proposed' },
    { id: 'spares', label: 'Stage a spare drive at the north mill', laneId: 'proposed' },
    { id: 'cooling', label: 'Measure cooling losses at shift change', laneId: 'evidence', allowedLaneIds: ['evidence', 'pilot'] },
    { id: 'training', label: 'Rehearse the overnight restart', laneId: 'pilot' },
  ],
}

export * from './moonGallery'
export * from './darkroom/model'
export * from './edits'
export { said, listed, unquoted, named, countWord, pointing, workshopFinder, WorkshopReferenceError, type WorkshopFinder } from './names'
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop, type WorkshopCandidateChooser, type WorkshopChangeEvent, type WorkshopRefusalEvent, type WorkshopSelection, type WorkshopOverrideAsk, type WorkshopOverrideOffer,
  type WorkshopBoardKit, type PartPlace, type BoardLayer, type BoardLayerState, type HandleResult, registerRuleControls, type RuleControlsMode, type RuleControlsHooks } from './native'
// The board layer's drawing, which the boards' kits and the native workshop share (also slateboxjs/boards): exported here
// so the model's entry hands it to them by these names.
export { createBoardLayer, layerInk, renderLayerShapes, type LayerShape } from './boardLayer'
export { boardLegend, boardChromeShapes, boardBadgeShapes, boardChromeLayout, boardChromeLabel, boardChromeStyles, chromeInk, DRAFT_TAG,
  boardChromeBox, chromeScaleAt, chromeTagScaleAt, CHROME_MAX_SCALE, CHROME_CHIPS_MAX_SCALE, type LegendItem, type LegendIcon, type ChromeOptions } from './boardChrome'


export type StartupExperience = {version: 1; kind: 'customer-interviews' | 'experiment-budget'}

export const interviews = [
  {id:'preview', who:'Jo · agency owner', quote:'“Will this email every client on my list?”', action:'Show a ten-row preview', signal:'Mara will test whether Jo can import a list without contacting a client.'},
  {id:'duplicate', who:'Bea · studio manager', quote:'“I already added half these clients by hand.”', action:'Review matching clients', signal:'Imani will test whether Bea can keep the existing client and skip its duplicate.'},
  {id:'undo', who:'Sam · founder', quote:'“I’d try it if I could take the whole import back.”', action:'Undo the last import', signal:'Dev will test whether Sam can restore the original list without support.'},
]
export const channels = [
  {id:'calls',label:'Customer calls',unit:'customer calls',single:'customer call',per:4,rate:'$50 per call'},
  {id:'newsletter',label:'Partner newsletter',unit:'placements',single:'placement',per:1,rate:'$200 per placement'},
  {id:'pilot',label:'Concierge onboarding',unit:'assisted imports',single:'assisted import',per:2,rate:'$100 per import'},
]
export function createInterviewWorkshop(): Workshop {
  return {version:1,experience:{version:1,kind:'customer-interviews'},title:'Design partner interviews · first client import',
    lanes:[{id:'interviews',label:'Customer interviews'},{id:'prototype',label:'Prototype to test',capacity:1}],
    presentationOrder:['prototype','interviews'],
    cards:interviews.map(({id,who,quote})=>({id,label:who+' · '+quote,laneId:id==='preview'?'prototype':'interviews'})),
    signals:interviews.map(({id,action,signal})=>({id:'test-'+id,label:action,cardId:id,laneId:'prototype',whenPresent:signal,whenAbsent:'Still in the interview notes.'}))}
}
export function createBudgetWorkshop(): Workshop {
  return {version:1,experience:{version:1,kind:'experiment-budget'},title:'Design partner pilot · $600 launch budget',
    lanes:[{id:'reserve',label:'Unallocated'}, ...channels.map(({id,label,rate})=>({id,label:label+' · '+rate}))],
    cards:['First','Second','Third'].map((label,i)=>({id:'fund-'+i,label:label+' $200',laneId:i===0?'calls':'reserve'})),
    presentationOrder:['calls','newsletter','pilot','reserve']}
}

/** Boards outside the versioned layouts stay editable with the ordinary lane renderer. */
export function startupExperienceKind(board: Workshop) {
  if (board.experience?.version !== 1 || board.kind || board.lanes.some(l=>l.station)) return
  const kind=board.experience.kind
  const laneIds=kind==='customer-interviews' ? ['interviews','prototype'] : ['reserve',...channels.map(c=>c.id)]
  if (board.lanes.length!==laneIds.length || !board.lanes.every(l=>laneIds.includes(l.id))) return
  if (kind==='customer-interviews' && (!board.cards.every(c=>interviews.some(q=>q.id===c.id)) ||
    board.cards.filter(c=>c.laneId==='prototype').length>1)) return
  return kind
}

export function planStartupMove(board:Workshop, cardId:string, destination:string): Workshop | null {
  const kind=startupExperienceKind(board)
  const card=board.cards.find(c=>c.id===cardId)
  if (!kind || !card || card.laneId===destination) return null
  let next=board
  if(kind==='customer-interviews') {
    if(destination!=='prototype') return null
    const previous=board.cards.find(c=>c.laneId===destination)
    if(previous) {
      if(!availableLanes(board,previous).some(l=>l.id==='interviews')) return null
      next=moveWorkshopCard(board,previous.id,'interviews')
    }
  }
  if(!availableLanes(next,card).some(l=>l.id===destination)) return null
  return moveWorkshopCard(next,cardId,destination)
}

export function workshopBudgetResult(board: Workshop, laneId: string) {
  if (startupExperienceKind(board)!=='experiment-budget') return null
  const channel=channels.find(c=>c.id===laneId)
  const cards=board.cards.filter(c=>c.laneId===laneId).length
  const quantity=cards*(channel?.per ?? 0)
  return {amount:cards*200, description:channel ? quantity+' '+(quantity===1?channel.single:channel.unit) : 'unallocated'}
}
