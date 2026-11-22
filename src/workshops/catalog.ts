// slateboxjs/catalog: everything a person can add to a slate (library final.md §2.4, §2.8).
//
// One list, read by the panel's library, the + menu, the chat (local "what can I add?" and
// "Add a retro"), exec's components.list, agents and the site. Pure data and small functions:
// no drawing, no DOM. An entry is listed only when its kind is built and every edit it lists has
// a phrase that parses on its sample (the app's listing-gate test). Presets are data that ship
// with the engine, not slates stored in a database.
import type { Workshop, WorkshopLane } from './model'
import type { WorkshopBoardKind, WorkshopEditKindName } from './edits'
import type { BehaviourRule, RuleKindId } from './behaviour'

export const catalogVersion = '1.0'

export type CatalogGroup = 'plan' | 'decide' | 'meetings' | 'track' | 'map'
export const catalogGroups: { id: CatalogGroup | 'all'; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'plan', label: 'Plan' }, { id: 'decide', label: 'Decide' },
  { id: 'meetings', label: 'Meetings' }, { id: 'track', label: 'Track' }, { id: 'map', label: 'Map' },
]

/** One thing a board does, the edit that does it, and how to say it. */
export interface CatalogMove { edit: WorkshopEditKindName; words: string; say: string; rule?: RuleKindId }

export interface CatalogEntry {
  /** Stable: /new#add=<id>, exec, analytics. */
  id: string
  group: CatalogGroup
  name: string
  /** One line under the name. */
  line: string
  /** The job it does, in the words people search with. */
  synonyms: string[]
  build: { kind: WorkshopBoardKind; sample?: CatalogSample }
  /** What a person says to add it: the first is the Add button's message. */
  addSay: string[]
  /** The workshop_edits this board offers, joined to the engine's edit table (not copied): each has a move with a phrase. */
  edits: WorkshopEditKindName[]
  /** The rule kinds a person can give it by chat (behaviour.ts). */
  rules: RuleKindId[]
  /**
   * What a person can do with it, each with the phrase that does it ("Say it like this"). Slots the app
   * fills from the live board and checks against its parser: {card}, {lane}, {other} (another lane),
   * {busy} (a lane with cards), {ruled} (a lane with a limit rule); on a plan {later} (a date after its
   * line), {dates} (a few days inside it), {month} (a month ahead) and {band} (a role band).
   */
  moves: CatalogMove[]
  limits: string[]
  /** A looping picture of its signature drag; the caption is the rule's own sentence. */
  loop: { src: string; alt: string; caption: string; steps: string[] }
  multiPerSlate: false
}

const preset = (by = 'Slatebox'): BehaviourRule['set'] => ({ by, at: '2026-11-21T00:00:00.000Z', via: 'preset' })
type Lanes = { title: string; lanes: WorkshopLane[]; rules?: Array<Record<string, unknown>> }

/** The lane presets: lanes and default rules, no cards (cards are notes a person brings). */
const lanePresets: Record<string, Lanes> = {
  'now-next-later': { title: 'Now, next, later', lanes: [{ id: 'now', label: 'Now' }, { id: 'next', label: 'Next' }, { id: 'later', label: 'Later' }],
    rules: [{ kind: 'capacity', where: 'next', max: 3 }] },
  'pros-cons': { title: 'Pros and cons', lanes: [{ id: 'pros', label: 'Pros' }, { id: 'cons', label: 'Cons' }, { id: 'questions', label: 'Questions' }], rules: [] },
  'must-should-could': { title: 'Must, should, could', lanes: [{ id: 'must', label: 'Must' }, { id: 'should', label: 'Should' }, { id: 'could', label: 'Could' },
    { id: 'wont', label: "Won't" }], rules: [{ kind: 'capacity', where: 'must', max: 3 }, { kind: 'capacity', where: 'could', max: 2 }, { kind: 'bin', lane: 'wont' }] },
  retro: { title: 'Retro', lanes: [{ id: 'well', label: 'Went well' }, { id: 'change', label: 'Change' }, { id: 'try', label: 'Try' }],
    rules: [{ kind: 'capacity', where: 'well', max: 3 }, { kind: 'capacity', where: 'change', max: 3 }, { kind: 'capacity', where: 'try', max: 3 }] },
  triage: { title: 'Triage', lanes: [{ id: 'new', label: 'New' }, { id: 'today', label: 'Today' }, { id: 'waiting', label: 'Waiting' }, { id: 'done', label: 'Done' }],
    rules: [{ kind: 'capacity', where: 'today', max: 3 }] },
  'team-board': { title: 'Team board', lanes: [{ id: 'todo', label: 'To do' }, { id: 'doing', label: 'Doing' }, { id: 'review', label: 'Review' },
    { id: 'done', label: 'Done' }, { id: 'wont', label: "Won't do" }],
    rules: [{ kind: 'path', from: 'any', noSkip: true }, { kind: 'capacity', where: 'doing', max: 3 }, { kind: 'bin', lane: 'wont' }] },
}

