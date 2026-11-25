// A model's plan: what the schema tells it about every field (count above all), the repairs made
// only where the meaning is certain (normalizePlan), and the refusal grouped so a model can fix it
// (groupPlanErrors, planErrorHints). The logged case: a free-form request ("snappable congruent
// pieces to compose new printable materials") whose 28-operation plan gave no add_nodes a count
// and named connect_nodes' new connectors with connectionIds.
import { describe, expect, it } from "vitest";
import {
  groupPlanErrors,
  normalizePlan,
  operationPlanRetryPrompt,
  operationRanges,
  operationsDescription,
  planErrorHints,
  planErrorsOf,
  slateOperationPlanSchema,
  SLATE_OPERATION_TOOL,
  validatePlan,
} from "../../../src/operations";

// The shape of the logged plan: one add_nodes per note with ids [id] and no count, then connectors with connectionIds.
function loggedPlan() {
  const operations: any[] = [];
  const piece = (id: string, x: number, y: number) =>
    operations.push({ kind: "add_nodes", ids: [id], shape: "rectangle", x, y, width: 100, height: 100, style: { backgroundColor: "#BFDBFE" } });
  operations.push({ kind: "add_nodes", ids: ["kit_title"], shape: "roundedrectangle", text: "Printable kit", x: 0, y: 0, width: 880, height: 64 });
  operations.push({ kind: "add_nodes", ids: ["kit_label"], preset: "text", text: "The kit", x: 0, y: 132, width: 320, height: 32 });
  for (let i = 0; i < 9; i += 1) piece("kit_" + (i + 1), (i % 3) * 100, 170 + Math.floor(i / 3) * 100);
  operations.push({ kind: "connect_nodes", from: { ids: ["kit_label"] }, to: { ids: ["kit_1"] }, connectionIds: ["conn_a"] });
  operations.push({ kind: "connect_nodes", from: { ids: ["kit_1"] }, to: { ids: ["kit_2"] }, connectionIds: ["conn_b"] });
  return { message: "Added a printable kit of snappable pieces.", operations };
}

describe("the schema says what every operation field is for", () => {
  const schema = slateOperationPlanSchema();
  const operations = schema.properties.operations;
  const item = operations.items.properties;

  it("count is described as required on add_nodes, with how it relates to ids", () => {
    expect(item.count.description).toMatch(/add_nodes only, and required there/);
    expect(item.count.description).toMatch(/ids\.length/);
  });

  it("connectionIds is described as disconnect and update only; connect_nodes uses ids", () => {
    expect(item.connectionIds.description).toMatch(/disconnect_nodes and update_connections only/);
    expect(item.connectionIds.description).toMatch(/connect_nodes names its new connectors with ids/);
  });

  it("the fields by kind sit on the operations property itself, not only on its items", () => {
    expect(operations.description).toContain("add_nodes: count, shape, preset, text, ids");
    expect(operations.description).toContain("connect_nodes: from, to, ids, style");
    expect(operations.description).toMatch(/add_nodes requires count/);
    expect(operations.items.description).toMatch(/add_nodes requires count/);
  });

  it("the model tool carries the same words", () => {
    expect(SLATE_OPERATION_TOOL.parameters.properties.operations.description).toBe(operations.description);
    expect(SLATE_OPERATION_TOOL.parameters.properties.operations.items.properties.count.description).toBe(item.count.description);
  });

  it("every example in the description is a valid operation", () => {
    const text = operationsDescription();
    const examples = [...text.matchAll(/\{"kind":.*?\}(?=; \{"kind"|\.$)/g)].map((m) => JSON.parse(m[0]));
    expect(examples.map((e) => e.kind)).toEqual(["add_nodes", "add_nodes", "connect_nodes", "update_nodes"]);
    expect(validatePlan({ message: "Examples", operations: examples })).toEqual({ valid: true, errors: [] });
  });
});

describe("normalizePlan repairs only what has one meaning", () => {
  it("a whole number written as text becomes that number", () => {
    const { plan, changes } = normalizePlan({ message: "m", operations: [{ kind: "add_nodes", count: "3", shape: "rectangle", x: "10", y: " 20 ", width: "120.5" }, { kind: "arrange_nodes", target: { all: true }, layout: "row", gap: "40" }] });
    expect(plan.operations[0]).toMatchObject({ count: 3, x: 10, y: 20, width: 120.5 });
    expect(plan.operations[1].gap).toBe(40);
    expect(changes).toHaveLength(5);
    expect(validatePlan(plan).valid).toBe(true);
  });

  it("a missing count with new note ids is the number of ids", () => {
    const { plan, changes } = normalizePlan({ message: "m", operations: [{ kind: "add_nodes", ids: ["a", "b"], shape: "rectangle" }] });
    expect(plan.operations[0].count).toBe(2);
    expect(changes).toEqual(["Operation 1 count read as 2, one note per id."]);
  });

  it("never invents: no ids, a zero, a fraction, words, a negative or a renamed field stay for validatePlan to refuse", () => {
    const input = {
      message: "m",
      operations: [
        { kind: "add_nodes", shape: "rectangle" },
        { kind: "add_nodes", count: 0, shape: "rectangle" },
        { kind: "add_nodes", count: "2.5", shape: "rectangle" },
        { kind: "add_nodes", count: "three", shape: "rectangle" },
        { kind: "add_nodes", count: "-2", shape: "rectangle" },
        { kind: "add_nodes", amount: 2, shape: "rectangle" },
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, connectionIds: ["c"] },
        { kind: "update_nodes", target: { ids: ["a"] }, changes: { width: "200" } },
      ],
    };
    const { plan, changes } = normalizePlan(input);
    expect(changes).toEqual([]);
    expect(plan).toBe(input);
    const { errors } = validatePlan(plan);
    for (const n of [1, 2, 3, 4, 5, 6]) expect(errors).toContain(`Operation ${n} count must be an integer from 1 to 20.`);
    expect(errors).toContain("Operation 6 has an unknown field: amount.");
    expect(errors).toContain("Operation 7 has an unknown field: connectionIds.");
  });

  it("leaves the input alone", () => {
    const input = { message: "m", operations: [{ kind: "add_nodes", ids: ["a"], shape: "rectangle" }] };
    const copy = structuredClone(input);
    normalizePlan(input);
    expect(input).toEqual(copy);
  });

  it("the logged plan: as written it fails on every add_nodes; normalized, only the connectors' field is left; corrected, it passes", () => {
    const logged = loggedPlan();
    const before = validatePlan(logged);
    expect(before.valid).toBe(false);
    expect(before.errors.filter((e) => /count must be/.test(e))).toHaveLength(11);
    const { plan } = normalizePlan(logged);
    expect(validatePlan(plan).errors).toEqual(["Operation 12 has an unknown field: connectionIds.", "Operation 13 has an unknown field: connectionIds."]);
    const corrected = { ...plan, operations: plan.operations.map(({ connectionIds, ...op }: any) => (op.kind === "connect_nodes" ? { ...op, ids: connectionIds } : op)) };
    expect(validatePlan(corrected)).toEqual({ valid: true, errors: [] });
  });
});

