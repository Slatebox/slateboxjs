// The rules for a line's ends, shared by the canvas (dragging an end), the
// keyboard, the line tool and the operations module (exec and chat).
import { describe, expect, it } from "vitest";
import {
  anchorForDrop,
  anchorToward,
  anchorPoint,
  endStateOf,
  nudgeAnchor,
  sideAnchor,
} from "../../src/core/LineEnds";

describe("anchorForDrop: an edge spot pins, the note's body follows", () => {
  it("pins a drop near an edge to that edge, keeping the spot along it", () => {
    expect(anchorForDrop(0.5, 0.05)).toEqual({ x: 0.5, y: 0 });
    expect(anchorForDrop(0.97, 0.3)).toEqual({ x: 1, y: 0.3 });
    expect(anchorForDrop(0.15, 0.5)).toEqual({ x: 0, y: 0.5 });
    expect(anchorForDrop(0.4, 0.85)).toEqual({ x: 0.4, y: 1 });
  });

  it("pins a drop just outside the note to the nearest edge", () => {
    expect(anchorForDrop(-0.05, 0.4)).toEqual({ x: 0, y: 0.4 });
    expect(anchorForDrop(0.6, 1.08)).toEqual({ x: 0.6, y: 1 });
  });

  it("follows (null) for a drop on the note's middle", () => {
    expect(anchorForDrop(0.5, 0.5)).toBeNull();
    expect(anchorForDrop(0.3, 0.7)).toBeNull();
  });
});

describe("endStateOf: follows, pinned or free", () => {
  it("reads each end of an association", () => {
    expect(endStateOf({ parentId: "a", childId: "b" }, "target")).toBe("follow");
    expect(endStateOf({ parentId: "a", childId: "b", targetAnchor: { x: 1, y: 0.5 } }, "target")).toBe("pinned");
    expect(endStateOf({ parentId: "a", childId: "b", sourceAnchor: { x: 0, y: 0.5 } }, "source")).toBe("pinned");
    expect(endStateOf({ parentId: "a", childId: "__free_1", targetPoint: { x: 4, y: 5 } }, "target")).toBe("free");
    expect(endStateOf({ parentId: "a", childId: "__free_1", targetPoint: { x: 4, y: 5 } }, "source")).toBe("follow");
  });
});

describe("nudgeAnchor: arrow keys slide a pinned end round the note's edge", () => {
  it("moves along the edge it is on", () => {
    expect(nudgeAnchor({ x: 0.5, y: 0 }, "ArrowRight")).toEqual({ x: 0.55, y: 0 });
    expect(nudgeAnchor({ x: 1, y: 0.5 }, "ArrowDown")).toEqual({ x: 1, y: 0.55 });
  });

  it("turns a corner onto the next edge", () => {
    const a = nudgeAnchor({ x: 1, y: 0 }, "ArrowDown");
    expect(a).toEqual({ x: 1, y: 0.05 });
  });

  it("stays on the note when pushed off it", () => {
    expect(nudgeAnchor({ x: 0.5, y: 0 }, "ArrowUp")).toEqual({ x: 0.5, y: 0 });
  });
});

describe("sides, and the spot facing another point", () => {
  it("names the middle of each side", () => {
    expect(sideAnchor("top")).toEqual({ x: 0.5, y: 0 });
    expect(sideAnchor("right")).toEqual({ x: 1, y: 0.5 });
    expect(sideAnchor("bottom")).toEqual({ x: 0.5, y: 1 });
    expect(sideAnchor("left")).toEqual({ x: 0, y: 0.5 });
  });

  it("finds where a line toward a point leaves the note, and back again", () => {
    const box = { x: 100, y: 100, width: 200, height: 100 };
    expect(anchorToward(box, { x: 700, y: 150 })).toEqual({ x: 1, y: 0.5 });
    const up = anchorToward(box, { x: 200, y: -500 });
    expect(up).toEqual({ x: 0.5, y: 0 });
    expect(anchorPoint(box, { x: 1, y: 0.5 })).toEqual({ x: 300, y: 150 });
  });

  it("respects a turned note", () => {
    const box = { x: 100, y: 100, width: 200, height: 100, rotation: 90 };
    // Turned a quarter, the note's top faces right.
    const a = anchorToward(box, { x: 900, y: 150 });
    expect(a.x).toBeCloseTo(0.5, 5);
    expect(a.y).toBeCloseTo(0, 5);
    const p = anchorPoint(box, { x: 0.5, y: 0 });
    expect(p.x).toBeCloseTo(250, 5);
    expect(p.y).toBeCloseTo(150, 5);
  });
});
