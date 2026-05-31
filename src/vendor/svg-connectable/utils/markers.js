/**
 * Marker utilities for SVG Connectable
 * Handles marker creation, management, and styling
 */

import { calculateAngle, getTangentAngle } from "./geometry.js";

/**
 * createMarker
 * Creates a marker with proper orientation and proportional sizing
 */
function createMarker(type, angle, isSource, strokeWidth, markers, color) {
  if (!type || type === "null") return null;

  // Scale marker size based on stroke width with better minimum sizing
  const baseSize = 12; // Increased base marker size for thin lines
  const markerSize = Math.max(baseSize, strokeWidth * 3 + 6); // Better scaling formula
  const arrowWidth = markerSize;
  const arrowHeight = markerSize * 0.8; // Slightly narrower for better proportions

  const markerId =
    (isSource ? "source-" : "target-") +
    "triangle-" +
    Math.random().toString(16).substr(2, 8);
  const markerEl = markers.defs().marker(arrowWidth, arrowHeight);

  markerEl.attr({
    id: markerId,
    viewBox: "0 0 " + arrowWidth + " " + arrowHeight,
    refX: isSource ? arrowWidth : "0", // Source arrow tip at right, target arrow tip at left
    refY: arrowHeight / 2, // Center vertically
    markerUnits: "strokeWidth",
    markerWidth: arrowWidth / 2, // Scale down the rendered size
    markerHeight: arrowHeight / 2,
    orient: "auto",
  });

  // Create arrow path with correct pointing direction
  const path = markerEl.path();
  const halfHeight = arrowHeight / 2;

  if (isSource) {
    // Source arrow points away from the line (left-pointing)
    path.attr({
      d:
        "M 0 " +
        halfHeight +
        " L " +
        arrowWidth +
        " 0 L " +
        arrowWidth +
        " " +
        arrowHeight +
        " z",
    });
  } else {
    // Target arrow points toward the target (right-pointing)
    path.attr({
      d:
        "M 0 0 L 0 " +
        arrowHeight +
        " L " +
        arrowWidth +
        " " +
        halfHeight +
        " z",
    });
  }

  path.fill(color);

  return {
    element: markerEl,
    id: markerId,
    size: markerSize,
  };
}

/**
 * setMarker
 * The function that sets the markers
 *
 * @name setMarker
 * @function
 * @param {Connectable} con The connectable instance
 * @param {String} sourceMarker 'default' / 'null' for source end
 * @param {String} targetMarker 'default' / 'null' for target end
 * @param {SVGElement} markersContainer Optional parent for marker elements
 * @return {Connectable} The connectable instance.
 */
function setMarker(con, sourceMarker, targetMarker, markersContainer) {
  if (markersContainer) con.markers = markersContainer;

  // Clean up existing markers
  if (con.markerSource) {
    con.markerSource.element.remove();
    con.connector.attr("marker-start", null);
  }
  if (con.markerTarget) {
    con.markerTarget.element.remove();
    con.connector.attr("marker-end", null);
  }

  // Set source marker
  if (sourceMarker && sourceMarker !== "null") {
    con.markerSource = createMarker(
      sourceMarker,
      0,
      true,
      con.strokeWidth,
      con.markers || markersContainer,
      con.color
    );
    con.connector.attr("marker-start", "url(#" + con.markerSource.id + ")");
  } else {
    con.markerSource = null;
  }

  // Set target marker
  if (targetMarker && targetMarker !== "null") {
    con.markerTarget = createMarker(
      targetMarker,
      0,
      false,
      con.strokeWidth,
      con.markers || markersContainer,
      con.color
    );
    con.connector.attr("marker-end", "url(#" + con.markerTarget.id + ")");
  } else {
    con.markerTarget = null;
  }

  return con;
}

/**
 * setMarkerSettings
 * Updates marker settings for source and target
 *
 * @name setMarkerSettings
 * @function
 * @param {Connectable} con The connectable instance
 * @param {String} sourceMarker Marker type for source end
 * @param {String} targetMarker Marker type for target end
 * @return {Connectable} The connectable instance.
 */
function setMarkerSettings(con, sourceMarker, targetMarker) {
  con.markerSourceType = sourceMarker || "null";
  con.markerTargetType = targetMarker || "null";
  setMarker(con, con.markerSourceType, con.markerTargetType);
  return con;
}

/**
 * setStrokeWidth
 * Updates the stroke width and recreates markers with proper scaling
 *
 * @name setStrokeWidth
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Number} width The new stroke width
 * @return {Connectable} The connectable instance.
 */
function setStrokeWidth(con, width) {
  con.strokeWidth = width || 2;
  con.connector.attr("stroke-width", con.strokeWidth);
  // Recreate markers with new scaling
  setMarker(con, con.markerSourceType, con.markerTargetType);
  return con;
}

/**
 * setConnectorColor
 * Sets the connector color and updates markers
 *
 * @name setConnectorColor
 * @function
 * @param {Connectable} con The connectable instance
 * @param {String} color The new color.
 * @return {undefined}
 */
function setConnectorColor(con, color) {
  con.color = color;
  con.connector.stroke(color).attr("stroke-width", con.strokeWidth);
  if (con.markerSource) {
    con.markerSource.element.children().forEach(function (child) {
      if (child.type === "path") child.fill(color);
    });
  }
  if (con.markerTarget) {
    con.markerTarget.element.children().forEach(function (child) {
      if (child.type === "path") child.fill(color);
    });
  }
}

export {
  createMarker,
  setMarker,
  setMarkerSettings,
  setStrokeWidth,
  setConnectorColor,
};
