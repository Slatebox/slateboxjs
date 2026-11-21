// Moving a line's ends through the operations module: what an agent (exec) and
// the conversation do to a line the person could do by dragging its ends.
import { describe, expect, it } from "vitest";
import { applyPlanToJSON, slateOperationPlanSchema, summarizeSlate, validatePlan } from "../../../src/operations";
import { packagesForOperation } from "../../../src/core/SlateOperations";

function note(id: string, text: string, xPos: number, yPos: number) {
  return {
    options: { id, text, shape: "rectangle", vectorPath: "rectangle", xPos, yPos, width: 200, height: 100 },
    relationships: { associations: [] as any[] },
  };
}

// sing (left) → asfd (right); Gamma below.
function slate() {
  const nodes = [note("sing", "sing", 100, 100), note("asfd", "asfd", 500, 100), note("gamma", "Gamma", 300, 400)];
  nodes[0].relationships.associations.push({
    id: "sing->asfd", parentId: "sing", childId: "asfd", lineColor: "#333333", lineWidth: 3, lineType: "bezier",
    showParentArrow: false, showChildArrow: true, label: "aha",
  });
  return { _id: "s1", shareId: "share", options: { name: "Demo" }, nodes };
}

const plan = (...operations: any[]) => ({ message: "Done.", operations });
const lines = (s: any) => s.nodes.flatMap((n: any) => n.relationships.associations.map((a: any) => ({ owner: n.options.id, ...a })));
const update = (changes: Record<string, any>, ids = ["sing->asfd"]) => plan({ kind: "update_connections", connectionIds: ids, changes });

describe("pinning and following", () => {
  it("pins both ends where they are now, facing each other", () => {
    const { slate: s, report } = applyPlanToJSON(slate(), update({ ends: "pinned" }));
    const [line] = lines(s);
    expect(line.sourceAnchor).toEqual({ x: 1, y: 0.5 });
    expect(line.targetAnchor).toEqual({ x: 0, y: 0.5 });
    expect(report.connectionsUpdated).toEqual(["sing->asfd"]);
  });

  it("lets both ends follow again", () => {
    const pinned = applyPlanToJSON(slate(), update({ ends: "pinned" })).slate;
    const [line] = lines(applyPlanToJSON(pinned, update({ ends: "follow" })).slate);
    expect(line.sourceAnchor).toBeNull();
    expect(line.targetAnchor).toBeNull();
  });

  it("pins one end to a named side, and leaves the other alone", () => {
    const [line] = lines(applyPlanToJSON(slate(), update({ toEnd: "top" })).slate);
    expect(line.targetAnchor).toEqual({ x: 0.5, y: 0 });
    expect(line.sourceAnchor ?? null).toBeNull();
  });

  it("keeps an end already pinned where it is when asked to pin", () => {
    const first = applyPlanToJSON(slate(), update({ toEnd: "bottom" })).slate;
    const [line] = lines(applyPlanToJSON(first, update({ ends: "pinned" })).slate);
    expect(line.targetAnchor).toEqual({ x: 0.5, y: 1 });
  });

  it("reads each end's state back", () => {
    const pinned = applyPlanToJSON(slate(), update({ fromEnd: "pinned" })).slate;
    const read = summarizeSlate(pinned).connections.find((c: any) => c.id === "sing->asfd");
    expect(read).toMatchObject({ from: "sing", to: "asfd", fromEnd: "pinned", toEnd: "follow" });
  });
});

