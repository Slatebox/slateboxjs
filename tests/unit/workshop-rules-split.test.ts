// The business boards' rules load apart from the model: a plain slate never carries them, the
// gate refuses a launch plan, pipeline or budget until they have loaded, and once they have, the
// browser (through the kits) and the server (through slateboxjs/workshops/rules) run the same code.
import { describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'

const boards = () => import('../../src/workshops/rules').then(rules => [rules.sampleLaunchPlan(), rules.samplePipeline(), rules.sampleBudget()])

describe('the business boards\' rules, split from the model', () => {
  it('refuses to read a business board before its rules load, and reads it after', async () => {
    const samples = JSON.parse(JSON.stringify(await boards()))
    vi.resetModules()
    const model = await import('../../src/workshops/model')
    for (const board of samples) {
      expect(model.workshopRulesLoaded(board.kind)).toBe(false)
      expect(() => model.validateWorkshop(board)).toThrow(/rules have not loaded/)
      const edit = model.applyWorkshopEdits(board, [{ kind: 'rename_workshop', title: 'x' }])
      expect('refused' in edit && edit.refused.code).toBe('invalid_board')
    }
    // A plain board needs nothing more.
    expect(model.validateWorkshop(model.createLaneWorkshop()).lanes.length).toBeGreaterThan(1)
    await import('../../src/workshops/rules')
    for (const board of samples) {
      expect(model.workshopRulesLoaded(board.kind)).toBe(true)
      expect(model.validateWorkshop(board).kind).toBe(board.kind)
    }
  })

  it('loads them with the kits: importing slateboxjs/boards plugs in the same rule objects the rules entry exports', async () => {
    vi.resetModules()
    const model = await import('../../src/workshops/model')
    await import('../../src/boards')
    const rules = await import('../../src/workshops/rules')
    expect(model.workshopRules('launch-plan')).toBe(rules.launchPlanRules)
    expect(model.workshopRules('pipeline')).toBe(rules.pipelineRules)
    expect(model.workshopRules('budget')).toBe(rules.budgetRules)
  })

  it('keeps the rule modules out of the model entry\'s imports', () => {
    for (const file of ['model.ts', 'edits.ts', 'native.ts', 'names.ts', 'kinds.ts']) {
      const source = readFileSync(new URL('../../src/workshops/' + file, import.meta.url), 'utf8')
      for (const line of source.split('\n').filter(text => /^\s*(?:import|export)\b.*from\s+'/.test(text) && !/^\s*(?:import|export) type\b/.test(text))) {
        expect(line, file).not.toMatch(/'\.\/(?:launchPlan|pipeline|budget|numbers|rules)'/)
      }
    }
  })
})
