export * from './offlineHandoff'
export * from './listeningRoom'
import { planReleaseMove, releaseLoad, validateRelease } from './release'
export { releaseLoad, releasePlan } from './release'
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
  station?: { column: number; row: number; next: string[]; outcome: string; image?: StationImage }
}

export interface WorkshopCard {
  id: string
  label: string
  laneId: string
  allowedLaneIds?: string[]
  points?: number
  dependsOn?: string[]
  /** How the card is drawn when it differs from the board's: the look of the note it was made from. */
  look?: WorkshopCardLook
  /** What the note it was made from had that a card does not show, so it comes back as it was. */
  asNote?: WorkshopCardAsNote
  /** The id of the note it was made from, when the card could not take it: the note comes back under it. */
  noteId?: string
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
}

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
  kind?: 'release-plan'
  title: string
  lanes: WorkshopLane[]
  /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
  presentationOrder?: string[]
  signals?: WorkshopSignal[]
  cards: WorkshopCard[]
  /** The lines joined to its cards (see WorkshopLine). */
  lines?: WorkshopLine[]
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
  // A pinned end keeps its spot on the note's edge; a line's end is on a note, never free (a free end
  // has no note to travel with, so a note with one stays a note).
  for (const key of ['sourceAnchor', 'targetAnchor'] as const) {
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
 * the board's, and is left out (its card has left the board).
 */
function workshopLines(input: unknown, cardIds: Set<string>): WorkshopLine[] {
  if (!Array.isArray(input)) throw new Error('A workshop\'s lines are a list.')
  const lines = input.map(workshopLine).filter(line => cardIds.has(line.parentId) || cardIds.has(line.childId))
  unique(lines.map(line => line.id), 'line ID')
  if (lines.length > maxWorkshopLines) throw new Error(`A workshop holds up to ${maxWorkshopLines} lines.`)
  return lines
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

/** Describe each authored viewpoint from the committed state, including empty lanes. */
export function workshopPresentationScenes(board: Workshop): WorkshopPresentationScene[] {
  const outcomes = resolveWorkshopSignals(board)
  return workshopPresentationLanes(board).map(lane => {
    const cards = board.cards.filter(card => card.laneId === lane.id)
    const signals = outcomes.filter(signal => signal.laneId === lane.id)
    const nodeIds = [laneNodeId(lane.id)]
    if (lane.station?.image) nodeIds.push(imageNodeId(lane.id))
    return { lane, cards, signals, nodeIds: [...nodeIds, ...cards.map(card => cardNodeId(card.id))] }
  })
}

const maxWorkshopLanes = 5
export const maxWorkshopCards = 24
const mapGridSize = 3

// Treat agent output and stored drafts alike. Only declarative fields survive.
export function validateWorkshop(input: unknown): Workshop {
  const value = record(input)
  if (value.version !== 1) throw new Error('Unsupported workshop version.')
  if (value.kind !== undefined && value.kind !== 'release-plan') throw new Error('Unsupported workshop kind.')
  const release = value.kind === 'release-plan'
  const title = label(value.title, 120)
  if (!Array.isArray(value.lanes) || value.lanes.length < 2 || value.lanes.length > maxWorkshopLanes) {
    throw new Error('A workshop needs 2 to 5 lanes.')
  }
  if (!Array.isArray(value.cards) || value.cards.length > maxWorkshopCards) {
    throw new Error('A workshop supports up to 24 cards.')
  }

  const lanes: WorkshopLane[] = value.lanes.map(item => {
    const raw = record(item)
    const lane: WorkshopLane = { id: id(raw.id), label: label(raw.label) }
    if (raw.capacity !== undefined) {
      const limit = release ? 576 : 24
      if (typeof raw.capacity !== 'number' || !Number.isInteger(raw.capacity) || raw.capacity < 1 || raw.capacity > limit) {
        throw new Error(`Lane capacity must be a whole number from 1 to ${limit}.`)
      }
      lane.capacity = raw.capacity
    }
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
  if ((release || lanes.some(lane => lane.station)) && !value.cards.length) {
    throw new Error('Maps and release plans need at least one card.')
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
    // A card may be empty, as a note may: an empty note dropped on a lane is an empty card.
    const card: WorkshopCard = { id: id(raw.id), label: cardLabel(raw.label), laneId: id(raw.laneId) }
    if (!laneIds.includes(card.laneId)) throw new Error('Card refers to an unknown lane.')
    if (raw.allowedLaneIds !== undefined) {
      if (!Array.isArray(raw.allowedLaneIds) || raw.allowedLaneIds.length > lanes.length) throw new Error('Invalid allowed lanes.')
      card.allowedLaneIds = raw.allowedLaneIds.map(id)
      unique(card.allowedLaneIds, 'allowed lane')
      if (!card.allowedLaneIds.includes(card.laneId) || !card.allowedLaneIds.every(key => laneIds.includes(key))) {
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
  if (value.lines !== undefined) {
    const lines = workshopLines(value.lines, new Set(cards.map(card => card.id)))
    if (lines.length) board.lines = lines
  }
  if (value.presentationOrder !== undefined) {
    if (!Array.isArray(value.presentationOrder)) throw new Error('Presentation order must be a list of lane IDs.')
    board.presentationOrder = workshopPresentationLanes({ lanes, presentationOrder: value.presentationOrder }).map(lane => lane.id)
  }
  if (release) {
    board.kind = 'release-plan'
    validateRelease(board)
    return board
  }
  for (const lane of lanes) {
    if (cards.filter(card => card.laneId === lane.id).length > (lane.capacity ?? Infinity)) {
      throw new Error(`Lane "${lane.label}" exceeds its capacity.`)
    }
  }
  return board
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

export function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[] {
  if (board.kind === 'release-plan') return board.lanes.filter(lane => planReleaseMove(board, card, lane.id) !== null)
  const station = board.lanes.find(lane => lane.id === card.laneId)?.station
  return board.lanes.filter(lane =>
    lane.id === card.laneId || ((!station || station.next.includes(lane.id)) && (!card.allowedLaneIds || card.allowedLaneIds.includes(lane.id)) &&
      board.cards.filter(other => other.laneId === lane.id).length < (lane.capacity ?? Infinity)))
}

export function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop {
  const card = board.cards.find(item => item.id === cardId)
  if (card && board.kind === 'release-plan') {
    const candidate = planReleaseMove(board, card, laneId)
    if (!candidate) throw new Error('Move is unavailable.')
    return candidate
  }
  if (!card || !availableLanes(board, card).some(lane => lane.id === laneId)) throw new Error('Move is unavailable.')
  if (card.laneId === laneId) return board
  return { ...board, cards: board.cards.map(item => item === card ? { ...card, laneId } : item) }
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
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
  if (card.laneId === laneId) return board
  if (board.kind === 'release-plan') return planReleaseMove(board, card, laneId)
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
  if (workshopCandidate(board, cardId, laneId) !== null) return null
  const card = board.cards.find(item => item.id === cardId)
  const lane = board.lanes.find(item => item.id === laneId)
  if (!card || !lane) return 'That move is not available.'
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
  if (source?.station && !source.station.next.includes(laneId)) return `${lane.label} can't be reached from ${source.label}.`
  const held = board.cards.filter(item => item.laneId === laneId).length
  if (lane.capacity !== undefined && held >= lane.capacity) {
    return `It already holds ${held} of ${lane.capacity} ${lane.capacity === 1 ? 'card' : 'cards'}.`
  }
  return cannot
}

/**
 * Whether ordinary notes and this board's cards are the same thing: a board of plain lanes.
 * A map's token, a release plan's features (they need points) and a startup experience's
 * cards are pieces of their own and are not made from notes.
 */
export function workshopTakesNotes(board: Workshop): boolean {
  return !board.kind && !board.lanes.some(lane => lane.station) && !startupExperienceKind(board)
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
  if (board.lanes.some(item => item.station)) return 'A map\'s stations hold its token only.'
  if (board.kind === 'release-plan') return 'A release plan\'s features need effort points, so a note can\'t become one.'
  if (startupExperienceKind(board)) return 'This workshop keeps the cards it came with.'
  // A note becomes a card whatever its words, look, shape or lines: empty, long (the card shows
  // the first 80 characters and keeps the rest for the note), or styled in a way a card does not draw.
  // Only words a card could not show as plain text (markup) keep it a note.
  if (board.cards.length >= maxWorkshopCards) return `This board is at its size limit of ${maxWorkshopCards} cards. Remove a card to make room.`
  const held = board.cards.filter(item => item.laneId === laneId).length
  if (lane.capacity !== undefined && held >= lane.capacity) return `It already holds ${held} of ${lane.capacity} ${lane.capacity === 1 ? 'card' : 'cards'}.`
  if (note.lines !== undefined) {
    const lines = offeredLines(note.lines)
    if (!lines) return 'A line of this note can\'t be joined to a card.'
    const ids = new Set((board.lines ?? []).map(line => line.id))
    if ((board.lines?.length ?? 0) + lines.filter(line => !ids.has(line.id)).length > maxWorkshopLines) {
      return `A workshop holds up to ${maxWorkshopLines} lines.`
    }
  }
  return null
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
      try { const { id: lineId, parentId, childId } = record(raw); line = workshopLine({ id: lineId, parentId, childId }) } catch { line = null }
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
  const look = keptLook(note.look)
  const words = typeof note.label === 'string' ? oneLine(note.label) : ''
  let asNote = keptAsNote(note.asNote)
  // Words longer than a card shows are kept for the note.
  if (words.length > 80 && asNote?.text === undefined && words.length <= 4000) asNote = { ...asNote, text: words }
  const cardId = cardIdFor(board, note.id)
  // A card that could not take the note's id remembers it, so the note comes back under it.
  const noteId = cardId !== note.id && typeof note.id === 'string' && notePattern.test(note.id) ? note.id : undefined
  const card: WorkshopCard = { id: cardId, label: workshopCardLabelOf(words), laneId,
    ...(look ? { look } : {}), ...(asNote ? { asNote } : {}), ...(noteId ? { noteId } : {}) }
  const at = before === undefined ? -1 : board.cards.findIndex(item => item.id === before && item.laneId === laneId)
  const cards = at < 0 ? [...board.cards, card] : [...board.cards.slice(0, at), card, ...board.cards.slice(at)]
  // The note's lines stay joined to it: to the card, under the card's id.
  const lines = note.lines === undefined ? undefined
    : withLines(board, offeredLines(note.lines)!.map(line => renamedLine(line, note.id, card.id)))
  return validateWorkshop({ ...board, cards, ...(lines ? { lines } : {}) })
}

/** Why the card may not leave the lanes as an ordinary note; null when it may. */
export function workshopCardAsNoteRefusal(board: Workshop, cardId: string): string | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card) return 'That card is no longer on the board.'
  if (!workshopTakesNotes(board)) return board.lanes.some(lane => lane.station) ? 'The token stays on the map.' : 'This card stays on the board.'
  if ((board.signals ?? []).some(signal => signal.cardId === cardId)) return `An outcome on this board depends on ${card.label}, so it stays a card.`
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
  const lines = board.lines?.map(line => renamedLine(line, cardId, noteId))
  return validateWorkshop({ ...board, cards: board.cards.filter(item => item.id !== cardId), ...(lines ? { lines } : {}) })
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
  let drawn: WorkshopLine
  try { drawn = workshopLine(line) } catch (error) { return error instanceof Error ? error.message : 'That line can\'t be drawn.' }
  const cards = new Set(board.cards.map(card => card.id))
  if (!cards.has(drawn.parentId) && !cards.has(drawn.childId)) return 'That card is no longer on the board.'
  if (board.lanes.some(lane => lane.id === drawn.parentId || lane.id === drawn.childId)) return 'A line joins notes and cards, not lanes.'
  const known = (board.lines ?? []).some(item => item.id === drawn.id)
  if (!known && (board.lines?.length ?? 0) >= maxWorkshopLines) return `A workshop holds up to ${maxWorkshopLines} lines.`
  return null
}

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

/** The second line under a lane's name: how full it is, or what its cards add up to. */
export function workshopLaneCaption(board: Workshop, laneId: string): string {
  const lane = board.lanes.find(item => item.id === laneId)
  if (!lane) return ''
  if (board.kind === 'release-plan') {
    const used = releaseLoad(board, laneId)
    return lane.capacity ? used + ' / ' + lane.capacity + ' points' : used + ' points'
  }
  const budget = workshopBudgetResult(board, laneId)
  if (budget) return '$' + budget.amount + ' · ' + budget.description
  const count = board.cards.filter(card => card.laneId === laneId).length
  return lane.capacity !== undefined ? count + ' of ' + lane.capacity : count + (count === 1 ? ' card' : ' cards')
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

function nextWorkshopId(board: Workshop, prefix: string): string {
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
}

const captionNodeId = (id: string) => 'caption-' + id
const columnNodeId = (id: string) => 'column-' + id

/** The names of the notes workshopToSlate draws for a lane or a card. */
export const workshopNodeIds = { lane: laneNodeId, card: cardNodeId, image: imageNodeId, caption: captionNodeId, column: columnNodeId }

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

function roundedBox(width: number, height: number, radius: number) {
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
    note({ id: captionNodeId(lane.id), text: workshopLaneCaption(board, lane.id), name: lane.label, xPos: x + 8, yPos: y + 66, width, height: 30,
      backgroundColor: 'transparent', borderWidth: 0, fontSize: captionSize })
    if (image) {
      nodes.push({ options: { id: imageNodeId(lane.id), name: image.alt, text: '', xPos: x + 8, yPos: y + top, width, height: stationImageHeight,
        shapeHint: 'rectangle', image: image.src, borderWidth: 0 }, relationships: { associations: [] } })
    }
    board.cards.filter(card => card.laneId === lane.id).forEach((card, i) => {
      const text = board.kind === 'release-plan' ? card.label + '\n' + card.points + ' points' : card.label
      const cardWidth = map ? width - 20 : width, cardHeight = map ? height - 6 : height
      // A card is drawn as the slate draws an ordinary note (a map's token is a playing piece of
      // its own). A card made from a note keeps that note's look.
      const look = map ? {} : { ...style.card, ...card.look }
      const corner = map ? radius : style.card?.cornerRadius ?? radius
      note({ id: cardNodeId(card.id), text, name: card.label,
        xPos: x + (map ? 18 : 8), yPos: y + top + (image ? stationImageSpace : 0) + i * row, width: cardWidth, height: cardHeight,
        ...(corner !== radius ? { vectorPath: roundedBox(cardWidth, cardHeight, corner) } : {}),
        backgroundColor: map ? '#ffda75' : look.backgroundColor ?? style.backgroundColor ?? DEFAULT_NOTE_STYLE.backgroundColor,
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
 * Draw a workshop as slate notes. With no options this is the presentation artwork
 * the app and its snapshots already consume; `{ native: true }` is the artwork
 * attachWorkshop keeps on a live slate.
 */
export function workshopToSlate(input: Workshop, options?: WorkshopArtworkOptions): SlateJSON {
  const board = validateWorkshop(input)
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
      node(cardNodeId(card.id), board.kind === 'release-plan' ? card.label + '\n' + card.points + ' points' : card.label, x, y + top + (image ? imageSpace : 0) + i * row, height, '#fffdf6'))
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
  return { options: { name: board.title }, shareId: '', nodes }
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
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop, type WorkshopCandidateChooser, type WorkshopChangeEvent, type WorkshopRefusalEvent, type WorkshopSelection } from './native'


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
