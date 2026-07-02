/*!
 * SVG.js Connectable Plugin v2.2.0
 * =================================
 *
 * A JavaScript library for connecting SVG things - compatible with SVG.js 3.x
 *
 * svg.connectable.js 2.2.0
 * Licensed under the MIT license.
 * Copyright (c) 2014-15 jillix
 * Copyright (c) 2015-17 Loredana Cirstea
 * Copyright (c) 2015 Christian Tzurcanu - Algorithm for creating connector curves, connector paths.
 * Copyright (c) 2025 - Updated for SVG.js 3.x compatibility with optional interactive features
 *
 * */

import { Element, SVG, extend } from "@svgdotjs/svg.js";

// Import utility modules
import { computeConnectorCoordinates } from "./utils/geometry.js";
import {
  setMarker,
  setMarkerSettings,
  setStrokeWidth,
  setConnectorColor,
} from "./utils/markers.js";
import { updateHandles } from "./utils/handles.js";
import {
  selectConnector,
  deselectConnector,
  toggleSelection,
  setupClickHandlers,
  setConnectorAttachment,
  setHandleVisibility,
  getHandles,
  setClickAreaWidth,
  setConnector,
  setType,
  setDebugMode,
  toggleDebugMode,
  makeSelectable,
  makeDraggable,
  makeResizable,
  makeInteractive,
} from "./utils/interactions.js";

let container = null;
let markers = null;
// Create a single shared reference object for all connectors
const globalActiveConnectorRef = { current: null };

/**
 * Helper function to check if a plugin method is available
 */
function hasMethod(element, methodName) {
  return element && typeof element[methodName] === "function";
}

/**
 * connectable
 * Connects two elements with interactive handles for drag-and-drop reconnection.
 *
 * @name connectable
 * @function
 * @param {Object} options An object containing any of the following fields:
 *
 *  - `container` (SVGElement): The connector elements container. Defaults to source parent.
 *  - `markers` (SVGElement): The marker elements container. Defaults to source parent.
 *  - `sourceAttach` (String): Connector attachment for source element: 'center' / 'perifery'. Defaults to 'perifery'
 *  - `targetAttach` (String): Connector attachment for target element: 'center' / 'perifery'. Defaults to 'perifery'
 *  - `type` (String): Connector type: 'straight', 'curved', or 'orthogonal'. Defaults to 'straight'
 *  - `marker` (String): Can be: an SVGElement / 'null' / 'default'. Defaults to 'null'
 *  - `markerSource` (String): Arrow marker for source end: 'null' / 'default'. Defaults to 'null'
 *  - `markerTarget` (String): Arrow marker for target end: 'null' / 'default'. Defaults to 'default'
 *  - `color` (String): Connector color. Defaults to '#000000'.
 *  - `strokeWidth` (Number): Connector stroke width. Defaults to 2.
 *  - `curveRadius` (Number): Radius for curved connections. Defaults to 20.
 *  - `showHandles` (Boolean): Whether to show draggable handles at connector endpoints. Defaults to false (click to show).
 *  - `handleRadius` (Number): Radius of connector handles. Defaults to 6.
 *  - `handleStrokeWidth` (Number): Stroke width of handles. Defaults to 2.
 *  - `handleStroke` (String): Handle stroke color. Defaults to '#007cff'.
 *  - `handleFill` (String): Handle fill color. Defaults to 'none'.
 *  - `clickAreaWidth` (Number): Width of invisible click area for easier selection. Defaults to max(12, strokeWidth * 3).
 *  - `debugMode` (Boolean): Whether to visualize hit areas for debugging. Defaults to false.
 *
 * @param {SVGElement} elmTarget The target SVG element.
 * @return {Object} The connectable object containing:
 *
 *  - `source` (SVGElement): The source element.
 *  - `target` (SVGElement): The target element.
 *  - `connector` (SVGElement): The connector element (line / path / polygon).
 *  - `markerSource` (SVGElement): The source marker element.
 *  - `markerTarget` (SVGElement): The target marker element.
 *  - `sourceHandle` (Object): The source endpoint handle with drag-and-drop functionality.
 *  - `targetHandle` (Object): The target endpoint handle with drag-and-drop functionality.
 *  - `hitArea` (SVGElement): The invisible click area element.
 *  - [`computeConnectorCoordinates` (Function)](#computeconnectorcoordinatescon)
 *  - [`update` (Function)](#update)
 *  - [`updateHandles` (Function)](#updatehandles)
 *  - [`setConnectorColor` (Function)](#setconnectorcolorcolor-c)
 *  - [`setMarker` (Function)](#setmarker)
 *  - [`setConnectorAttachment` (Function)](#setconnectorattachment)
 *  - [`setHandleVisibility` (Function)](#sethandlevisibility)
 *  - [`getHandles` (Function)](#gethandles)
 *  - [`setClickAreaWidth` (Function)](#setclickareawidth)
 *  - [`selectConnector` (Function)](#selectconnector)
 *  - [`deselectConnector` (Function)](#deselectconnector)
 *  - [`toggleSelection` (Function)](#toggleselection)
 *  - [`setConnector` (Function)](#setconnector)
 *  - [`setType` (Function)](#settype)
 *  - [`setDebugMode` (Function)](#setdebugmode)
 *  - [`toggleDebugMode` (Function)](#toggledebugmode)
 *  - [`makeSelectable` (Function)](#makeselectableoptions) - *Optional: requires @svgdotjs/svg.select.js*
 *  - [`makeDraggable` (Function)](#makedraggableoptions) - *Optional: requires @svgdotjs/svg.draggable.js*
 *  - [`makeInteractive` (Function)](#makeinteractiveselectoptions-dragoptions) - *Optional: requires interactive plugins*
 */

