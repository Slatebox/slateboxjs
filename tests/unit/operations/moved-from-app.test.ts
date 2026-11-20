// Moved from the app (scripts/slate-operation-reducer.test.mjs and
// scripts/slate-operation-contract.test.mjs) when the app's reducer and
// contract were replaced by this module. Assertions restated on purpose are
// marked RESTATED with the reason.
import assert from "node:assert/strict";
import { test } from "vitest";
import {
  applyPlanToJSON as applySlateOperationPlanToJSON,
  SLATE_OPERATION_TOOL,
  summarizeSlate as summarizeSlateForAI,
  validatePlan as validateSlateOperationPlan,
} from "../../../src/operations";

function node(id, text, xPos, yPos, shape = "rectangle") {
  return {
    options: {
      id,
      text,
      shape,
      vectorPath: shape,
      xPos,
      yPos,
      width: 200,
      height: 100,
      backgroundColor: "#7aa2c8",
    },
    relationships: { associations: [] },
  };
}

const initialSlate = {
  _id: "slate-1",
  shareId: "share-1",
  lastSaved: 100,
  options: {
    name: "New Slate",
    containerStyle: { backgroundColor: "#ffffff", backgroundImage: "none" },
  },
  nodes: [
    node("welcome-node", "Welcome!", 100, 100),
    node("flower-node", "Node wrgpblg4h", 100, 450, "star"),
  ],
};
initialSlate.nodes[0].relationships.associations.push({
  id: "welcome-node->flower-node",
  parentId: "welcome-node",
  childId: "flower-node",
  label: "",
  lineColor: "#333333",
  lineWidth: 3,
  lineOpacity: 1,
  lineType: "bezier",
  lineCurveType: "cubic",
  lineCurviness: 0.3,
  showParentArrow: false,
  showChildArrow: true,
});

const plan = {
  message: "Done — I added three triangles to the right of Welcome.",
  operations: [
    {
      kind: "add_nodes",
      count: 3,
      shape: "triangle",
      placement: {
        relativeTo: "welcome-node",
        direction: "right",
        arrangement: "column",
      },
    },
  ],
};

test("the screenshot edit creates three triangles and preserves the slate", () => {
  const original = structuredClone(initialSlate);
  const ids = ["triangle-1", "triangle-2", "triangle-3"];
  let index = 0;
  const result = applySlateOperationPlanToJSON(initialSlate, plan, {
    userMessage: "3 triangles, to the right of the welcome node",
    idFactory: () => ids[index++],
  });

  assert.deepEqual(
    initialSlate,
    original,
    "the reducer must not mutate its input",
  );
  assert.deepEqual(result.slate.options, original.options);
  assert.deepEqual(result.slate.nodes.slice(0, 2), original.nodes);
  assert.deepEqual(result.report.created, ids);
  const triangles = result.slate.nodes.slice(2).map((item) => item.options);
  assert.equal(triangles.length, 3);
  assert.deepEqual(
    triangles.map((item) => item.shape),
    ["triangle", "triangle", "triangle"],
  );
  assert.deepEqual(
    triangles.map((item) => item.vectorPath),
    ["triangle", "triangle", "triangle"],
  );
  assert.deepEqual(
    triangles.map((item) => [item.xPos, item.yPos]),
    [
      [348, 100],
      [348, 278],
      [348, 456],
    ],
  );
  assert.deepEqual(
    triangles.map((item) => item.text),
    ["", "", ""],
  );
});

test("materialized add operations are idempotent", () => {
  let index = 0;
  const first = applySlateOperationPlanToJSON(initialSlate, plan, {
    userMessage: "Add 3 triangles",
    idFactory: () => `triangle-${++index}`,
  });
  // RESTATED: a replay of a carried-out plan says so (replay: true); the same
  // ids in a fresh plan are refused (review-P03 F2), so they cannot hit the wrong note.
  assert.throws(
    () => applySlateOperationPlanToJSON(first.slate, first.materializedPlan, { userMessage: "Add 3 triangles" }),
    (error) => error.code === "id_taken" && error.status === 409,
  );
  const second = applySlateOperationPlanToJSON(
    first.slate,
    first.materializedPlan,
    {
      userMessage: "Add 3 triangles",
      replay: true,
    },
  );
  assert.equal(second.slate.nodes.length, 5);
  assert.deepEqual(second.report.created, []);
});

