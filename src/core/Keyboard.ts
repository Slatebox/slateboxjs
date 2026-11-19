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
 * - Enter, or simply typing, with one note selected: edit its text on the canvas
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
  // Internal edges (connectors) among the copied nodes, rewired on paste.
  private clipboardEdges: any[] = [];
  // How many times the current clipboard has been pasted — so repeated pastes
  // CASCADE (each further from the source) instead of stacking on one spot (Miro).
  private pasteCount = 0;
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

    // Controls outside this canvas own their keyboard events, even when a note is selected.
    const typing = Keyboard.isTypingKey(e);
    if (target !== document.body && !this.slate.element.contains(target) &&
        (typing || ["Enter", " ", "F2", "Tab"].includes(e.key))) return;

    const isMod = e.ctrlKey || e.metaKey;

    // Typing with one note selected edits that note. "?" stays the shortcuts reference,
    // and every other shortcut below needs Ctrl/Cmd or is not a character at all.
    if (typing && e.key !== "?" && this.typeIntoSelected(e)) return;

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

      case "g":
      case "G":
        if (isMod) {
          e.preventDefault();
          if (e.shiftKey) {
            this.slate.ungroupNodes?.();
          } else {
            this.slate.groupNodes?.();
          }
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
          "  Arrow keys — nudge selected (Shift = larger step)\n" +
          "  Tab — focus next node\n" +
          "  Enter/Space — select focused node\n" +
          "  ? — show this help"
        );
        this.slate.announce?.("Keyboard shortcuts reference logged to console");
        break;

      case "F2":
        // Miro-style: edit the selected node's text inline on the canvas.
        this.startInlineEditSelected(e);
        break;

      case "Enter":
        // A held connector activation can continue repeating after focus moves to its child.
        if (e.repeat && target.matches("[data-node-id]")) break;
        // If exactly one node is selected, Enter begins inline text editing
        // (Miro parity); otherwise fall back to selecting the focused node.
        if (this.startInlineEditSelected(e)) break;
        this.selectFocused(e);
        break;

      case " ":
        // Select the currently focused node (if a node SVG group has focus)
        this.selectFocused(e);
        break;

      case "Tab":
        if (!e.shiftKey) {
          const source = this.slate.getSelectedNodes()[0];
          if (source?.svgGroup.node === target && source.focusFirstConnectionHandle()) e.preventDefault();
        }
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
    // Inside a group? Escape first steps OUT to re-select the whole group
    // (Miro), and only a second Escape clears the selection.
    if (this.slate.getEnteredGroupId?.()) {
      this.slate.exitGroup?.();
      return;
    }
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
    const srcId = snap.id; // keep the source id so copies can rewire internal edges
    delete snap.id;
    delete snap.parentArrowForChildren;
    delete snap.noChildArrowForChildren;
    delete snap.associations;
    delete snap.relationships;
    if (srcId) snap.__srcId = srcId;
    return snap;
  }

  /**
   * Capture the connectors whose BOTH endpoints are within `nodes` — the internal
   * edges of a selection. Duplicating/pasting a connected group must recreate these
   * between the copies (Miro parity), or the copies come out disconnected.
   */
  private internalEdges(nodes: any[]): any[] {
    const idSet = new Set(nodes.map((n: any) => n.id));
    const edges: any[] = [];
    for (const n of nodes) {
      const am = n.relationships?.assocMap;
      if (!am) continue;
      for (const as of am.values()) {
        if (idSet.has((as as any).childId)) {
          let data: any = {};
          try {
            data = JSON.parse(JSON.stringify(as));
          } catch (e) {
            data = { ...(as as any) };
          }
          // Strip the id fields that reference the ORIGINAL nodes — the recreated
          // edge must derive parent/child/id from the COPIES, or persistence
          // re-attributes it to the source node on reload (a phantom extra edge).
          delete data.id;
          delete data.childId;
          delete data.parentId;
          edges.push({ parentSrcId: n.id, childSrcId: (as as any).childId, data });
        }
      }
    }
    return edges;
  }

  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  private copySelected(e: KeyboardEvent): void {
    const selected = this.slate.getSelectedNodes?.() || [];
    if (selected.length === 0) return;
    e.preventDefault();
    this.clipboard = selected.map((n: any) => this.snapshotNode(n));
    this.clipboardEdges = this.internalEdges(selected);
    this.pasteCount = 0; // fresh clipboard → restart the paste cascade
    this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`);
  }

  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  private pasteClipboard(e: KeyboardEvent): void {
    if (this.clipboard.length === 0) return;
    e.preventDefault();
    // Cascade: 1st paste +20, 2nd +40, … so repeated pastes don't stack on one spot.
    this.pasteCount++;
    this.createCopies(this.clipboard, 20 * this.pasteCount, this.clipboardEdges);
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
    this.createCopies(snaps, 20, this.internalEdges(selected));
  }

  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  private createCopies(
    snapshots: any[],
    offset: number,
    edges: any[] = []
  ): void {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const created: any[] = [];
    const srcToCopy = new Map<string, any>();
    for (const snap of snapshots) {
      const opts = { ...snap };
      const srcId = opts.__srcId;
      delete opts.__srcId;
      opts.id = guid();
      opts.x = (opts.x || 0) + offset;
      opts.y = (opts.y || 0) + offset;
      try {
        const node = this.slate.addNode(opts);
        if (node) {
          created.push(node);
          if (srcId) srcToCopy.set(srcId, node);
        }
      } catch (err) {
        /* noop */
      }
    }
    if (created.length > 0) {
      const finish = () => {
        this.slate.selectNodes?.(created, false);
        // Rewire internal connectors between the copies (Miro parity): a connector
        // whose BOTH endpoints were duplicated is recreated between the new nodes.
        for (const edge of edges) {
          const p = srcToCopy.get(edge.parentSrcId);
          const c = srcToCopy.get(edge.childSrcId);
          if (p && c) {
            try {
              p.relationships?.addAssociation?.(c, edge.data);
            } catch (e) {
              /* noop */
            }
          }
        }
      };
      const pending = created.map((n: any) => n?.ready).filter(Boolean);
      if (pending.length) {
        Promise.all(pending).then(finish).catch(finish);
      } else {
        setTimeout(finish, 120);
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
      // Nodes selected — nudge them. Shift = a larger jump (Miro parity): a plain
      // arrow moves by nudgeDistance, Shift+arrow by 4× for coarse positioning.
      const base = this.options.nudgeDistance!;
      const d = e.shiftKey ? base * 4 : base;
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

  /** A key press that produces one character of text, with no Ctrl/Cmd/Alt chord. */
  private static isTypingKey(e: KeyboardEvent): boolean {
    if (e.ctrlKey || e.metaKey || e.altKey || e.isComposing) return false;
    return typeof e.key === "string" && Array.from(e.key).length === 1;
  }

  /**
   * Type-to-edit: with exactly one editable note selected and no editor open, a
   * character key opens the note's editor with the caret after its existing text and
   * types that character there. It appends; it never replaces what the note says.
   *
   * Returns false (leaving the key to its existing meaning) for read-only and
   * comment-only viewers, locked notes, comments, artwork and multi-selections, and
   * whenever keyboard focus is on some other control of the canvas.
   */
  private typeIntoSelected(e: KeyboardEvent): boolean {
    if (e.defaultPrevented) return false;
    const selected =
      this.slate.getSelectedNodes?.() ?? (this.slate as any).selectedNodes ?? [];
    if (selected.length !== 1) return false;
    const node = selected[0];
    if (!node?.canEditTextInline?.() || node.editor?.isInlineEditing?.()) return false;

    // Keys belong to whatever has focus. Only the page itself, the canvas background
    // and the selected note pass typing through to that note; a connector button,
    // another note or a toolbar control keeps its own keys.
    const target = e.target as HTMLElement;
    const group = node.svgGroup?.node as Element | undefined;
    const onNote = !!group && group.contains(target);
    const onBackground =
      target === document.body ||
      target === document.documentElement ||
      target === this.slate.element ||
      target === this.slate.canvas?.node;
    if (!onNote && !onBackground) return false;

    // Space on a focused note already means "select it", and keeps meaning that. With
    // focus on the page or the canvas background Space has no meaning of its own, so
    // there it types a space like any other character.
    if (e.key === " " && !onBackground) return false;

    e.preventDefault();
    return node.editor.startInline({ caret: "end", insert: e.key, heldKey: e.key }) === true;
  }

  /**
   * If exactly one node is selected, begin inline text editing on it.
   * Returns true when it started an edit (so callers can stop falling through).
   * Skips SVG-content nodes (they have no editable text).
   */
  private startInlineEditSelected(e: KeyboardEvent): boolean {
    const selected = (this.slate as any).selectedNodes || [];
    if (selected.length !== 1) return false;
    const node = selected[0];
    if (!node?.editor?.startInline || node.nestedSvg) return false;
    // The keyboard must not open what a double-click would refuse: a read-only or
    // comment-only viewer, or a locked note, cannot edit text by pressing Enter.
    const slate: any = this.slate;
    if (
      node.options?.isLocked ||
      slate?.options?.enabled === false ||
      slate?.isReadOnly?.() ||
      (slate?.isCommentOnly?.() && !node.options?.isComment)
    ) return false;
    e.preventDefault();
    node.editor.startInline();
    return true;
  }
}
