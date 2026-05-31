import { SVG, Svg } from "@svgdotjs/svg.js";
import { Node, NodeOptions } from "./Node";
import { NodesManager } from "./NodesManager";
import { Invoker } from "./Invoker";
import { PanZoom, PanZoomOptions } from "./PanZoom";
import { BirdsEye, BirdsEyeOptions } from "./BirdsEye";
import {
  serialize,
  deserialize,
  snapshot as takeSnapshot,
  type SlateJSON,
} from "./Serialization";
import { UndoRedo } from "./UndoRedo";
import { MultiSelection } from "./MultiSelection";
import { Grid } from "./Grid";
import { Keyboard } from "./Keyboard";
import { exportSVG, exportPNG, type ExportOptions } from "./Export";
import { Collab, CollabUser } from "./Collab";
import type { SlatePackage } from "./SlatePackage";
import { applyTheme, type ThemeDefinition } from "./Theme";
import {
  removeLayoutOverlaps,
  applyLayout as applyLayoutMoves,
  packageLayout,
  type LayoutMove,
} from "./Layout";
import { Association } from "./Relationship";
import { ZoomSlider } from "./ZoomSlider";
import { Presentation } from "./Presentation";
import { loadAllFonts as loadAllFontsForSlate } from "./FontLoader";

export interface SlateEvents {
  onSlateChanged?: (pkg: SlatePackage, collabUsers?: CollabUser[]) => void;
  onInitCollaboration?: (clientID: string) => void;
  onTextPaneRequested?: (node: Node, cb: Function) => void;
  onLineMenuRequested?: (node: Node, association: Association, cb: Function) => void;
  onTakeSnapshot?: (opts?: Record<string, any>) => void;
  onConfirmRequested?: (title: string, msg: string, cb: Function) => void;
  onCollaborationUsersChanged?: (users: CollabUser[]) => void;
  onCollaborationUsersRemoved?: (users: CollabUser[]) => void;
  onCollaboration?: (pkg: SlatePackage) => void;
  onNodeDragged?: (node: Node, evt: MouseEvent) => void;
  onCanvasClicked?: (evt: MouseEvent) => void;
  onImagesRequested?: (opts: Record<string, any>) => void;
  onRequestSave?: (opts?: Record<string, any>) => void;
  onCreateImage?: (opts: Record<string, any>, cb: Function) => void;
  onMenuRequested?: (node: Node, cb: Function) => void;
  isReadOnly?: () => boolean;
  isCommentOnly?: () => boolean;
  canRemoveComments?: () => boolean;
}

export interface SlateOptions {
  // Identity
  id?: string;
  name?: string;
  description?: string;
  container?: string;
  instance?: string;
  shareId?: string;

  // Behavior
  enabled?: boolean;
  allowDrag?: boolean;
  followMe?: boolean;
  mindMapMode?: boolean;
  autoResizeNodesBasedOnText?: boolean;
  useLayoutQuadrants?: boolean;
  autoEnableDefaultFilters?: boolean;

  // UI visibility
  showbirdsEye?: boolean;
  sizeOfbirdsEye?: number;
  showMultiSelect?: boolean;
  showZoom?: boolean;
  showUndoRedo?: boolean;
  showStatus?: boolean;
  showLocks?: boolean;

  // Access control
  isPublic?: boolean;
  isUnlisted?: boolean;
  isPrivate?: boolean;
  isTemplate?: boolean;
  basedOnTemplate?: string;
  basedOnThemeId?: string;
  syncWithTheme?: boolean;

  // Collaboration
  allowCollaboration?: boolean;
  eligibleForThemeCompilation?: boolean;

  // Viewport
  viewPort?: {
    originalWidth?: number;
    originalHeight?: number;
    width?: number;
    height?: number;
    left?: number;
    top?: number;
    showGrid?: boolean;
    gridSize?: number;
    snapToObjects?: boolean;
    showCoordinates?: boolean;
    useInertiaScrolling?: boolean;
    zoom?: {
      r?: number;
      w?: number;
      h?: number;
    };
  };

  // Appearance
  containerStyle?: {
    backgroundColor?: string;
    backgroundColorAsGradient?: boolean;
    backgroundGradientType?: "linear" | "radial";
    backgroundGradientColors?: string[];
    backgroundGradientStrategy?: "horizontal" | "vertical" | "diagonal";
    backgroundImage?: string;
    backgroundSize?: "contain" | "cover" | "repeat";
    backgroundEffect?: string;
    prevBackgroundColor?: string;
  };

