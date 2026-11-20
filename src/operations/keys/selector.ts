/**
 * Note selectors. A selector names notes in exactly one way:
 *   ids       the notes with these ids
 *   text      notes whose whole text is this, ignoring case and extra spaces
 *             (match: "contains" to search)
 *   within    notes lying wholly inside {x, y, width, height}
 *   groupId   the notes of one group
 *   all       every note (when used alone)
 * A text selector that matches more than one note is refused unless it also
 * carries all: true, so a mistyped label cannot change a whole slate.
 */
import { checkValue, isObject } from "./values";

export interface NodeSelector {
  ids?: string[];
  text?: string;
  match?: "exact" | "contains";
  all?: boolean;
  within?: { x: number; y: number; width: number; height: number };
  groupId?: string;
}

const FIELDS = ["ids", "text", "match", "all", "within", "groupId"];
const WAYS = ["ids", "text", "within", "groupId"] as const;

export function checkSelector(selector: unknown, label: string): string[] {
  if (!isObject(selector)) return [`${label} must be a selector such as {ids: [...]}, {text}, {within}, {groupId} or {all: true}.`];
  const errors: string[] = [];
  for (const key of Object.keys(selector)) {
    if (!FIELDS.includes(key)) errors.push(`${label} has an unknown field: ${key}.`);
  }
  const ways = WAYS.filter((way) => selector[way] !== undefined);
  if (ways.length > 1) errors.push(`${label} must name notes one way, not by ${ways.join(" and ")}.`);
  if (!ways.length && selector.all !== true) errors.push(`${label} must name notes by ids, text, within, groupId or all: true.`);
  if (selector.ids !== undefined) {
    if (!Array.isArray(selector.ids) || !selector.ids.length || selector.ids.some((id) => typeof id !== "string" || !id)) {
      errors.push(`${label}.ids must be a list of note ids.`);
    }
  }
  if (selector.text !== undefined && (typeof selector.text !== "string" || !selector.text.trim())) {
    errors.push(`${label}.text must be the text of a note.`);
  }
  if (selector.match !== undefined) {
    if (selector.text === undefined) errors.push(`${label}.match goes with text.`);
    const problem = checkValue({ type: "enum", values: ["exact", "contains"] }, selector.match, `${label}.match`);
    if (problem) errors.push(problem);
  }
  if (selector.all !== undefined && selector.all !== true) errors.push(`${label}.all must be true when given.`);
  if (selector.groupId !== undefined && (typeof selector.groupId !== "string" || !selector.groupId)) {
    errors.push(`${label}.groupId must be a group id.`);
  }
  if (selector.within !== undefined) {
    const within = selector.within;
    const ok =
      isObject(within) &&
      Object.keys(within).every((key) => ["x", "y", "width", "height"].includes(key)) &&
      ["x", "y", "width", "height"].every((key) => typeof within[key] === "number" && Number.isFinite(within[key])) &&
      within.width > 0 &&
      within.height > 0;
    if (!ok) errors.push(`${label}.within must be {x, y, width, height} with a positive width and height.`);
  }
  return errors;
}

export function selectorSchema(): Record<string, any> {
  return {
    type: "object",
    additionalProperties: false,
    description:
      "Name notes one way: ids, text (the whole text, ignoring case and extra spaces; match: \"contains\" to search), within a rectangle, groupId, or all: true. A text selector matching several notes also needs all: true.",
    properties: {
      ids: { type: "array", minItems: 1, items: { type: "string" } },
      text: { type: "string" },
      match: { type: "string", enum: ["exact", "contains"] },
      all: { type: "boolean", enum: [true] },
      within: {
        type: "object",
        additionalProperties: false,
        required: ["x", "y", "width", "height"],
        properties: { x: { type: "number" }, y: { type: "number" }, width: { type: "number" }, height: { type: "number" } },
      },
      groupId: { type: "string" },
    },
  };
}
