// The plans' kernel (launch plan and hiring plan): tasks in team rows, each with a length, a lag and the
// tasks it waits on. Starts are never stored: scheduleLaunch derives them. A plan with a clock has real
// dates; with its workdays rule on, lengths and lags count working days (calendar.ts maps them).
import type { Workshop, WorkshopBoardKind, WorkshopCard, WorkshopEditField, WorkshopEditKind, WorkshopEditKindName } from './model'
import { workshopEditKinds, workshopRuleSchema } from './model'
import { clockOf, dateName, dayMap } from './calendar'

/**
 * A plan's own edits, fields, boards and rule keys, added to the one edit table as the plans load, so
 * describeWorkshopEdits, exec's schema and the reducer know them wherever the plans are loaded.
 */
export function extendWorkshopEdits(more: { kinds?: WorkshopEditKind[]; boards?: Partial<Record<WorkshopEditKindName, WorkshopBoardKind[]>>;
  fields?: Partial<Record<WorkshopEditKindName, Record<string, WorkshopEditField>>>; rules?: { kinds: string[]; keys: Record<string, unknown> } }): void {
  const entryOf = (kind: string) => workshopEditKinds.find(item => item.kind === kind)!
  for (const entry of more.kinds ?? []) if (!workshopEditKinds.some(item => item.kind === entry.kind)) workshopEditKinds.push(entry)
  for (const [kind, boards] of Object.entries(more.boards ?? {})) {
    const entry = entryOf(kind)
    for (const board of boards!) if (!entry.boards.includes(board)) { entry.boards.push(board); delete entry.refusals[board] }
  }
  for (const [kind, fields] of Object.entries(more.fields ?? {})) Object.assign(entryOf(kind).fields, fields)
  if (more.rules) {
    workshopRuleSchema.kinds.push(...more.rules.kinds.filter(kind => !workshopRuleSchema.kinds.includes(kind)))
    Object.assign(workshopRuleSchema.keys, more.rules.keys)
  }
}

/** start/end: working-day indices (days, without the workdays rule); from/to: calendar offsets, `to` exclusive. */
export interface TaskTimes { start: number; end: number; slack: number; critical: boolean; from: number; to: number }

/** Each task's start and end, its slack against the plan's finish, whether it is on the critical path, and its dates. */
export function scheduleLaunch(board: Workshop): Map<string, TaskTimes> {
  const byId = new Map(board.cards.map(card => [card.id, card]))
  const times = new Map<string, TaskTimes>()
  const visiting = new Set<string>()
  const forward = (card: WorkshopCard): TaskTimes => {
    const known = times.get(card.id)
    if (known) return known
    if (visiting.has(card.id)) throw new Error('Tasks can\'t wait on each other in a circle.')
    visiting.add(card.id)
    let start = 0
    for (const id of card.dependsOn ?? []) {
      const before = byId.get(id)
      if (!before) throw new Error('A task waits on a task that is not on the plan.')
      start = Math.max(start, forward(before).end)
    }
    start += card.lag ?? 0
    const entry = { start, end: start + (card.duration ?? 1), slack: 0, critical: false, from: 0, to: 0 }
    times.set(card.id, entry)
    visiting.delete(card.id)
    return entry
  }
  board.cards.forEach(forward)
  const finish = Math.max(0, ...[...times.values()].map(t => t.end))
  // Backward pass: the latest each task may end without moving the finish.
  const latest = new Map<string, number>()
  const late = (card: WorkshopCard): number => {
    const known = latest.get(card.id)
    if (known !== undefined) return known
    let end = finish
    for (const other of board.cards) {
      if (!other.dependsOn?.includes(card.id)) continue
      end = Math.min(end, late(other) - (other.duration ?? 1) - (other.lag ?? 0))
    }
    latest.set(card.id, end)
    return end
  }
  const map = dayMap(clockOf(board))
  for (const card of board.cards) {
    const t = times.get(card.id)!
    t.slack = late(card) - t.end
    t.critical = t.slack === 0
    t.from = map.cal(t.start)
    t.to = map.cal(t.end - 1) + 1
  }
  return times
}

/**
 * The waits a task moved anyway breaks: it starts before what it waits on ends (a lag below 0). Each is drawn
 * broken, in red, from the task waited on to the task that starts early.
 */
