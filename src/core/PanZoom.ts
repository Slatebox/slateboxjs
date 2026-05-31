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
      panButton: 0,
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
      // svg.panzoom.js extends the svg.js canvas element
      this.canvas.panZoom({
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
      })

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
    if (this.isEnabled) {
      this.canvas.zoom(1)
      this.canvas.viewbox(0, 0, this.canvas.width(), this.canvas.height())
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

    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const node of nodes) {
      const x = node.options.x ?? 0
      const y = node.options.y ?? 0
      const w = node.options.width ?? 100
      const h = node.options.height ?? 60
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x + w)
      maxY = Math.max(maxY, y + h)
    }

    if (!isFinite(minX)) return

    const contentWidth = maxX - minX
    const contentHeight = maxY - minY
    const padding = 50

    // Compute viewbox that centers content with padding
    const vbWidth = contentWidth + padding * 2
    const vbHeight = contentHeight + padding * 2
    const containerW = this.canvas.node.clientWidth || this.canvas.width()
    const containerH = this.canvas.node.clientHeight || this.canvas.height()
    const containerAspect = containerW / containerH
    const contentAspect = vbWidth / vbHeight

    let finalW = vbWidth, finalH = vbHeight
    if (contentAspect > containerAspect) {
      finalH = finalW / containerAspect
    } else {
      finalW = finalH * containerAspect
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

  public center() {
    if (this.isEnabled) {
      const bbox = this.canvas.bbox()
      const vb = this.canvas.viewbox()
      const centerX = bbox.cx - vb.width / 2
      const centerY = bbox.cy - vb.height / 2
      this.canvas.viewbox(centerX, centerY, vb.width, vb.height)
    }
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
