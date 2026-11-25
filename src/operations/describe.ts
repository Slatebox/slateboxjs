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
import { backgroundSchema, SLATE_KEYS, styleSchema } from "./keys/slate";
import { selectorSchema } from "./keys/selector";
import { namesOnlyShape, schemaFor } from "./keys/values";
import { MEDIA_LIMITS } from "./media";
import { groupPlanErrors, planErrorHints } from "./errors";

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
        { ...(key === "background" ? backgroundSchema() : key === "style" ? styleSchema() : schemaFor(entry.spec)), description: entry.description },
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

/**
 * The plan's JSON Schema. A shape is a name or a custom shape object (oneOf);
 * `{modelTool: true}` lists names only, so the schema stays free of
 * combinators for every model provider (a model gets custom shapes through
 * the host's shape tools, not by writing paths).
 */
export function slateOperationPlanSchema(options: ContractOptions = {}, form: { modelTool?: boolean } = {}): Record<string, any> {
  const lists = contractLists(options);
  const limits = contractLimits(options);
  const nodeSchema = (key: string) => {
    const schema = schemaFor(NODE_KEYS[key].spec(lists));
    return form.modelTool ? namesOnlyShape(schema) : schema;
  };
  const nodeProperties = (names: string[]) => Object.fromEntries(names.map((key) => [key, nodeSchema(key)]));
  // update_nodes changes carry each key's description, so the model reads what a key does
  // (templateCategory is not "group these by theme"), as REST and describeOperations give it.
  const describedNodeProperties = (names: string[]) =>
    Object.fromEntries(names.map((key) => [key, { ...nodeSchema(key), description: NODE_KEYS[key].description }]));
  const connectorProperties = (names: string[]) => Object.fromEntries(names.map((key) => [key, schemaFor(CONNECTOR_KEYS[key].spec)]));
  const selector = selectorSchema();
  const ids = { type: "array", items: { type: "string" } };
  const fieldsByKind = operationFieldsByKind();
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
        // On the array as well as its items: a renderer that reads property descriptions only
        // (the exec declarations) still shows which fields each kind takes, and that add_nodes needs count.
        description: operationsDescription(limits.notesPerAdd),
        items: {
          type: "object",
          additionalProperties: false,
          required: ["kind"],
          description: `Fields by kind (any other field is refused). ${fieldsByKind}. add_nodes requires count.`,
          properties: {
            kind: { type: "string", enum: [...SLATE_OPERATION_KINDS], description: "Which operation this is; it decides the fields the operation may carry." },
            count: {
              type: "integer",
              minimum: 1,
              maximum: limits.notesPerAdd,
              description: `add_nodes only, and required there: how many notes it adds, 1 to ${limits.notesPerAdd}. With ids, count is normally ids.length (never fewer). Other kinds take no count.`,
            },
            ...nodeProperties(["shape", "text", "x", "y", "width", "height"]),
            preset: {
              type: "string",
              enum: [...PRESETS],
              description: "add_nodes: text (no fill or border) or sticky (a sticky note), as the note toolbar makes them. Gives the shape when none is given.",
            },
            ids: { ...ids, description: "add_nodes and duplicate_nodes: new note ids (1 to 64 letters, digits, _ or -), which later operations in the plan may name. connect_nodes: ids for the new connectors, one per pair. An id already in use is refused." },
            connectionIds: {
              ...ids,
              description: "disconnect_nodes and update_connections only: ids of connectors already on the slate. connect_nodes names its new connectors with ids, never connectionIds.",
            },
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
            // Not in a model's tool: a model asks the host's add-media action, which fetches and stores the poster.
            ...(form.modelTool ? {} : { media: {
              type: "object",
              additionalProperties: false,
              required: ["url"],
              description:
                "add_nodes, count 1, no shape, preset or text: a media note, a video from YouTube, Vimeo or Loom drawn as its poster with a play button; it plays where it sits when someone presses play, never on its own. Hosts add videos through their own add-media action, which fetches the title and stores the poster.",
              properties: {
                url: { type: "string", maxLength: MEDIA_LIMITS.urlLength, description: "The video's address." },
                title: { type: "string", maxLength: MEDIA_LIMITS.titleLength },
                author: { type: "string", maxLength: MEDIA_LIMITS.authorLength },
                start: { type: "integer", minimum: 1, maximum: MEDIA_LIMITS.startSeconds, description: "Where to start, in seconds." },
                poster: { type: "string", maxLength: MEDIA_LIMITS.urlLength, pattern: "^(https://\\S+|/[^/\\\\\\s]\\S*)$", description: "The poster picture: an https address, or a path on this app (/...)." },
                posterWidth: { type: "number", minimum: 1, maximum: 10000 },
                posterHeight: { type: "number", minimum: 1, maximum: 10000 },
              },
            } }),
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
                  Object.entries(SLATE_KEYS).map(([key, entry]) => [key, key === "background" ? backgroundSchema() : key === "style" ? styleSchema() : schemaFor(entry.spec)]),
                ),
              },
            },
          },
        },
      },
    },
  };
}

