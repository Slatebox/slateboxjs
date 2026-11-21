// Launch plan: tasks in team lanes, each with a length in days, a lag and the tasks it waits on.
// Starts are never stored: scheduleLaunch derives them, and every task must end by launch day.
import type { Workshop, WorkshopCard } from './model'
// The rule modules take the model's own helpers from the model, so they share its chunk instead of copying it.
import { registerWorkshopRules, said } from './model'
import type { BusinessBoardRules, BusinessEditTools, WorkshopLimits } from './kinds'
import type { WorkshopEdit } from './edits'
import { amountOf, days, nextCardId, noteNumbers, ownField, renamedNumbers } from './numbers'

export interface TaskTimes { start: number; end: number; slack: number; critical: boolean }

export type { WorkshopLimits } from './kinds'

/** Each task's start and end day, its slack against the plan's finish, and whether it is on the critical path. */
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
    const entry = { start, end: start + (card.duration ?? 1), slack: 0, critical: false }
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
  for (const card of board.cards) {
    const t = times.get(card.id)!
    t.slack = late(card) - t.end
    t.critical = t.slack === 0
  }
  return times
}

/** The day the last task ends. */
export function launchFinish(board: Workshop): number {
  return Math.max(0, ...[...scheduleLaunch(board).values()].map(t => t.end))
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
  const times = scheduleLaunch(board)
  const own = cardId ? times.get(cardId) : undefined
  if (own && own.end > day) return `That ends on day ${own.end}, after launch on day ${day}.`
  const late = board.cards.map(card => ({ card, end: times.get(card.id)!.end })).filter(item => item.end > day)
    .sort((a, b) => b.end - a.end)[0]
  return late ? `That pushes ${late.card.label} to day ${late.end}, after launch on day ${day}.` : null
}

export function validateLaunchPlan(board: Workshop): string | null {
  if (board.lanes.length > 4) return 'A launch plan has 2 to 4 teams.'
  if (board.cards.length < 1 || board.cards.length > 12) return 'A launch plan has 1 to 12 tasks.'
  const day = board.launch?.day
  if (typeof day !== 'number' || !Number.isInteger(day) || day < 5 || day > 120) return 'Launch day is a whole day from 5 to 120.'
  for (const card of board.cards) {
    if (!Number.isInteger(card.duration) || card.duration! < 1 || card.duration! > 60) return 'A task takes 1 to 60 days.'
    if (!Number.isInteger(card.lag ?? 0) || (card.lag ?? 0) < 0 || (card.lag ?? 0) > day) return 'A task waits 0 days or more, and no later than launch.'
    if ((card.dependsOn?.length ?? 0) > 3) return 'A task waits on up to 3 others.'
    if (card.dependsOn?.includes(card.id)) return 'A task can\'t wait on itself.'
  }
  try { scheduleLaunch(board) } catch (error) { return (error as Error).message }
  const finish = launchFinish(board)
  if (finish > day) {
    const times = scheduleLaunch(board)
    const late = board.cards.find(card => times.get(card.id)!.end === finish)!
    return `${late.label} ends on day ${finish}, after launch on day ${day}.`
  }
  return null
}

/** A task changes team. The schedule does not depend on teams, so any team takes it. */
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
  return launchOverrun(withLink(board, cardId, waitsOn), cardId)
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


export function launchPlanCaption(board: Workshop, laneId: string): string {
  const times = scheduleLaunch(board)
  const tasks = board.cards.filter(card => card.laneId === laneId)
  const critical = tasks.filter(card => times.get(card.id)!.critical).length
  return `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'} · ${critical} on the critical path`
}

/** The board with one number of a task (or launch day) set. */
export function withTaskValue(board: Workshop, ref: { cardId?: string; field: 'lag' | 'duration' | 'day' }, value: number): Workshop {
  if (ref.field === 'day') return { ...board, launch: { day: value } }
  return { ...board, cards: board.cards.map(card => card.id === ref.cardId ? { ...card, [ref.field]: value } : card) }
}

