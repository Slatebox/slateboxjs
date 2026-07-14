import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";
import type { Node } from "./Node";

/**
 * Compute the L-bracket polyline points for one svg.select.js resize handle.
 * Mirrors svg.select.js' default updateHandle, but guards the divide-by-distance
 * (adjacent handle points can transiently coincide → r/c = 0 → NaN) and returns
 * `null` when any input/result is non-finite so the caller skips the plot. This
 * is what kept multi-select (Cmd+A/Cmd+D) from flooding the console with
 * "<polyline> points: Expected number, NaN" errors.
 */
export function computeSelectHandlePlot(
  point: [number, number],
  prev: [number, number],
  next: [number, number]
): Array<[number, number]> | null {
  const a = point;
  const l = [a[0] - prev[0], a[1] - prev[1]];
  const h = [a[0] - next[0], a[1] - next[1]];
  const r = Math.sqrt(l[0] * l[0] + l[1] * l[1]) || 1;
  const c = Math.sqrt(h[0] * h[0] + h[1] * h[1]) || 1;
  const d = [l[0] / r, l[1] / r];
  const u = [h[0] / c, h[1] / c];
  const p: [number, number] = [a[0] - 10 * d[0], a[1] - 10 * d[1]];
  const H: [number, number] = [a[0] - 10 * u[0], a[1] - 10 * u[1]];
  const plot: Array<[number, number]> = [p, a, H];
  const finite = plot.every(
    (pt) => Number.isFinite(pt[0]) && Number.isFinite(pt[1])
  );
  return finite ? plot : null;
}

export interface ResizeRotateOptions {
  resizeEnabled?: boolean;
  rotateEnabled?: boolean;
  preserveAspectRatio?: boolean;
  aroundCenter?: boolean;
  grid?: number;
  degree?: number;
  onResize?: (event: any) => void;
  onRotate?: (event: any) => void;
}

export class ResizeRotate {
  private node: Node;
  private target: any;
  private options: ResizeRotateOptions;
  private isActive: boolean = false;
  private _interacting = false;
  private _didRotate = false;
  private _didResize = false;
  private _endListener: (() => void) | null = null;
  // Canonical world position captured at the START of a resize/rotate, before
  // svg.resize.js displaces children in local space. Used to convert the
  // plugin's local box back to world coords in handleResize.
  private _preInteractionPos: { x: number; y: number } | null = null;

  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(node: Node, options: ResizeRotateOptions = {}) {
    this.node = node;
    // Custom vector shapes use a transparent proxy <rect> as the resize/select
    // target (the nested <svg> backgroundRect can't be resized by svg.resize.js).
    this.target = (node as any).resizeTarget ?? node.backgroundRect;
    this.options = {
      resizeEnabled: true,
      rotateEnabled: true,
      preserveAspectRatio: false,
      aroundCenter: false,
      grid: 0,
      degree: 0,
      ...options,
    };
  }

  /** Enable resize and rotate handles on the node. */
  public enable() {
    if (this.isActive) return;
    // Re-resolve in case the proxy was created after construction (custom shapes
    // build the proxy during async shape rendering).
    this.target = (this.node as any).resizeTarget ?? this.node.backgroundRect;
    // Guard: backgroundRect may not be initialized if node creation failed
    if (!this.target) {
      console.warn("RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on", this.node?.id);
      return;
    }

    try {
      // Use the correct svg.select.js API for generic shapes (rect, circle, ellipse)
      const element: any = this.target;

      // Make the whole group selectable / rotatable
      if (typeof element.select === "function") {
        element.select({
          rotationPoint: this.options.rotateEnabled,
          // svg.select.js' default updateHandle divides by the distance between
          // adjacent handle points; when a transient/degenerate bbox makes points
          // coincide (or the screenCTM collapses), that divide-by-zero plots
          // "NaN" polyline points and floods the console (notably on multi-select
          // via the keyboard). This replicates the default L-bracket exactly but
          // guards the division and never plots non-finite points.
          updateHandle: (handle: any, point: any, index: number, points: any[]) => {
            const prev = points[(index - 1 + points.length) % points.length];
            const next = points[(index + 1) % points.length];
            const plot = computeSelectHandlePlot(point, prev, next);
            if (plot) handle.plot(plot);
          },
        });
      }

      // Attach resize capability (applies a transform on the group)
      if (this.options.resizeEnabled && typeof element.resize === "function") {
        element.resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid ?? 1,
          degree: this.options.degree ?? 0.1,
        });
      }

