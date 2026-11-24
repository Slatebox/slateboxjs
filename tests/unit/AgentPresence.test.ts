import { describe, it, expect, afterEach } from 'vitest'
import { SVG } from '@svgdotjs/svg.js'
import {
  AGENT_BEAT_MS, AGENT_PALETTE, agentChecklist, agentStepText, agentTagBox, agentTagPlaced, agentTagSide, createAgentPresence, visibleAgents, type AgentPresenceRecord,
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

  it('says what an agent that suggests is doing: Suggesting… while it lands, Waiting for you while its group waits, never Done before', () => {
    const done = { steps: [{ text: 'Ask Exa', status: 'done' as const }, { text: 'Place suggestions', status: 'done' as const }], current: 1 }
    const ghosts = ['ghost-a', 'ghost-b']
    // Its run ended as it filed the suggestion: on its way to the ghosts it is suggesting, once there it waits for you.
    expect(agentStepText(record({ plan: done, targets: ghosts, status: 'done', endedAt: 1000 }), { landing: true })).toBe('Suggesting…')
    expect(agentStepText(record({ plan: done, targets: ghosts, status: 'done', endedAt: 1000, waiting: true }))).toBe('Waiting for you')
    expect(agentStepText(record({ plan: done, targets: ghosts, status: 'done', endedAt: 1000, waiting: true }), { landing: true })).toBe('Suggesting…')
    // A live run that has filed one (its targets are ghosts) is suggesting whatever its plan says.
    expect(agentStepText(record({ plan: done, targets: ghosts }))).toBe('Suggesting…')
    // Nothing waits any more (kept or discarded): Done. A stopped step still says so first.
    expect(agentStepText(record({ plan: done, status: 'done', endedAt: 1000 }))).toBe('Done')
    expect(agentStepText(record({ plan: { steps: [{ text: 'Ask Exa', status: 'stopped' }], current: 0 }, waiting: true }))).toBe('Stopped: Ask Exa')
    // A greeting (no ghosts) keeps its own words.
    expect(agentStepText(record({ message: "Hi, I'm Exa.", point: { x: 10, y: 10 } }))).toBe("Hi, I'm Exa.")
  })

  it('draws the tag with "Suggesting…" while the pointer glides to its ghosts, then what it does once there', () => {
    const slate = fakeSlate({ 'ghost-a': { x: 500, y: 300, width: 160, height: 80 } })
    let frames: FrameRequestCallback[] = []
    const raf = globalThis.requestAnimationFrame
    globalThis.requestAnimationFrame = ((fn: FrameRequestCallback) => { frames.push(fn); return frames.length }) as any
    try {
      const presence = createAgentPresence(slate, { now, reducedMotion: () => false })
      const done = { steps: [{ text: 'Place suggestions', status: 'done' as const }], current: 0 }
      presence.set([record({ plan: done, targets: ['ghost-a'], point: { x: 100, y: 100 }, status: 'done', endedAt: 1000, waiting: true })])
      expect(presence.shown()[0].step).toBe('Suggesting…')
      // The glide ends (time passes, frames run): the tag is drawn again with what it does now.
      clock += 2000
      for (let i = 0; i < 5 && frames.length; i++) { const run = frames; frames = []; run.forEach(fn => fn(clock)) }
      expect(presence.shown()[0].step).toBe('Waiting for you')
      presence.destroy()
    } finally { globalThis.requestAnimationFrame = raf }
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
    // Drawn for the view only: no export keeps it (Export removes [data-export-never]).
    expect(layer.hasAttribute('data-export-never')).toBe(true)
    expect(layer.querySelector('[data-agent-avatar] polygon')).toBeTruthy()
    // Text is set as text: a tag in a client name stays characters, never markup.
    expect(layer.querySelector('b')).toBeNull()
    expect(layer.textContent).toContain("Ada's agent · <b>Tool</b>")
    expect(layer.textContent).toContain('Drafting a brief')
    const [shown] = presence.shown()
    // The pointer rests just inside the note's lower right corner, so its tag can sit off the note.
    expect(shown).toMatchObject({ x: 292, y: 192, step: 'Drafting a brief' })
    expect(layer.querySelector('[data-agent] path')!.getAttribute('fill')).toBe(AGENT_PALETTE[0])
    presence.destroy()
    expect(slate.host.querySelector('[data-agent-presence]')).toBeNull()
  })

  it('glides to a new target and visits several in order', async () => {
    const slate = fakeSlate({ a: { x: 0, y: 0, width: 100, height: 100 }, b: { x: 400, y: 0, width: 100, height: 100 }, c: { x: 400, y: 400, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => false })
    presence.set([record({ targets: ['a'] })])
    expect(presence.shown()[0]).toMatchObject({ x: 92, y: 92 })
    presence.set([record({ targets: ['b', 'c'], updatedAt: 2000 })])
    // One beat per spot: AGENT_BEAT_MS (450 ms) each.
    clock += AGENT_BEAT_MS
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0].x).toBeCloseTo(492)
    clock += AGENT_BEAT_MS
    await new Promise(resolve => setTimeout(resolve, 40))
    expect(presence.shown()[0]).toMatchObject({ x: 492, y: 492 })
    presence.destroy()
  })

  it('goes to a save\'s notes once they are drawn, when the record arrived first', () => {
    const slate = fakeSlate({ a: { x: 0, y: 0, width: 100, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['late'] })])
    // Before its notes are drawn it waits inside the view, in the corner where its tag covers no note: here the top right,
    // its tip far enough in that the 14px chevron is seen whole (it used to sit 8px in, its chevron cut by the edge).
    expect(presence.shown()[0]).toMatchObject({ x: 776, y: 8, side: { right: false, down: true } })
    ;(slate.nodes.allNodes as any[]).push({ options: { id: 'late', x: 300, y: 300, width: 100, height: 50 } })
    presence.set([record({ targets: ['late'] })])
    expect(presence.shown()[0]).toMatchObject({ x: 392, y: 342 })
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

  it('puts the tag on the side of the pointer that stays in view and off the note it works on', () => {
    // Near the right edge: the tag goes left. Near the bottom: it goes up. In the corner: both.
    const slate = fakeSlate({
      middle: { x: 300, y: 200, width: 160, height: 80 },
      right: { x: 640, y: 200, width: 150, height: 80 },
      bottom: { x: 300, y: 520, width: 160, height: 70 },
      corner: { x: 640, y: 520, width: 150, height: 70 },
    })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    const sideOf = (target: string) => {
      presence.set([record({ targets: [target], message: 'Connect Monday to the customer email' })])
      return presence.shown()[0].side
    }
    expect(sideOf('middle')).toEqual({ right: true, down: true })
    expect(sideOf('right')).toEqual({ right: false, down: true })
    expect(sideOf('bottom')).toEqual({ right: true, down: false })
    expect(sideOf('corner')).toEqual({ right: false, down: false })
    // Whatever side it takes, the tag stays inside the view box and off its note.
    for (const target of ['middle', 'right', 'bottom', 'corner']) {
      presence.set([record({ targets: [target], message: 'Connect Monday to the customer email' })])
      const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
      const [x, y] = [Number(tag.getAttribute('x')), Number(tag.getAttribute('y'))]
      const at = presence.shown()[0]
      const box = { x: at.x + x, y: at.y + y, w: Number(tag.getAttribute('width')), h: Number(tag.getAttribute('height')) }
      expect(box.x).toBeGreaterThanOrEqual(0)
      expect(box.y).toBeGreaterThanOrEqual(0)
      expect(box.x + box.w).toBeLessThanOrEqual(800)
      expect(box.y + box.h).toBeLessThanOrEqual(600)
      const note = slate.nodes.one(target)!.options
      const overlaps = box.x < note.x + note.width && note.x < box.x + box.w && box.y < note.y + note.height && note.y < box.y + box.h
      expect(overlaps, target).toBe(false)
    }
    presence.destroy()
  })

  it('chooses the side that covers least when every side covers something', () => {
    const view = { x: 0, y: 0, w: 400, h: 300 }
    const size = { w: 200, h: 40 }
    // A note to the right-down of the pointer and one to the left-down: up wins.
    const at = { x: 200, y: 150 }
    const rightDown = agentTagBox(at, size, 1, { right: true, down: true })
    const leftDown = agentTagBox(at, size, 1, { right: false, down: true })
    expect(agentTagSide(at, size, 1, view, [rightDown, leftDown])).toEqual({ right: true, down: false })
    // Zoomed out (half a screen pixel per world unit), the tag is twice as big in world units.
    expect(agentTagBox(at, size, 0.5, { right: true, down: true })).toEqual({ x: 280, y: 210, w: 400, h: 80 })
  })

  it('covers no words where it can: a tag goes over a note\'s empty paper rather than over anyone\'s words', () => {
    const view = { x: 0, y: 0, w: 800, h: 600 }
    const size = { w: 200, h: 40 }
    const at = { x: 400, y: 300 }
    // A big column note under every side, and a line of words right-down of the pointer: right-down is the one side not to take.
    const column = { x: 0, y: 0, w: 800, h: 600 }
    const words = [agentTagBox(at, size, 1, { right: true, down: true })]
    expect(agentTagSide(at, size, 1, view, [], [column], words)).toEqual({ right: false, down: true })
    // Words to the left-down too: up.
    words.push(agentTagBox(at, size, 1, { right: false, down: true }))
    expect(agentTagSide(at, size, 1, view, [], [column], words)).toEqual({ right: true, down: false })
    // A note it works on still counts: of two sides clear of words, the one off that note wins.
    const target = agentTagBox(at, size, 1, { right: true, down: false })
    expect(agentTagSide(at, size, 1, view, [target], [column], words)).toEqual({ right: false, down: false })
  })

  it('judges a side where its tag would really be drawn: one slid back into view can be the clear one', () => {
    const view = { x: 0, y: 0, w: 400, h: 300 }
    const size = { w: 200, h: 40 }
    const at = { x: 380, y: 100 }
    // Words above the pointer, and words where the left-down tag would go. Right-down leaves the view, so it is drawn
    // slid back inside (x 196 to 396), where it covers nothing: that side wins over covering words.
    const words = [{ x: 0, y: 10, w: 400, h: 60 }, { x: 140, y: 130, w: 50, h: 40 }]
    expect(agentTagSide(at, size, 1, view, [], [], words)).toEqual({ right: true, down: true })
    expect(agentTagPlaced(at, size, 1, { right: true, down: true }, view)).toEqual({ x: 196, y: 130, w: 200, h: 40 })
  })

  it('keeps out of what the host covers at the canvas\'s edges (insets), and waits with its chevron whole', () => {
    const slate = fakeSlate({ top: { x: 0, y: 0, width: 800, height: 240 } })
    ;(slate.canvas.node as any).getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, width: 800, height: 600, right: 800, bottom: 600 })
    // The host draws a 120px strip over the bottom of the canvas, and a note fills the top, so the agent waits at the bottom.
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true, insets: () => ({ bottom: 120 }) })
    presence.set([record({ message: 'Draft' })])
    const at = presence.shown()[0]
    expect(at.side.down).toBe(false)
    // Above the strip, and the chevron (14px from its tip) inside the view.
    expect(at.y).toBeGreaterThan(300)
    expect(at.y + 14).toBeLessThanOrEqual(480)
    expect(at.x + 14).toBeLessThanOrEqual(800)
    const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    expect(at.y + Number(tag.getAttribute('y')) + Number(tag.getAttribute('height'))).toBeLessThanOrEqual(480)
    presence.destroy()
  })

  it('reads what the canvas shows when the element crops its view box (preserveAspectRatio slice)', () => {
    const slate = fakeSlate({ note: { x: 440, y: 200, width: 80, height: 80 } })
    // The element is 400 by 600 pixels and slices an 800 by 600 view box: only x 200 to 600 is on screen, at 1:1.
    slate.canvas.attr('preserveAspectRatio', 'xMidYMid slice')
    ;(slate.canvas.node as any).getBoundingClientRect = () => ({ x: 0, y: 0, left: 0, top: 0, width: 400, height: 600, right: 400, bottom: 600 })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['note'], message: 'Draft' })])
    const [shown] = presence.shown()
    expect(shown.side.right).toBe(false)
    const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    expect(shown.x + Number(tag.getAttribute('x')) + Number(tag.getAttribute('width'))).toBeLessThanOrEqual(600)
    expect(shown.x + Number(tag.getAttribute('x'))).toBeGreaterThanOrEqual(200)
    presence.destroy()
  })

  it('chooses the side again when the view pans, so a tag that would leave the screen comes back on', async () => {
    const slate = fakeSlate({ note: { x: 300, y: 200, width: 120, height: 80 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['note'], message: 'Draft' })])
    expect(presence.shown()[0].side).toEqual({ right: true, down: true })
    // The camera pans right: the note is now near the right edge of what is shown.
    slate.canvas.viewbox(-300, 0, 800, 600)
    await new Promise(resolve => setTimeout(resolve, 320))
    expect(presence.shown()[0].side.right).toBe(false)
    presence.destroy()
  })

  it('moves its tag off a note that is dropped under it, once the note stays put', async () => {
    const slate = fakeSlate({ note: { x: 300, y: 200, width: 120, height: 80 }, other: { x: 600, y: 500, width: 120, height: 60 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['note'], message: 'Draft' })])
    expect(presence.shown()[0].side).toEqual({ right: true, down: true })
    // Someone drops a card right where the tag is (to the right of and below the note's corner).
    const other = slate.nodes.one('other')!.options
    Object.assign(other, { x: 440, y: 300 })
    await new Promise(resolve => setTimeout(resolve, 600))
    const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    const at = presence.shown()[0]
    const box = { x: at.x + Number(tag.getAttribute('x')), y: at.y + Number(tag.getAttribute('y')), w: Number(tag.getAttribute('width')), h: Number(tag.getAttribute('height')) }
    const covers = box.x < other.x + other.width && other.x < box.x + box.w && box.y < other.y + other.height && other.y < box.y + box.h
    expect(covers).toBe(false)
    presence.destroy()
  })

  it('keeps the tag on screen when no side fits, as on a phone that frames a note edge to edge', () => {
    const slate = fakeSlate({ wide: { x: 10, y: 200, width: 780, height: 80 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['wide'], message: 'Map the new signup flow' })])
    const at = presence.shown()[0]
    const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    const x = at.x + Number(tag.getAttribute('x')), w = Number(tag.getAttribute('width'))
    expect(x).toBeGreaterThanOrEqual(0)
    expect(x + w).toBeLessThanOrEqual(800)
    presence.destroy()
  })

  it('leaves the tag beside its pointer when the camera is not showing the note it works on', () => {
    const slate = fakeSlate({ away: { x: 1200, y: 200, width: 120, height: 80 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['away'], message: 'Draft' })])
    const at = presence.shown()[0]
    expect(at.x).toBeGreaterThan(800)
    // Its words are not pulled into a view the agent is not in, where they would lie over whatever is shown there.
    const tag = slate.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    expect(at.x + Number(tag.getAttribute('x'))).toBeGreaterThan(800)
    presence.destroy()
    // Just off the left edge: the tag goes on the side away from the view, so none of it is cut by the edge.
    const near = fakeSlate({ left: { x: -150, y: 200, width: 120, height: 80 } })
    const other = createAgentPresence(near, { now, reducedMotion: () => true })
    other.set([record({ targets: ['left'], message: 'Draft' })])
    const shown = other.shown()[0], rect = near.host.querySelector('[data-agent-tag] rect') as SVGRectElement
    expect(shown.x).toBeLessThan(0)
    expect(shown.x + Number(rect.getAttribute('x')) + Number(rect.getAttribute('width'))).toBeLessThanOrEqual(0)
    other.destroy()
  })

  it('keeps the avatar on screen when the pointer is at the edge of the view', () => {
    const slate = fakeSlate({ wide: { x: 10, y: 200, width: 785, height: 80 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['wide'], message: 'Draft' })])
    const at = presence.shown()[0]
    const avatar = slate.host.querySelector('[data-agent-avatar]') as SVGGElement
    const shift = /translate\(([-\d.]+)/.exec(avatar.getAttribute('transform') || '')?.[1] ?? '0'
    // The hexagon is drawn 13 to 35 pixels right of the pointer; at the right edge it is mirrored to the left.
    if (at.x + 36 > 800) expect(Number(shift)).toBeLessThan(0)
    expect(at.x + Number(shift) + 35).toBeLessThanOrEqual(800)
    presence.destroy()
  })
})

