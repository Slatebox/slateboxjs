// The validator runs on the server's event loop for every caller (exec, MCP,
// chat, the canvas). A worst-case path must stay cheap, refused or not, and an
// operation that shapes many notes prepares the shape once.
import { describe, expect, it } from "vitest";
import { prepareShape, validateShapePath, SHAPE_LIMITS } from "../../../src/shapes";
import { applyPlanToJSON, validatePlan } from "../../../src/operations";

/** Many small full-turn arcs: the most points per character the grammar allows. */
function arcs(count: number): string {
  let d = "M0 0";
  for (let i = 0; i < count; i++) {
    const x = (i % 20) * 5, y = Math.floor(i / 20) * 5;
    d += `M${x} ${y}A2 2 0 1 1 ${x + 0.1} ${y}Z`;
  }
  return d;
}

/** Arcs in one sub-path, the segment limit's worth. */
function arcRing(): string {
  let d = "M0 50";
  const n = SHAPE_LIMITS.maxSegments - 2;
  for (let i = 1; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    d += `A3 3 0 1 1 ${(50 - 50 * Math.cos(a)).toFixed(1)} ${(50 + 50 * Math.sin(a)).toFixed(1)}`;
  }
  return d + "Z";
}

const time = (fn: () => void) => {
  const start = performance.now();
  fn();
  return performance.now() - start;
};

describe("shape checks have a work budget", () => {
  it("a worst-case valid path prepares in well under 100 ms", () => {
    const d = arcRing();
    expect(d.length).toBeLessThanOrEqual(SHAPE_LIMITS.maxInput);
    const ms = time(() => {
      const prepared = prepareShape({ name: "ring", d });
      expect(prepared.ok).toBe(true);
    });
    expect(ms).toBeLessThan(100);
  });

  it("refused paths are cheap too", () => {
    const ms = time(() => {
      expect(validateShapePath(arcs(400)).ok).toBe(false);
      expect(validateShapePath(arcRing() + "M0 0 L1 1").ok).toBe(false);
    });
    expect(ms).toBeLessThan(100);
  });

  it("shaping 50 notes in one operation prepares the shape once", () => {
    const nodes = Array.from({ length: 50 }, (_, i) => ({
      options: { id: `n${i}`, text: "", shape: "rectangle", vectorPath: "rectangle", xPos: i * 10, yPos: 0, width: 200, height: 100 },
      relationships: { associations: [] },
    }));
    const plan = {
      message: "Done.",
      operations: [{ kind: "update_nodes", target: { ids: nodes.map((n) => n.options.id) }, changes: { shape: { name: "ring", d: arcRing() } } }],
    };
    const ms = time(() => {
      expect(validatePlan(plan as any).valid).toBe(true);
      const { slate } = applyPlanToJSON({ options: { id: "s" }, nodes } as any, plan as any);
      expect(slate.nodes.every((n: any) => n.options.shape === "custom")).toBe(true);
    });
    expect(ms).toBeLessThan(300);
  });
});
