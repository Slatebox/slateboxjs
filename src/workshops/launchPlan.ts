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
import { dayFromWords, isoTime, nextMonday, isoAt } from './calendar'
import { extendWorkshopEdits, cascadeStops, dayWords, downstreamTasks, holdOthers, launchFinish, launchHard, launchIndex, launchOverrun, lineWord, scheduleLaunch, snapStep, withLink, withTaskValue } from './schedule'
import { checkTime, timeFamily } from './timeRules'

export * from './schedule'
export type { WorkshopLimits } from './kinds'

/** The rule kinds a launch plan takes, with add_rule's body keys. */
const launchFamily = timeFamily({ deadline: 'at', overlap: 'lane', snap: 'unit', workdays: '', blackout: 'start end label', cascade: 'onConflict', locked: 'cards' })

const ref = { anyOf: [{ type: 'string', minLength: 1, maxLength: 200 }, { type: 'object', additionalProperties: false, required: ['id'], properties: { id: { type: 'string', minLength: 1, maxLength: 64 } } }] }
const iso = { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' }
// The plans take rules: add_rule's kinds and keys, and set_rule's floor, slip and snap.
extendWorkshopEdits({
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
 * What a whole-board save may not change on a plan, because no edit does: its first day (moving it would
 * slide every task past its locks and freezes), what it calls its line, a hiring plan's cash, burn,
 * currency, weeks, the round's size and its bands (a band's cost and the round's day have their edits,
 * and answer to the rules). Rules change on their own, never in the save that moves a task.
 */
export function planFixed(before: Workshop, after: Workshop): string | null {
  const say = JSON.stringify
  if (say(before.clock) !== say(after.clock)) return 'A plan keeps its first day. Move tasks, or launch, instead.'
  if (before.launch?.name !== after.launch?.name) return 'A plan keeps what it calls its line.'
  const money = (board: Workshop) => { const h = board.hiring; return say(h && [h.cash, h.burn, h.currency, h.weeks, h.funding?.amount, h.bands.map(band => [band.id, band.label, band.lane])]) }
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

/** A plan's words for the chat (kinds.ts PlanWords): dates on this plan. */
export const planWords: PlanWords = {
  day: (board, text, after = 0) => board.clock ? dayFromWords(board.clock.origin, text, after) : null,
  iso: (board, day) => isoAt(board.clock!.origin, day),
  name: (board, day) => dayWords(board, day),
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
  fromNote(_board, text) {
    const read = noteNumbers(text)
    return typeof read === 'string' ? read : { label: read.label, duration: Math.min(60, Math.max(1, read.days ?? 2)) }
  },
  renamed(_board, cardId, text) {
    const read = renamedNumbers(text)
    return { label: read.label, edits: read.days !== undefined ? [{ kind: 'set_task', card: { id: cardId }, duration: read.days }] : [] }
  },
  edit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools) {
    switch (edit.kind) {
      case 'add_card': {
        const target = t.lane(edit.lane)
        const label = edit.label?.trim()
        if (!label) t.refuse('Say what the card should say, such as “Add Docs to ' + target.label + '”.', { laneId: target.id })
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
        if (!Number.isInteger(edit.day) || edit.day < limits.min || edit.day > limits.max) {
          const tried = withTaskValue(board, { field: 'day' }, edit.day)
          t.refuse((edit.day < limits.min && launchOverrun(tried)) || (edit.day < limits.min ? limits.reasons.min! : limits.reasons.max!), { limits })
        }
        const next = withTaskValue(board, { field: 'day' }, edit.day)
        return t.done(t.settle(next), cap(lineWord(board)) + ' is now ' + dayWords(board, edit.day) + '.')
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
