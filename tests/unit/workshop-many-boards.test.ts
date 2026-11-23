import { afterEach, describe, expect, it, vi } from 'vitest'
import { kitFor } from '../../src/boards'
import {
  attachWorkshop, validateWorkshop, workshopFreeSpot, workshopNodeIds, workshopPresentationScenes, workshopReserve, workshopToSlate, type Workshop,
} from '../../src/workshops/model'
import { catalogFits, catalogPreset, maxBoardsPerSlate } from '../../src/workshops/catalog'
import { sampleLaunchPlan, samplePipeline } from '../../src/workshops/rules'
import '../../src/workshops/behaviour'

/**
 * Groundwork for many boards on one slate (plan S3a): each board's notes are named in its own scope,
 * "beside the board" places avoid the other boards, an undo on one board never touches another, a
 * board says how much room it needs, and the library's gate opens only when the host asks for many.
 */

/** A slate with what attachWorkshop asks of it, which takes any number of boards' policies. */
function slateOfBoards() {
  const notes = new Map<string, any>()
  const policies: any[] = []
  const svg = (name: string) => document.createElementNS('http://www.w3.org/2000/svg', name)
  const make = (options: any) => {
    const node: any = { id: options.id, options: { ...options }, relationships: { associations: [], addAssociation() {}, removeAssociation() {}, getAssociations: () => [] },
      position(x: number, y: number) { node.options.x = x; node.options.y = y }, setText(text: string) { node.options.text = text }, setShape() {},
      svgGroup: { node: svg('g'), front() {} } }
    notes.set(options.id, node)
    return node
  }
  const slate: any = {
    canvas: { node: svg('svg') },
    announce() {},
    nodes: {
      add: make,
      one: (id: string) => notes.get(id),
      remove: (id: string) => notes.delete(id),
      get allNodes() { return [...notes.values()] },
    },
    addNode: make,
    removeNode: (id: string) => notes.delete(id),
    hitTestNodes: (point: { x: number; y: number }, nodes: any[], { padding = 0 } = {}) => nodes.find(node => {
      const o = node.options
      return point.x >= o.x - padding && point.x <= o.x + o.width + padding && point.y >= o.y - padding && point.y <= o.y + o.height + padding
    }) ?? null,
    setDragPolicy(policy: any) { policies.push(policy); return () => { policies.splice(policies.indexOf(policy), 1) } },
    withPolicyAuthority: (fn: () => void) => fn(),
  }
  return { slate, notes, policies }
}

/** The retro from the library, with the same two cards on each copy (as two copies of one preset have). */
function retro(): Workshop {
  const board = catalogPreset('retro')
  return validateWorkshop({ ...board, cards: [{ id: 'kind', label: 'Kind reviews', laneId: 'well' }, { id: 'ci', label: 'Slow CI', laneId: 'change' }] })
}

afterEach(() => { vi.restoreAllMocks() })

