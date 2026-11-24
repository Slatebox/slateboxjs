// The nest boards (dragology final.md D4): lists in lists on one substrate (parentId, a free role, fractional
// order), its rules as data (nests, children, depth, rank, emptyDrop), its edits, exec's check, and the kit's
// three layouts and Dragology chooser.
import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, attachWorkshop, checkWorkshopReplacement, validateWorkshop, workshopCardAsNoteRefusal, workshopNoteCandidate, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { behaviourLines } from '../../src/workshops/behaviour'
import {
  byOrder, checkNest, checkNestMove, nestDrags, nestEmptyDrop, nestKids, nestLegal, nestMeasure, nestPlace, nestRoots, orderBetween, orderKeys, behaviourEditsBetween,
} from '../../src/workshops/rules'
import { catalogSamples, discoveryTreeSample, sortEvidenceSample, breakDownSample, incidentReviewSample } from '../../src/workshops/samples'
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
const evidence = () => validateWorkshop(sortEvidenceSample())
const tree = () => validateWorkshop(discoveryTreeSample())
const parentOf = (board: Workshop, id: string) => board.cards.find(card => card.id === id)!.parentId
const ruleId = (board: Workshop, kind: string, role?: string) => board.behaviour!.rules.find(rule => rule.kind === kind && (!role || (rule as { role?: string }).role === role))!.id
const centre = (board: Workshop, id: string, layout = {}) => {
  const part = nestLayout(board, layout).parts.find(item => item.name === 'card-' + id)!
  return { x: part.x + part.width / 2, y: part.y + part.height / 2, part }
}

describe('fractional order', () => {
  it('makes a key between any two, and at either end, without renumbering', () => {
    const keys = orderKeys(5)
    expect([...keys].sort()).toEqual(keys)
    let low = keys[0], high = keys[1]
    for (let i = 0; i < 40; i++) {
      const mid = orderBetween(low, high)
      expect(mid > low && mid < high).toBe(true)
      expect(mid.endsWith('0')).toBe(false)
      if (i % 2) low = mid
      else high = mid
    }
    expect(orderBetween(null, keys[0]) < keys[0]).toBe(true)
    expect(orderBetween(keys[4], null) > keys[4]).toBe(true)
    expect(orderBetween('0V', '1') > '0V').toBe(true)
  })

  it('two people inserting at the same place at once both keep their card, in the same order on every copy', () => {
    const board = evidence()
    const [first, second] = nestKids(board, 'onboarding')
    // Each person's copy: the same neighbours, so the same key; siblings sort by key and then by id.
    const mine = nestPlace(board, 'csv-export', { laneId: 'piles', under: 'onboarding', before: second.id })!
    const theirs = nestPlace(board, 'seats', { laneId: 'piles', under: 'onboarding', before: second.id })!
    const key = (b: Workshop, id: string) => b.cards.find(card => card.id === id)!.order!
    expect(key(mine, 'csv-export')).toBe(key(theirs, 'seats'))
    const merged = { ...board, cards: board.cards.map(card => card.id === 'csv-export' ? mine.cards.find(item => item.id === card.id)! : card.id === 'seats' ? theirs.cards.find(item => item.id === card.id)! : card) }
    expect(nestKids(merged, 'onboarding').map(card => card.id)).toEqual([first.id, 'csv-export', 'seats', second.id, 'invites'])
    // The server makes them one after the other on the board as it stands: distinct keys, both kept.
    const served = ok(board, [{ kind: 'nest_card', card: { id: 'csv-export' }, under: { id: 'onboarding' }, before: { id: second.id } },
      { kind: 'nest_card', card: { id: 'seats' }, under: { id: 'onboarding' }, before: { id: second.id } }])
    const ids = nestKids(served, 'onboarding').map(card => card.id)
    expect(ids).toEqual([first.id, 'csv-export', 'seats', second.id, 'invites'])
    expect(new Set(nestKids(served, 'onboarding').map(card => card.order)).size).toBe(5)
    // Equal keys are given fresh ones the next time someone places a card beside them.
    const again = nestPlace(merged, 'trust', { laneId: 'piles', under: 'onboarding', before: 'seats' })!
    expect(nestKids(again, 'onboarding').map(card => card.id)).toEqual([first.id, 'csv-export', 'trust', 'seats', second.id, 'invites'])
    expect(new Set(nestKids(again, 'onboarding').map(card => card.order)).size).toBe(6)
  })

  it('keys stay short however often a card goes to one end: siblings are given fresh keys in their order (review s3-nest finding 2)', () => {
    let board = evidence()
    for (let n = 0; n < 600; n++) {
      board = ok(board, [{ kind: 'nest_card', card: n % 2 ? 'setup-days' : 'where-start', under: 'Onboarding' }])
      board = validateWorkshop(JSON.parse(JSON.stringify(board)))
    }
    expect(nestKids(board, 'onboarding').map(card => card.id)).toEqual(['invites', 'where-start', 'setup-days'])
    expect(Math.max(...board.cards.map(card => card.order?.length ?? 0))).toBeLessThanOrEqual(17)
    // At the front too.
    for (let n = 0; n < 300; n++) board = ok(board, [{ kind: 'nest_card', card: n % 2 ? 'invites' : 'setup-days', under: 'Onboarding', before: nestKids(board, 'onboarding')[0].id }])
    expect(Math.max(...board.cards.map(card => card.order?.length ?? 0))).toBeLessThanOrEqual(17)
  })

  it('sorts by key, then id; a card without a key comes first', () => {
    expect([{ id: 'b', order: 'V' }, { id: 'a', order: 'V' }, { id: 'c' }].sort(byOrder).map(item => item.id)).toEqual(['c', 'a', 'b'])
  })
})

