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
export declare function applySlateOperations(slate: any, plan: SlateOperationPlan, { userMessage, replay, send, ...contract }?: {
    userMessage?: string;
    replay?: boolean;
    /**
     * false: draw the plan on this canvas only. Nothing goes to the room or to the host's save
     * path (emitSlateChange): for a screen that watches a run someone saved, such as a visitor
     * with no account, whose canvas must not save or rebroadcast what the server already holds.
     */
    send?: boolean;
} & ContractOptions): {
    message: string;
    report: SlateOperationReport;
    materializedPlan: SlateOperationPlan;
    applied: Promise<void>;
};
