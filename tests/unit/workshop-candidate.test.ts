import { describe, expect, it } from 'vitest'
import baseline from '../fixtures/native/workshop-to-slate.main-64115d9.json'
import {
  availableLanes, createBudgetWorkshop, createInterviewWorkshop, industrialWorkshop, moveWorkshopCard, nightTransfer,
  planStartupMove, releasePlan, validateWorkshop, workshopBudgetResult, workshopCandidate, workshopDestinations,
  workshopLaneCaption, workshopLanePlaces, workshopPresentationScenes, workshopRefusal, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { DEFAULT_NOTE_STYLE } from '../../src/core/NoteDefaults'
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

  it('draws beside a document that already has notes by its names, under other ids, connectors included', () => {
    const plain = workshopToSlate(nightTransfer, { native: true })
    // Nothing of the document's collides: the artwork is exactly what it is without the option.
    expect(JSON.stringify(workshopToSlate(nightTransfer, { native: true, beside: ['my-note', 'card-of-mine'] }))).toBe(JSON.stringify(plain))
    const token = plain.nodes.find(node => (node.options.id as string).startsWith('card-'))!.options.id as string
    const zones = plain.nodes.filter(node => (node.options.id as string).startsWith('column-')).map(node => node.options.id as string)
    // The document holds the token's name, one station zone's name, and that zone's first stand-in too.
    const beside = [token, zones[1], zones[1] + '--2']
    const drawn = workshopToSlate(nightTransfer, { native: true, beside })
    const ids = drawn.nodes.map(node => node.options.id as string)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of beside) expect(ids).not.toContain(id)
    expect(ids).toContain(token + '--2')
    expect(ids).toContain(zones[1] + '--3')
    // Same notes otherwise, in the same order and places.
    expect(drawn.nodes.map(node => [node.options.text, node.options.xPos, node.options.yPos]))
      .toEqual(plain.nodes.map(node => [node.options.text, node.options.xPos, node.options.yPos]))
    // Every connector still joins two notes of the artwork.
    const links = drawn.nodes.flatMap(node => node.relationships.associations)
    expect(links.length).toBe(plain.nodes.flatMap(node => node.relationships.associations).length)
    expect(links.length).toBeGreaterThan(0)
    for (const link of links) {
      expect(ids).toContain(link.parentId)
      expect(ids).toContain(link.childId)
    }
    expect(links.some(link => link.parentId === zones[1] + '--3' || link.childId === zones[1] + '--3')).toBe(true)
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
    // Onward stops are joined zone to zone (the line runs between stations, not over a token).
    const zone = map.find(node => node.options.id === 'column-platform')!
    expect(zone.relationships.associations.map(link => [link.id, link.parentId, link.childId])).toEqual([
      ['platform-to-stairs', 'column-platform', 'column-stairs'], ['platform-to-lift', 'column-platform', 'column-lift'],
    ])
    expect(platform.relationships.associations).toEqual([])
    expect(map.find(node => node.options.id === 'caption-platform')!.options.text).toBe('1 card')
  })
})

