// Launch plan: tasks in team lanes, each with a length in days, a lag and the tasks it waits on.
// Starts are never stored: scheduleLaunch (schedule.ts) derives them. A plan without rules keeps its
// built-in line (every task ends by launch day, a slip pushes what waits on it); a plan with a rulebook
// is governed by its rules (timeRules.ts): a soft or hard line, overlap, snap, working days, freezes,
// push or stop, locks. A dated plan (clock.origin) says real dates.
import type { Workshop, WorkshopCard } from './model'
// The rule modules take the model's own helpers from the model, so they share its chunk instead of copying it.
import { registerWorkshopRules, said } from './model'
import type { BusinessBoardRules, BusinessEditTools, PlanWords, WorkshopLimits } from './kinds'
import type { WorkshopEdit } from './edits'
import { amountOf, days, nextCardId, noteNumbers, ownField, renamedNumbers } from './numbers'
import { clockOf, dateName, dayFromWords, dayMap, isoTime, nextMonday, isoAt, offsetOf, weekendAt } from './calendar'
import { extendWorkshopEdits, cascadeStops, dayWords, downstreamTasks, edgeValues, type EdgeValues, type TaskEdge, holdOthers, launchFinish, launchHard, launchIndex, launchOverrun, lineWord, scheduleLaunch, snapStep, withLink, withTaskValue } from './schedule'
import { checkTime, timeFamily } from './timeRules'

export * from './schedule'
export type { WorkshopLimits } from './kinds'

/** The rule kinds a launch plan takes, with add_rule's body keys. */
const launchFamily = timeFamily({ deadline: 'at', overlap: 'lane', snap: 'unit', workdays: '', blackout: 'start end label', cascade: 'onConflict', locked: 'cards' })

const ref = { anyOf: [{ type: 'string', minLength: 1, maxLength: 200 }, { type: 'object', additionalProperties: false, required: ['id'], properties: { id: { type: 'string', minLength: 1, maxLength: 64 } } }] }
const iso = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
// The plans take rules: add_rule's kinds and keys, and set_rule's floor, slip and snap.
extendWorkshopEdits({
  kinds: [
    { kind: 'set_plan_start', summary: 'Launch or hiring plan: move the plan’s first day. Every task, the line and a funding round keep their dates; a task that would start before the new first day starts on it. Working days and week snap as the plan’s rules say.', intent: false,
      fields: { start: { type: 'text', min: 10, max: 10, about: 'The new first day, as 2026-11-30.' } }, boards: ['launch-plan', 'hiring-plan'], refusals: {} },
    { kind: 'set_plan_weeks', summary: 'Hiring plan: how many weeks the plan runs (its last day). The first day stays.', intent: false,
      fields: { weeks: { type: 'integer', min: 13, max: 104, about: 'Weeks, 13 to 104.' } }, boards: ['hiring-plan'], refusals: {} },
  ],
  boards: { add_rule: ['launch-plan', 'hiring-plan'], set_rule: ['launch-plan', 'hiring-plan'], remove_rule: ['launch-plan', 'hiring-plan'] },
  fields: { set_rule: { floor: { type: 'integer', min: 1, max: 60, optional: true, about: 'A runway floor, in months.' },
    onConflict: { type: 'choice', values: ['push', 'stop'], optional: true, about: 'A slip pushes the tasks that wait on it, or stops at them.' },
    unit: { type: 'choice', values: ['day', 'week'], optional: true, about: 'Snap to days or weeks.' } } },
  rules: { kinds: ['deadline', 'overlap', 'snap', 'workdays', 'blackout', 'cascade', 'locked'],
    keys: { at: { enum: ['launch', 'runway'] }, floor: { type: 'number', minimum: 1, maximum: 60 }, unit: { enum: ['day', 'week'] }, start: iso, end: iso,
      label: { type: 'string', minLength: 1, maxLength: 40 }, onConflict: { enum: ['push', 'stop'] }, cards: { type: 'array', items: ref, minItems: 1, maxItems: 6 } } },
})

/** Why `after` breaks this plan's rules (or its built-in line), as a sentence; null when it keeps them. */
export function planProblem(before: Workshop, after: Workshop, cardId?: string): string | null {
  if (!before.behaviour) return before.kind === 'launch-plan' ? launchOverrun(after, cardId) : null
  const verdict = checkTime(before, after)
  return 'refused' in verdict ? verdict.refused.sentence : null
}

/**
 * What a whole-board save may not change on a plan, because no edit does: anything of its clock but its first
 * day (set_plan_start), what it calls its line, a hiring plan's cash, burn, currency, the round's size and its bands (a band's cost and the round's day have their edits,
 * and answer to the rules). Rules change on their own, never in the save that moves a task.
 */
