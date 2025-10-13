import {
  G,
  Rect,
  Text,
  Element as SVGElement,
  Circle,
  Ellipse,
} from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { ResizeRotate, ResizeRotateOptions } from "./ResizeRotate";
import { Connector, ConnectorOptions } from "./Connector";

export interface NodeOptions {
  id: string;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string;
  textOpacity?: number;
  textXAlign?: "left" | "center" | "right";
  textYAlign?: "top" | "middle" | "bottom";
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  allowDrag?: boolean;
  isLocked?: boolean;
  shape?: "rectangle" | "circle" | "ellipse";
  rotate?: {
    rotationAngle?: number;
  };
  textOffset?: {
    x?: number;
    y?: number;
  };
  resizeRotate?: ResizeRotateOptions;
  connector?: ConnectorOptions;
  svgContent?: string;
  customRender?: (group: G, options: NodeOptions) => void;
}

export class Node {
  public id: string;
  public options: NodeOptions;
  public svgGroup!: G;
  public backgroundRect!: Rect | Circle | Ellipse;
  public textElement!: Text;
  public nestedSvg?: any; // Store reference to nested SVG for SVG content
  public resizeRotate!: ResizeRotate;
  public connector!: Connector;

  // Connection handles for adding new nodes with automatic connections
  private connectionHandles: {
    top?: Circle;
    right?: Circle;
    bottom?: Circle;
    left?: Circle;
    container?: G;
  } = {};
  private connectionHandlesVisible: boolean = false;
  private connectionPreview?: {
    node?: Rect | Circle | Ellipse | any;
    connector?: any;
    container?: G;
  };

  private slate: any; // Will be properly typed when Slate is available
  private isDragging: boolean = false;
  private wasSelectedBeforeDrag: boolean = false;

  constructor(options: NodeOptions, slate: any) {
    this.id = options.id || this.generateId();
    this.slate = slate;

    console.log("NODE_DEBUG: Constructor called", { id: this.id, options });

    // Default options
    this.options = {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      text: "Node",
      fontSize: 14,
      fontFamily: "Arial, sans-serif",
      fontColor: "#000000",
      textOpacity: 1,
      textXAlign: "center",
      textYAlign: "middle",
      backgroundColor: "#f0f0f0",
      borderColor: "#cccccc",
      borderWidth: 1,
      allowDrag: true,
      isLocked: false,
      shape: "rectangle",
      rotate: {
        rotationAngle: 0,
      },
      textOffset: {
        x: 0,
        y: 0,
      },
      resizeRotate: {
        resizeEnabled: true,
        rotateEnabled: true,
        preserveAspectRatio: false,
        aroundCenter: false,
        grid: 0,
        degree: 0,
      },
      ...options,
    };

    console.log("NODE_DEBUG: Calling createAsync for", this.id);
    this.createAsync();
  }

  private generateId(): string {
    return "node_" + Math.random().toString(36).substr(2, 9);
  }

