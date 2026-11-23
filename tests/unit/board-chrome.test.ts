import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, attachWorkshop, boardBadgeShapes, boardChromeLayout, boardChromeShapes, boardLegend, validateWorkshop, workshopLaneCaption,
  workshopLanePlaces, workshopLaneSpoken, workshopNodeIds, workshopToSlate, laneColors, DRAFT_TAG, type Workshop, type WorkshopEdit, type WorkshopEditResult,
} from '../../src/workshops/model'
import { catalog, catalogPreset } from '../../src/workshops/catalog'
import { catalogSamples } from '../../src/workshops/samples'
import { planSamples } from '../../src/workshops/rules'
import { kitFor, launchPlanKit } from '../../src/boards'
import { phoneWordsWidth } from '../../src/boards/launchPlanKit'
import type { LayerShape } from '../../src/workshops/boardLayer'
import { behaviourLines, checkWorkshopMove } from '../../src/workshops/behaviour'

/**
 * Boards look designed (board polish, audit #3 #5 #7 #16): one counter format, the rules drawn as the board's
 * chrome (a title row with a legend, badges where the rules act) instead of a "How this board behaves" note,
 * the focus and draft frames, and a plan's phone labels clear of its grips.
 */

const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const apply = (board: Workshop, ...edits: WorkshopEdit[]) => ok(applyWorkshopEdits(board, edits, { actor: { by: 'Tim', via: 'chat' }, now: '2026-11-23T09:00:00.000Z' }))
const preset = (id: string) => validateWorkshop(catalogPreset(id, undefined, catalogSamples))
const cards = (board: Workshop, pairs: [string, string][]) => validateWorkshop({ ...board, cards: pairs.map(([laneId, label], i) => ({ id: 'c' + i, label, laneId })) })

describe('1. one counter format', () => {
  const retro = cards(preset('retro'), [['well', 'Boards shipped'], ['well', 'Pairing']])
  const plain = validateWorkshop({ version: 1, title: 'Plain', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [{ id: 'x', label: 'X', laneId: 'a' }, { id: 'y', label: 'Y', laneId: 'a' }] })
  it('says "2 / 3" with a limit, "2" without, "0" on an empty column', () => {
    expect(workshopLaneCaption(retro, 'well')).toBe('2 / 3')
    expect(workshopLaneCaption(retro, 'try')).toBe('0 / 3')
    expect(workshopLaneCaption(plain, 'a')).toBe('2')
    expect(workshopLaneCaption(plain, 'b')).toBe('0')
  })
  it('keeps words for a screen reader', () => {
    expect(workshopLaneSpoken(retro, 'well')).toBe('2 of 3')
    expect(workshopLaneSpoken(plain, 'a')).toBe('2 cards')
    expect(workshopLaneSpoken(plain, 'b')).toBe('0 cards')
  })
})

describe('2. no "How this board behaves" note', () => {
  it('draws no rules note for a board with a rulebook, at desktop or phone layout', () => {
    for (const id of ['team-board', 'retro', 'must-should-could', 'now-next-later']) {
      const board = preset(id)
      for (const layout of [undefined, { lanesPerRow: 1 }, { lanesPerRow: 2 }]) {
        const nodes = workshopToSlate(board, { native: true, layout }).nodes
        expect([id, nodes.some(node => node.options.id === workshopNodeIds.rules)]).toEqual([id, false])
      }
      // On a phone the first column starts at the board's top: no note above it.
      expect(workshopLanePlaces(board, { layout: { lanesPerRow: 1 } }).places[0].y).toBe(0)
    }
  })
})

