import { G, Rect, Text, Element as SVGElement, Circle, Ellipse } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'

export interface NodeOptions {
  id: string
  x?: number
  y?: number
  width?: number
  height?: number
  text?: string
  fontSize?: number
  fontFamily?: string
  fontColor?: string
  textOpacity?: number
  textXAlign?: 'left' | 'center' | 'right'
  textYAlign?: 'top' | 'middle' | 'bottom'
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  allowDrag?: boolean
  isLocked?: boolean
  shape?: 'rectangle' | 'circle' | 'ellipse'
  rotate?: {
    rotationAngle?: number
  }
  textOffset?: {
    x?: number
    y?: number
  }
}

export class Node {
  public id: string
  public options: NodeOptions
  public svgGroup!: G
  public backgroundRect!: Rect | Circle | Ellipse
  public textElement!: Text
  private slate: any // Will be properly typed when Slate is available

  constructor(options: NodeOptions, slate: any) {
    this.id = options.id || this.generateId()
    this.slate = slate
    
    // Default options
    this.options = {
      x: 50,
      y: 50,
      width: 100,
      height: 60,
      text: 'Node',
      fontSize: 14,
      fontFamily: 'Arial, sans-serif',
      fontColor: '#000000',
      textOpacity: 1,
      textXAlign: 'center',
      textYAlign: 'middle',
      backgroundColor: '#f0f0f0',
      borderColor: '#cccccc',
      borderWidth: 1,
      allowDrag: true,
      isLocked: false,
      shape: 'rectangle',
      rotate: {
        rotationAngle: 0
      },
      textOffset: {
        x: 0,
        y: 0
      },
      ...options
    }

    this.create()
  }

  private generateId(): string {
    return 'node_' + Math.random().toString(36).substr(2, 9)
  }

  private create() {
    // Create SVG group to contain all node elements
    this.svgGroup = this.slate.canvas.group()
    
    // Create the background shape
    this.createBackground()
    
    // Create the text element
    this.createText()
    
    // Position the node
    this.position(this.options.x!, this.options.y!)
    
    // Make draggable if allowed
    if (this.options.allowDrag && !this.options.isLocked) {
      this.makeDraggable()
    }
  }

  private createBackground() {
    const { width, height, backgroundColor, borderColor, borderWidth, shape } = this.options

    switch (shape) {
      case 'circle':
        const radius = Math.min(width!, height!) / 2
        this.backgroundRect = this.svgGroup.circle(radius * 2)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
        break
      case 'ellipse':
        this.backgroundRect = this.svgGroup.ellipse(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
        break
      default: // rectangle
        this.backgroundRect = this.svgGroup.rect(width!, height!)
          .fill(backgroundColor!)
          .stroke({ color: borderColor!, width: borderWidth! })
          .radius(4) // Slight border radius for better appearance
        break
    }
  }

  private createText() {
    const { text, fontSize, fontFamily, fontColor, textOpacity } = this.options
    
    this.textElement = this.svgGroup.text(text!)
      .font({
        family: fontFamily!,
        size: fontSize!,
        fill: fontColor!,
        opacity: textOpacity!
      })
    
    this.centerText()
  }

  private centerText() {
    const { width, height, textXAlign, textYAlign, textOffset } = this.options
    const bbox = this.textElement.bbox()
    
    let x = textOffset!.x || 0
    let y = textOffset!.y || 0
    
    // Horizontal alignment
    switch (textXAlign) {
      case 'left':
        x += 5
        break
      case 'right':
        x += width! - bbox.width - 5
        break
      default: // center
        x += (width! - bbox.width) / 2
        break
    }
    
    // Vertical alignment
    switch (textYAlign) {
      case 'top':
        y += 5
        break
      case 'bottom':
        y += height! - bbox.height - 5
        break
      default: // middle
        y += (height! - bbox.height) / 2
        break
    }
    
    this.textElement.move(x, y)
  }

  private makeDraggable() {
    // Use svg.draggable.js to make the group draggable
    (this.svgGroup as any).draggable()
    
    // Add event listeners for drag events
    this.svgGroup.on('dragstart', (event: any) => {
      // Bring to front during drag
      this.toFront()
    })
    
    this.svgGroup.on('dragend', (event: any) => {
      // Update position options
      const bbox = this.svgGroup.bbox()
      this.options.x = bbox.x
      this.options.y = bbox.y
    })
  }

  public position(x: number, y: number, callback?: () => void, easing?: any, duration?: number) {
    this.options.x = x
    this.options.y = y
    
    if (duration && duration > 0) {
      // Animate to position
      this.svgGroup.animate(duration, easing || '-')
        .move(x, y)
        .after(callback || (() => {}))
    } else {
      // Move immediately
      this.svgGroup.move(x, y)
      if (callback) callback()
    }
  }

  public toFront() {
    this.svgGroup.front()
  }

  public toBack() {
    this.svgGroup.back()
  }

  public remove() {
    this.svgGroup.remove()
  }

  public hide() {
    this.svgGroup.hide()
  }

  public show() {
    this.svgGroup.show()
  }

  public setText(text: string) {
    this.options.text = text
    this.textElement.text(text)
    this.centerText()
  }

  public setSize(width: number, height: number) {
    this.options.width = width
    this.options.height = height
    
    // Update background - need to check type for proper method
    if (this.backgroundRect instanceof Rect) {
      this.backgroundRect.size(width, height)
    } else if (this.backgroundRect instanceof Circle) {
      const radius = Math.min(width, height) / 2
      this.backgroundRect.radius(radius)
    } else if (this.backgroundRect instanceof Ellipse) {
      this.backgroundRect.size(width, height)
    }
    
    // Re-center text
    this.centerText()
  }

  public setColors(backgroundColor?: string, borderColor?: string) {
    if (backgroundColor) {
      this.options.backgroundColor = backgroundColor
      this.backgroundRect.fill(backgroundColor)
    }
    
    if (borderColor) {
      this.options.borderColor = borderColor
      this.backgroundRect.stroke({ color: borderColor })
    }
  }

  public lock() {
    this.options.isLocked = true
    this.options.allowDrag = false
    if ((this.svgGroup as any).draggable) {
      (this.svgGroup as any).draggable(false)
    }
  }

  public unlock() {
    this.options.isLocked = false
    this.options.allowDrag = true
    this.makeDraggable()
  }
}