      // Normalize plugin-generated selection UI after svg.select.js appends it.
      this.styleSelectionUi();

      // Add event listeners
      this.addEventListeners();

      this.isActive = true;
    } catch (error) {
      console.warn("Failed to enable resize/rotate:", error);
    }
  }

  /**
   * Keep svg.select.js' generated control layer non-obscuring and make the
   * L-shaped polyline handles easier to grab. These inline attributes are
   * intentional because consumers can use the built JS without loading CSS.
   */
  private styleSelectionUi() {
    // Defer to next frame — svg.select.js may not have appended handles yet
    requestAnimationFrame(() => {
      try {
        const svgNode = this.target.node;
        const root = svgNode.ownerSVGElement || svgNode;

        const selectionShapes = root.querySelectorAll(
          ".svg_select_shape, .svg_select_shape_pointSelect"
        );
        selectionShapes.forEach((shape: SVGElement) => {
          shape.setAttribute("fill", "none");
          shape.setAttribute("fill-opacity", "0");
          shape.setAttribute("pointer-events", "none");
          (shape.style as any).fill = "none";
          (shape.style as any).fillOpacity = "0";
          shape.style.pointerEvents = "none";
        });

        const handles = root.querySelectorAll(".svg_select_handle");
        handles.forEach((h: SVGElement) => {
          // Miro-style: light-blue corner/edge handles (was chunky black #333).
          // stroke-width 6 keeps them easy to grab while looking far lighter than
          // the old 8px black brackets.
          h.setAttribute("stroke-width", "6");
          h.setAttribute("stroke", "#4A90E2");
          h.style.pointerEvents = "all";
        });
      } catch (e) {
        console.warn("RESIZE_ROTATE_DEBUG: Failed to widen handle hit areas:", e);
      }
    });
  }

  /** Disable resize and rotate handles on the node. */
  public disable() {
    if (!this.isActive) return;

    try {
      const element: any = this.target;

      // Disable selection and resize if APIs are available
      if (typeof element.select === "function") {
        element.select(false);
      }
      if (typeof element.resize === "function") {
        element.resize(false);
      }

      this.removeEventListeners();
      this.isActive = false;
    } catch (error) {
      console.warn("Failed to disable resize/rotate:", error);
    }
  }

  private addEventListeners() {
    // Miro interaction contract: resize freely by default; hold Shift when the
    // drag begins to preserve the current proportions. The plugin exposes its
    // live handler in `beforeresize`, before it snapshots the starting box.
    this.target.on("beforeresize.resizerotate", (event: any) => {
      const handler = event.detail?.handler;
      const pointerEvent = event.detail?.event?.detail?.event;
      if (handler) {
        handler.preserveAspectRatio = Boolean(
          this.options.preserveAspectRatio || pointerEvent?.shiftKey
        );
      }
    });

    // Hide connection handles when resize/rotate starts
    this.target.on("mousedown.resizerotate touchstart.resizerotate", (event: any) => {
      // Check if the event is on a resize/rotate handle
      if (this.isResizeRotateHandle(event.target)) {
        if (this.node.isConnectionHandlesEnabled()) {
          this.node.disableConnectionHandles();
        }
        this._interacting = true;
        this._didRotate = false;
        this._didResize = false;
      }
    });

    // Emit the v1 end-of-interaction package once, on pointer release
    this._endListener = () => {
      if (!this._interacting) return;
      this._interacting = false;
      // Re-assert the canonical model: strip rotation baked into the shape/text
      // during the interaction and move it to the group transform, with children
      // normalized back to the local origin. This is what makes resize/rotate
      // survive a reload without the node flying off-screen.
      if ((this._didRotate || this._didResize) && this.node.finalizeInteraction) {
        this.node.finalizeInteraction();
      }
      this._preInteractionPos = null;
      const slate = this.node.slate as any;
      if (this._didRotate) {
        slate?.broadcast?.("onNodeRotated", {
          id: this.node.id,
          rotate: this.node.options.rotate,
          width: this.node.options.width,
          height: this.node.options.height,
        });
      } else if (this._didResize) {
        slate?.broadcast?.("onNodeResized", {
          id: this.node.id,
          width: this.node.options.width,
          height: this.node.options.height,
          rotate: this.node.options.rotate,
          vectorPath: this.node.options.vectorPath,
        });
        // Re-fit the text once the resize has FULLY settled. During the drag,
        // fitTextToNode (via centerText in setSize) measures transient, mid-rewrap
        // geometry and can leave the text unscaled/overflowing on a shrunk node. A
        // final centerText on the reflowed DOM applies the correct fit (Miro-style).
        requestAnimationFrame(() => {
          try {
            this.node.centerText?.();
          } catch (e) {
            /* noop */
          }
        });
      }
      this._didRotate = false;
      this._didResize = false;
    };
    window.addEventListener("pointerup", this._endListener);
    window.addEventListener("touchend", this._endListener);

    // Re-show connection handles when resize/rotate ends
    this.target.on("resize", (event: any) => {
      // Capture the canonical world position ONCE, before svg.resize.js has
      // displaced any children this interaction (handleResize converts the
      // plugin's local box against this).
      if (this._preInteractionPos === null) {
        this._preInteractionPos = {
          x: this.node.options.x ?? 0,
          y: this.node.options.y ?? 0,
        };
      }
      // A resize event means an interaction is in progress (the handle's own
      // mousedown does not reliably bubble through the target); track its
      // kind for the end-of-drag package
      this._interacting = true;
      // svg.resize.js includes an angle field on plain resize events too —
      // only a non-zero angle indicates actual rotation; a box indicates
      // a size change
      if (event.detail?.box) {
        this._didResize = true;
      }
      if (
        typeof event.detail?.angle === "number" &&
        event.detail.angle !== 0
      ) {
        this._didRotate = true;
      }

      this.handleResize(event);
      this.options.onResize?.(event);

      // Re-enable connection handles after resize completes
      if (this.node.slate && this.node.slate.getSelectedNodes().includes(this.node)) {
        // Only re-enable if this node is still selected
        setTimeout(() => {
          this.node.enableConnectionHandles();
        }, 50);
      }

      // Notify slate of node change (for BirdsEye refresh)
      this.node.slate?.notifyNodeChanged(this.node);
    });
  }

  private isResizeRotateHandle(target: any): boolean {
    if (!target || !target.classList) return false;

    const handleClasses = [
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
    ];

    for (const className of handleClasses) {
      if (target.classList.contains(className)) {
        return true;
      }
    }

    return false;
  }

  private removeEventListeners() {
    this.target.off("resize");
    this.target.off("beforeresize.resizerotate");
    this.target.off("mousedown.resizerotate touchstart.resizerotate");
    if (this._endListener) {
      window.removeEventListener("pointerup", this._endListener);
      window.removeEventListener("touchend", this._endListener);
      this._endListener = null;
    }
  }

  private handleResize(event: any) {
    // The resize plugin emits the final box in event.detail.box
    if (event.detail && event.detail.box) {
      const box = event.detail.box as any;

      // Persist and recentre text since we change actual width/height of shape
      this.node.options.width = box.width;
      this.node.options.height = box.height;
      // svg.resize.js reports box.x/y in the group's LOCAL space (children are
      // normalized to the local origin at interaction start). Convert to a WORLD
      // position: pre-interaction world + local delta. Storing box.x directly
      // would write a local coord into options.x and get double-counted against
      // the group translate on reload (node flies off-screen).
      const base = this._preInteractionPos ?? {
        x: this.node.options.x ?? 0,
        y: this.node.options.y ?? 0,
      };
      this.node.options.x = base.x + box.x;
      this.node.options.y = base.y + box.y;

      // Call setSize to update nested SVG and other elements
      this.node.setSize(box.width, box.height);

      this.node.centerText();

      // Connectors follow LIVE during resize (M7): svg.connectable re-solves on
      // a "transform" event on the connected group. handleResize runs each
      // resize frame, so fire it here to re-layout attached lines in real time
      // (previously they only updated at the end of the interaction).
      try {
        this.node.svgGroup?.fire?.("transform");
      } catch (e) {
        /* noop */
      }

      // If a rotation happened, the resize event carries angle (delta)
      // svg.resize.js applies rotation incrementally to backgroundRect
      // We need to read the ACTUAL cumulative rotation from backgroundRect.transform()
      if (event.detail && typeof event.detail.angle === "number") {
        const deltaAngle = event.detail.angle as number;

        // Read the cumulative rotation from backgroundRect (where svg.resize.js applies it)
        let backgroundRectRotation = 0;
        try {
          const targetTransform = this.target.transform();
          backgroundRectRotation = targetTransform?.rotate || 0;
        } catch (e) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read backgroundRect rotation:", e);
        }

        // Also get any existing rotation on svgGroup (from setRotation, e.g., duplicated nodes)
        let existingSvgGroupRotation = 0;
        try {
          const groupTransform = this.node.svgGroup.transform();
          existingSvgGroupRotation = groupTransform?.rotate || 0;
        } catch (e) {
          console.warn("RESIZE_ROTATE_DEBUG: Failed to read svgGroup rotation:", e);
        }

        // Total rotation = svgGroup rotation + backgroundRect rotation
        const totalRotation = existingSvgGroupRotation + backgroundRectRotation;

        // Store the rotation angle - create the rotate object if it doesn't exist
        if (!this.node.options.rotate) {
          this.node.options.rotate = { rotationAngle: 0 };
        }
        this.node.options.rotate.rotationAngle = totalRotation;

        // Rotate content elements to match background rotation
        // Use deltaAngle because content elements are children of svgGroup
        // and we're applying incremental rotation to match backgroundRect
        if (
          this.node.textElement &&
          typeof this.node.textElement.rotate === "function"
        ) {
          // For regular nodes: rotate text element
          const bbox = this.target.bbox();
          this.node.textElement.rotate(deltaAngle, bbox.cx, bbox.cy);
        } else if (
          this.node.nestedSvg &&
          typeof this.node.nestedSvg.rotate === "function"
        ) {
          // For SVG content nodes: rotate nested SVG
          const bbox = this.target.bbox();
          this.node.nestedSvg.rotate(deltaAngle, bbox.cx, bbox.cy);
        }
      }
    }
  }

  public isEnabled(): boolean {
    return this.isActive;
  }

  /** Destroy the resize/rotate instance, disabling all plugins and clearing references */
  public destroy(): void {
    this.disable();
    (this as any).node = null;
    this.target = null;
  }

  public updateOptions(options: Partial<ResizeRotateOptions>) {
    this.options = { ...this.options, ...options };

    if (this.isActive) {
      // Reapply with new options
      this.disable();
      this.enable();
    }
  }

  public refresh() {
    // Force a refresh of resize/rotate handles by disabling and re-enabling
    // This is necessary after operations like drag that change position
    if (this.isActive) {
      this.disable();
      this.enable();
    }
  }
}
