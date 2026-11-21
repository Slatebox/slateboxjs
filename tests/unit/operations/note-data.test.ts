// The Custom Behavior dialog is retired (owner, 2026-11-21). What it set that a live feature
// still reads is plain note data that chat and exec set through the one operations contract:
//   category        isCategory + categoryName: a template's category (AI template chat,
//                   presentations skip it). "make this a category called Costs".
//   hiddenControls  showColorTab / showTextTab / showShapeTab / showImageTab / showEffectTab /
//                   showAITab = false: the style bar leaves those controls off the note.
// Locking a note in place is `locked` (isLocked), the More menu's Locked row.
import { describe, expect, it, vi } from "vitest";
import { applyPlanToJSON, describeOperations, NODE_KEYS, readSlate, summarizeSlate, validatePlan } from "../../../src/operations";
import { applySlateOperations } from "../../../src/core/SlateOperations";

const plan = (...operations: any[]) => ({ message: "Done.", operations });

function note(id: string, text: string, extra: Record<string, any> = {}) {
  return {
    options: { id, text, shape: "rectangle", vectorPath: "rectangle", xPos: 100, yPos: 100, width: 200, height: 100, ...extra },
    relationships: { associations: [] as any[] },
  };
}
const slate = () => ({ _id: "s1", shareId: "share", options: { name: "Demo" }, nodes: [note("a", "Costs"), note("b", "Rent")] });
const optionsOf = (result: any, id: string) => result.slate.nodes.find((n: any) => n.options.id === id).options;

describe("category: a note is a template category by plain data", () => {
  it("is a note key, described for chat and exec", () => {
    expect(NODE_KEYS.category).toBeDefined();
    const described = describeOperations() as any;
    expect(JSON.stringify(described)).toContain("category");
  });

  it("update_nodes stores isCategory and categoryName where the template chat reads them", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: "Costs" } }));
    expect(optionsOf(result, "a")).toMatchObject({ isCategory: true, categoryName: "Costs" });
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].category).toBe("Costs");
  });

  it("null makes it an ordinary note again", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { isCategory: true, categoryName: "Costs" });
    const result = applyPlanToJSON(start, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: null } }));
    expect(optionsOf(result, "a").isCategory).toBe(false);
    expect(optionsOf(result, "a").categoryName).toBeUndefined();
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].category).toBeNull();
  });

  it("a note with no category reads null, and a saved isCategory without a name reads null", () => {
    const start = slate();
    start.nodes[1].options = { ...start.nodes[1].options, isCategory: true } as any;
    const read = readSlate(start, {}).nodes;
    expect(read.map((n: any) => n.category)).toEqual([null, null]);
  });

  it("add_nodes takes it in style", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, ids: ["c"], shape: "rectangle", text: "Benefits", style: { category: "Benefits" } }));
    expect(optionsOf(result, "c")).toMatchObject({ isCategory: true, categoryName: "Benefits" });
  });

  it("refuses an empty or non-text category", () => {
    for (const bad of ["", "   ", 3, true]) {
      const checked = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: bad } }), { userMessage: "x" });
      expect(checked.valid).toBe(false);
      expect(checked.errors.join(" ")).toMatch(/category/);
    }
  });

  it("the summary chat reads says which notes are categories", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { isCategory: true, categoryName: "Costs" });
    const summary = summarizeSlate(start);
    expect(summary.nodes[0]).toMatchObject({ id: "a", category: "Costs" });
    expect("category" in summary.nodes[1]).toBe(false);
  });
});

describe("hiddenControls: which style-bar controls a note leaves off", () => {
  it("stores each hidden control as its showXTab = false, and the rest as shown", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { hiddenControls: ["color", "shape"] } }));
    expect(optionsOf(result, "a")).toMatchObject({
      showColorTab: false, showShapeTab: false, showTextTab: true, showImageTab: true, showEffectTab: true, showAITab: true,
    });
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].hiddenControls).toEqual(["color", "shape"]);
  });

  it("an empty list shows every control again", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { showColorTab: false, showTextTab: false });
    const result = applyPlanToJSON(start, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { hiddenControls: [] } }));
    expect(optionsOf(result, "a")).toMatchObject({ showColorTab: true, showTextTab: true });
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].hiddenControls).toEqual([]);
  });

  it("reads a saved template's flags back in one order, whatever order they were written in", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { showAITab: false, showColorTab: false });
    expect(readSlate(start, { ids: ["a"] }).nodes[0].hiddenControls).toEqual(["color", "ask"]);
  });

  it("refuses an unknown control or a non-list", () => {
    for (const bad of [["colour-wheel"], "color", [3], null]) {
      const checked = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { hiddenControls: bad } }), { userMessage: "x" });
      expect(checked.valid).toBe(false);
      expect(checked.errors.join(" ")).toMatch(/hiddenControls/);
    }
  });

  it("is described as a list of the bar's controls", () => {
    const text = JSON.stringify(describeOperations());
    for (const control of ["color", "text", "shape", "picture", "effects", "ask"]) expect(text).toContain(`"${control}"`);
  });
});

describe("live: the canvas and the room get one note-data package", () => {
  function live() {
    const nodes = [note("a", "Costs"), note("b", "Rent")].map((n) => ({ id: n.options.id, ...n }));
    return {
      options: { name: "Demo", containerStyle: { backgroundColor: "#fff" } },
      nodes: { allNodes: nodes, one: (id: string) => nodes.find((n) => n.options.id === id) },
      collab: { invoke: vi.fn(), send: vi.fn() },
    };
  }

  it("update_nodes with category and hiddenControls sends onNodeOptionsChanged with the stored values", () => {
    const s = live();
    applySlateOperations(s, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: "Costs", hiddenControls: ["color"] } }), { userMessage: "make Costs a category" });
    const packages = s.collab.send.mock.calls.flatMap(([value]: any[]) => value);
    expect(packages).toContainEqual({
      type: "onNodeOptionsChanged",
      data: {
        id: "a",
        options: {
          isCategory: true, categoryName: "Costs",
          showColorTab: false, showTextTab: true, showShapeTab: true, showImageTab: true, showEffectTab: true, showAITab: true,
        },
      },
    });
  });

  it("clearing the category sends categoryName null so every canvas drops it", () => {
    const s = live();
    Object.assign(s.nodes.allNodes[0].options, { isCategory: true, categoryName: "Costs" });
    applySlateOperations(s, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: null } }), { userMessage: "x" });
    const packages = s.collab.send.mock.calls.flatMap(([value]: any[]) => value);
    expect(packages).toContainEqual({ type: "onNodeOptionsChanged", data: { id: "a", options: { isCategory: false, categoryName: null } } });
  });
});
