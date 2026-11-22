// Three more nested boards (dragology final.md §3.6–3.8, D5–D7): Impact × effort (a 2 by 2 with a limit per square),
// the reorg & hiring sandbox (an org chart: spans, open roles and contractors that don't manage, a designer per team as
// a warning, a team carried with its manager) and Goals & owners (the twisted trees: a card owned outside the team of
// what it sits under is flagged; when a card changes team, what is under it stays, is asked about, or comes along).
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, attachWorkshop, validateWorkshop, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { behaviourLines } from '../../src/workshops/behaviour'
import {
  checkNest, checkNestMove, nestDrags, nestLegal, nestScores, quadrantOf, behaviourEditsBetween,
} from '../../src/workshops/rules'
import { catalogSamples, goalsSample, impactEffortSample, reorgSample } from '../../src/workshops/samples'
import { kitFor } from '../../src/boards'
import { nestEditsBetween, nestKit, nestLayout } from '../../src/boards/nest'

const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-22T10:00:00.000Z' }
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result.workshop
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused.reason
}
const said = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits, tim)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result.report.edits.map(edit => edit.said).join(' ')
}
const matrix = () => validateWorkshop(impactEffortSample())
const org = () => validateWorkshop(reorgSample())
const goals = () => validateWorkshop(goalsSample())
const card = (board: Workshop, id: string) => board.cards.find(item => item.id === id)!
const ruleId = (board: Workshop, kind: string) => board.behaviour!.rules.find(rule => rule.kind === kind)!.id
const part = (board: Workshop, name: string, layout = {}) => nestLayout(board, layout).parts.find(item => item.name === name)!
/** A whole save of `after` made again as its edits, by the reducer: what the server does. */
const replay = (before: Workshop, after: Workshop) => ok(before, nestEditsBetween(before, after))
const placesOf = (board: Workshop) => board.cards.map(item => [item.id, item.laneId, item.parentId ?? null, item.owner ?? null, JSON.stringify(item.fields ?? null)].join('|')).sort()

