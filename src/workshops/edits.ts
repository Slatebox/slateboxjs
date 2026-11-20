// One list of the edits a workshop or map takes, and one reducer that makes them.
//
// A person's sentence in the workshop conversation, Canvas AI's proposal, a drag or rename on the
// canvas (creativeSlates.play) and an agent's plan all become these typed edits and are decided
// here, by the same rules and with the same sentences. The table (workshopEditKinds) says what
// each edit takes and which boards accept it; describeWorkshopEdits(board) is what an API, MCP
// tool or CLI publishes for a board before anyone tries an edit.

import {
  addWorkshopBranch, addWorkshopCard, addWorkshopLane, businessKind, startupExperienceKind, validateWorkshop, workshopCandidate,
  workshopPresentationLanes, workshopRefusal,
  type StationImage, type Workshop, type WorkshopCard, type WorkshopLane, type WorkshopSignal,
} from './model'
import { launchLinkRefusal, launchOverrun, launchPlanLimits, withLink, withTaskValue, type WorkshopLimits } from './launchPlan'
import { pipelineLimits } from './pipeline'
import { budgetCommitted, budgetShiftLimits, budgetShiftRefusal, shiftBudget } from './budget'
import { money } from './numbers'
import { listed, said, workshopFinder, WorkshopReferenceError, type WorkshopFinder } from './names'

/** The kinds of board, each with its own rules. */
export type WorkshopBoardKind = 'lanes' | 'release-plan' | 'customer-interviews' | 'experiment-budget' | 'map' | 'launch-plan' | 'pipeline' | 'budget'
/** Every kind of board, for a schema that names them (the app's Workshop record, an MCP tool). */
export const WORKSHOP_BOARD_KINDS: readonly WorkshopBoardKind[] = ['lanes', 'release-plan', 'customer-interviews', 'experiment-budget', 'map', 'launch-plan', 'pipeline', 'budget']
const everyBoard = [...WORKSHOP_BOARD_KINDS]
const laneBoards: WorkshopBoardKind[] = ['lanes', 'release-plan', 'customer-interviews', 'experiment-budget']
const business: WorkshopBoardKind[] = ['launch-plan', 'pipeline', 'budget']

export function workshopBoardKind(board: Workshop): WorkshopBoardKind {
  if (board.lanes[0]?.station) return 'map'
  const own = businessKind(board)
  if (own) return own
  if (board.kind === 'release-plan') return 'release-plan'
  return startupExperienceKind(board) ?? 'lanes'
}

/** A lane, card, station, token or outcome: its id, or what a person calls it (see workshopFinder). `{ id }` names only an id the caller saw on the board. */
export type WorkshopRef = string | { id: string }

export type WorkshopEdit =
  | { kind: 'rename_workshop'; title: string }
  | { kind: 'rename_lane'; lane: WorkshopRef; label: string }
  | { kind: 'rename_card'; card: WorkshopRef; label: string }
  | { kind: 'add_lane'; label: string; capacity?: number }
  | { kind: 'remove_lane'; lane: WorkshopRef }
  | { kind: 'add_card'; lane: WorkshopRef; label?: string; allowedLanes?: WorkshopRef[]; duration?: number; lag?: number; waitsOn?: WorkshopRef[]; amount?: number }
  | { kind: 'remove_card'; card: WorkshopRef }
  | { kind: 'move_card'; card: WorkshopRef; lane: WorkshopRef }
  | { kind: 'advance_card'; card: WorkshopRef }
  | { kind: 'set_lane_capacity'; lane: WorkshopRef; capacity: number | null }
  | { kind: 'set_card_lanes'; card: WorkshopRef; lanes: WorkshopRef[] | null }
  | { kind: 'set_card_points'; card: WorkshopRef; points: number }
  | { kind: 'set_card_dependencies'; card: WorkshopRef; dependsOn: WorkshopRef[]; mode?: 'replace' | 'add' | 'remove' }
  | { kind: 'set_outcome'; card: WorkshopRef; lane: WorkshopRef; whenPresent: string; whenAbsent: string; label?: string }
  | { kind: 'remove_outcome'; card: WorkshopRef; outcome?: WorkshopRef }
  | { kind: 'set_presentation_order'; lanes: WorkshopRef[] }
  | { kind: 'present_lane'; lane: WorkshopRef; before?: WorkshopRef; after?: WorkshopRef }
  | { kind: 'add_station'; from: WorkshopRef; label: string; outcome?: string }
  | { kind: 'insert_station'; before: WorkshopRef; from?: WorkshopRef; label: string; outcome?: string }
  | { kind: 'connect_stations'; from: WorkshopRef; to: WorkshopRef }
  | { kind: 'disconnect_stations'; from: WorkshopRef; to: WorkshopRef }
  | { kind: 'set_station_outcome'; station: WorkshopRef; outcome: string }
  | { kind: 'set_station_position'; station: WorkshopRef; column: number; row: number }
  | { kind: 'set_station_image'; station: WorkshopRef; image: StationImage | null }
  | { kind: 'set_station_image_alt'; station: WorkshopRef; alt: string }
  | { kind: 'set_task'; card: WorkshopRef; duration?: number; lag?: number }
  | { kind: 'link_tasks'; card: WorkshopRef; waitsOn: WorkshopRef }
  | { kind: 'unlink_tasks'; card: WorkshopRef; waitsOn: WorkshopRef }
  | { kind: 'set_launch_day'; day: number }
  | { kind: 'set_amount'; card: WorkshopRef; amount: number }
  | { kind: 'set_target'; amount: number }
  | { kind: 'shift_budget'; from: WorkshopRef; to: WorkshopRef; amount: number }

export type WorkshopEditKindName = WorkshopEdit['kind']

/** What one edit did: the sentence a person is told, and the ids it concerned or made. */
export interface WorkshopEditDone {
  index: number
  kind: WorkshopEditKindName
  said: string
  /** False when the board already was that way (a move to where the card is, a path that is there). */
  changed: boolean
  laneId?: string
  cardId?: string
}

export interface WorkshopEditReport {
  edits: WorkshopEditDone[]
  /** Every card that ended in another lane, including the ones a release plan brought along. */
  movedCards: { cardId: string; fromLaneId: string; toLaneId: string }[]
}

export type WorkshopEditRefusalCode =
  /** The edit is malformed: an unknown kind, a missing or mistyped field. */
  | 'invalid_edit'
  /** The board's kind does not take this edit (see describeWorkshopEdits). */
  | 'not_on_this_board'
  /** A name picks nothing here. `candidates` lists what is there. */
  | 'unknown_reference'
  /** A name picks several things. `candidates` lists them. */
  | 'ambiguous_reference'
  /** “this” with nothing selected. */
  | 'no_selection'
  /** An `{ id }` the caller saw is no longer on the board. */
  | 'gone'
  /** The board's rules refuse it. */
  | 'refused'
  /** The board given cannot be read. */
  | 'invalid_board'

export interface WorkshopEditRefusal {
  /** The sentence for the person, the same one the canvas and the conversation say. */
  reason: string
  code: WorkshopEditRefusalCode
  /** The edit refused, by its place in the list. Nothing of the list was made. */
  index: number
  kind: string | null
  /** The lane to show the refusal on, when there is one. */
  laneId: string | null
  cardId?: string
  candidates?: string[]
  /** A number out of range: the range a person may use, and the sentence at each end. */
  limits?: WorkshopLimits
}

export type WorkshopEditResult = { workshop: Workshop; report: WorkshopEditReport } | { refused: WorkshopEditRefusal }

export interface WorkshopEditOptions {
  /** What “this” means: the lane or card selected on the canvas. */
  selection?: { kind: 'lane' | 'card'; id: string } | null
}

// ---------------------------------------------------------------------------------------------
// The sentences a person is given when a board's kind does not take an edit.