export function planFixed(before: Workshop, after: Workshop): string | null {
  const say = JSON.stringify
  // Its first day moves only as set_plan_start moves it, every task, the line and the round keeping their dates
  // (so a lock or a freeze is never slid by it): any other change of clock is refused.
  if (say(before.clock) !== say(after.clock)) {
    const moved = before.clock && after.clock && say({ ...before.clock, origin: after.clock.origin }) === say(after.clock)
      ? withPlanStart(before, offsetOf(before.clock.origin, after.clock.origin)) : null
    const dates = (board: Workshop) => say([board.launch, board.hiring?.funding?.day, board.hiring?.weeks, board.cards.map(card => [card.id, card.lag ?? 0])])
    if (!moved || dates(moved) !== dates(after)) return 'A plan keeps its first day. Move tasks, or launch, instead.'
  }
  if (before.launch?.name !== after.launch?.name) return 'A plan keeps what it calls its line.'
  const money = (board: Workshop) => { const h = board.hiring; return say(h && [h.cash, h.burn, h.currency, h.funding?.amount, h.bands.map(band => [band.id, band.label, band.lane])]) }
  if (money(before) !== money(after)) return 'A hiring plan keeps its cash, burn, round and role bands. Say what a band costs, or when the round closes, instead.'
  const tasks = (board: Workshop) => say(board.cards.map(card => [card.id, card.laneId, card.lag, card.duration, card.dependsOn, card.band]))
  return say(before.behaviour?.rules) !== say(after.behaviour?.rules) && tasks(before) !== tasks(after) ? 'Change the rules on their own, then move tasks.' : null
}

/**
 * One task changed (its lag, length or team), as the plan's rules have it: a slip that stops holds the
 * tasks waiting on it. The board that results, or the sentence of the rule it breaks.
 */
export function tryTask(board: Workshop, cardId: string, change: Partial<Pick<WorkshopCard, 'lag' | 'duration' | 'laneId'>>): Workshop | string {
  let next: Workshop = { ...board, cards: board.cards.map(card => {
    if (card.id !== cardId) return card
    const out = { ...card, ...change }
    if (!out.lag) delete out.lag
    return out
  }) }
  if (cascadeStops(board)) {
    const held = holdOthers(board, next, new Set([cardId]))
    if (typeof held === 'string') return held
    next = held
  }
  return planProblem(board, next, cardId) ?? next
}

/**
 * A task just made from a note let go on calendar `day` of a plan: it starts on that day, in whole steps of the
 * plan's snap (a week where it snaps to weeks; a hire always moves in weeks), read through its calendar (a day off
 * on a working-day plan is the next working day). Where the plan's rules refuse that day (past a hard line, in a
 * freeze), the nearest earlier day they take; the plan's start when none does (where a dropped note always went).
 */
export function landPlanNote(board: Workshop, cardId: string, day: number): Workshop {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !Number.isFinite(day)) return board
  const ready = scheduleLaunch(board).get(cardId)!.start - (card.lag ?? 0)
  const step = board.kind === 'hiring-plan' ? Math.max(7, snapStep(board)) : snapStep(board)
  const wanted = Math.max(0, Math.round((dayMap(clockOf(board)).idx(Math.max(0, Math.floor(day))) - ready) / step) * step)
  for (let lag = wanted; lag > 0; lag -= step) {
    const tried = tryTask(board, cardId, { lag })
    if (typeof tried !== 'string') return tried
  }
  return board
}

/** The grip on a task's start edge (its end grip is `handle-<card>`). A card id never starts with "_", so the name is the start grip's alone. */
export const startHandle = (cardId: string) => 'handle-_start-' + cardId
const startPrefix = startHandle('')
/** The task whose start grip this is, or null for any other part. */
export const startHandleCard = (part: string) => part.startsWith(startPrefix) ? part.slice(startPrefix.length) : null

/** What a dragged edge comes to: its values, the one edit a drop makes, the board (null when the rules refuse it) and why it stopped or was refused. */
export interface EdgeDrag { values: EdgeValues; edit: WorkshopEdit; next: Workshop | null; refusal: string | null; reason?: string }

/**
 * A task's start or end edge dragged `by` calendar days (edgeValues), as the plan's rules have it: a slip
 * pushes what waits on it (or stops at it, held where it was), and a rule the change breaks refuses it in
 * its own sentence. The drop is one set_task edit, the edit the chat and exec make.
 */
