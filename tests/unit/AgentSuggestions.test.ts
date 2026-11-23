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
    expect(shown.map(item => [item.itemId, item.kind, item.controls])).toEqual([
      ['add:idea1', 'add', true], ['add:idea2', 'add', true], ['link:l1', 'link', true], ['update:brief', 'update', true], ['remove:old', 'remove', true],
    ])
    expect(shown[0].box).toEqual({ x: 300, y: 100, w: 160, h: 80 })
    const layer = slate.host.querySelector('[data-agent-suggestions]')!
    expect(layer.querySelectorAll('[data-suggestion-outline]')).toHaveLength(4)
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
    press('add:idea1', 'keep')
    press('add:idea2', 'discard')
    press('remove:old', 'keep')
    expect(calls).toEqual(['keep add:idea1', 'discard add:idea2', 'keep remove:old'])
    // The buttons are reachable by keyboard and say whose suggestion and what.
    const keep = layer().querySelector('[data-suggestion="add:idea1"] [data-suggestion-button="keep"]')!
    expect(keep.getAttribute('role')).toBe('button')
    expect(keep.getAttribute('aria-label')).toBe("Keep Ada's agent · via Claude's suggestion: add “Retry after 24h”")
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
