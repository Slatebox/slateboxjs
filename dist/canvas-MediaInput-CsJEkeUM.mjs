import { p as f, M as r, s as v } from "./canvas-media-D5MZ8APN.mjs";
import { g as m } from "./canvas-canvas-e7qaju8s.mjs";
const g = ["text/uri-list", "text/plain"], l = /* @__PURE__ */ new Set();
let i = null;
function p(o) {
  if (!o) return null;
  const t = String(o).split(/\r?\n/).map((e) => e.trim()).filter((e) => e && !e.startsWith("#"));
  return t.length !== 1 ? null : f(t[0]) ? t[0] : null;
}
class P {
  constructor(t, e = {}) {
    this.onPaste = null, this.onDragOver = null, this.onDrop = null, this.onPress = null, this.slate = t, this.options = { enabled: !0, ...e };
  }
  isEnabled() {
    return this.options.enabled && this.onPaste !== null;
  }
  updateOptions(t) {
    this.options = { ...this.options, ...t }, this.options.enabled ? this.enable() : this.disable();
  }
  /** Listen for pastes on the page and drops on this canvas. */
  enable() {
    if (this.options.enabled = !0, this.onPaste || typeof document > "u") return;
    this.onPaste = (e) => this.handlePaste(e), this.onDragOver = (e) => this.handleDragOver(e), this.onDrop = (e) => this.handleDrop(e), this.onPress = () => {
      i = this;
    }, document.addEventListener("paste", this.onPaste);
    const t = this.slate?.element;
    t?.addEventListener("dragover", this.onDragOver), t?.addEventListener("drop", this.onDrop), t?.addEventListener("pointerdown", this.onPress, !0), l.add(this);
  }
  disable() {
    this.options.enabled = !1, this.onPaste && document.removeEventListener("paste", this.onPaste);
    const t = this.slate?.element;
    this.onDragOver && t?.removeEventListener("dragover", this.onDragOver), this.onDrop && t?.removeEventListener("drop", this.onDrop), this.onPress && t?.removeEventListener("pointerdown", this.onPress, !0), this.onPaste = this.onDragOver = this.onDrop = null, this.onPress = null, l.delete(this), i === this && (i = null);
  }
  destroy() {
    this.disable(), this.slate = null;
  }
  /**
   * Make a media note for `url` with its centre at `at` (canvas coordinates; the
   * middle of the view when left out). False when the address is not a video a
   * note plays, or this viewer may not add notes.
   */
  add(t, e, s = "call") {
    const n = f(t);
    if (!n || !this.canAdd()) return !1;
    const d = e ?? this.viewCentre(), a = { url: t, media: n, x: Math.round(d.x), y: Math.round(d.y), via: s }, h = this.slate.options?.events?.onMediaRequested;
    if (typeof h == "function")
      return h(a), !0;
    const u = {
      id: m(),
      x: a.x - r.width / 2,
      y: a.y - r.height / 2,
      width: r.width,
      height: r.height
    };
    v(u, n);
    const c = this.slate.addNode(u);
    try {
      this.slate.selectNodes?.([c], !1);
    } catch {
    }
    return !0;
  }
  // ─── Private ─────────────────────────────────────────────────────
  canAdd() {
    const t = this.slate;
    return !!t && t.options?.enabled !== !1 && !t.isReadOnly?.() && !t.isCommentOnly?.();
  }
  viewCentre() {
    const t = this.slate.element?.getBoundingClientRect?.();
    if (!t || !t.width) return { x: 0, y: 0 };
    try {
      return this.slate.clientToWorld({ x: t.left + t.width / 2, y: t.top + t.height / 2 });
    } catch {
      return { x: 0, y: 0 };
    }
  }
  /** A paste belongs to the canvas when focus is on the page itself or inside this canvas, never in a field. */
  ownsPaste(t) {
    const e = t;
    return !e || !this.slate?.element || e.tagName === "INPUT" || e.tagName === "TEXTAREA" || e.isContentEditable || e.closest?.('[role="dialog"], [aria-modal="true"]') ? !1 : this.slate.element.contains(e) ? !0 : e !== document.body && e !== document.documentElement ? !1 : i ? i === this : l.size === 1;
  }
  handlePaste(t) {
    if (!this.options.enabled || t.defaultPrevented || !this.ownsPaste(t.target) || this.slate.nodes?.allNodes?.some((s) => s?.editor?.isInlineEditing?.())) return;
    const e = p(t.clipboardData?.getData("text/plain"));
    e && this.add(e, void 0, "paste") && t.preventDefault();
  }
  dropped(t) {
    const e = t.dataTransfer;
    if (!e) return null;
    for (const s of g) {
      const n = p(e.getData(s));
      if (n) return n;
    }
    return null;
  }
  handleDragOver(t) {
    if (!this.options.enabled || !this.canAdd()) return;
    Array.from(t.dataTransfer?.types ?? []).includes("text/uri-list") && (t.preventDefault(), t.dataTransfer && (t.dataTransfer.dropEffect = "copy"));
  }
  handleDrop(t) {
    if (!this.options.enabled || t.defaultPrevented) return;
    const e = this.dropped(t);
    if (!e) return;
    let s;
    try {
      s = this.slate.clientToWorld({ x: t.clientX, y: t.clientY });
    } catch {
      s = void 0;
    }
    this.add(e, s, "drop") && (t.preventDefault(), t.stopPropagation());
  }
}
export {
  P as MediaInput,
  p as videoAddressIn
};
