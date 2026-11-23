import '@svgdotjs/svg.panzoom.js'

export interface PanZoomOptions {
  enabled?: boolean
  panning?: boolean
  pinchZoom?: boolean
  wheelZoom?: boolean
  panButton?: number
  oneFingerPan?: boolean
  margins?: { top?: number; left?: number; right?: number; bottom?: number } | false
  zoomFactor?: number
  zoomMin?: number
  zoomMax?: number
  wheelZoomDeltaModeLinePixels?: number
  wheelZoomDeltaModeScreenPixels?: number
  momentum?: boolean
  momentumSlowdown?: number
  showControls?: boolean  // Show +/- zoom buttons
  controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  onPan?: (event: any) => void
  onZoom?: (event: any) => void
  onPanStart?: (event: any) => void
  onPanEnd?: (event: any) => void
}

export class PanZoom {
  private canvas: any
  private slate: any
  private options: PanZoomOptions
  private isEnabled: boolean = false
  private controlsContainer: HTMLDivElement | null = null

  /**
   * Creates the pan/zoom handler. Enables panning and zooming on the canvas.
   *
   * @param slate   - The parent Slate instance
   * @param options - Pan/zoom configuration (zoom factor, min/max, controls, etc.)
   */
  constructor(slate: any, options: PanZoomOptions = {}) {
    this.slate = slate
    this.canvas = slate.canvas
    this.options = {
      enabled: true,
      panning: true,
      pinchZoom: true,
      wheelZoom: true, // Enable wheel zoom for Ctrl+scroll
      // Middle-mouse drag pans (Miro/Figma convention). This frees LEFT-drag on
      // empty canvas for rubber-band multi-select (MultiSelection) instead of
      // both firing at once. Trackpad/wheel pan is a separate custom handler.
      panButton: 1,
      oneFingerPan: false,
      margins: false,
      zoomFactor: 0.3,
      zoomMin: 0.1,
      zoomMax: 10,
      wheelZoomDeltaModeLinePixels: 17,
      wheelZoomDeltaModeScreenPixels: 53,
      momentum: true, // Enable kinetic scrolling with inertia
      momentumSlowdown: 0.8, // Slowdown factor for momentum panning
      showControls: false, // BirdsEye has integrated zoom controls now
      controlsPosition: 'bottom-right',
      ...options
    }

    if (this.options.enabled) {
      this.init()
    }
  }

  private init() {
    try {
      // svg.panzoom.js handles drag-to-pan (background) and pinch-zoom.
      // We handle the WHEEL ourselves (below) for Miro-style behavior, so
      // the plugin's wheelZoom stays off.
      this.canvas.panZoom({
        panning: this.options.panning,
        pinchZoom: this.options.pinchZoom,
        wheelZoom: false,
        panButton: this.options.panButton,
        oneFingerPan: this.options.oneFingerPan,
        margins: this.options.margins,
        zoomFactor: this.options.zoomFactor,
        zoomMin: this.options.zoomMin,
        zoomMax: this.options.zoomMax,
        wheelZoomDeltaModeLinePixels: this.options.wheelZoomDeltaModeLinePixels,
        wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels,
        momentum: this.options.momentum,
        momentumSlowdown: this.options.momentumSlowdown
      })

      this.attachWheelHandler()
      this.attachTouchPan()

      this.isEnabled = true

      // Add event listeners
      if (this.options.onPanStart) {
        this.canvas.on('panStart', this.options.onPanStart)
      }
      if (this.options.onPan) {
        this.canvas.on('panning', this.options.onPan)
      }
      if (this.options.onPanEnd) {
        this.canvas.on('panEnd', this.options.onPanEnd)
      }
      if (this.options.onZoom) {
        this.canvas.on('zoom', this.options.onZoom)
      }

      // Create zoom controls if enabled
      if (this.options.showControls) {
        this.createZoomControls()
      }

      console.log('PanZoom initialized successfully with svg.panzoom.js')
    } catch (error) {
      console.warn('Failed to initialize pan/zoom:', error)
    }
  }

