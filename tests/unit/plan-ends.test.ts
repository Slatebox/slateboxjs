// Both ends of a board whose width is a quantity are dragged both ways, with the same feel as a task's grips:
// a plan's first day (earlier adds days at the front; later takes them away, every task keeping its dates or
// starting on the new first day), a hiring plan's last week, and a pipeline's target on its forecast gauge.
// Each is a grip (a finger's 44px), a key (Left and Right), a live preview on the scale the drag started with,
// one edit on the drop (set_plan_start, set_plan_weeks, set_target), the same edit the chat and exec make.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, checkWorkshopReplacement, validateWorkshop, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { goLiveSample, hiringPlanSample, launchPlanSample, movePlanStart, sampleLaunchPlan, samplePipeline, scheduleLaunch, withPlanStart } from '../../src/workshops/rules'
import { handleLabel, launchLayout, launchPlanKit, pipelineKit, pipelineLayout } from '../../src/boards'
import { isoAt } from '../../src/workshops/calendar'
import '../../src/workshops/behaviour'

const today = '2026-11-21' // plans start Monday 23 Nov; go-live is Fri 18 Dec (day 25)
const goLive = () => validateWorkshop(goLiveSample(today))
const hiring = () => validateWorkshop(hiringPlanSample(today))
const layout = { width: 1200 }
const grab = { x: 22, y: 22 }
const FIRST = 'handle-_first', LAST = 'handle-_last'

