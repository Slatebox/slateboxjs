import { G, Rect, Text, Circle, Ellipse } from "@svgdotjs/svg.js";
import "@svgdotjs/svg.draggable.js";
import { ResizeRotate, ResizeRotateOptions } from "./ResizeRotate";
import type { Slate } from "./Slate";
import { Connector, ConnectorOptions } from "./Connector";
import { Relationships } from "./Relationships";
import { Images } from "./Images";
import { Editor } from "./Editor";
import { Links } from "./Links";
import { Filters } from "./Filters";
import { Menu } from "./Menu";
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
    borderStyle?: "solid" | "dashed" | "dotted";
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
    private connectionPreview?;
    slate: Slate;
    private isDragging;
    private wasSelectedBeforeDrag;
    private preDragTransform;
    private preDragPosition;
    private _dragStartPointer;
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
    private createBackground;
    private createText;
    /** Position the text element within the background shape based on alignment settings. */
    centerText(): void;
    private makeDraggable;
    /**
     * Extract the pointer position in client coordinates from an svg.draggable
     * event (or a raw DOM event). svg.draggable exposes the source event at
     * event.detail.event; touch events carry it under touches/changedTouches.
     */
    private pointerFromDragEvent;
    position(x: number, y: number, callback?: () => void, easing?: any, duration?: number): void;
    /** Bring the node to the front of the SVG z-order. */
    toFront(): void;
    /** Send the node to the back of the SVG z-order. */
    toBack(): void;
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
    setColors(backgroundColor?: string, borderColor?: string): void;
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
