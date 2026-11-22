import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, checkWorkshopReplacement, decodeWorkshopFragment, encodeWorkshopFragment, validateWorkshop, workshopCandidate, workshopNoteCandidate, workshopNoteRefusal, workshopRefusal, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { budgetCaption, budgetLimits, budgetRefusal, sampleBudget } from '../../src/workshops/rules'
import { workshopEditsBetween, budgetHeader } from '../../src/boards'

const budget = validateWorkshop(sampleBudget())
const ok = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  if ('refused' in result) throw new Error(result.refused.reason)
  return result.workshop
}
const refused = (board: Workshop, edits: WorkshopEdit[]) => {
  const result = applyWorkshopEdits(board, edits)
  if (!('refused' in result)) throw new Error('expected a refusal')
  return result.refused
}
const allocations = (board: Workshop) => Object.fromEntries(board.lanes.map(lane => [lane.id, lane.allocation]))

describe('budget rules', () => {
  it('always balances: money moves between teams and the total stays', () => {
    const next = ok(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Product', amount: 50000 }])
    expect(allocations(next)).toEqual({ product: 450000, sales: 350000, design: 150000, marketing: 250000 })
    expect(budgetHeader(next)).toBe('$1.2M · balanced')
    expect(() => validateWorkshop({ ...budget, lanes: budget.lanes.map(lane => lane.id === 'sales' ? { ...lane, allocation: 1 } : lane) })).toThrow(/add up to/)
  })

  it('stops a team at what it has committed, its floor and its cap, in the words the layer shows', () => {
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Design', amount: 85000 }]).reason).toBe('Sales already commits $320k.')
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Product', to: 'Sales', amount: 105000 }]).reason).toBe('Product\'s floor is $300k.')
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Design', to: 'Marketing', amount: 35000 }]).reason).toBe('Design already commits $120k.')
    expect(allocations(ok(budget, [{ kind: 'shift_budget', from: 'Design', to: 'Marketing', amount: 30000 }])).design).toBe(120000)
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Marketing', amount: 55000 }]).reason).toBe('Marketing\'s cap is $300k.')
    // The Sales | Design divider: Sales may grow by what Design can spare, and shrink to what it commits.
    expect(budgetLimits(budget, { laneId: 'sales' })).toEqual({ field: 'amount', min: -80000, max: 30000,
      reasons: { min: 'Sales already commits $320k.', max: 'Design already commits $120k.' } })
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Design', amount: 85000 }]).limits).toMatchObject({ min: -30000, max: 80000 })
  })

  it('moves a line item only to a team with room for it', () => {
    expect(budgetRefusal(budget, 'contractor', 'design')).toBe('Design has $30k left. Contractor costs $45k.')
    expect(workshopRefusal(budget, 'contractor', 'design')).toBe('Design has $30k left. Contractor costs $45k.')
    expect(workshopCandidate(budget, 'contractor', 'sales')!.cards.at(-1)).toEqual({ id: 'contractor', label: 'Contractor', laneId: 'sales', amount: 45000 })
    expect(refused(budget, [{ kind: 'move_card', card: 'Contractor', lane: 'Design' }]).reason).toBe('Design has $30k left. Contractor costs $45k.')
    expect(budgetCaption(budget, 'product')).toBe('$400k · $245k committed')
  })

  it('sets a cost only where it fits, and adds a line item only with a cost', () => {
    expect(refused(budget, [{ kind: 'set_amount', card: 'Research panel', amount: 160000 }]).reason).toBe('Design has $30k left. Research panel costs $160k.')
    expect(ok(budget, [{ kind: 'set_amount', card: 'Research panel', amount: 150000 }]).cards.find(card => card.id === 'panel')!.amount).toBe(150000)
    expect(refused(budget, [{ kind: 'add_card', lane: 'Design', label: 'Survey' }]).reason).toBe('Give the line item a cost, like \'Contractor $45k\'.')
    expect(ok(budget, [{ kind: 'add_card', lane: 'Design', label: 'Survey', amount: 20000 }]).cards.at(-1)).toEqual({ id: 'card-1', label: 'Survey', laneId: 'design', amount: 20000 })
    // A new line item keeps the bound set_amount keeps: it costs something.
    expect(refused(budget, [{ kind: 'add_card', lane: 'Design', label: 'Free lunch', amount: 0 }])).toMatchObject({ reason: 'A line item costs something.', limits: { min: 1 } })
    expect(refused(budget, [{ kind: 'set_amount', card: 'Research panel', amount: 0 }]).reason).toBe('A line item costs something.')
  })

  it('moves money in the board\'s steps, as the divider snaps, unless the move stops exactly at a bound', () => {
    expect(budget.budget!.step).toBe(5000)
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Product', to: 'Design', amount: 1 }]).reason).toBe('Move money in steps of $5k.')
    expect(refused(budget, [{ kind: 'shift_budget', from: 'Product', to: 'Design', amount: 12500 }]).reason).toBe('Move money in steps of $5k.')
    expect(allocations(ok(budget, [{ kind: 'shift_budget', from: 'Product', to: 'Design', amount: 15000 }])).design).toBe(165000)
    // A bound that is not on a step is still reachable: Design may give exactly what it does not commit.
    const odd = ok(budget, [{ kind: 'set_amount', card: 'Research panel', amount: 101000 }])
    const spare = 150000 - odd.cards.filter(card => card.laneId === 'design').reduce((sum, card) => sum + card.amount!, 0)
    expect(spare % 5000).not.toBe(0)
    expect(allocations(ok(odd, [{ kind: 'shift_budget', from: 'Design', to: 'Marketing', amount: spare }])).marketing).toBe(250000 + spare)
  })
})