describe('the nest substrate', () => {
  it('the library’s boards are valid, with their rules on the note', () => {
    for (const make of [sortEvidenceSample, discoveryTreeSample, breakDownSample, incidentReviewSample]) expect(() => validateWorkshop(make())).not.toThrow()
    expect(behaviourLines(evidence())).toEqual(['Unsorted holds cards not placed yet: no rule applies there.', 'Notes sit under a pile.',
      'Cards nest one level deep.', 'Piles rank by number of customers.', 'A card let go in empty space starts a new pile.'])
    expect(behaviourLines(tree())).toContain('Solutions sit under an opportunity.')
    expect(behaviourLines(validateWorkshop(breakDownSample()))).toContain('Actions sit under a cause (a warning only).')
    expect(Object.keys(catalogSamples)).toEqual(expect.arrayContaining(['sort-evidence', 'discovery-tree', 'break-down', 'incident-review']))
  })

  it('holds 40 cards (the nest cap); a lane board still holds 24', () => {
    const board = evidence()
    const many = { ...board, cards: [...board.cards, ...Array.from({ length: 40 - board.cards.length }, (_, i) => ({ id: 'extra-' + i, label: 'Extra ' + i, laneId: 'unsorted', order: orderKeys(40)[i] }))] }
    expect(validateWorkshop(many).cards).toHaveLength(40)
    expect(() => validateWorkshop({ ...many, cards: [...many.cards, { id: 'one-more', label: 'One more', laneId: 'unsorted' }] })).toThrow('A nested board holds up to 40 cards.')
    expect(() => validateWorkshop({ version: 1, title: 'Lanes', lanes: [{ id: 'a', label: 'A' }, { id: 'b', label: 'B' }],
      cards: Array.from({ length: 25 }, (_, i) => ({ id: 'c' + i, label: 'C' + i, laneId: 'a' })) })).toThrow('A workshop supports up to 24 cards.')
  })

  it('refuses a cycle, a parent in another area, and a card under another in the tray', () => {
    const board = evidence()
    const cards = (change: (card: Workshop['cards'][number]) => Workshop['cards'][number]) => ({ ...board, cards: board.cards.map(change) })
    expect(() => validateWorkshop(cards(card => card.id === 'onboarding' ? { ...card, parentId: 'setup-days' } : card))).toThrow(/never under themselves/)
    expect(() => validateWorkshop(cards(card => card.id === 'trust' ? { ...card, parentId: 'onboarding' } : card))).toThrow(/another area/)
    expect(() => validateWorkshop(cards(card => card.id === 'mobile' ? { ...card, parentId: 'trust' } : card))).toThrow(/Unsorted holds loose cards/)
  })

  it('never offers a cycle as a candidate: not under itself, nor under anything under it', () => {
    const board = tree()
    const under = nestLegal(board, 'slow-onboarding').map(({ spot }) => spot.under)
    expect(under).not.toContain('slow-onboarding')
    expect(under).not.toContain('guided-setup')
    expect(under).not.toContain('csv-import')
    expect(refused(board, [{ kind: 'nest_card', card: 'Onboarding is slow', under: 'CSV import' }])).toBe('A card can’t go under itself or a card under it.')
  })

  it('a card with cards under it stays a card; a leaf may leave as a note', () => {
    expect(workshopCardAsNoteRefusal(evidence(), 'onboarding')).toBe('Onboarding has cards under it, so it stays a card. Move them first.')
    expect(workshopCardAsNoteRefusal(evidence(), 'invites')).toBeNull()
  })
})