const sentences = {
  releaseLanes: 'A release plan keeps the releases it came with. You can rename them and set how many points each holds.',
  releaseOrder: 'A release plan keeps its releases in the order they came in: that order says which release is earlier. You can rename them and set how many points each holds.',
  releaseCards: 'A release plan keeps the features it came with. You can rename them, move them and set their points.',
  keepsLanes: 'This workshop keeps the lanes it came with. You can rename them, and rename and move its cards.',
  keepsOrder: 'This workshop keeps its lanes in the order they came in. You can rename them, and rename and move its cards.',
  keepsCards: 'This workshop keeps the cards it came with. You can rename them and move them between its lanes.',
  notPoints: 'This workshop counts cards, not points. You can set how many cards a lane holds.',
  mapPoints: 'A map counts tokens, not points. You can set how many tokens a step holds.',
  notDepends: 'Only a release plan keeps track of what depends on what.',
  notMap: 'Choose an interactive map to edit its stations.',
  mapAddLane: 'On a map a new step follows another one. Say which step it comes after.',
  mapCardLanes: 'A map’s tokens go where its paths lead. Connect or disconnect steps instead.',
  mapOutcome: 'A map says what happens when a token reaches a step. Change what that step says instead.',
  launchLanes: 'A launch plan keeps the teams it came with. You can rename them and move tasks between them.',
  pipelineLanes: 'A pipeline keeps the stages it came with. You can rename them and set how many deals a stage holds.',
  budgetLanes: 'A budget keeps the teams it came with. Move money between them instead.',
  notTasks: 'Only a launch plan\'s tasks take days and wait on each other.',
  notAmounts: 'Only a pipeline\'s deals and a budget\'s line items carry an amount.',
  notTarget: 'Only a pipeline has a forecast target.',
  notBudget: 'Only a budget moves money between teams.',
  businessCards: 'Cards on this board go where its rules let them.',
}
const keepsTeams = { 'launch-plan': sentences.launchLanes, pipeline: sentences.pipelineLanes, budget: sentences.budgetLanes }
const others = (kinds: WorkshopBoardKind[], sentence: string) => Object.fromEntries(everyBoard.filter(kind => !kinds.includes(kind)).map(kind => [kind, sentence]))

// ---------------------------------------------------------------------------------------------
// The table.

type Limit = number | Partial<Record<WorkshopBoardKind, number>> & { default: number }

export type WorkshopEditField =
  | { type: 'text'; max: number; optional?: boolean; about: string }
  | { type: 'ref'; of: 'lane' | 'card' | 'outcome'; optional?: boolean; about: string }
  | { type: 'refs'; of: 'lane' | 'card'; min: number; max: number; nullable?: boolean; optional?: boolean; about: string }
  | { type: 'integer'; min: number; max: Limit; nullable?: boolean; optional?: boolean; about: string }
  | { type: 'image'; about: string }
  | { type: 'choice'; values: string[]; optional?: boolean; about: string }

export interface WorkshopEditKind {
  kind: WorkshopEditKindName
  summary: string
  /** A change of intent (a move, a rename) that can be replayed on the latest board without a revision. */
  intent: boolean
  fields: Record<string, WorkshopEditField>
  /** The boards that take this edit. */
  boards: WorkshopBoardKind[]
  /** What the other boards say. */
  refusals: Partial<Record<WorkshopBoardKind, string>>
}

const text = (max: number, about: string, optional = false): WorkshopEditField => ({ type: 'text', max, about, ...(optional && { optional }) })
const lane = (about: string, optional = false): WorkshopEditField => ({ type: 'ref', of: 'lane', about, ...(optional && { optional }) })
const card = (about: string): WorkshopEditField => ({ type: 'ref', of: 'card', about })
const notOnMaps = (sentence: string) => ({ map: sentence })
const mapsOnly = others(['map'], sentences.notMap)
const whole = (about: string, max = 1e9, min = 0, optional = false): WorkshopEditField => ({ type: 'integer', min, max, about, ...(optional && { optional }) })

