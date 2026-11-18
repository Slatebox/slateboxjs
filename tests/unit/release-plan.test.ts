import { describe, expect, it } from 'vitest'
import { availableLanes, moveWorkshopCard, releaseLoad, releasePlan, validateWorkshop, workshopToSlate } from '../../src/workshops/model'

describe('release planning rules', () => {
  it('pulls prerequisites and postpones dependants atomically, including transitive shared parents', () => {
    const board = structuredClone(releasePlan)
    board.cards.push({ id:'access', label:'Access index', points:1, laneId:'next' })
    board.cards[0].dependsOn = ['access']
    board.cards[1].dependsOn!.push('access')
    board.lanes[0].capacity = 9
    const earlier = moveWorkshopCard(validateWorkshop(board), 'invite', 'friday')
    expect(earlier.cards.filter(c => c.laneId === 'friday').map(c => c.id)).toEqual(['guardrails','invite','billing','access'])
    expect(releaseLoad(earlier, 'friday')).toBe(9)
    const postponed = moveWorkshopCard(earlier, 'access', 'backlog')
    expect(postponed.cards.filter(c => c.laneId === 'backlog').map(c => c.id)).toEqual(['guardrails','invite','access'])
    expect(releaseLoad(board, 'friday')).toBe(3)
  })

  it('rejects a blocked dependency and a full window without moving any feature', () => {
    for (const constraint of ['capacity','dependency']) {
      const board = structuredClone(releasePlan)
      if (constraint === 'capacity') board.lanes[0].capacity = 7
      else board.cards[0].allowedLaneIds = ['next']
      const checked = validateWorkshop(board)
      expect(availableLanes(checked, checked.cards[1]).map(l => l.id)).not.toContain('friday')
      expect(() => moveWorkshopCard(checked, 'invite', 'friday')).toThrow('unavailable')
      expect(checked).toEqual(board)
    }
  })

  it('rejects cycles, missing IDs, backward dependencies, invalid effort and overspent budgets', () => {
    for (const defect of ['cycle','reference','backward','effort','budget']) {
      const board = structuredClone(releasePlan)
      if (defect === 'cycle') { board.cards[0].laneId = 'backlog'; board.cards[0].dependsOn = ['invite'] }
      if (defect === 'reference') board.cards[0].dependsOn = ['absent']
      if (defect === 'backward') board.cards[1].laneId = 'friday'
      if (defect === 'effort') board.cards[1].points = 2.5
      if (defect === 'budget') board.lanes[0].capacity = 2
      expect(() => validateWorkshop(board)).toThrow()
    }
  })

  it('reopens committed rules and exports budget, feature and directed dependency for presentation', () => {
    const next = moveWorkshopCard(releasePlan, 'invite', 'friday')
    const reopened = validateWorkshop(JSON.parse(JSON.stringify(next)))
    expect(reopened).toEqual(next)
    const nodes = workshopToSlate(reopened).nodes
    expect(nodes.find(n => n.options.id === 'lane-friday')?.options.text).toBe('Friday release\n8 / 8 points')
    expect(nodes.find(n => n.options.id === 'card-guardrails')?.relationships.associations).toMatchObject([
      { parentId:'card-guardrails', childId:'card-invite', showChildArrow:true },
    ])
    expect(nodes.find(n => n.options.id === 'card-invite')?.options.xPos).toBe(nodes.find(n => n.options.id === 'lane-friday')?.options.xPos)
  })
})
