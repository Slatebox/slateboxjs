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
  // Window-level drag handlers (bound only while a rubber-band is in progress) so
  // the drag survives pointer capture and the cursor leaving the SVG.
  private _winMove: ((e: PointerEvent) => void) | null = null;
  private _winUp: ((e: PointerEvent) => void) | null = null;

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
      // A view-only slate has nothing to select in bulk: a drag there pans (PanZoom).
      if (this.slate.isReadOnly?.()) return;

      // Only start selection on direct canvas click (not on nodes)
      const target = event.target;
      const isCanvas =
        target === canvas.node || target?.tagName === "svg";

      if (!isCanvas) return;
      // A finger on empty canvas pans it; the rectangle is drawn with a mouse or a pen.
      if (event.pointerType === "touch" && this.slate.panZoom?.pansByTouch?.()) return;

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

      // Track the rest of the drag on window (survives pointer capture / the
      // cursor moving over nodes or off the SVG).
      this._winMove = (e: PointerEvent) => this.onSelectMove(e);
      this._winUp = (e: PointerEvent) => this.onSelectUp(e);
      window.addEventListener("pointermove", this._winMove, true);
      window.addEventListener("pointerup", this._winUp, true);
    });
  }

  private onSelectMove(event: PointerEvent): void {
    if (!this.isSelecting || !this.startPoint || !this.selectionRect) return;
    const pt = this.getSvgPoint(event);
    if (!pt) return;
    const x = Math.min(this.startPoint.x, pt.x);
    const y = Math.min(this.startPoint.y, pt.y);
    const w = Math.abs(pt.x - this.startPoint.x);
    const h = Math.abs(pt.y - this.startPoint.y);
    this.selectionRect.move(x, y).size(w, h);
  }

  private onSelectUp(event: PointerEvent): void {
    this.detachWindowHandlers();
    if (!this.isSelecting || !this.startPoint) {
      this.cancelSelection();
      return;
    }
    const pt = this.getSvgPoint(event);
    if (pt) {
      const x = Math.min(this.startPoint.x, pt.x);
      const y = Math.min(this.startPoint.y, pt.y);
      const w = Math.abs(pt.x - this.startPoint.x);
      const h = Math.abs(pt.y - this.startPoint.y);
      if (w > 5 && h > 5) {
        this.selectNodesInRect(x, y, w, h, event.shiftKey);
      }
    }
    this.cancelSelection();
  }

  private detachWindowHandlers(): void {
    if (this._winMove) {
      window.removeEventListener("pointermove", this._winMove, true);
      this._winMove = null;
    }
    if (this._winUp) {
      window.removeEventListener("pointerup", this._winUp, true);
      this._winUp = null;
    }
  }

  private unbindEvents(): void {
    const canvas = this.slate.canvas;
    if (!canvas) return;

    canvas.off("pointerdown.multiselect");
    this.detachWindowHandlers();
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
        // The selection rect (x,y,w,h) is in SVG world coords (viewBox space).
        // node.svgGroup.bbox() is the group's LOCAL bbox (~0,0,w,h) — the wrong
        // space. Use the node's world position/size (options) instead.
        const o = node.options;
        const nx = o.x ?? 0;
        const ny = o.y ?? 0;
        const nw = o.width ?? 0;
        const nh = o.height ?? 0;
        if (nx < x + w && nx + nw > x && ny < y + h && ny + nh > y) {
          nodesInRect.push(node);
        }
      } catch {
        // Skip nodes without valid geometry
      }
    }

    if (nodesInRect.length > 0) {
      this.slate.selectNodes(nodesInRect, addToSelection);
      // A real-mouse rubber-band ends with a `click` on the canvas, which the
      // Slate canvas-click handler treats as an empty-space click and would
      // clearSelection() — wiping the selection we just made (so a following
      // drag can't group-move it). Stamp the moment so that handler skips the
      // very next canvas click. (Synthetic-event tests don't fire the click, so
      // this path was invisible to the e2e.)
      (this.slate as any)._rubberBandSelectedAt = Date.now();
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
    // A note its host governs moves only through that host's drag policy.
    const selected = (this.slate.getSelectedNodes() as any[]).filter(
      (node) => !this.slate.governanceOf?.(node)
    );
    for (const node of selected) {
      const x = (node.options.x || 0) + dx;
      const y = (node.options.y || 0) + dy;
      node.position(x, y);
    }
  }
}
