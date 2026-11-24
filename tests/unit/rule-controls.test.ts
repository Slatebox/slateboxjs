import { describe, expect, it, vi } from 'vitest'
import { applyWorkshopEdits, attachWorkshop, validateWorkshop, workshopCandidate, workshopLanePlaces, type Workshop, type WorkshopEdit, type WorkshopEditResult } from '../../src/workshops/model'
import { catalog, catalogPreset } from '../../src/workshops/catalog'
import { catalogSamples } from '../../src/workshops/samples'
import '../../src/workshops/rules'
import { behaviourOf, validateBehaviour } from '../../src/workshops/behaviour'
import { kitFor } from '../../src/boards'
import '../../src/boards/nest'
import { ruleControls, RULE_CONTROL_EDITS, type RuleControl } from '../../src/workshops/controls'
import { drawRuleControls } from '../../src/boards/ruleControlsLayer'

// The rule controls (library spec §4.3, §4.4): the drag primitives of a board's rulebook drawn on the
// board. Each gesture is an edit the reducer takes (the same add_rule, set_rule and remove_rule chat and
// exec make), audited as set on the canvas; a drag clamps to what a rule may say; a board that takes no
// rules shows none; every control is a finger's size; and the drawing is native shapes on the canvas.

const audit = { actor: { by: 'Ada', via: 'canvas' as const }, now: '2026-11-23T10:00:00.000Z' }
const apply = (board: Workshop, edits: WorkshopEdit[]): WorkshopEditResult => applyWorkshopEdits(board, edits, audit)
const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const preset = (id: string) => validateWorkshop(catalogPreset(id, undefined, catalogSamples))
const team = validateWorkshop({ version: 1, title: 'Team', lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'done', label: 'Done' }],
  cards: [{ id: 'a', label: 'Billing', laneId: 'todo' }, { id: 'b', label: 'Search', laneId: 'todo' }, { id: 'c', label: 'Export', laneId: 'todo' }, { id: 'd', label: 'Auth', laneId: 'doing' }] })
/** Where a board is drawn: its columns (a board of columns) or its kit's column parts, and its size. */
function layoutOf(board: Workshop) {
  if (board.kind && kitFor(board.kind as never)) {
    const kit = kitFor(board.kind as never)!
    const drawn = kit.places(board, { lanesPerRow: 5 } as never)
    return { places: drawn.parts.filter(part => part.name.startsWith('column-')).map(part => ({ laneId: part.name.slice(7), x: part.x, y: part.y, width: part.width, height: part.height, row: 0 })), width: drawn.width, height: drawn.height }
  }
  return workshopLanePlaces(board)
}
const controlsOf = (board: Workshop, scale = 1) => ruleControls(board, layoutOf(board), { scale })
const find = (controls: RuleControl[], id: string) => {
  const control = controls.find(item => item.id === id)
  if (!control) throw new Error('no control ' + id + ' in ' + controls.map(item => item.id).join(', '))
  return control
}
/** Every edit a control's gestures make: its tap, hold and remove, and a drag a step each way. */
const gesturesOf = (control: RuleControl) => {
  const { tap, hold, remove, drag, step = 30, axis } = control.gestures
  const steps = drag ? [-1, 1, -3].map(n => drag(axis === 'x' ? { dx: n * step, dy: 0 } : { dx: 0, dy: n * step })) : []
  return [tap, hold, remove, ...steps].filter((edits): edits is WorkshopEdit[] => Boolean(edits?.length))
}