export function dragTaskEdge(board: Workshop, cardId: string, edge: TaskEdge, by: number): EdgeDrag {
  const values = edgeValues(board, cardId, edge, by)
  const card = board.cards.find(item => item.id === cardId)!
  const edit: WorkshopEdit = { kind: 'set_task', card: { id: cardId }, duration: values.duration, lag: values.lag }
  const tried = tryTask(board, cardId, { lag: values.lag, duration: values.duration })
  const hiring = board.kind === 'hiring-plan'
  const waits = card.dependsOn?.map(id => board.cards.find(item => item.id === id)?.label).filter(Boolean) ?? []
  const reason = values.held === 'length' ? (hiring ? 'Recruiting takes at least 1 week.' : snapStep(board) > 1 ? 'A task takes at least a week.' : 'A task takes at least 1 day.')
    : values.held === 'longest' ? (hiring ? 'Recruiting takes at most 20 weeks.' : 'A task takes at most 60 days.')
    : values.held === 'ready' ? (waits.length ? card.label + ' starts as early as it can: it waits on ' + waits.join(' and ') + '.' : card.label + ' starts on the plan’s first day.') : undefined
  return typeof tried === 'string' ? { values, edit, next: null, refusal: tried, reason } : { values, edit, next: tried, refusal: null, reason }
}

/** A plan's words for the chat (kinds.ts PlanWords): dates on this plan. */
export const planWords: PlanWords = {
  day: (board, text, after = 0) => board.clock ? dayFromWords(board.clock.origin, text, after) : null,
  iso: (board, day) => isoAt(board.clock!.origin, day),
  name: (board, day) => dayWords(board, day),
  readyDay(board, cardId) {
    const card = board.cards.find(item => item.id === cardId)!
    return dayMap(clockOf(board)).cal(scheduleLaunch(board).get(cardId)!.start - (card.lag ?? 0))
  },
  lagAt(board, cardId, day) {
    const card = board.cards.find(item => item.id === cardId)!
    return dayMap(clockOf(board)).idx(day) - (scheduleLaunch(board).get(cardId)!.start - (card.lag ?? 0))
  },
}

/** Where every task of a plan may be dragged: its legal runs of start and of length. */
export const planDrags = (board: Workshop) => JSON.stringify(board.cards.map(card => [legalRuns(board, card.id, 'lag'), legalRuns(board, card.id, 'duration')]))

/** The legal values of a task's lag or length, as runs of whole steps ([first, last] each): the drag's branches. */
export function legalRuns(board: Workshop, cardId: string, field: 'lag' | 'duration', laneId?: string): [number, number][] {
  const step = snapStep(board), hiring = board.kind === 'hiring-plan'
  const top = field === 'duration' ? (hiring ? 140 : 60) : hiring ? 728 : launchHard(board) ? board.launch!.day : 120
  const runs: [number, number][] = []
  for (let v = field === 'duration' ? step : 0; v <= top; v += step) {
    if (typeof tryTask(board, cardId, { [field]: v, ...(laneId && { laneId }) }) === 'string') continue
    const last = runs.at(-1)
    if (last && last[1] === v - step) last[1] = v
    else runs.push([v, v])
  }
  return runs
}

export function validateLaunchPlan(board: Workshop): string | null {
  if (board.lanes.length > 4) return 'A launch plan has 2 to 4 teams.'
  if (board.cards.length < 1 || board.cards.length > 12) return 'A launch plan has 1 to 12 tasks.'
  const day = board.launch?.day
  if (typeof day !== 'number' || !Number.isInteger(day) || day < 5 || day > 120) return 'Launch day is a whole day from 5 to 120.'
  const hard = launchHard(board)
  for (const card of board.cards) {
    if (!Number.isInteger(card.duration) || card.duration! < 1 || card.duration! > 60) return 'A task takes 1 to 60 days.'
    if (!Number.isInteger(card.lag ?? 0) || (card.lag ?? 0) < 0 || (card.lag ?? 0) > 120) return 'A task waits 0 days or more, and no later than launch.'
    if ((card.dependsOn?.length ?? 0) > 3) return 'A task waits on up to 3 others.'
    if (card.dependsOn?.includes(card.id)) return 'A task can\'t wait on itself.'
  }
  if (!board.clock && board.behaviour?.rules.some(rule => rule.kind === 'workdays' || rule.kind === 'blackout')) return 'Working days and freezes need dates; this plan counts day numbers.'
  try { scheduleLaunch(board) } catch (error) { return (error as Error).message }
  const times = scheduleLaunch(board)
  const finish = launchFinish(board)
  if (hard && finish > launchIndex(board)) {
    const late = board.cards.find(card => times.get(card.id)!.end === finish)!
    return board.clock ? launchOverrun(board) : `${late.label} ends on day ${finish}, after launch on day ${day}.`
  }
  return null
}

/** A task changes team. The schedule does not depend on teams, so any team takes it (its rules may not). */
export function planLaunchPlanMove(board: Workshop, cardId: string, laneId: string): Workshop | null {
  const card = board.cards.find(item => item.id === cardId)
  if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
  if (card.laneId === laneId) return board
  return { ...board, cards: board.cards.map(item => item === card ? { ...card, laneId } : item) }
}