export const workshopEditKinds: readonly WorkshopEditKind[] = [
  { kind: 'rename_workshop', summary: 'Rename the workshop or map. The slate takes the same name.', intent: true,
    fields: { title: text(120, 'The new name, 1 to 120 characters of plain text.') }, boards: everyBoard, refusals: {} },
  { kind: 'rename_lane', summary: 'Rename a lane, or a step on a map.', intent: true,
    fields: { lane: lane('The lane or step.'), label: text(80, 'The new name, 1 to 80 characters of plain text.') }, boards: everyBoard, refusals: {} },
  { kind: 'rename_card', summary: 'Rename a card, a feature or a token.', intent: true,
    fields: { card: card('The card or token.'), label: text(80, 'The new name, 1 to 80 characters of plain text.') }, boards: everyBoard, refusals: {} },
  { kind: 'add_lane', summary: 'Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.', intent: false,
    fields: { label: text(80, 'The lane’s name.'), capacity: { type: 'integer', min: 1, max: 24, optional: true, about: 'How many cards it holds, 1 to 24. Leave it out for any number.' } },
    boards: ['lanes'], refusals: { 'release-plan': sentences.releaseLanes, 'customer-interviews': sentences.keepsLanes, 'experiment-budget': sentences.keepsLanes, map: sentences.mapAddLane, ...keepsTeams } },
  { kind: 'remove_lane', summary: 'Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.', intent: false,
    fields: { lane: lane('The lane or step.') },
    boards: ['lanes', 'map'], refusals: { 'release-plan': sentences.releaseLanes, 'customer-interviews': sentences.keepsLanes, 'experiment-budget': sentences.keepsLanes, ...keepsTeams } },
  { kind: 'add_card', summary: 'Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.', intent: false,
    fields: { lane: lane('The lane or step it starts in.'), label: text(80, 'What the card says. On a map it may be left out: the token is numbered.', true),
      allowedLanes: { type: 'refs', of: 'lane', min: 1, max: 5, optional: true, about: 'Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane.' },
      duration: whole('Launch plan: days, 1 to 60 (2).', 60, 1, true), lag: whole('Launch plan: days it waits.', 120, 0, true),
      waitsOn: { type: 'refs', of: 'card', min: 0, max: 3, optional: true, about: 'Launch plan: what it waits on.' },
      amount: whole('Pipeline or budget: the amount.', 1e9, 0, true) },
    boards: ['lanes', 'experiment-budget', 'map', ...business], refusals: { 'release-plan': sentences.releaseCards, 'customer-interviews': sentences.keepsCards } },
  { kind: 'remove_card', summary: 'Remove a card or token, with the dependencies and outcomes that named it.', intent: false,
    fields: { card: card('The card or token.') }, boards: everyBoard, refusals: {} },
  { kind: 'move_card', summary: 'Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.', intent: true,
    fields: { card: card('The card or token.'), lane: lane('Where it goes.') }, boards: everyBoard, refusals: {} },
  { kind: 'advance_card', summary: 'Move a token on along the one path that leads on from its step.', intent: true,
    fields: { card: card('The token.') }, boards: ['map'], refusals: mapsOnly },
  { kind: 'set_lane_capacity', summary: 'Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.', intent: false,
    fields: { lane: lane('The lane or step.'), capacity: { type: 'integer', min: 1, max: { default: 24, 'release-plan': 576 }, nullable: true, about: 'The limit, or null to remove it.' } },
    boards: everyBoard.filter(kind => kind !== 'launch-plan' && kind !== 'budget'), refusals: { 'launch-plan': sentences.launchLanes, budget: sentences.budgetLanes } },
  { kind: 'set_card_lanes', summary: 'Say which lanes a card may go in (including the one it is in), or null for any lane.', intent: false,
    fields: { card: card('The card.'), lanes: { type: 'refs', of: 'lane', min: 1, max: 5, nullable: true, about: 'The lanes, or null for any lane.' } },
    boards: laneBoards, refusals: { ...notOnMaps(sentences.mapCardLanes), ...others([...laneBoards, 'map'], sentences.businessCards) } },
  { kind: 'set_card_points', summary: 'On a release plan, set a feature’s effort, 1 to 24 points.', intent: false,
    fields: { card: card('The feature.'), points: { type: 'integer', min: 1, max: 24, about: 'Its points.' } },
    boards: ['release-plan'], refusals: { ...others(['release-plan'], sentences.notPoints), map: sentences.mapPoints } },
  { kind: 'set_card_dependencies', summary: 'On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.', intent: false,
    fields: { card: card('The feature.'), dependsOn: { type: 'refs', of: 'card', min: 0, max: 23, about: 'The features it depends on. An empty list with mode replace removes them all.' },
      mode: { type: 'choice', values: ['replace', 'add', 'remove'], optional: true, about: 'replace (the default), add or remove.' } },
    boards: ['release-plan'], refusals: { ...others(['release-plan'], sentences.notDepends), 'launch-plan': 'On a launch plan, link and unlink tasks instead.' } },
  { kind: 'set_outcome', summary: 'Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.', intent: false,
    fields: { card: card('The card.'), lane: lane('The lane.'), whenPresent: text(160, 'What it says when the card is there.'), whenAbsent: text(160, 'What it says otherwise.'),
      label: text(80, 'The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.', true) },
    boards: laneBoards, refusals: { ...notOnMaps(sentences.mapOutcome), ...others([...laneBoards, 'map'], sentences.businessCards) } },
  { kind: 'remove_outcome', summary: 'Remove one outcome from a card, or all of them.', intent: false,
    fields: { card: card('The card.'), outcome: { type: 'ref', of: 'outcome', optional: true, about: 'The outcome. Left out, every outcome of the card goes.' } },
    boards: laneBoards, refusals: { ...notOnMaps(sentences.mapOutcome), ...others([...laneBoards, 'map'], sentences.businessCards) } },
  { kind: 'set_presentation_order', summary: 'Set the order the lanes or steps are presented in: each once.', intent: false,
    fields: { lanes: { type: 'refs', of: 'lane', min: 2, max: 5, about: 'Every lane or step, once, in order.' } }, boards: everyBoard, refusals: {} },
  { kind: 'present_lane', summary: 'Present one lane or step first, or just before or after another, keeping the rest in order.', intent: false,
    fields: { lane: lane('The lane or step.'), before: lane('Present it just before this one.', true), after: lane('Present it just after this one.', true) },
    boards: everyBoard, refusals: {} },
  { kind: 'add_station', summary: 'Add a step after another on a map, at the nearest free place. A map has up to five steps.', intent: false,
    fields: { from: lane('The step it follows.'), label: text(80, 'The new step’s name.'), outcome: text(160, 'What it says when a token arrives. Left out, its name.', true) },
    boards: ['map'], refusals: mapsOnly },
  { kind: 'insert_station', summary: 'Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.', intent: false,
    fields: { before: lane('The step it goes in front of.'), from: lane('Only the path from this step is taken over.', true),
      label: text(80, 'The new step’s name.'), outcome: text(160, 'What it says when a token arrives. Left out, its name.', true) },
    boards: ['map'], refusals: mapsOnly },
  { kind: 'connect_stations', summary: 'Open a path from one step to another.', intent: false,
    fields: { from: lane('Where the path starts.'), to: lane('Where it leads.') }, boards: ['map'], refusals: mapsOnly },
  { kind: 'disconnect_stations', summary: 'Remove the path between two steps.', intent: false,
    fields: { from: lane('Where the path starts.'), to: lane('Where it leads.') }, boards: ['map'], refusals: mapsOnly },
  { kind: 'set_station_outcome', summary: 'Set what a step says when a token arrives.', intent: false,
    fields: { station: lane('The step.'), outcome: text(160, 'What it says.') }, boards: ['map'], refusals: mapsOnly },
  { kind: 'set_station_position', summary: 'Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.', intent: false,
    fields: { station: lane('The step.'), column: { type: 'integer', min: 0, max: 2, about: 'Column, 0 to 2.' }, row: { type: 'integer', min: 0, max: 2, about: 'Row, 0 to 2.' } },
    boards: ['map'], refusals: mapsOnly },
  { kind: 'set_station_image', summary: 'Put a picture (an HTTPS address and a description) on a step, or null to remove it.', intent: false,
    fields: { station: lane('The step.'), image: { type: 'image', about: '{src, alt}: an HTTPS address and what the picture shows; or null.' } }, boards: ['map'], refusals: mapsOnly },
  { kind: 'set_station_image_alt', summary: 'Change the description of a step’s picture.', intent: false,
    fields: { station: lane('The step.'), alt: text(240, 'What the picture shows.') }, boards: ['map'], refusals: mapsOnly },
  { kind: 'set_task', summary: 'Set a task\'s days, or the days it waits. Every task ends by launch.', intent: false,
    fields: { card: card('The task.'), duration: whole('Its days, 1 to 60.', 60, 1, true), lag: whole('Days it waits, 0 or more.', 120, 0, true) },
    boards: ['launch-plan'], refusals: others(['launch-plan'], sentences.notTasks) },
  { kind: 'link_tasks', summary: 'Make a task wait on another.', intent: false,
    fields: { card: card('The task that waits.'), waitsOn: card('The task it waits on.') }, boards: ['launch-plan'], refusals: others(['launch-plan'], sentences.notTasks) },
  { kind: 'unlink_tasks', summary: 'Stop a task waiting on another.', intent: false,
    fields: { card: card('The task that waits.'), waitsOn: card('The task it waits on.') }, boards: ['launch-plan'], refusals: others(['launch-plan'], sentences.notTasks) },
  { kind: 'set_launch_day', summary: 'Set launch day. Every task ends by it.', intent: false,
    fields: { day: whole('Launch day.', 120, 5) }, boards: ['launch-plan'], refusals: others(['launch-plan'], sentences.notTasks) },
  { kind: 'set_amount', summary: 'Set a deal\'s amount or a line item\'s cost.', intent: false,
    fields: { card: card('The deal or line item.'), amount: whole('Whole currency units.') }, boards: ['pipeline', 'budget'], refusals: others(['pipeline', 'budget'], sentences.notAmounts) },
  { kind: 'set_target', summary: 'Set a pipeline\'s forecast target.', intent: false,
    fields: { amount: whole('Whole currency units.', 1e9, 1) }, boards: ['pipeline'], refusals: others(['pipeline'], sentences.notTarget) },
  { kind: 'shift_budget', summary: 'Move money between teams. The total stays.', intent: false,
    fields: { from: lane('The team giving.'), to: lane('The team receiving.'), amount: whole('Whole currency units.', 1e9, 1) },
    boards: ['budget'], refusals: others(['budget'], sentences.notBudget) },
]

const byKind = new Map(workshopEditKinds.map(entry => [entry.kind, entry]))
const limitFor = (limit: Limit, board: WorkshopBoardKind | undefined) => typeof limit === 'number' ? limit : (board && limit[board]) ?? limit.default

function fieldSchema(field: WorkshopEditField, board?: WorkshopBoardKind): Record<string, unknown> {
  const ref = { anyOf: [{ type: 'string', minLength: 1, maxLength: 200 },
    { type: 'object', additionalProperties: false, required: ['id'], properties: { id: { type: 'string', minLength: 1, maxLength: 64 } } }] }
  const orNull = (schema: Record<string, unknown>, nullable?: boolean) => nullable ? { anyOf: [schema, { type: 'null' }] } : schema
  switch (field.type) {
    case 'text': return { type: 'string', minLength: 1, maxLength: field.max, description: field.about }
    case 'ref': return { ...ref, description: field.about }
    case 'refs': return { ...orNull({ type: 'array', items: ref, minItems: field.min, maxItems: field.max }, field.nullable), description: field.about }
    case 'integer': return { ...orNull({ type: 'integer', minimum: field.min, maximum: limitFor(field.max, board) }, field.nullable), description: field.about }
    case 'image': return { ...orNull({ type: 'object', additionalProperties: false, required: ['src', 'alt'],
      properties: { src: { type: 'string', minLength: 1, maxLength: 2048 }, alt: { type: 'string', minLength: 1, maxLength: 240 } } }, true), description: field.about }
    case 'choice': return { enum: field.values, description: field.about }
  }
}

const isOptional = (field: WorkshopEditField) => 'optional' in field && field.optional === true

export interface WorkshopEditDescription {
  kind: WorkshopEditKindName
  summary: string
  intent: boolean
  boards: WorkshopBoardKind[]
  /** A JSON schema of the edit, `kind` included. */
  schema: Record<string, unknown>
  /** With a board: whether it takes this edit, and if not, the sentence it answers with. */
  accepted?: boolean
  refusal?: string
}

