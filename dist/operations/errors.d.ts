export interface PlanErrorGroup {
    /** The problem as validatePlan words it after "Operation N " ("count must be …"), or the whole line. */
    problem: string;
    /** The operations (1-based) it was found on; empty for a plan-wide problem. */
    operations: number[];
    /** The group in one line. */
    message: string;
}
/** "1–3, 5, 7–9": consecutive operations as one range. */
export declare function operationRanges(numbers: number[]): string;
/** Split a refusal's message into its sentences when only the joined message is to hand. */
export declare function planErrorsOf(message: string): string[];
export declare function groupPlanErrors(errors: readonly string[]): PlanErrorGroup[];
/**
 * What the contract wants instead, once per problem found: the field each kind needs or takes.
 * Only problems the contract can answer for certain get a hint.
 */
export declare function planErrorHints(errors: readonly string[]): string[];
