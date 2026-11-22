import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, type Workshop, type WorkshopEditResult } from '../../src/workshops/model'

/**
 * Boards S2a (plan 2026-11-22): the gear puts a whole board in focus for the chat. Its edits name
 * the board as what is selected ({ kind: 'board' }), so "add a column" needs no lane, and "this
 * lane" or "this card" still asks for a lane or card to be selected rather than guessing one.
 */

function ok(result: WorkshopEditResult): Workshop {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}

const retro = validateWorkshop({
  version: 1, title: 'Retro',
  lanes: [{ id: 'well', label: 'Went well' }, { id: 'change', label: 'To change' }, { id: 'try', label: 'To try' }],
  cards: [{ id: 'ship', label: 'Shipped on time', laneId: 'well' }],
})
const board = { kind: 'board' as const, id: 'main' }

describe('a board in focus', () => {
  it('takes the board\'s own edits with the board as the selection', () => {
    const next = ok(applyWorkshopEdits(retro, [{ kind: 'add_lane', label: 'Blocked' }, { kind: 'set_lane_capacity', lane: 'To change', capacity: 2 }], { selection: board }))
    expect(next.lanes.map(lane => lane.label)).toEqual(['Went well', 'To change', 'To try', 'Blocked'])
    expect(next.lanes[1].capacity).toBe(2)
    expect(ok(applyWorkshopEdits(retro, [{ kind: 'rename_workshop', title: 'Sprint 12 retro' }], { selection: board })).title).toBe('Sprint 12 retro')
  })

  it('never reads "this lane" or "this card" as some lane or card of the board', () => {
    const lane = applyWorkshopEdits(retro, [{ kind: 'rename_lane', lane: 'this', label: 'Kudos' }], { selection: board })
    expect('refused' in lane && lane.refused).toMatchObject({ code: 'no_selection' })
    const card = applyWorkshopEdits(retro, [{ kind: 'move_card', card: 'this', lane: 'To try' }], { selection: board })
    expect('refused' in card && card.refused).toMatchObject({ code: 'no_selection', reason: 'Select a card on the canvas first, or use its name.' })
  })
})
