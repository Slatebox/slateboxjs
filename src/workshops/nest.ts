// slateboxjs/workshops/nest: the one hierarchy kind (dragology final.md §2.2, §3.4, §3.5, §3.9, §5, D4).
//
// A nest board is lists in lists: a card sits under another card (`parentId`), says what it is (`role`:
// pile, outcome, opportunity, cause… free words, never read from its text) and keeps its place among its
// siblings with a fractional key (`order`, order.ts). It has two areas: the board (its first lane) and a
// tray (its second: Unsorted, Parked ideas) for cards not placed yet. It is drawn as piles (clusters) or
// as a tree, and on a phone as an outline (boards/nestKit.tsx).
//
// Its rules are data in the board's rulebook (behaviour.ts reads them through this family): nests (a
// role sits only under these roles), children (a card holds at most so many), depth, rank (piles ordered
// by notes, customers or a number field) and emptyDrop (a card let go in empty space starts a new pile or
// goes to the tray). One check decides a drag, an edit, a whole-board save and exec's check_move, in the
// same words. Rules read structured fields only, never a card's words; a new rule never moves a card.
import type { Behaviour, BehaviourRule, BehaviourVerdict, RuleAudit, WorkshopMoveCheck } from './behaviour'
import type { NestFields, Workshop, WorkshopCard } from './model'
import { registerWorkshopRules, said, validateWorkshop, applyWorkshopEdits, workshopReferences } from './model'
import type { BusinessBoardRules, BusinessEditTools, RuleFamily } from './kinds'
import type { WorkshopEdit, WorkshopEditField, WorkshopEditKind, WorkshopEditKindName, WorkshopRef } from './edits'
import { workshopEditKinds, workshopRuleSchema } from './model'
import { byOrder, isOrderKey, orderBetween, orderKeys } from './order'

export { orderBetween, orderKeys, byOrder, isOrderKey } from './order'

type Rule = BehaviourRule
type Board = Workshop
const maxDepth = 6

// ---------------------------------------------------------------------------------------------
// Words.

const plural = (role: string) => /[^aeiou]y$/.test(role) ? role.slice(0, -1) + 'ies' : /(?:s|sh|ch|x)$/.test(role) ? role + 'es' : role + 's'
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const an = (word: string) => (/^[aeiou]/i.test(word) ? 'an ' : 'a ') + word
const or = (items: string[]) => items.length > 1 ? items.slice(0, -1).join(', ') + ' or ' + items.at(-1) : items[0] ?? ''

/** A role: lowercase words, such as "pile", "opportunity" or "root cause". */
export function roleOf(value: unknown): string {
  const role = typeof value === 'string' ? value.trim().toLowerCase().replace(/\s+/g, ' ') : ''
  if (!/^[a-z][a-z -]{0,23}$/.test(role)) throw new Error('A role is a word or two, such as “pile” or “opportunity”.')
  return role
}

// Small helpers of its own: this module's chunk shares nothing with the plans' chunk but the model.
const money = (n: number, sign: string) => sign + (n >= 1e6 ? Math.round(n / 1e5) / 10 + 'M' : n >= 1e3 ? Math.round(n / 100) / 10 + 'k' : String(n))
const nextCardId = (board: Board) => { let n = 1; while (board.cards.some(card => card.id === 'card-' + n) || board.lanes.some(lane => lane.id === 'card-' + n)) n++; return 'card-' + n }

// ---------------------------------------------------------------------------------------------
// More shapes of nested board (nestPlus.ts: impact × effort, the reorg sandbox, goals & owners) plug in here
// as that module loads; it loads wherever this one does (slateboxjs/workshops/rules, the nest kit).

type Verdict = BehaviourVerdict
export interface NestPlus {
  keys: Record<string, string>
  read(rule: Record<string, unknown>, base: Record<string, unknown>, board: Board): Rule | null
  sentence(rule: Rule, board: Board): string | null
  /** Its rules' check, after the core rules: a refusal, or warnings added to `warnings`. */
  check(before: Board, after: Board, warnings: string[]): Verdict | null
  contradiction(behaviour: Behaviour, board: Board): string | null
  readBoard(raw: Record<string, unknown>, out: NestFields, read: { id(value: unknown): string }): void
  readCard(raw: Record<string, unknown>, card: WorkshopCard, read: { id(value: unknown): string }): void
  validate(board: Board): string | null
  edit(board: Board, edit: WorkshopEdit, t: BusinessEditTools, settle: (next: Board, laneId?: string | null, cardId?: string) => Board): ReturnType<BusinessBoardRules['edit']>
  cardText(board: Board, card: WorkshopCard): string | null
  drags(board: Board): string | null
  caption(board: Board, laneId: string): string | null
}
let plus: NestPlus | null = null
/** Plug in nestPlus.ts (it calls this once as it loads). */
export function registerNestPlus(more: NestPlus): void {
  plus = more
  Object.assign(ruleKeys, more.keys)
}

const plainText = (value: unknown, limit: number, what: string) => {
  const text = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
  if (!text || text.length > limit || /[<>\u0000-\u001f]/.test(text)) throw new Error(what)
  return text
}

// ---------------------------------------------------------------------------------------------
// The tree.

/** The board's two areas: where cards are placed, and the tray of cards not placed yet. */
export const nestAreas = (board: Pick<Board, 'lanes'>) => ({ main: board.lanes[0].id, tray: board.lanes[1].id })

const byId = (board: Board, id: string | undefined) => id === undefined ? undefined : board.cards.find(card => card.id === id)

/** The cards directly under `parentId` (or at the top of `laneId`), in their order. */
export function nestKids(board: Board, parentId: string | null, laneId?: string): WorkshopCard[] {
  return board.cards.filter(card => (card.parentId ?? null) === parentId && (parentId !== null || card.laneId === laneId)).sort(byOrder)
}

/** A card and every card under it, the card first. */
export function nestSubtree(board: Board, id: string): string[] {
  const out = [id]
  for (let i = 0; i < out.length; i++) for (const card of board.cards) if (card.parentId === out[i]) out.push(card.id)
  return out
}

/** How many cards a card sits under (0 at the top). */
export function nestDepth(board: Board, id: string): number {
  let depth = 0
  for (let card = byId(board, id); card?.parentId && depth <= board.cards.length; card = byId(board, card.parentId)) depth++
  return depth
}

/** How many levels go down from a card (0 for a card with nothing under it). */
function nestHeight(board: Board, id: string): number {
  const kids = board.cards.filter(card => card.parentId === id)
  return kids.length ? 1 + Math.max(...kids.map(kid => nestHeight(board, kid.id))) : 0
}

