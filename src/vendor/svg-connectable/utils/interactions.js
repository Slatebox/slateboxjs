/**
 * Interaction utilities for SVG Connectable
 * Handles selection, debug mode, plugin integrations, and interactive features
 */

/**
 * Helper function to check if a plugin method is available
 */
function hasMethod(element, methodName) {
  return element && typeof element[methodName] === "function";
}

/**
 * selectConnector
 * Shows handles for this connector and hides them for others
 *
 * @name selectConnector
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} activeConnector Current active connector reference (passed by reference)
 * @return {undefined}
 */
function selectConnector(con, activeConnectorRef) {
  // Deselect any currently active connector
  if (activeConnectorRef.current && activeConnectorRef.current !== con) {
    deselectConnector(activeConnectorRef.current);
  }

  // Select this connector
  activeConnectorRef.current = con;
  con.isSelected = true;
  con.showHandles = true;
  con.update(); // This will create the handles
}

/**
 * deselectConnector
 * Hides handles for this connector
 *
 * @name deselectConnector
 * @function
 * @param {Connectable} con The connectable instance
 * @return {undefined}
 */
function deselectConnector(con) {
  con.isSelected = false;
  con.showHandles = false;
  con.update(); // This will remove the handles
}

/**
 * toggleSelection
 * Toggles the selection state of this connector
 *
 * @name toggleSelection
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} activeConnectorRef Current active connector reference (passed by reference)
 * @return {undefined}
 */
function toggleSelection(con, activeConnectorRef) {
  if (con.isSelected) {
    deselectConnector(con);
    if (activeConnectorRef.current === con) {
      activeConnectorRef.current = null;
    }
  } else {
    selectConnector(con, activeConnectorRef);
  }
}

/**
 * setupClickHandlers
 * Sets up click handlers for connector selection with click vs drag detection
 *
 * @name setupClickHandlers
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} activeConnectorRef Current active connector reference (passed by reference)
 * @return {undefined}
 */
function setupClickHandlers(con, activeConnectorRef) {
  // Track mouse position for click vs drag detection
  let mouseDownPos = null;
  const DRAG_THRESHOLD = 5; // pixels - if mouse moves more than this, it's a drag not a click

  function handleMouseDown(event) {
    mouseDownPos = { x: event.clientX, y: event.clientY };
  }

  function handleMouseUp(event) {
    if (!mouseDownPos) return;

    // Calculate distance moved
    const dx = event.clientX - mouseDownPos.x;
    const dy = event.clientY - mouseDownPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only trigger click if mouse didn't move significantly (not a pan/drag)
    if (distance < DRAG_THRESHOLD) {
      // Let the click reach the canvas too (so the host can clear other
      // selection), but notify the host that THIS line was clicked. The host
      // (Connector) decides what to do — show a cog / open the line pane. We do
      // NOT call the old toggleSelection here: it left the connector "selected"
      // with a deselect that only fired on a bare-container click, which made
      // the canvas feel stuck (only pannable) until a refresh.
      if (typeof con.onLineClick === "function") {
        con.onLineClick(event);
      }
    }

    mouseDownPos = null;
  }

  // Use mousedown/mouseup for click detection instead of .click()
  con.hitArea.on("mousedown", handleMouseDown);
  con.hitArea.on("mouseup", handleMouseUp);
  con.connector.on("mousedown", handleMouseDown);
  con.connector.on("mouseup", handleMouseUp);
}

/**
 * setConnectorAttachment
 * Sets the connector's attachment type.
 *
 * @name setConnectorAttachment
 * @function
 * @param {Connectable} con The connectable instance
 * @param {String} element Can be either 'source' or 'target'
 * @param {String} type Can be either 'center' or 'perifery'
 * @return {undefined}
 */
function setConnectorAttachment(con, element, type) {
  con[element + "Attach"] = type;
  con.update();
}

/**
 * setHandleVisibility
 * Shows or hides the connector handles.
 *
 * @name setHandleVisibility
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Boolean} visible Whether handles should be visible
 * @return {Connectable} The connectable instance.
 */
function setHandleVisibility(con, visible) {
  con.showHandles = visible;
  con.update(); // This will create or remove handles based on showHandles
  return con;
}

/**
 * getHandles
 * Returns the current handle elements.
 *
 * @name getHandles
 * @function
 * @param {Connectable} con The connectable instance
 * @return {Object} Object with sourceHandle and targetHandle properties
 */
function getHandles(con) {
  return {
    sourceHandle: con.sourceHandle,
    targetHandle: con.targetHandle,
  };
}

/**
 * setClickAreaWidth
 * Sets the width of the invisible click area.
 *
 * @name setClickAreaWidth
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Number} width The click area width in pixels
 * @return {Connectable} The connectable instance.
 */
function setClickAreaWidth(con, width) {
  con.clickAreaWidth = Math.max(6, width || 12); // Minimum 6px
  con.hitArea.attr("stroke-width", con.clickAreaWidth);
  return con;
}

/**
 * setConnector
 * Sets the connector
 *
 * @name setConnector
 * @function
 * @param {Connectable} con The connectable instance
 * @param {SVGElement} connector Can be either an SVGElement or 'default'
 * @return {undefined}
 */
