export declare const SUPPORTED_SLATE_OPERATION_SHAPES: readonly ["rectangle", "roundedrectangle", "ellipse", "circle", "star", "triangle", "pentagon", "hexagon", "octagon", "trapezium", "parallelogram", "rarrow", "larrow", "diamond"];
export type SlateOperationShape = (typeof SUPPORTED_SLATE_OPERATION_SHAPES)[number];
export type SlateOperationKind = "add_nodes" | "update_nodes" | "delete_nodes" | "connect_nodes" | "disconnect_nodes" | "update_connections" | "arrange_nodes" | "update_slate";
export interface SlateNodeSelector {
    ids?: string[];
    text?: string;
}
export interface SlateOperation {
    kind: SlateOperationKind;
    count?: number;
    shape?: SlateOperationShape;
    text?: string;
    ids?: string[];
    connectionIds?: string[];
    width?: number;
    height?: number;
    gap?: number;
    target?: SlateNodeSelector;
    from?: SlateNodeSelector;
    to?: SlateNodeSelector;
    placement?: {
        relativeTo?: string;
        direction?: "left" | "right" | "above" | "below" | "center";
        arrangement?: "row" | "column" | "grid";
        gap?: number;
    };
    layout?: "row" | "column" | "grid" | "circle";
    changes?: Record<string, any>;
    style?: Record<string, any>;
}
export interface SlateOperationPlan {
    message: string;
    operations: SlateOperation[];
}
export interface SlateOperationValidation {
    valid: boolean;
    errors: string[];
}
export interface SlateOperationReport {
    created: string[];
    updated: string[];
    deleted: string[];
    connected: string[];
    disconnected: string[];
    connectionsUpdated: string[];
}
export declare function validateSlateOperationPlan(plan: SlateOperationPlan, { userMessage, existingNodeIds, existingConnectionIds, }?: {
    userMessage?: string;
    existingNodeIds?: string[];
    existingConnectionIds?: string[];
}): SlateOperationValidation;
export declare function summarizeSlateForOperations(slate: any): Record<string, any>;
export declare function applySlateOperations(slate: any, plan: SlateOperationPlan, { userMessage }?: {
    userMessage?: string;
}): {
    message: string;
    report: SlateOperationReport;
};
