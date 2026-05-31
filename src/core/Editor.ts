/**
 * Editor.ts - Text editing integration for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), get() methods
 * - Manages text content, font, alignment, and auto text offset
 */

import { loadFont } from "./FontLoader";

export class Editor {
  private node: any;

  constructor(node: any) {
    this.node = node;
  }

  /** Destroy the editor, clearing all references */
  public destroy(): void {
    this.node = null;
  }

  /**
   * Set text content and properties on the node.
   * This is the primary method used by collaboration events
   * and the text editing pane.
   */
  public async set(
    text: string,
    fontSize?: number,
    fontFamily?: string,
    fontColor?: string,
    opacity?: number,
    textXAlign?: "left" | "center" | "right",
    textYAlign?: "top" | "middle" | "bottom"
  ): Promise<void> {
    // Update options
    if (text !== undefined) this.node.options.text = text;
    if (fontSize !== undefined) this.node.options.fontSize = fontSize;
    if (fontColor !== undefined) this.node.options.fontColor = fontColor;
    if (opacity !== undefined) this.node.options.textOpacity = opacity;
    if (textXAlign !== undefined) this.node.options.textXAlign = textXAlign;
    if (textYAlign !== undefined) this.node.options.textYAlign = textYAlign;

    // Load font if changed
    if (fontFamily !== undefined && fontFamily !== this.node.options.fontFamily) {
      this.node.options.fontFamily = fontFamily;
      await loadFont(fontFamily);
    }

    // Apply text changes
    this.applyText();
  }

  /**
   * Get current text properties.
   */
  public get(): {
    text: string;
    fontSize: number;
    fontFamily: string;
    fontColor: string;
    textOpacity: number;
    textXAlign: string;
    textYAlign: string;
  } {
    return {
      text: this.node.options.text || "",
      fontSize: this.node.options.fontSize || 14,
      fontFamily: this.node.options.fontFamily || "Arial, sans-serif",
      fontColor: this.node.options.fontColor || "#000000",
      textOpacity: this.node.options.textOpacity ?? 1,
      textXAlign: this.node.options.textXAlign || "center",
      textYAlign: this.node.options.textYAlign || "middle",
    };
  }

  /**
   * Calculate auto text offset based on node shape and text size.
   */
  public calculateAutoOffset(): { x: number; y: number } {
    if (!this.node.textElement) {
      return { x: 0, y: 0 };
    }

    try {
      const textBBox = this.node.textElement.bbox();
      const nodeWidth = this.node.options.width || 100;
      const nodeHeight = this.node.options.height || 60;

      return {
        x: (nodeWidth - textBBox.width) / 2,
        y: (nodeHeight - textBBox.height) / 2,
      };
    } catch {
      return { x: 0, y: 0 };
    }
  }

  // ─── Private ─────────────────────────────────────────────────────

  private applyText(): void {
    // Skip for SVG content nodes
    if (!this.node.textElement) return;

    const { text, fontSize, fontFamily, fontColor, textOpacity } =
      this.node.options;

    // Update text content
    this.node.textElement.text(text || "");

    // Update font properties
    this.node.textElement.font({
      family: fontFamily || "Arial, sans-serif",
      size: fontSize || 14,
      fill: fontColor || "#000000",
      opacity: textOpacity ?? 1,
    });

    // Re-center text
    if (typeof this.node.centerText === "function") {
      this.node.centerText();
    }

    // Auto-resize if enabled
    if (this.node.slate?.options?.autoResizeNodesBasedOnText) {
      this.autoResize();
    }
  }

  private autoResize(): void {
    if (!this.node.textElement) return;

    try {
      const textBBox = this.node.textElement.bbox();
      const padding = 20; // Minimum padding around text

      const minWidth = textBBox.width + padding * 2;
      const minHeight = textBBox.height + padding * 2;

      const currentWidth = this.node.options.width || 100;
      const currentHeight = this.node.options.height || 60;

      // Only resize if text is larger than current node
      if (minWidth > currentWidth || minHeight > currentHeight) {
        const newWidth = Math.max(currentWidth, minWidth);
        const newHeight = Math.max(currentHeight, minHeight);
        this.node.setSize(newWidth, newHeight);
      }
    } catch {
      // bbox may not be available in all states
    }
  }
}