describe('the rules', () => {
  it('the discovery loop: a solution under the outcome is refused, chat changes the rule, the same move lands', () => {
    const board = tree()
    const move: WorkshopEdit = { kind: 'nest_card', card: { id: 'csv-import' }, under: { id: 'outcome' } }
    expect(refused(board, [move])).toBe('Solutions sit under an opportunity.')
    // The drag says the same: held over the outcome, the rule's sentence; the outcome is no candidate.
    const at = centre(board, 'outcome')
    expect(nestKit.refusalAt(board, 'csv-import', { x: 10, y: 10 }, at, {})).toEqual({ laneId: 'tree', reason: 'Solutions sit under an opportunity.' })
    expect(nestLegal(board, 'csv-import').some(({ spot }) => spot.under === 'outcome')).toBe(false)
    // "Let solutions sit under the outcome for now": the rule is changed, nothing moves, the drag now lands.
    const changed = ok(board, [{ kind: 'remove_rule', rule: ruleId(board, 'nests', 'solution') },
      { kind: 'add_rule', rule: { kind: 'nests', role: 'solution', under: ['opportunity', 'outcome'] } as never }])
    expect(changed.cards).toEqual(board.cards)
    expect(behaviourLines(changed)).toContain('Solutions sit under an opportunity or an outcome.')
    expect(nestKit.refusalAt(changed, 'csv-import', { x: 10, y: 10 }, at, {})).toBeNull()
    expect(parentOf(ok(changed, [move]), 'csv-import')).toBe('outcome')
  })

  it('warn instead of blocking: the card lands, with the sentence as a warning', () => {
    const board = tree()
    const warned = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'nests', 'solution'), severity: 'warn' }])
    const moved = ok(warned, [{ kind: 'nest_card', card: 'CSV import', under: 'Activation to 40%' }])
    expect(parentOf(moved, 'csv-import')).toBe('outcome')
    expect(checkNest(warned, moved)).toEqual({ ok: true, warnings: ['Solutions sit under an opportunity.'] })
    expect(checkNestMove(warned, 'CSV import', { under: 'Activation to 40%' })).toEqual({ ok: true, warnings: ['Solutions sit under an opportunity.'] })
  })

  it('a pile holds at most so many; a new limit moves nothing and refuses the next arrival', () => {
    const board = ok(evidence(), [{ kind: 'add_rule', rule: { kind: 'children', role: 'pile', max: 3 } as never }])
    expect(board.cards).toEqual(evidence().cards)
    expect(behaviourLines(board)).toContain('A pile holds at most 3.')
    expect(refused(board, [{ kind: 'nest_card', card: 'Couldn’t find CSV export', under: 'Onboarding' }])).toBe('Onboarding holds 3. It has 3.')
    const tighter = ok(board, [{ kind: 'remove_rule', rule: ruleId(board, 'children') }, { kind: 'add_rule', rule: { kind: 'children', role: 'pile', max: 2 } as never }])
    expect(nestKids(tighter, 'onboarding')).toHaveLength(3) // 3 of 2: nothing moved
    // A note dropped on a full pile is refused in the same words.
    expect(workshopNoteCandidate(board, 'piles', { id: 'n1', label: 'Slow import', under: 'onboarding' })).toBeNull()
  })

  it('depth: a pile with notes may not go under another pile while cards nest one level deep; "group into themes" raises it', () => {
    const board = evidence()
    expect(refused(board, [{ kind: 'nest_card', card: 'Pricing', under: 'Reporting' }])).toBe('Cards nest one level deep. Pricing would be 2 deep.')
    const themes = ok(board, [{ kind: 'remove_rule', rule: ruleId(board, 'depth') }, { kind: 'add_rule', rule: { kind: 'depth', max: 2 } as never }])
    const grouped = ok(themes, [{ kind: 'add_card', lane: 'Piles', label: 'Money', role: 'theme' }, { kind: 'nest_card', card: 'Pricing', under: 'Money' }])
    expect(nestKids(grouped, grouped.cards.find(card => card.label === 'Money')!.id).map(card => card.id)).toEqual(['pricing'])
  })

  it('one rule is named per refusal, by a fixed order (nests, depth, children), over every pair', () => {
    const base = tree()
    // Moving Data trust (with its solution) under Guided setup breaks all three: it is an opportunity under a solution,
    // 4 deep, and Guided setup holds at most 0... (children on solution max 1 with one already).
    const all = ok(base, [{ kind: 'add_rule', rule: { kind: 'children', role: 'solution', max: 1 } as never }, { kind: 'add_card', lane: 'tree', label: 'Spike', under: 'Guided setup', role: 'experiment' }])
    const move: WorkshopEdit = { kind: 'nest_card', card: 'Data trust', under: 'Guided setup' }
    const sentences = { nests: 'Opportunities sit under an outcome.', depth: 'Cards nest up to 3 levels deep. Data trust would be 4 deep.', children: 'Guided setup holds 1. It has 1.' }
    const kinds = ['nests', 'depth', 'children'] as const
    for (const a of kinds) for (const b of kinds) {
      if (a === b) continue
      const keep = all.behaviour!.rules.filter(rule => rule.kind === a && (a !== 'nests' || (rule as { role: string }).role === 'opportunity') ||
        rule.kind === b && (b !== 'nests' || (rule as { role: string }).role === 'opportunity') || (rule.kind === 'children' && (a === 'children' || b === 'children') && (rule as { role: string }).role === 'solution'))
      const only = validateWorkshop({ ...all, behaviour: { ...all.behaviour!, rules: keep.filter(rule => rule.kind !== 'children' || (rule as { role: string }).role === 'solution') } })
      const first = kinds.find(kind => kind === a || kind === b)!
      expect(refused(only, [move])).toBe(sentences[first])
    }
  })

  it('refuses a rulebook that contradicts itself', () => {
    const board = tree()
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'nests', role: 'outcome', under: ['solution'] } as never }]))
      .toBe('Opportunities could never be placed: what they sit under would have to sit under them first.')
    expect(refused(board, [{ kind: 'remove_rule', rule: ruleId(board, 'depth') }, { kind: 'add_rule', rule: { kind: 'depth', max: 1 } as never }]))
      .toBe('Solutions sit 2 levels down, but cards nest only 1 deep.')
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'nests', role: 'solution', under: ['outcome'] } as never }])).toBe('There is already a rule for where solutions sit. Change that one instead.')
  })

  it('reads structured fields only: a rule that names a card’s words is no rule', () => {
    const board = tree()
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'rank', by: 'label text' } as never }])).toMatch(/Piles rank by/)
    expect(refused(board, [{ kind: 'add_rule', rule: { kind: 'nests', role: 'solution', under: ['opportunity'], label: 'CSV' } as never }])).toBe('A nests rule does not take label.')
  })
})