describe('Impact × effort (D5)', () => {
  it('the sample: a 2 by 2 of scored cards, two waiting in the tray, and Do now holds 3', () => {
    const board = matrix()
    expect(board.nest!.layout).toBe('matrix')
    expect(quadrantOf(board, card(board, 'search'))).toBe('do-now')
    expect(quadrantOf(board, card(board, 'mobile'))).toBe('plan')
    expect(quadrantOf(board, card(board, 'dark-mode'))).toBe('later')
    expect(quadrantOf(board, card(board, 'billing'))).toBe('skip')
    expect(quadrantOf(board, card(board, 'alerts'))).toBeNull()
    expect(behaviourLines(board)).toContain('Do now holds 3.')
    expect(catalogSamples['impact-effort']).toBe(impactEffortSample)
  })

  it('a fourth card into Do now is refused in the rule’s words, naming the card with the lowest impact there', () => {
    const board = matrix()
    expect(refused(board, [{ kind: 'score_card', card: { id: 'summaries' }, x: 3, y: 9 }])).toBe('Do now holds 3. Exports has the lowest impact there.')
    expect(refused(board, [{ kind: 'score_card', card: { id: 'alerts' }, x: 1, y: 8 }])).toBe('Do now holds 3. Exports has the lowest impact there.')
    // Moving within Do now, or out of it, is never held to the limit; then there is room.
    const within = ok(board, [{ kind: 'score_card', card: { id: 'search' }, x: 1, y: 10 }])
    expect(nestScores(within, card(within, 'search'))).toEqual({ x: 1, y: 10 })
    const later = ok(board, [{ kind: 'score_card', card: { id: 'exports' }, x: 2, y: 3 }])
    expect(quadrantOf(later, card(later, 'exports'))).toBe('later')
    expect(said(later, [{ kind: 'score_card', card: { id: 'summaries' }, x: 3, y: 9 }])).toBe('Scored “AI summaries”: Impact 9, Effort 3 (Do now).')
    // "Do now holds 4": the rule changes in place and the same move lands; a warning lets it land with the sentence.
    const four = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'quadrant'), max: 4 }])
    expect(behaviourLines(four)).toContain('Do now holds 4.')
    const fourth = ok(four, [{ kind: 'score_card', card: { id: 'summaries' }, x: 3, y: 9 }])
    expect(quadrantOf(fourth, card(fourth, 'summaries'))).toBe('do-now')
    const warn = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'quadrant'), severity: 'warn' }])
    const landed = ok(warn, [{ kind: 'score_card', card: { id: 'summaries' }, x: 3, y: 9 }])
    expect(checkNest(warn, landed)).toEqual({ ok: true, warnings: ['Do now holds 3. Exports has the lowest impact there.'] })
  })

  it('scores are whole numbers from 0 to 10, checked exactly; a new card waits in the tray until scored', () => {
    const board = matrix()
    for (const [x, y] of [[11, 3], [3, -1], [2.5, 4]]) expect(refused(board, [{ kind: 'score_card', card: { id: 'alerts' }, x, y }])).toBe('Scores run from 0 to 10.')
    const added = ok(board, [{ kind: 'add_card', lane: { id: 'matrix' }, label: 'Webhooks' }])
    const webhooks = added.cards.find(item => item.label === 'Webhooks')!
    expect(webhooks.laneId).toBe('unscored')
    const scored = ok(added, [{ kind: 'score_card', card: { id: webhooks.id }, x: 8, y: 2 }])
    expect(quadrantOf(scored, card(scored, webhooks.id))).toBe('skip')
    // A card on the square without both scores is no board; a card moved to the square without scores is refused.
    expect(() => validateWorkshop({ ...board, cards: board.cards.map(item => item.id === 'alerts' ? { ...item, laneId: 'matrix' } : item) }))
      .toThrow('“Slack alerts” needs a score on both axes. Say “Score Slack alerts impact 8, effort 3”.')
    expect(refused(board, [{ kind: 'nest_card', card: { id: 'alerts' }, lane: { id: 'matrix' } }])).toMatch(/needs a score on both axes/)
  })

  it('the axes are fields chat renames; the words on cards and in the refusal follow', () => {
    const board = ok(matrix(), [{ kind: 'rename_field', field: 'impact', label: 'Reach' }, { kind: 'rename_field', field: 'Effort', label: 'Confidence' }])
    expect(board.nest!.fields!.map(item => item.label)).toEqual(['Confidence', 'Reach'])
    expect(part(board, 'card-search').text).toBe('Faster search\nReach 8 · Confidence 3')
    expect(part(board, 'caption-axis-y').text).toBe('↑ Reach')
    expect(refused(board, [{ kind: 'score_card', card: { id: 'summaries' }, x: 3, y: 9 }])).toBe('Do now holds 3. Exports has the lowest reach there.')
    expect(refused(board, [{ kind: 'rename_field', field: 'reach', label: 'Confidence' }])).toBe('Cards already carry Confidence.')
  })

  it('a rule phrase changes the next drag: the squares a card may enter differ', () => {
    const board = matrix()
    const four = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'quadrant'), max: 4 }])
    expect(nestDrags(four)).not.toBe(nestDrags(board))
    const plan = ok(board, [{ kind: 'add_rule', rule: { kind: 'quadrant', quadrant: 'plan', max: 2 } as never }])
    expect(nestDrags(plan)).not.toBe(nestDrags(board))
    expect(behaviourLines(plan)).toContain('Plan it holds 2.')
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'quadrant', quadrant: 'do-now', max: 5 } as never }])).toBe('There is already a rule like that on this board. Change that one instead.')
    expect(refused(validateWorkshop(catalogSamples['discovery-tree']()), [{ kind: 'add_rule', rule: { kind: 'quadrant', quadrant: 'plan', max: 2 } as never }])).toBe('Only a 2 by 2 has squares to fill.')
  })

  it('the kit: cards where their scores put them, squares with their counts, the drag rounds to whole scores and a full square holds the card back', () => {
    const board = matrix()
    const square = part(board, 'column-q-do-now'), skip = part(board, 'column-q-skip')
    expect(part(board, 'caption-q-do-now').text).toBe('Do now · 3 of 3')
    const search = part(board, 'card-search')
    expect(search.x + search.width / 2).toBeLessThan(square.x + square.width)
    expect(search.y).toBeLessThan(skip.y)
    const grab = { x: 10, y: 10 }
    const choose = nestKit.chooser(board, 'billing', grab)!
    // Held over Later: the card lands at the scores its box means, rounded; once, as one score_card.
    const later = part(board, 'column-q-later')
    const next = choose({ x: later.x + later.width / 2 + grab.x - 68, y: later.y + later.height / 2 + grab.y - 22 })
    expect(quadrantOf(next, card(next, 'billing'))).toBe('later')
    expect(nestScores(next, card(next, 'billing'))).toEqual({ x: 3, y: 3 })
    expect(nestEditsBetween(board, next)).toEqual([{ kind: 'score_card', card: { id: 'billing' }, x: 3, y: 3 }])
    // Held over Do now (full): it stays where it was, and the refusal says why.
    const target = { x: square.x + 40 + grab.x, y: square.y + 60 + grab.y }
    expect(choose(target)).toBe(board)
    expect(nestKit.refusalAt(board, 'billing', grab, target, {})).toEqual({ laneId: 'matrix', reason: 'Do now holds 3. Exports has the lowest impact there.' })
    // Into the tray: it waits there, its scores kept for when it comes back.
    const tray = part(board, 'column-unscored')
    const parked = choose({ x: tray.x + 40, y: tray.y + tray.height - 40 })
    expect(card(parked, 'billing').laneId).toBe('unscored')
    expect(replay(board, parked).cards.find(item => item.id === 'billing')!.laneId).toBe('unscored')
  })

  it('on a 2 by 2 the arrow keys change a score by one, never past 0 or 10', () => {
    const board = matrix()
    expect(nestKit.keyEdit!(board, 'card-mobile', { key: 'ArrowUp', shiftKey: false })).toEqual([{ kind: 'score_card', card: { id: 'mobile' }, x: 9, y: 8 }])
    expect(nestKit.keyEdit!(board, 'card-mobile', { key: 'ArrowLeft', shiftKey: false })).toEqual([{ kind: 'score_card', card: { id: 'mobile' }, x: 8, y: 7 }])
    expect(nestKit.keyEdit!(ok(board, [{ kind: 'score_card', card: { id: 'mobile' }, x: 10, y: 7 }]), 'card-mobile', { key: 'ArrowRight', shiftKey: false })).toBeNull()
    expect(nestKit.keyEdit!(board, 'card-alerts', { key: 'ArrowUp', shiftKey: false })).toBeNull()
  })

  it('on a phone it is a 358 px square with the tray under it', () => {
    const narrow = { narrow: true, width: 390 }
    const { parts, width } = nestLayout(matrix(), narrow)
    const squareWidth = parts.filter(item => item.name.startsWith('column-q-')).reduce((sum, item) => item.y === parts.find(p => p.name === 'column-q-do-now')!.y ? sum + item.width : sum, 0)
    expect(squareWidth).toBe(358)
    expect(width).toBeLessThanOrEqual(390)
    expect(parts.find(item => item.name === 'card-alerts')!.y).toBeGreaterThan(parts.find(item => item.name === 'column-q-skip')!.y)
  })
})

