/**
 * validatePlan: checks a plan's shape against the contract without a slate.
 * When the caller passes the slate's note and connector ids, references to
 * ids that are neither in the slate nor made earlier in the plan are refused.
 */
import { type ContractOptions, type SlateOperationValidation } from "./contract";
export declare const DESTRUCTIVE_INTENT: RegExp;
export interface ValidateOptions extends ContractOptions {
    userMessage?: string;
    existingNodeIds?: string[];
    existingConnectionIds?: string[];
}
export declare function validatePlan(plan: any, options?: ValidateOptions): SlateOperationValidation;
