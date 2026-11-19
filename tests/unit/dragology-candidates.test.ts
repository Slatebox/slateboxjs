import { describe, expect, it } from 'vitest'
import { dragologyCandidates } from '../../src/workshops/dragologyCandidates'
import {
  createInterviewWorkshop, industrialWorkshop, nightTransfer, validateWorkshop, workshopCandidate, workshopLayout,
  workshopPositions, type Workshop,
} from '../../src/workshops/model'

const twoLanes: Workshop = validateWorkshop({
  version: 1, title: 'What ships now?',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 1 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'now' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] },
  ],
})

const laneOf = (board: Workshop, cardId: string) => board.cards.find(card => card.id === cardId)!.laneId
/** A point well inside lane `index`'s column, in board coordinates. */
const inLane = (index: number, y = 240) => ({ x: index * workshopLayout.pitch + workshopLayout.pitch / 2, y })

describe('dragologyCandidates: the board spec evaluated without a renderer', () => {
  it('runs with no DOM renderer and picks the lane the pointer is in', () => {
    const choose = dragologyCandidates(twoLanes, 'alpha', { x: 20, y: 20 })!
    expect(typeof choose).toBe('function')
    const over = choose(inLane(1))
    expect(laneOf(over, 'alpha')).toBe('later')
    // The drop state is the very board the rule function returns.
    expect(over).toEqual(workshopCandidate(twoLanes, 'alpha', 'later'))
    expect(choose(inLane(0))).toBe(twoLanes)
    // Far from every lane the card stays where it is.
    expect(choose({ x: 2000, y: 240 })).toBe(twoLanes)
    expect(choose({ x: 360, y: 2000 })).toBe(twoLanes)
  })

  it('never offers a lane the rules close', () => {
    // Gamma may not leave Now: there is nothing to choose between.
    expect(dragologyCandidates(twoLanes, 'gamma', { x: 20, y: 20 })).toBeNull()
    const full = workshopCandidate(twoLanes, 'alpha', 'later')!
    expect(dragologyCandidates(full, 'beta', { x: 20, y: 20 })).toBeNull()
    // A card with somewhere else to go still cannot be pulled into the full lane.
    const pilot = workshopCandidate(industrialWorkshop, 'sensors', 'pilot')!
    const choose = dragologyCandidates(pilot, 'spares', { x: 20, y: 20 })!
    expect(choose(inLane(1, 200))).toBe(pilot)
    expect(laneOf(choose(inLane(2, 200)), 'spares')).toBe('evidence')
  })

  it('agrees with workshopCandidate across each lane of a lane board', () => {
    for (const board of [twoLanes, industrialWorkshop]) {
      for (const card of board.cards) {
        const choose = dragologyCandidates(board, card.id, { x: 30, y: 30 })
        board.lanes.forEach((lane, index) => {
          const rule = workshopCandidate(board, card.id, lane.id)
          for (const y of [20, 150, 300]) {
            const chosen = choose ? choose(inLane(index, y)) : board
            if (rule) expect(laneOf(chosen, card.id)).toBe(lane.id)
            else expect(chosen).toBe(board)
          }
        })
      }
    }
  })

  it('offers the interview swap and moves a map token only to a station it can reach', () => {
    const interviews = createInterviewWorkshop()
    const swap = dragologyCandidates(interviews, 'duplicate', { x: 20, y: 20 })!
    expect(swap(inLane(1)).cards.map(card => card.id + '@' + card.laneId)).toEqual(['preview@interviews', 'duplicate@prototype', 'undo@interviews'])

    const { points } = workshopPositions(nightTransfer)
    const choose = dragologyCandidates(nightTransfer, 'rider', { x: 20, y: 20 })!
    const at = (id: string) => {
      const p = points[nightTransfer.lanes.findIndex(lane => lane.id === id)]
      return { x: p.x + 40, y: p.y + workshopLayout.top + 20 }
    }
    expect(laneOf(choose(at('lift')), 'rider')).toBe('lift')
    expect(laneOf(choose(at('stairs')), 'rider')).toBe('stairs')
    // The shuttle is two hops away. Dragology's closest() cannot say "no": it
    // offers the nearest reachable station instead, which is why the native
    // controller checks the station under the pointer first.
    expect(laneOf(choose(at('shuttle')), 'rider')).not.toBe('shuttle')
  })
})