const decisionPath = (): Workshop => ({ version: 1, title: 'Decision path', lanes: [
  { id: 'question', label: 'The question', station: { column: 0, row: 0, next: ['option-a', 'option-b'], outcome: 'Say what you are deciding.' } },
  { id: 'option-a', label: 'Option A', station: { column: 1, row: 0, next: ['decide'], outcome: 'Weigh the first option.' } },
  { id: 'option-b', label: 'Option B', station: { column: 1, row: 1, next: ['decide'], outcome: 'Weigh the second option.' } },
  { id: 'decide', label: 'Decide', station: { column: 2, row: 0, next: [], outcome: 'Write down what you chose and why.' } },
], cards: [{ id: 'token', label: 'Our choice', laneId: 'question' }] })

const move = (edit: WorkshopEditKindName, words: string, say: string, rule?: RuleKindId): CatalogMove => ({ edit, words, say, ...(rule && { rule }) })
// The rule phrases first: they are what "Say it like this" shows of a board's behaviour.
const laneMoves = (path = move('add_rule', 'Cards move one lane at a time', 'Cards move one lane at a time', 'path'), more: CatalogMove[] = []) => [
  move('add_rule', 'Limit a lane', 'Let {busy} hold 1', 'capacity'), path, ...more,
  move('move_card', 'Move a card', 'Move {card} to {other}'), move('add_card', 'Add a card', 'Add a card called Snacks to {lane}'),
  move('rename_card', 'Rename a card', 'Rename {card} to Review notes'), move('remove_card', 'Remove a card', 'Remove {card}'),
  move('rename_lane', 'Rename a lane', 'Rename {lane} to Blocked'), move('rename_workshop', 'Rename the board', 'Rename the board to Team review'),
  move('set_rule', 'Warn instead of refusing', 'Just warn me when {ruled} is full'), move('remove_rule', 'Remove a rule', 'Remove the {ruled} rule'),
]
const laneLimits = ['One board per slate for now; on a slate that has one, this opens on a new slate.', 'Up to 5 lanes and 24 cards.']
const edits = (moves: CatalogMove[]) => [...new Set(moves.map(item => item.edit))]
const rules = (moves: CatalogMove[]) => [...new Set(moves.flatMap(item => item.rule ? [item.rule] : []))]
const lanesEntry = (id: string, group: CatalogGroup, name: string, line: string, synonyms: string[], caption: string, steps: string[], extra: Partial<CatalogEntry> = {}): CatalogEntry => ({
  id, group, name, line, synonyms, build: { kind: 'lanes' }, addSay: ['Add ' + article(name) + name.toLowerCase(), 'Add ' + article(name) + name.toLowerCase() + ' about {topic}'],
  edits: edits(extra.moves ?? laneMoves()), rules: rules(extra.moves ?? laneMoves()), moves: laneMoves(), limits: laneLimits,
  loop: { src: '/library/' + id + '.svg', alt: name + ': ' + steps.join(' '), caption, steps }, multiPerSlate: false, ...extra,
})
const withMoves = (moves: CatalogMove[]) => ({ moves, edits: edits(moves), rules: rules(moves) })
// A plan's moves, its rule phrases first: what "Say it like this" shows of how it behaves.
const planMoves = (line: string) => line ? [move('add_rule', 'Let a task slip, in red', 'Let things slip past ' + line + ' but show them in red', 'deadline'),
  move('set_rule', 'Stop a slip at what waits on it', 'Stop me instead of pushing dependent tasks', 'cascade'),
  move('add_rule', 'Add a freeze', 'Nothing ships in code freeze, {dates}', 'blackout'), move('add_rule', 'Keep a team’s tasks apart', '{lane}’s tasks can’t overlap', 'overlap'),
  move('add_rule', 'Lock a task', 'Lock {card}', 'locked'), move('add_rule', 'Snap to weeks', 'Snap to weeks', 'snap'),
  move('set_task', 'Stretch a task', 'Make {card} 3 days'), move('set_launch_day', 'Move ' + line, 'Move ' + line + ' to {later}'),
  move('link_tasks', 'Make a task wait on another', '{card} waits on {other card}'), move('add_card', 'Add a task', 'Add a task called Docs to {lane}'),
  move('rename_card', 'Rename a task', 'Rename {card} to Review notes')]
  : [move('add_rule', 'Keep a runway floor', 'Never let runway drop below 15 months', 'deadline'), move('add_rule', 'Lock a signed offer', 'Lock {card}', 'locked'),
    move('set_rule', 'Stop a slip at what waits on it', 'Stop me instead of pushing dependent hires', 'cascade'),
    move('set_task', 'Move a hire', 'Push {card} to {month}'), move('set_band_cost', 'Price a role band', '{band} costs $16k a month'),
    move('set_funding', 'Move the round', 'Move the round to {month}'), move('add_card', 'Add a hire', 'Add a Designer to {lane}'), move('rename_card', 'Rename a hire', 'Rename {card} to Staff eng')]
