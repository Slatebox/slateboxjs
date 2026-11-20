import { describe, it, expect, afterEach } from 'vitest'
import { SVG } from '@svgdotjs/svg.js'
import {
  AGENT_PALETTE, agentChecklist, agentStepText, createAgentPresence, visibleAgents, type AgentPresenceRecord,
} from '../../src/core/AgentPresence'

function fakeSlate(notes: Record<string, { x: number; y: number; width: number; height: number }> = {}) {
  const host = document.createElement('div')
  document.body.appendChild(host)
  const canvas = SVG().addTo(host).size(800, 600).viewbox(0, 0, 800, 600)
  const nodes = Object.entries(notes).map(([id, box]) => ({ options: { id, ...box } }))
  return {
    canvas,
    nodes: { one: (id: string) => nodes.find(node => node.options.id === id), allNodes: nodes },
    host,
  }
}

const record = (over: Partial<AgentPresenceRecord> = {}): AgentPresenceRecord => ({
  agentKey: 'a1b2c3d4e5f6', label: "Ada's agent", initial: 'A', colorIndex: 0, targets: [],
  plan: null, status: 'live', updatedAt: 1000, expiresAt: 31000, ...over,
})

let clock = 1000
const now = () => clock
afterEach(() => { document.body.innerHTML = ''; clock = 1000 })

describe('agent presence: what is shown', () => {
  it('shows the current step, the save message without a plan, and Done at the end', () => {
    const plan = { steps: [{ text: 'Read the interview notes', status: 'done' as const }, { text: 'Draft a brief', status: 'doing' as const }, { text: 'Map the new signup flow', status: 'todo' as const }], current: 1 }
    expect(agentStepText(record({ plan }))).toBe('Draft a brief')
    expect(agentChecklist(record({ plan }))).toEqual(['✓ Read the interview notes', '◌ Draft a brief', '○ Map the new signup flow'])
    expect(agentStepText(record({ message: 'Add the brief' }))).toBe('Add the brief')
    expect(agentStepText(record({ plan: { steps: [{ text: 'One', status: 'done' }, { text: 'Two', status: 'skipped' }], current: 1 } }))).toBe('Done')
    expect(agentStepText(record({ plan: { steps: [{ text: 'One', status: 'stopped' }], current: 0 } }))).toBe('Stopped: One')
  })

  it('hides a silent run when it expires, holds an ended one, then fades it', () => {
    const live = record()
    expect(visibleAgents([live], 30999)).toHaveLength(1)
    expect(visibleAgents([live], 31000)).toHaveLength(0)
    const ended = record({ status: 'done', endedAt: 5000, expiresAt: 13000 })
    expect(visibleAgents([ended], 10999)[0].opacity).toBe(1)
    expect(visibleAgents([ended], 11300)[0].opacity).toBeCloseTo(0.5)
    expect(visibleAgents([ended], 11600)).toHaveLength(0)
  })

  it('draws at most six agents, the most recently active', () => {
    const many = Array.from({ length: 8 }, (_, i) => record({ agentKey: 'k' + i, updatedAt: 1000 + i }))
    expect(visibleAgents(many, 2000).map(item => item.record.agentKey)).toEqual(['k7', 'k6', 'k5', 'k4', 'k3', 'k2'])
  })
})

describe('agent presence on a canvas', () => {
  it('draws a hexagon agent with its tag as plain text, apart from people cursors', () => {
    const slate = fakeSlate({ brief: { x: 100, y: 100, width: 200, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ label: "Ada's agent · <b>Tool</b>", targets: ['brief'], message: 'Drafting a brief' })])
    const layer = slate.host.querySelector('[data-agent-presence]')!
    expect(layer).toBeTruthy()
    expect(layer.querySelector('[data-agent-avatar] polygon')).toBeTruthy()
    // Text is set as text: a tag in a client name stays characters, never markup.
    expect(layer.querySelector('b')).toBeNull()
    expect(layer.textContent).toContain("Ada's agent · <b>Tool</b>")
    expect(layer.textContent).toContain('Drafting a brief')
    const [shown] = presence.shown()
    expect(shown).toMatchObject({ x: 200, y: 150, step: 'Drafting a brief' })
    expect(layer.querySelector('[data-agent] path')!.getAttribute('fill')).toBe(AGENT_PALETTE[0])
    presence.destroy()
    expect(slate.host.querySelector('[data-agent-presence]')).toBeNull()
  })

  it('glides to a new target and visits several in order', async () => {
    const slate = fakeSlate({ a: { x: 0, y: 0, width: 100, height: 100 }, b: { x: 400, y: 0, width: 100, height: 100 }, c: { x: 400, y: 400, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => false })
    presence.set([record({ targets: ['a'] })])
    expect(presence.shown()[0]).toMatchObject({ x: 50, y: 50 })
    presence.set([record({ targets: ['b', 'c'], updatedAt: 2000 })])
    clock += 250
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0].x).toBeCloseTo(450)
    clock += 250
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0]).toMatchObject({ x: 450, y: 450 })
    presence.destroy()
  })

  it('goes to a save\'s notes once they are drawn, when the record arrived first', () => {
    const slate = fakeSlate({ a: { x: 0, y: 0, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['late'] })])
    expect(presence.shown()[0]).toMatchObject({ x: -40, y: -40 })
    ;(slate.nodes.allNodes as any[]).push({ options: { id: 'late', x: 300, y: 300, width: 100, height: 50 } })
    presence.set([record({ targets: ['late'] })])
    expect(presence.shown()[0]).toMatchObject({ x: 350, y: 325 })
    presence.destroy()
  })

  it('shows only the current step when two agents are on screen, and the list when a tag is tapped', () => {
    const slate = fakeSlate({ a: { x: 0, y: 0, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    const plan = { steps: [{ text: 'Read the interview notes', status: 'doing' as const }, { text: 'Draft a brief', status: 'todo' as const }], current: 0 }
    presence.set([record({ plan, targets: ['a'] })])
    expect(slate.host.querySelectorAll('[data-agent-plan]')).toHaveLength(1)
    presence.set([record({ plan, targets: ['a'] }), record({ agentKey: 'other', label: "Ben's agent", initial: 'B', colorIndex: 1, updatedAt: 900 })])
    expect(slate.host.querySelectorAll('[data-agent-plan]')).toHaveLength(0)
    ;(slate.host.querySelector('[data-agent="a1b2c3d4e5f6"] [data-agent-tag]') as any).dispatchEvent(new window.MouseEvent('click', { bubbles: true }))
    expect(slate.host.querySelectorAll('[data-agent-plan]')).toHaveLength(1)
    expect(slate.host.querySelector('[data-agent-plan]')!.textContent).toContain('◌ Read the interview notes')
    presence.destroy()
  })

  it('keeps the final checklist after the run ends, then removes it', async () => {
    const slate = fakeSlate()
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true, holdMs: 30, fadeMs: 30 })
    presence.set([record({ status: 'done', endedAt: 1000, expiresAt: 9000, plan: { steps: [{ text: 'One', status: 'done' }], current: 0 } })])
    expect(presence.shown()).toHaveLength(1)
    clock = 1045
    await new Promise(resolve => setTimeout(resolve, 60))
    expect(presence.shown()[0].opacity).toBeLessThan(1)
    clock = 1100
    await new Promise(resolve => setTimeout(resolve, 60))
    expect(presence.shown()).toHaveLength(0)
    presence.destroy()
  })
})
