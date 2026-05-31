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
  lineType: "bezier" | "linear" | "straight";
  lineCurveType: "cubic" | "quadratic";
  lineCurviness: number;
  lineWidth: number;
  isStraightLine: boolean;
  showParentArrow: boolean;
  showChildArrow: boolean;
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
    lineColor: "#000",
    lineOpacity: 1,
    lineEffect: "",
    lineType: "bezier",
    lineCurveType: "cubic",
    lineCurviness: 0.1,
    lineWidth: 6,
    isStraightLine: false,
    showParentArrow: false,
    showChildArrow: true,
    ...overrides,
  };
}
