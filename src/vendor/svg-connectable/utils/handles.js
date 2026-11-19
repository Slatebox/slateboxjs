/**
 * Handle utilities for SVG Connectable
 * Handles draggable handle creation, drag/drop operations, and drop target detection
 */

import { getElementCenter } from "./geometry.js";
import { computeConnectorCoordinates } from "./geometry.js";
import { svgCoordsToLocal } from "./geometry.js";

/**
 * Normalized [0,1] anchor for a world point on a node, snapped to the nearest
 * edge — the same mapping the host uses when it commits a drop-to-pin, so the
 * live drag PREVIEW matches where the endpoint will actually land.
 */
function snappedAnchorForDrop(node, worldPos) {
  try {
    const [lx, ly] = svgCoordsToLocal(node, worldPos[0], worldPos[1]);
    const bb = node.bbox();
    if (!bb || !bb.width || !bb.height) return null;
    let ax = Math.max(0, Math.min(1, (lx - bb.x) / bb.width));
    let ay = Math.max(0, Math.min(1, (ly - bb.y) / bb.height));
    const dl = ax, dr = 1 - ax, dt = ay, db = 1 - ay;
    const m = Math.min(dl, dr, dt, db);
    if (m === dl) ax = 0;
    else if (m === dr) ax = 1;
    else if (m === dt) ay = 0;
    else ay = 1;
    return { x: ax, y: ay };
  } catch (e) {
    return null;
  }
}

/**
 * Helper function to check if a plugin method is available
 */
function hasMethod(element, methodName) {
  return element && typeof element[methodName] === "function";
}

/**
 * createHandle
 * Creates a draggable handle circle at a connector endpoint
 *
 * @name createHandle
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Boolean} isSource Whether this is a source handle (true) or target handle (false)
 * @param {Array} position Initial position [x, y]
 * @return {Object} Handle object with element and metadata
 */
function createHandle(con, isSource, position) {
  if (!con.showHandles) return null;

  const handle = con.container
    .circle(con.handleRadius * 2)
    .attr({
      cx: position[0],
      cy: position[1],
      fill: con.handleFill,
      stroke: con.handleStroke,
      "stroke-width": con.handleStrokeWidth,
      "pointer-events": "all",
    })
    .addClass("connector-handle")
    .addClass(isSource ? "connector-handle-source" : "connector-handle-target");

  // Set cursor for handle
  try {
    handle.node.style.cursor = "grab";
  } catch (e) {
    handle.node.setAttribute("style", "cursor: grab");
  }

  const handleObj = {
    element: handle,
    isSource: isSource,
    position: position,
    isDetached: false,
    originalTarget: isSource ? con.source : con.target,
  };

  // Make handle draggable
  setupHandleDrag(con, handleObj);

  return handleObj;
}

/**
 * setupHandleDrag
 * Sets up drag functionality for a handle using SVG.js draggable plugin
 *
 * @name setupHandleDrag
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} handleObj The handle object to make draggable
 */
function setupHandleDrag(con, handleObj) {
  let dragTarget = null;
  let startPosition = [0, 0];

  // Check if draggable plugin is available
  if (!hasMethod(handleObj.element, "draggable")) {
    console.warn(
      "svg.draggable.js plugin not available for connector handles. Install @svgdotjs/svg.draggable.js for proper drag functionality."
    );
    return;
  }

  // Make the handle draggable using SVG.js plugin
  handleObj.element.draggable();

  // Set up drag event handlers
  handleObj.element
    .on("beforedrag", function (event) {
      // Store starting position
      startPosition = [handleObj.element.cx(), handleObj.element.cy()];

      // Change cursor to grabbing
      try {
        handleObj.element.node.style.cursor = "grabbing";
      } catch (ex) {
        handleObj.element.node.setAttribute("style", "cursor: grabbing");
      }

      // Bring handle to front
      handleObj.element.front();

      // Detach handle from its current connection
      detachHandle(con, handleObj);
    })
    .on("dragmove", function (event) {
      // Get current handle position (SVG.js draggable plugin handles coordinate transformation)
      const currentPos = [handleObj.element.cx(), handleObj.element.cy()];
      handleObj.position = currentPos;

      // Resolve the drop target FIRST so the live preview can render the actual
      // pinned/edge layout it would have if dropped here (not a raw line to the
      // pointer). Then update the connector using that target.
      const mouseEvent = event.detail.event;
      dragTarget = findDropTarget(con, mouseEvent, handleObj);
      highlightDropTarget(dragTarget);

      updateConnectorForDrag(con, handleObj, currentPos, dragTarget);
    })
    .on("dragend", function (event) {
      // Reset cursor
      try {
        handleObj.element.node.style.cursor = "grab";
      } catch (ex) {
        handleObj.element.node.setAttribute("style", "cursor: grab");
      }

      // Clean up debug visualizations
      if (con.debugMode) {
        clearHitZoneVisualizations(con.container);
      }

      // Handle drop
      if (dragTarget) {
        attachHandleToTarget(con, handleObj, dragTarget);
        clearDropTargetHighlight();
      } else {
        // Dropped on canvas - create phantom rect at drop location
        const dropPosition = [handleObj.element.cx(), handleObj.element.cy()];
        const phantomRect = createPhantomRect(con, dropPosition);

        // Track phantom rect on connector for cleanup
        if (handleObj.isSource) {
          con._sourcePhantomRect = phantomRect;
        } else {
          con._targetPhantomRect = phantomRect;
        }

        // Attach handle to the phantom rect
        attachHandleToTarget(con, handleObj, phantomRect);
      }

      dragTarget = null;
    });
}

