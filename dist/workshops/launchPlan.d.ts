import type { Workshop, WorkshopCard } from './model';
import type { BusinessBoardRules, BusinessEditTools, PlanWords, WorkshopLimits } from './kinds';
import type { WorkshopEdit } from './edits';
export * from './schedule';
export type { WorkshopLimits } from './kinds';
/** Why `after` breaks this plan's rules (or its built-in line), as a sentence; null when it keeps them. */
export declare function planProblem(before: Workshop, after: Workshop, cardId?: string): string | null;
/**
 * What a whole-board save may not change on a plan, because no edit does: its first day (moving it would
 * slide every task past its locks and freezes), what it calls its line, a hiring plan's cash, burn,
 * currency, weeks, the round's size and its bands (a band's cost and the round's day have their edits,
 * and answer to the rules). Rules change on their own, never in the save that moves a task.
 */
export declare function planFixed(before: Workshop, after: Workshop): string | null;
/**
 * One task changed (its lag, length or team), as the plan's rules have it: a slip that stops holds the
 * tasks waiting on it. The board that results, or the sentence of the rule it breaks.
 */
export declare function tryTask(board: Workshop, cardId: string, change: Partial<Pick<WorkshopCard, 'lag' | 'duration' | 'laneId'>>): Workshop | string;
/** A plan's words for the chat (kinds.ts PlanWords): dates on this plan. */
export declare const planWords: PlanWords;
/** Where every task of a plan may be dragged: its legal runs of start and of length. */
export declare const planDrags: (board: Workshop) => string;
/** The legal values of a task's lag or length, as runs of whole steps ([first, last] each): the drag's branches. */
export declare function legalRuns(board: Workshop, cardId: string, field: 'lag' | 'duration', laneId?: string): [number, number][];
export declare function validateLaunchPlan(board: Workshop): string | null;
/** A task changes team. The schedule does not depend on teams, so any team takes it (its rules may not). */
export declare function planLaunchPlanMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
export declare function launchPlanRefusal(board: Workshop, cardId: string, laneId: string): string;
/** Why `cardId` may not wait on `waitsOn`; null when it may. */
export declare function launchLinkRefusal(board: Workshop, cardId: string, waitsOn: string): string | null;
export declare function launchPlanCaption(board: Workshop, laneId: string): string;
/**
 * The legal range of a task's lag or length, or of launch day, with the sentence for each end: every
 * value in the range keeps the plan's rules (on a plan without rules, every task ending by launch).
 */
export declare function launchPlanLimits(board: Workshop, ref: {
    cardId?: string;
    field: 'lag' | 'duration' | 'day';
}): WorkshopLimits;
/** The words a task takes back to the canvas as a note: "Copy · 3 days". */
export declare function launchTaskText(card: WorkshopCard): string;
export declare function sampleLaunchPlan(): Workshop;
/** A plan's rules as the library adds them: each on, refusing unless it says warn. */
export declare function presetRules(rules: Array<Record<string, unknown>>): Workshop['behaviour'];
/**
 * The library's launch plan: dated from the next Monday, counted in working days, three teams with a
 * Marketing row, launch on the third Friday. Its rules: a hard line and a slip that pushes what waits on it.
 */
export declare function launchPlanSample(today?: string): Workshop;
/** One customer's go-live: two tracks, Us and Customer, toward a go-live date, shared with the customer as a guest. */
export declare function goLiveSample(today?: string): Workshop;
/** The launch and hiring plans' shared edits: set_task, link_tasks and unlink_tasks (null for any other). */
export declare function planEdit(board: Workshop, edit: WorkshopEdit, t: BusinessEditTools, said0: (card: WorkshopCard, next: Workshop) => string): import("./kinds").BusinessEditStep | null;
/** The launch plan's part of the one gate (see kinds.ts). */
export declare const launchPlanRules: BusinessBoardRules;
/** A plan's first day, when it has one: a real date. */
export declare function readClock(raw: Record<string, unknown>, board: Workshop): void;
