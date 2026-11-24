import { g as c } from "./canvas-canvas-BbkoZ6zT.mjs";
class g {
  constructor(i) {
    this.el = null, this.targetNodes = [], this.boundContext = null, this.boundDismiss = null, this.boundEsc = null, this.slate = i;
  }
  /** Bind the global contextmenu handler. */
  enable() {
    this.boundContext || (this.boundContext = (i) => this.onContextMenu(i), document.addEventListener("contextmenu", this.boundContext, !0));
  }
  /** Unbind + close. */
  disable() {
    this.boundContext && (document.removeEventListener("contextmenu", this.boundContext, !0), this.boundContext = null), this.close();
  }
  // ─── Private ─────────────────────────────────────────────────────
  onContextMenu(i) {
    const d = i.target;
    if (d?.closest?.(".sb-inline-editor")) {
      this.close();
      return;
    }
    const a = d?.closest?.("[data-node-id]")?.getAttribute?.("data-node-id");
    if (!a) {
      this.close();
      return;
    }
    const n = this.slate.nodes?.one?.(a);
    if (!n) return;
    if (i.preventDefault(), this.slate.governanceOf?.(n)) {
      this.close(), this.slate.selectNodes?.([n], !1);
      return;
    }
    (this.slate.getSelectedNodes?.() || []).includes(n) || this.slate.selectNodes?.([n], !1), this.open(i.clientX, i.clientY);
  }
  open(i, d) {
    this.close();
    const o = document.createElement("div");
    o.className = "sb-context-menu", o.style.cssText = "position:fixed;z-index:100000;background:#fff;border:1px solid #e3e5ea;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,0.18);padding:4px 0;min-width:180px;font:13px/1.4 system-ui,-apple-system,sans-serif;color:#222;user-select:none;", o.style.left = `${i}px`, o.style.top = `${d}px`, this.targetNodes = [...this.slate.getSelectedNodes?.() || []].filter(
      (t) => !this.slate.governanceOf?.(t)
    );
    const a = this.targetNodes.length, n = [
      { label: "Bring to front", act: () => this.forEachTarget((t) => t.toFront?.()) },
      { label: "Send to back", act: () => this.forEachTarget((t) => t.toBack?.()) },
      { label: "Duplicate", act: () => this.duplicateTargets() },
      { label: "Delete", act: () => this.deleteTargets(), danger: !0 }
    ];
    a >= 2 && n.push(
      { divider: !0 },
      { label: "Align left", act: () => this.slate.alignNodes?.("left", this.targetNodes) },
      { label: "Align center", act: () => this.slate.alignNodes?.("centerH", this.targetNodes) },
      { label: "Align right", act: () => this.slate.alignNodes?.("right", this.targetNodes) },
      { label: "Align top", act: () => this.slate.alignNodes?.("top", this.targetNodes) },
      { label: "Align middle", act: () => this.slate.alignNodes?.("middle", this.targetNodes) },
      { label: "Align bottom", act: () => this.slate.alignNodes?.("bottom", this.targetNodes) }
    ), a >= 3 && n.push(
      { label: "Distribute horizontally", act: () => this.slate.distributeNodes?.("horizontal", this.targetNodes) },
      { label: "Distribute vertically", act: () => this.slate.distributeNodes?.("vertical", this.targetNodes) }
    );
    for (const t of n) {
      if (t.divider) {
        const l = document.createElement("div");
        l.style.cssText = "height:1px;background:#e3e5ea;margin:4px 0;", o.appendChild(l);
        continue;
      }
      const s = document.createElement("div");
      s.textContent = t.label || "", s.style.cssText = "padding:7px 16px;cursor:pointer;white-space:nowrap;" + (t.danger ? "color:#d32f2f;" : ""), s.addEventListener("mouseenter", () => {
        s.style.background = t.danger ? "#fdecea" : "#f2f4f7";
      }), s.addEventListener("mouseleave", () => {
        s.style.background = "";
      }), s.addEventListener("click", (l) => {
        l.stopPropagation();
        try {
          t.act?.();
        } catch {
        }
        this.close();
      }), o.appendChild(s);
    }
    document.body.appendChild(o), this.el = o;
    const e = o.getBoundingClientRect();
    e.right > window.innerWidth && (o.style.left = `${Math.max(4, window.innerWidth - e.width - 8)}px`), e.bottom > window.innerHeight && (o.style.top = `${Math.max(4, window.innerHeight - e.height - 8)}px`), this.boundDismiss = (t) => {
      this.el && !this.el.contains(t.target) && this.close();
    }, this.boundEsc = (t) => {
      t.key === "Escape" && this.close();
    }, setTimeout(() => {
      this.boundDismiss && document.addEventListener("pointerdown", this.boundDismiss, !0), this.boundEsc && document.addEventListener("keydown", this.boundEsc, !0);
    }, 0);
  }
  close() {
    this.el && (this.el.remove(), this.el = null), this.boundDismiss && (document.removeEventListener("pointerdown", this.boundDismiss, !0), this.boundDismiss = null), this.boundEsc && (document.removeEventListener("keydown", this.boundEsc, !0), this.boundEsc = null);
  }
  forEachTarget(i) {
    for (const d of this.targetNodes) i(d);
  }
  /** Delete the target nodes (removeNode broadcasts onNodeDeleted → persists). */
  deleteTargets() {
    if (!(this.slate.isReadOnly?.() || this.slate.isCommentOnly?.())) {
      for (const i of [...this.targetNodes]) this.slate.removeNode?.(i.id);
      this.slate.clearSelection?.();
    }
  }
  /** Duplicate these notes (offset +20,+20, connections between them kept) and select the copies. */
  duplicate(i) {
    this.targetNodes = [...i], this.duplicateTargets();
  }
  /** Duplicate the target nodes offset (+20,+20); addNode broadcasts → persists. */
  duplicateTargets() {
    if (this.slate.isReadOnly?.() || this.slate.isCommentOnly?.()) return;
    const i = [], d = /* @__PURE__ */ new Map(), o = new Set(this.targetNodes.map((n) => n.id));
    for (const n of this.targetNodes) {
      let e;
      try {
        e = JSON.parse(JSON.stringify(n.options || {}));
      } catch {
        e = { ...n.options || {} };
      }
      const t = e.id;
      e.id = c(), e.x = (e.x || 0) + 20, e.y = (e.y || 0) + 20, delete e.parentArrowForChildren, delete e.noChildArrowForChildren, delete e.associations;
      try {
        const s = this.slate.addNode?.(e);
        s && (i.push(s), t && d.set(t, s));
      } catch {
      }
    }
    const a = [];
    for (const n of this.targetNodes) {
      const e = n.relationships?.assocMap;
      if (e) {
        for (const t of e.values())
          if (o.has(t.childId)) {
            let s = {};
            try {
              s = JSON.parse(JSON.stringify(t));
            } catch {
              s = { ...t };
            }
            delete s.id, delete s.childId, delete s.parentId, a.push({
              parentSrcId: n.id,
              childSrcId: t.childId,
              data: s
            });
          }
      }
    }
    if (i.length > 0) {
      const n = () => {
        this.slate.selectNodes?.(i, !1);
        for (const t of a) {
          const s = d.get(t.parentSrcId), l = d.get(t.childSrcId);
          if (s && l)
            try {
              s.relationships?.addAssociation?.(l, t.data);
            } catch {
            }
        }
      }, e = i.map((t) => t?.ready).filter(Boolean);
      e.length ? Promise.all(e).then(n).catch(n) : setTimeout(n, 120);
    }
  }
}
export {
  g as ContextMenu
};