/**
 * detachHandle
 * Detaches a handle from its current target, making the connector floating
 *
 * @name detachHandle
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} handleObj The handle object to detach
 */
function detachHandle(con, handleObj) {
  handleObj.isDetached = true;

  // Store the original target for potential reconnection
  if (!handleObj.originalTarget) {
    handleObj.originalTarget = handleObj.isSource ? con.source : con.target;
  }

  // Store the original line type to preserve it during drag
  if (!handleObj.originalType) {
    handleObj.originalType = con.type;
  }

  // Clean up phantom rects if the current target is a phantom
  const currentTarget = handleObj.isSource ? con.source : con.target;
  if (currentTarget && currentTarget._isPhantomRect) {
    currentTarget.remove();

    // Clear phantom rect reference
    if (handleObj.isSource) {
      con._sourcePhantomRect = null;
    } else {
      con._targetPhantomRect = null;
    }
  }

  // The connector will now have one floating end
  if (handleObj.isSource) {
    con.source = null; // Source is now floating
  } else {
    con.target = null; // Target is now floating
  }
}

/**
 * updateConnectorForDrag
 * Updates the connector path while a handle is being dragged
 *
 * @name updateConnectorForDrag
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} handleObj The handle being dragged
 * @param {Array} position Current drag position [x, y]
 */
function updateConnectorForDrag(con, handleObj, position, dropTarget) {
  // Use the preserved line type from when the handle was detached
  const lineType = handleObj.originalType || con.type;

  // Over a real drop target → preview the ACTUAL pinned layout (endpoint snapped
  // to the nearest edge, arrow perpendicular) instead of a raw line to the
  // pointer, so the drag conforms to where it will land. Guarded to real nodes
  // (has bbox), never phantom/handle elements.
  let previewNode = null;
  let previewAnchor = null;
  if (
    dropTarget &&
    typeof dropTarget.bbox === "function" &&
    !dropTarget._isPhantomRect &&
    !(dropTarget.hasClass && dropTarget.hasClass("connector-handle"))
  ) {
    previewAnchor = snappedAnchorForDrop(dropTarget, position);
    if (previewAnchor) previewNode = dropTarget;
  }

  // Create a mock element to represent the floating endpoint
  const mockElement = {
    bbox: function () {
      return {
        x: position[0] - 5,
        y: position[1] - 5,
        width: 10,
        height: 10,
        cx: position[0],
        cy: position[1],
      };
    },
    node: {
      getCTM: function () {
        return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
      },
    },
  };

  // Temporarily store original values
  const originalSource = con.source;
  const originalTarget = con.target;
  const originalType = con.type;
  const originalSourceAnchor = con.sourceAnchor;
  const originalTargetAnchor = con.targetAnchor;

  try {
    // Set up temporary connector state for path calculation
    con.type = lineType;

    if (handleObj.isSource) {
      // Source handle is being dragged
      if (previewNode) {
        // Preview the pinned layout on the hovered node.
        con.source = previewNode;
        con.sourceAnchor = previewAnchor;
      } else {
        con.source = mockElement;
        con.sourceAnchor = null;
      }
      if (!con.target) {
        // Both ends floating - create a simple target for calculation
        con.target = {
          bbox: function () {
            return {
              x: position[0] + 45,
              y: position[1] - 5,
              width: 10,
              height: 10,
              cx: position[0] + 50,
              cy: position[1],
            };
          },
          node: {
            getCTM: function () {
              return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
            },
          },
        };
      }
    } else {
      // Target handle is being dragged
      if (previewNode) {
        // Preview the pinned layout on the hovered node.
        con.target = previewNode;
        con.targetAnchor = previewAnchor;
      } else {
        con.target = mockElement;
        con.targetAnchor = null;
      }
      if (!con.source) {
        // Both ends floating - create a simple source for calculation
        con.source = {
          bbox: function () {
            return {
              x: position[0] - 55,
              y: position[1] - 5,
              width: 10,
              height: 10,
              cx: position[0] - 50,
              cy: position[1],
            };
          },
          node: {
            getCTM: function () {
              return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
            },
          },
        };
      }
    }

    // Use the existing path calculation logic
    const pathData = computeConnectorCoordinates(con);

    // Update connector and hit area
    con.connector.plot(pathData);
    con.hitArea.plot(pathData);
  } finally {
    // Restore original values (incl. anchors — the preview must never leak into
    // the committed connection; the real pin is set on dragend by the host).
    con.source = originalSource;
    con.target = originalTarget;
    con.type = originalType;
    con.sourceAnchor = originalSourceAnchor;
    con.targetAnchor = originalTargetAnchor;
  }
}

