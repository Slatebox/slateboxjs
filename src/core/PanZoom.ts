import svgPanZoom from 'svg-pan-zoom'

export interface PanZoomOptions {
  enabled?: boolean
  panEnabled?: boolean
  zoomEnabled?: boolean
  controlIconsEnabled?: boolean
  dblClickZoomEnabled?: boolean
  mouseWheelZoomEnabled?: boolean
  zoomScaleSensitivity?: number
  minZoom?: number
  maxZoom?: number
  fit?: boolean
  center?: boolean
  onPan?: (event: any) => void
  onZoom?: (event: any) => void
}

export class PanZoom {
  private panZoomInstance: any
  private slate: any
  private options: PanZoomOptions

  constructor(slate: any, options: PanZoomOptions = {}) {
    this.slate = slate
    this.options = {
      enabled: true,
      panEnabled: true,
      zoomEnabled: true,
      controlIconsEnabled: true,
      dblClickZoomEnabled: true,
      mouseWheelZoomEnabled: true,
      zoomScaleSensitivity: 0.2,
      minZoom: 0.1,
      maxZoom: 10,
      fit: false,
      center: false,
      ...options
    }

    if (this.options.enabled) {
      this.init()
    }
  }

  private init() {
    // Wait for DOM to be ready
    setTimeout(() => {
      try {
        this.panZoomInstance = svgPanZoom(this.slate.canvas.node, {
          panEnabled: this.options.panEnabled,
          zoomEnabled: this.options.zoomEnabled,
          controlIconsEnabled: this.options.controlIconsEnabled,
          dblClickZoomEnabled: this.options.dblClickZoomEnabled,
          mouseWheelZoomEnabled: this.options.mouseWheelZoomEnabled,
          zoomScaleSensitivity: this.options.zoomScaleSensitivity,
          minZoom: this.options.minZoom,
          maxZoom: this.options.maxZoom,
          fit: this.options.fit,
          center: this.options.center,
          onPan: (pan: any) => {
            if (this.options.onPan) {
              this.options.onPan(pan)
            }
          },
          onZoom: (zoom: any) => {
            if (this.options.onZoom) {
              this.options.onZoom(zoom)
            }
          }
        })
      } catch (error) {
        console.warn('Failed to initialize pan/zoom:', error)
      }
    }, 100)
  }

  public enable() {
    if (this.panZoomInstance) {
      this.panZoomInstance.enablePan()
      this.panZoomInstance.enableZoom()
    }
    this.options.enabled = true
  }

  public disable() {
    if (this.panZoomInstance) {
      this.panZoomInstance.disablePan()
      this.panZoomInstance.disableZoom()
    }
    this.options.enabled = false
  }

  public enablePan() {
    if (this.panZoomInstance) {
      this.panZoomInstance.enablePan()
    }
    this.options.panEnabled = true
  }

  public disablePan() {
    if (this.panZoomInstance) {
      this.panZoomInstance.disablePan()
    }
    this.options.panEnabled = false
  }

  public enableZoom() {
    if (this.panZoomInstance) {
      this.panZoomInstance.enableZoom()
    }
    this.options.zoomEnabled = true
  }

  public disableZoom() {
    if (this.panZoomInstance) {
      this.panZoomInstance.disableZoom()
    }
    this.options.zoomEnabled = false
  }

  public pan(point: { x: number; y: number }) {
    if (this.panZoomInstance) {
      this.panZoomInstance.pan(point)
    }
  }

  public panBy(delta: { x: number; y: number }) {
    if (this.panZoomInstance) {
      this.panZoomInstance.panBy(delta)
    }
  }

  public zoom(level: number) {
    if (this.panZoomInstance) {
      this.panZoomInstance.zoom(level)
    }
  }

  public zoomBy(factor: number) {
    if (this.panZoomInstance) {
      this.panZoomInstance.zoomBy(factor)
    }
  }

  public zoomIn() {
    if (this.panZoomInstance) {
      this.panZoomInstance.zoomIn()
    }
  }

  public zoomOut() {
    if (this.panZoomInstance) {
      this.panZoomInstance.zoomOut()
    }
  }

  public zoomAtPoint(level: number, point: { x: number; y: number }) {
    if (this.panZoomInstance) {
      this.panZoomInstance.zoomAtPoint(level, point)
    }
  }

  public reset() {
    if (this.panZoomInstance) {
      this.panZoomInstance.reset()
    }
  }

  public resetZoom() {
    if (this.panZoomInstance) {
      this.panZoomInstance.resetZoom()
    }
  }

  public resetPan() {
    if (this.panZoomInstance) {
      this.panZoomInstance.resetPan()
    }
  }

  public fit() {
    if (this.panZoomInstance) {
      this.panZoomInstance.fit()
    }
  }

  public center() {
    if (this.panZoomInstance) {
      this.panZoomInstance.center()
    }
  }

  public getZoom(): number {
    return this.panZoomInstance ? this.panZoomInstance.getZoom() : 1
  }

  public getPan(): { x: number; y: number } {
    return this.panZoomInstance ? this.panZoomInstance.getPan() : { x: 0, y: 0 }
  }

  public resize() {
    if (this.panZoomInstance) {
      this.panZoomInstance.resize()
    }
  }

  public destroy() {
    if (this.panZoomInstance) {
      this.panZoomInstance.destroy()
      this.panZoomInstance = null
    }
  }
}