describe('scoped note names: two copies of one preset side by side', () => {
  it('draws each board under its own names, the first board under today’s names, with no stand-ins and no warnings', async () => {
    const warn = vi.spyOn(console, 'warn')
    const { slate, notes } = slateOfBoards()
    const first = attachWorkshop(slate, retro(), { origin: { x: 0, y: 0 }, scope: 'main' })
    await first.whenDrawn()
    const today = [...notes.keys()].sort()
    const second = attachWorkshop(slate, retro(), { origin: { x: 1380, y: 0 }, scope: 'b2' })
    await second.whenDrawn()
    const ids = [...notes.keys()]
    const mine = ids.filter(id => id.startsWith('b2:'))
    const theirs = ids.filter(id => !id.startsWith('b2:'))
    // The first board keeps exactly the names a one-board slate has always had.
    expect(theirs.sort()).toEqual(today)
    expect(theirs).toContain('card-kind')
    expect(theirs).toContain('lane-well')
    // The second board's notes are the same parts, each under its scope: disjoint, and no `--2` stand-ins.
    expect(mine.sort()).toEqual(today.map(id => 'b2:' + id).sort())
    expect(ids.some(id => id.includes('--'))).toBe(false)
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('WORKSHOP: the slate already has a note named'))
    first.destroy()
    second.destroy()
    expect(notes.size).toBe(0)
  })

  it('a board treats only its own scope as its parts: a drop on the second board’s lane is the second board’s card', async () => {
    const { slate, notes, policies } = slateOfBoards()
    const changes: { board: string; next: Workshop }[] = []
    const first = attachWorkshop(slate, retro(), { origin: { x: 0, y: 0 }, onChange: next => { changes.push({ board: 'main', next }) } })
    const second = attachWorkshop(slate, retro(), { origin: { x: 1380, y: 0 }, scope: 'b2', onChange: next => { changes.push({ board: 'b2', next }) } })
    await Promise.all([first.whenDrawn(), second.whenDrawn()])
    // Each board governs its own notes only.
    expect(policies[0].governs(notes.get('card-kind'))).toMatchObject({ canMove: true })
    expect(policies[0].governs(notes.get('b2:card-kind'))).toBeNull()
    expect(policies[1].governs(notes.get('b2:card-kind'))).toMatchObject({ canMove: true })
    expect(policies[1].governs(notes.get('card-kind'))).toBeNull()
    // An ordinary note dropped on the second board's "Try" column: the first board does not claim it, the second takes it.
    const column = notes.get('b2:column-try').options
    const at = { x: column.x + 40, y: column.y + 120 }
    const note = slate.addNode({ id: 'note-1', text: 'Pair more', x: at.x - 20, y: at.y - 20, width: 180, height: 60 })
    expect(policies[0].onFreeDrop(note, at)).toBeUndefined()
    expect(policies[1].onFreeDrop(note, at)).toBe('taken')
    expect(changes.map(change => change.board)).toEqual(['b2'])
    expect(second.value.cards.find(card => card.id === 'note-1')?.laneId).toBe('try')
    expect(first.value.cards.some(card => card.id === 'note-1')).toBe(false)
    await second.whenDrawn()
    expect(notes.has('b2:card-note-1')).toBe(true)
    expect(notes.has('card-note-1')).toBe(false)
    first.destroy()
    second.destroy()
  })

  it('keeps the names across a reload (the notes replaced), in whichever order the boards draw', async () => {
    const { slate, notes, policies } = slateOfBoards()
    const second = attachWorkshop(slate, retro(), { origin: { x: 1380, y: 0 }, scope: 'b2' })
    const first = attachWorkshop(slate, retro(), { origin: { x: 0, y: 0 } })
    await Promise.all([first.whenDrawn(), second.whenDrawn()])
    const before = [...notes.keys()].sort()
    notes.clear()
    for (const policy of policies.slice().reverse()) policy.onNotesReplaced()
    await Promise.all([first.whenDrawn(), second.whenDrawn()])
    expect([...notes.keys()].sort()).toEqual(before)
    first.destroy()
    second.destroy()
  })

  it('a scoped business board names its kit’s parts in its scope too', async () => {
    const { slate, notes } = slateOfBoards()
    const board = validateWorkshop(samplePipeline())
    const attached = attachWorkshop(slate, board, { kit: kitFor('pipeline'), origin: { x: 0, y: 0 }, scope: 'b3' })
    await attached.whenDrawn()
    const ids = [...notes.keys()]
    expect(ids.length).toBeGreaterThan(0)
    expect(ids.every(id => id.startsWith('b3:'))).toBe(true)
    expect(ids).toContain('b3:card-' + board.cards[0].id)
    attached.destroy()
  })

  it('refuses a scope that is not a short lowercase name, and treats main as no scope', () => {
    const { slate } = slateOfBoards()
    expect(() => attachWorkshop(slate, retro(), { scope: 'B 2' })).toThrow('A board scope is 1 to 12 lowercase letters and digits.')
    expect(() => attachWorkshop(slate, retro(), { scope: 'b2:x' })).toThrow('A board scope is 1 to 12 lowercase letters and digits.')
    expect(workshopNodeIds.of('main').card('kind')).toBe('card-kind')
    expect(workshopNodeIds.of(undefined).lane('well')).toBe('lane-well')
    expect(workshopNodeIds.of('b2').card('kind')).toBe('b2:card-kind')
    expect(workshopNodeIds.of('b2').column('well')).toBe('b2:column-well')
    expect(workshopNodeIds.of('b2').caption('well')).toBe('b2:caption-well')
    expect(workshopNodeIds.of('b2').image('well')).toBe('b2:image-well')
    expect(workshopNodeIds.of('b2').rules).toBe('b2:rules-board')
    expect(() => workshopNodeIds.of('Bad!')).toThrow('A board scope is 1 to 12 lowercase letters and digits.')
  })

  it('draws scoped artwork and presentation scenes, and leaves the unscoped drawing exactly as it was', () => {
    const board = retro()
    for (const native of [true, false]) {
      const plain = workshopToSlate(board, { native })
      expect(JSON.stringify(workshopToSlate(board, { native, scope: 'main' }))).toBe(JSON.stringify(plain))
      const scoped = workshopToSlate(board, { native, scope: 'b2' })
      expect(scoped.nodes.map(node => node.options.id)).toEqual(plain.nodes.map(node => 'b2:' + node.options.id))
      for (const link of scoped.nodes.flatMap(node => node.relationships.associations)) {
        expect(String(link.parentId).startsWith('b2:')).toBe(true)
        expect(String(link.childId).startsWith('b2:')).toBe(true)
      }
    }
    const scenes = workshopPresentationScenes(board)
    expect(JSON.stringify(workshopPresentationScenes(board, { scope: 'main' }))).toBe(JSON.stringify(scenes))
    expect(workshopPresentationScenes(board, { scope: 'b2' }).map(scene => scene.nodeIds)).toEqual(scenes.map(scene => scene.nodeIds.map(id => 'b2:' + id)))
  })
})

