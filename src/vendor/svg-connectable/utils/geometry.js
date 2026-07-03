/**
 * Geometry utilities for SVG Connectable
 * Handles coordinate calculations, edge detection, and path computation
 */

/**
 * Helper function to calculate angle between two points
 */
function calculateAngle(p1, p2) {
  return (Math.atan2(p2[1] - p1[1], p2[0] - p1[0]) * 180) / Math.PI;
}

/**
 * Helper function to get the tangent angle at a point on a curve
 */
function getTangentAngle(pathData, isStart) {
  if (pathData.length < 2) return 0;

  if (isStart) {
    // For start point, use direction from first to second control point
    const p1 = [pathData[0][1], pathData[0][2]]; // M command
    const nextCmd = pathData[1];
    let p2;

    if (nextCmd[0] === "C") {
      // Cubic bezier - use first control point
      p2 = [nextCmd[1], nextCmd[2]];
    } else if (nextCmd[0] === "L") {
      // Line - use end point
      p2 = [nextCmd[1], nextCmd[2]];
    } else {
      // Fallback
      p2 = [nextCmd[nextCmd.length - 2], nextCmd[nextCmd.length - 1]];
    }

    return calculateAngle(p1, p2);
  } else {
    // For end point, use direction from last control point to end
    const lastCmd = pathData[pathData.length - 1];
    const p2 = [lastCmd[lastCmd.length - 2], lastCmd[lastCmd.length - 1]];
    let p1;

    if (lastCmd[0] === "C") {
      // Cubic bezier - use last control point
      p1 = [lastCmd[lastCmd.length - 4], lastCmd[lastCmd.length - 3]];
    } else if (pathData.length > 1) {
      // Use previous point
      const prevCmd = pathData[pathData.length - 2];
      p1 = [prevCmd[prevCmd.length - 2], prevCmd[prevCmd.length - 1]];
    } else {
      // Fallback
      p1 = [lastCmd[1], lastCmd[2]];
    }

    return calculateAngle(p1, p2);
  }
}

/**
 * Transform a point from element-local coordinates to SVG user coordinates.
 * This properly handles the viewBox transform that getCTM() includes.
 *
 * getCTM() = viewBoxTransform * elementOwnTransform
 * We need just: elementOwnTransform * localPoint
 * So: svgUserCoords = inverse(rootCTM) * elementCTM * localPoint
 */
function localToSvgCoords(element, localX, localY) {
  try {
    // Get the root SVG element
    const svgRoot = element.node.ownerSVGElement || element.node;

    // Use SVGPoint + getScreenCTM for reliable coordinate transformation
    const screenCTM = element.node.getScreenCTM();
    const rootScreenCTM = svgRoot.getScreenCTM();

    if (!screenCTM || !rootScreenCTM) {
      return [localX, localY];
    }

    // Transform local point to screen coordinates using element's screenCTM
    const screenX = screenCTM.a * localX + screenCTM.c * localY + screenCTM.e;
    const screenY = screenCTM.b * localX + screenCTM.d * localY + screenCTM.f;

    // Transform screen coordinates back to SVG user coordinates using inverse of root's screenCTM
    const det = rootScreenCTM.a * rootScreenCTM.d - rootScreenCTM.b * rootScreenCTM.c;
    if (Math.abs(det) < 1e-10) {
      return [localX, localY];
    }

    const invA = rootScreenCTM.d / det;
    const invB = -rootScreenCTM.b / det;
    const invC = -rootScreenCTM.c / det;
    const invD = rootScreenCTM.a / det;
    const invE = (rootScreenCTM.c * rootScreenCTM.f - rootScreenCTM.d * rootScreenCTM.e) / det;
    const invF = (rootScreenCTM.b * rootScreenCTM.e - rootScreenCTM.a * rootScreenCTM.f) / det;

    const svgX = invA * screenX + invC * screenY + invE;
    const svgY = invB * screenX + invD * screenY + invF;

    return [svgX, svgY];
  } catch (e) {
    return [localX, localY];
  }
}

/**
 * Transform a point from SVG user coordinates to element-local coordinates.
 */
