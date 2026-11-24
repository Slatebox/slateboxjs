import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, attachWorkshop, describeWorkshopEdits, validateWorkshop, workshopLanePlaces, workshopToSlate, nightTransfer, type Workshop, type WorkshopEdit,
} from '../../src/workshops/model'
import { appearanceLook, appearancePalette, appearanceQuadrants, readAppearance } from '../../src/workshops/appearance'
import { catalogSamples, impactEffortSample } from '../../src/workshops/samples'
import '../../src/workshops/rules'
import '../../src/workshops/behaviour'
import { kitFor, partNotes } from '../../src/boards'
import '../../src/boards/nest'
import { nestLayout } from '../../src/boards/nest'
import { ruleControls, RULE_CONTROL_EDITS } from '../../src/workshops/controls'

// A board's appearance as data (appearance.ts): one set_appearance edit for chat, exec, the AI turn and the board's chips,
// kept on the board model, and drawn by the one drawing every surface uses, for every kind of board.

const team = validateWorkshop({ version: 1, title: 'Team', lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'done', label: 'Done' }],
  cards: [{ id: 'a', label: 'Billing', laneId: 'todo' }, { id: 'b', label: 'Auth', laneId: 'doing' }] })
const matrix = () => validateWorkshop(impactEffortSample())
const audit = { actor: { by: 'Ada', via: 'chat' as const }, now: '2026-11-24T10:00:00.000Z' }
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, audit)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result
}
const nodeOf = (board: Workshop, id: string) => workshopToSlate(board, { native: true }).nodes.find(node => node.options.id === id)!.options

describe('board appearance: the model', () => {
  it('is kept by validation, a color for a column that is gone is dropped, a bad value is refused', () => {
    const board = validateWorkshop({ ...team, appearance: { borders: 'strong', lines: true, colors: { todo: 'green', gone: 'red' }, extra: 1 } })
    expect(board.appearance).toEqual({ borders: 'strong', lines: true, colors: { todo: 'green' } })
    expect(() => validateWorkshop({ ...team, appearance: { borders: 'loud' } })).toThrow(/borders/)
    expect(() => validateWorkshop({ ...team, appearance: { colors: { todo: '#123456' } } })).toThrow(/color/)
    expect(validateWorkshop({ ...team, appearance: { lines: false } }).appearance).toBeUndefined()
    // A 2 by 2 colors its quadrants too.
    expect(readAppearance({ colors: { 'q-do-now': 'green' } }, ['matrix', 'unscored', 'q-do-now'])).toEqual({ colors: { 'q-do-now': 'green' } })
  })

  it('set_appearance: emphasis sets borders, headers and fills; normal takes a look away; one edit is one change', () => {
    const strong = ok(team, [{ kind: 'set_appearance', emphasis: 'strong' }])
    expect(strong.workshop.appearance).toEqual({ borders: 'strong', headers: 'strong', fill: 'strong' })
    expect(strong.report.edits[0].said).toBe('The board now has stronger column borders, bolder headers and deeper column colors.')
    const back = ok(strong.workshop, [{ kind: 'set_appearance', emphasis: 'normal' }])
    expect(back.workshop.appearance).toBeUndefined()
    expect(ok(team, [{ kind: 'set_appearance', borders: 'normal' }]).report.edits[0].changed).toBe(false)
    // Nothing else on the board changes.
    expect({ ...strong.workshop, appearance: undefined }).toEqual({ ...team, appearance: undefined })
  })

  it('a column color by name, and on a 2 by 2 a quadrant by its name; color needs a lane and a lane a color', () => {
    const green = ok(team, [{ kind: 'set_appearance', lane: 'Doing', color: 'green' }])
    expect(green.workshop.appearance).toEqual({ colors: { doing: 'green' } })
    expect(green.report.edits[0].said).toBe('The board now has Doing in green.')
    expect(ok(green.workshop, [{ kind: 'set_appearance', lane: 'doing', color: 'none' }]).workshop.appearance).toBeUndefined()
    const square = ok(matrix(), [{ kind: 'set_appearance', lane: 'Do now', color: 'green' }, { kind: 'set_appearance', lines: true }])
    expect(square.workshop.appearance).toEqual({ colors: { 'q-do-now': 'green' }, lines: true })
    const refusal = applyWorkshopEdits(team, [{ kind: 'set_appearance', color: 'green' } as WorkshopEdit])
    expect('refused' in refusal && refusal.refused.code).toBe('invalid_edit')
    const nothing = applyWorkshopEdits(team, [{ kind: 'set_appearance' } as WorkshopEdit])
    expect('refused' in nothing && nothing.refused.reason).toMatch(/Say how the board should look/)
  })

  it('every kind of board takes it, a map and a launch plan too, and the table publishes it', () => {
    for (const board of [team, matrix(), validateWorkshop(nightTransfer), validateWorkshop(catalogSamples['launch-plan']())]) {
      expect(ok(board, [{ kind: 'set_appearance', borders: 'strong' }]).workshop.appearance).toEqual({ borders: 'strong' })
    }
    const entry = describeWorkshopEdits(team).find(edit => edit.kind === 'set_appearance')!
    expect(entry.accepted).toBe(true)
    expect(Object.keys((entry.schema as { properties: object }).properties)).toEqual(['kind', 'emphasis', 'borders', 'headers', 'headerSize', 'fill', 'lines', 'density', 'lane', 'color'])
  })
})