describe('3. the counter pill', () => {
  it('fits its words, is centred under the header, and a full column takes the header colour', () => {
    const retro = cards(preset('retro'), [['well', 'A'], ['well', 'B'], ['well', 'C'], ['change', 'D']])
    const nodes = workshopToSlate(retro, { native: true }).nodes
    const byId = (id: string) => nodes.find(node => node.options.id === id)!.options as Record<string, any>
    retro.lanes.forEach((lane, index) => {
      const pill = byId(workshopNodeIds.caption(lane.id)), header = byId(workshopNodeIds.lane(lane.id))
      expect(pill.width).toBeGreaterThanOrEqual(40)
      expect(pill.width).toBeLessThanOrEqual(header.width)
      expect(Math.abs(pill.xPos + pill.width / 2 - (header.xPos + header.width / 2))).toBeLessThanOrEqual(1)
      expect(pill.backgroundColor).toBe(lane.id === 'well' ? laneColors[index] : 'rgba(255,255,255,0.72)')
    })
    expect(byId(workshopNodeIds.caption('well')).text).toBe('3 / 3')
  })
  it('leaves a map station without a counter', () => {
    const map = preset('decision-path')
    const nodes = workshopToSlate(map, { native: true }).nodes
    for (const lane of map.lanes) {
      const pill = nodes.find(node => node.options.id === workshopNodeIds.caption(lane.id))!.options
      expect(pill.text).toBe('')
      expect(pill.backgroundColor).toBe('transparent')
    }
  })
})

