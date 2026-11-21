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
/** How an end on a note behaves (see core/LineEnds.ts). */
export const END_MODES = ["follow", "pinned"] as const;
/** One end: follow, pinned where it is, or pinned to the middle of a side. */
export const END_CHOICES = ["follow", "pinned", "top", "right", "bottom", "left"] as const;

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
  ends: {
    spec: { type: "enum", values: END_MODES },
    description:
      "Both ends that are on notes: follow (each end takes the shortest way round its note as things move) or pinned (each end stays at the spot on its note's edge where it is now).",
  },
  fromEnd: {
    spec: { type: "enum", values: END_CHOICES },
    description:
      "The starting end: follow, pinned (where it is now), or pinned to the middle of the note's top, right, bottom or left side.",
  },
  toEnd: {
    spec: { type: "enum", values: END_CHOICES },
    description:
      "The far end: follow, pinned (where it is now), or pinned to the middle of the note's top, right, bottom or left side. Not for a free end.",
  },
  toNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the far end to this note (its id). A free end is attached to it. The connector keeps its id.",
  },
  fromNote: {
    spec: { type: "string", minLength: 1, maxLength: 200 },
    description: "Reconnect the starting end to this note (its id); the connector then belongs to that note and keeps its id.",
  },
  toPoint: {
    spec: { type: "point" },
    description:
      "Leave the far end free at this point on the canvas (a saved point that stays put). Detaches it from its note if it is on one; moves it if it is already free.",
    field: "targetPoint",
  },
  fromPoint: {
    spec: { type: "point" },
    description:
      "Leave the starting end free at this point. The connector then belongs to the note at its far end, its arrows kept as drawn. A connector keeps at least one end on a note.",
  },
};

/** Keys that move or pin a connector's ends rather than restyle it (update_connections only). */
export const CONNECTOR_END_KEYS = ["ends", "fromEnd", "toEnd", "toNote", "fromNote", "toPoint", "fromPoint"] as const;

/** Keys connect_nodes accepts in style (a new connector's ends are set by `from` and `to`). */
export const CONNECTOR_STYLE_KEYS = Object.keys(CONNECTOR_KEYS).filter((key) => !(CONNECTOR_END_KEYS as readonly string[]).includes(key));

/** Defaults written on a new connector, matching what the app has always stored. */
export const NEW_CONNECTOR = { lineColor: "#333333", lineWidth: 3, lineType: "bezier" } as const;

export const FREE_END_PREFIX = "__free_";