describe('board appearance: the drawing', () => {
  it('a board of columns: stronger borders, bolder and bigger headers, a column color, compact cards', () => {
    const plain = nodeOf(team, 'column-todo')
    const board = ok(team, [{ kind: 'set_appearance', borders: 'strong', headers: 'strong', headerSize: 'large', density: 'compact' }, { kind: 'set_appearance', lane: 'Doing', color: 'green' }]).workshop
    expect(plain.borderWidth).toBe(1)
    expect(nodeOf(board, 'column-todo').borderWidth).toBe(3)
    expect(nodeOf(board, 'lane-todo').fontWeight).toBe('bold')
    expect(nodeOf(board, 'lane-todo').fontSize as number).toBeGreaterThan(nodeOf(team, 'lane-todo').fontSize as number)
    expect(nodeOf(board, 'lane-doing').backgroundColor).not.toBe(nodeOf(team, 'lane-doing').backgroundColor)
    expect(nodeOf(board, 'card-a').height as number).toBeLessThan(nodeOf(team, 'card-a').height as number)
    // The columns stay where they were: the board's geometry (its drop zones) does not change.
    expect(workshopLanePlaces(board)).toEqual(workshopLanePlaces(team))
  })

  it('a 2 by 2: the quadrants take the borders, the grid lines and a color, as parts drawn as notes', () => {
    const board = ok(matrix(), [{ kind: 'set_appearance', emphasis: 'strong' }, { kind: 'set_appearance', lane: 'Do now', color: 'green' }]).workshop
    const notes = partNotes(nestLayout(board).parts, board, { x: 0, y: 0 }, {})
    const before = partNotes(nestLayout(matrix()).parts, matrix(), { x: 0, y: 0 }, {})
    const get = (list: typeof notes, id: string) => list.find(note => note.options.id === id)!.options
    expect(get(notes, 'column-q-plan').borderWidth).toBe(3)
    expect(get(before, 'column-q-plan').borderWidth).toBe(1)
    expect(get(notes, 'column-q-do-now').backgroundColor).not.toBe(get(before, 'column-q-do-now').backgroundColor)
    expect(get(notes, 'caption-q-do-now').fontWeight).toBe('bold')
    // The kit draws it the same way on a live slate: kit.notes goes through partNotes.
    expect(kitFor('nest').notes(board, {}, { x: 0, y: 0 }, {}).find(note => note.options.id === 'column-q-plan')!.options.borderWidth).toBe(3)
  })

  it('appearanceLook leaves a part it does not know, and a board without an appearance, as they were', () => {
    const look = { fill: '#d5e9e3', line: '#aaaaaa', lineWidth: 1, fontSize: 14 }
    expect(appearanceLook(undefined, 'column-a', look)).toBe(look)
    expect(appearanceLook({ borders: 'strong' }, 'handle-a', look)).toBe(look)
  })
})

