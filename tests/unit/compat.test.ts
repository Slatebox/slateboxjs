import { describe, it, expect } from "vitest";
import {
  v1NodeToV2,
  v2NodeToV1,
  v1AssociationToV2,
  v2AssociationToV1,
  v1SlateToV2,
  v2SlateToV1,
  convertV1JsonToV2,
  convertV2JsonToV1,
} from "../../src/core/compat";

describe("compat - v1/v2 property mapping", () => {
  describe("v1NodeToV2", () => {
    it("should convert xPos/yPos to x/y", () => {
      const v2 = v1NodeToV2({ xPos: 100, yPos: 200 });
      expect(v2.x).toBe(100);
      expect(v2.y).toBe(200);
      expect((v2 as any).xPos).toBeUndefined();
      expect((v2 as any).yPos).toBeUndefined();
    });

    it("should convert foregroundColor to fontColor", () => {
      const v2 = v1NodeToV2({ foregroundColor: "#ff0000" });
      expect(v2.fontColor).toBe("#ff0000");
      expect((v2 as any).foregroundColor).toBeUndefined();
    });

    it("should convert shapeHint to shape", () => {
      const v2 = v1NodeToV2({ shapeHint: "rect" });
      expect(v2.shape).toBe("rectangle");
      expect((v2 as any).shapeHint).toBeUndefined();
    });

    it("should convert svgString to svgContent", () => {
      const svg = '<svg><circle r="10"/></svg>';
      const v2 = v1NodeToV2({ svgString: svg });
      expect(v2.svgContent).toBe(svg);
      expect((v2 as any).svgString).toBeUndefined();
    });

    it("should convert blnStraight to isStraightLine", () => {
      const v2 = v1NodeToV2({ blnStraight: true });
      expect((v2 as any).isStraightLine).toBe(true);
      expect((v2 as any).blnStraight).toBeUndefined();
    });

    it("should not override existing v2 properties", () => {
      const v2 = v1NodeToV2({ xPos: 100, x: 200 });
      expect(v2.x).toBe(200); // x takes precedence over xPos
    });

    it("should preserve non-mapped properties as-is", () => {
      const v2 = v1NodeToV2({ text: "Hello", width: 150, id: "abc" });
      expect(v2.text).toBe("Hello");
      expect(v2.width).toBe(150);
      expect(v2.id).toBe("abc");
    });

    it("should handle shape hint mapping for all known shapes", () => {
      const hints = [
        "rect", "rectangle", "roundedrectangle", "ellipse", "circle",
        "star", "trapezium", "triangle", "pentagon", "parallelogram",
        "octagon", "hexagon", "rarrow", "larrow", "diamond",
      ];
      for (const hint of hints) {
        const v2 = v1NodeToV2({ shapeHint: hint });
        expect(v2.shape).toBeDefined();
      }
    });

    it("should pass through unknown shapeHint as-is", () => {
      const v2 = v1NodeToV2({ shapeHint: "customShape42" });
      expect(v2.shape).toBe("customShape42");
    });

    it("should handle empty shapeHint", () => {
      const v2 = v1NodeToV2({ shapeHint: "" });
      expect(v2.shape).toBe("");
    });

    it("should map blnStraight: false as false", () => {
      const v2 = v1NodeToV2({ blnStraight: false });
      expect((v2 as any).isStraightLine).toBe(false);
    });

    it("should handle empty input gracefully", () => {
      const v2 = v1NodeToV2({});
      expect(v2).toBeDefined();
      expect(Object.keys(v2).length).toBe(0);
    });
  });

  describe("v2NodeToV1", () => {
    it("should add xPos/yPos from x/y", () => {
      const v1 = v2NodeToV1({ x: 100, y: 200 });
      expect(v1.xPos).toBe(100);
      expect(v1.yPos).toBe(200);
    });

    it("should add foregroundColor from fontColor", () => {
      const v1 = v2NodeToV1({ fontColor: "#00ff00" });
      expect(v1.foregroundColor).toBe("#00ff00");
    });

    it("should add shapeHint from shape", () => {
      const v1 = v2NodeToV1({ shape: "star" } as any);
      expect(v1.shapeHint).toBe("star");
    });

    it("should add svgString from svgContent", () => {
      const svg = '<svg><rect width="10" height="10"/></svg>';
      const v1 = v2NodeToV1({ svgContent: svg } as any);
      expect(v1.svgString).toBe(svg);
    });

    it("should handle empty v2 input", () => {
      const v1 = v2NodeToV1({});
      expect(v1).toBeDefined();
      // xPos/yPos still added but undefined
      expect(v1.xPos).toBeUndefined();
      expect(v1.yPos).toBeUndefined();
    });

    it("should preserve unknown properties in v2→v1", () => {
      const v1 = v2NodeToV1({ customProp: "keep me" } as any);
      expect(v1.customProp).toBe("keep me");
    });

    it("should pass through shape without mapping as shapeHint", () => {
      const v1 = v2NodeToV1({ shape: "diamond" } as any);
      expect(v1.shapeHint).toBe("diamond");
    });
  });

  describe("v1AssociationToV2", () => {
    it("should create a complete V2Association with defaults", () => {
      const v2 = v1AssociationToV2({
        parentId: "p1",
        childId: "c1",
      });

      expect(v2.parentId).toBe("p1");
      expect(v2.childId).toBe("c1");
      expect(v2.id).toBe("p1->c1");
      expect(v2.lineColor).toBe("#666666");
      expect(v2.lineOpacity).toBe(1);
      expect(v2.lineType).toBe("bezier");
      expect(v2.lineCurveType).toBe("cubic");
      expect(v2.lineCurviness).toBe(0.1);
      expect(v2.lineWidth).toBe(3);
      expect(v2.isStraightLine).toBe(false);
      expect(v2.showParentArrow).toBe(false);
      expect(v2.showChildArrow).toBe(true);
    });

    it("should map blnStraight to isStraightLine", () => {
      const v2 = v1AssociationToV2({
        parentId: "p", childId: "c", blnStraight: true,
      });
      expect(v2.isStraightLine).toBe(true);
    });

    it("should preserve explicit values", () => {
      const v2 = v1AssociationToV2({
        parentId: "p", childId: "c",
        lineColor: "#ff0000", lineWidth: 3, lineType: "straight",
      });
      expect(v2.lineColor).toBe("#ff0000");
      expect(v2.lineWidth).toBe(3);
      expect(v2.lineType).toBe("straight");
    });

    it("should map blnStraight: false to isStraightLine: false", () => {
      const v2 = v1AssociationToV2({
        parentId: "p", childId: "c", blnStraight: false,
      });
      expect(v2.isStraightLine).toBe(false);
    });

    it("should handle missing parentId/childId gracefully", () => {
      const v2 = v1AssociationToV2({});
      expect(v2.id).toBe("undefined->undefined");
      expect(v2.parentId).toBeUndefined();
      expect(v2.childId).toBeUndefined();
      // But defaults still apply to optional fields
      expect(v2.lineColor).toBe("#666666");
      expect(v2.lineWidth).toBe(3);
    });
  });

  describe("v2AssociationToV1", () => {
    it("should convert v2 association to v1 format", () => {
      const v1 = v2AssociationToV1({
        id: "p->c",
        parentId: "p",
        childId: "c",
        lineColor: "#000",
        lineOpacity: 1,
        lineEffect: "",
        lineType: "bezier",
        lineCurveType: "cubic",
        lineCurviness: 0.1,
        lineWidth: 6,
        isStraightLine: false,
        showParentArrow: false,
        showChildArrow: true,
      });

      expect(v1.parentId).toBe("p");
      expect(v1.childId).toBe("c");
      expect(v1.lineColor).toBe("#000");
      // v1 doesn't have id
      expect(v1.id).toBeUndefined();
    });
  });

  describe("round-trip conversion", () => {
    it("should preserve node data through v1→v2→v1 round-trip", () => {
      const original = {
        id: "node1",
        xPos: 100,
        yPos: 200,
        text: "Hello",
        foregroundColor: "#333",
        shapeHint: "star",
        width: 150,
        height: 80,
      };

      const v2 = v1NodeToV2(original);
      expect(v2.x).toBe(100);
      expect(v2.fontColor).toBe("#333");
      expect(v2.shape).toBe("star");

      const roundTripped = v2NodeToV1(v2);
      expect(roundTripped.xPos).toBe(100);
      expect(roundTripped.yPos).toBe(200);
      expect(roundTripped.foregroundColor).toBe("#333");
      expect(roundTripped.shapeHint).toBe("star");
      expect(roundTripped.text).toBe("Hello");
    });

    it("should preserve association data through v1→v2→v1 round-trip", () => {
      const original = {
        parentId: "p1",
        childId: "c1",
        lineColor: "#ff0000",
        lineWidth: 4,
        lineType: "straight",
      };

      const v2 = v1AssociationToV2(original);
      const roundTripped = v2AssociationToV1(v2);

      expect(roundTripped.parentId).toBe("p1");
      expect(roundTripped.childId).toBe("c1");
      expect(roundTripped.lineColor).toBe("#ff0000");
      expect(roundTripped.lineWidth).toBe(4);
      expect(roundTripped.lineType).toBe("straight");
    });

    it("should round-trip v1→v2→v1 with empty input", () => {
      const original = {};
      const v2 = v1NodeToV2(original);
      // V1->V2 pass-through preserves everything
      const roundTripped = v2NodeToV1(v2);
      // xPos/yPos added but undefined
      expect(roundTripped).toBeDefined();
    });

    it("should round-trip complete slate JSON with no nodes", () => {
      const v1Json = { options: { name: "Empty" }, nodes: [], shareId: "" };
      const v2 = convertV1JsonToV2(v1Json);
      const backToV1 = convertV2JsonToV1(v2);
      expect(backToV1.options.name).toBe("Empty");
      expect(backToV1.nodes).toHaveLength(0);
    });
  });

  describe("convertV1JsonToV2", () => {
    it("should convert a full v1 slate JSON to v2 format", () => {
      const v1Json = {
        options: { name: "Test Slate" },
        nodes: [
          {
            options: { id: "n1", xPos: 50, yPos: 100, foregroundColor: "#000" },
            relationships: {
              associations: [
                { parentId: "n1", childId: "n2", lineColor: "#333" },
              ],
            },
          },
          {
            options: { id: "n2", xPos: 200, yPos: 100 },
            relationships: { associations: [] },
          },
        ],
        shareId: "share123",
      };

      const v2 = convertV1JsonToV2(v1Json);

      expect(v2.shareId).toBe("share123");
      expect(v2.nodes).toHaveLength(2);
      expect(v2.nodes[0].options.x).toBe(50);
      expect(v2.nodes[0].options.fontColor).toBe("#000");
      expect(v2.nodes[0].relationships.associations).toHaveLength(1);
      expect(v2.nodes[0].relationships.associations[0].lineColor).toBe("#333");
    });

    it("should handle empty nodes array in v1 JSON", () => {
      const v2 = convertV1JsonToV2({ options: {}, nodes: [], shareId: "" });
      expect(v2.nodes).toHaveLength(0);
    });

    it("should handle missing nodes in v1 JSON", () => {
      const v2 = convertV1JsonToV2({ options: {} });
      expect(v2.nodes).toHaveLength(0);
    });

    it("should handle missing relationships in v1 JSON", () => {
      const v2 = convertV1JsonToV2({
        options: {},
        nodes: [{ options: { id: "n1" } }],
      });
      expect(v2.nodes[0].relationships.associations).toHaveLength(0);
    });
  });

  describe("convertV2JsonToV1", () => {
    it("should convert a v2 slate JSON to v1 format", () => {
      const v2Json = {
        options: { name: "Test" },
        nodes: [
          {
            options: { id: "n1", x: 50, y: 100, fontColor: "#000" },
            relationships: { associations: [] },
          },
        ],
        shareId: "abc",
      };

      const v1 = convertV2JsonToV1(v2Json);

      expect(v1.shareId).toBe("abc");
      expect(v1.nodes[0].options.xPos).toBe(50);
      expect(v1.nodes[0].options.yPos).toBe(100);
      expect(v1.nodes[0].options.foregroundColor).toBe("#000");
    });

    it("should handle empty nodes in v2→v1", () => {
      const v1 = convertV2JsonToV1({ options: {}, nodes: [] });
      expect(v1.nodes).toHaveLength(0);
    });

    it("should handle missing nodes in v2→v1", () => {
      const v1 = convertV2JsonToV1({ options: {} });
      expect(v1.nodes).toHaveLength(0);
    });
  });
});
