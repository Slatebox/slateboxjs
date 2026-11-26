// Whole saves of a board with rules, for a server (slateboxjs/workshops/rules): a rule change said as the
// rule edits it amounts to, and an earlier board put back. Plain data: the rulebook's own chunk stays small.
import type { Workshop } from './model'
import type { WorkshopEdit, WorkshopRef } from './edits'
import type { Behaviour, BehaviourRule, RuleInput, RuleKindId } from './behaviour'

const bodyKeys: Record<RuleKindId, string[]> = { capacity: ['where', 'max'], path: ['from', 'to', 'noSkip'], gate: ['into', 'needs'], bin: ['lane'],
  deadline: ['at', 'floor'], overlap: ['lane'], snap: ['unit'], workdays: [], blackout: ['start', 'end', 'label'], cascade: ['onConflict'], locked: ['cards'],
  nests: ['role', 'under'], children: ['max', 'role'], depth: ['max'], rank: ['by'], emptyDrop: ['drop'],
  quadrant: ['quadrant', 'max'], parent: ['not'], contains: ['role', 'of', 'atLeast'], sameOwnerAs: ['mode', 'role'],
  tileTypes: ['types'], tileMax: ['type', 'max', 'per'], tileNeeds: ['type', 'atLeast', 'per'], tileSpan: ['type', 'rows', 'cols'] }
/** What set_rule changes on a rule; every other key is fixed under its id. */
const settable = ['max', 'to', 'floor', 'onConflict', 'unit', 'under', 'by', 'drop', 'mode', 'types', 'per', 'atLeast', 'rows', 'cols']
const rulesOf = (board: Pick<Workshop, 'behaviour'>): Behaviour => board.behaviour ?? { version: 1, rev: 0, rules: [] }

/**
 * The rule edits that turn `before`'s rulebook into `after`'s, so a whole-board save that changes the
 * rules is made again by the reducer, with the audit line of whoever saves it: adds, then changes,
 * then removals. Null when the change is not one the edits can make (a rule whose kind or lanes
 * changed under the same id). Lanes are named by id.
 */
export function behaviourEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[] | null {
  const was = rulesOf(before).rules, now = rulesOf(after).rules
  const adds: WorkshopEdit[] = [], sets: WorkshopEdit[] = [], removes: WorkshopEdit[] = []
  const ref = (id: string) => (id === 'any' ? 'any' : { id }) as WorkshopRef
  const fixed = (rule: BehaviourRule) => JSON.stringify(bodyKeys[rule.kind].filter(key => !settable.includes(key)).map(key => [key, (rule as unknown as Record<string, unknown>)[key]]))
  for (const rule of now) {
    const old = was.find(item => item.id === rule.id)
    const body = rule as unknown as Record<string, unknown>
    if (!old) {
      const input: Record<string, unknown> = { kind: rule.kind, ...(rule.severity === 'warn' && { severity: 'warn' }) }
      for (const key of bodyKeys[rule.kind]) {
        if (body[key] === undefined) continue
        input[key] = key === 'to' || key === 'cards' ? (body[key] as string[]).map(ref) : ['where', 'into', 'lane', 'from'].includes(key) ? ref(body[key] as string) : body[key]
      }
      adds.push({ kind: 'add_rule', rule: input as unknown as RuleInput })
      if (!rule.on) sets.push({ kind: 'set_rule', rule: rule.id, on: false })
      continue
    }
    if (old.kind !== rule.kind || fixed(old) !== fixed(rule)) return null
    const change: Record<string, unknown> = {}
    if (old.on !== rule.on) change.on = rule.on
    if (old.severity !== rule.severity) change.severity = rule.severity
    if (rule.kind === 'capacity' && (old as { max: number }).max !== rule.max) change.max = rule.max
    if (rule.kind === 'path') {
      const to = rule.to, had = (old as { to?: string[] }).to
      if (JSON.stringify(to ?? null) !== JSON.stringify(had ?? null)) {
        if (!to) return null
        change.to = to.map(ref)
      }
    }
    for (const key of ['floor', 'onConflict', 'unit', 'under', 'by', 'drop', 'mode', ...(rule.kind === 'capacity' ? [] : ['max'])]) {
      const now0 = (rule as unknown as Record<string, unknown>)[key]
      if (JSON.stringify(now0) !== JSON.stringify((old as unknown as Record<string, unknown>)[key])) change[key] = now0
    }
    if (Object.keys(change).length) sets.push({ kind: 'set_rule', rule: rule.id, ...change } as WorkshopEdit)
  }
  for (const rule of was) if (!now.some(item => item.id === rule.id)) removes.push({ kind: 'remove_rule', rule: rule.id })
  return [...adds, ...sets, ...removes]
}

/**
 * An earlier board put back (Undo): its rules as they were, under a newer revision than either
 * board's, so a drop made under the undone rules is checked again. A rule edit is one undo step.
 */
export function restoreWorkshop(current: Workshop, earlier: Workshop): Workshop {
  if (!current.behaviour && !earlier.behaviour) return earlier
  const rev = Math.max(rulesOf(current).rev, rulesOf(earlier).rev) + 1
  return { ...earlier, behaviour: { ...rulesOf(earlier), rev } }
}

