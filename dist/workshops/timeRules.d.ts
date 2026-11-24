import type { BehaviourRule, BehaviourVerdict } from './behaviour';
import type { Workshop } from './model';
import type { RuleFamily } from './kinds';
type Rule = BehaviourRule;
/** What one rule says: the caption, the refusal's second half, the note's line, the loop's caption. */
export declare function timeSentence(rule: Rule, board: Workshop): string;
/** A plan's seven rule kinds. */
export declare const timeRuleKindIds: readonly ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"];
/**
 * Whether `after` keeps the rules `before` has: one rule named per refusal, in a fixed order; a rule that
 * only warns lets the change land and says its sentence. Only what changed is held to a rule: a task
 * already in a freeze, or two tasks that already overlap, stay as they are until one of them moves.
 */
export declare function checkTime(before: Workshop, after: Workshop): BehaviourVerdict;
/**
 * Every rule `after` breaks that refuses (a rule that only warns is left out), one sentence each, in the rules' order:
 * what a move made anyway says it breaks, in its dialog and on its mark. Empty when no rule refuses.
 */
export declare function timeProblems(before: Workshop, after: Workshop): string[];
/** A plan's family of rule kinds: launch plans take all seven, hiring plans the line (runway), snap, slip and locks. */
export declare function timeFamily(keys: Record<string, string>): RuleFamily;
/** The ids of the tasks that end past the line (a soft line draws them in red). */
export declare function pastTheLine(board: Workshop): Set<string>;
export {};
