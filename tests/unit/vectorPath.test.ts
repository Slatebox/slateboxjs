import { describe, it, expect } from "vitest";
import { isDisplacedPath, normalizeVectorPath, normalizeShapeOptions } from "../../src/core/vectorPath";
import { pathBBox, transformPath } from "../../src/core/PathGeometry";

const STAR_24 =
  "M16.985 19.501l-.952-5.55 4.033-3.932-5.574-.81L12 4.16 9.508 9.21l-5.574.81 4.033 3.931-.952 5.551L12 16.881l4.985 2.62z";
// The owner's saved quick-add star (slatebox-test, 301898fc07): "M10041.91,10057.85 C…".
const QUICK_ADD_STAR = transformPath(STAR_24, "T10000,10000s6,6");

describe("vectorPath normalisation", () => {
  it("moves a path stored in canvas coordinates to its own origin, keeping its size", () => {
    expect(QUICK_ADD_STAR.startsWith("M10041.91")).toBe(true);
    expect(isDisplacedPath(QUICK_ADD_STAR)).toBe(true);
    const before = pathBBox(QUICK_ADD_STAR);
    const after = pathBBox(normalizeVectorPath(QUICK_ADD_STAR));
    expect(after.x).toBeCloseTo(0, 6);
    expect(after.y).toBeCloseTo(0, 6);
    expect(after.width).toBeCloseTo(before.width, 6);
    expect(after.height).toBeCloseTo(before.height, 6);
  });

  it("leaves paths near their origin, named shapes and non-paths exactly as they are", () => {
    for (const value of [STAR_24, "M0 0 L100 0 L100 60 Z", "star", "rectangle", "", undefined, null]) {
      expect(isDisplacedPath(value)).toBe(false);
      expect(normalizeVectorPath(value)).toBe(value);
    }
  });

  it("normalises vectorPath and a path carried as shape, and is idempotent", () => {
    const opts: any = { vectorPath: QUICK_ADD_STAR, shape: QUICK_ADD_STAR };
    normalizeShapeOptions(opts);
    expect(opts.vectorPath).toBe(opts.shape);
    expect(isDisplacedPath(opts.vectorPath)).toBe(false);
    const once = opts.vectorPath;
    normalizeShapeOptions(opts);
    expect(opts.vectorPath).toBe(once);
    const named: any = { shape: "star", vectorPath: "star" };
    expect(normalizeShapeOptions(named)).toEqual({ shape: "star", vectorPath: "star" });
  });
});
