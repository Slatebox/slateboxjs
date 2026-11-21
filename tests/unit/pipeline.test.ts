import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, checkWorkshopReplacement, decodeWorkshopFragment, encodeWorkshopFragment, pipelineGauge, validateWorkshop, workshopCandidate, workshopCardNoteText, workshopDestinations, workshopEditsBetween, workshopLaneCaption, workshopNoteCandidate, workshopNoteRefusal, workshopRefusal, type Workshop, type WorkshopEdit } from '../../src/workshops/model'
import { pipelineForecast, pipelineRefusal, samplePipeline } from '../../src/workshops/rules'
import { workshopEditsBetween, pipelineGauge } from '../../src/boards'

const pipeline = validateWorkshop(samplePipeline())
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
const laneOf = (board: Workshop, id: string) => board.cards.find(card => card.id === id)!.laneId

describe('pipeline rules', () => {
  it('moves a deal forward one stage at a time, and back to any open stage', () => {
    expect(pipelineRefusal(pipeline, 'northwind', 'qualified')).toBeNull()
    expect(workshopRefusal(pipeline, 'northwind', 'won')).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
    expect(workshopRefusal(pipeline, 'northwind', 'proposal')).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
    expect(pipelineRefusal(pipeline, 'brightline', 'lead')).toBeNull()
    expect(workshopDestinations(pipeline, 'acme').map(lane => lane.id)).toEqual(['lead', 'qualified', 'lost'])
  })

  it('holds a stage to its capacity, wins only a deal with an amount from the stage before Won, and keeps a won deal won', () => {
    expect(workshopRefusal(pipeline, 'acme', 'proposal')).toBe('Proposal already holds 3 of 3 deals.')
    expect(pipelineRefusal(pipeline, 'brightline', 'won')).toBeNull()
    const unpriced = validateWorkshop({ ...pipeline, cards: pipeline.cards.map(card => card.id === 'brightline' ? { ...card, amount: undefined } : card) })
    expect(pipelineRefusal(unpriced, 'brightline', 'won')).toBe("Brightline needs an amount before it can be won. Write it on the card, like 'Brightline $40k'.")
    expect(pipelineRefusal(pipeline, 'bluefin', 'proposal')).toBe('A won deal stays won. Move it to Lost if it fell through.')
    expect(pipelineRefusal(pipeline, 'bluefin', 'lost')).toBeNull()
    const lost = workshopCandidate(pipeline, 'northwind', 'lost')!
    expect(pipelineRefusal(lost, 'northwind', 'qualified')).toBeNull()
  })

  it('refuses the same moves by edit, with the same sentences (an agent is held to the stage rule)', () => {
    expect(refused(pipeline, [{ kind: 'move_card', card: 'Northwind', lane: 'Won' }]).reason).toBe('Deals move one stage at a time. Northwind is in Lead, so Qualified comes first.')
    expect(laneOf(ok(pipeline, [{ kind: 'move_card', card: 'Northwind', lane: 'Qualified' }]), 'northwind')).toBe('qualified')
    expect(refused(pipeline, [{ kind: 'move_card', card: 'Acme', lane: 'Proposal' }]).reason).toBe('Proposal already holds 3 of 3 deals.')
  })

  it('forecasts amount × chance over open stages plus every won amount, and says it against the target', () => {
    expect(pipelineForecast(pipeline)).toBe(Math.round(100000 * 0.1 + 25000 * 0.3 + 170000 * 0.6 + 70000))
    expect(pipelineGauge(pipeline)).toBe('Forecast $189.5k of $250k')
    const moved = workshopCandidate(pipeline, 'globex', 'qualified')!
    expect(pipelineForecast(moved) - pipelineForecast(pipeline)).toBe(12000)
    expect(workshopLaneCaption(pipeline, 'proposal')).toBe('3 deals · $170k · 60%')
    expect(workshopLaneCaption(pipeline, 'won')).toBe('1 deal · $70k · 100%')
  })

  it('sets amounts and the target by edit, in range', () => {
    expect(ok(pipeline, [{ kind: 'set_amount', card: 'Acme', amount: 30000 }]).cards.find(card => card.id === 'acme')!.amount).toBe(30000)
    expect(ok(pipeline, [{ kind: 'set_target', amount: 300000 }]).forecast!.target).toBe(300000)
    const negative = refused(pipeline, [{ kind: 'set_amount', card: 'Acme', amount: -1 }])
    expect(negative.limits).toMatchObject({ field: 'amount', min: 0 })
    expect(refused(pipeline, [{ kind: 'shift_budget', from: 'Lead', to: 'Won', amount: 5 }]).reason).toBe('Only a budget moves money between teams.')
  })
})