/** "add_nodes: count, shape, …; connect_nodes: from, to, ids, style; …": the fields each kind takes. */
export function operationFieldsByKind(): string {
  return SLATE_OPERATION_KINDS.map((kind) => `${kind}: ${OPERATION_FIELDS[kind].filter((field) => field !== "kind").join(", ")}`).join("; ");
}

/**
 * What the operations list says: each kind's fields, what is required, and one example of each
 * common kind, so a model writing a plan from the schema (or from declarations rendered from it)
 * never has to guess that add_nodes needs count or that connect_nodes names new connectors with ids.
 */
export function operationsDescription(notesPerAdd: number = 20): string {
  return [
    `The operations, applied in order. Each operation's kind decides which fields it may carry; any other field is refused. Fields by kind: ${operationFieldsByKind()}.`,
    `add_nodes requires count (1 to ${notesPerAdd}): one add_nodes may add several notes (count 3, ids ["a","b","c"]) or one (count 1, ids ["a"]).`,
    "connect_nodes names its new connectors with ids (one per pair); connectionIds is only for disconnect_nodes and update_connections.",
    'Examples: {"kind":"add_nodes","count":1,"ids":["title"],"shape":"rectangle","text":"Title","x":0,"y":0,"width":240,"height":80}; {"kind":"add_nodes","count":2,"ids":["a","b"],"shape":"rectangle","text":"Step","placement":{"relativeTo":"title","direction":"below","arrangement":"row"}}; {"kind":"connect_nodes","from":{"ids":["title"]},"to":{"ids":["a"]},"ids":["title-a"]}; {"kind":"update_nodes","target":{"ids":["a"]},"changes":{"text":"First step"}}.',
  ].join(" ");
}

export const SLATE_OPERATION_TOOL = Object.freeze({
  name: "applySlateOperations",
  description:
    "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.",
  parameters: slateOperationPlanSchema({}, { modelTool: true }),
});

export function operationPlanRetryPrompt(errors: string[]): string {
  // Grouped (one line per problem, not one per operation), with what the contract wants instead.
  const lines = [...groupPlanErrors(errors).map((group) => group.message), ...planErrorHints(errors)];
  return `Call applySlateOperations again with a safe, valid plan. ${lines.join(" ")}`;
}

export function naturalOperationFallback(plan: Partial<SlateOperationPlan> | undefined): string {
  if (typeof plan?.message === "string" && plan.message.trim()) return plan.message.trim();
  const count = (plan?.operations || []).reduce(
    (total, operation: any) => total + (operation.kind === "add_nodes" ? operation.count || 0 : 1),
    0,
  );
  return `Done — I applied ${count} ${count === 1 ? "change" : "changes"} to the slate.`;
}
