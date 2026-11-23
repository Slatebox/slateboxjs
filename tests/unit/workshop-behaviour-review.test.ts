import { describe, expect, it } from 'vitest'
import {
  applyWorkshopEdits, checkWorkshopReplacement, validateWorkshop, workshopCandidate, workshopCardAsNote, workshopLanePlaces, workshopNodeIds, workshopToSlate,
  type Workshop, type WorkshopEdit, type WorkshopEditResult,
} from '../../src/workshops/model'
import { samplePipeline } from '../../src/workshops/rules'
import { behaviourLines, behaviourOf, checkBehaviour } from '../../src/workshops/behaviour'
import { behaviourEditsBetween, restoreWorkshop } from '../../src/workshops/behaviourSaves'
import { catalog, catalogAddRequest, catalogMatch, catalogPreset } from '../../src/workshops/catalog'

// The hostile review of the rulebook (D1) and the library (L1+L2): each finding as a test, written
// before its fix.

const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const no = (result: WorkshopEditResult) => {
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const tim = { actor: { by: 'Tim', via: 'chat' as const }, now: '2026-11-21T10:00:00.000Z' }
const apply = (board: Workshop, ...edits: WorkshopEdit[]) => applyWorkshopEdits(board, edits, tim)
const samples = { pipeline: samplePipeline }

// The Team board preset (one lane at a time, Doing holds 3, Won't do a bin) with cards.
const team = validateWorkshop({ ...catalogPreset('team-board'), cards: [
  { id: 'billing', label: 'Billing', laneId: 'todo' }, { id: 'search', label: 'Search', laneId: 'todo' },
  { id: 'export', label: 'Export', laneId: 'doing' }, { id: 'old', label: 'Old idea', laneId: 'wont' },
] })
const moved = (board: Workshop, id: string, laneId: string) => ({ ...board, cards: board.cards.map(card => card.id === id ? { ...card, laneId } : card) })

describe('review finding 1: a whole-board save cannot change the rules and break them at once', () => {
  it('refuses a save that changes the rules and moves a card in the same save', () => {
    const next = { ...moved(team, 'search', 'done'), behaviour: { version: 1 as const, rev: 99, rules: [] } }
    expect(checkWorkshopReplacement(team, next)).toBe('Change the rules on their own, then move cards.')
  })

  it('checks a card’s arrival against the rules the board had (before), not the ones the save brings', () => {
    const off = { ...team, behaviour: { ...team.behaviour!, rules: team.behaviour!.rules.filter(rule => rule.kind !== 'path') } }
    // Rules alone, with a new revision: a rule edit.
    expect(checkWorkshopReplacement(team, { ...off, behaviour: { ...off.behaviour, rev: 1 } })).toBeNull()
    // checkBehaviour reads the rules of the board as it was.
    expect(checkBehaviour(team, { ...moved(team, 'search', 'done'), behaviour: off.behaviour })).toMatchObject({ refused: { ruleId: 'rule-1' } })
  })

  it('says a rule change as the rule edits it amounts to, so the server can make them itself', () => {
    const one = ok(apply(team, { kind: 'set_rule', rule: 'rule-2', max: 2 }, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } },
      { kind: 'remove_rule', rule: 'rule-3' }, { kind: 'set_rule', rule: 'rule-1', on: false, severity: 'warn' }))
    const edits = behaviourEditsBetween(team, one)!
    expect(edits.map(edit => edit.kind).sort()).toEqual(['add_rule', 'remove_rule', 'set_rule', 'set_rule'])
    const again = ok(applyWorkshopEdits(team, edits, { actor: { by: 'Server', via: 'chat' } }))
    const strip = (board: Workshop) => behaviourOf(board).rules.map(({ set: _set, ...rule }) => rule).sort((a, b) => a.id < b.id ? -1 : 1)
    expect(strip(again)).toEqual(strip(one))
    expect(behaviourOf(again).rules.every(rule => rule.id === 'rule-1' || rule.id === 'rule-2' || rule.id === 'rule-4' ? true : false)).toBe(true)
    // A rule whose kind or lane changed under the same id is not a rule edit.
    const forged = { ...team, behaviour: { ...team.behaviour!, rev: 1, rules: team.behaviour!.rules.map(rule => rule.id === 'rule-2' ? { ...rule, where: 'review' } : rule) } }
    expect(behaviourEditsBetween(team, forged as Workshop)).toBeNull()
  })
})

