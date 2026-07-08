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
/**
 * For vector (path) shapes, attach the connector to the ACTUAL path outline
 * rather than the bounding box, so arrows touch the real shape (star arms, etc.).
 * Samples the tagged shape <path> and picks the outline point best aligned with
 * the ray from the shape centre toward `targetPoint`. Returns null for shapes
 * without a tagged path (native rect/circle/ellipse keep their exact math).
 */
function closestPointOnPathOutline(shape, targetPoint) {
  try {
    const node = shape && shape.node;
    let pathEl =
      node && node.querySelector && node.querySelector("path[data-shape-path]");
    // svgContent nodes (custom SVG artwork — e.g. a flower/cloud shape) have no
    // tagged shape path, so the connector was falling back to the bounding BOX and
    // the arrow floated in the empty corner instead of touching the artwork. Use
    // the largest <path> inside the node's nested <svg> as the outline so the arrow
    // attaches flush to the shape. (Native rect/circle have no nested path → still
    // null → their exact edge math is used, unchanged.)
    if (!pathEl && node && node.querySelectorAll) {
      let bestArea = 0;
      node.querySelectorAll("svg path").forEach((cand) => {
        if (typeof cand.getTotalLength !== "function") return;
        try {
          const b = cand.getBBox();
          const area = b.width * b.height;
          if (area > bestArea) {
            bestArea = area;
            pathEl = cand;
          }
        } catch (e) {
          /* noop */
        }
      });
    }
    if (!pathEl || typeof pathEl.getTotalLength !== "function") return null;
    const total = pathEl.getTotalLength();
    if (!total || !isFinite(total)) return null;

    // The path lives in a nested <svg> with its own viewBox. Convert its local
    // points to the connector's coordinate space via screen CTMs: path-local →
    // screen → root SVG user space (the space getElementCenter/points use).
    // ownerSVGElement is the NEAREST ancestor <svg>. A shape outline lives in a
    // nested <svg> (its own viewBox), so ownerSVGElement is that nested svg —
    // whose screen CTM equals the path's, making the local→user transform a no-op
    // (outline points come back in viewBox coords and get rejected as "too far").
    // Walk up to the OUTERMOST svg, which is the connector's coordinate space.
    let rootSvg = pathEl.ownerSVGElement;
    while (rootSvg && rootSvg.ownerSVGElement) rootSvg = rootSvg.ownerSVGElement;
    const pathCTM = pathEl.getScreenCTM && pathEl.getScreenCTM();
    const rootScreenCTM = rootSvg && rootSvg.getScreenCTM && rootSvg.getScreenCTM();
    if (!rootSvg || !pathCTM || !rootScreenCTM) return null;
    const rootInv = rootScreenCTM.inverse();
    const sp = rootSvg.createSVGPoint();
    const toUser = (lx, ly) => {
      sp.x = lx;
      sp.y = ly;
      const u = sp.matrixTransform(pathCTM).matrixTransform(rootInv);
      return [u.x, u.y];
    };

    const [cx, cy] = getElementCenter(shape);
    const dirX = targetPoint[0] - cx;
    const dirY = targetPoint[1] - cy;
    const dm = Math.sqrt(dirX * dirX + dirY * dirY) || 1;
    const ux = dirX / dm;
    const uy = dirY / dm;

    let best = null;
    let bestScore = -Infinity;
    // getPointAtLength is an expensive DOM call, and this runs on every connector
    // update (every frame of a node drag). The path's LOCAL outline is constant —
    // only its transform changes — so sample the local points ONCE and cache them
    // on the element, then just matrix-transform the cached points per frame. This
    // is what made dragging nodes with complex custom-shape connectors slow.
    const N = 96;
    let samples = pathEl.__outlineSamples;
    if (!samples || pathEl.__outlineLen !== total) {
      samples = new Array(N);
      for (let i = 0; i < N; i++) {
        const lp = pathEl.getPointAtLength((i / N) * total);
        samples[i] = [lp.x, lp.y];
      }
      pathEl.__outlineSamples = samples;
      pathEl.__outlineLen = total;
    }
    for (let i = 0; i < samples.length; i++) {
      const [wx, wy] = toUser(samples[i][0], samples[i][1]);
      if (!isFinite(wx) || !isFinite(wy)) continue;
      const px = wx - cx;
      const py = wy - cy;
      const proj = px * ux + py * uy; // toward the target direction
      const perp = Math.abs(px * uy - py * ux); // offset from the ray
      const score = proj - perp * 1.5; // outermost point on the ray
      if (score > bestScore) {
        bestScore = score;
        best = [wx, wy];
      }
    }
    return best;
  } catch (e) {
    return null;
  }
}

