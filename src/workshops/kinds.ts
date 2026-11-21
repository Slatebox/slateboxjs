// Where the rules of a launch plan, a sales pipeline and a budget plug into the one gate.
//
// validateWorkshop, the edit reducer (applyWorkshopEdits) and every move ask this registry for a
// business board's rules. Each rule module (launchPlan.ts, pipeline.ts, budget.ts) registers
// itself when it loads, so the code that decides is the same everywhere:
//   - a server imports slateboxjs/workshops/rules, which loads all three before it reads a board;
//   - a browser loads a board's rules with its kit (slateboxjs/boards), before the board is drawn.
// A slate without one of these boards never downloads their rules. Until a kind's rules have
// loaded, a board of that kind can't be read: the gate refuses it instead of guessing.
import type { BusinessBoardKind, Workshop, WorkshopCard, WorkshopLane } from './model'
import type { WorkshopEdit, WorkshopEditRefusalCode, WorkshopRef } from './edits'

/** A numeric edit's legal range, with the sentence a person gets at each end. */
export interface WorkshopLimits { field: string; min: number; max: number; reasons: { min?: string; max?: string } }

/** The model's own reader for stored ids, so a rule module checks them as the gate does. */
export interface WorkshopFieldReader {
  id(value: unknown): string
}

/** What one business edit made: the board, the sentence a person is told, and the ids it concerned. */
export interface BusinessEditStep { board: Workshop; said: string; changed?: boolean; laneId?: string; cardId?: string }

/** What the edit reducer lends a rule module while it makes one edit. */
export interface BusinessEditTools {
  card(ref: WorkshopRef): WorkshopCard
  lane(ref: WorkshopRef): WorkshopLane
  /** Refuse the edit with the sentence a person sees. Nothing of the list is made. */
  refuse(reason: string, at?: { laneId?: string | null; cardId?: string; limits?: WorkshopLimits; code?: WorkshopEditRefusalCode }): never
  /** The board through validateWorkshop, or a refusal in the model's words. */
  settle(board: Workshop, laneId?: string | null, cardId?: string): Workshop
  done(board: Workshop, said: string, ids?: { laneId?: string; cardId?: string }): BusinessEditStep
}

/** Everything the gate asks of one kind of business board. Pure: no DOM, no drawing. */
export interface BusinessBoardRules {
  kind: BusinessBoardKind
  /** The most cards the board holds, and the sentence past it. */
  cards: [number, string]
  /** Read the kind's own fields of a stored lane, card and board (validateWorkshop keeps only these). */
  readLane?(raw: Record<string, unknown>, lane: WorkshopLane, read: WorkshopFieldReader): void
  readCard(raw: Record<string, unknown>, card: WorkshopCard, read: WorkshopFieldReader): void
  readBoard(raw: Record<string, unknown>, board: Workshop, read: WorkshopFieldReader): void
  /** The kind's rule over the whole board: null when it holds, otherwise the sentence. */
  validate(board: Workshop): string | null
  /** The board a card's move makes, `board` when it is there already, or null when the rule refuses. */
  planMove(board: Workshop, cardId: string, laneId: string): Workshop | null
  /** Why planMove refuses, as a sentence. */
  refusal?(board: Workshop, cardId: string, laneId: string): string | null
  /** The second line under a lane's name. */
  caption(board: Workshop, laneId: string): string
  /** What a card says on the board, and as a note again off it ("Copy · 3 days"). */
  cardText(board: Workshop, card: WorkshopCard): string
  noteText(board: Workshop, card: WorkshopCard): string
  /** The add_card fields a note's words make (its name and the number written on it), or why it can't become a card. */
  fromNote(board: Workshop, text: string): { label: string; duration?: number; amount?: number } | string
  /** A card's new words: its name, and the edits the numbers typed on it make. */
  renamed(board: Workshop, cardId: string, text: string): { label: string; edits: WorkshopEdit[] }
  /** Make one of the kind's own edits (and add_card); null for an edit the generic reducer makes. */
  edit(board: Workshop, edit: WorkshopEdit, tools: BusinessEditTools): BusinessEditStep | null
}

const registry = new Map<string, BusinessBoardRules>()
const names: Record<BusinessBoardKind, string> = { 'launch-plan': 'launch plan', pipeline: 'sales pipeline', budget: 'budget' }

/** Plug a kind's rules into the gate. Each rule module calls it once when it loads. */
export function registerWorkshopRules(rules: BusinessBoardRules): void {
  registry.set(rules.kind, rules)
}

/** Whether a kind's rules have loaded here (in a browser, with its kit). */
export function workshopRulesLoaded(kind: string | undefined): boolean {
  return typeof kind === 'string' && registry.has(kind)
}

/** The rules of a business board's kind. Throws while they have not loaded. */
export function workshopRules(kind: BusinessBoardKind): BusinessBoardRules {
  const rules = registry.get(kind)
  if (!rules) throw new Error(`The ${names[kind] ?? kind} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`)
  return rules
}
