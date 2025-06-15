import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.resize.js'

export interface ResizeRotateOptions {
  resizeEnabled?: boolean
  rotateEnabled?: boolean
  preserveAspectRatio?: boolean
  aroundCenter?: boolean
  grid?: number
  degree?: number
  onResize?: (event: any) => void
  onRotate?: (event: any) => void
}

export class ResizeRotate {
  private node: any
  private options: ResizeRotateOptions
  private isActive: boolean = false

  constructor(node: any, options: ResizeRotateOptions = {}) {
    this.node = node
    this.options = {
      resizeEnabled: true,
      rotateEnabled: true,
      preserveAspectRatio: false,
      aroundCenter: false,
      grid: 0,
      degree: 0,
      ...options
    }
  }

  public enable() {
    if (this.isActive) return

    try {
      // Use svg.select.js to make the node selectable
      (this.node.svgGroup as any).selectize({
        // points: this.options.rotateEnabled ? ['tl', 'tr', 'bl', 'br', 'lt', 'rt', 'lb', 'rb', 'r'] : ['tl', 'tr', 'bl', 'br'],
        // rotationPoint: this.options.rotateEnabled,
        // classRect: 'select-border',
        // classPoints: 'select-point',
        // classLine: 'select-line',
        // classRotationPoint: 'select-rotation-point'
      })

      // Add resize functionality if enabled
      if (this.options.resizeEnabled) {
        (this.node.svgGroup as any).resize({
          preserveAspectRatio: this.options.preserveAspectRatio,
          aroundCenter: this.options.aroundCenter,
          grid: this.options.grid,
          degree: this.options.degree
        })
      }

      // Add event listeners
      this.addEventListeners()
      
      this.isActive = true
    } catch (error) {
      console.warn('Failed to enable resize/rotate:', error)
    }
  }

  public disable() {
    if (!this.isActive) return

    try {
      // Remove selectize
      if ((this.node.svgGroup as any).selectize) {
        (this.node.svgGroup as any).selectize(false)
      }

      // Remove resize
      if ((this.node.svgGroup as any).resize) {
        (this.node.svgGroup as any).resize(false)
      }

      this.removeEventListeners()
      this.isActive = false
    } catch (error) {
      console.warn('Failed to disable resize/rotate:', error)
    }
  }

  private addEventListeners() {
    // Listen for resize events
    this.node.svgGroup.on('resize', (event: any) => {
      this.handleResize(event)
      if (this.options.onResize) {
        this.options.onResize(event)
      }
    })

    // Listen for rotation events (handled through resize plugin)
    this.node.svgGroup.on('rotate', (event: any) => {
      this.handleRotate(event)
      if (this.options.onRotate) {
        this.options.onRotate(event)
      }
    })
  }

  private removeEventListeners() {
    this.node.svgGroup.off('resize')
    this.node.svgGroup.off('rotate')
  }

  private handleResize(event: any) {
    if (event.detail && event.detail.box) {
      const box = event.detail.box
      
      // Update node options with new dimensions
      this.node.options.width = box.width
      this.node.options.height = box.height
      this.node.options.x = box.x
      this.node.options.y = box.y

      // Update the background shape
      this.updateBackground()
      
      // Re-center text
      this.node.centerText()
    }
  }

  private handleRotate(event: any) {
    if (event.detail && event.detail.angle !== undefined) {
      // Update rotation angle
      this.node.options.rotate.rotationAngle = event.detail.angle
    }
  }

  private updateBackground() {
    const { width, height, shape, backgroundColor, borderColor, borderWidth } = this.node.options

    // Remove old background
    this.node.backgroundRect.remove()

    // Create new background with updated dimensions
    switch (shape) {
      case 'circle':
        const radius = Math.min(width!, height!) / 2
        this.node.backgroundRect = this.node.svgGroup.circle(radius * 2)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
        break
      case 'ellipse':
        this.node.backgroundRect = this.node.svgGroup.ellipse(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
        break
      default: // rectangle
        this.node.backgroundRect = this.node.svgGroup.rect(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
          .radius(4)
        break
    }

    // Move background to back
    this.node.backgroundRect.back()
  }

  public isEnabled(): boolean {
    return this.isActive
  }

  public updateOptions(options: Partial<ResizeRotateOptions>) {
    this.options = { ...this.options, ...options }
    
    if (this.isActive) {
      // Reapply with new options
      this.disable()
      this.enable()
    }
  }
}