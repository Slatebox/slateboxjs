import { v as f, g as u } from "./canvas-canvas-BbkoZ6zT.mjs";
const c = class c {
  constructor(e, t = {}) {
    this.boundHandler = null, this.clipboard = [], this.clipboardEdges = [], this.pasteCount = 0, this.nudgeFrom = null, this.nudgeTimer = null, this.slate = e, this.options = {
      enabled: !0,
      nudgeDistance: 5,
      ...t
    };
  }
  /** Bind global keyboard shortcuts */
  bindGlobal() {
    this.boundHandler || (this.boundHandler = (e) => this.handleKeyDown(e), document.addEventListener("keydown", this.boundHandler), console.log("KEYBOARD_DEBUG: Global bindings active"));
  }
  /** Unbind global keyboard shortcuts */
  unbindGlobal() {
    this.boundHandler && (document.removeEventListener("keydown", this.boundHandler), this.boundHandler = null, console.log("KEYBOARD_DEBUG: Global bindings removed"));
  }
  /** Enable keyboard shortcuts */
  enable() {
    this.options.enabled = !0;
  }
  /** Disable keyboard shortcuts (keeps bindings, ignores events) */
  disable() {
    this.options.enabled = !1;
  }
  // ─── Private ─────────────────────────────────────────────────────
  handleKeyDown(e) {
    if (!this.options.enabled) return;
    const t = e.target;
    if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      return;
    const s = c.isTypingKey(e), n = e.ctrlKey || e.metaKey;
    if (!(t instanceof Element && t !== document.body && t !== document.documentElement && !this.slate.element.contains(t) && (!n || t.closest(c.MODAL_SURFACES))) && !this.offerKeyToPolicy(e) && !(s && e.key !== "?" && this.typeIntoSelected(e))) {
      if (n && !e.altKey) {
        const l = /^[a-z]$/i.test(e.key) ? e.key.toLowerCase() : e.code === "KeyZ" ? "z" : e.code === "KeyY" ? "y" : "";
        if (l === "z") {
          e.shiftKey ? this.redo(e) : this.undo(e);
          return;
        }
        if (l === "y" && !e.shiftKey) {
          this.redo(e);
          return;
        }
      }
      switch (e.key) {
        case "Delete":
        case "Backspace":
          this.deleteSelected(e);
          break;
        case "a":
          n && this.selectAll(e);
          break;
        case "c":
          n && this.copySelected(e);
          break;
        case "v":
          n && this.pasteClipboard(e);
          break;
        case "d":
          n && this.duplicateSelected(e);
          break;
        case "g":
        case "G":
          n && (e.preventDefault(), e.shiftKey ? this.slate.ungroupNodes?.() : this.slate.groupNodes?.());
          break;
        case "]":
          n && this.bringToFront(e);
          break;
        case "[":
          n && this.sendToBack(e);
          break;
        case "Escape":
          if (this.stopPlayingMedia()) {
            e.preventDefault();
            break;
          }
          this.deselect(e);
          break;
        case "?":
          console.log(
            `SlateboxJS Keyboard Shortcuts:
  Delete/Backspace — remove selected
  Ctrl+Z — undo
  Ctrl+Shift+Z or Ctrl+Y — redo
  Ctrl+A — select all
  Ctrl+C / Ctrl+V — copy / paste
  Ctrl+D — duplicate
  Ctrl+] / Ctrl+[ — bring to front / send to back
  Escape — deselect
  Arrow keys — nudge selected (Shift = larger step)
  Tab — focus next node
  Enter/Space — select focused node
  ? — show this help`
          ), this.slate.announce?.("Keyboard shortcuts reference logged to console");
          break;
        case "F2":
          this.startInlineEditSelected(e);
          break;
        case "Enter":
          if (e.repeat && t.matches("[data-node-id]") || this.startInlineEditSelected(e)) break;
          this.selectFocused(e);
          break;
        case " ":
          this.selectFocused(e);
          break;
        case "Tab":
          if (!e.shiftKey) {
            const l = this.slate.getSelectedNodes()[0];
            l?.svgGroup.node === t && l.focusFirstConnectionHandle() && e.preventDefault();
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
  }
  deleteSelected(e) {
    const t = this.slate.getSelectedNodes();
    if (t.length === 0 || this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    e.preventDefault();
    const s = [...t].filter((n) => this.caps(n).canDelete !== !1);
    if (s.length !== 0) {
      for (const n of s)
        n.options?.isComment && !this.slate.canRemoveComments?.() || this.slate.removeNode(n.id);
      this.slate.clearSelection();
    }
  }
  /** What may be done to `node` (everything, unless a host policy governs it). */
  caps(e) {
    return this.slate.capabilitiesOf?.(e) ?? {};
  }
  /** Whether a host policy governs `node`. */
  governed(e) {
    return !!this.slate.governanceOf?.(e);
  }
  /** Give a key to the policy of the single selected governed note. True when it handled the key. */
  offerKeyToPolicy(e) {
    const t = this.slate.getSelectedNodes?.() ?? [];
    if (t.length !== 1) return !1;
    const s = t[0], n = this.slate.governanceOf?.(s);
    if (!n?.policy?.onKeyDown || s.editor?.isInlineEditing?.()) return !1;
    const o = this.slate;
    if (o.options?.enabled === !1 || o.isReadOnly?.() || o.isCommentOnly?.()) return !1;
    try {
      return n.policy.onKeyDown(s, e) === !0;
    } catch (l) {
      return console.warn("DRAG_POLICY: onKeyDown threw", l), !1;
    }
  }
  undo(e) {
    e.preventDefault(), typeof this.slate.undo == "function" ? this.slate.undo() : this.slate.undoRedo?.undo();
  }
  redo(e) {
    e.preventDefault(), typeof this.slate.redo == "function" ? this.slate.redo() : this.slate.undoRedo?.redo();
  }
  selectAll(e) {
    e.preventDefault();
    const t = this.slate.nodes.allNodes;
    t.length > 0 && this.slate.selectNodes(t, !1);
  }
  /** Stop every video playing on the slate; true when one was. */
  stopPlayingMedia() {
    let e = !1;
    for (const t of this.slate.nodes?.allNodes ?? [])
      t?.media?.isPlaying?.() && (t.media.stop(), e = !0);
    return e;
  }
  deselect(e) {
    if (e.preventDefault(), this.slate.getEnteredGroupId?.()) {
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
  snapshotNode(e) {
    let t = {};
    try {
      t = JSON.parse(JSON.stringify(e.options || {}));
    } catch {
      t = { ...e.options || {} };
    }
    const s = t.id;
    return delete t.id, delete t.parentArrowForChildren, delete t.noChildArrowForChildren, delete t.associations, delete t.relationships, s && (t.__srcId = s), t;
  }
  /**
   * Capture the connectors whose BOTH endpoints are within `nodes` — the internal
   * edges of a selection. Duplicating/pasting a connected group must recreate these
   * between the copies (Miro parity), or the copies come out disconnected.
   */
  internalEdges(e) {
    const t = new Set(e.map((n) => n.id)), s = [];
    for (const n of e) {
      const o = n.relationships?.assocMap;
      if (o) {
        for (const l of o.values())
          if (t.has(l.childId)) {
            let i = {};
            try {
              i = JSON.parse(JSON.stringify(l));
            } catch {
              i = { ...l };
            }
            delete i.id, delete i.childId, delete i.parentId, s.push({ parentSrcId: n.id, childSrcId: l.childId, data: i });
          }
      }
    }
    return s;
  }
  /** Ctrl/Cmd+C — copy the selected nodes to the internal clipboard. */
  copySelected(e) {
    const t = (this.slate.getSelectedNodes?.() || []).filter(
      (s) => this.caps(s).canDuplicate !== !1
    );
    t.length !== 0 && (e.preventDefault(), this.clipboard = t.map((s) => this.snapshotNode(s)), this.clipboardEdges = this.internalEdges(t), this.pasteCount = 0, this.slate.announce?.(`Copied ${this.clipboard.length} node(s)`));
  }
  /** Ctrl/Cmd+V — paste the clipboard nodes (offset), then select the copies. */
  pasteClipboard(e) {
    this.clipboard.length !== 0 && (e.preventDefault(), this.pasteCount++, this.createCopies(this.clipboard, 20 * this.pasteCount, this.clipboardEdges));
  }
  /** Ctrl/Cmd+] — bring the selected node(s) to the front of the z-order. */
  bringToFront(e) {
    const t = (this.slate.getSelectedNodes?.() || []).filter((s) => !this.governed(s));
    if (t.length !== 0) {
      e.preventDefault();
      for (const s of t) s.toFront?.();
    }
  }
  /** Ctrl/Cmd+[ — send the selected node(s) to the back of the z-order. */
  sendToBack(e) {
    const t = (this.slate.getSelectedNodes?.() || []).filter((s) => !this.governed(s));
    if (t.length !== 0) {
      e.preventDefault();
      for (const s of t) s.toBack?.();
    }
  }
  /** Ctrl/Cmd+D — duplicate the current selection in place (offset). */
  duplicateSelected(e) {
    const t = (this.slate.getSelectedNodes?.() || []).filter(
      (n) => this.caps(n).canDuplicate !== !1
    );
    if (t.length === 0) return;
    e.preventDefault();
    const s = t.map((n) => this.snapshotNode(n));
    this.createCopies(s, 20, this.internalEdges(t));
  }
  /**
   * Create fresh nodes from option snapshots, offset by (offset,offset) and each
   * given a new id, then select the new nodes. addNode() broadcasts onNodeAdded,
   * so copies persist + sync to collab peers like any other added node.
   */
  createCopies(e, t, s = []) {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const n = [], o = /* @__PURE__ */ new Map();
    for (const l of e) {
      const i = { ...l }, r = i.__srcId;
      delete i.__srcId, i.id = u(), i.x = (i.x || 0) + t, i.y = (i.y || 0) + t;
      try {
        const a = this.slate.addNode(i);
        a && (n.push(a), r && o.set(r, a));
      } catch {
      }
    }
    if (n.length > 0) {
      const l = () => {
        this.slate.selectNodes?.(n, !1);
        for (const r of s) {
          const a = o.get(r.parentSrcId), d = o.get(r.childSrcId);
          if (a && d)
            try {
              a.relationships?.addAssociation?.(d, r.data);
            } catch {
            }
        }
      }, i = n.map((r) => r?.ready).filter(Boolean);
      i.length ? Promise.all(i).then(l).catch(l) : setTimeout(l, 120), this.slate.announce?.(`Pasted ${n.length} node(s)`);
    }
  }
  nudge(e, t, s) {
    const n = this.slate.getSelectedNodes().filter((o) => !this.governed(o));
    if (n.length === 0) {
      s.preventDefault();
      return;
    }
    s.preventDefault(), this.nudgeTimer || (this.nudgeFrom = new Map(n.map((o) => [o, { x: o.options.x || 0, y: o.options.y || 0 }])));
    for (const o of n) {
      const l = (o.options.x || 0) + e, i = (o.options.y || 0) + t;
      o.position(l, i);
    }
    this.nudgeTimer && clearTimeout(this.nudgeTimer), this.nudgeTimer = setTimeout(() => {
      this.nudgeTimer = null;
      const o = (this.slate.getSelectedNodes?.() || []).filter((r) => !this.governed(r)), l = this.nudgeFrom;
      this.nudgeFrom = null;
      const i = o.length === 1 ? l?.get(o[0]) : void 0;
      if (i) {
        const r = o[0], a = { x: (r.options.x || 0) + (r.options.width || 0) / 2, y: (r.options.y || 0) + (r.options.height || 0) / 2 }, d = this.slate.offerFreeDrop?.(r, a, i);
        if (d === "refused" && r.position(i.x, i.y, () => this.slate.updateSelectionResizeRotate?.()), d) return;
      }
      o.length > 0 && this.slate.broadcast?.("onNodesMove", {
        nodeOptions: o.map((r) => f(r.options))
      });
    }, 250);
  }
  handleArrowKey(e) {
    if (this.slate.getSelectedNodes().length > 0) {
      const s = this.options.nudgeDistance, n = e.shiftKey ? s * 4 : s;
      switch (e.key) {
        case "ArrowUp":
          this.nudge(0, -n, e);
          break;
        case "ArrowDown":
          this.nudge(0, n, e);
          break;
        case "ArrowLeft":
          this.nudge(-n, 0, e);
          break;
        case "ArrowRight":
          this.nudge(n, 0, e);
          break;
      }
    } else {
      const s = this.slate.getAllNodes().filter((i) => this.caps(i).canSelect !== !1);
      if (s.length === 0) return;
      const n = document.activeElement, o = s.findIndex((i) => i.svgGroup?.node === n);
      let l = o;
      e.key === "ArrowRight" || e.key === "ArrowDown" ? l = o < 0 ? 0 : Math.min(o + 1, s.length - 1) : l = o < 0 ? s.length - 1 : Math.max(o - 1, 0), l >= 0 && l < s.length && (e.preventDefault(), s[l].svgGroup?.node?.focus());
    }
  }
  selectFocused(e) {
    const t = document.activeElement, n = this.slate.getAllNodes().find((o) => o.svgGroup?.node === t);
    n && (e.preventDefault(), this.slate.selectNodes([n], !1));
  }
  /** A key press that produces one character of text, with no Ctrl/Cmd/Alt chord. */
  static isTypingKey(e) {
    return e.ctrlKey || e.metaKey || e.altKey || e.isComposing ? !1 : typeof e.key == "string" && Array.from(e.key).length === 1;
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
  typeIntoSelected(e) {
    if (e.defaultPrevented) return !1;
    const t = this.slate.getSelectedNodes?.() ?? this.slate.selectedNodes ?? [];
    if (t.length !== 1) return !1;
    const s = t[0];
    if (!s?.canEditTextInline?.() || s.editor?.isInlineEditing?.()) return !1;
    const n = e.target, o = s.svgGroup?.node, l = !!o && o.contains(n), i = n === document.body || n === document.documentElement || n === this.slate.element || n === this.slate.canvas?.node;
    return !l && !i || e.key === " " && !i ? !1 : (e.preventDefault(), s.editor.startInline({ caret: "end", insert: e.key, heldKey: e.key }) === !0);
  }
  /**
   * If exactly one node is selected, begin inline text editing on it.
   * Returns true when it started an edit (so callers can stop falling through).
   * Skips SVG-content nodes (they have no editable text).
   */
  startInlineEditSelected(e) {
    const t = this.slate.selectedNodes || [];
    if (t.length !== 1) return !1;
    const s = t[0];
    if (s?.media?.hasMedia?.())
      return e.preventDefault(), s.media.play(), !0;
    if (!s?.editor?.startInline || s.nestedSvg) return !1;
    const n = this.slate;
    return s.options?.isLocked || n?.capabilitiesOf?.(s).canEditText === !1 || n?.options?.enabled === !1 || n?.isReadOnly?.() || n?.isCommentOnly?.() && !s.options?.isComment ? !1 : (e.preventDefault(), s.editor.startInline(), !0);
  }
};
c.MODAL_SURFACES = '[role="dialog"], [role="alertdialog"], [role="menu"], [role="listbox"], [aria-modal="true"]';
let h = c;
export {
  h as Keyboard
};
