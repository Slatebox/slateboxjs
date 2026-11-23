import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { attachWorkshop, businessKind, validateWorkshop, type Workshop } from '../../src/workshops/model'
import { catalog, catalogPreset } from '../../src/workshops/catalog'
import { catalogSamples } from '../../src/workshops/samples'
import { kitFor } from '../../src/boards'
import '../../src/boards/nest'
import '../../src/workshops/behaviour'
import { componentSlate, createStillRenderer, fitViewbox, KIT_KINDS, lanesPerRow, slateBoards, workshopOrigin } from '../../src/boards/still'

// The host's loaders, as the app passes them (import('slateboxjs/boards') and friends); here the engine's sources.
const loaded: string[] = []
const loader = <T,>(name: string, load: () => Promise<T>) => () => { loaded.push(name); return load() }
const modules = {
  model: loader('model', () => import('../../src/workshops/model')),
  boards: loader('boards', () => import('../../src/boards')),
  nest: loader('nest', () => import('../../src/boards/nest')),
  behaviour: loader('behaviour', () => import('../../src/workshops/behaviour')),
}
const { drawBoard, renderStill } = createStillRenderer({ ...modules, Slate: async () => (globalThis as any).__stillSlate })

/**
 * slateboxjs/boards/still (library spec §7.2): the one renderer every read-only surface uses (the app's slate cards and
 * previews, the library gallery, the marketing site). A still drawn through renderStill is the board as attachWorkshop
 * and its kit draw it on the live canvas: the same notes and the same named parts, read-only, no draft frame, no grips.
 */

function fakeCanvas() {
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
  const viewboxes: number[][] = []
  const loaded: any[] = []
  const slate: any = {
    canvas: { node: svg, viewbox: (...box: number[]) => { viewboxes.push(box) } }, element: document.createElement('div'), announce() {},
    nodes: { add: make, one: (id: string) => notes.get(id), remove: (id: string) => { notes.get(id)?.svgGroup.node.remove(); notes.delete(id) }, get allNodes() { return [...notes.values()] } },
    addNode: make, removeNode: (id: string) => notes.delete(id), hitTestNodes: () => null,
    setDragPolicy() { return () => {} }, withPolicyAuthority: (fn: () => void) => fn(), getZoom: () => 0.2,
    loadJSON: async (json: any) => { loaded.push(json) }, destroy() {},
  }
  return { slate, svg, notes, viewboxes, loaded }
}

const EDIT_ONLY = /^(grip-|focus-|done-|handle-)/
const unscoped = (id: string) => id.replace(/^[a-z0-9]+:/, '')
function parts(svg: Element) {
  const out = new Map<string, number>()
  for (const el of svg.querySelectorAll('[data-board-layer]')) {
    const role = el.getAttribute('data-board-layer')!
    if (/^(draft-|preview-)/.test(role) || EDIT_ONLY.test(role)) continue
    out.set(role, (out.get(role) ?? 0) + 1)
  }
  return Object.fromEntries([...out].sort(([a], [b]) => a.localeCompare(b)))
}

function host(width = 640, height = 360) {
  const el = document.createElement('div')
  Object.defineProperty(el, 'clientWidth', { value: width })
  Object.defineProperty(el, 'clientHeight', { value: height })
  document.body.appendChild(el)
  return el
}

describe('renderStill draws each built-in board with its kit, as the live canvas does', () => {
  for (const entry of catalog) {
    it(entry.id + ' (' + entry.build.kind + ')', async () => {
      const board = validateWorkshop(catalogPreset(entry.id, undefined, catalogSamples))
      // The live canvas: attachWorkshop with the board's kit.
      const live = fakeCanvas()
      const kit = businessKind(board) ? kitFor(board.kind) : undefined
      const kept = attachWorkshop(live.slate, board, { origin: { x: 40, y: 40 }, still: true, ...(kit && { kit }) } as any)
      await kept.whenDrawn()
      // The still: renderStill on a slate holding the board alone (componentSlate), as the gallery draws a component.
      const canvas = fakeCanvas()
      ;(globalThis as any).__stillSlate = function FakeSlate() { return canvas.slate }
      const el = host()
      const still = await renderStill(el, componentSlate(board))
      try {
        expect(still.boards).toHaveLength(1)
        expect([...canvas.notes.keys()].map(unscoped).sort()).toEqual([...live.notes.keys()].map(unscoped).sort())
        expect(parts(canvas.svg)).toEqual(parts(live.svg))
        if (['launch-plan', 'hiring-plan', 'budget'].includes(board.kind)) expect(parts(canvas.svg).header).toBe(1)
        // Read-only: no draft frame, no see-through notes, nothing to hold.
        expect(canvas.svg.querySelector('[data-workshop-draft]')).toBeNull()
        expect([...canvas.svg.querySelectorAll('[data-board-layer]')].filter(n => EDIT_ONLY.test(n.getAttribute('data-board-layer')!))).toEqual([])
        // Fitted: the viewbox shows the board's frame whole, centred in the host's shape (16:9 here).
        const [x, y, w, h] = canvas.viewboxes.at(-1)!
        expect(w / h).toBeCloseTo(640 / 360, 3)
        expect(x).toBeLessThanOrEqual(still.frame.x)
        expect(y).toBeLessThanOrEqual(still.frame.y)
        expect(x + w).toBeGreaterThanOrEqual(still.frame.x + still.frame.width)
        expect(y + h).toBeGreaterThanOrEqual(still.frame.y + still.frame.height)
        expect(el.dataset.stillDrawn).toBe('true')
      } finally { still.destroy(); kept.destroy(); live.svg.remove(); canvas.svg.remove(); el.remove() }
    })
  }
})

