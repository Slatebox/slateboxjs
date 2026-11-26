import { Svg } from "@svgdotjs/svg.js";
import { Node, NodeOptions } from "./Node";
import { NodesManager } from "./NodesManager";
import { Invoker } from "./Invoker";
import { PanZoom, PanZoomOptions } from "./PanZoom";
import type { BirdsEye, BirdsEyeOptions } from "./BirdsEye";
import { type SlateJSON } from "./Serialization";
import type { UndoRedo, HostStep, UndoRedoListener, UndoRedoState } from "./UndoRedo";
import type { InlineDraft } from "./Editor";
import { MultiSelection } from "./MultiSelection";
import { Grid } from "./Grid";
import type { Keyboard } from "./Keyboard";
import type { MediaInput, MediaRequest } from "./MediaInput";
import type { ContextMenu } from "./ContextMenu";
import { type ExportOptions } from "./Export";
import { Collab, CollabUser, type NoteTrade, type NoteTrades } from "./Collab";
import type { SlatePackage } from "./SlatePackage";
import { type LayoutMove } from "./Layout";
import { Association } from "./Relationship";
import type { EndAnchor, EndState, LineEnd } from "./LineEnds";
import type { LineToolResult } from "./LineTool";
import { ZoomSlider } from "./ZoomSlider";
import type { Presentation } from "./Presentation";
import { Camera } from "./Camera";
import { type AnimationDef } from "./Animations";
import { type DragCancelReason, type DragPolicy, type NodeCapabilities, type NodeGovernance, type WorldPoint } from "./DragPolicy";
export interface SlateEvents {
    onSlateChanged?: (pkg: SlatePackage, collabUsers?: CollabUser[]) => void;
    /**
     * Called before the collab websocket connects. May return (or resolve to)
     * connection details: `{websocketUrl, websocketParams: {bearer, timestamp},
     * userName, color, ...}` — websocketParams carries server auth.
     */
    onInitCollaboration?: (clientID: string) => void | Record<string, any> | Promise<void | Record<string, any>>;
    onTextPaneRequested?: (node: Node, cb: Function) => void;
    /**
     * A video address was pasted or dropped on the canvas (MediaInput). A host that
     * stores posters makes the media note itself; with no handler the slate makes
     * it, with no poster.
     */
    onMediaRequested?: (request: MediaRequest) => void;
    onLineMenuRequested?: (node: Node, association: Association, cb: Function) => void;
    onTakeSnapshot?: (opts?: Record<string, any>) => void;
    onConfirmRequested?: (title: string, msg: string, cb: Function) => void;
    onCollaborationUsersChanged?: (users: CollabUser[]) => void;
    onCollaborationUsersRemoved?: (users: CollabUser[]) => void;
    onCollaboration?: (pkg: SlatePackage) => void;
    onNodeDragged?: (node: Node, evt: MouseEvent) => void;
    onCanvasClicked?: (evt: MouseEvent) => void;
    /** Fired when a multi-node selection forms (nodes) or ends ([]) */
    onGroupSelection?: (selectedNodes: Node[]) => void;
    onImagesRequested?: (opts: Record<string, any>) => void;
    onRequestSave?: (opts?: Record<string, any>) => void;
    onCreateImage?: (opts: Record<string, any>, cb: Function) => void;
    onMenuRequested?: (node: Node, cb: Function) => void;
    /**
     * What is selected and where it is on screen, for a host that draws its own
     * context toolbar (see `SlateOptions.contextToolbar`). Fired when the selection
     * changes, once with `moving: true` when a drag, resize, rotate, pan or zoom of
     * the selection starts, and with `moving: false` and the new place when it ends.
     */
    onSelectionFrame?: (frame: SelectionFrame) => void;
    isReadOnly?: () => boolean;
    isCommentOnly?: () => boolean;
    canRemoveComments?: () => boolean;
}
/** A box on screen, in client (viewport) pixels. */
export interface ScreenRect {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
    height: number;
}
/** See `SlateEvents.onSelectionFrame`. */
export interface SelectionFrame {
    /** What is selected: one note, several notes, one line, or nothing. */
    kind: "node" | "nodes" | "line" | "lines" | "mixed" | "none";
    /** Note ids, or the line's association id. */
    ids: string[];
    /** The selection's box on screen (rotation included); null when nothing is selected. */
    rect: ScreenRect | null;
    /**
     * Screen pixels above `rect.top` taken by the engine's own handles (the rotate
     * handle and the top connect dot). A host bar whose bottom edge sits at
     * `rect.top - topClearance` or higher covers neither.
     */
    topClearance: number;
    /** True from the start of a drag, resize, rotate, pan or zoom until it ends. */
    moving: boolean;
    /** For a line: the note that owns it, its association and the other note. */
    line?: {
        nodeId: string;
        associationId: string;
        childId: string;
    };
    /**
     * For a line: the screen boxes of the notes at its two ends (start, then end).
     * A host bar placed over the line's span should stay off these as well.
     */
    avoid?: ScreenRect[];
}
export interface SlateOptions {
    /**
     * Who draws the selection's context toolbar. "engine" (the default) draws the
     * small pill (delete, connect, settings) above a selected note or line. "host"
     * draws nothing: the host draws its own bar from `events.onSelectionFrame`.
     */
    contextToolbar?: "engine" | "host";
    /**
     * false on a still picture of a slate (a slate's card, a gallery tile, a draft,
     * a presenter's overview): video notes show their poster, play button and
     * caption, and never play there. Videos play everywhere else (the default).
     */
    mediaPlayback?: boolean;
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
    allowCollaboration?: boolean;
    /**
     * The whole-slate replacement (undo/redo) this document was last built on:
     * the slate it belongs to and the replacement's place in the room's order.
     * Written by Collab, stored with the document, read again when it is loaded.
     */
    collabBaseline?: {
        id?: string;
        t: number;
        c: number;
    };
    /**
     * The note and card trades the stored slate records (see Collab.NoteTrade), put on the document
     * by the host that loads it. Read once the document is drawn and never stored back: while the
     * room has not been told of a trade, the stored document says what the traded note is.
     */
    collabTrades?: NoteTrades;
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
        snapToGrid?: boolean;
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
    /**
     * The style this slate wears: { id, overrides?, v }. A record only: the look itself is written
     * into the slate's background, its notes and its style art (real notes), never derived from it.
     */
    style?: {
        id: string;
        overrides?: Record<string, any>;
        v?: number;
    };
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
    /**
     * The bird's-eye view. With the main entry (slateboxjs) it is always here; with the canvas entry
     * (slateboxjs/canvas) it is created only for a slate that asks for it (options.birdsEye.enabled), once its
     * code has loaded, and is undefined until then.
     */
    birdsEye: BirdsEye;
    undoRedo: UndoRedo;
    /** Listeners given to onUndoRedo before the history arrived (the canvas entry loads it as the slate starts). */
    private _undoListenersWaiting;
    multiSelection: MultiSelection;
    grid: Grid;
    keyboard: Keyboard;
    /** A video address pasted or dropped on the canvas becomes a media note. */
    mediaInput: MediaInput;
    contextMenu: ContextMenu;
    collab: Collab;
    zoomSlider: ZoomSlider;
    presentation: Presentation;
    /** Eased camera flights over the viewbox (Prezi arcs, roll, cuts). */
    camera: Camera;
    options: SlateOptions;
    linesContainer?: any;
    markersContainer?: any;
    /** The single active line-properties cog affordance (M1), if shown. */
    _activeLineCog?: any;
    /** The connectable whose endpoint handles are currently shown (L1/M8). */
    _activeLineConnectable?: any;
    /** The line tool while it is drawing (see LineTool.ts). */
    _lineTool: {
        nodeId: string;
        cancel: () => void;
    } | null;
    private selectedNodes;
    private groupResizeRotate;
    /**
     * The groupId currently "entered" for individual-member editing (Miro
     * double-click-into-group). When set, clicking a member of THIS group selects
     * just that member instead of expanding to the whole group. null = not inside
     * any group.
     */
    private enteredGroupId;
    private _coordinateIntervalId;
    /**
     * Provenance of the last real pointerdown (client coords, whether it hit the
     * blank canvas itself, timestamp). Lets the canvas-click deselect tell a true
     * click on empty space apart from the trailing `click` of a drag whose
     * pointerdown happened elsewhere (rotate/resize handles, marquee, pan).
     */
    private _lastPointerDown;
    private _windowPointerDownHandler;
    private _othersChange;
    /** The pointers pressed on this canvas whose gesture is one undo step (see setupUndoGestures). */
    private _undoPointers;
    private _undoGestureHandlers;
    private _destroyed;
    /** >0 while packages from the room or a document load are being applied (not the person's own edits). */
    private _applyingRemote;
    /** >0 while a change is made on this screen only (see {@link onlyHere}). */
    private _onlyHere;
    /** Host steps made on this screen that wait for the host's save (see {@link holdUntil}). */
    private _held;
    /** Document loads (loadJSON, undo, redo, a replacement from the room) that have not finished. */
    private _loadsInFlight;
    private _hadGroupSelection;
    private _emitDeferred;
    private _emitQueue;
    private _birdsEyeTimeoutId;
    private _coordDisplayTimeoutId;
    private _nodeNotifyTimeoutId;
    private _liveRegion;
    private _announcementsHeld;
    private _resizeObserver;
    /** Hosts that govern some notes (see DragPolicy.ts). Empty on an ordinary slate. */
    private _dragPolicies;
    private _selectionListeners;
    private _selectionNoticeQueued;
    /** The line selected on the canvas (a click on it), if any. */
    private _selectedLine;
    /** Gestures of the selection under way (drag, resize, rotate, pan); see onSelectionFrame. */
    private _frameGestures;
    private _frameMovingSent;
    private _frameQueued;
    private _frameLastKey;
    private _frameViewTimer;
    private _frameSettleTimer;
    private _frameRecheck;
    /** >0 while a host is changing its own governed notes (see withPolicyAuthority). */
    private _policyAuthority;
    /** The governed note being dragged right now, if any. */
    _governedDragNode: Node | null;
    /**
     * v1-parity `slate.filters.availableFilters` — the node Effects pane reads
     * `node.slate.filters.availableFilters` (keyed by name, each with `types`) to
     * decide which effects to offer. Per-node application lives on `node.filters`.
     */
    get filters(): {
        availableFilters: Record<string, {
            types: string[];
        }>;
        availableAnimations: Record<string, AnimationDef>;
    };
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
     * import { Slate } from 'slateboxjs';
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
     * Run `fn` without live-region announcements, for a caller that will describe the
     * whole action in one announcement of its own.
     */
    withoutAnnouncements<T>(fn: () => T): T;
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
    /**
     * Broadcast a library-originated change to collaborators AND surface it to
     * the host (collab.send emits onSlateChanged — v1 echo semantics). This is
     * what interactive mutations (drag, resize, rotate, z-order, delete…) call:
     * in v1 every one of them went out through collab.send. Suppressed while a
     * remote package is being applied so remote changes never re-broadcast.
     */
    broadcast(type: string, data?: Record<string, any>): void;
    /**
     * Make a change on this screen only: nothing it broadcasts reaches collaborators or the
     * host's save, and nothing is recorded for undo (a host step records itself, see
     * {@link beginHostStep}). A host uses it for a step that only its own save makes real (a
     * note and a card trading places): the person sees it at once, and the host sends it with
     * {@link sendHeld} once saved. Until then nobody else, and no one who joins, has seen it.
     */
    onlyHere<T>(change: () => T): T;
    /**
     * Send packages for a change made with {@link onlyHere}, once the host has saved it: to
     * collaborators (and so to the host's save), or to the host alone without collaboration.
     * Sent even while a package from the room is being applied: it is this person's own change.
     */
    sendHeld(packages: SlatePackage[]): void;
    /**
     * The note and card trades the host's server has stored (the newest trade of each note) and
     * the workshop revision they are complete through. A trade this screen has not drawn is drawn
     * now, and the room is told of any it has not been (see Collab.settleTrades). Call it before
     * telling the slate a trade of this person's own was saved.
     */
    settleTrades(trades: Record<string, NoteTrade> | null | undefined, through?: number): void;
    /** The workshop revision through which this screen draws every trade: for the drawing save. */
    tradesThrough(): number;
    /**
     * A trade of this person's own, of note `id`, waits for the host's answer: until then a trade the
     * server tells of is not drawn over this screen's copy of the note (see Collab.holdTrade).
     */
    holdTrade(id: string, answer: unknown): void;
    /** Draw a traded note as the server's trade has it again (this person's own copy was taken away). */
    keepTrade(id: string): void;
    /**
     * A host step made with {@link onlyHere} waits for `saved`, the host's own save of it. The
     * host's drawing save can wait for every such step with {@link whenHeldSettled}, so it never
     * stores a step its own save has not made real.
     */
    holdUntil(saved: Promise<unknown>): void;
    /** True while a host step made on this screen waits for its save. */
    hasHeldChanges(): boolean;
    /** Resolves once no host step waits for its save (saved, refused or failed). */
    whenHeldSettled(): Promise<void>;
    /** Record a debounced undo checkpoint for a document-mutating package. */
    recordUndoFor(type: string): void;
    /**
     * A press on this canvas (a drag, a resize, a rotation, a line drawn, a marquee) is one
     * undo step, whatever it changes and however many packages it sends: the step is
     * recorded when the last pointer pressed on the canvas is let go.
     */
    private setupUndoGestures;
    /** Undo this person's last step on this slate. False when there was nothing to undo. */
    undo(): boolean;
    /** Redo the step this person last undid. False when there was nothing to redo. */
    redo(): boolean;
    /** Whether this person has a step to undo. */
    canUndo(): boolean;
    /** Whether this person has an undone step to redo. */
    canRedo(): boolean;
    /** Whether there is something to undo and to redo, with the steps' names when their hosts gave them. */
    undoRedoState(): UndoRedoState;
    /**
     * Hear whenever there comes to be something, or nothing, to undo or redo, and what each
     * undo or redo did (for a host's Undo and Redo controls). Returns a function that stops it.
     */
    onUndoRedo(listener: UndoRedoListener): () => void;
    /**
     * Record a step the host made in its own state (a board's cards on its server) as the next
     * step of this person's undo history, undone and redone by the host (see HostStep).
     */
    recordHostStep(step: HostStep): void;
    /**
     * Draw a change someone else made (an agent's saved run, another page's import) on this
     * canvas: it is not a step of this person's own, and their undo history takes it in so
     * that no undo of theirs takes it away (see UndoRedo.absorbRemote). `change` may return
     * a promise: the history takes it in once it has settled.
     */
    othersChange<T>(change: () => T | Promise<T>): Promise<T>;
    /**
     * Draw a change of this person's own that their server already holds (a Keep in Ask
     * Slatebox, an import into this slate) as one step of their undo history: everything it
     * draws is recorded together once it has settled. Changes drawn one after another this
     * way, with no pause between them, are one step.
     */
    ownStep<T>(change: () => T | Promise<T>): Promise<T>;
    /** True while {@link othersChange} draws someone else's change: nothing it sends is this person's step. */
    drawingOthersChange(): boolean;
    /** Broadcast types that change the viewport/presence, not document state. */
    private static readonly NON_UNDOABLE;
    /** Queue onSlateChanged packages until flushEmits() (v1 collab-init timing). */
    deferEmits(): void;
    /** Deliver queued packages and resume synchronous emission. */
    flushEmits(): void;
    /**
     * Apply `options.containerStyle` (background color / gradient / image) to
     * the container element. v1's canvas.refreshBackground equivalent — called
     * during init and again after loadJSON replaces the options.
     */
    applyContainerStyle(): void;
    /** v1: host-supplied permission check — true when the viewer cannot edit. */
    isReadOnly(): boolean;
    /** v1: host-supplied permission check — true when only comments are allowed. */
    isCommentOnly(): boolean;
    /** v1: host-supplied permission check for removing comment nodes. */
    canRemoveComments(): boolean;
    /**
     * Suppress emitSlateChange while applying a remote package (v1 echo semantics).
     * Calls nest: a package that loads a whole document holds its own begin until
     * the load has finished, long after the caller that applied the package ended
     * its own. Emission resumes when every begin has ended.
     */
    beginRemoteApply(): void;
    /** Re-enable emitSlateChange after a remote package has been applied. */
    endRemoteApply(): void;
    /** True while a document load is in flight (see holdUntilLoaded). */
    isLoading(): boolean;
    /** A document load started: nothing from the room is applied until it has finished. */
    holdUntilLoaded<T>(load: Promise<T>): Promise<T>;
    /**
     * Resolves once every note is drawn and no document load is in flight, or
     * `null` when that is already so. A note is built a moment after it is added,
     * and a whole document takes longer: a package applied before then (a name for
     * a note not yet drawn, a second replacement of a slate still loading) is lost
     * or lands on the wrong notes. Collab waits on this between packages.
     */
    whenBuilt(): Promise<void> | null;
    /** Tell a host's bar over the selection when the view pans or zooms. */
    private setupFrameCallbacks;
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
    /**
     * Show a region of the world (a workshop's `bounds`, say) as large as its width
     * allows, up to `maxZoom`. Taller than the canvas, it starts at the top and the
     * rest is reached by panning: the fit for a board on a phone.
     *
     * @param region  world coordinates
     * @param padding room left at each side, in world units
     * @param maxZoom the largest scale to use (1 = 100%, the default)
     */
    fitToWidth(region: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, padding?: number, maxZoom?: number): void;
    /** Pan to center all nodes in the viewport. */
    centerContent(): void;
    /** @returns Current zoom level (1 = 100%). */
    getZoom(): number;
    /** @returns Current pan position as { x, y }. */
    getPan(): {
        x: number;
        y: number;
    };
    /**
     * Notify pan/zoom that the viewport was resized: the view box takes the element's size now,
     * keeping the zoom and the view's centre, as the ResizeObserver would on its next turn. A host
     * that changes the canvas's size itself (a panel beside or under it opening or closing) calls
     * this in the same task, so nothing reads or paints a view box shaped for the old size: with
     * preserveAspectRatio "slice", a taller element would otherwise crop the view's sides.
     */
    resizePanZoom(): void;
    /**
     * Keep the viewBox 1:1 with the container pixel size across resizes so the
     * infinite canvas always fills its element and never distorts. Preserves
     * the current zoom level and the world-point at the viewBox center.
     */
    private _setupResizeObserver;
    /** The element size the view box was last shaped for (0 until first measured). */
    private _viewSizeW;
    private _viewSizeH;
    /**
     * Shape the view box to the element's pixel size, keeping the zoom and the world point at the
     * view's centre. Does nothing when the size is the one already taken. Shared by the
     * ResizeObserver and resizePanZoom, so a size taken by one is not taken again by the other.
     */
    private _syncViewBoxToElement;
    /**
     * Bounding-box orientation of the current content (v1 contract):
     * `{orientation, width, height, left, top}` computed over all nodes with
     * 10px padding, falling back to the viewport dimensions when empty.
     */
    getOrientation(): {
        orientation: "landscape" | "portrait";
        width: number;
        height: number;
        left: number;
        top: number;
    };
    private setupSelectionHandling;
    /**
     * Select one or more nodes on the slate.
     *
     * This is the SINGLE ORCHESTRATOR for selection. It:
     * 1. Clears current selection unless addToSelection is true
     * 2. Adds the specified nodes to the selection set
     * 3. Calls updateSelectionResizeRotate() to enable handles on selected nodes
     * 4. Tells onSelectionChange listeners and the host's events.onSelectionFrame
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
    private _decoRefreshQueued;
    /**
     * Coalesce decoration-refresh storms (group rotate, collab bursts, paste +
     * rotate) into ONE overlay rebuild per animation frame. Idempotent and
     * cheap: the rebuild disables/re-enables handles for the whole selection,
     * so per-node calls must not each trigger a full pipeline pass.
     */
    queueSelectionDecorationRefresh(): void;
    updateSelectionResizeRotate(): void;
    /** Request resize/rotate enable for a specific node (checked against selection). */
    enableNodeResizeRotate(node: Node): void;
    /** Disable resize/rotate for a specific node. */
    disableNodeResizeRotate(node: Node): void;
    private disableGroupResizeRotate;
    private createGroupResizeRotate;
    /**
     * Attach an interactive rotate knob to the group-selection outline. Dragging it
     * rotates every selected node about the group centre: each member's centre is
     * revolved around the group centre and the same delta is added to the member's
     * own rotationAngle, so the whole selection turns rigidly (Miro group rotate).
     *
     * Angle math is done in SCREEN space (invariant to the uniform viewBox zoom/pan),
     * then the delta is applied in world space to positions + per-node angles.
     */
    private addGroupRotateHandle;
    private calculateGroupBoundingBox;
    private createGroupHandle;
    private updateGroupHandle;
    private handleGroupResize;
    private handleGroupRotate;
    /** Select a single node (convenience wrapper for selectNodes). */
    selectNode(node: Node): void;
    /**
     * Hear about changes to the selection. The listener is called with the notes now
     * selected, once per turn of the event loop in which the selection changed (a
     * click that replaces one selection with another is one call, not two). Returns a
     * function that stops listening.
     */
    onSelectionChange(listener: (selected: Node[]) => void): () => void;
    /** The selection changed; tell the listeners once the change has settled. */
    private selectionChanged;
    /**
     * Delete the selected notes, as the Delete key does: not for a viewer, not a
     * note the host governs, and a comment only where comments may be removed.
     */
    deleteSelection(): void;
    /** Duplicate the selected notes, as the right-click menu does, and select the copies. */
    duplicateSelection(): void;
    /** True when the host draws the context toolbar and the engine draws no pill. */
    hostDrawsToolbar(): boolean;
    /**
     * What is selected and where it is on screen now (see `onSelectionFrame`).
     * `moving` is true while a drag, resize, rotate, pan or zoom is under way.
     */
    getSelectionFrame(): SelectionFrame;
    /** The line selected on the canvas, with its association, or null. */
    getSelectedLine(): {
        node: Node;
        association: any;
    } | null;
    /**
     * Remove the selected line, the same way the engine's own pill does (the change
     * is broadcast, saved and undoable like any removed connection). False when no
     * line is selected or the line may not be removed.
     */
    removeSelectedLine(): boolean;
    /**
     * Select a line, as clicking it does: its end handles show (each marking
     * whether it follows its note, is pinned or is free) and the host hears of it
     * through onSelectionFrame. False when the note holds no such line.
     */
    selectLine(nodeId: string, associationId: string): boolean;
    /**
     * Where an end of a line is on its note now, as a normalized anchor {x, y}
     * (pinning it there keeps it exactly where it is), or null for a free end.
     */
    lineEndAnchor(nodeId: string, associationId: string, which: LineEnd): EndAnchor | null;
    /** Whether an end of a line follows its note, is pinned to a spot on its edge, or is free. */
    lineEndState(nodeId: string, associationId: string, which: LineEnd): EndState | null;
    /**
     * Pin an end of a line where it is now ("pinned"), at a spot on its note's
     * edge ({x, y}), or let it follow its note ("follow"). Saved, shared and
     * undoable. False for a free end, or when the slate cannot be edited.
     */
    setLineEnd(nodeId: string, associationId: string, which: LineEnd, mode: "follow" | "pinned" | EndAnchor): boolean;
    /**
     * The line tool: a line follows the pointer from the note; a click or tap on
     * another note connects to it, on empty canvas leaves its end free there;
     * Escape cancels. Resolves with what happened (see LineTool.ts).
     */
    startLineFrom(node: Node | string): Promise<LineToolResult>;
    /** Stop the line tool, if it is drawing. */
    cancelLineTool(): void;
    /** True while the line tool is drawing a line. */
    isDrawingLine(): boolean;
    /** Called by the connector when a line is selected on the canvas. */
    setSelectedLine(node: Node, associationId: string, childId: string, connectable: any): void;
    /** A gesture of the selection started (drag, resize, rotate, pan). See onSelectionFrame. */
    frameGestureStart(key: string): void;
    /** That gesture ended: once nothing else is moving, the frame is sent again, still. */
    frameGestureEnd(key: string): void;
    /**
     * The view changed (a pan or zoom step, or the canvas was resized). Each step
     * restarts a short wait; the frame is still again once the steps stop.
     */
    frameViewChanged(): void;
    /** A note's place or size changed outside a gesture: the frame may have moved. */
    nodeGeometryChanged(node: Node): void;
    private sendMovingFrame;
    private settleFrameSoon;
    /** Send the frame once the current change has settled (coalesced, and only when it changed). */
    private scheduleSelectionFrame;
    private emitSelectionFrame;
    /** The notes' (rotated) boxes, together, on screen. */
    private screenRectOfNodes;
    /**
     * Room above the frame taken by the engine's handles: the top connect dot and
     * the rotate handle of one note, or the group's rotate knob. Read from what is
     * drawn when it is there, otherwise from the handles' known offsets.
     */
    private measureTopClearance;
    /** Deselect a single node. */
    deselectNode(node: Node): void;
    /**
     * A note's outline, handles, plugs and cog live outside the note, in an overlay
     * the selection pass reaches only through the notes still on the slate. A note
     * leaving the selection (deselected, removed, or replaced by an undo) puts them
     * away itself, or they stay round empty canvas. NodesManager.clear() calls it for a
     * selected note a whole-slate replace takes away (the selection itself is dropped by
     * notifyNotesReplaced, once hosts have read it).
     * @internal
     */
    putAwaySelectionUi(node: Node): void;
    /** Deselect all currently selected nodes. */
    /** Remove the active line cog + endpoint handles (M1/L1), if any. */
    clearLineCog(): void;
    clearSelection(): void;
    /** @returns Array of currently selected nodes. */
    getSelectedNodes(): Node[];
    /** @returns The first selected node, or null if none selected. */
    getSelectedNode(): Node | null;
    /**
     * Align the selected (or given) nodes to their shared bounding box (Miro-style).
     * mode: left | centerH | right | top | middle | bottom. Broadcasts onNodesMove
     * so the change persists + syncs to collab. No-op for < 2 nodes.
     */
    /**
     * Axis-aligned bounding box of a node in WORLD coords, accounting for its
     * rotation (the four corners rotated about the node's center). Un-rotated → the
     * option box; rotated → the tight box enclosing the visually-rotated shape. This
     * is what alignment, distribution and the group-selection outline must use so
     * rotated nodes line up by what you SEE, not by their un-rotated option box.
     */
    private rotatedBounds;
    alignNodes(mode: string, nodes?: Node[]): void;
    /**
     * Evenly distribute the selected (or given) nodes along an axis so the gaps
     * between them are equal; the outermost two stay put. axis: horizontal |
     * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
     */
    distributeNodes(axis: string, nodes?: Node[]): void;
    private layoutBoxOf;
    private moveToPositions;
    /** All nodes belonging to the given groupId (empty if none/falsy). */
    getGroupMembers(groupId: string | null | undefined): Node[];
    /** The groupId of a node, or null if it isn't grouped. */
    getGroupIdOf(node: Node): string | null;
    /** True if the node is a member of any group. */
    isGrouped(node: Node): boolean;
    /** The groupId currently entered for member editing, or null. */
    getEnteredGroupId(): string | null;
    /**
     * Expand a node list to include every group-mate of any grouped node in it
     * (deduped, order-stable). Used so lock/rotate/etc. apply to whole groups.
     */
    private expandToGroups;
    /**
     * Group the selected (or given) nodes into ONE group so they select/move/rotate/
     * lock as a unit. Assigns a fresh groupId to every member (flattening any prior
     * groups in the selection into the new one, Miro-style). Persists via onNodesMove
     * and re-selects the whole new group. No-op for < 2 nodes.
     * @returns the new groupId, or null if nothing was grouped.
     */
    groupNodes(nodes?: Node[]): string | null;
    /**
     * Ungroup: dissolve every group represented in the selected (or given) nodes by
     * clearing each member's groupId. Persists and keeps the nodes multi-selected.
     */
    ungroupNodes(nodes?: Node[]): void;
    /**
     * Lock the selected (or given) nodes — and, for any grouped node, its whole
     * group — disabling drag/resize. Persists via onNodesMove.
     */
    lockNodes(nodes?: Node[]): void;
    /** Unlock the selected (or given) nodes and their groups. */
    unlockNodes(nodes?: Node[]): void;
    /** True if every given (or selected) node is locked. */
    isSelectionLocked(nodes?: Node[]): boolean;
    /**
     * Enter a group for individual-member editing (Miro double-click-into-group).
     * Selects `member` if given, else the first member. While entered, clicking a
     * member selects just that member instead of the whole group.
     */
    enterGroup(groupId: string, member?: Node): void;
    /** Exit the currently-entered group and re-select it as a whole. */
    exitGroup(): void;
    /**
     * Register a host policy for some notes (see {@link DragPolicy}). The policy says
     * which notes it governs and what a person may do to each; it is asked before a
     * governed note is dragged, while it moves, and when it is released.
     *
     * @returns a function that removes the policy and returns its notes to ordinary behaviour.
     */
    setDragPolicy(policy: DragPolicy): () => void;
    /** The policy governing `node` and the note's capabilities, or null for an ordinary note. */
    governanceOf(node: Node | null | undefined): NodeGovernance | null;
    /**
     * What may be done to `node` right now. Ordinary notes can do everything; so can
     * governed notes while their host is changing them (withPolicyAuthority).
     */
    capabilitiesOf(node: Node | null | undefined): Readonly<NodeCapabilities>;
    /** True for a governed note that is a drawing of host state (left out of saves and undo). */
    isDerivedNode(node: Node | null | undefined): boolean;
    /** The notes among `nodes` (default: all) that no policy governs. */
    freeNodes(nodes?: Node[]): Node[];
    /**
     * Run `fn` as the host that owns the governed notes: capability checks pass
     * (the host may remove or connect its own notes) and nothing is broadcast.
     */
    withPolicyAuthority<T>(fn: () => T): T;
    /** End a governed drag in progress as a refusal. Returns whether there was one. */
    cancelGovernedDrag(reason?: DragCancelReason): boolean;
    /**
     * Re-apply what governance shows on each note (cursor, focusability, pointer
     * input). Call it after a policy starts or stops claiming notes.
     */
    refreshGovernance(): void;
    /**
     * Take the inline edit in progress, if any, before a load replaces every note
     * (loadJSON, or an undo or redo, this person's or someone else's): the load
     * destroys the note being edited and its editor with it. Give the result to
     * {@link resumeInlineDraft} once the load has finished.
     */
    takeInlineDraft(): {
        id: string;
        draft: InlineDraft;
    } | null;
    /**
     * Open the edit taken by {@link takeInlineDraft} again on the note's new copy,
     * with the text typed so far and the caret where it was, so the person goes on
     * typing as if nothing had happened. Nothing is opened when the note is gone,
     * or when an edit is already open elsewhere.
     */
    resumeInlineDraft(saved: {
        id: string;
        draft: InlineDraft;
    } | null): boolean;
    /**
     * Show the policies an ordinary note on the move (see DragPolicy.onFreeMove). Only a
     * single ordinary note is offered; a group drag and a governed note are not.
     */
    offerFreeMove(node: Node, point: WorldPoint): void;
    /**
     * Offer a dropped ordinary note to the policies (see DragPolicy.onFreeDrop). The first
     * that takes or refuses it decides; with none, the drop is an ordinary move.
     */
    offerFreeDrop(node: Node, point: WorldPoint, from: WorldPoint): "taken" | "refused" | null;
    /**
     * Offer several ordinary notes dropped together to the policies (see
     * DragPolicy.onFreeGroupDrop). The first that takes or refuses them decides; with none,
     * the drop is an ordinary move.
     */
    offerFreeGroupDrop(nodes: Node[], point: WorldPoint, from?: WorldPoint[]): "taken" | "refused" | null;
    /** Tell the policies an ordinary note's words were committed (see DragPolicy.onFreeTextCommit). */
    offerFreeTextCommit(node: Node): void;
    /** What each policy keeps with an undo record (see DragPolicy.undoState). Null when none keeps anything. */
    undoHostState(): Map<DragPolicy, unknown> | null;
    /** This person's undo or redo went back to a record: hand each policy what it kept with it. */
    restoreUndoHostState(state: unknown, notes: {
        added: string[];
        removed: string[];
    }): void;
    /**
     * A host is about to change its own state and the drawing together as one step (a
     * note becoming one of its governed notes, or the other way round). Records any edit
     * still waiting to be recorded as its own step, and brings what the host keeps with
     * the current record up to date, so an undo goes back to exactly this moment.
     */
    beginHostStep(): void;
    /** Record the step begun with {@link beginHostStep} once its changes are made. */
    endHostStep(): void;
    /** Tell each policy that loadJSON / undo / redo replaced the slate's notes. */
    notifyNotesReplaced(): void;
    /**
     * loadJSON, undo and redo replace every note by a new one, even where the id
     * stays the same. A selection kept across that holds notes that are no longer
     * on the slate: nothing shows as selected, yet Delete still acts on them, and
     * the next selection change tries to draw connectors for a note that is gone
     * ("Cannot read properties of null (reading 'screenCTM')"). Notes that were
     * replaced leave the selection.
     */
    private dropReplacedFromSelection;
    /**
     * Remove governed notes from a change package, or return null when nothing is
     * left of it. Used for packages leaving this slate (broadcast) and arriving from
     * collaborators, so a governed note is changed only by its host.
     */
    screenGovernedPackage(type: string, data: Record<string, any> | any[] | undefined): any;
    /** A note arrived and is drawn: each policy hears of it (DragPolicy.onNodeAdded). */
    nodeAdded(node: Node): void;
    /** Hand a line change that touches a governed note to the policy that governs it (once per policy). */
    private offerGovernedLine;
    /** Keep governed and decoration notes out of selections they may not join. */
    private screenSelection;
    /** Convert a point on screen (clientX/clientY) to world coordinates. */
    clientToWorld(point: {
        x: number;
        y: number;
    }): WorldPoint;
    /** Convert a world point to screen (client) coordinates, through the current pan and zoom. */
    worldToClient(point: WorldPoint): {
        x: number;
        y: number;
    };
    /**
     * The topmost note under a world point, by each note's (rotated) box.
     *
     * @param point  world coordinates (see clientToWorld)
     * @param nodes  the notes to consider; defaults to every note on the slate
     * @param options.padding  extra world units around each box that still count
     * @param options.exclude  a note to ignore (for example the one being dragged)
     */
    hitTestNodes(point: WorldPoint, nodes?: Node[], options?: {
        padding?: number;
        exclude?: Node | null;
    }): Node | null;
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
    /** Remove overlapping nodes by pushing them apart */
    /** Optimize Layout: the shared tidy layout over the slate's notes, saved as one move. */
    removeLayoutOverlaps(gap?: number): void;
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
