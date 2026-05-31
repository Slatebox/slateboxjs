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

// ─── Named shape definitions ─────────────────────────────────────────

const shapes: Map<string, ShapeDefinition> = new Map();

// Rectangle (basic - handled natively by SVG.js rect, but registered for completeness)
shapes.set("rectangle", {
  path: "M 0 0 H 100 V 60 H 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Rounded rectangle
shapes.set("roundedrectangle", {
  path: "M 10 0 H 90 Q 100 0 100 10 V 50 Q 100 60 90 60 H 10 Q 0 60 0 50 V 10 Q 0 0 10 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  hasRounding: true,
  viewBox: "0 0 100 60",
});

// Ellipse (handled natively, registered for completeness)
shapes.set("ellipse", {
  path: "M 50 0 A 50 30 0 1 1 50 60 A 50 30 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Circle (handled natively, registered for completeness)
shapes.set("circle", {
  path: "M 50 0 A 50 50 0 1 1 50 100 A 50 50 0 1 1 50 0 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100",
});

// Star (5-point)
shapes.set("star", {
  path: "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100",
});

// Triangle (equilateral, pointing up)
shapes.set("triangle", {
  path: "M 50 0 L 100 87 L 0 87 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87",
});

// Pentagon
shapes.set("pentagon", {
  path: "M 50 0 L 97.6 34.5 L 79.4 90.5 L 20.6 90.5 L 2.4 34.5 Z",
  defaultWidth: 100,
  defaultHeight: 95,
  viewBox: "0 0 100 95",
});

// Hexagon
shapes.set("hexagon", {
  path: "M 25 0 L 75 0 L 100 43.3 L 75 86.6 L 25 86.6 L 0 43.3 Z",
  defaultWidth: 100,
  defaultHeight: 87,
  viewBox: "0 0 100 87",
});

// Octagon
shapes.set("octagon", {
  path: "M 29.3 0 L 70.7 0 L 100 29.3 L 100 70.7 L 70.7 100 L 29.3 100 L 0 70.7 L 0 29.3 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100",
});

// Trapezium (trapezoid)
shapes.set("trapezium", {
  path: "M 20 0 L 80 0 L 100 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Parallelogram
shapes.set("parallelogram", {
  path: "M 20 0 L 100 0 L 80 60 L 0 60 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Right arrow
shapes.set("rarrow", {
  path: "M 0 15 L 70 15 L 70 0 L 100 30 L 70 60 L 70 45 L 0 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Left arrow
shapes.set("larrow", {
  path: "M 100 15 L 30 15 L 30 0 L 0 30 L 30 60 L 30 45 L 100 45 Z",
  defaultWidth: 100,
  defaultHeight: 60,
  viewBox: "0 0 100 60",
});

// Diamond / Rhombus
shapes.set("diamond", {
  path: "M 50 0 L 100 50 L 50 100 L 0 50 Z",
  defaultWidth: 100,
  defaultHeight: 100,
  viewBox: "0 0 100 100",
});

// ─── Registry API ────────────────────────────────────────────────────

/** Get a shape definition by name */
export function getShape(name: string): ShapeDefinition | undefined {
  return shapes.get(name.toLowerCase());
}

/** Check if a named shape exists */
export function hasShape(name: string): boolean {
  return shapes.has(name.toLowerCase());
}

/** Register a custom shape */
export function registerShape(
  name: string,
  definition: ShapeDefinition
): void {
  shapes.set(name.toLowerCase(), definition);
}

/** Get all registered shape names */
export function getShapeNames(): string[] {
  return Array.from(shapes.keys());
}

/** Check if a shape name is a "native" shape (rect/circle/ellipse) handled by SVG.js directly */
export function isNativeShape(name: string): boolean {
  const native = ["rectangle", "circle", "ellipse"];
  return native.includes(name.toLowerCase());
}

/**
 * Resolve a shape name or vectorPath to its path data.
 *
 * Logic:
 * 1. If vectorPath is a named shape key → look up in registry
 * 2. If vectorPath starts with "M" (SVG path) → use directly
 * 3. If shape is a named shape → look up in registry
 * 4. Otherwise → return undefined (use native rect/circle/ellipse)
 */
export function resolveShapePath(
  shape?: string,
  vectorPath?: string
): ShapeDefinition | undefined {
  // vectorPath takes precedence
  if (vectorPath) {
    // Check if it's a named shape key
    const named = getShape(vectorPath);
    if (named) return named;

    // Check if it's a raw SVG path string
    if (vectorPath.trim().startsWith("M") || vectorPath.trim().startsWith("m")) {
      return {
        path: vectorPath,
        defaultWidth: 100,
        defaultHeight: 60,
        viewBox: "0 0 100 60", // Caller should recalculate from path bounds
      };
    }
  }

  // Fall back to shape name
  if (shape) {
    const named = getShape(shape);
    if (named) return named;
  }

  return undefined;
}
