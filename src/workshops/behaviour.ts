// How a board behaves, as data: the rulebook (dragology final.md §4, slice D1).
//
// A board's rules live on the board (`workshop.behaviour`) and are read by the one gate,
// validateWorkshop. Each rule kind is one entry of a small registry: a pure `check` over a card's
// move (the server, exec's check_move, the edit reducer and the drag's candidate filter all ask
// the same function) and a `sentence` that is the caption, the refusal, the line of the
// "How this board behaves" note and the library loop's caption. Sentences are generated, never
// stored, so they cannot drift from what the rule does.
//
// D1 rule kinds, for lane boards and the sales pipeline: capacity, path, gate and bin. A rule never
// reads a card's words (no content refusals): a gate asks for a structured field the board has.
// A new rule never moves what is already on the board: a lane over its new limit shows "3 of 2"
// and refuses only the next arrival.
import type { Workshop, WorkshopCard, WorkshopLane, WorkshopNoteStyle } from './model'
import type { NodeJSON } from '../core/Serialization'
// The model's own helpers, from the model's chunk (this module is slateboxjs/workshops/behaviour, loaded on demand).
import { DEFAULT_NOTE_STYLE, registerRulebook, roundedBox, validateWorkshop, workshopCandidate, workshopReferences, workshopRefusal, workshopRules, workshopRulesLoaded, said, type BusinessBoardKind } from './model'
import type { WorkshopEdit, WorkshopRef } from './edits'
import type { BusinessEditStep, BusinessEditTools } from './kinds'
import type { WorkshopFinder } from './names'

export type RuleKindId = 'capacity' | 'path' | 'gate' | 'bin' | TimeRuleKindId | NestRuleKindId
export const ruleKindIds: readonly RuleKindId[] = ['capacity', 'path', 'gate', 'bin']
/** A plan's rule kinds (timeRules.ts, with the plans' rules): a launch plan's and a hiring plan's. */
export type TimeRuleKindId = 'deadline' | 'overlap' | 'snap' | 'workdays' | 'blackout' | 'cascade' | 'locked'
/** A nest board's rule kinds (nest.ts): what sits under what, how many, how deep, how piles rank, where a far drop goes. */
export type NestRuleKindId = 'nests' | 'children' | 'depth' | 'rank' | 'emptyDrop'

/** Who set a rule, when, and from where. Shown when a refusal is explained. */
export interface RuleAudit { by: string; at: string; via: 'chat' | 'exec' | 'preset' }

export type RuleBody =
  | { kind: 'capacity'; where: string; max: number }
  | { kind: 'path'; from: string; to?: string[]; noSkip?: boolean }
  | { kind: 'gate'; into: string; needs: string[] }
  | { kind: 'bin'; lane: string }
  // A plan's (launch or hiring): the line, overlap per team, snap, working days, a freeze, a slip's reach, a locked task.
  | { kind: 'deadline'; at: 'launch' | 'runway'; floor?: number }
  | { kind: 'overlap'; lane?: string }
  | { kind: 'snap'; unit: 'day' | 'week' }
  | { kind: 'workdays' }
  | { kind: 'blackout'; start: string; end: string; label: string }
  | { kind: 'cascade'; onConflict: 'push' | 'stop' }
  | { kind: 'locked'; cards: string[] }
  // A nest board's: a role sits only under these roles; a card (of a role) holds at most max; cards nest max deep;
  // piles rank by a measure; a card let go in empty space starts a new pile or goes to the tray.
  | { kind: 'nests'; role: string; under: string[] }
  | { kind: 'children'; max: number; role?: string }
  | { kind: 'depth'; max: number }
  | { kind: 'rank'; by: string }
  | { kind: 'emptyDrop'; drop: 'new-pile' | 'unsorted' }

export type BehaviourRule = RuleBody & { id: string; on: boolean; severity: 'refuse' | 'warn'; set: RuleAudit }

export interface Behaviour {
  version: 1
  /** Bumped by every rule edit; a drop made under an older revision is checked again under this one. */
  rev: number
  rules: BehaviourRule[]
}

export const maxBehaviourRules = 12

/** The structured fields a gate may ask for, by board. A plain lane board's cards carry none yet. */
const gateFields: Record<string, { id: string; noun: string }[]> = { pipeline: [{ id: 'amount', noun: 'an amount' }] }
const fieldNoun = (id: string) => Object.values(gateFields).flat().find(field => field.id === id)?.noun ?? id
const textFields = new Set(['label', 'text', 'title', 'name', 'words'])

