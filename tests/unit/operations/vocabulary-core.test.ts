// P10: the canvas vocabulary for the common jobs (place, connect, link, lay
// out, group, settings) with the rules the canvas applies to a person. Each
// describe names the parity row it closes.
import { describe, expect, it, vi } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  describeOperations,
  slateOperationPlanSchema,
  NODE_KEYS,
  EFFECTS,
} from "../../../src/operations";
import { alignPositions, distributePositions, tidyPositions, treePositions } from "../../../src/operations/layout";
import { applySlateOperations } from "../../../src/core/SlateOperations";
import { getFilterNames } from "../../../src/core/Filters";
import { NOTE_PRESETS } from "../../../src/core/NoteDefaults";
import { v1NodeToV2 } from "../../../src/core/compat";

function note(id: string, text: string, xPos: number, yPos: number, extra: Record<string, any> = {}) {
  return {
    options: { id, text, shape: "rectangle", vectorPath: "rectangle", xPos, yPos, width: 200, height: 100, backgroundColor: "#7aa2c8", ...extra },
    relationships: { associations: [] as any[] },
  };
}

function slate(nodes = [note("a", "Alpha", 100, 100), note("b", "Beta", 400, 100), note("c", "Gamma", 700, 100)]) {
  return { _id: "s1", shareId: "share", options: { name: "Demo", containerStyle: { backgroundColor: "#ffffff" } }, nodes };
}

const ids = (...list: string[]) => {
  let index = 0;
  return () => list[index++] ?? `gen-${index}`;
};
const plan = (...operations: any[]) => ({ message: "Done.", operations });
const find = (result: any, id: string) => result.slate.nodes.find((n: any) => n.options.id === id);
type Box = { x: number; y: number; width: number; height: number };
const boxOf = (n: any): Box => ({ x: n.options.xPos, y: n.options.yPos, width: n.options.width, height: n.options.height });
function overlapping(boxes: Box[]): Array<[number, number]> {
  const pairs: Array<[number, number]> = [];
  boxes.forEach((a, i) =>
    boxes.slice(i + 1).forEach((b, k) => {
      if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) pairs.push([i, i + k + 1]);
    }),
  );
  return pairs;
}

