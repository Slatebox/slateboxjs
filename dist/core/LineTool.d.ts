export type LineToolResult = {
    result: "connected" | "free" | "cancelled";
    associationId?: string;
    nodeId?: string;
};
export declare function startLineTool(slate: any, node: any): Promise<LineToolResult>;
