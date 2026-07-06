import {
  G,
  Rect,
  Text,
  Element as SVGElement,
  Circle,
  Ellipse,
  Path,
} from "@svgdotjs/svg.js";

import "@svgdotjs/svg.draggable.js";
import { ResizeRotate, ResizeRotateOptions } from "./ResizeRotate";
import type { Slate } from "./Slate";
import { Connector, ConnectorOptions } from "./Connector";
import { Relationships } from "./Relationships";
import { Images } from "./Images";
import { Editor } from "./Editor";
import { Links } from "./Links";
import { Filters } from "./Filters";
import { Menu } from "./Menu";
import { resolveShapePath, isNativeShape } from "./ShapeRegistry";
import { v2NodeToV1 } from "./compat";

export interface NodeLinkOptions {
  show?: boolean;
  type?: "url" | "currentSlate" | "externalSlate";
  data?: string;
  thumbnail?: string;
}

export interface NodeFilterOptions {
  vect?: string;
  text?: string;
}

export interface NodeAnimationOptions {
  vect?: string;
  text?: string;
}

export interface NodeAIOptions {
  textToChildNodes?: any;
  textToImage?: any;
}

export interface NodeOptions {
  id: string;

  // Position (v1 compat: xPos/yPos mapped via compat layer)
  x?: number;
  y?: number;

  // Dimensions
  width?: number;
  height?: number;

  // Identity
  name?: string;
  groupId?: string;

  // Text content
  text?: string;
  fontSize?: number;
  fontFamily?: string;
  fontColor?: string; // v1 compat: foregroundColor mapped via compat layer
  textOpacity?: number;
  textXAlign?: "left" | "center" | "right";
  textYAlign?: "top" | "middle" | "bottom";
  textOffset?: {
    x?: number;
    y?: number;
  };

  // Appearance
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderStyle?: "solid" | "dashed" | "dotted";
  borderOpacity?: number;
  borderDisplayOnly?: boolean;
  opacity?: number;

  // Shape (v1 compat: shapeHint mapped via compat layer)
  shape?: string; // "rectangle" | "circle" | "ellipse" | named shapes from ShapeRegistry
  vectorPath?: string; // SVG path string or named shape key
  shapeHint?: string; // v1 compat: maps to shape via adapter

  // SVG content
  svgContent?: string;
  svgString?: string; // v1 compat alias for svgContent

  // Image
  image?: string;
  imageOrigWidth?: number;
  imageOrigHeight?: number;

  // Line properties (for connections originating from this node)
  lineColor?: string;
  lineOpacity?: number;
  lineEffect?: string;
  lineType?: "bezier" | "linear" | "straight";
  lineCurveType?: "cubic" | "quadratic";
  lineCurviness?: number;
  lineWidth?: number;

  // Behavior flags
  allowDrag?: boolean;
  isLocked?: boolean;
  disableDrag?: boolean;
  allowMenu?: boolean;
  allowContext?: boolean;
  allowResize?: boolean;

  // Menu tab visibility
  showDelete?: boolean;
  showAdd?: boolean;
  showResize?: boolean;
  showRotate?: boolean;
  showMenu?: boolean;
  showColorTab?: boolean;
  showTextTab?: boolean;
  showAITab?: boolean;
  showShapeTab?: boolean;
  showImageTab?: boolean;
  showEffectTab?: boolean;

  // Relationship UI flags
  showRelationshipConnector?: boolean;
  showRelationshipDelete?: boolean;
  showRelationshipProperties?: boolean;
  showRelationshipReassign?: boolean;
  showAddAndDeleteConditionally?: boolean;
  spaceBetweenNodesWhenAdding?: number;
  disableMenuAsTemplate?: boolean;

  // Special node types
  isComment?: boolean;
  isCategory?: boolean;
  categoryName?: string;
  humanTouch?: boolean;

  // Display helpers
  iconFor?: string;
  defaultShaped?: boolean;
  pinUnderneath?: boolean;

  // Rotation
  rotate?: {
    rotationAngle?: number;
  };

  // Sub-systems
  resizeRotate?: ResizeRotateOptions;
  connector?: ConnectorOptions;

  // Link
  link?: NodeLinkOptions;

  // Filters & Effects
  filters?: NodeFilterOptions;

  // Animations
  animations?: NodeAnimationOptions;

  // AI
  ai?: NodeAIOptions;

  // Custom render hook
  customRender?: (group: G, options: NodeOptions) => void;
}

export class Node {
  public id: string;
  public options: NodeOptions;
  public svgGroup!: G;
  public backgroundRect!: Rect | Circle | Ellipse | G;
  /**
   * For path (vector) shapes, backgroundRect is the nested <svg> wrapper used for
   * sizing/handles; the actual fill/stroke live on this inner <path>. Undefined
   * for native rect/circle/ellipse (where backgroundRect carries fill/stroke).
   */
  public contentPath?: any;
  public textElement!: Text;
  public nestedSvg?: any; // Store reference to nested SVG for SVG content
  public resizeRotate!: ResizeRotate;
  public connector!: Connector;
  public relationships!: Relationships;
  public images!: Images;
  public editor!: Editor;
  public links!: Links;
  public filters!: Filters;
  public menu!: Menu;

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

  public slate: Slate; // type-only import — accessed by sub-modules (Connector, Editor, etc.)
  private isDragging: boolean = false;
  private wasSelectedBeforeDrag: boolean = false;
  private preDragTransform: { translateX: number; translateY: number } | null = null;
  private preDragPosition: { x: number; y: number } | null = null;
  // Pointer position (client coords) at drag start — drag is positioned from the
  // pointer delta in world units so rotation never distorts the movement.
  private _dragStartPointer: { x: number; y: number } | null = null;

