import { describe, expect, it } from 'vitest'
import { deserializeNodeOptions } from '../../src/core/Serialization'
import { availableLanes, industrialWorkshop, moveWorkshopCard, validateWorkshop, workshopToSlate } from '../../src/workshops/model'

describe('agent-authored workshops', () => {
  it('keeps only portable data and rejects ambiguous rules or markup', () => {
    const clean = validateWorkshop({ ...industrialWorkshop, script: 'extra' })
    expect(clean).toEqual(industrialWorkshop)
    const first = clean.cards[0]
    for (const update of [
      { version: 2 }, { lanes: [] }, { cards: [] }, { title: '<img>' },
      { lanes: [clean.lanes[0], clean.lanes[0]] },
      { cards: [first, first] }, { cards: [{ ...first, laneId: 'missing' }] },
      { cards: [{ ...first, allowedLaneIds: ['evidence'] }] },
      { lanes: clean.lanes.map(lane => ({ ...lane, capacity: 1 })) },
    ]) expect(() => validateWorkshop({ ...clean, ...update })).toThrow()
  })

  it('applies capacity and per-card rules to both movement and available destinations', () => {
    const initial = validateWorkshop(industrialWorkshop)
    const moved = moveWorkshopCard(initial, 'sensors', 'pilot')
    expect(initial.cards[0].laneId).toBe('proposed')
    expect(availableLanes(moved, moved.cards[2]).map(lane => lane.id)).toEqual(['evidence'])
    expect(() => moveWorkshopCard(moved, 'spares', 'pilot')).toThrow()
    expect(() => moveWorkshopCard(moved, 'cooling', 'proposed')).toThrow()
    expect(moveWorkshopCard(moved, 'sensors', 'pilot')).toBe(moved)
  })

  it('places decisions in the chosen lane as editable Slatebox nodes', () => {
    const output = workshopToSlate(moveWorkshopCard(industrialWorkshop, 'sensors', 'pilot'))
    expect(output.nodes).toHaveLength(7)
    const nodes = output.nodes.map(item => deserializeNodeOptions(item.options))
    const trial = nodes.find(node => node.id === 'card-sensors')!
    const lane = nodes.find(node => node.id === 'lane-pilot')!
    expect(trial.x).toBe(lane.x)
    expect(trial.y!).toBeGreaterThan(lane.y!)
    expect(trial.text).toBe('Test bearing sensors on line four')
  })
})
