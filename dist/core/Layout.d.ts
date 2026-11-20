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
 * Optimize Layout: move the slate's notes apart until none overlaps another,
 * with the shared tidy layout that arrange_nodes "tidy" uses, then save the
 * move with one onNodesMove. Locked notes and notes a host draws stay where
 * they are and the others go round them.
 *
 * @param slate - The Slate instance
 * @param gap - The space to leave between notes
 */
export declare function removeLayoutOverlaps(slate: any, gap?: number): void;
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
