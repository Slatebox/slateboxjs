/**
 * The contract as data: describeOperations for an instance description and
 * tool generators, slateOperationPlanSchema (JSON Schema) for OpenAPI and
 * model tools, and the applySlateOperations tool the app gives its model.
 */
import {
  ARRANGEMENTS,
  contractLimits,
  contractLists,
  LAYOUTS,
  OPERATION_FIELDS,
  PLACEMENT_DIRECTIONS,
  PRESETS,
  SLATE_OPERATION_KINDS,
  type ContractOptions,
  type SlateOperationPlan,
} from "./contract";
import { NODE_INTENT_KEYS, NODE_KEYS, NODE_STYLE_KEYS } from "./keys/node";
import { CONNECTOR_KEYS, CONNECTOR_STYLE_KEYS } from "./keys/connector";
import { backgroundSchema, SLATE_KEYS } from "./keys/slate";
import { selectorSchema } from "./keys/selector";
import { schemaFor } from "./keys/values";

export function describeOperations(options: ContractOptions = {}) {
  const lists = contractLists(options);
  const keys = (table: Record<string, any>, spec: (entry: any) => any) =>
    Object.fromEntries(Object.entries(table).map(([key, entry]) => [key, { ...schemaFor(spec(entry)), description: entry.description }]));
  return {
    version: 1,
    kinds: Object.fromEntries(SLATE_OPERATION_KINDS.map((kind) => [kind, { fields: OPERATION_FIELDS[kind].filter((field) => field !== "kind") }])),
    noteKeys: { ...keys(NODE_KEYS, (entry) => entry.spec(lists)), ...keys(NODE_INTENT_KEYS, (entry) => entry.spec) },
    noteStyleKeys: [...NODE_STYLE_KEYS],
    connectorKeys: keys(CONNECTOR_KEYS, (entry) => entry.spec),
    connectorStyleKeys: [...CONNECTOR_STYLE_KEYS],
    slateKeys: Object.fromEntries(
      Object.entries(SLATE_KEYS).map(([key, entry]) => [
        key,
        { ...(key === "background" ? backgroundSchema() : schemaFor(entry.spec)), description: entry.description },
      ]),
    ),
    selector: selectorSchema(),
    layouts: [...LAYOUTS],
    presets: [...PRESETS],
    limits: contractLimits(options),
    shapes: lists.shapes,
    fonts: lists.fonts,
    animations: lists.animations,
    effects: lists.effects,
    errors: {
      invalid_operation_plan: "400: the plan breaks the contract; the message lists each problem.",
      ambiguous_selector: "400: a text selector matched several notes; details.candidates lists them.",
      no_match: "409 on save: an operation matched no notes or connectors. A preview reports it as a warning instead.",
      note_limit: "422: the plan would leave more notes than the slate may hold.",
      connector_limit: "422: one connect_nodes would join more pairs than limits.connectorsPerOperation, or the slate would hold more connectors than limits.connectorsPerSlate.",
      id_taken: "409: add_nodes or connect_nodes named an id already in use; details.ids lists them.",
    },
  };
}