  /** Resolves when the node is fully created (SVG elements, connector, relationships, etc.) */
  public ready: Promise<void>;
  private _lastClickTime = 0;
  private _resolveReady!: () => void;
  private _rejectReady!: (reason?: unknown) => void;
  private _initFailed: boolean = false;
  private _destroyed: boolean = false;
  private _svgViewboxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _dragEndTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _previewViewboxTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _connectTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Creates a new diagram node.
   *
   * Nodes support two mutually exclusive content types: text content (default)
   * and SVG content (when `options.svgContent` is set). The node is created
   * asynchronously — await `node.ready` before using sub-modules.
   *
   * @param options - Node configuration (position, size, shape, text, colors, etc.)
   * @param slate  - The parent Slate instance
   *
   * @example
   * ```ts
   * const node = slate.addNode({
   *   x: 100, y: 100, width: 120, height: 80,
   *   text: 'Hello', shape: 'rectangle', backgroundColor: '#4ecdc4'
   * });
   * await node.ready;
   * node.setRotation(45);
   * ```
   */
  constructor(options: NodeOptions, slate: Slate) {
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
      // v1 UI-affordance defaults — host apps gate their node UI (drawer
      // tabs, delete/add buttons, relationship controls) on these flags
      showDelete: true,
      showResize: true,
      showAdd: true,
      showRotate: true,
      showMenu: true,
      showColorTab: true,
      showTextTab: true,
      showAITab: true,
      showShapeTab: true,
      showImageTab: true,
      showEffectTab: true,
      showRelationshipConnector: true,
      showRelationshipDelete: true,
      showRelationshipProperties: true,
      showRelationshipReassign: true,
      allowMenu: true,
      allowContext: true,
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

    this.ready = new Promise<void>((resolve, reject) => {
      this._resolveReady = resolve;
      this._rejectReady = reject;
    });

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
      // Add data-node-id attribute for test selectors
      this.svgGroup.attr('data-node-id', this.id);
      // Accessibility: make nodes focusable and readable by screen readers
      this.svgGroup.node.setAttribute("tabindex", "0");
      this.svgGroup.node.setAttribute("role", "button");
      console.log("NODE_DEBUG: Created svgGroup for", this.id, this.svgGroup);

      // Continue with the rest of the creation process
      this.finishCreate();
    } catch (error) {
      console.error("NODE_DEBUG: Error in createAsync for", this.id, error);
      this._initFailed = true;
      this._rejectReady(error);
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
      this._svgViewboxTimeoutId = setTimeout(() => {
        if (this._destroyed || !this.nestedSvg) return;
        const content = this.nestedSvg.children()[0] as any;
        if (content) {
          // Try to get bbox first
          let bb = content.bbox();
          console.log("NODE_DEBUG: Delayed bbox:", bb, "Node size:", w, h);

          // If bbox is invalid, try getting path bounds from the SVG content string
          if (bb.width <= 0 || bb.height <= 0) {
            bb = this.calculatePathBounds(this.options.svgContent!, w, h);
            console.log("NODE_DEBUG: Calculated bounds:", bb);
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
              `NODE_DEBUG: Set viewbox(${bb.x}, ${bb.y}, ${bb.width}, ${bb.height}) with preserveAspectRatio="xMidYMid meet"`
            );
          } else {
            console.log("NODE_DEBUG: Invalid bounds, trying default viewbox approach");
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
    // Circles must preserve aspect ratio to stay circular
    const resizeRotateOpts = { ...this.options.resizeRotate };
    if (this.options.shape === "circle") {
      resizeRotateOpts.preserveAspectRatio = true;
    }
    this.resizeRotate = new ResizeRotate(this, resizeRotateOpts);

    // Initialize connector functionality
    this.connector = new Connector(this, this.options.connector);

    // Initialize relationships (parent-child association management)
    this.relationships = new Relationships(this);

    // Initialize images (image fill support)
    this.images = new Images(this);

    // Initialize editor (text editing integration)
    this.editor = new Editor(this);

    // Initialize links (URL, slate links)
    this.links = new Links(this);

    // Initialize filters (visual effects)
    this.filters = new Filters(this);

    // Initialize menu (context menu system)
    this.menu = new Menu(this);

    // Apply image if specified in options
    if (this.options.image) {
      this.images.set(
        this.options.image,
        this.options.imageOrigWidth,
        this.options.imageOrigHeight
      );
    }

    // Apply filters if specified in options
    if (this.options.filters?.vect) {
      this.filters.apply(this.options.filters.vect, "vect");
    }
    if (this.options.filters?.text) {
      this.filters.apply(this.options.filters.text, "text");
    }

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

    // Apply initial rotation if specified in options
    if (this.options.rotate?.rotationAngle) {
      this.applyPositionAndRotation();
    }

    console.log("NODE_DEBUG: finishCreate continuing for", this.id);

    // Set initial accessibility label from node text
    this.svgGroup.node.setAttribute("aria-label", this.options.text || "Unnamed node");

    // Keep connector arrowheads above nodes (M4): a node added after existing
    // connections must not cover their arrowheads.
    try {
      (this.slate as any).markersContainer?.front?.();
    } catch (e) {
      /* noop */
    }

    // Signal that the node is fully created
    this._resolveReady();
  }

  private createBackground() {
    console.log(
      "NODE_DEBUG: createBackground called for",
      this.id,
      "shape:",
      this.options.shape
    );

    const {
      width,
      height,
      backgroundColor,
      borderColor,
      borderWidth,
      borderStyle,
      borderOpacity,
      shape,
      vectorPath,
      opacity,
    } = this.options;

    // Build stroke options. borderStyle → dasharray uses the shared mapping so
    // the app's symbol styles ('-', '.', '--.') survive a reload (deserialize).
    const strokeOpts: { color: string; width: number; dasharray?: string; opacity?: number } = { color: borderColor!, width: borderWidth! };
    void borderStyle; // consumed via borderDashArray()
    const dash = this.borderDashArray();
    if (dash !== "none") {
      strokeOpts.dasharray = dash;
    }
    if (borderOpacity !== undefined) {
      strokeOpts.opacity = borderOpacity;
    }

    // Try to resolve a named shape or vector path
    const shapeDef = resolveShapePath(shape, vectorPath);

    if (shapeDef && !isNativeShape(shape || "")) {
      // Render as SVG path — use a nested SVG with viewBox for proper scaling
      const nested = this.svgGroup
        .nested()
        .size(width!, height!);

      const pathEl = nested
        .path(shapeDef.path)
        .fill(backgroundColor!)
        .stroke(strokeOpts);

      // Compute viewBox from the actual path bounds (handles absolute-coordinate paths from v1)
      try {
        const bb = pathEl.bbox();
        if (bb.width > 0 && bb.height > 0) {
          nested.viewbox(bb.x, bb.y, bb.width, bb.height);
        } else {
          nested.viewbox(shapeDef.viewBox);
        }
      } catch {
        nested.viewbox(shapeDef.viewBox);
      }

      if (opacity !== undefined) {
        pathEl.opacity(opacity);
      }

      // Store the nested SVG as backgroundRect for compatibility
      // The nested element is used for bbox calculations and selection handles
      this.backgroundRect = nested as any;
      // The inner path carries fill/stroke — style it (not the nested wrapper).
      this.contentPath = pathEl;
    } else {
      // Native shapes — fast path
      this.contentPath = undefined;
      switch (shape) {
        case "circle": {
          const radius = Math.min(width!, height!) / 2;
          this.backgroundRect = this.svgGroup
            .circle(radius * 2)
            .fill(backgroundColor!)
            .stroke(strokeOpts);
          break;
        }
        case "ellipse":
          this.backgroundRect = this.svgGroup
            .ellipse(width!, height!)
            .fill(backgroundColor!)
            .stroke(strokeOpts);
          break;
        default: // rectangle
          this.backgroundRect = this.svgGroup
            .rect(width!, height!)
            .fill(backgroundColor!)
            .stroke(strokeOpts)
            .radius(4);
          break;
      }

      if (opacity !== undefined) {
        this.backgroundRect.opacity(opacity);
      }
    }

    console.log(
      "NODE_DEBUG: createBackground completed for",
      this.id,
      "backgroundRect:",
      this.backgroundRect
    );
  }

  /**
   * Change the node's shape at runtime (U5). `shape` may be a named shape or a
   * raw SVG path string. Removes the old shape element, re-renders the new one
   * behind the text/content, and re-binds selection so resize/rotate follow the
   * new shape. No-op for SVG-content nodes.
   */
  public setShape(shape: string, vectorPath?: string): void {
    if (!this.svgGroup || this.nestedSvg) return; // SVG-content nodes have no shape
    const wasSelected =
      !!this.resizeRotate && this.resizeRotate.isEnabled();
    try {
      if (wasSelected) this.resizeRotate.disable();
    } catch (e) {
      /* noop */
    }
    try {
      (this.backgroundRect as any)?.remove?.();
    } catch (e) {
      /* noop */
    }
    this.backgroundRect = undefined as any;

    this.options.shape = shape;
    if (vectorPath !== undefined) this.options.vectorPath = vectorPath;

    this.createBackground();
    // Keep the shape behind the text and any other content.
    try {
      (this.backgroundRect as any)?.back?.();
    } catch (e) {
      /* noop */
    }
    try {
      this.centerText();
    } catch (e) {
      /* noop */
    }
    this.applyPositionAndRotation();
    // Re-bind resize/rotate + handles to the new shape via the orchestrator.
    try {
      if (wasSelected) this.slate?.updateSelectionResizeRotate?.();
    } catch (e) {
      /* noop */
    }
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

    // Use SVG native text anchoring for reliable centering
    this.textElement.attr({
      'text-anchor': 'middle',
      'dominant-baseline': 'central',
    });

    console.log(
      "NODE_DEBUG: createText completed for",
      this.id,
      "textElement:",
      this.textElement
    );
    this.centerText();
  }

  /**
   * Re-apply font (size / family / color / opacity) from options to the text
   * element and re-center for alignment. The text pane sends font changes via
   * onNodeTextChanged; without this they only updated options, never the render.
   */
  public applyTextStyle(): void {
    if (!this.textElement) return;
    const { fontSize, fontFamily, fontColor, textOpacity } = this.options;
    this.textElement.font({
      family: fontFamily!,
      size: fontSize!,
      fill: fontColor!,
      opacity: textOpacity!,
    });
    this.centerText();
  }

  /** Position the text element within the background shape based on alignment settings. */
  public centerText() {
    // Skip if no text element (e.g., when using SVG content)
    if (!this.textElement) return;

    const { width, height, textXAlign, textYAlign, textOffset } = this.options;

    // Get the background shape's position within the group
    const shapeX = (this.backgroundRect as any).x?.() ?? 0;
    const shapeY = (this.backgroundRect as any).y?.() ?? 0;

    // Since text-anchor="middle" and dominant-baseline="central",
    // we position the text at the CENTER of the shape and SVG handles the rest
    let x = shapeX + width! / 2 + (textOffset?.x || 0);
    let y = shapeY + height! / 2 + (textOffset?.y || 0);

    // Horizontal alignment adjustments
    switch (textXAlign) {
      case "left":
        x = shapeX + 5 + (textOffset?.x || 0);
        this.textElement.attr('text-anchor', 'start');
        break;
      case "right":
        x = shapeX + width! - 5 + (textOffset?.x || 0);
        this.textElement.attr('text-anchor', 'end');
        break;
      default: // center
        this.textElement.attr('text-anchor', 'middle');
        break;
    }

    // Vertical alignment adjustments
    switch (textYAlign) {
      case "top":
        y = shapeY + 5 + (textOffset?.y || 0);
        this.textElement.attr('dominant-baseline', 'hanging');
        break;
      case "bottom":
        y = shapeY + height! - 5 + (textOffset?.y || 0);
        this.textElement.attr('dominant-baseline', 'auto');
        break;
      default: // middle
        this.textElement.attr('dominant-baseline', 'central');
        break;
    }

    // Use x/y attributes directly for proper text-anchor behavior
    this.textElement.attr({ x, y });
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

      // Check for multi-select modifier keys from the original pointer/mouse event
      const origEvt = event.detail?.event || event;
      const isMultiSelect = origEvt?.ctrlKey || origEvt?.metaKey;

      if (!isCurrentlySelected) {
        console.log(
          "SELECTION_DEBUG: Drag started on unselected node",
          this.id,
          "- selecting it, addToSelection:",
          isMultiSelect
        );
        // Select this node (respect Ctrl/Meta for multi-select)
        this.slate.selectNodes([this], isMultiSelect);
      } else {
        console.log(
          "SELECTION_DEBUG: Drag started on already selected node",
          this.id
        );
      }

      this.isDragging = true;
      this.wasSelectedBeforeDrag = true; // Always true now since we ensure selection

      // Store the transform at drag start so we can calculate drag delta later
      const transform = this.svgGroup.transform();
      this.preDragTransform = {
        translateX: transform.translateX || 0,
        translateY: transform.translateY || 0
      };

      // CRITICAL: Store the actual position using this.options which is the stored logical position
      // Don't use svgGroup.x() which returns transformed bbox for rotated groups
      // Don't use backgroundRect.bbox() which returns local coords (0,0) relative to group
      this.preDragPosition = {
        x: this.options.x ?? 0,
        y: this.options.y ?? 0
      };
      // Capture the pointer position so dragmove can position the node from the
      // pointer delta (world units) rather than svg.draggable's child-move,
      // which distorts under a group rotation.
      this._dragStartPointer = this.pointerFromDragEvent(event);
      console.log("DRAG_DEBUG: Stored pre-drag transform:", this.preDragTransform, "position:", this.preDragPosition);

      // Temporarily disable resize/rotate during drag for clean dragging
      // The selection system will handle this through updateSelectionResizeRotate
      this.slate.disableNodeResizeRotate(this);
      // Hide the cog during drag; it re-shows at the new spot on drag end.
      this.hideNodeCog();
    });

    this.svgGroup.on("dragend.node", (event: any) => {
      console.log("DRAG_DEBUG: Drag ended on", this.id);

      // options.x/y were kept current by the controlled dragmove handler
      // (pointer delta in world units), so no box math is needed here. As a
      // fallback for environments that fire dragend without any dragmove, apply
      // the final pointer delta if we have one.
      const ptr = this.pointerFromDragEvent(event);
      if (ptr && this._dragStartPointer && this.preDragPosition) {
        const zoom = this.slate.getZoom?.() || 1;
        this.options.x =
          this.preDragPosition.x + (ptr.x - this._dragStartPointer.x) / zoom;
        this.options.y =
          this.preDragPosition.y + (ptr.y - this._dragStartPointer.y) / zoom;
      }

      // Clear pre-drag state
      this.preDragTransform = null;
      this.preDragPosition = null;
      this._dragStartPointer = null;

      // Re-assert the canonical model: children at local origin, group transform
      // carrying position (+ rotation).
      this.applyPositionAndRotation();

      // Notify the host app of the completed move (v1 package shape)
      this.slate.broadcast?.("onNodesMove", {
        nodeOptions: [v2NodeToV1(this.options)],
      });

      // Small delay to distinguish drag from click - reduced for better responsiveness
      this._dragEndTimeoutId = setTimeout(() => {
        if (this._destroyed) return;
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

        // Notify slate of node position change (for BirdsEye refresh)
        this.slate.notifyNodeChanged(this);
      }, 10); // Reduced from 50ms to 10ms
    });

    // Controlled drag: position the node from the POINTER delta in world units,
    // preserving rotation, instead of svg.draggable's default child-move (which
    // is computed in the group's rotated local frame → the node flies wildly
    // when a rotated node is dragged). We preventDefault to suppress the default
    // move and drive the transform ourselves via applyPositionAndRotation.
    this.svgGroup.on("dragmove.node", (event: any) => {
      this.isDragging = true;
      const ptr = this.pointerFromDragEvent(event);
      if (ptr && this._dragStartPointer && this.preDragPosition) {
        event.preventDefault?.();
        const zoom = this.slate.getZoom?.() || 1;
        const dx = (ptr.x - this._dragStartPointer.x) / zoom;
        const dy = (ptr.y - this._dragStartPointer.y) / zoom;
        this.options.x = this.preDragPosition.x + dx;
        this.options.y = this.preDragPosition.y + dy;
        this.applyPositionAndRotation();
        // svg.draggable raises the dragged node to front, which would push
        // connector arrowheads behind it (Q1). Keep markers on top each frame.
        try {
          (this.slate as any).markersContainer?.front?.();
        } catch (e) {
          /* noop */
        }
      }
    });
  }

  /**
   * Extract the pointer position in client coordinates from an svg.draggable
   * event (or a raw DOM event). svg.draggable exposes the source event at
   * event.detail.event; touch events carry it under touches/changedTouches.
   */
  private pointerFromDragEvent(event: any): { x: number; y: number } | null {
    const src = event?.detail?.event ?? event;
    if (!src) return null;
    const pt =
      src.touches?.[0] ?? src.changedTouches?.[0] ?? src;
    if (typeof pt.clientX === "number" && typeof pt.clientY === "number") {
      return { x: pt.clientX, y: pt.clientY };
    }
    return null;
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

    const startX = this.options.x ?? x;
    const startY = this.options.y ?? y;
    this.options.x = x;
    this.options.y = y;

    const canAnimate =
      !!duration &&
      duration > 0 &&
      typeof requestAnimationFrame !== "undefined" &&
      typeof performance !== "undefined" &&
      (startX !== x || startY !== y);

    if (canAnimate) {
      // Tween options.x/y and re-apply the group transform each frame. We do NOT
      // use svg.js animate().move(): that animates the shape's CHILDREN in the
      // group's local frame, so on a ROTATED node the movement is computed
      // through the rotation and the node flies wildly before landing (seen on
      // the mirrored/collab canvas). Driving applyPositionAndRotation() keeps
      // rotation intact and moves the node in a straight world-space line.
      const t0 = performance.now();
      const step = () => {
        if (this._destroyed || !this.svgGroup) return;
        const p = Math.min(1, (performance.now() - t0) / (duration as number));
        // easeInOutQuad
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        this.options.x = startX + (x - startX) * e;
        this.options.y = startY + (y - startY) * e;
        this.applyPositionAndRotation();
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          this.options.x = x;
          this.options.y = y;
          this.applyPositionAndRotation();
          if (callback) callback();
        }
      };
      requestAnimationFrame(step);
    } else {
      // Move immediately (translate + rotate composed)
      this.applyPositionAndRotation();
      if (callback) callback();
    }
  }

