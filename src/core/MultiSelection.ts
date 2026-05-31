/**
 * MultiSelection.ts - Rectangle drag selection
 *
 * Provides:
 * - Shift+click: add/remove from selection
 * - Canvas drag: rectangle selection
 * - Visual selection rectangle
 * - Group move/delete operations
 */

export interface MultiSelectionOptions {
  enabled?: boolean;
  selectionColor?: string;
  selectionOpacity?: number;
}

export class MultiSelection {
  private slate: any;
  private options: MultiSelectionOptions;
  private selectionRect: any = null;
  private startPoint: { x: number; y: number } | null = null;
  private isSelecting: boolean = false;

  constructor(slate: any, options: MultiSelectionOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: true,
      selectionColor: "#4a90e2",
      selectionOpacity: 0.15,
      ...options,
    };

    if (this.options.enabled) {
      this.bindEvents();
    }
  }

  public enable(): void {
    this.options.enabled = true;
    this.bindEvents();
  }

  public disable(): void {
    this.options.enabled = false;
    this.unbindEvents();
    this.cancelSelection();
  }

  public isEnabled(): boolean {
    return this.options.enabled!;
  }

  // ─── Event binding ───────────────────────────────────────────────

  private bindEvents(): void {
    const canvas = this.slate.canvas;
    if (!canvas) return;

    canvas.on("pointerdown.multiselect", (event: any) => {
      if (!this.options.enabled) return;

      // Only start selection on direct canvas click (not on nodes)
      const target = event.target;
      const isCanvas =
        target === canvas.node || target?.tagName === "svg";

      if (!isCanvas) return;

      // Get SVG point from pointer position
      const pt = this.getSvgPoint(event);
      if (!pt) return;

      this.startPoint = pt;
      this.isSelecting = true;

      // Create selection rectangle
      this.selectionRect = canvas
        .rect(0, 0)
        .move(pt.x, pt.y)
        .fill({
          color: this.options.selectionColor!,
          opacity: this.options.selectionOpacity!,
        })
        .stroke({
          color: this.options.selectionColor!,
          width: 1,
          dasharray: "4,4",
        })
        .attr("pointer-events", "none");
    });

    canvas.on("pointermove.multiselect", (event: any) => {
      if (!this.isSelecting || !this.startPoint || !this.selectionRect) return;

      const pt = this.getSvgPoint(event);
      if (!pt) return;

      // Calculate rectangle dimensions
      const x = Math.min(this.startPoint.x, pt.x);
      const y = Math.min(this.startPoint.y, pt.y);
      const w = Math.abs(pt.x - this.startPoint.x);
      const h = Math.abs(pt.y - this.startPoint.y);

      this.selectionRect.move(x, y).size(w, h);
    });

    canvas.on("pointerup.multiselect", (event: any) => {
      if (!this.isSelecting || !this.startPoint) return;

      const pt = this.getSvgPoint(event);
      if (!pt) return;

      // Calculate selection rectangle
      const x = Math.min(this.startPoint.x, pt.x);
      const y = Math.min(this.startPoint.y, pt.y);
      const w = Math.abs(pt.x - this.startPoint.x);
      const h = Math.abs(pt.y - this.startPoint.y);

      // Only select if rectangle is meaningful size
      if (w > 5 && h > 5) {
        this.selectNodesInRect(x, y, w, h, event.shiftKey);
      }

      this.cancelSelection();
    });
  }

  private unbindEvents(): void {
    const canvas = this.slate.canvas;
    if (!canvas) return;

    canvas.off("pointerdown.multiselect");
    canvas.off("pointermove.multiselect");
    canvas.off("pointerup.multiselect");
  }

  private cancelSelection(): void {
    this.isSelecting = false;
    this.startPoint = null;
    if (this.selectionRect) {
      this.selectionRect.remove();
      this.selectionRect = null;
    }
  }

  // ─── Node selection ──────────────────────────────────────────────

  private selectNodesInRect(
    x: number,
    y: number,
    w: number,
    h: number,
    addToSelection: boolean
  ): void {
    const nodesInRect: any[] = [];

    const allNodes = this.slate.nodes.allNodes;
    for (const node of allNodes) {
      try {
        const bbox = node.svgGroup.bbox();
        // Check if node overlaps with selection rectangle
        if (
          bbox.x < x + w &&
          bbox.x + bbox.width > x &&
          bbox.y < y + h &&
          bbox.y + bbox.height > y
        ) {
          nodesInRect.push(node);
        }
      } catch {
        // Skip nodes without valid bbox
      }
    }

    if (nodesInRect.length > 0) {
      this.slate.selectNodes(nodesInRect, addToSelection);
      console.log(
        "MULTISELECT_DEBUG: Selected",
        nodesInRect.length,
        "nodes in rectangle"
      );
    }
  }

  // ─── Helpers ─────────────────────────────────────────────────────

  private getSvgPoint(event: any): { x: number; y: number } | null {
    try {
      const canvas = this.slate.canvas;
      const svgNode = canvas.node;
      const pt = svgNode.createSVGPoint();
      pt.x = event.clientX;
      pt.y = event.clientY;
      const svgPt = pt.matrixTransform(svgNode.getScreenCTM().inverse());
      return { x: svgPt.x, y: svgPt.y };
    } catch {
      return null;
    }
  }

  // ─── Group operations ────────────────────────────────────────────

  /** Delete all selected nodes */
  public deleteSelected(): void {
    const selected = this.slate.getSelectedNodes();
    for (const node of selected) {
      this.slate.removeNode(node.id);
    }
    this.slate.clearSelection();
  }

  /** Move all selected nodes by a delta */
  public moveSelected(dx: number, dy: number): void {
    const selected = this.slate.getSelectedNodes();
    for (const node of selected) {
      const x = (node.options.x || 0) + dx;
      const y = (node.options.y || 0) + dy;
      node.position(x, y);
    }
  }
}
