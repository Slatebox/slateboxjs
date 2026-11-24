import type { Workshop } from './model';
import type { BusinessBoardRules, WorkshopLimits } from './kinds';
export declare function budgetCommitted(board: Workshop, laneId: string): number;
/** How far a team commits past what it was given (a line item moved there anyway): 0 when it fits. */
export declare function budgetOver(board: Workshop, laneId: string): number;
export declare function validateBudget(board: Workshop): string | null;
/** Why the line item may not go to that team; null when it may. */
export declare function budgetRefusal(board: Workshop, cardId: string, laneId: string): string | null;
export declare function planBudgetMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
/** Move `amount` from one team's allocation to another's. The total stays (set_budget_total changes it). Unchecked: see budgetShiftRefusal. */
export declare function shiftBudget(board: Workshop, from: string, to: string, amount: number): Workshop;
/**
 * How far money may move between two teams: `min` and `max` of the amount moved from `from`
 * to `to`, with the sentence for the bound at each end (the team that stops it).
 */
export declare function budgetShiftLimits(board: Workshop, from: string, to: string): WorkshopLimits;
export declare function budgetShiftRefusal(board: Workshop, from: string, to: string, amount: number): string | null;
/**
 * The divider between team `laneId` and the next team: how far it may move, as money given to
 * `laneId` (positive) or taken from it (negative), and why it stops.
 */
export declare function budgetLimits(board: Workshop, ref: {
    laneId: string;
}): WorkshopLimits;
/** Which edge of the envelope a total moves at: the last team's (end) or the first team's (start). */
export type BudgetEdge = 'start' | 'end';
/** The least and most the total may be: what the teams must keep (floors, commitments), and their caps added up (none when a team has no cap). */
export declare function budgetTotalBounds(board: Workshop): {
    min: number;
    max: number;
};
/**
 * The budget with its total set to `amount` at `edge`: the team at that edge gains or gives the difference, then
 * the next team in, and so on, each within its cap and never below its floor or what it commits. The sentence
 * when no team can take it, with the smallest (or largest) total that fits.
 */
export declare function withBudgetTotal(board: Workshop, amount: number, edge?: BudgetEdge): Workshop | string;
/** What a whole-board save may change of a budget's total: only what set_budget_total makes, at either edge. */
export declare function budgetTotalFixed(before: Workshop, after: Workshop): string | null;
export declare function budgetCaption(board: Workshop, laneId: string): string;
export declare function sampleBudget(): Workshop;
/** The budget's part of the one gate (see kinds.ts). */
export declare const budgetRules: BusinessBoardRules;
