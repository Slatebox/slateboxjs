/**
 * compat.ts - Property name adapter layer for v1 ↔ v2 compatibility
 *
 * Maps v1 property names to v2 and vice versa so that existing v1 JSON
 * data can be loaded into v2 and v2 can export in v1-compatible format.
 */
import type { NodeOptions } from "./Node";
import type { SlateOptions } from "./Slate";
/** Convert v1 node JSON properties to v2 NodeOptions */
export declare function v1NodeToV2(v1: Record<string, any>): Partial<NodeOptions>;
/** Convert v2 NodeOptions to v1 node JSON format */
export declare function v2NodeToV1(v2: Partial<NodeOptions>): Record<string, any>;
/** Convert v1 slate JSON options to v2 SlateOptions */
export declare function v1SlateToV2(v1: Record<string, any>): Partial<SlateOptions>;
/** Convert v2 SlateOptions to v1 slate JSON format */
export declare function v2SlateToV1(v2: Partial<SlateOptions>): Record<string, any>;
export interface V1Association {
    childId: string;
    parentId: string;
    isStraightLine?: boolean;
    blnStraight?: boolean;
    lineColor?: string;
    lineEffect?: string;
    lineOpacity?: number;
    lineType?: string;
    lineCurviness?: number;
    lineCurveType?: string;
    lineWidth?: number;
    showParentArrow?: boolean;
    showChildArrow?: boolean;
}
export interface V2Association {
    id?: string;
    childId: string;
    parentId: string;
    isStraightLine: boolean;
    lineColor: string;
    lineEffect: string;
    lineOpacity: number;
    lineType: "bezier" | "linear" | "straight";
    lineCurveType: "cubic" | "quadratic";
    lineCurviness: number;
    lineWidth: number;
    showParentArrow: boolean;
    showChildArrow: boolean;
}
/** Convert v1 association to v2 format */
export declare function v1AssociationToV2(v1: Record<string, any>): V2Association;
/** Convert v2 association to v1 format */
export declare function v2AssociationToV1(v2: V2Association): Record<string, any>;
/** Convert an entire v1 slate JSON to v2-compatible format */
export declare function convertV1JsonToV2(v1Json: any): any;
/** Convert v2 slate data to v1 JSON format */
export declare function convertV2JsonToV1(v2Json: any): any;