type Family = 'lanes' | 'pipeline' | 'time' | null
/** A board kind's own rule kinds (a plan's), from its rules module. */
const own = (board: Pick<Workshop, 'kind'>) => workshopRulesLoaded(board.kind) ? workshopRules(board.kind as BusinessBoardKind).rulebook : undefined
/** Which boards take rules: lane boards, the sales pipeline and the plans (null for every other). */
export function behaviourFamily(board: Pick<Workshop, 'kind' | 'lanes' | 'experience'>): Family {
  if (board.kind === 'pipeline') return 'pipeline'
  if (own(board)) return 'time'
  if (board.kind || board.experience || board.lanes.some(lane => lane.station)) return null
  return 'lanes'
}

export const emptyBehaviour = (): Behaviour => ({ version: 1, rev: 0, rules: [] })
/** The board's rulebook, or an empty one. */
export function behaviourOf(board: Pick<Workshop, 'behaviour'>): Behaviour {
  return board.behaviour ?? emptyBehaviour()
}

function record(value: unknown, what: string): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error(what)
  return value as Record<string, unknown>
}
const slug = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/

/**
 * Read a stored or proposed rulebook for this board: only declared rule kinds, lanes that exist,
 * fields the board has, at most 12 rules, no contradictions. Throws the sentence a person is given.
 */
export function validateBehaviour(input: unknown, board: Workshop): Behaviour {
  const raw = record(input, 'Unsupported behaviour version.')
  if (raw.version !== 1) throw new Error('Unsupported behaviour version.')
  const family = behaviourFamily(board)
  if (!family) throw new Error('Only lane boards and pipelines take rules for now.')
  if (typeof raw.rev !== 'number' || !Number.isInteger(raw.rev) || raw.rev < 0 || raw.rev > 1e9) throw new Error('A rulebook needs a whole revision number.')
  if (!Array.isArray(raw.rules)) throw new Error('A rulebook needs a list of rules.')
  if (raw.rules.length > maxBehaviourRules) throw new Error('A board has up to 12 rules.')
  const laneId = (value: unknown) => {
    if (typeof value !== 'string' || !board.lanes.some(lane => lane.id === value)) throw new Error('That rule names a lane that is no longer on the board.')
    return value
  }
  const rules = raw.rules.map(item => {
    const rule = record(item, 'A rule is an object.')
    if (typeof rule.id !== 'string' || !slug.test(rule.id)) throw new Error('Rule IDs must be short alphanumeric slugs.')
    if (typeof rule.on !== 'boolean') throw new Error('Say whether the rule is on.')
    if (rule.severity !== 'refuse' && rule.severity !== 'warn') throw new Error('A rule refuses or warns.')
    const set = record(rule.set, 'A rule says who set it.')
    if (typeof set.by !== 'string' || set.by.length > 80 || typeof set.at !== 'string' || set.at.length > 40 ||
      !['chat', 'exec', 'preset'].includes(set.via as string)) throw new Error('A rule says who set it, when and how.')
    const base = { id: rule.id, on: rule.on, severity: rule.severity as 'refuse' | 'warn', set: { by: set.by, at: set.at, via: set.via as RuleAudit['via'] } }
    const plan = own(board)
    if (plan) {
      if (plan.keys[rule.kind as string] === undefined) throw new Error('This board does not know the rule ' + String(rule.kind) + '.')
      return plan.read(rule, base, board, laneId)
    }
    const known = (keys: string[]) => {
      const extra = Object.keys(rule).find(key => !['id', 'on', 'severity', 'set', 'kind', ...keys].includes(key))
      if (extra) throw new Error('A ' + rule.kind + ' rule does not take ' + extra + '.')
    }
    switch (rule.kind) {
      case 'capacity': {
        known(['where', 'max'])
        if (typeof rule.max !== 'number' || !Number.isInteger(rule.max) || rule.max < 1 || rule.max > 24) throw new Error('A lane can hold from 1 to 24 cards.')
        return { ...base, kind: 'capacity' as const, where: laneId(rule.where), max: rule.max }
      }
      case 'path': {
        known(['from', 'to', 'noSkip'])
        const from = rule.from === 'any' ? 'any' : laneId(rule.from)
        const out: BehaviourRule = { ...base, kind: 'path', from }
        if (rule.noSkip !== undefined) {
          if (rule.noSkip !== true) throw new Error('noSkip is true or left out.')
          out.noSkip = true
        }
        if (rule.to !== undefined) {
          if (!Array.isArray(rule.to) || rule.to.length < 1 || rule.to.length > 4) throw new Error('Say where cards in ' + labelOf(board, from) + ' may go.')
          out.to = rule.to.map(laneId)
          if (new Set(out.to).size !== out.to.length) throw new Error('Name each lane once.')
          if (out.to.includes(from)) throw new Error('A path leads to another lane.')
        }
        if (!out.to && !out.noSkip) throw new Error('Say where cards in ' + labelOf(board, from) + ' may go.')
        if (from === 'any' && out.to) throw new Error('A path from any lane is one lane at a time; name a lane to send cards somewhere.')
        return out
      }
      case 'gate': {
        known(['into', 'needs'])
        if (!Array.isArray(rule.needs) || rule.needs.length < 1 || rule.needs.length > 3 || rule.needs.some(need => typeof need !== 'string')) {
          throw new Error('Say which field the lane asks for.')
        }
        const needs = rule.needs as string[]
        if (needs.some(need => textFields.has(need))) throw new Error('A rule reads a card’s fields, never its words.')
        const own = gateFields[family] ?? []
        const missing = needs.find(need => !own.some(field => field.id === need))
        if (missing) throw new Error('Cards on this board carry no ' + fieldNoun(missing).replace(/^an? /, '') + ', so a lane can’t ask for one.')
        return { ...base, kind: 'gate' as const, into: laneId(rule.into), needs: [...needs] }
      }
      case 'bin': {
        known(['lane'])
        return { ...base, kind: 'bin' as const, lane: laneId(rule.lane) }
      }
    }
    throw new Error('This board does not know the rule ' + String(rule.kind) + '.')
  })
  if (new Set(rules.map(rule => rule.id)).size !== rules.length) throw new Error('Duplicate rule ID.')
  const behaviour: Behaviour = { version: 1, rev: raw.rev, rules }
  const problem = behaviourContradiction(behaviour, board)
  if (problem) throw new Error(problem)
  return behaviour
}