describe("a refused plan's problems, grouped", () => {
  it("ranges", () => {
    expect(operationRanges([5, 1, 2, 3, 9, 7, 8])).toBe("1–3, 5, 7–9");
  });

  it("the same problem on many operations is one line, the plural verb read right", () => {
    const { errors } = validatePlan(loggedPlan());
    const groups = groupPlanErrors(errors);
    expect(groups.map((g) => g.message)).toEqual([
      "Operations 1–11: count must be an integer from 1 to 20.",
      "Operations 12–13 have an unknown field: connectionIds.",
    ]);
    expect(groups[0].operations).toHaveLength(11);
  });

  it("one operation keeps its own sentence; a plan-wide problem stands alone", () => {
    expect(groupPlanErrors(["Operation 4 needs both x and y, or neither.", "A natural completion message is required."]).map((g) => g.message))
      .toEqual(["Operation 4 needs both x and y, or neither.", "A natural completion message is required."]);
  });

  it("a joined refusal message splits back into its problems", () => {
    const { errors } = validatePlan(loggedPlan());
    expect(planErrorsOf(errors.join(" "))).toEqual(errors);
  });

  it("hints say once what each field wants", () => {
    const hints = planErrorHints(validatePlan(loggedPlan()).errors);
    expect(hints).toEqual([
      'add_nodes requires count, a whole number: how many notes it adds. With ids, count is ids.length (count 1 with ids ["a"]).',
      "connect_nodes names its new connectors with ids; connectionIds is only for disconnect_nodes and update_connections.",
    ]);
    expect(planErrorHints(["Operation 2 has an unknown field: layout."])).toEqual(["layout belongs to arrange_nodes only."]);
  });

  it("the retry prompt is grouped, with the hints", () => {
    const prompt = operationPlanRetryPrompt(validatePlan(loggedPlan()).errors);
    expect(prompt).toContain("Operations 1–11: count must be an integer from 1 to 20.");
    expect(prompt).toContain("connect_nodes names its new connectors with ids");
    expect(prompt.match(/\bOperations? \d/g)).toHaveLength(2);
  });
});
