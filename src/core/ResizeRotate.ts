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
  private _endTimer?: ReturnType<typeof setTimeout>;
  private _start?: {
    x: number;
    y: number;
    width: number;
    height: number;
    angle: number;
    localX: number;
    localY: number;
  };

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
      console.warn(
        "RESIZE_ROTATE_DEBUG: Cannot enable — target (backgroundRect) not available on",
        this.node?.id,
      );
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
          updateHandle: (
            handle: any,
            point: any,
            index: number,
            points: any[],
          ) => {
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
          ".svg_select_shape, .svg_select_shape_pointSelect",
        );
        selectionShapes.forEach((shape: SVGElement) => {
          // The Meteor host may load the JS without the optional stylesheet.
          // Give the selection polygon an actual painted stroke in that case.
          if (shape.classList.contains("svg_select_shape")) {
            shape.setAttribute("stroke", "#4A90E2");
            shape.setAttribute("stroke-width", "1.5");
            shape.setAttribute("stroke-dasharray", "5 5");
            shape.setAttribute("stroke-opacity", "0.55");
          }
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
        console.warn(
          "RESIZE_ROTATE_DEBUG: Failed to widen handle hit areas:",
          e,
        );
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
    this.target.on("beforeresize.resizerotate", (event: any) => {
      this.finish();
      const handler = event.detail.handler;
      const pointer = event.detail.event.detail.event;
      handler.preserveAspectRatio = Boolean(
        this.options.preserveAspectRatio || pointer.shiftKey,
      );
      const o = this.node.options;
      const box = this.target.bbox();
      this._start = {
        x: o.x ?? 0,
        y: o.y ?? 0,
        width: o.width ?? 0,
        height: o.height ?? 0,
        angle: o.rotate?.rotationAngle ?? 0,
        localX: box.x,
        localY: box.y,
      };
      this._interacting = true;
      this._didRotate = this._didResize = false;
      this.node.disableConnectionHandles();
      // svg.select gives resize its screen-overlay points. The plugin scales a
      // local box around the opposite handle, so that anchor must be local too.
      const points = this.target
        .remember("_selectHandler")
        ?.getHandlePoints(box);
      if (points)
        queueMicrotask(() => {
          handler.points = points;
        });
    });
    this.target.on("resize.resizerotate", (event: any) => {
      const { box, angle, eventType } = event.detail ?? {};
      const start = this._start;
      if (!start || !box) return;
      event.preventDefault(); // Slatebox owns the write; the plugin computes the gesture.
      if (eventType === "rot") {
        if (!Number.isFinite(angle) || !angle) return;
        this._didRotate = true;
        this.node.applyInteractionRotation(
          (this.node.options.rotate?.rotationAngle ?? 0) + angle,
        );
        this.options.onRotate?.(event);
      } else {
        this._didResize = true;
        // Keep the parent matrix fixed while the plugin maps screen coordinates
        // to its start box. Move every drawing and the hit target together.
        this.node.backgroundRect.move(box.x, box.y);
        this.node.resizeTarget?.move(box.x, box.y);
        this.node.setSize(box.width, box.height);
        const w = this.node.options.width ?? box.width;
        const h = this.node.options.height ?? box.height;
        const dx = box.x - start.localX + (w - start.width) / 2;
        const dy = box.y - start.localY + (h - start.height) / 2;
        const radians = (start.angle * Math.PI) / 180;
        this.node.options.x =
          start.x +
          (start.width - w) / 2 +
          Math.cos(radians) * dx -
          Math.sin(radians) * dy;
        this.node.options.y =
          start.y +
          (start.height - h) / 2 +
          Math.sin(radians) * dx +
          Math.cos(radians) * dy;
        this.node.svgGroup.fire("transform");
      }
      // The selector observes the target's attributes, not the parent matrix.
      // Update its existing polygon in place; rebuilding it interrupts a live drag.
      this.syncOverlay();
      this.options.onResize?.(event);
      this.node.slate?.notifyNodeChanged(this.node);
    });
    window.addEventListener("mouseup", this.scheduleFinish);
    window.addEventListener("touchend", this.scheduleFinish);
    window.addEventListener("touchcancel", this.scheduleFinish);
  }

  private scheduleFinish = () => {
    if (!this._interacting) return;
    clearTimeout(this._endTimer);
    // svg.resize emits a final size update from its own mouseup listener.
    this._endTimer = setTimeout(() => this.finish(), 0);
  };

  private finish() {
    clearTimeout(this._endTimer);
    if (!this._interacting) return;
    this._interacting = false;
    this._start = undefined;
    const { id, options, slate } = this.node;
    if (this._didRotate || this._didResize) {
      this.node.finalizeInteraction();
      slate?.broadcast?.(this._didRotate ? "onNodeRotated" : "onNodeResized", {
        id,
        rotate: options.rotate,
        width: options.width,
        height: options.height,
        x: options.x,
        y: options.y,
        ...(!this._didRotate && { vectorPath: options.vectorPath }),
      });
    }
    if (slate?.getSelectedNodes().includes(this.node))
      this.node.enableConnectionHandles();
    this._didRotate = this._didResize = false;
  }

  private removeEventListeners() {
    this.target.off(".resizerotate");
    window.removeEventListener("mouseup", this.scheduleFinish);
    window.removeEventListener("touchend", this.scheduleFinish);
    window.removeEventListener("touchcancel", this.scheduleFinish);
    this.finish();
  }

  public syncOverlay() {
    if (this.isActive)
      this.target.remember("_selectHandler")?.mutationHandler();
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