function labelOf(board: Pick<Workshop, 'lanes'>, id: string) {
  return id === 'any' ? 'any lane' : board.lanes.find(lane => lane.id === id)?.label ?? id
}

/** A rulebook that contradicts itself, as a sentence; null when it holds together. */
export function behaviourContradiction(behaviour: Behaviour, board: Workshop): string | null {
  const plan = own(board)
  if (plan) return plan.contradiction(behaviour, board)
  const bins = new Set(behaviour.rules.filter(rule => rule.kind === 'bin').map(rule => (rule as { lane: string }).lane))
  const seen = new Map<string, string>()
  for (const rule of behaviour.rules) {
    let key = '', sentence = ''
    if (rule.kind === 'capacity') {
      if (bins.has(rule.where)) return labelOf(board, rule.where) + ' archives cards, so it takes every card.'
      if (rule.where && board.lanes.find(lane => lane.id === rule.where)?.capacity !== undefined) {
        return labelOf(board, rule.where) + ' already has a limit. Change it instead.'
      }
      key = 'capacity:' + rule.where; sentence = labelOf(board, rule.where) + ' already has a limit. Change it instead.'
    } else if (rule.kind === 'path') {
      key = 'path:' + rule.from; sentence = 'There is already a rule for cards leaving ' + labelOf(board, rule.from) + '. Change that one instead.'
    } else if (rule.kind === 'gate') {
      if (bins.has(rule.into)) return labelOf(board, rule.into) + ' archives cards, so it takes every card.'
      key = 'gate:' + rule.into; sentence = labelOf(board, rule.into) + ' already asks for something. Change that rule instead.'
    } else {
      const lane = (rule as { lane: string }).lane
      key = 'bin:' + lane; sentence = labelOf(board, lane) + ' already archives cards.'
    }
    if (seen.has(key)) return sentence
    seen.set(key, rule.id)
  }
  // A path to a lane a one-lane rule never lets a card reach from there: cards in that lane could go
  // only to a bin. Rules that are off, or that only warn, never contradict (they let the card land).
  const live = behaviour.rules.filter(rule => rule.on && rule.severity === 'refuse')
  const order = board.lanes.map(lane => lane.id)
  for (const rule of live) if (rule.kind === 'path') for (const target of rule.to ?? []) {
    if (Math.abs(order.indexOf(target) - order.indexOf(rule.from)) > 1 && !live.some(other => other.kind === 'bin' && other.lane === target) &&
      live.some(other => other.kind === 'path' && (other.from === 'any' || other.from === rule.from) && (other.noSkip || !other.to))) {
      return 'Cards move one lane at a time, so cards in ' + labelOf(board, rule.from) + ' could never reach ' + labelOf(board, target) + '.'
    }
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// The registry: one check and one sentence per kind.

interface Move { card: WorkshopCard; from: string | null; to: string }
type Check = { sentence: string } | null

const plural = (n: number, one: string) => n + ' ' + one + (n === 1 ? '' : 's')

/** The lane limits a board has without a rulebook entry (a lane's own capacity), said as rules. */
function laneLimits(board: Workshop): { lane: WorkshopLane; max: number }[] {
  if (!behaviourFamily(board)) return []
  const ruled = new Set(behaviourOf(board).rules.filter(rule => rule.kind === 'capacity').map(rule => (rule as { where: string }).where))
  return board.lanes.filter(lane => lane.capacity !== undefined && !ruled.has(lane.id)).map(lane => ({ lane, max: lane.capacity! }))
}

const registry: Record<string, {
  sentence(rule: BehaviourRule, board: Workshop): string
  check(rule: BehaviourRule, before: Workshop, after: Workshop, move: Move): Check
}> = {
  capacity: {
    sentence: (rule, board) => labelOf(board, (rule as { where: string }).where) + ' holds ' + (rule as { max: number }).max + '.',
    check(rule, before, after, move) {
      const { where, max } = rule as { where: string; max: number }
      if (move.to !== where || move.from === where) return null
      const had = before.cards.filter(card => card.laneId === where).length
      const now = after.cards.filter(card => card.laneId === where).length
      return now > max && now > had ? { sentence: labelOf(before, where) + ' holds ' + max + '. It has ' + had + '.' } : null
    },
  },
  path: {
    sentence(rule, board) {
      const { from, to, noSkip } = rule as { from: string; to?: string[]; noSkip?: boolean }
      if (!to) return 'Cards move one lane at a time.'
      const names = to.map(id => labelOf(board, id))
      const list = names.length > 1 ? names.slice(0, -1).join(', ') + ' or ' + names.at(-1) : names[0]
      return 'From ' + labelOf(board, from) + ', cards go only to ' + list + '.' + (noSkip ? ' One lane at a time.' : '')
    },
    check(rule, before, _after, move) {
      const { from, to, noSkip } = rule as { from: string; to?: string[]; noSkip?: boolean }
      if (move.from === null || move.from === move.to || (from !== 'any' && from !== move.from)) return null
      if (to && !to.includes(move.to)) return { sentence: registry.path.sentence(rule, before) }
      if (noSkip || !to) {
        const order = before.lanes.map(lane => lane.id)
        const here = order.indexOf(move.from), there = order.indexOf(move.to)
        if (Math.abs(there - here) > 1) {
          const step = before.lanes[here + Math.sign(there - here)]
          return { sentence: 'Cards move one lane at a time. ' + move.card.label + ' is in ' + labelOf(before, move.from) + ', so ' + step.label + ' comes first.' }
        }
      }
      return null
    },
  },
  gate: {
    sentence: (rule, board) => labelOf(board, (rule as { into: string }).into) + ' needs ' + (rule as { needs: string[] }).needs.map(fieldNoun).join(' and ') + '.',
    check(rule, before, _after, move) {
      const { into, needs } = rule as { into: string; needs: string[] }
      if (move.to !== into || move.from === into) return null
      const missing = needs.find(need => (move.card as unknown as Record<string, unknown>)[need] === undefined)
      return missing ? { sentence: labelOf(before, into) + ' needs ' + fieldNoun(missing) + '. ' + move.card.label + ' has none.' } : null
    },
  },
  bin: {
    sentence: (rule, board) => labelOf(board, (rule as { lane: string }).lane) + ' archives cards: they stay on the board, never deleted.',
    check: () => null,
  },
}

/** The fixed priority: one rule is named per refusal. */
const priority: RuleKindId[] = ['path', 'gate', 'capacity', 'bin']
const ordered = (rules: BehaviourRule[]) => priority.flatMap(kind => rules.filter(rule => rule.kind === kind))

/** A rule's sentence: its caption, its line in the note, and the loop's caption in the library. */
export function ruleSentence(rule: BehaviourRule, board: Workshop): string {
  const plan = own(board)
  if (plan) return plan.sentence(rule, board)
  const said = registry[rule.kind].sentence(rule, board)
  return rule.severity === 'warn' ? said.replace(/\.$/, ' (a warning only).') : said
}

/** What a board's built-in rules say (they are its kind's, not the rulebook's: D2 ports them). */
function builtIn(board: Workshop): string[] {
  return own(board)?.builtIn(board) ?? (board.kind === 'pipeline' ? ['Deals move one stage at a time.', 'A won deal needs an amount.'] : [])
}

/** The lines of the "How this board behaves" note: built-in rules, lane limits, then the rulebook's rules that are on. */
export function behaviourLines(board: Workshop): string[] {
  if (!behaviourFamily(board)) return []
  return [...builtIn(board), ...laneLimits(board).map(({ lane, max }) => lane.label + ' holds ' + max + '.'),
    ...behaviourOf(board).rules.filter(rule => rule.on).map(rule => ruleSentence(rule, board))]
}

/** The limit a lane shows in its caption ("3 of 2"): its rule's, or its own capacity. */
export function behaviourLaneLimit(board: Workshop, laneId: string): number | undefined {
  const rule = behaviourOf(board).rules.find(item => item.on && item.kind === 'capacity' && item.where === laneId) as { max: number } | undefined
  return rule?.max ?? board.lanes.find(lane => lane.id === laneId)?.capacity
}

export type BehaviourVerdict =
  | { ok: true; warnings: string[] }
  | { refused: { sentence: string; ruleId: string; set: RuleAudit; cardId: string; laneId: string } }

/**
 * The one check: whether `after` keeps this board's rules for every card that arrived in a lane
 * (moved there, or new). The rules are the board's as it was (`before`): a save that brings other
 * rules is a rule edit, checked on its own (checkWorkshopReplacement), never a way round them. A bin
 * takes any card, and never loses one: a card in a bin may become a note, but it is not deleted.
 * A `warn` rule lets the card land and says its sentence.
 */
export function checkBehaviour(before: Workshop, after: Workshop): BehaviourVerdict {
  const plan = own(before)
  if (plan) return plan.check(before, after)
  const rules = ordered(behaviourOf(before).rules.filter(rule => rule.on))
  const warnings: string[] = []
  if (!rules.length) return { ok: true, warnings }
  const binOf = (laneId: string) => rules.find(rule => rule.kind === 'bin' && rule.lane === laneId)
  for (const card of before.cards) {
    const bin = binOf(card.laneId)
    if (!bin || after.cards.some(item => item.id === card.id)) continue
    const sentence = registry.bin.sentence(bin, before)
    if (bin.severity === 'refuse') return { refused: { sentence, ruleId: bin.id, set: bin.set, cardId: card.id, laneId: card.laneId } }
    warnings.push(sentence)
  }
  const was = new Map(before.cards.map(card => [card.id, card.laneId]))
  for (const card of after.cards) {
    const from = was.get(card.id) ?? null
    if (from === card.laneId || binOf(card.laneId)) continue
    const move = { card, from, to: card.laneId }
    for (const rule of rules) {
      const found = registry[rule.kind].check(rule, before, after, move)
      if (!found) continue
      if (rule.severity === 'warn') { warnings.push(found.sentence); continue }
      return { refused: { sentence: found.sentence, ruleId: rule.id, set: rule.set, cardId: card.id, laneId: card.laneId } }
    }
  }
  return { ok: true, warnings }
}

/** What changed between two rulebooks, as the chat's diff preview says it, and what already breaks the new rules. */
export function behaviourDiff(before: Workshop, after: Workshop): { from: number; to: number; lines: string[]; over: string[] } {
  const was = behaviourOf(before), now = behaviourOf(after)
  const lines: string[] = []
  const say = (rule: BehaviourRule, board: Workshop) => ruleSentence(rule, board) + (rule.on ? '' : ' (off)')
  for (const rule of now.rules) {
    const old = was.rules.find(item => item.id === rule.id)
    if (!old) lines.push('+ ' + say(rule, after))
    else if (say(old, before) !== say(rule, after)) lines.push('~ ' + say(old, before) + ' → ' + say(rule, after))
  }
  for (const rule of was.rules) if (!now.rules.some(item => item.id === rule.id)) lines.push('- ' + say(rule, before))
  const over = after.lanes.flatMap(lane => {
    const limit = behaviourLaneLimit(after, lane.id)
    const held = after.cards.filter(card => card.laneId === lane.id).length
    return limit !== undefined && held > limit ? [lane.label + ' shows ' + held + ' of ' + limit + '.'] : []
  })
  return { from: was.rev, to: now.rev, lines, over }
}

/** The input of add_rule: a rule body, with lanes by id or name (resolved by the reducer), and an optional severity. */
export type RuleInput = RuleBody & { severity?: 'refuse' | 'warn' }

/** The keys of each kind's body: what add_rule takes besides its kind and severity. */
const bodyKeys: Record<string, string> = { capacity: 'where max', path: 'from to noSkip', gate: 'into needs', bin: 'lane' }

/** A rule id not yet on the board. */
export function nextRuleId(behaviour: Behaviour): string {
  let n = 1
  while (behaviour.rules.some(rule => rule.id === 'rule-' + n)) n++
  return 'rule-' + n
}

/** The rulebook without the rules that name a lane (a lane removed takes its rules with it). */
export function dropLaneRules(behaviour: Behaviour, laneId: string): Behaviour {
  const rules = behaviour.rules.flatMap(rule => {
    if (rule.kind === 'capacity' && rule.where === laneId) return []
    if (rule.kind === 'gate' && rule.into === laneId) return []
    if (rule.kind === 'bin' && rule.lane === laneId) return []
    if (rule.kind === 'path') {
      if (rule.from === laneId) return []
      if (rule.to?.includes(laneId)) {
        const to = rule.to.filter(id => id !== laneId)
        return to.length ? [{ ...rule, to }] : []
      }
    }
    return [rule]
  })
  return rules.length === behaviour.rules.length ? behaviour : { ...behaviour, rev: behaviour.rev + 1, rules }
}

type RuleTools = Pick<BusinessEditTools, 'lane' | 'card' | 'refuse' | 'done'>

/** add_rule, set_rule and remove_rule: one rule at a time, the revision bumped, the audit line kept. */
export function applyRuleEdit(board: Workshop, edit: WorkshopEdit, audit: RuleAudit, t: RuleTools): BusinessEditStep {
  if (edit.kind !== 'add_rule' && edit.kind !== 'set_rule' && edit.kind !== 'remove_rule') return t.refuse('That is not a rule edit.', { code: 'invalid_edit' })
  const before = behaviourOf(board)
  const settle = (behaviour: Behaviour, sentence: string) => {
    let read: Behaviour
    try { read = validateBehaviour(behaviour, board) } catch (error) { return t.refuse(error instanceof Error ? error.message : String(error)) }
    return t.done({ ...board, behaviour: read }, sentence)
  }
  const find = (ref: string) => before.rules.find(item => item.id === ref) ??
    t.refuse('There is no rule ' + said(ref) + ' on this board.', { code: 'unknown_reference' })
  const lane = (ref: unknown) => {
    if (ref === 'any') return 'any'
    if (typeof ref !== 'string' && !(ref && typeof ref === 'object')) return t.refuse('Name the lane the rule is about.', { code: 'invalid_edit' })
    return t.lane(ref as WorkshopRef).id
  }
  if (edit.kind === 'remove_rule') {
    const gone = find(edit.rule)
    return settle({ ...before, rev: before.rev + 1, rules: before.rules.filter(rule => rule !== gone) }, 'Removed the rule: ' + ruleSentence(gone, board))
  }
  if (edit.kind === 'set_rule') {
    const rule = { ...find(edit.rule), set: audit } as BehaviourRule
    if (edit.on !== undefined) rule.on = edit.on
    if (edit.severity !== undefined) rule.severity = edit.severity
    if (edit.max !== undefined) {
      if (rule.kind !== 'capacity') return t.refuse('Only a lane limit takes a number.')
      rule.max = edit.max
    }
    if (edit.to !== undefined) {
      if (rule.kind !== 'path') return t.refuse('Only a path rule says where cards go.')
      rule.to = edit.to.map(lane)
    }
    // A plan's rule: the line's floor, a slip's reach, the snap.
    for (const key of ['floor', 'onConflict', 'unit'] as const) if (edit[key] !== undefined) {
      if (!(key in rule)) return t.refuse('That rule does not take ' + key + '.')
      ;(rule as Record<string, unknown>)[key] = edit[key]
    }
    return settle({ ...before, rev: before.rev + 1, rules: before.rules.map(item => item.id === rule.id ? rule : item) },
      rule.on ? 'The rule now says: ' + ruleSentence(rule, board) : 'Turned off: ' + ruleSentence(rule, board))
  }
  const input = edit.rule as unknown as Record<string, unknown>
  const keys = own(board)?.keys ?? bodyKeys
  if (keys[input.kind as string] === undefined) return t.refuse('This board does not know the rule ' + String(input.kind) + '.', { code: 'invalid_edit' })
  // A rule's body only: its id, whether it is on and who set it are the board's to keep (the audit line is this edit's).
  const extra = Object.keys(input).find(key => !('kind severity ' + keys[input.kind as string]).split(' ').includes(key))
  if (extra) return t.refuse('A ' + String(input.kind) + ' rule does not take ' + extra + '.', { code: 'invalid_edit' })
  const rule: Record<string, unknown> = { id: nextRuleId(before), kind: input.kind, on: true, severity: input.severity ?? 'refuse', set: audit }
  for (const [key, value] of Object.entries(input)) {
    if (key === 'kind' || key === 'severity') continue
    rule[key] = key === 'where' || key === 'into' || key === 'lane' || key === 'from' ? lane(value) : key === 'to' && Array.isArray(value) ? value.map(lane)
      : key === 'cards' && Array.isArray(value) ? value.map(ref => t.card(ref).id) : value
  }
  return settle({ ...before, rev: before.rev + 1, rules: [...before.rules, rule as unknown as BehaviourRule] }, 'New rule: ' + ruleSentence(rule as unknown as BehaviourRule, board))
}

export type WorkshopMoveCheck =
  | { ok: true; warnings: string[] }
  | { refused: { sentence: string; ruleId: string | null; nearest: string | null; set?: RuleAudit } }

/**
 * Whether a card may move to a lane, read-only: exec's check_move and "Why can't I move X?". The same
 * verdict a drag gets. A refusal names one rule (or the board kind's own rule: ruleId null), who set
 * it, and the nearest lane the card may go to instead.
 */
export function checkWorkshopMove(input: Workshop, cardRef: WorkshopRef, laneRef: WorkshopRef): WorkshopMoveCheck {
  const board = validateWorkshop(input)
  const refs = workshopReferences(board)
  const pick = <T extends { id: string }>(items: T[], finder: WorkshopFinder<T>, ref: WorkshopRef) =>
    typeof ref === 'object' ? items.find(item => item.id === ref.id) : items.find(item => item.id === ref) ?? finder.attempt(ref)
  const card = pick(board.cards, refs.cards, cardRef), lane = pick(board.lanes, refs.lanes, laneRef)
  if (!card || !lane) return { refused: { sentence: card ? 'There is no such lane on this board.' : 'There is no such card on this board.', ruleId: null, nearest: null } }
  const order = board.lanes.map(item => item.id)
  const nearest = () => board.lanes.filter(item => item.id !== card.laneId && item.id !== lane.id && workshopCandidate(board, card.id, item.id))
    .sort((a, b) => Math.abs(order.indexOf(a.id) - order.indexOf(lane.id)) - Math.abs(order.indexOf(b.id) - order.indexOf(lane.id)))[0]?.label ?? null
  const next = workshopCandidate(board, card.id, lane.id)
  if (next) {
    const verdict = next === board || !board.behaviour ? null : checkBehaviour(board, next)
    return { ok: true, warnings: verdict && 'ok' in verdict ? verdict.warnings : [] }
  }
  const sentence = workshopRefusal(board, card.id, lane.id) ?? 'That move is not available.'
  const rule = behaviourOf(board).rules.find(item => item.on && sentence === refusalOf(board, card.id, lane.id, item))
  return { refused: { sentence, ruleId: rule?.id ?? null, nearest: nearest(), ...(rule && { set: rule.set }) } }
}

/** What one rule alone says of a move. */
function refusalOf(board: Workshop, cardId: string, laneId: string, rule: BehaviourRule): string | null {
  const only = { ...board, behaviour: { ...behaviourOf(board), rules: [rule] } }
  const verdict = checkBehaviour(only, { ...only, cards: only.cards.map(card => card.id === cardId ? { ...card, laneId } : card) })
  return 'refused' in verdict ? verdict.refused.sentence : null
}

/**
 * The "How this board behaves" note of a board with a rulebook: a real note, read by everyone in the
 * session and redrawn the moment the rules change. Its lines are the rules' sentences. Null for a
 * board without a rulebook. A board kit's host places it under the kit's notes (`box`).
 */
function drawBehaviourNote(board: Workshop, box: { x: number; y: number; width: number }, style: WorkshopNoteStyle = {}): NodeJSON | null {
  if (!board.behaviour) return null
  const lines = behaviourLines(board)
  const text = ['How this board behaves', ...(lines.length ? lines : ['No rules yet. Say “Let a lane hold 2”.'])].join('\n')
  const size = Math.max(12, (style.fontSize ?? DEFAULT_NOTE_STYLE.fontSize) - 2)
  const perLine = Math.max(12, Math.floor((box.width - 24) / (size * 0.55)))
  const rows = text.split('\n').reduce((count, line) => count + Math.max(1, Math.ceil(line.length / perLine)), 0)
  const height = Math.round(rows * size * 1.4 + 24)
  return { options: { id: 'rules-board', name: 'How this board behaves', text, xPos: box.x, yPos: box.y, width: box.width, height,
    shapeHint: 'rectangle', vectorPath: roundedBox(box.width, height, style.cornerRadius ?? 0), backgroundColor: '#f4f1e8',
    foregroundColor: style.textColor ?? DEFAULT_NOTE_STYLE.fontColor, borderColor: '#b8b2a0', borderWidth: 1, borderStyle: 'dashed',
    fontSize: size, ...(style.fontFamily ? { fontFamily: style.fontFamily } : {}) }, relationships: { associations: [] } }
}


/** A lane whose limit is a rule: set_lane_capacity changes the rule (a new limit never moves a card). Null for a lane without one. */
export function setRuledLimit(board: Workshop, laneId: string, capacity: number | null, audit: RuleAudit): Workshop | string | null {
  const ruled = board.behaviour?.rules.find(rule => rule.kind === 'capacity' && rule.where === laneId)
  if (!ruled) return null
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1 || capacity > 24)) return 'A lane can hold from 1 to 24 cards.'
  const rules = capacity === null ? board.behaviour!.rules.filter(rule => rule !== ruled)
    : board.behaviour!.rules.map(rule => rule === ruled ? { ...rule, max: capacity, on: true, set: audit } : rule)
  return { ...board, behaviour: { ...board.behaviour!, rev: board.behaviour!.rev + 1, rules } }
}

