// slateboxjs/workshops/nestPlus: three more nested boards on the one hierarchy kind (dragology final.md §3.6–3.8,
// D5–D7), plugged into nest.ts as this module loads (it loads wherever nest.ts does: slateboxjs/workshops/rules on a
// server, the nest kit in a browser).
//
// - Impact × effort (D5): a 2 by 2. Cards carry two scores, 0 to 10, in two fields (the axes; chat renames them).
//   A card is placed by its scores; a square ("Do now") is where both land. Rule: quadrant (a square holds at most
//   so many). score_card sets both scores at once, so a drag is one edit.
// - Reorg & hiring sandbox (D6): an org chart on the tree. A card's role is its job (manager, engineer, open role);
//   yes/no fields (contractor) are data chat adds. Rules: children (span of control, nest.ts), parent (cards that
//   are an open role, or a contractor, have no one under them) and contains (every manager has a designer under
//   them, usually a warning). A card dragged under another brings everyone under it (nestPlace's subtree).
// - Goals & owners (D7, the twisted trees): objectives over key results over initiatives, each owned by a team on
//   the same board. Rule: sameOwnerAs (a card is owned by the team that owns what it sits under), warn by default;
//   its mode says what a change of owner does to the cards under it: nothing (warn), a question (ask), or they come
//   along (carry). A carry the server works out differently from the one the page showed is refused.
//
// Rules read roles, fields and owners, never a card's words. Salaries stay off boards: no field is money per person.
import type { Behaviour, BehaviourRule, BehaviourVerdict } from './behaviour'
import type { Workshop, WorkshopCard } from './model'
import { applyWorkshopEdits, said } from './model'
import type { WorkshopRef } from './edits'
import { extend, nestAreas, nestKids, nestPlace, nestSubtree, registerNestPlus, roleOf, type NestPlus } from './nest'
import { orderKeys } from './order'

type Board = Workshop
type Rule = BehaviourRule
const cap = (text: string) => text.charAt(0).toUpperCase() + text.slice(1)
const plural = (word: string) => /[^aeiou]y$/.test(word) ? word.slice(0, -1) + 'ies' : /(?:s|sh|ch|x)$/.test(word) ? word + 'es' : word + 's'
const an = (word: string) => (/^[aeiou]/i.test(word) ? 'an ' : 'a ') + word
const byId = (board: Board, id: string | undefined) => id === undefined ? undefined : board.cards.find(card => card.id === id)
const plain = (value: unknown, limit: number, why: string) => {
  const text = typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''
  if (!text || text.length > limit || /[<>\u0000-\u001f]/.test(text)) throw new Error(why)
  return text
}
const slugOf = (label: string) => label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 20) || 'item'

// ---------------------------------------------------------------------------------------------
// A 2 by 2.

/** The four squares: which way each axis runs in it (true: the high half, a score of 5 or more). */
export const nestQuadrants = [
  { id: 'do-now', label: 'Do now', high: [false, true] },
  { id: 'plan', label: 'Plan it', high: [true, true] },
  { id: 'later', label: 'Later', high: [false, false] },
  { id: 'skip', label: 'Skip', high: [true, false] },
] as const
const quadrantNamed = (id: string) => nestQuadrants.find(item => item.id === id)
const high = (score: number) => score >= 5

/** A 2 by 2's axes: the fields across and up. */
export function nestAxes(board: Board) {
  const [x, y] = board.nest?.axes ?? []
  const find = (id: string) => board.nest?.fields?.find(item => item.id === id)
  return board.nest?.layout === 'matrix' && x && y ? { x: find(x)!, y: find(y)! } : null
}

/** A card's two scores, or null (in the tray, or not on a 2 by 2). */
export function nestScores(board: Board, card: WorkshopCard): { x: number; y: number } | null {
  const axes = nestAxes(board)
  if (!axes || card.laneId !== nestAreas(board).main) return null
  const x = card.fields?.[axes.x.id], y = card.fields?.[axes.y.id]
  return x === undefined || y === undefined ? null : { x, y }
}

/** The square a card is in, or null. */
export function quadrantOf(board: Board, card: WorkshopCard): string | null {
  const at = nestScores(board, card)
  return at ? nestQuadrants.find(item => item.high[0] === high(at.x) && item.high[1] === high(at.y))!.id : null
}