  private _wheelHandler: ((e: WheelEvent) => void) | null = null
  private _touchPan: { start: (e: TouchEvent) => void; move: (e: TouchEvent) => void; end: (e: TouchEvent) => void } | null = null

  /** Whether a finger on empty canvas pans it (so it does not start a selection rectangle). */
  public pansByTouch(): boolean {
    return this.isEnabled && this.options.panning !== false
  }

  /**
   * One finger on empty canvas pans it, as a finger scrolls any page: on a phone
   * that is how a person reaches what is below the screen. Two fingers still pinch
   * and pan (the plugin), a finger on a note still moves the note, and a mouse on
   * empty canvas still draws the selection rectangle. Hosts hear the same
   * panStart / panning / panEnd events a mouse pan sends.
   */
  private attachTouchPan(): void {
    const node = this.canvas.node as SVGSVGElement
    if (!node || typeof node.addEventListener !== "function" || this._touchPan) return
    let finger: { id: number; x: number; y: number } | null = null
    let panning = false
    const stop = (e: TouchEvent) => {
      if (!finger) return
      finger = null
      if (panning) {
        panning = false
        this.canvas.dispatch("panEnd", { event: e })
      }
    }
    const start = (e: TouchEvent) => {
      // A second finger makes it a pinch; a gesture another handler has claimed
      // (a connector pulled from a note) is not a pan either.
      if (!this.pansByTouch() || e.touches.length !== 1 || e.target !== node || e.defaultPrevented) {
        stop(e)
        return
      }
      const touch = e.touches[0]
      finger = { id: touch.identifier, x: touch.clientX, y: touch.clientY }
      panning = false
    }
    const move = (e: TouchEvent) => {
      if (!finger) return
      const touch = e.touches.length === 1 && e.touches[0].identifier === finger.id ? e.touches[0] : null
      if (!touch) {
        stop(e)
        return
      }
      const dx = touch.clientX - finger.x
      const dy = touch.clientY - finger.y
      // A tap that wobbles is still a tap.
      if (!panning && Math.hypot(dx, dy) < 6) return
      if (e.cancelable) e.preventDefault()
      if (!panning) {
        panning = true
        this.canvas.dispatch("panStart", { event: e })
      }
      const vb = this.canvas.viewbox()
      const rect = node.getBoundingClientRect()
      const unitsPerPx = vb.width / (rect.width || vb.width)
      const box = { x: vb.x - dx * unitsPerPx, y: vb.y - dy * unitsPerPx, width: vb.width, height: vb.height }
      finger.x = touch.clientX
      finger.y = touch.clientY
      if (!this.canvas.dispatch("panning", { box, event: e }).defaultPrevented) {
        this.canvas.viewbox(box.x, box.y, box.width, box.height)
      }
    }
    node.addEventListener("touchstart", start, { passive: true })
    document.addEventListener("touchmove", move, { passive: false })
    document.addEventListener("touchend", stop)
    document.addEventListener("touchcancel", stop)
    this._touchPan = { start, move, end: stop }
  }

  private detachTouchPan(): void {
    if (!this._touchPan) return
    this.canvas.node?.removeEventListener?.("touchstart", this._touchPan.start)
    document.removeEventListener("touchmove", this._touchPan.move)
    document.removeEventListener("touchend", this._touchPan.end)
    document.removeEventListener("touchcancel", this._touchPan.end)
    this._touchPan = null
  }