describe('undo on one board never touches another', () => {
  it('a note an undo brings back leaves only the board that took it, though another board has a card by the same id', async () => {
    const { slate, policies } = slateOfBoards()
    const changes: string[] = []
    const lone = (cards: Workshop['cards']) => validateWorkshop({ ...retro(), cards })
    // Both boards come to hold a card "kind": the second always had it; the first took the note "kind" since the record.
    const first = attachWorkshop(slate, lone([{ id: 'ci', label: 'Slow CI', laneId: 'change' }]), { origin: { x: 0, y: 0 }, onChange: (_next, change) => { changes.push('main ' + JSON.stringify(change)) } })
    const second = attachWorkshop(slate, lone([{ id: 'kind', label: 'Kind reviews', laneId: 'well' }]), { origin: { x: 1380, y: 0 }, scope: 'b2',
      onChange: (_next, change) => { changes.push('b2 ' + JSON.stringify(change)) } })
    await Promise.all([first.whenDrawn(), second.whenDrawn()])
    const record = policies.map(policy => policy.undoState())
    first.update(lone([{ id: 'ci', label: 'Slow CI', laneId: 'change' }, { id: 'kind', label: 'Kind reviews', laneId: 'well' }]))
    // Undo goes back to the record: the note "kind" is on the canvas again.
    policies.forEach((policy, at) => policy.onUndoRestore(record[at], { added: ['kind'], removed: [] }))
    expect(first.value.cards.map(card => card.id)).toEqual(['ci'])
    expect(second.value.cards.map(card => card.id)).toEqual(['kind'])
    expect(changes).toEqual(['main ' + JSON.stringify({ cardId: 'kind', cardToNote: { noteId: 'kind' }, via: 'undo' })])
    first.destroy()
    second.destroy()
  })

  it('a note an undo takes away comes back as a card only on the board whose record held it', async () => {
    const { slate, policies } = slateOfBoards()
    const lone = (cards: Workshop['cards']) => validateWorkshop({ ...retro(), cards })
    const first = attachWorkshop(slate, lone([{ id: 'kind', label: 'Kind reviews', laneId: 'well' }]), { origin: { x: 0, y: 0 } })
    const second = attachWorkshop(slate, lone([]), { origin: { x: 1380, y: 0 }, scope: 'b2' })
    await Promise.all([first.whenDrawn(), second.whenDrawn()])
    const record = policies.map(policy => policy.undoState())
    first.update(lone([]))
    policies.forEach((policy, at) => policy.onUndoRestore(record[at], { added: [], removed: ['kind'] }))
    expect(first.value.cards.map(card => card.id)).toEqual(['kind'])
    expect(second.value.cards).toEqual([])
    first.destroy()
    second.destroy()
  })
})