/**
 * The rulebook's part of checkWorkshopReplacement. A change of the rules (a lane removed takes the
 * rules that named it) comes with a new revision and on its own, never with
 * cards moving in the same save (so a save can't switch a rule off and break it at once). Every card
 * that arrives is checked by the rules the board had.
 */
function checkRulesReplacement(original: Workshop, next: Workshop): string | null {
  // (A lane removed takes its rules under a new revision, and moves no card.)
  const was = behaviourOf(original), now = behaviourOf(next), say = JSON.stringify
  const where = (board: Workshop) => say(board.cards.map(card => [card.id, card.laneId]))
  if (say(was.rules) !== say(now.rules)) {
    if (now.rev <= was.rev) return 'The rules changed. Save them with a new revision.'
    if (where(original) !== where(next)) return 'Change the rules on their own, then move cards.'
  }
  const verdict = original.behaviour ? checkBehaviour(original, next) : null
  return verdict && 'refused' in verdict ? verdict.refused.sentence : null
}

registerRulebook({ replacement: checkRulesReplacement, move: checkWorkshopMove, diff: behaviourDiff, note: drawBehaviourNote, setLimit: setRuledLimit, validate: validateBehaviour, check: checkBehaviour, laneLimit: behaviourLaneLimit, lines: behaviourLines, dropLane: dropLaneRules,
  edit: applyRuleEdit })