describe("add-connected-note: placement.connect makes a note that takes after its source and is joined to it", () => {
  const styled = () =>
    slate([
      note("a", "Alpha", 100, 100, {
        backgroundColor: "#ff8800", borderColor: "#112233", borderWidth: 4, borderStyle: "dashed",
        fontFamily: "Georgia", fontSize: 28, foregroundColor: "#ffffff", fontColor: "#ffffff", width: 240, height: 120,
        rotate: { rotationAngle: 0 }, isLocked: false, link: { show: true, type: "url", data: "https://a.example" },
      }),
    ]);

  it("adds a note below, copying fill, border, font and size, with a connector from the source", () => {
    const result = applyPlanToJSON(
      styled(),
      plan({ kind: "add_nodes", count: 1, text: "Next", ids: ["n1"], placement: { relativeTo: "a", direction: "below", connect: true } }),
    );
    const added = find(result, "n1").options;
    expect(added).toMatchObject({
      backgroundColor: "#ff8800", borderColor: "#112233", borderWidth: 4, borderStyle: "dashed",
      fontFamily: "Georgia", fontSize: 28, fontColor: "#ffffff", width: 240, height: 120, text: "Next",
    });
    // The canvas puts a connected note 75 below the source's edge, same column.
    expect([added.xPos, added.yPos]).toEqual([100, 100 + 120 + 75]);
    // What identifies or belongs to the source is not copied.
    expect(added.link).toBeUndefined();
    expect(added.name).toBe("n1");
    const connector = find(result, "a").relationships.associations[0];
    expect(connector).toMatchObject({ id: "a->n1", parentId: "a", childId: "n1" });
    expect(result.report.created).toEqual(["n1"]);
    expect(result.report.connected).toEqual(["a->n1"]);
  });

  it("lets explicit shape and style win over the copied ones, and replays the carried-out plan to the same slate", () => {
    const first = applyPlanToJSON(
      styled(),
      plan({ kind: "add_nodes", count: 2, shape: "ellipse", ids: ["n1", "n2"], style: { backgroundColor: "#00aa00" }, placement: { relativeTo: "a", direction: "right", connect: true } }),
    );
    expect(first.slate.nodes.slice(1).map((n: any) => [n.options.shape, n.options.backgroundColor, n.options.borderColor])).toEqual([
      ["ellipse", "#00aa00", "#112233"],
      ["ellipse", "#00aa00", "#112233"],
    ]);
    expect(first.report.connected).toEqual(["a->n1", "a->n2"]);
    const again = applyPlanToJSON(styled(), first.materializedPlan, { replay: true });
    expect(again.slate).toEqual(first.slate);
  });

  it("refuses connect without a note to start from, toward the centre, or as a non-boolean", () => {
    const errors = validatePlan(
      plan(
        { kind: "add_nodes", count: 1, shape: "rectangle", placement: { direction: "center", relativeTo: "a", connect: true } },
        { kind: "add_nodes", count: 1, shape: "rectangle", placement: { connect: "yes" } },
        { kind: "add_nodes", count: 1, x: 1, y: 2, placement: { connect: true } },
      ),
    ).errors.join(" ");
    expect(errors).toMatch(/Operation 1 cannot connect a note placed at the centre/);
    expect(errors).toMatch(/Operation 2 placement.connect must be true or false/);
    expect(errors).toMatch(/Operation 3 placement.connect needs relativeTo/);
  });

  it("needs a shape only when nothing else gives one", () => {
    expect(validatePlan(plan({ kind: "add_nodes", count: 1 })).errors.join(" ")).toMatch(/Operation 1 shape must be one of/);
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, placement: { relativeTo: "a", connect: true } })).valid).toBe(true);
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, preset: "sticky" })).valid).toBe(true);
  });
});

describe("add-text-note and add-sticky-note: presets the note toolbar makes", () => {
  it("adds a text note: no fill or border, readable text, at least 20 point", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, preset: "text", text: "Label", x: 0, y: 0, ids: ["t1"] }));
    const added = find(result, "t1").options;
    expect(added).toMatchObject({ opacity: 0, borderOpacity: 0, textOpacity: 1, backgroundColor: "#ffffff", fontColor: "#000000", fontSize: 20, shape: "rectangle" });
  });

  it("adds a sticky note: the sticky shape, the post-it effect and no border", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, preset: "sticky", text: "Idea", x: 0, y: 0, ids: ["s1"] }));
    const added = find(result, "s1").options;
    expect(added).toMatchObject({ shape: "stickynote", borderOpacity: 0, filters: { vect: "postItNote" } });
    expect([added.width, added.height]).toEqual([NOTE_PRESETS.sticky.width, NOTE_PRESETS.sticky.height]);
  });

  it("refuses an unknown preset", () => {
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, preset: "banner" })).errors.join(" ")).toMatch(/preset must be one of: text, sticky/);
  });
});

describe("set-note-link: a web link on a note, the way the link dialog stores it", () => {
  it("stores, reads back and removes a link", () => {
    const set = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { link: "https://slatebox.com/docs" } }));
    expect(find(set, "a").options.link).toEqual({ show: true, type: "url", data: "https://slatebox.com/docs" });
    expect(NODE_KEYS.link.read(find(set, "a").options)).toBe("https://slatebox.com/docs");
    // The loader passes it through to the note unchanged.
    expect(v1NodeToV2(find(set, "a").options).link).toEqual({ show: true, type: "url", data: "https://slatebox.com/docs" });
    const cleared = applyPlanToJSON(set.slate, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { link: null } }));
    expect(find(cleared, "a").options.link).toBeUndefined();
    expect(NODE_KEYS.link.read(find(cleared, "a").options)).toBeNull();
  });

  it("refuses anything but an http or https address", () => {
    for (const link of ["javascript:alert(1)", "data:text/html,x", "ftp://x.example", "slatebox.com", "https://"]) {
      expect(validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { link } })).errors.join(" ")).toMatch(/link must be an http or https address/);
    }
  });
});