  private async createAsync() {
    console.log("NODE_DEBUG: createAsync started for", this.id);

    try {
      // Wait for viewport to be ready, then create the node
      const viewport = await this.slate.getViewportAsync();
      console.log("NODE_DEBUG: Got viewport for", this.id, viewport);

      this.svgGroup = viewport.group();
      console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup);

      // Continue with the rest of the creation process
      this.finishCreate();
    } catch (error) {
      console.error("NODE_DEBUG: Error in createAsync for", this.id, error);
    }
  }

  private finishCreate() {
    console.log("NODE_DEBUG: finishCreate started for", this.id);

    // If svgContent is provided, use transparent background and skip default text
    const hasSvg = !!this.options.svgContent;
    console.log("NODE_DEBUG: hasSvg =", hasSvg, "for", this.id);

    if (hasSvg) {
      // Force transparent background and no stroke so resize handles still work
      this.options.backgroundColor = "none";
      this.options.borderWidth = 0;
      console.log("NODE_DEBUG: Updated options for SVG content", this.id);
    }

    // Create the background shape (always needed for handles)
    console.log("NODE_DEBUG: About to call createBackground for", this.id);
    this.createBackground();

    // Create the text element only when no custom SVG
    if (!hasSvg) {
      console.log("NODE_DEBUG: About to call createText for", this.id);
      this.createText();
    } else {
      console.log("NODE_DEBUG: Skipping createText (SVG content) for", this.id);
    }

    // Position the node
    console.log(
      "NODE_DEBUG: About to position node",
      this.id,
      "at",
      this.options.x,
      this.options.y
    );
    this.position(this.options.x!, this.options.y!);

    // Render svgContent if provided
    if (this.options.svgContent) {
      const w = this.options.width!;
      const h = this.options.height!;

      // Get background rect position and match it
      const bgX = (this.backgroundRect as any).x?.() ?? 0;
      const bgY = (this.backgroundRect as any).y?.() ?? 0;

      // Store reference to nested SVG for later resizing
      this.nestedSvg = this.svgGroup.nested().size(w, h).move(bgX, bgY);
      this.nestedSvg.svg(this.options.svgContent);

      // Use SVG.js native viewbox method for proper scaling
      setTimeout(() => {
        const content = this.nestedSvg.children()[0] as any;
        if (content) {
          // Try to get bbox first
          let bb = content.bbox();
          console.log("Delayed bbox:", bb, "Node size:", w, h);

          // If bbox is invalid, try getting path bounds from the SVG content string
          if (bb.width <= 0 || bb.height <= 0) {
            bb = this.calculatePathBounds(this.options.svgContent!, w, h);
            console.log("Calculated bounds:", bb);
          }

          if (bb.width > 0 && bb.height > 0) {
            // Use SVG.js native viewbox method to scale content to fit
            this.nestedSvg.viewbox(bb.x, bb.y, bb.width, bb.height);

            // Set preserveAspectRatio to fit the content within bounds
            this.nestedSvg.node.setAttribute(
              "preserveAspectRatio",
              "xMidYMid meet"
            );

            console.log(
              `Set viewbox(${bb.x}, ${bb.y}, ${bb.width}, ${bb.height}) with preserveAspectRatio="xMidYMid meet"`
            );
          } else {
            console.log("Invalid bounds, trying default viewbox approach");
            // Fallback: set a reasonable viewbox for typical icon content
            this.nestedSvg.viewbox(0, 0, 24, 24);
            this.nestedSvg.node.setAttribute(
              "preserveAspectRatio",
              "xMidYMid meet"
            );
          }
        }
      }, 10);
    }

    // Initialize resize/rotate functionality
    this.resizeRotate = new ResizeRotate(this, this.options.resizeRotate);

    // Initialize connector functionality
    this.connector = new Connector(this, this.options.connector);

    // Make draggable if allowed
    if (this.options.allowDrag && !this.options.isLocked) {
      this.makeDraggable();
    }

    // Set up automatic selection behavior
    this.setupSelectionBehavior();

    // Custom render hook (executes after svgContent so it can modify nested)
    if (typeof this.options.customRender === "function") {
      this.options.customRender(this.svgGroup, this.options);
    }

    if (!hasSvg) {
      this.centerTextInitial();
    }

    console.log("NODE_DEBUG: finishCreate continuing for", this.id);
  }

  private createBackground() {
    console.log(
      "NODE_DEBUG: createBackground called for",
      this.id,
      "shape:",
      this.options.shape
    );

    const { width, height, backgroundColor, borderColor, borderWidth, shape } =
      this.options;

    switch (shape) {
      case "circle":
        const radius = Math.min(width!, height!) / 2;
        this.backgroundRect = this.svgGroup
          .circle(radius * 2)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! });
        break;
      case "ellipse":
        this.backgroundRect = this.svgGroup
          .ellipse(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! });
        break;
      default: // rectangle
        this.backgroundRect = this.svgGroup
          .rect(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
          .radius(4); // Slight border radius for better appearance
        break;
    }

    console.log(
      "NODE_DEBUG: createBackground completed for",
      this.id,
      "backgroundRect:",
      this.backgroundRect
    );
  }

  private createText() {
    console.log("NODE_DEBUG: createText called for", this.id);

    const { text, fontSize, fontFamily, fontColor, textOpacity } = this.options;

    this.textElement = this.svgGroup.text(text!).font({
      family: fontFamily!,
      size: fontSize!,
      fill: fontColor!,
      opacity: textOpacity!,
    });

    console.log(
      "NODE_DEBUG: createText completed for",
      this.id,
      "textElement:",
      this.textElement
    );
    this.centerText();
  }

  private centerText() {
    // Skip if no text element (e.g., when using SVG content)
    if (!this.textElement) return;

    const { width, height, textXAlign, textYAlign, textOffset } = this.options;

    const bbox = this.textElement.bbox();

    // Use current shape position inside group when centering
    const shapeX = (this.backgroundRect as any).x?.() ?? 0;
    const shapeY = (this.backgroundRect as any).y?.() ?? 0;

    let x = shapeX + (textOffset!.x || 0);
    let y = shapeY + (textOffset!.y || 0);

    // Horizontal alignment
    switch (textXAlign) {
      case "left":
        x += 5;
        break;
      case "right":
        x += width! - bbox.width - 5;
        break;
      default: // center
        x += (width! - bbox.width) / 2;
        break;
    }

    // Vertical alignment
    switch (textYAlign) {
      case "top":
        y += 5;
        break;
      case "bottom":
        y += height! - bbox.height - 5;
        break;
      default: // middle
        y += (height! - bbox.height) / 2;
        break;
    }

    this.textElement.move(x, y);
  }

  private makeDraggable() {
    // Use svg.draggable.js to make the group draggable
    (this.svgGroup as any).draggable();

    // Add event listeners for drag events with proper namespacing
    this.svgGroup.on("dragstart.node", (event: any) => {
      console.log("DRAG_DEBUG: Drag started on", this.id);

      // Bring to front during drag
      this.toFront();

      // Selection behavior - ensure this node is selected when drag starts
      const isCurrentlySelected = this.slate.getSelectedNodes().includes(this);

      if (!isCurrentlySelected) {
        console.log(
          "SELECTION_DEBUG: Drag started on unselected node",
          this.id,
          "- selecting it"
        );
        // Select this node (which will deselect others)
        this.slate.selectNodes([this], false);
      } else {
        console.log(
          "SELECTION_DEBUG: Drag started on already selected node",
          this.id
        );
      }

      this.isDragging = true;
      this.wasSelectedBeforeDrag = true; // Always true now since we ensure selection

      // Temporarily disable resize/rotate during drag for clean dragging
      // The selection system will handle this through updateSelectionResizeRotate
      this.slate.disableNodeResizeRotate(this);
    });

    this.svgGroup.on("dragend.node", (event: any) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);

      // Update position options
      const bbox = this.svgGroup.bbox();
      this.options.x = bbox.x;
      this.options.y = bbox.y;

      // Small delay to distinguish drag from click - reduced for better responsiveness
      setTimeout(() => {
        this.isDragging = false;

        // Ensure the dragged node remains selected after drag
        const isCurrentlySelected = this.slate
          .getSelectedNodes()
          .includes(this);

        if (!isCurrentlySelected) {
          console.log(
            "SELECTION_DEBUG: Drag ended on unselected node",
            this.id,
            "- selecting it"
          );
          this.slate.selectNodes([this], false);
        } else {
          console.log(
            "SELECTION_DEBUG: Drag ended on selected node",
            this.id,
            "- re-enabling resize/rotate"
          );
          // Re-enable resize/rotate since drag is complete
          this.slate.updateSelectionResizeRotate();
        }
      }, 10); // Reduced from 50ms to 10ms
    });

    // IMPORTANT: Add dragmove event to track dragging state more accurately
    this.svgGroup.on("dragmove.node", (event: any) => {
      // Make sure isDragging is true during drag movements
      this.isDragging = true;
    });
  }

  public position(
    x: number,
    y: number,
    callback?: () => void,
    easing?: any,
    duration?: number
  ) {
    console.log(
      "NODE_DEBUG: position called for",
      this.id,
      "x:",
      x,
      "y:",
      y,
      "duration:",
      duration
    );

    this.options.x = x;
    this.options.y = y;

    if (duration && duration > 0) {
      // Animate to position
      this.svgGroup
        .animate(duration, easing || "-")
        .move(x, y)
        .after(callback || (() => {}));
    } else {
      // Move immediately
      this.svgGroup.move(x, y);
    }

    console.log(
      "NODE_DEBUG: position completed for",
      this.id,
      "svgGroup bbox:",
      this.svgGroup ? this.svgGroup.bbox() : "no group"
    );

    if (callback) callback();
  }

  public toFront() {
    this.svgGroup.front();
  }

  public toBack() {
    this.svgGroup.back();
  }

  public remove() {
    this.svgGroup.remove();
  }

  public hide() {
    this.svgGroup.hide();
  }

  public show() {
    this.svgGroup.show();
  }

  public setText(text: string) {
    // Skip if no text element (e.g., when using SVG content)
    if (!this.textElement) return;

    this.options.text = text;
    this.textElement.text(text);
    this.centerText();
  }

  public setSize(width: number, height: number) {
    this.options.width = width;
    this.options.height = height;

    // Update background - need to check type for proper method
    if (this.backgroundRect instanceof Rect) {
      this.backgroundRect.size(width, height);
    } else if (this.backgroundRect instanceof Circle) {
      const radius = Math.min(width, height) / 2;
      this.backgroundRect.radius(radius);
    } else if (this.backgroundRect instanceof Ellipse) {
      this.backgroundRect.size(width, height);
    }

    // Update nested SVG size using stored reference and SVG.js native methods
    if (this.nestedSvg) {
      const bgX = (this.backgroundRect as any).x?.() ?? 0;
      const bgY = (this.backgroundRect as any).y?.() ?? 0;

      // Use SVG.js native size() and move() methods
      this.nestedSvg.size(width, height).move(bgX, bgY);
    }

    // Re-center text (only if text element exists)
    this.centerText();
  }

  public setColors(backgroundColor?: string, borderColor?: string) {
    if (backgroundColor) {
      this.options.backgroundColor = backgroundColor;
      this.backgroundRect.fill(backgroundColor);
    }

    if (borderColor) {
      this.options.borderColor = borderColor;
      this.backgroundRect.stroke({ color: borderColor });
    }
  }

  public lock() {
    this.options.isLocked = true;
    this.options.allowDrag = false;
    if ((this.svgGroup as any).draggable) {
      (this.svgGroup as any).draggable(false);
    }
    // Disable resize/rotate when locked
    this.disableResizeRotate();
  }

  public unlock() {
    this.options.isLocked = false;
    this.options.allowDrag = true;
    this.makeDraggable();
  }

  // Resize/Rotate functionality - managed by Slate
  public enableResizeRotate() {
    // Delegate to Slate - don't manage directly
    console.log(
      "NODE_DEBUG: enableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    );
    this.slate.enableNodeResizeRotate(this);
  }

  public disableResizeRotate() {
    // Delegate to Slate - don't manage directly
    console.log(
      "NODE_DEBUG: disableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    );
    this.slate.disableNodeResizeRotate(this);
  }

  public enableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: true });
    // Note: Slate manages when to actually enable/disable
  }

  public disableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: false });
    // Note: Slate manages when to actually enable/disable
  }

  public enableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: true });
    // Note: Slate manages when to actually enable/disable
  }

  public disableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: false });
    // Note: Slate manages when to actually enable/disable
  }

  public isResizeRotateEnabled(): boolean {
    return this.resizeRotate.isEnabled();
  }

  public setRotation(angle: number) {
    this.options.rotate!.rotationAngle = angle;
    this.svgGroup.rotate(angle);
  }

  public getRotation(): number {
    // svg.select.js applies rotation to backgroundRect (not svgGroup), so read from there
    try {
      const transform = (this.backgroundRect as any).transform();

      if (transform && typeof transform.rotation !== 'undefined') {
        return transform.rotation;
      }
      if (transform && typeof transform.rotate !== 'undefined') {
        return transform.rotate;
      }
    } catch (e) {
      // Fallback to options if transform reading fails
    }

    return this.options.rotate?.rotationAngle || 0;
  }

  // Connector functionality
  public enableConnector() {
    this.connector.enable();
  }

  public enableConnectorWithInteractive(makeInteractiveCallback?: boolean) {
    console.log(
      "NODE_DEBUG: enableConnectorWithInteractive called for",
      this.id
    );

    // Enable basic connector functionality
    this.connector.enable();

    // Check if svg.connectable.js is available and has makeInteractive
    const svgGroup = this.svgGroup as any;
    if (svgGroup && typeof svgGroup.connectable === "function") {
      console.log(
        "NODE_DEBUG: svg.connectable.js detected, setting up interactive features for",
        this.id
      );

      // Hook into makeInteractive if available
      if (makeInteractiveCallback) {
        // Check if connectable plugin has makeInteractive method
        try {
          // Create a test connection to see if makeInteractive is available
          const testConnection = svgGroup.connectable({}, svgGroup);
          if (
            testConnection &&
            typeof testConnection.makeInteractive === "function"
          ) {
            console.log(
              "NODE_DEBUG: makeInteractive method available, enabling connection handles for",
              this.id
            );

            // Enable connection handles when makeInteractive is called
            this.enableConnectionHandles();

            // Hook into the makeInteractive method with callback
            testConnection.makeInteractive();

            // Clean up test connection
            if (testConnection.connector && testConnection.connector.remove) {
              testConnection.connector.remove();
            }
          } else {
            console.log(
              "NODE_DEBUG: makeInteractive method not available for",
              this.id
            );
          }
        } catch (error) {
          console.warn(
            "NODE_DEBUG: Error testing svg.connectable.js makeInteractive:",
            error
          );
        }
      }
    } else {
      console.log("NODE_DEBUG: svg.connectable.js not available for", this.id);
    }
  }

  public disableConnector() {
    this.connector.disable();
  }

  public connectTo(targetNode: any, connectionOptions?: any) {
    return this.connector.connectTo(targetNode, connectionOptions);
  }

  public disconnectFrom(targetNode: any): boolean {
    return this.connector.disconnectFrom(targetNode);
  }

  public disconnectAll(): void {
    this.connector.disconnectAll();
  }

  public getConnections() {
    return this.connector.getConnections();
  }

  public getConnection(targetNodeId: string) {
    return this.connector.getConnection(targetNodeId);
  }

  public isConnectorEnabled(): boolean {
    return this.connector.isEnabled();
  }

  private centerTextInitial() {
    // Skip if no text element (e.g., when using SVG content)
    if (!this.textElement) return;

    const { width, height, textXAlign, textYAlign, textOffset } = this.options;

    const bbox = this.textElement.bbox();

    // Use current shape position inside group when centering
    const shapeX = (this.backgroundRect as any).x?.() ?? 0;
    const shapeY = (this.backgroundRect as any).y?.() ?? 0;

    let x = shapeX + (textOffset!.x || 0);
    let y = shapeY + (textOffset!.y || 0);

    // Horizontal alignment
    switch (textXAlign) {
      case "left":
        x += 5;
        break;
      case "right":
        x += width! - bbox.width - 5;
        break;
      default: // center
        x += (width! - bbox.width) / 2;
        break;
    }

    // Vertical alignment
    switch (textYAlign) {
      case "top":
        y += 5;
        break;
      case "bottom":
        y += height! - bbox.height - 5;
        break;
      default: // middle
        y += (height! - bbox.height) / 2;
        break;
    }

    this.textElement.move(x, y);
  }

  private calculatePathBounds(
    svgContent: string,
    width: number,
    height: number
  ): { x: number; y: number; width: number; height: number } {
    // Try to extract viewBox from SVG if present
    const viewBoxMatch = svgContent.match(/viewBox=["']([^"']+)["']/);
    if (viewBoxMatch) {
      const viewBoxValues = viewBoxMatch[1].split(/\s+/).map(Number);
      if (viewBoxValues.length === 4) {
        return {
          x: viewBoxValues[0],
          y: viewBoxValues[1],
          width: viewBoxValues[2],
          height: viewBoxValues[3],
        };
      }
    }

    // Try to extract width/height attributes from SVG
    const widthMatch = svgContent.match(/width=["']([^"']+)["']/);
    const heightMatch = svgContent.match(/height=["']([^"']+)["']/);

    if (widthMatch && heightMatch) {
      const svgWidth = parseInt(widthMatch[1]);
      const svgHeight = parseInt(heightMatch[1]);
      if (!isNaN(svgWidth) && !isNaN(svgHeight)) {
        return { x: 0, y: 0, width: svgWidth, height: svgHeight };
      }
    }

    // Fallback: assume common icon size
    return { x: 0, y: 0, width: 24, height: 24 };
  }

  // Selection Management
  private setupSelectionBehavior() {
    // SOLUTION: Use pointerdown/pointerup with position-based click detection
    let clickStartPosition: { x: number; y: number } | null = null;
    const CLICK_THRESHOLD = 5; // pixels - if movement is less than this, it's a click

    this.svgGroup.on("pointerdown", (event: any) => {
      // Skip if clicking on resize/rotate handles
      if (this.isResizeRotateHandle(event.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        return;
      }

      // Record starting position for click detection
      clickStartPosition = {
        x: event.clientX || event.detail?.x || 0,
        y: event.clientY || event.detail?.y || 0,
      };
    });

    this.svgGroup.on("pointerup", (event: any) => {
      // Skip if clicking on resize/rotate handles
      if (this.isResizeRotateHandle(event.target)) {
        console.log(
          "SELECTION_DEBUG: Clicked on resize/rotate handle, skipping selection logic"
        );
        clickStartPosition = null;
        return;
      }

      if (clickStartPosition) {
        const endPosition = {
          x: event.clientX || event.detail?.x || 0,
          y: event.clientY || event.detail?.y || 0,
        };

        const distance = Math.sqrt(
          Math.pow(endPosition.x - clickStartPosition.x, 2) +
            Math.pow(endPosition.y - clickStartPosition.y, 2)
        );

        if (distance <= CLICK_THRESHOLD) {
          console.log(
            "SELECTION_DEBUG: Node clicked (position-based detection)",
            this.id
          );

          // Check for multi-select modifier keys
          const isMultiSelect = event.ctrlKey || event.metaKey;

          // Let Slate handle the selection logic and resize/rotate enabling
          this.slate.selectNodes([this], isMultiSelect);
        }

        clickStartPosition = null;
      }
    });
  }

  // Helper method to identify resize/rotate handles
  private isResizeRotateHandle(target: any): boolean {
    if (!target || !target.classList) return false;

    // Check for common resize/rotate handle classes from svg.select.js and svg.resize.js
    const handleClasses = [
      "svg-select-point",
      "svg-resize-handle",
      "svg_select_handle",
      "svg_select_handle_rot",
      "svg_select_handle_lt",
      "svg_select_handle_rt",
      "svg_select_handle_rb",
      "svg_select_handle_lb",
      "svg_select_handle_t",
      "svg_select_handle_r",
      "svg_select_handle_b",
      "svg_select_handle_l",
      "svg_select_handle_point",
    ];

    // Check if target has any of the handle classes
    for (const className of handleClasses) {
      if (target.classList.contains(className)) {
        return true;
      }
    }

    // Also check data attributes that might be set by the plugins
    if (
      target.getAttribute &&
      (target.getAttribute("data-handle") ||
        target.getAttribute("data-resize") ||
        target.getAttribute("data-rotate"))
    ) {
      return true;
    }

    return false;
  }

  // Selection state management (handled by Slate)
  public onSelected() {
    console.log("SELECTION_DEBUG: Node selected", this.id);
    // Note: Slate now handles resize/rotate enabling
  }

  public onDeselected() {
    console.log("SELECTION_DEBUG: Node deselected", this.id);
    // Note: Slate now handles resize/rotate disabling
  }

  // Connection Handles for New Node Creation
  private createConnectionHandles() {
    if (this.connectionHandles.container) {
      console.log(
        "CONNECTION_HANDLES_DEBUG: Handles already exist for",
        this.id
      );
      return;
    }

    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connection handles for",
      this.id
    );

    // Create container for all connection handles
    this.connectionHandles.container = this.svgGroup.group();

    const handleRadius = 8;
    const handleColor = "#007cff";
    const handleStroke = "#ffffff";
    const handleStrokeWidth = 2;

    // Create four connection handles positioned around the node
    const positions = {
      top: { x: 0, y: -handleRadius - 5 },
      right: { x: handleRadius + 5, y: 0 },
      bottom: { x: 0, y: handleRadius + 5 },
      left: { x: -handleRadius - 5, y: 0 },
    };

    Object.entries(positions).forEach(([direction, offset]) => {
      if (!this.connectionHandles.container) return;

      const handle = this.connectionHandles.container
        .circle(handleRadius * 2)
        .fill(handleColor)
        .stroke({ color: handleStroke, width: handleStrokeWidth })
        .addClass(`connection-handle connection-handle-${direction}`);

      // Set cursor style using DOM node
      handle.node.style.cursor = "pointer";

      // Store reference
      this.connectionHandles[direction as keyof typeof positions] = handle;

      // Add hover effects for preview
      handle.on("mouseenter", () =>
        this.showConnectionPreview(
          direction as "top" | "right" | "bottom" | "left"
        )
      );
      handle.on("mouseleave", () => this.hideConnectionPreview());

      // Add click handler for node creation and connection
      handle.on("click", (event: any) => {
        event.stopPropagation();
        console.log(
          `CONNECTION_HANDLES_DEBUG: ${direction} handle clicked on`,
          this.id
        );

        // Create new connected node
        this.createConnectedNode(
          direction as "top" | "right" | "bottom" | "left"
        );
      });
    });

    // Initially hidden
    if (this.connectionHandles.container) {
      this.connectionHandles.container.hide();
    }
    this.updateConnectionHandlePositions();
  }

  private updateConnectionHandlePositions() {
    if (!this.connectionHandles.container || !this.connectionHandlesVisible)
      return;

    // Get the backgroundRect's bbox and transformation matrix
    // This is the same approach svg.select.js uses for resize handles
    const bbox = this.backgroundRect.bbox();

    // Get transformation matrices
    const elMatrix = (this.backgroundRect as any).screenCTM();
    const rootMatrix = (this.backgroundRect as any).root().screenCTM();
    const fromShapeToUiMatrix = rootMatrix.inverseO().multiplyO(elMatrix);

    // Helper function to transform points (same as svg.select.js transformPoint)
    const transformPoint = ([x, y]: number[], { a, b, c, d, e, f }: any) => {
      return [x * a + y * c + e, x * b + y * d + f];
    };

    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    // Better spacing to avoid overlaps and clear the rotate icon
    const topOffset = 35;
    const sideOffset = 20;

    // Define positions in bbox space (before transformation)
    const bboxPositions = {
      top: [centerX, bbox.y - topOffset],
      right: [bbox.x + bbox.width + sideOffset, centerY],
      bottom: [centerX, bbox.y + bbox.height + sideOffset],
      left: [bbox.x - sideOffset, centerY],
    };

    // Transform each position using the transformation matrix
    Object.entries(bboxPositions).forEach(([direction, pos]) => {
      const handle = this.connectionHandles[direction as keyof typeof bboxPositions];
      if (handle) {
        const [transformedX, transformedY] = transformPoint(pos, fromShapeToUiMatrix);
        handle.center(transformedX, transformedY);
      }
    });
  }

  private showConnectionHandles() {
    if (!this.connectionHandles.container) {
      this.createConnectionHandles();
    }

    console.log(
      "CONNECTION_HANDLES_DEBUG: Showing connection handles for",
      this.id
    );
    this.connectionHandlesVisible = true;
    if (this.connectionHandles.container) {
      this.connectionHandles.container.show();
    }
    this.updateConnectionHandlePositions();
  }

  private hideConnectionHandles() {
    if (!this.connectionHandles.container) return;

    console.log(
      "CONNECTION_HANDLES_DEBUG: Hiding connection handles for",
      this.id
    );
    this.connectionHandlesVisible = false;
    if (this.connectionHandles.container) {
      this.connectionHandles.container.hide();
    }
    this.hideConnectionPreview();
  }

  private showConnectionPreview(
    direction: "top" | "right" | "bottom" | "left"
  ) {
    // Prevent creating duplicate previews
    if (this.connectionPreview?.container) {
      return; // Preview already exists, don't create another
    }

    console.log(
      "CONNECTION_HANDLES_DEBUG: Showing preview for",
      direction,
      "on",
      this.id
    );

    // Clean up existing preview (shouldn't be needed now, but safe)
    this.hideConnectionPreview();

    // Create preview container in ROOT space (not in node's group) to avoid coordinate system issues
    // The node's svgGroup might be rotated, which would interfere with the preview rotation
    const viewport = this.svgGroup.root();
    this.connectionPreview = {
      container: viewport.group().attr("pointer-events", "none"),
    };

    const nodeWidth = this.options.width!;
    const nodeHeight = this.options.height!;
    const spacing = 75; // Reduced spacing for better layout (was 120)

    // Get the current node's rotation angle
    const rotationAngle = this.getRotation();

    // Get the ACTUAL center of the rotated shape (not the bbox center)
    // For rotated shapes, bbox() gives the axis-aligned bounding box which has a different center
    // We need to use rbox() to get the real position after rotation
    const rbox = (this.backgroundRect as any).rbox(this.backgroundRect.root());
    const actualCenterX = rbox.cx;
    const actualCenterY = rbox.cy;

    // Get the connection handle's position (the blue dot that was hovered)
    const handle = this.connectionHandles[direction];
    if (!handle) {
      console.warn("CONNECTION_HANDLES_DEBUG: Handle not found for direction", direction);
      return;
    }

    // Get the handle's center position (the blue dot)
    const handleBBox = handle.bbox();
    const handleCenter = {
      x: handleBBox.x + handleBBox.width / 2,
      y: handleBBox.y + handleBBox.height / 2,
    };

    // Calculate the perpendicular direction from geometry
    // The vector from node center to handle IS the perpendicular direction to that edge
    const dirX = handleCenter.x - actualCenterX;
    const dirY = handleCenter.y - actualCenterY;
    const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);

    // Normalize to unit vector (this is our perpendicular direction)
    const rotatedDirX = dirX / dirLength;
    const rotatedDirY = dirY / dirLength;

    // Calculate edge distance by finding the actual edge position using transformation matrix
    const bbox = this.backgroundRect.bbox();
    const bboxCenterX = bbox.x + bbox.width / 2;
    const bboxCenterY = bbox.y + bbox.height / 2;

    const elMatrix = (this.backgroundRect as any).screenCTM();
    const rootMatrix = (this.backgroundRect as any).root().screenCTM();
    const fromShapeToUiMatrix = rootMatrix.inverseO().multiplyO(elMatrix);

    // Inverse transform the direction vector to bbox space to correctly identify the edge
    const inverseMatrix = fromShapeToUiMatrix.inverse();

    // Transform direction vector (not point) - use matrix without translation
    const bboxDirX = rotatedDirX * inverseMatrix.a + rotatedDirY * inverseMatrix.c;
    const bboxDirY = rotatedDirX * inverseMatrix.b + rotatedDirY * inverseMatrix.d;

    // Now determine which bbox edge based on bbox-space direction
    let bboxEdgeX, bboxEdgeY;
    const absX = Math.abs(bboxDirX);
    const absY = Math.abs(bboxDirY);

    if (absY > absX) {
      // Top or bottom edge in bbox space
      if (bboxDirY < 0) {
        // Top edge
        bboxEdgeX = bboxCenterX;
        bboxEdgeY = bbox.y;
      } else {
        // Bottom edge
        bboxEdgeX = bboxCenterX;
        bboxEdgeY = bbox.y + bbox.height;
      }
    } else {
      // Left or right edge in bbox space
      if (bboxDirX < 0) {
        // Left edge
        bboxEdgeX = bbox.x;
        bboxEdgeY = bboxCenterY;
      } else {
        // Right edge
        bboxEdgeX = bbox.x + bbox.width;
        bboxEdgeY = bboxCenterY;
      }
    }

    // Transform edge position to world space
    const transformPoint = ([x, y]: number[], { a, b, c, d, e, f }: any) => {
      return [x * a + y * c + e, x * b + y * d + f];
    };

    const [worldEdgeX, worldEdgeY] = transformPoint([bboxEdgeX, bboxEdgeY], fromShapeToUiMatrix);

    // Calculate actual edge distance in world space
    const sourceEdgeDistance = Math.sqrt(
      Math.pow(worldEdgeX - actualCenterX, 2) + Math.pow(worldEdgeY - actualCenterY, 2)
    );

    const previewEdgeDistance = sourceEdgeDistance; // Same size and rotation

    // Position preview with consistent edge-to-edge gap
    // Total distance = source center to edge + gap + preview edge to center
    const totalDistance = sourceEdgeDistance + spacing + previewEdgeDistance;

    const newCenterX = actualCenterX + rotatedDirX * totalDistance;
    const newCenterY = actualCenterY + rotatedDirY * totalDistance;
    const newNodeX = newCenterX - nodeWidth / 2;
    const newNodeY = newCenterY - nodeHeight / 2;

    // Ensure container exists
    if (!this.connectionPreview.container) {
      console.warn("CONNECTION_HANDLES_DEBUG: Preview container not found");
      return;
    }

    // Create ghost node preview that mirrors the original node's shape
    this.connectionPreview.node = this.createPreviewShape(
      this.connectionPreview.container,
      newNodeX,
      newNodeY,
      nodeWidth,
      nodeHeight,
      rotationAngle // Pass rotation angle to preview
    );

    // Calculate arrow endpoint to touch the preview node's near edge
    // Preview near edge is at: sourceCenter + direction * (sourceEdgeDistance + spacing)
    // Arrow should extend from handle to this exact point
    const previewNearEdgeDistance = sourceEdgeDistance + spacing;
    const arrowLength = previewNearEdgeDistance - dirLength; // dirLength is distance from center to handle
    const arrowEnd = {
      x: handleCenter.x + rotatedDirX * arrowLength,
      y: handleCenter.y + rotatedDirY * arrowLength,
    };

    // Create the connector line from handle center extending perpendicular to the edge
    this.connectionPreview.connector = this.connectionPreview.container
      .line(handleCenter.x, handleCenter.y, arrowEnd.x, arrowEnd.y)
      .stroke({ color: "#007cff", width: 2, opacity: 0.7 })
      .attr("pointer-events", "none");

    // Add arrowhead at the end of the perpendicular line
    this.addArrowheadToConnector(
      this.connectionPreview.container,
      handleCenter,
      arrowEnd
    );
  }

  private createPreviewShape(
    container: any,
    x: number,
    y: number,
    width: number,
    height: number,
    rotationAngle: number = 0
  ): any {
    let previewNode;
    const fillColor = this.options.backgroundColor || "#007cff"; // Use node's actual color
    const strokeColor = "#ffffff";
    const strokeWidth = 2;
    const opacity = 0.6;

    // Calculate the center point for rotation
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // Mirror the original node's shape
    switch (this.options.shape) {
      case "circle":
        const radius = Math.min(width, height) / 2;
        previewNode = container
          .circle(radius * 2)
          .center(centerX, centerY)
          .fill(fillColor)
          .stroke({ color: strokeColor, width: strokeWidth })
          .opacity(opacity);
        if (rotationAngle !== 0) {
          previewNode.rotate(rotationAngle, centerX, centerY);
        }
        break;

      case "ellipse":
        previewNode = container
          .ellipse(width, height)
          .center(centerX, centerY)
          .fill(fillColor)
          .stroke({ color: strokeColor, width: strokeWidth })
          .opacity(opacity);
        if (rotationAngle !== 0) {
          previewNode.rotate(rotationAngle, centerX, centerY);
        }
        break;

      default: // rectangle or any other shape defaults to rectangle
        if (this.options.svgContent) {
          // For SVG content nodes, create a preview that shows the actual SVG
          previewNode = container
            .rect(width, height)
            .move(x, y)
            .fill("none")
            .stroke({ color: strokeColor, width: strokeWidth })
            .opacity(opacity)
            .radius(4);

          // Create nested SVG with the actual content
          const previewSvg = container.nested().size(width, height).move(x, y);
          previewSvg.svg(this.options.svgContent);

          // Apply the preview styling to the nested content
          setTimeout(() => {
            const content = previewSvg.children()[0] as any;
            if (content) {
              let bb = content.bbox();
              if (bb.width <= 0 || bb.height <= 0) {
                bb = this.calculatePathBounds(
                  this.options.svgContent!,
                  width,
                  height
                );
              }

              if (bb.width > 0 && bb.height > 0) {
                previewSvg.viewbox(bb.x, bb.y, bb.width, bb.height);
                previewSvg.node.setAttribute(
                  "preserveAspectRatio",
                  "xMidYMid meet"
                );
              }

              // Apply blue color and opacity to the SVG content
              content.fill(fillColor).opacity(opacity);
            }
          }, 1);

          previewSvg.attr("pointer-events", "none");

          // Apply rotation if specified
          if (rotationAngle !== 0) {
            previewNode.rotate(rotationAngle, centerX, centerY);
            previewSvg.rotate(rotationAngle, centerX, centerY);
          }
        } else {
          // Regular rectangle node
          previewNode = container
            .rect(width, height)
            .move(x, y)
            .fill(fillColor)
            .stroke({ color: strokeColor, width: strokeWidth })
            .opacity(opacity)
            .radius(4);

          // Apply rotation if specified
          if (rotationAngle !== 0) {
            previewNode.rotate(rotationAngle, centerX, centerY);
          }
        }
        break;
    }

    return previewNode.attr("pointer-events", "none");
  }

  private addArrowheadToConnector(
    container: any,
    start: { x: number; y: number },
    end: { x: number; y: number }
  ) {
    // Calculate arrow direction
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);

    if (length === 0) return;

    // Normalize direction
    const unitX = dx / length;
    const unitY = dy / length;

    // Arrow size
    const arrowLength = 12;
    const arrowWidth = 6;

    // Position arrowhead at the end of the line
    const arrowTipX = end.x;
    const arrowTipY = end.y;

    // Calculate arrow base points
    const baseX = arrowTipX - unitX * arrowLength;
    const baseY = arrowTipY - unitY * arrowLength;

    // Perpendicular vector for arrow width
    const perpX = -unitY * arrowWidth;
    const perpY = unitX * arrowWidth;

    // Arrow points
    const arrowPoints = [
      [arrowTipX, arrowTipY],
      [baseX + perpX, baseY + perpY],
      [baseX - perpX, baseY - perpY],
      [arrowTipX, arrowTipY],
    ];

    // Create arrowhead
    container
      .polygon(arrowPoints)
      .fill("#007cff")
      .opacity(0.8)
      .attr("pointer-events", "none");
  }

  private hideConnectionPreview() {
    if (this.connectionPreview?.container) {
      this.connectionPreview.container.remove();
      this.connectionPreview = undefined;
    }
  }

  public enableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: enableConnectionHandles called for",
      this.id
    );
    this.showConnectionHandles();
  }

  public disableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: disableConnectionHandles called for",
      this.id
    );
    this.hideConnectionHandles();
  }

  public isConnectionHandlesEnabled(): boolean {
    return this.connectionHandlesVisible;
  }

  private getNodeEdgePoint(
    bbox: any,
    direction: "top" | "right" | "bottom" | "left"
  ): { x: number; y: number } {
    const centerX = bbox.x + bbox.width / 2;
    const centerY = bbox.y + bbox.height / 2;

    // Calculate edge points based on node shape and direction
    switch (direction) {
      case "top":
        return { x: centerX, y: bbox.y };
      case "right":
        return { x: bbox.x + bbox.width, y: centerY };
      case "bottom":
        return { x: centerX, y: bbox.y + bbox.height };
      case "left":
        return { x: bbox.x, y: centerY };
    }
  }

  private createConnectedNode(
    direction: "top" | "right" | "bottom" | "left"
  ): void {
    console.log(
      "CONNECTION_HANDLES_DEBUG: Creating connected node in direction",
      direction,
      "from",
      this.id
    );

    try {
      // Calculate position for new node (same as preview calculation)
      const nodeWidth = this.options.width!;
      const nodeHeight = this.options.height!;
      const spacing = 75;

      // Get the current node's rotation angle
      const rotationAngle = this.getRotation();
      const rotationRad = (rotationAngle * Math.PI) / 180;

      // Calculate direction vector in the rotated coordinate space
      let dirX = 0, dirY = 0;
      switch (direction) {
        case "top":
          dirX = 0;
          dirY = -1;
          break;
        case "right":
          dirX = 1;
          dirY = 0;
          break;
        case "bottom":
          dirX = 0;
          dirY = 1;
          break;
        case "left":
          dirX = -1;
          dirY = 0;
          break;
      }

      // Rotate the direction vector by the node's rotation angle
      const rotatedDirX = dirX * Math.cos(rotationRad) - dirY * Math.sin(rotationRad);
      const rotatedDirY = dirX * Math.sin(rotationRad) + dirY * Math.cos(rotationRad);

      // Get the ACTUAL center of the rotated shape (not the bbox center)
      const rbox = (this.backgroundRect as any).rbox(this.backgroundRect.root());
      const actualCenterX = rbox.cx;
      const actualCenterY = rbox.cy;

      // Calculate new node position based on rotated direction
      // Use transformation matrix to get accurate edge distance (accounts for rotation)

      const bbox = this.backgroundRect.bbox();
      const bboxCenterX = bbox.x + bbox.width / 2;
      const bboxCenterY = bbox.y + bbox.height / 2;

      // Find the bbox edge position based on direction
      let bboxEdgeX, bboxEdgeY;
      switch (direction) {
        case 'top':
          bboxEdgeX = bboxCenterX;
          bboxEdgeY = bbox.y;
          break;
        case 'right':
          bboxEdgeX = bbox.x + bbox.width;
          bboxEdgeY = bboxCenterY;
          break;
        case 'bottom':
          bboxEdgeX = bboxCenterX;
          bboxEdgeY = bbox.y + bbox.height;
          break;
        case 'left':
          bboxEdgeX = bbox.x;
          bboxEdgeY = bboxCenterY;
          break;
      }

      // Transform edge position to world space
      const elMatrix = (this.backgroundRect as any).screenCTM();
      const rootMatrix = (this.backgroundRect as any).root().screenCTM();
      const fromShapeToUiMatrix = rootMatrix.inverseO().multiplyO(elMatrix);

      const transformPoint = ([x, y]: number[], { a, b, c, d, e, f }: any) => {
        return [x * a + y * c + e, x * b + y * d + f];
      };

      const [worldEdgeX, worldEdgeY] = transformPoint([bboxEdgeX, bboxEdgeY], fromShapeToUiMatrix);

      // Calculate actual edge distance in world space
      const sourceEdgeDistance = Math.sqrt(
        Math.pow(worldEdgeX - actualCenterX, 2) + Math.pow(worldEdgeY - actualCenterY, 2)
      );

      const newNodeEdgeDistance = sourceEdgeDistance; // Same size and rotation

      // Position with consistent edge-to-edge gap
      // Total distance = source center to edge + gap + new node edge to center
      const totalDistance = sourceEdgeDistance + spacing + newNodeEdgeDistance;

      const newCenterX = actualCenterX + rotatedDirX * totalDistance;
      const newCenterY = actualCenterY + rotatedDirY * totalDistance;
      const newNodeX = newCenterX - nodeWidth / 2;
      const newNodeY = newCenterY - nodeHeight / 2;

      // Clone the current node's options for the new node (including rotation)
      const newNodeOptions = this.cloneNodeOptions(newNodeX, newNodeY, rotationAngle);

      // Create the new node via Slate
      const newNode = this.slate.addNode(newNodeOptions);

      if (!newNode) {
        console.error("CONNECTION_HANDLES_DEBUG: Failed to create new node");
        return;
      }

      console.log(
        "CONNECTION_HANDLES_DEBUG: Created new node",
        newNode.id,
        "at",
        newNodeX,
        newNodeY
      );

      // Hide the preview and handles before creating connection
      this.hideConnectionPreview();

      // Wait a moment for the new node to be fully created, then connect
      setTimeout(() => {
        this.connectToNode(newNode);
      }, 100);
    } catch (error) {
      console.error(
        "CONNECTION_HANDLES_DEBUG: Error creating connected node:",
        error
      );
    }
  }

  private cloneNodeOptions(x: number, y: number, rotationAngle?: number): any {
    // Generate unique ID for the new node
    const newId = "node_" + Math.random().toString(36).substr(2, 9);

    // Clone most options from current node but with new position and ID
    const options: any = {
      ...this.options,
      id: newId,
      x: x,
      y: y,
      text: `Node ${newId.split("_")[1]}`, // Give it a different default text
      // Keep the same visual properties (shape, color, size, etc.)
    };

    // Apply rotation angle if provided
    if (rotationAngle !== undefined && rotationAngle !== 0) {
      options.rotate = {
        ...options.rotate,
        rotationAngle: rotationAngle,
      };
    }

    return options;
  }

  private connectToNode(targetNode: any): void {
    if (!this.connector.isEnabled()) {
      console.log("CONNECTION_HANDLES_DEBUG: Enabling connector for", this.id);
      this.connector.enable();
    }

    console.log(
      "CONNECTION_HANDLES_DEBUG: Connecting",
      this.id,
      "to",
      targetNode.id
    );

    // Create connection using the Connector class which will use svg.connectable.js
    const connection = this.connector.connectTo(targetNode);

    if (connection) {
      console.log(
        "CONNECTION_HANDLES_DEBUG: Successfully created connection",
        connection.id
      );
    } else {
      console.error("CONNECTION_HANDLES_DEBUG: Failed to create connection");
    }
  }
}
