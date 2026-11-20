import { describe, expect, it } from 'vitest'
import { getElementPositionCheap, Vec2, type Draggable } from 'dragology'
import { budgetKit, budgetLayout, kitFor, launchLayout, launchLinkTargets, launchPlanKit, pipelineKit, pipelineLayout } from '../../src/boards'
import { partsGeometry } from '../../src/workshops/boardSpecs'
import {
  applyWorkshopEdits, attachWorkshop, sampleBudget, sampleLaunchPlan, samplePipeline, validateWorkshop, type WorkshopChangeEvent, launchPlanLimits, withLink, withTaskValue, workshopCandidate, workshopDestinations,
  type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout,
} from '../../src/workshops/model'
import { randomBusinessBoards } from './helpers/randomWorkshops'

/**
 * The three business boards on 200 random boards each: where attachWorkshop puts every note,
 * where Dragology measures it, and what the chooser picks, against the rules.
 */

const layouts: WorkshopBoardLayout[] = [{}, { narrow: true, width: 358 }]
const boards = {
  'launch-plan': randomBusinessBoards(20261120, 200, 'launch-plan'),
  pipeline: randomBusinessBoards(20261121, 200, 'pipeline'),
  budget: randomBusinessBoards(20261122, 200, 'budget'),
}
const kits: Record<keyof typeof boards, WorkshopBoardKit> = { 'launch-plan': launchPlanKit, pipeline: pipelineKit, budget: budgetKit }

/** A slate with nothing but what attachWorkshop asks of it: it keeps each note's place. */
function recordingSlate() {
  const notes = new Map<string, any>()
  const said: string[] = []
  const slate = {
    policy: null as any,
    announce: (text: string) => { said.push(text) },
    nodes: {
      add(options: any) {
        const node = { id: options.id, options: { ...options }, position(x: number, y: number) { node.options.x = x; node.options.y = y },
          setText(text: string) { node.options.text = text },
          setShape() {}, svgGroup: { node: document.createElementNS('http://www.w3.org/2000/svg', 'g'), front() {} } }
        notes.set(options.id, node)
        return node
      },
      one: (id: string) => notes.get(id),
      remove: (id: string) => notes.delete(id),
      get allNodes() { return [] },
    },
    setDragPolicy(policy: any) { slate.policy = policy; return () => undefined },
    withPolicyAuthority: (fn: () => void) => fn(),
  }
  return { slate, notes, said }
}

/** Where Dragology measures an element of the board's headless drawing. */
function measured(board: Workshop, layout: WorkshopBoardLayout, name: string, place: (board: Workshop, layout: WorkshopBoardLayout) => { parts: any[] }) {
  const draggable: Draggable<Workshop> = props => partsGeometry(place(props.state, layout).parts)
  const at = getElementPositionCheap({ draggable, draggedPath: name + '/', draggedId: name, anchorPos: Vec2(0, 0), startState: board, debug: { varyVisualizer: false } }, board)
  return at && { x: at.x, y: at.y }
}

const placeOf = { 'launch-plan': launchLayout, pipeline: pipelineLayout, budget: budgetLayout }

describe.each(Object.keys(boards) as (keyof typeof boards)[])('%s on 200 random boards', kind => {
  it('draws every card, lane, caption and column as a native note at the place the kit gives, in both layouts', async () => {
    let checked = 0
    for (const board of boards[kind]) {
      for (const layout of layouts) {
        const { slate, notes } = recordingSlate()
        const attached = attachWorkshop(slate, board, { kit: kitFor(kind), origin: { x: 100, y: 50 }, layout })
        await attached.whenDrawn()
        const { parts } = kits[kind].places(board, layout)
        expect(notes.size).toBe(parts.length)
        for (const part of parts) {
          const note = notes.get(part.name)
          expect(note, part.name).toBeTruthy()
          expect([note.options.x, note.options.y, note.options.width, note.options.height]).toEqual([100 + part.x, 50 + part.y, part.width, part.height])
          checked++
        }
        for (const card of board.cards) expect(notes.has('card-' + card.id)).toBe(true)
        for (const lane of board.lanes) expect(['lane-', 'caption-', 'column-'].every(prefix => notes.has(prefix + lane.id))).toBe(true)
        attached.destroy()
        expect(notes.size).toBe(0)
      }
    }
    expect(checked).toBeGreaterThan(2000)
  })

  it('measures each card and handle where the native note is (Dragology\'s headless geometry)', () => {
    let checked = 0
    for (const board of boards[kind].slice(0, 120)) {
      for (const layout of layouts) {
        for (const part of kits[kind].places(board, layout).parts) {
          if (!/^(card|handle)-/.test(part.name)) continue
          const at = measured(board, layout, part.name, placeOf[kind])!
          expect(at.x).toBeCloseTo(part.x, 6)
          expect(at.y).toBeCloseTo(part.y, 6)
          checked++
        }
      }
    }
    expect(checked).toBeGreaterThan(500)
  })
})

