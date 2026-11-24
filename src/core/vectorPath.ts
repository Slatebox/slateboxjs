/**
 * A note's outline is drawn into its own box: the renderer fits the path's
 * bounds to the note, so only the path's shape matters, never where it sits.
 *
 * Older writers stored raw paths in canvas coordinates: the v1 quick-add
 * shapes translate the path to where the note was dropped (around the 10000
 * canvas origin). Drawn, such a path looks right, but every reader that takes
 * the outline's own bounds as the note's box (connector ends, the sibling
 * preview, the view that follows a new note, zoom to fit, the animations'
 * pivot) lands thousands of pixels away.
 *
 * `normalizeVectorPath` moves such a path to its own origin. Paths that already
 * sit near their origin (the shape picker's 24-unit outlines, shapes from the
 * library, named shapes) come back unchanged, so nothing that compares them
 * changes.
 */
import { pathBBox, transformPath } from "./PathGeometry";

const isRawPath = (value: unknown): value is string =>
  typeof value === "string" && /^\s*[Mm]/.test(value);

/** True for a raw path that sits further from its origin than its own size. */
export function isDisplacedPath(path: unknown): boolean {
  if (!isRawPath(path)) return false;
  try {
    const bb = pathBBox(path);
    if (![bb.x, bb.y, bb.width, bb.height].every(Number.isFinite)) return false;
    const size = Math.max(bb.width, bb.height, 1);
    return Math.abs(bb.x) > size || Math.abs(bb.y) > size;
  } catch {
    return false;
  }
}

/** The path moved to its own origin when it is displaced; anything else as it is. */
export function normalizeVectorPath<T>(path: T): T {
  if (!isDisplacedPath(path)) return path;
  try {
    const bb = pathBBox(path as unknown as string);
    const moved = transformPath(path as unknown as string, `T${-bb.x},${-bb.y}`);
    return (moved || path) as T;
  } catch {
    return path;
  }
}

/** Normalise the raw paths a note's options carry (`vectorPath`, and `shape` when it holds a path). */
export function normalizeShapeOptions<O extends { vectorPath?: string; shape?: string }>(options: O): O {
  if (!options) return options;
  if (isDisplacedPath(options.vectorPath)) options.vectorPath = normalizeVectorPath(options.vectorPath);
  if (isDisplacedPath(options.shape)) options.shape = normalizeVectorPath(options.shape);
  return options;
}
