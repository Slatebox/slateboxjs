import { describe, expect, it } from 'vitest'
import { validateWorkshop, workshopCardAsNote, workshopNoteCandidate, type Workshop } from '../../src/workshops/model'
import '../../src/workshops/behaviour'
import { launchPlanSample, sampleBudget, sampleLaunchPlan, samplePipeline } from '../../src/workshops/rules'
import { sortEvidenceSample } from '../../src/workshops/samples'

/**
 * Boards S1 (2026-11-22, owner): a note dropped on a board becomes the board's card, and dragged
 * off it gets its own shape back. A pipeline, budget, launch or hiring plan and a nested board make
 * their card by their own rules (businessNote); the card keeps the note's shape and look there too,
 * so a diamond comes back a diamond and not a rectangle.
 */
const diamond = { shape: 'diamond', width: 140, height: 90 }
const look = { backgroundColor: '#f0d399', textColor: '#24372d', borderColor: '#627569', borderWidth: 2 }

describe('a business board keeps a note\'s shape and look on the card it becomes', () => {
  const boards: Array<[string, Workshop, string, string]> = [
    ['pipeline', validateWorkshop(samplePipeline()), 'lead', 'Pick vendor $20k'],
    ['budget', validateWorkshop(sampleBudget()), sampleBudget().lanes[0].id, 'Pick vendor $20k'],
    ['launch plan', validateWorkshop(sampleLaunchPlan()), 'product', 'Pick vendor 3 days'],
    ['go-live plan', validateWorkshop(launchPlanSample()), launchPlanSample().lanes[0].id, 'Pick vendor 3 days'],
    ['nested board', validateWorkshop(sortEvidenceSample() as Workshop), 'unsorted', 'Pick vendor'],
  ]
  for (const [name, board, laneId, label] of boards) {
    it(`a diamond on a ${name} is a card that remembers it was a diamond, and leaves as one`, () => {
      const next = workshopNoteCandidate(board, laneId, { id: 'node_pick_1', label, look, asNote: diamond })!
      expect(next).not.toBeNull()
      const card = next.cards.find(item => item.id === 'node_pick_1')!
      expect(card).toMatchObject({ laneId, look, asNote: diamond })
      expect(card.label).toBe('Pick vendor')
      // The board as the server stores it keeps both.
      expect(validateWorkshop(next).cards.find(item => item.id === 'node_pick_1')).toEqual(card)
      // Taken off the board, the card carried what the note needs to be drawn as a diamond again.
      const back = workshopCardAsNote(next, 'node_pick_1')!
      expect(back.cards.some(item => item.id === 'node_pick_1')).toBe(false)
    })
  }

  it('keeps its place when an undo puts it back before another card, shape and all', () => {
    const board = validateWorkshop(samplePipeline())
    const next = workshopNoteCandidate(board, 'lead', { id: 'node_pick_1', label: 'Pick vendor $20k', asNote: diamond }, 'globex')!
    expect(next.cards.map(card => card.id).slice(0, 3)).toEqual(['northwind', 'node_pick_1', 'globex'])
    expect(next.cards[1].asNote).toEqual(diamond)
  })

  it('a card made under a fresh id still remembers the note, its shape and look', () => {
    const board = validateWorkshop(samplePipeline())
    const next = workshopNoteCandidate(board, 'lead', { id: 'acme', label: 'Acme again $5k', look, asNote: diamond })!
    const card = next.cards.at(-1)!
    expect(card).toMatchObject({ noteId: 'acme', look, asNote: diamond })
    expect(card.id).not.toBe('acme')
  })

  it('takes nothing a card cannot keep: an unknown shape word is dropped with the rest of a bad offer', () => {
    const board = validateWorkshop(samplePipeline())
    const next = workshopNoteCandidate(board, 'lead', { id: 'n', label: 'Odd $1k', asNote: { shape: 'url(x)', width: 120 } as never })!
    expect(next.cards.at(-1)!.asNote).toEqual({ width: 120 })
  })
})