describe('piles: counts, ranking and far drops', () => {
  it('counts notes, distinct customers, and ARR with each customer once', () => {
    const board = evidence()
    expect(nestMeasure(board, 'onboarding', 'count')).toBe(3)
    expect(nestMeasure(board, 'onboarding', 'sources')).toBe(3)
    const twice = ok(board, [{ kind: 'nest_card', card: 'Couldn’t find CSV export', under: 'Onboarding' }])
    expect(nestMeasure(twice, 'onboarding', 'count')).toBe(4)
    expect(nestMeasure(twice, 'onboarding', 'sources')).toBe(3) // Acme twice
    expect(nestMeasure(twice, 'onboarding', 'arr')).toBe(24000 + 36000 + 12000)
    expect(board.cards.find(card => card.id === 'onboarding') && nestKit.notes(twice, {}, { x: 0, y: 0 }, {}).find(note => note.options.id === 'card-onboarding')!.options.text)
      .toBe('Onboarding\n4 notes · 3 customers')
  })

  it('ranks piles by the rank rule, live: a move re-ranks them, and "weight by ARR" re-sorts', () => {
    const board = evidence()
    expect(nestRoots(board, 'piles').map(card => card.id)).toEqual(['onboarding', 'reporting', 'pricing'])
    // Two of Onboarding's customers move to Reporting: Reporting leads.
    const moved = ok(board, [{ kind: 'nest_card', card: 'Setup took two days', under: 'Reporting' }, { kind: 'nest_card', card: 'Didn’t know where to start', under: 'Reporting' }])
    expect(nestRoots(moved, 'piles').map(card => card.id)).toEqual(['reporting', 'pricing', 'onboarding'])
    const byArr = ok(board, [{ kind: 'remove_rule', rule: ruleId(board, 'rank') }, { kind: 'add_rule', rule: { kind: 'rank', by: 'arr' } as never }])
    expect(behaviourLines(byArr)).toContain('Piles rank by ARR.')
    expect(nestRoots(byArr, 'piles').map(card => card.id)).toEqual(['reporting', 'onboarding', 'pricing'])
    expect(nestDrags(byArr)).not.toBe(nestDrags(board))
  })

  it('a card let go in empty space starts a new pile; with the rule changed it goes to Unsorted', () => {
    const board = evidence()
    const started = nestEmptyDrop(board, 'trust')!
    const pile = started.cards.find(card => card.parentId === undefined && card.label === 'New pile')!
    expect(parentOf(started, 'trust')).toBe(pile.id)
    expect(nestEditsBetween(board, started)).toEqual([{ kind: 'start_pile', card: { id: 'trust' } }])
    const toTray = ok(board, [{ kind: 'remove_rule', rule: ruleId(board, 'emptyDrop') }, { kind: 'add_rule', rule: { kind: 'emptyDrop', drop: 'unsorted' } as never }])
    expect(nestEmptyDrop(toTray, 'invites')!.cards.find(card => card.id === 'invites')!.laneId).toBe('unsorted')
    // A note dropped on the piles but on no pile does the same.
    const noted = workshopNoteCandidate(board, 'piles', { id: 'note-9', label: 'Slow on mobile' })!
    expect(nestKids(noted, parentOf(noted, 'note-9')!).map(card => card.id)).toEqual(['note-9'])
    expect(workshopNoteCandidate(toTray, 'piles', { id: 'note-9', label: 'Slow on mobile' })!.cards.at(-1)).toMatchObject({ id: 'note-9', laneId: 'unsorted' })
  })

  it('a merge leaves an alias: a drop already on its way to the merged pile lands in the one it went into', () => {
    const board = evidence()
    const merged = ok(board, [{ kind: 'merge_cards', card: 'Pricing', into: 'Onboarding' }])
    expect(merged.cards.some(card => card.id === 'pricing')).toBe(false)
    expect(nestKids(merged, 'onboarding').map(card => card.id)).toEqual(['setup-days', 'where-start', 'invites', 'seats', 'annual'])
    expect(merged.nest!.aliases).toEqual([['pricing', 'onboarding']])
    // The drop was made on the old board, to Pricing, by id.
    const late = ok(merged, [{ kind: 'nest_card', card: { id: 'trust' }, under: { id: 'pricing' } }])
    expect(parentOf(late, 'trust')).toBe('onboarding')
    expect(checkNestMove(merged, { id: 'mobile' }, { under: { id: 'pricing' } })).toEqual({ ok: true, warnings: [] })
  })
})

