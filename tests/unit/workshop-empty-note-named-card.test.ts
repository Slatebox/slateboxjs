import { describe, expect, it } from 'vitest'
import {
  validateWorkshop, workshopCardAsNote, workshopCardNoteWords, workshopNewCardName, workshopNoteCandidate, workshopNoteRefusal,
  type Workshop,
} from '../../src/workshops/model'
import { applyWorkshopEdits } from '../../src/workshops/edits'
import '../../src/workshops/behaviour'
import { goLiveSample, hiringPlanSample, launchPlanSample, sampleBudget, samplePipeline } from '../../src/workshops/rules'
import { catalogSamples } from '../../src/workshops/samples'
import { catalogList, catalogPreset } from '../../src/workshops/catalog'

/**
 * Empty notes on boards (2026-11-23, owner: "a card needs some words? i thought we fixed this").
 * Notes always convert on boards. An empty note is never refused: it becomes a card named with the
 * board's own word for a new item ("New hire" on a hiring plan, "New task" on a launch plan, "New card"
 * on lanes), the name is opened for typing, and dragged off the card is an empty note again. add_card
 * with no words, from chat or exec, gets the same name.
 */

const lanes = (): Workshop => validateWorkshop({ version: 1, title: 'Plan', lanes: [{ id: 'now', label: 'Now' }, { id: 'later', label: 'Later' }], cards: [] })
const map = (): Workshop => validateWorkshop(catalogPreset('decision-path'))

const kinds: Array<[string, () => Workshop, string, string]> = [
  ['lane board', lanes, 'now', 'New card'],
  ['map', map, 'option-a', 'New stop'],
  ['launch plan', () => validateWorkshop(launchPlanSample()), launchPlanSample().lanes[0].id, 'New task'],
  ['go-live plan', () => validateWorkshop(goLiveSample()), goLiveSample().lanes[0].id, 'New task'],
  ['hiring plan', () => validateWorkshop(hiringPlanSample()), hiringPlanSample().lanes[2].id, 'New hire'],
  ['sales pipeline', () => validateWorkshop(samplePipeline()), samplePipeline().lanes[0].id, 'New deal'],
  ['budget', () => validateWorkshop(sampleBudget()), sampleBudget().lanes[0].id, 'New line item'],
  ['2 by 2', () => validateWorkshop(catalogSamples['impact-effort']()), catalogSamples['impact-effort']().lanes[0].id, 'New idea'],
  ['evidence piles', () => validateWorkshop(catalogSamples['sort-evidence']()), catalogSamples['sort-evidence']().lanes[1].id, 'New note'],
]

describe('an empty note dropped on a board becomes a card named for the board', () => {
  for (const [name, make, laneId, expected] of kinds) {
    it(`a ${name}: "${expected}", never refused, and an empty note again when dragged off`, () => {
      const board = make()
      expect(workshopNewCardName(board)).toBe(expected)
      for (const words of ['', '   ', '\n\t']) expect(workshopNoteRefusal(board, laneId, { id: 'node_blank_1', label: words })).toBeNull()
      const next = workshopNoteCandidate(board, laneId, { id: 'node_blank_1', label: '' })!
      expect(next).not.toBeNull()
      const card = next.cards.find(item => item.id === 'node_blank_1')!
      expect(card.label).toBe(expected)
      // The board as the server stores it keeps the card and what it remembers of the note.
      expect(validateWorkshop(next).cards.find(item => item.id === 'node_blank_1')).toEqual(card)
      // Left as it is, dragged off the board: an empty note again.
      expect(workshopCardNoteWords(next, card)).toBe('')
      expect(workshopCardAsNote(next, card.id)!.cards.some(item => item.id === card.id)).toBe(false)
      // Renamed first, it leaves with its new words.
      const renamed = { ...card, label: 'Sam' }
      expect(workshopCardNoteWords({ ...next, cards: next.cards.map(item => item.id === card.id ? renamed : item) }, renamed)).not.toBe('')
    })
  }

  it('keeps the shape of the empty note for its way back', () => {
    const board = validateWorkshop(hiringPlanSample())
    const laneId = board.lanes[0].id
    const next = workshopNoteCandidate(board, laneId, { id: 'node_round_1', label: '', asNote: { shape: 'ellipse', width: 120, height: 120 } })!
    const card = next.cards.find(item => item.id === 'node_round_1')!
    expect(card).toMatchObject({ label: 'New hire', asNote: { shape: 'ellipse', width: 120, height: 120, text: '' } })
    expect(workshopCardNoteWords(next, card)).toBe('')
  })

  it('a note of only a number takes the name too: "5 days" on a launch plan is a five-day "New task"', () => {
    const board = validateWorkshop(launchPlanSample())
    const laneId = board.lanes[0].id
    expect(workshopNoteRefusal(board, laneId, { id: 'node_five', label: '5 days' })).toBeNull()
    const card = workshopNoteCandidate(board, laneId, { id: 'node_five', label: '5 days' })!.cards.find(item => item.id === 'node_five')!
    expect(card).toMatchObject({ label: 'New task', duration: 5 })
    const deal = workshopNoteCandidate(validateWorkshop(samplePipeline()), samplePipeline().lanes[0].id, { id: 'node_deal', label: '$20k' })!
      .cards.find(item => item.id === 'node_deal')!
    expect(deal).toMatchObject({ label: 'New deal', amount: 20000 })
  })

  it('on a tree, the card takes the word of what sits under the card it was dropped on', () => {
    const board = validateWorkshop(catalogSamples['discovery-tree']())
    expect(workshopNewCardName(board, 'slow-onboarding')).toBe('New solution')
    expect(workshopNewCardName(board, 'outcome')).toBe('New opportunity')
    const next = workshopNoteCandidate(board, board.lanes[0].id, { id: 'node_sol', label: '', under: 'slow-onboarding' })!
    expect(next.cards.find(item => item.id === 'node_sol')).toMatchObject({ label: 'New solution', parentId: 'slow-onboarding' })
  })

  it('the word for a new item is the one the catalog adds cards with ("Add a hire" → "New hire")', () => {
    let checked = 0
    for (const entry of catalogList()) {
      const add = entry.moves.find(item => item.edit === 'add_card' && /^Add an? /.test(item.words))
      if (!add || /\bunder\b/.test(add.say)) continue
      const board = validateWorkshop(catalogPreset(entry.id, undefined, catalogSamples))
      const noun = add.words.replace(/^Add an? /, '')
      // Lane boards add "a card"; every other board adds its own item.
      expect(workshopNewCardName(board), entry.id).toBe('New ' + noun)
      checked++
    }
    expect(checked).toBeGreaterThanOrEqual(10)
  })
})

describe('add_card with no words, from chat or exec, gets the same name', () => {
  for (const [name, make, laneId, expected] of kinds) {
    it(`a ${name}: add_card without a label adds "${expected}"`, () => {
      const board = make()
      const made = applyWorkshopEdits(board, [{ kind: 'add_card', lane: { id: laneId }, ...(name === 'budget' && { amount: 1000 }), ...(name === 'map' && { free: true }) }]) as any
      expect(made.refused, JSON.stringify(made.refused)).toBeUndefined()
      const added = made.workshop.cards.find((card: any) => !board.cards.some(item => item.id === card.id) && card.label === expected)
      expect(added, JSON.stringify(made.workshop.cards.map((card: any) => card.label))).toBeTruthy()
      expect(made.report.edits[0].said).toContain(expected)
    })
  }
})