/** The scores a card takes to land in a square, as near as it can to where it is. */
export function scoresIn(board: Board, card: WorkshopCard, quadrant: string): { x: number; y: number } {
  const q = quadrantNamed(quadrant)!
  const at = nestScores(board, card) ?? { x: q.high[0] ? 7 : 2, y: q.high[1] ? 7 : 2 }
  const fit = (score: number, up: boolean) => up ? Math.max(5, score) : Math.min(4, score)
  return { x: fit(at.x, q.high[0]), y: fit(at.y, q.high[1]) }
}

// ---------------------------------------------------------------------------------------------
// Words a rule reads: a role, or a yes/no field.

const flagField = (board: Board, id: string) => board.nest?.fields?.find(item => item.flag && item.id === id)
/** Whether a card is `what`: it has that role, or says yes in that yes/no field. */
const is = (board: Board, card: WorkshopCard, what: string) => flagField(board, what) ? card.fields?.[what] === 1 : card.role === what
/** "open roles", "contractors". */
const many = (board: Board, what: string) => plural((flagField(board, what)?.label ?? what).toLowerCase())
const ownerOf = (board: Board, id: string | undefined) => board.nest?.owners?.find(item => item.id === id)

// ---------------------------------------------------------------------------------------------
// The rules.

function sentence(rule: Rule, board: Board): string | null {
  switch (rule.kind) {
    case 'quadrant': return (quadrantNamed(rule.quadrant)?.label ?? rule.quadrant) + ' holds ' + rule.max
    case 'parent': return cap(many(board, rule.not)) + ' don’t manage'
    case 'contains': {
      const of = flagField(board, rule.of)?.label.toLowerCase() ?? rule.of
      return 'Every ' + rule.role + ' has ' + (rule.atLeast === 1 ? an(of) : 'at least ' + rule.atLeast + ' ' + plural(of)) + ' under them'
    }
    case 'sameOwnerAs': {
      const who = rule.role ? cap(plural(rule.role)) + ' are' : 'A card is'
      return who + ' owned by the team that owns what ' + (rule.role ? 'they sit' : 'it sits') + ' under' +
        (rule.mode === 'carry' ? '; moving one to a team brings what is under it along' : rule.mode === 'ask' ? '; moving one to a team asks about what is under it' : '')
    }
  }
  return null
}

const keys: Record<string, string> = { quadrant: 'quadrant max', parent: 'not', contains: 'role of atLeast', sameOwnerAs: 'mode role' }

function read(rule: Record<string, unknown>, base: Record<string, unknown>, board: Board): Rule | null {
  const whole = (value: unknown, top: number, why: string) => {
    if (typeof value !== 'number' || !Number.isInteger(value) || value < 1 || value > top) throw new Error(why)
    return value
  }
  switch (rule.kind) {
    case 'quadrant': {
      // (A 2 by 2's own rule: validate checks the board is one, once its fields are read.)
      const q = quadrantNamed(String(rule.quadrant))
      if (!q) throw new Error('A 2 by 2’s squares are Do now, Plan it, Later and Skip.')
      return { ...base, kind: 'quadrant', quadrant: q.id, max: whole(rule.max, 40, 'A square holds from 1 to 40 cards.') } as Rule
    }
    case 'parent': return { ...base, kind: 'parent', not: roleOf(rule.not) } as Rule
    case 'contains':
      return { ...base, kind: 'contains', role: roleOf(rule.role), of: roleOf(rule.of), atLeast: whole(rule.atLeast, 12, 'Say at least 1 to 12.') } as Rule
    case 'sameOwnerAs': {
      if (rule.mode !== 'warn' && rule.mode !== 'ask' && rule.mode !== 'carry') throw new Error('When a card changes team, what is under it stays (warn), is asked about (ask) or comes along (carry).')
      const out = { ...base, kind: 'sameOwnerAs', mode: rule.mode } as Rule & { role?: string }
      if (rule.role !== undefined) out.role = roleOf(rule.role)
      return out
    }
  }
  return null
}

/** Cards that arrived somewhere: new, or under another card, in another area, or with another role or owner. */
function arrivals(before: Board, after: Board) {
  const old = new Map(before.cards.map(card => [card.id, card]))
  return after.cards.filter(card => {
    const was = old.get(card.id)
    return !was || was.parentId !== card.parentId || was.laneId !== card.laneId || was.role !== card.role || was.owner !== card.owner ||
      JSON.stringify(was.fields ?? {}) !== JSON.stringify(card.fields ?? {})
  })
}

