/**
 * Connector keys: what an operation may set on a connector and how it is
 * stored on the parent note's association (Relationship.Association).
 */
import type { ValueSpec } from "./values";
export interface ConnectorKey {
    spec: ValueSpec;
    description: string;
    /** Stored association field; defaults to the key itself. */
    field?: string;
}
export declare const LINE_TYPES: readonly ["bezier", "orthogonal", "straight", "linear", "curved"];
export declare const LINE_CURVE_TYPES: readonly ["cubic", "quadratic"];
export declare const CONNECTOR_KEYS: Record<string, ConnectorKey>;
/** Keys connect_nodes accepts in style (a new connector's end is set by `to`). */
export declare const CONNECTOR_STYLE_KEYS: string[];
/** Defaults written on a new connector, matching what the app has always stored. */
export declare const NEW_CONNECTOR: {
    readonly lineColor: "#333333";
    readonly lineWidth: 3;
    readonly lineType: "bezier";
};
export declare const FREE_END_PREFIX = "__free_";
