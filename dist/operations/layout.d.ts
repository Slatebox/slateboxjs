/**
 * Layouts over plain boxes, free of the DOM. The canvas's Align, Distribute and
 * Optimize Layout (core/Slate.ts, core/Layout.ts) and the arrange_nodes
 * operation both call these, so a person and an agent get the same result.
 * Each function returns the new top-left corner of every box it moves, in the
 * order the boxes were given.
 */
export interface LayoutBox {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    /** Degrees. Align and distribute work on the rotated outline, as you see it. */
    rotationAngle?: number;
}
export interface Position {
    id: string;
    x: number;
    y: number;
}
export type AlignMode = "left" | "centerH" | "right" | "top" | "middle" | "bottom";
export type DistributeAxis = "horizontal" | "vertical";
/** The axis-aligned box around a box turned about its centre. */
export declare function rotatedBounds(box: LayoutBox): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
};
/** Align two or more boxes by an edge or centre line; fewer than two move nothing. */
export declare function alignPositions(mode: AlignMode, boxes: LayoutBox[]): Position[];
/** Space three or more boxes with equal gaps; the outer two stay where they are. */
export declare function distributePositions(axis: DistributeAxis, boxes: LayoutBox[]): Position[];
/**
 * Move the boxes apart until no two are closer than `gap`. Obstacles (notes
 * that are not being arranged, or are locked) never move; the boxes go round
 * them. Each overlap is resolved along the axis that needs the shorter move,
 * away from the other box's centre, split between two boxes that may both move.
 * The pushing has a fixed budget of pair checks; a box still too close to
 * another when it runs out is placed in rows below everything else, so the
 * result never has two boxes closer than `gap`.
 */
export declare function tidyPositions(boxes: LayoutBox[], obstacles: LayoutBox[], { gap }?: {
    gap?: number;
}): Position[];
/**
 * Lay connected boxes out top-down. Roots are boxes no other box leads to (or,
 * where every box is on a cycle, the first box not yet placed); each box sits
 * one layer below the first box that reaches it, and a parent is centred over
 * its children. Boxes are placed from the top-left corner the boxes had.
 */
export declare function treePositions(boxes: LayoutBox[], edges: Array<[string, string]>, { gap, obstacles }?: {
    gap?: number;
    obstacles?: LayoutBox[];
}): Position[];
