/**
 * summarizeSlate: the compact read an agent or model works from, for a stored
 * slate or a live one. Ids and geometry for every note (first 150), every
 * connector with the id the engine gives it (first 250). A locked or rotated
 * note says so; a connector whose far end is not on a note reads as a point.
 */
import { allConnectors, isFreeEnd, noteId, read, toStoredSlate } from "./stored";

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
  }>;
  connections: Array<Record<string, any>>;
}

export function summarizeSlate(input: any): SlateSummary {
  const slate = toStoredSlate(input);
  const nodes = slate.nodes.slice(0, 150).map((node) => {
    const options = node.options;
    const rotationAngle = read(node, "rotationAngle");
    return {
      id: noteId(node),
      text: `${options.text || ""}`.replace(/\s+/g, " ").trim().slice(0, 240),
      shape: options.shape || options.vectorPath || options.shapeHint || "rectangle",
      x: read(node, "x"),
      y: read(node, "y"),
      width: Number(options.width ?? 120),
      height: Number(options.height ?? 80),
      ...(rotationAngle ? { rotationAngle } : {}),
      ...(options.isLocked === true ? { locked: true as const } : {}),
    };
  });
  const connections = allConnectors(slate)
    .slice(0, 250)
    .map(({ association }) => {
      const free = isFreeEnd(association);
      return {
        id: association.id,
        from: association.parentId,
        to: free ? null : association.childId,
        ...(free ? { toPoint: association.targetPoint ?? null } : {}),
        label: association.label || "",
        lineColor: association.lineColor,
        lineWidth: association.lineWidth,
        lineOpacity: association.lineOpacity,
        lineType: association.lineType,
        lineCurveType: association.lineCurveType,
        lineCurviness: association.lineCurviness,
        showParentArrow: association.showParentArrow,
        showChildArrow: association.showChildArrow,
      };
    });
  return {
    name: slate.options.name || "",
    description: slate.options.description || "",
    nodeCount: slate.nodes.length,
    nodes,
    connections,
  };
}