export function launchPlanRefusal(board: Workshop, cardId: string, laneId: string): string {
  return planLaunchPlanMove(board, cardId, laneId) ? '' : 'That move is not available.'
}

/** Why `cardId` may not wait on `waitsOn`; null when it may. */
export function launchLinkRefusal(board: Workshop, cardId: string, waitsOn: string): string | null {
  const task = board.cards.find(card => card.id === cardId), target = board.cards.find(card => card.id === waitsOn)
  if (!task || !target) return 'That task is no longer on the plan.'
  if (task === target) return 'A task can\'t wait on itself.'
  if (task.dependsOn?.includes(target.id)) return `${task.label} already waits on ${target.label}.`
  if (downstreamTasks(board, task.id).has(target.id)) return `${target.label} already waits on ${task.label}, so ${task.label} can't wait on ${target.label}.`
  if ((task.dependsOn?.length ?? 0) >= 3) return `${task.label} already waits on 3 tasks.`
  return planProblem(board, withLink(board, cardId, waitsOn), cardId)
}

export function launchPlanCaption(board: Workshop, laneId: string): string {
  const times = scheduleLaunch(board)
  const tasks = board.cards.filter(card => card.laneId === laneId)
  const critical = tasks.filter(card => times.get(card.id)!.critical).length
  return `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ${critical} on the critical path`
}

/**
 * The legal range of a task's lag or length, or of launch day, with the sentence for each end: every
 * value in the range keeps the plan's rules (on a plan without rules, every task ending by launch).
 */
export function launchPlanLimits(board: Workshop, ref: { cardId?: string; field: 'lag' | 'duration' | 'day' }): WorkshopLimits {
  const day = board.launch!.day
  if (ref.field === 'day') {
    const times = scheduleLaunch(board)
    const finish = launchFinish(board)
    const last = board.cards.find(card => times.get(card.id)!.end === finish)
    const end = last ? times.get(last.id)!.to : 0
    if (!launchHard(board)) return { field: 'day', min: 5, max: 120, reasons: { min: 'Launch day is day 5 at the earliest.', max: 'Launch day is at most day 120.' } }
    return { field: 'day', min: Math.max(5, end), max: 120,
      reasons: { min: last ? (board.clock ? `${last.label} ends ${dayWords(board, end - 1)}.` : `${last.label} ends on day ${finish}.`) : undefined, max: 'Launch day is at most day 120.' } }
  }
  const card = board.cards.find(item => item.id === ref.cardId)!
  const step = snapStep(board), field = ref.field
  const floor = field === 'duration' ? step : 0, top = field === 'duration' ? 60 : launchHard(board) ? day : 120
  let max = card[field] ?? floor
  while (max + step <= top && typeof tryTask(board, card.id, { [field]: max + step }) !== 'string') max += step
  const tried = max + step <= top ? tryTask(board, card.id, { [field]: max + step }) : null
  return { field, min: floor, max: Math.max(floor, max),
    reasons: { min: field === 'duration' ? 'A task takes at least 1 day.' : `${card.label} starts as early as it can.`,
      max: typeof tried === 'string' ? tried : field === 'duration' ? 'A task takes at most 60 days.' : `Launch is ${dayWords(board, day)}.` } }
}

/**
 * The day the line lands on when it is moved to `day` from `from` (where it is): on a plan whose days are
 * working days a weekend is no day for it, so moving later it lands on the Monday after, moving earlier on
 * the Friday before. Always a day from 5 to 120 (past an end, it turns back to the working day inside it).
 */
export function launchDayOn(board: Workshop, day: number, from = board.launch?.day ?? day): number {
  const at = Math.min(120, Math.max(5, Math.round(day)))
  const clock = clockOf(board)
  if (!clock?.workdays) return at
  const walk = (start: number, step: number) => { let d = start; while (weekendAt(clock.origin, d)) d += step; return d }
  const step = at < from ? -1 : 1
  const landed = walk(at, step)
  return landed < 5 || landed > 120 ? walk(at, -step) : landed
}

/** The earliest day the line may be on and every task still end by it: a working day where days are working days. */
export function earliestLaunch(board: Workshop): number {
  const { min } = launchPlanLimits(board, { field: 'day' })
  return launchDayOn(board, min, -Infinity)
}

/** Why the line may not be on `day` because a task would not end by it, with the earliest day that fits; null when they all do. */
export function launchTooEarly(board: Workshop, day: number): string | null {
  if (!launchHard(board)) return null
  const late = launchOverrun(withTaskValue(board, { field: 'day' }, day))
  return late && late + ' The earliest ' + lineWord(board) + ' that fits is ' + dayWords(board, earliestLaunch(board)) + '.'
}

/** What dragging (or a key moving) the line to `wanted` comes to: the day it lands on, the board, and the sentence that refuses it or holds it. */
export interface LaunchMove { day: number; next: Workshop | null; refusal: string | null; reason?: string }