  // Defaults
  defaultLineColor?: string;
  themeId?: string;

  // Layout
  layoutType?: "manual" | "auto";
  disableAutoLayoutOfManuallyPositionedNodes?: boolean;
  nodeOrder?: string[]; // Array of node IDs for z-ordering

  // Huddle
  huddleType?: "none" | "basic" | "advanced";
  huddleEnabled?: boolean;

  // Metadata
  tags?: string[];
  templateMarkdown?: string;
  templatePrompt?: string;
  ai?: any;

  // Sub-systems
  panZoom?: PanZoomOptions;
  birdsEye?: BirdsEyeOptions;

  // Events
  events?: SlateEvents;
}

export class Slate {
  public element: HTMLElement;
  public canvas!: Svg;
  public nodes!: NodesManager;
  public invoker!: Invoker;
  public panZoom!: PanZoom;
  public birdsEye!: BirdsEye;
  public undoRedo!: UndoRedo;
  public multiSelection!: MultiSelection;
  public grid!: Grid;
  public keyboard!: Keyboard;
  public collab!: Collab;
  public zoomSlider!: ZoomSlider;
  public presentation!: Presentation;
  public options: SlateOptions;
  // Runtime-injected by Connector for global line/marker containers
  public linesContainer?: any;
  public markersContainer?: any;
  private selectedNodes: Node[] = [];
  private groupResizeRotate: any = null; // Will hold the group resize/rotate controller
  private _coordinateIntervalId: ReturnType<typeof setInterval> | null = null;
  private _destroyed: boolean = false;
  private _birdsEyeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _coordDisplayTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _nodeNotifyTimeoutId: ReturnType<typeof setTimeout> | null = null;

  /**
   * Creates a new Slate — the main orchestrator for a diagramming canvas.
   *
   * Initializes the SVG canvas, sets up all sub-modules (nodes manager,
   * pan/zoom, selection, grid, keyboard shortcuts, undo/redo, etc.),
   * and attaches event handlers.
   *
   * @param element - CSS selector string or HTMLElement to mount the canvas on
   * @param options - Full slate configuration (see SlateOptions interface)
   * @throws If element is a selector string and no matching element is found
   *
   * @example
   * ```ts
   * import { Slate } from 'slateboxjs-v2';
   * const slate = new Slate('#canvas', {
   *   viewPort: { originalWidth: 1200, originalHeight: 800 },
   *   panZoom: { enabled: true }
   * });
   * ```
   */
  constructor(element: string | HTMLElement, options: SlateOptions = {}) {
    // Get or create the target element
    if (typeof element === "string") {
      const found = document.querySelector(element) as HTMLElement;
      if (!found) {
        throw new Error(`Element with selector "${element}" not found`);
      }
      this.element = found;
    } else {
      this.element = element;
    }

    // Default options
    this.options = {
      name: "Untitled Slate",
      description: "",
      followMe: true,
      mindMapMode: false,
      autoResizeNodesBasedOnText: true,
      viewPort: {
        originalWidth: 800,
        originalHeight: 600,
        showGrid: false,
        snapToObjects: false,
        showCoordinates: true,
      },
      containerStyle: {
        backgroundColor: "#ffffff",
        backgroundColorAsGradient: false,
        backgroundGradientType: "linear",
        backgroundGradientColors: [],
        backgroundGradientStrategy: "horizontal",
        backgroundImage: undefined,
        backgroundSize: "contain",
        backgroundEffect: undefined,
        prevBackgroundColor: "#ffffff",
      },
      defaultLineColor: "#000000",
      themeId: undefined,
      layoutType: "manual",
      disableAutoLayoutOfManuallyPositionedNodes: false,
      huddleType: "none",
      huddleEnabled: false,
      tags: [],
      templateMarkdown: "",
      templatePrompt: "",
      isTemplate: false,
      ai: {},
      panZoom: {
        enabled: true,
        panning: true,
        pinchZoom: true,
        wheelZoom: false, // Disable wheel zoom - use pinch to zoom, scroll to pan
        zoomFactor: 0.3,
        zoomMin: 0.1,
        zoomMax: 10,
      },
      ...options,
    };

    this.init();
  }

