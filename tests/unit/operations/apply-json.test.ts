// The canvas operations module (slateboxjs/operations). Its rules are the
// specification shared by the server, the browser and the published package.
// tests/node/operations.test.mjs proves the built module loads in plain Node.
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  summarizeSlate,
  OperationPlanError,
  LIMITS,
} from "../../../src/operations";

function note(id: string, text: string, xPos: number, yPos: number, extra: Record<string, any> = {}) {
  return {
    options: { id, text, shape: "rectangle", vectorPath: "rectangle", xPos, yPos, width: 200, height: 100, backgroundColor: "#7aa2c8", ...extra },
    relationships: { associations: [] as any[] },
  };
}

function slate() {
  const nodes = [note("a", "Alpha", 100, 100), note("b", "Beta", 400, 100), note("c", "Gamma", 700, 100)];
  nodes[0].relationships.associations.push({ id: "a->b", parentId: "a", childId: "b", lineColor: "#333333", lineWidth: 3, lineType: "bezier" });
  return { _id: "s1", shareId: "share", options: { name: "Demo", containerStyle: { backgroundColor: "#ffffff" } }, nodes };
}

const ids = (...list: string[]) => {
  let index = 0;
  return () => list[index++] ?? `gen-${index}`;
};

const plan = (...operations: any[]) => ({ message: "Done.", operations });

describe("add-note-doubleclick: ids made earlier in a plan, exact points, every note key", () => {
  it("connects a note added earlier in the same plan by its id", () => {
    const result = applyPlanToJSON(
      slate(),
      plan(
        { kind: "add_nodes", count: 1, shape: "rectangle", text: "New", ids: ["x1"] },
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["x1"] } },
      ),
    );
    expect(result.report.created).toEqual(["x1"]);
    expect(result.report.connected).toEqual(["a->x1"]);
    expect(result.slate.nodes[0].relationships.associations.map((a: any) => a.childId)).toEqual(["b", "x1"]);
  });

  it("places add_nodes at x, y exactly, and accepts every note key in style", () => {
    const result = applyPlanToJSON(
      slate(),
      plan({
        kind: "add_nodes", count: 1, shape: "ellipse", text: "Here", x: 120, y: 640, ids: ["p1"],
        style: { rotationAngle: 30, textXAlign: "left", textYAlign: "top", animation: "pulse", locked: true, fontFamily: "georgia" },
      }),
    );
    const added = result.slate.nodes.find((n: any) => n.options.id === "p1").options;
    expect([added.xPos, added.yPos]).toEqual([120, 640]);
    expect(added.rotate).toEqual({ rotationAngle: 30 });
    expect(added.textXAlign).toBe("left");
    expect(added.animations.vect).toBe("pulse");
    expect(added.isLocked).toBe(true);
    expect(added.fontFamily).toBe("Georgia");
    expect(result.materializedPlan.operations[0]).toMatchObject({ x: 120, y: 640, ids: ["p1"] });
  });

  it("refuses unknown operation fields and a lone x", () => {
    const refused = validatePlan(plan(
      { kind: "add_nodes", count: 1, shape: "rectangle", colour: "red" },
      { kind: "add_nodes", count: 1, shape: "rectangle", x: 5 },
      { kind: "update_nodes", target: { ids: ["a"] }, changes: { text: "x" }, extra: 1 },
    ));
    expect(refused.valid).toBe(false);
    expect(refused.errors.join(" ")).toMatch(/Operation 1 has an unknown field: colour/);
    expect(refused.errors.join(" ")).toMatch(/Operation 2 needs both x and y/);
    expect(refused.errors.join(" ")).toMatch(/Operation 3 has an unknown field: extra/);
  });
});

describe("corr-rotate-note: rotation is stored where the engine loads it", () => {
  it("writes options.rotate.rotationAngle and no stray key", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { rotationAngle: 45 } }));
    const options = result.slate.nodes[0].options;
    expect(options.rotate).toEqual({ rotationAngle: 45 });
    expect("rotationAngle" in options).toBe(false);
    expect(summarizeSlate(result.slate).nodes[0].rotationAngle).toBe(45);
  });
});