export function slateOperationPlanSchema(options: ContractOptions = {}): Record<string, any> {
  const lists = contractLists(options);
  const limits = contractLimits(options);
  const nodeProperties = (names: string[]) =>
    Object.fromEntries(names.map((key) => [key, schemaFor(NODE_KEYS[key].spec(lists))]));
  // update_nodes changes carry each key's description, so the model reads what a key does
  // (templateCategory is not "group these by theme"), as REST and describeOperations give it.
  const describedNodeProperties = (names: string[]) =>
    Object.fromEntries(names.map((key) => [key, { ...schemaFor(NODE_KEYS[key].spec(lists)), description: NODE_KEYS[key].description }]));
  const connectorProperties = (names: string[]) => Object.fromEntries(names.map((key) => [key, schemaFor(CONNECTOR_KEYS[key].spec)]));
  const selector = selectorSchema();
  const ids = { type: "array", items: { type: "string" } };
  const fieldsByKind = SLATE_OPERATION_KINDS.map((kind) => `${kind}: ${OPERATION_FIELDS[kind].filter((field) => field !== "kind").join(", ")}`).join("; ");
  // One flat item schema (not anyOf per kind): every model provider accepts it.
  // validatePlan enforces which fields each kind takes.
  return {
    type: "object",
    additionalProperties: false,
    required: ["message", "operations"],
    properties: {
      message: {
        type: "string",
        description: "A concise, natural response describing exactly what will change. Do not claim an operation that is absent from operations.",
      },
      operations: {
        type: "array",
        minItems: 1,
        maxItems: limits.operationsPerPlan,
        items: {
          type: "object",
          additionalProperties: false,
          required: ["kind"],
          description: `Fields by kind. ${fieldsByKind}.`,
          properties: {
            kind: { type: "string", enum: [...SLATE_OPERATION_KINDS] },
            count: { type: "integer", minimum: 1, maximum: limits.notesPerAdd },
            ...nodeProperties(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...PRESETS],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given.",
            },
            ids: { ...ids, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: ids,
            gap: { type: "number", minimum: 0, maximum: 2000 },
            offset: { ...schemaFor({ type: "point" }), description: "duplicate_nodes: how far the copies sit from the notes copied; 20, 20 when left out." },
            placement: {
              type: "object",
              additionalProperties: false,
              description:
                "add_nodes: where to put the notes. With x and y, only arrangement and gap apply. connect: true with relativeTo makes notes that copy that note's look and are joined to it, 75 from its edge, as the canvas's connection handles do.",
              properties: {
                relativeTo: { type: "string" },
                direction: { type: "string", enum: [...PLACEMENT_DIRECTIONS] },
                arrangement: { type: "string", enum: [...ARRANGEMENTS] },
                gap: { type: "number", minimum: 0, maximum: 2000 },
                connect: { type: "boolean" },
              },
            },
            style: {
              type: "object",
              additionalProperties: false,
              description: "add_nodes: note keys for the new notes. connect_nodes: connector keys for the new connectors.",
              properties: { ...nodeProperties(NODE_STYLE_KEYS), ...connectorProperties(CONNECTOR_STYLE_KEYS) },
            },
            target: selector,
            from: selector,
            to: {
              ...selector,
              description: `${selector.description} connect_nodes may instead give {point: {x, y}} for a connector with a free end.`,
              properties: { ...selector.properties, point: schemaFor({ type: "point" }) },
            },
            layout: {
              type: "string",
              enum: [...LAYOUTS],
              description:
                "arrange_nodes: row, column, grid, circle; align-* and distribute-* as the canvas aligns by what you see; tidy moves notes apart until none overlaps; tree lays connected notes out in layers under their root.",
            },
            changes: {
              type: "object",
              additionalProperties: false,
              minProperties: 1,
              description: `update_nodes: note keys (and order: front or back). update_connections: connector keys. update_slate: ${Object.keys(SLATE_KEYS).join(", ")}.`,
              properties: {
                ...describedNodeProperties(Object.keys(NODE_KEYS)),
                ...Object.fromEntries(Object.entries(NODE_INTENT_KEYS).map(([key, entry]) => [key, schemaFor(entry.spec)])),
                ...connectorProperties(Object.keys(CONNECTOR_KEYS)),
                ...Object.fromEntries(
                  Object.entries(SLATE_KEYS).map(([key, entry]) => [key, key === "background" ? backgroundSchema() : schemaFor(entry.spec)]),
                ),
              },
            },
          },
        },
      },
    },
  };
}

export const SLATE_OPERATION_TOOL = Object.freeze({
  name: "applySlateOperations",
  description:
    "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: slateOperationPlanSchema(),
});

export function operationPlanRetryPrompt(errors: string[]): string {
  return `Call applySlateOperations again with a safe, valid plan. ${errors.join(" ")}`;
}

export function naturalOperationFallback(plan: Partial<SlateOperationPlan> | undefined): string {
  if (typeof plan?.message === "string" && plan.message.trim()) return plan.message.trim();
  const count = (plan?.operations || []).reduce(
    (total, operation: any) => total + (operation.kind === "add_nodes" ? operation.count || 0 : 1),
    0,
  );
  return `Done — I applied ${count} ${count === 1 ? "change" : "changes"} to the slate.`;
}