describe('agent presence: an agent working out of view', () => {
  it('gets a marker at the edge of the view toward it, in words; pressing it brings the view there', () => {
    const slate = fakeSlate({ far: { x: 2000, y: 200, width: 200, height: 100 }, near: { x: 100, y: 100, width: 100, height: 100 } })
    const went: Array<{ x: number; y: number }> = []
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true, goTo: (point) => went.push(point) })
    presence.set([record({ label: 'Research', targets: ['far'] })])
    const marker = slate.host.querySelector('[data-agent-edge]')!
    expect(marker).toBeTruthy()
    expect(marker.textContent).toBe('Research is working →')
    expect(marker.getAttribute('role')).toBe('button')
    expect(presence.shown()[0].offscreen).toBe(true)
    marker.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(went).toHaveLength(1)
    expect(went[0].x).toBeGreaterThan(800)
    // back in view: no marker
    presence.set([record({ label: 'Research', targets: ['near'], updatedAt: 2000 })])
    expect(slate.host.querySelector('[data-agent-edge]')).toBeNull()
    expect(presence.shown()[0].offscreen).toBe(false)
    presence.destroy()
  })

  it('words on the canvas are 12px or larger: the tag, its step and the avatar initial', () => {
    const slate = fakeSlate({ brief: { x: 100, y: 100, width: 200, height: 100 } })
    const presence = createAgentPresence(slate, { now, reducedMotion: () => true })
    presence.set([record({ targets: ['brief'], message: 'Drafting a brief' })])
    const sizes = [...slate.host.querySelectorAll('[data-agent-presence] text')].map((t) => Number(t.getAttribute('font-size')))
    expect(sizes.length).toBeGreaterThanOrEqual(3)
    for (const size of sizes) expect(size).toBeGreaterThanOrEqual(12)
    presence.destroy()
  })
})