function getClosestPointOnEdge(shape, targetPoint) {
  // Vector shapes: attach to the real outline when we can transform it reliably.
  // (Guarded — nested-SVG viewBox paths need the correct coordinate transform;
  // falls back to the bbox intersection otherwise so the connector never breaks.)
  const outline = closestPointOnPathOutline(shape, targetPoint);
  if (outline && isFinite(outline[0]) && isFinite(outline[1])) {
    // Sanity: the outline point must be within a reasonable distance of the
    // shape's bbox (guards against a bad coordinate transform sending it away).
    const bb = shape.bbox();
    const [ccx, ccy] = localToSvgCoords(shape, bb.cx, bb.cy);
    const span = Math.max(bb.width, bb.height, 1) * 3;
    if (Math.hypot(outline[0] - ccx, outline[1] - ccy) <= span) {
      return outline;
    }
  }

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

/**
 * edgeNormalAt
 * Outward unit normal of the node EDGE that `portSvg` sits on, in SVG coords.
 * For a rectangle this is axis-aligned (perpendicular to the specific edge), which
 * is what makes an arrow tip meet the edge at 90° — unlike the radial center→port
 * direction, which only equals the normal at edge midpoints. Rotation is honored
 * by mapping the local normal through two points. Returns null on failure so the
 * caller can fall back to the radial direction (correct for circles).
 */
function edgeNormalAt(shape, portSvg) {
  try {
    const bb = shape.bbox();
    if (!bb || !bb.width || !bb.height) return null;
    const [lx, ly] = svgCoordsToLocal(shape, portSvg[0], portSvg[1]);
    const nx = (lx - bb.x) / bb.width;
    const ny = (ly - bb.y) / bb.height;
    const dl = nx;
    const dr = 1 - nx;
    const dt = ny;
    const db = 1 - ny;
    const m = Math.min(dl, dr, dt, db);
    let lnx = 0;
    let lny = 0;
    if (m === dl) lnx = -1;
    else if (m === dr) lnx = 1;
    else if (m === dt) lny = -1;
    else lny = 1;
    // Map the local normal DIRECTION to SVG coords via center and center+normal.
    const p0 = localToSvgCoords(shape, bb.cx, bb.cy);
    const p1 = localToSvgCoords(shape, bb.cx + lnx, bb.cy + lny);
    const vx = p1[0] - p0[0];
    const vy = p1[1] - p0[1];
    const mag = Math.hypot(vx, vy);
    if (!(mag > 0.0001)) return null;
    return [vx / mag, vy / mag];
  } catch (e) {
    return null;
  }
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
    // Endpoint sits exactly on the node edge. The arrow marker is anchored at
    // its TIP (refX), so the point touches the edge — no outward offset needed
    // (an offset here would leave a gap between the arrow tip and the node).
    temp.point1 = getClosestPointOnEdge(con.source, targetCenter);
  }

  if (con.targetAnchor) {
    temp.point2 = anchorPointOnShape(con.target, con.targetAnchor);
  } else if (con.targetAttach === "center") {
    temp.point2 = targetCenter;
  } else {
    // Endpoint sits exactly on the node edge (arrow is tip-anchored — see above).
    temp.point2 = getClosestPointOnEdge(con.target, sourceCenter);
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
    // Direction the curve enters/leaves each port:
    //  - RELATIVE endpoint (auto-flow, no anchor): aim along the line through the
    //    node CENTER so the arrowhead points at the center (user preference #7).
    //  - PINNED endpoint (absolute anchor, dropped at a spot): meet the edge at
    //    90° at the pin point via the axis-aligned edge normal — so a pinned
    //    arrow stays perpendicular to the edge where it was dropped.
    const sDir = con.sourceAnchor
      ? edgeNormalAt(con.source, pp1) ||
        norm(pp1[0] - sourceCenter[0], pp1[1] - sourceCenter[1], dx, dy)
      : norm(pp1[0] - sourceCenter[0], pp1[1] - sourceCenter[1], dx, dy);
    const tDir = con.targetAnchor
      ? edgeNormalAt(con.target, pp2) ||
        norm(pp2[0] - targetCenter[0], pp2[1] - targetCenter[1], -dx, -dy)
      : norm(pp2[0] - targetCenter[0], pp2[1] - targetCenter[1], -dx, -dy);
    // Handle length: the "Line Curve" slider (lineCurviness, 0..1) scales how far
    // the control points bow out, as a fraction of the span — so the slider is
    // always responsive. A small floor keeps the perpendicular approach visible.
    const curviness =
      typeof con.lineCurviness === "number" ? con.lineCurviness : 0.3;
    const handle = Math.max(20, distance * (0.12 + curviness * 0.55));

    const cp1 = [pp1[0] + sDir[0] * handle, pp1[1] + sDir[1] * handle];
    const cp2 = [pp2[0] + tDir[0] * handle, pp2[1] + tDir[1] * handle];

    if (con.lineCurveType === "quadratic") {
      // Quadratic bezier: a single control point (the average of the two cubic
      // control points) gives a similar bow with one handle. Without this the
      // Cubic/Quadratic toggle changed the model but rendered the same cubic curve.
      const qcp = [(cp1[0] + cp2[0]) / 2, (cp1[1] + cp2[1]) / 2];
      points = [
        ["M", pp1[0], pp1[1]],
        ["Q", qcp[0], qcp[1], pp2[0], pp2[1]],
      ];
    } else {
      points = [
        ["M", pp1[0], pp1[1]],
        ["C", cp1[0], cp1[1], cp2[0], cp2[1], pp2[0], pp2[1]],
      ];
    }
  } else if (con.type === "orthogonal") {
    const dx = pp2[0] - pp1[0];
    const dy = pp2[1] - pp1[1];

    const sourceIsLeft = pp1[0] < sourceCenter[0];
    const sourceIsTop = pp1[1] < sourceCenter[1];
    const targetIsLeft = pp2[0] < targetCenter[0];
    const targetIsTop = pp2[1] < targetCenter[1];

    let midX, midY;

    // Miro-clean routing: when the two anchors are nearly co-linear (small
    // perpendicular offset), draw a straight run instead of a tiny ~22px jog.
    // Source/target anchors carry a small inherent x/y offset even for
    // center-aligned nodes, which otherwise reads as an ugly step. Snapping both
    // ends to the shared mid-coordinate keeps each point on its node edge.
    const ORTHO_SNAP = 32;
    if (Math.abs(dx) <= ORTHO_SNAP && Math.abs(dy) > ORTHO_SNAP) {
      const cx = (pp1[0] + pp2[0]) / 2;
      points = [
        ["M", cx, pp1[1]],
        ["L", cx, pp2[1]],
      ];
    } else if (Math.abs(dy) <= ORTHO_SNAP && Math.abs(dx) > ORTHO_SNAP) {
      const cy = (pp1[1] + pp2[1]) / 2;
      points = [
        ["M", pp1[0], cy],
        ["L", pp2[0], cy],
      ];
    } else if (Math.abs(dx) > Math.abs(dy)) {
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

  // Pull the drawn line back to the arrowhead's BASE at the arrowed (target) end.
  // The stroke is much thinner than the arrowhead's base but WIDER than its narrow
  // tip, so a line drawn all the way to the tip pokes out the arrowhead's sides
  // near the point (looks like the line doesn't conform to the arrow). Paired with
  // the base-anchored target marker (refX=0), the arrowhead still extends forward
  // so its TIP lands exactly on the node edge (pp2) — endpoint accuracy (#4) is
  // preserved. Guarded to connectors long enough that the trim can't invert.
  const aw = con.markerTarget && con.markerTarget.size;
  if (aw && points && points.length >= 2) {
    const span = Math.hypot(pp2[0] - pp1[0], pp2[1] - pp1[1]);
    if (span > aw * 1.5) {
      const last = points[points.length - 1];
      const ex = last[last.length - 2];
      const ey = last[last.length - 1];
      let rx, ry;
      if (last[0] === "C") {
        rx = last[3]; // cp2
        ry = last[4];
      } else {
        const prev = points[points.length - 2];
        rx = prev[prev.length - 2];
        ry = prev[prev.length - 1];
      }
      let tx = ex - rx;
      let ty = ey - ry;
      const m = Math.hypot(tx, ty);
      if (m > 0.001) {
        tx /= m;
        ty /= m;
        last[last.length - 2] = ex - tx * aw;
        last[last.length - 1] = ey - ty * aw;
        // Shift the trailing control point too so the approach tangent (and thus
        // the arrow's aim) is unchanged.
        if (last[0] === "C") {
          last[3] -= tx * aw;
          last[4] -= ty * aw;
        }
      }
    }
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