describe('rule controls: what each board shows', () => {
  it('a board of columns: a limit line, − and +, a bin per column, a chevron per seam, a ghost column and “One column at a time”', () => {
    const ids = controlsOf(team).map(control => control.id)
    expect(ids).toEqual(expect.arrayContaining(['capacity:todo', 'capacity-plus:todo', 'bin:todo', 'path:todo>doing', 'path:doing>done', 'add-lane', 'path:any']))
    // No − on a column without a limit (it would do nothing), and every control does something.
    expect(ids).not.toContain('capacity-minus:todo')
    for (const control of controlsOf(team)) expect(control.gestures.tap?.length || control.gestures.drag, control.id).toBeTruthy()
  })

  it('a board that takes no rules shows none: a map, a budget', () => {
    expect(controlsOf(preset('decision-path'))).toEqual([])
    expect(controlsOf(preset('budget'))).toEqual([])
  })

  it('every control is at least a finger’s size (44 by 44), and grows with the chrome’s scale', () => {
    for (const entry of catalog) {
      for (const control of controlsOf(preset(entry.id))) {
        expect(control.hit.width, entry.id + ' ' + control.id).toBeGreaterThanOrEqual(44)
        expect(control.hit.height, entry.id + ' ' + control.id).toBeGreaterThanOrEqual(44)
      }
      for (const control of controlsOf(preset(entry.id), 2)) expect(control.hit.height).toBeGreaterThanOrEqual(88)
    }
  })

  it('a control makes only the edits a canvas change of rules may hold', () => {
    for (const entry of catalog) {
      for (const control of controlsOf(preset(entry.id))) {
        for (const edits of gesturesOf(control)) for (const edit of edits) expect(RULE_CONTROL_EDITS, entry.id + ' ' + control.id).toContain(edit.kind)
      }
    }
  })
})

describe('rule controls: each gesture is an edit the reducer takes', () => {
  it('on every catalogue board, every tap, hold, remove and drag step is taken by the reducer, or refused with a sentence', () => {
    for (const entry of catalog) {
      const board = preset(entry.id)
      for (const control of controlsOf(board)) {
        for (const edits of gesturesOf(control)) {
          const result = apply(board, edits)
          if ('refused' in result) { expect(result.refused.reason.length, entry.id + ' ' + control.id).toBeGreaterThan(8); continue }
          // The one gate keeps what the control made, audited as set on the canvas.
          const kept = validateWorkshop(result.workshop)
          if (kept.behaviour) expect(validateBehaviour(kept.behaviour, kept).rules.length).toBe(kept.behaviour.rules.length)
          const changed = behaviourOf(kept).rules.filter(rule => !behaviourOf(board).rules.some(old => JSON.stringify(old) === JSON.stringify(rule)))
          for (const rule of changed) expect(rule.set.via, entry.id + ' ' + control.id).toBe('canvas')
        }
      }
    }
  })

  it('every tap on a fresh board of columns, pipeline, plan and nested board is taken (no control refuses itself)', () => {
    for (const id of ['team-board', 'retro', 'sales-pipeline', 'launch-plan', 'hiring-plan', 'sort-evidence', 'break-down-problem', 'discovery-tree']) {
      const board = preset(id)
      for (const control of controlsOf(board)) {
        if (!control.gestures.tap?.length) continue
        const result = apply(board, control.gestures.tap)
        expect('refused' in result ? result.refused.reason : 'taken', id + ' ' + control.id).toBe('taken')
      }
    }
  })
})