describe("lock-note: a locked note is skipped and reported", () => {
  const locked = () => {
    const s = slate();
    s.nodes[1].options.isLocked = true;
    return s;
  };

  it("skips a locked note on update, move and delete", () => {
    const result = applyPlanToJSON(locked(), plan(
      { kind: "update_nodes", target: { ids: ["a", "b"] }, changes: { text: "Changed" } },
      { kind: "delete_nodes", target: { ids: ["b"] } },
      { kind: "arrange_nodes", target: { ids: ["a", "b"] }, layout: "column" },
    ));
    expect(result.slate.nodes.find((n: any) => n.options.id === "b").options.text).toBe("Beta");
    expect(result.slate.nodes.find((n: any) => n.options.id === "b").options.xPos).toBe(400);
    expect(result.report.skipped).toEqual([
      { operation: 1, id: "b", reason: "locked" },
      { operation: 2, id: "b", reason: "locked" },
      { operation: 3, id: "b", reason: "locked" },
    ]);
    expect(result.report.updated).toContain("a");
    expect(result.report.deleted).toEqual([]);
    expect(result.materializedPlan.operations.map((op: any) => op.kind)).toEqual(["update_nodes", "arrange_nodes"]);
  });

  it("lets the change that unlocks it through", () => {
    const result = applyPlanToJSON(locked(), plan({ kind: "update_nodes", target: { ids: ["b"] }, changes: { locked: false, text: "Free" } }));
    const options = result.slate.nodes[1].options;
    expect([options.isLocked, options.text]).toEqual([false, "Free"]);
    expect(summarizeSlate(locked()).nodes[1].locked).toBe(true);
  });
});

describe("corr-text-selector-fanout: exact text, contains on request, several needs all", () => {
  it("matches text exactly by default", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { text: "a" }, changes: { text: "x" } }));
    expect(result.report.operations[0].matched).toEqual([]);
    expect(result.slate.nodes.map((n: any) => n.options.text)).toEqual(["Alpha", "Beta", "Gamma"]);
  });

  it("refuses a selector that matches several notes without all: true, naming the candidates", () => {
    expect(() => applyPlanToJSON(slate(), plan({ kind: "delete_nodes", target: { text: "a", match: "contains" } }))).toThrow(
      /matches 3 notes \(a, b, c\).*all: true/,
    );
    const result = applyPlanToJSON(slate(), plan({ kind: "delete_nodes", target: { text: "a", match: "contains", all: true } }), { userMessage: "delete all of them" });
    expect(result.report.deleted).toEqual(["a", "b", "c"]);
  });
});

describe("select-all-deselect and marquee-select: all, within and groupId", () => {
  it("selects every note with all: true", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { all: true }, changes: { opacity: 0.5 } }));
    expect(result.report.updated).toEqual(["a", "b", "c"]);
  });

  it("keeps the explicit-intent rule for deleting every note", () => {
    expect(validatePlan(plan({ kind: "delete_nodes", target: { all: true } }), { userMessage: "add a note" }).valid).toBe(false);
  });

  it("selects the notes inside a rectangle", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { within: { x: 50, y: 50, width: 600, height: 200 } }, changes: { opacity: 0.4 } }));
    expect(result.report.updated).toEqual(["a", "b"]);
  });

  it("selects a group", () => {
    const s = slate();
    s.nodes[0].options.groupId = "g1";
    s.nodes[2].options.groupId = "g1";
    const result = applyPlanToJSON(s, plan({ kind: "update_nodes", target: { groupId: "g1" }, changes: { opacity: 0.3 } }));
    expect(result.report.updated).toEqual(["a", "c"]);
  });
});

describe("screen-reader-announcements: matched ids per operation; zero matches is no_match on save", () => {
  it("reports matched ids and warns at zero on a preview", () => {
    const result = applyPlanToJSON(slate(), plan(
      { kind: "update_nodes", target: { ids: ["a"] }, changes: { text: "One" } },
      { kind: "update_nodes", target: { text: "Nothing" }, changes: { text: "Two" } },
    ));
    expect(result.report.operations.map((op: any) => op.matched)).toEqual([["a"], []]);
    expect(result.report.warnings).toEqual(["Operation 2 matched no notes."]);
  });

  it("refuses zero matches with 409 no_match when matches are required", () => {
    try {
      applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { text: "Nothing" }, changes: { text: "Two" } }), { requireMatches: true });
      throw new Error("expected a refusal");
    } catch (error: any) {
      expect(error).toBeInstanceOf(OperationPlanError);
      expect([error.status, error.code]).toEqual([409, "no_match"]);
      expect(error.message).toBe("Operation 1 matched no notes.");
    }
  });
});