describe('4. boardLegend: the rules as data, in a few words', () => {
  it('says nothing a counter says', () => {
    expect(boardLegend(preset('retro'))).toEqual([])
    expect(boardLegend(preset('now-next-later'))).toEqual([])
  })
  it('a team board: one column at a time on every seam, and Won’t do is a bin', () => {
    const legend = boardLegend(preset('team-board'))
    expect(legend.map(item => item.icon)).toEqual(['step', 'bin'])
    expect(legend[0]).toMatchObject({ text: 'One column at a time', seams: [['todo', 'doing'], ['doing', 'review'], ['review', 'done'], ['done', 'wont']] })
    expect(legend[1]).toMatchObject({ text: 'Won\'t do is a bin', lane: 'wont' })
  })
  it('must / should / could: the bin only', () => {
    expect(boardLegend(preset('must-should-could'))).toEqual([{ icon: 'bin', text: 'Won\'t is a bin', lane: 'wont' }])
  })
  it('a path, a gate, a warning, and a rule switched off', () => {
    const team = validateWorkshop({ version: 1, title: 'Flow', lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' }, { id: 'done', label: 'Done' }], cards: [] })
    const path = apply(team, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Review'] } })
    expect(boardLegend(path)).toEqual([{ icon: 'oneway', text: 'Doing → Review only', seams: [['doing', 'review']] }])
    const warned = apply(team, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Review'], severity: 'warn' } })
    expect(boardLegend(warned)[0].warn).toBe(true)
    const off = apply(path, { kind: 'set_rule', rule: 'rule-1', on: false })
    expect(boardLegend(off)).toEqual([])
    // A gate stands on its column (a board whose cards carry the field it needs: a pipeline's amount).
    const gated = { ...team, behaviour: { version: 1, rev: 1, rules: [{ id: 'rule-1', on: true, severity: 'refuse', kind: 'gate', into: 'done', needs: ['amount'], set: { by: 'Tim', at: '2026-11-23T09:00:00.000Z', via: 'chat' } }] } } as Workshop
    expect(boardLegend(gated)).toEqual([{ icon: 'gate', text: 'Done needs an amount', lane: 'done' }])
  })
  it('a launch plan: its own rules, a few words each', () => {
    expect(boardLegend(validateWorkshop(planSamples['launch-plan']())).map(item => item.text)).toEqual(['Weekends skipped', 'Hard line', 'A slip pushes what waits'])
  })
  it('never says "lane"', () => {
    for (const id of ['team-board', 'must-should-could', 'triage', 'pros-cons', 'launch-plan', 'customer-go-live', 'hiring-plan', 'sales-pipeline']) {
      for (const item of boardLegend(preset(id))) expect([id, item.text]).not.toEqual([id, expect.stringMatching(/\blanes?\b/i)])
    }
  })
})

/** The box of a chip or title, from its shapes (the layer's estimate of a glyph's width). */
const textBox = (shape: Extract<LayerShape, { t: 'text' }>) => ({ x: shape.x, y: shape.y - (shape.size ?? 13), width: Math.ceil(shape.text.length * (shape.size ?? 13) * 0.52), height: shape.size ?? 13 })
const overlap = (a: { x: number; y: number; width: number; height: number }, b: typeof a) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

describe('5. boardChromeShapes: the title row and the frames', () => {
  const team = preset('team-board')
  const size = workshopLanePlaces(team)
  it('names the board and lays its chips out without overlap, the last row 14 above the board', () => {
    const shapes = boardChromeShapes(team, size)
    const title = shapes.find(shape => shape.t === 'text' && shape.role === 'board-title') as Extract<LayerShape, { t: 'text' }>
    expect(title.text).toBe('Team board')
    const chips = shapes.filter(shape => shape.t === 'text' && shape.role === 'legend') as Extract<LayerShape, { t: 'text' }>[]
    expect(chips.map(chip => chip.text)).toEqual(['One column at a time', 'Won\'t do is a bin'])
    const boxes = [textBox(title), ...chips.map(textBox)]
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) expect(overlap(boxes[i], boxes[j])).toBe(false)
    const layout = boardChromeLayout(team, size)
    expect(layout.titleY + layout.rows * layout.rowH).toBeLessThanOrEqual(-14)
    // No frame outside focus.
    expect(shapes.some(shape => shape.t === 'path' && (shape.role === 'focus-frame' || shape.role === 'draft-frame'))).toBe(false)
  })
  it('on a phone the chips start on the row under the title', () => {
    const shapes = boardChromeShapes(team, workshopLanePlaces(team, { layout: { lanesPerRow: 1 } }), { narrow: true })
    const title = shapes.find(shape => shape.t === 'text' && shape.role === 'board-title') as Extract<LayerShape, { t: 'text' }>
    const chips = shapes.filter(shape => shape.t === 'text' && shape.role === 'legend') as Extract<LayerShape, { t: 'text' }>[]
    for (const chip of chips) expect(chip.y).toBeGreaterThan(title.y)
  })
  it('in focus: a solid frame, Editing and Done; a draft: a dashed frame and its tag', () => {
    const focused = boardChromeShapes(team, size, { focused: true })
    const frame = focused.find(shape => shape.t === 'path' && shape.role === 'focus-frame') as Extract<LayerShape, { t: 'path' }>
    expect(frame).toBeTruthy()
    expect(frame.dash).toBeUndefined()
    expect(focused.filter(shape => shape.t === 'text').map(shape => (shape as any).text)).toEqual(expect.arrayContaining(['Editing', 'Done']))
    const draft = boardChromeShapes(team, size, { draft: true })
    expect((draft.find(shape => shape.t === 'path' && shape.role === 'draft-frame') as any).dash).toBeTruthy()
    expect(draft.some(shape => shape.t === 'text' && shape.text === DRAFT_TAG)).toBe(true)
    expect(DRAFT_TAG).toBe('Preview · not added yet')
  })
  it('scale 2 doubles the type and the title block', () => {
    const one = boardChromeLayout(team, size), two = boardChromeLayout(team, size, { scale: 2 })
    expect(two.titleSize).toBe(one.titleSize * 2)
    expect(-two.titleY).toBe(-one.titleY * 2)
  })
})

describe('6. boardBadgeShapes: where the rules act', () => {
  it('a seam badge between two columns side by side, a bin on its header; none across a wrapped row', () => {
    const team = preset('team-board')
    const { places } = workshopLanePlaces(team)
    const badges = boardBadgeShapes(team, { places })
    const seams = badges.filter(shape => shape.t === 'path' && shape.role?.startsWith('seam-'))
    expect(seams.map(shape => (shape as any).role)).toEqual(['seam-todo>doing', 'seam-doing>review', 'seam-review>done', 'seam-done>wont'])
    expect(badges.some(shape => shape.t === 'path' && shape.role === 'badge-wont')).toBe(true)
    const wrapped = workshopLanePlaces(team, { layout: { lanesPerRow: 2 } }).places
    const across = boardBadgeShapes(team, { places: wrapped }).filter(shape => shape.t === 'path' && shape.role?.startsWith('seam-')).map(shape => (shape as any).role)
    expect(across).toEqual(['seam-todo>doing', 'seam-review>done'])
  })
  it('a kit or a map has none', () => {
    expect(boardBadgeShapes(preset('decision-path'), { places: workshopLanePlaces(preset('decision-path')).places })).toEqual([])
    expect(boardBadgeShapes(validateWorkshop(planSamples['launch-plan']()), { places: [] })).toEqual([])
  })
})

/** A slate with what attachWorkshop asks of it and a real svg canvas, to see where the chrome goes. */
function slateWithCanvas() {
  const notes = new Map<string, any>()
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  const make = (options: any) => {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    group.setAttribute('data-node-id', options.id)
    svg.appendChild(group)
    const node: any = { id: options.id, options: { ...options }, relationships: { associations: [], addAssociation() {}, removeAssociation() {}, getAssociations: () => [] },
      position(x: number, y: number) { node.options.x = x; node.options.y = y }, setText(text: string) { node.options.text = text }, setShape() {},
      svgGroup: { node: group, front() {} } }
    notes.set(options.id, node)
    return node
  }
  const slate: any = {
    canvas: { node: svg }, element: document.createElement('div'), announce() {},
    nodes: { add: make, one: (id: string) => notes.get(id), remove: (id: string) => { notes.get(id)?.svgGroup.node.remove(); notes.delete(id) }, get allNodes() { return [...notes.values()] } },
    addNode: make, removeNode: (id: string) => notes.delete(id), hitTestNodes: () => null,
    setDragPolicy() { return () => {} }, withPolicyAuthority: (fn: () => void) => fn(), getZoom: () => 1,
  }
  return { slate, svg, notes }
}

describe('the chrome on a live board', () => {
  it('draws the title row under the board’s notes and the badges above them, named for a screen reader, and takes them away with the board', async () => {
    const { slate, svg } = slateWithCanvas()
    const board = attachWorkshop(slate, preset('team-board'), { origin: { x: 100, y: 200 } })
    await board.whenDrawn()
    const [under, over] = [...svg.querySelectorAll('g[data-board-chrome]')]
    expect(under.getAttribute('aria-label')).toBe('Team board: One column at a time, Won\'t do is a bin')
    expect(under.getAttribute('pointer-events')).toBe('none')
    const firstNote = svg.querySelector('[data-node-id]')!
    expect(under.compareDocumentPosition(firstNote) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(svg.lastElementChild).toBe(over)
    expect(under.querySelector('[data-board-layer="board-title"]')!.textContent).toBe('Team board')
    // The frame grows upward by the title row; the bounds stay the board's.
    expect(board.bounds.y).toBe(200)
    expect(board.frame.y).toBeLessThan(200 - 40)
    board.setFocused(true)
    expect(under.hasAttribute('data-workshop-focused')).toBe(true)
    expect(under.querySelector('[data-board-layer="focus-frame"]')).toBeTruthy()
    board.setFocused(false)
    expect(under.querySelector('[data-board-layer="focus-frame"]')).toBeNull()
    board.destroy()
    expect(svg.querySelector('g[data-board-chrome]')).toBeNull()
  })
  it('a draft is view-only, see-through and framed; its Done-less frame says what it is', async () => {
    const { slate, svg, notes } = slateWithCanvas()
    const plan = validateWorkshop(planSamples['launch-plan']())
    const board = attachWorkshop(slate, plan, { origin: { x: 0, y: 0 }, kit: kitFor('launch-plan'), draft: true, scope: 'pv' })
    await board.whenDrawn()
    expect([...notes.keys()].every(id => id.startsWith('pv:'))).toBe(true)
    expect([...notes.values()].every(node => node.svgGroup.node.hasAttribute('data-workshop-draft'))).toBe(true)
    expect(svg.querySelector('[data-board-layer="draft-tag"]')!.textContent).toBe(DRAFT_TAG)
    board.destroy()
  })
  it('“Done” on the focus frame is a button: a click and Enter both say so', async () => {
    const { slate, svg } = slateWithCanvas()
    let done = 0
    const board = attachWorkshop(slate, preset('retro'), { origin: { x: 0, y: 0 }, onFocusDone: () => { done++ } })
    await board.whenDrawn()
    board.setFocused(true)
    const button = svg.querySelector('[data-board-layer="focus-done-box"]') as SVGElement
    expect(button.getAttribute('role')).toBe('button')
    button.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    button.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    expect(done).toBe(2)
    board.destroy()
  })
  it('chrome: false draws none', async () => {
    const { slate, svg } = slateWithCanvas()
    const board = attachWorkshop(slate, preset('retro'), { origin: { x: 0, y: 0 }, chrome: false })
    await board.whenDrawn()
    expect(svg.querySelector('g[data-board-chrome]')).toBeNull()
    board.destroy()
  })
})

describe('7. a launch plan on a phone: each task’s words above its own bar, clear of grips, bars and slack', () => {
  for (const sample of ['launch-plan', 'go-live'] as const) for (const width of [320, 390, 430]) {
    it(`${sample} at ${width}px`, () => {
      const plan = validateWorkshop(planSamples[sample]())
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const layer = launchPlanKit.layer({ canvas: { node: svg } })
      const layout = { narrow: true, width }
      layer.draw(plan, null, { origin: { x: 0, y: 0 }, layout, clamp: null, refused: false })
      const { parts } = launchPlanKit.places(plan, layout)
      const rect = (el: Element) => ({ x: +el.getAttribute('x')!, y: +el.getAttribute('y')!, width: +el.getAttribute('width')!, height: +el.getAttribute('height')! })
      const grips = [...svg.querySelectorAll('rect[data-board-layer^="grip-"]')].map(rect)
      const slack = [...svg.querySelectorAll('text[data-board-layer^="slack-"]')].map(el => ({ x: +el.getAttribute('x')!, y: +el.getAttribute('y')! - 12, width: el.textContent!.length * 7, height: 12 }))
      for (const card of plan.cards) {
        const words = svg.querySelector(`text[data-board-layer="words-${card.id}"]`)!
        expect(words.getAttribute('stroke')).toBeTruthy()
        const bar = parts.find(part => part.name === 'card-' + card.id)!
        const w = phoneWordsWidth(words.textContent!, words.getAttribute('font-weight') === '600')
        const x = words.getAttribute('text-anchor') === 'end' ? +words.getAttribute('x')! - w : +words.getAttribute('x')!
        const box = { x, y: +words.getAttribute('y')! - 11, width: w, height: 13 }
        if (words.getAttribute('text-anchor') === 'end') expect(Math.abs(+words.getAttribute('x')! - Math.min(width - 8, bar.x + bar.width))).toBeLessThanOrEqual(w)
        else expect(Math.abs(box.x - bar.x)).toBeLessThanOrEqual(2)
        for (const grip of grips) expect([card.id, overlap(box, grip)]).toEqual([card.id, false])
        for (const other of parts.filter(part => part.name.startsWith('card-'))) expect([card.id, other.name, overlap(box, other)]).toEqual([card.id, other.name, false])
        for (const said of slack) expect([card.id, overlap(box, said)]).toEqual([card.id, false])
      }
      layer.destroy()
    })
  }
})

describe('9. what a person reads says "column", never "lane" (the chat still understands both)', () => {
  const lane = /\blanes?\b/i
  it('the library’s moves, captions, steps and limits', () => {
    for (const entry of catalog) {
      const words = [...(entry.moves ?? []).flatMap(move => [move.words, move.say.replace(/\{[^}]+\}/g, '')]), entry.loop.caption, ...entry.loop.steps, ...(entry.limits ?? []), entry.line]
      for (const said of words) expect([entry.id, said]).not.toEqual([entry.id, expect.stringMatching(lane)])
    }
  })
  it('the rules’ sentences and their refusals', () => {
    const team = preset('team-board')
    for (const line of behaviourLines(team)) expect(line).not.toMatch(lane)
    const flow = validateWorkshop({ version: 1, title: 'Flow', lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'done', label: 'Done' }], cards: [] })
    const path = apply(flow, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Done'], noSkip: true } as any })
    for (const line of behaviourLines(path)) expect(line).not.toMatch(lane)
    const full = applyWorkshopEdits(validateWorkshop({ ...flow, lanes: [{ id: 'todo', label: 'To do', capacity: 1 }, ...flow.lanes.slice(1)], cards: [{ id: 'a', label: 'A', laneId: 'todo' }] }),
      [{ kind: 'add_card', lane: { id: 'todo' }, label: 'B' }])
    expect('refused' in full && full.refused.reason).toMatch(/another column/)
    const moved = checkWorkshopMove(validateWorkshop({ ...team, cards: [{ id: 'a', label: 'A', laneId: 'todo' }] }), { id: 'a' }, { id: 'done' })
    expect(JSON.stringify(moved)).not.toMatch(lane)
  })
})