/**
 * The line moved to `wanted` (a whole calendar day, from the pointer): it lands on a working day where weekends
 * don't count, never past day 120 (held there, said), and a hard line refuses a day before the tasks end, in the
 * plan's own sentence with the earliest day that fits. A later line needs no room: the grid draws the days it adds.
 */
export function moveLaunch(board: Workshop, wanted: number): LaunchMove {
  const from = board.launch!.day
  const day = launchDayOn(board, wanted, from)
  const reason = wanted > 120 ? 'Launch day is at most day 120.' : wanted < 5 ? 'Launch day is day 5 at the earliest.' : undefined
  const early = launchTooEarly(board, day)
  if (early) return { day, next: null, refusal: early }
  const next = withTaskValue(board, { field: 'day' }, day)
  const broken = board.behaviour ? planProblem(board, next) : null
  return broken ? { day, next: null, refusal: broken } : { day, next, refusal: null, ...(reason && { reason }) }
}

/**
 * How far the plan's first day lands when it is moved `by` calendar days: where weekends don't count a
 * weekend is no first day (later: the Monday after; earlier: the Friday before); a plan that snaps to weeks
 * (a hiring plan) moves it in whole weeks.
 */
export function planStartBy(board: Workshop, by: number): number {
  const move = Math.round(by)
  if (snapStep(board) > 1 || board.kind === 'hiring-plan') return Math.round(move / 7) * 7
  const clock = clockOf(board)
  if (!clock?.workdays || !move) return move
  let at = move
  while (weekendAt(clock.origin, at)) at += move > 0 ? 1 : -1
  return at
}

/**
 * The plan with its first day moved `by` calendar days: every task keeps its dates (a task that would start
 * before the new first day starts on it, and what waits on it moves with it), the line and a funding round keep
 * theirs, and a hiring plan keeps its last day. Unchecked: see movePlanStart.
 */
export function withPlanStart(board: Workshop, by: number): Workshop {
  const origin = isoAt(board.clock!.origin, by)
  const was = scheduleLaunch(board)
  const next: Workshop = { ...board, clock: { ...board.clock!, origin }, cards: board.cards.map(card => ({ ...card })) }
  if (board.launch) next.launch = { ...board.launch, day: board.launch.day - by }
  if (board.hiring) next.hiring = { ...board.hiring, weeks: board.hiring.weeks - Math.round(by / 7),
    ...(board.hiring.funding && { funding: { ...board.hiring.funding, day: board.hiring.funding.day - by } }) }
  const map = dayMap(clockOf(next))
  // What a task waits on starts before it: set each task's lag in order of where it starts, on the board as it is so far.
  for (const card of [...board.cards].sort((a, b) => was.get(a.id)!.start - was.get(b.id)!.start)) {
    const own = next.cards.find(item => item.id === card.id)!
    const ready = scheduleLaunch(next).get(card.id)!.start - (own.lag ?? 0)
    const at = was.get(card.id)!.from - by
    const lag = Math.max(0, (at <= 0 ? 0 : map.idx(at)) - ready)
    if (lag) own.lag = lag
    else delete own.lag
  }
  return next
}

/** What moving the plan's first day comes to: how far it moved (snapped), the board, or the sentence that refuses it. */
export interface StartMove { by: number; next: Workshop | null; refusal: string | null }

/** Why the plan may not start `by` calendar days later (earlier when negative); null when it may. */
function startProblem(board: Workshop, by: number): string | null {
  const next = withPlanStart(board, by)
  if (board.launch && next.launch!.day > 120) return 'A plan runs at most 120 days to ' + lineWord(board) + '.'
  if (board.launch && next.launch!.day < 5) return 'A plan runs at least 5 days to ' + lineWord(board) + '.'
  if (board.hiring) {
    if (next.hiring!.weeks > 104) return 'A hiring plan runs at most 104 weeks.'
    if (next.hiring!.weeks < 13) return 'A hiring plan runs at least 13 weeks.'
    if (next.hiring!.funding && next.hiring!.funding.day < 0) return 'The round closes ' + dateName(board.clock!.origin, board.hiring!.funding!.day) + ', before that first day.'
  }
  if (board.behaviour) return planProblem(board, next)
  return launchOverrun(next)
}

/**
 * The plan's first day moved `wanted` calendar days (a pointer's days, a key, the chat): snapped (planStartBy),
 * then decided by the plan's rules. Refused, it says why and, moving later, the latest first day that fits.
 */