export function brokenWaits(board: Workshop): { from: string; to: string }[] {
  const times = scheduleLaunch(board)
  const out: { from: string; to: string }[] = []
  for (const card of board.cards) for (const id of card.dependsOn ?? []) {
    if (times.get(card.id)!.start < (times.get(id)?.end ?? 0)) out.push({ from: id, to: card.id })
  }
  return out
}

/** The index the last task ends at. */
export function launchFinish(board: Workshop): number {
  return Math.max(0, ...[...scheduleLaunch(board).values()].map(t => t.end))
}

/** Launch day as a working-day index (the day itself without the workdays rule). */
export const launchIndex = (board: Workshop) => dayMap(clockOf(board)).idx(board.launch?.day ?? 0)

/** "launch", or what this plan calls its line ("go-live"). */
export const lineWord = (board: Workshop) => board.launch?.name ?? 'launch'

/** A calendar day in a person's words: "Thu 17 Dec" on a dated plan, "day 17" otherwise. */
export const dayWords = (board: Workshop, offset: number) => board.clock ? dateName(board.clock.origin, offset) : 'day ' + offset

/** Whether the line is hard: a plan without rules keeps its built-in hard line; with rules, only a deadline rule that refuses. */
export function launchHard(board: Workshop): boolean {
  return !board.behaviour || board.behaviour.rules.some(rule => rule.on && rule.kind === 'deadline' && rule.at === 'launch' && rule.severity === 'refuse')
}

/** Whether a slip stops at the tasks that wait on it (the cascade rule says stop) instead of pushing them. */
export const cascadeStops = (board: Workshop) => Boolean(board.behaviour?.rules.some(rule => rule.on && rule.kind === 'cascade' && rule.onConflict === 'stop'))

/** The step a dragged or typed value takes: a week (5 working days with the workdays rule) under a week snap, else a day. */
export function snapStep(board: Workshop): number {
  const snap = board.behaviour?.rules.find(rule => rule.on && rule.kind === 'snap')
  return snap && snap.kind === 'snap' && snap.unit === 'week' ? (clockOf(board)?.workdays ? 5 : 7) : 1
}

/** Which edge of a task's bar a grip drags: its start (the end stays put) or its end (the start stays put). */
export type TaskEdge = 'start' | 'end'

/** A task's lag and length after one of its edges is dragged; `held` when a bound stopped it (its length, or what it waits on). */
export interface EdgeValues { lag: number; duration: number; held?: 'length' | 'longest' | 'ready' }

/**
 * Where a task's lag and length go when its bar's `edge` is dragged `by` calendar days (a pointer's pixels over
 * a day's width, so a fraction). The edge lands on the nearest day and is read through the plan's calendar:
 * with the workdays rule an end let go on a weekend ends the Friday before, and a start the Monday after.
 * It moves in whole steps of the plan's snap (a week where it snaps to weeks). The end edge keeps the start;
 * the start edge keeps the end (the length takes up the difference). At least one step long (and at most
 * the 60 days a task takes, or a hire's 20 weeks of recruiting), and never starting before what it waits on lets it.
 */
export function edgeValues(board: Workshop, cardId: string, edge: TaskEdge, by: number): EdgeValues {
  const card = board.cards.find(item => item.id === cardId)
  if (!card) throw new Error('That task is no longer on the plan.')
  const t = scheduleLaunch(board).get(cardId)!
  const map = dayMap(clockOf(board)), step = snapStep(board)
  const lag = card.lag ?? 0, duration = card.duration ?? 1
  const steps = (days: number) => Math.round(days / step) * step
  if (edge === 'end') {
    const wanted = steps(map.idx(Math.round(t.to + by)) - t.start), longest = board.kind === 'hiring-plan' ? 140 : 60
    if (wanted > longest) return { lag, duration: Math.floor(longest / step) * step, held: 'longest' }
    return wanted < step ? { lag, duration: step, held: 'length' } : { lag, duration: wanted }
  }
  // Before the plan's first day is before it, whatever the calendar.
  const at = Math.round(t.from + by)
  let move = steps((at < 0 ? at : map.idx(at)) - t.start)
  let held: EdgeValues['held']
  // Never before what it waits on (lag 0, or the lag's remainder in whole steps), never shorter than a step.
  if (lag + move < 0) { move = -Math.floor(lag / step) * step; held = 'ready' }
  if (duration - move < step) { move = Math.floor((duration - step) / step) * step; held = 'length' }
  return { lag: lag + move, duration: duration - move, ...(held && { held }) }
}

