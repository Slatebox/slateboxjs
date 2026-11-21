export interface SlateSummary {
    name: string;
    description: string;
    nodeCount: number;
    nodes: Array<{
        id: string;
        text: string;
        shape: string;
        x: number;
        y: number;
        width: number;
        height: number;
        rotationAngle?: number;
        locked?: true;
        /** The template category the note names. */
        category?: string;
    }>;
    connections: Array<Record<string, any>>;
}
export declare function summarizeSlate(input: any): SlateSummary;
