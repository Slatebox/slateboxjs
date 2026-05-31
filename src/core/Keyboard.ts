/**
 * Keyboard.ts - Global keyboard bindings
 *
 * Provides keyboard shortcuts for common actions:
 * - Delete/Backspace: remove selected nodes
 * - Ctrl+Z / Cmd+Z: undo
 * - Ctrl+Y / Cmd+Shift+Z: redo
 * - Ctrl+A / Cmd+A: select all
 * - Arrow keys: nudge selected nodes
 * - Escape: deselect all
 */

export interface KeyboardOptions {
  enabled?: boolean;
  nudgeDistance?: number;
}

export class Keyboard {
  private slate: any;
  private options: KeyboardOptions;
  private boundHandler: ((e: KeyboardEvent) => void) | null = null;

  constructor(slate: any, options: KeyboardOptions = {}) {
    this.slate = slate;
    this.options = {
      enabled: true,
      nudgeDistance: 5,
      ...options,
    };
  }

  /** Bind global keyboard shortcuts */
  public bindGlobal(): void {
    if (this.boundHandler) return;

    this.boundHandler = (e: KeyboardEvent) => this.handleKeyDown(e);
    document.addEventListener("keydown", this.boundHandler);
    console.log("KEYBOARD_DEBUG: Global bindings active");
  }

  /** Unbind global keyboard shortcuts */
  public unbindGlobal(): void {
    if (this.boundHandler) {
      document.removeEventListener("keydown", this.boundHandler);
      this.boundHandler = null;
      console.log("KEYBOARD_DEBUG: Global bindings removed");
    }
  }

  /** Enable keyboard shortcuts */
  public enable(): void {
    this.options.enabled = true;
  }

  /** Disable keyboard shortcuts (keeps bindings, ignores events) */
  public disable(): void {
    this.options.enabled = false;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.options.enabled) return;

    // Don't intercept when typing in inputs
    const target = e.target as HTMLElement;
    if (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    ) {
      return;
    }

    const isMod = e.ctrlKey || e.metaKey;

    switch (e.key) {
      case "Delete":
      case "Backspace":
        this.deleteSelected(e);
        break;

      case "z":
        if (isMod && e.shiftKey) {
          this.redo(e);
        } else if (isMod) {
          this.undo(e);
        }
        break;

      case "y":
        if (isMod) {
          this.redo(e);
        }
        break;

      case "a":
        if (isMod) {
          this.selectAll(e);
        }
        break;

      case "Escape":
        this.deselect(e);
        break;

      case "?":
        // Show keyboard shortcuts reference
        console.log(
          "SlateboxJS Keyboard Shortcuts:\n" +
          "  Delete/Backspace — remove selected\n" +
          "  Ctrl+Z — undo\n" +
          "  Ctrl+Y — redo\n" +
          "  Ctrl+A — select all\n" +
          "  Escape — deselect\n" +
          "  Arrow keys — nudge selected (1px)\n" +
          "  Tab — focus next node\n" +
          "  Enter/Space — select focused node\n" +
          "  ? — show this help"
        );
        this.slate.announce?.("Keyboard shortcuts reference logged to console");
        break;

      case "Enter":
      case " ":
        // Select the currently focused node (if a node SVG group has focus)
        this.selectFocused(e);
        break;

      case "Tab":
        // Let native Tab navigation work for node focusing
        // When Shift+Tab is pressed, let browser handle reverse order
        break;

      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        this.handleArrowKey(e);
        break;
    }
  }

  private deleteSelected(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes();
    if (selected.length === 0) return;

    e.preventDefault();
    for (const node of [...selected]) {
      this.slate.removeNode(node.id);
    }
    this.slate.clearSelection();
  }

  private undo(e: KeyboardEvent): void {
    e.preventDefault();
    if (this.slate.undoRedo) {
      this.slate.undoRedo.undo();
    }
  }

  private redo(e: KeyboardEvent): void {
    e.preventDefault();
    if (this.slate.undoRedo) {
      this.slate.undoRedo.redo();
    }
  }

  private selectAll(e: KeyboardEvent): void {
    e.preventDefault();
    const allNodes = this.slate.nodes.allNodes;
    if (allNodes.length > 0) {
      this.slate.selectNodes(allNodes, false);
    }
  }

  private deselect(e: KeyboardEvent): void {
    e.preventDefault();
    this.slate.clearSelection();
  }

  private nudge(dx: number, dy: number, e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes();
    if (selected.length === 0) return;

    e.preventDefault();
    for (const node of selected) {
      const x = (node.options.x || 0) + dx;
      const y = (node.options.y || 0) + dy;
      node.position(x, y);
    }
  }

  private handleArrowKey(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes();
    if (selected.length > 0) {
      // Nodes selected — nudge them
      const d = this.options.nudgeDistance!;
      switch (e.key) {
        case "ArrowUp":    this.nudge(0, -d, e); break;
        case "ArrowDown":  this.nudge(0, d, e); break;
        case "ArrowLeft":  this.nudge(-d, 0, e); break;
        case "ArrowRight": this.nudge(d, 0, e); break;
      }
    } else {
      // No selection — navigate focus between nodes
      const nodes = this.slate.getAllNodes();
      if (nodes.length === 0) return;

      const focused = document.activeElement;
      const currentIdx = nodes.findIndex((n: any) => n.svgGroup?.node === focused);

      let nextIdx = currentIdx;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        nextIdx = currentIdx < 0 ? 0 : Math.min(currentIdx + 1, nodes.length - 1);
      } else {
        nextIdx = currentIdx < 0 ? nodes.length - 1 : Math.max(currentIdx - 1, 0);
      }

      if (nextIdx >= 0 && nextIdx < nodes.length) {
        e.preventDefault();
        nodes[nextIdx].svgGroup?.node?.focus();
      }
    }
  }

  private selectFocused(e: KeyboardEvent): void {
    const focused = document.activeElement;
    const nodes = this.slate.getAllNodes();
    const node = nodes.find((n: any) => n.svgGroup?.node === focused);
    if (node) {
      e.preventDefault();
      this.slate.selectNodes([node], false);
    }
  }
}