describe('Reorg & hiring sandbox (D6)', () => {
  it('the sample: an org chart with its rules on the note, and people’s words on their cards', () => {
    const board = org()
    expect(behaviourLines(board)).toEqual(['Not placed yet holds cards not placed yet: no rule applies there.', 'A manager holds at most 6.', 'Open roles don’t manage.',
      'Contractors don’t manage.', 'Every manager has a designer under them (a warning only).', 'Cards nest up to 5 levels deep.'])
    expect(part(board, 'card-jo').text).toBe('Jo Park, Growth\nmanager · 3 reports')
    expect(part(board, 'card-sam').text).toBe('Sam Lee\nengineer · contractor')
  })

  it('a manager dragged under another brings the whole team, as one edit (one undo)', () => {
    const board = org()
    const edits: WorkshopEdit[] = [{ kind: 'nest_card', card: { id: 'jo' }, under: { id: 'priya' } }]
    const next = ok(board, edits)
    expect(['ravi', 'lena', 'sam'].map(id => card(next, id).parentId)).toEqual(['jo', 'jo', 'jo'])
    expect(card(next, 'jo').parentId).toBe('priya')
    expect(nestEditsBetween(board, next)).toEqual(edits)
    // A team is never a candidate under anyone in it.
    expect(nestLegal(board, 'jo').some(({ spot }) => spot.under === 'ravi' || spot.under === 'jo')).toBe(false)
  })

  it('spans, open roles and contractors: refused in the rule’s words; a team without a designer is flagged, never refused', () => {
    const board = org()
    expect(refused(board, [{ kind: 'nest_card', card: { id: 'tom' }, under: { id: 'vp-sales' } }])).toBe('Open roles don’t manage. VP Sales is an open role.')
    expect(refused(board, [{ kind: 'nest_card', card: { id: 'tom' }, under: { id: 'sam' } }])).toBe('Contractors don’t manage. Sam Lee is a contractor.')
    const six = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'children'), max: 3 }])
    expect(refused(six, [{ kind: 'nest_card', card: { id: 'tom' }, under: { id: 'jo' } }])).toBe('Jo Park, Growth holds 3. It has 3.')
    const moved = ok(board, [{ kind: 'nest_card', card: { id: 'lena' }, under: { id: 'kai' } }])
    expect(checkNest(board, moved)).toEqual({ ok: true, warnings: ['Every manager has a designer under them. Jo Park, Growth would have none.'] })
    // An open role filled is a person: set_role, then they can manage.
    const filled = ok(board, [{ kind: 'set_role', card: { id: 'vp-sales' }, role: 'manager' }, { kind: 'nest_card', card: { id: 'ae-1' }, under: { id: 'vp-sales' } }])
    expect(card(filled, 'ae-1').parentId).toBe('vp-sales')
  })

  it('open fields added by chat are data rules can read: a yes/no field, 1 for yes', () => {
    const board = ok(org(), [{ kind: 'add_field', label: 'Remote', flag: true }, { kind: 'set_field', card: { id: 'kai' }, field: 'remote', value: 1 }])
    expect(board.nest!.fields!.at(-1)).toEqual({ id: 'remote', label: 'Remote', flag: true })
    expect(part(board, 'card-kai').text).toBe('Kai Wong, Platform\nmanager · remote · 2 reports')
    expect(refused(board, [{ kind: 'set_field', card: { id: 'kai' }, field: 'remote', value: 2 }])).toBe('“Kai Wong, Platform”’s Remote is yes (1) or no (0).')
    const ruled = ok(board, [{ kind: 'add_rule', rule: { kind: 'parent', not: 'remote' } as never }])
    expect(behaviourLines(ruled)).toContain('Remotes don’t manage.')
    // A new rule never moves anyone: Kai keeps his reports; the next arrival under him is refused.
    expect(card(ruled, 'tom').parentId).toBe('kai')
    expect(refused(ruled, [{ kind: 'nest_card', card: { id: 'ravi' }, under: { id: 'kai' } }])).toBe('Remotes don’t manage. Kai Wong, Platform is a remote.')
  })

  it('a pasted list lands as one batch of new cards, row for row, each under its manager', () => {
    const rows = Array.from({ length: 24 }, (_, i) => ({ name: 'Person ' + (i + 1), role: i % 4 ? 'engineer' : 'manager', under: i % 4 ? 'Person ' + (i - (i % 4) + 1) : i % 8 ? 'Priya Rao, VP Eng' : 'Maya Chen, VP Product' }))
    const edits: WorkshopEdit[] = rows.map(row => ({ kind: 'add_card', lane: { id: 'org' }, label: row.name, role: row.role, under: row.under }))
    const started = performance.now()
    const next = ok(org(), edits)
    expect(performance.now() - started).toBeLessThan(10000)
    for (const row of rows) {
      const made = next.cards.find(item => item.label === row.name)!
      expect([made.role, next.cards.find(item => item.id === made.parentId)!.label]).toEqual([row.role, row.under])
    }
    // Past the board's 40 cards the whole batch is refused and nothing lands.
    expect(refused(org(), [...edits, ...edits.slice(0, 6).map(edit => ({ ...edit, label: (edit as { label: string }).label + 'b' }))])).toBe('A nested board holds up to 40 cards.')
  })

  it('"stop me when a manager has no designer": only a change that leaves a team short is stopped; a new manager is hired before their designer', () => {
    const board = org()
    const strict = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'contains'), severity: 'refuse' }])
    // Losing the team's designer is refused, in the rule's words.
    expect(refused(strict, [{ kind: 'nest_card', card: { id: 'lena' }, under: { id: 'kai' } }])).toBe('Every manager has a designer under them. Jo Park, Growth would have none.')
    // Kai's team has no designer already: marking one of them a contractor, or renaming them, changes nothing the rule reads.
    expect(card(ok(strict, [{ kind: 'set_field', card: { id: 'tom' }, field: 'contractor', value: 1 }]), 'tom').fields).toEqual({ contractor: 1 })
    // A new manager with no one under them yet is not a team: they are added, then their designer, then the rest.
    const hired = ok(strict, [{ kind: 'add_card', lane: { id: 'org' }, label: 'Mia Holt', role: 'manager', under: { id: 'dana' } },
      { kind: 'add_card', lane: { id: 'org' }, label: 'Noa Kim', role: 'designer', under: 'Mia Holt' },
      { kind: 'add_card', lane: { id: 'org' }, label: 'Ola Berg', role: 'engineer', under: 'Mia Holt' }])
    expect(hired.cards.filter(item => item.parentId === hired.cards.find(other => other.label === 'Mia Holt')!.id)).toHaveLength(2)
    // A team short already is not the change's doing: it grows, and a new pod lands under its VP manager first.
    expect(card(ok(strict, [{ kind: 'nest_card', card: { id: 'ravi' }, under: { id: 'kai' } }]), 'ravi').parentId).toBe('kai')
    const pod = ok(strict, [{ kind: 'add_card', lane: { id: 'org' }, label: 'Noor Ali', role: 'manager', under: { id: 'priya' } },
      { kind: 'add_card', lane: { id: 'org' }, label: 'Eli Ford', role: 'engineer', under: 'Noor Ali' }])
    expect(pod.cards.find(item => item.label === 'Eli Ford')!.parentId).toBe(pod.cards.find(item => item.label === 'Noor Ali')!.id)
    // A manager made of someone with a team and no designer is a team left short: stopped.
    expect(refused(strict, [{ kind: 'set_role', card: { id: 'kai' }, role: 'engineer' }, { kind: 'set_role', card: { id: 'kai' }, role: 'manager' }]))
      .toBe('Every manager has a designer under them. Kai Wong, Platform would have none.')
  })

  it('a rulebook that contradicts itself is refused', () => {
    expect(refused(org(), [{ kind: 'add_rule', rule: { kind: 'contains', role: 'open role', of: 'designer', atLeast: 1 } as never }]))
      .toBe('Open roles would need someone under them, and open roles don’t manage.')
  })

  it('check_move matches the drag on an org chart, card by card', () => {
    const board = org()
    for (const item of board.cards) for (const target of board.cards.filter(other => other.laneId === 'org')) {
      const drag = nestLegal(board, item.id).some(({ spot }) => spot.under === target.id)
      expect('ok' in checkNestMove(board, { id: item.id }, { under: { id: target.id } })).toBe(drag)
    }
  })
})