function svgCoordsToLocal(element, svgX, svgY) {
  try {
    const svgRoot = element.node.ownerSVGElement || element.node;
    const screenCTM = element.node.getScreenCTM();
    const rootScreenCTM = svgRoot.getScreenCTM();

    if (!screenCTM || !rootScreenCTM) {
      return [svgX, svgY];
    }

    // First: SVG user coords → screen coords using root's screenCTM
    const screenX = rootScreenCTM.a * svgX + rootScreenCTM.c * svgY + rootScreenCTM.e;
    const screenY = rootScreenCTM.b * svgX + rootScreenCTM.d * svgY + rootScreenCTM.f;

    // Then: screen coords → element local coords using inverse of element's screenCTM
    const det = screenCTM.a * screenCTM.d - screenCTM.b * screenCTM.c;
    if (Math.abs(det) < 1e-10) {
      return [svgX, svgY];
    }

    const invA = screenCTM.d / det;
    const invB = -screenCTM.b / det;
    const invC = -screenCTM.c / det;
    const invD = screenCTM.a / det;
    const invE = (screenCTM.c * screenCTM.f - screenCTM.d * screenCTM.e) / det;
    const invF = (screenCTM.b * screenCTM.e - screenCTM.a * screenCTM.f) / det;

    const localX = invA * screenX + invC * screenY + invE;
    const localY = invB * screenX + invD * screenY + invF;

    return [localX, localY];
  } catch (e) {
    return [svgX, svgY];
  }
}

/**
 * getElementCenter
 * Gets the center point of an SVG element in SVG user coordinates
 */
function getElementCenter(element) {
  const bbox = element.bbox();
  return localToSvgCoords(element, bbox.cx, bbox.cy);
}

/**
 * getClosestPointOnEdge
 * Calculates the closest point on the edge of a shape to another point.
 * All coordinates are in SVG user coordinate space (viewBox coords).
 */
function getClosestPointOnEdge(shape, targetPoint) {
  const bbox = shape.bbox();

  // Convert target point from SVG coords to shape's local coords
  const [localTargetX, localTargetY] = svgCoordsToLocal(shape, targetPoint[0], targetPoint[1]);

  // Calculate direction vector from shape center to local target point
  const centerX = bbox.cx;
  const centerY = bbox.cy;
  const dx = localTargetX - centerX;
  const dy = localTargetY - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Avoid division by zero
  if (distance === 0) {
    return localToSvgCoords(shape, centerX, centerY);
  }

  // Normalize direction vector
  const ux = dx / distance;
  const uy = dy / distance;

  // Calculate edge point in local coordinates
  let localEdgePoint;

  if (shape.type === "circle") {
    const radius = parseFloat(shape.attr("r")) || 0;
    localEdgePoint = [centerX + radius * ux, centerY + radius * uy];
  } else if (shape.type === "ellipse") {
    const rx = parseFloat(shape.attr("rx")) || 0;
    const ry = parseFloat(shape.attr("ry")) || 0;
    const angle = Math.atan2(uy, ux);
    localEdgePoint = [
      centerX + rx * Math.cos(angle),
      centerY + ry * Math.sin(angle),
    ];
  } else {
    // For rectangles/groups, find intersection with bbox edges
    const left = bbox.x;
    const right = bbox.x + bbox.width;
    const top = bbox.y;
    const bottom = bbox.y + bbox.height;

    const intersections = [];

    if (ux !== 0) {
      const t = (left - centerX) / ux;
      const y = centerY + t * uy;
      if (y >= top && y <= bottom && t > 0) {
        intersections.push([left, y, t]);
      }
    }

    if (ux !== 0) {
      const t = (right - centerX) / ux;
      const y = centerY + t * uy;
      if (y >= top && y <= bottom && t > 0) {
        intersections.push([right, y, t]);
      }
    }

    if (uy !== 0) {
      const t = (top - centerY) / uy;
      const x = centerX + t * ux;
      if (x >= left && x <= right && t > 0) {
        intersections.push([x, top, t]);
      }
    }

    if (uy !== 0) {
      const t = (bottom - centerY) / uy;
      const x = centerX + t * ux;
      if (x >= left && x <= right && t > 0) {
        intersections.push([x, bottom, t]);
      }
    }

    if (intersections.length > 0) {
      intersections.sort(function (a, b) {
        return a[2] - b[2];
      });
      localEdgePoint = [intersections[0][0], intersections[0][1]];
    } else {
      localEdgePoint = [centerX, centerY];
    }
  }

  // Transform edge point back to SVG user coordinates
  const [worldEdgeX, worldEdgeY] = localToSvgCoords(shape, localEdgePoint[0], localEdgePoint[1]);

  if (isNaN(worldEdgeX) || isNaN(worldEdgeY) || !isFinite(worldEdgeX) || !isFinite(worldEdgeY)) {
    return localToSvgCoords(shape, centerX, centerY);
  }

  return [worldEdgeX, worldEdgeY];
}

