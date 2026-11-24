// A plan's rules, as data (dragology final.md §3.2–3.3, §4, D2/D3): the line (hard or soft; a launch day,
// or a runway floor), overlap per team, snap, working days, a freeze, how far a slip reaches (push or
// stop) and locked tasks. One check and one sentence per kind, shared by the server, exec's check, the
// edit reducer and the drag's legal range, so a refusal is the same words everywhere. A rule reads a
// task's dates, team and fields, never its words; a new rule never moves a task that is already there.
import type { Behaviour, BehaviourRule, BehaviourVerdict } from './behaviour'
import type { Workshop, WorkshopCard } from './model'
import type { RuleFamily } from './kinds'
import { isoTime, offsetOf, shortDate, weekendAt, clockOf } from './calendar'
import { dayWords, launchIndex, launchOverrun, lineWord, scheduleLaunch, type TaskTimes } from './schedule'
import { runwayMonths, runwayWords } from './runway'
import { workshopFreshOverride, workshopHasMarks, workshopOverrideUndone } from './model'

type Rule = BehaviourRule
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const names = (items: string[]) => items.length > 1 ? items.slice(0, -1).join(', ') + ' and ' + items.at(-1) : items[0] ?? ''
const laneName = (board: Workshop, id?: string) => board.lanes.find(lane => lane.id === id)?.label ?? id ?? ''
const noun = (board: Workshop) => board.kind === 'hiring-plan' ? 'Hires' : 'Tasks'

/** What one rule says: the caption, the refusal's second half, the note's line, the loop's caption. */
export function timeSentence(rule: Rule, board: Workshop): string {
  const warn = rule.severity === 'warn'
  switch (rule.kind) {
    case 'deadline':
      if (rule.at === 'runway') return warn ? 'Runway under ' + rule.floor + ' months is flagged.' : 'Runway stays above ' + rule.floor + ' months.'
      return warn ? cap(lineWord(board)) + ' is a soft line: a task may slip past it, shown in red.'
        : cap(lineWord(board)) + ' is a hard line: every task ends by ' + dayWords(board, board.launch?.day ?? 0) + '.'
    case 'overlap': {
      const where = rule.lane ? laneName(board, rule.lane) : 'a team'
      return warn ? 'Overlapping tasks in ' + where + ' are flagged.' : rule.lane ? where + '’s tasks can’t overlap.' : 'Tasks in a team can’t overlap.'
    }
    case 'snap': return noun(board) + ' snap to whole ' + rule.unit + 's.'
    case 'workdays': return 'Days are working days: weekends don’t count.'
    case 'blackout': {
      const span = shortDate(rule.start) + ' – ' + shortDate(rule.end)
      return warn ? cap(rule.label) + ', ' + span + ', is flagged.' : 'Nothing ships in ' + rule.label + ', ' + span + '.'
    }
    case 'cascade': return 'A slip ' + (rule.onConflict === 'stop' ? 'stops at' : 'pushes') + ' the ' + noun(board).toLowerCase() + ' that wait on it.'
    case 'locked': {
      const locked = rule.cards.map(id => board.cards.find(card => card.id === id)?.label ?? id)
      return names(locked) + (locked.length > 1 ? ' are' : ' is') + ' locked.'
    }
  }
  return ''
}

/** A plan's seven rule kinds. */
export const timeRuleKindIds = ['deadline', 'overlap', 'snap', 'workdays', 'blackout', 'cascade', 'locked'] as const
const order = ['locked', 'cascade', 'blackout', 'overlap', 'snap', 'deadline']
const sameDeps = (a: WorkshopCard, b: WorkshopCard) => (a.dependsOn ?? []).join() === (b.dependsOn ?? []).join()

/**
 * Whether `after` keeps the rules `before` has: one rule named per refusal, in a fixed order; a rule that
 * only warns lets the change land and says its sentence. Only what changed is held to a rule: a task
 * already in a freeze, or two tasks that already overlap, stay as they are until one of them moves.
 */