describe('"beside the board" avoids the other boards', () => {
  it('workshopFreeSpot moves a spot past every box it would land on, on its side, and leaves a free spot alone', () => {
    const spot = { x: 1000, y: 100, width: 228, height: 76 }
    expect(workshopFreeSpot(spot, [])).toEqual({ x: 1000, y: 100 })
    expect(workshopFreeSpot(spot, [{ x: 0, y: 0, width: 968, height: 600 }])).toEqual({ x: 1000, y: 100 })
    // Board B starts 32 to the right: the note goes past it.
    const b = { x: 1100, y: 0, width: 1220, height: 600 }
    expect(workshopFreeSpot(spot, [b])).toEqual({ x: 2352, y: 100 })
    // And past a third board right after that.
    expect(workshopFreeSpot(spot, [b, { x: 2400, y: 50, width: 300, height: 100 }])).toEqual({ x: 2732, y: 100 })
    // A box above or below the spot's row is not in the way.
    expect(workshopFreeSpot(spot, [{ x: 900, y: 400, width: 600, height: 100 }])).toEqual({ x: 1000, y: 100 })
    // To the left: past the box's left edge.
    expect(workshopFreeSpot({ x: -300, y: 100, width: 228, height: 76 }, [{ x: -900, y: 0, width: 700, height: 600 }], -1)).toEqual({ x: -1160, y: 100 })
  })

  it('a card taken to the canvas beside its board lands clear of the next board', async () => {
    const { slate, notes } = slateOfBoards()
    const near = { x: 760, y: 0, width: 1220, height: 700 }
    const first = attachWorkshop(slate, retro(), { origin: { x: 0, y: 0 }, avoid: () => [near], onChange: () => {} })
    await first.whenDrawn()
    expect(first.toCanvas('kind')).toBeNull()
    const note = notes.get('kind').options
    expect(note.x).toBeGreaterThanOrEqual(near.x + near.width)
    // Without anything to avoid it lands just beside the board, as it always has.
    const { slate: alone, notes: aloneNotes } = slateOfBoards()
    const board = attachWorkshop(alone, retro(), { origin: { x: 0, y: 0 }, onChange: () => {} })
    await board.whenDrawn()
    expect(board.toCanvas('kind')).toBeNull()
    expect(aloneNotes.get('kind').options.x).toBe(board.bounds.width + 32)
    first.destroy()
    board.destroy()
  })

  it('a note typed on a full lane moves out beside the board, clear of the next board', async () => {
    const { slate, notes, policies } = slateOfBoards()
    slate.broadcast = () => {}
    const near = { x: 500, y: 0, width: 1220, height: 700 }
    const board = validateWorkshop({ version: 1, title: 'Retro', lanes: [{ id: 'well', label: 'Went well' }, { id: 'try', label: 'Try', capacity: 1 }],
      cards: [{ id: 'ci', label: 'Slow CI', laneId: 'try' }] })
    const attached = attachWorkshop(slate, board, { origin: { x: 0, y: 0 }, avoid: () => [near] })
    await attached.whenDrawn()
    const column = notes.get('column-try').options
    const note = slate.addNode({ id: 'typed', text: 'Ship it', x: column.x + 10, y: column.y + 120, width: 180, height: 60 })
    policies[0].onFreeTextCommit(note)
    expect(attached.value.cards.some(card => card.id === 'typed')).toBe(false)
    expect(note.options.x).toBeGreaterThanOrEqual(near.x + near.width)
    attached.destroy()
  })
})