/** The cards with nothing under them, under a card: the evidence a pile counts. */
function leaves(board: Board, id: string): WorkshopCard[] {
  return nestSubtree(board, id).slice(1).map(key => byId(board, key)!).filter(card => !board.cards.some(other => other.parentId === card.id))
}

/** What a pile counts: its notes, the customers they came from, or a number field (each customer once). */
export function nestMeasure(board: Board, id: string, by: string): number {
  const items = leaves(board, id)
  if (by === 'count') return items.length
  if (by === 'sources') return new Set(items.flatMap(card => card.source ? [card.source.toLowerCase()] : [])).size
  const per = new Map<string, number>()
  for (const card of items) {
    const value = card.fields?.[by]
    if (value === undefined) continue
    const key = card.source ? card.source.toLowerCase() : '#' + card.id
    per.set(key, Math.max(per.get(key) ?? 0, value))
  }
  return [...per.values()].reduce((sum, value) => sum + value, 0)
}

const field = (board: Board, id: string) => board.nest?.fields?.find(item => item.id === id)

/** "5 notes", "4 customers", "$84k ARR". */
export function nestMeasureWords(board: Board, by: string, n: number): string {
  if (by === 'count') return n + (n === 1 ? ' note' : ' notes')
  if (by === 'sources') return n + (n === 1 ? ' customer' : ' customers')
  const f = field(board, by)
  return (f?.currency ? money(n, f.currency) : String(n)) + ' ' + (f?.label ?? by)
}

const rulesOn = (board: Board, kind: string) => (board.behaviour?.rules ?? []).filter(rule => rule.on && rule.kind === kind)
const rankBy = (board: Board) => (rulesOn(board, 'rank')[0] as { by: string } | undefined)?.by

/** The top of an area as it is drawn: by the rank rule's measure (most first), then by order. */
export function nestRoots(board: Board, laneId: string): WorkshopCard[] {
  const roots = nestKids(board, null, laneId)
  const by = rankBy(board)
  if (!by || laneId !== nestAreas(board).main) return roots
  const score = new Map(roots.map(card => [card.id, nestMeasure(board, card.id, by)]))
  return roots.sort((a, b) => score.get(b.id)! - score.get(a.id)! || byOrder(a, b))
}

/** Where a card goes: under a card, or at the top of an area; before a sibling, or last. */
export interface NestSpot { laneId: string; under: string | null; before: string | null }

/**
 * The board with `cardId` (and everything under it) at `spot`, its key between its new neighbours. Null when
 * the spot can't hold it: under itself or a card under it, a card that is gone, or the tray for a card with
 * cards under it (the tray holds loose cards). The board itself when the card is there already.
 */
export function nestPlace(board: Board, cardId: string, spot: NestSpot): Board | null {
  const card = byId(board, cardId)
  if (!card) return null
  const moving = nestSubtree(board, cardId)
  const parent = spot.under === null ? null : byId(board, spot.under)
  if (parent === undefined || (parent && moving.includes(parent.id))) return null
  const laneId = parent ? parent.laneId : spot.laneId
  const { tray } = nestAreas(board)
  if (laneId === tray && (parent || moving.length > 1)) return null
  const siblings = (parent ? nestKids(board, parent.id) : nestKids(board, null, laneId)).filter(item => item.id !== cardId)
  let at = spot.before === null ? siblings.length : siblings.findIndex(item => item.id === spot.before)
  if (at < 0) at = siblings.length
  const now = (parent ? nestKids(board, parent.id) : nestKids(board, null, laneId))
  if ((card.parentId ?? null) === (parent?.id ?? null) && card.laneId === laneId && now.indexOf(card) === at) return board
  const prev = siblings[at - 1]?.order, next = siblings[at]?.order
  let keys = new Map<string, string>()
  let order: string
  if ((at === 0 || prev) && (at === siblings.length || next) && (!prev || !next || prev < next)) order = orderBetween(prev, next)
  else {
    // Siblings without keys, or with equal keys (two made at once): give them all fresh keys in their order.
    const fresh = orderKeys(siblings.length + 1)
    siblings.forEach((item, i) => keys.set(item.id, fresh[i < at ? i : i + 1]))
    order = fresh[at]
  }
  const cards = board.cards.map(item => {
    if (item.id === cardId) {
      const moved: WorkshopCard = { ...item, laneId, order }
      if (parent) moved.parentId = parent.id
      else delete moved.parentId
      return moved
    }
    const key = keys.get(item.id)
    const lane = moving.includes(item.id) ? laneId : item.laneId
    return key || lane !== item.laneId ? { ...item, laneId: lane, ...(key && { order: key }) } : item
  })
  return tidyKeys({ ...board, cards })
}

/**
 * Siblings whose keys have grown long get fresh short keys, in the same order. A key put at one end of a
 * list again and again grows by a character every few moves; without this a card moved to the end of a pile
 * a few hundred times would carry a key too long to keep, and the board could no longer be saved.
 */
export function tidyKeys(board: Board): Board {
  const groups: Record<string, WorkshopCard[]> = {}, fresh = new Map<string, string>()
  for (const card of board.cards) (groups[card.parentId ?? '#' + card.laneId] ??= []).push(card)
  for (const group of Object.values(groups)) if (group.some(card => card.order!?.length > 16)) {
    const keys = orderKeys(group.length)
    group.sort(byOrder).forEach((card, i) => fresh.set(card.id, keys[i]))
  }
  return fresh.size ? { ...board, cards: board.cards.map(card => fresh.has(card.id) ? { ...card, order: fresh.get(card.id) } : card) } : board
}

/** The structure every nest board keeps, rules or not: null when it holds, otherwise the sentence. */
export function validateNest(board: Board): string | null {
  if (board.lanes.length !== 2) return 'A nested board has two areas: the board and a tray for cards not placed yet.'
  const { tray } = nestAreas(board)
  const fields = new Set((board.nest?.fields ?? []).map(item => item.id))
  if (board.nest?.layout === 'matrix' && !plus) return 'A 2 by 2 needs its rules loaded.'
  const by = rankBy(board)
  if (by && by !== 'count' && by !== 'sources' && !fields.has(by)) return 'Cards on this board carry no ' + by + ', so piles can’t rank by it.'
  for (const card of board.cards) {
    if (card.parentId !== undefined) {
      const parent = byId(board, card.parentId)
      if (!parent) return said(card.label) + ' sits under a card that is no longer on the board.'
      if (parent.laneId !== card.laneId) return said(card.label) + ' is in another area than the card it sits under.'
      if (card.laneId === tray) return board.lanes[1].label + ' holds loose cards: nothing sits under another there.'
      if (nestDepth(board, card.id) > Math.min(maxDepth, board.cards.length)) return 'Cards nest up to ' + maxDepth + ' levels deep, and never under themselves.'
    }
    const missing = Object.keys(card.fields ?? {}).find(key => !fields.has(key))
    if (missing) return said(card.label) + ' has a number this board has no field for.'
  }
  return plus?.validate(board) ?? null
}