/**
 * isPointInElement
 * Checks if a point is inside an element, accounting for transformations
 *
 * @name isPointInElement
 * @function
 * @param {SVGElement} element The element to test
 * @param {Array} point The point [x, y] in SVG coordinates
 * @param {Boolean} debugMode Whether to show debug visualization
 * @return {Boolean} True if point is inside element
 */
function isPointInElement(element, point, debugMode = false) {
  try {
    // Get the element's CTM and bounding box
    const ctm = element.node.getCTM();
    const bbox = element.bbox();

    if (debugMode) {
      console.log("Hit test debug:", {
        element: element.type,
        point: point,
        bbox: bbox,
        ctm: ctm,
      });
    }

    // Convert point from world coordinates to element's local coordinates
    const det = ctm.a * ctm.d - ctm.b * ctm.c;
    if (Math.abs(det) < 1e-10) {
      // Singular matrix, fallback to simple bbox test
      if (debugMode) {
        console.log("Using fallback bbox test due to singular matrix");
      }
      return (
        point[0] >= bbox.x &&
        point[0] <= bbox.x + bbox.width &&
        point[1] >= bbox.y &&
        point[1] <= bbox.y + bbox.height
      );
    }

    // Inverse transformation
    const invA = ctm.d / det;
    const invB = -ctm.b / det;
    const invC = -ctm.c / det;
    const invD = ctm.a / det;
    const invE = (ctm.c * ctm.f - ctm.d * ctm.e) / det;
    const invF = (ctm.b * ctm.e - ctm.a * ctm.f) / det;

    // Transform point to local coordinates
    const localX = invA * point[0] + invC * point[1] + invE;
    const localY = invB * point[0] + invD * point[1] + invF;

    if (debugMode) {
      console.log("Local coordinates:", { localX, localY });
    }

    let result = false;

    // Test against local bounding box
    if (element.type === "circle") {
      const cx = parseFloat(element.attr("cx")) || bbox.cx;
      const cy = parseFloat(element.attr("cy")) || bbox.cy;
      const r = parseFloat(element.attr("r")) || 0;
      const dx = localX - cx;
      const dy = localY - cy;
      result = dx * dx + dy * dy <= r * r;
      if (debugMode) {
        console.log("Circle test:", {
          cx,
          cy,
          r,
          dx,
          dy,
          distance: Math.sqrt(dx * dx + dy * dy),
          result,
        });
      }
    } else if (element.type === "ellipse") {
      const cx = parseFloat(element.attr("cx")) || bbox.cx;
      const cy = parseFloat(element.attr("cy")) || bbox.cy;
      const rx = parseFloat(element.attr("rx")) || 0;
      const ry = parseFloat(element.attr("ry")) || 0;
      const dx = localX - cx;
      const dy = localY - cy;
      result = (dx * dx) / (rx * rx) + (dy * dy) / (ry * ry) <= 1;
      if (debugMode) {
        console.log("Ellipse test:", { cx, cy, rx, ry, dx, dy, result });
      }
    } else {
      // For rectangles and other shapes, test against local bounding box
      result =
        localX >= bbox.x &&
        localX <= bbox.x + bbox.width &&
        localY >= bbox.y &&
        localY <= bbox.y + bbox.height;
      if (debugMode) {
        console.log("Rect test:", {
          localX,
          localY,
          bboxX: bbox.x,
          bboxY: bbox.y,
          bboxWidth: bbox.width,
          bboxHeight: bbox.height,
          result,
        });
      }
    }

    return result;
  } catch (e) {
    // Fallback to simple bbox test if anything fails
    if (debugMode) {
      console.log("Exception in hit test, using fallback:", e);
    }
    const bbox = element.bbox();
    return (
      point[0] >= bbox.x &&
      point[0] <= bbox.x + bbox.width &&
      point[1] >= bbox.y &&
      point[1] <= bbox.y + bbox.height
    );
  }
}

/**
 * visualizeHitZone
 * Creates debug visualization for element hit zones
 *
 * @name visualizeHitZone
 * @function
 * @param {SVGElement} element The element to visualize
 * @param {SVGElement} container The container to add debug elements to
 * @return {SVGElement} Debug visualization element
 */