describe('a card let go on another board', () => {
  /** Board A at the origin, board B 1380 to its right, each avoiding the other; A's card "kind" dragged to `to` and let go. */
  async function dropFromA(to: (b: { x: number; y: number; width: number; height: number }) => { x: number; y: number }) {
    const { slate, notes, policies } = slateOfBoards()
    const said: string[] = []
    slate.announce = (text: string) => { said.push(text) }
    let a: any = null
    let b: any = null
    const changes: { board: string; next: Workshop }[] = []
    a = attachWorkshop(slate, retro(), { origin: { x: 0, y: 0 }, avoid: () => [b.bounds], onChange: next => { changes.push({ board: 'main', next }) } })
    b = attachWorkshop(slate, retro(), { origin: { x: 1380, y: 0 }, scope: 'b2', avoid: () => [a.bounds], onChange: next => { changes.push({ board: 'b2', next }) } })
    await Promise.all([a.whenDrawn(), b.whenDrawn()])
    const node = notes.get('card-kind')
    const o = node.options
    const from = { x: o.x + o.width / 2, y: o.y + o.height / 2 }
    const point = to(b.bounds)
    expect(policies[0].onStart(node, from, {})).toBe(true)
    policies[0].onMove(node, point, {})
    // The engine has moved the note under the pointer by the time it is let go.
    node.position(point.x - o.width / 2, point.y - o.height / 2)
    const result = policies[0].onEnd(node, point, {})
    return { a, b, notes, said, changes, result, size: { width: o.width, height: o.height } }
  }

  it('does not lie on that board: it goes past the boards along its row, and says why; that board is unchanged', async () => {
    const { a, b, notes, said, changes, result } = await dropFromA(box => ({ x: box.x + 200, y: box.y + 260 }))
    expect(result).toEqual({ accept: true })
    expect(a.value.cards.some((card: any) => card.id === 'kind')).toBe(false)
    const note = notes.get('kind').options
    const box = b.bounds
    // Clear of board B: past its right edge, on the row it was let go on.
    expect(note.x).toBeGreaterThanOrEqual(box.x + box.width)
    expect(note.y).toBe(Math.round(box.y + 260 - note.height / 2))
    expect(said.at(-1)).toBe('Kind reviews is now a note on the canvas. It was let go on another board, so it waits just past that board. Went well: 0 of 3.')
    // Board B does not take it and does not change: only A reports the trade.
    expect(b.value).toEqual(retro())
    expect(changes.map(change => change.board)).toEqual(['main'])
    a.destroy()
    b.destroy()
  })

  it('let go on the open canvas between the boards, it stays where it was let go, as ever', async () => {
    const { a, b, notes, said, result, size } = await dropFromA(() => ({ x: 600, y: 900 }))
    expect(result).toEqual({ accept: true })
    const note = notes.get('kind').options
    expect(note.x).toBe(Math.round(600 - size.width / 2))
    expect(note.y).toBe(Math.round(900 - size.height / 2))
    expect(said.at(-1)).toBe('Kind reviews is now a note on the canvas. Went well: 0 of 3.')
    a.destroy()
    b.destroy()
  })
})

describe('the room a board needs (workshopReserve)', () => {
  it('a lane board reserves five lanes, whatever it holds now', () => {
    expect(workshopReserve(retro()).width).toBe(1220)
    expect(workshopReserve(retro()).height).toBeGreaterThan(0)
    // A phone's layout does not shrink it: the reserve is the widest a board can be.
    expect(workshopReserve(retro(), { narrow: true, width: 358, lanesPerRow: 1 }).width).toBe(1220)
  })

  it('a kit reserves its own desktop width, or the width it is pinned to', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    expect(workshopReserve(plan, {}, kitFor('launch-plan')).width).toBe(1200)
    expect(workshopReserve(plan, { width: 1500 }, kitFor('launch-plan')).width).toBe(1500)
    expect(workshopReserve(plan, { narrow: true, width: 358 }, kitFor('launch-plan')).width).toBe(1200)
  })

  it('needs the kit for a business board, and says so', () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    expect(() => workshopReserve(plan)).toThrow("A launch-plan board's room needs its kit: pass kitFor('launch-plan') from slateboxjs/boards.")
  })
})

describe('the library gate for many boards (catalogFits, opt-in)', () => {
  it('without many, says what it always has', () => {
    expect(catalogFits('retro', { hasBoard: false })).toEqual({ ok: true })
    expect(catalogFits('retro', { hasBoard: true })).toEqual({ ok: false, reason: 'This slate already has a board, so this opens on a new slate.' })
  })

  it('with many, fits beside other boards up to the cap, then says so', () => {
    expect(maxBoardsPerSlate).toBe(8)
    expect(catalogFits('retro', { hasBoard: true, many: true })).toEqual({ ok: true })
    expect(catalogFits('retro', { hasBoard: true, many: true, boards: 7 })).toEqual({ ok: true })
    expect(catalogFits('retro', { hasBoard: true, many: true, boards: 8 }))
      .toEqual({ ok: false, reason: 'This slate holds 8 boards, the most for now. Add it on a new slate?' })
    expect(catalogFits('nothing-here', { hasBoard: true, many: true })).toEqual({ ok: false, reason: 'That is not in the library.' })
  })
})
