import { describe, expect, it, vi } from 'vitest'
import { validateWorkshop, workshopLanePlaces, workshopToSlate, type Workshop } from '../../src/workshops/model'
import { catalog, catalogPreset } from '../../src/workshops/catalog'
import { catalogSamples } from '../../src/workshops/samples'
import '../../src/workshops/rules'
import '../../src/workshops/behaviour'
import { kitFor } from '../../src/boards'
import '../../src/boards/nest'
import { ruleControls, ruleControlsFamily, type RuleControl } from '../../src/workshops/controls'
import { drawRuleControls, HINT_DELAY } from '../../src/boards/ruleControlsLayer'
import { boardBadgeShapes } from '../../src/workshops/boardChrome'
import { boxesOverlap, fitName, HEADER_TARGET, type HeaderBox } from '../../src/workshops/laneHeader'
import { ruleControlsLayoutOf } from '../../src/workshops/laneHeader'

// A lane's header (laneHeader.ts): its name, then its color button, and under them a strip of the status toggle, − , the
// limit's value and + . No control is ever drawn over a lane's name or its counter or caption, on any board, at any width or
// chrome scale; every header shows its controls in that one order; and a screen reader hears them in it, a lane at a time.

const preset = (id: string) => validateWorkshop(catalogPreset(id, undefined, catalogSamples))
type Words = { lane: string; kind: 'name' | 'counter' | 'caption'; box: HeaderBox }

/** A board as drawn: the layout the controls get, and the boxes of the words its notes show (names, counters, captions). */
function drawn(board: Workshop, narrow: boolean) {
  const kit = board.kind ? kitFor(board.kind as never) : undefined
  if (kit) {
    const out = kit.places(board, (narrow ? { narrow: true, width: 390 } : { lanesPerRow: 5 }) as never)
    const parts = out.parts as { name: string; x: number; y: number; width: number; height: number; text?: string }[]
    const words: Words[] = parts.filter(part => (part.name.startsWith('lane-') || part.name.startsWith('caption-')) && (part.text || part.name.startsWith('lane-')))
      .map(part => ({ lane: part.name.replace(/^(lane|caption)-/, ''), kind: part.name.startsWith('lane-') ? 'name' : 'caption', box: part }))
    return { layout: ruleControlsLayoutOf(parts, out.width, out.height), words }
  }
  const layout = workshopLanePlaces(board, narrow ? { layout: { lanesPerRow: 1 } as never } : {})
  const nodes = workshopToSlate(board, { native: true, ...(narrow ? { layout: { lanesPerRow: 1 } as never } : {}) }).nodes
  const words: Words[] = []
  for (const lane of board.lanes) {
    for (const [id, kind] of [['lane-' + lane.id, 'name'], ['caption-' + lane.id, 'counter']] as const) {
      const o = nodes.find(node => node.options.id === id)?.options as Record<string, number & string> | undefined
      if (o && (kind === 'name' || o.text)) words.push({ lane: lane.id, kind, box: { x: o.xPos, y: o.yPos, width: o.width, height: o.height } })
    }
  }
  return { layout, words }
}

const boards = () => catalog.map(entry => ({ id: entry.id, board: preset(entry.id) }))
const headerOf = (controls: RuleControl[], lane: string) => controls.filter(control => control.anchor.kind === 'lane' && control.anchor.id === lane && control.look.shape !== 'line')

describe('lane header: no control on a lane’s words', () => {
  for (const narrow of [false, true]) {
    for (const scale of [1, 2]) {
      it(`every catalog board, ${narrow ? 'on a phone' : 'wide'}, chrome scale ${scale}: no control’s hit box meets a name, counter or caption`, () => {
        let checked = 0
        for (const { id, board } of boards()) {
          const { layout, words } = drawn(board, narrow)
          const controls = ruleControls(board, layout, { scale, finger: narrow })
          for (const control of controls) {
            for (const word of words) {
              expect(boxesOverlap(control.hit, word.box), `${id}: ${control.id} on ${word.lane}'s ${word.kind}`).toBe(false)
              checked++
            }
          }
        }
        expect(checked).toBeGreaterThan(100)
      })
    }
  }

  it('a long lane name ends in an ellipsis inside its box, and its note’s name keeps all of it', () => {
    const long = 'Waiting on the customer to send the signed paperwork back to legal'
    const board = validateWorkshop({ version: 1, title: 'T', lanes: [{ id: 'a', label: long }, { id: 'b', label: 'Done' }], cards: [] })
    const note = workshopToSlate(board, { native: true }).nodes.find(node => node.options.id === 'lane-a')!.options as Record<string, any>
    expect(note.text.endsWith('…')).toBe(true)
    expect(long.startsWith(note.text.slice(0, -1))).toBe(true)
    expect(note.name).toBe(long)
    const fitted = fitName(long, 16, 164, 32)
    expect(fitted.fontSize).toBe(11)
    expect(fitted.text.length).toBeLessThan(long.length)
    expect(fitName('Lead', 16, 164, 32)).toEqual({ text: 'Lead', fontSize: 16 })
  })

  it('a pipeline stage’s long name is cut short on the canvas, never under its color button', () => {
    const board = preset('sales-pipeline')
    const lane = board.lanes[0]
    const renamed = validateWorkshop({ ...board, lanes: board.lanes.map(item => item.id === lane.id ? { ...item, label: 'Qualified by the regional enterprise team leads' } : item) })
    const kit = kitFor(renamed.kind as never)!
    const notes = kit.notes(renamed, {} as never, { x: 0, y: 0 }, {} as never)
    const note = notes.find(item => item.options.id === 'lane-' + lane.id)!.options as Record<string, any>
    expect(note.name).toBe('Qualified by the regional enterprise team leads')
    const { layout } = drawn(renamed, false)
    const color = ruleControls(renamed, layout).find(control => control.id === 'color:' + lane.id)!
    expect(boxesOverlap(color.hit, { x: note.xPos, y: note.yPos, width: note.width, height: note.height })).toBe(false)
  })
})