describe('rule controls: a drag changes the next drag', () => {
  it('dragging Doing’s limit line to 1 refuses the next card into Doing; dragging it past the foot removes the limit', () => {
    // A board with a rulebook: a limit is a rule (as chat makes it there).
    const ruled = validateWorkshop({ ...team, behaviour: { version: 1, rev: 0, rules: [] } })
    const plus = find(controlsOf(ruled), 'capacity-plus:doing')
    // From no limit, + gives the column a limit of what it holds.
    const limited = ok(apply(ruled, plus.gestures.tap!))
    expect(behaviourOf(limited).rules[0]).toMatchObject({ kind: 'capacity', where: 'doing', max: 1, set: { by: 'Ada', via: 'canvas' } })
    expect(workshopCandidate(limited, 'a', 'doing')).toBeNull()
    // Drag the line down a slot: Doing holds 2, and the next card goes in.
    const line = find(controlsOf(limited), 'capacity:doing')
    expect(line.gestures.preview!({ dx: 0, dy: 88 })).toBe('holds 2')
    const two = ok(apply(limited, line.gestures.drag!({ dx: 0, dy: 88 })))
    expect(behaviourOf(two).rules[0]).toMatchObject({ kind: 'capacity', max: 2 })
    expect(workshopCandidate(two, 'a', 'doing')).not.toBeNull()
    // Far past the column's foot, the limit goes; far above its first slot it stays at 1.
    const down = find(controlsOf(two), 'capacity:doing')
    expect(down.gestures.drag!({ dx: 0, dy: 2000 })).toEqual([{ kind: 'remove_rule', rule: behaviourOf(two).rules[0].id }])
    expect(down.gestures.drag!({ dx: 0, dy: -2000 })).toEqual([{ kind: 'set_rule', rule: behaviourOf(two).rules[0].id, max: 1 }])
    expect(down.gestures.preview!({ dx: 0, dy: 2000 })).toBe('No limit')
  })

  it('a limit past an empty column’s foot is drawn on the board, and a drag up from it lowers the limit (never removes it)', () => {
    const empty = { ...team, cards: [] }
    const ruled = applyWorkshopEdits(empty, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'done', max: 6 } }]) as any
    const board = ruled.workshop
    const layout = layoutOf(board)
    const line = ruleControls(board, layout).find(control => control.id === 'capacity:done')!
    const foot = layout.places!.find(place => place.laneId === 'done')!
    expect(line.look.y!).toBeLessThanOrEqual(foot.y + foot.height)
    const up = line.gestures.drag!({ dx: 0, dy: -88 })
    expect(up).not.toEqual([])
    const after = applyWorkshopEdits(board, up) as any
    expect(after.workshop.behaviour.rules.find((rule: any) => rule.where === 'done').max).toBe(5)
    expect(line.gestures.preview!({ dx: 0, dy: 200 })).toBe('No limit')
    // One step down (an arrow key) from a line at the foot lets the column hold one more; it never takes the limit away.
    const one = applyWorkshopEdits(empty, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'done', max: 1 } }]) as any
    const low = ruleControls(one.workshop, layoutOf(one.workshop)).find(control => control.id === 'capacity:done')!
    expect(low.gestures.preview!({ dx: 0, dy: low.gestures.step! })).toBe('holds 2')
  })

  it('a one-way chevron stops a card going back; tapped again, it goes both ways', () => {
    const chevron = find(controlsOf(team), 'path:todo>doing')
    const oneWay = ok(apply(team, chevron.gestures.tap!))
    const moved = workshopCandidate(oneWay, 'a', 'doing')!
    expect(moved).not.toBeNull()
    expect(workshopCandidate(oneWay, 'a', 'done')).toBeNull()
    const back = ok(apply(oneWay, find(controlsOf(oneWay), 'path:todo>doing').gestures.tap!))
    expect(behaviourOf(back).rules).toEqual([])
  })

  it('on a board without a rulebook a limit is the column’s own, as chat sets it (never under what the column holds)', () => {
    const own = ok(apply(team, find(controlsOf(team), 'capacity-plus:todo').gestures.tap!))
    expect(own.lanes[0].capacity).toBe(3)
    expect(own.behaviour).toBeUndefined()
    const line = find(controlsOf(own), 'capacity:todo')
    expect(line.gestures.drag!({ dx: 0, dy: -1000 })).toEqual([])
    expect(line.gestures.drag!({ dx: 0, dy: 88 })).toEqual([{ kind: 'set_lane_capacity', lane: { id: 'todo' }, capacity: 4 }])
  })

  it('hold turns a limit into a warning and back; − at 1 removes it; the ghost column adds a column', () => {
    const limited = ok(apply(team, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'doing', max: 1 } }]))
    const warned = ok(apply(limited, find(controlsOf(limited), 'capacity:doing').gestures.hold!))
    expect(behaviourOf(warned).rules[0].severity).toBe('warn')
    expect(workshopCandidate(warned, 'a', 'doing')).not.toBeNull()
    expect(behaviourOf(ok(apply(limited, find(controlsOf(limited), 'capacity-minus:doing').gestures.tap!))).rules).toEqual([])
    expect(ok(apply(team, find(controlsOf(team), 'add-lane').gestures.tap!)).lanes).toHaveLength(4)
  })

  it('a nested board’s ladder sets how deep cards nest, clamped to its six levels', () => {
    const board = preset('break-down-problem')
    const ladder = find(controlsOf(board), 'depth')
    const edits = ladder.gestures.drag!({ dx: 0, dy: -ladder.gestures.step! * 3 })
    const made = ok(apply(board, edits))
    const rule = behaviourOf(made).rules.find(item => item.kind === 'depth') as { max: number } | undefined
    expect(rule?.max).toBeGreaterThanOrEqual(1)
    expect(rule?.max).toBeLessThanOrEqual(6)
    expect(ladder.gestures.preview!({ dx: 0, dy: -10000 })).toBe('Cards nest one level deep')
  })

  it('a chat sentence and the control make the same rule (the control is the picture of the rule)', () => {
    const fromControl = ok(apply(team, find(controlsOf(team), 'bin:done').gestures.tap!))
    const fromChat = ok(apply(team, [{ kind: 'add_rule', rule: { kind: 'bin', lane: 'Done' } }]))
    expect(JSON.stringify(behaviourOf(fromControl).rules.map(({ set: _set, ...rule }) => rule))).toBe(JSON.stringify(behaviourOf(fromChat).rules.map(({ set: _set, ...rule }) => rule)))
  })
})

