import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  removeLayoutOverlaps,
  applyLayout,
  packageLayout,
  type LayoutMove,
} from "../../src/core/Layout";

describe("Layout", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  describe("removeLayoutOverlaps", () => {
    it("should push overlapping nodes apart", () => {
      const nodes = [
        { options: { x: 100, y: 100, width: 100, height: 60 }, position: vi.fn() },
        { options: { x: 120, y: 110, width: 100, height: 60 }, position: vi.fn() },
      ];

      // position mock updates options
      nodes.forEach((n) => {
        n.position.mockImplementation((x: number, y: number) => {
          n.options.x = x;
          n.options.y = y;
        });
      });

      mockSlate = { nodes: { allNodes: nodes } };
      removeLayoutOverlaps(mockSlate);

      // Nodes should have moved apart
      expect(nodes[0].position).toHaveBeenCalled();
      expect(nodes[1].position).toHaveBeenCalled();
    });

    it("should not modify non-overlapping nodes", () => {
      const nodes = [
        { options: { x: 0, y: 0, width: 50, height: 50 }, position: vi.fn() },
        { options: { x: 200, y: 200, width: 50, height: 50 }, position: vi.fn() },
      ];

      mockSlate = { nodes: { allNodes: nodes } };
      removeLayoutOverlaps(mockSlate);

      // Far-apart nodes shouldn't be modified
      expect(nodes[0].position).not.toHaveBeenCalled();
    });

    it("should handle single node", () => {
      const nodes = [
        { options: { x: 100, y: 100, width: 100, height: 60 }, position: vi.fn() },
      ];

      mockSlate = { nodes: { allNodes: nodes } };
      expect(() => removeLayoutOverlaps(mockSlate)).not.toThrow();
      expect(nodes[0].position).not.toHaveBeenCalled();
    });

    it("should handle empty nodes array", () => {
      mockSlate = { nodes: { allNodes: [] } };
      expect(() => removeLayoutOverlaps(mockSlate)).not.toThrow();
    });
  });

  describe("packageLayout", () => {
    it("should return layout moves for all nodes", () => {
      mockSlate = {
        nodes: {
          allNodes: [
            { id: "n1", options: { x: 10, y: 20 } },
            { id: "n2", options: { x: 30, y: 40 } },
          ],
        },
      };

      const moves = packageLayout(mockSlate);
      expect(moves).toHaveLength(2);
      expect(moves[0]).toEqual({ id: "n1", x: 10, y: 20 });
      expect(moves[1]).toEqual({ id: "n2", x: 30, y: 40 });
    });

    it("should default missing coordinates to 0", () => {
      mockSlate = {
        nodes: { allNodes: [{ id: "n1", options: {} }] },
      };
      const moves = packageLayout(mockSlate);
      expect(moves[0]).toEqual({ id: "n1", x: 0, y: 0 });
    });
  });

  describe("applyLayout", () => {
    it("should position nodes according to moves", () => {
      const n1 = { position: vi.fn() };
      mockSlate = {
        nodes: {
          one: vi.fn((id) => {
            if (id === "n1") return n1;
            return null;
          }),
        },
      };

      const moves: LayoutMove[] = [{ id: "n1", x: 50, y: 60 }];
      applyLayout(mockSlate, moves, undefined, true);

      expect(n1.position).toHaveBeenCalledWith(50, 60, expect.any(Function), undefined, 0);
    });

    it("should call callback when all moves complete for empty list", () => {
      mockSlate = { nodes: { one: vi.fn() } };
      const cb = vi.fn();
      applyLayout(mockSlate, [], cb);
      expect(cb).toHaveBeenCalled();
    });

    it("should skip unknown node IDs", () => {
      mockSlate = {
        nodes: { one: vi.fn().mockReturnValue(null) },
      };
      const moves: LayoutMove[] = [{ id: "unknown", x: 0, y: 0 }];
      expect(() => applyLayout(mockSlate, moves)).not.toThrow();
    });
  });
});