describe('edits and saves', () => {
  it('set_rule changes a nest rule in place (its id kept), and a whole save of that change is made again by the reducer', () => {
    const board = tree()
    const id = ruleId(board, 'nests', 'solution')
    const changed = ok(board, [{ kind: 'set_rule', rule: id, under: ['opportunity', 'outcome'] }])
    expect(changed.behaviour!.rules.find(rule => rule.id === id)).toMatchObject({ kind: 'nests', role: 'solution', under: ['opportunity', 'outcome'] })
    const capped = ok(evidence(), [{ kind: 'add_rule', rule: { kind: 'children', role: 'pile', max: 3 } as never }])
    expect(ok(capped, [{ kind: 'set_rule', rule: ruleId(capped, 'children'), max: 5 }]).behaviour!.rules.find(rule => rule.kind === 'children')).toMatchObject({ max: 5 })
    expect(ok(evidence(), [{ kind: 'set_rule', rule: ruleId(evidence(), 'rank'), by: 'arr' }]).behaviour!.rules.find(rule => rule.kind === 'rank')).toMatchObject({ by: 'arr' })
    expect(refused(board, [{ kind: 'set_rule', rule: id, by: 'count' }])).toBe('That rule does not take by.')
    // The server's whole save: the change said as its rule edits, made again, the same rules.
    const edits = behaviourEditsBetween(board, changed)!
    expect(edits).toEqual([{ kind: 'set_rule', rule: id, under: ['opportunity', 'outcome'] }])
    expect(ok(board, edits).behaviour!.rules.map(({ set: _set, ...rule }) => rule)).toEqual(changed.behaviour!.rules.map(({ set: _set, ...rule }) => rule))
  })

  it('chat-sized edits: roles, sources, fields, layout and removal moving cards up', () => {
    let board = evidence()
    board = ok(board, [{ kind: 'add_field', label: 'Seats' }, { kind: 'set_field', card: 'Seats are too expensive', field: 'Seats', value: 40 },
      { kind: 'set_source', card: 'Mobile app please', source: 'Hooli' }, { kind: 'set_layout', layout: 'tree' }])
    expect(board.nest!.fields!.map(f => f.id)).toEqual(['arr', 'seats'])
    expect(board.cards.find(card => card.id === 'seats')!.fields).toEqual({ arr: 12000, seats: 40 })
    expect(board.nest!.layout).toBe('tree')
    const removed = applyWorkshopEdits(evidence(), [{ kind: 'remove_card', card: 'Reporting' }], tim)
    if ('refused' in removed) throw new Error(removed.refused.reason)
    expect(removed.report.edits[0].said).toBe('Removed “Reporting”. What was in it went to “Unsorted”.')
    expect(nestKids(removed.workshop, null, 'unsorted').map(card => card.id)).toEqual(['trust', 'mobile', 'csv-export', 'finance-match'])
    // In a tree, what was under a card moves up to its parent; when the rules there would refuse it, a loose card
    // goes to the tray instead, so removing an opportunity never strands its solutions (review s3-nest finding 3).
    const pruned = applyWorkshopEdits(tree(), [{ kind: 'remove_card', card: 'Data trust' }], tim)
    if ('refused' in pruned) throw new Error(pruned.refused.reason)
    expect(pruned.report.edits[0].said).toBe('Removed “Data trust”. What was in it went to “Parked ideas”.')
    expect(pruned.workshop.cards.find(card => card.id === 'reconcile')).toMatchObject({ laneId: 'parked' })
    expect(pruned.workshop.cards.find(card => card.id === 'reconcile')!.parentId).toBeUndefined()
    // With the rule letting them sit there, they move up as before.
    const loose = ok(tree(), [{ kind: 'set_rule', rule: ruleId(tree(), 'nests', 'solution'), under: ['opportunity', 'outcome'] }])
    expect(parentOf(ok(loose, [{ kind: 'remove_card', card: 'Data trust' }]), 'reconcile')).toBe('outcome')
    expect(refused(evidence(), [{ kind: 'set_field', card: 'Mobile app please', field: 'MRR', value: 5 }])).toBe('Cards on this board carry no MRR. Add it as a field first.')
    expect(refused(evidence(), [{ kind: 'add_card', lane: 'Unsorted', label: 'Loose', under: 'Pricing' }])).toBe('Unsorted holds loose cards: nothing sits under another there.')
    expect(refused(evidence(), [{ kind: 'add_card', lane: 'Piles', label: 'X', duration: 3 }])).toMatch(/launch plan/)
  })

  it('a whole-board save keeps the rules: arrivals are checked, and rules and moves never change together', () => {
    const board = tree()
    const bad = { ...board, cards: board.cards.map(card => card.id === 'csv-import' ? { ...card, parentId: 'outcome' } : card) }
    expect(checkWorkshopReplacement(board, bad)).toBe('Solutions sit under an opportunity.')
    const both = { ...bad, behaviour: { ...board.behaviour!, rev: 1, rules: board.behaviour!.rules.filter(rule => rule.kind !== 'nests') } }
    expect(checkWorkshopReplacement(board, both)).toBe('Change the rules on their own, then move cards.')
    const legal = nestLegal(board, 'csv-import').find(({ spot }) => spot.under === 'data-trust')!.next
    expect(checkWorkshopReplacement(board, legal)).toBeNull()
  })
})

describe('a whole save said as edits (review s3-nest finding 1)', () => {
  // What a kept chat change sends is a whole board; the server makes it again from nestEditsBetween. Every
  // change a sentence makes must come back as edits that make the same board, cards in the same order.
  const placesOf = (board: Workshop) => board.cards.map(card => [card.id, card.laneId, card.parentId ?? null, card.role ?? null, card.source ?? null, card.fields ?? null, card.label,
    (card.parentId ? nestKids(board, card.parentId) : nestKids(board, null, card.laneId)).findIndex(item => item.id === card.id)]).sort()
  const again = (before: Workshop, after: Workshop) => {
    const made = ok(before, nestEditsBetween(before, after))
    expect(placesOf(made)).toEqual(placesOf(after))
    expect(made.nest).toEqual(after.nest)
    return made
  }
  it('moves, merges, new cards under new cards, roles after moves, fields, sources and layout', () => {
    const board = evidence()
    again(board, ok(board, [{ kind: 'nest_card', card: 'Want annual billing', under: 'Onboarding' }]))
    again(board, ok(board, [{ kind: 'merge_cards', card: 'Pricing', into: 'Onboarding' }]))
    again(board, ok(board, [{ kind: 'add_card', lane: 'Piles', label: 'Slow exports', under: 'Reporting' }]))
    again(board, ok(board, [{ kind: 'add_card', lane: 'Piles', label: 'A loose note' }]))
    again(board, ok(board, [{ kind: 'add_field', label: 'Seats' }, { kind: 'set_field', card: 'Mobile app please', field: 'Seats', value: 12 }, { kind: 'set_field', card: 'Seats are too expensive', field: 'arr', value: null },
      { kind: 'set_source', card: 'Mobile app please', source: 'Initech' }, { kind: 'set_layout', layout: 'tree' }]))
    // Group into a theme: the depth rule raised, a new card, two piles under it (in the order said).
    const deeper = ok(board, [{ kind: 'set_rule', rule: ruleId(board, 'depth'), max: 2 }])
    again(deeper, ok(deeper, [{ kind: 'add_card', lane: 'Piles', label: 'Money', role: 'theme' }, { kind: 'nest_card', card: 'Pricing', under: 'Money' }, { kind: 'nest_card', card: 'Reporting', under: 'Money' }]))
    // Turn piles into a discovery tree: a pile moved under a new outcome, then made an opportunity.
    const treeRules = ok(board, [{ kind: 'set_layout', layout: 'tree' }, ...board.behaviour!.rules.map(rule => ({ kind: 'remove_rule' as const, rule: rule.id })),
      { kind: 'add_rule', rule: { kind: 'nests', role: 'opportunity', under: ['outcome'] } as never }, { kind: 'add_rule', rule: { kind: 'nests', role: 'note', under: ['opportunity', 'pile'] } as never }])
    again(treeRules, ok(treeRules, [{ kind: 'add_card', lane: 'Piles', label: 'Our outcome', role: 'outcome' }, { kind: 'nest_card', card: 'Onboarding', under: 'Our outcome' },
      { kind: 'set_role', card: 'Onboarding', role: 'opportunity' }, { kind: 'nest_card', card: 'Reporting', under: 'Our outcome' }, { kind: 'set_role', card: 'Reporting', role: 'opportunity' }]))
    // Reordered siblings, whatever keys each copy made.
    const t = tree()
    again(t, ok(t, [{ kind: 'nest_card', card: 'Hard to share results', under: 'Activation to 40%', before: 'Onboarding is slow' }, { kind: 'nest_card', card: 'Data trust', under: 'Activation to 40%' }]))
  })
  it('a single drag is still one edit', () => {
    const board = evidence()
    expect(nestEditsBetween(board, ok(board, [{ kind: 'nest_card', card: 'Want annual billing', under: 'Onboarding' }]))).toEqual([{ kind: 'nest_card', card: { id: 'annual' }, under: { id: 'onboarding' } }])
  })
})

