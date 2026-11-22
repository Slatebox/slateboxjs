/**
 * summarizeSlate: the compact read a model works from, for a stored slate or
 * a live one. It is readSlate's note and connector reader cut to the keys a
 * prompt needs: ids and geometry for every note (first 150), every connector
 * (first 250). A locked or rotated note says so; a connector whose far end is
 * not on a note reads as a point. Comment markers are left out, as in readSlate.
 */
import { isCommentMarker, readConnector, readNote } from "./read";
import { allConnectors, toStoredSlate } from "./stored";

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
    templateCategory?: string;
    /** The style-bar controls the note leaves off, when any. */
    hiddenControls?: string[];
  }>;
  connections: Array<Record<string, any>>;
}

const SUMMARY_KEYS = ["text", "shape", "x", "y", "width", "height", "rotationAngle", "locked", "templateCategory", "hiddenControls"];
const CONNECTOR_SUMMARY_KEYS = [
  "lineColor", "lineWidth", "lineOpacity", "lineType", "lineCurveType", "lineCurviness", "showParentArrow", "showChildArrow",
];

export function summarizeSlate(input: any): SlateSummary {
  const slate = toStoredSlate(input);
  const drawn = slate.nodes.filter((node) => !isCommentMarker(node));
  const markers = new Set(slate.nodes.filter(isCommentMarker).map((node) => node.options.id));
  const nodes = drawn.slice(0, 150).map((node) => {
    const read = readNote(node, SUMMARY_KEYS);
    return {
      id: read.id,
      text: `${read.text ?? ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: read.shape,
      x: read.x,
      y: read.y,
      width: Number(read.width ?? 120),
      height: Number(read.height ?? 80),
      ...(read.rotationAngle ? { rotationAngle: read.rotationAngle } : {}),
      ...(read.locked === true ? { locked: true as const } : {}),
      ...(read.templateCategory ? { templateCategory: read.templateCategory as string } : {}),
      ...(read.hiddenControls?.length ? { hiddenControls: read.hiddenControls as string[] } : {}),
    };
  });
  const connections = allConnectors(slate)
    .filter(({ association }) => !markers.has(association.parentId) && !markers.has(association.childId))
    .slice(0, 250)
    .map(({ association }) => {
      const read = readConnector(association);
      return {
        id: read.id,
        from: read.from,
        to: read.to,
        ...("toPoint" in read ? { toPoint: read.toPoint } : {}),
        // Whether each end follows its note, is pinned to a spot on its edge, or is free.
        ...("fromEnd" in read ? { fromEnd: read.fromEnd, toEnd: read.toEnd } : {}),
        label: read.label || "",
        // A key the connector does not store reads as undefined, as it always has in the summary.
        ...Object.fromEntries(CONNECTOR_SUMMARY_KEYS.map((key) => [key, read[key] ?? undefined])),
      };
    });
  return {
    name: slate.options.name || "",
    description: slate.options.description || "",
    nodeCount: drawn.length,
    nodes,
    connections,
  };
}
