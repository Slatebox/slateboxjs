/**
 * Seeded random workshop models for property tests. Every board returned has
 * passed validateWorkshop, so it is a board a host could really hold.
 *
 * Only the model's long-standing exports are used here, so the same generator can
 * be run against an older checkout to record what that checkout produced.
 */
import { validateWorkshop, type Workshop, type WorkshopCard, type WorkshopLane } from '../../../src/workshops/model'

export type Random = () => number

/** mulberry32: small, fast and the same on every machine. */
export function seeded(seed: number): Random {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const int = (r: Random, min: number, max: number) => min + Math.floor(r() * (max - min + 1))
const chance = (r: Random, p: number) => r() < p
const pick = <T>(r: Random, list: readonly T[]) => list[Math.floor(r() * list.length)]

const words = [
  'Alpha', 'Beta', 'Now', 'Later', 'Fund this quarter', 'Gather evidence', 'Q3 & Q4', 'R&D "pilot"', "Ops' queue",
  'Überprüfung', 'مراجعة الطلب', 'בדיקה', '検証する', 'Émile · naïve café', '$200 · 1 placement', 'a/b\\c', '100% {done} [x]',
  'A much longer label that keeps going well past what fits on a single line of a note', 'x',
]
const text = (r: Random) => {
  const label = pick(r, words) + (chance(r, 0.5) ? ' ' + int(r, 1, 99) : '')
  return label.slice(0, 80)
}

function subsetWith(r: Random, all: string[], must: string): string[] {
  const chosen = all.filter(id => id === must || chance(r, 0.5))
  // Model order is not required; shuffle now and then.
  return chance(r, 0.3) ? chosen.reverse() : chosen
}

function laneBoard(r: Random, lanes: WorkshopLane[], cardIds: string[], options: { experience?: Workshop['experience'] } = {}): unknown {
  const laneIds = lanes.map(lane => lane.id)
  const cards: WorkshopCard[] = cardIds.map(id => {
    const laneId = pick(r, laneIds)
    const card: WorkshopCard = { id, label: text(r), laneId }
    if (chance(r, 0.3)) card.allowedLaneIds = subsetWith(r, laneIds, laneId)
    return card
  })
  for (const lane of lanes) {
    const held = cards.filter(card => card.laneId === lane.id).length
    if (chance(r, 0.45)) lane.capacity = Math.min(24, Math.max(1, held + int(r, 0, 2)))
  }
  const board: Record<string, unknown> = { version: 1, title: text(r), lanes, cards }
  if (options.experience) board.experience = options.experience
  if (cards.length && chance(r, 0.3)) {
    board.signals = Array.from({ length: int(r, 1, 3) }, (_, i) => ({
      id: 'signal-' + i, label: text(r), cardId: pick(r, cards).id, laneId: pick(r, laneIds),
      whenPresent: text(r), whenAbsent: text(r),
    }))
  }
  if (chance(r, 0.2)) board.presentationOrder = laneIds.slice().reverse()
  return board
}

function ordinary(r: Random): unknown {
  const lanes = Array.from({ length: int(r, 2, 5) }, (_, i) => ({ id: 'l' + i, label: text(r) }))
  const count = chance(r, 0.1) ? 24 : int(r, 0, 9)
  return laneBoard(r, lanes, Array.from({ length: count }, (_, i) => 'c' + i),
    chance(r, 0.12) ? { experience: { version: 1, kind: pick(r, ['customer-interviews', 'experiment-budget'] as const) } } : {})
}

function budget(r: Random): unknown {
  const lanes = ['reserve', 'calls', 'newsletter', 'pilot'].map(id => ({ id, label: text(r) }))
  return laneBoard(r, lanes, Array.from({ length: int(r, 0, 8) }, (_, i) => 'fund-' + i),
    { experience: { version: 1, kind: 'experiment-budget' } })
}

function interview(r: Random): unknown {
  const lanes: WorkshopLane[] = [{ id: 'interviews', label: text(r) }, { id: 'prototype', label: text(r) }]
  if (chance(r, 0.25)) lanes.reverse()
  const ids = ['preview', 'duplicate', 'undo'].filter(() => chance(r, 0.8))
  const board = laneBoard(r, lanes, ids, { experience: { version: 1, kind: 'customer-interviews' } }) as { lanes: WorkshopLane[]; cards: WorkshopCard[] }
  // Usually the shipped shape: at most one interview in a one-place prototype.
  if (chance(r, 0.7)) {
    let seen = false
    for (const card of board.cards) {
      if (card.laneId !== 'prototype') continue
      if (seen) { card.laneId = 'interviews'; if (card.allowedLaneIds && !card.allowedLaneIds.includes('interviews')) card.allowedLaneIds.push('interviews') }
      seen = true
    }
    board.lanes.find(lane => lane.id === 'prototype')!.capacity = 1
    const interviews = board.lanes.find(lane => lane.id === 'interviews')!
    if (interviews.capacity !== undefined) interviews.capacity = Math.max(interviews.capacity, board.cards.filter(card => card.laneId === 'interviews').length)
  }
  return board
}

function release(r: Random): unknown {
  const lanes: WorkshopLane[] = Array.from({ length: int(r, 2, 5) }, (_, i) => ({ id: 'w' + i, label: text(r) }))
  const cards: WorkshopCard[] = []
  const count = int(r, 1, 10)
  for (let i = 0; i < count; i++) {
    const lane = int(r, 0, lanes.length - 1)
    const card: WorkshopCard = { id: 'f' + i, label: text(r), laneId: lanes[lane].id, points: int(r, 1, 8) }
    // Only depend on features scheduled in the same window or earlier (and created earlier, so no cycles).
    const earlier = cards.filter(other => lanes.findIndex(item => item.id === other.laneId) <= lane)
    const dependsOn = earlier.filter(() => chance(r, 0.3)).map(other => other.id)
    if (dependsOn.length) card.dependsOn = dependsOn
    if (chance(r, 0.2)) card.allowedLaneIds = subsetWith(r, lanes.map(item => item.id), card.laneId)
    cards.push(card)
  }
  for (const lane of lanes) {
    const load = cards.reduce((sum, card) => sum + (card.laneId === lane.id ? card.points! : 0), 0)
    if (chance(r, 0.6)) lane.capacity = Math.max(1, load + int(r, 0, 9))
  }
  return { version: 1, kind: 'release-plan', title: text(r), lanes, cards }
}

function map(r: Random): unknown {
  const places = [0, 1, 2].flatMap(row => [0, 1, 2].map(column => ({ column, row })))
  for (let i = places.length - 1; i > 0; i--) { const j = int(r, 0, i); [places[i], places[j]] = [places[j], places[i]] }
  const count = int(r, 2, 5)
  const ids = Array.from({ length: count }, (_, i) => 's' + i)
  const lanes: WorkshopLane[] = ids.map((id, i) => ({
    id, label: text(r),
    station: {
      ...places[i], next: ids.filter(other => other !== id && chance(r, 0.4)).slice(0, 4), outcome: text(r),
      ...(chance(r, 0.15) ? { image: { src: 'https://images.example.com/station-' + i + '.png', alt: text(r) } } : {}),
    },
  }))
  return laneBoard(r, lanes, Array.from({ length: int(r, 1, 4) }, (_, i) => 't' + i))
}

const kinds = [ordinary, ordinary, budget, interview, release, release, map, map]

/** One valid random board. `index` only varies the mix, so a seed gives the same series everywhere. */
export function randomWorkshop(r: Random): Workshop {
  for (let attempt = 0; attempt < 200; attempt++) {
    try {
      return validateWorkshop(pick(r, kinds)(r))
    } catch {
      // Not every draw is a legal board (a station cannot be its own onward stop, and so on); draw again.
    }
  }
  throw new Error('Could not draw a valid workshop.')
}

export function randomWorkshops(seed: number, count: number): Workshop[] {
  const r = seeded(seed)
  return Array.from({ length: count }, () => randomWorkshop(r))
}

// ─── Business boards (launch plan, pipeline, budget) ───────────────────────────────
// Separate from the mix above, so the series recorded against older checkouts is unchanged.

function launchPlan(r: Random): unknown {
  const lanes = Array.from({ length: int(r, 2, 4) }, (_, i) => ({ id: 'team' + i, label: text(r) }))
  const cards: WorkshopCard[] = []
  for (let i = 0; i < int(r, 1, 12); i++) {
    const card: WorkshopCard = { id: 'task' + i, label: text(r), laneId: pick(r, lanes).id, duration: int(r, 1, 12) }
    if (chance(r, 0.3)) card.lag = int(r, 1, 5)
    // Waiting only on tasks made earlier keeps the graph acyclic.
    const before = cards.filter(() => chance(r, 0.25)).slice(0, 3).map(other => other.id)
    if (before.length) card.dependsOn = before
    cards.push(card)
  }
  const draft = { version: 1, kind: 'launch-plan', title: text(r), launch: { day: 120 }, lanes, cards } as Workshop
  // Launch on the finish day, or a little after it (so some plans are tight and some have room).
  const finish = Math.max(...cards.map(function end(card): number {
    const ready = Math.max(0, ...(card.dependsOn ?? []).map(id => end(cards.find(other => other.id === id)!)))
    return ready + (card.lag ?? 0) + card.duration!
  }))
  draft.launch = { day: Math.min(120, Math.max(5, finish + (chance(r, 0.4) ? 0 : int(r, 1, 10)))) }
  return draft
}

function pipelineBoard(r: Random): unknown {
  const open = Array.from({ length: int(r, 2, 3) }, (_, i) => ({ id: 'stage' + i, label: text(r), probability: Math.round(r() * 100) / 100 }))
  const lanes: WorkshopLane[] = [...open, { id: 'won', label: 'Won', role: 'won' }]
  if (chance(r, 0.8)) lanes.push({ id: 'lost', label: 'Lost', role: 'lost' })
  const cards: WorkshopCard[] = Array.from({ length: int(r, 0, 16) }, (_, i) => {
    const card: WorkshopCard = { id: 'deal' + i, label: text(r), laneId: pick(r, lanes).id }
    if (card.laneId === 'won' || chance(r, 0.8)) card.amount = int(r, 1, 200) * 1000
    return card
  })
  for (const lane of open) {
    const held = cards.filter(card => card.laneId === lane.id).length
    if (chance(r, 0.4)) lane.capacity = Math.max(1, held + int(r, 0, 1))
  }
  return { version: 1, kind: 'pipeline', title: text(r), forecast: { target: int(r, 50, 900) * 1000, currency: pick(r, ['$', '€', '£']) }, lanes, cards }
}

function budgetBoard(r: Random): unknown {
  const step = pick(r, [1000, 5000, 10000])
  const lanes: WorkshopLane[] = Array.from({ length: int(r, 2, 5) }, (_, i) => ({ id: 'dept' + i, label: text(r), allocation: int(r, 5, 60) * step }))
  const cards: WorkshopCard[] = []
  for (let i = 0; i < int(r, 0, 16); i++) {
    const lane = pick(r, lanes)
    const left = lane.allocation! - cards.reduce((sum, card) => sum + (card.laneId === lane.id ? card.amount! : 0), 0)
    if (left < step) continue
    cards.push({ id: 'item' + i, label: text(r), laneId: lane.id, amount: int(r, 1, Math.floor(left / step)) * step })
  }
  for (const lane of lanes) {
    const committed = cards.reduce((sum, card) => sum + (card.laneId === lane.id ? card.amount! : 0), 0)
    if (chance(r, 0.3)) lane.floor = Math.min(lane.allocation!, committed + int(r, 0, 3) * step)
    if (chance(r, 0.3)) lane.cap = lane.allocation! + int(r, 0, 10) * step
  }
  const total = lanes.reduce((sum, lane) => sum + lane.allocation!, 0)
  return { version: 1, kind: 'budget', title: text(r), budget: { total, currency: pick(r, ['$', '€']), step }, lanes, cards }
}

const businessDraws = { 'launch-plan': launchPlan, pipeline: pipelineBoard, budget: budgetBoard }

/** `count` valid random boards of one business kind. */
export function randomBusinessBoards(seed: number, count: number, kind: keyof typeof businessDraws): Workshop[] {
  const r = seeded(seed)
  return Array.from({ length: count }, () => {
    for (let attempt = 0; attempt < 200; attempt++) {
      try { return validateWorkshop(businessDraws[kind](r)) } catch { /* draw again */ }
    }
    throw new Error('Could not draw a valid ' + kind + '.')
  })
}
