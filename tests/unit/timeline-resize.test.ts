// A task's bar has two grips on every board where its width is time (launch plan, customer go-live, hiring
// plan): its end changes how long it takes, its start moves its start and keeps its end (a Gantt's edges).
// A pointer's pixels go through the board's calendar (a weekend is drawn but not counted where days are
// working days), snap to the board's step (a week where it says so), keep one step at least, and the board's
// rules decide the drop: a hard line refuses it in its own sentence, a slip pushes what waits on it. The drop
// is one set_task edit, the same edit the chat and exec make.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, type Workshop, type BoardLayerState } from '../../src/workshops/model'
import { dragTaskEdge, edgeValues, goLiveSample, hiringPlanSample, launchPlanSample, scheduleLaunch, startHandle } from '../../src/workshops/rules'
import { handleLabel, launchLayout, launchPlanKit } from '../../src/boards'
import '../../src/workshops/behaviour'

const today = '2026-11-21' // plans start Monday 23 Nov
const goLive = () => validateWorkshop(goLiveSample(today))
const launch = () => validateWorkshop(launchPlanSample(today))
const hiring = () => validateWorkshop(hiringPlanSample(today))
const task = (board: Workshop, id: string) => board.cards.find(card => card.id === id)!
const times = (board: Workshop, id: string) => scheduleLaunch(board).get(id)!

describe('a dragged edge, in the board’s own days', () => {
  it('the end edge keeps the start: Configure (Fri to Thu, 5 working days) pulled back two calendar days takes 3', () => {
    const plan = goLive()
    const before = times(plan, 'configure')
    expect([before.from, before.to, task(plan, 'configure').duration]).toEqual([4, 11, 5])
    expect(edgeValues(plan, 'configure', 'end', -2)).toEqual({ lag: 0, duration: 3 })
    // A pointer between days lands on the nearest one.
    expect(edgeValues(plan, 'configure', 'end', -1.4)).toEqual({ lag: 0, duration: 4 })
    // An end let go on the weekend ends on the Friday before: Saturday and Sunday are not working days.
    for (const by of [-4, -5, -6]) expect(edgeValues(plan, 'configure', 'end', by).duration).toBe(1)
    const result = dragTaskEdge(plan, 'configure', 'end', -2)
    expect(result.refusal).toBeNull()
    expect(times(result.next!, 'configure').start).toBe(before.start)
  })

  it('the start edge keeps the end: the start moves and the length takes up the difference', () => {
    const plan = goLive()
    const before = times(plan, 'configure')
    // Friday to Monday is one working day later: one day less long, the same last day.
    expect(edgeValues(plan, 'configure', 'start', 3)).toEqual({ lag: 1, duration: 4 })
    const later = dragTaskEdge(plan, 'configure', 'start', 3).next!
    expect([times(later, 'configure').end, times(later, 'configure').to]).toEqual([before.end, before.to])
    // A start dropped on Saturday starts the Monday after.
    expect(edgeValues(plan, 'configure', 'start', 1)).toEqual({ lag: 1, duration: 4 })
    // Earlier, on a task that waits: Launch post waits 3 days after Copy, from Monday; pulled back to the Thursday
    // before (four calendar days, two working days) it waits 1 and takes 4. Back to the weekend only, it stays.
    const plan2 = launch()
    const post = times(plan2, 'post')
    expect(edgeValues(plan2, 'post', 'start', -4)).toEqual({ lag: 1, duration: 4 })
    expect(edgeValues(plan2, 'post', 'start', -2)).toEqual({ lag: 3, duration: 2 })
    expect(times(dragTaskEdge(plan2, 'post', 'start', -4).next!, 'post').end).toBe(post.end)
  })

  it('at least one day long, and never before what it waits on lets it start; each said', () => {
    const plan = goLive()
    expect(edgeValues(plan, 'configure', 'end', -20)).toEqual({ lag: 0, duration: 1, held: 'length' })
    expect(dragTaskEdge(plan, 'configure', 'end', -20).reason).toBe('A task takes at least 1 day.')
    expect(edgeValues(plan, 'configure', 'start', 30)).toEqual({ lag: 4, duration: 1, held: 'length' })
    // Configure waits on Send data, which ends the day before it starts.
    expect(edgeValues(plan, 'configure', 'start', -3)).toEqual({ lag: 0, duration: 5, held: 'ready' })
    expect(dragTaskEdge(plan, 'configure', 'start', -3).reason).toBe('Configure starts as early as it can: it waits on Send data.')
    expect(dragTaskEdge(plan, 'kickoff', 'start', -3).reason).toBe('Kickoff starts on the plan’s first day.')
  })

  it('a hiring plan snaps to whole weeks: a grip moves a week at a time', () => {
    const plan = hiring()
    const designer = task(plan, 'designer')
    expect(edgeValues(plan, 'designer', 'end', 3).duration).toBe(designer.duration)
    expect(edgeValues(plan, 'designer', 'end', 4).duration).toBe(designer.duration! + 7)
    expect(edgeValues(plan, 'designer', 'end', -40).duration).toBe(7)
    const start = edgeValues(plan, 'designer', 'start', -10)
    expect(start.lag % 7).toBe(0)
    expect(start.duration % 7).toBe(0)
    expect(start.lag + start.duration).toBe((designer.lag ?? 0) + designer.duration!)
  })

  it('a hard line refuses in its own sentence; a slip pushes the tasks that wait on it', () => {
    const plan = goLive()
    // Configure to 14 working days ends in time itself, and pushes Sign-off past go-live.
    const late = dragTaskEdge(plan, 'configure', 'end', 13)
    expect(late.values.duration).toBe(14)
    expect(late.next).toBeNull()
    expect(late.refusal).toBe('Sign-off would run until Mon 21 Dec; go-live is Fri 18 Dec.')
    const slip = dragTaskEdge(plan, 'configure', 'end', 1).next!
    expect(task(slip, 'configure').duration).toBe(6)
    expect(times(slip, 'train').start).toBe(times(plan, 'train').start + 1)
    expect(times(slip, 'signoff').start).toBe(times(plan, 'signoff').start + 1)
  })

  it('the drop is one set_task edit, and the edit reducer makes the same board', () => {
    const plan = goLive()
    const drop = dragTaskEdge(plan, 'configure', 'start', 3)
    expect(drop.edit).toEqual({ kind: 'set_task', card: { id: 'configure' }, duration: 4, lag: 1 })
    const result = applyWorkshopEdits(plan, [drop.edit])
    if ('refused' in result) throw new Error(result.refused.reason)
    expect(result.workshop.cards).toEqual(drop.next!.cards)
    expect(result.report.edits[0].said).toBe('“Configure” now takes 4 days and waits 1 day.')
  })
})

