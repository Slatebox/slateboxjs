import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";

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
  private node: any;
  private target: any;
  private options: ResizeRotateOptions;
  private isActive: boolean = false;

  constructor(node: any, options: ResizeRotateOptions = {}) {
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

  public enable() {
    if (this.isActive) return;

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

      // Add event listeners
      this.addEventListeners();

      this.isActive = true;
    } catch (error) {
      console.warn("Failed to enable resize/rotate:", error);
    }
  }

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
        console.log("RESIZE_ROTATE_DEBUG: Handle interaction started, hiding connection handles");
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
      console.log("RESIZE_ROTATE_DEBUG: Resize complete, re-enabling connection handles");
      if (this.node.slate && this.node.slate.getSelectedNodes().includes(this.node)) {
        // Only re-enable if this node is still selected
        setTimeout(() => {
          this.node.enableConnectionHandles();
        }, 50);
      }
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

      // If a rotation happened, the resize event carries angle
      if (event.detail && typeof event.detail.angle === "number") {
        const angle = event.detail.angle as number;

        if (this.node.options.rotate) {
          this.node.options.rotate.rotationAngle = angle;
        }

        // Rotate content elements to match background rotation
        if (
          this.node.textElement &&
          typeof this.node.textElement.rotate === "function"
        ) {
          // For regular nodes: rotate text element
          const bbox = this.target.bbox();
          this.node.textElement.rotate(angle, bbox.cx, bbox.cy);
        } else if (
          this.node.nestedSvg &&
          typeof this.node.nestedSvg.rotate === "function"
        ) {
          // For SVG content nodes: rotate nested SVG
          const bbox = this.target.bbox();
          this.node.nestedSvg.rotate(angle, bbox.cx, bbox.cy);
        }
      }
    }
  }

  public isEnabled(): boolean {
    return this.isActive;
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
      console.log("RESIZE_ROTATE_DEBUG: Refreshing handles for", this.node.id);
      this.disable();
      this.enable();
    }
  }
}