describe("reconnecting and freeing ends", () => {
  it("moves the far end to another note, keeping the line's id and look", () => {
    const { slate: s, report } = applyPlanToJSON(slate(), update({ toNote: "gamma" }));
    const all = lines(s);
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: "sing->asfd", owner: "sing", parentId: "sing", childId: "gamma", label: "aha" });
    expect(report.connectionsUpdated).toEqual(["sing->asfd"]);
  });

  it("moves the starting end to another note: the line then belongs to it", () => {
    const all = lines(applyPlanToJSON(slate(), update({ fromNote: "gamma" })).slate);
    expect(all).toHaveLength(1);
    expect(all[0]).toMatchObject({ id: "sing->asfd", owner: "gamma", parentId: "gamma", childId: "asfd", showChildArrow: true });
  });

  it("frees the far end at a point; it stays a real saved point", () => {
    const all = lines(applyPlanToJSON(slate(), update({ toPoint: { x: 900, y: 40 } })).slate);
    expect(all[0]).toMatchObject({ id: "sing->asfd", owner: "sing", targetPoint: { x: 900, y: 40 } });
    expect(all[0].childId).toMatch(/^__free_/);
  });

  it("frees the starting end: the note at the other end keeps the line, drawn the same way", () => {
    const all = lines(applyPlanToJSON(slate(), update({ fromPoint: { x: 20, y: 20 } })).slate);
    expect(all).toHaveLength(1);
    // asfd owns it now; its free end is where sing's end was, and the arrow still points at asfd.
    expect(all[0]).toMatchObject({ id: "sing->asfd", owner: "asfd", parentId: "asfd", targetPoint: { x: 20, y: 20 }, showParentArrow: true, showChildArrow: false, label: "aha" });
  });

  it("attaches a free end to a note", () => {
    const free = applyPlanToJSON(slate(), update({ toPoint: { x: 900, y: 40 } })).slate;
    const all = lines(applyPlanToJSON(free, update({ toNote: "gamma" })).slate);
    expect(all[0]).toMatchObject({ childId: "gamma" });
    expect(all[0].targetPoint ?? null).toBeNull();
  });

  it("refuses to free the last end on a note, a line from a note to itself, and a note that is not there", () => {
    const free = applyPlanToJSON(slate(), update({ toPoint: { x: 900, y: 40 } })).slate;
    expect(() => applyPlanToJSON(free, update({ fromPoint: { x: 1, y: 1 } }))).toThrow(/one end on a note/);
    expect(() => applyPlanToJSON(slate(), update({ toNote: "sing" }))).toThrow(/itself/);
    expect(() => applyPlanToJSON(slate(), update({ toNote: "nope" }))).toThrow(/no note/);
    expect(validatePlan(update({ toNote: "gamma", toPoint: { x: 1, y: 2 } })).errors.join(" ")).toMatch(/toNote or toPoint/);
  });
});

describe("the canvas and the room hear of it", () => {
  it("a reconnect goes as the old line out and the new one in, under the same id", () => {
    const before = slate();
    const result = applyPlanToJSON(before, update({ toNote: "gamma" }));
    const packages = packagesForOperation(result.materializedPlan.operations[0], before as any, result.slate as any);
    expect(packages.map((p: any) => p.type)).toEqual(["removeRelationship", "addRelationship"]);
    expect(packages[0].data).toMatchObject({ id: "sing->asfd", parentId: "sing", childId: "asfd" });
    expect(packages[1].data).toMatchObject({ id: "sing->asfd", parentId: "sing", childId: "gamma" });
  });

  it("pinning goes as the two anchors", () => {
    const before = slate();
    const result = applyPlanToJSON(before, update({ ends: "pinned" }));
    const packages = packagesForOperation(result.materializedPlan.operations[0], before as any, result.slate as any);
    expect(packages).toEqual([
      { type: "onLinePropertiesChanged", data: { id: "sing", associationId: "sing->asfd", prop: "sourceAnchor", val: { x: 1, y: 0.5 } } },
      { type: "onLinePropertiesChanged", data: { id: "sing", associationId: "sing->asfd", prop: "targetAnchor", val: { x: 0, y: 0.5 } } },
    ]);
  });

  it("the model's tool describes every end change", () => {
    const changes = slateOperationPlanSchema().properties.operations.items.properties.changes.properties;
    for (const key of ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"]) expect(changes[key]).toBeTruthy();
    expect(changes.ends.enum).toEqual(["follow", "pinned"]);
  });
});
