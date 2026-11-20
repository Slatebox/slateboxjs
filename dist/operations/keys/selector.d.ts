export interface NodeSelector {
    ids?: string[];
    text?: string;
    match?: "exact" | "contains";
    all?: boolean;
    within?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    groupId?: string;
}
export declare function checkSelector(selector: unknown, label: string): string[];
export declare function selectorSchema(): Record<string, any>;