describe("set-note-effect: the effects the canvas offers", () => {
  it("lists exactly the engine's filters", () => {
    expect([...EFFECTS].sort()).toEqual(getFilterNames().sort());
    expect(describeOperations().effects).toEqual([...EFFECTS]);
  });

  it("sets and clears the note's effect", () => {
    const set = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { effect: "dropShadow" } }));
    expect(find(set, "a").options.filters).toEqual({ vect: "dropShadow" });
    const cleared = applyPlanToJSON(set.slate, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { effect: null } }));
    expect(find(cleared, "a").options.filters.vect).toBeNull();
    expect(validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { effect: "glow" } })).valid).toBe(false);
  });
});

describe("set-text-colour: text opacity beside the text colour", () => {
  it("stores textOpacity where the note reads it", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { foregroundColor: "#123456", textOpacity: 0.5 } }));
    expect(find(result, "a").options).toMatchObject({ fontColor: "#123456", textOpacity: 0.5 });
  });
});

describe("group-notes: notes share a groupId, and the group selector finds them", () => {
  it("groups, selects by group and ungroups", () => {
    const grouped = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a", "b"] }, changes: { groupId: "grp-1" } }));
    expect(grouped.slate.nodes.map((n: any) => n.options.groupId)).toEqual(["grp-1", "grp-1", undefined]);
    const moved = applyPlanToJSON(grouped.slate, plan({ kind: "update_nodes", target: { groupId: "grp-1" }, changes: { y: 500 } }));
    expect(moved.report.updated).toEqual(["a", "b"]);
    const ungrouped = applyPlanToJSON(grouped.slate, plan({ kind: "update_nodes", target: { groupId: "grp-1" }, changes: { groupId: null } }));
    expect(ungrouped.slate.nodes.every((n: any) => n.options.groupId === undefined)).toBe(true);
  });

  it("refuses a group id that is not a plain id", () => {
    expect(validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { groupId: "<b>" } })).errors.join(" ")).toMatch(/groupId must be 1 to 64 letters/);
  });
});

describe("reorder-note: front and back are the note's place in the saved list", () => {
  it("moves a note to the end (front) or the start (back) of the slate's notes", () => {
    const front = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { order: "front" } }));
    expect(front.slate.nodes.map((n: any) => n.options.id)).toEqual(["b", "c", "a"]);
    expect(front.report.operations[0].changed).toEqual(["a"]);
    const back = applyPlanToJSON(front.slate, plan({ kind: "update_nodes", target: { ids: ["c"] }, changes: { order: "back" } }));
    expect(back.slate.nodes.map((n: any) => n.options.id)).toEqual(["c", "b", "a"]);
    const already = applyPlanToJSON(back.slate, plan({ kind: "update_nodes", target: { ids: ["c"] }, changes: { order: "back" } }));
    expect(already.report.unchanged).toBe(true);
  });

  it("keeps several notes in their order when they come forward together", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["b", "a"] }, changes: { order: "front" } }));
    expect(result.slate.nodes.map((n: any) => n.options.id)).toEqual(["c", "a", "b"]);
  });

  it("is a change, not a key a new note takes", () => {
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, shape: "rectangle", style: { order: "front" } })).errors.join(" ")).toMatch(/unsupported node styles: order/);
  });
});

