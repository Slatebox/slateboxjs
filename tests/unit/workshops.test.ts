import { describe, expect, it } from 'vitest'
import { deserializeNodeOptions } from '../../src/core/Serialization'
import { availableLanes, decodeWorkshopFragment, encodeWorkshopFragment, nightTransfer, industrialWorkshop, moveWorkshopCard, validateWorkshop, workshopToSlate } from '../../src/workshops/model'

describe('agent-authored workshops', () => {
  it('opens the authored state, including its rules and literal URL punctuation', () => {
    const map = { ...moveWorkshopCard(nightTransfer, 'rider', 'lift'), title: 'Météores + auroras #2 & 3 / 北' }
    const url = new URL('/new/workshop' + encodeWorkshopFragment(map), 'https://example.com')
    expect(url.search).toBe('')
    const copy = decodeWorkshopFragment(url.hash)
    expect(copy).toEqual(map)
    expect(() => moveWorkshopCard(copy, 'rider', 'stairs')).toThrow()
  })

  it('rejects incomplete, ambiguous, oversized and unsupported workshop links', () => {
    const valid = encodeWorkshopFragment(industrialWorkshop)
    for (const fragment of ['', '#model=', '#model=oops', valid + '&model=null', valid + '&owner=someone',
      '#model=' + 'a'.repeat(65536), '#model=%7B%22version%22%3A2%7D']) {
      expect(() => decodeWorkshopFragment(fragment)).toThrow()
    }
  })

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

  it('uses declared paths for concept maps and preserves them as editable connections', () => {
    const map = validateWorkshop(nightTransfer)
    expect(() => moveWorkshopCard(map, 'rider', 'shuttle')).toThrow()
    const near = moveWorkshopCard(map, 'rider', 'lift')
    expect(availableLanes(near, near.cards[0]).map(l => l.id)).toEqual(['lift', 'shuttle'])
    expect(moveWorkshopCard(near, 'rider', 'shuttle').cards[0].laneId).toBe('shuttle')
    expect(workshopToSlate(map).nodes[0].relationships.associations.map(a => a.childId)).toEqual(['lane-stairs', 'lane-lift'])
    for (const invalid of [{ row: 7 }, { next: ['missing'] }, { next: ['platform'] }, { column: 1 }]) {
      const bad = structuredClone(map)
      Object.assign(bad.lanes[0].station!, invalid)
      expect(() => validateWorkshop(bad)).toThrow()
    }
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