// ---------------------------------------------------------------------------------------------
// The rules (read, said and checked through the rulebook's family hook).

/** What one rule says: the caption, the refusal, the note's line, the loop's caption. */
export function nestSentence(rule: Rule, board: Board): string {
  const warn = rule.severity === 'warn' ? ' (a warning only)' : ''
  let line = ''
  switch (rule.kind) {
    case 'nests': line = cap(plural(rule.role)) + ' sit under ' + or(rule.under.map(an)); break
    case 'children': line = rule.role ? cap(an(rule.role)) + ' holds at most ' + rule.max : 'A card holds at most ' + rule.max + ' under it'; break
    case 'depth': line = rule.max === 1 ? 'Cards nest one level deep' : 'Cards nest up to ' + rule.max + ' levels deep'; break
    case 'rank': line = 'Piles rank by ' + (rule.by === 'count' ? 'number of notes' : rule.by === 'sources' ? 'number of customers' : field(board, rule.by)?.label ?? rule.by); break
    case 'emptyDrop': line = 'A card let go in empty space ' + (rule.drop === 'new-pile' ? 'starts a new pile' : 'goes to ' + board.lanes[1].label); break
    default: line = (plus?.sentence(rule, board) ?? rule.kind).replace(/\.$/, '')
  }
  return line + warn + '.'
}

const priority = ['nests', 'depth', 'children']

/**
 * Whether `after` keeps the rules `before` has, for every card that arrived somewhere (a new parent, area
 * or role, or new): one rule named per refusal, by a fixed order; a rule that only warns lets the card land
 * and says its sentence. Only arrivals are held to a rule, and the tray is outside the rules.
 */
export function checkNest(before: Board, after: Board): BehaviourVerdict {
  const rules = (before.behaviour?.rules ?? []).filter(rule => rule.on && priority.includes(rule.kind))
    .sort((a, b) => priority.indexOf(a.kind) - priority.indexOf(b.kind))
  const warnings: string[] = []
  if (!rules.length) return plus?.check(before, after, warnings) ?? { ok: true, warnings }
  const old = new Map(before.cards.map(card => [card.id, card]))
  const { tray } = nestAreas(after)
  const arrived = after.cards.filter(card => {
    const was = old.get(card.id)
    return card.laneId !== tray && (!was || was.parentId !== card.parentId || was.laneId !== card.laneId || was.role !== card.role)
  })
  const kidsOf = (board: Board, id: string) => board.cards.filter(card => card.parentId === id).length
  for (const rule of rules) {
    let found: { sentence: string; card: WorkshopCard } | null = null
    if (rule.kind === 'nests') {
      const card = arrived.find(item => item.role === rule.role && !rule.under.includes(byId(after, item.parentId)?.role ?? ''))
      if (card) found = { sentence: nestSentence({ ...rule, severity: 'refuse' }, before), card }
    } else if (rule.kind === 'depth') {
      const card = arrived.find(item => nestDepth(after, item.id) + nestHeight(after, item.id) > rule.max)
      if (card) found = { sentence: nestSentence({ ...rule, severity: 'refuse' }, before) + ' ' + card.label + ' would be ' + (nestDepth(after, card.id) + nestHeight(after, card.id)) + ' deep.', card }
    } else if (rule.kind === 'children') {
      for (const card of arrived) {
        const parent = byId(after, card.parentId)
        if (!parent || (rule.role && parent.role !== rule.role)) continue
        const had = kidsOf(before, parent.id), now = kidsOf(after, parent.id)
        if (now > rule.max && now > had) { found = { sentence: parent.label + ' holds ' + rule.max + '. It has ' + had + '.', card }; break }
      }
    }
    if (!found) continue
    if (rule.severity === 'warn') { warnings.push(found.sentence); continue }
    return { refused: { sentence: found.sentence, ruleId: rule.id, set: rule.set, cardId: found.card.id, laneId: found.card.laneId } }
  }
  return plus?.check(before, after, warnings) ?? { ok: true, warnings }
}

/** The least depth a role can be placed at under the rules that refuse (Infinity: never). */
function leastDepths(rules: Rule[]): Map<string, number> {
  const nests = rules.filter(rule => rule.kind === 'nests' && rule.on && rule.severity === 'refuse') as Extract<Rule, { kind: 'nests' }>[]
  const least = new Map<string, number>()
  const visit = (role: string, seen: string[]): number => {
    if (least.has(role)) return least.get(role)!
    const rule = nests.find(item => item.role === role)
    if (!rule) return 0
    if (seen.includes(role)) return Infinity
    const depth = 1 + Math.min(...rule.under.map(under => visit(under, [...seen, role])))
    if (!seen.length) least.set(role, depth)
    return depth
  }
  for (const rule of nests) least.set(rule.role, visit(rule.role, []))
  return least
}

function nestContradiction(behaviour: Behaviour, board: Board): string | null {
  const seen = new Set<string>()
  for (const rule of behaviour.rules) {
    if (!(rule.kind in coreKeys)) continue
    const key = rule.kind + ':' + (rule.kind === 'nests' ? rule.role : rule.kind === 'children' ? rule.role ?? '' : '')
    if (seen.has(key)) {
      return rule.kind === 'nests' ? 'There is already a rule for where ' + plural(rule.role) + ' sit. Change that one instead.'
        : 'There is already a rule like that on this board. Change that one instead.'
    }
    seen.add(key)
  }
  const least = leastDepths(behaviour.rules)
  const depth = behaviour.rules.find(rule => rule.kind === 'depth' && rule.on && rule.severity === 'refuse') as { max: number } | undefined
  for (const [role, n] of least) {
    if (n === Infinity) return cap(plural(role)) + ' could never be placed: what they sit under would have to sit under them first.'
    if (depth && n > depth.max) return cap(plural(role)) + ' sit ' + n + ' levels down, but cards nest only ' + depth.max + ' deep.'
  }
  return plus?.contradiction(behaviour, board) ?? null
}

const coreKeys: Record<string, string> = { nests: 'role under', children: 'max role', depth: 'max', rank: 'by', emptyDrop: 'drop' }
const ruleKeys: Record<string, string> = { ...coreKeys }

