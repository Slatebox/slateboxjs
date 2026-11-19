import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest'
import { dragologyCandidates } from '../../src/workshops/dragologyCandidates'
import { workshopCandidate, workshopLayout, workshopPositions, type Workshop } from '../../src/workshops/model'
import { randomWorkshops } from './helpers/randomWorkshops'

/**
 * Dragology's drag engine evaluated with no renderer and no DOM, on random boards,
 * against the workshop rules. The suite's shared setup needs jsdom, so `document`
 * and `window` are taken away for the length of this file instead: anything that
 * reached for either would throw.
 */

beforeAll(() => {
  vi.stubGlobal('document', undefined)
  vi.stubGlobal('window', undefined)
})
afterAll(() => vi.unstubAllGlobals())

const boards = randomWorkshops(5183, 400)
const laneOf = (board: Workshop, cardId: string) => board.cards.find(card => card.id === cardId)!.laneId
const grab = { x: 30, y: 20 }

describe('dragologyCandidates with no DOM', () => {
  it('runs where there is no document or window', () => {
    expect(typeof document).toBe('undefined')
    expect(typeof window).toBe('undefined')
  })

  it('on lane boards, picks the lane the pointer is in when the rules allow it and stays put when they do not', () => {
    let allowed = 0, refused = 0
    for (const board of boards) {
      if (board.kind || board.lanes[0].station) continue
      const { points } = workshopPositions(board)
      for (const card of board.cards) {
        const choose = dragologyCandidates(board, card.id, grab)
        board.lanes.forEach((lane, index) => {
          // The middle of the lane's column, level with its header.
          const chosen = choose ? choose({ x: points[index].x + workshopLayout.pitch / 2, y: 40 }) : board
          const rule = workshopCandidate(board, card.id, lane.id)
          if (lane.id === card.laneId) return expect(laneOf(chosen, card.id)).toBe(card.laneId)
          if (rule) { allowed++; expect(chosen).toEqual(rule) }
          else { refused++; expect(chosen).toBe(board) }
        })
      }
    }
    expect(allowed).toBeGreaterThan(300)
    expect(refused).toBeGreaterThan(300)
  })

  it('on maps and release plans, a pointer holding the card over its place in a legal board picks that board, and never an illegal one', () => {
    let picked = 0
    for (const board of boards) {
      const map = Boolean(board.lanes[0].station)
      if (!board.kind && !map) continue
      for (const card of board.cards) {
        const choose = dragologyCandidates(board, card.id, grab)
        if (!choose) continue
        for (const lane of board.lanes) {
          const rule = workshopCandidate(board, card.id, lane.id)
          if (!rule || lane.id === card.laneId) continue
          // Where the SVG board draws the card in that candidate.
          const { points } = workshopPositions(rule)
          const column = rule.lanes.findIndex(item => item.id === lane.id)
          const row = rule.cards.filter(item => item.laneId === lane.id).findIndex(item => item.id === card.id)
          const at = { x: points[column].x + (map ? 18 : 8), y: points[column].y + workshopLayout.top + row * workshopLayout.row }
          const chosen = choose({ x: at.x + grab.x, y: at.y + grab.y })
          expect(chosen).toEqual(rule)
          picked++
        }
        // Wherever the pointer is, the drop state is one of the boards the rules allow.
        const legal = board.lanes.map(lane => workshopCandidate(board, card.id, lane.id)).filter(Boolean).map(next => JSON.stringify(next))
        for (const point of [{ x: -500, y: -500 }, { x: 5000, y: 40 }, { x: 300, y: 3000 }, { x: 122, y: 60 }, { x: 366, y: 200 }, { x: 610, y: 500 }]) {
          expect(legal).toContain(JSON.stringify(choose(point)))
        }
      }
    }
    expect(picked).toBeGreaterThan(300)
  })
})
