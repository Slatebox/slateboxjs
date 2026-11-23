import { S as f } from "./canvas-canvas-CUfecscQ.mjs";
class w {
  constructor(t, e = {}) {
    this.container = null, this.miniCanvas = null, this.viewportIndicator = null, this.nodeLayer = null, this.nodeShapes = /* @__PURE__ */ new Map(), this._enabled = !1, this.isDragging = !1, this.scale = 0.1, this.dragStartX = 0, this.dragStartY = 0, this.viewportStartX = 0, this.viewportStartY = 0, this.zoomControlsContainer = null, this.boundMouseMove = null, this.boundMouseUp = null, this.boundTouchMove = null, this.boundTouchEnd = null, this.refreshTimeoutId = null, this.pollIntervalId = null, this.zoomDisplayIntervalId = null, this.slate = t, this.options = {
      enabled: !1,
      position: "bottom-right",
      // Miro-style: bottom-right by default
      width: 200,
      height: 150,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      // Light enough that the notes and lanes under the rectangle read through it;
      // the border carries the outline.
      viewportColor: "rgba(66, 133, 244, 0.12)",
      viewportBorderColor: "#4285f4",
      nodeColor: "#666666",
      borderRadius: 4,
      margin: 10,
      showZoomControls: !0,
      // Show zoom controls by default
      ...e
    };
  }
  enable() {
    this._enabled || (this._enabled = !0, this.createContainer(), this.createMiniCanvas(), this.renderNodes(), this.createViewportIndicator(), this.setupEventListeners(), this.updateViewport(), this.options.showZoomControls && this.createZoomControls(), console.log("BIRDSEYE_DEBUG: BirdsEye enabled"));
  }
  disable() {
    this._enabled && (this._enabled = !1, this.removeEventListeners(), this.removeZoomControls(), this.container && this.container.parentNode && this.container.parentNode.removeChild(this.container), this.container = null, this.miniCanvas = null, this.nodeLayer = null, this.viewportIndicator = null, this.nodeShapes.clear(), console.log("BIRDSEYE_DEBUG: BirdsEye disabled"));
  }
  isEnabled() {
    return this._enabled;
  }
  refresh() {
    this._enabled && (this.renderNodes(), this.updateViewport());
  }
  updateViewport() {
    if (!this._enabled || !this.viewportIndicator || !this.miniCanvas) return;
    const t = this.slate.panZoom;
    if (!t) return;
    const e = t.getZoom() || 1, o = t.getPan() || { x: 0, y: 0 }, n = this.options.width || 200, a = this.options.height || 150, i = this.calculateContentBounds(), r = Math.max(i.maxX - i.minX, 1), l = Math.max(i.maxY - i.minY, 1), s = 100, h = r + s * 2, c = l + s * 2;
    this.scale = Math.min(
      n / h,
      a / c
    );
    const d = (this.slate.options.viewPort?.originalWidth || 800) / e, u = (this.slate.options.viewPort?.originalHeight || 600) / e, p = (o.x - i.minX + s) * this.scale, v = (o.y - i.minY + s) * this.scale, m = d * this.scale, b = u * this.scale;
    this.viewportIndicator.move(p, v), this.viewportIndicator.size(Math.max(m, 10), Math.max(b, 10));
  }
  updateNodePosition(t) {
    if (!this._enabled) return;
    const e = this.nodeShapes.get(t.id);
    if (!e) return;
    const o = this.calculateContentBounds(), n = 100, a = (t.options.x - o.minX + n) * this.scale, i = (t.options.y - o.minY + n) * this.scale;
    this.animateShapeMove(e, a, i);
    const r = (t.options.width || 100) * this.scale, l = (t.options.height || 60) * this.scale;
    this.applyShapeRotation(e, t, a, i, r, l);
  }
  /**
   * Rotate a minimap shape to match the node's rotation, about its center.
   * Absolute (transform, not the relative .rotate()) so repeated updates don't
   * accumulate. Position (x/y attrs from move) is unaffected.
   */
  applyShapeRotation(t, e, o, n, a, i) {
    const r = e.options.rotate?.rotationAngle || 0;
    try {
      t.transform({ rotate: r, origin: [o + a / 2, n + i / 2] });
    } catch {
    }
  }
  /**
   * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
   * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
   */
  animateShapeMove(t, e, o, n = 220) {
    if (typeof requestAnimationFrame > "u") {
      try {
        t.move(e, o);
      } catch {
      }
      return;
    }
    let a = e, i = o;
    try {
      a = t.x(), i = t.y();
    } catch {
    }
    if (t._beRaf)
      try {
        cancelAnimationFrame(t._beRaf);
      } catch {
      }
    const r = (h) => h < 0.5 ? 2 * h * h : 1 - Math.pow(-2 * h + 2, 2) / 2;
    let l = null;
    const s = (h) => {
      l === null && (l = h);
      const c = Math.min(1, (h - l) / n), d = r(c);
      try {
        t.move(a + (e - a) * d, i + (o - i) * d);
      } catch {
      }
      c < 1 ? t._beRaf = requestAnimationFrame(s) : t._beRaf = null;
    };
    t._beRaf = requestAnimationFrame(s);
  }
  addNodeShape(t) {
    if (!this._enabled || !this.miniCanvas) return;
    const e = this.calculateContentBounds(), o = 100, n = (t.options.x - e.minX + o) * this.scale, a = (t.options.y - e.minY + o) * this.scale, i = (t.options.width || 100) * this.scale, r = (t.options.height || 60) * this.scale, l = this.nodeLayer ?? this.miniCanvas;
    let s;
    if (t.options.shape === "circle") {
      const h = Math.min(i, r) / 2;
      s = l.circle(h * 2).move(n, a);
    } else
      s = l.rect(i, r).move(n, a);
    s.fill(t.options.backgroundColor || this.options.nodeColor), s.stroke({ width: 0 }), this.applyShapeRotation(s, t, n, a, i, r), this.nodeShapes.set(t.id, s);
    try {
      s.opacity(0), s.animate(220).opacity(1);
    } catch {
    }
    this.keepIndicatorOnTop();
  }
  /** The viewport rectangle is the last thing painted in the minimap. */
  keepIndicatorOnTop() {
    if (this.viewportIndicator)
      try {
        this.viewportIndicator.front();
      } catch {
      }
  }
  removeNodeShape(t) {
    const e = this.nodeShapes.get(t);
    if (e) {
      try {
        e._beRaf && cancelAnimationFrame(e._beRaf), e.animate(180).opacity(0).after(() => {
          try {
            e.remove();
          } catch {
          }
        });
      } catch {
        try {
          e.remove();
        } catch {
        }
      }
      this.nodeShapes.delete(t);
    }
  }
  createContainer() {
    this.container = document.createElement("div"), this.container.className = "slateboxjs-birdseye";
    const t = this.options.position || "bottom-right", e = this.options.margin || 10;
    switch (this.container.style.position = "absolute", this.container.style.width = `${this.options.width}px`, this.container.style.height = `${this.options.height}px`, this.container.style.backgroundColor = this.options.backgroundColor, this.container.style.borderRadius = `${this.options.borderRadius}px`, this.container.style.border = "1px solid #ccc", this.container.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)", this.container.style.overflow = "hidden", this.container.style.zIndex = "100", t) {
      case "top-left":
        this.container.style.top = `${e}px`, this.container.style.left = `${e}px`;
        break;
      case "top-right":
        this.container.style.top = `${e}px`, this.container.style.right = `${e}px`;
        break;
      case "bottom-left":
        this.container.style.bottom = `${e}px`, this.container.style.left = `${e}px`;
        break;
      case "bottom-right":
      default:
        this.container.style.bottom = `${e}px`, this.container.style.right = `${e}px`;
        break;
    }
    this.slate.element.appendChild(this.container);
  }
  createMiniCanvas() {
    this.container && (this.miniCanvas = f().addTo(this.container).size(this.options.width, this.options.height), this.miniCanvas.css({ "touch-action": "none" }), this.miniCanvas.rect(this.options.width, this.options.height).fill("#f8f9fa"), this.nodeLayer = this.miniCanvas.group().attr({ class: "slateboxjs-birdseye-nodes", "pointer-events": "none" }));
  }
  renderNodes() {
    if (!this.miniCanvas) return;
    this.nodeShapes.forEach((s) => s.remove()), this.nodeShapes.clear();
    const t = this.calculateContentBounds(), e = 100, o = Math.max(t.maxX - t.minX, 1), n = Math.max(t.maxY - t.minY, 1), a = o + e * 2, i = n + e * 2;
    this.scale = Math.min(
      this.options.width / a,
      this.options.height / i
    );
    const r = this.nodeLayer ?? this.miniCanvas;
    this.slate.getAllNodes().forEach((s) => {
      const h = (s.options.x - t.minX + e) * this.scale, c = (s.options.y - t.minY + e) * this.scale, d = Math.max((s.options.width || 100) * this.scale, 2), u = Math.max((s.options.height || 60) * this.scale, 2);
      let p;
      if (s.options.shape === "circle") {
        const m = Math.min(d, u) / 2;
        p = r.circle(m * 2).move(h, c);
      } else
        p = r.rect(d, u).move(h, c);
      p.fill(s.options.backgroundColor || this.options.nodeColor), p.stroke({ width: 0 });
      const v = s.options.rotate?.rotationAngle || 0;
      if (v !== 0) {
        const m = h + d / 2, b = c + u / 2;
        p.rotate(v, m, b);
      }
      this.nodeShapes.set(s.id, p);
    }), this.keepIndicatorOnTop();
  }
  createViewportIndicator() {
    this.miniCanvas && (this.viewportIndicator = this.miniCanvas.rect(50, 40).attr("class", "slateboxjs-birdseye-viewport").fill(this.options.viewportColor).stroke({ color: this.options.viewportBorderColor, width: 2 }).attr("pointer-events", "all").css({ cursor: "move" }), this.viewportIndicator.on("mousedown", (t) => {
      t.preventDefault(), t.stopPropagation();
      const e = t;
      this.beginDrag(e.clientX, e.clientY), this.boundMouseMove = this.handleMouseMove.bind(this), this.boundMouseUp = this.handleMouseUp.bind(this), document.addEventListener("mousemove", this.boundMouseMove), document.addEventListener("mouseup", this.boundMouseUp);
    }), this.viewportIndicator.on(
      "touchstart",
      (t) => {
        const e = t, o = e.touches?.[0];
        o && (e.preventDefault(), e.stopPropagation(), this.beginDrag(o.clientX, o.clientY), this.removeTouchDragListeners(), this.boundTouchMove = (n) => {
          const a = n.touches?.[0] ?? n.changedTouches?.[0];
          a && (n.cancelable && n.preventDefault(), this.handleMouseMove({ clientX: a.clientX, clientY: a.clientY }));
        }, this.boundTouchEnd = () => {
          this.isDragging = !1, this.removeTouchDragListeners();
        }, document.addEventListener("touchmove", this.boundTouchMove, { passive: !1 }), document.addEventListener("touchend", this.boundTouchEnd), document.addEventListener("touchcancel", this.boundTouchEnd));
      },
      void 0,
      { passive: !1 }
    ), this.miniCanvas.on("mousedown", (t) => {
      const e = t;
      this.jumpTo(e.clientX, e.clientY);
    }), this.miniCanvas.on(
      "touchstart",
      (t) => {
        const e = t.touches?.[0];
        e && (t.preventDefault(), this.jumpTo(e.clientX, e.clientY));
      },
      void 0,
      { passive: !1 }
    ));
  }
  beginDrag(t, e) {
    this.isDragging = !0, this.dragStartX = t, this.dragStartY = e;
    const o = this.viewportIndicator.bbox();
    this.viewportStartX = o.x, this.viewportStartY = o.y;
  }
  /** Center the view on a point of the minimap. */
  jumpTo(t, e) {
    try {
      const o = this.miniCanvas.point(t, e), n = this.viewportIndicator?.bbox().width || 50, a = this.viewportIndicator?.bbox().height || 40, i = this.calculateContentBounds(), r = 100, l = (o.x - n / 2) / this.scale + i.minX - r, s = (o.y - a / 2) / this.scale + i.minY - r;
      this.slate.panZoom?.pan({ x: l, y: s });
    } catch {
    }
  }
  removeTouchDragListeners() {
    this.boundTouchMove && (document.removeEventListener("touchmove", this.boundTouchMove), this.boundTouchMove = null), this.boundTouchEnd && (document.removeEventListener("touchend", this.boundTouchEnd), document.removeEventListener("touchcancel", this.boundTouchEnd), this.boundTouchEnd = null);
  }
  handleMouseMove(t) {
    if (!this.isDragging || !this.viewportIndicator) return;
    const e = t.clientX - this.dragStartX, o = t.clientY - this.dragStartY, n = this.viewportStartX + e, a = this.viewportStartY + o;
    this.viewportIndicator.move(n, a);
    const i = this.calculateContentBounds(), r = 100, l = n / this.scale + i.minX - r, s = a / this.scale + i.minY - r;
    this.slate.panZoom?.pan({ x: l, y: s });
  }
  handleMouseUp() {
    this.isDragging = !1, this.boundMouseMove && (document.removeEventListener("mousemove", this.boundMouseMove), this.boundMouseMove = null), this.boundMouseUp && (document.removeEventListener("mouseup", this.boundMouseUp), this.boundMouseUp = null);
  }
  setupEventListeners() {
    this.slate.canvas && (this.slate.canvas.on?.("zoom.birdseye", () => {
      this.updateViewport();
    }), this.slate.canvas.on?.("panning.birdseye", () => {
      this.updateViewport();
    }), this.slate.canvas.on?.("panEnd.birdseye", () => {
      this.updateViewport();
    })), this.startPolling();
  }
  /**
   * Schedule a refresh using trailing-edge debounce.
   * Waits until events settle (300ms of no activity) before refreshing.
   * This avoids unnecessary updates during continuous operations like rotation.
   */
  scheduleRefresh() {
    this.refreshTimeoutId !== null && window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = window.setTimeout(() => {
      this.refresh(), this.refreshTimeoutId = null;
    }, 300);
  }
  removeEventListeners() {
    this.boundMouseMove && (document.removeEventListener("mousemove", this.boundMouseMove), this.boundMouseMove = null), this.boundMouseUp && (document.removeEventListener("mouseup", this.boundMouseUp), this.boundMouseUp = null), this.removeTouchDragListeners(), this.isDragging = !1, this.slate.canvas && this.slate.canvas.off?.(".birdseye"), this.refreshTimeoutId !== null && (window.clearTimeout(this.refreshTimeoutId), this.refreshTimeoutId = null), this.stopPolling();
  }
  startPolling() {
    this.pollIntervalId = window.setInterval(() => {
      this._enabled && this.updateViewport();
    }, 100);
  }
  stopPolling() {
    this.pollIntervalId !== null && (window.clearInterval(this.pollIntervalId), this.pollIntervalId = null);
  }
  createZoomControls() {
    if (!this.container) return;
    this.zoomControlsContainer = document.createElement("div"), this.zoomControlsContainer.className = "slateboxjs-birdseye-zoom-controls", this.zoomControlsContainer.style.cssText = `
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 4px;
      padding: 6px 8px;
      background: rgba(255, 255, 255, 0.95);
      border-top: 1px solid #e0e0e0;
      border-radius: 0 0 ${this.options.borderRadius}px ${this.options.borderRadius}px;
    `;
    const t = document.createElement("button");
    t.textContent = "−", t.title = "Zoom Out", t.style.cssText = this.getZoomButtonStyle(), t.addEventListener("click", () => this.slate.panZoom?.zoomOut()), this.zoomControlsContainer.appendChild(t);
    const e = document.createElement("span");
    e.id = "birdseye-zoom-display", e.style.cssText = `
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
      color: #333;
      min-width: 45px;
      text-align: center;
      cursor: pointer;
    `, e.textContent = "100%", e.title = "Reset to 100%", e.addEventListener("click", () => {
      this.slate.panZoom?.reset(), this.updateZoomDisplay();
    }), this.zoomControlsContainer.appendChild(e);
    const o = document.createElement("button");
    o.textContent = "+", o.title = "Zoom In", o.style.cssText = this.getZoomButtonStyle(), o.addEventListener("click", () => this.slate.panZoom?.zoomIn()), this.zoomControlsContainer.appendChild(o), this.container.appendChild(this.zoomControlsContainer), this.startZoomDisplayUpdates();
  }
  getZoomButtonStyle() {
    return `
      width: 28px;
      height: 28px;
      border: 1px solid #e0e0e0;
      background: #f8f9fa;
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    `;
  }
  updateZoomDisplay() {
    const t = this.container?.querySelector("#birdseye-zoom-display");
    if (t && this.slate.panZoom) {
      const e = this.slate.panZoom.getZoom() || 1;
      t.textContent = `${Math.round(e * 100)}%`;
    }
  }
  startZoomDisplayUpdates() {
    this.zoomDisplayIntervalId = window.setInterval(() => {
      this._enabled && this.updateZoomDisplay();
    }, 200);
  }
  removeZoomControls() {
    this.zoomDisplayIntervalId !== null && (window.clearInterval(this.zoomDisplayIntervalId), this.zoomDisplayIntervalId = null), this.zoomControlsContainer && this.zoomControlsContainer.parentNode && (this.zoomControlsContainer.parentNode.removeChild(this.zoomControlsContainer), this.zoomControlsContainer = null);
  }
  calculateContentBounds() {
    const t = this.slate.getAllNodes();
    if (t.length === 0) {
      const i = this.slate.options.viewPort?.originalWidth || 800, r = this.slate.options.viewPort?.originalHeight || 600;
      return { minX: 0, minY: 0, maxX: i, maxY: r };
    }
    let e = 1 / 0, o = 1 / 0, n = -1 / 0, a = -1 / 0;
    return t.forEach((i) => {
      const r = i.options.x || 0, l = i.options.y || 0, s = i.options.width || 100, h = i.options.height || 60;
      e = Math.min(e, r), o = Math.min(o, l), n = Math.max(n, r + s), a = Math.max(a, l + h);
    }), { minX: e, minY: o, maxX: n, maxY: a };
  }
}
export {
  w as BirdsEye
};
