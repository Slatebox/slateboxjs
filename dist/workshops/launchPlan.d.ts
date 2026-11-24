import type { Workshop, WorkshopCard } from './model';
import type { BusinessBoardRules, BusinessEditTools, PlanWords, WorkshopLimits } from './kinds';
import type { WorkshopEdit } from './edits';
import { type EdgeValues, type TaskEdge } from './schedule';
export * from './schedule';
export type { WorkshopLimits } from './kinds';
/** Why `after` breaks this plan's rules (or its built-in line), as a sentence; null when it keeps them. */
export declare function planProblem(before: Workshop, after: Workshop, cardId?: string): string | null;
/**
 * Every rule `after` breaks on this plan, one sentence each (planProblem names the first): what a move made anyway
 * says it breaks, so the person agrees to each, for what waits on the task and moves with it too.
 */
export declare function planProblems(before: Workshop, after: Workshop, cardId?: string): string[];
/**
 * Why a task may not start where `lag` puts it, before what it waits on ends (a lag below 0): the sentence a move made
 * anyway breaks. Null for a lag of 0 or more.
 */
export declare function waitsRefusal(board: Workshop, cardId: string, lag: number): string | null;
/**
 * What a whole-board save may not change on a plan, because no edit does: anything of its clock but its first
 * day (set_plan_start), what it calls its line, a hiring plan's cash, burn, currency, the round's size and its bands (a band's cost and the round's day have their edits,
 * and answer to the rules). Rules change on their own, never in the save that moves a task.
 */
export declare function planFixed(before: Workshop, after: Workshop): string | null;
/**
 * One task changed (its lag, length or team), as the plan's rules have it: a slip that stops holds the
 * tasks waiting on it. The board that results, or the sentence of the rule it breaks.
 */
export declare function tryTask(board: Workshop, cardId: string, change: Partial<Pick<WorkshopCard, 'lag' | 'duration' | 'laneId'>>): Workshop | string;
/**
 * A task just made from a note let go on calendar `day` of a plan: it starts on that day, in whole steps of the
 * plan's snap (a week where it snaps to weeks; a hire always moves in weeks), read through its calendar (a day off
 * on a working-day plan is the next working day). Where the plan's rules refuse that day (past a hard line, in a
 * freeze), the nearest earlier day they take; the plan's start when none does (where a dropped note always went).
 */
export declare function landPlanNote(board: Workshop, cardId: string, day: number): Workshop;
/** The grip on a task's start edge (its end grip is `handle-<card>`). A card id never starts with "_", so the name is the start grip's alone. */
export declare const startHandle: (cardId: string) => string;
/** The task whose start grip this is, or null for any other part. */
export declare const startHandleCard: (part: string) => string | null;
/** What a dragged edge comes to: its values, the one edit a drop makes, the board (null when the rules refuse it) and why it stopped or was refused. */
export interface EdgeDrag {
    values: EdgeValues;
    edit: WorkshopEdit;
    next: Workshop | null;
    refusal: string | null;
    reason?: string;
}
/**
 * A task's start or end edge dragged `by` calendar days (edgeValues), as the plan's rules have it: a slip
 * pushes what waits on it (or stops at it, held where it was), and a rule the change breaks refuses it in
 * its own sentence. The drop is one set_task edit, the edit the chat and exec make.
 */
export declare function dragTaskEdge(board: Workshop, cardId: string, edge: TaskEdge, by: number): EdgeDrag;
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
/**
 * The day the line lands on when it is moved to `day` from `from` (where it is): on a plan whose days are
 * working days a weekend is no day for it, so moving later it lands on the Monday after, moving earlier on
 * the Friday before. Always a day from 5 to 120 (past an end, it turns back to the working day inside it).
 */
export declare function launchDayOn(board: Workshop, day: number, from?: number): number;
/** The earliest day the line may be on and every task still end by it: a working day where days are working days. */
export declare function earliestLaunch(board: Workshop): number;
/** Why the line may not be on `day` because a task would not end by it, with the earliest day that fits; null when they all do. */
export declare function launchTooEarly(board: Workshop, day: number): string | null;
/** What dragging (or a key moving) the line to `wanted` comes to: the day it lands on, the board, and the sentence that refuses it or holds it. */
export interface LaunchMove {
    day: number;
    next: Workshop | null;
    refusal: string | null;
    reason?: string;
}
/**
 * The line moved to `wanted` (a whole calendar day, from the pointer): it lands on a working day where weekends
 * don't count, never past day 120 (held there, said), and a hard line refuses a day before the tasks end, in the
 * plan's own sentence with the earliest day that fits. A later line needs no room: the grid draws the days it adds.
 */
export declare function moveLaunch(board: Workshop, wanted: number): LaunchMove;
/**
 * How far the plan's first day lands when it is moved `by` calendar days: where weekends don't count a
 * weekend is no first day (later: the Monday after; earlier: the Friday before); a plan that snaps to weeks
 * (a hiring plan) moves it in whole weeks.
 */
export declare function planStartBy(board: Workshop, by: number): number;
/**
 * The plan with its first day moved `by` calendar days: every task keeps its dates (a task that would start
 * before the new first day starts on it, and what waits on it moves with it), the line and a funding round keep
 * theirs, and a hiring plan keeps its last day. Unchecked: see movePlanStart.
 */
export declare function withPlanStart(board: Workshop, by: number): Workshop;
/** What moving the plan's first day comes to: how far it moved (snapped), the board, or the sentence that refuses it. */
export interface StartMove {
    by: number;
    next: Workshop | null;
    refusal: string | null;
}
/**
 * The plan's first day moved `wanted` calendar days (a pointer's days, a key, the chat): snapped (planStartBy),
 * then decided by the plan's rules. Refused, it says why and, moving later, the latest first day that fits.
 */
export declare function movePlanStart(board: Workshop, wanted: number): StartMove;
/** A hiring plan's last day moved to `weeks`: never before a hire starts or the round closes, 13 to 104 weeks. */
export declare function planWeeksProblem(board: Workshop, weeks: number): string | null;
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
/**
 * Whether a plan's task still stands past the plan's own line or what it waits on (BusinessBoardRules.pastRule): it
 * starts before what it waits on ends, or (a launch plan) it ends after launch.
 */
export declare function planPastRule(board: Workshop, cardId: string): boolean;
/** The launch plan's part of the one gate (see kinds.ts). */
export declare const launchPlanRules: BusinessBoardRules;
/** A plan's first day, when it has one: a real date. */
export declare function readClock(raw: Record<string, unknown>, board: Workshop): void;