/** Every task that waits on `cardId`, directly or through others. */
export function downstreamTasks(board: Workshop, cardId: string): Set<string> {
  const found = new Set<string>()
  const walk = (id: string) => {
    for (const card of board.cards) if (card.dependsOn?.includes(id) && !found.has(card.id)) { found.add(card.id); walk(card.id) }
  }
  walk(cardId)
  return found
}

/**
 * Why this plan does not fit before launch, said about `cardId` when it is the task that
 * runs late, or about the task it pushes past launch. Null when every task ends in time.
 */
export function launchOverrun(board: Workshop, cardId?: string): string | null {
  const day = board.launch?.day ?? 0
  const line = launchIndex(board)
  const times = scheduleLaunch(board)
  const own = cardId ? times.get(cardId) : undefined
  const late = own && own.end > line ? { label: 'That', t: own } : board.cards.map(card => ({ label: card.label, t: times.get(card.id)! }))
    .filter(item => item.t.end > line).sort((a, b) => b.t.end - a.t.end)[0]
  if (!late) return null
  // A dated plan says the last day the task runs (on or past the line); a plan in day numbers, the day it ends.
  if (board.clock) return late.label + ' would run until ' + dayWords(board, late.t.to - 1) + '; ' + lineWord(board) + ' is ' + dayWords(board, day) + '.'
  return (late.label === 'That' ? 'That ends on day ' : 'That pushes ' + late.label + ' to day ') + late.t.end + ', after launch on day ' + day + '.'
}

/** The board with one number of a task (or launch day) set. */
export function withTaskValue(board: Workshop, ref: { cardId?: string; field: 'lag' | 'duration' | 'day' }, value: number): Workshop {
  if (ref.field === 'day') return { ...board, launch: { ...board.launch, day: value } }
  return { ...board, cards: board.cards.map(card => card.id === ref.cardId ? { ...card, [ref.field]: value } : card) }
}

/**
 * The board with `cardId` waiting on `waitsOn` (or, with `remove`, no longer waiting on it). The task keeps
 * its start where the new link allows: its lag becomes what is left between the prerequisites' end and that start.
 */
export function withLink(board: Workshop, cardId: string, waitsOn: string, remove = false): Workshop {
  const times = scheduleLaunch(board)
  return { ...board, cards: board.cards.map(card => {
    if (card.id !== cardId) return card
    const dependsOn = remove ? (card.dependsOn ?? []).filter(id => id !== waitsOn) : [...(card.dependsOn ?? []), waitsOn]
    const ready = Math.max(0, ...dependsOn.map(id => times.get(id)?.end ?? 0))
    const next: WorkshopCard = { ...card, dependsOn, lag: Math.max(0, times.get(card.id)!.start - ready) }
    if (!dependsOn.length) delete next.dependsOn
    if (!next.lag) delete next.lag
    return next
  }) }
}

/**
 * A slip that stops at the tasks waiting on it (cascade: stop): every task not in `moved` keeps the start
 * it had in `before`, its lag taking up the difference. The sentence when one can't: what it waits on
 * would end after it starts.
 */
export function holdOthers(before: Workshop, after: Workshop, moved: Set<string>): Workshop | string {
  const was = scheduleLaunch(before)
  const cards = new Map(after.cards.map(card => [card.id, { ...card }]))
  const ends = new Map<string, number>()
  let stuck: string | null = null
  const visit = (card: WorkshopCard): number => {
    const known = ends.get(card.id)
    if (known !== undefined) return known
    let ready = 0, last: WorkshopCard | undefined
    for (const id of card.dependsOn ?? []) {
      const end = visit(cards.get(id)!)
      if (end > ready) { ready = end; last = cards.get(id) }
    }
    const old = was.get(card.id)
    if (old && !moved.has(card.id)) {
      const lag = old.start - ready
      if (lag < -1e-9 && !stuck) {
        stuck = last!.label + ' would end after ' + card.label + ' starts on ' + dayWords(before, old.from) + '. ' + card.label + ' waits on it, and a slip stops at the tasks that wait on it.'
      }
      if (lag > 1e-9) card.lag = lag
      else delete card.lag
    }
    const end = ready + (card.lag ?? 0) + (card.duration ?? 1)
    ends.set(card.id, end)
    return end
  }
  for (const card of cards.values()) visit(card)
  return stuck ?? { ...after, cards: after.cards.map(card => cards.get(card.id)!) }
}
