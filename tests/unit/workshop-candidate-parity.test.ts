import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import recorded from '../fixtures/native/workshop-to-slate.random-main-64115d9.json'
import {
  availableLanes, moveWorkshopCard, planStartupMove, startupExperienceKind, validateWorkshop, workshopCandidate,
  workshopDestinations, workshopLaneCaption, workshopRefusal, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { planReleaseMove } from '../../src/workshops/release'
import { workshopDragSpec } from '../../src/workshops/boardDrawing'
import { randomWorkshops } from './helpers/randomWorkshops'

/**
 * workshopCandidate replaced three separate questions the boards used to ask:
 * availableLanes + moveWorkshopCard (lane boards and maps), planReleaseMove
 * (release plans) and planStartupMove (the interview and budget experiences).
 * These tests hold it to those functions on thousands of random valid boards.
 */

const boards = randomWorkshops(20261119, 2400)

/** What the lane board asked before workshopCandidate existed. */
function laneRule(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)!
  return availableLanes(board, card).some(lane => lane.id === laneId) ? moveWorkshopCard(board, cardId, laneId) : null
}

function kindOf(board: Workshop) {
  if (board.kind === 'release-plan') return 'release'
  if (board.lanes[0].station) return 'map'
  return startupExperienceKind(board) ?? 'lanes'
}