describe("duplicate-notes: copies offset like Ctrl+D, with the connectors between them", () => {
  const joined = () => {
    const base = slate();
    base.nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b", lineColor: "#ff0000", lineWidth: 5, lineType: "straight" });
    base.nodes[1].relationships.associations.push({ id: "b->c", parentId: "b", childId: "c", lineColor: "#333333", lineWidth: 3, lineType: "bezier" });
    return base;
  };

  it("copies every note option at an offset of 20 and recreates only the connectors inside the copy", () => {
    const result = applyPlanToJSON(joined(), plan({ kind: "duplicate_nodes", target: { ids: ["a", "b"] }, ids: ["a2", "b2"] }), { idFactory: ids("x") });
    const copy = find(result, "a2").options;
    expect([copy.xPos, copy.yPos]).toEqual([120, 120]);
    expect(copy).toMatchObject({ text: "Alpha", backgroundColor: "#7aa2c8", width: 200, height: 100, name: "a2" });
    expect(find(result, "a2").relationships.associations).toEqual([
      { id: "a2->b2", parentId: "a2", childId: "b2", lineColor: "#ff0000", lineWidth: 5, lineType: "straight" },
    ]);
    expect(find(result, "b2").relationships.associations).toEqual([]);
    expect(result.report.created).toEqual(["a2", "b2"]);
    expect(result.report.connected).toEqual(["a2->b2"]);
    expect(result.materializedPlan.operations[0]).toEqual({ kind: "duplicate_nodes", target: { ids: ["a", "b"] }, ids: ["a2", "b2"], offset: { x: 20, y: 20 } });
    const again = applyPlanToJSON(joined(), result.materializedPlan, { replay: true });
    expect(again.slate).toEqual(result.slate);
  });

  it("takes an offset, makes ids when none are given, and refuses an id in use", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "duplicate_nodes", target: { ids: ["c"] }, offset: { x: 0, y: 300 } }), { idFactory: ids("k1") });
    expect([find(result, "k1").options.xPos, find(result, "k1").options.yPos]).toEqual([700, 400]);
    expect(() => applyPlanToJSON(slate(), plan({ kind: "duplicate_nodes", target: { ids: ["c"] }, ids: ["a"] }))).toThrow(
      expect.objectContaining({ code: "id_taken" }),
    );
    expect(validatePlan(plan({ kind: "duplicate_nodes", target: { ids: ["a"] }, ids: ["p", "q"] })).errors.join(" ")).toMatch(/more ids than notes/);
  });
});

describe("align-notes and distribute-notes: the canvas's own rule, by what you see", () => {
  it("aligns left, centre and bottom by the rotated outline", () => {
    const base = slate([note("a", "A", 100, 0), note("b", "B", 300, 50, { width: 100 }), note("c", "C", 500, 200, { rotate: { rotationAngle: 90 } })]);
    const left = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { all: true }, layout: "align-left" }));
    // c is 200x100 turned 90 degrees: it shows 100 wide, from x+50.
    expect(left.slate.nodes.map((n: any) => n.options.xPos)).toEqual([100, 100, 50]);
    expect(left.slate.nodes.map((n: any) => n.options.yPos)).toEqual([0, 50, 200]);
    const bottom = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { all: true }, layout: "align-bottom" }));
    // c shows from y 150 to 350.
    expect(bottom.slate.nodes.map((n: any) => n.options.yPos)).toEqual([250, 250, 200]);
    const centre = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { ids: ["a", "b"] }, layout: "align-center" }));
    expect(centre.slate.nodes.slice(0, 2).map((n: any) => n.options.xPos + n.options.width / 2)).toEqual([250, 250]);
  });

  it("distributes with equal gaps and leaves the outer two where they are", () => {
    const base = slate([note("a", "A", 0, 0), note("b", "B", 250, 0, { width: 100 }), note("c", "C", 1000, 0)]);
    const result = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { all: true }, layout: "distribute-horizontal" }));
    expect(result.slate.nodes.map((n: any) => n.options.xPos)).toEqual([0, 550, 1000]);
  });

  it("is the function the canvas's align and distribute call", () => {
    const boxes = [{ id: "a", x: 0, y: 0, width: 100, height: 50 }, { id: "b", x: 40, y: 90, width: 60, height: 50 }];
    expect(alignPositions("right", boxes)).toEqual([{ id: "a", x: 0, y: 0 }, { id: "b", x: 40, y: 90 }]);
    expect(alignPositions("top", boxes)).toEqual([{ id: "a", x: 0, y: 0 }, { id: "b", x: 40, y: 0 }]);
    expect(distributePositions("vertical", boxes)).toEqual([]);
  });
});

