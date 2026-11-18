export * from './listeningRoom'
import { planReleaseMove, releaseLoad, validateRelease } from './release'
export { releaseLoad, releasePlan } from './release'
import type { NodeJSON, SlateJSON } from '../core/Serialization'

export interface WorkshopLane {
  id: string
  label: string
  capacity?: number
  station?: { column: number; row: number; next: string[]; outcome: string }
}

export interface WorkshopCard {
  id: string
  label: string
  laneId: string
  allowedLaneIds?: string[]
  points?: number
  dependsOn?: string[]
}

export interface Workshop {
  version: 1
  kind?: 'release-plan'
  title: string
  lanes: WorkshopLane[]
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

function id(value: unknown): string {
  if (typeof value !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(value)) {
    throw new Error('IDs must be short alphanumeric slugs.')
  }
  return value
}

function unique(values: string[], what: string) {
  if (new Set(values).size !== values.length) throw new Error(`Duplicate ${what}.`)
}

// Treat agent output and stored drafts alike. Only declarative fields survive.
export function validateWorkshop(input: unknown): Workshop {
  const value = record(input)
  if (value.version !== 1) throw new Error('Unsupported workshop version.')
  if (value.kind !== undefined && value.kind !== 'release-plan') throw new Error('Unsupported workshop kind.')
  const release = value.kind === 'release-plan'
  const title = label(value.title, 120)
  if (!Array.isArray(value.lanes) || value.lanes.length < 2 || value.lanes.length > 5) {
    throw new Error('A workshop needs 2 to 5 lanes.')
  }
  if (!Array.isArray(value.cards) || value.cards.length < 1 || value.cards.length > 24) {
    throw new Error('A workshop needs 1 to 24 cards.')
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
        if (typeof n !== 'number' || !Number.isInteger(n) || n < 0 || n > 2) {
          throw new Error('Use map coordinates from 0 to 2.')
        }
        return n
      }
      if (!Array.isArray(point.next) || point.next.length > 4) throw new Error('A station needs a list of onward stops.')
      const next = point.next.map(id)
      unique(next, 'onward stop')
      lane.station = { column: coordinate(point.column), row: coordinate(point.row), next, outcome: label(point.outcome, 160) }
    }
    return lane
  })
  const laneIds = lanes.map(lane => lane.id)
  unique(laneIds, 'lane ID')
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
  if (release) {
    const plan: Workshop = { version: 1, kind: 'release-plan', title, lanes, cards }
    validateRelease(plan)
    return plan
  }
  for (const lane of lanes) {
    if (cards.filter(card => card.laneId === lane.id).length > (lane.capacity ?? Infinity)) {
      throw new Error(`Lane "${lane.label}" exceeds its capacity.`)
    }
  }
  return { version: 1, title, lanes, cards }
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

export function workshopPositions(board: Workshop) {
  const { pitch, row, top } = workshopLayout
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
  board.lanes.forEach((lane, column) => {
    const { x, y } = points[column]
    const label = board.kind === 'release-plan' ? lane.label + '\n' +
      (lane.capacity ? releaseLoad(board, lane.id) + ' / ' + lane.capacity + ' points' : releaseLoad(board, lane.id) + ' points') : lane.label
    node('lane-' + lane.id, label, x, y, top - 12, laneColors[column])
    board.cards.filter(card => card.laneId === lane.id).forEach((card, i) =>
      node('card-' + card.id, board.kind === 'release-plan' ? card.label + '\n' + card.points + ' points' : card.label, x, y + top + i * row, height, '#fffdf6'))
  })
  for (const lane of board.lanes) {
    if (!lane.station) continue
    const heading = nodes.find(n => n.options.id === 'lane-' + lane.id)!
    heading.relationships.associations = lane.station.next.map(key => ({ id: lane.id + '-to-' + key, parentId: heading.options.id, childId: 'lane-' + key, lineType: 'straight', lineColor: '#506b61', lineWidth: 2, showChildArrow: true }))
    heading.options.text = lane.label + '\n' + lane.station.outcome
    heading.options.fontSize = 13
  }
  if (board.kind === 'release-plan') {
    const byId = new Map(nodes.map(n => [n.options.id, n]))
    for (const card of board.cards) {
      for (const prerequisite of card.dependsOn ?? []) {
        const parentId = 'card-' + prerequisite, childId = 'card-' + card.id
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