function readNestRule(rule: Record<string, unknown>, base: Record<string, unknown>, board: Board): Rule {
  const extra = Object.keys(rule).find(key => !['id', 'on', 'severity', 'set', 'kind', ...ruleKeys[rule.kind as string].split(' ')].includes(key))
  if (extra) throw new Error('A ' + rule.kind + ' rule does not take ' + extra + '.')
  const whole = (value: unknown, top: number, why: string) => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > top) throw new Error(why)
    return value
  }
  switch (rule.kind) {
    case 'nests': {
      const role = roleOf(rule.role)
      if (!Array.isArray(rule.under) || rule.under.length < 1 || rule.under.length > 4) throw new Error('Say what ' + plural(role) + ' sit under.')
      const under = [...new Set(rule.under.map(roleOf))]
      if (under.includes(role)) throw new Error(cap(plural(role)) + ' can’t sit only under ' + plural(role) + '.')
      return { ...base, kind: 'nests', role, under } as Rule
    }
    case 'children': {
      const out = { ...base, kind: 'children', max: whole(rule.max, 40, 'A card holds from 1 to 40 cards under it.') } as Rule & { role?: string }
      if (rule.role !== undefined) out.role = roleOf(rule.role)
      return out
    }
    case 'depth': return { ...base, kind: 'depth', max: whole(rule.max, maxDepth, 'Cards nest from 1 to ' + maxDepth + ' levels deep.') } as Rule
    case 'rank':
      // A number field is checked once the board's fields are read (validateNest).
      if (typeof rule.by !== 'string' || !/^[a-z0-9-]{1,20}$/.test(rule.by)) throw new Error('Piles rank by number of notes, number of customers, or a number field this board has.')
      return { ...base, kind: 'rank', by: rule.by } as Rule
    case 'emptyDrop':
      if (rule.drop !== 'new-pile' && rule.drop !== 'unsorted') throw new Error('A card let go in empty space starts a new pile or goes to ' + board.lanes[1].label + '.')
      return { ...base, kind: 'emptyDrop', drop: rule.drop } as Rule
  }
  const more = plus?.read(rule, base, board)
  if (more) return more
  throw new Error('This board does not know the rule ' + String(rule.kind) + '.')
}

/** The nest board's rule kinds, for the rulebook (behaviour.ts). */
export const nestFamily: RuleFamily = {
  keys: ruleKeys,
  read: (rule, base, board) => readNestRule(rule, base, board),
  sentence: nestSentence,
  contradiction: nestContradiction,
  check: checkNest,
  builtIn: board => [board.lanes[1].label + ' holds cards not placed yet: no rule applies there.'],
}


// ---------------------------------------------------------------------------------------------
// Where a card may go: the drag's candidates, the library's "changes the next drag", exec's check.

/** Whether `next` keeps `board`'s rules (warnings land). */
const keeps = (board: Board, next: Board) => !board.behaviour || !('refused' in checkNest(board, next))

/**
 * Every place the card may be let go, with the board each makes: each slot under each card it may sit under,
 * and each slot at the top of each area; the place it is now is the board itself. Cycles are never offered.
 */
export function nestLegal(board: Board, cardId: string): { spot: NestSpot; next: Board }[] {
  const card = byId(board, cardId)
  if (!card) return []
  const out: { spot: NestSpot; next: Board }[] = []
  const moving = new Set(nestSubtree(board, cardId))
  const height = nestHeight(board, cardId)
  const parents: (WorkshopCard | null)[] = [null, ...board.cards.filter(item => !moving.has(item.id) && item.laneId === nestAreas(board).main &&
    nestDepth(board, item.id) + 1 + height <= maxDepth)]
  for (const lane of board.lanes) for (const parent of parents) {
    if (parent && lane.id !== parent.laneId) continue
    const siblings = (parent ? nestKids(board, parent.id) : nestKids(board, null, lane.id)).filter(item => item.id !== cardId)
    for (let at = 0; at <= siblings.length; at++) {
      const spot = { laneId: lane.id, under: parent?.id ?? null, before: siblings[at]?.id ?? null }
      const next = nestPlace(board, cardId, spot)
      if (next && (next === board || keeps(board, next))) out.push({ spot, next })
    }
  }
  return out
}

/** Where a far drop goes (the emptyDrop rule; a new pile when piles have none): the board, or null when it goes nowhere new. */
export function nestEmptyDrop(board: Board, cardId: string): Board | null {
  const card = byId(board, cardId)
  if (!card) return null
  const rule = rulesOn(board, 'emptyDrop')[0] as { drop: string } | undefined
  const { main, tray } = nestAreas(board)
  // Without a rule: piles start a new pile; a tree keeps the card where it was.
  const drop = rule?.drop ?? (board.nest?.layout === 'clusters' ? 'new-pile' : null)
  if (!drop) return null
  let next: Board | null
  if (drop === 'unsorted') next = card.laneId === tray ? null : nestPlace(board, cardId, { laneId: tray, under: null, before: null })
  else {
    if (board.cards.some(item => item.parentId === cardId)) return null
    const made = applyWorkshopEdits(board, [{ kind: 'start_pile', card: { id: cardId } }])
    next = 'refused' in made ? null : made.workshop
  }
  return next && next !== board && keeps(board, next) ? next : null
}

/** Where every card may go, as one string: two boards drag alike when these are equal (the library's gate). */
export const nestDrags = (board: Board) => (plus?.drags(board) ?? '') + JSON.stringify([board.nest?.layout, rankBy(board), rulesOn(board, 'emptyDrop')[0]?.kind && (rulesOn(board, 'emptyDrop')[0] as { drop: string }).drop,
  nestRoots(board, nestAreas(board).main).map(card => card.id),
  board.cards.map(card => nestLegal(board, card.id).map(({ spot }) => spot.under ?? spot.laneId).filter((v, i, all) => all.indexOf(v) === i))])

/** A card a merge took away answers for the card it went into: a drop already on its way lands there. */
export function nestAlias(board: Board, id: string): string | null {
  let at = id
  for (let hop = 0; hop < 12 && !byId(board, at); hop++) {
    const next = board.nest?.aliases?.find(([from]) => from === at)?.[1]
    if (!next) return null
    at = next
  }
  return byId(board, at) ? at : null
}

/**
 * check_move on a nest board: whether a card may go under another (or to the top of an area), read-only,
 * with the verdict a drag gets: ok (and any warning), or the one rule that refuses it, who set it, and the
 * nearest card it may go under instead.
 */