function visualizeHitZone(element, container) {
  try {
    const bbox = element.bbox();
    const ctm = element.node.getCTM();

    // Create debug group
    const debugGroup = container.group().addClass("debug-hit-zone");

    // Show original bounding box in light red
    const originalBox = debugGroup.rect(bbox.width, bbox.height).attr({
      x: bbox.x,
      y: bbox.y,
      fill: "none",
      stroke: "#ffcccc",
      "stroke-width": 1,
      "stroke-dasharray": "2,2",
    });

    // Show transformed bounding box in bright red
    if (ctm) {
      // Transform the four corners of the bounding box
      const corners = [
        [bbox.x, bbox.y],
        [bbox.x + bbox.width, bbox.y],
        [bbox.x + bbox.width, bbox.y + bbox.height],
        [bbox.x, bbox.y + bbox.height],
      ];

      const transformedCorners = corners.map((corner) => [
        ctm.a * corner[0] + ctm.c * corner[1] + ctm.e,
        ctm.b * corner[0] + ctm.d * corner[1] + ctm.f,
      ]);

      // Create polygon showing actual hit zone
      const pathData =
        transformedCorners
          .map(
            (corner, i) => (i === 0 ? "M" : "L") + corner[0] + "," + corner[1]
          )
          .join(" ") + " Z";

      debugGroup.path(pathData).attr({
        fill: "rgba(255, 0, 0, 0.1)",
        stroke: "#ff0000",
        "stroke-width": 2,
        "stroke-dasharray": "5,3",
      });
    }

    // Add center point
    let centerX, centerY;
    try {
      centerX = ctm.a * bbox.cx + ctm.c * bbox.cy + ctm.e;
      centerY = ctm.b * bbox.cx + ctm.d * bbox.cy + ctm.f;
    } catch (e) {
      centerX = bbox.cx;
      centerY = bbox.cy;
    }

    debugGroup.circle(4).attr({
      cx: centerX,
      cy: centerY,
      fill: "#ff0000",
    });

    return debugGroup;
  } catch (e) {
    console.warn("Error creating hit zone visualization:", e);
    return null;
  }
}

/**
 * clearHitZoneVisualizations
 * Removes all debug hit zone visualizations
 *
 * @name clearHitZoneVisualizations
 * @function
 * @param {SVGElement} container The container to clear debug elements from
 */
function clearHitZoneVisualizations(container) {
  try {
    const debugElements = container.find(".debug-hit-zone");
    debugElements.forEach((el) => el.remove());
  } catch (e) {
    console.warn("Error clearing hit zone visualizations:", e);
  }
}

/**
 * findDropTarget
 * Finds a valid drop target under the mouse cursor
 *
 * @name findDropTarget
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Event} e Mouse event
 * @param {Object} handleObj The handle being dragged
 * @return {SVGElement|null} Valid drop target or null
 */