function connectable(options, elmTarget) {
  const con = {};

  if (elmTarget === undefined) {
    elmTarget = options;
    options = {};
  }

  container = options.container || this.parent() || container;
  const elmSource = this;
  markers = options.markers || this.parent() || markers;

  // Store container reference for utility functions
  con.container = container;

  // Append the SVG elements
  con.source = elmSource; //'center', 'perifery'
  con.target = elmTarget;
  con.type = options.type || "straight"; //'straight', 'curved', 'orthogonal'

  // Initialize core properties early (before creating elements)
  con.strokeWidth = options.strokeWidth || 2;
  con.color = options.color || "#000000";

  // Click area configuration - calculate this early
  con.clickAreaWidth =
    options.clickAreaWidth || Math.max(12, con.strokeWidth * 3); // Minimum 12px click area

  // Debug mode for visualizing hit areas
  con.debugMode = options.debugMode || false;

  if (options.connector) {
    const target = SVG.find(
      "#" + options.connector.node.getAttribute("href").slice(1)
    )[0];
    if (target && target.type == "path") {
      con.connector = options.connector;
      const patharr = target.array();
      if (
        !(patharr[1] && patharr[1][0] == "M") ||
        !(patharr[2] && patharr[2][0] == "M")
      ) {
        const box = target.bbox();
        patharr.splice(
          0,
          0,
          ["M", box.x + box.width / 2, box.y],
          ["M", box.x + box.width / 2, box.y + box.height]
        );
        target.plot(patharr);
      }
      con.connector.target = target;
    }
  }

  if (!con.connector) {
    con.connector = container
      .path()
      .attr("connectortype", "default")
      .fill("none")
      .stroke(con.color)
      .attr("stroke-width", con.strokeWidth);
  }

  // Create invisible hit area for easier clicking (now with correct width)
  con.hitArea = container.path().attr({
    connectortype: "hitarea",
    fill: "none",
    stroke: con.debugMode ? "#ff0000" : "#000000",
    "stroke-width": con.clickAreaWidth,
    "stroke-opacity": con.debugMode ? 0.5 : 0.01, // Visible in debug mode, nearly invisible otherwise
    "pointer-events": "stroke",
  });

  // Set cursor styles using setAttribute for broader compatibility
  try {
    con.connector.node.style.cursor = "pointer";
    con.hitArea.node.style.cursor = "pointer";
  } catch (e) {
    // Fallback: use setAttribute
    con.connector.node.setAttribute("style", "cursor: pointer");
    con.hitArea.node.setAttribute("style", "cursor: pointer");
  }

  // Ensure hit area is behind the visible connector
  con.hitArea.back();

  con.sourceAttach = options.sourceAttach || "perifery";
  con.targetAttach = options.targetAttach || "perifery";
  // Edge-pin mode: normalized local anchor {x,y} in 0..1 on the source/target
  // node. When set, the endpoint is pinned to that point and rotates with the
  // node (instead of auto-flow to the nearest edge). null = auto-flow.
  con.sourceAnchor = options.sourceAnchor || null;
  con.targetAnchor = options.targetAnchor || null;
  con.curveRadius = options.curveRadius || 20;

  // Support for separate source and target markers
  con.markerSourceType = options.markerSource || "null";
  con.markerTargetType = options.markerTarget || options.marker || "default";

  // Handle configuration
  con.showHandles = options.showHandles || false; // Default to false - only show when clicked
  con.handleRadius = options.handleRadius || 6;
  con.handleStrokeWidth = options.handleStrokeWidth || 2;
  con.handleStroke = options.handleStroke || "#007cff";
  con.handleFill = options.handleFill || "none";
  con.isSelected = false; // Track selection state

  // Add computeConnectorCoordinates method
  con.computeConnectorCoordinates = function (conInstance) {
    return computeConnectorCoordinates(conInstance || con);
  };

  elmSource.cons = elmSource.cons || [];
  elmSource.cons.push(con);

  // Also track the connector on the target element
  elmTarget.targetCons = elmTarget.targetCons || [];
  elmTarget.targetCons.push(con);

  /**
   * update
   * Updates the connector's path and handles
   *
   * @name update
   * @function
   * @return {undefined}
   */
  con.update = function () {
    if (con.connector.attr("connectortype") == "default") {
      const pathData = con.computeConnectorCoordinates(con);

      // Validate path data before plotting
      let isValid = true;
      for (let i = 0; i < pathData.length; i++) {
        for (let j = 1; j < pathData[i].length; j++) {
          if (isNaN(pathData[i][j]) || !isFinite(pathData[i][j])) {
            console.error(
              "Invalid coordinate in path data:",
              pathData[i][j],
              "at",
              [i, j]
            );
            isValid = false;
          }
        }
      }

      if (isValid) {
        con.connector.plot(pathData);
        con.hitArea.plot(pathData); // Update hit area with same path
        updateHandles(con, pathData);
      } else {
        console.error("Skipping plot due to invalid path data");
      }
    }
  };

  // Initialize markers using utility function
  setMarker(con, con.markerSourceType, con.markerTargetType, markers);

  // Initialize handles (will be positioned in first update)
  con.sourceHandle = null;
  con.targetHandle = null;

  // Attach methods from utility modules
  con.setMarker = function (sourceMarker, targetMarker, markersContainer) {
    return setMarker(con, sourceMarker, targetMarker, markersContainer);
  };

  con.setMarkerSettings = function (sourceMarker, targetMarker) {
    return setMarkerSettings(con, sourceMarker, targetMarker);
  };

  con.setStrokeWidth = function (width) {
    return setStrokeWidth(con, width);
  };

  con.setConnectorColor = function (color) {
    setConnectorColor(con, color);
    return con;
  };

  // Edge-pin API: pin (or unpin with null) an endpoint to a normalized local
  // anchor {x,y} in 0..1 on the source/target node; re-solves immediately.
  con.setAttachmentAnchor = function (which, anchor) {
    if (which === "source") con.sourceAnchor = anchor || null;
    else if (which === "target") con.targetAnchor = anchor || null;
    con.update();
    return con;
  };

  con.updateHandles = function (pathData) {
    updateHandles(con, pathData);
  };

  con.selectConnector = function () {
    selectConnector(con, globalActiveConnectorRef);
  };

  con.deselectConnector = function () {
    deselectConnector(con);
    if (globalActiveConnectorRef.current === con) {
      globalActiveConnectorRef.current = null;
    }
  };

  con.toggleSelection = function () {
    toggleSelection(con, globalActiveConnectorRef);
  };

  con.setConnectorAttachment = function (element, type) {
    setConnectorAttachment(con, element, type);
  };

  con.setHandleVisibility = function (visible) {
    return setHandleVisibility(con, visible);
  };

  con.getHandles = function () {
    return getHandles(con);
  };

  con.setClickAreaWidth = function (width) {
    return setClickAreaWidth(con, width);
  };

  con.setConnector = function (connector) {
    setConnector(con, connector);
  };

  con.setType = function (type) {
    setType(con, type);
  };

  con.setDebugMode = function (enabled) {
    return setDebugMode(con, enabled);
  };

  con.toggleDebugMode = function () {
    return toggleDebugMode(con);
  };

  con.makeSelectable = function (options) {
    return makeSelectable(con, options);
  };

  con.makeDraggable = function (options) {
    return makeDraggable(con, options);
  };

  con.makeResizable = function (options) {
    return makeResizable(con, options);
  };

  con.makeInteractive = function (selectOptions, dragOptions, resizeOptions) {
    return makeInteractive(con, selectOptions, dragOptions, resizeOptions);
  };

  // Set up click handlers using utility function
  setupClickHandlers(con, globalActiveConnectorRef);

  con.update();

  // Generic update function for backward compatibility
  function updateConnector(event) {
    con.update();
  }

  // Create element-specific update functions to preserve context
  function updateConnectorFromSource(event) {
    // No need to track angles anymore - CTM handles all transformations
    con.update();
  }

  function updateConnectorFromTarget(event) {
    // No need to track angles anymore - CTM handles all transformations
    con.update();
  }

  // Store update functions on the connector for proper removal during reattachment
  con._sourceUpdateFunction = updateConnectorFromSource;
  con._targetUpdateFunction = updateConnectorFromTarget;

  // Bind to drag events
  elmSource.on("dragmove", updateConnectorFromSource);
  elmTarget.on("dragmove", updateConnectorFromTarget);

  // If elements have the new draggable plugin, update on those events too
  elmSource.on("beforedrag", updateConnectorFromSource);
  elmSource.on("dragstart", updateConnectorFromSource);
  elmSource.on("dragend", updateConnectorFromSource);
  elmTarget.on("beforedrag", updateConnectorFromTarget);
  elmTarget.on("dragstart", updateConnectorFromTarget);
  elmTarget.on("dragend", updateConnectorFromTarget);

  // Bind to resize events for both source and target elements (these can include rotation)
  elmSource.on("resize", updateConnectorFromSource);
  elmTarget.on("resize", updateConnectorFromTarget);

  // Bind to rotation-specific events if available
  elmSource.on("rotate", updateConnectorFromSource);
  elmTarget.on("rotate", updateConnectorFromTarget);

  // Bind to transform events to catch any transformation changes
  elmSource.on("transform", updateConnectorFromSource);
  elmTarget.on("transform", updateConnectorFromTarget);

  // Store update function for external access
  con.updateConnector = updateConnector;

  // Set initial connector color
  setConnectorColor(con, con.color);

  return con;
}

// Extend Element with the connectable method and convenience methods
extend(Element, {
  connectable: connectable,

  /**
   * makeConnectableAndInteractive
   * Creates a connection to target and makes both elements interactive
   *
   * @param {Object} connectOptions Options for the connectable plugin
   * @param {SVGElement} target The target element to connect to
   * @param {Object} selectOptions Options for the select plugin
   * @param {Object} dragOptions Options for the draggable plugin
   * @return {Connectable} The connectable instance.
   */
  makeConnectableAndInteractive: function (
    connectOptions,
    target,
    selectOptions,
    dragOptions
  ) {
    const connection = this.connectable(connectOptions, target);
    connection.makeInteractive(selectOptions, dragOptions);
    return connection;
  },
});
