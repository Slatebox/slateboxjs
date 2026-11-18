import type { Workshop, WorkshopCard } from './model';
/** Sum the effort scheduled in a release window. */
export declare function releaseLoad(board: Workshop, laneId: string): number;
export declare function validateRelease(board: Workshop): void;
/**
 * A feature pulled forward brings its late prerequisites. A prerequisite
 * postponed pushes its early dependants back. A rule or budget violation
 * rejects the whole move, including all changes to connected cards.
 */
export declare function planReleaseMove(board: Workshop, feature: WorkshopCard, laneId: string): Workshop | null;
/** The shipped example is regular versioned workshop data, editable before or after a run. */
export declare const releasePlan: Workshop;
