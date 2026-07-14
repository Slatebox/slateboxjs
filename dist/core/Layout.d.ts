/**
 * Layout.ts - Layout algorithms for node positioning
 *
 * Provides overlap removal and auto-layout capabilities.
 */
export interface LayoutMove {
    id: string;
    x: number;
    y: number;
}
/**
 * Remove overlapping nodes by pushing them apart.
 *
 * @param slate - The Slate instance
 * @param enableAttraction - If true, nodes are slightly attracted to center
 * @param threshold - Minimum distance between nodes
 */
export declare function removeLayoutOverlaps(slate: any, enableAttraction?: boolean, threshold?: number): void;
/**
 * Apply a set of pre-computed layout moves to nodes.
 *
 * @param slate - The Slate instance
 * @param moves - Array of { id, x, y } moves
 * @param callback - Called when animation completes
 * @param noAnimation - If true, move instantly
 */
export declare function applyLayout(slate: any, moves: LayoutMove[], callback?: () => void, noAnimation?: boolean): void;
/**
 * Package the current layout positions for all nodes.
 * Can be transmitted via collab and applied elsewhere.
 */
export declare function packageLayout(slate: any): LayoutMove[];