describe('the kit', () => {
  it('draws piles, a tree and an outline as notes, with the board’s two areas', () => {
    expect(kitFor('nest')).toBe(nestKit)
    for (const [board, layout] of [[evidence(), {}], [tree(), {}], [evidence(), { narrow: true, width: 358 }]] as const) {
      const { parts, width } = nestLayout(board, layout)
      for (const card of board.cards) expect(parts.some(part => part.name === 'card-' + card.id)).toBe(true)
      expect(parts.filter(part => part.name.startsWith('column-')).map(part => part.name).sort()).toEqual(board.lanes.map(lane => 'column-' + lane.id).sort())
      if ((layout as { narrow?: boolean }).narrow) {
        expect(width).toBe(358)
        expect(parts.filter(part => part.name.startsWith('card-')).every(part => part.height === 44 && part.x + part.width <= 358)).toBe(true)
      }
    }
  })

  it('the chooser carries a note to the pile it is held over, and the edits it makes are the reducer’s', () => {
    const board = evidence()
    const from = centre(board, 'csv-export')
    const choose = nestKit.chooser(board, 'csv-export', { x: 20, y: 20 }, {})!
    // The pointer holds the card where it was grabbed (20, 20 from its corner): over the foot of Onboarding.
    const target = centre(board, 'invites')
    const next = choose({ x: target.part.x + 20, y: target.part.y + 20 + 30 })
    expect(parentOf(next, 'csv-export')).toBe('onboarding')
    const edits = nestKit.editsBetween(board, next)
    expect(edits).toHaveLength(1)
    expect(ok(board, edits).cards.find(card => card.id === 'csv-export')).toEqual(next.cards.find(card => card.id === 'csv-export'))
    // Held over the upper half of a note, it goes before that note; over the lower half, after it.
    const where = centre(board, 'where-start')
    expect(nestKids(choose({ x: where.x, y: where.part.y + 8 }), 'onboarding').map(card => card.id)).toEqual(['setup-days', 'csv-export', 'where-start', 'invites'])
    expect(nestKids(choose({ x: where.x, y: where.part.y + where.part.height - 8 }), 'onboarding').map(card => card.id)).toEqual(['setup-days', 'where-start', 'csv-export', 'invites'])
    // Held over a pile's own card: into it, last.
    const pile = centre(board, 'pricing')
    expect(nestKids(choose({ x: pile.x, y: pile.y }), 'pricing').map(card => card.id)).toEqual(['seats', 'annual', 'csv-export'])
    // Held where it is, nothing changes.
    expect(choose({ x: from.x, y: from.y })).toEqual(board)
  })

  it('a far drop in empty space starts a pile; let go in the tray it goes to the tray', () => {
    const board = evidence()
    const choose = nestKit.chooser(board, 'invites', { x: 20, y: 20 }, {})!
    const { parts, height } = nestLayout(board, {})
    const main = parts.find(part => part.name === 'column-piles')!
    const empty = choose({ x: main.x + main.width - 30, y: height - 20 })
    expect(empty.cards.find(card => card.label === 'New pile')).toBeTruthy()
    const tray = parts.find(part => part.name === 'column-unsorted')!
    expect(choose({ x: tray.x + 40, y: tray.y + tray.height - 30 }).cards.find(card => card.id === 'invites')!.laneId).toBe('unsorted')
  })

  it('in an outline, a card let go to the right goes under the row above it, and to the left comes out', () => {
    const board = tree()
    const layout = { narrow: true, width: 358 }
    const choose = nestKit.chooser(board, 'csv-import', { x: 10, y: 10 }, layout)!
    const above = centre(board, 'guided-setup', layout)
    const own = centre(board, 'csv-import', layout)
    // Right: under Guided setup (the row above), indented one more.
    const deeper = choose({ x: own.part.x + 20 + 10, y: own.part.y + 10 })
    const outlineDeeper = deeper.cards.find(card => card.id === 'csv-import')!.parentId
    expect(['guided-setup', 'slow-onboarding']).toContain(outlineDeeper)
    expect(above.part.x).toBe(own.part.x)
    // The keys say the same: Right indents under the card above, Left takes it out.
    const indent = nestKit.keyEdit!(board, 'card-csv-import', { key: 'ArrowRight', shiftKey: false })!
    expect(indent).toEqual([{ kind: 'nest_card', card: { id: 'csv-import' }, under: { id: 'guided-setup' } }])
    const tried = applyWorkshopEdits(board, indent, tim)
    // A solution under a solution breaks the rule: the reducer says so.
    expect('refused' in tried && tried.refused.reason).toBe('Solutions sit under an opportunity.')
    const out = nestKit.keyEdit!(board, 'card-guided-setup', { key: 'ArrowLeft', shiftKey: false })!
    expect(out).toEqual([{ kind: 'nest_card', card: { id: 'guided-setup' }, under: { id: 'outcome' }, before: { id: 'data-trust' } }])
    const up = ok(board, nestKit.keyEdit!(board, 'card-csv-import', { key: 'ArrowUp', shiftKey: false })!)
    expect(nestKids(up, 'slow-onboarding').map(card => card.id)).toEqual(['csv-import', 'guided-setup'])
  })

  it('an outline drag indents and outdents by where the card is let go (warn rules let both land)', () => {
    const board = validateWorkshop(breakDownSample())
    const layout = { narrow: true, width: 358 }
    // A competitor's free tier is the last cause under the problem: right puts it under the cause above, left at the top.
    const choose = nestKit.chooser(board, 'free-tier', { x: 10, y: 10 }, layout)!
    const own = centre(board, 'free-tier', layout)
    const right = choose({ x: own.part.x + 10 + 20, y: own.part.y + 10 })
    expect(parentOf(right, 'free-tier')).toBe('price-rise')
    const left = choose({ x: own.part.x + 10 - 20, y: own.part.y + 10 })
    expect(parentOf(left, 'free-tier') ?? null).toBe(null)
    expect(choose({ x: own.part.x + 10, y: own.part.y + 10 })).toEqual(board)
  })

  it('check_move matches the drag: the same verdict and sentence, the rule and who set it, and the nearest place', () => {
    const board = tree()
    const verdict = checkNestMove(board, 'CSV import', { under: 'Activation to 40%' })
    expect(verdict).toEqual({ refused: { sentence: 'Solutions sit under an opportunity.', ruleId: ruleId(board, 'nests', 'solution'), nearest: 'Data trust',
      // A rule of what sits under what may be broken once the person agrees: offered as "Move anyway" (model.ts, "Moving a card anyway").
      overridable: true, set: { by: 'Slatebox', at: '2026-11-21T00:00:00.000Z', via: 'preset' } } })
    for (const card of board.cards) for (const target of board.cards) {
      const drag = nestLegal(board, card.id).some(({ spot }) => spot.under === target.id)
      const exec = 'ok' in checkNestMove(board, { id: card.id }, { under: { id: target.id } })
      if (card.laneId === 'tree' && target.laneId === 'tree' || card.laneId === 'parked' && target.laneId === 'tree') expect([card.id, target.id, exec]).toEqual([card.id, target.id, drag])
    }
  })
})

