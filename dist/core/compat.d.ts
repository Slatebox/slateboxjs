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
/**
 * True for a textOffset written by Slatebox v1. v1 stored the measured centre
 * of the shape's bounding box relative to the node's top-left corner, together
 * with that box's size: `{x: 0, y: height / 2, width, height}`. v3 never writes
 * `width` or `height` into textOffset, so their presence marks the v1 shape.
 */
export declare function isLegacyTextOffset(textOffset: unknown): boolean;
/**
 * Replace a v1 textOffset with the centred v3 offset `{x: 0, y: 0}`.
 *
 * v3 reads textOffset as a nudge away from the shape's centre. Reading the v1
 * measurement that way added half the shape's height again and put every
 * legacy label on (or below) the bottom edge. v1 recomputed the value on every
 * text edit, resize, rotate and shape change and had no control for moving
 * text by hand, so it never carries intent: a v1 label is always centred.
 */
export declare function normalizeLegacyTextOffset<T extends {
    textOffset?: unknown;
}>(opts: T): T;
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
    lineDash?: "solid" | "dashed" | "dotted";
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
    lineDash: "solid" | "dashed" | "dotted";
    lineOpacity: number;
    lineType: string;
    lineCurveType: "cubic" | "quadratic";
    lineCurviness: number;
    lineWidth: number;
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
    label?: string;
}
/** Convert v1 association to v2 format */
export declare function v1AssociationToV2(v1: Record<string, any>): V2Association;
/** Convert v2 association to v1 format */
export declare function v2AssociationToV1(v2: V2Association): Record<string, any>;
/** Convert an entire v1 slate JSON to v2-compatible format */
export declare function convertV1JsonToV2(v1Json: any): any;
/** Convert v2 slate data to v1 JSON format */
export declare function convertV2JsonToV1(v2Json: any): any;
