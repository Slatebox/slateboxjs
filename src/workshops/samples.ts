// slateboxjs/workshops/samples: the boards the library's business entries add (catalogPreset's samples), each made
// fresh. Its own chunk, loaded only where a board is added (the library, the chat's Add, a new slate, a server's
// add_component), so a board being played never downloads them. The boards they make are read by the rules, so
// loading it loads slateboxjs/workshops/rules too.
import type { Behaviour } from './behaviour'
import type { Workshop, WorkshopCard } from './model'
// Only through the rules' own exports, so this chunk shares the rules' chunk and carries none of it.
import { orderKeys, planSamples } from './rules'

type Board = Workshop

type Item = [id: string, label: string, extra?: Partial<WorkshopCard>]
/** Cards in order under one parent (or at the top of an area), with keys. */
function laid(laneId: string, items: Item[], parentId?: string): WorkshopCard[] {
  const keys = orderKeys(items.length)
  return items.map(([id, label, extra], i) => ({ id, label, laneId, order: keys[i], ...(parentId && { parentId }), ...extra }))
}

/** The rules a board is given as it is made (a preset's). */
const preset = (rules: Array<Record<string, unknown>>): Behaviour => ({ version: 1, rev: 0,
  rules: rules.map((rule, i) => ({ id: 'rule-' + (i + 1), on: true, severity: 'refuse', set: { by: 'Slatebox', at: '2026-11-21T00:00:00.000Z', via: 'preset' }, ...rule }) as never) })

/**
 * Sort the evidence: three piles of what customers said, two notes not sorted yet, ARR per customer. Its rules:
 * notes sit in piles, one level deep, piles rank by how many customers, a note let go in empty space starts a pile.
 */
export function sortEvidenceSample(): Board {
  const note = (source: string, arr: number) => ({ role: 'note', source, fields: { arr } })
  return {
    version: 1, kind: 'nest', title: 'Sort the evidence', nest: { layout: 'clusters', fields: [{ id: 'arr', label: 'ARR', currency: '$' }] },
    lanes: [{ id: 'piles', label: 'Piles' }, { id: 'unsorted', label: 'Unsorted' }],
    cards: [
      ...laid('piles', [['onboarding', 'Onboarding', { role: 'pile' }], ['reporting', 'Reporting', { role: 'pile' }], ['pricing', 'Pricing', { role: 'pile' }]]),
      ...laid('piles', [['setup-days', 'Setup took two days', note('Acme', 24000)], ['where-start', 'Didn’t know where to start', note('Globex', 36000)],
        ['invites', 'Invite flow is confusing', note('Initech', 12000)]], 'onboarding'),
      ...laid('piles', [['csv-export', 'Couldn’t find CSV export', note('Acme', 24000)], ['finance-match', 'Charts don’t match finance', note('Umbrella', 60000)]], 'reporting'),
      ...laid('piles', [['seats', 'Seats are too expensive', note('Initech', 12000)], ['annual', 'Want annual billing', note('Hooli', 30000)]], 'pricing'),
      ...laid('unsorted', [['trust', 'I don’t trust the numbers', note('Umbrella', 60000)], ['mobile', 'Mobile app please', note('Hooli', 30000)]]),
    ],
    behaviour: preset([{ kind: 'nests', role: 'note', under: ['pile'] }, { kind: 'depth', max: 1 }, { kind: 'rank', by: 'sources' }, { kind: 'emptyDrop', drop: 'new-pile' }]),
  }
}

/** Discovery tree: an outcome, the opportunities under it and the solutions under those; two ideas parked. */
export function discoveryTreeSample(): Board {
  return {
    version: 1, kind: 'nest', title: 'Discovery tree', nest: { layout: 'tree' },
    lanes: [{ id: 'tree', label: 'Discovery tree' }, { id: 'parked', label: 'Parked ideas' }],
    cards: [
      ...laid('tree', [['outcome', 'Activation to 40%', { role: 'outcome' }]]),
      ...laid('tree', [['slow-onboarding', 'Onboarding is slow', { role: 'opportunity' }], ['data-trust', 'Data trust', { role: 'opportunity' }],
        ['sharing', 'Hard to share results', { role: 'opportunity' }]], 'outcome'),
      ...laid('tree', [['guided-setup', 'Guided setup', { role: 'solution' }], ['csv-import', 'CSV import', { role: 'solution' }]], 'slow-onboarding'),
      ...laid('tree', [['reconcile', 'Reconcile with finance', { role: 'solution' }]], 'data-trust'),
      ...laid('parked', [['templates', 'Templates gallery', { role: 'solution' }], ['digest', 'Slack digest', { role: 'solution' }]]),
    ],
    behaviour: preset([{ kind: 'nests', role: 'opportunity', under: ['outcome'] }, { kind: 'nests', role: 'solution', under: ['opportunity'] },
      { kind: 'depth', max: 3 }, { kind: 'children', role: 'opportunity', max: 4 }]),
  }
}