describe('bench 0 (headless): drag start and per-move cost at the cap', () => {
  const big = (n: number) => {
    const board = sortEvidenceSample()
    const piles = Math.max(3, Math.round(n / 5))
    const keys = orderKeys(n)
    const cards: Workshop['cards'] = []
    for (let p = 0; p < piles; p++) cards.push({ id: 'p' + p, label: 'Pile ' + p, laneId: 'piles', role: 'pile', order: keys[p] })
    for (let i = 0; cards.length < n; i++) cards.push({ id: 'n' + i, label: 'Evidence note number ' + i, laneId: 'piles', role: 'note', parentId: 'p' + (i % piles), order: keys[i], source: 'Customer ' + (i % 9) })
    return { ...board, cards }
  }
  const p95 = (values: number[]) => values.sort((a, b) => a - b)[Math.floor(values.length * 0.95)]
  const bench = (board: Workshop, layout = {}) => {
    const starts: number[] = [], moves: number[] = []
    for (let run = 0; run < 6; run++) {
      const t0 = performance.now()
      const choose = nestKit.chooser(board, 'n' + run, { x: 20, y: 20 }, layout)!
      starts.push(performance.now() - t0)
      for (let i = 0; i < 60; i++) {
        const t = performance.now()
        choose({ x: 250 + (i * 37) % 800, y: 90 + (i * 53) % 500 })
        moves.push(performance.now() - t)
      }
    }
    starts.sort((a, b) => a - b)
    return { start: starts[Math.floor(starts.length / 2)], move: p95(moves) }
  }
  it('40 items (the cap): drag start ≤ 12.5 ms and p95 per move ≤ 2 ms (the 50 / 8 ms phone budget at 4× CPU, here unthrottled)', () => {
    const { start, move } = bench(validateWorkshop(big(40)))
    console.log(`bench0 40 items: drag start ${start.toFixed(1)} ms (median), p95 move ${move.toFixed(2)} ms`)
    expect(start).toBeLessThanOrEqual(12.5)
    expect(move).toBeLessThanOrEqual(2)
  })
  it('150 items and 30 piles (what raising the cap needs): measured, and the phone outline too', () => {
    // Not a valid board yet (the cap is 40): the chooser is measured on it as it would be after bench 0.
    const board = big(150)
    const wide = bench(board), phone = bench(board, { narrow: true, width: 358 })
    console.log(`bench0 150 items: drag start ${wide.start.toFixed(1)} ms, p95 move ${wide.move.toFixed(2)} ms; outline at 390: ${phone.start.toFixed(1)} ms, ${phone.move.toFixed(2)} ms`)
    expect(wide.move).toBeLessThanOrEqual(2)
  })
})

