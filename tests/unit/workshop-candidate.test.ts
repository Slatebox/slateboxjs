import { describe, expect, it } from 'vitest'
import baseline from '../fixtures/native/workshop-to-slate.main-64115d9.json'
import {
  availableLanes, createBudgetWorkshop, createInterviewWorkshop, industrialWorkshop, moveWorkshopCard, nightTransfer,
  planStartupMove, releasePlan, validateWorkshop, workshopBudgetResult, workshopCandidate, workshopDestinations,
  workshopLaneCaption, workshopPresentationScenes, workshopRefusal, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { planReleaseMove } from '../../src/workshops/release'

/** Lane rules as the lane board has always applied them. */
function laneRule(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)!
  return availableLanes(board, card).some(lane => lane.id === laneId) ? moveWorkshopCard(board, cardId, laneId) : null
}

const twoLanes: Workshop = validateWorkshop({
  version: 1, title: 'What ships now?',
  lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later', capacity: 1 }],
  cards: [
    { id: 'alpha', label: 'Alpha', laneId: 'now' }, { id: 'beta', label: 'Beta', laneId: 'now' },
    { id: 'gamma', label: 'Gamma', laneId: 'now', allowedLaneIds: ['now'] },
  ],
})

function everyMove(board: Workshop) {
  return board.cards.flatMap(card => board.lanes.map(lane => [card.id, lane.id] as const))
}

