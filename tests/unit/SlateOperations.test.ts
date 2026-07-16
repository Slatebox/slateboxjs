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
    relationships: { associations: [] as any[] },
  };
}

function mockSlate() {
  const nodes = [
    node("welcome-node", "Welcome!", 100, 100),
    node("flower-node", "Node wrgpblg4h", 100, 450),
  ];
  nodes[0].relationships.associations.push({
    id: "welcome->flower",
    parentId: "welcome-node",
    childId: "flower-node",
    label: "",
    lineColor: "#333333",
    lineWidth: 3,
    lineType: "bezier",
    showParentArrow: false,
    showChildArrow: true,
  });
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
          {
            kind: "update_slate",
            changes: { background: { color: "purple" } },
          },
        ],
      },
      { userMessage: "Add three nodes" },
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
    expect(summary.connections).toEqual([
      expect.objectContaining({
        id: "welcome->flower",
        from: "welcome-node",
        to: "flower-node",
      }),
    ]);
  });

  it("updates an existing connection through the collaboration contract", () => {
    const slate = mockSlate();
    const result = applySlateOperations(
      slate,
      {
        message: "Done — I labeled the line and moved its arrowhead.",
        operations: [
          {
            kind: "update_connections",
            connectionIds: ["welcome->flower"],
            changes: {
              label: "Explains",
              showParentArrow: true,
              showChildArrow: false,
            },
          },
        ],
      },
      { userMessage: "Label that line Explains and point it toward Welcome" },
    );
    expect(result.report.connectionsUpdated).toEqual(["welcome->flower"]);
    const packages = slate.collab.invoke.mock.calls.flatMap(([value]) => value);
    expect(packages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "onLinePropertiesChanged",
          data: expect.objectContaining({
            id: "welcome-node",
            associationId: "welcome->flower",
            prop: "label",
            val: "Explains",
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            prop: "showChildArrow",
            val: false,
          }),
        }),
      ]),
    );
  });

  it("rejects hallucinated connection ids and unsupported line changes", () => {
    const result = validateSlateOperationPlan(
      {
        message: "Done.",
        operations: [
          {
            kind: "update_connections",
            connectionIds: ["invented-edge"],
            changes: { madeUpLineSetting: true },
          },
        ],
      },
      {
        userMessage: "Update the line",
        existingNodeIds: ["welcome-node", "flower-node"],
        existingConnectionIds: ["welcome->flower"],
      },
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/not in the slate/i);
    expect(result.errors.join(" ")).toMatch(/unsupported connection changes/i);
  });

  it("rejects unsupported shapes in existing-node edits", () => {
    const result = validateSlateOperationPlan(
      {
        message: "Done.",
        operations: [
          {
            kind: "update_nodes",
            target: { ids: ["welcome-node"] },
            changes: { shape: "invented-shape" as any },
          },
        ],
      },
      { existingNodeIds: ["welcome-node"] },
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/unsupported shape/i);
  });

  it("rejects unknown styles and unsafe operation value types", () => {
    const result = validateSlateOperationPlan(
      {
        message: "Done.",
        operations: [
          {
            kind: "add_nodes",
            count: 1,
            shape: "triangle",
            style: { madeUpStyle: true, opacity: 4 },
          },
          {
            kind: "update_nodes",
            target: { ids: ["welcome-node"] },
            changes: { width: -10, locked: "yes" },
          },
          {
            kind: "connect_nodes",
            from: { ids: ["welcome-node"] },
            to: { ids: ["flower-node"] },
            style: { lineWidth: 0, showChildArrow: "yes" },
          },
        ],
      },
      { existingNodeIds: ["welcome-node", "flower-node"] },
    );
    expect(result.valid).toBe(false);
    expect(result.errors.join(" ")).toMatch(/unsupported node styles/i);
    expect(result.errors.join(" ")).toMatch(
      /opacity must be a number from 0 to 1/i,
    );
    expect(result.errors.join(" ")).toMatch(
      /width must be a number from 20 to 5000/i,
    );
    expect(result.errors.join(" ")).toMatch(/locked must be true or false/i);
    expect(result.errors.join(" ")).toMatch(
      /lineWidth must be a number from 0.1 to 100/i,
    );
    expect(result.errors.join(" ")).toMatch(
      /showChildArrow must be true or false/i,
    );
  });

  it("emits a text package for alignment-only edits", () => {
    const slate = mockSlate();
    applySlateOperations(
      slate,
      {
        message: "Done — I aligned the text.",
        operations: [
          {
            kind: "update_nodes",
            target: { ids: ["welcome-node"] },
            changes: { textXAlign: "left", textYAlign: "top" },
          },
        ],
      },
      { userMessage: "Align Welcome text top left" },
    );
    const packages = slate.collab.invoke.mock.calls.flatMap(([value]) => value);
    expect(packages).toContainEqual({
      type: "onNodeTextChanged",
      data: expect.objectContaining({
        id: "welcome-node",
        textXAlign: "left",
        textYAlign: "top",
      }),
    });
  });

  it("emits collaboration packages for every supported mutation family", () => {
    const slate = mockSlate();
    const result = applySlateOperations(
      slate,
      {
        message: "Done — I updated the selected content.",
        operations: [
          {
            kind: "update_nodes",
            target: { ids: ["welcome-node"] },
            changes: {
              text: "Start here",
              shape: "ellipse",
              x: 250,
              y: 275,
              width: 260,
              height: 140,
              rotationAngle: 12,
              backgroundColor: "#224466",
              foregroundColor: "#ffffff",
              borderWidth: 4,
              opacity: 0.8,
              fontFamily: "Inter",
              fontSize: 28,
              textXAlign: "left",
              textYAlign: "top",
              animation: "fadeSlideUp",
              locked: true,
            },
          },
          {
            kind: "arrange_nodes",
            target: { ids: ["welcome-node", "flower-node"] },
            layout: "row",
            gap: 60,
          },
          {
            kind: "disconnect_nodes",
            from: { ids: ["welcome-node"] },
            to: { ids: ["flower-node"] },
          },
          {
            kind: "connect_nodes",
            from: { ids: ["flower-node"] },
            to: { ids: ["welcome-node"] },
            style: {
              label: "Explains",
              lineColor: "#ff0055",
              lineWidth: 5,
              lineOpacity: 0.7,
              lineType: "orthogonal",
              lineCurveType: "quadratic",
              lineCurviness: 0.5,
              showParentArrow: true,
              showChildArrow: false,
            },
          },
          {
            kind: "update_slate",
            changes: {
              name: "Architecture Map",
              description: "A system overview",
              background: { backgroundColor: "#101820" },
            },
          },
          {
            kind: "delete_nodes",
            target: { ids: ["flower-node"] },
          },
        ],
      },
      {
        userMessage:
          "Update and arrange these nodes, reconnect them, change the canvas background, then delete the flower node",
      },
    );
    expect(result.report.updated).toEqual(
      expect.arrayContaining(["welcome-node", "flower-node"]),
    );
    expect(result.report.disconnected).toEqual(["welcome-node->flower-node"]);
    expect(result.report.connected).toEqual(["flower-node->welcome-node"]);
    expect(result.report.deleted).toEqual(["flower-node"]);
    const packages = slate.collab.invoke.mock.calls.flatMap(([value]) => value);
    expect(packages.map((pkg) => pkg.type)).toEqual(
      expect.arrayContaining([
        "onNodeTextChanged",
        "onNodeShapeChanged",
        "onNodeColorChanged",
        "onNodeBorderPropertiesChanged",
        "onNodeResized",
        "onNodesMove",
        "onNodeRotated",
        "onNodeLocked",
        "onNodeEffectChanged",
        "removeRelationship",
        "addRelationship",
        "onSlateNameChanged",
        "onSlateDescriptionChanged",
        "onSlateBackgroundColorChanged",
        "onNodeDeleted",
      ]),
    );
    expect(packages).toContainEqual({
      type: "addRelationship",
      data: expect.objectContaining({
        id: "flower-node->welcome-node",
        label: "Explains",
        lineOpacity: 0.7,
        lineCurveType: "quadratic",
        showParentArrow: true,
        showChildArrow: false,
      }),
    });
  });
});