function applied(board: Workshop, edits: WorkshopEdit[]) {
  const result = applyWorkshopEdits(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return { board: result.workshop, said: result.report.edits.map(edit => edit.said).join(' ') }
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  return 'refused' in result ? result.refused.reason : null
}
/** Each task's first and last calendar date. */
const dates = (board: Workshop) => Object.fromEntries(Array.from(scheduleLaunch(board)).map(([id, t]) => [id, [isoAt(board.clock!.origin, t.from), isoAt(board.clock!.origin, t.to - 1)]]))
const lineDate = (board: Workshop) => isoAt(board.clock!.origin, board.launch!.day)
function dragPart(board: Workshop, name: string, days: number, at = layout) {
  const g = launchLayout(board, at)
  const part = g.parts.find(item => item.name === name)!
  const follow = launchPlanKit.handleDrag(board, name, grab, at)!
  return { g, result: follow({ x: part.x + grab.x + days * g.dayW, y: part.y + grab.y }) }
}

describe('a plan’s first day, moved both ways', () => {
  it('a week earlier adds a week at the front: every task and go-live keep their dates', () => {
    const plan = goLive()
    const { board, said } = applied(plan, [{ kind: 'set_plan_start', start: '2026-11-16' }])
    expect(board.clock!.origin).toBe('2026-11-16')
    expect(dates(board)).toEqual(dates(plan))
    expect(lineDate(board)).toBe('2026-12-18')
    expect(board.launch!.day).toBe(32)
    expect(said).toBe('The plan now starts Mon 16 Nov.')
  })

  it('later: the tasks that started before the new first day start on it, what waits on them moves with them', () => {
    const plan = goLive()
    const { board } = applied(plan, [{ kind: 'set_plan_start', start: '2026-11-26' }]) // Thursday
    expect(dates(board).kickoff).toEqual(['2026-11-26', '2026-11-26'])
    expect(dates(board).signoff).toEqual(['2026-12-11', '2026-12-11'])
    expect(lineDate(board)).toBe('2026-12-18')
  })

  it('refused when the tasks would no longer fit, with the latest first day that does; nothing changes', () => {
    expect(refused(goLive(), [{ kind: 'set_plan_start', start: '2026-12-03' }]))
      .toBe('Sign-off would run until Fri 18 Dec; go-live is Fri 18 Dec. The latest first day that fits is Wed 2 Dec.')
    expect(movePlanStart(goLive(), 21).refusal).toBe('A plan runs at least 5 days to go-live. The latest first day that fits is Wed 2 Dec.')
  })

  it('a locked task is never slid by it', () => {
    // Launch a week later, so the tasks have room: only the lock stops the first day moving later.
    const plan = applied(validateWorkshop(launchPlanSample(today)), [{ kind: 'set_launch_day', day: 25 }, { kind: 'add_rule', rule: { kind: 'locked', cards: ['Design'] } }]).board
    expect(movePlanStart(plan, 1).refusal).toMatch(/Design/)
    // Earlier, Design keeps its dates: the lock holds.
    expect(movePlanStart(plan, -7).refusal).toBeNull()
  })

  it('lands on a working day where weekends don’t count: later on the Monday, earlier on the Friday', () => {
    expect(movePlanStart(goLive(), 5).by).toBe(7)
    expect(applied(goLive(), [{ kind: 'set_plan_start', start: '2026-11-22' }]).said).toBe('The plan now starts Fri 20 Nov (Sun 22 Nov is a weekend).')
  })

  it('a plan in day numbers has no first day to move', () => {
    expect(refused(validateWorkshop(sampleLaunchPlan()), [{ kind: 'set_plan_start', start: '2026-11-30' }])).toBe('A plan in day numbers starts on day 0. Give it dates to move its first day.')
    expect(launchLayout(validateWorkshop(sampleLaunchPlan()), layout).parts.some(part => part.name === FIRST)).toBe(false)
  })

  it('its grip: dragged a week left the plan grows on the right on the scale it started with; one set_plan_start; a save of it passes', () => {
    const plan = goLive()
    const { g, result } = dragPart(plan, FIRST, -7)
    expect(result.refusal).toBeUndefined()
    expect(result.next.clock!.origin).toBe('2026-11-16')
    expect(result.layout).toEqual({ ...layout, dayWidth: g.dayW })
    expect(launchLayout(result.next, result.layout).width).toBeGreaterThan(g.width)
    const edits = launchPlanKit.editsBetween(plan, result.next)
    expect(edits).toEqual([{ kind: 'set_plan_start', start: '2026-11-16' }])
    expect(applied(plan, edits).board).toEqual(result.next)
    expect(checkWorkshopReplacement(plan, result.next)).toBeNull()
    // A save that moves the first day and slides the tasks with it is still refused.
    expect(checkWorkshopReplacement(plan, { ...plan, clock: { origin: '2026-11-16' } })).toBe('A plan keeps its first day. Move tasks, or launch, instead.')
    // Dragged too far right: refused in the board’s sentence, the plan as it was.
    const late = dragPart(plan, FIRST, 14).result
    expect(late.refusal).toMatch(/^Sign-off would run until .*The latest first day that fits is Wed 2 Dec\.$/)
    expect(late.next).toBe(plan)
  })

  it('its keys and its name: Left is a working day earlier', () => {
    const plan = goLive()
    expect(handleLabel(plan, FIRST)).toBe('First day, Mon 23 Nov. Left and Right move it; every task keeps its dates.')
    const left = launchPlanKit.keyEdit!(plan, FIRST, { key: 'ArrowLeft', shiftKey: false })!
    expect(applied(plan, left).board.clock!.origin).toBe('2026-11-20')
    const right = launchPlanKit.keyEdit!(plan, FIRST, { key: 'ArrowRight', shiftKey: false })!
    expect(applied(plan, right).board.clock!.origin).toBe('2026-11-24')
  })

  it('a finger drags it on a phone too: the grip is a finger’s size', () => {
    const phone = { narrow: true, width: 358 }
    const part = launchLayout(goLive(), phone).parts.find(item => item.name === FIRST)!
    expect(Math.min(part.width, part.height)).toBeGreaterThanOrEqual(44)
    expect(dragPart(goLive(), FIRST, -7, phone).result.next.clock!.origin).toBe('2026-11-16')
  })
})

describe('a hiring plan’s two ends, in weeks', () => {
  it('its first day moves in whole weeks: hires, the round and its last day keep their dates', () => {
    const plan = hiring()
    expect(movePlanStart(plan, 3).by).toBe(0)
    const earlier = withPlanStart(plan, -7)
    expect(earlier.hiring!.weeks).toBe(plan.hiring!.weeks + 1)
    expect(earlier.hiring!.funding!.day).toBe(plan.hiring!.funding!.day + 7)
    expect(dates(earlier)).toEqual(dates(plan))
    expect(dragPart(plan, FIRST, -7).result.next.clock!.origin).toBe(isoAt(plan.clock!.origin, -7))
  })

  it('its last week: dragged right it runs longer, left shorter, never before a hire starts; one set_plan_weeks', () => {
    const plan = hiring()
    const longer = dragPart(plan, LAST, 4 * 7).result
    expect(longer.next.hiring!.weeks).toBe(56)
    expect(launchPlanKit.editsBetween(plan, longer.next)).toEqual([{ kind: 'set_plan_weeks', weeks: 56 }])
    expect(applied(plan, [{ kind: 'set_plan_weeks', weeks: 56 }]).said).toBe('The plan now runs 56 weeks, to Sun 19 Dec.')
    const shorter = dragPart(plan, LAST, -30 * 7).result
    expect(shorter.refusal).toBe('AE #2 starts Mon 10 May, after the plan’s last week.')
    expect(refused(plan, [{ kind: 'set_plan_weeks', weeks: 20 }])).toBe('AE #2 starts Mon 10 May, after the plan’s last week.')
    expect(launchPlanKit.keyEdit!(plan, LAST, { key: 'ArrowLeft', shiftKey: false })).toEqual([{ kind: 'set_plan_weeks', weeks: 51 }])
    // On a phone a hiring plan is read-only: neither end has a grip.
    expect(launchLayout(plan, { narrow: true, width: 358 }).parts.some(part => part.name === FIRST || part.name === LAST)).toBe(false)
  })

  it('its funding round’s drag is kept: the drop is one set_funding', () => {
    const plan = hiring()
    const g = launchLayout(plan, layout)
    const part = g.parts.find(item => item.name === 'handle-funding')!
    const next = launchPlanKit.handleDrag(plan, 'handle-funding', grab, layout)!({ x: part.x + grab.x + 7 * g.dayW, y: part.y + grab.y }).next
    expect(launchPlanKit.editsBetween(plan, next)).toEqual([{ kind: 'set_funding', day: plan.hiring!.funding!.day + 7 }])
  })
})

describe('a pipeline’s target, on its forecast gauge', () => {
  it('its grip raises the target dragged right and lowers it dragged left, in the gauge’s steps, on the scale it started with', () => {
    const board = validateWorkshop(samplePipeline())
    const g = pipelineLayout(board, layout)
    const part = g.parts.find(item => item.name === 'handle-target')!
    expect(Math.min(part.width, part.height)).toBeGreaterThanOrEqual(44)
    const follow = pipelineKit.handleDrag(board, 'handle-target', grab, layout)!
    const per = (g.width - 8) / (250000 * 1.25)
    const up = follow({ x: part.x + grab.x + 50000 * per, y: part.y + grab.y })
    expect(up.next.forecast!.target).toBe(300000)
    expect(up.layout).toEqual({ ...layout, gaugeScale: 312500 })
    expect(pipelineKit.editsBetween(board, up.next)).toEqual([{ kind: 'set_target', amount: 300000 }])
    expect(follow({ x: part.x + grab.x - 100000 * per, y: part.y + grab.y }).next.forecast!.target).toBe(150000)
    expect(follow({ x: part.x + grab.x - 9e6 * per, y: part.y + grab.y })).toMatchObject({ next: { forecast: { target: 5000 } }, clampedReason: 'A target is at least $5k.' })
  })

  it('its keys and its name', () => {
    const board = validateWorkshop(samplePipeline())
    expect(pipelineKit.keyEdit!(board, 'handle-target', { key: 'ArrowRight', shiftKey: false })).toEqual([{ kind: 'set_target', amount: 255000 }])
    expect(pipelineKit.keyEdit!(board, 'handle-target', { key: 'ArrowLeft', shiftKey: false })).toEqual([{ kind: 'set_target', amount: 245000 }])
    expect(pipelineKit.label!(board, 'handle-target')).toBe('Target, $250k. Left and Right change it by $5k.')
  })
})
