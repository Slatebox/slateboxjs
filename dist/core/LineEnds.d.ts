/**
 * The rules for a line's ends, in one place for the canvas (dragging an end),
 * the keyboard, the line tool and the operations module (exec and chat).
 *
 * An end that is on a note either FOLLOWS the note (it takes the shortest way
 * round the note as things move: no anchor) or is PINNED to one spot on the
 * note's edge (a normalized anchor {x, y} in 0..1 on the unrotated note, which
 * turns and moves with the note). An end that is on no note is FREE: a saved
 * world point that stays where it is. Only the far (target) end of a stored
 * line is ever free; a line whose starting end is let go belongs to the note at
 * its other end instead (see flipLine).
 */
export type LineEnd = "source" | "target";
export type EndAnchor = {
    x: number;
    y: number;
};
export type EndState = "follow" | "pinned" | "free";
export type Side = "top" | "right" | "bottom" | "left";
export type NoteBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
};
/** A drop this close to an edge (a quarter of the note's width or height) pins; nearer the middle follows. */
export declare const PIN_BAND = 0.25;
/** How far one arrow key press slides a pinned end along the edge (a twentieth of that side). */
export declare const NUDGE_STEP = 0.05;
/** The anchor a drop at normalized (nx, ny) on a note gives: an edge spot, or null for its middle. */
export declare function anchorForDrop(nx: number, ny: number): EndAnchor | null;
/** The nearest spot on the note's edge to a normalized point inside it. */
export declare function snapToEdge(anchor: EndAnchor): EndAnchor;
/** One arrow key press: slide a pinned end that way, then back onto the edge (turning corners). */
export declare function nudgeAnchor(anchor: EndAnchor, key: string, step?: number): EndAnchor;
/** The middle of one side. */
export declare function sideAnchor(side: Side): EndAnchor;
/** Whether an end of a stored association follows, is pinned or is free. */
export declare function endStateOf(association: Record<string, any>, which: LineEnd): EndState;
/** A world point in the note's own (unturned) frame, normalized to its box. */
export declare function normalizedOn(box: NoteBox, world: {
    x: number;
    y: number;
}): {
    x: number;
    y: number;
};
/** Where a pinned anchor is in the world (turned with the note). */
export declare function anchorPoint(box: NoteBox, anchor: EndAnchor): {
    x: number;
    y: number;
};
/** The spot where a straight line from the note's middle toward a point leaves its edge. */
export declare function anchorToward(box: NoteBox, toward: {
    x: number;
    y: number;
}): EndAnchor;
/**
 * The same line seen from its other end: what a line becomes when its starting
 * end is let go (it then belongs to the note at its far end). The arrows and the
 * pin of the end that stays on a note go with it, so it looks just as it did.
 */
export declare function flipLine<T extends Record<string, any>>(association: T): T;