function setConnector(con, connector) {
  if (connector) {
    con.connector.remove();
    if (connector == "default") {
      con.connector = con.container
        .path()
        .attr("connectortype", "default")
        .fill("none")
        .stroke("#000000")
        .attr("stroke-width", 2);
      // Set connector color using the color utility
      con.connector.stroke(con.color).attr("stroke-width", con.strokeWidth);
    } else con.connector = connector;
    con.update();
  }
}

/**
 * setType
 * Sets the connector's type.
 *
 * @name setType
 * @function
 * @param {Connectable} con The connectable instance
 * @param {String} type Can be either 'straight', 'curved', or 'orthogonal'
 * @return {undefined}
 */
function setType(con, type) {
  if (["straight", "curved", "orthogonal"].indexOf(type) != -1) {
    if (con.type != type) {
      con.type = type;
      con.update();
    }
  }
}

/**
 * setDebugMode
 * Sets the debug mode for visualizing hit areas.
 *
 * @name setDebugMode
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Boolean} enabled Whether debug mode should be enabled
 * @return {Connectable} The connectable instance.
 */
function setDebugMode(con, enabled) {
  con.debugMode = enabled;

  // Update hit area visualization
  con.hitArea.attr({
    stroke: con.debugMode ? "#ff0000" : "#000000",
    "stroke-opacity": con.debugMode ? 0.5 : 0.01,
  });

  return con;
}

/**
 * toggleDebugMode
 * Toggles the debug mode for visualizing hit areas.
 *
 * @name toggleDebugMode
 * @function
 * @param {Connectable} con The connectable instance
 * @return {Connectable} The connectable instance.
 */
function toggleDebugMode(con) {
  return setDebugMode(con, !con.debugMode);
}

/**
 * makeSelectable
 * Makes the source and target elements selectable (requires @svgdotjs/svg.select.js)
 *
 * @name makeSelectable
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} options Options for the select plugin
 * @return {Connectable} The connectable instance.
 */
function makeSelectable(con, options) {
  options = options || {};

  if (hasMethod(con.source, "select")) {
    con.source.select(options);
  } else {
    console.warn(
      "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
    );
  }

  if (hasMethod(con.target, "select")) {
    con.target.select(options);
  } else {
    console.warn(
      "svg.select.js plugin not available. Install @svgdotjs/svg.select.js to use selection features."
    );
  }

  return con;
}

/**
 * makeDraggable
 * Makes the source and target elements draggable (requires @svgdotjs/svg.draggable.js)
 *
 * @name makeDraggable
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} options Options for the draggable plugin
 * @return {Connectable} The connectable instance.
 */
function makeDraggable(con, options) {
  options = options || {};

  if (hasMethod(con.source, "draggable")) {
    con.source.draggable(); // Enable with defaults
    // Bind connector updates to new drag events (these should already be bound)
  } else {
    console.warn(
      "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
    );
  }

  if (hasMethod(con.target, "draggable")) {
    con.target.draggable(); // Enable with defaults
    // Bind connector updates to new drag events (these should already be bound)
  } else {
    console.warn(
      "svg.draggable.js plugin not available. Install @svgdotjs/svg.draggable.js to use dragging features."
    );
  }

  return con;
}

/**
 * makeResizable (experimental)
 * Adds resize handles if svg.resize.js is available
 */
function makeResizable(con, options) {
  options = options || {};

  if (hasMethod(con.source, "resize")) {
    con.source.resize(options);
    // Resize event handlers are already bound above
  } else {
    console.warn(
      "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
    );
  }

  if (hasMethod(con.target, "resize")) {
    con.target.resize(options);
    // Resize event handlers are already bound above
  } else {
    console.warn(
      "svg.resize.js plugin not available. Install @svgdotjs/svg.resize.js to use resize features."
    );
  }

  return con;
}

/**
 * makeInteractive
 * Makes the source and target elements both selectable, draggable and resizable (requires interactive plugins)
 *
 * @name makeInteractive
 * @function
 * @param {Connectable} con The connectable instance
 * @param {Object} selectOptions Options for the select plugin
 * @param {Object} dragOptions Options for the draggable plugin
 * @param {Object} resizeOptions Options for the resize plugin
 * @param {Function} onMakeInteractive Optional callback fired when interactive features are successfully enabled
 * @return {Connectable} The connectable instance.
 */
function makeInteractive(
  con,
  selectOptions,
  dragOptions,
  resizeOptions,
  onMakeInteractive
) {
  // Provide default options if not specified
  selectOptions = selectOptions || {};
  dragOptions = dragOptions || {};
  resizeOptions = resizeOptions || {};

  // Check which plugins are available before applying them
  const availablePlugins = {
    draggable:
      hasMethod(con.source, "draggable") && hasMethod(con.target, "draggable"),
    selectable:
      hasMethod(con.source, "select") && hasMethod(con.target, "select"),
    resizable:
      hasMethod(con.source, "resize") && hasMethod(con.target, "resize"),
  };

  // Initialise dragging first so the draggable plugin captures the primary
  // pointer events before any overlay elements are added by the selector.
  makeDraggable(con, dragOptions);
  makeSelectable(con, selectOptions);
  makeResizable(con, resizeOptions);

  // Call the callback if provided and at least one plugin is available
  if (onMakeInteractive && typeof onMakeInteractive === "function") {
    const hasAnyPlugin =
      availablePlugins.draggable ||
      availablePlugins.selectable ||
      availablePlugins.resizable;
    if (hasAnyPlugin) {
      onMakeInteractive(con, availablePlugins);
    }
  }

  return con;
}

export {
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
};
