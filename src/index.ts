import { SVG } from '@svgdotjs/svg.js'
import '@svgdotjs/svg.draggable.js'
import '@svgdotjs/svg.panzoom.js'
import '@svgdotjs/svg.select.js'
import '@svgdotjs/svg.select.js/src/svg.select.css'
import '@svgdotjs/svg.resize.js'
import './vendor/svg-connectable/svg.connectable.js'
import './styles/slateboxjs.css'

// Core classes
import { Slate } from './core/Slate'
import { Node } from './core/Node'
import { Invoker } from './core/Invoker'
import { PanZoom } from './core/PanZoom'
import { ResizeRotate } from './core/ResizeRotate'
import { BirdsEye } from './core/BirdsEye'
import { Connector } from './core/Connector'
import { NodesManager } from './core/NodesManager'

// Data & Serialization (function-based modules)
import * as Serialization from './core/Serialization'
import * as ShapeRegistry from './core/ShapeRegistry'
import * as Relationship from './core/Relationship'
import { Relationships } from './core/Relationships'

// Compatibility layer
import * as compat from './core/compat'

// Content & Text
import * as FontLoader from './core/FontLoader'
import { Images } from './core/Images'
import { Editor } from './core/Editor'

// UI Features
import { UndoRedo } from './core/UndoRedo'
import { MultiSelection } from './core/MultiSelection'
import { Grid } from './core/Grid'
import { Menu } from './core/Menu'
import { Keyboard } from './core/Keyboard'
import { Filters, registerFilter, getFilterNames } from './core/Filters'
import { Links } from './core/Links'

// Export (function-based module)
import * as ExportModule from './core/Export'

// Collaboration
import { Collab } from './core/Collab'

// App Integration (function-based modules)
import * as Theme from './core/Theme'
import * as Layout from './core/Layout'
import { ZoomSlider } from './core/ZoomSlider'
import * as Comments from './core/Comments'
import { Presentation } from './core/Presentation'

// Utilities
import * as utils from './utils'

// v1 runtime API facade (`Slatebox.slate/node/base/utils`)
import { Slatebox } from './compat-facade'

// Export all classes and utilities
export {
  // Core
  Slate,
  Node,
  Invoker,
  PanZoom,
  ResizeRotate,
  BirdsEye,
  Connector,
  NodesManager,
  // Data & Serialization
  Serialization,
  ShapeRegistry,
  Relationship,
  Relationships,
  // Compatibility
  compat,
  // Content & Text
  FontLoader,
  Images,
  Editor,
  // UI Features
  UndoRedo,
  MultiSelection,
  Grid,
  Menu,
  Keyboard,
  Filters,
  registerFilter,
  getFilterNames,
  Links,
  // Export
  ExportModule,
  // Collaboration
  Collab,
  // App Integration
  Theme,
  Layout,
  ZoomSlider,
  Comments,
  Presentation,
  // Utilities
  utils,
  // v1 runtime API facade
  Slatebox,
}

// Re-export types for convenience
export type { SlateJSON, NodeJSON } from './core/Serialization'
export type { ShapeDefinition } from './core/ShapeRegistry'
export type { Association } from './core/Relationship'
export type { CollabOptions, CollabUser, CollabPackage } from './core/Collab'
export type { SlatePackage } from './core/SlatePackage'
export type { ExportOptions } from './core/Export'
export type { ThemeStyle, ThemeDefinition } from './core/Theme'
export type { LayoutMove } from './core/Layout'
export type { CommentOptions } from './core/Comments'
export type { PresentationStep } from './core/Presentation'
export type { FilterDef } from './core/Filters'

/**
 * SlateboxJS — Modern diagramming library built with SVG.js.
 *
 * Create interactive diagrams with draggable nodes, pan/zoom,
 * resize/rotate, connections, and more.
 *
 * @example
 * ```ts
 * import SlateboxJS from 'slateboxjs-v2'
 *
 * const slate = SlateboxJS('#container', {
 *   viewPort: { originalWidth: 800, originalHeight: 600 },
 *   panZoom: { enabled: true }
 * })
 *
 * slate.addNode({
 *   id: 'node1', x: 100, y: 100,
 *   width: 120, height: 80, text: 'Hello',
 *   backgroundColor: '#4ecdc4'
 * })
 * ```
 *
 * @param element - CSS selector string or HTMLElement to mount the canvas on
 * @param options - Configuration options for the slate
 * @returns A new Slate instance
 */
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
  ;(window as any).BirdsEye = BirdsEye
  ;(window as any).Connector = Connector
  ;(window as any).Serialization = Serialization
  ;(window as any).ShapeRegistry = ShapeRegistry
  ;(window as any).Relationship = Relationship
  ;(window as any).Relationships = Relationships
  ;(window as any).FontLoader = FontLoader
  ;(window as any).Images = Images
  ;(window as any).Editor = Editor
  ;(window as any).UndoRedo = UndoRedo
  ;(window as any).MultiSelection = MultiSelection
  ;(window as any).Grid = Grid
  ;(window as any).Menu = Menu
  ;(window as any).Keyboard = Keyboard
  ;(window as any).Filters = Filters
  ;(window as any).Links = Links
  ;(window as any).Export = ExportModule
  ;(window as any).Collab = Collab
  ;(window as any).Theme = Theme
  ;(window as any).Layout = Layout
  ;(window as any).ZoomSlider = ZoomSlider
  ;(window as any).Comments = Comments
  ;(window as any).Presentation = Presentation
  ;(window as any).Slatebox = Object.assign({}, Slatebox, { compat })
}

// Default export
export default SlateboxJS
