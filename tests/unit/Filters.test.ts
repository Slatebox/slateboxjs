import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  Filters,
  registerFilter,
  getFilterNames,
  type FilterDef,
} from "../../src/core/Filters";

describe("Filters", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {},
      backgroundRect: {
        attr: vi.fn().mockReturnThis(),
        stroke: vi.fn().mockReturnThis(),
        data: vi.fn().mockReturnValue("#ccc"),
      },
      textElement: {
        attr: vi.fn().mockReturnThis(),
        stroke: vi.fn().mockReturnThis(),
        data: vi.fn().mockReturnValue("#ccc"),
      },
    };
  });

  describe("apply", () => {
    it("should apply a filter to both background and text by default", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow");

      expect(mockNode.backgroundRect.attr).toHaveBeenCalled();
      expect(mockNode.textElement.attr).toHaveBeenCalled();
      expect(filters.isActive("dropShadow")).toBe(true);
    });

    it("should apply filter only to vect target", () => {
      const filters = new Filters(mockNode);
      filters.apply("blur", "vect");

      expect(mockNode.backgroundRect.attr).toHaveBeenCalled();
      // textElement should not be called for vect-only
    });

    it("should track active filters", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow");
      filters.apply("blur");

      expect(filters.getActive()).toContain("dropShadow");
      expect(filters.getActive()).toContain("blur");
    });

    it("should warn for unknown filter", () => {
      const filters = new Filters(mockNode);
      filters.apply("nonexistent");
      expect(console.warn).toHaveBeenCalled();
    });

    it("should store filter in node options", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow", "vect");

      expect(mockNode.options.filters.vect).toBe("dropShadow");
    });
  });

  describe("remove", () => {
    it("should remove a specific filter", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow");
      filters.remove("dropShadow");

      expect(filters.isActive("dropShadow")).toBe(false);
    });
  });

  describe("removeAll", () => {
    it("should remove all active filters", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow");
      filters.apply("blur");
      filters.removeAll();

      expect(filters.getActive()).toHaveLength(0);
    });
  });

  describe("toggleVisibility", () => {
    it("should hide and re-show filters", () => {
      const filters = new Filters(mockNode);
      filters.apply("dropShadow");

      // Hide
      filters.toggleVisibility(true);
      // Filters are still "active" but visually hidden
      expect(filters.isActive("dropShadow")).toBe(true);

      // Show again
      filters.toggleVisibility(false);
      expect(filters.isActive("dropShadow")).toBe(true);
    });
  });

  describe("registerFilter / getFilterNames", () => {
    it("should include built-in filters", () => {
      const names = getFilterNames();
      expect(names).toContain("dropShadow");
      expect(names).toContain("blur");
      expect(names).toContain("outline");
    });

    it("should allow registering custom filters", () => {
      const customFilter: FilterDef = {
        name: "testGlow",
        apply: vi.fn(),
        remove: vi.fn(),
      };

      registerFilter(customFilter);
      expect(getFilterNames()).toContain("testGlow");

      // Now use it
      const filters = new Filters(mockNode);
      filters.apply("testGlow");
      expect(customFilter.apply).toHaveBeenCalled();
    });
  });
});
