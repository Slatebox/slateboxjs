import type { Workshop, WorkshopCard } from './model';
import type { BusinessBoardRules, WorkshopLimits } from './kinds';
export interface TaskTimes {
    start: number;
    end: number;
    slack: number;
    critical: boolean;
}
export type { WorkshopLimits } from './kinds';
/** Each task's start and end day, its slack against the plan's finish, and whether it is on the critical path. */
export declare function scheduleLaunch(board: Workshop): Map<string, TaskTimes>;
/** The day the last task ends. */
export declare function launchFinish(board: Workshop): number;
/** Every task that waits on `cardId`, directly or through others. */
export declare function downstreamTasks(board: Workshop, cardId: string): Set<string>;
/**
 * Why this plan does not fit before launch, said about `cardId` when it is the task that
 * runs late, or about the task it pushes past launch. Null when every task ends in time.
 */
export declare function launchOverrun(board: Workshop, cardId?: string): string | null;
export declare function validateLaunchPlan(board: Workshop): string | null;
/** A task changes team. The schedule does not depend on teams, so any team takes it. */
export declare function planLaunchPlanMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
export declare function launchPlanRefusal(board: Workshop, cardId: string, laneId: string): string;
/** Why `cardId` may not wait on `waitsOn`; null when it may. */
export declare function launchLinkRefusal(board: Workshop, cardId: string, waitsOn: string): string | null;
/**
 * The board with `cardId` waiting on `waitsOn` (or, with `remove`, no longer waiting on it). The task keeps
 * its start where the new link allows: its lag becomes what is left between the prerequisites' end and that start.
 */
export declare function withLink(board: Workshop, cardId: string, waitsOn: string, remove?: boolean): Workshop;
export declare function launchPlanCaption(board: Workshop, laneId: string): string;
/** The board with one number of a task (or launch day) set. */
export declare function withTaskValue(board: Workshop, ref: {
    cardId?: string;
    field: 'lag' | 'duration' | 'day';
}, value: number): Workshop;
/**
 * The legal range of a task's lag or length, or of launch day, with the sentence for each end.
 * Every value in the range keeps every task ending by launch.
 */
export declare function launchPlanLimits(board: Workshop, ref: {
    cardId?: string;
    field: 'lag' | 'duration' | 'day';
}): WorkshopLimits;
/** The words a task takes back to the canvas as a note: "Copy · 3 days". */
export declare function launchTaskText(card: WorkshopCard): string;
export declare function sampleLaunchPlan(): Workshop;
/** The launch plan's part of the one gate (see kinds.ts). */
export declare const launchPlanRules: BusinessBoardRules;