describe('lane header: one order on every board', () => {
  /** A header control's slot: its row (the name's, or the strip), then left to right. */
  const slot = (control: RuleControl) => control.id.split(':')[0]
  const ORDER = ['color', 'bin', 'gate', 'capacity-minus', 'capacity-plus']

  it('pipeline, board of columns, nest and plan: color beside the name, then status, −, + in the strip, never overlapping, a finger each', () => {
    let lanes = 0
    for (const narrow of [false, true]) {
      for (const { id, board } of boards()) {
        const { layout } = drawn(board, narrow)
        const controls = ruleControls(board, layout, { scale: 2, finger: narrow })
        for (const lane of board.lanes) {
          const header = headerOf(controls, lane.id)
          if (!header.length) continue
          lanes++
          // The order they come in (the DOM's, so Tab's) is the fixed one.
          const order = header.map(slot)
          expect(order, id + ' ' + lane.id).toEqual([...order].sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)))
          // Row by row, left to right: the name's row first, then the strip, each control right of the one before.
          for (let i = 1; i < header.length; i++) {
            const a = header[i - 1].hit, b = header[i].hit
            const sameRow = Math.abs(a.y - b.y) < 1
            expect(sameRow ? b.x >= a.x + a.width : b.y >= a.y + a.height, `${id} ${lane.id}: ${header[i - 1].id} then ${header[i].id}`).toBe(true)
          }
          for (const control of header) {
            expect(control.hit.width, control.id).toBeGreaterThanOrEqual(HEADER_TARGET)
            expect(control.hit.height, control.id).toBeGreaterThanOrEqual(HEADER_TARGET)
            expect(control.group, control.id).toBe(lane.label)
          }
          for (const a of header) for (const b of header) if (a !== b) expect(boxesOverlap(a.hit, b.hit), `${id}: ${a.id} on ${b.id}`).toBe(false)
        }
      }
    }
    expect(lanes).toBeGreaterThan(20)
  })

  it('every board of columns and every pipeline shows its header controls inside its column', () => {
    for (const { id, board } of boards()) {
      const family = ruleControlsFamily(board)
      if (family !== 'lanes' && family !== 'pipeline') continue
      const { layout } = drawn(board, false)
      for (const control of ruleControls(board, layout)) {
        if (control.anchor.kind !== 'lane' || control.look.shape === 'line') continue
        const place = layout.places!.find(item => item.laneId === control.anchor.id)!
        expect(control.hit.x >= place.x && control.hit.x + control.hit.width <= place.x + place.width + 0.5, id + ' ' + control.id).toBe(true)
      }
    }
  })

  it('maps and budgets show no controls: nothing to cover', () => {
    for (const id of ['decision-path', 'budget']) expect(ruleControls(preset(id), drawn(preset(id), false).layout)).toEqual([])
  })

  it('a passive rule badge stands where its control does, so the two are never drawn apart (one rule, one mark)', () => {
    const set = { by: 'Ada', at: '2026-11-23T09:00:00.000Z', via: 'chat' }
    const board = validateWorkshop({ version: 1, title: 'Team', lanes: [{ id: 'todo', label: 'To do' }, { id: 'done', label: 'Done' }], cards: [],
      behaviour: { version: 1, rev: 1, rules: [{ id: 'r1', on: true, severity: 'refuse', kind: 'bin', lane: 'done', set }, { id: 'r2', on: true, severity: 'refuse', kind: 'path', from: 'todo', to: ['done'], set }] } } as never)
    const layout = workshopLanePlaces(board)
    const controls = ruleControls(board, layout)
    const badges = boardBadgeShapes(board, { places: layout.places } as never)
    const centre = (role: string) => {
      const shape = badges.find(item => (item as { role?: string }).role === role) as { d: string }
      // A badge is a 22 round path that starts at the top of its circle.
      const [x, y] = shape.d.slice(1).split(/[ ,]/).map(Number)
      return { x, y: y + 11 }
    }
    const bin = controls.find(control => control.id === 'bin:done')!.hit
    const binBadge = centre('badge-done')
    expect(Math.abs(binBadge.x - (bin.x + bin.width / 2))).toBeLessThanOrEqual(1)
    const path = controls.find(control => control.id === 'path:todo>done')!.hit
    const seam = centre('seam-todo>done')
    expect(Math.abs(seam.x - (path.x + path.width / 2))).toBeLessThanOrEqual(1)
    expect(Math.abs(binBadge.y - (bin.y + bin.height / 2))).toBeLessThanOrEqual(1)
    expect(Math.abs(seam.y - (path.y + path.height / 2))).toBeLessThanOrEqual(1)
  })
})

