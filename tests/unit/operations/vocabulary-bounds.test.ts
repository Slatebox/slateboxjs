// P10 review fixes: the bounds the new vocabulary must keep. Each describe names
// the review finding (review-P10.md) it closes.
import { describe, expect, it } from "vitest";
import { applyPlanToJSON } from "../../../src/operations";
import { tidyPositions, treePositions, type LayoutBox } from "../../../src/operations/layout";

function note(id: string, xPos: number, yPos: number, extra: Record<string, any> = {}) {
  return {
    options: { id, text: id, shape: "rectangle", vectorPath: "rectangle", xPos, yPos, width: 200, height: 100, ...extra },
    relationships: { associations: [] as any[] },
  };
}
const slate = (nodes: any[]) => ({ _id: "s1", shareId: "share", options: { name: "Demo" }, nodes });
const plan = (...operations: any[]) => ({ message: "Done.", operations });
const counter = () => {
  let index = 0;
  return () => `gen-${(index += 1)}`;
};

function overlapCount(boxes: Array<{ x: number; y: number; width: number; height: number }>, gap = 0): number {
  let count = 0;
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = i + 1; j < boxes.length; j += 1) {
      const a = boxes[i];
      const b = boxes[j];
      if (a.x < b.x + b.width + gap && a.x + a.width + gap > b.x && a.y < b.y + b.height + gap && a.y + a.height + gap > b.y) count += 1;
    }
  }
  return count;
}
const placedBoxes = (input: LayoutBox[], positions: Array<{ id: string; x: number; y: number }>) =>
  input.map((box, index) => ({ ...box, x: positions[index].x, y: positions[index].y }));

describe("P10-1: duplicate_nodes and add_nodes stop at the note limit before they make the notes", () => {
  it("refuses a plan that doubles the slate again and again at the operation that passes the limit, at once", () => {
    const started = Date.now();
    const doubling = Array.from({ length: 30 }, () => ({ kind: "duplicate_nodes", target: { all: true } }));
    let error: any;
    try {
      applyPlanToJSON(slate([note("a", 0, 0)]), plan(...doubling), { idFactory: counter() });
    } catch (caught) {
      error = caught;
    }
    // Operation n leaves 2^n notes; 2^10 = 1024 passes 1000, so operation 10 is refused.
    expect(error).toMatchObject({ code: "note_limit", status: 422, details: { limit: 1000, operation: 10 } });
    expect(error.message).toMatch(/Operation 10 would leave 1024 notes/);
    expect(Date.now() - started).toBeLessThan(2000);
  });

  it("refuses an add that would pass the limit, and still allows reaching it", () => {
    const limits = { notesPerSlate: 5 };
    const full = applyPlanToJSON(slate([note("a", 0, 0)]), plan({ kind: "add_nodes", count: 4, shape: "rectangle" }), { limits, idFactory: counter() });
    expect(full.slate.nodes).toHaveLength(5);
    expect(() => applyPlanToJSON(full.slate, plan({ kind: "add_nodes", count: 1, shape: "rectangle", ids: ["one-more"] }), { limits })).toThrow(
      expect.objectContaining({ code: "note_limit", details: { limit: 5, operation: 1 } }),
    );
  });

  it("lets a slate already over the limit shrink or stay the same size", () => {
    const over = slate([note("a", 0, 0), note("b", 300, 0), note("c", 600, 0)]);
    const result = applyPlanToJSON(over, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { text: "Still here" } }), { limits: { notesPerSlate: 2 } });
    expect(result.slate.nodes).toHaveLength(3);
    expect(() => applyPlanToJSON(over, plan({ kind: "duplicate_nodes", target: { ids: ["a"] } }), { limits: { notesPerSlate: 2 }, idFactory: counter() })).toThrow(
      expect.objectContaining({ code: "note_limit" }),
    );
  });
});

describe("P10-2: duplicate_nodes and connected notes keep the connector limit", () => {
  const joined = () => {
    const nodes = [note("a", 0, 0), note("b", 300, 0), note("c", 600, 0)];
    nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b" });
    nodes[1].relationships.associations.push({ id: "b->c", parentId: "b", childId: "c" });
    return slate(nodes);
  };

  it("refuses a duplicate whose copied connectors pass connectorsPerSlate", () => {
    expect(() =>
      applyPlanToJSON(joined(), plan({ kind: "duplicate_nodes", target: { all: true } }), { limits: { connectorsPerSlate: 3 }, idFactory: counter() }),
    ).toThrow(expect.objectContaining({ code: "connector_limit", status: 422, details: { limit: 3, operation: 1 } }));
    const fits = applyPlanToJSON(joined(), plan({ kind: "duplicate_nodes", target: { all: true } }), { limits: { connectorsPerSlate: 4 }, idFactory: counter() });
    expect(fits.report.connected).toHaveLength(2);
  });

  it("refuses a connected note when its connector would pass connectorsPerSlate", () => {
    const add = plan({ kind: "add_nodes", count: 1, placement: { relativeTo: "c", direction: "below", connect: true } });
    expect(() => applyPlanToJSON(joined(), add, { limits: { connectorsPerSlate: 2 }, idFactory: counter() })).toThrow(
      expect.objectContaining({ code: "connector_limit", details: { limit: 2, operation: 1 } }),
    );
  });
});