export function movePlanStart(board: Workshop, wanted: number): StartMove {
  if (!board.clock) return { by: 0, next: null, refusal: 'A plan in day numbers starts on day 0. Give it dates to move its first day.' }
  const by = planStartBy(board, wanted)
  if (!by) return { by, next: board, refusal: null }
  const why = startProblem(board, by)
  if (!why) return { by, next: withPlanStart(board, by), refusal: null }
  // The nearest move toward where it was that fits.
  const step = by > 0 ? -1 : 1
  for (let at = by + step; at !== 0; at += step) {
    const snapped = planStartBy(board, at)
    if (snapped !== at || startProblem(board, at)) continue
    return { by, next: null, refusal: why + ' The ' + (by > 0 ? 'latest' : 'earliest') + ' first day that fits is ' + dateName(board.clock.origin, at) + '.' }
  }
  return { by, next: null, refusal: why }
}

/** A hiring plan's last day moved to `weeks`: never before a hire starts or the round closes, 13 to 104 weeks. */
export function planWeeksProblem(board: Workshop, weeks: number): string | null {
  if (!Number.isInteger(weeks) || weeks < 13 || weeks > 104) return 'A hiring plan runs 13 to 104 weeks.'
  const end = weeks * 7
  const times = scheduleLaunch(board)
  const late = board.cards.map(card => ({ card, day: times.get(card.id)!.to })).filter(item => item.day > end).sort((a, b) => b.day - a.day)[0]
  if (late) return late.card.label + ' starts ' + dateName(board.clock!.origin, late.day) + ', after the plan’s last week.'
  const round = board.hiring?.funding
  if (round && round.day > end) return 'The round closes ' + dateName(board.clock!.origin, round.day) + ', after the plan’s last week.'
  return null
}

/** The words a task takes back to the canvas as a note: "Copy · 3 days". */
export function launchTaskText(card: WorkshopCard): string {
  return card.label + ' · ' + days(card.duration ?? 1)
}

export function sampleLaunchPlan(): Workshop {
  return {
    version: 1, kind: 'launch-plan', title: 'Friday launch', launch: { day: 14 },
    lanes: [{ id: 'product', label: 'Product' }, { id: 'engineering', label: 'Engineering' }],
    cards: [
      { id: 'design', label: 'Design', laneId: 'product', duration: 4 },
      { id: 'build', label: 'Build', laneId: 'engineering', duration: 6, dependsOn: ['design'] },
      { id: 'copy', label: 'Copy', laneId: 'product', duration: 2 },
      { id: 'qa', label: 'QA', laneId: 'engineering', duration: 2, dependsOn: ['build'] },
    ],
  }
}

const preset = (by = 'Slatebox') => ({ by, at: '2026-11-21T00:00:00.000Z', via: 'preset' as const })
/** A plan's rules as the library adds them: each on, refusing unless it says warn. */
export function presetRules(rules: Array<Record<string, unknown>>): Workshop['behaviour'] {
  return { version: 1, rev: 0, rules: rules.map((rule, i) => ({ id: 'rule-' + (i + 1), on: true, severity: 'refuse', set: preset(), ...rule }) as never) }
}

/**
 * The library's launch plan: dated from the next Monday, counted in working days, three teams with a
 * Marketing row, launch on the third Friday. Its rules: a hard line and a slip that pushes what waits on it.
 */
export function launchPlanSample(today?: string): Workshop {
  return {
    version: 1, kind: 'launch-plan', title: 'Launch plan', launch: { day: 18 }, clock: { origin: nextMonday(today) },
    lanes: [{ id: 'product', label: 'Product' }, { id: 'engineering', label: 'Engineering' }, { id: 'marketing', label: 'Marketing' }],
    cards: [
      { id: 'design', label: 'Design', laneId: 'product', duration: 4 },
      { id: 'build', label: 'Build', laneId: 'engineering', duration: 6, dependsOn: ['design'] },
      { id: 'qa', label: 'QA', laneId: 'engineering', duration: 2, dependsOn: ['build'] },
      { id: 'copy', label: 'Copy', laneId: 'product', duration: 2 },
      { id: 'post', label: 'Launch post', laneId: 'marketing', duration: 2, dependsOn: ['copy'], lag: 3 },
    ],
    behaviour: presetRules([{ kind: 'workdays' }, { kind: 'deadline', at: 'launch' }, { kind: 'cascade', onConflict: 'push' }]),
  }
}

/** One customer's go-live: two tracks, Us and Customer, toward a go-live date, shared with the customer as a guest. */
export function goLiveSample(today?: string): Workshop {
  return {
    version: 1, kind: 'launch-plan', title: 'Customer go-live', launch: { day: 25, name: 'go-live' }, clock: { origin: nextMonday(today) },
    lanes: [{ id: 'us', label: 'Us' }, { id: 'customer', label: 'Customer' }],
    cards: [
      { id: 'kickoff', label: 'Kickoff', laneId: 'us', duration: 1 },
      { id: 'data', label: 'Send data', laneId: 'customer', duration: 3, dependsOn: ['kickoff'] },
      { id: 'configure', label: 'Configure', laneId: 'us', duration: 5, dependsOn: ['data'] },
      { id: 'security', label: 'Security review', laneId: 'customer', duration: 4, dependsOn: ['kickoff'] },
      { id: 'train', label: 'Train admins', laneId: 'us', duration: 2, dependsOn: ['configure'] },
      { id: 'signoff', label: 'Sign-off', laneId: 'customer', duration: 1, dependsOn: ['train', 'security'] },
    ],
    behaviour: presetRules([{ kind: 'workdays' }, { kind: 'deadline', at: 'launch' }, { kind: 'cascade', onConflict: 'push' }]),
  }
}