describe("corr-connect-notes-duplicate and draw-nothing-new: connecting twice changes nothing", () => {
  it("leaves one connector when the pair is already joined under another id", () => {
    const s = slate();
    s.nodes[0].relationships.associations = [{ id: "a-b", parentId: "a", childId: "b" }];
    const result = applyPlanToJSON(s, plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] } }));
    expect(result.slate.nodes[0].relationships.associations).toHaveLength(1);
    expect(result.report.connected).toEqual([]);
    expect(result.report.unchanged).toBe(true);
  });

  it("says unchanged when a plan changes nothing and not otherwise", () => {
    expect(applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { text: "Alpha" } })).report.unchanged).toBe(true);
    expect(applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { text: "Changed" } })).report.unchanged).toBe(false);
  });
});

describe("corr-connectors-without-id: a stored connector without an id gets the engine default", () => {
  it("is read, changed and recognised by its ends", () => {
    const s = slate();
    s.nodes[0].relationships.associations = [{ parentId: "a", childId: "b", lineColor: "#333333" }];
    expect(summarizeSlate(s).connections.map((c: any) => c.id)).toEqual(["a->b"]);
    const changed = applyPlanToJSON(s, plan({ kind: "update_connections", connectionIds: ["a->b"], changes: { label: "Leads to" } }));
    expect(changed.report.connectionsUpdated).toEqual(["a->b"]);
    expect(changed.slate.nodes[0].relationships.associations[0]).toMatchObject({ id: "a->b", label: "Leads to" });
    const joined = applyPlanToJSON(s, plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] } }));
    expect(joined.slate.nodes[0].relationships.associations).toHaveLength(1);
  });
});

describe("corr-disconnect-reports-unmade-change: disconnect in either direction, by id, and only what it removed", () => {
  it("removes a to b when asked to disconnect b from a", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "disconnect_nodes", from: { ids: ["b"] }, to: { ids: ["a"] } }));
    expect(result.slate.nodes[0].relationships.associations).toEqual([]);
    expect(result.report.disconnected).toEqual(["a->b"]);
  });

  it("removes by connection id", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "disconnect_nodes", connectionIds: ["a->b"] }));
    expect(result.report.disconnected).toEqual(["a->b"]);
  });

  it("reports nothing removed for two notes that were never joined", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "disconnect_nodes", from: { ids: ["a"] }, to: { ids: ["c"] } }));
    expect(result.report.disconnected).toEqual([]);
    expect(result.report.warnings).toEqual(["Operation 1 matched no connectors."]);
    expect(() => applyPlanToJSON(slate(), plan({ kind: "disconnect_nodes", from: { ids: ["a"] }, to: { ids: ["c"] } }), { requireMatches: true })).toThrow(/matched no connectors/);
  });
});

describe("connector-free-end: a free end reads and writes as a point", () => {
  it("reads a stored free end as a point, not as a missing note", () => {
    const s = slate();
    s.nodes[2].relationships.associations = [{ id: "c->__free_k1", parentId: "c", childId: "__free_k1", targetPoint: { x: 900, y: 400 } }];
    const connection = summarizeSlate(s).connections.find((c: any) => c.from === "c");
    expect(connection).toMatchObject({ id: "c->__free_k1", from: "c", to: null, toPoint: { x: 900, y: 400 } });
  });

  it("makes, moves and removes a free end", () => {
    const made = applyPlanToJSON(slate(), plan({ kind: "connect_nodes", from: { ids: ["c"] }, to: { point: { x: 950, y: 300 } }, ids: ["c-loose"] }));
    const association = made.slate.nodes[2].relationships.associations[0];
    expect(association).toMatchObject({ id: "c-loose", parentId: "c", targetPoint: { x: 950, y: 300 } });
    expect(association.childId).toMatch(/^__free_/);
    const moved = applyPlanToJSON(made.slate, plan({ kind: "update_connections", connectionIds: ["c-loose"], changes: { toPoint: { x: 10, y: 20 } } }));
    expect(moved.slate.nodes[2].relationships.associations[0].targetPoint).toEqual({ x: 10, y: 20 });
    const removed = applyPlanToJSON(moved.slate, plan({ kind: "disconnect_nodes", connectionIds: ["c-loose"] }));
    expect(removed.slate.nodes[2].relationships.associations).toEqual([]);
  });
});

