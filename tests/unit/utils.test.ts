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
    it("should return a positive number", () => {
      const width = getTextWidth("Hello World");
      expect(width).toBeGreaterThan(0);
    });

    it("should return wider for longer text", () => {
      const short = getTextWidth("Hi");
      const long = getTextWidth("Hello World, this is a long sentence");
      expect(long).toBeGreaterThan(short);
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

    it("should return default for invalid path", () => {
      const bbox = getBBox({ path: "" });
      expect(bbox).toEqual({ x: 0, y: 0, width: 100, height: 100 });
    });

    it("should handle negative coordinates", () => {
      const bbox = getBBox({ path: "M -50 -30 L 50 30" });
      expect(bbox.x).toBe(-50);
      expect(bbox.y).toBe(-30);
      expect(bbox.width).toBe(100);
      expect(bbox.height).toBe(60);
    });
  });

  describe("createMultiLineText", () => {
    it("should split text into multiple lines", () => {
      const lines = createMultiLineText(
        "This is a really long sentence that should wrap",
        100
      );
      expect(lines.length).toBeGreaterThanOrEqual(1);
    });

    it("should return single line for short text", () => {
      const lines = createMultiLineText("Hi", 500);
      expect(lines).toEqual(["Hi"]);
    });

    it("should handle empty text", () => {
      const lines = createMultiLineText("", 100);
      expect(lines).toEqual([]);
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

  describe("browser detection (in jsdom)", () => {
    it("isSafari should return false in jsdom", () => {
      expect(isSafari()).toBe(false);
    });

    it("isMobile should return false in jsdom", () => {
      expect(isMobile()).toBe(false);
    });
  });
});
