// Boards S2b (owner addenda, 2026-11-22): notes ALWAYS convert on boards, a map's own included (a note dropped on
// a station is a card there, which the paths never constrain: the token stays the only piece they do), a kind
// that truly cannot hold a card says so; a map's paths are fixed outside focus and editable in it (connect,
// remove, re-route; one change each, the edits chat and exec make); a plan's span is adjustable in focus.
import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, availableLanes, createBudgetWorkshop, createInterviewWorkshop, nightTransfer, releasePlan, validateWorkshop,
  workshopCandidate, workshopCardAsNote, workshopCardAsNoteRefusal, workshopCardNoteText, workshopNoteCandidate, workshopNoteRefusal,
  workshopLaneCaption, workshopRefusal, workshopTakesNotes, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { mapEditsBetween, mapGripNotes, mapGripOf, mapGripSize, mapPathDrop, mapPathSegments, mapStationAt, paintMap } from '../../src/workshops/mapPaths'
import { goLiveSample } from '../../src/workshops/rules'
import { launchPlanKit } from '../../src/boards'
import '../../src/workshops/behaviour'

/** The library's decision path: The question leads to Option A and Option B; both lead to Decide. */
const decision = (): Workshop => validateWorkshop({ version: 1, title: 'Decision path', lanes: [
  { id: 'question', label: 'The question', station: { column: 0, row: 0, next: ['option-a', 'option-b'], outcome: 'Say what you are deciding.' } },
  { id: 'option-a', label: 'Option A', station: { column: 1, row: 0, next: ['decide'], outcome: 'Weigh the first option.' } },
  { id: 'option-b', label: 'Option B', station: { column: 1, row: 1, next: ['decide'], outcome: 'Weigh the second option.' } },
  { id: 'decide', label: 'Decide', station: { column: 2, row: 0, next: [], outcome: 'Write down what you chose and why.' } },
], cards: [{ id: 'token', label: 'Our choice', laneId: 'question' }] })