  /** Bring the node to the front of the SVG z-order. */
  public toFront() {
    this.svgGroup.front();
    this.slate.broadcast?.("onNodeToFront", { id: this.id });
  }

  /** Send the node to the back of the SVG z-order. */
  public toBack() {
    this.svgGroup.back();
    this.slate.broadcast?.("onNodeToBack", { id: this.id });
  }

  /**
   * Remove the node from the canvas (light teardown).
   * Cleans up DOM elements but does NOT disable sub-modules. Use `destroy()` for full teardown.
   */
  public remove() {
    // Clean up connection handles container (created on slate.canvas, not in svgGroup)
    if (this.connectionHandles.container) {
      this.connectionHandles.container.remove();
      this.connectionHandles.container = undefined;
    }
    // Clean up connection preview container
    if (this.connectionPreview?.container) {
      this.connectionPreview.container.remove();
      this.connectionPreview.container = undefined;
    }
    // Remove the main SVG group (cleans up all child elements and sub-system references)
    this.svgGroup.remove();
  }

  /**
   * Destroy the node completely, cleaning up all timers, event handlers,
   * and owned sub-modules. Pattern matches PanZoom.ts.
   */
  public destroy(): void {
    this._destroyed = true;

    // Clear all pending timeouts
    if (this._svgViewboxTimeoutId !== null) {
      clearTimeout(this._svgViewboxTimeoutId);
      this._svgViewboxTimeoutId = null;
    }
    if (this._dragEndTimeoutId !== null) {
      clearTimeout(this._dragEndTimeoutId);
      this._dragEndTimeoutId = null;
    }
    if (this._previewViewboxTimeoutId !== null) {
      clearTimeout(this._previewViewboxTimeoutId);
      this._previewViewboxTimeoutId = null;
    }
    if (this._connectTimeoutId !== null) {
      clearTimeout(this._connectTimeoutId);
      this._connectTimeoutId = null;
    }

    // Disable owned sub-modules (each handles its own cleanup)
    if (this.resizeRotate && this.resizeRotate.isEnabled()) {
      this.resizeRotate.disable();
    }
    if (this.connector && (this.connector as any).isActive) {
      this.connector.disable();
    }
    if (this.relationships) {
      this.relationships.disable();
      this.relationships.removeAll();
    }

    // Clean up connection handles container
    if (this.connectionHandles.container) {
      this.connectionHandles.container.remove();
      this.connectionHandles.container = undefined;
    }
    // Clean up connection preview container
    if (this.connectionPreview?.container) {
      this.connectionPreview.container.remove();
      this.connectionPreview.container = undefined;
    }

    // Remove the main SVG group (cleans up all child elements)
    this.svgGroup.remove();
    this.isDragging = false;
  }