describe('board appearance: the chips on the board', () => {
  const layoutOf = (board: Workshop) => {
    if (board.kind) {
      const drawn = kitFor(board.kind as never).places(board, {} as never)
      return { places: drawn.parts.filter(part => part.name.startsWith('column-')).map(part => ({ laneId: part.name.slice(7), x: part.x, y: part.y, width: part.width, height: part.height })), width: drawn.width, height: drawn.height }
    }
    return workshopLanePlaces(board)
  }
  it('Look, Cards and Lines on the rail and a swatch per column: each a set_appearance edit a canvas change may carry', () => {
    expect(RULE_CONTROL_EDITS).toContain('set_appearance')
    const controls = ruleControls(team, layoutOf(team))
    const look = controls.find(control => control.id === 'look:emphasis')!
    expect(look.look.label).toBe('Look: standard')
    const strong = ok(team, look.gestures.tap!).workshop
    expect(strong.appearance).toMatchObject({ borders: 'strong', headers: 'strong' })
    expect(ruleControls(strong, layoutOf(strong)).find(control => control.id === 'look:emphasis')!.look.label).toBe('Look: strong')
    const swatch = controls.find(control => control.id === 'color:doing')!
    expect(swatch.look.swatch).toBe('#ffffff')
    expect(ok(team, swatch.gestures.tap!).workshop.appearance).toEqual({ colors: { doing: 'red' } })
    expect(controls.find(control => control.id === 'look:density')!.gestures.tap).toEqual([{ kind: 'set_appearance', density: 'compact' }])
    expect(controls.find(control => control.id === 'look:lines')!.gestures.tap).toEqual([{ kind: 'set_appearance', lines: true }])
  })

  it('a 2 by 2: its chips sit beside “Holds: any”, and its quadrants take the swatches', () => {
    const board = matrix()
    const controls = ruleControls(board, layoutOf(board))
    const rail = controls.filter(control => control.anchor.kind === 'board').map(control => control.id)
    expect(rail.slice(rail.indexOf('children'))).toEqual(['children', 'look:emphasis', 'look:density', 'look:lines'])
    const swatches = controls.filter(control => control.id.startsWith('color:')).map(control => control.id)
    expect(swatches.sort()).toEqual(['color:q-do-now', 'color:q-later', 'color:q-plan', 'color:q-skip'])
    expect(ok(board, controls.find(control => control.id === 'color:q-do-now')!.gestures.tap!).workshop.appearance).toEqual({ colors: { 'q-do-now': 'red' } })
  })
})

describe('board appearance: a whole save said as its edits', () => {
  it('a business board’s kit says a changed look as set_appearance, so a kept look on Impact × effort or a launch plan saves', async () => {
    const { nestEditsBetween } = await import('../../src/boards/nest')
    const { workshopEditsBetween } = await import('../../src/boards')
    for (const [board, between] of [[matrix(), nestEditsBetween], [validateWorkshop(catalogSamples['launch-plan']()), workshopEditsBetween]] as const) {
      const lane = board.kind === 'nest' ? 'Do now' : board.lanes[0].label
      const after = ok(board, [{ kind: 'set_appearance', emphasis: 'strong', lines: true }, { kind: 'set_appearance', lane, color: 'teal' }]).workshop
      const edits = between(board, after)
      expect(edits.every(edit => edit.kind === 'set_appearance')).toBe(true)
      expect(ok(board, edits).workshop).toEqual(after)
      // And back: the look taken away is said too.
      expect(ok(after, between(after, board)).workshop.appearance).toBeUndefined()
    }
  })
})

