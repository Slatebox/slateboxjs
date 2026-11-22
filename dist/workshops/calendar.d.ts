import type { Workshop } from './model';
export declare const monthNames: string[];
/** A real calendar date as YYYY-MM-DD, as UTC milliseconds; NaN for anything else. */
export declare function isoTime(iso: unknown): number;
/** The date `offset` days after `origin`. */
export declare const isoAt: (origin: string, offset: number) => string;
/** Whole days from `origin` to `iso`. */
export declare const offsetOf: (origin: string, iso: string) => number;
/** 0 Sunday … 6 Saturday. */
export declare const weekdayAt: (origin: string, offset: number) => number;
export declare const weekendAt: (origin: string, offset: number) => boolean;
/** "Thu 17 Dec". */
export declare function dateName(origin: string, offset: number): string;
/** "17 Dec" for a date given as ISO. */
export declare function shortDate(iso: string): string;
/** The first Monday on or after `today` (YYYY-MM-DD; left out, today): where a new plan starts. */
export declare function nextMonday(today?: string): string;
/**
 * The day a person names, as an offset from the plan's first day: "Dec 20", "20 Dec", "Thu 14" (the
 * next 14th on a Thursday-or-any day from the start), "Jan 3", "2027-01-04", "May" (its first day).
 * Dates before the start mean the next year. Null when the words are not a date.
 */
export declare function dayFromWords(origin: string, words: string, after?: number): number | null;
/** The plan's clock: a first day and whether days are working days. Undefined for a plan counted in day numbers. */
export interface PlanClock {
    origin: string;
    workdays: boolean;
}
/** Working-day index ↔ calendar offset for a plan: the identity without the workdays rule. */
export interface DayMap {
    /** Calendar offset of working-day index `i` (a fraction keeps its part of that day). */
    cal(i: number): number;
    /** Working days before calendar offset `d`. */
    idx(d: number): number;
}
export declare function dayMap(clock: PlanClock | undefined): DayMap;
/** A board's clock, with whether its workdays rule is on. */
export declare function clockOf(board: Pick<Workshop, 'clock' | 'behaviour'>): PlanClock | undefined;