/** A plan: a launch plan, a customer go-live or a hiring plan. */
const plan = (id: string, name: string, line: string, synonyms: string[], caption: string, steps: string[], sample: CatalogSample = 'launch-plan',
  kind: WorkshopBoardKind = 'launch-plan'): CatalogEntry => ({ id, group: 'plan', name, line, synonyms, build: { kind, sample },
  addSay: ['Add ' + article(name) + name.toLowerCase(), 'Add ' + article(name) + name.toLowerCase() + ' about {topic}'],
  ...withMoves(planMoves(kind === 'hiring-plan' ? '' : sample === 'go-live' ? 'go-live' : 'launch')),
  limits: [kind === 'hiring-plan' ? 'Cost is per role band, never per person. On a phone it is read-only.' : 'Up to 12 tasks on 2 to 4 teams.', laneLimits[0]],
  loop: { src: '/library/' + id + '.svg', alt: name + ': ' + steps.join(' '), caption, steps }, multiPerSlate: false })
const article = (name: string) => /^pros/i.test(name) ? '' : /^[aeiou]/i.test(name) ? 'an ' : 'a '

export const catalog: readonly CatalogEntry[] = [
  lanesEntry('now-next-later', 'plan', 'Now / Next / Later', 'Order work loosely; Next holds 3', ['roadmap', 'plan work', 'priorities', 'order work', 'backlog'],
    'Next holds 3.', ['Drag a note into a lane: it becomes a card.', 'A full lane dims and says why.'], { addSay: ['Add a Now / Next / Later board', 'Add a Now / Next / Later board about {topic}'] }),
  lanesEntry('pros-cons', 'decide', 'Pros and cons', 'Weigh one decision: pros, cons, questions', ['pro con', 'pros cons', 'weigh a decision', 'decide', 'tradeoffs', 'trade-offs'],
    'No rules: any card goes in any lane.', ['Drag a note in: it becomes a point.', 'Drag it out: it is a note again.'], { addSay: ['Add pros and cons', 'Add pros and cons for {topic}'] }),
  lanesEntry('must-should-could', 'decide', 'Must / Should / Could', 'Prioritise with limits', ['moscow', 'prioritise', 'prioritize', 'priorities', 'features', 'scope'],
    'Could holds 2.', ['Drop a card in Must or Could.', 'A full lane refuses, in its own words.'], { addSay: ['Add a Must / Should / Could board', 'Add a Must / Should / Could board about {topic}'] }),
  { id: 'decision-path', group: 'decide', name: 'Decision path', line: 'Walk through a choice step by step', synonyms: ['decision tree', 'walk through', 'flow', 'choice', 'path', 'decide'],
    build: { kind: 'map' }, addSay: ['Add a decision path', 'Add a decision path about {topic}'],
    ...withMoves([move('add_station', 'Add a step', 'Add Follow-up after {lane}'), move('connect_stations', 'Connect two steps', 'Connect {lane} to {other}'),
      move('move_card', 'Move the token', 'Move {card} to {other}'), move('rename_lane', 'Rename a step', 'Rename {lane} to Build it')]), limits: ['Up to 5 steps on a 3 by 3 grid.', laneLimits[0]],
    loop: { src: '/library/decision-path.svg', alt: 'Decision path: the token moves only along connected steps.', caption: 'Not connected', steps: ['Drag the token along a path.', 'A step with no path to it dims.'] }, multiPerSlate: false },
  lanesEntry('retro', 'meetings', 'Retro', 'Went well, change, try: 3 cards each', ['retrospective', 'retro', 'run a retro', 'team meeting', 'look back', 'lessons'],
    'Try holds 3.', ['A note turns into a card and back.', 'Each lane holds 3; the fourth is refused.']),
  lanesEntry('triage', 'track', 'Triage', 'Sort incoming work; Today holds 3', ['triage', 'inbox', 'incoming', 'support', 'bugs', 'sort work', 'track work'],
    'Today holds 3.', ['A card goes into Today.', 'A full Today refuses.'], { addSay: ['Add a triage board', 'Add a triage board about {topic}'] }),
  lanesEntry('team-board', 'track', 'Team board', 'Your working agreements, enforced: limits, paths, a bin', ['kanban', 'team board', 'working agreements', 'wip limit', 'to do doing done', 'track work', 'sprint'],
    'Doing holds 3.', ['A full Doing shows 3 of 3 and dims.', 'The next card dragged to Doing is refused with that sentence.'], {
      addSay: ['Add a team board', 'Add a team board about {topic}'],
      ...withMoves(laneMoves(move('add_rule', 'Send cards one way', 'From {busy} cards go only to {other}', 'path'), [move('add_rule', 'Add a bin', 'Make {lane} a bin', 'bin')])) }),
  plan('launch-plan', 'Launch plan', 'Tasks on real dates toward launch day, with your rules', ['launch', 'timeline', 'gantt', 'schedule', 'deadline', 'release date', 'code freeze'],
    'A slip pushes the tasks that wait on it.', ['Slide a task: what waits on it follows.', 'Past launch it stops.']),
  plan('customer-go-live', 'Customer go-live', 'Us and the customer, toward one go-live date', ['go-live', 'onboarding', 'implementation', 'rollout', 'kickoff'],
    'Days are working days: weekends don’t count.', ['Slide a task: weekends don’t count.', 'Past go-live it stops.'], 'go-live'),
  plan('hiring-plan', 'Hiring plan', 'Hires over the year, with runway', ['hiring', 'headcount', 'recruiting', 'hires', 'runway', 'burn'],
    'Hires snap to whole weeks.', ['Drag a hire later: runway grows.', 'Below your floor it stops.'], 'hiring-plan', 'hiring-plan'),
  { id: 'sales-pipeline', group: 'track', name: 'Sales pipeline', line: 'Move deals through stages toward a target', synonyms: ['deals', 'sales', 'pipeline', 'crm', 'track deals', 'forecast', 'customers'],
    build: { kind: 'pipeline', sample: 'pipeline' }, addSay: ['Add a sales pipeline', 'Add a sales pipeline about {topic}'],
    ...withMoves([move('move_card', 'Carry a deal on', 'Move {card} to {other}'), move('set_amount', 'Price a deal', 'Make {card} $40k'),
      move('set_target', 'Set the target', 'Set the target to $300k'), move('add_card', 'Add a deal', 'Add a deal called Initech to {lane}'),
      move('add_rule', 'Ask for an amount', '{lane} needs an amount', 'gate'), move('add_rule', 'Limit a stage', 'Let {busy} hold 1', 'capacity')]), limits: ['Up to 16 deals.', laneLimits[0]],
    loop: { src: '/library/sales-pipeline.svg', alt: 'Sales pipeline: carry a deal on; stages it cannot skip dim; the forecast moves.', caption: 'Proposal holds 3.', steps: ['Carry a deal to the next stage.', 'A full stage refuses.'] }, multiPerSlate: false },
  { id: 'budget', group: 'plan', name: 'Budget', line: 'Split a fixed total across teams', synonyms: ['budget', 'money', 'spend', 'allocate', 'costs'],
    build: { kind: 'budget', sample: 'budget' }, addSay: ['Add a budget', 'Add a budget about {topic}'],
    ...withMoves([move('shift_budget', 'Move money between teams', 'Move $10k from {lane} to {other}'), move('set_amount', 'Price a line item', 'Make {card} $20k'),
      move('add_card', 'Add a line item', 'Add a line item called Events for $10k to {lane}')]), limits: ['The total stays fixed.', laneLimits[0]],
    loop: { src: '/library/budget.svg', alt: 'Budget: move money between teams; the total stays fixed.', caption: 'The total stays fixed.', steps: ['Move a divider between teams.', 'The total stays the same.'] }, multiPerSlate: false },
]