  /** Hide the node visually (sets display:none). */
  public hide() {
    this.svgGroup.hide();
  }

  /** Show the node after hide(). */
  public show() {
    this.svgGroup.show();
  }

  /**
   * Set the node[s text content. No-op on SVG content nodes.
   *
   * @param text - New text string
   */
  public setText(text: string) {
    // Skip if no text element (e.g., when using SVG content)
    if (!this.textElement) return;

    const changed = this.options.text !== text;
    this.options.text = text;
    this.textElement.text(text);
    this.centerText();
    // Update accessibility label
    this.svgGroup.node.setAttribute("aria-label", text || "Unnamed node");
    if (changed) {
      this.slate.broadcast?.("onNodeTextChanged", { id: this.id, text });
    }
  }

  /**
   * Resize the node to new dimensions. For circles, forces width === height.
   *
   * @param width  - New width
   * @param height - New height
   */
  public setSize(width: number, height: number) {
    this.options.width = width;
    this.options.height = height;

    // Update background - need to check type for proper method
    if (this.backgroundRect instanceof Rect) {
      this.backgroundRect.size(width, height);
    } else if (this.backgroundRect instanceof Circle) {
      // For circles, use the smaller dimension to keep it circular
      const diameter = Math.min(width, height);
      this.backgroundRect.size(diameter, diameter);
      // Also update stored dimensions to match the circle
      this.options.width = diameter;
      this.options.height = diameter;
    } else if (this.backgroundRect instanceof Ellipse) {
      this.backgroundRect.size(width, height);
    } else {
      // Custom shapes (nested SVG with path): resize via SVG native size()
      try {
        (this.backgroundRect as any).size?.(width, height);
      } catch (_) {
        console.warn("NODE_DEBUG: Failed to resize custom shape backgroundRect:", _);
      }
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

  /**
   * Change the node[s background and/or border colors.
   *
   * @param backgroundColor - New fill color (or undefined to keep current)
   * @param borderColor     - New stroke color (or undefined to keep current)
   */
  public setColors(backgroundColor?: string, borderColor?: string) {
    // Path shapes carry fill/stroke on the inner <path>, not the nested wrapper.
    const styleEl: any = this.contentPath ?? this.backgroundRect;
    if (backgroundColor) {
      this.options.backgroundColor = backgroundColor;
      styleEl.fill(backgroundColor);
    }

    if (borderColor) {
      this.options.borderColor = borderColor;
      styleEl.stroke({ color: borderColor });
    }

    if (backgroundColor || borderColor) {
      // v1 package shape: data.color carries the background color
      this.slate.broadcast?.("onNodeColorChanged", {
        id: this.id,
        color: this.options.backgroundColor,
        borderColor: this.options.borderColor,
      });
    }
  }

  /**
   * Re-apply the border stroke (color / width / style / opacity) from options.
   * The app's border pane sends one { prop, val } at a time, so we repaint the
   * whole stroke from current options each change. borderStyle accepts the app's
   * symbols ('-', '.', '--.') or words ('dashed', 'dotted'); dash lengths scale
   * with the border width. No-op when there's no plain shape stroke (e.g. SVG
   * content / nested path shapes).
   */
  public applyBorder(): void {
    // Path shapes carry the stroke on the inner <path>, not the nested wrapper.
    const rect: any = this.contentPath ?? this.backgroundRect;
    if (!rect || typeof rect.stroke !== "function") return;
    const { borderColor, borderWidth, borderOpacity } = this.options;
    const strokeOpts: {
      color?: string;
      width?: number;
      opacity?: number;
      dasharray?: string;
    } = { dasharray: this.borderDashArray() };
    if (borderColor) strokeOpts.color = borderColor;
    if (borderWidth !== undefined) strokeOpts.width = borderWidth;
    if (borderOpacity !== undefined) strokeOpts.opacity = borderOpacity;
    rect.stroke(strokeOpts);
  }

  /**
   * SVG stroke-dasharray for the current borderStyle, scaled by border width.
   * Accepts the app's symbols ('-', '.', '--.') and words ('dashed', 'dotted').
   * Returns "none" for solid. Shared by createBackground (load path) and
   * applyBorder (edit path) so border style survives a reload.
   */
  private borderDashArray(): string {
    const { borderStyle, borderWidth } = this.options;
    const w = borderWidth || 1;
    const dash: Record<string, number[]> = {
      "-": [3, 1],
      dashed: [3, 1],
      ".": [1, 1],
      dotted: [1, 1],
      "--.": [8, 3, 1, 3],
      combo: [8, 3, 1, 3],
    };
    return borderStyle && dash[borderStyle]
      ? dash[borderStyle].map((n) => n * w).join(",")
      : "none";
  }

  /** Lock the node, disabling drag and resize/rotate. */
  public lock() {
    this.options.isLocked = true;
    this.options.allowDrag = false;
    if ((this.svgGroup as any).draggable) {
      (this.svgGroup as any).draggable(false);
    }
    // Disable resize/rotate when locked
    this.disableResizeRotate();
  }

  /** Unlock the node, re-enabling drag and resize/rotate. */
  public unlock() {
    this.options.isLocked = false;
    this.options.allowDrag = true;
    this.makeDraggable();
    // Re-enable resize/rotate if this node is currently selected
    this.enableResizeRotate();
  }

  // Resize/Rotate functionality - managed by Slate
  /** Enable resize and rotate handles. Delegates to the Slate for centralized selection management. */
  public enableResizeRotate() {
    // Delegate to Slate - don't manage directly
    console.log(
      "NODE_DEBUG: enableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    );
    this.slate.enableNodeResizeRotate(this);
  }

  /** Disable resize and rotate handles. Delegates to the Slate. */
  public disableResizeRotate() {
    // Delegate to Slate - don't manage directly
    console.log(
      "NODE_DEBUG: disableResizeRotate called on",
      this.id,
      "- delegating to Slate"
    );
    this.slate.disableNodeResizeRotate(this);
  }

  /** Enable resize handles only. */
  public enableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: true });
    // Note: Slate manages when to actually enable/disable
  }

