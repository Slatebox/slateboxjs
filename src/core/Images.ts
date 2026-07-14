/**
 * Images.ts - Image fill support for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), clear() methods
 * - Manages image fills via SVG patterns
 */

import type { Node } from "./Node";

export class Images {
  private node: Node;
  private patternElement: any = null;
  private imageUrl: string = "";
  private origWidth: number = 0;
  private origHeight: number = 0;
  private preserveAspectRatio: boolean = true;

  constructor(node: Node) {
    this.node = node;
  }

  /**
   * Set an image fill on the node's background.
   *
   * Uses SVG pattern fills for proper scaling within the shape.
   */
  public set(
    url: string,
    width?: number,
    height?: number,
    preserveAspectRatio: boolean = true
  ): void {
    this.imageUrl = url;
    this.origWidth = width || this.node.options.width || 100;
    this.origHeight = height || this.node.options.height || 60;
    this.preserveAspectRatio = preserveAspectRatio;

    // Store on node options
    this.node.options.image = url;
    this.node.options.imageOrigWidth = this.origWidth;
    this.node.options.imageOrigHeight = this.origHeight;

    this.render();
  }

  /**
   * Clear the image fill and restore the background color.
   */
  public clear(): void {
    if (this.patternElement) {
      this.patternElement.remove();
      this.patternElement = null;
    }

    this.imageUrl = "";
    this.node.options.image = undefined;

    // Restore solid fill on the visible shape, not the nested SVG wrapper.
    const shape = this.node.contentPath ?? this.node.backgroundRect;
    if (shape) {
      shape.fill(this.node.options.backgroundColor || "#f0f0f0");
    }
  }

  /** Destroy the images instance, clearing all image data */
  public destroy(): void {
    this.clear();
    (this as any).node = null;
  }

  /**
   * Update the image (e.g., after resize).
   */
  public update(): void {
    if (this.imageUrl) {
      this.render();
    }
  }

  /** Check if an image is set */
  public hasImage(): boolean {
    return !!this.imageUrl;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private render(): void {
    const shape = this.node.contentPath ?? this.node.backgroundRect;
    if (!this.imageUrl || !shape) return;

    try {
      // Remove old pattern if exists
      if (this.patternElement) {
        this.patternElement.remove();
      }

      const w = this.node.options.width || 100;
      const h = this.node.options.height || 60;

      // Create SVG pattern with image
      const root = this.node.svgGroup.root();
      if (!root) return;

      // Get or create defs element
      let defs = root.defs();

      // Create pattern
      this.patternElement = defs
        .pattern(w, h, (add: any) => {
          add
            .image(this.imageUrl)
            .size(w, h)
            .attr("preserveAspectRatio", this.preserveAspectRatio ? "xMidYMid meet" : "xMidYMid slice");
        })
        .attr("patternUnits", "objectBoundingBox")
        .attr("width", "100%")
        .attr("height", "100%");

      // Apply pattern as fill
      shape.fill(this.patternElement);

      console.log(
        "IMAGES_DEBUG: Set image fill for",
        this.node.id,
        "url:",
        this.imageUrl
      );
    } catch (error) {
      console.error("IMAGES_DEBUG: Failed to set image:", error);
    }
  }
}
