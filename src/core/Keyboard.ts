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

      case "ArrowUp":
        this.nudge(0, -this.options.nudgeDistance!, e);
        break;
      case "ArrowDown":
        this.nudge(0, this.options.nudgeDistance!, e);
        break;
      case "ArrowLeft":
        this.nudge(-this.options.nudgeDistance!, 0, e);
        break;
      case "ArrowRight":
        this.nudge(this.options.nudgeDistance!, 0, e);
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
}
