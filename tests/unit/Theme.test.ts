import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  applyTheme,
  buildNodeStyleFromTheme,
  type ThemeDefinition,
  type ThemeStyle,
} from "../../src/core/Theme";

describe("Theme", () => {
  let mockSlate: any;
  let testTheme: ThemeDefinition;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockSlate = {
      options: {},
      nodes: {
        allNodes: [
          {
            options: {},
            setColors: vi.fn(),
            textElement: { font: vi.fn() },
          },
          {
            options: {},
            setColors: vi.fn(),
            textElement: { font: vi.fn() },
          },
          {
            options: {},
            setColors: vi.fn(),
            textElement: { font: vi.fn() },
          },
        ],
      },
    };

    testTheme = {
      _id: "theme123",
      name: "Test Theme",
      containerStyle: { backgroundColor: "#1a1a1a" },
      defaultLineColor: "#888",
      styles: {
        parent: {
          backgroundColor: "#ff0000",
          borderColor: "#cc0000",
          fontColor: "#ffffff",
          fontSize: 18,
        },
        child_1: {
          backgroundColor: "#00ff00",
          borderColor: "#00cc00",
          fontColor: "#000000",
        },
        child_2: {
          backgroundColor: "#0000ff",
          borderColor: "#0000cc",
          fontColor: "#ffffff",
        },
      },
    };
  });

  describe("buildNodeStyleFromTheme", () => {
    it("should return parent style for index 0", () => {
      const style = buildNodeStyleFromTheme(testTheme, 0);
      expect(style).toBeDefined();
      expect(style!.backgroundColor).toBe("#ff0000");
      expect(style!.fontColor).toBe("#ffffff");
    });

    it("should return child_1 style for index 1", () => {
      const style = buildNodeStyleFromTheme(testTheme, 1);
      expect(style!.backgroundColor).toBe("#00ff00");
    });

    it("should return child_2 style for index 2", () => {
      const style = buildNodeStyleFromTheme(testTheme, 2);
      expect(style!.backgroundColor).toBe("#0000ff");
    });

    it("should cycle child styles for higher indices", () => {
      const style3 = buildNodeStyleFromTheme(testTheme, 3);
      const style1 = buildNodeStyleFromTheme(testTheme, 1);
      expect(style3!.backgroundColor).toBe(style1!.backgroundColor);
    });

    it("should return null for theme with no styles", () => {
      expect(buildNodeStyleFromTheme({}, 0)).toBeNull();
    });

    it("should fall back to parent when no child styles exist", () => {
      const parentOnly: ThemeDefinition = {
        styles: { parent: { backgroundColor: "#aaa" } },
      };
      const style = buildNodeStyleFromTheme(parentOnly, 1);
      expect(style!.backgroundColor).toBe("#aaa");
    });
  });

  describe("applyTheme", () => {
    it("should set themeId on slate options", () => {
      applyTheme(mockSlate, testTheme);
      expect(mockSlate.options.themeId).toBe("theme123");
    });

    it("should apply container background color", () => {
      applyTheme(mockSlate, testTheme);
      expect(mockSlate.options.containerStyle.backgroundColor).toBe("#1a1a1a");
    });

    it("should apply default line color", () => {
      applyTheme(mockSlate, testTheme);
      expect(mockSlate.options.defaultLineColor).toBe("#888");
    });

    it("should apply styles to nodes", () => {
      applyTheme(mockSlate, testTheme);

      // First node gets parent style
      expect(mockSlate.nodes.allNodes[0].options.backgroundColor).toBe("#ff0000");
      // Second node gets child_1
      expect(mockSlate.nodes.allNodes[1].options.backgroundColor).toBe("#00ff00");
      // Third node gets child_2
      expect(mockSlate.nodes.allNodes[2].options.backgroundColor).toBe("#0000ff");
    });

    it("should apply a complete saved app style, including shape and effects", () => {
      const node = mockSlate.nodes.allNodes[0];
      Object.assign(node, {
        setShape: vi.fn(),
        applyBorder: vi.fn(),
        applyOpacity: vi.fn(),
        applyTextStyle: vi.fn(),
        images: { clear: vi.fn(), set: vi.fn() },
        filters: { removeAll: vi.fn(), apply: vi.fn() },
        relationships: { updateAssociationsWith: vi.fn() },
      });
      const path = "M0 0L100 0L50 100Z";
      testTheme.styles!.parent = {
        vectorPath: path,
        image: "data:image/png;base64,theme",
        backgroundColor: "#112233",
        foregroundColor: "#fefefe",
        opacity: 0.7,
        borderColor: "#445566",
        borderWidth: 5,
        borderStyle: "dashed",
        borderOpacity: 0.8,
        fontFamily: "Bangers",
        fontSize: 24,
        textOpacity: 0.9,
        lineColor: "#abcdef",
        lineWidth: 7,
        filters: { vect: "postItNote", text: "dropShadow" },
      };

      applyTheme(mockSlate, testTheme);

      expect(node.setShape).toHaveBeenCalledWith(path, path);
      expect(node.options).toMatchObject({
        backgroundColor: "#112233",
        fontColor: "#fefefe",
        opacity: 0.7,
        borderColor: "#445566",
        borderWidth: 5,
        borderStyle: "dashed",
        borderOpacity: 0.8,
        fontFamily: "Bangers",
        fontSize: 24,
        textOpacity: 0.9,
        lineColor: "#abcdef",
        lineWidth: 7,
      });
      expect(node.applyBorder).toHaveBeenCalled();
      expect(node.applyOpacity).toHaveBeenCalled();
      expect(node.applyTextStyle).toHaveBeenCalled();
      expect(node.images.set).toHaveBeenCalledWith(
        "data:image/png;base64,theme"
      );
      expect(node.filters.apply).toHaveBeenCalledWith("postItNote", "vect");
      expect(node.filters.apply).toHaveBeenCalledWith("dropShadow", "text");
      expect(node.relationships.updateAssociationsWith).toHaveBeenCalledWith({
        lineColor: "#abcdef",
        lineWidth: 7,
      });
    });

    it("should call setColors on nodes", () => {
      applyTheme(mockSlate, testTheme);
      expect(mockSlate.nodes.allNodes[0].setColors).toHaveBeenCalledWith(
        "#ff0000", "#cc0000"
      );
    });

    it("should set syncWithTheme when requested", () => {
      applyTheme(mockSlate, testTheme, true);
      expect(mockSlate.options.syncWithTheme).toBe(true);
    });

    it("should handle null theme gracefully", () => {
      expect(() => applyTheme(mockSlate, null as any)).not.toThrow();
    });

    it("should handle empty nodes", () => {
      mockSlate.nodes.allNodes = [];
      expect(() => applyTheme(mockSlate, testTheme)).not.toThrow();
    });
  });
});
