import { describe, it, expect, afterEach } from 'vitest'
import { SVG } from '@svgdotjs/svg.js'
import { createAgentSuggestions, ghostIdOf, pendingItems, type SuggestionAction } from '../../src/core/AgentSuggestions'
import {
  AGENT_BEAT_MS, AGENT_SAY_MS, agentName, agentOrigin, agentSaying, createAgentPresence, safeIconUrl, type AgentPresenceRecord,
} from '../../src/core/AgentPresence'

// A slate with just what the module uses: a canvas, notes it can add and remove, and host policies.
function fakeSlate(notes: Record<string, { x: number; y: number; width: number; height: number; text?: string }> = {}) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const canvas = SVG().addTo(host).size(800, 600).viewbox(0, 0, 800, 600)
  const nodes: any[] = Object.entries(notes).map(([id, box]) => ({ id, options: { id, ...box }, svgGroup: canvas.group(), ready: Promise.resolve() }))
  const policies: any[] = []
  let authority = 0
  const added: string[] = []
  const slate = {
    canvas,
    host,
    added,
    policies,
    nodes: {
      one: (id: string) => nodes.find(node => node.id === id),
      get allNodes() { return nodes },
      add(options: any) {
        if (!authority) throw new Error('a ghost is added only with the host authority')
        const node = { id: options.id, options: { ...options }, svgGroup: canvas.group(), ready: Promise.resolve(), applyGovernance() {} }
        nodes.push(node)
        added.push(options.id)
        return node
      },
      remove(id: string) {
        const index = nodes.findIndex(node => node.id === id)
        if (index >= 0) { nodes[index].svgGroup.remove(); nodes.splice(index, 1) }
        return index >= 0
      },
    },
    setDragPolicy(policy: any) { policies.push(policy); return () => policies.splice(policies.indexOf(policy), 1) },
    withPolicyAuthority<T>(fn: () => T): T { authority++; try { return fn() } finally { authority-- } },
  }
  return slate
}

const v1 = (id: string, text: string, x = 300, y = 100) => ({ options: { id, text, xPos: x, yPos: y, width: 160, height: 80 }, relationships: { associations: [] } })
const toNode = (o: any) => ({ id: o.id, text: o.text, x: o.xPos, y: o.yPos, width: o.width, height: o.height })

const action = (over: Partial<SuggestionAction> = {}): SuggestionAction => ({
  actionId: 'act1', agentId: 'ag1', label: "Ada's agent", initial: 'A', colorIndex: 1, origin: 'visiting', via: 'Claude', message: 'Add two ideas',
  items: [
    { id: 'add:idea1', kind: 'add', state: 'pending', nodeId: 'idea1', node: v1('idea1', 'Retry after 24h') },
    { id: 'add:idea2', kind: 'add', state: 'pending', nodeId: 'idea2', node: v1('idea2', 'Smart retries', 520) },
    { id: 'link:l1', kind: 'link', state: 'pending', parentId: 'brief', association: { id: 'l1', parentId: 'brief', childId: 'idea1' } },
    { id: 'update:brief', kind: 'update', state: 'pending', nodeId: 'brief', changes: { text: 'Card declines, retry UX' }, previous: { text: 'Card declines' } },
    { id: 'remove:old', kind: 'remove', state: 'pending', nodeId: 'old', node: v1('old', 'Old idea') },
    { id: 'add:gone', kind: 'add', state: 'kept', nodeId: 'gone', node: v1('gone', 'Already kept') },
  ],
  ...over,
})

afterEach(() => { document.body.innerHTML = '' })