describe('workshopCandidate on random valid boards', () => {
  it('draws every kind of board, with capacities, allowed lanes, signals, dependencies and full lanes', () => {
    const seen = new Map<string, number>()
    for (const board of boards) seen.set(kindOf(board), (seen.get(kindOf(board)) ?? 0) + 1)
    for (const kind of ['lanes', 'map', 'release', 'customer-interviews', 'experiment-budget']) {
      expect(seen.get(kind) ?? 0, kind).toBeGreaterThan(150)
    }
    expect(boards.filter(board => board.cards.some(card => card.dependsOn?.length)).length).toBeGreaterThan(200)
    expect(boards.filter(board => board.signals?.length).length).toBeGreaterThan(200)
    expect(boards.filter(board => board.cards.length === 24).length).toBeGreaterThan(20)
    expect(boards.filter(board => board.lanes.some(lane => lane.capacity !== undefined &&
      board.cards.filter(card => card.laneId === lane.id).length >= lane.capacity)).length).toBeGreaterThan(200)
  })

  it('agrees with the function each board used before, on every card and lane', () => {
    let moves = 0, allowed = 0, refused = 0
    for (const board of boards) {
      const kind = kindOf(board)
      for (const card of board.cards) {
        for (const lane of board.lanes) {
          moves++
          const actual = workshopCandidate(board, card.id, lane.id)
          const context = JSON.stringify({ kind, card: card.id, lane: lane.id, board })
          if (card.laneId === lane.id) {
            // Already there: the board itself, for every kind.
            expect(actual, context).toBe(board)
            continue
          }
          if (kind === 'release') {
            expect(actual, context).toEqual(planReleaseMove(board, card, lane.id))
          } else if (kind === 'customer-interviews' || kind === 'experiment-budget') {
            // The experience's own rule first. Its word on the prototype is final (one
            // interview at a time); everywhere else the lane rules it is built from decide.
            const startup = planStartupMove(board, card.id, lane.id)
            const expected = kind === 'customer-interviews' && lane.id === 'prototype' ? startup : startup ?? laneRule(board, card.id, lane.id)
            expect(actual, context).toEqual(expected)
            // A move never leaves the board outside its experience.
            if (actual) expect(startupExperienceKind(actual), context).toBe(kind)
          } else {
            expect(actual, context).toEqual(laneRule(board, card.id, lane.id))
          }
          if (actual) allowed++
          else refused++
        }
      }
    }
    expect(moves).toBeGreaterThan(20000)
    expect(allowed).toBeGreaterThan(3000)
    expect(refused).toBeGreaterThan(3000)
  })

  it('leaves the SVG lane board choosing among exactly the boards moveWorkshopCard gave it', () => {
    // The spec the React board hands Dragology (boardDrawing.tsx), with a builder that just collects its candidates.
    const d: any = {
      dropTarget: (_id: string, state: Workshop) => state,
      closest: (list: Workshop[]) => ({ withFloating: () => list, whenFar: () => ({ withFloating: () => list }) }),
    }
    let differs = 0
    for (const board of boards) {
      if (board.kind === 'release-plan') continue
      for (const card of board.cards) {
        const lanes = availableLanes(board, card)
        const offered = workshopDragSpec(d, board, card, lanes) as unknown as Workshop[]
        expect(offered).toEqual(lanes.map(lane => moveWorkshopCard(board, card.id, lane.id)))
        // The one place the experience rule and the lane rule part ways: an occupied
        // prototype with room to spare (the lane board stacks, the experience swaps).
        for (const lane of lanes) if (JSON.stringify(workshopCandidate(board, card.id, lane.id)) !== JSON.stringify(moveWorkshopCard(board, card.id, lane.id))) differs++
      }
    }
    expect(differs).toBeGreaterThan(0)
  })

  it('answers the interview and budget boards exactly as planStartupMove does, wherever those boards can ask', () => {
    // StartupWorkshopBoard asks about the prototype (interviews) or any channel and the reserve (budget).
    let asked = 0
    for (const board of boards) {
      const kind = startupExperienceKind(board)
      if (!kind) continue
      for (const card of board.cards) {
        for (const lane of board.lanes) {
          if (kind === 'customer-interviews' && lane.id !== 'prototype') continue
          asked++
          const next = workshopCandidate(board, card.id, lane.id)
          expect(next === board ? null : next, JSON.stringify({ card: card.id, lane: lane.id, board })).toEqual(planStartupMove(board, card.id, lane.id))
        }
      }
    }
    expect(asked).toBeGreaterThan(1000)
  })

  it('never proposes a board the model would reject, and never mutates the board it was asked about', () => {
    for (const board of boards) {
      const before = JSON.stringify(board)
      for (const card of board.cards) {
        for (const lane of board.lanes) {
          const next = workshopCandidate(board, card.id, lane.id)
          if (!next) continue
          expect(() => validateWorkshop(next), JSON.stringify({ card: card.id, lane: lane.id, board })).not.toThrow()
          expect(next.cards.find(item => item.id === card.id)!.laneId).toBe(lane.id)
          expect(next.cards.map(item => item.id)).toEqual(board.cards.map(item => item.id))
        }
      }
      expect(JSON.stringify(board)).toBe(before)
    }
  })

  it('gives a reason exactly when it refuses, as a sentence without ids or placeholders', () => {
    for (const board of boards) {
      for (const card of board.cards) {
        const destinations = new Set(workshopDestinations(board, card.id).map(lane => lane.id))
        expect(destinations.has(card.laneId)).toBe(true)
        for (const lane of board.lanes) {
          const next = workshopCandidate(board, card.id, lane.id)
          const reason = workshopRefusal(board, card.id, lane.id)
          expect(destinations.has(lane.id)).toBe(next !== null)
          if (next) { expect(reason).toBeNull(); continue }
          const context = JSON.stringify({ card: card.id, lane: lane.id, board })
          expect(reason, context).toMatch(/^\S.*[.]$/s)
          expect(reason, context).not.toMatch(/undefined|NaN|null|\[object/)
          const points = /^Needs (-?\d+) points\. Now holds (\d+) of (\d+) points\.$/.exec(reason!)
          if (points) {
            // The sentence has to be true: what the move needs does not fit in what is left.
            expect(Number(points[1]), context).toBeGreaterThan(Number(points[3]) - Number(points[2]))
          }
        }
      }
      for (const lane of board.lanes) expect(workshopLaneCaption(board, lane.id)).not.toMatch(/undefined|NaN|null/)
    }
  })
})

describe('workshopToSlate with no options', () => {
  it('is byte-identical to main (64115d9) for 240 random boards', () => {
    // The hashes were recorded by running this same generator and workshopToSlate on an
    // untouched checkout of 64115d9 (see the fixture's "recordedWith").
    const sample = randomWorkshops(recorded.seed, recorded.hashes.length)
    expect(sample.length).toBeGreaterThanOrEqual(200)
    const hashes = sample.map(board => createHash('sha256').update(JSON.stringify(workshopToSlate(board))).digest('hex'))
    expect(hashes).toEqual(recorded.hashes)
  })
})