/** The launch and hiring plans' shared edits: set_task, link_tasks and unlink_tasks (null for any other). */
export function planEdit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools, said0: (card: WorkshopCard, next: Workshop) => string) {
  switch (edit.kind) {
    case 'set_task': {
      const task = t.card(edit.card)
      const at = { laneId: task.laneId, cardId: task.id }
      if (edit.duration === undefined && edit.lag === undefined) t.refuse('Say how many days ' + said(task.label) + ' takes, or waits.', { ...at, code: 'invalid_edit' })
      const hiring = board.kind === 'hiring-plan'
      let next: Workshop = board
      for (const field of ['duration', 'lag'] as const) {
        const value = edit[field]
        if (value === undefined) continue
        if (!Number.isInteger(value)) t.refuse('A task\'s days are whole days.', at)
        if (!board.behaviour && !hiring) {
          // The built-in line: the range that keeps every task ending by launch.
          const limits = launchPlanLimits(next, { cardId: task.id, field })
          const tried = withTaskValue(next, { cardId: task.id, field }, value)
          if (value < limits.min || value > limits.max) t.refuse(value < limits.min ? limits.reasons.min! : launchOverrun(tried, task.id) ?? limits.reasons.max!, { ...at, limits })
          next = tried
          continue
        }
        const [low, high] = field === 'duration' ? (hiring ? [7, 140] : [1, 60]) : [0, hiring ? 728 : 120]
        if (value < low || value > high) t.refuse(field === 'duration' ? (hiring ? 'Recruiting takes 1 to 20 weeks.' : 'A task takes 1 to 60 days.') : 'That is further out than the plan runs.', at)
        next = withTaskValue(next, { cardId: task.id, field }, value)
      }
      if (cascadeStops(board)) {
        const held = holdOthers(board, next, new Set([task.id]))
        if (typeof held === 'string') t.refuse(held, at)
        next = held as Workshop
      }
      const settled = t.settle(next, task.laneId, task.id)
      return t.done(settled, said0(settled.cards.find(item => item.id === task.id)!, settled), at)
    }
    case 'set_plan_start': {
      if (!board.clock) t.refuse('A plan in day numbers starts on day 0. Give it dates to move its first day.')
      if (!isoTime(edit.start)) t.refuse('Say the first day as a date, such as ' + isoAt(board.clock!.origin, 7) + '.')
      const move = movePlanStart(board, offsetOf(board.clock!.origin, edit.start))
      if (move.refusal) t.refuse(move.refusal)
      const next = t.settle(move.next!)
      const snapped = move.by !== offsetOf(board.clock!.origin, edit.start) ? ' (' + dateName(board.clock!.origin, offsetOf(board.clock!.origin, edit.start)) + (board.kind === 'hiring-plan' ? ' is not a whole week away' : ' is a weekend') + ').' : '.'
      return t.done(next, 'The plan now starts ' + dateName(next.clock!.origin, 0) + snapped)
    }
    case 'set_plan_weeks': {
      if (board.kind !== 'hiring-plan') t.refuse('Only a hiring plan runs a number of weeks; move ' + lineWord(board) + ' instead.')
      const why = planWeeksProblem(board, edit.weeks)
      if (why) t.refuse(why)
      const next = t.settle({ ...board, hiring: { ...board.hiring!, weeks: edit.weeks } })
      return t.done(next, 'The plan now runs ' + edit.weeks + ' weeks, to ' + dateName(board.clock!.origin, edit.weeks * 7 - 1) + '.')
    }
    case 'link_tasks': case 'unlink_tasks': {
      const task = t.card(edit.card), target = t.card(edit.waitsOn)
      const at = { laneId: task.laneId, cardId: task.id }
      if (edit.kind === 'unlink_tasks') {
        if (!task.dependsOn?.includes(target.id)) t.refuse(said(task.label) + ' doesn’t wait on ' + said(target.label) + '.', at)
        return t.done(t.settle(withLink(board, task.id, target.id, true), task.laneId, task.id), said(task.label) + ' no longer waits on ' + said(target.label) + '.', at)
      }
      const why = launchLinkRefusal(board, task.id, target.id)
      if (why) t.refuse(why, at)
      return t.done(t.settle(withLink(board, task.id, target.id), task.laneId, task.id), said(task.label) + ' now waits on ' + said(target.label) + '.', at)
    }
  }
  return null
}

