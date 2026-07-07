import { describe, it, expect } from "vitest";
import { snapRectToNeighbors } from "../../src/core/Node";

// Snap-to-neighbors (Miro smart-align): a dragged rect snaps so one of its
// edges/centers lines up with a neighbor's, within the threshold. No-op otherwise.
describe("snapRectToNeighbors", () => {
  const A = { x: 100, y: 100, width: 100, height: 60 }; // left=100, cx=150, right=200

  it("snaps the left edge to a neighbor's left edge when within threshold", () => {
    // rect left = 105 (5px from A.left=100) → snaps to 100.
    const r = snapRectToNeighbors({ x: 105, y: 400, width: 80, height: 40 }, [A]);
    expect(r.x).toBe(100);
  });

  it("snaps center-x to a neighbor's center-x", () => {
    // rect width 80 → to align centers, rect.x must be A.cx - 40 = 110.
    // start rect.cx = 154 (x=114) → 4px from A.cx=150 → snaps so cx=150 (x=110).
    const r = snapRectToNeighbors({ x: 114, y: 400, width: 80, height: 40 }, [A]);
    expect(r.x + 80 / 2).toBe(150);
  });

  it("snaps top edge to a neighbor's top edge", () => {
    // Tall rect so its center/bottom are far from A; only the top (104, 4px from
    // A.top=100) is within threshold → snaps top to 100.
    const r = snapRectToNeighbors({ x: 400, y: 104, width: 80, height: 300 }, [A]);
    expect(r.y).toBe(100);
  });

  it("does NOT snap when nothing is within threshold", () => {
    const start = { x: 400, y: 400, width: 80, height: 40 };
    const r = snapRectToNeighbors(start, [A]);
    expect(r).toEqual({ x: 400, y: 400 });
  });

  it("is a no-op with no neighbors", () => {
    const r = snapRectToNeighbors({ x: 105, y: 106, width: 80, height: 40 }, []);
    expect(r).toEqual({ x: 105, y: 106 });
  });
});