describe('workshopCandidate', () => {
  it.each([['capacity and allowed lanes', twoLanes], ['a capacity board', industrialWorkshop], ['a station map', nightTransfer]] as const)(
    'answers %s exactly as availableLanes and moveWorkshopCard do', (_name, board) => {
      // Play a few moves so full lanes and later stations are covered too.
      const boards = [board]
      for (const [cardId, laneId] of everyMove(board)) {
        const next = laneRule(board, cardId, laneId)
        if (next && next !== board) boards.push(next)
      }
      for (const state of boards) {
        for (const [cardId, laneId] of everyMove(state)) {
          const own = state.cards.find(card => card.id === cardId)!.laneId === laneId
          const expected = laneRule(state, cardId, laneId)
          const actual = workshopCandidate(state, cardId, laneId)
          if (own) expect(actual).toBe(state)
          else expect(actual).toEqual(expected)
        }
      }
    })

  it('holds a full lane and a forbidden lane closed, and says why', () => {
    const full = workshopCandidate(twoLanes, 'alpha', 'later')!
    expect(full.cards.find(card => card.id === 'alpha')!.laneId).toBe('later')
    expect(workshopCandidate(full, 'beta', 'later')).toBeNull()
    expect(workshopRefusal(full, 'beta', 'later')).toBe('Now holds 1 of 1 card.')
    expect(workshopCandidate(twoLanes, 'gamma', 'later')).toBeNull()
    expect(workshopRefusal(twoLanes, 'gamma', 'later')).toBe("This card can't go in Later.")
    expect(workshopRefusal(twoLanes, 'alpha', 'later')).toBeNull()
    expect(workshopCandidate(twoLanes, 'alpha', 'missing')).toBeNull()
    expect(workshopCandidate(twoLanes, 'missing', 'later')).toBeNull()
    const pilot = workshopCandidate(industrialWorkshop, 'sensors', 'pilot')!
    expect(workshopRefusal(pilot, 'spares', 'pilot')).toBe('Now holds 2 of 2 cards.')
    expect(workshopDestinations(pilot, 'spares').map(lane => lane.id)).toEqual(['proposed', 'evidence'])
    expect(workshopDestinations(twoLanes, 'gamma').map(lane => lane.id)).toEqual(['now'])
  })

  it('follows the stations a token can reach on a map', () => {
    expect(workshopDestinations(nightTransfer, 'rider').map(lane => lane.id)).toEqual(['platform', 'stairs', 'lift'])
    expect(workshopCandidate(nightTransfer, 'rider', 'shuttle')).toBeNull()
    expect(workshopRefusal(nightTransfer, 'rider', 'shuttle')).toBe("Shuttle · Bay B can't be reached from Last train.")
    const lift = workshopCandidate(nightTransfer, 'rider', 'lift')!
    expect(workshopDestinations(lift, 'rider').map(lane => lane.id)).toEqual(['lift', 'shuttle'])
  })

  it('answers a release plan exactly as planReleaseMove does, dependants included', () => {
    for (const [cardId, laneId] of everyMove(releasePlan)) {
      const card = releasePlan.cards.find(item => item.id === cardId)!
      expect(workshopCandidate(releasePlan, cardId, laneId)).toEqual(planReleaseMove(releasePlan, card, laneId))
    }
    const friday = workshopCandidate(releasePlan, 'invite', 'friday')!
    expect(friday.cards.filter(card => card.laneId === 'friday').map(card => card.id).sort()).toEqual(['billing', 'guardrails', 'invite'])
    expect(workshopCandidate(friday, 'export', 'friday')).toBeNull()
    expect(workshopRefusal(friday, 'export', 'friday')).toBe('Needs 4 points. Now holds 8 of 8 points.')
  })

  it('answers the budget experience exactly as planStartupMove and the lane rules do', () => {
    const budget = createBudgetWorkshop()
    for (const [cardId, laneId] of everyMove(budget)) {
      if (budget.cards.find(card => card.id === cardId)!.laneId === laneId) continue
      expect(workshopCandidate(budget, cardId, laneId)).toEqual(planStartupMove(budget, cardId, laneId))
      expect(workshopCandidate(budget, cardId, laneId)).toEqual(laneRule(budget, cardId, laneId))
    }
    const funded = workshopCandidate(budget, 'fund-1', 'newsletter')!
    expect(workshopBudgetResult(funded, 'newsletter')).toEqual({ amount: 200, description: '1 placement' })
    expect(workshopLaneCaption(funded, 'newsletter')).toBe('$200 · 1 placement')
    expect(workshopLaneCaption(funded, 'reserve')).toBe('$200 · unallocated')
  })

  it('swaps interviews through the prototype as planStartupMove does, and otherwise keeps the lane rules', () => {
    const interviews = createInterviewWorkshop()
    for (const [cardId, laneId] of everyMove(interviews)) {
      if (interviews.cards.find(card => card.id === cardId)!.laneId === laneId) continue
      const planned = planStartupMove(interviews, cardId, laneId)
      expect(workshopCandidate(interviews, cardId, laneId)).toEqual(planned ?? laneRule(interviews, cardId, laneId))
    }
    const swapped = workshopCandidate(interviews, 'duplicate', 'prototype')!
    expect(swapped.cards.map(card => card.id + '@' + card.laneId)).toEqual(['preview@interviews', 'duplicate@prototype', 'undo@interviews'])
  })

  it('gives the startup board what planStartupMove gave it: null for a card that is already there', () => {
    const asStartupBoard = (board: Workshop, cardId: string, laneId: string) => {
      const next = workshopCandidate(board, cardId, laneId)
      return next === board ? null : next
    }
    const budget = createBudgetWorkshop()
    for (const [cardId, laneId] of everyMove(budget)) expect(asStartupBoard(budget, cardId, laneId)).toEqual(planStartupMove(budget, cardId, laneId))
    const interviews = createInterviewWorkshop()
    // The interview board's only drop target and tap destination is the prototype.
    for (const card of interviews.cards) expect(asStartupBoard(interviews, card.id, 'prototype')).toEqual(planStartupMove(interviews, card.id, 'prototype'))
  })

  it('captions a lane with how full it is', () => {
    expect(workshopLaneCaption(twoLanes, 'now')).toBe('3 cards')
    expect(workshopLaneCaption(twoLanes, 'later')).toBe('0 of 1')
    expect(workshopLaneCaption(workshopCandidate(twoLanes, 'alpha', 'later')!, 'later')).toBe('1 of 1')
    expect(workshopLaneCaption(industrialWorkshop, 'pilot')).toBe('1 of 2')
    expect(workshopLaneCaption(industrialWorkshop, 'evidence')).toBe('1 card')
    expect(workshopLaneCaption(releasePlan, 'friday')).toBe('3 / 8 points')
    expect(workshopLaneCaption(releasePlan, 'backlog')).toBe('3 points')
    expect(workshopLaneCaption(createBudgetWorkshop(), 'calls')).toBe('$200 · 4 customer calls')
  })
})