  /**
   * Miro-style wheel behavior on the canvas:
   *  - two-finger trackpad scroll (plain wheel) → PAN
   *  - ctrl/⌘ + wheel (pinch on trackpads, or modifier + wheel) → ZOOM at
   *    the cursor
   * Works directly on the viewBox so it's consistent with the infinite
   * canvas and independent of the plugin's wheel logic.
   */
  private attachWheelHandler(): void {
    const node = this.canvas.node as SVGSVGElement
    if (!node || typeof node.addEventListener !== "function") return
    this._wheelHandler = (e: WheelEvent) => {
      if (!this.isEnabled) return
      e.preventDefault()

      const vb = this.canvas.viewbox()
      const rect = node.getBoundingClientRect()
      const px = rect.width || vb.width
      const unitsPerPx = vb.width / px

      if (e.ctrlKey || e.metaKey) {
        // Zoom toward the cursor. deltaY<0 (pinch out / scroll up) zooms in.
        // Gentle coefficient so a single wheel notch is a smooth ~1.1-1.2x,
        // and trackpad pinch (many small deltas) accumulates naturally.
        const factor = Math.exp(-e.deltaY * 0.0025)
        const min = this.options.zoomMin ?? 0.1
        const max = this.options.zoomMax ?? 10
        const curZoom = px / vb.width
        let newZoom = curZoom * factor
        newZoom = Math.max(min, Math.min(max, newZoom))
        const newW = px / newZoom
        const newH = (vb.height / vb.width) * newW
        // Keep the world point under the cursor fixed
        const px0 = e.clientX - rect.left
        const py0 = e.clientY - rect.top
        const wx = vb.x + px0 * unitsPerPx
        const wy = vb.y + py0 * (vb.height / rect.height || unitsPerPx)
        const nx = wx - (px0 / px) * newW
        const ny = wy - (py0 / (rect.height || px)) * newH
        this.canvas.viewbox(nx, ny, newW, newH)
      } else {
        // Pan by the scroll delta (screen px → world units)
        this.canvas.viewbox(
          vb.x + e.deltaX * unitsPerPx,
          vb.y + e.deltaY * unitsPerPx,
          vb.width,
          vb.height
        )
      }

      // Notify listeners (coordinate display, followMe broadcast on panEnd)
      this.options.onPan?.(e)
      this.options.onZoom?.(e)
    }
    node.addEventListener("wheel", this._wheelHandler, { passive: false })
  }

  private createZoomControls(): void {
    // Create controls container
    this.controlsContainer = document.createElement('div')
    this.controlsContainer.className = 'svg-pan-zoom-controls'

    // Position the container
    const position = this.options.controlsPosition || 'top-left'
    this.controlsContainer.style.position = 'absolute'
    this.controlsContainer.style.zIndex = '100'

    switch (position) {
      case 'top-left':
        this.controlsContainer.style.top = '10px'
        this.controlsContainer.style.left = '10px'
        break
      case 'top-right':
        this.controlsContainer.style.top = '10px'
        this.controlsContainer.style.right = '10px'
        break
      case 'bottom-left':
        this.controlsContainer.style.bottom = '10px'
        this.controlsContainer.style.left = '10px'
        break
      case 'bottom-right':
        this.controlsContainer.style.bottom = '10px'
        this.controlsContainer.style.right = '10px'
        break
    }

    // Create zoom in button
    const zoomInBtn = document.createElement('button')
    zoomInBtn.textContent = '+'
    zoomInBtn.title = 'Zoom In'
    zoomInBtn.addEventListener('click', () => this.zoomIn())
    this.controlsContainer.appendChild(zoomInBtn)

    // Create zoom out button
    const zoomOutBtn = document.createElement('button')
    zoomOutBtn.textContent = '−'  // Using minus sign character
    zoomOutBtn.title = 'Zoom Out'
    zoomOutBtn.addEventListener('click', () => this.zoomOut())
    this.controlsContainer.appendChild(zoomOutBtn)

    // Create reset button
    const resetBtn = document.createElement('button')
    resetBtn.textContent = '⟲'  // Reset icon
    resetBtn.title = 'Reset View'
    resetBtn.addEventListener('click', () => this.reset())
    this.controlsContainer.appendChild(resetBtn)

    // Add to slate element
    this.slate.element.appendChild(this.controlsContainer)
  }