/** The edit table as data: every kind, or with a board, every kind and whether that board takes it. */
export function describeWorkshopEdits(board?: Workshop): WorkshopEditDescription[] {
  const family = board ? workshopBoardKind(validateWorkshop(board)) : undefined
  return workshopEditKinds.map(entry => {
    const fields = Object.entries(entry.fields)
    const schema = { type: 'object', additionalProperties: false, description: entry.summary,
      required: ['kind', ...fields.filter(([, field]) => !isOptional(field)).map(([name]) => name)],
      properties: { kind: { const: entry.kind }, ...Object.fromEntries(fields.map(([name, field]) => [name, fieldSchema(field, family)])) } }
    const description: WorkshopEditDescription = { kind: entry.kind, summary: entry.summary, intent: entry.intent, boards: [...entry.boards], schema }
    if (family) {
      description.accepted = entry.boards.includes(family)
      if (!description.accepted) description.refusal = entry.refusals[family]
    }
    return description
  })
}

// ---------------------------------------------------------------------------------------------
// Looking things up.

const nouns = {
  lane: 'lanes?|columns?|lists?|stages?|windows?|releases?|teams?',
  card: 'cards?|features?|notes?|items?|tasks?|deals?|line items?',
  step: 'steps?|stations?|stops?|stages?|places?',
  token: 'tokens?|cards?|pieces?|markers?',
}

/**
 * The finders for a board's lanes and cards, worded for its kind (lanes and cards, or steps and
 * tokens). On a map with one token, “the token” is that one. `selection` is what “this” means.
 */
export function workshopReferences(board: Workshop, selection?: WorkshopEditOptions['selection']): { lanes: WorkshopFinder<WorkshopLane>; cards: WorkshopFinder<WorkshopCard> } {
  const map = Boolean(board.lanes[0]?.station)
  const lanes = workshopFinder(board.lanes, map ? nouns.step : nouns.lane, map ? 'step' : 'lane', selection?.kind === 'lane' ? selection.id : undefined, true)
  const found = workshopFinder(board.cards, map ? nouns.token : nouns.card, map ? 'token' : 'card', selection?.kind === 'card' ? selection.id : undefined)
  if (!map) return { lanes, cards: found }
  const lone = (reference: string) => board.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(reference.trim()) ? board.cards[0] : null
  return { lanes, cards: {
    find: reference => lone(reference) ?? found.find(reference),
    attempt: reference => lone(reference) ?? found.attempt(reference),
    rank: reference => lone(reference) ? 0 : found.rank(reference),
  } }
}

// ---------------------------------------------------------------------------------------------
// The reducer.

class Refusal {
  constructor(readonly reason: string, readonly code: WorkshopEditRefusalCode, readonly laneId: string | null = null,
    readonly cardId?: string, readonly candidates?: string[], readonly limits?: WorkshopLimits) {}
}

// The model's own checks, in the words the lane conversation has always used for them. A
// name's limits are said as the canvas says them, and a map's checks as the map has said them.
function ruleSentence(message: string, family: WorkshopBoardKind) {
  if (family === 'map') return message
  if (/acyclic/.test(message)) return 'Those features would end up waiting on each other. Choose a dependency that does not lead back.'
  if (/same window as its feature or earlier/.test(message)) return 'A feature can only depend on one planned in the same release or an earlier one. Move one of them first.'
  if (/exceeds its (?:capacity|point budget)/.test(message)) return message.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, '“$1” would hold more than its limit. Raise the limit or move something out first.')
  if (/2 to 5 lanes/.test(message)) return 'A workshop has from two to five lanes.'
  if (/effort points/.test(message)) return 'A feature takes from 1 to 24 points.'
  return message
}

function settle(board: Workshop, family: WorkshopBoardKind, laneId: string | null = null, cardId?: string): Workshop {
  try { return validateWorkshop(board) } catch (error) {
    throw new Refusal(ruleSentence(error instanceof Error ? error.message : String(error), family), 'refused', laneId, cardId)
  }
}

function shapeProblem(edit: Record<string, unknown>, entry: WorkshopEditKind): string | null {
  for (const key of Object.keys(edit)) if (key !== 'kind' && !Object.prototype.hasOwnProperty.call(entry.fields, key)) return entry.kind + ' does not take ' + key + '.'
  const isRef = (value: unknown) => (typeof value === 'string' && value.trim().length > 0) ||
    (Boolean(value) && typeof value === 'object' && !Array.isArray(value) && typeof (value as { id?: unknown }).id === 'string' && Object.keys(value as object).length === 1)
  for (const [name, field] of Object.entries(entry.fields)) {
    const value = edit[name]
    if (value === undefined) {
      if (isOptional(field)) continue
      return entry.kind + ' needs ' + name + '.'
    }
    const wrong = entry.kind + ' needs ' + name + ' as '
    switch (field.type) {
      case 'text': if (typeof value !== 'string') return wrong + 'text.'; break
      case 'ref': if (!isRef(value)) return wrong + 'an id or a name.'; break
      case 'refs':
        if (value === null && field.nullable) break
        if (!Array.isArray(value) || value.length > field.max || !value.every(isRef)) return wrong + 'a list of up to ' + field.max + ' ids or names' + (field.nullable ? ', or null.' : '.')
        break
      case 'integer':
        if (value === null && field.nullable) break
        if (typeof value !== 'number' || !Number.isFinite(value)) return wrong + 'a number' + (field.nullable ? ' or null.' : '.')
        break
      case 'image':
        if (value === null) break
        if (!value || typeof value !== 'object' || typeof (value as StationImage).src !== 'string' || typeof (value as StationImage).alt !== 'string' ||
          Object.keys(value).some(key => key !== 'src' && key !== 'alt')) return wrong + '{src, alt} or null.'
        break
      case 'choice': if (!field.values.includes(value as string)) return wrong + field.values.join(', ') + '.'; break
    }
  }
  return null
}

interface Step { board: Workshop; said: string; changed?: boolean; laneId?: string; cardId?: string }

