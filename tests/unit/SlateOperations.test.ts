import { describe, expect, it, vi } from "vitest";
import {
  applySlateOperations,
  summarizeSlateForOperations,
  validateSlateOperationPlan,
  type SlateOperationPlan,
} from "../../src/core/SlateOperations";

function node(id: string, text: string, xPos: number, yPos: number) {
  return {
    id,
    options: {
      id,
      text,
      shape: "rectangle",
      xPos,
      yPos,
      width: 200,
      height: 100,
      backgroundColor: "#7aa2c8",
    },
  };
}

function mockSlate() {
  const nodes = [
    node("welcome-node", "Welcome!", 100, 100),
    node("flower-node", "Node wrgpblg4h", 100, 450),
  ];
  const invoke = vi.fn((packages: any[]) => {
    packages.forEach((pkg) => {
      if (pkg.type === "onNodeAdded") {
        const options = pkg.data.nodeOptions;
        nodes.push({ id: options.id, options } as any);
      }
    });
  });
  return {
    options: { name: "New Slate", containerStyle: { backgroundColor: "#fff" } },
    nodes: {
      allNodes: nodes,
      one: (id: string) => nodes.find((item) => item.options.id === id),
    },
    collab: { invoke, send: vi.fn() },
  };
}

const plan: SlateOperationPlan = {
  message: "Done — I added three triangles to the right of Welcome.",
  operations: [
    {
      kind: "add_nodes",
      count: 3,
      shape: "triangle",
      ids: ["triangle-1", "triangle-2", "triangle-3"],
      placement: {
        relativeTo: "welcome-node",
        direction: "right",
        arrangement: "column",
      },
    },
  ],
};

describe("SlateOperations", () => {
  it("adds the screenshot's three triangles without changing the slate", () => {
    const slate = mockSlate();
    const originalOptions = structuredClone(slate.options);
    const result = applySlateOperations(slate, plan, {
      userMessage: "3 triangles, to the right of the welcome node",
    });
    expect(result.report.created).toEqual([
      "triangle-1",
      "triangle-2",
      "triangle-3",
    ]);
    expect(slate.options).toEqual(originalOptions);
    const triangles = slate.nodes.allNodes.slice(2).map((item) => item.options);
    expect(triangles.map((item) => item.shape)).toEqual([
      "triangle",
      "triangle",
      "triangle",
    ]);
    expect(triangles.map((item) => [item.xPos, item.yPos])).toEqual([
      [348, 100],
      [348, 278],
      [348, 456],
    ]);
  });

  it("is idempotent when materialized node ids are replayed", () => {
    const slate = mockSlate();
    applySlateOperations(slate, plan, { userMessage: "Add 3 triangles" });
    const second = applySlateOperations(slate, plan, {
      userMessage: "Add 3 triangles",
    });
    expect(second.report.created).toEqual([]);
    expect(slate.nodes.allNodes).toHaveLength(5);
  });

  it("rejects unrequested background changes", () => {
    const result = validateSlateOperationPlan(
      {
        message: "Done.",
        operations: [
          { kind: "update_slate", changes: { background: { color: "purple" } } },
        ],
      },
      { userMessage: "Add three nodes" }
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/explicitly asks/i);
  });

  it("summarizes stable node ids and geometry for AI clients", () => {
    const summary = summarizeSlateForOperations(mockSlate());
    expect(summary.nodeCount).toBe(2);
    expect(summary.nodes[0]).toMatchObject({
      id: "welcome-node",
      text: "Welcome!",
      x: 100,
      y: 100,
    });
  });
});