function findDropTarget(con, e, handleObj) {
  const debugMode = con.debugMode || false;

  // Clear previous debug visualizations if in debug mode
  if (debugMode) {
    clearHitZoneVisualizations(con.container);
  }

  // Find all actual target shapes in the entire SVG by their characteristics
  function findTargetShapes(container) {
    const shapes = [];

    function searchRecursively(element) {
      // Check if this element is a target shape
      if (isTargetShape(element)) {
        shapes.push(element);
      }

      // Recursively search children (for groups, etc.)
      if (element.children && typeof element.children === "function") {
        element.children().forEach(searchRecursively);
      }
    }

    searchRecursively(container);
    return shapes;
  }

  // Determine what makes a shape a valid drop target
  function isTargetShape(element) {
    // Must be a shape element
    const validShapeTypes = ["circle", "rect", "ellipse", "polygon", "path"];
    if (!validShapeTypes.includes(element.type)) {
      return false;
    }

    // Must not be a connector element
    if (element.attr("connectortype")) {
      return false;
    }

    // Must not be a connector handle
    if (element.hasClass && element.hasClass("connector-handle")) {
      return false;
    }

    // Must not be a phantom rect
    if (element._isPhantomRect) {
      return false;
    }

    // Must not be debug visualization elements
    if (element.hasClass && element.hasClass("debug-hit-zone")) {
      return false;
    }

    // Exclude plugin UI elements - check for common plugin class patterns
    if (element.hasClass) {
      const classList = element.node.classList;
      if (classList) {
        // svg.select.js plugin elements
        if (
          classList.contains("svg_select_boundingRect") ||
          classList.contains("svg_select_points") ||
          classList.contains("svg_select_selector")
        ) {
          return false;
        }

        // svg.resize.js plugin elements
        if (
          classList.contains("svg_resize_rotationPoint") ||
          classList.contains("svg_resize_handle") ||
          classList.contains("svg_resize_point")
        ) {
          return false;
        }

        // General plugin indicators
        if (
          classList.contains("svg_draggable_handle") ||
          classList.contains("plugin-ui") ||
          classList.contains("ui-element")
        ) {
          return false;
        }
      }
    }

    // Exclude very small elements (likely handles) - reasonable minimum size for user shapes
    const bbox = element.bbox();
    if (bbox.width < 10 || bbox.height < 10) {
      return false;
    }

    // Exclude elements with cursor styles that indicate UI elements. NOTE: do
    // NOT exclude cursor:"move" — node shapes are draggable and legitimately use
    // it (Miro-style affordance); excluding it made nodes invisible to endpoint
    // drop detection so reconnecting onto a node failed. Only the resize/crosshair
    // cursors mark true plugin handles.
    try {
      const computedStyle = window.getComputedStyle(element.node);
      const cursor = computedStyle.cursor;
      if (
        cursor === "nw-resize" ||
        cursor === "ne-resize" ||
        cursor === "sw-resize" ||
        cursor === "se-resize" ||
        cursor === "ew-resize" ||
        cursor === "ns-resize" ||
        cursor === "crosshair"
      ) {
        return false;
      }
    } catch (e) {
      // Ignore if style checking fails
    }

    // Check for data attributes that indicate plugin elements
    const dataAttrs = element.node.dataset;
    if (dataAttrs) {
      if (
        dataAttrs.svgjs ||
        dataAttrs.plugin ||
        dataAttrs.handle ||
        dataAttrs.ui
      ) {
        return false;
      }
    }

    // Check if element is in a plugin-specific parent group
    let parent = element.parent();
    while (parent && parent.type !== "svg") {
      if (parent.hasClass) {
        const parentClasses = parent.node.classList;
        if (
          parentClasses &&
          (parentClasses.contains("svg_select_group") ||
            parentClasses.contains("svg_resize_group") ||
            parentClasses.contains("plugin-ui-group"))
        ) {
          return false;
        }
      }
      // Check for plugin-specific ID patterns on parent
      const parentId = parent.attr("id");
      if (
        parentId &&
        (parentId.includes("_select_") ||
          parentId.includes("_resize_") ||
          parentId.includes("plugin"))
      ) {
        return false;
      }
      parent = parent.parent();
    }

    // Check for specific ID patterns that suggest plugin elements
    const elementId = element.attr("id");
    if (
      elementId &&
      (elementId.includes("_select_") ||
        elementId.includes("_resize_") ||
        elementId.includes("_handle_") ||
        elementId.includes("_rotation_") ||
        elementId.includes("plugin") ||
        elementId.startsWith("svg_"))
    ) {
      return false;
    }

    // Additional filtering - target shapes likely have fills or strokes
    const fill = element.attr("fill");
    const stroke = element.attr("stroke");
    if (!fill && !stroke) {
      return false; // Probably not a visible target shape
    }

    // Exclude elements with transparent or very light fills (often UI elements)
    if (fill === "transparent" || fill === "none") {
      // Only allow if it has a visible stroke
      if (!stroke || stroke === "none" || stroke === "transparent") {
        return false;
      }
    }

    return true;
  }

  // Get the root SVG container
  const rootSvg = con.container.root();

  // Calculate mouse coordinates relative to the root SVG
  const svgRect = rootSvg.node.getBoundingClientRect();
  const svgX = e.clientX - svgRect.left;
  const svgY = e.clientY - svgRect.top;

  if (debugMode) {
    console.log("Drop target search at:", { svgX, svgY });
  }

  // Find all target shapes
  const targetShapes = findTargetShapes(rootSvg);

  if (debugMode) {
    console.log("Found target shapes:", targetShapes.length);
    targetShapes.forEach((element, index) => {
      console.log(`Target shape ${index}:`, {
        type: element.type,
        id: element.attr("id"),
        classes: element.node.classList
          ? Array.from(element.node.classList)
          : [],
        fill: element.attr("fill"),
        stroke: element.attr("stroke"),
        bbox: element.bbox(),
        isValid: isValidDropTarget(con, element, handleObj),
      });
    });

    // Show hit zones for all valid target shapes
    targetShapes.forEach((element) => {
      if (isValidDropTarget(con, element, handleObj)) {
        visualizeHitZone(element, con.container);
      }
    });
  }

  // Check which target shapes contain the mouse point
  const candidates = [];

  targetShapes.forEach(function (element) {
    if (isValidDropTarget(con, element, handleObj)) {
      try {
        // Use CTM-aware hit testing for accurate detection on rotated elements
        const hitResult = isPointInElement(element, [svgX, svgY], debugMode);

        if (hitResult) {
          // Calculate distance to center for priority (closest wins)
          // Use CTM-aware center calculation
          let centerX, centerY;
          try {
            const bbox = element.bbox();
            const ctm = element.node.getCTM();
            centerX = ctm.a * bbox.cx + ctm.c * bbox.cy + ctm.e;
            centerY = ctm.b * bbox.cx + ctm.d * bbox.cy + ctm.f;
          } catch (e) {
            const bbox = element.bbox();
            centerX = bbox.cx;
            centerY = bbox.cy;
          }

          const distance = Math.sqrt(
            Math.pow(svgX - centerX, 2) + Math.pow(svgY - centerY, 2)
          );

          if (debugMode) {
            console.log("Found candidate:", {
              element: element.type,
              distance,
            });
          }

          candidates.push({ element: element, distance: distance });
        }
      } catch (ex) {
        // Skip elements that cause errors
        console.warn("Error checking element for drop target:", ex);
      }
    }
  });

  // Return the closest candidate if any
  if (candidates.length > 0) {
    candidates.sort(function (a, b) {
      return a.distance - b.distance;
    });
    if (debugMode) {
      console.log("Selected closest candidate:", candidates[0]);
    }
    return candidates[0].element;
  }

  if (debugMode) {
    console.log("No drop target found");
  }
  return null;
}

