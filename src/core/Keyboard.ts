/**
 * Keyboard.ts - Global keyboard bindings
 *
 * Provides keyboard shortcuts for common actions:
 * - Delete/Backspace: remove selected nodes
 * - Ctrl+Z / Cmd+Z: undo
 * - Ctrl+Y / Cmd+Shift+Z: redo
 * - Ctrl+A / Cmd+A: select all
 * - Ctrl+C / Ctrl+V: copy / paste selected nodes
 * - Ctrl+D: duplicate selected nodes in place (offset)
 * - Arrow keys: nudge selected nodes
 * - Escape: deselect all
 */

import { guid } from "../utils";
import { v2NodeToV1 } from "./compat";

export interface KeyboardOptions {
  enabled?: boolean;
  nudgeDistance?: number;
}

export class Keyboard {
  private slate: any;
  private options: KeyboardOptions;
  private boundHandler: ((e: KeyboardEvent) => void) | null = null;
  // Internal clipboard of copied node options (deep-cloned snapshots).
  private clipboard: any[] = [];
  // Debounce handle for persisting arrow-key nudges.
  private nudgeTimer: ReturnType<typeof setTimeout> | null = null;

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

      case "c":
        if (isMod) {
          this.copySelected(e);
        }
        break;

      case "v":
        if (isMod) {
          this.pasteClipboard(e);
        }
        break;

      case "d":
        if (isMod) {
          this.duplicateSelected(e);
        }
        break;

      case "]":
        if (isMod) {
          this.bringToFront(e);
        }
        break;

      case "[":
        if (isMod) {
          this.sendToBack(e);
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
          "  Ctrl+C / Ctrl+V — copy / paste\n" +
          "  Ctrl+D — duplicate\n" +
          "  Ctrl+] / Ctrl+[ — bring to front / send to back\n" +
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

    // Host permission checks (v1 contract): read-only/comment-only viewers
    // cannot delete; comment nodes additionally need canRemoveComments
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;

    e.preventDefault();
    for (const node of [...selected]) {
      if (node.options?.isComment && !this.slate.canRemoveComments?.()) {
        continue;
      }
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

  /**
   * A serializable snapshot of a node's paintable options — enough to recreate
   * it, minus identity (id) and relationship arrays (which reference the OLD node
   * ids and would create dangling connections on a copy).
   */
  private snapshotNode(node: any): any {
    let snap: any = {};
    try {
      snap = JSON.parse(JSON.stringify(node.options || {}));
    } catch (err) {
      snap = { ...(node.options || {}) };
    }
    delete snap.id;
    delete snap.parentArrowForChildren;
    delete snap.noChildArrowForChildren;
    delete snap.associations;
    delete snap.relationships;
    return snap;
  }

  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  private copySelected(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes?.() || [];
    if (selected.length === 0) return;
    e.preventDefault();
    this.clipboard = selected.map((n: any) => this.snapshotNode(n));
    this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`);
  }

  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  private pasteClipboard(e: KeyboardEvent): void {
    if (this.clipboard.length === 0) return;
    e.preventDefault();
    this.createCopies(this.clipboard, 20);
  }

  /** Ctrl/Cmd+] — bring the selected node(s) to the front of the z-order. */
  private bringToFront(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes?.() || [];
    if (selected.length === 0) return;
    e.preventDefault();
    // node.toFront() broadcasts onNodeToFront, so it persists + syncs to collab.
    for (const node of selected) node.toFront?.();
  }

  /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
  private sendToBack(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes?.() || [];
    if (selected.length === 0) return;
    e.preventDefault();
    for (const node of selected) node.toBack?.();
  }

  /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
  private duplicateSelected(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes?.() || [];
    if (selected.length === 0) return;
    e.preventDefault();
    const snaps = selected.map((n: any) => this.snapshotNode(n));
    this.createCopies(snaps, 20);
  }

  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  private createCopies(snapshots: any[], offset: number): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const created: any[] = [];
    for (const snap of snapshots) {
      const opts = { ...snap };
      opts.id = guid();
      opts.x = (opts.x || 0) + offset;
      opts.y = (opts.y || 0) + offset;
      try {
        const node = this.slate.addNode(opts);
        if (node) created.push(node);
      } catch (err) {
        /* noop */
      }
    }
    if (created.length > 0) {
      // Select the copies once their async creation settles.
      const selectCopies = () => this.slate.selectNodes?.(created, false);
      const pending = created.map((n: any) => n?.ready).filter(Boolean);
      if (pending.length) {
        Promise.all(pending).then(selectCopies).catch(selectCopies);
      } else {
        setTimeout(selectCopies, 120);
      }
      this.slate.announce?.(`Pasted ${created.length} node(s)`);
    }
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

    // node.position() alone doesn't broadcast, so a nudge never persisted / synced
    // (the node snapped back on reload). Broadcast onNodesMove — same package the
    // drag-end emits — so the host saves it. Debounced so holding an arrow key
    // batches into one save instead of hammering the server per keypress.
    if (this.nudgeTimer) clearTimeout(this.nudgeTimer);
    this.nudgeTimer = setTimeout(() => {
      this.nudgeTimer = null;
      const sel = this.slate.getSelectedNodes?.() || [];
      if (sel.length > 0) {
        this.slate.broadcast?.("onNodesMove", {
          nodeOptions: sel.map((n: any) => v2NodeToV1(n.options)),
        });
      }
    }, 250);
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