export function checkTime(before: Workshop, after: Workshop): BehaviourVerdict {
  const rules = (before.behaviour?.rules ?? []).filter(rule => rule.on).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
  const warnings: string[] = []
  if (!rules.length) return { ok: true, warnings }
  // A task moved anyway (the person confirmed it past the rule: edits.ts set_task and move_card with override): the
  // change is theirs, and no rule is asked of it again.
  const marks = workshopHasMarks(before, after)
  if (marks && after.cards.some(card => workshopFreshOverride(before, card))) return { ok: true, warnings }
  // In the dates of `before`: a plan whose first day moved (set_plan_start) is read on the days it had, so a task
  // that keeps its dates has not shifted, and one the new first day moves has.
  const by = before.clock && after.clock ? offsetOf(before.clock.origin, after.clock.origin) : 0
  const was = scheduleLaunch(before), now = by ? new Map([...scheduleLaunch(after)].map(([id, t]) => [id, { ...t, from: t.from + by, to: t.to + by }])) : scheduleLaunch(after)
  const old = new Map(before.cards.map(card => [card.id, card]))
  // A task moved anyway going back to where it was (an Undo) is not held to a rule either.
  const moved = after.cards.filter(card => {
    const o = old.get(card.id)
    if (marks && o && workshopOverrideUndone(before, card)) return false
    return !o || (o.lag ?? 0) !== (card.lag ?? 0) || o.duration !== card.duration || o.laneId !== card.laneId || !sameDeps(o, card)
  })
  const shifted = after.cards.filter(card => {
    const a = now.get(card.id)!, b = was.get(card.id)
    if (marks && b && workshopOverrideUndone(before, card)) return false
    return !b || a.from !== b.from || a.to !== b.to || old.get(card.id)!.laneId !== card.laneId
  })
  const first = moved[0] ?? shifted[0]
  const say = (rule: Rule): string | null => {
    switch (rule.kind) {
      case 'locked':
        for (const card of shifted) if (rule.cards.includes(card.id) && was.has(card.id)) return card.label + ' is locked: it stays on ' + dayWords(before, was.get(card.id)!.from) + '.'
        return null
      case 'cascade': {
        if (rule.onConflict !== 'stop') return null
        const pushed = shifted.find(card => was.has(card.id) && !moved.includes(card))
        return pushed ? 'That would push ' + pushed.label + ', which waits on it. ' + timeSentence(rule, before) : null
      }
      case 'blackout': {
        const clock = clockOf(before)
        if (!clock) return null
        const from = offsetOf(clock.origin, rule.start), to = offsetOf(clock.origin, rule.end)
        const hit = shifted.find(card => {
          const t = now.get(card.id)!
          for (let d = Math.max(Math.floor(t.from), from); d < Math.min(Math.ceil(t.to), to + 1); d++) if (!clock.workdays || !weekendAt(clock.origin, d)) return true
          return false
        })
        return hit ? hit.label + ' would run into ' + rule.label + ' (' + shortDate(rule.start) + ' – ' + shortDate(rule.end) + ').' : null
      }
      case 'overlap': {
        const over = (x: TaskTimes, y: TaskTimes) => x.from < y.to && y.from < x.to
        for (const a of shifted) for (const b of after.cards) {
          if (a === b || a.laneId !== b.laneId || (rule.lane && a.laneId !== rule.lane) || !over(now.get(a.id)!, now.get(b.id)!)) continue
          return a.label + ' and ' + b.label + ' would overlap in ' + laneName(after, a.laneId) + '. ' + timeSentence(rule, before)
        }
        return null
      }
      case 'snap': {
        if (rule.unit !== 'week') return null
        const step = clockOf(before)?.workdays ? 5 : 7
        const off = moved.find(card => {
          const o = old.get(card.id)
          return ((card.lag ?? 0) % step && (!o || (o.lag ?? 0) !== (card.lag ?? 0))) || ((card.duration ?? 0) % step && (!o || o.duration !== card.duration))
        })
        return off ? timeSentence(rule, before) : null
      }
      case 'deadline': {
        if (rule.at === 'runway') {
          const months = runwayMonths(after)
          return months < rule.floor! && months < runwayMonths(before) ? 'That takes runway to ' + runwayWords(months) + '. ' + timeSentence(rule, before) : null
        }
        const line = launchIndex(after), was0 = launchIndex(before)
        const late = after.cards.some(card => {
          const t = now.get(card.id)!, b = was.get(card.id)
          return t.end > line && (!b || b.end <= was0 || t.end > b.end || line < was0)
        })
        return late ? launchOverrun(after, first?.id) : null
      }
    }
    return null
  }
  for (const rule of rules) {
    const sentence = say(rule)
    if (!sentence) continue
    if (rule.severity === 'warn') { warnings.push(sentence); continue }
    return { refused: { sentence, ruleId: rule.id, set: rule.set, cardId: first?.id ?? '', laneId: first?.laneId ?? '' } }
  }
  return { ok: true, warnings }
}