describe('rule controls: the layer', () => {
  const slateWith = () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    return { canvas: { node: svg }, svg }
  }

  it('draws native SVG shapes in the canvas (never an HTML overlay), one button a control, each labelled', () => {
    // The SVG.js engine's slate and the legacy engine's both expose the canvas's SVG node.
    for (const make of [() => slateWith(), () => { const s = slateWith(); return { canvas: { node: s.svg, raphael: true }, svg: s.svg } }]) {
      const { canvas, svg } = make()
      const controls = controlsOf(team)
      drawRuleControls({ canvas }, 'main', controls, { origin: { x: 100, y: 50 } })
      const group = svg.querySelector('g[data-rule-controls]')!
      expect(group.getAttribute('transform')).toBe('translate(100 50)')
      expect(group.querySelectorAll('[data-rule-control]')).toHaveLength(controls.length)
      expect(group.querySelector('foreignObject, div, button')).toBeNull()
      for (const item of group.querySelectorAll('[data-rule-control]')) {
        expect(item.getAttribute('aria-label')!.length).toBeGreaterThan(5)
        expect(item.getAttribute('tabindex')).toBe('0')
      }
      svg.remove()
    }
  })

  it('a ghost column as tall as its neighbours keeps its words and + at a finger’s size, not its height’s', () => {
    const { canvas, svg } = slateWith()
    const ghost = controlsOf(team).find(control => control.look.shape === 'ghost')!
    const tall = { ...ghost, hit: { ...ghost.hit, height: 400 } }
    drawRuleControls({ canvas }, 'main', [tall], {})
    const words = [...svg.querySelectorAll('[data-rule-control] text')].find(node => node.textContent === 'Column')!
    expect(Number(words.getAttribute('font-size'))).toBeLessThanOrEqual(13 * (ghost.hit.width / 64) + 0.01)
    svg.remove()
  })

  it('Enter taps, the arrows drag a step, Shift+Enter holds, Delete removes; the host hears the edits', async () => {
    const limited = ok(apply(team, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'doing', max: 2 } }]))
    const { canvas, svg } = slateWith()
    const heard: WorkshopEdit[][] = []
    const onRuleEdit = vi.fn(async (edits: WorkshopEdit[]) => { heard.push(edits); return true })
    const layer = drawRuleControls({ canvas }, 'main', controlsOf(limited), { onRuleEdit })
    const press = async (id: string, key: string, shiftKey = false) => {
      const item = svg.querySelector(`[data-rule-control="${id}"]`)!
      item.dispatchEvent(new KeyboardEvent('keydown', { key, shiftKey, bubbles: true }))
      await new Promise(resolve => setTimeout(resolve, 0))
    }
    const id = behaviourOf(limited).rules[0].id
    await press('capacity:doing', 'ArrowUp')
    await press('capacity:doing', 'ArrowDown')
    await press('capacity:doing', 'Enter', true)
    await press('capacity:doing', 'Delete')
    await press('bin:done', 'Enter')
    expect(heard).toEqual([
      [{ kind: 'set_rule', rule: id, max: 1 }], [{ kind: 'set_rule', rule: id, max: 3 }], [{ kind: 'set_rule', rule: id, severity: 'warn' }],
      [{ kind: 'remove_rule', rule: id }], [{ kind: 'add_rule', rule: { kind: 'bin', lane: 'done' } }],
    ])
    // Saved: the control flashes its sentence beside itself.
    layer.update(controlsOf(ok(apply(limited, [{ kind: 'add_rule', rule: { kind: 'bin', lane: 'done' } }]))))
    expect(svg.querySelector('[data-rule-control="bin:done"]')!.getAttribute('data-rule-flash')).toMatch(/Done is a bin/)
    layer.remove()
    expect(svg.querySelector('g[data-rule-controls]')).toBeNull()
    svg.remove()
  })

  it('a pointer drag on the limit line hands the host the drag’s edits once, on release', async () => {
    const limited = ok(apply(team, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'doing', max: 1 } }]))
    const { canvas, svg } = slateWith()
    const onRuleEdit = vi.fn(async () => true)
    drawRuleControls({ canvas }, 'main', controlsOf(limited), { onRuleEdit })
    const hit = svg.querySelector('[data-rule-control="capacity:doing"]')!
    const at = (type: string, y: number) => new (window.PointerEvent ?? MouseEvent)(type, { clientX: 10, clientY: y, bubbles: true, pointerId: 1 } as PointerEventInit)
    hit.dispatchEvent(at('pointerdown', 100))
    window.dispatchEvent(at('pointermove', 140))
    window.dispatchEvent(at('pointermove', 188))
    window.dispatchEvent(at('pointerup', 188))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(onRuleEdit).toHaveBeenCalledTimes(1)
    expect((onRuleEdit.mock.calls[0] as unknown[])[0]).toEqual([{ kind: 'set_rule', rule: behaviourOf(limited).rules[0].id, max: 2 }])
    svg.remove()
  })
})

