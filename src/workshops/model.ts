import type { NodeJSON, SlateJSON } from '../core/Serialization'

export interface WorkshopLane {
  id: string
  label: string
  capacity?: number
}

export interface WorkshopCard {
  id: string
  label: string
  laneId: string
  allowedLaneIds?: string[]
}

export interface Workshop {
  version: 1
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
      if (typeof raw.capacity !== 'number' || !Number.isInteger(raw.capacity) || raw.capacity < 1 || raw.capacity > 24) {
        throw new Error('Lane capacity must be a whole number from 1 to 24.')
      }
      lane.capacity = raw.capacity
    }
    return lane
  })
  const laneIds = lanes.map(lane => lane.id)
  unique(laneIds, 'lane ID')
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
    return card
  })
  unique(cards.map(card => card.id), 'card ID')
  for (const lane of lanes) {
    if (cards.filter(card => card.laneId === lane.id).length > (lane.capacity ?? Infinity)) {
      throw new Error(`Lane "${lane.label}" exceeds its capacity.`)
    }
  }
  return { version: 1, title, lanes, cards }
}

export function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[] {
  return board.lanes.filter(lane =>
    lane.id === card.laneId || ((!card.allowedLaneIds || card.allowedLaneIds.includes(lane.id)) &&
      board.cards.filter(other => other.laneId === lane.id).length < (lane.capacity ?? Infinity)))
}

export function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !availableLanes(board, card).some(lane => lane.id === laneId)) throw new Error('Move is unavailable.')
  if (card.laneId === laneId) return board
  return { ...board, cards: board.cards.map(item => item === card ? { ...card, laneId } : item) }
}

export const workshopLayout = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }
export const laneColors = ['#d5e9e3', '#fbdfac', '#dedef4', '#dcebf3', '#efd7dc']

export function workshopToSlate(input: Workshop): SlateJSON {
  const board = validateWorkshop(input)
  const { pitch, width, row, height, top } = workshopLayout
  const nodes: NodeJSON[] = []
  function node(key: string, text: string, x: number, y: number, h: number, fill: string) {
    nodes.push({ options: { id: key, text, name: text, xPos: x, yPos: y, width, height: h,
      shapeHint: 'rectangle', backgroundColor: fill, foregroundColor: '#18302d', fontSize: 18,
      borderColor: '#667872', borderWidth: 1 }, relationships: { associations: [] } })
  }
  board.lanes.forEach((lane, column) => {
    node('lane-' + lane.id, lane.label, column * pitch, 0, top - 12, laneColors[column])
    board.cards.filter(card => card.laneId === lane.id).forEach((card, i) =>
      node('card-' + card.id, card.label, column * pitch, top + i * row, height, '#fffdf6'))
  })
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
