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
export type { HostStep, HostStepOutcome, UndoRedoState, UndoRedoOutcome, UndoRedoListener } from './core/UndoRedo'
import { MultiSelection } from './core/MultiSelection'
import { Grid } from './core/Grid'
import { Menu } from './core/Menu'
import { Keyboard } from './core/Keyboard'
import { ContextMenu } from './core/ContextMenu'
import { Filters, registerFilter, getFilterNames } from './core/Filters'
import { Links } from './core/Links'
import { MediaNote } from './core/MediaNote'
import { MediaInput } from './core/MediaInput'

// Export (function-based module)
import * as ExportModule from './core/Export'

// Collaboration
import { Collab } from './core/Collab'

// App Integration (function-based modules)
import * as Layout from './core/Layout'
import { ZoomSlider } from './core/ZoomSlider'
import * as Comments from './core/Comments'
import { Presentation } from './core/Presentation'
import * as SlateOperations from './core/SlateOperations'

// Utilities
import * as utils from './utils'

// v1 runtime API facade (`Slatebox.slate/node/base/utils`)
import { Slatebox } from './compat-facade'

// Every part of a slate present from the start (the canvas entry, src/canvas.ts, loads some when first used).
import './core/mainParts'

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
  ContextMenu,
  Filters,
  registerFilter,
  getFilterNames,
  Links,
  MediaNote,
  MediaInput,
  // Export
  ExportModule,
  // Collaboration
  Collab,
  // App Integration
  Layout,
  ZoomSlider,
  Comments,
  Presentation,
  SlateOperations,
  // Utilities
  utils,
  // v1 runtime API facade
  Slatebox,
}

// Host drag policies (governed notes)
export { FREE_NODE, GOVERNED_NODE, hitTestNodeBoxes } from './core/DragPolicy'
export { DEFAULT_NOTE_STYLE } from './core/NoteDefaults'
// Media notes: which video addresses play, and the player address (no DOM, also in slateboxjs/operations).
export { parseMediaUrl, isMediaUrl, mediaEmbedUrl, mediaLabel, MEDIA_PROVIDERS, MEDIA_FRAME_ORIGINS, MEDIA_NOTE_SIZE } from './operations/media'
export type { MediaValue, MediaProvider } from './operations/media'
// Photo notes: a picture the host stored, drawn as the whole note (no DOM, also in slateboxjs/operations).
export { PHOTO_LIMITS, readPhotoValue, photoNoteSize, readPhoto } from './operations/photo'
export type { PhotoValue } from './operations/photo'
export type { MediaRequest } from './core/MediaInput'
// Agents on the canvas: what they say and when they show. The drawing (createAgentPresence) is
// the slateboxjs/presence entry, loaded when the first agent arrives.
export { AGENT_PALETTE, AGENT_SAY_MS, agentStepText, agentChecklist, agentName, agentOrigin, agentSaying, safeIconUrl, visibleAgents, type AgentPresenceRecord, type AgentStepStatus } from './core/agentPresenceText'
export type {
  DragPolicy,
  DragVerdict,
  DragGesture,
  DragCancelReason,
  NodeCapabilities,
  NodeGovernance,
  WorldPoint,
} from './core/DragPolicy'

// Re-export types for convenience
export type { SlateJSON, NodeJSON } from './core/Serialization'
export type { ShapeDefinition } from './core/ShapeRegistry'
export type { Association } from './core/Relationship'
export type { CollabOptions, CollabUser, CollabPackage, RefreshWebsocketParams, RelayRefreshReason } from './core/Collab'
export type { RelayRole, RoomTokenClaims } from './core/RoomToken'
export type { SlatePackage } from './core/SlatePackage'
export type { ExportOptions } from './core/Export'
export type { LayoutMove } from './core/Layout'
export type { CommentOptions } from './core/Comments'
export type { PresentationStep } from './core/Presentation'
// Eased camera flights (Prezi arcs, roll, cuts) and the maths behind them.
export { Camera, cameraFor, cameraBetween, viewboxFor, flightDuration } from './core/Camera'
export type { CameraState, CameraBox, CameraTarget, CameraViewport, CameraArc, FlyOptions } from './core/Camera'
export type { FilterDef } from './core/Filters'
export type {
  NodeSelector as SlateNodeSelector,
  SlateOperation,
  SlateOperationKind,
  SlateOperationPlan,
  SlateOperationReport,
  SlateOperationValidation,
} from './operations'

/**
 * SlateboxJS — Modern diagramming library built with SVG.js.
 *
 * Create interactive diagrams with draggable nodes, pan/zoom,
 * resize/rotate, connections, and more.
 *
 * @example
 * ```ts
 * import SlateboxJS from 'slateboxjs'
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
  ;(window as any).ContextMenu = ContextMenu
  ;(window as any).Filters = Filters
  ;(window as any).Links = Links
  ;(window as any).MediaNote = MediaNote
  ;(window as any).MediaInput = MediaInput
  ;(window as any).Export = ExportModule
  ;(window as any).Collab = Collab
  ;(window as any).Layout = Layout
  ;(window as any).ZoomSlider = ZoomSlider
  ;(window as any).Comments = Comments
  ;(window as any).Presentation = Presentation
  ;(window as any).Slatebox = Object.assign({}, Slatebox, { compat })
}

// Default export
export default SlateboxJS
