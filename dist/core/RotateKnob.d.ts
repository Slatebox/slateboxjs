/**
 * The rotate knob drawn by svg.select.js for one selected note, and the angle maths
 * behind it.
 *
 * The knob sits just outside the note's top-right corner, so it stays clear of the
 * four connect dots (edge midpoints) and the note's action pill (centred above).
 * When something of the host covers that corner (a side panel such as Ask Slatebox
 * over the canvas's right edge) or it is off screen, the knob goes to the top-left
 * corner instead, so it can always be seen and grabbed.
 * Every size here is in screen pixels: the overlay lives in the root SVG, whose
 * viewBox carries the zoom, so sizes are divided by the root's screen scale and the
 * knob looks the same at every zoom.
 */
type Pt = [number, number];
/** Visible knob diameter, in screen px. */
export declare const KNOB_SIZE = 28;
/** Hit target, in screen px (WCAG 2.5.5 / Apple HIG touch size). */
export declare const KNOB_HIT = 44;
/** Knob centre offset from the corner, along each of the note's local axes, in screen px. */
export declare const KNOB_OFFSET = 20;
/** Shift snaps to this step (tldraw, Excalidraw and FigJam all use 15°). */
export declare const SHIFT_STEP = 15;
/** On touch the angle sticks to a right angle when this close to it. */
export declare const TOUCH_STICK = 4;
/** A note whose shorter side is under this many screen px gets no knob (it would dwarf it). */
export declare const KNOB_HIDE_BELOW = 24;
/** A note whose shorter side is under this many screen px gets the small knob. */
export declare const KNOB_SMALL_BELOW = 48;
/** The small knob, its hit target and offset, in screen px. */
export declare const KNOB_SIZE_SMALL = 20;
export declare const KNOB_HIT_SMALL = 32;
export declare const KNOB_OFFSET_SMALL = 15;
export declare const ROTATE_CURSOR: string;
/** Normalise an angle in degrees to (-180, 180]. */
export declare function normalizeAngle(deg: number): number;
export interface RotationSnap {
    /** Shift held: snap to multiples of 15°. */
    shift?: boolean;
    /** Coarse pointer (touch): stick to the nearest right angle within 4°. */
    coarse?: boolean;
}
/**
 * The note's absolute angle for a pointer position during a rotate gesture.
 *
 * @param startAngle - the note's angle when the gesture began (degrees)
 * @param centre     - the note's centre, in the same space as `grab` and `p`
 * @param grab       - the pointer where the gesture began
 * @param p          - the pointer now
 */
export declare function rotationFromPointer(startAngle: number, centre: {
    x: number;
    y: number;
}, grab: {
    x: number;
    y: number;
}, p: {
    x: number;
    y: number;
}, snap?: RotationSnap): number;
/** Apply the snap rules to a raw angle, and normalise it. */
export declare function snapAngle(raw: number, snap?: RotationSnap): number;
/**
 * Where the knob goes, in overlay units: outside the top-right corner, offset
 * along the note's own top edge and its outward normal, so it turns with the note.
 *
 * @param points - svg.select's eight handle points (lt, t, rt, r, rb, b, lb, l)
 * @param scale  - screen px per overlay unit
 * @param side   - "right" (the default) for the top-right corner, "left" for the
 *                 top-left one (where the right corner is covered)
 */
export declare function rotateKnobPosition(points: Pt[], scale: number, offset?: number, side?: KnobSide): Pt | null;
/** Which top corner of the note the knob sits outside. */
export type KnobSide = "right" | "left";
/**
 * The corner for the knob: the top-right one unless something covers it there
 * (or it is off screen) and the top-left one is clear. `clearAt(side)` says how
 * many of the knob's sample points are clear on that side, out of `of`; when
 * neither side is wholly clear, the side with more clear points wins, the right
 * one on a tie.
 */
export declare function chooseKnobSide(clearAt: (side: KnobSide) => number, of: number): KnobSide;
/**
 * How many of the points (client px) show the slate itself, not something laid
 * over it: inside the window, and the topmost element there is inside `canvas`
 * (the slate's own drawing). A host panel over the canvas, the bird's-eye view, or
 * the canvas clipped under a panel beside it, makes a point not clear.
 */
export declare function clearPoints(points: {
    x: number;
    y: number;
}[], canvas: Element | null | undefined): number;
export interface KnobMetrics {
    visible: boolean;
    size: number;
    hit: number;
    offset: number;
}
/**
 * How big the knob is for a note whose shorter side is `shortSidePx` on screen: none
 * under 24px (the knob would be bigger than the note), the small knob under 48px,
 * otherwise the full 28px knob. With a finger (`coarse`) the knob keeps its full
 * size and 44px target until it goes, so it stays easy to hit.
 */
export declare function knobMetrics(shortSidePx: number, coarse?: boolean): KnobMetrics;
/** The shorter side of the box, in screen px, from svg.select's handle points. */
export declare function shortSidePx(points: Pt[], scale: number): number;
/**
 * svg.select `createRot`: a transparent 44px hit target (a rect, so the group still
 * holds exactly one circle), the 28px white knob and a circular-arrow icon. Styles
 * are inline because the host may load the JS without slateboxjs.css.
 */
export declare function createRotateKnob(group: any): void;
/**
 * svg.select `updateRot` (called with `this` = the select handler): place and size
 * the knob for the current geometry and zoom. The plugin's own rotation point
 * (20 units above top-centre) is ignored.
 */
export declare function updateRotateKnob(this: any, group: any, _rotPoint: Pt, points: Pt[]): void;
/** Re-size every rotate knob under `root` for the current zoom (they are sized in screen px). */
export declare function relayoutRotateKnobs(root: ParentNode | null | undefined): void;
/**
 * Place and size a knob (from createRotateKnob) for a box's eight handle points
 * (lt, t, rt, r, rb, b, lb, l, in the group's own units) at `s` screen px per unit.
 * Used for one note (svg.select) and for a multi-note selection (Slate).
 */
export declare function layoutRotateKnob(group: any, points: Pt[], s: number): void;
/**
 * A small dark pill beside the pointer that shows the live angle while rotating.
 * A fixed-position div outside the SVG, so it is immune to zoom and never exported.
 */
export declare class AngleReadout {
    private el;
    /**
     * @param coarse - a finger: the pill goes above the touch point, where the hand
     *                 does not cover it (a mouse: below and to the right)
     */
    show(angle: number, clientX: number, clientY: number, coarse?: boolean): void;
    hide(): void;
}
/** Client coordinates of a mouse or touch event (touch end uses changedTouches). */
export declare function clientPoint(ev: any): {
    x: number;
    y: number;
} | null;
export {};