export function catalogEntry(id: string): CatalogEntry | undefined {
  return catalog.find(entry => entry.id === id)
}

/** The entries of a group (or all), in catalogue order. */
export function catalogList(group: CatalogGroup | 'all' = 'all'): CatalogEntry[] {
  return catalog.filter(entry => group === 'all' || entry.group === group)
}

/** The samples a business entry adds: from slateboxjs/workshops/rules (catalogSamples), so this chunk keeps no rules. */
export type CatalogSample = 'launch-plan' | 'go-live' | 'hiring-plan' | 'pipeline' | 'budget'
export type CatalogSamples = Partial<Record<CatalogSample, () => Workshop>>

/** The board an entry adds, as data, named after the topic when one is given. A business board needs its sample. */
export function catalogPreset(id: string, topic?: string, samples: CatalogSamples = {}): Workshop {
  const entry = catalogEntry(id)
  if (!entry) throw new Error('There is nothing called ' + id + ' in the library.')
  const named = (title: string) => {
    const about = typeof topic === 'string' ? topic.replace(/\s+/g, ' ').trim().slice(0, 100) : ''
    return (about ? title + ': ' + about : title).slice(0, 120)
  }
  if (entry.build.sample) {
    const sample = samples[entry.build.sample]
    if (!sample) throw new Error('Load slateboxjs/workshops/rules before adding a ' + entry.name.toLowerCase() + '.')
    const board = sample()
    return { ...board, title: topic ? named(entry.name) : board.title }
  }
  if (entry.build.kind === 'map') return { ...decisionPath(), title: named('Decision path') }
  const lanes = lanePresets[id]
  return { version: 1, title: named(lanes.title), lanes: lanes.lanes.map(lane => ({ ...lane })), cards: [],
    behaviour: { version: 1, rev: 0, rules: (lanes.rules ?? []).map((rule, index) => ({ id: 'rule-' + (index + 1), on: true, severity: 'refuse', set: preset(), ...rule }) as BehaviourRule) } }
}