describe('the chooser picks what the rules make', () => {
  const grab = { x: 6, y: 6 }
  it('pipeline and budget: a pointer holding a card over its place in a legal board picks exactly that board, and never an illegal one', () => {
    let picked = 0
    for (const kind of ['pipeline', 'budget'] as const) {
      for (const board of boards[kind]) {
        for (const layout of layouts) {
          for (const card of board.cards.slice(0, 4)) {
            const choose = kits[kind].chooser(board, card.id, grab, layout)
            const legal = workshopDestinations(board, card.id).map(lane => workshopCandidate(board, card.id, lane.id)!)
            if (!choose) { expect(legal.length).toBeLessThan(2); continue }
            for (const next of legal) {
              const part = kits[kind].places(next, layout).parts.find(item => item.name === 'card-' + card.id)!
              const chosen = choose({ x: part.x + grab.x, y: part.y + grab.y })
              expect(chosen).toEqual(next)
              // The rule every surface uses agrees: the same move made by edit gives the same board.
              if (next !== board) {
                const lane = next.cards.find(item => item.id === card.id)!.laneId
                const edited = applyWorkshopEdits(board, [{ kind: 'move_card', card: { id: card.id }, lane: { id: lane } }])
                expect('workshop' in edited && edited.workshop).toEqual(next)
              }
              picked++
            }
            const json = legal.map(next => JSON.stringify(next))
            for (const point of [{ x: -400, y: -400 }, { x: 3000, y: 60 }, { x: 120, y: 2400 }]) expect(json).toContain(JSON.stringify(choose(point)))
          }
        }
      }
    }
    expect(picked).toBeGreaterThan(1500)
  })

  it('launch plan: dropped on a task it may wait on, a bar links to it; slid along its row, it takes that lag, never past launch', () => {
    let links = 0, slides = 0
    for (const board of boards['launch-plan'].slice(0, 120)) {
      for (const layout of layouts) {
        const g = launchLayout(board, layout)
        for (const card of board.cards.slice(0, 3)) {
          const choose = launchPlanKit.chooser(board, card.id, grab, layout)!
          for (const target of launchLinkTargets(board, card.id)) {
            const bar = g.bars.get(target)!
            const chosen = choose({ x: bar.x + bar.width / 2, y: bar.y + bar.height / 2 })
            const edited = applyWorkshopEdits(board, [{ kind: 'link_tasks', card: { id: card.id }, waitsOn: { id: target } }])
            expect('workshop' in edited && edited.workshop).toEqual(withLink(board, card.id, target))
            expect(chosen.cards.find(item => item.id === card.id)!.dependsOn).toEqual(withLink(board, card.id, target).cards.find(item => item.id === card.id)!.dependsOn)
            links++
          }
          // Far from every other bar: slide by whole days within the limits.
          const limits = launchPlanLimits(board, { cardId: card.id, field: 'lag' })
          const own = g.bars.get(card.id)!
          for (const lag of [limits.min, Math.floor((limits.min + limits.max) / 2), limits.max]) {
            const next = withTaskValue(board, { cardId: card.id, field: 'lag' }, lag)
            const box = launchLayout(next, layout).bars.get(card.id)!
            const point = { x: box.x + grab.x, y: own.y + grab.y }
            if (board.cards.some(other => other.id !== card.id && g.bars.get(other.id)!.x <= point.x + 40 && point.x - 40 <= g.bars.get(other.id)!.x + g.bars.get(other.id)!.width &&
              Math.abs(g.bars.get(other.id)!.y - own.y) < 60)) continue
            const chosen = choose(point)
            expect((chosen.cards.find(item => item.id === card.id)!.lag ?? 0)).toBe(lag)
            slides++
          }
          // However far right the pointer goes, the plan still ends by launch.
          const far = choose({ x: own.x + 5000, y: own.y + grab.y })
          expect(applyWorkshopEdits(far, [{ kind: 'set_launch_day', day: far.launch!.day }])).not.toHaveProperty('refused')
        }
      }
    }
    expect(links).toBeGreaterThan(100)
    expect(slides).toBeGreaterThan(200)
  })
})

