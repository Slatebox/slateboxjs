import { SVG, Svg, Rect, Element } from "@svgdotjs/svg.js";
import type { Slate } from "./Slate";
import type { Node } from "./Node";

export interface BirdsEyeOptions {
  enabled?: boolean;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  width?: number;
  height?: number;
  backgroundColor?: string;
  viewportColor?: string;
  viewportBorderColor?: string;
  nodeColor?: string;
  borderRadius?: number;
  margin?: number;
  showZoomControls?: boolean;  // Show +/- zoom buttons below minimap
}

export class BirdsEye {
  private slate: Slate;
  private options: BirdsEyeOptions;
  private container: HTMLDivElement | null = null;
  private miniCanvas: Svg | null = null;
  private viewportIndicator: Rect | null = null;
  private nodeShapes: Map<string, Element> = new Map();
  private _enabled: boolean = false;
  private isDragging: boolean = false;
  private scale: number = 0.1;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  private viewportStartX: number = 0;
  private viewportStartY: number = 0;
  private zoomControlsContainer: HTMLDivElement | null = null;

  // Event handler references for cleanup
  private boundMouseMove: ((e: MouseEvent) => void) | null = null;
  private boundMouseUp: ((e: MouseEvent) => void) | null = null;

  constructor(slate: Slate, options: BirdsEyeOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: false,
      position: "bottom-right",  // Miro-style: bottom-right by default
      width: 200,
      height: 150,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      viewportColor: "rgba(66, 133, 244, 0.3)",
      viewportBorderColor: "#4285f4",
      nodeColor: "#666666",
      borderRadius: 4,
      margin: 10,
      showZoomControls: true,  // Show zoom controls by default
      ...options,
    };
  }

  public enable(): void {
    if (this._enabled) return;
    this._enabled = true;

    this.createContainer();
    this.createMiniCanvas();
    this.renderNodes();
    this.createViewportIndicator();
    this.setupEventListeners();
    this.updateViewport();

    // Create zoom controls if enabled
    if (this.options.showZoomControls) {
      this.createZoomControls();
    }

    console.log("BIRDSEYE_DEBUG: BirdsEye enabled");
  }

  public disable(): void {
    if (!this._enabled) return;
    this._enabled = false;

    this.removeEventListeners();
    this.removeZoomControls();

    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }

    this.container = null;
    this.miniCanvas = null;
    this.viewportIndicator = null;
    this.nodeShapes.clear();

    console.log("BIRDSEYE_DEBUG: BirdsEye disabled");
  }

  public isEnabled(): boolean {
    return this._enabled;
  }

  public refresh(): void {
    if (!this._enabled) return;

    // Re-render all nodes
    this.renderNodes();
    this.updateViewport();
  }

  public updateViewport(): void {
    if (!this._enabled || !this.viewportIndicator || !this.miniCanvas) return;

    const panZoom = this.slate.panZoom;
    if (!panZoom) return;

    // Get current viewport state from main canvas
    const zoom = panZoom.getZoom() || 1;
    const pan = panZoom.getPan() || { x: 0, y: 0 };

    // Get the main canvas dimensions
    const viewportWidth = this.options.width! || 200;
    const viewportHeight = this.options.height! || 150;

    // Calculate content bounds for scaling
    const bounds = this.calculateContentBounds();

    // Calculate the scale to fit content in minimap
    const contentWidth = Math.max(bounds.maxX - bounds.minX, 1);
    const contentHeight = Math.max(bounds.maxY - bounds.minY, 1);

    // Add padding to bounds
    const padding = 100;
    const totalWidth = contentWidth + padding * 2;
    const totalHeight = contentHeight + padding * 2;

    // Calculate scale to fit content
    this.scale = Math.min(
      viewportWidth / totalWidth,
      viewportHeight / totalHeight
    );

    // Get visible area in main canvas coordinates
    const visibleWidth =
      (this.slate.options.viewPort?.originalWidth || 800) / zoom;
    const visibleHeight =
      (this.slate.options.viewPort?.originalHeight || 600) / zoom;

    // Calculate viewport indicator position in minimap coordinates
    // pan.x/pan.y are the viewbox origin (top-left of visible area in world coords)
    // Minimap coordinate 0 corresponds to (minX - padding) in world coords
    // So: minimapX = (worldX - minX + padding) * scale
    const viewportX = (pan.x - bounds.minX + padding) * this.scale;
    const viewportY = (pan.y - bounds.minY + padding) * this.scale;
    const viewportW = visibleWidth * this.scale;
    const viewportH = visibleHeight * this.scale;

    // Update the viewport indicator
    this.viewportIndicator.move(viewportX, viewportY);
    this.viewportIndicator.size(Math.max(viewportW, 10), Math.max(viewportH, 10));
  }

  public updateNodePosition(node: Node): void {
    if (!this._enabled) return;

    const shape = this.nodeShapes.get(node.id);
    if (!shape) return;

    // Get the bounds for proper positioning
    const bounds = this.calculateContentBounds();
    const padding = 100;

    // Update shape position (Q4: animate so the minimap glides when nodes change)
    const x = (node.options.x! - bounds.minX + padding) * this.scale;
    const y = (node.options.y! - bounds.minY + padding) * this.scale;

    this.animateShapeMove(shape as any, x, y);
  }

  /**
   * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
   * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
   */
  private animateShapeMove(shape: any, x: number, y: number, duration = 220): void {
    if (typeof requestAnimationFrame === "undefined") {
      try {
        shape.move(x, y);
      } catch (e) {
        /* noop */
      }
      return;
    }
    let fromX = x;
    let fromY = y;
    try {
      fromX = shape.x();
      fromY = shape.y();
    } catch (e) {
      /* noop */
    }
    if (shape._beRaf) {
      try {
        cancelAnimationFrame(shape._beRaf);
      } catch (e) {
        /* noop */
      }
    }
    const ease = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    let startTs: number | null = null;
    const tick = (now: number) => {
      if (startTs === null) startTs = now;
      const p = Math.min(1, (now - startTs) / duration);
      const e = ease(p);
      try {
        shape.move(fromX + (x - fromX) * e, fromY + (y - fromY) * e);
      } catch (err) {
        /* noop */
      }
      if (p < 1) shape._beRaf = requestAnimationFrame(tick);
      else shape._beRaf = null;
    };
    shape._beRaf = requestAnimationFrame(tick);
  }

  public addNodeShape(node: Node): void {
    if (!this._enabled || !this.miniCanvas) return;

    const bounds = this.calculateContentBounds();
    const padding = 100;

    const x = (node.options.x! - bounds.minX + padding) * this.scale;
    const y = (node.options.y! - bounds.minY + padding) * this.scale;
    const w = (node.options.width || 100) * this.scale;
    const h = (node.options.height || 60) * this.scale;

    let shape: Element;
    if (node.options.shape === "circle") {
      const radius = Math.min(w, h) / 2;
      shape = this.miniCanvas.circle(radius * 2).move(x, y);
    } else {
      shape = this.miniCanvas.rect(w, h).move(x, y);
    }

    shape.fill(node.options.backgroundColor || this.options.nodeColor!);
    shape.stroke({ width: 0 });

    this.nodeShapes.set(node.id, shape);

    // Q4: fade the new shape in.
    try {
      shape.opacity(0);
      (shape as any).animate(220).opacity(1);
    } catch (e) {
      /* noop */
    }

    // Ensure viewport indicator stays on top
    if (this.viewportIndicator) {
      this.viewportIndicator.front();
    }
  }

  public removeNodeShape(nodeId: string): void {
    const shape = this.nodeShapes.get(nodeId);
    if (shape) {
      // Q4: fade out, then remove.
      try {
        if ((shape as any)._beRaf) cancelAnimationFrame((shape as any)._beRaf);
        (shape as any)
          .animate(180)
          .opacity(0)
          .after(() => {
            try {
              shape.remove();
            } catch (e) {
              /* noop */
            }
          });
      } catch (e) {
        try {
          shape.remove();
        } catch (err) {
          /* noop */
        }
      }
      this.nodeShapes.delete(nodeId);
    }
  }

  private createContainer(): void {
    this.container = document.createElement("div");
    this.container.className = "slateboxjs-birdseye";

    // Position the container
    const position = this.options.position || "bottom-right";
    const margin = this.options.margin || 10;

    this.container.style.position = "absolute";
    this.container.style.width = `${this.options.width}px`;
    this.container.style.height = `${this.options.height}px`;
    this.container.style.backgroundColor = this.options.backgroundColor!;
    this.container.style.borderRadius = `${this.options.borderRadius}px`;
    this.container.style.border = "1px solid #ccc";
    this.container.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    this.container.style.overflow = "hidden";
    this.container.style.zIndex = "100";

    // Set position based on option
    switch (position) {
      case "top-left":
        this.container.style.top = `${margin}px`;
        this.container.style.left = `${margin}px`;
        break;
      case "top-right":
        this.container.style.top = `${margin}px`;
        this.container.style.right = `${margin}px`;
        break;
      case "bottom-left":
        this.container.style.bottom = `${margin}px`;
        this.container.style.left = `${margin}px`;
        break;
      case "bottom-right":
      default:
        this.container.style.bottom = `${margin}px`;
        this.container.style.right = `${margin}px`;
        break;
    }

    // Add to slate element
    this.slate.element.appendChild(this.container);
  }

  private createMiniCanvas(): void {
    if (!this.container) return;

    this.miniCanvas = SVG()
      .addTo(this.container)
      .size(this.options.width!, this.options.height!);

    // Set a light background
    this.miniCanvas.rect(this.options.width!, this.options.height!).fill("#f8f9fa");
  }

  private renderNodes(): void {
    if (!this.miniCanvas) return;

    // Clear existing node shapes
    this.nodeShapes.forEach((shape) => shape.remove());
    this.nodeShapes.clear();

    // Calculate bounds and scale
    const bounds = this.calculateContentBounds();
    const padding = 100;
    const contentWidth = Math.max(bounds.maxX - bounds.minX, 1);
    const contentHeight = Math.max(bounds.maxY - bounds.minY, 1);
    const totalWidth = contentWidth + padding * 2;
    const totalHeight = contentHeight + padding * 2;

    this.scale = Math.min(
      this.options.width! / totalWidth,
      this.options.height! / totalHeight
    );

    // Render each node
    const nodes = this.slate.getAllNodes();
    nodes.forEach((node) => {
      const x = (node.options.x! - bounds.minX + padding) * this.scale;
      const y = (node.options.y! - bounds.minY + padding) * this.scale;
      const w = Math.max((node.options.width || 100) * this.scale, 2);
      const h = Math.max((node.options.height || 60) * this.scale, 2);

      let shape: Element;
      if (node.options.shape === "circle") {
        const radius = Math.min(w, h) / 2;
        shape = this.miniCanvas!.circle(radius * 2).move(x, y);
      } else {
        shape = this.miniCanvas!.rect(w, h).move(x, y);
      }

      shape.fill(node.options.backgroundColor || this.options.nodeColor!);
      shape.stroke({ width: 0 });

      // Apply rotation if the node is rotated
      const rotationAngle = node.options.rotate?.rotationAngle || 0;
      if (rotationAngle !== 0) {
        // Rotate around the center of the shape
        const cx = x + w / 2;
        const cy = y + h / 2;
        (shape as any).rotate(rotationAngle, cx, cy);
      }

      this.nodeShapes.set(node.id, shape);
    });
  }

  private createViewportIndicator(): void {
    if (!this.miniCanvas) return;

    this.viewportIndicator = this.miniCanvas
      .rect(50, 40)
      .fill(this.options.viewportColor!)
      .stroke({ color: this.options.viewportBorderColor!, width: 2 })
      .css({ cursor: "move" });

    // Make it draggable
    this.viewportIndicator.on("mousedown", (e: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const mouseEvent = e as MouseEvent;
      this.isDragging = true;
      this.dragStartX = mouseEvent.clientX;
      this.dragStartY = mouseEvent.clientY;

      // Store current viewport position
      const bbox = this.viewportIndicator!.bbox();
      this.viewportStartX = bbox.x;
      this.viewportStartY = bbox.y;

      // Add temporary listeners
      this.boundMouseMove = this.handleMouseMove.bind(this);
      this.boundMouseUp = this.handleMouseUp.bind(this);
      document.addEventListener("mousemove", this.boundMouseMove);
      document.addEventListener("mouseup", this.boundMouseUp);
    });
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.isDragging || !this.viewportIndicator) return;

    const deltaX = e.clientX - this.dragStartX;
    const deltaY = e.clientY - this.dragStartY;

    // Move viewport indicator
    const newX = this.viewportStartX + deltaX;
    const newY = this.viewportStartY + deltaY;
    this.viewportIndicator.move(newX, newY);

    // Convert minimap movement to main canvas pan
    // Scale factor converts minimap coords to main canvas coords
    const bounds = this.calculateContentBounds();
    const padding = 100;

    // Calculate new pan position (inverse of updateViewport formula)
    // minimapX = (panX - minX + padding) * scale
    // Solving for panX: panX = (minimapX / scale) + minX - padding
    const panX = (newX / this.scale) + bounds.minX - padding;
    const panY = (newY / this.scale) + bounds.minY - padding;

    this.slate.panZoom?.pan({ x: panX, y: panY });
  }

  private handleMouseUp(): void {
    this.isDragging = false;

    // Remove temporary listeners
    if (this.boundMouseMove) {
      document.removeEventListener("mousemove", this.boundMouseMove);
      this.boundMouseMove = null;
    }
    if (this.boundMouseUp) {
      document.removeEventListener("mouseup", this.boundMouseUp);
      this.boundMouseUp = null;
    }
  }

  private setupEventListeners(): void {
    // Listen for pan/zoom changes on canvas (these events DO work on canvas)
    if (this.slate.canvas) {
      // Subscribe to panzoom events if available
      (this.slate.canvas as any).on?.("zoom.birdseye", () => {
        this.updateViewport();
      });

      (this.slate.canvas as any).on?.("panning.birdseye", () => {
        this.updateViewport();
      });

      // Also listen for panEnd which is more reliable
      (this.slate.canvas as any).on?.("panEnd.birdseye", () => {
        this.updateViewport();
      });

      // Note: Node drag/resize events don't bubble to canvas in SVG.js
      // Instead, Slate.notifyNodeChanged() calls scheduleRefresh() directly
    }

    // We'll also poll for changes as a fallback
    this.startPolling();
  }

  private refreshTimeoutId: number | null = null;

  /**
   * Schedule a refresh using trailing-edge debounce.
   * Waits until events settle (300ms of no activity) before refreshing.
   * This avoids unnecessary updates during continuous operations like rotation.
   */
  public scheduleRefresh(): void {
    // Clear any pending refresh
    if (this.refreshTimeoutId !== null) {
      window.clearTimeout(this.refreshTimeoutId);
    }

    // Schedule refresh after events settle
    this.refreshTimeoutId = window.setTimeout(() => {
      this.refresh();
      this.refreshTimeoutId = null;
    }, 300);
  }

  private removeEventListeners(): void {
    // Remove temporary document-level drag listeners (may still be attached
    // if mousedown fired without a matching mouseup, e.g. focus loss)
    if (this.boundMouseMove) {
      document.removeEventListener("mousemove", this.boundMouseMove);
      this.boundMouseMove = null;
    }
    if (this.boundMouseUp) {
      document.removeEventListener("mouseup", this.boundMouseUp);
      this.boundMouseUp = null;
    }
    this.isDragging = false;

    // Remove canvas event listeners (using namespaced events)
    if (this.slate.canvas) {
      (this.slate.canvas as any).off?.(".birdseye");
    }

    // Clear any pending refresh
    if (this.refreshTimeoutId !== null) {
      window.clearTimeout(this.refreshTimeoutId);
      this.refreshTimeoutId = null;
    }

    this.stopPolling();
  }

  private pollIntervalId: number | null = null;

  private startPolling(): void {
    // Poll for viewport changes every 100ms as a fallback
    this.pollIntervalId = window.setInterval(() => {
      if (this._enabled) {
        this.updateViewport();
      }
    }, 100);
  }

  private stopPolling(): void {
    if (this.pollIntervalId !== null) {
      window.clearInterval(this.pollIntervalId);
      this.pollIntervalId = null;
    }
  }

  private createZoomControls(): void {
    if (!this.container) return;

    // Create zoom controls bar below the minimap (Miro style)
    this.zoomControlsContainer = document.createElement("div");
    this.zoomControlsContainer.className = "slateboxjs-birdseye-zoom-controls";
    this.zoomControlsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      background: rgba(255, 255, 255, 0.95);
      border-top: 1px solid #e0e0e0;
      border-radius: 0 0 ${this.options.borderRadius}px ${this.options.borderRadius}px;
    `;

    // Zoom out button
    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.textContent = "−";
    zoomOutBtn.title = "Zoom Out";
    zoomOutBtn.style.cssText = this.getZoomButtonStyle();
    zoomOutBtn.addEventListener("click", () => this.slate.panZoom?.zoomOut());
    this.zoomControlsContainer.appendChild(zoomOutBtn);

    // Zoom percentage display
    const zoomDisplay = document.createElement("span");
    zoomDisplay.id = "birdseye-zoom-display";
    zoomDisplay.style.cssText = `
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: #333;
      min-width: 45px;
      text-align: center;
      cursor: pointer;
    `;
    zoomDisplay.textContent = "100%";
    zoomDisplay.title = "Reset to 100%";
    zoomDisplay.addEventListener("click", () => {
      this.slate.panZoom?.reset();
      this.updateZoomDisplay();
    });
    this.zoomControlsContainer.appendChild(zoomDisplay);

    // Zoom in button
    const zoomInBtn = document.createElement("button");
    zoomInBtn.textContent = "+";
    zoomInBtn.title = "Zoom In";
    zoomInBtn.style.cssText = this.getZoomButtonStyle();
    zoomInBtn.addEventListener("click", () => this.slate.panZoom?.zoomIn());
    this.zoomControlsContainer.appendChild(zoomInBtn);

    // Append to container
    this.container.appendChild(this.zoomControlsContainer);

    // Start updating zoom display
    this.startZoomDisplayUpdates();
  }

  private getZoomButtonStyle(): string {
    return `
      width: 28px;
      height: 28px;
      border: 1px solid #e0e0e0;
      background: #f8f9fa;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    `;
  }

  private updateZoomDisplay(): void {
    const display = this.container?.querySelector("#birdseye-zoom-display") as HTMLElement;
    if (display && this.slate.panZoom) {
      const zoom = this.slate.panZoom.getZoom() || 1;
      display.textContent = `${Math.round(zoom * 100)}%`;
    }
  }

  private zoomDisplayIntervalId: number | null = null;

  private startZoomDisplayUpdates(): void {
    // Update zoom display periodically
    this.zoomDisplayIntervalId = window.setInterval(() => {
      if (this._enabled) {
        this.updateZoomDisplay();
      }
    }, 200);
  }

  private removeZoomControls(): void {
    if (this.zoomDisplayIntervalId !== null) {
      window.clearInterval(this.zoomDisplayIntervalId);
      this.zoomDisplayIntervalId = null;
    }

    if (this.zoomControlsContainer && this.zoomControlsContainer.parentNode) {
      this.zoomControlsContainer.parentNode.removeChild(this.zoomControlsContainer);
      this.zoomControlsContainer = null;
    }
  }

  private calculateContentBounds(): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    const nodes = this.slate.getAllNodes();

    if (nodes.length === 0) {
      // Return default viewport bounds if no nodes
      const width = this.slate.options.viewPort?.originalWidth || 800;
      const height = this.slate.options.viewPort?.originalHeight || 600;
      return { minX: 0, minY: 0, maxX: width, maxY: height };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    nodes.forEach((node) => {
      const x = node.options.x || 0;
      const y = node.options.y || 0;
      const w = node.options.width || 100;
      const h = node.options.height || 60;

      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x + w);
      maxY = Math.max(maxY, y + h);
    });

    // Frame the ACTUAL node content (M5). Do NOT expand to include the origin
    // (0,0) or the viewport size — nodes live far out in world space (~10000),
    // so forcing origin into the bounds spanned 0→10000 and shoved the content
    // into the far bottom-right corner / off the minimap. The per-node padding
    // in the placement math centers the content Miro-style.
    return { minX, minY, maxX, maxY };
  }
}
