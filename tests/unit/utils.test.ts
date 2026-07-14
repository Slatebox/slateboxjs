import { describe, it, expect } from "vitest";
import {
  guid,
  whiteOrBlack,
  getTextWidth,
  getBBox,
  createMultiLineText,
  randomInt,
  obtainProportionateWidthAndHeightForResizing,
  safeForUrls,
  _transformPath,
  isElement,
  isSafari,
  isMobile,
  stopEvent,
  chunk,
} from "../../src/utils";

describe("utils", () => {
  describe("guid", () => {
    it("should generate a string of default length 10", () => {
      const id = guid();
      expect(id).toHaveLength(10);
    });

    it("should generate a string of specified length", () => {
      expect(guid(5)).toHaveLength(5);
      expect(guid(20)).toHaveLength(20);
    });

    it("should generate unique IDs", () => {
      const ids = new Set(Array.from({ length: 100 }, () => guid()));
      expect(ids.size).toBe(100);
    });

    it("should only contain alphanumeric characters", () => {
      const id = guid(100);
      expect(id).toMatch(/^[a-zA-Z0-9]+$/);
    });
  });

  describe("whiteOrBlack", () => {
    it("should return black for light backgrounds", () => {
      expect(whiteOrBlack("#ffffff")).toBe("#000000");
      expect(whiteOrBlack("#f0f0f0")).toBe("#000000");
      expect(whiteOrBlack("#ffff00")).toBe("#000000"); // yellow
    });

    it("should return white for dark backgrounds", () => {
      expect(whiteOrBlack("#000000")).toBe("#ffffff");
      expect(whiteOrBlack("#333333")).toBe("#ffffff");
      expect(whiteOrBlack("#000080")).toBe("#ffffff"); // navy
    });

    it("should handle hex with # prefix", () => {
      expect(whiteOrBlack("#ffffff")).toBe("#000000");
    });

    it("should handle hex without # prefix", () => {
      expect(whiteOrBlack("ffffff")).toBe("#000000");
    });
  });

  describe("getTextWidth", () => {
    it("returns the v1 {width, height} shape", () => {
      const dimens = getTextWidth("Hello World", "normal 12pt Arial");
      expect(dimens.width).toBeGreaterThan(0);
      expect(dimens.height).toBeGreaterThan(0);
    });

    it("returns wider for longer text", () => {
      const short = getTextWidth("Hi", "normal 12pt Arial");
      const long = getTextWidth(
        "Hello World, this is a long sentence",
        "normal 12pt Arial"
      );
      expect(long.width).toBeGreaterThan(short.width);
    });

    it("accumulates height across newlines", () => {
      const one = getTextWidth("line", "normal 12pt Arial");
      const three = getTextWidth("line\nline\nline", "normal 12pt Arial");
      expect(three.height).toBeGreaterThan(one.height);
    });
  });

  describe("getBBox", () => {
    it("should extract bounding box from SVG path", () => {
      const bbox = getBBox({ path: "M 10 20 L 100 80 L 50 150" });
      expect(bbox.x).toBe(10);
      expect(bbox.y).toBe(20);
      expect(bbox.width).toBe(90); // 100 - 10
      expect(bbox.height).toBe(130); // 150 - 20
    });

    it("returns the Raphael-style bbox with x2/y2/cx/cy", () => {
      const bbox = getBBox({ path: "M0,0 L100,50" });
      expect(bbox.x2).toBe(100);
      expect(bbox.y2).toBe(50);
      expect(bbox.cx).toBe(50);
      expect(bbox.cy).toBe(25);
    });

    it("should return default for invalid path", () => {
      const bbox = getBBox({ path: "" });
      expect(bbox).toMatchObject({ x: 0, y: 0, width: 100, height: 100 });
    });

    it("computes curve extrema analytically (not just anchor points)", () => {
      // Half circle via cubic approx bulging to y=-40ish; bbox must
      // extend beyond the anchor points' y=0 line
      const bbox = getBBox({ path: "M0,0 C0,-53.3 100,-53.3 100,0" });
      expect(bbox.y).toBeLessThan(-30);
      expect(bbox.height).toBeGreaterThan(30);
    });

    it("should handle negative coordinates", () => {
      const bbox = getBBox({ path: "M -50 -30 L 50 30" });
      expect(bbox.x).toBe(-50);
      expect(bbox.y).toBe(-30);
      expect(bbox.width).toBe(100);
      expect(bbox.height).toBe(60);
    });
  });

  describe("createMultiLineText (v1 contract: lineCount → \\n-joined string)", () => {
    it("splits text into the requested number of lines", () => {
      const out = createMultiLineText(
        "one two three four five six seven eight",
        2
      );
      expect(typeof out).toBe("string");
      expect(out.split("\n").length).toBeLessThanOrEqual(2);
      expect(out.split("\n").length).toBeGreaterThan(1);
    });

    it("returns the original text for a single line", () => {
      expect(createMultiLineText("Hi there", 1)).toBe("Hi there");
    });

    it("matches v1 byte-for-byte, including the leading newline the app trims", () => {
      // v1's algorithm pushes an empty first line when the first word
      // already exceeds charsPerLine — the Meteor app compensates with
      // .trim(); preserving this exactly is intentional.
      expect(createMultiLineText("hello world", 3)).toBe("\nhello\nworld");
      expect(createMultiLineText("hello world", 3).trim()).toBe(
        "hello\nworld"
      );
    });
  });

  describe("randomInt", () => {
    it("should return integer between min and max inclusive", () => {
      for (let i = 0; i < 100; i++) {
        const val = randomInt(5, 10);
        expect(val).toBeGreaterThanOrEqual(5);
        expect(val).toBeLessThanOrEqual(10);
        expect(Number.isInteger(val)).toBe(true);
      }
    });

    it("should return min when min === max", () => {
      expect(randomInt(7, 7)).toBe(7);
    });
  });

  describe("obtainProportionateWidthAndHeightForResizing", () => {
    it("should preserve aspect ratio by default", () => {
      const result = obtainProportionateWidthAndHeightForResizing(
        200, 100, 100, 100
      );
      // 200:100 = 2:1 ratio, target is 100x100
      // Scale factor min(100/200, 100/100) = min(0.5, 1) = 0.5
      expect(result.width).toBe(100);
      expect(result.height).toBe(50);
    });

    it("should not preserve aspect ratio when flag is false", () => {
      const result = obtainProportionateWidthAndHeightForResizing(
        200, 100, 300, 400, false
      );
      expect(result.width).toBe(300);
      expect(result.height).toBe(400);
    });
  });

  describe("safeForUrls", () => {
    it("should convert text to URL-safe format", () => {
      expect(safeForUrls("Hello World")).toBe("hello-world");
    });

    it("should remove special characters", () => {
      expect(safeForUrls("Hello, World!")).toBe("hello-world");
    });

    it("should handle multiple spaces", () => {
      expect(safeForUrls("hello   world")).toBe("hello-world");
    });
  });

  describe("isElement", () => {
    it("should return true for DOM elements", () => {
      const div = document.createElement("div");
      expect(isElement(div)).toBe(true);
    });

    it("should return false for non-elements", () => {
      expect(isElement("string")).toBe(false);
      expect(isElement(123)).toBe(false);
      expect(isElement(null)).toBe(false);
    });
  });

  describe("stopEvent", () => {
    it("should call preventDefault and stopPropagation", () => {
      const evt = {
        preventDefault: () => {},
        stopPropagation: () => {},
      } as unknown as Event;

      const spy1 = vi.spyOn(evt, "preventDefault");
      const spy2 = vi.spyOn(evt, "stopPropagation");

      stopEvent(evt);

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it("should handle null event gracefully", () => {
      expect(() => stopEvent(null as any)).not.toThrow();
    });
  });

  describe("chunk", () => {
    it("should split array into chunks", () => {
      expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
    });

    it("should handle exact division", () => {
      expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });

    it("should handle chunk size larger than array", () => {
      expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
    });

    it("should handle empty array", () => {
      expect(chunk([], 3)).toEqual([]);
    });
  });

  describe("_transformPath (v1 Raphael.transformPath parity)", () => {
    it("translates a path with T dx,dy", () => {
      const out = _transformPath("M0,0 L100,0 L100,50 L0,50 Z", "T10,20");
      const bbox = getBBox({ path: out });
      expect(bbox.x).toBeCloseTo(10, 5);
      expect(bbox.y).toBeCloseTo(20, 5);
      expect(bbox.width).toBeCloseTo(100, 5);
      expect(bbox.height).toBeCloseTo(50, 5);
    });

    it("returns a curve-ified path string (M + C commands)", () => {
      const out = _transformPath("M0,0 L10,10", "T0,0");
      expect(out.startsWith("M")).toBe(true);
      expect(out).toContain("C");
      // No residual L/H/V commands — Raphael curve-ifies everything
      expect(out).not.toMatch(/[LHV]/);
    });

    it("scales around the bbox center by default (s2,2)", () => {
      const out = _transformPath("M0,0 L100,0 L100,50 L0,50 Z", "s2,2");
      const bbox = getBBox({ path: out });
      // center stays (50,25); size doubles
      expect(bbox.width).toBeCloseTo(200, 4);
      expect(bbox.height).toBeCloseTo(100, 4);
      expect(bbox.cx).toBeCloseTo(50, 4);
      expect(bbox.cy).toBeCloseTo(25, 4);
    });

    it("scales around an explicit center (s2,2,0,0)", () => {
      const out = _transformPath("M10,10 L20,10 L20,20 L10,20 Z", "s2,2,0,0");
      const bbox = getBBox({ path: out });
      expect(bbox.x).toBeCloseTo(20, 4);
      expect(bbox.y).toBeCloseTo(20, 4);
      expect(bbox.width).toBeCloseTo(20, 4);
    });

    it("supports compound transforms (T then s) like the app's theme code", () => {
      const out = _transformPath("M0,0 L100,0 L100,100 L0,100 Z", "T50,50 s0.5,0.5");
      const bbox = getBBox({ path: out });
      // translate to (50..150), then scale 0.5 about center (100,100)
      expect(bbox.cx).toBeCloseTo(100, 4);
      expect(bbox.cy).toBeCloseTo(100, 4);
      expect(bbox.width).toBeCloseTo(50, 4);
    });

    it("rotates around the bbox center with r90", () => {
      const out = _transformPath("M0,0 L100,0 L100,50 L0,50 Z", "r90");
      const bbox = getBBox({ path: out });
      // 100x50 rect rotated 90° → 50x100, same center
      expect(bbox.width).toBeCloseTo(50, 4);
      expect(bbox.height).toBeCloseTo(100, 4);
      expect(bbox.cx).toBeCloseTo(50, 4);
      expect(bbox.cy).toBeCloseTo(25, 4);
    });

    it("handles arcs by converting to cubics", () => {
      const out = _transformPath("M0,0 A50,50 0 0 1 100,0", "T0,0");
      expect(out).toContain("C");
      const bbox = getBBox({ path: out });
      expect(bbox.width).toBeCloseTo(100, 1);
    });
  });

  describe("browser detection (in jsdom)", () => {
    it("isSafari should return false in jsdom", () => {
      expect(isSafari()).toBe(false);
    });

    it("isMobile should return false in jsdom", () => {
      expect(isMobile()).toBe(false);
    });
  });
});