  private removeZoomControls(): void {
    if (this.controlsContainer && this.controlsContainer.parentNode) {
      this.controlsContainer.parentNode.removeChild(this.controlsContainer)
      this.controlsContainer = null
    }
  }

  public enable() {
    if (!this.isEnabled) {
      this.init()
    }
    this.options.enabled = true
  }

  public disable() {
    if (this.isEnabled) {
      this.canvas.panZoom(false)
      this.isEnabled = false
    }
    this.options.enabled = false
  }

  public enablePan() {
    this.options.panning = true
    if (this.isEnabled) {
      this.canvas.panZoom({ ...this.getAllOptions(), panning: true })
    }
  }

  public disablePan() {
    this.options.panning = false
    if (this.isEnabled) {
      this.canvas.panZoom({ ...this.getAllOptions(), panning: false })
    }
  }

  public enableZoom() {
    this.options.wheelZoom = true
    this.options.pinchZoom = true
    if (this.isEnabled) {
      this.canvas.panZoom({ ...this.getAllOptions(), wheelZoom: true, pinchZoom: true })
    }
  }

  public disableZoom() {
    this.options.wheelZoom = false
    this.options.pinchZoom = false
    if (this.isEnabled) {
      this.canvas.panZoom({ ...this.getAllOptions(), wheelZoom: false, pinchZoom: false })
    }
  }

  public pan(point: { x: number; y: number }) {
    if (this.isEnabled) {
      // Get current viewbox
      const vb = this.canvas.viewbox()
      // Pan by setting new viewbox position
      this.canvas.viewbox(point.x, point.y, vb.width, vb.height)
    }
  }

  public panBy(delta: { x: number; y: number }) {
    if (this.isEnabled) {
      const vb = this.canvas.viewbox()
      this.canvas.viewbox(vb.x + delta.x, vb.y + delta.y, vb.width, vb.height)
    }
  }

  public zoom(level: number, point?: { x: number; y: number }) {
    if (this.isEnabled) {
      if (point) {
        this.canvas.zoom(level, point)
      } else {
        this.canvas.zoom(level)
      }
    }
  }

  public zoomBy(factor: number) {
    if (this.isEnabled) {
      const currentZoom = this.getZoom()
      this.canvas.zoom(currentZoom * factor)
    }
  }

  /** Zoom in one step. */
  public zoomIn() {
    if (this.isEnabled) {
      const currentZoom = this.getZoom()
      this.canvas.zoom(currentZoom * 1.25)
    }
  }

  /** Zoom out one step. */
  public zoomOut() {
    if (this.isEnabled) {
      const currentZoom = this.getZoom()
      this.canvas.zoom(currentZoom * 0.8)
    }
  }

  public zoomAtPoint(level: number, point: { x: number; y: number }) {
    if (this.isEnabled) {
      this.canvas.zoom(level, point)
    }
  }

  public reset() {
    if (!this.isEnabled) return
    // Reset to 1:1 (viewBox = container px) centered on the current view
    // center — never a hardcoded origin box — then fit content if any.
    const px = this.getViewportSize()
    const vb = this.canvas.viewbox() || { x: 0, y: 0, width: px.w, height: px.h }
    const cx = (vb.x || 0) + (vb.width || px.w) / 2
    const cy = (vb.y || 0) + (vb.height || px.h) / 2
    this.canvas.viewbox(cx - px.w / 2, cy - px.h / 2, px.w, px.h)
    this.fit()
  }

  /** Container pixel size (the infinite canvas fills its element). */
  public getViewportSize(): { w: number; h: number } {
    const el = this.slate?.element
    const rect = el?.getBoundingClientRect?.()
    return {
      w: Math.max(1, Math.round(rect?.width || this.canvas.node.clientWidth || 800)),
      h: Math.max(1, Math.round(rect?.height || this.canvas.node.clientHeight || 600)),
    }
  }