function makeEdit(input: Workshop, edit: WorkshopEdit, family: WorkshopBoardKind, selection: WorkshopEditOptions['selection']): Step {
  const board = structuredClone(input)
  const map = family === 'map'
  const release = family === 'release-plan'
  const refs = workshopReferences(board, selection)
  const what = { lane: map ? 'step' : 'lane', card: map ? 'token' : 'card' }

  function resolve<T extends { id: string }>(items: T[], finder: WorkshopFinder<T>, ref: WorkshopRef, noun: string, laneId: string | null = null): T {
    if (typeof ref === 'object') {
      const found = items.find(item => item.id === ref.id)
      if (!found) throw new Refusal('That ' + noun + ' is no longer on the workshop.', 'gone', laneId)
      return found
    }
    const exact = items.find(item => item.id === ref)
    if (exact) return exact
    try { return finder.find(ref) } catch (error) {
      if (!(error instanceof WorkshopReferenceError)) throw error
      const code = error.reason === 'ambiguous' ? 'ambiguous_reference' : error.reason === 'no-selection' ? 'no_selection' : 'unknown_reference'
      throw new Refusal(error.message, code, laneId, undefined, error.candidates.length ? error.candidates : undefined)
    }
  }
  const laneOf = (ref: WorkshopRef, laneId: string | null = null) => resolve(board.lanes, refs.lanes, ref, 'lane', laneId)
  const cardOf = (ref: WorkshopRef, laneId: string | null = null) => resolve(board.cards, refs.cards, ref, 'card', laneId)
  const quietLane = (ref: WorkshopRef) => { try { return laneOf(ref) } catch { return null } }
  const done = (next: Workshop, sentence: string, ids: { laneId?: string; cardId?: string } = {}, changed = true): Step => ({ board: next, said: sentence, changed, ...ids })
  const labelOf = (id: string) => board.lanes.find(item => item.id === id)!.label
  const held = (laneId: string) => board.cards.filter(item => item.laneId === laneId).length
  const presentationSaid = (order: WorkshopLane[]) => map
    ? 'The presentation opens with ' + said(order[0].label) + '.'
    : 'The presentation now runs ' + order.map(item => said(item.label)).join(', then ') + '.'

  switch (edit.kind) {
    case 'rename_workshop': {
      board.title = edit.title
      const next = settle(board, family)
      return done(next, 'Renamed the ' + (map ? 'map' : 'workshop') + ' to ' + said(next.title) + '.')
    }
    case 'rename_lane': {
      const target = laneOf(edit.lane), before = target.label
      target.label = edit.label
      const next = settle(board, family, target.id)
      return done(next, 'Renamed ' + said(before) + ' to ' + said(next.lanes.find(item => item.id === target.id)!.label) + '.', { laneId: target.id })
    }
    case 'rename_card': {
      const target = cardOf(edit.card), before = target.label
      target.label = edit.label
      const next = settle(board, family, target.laneId, target.id)
      return done(next, 'Renamed ' + said(before) + ' to ' + said(next.cards.find(item => item.id === target.id)!.label) + '.', { laneId: target.laneId, cardId: target.id })
    }
    case 'add_lane': {
      if (board.lanes.length >= 5) throw new Refusal('A workshop can have up to five lanes. Remove one first.', 'refused')
      if (edit.capacity !== undefined && (!Number.isInteger(edit.capacity) || edit.capacity < 1 || edit.capacity > 24)) {
        throw new Refusal('A lane can hold from 1 to 24 cards.', 'refused')
      }
      let next: Workshop
      try { next = addWorkshopLane(board, { label: edit.label, ...(edit.capacity !== undefined && { capacity: edit.capacity }) }) } catch (error) {
        throw new Refusal(ruleSentence((error as Error).message, family), 'refused')
      }
      const added = next.lanes[next.lanes.length - 1]
      return done(next, 'Added the lane ' + said(added.label) + '.', { laneId: added.id })
    }
    case 'remove_lane': {
      const gone = laneOf(edit.lane)
      const here = board.cards.filter(item => item.laneId === gone.id)
      if (map) {
        if (here.length) throw new Refusal(said(here[0].label) + ' is at ' + said(gone.label) + '. Move it to another step first.', 'refused', gone.id)
        if (board.lanes.length <= 2) throw new Refusal('A map needs at least two steps.', 'refused', gone.id)
      } else {
        if (here.length) throw new Refusal(said(gone.label) + ' holds ' + here.length + (here.length === 1 ? ' card' : ' cards') + '. Move or remove ' + (here.length === 1 ? 'it' : 'them') + ' first.', 'refused', gone.id)
        if (board.lanes.length <= 2) throw new Refusal('A workshop needs at least two lanes.', 'refused', gone.id)
      }
      board.lanes = board.lanes.filter(item => item !== gone)
      for (const item of board.lanes) if (item.station) item.station.next = item.station.next.filter(id => id !== gone.id)
      if (board.presentationOrder) board.presentationOrder = board.presentationOrder.filter(id => id !== gone.id)
      for (const item of board.cards) if (item.allowedLaneIds) item.allowedLaneIds = item.allowedLaneIds.filter(id => id !== gone.id)
      dropSignals(board, signal => signal.laneId === gone.id)
      return done(settle(board, family), 'Removed the ' + what.lane + ' ' + said(gone.label) + '.', { laneId: gone.id })
    }
    case 'add_card': {
      const target = laneOf(edit.lane)
      if (map) {
        if (edit.allowedLanes !== undefined) throw new Refusal(sentences.mapCardLanes, 'not_on_this_board', target.id)
        let label = edit.label
        if (label === undefined) {
          let number = board.cards.length + 1
          while (board.cards.some(item => item.label === 'Token ' + number)) number++
          label = 'Token ' + number
        }
        const ids = new Set([...board.lanes, ...board.cards].map(item => item.id))
        let n = 1
        while (ids.has('token-' + n)) n++
        board.cards.push({ id: 'token-' + n, label, laneId: target.id })
        const next = settle(board, family, target.id)
        return done(next, 'Added ' + said(next.cards[next.cards.length - 1].label) + ' at ' + said(target.label) + '.', { laneId: target.id, cardId: 'token-' + n })
      }
      const extra = (['duration', 'lag', 'waitsOn', 'amount'] as const).find(key => edit[key] !== undefined &&
        !(family === 'launch-plan' ? key !== 'amount' : (family === 'pipeline' || family === 'budget') && key === 'amount'))
      if (extra) throw new Refusal(extra === 'amount' ? sentences.notAmounts : sentences.notTasks, 'not_on_this_board', target.id)
      if (business.includes(family)) return addBusinessCard(target)
      if (edit.label === undefined || !edit.label.trim()) throw new Refusal('Say what the card should say, such as “Add a card called New idea to ' + target.label + '”.', 'refused', target.id)
      if (board.cards.length >= 24) throw new Refusal('A workshop can have up to 24 cards. Remove one first.', 'refused', target.id)
      if (target.capacity !== undefined && held(target.id) >= target.capacity) {
        throw new Refusal(said(target.label) + ' is full: it holds ' + target.capacity + (target.capacity === 1 ? ' card' : ' cards') + '. Add the card to another lane, or raise the limit.', 'refused', target.id)
      }
      const allowedLaneIds = edit.allowedLanes && [...new Set(edit.allowedLanes.map(ref => laneOf(ref).id))]
      let next: Workshop
      try { next = addWorkshopCard(board, target.id, { label: edit.label, ...(allowedLaneIds && { allowedLaneIds }) }) } catch (error) {
        throw new Refusal(ruleSentence((error as Error).message, family), 'refused', target.id)
      }
      const added = next.cards[next.cards.length - 1]
      return done(next, 'Added ' + said(added.label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: added.id })
    }
    case 'remove_card': {
      const gone = cardOf(edit.card)
      if (map && board.cards.length === 1) throw new Refusal('A map needs at least one token.', 'refused', gone.laneId, gone.id)
      if (release && board.cards.length === 1) throw new Refusal('A release plan needs at least one feature.', 'refused', gone.laneId, gone.id)
      if (family === 'launch-plan' && board.cards.length === 1) throw new Refusal('A launch plan needs at least one task.', 'refused', gone.laneId, gone.id)
      board.cards = board.cards.filter(item => item !== gone)
      for (const item of board.cards) {
        if (!item.dependsOn?.includes(gone.id)) continue
        item.dependsOn = item.dependsOn.filter(id => id !== gone.id)
        if (!item.dependsOn.length) delete item.dependsOn
      }
      dropSignals(board, signal => signal.cardId === gone.id)
      return done(settle(board, family, gone.laneId), 'Removed the ' + what.card + ' ' + said(gone.label) + '.', { laneId: gone.laneId, cardId: gone.id })
    }
    case 'move_card': {
      const target = typeof edit.lane === 'object' ? board.lanes.find(item => item.id === (edit.lane as { id: string }).id) ?? null : quietLane(edit.lane)
      const subject = cardOf(edit.card, target?.id ?? null)
      const destination = laneOf(edit.lane, subject.laneId)
      return moveTo(subject, destination)
    }
    case 'advance_card': {
      const subject = cardOf(edit.card)
      const here = board.lanes.find(item => item.id === subject.laneId)!
      const onward = here.station!.next.map(id => board.lanes.find(item => item.id === id)).filter((item): item is WorkshopLane => Boolean(item))
      if (!onward.length) throw new Refusal(said(subject.label) + ' is at ' + said(here.label) + ', and no path leads on from there.', 'refused', here.id, subject.id)
      if (onward.length > 1) {
        throw new Refusal('From ' + said(here.label) + ' the path goes to ' + onward.map(item => said(item.label)).join(' or ') + '. Say which, such as “Move ' + subject.label + ' to ' + onward[0].label + '”.', 'refused', here.id, subject.id)
      }
      return moveTo(subject, onward[0])
    }
    case 'set_lane_capacity': {
      const target = laneOf(edit.lane)
      const unit = map ? 'token' : release ? 'point' : 'card'
      if (edit.capacity === null) {
        delete target.capacity
        return done(settle(board, family, target.id), map ? 'Removed the limit at ' + said(target.label) + '.' : said(target.label) + ' now holds any number of ' + unit + 's.', { laneId: target.id })
      }
      const most = release ? 576 : 24
      if (!Number.isInteger(edit.capacity) || edit.capacity < 1 || edit.capacity > most) {
        throw new Refusal((map ? 'A step' : 'A lane') + ' can hold from 1 to ' + most + ' ' + unit + 's.', 'refused', target.id)
      }
      const amount = release ? board.cards.reduce((sum, item) => sum + (item.laneId === target.id ? item.points ?? 1 : 0), 0) : held(target.id)
      if (amount > edit.capacity) {
        throw new Refusal(said(target.label) + ' already holds ' + amount + ' ' + unit + (amount === 1 ? '' : 's') + '. Move some ' + (map ? 'on' : 'out') +
          ' first, or choose a higher ' + (release ? 'budget' : 'number') + '.', 'refused', target.id)
      }
      target.capacity = edit.capacity
      return done(settle(board, family, target.id), said(target.label) + ' now holds up to ' + edit.capacity + ' ' + unit + (edit.capacity === 1 ? '' : 's') + '.', { laneId: target.id })
    }
    case 'set_card_lanes': {
      const target = cardOf(edit.card)
      if (edit.lanes === null) {
        delete target.allowedLaneIds
        return done(settle(board, family, target.laneId, target.id), said(target.label) + ' can now go in any lane.', { laneId: target.laneId, cardId: target.id })
      }
      const allowed = [...new Set(edit.lanes.map(ref => laneOf(ref)))]
      const home = board.lanes.find(item => item.id === target.laneId)!
      if (!allowed.includes(home)) throw new Refusal(said(target.label) + ' is in ' + said(home.label) + ' now. Include ' + said(home.label) + ', or move the card first.', 'refused', home.id, target.id)
      target.allowedLaneIds = allowed.map(item => item.id)
      return done(settle(board, family, target.laneId, target.id), said(target.label) + ' can now go only in ' + listed(allowed.map(item => said(item.label))) + '.', { laneId: target.laneId, cardId: target.id })
    }
    case 'set_card_points': {
      const feature = cardOf(edit.card)
      if (!Number.isInteger(edit.points) || edit.points < 1 || edit.points > 24) throw new Refusal('A feature takes from 1 to 24 points.', 'refused', feature.laneId, feature.id)
      feature.points = edit.points
      return done(settle(board, family, feature.laneId, feature.id), said(feature.label) + ' now takes ' + edit.points + (edit.points === 1 ? ' point.' : ' points.'), { laneId: feature.laneId, cardId: feature.id })
    }
    case 'set_card_dependencies': {
      const feature = cardOf(edit.card)
      const needed = [...new Set(edit.dependsOn.map(ref => cardOf(ref)))]
      const ids = { laneId: feature.laneId, cardId: feature.id }
      if (edit.mode === 'remove') {
        const gone = needed.filter(item => feature.dependsOn?.includes(item.id))
        if (!gone.length) throw new Refusal(said(feature.label) + ' does not depend on ' + listed(needed.map(item => said(item.label))) + '.', 'refused', feature.laneId, feature.id)
        feature.dependsOn = feature.dependsOn!.filter(id => !gone.some(item => item.id === id))
        if (!feature.dependsOn.length) delete feature.dependsOn
        return done(settle(board, family, feature.laneId, feature.id), said(feature.label) + ' no longer depends on ' + listed(gone.map(item => said(item.label))) + '.', ids)
      }
      if (!needed.length) {
        if (edit.mode === 'add') throw new Refusal('Name the features ' + said(feature.label) + ' depends on.', 'refused', feature.laneId, feature.id)
        delete feature.dependsOn
        return done(settle(board, family, feature.laneId, feature.id), said(feature.label) + ' no longer depends on anything.', ids)
      }
      if (needed.includes(feature)) throw new Refusal('A feature can’t depend on itself.', 'refused', feature.laneId, feature.id)
      feature.dependsOn = [...new Set([...(edit.mode === 'add' ? feature.dependsOn ?? [] : []), ...needed.map(item => item.id)])]
      return done(settle(board, family, feature.laneId, feature.id), said(feature.label) + ' now depends on ' + listed(needed.map(item => said(item.label))) + '.', ids)
    }
    case 'set_outcome': {
      const subject = cardOf(edit.card), place = laneOf(edit.lane)
      const signals = board.signals ?? (board.signals = [])
      const name = edit.label
      const matching = name === undefined
        ? signals.filter(signal => signal.cardId === subject.id && signal.laneId === place.id)
        : signals.filter(signal => signal.cardId === subject.id && signal.label.toLowerCase() === name.toLowerCase())
      if (name !== undefined && matching.length > 1) throw new Refusal('Two outcomes on this card have that name.', 'refused', place.id, subject.id)
      if (!matching.length && signals.length >= 24) throw new Refusal('A workshop can have up to 24 outcomes. Remove one first.', 'refused', place.id, subject.id)
      let index = 1
      while (signals.some(signal => signal.id === 'signal-' + index)) index++
      const label = name ?? matching[0]?.label ?? (subject.label + ' in ' + place.label).slice(0, 80).trim()
      const values = { label, cardId: subject.id, laneId: place.id, whenPresent: edit.whenPresent, whenAbsent: edit.whenAbsent }
      if (matching.length) Object.assign(matching[0], values)
      else signals.push({ id: 'signal-' + index, ...values })
      return done(settle(board, family, place.id, subject.id), 'When ' + said(subject.label) + ' is in ' + said(place.label) + ' the workshop says ' + said(edit.whenPresent) + '. Otherwise it says ' + said(edit.whenAbsent) + '.', { laneId: place.id, cardId: subject.id })
    }
    case 'remove_outcome': {
      const owner = cardOf(edit.card)
      const own = (board.signals ?? []).filter(signal => signal.cardId === owner.id)
      if (edit.outcome === undefined) {
        if (!own.length) throw new Refusal(said(owner.label) + ' has no outcome to remove.', 'refused', owner.laneId, owner.id)
        dropSignals(board, signal => signal.cardId === owner.id)
      } else {
        const item = resolve(own, workshopFinder(own, 'outcomes?', 'outcome'), edit.outcome, 'outcome', owner.laneId)
        dropSignals(board, signal => signal.id === item.id)
      }
      return done(settle(board, family, owner.laneId, owner.id), 'Removed the outcome from ' + said(owner.label) + '.', { laneId: owner.laneId, cardId: owner.id })
    }
    case 'set_presentation_order': {
      const order = edit.lanes.map(ref => laneOf(ref))
      if (order.length !== board.lanes.length || new Set(order).size !== board.lanes.length) throw new Refusal('Include each scene once in the presentation order.', 'refused')
      board.presentationOrder = order.map(item => item.id)
      return done(settle(board, family), presentationSaid(order))
    }
    case 'present_lane': {
      if (edit.before !== undefined && edit.after !== undefined) throw new Refusal('Say before or after, not both.', 'invalid_edit')
      const target = laneOf(edit.lane)
      const otherRef = edit.before ?? edit.after
      const other = otherRef === undefined ? undefined : laneOf(otherRef)
      if (other && other.id === target.id) throw new Refusal('Choose two different scenes.', 'refused', target.id)
      const order = workshopPresentationLanes(board).filter(scene => scene.id !== target.id)
      order.splice(other ? order.findIndex(scene => scene.id === other.id) + (edit.after !== undefined ? 1 : 0) : 0, 0, target)
      board.presentationOrder = order.map(scene => scene.id)
      return done(settle(board, family, target.id), presentationSaid(order), { laneId: target.id })
    }
    case 'add_station': {
      const from = laneOf(edit.from)
      let next: Workshop
      try { next = addWorkshopBranch(board, from.id, { label: edit.label, outcome: edit.outcome ?? edit.label }) } catch (error) {
        throw new Refusal((error as Error).message, 'refused', from.id)
      }
      const added = next.lanes[next.lanes.length - 1]
      return done(next, 'Added a path from ' + said(from.label) + ' to ' + said(added.label) + '.', { laneId: added.id })
    }
    case 'insert_station': {
      const target = laneOf(edit.before)
      const from = edit.from === undefined ? undefined : laneOf(edit.from)
      const before = from ? [from] : board.lanes.filter(item => item.station!.next.includes(target.id))
      if (from && !from.station!.next.includes(target.id)) {
        throw new Refusal('There is no path from ' + said(from.label) + ' to ' + said(target.label) + '. Try “Add ' + edit.label + ' after ' + from.label + '”.', 'refused', from.id)
      }
      if (!before.length) throw new Refusal('Nothing leads to ' + said(target.label) + ' yet. Try “Add ' + edit.label + ' after ' + target.label + '”.', 'refused', target.id)
      let grown: Workshop
      try { grown = addWorkshopBranch(board, before[0].id, { label: edit.label, outcome: edit.outcome ?? edit.label }) } catch (error) {
        throw new Refusal((error as Error).message, 'refused', target.id)
      }
      const added = grown.lanes[grown.lanes.length - 1]
      for (const item of grown.lanes) {
        if (!before.some(source => source.id === item.id)) continue
        item.station!.next = [...new Set(item.station!.next.map(id => id === target.id ? added.id : id))]
      }
      added.station!.next = [target.id]
      return done(settle(grown, family, added.id), 'Added ' + said(added.label) + ' before ' + said(target.label) + '.', { laneId: added.id })
    }
    case 'connect_stations': {
      const from = laneOf(edit.from), to = laneOf(edit.to)
      if (from.id === to.id) throw new Refusal('Connect two different steps.', 'refused', from.id)
      if (from.station!.next.includes(to.id)) return done(board, said(from.label) + ' already leads to ' + said(to.label) + '.', { laneId: from.id }, false)
      from.station!.next.push(to.id)
      return done(settle(board, family, from.id), 'Connected ' + said(from.label) + ' to ' + said(to.label) + '.', { laneId: from.id })
    }
    case 'disconnect_stations': {
      const from = laneOf(edit.from), to = laneOf(edit.to)
      if (!from.station!.next.includes(to.id)) throw new Refusal('There is no path between ' + said(from.label) + ' and ' + said(to.label) + '.', 'refused', from.id)
      from.station!.next = from.station!.next.filter(id => id !== to.id)
      return done(settle(board, family, from.id), 'Removed the path from ' + said(from.label) + ' to ' + said(to.label) + '.', { laneId: from.id })
    }
    case 'set_station_outcome': {
      const target = laneOf(edit.station)
      target.station!.outcome = edit.outcome
      return done(settle(board, family, target.id), 'Changed what happens at ' + said(target.label) + '.', { laneId: target.id })
    }
    case 'set_station_position': {
      const target = laneOf(edit.station)
      Object.assign(target.station!, { column: edit.column, row: edit.row })
      return done(settle(board, family, target.id), 'Moved ' + said(target.label) + ' to column ' + (edit.column + 1) + ', row ' + (edit.row + 1) + '.', { laneId: target.id })
    }
    case 'set_station_image': {
      const target = laneOf(edit.station)
      if (edit.image === null) {
        delete target.station!.image
        return done(settle(board, family, target.id), 'Removed the image at ' + said(target.label) + '.', { laneId: target.id })
      }
      target.station!.image = { src: edit.image.src, alt: edit.image.alt }
      return done(settle(board, family, target.id), 'Updated the image at ' + said(target.label) + '.', { laneId: target.id })
    }
    case 'set_station_image_alt': {
      const target = laneOf(edit.station)
      if (!target.station!.image) throw new Refusal('Add a station image before changing its description.', 'refused', target.id)
      target.station!.image.alt = edit.alt
      return done(settle(board, family, target.id), 'Updated the image description at ' + said(target.label) + '.', { laneId: target.id })
    }
    case 'set_task': {
      const task = cardOf(edit.card)
      if (edit.duration === undefined && edit.lag === undefined) throw new Refusal('Say how many days ' + said(task.label) + ' takes, or waits.', 'invalid_edit', task.laneId, task.id)
      let next: Workshop = board
      for (const field of ['duration', 'lag'] as const) {
        const value = edit[field]
        if (value === undefined) continue
        const limits = launchPlanLimits(next, { cardId: task.id, field })
        if (!Number.isInteger(value)) throw new Refusal('A task\'s days are whole days.', 'refused', task.laneId, task.id, undefined, limits)
        const tried = withTaskValue(next, { cardId: task.id, field }, value)
        if (value < limits.min || value > limits.max) {
          throw new Refusal(value < limits.min ? limits.reasons.min! : launchOverrun(tried, task.id) ?? limits.reasons.max!, 'refused', task.laneId, task.id, undefined, limits)
        }
        next = tried
      }
      const now = next.cards.find(item => item.id === task.id)!
      return done(settle(next, family, task.laneId, task.id), said(task.label) + ' now takes ' + now.duration + (now.duration === 1 ? ' day' : ' days') +
        (now.lag ? ' and waits ' + now.lag + (now.lag === 1 ? ' day.' : ' days.') : '.'), { laneId: task.laneId, cardId: task.id })
    }
    case 'link_tasks': case 'unlink_tasks': {
      const task = cardOf(edit.card), target = cardOf(edit.waitsOn)
      const ids = { laneId: task.laneId, cardId: task.id }
      if (edit.kind === 'unlink_tasks') {
        if (!task.dependsOn?.includes(target.id)) throw new Refusal(said(task.label) + ' doesn’t wait on ' + said(target.label) + '.', 'refused', task.laneId, task.id)
        return done(settle(withLink(board, task.id, target.id, true), family, task.laneId, task.id), said(task.label) + ' no longer waits on ' + said(target.label) + '.', ids)
      }
      const why = launchLinkRefusal(board, task.id, target.id)
      if (why) throw new Refusal(why, 'refused', task.laneId, task.id)
      return done(settle(withLink(board, task.id, target.id), family, task.laneId, task.id), said(task.label) + ' now waits on ' + said(target.label) + '.', ids)
    }
    case 'set_launch_day': {
      const limits = launchPlanLimits(board, { field: 'day' })
      if (!Number.isInteger(edit.day) || edit.day < limits.min || edit.day > limits.max) {
        const tried = withTaskValue(board, { field: 'day' }, edit.day)
        throw new Refusal((edit.day < limits.min && launchOverrun(tried)) || (edit.day < limits.min ? limits.reasons.min! : limits.reasons.max!), 'refused', null, undefined, undefined, limits)
      }
      return done(settle(withTaskValue(board, { field: 'day' }, edit.day), family), 'Launch is now day ' + edit.day + '.')
    }
    case 'set_amount': {
      const item = cardOf(edit.card)
      const currency = board.forecast?.currency ?? board.budget?.currency
      let limits = pipelineLimits(board, { field: 'amount' })
      if (family === 'budget') {
        const lane = board.lanes.find(other => other.id === item.laneId)!
        const left = lane.allocation! - budgetCommitted(board, lane.id) + (item.amount ?? 0)
        limits = { field: 'amount', min: 1, max: left, reasons: { min: 'A line item costs something.', max: said(lane.label) + ' has ' + money(left, currency) + ' for it.' } }
        if (edit.amount > left) throw new Refusal(lane.label + ' has ' + money(left - (item.amount ?? 0), currency) + ' left. ' + item.label + ' costs ' + money(edit.amount, currency) + '.', 'refused', lane.id, item.id, undefined, limits)
      }
      if (!Number.isInteger(edit.amount) || edit.amount < limits.min || edit.amount > limits.max) {
        throw new Refusal(edit.amount < limits.min ? limits.reasons.min! : limits.reasons.max!, 'refused', item.laneId, item.id, undefined, limits)
      }
      item.amount = edit.amount
      return done(settle(board, family, item.laneId, item.id), said(item.label) + ' is now ' + money(edit.amount, currency) + '.', { laneId: item.laneId, cardId: item.id })
    }
    case 'set_target': {
      const limits = pipelineLimits(board, { field: 'target' })
      if (!Number.isInteger(edit.amount) || edit.amount < 1 || edit.amount > limits.max) throw new Refusal(edit.amount < 1 ? limits.reasons.min! : limits.reasons.max!, 'refused', null, undefined, undefined, limits)
      board.forecast!.target = edit.amount
      return done(settle(board, family), 'The target is now ' + money(edit.amount, board.forecast!.currency) + '.')
    }
    case 'shift_budget': {
      const from = laneOf(edit.from), to = laneOf(edit.to)
      const why = budgetShiftRefusal(board, from.id, to.id, edit.amount)
      if (why) throw new Refusal(why, 'refused', from.id, undefined, undefined, from.id === to.id ? undefined : budgetShiftLimits(board, from.id, to.id))
      return done(settle(shiftBudget(board, from.id, to.id, edit.amount), family, to.id), 'Moved ' + money(edit.amount, board.budget!.currency) + ' from ' + said(from.label) + ' to ' + said(to.label) + '.', { laneId: to.id })
    }
  }

  /** add_card on a launch plan, a pipeline or a budget: the card, with its days or amount, by the board's rules. */
  function addBusinessCard(target: WorkshopLane): Step {
    if (edit.kind !== 'add_card') throw new Error('add_card only')
    const label = edit.label?.trim()
    if (!label) throw new Refusal('Say what the card should say, such as “Add Docs to ' + target.label + '”.', 'refused', target.id)
    const ids = new Set([...board.lanes, ...board.cards].map(item => item.id))
    let n = 1
    while (ids.has('card-' + n)) n++
    const card: WorkshopCard = { id: 'card-' + n, label, laneId: target.id }
    const currency = board.forecast?.currency ?? board.budget?.currency
    if (family === 'launch-plan') {
      card.duration = edit.duration ?? 2
      if (edit.lag) card.lag = edit.lag
      const waits = [...new Set((edit.waitsOn ?? []).map(ref => cardOf(ref).id))]
      if (waits.length) card.dependsOn = waits
    } else if (edit.amount !== undefined) card.amount = edit.amount
    if (family === 'budget' && edit.amount === undefined) throw new Refusal('Give the line item a cost, like \'Contractor $45k\'.', 'refused', target.id)
    if (family === 'pipeline' && target.role) throw new Refusal('A new deal starts in an open stage, not in ' + target.label + '.', 'refused', target.id)
    const held = board.cards.filter(item => item.laneId === target.id)
    if (family === 'pipeline' && target.capacity !== undefined && held.length >= target.capacity) throw new Refusal(target.label + ' already holds ' + held.length + ' of ' + target.capacity + ' deals.', 'refused', target.id)
    if (family === 'budget') {
      const left = target.allocation! - budgetCommitted(board, target.id)
      if (card.amount! > left) throw new Refusal(target.label + ' has ' + money(left, currency) + ' left. ' + label + ' costs ' + money(card.amount!, currency) + '.', 'refused', target.id)
    }
    const next = { ...board, cards: [...board.cards, card] }
    if (family === 'launch-plan') {
      const late = launchOverrun(next, card.id)
      if (late) throw new Refusal(late, 'refused', target.id)
    }
    return done(settle(next, family, target.id), 'Added ' + said(label) + ' to ' + said(target.label) + '.', { laneId: target.id, cardId: card.id })
  }

  function moveTo(subject: WorkshopCard, destination: WorkshopLane): Step {
    const ids = { laneId: destination.id, cardId: subject.id }
    if (subject.laneId === destination.id) {
      return done(input, said(subject.label) + ' is already ' + (map ? 'at ' : 'in ') + said(destination.label) + '.', ids, false)
    }
    const next = workshopCandidate(input, subject.id, destination.id)
    if (!next) throw new Refusal(workshopRefusal(input, subject.id, destination.id) ?? 'That move is not available.', 'refused', destination.id, subject.id)
    return done(settle(next, family, destination.id, subject.id), 'Moved ' + said(subject.label) + ' to ' + said(destination.label) + '.', ids)
  }
}