const plainLabel = (value: unknown) => {
  if (typeof value !== 'string' || !value.trim() || value.trim().length > 40 || /[<>\u0000-\u001f]/.test(value)) throw new Error('Name the freeze in plain words, up to 40 letters.')
  return value.trim()
}

/** A plan's family of rule kinds: launch plans take all seven, hiring plans the line (runway), snap, slip and locks. */
export function timeFamily(keys: Record<string, string>): RuleFamily {
  return {
    keys,
    read(rule, base, board, laneId) {
      const extra = Object.keys(rule).find(key => !['id', 'on', 'severity', 'set', 'kind', ...keys[rule.kind as string].split(' ').filter(Boolean)].includes(key))
      if (extra) throw new Error('A ' + rule.kind + ' rule does not take ' + extra + '.')
      const out = { ...base, kind: rule.kind } as Record<string, unknown>
      switch (rule.kind) {
        case 'deadline':
          if (rule.at !== (board.kind === 'hiring-plan' ? 'runway' : 'launch')) throw new Error(board.kind === 'hiring-plan' ? 'A hiring plan’s line is its runway.' : 'A launch plan’s line is launch day.')
          out.at = rule.at
          if (rule.at === 'runway') {
            if (typeof rule.floor !== 'number' || !(rule.floor >= 1 && rule.floor <= 60) || Math.round(rule.floor * 10) !== rule.floor * 10) throw new Error('A runway floor is 1 to 60 months.')
            out.floor = rule.floor
          }
          break
        case 'overlap': if (rule.lane !== undefined) out.lane = laneId(rule.lane); break
        case 'snap':
          if (rule.unit !== 'day' && rule.unit !== 'week') throw new Error('A plan snaps to days or weeks.')
          out.unit = rule.unit
          break
        case 'blackout': {
          if (!isoTime(rule.start) || !isoTime(rule.end) || isoTime(rule.end) < isoTime(rule.start)) throw new Error('A freeze runs from one date to the same or a later one.')
          if (isoTime(rule.end) - isoTime(rule.start) > 92 * 864e5) throw new Error('A freeze lasts up to 3 months.')
          Object.assign(out, { start: rule.start, end: rule.end, label: plainLabel(rule.label) })
          break
        }
        case 'cascade':
          if (rule.onConflict !== 'push' && rule.onConflict !== 'stop') throw new Error('A slip pushes the tasks that wait on it, or stops at them.')
          out.onConflict = rule.onConflict
          break
        case 'locked': {
          if (!Array.isArray(rule.cards) || !rule.cards.length || rule.cards.length > 6) throw new Error('Say which tasks are locked.')
          if (rule.cards.some(id => !board.cards.some(card => card.id === id))) throw new Error('A locked task stays on the plan. Unlock it first.')
          out.cards = [...new Set(rule.cards as string[])]
          break
        }
      }
      return out as unknown as Rule
    },
    sentence: timeSentence,
    contradiction(behaviour: Behaviour, board: Workshop) {
      const seen = new Set<string>()
      let freezes = 0
      for (const rule of behaviour.rules) {
        const key = rule.kind === 'overlap' ? 'overlap:' + (rule.lane ?? '') : rule.kind === 'blackout' ? 'blackout:' + freezes++ : rule.kind === 'locked' ? '' : rule.kind
        if (key && seen.has(key)) return 'There is already a ' + (rule.kind === 'deadline' ? lineWord(board) + ' line' : rule.kind + ' rule') + '. Change that one instead.'
        seen.add(key)
        if (rule.kind === 'locked') for (const id of rule.cards) {
          if (seen.has('locked:' + id)) return laneName({ ...board, lanes: board.cards.map(card => ({ id: card.id, label: card.label })) }, id) + ' is already locked.'
          seen.add('locked:' + id)
        }
      }
      return freezes > 6 ? 'A plan has up to 6 freezes.' : null
    },
    check: checkTime,
    builtIn: board => board.kind === 'launch-plan' && !board.behaviour ? ['Every task ends by ' + lineWord(board) + '.', 'A slip pushes the tasks that wait on it.'] : [],
  }
}

/** The ids of the tasks that end past the line (a soft line draws them in red). */
export function pastTheLine(board: Workshop): Set<string> {
  if (board.kind !== 'launch-plan') return new Set()
  const line = launchIndex(board)
  return new Set([...scheduleLaunch(board)].filter(([, t]) => t.end > line).map(([id]) => id))
}