describe('board appearance: review fixes', () => {
  function liveSlate() {
    const notes = new Map<string, any>()
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const make = (options: any) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g')
      svg.appendChild(group)
      const node: any = { id: options.id, options: { ...options, fontColor: options.foregroundColor }, styled: [] as (string | undefined)[],
        relationships: { associations: [], addAssociation() {}, removeAssociation() {}, getAssociations: () => [] },
        position(x: number, y: number) { node.options.x = x; node.options.y = y }, setText(text: string) { node.options.text = text }, setShape() {},
        applyTextStyle() { node.styled.push(node.options.fontWeight) }, svgGroup: { node: group, front() {} } }
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

  it('on a live board, bold headers switch on and off with the look (and its undo), not only when a note is made', async () => {
    const { slate, svg, notes } = liveSlate()
    const attached = attachWorkshop(slate, team, { origin: { x: 0, y: 0 } })
    await attached.whenDrawn()
    const header = [...notes.values()].find(node => /lane-todo$/.test(node.id))!
    expect(header.options.fontWeight).toBeUndefined()
    const bold = ok(team, [{ kind: 'set_appearance', headers: 'strong' }]).workshop
    attached.update(bold)
    await attached.whenDrawn()
    expect(header.options.fontWeight).toBe('bold')
    expect(header.styled.at(-1)).toBe('bold')
    attached.update(team)
    await attached.whenDrawn()
    expect(header.options.fontWeight).toBeUndefined()
    expect(header.styled.at(-1)).toBeUndefined()
    attached.destroy(); svg.remove()
  })

  it('a compact card is fitted again at its new height, so a long label stays inside it', () => {
    const long = validateWorkshop({ ...team, cards: [{ id: 'a', label: 'Reconcile the quarterly billing exports with the ledger and the refunds', laneId: 'todo' }] })
    const compact = ok(long, [{ kind: 'set_appearance', density: 'compact' }]).workshop
    const card = nodeOf(compact, 'card-a'), roomy = nodeOf(long, 'card-a')
    expect(card.height as number).toBeLessThan(roomy.height as number)
    // The same estimate the drawing fits by: lines times the font's line height fit inside the card.
    const size = card.fontSize as number, perLine = Math.max(1, Math.floor(((card.width as number) - 16) / (size * 0.55)))
    const lines = Math.ceil(String(card.text).length / perLine)
    expect(size === 11 || lines * size * 1.3 <= (card.height as number) - 8).toBe(true)
    expect(size).toBeLessThan(roomy.fontSize as number)
  })

  it('an appearance of null is no look, not a refused board', () => {
    expect(readAppearance(null, ['todo'])).toBeUndefined()
    expect(validateWorkshop({ ...team, appearance: null }).appearance).toBeUndefined()
  })

  it('an over-limit quadrant caption keeps AA contrast over every quadrant color and fill', () => {
    const lum = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(s => s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4)
      .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0)
    const ratio = (a: string, b: string) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05) }
    const base = matrix()
    // Plan it holds two cards in the sample; a limit of one puts its caption over.
    const most = ['plan'] as const
    const full = ok(base, [{ kind: 'add_rule', rule: { kind: 'quadrant', quadrant: most[0], max: 1 } as never }]).workshop
    const caption = nestLayout(full).parts.find(part => part.name === 'caption-q-' + most[0]) as any
    expect(caption.ink).toBeDefined()
    const label = appearanceQuadrants['q-' + most[0]]
    for (const color of Object.keys(appearancePalette)) for (const fill of [undefined, 'soft', 'strong'] as const) {
      const board = ok(full, [{ kind: 'set_appearance', lane: label, color }, ...(fill ? [{ kind: 'set_appearance' as const, fill }] : [])]).workshop
      const quadrant = partNotes(nestLayout(board).parts, board, { x: 0, y: 0 }, {}).find(note => note.options.id === 'column-q-' + most[0])!.options
      expect(ratio(caption.ink, quadrant.backgroundColor as string)).toBeGreaterThanOrEqual(4.5)
    }
  })
})