describe("add-note-shape and change-note-shape: shapes come from the engine's registry", () => {
  it("accepts any registered shape and stores its canonical name", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: "Ellipse" } }));
    expect(result.slate.nodes[0].options).toMatchObject({ shape: "ellipse", vectorPath: "ellipse", shapeHint: "ellipse" });
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, shape: "blob" })).errors.join(" ")).toMatch(/shape must be one of: rectangle, roundedrectangle/);
  });
});

describe("set-font-family, border style and animation are validated", () => {
  it("refuses a font the instance does not have and accepts one it does", () => {
    const refused = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { fontFamily: "Comic Papyrus", borderStyle: "wavy", animation: "explode" } }));
    expect(refused.errors.join(" ")).toMatch(/fontFamily must be one of/);
    expect(refused.errors.join(" ")).toMatch(/borderStyle must be one of: solid, dashed, dotted, combo/);
    expect(refused.errors.join(" ")).toMatch(/animation must be one of/);
    expect(validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { fontFamily: "Roboto Slab", animation: null } })).valid).toBe(true);
    expect(validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { fontFamily: "House Font" } }), { fonts: ["House Font"] }).valid).toBe(true);
  });
});

describe("set-slate-background-colour and -gradient: one background shape", () => {
  it("stores colour and gradient in the fields the engine paints", () => {
    const result = applyPlanToJSON(
      slate(),
      plan({ kind: "update_slate", changes: { background: { color: "#102030", gradient: { type: "radial", colors: ["#102030", "#405060"], direction: "vertical" } } } }),
      { userMessage: "make the background a gradient" },
    );
    expect(result.slate.options.containerStyle).toMatchObject({
      backgroundColor: "#102030",
      backgroundColorAsGradient: true,
      backgroundGradientType: "radial",
      backgroundGradientColors: ["#102030", "#405060"],
      backgroundGradientStrategy: "vertical",
    });
    const plain = applyPlanToJSON(result.slate, plan({ kind: "update_slate", changes: { background: { color: "#ffffff" } } }), { userMessage: "white background" });
    expect(plain.slate.options.containerStyle.backgroundColorAsGradient).toBe(false);
  });

  it("refuses unknown background keys", () => {
    expect(validatePlan(plan({ kind: "update_slate", changes: { background: { backgroundColor: "#101820" } } }), { userMessage: "background" }).errors.join(" ")).toMatch(/background has an unknown field: backgroundColor/);
  });
});

describe("caps on notes per slate and operations per plan", () => {
  it("refuses a plan that would pass the note limit", () => {
    const operations = Array.from({ length: 3 }, () => ({ kind: "add_nodes", count: 20, shape: "rectangle" }));
    expect(() => applyPlanToJSON(slate(), plan(...operations), { limits: { notesPerSlate: 50 } })).toThrow(/at most 50 notes/);
    expect(validatePlan(plan(...Array.from({ length: LIMITS.operationsPerPlan + 1 }, () => ({ kind: "add_nodes", count: 1, shape: "rectangle" })))).valid).toBe(false);
  });
});

describe("JSON applier contract kept from the app reducer", () => {
  it("does not mutate its input and materializes ids for replay", () => {
    const input = slate();
    const before = structuredClone(input);
    const first = applyPlanToJSON(input, plan({ kind: "add_nodes", count: 2, shape: "triangle", placement: { relativeTo: "c", direction: "right" } }), { idFactory: ids("t1", "t2") });
    expect(input).toEqual(before);
    expect(first.report.created).toEqual(["t1", "t2"]);
    // RESTATED: a replay says so (replay: true); a fresh plan naming taken ids is refused (review-P03 F2).
    expect(() => applyPlanToJSON(first.slate, first.materializedPlan)).toThrow(expect.objectContaining({ code: "id_taken", status: 409 }));
    const replay = applyPlanToJSON(first.slate, first.materializedPlan, { replay: true });
    expect(replay.report.created).toEqual([]);
    expect(replay.slate.nodes).toHaveLength(5);
  });

  it("removes connectors to a deleted note from every note", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "delete_nodes", target: { ids: ["b"] } }));
    expect(result.slate.nodes.flatMap((n: any) => n.relationships.associations)).toEqual([]);
  });
});

