import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";
import type { Node } from "./Node";

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

  /**
   * Creates resize/rotate handle management for a node.
   *
   * @param node    - The parent Node instance
   * @param options - Resize/rotate configuration
   */
  constructor(node: Node, options: ResizeRotateOptions = {}) {
    this.node = node;
    this.target = node.backgroundRect;
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
        element.select({ rotationPoint: this.options.rotateEnabled });
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
          h.setAttribute("stroke-width", "8");
          h.setAttribute("stroke", "#333");
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
    // Hide connection handles when resize/rotate starts
    this.target.on("mousedown.resizerotate touchstart.resizerotate", (event: any) => {
      // Check if the event is on a resize/rotate handle
      if (this.isResizeRotateHandle(event.target)) {
        if (this.node.isConnectionHandlesEnabled()) {
          this.node.disableConnectionHandles();
        }
      }
    });

    // Re-show connection handles when resize/rotate ends
    this.target.on("resize", (event: any) => {
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
    this.target.off("mousedown.resizerotate touchstart.resizerotate");
  }

  private handleResize(event: any) {
    // The resize plugin emits the final box in event.detail.box
    if (event.detail && event.detail.box) {
      const box = event.detail.box as any;

      // Persist and recentre text since we change actual width/height of shape
      this.node.options.width = box.width;
      this.node.options.height = box.height;
      this.node.options.x = box.x;
      this.node.options.y = box.y;

      // Call setSize to update nested SVG and other elements
      this.node.setSize(box.width, box.height);

      this.node.centerText();

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
