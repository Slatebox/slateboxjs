/**
 * ShapeRegistry.ts - Named shape definitions with SVG path data
 *
 * Provides a registry of named shapes that can be used as node backgrounds.
 * Each shape provides an SVG path string, default dimensions, and metadata.
 */
export interface ShapeDefinition {
    /** SVG path data string (d attribute) */
    path: string;
    /** Default width for the shape */
    defaultWidth: number;
    /** Default height for the shape */
    defaultHeight: number;
    /** Whether this shape uses rx/ry for rounded corners */
    hasRounding?: boolean;
    /** ViewBox for the path (minX minY width height) */
    viewBox: string;
}
/** Get a shape definition by name */
export declare function getShape(name: string): ShapeDefinition | undefined;
/** Check if a named shape exists */
export declare function hasShape(name: string): boolean;
/** Register a custom shape */
export declare function registerShape(name: string, definition: ShapeDefinition): void;
/** Get all registered shape names */
export declare function getShapeNames(): string[];
/** Check if a shape name is a "native" shape (rect/circle/ellipse) handled by SVG.js directly */
export declare function isNativeShape(name: string): boolean;
/**
 * Resolve a shape name or vectorPath to its path data.
 *
 * Logic:
 * 1. If vectorPath is a named shape key → look up in registry
 * 2. If vectorPath starts with "M" (SVG path) → use directly
 * 3. If shape is a named shape → look up in registry
 * 4. Otherwise → return undefined (use native rect/circle/ellipse)
 */
export declare function resolveShapePath(shape?: string, vectorPath?: string): ShapeDefinition | undefined;
