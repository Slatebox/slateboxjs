import { describe, it, expect } from "vitest";
import {
  createDefaultAssociation,
  type Association,
} from "../../src/core/Relationship";

describe("Relationship", () => {
  describe("createDefaultAssociation", () => {
    it("should create an association with default values", () => {
      const assoc = createDefaultAssociation("parent1", "child1");

      expect(assoc.id).toBe("parent1->child1");
      expect(assoc.parentId).toBe("parent1");
      expect(assoc.childId).toBe("child1");
      expect(assoc.lineColor).toBe("#000");
      expect(assoc.lineOpacity).toBe(1);
      expect(assoc.lineEffect).toBe("");
      expect(assoc.lineType).toBe("bezier");
      expect(assoc.lineCurveType).toBe("cubic");
      expect(assoc.lineCurviness).toBe(0.1);
      expect(assoc.lineWidth).toBe(3);
      expect(assoc.isStraightLine).toBe(false);
      expect(assoc.showParentArrow).toBe(false);
      expect(assoc.showChildArrow).toBe(true);
    });

    it("should accept overrides for specific properties", () => {
      const assoc = createDefaultAssociation("p", "c", {
        lineColor: "#ff0000",
        lineWidth: 3,
        isStraightLine: true,
      });

      expect(assoc.lineColor).toBe("#ff0000");
      expect(assoc.lineWidth).toBe(3);
      expect(assoc.isStraightLine).toBe(true);
      // Non-overridden remain defaults
      expect(assoc.lineType).toBe("bezier");
    });

    it("should allow overriding the id", () => {
      const assoc = createDefaultAssociation("p", "c", { id: "custom-id" });
      expect(assoc.id).toBe("custom-id");
    });
  });
});