  public resetZoom() {
    if (this.isEnabled) {
      this.canvas.zoom(1)
    }
  }

  public resetPan() {
    if (this.isEnabled) {
      const vb = this.canvas.viewbox()
      this.canvas.viewbox(0, 0, vb.width, vb.height)
    }
  }

  public fit() {
    // Fit all node content in view
    if (!this.isEnabled) return

    // Compute bounds from the slate's actual nodes, not SVG bbox (which includes markers/defs at origin)
    const nodes = this.slate?.nodes?.allNodes
    if (!nodes || nodes.length === 0) return

    let nodeMinX = Infinity, nodeMinY = Infinity, nodeMaxX = -Infinity, nodeMaxY = -Infinity
    for (const node of nodes) {
      const x = node.options.x ?? 0
      const y = node.options.y ?? 0
      const w = node.options.width ?? 100
      const h = node.options.height ?? 60
      nodeMinX = Math.min(nodeMinX, x)
      nodeMinY = Math.min(nodeMinY, y)
      nodeMaxX = Math.max(nodeMaxX, x + w)
      nodeMaxY = Math.max(nodeMaxY, y + h)
    }

    if (!isFinite(nodeMinX)) return

    const padding = 50
    const px = this.getViewportSize()
    const containerAspect = px.w / px.h
    // A board's chrome (its name and legend above it, workshops/boardChrome.ts) is part of the content. Its type grows as
    // the view zooms out, so the box is taken at the zoom the fit comes to: worked out again a few times until it settles.
    const chromes: { box(zoom: number): { x: number; y: number; width: number; height: number } | null }[] =
      this.slate?.boardChromes instanceof Set ? [...this.slate.boardChromes] : []
    let minX = nodeMinX, minY = nodeMinY, maxX = nodeMaxX, maxY = nodeMaxY
    let finalW = 0, finalH = 0, contentWidth = 0, contentHeight = 0
    let zoom = 1
    for (let pass = 0; pass < (chromes.length ? 4 : 1); pass++) {
      minX = nodeMinX; minY = nodeMinY; maxX = nodeMaxX; maxY = nodeMaxY
      for (const chrome of chromes) {
        let box: { x: number; y: number; width: number; height: number } | null = null
        try { box = chrome.box(zoom) } catch { box = null }
        if (!box || ![box.x, box.y, box.width, box.height].every(Number.isFinite)) continue
        minX = Math.min(minX, box.x)
        minY = Math.min(minY, box.y)
        maxX = Math.max(maxX, box.x + box.width)
        maxY = Math.max(maxY, box.y + box.height)
      }
      contentWidth = maxX - minX
      contentHeight = maxY - minY

      // Compute viewbox that centers content with padding
      const vbWidth = contentWidth + padding * 2
      const vbHeight = contentHeight + padding * 2
      const contentAspect = vbWidth / vbHeight

      finalW = vbWidth
      finalH = vbHeight
      if (contentAspect > containerAspect) {
        finalH = finalW / containerAspect
      } else {
        finalW = finalH * containerAspect
      }

      // Never zoom IN past 1:1 just to fill (Miro/v1 behavior): the viewBox is
      // at least the container's pixel size, so small content sits at 100%
      // centered rather than blown up to 400%+. Larger content still zooms out.
      if (finalW < px.w) {
        finalW = px.w
        finalH = px.h
      }
      const next = px.w / finalW
      if (Math.abs(next - zoom) < 0.005) break
      zoom = next
    }

    const cx = minX + contentWidth / 2
    const cy = minY + contentHeight / 2
    this.canvas.viewbox(
      cx - finalW / 2,
      cy - finalH / 2,
      finalW,
      finalH
    )
  }