/**
 * computeConnectorCoordinates
 * Computes the connector path between source and target elements.
 * All coordinates are in SVG user coordinate space.
 */
/**
 * Compute a fixed anchor point on a shape from a normalized local anchor
 * {x,y} in 0..1 (0,0 = top-left, 0.5,0.5 = center, 1,1 = bottom-right of the
 * shape's local bbox), transformed to SVG user coords through the shape's
 * matrix. Because the transform includes rotation, an edge-pinned endpoint
 * rotates WITH the node (edge-pin mode).
 */
function anchorPointOnShape(shape, anchor) {
  const bbox = shape.bbox();
  const lx = bbox.x + (anchor.x != null ? anchor.x : 0.5) * bbox.width;
  const ly = bbox.y + (anchor.y != null ? anchor.y : 0.5) * bbox.height;
  const [wx, wy] = localToSvgCoords(shape, lx, ly);
  if (isNaN(wx) || isNaN(wy) || !isFinite(wx) || !isFinite(wy)) {
    return getElementCenter(shape);
  }
  return [wx, wy];
}

function computeConnectorCoordinates(con) {
  const temp = {};

  if (!con.source || !con.target) {
    return [
      ["M", 0, 0],
      ["L", 50, 50],
    ];
  }

  // Get centers in SVG user coordinates
  const sourceCenter = getElementCenter(con.source);
  const targetCenter = getElementCenter(con.target);

  // Calculate attachment points
  // Edge-pin mode: a fixed normalized local anchor that rotates with the node.
  if (con.sourceAnchor) {
    temp.point1 = anchorPointOnShape(con.source, con.sourceAnchor);
  } else if (con.sourceAttach === "center") {
    temp.point1 = sourceCenter;
  } else {
    temp.point1 = getClosestPointOnEdge(con.source, targetCenter);

    // Offset for source arrow marker
    if (con.markerSourceType && con.markerSourceType !== "null") {
      const sourceArrowSize = Math.max(12, con.strokeWidth * 3 + 6);
      const arrowLength = sourceArrowSize * 0.8;

      const dx = temp.point1[0] - sourceCenter[0];
      const dy = temp.point1[1] - sourceCenter[1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        temp.point1[0] += (dx / distance) * arrowLength;
        temp.point1[1] += (dy / distance) * arrowLength;
      }
    }
  }

  if (con.targetAnchor) {
    temp.point2 = anchorPointOnShape(con.target, con.targetAnchor);
  } else if (con.targetAttach === "center") {
    temp.point2 = targetCenter;
  } else {
    temp.point2 = getClosestPointOnEdge(con.target, sourceCenter);

    // Offset for target arrow marker
    if (con.markerTargetType && con.markerTargetType !== "null") {
      const targetArrowSize = Math.max(12, con.strokeWidth * 3 + 6);
      const arrowLength = targetArrowSize * 0.8;

      const dx = temp.point2[0] - targetCenter[0];
      const dy = temp.point2[1] - targetCenter[1];
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        temp.point2[0] += (dx / distance) * arrowLength;
        temp.point2[1] += (dy / distance) * arrowLength;
      }
    }
  }

  const pp1 = temp.point1;
  const pp2 = temp.point2;

  let points;

  if (con.type === "curved") {
    const dx = pp2[0] - pp1[0];
    const dy = pp2[1] - pp1[1];
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < 1) {
      return [["M", pp1[0], pp1[1]], ["L", pp2[0], pp2[1]]];
    }

    // Perpendicular-port curve: leave the source and ENTER the target along the
    // line through each node's CENTER, so each endpoint meets the edge at ~90°
    // and the arrowhead points at the node's center. Adapts as nodes move and
    // works for both fixed (absolute anchor) and auto-flow (relative) endpoints.
    const norm = (vx, vy, fx, fy) => {
      const m = Math.sqrt(vx * vx + vy * vy);
      if (m > 0.0001) return [vx / m, vy / m];
      const fm = Math.sqrt(fx * fx + fy * fy) || 1;
      return [fx / fm, fy / fm];
    };
    // Outward (edge-normal) direction at each port = center → port.
    const sDir = norm(pp1[0] - sourceCenter[0], pp1[1] - sourceCenter[1], dx, dy);
    const tDir = norm(pp2[0] - targetCenter[0], pp2[1] - targetCenter[1], -dx, -dy);
    // Handle length: responds to the curve slider (curveRadius) but keeps a
    // minimum so the perpendicular approach is always visible, and is capped at
    // half the span so short links don't loop back on themselves.
    const handle = Math.max(30, Math.min(con.curveRadius * 2.5, distance * 0.5));

    const cp1 = [pp1[0] + sDir[0] * handle, pp1[1] + sDir[1] * handle];
    const cp2 = [pp2[0] + tDir[0] * handle, pp2[1] + tDir[1] * handle];

    points = [
      ["M", pp1[0], pp1[1]],
      ["C", cp1[0], cp1[1], cp2[0], cp2[1], pp2[0], pp2[1]],
    ];
  } else if (con.type === "orthogonal") {
    const dx = pp2[0] - pp1[0];
    const dy = pp2[1] - pp1[1];

    const sourceIsLeft = pp1[0] < sourceCenter[0];
    const sourceIsTop = pp1[1] < sourceCenter[1];
    const targetIsLeft = pp2[0] < targetCenter[0];
    const targetIsTop = pp2[1] < targetCenter[1];

    let midX, midY;

    if (Math.abs(dx) > Math.abs(dy)) {
      if ((sourceIsLeft && targetIsLeft) || (!sourceIsLeft && !targetIsLeft)) {
        const offset = Math.max(con.curveRadius, Math.abs(dy) / 2);
        midY = pp1[1] + (dy > 0 ? -offset : offset);
        points = [
          ["M", pp1[0], pp1[1]],
          ["L", pp1[0], midY],
          ["L", pp2[0], midY],
          ["L", pp2[0], pp2[1]],
        ];
      } else {
        midX = pp1[0] + dx / 2;
        points = [
          ["M", pp1[0], pp1[1]],
          ["L", midX, pp1[1]],
          ["L", midX, pp2[1]],
          ["L", pp2[0], pp2[1]],
        ];
      }
    } else {
      if ((sourceIsTop && targetIsTop) || (!sourceIsTop && !targetIsTop)) {
        const offset = Math.max(con.curveRadius, Math.abs(dx) / 2);
        midX = pp1[0] + (dx > 0 ? -offset : offset);
        points = [
          ["M", pp1[0], pp1[1]],
          ["L", midX, pp1[1]],
          ["L", midX, pp2[1]],
          ["L", pp2[0], pp2[1]],
        ];
      } else {
        midY = pp1[1] + dy / 2;
        points = [
          ["M", pp1[0], pp1[1]],
          ["L", pp1[0], midY],
          ["L", pp2[0], midY],
          ["L", pp2[0], pp2[1]],
        ];
      }
    }
  } else {
    // Straight line (default)
    points = [
      ["M", pp1[0], pp1[1]],
      ["L", pp2[0], pp2[1]],
    ];
  }

  return points;
}

export {
  calculateAngle,
  getTangentAngle,
  getElementCenter,
  getClosestPointOnEdge,
  computeConnectorCoordinates,
  svgCoordsToLocal,
};