const breakDownRules = () => preset([{ kind: 'nests', role: 'action', under: ['cause'], severity: 'warn' }, { kind: 'depth', max: 6, severity: 'warn' }])

/** Break down a problem (an issue tree): a problem, its causes, causes under those, and actions under causes (warnings, never refusals). */
export function breakDownSample(): Board {
  return {
    version: 1, kind: 'nest', title: 'Break down a problem', nest: { layout: 'tree' },
    lanes: [{ id: 'tree', label: 'The problem' }, { id: 'parked', label: 'Ideas to place' }],
    cards: [
      ...laid('tree', [['problem', 'Churn rose in Q3', { role: 'problem' }]]),
      ...laid('tree', [['drop-off', 'Onboarding drop-off', { role: 'cause' }], ['price-rise', 'Price rise in July', { role: 'cause' }],
        ['free-tier', 'A competitor’s free tier', { role: 'cause' }]], 'problem'),
      ...laid('tree', [['needs-engineer', 'Setup needs an engineer', { role: 'cause' }]], 'drop-off'),
      ...laid('tree', [['guided', 'Ship guided setup', { role: 'action' }]], 'needs-engineer'),
      ...laid('parked', [['survey', 'Survey churned accounts', { role: 'action' }]]),
    ],
    behaviour: breakDownRules(),
  }
}

/** Incident review: the same breakdown for an outage: what caused it, what caused that, and what to fix. */
export function incidentReviewSample(): Board {
  return {
    version: 1, kind: 'nest', title: 'Incident review', nest: { layout: 'tree' },
    lanes: [{ id: 'tree', label: 'The incident' }, { id: 'parked', label: 'Not placed yet' }],
    cards: [
      ...laid('tree', [['outage', 'Sign-in outage, 14 Nov', { role: 'problem' }]]),
      ...laid('tree', [['certificate', 'Expired certificate', { role: 'cause' }], ['rollback', 'Slow rollback', { role: 'cause' }]], 'outage'),
      ...laid('tree', [['alert-inbox', 'Renewal alert went to an old inbox', { role: 'cause' }]], 'certificate'),
      ...laid('tree', [['rota-alerts', 'Send alerts to the on-call rota', { role: 'action' }]], 'alert-inbox'),
      ...laid('tree', [['script-rollback', 'Script the rollback', { role: 'action' }]], 'rollback'),
      ...laid('parked', [['status-page', 'Status page went up late', { role: 'cause' }]]),
    ],
    behaviour: breakDownRules(),
  }
}

// Impact × effort, the reorg sandbox and goals & owners.

/** Impact × effort: what to work on next, scored; Do now already holds its three. */
export function impactEffortSample(): Board {
  const at = (effort: number, impact: number) => ({ fields: { effort, impact } })
  return {
    version: 1, kind: 'nest', title: 'Impact × effort',
    nest: { layout: 'matrix', fields: [{ id: 'effort', label: 'Effort' }, { id: 'impact', label: 'Impact' }], axes: ['effort', 'impact'] },
    lanes: [{ id: 'matrix', label: 'Impact × effort' }, { id: 'unscored', label: 'Not scored yet' }],
    cards: [
      ...laid('matrix', [['search', 'Faster search', at(3, 8)], ['sso', 'SSO', at(4, 9)], ['exports', 'Exports', at(2, 6)], ['mobile', 'Mobile app', at(9, 7)],
        ['summaries', 'AI summaries', at(7, 6)], ['dark-mode', 'Dark mode', at(2, 3)], ['billing', 'Rewrite billing', at(9, 2)]]),
      ...laid('unscored', [['alerts', 'Slack alerts'], ['audit', 'Audit log']]),
    ],
    behaviour: preset([{ kind: 'quadrant', quadrant: 'do-now', max: 3 }]),
  }
}

