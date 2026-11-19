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

export const LINE_TYPES = ["bezier", "orthogonal", "straight", "linear", "curved"] as const;
export const LINE_CURVE_TYPES = ["cubic", "quadratic"] as const;

export const CONNECTOR_KEYS: Record<string, ConnectorKey> = {
  label: { spec: { type: "string", maxLength: 500 }, description: "Text shown on the connector." },
  lineColor: { spec: { type: "color" }, description: "Line colour." },
  lineWidth: { spec: { type: "number", min: 0.1, max: 100 }, description: "Line width." },
  lineOpacity: { spec: { type: "number", min: 0, max: 1 }, description: "Line opacity from 0 to 1." },
  lineType: { spec: { type: "enum", values: LINE_TYPES }, description: "Path style." },
  lineCurveType: { spec: { type: "enum", values: LINE_CURVE_TYPES }, description: "Curve type." },
  lineCurviness: { spec: { type: "number", min: 0, max: 1 }, description: "How much the line bends." },
  showParentArrow: { spec: { type: "boolean" }, description: "Arrowhead at the starting note." },
  showChildArrow: { spec: { type: "boolean" }, description: "Arrowhead at the far end." },
  toPoint: {
    spec: { type: "point" },
    description: "Move a free end to this point. Only for a connector whose far end is not on a note.",
    field: "targetPoint",
  },
};

/** Keys connect_nodes accepts in style (a new connector's end is set by `to`). */
export const CONNECTOR_STYLE_KEYS = Object.keys(CONNECTOR_KEYS).filter((key) => key !== "toPoint");

/** Defaults written on a new connector, matching what the app has always stored. */
export const NEW_CONNECTOR = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" } as const;

export const FREE_END_PREFIX = "__free_";