function dropSignals(board: Workshop, gone: (signal: WorkshopSignal) => boolean) {
  if (!board.signals) return
  board.signals = board.signals.filter(signal => !gone(signal))
  if (!board.signals.length) delete board.signals
}

/**
 * Make `edits` on `board`, in order, all or none. Returns the board that results with a report of
 * what each edit did, or the first refusal: the sentence a person is given, a code, which edit,
 * and the lane to show it on. The board given is never changed.
 */
export function applyWorkshopEdits(board: Workshop, edits: readonly WorkshopEdit[], options: WorkshopEditOptions = {}): WorkshopEditResult {
  const refuse = (refusal: Partial<WorkshopEditRefusal> & Pick<WorkshopEditRefusal, 'reason' | 'code'>): WorkshopEditResult =>
    ({ refused: { index: 0, kind: null, laneId: null, ...refusal } })
  let current: Workshop
  try { current = validateWorkshop(board) } catch (error) {
    return refuse({ reason: 'The workshop cannot be read: ' + (error instanceof Error ? error.message : String(error)), code: 'invalid_board' })
  }
  if (!Array.isArray(edits) || edits.length < 1 || edits.length > 50) return refuse({ reason: 'Send 1 to 50 edits.', code: 'invalid_edit' })
  const start = current
  const done: WorkshopEditDone[] = []
  for (const [index, edit] of edits.entries()) {
    const kind = (edit as { kind?: unknown } | null)?.kind
    const entry = typeof kind === 'string' ? byKind.get(kind as WorkshopEditKindName) : undefined
    if (!edit || typeof edit !== 'object' || !entry) {
      return refuse({ index, kind: typeof kind === 'string' ? kind : null, code: 'invalid_edit',
        reason: 'There is no edit called ' + said(String(kind)) + '. The edits are ' + listed(workshopEditKinds.map(item => item.kind)) + '.' })
    }
    const problem = shapeProblem(edit as unknown as Record<string, unknown>, entry)
    if (problem) return refuse({ index, kind: entry.kind, code: 'invalid_edit', reason: problem })
    const family = workshopBoardKind(current)
    if (!entry.boards.includes(family)) {
      return refuse({ index, kind: entry.kind, code: 'not_on_this_board', reason: entry.refusals[family] ?? 'This workshop does not take ' + entry.kind + '.' })
    }
    let step: Step
    try { step = makeEdit(current, edit, family, options.selection) } catch (error) {
      if (!(error instanceof Refusal)) throw error
      return refuse({ index, kind: entry.kind, reason: error.reason, code: error.code, laneId: error.laneId,
        ...(error.cardId && { cardId: error.cardId }), ...(error.candidates && { candidates: error.candidates }), ...(error.limits && { limits: error.limits }) })
    }
    const kept = checkWorkshopReplacement(current, step.board)
    if (kept) return refuse({ index, kind: entry.kind, reason: kept, code: 'not_on_this_board', laneId: step.laneId ?? null })
    current = step.board
    done.push({ index, kind: entry.kind, said: step.said, changed: step.changed ?? true,
      ...(step.laneId && { laneId: step.laneId }), ...(step.cardId && { cardId: step.cardId }) })
  }
  const was = new Map(start.cards.map(item => [item.id, item.laneId]))
  const movedCards = current.cards.flatMap(item => {
    const from = was.get(item.id)
    return from === undefined || from === item.laneId ? [] : [{ cardId: item.id, fromLaneId: from, toLaneId: item.laneId }]
  })
  return { workshop: current, report: { edits: done, movedCards } }
}