describe('native artwork: note style', () => {
  const notes = (board: Workshop, options = {}) => new Map(workshopToSlate(board, { native: true, ...options }).nodes.map(node => [node.options.id as string, node.options]))

  it('draws lanes and cards as an ordinary engine note is drawn when the host passes no style', () => {
    const byId = notes(twoLanes)
    for (const id of ['lane-now', 'card-alpha', 'card-gamma']) {
      const note = byId.get(id)!
      expect(note.foregroundColor).toBe(DEFAULT_NOTE_STYLE.fontColor)
      expect(note.borderColor).toBe(DEFAULT_NOTE_STYLE.borderColor)
      expect(note.borderWidth).toBe(DEFAULT_NOTE_STYLE.borderWidth)
      // No family of its own: the note falls back to the engine's.
      expect(note.fontFamily).toBeUndefined()
      // A plain rectangle at the note's own size.
      expect(note.vectorPath).toBe(`M 0 0 H ${note.width} V ${note.height} H 0 Z`)
    }
    expect(byId.get('card-alpha')!.fontSize).toBe(DEFAULT_NOTE_STYLE.fontSize)
    expect(byId.get('lane-now')!.fontSize).toBe(DEFAULT_NOTE_STYLE.fontSize + 2)
    expect(byId.get('caption-now')!.fontSize).toBe(DEFAULT_NOTE_STYLE.fontSize - 1)
    expect(byId.get('caption-now')!.borderWidth).toBe(0)
  })

  it('takes the host\'s family, sizes, colours, border and corner', () => {
    const style = { fontFamily: 'Manrope', fontSize: 18, laneFontSize: 22, captionFontSize: 15, textColor: '#102030', borderColor: '#405060', borderWidth: 2, cornerRadius: 10 }
    const byId = notes(twoLanes, { style })
    for (const id of ['lane-now', 'caption-now', 'card-alpha']) {
      expect(byId.get(id)!.fontFamily).toBe('Manrope')
      expect(byId.get(id)!.foregroundColor).toBe('#102030')
    }
    expect([byId.get('card-alpha')!.fontSize, byId.get('lane-now')!.fontSize, byId.get('caption-now')!.fontSize]).toEqual([18, 22, 15])
    expect(byId.get('card-alpha')!).toMatchObject({ borderColor: '#405060', borderWidth: 2 })
    expect(byId.get('card-alpha')!.vectorPath).toBe('M 10 0 H 218 Q 228 0 228 10 V 66 Q 228 76 218 76 H 10 Q 0 76 0 66 V 10 Q 0 0 10 0 Z')
    // The column behind a lane keeps its own tint and a hairline border, with the corner a little wider.
    expect(byId.get('column-now')!).toMatchObject({ borderWidth: 1 })
    expect(byId.get('column-now')!.vectorPath).toContain('Q 240 0 240 12')
    // The presentation artwork is not touched by a style.
    expect(JSON.stringify(workshopToSlate(twoLanes, { style } as never))).toBe(JSON.stringify(workshopToSlate(twoLanes)))
  })

  it('sets a label that would not fit its note smaller, never below 11, and leaves short ones at the size asked', () => {
    const long: Workshop = validateWorkshop({ ...twoLanes, cards: [
      { id: 'alpha', label: 'Alpha', laneId: 'now' },
      { id: 'long', label: 'A label of quite some length that goes on for the full eighty characters allowed', laneId: 'now' },
    ] })
    const size = (fontSize: number, id: string) => notes(long, { style: { fontSize } }).get(id)!.fontSize as number
    expect(size(14, 'card-alpha')).toBe(14)
    expect(size(14, 'card-long')).toBe(14)
    expect(size(24, 'card-alpha')).toBe(24)
    expect(size(24, 'card-long')).toBeLessThan(24)
    expect(size(24, 'card-long')).toBeGreaterThanOrEqual(11)
    // Asking for more changes nothing: it is the note that sets the limit.
    expect(size(60, 'card-long')).toBe(size(24, 'card-long'))
    expect(size(60, 'card-alpha')).toBeLessThan(60)
    // A release card carries its points on a second line and is fitted with it.
    const release = notes(releasePlan, { style: { fontSize: 30 } })
    expect(release.get('card-guardrails')!.text).toBe('Permission checks\n2 points')
    expect(release.get('card-guardrails')!.fontSize).toBeLessThan(30)
    expect(notes(releasePlan).get('card-guardrails')!.fontSize).toBe(14)
  })
})

