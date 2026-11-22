import type { Workshop, WorkshopBoardKind, WorkshopEditField, WorkshopEditKind, WorkshopEditKindName } from './model';
/**
 * A plan's own edits, fields, boards and rule keys, added to the one edit table as the plans load, so
 * describeWorkshopEdits, exec's schema and the reducer know them wherever the plans are loaded.
 */
export declare function extendWorkshopEdits(more: {
    kinds?: WorkshopEditKind[];
    boards?: Partial<Record<WorkshopEditKindName, WorkshopBoardKind[]>>;
    fields?: Partial<Record<WorkshopEditKindName, Record<string, WorkshopEditField>>>;
    rules?: {
        kinds: string[];
        keys: Record<string, unknown>;
    };
}): void;
/** start/end: working-day indices (days, without the workdays rule); from/to: calendar offsets, `to` exclusive. */
export interface TaskTimes {
    start: number;
    end: number;
    slack: number;
    critical: boolean;
    from: number;
    to: number;
}
/** Each task's start and end, its slack against the plan's finish, whether it is on the critical path, and its dates. */
export declare function scheduleLaunch(board: Workshop): Map<string, TaskTimes>;
/** The index the last task ends at. */
export declare function launchFinish(board: Workshop): number;
/** Launch day as a working-day index (the day itself without the workdays rule). */
export declare const launchIndex: (board: Workshop) => number;
/** "launch", or what this plan calls its line ("go-live"). */
export declare const lineWord: (board: Workshop) => string;
/** A calendar day in a person's words: "Thu 17 Dec" on a dated plan, "day 17" otherwise. */
export declare const dayWords: (board: Workshop, offset: number) => string;
/** Whether the line is hard: a plan without rules keeps its built-in hard line; with rules, only a deadline rule that refuses. */
export declare function launchHard(board: Workshop): boolean;
/** Whether a slip stops at the tasks that wait on it (the cascade rule says stop) instead of pushing them. */
export declare const cascadeStops: (board: Workshop) => boolean;
/** The step a dragged or typed value takes: a week (5 working days with the workdays rule) under a week snap, else a day. */
export declare function snapStep(board: Workshop): number;
/** Which edge of a task's bar a grip drags: its start (the end stays put) or its end (the start stays put). */
export type TaskEdge = 'start' | 'end';
/** A task's lag and length after one of its edges is dragged; `held` when a bound stopped it (its length, or what it waits on). */
export interface EdgeValues {
    lag: number;
    duration: number;
    held?: 'length' | 'longest' | 'ready';
}
/**
 * Where a task's lag and length go when its bar's `edge` is dragged `by` calendar days (a pointer's pixels over
 * a day's width, so a fraction). The edge lands on the nearest day and is read through the plan's calendar:
 * with the workdays rule an end let go on a weekend ends the Friday before, and a start the Monday after.
 * It moves in whole steps of the plan's snap (a week where it snaps to weeks). The end edge keeps the start;
 * the start edge keeps the end (the length takes up the difference). At least one step long (and at most
 * the 60 days a task takes, or a hire's 20 weeks of recruiting), and never starting before what it waits on lets it.
 */
export declare function edgeValues(board: Workshop, cardId: string, edge: TaskEdge, by: number): EdgeValues;
/** Every task that waits on `cardId`, directly or through others. */
export declare function downstreamTasks(board: Workshop, cardId: string): Set<string>;
/**
 * Why this plan does not fit before launch, said about `cardId` when it is the task that
 * runs late, or about the task it pushes past launch. Null when every task ends in time.
 */
export declare function launchOverrun(board: Workshop, cardId?: string): string | null;
/** The board with one number of a task (or launch day) set. */
export declare function withTaskValue(board: Workshop, ref: {
    cardId?: string;
    field: 'lag' | 'duration' | 'day';
}, value: number): Workshop;
/**
 * The board with `cardId` waiting on `waitsOn` (or, with `remove`, no longer waiting on it). The task keeps
 * its start where the new link allows: its lag becomes what is left between the prerequisites' end and that start.
 */
export declare function withLink(board: Workshop, cardId: string, waitsOn: string, remove?: boolean): Workshop;
/**
 * A slip that stops at the tasks waiting on it (cascade: stop): every task not in `moved` keeps the start
 * it had in `before`, its lag taking up the difference. The sentence when one can't: what it waits on
 * would end after it starts.
 */
export declare function holdOthers(before: Workshop, after: Workshop, moved: Set<string>): Workshop | string;