/** Reorg & hiring sandbox: who reports to whom, open roles, a contractor; spans, open roles and designers as rules. */
export function reorgSample(): Board {
  const person = (role: string, contractor = false) => ({ role, ...(contractor && { fields: { contractor: 1 } }) })
  return {
    version: 1, kind: 'nest', title: 'Reorg & hiring sandbox', nest: { layout: 'tree', fields: [{ id: 'contractor', label: 'Contractor', flag: true }] },
    lanes: [{ id: 'org', label: 'Org chart' }, { id: 'unplaced', label: 'Not placed yet' }],
    cards: [
      ...laid('org', [['dana', 'Dana Ito, CEO', person('manager')]]),
      ...laid('org', [['maya', 'Maya Chen, VP Product', person('manager')], ['priya', 'Priya Rao, VP Eng', person('manager')], ['vp-sales', 'VP Sales', person('open role')]], 'dana'),
      ...laid('org', [['jo', 'Jo Park, Growth', person('manager')]], 'maya'),
      ...laid('org', [['ravi', 'Ravi Shah', person('engineer')], ['lena', 'Lena Ortiz', person('designer')], ['sam', 'Sam Lee', person('engineer', true)]], 'jo'),
      ...laid('org', [['kai', 'Kai Wong, Platform', person('manager')]], 'priya'),
      ...laid('org', [['tom', 'Tom Berg', person('engineer')], ['ivy', 'Ivy Moss', person('engineer')]], 'kai'),
      ...laid('unplaced', [['ae-1', 'Account exec 1', person('open role')], ['ae-2', 'Account exec 2', person('open role')]]),
    ],
    behaviour: preset([{ kind: 'children', role: 'manager', max: 6 }, { kind: 'parent', not: 'open role' }, { kind: 'parent', not: 'contractor' },
      { kind: 'contains', role: 'manager', of: 'designer', atLeast: 1, severity: 'warn' }, { kind: 'depth', max: 5 }]),
  }
}

/** Goals & owners: objectives, key results and initiatives, each owned by a team; a key result owned outside its objective's team is flagged. */
export function goalsSample(): Board {
  const own = (role: string, owner: string) => ({ role, owner })
  return {
    version: 1, kind: 'nest', title: 'Goals & owners',
    nest: { layout: 'tree', owners: [{ id: 'growth', label: 'Growth' }, { id: 'platform', label: 'Platform' }, { id: 'sales', label: 'Sales' }] },
    lanes: [{ id: 'goals', label: 'Goals' }, { id: 'unplaced', label: 'Not placed yet' }],
    cards: [
      ...laid('goals', [['activation', 'Activation to 40%', own('objective', 'growth')], ['uptime', '99.9% uptime', own('objective', 'platform')]]),
      ...laid('goals', [['fast-onboarding', 'Onboarding under 10 min', own('key result', 'growth')], ['self-serve', 'Self-serve upgrades 30%', own('key result', 'growth')]], 'activation'),
      ...laid('goals', [['guided', 'Guided setup', own('initiative', 'growth')], ['starters', 'Starter templates', own('initiative', 'growth')]], 'fast-onboarding'),
      ...laid('goals', [['pricing-page', 'New pricing page', own('initiative', 'growth')]], 'self-serve'),
      ...laid('goals', [['latency', 'p95 under 300 ms', own('key result', 'platform')]], 'uptime'),
      ...laid('goals', [['cache', 'Cache the hot paths', own('initiative', 'platform')]], 'latency'),
      ...laid('unplaced', [['partners', 'Partner channel live', own('key result', 'sales')]]),
    ],
    behaviour: preset([{ kind: 'nests', role: 'key result', under: ['objective'] }, { kind: 'nests', role: 'initiative', under: ['key result'] },
      { kind: 'sameOwnerAs', mode: 'warn', severity: 'warn' }, { kind: 'depth', max: 3 }]),
  }
}

/** The boards the library's business entries add (catalogPreset's samples), each made fresh, dated from the next Monday. */
export const catalogSamples = { ...planSamples,
  'sort-evidence': sortEvidenceSample, 'discovery-tree': discoveryTreeSample, 'break-down': breakDownSample, 'incident-review': incidentReviewSample,
  'impact-effort': impactEffortSample, reorg: reorgSample, goals: goalsSample }