const order = ['parent', 'quadrant', 'sameOwnerAs', 'contains']

function check(before: Board, after: Board, warnings: string[]): BehaviourVerdict | null {
  const rules = (before.behaviour?.rules ?? []).filter(rule => rule.on && order.includes(rule.kind)).sort((a, b) => order.indexOf(a.kind) - order.indexOf(b.kind))
  if (!rules.length) return null
  const { tray } = nestAreas(after)
  const came = arrivals(before, after).filter(card => card.laneId !== tray)
  const kidsOf = (board: Board, id: string) => board.cards.filter(card => card.parentId === id).map(card => card.id)
  for (const rule of rules) {
    let found: { sentence: string; card: WorkshopCard } | null = null
    const said0 = sentence(rule, before) + '.'
    if (rule.kind === 'quadrant') {
      const card = came.find(item => {
        const was = byId(before, item.id)
        return quadrantOf(after, item) === rule.quadrant && (!was || quadrantOf(before, was) !== rule.quadrant)
      })
      if (card) {
        const had = before.cards.filter(item => quadrantOf(before, item) === rule.quadrant)
        const now = after.cards.filter(item => quadrantOf(after, item) === rule.quadrant).length
        if (now > rule.max && now > had.length) {
          const axes = nestAxes(before)!
          const low = [...had].sort((a, b) => nestScores(before, a)!.y - nestScores(before, b)!.y)[0]
          found = { sentence: said0 + (low ? ' ' + low.label + ' has the lowest ' + axes.y.label.toLowerCase() + ' there.' : ''), card }
        }
      }
    } else if (rule.kind === 'parent') {
      for (const parent of after.cards) {
        if (!is(after, parent, rule.not)) continue
        const kids = kidsOf(after, parent.id)
        const was = byId(before, parent.id)
        const had = was && is(before, was, rule.not) ? kidsOf(before, parent.id) : []
        const kid = kids.find(id => !had.includes(id))
        if (kid) { found = { sentence: said0 + ' ' + parent.label + ' is ' + (flagField(after, rule.not) ? an(flagField(after, rule.not)!.label.toLowerCase()) : an(rule.not)) + '.', card: byId(after, kid)! }; break }
      }
    } else if (rule.kind === 'contains') {
      const count = (board: Board, id: string) => nestSubtree(board, id).slice(1).filter(key => is(board, byId(board, key)!, rule.of)).length
      // Who joined a team: a new card, or one placed somewhere else (a change of a field or team is not joining).
      const joined = new Set(after.cards.filter(card => { const was = byId(before, card.id); return !was || was.parentId !== card.parentId || was.laneId !== card.laneId }).map(card => card.id))
      // The nearest one first: the team that lost someone, before the people over it.
      for (const head of [...after.cards].sort((a, b) => nestSubtree(after, a.id).length - nestSubtree(after, b.id).length)) {
        if (head.role !== rule.role || head.laneId === tray) continue
        const members = nestSubtree(after, head.id).slice(1)
        // No one under them yet is no team yet: a new manager is added before their designer.
        if (!members.length) continue
        const now = count(after, head.id)
        if (now >= rule.atLeast) continue
        const was = byId(before, head.id)
        const then = was && was.role === rule.role ? count(before, head.id) : -1
        // Held to it: a team that falls short now (it had enough, or is newly one of `role`), or one short already that grows.
        const changed = then === -1 || then >= rule.atLeast || members.some(id => joined.has(id))
        if (changed) { found = { sentence: said0 + ' ' + head.label + ' would have ' + (now ? now : 'none') + '.', card: head }; break }
      }
    } else if (rule.kind === 'sameOwnerAs') {
      const governed = (card: WorkshopCard) => !rule.role || card.role === rule.role
      // A card that changed place or team (a field or role changed is not a change of owner).
      const moved = new Set(came.filter(card => { const was = byId(before, card.id); return !was || was.parentId !== card.parentId || was.laneId !== card.laneId || was.owner !== card.owner }).map(card => card.id))
      for (const card of after.cards) {
        if (!governed(card) || !card.owner || card.laneId === tray) continue
        const parent = byId(after, card.parentId)
        if (!parent?.owner || parent.owner === card.owner) continue
        const was = byId(before, parent.id)
        if (!moved.has(card.id) && was?.owner === parent.owner) continue
        found = { sentence: card.label + ' is ' + ownerOf(after, card.owner)!.label + '’s; what it sits under is ' + ownerOf(after, parent.owner)!.label + '’s.', card }
        break
      }
      // Asked: a card that changed team while cards under it stayed.
      if (rule.mode === 'ask') for (const card of came) {
        const was = byId(before, card.id)
        if (!was?.owner || !card.owner || was.owner === card.owner) continue
        const stayed = nestSubtree(after, card.id).slice(1).filter(id => byId(after, id)!.owner === was.owner)
        if (stayed.length) warnings.push(stayed.length + (stayed.length === 1 ? ' card' : ' cards') + ' under ' + card.label + ' stayed with ' + ownerOf(after, was.owner)!.label +
          '. Say “Move what is under ' + card.label + ' to ' + ownerOf(after, card.owner)!.label + ' too” to bring ' + (stayed.length === 1 ? 'it' : 'them') + '.')
      }
    }
    if (!found) continue
    if (rule.severity === 'warn') { warnings.push(found.sentence); continue }
    return { refused: { sentence: found.sentence, ruleId: rule.id, set: rule.set, cardId: found.card.id, laneId: found.card.laneId } }
  }
  return { ok: true, warnings }
}