// review-P03 findings: each test below failed before its fix.
const many = (count: number) => ({
  options: { name: "Many" },
  nodes: Array.from({ length: count }, (_, i) => note(`n${i}`, `note ${i}`, (i % 40) * 250, Math.floor(i / 40) * 150)),
});

describe("F1: connecting many notes is bounded and linear", () => {
  it("refuses a connect that would join more pairs than one operation may (422 connector_limit)", () => {
    const run = () => applyPlanToJSON(many(30), plan({ kind: "connect_nodes", from: { all: true }, to: { all: true } }));
    expect(run).toThrow(expect.objectContaining({ code: "connector_limit", status: 422 }));
  });

  it("refuses the reviewer's 160-note fan-out at once instead of working for seconds", () => {
    const adds = Array.from({ length: 8 }, (_, i) => ({ kind: "add_nodes", count: 20, shape: "rectangle", x: 0, y: i * 200 }));
    const started = performance.now();
    expect(() => applyPlanToJSON(many(0), plan(...adds, { kind: "connect_nodes", from: { all: true }, to: { all: true } }))).toThrow(
      expect.objectContaining({ code: "connector_limit" }),
    );
    expect(performance.now() - started).toBeLessThan(2000);
  });

  it("joins thousands of pairs across a plan quickly (timing guard)", () => {
    // 12 operations of 20 x 20 notes on a 1000-note slate: 4800 connectors.
    // Measured: the per-pair full scan took about 900 ms for this; the index about 12 ms.
    const operations = Array.from({ length: 12 }, (_, block) => ({
      kind: "connect_nodes",
      from: { ids: Array.from({ length: 20 }, (_, i) => `n${block * 40 + i}`) },
      to: { ids: Array.from({ length: 20 }, (_, i) => `n${block * 40 + 20 + i}`) },
    }));
    const started = performance.now();
    const result = applyPlanToJSON(many(1000), plan(...operations));
    expect(result.report.connected).toHaveLength(4800);
    expect(performance.now() - started).toBeLessThan(250);
  });

  it("refuses a plan that would pass the connector limit for the slate", () => {
    const run = () =>
      applyPlanToJSON(many(40), plan({ kind: "connect_nodes", from: { ids: ["n0", "n1"] }, to: { ids: ["n2", "n3", "n4"] } }), {
        limits: { connectorsPerSlate: 5 },
      });
    expect(run).toThrow(expect.objectContaining({ code: "connector_limit", status: 422 }));
  });
});

describe("F2: an id already in use is refused, not silently reused", () => {
  it("refuses add_nodes naming an existing note id (409 id_taken)", () => {
    const run = () =>
      applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, shape: "rectangle", ids: ["b"] }, { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] } }));
    expect(run).toThrow(expect.objectContaining({ code: "id_taken", status: 409, details: { ids: ["b"] } }));
  });

  it("refuses add_nodes naming an id made earlier in the same plan", () => {
    const run = () =>
      applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, shape: "rectangle", ids: ["x1"] }, { kind: "add_nodes", count: 1, shape: "rectangle", ids: ["x1"] }));
    expect(run).toThrow(expect.objectContaining({ code: "id_taken" }));
  });

  it("refuses connect_nodes naming a connector id held by another pair, so a later edit cannot hit the old one", () => {
    const run = () =>
      applyPlanToJSON(
        slate(),
        plan(
          { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] }, ids: ["a->b"] },
          { kind: "update_connections", connectionIds: ["a->b"], changes: { label: "L" } },
        ),
      );
    expect(run).toThrow(expect.objectContaining({ code: "id_taken", details: { ids: ["a->b"] } }));
  });

  it("refuses a free end named with a connector id that ends on a note", () => {
    const run = () => applyPlanToJSON(slate(), plan({ kind: "connect_nodes", from: { ids: ["c"] }, to: { point: { x: 1, y: 2 } }, ids: ["a->b"] }));
    expect(run).toThrow(expect.objectContaining({ code: "id_taken" }));
  });

  it("replays a carried-out connect and free end without change", () => {
    const first = applyPlanToJSON(
      slate(),
      plan(
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] }, ids: ["k1"] },
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { point: { x: 5, y: 6 } }, ids: ["k2"] },
      ),
    );
    expect(first.report.connected).toEqual(["k1", "k2"]);
    const again = applyPlanToJSON(first.slate, first.materializedPlan, { replay: true });
    expect(again.report.unchanged).toBe(true);
  });
});