/**
 * isValidDropTarget
 * Checks if an element is a valid drop target for a handle
 *
 * @name isValidDropTarget
 * @function
 * @param {Connectable} con The connectable instance
 * @param {SVGElement} element The potential target element
 * @param {Object} handleObj The handle being dragged
 * @return {Boolean} True if valid drop target
 */
function isValidDropTarget(con, element, handleObj) {
  // Dropping back on the endpoint's OWN current node is ALLOWED — that is how you
  // reposition a pinned endpoint along its node's edge (handleEndpointChange re-pins it
  // via pinDropAnchor). Excluding the current target here made the node invisible to the
  // drop hit-test, so a same-node reposition fell through to a canvas drop: the endpoint
  // detached into a free-floating point (straight line, no longer followed the node) and
  // the same-node re-pin path was effectively unreachable.

  // A drop target must be part of an ACTUAL NODE (have a data-node-id ancestor). Without
  // this, valid-looking shapes that are NOT nodes — the node's connection-plug dots
  // (circles), connector arrowheads (polygons), birdseye/minimap shapes — matched the hit
  // test; dropping on one derived a null targetNodeId → the endpoint went free-floating and
  // flew off to a stale coordinate. Requiring a node id also stops endpoints snapping to the
  // four plug-dot icons.
  try {
    let nel = element.node;
    while (nel && nel.getAttribute && !nel.getAttribute("data-node-id")) {
      nel = nel.parentNode;
    }
    if (!(nel && nel.getAttribute && nel.getAttribute("data-node-id"))) {
      return false;
    }
    // A note its host governs (see core/DragPolicy.ts) may refuse connectors.
    if (nel.getAttribute("data-no-connect")) return false;
  } catch (e) {
    return false;
  }

  // Don't allow dropping on connector elements themselves
  if (element.attr("connectortype")) return false;

  // Don't allow dropping on handles
  if (element.hasClass && element.hasClass("connector-handle")) return false;

  // Don't allow dropping on phantom rects
  if (element._isPhantomRect) return false;

  // Don't allow connecting to the other end of the same connector
  const otherTarget = handleObj.isSource ? con.target : con.source;
  if (element === otherTarget) return false;

  return true;
}

/**
 * attachHandleToTarget
 * Attaches a handle to a new target element
 *
 * @name attachHandleToTarget
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} handleObj The handle to attach
 * @param {SVGElement} target The target element to attach to
 */
