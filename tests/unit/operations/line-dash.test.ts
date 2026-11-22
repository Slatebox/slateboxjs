// A line's dash (solid, dashed or dotted) is a connector key like its colour or width: a plan
// can draw a dotted line, change one, and a read returns it. The canvas has always drawn and
// saved lineDash (Connector.lineDashArray, compat.v2AssociationToV1); the write contract now
// names it, so an import (a Mermaid `-.->` line) keeps its look.
import { describe, expect, it } from "vitest";
import {
  applyPlanToJSON,
  validatePlan,
  readSlate,
  CONNECTOR_KEYS,
  CONNECTOR_STYLE_KEYS,
} from "../../../src/operations";

function note(id: string, xPos: number) {
  return {
    options: { id, text: id, shape: "rectangle", vectorPath: "rectangle", xPos, yPos: 100, width: 200, height: 100 },
    relationships: { associations: [] as any[] },
  };
}
const slate = () => ({ options: { name: "Lines" }, nodes: [note("a", 100), note("b", 400), note("c", 700)] });
const plan = (...operations: any[]) => ({ message: "Done.", operations });
const association = (result: any, id: string) =>
  result.slate.nodes.flatMap((node: any) => node.relationships.associations).find((a: any) => a.id === id);

describe("lineDash is a connector key", () => {
  it("is offered for new connectors and changes", () => {
    expect(CONNECTOR_KEYS.lineDash.spec).toEqual({ type: "enum", values: ["solid", "dashed", "dotted"] });
    expect(CONNECTOR_STYLE_KEYS).toContain("lineDash");
  });

  it("draws a new dotted line and stores it where the canvas reads it", () => {
    const result = applyPlanToJSON(
      slate(),
      plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, ids: ["a-b"], style: { lineDash: "dotted" } }),
    );
    expect(association(result, "a-b")).toMatchObject({ parentId: "a", childId: "b", lineDash: "dotted" });
  });

  it("changes an existing line's dash", () => {
    const first = applyPlanToJSON(slate(), plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["c"] }, ids: ["a-c"] }));
    const result = applyPlanToJSON(
      first.slate,
      plan({ kind: "update_connections", connectionIds: ["a-c"], changes: { lineDash: "dashed" } }),
    );
    expect(association(result, "a-c").lineDash).toBe("dashed");
  });

  it("refuses a dash the canvas cannot draw", () => {
    const check = validatePlan(
      plan({ kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, style: { lineDash: "wavy" } }),
    );
    expect(check.valid).toBe(false);
    expect(check.errors.join(" ")).toMatch(/lineDash/);
  });

  it("is returned by a read, null when a line never set it", () => {
    const made = applyPlanToJSON(
      slate(),
      plan(
        { kind: "connect_nodes", from: { ids: ["a"] }, to: { ids: ["b"] }, ids: ["a-b"], style: { lineDash: "dashed" } },
        { kind: "connect_nodes", from: { ids: ["b"] }, to: { ids: ["c"] }, ids: ["b-c"] },
      ),
    );
    const read = readSlate(made.slate);
    const byId = Object.fromEntries(read.connections.map((c: any) => [c.id, c]));
    expect(byId["a-b"].lineDash).toBe("dashed");
    expect(byId["b-c"].lineDash).toBeNull();
  });
});
