import type { HiringBand, HiringFields, Workshop } from './model';
import type { BusinessBoardRules } from './kinds';
export { runwayMonths, runwayWords, runwayCap } from './runway';
/** A hire's first day, as an offset: when recruiting ends and cost starts. */
export declare const hireStarts: (board: Workshop, cardId: string) => number;
/** The lag that makes a hire start on `day` (or as near after as the snap allows), with what it waits on as it is. */
export declare function hireLagFor(board: Workshop, cardId: string, day: number): number;
/** The band a name picks: by id, then by its name (whole words, any case). */
export declare function bandOf(plan: HiringFields, name: string): HiringBand | undefined;
export declare function validateHiringPlan(board: Workshop): string | null;
/** "Runway with these hires: 15.2 months". */
export declare const runwayHeader: (board: Workshop) => string;
/**
 * The library's hiring plan: a year from the next Monday, three teams, five hires in role bands, cash and
 * burn, and a round that closes in week 30. Its rules: hires snap to weeks and a slip pushes what waits on it.
 */
export declare function hiringPlanSample(today?: string): Workshop;
/** The hiring plan's part of the one gate (see kinds.ts). */
export declare const hiringPlanRules: BusinessBoardRules;
