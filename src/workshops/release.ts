import type { Workshop, WorkshopCard } from './model'

/** Sum the effort scheduled in a release window. */
export function releaseLoad(board: Workshop, laneId: string): number {
  return board.cards.reduce((sum, card) => sum + (card.laneId === laneId ? card.points ?? 1 : 0), 0)
}

export function validateRelease(board: Workshop) {
  const byId = new Map(board.cards.map(card => [card.id, card]))
  const order = new Map(board.lanes.map((lane, i) => [lane.id, i]))
  const done = new Set<string>()
  const visiting = new Set<string>()
  function visit(card: WorkshopCard) {
    if (done.has(card.id)) return
    if (visiting.has(card.id)) throw new Error('Release dependencies must be acyclic.')
    visiting.add(card.id)
    for (const id of card.dependsOn ?? []) {
      const prerequisite = byId.get(id)
      if (!prerequisite) throw new Error('A release dependency refers to an unknown feature.')
      if (order.get(prerequisite.laneId)! > order.get(card.laneId)!) {
        throw new Error('Schedule each dependency in the same window as its feature or earlier.')
      }
      visit(prerequisite)
    }
    visiting.delete(card.id)
    done.add(card.id)
  }
  for (const card of board.cards) visit(card)
  for (const lane of board.lanes) {
    if (lane.station) throw new Error('Release windows cannot also be map stations.')
    if (releaseLoad(board, lane.id) > (lane.capacity ?? Infinity)) throw new Error(`Release "${lane.label}" exceeds its point budget.`)
  }
}

/**
 * A feature pulled forward brings its late prerequisites. A prerequisite
 * postponed pushes its early dependants back. A rule or budget violation
 * rejects the whole move, including all changes to connected cards.
 */
export function planReleaseMove(board: Workshop, feature: WorkshopCard, laneId: string): Workshop | null {
  if (laneId === feature.laneId) return board
  const order = new Map(board.lanes.map((lane, i) => [lane.id, i]))
  const target = order.get(laneId)
  if (target === undefined) return null
  const earlier = target < order.get(feature.laneId)!
  const moving = new Set([feature.id])
  const pending = [feature]
  while (pending.length) {
    const current = pending.pop()!
    for (const other of board.cards) {
      if (moving.has(other.id)) continue
      const position = order.get(other.laneId)!
      const needsMove = earlier
        ? position > target && current.dependsOn?.includes(other.id)
        : position < target && other.dependsOn?.includes(current.id)
      if (needsMove) { moving.add(other.id); pending.push(other) }
    }
  }
  const moved = board.cards.filter(card => moving.has(card.id))
  if (moved.some(card => card.allowedLaneIds && !card.allowedLaneIds.includes(laneId))) return null
  const next = { ...board, cards: board.cards.map(card => moving.has(card.id) ? { ...card, laneId } : card) }
  const capacity = board.lanes[target].capacity
  return capacity !== undefined && releaseLoad(next, laneId) > capacity ? null : next
}

/** The shipped example is regular versioned workshop data, editable before or after a run. */
export const releasePlan: Workshop = {
  version: 1, kind: 'release-plan', title: 'What makes the Friday release?',
  lanes: [{ id: 'friday', label: 'Friday release', capacity: 8 }, { id: 'next', label: 'Next week', capacity: 12 },
    { id: 'backlog', label: 'Unscheduled' }],
  cards: [
    { id: 'guardrails', label: 'Permission checks', laneId: 'next', points: 2 },
    { id: 'invite', label: 'Team invitations', laneId: 'backlog', points: 3, dependsOn: ['guardrails'] },
    { id: 'billing', label: 'Invoice download', laneId: 'friday', points: 3 },
    { id: 'export', label: 'Workspace export', laneId: 'next', points: 4 },
  ],
}
