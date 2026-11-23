import { type ContractOptions, type SlateOperationPlan, type SlateOperationReport } from "./contract";
import { type StoredSlate } from "./stored";
export interface ApplyOptions extends ContractOptions {
    userMessage?: string;
    idFactory?: () => string;
    /** Refuse with 409 no_match when an operation matches nothing (a save, not a preview). */
    requireMatches?: boolean;
    /**
     * The plan is a carried-out (materialized) plan being applied again, as the
     * run listener does: an id it names that already exists was made by that
     * run, so it is left as it is. Otherwise an id already in use is refused
     * (409 id_taken), so later operations cannot edit the wrong object.
     */
    replay?: boolean;
}
export interface ApplyResult {
    slate: StoredSlate;
    materializedPlan: SlateOperationPlan;
    report: SlateOperationReport;
}
export declare function applyPlanToJSON(input: any, plan: SlateOperationPlan, options?: ApplyOptions): ApplyResult;