function attachHandleToTarget(con, handleObj, target) {
  // Capture the actual DROP POINT (the handle's position at release, in world
  // coords) BEFORE any snap/reposition, so the model can attach the connection
  // exactly where the user dropped rather than at the target's center.
  let dropPoint = null;
  try {
    dropPoint = { x: handleObj.element.cx(), y: handleObj.element.cy() };
  } catch (e) {
    /* noop */
  }

  // Store old target for event cleanup
  const oldTarget = handleObj.isSource ? con.source : con.target;

  // Clean up phantom rect if oldTarget was a phantom
  if (oldTarget && oldTarget._isPhantomRect) {
    oldTarget.remove();

    // Clear phantom rect reference
    if (handleObj.isSource) {
      con._sourcePhantomRect = null;
    } else {
      con._targetPhantomRect = null;
    }
  }

  // Reattach the handle to the new target
  if (handleObj.isSource) {
    con.source = target;
  } else {
    con.target = target;
  }

  handleObj.isDetached = false;

  // Update connector arrays and event listeners
  // Handle both floating handle attachment (oldTarget = null) and reattachment (oldTarget != target)
  if (!oldTarget || oldTarget !== target) {
    // Create the correct update function based on which handle is being reattached
    let updateFunction;
    if (handleObj.isSource) {
      updateFunction = function (event) {
        con.update();
      };
    } else {
      updateFunction = function (event) {
        con.update();
      };
    }

    // Get the stored update function for proper removal
    const storedFunctionKey = handleObj.isSource
      ? "_sourceUpdateFunction"
      : "_targetUpdateFunction";
    const oldUpdateFunction = con[storedFunctionKey];

    // Remove old event listeners if we have the function reference
    if (oldUpdateFunction && oldTarget) {
      oldTarget.off("dragmove", oldUpdateFunction);
      oldTarget.off("beforedrag", oldUpdateFunction);
      oldTarget.off("dragstart", oldUpdateFunction);
      oldTarget.off("dragend", oldUpdateFunction);
      oldTarget.off("resize", oldUpdateFunction);
      oldTarget.off("rotate", oldUpdateFunction);
      oldTarget.off("transform", oldUpdateFunction);
    }

    // Update cons arrays - remove connector from old element, add to new element
    if (handleObj.isSource) {
      // For source reattachment, manage the main cons array
      if (oldTarget && oldTarget.cons) {
        const index = oldTarget.cons.indexOf(con);
        if (index > -1) {
          oldTarget.cons.splice(index, 1);
        }
      }
      // Add to new source element's cons array
      target.cons = target.cons || [];
      if (target.cons.indexOf(con) === -1) {
        target.cons.push(con);
      }
    } else {
      // For target reattachment, ensure the target has connector tracking
      // Remove from old target's connector tracking if it exists
      if (oldTarget && oldTarget.targetCons) {
        const index = oldTarget.targetCons.indexOf(con);
        if (index > -1) {
          oldTarget.targetCons.splice(index, 1);
        }
      }
      // Add to new target element's tracking
      target.targetCons = target.targetCons || [];
      if (target.targetCons.indexOf(con) === -1) {
        target.targetCons.push(con);
      }
    }

    // Store the new update function on the connector for future removal
    con[storedFunctionKey] = updateFunction;

    // Add new event listeners to the new target - ONLY the correct function type
    target.on("dragmove", updateFunction);
    target.on("beforedrag", updateFunction);
    target.on("dragstart", updateFunction);
    target.on("dragend", updateFunction);
    target.on("resize", updateFunction);
    target.on("rotate", updateFunction);
    target.on("transform", updateFunction);
  }

  // Update the connector to use proper path calculation
  con.update();

  // Move the handle to the proper position on the target's edge
  if (con.source && con.target) {
    const pathData = computeConnectorCoordinates(con);
    if (pathData && pathData.length >= 2) {
      let newPosition;
      if (handleObj.isSource) {
        // Source handle goes to start of path
        newPosition = [pathData[0][1], pathData[0][2]];
      } else {
        // Target handle goes to end of path
        const lastCommand = pathData[pathData.length - 1];
        newPosition = [
          lastCommand[lastCommand.length - 2],
          lastCommand[lastCommand.length - 1],
        ];
      }

      // Update handle position
      handleObj.position = newPosition;
      handleObj.element.center(newPosition[0], newPosition[1]);
    }
  }

  // Notify the host model that an endpoint changed (reattached to a node, or a
  // free-floating phantom drop) so it can update the association, broadcast to
  // peers, and persist. The vendored lib is view-only; Connector wires this.
  if (typeof con.onEndpointChange === "function") {
    const isPhantom = !!target._isPhantomRect;
    let targetNodeId = null;
    if (!isPhantom) {
      try {
        // findDropTarget returns the SHAPE (rect/circle/…), a child of the
        // node group; data-node-id lives on the group, so walk up to find it.
        let el = target.node || null;
        while (el && el.getAttribute && !el.getAttribute("data-node-id")) {
          el = el.parentNode;
        }
        targetNodeId =
          (el && el.getAttribute && el.getAttribute("data-node-id")) || null;
      } catch (e) {
        /* noop */
      }
    }
    // Prefer the actual drop point (handle release position); fall back to the
    // target center only if unavailable.
    let point = dropPoint;
    if (!point) {
      try {
        point = { x: target.cx(), y: target.cy() };
      } catch (e) {
        /* noop */
      }
    }
    con.onEndpointChange({
      which: handleObj.isSource ? "source" : "target",
      targetNodeId,
      isPhantom,
      point,
    });
  }
}

// Keep track of currently highlighted target to avoid re-applying
let currentlyHighlighted = null;

/**
 * highlightDropTarget
 * Highlights a potential drop target during drag with clean animated dashed border
 *
 * @name highlightDropTarget
 * @function
 * @param {SVGElement|null} target The target to highlight
 */