const plain = (text: string) => text.toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9/ ]+/g, ' ').replace(/\s+/g, ' ').trim()

/**
 * "Add a retro", "Add a retro about the Q3 launch", "Add pros and cons for hiring": which entry, and
 * the topic. Null for anything else (a card called Retro, a workshop described in lanes).
 */
export function catalogAddRequest(message: string): { id: string; topic?: string } | null {
  if (typeof message !== 'string' || message.length > 300) return null
  const text = message.trim().replace(/[.!]+$/, '')
  const head = /^(?:please\s+)?(?:add|start|set up|make|create|open)\s+(?:(?:a|an|the|some|our|my)\s+)?(?:new\s+)?/i.exec(text)
  if (!head) return null
  const rest = text.slice(head[0].length)
  for (const entry of [...catalog].sort((a, b) => b.name.length - a.name.length)) {
    const names = [entry.name, ...entry.addSay.map(say => say.replace(/^Add (?:an? )?/i, '').replace(/ (?:about|for) \{topic\}$/, ''))]
    for (const name of names) {
      const words = name.toLowerCase().replace(/\s*\/\s*/g, '\\s*/?\\s*').replace(/ /g, '\\s+')
      const match = new RegExp('^' + words + '(?:\\s+(?:board|component))?(?:\\s+(?:about|for|on)\\s+(.+))?$', 'i').exec(rest)
      if (!match) continue
      // A topic with lanes, a list or amounts in it is a brief: the brief readers make that board, not the preset.
      if (match[1] && /[:;,→]|->|\$|\d\s*(?:k|m|%)\b|\d{3,}/i.test(match[1])) return null
      return match[1] ? { id: entry.id, topic: match[1].trim() } : { id: entry.id }
    }
  }
  return null
}