describe('agent suggestions: ghosts in place', () => {
  it('draws each waiting change in place: ghost notes as inert engine notes, outlines, a line, words', async () => {
    const slate = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80, text: 'Card declines' }, old: { x: 40, y: 300, width: 160, height: 80, text: 'Old idea' } })
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    suggestions.set([action()])
    await Promise.resolve()
    // Only waiting adds become ghost notes, each named ghost-<id>, added with the host's authority.
    expect(slate.added).toEqual([ghostIdOf('idea1'), ghostIdOf('idea2')])
    // The host policy governs exactly the ghosts: inert, never saved or exported.
    const policy = slate.policies[0]
    expect(policy.governs(slate.nodes.one('ghost-idea1'))).toMatchObject({ canMove: false, canEditText: false, persist: false, exportable: false })
    expect(policy.governs(slate.nodes.one('brief'))).toBeNull()
    const shown = suggestions.shown()
    // A line carries no buttons: it is kept with both its ends and goes with either.
    expect(shown.map(item => [item.itemId, item.kind, item.controls])).toEqual([
      ['add:idea1', 'add', true], ['add:idea2', 'add', true], ['link:l1', 'link', false], ['update:brief', 'update', true], ['remove:old', 'remove', true],
    ])
    expect(shown[0].box).toEqual({ x: 300, y: 100, w: 160, h: 80 })
    // The action's frame: around its new notes (300..680 × 100..180), padded
    expect(shown[0].frame).toEqual({ x: 288, y: 88, w: 404, h: 104 })
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    expect(layer.querySelectorAll('[data-suggestion-outline]')).toHaveLength(4)
    // Drawn for the view only: no export keeps it (Export removes [data-export-never]).
    expect(layer.hasAttribute('data-export-never')).toBe(true)
    expect(layer.querySelectorAll('[data-suggestion-line]')).toHaveLength(1)
    expect(layer.textContent).toContain("Ada's agent · via Claude")
    expect(layer.textContent).toContain('Suggests: “Card declines, retry UX”')
    expect(layer.textContent).toContain('Suggests removing this note')
    // A removal's Keep says what it does.
    const removeButtons = [...layer.querySelectorAll('[data-suggestion="remove:old"] [data-suggestion-button]')].map(b => b.textContent)
    expect(removeButtons).toEqual(['Remove', 'Discard'])
    suggestions.destroy()
    expect(slate.nodes.one('ghost-idea1')).toBeUndefined()
    expect(slate.host.querySelector('[data-agent-suggestions]')).toBeNull()
    expect(slate.policies).toHaveLength(0)
  })

  it('Keep and Discard on a ghost call the host with that suggestion; a viewer gets no buttons', async () => {
    const slate = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80 }, old: { x: 40, y: 300, width: 160, height: 80 } })
    const calls: string[] = []
    let editor = true
    const suggestions = createAgentSuggestions(slate, {
      toNode, canAct: () => editor, onKeep: ref => calls.push('keep ' + ref.itemId), onDiscard: ref => calls.push('discard ' + ref.itemId),
    })
    suggestions.set([action()])
    const layer = () => slate.host.querySelector('[data-agent-suggestions]')!
    const press = (item: string, which: 'keep' | 'discard') =>
      (layer().querySelector(`[data-suggestion="${item}"] [data-suggestion-button="${which}"]`) as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    // a ghost's own buttons wait for the pointer (or focus)
    const ghostButtons = () => layer().querySelector('[data-suggestion="add:idea1"] [data-suggestion-controls]') as SVGGElement
    expect(ghostButtons().style.display).toBe('none')
    layer().querySelector('[data-suggestion="add:idea1"]')!.dispatchEvent(new Event('pointerenter'))
    expect(ghostButtons().style.display).toBe('')
    press('add:idea1', 'keep')
    press('add:idea2', 'discard')
    press('remove:old', 'keep')
    expect(calls).toEqual(['keep add:idea1', 'discard add:idea2', 'keep remove:old'])
    // The buttons are reachable by keyboard and say whose suggestion and what.
    const keep = layer().querySelector('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]')!
    expect(keep.getAttribute('role')).toBe('button')
    expect(keep.getAttribute('aria-label')).toBe("Keep the suggestion from Ada's agent, via Claude: add “Retry after 24h”")
    const discard = layer().querySelector('[data-suggestion="add:idea1"] [data-suggestion-button="discard"]')!
    expect(discard.getAttribute('aria-label')).toBe("Discard the suggestion from Ada's agent, via Claude: add “Retry after 24h”")
    editor = false
    suggestions.set([action()])
    expect(layer().querySelectorAll('[data-suggestion-button]')).toHaveLength(0)
    expect(suggestions.shown().every(item => !item.controls)).toBe(true)
    suggestions.keep({ actionId: 'act1', itemId: 'add:idea1' })
    expect(calls).toHaveLength(3)
    suggestions.destroy()
  })

  it('a kept or discarded suggestion leaves; a kept note already on the slate gets no ghost', async () => {
    const slate = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80 }, old: { x: 40, y: 300, width: 160, height: 80 } })
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    suggestions.set([action()])
    expect(slate.nodes.one('ghost-idea1')).toBeTruthy()
    const next = action()
    next.items[0].state = 'kept'
    next.items[1].state = 'discarded'
    // The kept note arrives with the slate's next save.
    slate.withPolicyAuthority(() => slate.nodes.add({ id: 'idea1', x: 300, y: 100, width: 160, height: 80 }))
    suggestions.set([next])
    expect(slate.nodes.one('ghost-idea1')).toBeUndefined()
    expect(slate.nodes.one('ghost-idea2')).toBeUndefined()
    expect(suggestions.shown().map(item => item.itemId)).toEqual(['link:l1', 'update:brief', 'remove:old'])
    // The real note arrived before its suggestion was marked kept: no ghost is drawn beside it.
    const slate2 = fakeSlate({ idea1: { x: 300, y: 100, width: 160, height: 80 } })
    const other = createAgentSuggestions(slate2, { toNode })
    other.set([action({ items: [action().items[0]] })])
    expect(slate2.nodes.one('ghost-idea1')).toBeUndefined()
    suggestions.set([])
    expect(slate.host.querySelector('[data-agent-suggestions]')).toBeNull()
    suggestions.destroy(); other.destroy()
  })

  it('one action is one group: one frame, one tag with what it suggests, one Keep all / Discard all, no buttons on lines', async () => {
    const slate = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80 } })
    const calls: string[] = []
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true, onKeepAll: id => calls.push('keep all ' + id), onDiscardAll: id => calls.push('discard all ' + id), onKeep: ref => calls.push('keep ' + ref.itemId) })
    const three = action({
      label: 'Excalidraw', origin: 'invited', invitedBy: 'Tim', via: null,
      items: [
        { id: 'a', kind: 'add', state: 'pending', nodeId: 'a', node: v1('a', 'Idea', 300, 100) },
        { id: 'b', kind: 'add', state: 'pending', nodeId: 'b', node: v1('b', 'Build', 500, 100) },
        { id: 'c', kind: 'add', state: 'pending', nodeId: 'c', node: v1('c', 'Ship', 700, 100) },
        { id: 'ab', kind: 'link', state: 'pending', parentId: 'a', association: { id: 'ab', parentId: 'a', childId: 'b' } },
        { id: 'bc', kind: 'link', state: 'pending', parentId: 'b', association: { id: 'bc', parentId: 'b', childId: 'c' } },
      ],
    })
    suggestions.set([three])
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    expect(layer.querySelectorAll('[data-suggestion-frame]')).toHaveLength(1)
    const tags = [...layer.querySelectorAll('[data-suggestion-tag]')]
    expect(tags).toHaveLength(1)
    expect(tags[0].textContent).toContain('Excalidraw · added by Tim · 3 notes, 2 lines')
    expect(layer.querySelectorAll('[data-suggestion-button="keep-all"]')).toHaveLength(1)
    expect(layer.querySelectorAll('[data-suggestion-button="discard-all"]')).toHaveLength(1)
    expect(layer.querySelectorAll('[data-suggestion="ab"] [data-suggestion-button], [data-suggestion="bc"] [data-suggestion-button]')).toHaveLength(0)
    // only the ghost under the pointer shows its own buttons
    const visible = () => [...layer.querySelectorAll('[data-suggestion-controls]')].filter(el => (el as SVGGElement).style.display !== 'none').map(el => el.getAttribute('data-suggestion-controls'))
    expect(visible()).toEqual([])
    layer.querySelector('[data-suggestion="b"]')!.dispatchEvent(new Event('pointerenter'))
    expect(visible()).toEqual(['b'])
    layer.querySelector('[data-suggestion="b"]')!.dispatchEvent(new Event('pointerleave'))
    expect(visible()).toEqual([])
    // keyboard: focus on a ghost's box shows its buttons
    ;(layer.querySelector('[data-suggestion-hit="c"]') as SVGElement).dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
    expect(visible()).toEqual(['c'])
    const click = (sel: string) => (layer.querySelector(sel) as SVGElement).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    click('[data-suggestion-button="keep-all"]')
    click('[data-suggestion-button="discard-all"]')
    expect(calls).toEqual(['keep all act1', 'discard all act1'])
    const [g] = suggestions.groups()
    expect(g.words).toBe('3 notes, 2 lines')
    suggestions.destroy()
  })

  it('tags and Keep all of groups side by side never overlap each other or another frame', async () => {
    const slate = fakeSlate()
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    // two answers stacked close together: the second's tag would sit on the first's Keep all
    const one = action({ actionId: 'one', items: [{ id: 'a', kind: 'add', state: 'pending', nodeId: 'a', node: v1('a', 'Idea', 100, 100) }, { id: 'b', kind: 'add', state: 'pending', nodeId: 'b', node: v1('b', 'Build', 300, 100) }] })
    const two = action({ actionId: 'two', label: 'GitHub', items: [{ id: 'c', kind: 'add', state: 'pending', nodeId: 'c', node: v1('c', 'abc1234 Fix', 100, 240) }, { id: 'd', kind: 'add', state: 'pending', nodeId: 'd', node: v1('d', 'bcd2345 Faster', 300, 240) }] })
    suggestions.set([one, two])
    const groups = suggestions.groups()
    expect(groups).toHaveLength(2)
    const hit = (a: any, b: any) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
    const labels = groups.flatMap(g => [g.tag, g.all].filter(Boolean))
    for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) expect(hit(labels[i], labels[j])).toBe(false)
    for (const g of groups) for (const other of groups) if (other !== g) {
      expect(hit(g.tag, other.frame)).toBe(false)
      expect(hit(g.all, other.frame)).toBe(false)
    }
    suggestions.destroy()
  })

  it('Keep all without the host\'s own keeps each note in turn (lines follow their ends)', () => {
    const slate = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80 }, old: { x: 40, y: 300, width: 160, height: 80 } })
    const calls: string[] = []
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true, onKeep: ref => calls.push(ref.itemId) })
    suggestions.set([action()])
    suggestions.keepAll('act1')
    expect(calls).toEqual(['add:idea1', 'add:idea2', 'update:brief', 'remove:old'])
    suggestions.destroy()
  })

  it('an action of lines only between notes on the slate still has a frame, a tag and Keep all / Discard all', () => {
    const slate = fakeSlate({ a: { x: 40, y: 100, width: 160, height: 80 }, b: { x: 400, y: 100, width: 160, height: 80 } })
    const calls: string[] = []
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true, onKeep: ref => calls.push('keep ' + ref.itemId), onDiscard: ref => calls.push('discard ' + ref.itemId) })
    const lines = action({ actionId: 'lines', items: [
      { id: 'ab', kind: 'link', state: 'pending', parentId: 'a', association: { id: 'ab', parentId: 'a', childId: 'b' } },
      // its other end was deleted: still listed, so it can be discarded
      { id: 'agone', kind: 'link', state: 'pending', parentId: 'a', association: { id: 'agone', parentId: 'a', childId: 'gone' } },
    ] })
    suggestions.set([lines])
    const [g] = suggestions.groups()
    expect(g.words).toBe('2 lines')
    expect(g.frame.x).toBeLessThanOrEqual(40)
    expect(g.frame.x + g.frame.w).toBeGreaterThanOrEqual(560)
    expect(g.all).not.toBeNull()
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    expect(layer.querySelectorAll('[data-suggestion-button="keep-all"]')).toHaveLength(1)
    // without the host's own Keep all, an action of lines only keeps (or discards) its lines
    suggestions.keepAll('lines')
    suggestions.discardAll('lines')
    expect(calls).toEqual(['keep ab', 'keep agone', 'discard ab', 'discard agone'])
    suggestions.destroy()
  })

  it('a tap shows a ghost\'s own Keep and Discard on a touch screen (the finger lifting does not hide them); another tap hides them', () => {
    const slate = fakeSlate()
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    suggestions.set([action({ items: [action().items[0]] })])
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    const visible = () => [...layer.querySelectorAll('[data-suggestion-controls]')].filter(el => (el as SVGGElement).style.display !== 'none').length
    const ghost = layer.querySelector('[data-suggestion="add:idea1"]')!
    const touch = (type: string) => { const e = new Event(type, { bubbles: true }); Object.defineProperty(e, 'pointerType', { value: 'touch' }); ghost.querySelector('[data-suggestion-hit]')!.dispatchEvent(e) }
    touch('pointerenter'); touch('pointerup'); touch('pointerleave')
    expect(visible()).toBe(1)
    touch('pointerup')
    expect(visible()).toBe(0)
    suggestions.destroy()
  })

  it('the host publishing the same suggestions again redraws nothing: a tapped ghost keeps its element and its buttons', async () => {
    const slate = fakeSlate()
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    const one = action({ items: [action().items[0], action().items[1]] })
    suggestions.set([one])
    await Promise.resolve(); await Promise.resolve()
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    const hitOf = (id: string) => layer.querySelector(`[data-suggestion-hit="${id}"]`)!
    const shown = () => [...layer.querySelectorAll('[data-suggestion-controls]')].filter(el => (el as SVGGElement).style.display !== 'none').map(el => el.getAttribute('data-suggestion-controls'))
    const before = hitOf('add:idea1')
    const tap = (id: string, type = 'pointerup') => { const e = new Event(type, { bubbles: true }); Object.defineProperty(e, 'pointerType', { value: 'touch' }); hitOf(id).dispatchEvent(e) }
    tap('add:idea1', 'pointerdown')
    // every change to any suggestion reaches every page: the same records again, as new objects, mid-tap
    suggestions.set([structuredClone(one)])
    suggestions.set([structuredClone(one)])
    expect(hitOf('add:idea1')).toBe(before)
    tap('add:idea1')
    expect(shown()).toEqual(['add:idea1'])
    // a real change (another answer arrives) redraws, and the tapped ghost still shows its buttons
    suggestions.set([structuredClone(one), action({ actionId: 'act2', items: [{ id: 'add:x', kind: 'add', state: 'pending', nodeId: 'x', node: v1('x', 'Other', 300, 400) }] })])
    expect(hitOf('add:idea1')).not.toBe(before)
    expect(shown()).toEqual(['add:idea1'])
    suggestions.destroy()
  })

  it('a mouse that left a ghost while it was redrawn does not leave its buttons in the way of a tap', () => {
    const slate = fakeSlate()
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    const one = action({ items: [action().items[0], action().items[1]] })
    suggestions.set([one])
    const layer = () => slate.host.querySelector('[data-agent-suggestions]')!
    const shown = () => [...layer().querySelectorAll('[data-suggestion-controls]')].filter(el => (el as SVGGElement).style.display !== 'none').map(el => el.getAttribute('data-suggestion-controls'))
    const send = (id: string, type: string, pointerType: string) => { const e = new Event(type, { bubbles: true }); Object.defineProperty(e, 'pointerType', { value: pointerType }); layer().querySelector(`[data-suggestion-hit="${id}"]`)!.dispatchEvent(e) }
    send('add:idea1', 'pointerenter', 'mouse')
    expect(shown()).toEqual(['add:idea1'])
    // redrawn under the mouse: the old element never hears it leave
    suggestions.set([one, action({ actionId: 'act2', items: [{ id: 'add:x', kind: 'add', state: 'pending', nodeId: 'x', node: v1('x', 'Other', 300, 400) }] })])
    // a tap on that same ghost shows its buttons (it does not take the mouse's for its own and hide them)
    send('add:idea1', 'pointerup', 'touch')
    expect(shown()).toEqual(['add:idea1'])
    send('add:idea1', 'pointerup', 'touch')
    expect(shown()).toEqual([])
    // a tap on another ghost moves them there; the first ghost losing focus to it hides nothing
    send('add:idea1', 'pointerup', 'touch')
    send('add:idea2', 'pointerup', 'touch')
    layer().querySelector('[data-suggestion="add:idea1"]')!.dispatchEvent(new FocusEvent('focusout', { relatedTarget: layer().querySelector('[data-suggestion-hit="add:idea2"]') }))
    expect(shown()).toEqual(['add:idea2'])
    suggestions.destroy()
  })

  it('the click that follows a tap does not press the button the tap just showed under the finger', () => {
    const slate = fakeSlate()
    const calls: string[] = []
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true, onDiscard: ref => calls.push('discard ' + ref.itemId), onKeep: ref => calls.push('keep ' + ref.itemId) })
    suggestions.set([action({ items: [action().items[0]] })])
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    const hit = layer.querySelector('[data-suggestion-hit="add:idea1"]')!
    const discard = layer.querySelector('[data-suggestion-controls="add:idea1"] [data-suggestion-button="discard"]')!
    const touch = (type: string) => { const e = new Event(type, { bubbles: true }); Object.defineProperty(e, 'pointerType', { value: 'touch' }); hit.dispatchEvent(e) }
    touch('pointerdown'); touch('pointerup')
    // the browser's click for that tap, at the same spot: now over the Discard the tap showed
    discard.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(calls).toEqual([])
    // a tap on the button itself presses it
    const press = new Event('pointerdown', { bubbles: true }); Object.defineProperty(press, 'pointerType', { value: 'touch' }); discard.dispatchEvent(press)
    discard.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1 }))
    expect(calls).toEqual(['discard add:idea1'])
    // and a keyboard or screen reader activation (detail 0) still works
    layer.querySelector('[data-suggestion-controls="add:idea1"] [data-suggestion-button="keep"]')!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(calls).toEqual(['discard add:idea1', 'keep add:idea1'])
    suggestions.destroy()
  })

  it('a redraw gives the focus back to the ghost (or button) that had it, and its buttons stay', () => {
    const slate = fakeSlate()
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => true })
    const one = action({ items: [action().items[0], action().items[1]] })
    suggestions.set([one])
    const layer = () => slate.host.querySelector('[data-agent-suggestions]')!
    const shown = () => [...layer().querySelectorAll('[data-suggestion-controls]')].filter(el => (el as SVGGElement).style.display !== 'none').map(el => el.getAttribute('data-suggestion-controls'))
    ;(layer().querySelector('[data-suggestion-hit="add:idea2"]') as SVGElement).focus()
    expect(shown()).toEqual(['add:idea2'])
    suggestions.set([one, action({ actionId: 'act2', items: [{ id: 'add:x', kind: 'add', state: 'pending', nodeId: 'x', node: v1('x', 'Other', 300, 400) }] })])
    expect(document.activeElement?.getAttribute('data-suggestion-hit')).toBe('add:idea2')
    expect(shown()).toEqual(['add:idea2'])
    ;(layer().querySelector('[data-suggestion-all="act2"] [data-suggestion-button="discard-all"]') as SVGElement).focus()
    suggestions.set([one, action({ actionId: 'act2', items: [{ id: 'add:x', kind: 'add', state: 'pending', nodeId: 'x', node: v1('x', 'Other, moved', 300, 400) }] })])
    expect(document.activeElement?.closest('[data-suggestion-all]')?.getAttribute('data-suggestion-all')).toBe('act2')
    expect(document.activeElement?.getAttribute('data-suggestion-button')).toBe('discard-all')
    suggestions.destroy()
  })

  it('a tag never sits on a real note: with every first spot covered, it takes the spot that covers least', () => {
    // real notes right above, below and inside the top edge of the frame's top left
    const slate = fakeSlate({ above: { x: 260, y: 40, width: 400, height: 40 }, below: { x: 260, y: 186, width: 400, height: 60 } })
    const suggestions = createAgentSuggestions(slate, { toNode, canAct: () => false })
    suggestions.set([action({ items: [action().items[0], action().items[1]] })])
    const [g] = suggestions.groups()
    const hit = (a: any, b: any) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h
    for (const id of ['above', 'below']) {
      const o = slate.nodes.one(id).options
      expect(hit(g.tag, { x: o.x, y: o.y, w: o.width, h: o.height })).toBe(false)
    }
    suggestions.destroy()
  })

  it('takes either engine shape: the v1 facade (slate.v2) or the v2 slate', () => {
    const v2 = fakeSlate({ brief: { x: 40, y: 100, width: 160, height: 80 } })
    const facade = { v2 }
    const suggestions = createAgentSuggestions(facade, { toNode })
    suggestions.set([action({ items: [action().items[0]] })])
    expect(v2.nodes.one('ghost-idea1')).toBeTruthy()
    suggestions.destroy()
  })

  it('pendingItems lists waiting suggestions in order, with their action', () => {
    expect(pendingItems([action()]).map(({ item, action: a }) => a.actionId + '/' + item.id)).toEqual([
      'act1/add:idea1', 'act1/add:idea2', 'act1/link:l1', 'act1/update:brief', 'act1/remove:old',
    ])
    expect(pendingItems(null as any)).toEqual([])
  })
})

