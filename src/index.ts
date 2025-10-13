import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.resize.js'
import 'svg.connectable.js'
import './styles/slateboxjs.css'
import { Slate } from './core/Slate'
import { Node } from './core/Node'
import { Invoker } from './core/Invoker'
import { PanZoom } from './core/PanZoom'
import { ResizeRotate } from './core/ResizeRotate'

// Export the main classes and utilities
export { Slate, Node, Invoker, PanZoom, ResizeRotate }

// Main SlateboxJS factory function
export function SlateboxJS(element: string | HTMLElement, options: any = {}) {
  return new Slate(element, options)
}

// Attach to window for global usage
if (typeof window !== 'undefined') {
  (window as any).SlateboxJS = SlateboxJS
  ;(window as any).Slate = Slate
  ;(window as any).Node = Node
  ;(window as any).PanZoom = PanZoom
  ;(window as any).ResizeRotate = ResizeRotate
}

// Default export
export default SlateboxJS