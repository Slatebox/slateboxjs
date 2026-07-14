import { describe, it, expect, vi, beforeEach } from "vitest";
import { Grid } from "../../src/core/Grid";

describe("Grid", () => {
  let mockSlate: any;

  beforeEach(() => {
    mockSlate = {
      canvas: {
        viewbox: () => ({ x: 0, y: 0, width: 800, height: 600 }),
        group: vi.fn().mockReturnValue({
          attr: vi.fn().mockReturnThis(),
          line: vi.fn().mockReturnValue({
            stroke: vi.fn().mockReturnThis(),
          }),
          back: vi.fn(),
          remove: vi.fn(),
        }),
      },
    };
  });

  describe("constructor", () => {
    it("should have sensible defaults", () => {
      const grid = new Grid(mockSlate);
      expect(grid.isShown()).toBe(false);
    });
  });

  describe("show/hide/toggle", () => {
    it("should toggle visibility", () => {
      const grid = new Grid(mockSlate);

      grid.show();
      expect(grid.isShown()).toBe(true);

      grid.hide();
      expect(grid.isShown()).toBe(false);
    });

    it("should toggle correctly", () => {
      const grid = new Grid(mockSlate);

      grid.toggle();
      expect(grid.isShown()).toBe(true);

      grid.toggle();
      expect(grid.isShown()).toBe(false);
    });

    it("should not double-show", () => {
      const grid = new Grid(mockSlate);
      grid.show();
      grid.show(); // Idempotent
      expect(grid.isShown()).toBe(true);
    });
  });

  describe("snapPoint", () => {
    it("should snap coordinates to grid with snapToGrid enabled", () => {
      const grid = new Grid(mockSlate, { snapToGrid: true, gridSize: 20 });
      expect(grid.snapPoint(13, 27)).toEqual({ x: 20, y: 20 });
      expect(grid.snapPoint(30, 50)).toEqual({ x: 40, y: 60 });
      // Exact grid points stay
      expect(grid.snapPoint(20, 40)).toEqual({ x: 20, y: 40 });
    });

    it("should return original coordinates when snapToGrid is disabled", () => {
      const grid = new Grid(mockSlate, { snapToGrid: false });
      expect(grid.snapPoint(13, 27)).toEqual({ x: 13, y: 27 });
    });

    it("should snap to different grid sizes", () => {
      const grid = new Grid(mockSlate, { snapToGrid: true, gridSize: 10 });
      expect(grid.snapPoint(14, 26)).toEqual({ x: 10, y: 30 });
    });
  });

  describe("updateOptions", () => {
    it("should merge new options", () => {
      const grid = new Grid(mockSlate, { gridSize: 20 });
      grid.updateOptions({ gridSize: 50 });
      // With snapToGrid enabled, snap should use new grid size
      grid.updateOptions({ snapToGrid: true });
      expect(grid.snapPoint(40, 40)).toEqual({ x: 50, y: 50 });
    });

    it("should re-render grid if visible", () => {
      const grid = new Grid(mockSlate);
      grid.show();
      // updateOptions should hide and re-show
      grid.updateOptions({ gridSize: 30 });
      expect(grid.isShown()).toBe(true);
    });
  });

  describe("destroy", () => {
    it("should hide and clean up", () => {
      const grid = new Grid(mockSlate);
      grid.show();
      grid.destroy();
      expect(grid.isShown()).toBe(false);
    });
  });
});