export function checkNestMove(input: Board, cardRef: WorkshopRef, to: { under?: WorkshopRef; lane?: WorkshopRef }): WorkshopMoveCheck {
  const board = validateWorkshop(input)
  const refs = workshopReferences(board)
  const pick = (ref: WorkshopRef) => typeof ref === 'object' ? byId(board, nestAlias(board, ref.id) ?? '') : byId(board, ref) ?? refs.cards.attempt(ref) ?? undefined
  const card = pick(cardRef)
  const under = to.under === undefined ? null : pick(to.under)
  if (!card || under === undefined) return { refused: { sentence: 'There is no such card on this board.', ruleId: null, nearest: null } }
  const edit: WorkshopEdit = { kind: 'nest_card', card: { id: card.id }, ...(under ? { under: { id: under.id } } : to.lane ? { lane: to.lane } : {}) }
  const made = applyWorkshopEdits(board, [edit])
  if (!('refused' in made)) {
    const verdict = checkNest(board, made.workshop)
    return { ok: true, warnings: 'warnings' in verdict ? verdict.warnings : [] }
  }
  const sentence = made.refused.reason
  const rule = (board.behaviour?.rules ?? []).find(item => {
    if (!item.on) return false
    const only = { ...board, behaviour: { ...board.behaviour!, rules: [{ ...item, severity: 'refuse' as const }] } }
    const alone = applyWorkshopEdits(only, [edit])
    return 'refused' in alone && alone.refused.reason === sentence
  })
  // The nearest card it may go under: under the card asked for first, then beside it.
  const legal = new Set(nestLegal(board, card.id).flatMap(({ spot }) => spot.under ? [spot.under] : []))
  const near = under ? [...nestKids(board, under.id), ...(under.parentId ? nestKids(board, under.parentId) : nestKids(board, null, under.laneId))] : []
  const nearest = near.find(item => legal.has(item.id) && item.id !== card.parentId)?.label ?? null
  return { refused: { sentence, ruleId: rule?.id ?? null, nearest, ...(rule && { set: rule.set as RuleAudit }) } }
}

// ---------------------------------------------------------------------------------------------
// Edits.

const cardField = (about: string) => ({ type: 'ref' as const, of: 'card' as const, about })
const text = (max: number, about: string, optional = false) => ({ type: 'text' as const, max, about, ...(optional && { optional }) })
const nestOnly = ['nest' as const]
// The board's own edits join the one edit table as this module loads (as the plans' do, editTable.ts).
export function extend(more: { kinds: WorkshopEditKind[]; boards: Partial<Record<WorkshopEditKindName, 'nest'[]>>; fields: Partial<Record<WorkshopEditKindName, Record<string, WorkshopEditField>>>;
  rules: { kinds: string[]; keys: Record<string, unknown> } }) {
  const entryOf = (kind: string) => workshopEditKinds.find(item => item.kind === kind)!
  for (const entry of more.kinds) if (!workshopEditKinds.some(item => item.kind === entry.kind)) workshopEditKinds.push(entry)
  for (const [kind, boards] of Object.entries(more.boards)) for (const board of boards!) {
    const entry = entryOf(kind)
    if (!entry.boards.includes(board)) { entry.boards.push(board); delete entry.refusals[board] }
  }
  for (const [kind, fields] of Object.entries(more.fields)) Object.assign(entryOf(kind).fields, fields)
  workshopRuleSchema.kinds.push(...more.rules.kinds.filter(kind => !workshopRuleSchema.kinds.includes(kind)))
  Object.assign(workshopRuleSchema.keys, more.rules.keys)
}
extend({
  kinds: [
    { kind: 'nest_card', summary: 'Nest board: put a card under another (under), at the top of an area (lane), before a sibling (before). The cards under it come with it.', intent: true,
      fields: { card: cardField('The card.'), under: { ...cardField('The card it goes under.'), optional: true }, lane: { type: 'ref', of: 'lane', optional: true, about: 'The area it goes to the top of.' },
        before: { ...cardField('The sibling it goes before. Left out, last.'), optional: true } }, boards: nestOnly, refusals: {} },
    { kind: 'start_pile', summary: 'Nest board: start a new pile with this card in it.', intent: true,
      fields: { card: cardField('The card.'), label: text(80, 'The pile’s name. Left out, “New pile”.', true) }, boards: nestOnly, refusals: {} },
    { kind: 'merge_cards', summary: 'Nest board: merge a card into another. What was under it goes under that one; a drop still on its way lands there too.', intent: false,
      fields: { card: cardField('The card that goes.'), into: cardField('The card it merges into.') }, boards: nestOnly, refusals: {} },
    { kind: 'set_role', summary: 'Nest board: say what a card is (pile, outcome, opportunity, solution, cause, action…).', intent: false,
      fields: { card: cardField('The card.'), role: text(24, 'A word or two.') }, boards: nestOnly, refusals: {} },
    { kind: 'set_source', summary: 'Nest board: say who a card came from (a customer, an interview).', intent: false,
      fields: { card: cardField('The card.'), source: text(60, 'Who said it.') }, boards: nestOnly, refusals: {} },
    { kind: 'add_field', summary: 'Nest board: add a number field cards can carry (ARR, seats…). Up to 4.', intent: false,
      fields: { label: text(20, 'Its name.'), currency: { type: 'choice', values: ['$', '€', '£'], optional: true, about: 'A money field’s sign.' },
        flag: { type: 'flag', optional: true, about: 'A yes/no field (contractor…): cards carry 1 for yes.' } }, boards: nestOnly, refusals: {} },
    { kind: 'set_field', summary: 'Nest board: set (or with null clear) a card’s number in a field.', intent: false,
      fields: { card: cardField('The card.'), field: text(20, 'The field, by id or name.'), value: { type: 'integer', min: 0, max: 1e9, nullable: true, about: 'A whole number, or null.' } }, boards: nestOnly, refusals: {} },
    { kind: 'set_layout', summary: 'Nest board: draw it as piles or as a tree (a phone shows an outline).', intent: false,
      fields: { layout: { type: 'choice', values: ['clusters', 'tree'], about: 'clusters or tree.' } }, boards: nestOnly, refusals: {} },
  ],
  boards: { add_rule: nestOnly, set_rule: nestOnly, remove_rule: nestOnly },
  fields: { set_rule: { under: { type: 'refs', of: 'card', min: 1, max: 4, optional: true, about: 'Nest board: the roles a role may sit under (words, such as opportunity).' },
    by: text(20, 'Nest board: what piles rank by: count, sources, or a number field.', true), drop: { type: 'choice', values: ['new-pile', 'unsorted'], optional: true, about: 'Nest board: where a far drop goes.' } },
    add_card: { under: { ...cardField('Nest board: the card it goes under.'), optional: true }, role: text(24, 'Nest board: what it is.', true), source: text(60, 'Nest board: who said it.', true) } },
  rules: { kinds: ['nests', 'children', 'depth', 'rank', 'emptyDrop'],
    keys: { role: { type: 'string', minLength: 1, maxLength: 24 }, under: { type: 'array', items: { type: 'string', maxLength: 24 }, minItems: 1, maxItems: 4 },
      max: { type: 'integer', minimum: 1, maximum: 40 }, by: { type: 'string', maxLength: 20 }, drop: { enum: ['new-pile', 'unsorted'] } } },
})

