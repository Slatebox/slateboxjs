import { SVG, Svg } from "@svgdotjs/svg.js";
import { Node } from "./Node";
import { NodesManager } from "./NodesManager";
import { Invoker } from "./Invoker";
import { PanZoom, PanZoomOptions } from "./PanZoom";

export interface SlateOptions {
  name?: string;
  description?: string;
  followMe?: boolean;
  mindMapMode?: boolean;
  autoResizeNodesBasedOnText?: boolean;
  viewPort?: {
    originalWidth?: number;
    originalHeight?: number;
    showGrid?: boolean;
    snapToObjects?: boolean;
    showCoordinates?: boolean;
  };
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
  defaultLineColor?: string;
  themeId?: string;
  layoutType?: "manual" | "auto";
  disableAutoLayoutOfManuallyPositionedNodes?: boolean;
  huddleType?: "none" | "basic" | "advanced";
  huddleEnabled?: boolean;
  tags?: string[];
  templateMarkdown?: string;
  templatePrompt?: string;
  isTemplate?: boolean;
  ai?: any;
  panZoom?: PanZoomOptions;
}

export class Slate {
  public element: HTMLElement;
  public canvas!: Svg;
  public nodes!: NodesManager;
  public invoker!: Invoker;
  public panZoom!: PanZoom;
  public options: SlateOptions;
  private selectedNodes: Node[] = [];
  private groupResizeRotate: any = null; // Will hold the group resize/rotate controller

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

    // Make canvas responsive
    this.makeResponsive();

    // Add coordinate display element after pan/zoom is ready
    if (this.options.viewPort?.showCoordinates) {
      setTimeout(() => this.addCoordinateDisplay(), 150);
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
    console.log("COORD_DEBUG: Starting coordinate polling");

    // Poll every 200ms to update coordinates (reduced frequency)
    setInterval(() => {
      this.updateCoordinateDisplay();
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

  public addNode(options: any = {}) {
    return this.nodes.add(options);
  }

  public removeNode(id: string) {
    return this.nodes.remove(id);
  }

  public getNode(id: string) {
    return this.nodes.one(id);
  }

  public getAllNodes(): Node[] {
    return this.nodes.allNodes;
  }

  // Get the pan/zoom viewport for adding content that should pan/zoom
  public getViewport(): any {
    // SVG.js panzoom works directly with root canvas - no viewport nesting needed!
    console.log("VIEWPORT_DEBUG: Using root canvas (SVG.js panzoom)");
    return this.canvas;
  }

  // Get viewport with retry logic for proper initialization
  public getViewportAsync(): Promise<any> {
    // SVG.js panzoom works directly with root canvas - immediate return
    console.log(
      "VIEWPORT_DEBUG: Returning root canvas immediately (SVG.js panzoom)"
    );
    return Promise.resolve(this.canvas);
  }

  // Pan/Zoom API methods
  public enablePanZoom() {
    this.panZoom.enable();
  }

  public disablePanZoom() {
    this.panZoom.disable();
  }

  public enablePan() {
    this.panZoom.enablePan();
  }

  public disablePan() {
    this.panZoom.disablePan();
  }

  public enableZoom() {
    this.panZoom.enableZoom();
  }

  public disableZoom() {
    this.panZoom.disableZoom();
  }

  public pan(point: { x: number; y: number }) {
    this.panZoom.pan(point);
  }

  public panBy(delta: { x: number; y: number }) {
    this.panZoom.panBy(delta);
  }

  public zoom(level: number) {
    this.panZoom.zoom(level);
  }

  public zoomBy(factor: number) {
    this.panZoom.zoomBy(factor);
  }

  public zoomIn() {
    this.panZoom.zoomIn();
  }

  public zoomOut() {
    this.panZoom.zoomOut();
  }

  public zoomAtPoint(level: number, point: { x: number; y: number }) {
    this.panZoom.zoomAtPoint(level, point);
  }

  public resetPanZoom() {
    this.panZoom.reset();
  }

  public resetZoom() {
    this.panZoom.resetZoom();
  }

  public resetPan() {
    this.panZoom.resetPan();
  }

  public fitToContent() {
    this.panZoom.fit();
  }

  public centerContent() {
    this.panZoom.center();
  }

  public getZoom(): number {
    return this.panZoom.getZoom();
  }

  public getPan(): { x: number; y: number } {
    return this.panZoom.getPan();
  }

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

  // New multi-node selection method - SINGLE ORCHESTRATOR
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

  public selectNode(node: Node) {
    // Maintain backward compatibility - convert to new selectNodes method
    this.selectNodes([node], false);
  }

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

  public getSelectedNodes(): Node[] {
    return this.selectedNodes;
  }

  // Backward compatibility
  public getSelectedNode(): Node | null {
    return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
  }
}
