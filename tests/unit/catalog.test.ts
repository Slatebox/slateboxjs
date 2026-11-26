import { describe, expect, it } from 'vitest'
import { catalog, catalogAddRequest, catalogEntry, catalogFits, catalogMatch, catalogPreset, catalogVersion } from '../../src/workshops/catalog'
import { describeWorkshopEdits, validateWorkshop, workshopBoardKind } from '../../src/workshops/model'
import { behaviourLines, ruleKindIds } from '../../src/workshops/behaviour'
import { timeRuleKindIds } from '../../src/workshops/rules'
import { catalogSamples as samples } from '../../src/workshops/samples'

// The smart-component library (library final.md §2.4, §2.8): one catalogue the panel, the + menu,
// chat, exec and the site read. Only entries whose kind is built are listed.

const ids = ['now-next-later', 'pros-cons', 'must-should-could', 'decision-path', 'retro', 'triage', 'team-board', 'launch-plan', 'customer-go-live', 'hiring-plan',
  'sort-evidence', 'discovery-tree', 'break-down-problem', 'incident-review', 'impact-effort', 'reorg-sandbox', 'goals-owners', 'printable-page', 'sales-pipeline', 'budget']
const nestRuleKinds = ['nests', 'children', 'depth', 'rank', 'emptyDrop', 'quadrant', 'parent', 'contains', 'sameOwnerAs']
const gridRuleKinds = ['tileTypes', 'tileMax', 'tileNeeds', 'tileSpan']

