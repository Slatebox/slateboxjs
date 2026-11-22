// The line a plan works toward (launch day, a customer's go-live) is dragged by its grip like any edge of the
// plan: later, the chart draws the days it adds and grows under the pointer (the drag keeps its day width);
// earlier, a hard line refuses a day before the tasks end, in the plan's sentence with the earliest day that
// fits, and the drop goes back. Where weekends don't count the line lands on a working day: later on the
// Monday after, earlier on the Friday before; the same for a key, the chat and exec (set_launch_day).
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, attachWorkshop, validateWorkshop, type Workshop, type WorkshopChangeEvent, type WorkshopEdit } from '../../src/workshops/model'
import { earliestLaunch, goLiveSample, hiringPlanSample, launchDayOn, launchPlanSample, moveLaunch, sampleLaunchPlan } from '../../src/workshops/rules'
import { handleLabel, kitFor, launchLayout, launchPlanKit } from '../../src/boards'
import '../../src/workshops/behaviour'

const today = '2026-11-21' // plans start Monday 23 Nov: day 25 is Fri 18 Dec, 26 Sat 19, 28 Mon 21 Dec
const goLive = () => validateWorkshop(goLiveSample(today))
const launch = () => validateWorkshop(launchPlanSample(today))
const layout = { width: 1200 }
const grab = { x: 22, y: 22 }

