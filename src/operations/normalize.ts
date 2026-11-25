/**
 * normalizePlan: the few repairs to a model's plan whose meaning is not in doubt, made before
 * validatePlan reads it. It never invents a value: a field it cannot read one way only is left as
 * it is, for validatePlan to refuse with its own words.
 *
 *   - A whole number written as a string ("3", " 12 ") where the contract takes a number
 *     (add_nodes count, x, y, width, height; arrange_nodes gap) becomes that number.
 *   - An add_nodes with no count but a list of new note ids adds exactly those notes: count is
 *     ids.length. (Without ids there is nothing to read a count from, so it stays missing.)
 *
 * Everything else (a renamed field, a zero, a fraction where an integer is required, a field on the
 * wrong kind) is left alone. The input is not changed; `changes` says what was repaired, in words.
 */
import { isObject } from "./keys/values";

export interface NormalizedPlan {
  plan: any;
  /** One line per repair, "Operation 3 count \"2\" read as 2.", for logs and tests. */
  changes: string[];
}

const NUMBER_TEXT = /^\s*-?\d+(?:\.\d+)?\s*$/;
const INTEGER_TEXT = /^\s*\d+\s*$/;

/** The numeric fields each kind takes, and whether each must be a whole number. */
const NUMERIC_FIELDS: Record<string, Record<string, "integer" | "number">> = {
  add_nodes: { count: "integer", x: "number", y: "number", width: "number", height: "number" },
  arrange_nodes: { gap: "number" },
};

export function normalizePlan(plan: unknown): NormalizedPlan {
  if (!isObject(plan) || !Array.isArray(plan.operations)) return { plan, changes: [] };
  const changes: string[] = [];
  const operations = plan.operations.map((operation: unknown, index: number) => {
    if (!isObject(operation) || typeof operation.kind !== "string") return operation;
    const prefix = `Operation ${index + 1}`;
    const numeric = NUMERIC_FIELDS[operation.kind];
    if (!numeric) return operation;
    const next: Record<string, any> = { ...operation };
    for (const [field, type] of Object.entries(numeric)) {
      const value = next[field];
      if (typeof value !== "string") continue;
      if (!(type === "integer" ? INTEGER_TEXT : NUMBER_TEXT).test(value)) continue;
      next[field] = Number(value);
      changes.push(`${prefix} ${field} ${JSON.stringify(value)} read as ${next[field]}.`);
    }
    if (
      operation.kind === "add_nodes" &&
      next.count === undefined &&
      Array.isArray(next.ids) &&
      next.ids.length > 0 &&
      next.ids.every((id: unknown) => typeof id === "string" && id.length > 0)
    ) {
      next.count = next.ids.length;
      changes.push(`${prefix} count read as ${next.count}, one note per id.`);
    }
    return next;
  });
  return changes.length ? { plan: { ...plan, operations }, changes } : { plan, changes };
}
