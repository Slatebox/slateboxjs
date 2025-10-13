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

  constructor(slate: any, options: PanZoomOptions = {}) {
    this.slate = slate
    this.canvas = slate.canvas
    this.options = {
      enabled: true,
      panning: true,
      pinchZoom: true,
      wheelZoom: true,
      panButton: 0,
      oneFingerPan: false,
      margins: false,
      zoomFactor: 0.3,
      zoomMin: 0.1,
      zoomMax: 10,
      wheelZoomDeltaModeLinePixels: 17,
      wheelZoomDeltaModeScreenPixels: 53,
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
        wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels
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

      console.log('PanZoom initialized successfully with svg.panzoom.js')
    } catch (error) {
      console.warn('Failed to initialize pan/zoom:', error)
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

  public zoomIn() {
    if (this.isEnabled) {
      const currentZoom = this.getZoom()
      this.canvas.zoom(currentZoom * 1.25)
    }
  }

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
    // Fit all content in view
    if (this.isEnabled) {
      const bbox = this.canvas.bbox()
      const padding = 50
      const scale = Math.min(
        (this.canvas.width() - padding * 2) / bbox.width,
        (this.canvas.height() - padding * 2) / bbox.height
      )
      this.canvas.zoom(scale)
      this.canvas.viewbox(
        bbox.x - padding / scale,
        bbox.y - padding / scale,
        (this.canvas.width()) / scale,
        (this.canvas.height()) / scale
      )
    }
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

  public getZoom(): number {
    if (!this.isEnabled) return 1
    try {
      // svg.panzoom.js stores zoom level on the canvas
      return (this.canvas as any).zoom() || 1
    } catch (e) {
      return 1
    }
  }

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

      this.isEnabled = false
    }
  }

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
      wheelZoomDeltaModeScreenPixels: this.options.wheelZoomDeltaModeScreenPixels
    }
  }
}
