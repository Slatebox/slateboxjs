export interface NormalizedPlan {
    plan: any;
    /** One line per repair, "Operation 3 count \"2\" read as 2.", for logs and tests. */
    changes: string[];
}
export declare function normalizePlan(plan: unknown): NormalizedPlan;
