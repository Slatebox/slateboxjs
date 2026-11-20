import type { Workshop } from './model';
import type { WorkshopLimits } from './launchPlan';
export declare function budgetCommitted(board: Workshop, laneId: string): number;
export declare function validateBudget(board: Workshop): string | null;
/** Why the line item may not go to that team; null when it may. */
export declare function budgetRefusal(board: Workshop, cardId: string, laneId: string): string | null;
export declare function planBudgetMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
/** Move `amount` from one team's allocation to another's. The total cannot change. Unchecked: see budgetShiftRefusal. */
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
export declare function budgetCaption(board: Workshop, laneId: string): string;
export declare function sampleBudget(): Workshop;