describe('the grips on the canvas', () => {
  const layout = { width: 1200 }
  const grab = { x: 6, y: 6 }
  const pointer = (board: Workshop, name: string, dx: number) => {
    const part = launchLayout(board, layout).parts.find(item => item.name === name)!
    return { x: part.x + grab.x + dx, y: part.y + grab.y }
  }

  it('every task has a start grip and an end grip, at least 24px to a finger, leaving a short bar room to be moved', () => {
    for (const board of [goLive(), launch(), hiring()]) {
      for (const narrow of [false, true]) {
        const g = launchLayout(board, narrow ? { narrow: true, width: 358 } : layout)
        // A hiring plan on a phone is read-only: no grips.
        if (board.kind === 'hiring-plan' && narrow) { expect(g.parts.some(part => part.name.startsWith('handle-'))).toBe(false); continue }
        for (const card of board.cards) {
          const bar = g.bars.get(card.id)!
          const start = g.parts.find(part => part.name === startHandle(card.id))!, end = g.parts.find(part => part.name === 'handle-' + card.id)!
          expect(start.width).toBeGreaterThanOrEqual(24)
          expect(end.width).toBeGreaterThanOrEqual(24)
          expect(start.height).toBeGreaterThanOrEqual(24)
          // Each grip sits on its edge; between them some of the bar is left to grab.
          expect(start.x).toBeLessThanOrEqual(bar.x)
          expect(start.x + start.width).toBeGreaterThanOrEqual(bar.x)
          expect(end.x).toBeLessThanOrEqual(bar.x + bar.width)
          expect(end.x + end.width).toBeGreaterThanOrEqual(bar.x + bar.width)
          expect(Math.max(start.x + start.width, bar.x)).toBeLessThan(Math.min(end.x, bar.x + bar.width))
        }
      }
    }
  })

  it('pixels to days: Configure’s end grip dragged two calendar days left makes it 3 days; its start grip three right starts it Monday', () => {
    const plan = goLive()
    const g = launchLayout(plan, layout)
    const end = launchPlanKit.handleDrag(plan, 'handle-configure', grab, layout)!
    const shorter = end(pointer(plan, 'handle-configure', -2 * g.dayW))
    expect(shorter.refusal).toBeUndefined()
    expect(task(shorter.next, 'configure').duration).toBe(3)
    const start = launchPlanKit.handleDrag(plan, startHandle('configure'), grab, layout)!
    const later = start(pointer(plan, startHandle('configure'), 3 * g.dayW))
    expect([task(later.next, 'configure').lag, task(later.next, 'configure').duration]).toEqual([1, 4])
    // Held at its bound, the grip says why; nothing is refused.
    const early = start(pointer(plan, startHandle('configure'), -3 * g.dayW))
    expect(early).toMatchObject({ clampedReason: 'Configure starts as early as it can: it waits on Send data.' })
    expect(early.refusal).toBeUndefined()
  })

  it('a grip dragged past the hard line is refused in the board’s sentence (the drop snaps back)', () => {
    const plan = goLive()
    const g = launchLayout(plan, layout)
    const end = launchPlanKit.handleDrag(plan, 'handle-configure', grab, layout)!
    const past = end(pointer(plan, 'handle-configure', 13 * g.dayW))
    expect(past.refusal).toBe('Sign-off would run until Mon 21 Dec; go-live is Fri 18 Dec.')
    // On show while held: the nearest length the rules take, Sign-off ending by go-live.
    expect(scheduleLaunch(past.next).get('signoff')!.to).toBeLessThanOrEqual(25)
  })

  it('on a phone a finger drags the grips the same way', () => {
    const plan = goLive()
    const phone = { narrow: true, width: 358 }
    const g = launchLayout(plan, phone)
    const part = g.parts.find(item => item.name === 'handle-configure')!
    const end = launchPlanKit.handleDrag(plan, 'handle-configure', grab, phone)!
    expect(task(end({ x: part.x + grab.x - 2 * g.dayW, y: part.y + grab.y }).next, 'configure').duration).toBe(3)
  })

  it('keys and screen readers: the start grip has its name, and Left and Right move the start with the end kept', () => {
    const plan = goLive()
    expect(handleLabel(plan, startHandle('configure'))).toBe('Configure start, Fri 27 Nov. Left and Right move it; the end stays.')
    expect(launchPlanKit.keyEdit!(plan, startHandle('configure'), { key: 'ArrowRight', shiftKey: false }))
      .toEqual([{ kind: 'set_task', card: { id: 'configure' }, duration: 4, lag: 1 }])
  })

  it('the selected or hovered task shows both grips above its bar; others show none on a laptop', () => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    document.body.appendChild(svg)
    const layer = launchPlanKit.layer({ canvas: { node: svg } })
    const state = (extra: Partial<BoardLayerState> = {}): BoardLayerState => ({ origin: { x: 0, y: 0 }, layout, clamp: null, refused: false, ...extra })
    const grips = () => [...svg.querySelectorAll('[data-board-layer-top] [data-board-layer^="grip-"]')].map(node => node.getAttribute('data-board-layer')).sort()
    const plan = goLive()
    layer.draw(plan, null, state())
    expect(grips()).toEqual([])
    layer.draw(plan, null, state({ focus: 'configure' }))
    expect(grips()).toEqual(['grip-end-configure', 'grip-start-configure'])
    // On a phone (no hover) every bar shows its grips.
    layer.draw(plan, null, state({ layout: { narrow: true, width: 358 } }))
    expect(grips().length).toBe(plan.cards.length * 2)
    layer.destroy()
  })
})
