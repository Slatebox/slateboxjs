/**
 * Relationship.ts - Association interface and helpers
 *
 * Defines the data model for connections between nodes,
 * matching the v1 JSON association format.
 */
export interface Association {
    id: string;
    parentId: string;
    childId: string;
    lineColor: string;
    lineOpacity: number;
    lineEffect: string;
    lineType: string;
    lineCurveType: "cubic" | "quadratic";
    lineCurviness: number;
    lineWidth: number;
    isStraightLine: boolean;
    showParentArrow: boolean;
    showChildArrow: boolean;
    sourcePoint?: {
        x: number;
        y: number;
    } | null;
    targetPoint?: {
        x: number;
        y: number;
    } | null;
    sourceAnchor?: {
        x: number;
        y: number;
    } | null;
    targetAnchor?: {
        x: number;
        y: number;
    } | null;
}
/** Create a default association between two node IDs */
export declare function createDefaultAssociation(parentId: string, childId: string, overrides?: Partial<Association>): Association;