function contradiction(behaviour: Behaviour, board: Board): string | null {
  const seen = new Set<string>()
  for (const rule of behaviour.rules) {
    if (!order.includes(rule.kind)) continue
    const key = rule.kind + ':' + (rule.kind === 'quadrant' ? rule.quadrant : rule.kind === 'parent' ? rule.not : rule.kind === 'contains' ? rule.role + '>' + rule.of : '')
    if (seen.has(key)) return 'There is already a rule like that on this board. Change that one instead.'
    seen.add(key)
    if (rule.kind === 'contains' && rule.on && rule.severity === 'refuse' && behaviour.rules.some(other => other.on && other.severity === 'refuse' && other.kind === 'parent' && other.not === rule.role)) {
      return cap(plural(rule.role)) + ' would need someone under them, and ' + many(board, rule.role) + ' don’t manage.'
    }
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// The boards' own fields.

function readBoard(raw: Record<string, unknown>, out: NonNullable<Workshop['nest']>, read: { id(value: unknown): string }) {
  if (raw.axes !== undefined) {
    if (!Array.isArray(raw.axes) || raw.axes.length !== 2 || raw.axes[0] === raw.axes[1]) throw new Error('A 2 by 2 reads two fields, one across and one up.')
    out.axes = [read.id(raw.axes[0]), read.id(raw.axes[1])]
  }
  if (raw.owners !== undefined) {
    if (!Array.isArray(raw.owners) || raw.owners.length > 8) throw new Error('A board has up to 8 teams that own cards.')
    out.owners = raw.owners.map(item => {
      const owner = (item ?? {}) as Record<string, unknown>
      return { id: read.id(owner.id), label: plain(owner.label, 30, 'Name a team in a few words.') }
    })
    if (new Set(out.owners.map(item => item.id)).size !== out.owners.length) throw new Error('Duplicate team.')
  }
}

function readCard(raw: Record<string, unknown>, card: WorkshopCard, read: { id(value: unknown): string }) {
  if (raw.owner !== undefined) card.owner = read.id(raw.owner)
}

function validate(board: Board): string | null {
  const nest = board.nest!
  const { main } = nestAreas(board)
  const rules = board.behaviour?.rules ?? []
  if (nest.layout !== 'matrix' && rules.some(rule => rule.kind === 'quadrant')) return 'Only a 2 by 2 has squares to fill.'
  if (!nest.owners?.length && rules.some(rule => rule.kind === 'sameOwnerAs')) return 'This board has no teams that own cards. Say “Add Growth as an owner” first.'
  for (const f of nest.fields ?? []) if (f.flag) {
    const bad = board.cards.find(card => card.fields?.[f.id] !== undefined && card.fields[f.id] > 1)
    if (bad) return said(bad.label) + '’s ' + f.label + ' is yes (1) or no (0).'
  }
  for (const card of board.cards) if (card.owner !== undefined && !ownerOf(board, card.owner)) return said(card.label) + ' is owned by a team that is no longer on the board.'
  if (nest.layout !== 'matrix') return nest.axes ? 'Only a 2 by 2 has axes.' : null
  const axes = nestAxes(board)
  if (!axes?.x || !axes.y || axes.x.flag || axes.y.flag) return 'A 2 by 2 reads two number fields, one across and one up.'
  for (const card of board.cards) {
    if (card.parentId) return 'A 2 by 2 places cards side by side: nothing sits under another.'
    if (card.laneId !== main) continue
    const at = nestScores(board, card)
    if (!at) return said(card.label) + ' needs a score on both axes. Say “Score ' + card.label + ' ' + axes.y.label.toLowerCase() + ' 8, ' + axes.x.label.toLowerCase() + ' 3”.'
    if (at.x > 10 || at.y > 10) return 'Scores run from 0 to 10.'
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// Edits.

/** The board with a card at these scores (from the tray too): null when it can't be placed. */
export function scoreBoard(board: Board, cardId: string, x: number, y: number): Board | null {
  const axes = nestAxes(board)
  const card = byId(board, cardId)
  if (!axes || !card || board.cards.some(item => item.parentId === cardId)) return null
  const { main } = nestAreas(board)
  const placed = card.laneId === main ? board : nestPlace(board, cardId, { laneId: main, under: null, before: null })
  if (!placed) return null
  return { ...placed, cards: placed.cards.map(item => item.id === cardId ? { ...item, fields: { ...item.fields, [axes.x.id]: x, [axes.y.id]: y } } : item) }
}

const field = (board: Board, name: string) => (board.nest?.fields ?? []).find(item => item.id === name || item.label.toLowerCase() === String(name).toLowerCase())

const edit: NestPlus['edit'] = (board, edit, t, settle) => {
  switch (edit.kind) {
    case 'score_card': {
      const card = t.card(edit.card)
      const axes = nestAxes(board)
      if (!axes) t.refuse('Only a 2 by 2 scores cards.', { code: 'invalid_edit' })
      for (const score of [edit.x, edit.y]) if (!Number.isInteger(score) || score < 0 || score > 10) t.refuse('Scores run from 0 to 10.', { cardId: card.id })
      const next = scoreBoard(board, card.id, edit.x, edit.y)
      if (!next) t.refuse(said(card.label) + ' has cards under it, so it can’t be scored.', { cardId: card.id })
      const done = settle(next!, nestAreas(board).main, card.id)
      const q = nestQuadrants.find(item => item.id === quadrantOf(done, done.cards.find(item => item.id === card.id)!))!
      return t.done(done, 'Scored ' + said(card.label) + ': ' + axes!.y.label + ' ' + edit.y + ', ' + axes!.x.label + ' ' + edit.x + ' (' + q.label + ').', { laneId: nestAreas(board).main, cardId: card.id })
    }
    case 'rename_field': {
      const f = field(board, edit.field)
      if (!f) t.refuse('Cards on this board carry no ' + edit.field + '.', { code: 'unknown_reference' })
      let label = ''
      try { label = plain(edit.label, 20, 'Name the field in a word or two.') } catch (error) { t.refuse((error as Error).message) }
      if (board.nest!.fields!.some(item => item !== f && item.label.toLowerCase() === label.toLowerCase())) t.refuse('Cards already carry ' + label + '.')
      const next = settle({ ...board, nest: { ...board.nest!, fields: board.nest!.fields!.map(item => item === f ? { ...item, label } : item) } })
      return t.done(next, 'Renamed ' + said(f!.label) + ' to ' + said(label) + '.')
    }
    case 'add_owner': {
      let label = ''
      try { label = plain(edit.label, 30, 'Name the team in a few words.') } catch (error) { t.refuse((error as Error).message) }
      const owners = board.nest!.owners ?? []
      if (owners.some(item => item.label.toLowerCase() === label.toLowerCase())) t.refuse(label + ' owns cards here already.')
      if (owners.length >= 8) t.refuse('A board has up to 8 teams that own cards.')
      let id = slugOf(label)
      for (let n = 2; owners.some(item => item.id === id); n++) id = slugOf(label).slice(0, 17) + '-' + n
      const next = settle({ ...board, nest: { ...board.nest!, owners: [...owners, { id, label }] } })
      return t.done(next, label + ' can own cards now.')
    }
    case 'set_owner': {
      const card = t.card(edit.card)
      const owners = board.nest?.owners ?? []
      const owner = owners.find(item => item.id === edit.owner || item.label.toLowerCase() === String(edit.owner).toLowerCase())
      if (!owner) t.refuse(owners.length ? 'The teams on this board are ' + owners.map(item => item.label).join(', ') + '.' : 'This board has no teams that own cards. Say “Add Growth as an owner” first.', { cardId: card.id, code: 'unknown_reference' })
      const rule = (board.behaviour?.rules ?? []).find(item => item.on && item.kind === 'sameOwnerAs') as { mode: string } | undefined
      const under = nestSubtree(board, card.id).slice(1)
      // What comes along: under carry, every card under it that was its team's; asked for, the cards named.
      const expected = rule?.mode === 'carry' && card.owner !== owner!.id ? under.filter(id => byId(board, id)!.owner === card.owner) : []
      let carry = expected
      if (edit.carry !== undefined) {
        const named = edit.carry.map(ref => t.card(ref as WorkshopRef).id)
        if (named.some(id => !under.includes(id))) t.refuse('Only cards under ' + said(card.label) + ' come along with it.', { cardId: card.id })
        if (expected.length || (rule?.mode === 'carry' && card.owner !== owner!.id)) {
          if ([...named].sort().join() !== [...expected].sort().join()) t.refuse('The board changed while you were dragging. Try again.', { cardId: card.id })
        }
        carry = named
      }
      const moving = new Set([card.id, ...carry])
      const next = settle({ ...board, cards: board.cards.map(item => moving.has(item.id) ? { ...item, owner: owner!.id } : item) }, card.laneId, card.id)
      const came = carry.length ? ' ' + carry.length + (carry.length === 1 ? ' card' : ' cards') + ' under it came along.' : ''
      return t.done(next, card.owner === owner!.id && carry.length ? 'Moved what is under ' + said(card.label) + ' to ' + owner!.label + '.' : said(card.label) + ' is ' + owner!.label + '’s now.' + came, { laneId: card.laneId, cardId: card.id })
    }
  }
  return null
}

// ---------------------------------------------------------------------------------------------
// Words on the board.

/** An org chart: a board whose cards are people (a manager or an open role among them). */
export const isOrgChart = (board: Board) => board.nest?.layout === 'tree' && board.cards.some(card => card.role === 'manager' || card.role === 'open role')

function cardText(board: Board, card: WorkshopCard): string | null {
  const at = nestScores(board, card)
  if (at) {
    const axes = nestAxes(board)!
    return card.label + '\n' + axes.y.label + ' ' + at.y + ' · ' + axes.x.label + ' ' + at.x
  }
  if (board.nest?.layout === 'matrix') return card.label
  if (board.nest?.owners?.length) {
    const owner = ownerOf(board, card.owner), parent = byId(board, card.parentId)
    const cross = owner && parent?.owner && parent.owner !== card.owner
    return card.label + (owner ? '\n' + owner.label + (cross ? ' · cross-team' : '') : '')
  }
  if (isOrgChart(board)) {
    const kids = board.cards.filter(item => item.parentId === card.id).length
    const limit = (board.behaviour?.rules ?? []).find(rule => rule.on && rule.kind === 'children' && (!rule.role || rule.role === card.role)) as { max: number } | undefined
    const flags = (board.nest?.fields ?? []).filter(f => f.flag && card.fields?.[f.id] === 1).map(f => f.label.toLowerCase())
    const bits = [card.role ?? '', ...flags, kids ? kids + (kids === 1 ? ' report' : ' reports') + (limit && kids > limit.max ? ', limit ' + limit.max : '') : ''].filter(Boolean)
    return card.label + (bits.length ? '\n' + bits.join(' · ') : '')
  }
  return null
}

/** Where every card may go on a 2 by 2 (the squares it may enter), or to which team, as one string: the library's "changes the next drag". */
function drags(board: Board): string | null {
  const axes = nestAxes(board)
  // With owners: what a drop of each card on each team makes (refused, or the cards that go).
  if (board.nest?.owners?.length) return JSON.stringify(board.cards.map(card => board.nest!.owners!.map(owner => {
    const made = applyWorkshopEdits(board, [{ kind: 'set_owner', card: { id: card.id }, owner: owner.id }])
    return 'refused' in made ? 0 : made.workshop.cards.filter(item => item.owner === owner.id).length
  })))
  if (!axes) return null
  return JSON.stringify([board.nest!.axes, axes.x.label, axes.y.label, board.cards.map(card => nestQuadrants.map(q => {
    const { x, y } = scoresIn(board, card, q.id)
    const made = applyWorkshopEdits(board, [{ kind: 'score_card', card: { id: card.id }, x, y }])
    return 'refused' in made ? 0 : 1
  }).join(''))])
}

function caption(board: Board, laneId: string): string | null {
  if (board.nest?.layout !== 'matrix') return null
  const n = board.cards.filter(card => card.laneId === laneId).length
  return laneId === nestAreas(board).tray ? (n ? n + ' not scored yet' : 'Everything is scored') : n + (n === 1 ? ' card scored' : ' cards scored')
}

registerNestPlus({ keys, read, sentence, check, contradiction, readBoard, readCard, validate, edit, cardText, drags, caption })

const nestOnly = ['nest' as const]
const cardRef = (about: string) => ({ type: 'ref' as const, of: 'card' as const, about })
const score = (about: string) => ({ type: 'integer' as const, min: 0, max: 10, about })
extend({
  kinds: [
    { kind: 'score_card', summary: 'Impact × effort: place a card by its two scores, 0 to 10 (x across, y up). A card in the tray comes onto the 2 by 2.', intent: true,
      fields: { card: cardRef('The card.'), x: score('The score across (effort).'), y: score('The score up (impact).') }, boards: nestOnly, refusals: {} },
    { kind: 'rename_field', summary: 'Nest board: rename a field (an axis of a 2 by 2: Reach, Confidence…).', intent: false,
      fields: { field: { type: 'text', max: 20, about: 'The field, by id or name.' }, label: { type: 'text', max: 20, about: 'Its new name.' } }, boards: nestOnly, refusals: {} },
    { kind: 'add_owner', summary: 'Goals & owners: add a team that can own cards. Up to 8.', intent: false,
      fields: { label: { type: 'text', max: 30, about: 'The team’s name.' } }, boards: nestOnly, refusals: {} },
    { kind: 'set_owner', summary: 'Goals & owners: give a card to a team. carry: the cards under it that come along (left out, the ownership rule decides; a different carry than it works out is refused).', intent: true,
      fields: { card: cardRef('The card.'), owner: { type: 'text', max: 30, about: 'The team, by id or name.' },
        carry: { type: 'refs', of: 'card', min: 0, max: 40, optional: true, about: 'The cards under it that come along.' } }, boards: nestOnly, refusals: {} },
  ],
  boards: {},
  fields: { set_rule: { mode: { type: 'choice', values: ['warn', 'ask', 'carry'], optional: true, about: 'Goals & owners: what a change of team does to the cards under a card.' } } },
  rules: { kinds: ['quadrant', 'parent', 'contains', 'sameOwnerAs'],
    keys: { quadrant: { enum: nestQuadrants.map(item => item.id) }, not: { type: 'string', maxLength: 24 }, of: { type: 'string', maxLength: 24 },
      atLeast: { type: 'integer', minimum: 1, maximum: 12 }, mode: { enum: ['warn', 'ask', 'carry'] } } },
})

// ---------------------------------------------------------------------------------------------
// The library's boards.

type Item = [id: string, label: string, extra?: Partial<WorkshopCard>]
function laid(laneId: string, items: Item[], parentId?: string): WorkshopCard[] {
  const at = orderKeys(items.length)
  return items.map(([id, label, extra], i) => ({ id, label, laneId, order: at[i], ...(parentId && { parentId }), ...extra }))
}
const preset = (rules: Array<Record<string, unknown>>): Behaviour => ({ version: 1, rev: 0,
  rules: rules.map((rule, i) => ({ id: 'rule-' + (i + 1), on: true, severity: 'refuse', set: { by: 'Slatebox', at: '2026-11-21T00:00:00.000Z', via: 'preset' }, ...rule }) as never) })

/** Impact × effort: what to work on next, scored; Do now already holds its three. */
export function impactEffortSample(): Board {
  const at = (effort: number, impact: number) => ({ fields: { effort, impact } })
  return {
    version: 1, kind: 'nest', title: 'Impact × effort',
    nest: { layout: 'matrix', fields: [{ id: 'effort', label: 'Effort' }, { id: 'impact', label: 'Impact' }], axes: ['effort', 'impact'] },
    lanes: [{ id: 'matrix', label: 'Impact × effort' }, { id: 'unscored', label: 'Not scored yet' }],
    cards: [
      ...laid('matrix', [['search', 'Faster search', at(3, 8)], ['sso', 'SSO', at(4, 9)], ['exports', 'Exports', at(2, 6)], ['mobile', 'Mobile app', at(9, 7)],
        ['summaries', 'AI summaries', at(7, 6)], ['dark-mode', 'Dark mode', at(2, 3)], ['billing', 'Rewrite billing', at(9, 2)]]),
      ...laid('unscored', [['alerts', 'Slack alerts'], ['audit', 'Audit log']]),
    ],
    behaviour: preset([{ kind: 'quadrant', quadrant: 'do-now', max: 3 }]),
  }
}

/** Reorg & hiring sandbox: who reports to whom, open roles, a contractor; spans, open roles and designers as rules. */
export function reorgSample(): Board {
  const person = (role: string, contractor = false) => ({ role, ...(contractor && { fields: { contractor: 1 } }) })
  return {
    version: 1, kind: 'nest', title: 'Reorg & hiring sandbox', nest: { layout: 'tree', fields: [{ id: 'contractor', label: 'Contractor', flag: true }] },
    lanes: [{ id: 'org', label: 'Org chart' }, { id: 'unplaced', label: 'Not placed yet' }],
    cards: [
      ...laid('org', [['dana', 'Dana Ito, CEO', person('manager')]]),
      ...laid('org', [['maya', 'Maya Chen, VP Product', person('manager')], ['priya', 'Priya Rao, VP Eng', person('manager')], ['vp-sales', 'VP Sales', person('open role')]], 'dana'),
      ...laid('org', [['jo', 'Jo Park, Growth', person('manager')]], 'maya'),
      ...laid('org', [['ravi', 'Ravi Shah', person('engineer')], ['lena', 'Lena Ortiz', person('designer')], ['sam', 'Sam Lee', person('engineer', true)]], 'jo'),
      ...laid('org', [['kai', 'Kai Wong, Platform', person('manager')]], 'priya'),
      ...laid('org', [['tom', 'Tom Berg', person('engineer')], ['ivy', 'Ivy Moss', person('engineer')]], 'kai'),
      ...laid('unplaced', [['ae-1', 'Account exec 1', person('open role')], ['ae-2', 'Account exec 2', person('open role')]]),
    ],
    behaviour: preset([{ kind: 'children', role: 'manager', max: 6 }, { kind: 'parent', not: 'open role' }, { kind: 'parent', not: 'contractor' },
      { kind: 'contains', role: 'manager', of: 'designer', atLeast: 1, severity: 'warn' }, { kind: 'depth', max: 5 }]),
  }
}

/** Goals & owners: objectives, key results and initiatives, each owned by a team; a key result owned outside its objective's team is flagged. */
export function goalsSample(): Board {
  const own = (role: string, owner: string) => ({ role, owner })
  return {
    version: 1, kind: 'nest', title: 'Goals & owners',
    nest: { layout: 'tree', owners: [{ id: 'growth', label: 'Growth' }, { id: 'platform', label: 'Platform' }, { id: 'sales', label: 'Sales' }] },
    lanes: [{ id: 'goals', label: 'Goals' }, { id: 'unplaced', label: 'Not placed yet' }],
    cards: [
      ...laid('goals', [['activation', 'Activation to 40%', own('objective', 'growth')], ['uptime', '99.9% uptime', own('objective', 'platform')]]),
      ...laid('goals', [['fast-onboarding', 'Onboarding under 10 min', own('key result', 'growth')], ['self-serve', 'Self-serve upgrades 30%', own('key result', 'growth')]], 'activation'),
      ...laid('goals', [['guided', 'Guided setup', own('initiative', 'growth')], ['starters', 'Starter templates', own('initiative', 'growth')]], 'fast-onboarding'),
      ...laid('goals', [['pricing-page', 'New pricing page', own('initiative', 'growth')]], 'self-serve'),
      ...laid('goals', [['latency', 'p95 under 300 ms', own('key result', 'platform')]], 'uptime'),
      ...laid('goals', [['cache', 'Cache the hot paths', own('initiative', 'platform')]], 'latency'),
      ...laid('unplaced', [['partners', 'Partner channel live', own('key result', 'sales')]]),
    ],
    behaviour: preset([{ kind: 'nests', role: 'key result', under: ['objective'] }, { kind: 'nests', role: 'initiative', under: ['key result'] },
      { kind: 'sameOwnerAs', mode: 'warn', severity: 'warn' }, { kind: 'depth', max: 3 }]),
  }
}