/** The launch plan's part of the one gate (see kinds.ts). */
export const launchPlanRules: BusinessBoardRules = {
  kind: 'launch-plan',
  cards: [12, 'A launch plan holds up to 12 tasks.'],
  rulebook: launchFamily,
  drags: planDrags,
  fixed: planFixed,
  words: planWords,
  readCard(raw, card, read) {
    card.duration = amountOf(raw.duration, 1, 60, 'A task takes 1 to 60 days.')
    if (raw.lag !== undefined && raw.lag !== 0) card.lag = amountOf(raw.lag, 0, 120, 'A task waits 0 days or more, and no later than launch.')
    if (raw.dependsOn !== undefined) {
      if (!Array.isArray(raw.dependsOn)) throw new Error('A task waits on a list of tasks.')
      const ids = raw.dependsOn.map(read.id)
      if (new Set(ids).size !== ids.length) throw new Error('Duplicate dependency.')
      if (ids.length) card.dependsOn = ids
    }
  },
  readBoard(raw, board) {
    const launch = ownField(raw, 'launch', 'A launch plan needs a launch day.')
    board.launch = { day: amountOf(launch.day, 5, 120, 'Launch day is a whole day from 5 to 120.') }
    if (launch.name !== undefined) {
      if (typeof launch.name !== 'string' || !/^[a-z][a-z -]{1,23}$/i.test(launch.name)) throw new Error('Name the line in a word or two, such as go-live.')
      board.launch.name = launch.name.toLowerCase()
    }
    readClock(raw, board)
  },
  validate: validateLaunchPlan,
  planMove: planLaunchPlanMove,
  caption: launchPlanCaption,
  cardText: (_board, card) => card.label + ' · ' + card.duration + 'd',
  noteText: (_board, card) => launchTaskText(card),
  fromNote(_board, text, unnamed) {
    const read = noteNumbers(text, unnamed)
    return { label: read.label, duration: Math.min(60, Math.max(1, read.days ?? 2)) }
  },
  newCard: () => 'task',
  landNote: landPlanNote,
  renamed(_board, cardId, text) {
    const read = renamedNumbers(text)
    return { label: read.label, edits: read.days !== undefined ? [{ kind: 'set_task', card: { id: cardId }, duration: read.days }] : [] }
  },
  edit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools) {
    switch (edit.kind) {
      case 'add_card': {
        const target = t.lane(edit.lane)
        const label = edit.label?.trim() || 'New task'
        const card: WorkshopCard = { id: nextCardId(board), label, laneId: target.id, duration: edit.duration ?? 2 }
        if (edit.lag) card.lag = edit.lag
        const waits = [...new Set((edit.waitsOn ?? []).map(ref => t.card(ref).id))]
        if (waits.length) card.dependsOn = waits
        const next = { ...board, cards: [...board.cards, card] }
        const late = board.behaviour ? null : launchOverrun(next, card.id)
        if (late) t.refuse(late, { laneId: target.id })
        return t.done(t.settle(next, target.id), 'Added ' + said(label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: card.id })
      }
      case 'set_launch_day': {
        const limits = launchPlanLimits(board, { field: 'day' })
        // A weekend is no day for the line where days are working days: later lands on the Monday, earlier on the Friday.
        const day = Number.isInteger(edit.day) && edit.day >= 5 && edit.day <= 120 ? launchDayOn(board, edit.day) : edit.day
        if (!Number.isInteger(day) || day < limits.min || day > limits.max) t.refuse((day < limits.min && launchTooEarly(board, day)) || (day < limits.min ? limits.reasons.min! : limits.reasons.max!), { limits })
        const next = withTaskValue(board, { field: 'day' }, day)
        const weekend = day !== edit.day ? ': ' + dayWords(board, edit.day) + ' is a weekend, and weekends don’t count on this plan.' : '.'
        return t.done(t.settle(next), cap(lineWord(board)) + ' is now ' + dayWords(board, day) + weekend)
      }
    }
    return planEdit(board, edit, t, (card) => said(card.label) + ' now takes ' + days(card.duration!) + (card.lag ? ' and waits ' + days(card.lag) + '.' : '.'))
  },
}
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)

/** A plan's first day, when it has one: a real date. */
export function readClock(raw: Record<string, unknown>, board: Workshop): void {
  if (raw.clock === undefined) return
  const origin = (raw.clock as { origin?: unknown } | null)?.origin
  if (!isoTime(origin)) throw new Error('A plan starts on a real date, written as 2026-12-07.')
  board.clock = { origin: origin as string }
}
registerWorkshopRules(launchPlanRules)