  /**
   * Show a region of the world at the largest scale at which its whole width is
   * visible, up to `maxZoom` (100% unless the host allows more, as a phone does to
   * fill its width with one lane), with `padding` world units of room at each side.
   * A region shorter than the canvas is centred in it; a taller one starts at the
   * top and the rest is reached by panning.
   */
  public fitWidth(region: { x: number; y: number; width: number; height: number }, padding = 16, maxZoom = 1) {
    if (!this.isEnabled) return
    const px = this.getViewportSize()
    const limit = Math.min(maxZoom > 0 ? maxZoom : 1, this.options.zoomMax ?? 10)
    const width = Math.max(px.w / limit, region.width + padding * 2)
    const height = (px.h / px.w) * width
    const x = region.x + region.width / 2 - width / 2
    const y = region.height + padding * 2 <= height ? region.y + region.height / 2 - height / 2 : region.y - padding
    this.canvas.viewbox(x, y, width, height)
  }

  public center() {
    if (!this.isEnabled) return
    // Center on the NODES' bounding box, not canvas.bbox() — the latter
    // includes marker/def elements near origin and would pull the view off
    // the actual content.
    const nodes = this.slate?.nodes?.allNodes
    const vb = this.canvas.viewbox()
    if (!nodes || nodes.length === 0) return
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const node of nodes) {
      const x = node.options.x ?? 0
      const y = node.options.y ?? 0
      const w = node.options.width ?? 100
      const h = node.options.height ?? 60
      minX = Math.min(minX, x); minY = Math.min(minY, y)
      maxX = Math.max(maxX, x + w); maxY = Math.max(maxY, y + h)
    }
    if (!isFinite(minX)) return
    const cx = (minX + maxX) / 2
    const cy = (minY + maxY) / 2
    this.canvas.viewbox(cx - vb.width / 2, cy - vb.height / 2, vb.width, vb.height)
  }

  /** @returns Current zoom level (1 = 100%). */
  public getZoom(): number {
    if (!this.isEnabled) return 1
    try {
      // svg.panzoom.js stores zoom level on the canvas
      return (this.canvas as any).zoom() || 1
    } catch (e) {
      return 1
    }
  }

  /** @returns Current pan position as { x, y }. */
  public getPan(): { x: number; y: number } {
    if (!this.isEnabled) return { x: 0, y: 0 }
    try {
      const vb = this.canvas.viewbox()
      return { x: vb.x, y: vb.y }
    } catch (e) {
      return { x: 0, y: 0 }
    }
  }

  public resize() {
    // svg.panzoom.js handles this automatically
    // Just update the canvas size if needed
  }

  public destroy() {
    if (this._wheelHandler && this.canvas.node?.removeEventListener) {
      this.canvas.node.removeEventListener("wheel", this._wheelHandler)
      this._wheelHandler = null
    }
    this.detachTouchPan()
    if (this.isEnabled) {
      this.canvas.panZoom(false)

      // Remove event listeners
      this.canvas.off('panStart')
      this.canvas.off('panning')
      this.canvas.off('panEnd')
      this.canvas.off('zoom')

      // Remove zoom controls
      this.removeZoomControls()

      this.isEnabled = false
    }
  }

  /** @returns Whether pan/zoom is initialized and enabled. */
  public isInitialized(): boolean {
    return this.isEnabled
  }

  private getAllOptions() {
    return {
      panning: this.options.panning,
      pinchZoom: this.options.pinchZoom,
      wheelZoom: this.options.wheelZoom,
      panButton: this.options.panButton,
      oneFingerPan: this.options.oneFingerPan,
      margins: this.options.margins,
      zoomFactor: this.options.zoomFactor,
      zoomMin: this.options.zoomMin,
      zoomMax: this.options.zoomMax,
      wheelZoomDeltaModeLinePixels: this.options.wheelZoomDeltaModeLinePixels,
      wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels,
      momentum: this.options.momentum,
      momentumSlowdown: this.options.momentumSlowdown
    }
  }
}
