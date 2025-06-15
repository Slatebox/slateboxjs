import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import { Slate } from './core/Slate'
import { Node } from './core/Node'
import { Invoker } from './core/Invoker'

// Export the main classes and utilities
export { Slate, Node, Invoker }

// Main SlateboxJS factory function
export function SlateboxJS(element: string | HTMLElement, options: any = {}) {
  return new Slate(element, options)
}

// Attach to window for global usage
if (typeof window !== 'undefined') {
  (window as any).SlateboxJS = SlateboxJS
  ;(window as any).Slate = Slate
  ;(window as any).Node = Node
}

// Default export
export default SlateboxJS