describe('Goals & owners (D7, the twisted trees)', () => {
  it('the sample: three levels, each card owned by a team, the teams drawn above the tree', () => {
    const board = goals()
    expect(behaviourLines(board)).toContain('A card is owned by the team that owns what it sits under (a warning only).')
    expect(part(board, 'card-self-serve').text).toBe('Self-serve upgrades 30%\nGrowth')
    expect(part(board, 'caption-owner-platform').text).toBe('Platform\n3 cards')
    expect(part(board, 'card-activation').y).toBeGreaterThan(part(board, 'caption-owner-growth').y + part(board, 'caption-owner-growth').height)
  })

  it('warn (the default): a key result given to another team lands, flagged cross-team, and what is under it stays', () => {
    const board = goals()
    const next = ok(board, [{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'Platform' }])
    expect(card(next, 'self-serve').owner).toBe('platform')
    expect(card(next, 'pricing-page').owner).toBe('growth')
    expect(part(next, 'card-self-serve').text).toBe('Self-serve upgrades 30%\nPlatform · cross-team')
    expect(checkNest(board, next)).toEqual({ ok: true, warnings: ['Self-serve upgrades 30% is Platform’s; what it sits under is Growth’s.'] })
  })

  it('carry: "bring its initiatives along" makes them come with it; a carry the server works out differently is refused', () => {
    const board = goals()
    const carry = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'carry' }])
    expect(behaviourLines(carry)).toContain('A card is owned by the team that owns what it sits under; moving one to a team brings what is under it along (a warning only).')
    expect(said(carry, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform' }])).toBe('“Onboarding under 10 min” is Platform’s now. 2 cards under it came along.')
    const next = ok(carry, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform' }])
    expect(['guided', 'starters'].map(id => card(next, id).owner)).toEqual(['platform', 'platform'])
    // The page showed one carry; the board as the server has it carries another: refused, never a different carry.
    expect(refused(carry, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform', carry: [{ id: 'guided' }] }])).toBe('The board changed while you were dragging. Try again.')
    // A whole save of the carried move is said as one set_owner with its carry, and kept as made.
    expect(nestEditsBetween(carry, next)).toEqual([{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform', carry: [{ id: 'guided' }, { id: 'starters' }] }])
    expect(placesOf(replay(carry, next))).toEqual(placesOf(next))
    // Under warn, the same save without its carry: the server keeps what was shown, not the rule's carry.
    const shown = ok(board, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform' }])
    expect(refused(carry, nestEditsBetween(board, shown))).toBe('The board changed while you were dragging. Try again.')
  })

  it('ask: the card moves alone, and the warning asks about what stayed; "move what is under it too" brings them', () => {
    const board = goals()
    const ask = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'ask' }])
    const next = ok(ask, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform' }])
    const verdict = checkNest(ask, next) as { warnings: string[] }
    expect(verdict.warnings).toContain('2 cards under Onboarding under 10 min stayed with Growth. Say “Move what is under Onboarding under 10 min to Platform too” to bring them.')
    const brought = ok(next, [{ kind: 'set_owner', card: { id: 'fast-onboarding' }, owner: 'platform', carry: [{ id: 'guided' }, { id: 'starters' }] }])
    expect(['guided', 'starters'].map(id => card(brought, id).owner)).toEqual(['platform', 'platform'])
  })

  it('refuse: "stop me" makes a cross-team owner a refusal; teams are added by chat; owners are checked', () => {
    const board = goals()
    const strict = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), severity: 'refuse' }])
    expect(refused(strict, [{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'platform' }])).toBe('Self-serve upgrades 30% is Platform’s; what it sits under is Growth’s.')
    expect(refused(board, [{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'Data' }])).toBe('The teams on this board are Growth, Platform, Sales.')
    const data = ok(board, [{ kind: 'add_owner', label: 'Data' }, { kind: 'set_owner', card: { id: 'cache' }, owner: 'Data' }])
    expect(card(data, 'cache').owner).toBe('data')
    expect(refused(validateWorkshop(catalogSamples['discovery-tree']()), [{ kind: 'add_rule', rule: { kind: 'sameOwnerAs', mode: 'warn' } as never }]))
      .toBe('This board has no teams that own cards. Say “Add Growth as an owner” first.')
    // A new card under a card takes its team.
    const added = ok(board, [{ kind: 'add_card', lane: { id: 'goals' }, label: 'Status page', role: 'initiative', under: { id: 'latency' } }])
    expect(added.cards.find(item => item.label === 'Status page')!.owner).toBe('platform')
    // A rule's mode is said by the rule edits a whole save amounts to.
    const carry = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'carry' }])
    expect(behaviourEditsBetween(board, carry)).toEqual([{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'carry' }])
  })

  it('refuse: a card already owned outside its parent’s team can still be renamed or given a role; only a change of place or team is held to the rule', () => {
    const board = ok(goals(), [{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'platform' }])
    const strict = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), severity: 'refuse' }])
    expect(card(ok(strict, [{ kind: 'set_role', card: { id: 'self-serve' }, role: 'objective' }]), 'self-serve').role).toBe('objective')
    expect(refused(strict, [{ kind: 'set_owner', card: { id: 'guided' }, owner: 'sales' }])).toBe('Guided setup is Sales’s; what it sits under is Growth’s.')
  })

  it('the kit: a card held over a team goes to it; a refusal over a team says why', () => {
    const board = goals()
    const tile = part(board, 'caption-owner-platform')
    const choose = nestKit.chooser(board, 'self-serve', { x: 10, y: 10 })!
    const next = choose({ x: tile.x + 30, y: tile.y + 20 })
    expect(card(next, 'self-serve').owner).toBe('platform')
    expect(nestEditsBetween(board, next)).toEqual([{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'platform', carry: [] }])
    const strict = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), severity: 'refuse' }])
    expect(nestKit.chooser(strict, 'self-serve', { x: 10, y: 10 })!({ x: tile.x + 30, y: tile.y + 20 })).toBe(strict)
    expect(nestKit.refusalAt(strict, 'self-serve', { x: 10, y: 10 }, { x: tile.x + 30, y: tile.y + 20 }, {})).toEqual({ laneId: 'goals', reason: 'Self-serve upgrades 30% is Platform’s; what it sits under is Growth’s.' })
    // Under carry, the drag shows the cards under it going too, while it is held.
    const carry = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'carry' }])
    const held = nestKit.chooser(carry, 'self-serve', { x: 10, y: 10 })!({ x: tile.x + 30, y: tile.y + 20 })
    expect(part(held, 'card-pricing-page').text).toBe('New pricing page\nPlatform')
    // On a phone there are no team tiles: the teams change by chat.
    expect(nestLayout(board, { narrow: true }).parts.some(item => item.name.startsWith('caption-owner-'))).toBe(false)
  })
})

