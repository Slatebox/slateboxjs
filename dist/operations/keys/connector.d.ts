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
/** The dashes the canvas draws (Connector.lineDashArray); a line without one is solid. */
export declare const LINE_DASHES: readonly ["solid", "dashed", "dotted"];
/** How an end on a note behaves (see core/LineEnds.ts). */
export declare const END_MODES: readonly ["follow", "pinned"];
/** One end: follow, pinned where it is, or pinned to the middle of a side. */
export declare const END_CHOICES: readonly ["follow", "pinned", "top", "right", "bottom", "left"];
export declare const CONNECTOR_KEYS: Record<string, ConnectorKey>;
/** Keys that move or pin a connector's ends rather than restyle it (update_connections only). */
export declare const CONNECTOR_END_KEYS: readonly ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"];
/** Keys connect_nodes accepts in style (a new connector's ends are set by `from` and `to`). */
export declare const CONNECTOR_STYLE_KEYS: string[];
/** Defaults written on a new connector, matching what the app has always stored. */
export declare const NEW_CONNECTOR: {
    readonly lineColor: "#333333";
    readonly lineWidth: 3;
    readonly lineType: "bezier";
};
export declare const FREE_END_PREFIX = "__free_";