/** The role a card takes under `parent` when none is said: the one the rules seat there, a pile's note, or none. */
function roleUnder(board: Board, parent: WorkshopCard | null): string | undefined {
  if (!parent) return undefined
  const seated = (board.behaviour?.rules ?? []).find(rule => rule.kind === 'nests' && rule.under.includes(parent.role ?? '')) as { role: string } | undefined
  return seated?.role ?? (parent.role === 'pile' ? 'note' : undefined)
}

const endOf = (board: Board, parentId: string | null, laneId: string) => orderBetween(nestKids(board, parentId, laneId).at(-1)?.order ?? null, null)

function nestEdit(input: Board, edit: WorkshopEdit, t: BusinessEditTools) {
  const board = input
  const { main, tray } = nestAreas(board)
  const trayName = board.lanes[1].label
  // Every board an edit makes keeps its keys short (tidyKeys).
  const settle = (next: Board, laneId?: string | null, cardId?: string) => t.settle(tidyKeys(next), laneId, cardId)
  const more = plus?.edit(board, edit, t, settle)
  if (more) return more
  const under = (value: WorkshopRef) => {
    if (typeof value === 'object' && !byId(board, value.id)) {
      // A card a merge took away: the card it went into.
      const into = nestAlias(board, value.id)
      if (into) return byId(board, into)!
    }
    return t.card(value)
  }
  const place = (card: WorkshopCard, spot: NestSpot) => {
    const next = nestPlace(board, card.id, spot)
    if (!next) {
      if (spot.under && nestSubtree(board, card.id).includes(spot.under)) t.refuse('A card can’t go under itself or a card under it.', { cardId: card.id, laneId: card.laneId })
      t.refuse(trayName + ' holds loose cards. Move what is under ' + said(card.label) + ' first.', { cardId: card.id, laneId: spot.laneId })
    }
    return settle(next!, spot.laneId, card.id)
  }
  switch (edit.kind) {
    case 'add_card': {
      // A 2 by 2: a new card waits in the tray until it is scored.
      const lane = board.nest?.layout === 'matrix' ? board.lanes[1] : t.lane(edit.lane)
      const label = edit.label?.replace(/\s+/g, ' ').trim()
      if (!label) t.refuse('Say what the card should say, such as “Add a note called Slow exports to Reporting”.', { laneId: lane.id })
      const parent = edit.under === undefined ? null : under(edit.under)
      if (parent && lane.id === tray) t.refuse(trayName + ' holds loose cards: nothing sits under another there.', { laneId: lane.id })
      const role = edit.role === undefined ? roleUnder(board, parent) : roleOf(edit.role)
      const card: WorkshopCard = { id: nextCardId(board), label: label!, laneId: parent?.laneId ?? lane.id, ...(role && { role }), ...(parent?.owner && { owner: parent.owner }), ...(edit.source && { source: plainText(edit.source, 60, 'Say who said it in plain words.') }) }
      // A note let go on the piles but on no pile: the empty-drop rule says where it goes.
      if (!parent && lane.id === main && board.nest?.layout === 'clusters' && edit.role === undefined) {
        const drop = (rulesOn(board, 'emptyDrop')[0] as { drop: string } | undefined)?.drop ?? 'new-pile'
        if (drop === 'unsorted') {
          const next = settle({ ...board, cards: [...board.cards, { ...card, laneId: tray, order: endOf(board, null, tray) }] }, tray)
          return t.done(next, 'Added ' + said(label!) + ' to ' + said(trayName) + '.', { laneId: tray, cardId: card.id })
        }
        const pile: WorkshopCard = { id: card.id, label: 'New pile', laneId: main, role: 'pile', order: endOf(board, null, main) }
        const item = { ...card, id: nextCardId({ ...board, cards: [...board.cards, pile] }), parentId: pile.id, role: role ?? 'note', order: orderBetween(null, null) }
        const next = settle({ ...board, cards: [...board.cards, pile, item] }, main)
        return t.done(next, 'Added ' + said(label!) + ' to a new pile.', { laneId: main, cardId: item.id })
      }
      if (parent) card.parentId = parent.id
      card.order = endOf(board, parent?.id ?? null, card.laneId)
      const next = settle({ ...board, cards: [...board.cards, card] }, card.laneId)
      return t.done(next, 'Added ' + said(label!) + ' to ' + said(parent?.label ?? board.lanes.find(item => item.id === card.laneId)!.label) + '.', { laneId: card.laneId, cardId: card.id })
    }
    case 'nest_card': {
      const card = t.card(edit.card)
      const parent = edit.under === undefined ? null : under(edit.under)
      const laneId = parent?.laneId ?? (edit.lane === undefined ? card.laneId : t.lane(edit.lane).id)
      const before = edit.before === undefined ? null : t.card(edit.before).id
      const next = place(card, { laneId, under: parent?.id ?? null, before })
      if (next === board) return t.done(board, said(card.label) + ' is there already.', { laneId, cardId: card.id })
      const where = parent ? 'under ' + said(parent.label) : laneId === tray ? 'to ' + said(trayName) : 'to the top of ' + said(board.lanes[0].label)
      return t.done(next, 'Moved ' + said(card.label) + ' ' + where + '.', { laneId, cardId: card.id })
    }
    case 'start_pile': {
      const card = t.card(edit.card)
      if (board.cards.some(item => item.parentId === card.id)) t.refuse(said(card.label) + ' has cards under it already.', { cardId: card.id, laneId: card.laneId })
      const label = edit.label === undefined ? 'New pile' : plainText(edit.label, 80, 'Name the pile in plain words.')
      const pile: WorkshopCard = { id: nextCardId(board), label, laneId: main, role: 'pile', order: endOf(board, null, main) }
      const moved = board.cards.map(item => {
        if (item.id !== card.id) return item
        const next: WorkshopCard = { ...item, laneId: main, parentId: pile.id, order: orderBetween(null, null) }
        if (!next.role || next.role === 'pile') next.role = 'note'
        return next
      })
      const next = settle({ ...board, cards: [...moved, pile] }, main, card.id)
      return t.done(next, 'Started a new pile, ' + said(label) + ', with ' + said(card.label) + ' in it.', { laneId: main, cardId: pile.id })
    }
    case 'merge_cards': {
      const from = t.card(edit.card), into = t.card(edit.into)
      if (from.id === into.id) t.refuse('Name two different cards to merge.', { cardId: from.id, laneId: from.laneId })
      if (nestSubtree(board, from.id).includes(into.id)) t.refuse(said(into.label) + ' is under ' + said(from.label) + ', so it can’t take it in.', { cardId: from.id, laneId: from.laneId })
      if (into.laneId === tray || from.laneId === tray) t.refuse('Merge cards on the board, not in ' + said(trayName) + '.', { cardId: from.id, laneId: tray })
      const kids = nestKids(board, from.id)
      let last = nestKids(board, into.id).at(-1)?.order ?? null
      const keys = new Map(kids.map(kid => { last = orderBetween(last, null); return [kid.id, last] }))
      const aliases = [...(board.nest!.aliases ?? []).map(([a, b]): [string, string] => [a, b === from.id ? into.id : b]), [from.id, into.id] as [string, string]].slice(-12)
      const cards = board.cards.filter(item => item.id !== from.id).map(item => keys.has(item.id) ? { ...item, parentId: into.id, order: keys.get(item.id)! } : item)
      const next = settle({ ...board, nest: { ...board.nest!, aliases }, cards }, into.laneId, into.id)
      return t.done(next, 'Merged ' + said(from.label) + ' into ' + said(into.label) + (kids.length ? ': ' + kids.length + (kids.length === 1 ? ' card' : ' cards') + ' moved.' : '.'), { laneId: into.laneId, cardId: into.id })
    }
    case 'remove_card': {
      // What was under it moves up to its parent. Loose cards go to the tray instead under a card at the top, or
      // when the rules would refuse them there (solutions under the outcome).
      const card = t.card(edit.card)
      const kids = nestKids(board, card.id)
      const without = (park: boolean) => {
        let tidy = false, up = nestKids(board, card.parentId ?? null, card.laneId).at(-1)?.order ?? null, low = nestKids(board, null, tray).at(-1)?.order ?? null
        const to = new Map(kids.map(kid => {
          const loose = (park || !card.parentId) && !board.cards.some(other => other.parentId === kid.id)
          tidy ||= loose
          return [kid.id, loose ? { laneId: tray, order: low = orderBetween(low, null) } : { laneId: card.laneId, order: up = orderBetween(up, null), ...(card.parentId && { parentId: card.parentId }) }]
        }))
        const cards = board.cards.flatMap(item => item.id === card.id ? [] : to.has(item.id) ? [(({ parentId: _gone, ...rest }) => ({ ...rest, ...to.get(item.id) }))(item)] : [item])
        return { board: { ...board, cards }, tidy }
      }
      let plan = without(false)
      if (card.parentId && board.behaviour && 'refused' in checkNest(board, plan.board)) {
        const parked = without(true)
        if (!('refused' in checkNest(board, parked.board))) plan = parked
      }
      const { tidy } = plan
      const next = settle(plan.board, card.laneId)
      return t.done(next, 'Removed ' + said(card.label) + '.' + (kids.length ? tidy ? ' What was in it went to ' + said(trayName) + '.' : ' What was under it moved up.' : ''), { laneId: card.laneId, cardId: card.id })
    }
    case 'set_role': {
      const card = t.card(edit.card)
      let role = ''
      try { role = roleOf(edit.role) } catch (error) { t.refuse((error as Error).message, { cardId: card.id, laneId: card.laneId }) }
      const next = settle({ ...board, cards: board.cards.map(item => item.id === card.id ? { ...item, role } : item) }, card.laneId, card.id)
      return t.done(next, said(card.label) + ' is ' + an(role) + ' now.', { laneId: card.laneId, cardId: card.id })
    }
    case 'set_source': {
      const card = t.card(edit.card)
      let source = ''
      try { source = plainText(edit.source, 60, 'Say who said it in plain words.') } catch (error) { t.refuse((error as Error).message, { cardId: card.id }) }
      const next = settle({ ...board, cards: board.cards.map(item => item.id === card.id ? { ...item, source } : item) }, card.laneId, card.id)
      return t.done(next, said(card.label) + ' came from ' + source + '.', { laneId: card.laneId, cardId: card.id })
    }
    case 'add_field': {
      const fields = board.nest!.fields ?? []
      let label = ''
      try { label = plainText(edit.label, 20, 'Name the field in a word or two.') } catch (error) { t.refuse((error as Error).message) }
      const id = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'field'
      if (fields.some(item => item.id === id || item.label.toLowerCase() === label.toLowerCase())) t.refuse('Cards already carry ' + label + '.')
      if (fields.length >= 4) t.refuse('Cards carry up to 4 number fields.')
      const next = settle({ ...board, nest: { ...board.nest!, fields: [...fields, { id, label, ...(edit.currency && { currency: edit.currency }), ...(edit.flag && { flag: true as const }) }] } })
      return t.done(next, 'Cards can carry ' + label + (edit.flag ? ' (yes or no)' : '') + ' now.')
    }
    case 'set_field': {
      const card = t.card(edit.card)
      const f = (board.nest!.fields ?? []).find(item => item.id === edit.field || item.label.toLowerCase() === String(edit.field).toLowerCase())
      if (!f) t.refuse('Cards on this board carry no ' + edit.field + '. Add it as a field first.', { code: 'unknown_reference', cardId: card.id })
      if (edit.value !== null && (!Number.isInteger(edit.value) || edit.value < 0 || edit.value > 1e9)) t.refuse('A number field takes a whole number from 0.', { cardId: card.id })
      const cards = board.cards.map(item => {
        if (item.id !== card.id) return item
        const fields = { ...item.fields }
        if (edit.value === null) delete fields[f!.id]
        else fields[f!.id] = edit.value
        const next = { ...item, fields }
        if (!Object.keys(fields).length) delete (next as WorkshopCard).fields
        return next
      })
      const next = settle({ ...board, cards }, card.laneId, card.id)
      return t.done(next, said(card.label) + (edit.value === null ? ' has no ' + f!.label + ' now.' : '’s ' + f!.label + ' is ' + (f!.currency ? money(edit.value, f!.currency) : edit.value) + '.'), { laneId: card.laneId, cardId: card.id })
    }
    case 'set_layout': {
      if (edit.layout !== 'clusters' && edit.layout !== 'tree') t.refuse('A nested board is drawn as piles or as a tree.', { code: 'invalid_edit' })
      const next = settle({ ...board, nest: { ...board.nest!, layout: edit.layout } })
      return t.done(next, edit.layout === 'tree' ? 'Drawn as a tree.' : 'Drawn as piles.')
    }
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// The kind.

/** What a card says on the board: a card with cards under it says what it counts. */
export function nestCardText(board: Board, card: WorkshopCard): string {
  const more = plus?.cardText(board, card)
  if (more !== null && more !== undefined) return more
  if (board.cards.some(item => item.parentId === card.id) || card.role === 'pile') {
    const counts = [nestMeasureWords(board, 'count', nestMeasure(board, card.id, 'count'))]
    if (board.nest?.layout === 'clusters') {
      const sources = nestMeasure(board, card.id, 'sources')
      if (sources) counts.push(nestMeasureWords(board, 'sources', sources))
      const by = rankBy(board)
      if (by && by !== 'count' && by !== 'sources') counts.push(nestMeasureWords(board, by, nestMeasure(board, card.id, by)))
    }
    return card.label + '\n' + counts.join(' · ')
  }
  return card.source ? card.label + '\n— ' + card.source : card.label
}

function readFields(raw: unknown): Record<string, number> | undefined {
  if (raw === undefined) return undefined
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('A card’s numbers are a list of fields.')
  const out: Record<string, number> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (!/^[a-z0-9-]{1,20}$/.test(key) || typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 1e9) throw new Error('A card’s number is a whole number from 0.')
    out[key] = value
  }
  return Object.keys(out).length ? out : undefined
}

/** What a whole-board save may not do at once: change the rules and move cards (no edit does both). */
function nestFixed(before: Board, after: Board): string | null {
  const say = JSON.stringify
  const places = (board: Board) => say(board.cards.map(card => [card.id, card.laneId, card.parentId, card.order, card.role]))
  return say(before.behaviour?.rules) !== say(after.behaviour?.rules) && places(before) !== places(after) ? 'Change the rules on their own, then move cards.' : null
}

/** The nest board's part of the one gate (see kinds.ts). */
export const nestRules: BusinessBoardRules = {
  kind: 'nest',
  cards: [40, 'A nested board holds up to 40 cards.'],
  rulebook: nestFamily,
  drags: nestDrags,
  fixed: nestFixed,
  order: (board, laneId) => nestRoots(board, laneId).map(card => card.id),
  readCard(raw, card, read) {
    if (raw.parentId !== undefined) card.parentId = read.id(raw.parentId)
    if (raw.role !== undefined) card.role = roleOf(raw.role)
    if (raw.order !== undefined) {
      if (!isOrderKey(raw.order)) throw new Error('A card’s place is a short key.')
      card.order = raw.order
    }
    if (raw.source !== undefined) card.source = plainText(raw.source, 60, 'Say who said it in plain words.')
    const fields = readFields(raw.fields)
    if (fields) card.fields = fields
    if (plus) plus.readCard(raw, card, read)
    else if (raw.owner !== undefined) throw new Error('This board needs its rules loaded.')
  },
  readBoard(raw, board, read) {
    const nest = raw.nest as Record<string, unknown>
    if (!nest || typeof nest !== 'object' || Array.isArray(nest)) throw new Error('A nested board says how it is drawn.')
    if (nest.layout !== 'clusters' && nest.layout !== 'tree' && nest.layout !== 'matrix') throw new Error('A nested board is drawn as piles, as a tree or as a 2 by 2.')
    const out: NestFields = { layout: nest.layout }
    if (nest.fields !== undefined) {
      if (!Array.isArray(nest.fields) || nest.fields.length > 4) throw new Error('Cards carry up to 4 number fields.')
      out.fields = nest.fields.map(item => {
        const f = (item ?? {}) as Record<string, unknown>
        if (typeof f.id !== 'string' || !/^[a-z0-9-]{1,20}$/.test(f.id)) throw new Error('A field’s id is a short slug.')
        const def: NonNullable<NestFields['fields']>[number] = { id: f.id, label: plainText(f.label, 20, 'Name the field in a word or two.') }
        if (f.currency !== undefined) {
          if (f.currency !== '$' && f.currency !== '€' && f.currency !== '£') throw new Error('A money field’s sign is $, € or £.')
          def.currency = f.currency
        }
        if (f.flag !== undefined) {
          if (f.flag !== true || f.currency !== undefined) throw new Error('A yes/no field is a flag, never money.')
          def.flag = true
        }
        return def
      })
      if (new Set(out.fields.map(item => item.id)).size !== out.fields.length) throw new Error('Duplicate field.')
    }
    if (nest.aliases !== undefined) {
      if (!Array.isArray(nest.aliases) || nest.aliases.length > 12) throw new Error('A board keeps up to 12 merged cards’ new homes.')
      out.aliases = nest.aliases.map(pair => {
        if (!Array.isArray(pair) || pair.length !== 2) throw new Error('A merged card’s new home is a pair of ids.')
        return [read.id(pair[0]), read.id(pair[1])] as [string, string]
      })
    }
    if (plus) plus.readBoard(nest, out, read)
    else if (nest.axes !== undefined || nest.owners !== undefined) throw new Error('This board needs its rules loaded.')
    board.nest = out
  },
  validate: validateNest,
  planMove(board, cardId, laneId) {
    const card = byId(board, cardId)
    if (!card || !board.lanes.some(lane => lane.id === laneId)) return null
    if (card.laneId === laneId && !card.parentId) return board
    return nestPlace(board, cardId, { laneId, under: null, before: null })
  },
  refusal(board, cardId, laneId) {
    const card = byId(board, cardId)
    return card && laneId === nestAreas(board).tray && board.cards.some(item => item.parentId === cardId)
      ? board.lanes[1].label + ' holds loose cards. Move what is under ' + said(card.label) + ' first.' : null
  },
  caption(board, laneId) {
    const more = plus?.caption(board, laneId)
    if (more) return more
    const n = board.cards.filter(card => card.laneId === laneId).length
    if (laneId === nestAreas(board).tray) return n ? n + ' not placed yet' : 'Nothing waiting'
    const roots = nestKids(board, null, laneId).length
    return board.nest?.layout === 'clusters' ? roots + (roots === 1 ? ' pile' : ' piles') + ' · ' + (n - roots) + (n - roots === 1 ? ' note' : ' notes') : n + (n === 1 ? ' card' : ' cards')
  },
  cardText: nestCardText,
  noteText: (_board, card) => card.label,
  fromNote: (_board, text) => ({ label: text.replace(/\s+/g, ' ').trim().slice(0, 80) }),
  renamed: (_board, _cardId, text) => ({ label: text.replace(/\s+/g, ' ').trim(), edits: [] }),
  edit: nestEdit,
}
registerWorkshopRules(nestRules)
