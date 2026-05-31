import { describe, it, expect, vi, beforeEach } from "vitest";
import { Editor } from "../../src/core/Editor";

// Mock the FontLoader module
vi.mock("../../src/core/FontLoader", () => ({
  loadFont: vi.fn().mockResolvedValue(undefined),
}));

describe("Editor", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {
        text: "Initial",
        fontSize: 14,
        fontFamily: "Arial, sans-serif",
        fontColor: "#000000",
        textOpacity: 1,
        textXAlign: "center",
        textYAlign: "middle",
        width: 150,
        height: 80,
      },
      textElement: {
        text: vi.fn(),
        font: vi.fn(),
        bbox: vi.fn().mockReturnValue({ width: 50, height: 20 }),
      },
      centerText: vi.fn(),
      slate: {
        options: {},
      },
    };
  });

  describe("get", () => {
    it("should return current text properties", () => {
      const editor = new Editor(mockNode);
      const props = editor.get();

      expect(props.text).toBe("Initial");
      expect(props.fontSize).toBe(14);
      expect(props.fontFamily).toBe("Arial, sans-serif");
      expect(props.fontColor).toBe("#000000");
      expect(props.textOpacity).toBe(1);
      expect(props.textXAlign).toBe("center");
      expect(props.textYAlign).toBe("middle");
    });

    it("should return defaults for missing options", () => {
      mockNode.options = {};
      const editor = new Editor(mockNode);
      const props = editor.get();

      expect(props.text).toBe("");
      expect(props.fontSize).toBe(14);
      expect(props.fontFamily).toBe("Arial, sans-serif");
    });
  });

  describe("set", () => {
    it("should update text content", async () => {
      const editor = new Editor(mockNode);
      await editor.set("New Text");

      expect(mockNode.options.text).toBe("New Text");
      expect(mockNode.textElement.text).toHaveBeenCalledWith("New Text");
    });

    it("should update font size", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Test", 20);

      expect(mockNode.options.fontSize).toBe(20);
    });

    it("should update font color", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Test", undefined, undefined, "#ff0000");

      expect(mockNode.options.fontColor).toBe("#ff0000");
    });

    it("should call centerText after setting text", async () => {
      const editor = new Editor(mockNode);
      await editor.set("Centered");

      expect(mockNode.centerText).toHaveBeenCalled();
    });

    it("should skip SVG content nodes (no textElement)", async () => {
      mockNode.textElement = undefined;
      const editor = new Editor(mockNode);
      await editor.set("Test");

      // Should not throw
      expect(mockNode.options.text).toBe("Test");
    });
  });

  describe("calculateAutoOffset", () => {
    it("should calculate offset for centering text in node", () => {
      const editor = new Editor(mockNode);
      const offset = editor.calculateAutoOffset();

      // (150 - 50) / 2 = 50, (80 - 20) / 2 = 30
      expect(offset.x).toBe(50);
      expect(offset.y).toBe(30);
    });

    it("should return {0,0} when no textElement", () => {
      mockNode.textElement = undefined;
      const editor = new Editor(mockNode);
      expect(editor.calculateAutoOffset()).toEqual({ x: 0, y: 0 });
    });
  });
});