function applied(board: Workshop, edits: WorkshopEdit[]) {
  const result = applyWorkshopEdits(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return { board: result.workshop, said: result.report.edits.map(edit => edit.said).join(' ') }
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  return 'refused' in result ? result.refused.reason : null
}
/** The go-live grip pressed where it is drawn and the pointer moved `days` calendar days of the grid. */
function dragLine(board: Workshop, days: number, at = layout) {
  const g = launchLayout(board, at)
  const part = g.parts.find(item => item.name === 'handle-launch')!
  const follow = launchPlanKit.handleDrag(board, 'handle-launch', grab, at)!
  return { g, part, result: follow({ x: part.x + grab.x + days * g.dayW, y: part.y + grab.y }) }
}

describe('dragging go-live later, past the chart’s end', () => {
  it('three days right lands on Monday 21 Dec: the chart draws the days it adds and grows under the pointer', () => {
    const plan = goLive()
    const { g, part, result } = dragLine(plan, 3)
    expect(result.refusal).toBeUndefined()
    expect(result.next.launch!.day).toBe(28)
    // While held, the plan keeps its day width and grows to the right: the grip stays under the pointer.
    expect(result.layout).toEqual({ ...layout, dayWidth: g.dayW })
    const shown = launchLayout(result.next, result.layout)
    expect(shown.dayW).toBeCloseTo(g.dayW, 9)
    expect(shown.width).toBeGreaterThan(g.width)
    expect(shown.parts.find(item => item.name === 'handle-launch')!.x).toBeCloseTo(part.x + 3 * g.dayW, 6)
    // Let go, the plan fits its width again, with the days it added.
    expect(launchLayout(result.next, layout).width).toBe(g.width)
    // The drop is the edit the chat and exec make.
    expect(launchPlanKit.editsBetween(plan, result.next)).toEqual([{ kind: 'set_launch_day', day: 28 }])
  })

  it('a week and more later keeps going: the line is never stuck at the end of what is drawn', () => {
    const plan = goLive()
    for (const [days, day] of [[1, 28], [2, 28], [4, 29], [7, 32], [10, 35], [20, 45]] as const) expect(dragLine(plan, days).result.next.launch!.day).toBe(day)
  })

  it('a launch plan in day numbers (no rules) and the library’s launch plan move the same way', () => {
    const plain = validateWorkshop(sampleLaunchPlan())
    expect(dragLine(plain, 3).result.next.launch!.day).toBe(17)
    // Launch on Fri 11 Dec, a day right is the weekend: it lands on Monday 14 Dec.
    expect(dragLine(launch(), 1).result.next.launch!.day).toBe(21)
  })

  it('on a phone the finger drags it the same way', () => {
    const phone = { narrow: true, width: 358 }
    const { result } = dragLine(goLive(), 3, phone)
    expect(result.next.launch!.day).toBe(28)
    expect(result.layout?.dayWidth).toBeCloseTo(launchLayout(goLive(), phone).dayW, 9)
  })

  it('held at day 120, it says so', () => {
    const { result } = dragLine(goLive(), 200)
    expect(result.next.launch!.day).toBe(120) // Tue 23 Mar
    expect(result.clampedReason).toBe('Launch day is at most day 120.')
    expect(result.refusal).toBeUndefined()
  })
})

describe('dragging go-live earlier: the hard line', () => {
  it('before the tasks end it is refused in the board’s sentence, with the earliest go-live that fits, shown there while held', () => {
    const plan = goLive()
    expect(earliestLaunch(plan)).toBe(16) // Done Tue 8 Dec: go-live Wed 9 Dec at the earliest
    const { result } = dragLine(plan, -11) // Mon 7 Dec
    expect(result.refusal).toBe('Sign-off would run until Tue 8 Dec; go-live is Mon 7 Dec. The earliest go-live that fits is Wed 9 Dec.')
    expect(result.clampedReason).toBe(result.refusal)
    expect(result.next.launch!.day).toBe(16)
    // Earlier but in time is fine: Fri 11 Dec.
    expect(dragLine(plan, -7).result).toMatchObject({ next: { launch: { day: 18 } } })
    expect(dragLine(plan, -7).result.refusal).toBeUndefined()
  })

  it('an earliest day on a weekend is the Monday after', () => {
    // Sign-off moved to end on a Friday: the first day after it is Saturday, so go-live fits from Monday.
    const plan = applied(goLive(), [{ kind: 'set_task', card: { id: 'signoff' }, lag: 3 }]).board
    expect(earliestLaunch(plan)).toBe(21)
  })

  it('the chat and exec say the same: set_launch_day before the tasks end is refused with the earliest day', () => {
    expect(refused(goLive(), [{ kind: 'set_launch_day', day: 14 }])).toBe('Sign-off would run until Tue 8 Dec; go-live is Mon 7 Dec. The earliest go-live that fits is Wed 9 Dec.')
    expect(refused(validateWorkshop(sampleLaunchPlan()), [{ kind: 'set_launch_day', day: 11 }])).toBe('That pushes QA to day 12, after launch on day 11. The earliest launch that fits is day 12.')
  })
})

describe('go-live lands on working days where weekends don’t count', () => {
  it('later: Saturday and Sunday are the Monday after; earlier: the Friday before', () => {
    const plan = goLive()
    expect([26, 27].map(day => launchDayOn(plan, day))).toEqual([28, 28])
    expect([26, 27].map(day => launchDayOn(plan, day, 30))).toEqual([25, 25])
    // A plan in day numbers, or one where weekends count, takes any day.
    expect(launchDayOn(validateWorkshop(sampleLaunchPlan()), 13)).toBe(13)
    const everyDay = { ...plan, behaviour: { ...plan.behaviour!, rules: plan.behaviour!.rules.filter(rule => rule.kind !== 'workdays') } }
    expect(launchDayOn(everyDay, 26)).toBe(26)
  })

  it('the keys: Right from Friday is Monday, Left from Monday is Friday, each one edit, said with the reason', () => {
    const plan = goLive()
    const right = launchPlanKit.keyEdit!(plan, 'handle-launch', { key: 'ArrowRight', shiftKey: false })!
    const later = applied(plan, right)
    expect(later.board.launch!.day).toBe(28)
    expect(later.said).toBe('Go-live is now Mon 21 Dec: Sat 19 Dec is a weekend, and weekends don’t count on this plan.')
    const back = applied(later.board, launchPlanKit.keyEdit!(later.board, 'handle-launch', { key: 'ArrowLeft', shiftKey: false })!)
    expect(back.board.launch!.day).toBe(25)
    expect(back.said).toBe('Go-live is now Fri 18 Dec: Sun 20 Dec is a weekend, and weekends don’t count on this plan.')
  })

  it('a drag that lets go on the weekend lands on a working day, toward where it was going', () => {
    const plan = goLive()
    expect(dragLine(plan, 1).result.next.launch!.day).toBe(28)
    expect(dragLine(plan, -5).result.next.launch!.day).toBe(18) // Sun 13 Dec, coming earlier: Fri 11 Dec
  })

  it('set_launch_day (the chat, exec) lands the same way; a working day is taken as said', () => {
    expect(applied(goLive(), [{ kind: 'set_launch_day', day: 26 }]).board.launch!.day).toBe(28)
    expect(applied(goLive(), [{ kind: 'set_launch_day', day: 30 }]).said).toBe('Go-live is now Wed 23 Dec.')
    expect(applied(goLive(), [{ kind: 'set_launch_day', day: 32 }]).board.launch!.day).toBe(32)
    expect(moveLaunch(goLive(), 27)).toMatchObject({ day: 28, refusal: null })
  })

  it('the grip says the line’s name and date to a screen reader', () => {
    expect(handleLabel(goLive(), 'handle-launch')).toBe('Go-live, Fri 18 Dec. Left and Right move it.')
    expect(handleLabel(validateWorkshop(sampleLaunchPlan()), 'handle-launch')).toBe('Launch day, day 14. Left and Right move it.')
  })
})

describe('a hiring plan’s funding round moves in the plan’s weeks', () => {
  it('its grip snaps to whole weeks, the same step as its keys', () => {
    const plan = validateWorkshop(hiringPlanSample(today))
    const g = launchLayout(plan, layout)
    const part = g.parts.find(item => item.name === 'handle-funding')!
    const follow = launchPlanKit.handleDrag(plan, 'handle-funding', grab, layout)!
    const at = (days: number) => follow({ x: part.x + grab.x + days * g.dayW, y: part.y + grab.y }).next.hiring!.funding!.day
    const day = plan.hiring!.funding!.day
    expect([at(3), at(4), at(-4), at(14)]).toEqual([day, day + 7, day - 7, day + 14])
    expect(launchPlanKit.keyEdit!(plan, 'handle-funding', { key: 'ArrowRight', shiftKey: false })).toEqual([{ kind: 'set_funding', day: day + 7 }])
  })
})

/** A slate with nothing but what attachWorkshop asks of it: it keeps each note's place (as board-kits-parity's). */
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

describe('an attached go-live board, through its drag policy', () => {
  it('dragged past the chart’s end it moves later, the plan growing under the pointer; one edit; too early is refused and nothing changes', async () => {
    for (const at of [layout, { narrow: true, width: 358 }]) {
      const plan = goLive()
      const { slate, notes, said } = recordingSlate()
      const changes: WorkshopChangeEvent[] = [], refusals: string[] = []
      const attached = attachWorkshop(slate, plan, { kit: kitFor(plan.kind), origin: { x: 0, y: 0 }, layout: at,
        onChange: (_next, change) => { changes.push(change) }, onRefuse: refusal => { refusals.push(refusal.reason) } })
      await attached.whenDrawn()
      const g = launchLayout(plan, at)
      const center = () => { const o = notes.get('handle-launch').options; return { x: o.x + o.width / 2, y: o.y + o.height / 2 } }
      const node = notes.get('handle-launch'), from = center()
      expect(slate.policy.onStart(node, from, {})).toBe(true)
      slate.policy.onMove(node, { x: from.x + 3 * g.dayW, y: from.y }, {})
      await attached.whenDrawn()
      // While held (the slate moves the grip with the pointer): the rows are drawn wider, past the old end.
      const row = () => notes.get(at.narrow ? 'handle-launch' : 'column-us').options
      if (!at.narrow) expect(row().width).toBeGreaterThan(g.width)
      slate.policy.onEnd(node, { x: from.x + 3 * g.dayW, y: from.y }, {})
      expect(changes.map(change => change.edits)).toEqual([[{ kind: 'set_launch_day', day: 28 }]])
      expect(said.at(-1)).toBe('Go-live is now Mon 21 Dec.')
      await attached.whenDrawn()
      // Let go, the plan fits its width again.
      if (!at.narrow) expect(row().width).toBe(g.width)
      expect(attached.bounds.width).toBe(g.width)
      // Earlier than the tasks end: refused in the board's sentence; the grip goes back and nothing changes.
      const node2 = notes.get('handle-launch'), from2 = center(), back = { x: from2.x - 14 * launchLayout(attached.value, at).dayW, y: from2.y }
      expect(slate.policy.onStart(node2, from2, {})).toBe(true)
      slate.policy.onMove(node2, back, {})
      slate.policy.onEnd(node2, back, {})
      expect(refusals.at(-1)).toBe('Sign-off would run until Tue 8 Dec; go-live is Mon 7 Dec. The earliest go-live that fits is Wed 9 Dec.')
      expect(attached.value.launch!.day).toBe(28)
      expect(changes.length).toBe(1)
      await attached.whenDrawn()
      expect(center().x).toBeCloseTo(from2.x, 6)
      attached.destroy()
    }
  })
})