describe('catalogue', () => {
  it('lists the twenty entries built on this line, each with a group, a line, ways to say it and a loop', () => {
    expect(catalog.map(entry => entry.id)).toEqual(ids)
    expect(catalogVersion).toMatch(/^\d+\.\d+$/)
    for (const entry of catalog) {
      expect(['plan', 'decide', 'meetings', 'track', 'map', 'make']).toContain(entry.group)
      expect(entry.name.length).toBeGreaterThan(2)
      expect(entry.line.length).toBeLessThanOrEqual(80)
      expect(entry.addSay[0]).toMatch(/^Add /)
      expect(catalogAddRequest(entry.addSay[0])).toEqual({ id: entry.id })
      expect(catalogAddRequest(entry.addSay[1].replace('{topic}', 'hiring'))).toEqual({ id: entry.id, topic: 'hiring' })
      expect(entry.loop.src).toBe('/library/' + entry.id + '.svg')
      expect(entry.loop.steps.length).toBeGreaterThanOrEqual(2)
      // Many boards on a slate (boards S4a): every entry goes beside the boards there, and says so.
      expect(entry.multiPerSlate).toBe(true)
      expect(entry.limits.join(' ')).not.toMatch(/One board per slate/)
      expect(entry.limits).toContain('Up to 8 boards on one slate, side by side; past that, it opens on a new slate.')
      // No ALL-CAPS placeholder tokens in anything that becomes a prompt (AGENTS.md prompt hygiene).
      expect(JSON.stringify(entry)).not.toMatch(/\b[A-Z]{3,}\b(?: [A-Z]{3,}\b)+/)
    }
  })

  it('builds every preset through the one gate, with its rulebook, and every edit it lists is one the board takes', () => {
    for (const entry of catalog) {
      const board = validateWorkshop(catalogPreset(entry.id, undefined, samples))
      expect(workshopBoardKind(board)).toBe(entry.build.kind)
      const accepted = describeWorkshopEdits(board).filter(edit => edit.accepted).map(edit => edit.kind)
      for (const edit of entry.edits) expect(accepted, entry.id + ' lists ' + edit).toContain(edit)
      for (const rule of entry.rules) expect(entry.build.kind === 'launch-plan' || entry.build.kind === 'hiring-plan' ? timeRuleKindIds : entry.build.kind === 'nest' ? nestRuleKinds : entry.build.kind === 'grid' ? gridRuleKinds : ruleKindIds).toContain(rule)
      // Every edit it offers has a move with a phrase; the app's listing gate checks each phrase parses.
      expect(entry.edits).toEqual([...new Set(entry.moves.map(item => item.edit))])
    }
    expect(behaviourLines(validateWorkshop(catalogPreset('retro')))).toEqual(['Went well holds 3.', 'Change holds 3.', 'Try holds 3.'])
    expect(behaviourLines(validateWorkshop(catalogPreset('team-board')))).toEqual(['Cards move one column at a time.', 'Doing holds 3.', "Won't do archives cards: they stay on the board, never deleted."])
  })

  it('names a preset after a topic, never with a placeholder', () => {
    expect(catalogPreset('retro', 'the Q3 launch').title).toBe('Retro: the Q3 launch')
    expect(catalogPreset('retro').title).toBe('Retro')
  })

  it('reads an add request in plain words, locally', () => {
    expect(catalogAddRequest('Add a retro')).toEqual({ id: 'retro' })
    expect(catalogAddRequest('Add a retro about the Q3 launch')).toEqual({ id: 'retro', topic: 'the Q3 launch' })
    expect(catalogAddRequest('add a team board')).toEqual({ id: 'team-board' })
    expect(catalogAddRequest('Add a sales pipeline')).toEqual({ id: 'sales-pipeline' })
    expect(catalogAddRequest('Add pros and cons for hiring a second designer')).toEqual({ id: 'pros-cons', topic: 'hiring a second designer' })
    expect(catalogAddRequest('Add a card called Retro to Now')).toBeNull()
    expect(catalogAddRequest('Make a workshop with Now, Next and Later')).toBeNull()
  })

  it('answers “what can I add?” and searches by job, locally', () => {
    expect(catalogMatch('what can I add?')).toEqual({ all: true, entries: ids })
    expect(catalogMatch('What can this do?')).toBeNull()
    expect(catalogMatch('something to track deals')?.entries[0]).toBe('sales-pipeline')
    expect(catalogMatch('how do I run a retro?')?.entries[0]).toBe('retro')
    expect(catalogMatch('something to prioritise features')?.entries).toContain('must-should-could')
    expect(catalogMatch('Move Billing to Done')).toBeNull()
    expect(catalogMatch('something to sort interview feedback into themes')?.entries[0]).toBe('sort-evidence')
    expect(catalogMatch('I need a template for a root cause')?.entries).toEqual(expect.arrayContaining(['break-down-problem', 'incident-review']))
    expect(catalogMatch('something for product discovery')?.entries[0]).toBe('discovery-tree')
    expect(catalogAddRequest('Add an incident review about the sign-in outage')).toEqual({ id: 'incident-review', topic: 'the sign-in outage' })
    // Impact × effort, the reorg sandbox and goals & owners: found by the job, added by name.
    expect(catalogMatch('something to find quick wins')?.entries[0]).toBe('impact-effort')
    expect(catalogMatch('I need a board for our reorg and reporting lines')?.entries[0]).toBe('reorg-sandbox')
    expect(catalogMatch('something for quarterly planning of okrs')?.entries[0]).toBe('goals-owners')
    // The printable page (a grid sheet): found by the job, added by name, in its own group.
    expect(catalogMatch('something to make a worksheet')?.entries[0]).toBe('printable-page')
    expect(catalogAddRequest('Add a printable page about fractions')).toEqual({ id: 'printable-page', topic: 'fractions' })
    expect(catalogEntry('printable-page')).toMatchObject({ group: 'make', build: { kind: 'grid', sample: 'worksheet' } })
    expect(catalogAddRequest('Add an impact × effort board about Q1 bets')).toEqual({ id: 'impact-effort', topic: 'Q1 bets' })
    expect(catalogAddRequest('Add a reorg & hiring sandbox')).toEqual({ id: 'reorg-sandbox' })
    expect(catalogAddRequest('Add a goals & owners board')).toEqual({ id: 'goals-owners' })
  })

  it('says honestly when an entry opens on a new slate: one board per slate for now', () => {
    expect(catalogFits('retro', { hasBoard: false })).toEqual({ ok: true })
    expect(catalogFits('retro', { hasBoard: true })).toEqual({ ok: false, reason: 'This slate already has a board, so this opens on a new slate.' })
    expect(catalogEntry('nope')).toBeUndefined()
    expect(() => catalogPreset('sales-pipeline')).toThrow('Load slateboxjs/workshops/rules before adding a sales pipeline.')
  })
})

describe('the nested boards in the catalogue', () => {
  it('a verb-named entry is added as a board to do it', () => {
    expect(catalogEntry('sort-evidence')!.addSay[0]).toBe('Add a board to sort the evidence')
    expect(catalogAddRequest('Add a board to sort the evidence about onboarding interviews')).toEqual({ id: 'sort-evidence', topic: 'onboarding interviews' })
    expect(catalogAddRequest('Add a board to break down a problem')).toEqual({ id: 'break-down-problem' })
    expect(catalogAddRequest('Add a discovery tree')).toEqual({ id: 'discovery-tree' })
  })
})