/**
 * The local answer to a question about the library: "what can I add?" (all), or a job ("something to
 * track deals") ranked by name and synonyms. Null when the message is not about adding (the chat
 * goes on as before).
 */
export function catalogMatch(message: string): { all: boolean; entries: string[] } | null {
  const text = plain(message)
  if (!text || text.length > 200) return null
  if (/^(?:what|which)\s+(?:can|could)\s+(?:i|we|you)\s+(?:add|make|build|put)\b|^(?:show|list|browse)\s+(?:me\s+)?(?:the\s+)?(?:library|components|boards|everything)|^what\s+(?:is|s)\s+in\s+the\s+library/.test(text)) {
    return { all: true, entries: catalog.map(entry => entry.id) }
  }
  // Only a question about what to add: "something to track deals", "I need a board to …", "is there a
  // template for …", "how do I run a retro?". A drawing ("I want a flow chart of …") or a sentence
  // about the board ("we need to limit Doing") is not one: the drawing and the rule grammar read it.
  const thing = '(?:a |an |some |any )?(?:board|template|component|tool|way|something|anything|starter|preset)s? (?:to|for|that)\\b'
  const frame = new RegExp('^(?:(?:something|anything) (?:to|for)\\b|(?:a|an|any) ' + thing + '|(?:i|we) (?:want|need|would like|d like) ' + thing +
    '|(?:is there|do you have|have you got) ' + thing + '|help (?:me|us) (?:pick|choose|find) ' + thing +
    '|how (?:do|can|could|should) (?:i|we) (?:run|track|plan|weigh|prioriti[sz]e|sort|triage|budget|organi[sz]e|decide)\\b)').exec(text)
  if (!frame || /\b(?:draw|diagram|chart|flowchart|sketch|mind map)\b/.test(text)) return null
  // The job, without the question around it: "track deals".
  const words = new Set(text.slice(frame[0].length).split(' ').filter(word => word.length > 2 && !['the', 'and', 'for', 'our', 'with'].includes(word)))
  const scored = catalog.map(entry => {
    const terms = [entry.name, entry.line, ...entry.synonyms].map(plain).join(' ')
    let score = 0
    for (const word of words) if (terms.includes(word) || terms.includes(word.replace(/s$/, ''))) score += entry.synonyms.some(syn => plain(syn).includes(word.replace(/s$/, ''))) ? 2 : 1
    return { id: entry.id, score }
  }).filter(item => item.score > 0).sort((a, b) => b.score - a.score)
  return scored.length ? { all: false, entries: scored.slice(0, 3).map(item => item.id) } : null
}

/** Whether an entry can be added to this slate, and if not, the honest sentence (the control is never disabled). */
export function catalogFits(id: string, slate: { hasBoard: boolean }): { ok: true } | { ok: false; reason: string } {
  if (!catalogEntry(id)) return { ok: false, reason: 'That is not in the library.' }
  return slate.hasBoard ? { ok: false, reason: 'This slate already has a board, so this opens on a new slate.' } : { ok: true }
}
