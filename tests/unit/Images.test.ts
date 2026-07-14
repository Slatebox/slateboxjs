import { describe, it, expect, vi, beforeEach } from "vitest";
import { Images } from "../../src/core/Images";

describe("Images", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {
        width: 100,
        height: 60,
        backgroundColor: "#f0f0f0",
      },
      backgroundRect: {
        fill: vi.fn(),
      },
      svgGroup: {
        root: vi.fn().mockReturnValue({
          defs: vi.fn().mockReturnValue({
            pattern: vi.fn().mockReturnValue({
              attr: vi.fn().mockReturnThis(),
              remove: vi.fn(),
            }),
          }),
        }),
      },
    };
  });

  describe("hasImage", () => {
    it("should return false initially", () => {
      const images = new Images(mockNode);
      expect(images.hasImage()).toBe(false);
    });
  });

  describe("set", () => {
    it("should mark image as set", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png");

      expect(images.hasImage()).toBe(true);
    });

    it("should store image URL in node options", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png", 200, 150);

      expect(mockNode.options.image).toBe("https://example.com/img.png");
      expect(mockNode.options.imageOrigWidth).toBe(200);
      expect(mockNode.options.imageOrigHeight).toBe(150);
    });

    it("should use node dimensions as defaults", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png");

      expect(mockNode.options.imageOrigWidth).toBe(100);
      expect(mockNode.options.imageOrigHeight).toBe(60);
    });
  });

  describe("clear", () => {
    it("should clear the image", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png");
      images.clear();

      expect(images.hasImage()).toBe(false);
      expect(mockNode.options.image).toBeUndefined();
    });

    it("should restore background fill", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png");
      images.clear();

      expect(mockNode.backgroundRect.fill).toHaveBeenCalledWith("#f0f0f0");
    });
  });

  describe("update", () => {
    it("should re-render if image is set", () => {
      const images = new Images(mockNode);
      images.set("https://example.com/img.png");

      // Update should not throw
      expect(() => images.update()).not.toThrow();
    });

    it("should do nothing if no image is set", () => {
      const images = new Images(mockNode);
      expect(() => images.update()).not.toThrow();
    });
  });
});
