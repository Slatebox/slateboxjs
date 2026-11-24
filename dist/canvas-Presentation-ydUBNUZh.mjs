class b {
  constructor(t) {
    this.steps = [], this.currentStep = -1, this.isActive = !1, this.zoomLevel = 1.5, this._animRaf = null, this.slate = t;
  }
  /**
   * The notes a presentation may stop at. Decoration a host draws behind or beside
   * its own notes (a drag policy's `canSelect: false`: a workshop's lane columns and
   * captions) is scenery, never a stop.
   */
  stops() {
    const t = this.slate.nodes?.allNodes || [];
    return typeof this.slate.capabilitiesOf != "function" ? [...t] : t.filter((s) => this.slate.capabilitiesOf(s).canSelect !== !1);
  }
  /**
   * Extract presentation layout from current nodes.
   * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
   */
  extractLayout(t) {
    let s = this.stops();
    if (t?.nodeIds) {
      const i = new Set(t.nodeIds);
      s = s.filter((n) => i.has(n.id));
    }
    return s.sort((i, n) => {
      const e = i.options._presentationIndex, h = n.options._presentationIndex;
      if (e !== void 0 && h !== void 0) return e - h;
      const r = (i.options.y || 0) - (n.options.y || 0);
      return Math.abs(r) > 30 ? r : (i.options.x || 0) - (n.options.x || 0);
    }), this.steps = s.map((i, n) => ({
      nodeId: i.id,
      index: n
    })), this.steps;
  }
  /**
   * Build the hierarchical presentation layout (preziData) — a tree of root
   * nodes → children with per-node metrics + descriptions. This is the structure
   * the AI consumes to decide the presentation ORDER (ported from v1
   * slate.extractPresentationLayout). Bbox is relative to `orientData`'s left/top
   * when the host gives it (as v1 did: the origin of the SVG export the host
   * plays the presentation over), otherwise to the stops' own top-left.
   */
  extractPresentationLayout(t = {}) {
    const s = this.stops().filter((o) => !o.options?.isCategory);
    let i = 1 / 0, n = 1 / 0, e = -1 / 0, h = -1 / 0;
    s.forEach((o) => {
      const a = o.options || {};
      i = Math.min(i, a.x || 0), n = Math.min(n, a.y || 0), e = Math.max(e, (a.x || 0) + (a.width || 0)), h = Math.max(h, (a.y || 0) + (a.height || 0));
    }), isFinite(i) || (i = 0, n = 0, e = 0, h = 0);
    const r = t?.orientData, d = {
      left: Number.isFinite(r?.left) ? r.left : i,
      top: Number.isFinite(r?.top) ? r.top : n,
      width: e - i,
      height: h - n
    }, c = new Map(s.map((o) => [o.id, o])), u = (o) => (o.relationships?.associations || []).map((a) => a.childId).filter((a) => c.has(a)), l = new Set(s.flatMap(u)), p = /* @__PURE__ */ new Set(), f = (o) => {
      if (p.has(o.id)) return null;
      p.add(o.id);
      const a = o.options || {}, x = u(o).map((g) => c.get(g)).filter(Boolean);
      return {
        nodeId: o.id,
        metrics: {
          rotation: Math.ceil(a.rotate?.rotationAngle || 0),
          bbox: {
            x: Number(((a.x || 0) - d.left).toFixed(2)),
            y: Number(((a.y || 0) - d.top).toFixed(2)),
            width: Number((a.width || 0).toFixed(2)),
            height: Number((a.height || 0).toFixed(2))
          }
        },
        description: a.text || a.description || "",
        image: a.image,
        numberOfChildrenNodes: x.length,
        childrenNodes: x.map(f).filter(Boolean)
      };
    }, m = s.filter((o) => !l.has(o.id)).map(f);
    for (const o of s)
      p.has(o.id) || m.push(f(o));
    return {
      presentationHeight: Math.ceil(d.height),
      presentationWidth: Math.ceil(d.width),
      nodes: m
    };
  }
  /**
   * Set the step order explicitly (e.g. from the AI's returned ordering). IDs
   * that don't exist are skipped; any nodes the AI omitted are appended in the
   * default layout order so nothing is lost.
   */
  setStepOrder(t) {
    const s = new Set(this.stops().map((e) => e.id)), i = /* @__PURE__ */ new Set(), n = [];
    return (t || []).forEach((e) => {
      s.has(e) && !i.has(e) && (i.add(e), n.push(e));
    }), this.extractLayout().forEach((e) => {
      i.has(e.nodeId) || (i.add(e.nodeId), n.push(e.nodeId));
    }), this.steps = n.map((e, h) => ({ nodeId: e, index: h })), this.currentStep = -1, this.steps;
  }
  /** Start presentation mode */
  start(t = 450) {
    this.steps.length === 0 && this.extractLayout(), this.isActive = !0, this.currentStep = -1, this.next(t);
  }
  /** Stop presentation mode */
  stop() {
    this.stopMedia(), this.isActive = !1, this.currentStep = -1, this._animRaf !== null && (cancelAnimationFrame(this._animRaf), this._animRaf = null);
  }
  /** Stop every video playing on the slate (media notes play only while their step shows). */
  stopMedia() {
    for (const t of this.slate.nodes?.allNodes ?? []) t?.media?.stop?.();
  }
  /** Go to next step */
  next(t = 450) {
    return this.currentStep >= this.steps.length - 1 ? !1 : (this.currentStep++, this.goToStep(this.currentStep, t), !0);
  }
  /** Go to previous step */
  previous(t = 450) {
    return this.currentStep <= 0 ? !1 : (this.currentStep--, this.goToStep(this.currentStep, t), !0);
  }
  /**
   * Go to a specific step, smoothly panning+zooming the viewport so the step's
   * node is centered (P3). Pass duration 0 for an instant jump.
   */
  goToStep(t, s = 450) {
    if (t < 0 || t >= this.steps.length) return;
    this.stopMedia(), this.currentStep = t;
    const i = this.steps[t], n = this.slate.nodes.one(i.nodeId);
    if (n)
      try {
        const e = n.options, h = e.width || 0, r = e.height || 0, d = (e.x || 0) + h / 2, c = (e.y || 0) + r / 2, l = this.slate.canvas.viewbox(), p = this.slate.panZoom.getViewportSize(), f = (e.rotate?.rotationAngle || 0) * Math.PI / 180, m = Math.abs(Math.cos(f)), o = Math.abs(Math.sin(f)), a = Math.max(1, h * m + r * o), x = Math.max(1, r * m + h * o), g = Math.min(
          this.zoomLevel > 0 ? this.zoomLevel : 1,
          0.9 * p.w / a,
          0.9 * p.h / x
        ), y = p.w / g, w = p.h / g, S = { x: d - y / 2, y: c - w / 2, width: y, height: w };
        this.animateViewbox(
          { x: l.x, y: l.y, width: l.width, height: l.height },
          S,
          s
        );
      } catch {
      }
  }
  /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
  animateViewbox(t, s, i) {
    const n = this.slate.canvas, e = (c, u, l, p) => {
      try {
        n.viewbox(c, u, l, p);
      } catch {
      }
    };
    if (this._animRaf != null) {
      try {
        cancelAnimationFrame(this._animRaf);
      } catch {
      }
      this._animRaf = null;
    }
    if (!i || i <= 0 || typeof requestAnimationFrame > "u") {
      e(s.x, s.y, s.width, s.height);
      return;
    }
    const h = (c) => c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
    let r = null;
    const d = (c) => {
      r === null && (r = c);
      const u = Math.min(1, (c - r) / i), l = h(u);
      e(
        t.x + (s.x - t.x) * l,
        t.y + (s.y - t.y) * l,
        t.width + (s.width - t.width) * l,
        t.height + (s.height - t.height) * l
      ), u < 1 ? this._animRaf = requestAnimationFrame(d) : this._animRaf = null;
    };
    this._animRaf = requestAnimationFrame(d);
  }
  /** Get current step index */
  getCurrentStep() {
    return this.currentStep;
  }
  /** Get total steps */
  getTotalSteps() {
    return this.steps.length;
  }
  /** Check if presentation is active */
  isPresenting() {
    return this.isActive;
  }
  /** Destroy the presentation, stopping if active */
  destroy() {
    this.stop(), this.steps = [], this.currentStep = -1, this.slate = null;
  }
}
export {
  b as Presentation
};