test("new node groups move outward until they clear existing nodes", () => {
  const blockedSlate = structuredClone(initialSlate);
  blockedSlate.nodes.push(node("blocking-node", "Already here", 348, 100));
  let index = 0;
  const result = applySlateOperationPlanToJSON(blockedSlate, plan, {
    userMessage: "Add 3 triangles",
    idFactory: () => `triangle-${++index}`,
  });
  assert.deepEqual(
    result.slate.nodes
      .slice(3)
      .map((item) => [item.options.xPos, item.options.yPos]),
    [
      [596, 100],
      [596, 278],
      [596, 456],
    ],
  );
});

test("arranging nodes preserves a positive canvas origin", () => {
  const arranged = applySlateOperationPlanToJSON(
    initialSlate,
    {
      message: "Done.",
      operations: [
        {
          kind: "arrange_nodes",
          target: { ids: ["welcome-node", "flower-node"] },
          layout: "row",
          gap: 20,
        },
      ],
    },
    { userMessage: "Arrange these nodes in a row" },
  );
  assert.equal(arranged.slate.nodes[0].options.xPos, 100);
  assert.equal(arranged.slate.nodes[1].options.xPos, 320);
  assert.equal(arranged.slate.nodes[0].options.yPos, 100);
});

test("node and slate updates persist every supported property without collateral changes", () => {
  const result = applySlateOperationPlanToJSON(
    initialSlate,
    {
      message: "Done — I updated Welcome and renamed the slate.",
      operations: [
        {
          kind: "update_nodes",
          target: { ids: ["welcome-node"] },
          changes: {
            text: "Start here",
            x: 250,
            y: 275,
            width: 260,
            height: 140,
            rotationAngle: 12,
            backgroundColor: "#224466",
            foregroundColor: "#ffffff",
            borderWidth: 4,
            opacity: 0.8,
            // RESTATED: fontFamily is checked against the instance's fonts (set-font-family); "Inter" is not one.
            fontFamily: "Roboto",
            fontSize: 28,
            textXAlign: "left",
            textYAlign: "top",
            animation: "fadeSlideUp",
            locked: true,
          },
        },
        {
          kind: "update_slate",
          changes: {
            name: "Architecture Map",
            description: "A system overview",
            // RESTATED: one background shape, {color, gradient?}, for both appliers.
            background: { color: "#101820" },
          },
        },
      ],
    },
    {
      userMessage:
        "Update Welcome, rename the slate, and change the canvas background",
    },
  );
  const updated = result.slate.nodes[0].options;
  assert.equal(updated.text, "Start here");
  assert.equal(updated.xPos, 250);
  assert.equal(updated.yPos, 275);
  assert.equal(updated.width, 260);
  assert.equal(updated.height, 140);
  // RESTATED: rotation is stored where the engine loads it (corr-rotate-note).
  assert.deepEqual(updated.rotate, { rotationAngle: 12 });
  assert.equal("rotationAngle" in updated, false);
  assert.equal(updated.fontFamily, "Roboto");
  assert.equal(updated.backgroundColor, "#224466");
  assert.equal(updated.fontColor, "#ffffff");
  assert.equal(updated.isLocked, true);
  assert.equal(updated.animations.vect, "fadeSlideUp");
  assert.equal(result.slate.nodes[1].options.text, "Node wrgpblg4h");
  assert.equal(result.slate.options.name, "Architecture Map");
  assert.equal(result.slate.options.description, "A system overview");
  assert.equal(result.slate.options.containerStyle.backgroundColor, "#101820");
});

test("connection updates persist labels, styling, curves, and independent arrowheads", () => {
  const result = applySlateOperationPlanToJSON(
    initialSlate,
    {
      message: "Done — I restyled the relationship.",
      operations: [
        {
          kind: "update_connections",
          connectionIds: ["welcome-node->flower-node"],
          changes: {
            label: "Explains",
            lineColor: "#ff0055",
            lineWidth: 7,
            lineOpacity: 0.6,
            lineType: "orthogonal",
            lineCurveType: "quadratic",
            lineCurviness: 0.8,
            showParentArrow: true,
            showChildArrow: false,
          },
        },
      ],
    },
    { userMessage: "Restyle and relabel the connection" },
  );
  const connection = result.slate.nodes[0].relationships.associations[0];
  assert.deepEqual(connection, {
    id: "welcome-node->flower-node",
    parentId: "welcome-node",
    childId: "flower-node",
    label: "Explains",
    lineColor: "#ff0055",
    lineWidth: 7,
    lineOpacity: 0.6,
    lineType: "orthogonal",
    lineCurveType: "quadratic",
    lineCurviness: 0.8,
    showParentArrow: true,
    showChildArrow: false,
  });
  assert.deepEqual(result.report.connectionsUpdated, [
    "welcome-node->flower-node",
  ]);
});