describe("optimize-layout: tidy and tree leave no note on another", () => {
  it("tidy pushes overlapping notes apart and leaves clear and locked notes where they are", () => {
    const base = slate([
      note("a", "A", 0, 0), note("b", "B", 0, 0), note("c", "C", 50, 30), note("d", "D", 20, 10),
      note("far", "Far", 2000, 2000), note("lock", "Locked", 100, 50, { isLocked: true }),
    ]);
    const result = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { all: true }, layout: "tidy" }));
    expect(overlapping(result.slate.nodes.map(boxOf))).toEqual([]);
    expect(boxOf(find(result, "far"))).toMatchObject({ x: 2000, y: 2000 });
    expect(boxOf(find(result, "lock"))).toMatchObject({ x: 100, y: 50 });
    expect(result.report.skipped).toEqual([{ operation: 1, id: "lock", reason: "locked" }]);
  });

  it("tidy moves only the notes it names, around the others", () => {
    const base = slate([note("a", "A", 0, 0), note("b", "B", 10, 10), note("other", "Other", 220, 0)]);
    const result = applyPlanToJSON(base, plan({ kind: "arrange_nodes", target: { ids: ["b"] }, layout: "tidy" }));
    expect(boxOf(find(result, "a"))).toMatchObject({ x: 0, y: 0 });
    expect(boxOf(find(result, "other"))).toMatchObject({ x: 220, y: 0 });
    expect(overlapping(result.slate.nodes.map(boxOf))).toEqual([]);
  });

  it("tree lays a 12-note graph out in layers under its root, with no overlaps", () => {
    const nodes = Array.from({ length: 12 }, (_, index) => note(`n${index}`, `N${index}`, 37 * index, 11 * index, { width: 120 + 10 * (index % 3), height: 60 }));
    const edge = (from: number, to: number) =>
      nodes[from].relationships.associations.push({ id: `n${from}->n${to}`, parentId: `n${from}`, childId: `n${to}` });
    [[0, 1], [0, 2], [0, 3], [1, 4], [1, 5], [2, 6], [3, 7], [3, 8], [3, 9], [5, 10], [6, 11], [11, 2], [9, 0]].forEach(([f, t]) => edge(f, t));
    const result = applyPlanToJSON(slate(nodes), plan({ kind: "arrange_nodes", target: { all: true }, layout: "tree" }));
    const placed = result.slate.nodes.map(boxOf);
    expect(overlapping(placed)).toEqual([]);
    const y = (index: number) => placed[index].y;
    // n0 is the root (the first note that nothing else leads to once the cycle n9 -> n0 is broken).
    expect(y(1)).toBeGreaterThan(y(0));
    expect(y(4)).toBeGreaterThan(y(1));
    expect(y(10)).toBeGreaterThan(y(5));
    expect(y(1)).toBe(y(2));
    // A parent sits over the middle of its children.
    const middle = (index: number) => placed[index].x + placed[index].width / 2;
    expect(middle(1)).toBeCloseTo((middle(4) + middle(5)) / 2, 5);
    // The tree starts where the notes were.
    expect(Math.min(...placed.map((b) => b.x))).toBe(0);
    expect(Math.min(...placed.map((b) => b.y))).toBe(0);
  });

  it("tree places notes with no connectors side by side", () => {
    const boxes = [{ id: "a", x: 0, y: 0, width: 100, height: 50 }, { id: "b", x: 0, y: 0, width: 100, height: 50 }];
    const positions = treePositions(boxes, [], { gap: 40 });
    expect(positions).toEqual([{ id: "a", x: 0, y: 0 }, { id: "b", x: 140, y: 0 }]);
    expect(tidyPositions(boxes, [], { gap: 20 }).length).toBe(2);
  });

  it("refuses a layout the canvas does not have", () => {
    expect(validatePlan(plan({ kind: "arrange_nodes", target: { all: true }, layout: "spiral" })).errors.join(" ")).toMatch(/layout must be one of: row, column, grid, circle, align-left/);
  });
});