  private init() {
    // Initialize SVG canvas
    this.canvas = SVG().addTo(this.element);

    // Use normal viewport dimensions - svg-pan-zoom will handle infinite panning
    const width = this.options.viewPort?.originalWidth || 800;
    const height = this.options.viewPort?.originalHeight || 600;
    this.canvas.size(width, height);

    // Initialize nodes manager
    this.nodes = new NodesManager(this);

    // Initialize invoker with the contract methods
    this.invoker = new Invoker(this);

    // Set up selection management
    this.setupSelectionHandling();

    // Set up coordinate display callbacks before pan/zoom initialization
    if (this.options.viewPort?.showCoordinates) {
      this.setupCoordinateCallbacks();
    }

    // Initialize pan/zoom functionality
    this.panZoom = new PanZoom(this, this.options.panZoom);

    // Initialize birds eye / minimap
    this.birdsEye = new BirdsEye(this, this.options.birdsEye);
    if (this.options.birdsEye?.enabled) {
      // Delay enable to ensure canvas is ready
      this._birdsEyeTimeoutId = setTimeout(() => {
        if (!this._destroyed) this.birdsEye.enable();
      }, 200);
    }

    // Initialize undo/redo
    this.undoRedo = new UndoRedo(this, {
      enabled: this.options.showUndoRedo !== false,
    });

    // Initialize multi-selection
    this.multiSelection = new MultiSelection(this, {
      enabled: this.options.showMultiSelect !== false,
    });

    // Initialize grid
    this.grid = new Grid(this, {
      enabled: this.options.viewPort?.showGrid || false,
      gridSize: this.options.viewPort?.gridSize || 20,
    });
    if (this.options.viewPort?.showGrid) {
      this.grid.show();
    }

    // Initialize keyboard bindings
    this.keyboard = new Keyboard(this);
    if (this.options.enabled !== false) {
      this.keyboard.bindGlobal();
    }

    // Initialize collaboration (lazy — call collab.init() to connect)
    this.collab = new Collab(this);

    // Initialize zoom slider
    this.zoomSlider = new ZoomSlider(this, {
      enabled: this.options.showZoom || false,
    });

    // Initialize presentation mode
    this.presentation = new Presentation(this);

    // Make canvas responsive
    this.makeResponsive();

    // Add coordinate display element after pan/zoom is ready
    if (this.options.viewPort?.showCoordinates) {
      this._coordDisplayTimeoutId = setTimeout(() => {
        if (!this._destroyed) this.addCoordinateDisplay();
      }, 150);
    }
  }

  /**
   * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
   * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
   */
  public destroy(): void {
    this._destroyed = true;

    // Clear all pending timeouts
    if (this._birdsEyeTimeoutId !== null) {
      clearTimeout(this._birdsEyeTimeoutId);
      this._birdsEyeTimeoutId = null;
    }
    if (this._coordDisplayTimeoutId !== null) {
      clearTimeout(this._coordDisplayTimeoutId);
      this._coordDisplayTimeoutId = null;
    }
    if (this._nodeNotifyTimeoutId !== null) {
      clearTimeout(this._nodeNotifyTimeoutId);
      this._nodeNotifyTimeoutId = null;
    }

    // Clear coordinate polling interval
    if (this._coordinateIntervalId !== null) {
      clearInterval(this._coordinateIntervalId);
      this._coordinateIntervalId = null;
    }

    // Remove coordinate display element
    const coordDisplay = this.element.querySelector("#slate-coordinates") as HTMLElement;
    if (coordDisplay) {
      coordDisplay.remove();
    }

    // Remove canvas click handler
    this.canvas.off("click");

    // Chain destroy to sub-modules
    if (this.panZoom) {
      this.panZoom.destroy();
    }
    if (this.birdsEye) {
      this.birdsEye.disable();
    }
    if (this.zoomSlider) {
      this.zoomSlider.destroy();
    }
    if (this.keyboard) {
      this.keyboard.unbindGlobal();
    }
    if (this.multiSelection) {
      this.multiSelection.disable();
    }
    if (this.undoRedo) {
      this.undoRedo.clear();
    }
    if (this.collab) {
      this.collab.disconnect();
    }
    if (this.presentation) {
      this.presentation.stop();
    }
    if (this.grid) {
      this.grid.hide();
    }

    // Clear all nodes
    if (this.nodes) {
      this.nodes.clear();
    }

    // Remove the SVG canvas
    if (this.canvas) {
      this.canvas.remove();
    }
  }

