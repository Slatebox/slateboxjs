/**
 * compat.ts - Property name adapter layer for v1 ↔ v2 compatibility
 *
 * Maps v1 property names to v2 and vice versa so that existing v1 JSON
 * data can be loaded into v2 and v2 can export in v1-compatible format.
 */

import type { NodeOptions } from "./Node";
import type { SlateOptions } from "./Slate";

// ─── Node property mappings ──────────────────────────────────────────

/** Convert v1 node JSON properties to v2 NodeOptions */
export function v1NodeToV2(v1: Record<string, any>): Partial<NodeOptions> {
  const v2: Record<string, any> = { ...v1 };

  // Position aliases
  if (v1.xPos !== undefined && v2.x === undefined) {
    v2.x = v1.xPos;
    delete v2.xPos;
  }
  if (v1.yPos !== undefined && v2.y === undefined) {
    v2.y = v1.yPos;
    delete v2.yPos;
  }

  // Color aliases
  if (v1.foregroundColor !== undefined && v2.fontColor === undefined) {
    v2.fontColor = v1.foregroundColor;
    delete v2.foregroundColor;
  }

  // Shape mapping: v1 shapeHint → v2 shape (if shape isn't already set)
  if (v1.shapeHint !== undefined && v2.shape === undefined) {
    v2.shape = mapShapeHintToShape(v1.shapeHint);
    delete v2.shapeHint;
  }

  // SVG string alias
  if (v1.svgString !== undefined && v2.svgContent === undefined) {
    v2.svgContent = v1.svgString;
    delete v2.svgString;
  }

  // Boolean flag: v1 uses blnStraight in associations
  if (v1.blnStraight !== undefined) {
    v2.isStraightLine = v1.blnStraight;
    delete v2.blnStraight;
  }

  return v2 as Partial<NodeOptions>;
}

/** Convert v2 NodeOptions to v1 node JSON format */
export function v2NodeToV1(v2: Partial<NodeOptions>): Record<string, any> {
  const v1: Record<string, any> = { ...v2 };

  // Position aliases
  v1.xPos = v2.x;
  v1.yPos = v2.y;

  // Color aliases
  v1.foregroundColor = v2.fontColor;

  // Shape mapping: v2 shape → v1 shapeHint
  if (v2.shape) {
    v1.shapeHint = v2.shape;
  }

  // SVG string alias
  if (v2.svgContent) {
    v1.svgString = v2.svgContent;
  }

  return v1;
}

// ─── Slate property mappings ─────────────────────────────────────────

/** Convert v1 slate JSON options to v2 SlateOptions */
export function v1SlateToV2(v1: Record<string, any>): Partial<SlateOptions> {
  const v2: Record<string, any> = { ...v1 };

  // v1 uses "container" as string selector, v2 uses element parameter
  // Just preserve it as-is for downstream handling

  return v2 as Partial<SlateOptions>;
}

/** Convert v2 SlateOptions to v1 slate JSON format */
export function v2SlateToV1(v2: Partial<SlateOptions>): Record<string, any> {
  const v1: Record<string, any> = { ...v2 };
  return v1;
}

// ─── Association property mappings ───────────────────────────────────

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
export function v1AssociationToV2(v1: Record<string, any>): V2Association {
  return {
    id: v1.id || `${v1.parentId}->${v1.childId}`,
    childId: v1.childId,
    parentId: v1.parentId,
    isStraightLine: v1.isStraightLine ?? v1.blnStraight ?? false,
    lineColor: v1.lineColor || "#000",
    lineEffect: v1.lineEffect || "",
    lineOpacity: v1.lineOpacity ?? 1,
    lineType: v1.lineType || "bezier",
    lineCurveType: v1.lineCurveType || "cubic",
    lineCurviness: v1.lineCurviness ?? 0.1,
    lineWidth: v1.lineWidth ?? 6,
    showParentArrow: v1.showParentArrow ?? false,
    showChildArrow: v1.showChildArrow ?? true,
  };
}

/** Convert v2 association to v1 format */
export function v2AssociationToV1(v2: V2Association): Record<string, any> {
  return {
    childId: v2.childId,
    parentId: v2.parentId,
    isStraightLine: v2.isStraightLine,
    lineColor: v2.lineColor,
    lineEffect: v2.lineEffect,
    lineOpacity: v2.lineOpacity,
    lineType: v2.lineType,
    lineCurveType: v2.lineCurveType,
    lineCurviness: v2.lineCurviness,
    lineWidth: v2.lineWidth,
    showParentArrow: v2.showParentArrow,
    showChildArrow: v2.showChildArrow,
  };
}

// ─── Shape hint mapping ──────────────────────────────────────────────

/** Map v1 shapeHint string to v2 shape name */
function mapShapeHintToShape(shapeHint: string): string {
  const map: Record<string, string> = {
    rect: "rectangle",
    rectangle: "rectangle",
    roundedrectangle: "roundedrectangle",
    ellipse: "ellipse",
    circle: "circle",
    star: "star",
    trapezium: "trapezium",
    triangle: "triangle",
    pentagon: "pentagon",
    parallelogram: "parallelogram",
    octagon: "octagon",
    hexagon: "hexagon",
    rarrow: "rarrow",
    larrow: "larrow",
  };

  return map[shapeHint.toLowerCase()] || shapeHint;
}

// ─── Bulk conversion helpers ─────────────────────────────────────────

/** Convert an entire v1 slate JSON to v2-compatible format */
export function convertV1JsonToV2(v1Json: any): any {
  const v2: any = {
    options: v1SlateToV2(v1Json.options || {}),
    nodes: [],
    shareId: v1Json.shareId || "",
  };

  if (Array.isArray(v1Json.nodes)) {
    v2.nodes = v1Json.nodes.map((v1Node: any) => {
      const nodeOptions = v1NodeToV2(v1Node.options || {});
      const relationships: any = { associations: [] };

      if (v1Node.relationships?.associations) {
        relationships.associations = v1Node.relationships.associations.map(
          (a: any) => v1AssociationToV2(a)
        );
      }

      return {
        options: nodeOptions,
        relationships,
      };
    });
  }

  return v2;
}

/** Convert v2 slate data to v1 JSON format */
export function convertV2JsonToV1(v2Json: any): any {
  const v1: any = {
    options: v2SlateToV1(v2Json.options || {}),
    nodes: [],
    shareId: v2Json.shareId || "",
  };

  if (Array.isArray(v2Json.nodes)) {
    v1.nodes = v2Json.nodes.map((v2Node: any) => {
      const nodeOptions = v2NodeToV1(v2Node.options || {});
      const relationships: any = { associations: [] };

      if (v2Node.relationships?.associations) {
        relationships.associations = v2Node.relationships.associations.map(
          (a: any) => v2AssociationToV1(a)
        );
      }

      return {
        options: nodeOptions,
        relationships,
      };
    });
  }

  return v1;
}