const record = (over: Partial<AgentPresenceRecord> = {}): AgentPresenceRecord => ({
  agentKey: 'a1b2c3d4e5f6', label: "Ada's agent", initial: 'A', colorIndex: 0, targets: [],
  plan: null, status: 'live', updatedAt: 1000, expiresAt: 31000, ...over,
})

describe('agent choreography: spots, beats, bubbles, origin', () => {
  it('goes to an empty spot first, then visits the notes one beat each', async () => {
    let clock = 1000
    const slate = fakeSlate({ ghost: { x: 400, y: 400, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now: () => clock, reducedMotion: () => false })
    presence.set([record({ point: { x: 200, y: 150 } })])
    expect(presence.shown()[0]).toMatchObject({ x: 200, y: 150 })
    presence.set([record({ point: { x: 200, y: 150 }, targets: ['ghost'], updatedAt: 2000 })])
    clock += AGENT_BEAT_MS
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0]).toMatchObject({ x: 200, y: 150 })
    clock += AGENT_BEAT_MS
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0]).toMatchObject({ x: 492, y: 492 })
    presence.destroy()
  })

  it('says a short line in a bubble for a few seconds, as plain text', () => {
    let clock = 5000
    const slate = fakeSlate()
    const presence = createAgentPresence(slate, { now: () => clock, reducedMotion: () => true })
    presence.set([record({ say: 'Placing 3 <b>sources</b>', sayAt: 5000, point: { x: 100, y: 100 } })])
    const bubble = slate.host.querySelector('[data-agent-say]')!
    expect(bubble.textContent).toBe('Placing 3 <b>sources</b>')
    expect(bubble.querySelector('b')).toBeNull()
    expect(agentSaying(record({ say: 'Hi', sayAt: 5000 }), 5000 + AGENT_SAY_MS)).toBeNull()
    clock = 5000 + AGENT_SAY_MS
    presence.set([record({ say: 'Placing 3 sources', sayAt: 5000, point: { x: 100, y: 100 } })])
    expect(slate.host.querySelector('[data-agent-say]')).toBeNull()
    presence.destroy()
  })

  it('names where an agent comes from, and draws an invited agent\'s icon only from a safe address', () => {
    expect(agentOrigin({ origin: 'visiting', via: 'Claude' })).toBe('via Claude')
    expect(agentOrigin({ origin: 'invited', invitedBy: 'Ada' })).toBe('added by Ada')
    expect(agentOrigin({ origin: 'slatebox' })).toBe('')
    // A visiting agent whose label already names its client is not named twice.
    expect(agentName({ label: "Ada's agent · Claude", origin: 'visiting', via: 'Claude' })).toBe("Ada's agent · Claude")
    expect(agentName({ label: "Ada's agent", origin: 'visiting', via: 'Claude' })).toBe("Ada's agent · via Claude")
    expect(agentName({ label: 'Research', origin: 'invited', invitedBy: 'Ada' })).toBe('Research · added by Ada')
    expect(safeIconUrl('https://cdn.example.com/i.png')).toBe('https://cdn.example.com/i.png')
    expect(safeIconUrl('javascript:alert(1)')).toBeNull()
    expect(safeIconUrl('http://example.com/i.png')).toBeNull()
    expect(safeIconUrl('data:image/svg+xml;base64,PHN2Zz4=')).toBeNull()
    expect(safeIconUrl('data:image/png;base64,iVBORw0KGgo=')).toBe('data:image/png;base64,iVBORw0KGgo=')
    const slate = fakeSlate()
    const presence = createAgentPresence(slate, { now: () => 1000, reducedMotion: () => true })
    presence.set([record({ label: 'Research', origin: 'invited', invitedBy: 'Ada', iconUrl: 'https://cdn.example.com/r.png' })])
    expect(slate.host.querySelector('[data-agent-tag]')!.textContent).toContain('Research · added by Ada')
    expect(slate.host.querySelector('[data-agent-icon]')!.getAttribute('href')).toBe('https://cdn.example.com/r.png')
    presence.set([record({ label: 'Research', iconUrl: 'javascript:alert(1)' })])
    expect(slate.host.querySelector('[data-agent-icon]')).toBeNull()
    presence.destroy()
  })
})