/**
 * The legal range of a task's lag or length, or of launch day, with the sentence for each end.
 * Every value in the range keeps every task ending by launch.
 */
export function launchPlanLimits(board: Workshop, ref: { cardId?: string; field: 'lag' | 'duration' | 'day' }): WorkshopLimits {
  const day = board.launch!.day
  if (ref.field === 'day') {
    const times = scheduleLaunch(board)
    const finish = launchFinish(board)
    const last = board.cards.find(card => times.get(card.id)!.end === finish)
    return { field: 'day', min: Math.max(5, finish), max: 120,
      reasons: { min: last ? `${last.label} ends on day ${finish}.` : undefined, max: 'Launch day is at most day 120.' } }
  }
  const card = board.cards.find(item => item.id === ref.cardId)!
  const floor = ref.field === 'duration' ? 1 : 0, top = ref.field === 'duration' ? 60 : day
  let max = card[ref.field] ?? floor
  while (max < top && !launchOverrun(withTaskValue(board, ref, max + 1))) max++
  const over = max < top ? launchOverrun(withTaskValue(board, ref, max + 1), card.id) ?? undefined : undefined
  return { field: ref.field, min: floor, max: Math.max(floor, max),
    reasons: { min: ref.field === 'duration' ? 'A task takes at least 1 day.' : `${card.label} starts as early as it can.`,
      max: over ?? (ref.field === 'duration' ? 'A task takes at most 60 days.' : `Launch is day ${day}.`) } }
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

/** The launch plan's part of the one gate (see kinds.ts). */
export const launchPlanRules: BusinessBoardRules = {
  kind: 'launch-plan',
  cards: [12, 'A launch plan holds up to 12 tasks.'],
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
    board.launch = { day: amountOf(ownField(raw, 'launch', 'A launch plan needs a launch day.').day, 5, 120, 'Launch day is a whole day from 5 to 120.') }
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
        const late = launchOverrun(next, card.id)
        if (late) t.refuse(late, { laneId: target.id })
        return t.done(t.settle(next, target.id), 'Added ' + said(label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: card.id })
      }
      case 'set_task': {
        const task = t.card(edit.card)
        const at = { laneId: task.laneId, cardId: task.id }
        if (edit.duration === undefined && edit.lag === undefined) t.refuse('Say how many days ' + said(task.label) + ' takes, or waits.', { ...at, code: 'invalid_edit' })
        let next: Workshop = board
        for (const field of ['duration', 'lag'] as const) {
          const value = edit[field]
          if (value === undefined) continue
          const limits = launchPlanLimits(next, { cardId: task.id, field })
          if (!Number.isInteger(value)) t.refuse('A task\'s days are whole days.', { ...at, limits })
          const tried = withTaskValue(next, { cardId: task.id, field }, value)
          if (value < limits.min || value > limits.max) t.refuse(value < limits.min ? limits.reasons.min! : launchOverrun(tried, task.id) ?? limits.reasons.max!, { ...at, limits })
          next = tried
        }
        const now = next.cards.find(item => item.id === task.id)!
        return t.done(t.settle(next, task.laneId, task.id), said(task.label) + ' now takes ' + days(now.duration!) +
          (now.lag ? ' and waits ' + days(now.lag) + '.' : '.'), at)
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
      case 'set_launch_day': {
        const limits = launchPlanLimits(board, { field: 'day' })
        if (!Number.isInteger(edit.day) || edit.day < limits.min || edit.day > limits.max) {
          const tried = withTaskValue(board, { field: 'day' }, edit.day)
          t.refuse((edit.day < limits.min && launchOverrun(tried)) || (edit.day < limits.min ? limits.reasons.min! : limits.reasons.max!), { limits })
        }
        return t.done(t.settle(withTaskValue(board, { field: 'day' }, edit.day)), 'Launch is now day ' + edit.day + '.')
      }
    }
    return null
  },
}
registerWorkshopRules(launchPlanRules)