const boardNames: Record<WorkshopBoardKind, string> = {
  lanes: 'lane workshop', 'release-plan': 'release plan', 'customer-interviews': 'interview workshop',
  'experiment-budget': 'budget workshop', map: 'map', 'launch-plan': 'launch plan', pipeline: 'sales pipeline', budget: 'budget',
}

/**
 * Whether `after` may replace `before` as a whole: the guards the edits keep, said as a diff, for
 * a save that sends a whole board (creativeSlates.save, an agent's set_workshop). Null when it
 * may; otherwise the sentence a person is given. `after` must also be a valid workshop.
 */
export function checkWorkshopReplacement(before: Workshop, after: Workshop): string | null {
  const original = validateWorkshop(before)
  const was = workshopBoardKind(original)
  let next: Workshop
  try { next = validateWorkshop(after) } catch (error) {
    return ruleSentence(error instanceof Error ? error.message : String(error), was)
  }
  const now = workshopBoardKind(next)
  const sameLanes = (a: Workshop, b: Workshop) => a.lanes.length === b.lanes.length && a.lanes.every(item => b.lanes.some(other => other.id === item.id))
  // No edit reorders the lanes of a board that keeps its lanes; on a release plan the order says which release is earlier.
  const sameOrder = (a: Workshop, b: Workshop) => a.lanes.every((item, index) => b.lanes[index]?.id === item.id)
  if ((was === 'customer-interviews' || was === 'experiment-budget') && now !== was) {
    return sameLanes(original, next) ? sentences.keepsCards : sentences.keepsLanes
  }
  if ((was === 'customer-interviews' || was === 'experiment-budget') && !sameOrder(original, next)) return sentences.keepsOrder
  if (businessKind(original) && now === was && !(sameLanes(original, next) && sameOrder(original, next))) return keepsTeams[was as keyof typeof keepsTeams]
  if (was === 'release-plan' && now === 'release-plan') {
    if (!sameLanes(original, next)) return sentences.releaseLanes
    if (!sameOrder(original, next)) return sentences.releaseOrder
    if (next.cards.some(item => !original.cards.some(other => other.id === item.id))) return sentences.releaseCards
  }
  if (was !== now) return 'This slate holds a ' + boardNames[was] + ', and it stays one. Start a new slate for another kind of workshop.'
  return null
}