describe('an attached board played through its drag policy', () => {
  async function attach(board: Workshop, layout: WorkshopBoardLayout = {}) {
    const { slate, notes, said } = recordingSlate()
    const changes: { next: Workshop; change: WorkshopChangeEvent }[] = []
    const refusals: string[] = []
    const attached = attachWorkshop(slate, board, { kit: kitFor(board.kind), origin: { x: 0, y: 0 }, layout,
      onChange: (next, change) => { changes.push({ next, change }) }, onRefuse: refusal => { refusals.push(refusal.reason) } })
    await attached.whenDrawn()
    const center = (name: string) => { const o = notes.get(name).options; return { x: o.x + o.width / 2, y: o.y + o.height / 2 } }
    /** Press `name` at its centre, move it by (dx, dy) and let go. */
    const drag = (name: string, to: { x: number; y: number } | ((from: { x: number; y: number }) => { x: number; y: number })) => {
      const node = notes.get(name), from = center(name)
      const point = typeof to === 'function' ? to(from) : to
      expect(slate.policy.onStart(node, from, {})).toBe(true)
      slate.policy.onMove(node, { x: (from.x + point.x) / 2, y: (from.y + point.y) / 2 }, {})
      slate.policy.onMove(node, point, {})
      return slate.policy.onEnd(node, point, {})
    }
    const key = (name: string, keyName: string, shiftKey = false) =>
      slate.policy.onKeyDown(notes.get(name), { key: keyName, shiftKey, ctrlKey: false, metaKey: false, altKey: false, preventDefault() {} })
    return { attached, notes, said, changes, refusals, drag, key, center }
  }

  it('launch plan: a length grip stops at launch and says why; within it, the change goes out as edits', async () => {
    for (const layout of layouts) {
      const plan = validateWorkshop(sampleLaunchPlan())
      const t = await attach(plan, layout)
      const dayW = launchLayout(plan, layout).dayW
      t.drag('handle-build', from => ({ x: from.x + 3 * dayW, y: from.y }))
      expect(t.refusals).toEqual(['That pushes QA to day 15, after launch on day 14.'])
      expect(t.attached.value).toEqual(plan)
      t.drag('handle-build', from => ({ x: from.x + 2 * dayW, y: from.y }))
      expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'set_task', card: { id: 'build' }, duration: 8, lag: 0 }])
      expect(t.attached.value.cards.find(card => card.id === 'build')!.duration).toBe(8)
      // Undo is the host putting back the board it had: the notes follow.
      t.attached.update(plan)
      await t.attached.whenDrawn()
      expect(t.notes.get('card-qa').options.x).toBeCloseTo(launchLayout(plan, layout).bars.get('qa')!.x, 6)
      t.attached.destroy()
    }
  })

  it('launch plan: a bar dropped on a task waits on it; on one that waits on it, it is refused with the sentence', async () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const t = await attach(plan)
    t.drag('card-design', t.center('card-qa'))
    expect(t.refusals.at(-1)).toBe('QA already waits on Design, so Design can\'t wait on QA.')
    t.drag('card-copy', t.center('card-qa'))
    expect(t.attached.value.cards.find(card => card.id === 'copy')!.dependsOn).toEqual(['qa'])
    expect(t.changes.at(-1)!.change.edits![0]).toEqual({ kind: 'link_tasks', card: { id: 'copy' }, waitsOn: { id: 'qa' } })
    t.attached.destroy()
  })

  it('launch plan: arrow keys slide a bar a day and Shift stretches it, refused past launch', async () => {
    const t = await attach(validateWorkshop(sampleLaunchPlan()))
    expect(t.key('card-copy', 'ArrowRight')).toBe(true)
    expect(t.attached.value.cards.find(card => card.id === 'copy')!.lag).toBe(1)
    t.key('card-build', 'ArrowRight', true)
    t.key('card-build', 'ArrowRight', true)
    t.key('card-build', 'ArrowRight', true)
    expect(t.attached.value.cards.find(card => card.id === 'build')!.duration).toBe(8)
    expect(t.said.at(-1)).toBe('That pushes QA to day 15, after launch on day 14.')
    t.attached.destroy()
  })

  it('pipeline: a deal goes one stage on; a skipped stage and a full stage refuse with their sentences', async () => {
    for (const layout of layouts) {
      const t = await attach(validateWorkshop(samplePipeline()), layout)
      t.drag('card-northwind', t.center('column-won'))
      expect(t.refusals.at(-1)).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
      t.drag('card-acme', t.center('column-proposal'))
      expect(t.refusals.at(-1)).toBe('Proposal already holds 3 of 3 deals.')
      const part = pipelineLayout(workshopCandidate(t.attached.value, 'globex', 'qualified')!, layout).parts.find(item => item.name === 'card-globex')!
      t.drag('card-globex', from => ({ x: part.x + part.width / 2, y: part.y + part.height / 2 }))
      expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'move_card', card: { id: 'globex' }, lane: { id: 'qualified' } }])
      await t.attached.whenDrawn()
      expect(t.notes.get('gauge-forecast').options.text).toBe('Forecast $201.5k of $250k')
      t.attached.destroy()
    }
  })

  it('budget: a divider moves money and keeps the total; held past what a team commits it stops there; a line item goes only where it fits', async () => {
    for (const layout of layouts) {
      const board = validateWorkshop(sampleBudget())
      const t = await attach(board, layout)
      t.drag('card-contractor', t.center('column-design'))
      expect(t.refusals.at(-1)).toBe('Design has $30k left. Contractor costs $45k.')
      // Let go anywhere in a team with room, it goes to the foot of that team.
      t.drag('card-contractor', t.center('column-marketing'))
      expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'move_card', card: { id: 'contractor' }, lane: { id: 'marketing' } }])
      t.attached.update(board)
      await t.attached.whenDrawn()
      const perUnit = layout.narrow ? 900 / 1200000 : 960 / 1200000
      t.drag('handle-product', from => layout.narrow ? { x: from.x, y: from.y + 50000 * perUnit } : { x: from.x + 50000 * perUnit, y: from.y })
      expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'shift_budget', from: { id: 'sales' }, to: { id: 'product' }, amount: 50000 }])
      t.drag('handle-sales', from => layout.narrow ? { x: from.x, y: from.y - 400 } : { x: from.x - 400, y: from.y })
      expect(t.attached.value.lanes.find(lane => lane.id === 'sales')!.allocation).toBe(320000)
      expect(t.attached.value.lanes.reduce((sum, lane) => sum + lane.allocation!, 0)).toBe(1200000)
      t.attached.destroy()
    }
  })

  it('keeps both people\'s changes: each screen\'s edits applied to the other\'s board', async () => {
    const plan = validateWorkshop(sampleLaunchPlan())
    const ada = await attach(plan), ben = await attach(plan)
    ada.key('card-copy', 'ArrowRight')
    ben.key('card-build', 'ArrowRight', true)
    const server = [...ada.changes, ...ben.changes].reduce((board, { change }) => {
      const result = applyWorkshopEdits(board, change.edits!)
      if ('refused' in result) throw new Error(result.refused.reason)
      return result.workshop
    }, plan)
    ada.attached.update(server)
    ben.attached.update(server)
    for (const t of [ada, ben]) {
      expect(t.attached.value.cards.find(card => card.id === 'copy')!.lag).toBe(1)
      expect(t.attached.value.cards.find(card => card.id === 'build')!.duration).toBe(7)
    }
  })

  it('refuses to draw a business board without its kit', () => {
    const { slate } = recordingSlate()
    expect(() => attachWorkshop(slate, validateWorkshop(sampleBudget()))).toThrow("A budget board needs its kit: pass kit: kitFor('budget') from slateboxjs/boards.")
  })
})