describe('review finding 4: rules that contradict each other are refused with a sentence', () => {
  it('a path to a lane the one-lane rule never lets a card reach is a contradiction', () => {
    const refused = no(apply(team, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Done'] } }))
    expect(refused.reason).toBe('Cards move one column at a time, so cards in Doing could never reach Done.')
    // A path to the next lane is fine.
    expect(behaviourOf(ok(apply(team, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Review'] } }))).rules.at(-1)).toMatchObject({ kind: 'path', from: 'doing' })
    // With the one-lane rule off, the path holds; turning it back on is refused.
    const off = ok(apply(team, { kind: 'set_rule', rule: 'rule-1', on: false }))
    const path = ok(apply(off, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Done'] } }))
    expect(no(apply(path, { kind: 'set_rule', rule: 'rule-1', on: true })).reason)
      .toBe('Cards move one column at a time, so cards in Doing could never reach Done.')
  })

  it('a warn rule never contradicts: it lets the card land', () => {
    const warned = ok(apply(team, { kind: 'set_rule', rule: 'rule-1', severity: 'warn' }))
    expect(behaviourOf(ok(apply(warned, { kind: 'add_rule', rule: { kind: 'path', from: 'Doing', to: ['Done'] } }))).rules).toHaveLength(4)
  })
})

describe('review finding 5: a rule edit is one undo step', () => {
  it('restores an earlier board with a newer revision, so a drop made under the undone rules is checked again', () => {
    const one = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    const back = restoreWorkshop(one, team)
    expect(behaviourOf(back).rules).toEqual(behaviourOf(team).rules)
    expect(behaviourOf(back).rev).toBe(2)
    expect(checkWorkshopReplacement(one, back)).toBeNull()
    // Sent as it was (an older revision), it is still refused.
    expect(checkWorkshopReplacement(one, team)).toBe('The rules changed. Save them with a new revision.')
  })
})

describe('review finding 6: add_rule takes a rule body, never its id, state or audit line', () => {
  it('refuses id, on, set and unknown keys', () => {
    for (const extra of [{ id: 'zz' }, { on: false }, { set: { by: 'Tim (owner)', at: '2020-01-01', via: 'preset' } }, { teleport: true }]) {
      const refused = no(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2, ...extra } } as unknown as WorkshopEdit))
      expect(refused.code).toBe('invalid_edit')
      expect(refused.reason).toMatch(/^A capacity rule does not take (id|on|set|teleport)\.$/)
    }
    const kept = ok(apply(team, { kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }))
    expect(behaviourOf(kept).rules.at(-1)).toMatchObject({ id: 'rule-4', on: true, set: { by: 'Tim', via: 'chat' } })
  })
})

describe('review finding 7: a bin archives cards, it never deletes them', () => {
  it('refuses to remove a card in a bin, by edit or by whole save, with the bin’s sentence', () => {
    const sentence = "Won't do archives cards: they stay on the board, never deleted."
    expect(no(apply(team, { kind: 'remove_card', card: 'Old idea' })).reason).toBe(sentence)
    expect(checkWorkshopReplacement(team, { ...team, cards: team.cards.filter(card => card.id !== 'old') })).toBe(sentence)
    // A card elsewhere may still be removed, and a binned card may still become a note (its words stay on the slate).
    expect(ok(apply(team, { kind: 'remove_card', card: 'Billing' })).cards).toHaveLength(3)
    expect(workshopCardAsNote(team, 'old')).not.toBeNull()
    // With the bin rule off, a card there is an ordinary card.
    expect(ok(apply(team, { kind: 'set_rule', rule: 'rule-3', on: false }, { kind: 'remove_card', card: 'Old idea' })).cards).toHaveLength(3)
  })
})

// Restated for board polish (decided behaviour changed): the rules are the board's chrome, drawn above it, so on a
// phone nothing sits above the first column and no note is drawn at all, on a phone or a wide screen.
describe('review finding 12: on a phone the first column starts at the top; the rules are the board’s chrome', () => {
  it('draws no rules note and reserves no room for one', () => {
    const phone = { lanesPerRow: 1 }
    const { places } = workshopLanePlaces(team, { layout: phone })
    expect(Math.min(...places.map(place => place.y))).toBe(0)
    for (const layout of [phone, undefined]) {
      expect(workshopToSlate(team, { native: true, layout }).nodes.some(node => node.options.id === workshopNodeIds.rules)).toBe(false)
    }
    const plain = validateWorkshop({ version: 1, title: 'Plain', lanes: team.lanes, cards: [] })
    expect(workshopLanePlaces(plain, { layout: phone }).places[0].y).toBe(0)
  })
})

describe('review finding 3: the library answers only questions about what to add', () => {
  it('leaves drawing requests and board sentences to the drawing and the rule grammar', () => {
    for (const message of ['I want a flow chart of our onboarding', 'I need a diagram of the sales process', 'we need a timeline for the launch',
      'we need to limit Doing', 'I want to move Search to Done', 'help me draw the org chart', 'how do I move Search to Done?']) {
      expect([message, catalogMatch(message)]).toEqual([message, null])
    }
    expect(catalogMatch('something to track deals')?.entries[0]).toBe('sales-pipeline')
    expect(catalogMatch('I need a board to track deals')?.entries[0]).toBe('sales-pipeline')
    expect(catalogMatch('we need something to prioritise features')?.entries).toContain('must-should-could')
    expect(catalogMatch('how do I run a retro?')?.entries[0]).toBe('retro')
    expect(catalogMatch('is there a template for a retro?')?.entries[0]).toBe('retro')
  })
})

describe('review finding 15: an add request with real details is a brief, not a preset', () => {
  it('passes lanes, lists and amounts on to the brief readers', () => {
    expect(catalogAddRequest('Create a team board for Platform: Todo, Doing, Done')).toBeNull()
    expect(catalogAddRequest('Make a sales pipeline for Acme 40k, Globex 60k')).toBeNull()
    expect(catalogAddRequest('Add a budget for $120k')).toBeNull()
    expect(catalogAddRequest('Add a retro about the Q3 launch')).toEqual({ id: 'retro', topic: 'the Q3 launch' })
    expect(catalogAddRequest('Add pros and cons for hiring a designer and a PM')).toEqual({ id: 'pros-cons', topic: 'hiring a designer and a PM' })
  })
})

describe('review finding 17: a loop’s caption is a sentence its board says', () => {
  it('for the lane presets and the pipeline: one of the lines of its "How this board behaves" note', () => {
    for (const entry of catalog.filter(item => item.build.kind === 'lanes' || item.build.kind === 'pipeline')) {
      const board = validateWorkshop(catalogPreset(entry.id, undefined, samples))
      const lines = behaviourLines(board)
      if (lines.length) expect([entry.id, lines.includes(entry.loop.caption)]).toEqual([entry.id, true])
      else expect([entry.id, entry.loop.caption]).toEqual([entry.id, 'No rules: any card goes in any column.'])
    }
  })
})

describe('the checks that held stay held', () => {
  it('a move inside the rules is still a candidate, and leaving a full lane is always fine', () => {
    expect(workshopCandidate(team, 'billing', 'doing')).not.toBeNull()
    expect(workshopCandidate(team, 'billing', 'review')).toBeNull()
    expect(workshopCandidate(team, 'billing', 'wont')).not.toBeNull()
  })
})
