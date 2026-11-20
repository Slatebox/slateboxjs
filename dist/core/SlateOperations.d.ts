/**
 * The live applier. A plan is decided by the same function the server uses
 * (operations/applyPlanToJSON) on a stored copy of the live slate, so every
 * rule (ids made earlier in a plan, exact text, locked notes, connectors by
 * their two notes, the stored shape of rotation and background) holds here
 * exactly as it does for a saved slate. The carried-out plan is then sent to
 * the canvas and the room as collaboration packages.
 */
import { type ContractOptions, type SlateOperation, type SlateOperationPlan, type SlateOperationReport, type StoredSlate } from "../operations";
/** Collaboration packages that carry a materialized operation from `before` to `after`. */
export declare function packagesForOperation(operation: SlateOperation, before: StoredSlate, after: StoredSlate): any[];
export declare function applySlateOperations(slate: any, plan: SlateOperationPlan, { userMessage, replay, ...contract }?: {
    userMessage?: string;
    replay?: boolean;
} & ContractOptions): {
    message: string;
    report: SlateOperationReport;
    materializedPlan: SlateOperationPlan;
    applied: Promise<void>;
};
