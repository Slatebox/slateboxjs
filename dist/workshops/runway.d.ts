import type { Workshop } from './model';
/** The most runway a plan says: ten years. */
export declare const runwayCap = 120;
/** Months of runway with these hires, to a tenth (runwayCap at most). */
export declare function runwayMonths(board: Workshop): number;
/** "14.6 months", or "10 years or more". */
export declare const runwayWords: (months: number) => string;
