import { describe, expect, it } from 'vitest'
import { deserializeNodeOptions } from '../../src/core/Serialization'
import { createLaneWorkshop, addWorkshopLane, addWorkshopCard, createWorkshopMap, addWorkshopBranch, availableLanes, decodeWorkshopFragment, encodeWorkshopFragment, nightTransfer, industrialWorkshop, releasePlan, resolveWorkshopSignals, workshopPresentationLanes, workshopPresentationScenes, moveWorkshopCard, validateWorkshop, workshopToSlate } from '../../src/workshops/model'

describe('agent-authored workshops', () => {
  it('opens the authored state, including its rules and literal URL punctuation', () => {
    const map = { ...moveWorkshopCard(nightTransfer, 'rider', 'lift'), title: 'Météores + auroras #2 & 3 / 北' }
    const url = new URL('/new/workshop' + encodeWorkshopFragment(map), 'https://example.com')
    expect(url.search).toBe('')
    const copy = decodeWorkshopFragment(url.hash)
    expect(copy).toEqual(map)
    expect(() => moveWorkshopCard(copy, 'rider', 'stairs')).toThrow()
  })

  it.each([industrialWorkshop, nightTransfer, releasePlan])('persists authored presentation order independently of $title board layout', model => {
    const ids = model.lanes.map(lane => lane.id)
    const order = [...ids].reverse()
    const board = validateWorkshop({ ...model, presentationOrder: order })
    expect(workshopPresentationLanes(model)).toEqual(model.lanes)
    expect(workshopPresentationLanes(board)[0]).toBe(board.lanes[board.lanes.length - 1])
    expect(decodeWorkshopFragment(encodeWorkshopFragment(board))).toEqual(board)
    expect(workshopPresentationLanes(validateWorkshop(JSON.parse(JSON.stringify(board)))).map(lane => lane.id)).toEqual(order)
    expect(board.lanes.map(lane => lane.id)).toEqual(ids)
    expect(workshopToSlate(board)).toEqual(workshopToSlate(model))
    const card = model.cards[0]
    const destinations = availableLanes(model, card)
    expect(availableLanes(board, card)).toEqual(destinations)
    const destination = destinations.find(lane => lane.id !== card.laneId)
    if (destination) expect(moveWorkshopCard(board, card.id, destination.id).presentationOrder).toEqual(order)
  })

  it('frames current cards with their authored station and retains empty stations in a cyclic map', () => {
    const moved = moveWorkshopCard(nightTransfer, 'rider', 'lift')
    const board = decodeWorkshopFragment(encodeWorkshopFragment({ ...moved, presentationOrder: ['lift', 'shuttle', 'stairs', 'platform'] }))
    const scenes = workshopPresentationScenes(board)
    expect(scenes.map(scene => scene.nodeIds)).toEqual([
      ['lane-lift', 'card-rider'], ['lane-shuttle'], ['lane-stairs'], ['lane-platform'],
    ])
    expect(scenes[0].lane).toBe(board.lanes[2])
    expect(scenes[0].cards[0]).toBe(board.cards[0])
    const nativeNodes = workshopToSlate(board).nodes.map(node => node.options.id)
    expect(scenes.flatMap(scene => scene.nodeIds).sort()).toEqual(nativeNodes.sort())
  })

  it('resolves portable placement outcomes for current cards and presentation stages', () => {
    const rule = {id:'cue', label:'Window', cardId:'rider', laneId:'lift', whenPresent:'The doors open.', whenAbsent:'Wait for the rider.'}
    const original = validateWorkshop({...nightTransfer, signals:[rule]})
    expect(resolveWorkshopSignals(original)).toEqual([{...rule, present:false, text:rule.whenAbsent}])
    const moved = moveWorkshopCard(original, 'rider', 'lift')
    const imported = decodeWorkshopFragment(encodeWorkshopFragment(moved))
    expect(imported).toEqual(moved)
    expect(resolveWorkshopSignals(imported)[0]).toMatchObject({present:true, text:rule.whenPresent})
    expect(workshopPresentationScenes(original).find(s => s.lane.id === 'lift')?.signals[0].text).toBe(rule.whenAbsent)
    expect(workshopPresentationScenes(imported).find(s => s.lane.id === 'lift')?.signals[0].text).toBe(rule.whenPresent)
    expect(workshopPresentationScenes(imported).filter(s => s.signals.length)).toHaveLength(1)
    expect(resolveWorkshopSignals(nightTransfer)).toEqual([])
    for (const signals of [null, [rule,rule], Array(25).fill(rule), [{...rule,cardId:'missing'}],
      [{...rule,laneId:'missing'}],[{...rule,whenPresent:'<x>'}], [{...rule,whenAbsent:''}], [{...rule,label:'x'.repeat(81)}],
      [{...rule,whenAbsent:'x'.repeat(161)}]]) expect(()=>validateWorkshop({...original,signals})).toThrow()
  })

  it('rejects partial, oversized, repeated and unknown presentation stages', () => {
    const ids = nightTransfer.lanes.map(lane => lane.id)
    for (const order of [null, 'platform', [], ids.slice(1), [...ids, 'more'], [...ids.slice(1), ids[1]], [...ids.slice(1), 'unknown']]) {
      expect(() => validateWorkshop({ ...nightTransfer, presentationOrder: order })).toThrow(/Presentation order/)
    }
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
      { version: 2 }, { lanes: [] }, { cards: null }, { title: '<img>' },
      { lanes: [clean.lanes[0], clean.lanes[0]] },
      { cards: [first, first] }, { cards: [{ ...first, laneId: 'missing' }] },
      { cards: [{ ...first, allowedLaneIds: ['evidence'] }] },
      { lanes: clean.lanes.map(lane => ({ ...lane, capacity: 1 })) },
    ]) expect(() => validateWorkshop({ ...clean, ...update })).toThrow()
  })

  it('authors an empty two-lane board without changing earlier rules, objects or presentation order', () => {
    const empty = createLaneWorkshop()
    expect(empty.cards).toEqual([])
    expect(decodeWorkshopFragment(encodeWorkshopFragment(empty))).toEqual(empty)
    expect(workshopPresentationScenes(empty).map(scene => scene.nodeIds)).toEqual([['lane-lane-1'], ['lane-lane-2']])
    expect(workshopToSlate(empty).nodes).toHaveLength(2)
    const imported = validateWorkshop({ ...empty, lanes: [{id:'card-1',label:'Drafts'}, {id:'lane-1',label:'Broadcast',capacity:1}],
      presentationOrder:['lane-1','card-1'] })
    const first = addWorkshopCard(imported, 'card-1', {label:'Harbour bell',allowedLaneIds:['card-1']})
    expect(first.cards[0].id).toBe('card-2')
    const expanded = addWorkshopLane(first, {label:'Drafts',capacity:1})
    expect(expanded.presentationOrder).toEqual(['lane-1','card-1','lane-2'])
    expect(expanded.cards[0].allowedLaneIds).toEqual(['card-1'])
    expect(expanded.lanes.map(lane => lane.label)).toEqual(['Drafts','Broadcast','Drafts'])
    expect(imported.cards).toEqual([])
    const full = addWorkshopCard(expanded,'lane-2',{label:'Harbour bell'})
    expect(() => addWorkshopCard(full,'lane-2',{label:'Second bell'})).toThrow(/capacity/)
    expect(() => addWorkshopCard(full,'missing',{label:'Another recording'})).toThrow(/unknown lane/)
    expect(() => addWorkshopCard(full,'lane-1',{label:'Tune',allowedLaneIds:['card-1']})).toThrow(/starting lane/)
    expect(() => addWorkshopLane(full,{label:'<b>markup</b>'})).toThrow(/plain text/)
    // (Restated 2026-11-21, owner decision: a card may be empty, so a blank card is added, not refused.)
    expect(addWorkshopCard(full,'card-1',{label:' '}).cards.at(-1)).toMatchObject({ label: '', laneId: 'card-1' })
    expect(decodeWorkshopFragment(encodeWorkshopFragment(full))).toEqual(full)
  })

  it('enforces lane/card limits and retains the minimum card for maps and release plans', () => {
    let board = createLaneWorkshop()
    for (let i = 0; i < 3; i++) board = addWorkshopLane(board,{label:'New lane'})
    expect(() => addWorkshopLane(board,{label:'Extra lane'})).toThrow(/2 to 5/)
    for (let i = 0; i < 24; i++) board = addWorkshopCard(board,board.lanes[0].id,{label:'Idea'})
    expect(() => addWorkshopCard(board,board.lanes[0].id,{label:'Extra card'})).toThrow(/24 cards/)
    for (const other of [createWorkshopMap(),releasePlan]) {
      expect(() => validateWorkshop({...other,cards:[]})).toThrow(/at least one card/)
      expect(() => addWorkshopLane(other,{label:'Draft'})).toThrow(/lane workshop/)
      expect(() => addWorkshopCard(other,other.lanes[0].id,{label:'Draft'})).toThrow(/lane workshop/)
    }
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

describe('interactive map authoring', () => {
  it('starts independently and adds a playable fork with its own scene and native connector', () => {
    const first = createWorkshopMap()
    const next = addWorkshopBranch(first, 'start', { label: 'Sound booth', outcome: 'A recording begins.' })
    const destination = next.lanes[2]
    expect(first).toEqual(createWorkshopMap())
    expect(first.lanes).not.toBe(createWorkshopMap().lanes)
    expect(destination.station).toEqual({ column: 0, row: 1, next: [], outcome: 'A recording begins.' })
    expect(availableLanes(next, next.cards[0]).map(l => l.id)).toEqual(['start', 'next', destination.id])
    const moved = moveWorkshopCard(next, 'token', destination.id)
    expect(workshopPresentationScenes(moved)[2].cards.map(c => c.id)).toEqual(['token'])
    expect(decodeWorkshopFragment(encodeWorkshopFragment(moved))).toEqual(moved)
    const native = workshopToSlate(next).nodes.find(n => n.options.id === 'lane-start')!
    expect(native.relationships.associations.map(a => a.childId)).toContain('lane-' + destination.id)
  })

  it('carries station artwork through a shared link and frames it with the occupied station', () => {
    const image = { src: 'https://museum.example/shoreline.webp', alt: 'Boats along the riverbank' }
    const board = addWorkshopBranch(createWorkshopMap(), 'start', { label: 'Shoreline', outcome: 'Follow the river.', image })
    const station = board.lanes[2]
    const restored = decodeWorkshopFragment(encodeWorkshopFragment(moveWorkshopCard(board, 'token', station.id)))
    expect(restored.lanes[2].station?.image).toEqual(image)
    const scene = workshopPresentationScenes(restored)[2]
    expect(scene.nodeIds).toEqual(['lane-' + station.id, 'image-' + station.id, 'card-token'])
    const nodes = workshopToSlate(restored).nodes.map(n => deserializeNodeOptions(n.options))
    const art = nodes.find(n => n.id === 'image-' + station.id)!
    expect(art).toMatchObject({ image: image.src, name: image.alt, text: '' })
    expect(nodes.find(n => n.id === 'card-token')!.y).toBeGreaterThanOrEqual(art.y! + art.height!)
    for (const src of ['data:image/png,hello', 'http://example.com/x', 'https://user:pass@museum.example/x']) {
      expect(() => validateWorkshop({ ...board, lanes: board.lanes.map(lane => lane !== station ? lane :
        { ...lane, station: { ...lane.station, image: { ...image, src } } }) })).toThrow(/HTTPS/)
    }
  })

  it('preserves authored restrictions, placements, existing routes and presentation order', () => {
    const map = createWorkshopMap()
    map.presentationOrder = ['next', 'start']
    map.cards[0].id = 'station-1'
    map.cards[0].allowedLaneIds = ['start', 'next']
    map.lanes[1].capacity = 1
    map.signals = [{ id:'station-2', label:'Arrival', cardId:'station-1', laneId:'next', whenPresent:'Here', whenAbsent:'Away' }]
    const branch = { label:'Next step', outcome:'A different destination.' }
    const result = addWorkshopBranch(map, 'next', branch)
    expect(result.lanes[2].id).toBe('station-3')
    expect(result.lanes[1].station!.next).toEqual(['station-3'])
    expect(result.lanes[0]).toEqual(map.lanes[0])
    expect(result.lanes[1].capacity).toBe(1)
    expect(result.cards).toEqual(map.cards)
    expect(result.signals).toEqual(map.signals)
    expect(result.presentationOrder).toEqual(['next', 'start', 'station-3'])
    expect(validateWorkshop(result)).toEqual(result)
    const atFork = moveWorkshopCard(result, 'station-1', 'next')
    expect(availableLanes(atFork, atFork.cards[0]).map(lane => lane.id)).toEqual(['next'])
  })

  it('rejects invalid destinations and caps the map without modifying the source', () => {
    const map = createWorkshopMap()
    const branch = { label:'Room', outcome:'Arrived.' }
    expect(() => addWorkshopBranch(industrialWorkshop, 'start', branch)).toThrow(/interactive map/)
    expect(() => addWorkshopBranch(map, 'unknown', branch)).toThrow(/Choose a station/)
    expect(() => addWorkshopBranch(map, 'start', { ...branch, label:' ' })).toThrow()
    expect(() => addWorkshopBranch(map, 'start', { ...branch, outcome:'<svg>' })).toThrow()
    const full = [1, 2, 3].reduce(board => addWorkshopBranch(board, 'start', branch), map)
    expect(new Set(full.lanes.map(l => l.station!.column + ',' + l.station!.row)).size).toBe(5)
    expect(() => addWorkshopBranch(full, 'start', branch)).toThrow(/five stations/)
    expect(map).toEqual(createWorkshopMap())
  })
})