describe('a nest board attached to a slate, played through its drag policy', () => {
  async function attach(board: Workshop, layout = {}) {
    const notes = new Map<string, any>()
    const changes: { next: Workshop; change: any }[] = []
    const refusals: string[] = []
    const said: string[] = []
    const slate: any = {
      policy: null, canvas: { node: document.createElementNS('http://www.w3.org/2000/svg', 'svg') },
      announce: (text: string) => { said.push(text) },
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
    return { attached, slate, notes, changes, refusals, said, box, drag }
  }

  it('a drag carries a note to another pile, as the reducer’s edits', async () => {
    const t = await attach(evidence())
    const invites = t.box('card-invites')
    t.drag('card-csv-export', { x: 20, y: 20 }, { x: invites.x + 20, y: invites.y + 20 + 40 })
    expect(t.changes).toHaveLength(1)
    expect(t.changes[0].change.edits).toEqual([{ kind: 'nest_card', card: { id: 'csv-export' } , under: { id: 'onboarding' } }])
    expect(parentOf(t.attached.value, 'csv-export')).toBe('onboarding')
    // The piles re-rank: Onboarding still leads, Reporting (one customer now) falls behind Pricing.
    expect(nestRoots(t.attached.value, 'piles').map(card => card.id)).toEqual(['onboarding', 'pricing', 'reporting'])
    t.attached.destroy()
  })

  it('an ordinary note dropped on a pile becomes a card in it; on a full pile it is refused in the rule’s words', async () => {
    const full = ok(evidence(), [{ kind: 'add_rule', rule: { kind: 'children', role: 'pile', max: 3 } as never }])
    const t = await attach(full)
    const note = { id: 'note-77', options: { id: 'note-77', text: 'Exports time out', x: 0, y: 0, width: 180, height: 60 }, relationships: { associations: [] } }
    t.notes.set('note-77', note)
    const reporting = t.box('card-finance-match')
    expect(t.slate.policy.onFreeDrop(note, { x: reporting.x + 30, y: reporting.y + 20 })).toBe('taken')
    const made = t.changes.at(-1)!
    expect(made.change.noteToCard).toMatchObject({ noteId: 'note-77', label: 'Exports time out', under: 'reporting' })
    expect(parentOf(t.attached.value, 'note-77')).toBe('reporting')
    // Onboarding holds 3 already: the drop is refused, with the sentence, and the note stays a note.
    const another = { id: 'note-78', options: { id: 'note-78', text: 'Too many steps', x: 0, y: 0, width: 180, height: 60 }, relationships: { associations: [] } }
    t.notes.set('note-78', another)
    const onboarding = t.box('card-setup-days')
    expect(t.slate.policy.onFreeDrop(another, { x: onboarding.x + 30, y: onboarding.y + 20 })).toBe('refused')
    expect(t.refusals.at(-1)).toBe('Onboarding holds 3. It has 3.')
    expect(t.attached.value.cards.some(card => card.id === 'note-78')).toBe(false)
    t.attached.destroy()
  })

  it('a solution held over the outcome is refused with the rule’s sentence; once the rule changes it lands', async () => {
    const t = await attach(tree())
    const outcome = t.box('card-outcome')
    t.drag('card-csv-import', { x: 20, y: 20 }, { x: outcome.x + 60, y: outcome.y + 30 })
    expect(t.refusals.at(-1)).toBe('Solutions sit under an opportunity.')
    expect(parentOf(t.attached.value, 'csv-import')).toBe('slow-onboarding')
    t.attached.update(ok(tree(), [{ kind: 'remove_rule', rule: ruleId(tree(), 'nests', 'solution') },
      { kind: 'add_rule', rule: { kind: 'nests', role: 'solution', under: ['opportunity', 'outcome'] } as never }]))
    const again = t.box('card-outcome')
    t.drag('card-csv-import', { x: 20, y: 20 }, { x: again.x + 60, y: again.y + 30 })
    expect(parentOf(t.attached.value, 'csv-import')).toBe('outcome')
    expect(t.changes.at(-1)!.change.edits[0]).toMatchObject({ kind: 'nest_card', card: { id: 'csv-import' }, under: { id: 'outcome' } })
    t.attached.destroy()
  })

  it('a card takes no connector: the policy says so, and a line drawn from it anyway is taken off and not saved', async () => {
    const t = await attach(evidence())
    const card = t.notes.get('card-csv-export')
    expect(t.slate.policy.governs(card).canConnect).toBe(false)
    const note = { id: 'note-90', options: { id: 'note-90', text: 'A note', x: 0, y: 0, width: 180, height: 60 }, relationships: { associations: [] } }
    t.notes.set('note-90', note)
    const removed: string[] = []
    card.relationships = { associations: [{ id: 'card-csv-export->note-90' }], hasAssociationId: (id: string) => id === 'card-csv-export->note-90',
      removeAssociation: (id: string) => { removed.push(id) } }
    t.slate.policy.onLine('addRelationship', { id: 'card-csv-export->note-90', parentId: 'card-csv-export', childId: 'note-90' })
    await Promise.resolve(); await Promise.resolve()
    expect(removed).toEqual(['card-csv-export->note-90'])
    expect(t.changes).toHaveLength(0)
    expect(t.attached.value.lines).toBeUndefined()
    t.attached.destroy()
  })
})