describe('the read helpers', () => {
  const lanes = validateWorkshop({ version: 1, title: 'Team', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [] }) as Workshop
  it('a slate\'s boards: the first at its stored or worked-out origin, further boards in the order they were added', () => {
    const slate = {
      options: {}, nodes: [{ options: { xPos: 10, yPos: 20, width: 100, height: 50 } }],
      creative: { model: { kind: 'workshop', workshop: lanes } },
      boards: { b10: { model: { kind: 'workshop', workshop: lanes }, origin: { x: 1, y: 2 } }, b2: { model: { kind: 'workshop', workshop: lanes } }, junk: { model: { kind: 'note' } } },
    }
    expect(slateBoards(slate).map(b => [b.id, b.origin])).toEqual([['main', { x: 190, y: 20 }], ['b2', null], ['b10', { x: 1, y: 2 }]])
    expect(workshopOrigin({ workshopOrigin: { x: 5, y: 6 } }, [])).toEqual({ x: 5, y: 6 })
    expect(workshopOrigin({}, [])).toEqual({ x: 40, y: 40 })
  })
  it('lanes per row: one on a phone, all that fit on a desktop, a map as its author placed it', () => {
    expect(lanesPerRow(390, lanes)).toBe(1)
    expect(lanesPerRow(1440, lanes)).toBeUndefined()
    expect(lanesPerRow(1440, { lanes: [{ station: {} }] })).toBeUndefined()
  })
  it('the fitted viewbox keeps the frame whole and centred', () => {
    const box = fitViewbox({ x: 0, y: 0, width: 100, height: 100 }, 400, 200, 0)
    expect(box).toEqual({ x: -50, y: 0, width: 200, height: 100 })
  })
  it('a component is a slate holding its board alone', () => {
    const slate = componentSlate(lanes)
    expect(slate.nodes).toEqual([])
    expect(slateBoards(slate)).toEqual([{ id: 'main', workshop: lanes, origin: { x: 40, y: 40 } }])
  })
  it('a draft wears its frame; a still does not', async () => {
    const canvas = fakeCanvas()
    const draft = await drawBoard(canvas.slate, lanes, { how: 'draft', origin: { x: 0, y: 0 } })
    await draft.whenDrawn()
    expect(canvas.svg.querySelector('[data-board-layer="draft-tag"]')).toBeTruthy()
    draft.destroy(); canvas.svg.remove()
  })
})

describe('the renderer stays out of a first visit', () => {
  const source = readFileSync(resolve(__dirname, '../../src/boards/still.ts'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
  it('imports nothing from the engine: the host loads the model, the kits, the rulebook and the canvas', () => {
    // A built CommonJS file turns an engine-internal import() into a require a bundler loads at once; with no import at
    // all, the kits stay out of a page until a board is drawn (the app's check-client-bundle holds it to that).
    expect(source).not.toMatch(/^\s*import (?!type)/m)
    expect(source).not.toMatch(/(?<!typeof )\bimport\(/)
    expect(source).not.toMatch(/\brequire\(/)
  })
  it('loads a kit only for a board drawn by one, and the rulebook only when a board needs it', async () => {
    const r = createStillRenderer(modules)
    loaded.length = 0
    await r.loadBoardKit(validateWorkshop({ version: 1, title: 'Plain', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }], cards: [] }))
    expect(loaded).toEqual(['model'])
    loaded.length = 0
    await r.loadBoardKit(validateWorkshop(catalogPreset('discovery-tree', undefined, catalogSamples)))
    expect(loaded).toContain('nest')
  })
  it('a still is read-only and laid out as a desktop canvas shows it; a draft wears its frame', () => {
    expect(source).toMatch(/readOnly: true/)
    expect(source).toMatch(/how === 'draft' \? \{ draft: true \} : \{ still: true \}/)
    expect(source).toMatch(/width = 1440/)
    expect(KIT_KINDS).toEqual(['launch-plan', 'hiring-plan', 'pipeline', 'budget', 'nest'])
  })
})
