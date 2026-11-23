/**
 * validatePlan: checks a plan's shape against the contract without a slate.
 * When the caller passes the slate's note and connector ids, references to
 * ids that are neither in the slate nor made earlier in the plan are refused.
 */
import {
  ARRANGEMENTS,
  contractLimits,
  contractLists,
  CONNECTOR_ID_MAX_LENGTH,
  LAYOUTS,
  NOTE_ID_PATTERN,
  OPERATION_FIELDS,
  PLACEMENT_DIRECTIONS,
  PRESETS,
  SLATE_OPERATION_KINDS,
  type ContractOptions,
  type SlateOperationValidation,
} from "./contract";
import { NODE_CHANGE_KEYS, NODE_INTENT_KEYS, NODE_KEYS, NODE_STYLE_KEYS } from "./keys/node";
import { CONNECTOR_KEYS, CONNECTOR_STYLE_KEYS } from "./keys/connector";
import { checkBackground, SLATE_KEYS } from "./keys/slate";
import { checkSelector } from "./keys/selector";
import { checkValue, isObject, type Lists } from "./keys/values";
import { readMediaValue } from "./media";

// Two guards on words in the person's request. They stay until the action
// registry offers a preview mode (P02), which replaces them.
const STYLE_INTENT = /\b(theme|background|canvas|palette|gradient|recolor|colour|color scheme)\b/i;
export const DESTRUCTIVE_INTENT = /\b(clear|replace|reset|start over|delete all|remove all)\b/i;

export interface ValidateOptions extends ContractOptions {
  userMessage?: string;
  existingNodeIds?: string[];
  existingConnectionIds?: string[];
}

function checkKeys(
  values: unknown,
  allowed: readonly string[],
  prefix: string,
  noun: string,
  check: (key: string, value: unknown, errors: string[]) => void,
  { required = true, plural = `${noun}s` }: { required?: boolean; plural?: string } = {},
): string[] {
  const errors: string[] = [];
  if (values === undefined && !required) return errors;
  if (!isObject(values) || (required && !Object.keys(values).length)) {
    return [required ? `${prefix} requires at least one ${noun}.` : `${prefix} ${plural} must be an object.`];
  }
  const unknown = Object.keys(values).filter((key) => !allowed.includes(key));
  if (unknown.length) errors.push(`${prefix} contains unsupported ${plural}: ${unknown.join(", ")}.`);
  for (const [key, value] of Object.entries(values)) {
    if (allowed.includes(key)) check(key, value, errors);
  }
  return errors;
}

function nodeValueCheck(lists: Lists, label: string) {
  return (key: string, value: unknown, errors: string[]) => {
    const spec = NODE_INTENT_KEYS[key]?.spec ?? NODE_KEYS[key].spec(lists);
    const problem = checkValue(spec, value, `${label} ${key}`);
    if (problem) errors.push(problem);
  };
}

function connectorValueCheck(label: string) {
  return (key: string, value: unknown, errors: string[]) => {
    const problem = checkValue(CONNECTOR_KEYS[key].spec, value, `${label} ${key}`);
    if (problem) errors.push(problem);
  };
}

function stringList(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0 && value.every((item) => typeof item === "string" && item.length > 0);
}

