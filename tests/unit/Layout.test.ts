import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  removeLayoutOverlaps,
  applyLayout,
  packageLayout,
  type LayoutMove,
} from "../../src/core/Layout";
import { tidyPositions } from "../../src/operations/layout";

describe("Layout", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
  });

  // RESTATED (P10): Optimize Layout is the shared tidy layout
  // (operations/layout tidyPositions), the one arrange_nodes "tidy" uses. It
  // leaves no overlap, keeps locked notes where they are, and broadcasts one
  // onNodesMove so the change is saved and reaches collaborators. The old
  // pairwise push (with its optional pull toward the centre) could end with
  // notes still overlapping and was never saved.
  describe("removeLayoutOverlaps", () => {
    const makeNode = (id: string, x: number, y: number, extra: Record<string, any> = {}) => {
      const n: any = { id, options: { id, x, y, width: 100, height: 60, ...extra }, position: vi.fn() };
      n.position.mockImplementation((nx: number, ny: number) => {
        n.options.x = nx;
        n.options.y = ny;
      });
      return n;
    };
    const overlaps = (nodes: any[]) =>
      nodes.some((a, i) =>
        nodes.slice(i + 1).some((b) =>
          a.options.x < b.options.x + b.options.width && a.options.x + a.options.width > b.options.x &&
          a.options.y < b.options.y + b.options.height && a.options.y + a.options.height > b.options.y));

    it("moves notes apart until none overlaps, through the shared tidy layout, and saves the move", () => {
      const nodes = [makeNode("a", 100, 100), makeNode("b", 100, 100), makeNode("c", 120, 110), makeNode("d", 140, 90)];
      const broadcast = vi.fn();
      mockSlate = { nodes: { allNodes: nodes }, broadcast };
      const expected = tidyPositions(
        nodes.map((n) => ({ id: n.id, x: n.options.x, y: n.options.y, width: 100, height: 60 })),
        [],
        { gap: 20 },
      );
      removeLayoutOverlaps(mockSlate);
      expect(overlaps(nodes)).toBe(false);
      expect(nodes.map((n) => ({ id: n.id, x: n.options.x, y: n.options.y }))).toEqual(expected);
      expect(broadcast).toHaveBeenCalledTimes(1);
      expect(broadcast).toHaveBeenCalledWith("onNodesMove", { nodes: expected });
    });

    it("leaves a locked note where it is and moves the others round it", () => {
      const nodes = [makeNode("lock", 100, 100, { isLocked: true }), makeNode("b", 110, 110)];
      mockSlate = { nodes: { allNodes: nodes }, broadcast: vi.fn() };
      removeLayoutOverlaps(mockSlate);
      expect(nodes[0].position).not.toHaveBeenCalled();
      expect(overlaps(nodes)).toBe(false);
    });

    it("moves and saves nothing when no notes overlap", () => {
      const nodes = [makeNode("a", 0, 0), makeNode("b", 200, 200)];
      const broadcast = vi.fn();
      mockSlate = { nodes: { allNodes: nodes }, broadcast };
      removeLayoutOverlaps(mockSlate);
      expect(nodes[0].position).not.toHaveBeenCalled();
      expect(broadcast).not.toHaveBeenCalled();
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