describe("F3: deleting every note through any broad selector needs the explicit request", () => {
  const wipe = (target: any, userMessage = "tidy up") => () => applyPlanToJSON(slate(), plan({ kind: "delete_nodes", target }), { userMessage });

  it("refuses within, contains with all, and groupId that select every note", () => {
    expect(wipe({ within: { x: -1e9, y: -1e9, width: 2e9, height: 2e9 } })).toThrow(/cannot delete every note/);
    expect(wipe({ text: "a", match: "contains", all: true })).toThrow(/cannot delete every note/);
    const grouped = slate();
    grouped.nodes.forEach((node: any) => (node.options.groupId = "g"));
    expect(() => applyPlanToJSON(grouped, plan({ kind: "delete_nodes", target: { groupId: "g" } }), { userMessage: "tidy" })).toThrow(/cannot delete every note/);
  });

  it("allows it on an explicit request, a part of the slate, or named ids", () => {
    expect(wipe({ within: { x: -1e9, y: -1e9, width: 2e9, height: 2e9 } }, "clear the slate")().slate.nodes).toEqual([]);
    expect(wipe({ within: { x: 50, y: 50, width: 600, height: 200 } })().report.deleted).toEqual(["a", "b"]);
    expect(wipe({ ids: ["a", "b", "c"] })().report.deleted).toEqual(["a", "b", "c"]);
  });
});

describe("F4: new note ids are bounded and cannot take the free-end prefix", () => {
  it("refuses a free-end prefix, markup, a connector-like id and an overlong id", () => {
    for (const id of ["__free_evil", "\"><img>", "n0->n0", "x".repeat(65)]) {
      const result = validatePlan(plan({ kind: "add_nodes", count: 1, shape: "rectangle", ids: [id] }));
      expect(result.errors.join(" "), id).toMatch(/ids must be 1 to 64 letters/);
    }
    expect(validatePlan(plan({ kind: "add_nodes", count: 1, shape: "rectangle", ids: ["new_note-1"] })).valid).toBe(true);
  });

  it("refuses an overlong connector id", () => {
    const result = validatePlan(plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["c"] }, ids: ["k".repeat(201)] }));
    expect(result.errors.join(" ")).toMatch(/at most 200 characters/);
  });
});

describe("F8: a connector cannot start from a locked note, as for a person", () => {
  it("skips the locked starting note and reports it", () => {
    const s = slate();
    (s.nodes[2].options as any).isLocked = true;
    const result = applyPlanToJSON(s, plan({ kind: "connect_nodes", from: { ids: ["c", "b"] }, to: { ids: ["a"] } }));
    expect(result.report.connected).toEqual(["b->a"]);
    expect(result.report.skipped).toEqual([{ operation: 1, id: "c", reason: "locked" }]);
    expect(result.materializedPlan.operations[0]).toMatchObject({ from: { ids: ["b"] }, ids: ["b->a"] });
  });
});

// From the app's reducer test (P01 review F1), moved here when the reducer
// became this module: a column once drew a diagonal.
describe("arrange_nodes: each layout lines the notes up as it names", () => {
  it("a row shares y, a column shares x, a grid fills rows", () => {
    const s = slate();
    s.nodes = ["a", "b", "c", "d"].map((id, index) => note(id, id, 100 + index * 37, 60 + index * 91));
    const arrange = (layout: string) =>
      applyPlanToJSON(s, plan({ kind: "arrange_nodes", target: { ids: ["a", "b", "c", "d"] }, layout, gap: 20 }), { userMessage: "Arrange" })
        .slate.nodes.map((n: any) => [n.options.xPos, n.options.yPos]);
    // Width 200 and height 100 plus a gap of 20, from the top-left note's corner.
    expect(arrange("row")).toEqual([[100, 60], [320, 60], [540, 60], [760, 60]]);
    expect(arrange("column")).toEqual([[100, 60], [100, 180], [100, 300], [100, 420]]);
    expect(arrange("grid")).toEqual([[100, 60], [320, 60], [100, 180], [320, 180]]);
  });
});
