/**
 * Custom shapes as data (slateboxjs/shapes). A custom shape is ONE SVG path
 * `d` string: it may hold several closed sub-paths (parts and holes) and comes
 * with a fill rule. Never markup. This module is pure (no DOM, no
 * dependencies) so the browser, a server and the operation contract all check
 * shapes with the same code.
 *
 *   validateShapePath(d, {fillRule})  -> {ok} | {ok:false, code, message}
 *   normalizeShapePath(d)             -> {d, aspect}   absolute, at 0,0, longer side 100
 *   shapeTextBox(d, fillRule)         -> {x,y,w,h} in 0..1 of the bounds, or null
 *   prepareShape({name, d, fillRule}) -> the validated, normalised shape a note stores
 */
export type FillRule = "nonzero" | "evenodd";
export interface ShapeTextBox {
    x: number;
    y: number;
    w: number;
    h: number;
}
/** What a note stores for a custom shape (beside `shape: "custom"`). */
export interface CustomShape {
    name: string;
    d: string;
    fillRule: FillRule;
    /** width / height of the outline. */
    aspect: number;
    /** Where a label sits, in 0..1 of the outline's bounds; null when none fits well. */
    textBox: ShapeTextBox | null;
    /** The library entry the shape came from, when it came from one. */
    ref?: {
        id: string;
        name?: string;
    };
}
export type ShapeProblemCode = "empty" | "bad_character" | "bad_syntax" | "too_long" | "too_many_segments" | "too_many_parts" | "bad_number" | "not_closed" | "degenerate" | "too_thin" | "bad_fill_rule" | "bad_name";
export type ShapeCheck = {
    ok: true;
} | {
    ok: false;
    code: ShapeProblemCode;
    message: string;
};
export declare const SHAPE_LIMITS: Readonly<{
    /** Raw input characters. */
    maxInput: 8000;
    /** Normalised output characters. */
    maxNormalized: 6000;
    maxSegments: 300;
    maxParts: 24;
    maxMagnitude: 10000;
    /** A sub-path whose end is this close to its start (of the larger side) is closed for you. */
    closeTolerance: 0.02;
    /** A side shorter than this fraction of the other is a line, not a shape. */
    minSideRatio: 0.05;
    /** The filled area must cover at least this much of the bounds. */
    minFill: 0.08;
    /** Text never touches an edge. */
    textBoxCap: 0.92;
    /** A smaller best box than this (each side) means text will not fit well. */
    minTextBox: 0.15;
    maxName: 60;
    /**
     * Flattened outline points, all parts together. Curves and arcs are drawn
     * with fewer steps when a path would go over it, so a check costs about the
     * same for every path the grammar allows.
     */
    maxPoints: 2400;
}>;
export declare class ShapePathError extends Error {
    code: ShapeProblemCode;
    constructor(code: ShapeProblemCode);
}
/** An absolute segment: M, L, C, Q, A or Z (H/V become L, S becomes C, T becomes Q). */
export type Segment = {
    c: "M";
    x: number;
    y: number;
} | {
    c: "L";
    x: number;
    y: number;
} | {
    c: "C";
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    x: number;
    y: number;
} | {
    c: "Q";
    x1: number;
    y1: number;
    x: number;
    y: number;
} | {
    c: "A";
    rx: number;
    ry: number;
    rot: number;
    large: 0 | 1;
    sweep: 0 | 1;
    x: number;
    y: number;
} | {
    c: "Z";
};
/** One sub-path: starts with M, may end with Z. */
export type SubPath = Segment[];
/**
 * Parse a path into absolute sub-paths. Throws ShapePathError on anything
 * that is not a plain path. Arc flags may be written without separators.
 */
export declare function parseShapePath(d: string): SubPath[];
type Pt = [number, number];
/** Each sub-path as a closed polygon (curves flattened, at most SHAPE_LIMITS.maxPoints points). */
export declare function flattenShape(parts: SubPath[]): Pt[][];
/** Check a path. Never throws. */
export declare function validateShapePath(d: unknown, options?: {
    fillRule?: unknown;
}): ShapeCheck;
/**
 * Absolute commands, arcs kept, bounds moved to 0,0, the longer side scaled to
 * 100 (aspect kept and returned), one decimal. Closes nearly closed parts.
 * Throws ShapePathError on a path validateShapePath refuses for its syntax.
 */
export declare function normalizeShapePath(d: string): {
    d: string;
    aspect: number;
};
/**
 * The largest calm rectangle inside the filled area (fill rule respected), in
 * 0..1 of the outline's bounds, each side capped so text never touches an
 * edge. Null when the best box is too small for a label.
 */
export declare function shapeTextBox(d: string, fillRule?: FillRule | string): ShapeTextBox | null;
/** Validate a name: 1-60 printable characters, no markup characters. */
export declare function cleanShapeName(name: unknown): string | null;
/**
 * Everything a note stores for a custom shape, from a candidate: validated,
 * normalised, with its aspect and text box. The one entry point for model
 * output, library saves and operation values.
 */
type Prepared = {
    ok: true;
    shape: CustomShape;
} | {
    ok: false;
    code: ShapeProblemCode;
    message: string;
};
export declare function prepareShape(input: {
    name?: unknown;
    d?: unknown;
    fillRule?: unknown;
    ref?: unknown;
}): Prepared;
/** Is this note option set a custom (path) shape rather than a named one? */
export declare function isCustomShapeOptions(options: Record<string, any> | undefined): boolean;
/** Store a prepared shape on note options (the shape of a note the canvas reads back). */
export declare function storeCustomShape(options: Record<string, any>, shape: CustomShape): void;
export {};
