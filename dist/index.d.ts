import { Slate } from './core/Slate';
import { Node } from './core/Node';
import { Invoker } from './core/Invoker';
import { PanZoom } from './core/PanZoom';
import { ResizeRotate } from './core/ResizeRotate';
import { BirdsEye } from './core/BirdsEye';
import { Connector } from './core/Connector';
import { NodesManager } from './core/NodesManager';
import * as Serialization from './core/Serialization';
import * as ShapeRegistry from './core/ShapeRegistry';
import * as Relationship from './core/Relationship';
import { Relationships } from './core/Relationships';
import * as compat from './core/compat';
import * as FontLoader from './core/FontLoader';
import { Images } from './core/Images';
import { Editor } from './core/Editor';
import { UndoRedo } from './core/UndoRedo';
import { MultiSelection } from './core/MultiSelection';
import { Grid } from './core/Grid';
import { Menu } from './core/Menu';
import { Keyboard } from './core/Keyboard';
import { ContextMenu } from './core/ContextMenu';
import { Filters, registerFilter, getFilterNames } from './core/Filters';
import { Links } from './core/Links';
import * as ExportModule from './core/Export';
import { Collab } from './core/Collab';
import * as Theme from './core/Theme';
import * as Layout from './core/Layout';
import { ZoomSlider } from './core/ZoomSlider';
import * as Comments from './core/Comments';
import { Presentation } from './core/Presentation';
import * as SlateOperations from './core/SlateOperations';
import * as utils from './utils';
import { Slatebox } from './compat-facade';
export { Slate, Node, Invoker, PanZoom, ResizeRotate, BirdsEye, Connector, NodesManager, Serialization, ShapeRegistry, Relationship, Relationships, compat, FontLoader, Images, Editor, UndoRedo, MultiSelection, Grid, Menu, Keyboard, ContextMenu, Filters, registerFilter, getFilterNames, Links, ExportModule, Collab, Theme, Layout, ZoomSlider, Comments, Presentation, SlateOperations, utils, Slatebox, };
export { FREE_NODE, GOVERNED_NODE, hitTestNodeBoxes } from './core/DragPolicy';
export { DEFAULT_NOTE_STYLE } from './core/NoteDefaults';
export { AGENT_PALETTE, agentStepText, agentChecklist, visibleAgents, type AgentPresenceRecord, type AgentStepStatus } from './core/agentPresenceText';
export type { DragPolicy, DragVerdict, DragGesture, DragCancelReason, NodeCapabilities, NodeGovernance, WorldPoint, } from './core/DragPolicy';
export type { SlateJSON, NodeJSON } from './core/Serialization';
export type { ShapeDefinition } from './core/ShapeRegistry';
export type { Association } from './core/Relationship';
export type { CollabOptions, CollabUser, CollabPackage } from './core/Collab';
export type { SlatePackage } from './core/SlatePackage';
export type { ExportOptions } from './core/Export';
export type { ThemeStyle, ThemeDefinition } from './core/Theme';
export type { LayoutMove } from './core/Layout';
export type { CommentOptions } from './core/Comments';
export type { PresentationStep } from './core/Presentation';
export { Camera, cameraFor, cameraBetween, viewboxFor, flightDuration } from './core/Camera';
export type { CameraState, CameraBox, CameraTarget, CameraViewport, CameraArc, FlyOptions } from './core/Camera';
export type { FilterDef } from './core/Filters';
export type { NodeSelector as SlateNodeSelector, SlateOperation, SlateOperationKind, SlateOperationPlan, SlateOperationReport, SlateOperationValidation, } from './operations';
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
export declare function SlateboxJS(element: string | HTMLElement, options?: any): Slate;
export default SlateboxJS;