test("connect and disconnect are idempotent and deletion cleans related edges", () => {
  const disconnected = applySlateOperationPlanToJSON(
    initialSlate,
    {
      message: "Done — disconnected.",
      operations: [
        {
          kind: "disconnect_nodes",
          from: { ids: ["welcome-node"] },
          to: { ids: ["flower-node"] },
        },
      ],
    },
    { userMessage: "Disconnect Welcome from the flower" },
  );
  assert.equal(
    disconnected.slate.nodes[0].relationships.associations.length,
    0,
  );

  const connected = applySlateOperationPlanToJSON(
    disconnected.slate,
    {
      message: "Done — connected.",
      operations: [
        {
          kind: "connect_nodes",
          from: { ids: ["welcome-node"] },
          to: { ids: ["flower-node"] },
          style: {
            label: "Explains",
            lineColor: "#ff0055",
            lineWidth: 6,
            lineOpacity: 0.7,
            lineType: "orthogonal",
            lineCurveType: "quadratic",
            lineCurviness: 0.5,
            showParentArrow: true,
            showChildArrow: false,
          },
        },
        {
          kind: "connect_nodes",
          from: { ids: ["welcome-node"] },
          to: { ids: ["flower-node"] },
        },
      ],
    },
    { userMessage: "Connect Welcome to the flower" },
  );
  assert.equal(connected.slate.nodes[0].relationships.associations.length, 1);
  assert.deepEqual(connected.slate.nodes[0].relationships.associations[0], {
    id: "welcome-node->flower-node",
    parentId: "welcome-node",
    childId: "flower-node",
    label: "Explains",
    lineColor: "#ff0055",
    lineWidth: 6,
    lineOpacity: 0.7,
    lineType: "orthogonal",
    lineCurveType: "quadratic",
    lineCurviness: 0.5,
    showParentArrow: true,
    showChildArrow: false,
  });

  const deleted = applySlateOperationPlanToJSON(
    connected.slate,
    {
      message: "Done — removed the flower.",
      operations: [{ kind: "delete_nodes", target: { ids: ["flower-node"] } }],
    },
    { userMessage: "Delete the flower node" },
  );
  assert.equal(deleted.slate.nodes.length, 1);
  assert.equal(deleted.slate.nodes[0].relationships.associations.length, 0);
});

const screenshotRequest = "3 triangles, to the right of the welcome node";
const trianglePlan = {
  message: "Done — I added three triangles to the right of Welcome.",
  operations: [
    {
      kind: "add_nodes",
      count: 3,
      shape: "triangle",
      placement: {
        relativeTo: "welcome-node",
        direction: "right",
        arrangement: "column",
      },
    },
  ],
};

test("the screenshot request validates as a direct existing-slate edit", () => {
  const result = validateSlateOperationPlan(trianglePlan, {
    userMessage: screenshotRequest,
    existingNodeIds: ["welcome-node", "flower-node"],
  });
  assert.deepEqual(result, { valid: true, errors: [] });
  assert.equal(
    SLATE_OPERATION_TOOL.parameters.properties.operations.maxItems,
    50,
  );
  assert.equal(
    SLATE_OPERATION_TOOL.parameters.properties.operations.items.properties.shape.enum.includes(
      "triangle",
    ),
    true,
  );
});

test("an unrequested canvas or theme change is rejected", () => {
  const result = validateSlateOperationPlan(
    {
      message: "Done.",
      operations: [
        {
          kind: "update_slate",
          changes: { background: { color: "#6d44aa" } },
        },
      ],
    },
    { userMessage: screenshotRequest },
  );
  assert.equal(result.valid, false);
  assert.match(result.errors.join(" "), /explicitly asks/i);
});

test("an explicit background request is allowed", () => {
  const result = validateSlateOperationPlan(
    {
      message: "Done — the canvas background is purple.",
      operations: [
        {
          kind: "update_slate",
          changes: { background: { color: "#6d44aa" } },
        },
      ],
    },
    { userMessage: "Change the canvas background to purple" },
  );
  assert.equal(result.valid, true);
});

