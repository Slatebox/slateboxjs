// A budget's total, grown or shrunk at the envelope's outer edges (the owner, 2026-11-22: "change the total too").
// The inner dividers still move money between teams. An outer edge dragged out grows the total, in shrinks it, in
// the board's steps: the team at that edge gains or gives first, then the next team in, each within its cap and never
// below its floor or what it commits. Below what the teams keep it is refused with the smallest total that fits.
// One set_budget_total per drag or key, the edit the chat and exec make; a save that changes the total any other
// way is still refused.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, attachWorkshop, checkWorkshopReplacement, validateWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopEdit } from '../../src/workshops/model'
import { budgetTotalBounds, sampleBudget, withBudgetTotal } from '../../src/workshops/rules'
import { budgetKit, budgetLayout, handleLabel, kitFor } from '../../src/boards'

const budget = () => validateWorkshop(sampleBudget()) // $1.2M: Product $400k (floor $300k), Sales $400k, Design $150k, Marketing $250k (cap $300k)
const layout = { width: 1200 }
const grab = { x: 22, y: 22 }
const FIRST = 'handle-_first', LAST = 'handle-_last'
const allocations = (board: Workshop) => Object.fromEntries(board.lanes.map(lane => [lane.id, lane.allocation]))

function applied(board: Workshop, edits: WorkshopEdit[]) {
  const result = applyWorkshopEdits(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return { board: result.workshop, said: result.report.edits.map(edit => edit.said).join(' ') }
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  return 'refused' in result ? result.refused.reason : null
}
function drag(board: Workshop, name: string, amount: number, at: { width?: number; narrow?: boolean } = layout) {
  const g = budgetLayout(board, at)
  const part = g.parts.find(item => item.name === name)!
  const follow = budgetKit.handleDrag(board, name, grab, at)!
  const by = amount * g.k
  return { g, result: follow(g.narrow ? { x: part.x + grab.x, y: part.y + grab.y + by } : { x: part.x + grab.x + by, y: part.y + grab.y }) }
}

describe('set_budget_total', () => {
  it('grows at the end: the last team gains first, then the next team in when it reaches its cap', () => {
    const grown = applied(budget(), [{ kind: 'set_budget_total', amount: 1250000 }])
    expect(grown.board.budget!.total).toBe(1250000)
    expect(allocations(grown.board)).toMatchObject({ marketing: 300000, design: 150000 })
    expect(grown.said).toBe('The budget is now $1.25M: Marketing $300k.')
    expect(allocations(applied(budget(), [{ kind: 'set_budget_total', amount: 1300000 }]).board)).toMatchObject({ marketing: 300000, design: 200000 })
  })

  it('shrinks at the end: the last team gives down to what it commits, then the next team in', () => {
    expect(allocations(applied(budget(), [{ kind: 'set_budget_total', amount: 1100000 }]).board)).toMatchObject({ marketing: 150000, design: 150000 })
    expect(allocations(applied(budget(), [{ kind: 'set_budget_total', amount: 1050000 }]).board)).toEqual({ product: 400000, sales: 380000, design: 120000, marketing: 150000 })
  })

  it('at the start edge, the first team gains or gives first', () => {
    expect(allocations(applied(budget(), [{ kind: 'set_budget_total', amount: 1250000, edge: 'start' }]).board)).toMatchObject({ product: 450000, marketing: 250000 })
    expect(allocations(applied(budget(), [{ kind: 'set_budget_total', amount: 1100000, edge: 'start' }]).board)).toMatchObject({ product: 300000, sales: 400000 })
  })

  it('never below what the teams keep: refused with the smallest total that fits', () => {
    expect(budgetTotalBounds(budget())).toEqual({ min: 890000, max: 1e9 })
    expect(refused(budget(), [{ kind: 'set_budget_total', amount: 800000 }])).toBe('The teams keep $890k between them: their floors and what they commit. The smallest total that fits is $890k.')
    expect(applied(budget(), [{ kind: 'set_budget_total', amount: 890000 }]).board.budget!.total).toBe(890000)
    // Every team capped: never above their caps.
    const capped = validateWorkshop({ ...sampleBudget(), lanes: sampleBudget().lanes.map(lane => ({ ...lane, cap: 500000 })) })
    expect(refused(capped, [{ kind: 'set_budget_total', amount: 2100000 }])).toBe('Every team is at its cap. The largest total that fits is $2M.')
  })

  it('a save may change the total only as the edit does', () => {
    const plan = budget()
    const grown = withBudgetTotal(plan, 1250000) as Workshop
    expect(checkWorkshopReplacement(plan, grown)).toBeNull()
    expect(checkWorkshopReplacement(plan, withBudgetTotal(plan, 1250000, 'start') as Workshop)).toBeNull()
    // The total grown with the money put somewhere no edge puts it.
    const elsewhere = { ...grown, lanes: plan.lanes.map(lane => lane.id === 'sales' ? { ...lane, allocation: 450000 } : lane) }
    expect(checkWorkshopReplacement(plan, elsewhere)).toBe('The total changes only at the envelope’s edges: drag one, or say the new total.')
    expect(checkWorkshopReplacement(plan, { ...plan, budget: { ...plan.budget!, currency: '€' } })).toBe('A budget keeps its currency and its step.')
  })
})

describe('the envelope’s outer edges on the canvas', () => {
  it('the end grip dragged out $50k grows the total; the envelope grows on the right on the scale the drag started with; one set_budget_total', () => {
    const plan = budget()
    const { g, result } = drag(plan, LAST, 50000)
    expect(result.refusal).toBeUndefined()
    expect(result.next.budget!.total).toBe(1250000)
    expect(result.layout).toEqual({ ...layout, gaugeScale: 1200000 })
    const shown = budgetLayout(result.next, result.layout)
    expect(shown.width).toBeGreaterThan(g.width)
    expect(shown.parts.find(part => part.name === LAST)!.x).toBeCloseTo(g.parts.find(part => part.name === LAST)!.x + 50000 * g.k, 6)
    expect(budgetKit.editsBetween(plan, result.next)).toEqual([{ kind: 'set_budget_total', amount: 1250000 }])
    expect(applied(plan, budgetKit.editsBetween(plan, result.next)).board).toEqual(result.next)
    // Let go, the envelope fits its width again.
    expect(budgetLayout(result.next, layout).width).toBe(g.width)
  })

  it('the end grip dragged in shrinks it, in the board’s $5k steps', () => {
    const { result } = drag(budget(), LAST, -101000)
    expect(result.next.budget!.total).toBe(1100000)
    expect(budgetKit.editsBetween(budget(), result.next)).toEqual([{ kind: 'set_budget_total', amount: 1100000 }])
  })

  it('the start grip dragged out (left) grows it at the start: the end stays where it was', () => {
    const plan = budget()
    const { g, result } = drag(plan, FIRST, -50000)
    expect(result.next.budget!.total).toBe(1250000)
    expect(result.next.lanes[0].allocation).toBe(450000)
    expect(result.layout).toEqual({ ...layout, gaugeScale: 1200000, gaugeAnchor: 'start' })
    const shown = budgetLayout(result.next, result.layout)
    expect(shown.segments[0].start).toBeCloseTo(-50000 * g.k, 6)
    expect(shown.segments.at(-1)!.start + shown.segments.at(-1)!.size).toBeCloseTo(g.width, 6)
    expect(budgetKit.editsBetween(plan, result.next)).toEqual([{ kind: 'set_budget_total', amount: 1250000, edge: 'start' }])
    // Dragged in (right) it shrinks at the start.
    expect(drag(plan, FIRST, 100000).result.next.lanes[0].allocation).toBe(300000)
  })

  it('dragged in past what the teams keep: held at the smallest total, said, and refused on the drop', () => {
    const { result } = drag(budget(), LAST, -500000)
    expect(result.refusal).toBe('The teams keep $890k between them: their floors and what they commit. The smallest total that fits is $890k.')
    expect(result.clampedReason).toBe(result.refusal)
    expect(result.next.budget!.total).toBe(890000)
  })

  it('keys: outward grows a step, inward shrinks a step; a finger drags it on a phone', () => {
    const plan = budget()
    expect(budgetKit.keyEdit!(plan, LAST, { key: 'ArrowRight', shiftKey: false })).toEqual([{ kind: 'set_budget_total', amount: 1205000, edge: 'end' }])
    expect(budgetKit.keyEdit!(plan, LAST, { key: 'ArrowLeft', shiftKey: false })).toEqual([{ kind: 'set_budget_total', amount: 1195000, edge: 'end' }])
    expect(budgetKit.keyEdit!(plan, FIRST, { key: 'ArrowLeft', shiftKey: false })).toEqual([{ kind: 'set_budget_total', amount: 1205000, edge: 'start' }])
    expect(budgetKit.keyEdit!(plan, FIRST, { key: 'ArrowRight', shiftKey: false })).toEqual([{ kind: 'set_budget_total', amount: 1195000, edge: 'start' }])
    expect(handleLabel(plan, LAST)).toBe('Budget end, total $1.2M. Right grows it, Left shrinks it, by $5k; Marketing gains or gives first.')
    const phone = { narrow: true, width: 358 }
    const part = budgetLayout(plan, phone).parts.find(item => item.name === LAST)!
    expect(Math.min(part.width, part.height)).toBeGreaterThanOrEqual(44)
    expect(drag(plan, LAST, 50000, phone).result.next.budget!.total).toBe(1250000)
  })
})

/** A slate with nothing but what attachWorkshop asks of it (as board-kits-parity's). */
function recordingSlate() {
  const notes = new Map<string, any>()
  const said: string[] = []
  const slate = {
    policy: null as any,
    canvas: { node: document.createElementNS('http://www.w3.org/2000/svg', 'svg') },
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

describe('an attached budget, through its drag policy', () => {
  it('the end grip dragged out: one change with one set_budget_total (what collaborators receive); dragged in too far: refused, nothing changes', async () => {
    const plan = budget()
    const { slate, notes, said } = recordingSlate()
    const changes: WorkshopChangeEvent[] = [], refusals: string[] = []
    const attached = attachWorkshop(slate, plan, { kit: kitFor('budget'), origin: { x: 0, y: 0 }, layout,
      onChange: (_next, change) => { changes.push(change) }, onRefuse: refusal => { refusals.push(refusal.reason) } })
    await attached.whenDrawn()
    const k = budgetLayout(plan, layout).k
    const press = (dx: number) => {
      const node = notes.get(LAST), o = node.options, from = { x: o.x + o.width / 2, y: o.y + o.height / 2 }, to = { x: from.x + dx, y: from.y }
      expect(slate.policy.onStart(node, from, {})).toBe(true)
      slate.policy.onMove(node, to, {})
      slate.policy.onEnd(node, to, {})
    }
    press(50000 * k)
    expect(changes.map(change => change.edits)).toEqual([[{ kind: 'set_budget_total', amount: 1250000 }]])
    expect(said.at(-1)).toBe('The budget is now $1.25M: Marketing $300k.')
    await attached.whenDrawn()
    press(-600000 * budgetLayout(attached.value, layout).k)
    expect(refusals.at(-1)).toMatch(/The smallest total that fits is \$890k\.$/)
    expect(attached.value.budget!.total).toBe(1250000)
    expect(changes.length).toBe(1)
    attached.destroy()
  })
})