describe('native artwork: lanes that wrap', () => {
  const budget = createBudgetWorkshop()

  it('puts every lane in one row unless a layout says otherwise', () => {
    const { places, width, height } = workshopLanePlaces(budget)
    expect(places.map(place => [place.laneId, place.x, place.y, place.column, place.row])).toEqual([
      ['reserve', 0, 0, 0, 0], ['calls', 244, 0, 1, 0], ['newsletter', 488, 0, 2, 0], ['pilot', 732, 0, 3, 0],
    ])
    // Every column as tall as the fullest lane (two cards) plus one free slot.
    expect(new Set(places.map(place => place.height))).toEqual(new Set([98 + 3 * 88]))
    expect([width, height]).toEqual([976, 362])
    expect(workshopLanePlaces(budget, { layout: {} })).toEqual(workshopLanePlaces(budget))
    expect(workshopLanePlaces(budget, { layout: { lanesPerRow: 9 } })).toEqual(workshopLanePlaces(budget))
  })

  it('wraps to rows of lanesPerRow, each row as tall as its own fullest lane', () => {
    const two = workshopLanePlaces(budget, { layout: { lanesPerRow: 2 } })
    expect(two.places.map(place => [place.laneId, place.x, place.y, place.height, place.column, place.row])).toEqual([
      ['reserve', 0, 0, 362, 0, 0], ['calls', 244, 0, 362, 1, 0], ['newsletter', 0, 374, 186, 0, 1], ['pilot', 244, 374, 186, 1, 1],
    ])
    expect([two.width, two.height]).toEqual([488, 560])
    const one = workshopLanePlaces(budget, { layout: { lanesPerRow: 1 } })
    expect(one.places.map(place => [place.x, place.y, place.height, place.row])).toEqual([[0, 0, 362, 0], [0, 374, 274, 1], [0, 660, 186, 2], [0, 858, 186, 3]])
    expect([one.width, one.height]).toEqual([244, 1044])
  })

  it('draws the notes where the places say, with cards under their own lane', () => {
    const origin = { x: 100, y: 50 }
    const layout = { lanesPerRow: 2 }
    const byId = new Map(workshopToSlate(budget, { native: true, origin, layout }).nodes.map(node => [node.options.id as string, node.options]))
    for (const place of workshopLanePlaces(budget, { layout }).places) {
      expect(byId.get('column-' + place.laneId)!).toMatchObject({ xPos: origin.x + place.x + 2, yPos: origin.y + place.y, width: 240, height: place.height })
      expect(byId.get('lane-' + place.laneId)!).toMatchObject({ xPos: origin.x + place.x + 8, yPos: origin.y + place.y + 6 })
    }
    expect(byId.get('card-fund-0')!).toMatchObject({ xPos: 100 + 244 + 8, yPos: 50 + 98 })
    // The same notes, by name, whatever the layout.
    expect([...byId.keys()].sort()).toEqual(workshopToSlate(budget, { native: true }).nodes.map(node => node.options.id as string).sort())
  })

  it('keeps each lane at least as tall as the committed board while a card is held, lane by lane', () => {
    const layout = { lanesPerRow: 1 }
    const committed = workshopLanePlaces(budget, { layout })
    const moved = workshopCandidate(budget, 'fund-1', 'pilot')!
    // Unheld, the preview would shrink Unallocated and move every lane below it.
    expect(workshopLanePlaces(moved, { layout }).places[1].y).toBeLessThan(committed.places[1].y)
    const rows = budget.lanes.map(lane => budget.cards.filter(card => card.laneId === lane.id).length)
    const held = workshopLanePlaces(moved, { layout, rows })
    expect(held.places.slice(0, 3)).toEqual(committed.places.slice(0, 3))
    // The lane that gains the card grows; nothing above it moves.
    expect(held.places[3]).toEqual({ ...committed.places[3], height: committed.places[3].height + 88 })
    // One number still means the same minimum for every lane.
    expect(workshopLanePlaces(moved, { rows: 2 }).places.map(place => place.height)).toEqual(committed.places.map(() => 362))
  })

  it('refuses a layout that makes no sense, and leaves a map where its author put it', () => {
    for (const lanesPerRow of [0, -1, 1.5, Number.NaN, '2' as unknown as number]) {
      expect(() => workshopLanePlaces(budget, { layout: { lanesPerRow } })).toThrow('lanesPerRow must be a whole number, 1 or more.')
      expect(() => workshopToSlate(budget, { native: true, layout: { lanesPerRow } })).toThrow('lanesPerRow must be a whole number, 1 or more.')
    }
    expect(workshopLanePlaces(nightTransfer, { layout: { lanesPerRow: 1 } })).toEqual(workshopLanePlaces(nightTransfer))
    expect(workshopLanePlaces(nightTransfer).places.map(place => [place.laneId, place.column, place.row])).toEqual([
      ['platform', 0, 0], ['stairs', 1, 0], ['lift', 0, 1], ['shuttle', 1, 1],
    ])
  })
})