  private setupCoordinateCallbacks() {
    // Store original callbacks
    const originalOnPan = this.options.panZoom?.onPan;
    const originalOnZoom = this.options.panZoom?.onZoom;

    // Set up callbacks that will update coordinates
    if (!this.options.panZoom) {
      this.options.panZoom = {};
    }

    this.options.panZoom.onPan = (pan: any) => {
      this.updateCoordinateDisplay();
      if (originalOnPan) {
        originalOnPan(pan);
      }
    };

    this.options.panZoom.onZoom = (zoom: any) => {
      this.updateCoordinateDisplay();
      if (originalOnZoom) {
        originalOnZoom(zoom);
      }
    };
  }

  private addCoordinateDisplay() {
    console.log("COORD_DEBUG: Starting coordinate display creation");

    // Create coordinate display in upper left
    const coordDisplay = document.createElement("div");
    coordDisplay.id = "slate-coordinates";
    coordDisplay.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      min-width: 150px;
    `;

    // Ensure parent element has relative positioning
    this.element.style.position = this.element.style.position || "relative";
    this.element.appendChild(coordDisplay);

    console.log(
      "COORD_DEBUG: Coordinate display element created and added to DOM"
    );
    console.log("COORD_DEBUG: Element style:", coordDisplay.style.cssText);
    console.log("COORD_DEBUG: Parent element:", this.element);

    // Set initial text immediately
    coordDisplay.textContent = "x: 0, y: 0, zoom: 1.00";

    // Start immediate coordinate tracking
    this.updateCoordinateDisplay();

    // Start polling for coordinate updates as fallback
    this.startCoordinatePolling();
  }

  private startCoordinatePolling() {
    if (this._destroyed) return;
    console.log("COORD_DEBUG: Starting coordinate polling");

    // Poll every 200ms to update coordinates (reduced frequency)
    this._coordinateIntervalId = setInterval(() => {
      if (!this._destroyed) this.updateCoordinateDisplay();
    }, 200);
  }

  private updateCoordinateDisplay() {
    const coordDisplay = this.element.querySelector(
      "#slate-coordinates"
    ) as HTMLElement;
    if (!coordDisplay) {
      console.log("COORD_DEBUG: No coordinate display element found in DOM");
      return;
    }

    try {
      // Get current pan and zoom values
      let pan = { x: 0, y: 0 };
      let zoom = 1;

      if (this.panZoom && this.panZoom.isInitialized()) {
        pan = this.getPan();
        zoom = this.getZoom();
        console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          pan,
          "zoom:",
          zoom
        );
      } else {
        // Fallback: get directly from viewBox
        const viewBox = this.canvas.viewbox();
        pan = { x: viewBox.x, y: viewBox.y };
        zoom = this.canvas.attr("width") / viewBox.width || 1;
        console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          pan,
          "zoom:",
          zoom
        );
      }

      const newText = `x: ${Math.round(pan.x)}, y: ${Math.round(
        pan.y
      )}, zoom: ${zoom.toFixed(2)}`;
      coordDisplay.textContent = newText;

      // Log occasionally to verify it's working
      if (Math.random() < 0.1) {
        // 10% chance to log
        console.log("COORD_DEBUG: Updated coordinates to:", newText);
      }
    } catch (error) {
      console.error("COORD_DEBUG: Error updating coordinates:", error);
      coordDisplay.textContent = "x: ?, y: ?, zoom: ?";
    }
  }

  private makeResponsive() {
    // Add viewbox for responsive behavior
    const width = this.options.viewPort?.originalWidth || 800;
    const height = this.options.viewPort?.originalHeight || 600;
    this.canvas.viewbox(0, 0, width, height);
  }

  /**
   * Add a new node to the slate.
   *
   * @param options - Node options including position, size, text, shape, colors, etc.
   * @returns The newly created Node instance
   *
   * @example
   * ```ts
   * slate.addNode({
   *   id: 'my-node', x: 200, y: 150,
   *   width: 120, height: 80, text: 'Hello',
   *   shape: 'rectangle', backgroundColor: '#4ecdc4'
   * });
   * ```
   */
  public addNode(options: Partial<NodeOptions> = {}) {
    const node = this.nodes.add(options);
    // Notify BirdsEye of the new node after a short delay for rendering
    this._nodeNotifyTimeoutId = setTimeout(() => {
      if (!this._destroyed) this.notifyNodeChanged();
    }, 100);
    return node;
  }

  /** Remove a node by ID. */
  public removeNode(id: string) {
    const result = this.nodes.remove(id);
    // Notify BirdsEye of the removed node
    this.notifyNodeChanged();
    return result;
  }

  /**
   * Notify that a node has changed (position, rotation, added, removed)
   * This triggers BirdsEye refresh if enabled
   */
  public notifyNodeChanged(node?: Node): void {
    if (this.birdsEye?.isEnabled()) {
      this.birdsEye.scheduleRefresh();
    }
  }

  /** @returns The node with the given ID, or undefined if not found. */
  public getNode(id: string) {
    return this.nodes.one(id);
  }

  /** @returns All nodes currently on the slate. */
  public getAllNodes(): Node[] {
    return this.nodes.allNodes;
  }

  // Get the pan/zoom viewport for adding content that should pan/zoom
  /** @returns The SVG root canvas (used as the viewport for pan/zoom). */
  public getViewport(): Svg {
    // SVG.js panzoom works directly with root canvas - no viewport nesting needed!
    console.log("VIEWPORT_DEBUG: Using root canvas (SVG.js panzoom)");
    return this.canvas;
  }

  // Get viewport with retry logic for proper initialization
  /** @returns Promise resolving to the SVG root canvas. */
  public getViewportAsync(): Promise<Svg> {
    // SVG.js panzoom works directly with root canvas - immediate return
    console.log(
      "VIEWPORT_DEBUG: Returning root canvas immediately (SVG.js panzoom)"
    );
    return Promise.resolve(this.canvas);
  }

  // Pan/Zoom API methods
  /** Enable pan and zoom interactions. */
  public enablePanZoom() {
    this.panZoom.enable();
  }

  /** Disable pan and zoom interactions. */
  public disablePanZoom() {
    this.panZoom.disable();
  }

  /** Enable canvas panning. */
  public enablePan() {
    this.panZoom.enablePan();
  }

  /** Disable canvas panning. */
  public disablePan() {
    this.panZoom.disablePan();
  }

  /** Enable canvas zoom. */
  public enableZoom() {
    this.panZoom.enableZoom();
  }

  /** Disable canvas zoom. */
  public disableZoom() {
    this.panZoom.disableZoom();
  }

  /**
   * Pan to a specific position.
   * @param point - { x, y } target position
   */
  public pan(point: { x: number; y: number }) {
    this.panZoom.pan(point);
  }

  /**
   * Pan by a relative delta.
   * @param delta - { dx, dy } distance to pan
   */
  public panBy(delta: { x: number; y: number }) {
    this.panZoom.panBy(delta);
  }

  /**
   * Set the zoom level.
   * @param level - Zoom factor (1 = 100%)
   */
  public zoom(level: number) {
    this.panZoom.zoom(level);
  }

  /**
   * Zoom by a relative factor.
   * @param factor - Multiplier applied to current zoom
   */
  public zoomBy(factor: number) {
    this.panZoom.zoomBy(factor);
  }

  /** Zoom in one step. */
  public zoomIn() {
    this.panZoom.zoomIn();
  }

  /** Zoom out one step. */
  public zoomOut() {
    this.panZoom.zoomOut();
  }

  /**
   * Zoom centered on a point.
   * @param level - Target zoom level
   * @param point - { x, y } focus point
   */
  public zoomAtPoint(level: number, point: { x: number; y: number }) {
    this.panZoom.zoomAtPoint(level, point);
  }

  /** Reset both pan and zoom to defaults. */
  public resetPanZoom() {
    this.panZoom.reset();
  }

  /** Reset zoom to 100%. */
  public resetZoom() {
    this.panZoom.resetZoom();
  }

  /** Reset pan position to origin. */
  public resetPan() {
    this.panZoom.resetPan();
  }

  /** Zoom/pan to fit all nodes in the viewport. */
  public fitToContent() {
    this.panZoom.fit();
  }

  /** Pan to center all nodes in the viewport. */
  public centerContent() {
    this.panZoom.center();
  }

  /** @returns Current zoom level (1 = 100%). */
  public getZoom(): number {
    return this.panZoom.getZoom();
  }

  /** @returns Current pan position as { x, y }. */
  public getPan(): { x: number; y: number } {
    return this.panZoom.getPan();
  }

  /** Notify pan/zoom that the viewport was resized. */
  public resizePanZoom() {
    this.panZoom.resize();
  }

  // Selection Management
  private setupSelectionHandling() {
    // Add canvas click handler to deselect all nodes when clicking empty space
    this.canvas.on("click", (event: any) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        event.target,
        "vs",
        this.canvas.node
      );

      // Check if the click target is the canvas itself or a child of canvas but not a node
      const isCanvasClick =
        event.target === this.canvas.node ||
        (event.target && event.target.tagName === "svg");

      if (isCanvasClick) {
        console.log("SELECTION_DEBUG: Canvas clicked - deselecting all");
        this.clearSelection();
      } else {
        console.log(
          "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
        );
      }
    });
  }

  /**
   * Select one or more nodes on the slate.
   *
   * This is the SINGLE ORCHESTRATOR for selection. It:
   * 1. Clears current selection unless addToSelection is true
   * 2. Adds the specified nodes to the selection set
   * 3. Calls updateSelectionResizeRotate() to enable handles on selected nodes
   * 4. Fires onSelectionChanged event
   *
   * @param nodes - Array of nodes to select
   * @param addToSelection - If true, adds to existing selection instead of replacing it
   *
   * @example
   * ```ts
   * // Select a single node
   * slate.selectNodes([node]);
   * // Add to existing selection
   * slate.selectNodes([node2, node3], true);
   * ```
   */
  public selectNodes(nodes: Node[], addToSelection: boolean = false) {
    console.log(
      "SELECTION_DEBUG: Selecting nodes",
      nodes.map((n) => n.id),
      "addToSelection:",
      addToSelection
    );

    // If not adding to selection, clear current selection first
    if (!addToSelection) {
      this.clearSelection();
    }

    // Add new nodes to selection (avoid duplicates)
    nodes.forEach((node) => {
      if (!this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node);
        node.onSelected();
      }
    });

    // Enable resize/rotate for the selection - CENTRALIZED CONTROL
    this.updateSelectionResizeRotate();
  }

  // SINGLE ORCHESTRATOR for resize/rotate management
  /** Re-evaluate which nodes should have resize/rotate handles based on current selection. */
  public updateSelectionResizeRotate() {
    console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    );

    // First, disable ALL resize/rotate on ALL nodes to prevent conflicts
    this.nodes.allNodes.forEach((node) => {
      if (node.resizeRotate.isEnabled()) {
        node.resizeRotate.disable();
        console.log("SELECTION_DEBUG: Disabled resize/rotate on", node.id);
      }

      // Also disable connection handles on all nodes
      if (node.isConnectionHandlesEnabled()) {
        node.disableConnectionHandles();
        console.log("SELECTION_DEBUG: Disabled connection handles on", node.id);
      }
    });

    // Remove any existing group controller
    this.disableGroupResizeRotate();

    if (this.selectedNodes.length === 0) {
      // No selection - all resize/rotate disabled
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }

    if (this.selectedNodes.length === 1) {
      // Single node selection - enable its individual resize/rotate and connection handles
      const selectedNode = this.selectedNodes[0];
      selectedNode.resizeRotate.enable();

      selectedNode.enableConnectionHandles();
      console.log(
        "SELECTION_DEBUG: Enabled individual resize/rotate and connection handles on",
        selectedNode.id
      );
    } else {
      // Multiple nodes - create group resize/rotate controller
      // For now, disable connection handles for multi-selection
      console.log(
        "SELECTION_DEBUG: Creating group resize/rotate for",
        this.selectedNodes.length,
        "nodes (connection handles disabled for multi-selection)"
      );
      this.createGroupResizeRotate();
    }
  }

  // Node-level resize/rotate control (called by Node methods)
  /** Request resize/rotate enable for a specific node (checked against selection). */
  public enableNodeResizeRotate(node: Node) {
    // Only enable if this node is currently selected
    if (this.selectedNodes.includes(node)) {
      console.log(
        "SELECTION_DEBUG: Node",
        node.id,
        "requested resize/rotate enable - already selected"
      );
      // Already handled by updateSelectionResizeRotate
    } else {
      console.log(
        "SELECTION_DEBUG: Node",
        node.id,
        "requested resize/rotate enable - selecting it"
      );
      // Select the node (which will enable its resize/rotate)
      this.selectNodes([node], false);
    }
  }

  /** Disable resize/rotate for a specific node. */
  public disableNodeResizeRotate(node: Node) {
    console.log(
      "SELECTION_DEBUG: Node",
      node.id,
      "requested resize/rotate disable"
    );
    // Disable the node's resize/rotate directly
    if (node.resizeRotate.isEnabled()) {
      node.resizeRotate.disable();
    }

    // Also hide connection handles during resize/rotate operations
    if (node.isConnectionHandlesEnabled()) {
      node.disableConnectionHandles();
    }
  }

  private disableGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Disabling group resize/rotate");

    // Disable individual resize/rotate on all selected nodes
    this.selectedNodes.forEach((node) => {
      node.disableResizeRotate();
    });

    // Remove group controller if it exists
    if (this.groupResizeRotate) {
      this.groupResizeRotate.remove();
      this.groupResizeRotate = null;
    }
  }

  private createGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Creating group resize/rotate controller");

    // Remove existing group controller
    if (this.groupResizeRotate) {
      this.groupResizeRotate.remove();
    }

    // Calculate bounding box of all selected nodes
    const groupBBox = this.calculateGroupBoundingBox();

    // Create a temporary group element for resize/rotate handles
    this.groupResizeRotate = this.canvas.group();

    // Create invisible rectangle that covers the group
    const groupRect = this.groupResizeRotate
      .rect(groupBBox.width, groupBBox.height)
      .move(groupBBox.x, groupBBox.y)
      .fill("transparent")
      .stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" });

    // Enable resize/rotate on the group rectangle
    // This will need to be implemented with svg.select.js or custom logic
    if (typeof (groupRect as any).select === "function") {
      (groupRect as any).select({
        createHandle: this.createGroupHandle.bind(this),
        updateHandle: this.updateGroupHandle.bind(this),
      });

      // Listen for resize/rotate events on the group
      groupRect.on("resize", this.handleGroupResize.bind(this));
      groupRect.on("rotate", this.handleGroupRotate.bind(this));
    } else {
      console.warn("svg.select.js not available for group resize/rotate");
    }
  }

  private calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    this.selectedNodes.forEach((node) => {
      const bbox = node.svgGroup.bbox();
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private createGroupHandle(
    selection: any,
    point: any,
    index: number,
    points: any[]
  ) {
    // Create resize handle for the group
    selection
      .circle(8)
      .fill("#4a90e2")
      .stroke("#ffffff")
      .attr("stroke-width", 2);
  }

  private updateGroupHandle(
    handle: any,
    point: any,
    index: number,
    points: any[]
  ) {
    // Update handle position
    handle.center(point[0], point[1]);
  }

  private handleGroupResize(event: any) {
    console.log("SELECTION_DEBUG: Group resize event", event);

    const { box } = event.detail;
    const originalGroupBBox = this.calculateGroupBoundingBox();

    // Calculate scale factors
    const scaleX = box.width / originalGroupBBox.width;
    const scaleY = box.height / originalGroupBBox.height;

    // Apply resize to each selected node
    this.selectedNodes.forEach((node) => {
      const nodeBBox = node.svgGroup.bbox();

      // Calculate new position and size relative to group
      const relativeX = (nodeBBox.x - originalGroupBBox.x) * scaleX;
      const relativeY = (nodeBBox.y - originalGroupBBox.y) * scaleY;
      const newWidth = nodeBBox.width * scaleX;
      const newHeight = nodeBBox.height * scaleY;

      // Apply to node
      node.setSize(newWidth, newHeight);
      node.position(box.x + relativeX, box.y + relativeY);
    });
  }

  private handleGroupRotate(event: any) {
    console.log("SELECTION_DEBUG: Group rotate event", event);

    const { angle } = event.detail;
    const groupBBox = this.calculateGroupBoundingBox();
    const centerX = groupBBox.x + groupBBox.width / 2;
    const centerY = groupBBox.y + groupBBox.height / 2;

    // Apply rotation to each selected node around group center
    this.selectedNodes.forEach((node) => {
      const currentRotation = node.getRotation();
      node.setRotation(currentRotation + angle);

      // You might also want to rotate the position around the group center
      // This would require more complex calculations
    });
  }

  /** Select a single node (convenience wrapper for selectNodes). */
  public selectNode(node: Node) {
    // Maintain backward compatibility - convert to new selectNodes method
    this.selectNodes([node], false);
  }

  /** Deselect a single node. */
  public deselectNode(node: Node) {
    if (this.selectedNodes.includes(node)) {
      console.log("SELECTION_DEBUG: Deselecting node", node.id);
      this.selectedNodes = this.selectedNodes.filter((n) => n !== node);
      node.onDeselected();

      // Update group resize/rotate
      if (this.selectedNodes.length === 0) {
        this.disableGroupResizeRotate();
      } else {
        this.updateSelectionResizeRotate();
      }
    }
  }

  /** Deselect all currently selected nodes. */
  public clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection");

    // Notify all selected nodes they're being deselected
    this.selectedNodes.forEach((node) => {
      node.onDeselected();
    });

    // Clear the selection array
    this.selectedNodes = [];

    // Disable all resize/rotate controls and connection handles - CENTRALIZED CONTROL
    this.updateSelectionResizeRotate();
  }

  /** @returns Array of currently selected nodes. */
  public getSelectedNodes(): Node[] {
    return this.selectedNodes;
  }

  // Backward compatibility
  /** @returns The first selected node, or null if none selected. */
  public getSelectedNode(): Node | null {
    return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
  }

  // ─── Serialization API ──────────────────────────────────────────────

  /**
   * Export the slate to a JSON string in v1-compatible format.
   *
   * @param nodes - Optional subset of nodes to include
   * @param asPresentation - If true, includes presentation ordering
   * @returns JSON string
   */
  public exportJSON(nodes?: Node[], asPresentation?: boolean): string {
    const json = serialize(this, nodes, asPresentation);
    return JSON.stringify(json);
  }

  /**
   * Load a v1-compatible JSON string or object into this slate.
   *
   * @param json - JSON string or SlateJSON object
   * @param preserve - If true, merge with existing nodes instead of replacing
   * @param skipZoom - If true, don't adjust zoom/pan after load
   * @param useMainCanvas - Reserved for future use
   */
  public async loadJSON(
    json: string | SlateJSON,
    preserve: boolean = false,
    skipZoom: boolean = false,
    useMainCanvas?: boolean
  ): Promise<void> {
    await deserialize(json, this, preserve, skipZoom);
  }

  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  public snapshot(): SlateJSON {
    return takeSnapshot(this);
  }

  // ─── Export API ─────────────────────────────────────────────────

  /**
   * Export the slate as an SVG string.
   */
  public svg(
    opts?: ExportOptions,
    callback?: (svg: string) => void
  ): string {
    return exportSVG(this, opts, callback);
  }

  /**
   * Export the slate as a PNG (async).
   */
  public async png(
    opts?: ExportOptions,
    callback?: (result: string | Blob) => void
  ): Promise<string | Blob> {
    return exportPNG(this, opts, callback);
  }

  /**
   * Synchronous-style PNG export (returns a Promise).
   * Alias for png() for v1 compatibility.
   */
  public pngSync(opts?: ExportOptions): Promise<string | Blob> {
    return this.png(opts);
  }

  // ─── Theme API ──────────────────────────────────────────────────

  /** Apply a theme to this slate */
  public applyTheme(
    theme: ThemeDefinition,
    syncWithTheme?: boolean,
    revertTheme?: boolean
  ): void {
    applyTheme(this, theme, syncWithTheme, revertTheme);
  }

  // ─── Layout API ─────────────────────────────────────────────────

  /** Remove overlapping nodes by pushing them apart */
  public removeLayoutOverlaps(
    enableAttraction?: boolean,
    threshold?: number
  ): void {
    removeLayoutOverlaps(this, enableAttraction, threshold);
  }

  /** Apply pre-computed layout moves */
  public applyLayout(
    moves: LayoutMove[],
    cb?: () => void,
    noAnimation?: boolean
  ): void {
    applyLayoutMoves(this, moves, cb, noAnimation);
  }

  /** Package current node positions for layout transfer */
  public packageLayout(): LayoutMove[] {
    return packageLayout(this);
  }

  // ─── Lock display API ───────────────────────────────────────────

  /** Show lock icons on all locked nodes */
  public displayLocks(): void {
    this.nodes.allNodes.forEach((node: Node) => {
      if (node.options.isLocked) {
        // Visual lock indicator could be added here
        console.log("LOCK_DEBUG: Displaying lock for", node.id);
      }
    });
  }

  /** Hide all lock icons */
  public hideLocks(): void {
    console.log("LOCK_DEBUG: Hiding all locks");
  }

  // ─── Font loading ───────────────────────────────────────────────

  /** Load all fonts used by nodes in this slate */
  public async loadAllFonts(): Promise<void> {
    await loadAllFontsForSlate(this);
  }
}