describe('lane header: what a screen reader and a pointer hear', () => {
  const slateWith = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    return { canvas: { node: svg }, svg }
  }

  it('a lane’s controls are one group named for it, in the drawn order; only a toggle is pressed or not', () => {
    const board = preset('sales-pipeline')
    const { layout } = drawn(board, false)
    const controls = ruleControls(board, layout)
    const { canvas, svg } = slateWith()
    drawRuleControls({ canvas }, 'main', controls, {})
    const first = board.lanes[0]
    const group = svg.querySelector(`[data-rule-group="${first.label}"]`)!
    expect(group.getAttribute('role')).toBe('group')
    expect(group.getAttribute('aria-label')).toBe(first.label + ' controls')
    const ids = [...group.querySelectorAll('[data-rule-control]')].map(item => item.getAttribute('data-rule-control')!.split(':')[0])
    expect(ids).toEqual(['color', 'gate', 'capacity-plus'].filter(id => ids.includes(id)))
    expect(ids[0]).toBe('color')
    // The padlock is a toggle; the color button and the steps are not.
    expect(group.querySelector('[data-rule-control^="gate:"]')!.getAttribute('aria-pressed')).toBe('false')
    for (const id of ['color:', 'capacity-plus:', 'capacity-minus:']) for (const item of svg.querySelectorAll(`[data-rule-control^="${id}"]`)) expect(item.hasAttribute('aria-pressed'), id).toBe(false)
    svg.remove()
  })

  it('the color button names the lane’s color now and what a press makes; its hint is an action, shown under the header, after a rest', () => {
    vi.useFakeTimers()
    try {
      const board = preset('sales-pipeline')
      const { layout } = drawn(board, false)
      const controls = ruleControls(board, layout)
      const lost = board.lanes.find(lane => lane.role === 'lost')!
      const color = controls.find(control => control.id === 'color:' + lost.id)!
      expect(color.label).toBe(lost.label + ' color: own. Press for red.')
      const { canvas, svg } = slateWith()
      drawRuleControls({ canvas }, 'main', controls, {})
      const item = svg.querySelector(`[data-rule-control="color:${lost.id}"]`)!
      const hint = item.querySelector('[data-rule-hint]')!
      expect(hint.textContent).toBe('Change color (now: own)')
      // Under the strip: below every word of the header.
      const plus = controls.find(control => control.id === 'capacity-plus:' + lost.id)!
      expect(Number(hint.getAttribute('y'))).toBeGreaterThan(plus.hit.y + plus.hit.height)
      item.dispatchEvent(new Event('pointerenter'))
      expect(hint.getAttribute('opacity')).toBe('0')
      vi.advanceTimersByTime(HINT_DELAY)
      expect(hint.getAttribute('opacity')).toBe('1')
      item.dispatchEvent(new Event('pointerleave'))
      expect(hint.getAttribute('opacity')).toBe('0')
      // A pointer that passes over without resting says nothing.
      item.dispatchEvent(new Event('pointerenter'))
      vi.advanceTimersByTime(HINT_DELAY / 2)
      item.dispatchEvent(new Event('pointerleave'))
      vi.advanceTimersByTime(HINT_DELAY)
      expect(hint.getAttribute('opacity')).toBe('0')
      svg.remove()
    } finally { vi.useRealTimers() }
  })

  it('an off toggle is a solid outlined button, never a dashed placeholder circle', () => {
    const board = preset('sales-pipeline')
    const { canvas, svg } = slateWith()
    drawRuleControls({ canvas }, 'main', ruleControls(board, drawn(board, false).layout), {})
    for (const circle of svg.querySelectorAll('[data-rule-control] circle')) expect(circle.hasAttribute('stroke-dasharray')).toBe(false)
    svg.remove()
  })
})