const applied = (board: Workshop, edits: Parameters<typeof applyWorkshopEdits>[1]) => {
  const result = applyWorkshopEdits(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result
}
const refusedBy = (board: Workshop, edits: Parameters<typeof applyWorkshopEdits>[1]) => {
  const result = applyWorkshopEdits(board, edits)
  return 'refused' in result ? result.refused.reason : null
}

describe('a note dropped on a map’s station becomes a card there', () => {
  it('every kind of board is offered notes; a map takes them (the station exclusion is lifted)', () => {
    for (const board of [decision(), nightTransfer, releasePlan, createInterviewWorkshop(), createBudgetWorkshop()]) expect(workshopTakesNotes(board)).toBe(true)
    const next = workshopNoteCandidate(decision(), 'option-b', { id: 'node_1', label: 'Cheaper, slower' })!
    expect(next.cards.at(-1)).toEqual({ id: 'node_1', label: 'Cheaper, slower', laneId: 'option-b', free: true })
    expect(validateWorkshop(next)).toEqual(next)
    expect(workshopNoteRefusal(decision(), 'decide', { id: 'n', label: 'Anything' })).toBeNull()
    // A map's lines are its paths: a note joined to others by lines stays a note, and says why.
    expect(workshopNoteRefusal(decision(), 'decide', { id: 'n', label: 'Joined', lines: [{ id: 'l1', parentId: 'n', childId: 'other' }] }))
      .toBe('A note joined to other notes by lines stays a note on a map: a map’s lines are its paths.')
  })

  it('the token stays the only piece the paths constrain: a card made from a note goes to any station', () => {
    const board = workshopNoteCandidate(decision(), 'option-b', { id: 'node_1', label: 'Cheaper' })!
    const free = board.cards.find(card => card.id === 'node_1')!
    // Option B leads only to Decide; the card goes to The question and Option A all the same.
    expect(availableLanes(board, free).map(lane => lane.id)).toEqual(['question', 'option-a', 'option-b', 'decide'])
    expect(workshopCandidate(board, 'node_1', 'question')!.cards.find(card => card.id === 'node_1')!.laneId).toBe('question')
    expect(workshopRefusal(board, 'node_1', 'question')).toBeNull()
    // The token still follows them.
    expect(workshopCandidate(board, 'token', 'decide')).toBeNull()
    expect(workshopRefusal(board, 'token', 'decide')).toBe('Decide can\'t be reached from The question.')
    expect(workshopCandidate(board, 'token', 'option-a')).not.toBeNull()
  })

  it('leaving restores the note; the token stays on the map', () => {
    const board = workshopNoteCandidate(decision(), 'option-b', { id: 'node_1', label: 'Cheaper', asNote: { shape: 'diamond' } })!
    expect(workshopCardAsNoteRefusal(board, 'node_1')).toBeNull()
    expect(workshopCardAsNote(board, 'node_1')!.cards.map(card => card.id)).toEqual(['token'])
    expect(board.cards.at(-1)!.asNote).toEqual({ shape: 'diamond' })
    expect(workshopCardAsNoteRefusal(board, 'token')).toBe('The token stays on the map.')
  })

  it('a card made from a note is drawn as a note is; the token keeps its token colour', () => {
    const board = workshopNoteCandidate(decision(), 'option-a', { id: 'kept', label: 'Kept', look: { backgroundColor: '#f0d399' } })!
    const nodes = workshopToSlate(board, { native: true }).nodes
    expect(nodes.find(node => node.options.id === 'card-kept')!.options.backgroundColor).toBe('#f0d399')
    expect(nodes.find(node => node.options.id === 'card-token')!.options.backgroundColor).toBe('#ffda75')
  })

  it('a map still needs its token, and `free` belongs to maps only', () => {
    const board = workshopNoteCandidate(decision(), 'option-a', { id: 'kept', label: 'Kept' })!
    expect(() => validateWorkshop({ ...board, cards: board.cards.filter(card => card.id !== 'token') })).toThrow('A map needs at least one token.')
    expect(refusedBy(board, [{ kind: 'remove_card', card: { id: 'token' } }])).toBe('A map needs at least one token.')
    expect(() => validateWorkshop({ version: 1, title: 'T', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [{ id: 'x', label: 'X', laneId: 'a', free: true }] }))
      .toThrow('Only a map’s cards can be free of its paths.')
  })

  it('exec’s add_card makes the same card a drop makes (free: true), or a token as before', () => {
    const made = applied(decision(), [{ kind: 'add_card', lane: 'Option A', label: 'Ask legal', free: true }])
    expect(made.workshop.cards.at(-1)).toMatchObject({ label: 'Ask legal', laneId: 'option-a', free: true })
    expect(made.report.edits[0].said).toBe('Added “Ask legal” to “Option A”.')
    const token = applied(decision(), [{ kind: 'add_card', lane: 'Option A', label: 'Second' }])
    expect(token.workshop.cards.at(-1)).toEqual({ id: 'token-1', label: 'Second', laneId: 'option-a' })
  })

  it('a release plan takes a note as a feature: the points written on it, or 1; and gives it back with them', () => {
    const three = workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_9', label: 'Audit log · 3 points' })!
    expect(three.cards.at(-1)).toEqual({ id: 'node_9', label: 'Audit log', laneId: 'backlog', points: 3 })
    const one = workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_8', label: 'Dark mode' })!
    expect(one.cards.at(-1)).toMatchObject({ label: 'Dark mode', points: 1 })
    expect(workshopCardNoteText(three, three.cards.at(-1)!)).toBe('Audit log · 3 points')
    // A release's points budget still decides: Friday holds 8 and has 3.
    expect(workshopNoteRefusal(releasePlan, 'friday', { id: 'n', label: 'Huge · 9 points' })).toBe('Needs 9 points. It already holds 3 of 8 points.')
    // A feature another depends on stays a card.
    expect(workshopCardAsNoteRefusal(releasePlan, 'guardrails')).toBe('Team invitations depends on Permission checks, so it stays a card.')
    expect(workshopCardAsNoteRefusal(three, 'node_9')).toBeNull()
  })

  it('a release plan’s feature saves with its points: the words the canvas sends make the same feature (canvas, host, back)', () => {
    const canvas = workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_9', label: 'Audit log · 3 points' })!
    const card = canvas.cards.at(-1)!
    // What the canvas sends the host for the card: its words with its points, never the bare name.
    const sent = workshopCardNoteText(canvas, card)
    expect(sent).toBe('Audit log · 3 points')
    const host = workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_9', label: sent })!
    expect(host.cards.at(-1)).toEqual(card)
    expect(workshopCardNoteText(host, host.cards.at(-1)!)).toBe('Audit log · 3 points')
    // One point says itself in the singular and comes back as one.
    const one = workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_8', label: 'Dark mode' })!
    expect(workshopNoteCandidate(releasePlan, 'backlog', { id: 'node_8', label: workshopCardNoteText(one, one.cards.at(-1)!) })!.cards.at(-1)).toEqual(one.cards.at(-1))
  })

  it('a kind that truly cannot hold a card says so, in words shown on the board (never silent)', () => {
    expect(workshopNoteRefusal(createInterviewWorkshop(), 'interviews', { id: 'n', label: 'Kim' }))
      .toBe('This workshop keeps the cards it came with: its cards are its interviews. Keep the note beside it.')
    expect(workshopNoteRefusal(createBudgetWorkshop(), 'reserve', { id: 'n', label: 'More' }))
      .toBe('This workshop keeps the cards it came with: each card is $200 of its budget. Keep the note beside it.')
  })
})

describe('a map’s paths, changed on purpose (in focus, chat and exec)', () => {
  const places = (board: Workshop) => mapPathSegments(board)

  it('the paths as segments between the stations, clear of both', () => {
    const segments = places(decision())
    expect(segments.map(s => s.key)).toEqual(['question>option-a', 'question>option-b', 'option-a>decide', 'option-b>decide'])
    for (const s of segments) expect(Math.hypot(s.x2 - s.x1, s.y2 - s.y1)).toBeGreaterThan(8)
  })

  it('the grips in focus: one to draw a new path from each step, one at the end of each path', () => {
    const notes = mapGripNotes(decision(), { x: 100, y: 50 })
    expect(notes.map(n => n.options.id)).toEqual([
      'handle-_link-question', 'handle-_link-option-a', 'handle-_link-option-b', 'handle-_link-decide',
      'handle-_route-question~option-a', 'handle-_route-question~option-b', 'handle-_route-option-a~decide', 'handle-_route-option-b~decide'])
    for (const n of notes) expect(Math.min(n.options.width as number, n.options.height as number)).toBeGreaterThanOrEqual(40)
    expect(mapGripOf('handle-_link-option-a')).toEqual({ kind: 'link', from: 'option-a' })
    expect(mapGripOf('handle-_route-option-a~decide')).toEqual({ kind: 'route', from: 'option-a', to: 'decide' })
    expect(mapGripOf('handle-launch')).toBeNull()
  })

  it('a link grip dropped on a step connects it; a route grip re-routes the path, as one change', () => {
    const board = decision()
    const connect = mapPathDrop(board, { kind: 'link', from: 'option-b' }, 'option-a')
    expect(connect.next!.lanes.find(l => l.id === 'option-b')!.station!.next).toEqual(['decide', 'option-a'])
    expect(mapEditsBetween(board, connect.next!)).toEqual([{ kind: 'connect_stations', from: { id: 'option-b' }, to: { id: 'option-a' } }])
    const reroute = mapPathDrop(board, { kind: 'route', from: 'option-a', to: 'decide' }, 'option-b')
    expect(reroute.next!.lanes.find(l => l.id === 'option-a')!.station!.next).toEqual(['option-b'])
    expect(mapEditsBetween(board, reroute.next!)).toEqual([
      { kind: 'disconnect_stations', from: { id: 'option-a' }, to: { id: 'decide' } },
      { kind: 'connect_stations', from: { id: 'option-a' }, to: { id: 'option-b' } }])
    const made = applied(board, mapEditsBetween(board, reroute.next!))
    expect(made.workshop).toEqual(reroute.next)
  })

  it('a drop the map cannot take says why and changes nothing', () => {
    const board = decision()
    expect(mapPathDrop(board, { kind: 'link', from: 'option-a' }, 'option-a')).toEqual({ next: null, refusal: 'A path joins two different steps.' })
    expect(mapPathDrop(board, { kind: 'link', from: 'option-a' }, 'decide')).toEqual({ next: null, refusal: 'Option A already leads to Decide.' })
    expect(mapPathDrop(board, { kind: 'link', from: 'option-a' }, null)).toEqual({ next: board })
    // A route grip let go on the step it already leads to changes nothing.
    expect(mapPathDrop(board, { kind: 'route', from: 'option-a', to: 'decide' }, 'decide')).toEqual({ next: board })
    expect(mapPathDrop(board, { kind: 'route', from: 'question', to: 'option-a' }, 'option-b')).toEqual({ next: null, refusal: 'The question already leads to Option B.' })
  })

  it('the station under a point (board coordinates), for a dropped grip', () => {
    const board = decision()
    const seg = places(board)[0]
    expect(mapStationAt(board, { x: seg.x1 - 60, y: seg.y1 })).toBe('question')
    expect(mapStationAt(board, { x: -500, y: -500 })).toBeNull()
  })

  it('chat and exec say the same: connect and disconnect, one edit each', () => {
    const board = decision()
    expect(applied(board, [{ kind: 'connect_stations', from: 'Option B', to: 'Option A' }]).report.edits[0].said).toBe('Connected “Option B” to “Option A”.')
    expect(applied(board, [{ kind: 'disconnect_stations', from: 'Option A', to: 'Decide' }]).report.edits[0].said).toBe('Removed the path from “Option A” to “Decide”.')
  })
})

describe('a plan’s span, adjustable while the board is in focus', () => {
  const svg = () => document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  const roles = (root: SVGSVGElement) => [...root.querySelectorAll('[data-board-layer]')].map(el => el.getAttribute('data-board-layer'))
  const state = (focused: boolean, narrow = false) => ({ origin: { x: 0, y: 0 }, layout: narrow ? { narrow: true, width: 390 } : { width: 1200 }, clamp: null, refused: false, boardFocused: focused })

  it('in focus, the start edge and go-live say what they are and when, as grips you can hold', () => {
    const root = svg()
    const layer = launchPlanKit.layer({ canvas: { node: root } })
    const board = validateWorkshop(goLiveSample('2026-11-21'))
    layer.draw(board, null, state(false))
    expect(roles(root)).not.toContain('span-start')
    layer.draw(board, null, state(true))
    expect(roles(root)).toEqual(expect.arrayContaining(['span-start', 'span-end']))
    expect(root.querySelector('[data-board-layer="span-start"]')!.textContent).toBe('Starts Mon 23 Nov')
    expect(root.querySelector('[data-board-layer="span-end"]')!.textContent).toBe('Go-live Fri 18 Dec')
    layer.destroy()
  })

  it('on a phone the grips are a finger’s size', () => {
    const board = validateWorkshop(goLiveSample('2026-11-21'))
    const parts = launchPlanKit.places(board, { narrow: true, width: 390 }).parts
    for (const name of ['handle-_first', 'handle-launch']) {
      const part = parts.find(p => p.name === name)!
      expect(Math.min(part.width, part.height)).toBeGreaterThanOrEqual(44)
    }
  })
})

describe('a map step’s limit counts its tokens: a card made from a note is free of it', () => {
  /** The decision path with a limit of one at Decide, the token there. */
  const full = (): Workshop => validateWorkshop({ ...decision(), lanes: decision().lanes.map(lane => lane.id === 'decide' ? { ...lane, capacity: 1 } : lane),
    cards: [{ id: 'token', label: 'Our choice', laneId: 'decide' }] })

  it('a note dropped on a full step is a card there, alone or several at once', () => {
    const board = full()
    expect(workshopNoteRefusal(board, 'decide', { id: 'node_1', label: 'Ask legal' })).toBeNull()
    const one = workshopNoteCandidate(board, 'decide', { id: 'node_1', label: 'Ask legal' })!
    expect(one.cards.at(-1)).toEqual({ id: 'node_1', label: 'Ask legal', laneId: 'decide', free: true })
    expect(validateWorkshop(one)).toEqual(one)
    const two = workshopNoteCandidate(one, 'decide', { id: 'node_2', label: 'Ask finance' })!
    expect(two.cards.filter(card => card.laneId === 'decide')).toHaveLength(3)
    // The caption counts the tokens against the limit and says the cards beside them apart.
    expect(workshopLaneCaption(two, 'decide')).toBe('1 / 1 · +2')
    expect(workshopLaneCaption(board, 'decide')).toBe('1 / 1')
  })

  it('a free card moves or is added to a full step; a token still finds it full', () => {
    const board = workshopNoteCandidate(full(), 'question', { id: 'node_1', label: 'Ask legal' })!
    expect(workshopCandidate(board, 'node_1', 'decide')!.cards.find(card => card.id === 'node_1')!.laneId).toBe('decide')
    expect(applied(board, [{ kind: 'move_card', card: { id: 'node_1' }, lane: { id: 'decide' } }]).workshop.cards.find(card => card.id === 'node_1')!.laneId).toBe('decide')
    const added = applied(full(), [{ kind: 'add_card', lane: { id: 'decide' }, label: 'Ask finance', free: true }])
    expect(added.workshop.cards.at(-1)).toMatchObject({ label: 'Ask finance', laneId: 'decide', free: true })
    // A second token at Decide is refused in words: the limit is a step's tokens.
    const second = validateWorkshop({ ...full(), cards: [...full().cards, { id: 'other', label: 'Second', laneId: 'option-a' }] })
    expect(workshopCandidate(second, 'other', 'decide')).toBeNull()
    expect(workshopRefusal(second, 'other', 'decide')).toBe('It already holds 1 of 1 token.')
  })

  it('a token goes to a step with a limit of one that holds only a free card, and the board is valid', () => {
    const board = validateWorkshop({ ...decision(), lanes: decision().lanes.map(lane => lane.id === 'option-a' ? { ...lane, capacity: 1 } : lane),
      cards: [{ id: 'token', label: 'Our choice', laneId: 'question' }, { id: 'node_1', label: 'Ask legal', laneId: 'option-a', free: true }] })
    const moved = workshopCandidate(board, 'token', 'option-a')!
    expect(moved.cards.find(card => card.id === 'token')!.laneId).toBe('option-a')
    expect(validateWorkshop(moved)).toEqual(moved)
    expect(applied(board, [{ kind: 'move_card', card: { id: 'token' }, lane: { id: 'option-a' } }]).workshop.cards.find(card => card.id === 'token')!.laneId).toBe('option-a')
  })

  it('set_lane_capacity counts tokens: free cards never stop a limit of one', () => {
    const board = validateWorkshop({ ...decision(), cards: [{ id: 'token', label: 'Our choice', laneId: 'decide' },
      { id: 'node_1', label: 'Ask legal', laneId: 'decide', free: true }, { id: 'node_2', label: 'Ask finance', laneId: 'decide', free: true }] })
    const limited = applied(board, [{ kind: 'set_lane_capacity', lane: { id: 'decide' }, capacity: 1 }])
    expect(limited.workshop.lanes.find(lane => lane.id === 'decide')!.capacity).toBe(1)
    // Two tokens there are still too many for one.
    const tokens = validateWorkshop({ ...board, cards: [...board.cards, { id: 'other', label: 'Second', laneId: 'decide' }] })
    expect(refusedBy(tokens, [{ kind: 'set_lane_capacity', lane: { id: 'decide' }, capacity: 1 }])).toMatch(/already holds 2 tokens/)
  })
})

describe('a map’s grips and paths are a finger’s size on screen, at the zoom the map is shown at', () => {
  it('the grip size grows as the map is shown smaller (a phone fits a map at about half size)', () => {
    expect(mapGripSize(1)).toBe(44)
    expect(mapGripSize(2)).toBe(40)
    for (const zoom of [0.48, 0.4, 0.3]) {
      const size = mapGripSize(zoom)
      expect(size * zoom).toBeGreaterThanOrEqual(44)
      for (const n of mapGripNotes(decision(), { x: 0, y: 0 }, size)) expect(Math.min(n.options.width as number, n.options.height as number) * zoom).toBeGreaterThanOrEqual(44)
    }
  })

  it('a path’s hit area is a finger’s thickness at that zoom, in focus and out', () => {
    const size = mapGripSize(0.48)
    for (const boardFocused of [true, false]) {
      const shapes = paintMap(decision(), { origin: { x: 0, y: 0 }, layout: {}, clamp: null, refused: false, boardFocused, gripSize: size } as any)
      const paths = shapes.filter(shape => shape.t === 'path') as { hit?: number }[]
      expect(paths.length).toBe(4)
      for (const path of paths) expect(path.hit! * 0.48).toBeGreaterThanOrEqual(44)
    }
  })
})
