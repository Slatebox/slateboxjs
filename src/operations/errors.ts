/**
 * A refused plan's problems, grouped: validatePlan says each problem once per operation
 * ("Operation 1 count must be …", "Operation 2 count must be …", …), which is right for one
 * operation and unreadable for twenty. groupPlanErrors folds the same problem on many operations
 * into one line ("Operations 1–23: count must be an integer from 1 to 20."), keeping the order
 * problems were first met; planErrorHints says, once per problem, what the contract wants instead,
 * for a model asked to repair its plan.
 */
import { OPERATION_FIELDS, SLATE_OPERATION_KINDS } from "./contract";

export interface PlanErrorGroup {
  /** The problem as validatePlan words it after "Operation N " ("count must be …"), or the whole line. */
  problem: string;
  /** The operations (1-based) it was found on; empty for a plan-wide problem. */
  operations: number[];
  /** The group in one line. */
  message: string;
}

const OPERATION_LINE = /^Operation (\d+) (.+)$/s;
// The leading verb of a problem, for many operations at once ("has" → "have").
const PLURAL_VERBS: Record<string, string> = {
  has: "have", is: "are", needs: "need", adds: "add", references: "reference", requires: "require",
  contains: "contain", gives: "give", names: "name", moves: "move", keeps: "keep", sets: "set",
};

/** "1–3, 5, 7–9": consecutive operations as one range. */
export function operationRanges(numbers: number[]): string {
  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j += 1;
    parts.push(j > i ? `${sorted[i]}–${sorted[j]}` : String(sorted[i]));
    i = j;
  }
  return parts.join(", ");
}

/** Split a refusal's message into its sentences when only the joined message is to hand. */
export function planErrorsOf(message: string): string[] {
  return String(message ?? "")
    .split(/(?<=\.)\s+(?=[A-Z])/)
    .map((line) => line.trim())
    .filter(Boolean);
}

export function groupPlanErrors(errors: readonly string[]): PlanErrorGroup[] {
  const groups = new Map<string, PlanErrorGroup>();
  for (const raw of errors) {
    const line = String(raw ?? "").trim();
    if (!line) continue;
    const match = OPERATION_LINE.exec(line);
    const problem = match ? match[2] : line;
    const key = match ? `op:${problem}` : `plan:${line}`;
    const group = groups.get(key) ?? { problem, operations: [], message: "" };
    if (match) group.operations.push(Number(match[1]));
    groups.set(key, group);
  }
  for (const group of groups.values()) {
    if (!group.operations.length) group.message = group.problem;
    else if (group.operations.length === 1) group.message = `Operation ${group.operations[0]} ${group.problem}`;
    else {
      const [first, ...rest] = group.problem.split(" ");
      const verb = PLURAL_VERBS[first];
      group.message = verb
        ? `Operations ${operationRanges(group.operations)} ${[verb, ...rest].join(" ")}`
        : `Operations ${operationRanges(group.operations)}: ${group.problem}`;
    }
  }
  return [...groups.values()];
}

/** The kinds that take a field, in contract order. */
const kindsTaking = (field: string) => SLATE_OPERATION_KINDS.filter((kind) => OPERATION_FIELDS[kind].includes(field));

/**
 * What the contract wants instead, once per problem found: the field each kind needs or takes.
 * Only problems the contract can answer for certain get a hint.
 */
export function planErrorHints(errors: readonly string[]): string[] {
  const hints = new Set<string>();
  for (const { problem } of groupPlanErrors(errors)) {
    if (/^count must be an integer/.test(problem)) {
      hints.add('add_nodes requires count, a whole number: how many notes it adds. With ids, count is ids.length (count 1 with ids ["a"]).');
      continue;
    }
    const unknown = /^has an unknown field: ([A-Za-z_]+)\.$/.exec(problem);
    if (unknown) {
      const field = unknown[1];
      const takes = kindsTaking(field);
      if (field === "connectionIds") hints.add("connect_nodes names its new connectors with ids; connectionIds is only for disconnect_nodes and update_connections.");
      else if (takes.length) hints.add(`${field} belongs to ${takes.join(", ")} only.`);
      else hints.add(`No operation takes ${field}.`);
      continue;
    }
    if (/^needs both x and y/.test(problem)) hints.add("add_nodes gives both x and y, or neither (then placement says where the notes go).");
    if (/^has an unsupported kind/.test(problem)) hints.add(`kind is one of ${SLATE_OPERATION_KINDS.join(", ")}.`);
  }
  return [...hints];
}
