export * from './offlineHandoff'
export * from './listeningRoom'
import { planReleaseMove, releaseLoad, validateRelease } from './release'
export { releaseLoad, releasePlan } from './release'
import type { NodeJSON, SlateJSON } from '../core/Serialization'

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
}

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
  version: 1
  kind?: 'release-plan'
  title: string
  lanes: WorkshopLane[]
  /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
  presentationOrder?: string[]
  signals?: WorkshopSignal[]
  cards: WorkshopCard[]
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
    const card: WorkshopCard = { id: id(raw.id), label: label(raw.label), laneId: id(raw.laneId) }
    if (!laneIds.includes(card.laneId)) throw new Error('Card refers to an unknown lane.')
    if (raw.allowedLaneIds !== undefined) {
      if (!Array.isArray(raw.allowedLaneIds) || raw.allowedLaneIds.length > lanes.length) throw new Error('Invalid allowed lanes.')
      card.allowedLaneIds = raw.allowedLaneIds.map(id)
      unique(card.allowedLaneIds, 'allowed lane')
      if (!card.allowedLaneIds.includes(card.laneId) || !card.allowedLaneIds.every(key => laneIds.includes(key))) {
        throw new Error('Allowed lanes must exist and include the starting lane.')
      }
    }
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

export const workshopLayout = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }
export const laneColors = ['#d5e9e3', '#fbdfac', '#dedef4', '#dcebf3', '#efd7dc']

export function workshopPositions(board: Workshop, layout = workshopLayout) {
  const { pitch, row, top } = layout
  const map = Boolean(board.lanes[0].station)
  const rows = board.lanes.map(lane => board.cards.filter(card => card.laneId === lane.id).length)
  const rowHeight = top + Math.max(1, ...rows) * row + 36
  const points = board.lanes.map((lane, index) => ({
    x: map ? lane.station!.column * (pitch + 28) : index * pitch,
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

export function workshopToSlate(input: Workshop): SlateJSON {
  const board = validateWorkshop(input)
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