  /** Disable resize handles only. */
  public disableResize() {
    this.resizeRotate.updateOptions({ resizeEnabled: false });
    // Note: Slate manages when to actually enable/disable
  }

  /** Enable rotate handle only. */
  public enableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: true });
    // Note: Slate manages when to actually enable/disable
  }

  /** Disable rotate handle only. */
  public disableRotate() {
    this.resizeRotate.updateOptions({ rotateEnabled: false });
    // Note: Slate manages when to actually enable/disable
  }

  public isResizeRotateEnabled(): boolean {
    return this.resizeRotate.isEnabled();
  }

  /**
   * Set the node[s rotation angle.
   *
   * @param angle - Rotation in degrees (positive = clockwise)
   */
  public setRotation(angle: number, duration?: number) {
    if (!this.options.rotate) {
      this.options.rotate = { rotationAngle: 0 };
    }
    const start = this.options.rotate.rotationAngle || 0;
    const canAnimate =
      !!duration &&
      duration > 0 &&
      typeof requestAnimationFrame !== "undefined" &&
      typeof performance !== "undefined" &&
      start !== angle;

    if (canAnimate) {
      // Tween the angle so a remotely-applied rotation animates in this window
      // instead of snapping (collab bug #5) — same easing as the move tween.
      const delta = angle - start;
      const t0 = performance.now();
      const step = () => {
        if (this._destroyed || !this.svgGroup || !this.options.rotate) return;
        const p = Math.min(1, (performance.now() - t0) / (duration as number));
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        this.options.rotate.rotationAngle = start + delta * e;
        this.applyPositionAndRotation();
        if (p < 1) {
          requestAnimationFrame(step);
        } else {
          this.options.rotate.rotationAngle = angle;
          this.applyPositionAndRotation();
        }
      };
      requestAnimationFrame(step);
    } else {
      this.options.rotate.rotationAngle = angle;
      this.applyPositionAndRotation();
    }
  }

  /**
   * Set the group's transform to translate(options.x, options.y) followed by a
   * rotation around the node's visual center. The shape/text are drawn at the
   * group's local origin, so position is a pure translate and rotation must be
   * COMPOSED on top of it — replacing the matrix (as an origin:'center' rotate
   * alone does) would drop the translate and fling the node far off-screen on
   * reload. Single source of truth for the group transform.
   */
  private applyPositionAndRotation() {
    if (!this.svgGroup) return;
    const x = this.options.x || 0;
    const y = this.options.y || 0;
    const w = this.options.width || 0;
    const h = this.options.height || 0;
    const angle = this.options.rotate?.rotationAngle || 0;

    // Canonical model: the shape/text live at the group's LOCAL origin and the
    // group transform carries position + rotation. But svg.js move()/animate().
    // move() — used by drag and by animated/collab/host-replay moves — displaces
    // the group's CHILDREN in local space instead of touching the group
    // transform. If left displaced, that local offset is double-counted against
    // the translate we set below and the node renders far off-screen (the
    // "flies away on reload" bug). So first pull the children back to the local
    // origin, reading their true local bbox with the group transform cleared.
    if (
      typeof this.svgGroup.node?.removeAttribute === "function" &&
      typeof this.svgGroup.bbox === "function"
    ) {
      try {
        this.svgGroup.node.removeAttribute("transform");
        const bb = this.svgGroup.bbox();
        if (bb && (Math.abs(bb.x) > 0.01 || Math.abs(bb.y) > 0.01)) {
          this.svgGroup.children().forEach((child: any) => {
            if (typeof child?.dmove === "function") child.dmove(-bb.x, -bb.y);
          });
        }
      } catch (e) {
        console.warn("NODE_DEBUG: child normalization failed:", e);
      }
    }

    // Set the group transform EXPLICITLY as an SVG transform string —
    // deterministic, no SVG.js object-form / relative-compose ambiguity.
    // SVG applies right-to-left: a local point is first rotated about the
    // node's own center (w/2,h/2), then translated to (x,y). The shape/text
    // are drawn at the group's local origin, so the node renders at (x,y)
    // rotated about its visual center — stable across reloads.
    const t = angle
      ? `translate(${x} ${y}) rotate(${angle} ${w / 2} ${h / 2})`
      : `translate(${x} ${y})`;
    this.svgGroup.node.setAttribute("transform", t);

    // Notify connectors so they re-solve their anchors and stay attached
    // through position AND rotation changes. svg.connectable listens for a
    // "transform" event on the connected groups (con.update()); we set the
    // transform via setAttribute, which fires nothing on its own, so a rotated
    // node's connectors never followed (collab bug #4). Firing it here covers
    // every path (drag, rotate, tween, load) since they all funnel through here.
    try {
      this.svgGroup.fire?.("transform");
    } catch (e) {
      /* noop */
    }

    // A node move re-solves any attached connector, so the line's cog +
    // endpoint-lock toggles (positioned at the old geometry) would DRIFT (U2).
    // Clear them — Miro likewise hides connector UI during moves; the user
    // re-clicks the line for fresh, correctly-placed affordances.
    try {
      if ((this.slate as any)._activeLineCog || (this.slate as any)._activeEndpointToggles) {
        (this.slate as any).clearLineCog?.();
      }
    } catch (e) {
      /* noop */
    }
  }

  /**
   * Re-assert the canonical model after a resize/rotate interaction. During the
   * interaction svg.resize.js transforms the backgroundRect (and we rotate the
   * text/nested separately) — rotation is baked into those CHILDREN. Here we
   * strip those child transforms so rotation lives only on the group, then
   * apply the canonical group transform (which also normalizes child position
   * back to the local origin). Without this the shape carries a baked rotation
   * AND the group re-applies rotation on reload → double rotation / fly-off.
   */
  public finalizeInteraction() {
    const clear = (el: any) => {
      try {
        if (el?.node?.removeAttribute) el.node.removeAttribute("transform");
      } catch (e) {
        /* noop */
      }
    };
    clear(this.backgroundRect);
    clear(this.textElement);
    clear(this.nestedSvg);
    this.applyPositionAndRotation();
    if (this.textElement) this.centerText();
  }

  /**
   * Get the current rotation angle. Reads from options.rotate first,
   * then falls back to svgGroup transform and backgroundRect transform.
   *
   * @returns Rotation angle in degrees
   */
  public getRotation(): number {
    // PRIORITY: options.rotate.rotationAngle is always kept up-to-date by both:
    // - setRotation() (programmatic rotation)
    // - handleResize() in ResizeRotate.ts (manual UI rotation)
    // This is the single source of truth for rotation
    if (this.options.rotate?.rotationAngle !== undefined && this.options.rotate.rotationAngle !== 0) {
      return this.options.rotate.rotationAngle;
    }

    // Fallback: Check svgGroup transform (set by setRotation or initial options)
    try {
      const groupTransform = (this.svgGroup as any).transform();
      if (groupTransform && typeof groupTransform.rotate !== 'undefined' && groupTransform.rotate !== 0) {
        return groupTransform.rotate;
      }
    } catch (e) {
      console.warn("NODE_DEBUG: Failed to read svgGroup transform for rotation:", e);
    }

    // Fallback: Check backgroundRect (svg.select.js applies rotation here during manual rotate)
    try {
      const transform = (this.backgroundRect as any).transform();
      if (transform && typeof transform.rotation !== 'undefined') {
        return transform.rotation;
      }
      if (transform && typeof transform.rotate !== 'undefined') {
        return transform.rotate;
      }
    } catch (e) {
      console.warn("NODE_DEBUG: Failed to read backgroundRect transform for rotation:", e);
    }

    return 0;
  }

  // Connector functionality
  /** Enable the node[s connector so it can form connections to other nodes. */
  public enableConnector() {
    this.connector.enable();
  }

  /**
   * Enable connector with interactive features (selectable, draggable lines).
   *
   * @param makeInteractiveCallback - Optional callback after interactive features are set up
   */
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

  /** Disable the node[s connector and remove all connections. */
  public disableConnector() {
    this.connector.disable();
  }

  /**
   * Create a connection line from this node to a target node.
   *
   * @param targetNode - The node to connect to
   * @param connectionOptions - Line color, width, type, etc.
   * @returns The connection object
   *
   * @example
   * ```ts
   * node1.connectTo(node2, { lineColor: '#e94560', lineWidth: 3, type: 'curved' });
   * ```
   */
  public connectTo(targetNode: any, connectionOptions?: any) {
    return this.connector.connectTo(targetNode, connectionOptions);
  }

  public disconnectFrom(targetNode: any): boolean {
    return this.connector.disconnectFrom(targetNode);
  }

  public disconnectAll(): void {
    this.connector.disconnectAll();
  }

  /** @returns All connection objects for this node. */
  public getConnections() {
    return this.connector.getConnections();
  }

  /**
   * Get a specific connection by target node ID.
   *
   * @param targetNodeId - The target node[s ID
   * @returns The connection object or null if not found
   */
  public getConnection(targetNodeId: string) {
    return this.connector.getConnection(targetNodeId);
  }

  public isConnectorEnabled(): boolean {
    return this.connector.isEnabled();
  }

  private centerTextInitial() {
    this.centerText();
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
    // v1 contract: double-click asks the HOST to render its text pane
    // (native dblclick as a fallback for programmatic dispatch; interactive
    // double-clicks are detected in the pointerup path below)
    this.svgGroup.on("dblclick", (event: any) => {
      if (this.isResizeRotateHandle(event.target)) return;
      this.requestTextPane();
    });

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

          // Double-click detection: svg.draggable's pointer handling
          // suppresses native dblclick synthesis, so detect two quick
          // clicks ourselves and request the host's text pane
          const now = Date.now();
          if (now - this._lastClickTime < 400) {
            this._lastClickTime = 0;
            this.requestTextPane();
          } else {
            this._lastClickTime = now;
          }
        }

        clickStartPosition = null;
      }
    });
  }

  /**
   * Ask the host application to render its text-editing pane (v1's
   * onTextPaneRequested contract). The callback the host invokes applies
   * the edits via the Editor. No-op for read-only viewers, locked nodes,
   * or when the host registered no handler.
   */
  public requestTextPane(): void {
    const events = this.slate.options.events;
    if (!events?.onTextPaneRequested) return;
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    if (this.options.isLocked) return;
    events.onTextPaneRequested(this, (opts: any = {}) => {
      this.editor?.set(
        opts.text ?? this.options.text ?? "",
        opts.fontSize,
        opts.fontFamily,
        opts.fontColor ?? opts.foregroundColor,
        opts.textOpacity ?? opts.opacity,
        opts.textXAlign,
        opts.textYAlign
      );
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
  /** Called by the Slate when this node is selected. */
  public onSelected() {
    console.log("SELECTION_DEBUG: Node selected", this.id);
    // Note: Slate now handles resize/rotate enabling + the node cog (M1)
  }

  private _nodeCog?: any;

  /**
   * Show the node context toolbar (G1) — a compact strip CENTERED ABOVE the
   * node (legacy parity) with: delete, plug (drag-to-connect), cog (settings).
   * Only shown on single selection (Slate.updateSelectionResizeRotate drives it).
   */
  public showNodeCog(): void {
    if (this.options.allowMenu === false) return;
    this.hideNodeCog();
    const slate: any = this.slate;
    const container: any = slate.markersContainer || slate.canvas;
    if (!container || !this.svgGroup) return;
    let cx: number, topY: number;
    try {
      const rb = this.svgGroup.rbox(slate.canvas); // world AABB (follows rotation)
      cx = rb.x + rb.width / 2;
      topY = rb.y;
    } catch (e) {
      cx = (this.options.x || 0) + (this.options.width || 0) / 2;
      topY = this.options.y || 0;
    }

    const R = 15; // button hit radius
    const GAP = 6; // gap between buttons
    const NEUTRAL = "#5b6472";
    const tools: Array<{
      key: string;
      color: string;
      onClick?: () => void;
      onPress?: (e: any) => void;
    }> = [
      { key: "delete", color: "#e5484d", onClick: () => this.slate.removeNode(this.id) },
      // plug: press-drag-to-connect (G3) — starts on pointerdown, not click.
      { key: "plug", color: NEUTRAL, onPress: (e: any) => this.startConnectDrag(e) },
      { key: "cog", color: NEUTRAL, onClick: () => this.menu?.open?.() },
    ];
    const n = tools.length;
    const stepX = R * 2 + GAP;
    const totalW = n * (R * 2) + (n - 1) * GAP;
    const startX = cx - totalW / 2 + R;
    const barY = topY - (R + 18); // sit clearly above the node + rotate handle

    const bar = container.group().addClass("node-cog").addClass("node-toolbar");
    // Modern (Miro-style) flat white pill.
    bar
      .rect(totalW + 14, R * 2 + 10)
      .radius((R * 2 + 10) / 2)
      .center(cx, barY)
      .fill("#ffffff")
      .stroke({ color: "#e3e5ea", width: 1 });

    tools.forEach((t, i) => {
      const bx = startX + i * stepX;
      const btn = bar.group().addClass(`node-tool-${t.key}`);
      // transparent hit circle
      btn.circle(R * 2).center(bx, barY).fill("#ffffff").attr("fill-opacity", 0.001);
      Node.drawToolIcon(btn, t.key, bx, barY, t.color);
      btn.attr("pointer-events", "all");
      try {
        btn.node.style.cursor = "pointer";
      } catch (e) {
        /* noop */
      }
      btn.on("mousedown", (e: any) => {
        e.stopPropagation?.();
        if (t.onPress) t.onPress(e);
      });
      btn.on("click", (e: any) => {
        e.stopPropagation?.();
        t.onClick?.();
      });
    });

    bar.attr("pointer-events", "all");
    this._nodeCog = bar;
    try {
      slate.markersContainer?.front?.();
    } catch (e) {
      /* noop */
    }
  }

  /** Draw a crisp monochrome line-icon (delete/plug/cog) centered at (cx,cy). */
  public static drawToolIcon(g: any, kind: string, cx: number, cy: number, color: string): void {
    const s = { color, width: 1.6, linecap: "round", linejoin: "round" };
    if (kind === "delete") {
      // trash can
      g.line(cx - 6, cy - 5, cx + 6, cy - 5).stroke(s); // lid
      g.line(cx - 2.5, cy - 5, cx - 2, cy - 7.5).stroke(s);
      g.line(cx + 2.5, cy - 5, cx + 2, cy - 7.5).stroke(s);
      g.line(cx - 2, cy - 7.5, cx + 2, cy - 7.5).stroke(s); // handle
      g.path(`M ${cx - 4.5} ${cy - 4} L ${cx - 3.8} ${cy + 6.5} L ${cx + 3.8} ${cy + 6.5} L ${cx + 4.5} ${cy - 4}`)
        .fill("none")
        .stroke(s);
      g.line(cx - 1.3, cy - 2, cx - 1.3, cy + 4).stroke({ color, width: 1.1, linecap: "round" });
      g.line(cx + 1.3, cy - 2, cx + 1.3, cy + 4).stroke({ color, width: 1.1, linecap: "round" });
    } else if (kind === "plug") {
      // connection: two endpoints joined by a line ("draw a connector")
      g.line(cx - 4, cy + 4, cx + 4, cy - 4).stroke(s);
      g.circle(4.4).center(cx - 4.5, cy + 4.5).fill(color);
      g.circle(4.4).center(cx + 4.5, cy - 4.5).fill("#ffffff").stroke(s);
    } else {
      // cog (settings) — glyph is crisp + monochrome
      g.text("⚙")
        .font({ size: 17, anchor: "middle", family: "sans-serif" })
        .fill(color)
        .center(cx, cy)
        .attr("dy", "0.05em");
    }
  }

  public hideNodeCog(): void {
    if (this._nodeCog) {
      try {
        this._nodeCog.remove();
      } catch (e) {
        /* noop */
      }
      this._nodeCog = undefined;
    }
  }

  /**
   * Plug drag-to-connect (G3): press the plug and drag — a dashed rubber-band
   * line follows the pointer from this node; dropping on another node creates an
   * association (connector) to it. Dropping on empty canvas does nothing.
   */
  public startConnectDrag(startEvent: any): void {
    const slate: any = this.slate;
    const canvas: any = slate.canvas;
    if (!canvas) return;
    // Guard against re-entry (a single press can emit both pointerdown+mousedown).
    if ((this as any)._connectDragging) return;
    (this as any)._connectDragging = true;
    const container: any = slate.markersContainer || canvas;

    // Start point = this node's center in world (canvas user) coordinates.
    let sx: number, sy: number;
    try {
      const rb = this.svgGroup.rbox(canvas);
      sx = rb.cx;
      sy = rb.cy;
    } catch (e) {
      sx = (this.options.x || 0) + (this.options.width || 0) / 2;
      sy = (this.options.y || 0) + (this.options.height || 0) / 2;
    }

    const temp = container
      .path(`M ${sx} ${sy} L ${sx} ${sy}`)
      .fill("none")
      .stroke({ color: "#007cff", width: 2, dasharray: "6,4", linecap: "round" })
      .addClass("connect-drag-line");
    temp.attr("pointer-events", "none");
    // Arrowhead so the preview shows the tip meeting the node.
    let previewArrow: any = null;
    try {
      previewArrow = container.marker(7, 7, (add: any) => {
        add.path("M0,0 L7,3.5 L0,7 z").fill("#007cff").attr("pointer-events", "none");
      });
      previewArrow.ref(6, 3.5);
      previewArrow.attr("pointer-events", "none");
      (temp as any).marker("end", previewArrow);
    } catch (e) {
      /* noop */
    }
    try {
      slate.markersContainer?.front?.();
    } catch (e) {
      /* noop */
    }

    const norm = (vx: number, vy: number, fx: number, fy: number) => {
      const m = Math.hypot(vx, vy);
      if (m > 0.0001) return [vx / m, vy / m];
      const fm = Math.hypot(fx, fy) || 1;
      return [fx / fm, fy / fm];
    };
    // Point on an axis-aligned rect's edge along the direction center→(px,py).
    const edgePoint = (o: any, px: number, py: number) => {
      const cx = (o.x || 0) + (o.width || 0) / 2;
      const cy = (o.y || 0) + (o.height || 0) / 2;
      const dx = px - cx;
      const dy = py - cy;
      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) return { x: cx, y: cy };
      const sxr = dx !== 0 ? (o.width || 0) / 2 / Math.abs(dx) : Infinity;
      const syr = dy !== 0 ? (o.height || 0) / 2 / Math.abs(dy) : Infinity;
      const sc = Math.min(sxr, syr);
      return { x: cx + dx * sc, y: cy + dy * sc };
    };

    let hovered: any = null;
    const clearHover = () => {
      if (hovered) {
        try {
          if (hovered._preHiStroke !== undefined) {
            hovered.node.backgroundRect?.attr?.("stroke", hovered._preHiStroke);
          }
          hovered.node.backgroundRect?.attr?.({
            "stroke-dasharray": null,
            "stroke-opacity": null,
          });
        } catch (e) {
          /* noop */
        }
        hovered = null;
      }
    };

    const toWorld = (clientX: number, clientY: number) => {
      try {
        return canvas.point(clientX, clientY);
      } catch (e) {
        return { x: sx, y: sy };
      }
    };

    const nodeUnder = (clientX: number, clientY: number): Node | null => {
      // Hide the preview (path + its arrow marker) so it doesn't intercept the
      // hit-test for the node underneath the pointer.
      let prevDisplay: string | undefined;
      try {
        prevDisplay = temp.node.style.display;
        temp.node.style.display = "none";
      } catch (e) {
        /* noop */
      }
      const el = document.elementFromPoint(clientX, clientY) as Element | null;
      try {
        if (prevDisplay !== undefined) temp.node.style.display = prevDisplay;
      } catch (e) {
        /* noop */
      }
      const g = (el as any)?.closest?.("[data-node-id]");
      const id = g?.getAttribute?.("data-node-id");
      if (!id || id === this.id) return null;
      return slate.nodes?.one?.(id) || null;
    };

    const onMove = (ev: any) => {
      const w = toWorld(ev.clientX, ev.clientY);
      const target = nodeUnder(ev.clientX, ev.clientY);

      if (target && (target as any).options) {
        // Curve to a perpendicular approach on the hovered node so the arrow
        // tip meets its edge at ~90°, pointing at the node center.
        const to = (target as any).options;
        const tcx = (to.x || 0) + (to.width || 0) / 2;
        const tcy = (to.y || 0) + (to.height || 0) / 2;
        const tp = edgePoint(to, sx, sy); // target edge toward source center
        const sp = edgePoint(this.options, tcx, tcy); // source edge toward target center
        const dx = tp.x - sp.x;
        const dy = tp.y - sp.y;
        const dist = Math.hypot(dx, dy) || 1;
        const sDir = norm(sp.x - sx, sp.y - sy, dx, dy);
        const tDir = norm(tp.x - tcx, tp.y - tcy, -dx, -dy);
        const handle = Math.max(30, Math.min(dist * 0.45, 90));
        const cp1x = sp.x + sDir[0] * handle;
        const cp1y = sp.y + sDir[1] * handle;
        const cp2x = tp.x + tDir[0] * handle;
        const cp2y = tp.y + tDir[1] * handle;
        temp.plot(
          `M ${sp.x} ${sp.y} C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${tp.x} ${tp.y}`
        );
      } else {
        // Free drag: straight line from the source center to the pointer.
        temp.plot(`M ${sx} ${sy} L ${w.x} ${w.y}`);
      }

      if (target !== (hovered?.node || null)) {
        clearHover();
        if (target && (target as any).backgroundRect) {
          const br = (target as any).backgroundRect;
          hovered = { node: target, _preHiStroke: br.attr("stroke") };
          try {
            br.attr({ stroke: "#007cff", "stroke-dasharray": "8,4", "stroke-opacity": 0.9 });
          } catch (e) {
            /* noop */
          }
        }
      }
    };

    const onUp = (ev: any) => {
      window.removeEventListener("pointermove", onMove, true);
      window.removeEventListener("pointerup", onUp, true);
      (this as any)._connectDragging = false;
      try {
        temp.remove();
        previewArrow?.remove?.();
        // Bulletproof: clear any stray preview paths too.
        const strays = (canvas.node as any).querySelectorAll(
          ".connect-drag-line"
        );
        strays.forEach((el: Element) => el.remove());
      } catch (e) {
        /* noop */
      }
      const target = nodeUnder(ev.clientX, ev.clientY);
      clearHover();
      if (target && target.id !== this.id) {
        try {
          this.relationships.addAssociation(target);
        } catch (e) {
          /* noop */
        }
      }
    };

    window.addEventListener("pointermove", onMove, true);
    window.addEventListener("pointerup", onUp, true);
  }

  /** Called by the Slate when this node is deselected. */
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

    // Create container for all connection handles at canvas level
    // IMPORTANT: Must be outside svgGroup to avoid affecting group's bbox during drag
    this.connectionHandles.container = this.slate.canvas.group();

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
          this._previewViewboxTimeoutId = setTimeout(() => {
            if (this._destroyed) return;
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

  /** Show connection handles (4 blue dots) on this node for creating connected siblings. */
  public enableConnectionHandles() {
    console.log(
      "CONNECTION_HANDLES_DEBUG: enableConnectionHandles called for",
      this.id
    );
    this.showConnectionHandles();
  }

  /** Hide connection handles on this node. */
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
      this._connectTimeoutId = setTimeout(() => {
        if (!this._destroyed) this.connectToNode(newNode);
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
    // Route through the RELATIONSHIPS model, not connector.connectTo() directly.
    // addAssociation() (a) records the association in assocMap so it serializes
    // and survives a reload, (b) renders the connector line, and (c) broadcasts
    // "addRelationship" so peers get it too. Calling connector.connectTo()
    // directly was visual-only — the line neither synced to collaborators nor
    // survived a refresh (collab bugs #3 + #6).
    if (this.relationships) {
      // Don't duplicate an existing association
      if (this.relationships.getAssociation?.(targetNode.id)) {
        return;
      }
      this.relationships.addAssociation(targetNode);
      return;
    }

    // Fallback (relationships unavailable): visual-only connector
    if (!this.connector) {
      console.warn(
        "CONNECTION_HANDLES_DEBUG: Connector not initialized for",
        this.id
      );
      return;
    }
    if (!this.connector.isEnabled()) this.connector.enable();
    this.connector.connectTo(targetNode);
  }
}
