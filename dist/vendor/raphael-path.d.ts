/**
 * raphael-path.ts — focused TypeScript port of Raphael.js path/transform
 * helpers (parsePathString, pathToAbsolute, path2curve, transformPath).
 *
 * Ported from Raphael 2.3.0 (MIT License, Copyright (c) 2008-2013 Dmitry
 * Baranovskiy, Copyright (c) 2008-2013 Sencha Labs) to preserve the exact
 * output semantics of v1's `Slatebox.utils._transformPath(path, transform)`:
 * the input path is curve-ified (M + C commands only) and the transform
 * string uses Raphael grammar — `t/T dx,dy`, `s/S sx[,sy[,cx,cy]]`,
 * `r/R deg[,cx,cy]`, `m/M a,b,c,d,e,f` — with scale/rotate defaulting to the
 * path's bounding-box center.
 */
type PathSegment = [string, ...number[]];
export type PathArray = PathSegment[];
/** Parse an SVG path string into Raphael's array-of-segments form. */
export declare function parsePathString(pathString: string | PathArray): PathArray;
/** Convert a path to absolute coordinates. */
export declare function pathToAbsolute(pathArray: string | PathArray): PathArray;
/** Convert any path to absolute cubic-curve form (M + C segments only). */
export declare function path2curve(path: string | PathArray): PathArray;
export interface PathBBox {
    x: number;
    y: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    cx: number;
    cy: number;
}
/** Bounding box of a path (computed analytically from its curve form). */
export declare function pathBBox(path: string | PathArray): PathBBox;
/** Minimal affine matrix matching Raphael's Matrix semantics. */
export declare class Matrix {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
    constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number);
    add(a: number, b: number, c: number, d: number, e: number, f: number): void;
    translate(x: number, y: number): void;
    scale(x: number, y?: number, cx?: number, cy?: number): void;
    rotate(a: number, x?: number, y?: number): void;
    x(x: number, y: number): number;
    y(x: number, y: number): number;
}
/** Parse a Raphael transform string into command segments. */
export declare function parseTransformString(tstr: string | any[]): any[];
/**
 * Build the affine matrix for a transform string applied to a path (Raphael
 * `transform2matrix`): scale/rotate without explicit centers pivot on the
 * path's bounding-box center; uppercase T/S/R behave like their lowercase
 * forms here because a raw path carries no prior transform state.
 */
export declare function transform2matrix(tstr: string, bbox: PathBBox): Matrix;
/** Apply an affine matrix to every coordinate of a curve-ified path. */
export declare function mapPath(path: PathArray, matrix: Matrix): PathArray;
/**
 * Raphael.transformPath equivalent: curve-ify `path`, apply the Raphael
 * transform string, return the transformed path as a string ("M…C…").
 */
export declare function transformPath(path: string, tstr: string): string;
export {};