describe('the three boards attached to a slate, played through the drag policy', () => {
  async function attach(board: Workshop, layout = {}) {
    const notes = new Map<string, any>()
    const changes: { next: Workshop; change: any }[] = []
    const refusals: string[] = []
    const slate: any = {
      policy: null, canvas: { node: document.createElementNS('http://www.w3.org/2000/svg', 'svg') }, announce: () => undefined,
      nodes: {
        add(options: any) {
          const node: any = { id: options.id, options: { ...options }, relationships: { associations: [] }, position(x: number, y: number) { node.options.x = x; node.options.y = y },
            setText(text: string) { node.options.text = text }, setShape() {}, svgGroup: { node: document.createElementNS('http://www.w3.org/2000/svg', 'g'), front() {} } }
          notes.set(options.id, node)
          return node
        },
        one: (id: string) => notes.get(id), remove: (id: string) => notes.delete(id), get allNodes() { return [...notes.values()] },
      },
      removeNode: (id: string) => notes.delete(id),
      hitTestNodes: (point: { x: number; y: number }, nodes: any[], { padding = 0 } = {}) => nodes.find(node => { const o = node.options
        return point.x >= o.x - padding && point.x <= o.x + o.width + padding && point.y >= o.y - padding && point.y <= o.y + o.height + padding }) ?? null,
      setDragPolicy(policy: any) { slate.policy = policy; return () => undefined },
      withPolicyAuthority: (fn: () => void) => fn(),
    }
    const attached = attachWorkshop(slate, board, { kit: kitFor('nest'), origin: { x: 0, y: 0 }, layout,
      onChange: (next, change) => { changes.push({ next, change }) }, onRefuse: refusal => { refusals.push(refusal.reason) } })
    await attached.whenDrawn()
    const box = (name: string) => notes.get(name).options
    const drag = (name: string, grab: { x: number; y: number }, to: { x: number; y: number }) => {
      const node = notes.get(name), o = node.options, from = { x: o.x + grab.x, y: o.y + grab.y }
      expect(slate.policy.onStart(node, from, {})).toBe(true)
      slate.policy.onMove(node, { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 }, {})
      slate.policy.onMove(node, to, {})
      return slate.policy.onEnd(node, to, {})
    }
    return { attached, changes, refusals, box, drag }
  }

  it('Impact × effort: a drag into a full Do now is refused with the sentence; a drag into Later lands as one score_card', async () => {
    const t = await attach(matrix())
    const square = t.box('column-q-do-now')
    t.drag('card-billing', { x: 10, y: 10 }, { x: square.x + 50, y: square.y + 60 })
    expect(t.refusals.at(-1)).toBe('Do now holds 3. Exports has the lowest impact there.')
    expect(quadrantOf(t.attached.value, card(t.attached.value, 'billing'))).toBe('skip')
    const later = t.box('column-q-later')
    t.drag('card-billing', { x: 10, y: 10 }, { x: later.x + 60, y: later.y + 80 })
    expect(t.changes.at(-1)!.change.edits).toHaveLength(1)
    expect(t.changes.at(-1)!.change.edits[0]).toMatchObject({ kind: 'score_card', card: { id: 'billing' } })
    expect(quadrantOf(t.attached.value, card(t.attached.value, 'billing'))).toBe('later')
    t.attached.destroy()
  })

  it('Reorg: a drag under an open role is refused; a manager dragged under another VP brings the team', async () => {
    const t = await attach(org())
    const open = t.box('card-vp-sales')
    t.drag('card-tom', { x: 20, y: 20 }, { x: open.x + 60, y: open.y + 30 })
    expect(t.refusals.at(-1)).toBe('Open roles don’t manage. VP Sales is an open role.')
    expect(card(t.attached.value, 'tom').parentId).toBe('kai')
    const priya = t.box('card-priya')
    t.drag('card-jo', { x: 20, y: 20 }, { x: priya.x + 60, y: priya.y + 30 })
    expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'nest_card', card: { id: 'jo' }, under: { id: 'priya' } }])
    expect(card(t.attached.value, 'lena').parentId).toBe('jo')
    expect(card(t.attached.value, 'jo').parentId).toBe('priya')
    t.attached.destroy()
  })

  it('Goals: a key result dropped on a team goes to it, flagged cross-team', async () => {
    const t = await attach(goals())
    const tile = t.box('caption-owner-platform')
    t.drag('card-self-serve', { x: 20, y: 20 }, { x: tile.x + 40, y: tile.y + 20 })
    expect(t.changes.at(-1)!.change.edits).toEqual([{ kind: 'set_owner', card: { id: 'self-serve' }, owner: 'platform', carry: [] }])
    expect(card(t.attached.value, 'self-serve').owner).toBe('platform')
    expect(part(t.attached.value, 'card-self-serve').text).toBe('Self-serve upgrades 30%\nPlatform · cross-team')
    t.attached.destroy()
  })
})

