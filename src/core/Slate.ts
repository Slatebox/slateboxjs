import { SVG, Svg } from '@svgdotjs/svg.js'
import { Node } from './Node'
import { NodesManager } from './NodesManager'
import { Invoker } from './Invoker'

export interface SlateOptions {
  name?: string
  description?: string
  followMe?: boolean
  mindMapMode?: boolean
  autoResizeNodesBasedOnText?: boolean
  viewPort?: {
    originalWidth?: number
    originalHeight?: number
    showGrid?: boolean
    snapToObjects?: boolean
  }
  containerStyle?: {
    backgroundColor?: string
    backgroundColorAsGradient?: boolean
    backgroundGradientType?: string
    backgroundGradientColors?: string[]
    backgroundGradientStrategy?: string
    backgroundImage?: string
    backgroundSize?: string
    backgroundEffect?: string
    prevBackgroundColor?: string
  }
  defaultLineColor?: string
  themeId?: string
  layoutType?: string
  disableAutoLayoutOfManuallyPositionedNodes?: boolean
  huddleType?: string
  huddleEnabled?: boolean
  tags?: string[]
  templateMarkdown?: string
  templatePrompt?: string
  isTemplate?: boolean
  ai?: any
}

export class Slate {
  public element: HTMLElement
  public canvas!: Svg
  public nodes!: NodesManager
  public invoker!: Invoker
  public options: SlateOptions

  constructor(element: string | HTMLElement, options: SlateOptions = {}) {
    // Get or create the target element
    if (typeof element === 'string') {
      const found = document.querySelector(element) as HTMLElement
      if (!found) {
        throw new Error(`Element with selector "${element}" not found`)
      }
      this.element = found
    } else {
      this.element = element
    }

    // Default options
    this.options = {
      name: 'Untitled Slate',
      description: '',
      followMe: true,
      mindMapMode: false,
      autoResizeNodesBasedOnText: true,
      viewPort: {
        originalWidth: 800,
        originalHeight: 600,
        showGrid: false,
        snapToObjects: false
      },
      containerStyle: {
        backgroundColor: '#ffffff',
        backgroundColorAsGradient: false,
        backgroundGradientType: 'linear',
        backgroundGradientColors: [],
        backgroundGradientStrategy: 'horizontal',
        backgroundImage: undefined,
        backgroundSize: 'contain',
        backgroundEffect: undefined,
        prevBackgroundColor: '#ffffff'
      },
      defaultLineColor: '#000000',
      themeId: undefined,
      layoutType: 'manual',
      disableAutoLayoutOfManuallyPositionedNodes: false,
      huddleType: 'none',
      huddleEnabled: false,
      tags: [],
      templateMarkdown: '',
      templatePrompt: '',
      isTemplate: false,
      ai: {},
      ...options
    }

    this.init()
  }

  private init() {
    // Initialize SVG canvas
    this.canvas = SVG().addTo(this.element)
    
    // Set initial size
    const width = this.options.viewPort?.originalWidth || 800
    const height = this.options.viewPort?.originalHeight || 600
    this.canvas.size(width, height)

    // Apply background color
    this.canvas.rect(width, height)
      .fill(this.options.containerStyle?.backgroundColor || '#ffffff')
      .move(0, 0)
      .back()

    // Initialize nodes manager
    this.nodes = new NodesManager(this)

    // Initialize invoker with the contract methods
    this.invoker = new Invoker(this)

    // Make canvas responsive
    this.makeResponsive()
  }

  private makeResponsive() {
    // Add viewbox for responsive behavior
    const width = this.options.viewPort?.originalWidth || 800
    const height = this.options.viewPort?.originalHeight || 600
    this.canvas.viewbox(0, 0, width, height)
  }

  public addNode(options: any = {}) {
    return this.nodes.add(options)
  }

  public removeNode(id: string) {
    return this.nodes.remove(id)
  }

  public getNode(id: string) {
    return this.nodes.one(id)
  }

  public getAllNodes() {
    return this.nodes.allNodes
  }
}