function highlightDropTarget(target) {
  // If it's the same target as already highlighted, do nothing
  if (target === currentlyHighlighted) {
    return;
  }

  // Clear previous highlights
  clearDropTargetHighlight();

  if (target) {
    currentlyHighlighted = target;

    // Store original styles
    target._originalStroke = target.attr("stroke");
    target._originalStrokeWidth = target.attr("stroke-width");
    target._originalStrokeDasharray = target.attr("stroke-dasharray");
    target._originalStrokeOpacity = target.attr("stroke-opacity");

    // Apply clean animated dashed border
    target.attr({
      stroke: "#007cff", // Professional blue
      "stroke-width": 3, // Clean consistent width
      "stroke-dasharray": "8,4", // Longer dashes for cleaner look
      "stroke-opacity": 0.8, // Slightly transparent
    });

    // Add CSS animation for dash movement
    try {
      const style = target.node.style;
      style.strokeDashoffset = "0";
      style.animation = "connector-dash-flow 1.5s linear infinite";

      // Inject CSS if not already present
      if (!document.getElementById("connector-highlight-styles")) {
        const styleSheet = document.createElement("style");
        styleSheet.id = "connector-highlight-styles";
        styleSheet.textContent = `
          @keyframes connector-dash-flow {
            0% { stroke-dashoffset: 0; }
            100% { stroke-dashoffset: 24; }
          }
        `;
        document.head.appendChild(styleSheet);
      }
    } catch (ex) {
      // Fallback if animation fails
      console.warn("Could not apply highlight animation:", ex);
    }
  } else {
    currentlyHighlighted = null;
  }
}

/**
 * clearDropTargetHighlight
 * Clears drop target highlighting
 *
 * @name clearDropTargetHighlight
 * @function
 */
function clearDropTargetHighlight() {
  // Clear the currently highlighted target if any
  if (
    currentlyHighlighted &&
    currentlyHighlighted._originalStroke !== undefined
  ) {
    currentlyHighlighted.attr({
      stroke: currentlyHighlighted._originalStroke,
      "stroke-width": currentlyHighlighted._originalStrokeWidth,
      "stroke-dasharray": currentlyHighlighted._originalStrokeDasharray,
      "stroke-opacity": currentlyHighlighted._originalStrokeOpacity,
    });

    // Clear animation
    try {
      const style = currentlyHighlighted.node.style;
      style.animation = "";
      style.strokeDashoffset = "";
    } catch (ex) {
      // Ignore if style clearing fails
    }

    // Clean up stored properties
    delete currentlyHighlighted._originalStroke;
    delete currentlyHighlighted._originalStrokeWidth;
    delete currentlyHighlighted._originalStrokeDasharray;
    delete currentlyHighlighted._originalStrokeOpacity;
  }

  currentlyHighlighted = null;
}

/**
 * updateHandles
 * Updates or creates the connector handles at the endpoints
 *
 * @name updateHandles
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Array} pathData The path data array from computeConnectorCoordinates
 * @return {undefined}
 */
function updateHandles(con, pathData) {
  if (!con.showHandles || !pathData || pathData.length < 2) {
    // Remove handles if they exist but aren't needed
    if (con.sourceHandle) {
      con.sourceHandle.element.remove();
      con.sourceHandle = null;
    }
    if (con.targetHandle) {
      con.targetHandle.element.remove();
      con.targetHandle = null;
    }
    return;
  }

  // Get start and end points from path data
  const startPoint = [pathData[0][1], pathData[0][2]]; // First M command
  const lastCmd = pathData[pathData.length - 1];
  const endPoint = [lastCmd[lastCmd.length - 2], lastCmd[lastCmd.length - 1]]; // Last point

  // Create or update source handle
  if (!con.sourceHandle) {
    con.sourceHandle = createHandle(con, true, startPoint);
  } else {
    con.sourceHandle.element.attr({
      cx: startPoint[0],
      cy: startPoint[1],
    });
    con.sourceHandle.position = startPoint;
  }

  // Create or update target handle
  if (!con.targetHandle) {
    con.targetHandle = createHandle(con, false, endPoint);
  } else {
    con.targetHandle.element.attr({
      cx: endPoint[0],
      cy: endPoint[1],
    });
    con.targetHandle.position = endPoint;
  }
}

/**
 * createPhantomRect
 * Creates a transparent rectangular placeholder at the dropped location
 *
 * @name createPhantomRect
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Array} position Position [x, y] where the rect should be created
 * @return {Object} Phantom rect element
 */
function createPhantomRect(con, position) {
  const rect = con.container
    .rect(20, 20)
    .attr({
      x: position[0] - 10,
      y: position[1] - 10,
      fill: "transparent",
      stroke: "none",
      "pointer-events": "none",
    })
    .addClass("connector-phantom-rect");

  // Mark as phantom for identification
  rect._isPhantomRect = true;

  return rect;
}

export {
  createHandle,
  setupHandleDrag,
  detachHandle,
  updateConnectorForDrag,
  findDropTarget,
  isValidDropTarget,
  attachHandleToTarget,
  highlightDropTarget,
  clearDropTargetHighlight,
  updateHandles,
  createPhantomRect,
  isPointInElement,
  visualizeHitZone,
  clearHitZoneVisualizations,
};