describe('workshopToSlate', () => {
  it.each([
    ['budget', createBudgetWorkshop()], ['interview', createInterviewWorkshop()], ['capacity', industrialWorkshop],
    ['map', nightTransfer], ['release', releasePlan],
  ] as const)('keeps the %s presentation artwork byte-identical to main', (name, board) => {
    const expected = (baseline as Record<string, unknown>)[name]
    expect(JSON.stringify(workshopToSlate(board))).toBe(JSON.stringify(expected))
    expect(JSON.stringify(workshopToSlate(board, {}))).toBe(JSON.stringify(expected))
    expect(JSON.stringify(workshopToSlate(board, { origin: { x: 500, y: 500 } }))).toBe(JSON.stringify(expected))
  })

  it('draws native artwork with the presentation names, a caption and a column per lane', () => {
    const native = workshopToSlate(twoLanes, { native: true, origin: { x: 300, y: 80 } }).nodes
    const byId = new Map(native.map(node => [node.options.id as string, node.options]))
    expect([...byId.keys()]).toEqual([
      'column-now', 'lane-now', 'caption-now', 'card-alpha', 'card-beta', 'card-gamma', 'column-later', 'lane-later', 'caption-later',
    ])
    expect(byId.get('lane-now')!.text).toBe('Now')
    expect(byId.get('caption-now')!.text).toBe('3 cards')
    expect(byId.get('caption-later')!.text).toBe('0 of 1')
    // Cards stack inside their lane's column, below its header and caption.
    const column = byId.get('column-now')!, header = byId.get('lane-now')!, caption = byId.get('caption-now')!
    for (const [i, id] of ['card-alpha', 'card-beta', 'card-gamma'].entries()) {
      const card = byId.get(id)!
      expect(card.xPos).toBe(header.xPos)
      expect(card.yPos).toBe(80 + 98 + i * 88)
      expect(card.yPos).toBeGreaterThanOrEqual(caption.yPos + caption.height)
      expect(card.xPos).toBeGreaterThanOrEqual(column.xPos)
      expect(card.yPos + card.height).toBeLessThanOrEqual(column.yPos + column.height)
    }
    expect(byId.get('column-later')!.xPos - column.xPos).toBe(244)
    // Every note the presentation frames exists in the native artwork under the same name.
    for (const board of [twoLanes, industrialWorkshop, nightTransfer, releasePlan, createBudgetWorkshop()]) {
      const ids = new Set(workshopToSlate(board, { native: true }).nodes.map(node => node.options.id))
      for (const id of workshopPresentationScenes(board).flatMap(scene => scene.nodeIds)) expect(ids.has(id)).toBe(true)
    }
  })

  it('keeps a held board the height of the committed one, and draws a map with its connectors', () => {
    const candidate = workshopCandidate(twoLanes, 'alpha', 'later')!
    const height = (board: Workshop, rows?: number) => workshopToSlate(board, { native: true, rows }).nodes[0].options.height
    expect(height(candidate)).toBeLessThan(height(twoLanes))
    expect(height(candidate, 3)).toBe(height(twoLanes))
    const map = workshopToSlate(nightTransfer, { native: true }).nodes
    const platform = map.find(node => node.options.id === 'lane-platform')!
    expect(platform.options.text).toBe('Last train')
    expect(platform.relationships.associations.map(link => link.childId)).toEqual(['lane-stairs', 'lane-lift'])
    expect(map.find(node => node.options.id === 'caption-platform')!.options.text).toBe('1 card')
  })
})
