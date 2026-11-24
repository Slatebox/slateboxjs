import { describe, expect, it } from 'vitest'
import { applyWorkshopEdits, validateWorkshop, type Workshop, type WorkshopEditResult } from '../../src/workshops/model'
import '../../src/workshops/rules'
import { behaviourOf } from '../../src/workshops/behaviour'
import { ruleControls } from '../../src/workshops/controls'
import { drawRuleControls } from '../../src/boards/ruleControlsLayer'
import { createStillRenderer } from '../../src/boards/still'

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

  it('the entry points exist: the rule controls (tests/unit/rule-controls.test.ts), a layer that draws nothing without a canvas, and the still renderer (tests/unit/still.test.ts)', () => {
    // Superseded stub: BUILDER filled ruleControls. Without the board's drawn places only its board-wide rail shows (its rule
    // and, since the board's appearance chips, its look).
    expect(ruleControls(team, null).map(control => control.id)).toEqual(['path:any', 'look:emphasis', 'look:density', 'look:lines'])
    const layer = drawRuleControls(null, 'main', [])
    expect(() => { layer.update([]); layer.remove() }).not.toThrow()
    const still = createStillRenderer({ model: async () => ({}) as any, boards: async () => ({}) as any, nest: async () => null, behaviour: async () => null })
    expect(typeof still.renderStill).toBe('function')
    expect(typeof still.drawSlateBoards).toBe('function')
  })
})
