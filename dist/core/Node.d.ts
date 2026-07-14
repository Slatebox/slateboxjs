import { G, Rect, Text, Circle, Ellipse } from "@svgdotjs/svg.js";
import { ResizeRotate, ResizeRotateOptions } from "./ResizeRotate";
import type { Slate } from "./Slate";
import { Connector, ConnectorOptions } from "./Connector";
import { Relationships } from "./Relationships";
import { Images } from "./Images";
import { Editor } from "./Editor";
import { Links } from "./Links";
import { Filters } from "./Filters";
import { Menu } from "./Menu";
interface SnapRect {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * Smart-align a rect to a set of neighbor rects: return the position where the
 * rect's nearest edge/center (left/center/right, top/middle/bottom) lines up
 * with a neighbor's matching edge/center, within `threshold` px. Unchanged when
 * nothing is close. Pure + independently testable (drives node snap-to-objects).
 */
export declare function snapRectToNeighbors(rect: SnapRect, others: SnapRect[], threshold?: number): {
    x: number;
    y: number;
};
export interface NodeLinkOptions {
    show?: boolean;
    type?: "url" | "currentSlate" | "externalSlate";
    data?: string;
    thumbnail?: string;
}
export interface NodeFilterOptions {
    vect?: string;
    text?: string;
}
export interface NodeAnimationOptions {
    vect?: string;
    text?: string;
}
export interface NodeAIOptions {
    textToChildNodes?: any;
    textToImage?: any;
}
export interface NodeOptions {
    id: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    name?: string;
    groupId?: string;
    text?: string;
    fontSize?: number;
    fontFamily?: string;
    fontColor?: string;
    fontStyle?: string;
    textOpacity?: number;
    textXAlign?: "left" | "center" | "right";
    textYAlign?: "top" | "middle" | "bottom";
    textOffset?: {
        x?: number;
        y?: number;
    };
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderStyle?: "solid" | "dashed" | "dotted" | "-" | "." | "--." | "combo";
    borderOpacity?: number;
    borderDisplayOnly?: boolean;
    opacity?: number;
    shape?: string;
    vectorPath?: string;
    shapeHint?: string;
    svgContent?: string;
    svgString?: string;
    image?: string;
    imageOrigWidth?: number;
    imageOrigHeight?: number;
    lineColor?: string;
    lineOpacity?: number;
    lineEffect?: string;
    lineType?: "bezier" | "linear" | "straight";
    lineCurveType?: "cubic" | "quadratic";
    lineCurviness?: number;
    lineWidth?: number;
    allowDrag?: boolean;
    isLocked?: boolean;
    disableDrag?: boolean;
    allowMenu?: boolean;
    allowContext?: boolean;
    allowResize?: boolean;
    showDelete?: boolean;
    showAdd?: boolean;
    showResize?: boolean;
    showRotate?: boolean;
    showMenu?: boolean;
    showColorTab?: boolean;
    showTextTab?: boolean;
    showAITab?: boolean;
    showShapeTab?: boolean;
    showImageTab?: boolean;
    showEffectTab?: boolean;
    showRelationshipConnector?: boolean;
    showRelationshipDelete?: boolean;
    showRelationshipProperties?: boolean;
    showRelationshipReassign?: boolean;
    showAddAndDeleteConditionally?: boolean;
    spaceBetweenNodesWhenAdding?: number;
    disableMenuAsTemplate?: boolean;
    isComment?: boolean;
    isCategory?: boolean;
    categoryName?: string;
    humanTouch?: boolean;
    iconFor?: string;
    defaultShaped?: boolean;
    pinUnderneath?: boolean;
    rotate?: {
        rotationAngle?: number;
    };
    resizeRotate?: ResizeRotateOptions;
    connector?: ConnectorOptions;
    link?: NodeLinkOptions;
    filters?: NodeFilterOptions;
    animations?: NodeAnimationOptions;
    ai?: NodeAIOptions;
    customRender?: (group: G, options: NodeOptions) => void;
}
export declare class Node {
    id: string;
    options: NodeOptions;
    svgGroup: G;
    backgroundRect: Rect | Circle | Ellipse | G;
    /**
     * For path shapes, backgroundRect is the nested <svg> wrapper used for
     * sizing/handles; the actual fill/stroke live on this inner <path>. Undefined
     * only for the unknown-shape compatibility rectangle and SVG-content setup.
     */
    contentPath?: any;
    resizeTarget?: any;
    textElement: Text;
    nestedSvg?: any;
    resizeRotate: ResizeRotate;
    connector: Connector;
    relationships: Relationships;
    images: Images;
    editor: Editor;
    links: Links;
    filters: Filters;
    menu: Menu;
    private connectionHandles;
    private connectionHandlesVisible;
    private _connHandleHideTimer;
    private _connHandlesPinned;
    private connectionPreview?;
    slate: Slate;
    private isDragging;
    private wasSelectedBeforeDrag;
    private preDragTransform;
    private preDragPosition;
    private _dragStartPointer;
    private _groupDragSiblings;
    /** Resolves when the node is fully created (SVG elements, connector, relationships, etc.) */
    ready: Promise<void>;
    private _lastClickTime;
    private _resolveReady;
    private _rejectReady;
    private _initFailed;
    private _destroyed;
    private _svgViewboxTimeoutId;
    private _dragEndTimeoutId;
    private _previewViewboxTimeoutId;
    private _connectTimeoutId;
    /**
     * Creates a new diagram node.
     *
     * Nodes support two mutually exclusive content types: text content (default)
     * and SVG content (when `options.svgContent` is set). The node is created
     * asynchronously — await `node.ready` before using sub-modules.
     *
     * @param options - Node configuration (position, size, shape, text, colors, etc.)
     * @param slate  - The parent Slate instance
     *
     * @example
     * ```ts
     * const node = slate.addNode({
     *   x: 100, y: 100, width: 120, height: 80,
     *   text: 'Hello', shape: 'rectangle', backgroundColor: '#4ecdc4'
     * });
     * await node.ready;
     * node.setRotation(45);
     * ```
     */
    constructor(options: NodeOptions, slate: Slate);
    private generateId;
    private createAsync;
    private finishCreate;
    /** Small "↗" badge shown on a node that has a link; clicking it follows the
     * link (Links.navigate). Rebuilt whenever the link changes (Links.set/unset).
     * Lives inside svgGroup so it tracks the node's position/size automatically. */
    private _linkBadge?;
    updateLinkIndicator(): void;
    private createBackground;
    /**
     * Change the node's shape at runtime (U5). `shape` may be a named shape or a
     * raw SVG path string. Removes the old shape element, re-renders the new one
     * behind the text/content, and re-binds selection so resize/rotate follow the
     * new shape. No-op for SVG-content nodes.
     */
    setShape(shape: string, vectorPath?: string): void;
    private createText;
    /**
     * Apply the node's fill opacity (options.opacity) to the shape element. Mirrors
     * what createBackground does on load, for the edit path (color pane opacity
     * slider), which otherwise only updated options.
     */
    applyOpacity(): void;
    /**
     * Re-apply font (size / family / color / opacity) from options to the text
     * element and re-center for alignment. The text pane sends font changes via
     * onNodeTextChanged; without this they only updated options, never the render.
     */
    applyTextStyle(): void;
    /**
     * "Snap to neighbors" (Miro smart-align): nudge (x, y) so one of this node's
     * edges or center lines up with a nearby node's matching edge/center. Gated by
     * the caller on viewPort.snapToObjects.
     */
    private snapToNeighbors;
    /**
     * Word-wrap `text` to the node's inner width, returning it with newlines
     * inserted at break points (SVG.js renders one tspan per line). Explicit
     * newlines are preserved; a single word longer than the width stays on its own
     * line rather than being split mid-word. Falls back to a character estimate
     * when canvas measurement isn't available.
     */
    /**
     * Fraction of the bounding box usable for text, by shape. Tapering shapes
     * (diamond, triangle, star) have a much smaller INSCRIBED area than their
     * bounding box, so text laid out to the full width spills past the angled
     * edges (e.g. a diamond's usable width is roughly half its bbox). Rectangles
     * use the full box. Applied to BOTH wrap width and fit scale so text wraps +
     * shrinks to stay inside the actual shape, not just its bounding rect.
     */
    private shapeTextInset;
    private wrapTextToWidth;
    /**
     * Grow the node's height so wrapped text fits inside it (Miro-style: nodes
     * grow to fit typed content). Only ever grows — never shrinks — to avoid
     * jumpiness when text is removed. Derived from the text, so it's re-applied on
     * load without needing to be persisted separately. No-op in headless tests
     * where getBBox is unavailable.
     */
    private fitHeightToText;
    /** Position the text element within the background shape based on alignment settings. */
    centerText(): void;
    /**
     * Shrink the rendered text to fit within the node bounds (Miro shape behavior).
     * Applies a uniform scale transform around the text's visual center; never grows
     * beyond 1 (the set size) and never shrinks below a readable floor.
     */
    private fitTextToNode;
    private makeDraggable;
    /**
     * Extract the pointer position in client coordinates from an svg.draggable
     * event (or a raw DOM event). svg.draggable exposes the source event at
     * event.detail.event; touch events carry it under touches/changedTouches.
     */
    private pointerFromDragEvent;
    position(x: number, y: number, callback?: () => void, easing?: any, duration?: number): void;
    /** Bring the node to the front of the SVG z-order. */
    /**
     * Raise this node to the top of the SVG z-order. When `persist` is true
     * (deliberate "bring to front"), it broadcasts + records an undo step. Pass
     * false for the transient raise on pointer-down/drag-start so a plain click
     * doesn't persist a z-order change or pollute the undo stack.
     */
    toFront(persist?: boolean): void;
    /** Send the node to the back of the SVG z-order. */
    toBack(persist?: boolean): void;
    /**
     * Comment-count badge (Miro-style): a small count bubble at the node's
     * top-right corner. NON-destructive — it lives in the node's SVG group (so it
     * tracks pan/zoom/position/rotation for free) and never touches the node's text
     * or fill. `resolved` picks the color (green = resolved, red = unresolved,
     * grey = unknown/empty). Pass count <= 0 (or call clearCommentBadge) to remove.
     */
    setCommentBadge(count: number, kind?: "resolved" | "unresolved" | "empty"): void;
    /** Remove the comment-count badge if present. */
    clearCommentBadge(): void;
    /**
     * Remove the node from the canvas (light teardown).
     * Cleans up DOM elements but does NOT disable sub-modules. Use `destroy()` for full teardown.
     */
    remove(): void;
    /**
     * Destroy the node completely, cleaning up all timers, event handlers,
     * and owned sub-modules. Pattern matches PanZoom.ts.
     */
    destroy(): void;
    /** Hide the node visually (sets display:none). */
    hide(): void;
    /** Show the node after hide(). */
    show(): void;
    /**
     * Set the node[s text content. No-op on SVG content nodes.
     *
     * @param text - New text string
     */
    setText(text: string): void;
    /**
     * Resize the node to new dimensions. For circles, forces width === height.
     *
     * @param width  - New width
     * @param height - New height
     */
    setSize(width: number, height: number): void;
    /**
     * Change the node[s background and/or border colors.
     *
     * @param backgroundColor - New fill color (or undefined to keep current)
     * @param borderColor     - New stroke color (or undefined to keep current)
     */
    /**
     * Apply a fill to `el` that may be a solid hex OR a v1-style "colorA-colorB"
     * gradient (slatebox.com stores gradient fills dash-separated). Without this a
     * gradient string was passed straight to SVG fill and rendered black.
     */
    private applyShapeFill;
    setColors(backgroundColor?: string, borderColor?: string): void;
    /**
     * Re-apply the border stroke (color / width / style / opacity) from options.
     * The app's border pane sends one { prop, val } at a time, so we repaint the
     * whole stroke from current options each change. borderStyle accepts the app's
     * symbols ('-', '.', '--.') or words ('dashed', 'dotted'); dash lengths scale
     * with the border width. No-op when there's no plain shape stroke (e.g. SVG
     * content / nested path shapes).
     */
    applyBorder(): void;
    /**
     * SVG stroke-dasharray for the current borderStyle, scaled by border width.
     * Accepts the app's symbols ('-', '.', '--.') and words ('dashed', 'dotted').
     * Returns "none" for solid. Shared by createBackground (load path) and
     * applyBorder (edit path) so border style survives a reload.
     */
    private borderDashArray;
    /** Lock the node, disabling drag and resize/rotate. */
    lock(): void;
    /** Unlock the node, re-enabling drag and resize/rotate. */
    unlock(): void;
    /** Enable resize and rotate handles. Delegates to the Slate for centralized selection management. */
    enableResizeRotate(): void;
    /** Disable resize and rotate handles. Delegates to the Slate. */
    disableResizeRotate(): void;
    /** Enable resize handles only. */
    enableResize(): void;
    /** Disable resize handles only. */
    disableResize(): void;
    /** Enable rotate handle only. */
    enableRotate(): void;
    /** Disable rotate handle only. */
    disableRotate(): void;
    isResizeRotateEnabled(): boolean;
    /**
     * Set the node[s rotation angle.
     *
     * @param angle - Rotation in degrees (positive = clockwise)
     */
    setRotation(angle: number, duration?: number): void;
    /**
     * Set the group's transform to translate(options.x, options.y) followed by a
     * rotation around the node's visual center. The shape/text are drawn at the
     * group's local origin, so position is a pure translate and rotation must be
     * COMPOSED on top of it — replacing the matrix (as an origin:'center' rotate
     * alone does) would drop the translate and fling the node far off-screen on
     * reload. Single source of truth for the group transform.
     */
    private applyPositionAndRotation;
    /**
     * Re-assert the canonical model after a resize/rotate interaction. During the
     * interaction svg.resize.js transforms the backgroundRect (and we rotate the
     * text/nested separately) — rotation is baked into those CHILDREN. Here we
     * strip those child transforms so rotation lives only on the group, then
     * apply the canonical group transform (which also normalizes child position
     * back to the local origin). Without this the shape carries a baked rotation
     * AND the group re-applies rotation on reload → double rotation / fly-off.
     */
    finalizeInteraction(): void;
    /**
     * Get the current rotation angle. Reads from options.rotate first,
     * then falls back to svgGroup transform and backgroundRect transform.
     *
     * @returns Rotation angle in degrees
     */
    getRotation(): number;
    /** Enable the node[s connector so it can form connections to other nodes. */
    enableConnector(): void;
    /**
     * Enable connector with interactive features (selectable, draggable lines).
     *
     * @param makeInteractiveCallback - Optional callback after interactive features are set up
     */
    enableConnectorWithInteractive(makeInteractiveCallback?: boolean): void;
    /** Disable the node[s connector and remove all connections. */
    disableConnector(): void;
    /**
     * Create a connection line from this node to a target node.
     *
     * @param targetNode - The node to connect to
     * @param connectionOptions - Line color, width, type, etc.
     * @returns The connection object
     *
     * @example
     * ```ts
     * node1.connectTo(node2, { lineColor: '#e94560', lineWidth: 3, type: 'curved' });
     * ```
     */
    connectTo(targetNode: any, connectionOptions?: any): import("./Connector").Connection | null;
    disconnectFrom(targetNode: any): boolean;
    disconnectAll(): void;
    /** @returns All connection objects for this node. */
    getConnections(): import("./Connector").Connection[];
    /**
     * Get a specific connection by target node ID.
     *
     * @param targetNodeId - The target node[s ID
     * @returns The connection object or null if not found
     */
    getConnection(targetNodeId: string): import("./Connector").Connection | null;
    isConnectorEnabled(): boolean;
    private centerTextInitial;
    private calculatePathBounds;
    private setupSelectionBehavior;
    /**
     * Ask the host application to render its text-editing pane (v1's
     * onTextPaneRequested contract). The callback the host invokes applies
     * the edits via the Editor. No-op for read-only viewers, locked nodes,
     * or when the host registered no handler.
     */
    requestTextPane(): void;
    /**
     * Double-click behaviour. Miro parity: double-clicking an ordinary text node
     * edits its text inline on the canvas. Comment nodes, SVG-content nodes, locked
     * / read-only nodes have no inline-editable text, so they fall back to the host
     * text pane. The properties drawer stays reachable either way via the selection
     * cog (which opens the same pane), so this doesn't remove drawer access.
     */
    handleDoubleClickEdit(): void;
    private isResizeRotateHandle;
    /** Called by the Slate when this node is selected. */
    onSelected(): void;
    private _nodeCog?;
    /**
     * Show the node context toolbar (G1) — a compact strip CENTERED ABOVE the
     * node (legacy parity) with: delete, plug (drag-to-connect), cog (settings).
     * Only shown on single selection (Slate.updateSelectionResizeRotate drives it).
     */
    showNodeCog(): void;
    /** Draw a crisp monochrome line-icon (delete/plug/cog) centered at (cx,cy). */
    static drawToolIcon(g: any, kind: string, cx: number, cy: number, color: string): void;
    hideNodeCog(): void;
    /**
     * Plug drag-to-connect (G3): press the plug and drag — a dashed rubber-band
     * line follows the pointer from this node; dropping on another node creates an
     * association (connector) to it. Dropping on empty canvas does nothing.
     */
    startConnectDrag(startEvent: any): void;
    /** Called by the Slate when this node is deselected. */
    onDeselected(): void;
    private createConnectionHandles;
    private updateConnectionHandlePositions;
    /**
     * Miro-style: reveal the plug-circles when the node is hovered (not just when
     * selected), so you can drag-to-connect without selecting first. A hide
     * debounce bridges the small gap between the node edge and the offset circles;
     * selection pins them (`_connHandlesPinned`); a connect-drag keeps them alive.
     */
    private wireConnectionHandleHover;
    private revealConnHandlesOnHover;
    private scheduleConnHandlesHide;
    private showConnectionHandles;
    private hideConnectionHandles;
    private showConnectionPreview;
    private createPreviewShape;
    private addArrowheadToConnector;
    private hideConnectionPreview;
    /** Show connection handles (4 blue dots) on this node for creating connected siblings. */
    enableConnectionHandles(): void;
    /** Hide connection handles on this node. */
    disableConnectionHandles(): void;
    isConnectionHandlesEnabled(): boolean;
    private getNodeEdgePoint;
    private createConnectedNode;
    private cloneNodeOptions;
    private connectToNode;
}
export {};