export function validatePlan(plan: any, options: ValidateOptions = {}): SlateOperationValidation {
  const lists = contractLists(options);
  const limits = contractLimits(options);
  const userMessage = options.userMessage || "";
  if (!isObject(plan)) return { valid: false, errors: ["The operation plan must be an object."] };
  const errors: string[] = [];
  for (const key of Object.keys(plan)) {
    if (key !== "message" && key !== "operations") errors.push(`The plan has an unknown field: ${key}.`);
  }
  if (typeof plan.message !== "string" || !plan.message.trim()) {
    errors.push("A natural completion message is required.");
  }
  if (!Array.isArray(plan.operations) || plan.operations.length === 0) {
    errors.push("At least one slate operation is required.");
  } else if (plan.operations.length > limits.operationsPerPlan) {
    errors.push(`A plan cannot contain more than ${limits.operationsPerPlan} operations.`);
  }

  const checkIds = Boolean(options.existingNodeIds?.length);
  const knownIds = new Set((options.existingNodeIds || []).filter(Boolean));
  const checkConnections = Boolean(options.existingConnectionIds?.length);
  const knownConnections = new Set((options.existingConnectionIds || []).filter(Boolean));
  const referencesKnown = (selector: any, prefix: string) => {
    if (checkIds && isObject(selector) && Array.isArray(selector.ids) && selector.ids.some((id: string) => !knownIds.has(id))) {
      errors.push(`${prefix} references notes that are not in the slate.`);
    }
  };

  (Array.isArray(plan.operations) ? plan.operations : []).forEach((operation: any, index: number) => {
    const prefix = `Operation ${index + 1}`;
    if (!isObject(operation) || !SLATE_OPERATION_KINDS.includes(operation.kind)) {
      errors.push(`${prefix} has an unsupported kind.`);
      return;
    }
    const fields = OPERATION_FIELDS[operation.kind as keyof typeof OPERATION_FIELDS];
    const unknown = Object.keys(operation).filter((key) => !fields.includes(key));
    for (const key of unknown) errors.push(`${prefix} has an unknown field: ${key}.`);

    switch (operation.kind) {
      case "add_nodes": {
        if (!Number.isInteger(operation.count) || operation.count < 1 || operation.count > limits.notesPerAdd) {
          errors.push(`${prefix} count must be an integer from 1 to ${limits.notesPerAdd}.`);
        }
        if (operation.preset !== undefined) {
          const preset = checkValue({ type: "enum", values: PRESETS }, operation.preset, `${prefix} preset`);
          if (preset) errors.push(preset);
        }
        // A preset or a connected note's source gives the shape when the operation does not.
        const connects = isObject(operation.placement) && operation.placement.connect === true;
        // A media note: one note, a video from an approved host, drawn as its poster (always a rectangle).
        const media = operation.media !== undefined;
        if (media) {
          const read = readMediaValue(operation.media);
          if (!read.ok) errors.push(`${prefix} media ${read.message}`);
          if (operation.count !== 1) errors.push(`${prefix} adds one media note at a time (count 1).`);
          for (const key of ["shape", "preset", "text"]) {
            if (operation[key] !== undefined) errors.push(`${prefix} is a media note, so it takes no ${key}.`);
          }
          if (connects) errors.push(`${prefix} is a media note, so it cannot copy and connect from another note.`);
        }
        if (!media && (operation.shape !== undefined || (operation.preset === undefined && !connects))) {
          const shape = checkValue(NODE_KEYS.shape.spec(lists), operation.shape, `${prefix} shape`);
          if (shape) errors.push(shape);
        }
        for (const key of ["text", "width", "height"]) {
          if (operation[key] === undefined) continue;
          const problem = checkValue(NODE_KEYS[key].spec(lists), operation[key], `${prefix} ${key}`);
          if (problem) errors.push(problem);
        }
        if ((operation.x === undefined) !== (operation.y === undefined)) {
          errors.push(`${prefix} needs both x and y, or neither.`);
        }
        for (const key of ["x", "y"]) {
          if (operation[key] === undefined) continue;
          const problem = checkValue(NODE_KEYS[key].spec(lists), operation[key], `${prefix} ${key}`);
          if (problem) errors.push(problem);
        }
        if (operation.ids !== undefined) {
          if (!stringList(operation.ids) || new Set(operation.ids).size !== operation.ids.length) {
            errors.push(`${prefix} ids must be a list of different note ids.`);
          } else if (operation.ids.some((id: string) => !NOTE_ID_PATTERN.test(id))) {
            errors.push(`${prefix} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`);
          } else if (Number.isInteger(operation.count) && operation.ids.length > operation.count) {
            errors.push(`${prefix} has more ids than notes to add.`);
          }
        }
        const placement = operation.placement;
        if (placement !== undefined) {
          if (!isObject(placement)) {
            errors.push(`${prefix} placement must be an object.`);
          } else {
            // With x and y, relativeTo only names the note a connected note copies and joins.
            const allowed =
              operation.x !== undefined
                ? ["arrangement", "gap", ...(placement.connect === true ? ["relativeTo", "connect"] : [])]
                : ["relativeTo", "direction", "arrangement", "gap", "connect"];
            for (const key of Object.keys(placement)) {
              if (!allowed.includes(key)) {
                errors.push(
                  operation.x !== undefined && ["relativeTo", "direction", "connect"].includes(key)
                    ? `${prefix} gives x and y, so placement cannot also give ${key}.`
                    : `${prefix} placement has an unknown field: ${key}.`,
                );
              }
            }
            if (placement.connect !== undefined) {
              if (typeof placement.connect !== "boolean") {
                errors.push(`${prefix} placement.connect must be true or false.`);
              } else if (placement.connect) {
                if (placement.relativeTo === undefined) errors.push(`${prefix} placement.connect needs relativeTo, the note to copy and connect from.`);
                if (placement.direction === "center") errors.push(`${prefix} cannot connect a note placed at the centre of another; choose left, right, above or below.`);
              }
            }
            if (placement.relativeTo !== undefined && typeof placement.relativeTo !== "string") {
              errors.push(`${prefix} placement.relativeTo must be a note id.`);
            } else if (placement.relativeTo && checkIds && !knownIds.has(placement.relativeTo)) {
              errors.push(`${prefix} references a note that is not in the slate.`);
            }
            for (const [key, values] of [["direction", PLACEMENT_DIRECTIONS], ["arrangement", ARRANGEMENTS]] as const) {
              if (placement[key] === undefined) continue;
              const problem = checkValue({ type: "enum", values }, placement[key], `${prefix} placement.${key}`);
              if (problem) errors.push(problem);
            }
            if (placement.gap !== undefined) {
              const problem = checkValue({ type: "number", min: 0, max: 2000 }, placement.gap, `${prefix} placement.gap`);
              if (problem) errors.push(problem);
            }
          }
        }
        errors.push(...checkKeys(operation.style, NODE_STYLE_KEYS, prefix, "node style", nodeValueCheck(lists, prefix), { required: false }));
        if (stringList(operation.ids)) operation.ids.forEach((id: string) => knownIds.add(id));
        return;
      }
      case "update_nodes":
      case "delete_nodes":
      case "arrange_nodes": {
        const selector = checkSelector(operation.target, `${prefix} target`);
        errors.push(...selector);
        if (!selector.length) referencesKnown(operation.target, prefix);
        if (operation.kind === "update_nodes") {
          errors.push(...checkKeys(operation.changes, NODE_CHANGE_KEYS, prefix, "node change", nodeValueCheck(lists, prefix), { plural: "changes" }));
        }
        if (operation.kind === "delete_nodes") {
          const everything = isObject(operation.target) && operation.target.all === true && Object.keys(operation.target).length === 1;
          if (everything && !DESTRUCTIVE_INTENT.test(userMessage)) {
            errors.push(`${prefix} cannot delete every note without an explicit request.`);
          }
        }
        if (operation.kind === "arrange_nodes") {
          const layout = checkValue({ type: "enum", values: LAYOUTS }, operation.layout, `${prefix} layout`);
          if (layout) errors.push(layout);
          if (operation.gap !== undefined) {
            const gap = checkValue({ type: "number", min: 0, max: 2000 }, operation.gap, `${prefix} gap`);
            if (gap) errors.push(gap);
          }
        }
        return;
      }
      case "duplicate_nodes": {
        const selector = checkSelector(operation.target, `${prefix} target`);
        errors.push(...selector);
        if (!selector.length) referencesKnown(operation.target, prefix);
        if (operation.offset !== undefined) {
          const offset = checkValue({ type: "point" }, operation.offset, `${prefix} offset`);
          if (offset) errors.push(offset);
        }
        if (operation.ids !== undefined) {
          if (!stringList(operation.ids) || new Set(operation.ids).size !== operation.ids.length) {
            errors.push(`${prefix} ids must be a list of different note ids.`);
          } else if (operation.ids.some((id: string) => !NOTE_ID_PATTERN.test(id))) {
            errors.push(`${prefix} ids must be 1 to 64 letters, digits, _ or -, and must not start with __free_.`);
          } else if (isObject(operation.target) && stringList(operation.target.ids) && operation.ids.length > operation.target.ids.length) {
            errors.push(`${prefix} has more ids than notes to copy.`);
          }
        }
        if (stringList(operation.ids)) operation.ids.forEach((id: string) => knownIds.add(id));
        return;
      }
      case "connect_nodes": {
        const from = checkSelector(operation.from, `${prefix} from`);
        errors.push(...from);
        if (!from.length) referencesKnown(operation.from, prefix);
        if (isObject(operation.to) && operation.to.point !== undefined) {
          if (Object.keys(operation.to).length !== 1) errors.push(`${prefix} to must be a note selector or {point}, not both.`);
          const point = checkValue({ type: "point" }, operation.to.point, `${prefix} to.point`);
          if (point) errors.push(point);
        } else {
          const to = checkSelector(operation.to, `${prefix} to`);
          errors.push(...to);
          if (!to.length) referencesKnown(operation.to, prefix);
        }
        if (operation.ids !== undefined) {
          if (!stringList(operation.ids) || new Set(operation.ids).size !== operation.ids.length) {
            errors.push(`${prefix} ids must be a list of different connector ids.`);
          } else if (operation.ids.some((id: string) => id.length > CONNECTOR_ID_MAX_LENGTH)) {
            errors.push(`${prefix} connector ids can be at most ${CONNECTOR_ID_MAX_LENGTH} characters.`);
          }
        }
        errors.push(...checkKeys(operation.style, CONNECTOR_STYLE_KEYS, prefix, "connection style", connectorValueCheck(prefix), { required: false }));
        if (stringList(operation.ids)) operation.ids.forEach((id: string) => knownConnections.add(id));
        const fromIds = operation.from?.ids;
        const toIds = operation.to?.ids;
        if (stringList(fromIds) && stringList(toIds)) {
          fromIds.forEach((f: string) => toIds.forEach((t: string) => knownConnections.add(`${f}->${t}`)));
        }
        return;
      }
      case "disconnect_nodes":
      case "update_connections": {
        const byIds = operation.connectionIds !== undefined;
        const byEnds = operation.from !== undefined || operation.to !== undefined;
        if (byIds && byEnds) errors.push(`${prefix} names connectors by connectionIds or by from and to, not both.`);
        if (!byIds && !byEnds) errors.push(`${prefix} requires connectionIds or both from and to note selectors.`);
        if (byIds) {
          if (!stringList(operation.connectionIds)) {
            errors.push(`${prefix} connectionIds must be a list of connector ids.`);
          } else if (checkConnections && operation.connectionIds.some((id: string) => !knownConnections.has(id))) {
            errors.push(`${prefix} references connectors that are not in the slate.`);
          }
        }
        if (byEnds) {
          for (const end of ["from", "to"]) {
            const problems = checkSelector(operation[end], `${prefix} ${end}`);
            errors.push(...problems);
            if (!problems.length) referencesKnown(operation[end], prefix);
          }
        }
        if (operation.kind === "update_connections") {
          errors.push(...checkKeys(operation.changes, Object.keys(CONNECTOR_KEYS), prefix, "connection change", connectorValueCheck(prefix)));
          const changes = isObject(operation.changes) ? operation.changes : {};
          // Each end goes one place, and is pinned or followed once.
          if (changes.toNote !== undefined && changes.toPoint !== undefined) errors.push(`${prefix} moves the far end with toNote or toPoint, not both.`);
          if (changes.fromNote !== undefined && changes.fromPoint !== undefined) errors.push(`${prefix} moves the starting end with fromNote or fromPoint, not both.`);
          if (changes.ends !== undefined && (changes.fromEnd !== undefined || changes.toEnd !== undefined)) errors.push(`${prefix} sets ends, or fromEnd and toEnd, not both.`);
          if (changes.toPoint !== undefined && changes.toEnd !== undefined) errors.push(`${prefix} cannot pin a far end it leaves free (toPoint with toEnd).`);
          if (changes.fromPoint !== undefined && (changes.toPoint !== undefined || changes.fromEnd !== undefined)) {
            errors.push(`${prefix} keeps one end on a note: fromPoint goes with neither toPoint nor fromEnd.`);
          }
        }
        return;
      }
      case "update_slate": {
        errors.push(
          ...checkKeys(operation.changes, Object.keys(SLATE_KEYS), prefix, "slate change", (key, value, list) => {
            if (key === "background") {
              list.push(...checkBackground(value, `${prefix} background`));
              return;
            }
            const problem = checkValue(SLATE_KEYS[key].spec, value, `${prefix} ${key}`);
            if (problem) list.push(problem);
          }),
        );
        if (isObject(operation.changes) && operation.changes.background !== undefined && !STYLE_INTENT.test(userMessage)) {
          errors.push(`${prefix} cannot change the canvas background unless the user explicitly asks for it.`);
        }
        return;
      }
    }
  });
  return { valid: errors.length === 0, errors };
}
