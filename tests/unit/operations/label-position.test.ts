// Where a line's label sits along it is a connector key like its dash: a plan can place a label
// nearer one end (labelPosition, 0.05 to 0.95 from the line's start; the middle when unset), the
// slate stores it on the line, a save keeps it, and a read returns it. Two lines between the same
// two notes are drawn on one path, so this is how their labels keep apart (a Mermaid import of
// "A -->|request| B" and "B -->|response| A").
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  readSlate,
  CONNECTOR_KEYS,
  CONNECTOR_STYLE_KEYS,
} from "../../../src/operations";
import { v1AssociationToV2, v2AssociationToV1 } from "../../../src/core/compat";

function note(id: string, xPos: number) {
  return {
    options: { id, text: id, shape: "rectangle", vectorPath: "rectangle", xPos, yPos: 100, width: 200, height: 100 },
    relationships: { associations: [] as any[] },
  };
}
const slate = () => ({ options: { name: "Lines" }, nodes: [note("a", 100), note("b", 400)] });
const plan = (...operations: any[]) => ({ message: "Done.", operations });
const association = (result: any, id: string) =>
  result.slate.nodes.flatMap((node: any) => node.relationships.associations).find((a: any) => a.id === id);

describe("labelPosition is a connector key", () => {
  it("is offered for new connectors and changes, between 0.05 and 0.95", () => {
    expect(CONNECTOR_KEYS.labelPosition.spec).toEqual({ type: "number", min: 0.05, max: 0.95 });
    expect(CONNECTOR_STYLE_KEYS).toContain("labelPosition");
  });

  it("places a new line's label and stores it on the line", () => {
    const result = applyPlanToJSON(
      slate(),
      plan(
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, ids: ["a-b"], style: { label: "request", labelPosition: 0.3 } },
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["a"] }, ids: ["b-a"], style: { label: "response", labelPosition: 0.3 } },
      ),
    );
    expect(association(result, "a-b")).toMatchObject({ label: "request", labelPosition: 0.3 });
    expect(association(result, "b-a")).toMatchObject({ label: "response", labelPosition: 0.3 });
  });

  it("moves an existing label", () => {
    const first = applyPlanToJSON(slate(), plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, ids: ["a-b"], style: { label: "x" } }));
    const result = applyPlanToJSON(first.slate, plan({ kind: "update_connections", connectionIds: ["a-b"], changes: { labelPosition: 0.7 } }));
    expect(association(result, "a-b").labelPosition).toBe(0.7);
  });

  it("refuses a place off the line", () => {
    for (const value of [0, 1, -0.2, 2, "middle"]) {
      const check = validatePlan(plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, style: { labelPosition: value } }));
      expect(check.valid, String(value)).toBe(false);
      expect(check.errors.join(" ")).toMatch(/labelPosition/);
    }
  });

  it("is returned by a read, null when a line never set it", () => {
    const made = applyPlanToJSON(
      slate(),
      plan(
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, ids: ["a-b"], style: { labelPosition: 0.25 } },
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["a"] }, ids: ["b-a"] },
      ),
    );
    const byId = Object.fromEntries(readSlate(made.slate).connections.map((c: any) => [c.id, c]));
    expect(byId["a-b"].labelPosition).toBe(0.25);
    expect(byId["b-a"].labelPosition).toBeNull();
  });

  it("survives a save and a load (v2 to v1 and back), and a line without one stays without one", () => {
    const placed = v1AssociationToV2({ parentId: "a", childId: "b", label: "x", labelPosition: 0.3 });
    expect(placed.labelPosition).toBe(0.3);
    expect(v2AssociationToV1(placed).labelPosition).toBe(0.3);
    const plain = v1AssociationToV2({ parentId: "a", childId: "b", label: "x" });
    expect("labelPosition" in plain).toBe(false);
    expect("labelPosition" in v2AssociationToV1(plain)).toBe(false);
  });
});
