// Operations with custom shapes: a validated shape object is stored with its
// fill rule, text box and library reference; read-backs name it, never the path.
import { describe, expect, it } from "vitest";
import { applyPlanToJSON, describeOperations, slateOperationPlanSchema, SLATE_OPERATION_TOOL, summarizeSlate, validatePlan } from "../../../src/operations";
import { packagesForOperation } from "../../../src/core/SlateOperations";

const ROCKET = "M50,0 C64,10 72,28 72,50 L72,74 L88,90 L88,100 L70,92 L30,92 L12,100 L12,90 L28,74 L28,50 C28,28 36,10 50,0 Z M41,34 A9,9 0 1 1 59,34 A9,9 0 1 1 41,34 Z M40,92 L50,100 L60,92 Z";
const plan = (...operations: any[]) => ({ message: "Done.", operations });

function slate() {
  return {
    options: { id: "s" },
    nodes: [
      { options: { id: "a", text: "A", shape: "rectangle", vectorPath: "rectangle", xPos: 0, yPos: 0, width: 200, height: 100 }, relationships: { associations: [] } },
      { options: { id: "b", text: "B", shape: "rectangle", vectorPath: "rectangle", xPos: 300, yPos: 0, width: 200, height: 100 }, relationships: { associations: [] } },
    ],
  };
}

const rocket = { name: "Rocket", d: ROCKET, fillRule: "evenodd", ref: { id: "shp_1", name: "Rocket" } };

describe("custom shapes through the operation contract", () => {
  it("validates and stores a custom shape on update_nodes", () => {
    const p = plan({ kind: "update_nodes", target: { ids: ["a", "b"] }, changes: { shape: rocket } });
    expect(validatePlan(p)).toEqual({ valid: true, errors: [] });
    const { slate: next } = applyPlanToJSON(slate(), p);
    for (const node of next.nodes) {
      expect(node.options).toMatchObject({ shape: "custom", fillRule: "evenodd", shapeRef: { id: "shp_1", name: "Rocket" } });
      expect(node.options.vectorPath.startsWith("M")).toBe(true);
      expect(node.options.textBox).toMatchObject({ w: expect.any(Number) });
    }
  });

  it("keeps the outline's proportions on update_nodes (width kept, height follows)", () => {
    const p = plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket } });
    const { slate: next } = applyPlanToJSON(slate(), p);
    const options = next.nodes[0].options;
    expect(options.width).toBe(200);
    // The rocket is 76 wide for 100 tall: about 263 tall at 200 wide.
    expect(options.width / options.height).toBeCloseTo(0.76, 1);
    // A size given with the shape wins.
    const sized = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket, width: 100, height: 100 } })).slate;
    expect(sized.nodes[0].options).toMatchObject({ width: 100, height: 100 });
    const tall = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket, height: 150 } })).slate;
    expect(tall.nodes[0].options.width).toBe(Math.round(150 * 0.76));
  });

  it("refuses an invalid path with the validator's sentence", () => {
    const p = plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: { name: "x", d: "M0 0 L1e9 0 Z" } } });
    const result = validatePlan(p);
    expect(result.valid).toBe(false);
    expect(JSON.stringify(result)).toMatch(/not a usable custom shape/);
  });

  it("adds notes in a custom shape, sized from its proportions", () => {
    const { slate: next, report } = applyPlanToJSON(slate(), plan({ kind: "add_nodes", count: 1, shape: rocket, ids: ["r1"] }));
    expect(report.created).toEqual(["r1"]);
    const made = next.nodes.find((n: any) => n.options.id === "r1")!.options;
    expect(made.shape).toBe("custom");
    expect(made.height).toBeGreaterThan(made.width);
  });

  it("reads back custom:<name>, and summaries never carry the path", () => {
    const { slate: next } = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket } }));
    const summary = summarizeSlate(next as any);
    expect(summary.nodes.find((n) => n.id === "a")!.shape).toBe("custom:Rocket");
    expect(JSON.stringify(summary)).not.toContain("C64");
  });

  it("going back to a named shape clears the custom options", () => {
    const first = applyPlanToJSON(slate(), plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket } })).slate;
    const { slate: next } = applyPlanToJSON(first, plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: "ellipse" } }));
    const options = next.nodes[0].options;
    expect(options).toMatchObject({ shape: "ellipse", vectorPath: "ellipse" });
    expect(options.fillRule).toBeUndefined();
    expect(options.textBox).toBeUndefined();
  });

  it("the JSON Schema publishes both forms; the model tool lists names only", () => {
    const shape = describeOperations().noteKeys.shape;
    expect(shape.oneOf[0]).toMatchObject({ type: "string", enum: expect.arrayContaining(["rectangle"]) });
    expect(shape.oneOf[1]).toMatchObject({ type: "object", required: ["name", "d"] });
    expect(shape.oneOf[1].properties.d.maxLength).toBe(8000);
    expect(shape.oneOf[1].properties.fillRule.enum).toEqual(["nonzero", "evenodd"]);
    const item = slateOperationPlanSchema().properties.operations.items.properties;
    expect(item.shape.oneOf).toHaveLength(2);
    const tool = JSON.stringify(SLATE_OPERATION_TOOL.parameters);
    expect(tool).not.toContain("oneOf");
    expect(SLATE_OPERATION_TOOL.parameters.properties.operations.items.properties.shape).toMatchObject({ type: "string" });
  });
});

describe("the live applier sends the custom shape to the room", () => {
  it("packages carry the path, fill rule and text box", () => {
    const before = slate() as any;
    const p = plan({ kind: "update_nodes", target: { ids: ["a"] }, changes: { shape: rocket } });
    const after = applyPlanToJSON(before, p).slate as any;
    const packages = packagesForOperation(p.operations[0], before, after);
    const shape = packages.find((pkg) => pkg.type === "onNodeShapeChanged");
    expect(shape.data).toMatchObject({ id: "a", shape: "custom", fillRule: "evenodd", shapeRef: { name: "Rocket" } });
    expect(shape.data.vectorPath.startsWith("M")).toBe(true);
    expect(shape.data.textBox).toBeTruthy();
    const resized = packages.find((pkg) => pkg.type === "onNodeResized");
    expect(resized.data).toMatchObject({ id: "a", width: 200, height: after.nodes[0].options.height });
  });
});
