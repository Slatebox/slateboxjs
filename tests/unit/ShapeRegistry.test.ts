import { describe, it, expect } from "vitest";
import {
  getShape,
  hasShape,
  registerShape,
  getShapeNames,
  isNativeShape,
  resolveShapePath,
  type ShapeDefinition,
} from "../../src/core/ShapeRegistry";

describe("ShapeRegistry", () => {
  describe("getShape", () => {
    it("should return shape definition for known shapes", () => {
      const rect = getShape("rectangle");
      expect(rect).toBeDefined();
      expect(rect!.path).toContain("M");
      expect(rect!.defaultWidth).toBe(100);
      expect(rect!.defaultHeight).toBe(60);
      expect(rect!.viewBox).toBe("0 0 100 60");
    });

    it("should be case-insensitive", () => {
      expect(getShape("Rectangle")).toEqual(getShape("rectangle"));
      expect(getShape("STAR")).toEqual(getShape("star"));
    });

    it("should return undefined for unknown shapes", () => {
      expect(getShape("nonexistent")).toBeUndefined();
    });
  });

  describe("hasShape", () => {
    it("should return true for registered shapes", () => {
      expect(hasShape("rectangle")).toBe(true);
      expect(hasShape("star")).toBe(true);
      expect(hasShape("hexagon")).toBe(true);
      expect(hasShape("diamond")).toBe(true);
    });

    it("should return false for unregistered shapes", () => {
      expect(hasShape("cube")).toBe(false);
    });

    it("should be case-insensitive", () => {
      expect(hasShape("RECTANGLE")).toBe(true);
    });
  });

  describe("getShapeNames", () => {
    it("should return all built-in shape names", () => {
      const names = getShapeNames();
      expect(names).toContain("rectangle");
      expect(names).toContain("roundedrectangle");
      expect(names).toContain("ellipse");
      expect(names).toContain("circle");
      expect(names).toContain("star");
      expect(names).toContain("triangle");
      expect(names).toContain("pentagon");
      expect(names).toContain("hexagon");
      expect(names).toContain("octagon");
      expect(names).toContain("trapezium");
      expect(names).toContain("parallelogram");
      expect(names).toContain("rarrow");
      expect(names).toContain("larrow");
      expect(names).toContain("diamond");
    });

    it("should have at least 14 built-in shapes", () => {
      expect(getShapeNames().length).toBeGreaterThanOrEqual(14);
    });
  });

  describe("isNativeShape", () => {
    it("should return true for rectangle, circle, ellipse", () => {
      expect(isNativeShape("rectangle")).toBe(true);
      expect(isNativeShape("circle")).toBe(true);
      expect(isNativeShape("ellipse")).toBe(true);
    });

    it("should return false for non-native shapes", () => {
      expect(isNativeShape("star")).toBe(false);
      expect(isNativeShape("hexagon")).toBe(false);
      expect(isNativeShape("diamond")).toBe(false);
    });
  });

  describe("registerShape", () => {
    it("should register a custom shape", () => {
      const customShape: ShapeDefinition = {
        path: "M 0 0 L 100 0 L 100 100 L 0 100 Z",
        defaultWidth: 100,
        defaultHeight: 100,
        viewBox: "0 0 100 100",
      };

      registerShape("customtest", customShape);
      expect(hasShape("customtest")).toBe(true);
      expect(getShape("customtest")).toEqual(customShape);
    });
  });

  describe("resolveShapePath", () => {
    it("should resolve named vectorPath", () => {
      const result = resolveShapePath(undefined, "star");
      expect(result).toBeDefined();
      expect(result!.path).toContain("M 50 0");
    });

    it("should resolve raw SVG path string as vectorPath", () => {
      const rawPath = "M 10 20 L 30 40 L 50 20 Z";
      const result = resolveShapePath(undefined, rawPath);
      expect(result).toBeDefined();
      expect(result!.path).toBe(rawPath);
    });

    it("should fall back to shape name when vectorPath is not set", () => {
      const result = resolveShapePath("hexagon");
      expect(result).toBeDefined();
      expect(result!.defaultHeight).toBe(87);
    });

    it("should return undefined when nothing matches", () => {
      expect(resolveShapePath(undefined, undefined)).toBeUndefined();
      expect(resolveShapePath("nonexistent")).toBeUndefined();
    });

    it("should prefer vectorPath over shape name", () => {
      const result = resolveShapePath("rectangle", "star");
      expect(result).toEqual(getShape("star"));
    });
  });

  describe("shape definitions are valid SVG paths", () => {
    const shapeNames = getShapeNames();

    for (const name of shapeNames) {
      it(`${name} should have a valid SVG path starting with M`, () => {
        const shape = getShape(name)!;
        expect(shape.path.trim()).toMatch(/^[Mm]/);
      });

      it(`${name} should have positive default dimensions`, () => {
        const shape = getShape(name)!;
        expect(shape.defaultWidth).toBeGreaterThan(0);
        expect(shape.defaultHeight).toBeGreaterThan(0);
      });

      it(`${name} should have a valid viewBox`, () => {
        const shape = getShape(name)!;
        expect(shape.viewBox).toMatch(/^\d+\s+\d+\s+\d+\s+\d+$/);
      });
    }
  });
});