describe("P10-7: a copy stays inside the coordinate bound a point may take", () => {
  it("refuses a duplicate that would land past 1000000", () => {
    const first = applyPlanToJSON(slate([note("a", 0, 0)]), plan({ kind: "duplicate_nodes", target: { ids: ["a"] }, ids: ["a2"], offset: { x: 1000000, y: 0 } }));
    expect(first.slate.nodes[1].options.xPos).toBe(1000000);
    expect(() =>
      applyPlanToJSON(first.slate, plan({ kind: "duplicate_nodes", target: { ids: ["a2"] }, offset: { x: 1000000, y: 0 } }), { idFactory: counter() }),
    ).toThrow(expect.objectContaining({ code: "invalid_operation_plan", status: 400, message: expect.stringMatching(/from -1000000 to 1000000/) }));
  });
});

describe("P10-5: tidy leaves no two notes closer than the gap, at any size, in bounded time", () => {
  const stacked = (count: number, width: number, height: number): LayoutBox[] =>
    Array.from({ length: count }, (_, index) => ({ id: `s${index}`, x: 0, y: 0, width, height }));

  for (const count of [80, 100, 200]) {
    it(`separates ${count} notes stacked on one point`, () => {
      const boxes = stacked(count, 180, 110);
      expect(overlapCount(placedBoxes(boxes, tidyPositions(boxes, [], { gap: 20 })), 20)).toBe(0);
    });
  }

  it("separates 150 notes scattered within 300 px, and keeps clear of notes it may not move", () => {
    let seed = 150;
    const random = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const boxes: LayoutBox[] = Array.from({ length: 150 }, (_, index) => ({ id: `r${index}`, x: Math.round(random() * 300), y: Math.round(random() * 300), width: 180, height: 110 }));
    const obstacles: LayoutBox[] = [{ id: "locked", x: 100, y: 100, width: 300, height: 200 }];
    const placed = placedBoxes(boxes, tidyPositions(boxes, obstacles, { gap: 20 }));
    expect(overlapCount([...placed, ...obstacles], 20)).toBe(0);
  });

  it("separates 1000 stacked notes within a second and a half", () => {
    const boxes = stacked(1000, 100, 60);
    const started = Date.now();
    const positions = tidyPositions(boxes, [], { gap: 20 });
    expect(Date.now() - started).toBeLessThan(1500);
    expect(overlapCount(placedBoxes(boxes, positions), 20)).toBe(0);
  });

  it("leaves a slate that is already tidy exactly where it is", () => {
    const boxes: LayoutBox[] = [
      { id: "a", x: 0, y: 0, width: 100, height: 60 },
      { id: "b", x: 200, y: 0, width: 100, height: 60 },
    ];
    expect(tidyPositions(boxes, [], { gap: 20 })).toEqual([{ id: "a", x: 0, y: 0 }, { id: "b", x: 200, y: 0 }]);
  });
});

describe("P10-6: tree keeps clear of the notes it does not move", () => {
  it("moves the tree off a note it is not arranging", () => {
    const boxes: LayoutBox[] = [
      { id: "r", x: 0, y: 0, width: 100, height: 60 },
      { id: "a", x: 0, y: 0, width: 100, height: 60 },
      { id: "b", x: 0, y: 0, width: 100, height: 60 },
    ];
    const obstacles: LayoutBox[] = [{ id: "other", x: 0, y: 108, width: 100, height: 60 }];
    const positions = treePositions(boxes, [["r", "a"], ["r", "b"]], { gap: 48, obstacles });
    const placed = placedBoxes(boxes, positions);
    expect(overlapCount([...placed, ...obstacles])).toBe(0);
    // Still a tree: a and b sit one layer under r.
    expect(placed[1].y).toBeGreaterThan(placed[0].y);
    expect(placed[1].y).toBe(placed[2].y);
  });

  it("does not lay a tree over a locked note on the slate", () => {
    const nodes = [note("r", 0, 0, { width: 100, height: 60 }), note("a", 0, 0, { width: 100, height: 60 }), note("b", 0, 0, { width: 100, height: 60 })];
    nodes[0].relationships.associations.push({ id: "r->a", parentId: "r", childId: "a" }, { id: "r->b", parentId: "r", childId: "b" });
    nodes.push(note("lock", 0, 108, { width: 100, height: 60, isLocked: true }));
    const result = applyPlanToJSON(slate(nodes), plan({ kind: "arrange_nodes", target: { all: true }, layout: "tree" }));
    const boxes = result.slate.nodes.map((n: any) => ({ x: n.options.xPos, y: n.options.yPos, width: n.options.width, height: n.options.height }));
    expect(overlapCount(boxes)).toBe(0);
    expect(result.slate.nodes[3].options).toMatchObject({ xPos: 0, yPos: 108 });
  });
});