describe('whole saves the server keeps as made (s4 review)', () => {
  it('a card with no team yet, given one and placed under a card of that team, keeps its team on the server', () => {
    const board = goals()
    // A card added to the tray has no team; it is given one, then nested under a card of that same team.
    const loose = ok(board, [{ kind: 'add_card', lane: { id: 'unplaced' }, label: 'Status page', role: 'initiative' }])
    const id = loose.cards.find(item => item.label === 'Status page')!.id
    expect(card(loose, id).owner).toBeUndefined()
    const next = ok(loose, [{ kind: 'set_owner', card: { id }, owner: 'platform' }, { kind: 'nest_card', card: { id }, under: { id: 'latency' } }])
    expect(card(next, id).owner).toBe('platform')
    expect(placesOf(replay(loose, next))).toEqual(placesOf(next))
  })

  it('under carry, a card added under a card whose team changes in the same save is carried with it, on the page and on the server', () => {
    const board = goals()
    const carry = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'sameOwnerAs'), mode: 'carry' }])
    // Added with the old team, then carried.
    const added = ok(carry, [{ kind: 'add_card', lane: { id: 'goals' }, label: 'Status page', role: 'initiative', under: { id: 'self-serve' } },
      { kind: 'set_owner', card: { id: 'self-serve' }, owner: 'sales' }])
    expect(added.cards.find(item => item.label === 'Status page')!.owner).toBe('sales')
    expect(placesOf(replay(carry, added))).toEqual(placesOf(added))
    // Under warn the same: what the page shows is what the server keeps.
    const warned = ok(board, [{ kind: 'add_card', lane: { id: 'goals' }, label: 'Status page', role: 'initiative', under: { id: 'self-serve' } },
      { kind: 'set_owner', card: { id: 'self-serve' }, owner: 'sales' }])
    expect(placesOf(replay(board, warned))).toEqual(placesOf(warned))
  })

  it('a 2 by 2: a card added and scored in one save lands on the square, not in the tray', () => {
    const board = matrix()
    const next = ok(board, [{ kind: 'add_card', lane: { id: 'matrix' }, label: 'Webhooks' }, { kind: 'score_card', card: 'Webhooks', x: 8, y: 2 }])
    const id = next.cards.find(item => item.label === 'Webhooks')!.id
    expect(quadrantOf(next, card(next, id))).toBe('skip')
    expect(placesOf(replay(board, next))).toEqual(placesOf(next))
  })
})