describe('budget notes, sync, save and undo', () => {
  it('turns a note with a cost into a line item, and refuses one without', () => {
    expect(workshopNoteRefusal(budget, 'design', { id: 'n', label: 'Survey' })).toBe('Write the cost on the note, like \'Contractor $45k\', then drop it.')
    expect(workshopNoteRefusal(budget, 'design', { id: 'n', label: 'Survey $40k' })).toBe('Design has $30k left. Survey costs $40k.')
    expect(workshopNoteCandidate(budget, 'design', { id: 'n', label: 'Survey $25k' })!.cards.at(-1)).toEqual({ id: 'n', label: 'Survey', laneId: 'design', amount: 25000 })
  })

  it('carries a divider drag as one shift, and keeps two people\'s shifts between different teams', () => {
    const ada = workshopEditsBetween(budget, ok(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Product', amount: 50000 }]))
    expect(ada).toEqual([{ kind: 'shift_budget', from: { id: 'sales' }, to: { id: 'product' }, amount: 50000 }])
    const ben = workshopEditsBetween(budget, ok(budget, [{ kind: 'shift_budget', from: 'Marketing', to: 'Design', amount: 20000 }]))
    expect(allocations(ok(ok(budget, ada), ben))).toEqual({ product: 450000, sales: 350000, design: 170000, marketing: 230000 })
  })

  it('saves, loads and undoes', () => {
    const after = ok(budget, [{ kind: 'shift_budget', from: 'Sales', to: 'Product', amount: 50000 }, { kind: 'move_card', card: 'Contractor', lane: 'Marketing' }])
    expect(decodeWorkshopFragment(encodeWorkshopFragment(after))).toEqual(after)
    expect(checkWorkshopReplacement(after, budget)).toBeNull()
    const back = ok(after, workshopEditsBetween(after, budget))
    expect(allocations(back)).toEqual(allocations(budget))
    expect(back.cards.find(card => card.id === 'contractor')!.laneId).toBe('product')
  })
})

describe('names on a budget', () => {
  it('finds a team and a line item by what a person calls them', () => {
    const result = applyWorkshopEdits(budget, [{ kind: 'shift_budget', from: 'the Sales team', to: 'Product', amount: 5000 }, { kind: 'set_amount', card: 'the Contractor line item', amount: 40000 }])
    expect('workshop' in result && result.workshop.lanes[0].allocation).toBe(405000)
  })
})

describe('a whole-board save of a budget (phase 2 review H1)', () => {
  it('keeps the total, the step, and each team\'s floor and cap', () => {
    const grown = { ...budget, budget: { ...budget.budget!, total: budget.budget!.total * 4 }, lanes: budget.lanes.map(lane => ({ id: lane.id, label: lane.label, allocation: lane.allocation! * 4 })) }
    expect(checkWorkshopReplacement(budget, grown)).toBe('The total changes only at the envelope’s edges: drag one, or say the new total.')
    const uncapped = { ...budget, lanes: budget.lanes.map(lane => { const { cap, ...rest } = lane; void cap; return rest }) }
    expect(checkWorkshopReplacement(budget, uncapped)).toBe('Marketing keeps its floor and cap. Move money between teams instead.')
    const moved = ok(budget, [{ kind: 'shift_budget', from: 'Product', to: 'Marketing', amount: 50000 }])
    expect(checkWorkshopReplacement(budget, moved)).toBeNull()
  })
})