describe("set-mind-map-mode, set-auto-resize, set-show-grid, set-snap-to-neighbours, set-default-line-colour", () => {
  it("stores each slate setting where the canvas reads it", () => {
    const result = applyPlanToJSON(
      slate(),
      plan({ kind: "update_slate", changes: { mindMapMode: true, autoResizeNodesBasedOnText: false, showGrid: true, snapToObjects: true } }),
    );
    expect(result.slate.options).toMatchObject({ mindMapMode: true, autoResizeNodesBasedOnText: false, viewPort: { showGrid: true, snapToObjects: true } });
    expect(result.slate.options.containerStyle).toEqual({ backgroundColor: "#ffffff" });
  });

  it("recolours every connector and every note's line colour, as the canvas control does", () => {
    const base = slate();
    base.nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b", lineColor: "#333333" });
    const result = applyPlanToJSON(base, plan({ kind: "update_slate", changes: { defaultLineColor: "#ff0000" } }));
    expect(result.slate.options.defaultLineColor).toBe("#ff0000");
    expect(result.slate.nodes.map((n: any) => n.options.lineColor)).toEqual(["#ff0000", "#ff0000", "#ff0000"]);
    expect(find(result, "a").relationships.associations[0].lineColor).toBe("#ff0000");
  });

  it("refuses a setting value of the wrong kind", () => {
    expect(validatePlan(plan({ kind: "update_slate", changes: { showGrid: "yes" } })).errors.join(" ")).toMatch(/showGrid must be true or false/);
    expect(validatePlan(plan({ kind: "update_slate", changes: { view: "fit" } })).errors.join(" ")).toMatch(/unsupported slate changes: view/);
  });
});

describe("the contract describes what it accepts", () => {
  it("lists the new kinds, keys, layouts and presets for callers and model tools", () => {
    const description = describeOperations();
    expect(description.kinds.duplicate_nodes.fields).toEqual(["target", "offset", "ids"]);
    expect(description.kinds.add_nodes.fields).toContain("preset");
    expect(Object.keys(description.noteKeys)).toEqual(expect.arrayContaining(["link", "effect", "groupId", "order", "textOpacity"]));
    expect(description.noteStyleKeys).not.toContain("order");
    expect(Object.keys(description.slateKeys)).toEqual(expect.arrayContaining(["mindMapMode", "autoResizeNodesBasedOnText", "showGrid", "snapToObjects", "defaultLineColor"]));
    expect(description.layouts).toEqual(expect.arrayContaining(["tidy", "tree", "align-left", "distribute-vertical"]));
    expect(description.presets).toEqual(["text", "sticky"]);
    const schema = slateOperationPlanSchema();
    const item = schema.properties.operations.items.properties;
    expect(item.kind.enum).toContain("duplicate_nodes");
    expect(item.layout.enum).toContain("tree");
    expect(item.preset.enum).toEqual(["text", "sticky"]);
    expect(item.placement.properties.connect).toEqual({ type: "boolean" });
    expect(item.changes.properties.order.enum).toEqual(["front", "back"]);
    expect(item.changes.properties.link.type).toEqual(["string", "null"]);
    expect(item.changes.properties.showGrid).toEqual({ type: "boolean" });
  });
});

