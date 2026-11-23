import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, type Workshop, type WorkshopEditResult } from '../../src/workshops/model'
import '../../src/workshops/rules'
import { behaviourOf } from '../../src/workshops/behaviour'
import { ruleControls } from '../../src/workshops/controls'
import { drawRuleControls } from '../../src/boards/ruleControlsLayer'
import { drawSlateBoards, renderStill } from '../../src/boards/still'

// The shared library's engine foundation (library spec §4.3, §7.2, §9.1): a rule set from a control
// drawn on the board is audited as set on the canvas, and the two new entry points exist for the
// slices to fill (rule controls, the one still renderer).

const ok = (result: WorkshopEditResult): Workshop => {
  if ('refused' in result) throw new Error('refused: ' + result.refused.reason)
  return result.workshop
}
const team = validateWorkshop({ version: 1, title: 'Team', lanes: [{ id: 'todo', label: 'To do' }, { id: 'review', label: 'Review' }], cards: [] })

describe('library foundation', () => {
  it('a rule set from the canvas says so, and the one gate keeps it', () => {
    const next = ok(applyWorkshopEdits(team, [{ kind: 'add_rule', rule: { kind: 'capacity', where: 'Review', max: 2 } }],
      { actor: { by: 'Ada', via: 'canvas' }, now: '2026-11-23T10:00:00.000Z' }))
    expect(behaviourOf(next).rules[0].set).toEqual({ by: 'Ada', at: '2026-11-23T10:00:00.000Z', via: 'canvas' })
    expect(behaviourOf(validateWorkshop(next)).rules[0].set.via).toBe('canvas')
    // Any other source is still refused.
    const forged = { ...next, behaviour: { ...next.behaviour!, rules: [{ ...next.behaviour!.rules[0], set: { by: 'x', at: '2026-11-23T10:00:00.000Z', via: 'hand' } }] } }
    expect(() => validateWorkshop(forged as Workshop)).toThrow()
  })

  it('the entry points exist: no controls yet, a layer that draws nothing, a still renderer not built yet', () => {
    expect(ruleControls(team, null)).toEqual([])
    const layer = drawRuleControls(null, 'main', [])
    expect(() => { layer.update([]); layer.remove() }).not.toThrow()
    expect(() => renderStill(null, {})).toThrow(/not built yet/)
    expect(() => drawSlateBoards(null, {})).toThrow(/not built yet/)
  })
})
