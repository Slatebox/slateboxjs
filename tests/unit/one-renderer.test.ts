import { describe, expect, it } from 'vitest'
import { attachWorkshop, businessKind, validateWorkshop, type Workshop } from '../../src/workshops/model'
import { catalog, catalogPreset } from '../../src/workshops/catalog'
import { catalogSamples } from '../../src/workshops/samples'
import { kitFor } from '../../src/boards'
import '../../src/boards/nest'
import '../../src/boards/grid'
import '../../src/workshops/behaviour'

/**
 * One renderer (owner, 2026-11-23: "the preview should match the final view - for all of these smart components"):
 * every board in the library draws the same shapes as a draft (a library preview), as the kept board on the live
 * canvas and as a still picture (a slate's card, a Present slide): the draft only see-through in its dashed frame.
 */

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

/** The frame and tag a draft wears, and the grips and focus parts only an editable board shows. */
const DRAFT_ONLY = /^(draft-|preview-)/
const EDIT_ONLY = /^(grip-|focus-|done-|handle-)/
const unscoped = (id: string) => id.replace(/^[a-z0-9]+:/, '')
/** A part's name without the card or day it belongs to (header, bar, month…), and how many of each. */
function structure(svg: SVGSVGElement, notes: Map<string, any>) {
  const parts = new Map<string, number>()
  for (const el of svg.querySelectorAll('[data-board-layer]')) {
    const role = el.getAttribute('data-board-layer')!
    if (DRAFT_ONLY.test(role) || EDIT_ONLY.test(role)) continue
    parts.set(role, (parts.get(role) ?? 0) + 1)
  }
  return {
    notes: [...notes.keys()].map(unscoped).sort(),
    places: [...notes.values()].map(n => [unscoped(n.id), Math.round(n.options.x), Math.round(n.options.y), Math.round(n.options.width ?? 0), Math.round(n.options.height ?? 0)].join(' ')).sort(),
    parts: Object.fromEntries([...parts].sort(([a], [b]) => a.localeCompare(b))),
  }
}

async function draw(board: Workshop, how: 'draft' | 'kept' | 'still' | 'kitless') {
  const { slate, svg, notes } = slateWithCanvas()
  // A still picture (a slate's card in My slates) is the board at a card's scale.
  if (how === 'still') slate.getZoom = () => 0.2
  const kit = businessKind(board) && how !== 'kitless' ? kitFor(board.kind) : undefined
  const attached = attachWorkshop(slate, board, {
    origin: { x: 0, y: 0 }, ...(kit && { kit }),
    ...(how === 'draft' ? { draft: true, readOnly: true, scope: 'pv' } : how === 'still' ? { still: true } : { readOnly: true }),
  })
  await attached.whenDrawn()
  const seen = { ...structure(svg as SVGSVGElement, notes), svg, frame: attached.frame }
  return { seen, done: () => { attached.destroy(); svg.remove() } }
}

describe('a draft, the kept board and its still picture are drawn by one renderer', () => {
  for (const entry of catalog) {
    it(entry.id + ' (' + entry.build.kind + '): the same notes, places and named parts in all three; the draft only see-through and framed', async () => {
      const board = validateWorkshop(catalogPreset(entry.id, undefined, catalogSamples))
      const draft = await draw(board, 'draft')
      const kept = await draw(board, 'kept')
      const still = await draw(board, 'still')
      try {
        expect(draft.seen.notes.length).toBeGreaterThan(0)
        expect(draft.seen.notes).toEqual(kept.seen.notes)
        expect(draft.seen.places).toEqual(kept.seen.places)
        expect(draft.seen.parts).toEqual(kept.seen.parts)
        expect(still.seen.notes).toEqual(kept.seen.notes)
        expect(still.seen.places).toEqual(kept.seen.places)
        expect(still.seen.parts).toEqual(kept.seen.parts)
        // A still's chrome scales with its board (as an export's does): its title is the board's 18, not grown for a far zoom.
        expect(still.seen.svg.querySelector('[data-board-layer="board-title"]')?.getAttribute('font-size')).toBe('18')
        // A plan, a budget and a pipeline are drawn by their kit in all three: the header row over a plan's or a budget's grid.
        if (['launch-plan', 'hiring-plan', 'budget'].includes(board.kind)) expect(kept.seen.parts.header).toBe(1)
        // The draft is see-through, in its dashed frame and tag; the kept board and the still are not.
        expect([...draft.seen.svg.querySelectorAll('[data-node-id]')].every(g => g.hasAttribute('data-workshop-draft'))).toBe(true)
        expect(draft.seen.svg.querySelector('[data-board-layer="draft-tag"]')).toBeTruthy()
        expect(kept.seen.svg.querySelector('[data-workshop-draft]')).toBeNull()
        expect(kept.seen.svg.querySelector('[data-board-layer="draft-tag"]')).toBeNull()
        // A still picture has nothing to hold: no grips, no focus frame, no "Done".
        expect([...still.seen.svg.querySelectorAll('[data-board-layer]')].filter(el => EDIT_ONLY.test(el.getAttribute('data-board-layer')!)).map(el => el.getAttribute('data-board-layer'))).toEqual([])
      } finally { draft.done(); kept.done(); still.done() }
    })
  }
})

describe('a business board drawn without its kit is not the board (why every surface loads the kit first)', () => {
  for (const id of ['launch-plan', 'hiring-plan', 'budget', 'sales-pipeline']) {
    it(id + ': the generic columns put the notes elsewhere and draw no header row', async () => {
      const board = validateWorkshop(catalogPreset(id, undefined, catalogSamples))
      const kept = await draw(board, 'kept')
      const generic = await draw(board, 'kitless')
      try {
        expect(generic.seen.places).not.toEqual(kept.seen.places)
        expect(generic.seen.parts.header).toBeUndefined()
      } finally { kept.done(); generic.done() }
    })
  }
})
