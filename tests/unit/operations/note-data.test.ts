// The Custom Behavior dialog is retired (owner, 2026-11-21). What it set that a live feature
// still reads is plain note data that chat and exec set through the one operations contract:
//   templateCategory isCategory + categoryName: a template's category (AI template chat,
//                   presentations skip it). "make this a template category called Costs".
//                   Not a bare "category": "group these notes into categories" must not
//                   turn notes into template buckets (review M1, 2026-11-21).
//   hiddenControls  showColorTab / showTextTab / showShapeTab / showImageTab / showEffectTab /
//                   showAITab = false: the style bar leaves those controls off the note.
// Locking a note in place is `locked` (isLocked), the More menu's Locked row.
import { describe, expect, it, vi } from "vitest";
import { applyPlanToJSON, describeOperations, NODE_KEYS, readSlate, SLATE_OPERATION_TOOL, slateOperationPlanSchema, summarizeSlate, validatePlan } from "../../../src/operations";
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

describe("templateCategory: a note is a template category by plain data", () => {
  it("is a note key, described for chat and exec", () => {
    expect(NODE_KEYS.templateCategory).toBeDefined();
    const described = describeOperations() as any;
    expect(JSON.stringify(described)).toContain("templateCategory");
  });

  it("there is no bare category key: grouping notes by theme is not making template buckets", () => {
    expect(NODE_KEYS.category).toBeUndefined();
    const checked = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { category: "Fruit" } }), { userMessage: "categorize these" });
    expect(checked.valid).toBe(false);
  });

  it("the model's tool schema carries what the key does, not a bare string", () => {
    const changes = slateOperationPlanSchema().properties.operations.items.properties.changes.properties;
    expect(changes.templateCategory.description).toMatch(/template/i);
    expect(changes.templateCategory.description).toMatch(/presentation/i);
    expect(changes.hiddenControls.description).toMatch(/style bar/i);
    // Every note key reaches the model with its description, as REST and describeOperations give it.
    for (const key of Object.keys(NODE_KEYS)) expect(changes[key].description, key).toBe(NODE_KEYS[key].description);
  });

  it("update_nodes stores isCategory and categoryName where the template chat reads them", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { templateCategory: "Costs" } }));
    expect(optionsOf(result, "a")).toMatchObject({ isCategory: true, categoryName: "Costs" });
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].templateCategory).toBe("Costs");
  });

  it("null makes it an ordinary note again", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { isCategory: true, categoryName: "Costs" });
    const result = applyPlanToJSON(start, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { templateCategory: null } }));
    expect(optionsOf(result, "a").isCategory).toBe(false);
    expect(optionsOf(result, "a").categoryName).toBeUndefined();
    expect(readSlate(result.slate, { ids: ["a"] }).nodes[0].templateCategory).toBeNull();
  });

  it("a note with no category reads null, and a saved isCategory without a name reads null", () => {
    const start = slate();
    start.nodes[1].options = { ...start.nodes[1].options, isCategory: true } as any;
    const read = readSlate(start, {}).nodes;
    expect(read.map((n: any) => n.templateCategory)).toEqual([null, null]);
  });

  it("add_nodes takes it in style", () => {
    const result = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, ids: ["c"], shape: "rectangle", text: "Benefits", style: { templateCategory: "Benefits" } }));
    expect(optionsOf(result, "c")).toMatchObject({ isCategory: true, categoryName: "Benefits" });
  });

  it("refuses an empty or non-text category", () => {
    for (const bad of ["", "   ", 3, true]) {
      const checked = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { templateCategory: bad } }), { userMessage: "x" });
      expect(checked.valid).toBe(false);
      expect(checked.errors.join(" ")).toMatch(/templateCategory/);
    }
  });

  it("the summary chat reads says which notes are categories", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { isCategory: true, categoryName: "Costs" });
    const summary = summarizeSlate(start);
    expect(summary.nodes[0]).toMatchObject({ id: "a", templateCategory: "Costs" });
    expect("templateCategory" in summary.nodes[1]).toBe(false);
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

  it("the summary chat reads lists a note's hidden controls, so a change can keep the ones already hidden", () => {
    const start = slate();
    Object.assign(start.nodes[0].options, { showColorTab: false, showAITab: false });
    const summary = summarizeSlate(start);
    expect(summary.nodes[0]).toMatchObject({ id: "a", hiddenControls: ["color", "ask"] });
    expect("hiddenControls" in summary.nodes[1]).toBe(false);
  });

  it("says the list replaces the note's whole list, and does not promise more than the bar does", () => {
    const description = NODE_KEYS.hiddenControls.description;
    expect(description).toMatch(/whole list/i);
    expect(description).not.toMatch(/cannot use/i);
  });

  it("the model's tool schema keeps to keywords every provider takes: no uniqueItems (checkValue refuses repeats)", () => {
    expect(JSON.stringify(SLATE_OPERATION_TOOL.parameters)).not.toContain("uniqueItems");
    const checked = validatePlan(plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { hiddenControls: ["color", "color"] } }), { userMessage: "x" });
    expect(checked.valid).toBe(false);
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
    applySlateOperations(s, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { templateCategory: "Costs", hiddenControls: ["color"] } }), { userMessage: "make Costs a category" });
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
    applySlateOperations(s, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { templateCategory: null } }), { userMessage: "x" });
    const packages = s.collab.send.mock.calls.flatMap(([value]: any[]) => value);
    expect(packages).toContainEqual({ type: "onNodeOptionsChanged", data: { id: "a", options: { isCategory: false, categoryName: null } } });
  });
});