describe("the live applier sends the packages the canvas's own controls send", () => {
  function liveSlate() {
    const stored = slate();
    stored.nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b", lineColor: "#333333" });
    const nodes = stored.nodes.map((n) => ({ id: n.options.id, options: { ...n.options }, relationships: { associations: [...n.relationships.associations] } }));
    const invoke = vi.fn();
    return { options: { ...stored.options }, nodes: { allNodes: nodes, one: (id: string) => nodes.find((n) => n.id === id) }, collab: { invoke, send: vi.fn() } };
  }
  const sent = (operations: any[]) => {
    const live = liveSlate();
    applySlateOperations(live, plan(...operations));
    return live.collab.invoke.mock.calls.flatMap((call: any[]) => call[0]);
  };

  it("link, effect, group, order and text opacity", () => {
    const packages = sent([
      { kind: "update_nodes", target: { ids: ["a"] }, changes: { link: "https://x.example", effect: "blur", groupId: "g1", textOpacity: 0.4 } },
      { kind: "update_nodes", target: { ids: ["b"] }, changes: { link: null, order: "front" } },
      { kind: "update_nodes", target: { ids: ["c"] }, changes: { order: "back" } },
    ]);
    expect(packages).toEqual(
      expect.arrayContaining([
        { type: "onNodeLinkAdded", data: { id: "a", link: { show: true, type: "url", data: "https://x.example" } } },
        { type: "onNodeEffectChanged", data: { id: "a", filter: { apply: "vect", id: "blur" } } },
        { type: "onNodesMove", data: { dur: 0, nodes: [{ id: "a", groupId: "g1" }] } },
        { type: "onNodeTextChanged", data: { id: "a", textOpacity: 0.4 } },
        { type: "onNodeLinkRemoved", data: { id: "b" } },
        { type: "onNodeToFront", data: { id: "b" } },
        { type: "onNodeToBack", data: { id: "c" } },
      ]),
    );
  });

  it("a connected note, a duplicate and the slate settings", () => {
    const packages = sent([
      { kind: "add_nodes", count: 1, ids: ["n1"], placement: { relativeTo: "c", direction: "below", connect: true } },
      { kind: "duplicate_nodes", target: { ids: ["a", "b"] }, ids: ["a2", "b2"] },
      { kind: "update_slate", changes: { mindMapMode: true, autoResizeNodesBasedOnText: true, showGrid: false, snapToObjects: true, defaultLineColor: "#00ff00" } },
    ]);
    const types = packages.map((p: any) => p.type);
    expect(types).toEqual([
      "onNodeAdded", "addRelationship",
      "onNodeAdded", "onNodeAdded", "addRelationship",
      "onSlateMindMapModeChanged", "onSlateAutoResizeNodesBasedOnTextChanged", "onSlateShowGridChanged", "onSlateSnapToObjectsChanged", "onLineColorChanged",
    ]);
    expect(packages[1].data).toMatchObject({ id: "c->n1", parentId: "c", childId: "n1" });
    expect(packages[4].data).toMatchObject({ id: "a2->b2", parentId: "a2", childId: "b2" });
    expect(packages[9]).toEqual({ type: "onLineColorChanged", data: { color: "#00ff00" } });
    expect(packages[7]).toEqual({ type: "onSlateShowGridChanged", data: { showGrid: false } });
  });

  it("a tidy or tree layout moves the notes in one package", () => {
    const packages = sent([{ kind: "arrange_nodes", target: { all: true }, layout: "align-top" }]);
    expect(packages).toEqual([{ type: "onNodesMove", data: expect.objectContaining({ nodes: expect.any(Array) }) }]);
  });
});

describe("the live applier keeps plan order while the canvas draws new notes", () => {
  it("holds the packages of later operations until the notes an operation made are ready", async () => {
    let finish!: () => void;
    const ready = new Promise<void>((resolve) => (finish = resolve));
    const stored = slate();
    const nodes: any[] = stored.nodes.map((n) => ({ id: n.options.id, options: { ...n.options }, relationships: { associations: [] } }));
    const invoked: string[] = [];
    const invoke = vi.fn((packages: any[]) => {
      packages.forEach((pkg) => {
        invoked.push(pkg.type);
        if (pkg.type === "onNodeAdded") nodes.push({ id: pkg.data.nodeOptions.id, options: pkg.data.nodeOptions, ready });
      });
    });
    const live = { options: { ...stored.options }, nodes: { allNodes: nodes, one: (id: string) => nodes.find((n) => n.id === id) }, collab: { invoke, send: vi.fn() } };
    const result = applySlateOperations(
      live,
      plan(
        { kind: "duplicate_nodes", target: { ids: ["a"] }, ids: ["a2"] },
        { kind: "update_slate", changes: { defaultLineColor: "#ff0055" } },
      ),
    );
    expect(invoked).toEqual(["onNodeAdded"]);
    expect(live.collab.send).toHaveBeenCalledTimes(1);
    finish();
    await result.applied;
    expect(invoked).toEqual(["onNodeAdded", "onLineColorChanged"]);
  });
});