/** A slate with what attachWorkshop asks of it and a real svg canvas (as tests/unit/board-chrome.test.ts). */
function slateWithCanvas() {
  const notes = new Map<string, any>()
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  document.body.appendChild(svg)
  let selected: any[] = []
  const watchers = new Set<() => void>()
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
    getSelectedNodes: () => selected, onSelectionChange: (fn: () => void) => { watchers.add(fn); return () => watchers.delete(fn) },
  }
  const select = (ids: string[]) => { selected = ids.map(id => notes.get(id)); for (const fn of watchers) fn() }
  return { slate, svg, select }
}

describe('rule controls on an attached board', () => {
  it('drawn always, only while the board is selected or in focus, or never; never on a view-only board or a preview', async () => {
    const { slate, svg, select } = slateWithCanvas()
    const edits: WorkshopEdit[][] = []
    const board = attachWorkshop(slate, team, { origin: { x: 0, y: 0 }, controls: 'always', onRuleEdit: async next => { edits.push(next); return true } })
    await board.whenDrawn()
    const shown = () => svg.querySelectorAll('g[data-rule-controls] [data-rule-control]').length
    expect(shown()).toBeGreaterThan(5)
    board.preview({ ...team, title: 'Team, renamed' })
    expect(shown()).toBe(0)
    board.preview(null)
    expect(shown()).toBeGreaterThan(5)
    board.setControls('selected')
    expect(shown()).toBe(0)
    board.setFocused(true)
    expect(shown()).toBeGreaterThan(5)
    board.setFocused(false)
    select(['lane-doing'])
    expect(shown()).toBeGreaterThan(5)
    select([])
    expect(shown()).toBe(0)
    board.setControls('always')
    board.setReadOnly(true)
    expect(shown()).toBe(0)
    board.setReadOnly(false)
    // A tap on the board's control reaches the host's onRuleEdit; the board, updated, draws the control anew.
    svg.querySelector('[data-rule-control="bin:done"]')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    await new Promise(resolve => setTimeout(resolve, 0))
    expect(edits).toEqual([[{ kind: 'add_rule', rule: { kind: 'bin', lane: 'done' } }]])
    board.update(ok(apply(team, edits[0])))
    await board.whenDrawn()
    expect(svg.querySelector('[data-rule-control="bin:done"]')!.getAttribute('aria-pressed')).toBe('true')
    board.destroy()
    expect(svg.querySelector('g[data-rule-controls]')).toBeNull()
    svg.remove()
  })
})
