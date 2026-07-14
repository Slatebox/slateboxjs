/**
 * Editor.ts - Text editing integration for nodes
 *
 * Following the isolated class pattern:
 * - Constructor takes node
 * - Has set(), get() methods
 * - Manages text content, font, alignment, and auto text offset
 */

import { loadFont } from "./FontLoader";
import type { Node } from "./Node";

export class Editor {
  private node: Node;
  private _inlineEditing = false;
  private _inlineFO: SVGForeignObjectElement | null = null;

  constructor(node: Node) {
    this.node = node;
  }

  /** Destroy the editor, clearing all references */
  public destroy(): void {
    if (this._inlineEditing) this.cancelInline();
    (this as any).node = null;
  }

  /** Whether an inline (on-canvas) edit is currently active. */
  public isInlineEditing(): boolean {
    return this._inlineEditing;
  }

  /**
   * Start inline (on-canvas) text editing — Miro-style. Overlays a
   * contenteditable box exactly on the node (inside its group so it tracks
   * pan/zoom/position), pre-filled + all-selected. Enter commits, Shift+Enter
   * inserts a newline, Escape cancels, blur commits.
   *
   * Commit routes through collab.invoke + collab.send (the same persist/sync path
   * the drawer uses via onNodeTextChanged), so the edit survives reload and syncs
   * to collaborators. SVG-content nodes (no textElement) are skipped.
   */
  public startInline(): void {
    const node = this.node;
    if (this._inlineEditing || !node || node.nestedSvg) return;
    const group = (node.svgGroup as any)?.node as SVGGElement | undefined;
    if (!group) return;

    const w = node.options.width || 100;
    const h = node.options.height || 60;
    const SVGNS = "http://www.w3.org/2000/svg";
    const fo = document.createElementNS(
      SVGNS,
      "foreignObject"
    ) as SVGForeignObjectElement;
    fo.setAttribute("x", "0");
    fo.setAttribute("y", "0");
    fo.setAttribute("width", String(w));
    fo.setAttribute("height", String(h));
    fo.style.overflow = "visible";

    const div = document.createElement("div");
    div.setAttribute("contenteditable", "true");
    div.className = "sb-inline-editor";
    div.textContent = node.options.text || "";
    div.style.cssText = [
      `width:${w}px`,
      `height:${h}px`,
      "box-sizing:border-box",
      "display:flex",
      "align-items:center",
      "justify-content:center",
      "text-align:center",
      "outline:none",
      "padding:4px",
      "cursor:text",
      "word-break:break-word",
      "overflow:hidden",
      "white-space:pre-wrap",
      `font-family:${node.options.fontFamily || "Arial, sans-serif"}`,
      `font-size:${node.options.fontSize || 14}px`,
      `color:${node.options.fontColor || "#000000"}`,
    ].join(";");
    fo.appendChild(div);
    group.appendChild(fo);
    this._inlineFO = fo;
    this._inlineEditing = true;
    // Hide the rendered SVG text while the editor box is showing.
    (node.textElement as any)?.hide?.();

    const finish = (save: boolean) => {
      if (!this._inlineEditing) return;
      this._inlineEditing = false;
      const newText = (div.innerText || "").replace(/\n+$/, "");
      try {
        fo.remove();
      } catch {
        /* already gone */
      }
      this._inlineFO = null;
      (node.textElement as any)?.show?.();
      if (save && newText !== (node.options.text || "")) {
        const pkg = {
          type: "onNodeTextChanged",
          data: { id: node.id, text: newText },
        };
        const slate = node.slate as any;
        const collab = slate?.collab;
        if (collab?.invoke) {
          // Apply locally, then broadcast + record ONE undo checkpoint.
          // broadcast() does collab.send AND undoRedo.snap(), so the edit syncs to
          // collaborators and becomes its own undo step. (A plain click no longer
          // snaps — see toFront(false) — so this yields clean stepwise undo.)
          collab.invoke(pkg);
          if (typeof slate.broadcast === "function") {
            slate.broadcast("onNodeTextChanged", pkg.data);
          } else {
            collab.send?.(pkg);
          }
        } else {
          // No collab layer (e.g. standalone) — apply directly.
          (node as any).setText?.(newText);
        }
      }
    };

    div.addEventListener("keydown", (ev) => {
      ev.stopPropagation();
      if (ev.key === "Enter" && !ev.shiftKey) {
        ev.preventDefault();
        finish(true);
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        finish(false);
      }
    });
    div.addEventListener("blur", () => finish(true));

    // Focus + select-all on the next tick (after it's in the DOM).
    setTimeout(() => {
      try {
        div.focus();
        const range = document.createRange();
        range.selectNodeContents(div);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      } catch {
        /* headless */
      }
    }, 0);
  }

  /** Cancel an in-progress inline edit without saving. */
  public cancelInline(): void {
    if (!this._inlineEditing) return;
    this._inlineEditing = false;
    try {
      this._inlineFO?.remove();
    } catch {
      /* noop */
    }
    this._inlineFO = null;
    (this.node?.textElement as any)?.show?.();
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
