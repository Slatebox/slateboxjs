import { Svg } from "@svgdotjs/svg.js";
import { Node, NodeOptions } from "./Node";
import { NodesManager } from "./NodesManager";
import { Invoker } from "./Invoker";
import { PanZoom, PanZoomOptions } from "./PanZoom";
import { BirdsEye, BirdsEyeOptions } from "./BirdsEye";
import { type SlateJSON } from "./Serialization";
import { UndoRedo } from "./UndoRedo";
import { MultiSelection } from "./MultiSelection";
import { Grid } from "./Grid";
import { Keyboard } from "./Keyboard";
import { type ExportOptions } from "./Export";
import { Collab, CollabUser } from "./Collab";
import type { SlatePackage } from "./SlatePackage";
import { type ThemeDefinition } from "./Theme";
import { type LayoutMove } from "./Layout";
import { Association } from "./Relationship";
import { ZoomSlider } from "./ZoomSlider";
import { Presentation } from "./Presentation";
export interface SlateEvents {
    onSlateChanged?: (pkg: SlatePackage, collabUsers?: CollabUser[]) => void;
    onInitCollaboration?: (clientID: string) => void;
    onTextPaneRequested?: (node: Node, cb: Function) => void;
    onLineMenuRequested?: (node: Node, association: Association, cb: Function) => void;
    onTakeSnapshot?: (opts?: Record<string, any>) => void;
    onConfirmRequested?: (title: string, msg: string, cb: Function) => void;
    onCollaborationUsersChanged?: (users: CollabUser[]) => void;
    onCollaborationUsersRemoved?: (users: CollabUser[]) => void;
    onCollaboration?: (pkg: SlatePackage) => void;
    onNodeDragged?: (node: Node, evt: MouseEvent) => void;
    onCanvasClicked?: (evt: MouseEvent) => void;
    onImagesRequested?: (opts: Record<string, any>) => void;
    onRequestSave?: (opts?: Record<string, any>) => void;
    onCreateImage?: (opts: Record<string, any>, cb: Function) => void;
    onMenuRequested?: (node: Node, cb: Function) => void;
    isReadOnly?: () => boolean;
    isCommentOnly?: () => boolean;
    canRemoveComments?: () => boolean;
}
export interface SlateOptions {
    id?: string;
    name?: string;
    description?: string;
    container?: string;
    instance?: string;
    shareId?: string;
    enabled?: boolean;
    allowDrag?: boolean;
    followMe?: boolean;
    mindMapMode?: boolean;
    autoResizeNodesBasedOnText?: boolean;
    useLayoutQuadrants?: boolean;
    autoEnableDefaultFilters?: boolean;
    showbirdsEye?: boolean;
    sizeOfbirdsEye?: number;
    showMultiSelect?: boolean;
    showZoom?: boolean;
    showUndoRedo?: boolean;
    showStatus?: boolean;
    showLocks?: boolean;
    isPublic?: boolean;
    isUnlisted?: boolean;
    isPrivate?: boolean;
    isTemplate?: boolean;
    basedOnTemplate?: string;
    basedOnThemeId?: string;
    syncWithTheme?: boolean;
    allowCollaboration?: boolean;
    eligibleForThemeCompilation?: boolean;
    viewPort?: {
        originalWidth?: number;
        originalHeight?: number;
        width?: number;
        height?: number;
        left?: number;
        top?: number;
        showGrid?: boolean;
        gridSize?: number;
        snapToObjects?: boolean;
        showCoordinates?: boolean;
        useInertiaScrolling?: boolean;
        zoom?: {
            r?: number;
            w?: number;
            h?: number;
        };
    };
    containerStyle?: {
        backgroundColor?: string;
        backgroundColorAsGradient?: boolean;
        backgroundGradientType?: "linear" | "radial";
        backgroundGradientColors?: string[];
        backgroundGradientStrategy?: "horizontal" | "vertical" | "diagonal";
        backgroundImage?: string;
        backgroundSize?: "contain" | "cover" | "repeat";
        backgroundEffect?: string;
        prevBackgroundColor?: string;
    };
    defaultLineColor?: string;
    themeId?: string;
    layoutType?: "manual" | "auto";
    disableAutoLayoutOfManuallyPositionedNodes?: boolean;
    nodeOrder?: string[];
    huddleType?: "none" | "basic" | "advanced";
    huddleEnabled?: boolean;
    tags?: string[];
    templateMarkdown?: string;
    templatePrompt?: string;
    ai?: any;
    panZoom?: PanZoomOptions;
    birdsEye?: BirdsEyeOptions;
    events?: SlateEvents;
}
export declare class Slate {
    element: HTMLElement;
    canvas: Svg;
    nodes: NodesManager;
    invoker: Invoker;
    panZoom: PanZoom;
    birdsEye: BirdsEye;
    undoRedo: UndoRedo;
    multiSelection: MultiSelection;
    grid: Grid;
    keyboard: Keyboard;
    collab: Collab;
    zoomSlider: ZoomSlider;
    presentation: Presentation;
    options: SlateOptions;
    linesContainer?: any;
    markersContainer?: any;
    private selectedNodes;
    private groupResizeRotate;
    private _coordinateIntervalId;
    private _destroyed;
    private _applyingRemote;
    private _birdsEyeTimeoutId;
    private _coordDisplayTimeoutId;
    private _nodeNotifyTimeoutId;
    private _liveRegion;
    /**
     * Creates a new Slate — the main orchestrator for a diagramming canvas.
     *
     * Initializes the SVG canvas, sets up all sub-modules (nodes manager,
     * pan/zoom, selection, grid, keyboard shortcuts, undo/redo, etc.),
     * and attaches event handlers.
     *
     * @param element - CSS selector string or HTMLElement to mount the canvas on
     * @param options - Full slate configuration (see SlateOptions interface)
     * @throws If element is a selector string and no matching element is found
     *
     * @example
     * ```ts
     * import { Slate } from 'slateboxjs-v2';
     * const slate = new Slate('#canvas', {
     *   viewPort: { originalWidth: 1200, originalHeight: 800 },
     *   panZoom: { enabled: true }
     * });
     * ```
     */
    constructor(element: string | HTMLElement, options?: SlateOptions);
    private init;
    /**
     * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
     * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
     */
    destroy(): void;
    /**
     * Announce a message to screen readers via the hidden aria-live region.
     * Used for state changes: node add/remove, selection changes, zoom changes.
     */
    announce(msg: string): void;
    /**
     * Emit a v1-compatible change package to the host application via
     * `options.events.onSlateChanged(pkg, collabUsers)`.
     *
     * Suppressed while a remote package is being applied (see
     * {@link beginRemoteApply}) so remote changes are never echoed back to the
     * host as local ones — mirroring v1's clientID filtering.
     *
     * @param type - v1 package type (e.g. "onNodeAdded", "onNodesMove")
     * @param data - v1-shaped package data
     */
    emitSlateChange(type: string, data?: Record<string, any>): void;
    /** Suppress emitSlateChange while applying a remote package (v1 echo semantics). */
    beginRemoteApply(): void;
    /** Re-enable emitSlateChange after a remote package has been applied. */
    endRemoteApply(): void;
    private setupCoordinateCallbacks;
    private addCoordinateDisplay;
    private startCoordinatePolling;
    private updateCoordinateDisplay;
    private makeResponsive;
    /**
     * Add a new node to the slate.
     *
     * @param options - Node options including position, size, text, shape, colors, etc.
     * @returns The newly created Node instance
     *
     * @example
     * ```ts
     * slate.addNode({
     *   id: 'my-node', x: 200, y: 150,
     *   width: 120, height: 80, text: 'Hello',
     *   shape: 'rectangle', backgroundColor: '#4ecdc4'
     * });
     * ```
     */
    addNode(options?: Partial<NodeOptions>): Node;
    /** Remove a node by ID. */
    removeNode(id: string): boolean;
    /**
     * Notify that a node has changed (position, rotation, added, removed)
     * This triggers BirdsEye refresh if enabled
     */
    notifyNodeChanged(node?: Node): void;
    /** @returns The node with the given ID, or undefined if not found. */
    getNode(id: string): Node | undefined;
    /** @returns All nodes currently on the slate. */
    getAllNodes(): Node[];
    /** @returns The SVG root canvas (used as the viewport for pan/zoom). */
    getViewport(): Svg;
    /** @returns Promise resolving to the SVG root canvas. */
    getViewportAsync(): Promise<Svg>;
    /** Enable pan and zoom interactions. */
    enablePanZoom(): void;
    /** Disable pan and zoom interactions. */
    disablePanZoom(): void;
    /** Enable canvas panning. */
    enablePan(): void;
    /** Disable canvas panning. */
    disablePan(): void;
    /** Enable canvas zoom. */
    enableZoom(): void;
    /** Disable canvas zoom. */
    disableZoom(): void;
    /**
     * Pan to a specific position.
     * @param point - { x, y } target position
     */
    pan(point: {
        x: number;
        y: number;
    }): void;
    /**
     * Pan by a relative delta.
     * @param delta - { dx, dy } distance to pan
     */
    panBy(delta: {
        x: number;
        y: number;
    }): void;
    /**
     * Set the zoom level.
     * @param level - Zoom factor (1 = 100%)
     */
    zoom(level: number): void;
    /**
     * Zoom by a relative factor.
     * @param factor - Multiplier applied to current zoom
     */
    zoomBy(factor: number): void;
    /** Zoom in one step. */
    zoomIn(): void;
    /** Zoom out one step. */
    zoomOut(): void;
    /**
     * Zoom centered on a point.
     * @param level - Target zoom level
     * @param point - { x, y } focus point
     */
    zoomAtPoint(level: number, point: {
        x: number;
        y: number;
    }): void;
    /** Reset both pan and zoom to defaults. */
    resetPanZoom(): void;
    /** Reset zoom to 100%. */
    resetZoom(): void;
    /** Reset pan position to origin. */
    resetPan(): void;
    /** Zoom/pan to fit all nodes in the viewport. */
    fitToContent(): void;
    /** Pan to center all nodes in the viewport. */
    centerContent(): void;
    /** @returns Current zoom level (1 = 100%). */
    getZoom(): number;
    /** @returns Current pan position as { x, y }. */
    getPan(): {
        x: number;
        y: number;
    };
    /** Notify pan/zoom that the viewport was resized. */
    resizePanZoom(): void;
    private setupSelectionHandling;
    /**
     * Select one or more nodes on the slate.
     *
     * This is the SINGLE ORCHESTRATOR for selection. It:
     * 1. Clears current selection unless addToSelection is true
     * 2. Adds the specified nodes to the selection set
     * 3. Calls updateSelectionResizeRotate() to enable handles on selected nodes
     * 4. Fires onSelectionChanged event
     *
     * @param nodes - Array of nodes to select
     * @param addToSelection - If true, adds to existing selection instead of replacing it
     *
     * @example
     * ```ts
     * // Select a single node
     * slate.selectNodes([node]);
     * // Add to existing selection
     * slate.selectNodes([node2, node3], true);
     * ```
     */
    selectNodes(nodes: Node[], addToSelection?: boolean): void;
    /** Re-evaluate which nodes should have resize/rotate handles based on current selection. */
    updateSelectionResizeRotate(): void;
    /** Request resize/rotate enable for a specific node (checked against selection). */
    enableNodeResizeRotate(node: Node): void;
    /** Disable resize/rotate for a specific node. */
    disableNodeResizeRotate(node: Node): void;
    private disableGroupResizeRotate;
    private createGroupResizeRotate;
    private calculateGroupBoundingBox;
    private createGroupHandle;
    private updateGroupHandle;
    private handleGroupResize;
    private handleGroupRotate;
    /** Select a single node (convenience wrapper for selectNodes). */
    selectNode(node: Node): void;
    /** Deselect a single node. */
    deselectNode(node: Node): void;
    /** Deselect all currently selected nodes. */
    clearSelection(): void;
    /** @returns Array of currently selected nodes. */
    getSelectedNodes(): Node[];
    /** @returns The first selected node, or null if none selected. */
    getSelectedNode(): Node | null;
    /**
     * Export the slate to a JSON string in v1-compatible format.
     *
     * @param nodes - Optional subset of nodes to include
     * @param asPresentation - If true, includes presentation ordering
     * @returns JSON string
     */
    exportJSON(nodes?: Node[], asPresentation?: boolean): string;
    /**
     * Load a v1-compatible JSON string or object into this slate.
     *
     * @param json - JSON string or SlateJSON object
     * @param preserve - If true, merge with existing nodes instead of replacing
     * @param skipZoom - If true, don't adjust zoom/pan after load
     * @param useMainCanvas - Reserved for future use
     */
    loadJSON(json: string | SlateJSON, preserve?: boolean, skipZoom?: boolean, useMainCanvas?: boolean): Promise<void>;
    /**
     * Take a snapshot of the current slate state.
     * Used by undo/redo system.
     *
     * @returns SlateJSON object (not stringified)
     */
    snapshot(): SlateJSON;
    /**
     * Export the slate as an SVG string.
     */
    svg(opts?: ExportOptions, callback?: (svg: string) => void): string;
    /**
     * Export the slate as a PNG (async).
     */
    png(opts?: ExportOptions, callback?: (result: string | Blob) => void): Promise<string | Blob>;
    /**
     * Synchronous-style PNG export (returns a Promise).
     * Alias for png() for v1 compatibility.
     */
    pngSync(opts?: ExportOptions): Promise<string | Blob>;
    /** Apply a theme to this slate */
    applyTheme(theme: ThemeDefinition, syncWithTheme?: boolean, revertTheme?: boolean): void;
    /** Remove overlapping nodes by pushing them apart */
    removeLayoutOverlaps(enableAttraction?: boolean, threshold?: number): void;
    /** Apply pre-computed layout moves */
    applyLayout(moves: LayoutMove[], cb?: () => void, noAnimation?: boolean): void;
    /** Package current node positions for layout transfer */
    packageLayout(): LayoutMove[];
    /** Show lock icons on all locked nodes */
    displayLocks(): void;
    /** Hide all lock icons */
    hideLocks(): void;
    /** Load all fonts used by nodes in this slate */
    loadAllFonts(): Promise<void>;
}
