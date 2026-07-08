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
  // bezier | orthogonal | straight | linear | curved (pane + connectable)
  lineType: string;
  lineCurveType: "cubic" | "quadratic";
  lineCurviness: number;
  lineWidth: number;
  isStraightLine: boolean;
  showParentArrow: boolean;
  showChildArrow: boolean;
  // Free-floating endpoints (L1b): when an endpoint isn't attached to a node it
  // holds a bare world point. targetPoint set ⇒ the target end floats (childId
  // is a synthetic __free_* id); sourcePoint set ⇒ the source end floats.
  sourcePoint?: { x: number; y: number } | null;
  targetPoint?: { x: number; y: number } | null;
  // Per-endpoint locking (L5): a normalized local anchor {x,y} 0..1 pins the
  // endpoint to a fixed spot on the node (ABSOLUTE, rotates/moves with it);
  // null = RELATIVE (auto-flow, re-solves to the nearest edge).
  sourceAnchor?: { x: number; y: number } | null;
  targetAnchor?: { x: number; y: number } | null;
}

/** Create a default association between two node IDs */
export function createDefaultAssociation(
  parentId: string,
  childId: string,
  overrides?: Partial<Association>
): Association {
  return {
    id: `${parentId}->${childId}`,
    parentId,
    childId,
    lineColor: "#666666",
    lineOpacity: 1,
    lineEffect: "",
    lineType: "bezier",
    lineCurveType: "cubic",
    lineCurviness: 0.1,
    lineWidth: 3,
    isStraightLine: false,
    showParentArrow: false,
    showChildArrow: true,
    ...overrides,
  };
}