test("destructive wildcards and hallucinated node ids are rejected", () => {
  const destructive = validateSlateOperationPlan(
    {
      message: "Done.",
      // RESTATED: text selectors are exact, so "*" names nothing; deleting every
      // note is now target {all: true}, which keeps the explicit-request rule.
      operations: [{ kind: "delete_nodes", target: { all: true } }],
    },
    { userMessage: "Add a triangle", existingNodeIds: ["welcome-node"] },
  );
  assert.equal(destructive.valid, false);

  const unknownTarget = validateSlateOperationPlan(
    {
      message: "Done.",
      operations: [
        {
          kind: "update_nodes",
          target: { ids: ["invented-node"] },
          changes: { text: "Nope" },
        },
      ],
    },
    { userMessage: "Rename Welcome", existingNodeIds: ["welcome-node"] },
  );
  assert.equal(unknownTarget.valid, false);
  assert.match(unknownTarget.errors.join(" "), /not in the slate/i);
});

test("live slate summaries expose identity and geometry without mutable internals", () => {
  const summary = summarizeSlateForAI({
    options: { name: "New Slate" },
    nodes: {
      allNodes: [
        {
          options: {
            id: "welcome-node",
            text: "Welcome!",
            shape: "roundedrectangle",
            xPos: 100,
            yPos: 200,
            width: 180,
            height: 90,
          },
          relationships: {
            associations: [
              {
                id: "welcome-node->detail-node",
                parentId: "welcome-node",
                childId: "detail-node",
                label: "",
                lineColor: "#333333",
                lineWidth: 3,
                lineType: "bezier",
                showParentArrow: false,
                showChildArrow: true,
              },
            ],
          },
        },
      ],
    },
  });
  assert.deepEqual(summary.nodes[0], {
    id: "welcome-node",
    text: "Welcome!",
    shape: "roundedrectangle",
    x: 100,
    y: 200,
    width: 180,
    height: 90,
  });
  assert.deepEqual(summary.connections, [
    {
      id: "welcome-node->detail-node",
      from: "welcome-node",
      to: "detail-node",
      label: "",
      lineColor: "#333333",
      lineWidth: 3,
      lineOpacity: undefined,
      lineType: "bezier",
      lineCurveType: undefined,
      lineCurviness: undefined,
      showParentArrow: false,
      showChildArrow: true,
    },
  ]);
});

test("connection edits require real ids and supported line properties", () => {
  const valid = validateSlateOperationPlan(
    {
      message: "Done — I labeled the connection and reversed its arrows.",
      operations: [
        {
          kind: "update_connections",
          connectionIds: ["welcome-node->detail-node"],
          changes: {
            label: "Explains",
            lineColor: "#ff0055",
            showParentArrow: true,
            showChildArrow: false,
          },
        },
      ],
    },
    {
      userMessage: "Label the line Explains and reverse its arrow",
      existingNodeIds: ["welcome-node", "detail-node"],
      existingConnectionIds: ["welcome-node->detail-node"],
    },
  );
  assert.equal(valid.valid, true);

  const invalid = validateSlateOperationPlan(
    {
      message: "Done.",
      operations: [
        {
          kind: "update_connections",
          connectionIds: ["hallucinated-edge"],
          changes: { theme: "neon" },
        },
      ],
    },
    {
      userMessage: "Update that line",
      existingConnectionIds: ["welcome-node->detail-node"],
    },
  );
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join(" "), /not in the slate/i);
  assert.match(invalid.errors.join(" "), /unsupported connection changes/i);
});

test("operation styles reject unknown fields and unsafe value types", () => {
  const invalid = validateSlateOperationPlan(
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
          to: { ids: ["detail-node"] },
          style: { lineWidth: 0, showChildArrow: "yes" },
        },
      ],
    },
    {
      userMessage: "Add, update, and connect these nodes",
      existingNodeIds: ["welcome-node", "detail-node"],
    },
  );
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join(" "), /unsupported node styles/i);
  assert.match(
    invalid.errors.join(" "),
    /opacity must be a number from 0 to 1/i,
  );
  assert.match(
    invalid.errors.join(" "),
    /width must be a number from 20 to 5000/i,
  );
  assert.match(invalid.errors.join(" "), /locked must be true or false/i);
  assert.match(
    invalid.errors.join(" "),
    /lineWidth must be a number from 0.1 to 100/i,
  );
  assert.match(
    invalid.errors.join(" "),
    /showChildArrow must be true or false/i,
  );
});