describe('pipeline amounts', () => {
  it('refuses an amount past the most with the sentence that says so', () => {
    const board = validateWorkshop(samplePipeline())
    const result = applyWorkshopEdits(board, [{ kind: 'add_card', lane: 'Lead', label: 'Huge', amount: 1e12 }])
    expect('refused' in result && result.refused.reason).toBe('An amount is at most 1,000,000,000.')
    const below = applyWorkshopEdits(board, [{ kind: 'add_card', lane: 'Lead', label: 'Negative', amount: -5 }])
    expect('refused' in below && below.refused.reason).toBe('An amount is not below zero.')
  })
})

describe('pipeline notes, sync, save and undo', () => {
  it('turns a note into a deal with its amount, in an open stage with room', () => {
    expect(workshopNoteCandidate(pipeline, 'lead', { id: 'n', label: 'Initrode $15k' })!.cards.at(-1)).toEqual({ id: 'n', label: 'Initrode', laneId: 'lead', amount: 15000 })
    expect(workshopNoteCandidate(pipeline, 'lead', { id: 'n', label: 'Initrode' })!.cards.at(-1)!.amount).toBeUndefined()
    expect(workshopNoteRefusal(pipeline, 'won', { id: 'n', label: 'Initrode 15k' })).toBe('A new deal starts in an open stage, not in Won.')
    expect(workshopNoteRefusal(pipeline, 'proposal', { id: 'n', label: 'Initrode 15k' })).toBe('Proposal already holds 3 of 3 deals.')
    expect(workshopCardNoteText(pipeline, pipeline.cards[0])).toBe('Northwind · $40k')
  })

  it('keeps two people\'s moves of different deals', () => {
    const ben = workshopEditsBetween(pipeline, workshopCandidate(pipeline, 'globex', 'qualified')!)
    const ada = workshopEditsBetween(pipeline, workshopCandidate(pipeline, 'brightline', 'won')!)
    const server = ok(ok(pipeline, ada), ben)
    expect([laneOf(server, 'globex'), laneOf(server, 'brightline')]).toEqual(['qualified', 'won'])
  })

  it('saves, loads and undoes', () => {
    const after = ok(pipeline, [{ kind: 'move_card', card: 'Globex', lane: 'Qualified' }, { kind: 'set_amount', card: 'Acme', amount: 26000 }])
    expect(decodeWorkshopFragment(encodeWorkshopFragment(after))).toEqual(after)
    expect(checkWorkshopReplacement(after, pipeline)).toBeNull()
    const back = ok(after, workshopEditsBetween(after, pipeline))
    expect(back.cards.map(card => card.id + '@' + card.laneId + ':' + card.amount).sort()).toEqual(pipeline.cards.map(card => card.id + '@' + card.laneId + ':' + card.amount).sort())
  })

  it('refuses a saved board that breaks its rules', () => {
    expect(() => validateWorkshop({ ...pipeline, forecast: undefined })).toThrow('A pipeline needs a forecast target.')
    expect(() => validateWorkshop({ ...pipeline, lanes: pipeline.lanes.slice(0, 2), cards: [] })).toThrow('A pipeline has 3 to 5 stages.')
    expect(() => validateWorkshop({ ...pipeline, cards: [...pipeline.cards, { id: 'x', label: 'X', laneId: 'proposal' }] })).toThrow('Proposal already holds 4 of 3 deals.')
  })
})

describe('names on a pipeline', () => {
  it('finds a stage and a deal by what a person calls them', () => {
    const result = applyWorkshopEdits(pipeline, [{ kind: 'move_card', card: 'the Globex deal', lane: 'the Qualified stage' }])
    expect('workshop' in result && result.workshop.cards.find(card => card.id === 'globex')!.laneId).toBe('qualified')
  })
})
