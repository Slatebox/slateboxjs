/**
 * The contract as data: describeOperations for an instance description and
 * tool generators, slateOperationPlanSchema (JSON Schema) for OpenAPI and
 * model tools, and the applySlateOperations tool the app gives its model.
 */
import { type ContractOptions, type SlateOperationPlan } from "./contract";
export declare function describeOperations(options?: ContractOptions): {
    version: number;
    kinds: {
        [k: string]: {
            fields: string[];
        };
    };
    noteKeys: {
        [x: string]: {
            description: any;
        };
    };
    noteStyleKeys: string[];
    connectorKeys: {
        [k: string]: {
            description: any;
        };
    };
    connectorStyleKeys: string[];
    slateKeys: {
        [k: string]: {
            description: string;
        };
    };
    selector: Record<string, any>;
    layouts: ("circle" | "grid" | "row" | "column" | "align-left" | "align-center" | "align-right" | "align-top" | "align-middle" | "align-bottom" | "distribute-horizontal" | "distribute-vertical" | "tidy" | "tree")[];
    presets: ("text" | "sticky")[];
    limits: import("./contract").Limits;
    shapes: string[];
    fonts: string[];
    animations: string[];
    effects: string[];
    errors: {
        invalid_operation_plan: string;
        ambiguous_selector: string;
        no_match: string;
        note_limit: string;
        connector_limit: string;
        id_taken: string;
    };
};
/**
 * The plan's JSON Schema. A shape is a name or a custom shape object (oneOf);
 * `{modelTool: true}` lists names only, so the schema stays free of
 * combinators for every model provider (a model gets custom shapes through
 * the host's shape tools, not by writing paths).
 */
export declare function slateOperationPlanSchema(options?: ContractOptions, form?: {
    modelTool?: boolean;
}): Record<string, any>;
export declare const SLATE_OPERATION_TOOL: Readonly<{
    name: "applySlateOperations";
    description: "Edit the existing slate without starting a new slate, replacing its content, or changing its theme unless the user explicitly asked for that. Always include a natural completion message.";
    parameters: Record<string, any>;
}>;
export declare function operationPlanRetryPrompt(errors: string[]): string;
export declare function naturalOperationFallback(plan: Partial<SlateOperationPlan> | undefined): string;
