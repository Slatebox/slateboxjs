import { SVG, Svg } from "@svgdotjs/svg.js";
import { Node, NodeOptions } from "./Node";
import { NodesManager } from "./NodesManager";
import { Invoker } from "./Invoker";
import { PanZoom, PanZoomOptions } from "./PanZoom";
import { BirdsEye, BirdsEyeOptions } from "./BirdsEye";
import {
  serialize,
  deserialize,
  snapshot as takeSnapshot,
  type SlateJSON,
} from "./Serialization";
import { UndoRedo } from "./UndoRedo";
import type { InlineDraft } from "./Editor";
import { MultiSelection } from "./MultiSelection";
import { Grid } from "./Grid";
import { Keyboard } from "./Keyboard";
import { ContextMenu } from "./ContextMenu";
import { exportSVG, exportPNG, type ExportOptions } from "./Export";
import { Collab, CollabUser, type NoteTrade, type NoteTrades } from "./Collab";
import type { SlatePackage } from "./SlatePackage";
import { v2NodeToV1 } from "./compat";
import { guid } from "../utils";
import { applyTheme, type ThemeDefinition } from "./Theme";
import {
  removeLayoutOverlaps,
  applyLayout as applyLayoutMoves,
  packageLayout,
  type LayoutMove,
} from "./Layout";
import { Association } from "./Relationship";
import type { EndAnchor, EndState, LineEnd } from "./LineEnds";
import { startLineTool, type LineToolResult } from "./LineTool";
import { alignPositions, distributePositions, type AlignMode, type LayoutBox, type Position } from "../operations/layout";
import { ZoomSlider } from "./ZoomSlider";
import { Presentation } from "./Presentation";
import { Camera } from "./Camera";
import { getAvailableFilters } from "./Filters";
import { getAvailableAnimations, type AnimationDef } from "./Animations";
import { loadAllFonts as loadAllFontsForSlate } from "./FontLoader";
import {
  FREE_NODE,
  hitTestNodeBoxes,
  resolveGovernance,
  type DragCancelReason,
  type DragPolicy,
  type NodeCapabilities,
  type NodeGovernance,
  type WorldPoint,
} from "./DragPolicy";

export interface SlateEvents {
  onSlateChanged?: (pkg: SlatePackage, collabUsers?: CollabUser[]) => void;
  /**
   * Called before the collab websocket connects. May return (or resolve to)
   * connection details: `{websocketUrl, websocketParams: {bearer, timestamp},
   * userName, color, ...}` — websocketParams carries server auth.
   */
  onInitCollaboration?: (
    clientID: string
  ) => void | Record<string, any> | Promise<void | Record<string, any>>;
  onTextPaneRequested?: (node: Node, cb: Function) => void;
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
  line?: { nodeId: string; associationId: string; childId: string };
  /**
   * For a line: the screen boxes of the notes at its two ends (start, then end).
   * A host bar placed over the line's span should stay off these as well.
   */
  avoid?: ScreenRect[];
}

function toScreenRect(r: { left: number; top: number; right: number; bottom: number }): ScreenRect {
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.right - r.left, height: r.bottom - r.top };
}

export interface SlateOptions {
  /**
   * Who draws the selection's context toolbar. "engine" (the default) draws the
   * small pill (delete, connect, settings) above a selected note or line. "host"
   * draws nothing: the host draws its own bar from `events.onSelectionFrame`.
   */
  contextToolbar?: "engine" | "host";

  // Identity
  id?: string;
  name?: string;
  description?: string;
  container?: string;
  instance?: string;
  shareId?: string;

  // Behavior
  enabled?: boolean;
  allowDrag?: boolean;
  followMe?: boolean;
  mindMapMode?: boolean;
  autoResizeNodesBasedOnText?: boolean;
  useLayoutQuadrants?: boolean;
  autoEnableDefaultFilters?: boolean;

  // UI visibility
  showbirdsEye?: boolean;
  sizeOfbirdsEye?: number;
  showMultiSelect?: boolean;
  showZoom?: boolean;
  showUndoRedo?: boolean;
  showStatus?: boolean;
  showLocks?: boolean;

  // Access control
  isPublic?: boolean;
  isUnlisted?: boolean;
  isPrivate?: boolean;
  isTemplate?: boolean;
  basedOnTemplate?: string;
  basedOnThemeId?: string;
  syncWithTheme?: boolean;

  // Collaboration
  allowCollaboration?: boolean;
  /**
   * The whole-slate replacement (undo/redo) this document was last built on:
   * the slate it belongs to and the replacement's place in the room's order.
   * Written by Collab, stored with the document, read again when it is loaded.
   */
  collabBaseline?: { id?: string; t: number; c: number };
  /**
   * The note and card trades the stored slate records (see Collab.NoteTrade), put on the document
   * by the host that loads it. Read once the document is drawn and never stored back: while the
   * room has not been told of a trade, the stored document says what the traded note is.
   */
  collabTrades?: NoteTrades;
  eligibleForThemeCompilation?: boolean;

  // Viewport
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

  // Appearance
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

  // Defaults
  defaultLineColor?: string;
  themeId?: string;

  // Layout
  layoutType?: "manual" | "auto";
  disableAutoLayoutOfManuallyPositionedNodes?: boolean;
  nodeOrder?: string[]; // Array of node IDs for z-ordering

  // Huddle
  huddleType?: "none" | "basic" | "advanced";
  huddleEnabled?: boolean;

  // Metadata
  tags?: string[];
  templateMarkdown?: string;
  templatePrompt?: string;
  ai?: any;

  // Sub-systems
  panZoom?: PanZoomOptions;
  birdsEye?: BirdsEyeOptions;

  // Events
  events?: SlateEvents;
}

export class Slate {
  public element: HTMLElement;
  public canvas!: Svg;
  public nodes!: NodesManager;
  public invoker!: Invoker;
  public panZoom!: PanZoom;
  public birdsEye!: BirdsEye;
  public undoRedo!: UndoRedo;
  public multiSelection!: MultiSelection;
  public grid!: Grid;
  public keyboard!: Keyboard;
  public contextMenu!: ContextMenu;
  public collab!: Collab;
  public zoomSlider!: ZoomSlider;
  public presentation!: Presentation;
  /** Eased camera flights over the viewbox (Prezi arcs, roll, cuts). */
  public camera!: Camera;
  public options: SlateOptions;
  // Runtime-injected by Connector for global line/marker containers
  public linesContainer?: any;
  public markersContainer?: any;
  /** The single active line-properties cog affordance (M1), if shown. */
  public _activeLineCog?: any;
  /** The connectable whose endpoint handles are currently shown (L1/M8). */
  public _activeLineConnectable?: any;
  /** The line tool while it is drawing (see LineTool.ts). */
  public _lineTool: { nodeId: string; cancel: () => void } | null = null;
  private selectedNodes: Node[] = [];
  private groupResizeRotate: any = null; // Will hold the group resize/rotate controller
  /**
   * The groupId currently "entered" for individual-member editing (Miro
   * double-click-into-group). When set, clicking a member of THIS group selects
   * just that member instead of expanding to the whole group. null = not inside
   * any group.
   */
  private enteredGroupId: string | null = null;
  private _coordinateIntervalId: ReturnType<typeof setInterval> | null = null;
  /**
   * Provenance of the last real pointerdown (client coords, whether it hit the
   * blank canvas itself, timestamp). Lets the canvas-click deselect tell a true
   * click on empty space apart from the trailing `click` of a drag whose
   * pointerdown happened elsewhere (rotate/resize handles, marquee, pan).
   */
  private _lastPointerDown: {
    x: number;
    y: number;
    onCanvas: boolean;
    time: number;
  } | null = null;
  private _windowPointerDownHandler: ((e: PointerEvent) => void) | null = null;
  private _destroyed: boolean = false;
  /** >0 while packages from the room or a document load are being applied (not the person's own edits). */
  private _applyingRemote = 0;
  /** >0 while a change is made on this screen only (see {@link onlyHere}). */
  private _onlyHere = 0;
  /** Host steps made on this screen that wait for the host's save (see {@link holdUntil}). */
  private _held = new Set<Promise<void>>();
  /** Document loads (loadJSON, undo, redo, a replacement from the room) that have not finished. */
  private _loadsInFlight = new Set<Promise<unknown>>();
  private _hadGroupSelection: boolean = false;
  private _emitDeferred: boolean = false;
  private _emitQueue: SlatePackage[] = [];
  private _birdsEyeTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _coordDisplayTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _nodeNotifyTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private _liveRegion: HTMLElement | null = null; // Hidden aria-live region for screen readers
  private _announcementsHeld = 0; // >0 while a caller is batching its own announcement
  private _resizeObserver: ResizeObserver | null = null;
  /** Hosts that govern some notes (see DragPolicy.ts). Empty on an ordinary slate. */
  private _dragPolicies: DragPolicy[] = [];
  private _selectionListeners: Array<(selected: Node[]) => void> = [];
  private _selectionNoticeQueued = false;
  /** The line selected on the canvas (a click on it), if any. */
  private _selectedLine: { node: Node; associationId: string; childId: string; connectable: any } | null = null;
  /** Gestures of the selection under way (drag, resize, rotate, pan); see onSelectionFrame. */
  private _frameGestures = new Set<string>();
  private _frameMovingSent = false;
  private _frameQueued = false;
  private _frameLastKey = "";
  private _frameViewTimer: ReturnType<typeof setTimeout> | null = null;
  private _frameSettleTimer: ReturnType<typeof setTimeout> | null = null;
  private _frameRecheck: number | null = null;
  /** >0 while a host is changing its own governed notes (see withPolicyAuthority). */
  private _policyAuthority = 0;
  /** The governed note being dragged right now, if any. */
  public _governedDragNode: Node | null = null;

  /**
   * v1-parity `slate.filters.availableFilters` — the node Effects pane reads
   * `node.slate.filters.availableFilters` (keyed by name, each with `types`) to
   * decide which effects to offer. Per-node application lives on `node.filters`.
   */
  public get filters(): {
    availableFilters: Record<string, { types: string[] }>;
    availableAnimations: Record<string, AnimationDef>;
  } {
    return {
      availableFilters: getAvailableFilters(),
      availableAnimations: getAvailableAnimations(),
    };
  }

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
  constructor(element: string | HTMLElement, options: SlateOptions = {}) {
    // Get or create the target element
    if (typeof element === "string") {
      const found = document.querySelector(element) as HTMLElement;
      if (!found) {
        throw new Error(`Element with selector "${element}" not found`);
      }
      this.element = found;
    } else {
      this.element = element;
    }

    // Register on window for host-app debugging and e2e tooling
    if (typeof window !== "undefined") {
      const w = window as any;
      w.__slateboxInstances = w.__slateboxInstances || [];
      w.__slateboxInstances.push(this);
    }

    // Default options
    this.options = {
      name: "Untitled Slate",
      description: "",
      followMe: true,
      mindMapMode: false,
      autoResizeNodesBasedOnText: true,
      viewPort: {
        originalWidth: 800,
        originalHeight: 600,
        showGrid: false,
        snapToObjects: false,
        showCoordinates: true,
      },
      containerStyle: {
        backgroundColor: "#ffffff",
        backgroundColorAsGradient: false,
        backgroundGradientType: "linear",
        backgroundGradientColors: [],
        backgroundGradientStrategy: "horizontal",
        backgroundImage: undefined,
        backgroundSize: "contain",
        backgroundEffect: undefined,
        prevBackgroundColor: "#ffffff",
      },
      defaultLineColor: "#000000",
      themeId: undefined,
      layoutType: "manual",
      disableAutoLayoutOfManuallyPositionedNodes: false,
      huddleType: "none",
      huddleEnabled: false,
      tags: [],
      templateMarkdown: "",
      templatePrompt: "",
      isTemplate: false,
      ai: {},
      panZoom: {
        enabled: true,
        panning: true,
        pinchZoom: true,
        wheelZoom: false, // Disable wheel zoom - use pinch to zoom, scroll to pan
        zoomFactor: 0.3,
        zoomMin: 0.1,
        zoomMax: 10,
      },
      ...options,
    };

    this.init();
  }

  private init() {
    // Initialize SVG canvas
    this.canvas = SVG().addTo(this.element);

    // Accessibility: label the canvas for screen readers
    this.canvas.node.setAttribute("role", this.options.enabled === false ? "img" : "group");
    this.canvas.node.setAttribute("aria-label", this.options.name || "Diagram canvas");
    this.canvas.node.setAttribute("tabindex", "0");

    // Accessibility: create hidden live region for screen-reader announcements
    this._liveRegion = document.createElement("div");
    this._liveRegion.setAttribute("aria-live", "polite");
    this._liveRegion.setAttribute("aria-atomic", "true");
    this._liveRegion.style.cssText =
      "position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;";
    this.element.appendChild(this._liveRegion);

    // ── Infinite canvas ──
    // The SVG root FILLS its container; the visible region is driven entirely
    // by the viewBox (Miro-style). Nothing is clipped to a fixed box — pan/
    // zoom just move the viewBox across an unbounded plane.
    this.element.style.overflow = this.element.style.overflow || "hidden";
    if (getComputedStyle(this.element).position === "static") {
      this.element.style.position = "relative";
    }
    const svgNode = this.canvas.node as SVGSVGElement;
    if (svgNode?.style) {
      svgNode.style.width = "100%";
      svgNode.style.height = "100%";
      svgNode.style.display = "block";
    }
    svgNode?.removeAttribute?.("width");
    svgNode?.removeAttribute?.("height");
    svgNode?.setAttribute?.("preserveAspectRatio", "xMidYMid slice");

    // Initial viewBox = container pixel size at zoom 1 (1 unit = 1px),
    // centered on the world origin so content near it is in view. Falls back
    // to sensible defaults before the element has been laid out.
    const rect = this.element.getBoundingClientRect();
    this.options.viewPort = this.options.viewPort || {};
    // Honor an explicit originalWidth/Height for the initial viewBox; else
    // measure the container. The ResizeObserver keeps it synced to real px.
    const vw =
      this.options.viewPort.originalWidth || Math.round(rect.width) || 800;
    const vh =
      this.options.viewPort.originalHeight || Math.round(rect.height) || 600;
    this.options.viewPort.originalWidth = vw;
    this.options.viewPort.originalHeight = vh;
    // Default framing: origin at top-left (matches v1's initial viewBox), so
    // content near (0,0) is visible immediately. Content placed far away
    // (e.g. the app seeds nodes near 10000,10000) is framed by the host's
    // scaleToFitAndCenter/fitToContent after load. Honors an explicit
    // viewPort.left/top when provided.
    const originX = this.options.viewPort.left ?? 0;
    const originY = this.options.viewPort.top ?? 0;
    this.canvas.viewbox(originX, originY, vw, vh);

    // Keep the viewBox 1:1 with the container as it resizes (preserve zoom
    // and center point) so the canvas always fills and never distorts.
    this._setupResizeObserver();

    // Initialize nodes manager
    this.nodes = new NodesManager(this);

    // Initialize invoker with the contract methods
    this.invoker = new Invoker(this);

    // Apply background color/gradient/image from options
    this.applyContainerStyle();

    // Set up selection management
    this.setupSelectionHandling();

    // Set up coordinate display callbacks before pan/zoom initialization
    if (this.options.viewPort?.showCoordinates) {
      this.setupCoordinateCallbacks();
    }

    // A pan or zoom moves the selection on screen (see onSelectionFrame).
    this.setupFrameCallbacks();

    // Initialize pan/zoom functionality
    this.panZoom = new PanZoom(this, this.options.panZoom);

    // Initialize birds eye / minimap
    this.birdsEye = new BirdsEye(this, this.options.birdsEye);
    if (this.options.birdsEye?.enabled) {
      // Delay enable to ensure canvas is ready
      this._birdsEyeTimeoutId = setTimeout(() => {
        if (!this._destroyed) this.birdsEye.enable();
      }, 200);
    }

    // Initialize undo/redo + take an empty baseline so the very first edit on a
    // fresh slate is undoable (loadJSON re-baselines for loaded documents).
    this.undoRedo = new UndoRedo(this, {
      enabled: this.options.showUndoRedo !== false,
    });
    this.undoRedo.snap?.(true);

    // Initialize multi-selection
    this.multiSelection = new MultiSelection(this, {
      enabled: this.options.showMultiSelect !== false,
    });

    // Initialize grid
    this.grid = new Grid(this, {
      enabled: this.options.viewPort?.showGrid || false,
      gridSize: this.options.viewPort?.gridSize || 20,
      // Re-apply the persisted snap-to-grid setting so it survives reload.
      snapToGrid: this.options.viewPort?.snapToGrid || false,
    });
    if (this.options.viewPort?.showGrid) {
      this.grid.show();
    }

    // Initialize keyboard bindings
    this.keyboard = new Keyboard(this);
    if (this.options.enabled !== false) {
      this.keyboard.bindGlobal();
    }

    // Right-click context menu (bring-to-front / back / duplicate / delete)
    this.contextMenu = new ContextMenu(this);
    if (this.options.enabled !== false) {
      this.contextMenu.enable();
    }

    // Initialize collaboration (lazy — call collab.init() to connect)
    this.collab = new Collab(this);

    // Initialize zoom slider
    this.zoomSlider = new ZoomSlider(this, {
      enabled: this.options.showZoom || false,
    });

    // Initialize presentation mode
    this.presentation = new Presentation(this);
    this.camera = new Camera(this);

    // Make canvas responsive
    this.makeResponsive();

    // Add coordinate display element after pan/zoom is ready
    if (this.options.viewPort?.showCoordinates) {
      this._coordDisplayTimeoutId = setTimeout(() => {
        if (!this._destroyed) this.addCoordinateDisplay();
      }, 150);
    }
  }

  /**
   * Destroy the Slate, cleaning up all sub-modules, timers, and event listeners.
   * Follows the PanZoom.ts pattern: clear timers → remove listeners → chain to owned objects.
   */
  public destroy(): void {
    // The line tool stops (its window listeners go with it).
    try {
      this._lineTool?.cancel();
    } catch (e) {
      /* noop */
    }
    this._destroyed = true;
    this._dragPolicies = [];
    this._governedDragNode = null;
    if (this._frameViewTimer) clearTimeout(this._frameViewTimer);
    if (this._frameSettleTimer) clearTimeout(this._frameSettleTimer);
    if (this._frameRecheck !== null && typeof cancelAnimationFrame !== "undefined") cancelAnimationFrame(this._frameRecheck);
    this._selectedLine = null;

    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }

    // Deregister from the window instance list
    if (typeof window !== "undefined") {
      const w = window as any;
      if (Array.isArray(w.__slateboxInstances)) {
        w.__slateboxInstances = w.__slateboxInstances.filter(
          (s: any) => s !== this
        );
      }
    }

    // Clear all pending timeouts
    if (this._birdsEyeTimeoutId !== null) {
      clearTimeout(this._birdsEyeTimeoutId);
      this._birdsEyeTimeoutId = null;
    }
    if (this._coordDisplayTimeoutId !== null) {
      clearTimeout(this._coordDisplayTimeoutId);
      this._coordDisplayTimeoutId = null;
    }
    if (this._nodeNotifyTimeoutId !== null) {
      clearTimeout(this._nodeNotifyTimeoutId);
      this._nodeNotifyTimeoutId = null;
    }

    // Clear coordinate polling interval
    if (this._coordinateIntervalId !== null) {
      clearInterval(this._coordinateIntervalId);
      this._coordinateIntervalId = null;
    }

    // Remove coordinate display element
    const coordDisplay = this.element.querySelector("#slate-coordinates") as HTMLElement;
    if (coordDisplay) {
      coordDisplay.remove();
    }

    // Remove canvas click handler
    this.canvas.off("click");

    // Remove the window pointerdown tracker
    if (this._windowPointerDownHandler) {
      window.removeEventListener("pointerdown", this._windowPointerDownHandler, true);
      this._windowPointerDownHandler = null;
    }
    this._lastPointerDown = null;

    // Chain destroy to sub-modules
    if (this.panZoom) {
      this.panZoom.destroy();
    }
    if (this.birdsEye) {
      this.birdsEye.disable();
    }
    if (this.zoomSlider) {
      this.zoomSlider.destroy();
    }
    if (this.keyboard) {
      this.keyboard.unbindGlobal();
    }
    if (this.contextMenu) {
      this.contextMenu.disable();
    }
    if (this.multiSelection) {
      this.multiSelection.disable();
    }
    if (this.undoRedo) {
      this.undoRedo.clear();
    }
    if (this.collab) {
      this.collab.disconnect();
    }
    this.camera?.destroy();
    if (this.presentation) {
      this.presentation.stop();
    }
    if (this.grid) {
      this.grid.hide();
    }

    // Clear all nodes
    if (this.nodes) {
      this.nodes.clear();
    }

    // Remove the SVG canvas
    if (this.canvas) {
      this.canvas.remove();
    }

    // Remove live region
    if (this._liveRegion) {
      this._liveRegion.remove();
      this._liveRegion = null;
    }
  }

  /**
   * Announce a message to screen readers via the hidden aria-live region.
   * Used for state changes: node add/remove, selection changes, zoom changes.
   */
  public announce(msg: string): void {
    if (this._announcementsHeld > 0) return;
    if (this._liveRegion) {
      // Clear and set to force re-announcement
      this._liveRegion.textContent = "";
      // Use setTimeout to ensure the clear is processed before the new text
      setTimeout(() => { if (this._liveRegion) this._liveRegion.textContent = msg; }, 50);
    }
  }

  /**
   * Run `fn` without live-region announcements, for a caller that will describe the
   * whole action in one announcement of its own.
   */
  public withoutAnnouncements<T>(fn: () => T): T {
    this._announcementsHeld++;
    try {
      return fn();
    } finally {
      this._announcementsHeld--;
    }
  }

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
  public emitSlateChange(type: string, data: Record<string, any> = {}): void {
    if (this._applyingRemote > 0 || this._onlyHere > 0 || this._destroyed) return;
    const cb = this.options.events?.onSlateChanged;
    if (!cb) return;
    const pkg: SlatePackage = { type, data };
    if (this.options.instance) pkg.instanceId = this.options.instance;

    // v1 timing: onSlateChanged arrived via the async collab echo, so host
    // apps assume collab init already ran (e.g. slatebox.com reads its
    // collaborator ref). While deferred, queue packages for later flush.
    if (this._emitDeferred) {
      this._emitQueue.push(pkg);
      return;
    }

    // The host saves what it is handed: a replacement from someone else drawn soon after was not in it.
    this.collab?.noteHostChange?.(type);
    let users: CollabUser[] = [];
    try {
      users = this.collab?.getCollabUsers?.() ?? [];
    } catch {
      // collab is optional — no users available
    }
    try {
      const result: any = cb(pkg, users);
      // Host handlers are often async — surface rejections as warnings
      // instead of unhandled promise rejections
      result?.catch?.((error: unknown) =>
        console.warn("SLATE_EVENTS_DEBUG: onSlateChanged handler rejected", error)
      );
    } catch (error) {
      console.warn("SLATE_EVENTS_DEBUG: onSlateChanged handler threw", error);
    }
  }

  /**
   * Broadcast a library-originated change to collaborators AND surface it to
   * the host (collab.send emits onSlateChanged — v1 echo semantics). This is
   * what interactive mutations (drag, resize, rotate, z-order, delete…) call:
   * in v1 every one of them went out through collab.send. Suppressed while a
   * remote package is being applied so remote changes never re-broadcast.
   */
  public broadcast(type: string, data: Record<string, any> = {}): void {
    if (this._applyingRemote > 0 || this._onlyHere > 0 || this._destroyed) return;
    // A governed note is the host's to persist: nothing about it is sent, saved
    // or recorded for undo.
    if (this._dragPolicies.length) {
      if (this._policyAuthority > 0) return;
      // A line to or from a governed note is its host's to keep (DragPolicy.onLine).
      this.offerGovernedLine(type, data);
      const screened = this.screenGovernedPackage(type, data);
      if (screened === null) return;
      if (screened !== undefined) data = screened;
    }
    if (typeof this.collab?.send === "function") {
      this.collab.send({ type, data });
    } else {
      this.emitSlateChange(type, data);
    }
    // Record an undo snapshot for state-mutating changes (debounced so a drag or
    // a burst of edits collapses into one undo step). View/presence events don't
    // change document state, so they're excluded.
    this.recordUndoFor(type);
  }

  /**
   * Make a change on this screen only: nothing it broadcasts reaches collaborators or the
   * host's save, and nothing is recorded for undo (a host step records itself, see
   * {@link beginHostStep}). A host uses it for a step that only its own save makes real (a
   * note and a card trading places): the person sees it at once, and the host sends it with
   * {@link sendHeld} once saved. Until then nobody else, and no one who joins, has seen it.
   */
  public onlyHere<T>(change: () => T): T {
    this._onlyHere++;
    try {
      return change();
    } finally {
      this._onlyHere--;
    }
  }

  /**
   * Send packages for a change made with {@link onlyHere}, once the host has saved it: to
   * collaborators (and so to the host's save), or to the host alone without collaboration.
   * Sent even while a package from the room is being applied: it is this person's own change.
   */
  public sendHeld(packages: SlatePackage[]): void {
    if (this._destroyed || !packages.length) return;
    // A trade the host has told of (settleTrades) reaches the room as the server stored it: the
    // room is told of the note's trade, and the host still hears of the change.
    const told = packages.filter((pkg) => {
      const id = (pkg.data as any)?.id;
      return (pkg.type === "onNodeAdded" || pkg.type === "onNodeDeleted") && typeof id === "string" &&
        this.collab?.tellRoomOfTrade?.(id) === true;
    });
    for (const pkg of told) this.emitSlateChange(pkg.type, pkg.data);
    const rest = packages.filter((pkg) => !told.includes(pkg));
    if (!rest.length) return;
    if (typeof this.collab?.send === "function") {
      this.collab.send(rest);
    } else {
      for (const pkg of rest) this.emitSlateChange(pkg.type, pkg.data);
    }
  }

  /**
   * The note and card trades the host's server has stored (the newest trade of each note) and
   * the workshop revision they are complete through. A trade this screen has not drawn is drawn
   * now, and the room is told of any it has not been (see Collab.settleTrades). Call it before
   * telling the slate a trade of this person's own was saved.
   */
  public settleTrades(trades: Record<string, NoteTrade> | null | undefined, through?: number): void {
    if (this._destroyed) return;
    this.collab?.settleTrades?.(trades, through);
  }

  /** The workshop revision through which this screen draws every trade: for the drawing save. */
  public tradesThrough(): number {
    return this.collab?.tradesSettledThrough?.() ?? 0;
  }

  /**
   * A trade of this person's own, of note `id`, waits for the host's answer: until then a trade the
   * server tells of is not drawn over this screen's copy of the note (see Collab.holdTrade).
   */
  public holdTrade(id: string, answer: unknown): void {
    if (this._destroyed || !answer || typeof (answer as any).then !== "function") return;
    this.collab?.holdTrade?.(id, answer as Promise<unknown>);
  }

  /** Draw a traded note as the server's trade has it again (this person's own copy was taken away). */
  public keepTrade(id: string): void {
    if (this._destroyed) return;
    this.collab?.keepTrade?.(id);
  }

  /**
   * A host step made with {@link onlyHere} waits for `saved`, the host's own save of it. The
   * host's drawing save can wait for every such step with {@link whenHeldSettled}, so it never
   * stores a step its own save has not made real.
   */
  public holdUntil(saved: Promise<unknown>): void {
    const held = saved.then(
      () => undefined,
      () => undefined
    );
    this._held.add(held);
    held.then(() => this._held.delete(held));
  }

  /** True while a host step made on this screen waits for its save. */
  public hasHeldChanges(): boolean {
    return this._held.size > 0;
  }

  /** Resolves once no host step waits for its save (saved, refused or failed). */
  public async whenHeldSettled(): Promise<void> {
    while (this._held.size) await Promise.all([...this._held]);
  }

  /** Record a debounced undo checkpoint for a document-mutating package. */
  public recordUndoFor(type: string): void {
    if (this.undoRedo && !Slate.NON_UNDOABLE.has(type)) {
      // A delete is a step of its own; other edits group into one step per burst.
      if (type === "onNodeDeleted" && typeof this.undoRedo.snapAfterGesture === "function") {
        this.undoRedo.snapAfterGesture();
      } else {
        this.undoRedo.snap?.();
      }
    }
  }

  /** Broadcast types that change the viewport/presence, not document state. */
  private static readonly NON_UNDOABLE = new Set<string>([
    "onZoom",
    "onCanvasMove",
    "onFollowMeChanged",
    "onSlateFollowMeChanged",
    "onSlateHuddleChanged",
    "onCursorMoved",
    "onPresenceChanged",
    "onSlateChanged",
    // UndoRedo already moved the history pointer before broadcasting this
    // authoritative state; recording it again would create a duplicate step.
    "onSlateReplaced",
  ]);

  /** Queue onSlateChanged packages until flushEmits() (v1 collab-init timing). */
  public deferEmits(): void {
    this._emitDeferred = true;
  }

  /** Deliver queued packages and resume synchronous emission. */
  public flushEmits(): void {
    this._emitDeferred = false;
    const queued = this._emitQueue.splice(0);
    for (const pkg of queued) {
      this.emitSlateChange(pkg.type, pkg.data);
    }
  }

  /**
   * Apply `options.containerStyle` (background color / gradient / image) to
   * the container element. v1's canvas.refreshBackground equivalent — called
   * during init and again after loadJSON replaces the options.
   */
  public applyContainerStyle(): void {
    const cs = this.options.containerStyle;
    if (!cs || !this.element) return;

    const el = this.element;

    if (
      cs.backgroundColorAsGradient &&
      Array.isArray(cs.backgroundGradientColors) &&
      cs.backgroundGradientColors.length > 1
    ) {
      const colors = cs.backgroundGradientColors.join(", ");
      el.style.backgroundImage =
        cs.backgroundGradientType === "radial"
          ? `radial-gradient(circle, ${colors})`
          : `linear-gradient(${colors})`;
    } else if (cs.backgroundImage) {
      el.style.backgroundImage = `url(${cs.backgroundImage})`;
      if (cs.backgroundSize) el.style.backgroundSize = cs.backgroundSize;
    } else {
      el.style.backgroundImage = "";
    }

    if (cs.backgroundColor) {
      el.style.backgroundColor = cs.backgroundColor;
    }
  }

  /** v1: host-supplied permission check — true when the viewer cannot edit. */
  public isReadOnly(): boolean {
    return !!this.options.events?.isReadOnly?.();
  }

  /** v1: host-supplied permission check — true when only comments are allowed. */
  public isCommentOnly(): boolean {
    return !!this.options.events?.isCommentOnly?.();
  }

  /** v1: host-supplied permission check for removing comment nodes. */
  public canRemoveComments(): boolean {
    return !!this.options.events?.canRemoveComments?.();
  }

  /**
   * Suppress emitSlateChange while applying a remote package (v1 echo semantics).
   * Calls nest: a package that loads a whole document holds its own begin until
   * the load has finished, long after the caller that applied the package ended
   * its own. Emission resumes when every begin has ended.
   */
  public beginRemoteApply(): void {
    this._applyingRemote++;
  }

  /** Re-enable emitSlateChange after a remote package has been applied. */
  public endRemoteApply(): void {
    if (this._applyingRemote > 0) this._applyingRemote--;
  }

  /** True while a document load is in flight (see holdUntilLoaded). */
  public isLoading(): boolean {
    return this._loadsInFlight.size > 0;
  }

  /** A document load started: nothing from the room is applied until it has finished. */
  public holdUntilLoaded<T>(load: Promise<T>): Promise<T> {
    const held = load.then(
      () => undefined,
      () => undefined
    );
    this._loadsInFlight.add(held);
    held.then(() => this._loadsInFlight.delete(held));
    return load;
  }

  /**
   * Resolves once every note is drawn and no document load is in flight, or
   * `null` when that is already so. A note is built a moment after it is added,
   * and a whole document takes longer: a package applied before then (a name for
   * a note not yet drawn, a second replacement of a slate still loading) is lost
   * or lands on the wrong notes. Collab waits on this between packages.
   */
  public whenBuilt(): Promise<void> | null {
    const waits: Promise<unknown>[] = [
      ...this._loadsInFlight,
      ...(this.nodes?.building?.() ?? []),
    ];
    if (waits.length === 0) return null;
    // A note that can never be drawn must not hold the room's packages back for
    // good: after a while it is no longer waited for.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const patience = new Promise<void>((resolve) => {
      timer = setTimeout(() => {
        waits.forEach((wait) => this._loadsInFlight.delete(wait));
        this.nodes?.stopWaitingFor?.(waits as Promise<void>[]);
        resolve();
      }, 5000);
    });
    const built = Promise.allSettled(waits).then(() => clearTimeout(timer));
    return Promise.race([built, patience]);
  }

  /** Tell a host's bar over the selection when the view pans or zooms. */
  private setupFrameCallbacks() {
    if (!this.options.panZoom) this.options.panZoom = {};
    const pz = this.options.panZoom;
    const onPan = pz.onPan;
    const onZoom = pz.onZoom;
    pz.onPan = (pan: any) => {
      this.frameViewChanged();
      onPan?.(pan);
    };
    pz.onZoom = (zoom: any) => {
      this.frameViewChanged();
      onZoom?.(zoom);
    };
  }

  private setupCoordinateCallbacks() {
    // Store original callbacks
    const originalOnPan = this.options.panZoom?.onPan;
    const originalOnZoom = this.options.panZoom?.onZoom;

    // Set up callbacks that will update coordinates
    if (!this.options.panZoom) {
      this.options.panZoom = {};
    }

    this.options.panZoom.onPan = (pan: any) => {
      this.updateCoordinateDisplay();
      if (originalOnPan) {
        originalOnPan(pan);
      }
    };

    this.options.panZoom.onZoom = (zoom: any) => {
      this.updateCoordinateDisplay();
      if (originalOnZoom) {
        originalOnZoom(zoom);
      }
    };

    // v1 contract: a completed pan broadcasts onCanvasMove
    const originalOnPanEnd = this.options.panZoom.onPanEnd;
    this.options.panZoom.onPanEnd = (evt: any) => {
      if (originalOnPanEnd) {
        originalOnPanEnd(evt);
      }
      try {
        const pan = this.getPan();
        this.broadcast("onCanvasMove", {
          left: pan.x,
          top: pan.y,
          relative: { x: pan.x, y: pan.y },
          orient: this.getOrientation(),
        });
      } catch {
        // pan/zoom may not be initialized yet
      }
    };
  }

  private addCoordinateDisplay() {
    // Dev-only debug readout — hidden unless explicitly opted in. It must never
    // show in production (or in the presentation view).
    if (!(this.options as any).showCoordinates) return;
    console.log("COORD_DEBUG: Starting coordinate display creation");

    // Create coordinate display in upper left
    const coordDisplay = document.createElement("div");
    coordDisplay.id = "slate-coordinates";
    coordDisplay.style.cssText = `
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 12px;
      pointer-events: none;
      z-index: 1000;
      min-width: 150px;
    `;

    // Ensure parent element has relative positioning
    this.element.style.position = this.element.style.position || "relative";
    this.element.appendChild(coordDisplay);

    console.log(
      "COORD_DEBUG: Coordinate display element created and added to DOM"
    );
    console.log("COORD_DEBUG: Element style:", coordDisplay.style.cssText);
    console.log("COORD_DEBUG: Parent element:", this.element);

    // Set initial text immediately
    coordDisplay.textContent = "x: 0, y: 0, zoom: 1.00";

    // Start immediate coordinate tracking
    this.updateCoordinateDisplay();

    // Start polling for coordinate updates as fallback
    this.startCoordinatePolling();
  }

  private startCoordinatePolling() {
    if (this._destroyed) return;
    console.log("COORD_DEBUG: Starting coordinate polling");

    // Poll every 200ms to update coordinates (reduced frequency)
    this._coordinateIntervalId = setInterval(() => {
      if (!this._destroyed) this.updateCoordinateDisplay();
    }, 200);
  }

  private updateCoordinateDisplay() {
    const coordDisplay = this.element.querySelector(
      "#slate-coordinates"
    ) as HTMLElement;
    if (!coordDisplay) {
      console.log("COORD_DEBUG: No coordinate display element found in DOM");
      return;
    }

    try {
      // Get current pan and zoom values
      let pan = { x: 0, y: 0 };
      let zoom = 1;

      if (this.panZoom && this.panZoom.isInitialized()) {
        pan = this.getPan();
        zoom = this.getZoom();
        console.log(
          "COORD_DEBUG: Got values from panZoom - pan:",
          pan,
          "zoom:",
          zoom
        );
      } else {
        // Fallback: get directly from viewBox
        const viewBox = this.canvas.viewbox();
        pan = { x: viewBox.x, y: viewBox.y };
        const px = this.element.getBoundingClientRect().width || viewBox.width;
        zoom = px / viewBox.width || 1;
        console.log(
          "COORD_DEBUG: Got fallback values from viewBox - pan:",
          pan,
          "zoom:",
          zoom
        );
      }

      const newText = `x: ${Math.round(pan.x)}, y: ${Math.round(
        pan.y
      )}, zoom: ${zoom.toFixed(2)}`;
      coordDisplay.textContent = newText;

      // Log occasionally to verify it's working
      if (Math.random() < 0.1) {
        // 10% chance to log
        console.log("COORD_DEBUG: Updated coordinates to:", newText);
      }
    } catch (error) {
      console.error("COORD_DEBUG: Error updating coordinates:", error);
      coordDisplay.textContent = "x: ?, y: ?, zoom: ?";
    }
  }

  private makeResponsive() {
    // No-op: the infinite-canvas setup in init() already established a
    // container-filling SVG (width/height 100%) with a viewBox centered on
    // the world origin. Overwriting the viewBox here would undo that.
  }

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
  public addNode(options: Partial<NodeOptions> = {}) {
    const node = this.nodes.add(options);
    // Notify BirdsEye of the new node after a short delay for rendering
    this._nodeNotifyTimeoutId = setTimeout(() => {
      if (!this._destroyed) this.notifyNodeChanged();
      // A note created from a connector is announced once by that gesture instead.
      if (!node.announcedByCreator) {
        this.announce(`Node added: ${node.options.text || "(unnamed)"}`);
      }
    }, 100);
    this.broadcast("onNodeAdded", {
      id: node.id,
      nodeOptions: v2NodeToV1(node.options),
    });
    return node;
  }

  /** Remove a node by ID. */
  public removeNode(id: string) {
    const node = this.nodes.one(id);
    // A governed note leaves only when its host removes it.
    if (node && !this.capabilitiesOf(node).canDelete) return false;
    const text = node?.options?.text || "(unnamed)";
    const isComment = !!node?.options?.isComment;
    // If the node is currently SELECTED, tear down its svg.select resize/rotate overlay
    // (selection box + handles) BEFORE removing it — those handles live in a separate
    // overlay and select(false) needs the element to still exist, or deleting a selected
    // node leaves the whole rogue selection box floating with nothing selected. (Done
    // here, not in node.remove(), to preserve remove()'s light "don't disable sub-modules"
    // contract — this is the permanent user-delete path.)
    if (node && this.selectedNodes.some((n) => n.id === id)) {
      try {
        (node as any).resizeRotate?.disable();
      } catch (e) {
        /* noop */
      }
      this.selectedNodes = this.selectedNodes.filter((n) => n.id !== id);
      this.selectionChanged();
    }
    const result = this.nodes.remove(id);
    // Notify BirdsEye of the removed node
    this.notifyNodeChanged();
    this.announce(`Node removed: ${text}`);
    if (result) {
      this.broadcast("onNodeDeleted", { id, isComment });
    }
    return result;
  }

  /**
   * Notify that a node has changed (position, rotation, added, removed)
   * This triggers BirdsEye refresh if enabled
   */
  public notifyNodeChanged(node?: Node): void {
    if (this.birdsEye?.isEnabled()) {
      this.birdsEye.scheduleRefresh();
    }
  }

  /** @returns The node with the given ID, or undefined if not found. */
  public getNode(id: string) {
    return this.nodes.one(id);
  }

  /** @returns All nodes currently on the slate. */
  public getAllNodes(): Node[] {
    return this.nodes.allNodes;
  }

  // Get the pan/zoom viewport for adding content that should pan/zoom
  /** @returns The SVG root canvas (used as the viewport for pan/zoom). */
  public getViewport(): Svg {
    // SVG.js panzoom works directly with root canvas - no viewport nesting needed!
    console.log("VIEWPORT_DEBUG: Using root canvas (SVG.js panzoom)");
    return this.canvas;
  }

  // Get viewport with retry logic for proper initialization
  /** @returns Promise resolving to the SVG root canvas. */
  public getViewportAsync(): Promise<Svg> {
    // SVG.js panzoom works directly with root canvas - immediate return
    console.log(
      "VIEWPORT_DEBUG: Returning root canvas immediately (SVG.js panzoom)"
    );
    return Promise.resolve(this.canvas);
  }

  // Pan/Zoom API methods
  /** Enable pan and zoom interactions. */
  public enablePanZoom() {
    this.panZoom.enable();
  }

  /** Disable pan and zoom interactions. */
  public disablePanZoom() {
    this.panZoom.disable();
  }

  /** Enable canvas panning. */
  public enablePan() {
    this.panZoom.enablePan();
  }

  /** Disable canvas panning. */
  public disablePan() {
    this.panZoom.disablePan();
  }

  /** Enable canvas zoom. */
  public enableZoom() {
    this.panZoom.enableZoom();
  }

  /** Disable canvas zoom. */
  public disableZoom() {
    this.panZoom.disableZoom();
  }

  /**
   * Pan to a specific position.
   * @param point - { x, y } target position
   */
  public pan(point: { x: number; y: number }) {
    this.panZoom.pan(point);
    this.frameViewChanged();
  }

  /**
   * Pan by a relative delta.
   * @param delta - { dx, dy } distance to pan
   */
  public panBy(delta: { x: number; y: number }) {
    this.panZoom.panBy(delta);
    this.frameViewChanged();
  }

  /**
   * Set the zoom level.
   * @param level - Zoom factor (1 = 100%)
   */
  public zoom(level: number) {
    this.panZoom.zoom(level);
    this.frameViewChanged();
    this.announce(`Zoom: ${Math.round(level * 100)}%`);
    this.broadcast("onZoom", { zoomLevel: level });
  }

  /**
   * Zoom by a relative factor.
   * @param factor - Multiplier applied to current zoom
   */
  public zoomBy(factor: number) {
    this.panZoom.zoomBy(factor);
    this.frameViewChanged();
  }

  /** Zoom in one step. */
  public zoomIn() {
    this.panZoom.zoomIn();
  }

  /** Zoom out one step. */
  public zoomOut() {
    this.panZoom.zoomOut();
  }

  /**
   * Zoom centered on a point.
   * @param level - Target zoom level
   * @param point - { x, y } focus point
   */
  public zoomAtPoint(level: number, point: { x: number; y: number }) {
    this.panZoom.zoomAtPoint(level, point);
  }

  /** Reset both pan and zoom to defaults. */
  public resetPanZoom() {
    this.panZoom.reset();
  }

  /** Reset zoom to 100%. */
  public resetZoom() {
    this.panZoom.resetZoom();
  }

  /** Reset pan position to origin. */
  public resetPan() {
    this.panZoom.resetPan();
  }

  /** Zoom/pan to fit all nodes in the viewport. */
  public fitToContent() {
    this.panZoom.fit();
  }

  /**
   * Show a region of the world (a workshop's `bounds`, say) as large as its width
   * allows, up to `maxZoom`. Taller than the canvas, it starts at the top and the
   * rest is reached by panning: the fit for a board on a phone.
   *
   * @param region  world coordinates
   * @param padding room left at each side, in world units
   * @param maxZoom the largest scale to use (1 = 100%, the default)
   */
  public fitToWidth(region: { x: number; y: number; width: number; height: number }, padding = 16, maxZoom = 1) {
    this.panZoom.fitWidth(region, padding, maxZoom);
  }

  /** Pan to center all nodes in the viewport. */
  public centerContent() {
    this.panZoom.center();
  }

  /** @returns Current zoom level (1 = 100%). */
  public getZoom(): number {
    return this.panZoom.getZoom();
  }

  /** @returns Current pan position as { x, y }. */
  public getPan(): { x: number; y: number } {
    return this.panZoom.getPan();
  }

  /**
   * Notify pan/zoom that the viewport was resized: the view box takes the element's size now,
   * keeping the zoom and the view's centre, as the ResizeObserver would on its next turn. A host
   * that changes the canvas's size itself (a panel beside or under it opening or closing) calls
   * this in the same task, so nothing reads or paints a view box shaped for the old size: with
   * preserveAspectRatio "slice", a taller element would otherwise crop the view's sides.
   */
  public resizePanZoom() {
    this.panZoom.resize();
    this._syncViewBoxToElement();
  }

  /**
   * Keep the viewBox 1:1 with the container pixel size across resizes so the
   * infinite canvas always fills its element and never distorts. Preserves
   * the current zoom level and the world-point at the viewBox center.
   */
  private _setupResizeObserver(): void {
    if (typeof ResizeObserver === "undefined") return;
    this._resizeObserver = new ResizeObserver(() => this._syncViewBoxToElement());
    this._resizeObserver.observe(this.element);
  }

  /** The element size the view box was last shaped for (0 until first measured). */
  private _viewSizeW = 0;
  private _viewSizeH = 0;

  /**
   * Shape the view box to the element's pixel size, keeping the zoom and the world point at the
   * view's centre. Does nothing when the size is the one already taken. Shared by the
   * ResizeObserver and resizePanZoom, so a size taken by one is not taken again by the other.
   */
  private _syncViewBoxToElement(): void {
    if (this._destroyed || !this.element?.getBoundingClientRect) return;
    const rect = this.element.getBoundingClientRect();
    const pw = Math.max(1, Math.round(rect.width));
    const ph = Math.max(1, Math.round(rect.height));
    if (pw === this._viewSizeW && ph === this._viewSizeH) return;

    const vb = this.canvas.viewbox();
    if (!vb || ![vb.x, vb.y, vb.width, vb.height].every(Number.isFinite)) return;
    // Current on-screen scale (viewBox units per pixel). Use the previous
    // container width to recover it; fall back to viewBox/px on first run.
    const unitsPerPx = vb.width / (this._viewSizeW || pw);
    this._viewSizeW = pw;
    this._viewSizeH = ph;

    const cx = vb.x + vb.width / 2;
    const cy = vb.y + vb.height / 2;
    const newW = pw * unitsPerPx;
    const newH = ph * unitsPerPx;
    this.canvas.viewbox(cx - newW / 2, cy - newH / 2, newW, newH);
    this.options.viewPort = this.options.viewPort || {};
    this.options.viewPort.originalWidth = pw;
    this.options.viewPort.originalHeight = ph;
    this.frameViewChanged();
  }

  /**
   * Bounding-box orientation of the current content (v1 contract):
   * `{orientation, width, height, left, top}` computed over all nodes with
   * 10px padding, falling back to the viewport dimensions when empty.
   */
  public getOrientation(): {
    orientation: "landscape" | "portrait";
    width: number;
    height: number;
    left: number;
    top: number;
  } {
    const all = this.nodes?.allNodes ?? [];
    const vp: any = this.options.viewPort || {};
    let width = vp.width ?? vp.originalWidth ?? 800;
    let height = vp.height ?? vp.originalHeight ?? 600;
    let left = 0;
    let top = 0;
    let orientation: "landscape" | "portrait" = "landscape";

    if (all.length > 0) {
      const pad = 10;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      all.forEach((n: any) => {
        const x = n.options.x ?? 0;
        const y = n.options.y ?? 0;
        const w = n.options.width ?? 0;
        const h = n.options.height ?? 0;
        minX = Math.min(minX, x - pad);
        minY = Math.min(minY, y - pad);
        maxX = Math.max(maxX, x + w + pad);
        maxY = Math.max(maxY, y + h + pad);
      });
      left = Math.abs(minX);
      top = Math.abs(minY);
      width = maxX - minX;
      height = maxY - minY;
      if (height > width) orientation = "portrait";
    }

    return { orientation, width, height, left, top };
  }

  // Selection Management
  private setupSelectionHandling() {
    // Record every pointerdown (capture phase, so handlers that stop propagation
    // can't hide it) so the canvas-click handler can see where the matching
    // interaction STARTED, not just where its trailing click was dispatched.
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Element | null;
      // A press on the canvas gives it the keyboard. Notes are not focused by a
      // press, so without this the control last used beside the canvas (a toolbar
      // button, a field) would keep focus, and with it the keys meant for the note
      // just pressed.
      const active = document.activeElement as HTMLElement | null;
      if (t && this.element?.contains(t) && active && active !== document.body &&
          !this.element.contains(active)) active.blur?.();
      // The same holds inside the canvas: a press on one note takes the keyboard
      // from another note, or from one of its connector buttons, that still has
      // focus (Escape on a connector hands focus to its note). Left there, the
      // keys typed for the note just pressed would go to the other one.
      else if (t && active && active instanceof SVGElement &&
          (active as Element) !== (this.canvas?.node as Element | undefined) &&
          this.element?.contains(active)) {
        const pressed = t.closest?.("[data-node-id]");
        if (pressed && !pressed.contains(active)) active.blur?.();
      }
      // Give touch users room outside the visible dot. Only empty root SVG
      // space is eligible: nodes, resize/rotate handles and edges keep priority.
      if (e.pointerType === 'touch' && e.isPrimary && t === this.canvas.node &&
          this.selectedNodes.length === 1 && this.selectedNodes[0].beginNearbyTouchConnection(e)) return;
      this._lastPointerDown = {
        x: e.clientX,
        y: e.clientY,
        onCanvas:
          !!t &&
          (t === this.canvas.node || t.tagName?.toLowerCase() === "svg"),
        time: Date.now(),
      };
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    this._windowPointerDownHandler = onPointerDown;

    // Add canvas click handler to deselect all nodes when clicking empty space
    this.canvas.on("click", (event: any) => {
      console.log(
        "SELECTION_DEBUG: Canvas click detected",
        event.target,
        "vs",
        this.canvas.node
      );

      // Check if the click target is the canvas itself or a child of canvas but not a node
      const isCanvasClick =
        event.target === this.canvas.node ||
        (event.target && event.target.tagName === "svg");

      // Skip the deselect if this click is the tail end of a rubber-band drag
      // that just selected nodes — otherwise the drag-selection is wiped the
      // instant it's made (breaking group-move on the selection).
      const sinceRubberBand = Date.now() - ((this as any)._rubberBandSelectedAt || 0);
      if (sinceRubberBand < 400) {
        (this as any)._rubberBandSelectedAt = 0;
        return;
      }

      // A drag that was released over empty canvas dispatches its trailing
      // `click` on the nearest COMMON ANCESTOR of the pointerdown/pointerup
      // targets — the SVG root — which the isCanvasClick check above would
      // otherwise read as a click on empty space, wiping the selection. Rotate
      // and resize handles, marquee, and pan all routinely release over blank
      // canvas. A real click never travels, so distinguish by the DOWN→up
      // distance and by where the pointer went down (not by time: a deliberate
      // rotation can take longer than any timeout, and that must still keep
      // the selection). With no recorded pointerdown at all (synthetic
      // dispatched clicks in tests) keep the legacy behaviour.
      const pd = this._lastPointerDown;
      const isDragTail =
        !!pd &&
        (!pd.onCanvas ||
          Math.hypot(
            (event.clientX ?? 0) - pd.x,
            (event.clientY ?? 0) - pd.y
          ) > 6);

      if (isCanvasClick && isDragTail) {
        console.log(
          "SELECTION_DEBUG: Drag-tail click (started on a handle/node or travelled) - not deselecting"
        );
        return;
      }

      if (isCanvasClick) {
        console.log("SELECTION_DEBUG: Canvas clicked - deselecting all");
        // Clicking empty canvas also steps out of any entered group.
        this.enteredGroupId = null;
        this.clearSelection();
        this.clearLineCog();
        // v1 contract: notify the host (used to close app-side panes)
        this.options.events?.onCanvasClicked?.(event);
      } else {
        console.log(
          "SELECTION_DEBUG: Click on non-canvas element, not deselecting"
        );
      }
    });

    // Miro parity: double-click on EMPTY canvas drops a new node at the cursor.
    // (Double-click on a NODE edits its text — the isCanvasClick guard separates the
    // two.) NOTE: auto-entering the inline editor on create was attempted 4 ways
    // (await ready, poll for svgGroup, next-frame defer, preventDefault) — the editor
    // opens fine programmatically but never survives the real double-click's event/
    // render sequence, so we create + select and let the user double-click to edit.
    this.canvas.on("dblclick", (event: any) => {
      const isCanvasClick =
        event.target === this.canvas.node ||
        (event.target && event.target.tagName === "svg");
      if (!isCanvasClick) return;
      if (this.isReadOnly?.()) return;
      try {
        const world = this.canvas.point(event.clientX, event.clientY);
        const w = 120;
        const h = 70;
        const node = this.addNode({
          x: Math.round(world.x - w / 2),
          y: Math.round(world.y - h / 2),
          width: w,
          height: h,
          text: "",
        });
        this.selectNodes?.([node]);
      } catch (e) {
        /* noop */
      }
    });
  }

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
  public selectNodes(nodes: Node[], addToSelection: boolean = false) {
    console.log(
      "SELECTION_DEBUG: Selecting nodes",
      nodes.map((n) => n.id),
      "addToSelection:",
      addToSelection
    );

    // Selecting a node clears any line cog affordance.
    this.clearLineCog();

    // Only a note that is on the slate can be selected. A press that began on a
    // note can end after undo, redo or a collaborator's undo replaced every
    // note: the one it began on is gone, and selecting it would leave an
    // invisible selection that Delete still acts on.
    if (nodes.some((n) => (n as any)?.isRemoved)) {
      nodes = nodes.filter((n) => !(n as any).isRemoved);
      if (nodes.length === 0 && addToSelection) return;
    }

    // A governed note is selected on its own or not at all, so nothing that acts
    // on a multi-selection (group drag, align, group rotate, grouping) can move it.
    if (this._dragPolicies.length) {
      const screened = this.screenSelection(nodes, addToSelection);
      nodes = screened.nodes;
      addToSelection = screened.addToSelection;
    }

    // Miro-style groups: clicking a single member of a group selects the WHOLE
    // group — unless we've "entered" that group to edit its members. Selecting
    // anything outside the entered group also exits it. Marquee/programmatic
    // multi-node selects (length > 1) are left untouched.
    if (nodes.length === 1) {
      const gid = this.getGroupIdOf(nodes[0]);
      if (this.enteredGroupId && gid !== this.enteredGroupId) {
        this.enteredGroupId = null;
      }
      if (gid && gid !== this.enteredGroupId) {
        const members = this.getGroupMembers(gid);
        if (members.length > 1) nodes = members;
      }
    }

    // If not adding to selection, clear current selection first
    if (!addToSelection) {
      this.clearSelection();
    }

    // Add new nodes to selection (avoid duplicates)
    nodes.forEach((node) => {
      if (!this.selectedNodes.includes(node)) {
        this.selectedNodes.push(node);
        node.onSelected();
      }
    });

    // Enable resize/rotate for the selection - CENTRALIZED CONTROL
    this.updateSelectionResizeRotate();
    this.selectionChanged();

    // Announce selection change
    const count = this.selectedNodes.length;
    if (count === 0) {
      this.announce("No nodes selected");
    } else if (count === 1) {
      this.announce(`Node selected: ${this.selectedNodes[0].options.text || "(unnamed)"}`);
    } else {
      this.announce(`${count} nodes selected`);
    }

    // v1 contract: multi-node selections notify the host (group toolbar etc.)
    if (count > 1) {
      this._hadGroupSelection = true;
      this.options.events?.onGroupSelection?.(this.selectedNodes.slice());
    }
  }

  // SINGLE ORCHESTRATOR for resize/rotate management
  /** Re-evaluate which nodes should have resize/rotate handles based on current selection. */
  private _decoRefreshQueued = false;

  /**
   * Coalesce decoration-refresh storms (group rotate, collab bursts, paste +
   * rotate) into ONE overlay rebuild per animation frame. Idempotent and
   * cheap: the rebuild disables/re-enables handles for the whole selection,
   * so per-node calls must not each trigger a full pipeline pass.
   */
  public queueSelectionDecorationRefresh() {
    if (this._decoRefreshQueued) return;
    this._decoRefreshQueued = true;
    const run = () => {
      this._decoRefreshQueued = false;
      this.updateSelectionResizeRotate();
    };
    if (typeof requestAnimationFrame !== "undefined") {
      requestAnimationFrame(run);
    } else {
      run();
    }
  }

  public updateSelectionResizeRotate() {
    console.log(
      "SELECTION_DEBUG: Updating resize/rotate for",
      this.selectedNodes.length,
      "selected nodes"
    );

    // First, disable ALL resize/rotate on ALL nodes to prevent conflicts
    // Guard: allNodes can transiently contain nodes whose finishCreate() has
    // not run yet (async creation, collab seeds, paste) — those have no
    // resizeRotate/connection handles; an unguarded call threw the WHOLE
    // selection pipeline (selectNodes → clearSelection → this loop).
    this.nodes.allNodes.forEach((node) => {
      if (node.resizeRotate?.isEnabled?.()) {
        node.resizeRotate.disable();
        console.log("SELECTION_DEBUG: Disabled resize/rotate on", node.id);
      }

      // Also disable connection handles on all nodes
      if (node.isConnectionHandlesEnabled?.()) {
        node.disableConnectionHandles();
        console.log("SELECTION_DEBUG: Disabled connection handles on", node.id);
      }

      // Remove any node-properties cog affordance (M1)
      (node as any).hideNodeCog?.();
    });

    // Remove any existing group controller
    this.disableGroupResizeRotate();

    if (this.selectedNodes.length === 0) {
      // No selection - all resize/rotate disabled
      console.log(
        "SELECTION_DEBUG: No nodes selected - all resize/rotate disabled"
      );
      return;
    }

    if (this.selectedNodes.length === 1) {
      // Single node selection - enable its individual resize/rotate and connection handles
      const selectedNode = this.selectedNodes[0];
      selectedNode.resizeRotate?.enable?.();

      selectedNode.enableConnectionHandles?.();
      // Show the node-properties cog affordance (M1)
      (selectedNode as any).showNodeCog?.();
      console.log(
        "SELECTION_DEBUG: Enabled individual resize/rotate and connection handles on",
        selectedNode.id
      );
    } else {
      // Multiple nodes - create group resize/rotate controller
      // For now, disable connection handles for multi-selection
      console.log(
        "SELECTION_DEBUG: Creating group resize/rotate for",
        this.selectedNodes.length,
        "nodes (connection handles disabled for multi-selection)"
      );
      this.createGroupResizeRotate();
    }
  }

  // Node-level resize/rotate control (called by Node methods)
  /** Request resize/rotate enable for a specific node (checked against selection). */
  public enableNodeResizeRotate(node: Node) {
    // Only enable if this node is currently selected
    if (this.selectedNodes.includes(node)) {
      console.log(
        "SELECTION_DEBUG: Node",
        node.id,
        "requested resize/rotate enable - already selected"
      );
      // Already handled by updateSelectionResizeRotate
    } else {
      console.log(
        "SELECTION_DEBUG: Node",
        node.id,
        "requested resize/rotate enable - selecting it"
      );
      // Select the node (which will enable its resize/rotate)
      this.selectNodes([node], false);
    }
  }

  /** Disable resize/rotate for a specific node. */
  public disableNodeResizeRotate(node: Node) {
    console.log(
      "SELECTION_DEBUG: Node",
      node.id,
      "requested resize/rotate disable"
    );
    // Disable the node's resize/rotate directly
    if (node.resizeRotate?.isEnabled?.()) {
      node.resizeRotate?.disable?.();
    }

    // Also hide connection handles during resize/rotate operations
    if (node.isConnectionHandlesEnabled()) {
      node.disableConnectionHandles();
    }
  }

  private disableGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Disabling group resize/rotate");

    // Disable individual resize/rotate on all selected nodes
    this.selectedNodes.forEach((node) => {
      node.disableResizeRotate();
    });

    // Remove group controller if it exists
    if (this.groupResizeRotate) {
      this.groupResizeRotate.remove();
      this.groupResizeRotate = null;
    }
  }

  private createGroupResizeRotate() {
    console.log("SELECTION_DEBUG: Creating group resize/rotate controller");

    // Remove existing group controller
    if (this.groupResizeRotate) {
      this.groupResizeRotate.remove();
    }

    // Calculate bounding box of all selected nodes
    const groupBBox = this.calculateGroupBoundingBox();

    // Bail out on a non-finite or degenerate box — feeding NaN/zero-size geometry
    // to svg.select.js produces "NaN" polyline-handle errors.
    if (
      ![groupBBox.x, groupBBox.y, groupBBox.width, groupBBox.height].every(
        Number.isFinite
      ) ||
      groupBBox.width <= 0 ||
      groupBBox.height <= 0
    ) {
      return;
    }

    // Create a temporary group element for resize/rotate handles
    this.groupResizeRotate = this.canvas.group();

    // Dashed bounding rect around the whole selection — a clean visual indicator
    // that multiple nodes are selected. (Nodes are still moved together by drag.)
    this.groupResizeRotate
      .rect(groupBBox.width, groupBBox.height)
      .move(groupBBox.x, groupBBox.y)
      .fill("transparent")
      .stroke({ color: "#4a90e2", width: 2, dasharray: "5,5" })
      .attr("pointer-events", "none");

    // Rotate-as-one: an interactive knob above the box rotates every selected node
    // about the group centre (position + own angle), so a group turns as a unit.
    // Skipped when any member is locked. (Group RESIZE remains out of scope.)
    const anyLocked = this.selectedNodes.some((n) => n.options.isLocked);
    if (!anyLocked) this.addGroupRotateHandle(groupBBox);
  }

  /**
   * Attach an interactive rotate knob to the group-selection outline. Dragging it
   * rotates every selected node about the group centre: each member's centre is
   * revolved around the group centre and the same delta is added to the member's
   * own rotationAngle, so the whole selection turns rigidly (Miro group rotate).
   *
   * Angle math is done in SCREEN space (invariant to the uniform viewBox zoom/pan),
   * then the delta is applied in world space to positions + per-node angles.
   */
  private addGroupRotateHandle(groupBBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  }): void {
    const g = this.groupResizeRotate;
    if (!g) return;
    // A rendering affordance must never break selection — any SVG hiccup here is
    // swallowed so the outline still shows and the selection stays usable.
    try {
    const cx = groupBBox.x + groupBBox.width / 2;
    const cy = groupBBox.y + groupBBox.height / 2;
    const offset = 28; // world units above the top edge
    const knobY = groupBBox.y - offset;

    g.line(cx, groupBBox.y, cx, knobY)
      .stroke({ color: "#4a90e2", width: 1 })
      .attr("pointer-events", "none");
    const knob = g
      .circle(14)
      .center(cx, knobY)
      .fill("#ffffff")
      .stroke({ color: "#4a90e2", width: 2 });
    const setCursor = (c: string) => {
      const el = knob.node as any;
      if (el?.style) el.style.cursor = c;
    };
    setCursor("grab");
    knob.attr("pointer-events", "all");

    let dragging = false;
    let startAngle = 0;
    let pivot = { x: 0, y: 0 };
    let snapshot: { node: Node; cx: number; cy: number; angle: number }[] = [];

    const pivotScreen = () => {
      const m = (g.node as any as SVGGraphicsElement).getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      return { x: m.a * cx + m.c * cy + m.e, y: m.b * cx + m.d * cy + m.f };
    };

    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      this.frameGestureStart("group-rotate");
      const cur = Math.atan2(e.clientY - pivot.y, e.clientX - pivot.x);
      let deltaDeg = ((cur - startAngle) * 180) / Math.PI;
      if (e.shiftKey) deltaDeg = Math.round(deltaDeg / 15) * 15; // 15° snap
      const rad = (deltaDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      snapshot.forEach((s) => {
        const dx = s.cx - cx;
        const dy = s.cy - cy;
        const ncx = cx + dx * cos - dy * sin;
        const ncy = cy + dx * sin + dy * cos;
        const w = s.node.options.width || 0;
        const h = s.node.options.height || 0;
        const rot = (s.node.options.rotate =
          s.node.options.rotate || ({} as any));
        rot.rotationAngle = s.angle + deltaDeg;
        s.node.position(ncx - w / 2, ncy - h / 2);
      });
    };

    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      setCursor("grab");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      this.broadcast("onNodesMove", {
        nodeOptions: this.selectedNodes.map((n) => v2NodeToV1(n.options)),
      });
      // Redraw the outline to wrap the freshly-rotated group.
      this.updateSelectionResizeRotate();
      this.frameGestureEnd("group-rotate");
    };

    knob.on("pointerdown", (e: any) => {
      e.preventDefault?.();
      e.stopPropagation?.();
      dragging = true;
      pivot = pivotScreen();
      startAngle = Math.atan2(e.clientY - pivot.y, e.clientX - pivot.x);
      snapshot = this.selectedNodes.map((n) => ({
        node: n,
        cx: (n.options.x || 0) + (n.options.width || 0) / 2,
        cy: (n.options.y || 0) + (n.options.height || 0) / 2,
        angle: n.options.rotate?.rotationAngle || 0,
      }));
      setCursor("grabbing");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    });
    } catch (e) {
      /* rotate knob is best-effort; selection remains usable without it */
    }
  }

  private calculateGroupBoundingBox() {
    if (this.selectedNodes.length === 0) {
      return { x: 0, y: 0, width: 100, height: 100 };
    }

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    // Use each node's LOGICAL position/size (options), not svgGroup.bbox() —
    // bbox() returns the group's *local* box (origin 0,0, ignoring the node's
    // translate), so the group box collapsed to the canvas origin. Off-screen
    // there, svg.select.js computed a degenerate screenCTM and emitted a storm
    // of "NaN" polyline-handle errors on every multi-select.
    // Use each node's ROTATION-AWARE world box so the dashed outline tightly encloses
    // rotated nodes (a rotated node's option box is smaller than its visual extent).
    this.selectedNodes.forEach((node) => {
      const rb = this.rotatedBounds(node);
      minX = Math.min(minX, rb.minX);
      minY = Math.min(minY, rb.minY);
      maxX = Math.max(maxX, rb.maxX);
      maxY = Math.max(maxY, rb.maxY);
    });

    return {
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
    };
  }

  private createGroupHandle(
    selection: any,
    point: any,
    index: number,
    points: any[]
  ) {
    // Create resize handle for the group
    selection
      .circle(8)
      .fill("#4a90e2")
      .stroke("#ffffff")
      .attr("stroke-width", 2);
  }

  private updateGroupHandle(
    handle: any,
    point: any,
    index: number,
    points: any[]
  ) {
    // Update handle position
    handle.center(point[0], point[1]);
  }

  private handleGroupResize(event: any) {
    console.log("SELECTION_DEBUG: Group resize event", event);

    const { box } = event.detail;
    const originalGroupBBox = this.calculateGroupBoundingBox();

    // Calculate scale factors
    const scaleX = box.width / originalGroupBBox.width;
    const scaleY = box.height / originalGroupBBox.height;

    // Apply resize to each selected node
    this.selectedNodes.forEach((node) => {
      const nodeBBox = node.svgGroup.bbox();

      // Calculate new position and size relative to group
      const relativeX = (nodeBBox.x - originalGroupBBox.x) * scaleX;
      const relativeY = (nodeBBox.y - originalGroupBBox.y) * scaleY;
      const newWidth = nodeBBox.width * scaleX;
      const newHeight = nodeBBox.height * scaleY;

      // Apply to node
      node.setSize(newWidth, newHeight);
      node.position(box.x + relativeX, box.y + relativeY);
    });
  }

  private handleGroupRotate(event: any) {
    console.log("SELECTION_DEBUG: Group rotate event", event);

    const { angle } = event.detail;
    const groupBBox = this.calculateGroupBoundingBox();
    const centerX = groupBBox.x + groupBBox.width / 2;
    const centerY = groupBBox.y + groupBBox.height / 2;

    // Apply rotation to each selected node around group center
    this.selectedNodes.forEach((node) => {
      const currentRotation = node.getRotation();
      node.setRotation(currentRotation + angle);

      // You might also want to rotate the position around the group center
      // This would require more complex calculations
    });
  }

  /** Select a single node (convenience wrapper for selectNodes). */
  public selectNode(node: Node) {
    // Maintain backward compatibility - convert to new selectNodes method
    this.selectNodes([node], false);
  }

  /**
   * Hear about changes to the selection. The listener is called with the notes now
   * selected, once per turn of the event loop in which the selection changed (a
   * click that replaces one selection with another is one call, not two). Returns a
   * function that stops listening.
   */
  public onSelectionChange(listener: (selected: Node[]) => void): () => void {
    this._selectionListeners.push(listener);
    return () => {
      this._selectionListeners = this._selectionListeners.filter((l) => l !== listener);
    };
  }

  /** The selection changed; tell the listeners once the change has settled. */
  private selectionChanged(): void {
    this.scheduleSelectionFrame();
    if (this._selectionNoticeQueued || this._selectionListeners.length === 0) return;
    this._selectionNoticeQueued = true;
    queueMicrotask(() => {
      this._selectionNoticeQueued = false;
      if (this._destroyed) return;
      const selected = this.selectedNodes.slice();
      for (const listener of this._selectionListeners.slice()) {
        try {
          listener(selected);
        } catch (error) {
          console.warn("SELECTION: a selection listener threw", error);
        }
      }
    });
  }

  // ─── Selection frame (for a host's own context toolbar) ─────────────

  /**
   * Delete the selected notes, as the Delete key does: not for a viewer, not a
   * note the host governs, and a comment only where comments may be removed.
   */
  public deleteSelection(): void {
    const selected = this.getSelectedNodes().slice();
    if (!selected.length || this.isReadOnly() || this.isCommentOnly()) return;
    for (const node of selected) {
      if (this.capabilitiesOf(node).canDelete === false) continue;
      if (node.options?.isComment && !this.canRemoveComments()) continue;
      this.removeNode(node.id);
    }
    this.clearSelection();
  }

  /** Duplicate the selected notes, as the right-click menu does, and select the copies. */
  public duplicateSelection(): void {
    const selected = this.getSelectedNodes().filter((n) => this.capabilitiesOf(n).canDuplicate !== false);
    if (!selected.length || this.isReadOnly() || this.isCommentOnly()) return;
    (this.contextMenu as any)?.duplicate?.(selected);
  }

  /** True when the host draws the context toolbar and the engine draws no pill. */
  public hostDrawsToolbar(): boolean {
    return this.options.contextToolbar === "host";
  }

  /**
   * What is selected and where it is on screen now (see `onSelectionFrame`).
   * `moving` is true while a drag, resize, rotate, pan or zoom is under way.
   */
  public getSelectionFrame(): SelectionFrame {
    const moving = this._frameGestures.size > 0 || this._frameViewTimer !== null;
    const nodes = this.selectedNodes.filter((n) => !(n as any).isRemoved);
    if (nodes.length) {
      const rect = this.screenRectOfNodes(nodes);
      return {
        kind: nodes.length === 1 ? "node" : "nodes",
        ids: nodes.map((n) => n.id),
        rect,
        topClearance: rect ? this.measureTopClearance(nodes, rect) : 0,
        moving,
      };
    }
    const line = this._selectedLine;
    if (line) {
      let rect: ScreenRect | null = null;
      try {
        const el = line.connectable?.connector?.node as Element | undefined;
        if (el?.isConnected) rect = toScreenRect(el.getBoundingClientRect());
      } catch (e) {
        rect = null;
      }
      if (rect) {
        const ends = [line.node, this.getNode?.(line.childId)].filter(Boolean) as Node[];
        const avoid = ends
          .map((n) => this.screenRectOfNodes([n]))
          .filter((r): r is ScreenRect => Boolean(r));
        return {
          kind: "line",
          avoid,
          ids: [line.associationId],
          rect,
          // The endpoint handles stand a little proud of the line.
          topClearance: 10,
          moving,
          line: { nodeId: line.node.id, associationId: line.associationId, childId: line.childId },
        };
      }
    }
    return { kind: "none", ids: [], rect: null, topClearance: 0, moving: false };
  }

  /** The line selected on the canvas, with its association, or null. */
  public getSelectedLine(): { node: Node; association: any } | null {
    const line = this._selectedLine;
    if (!line) return null;
    const rels: any = (line.node as any).relationships;
    const association =
      rels?.associations?.find((a: any) => a.id === line.associationId) ??
      rels?.getAssociation?.(line.childId) ??
      null;
    if (!association || (line.node as any).isRemoved) return null;
    return { node: line.node, association };
  }

  /**
   * Remove the selected line, the same way the engine's own pill does (the change
   * is broadcast, saved and undoable like any removed connection). False when no
   * line is selected or the line may not be removed.
   */
  public removeSelectedLine(): boolean {
    const line = this._selectedLine;
    if (!line || this.isReadOnly()) return false;
    const rels: any = (line.node as any).relationships;
    const removed = rels?.removeAssociation?.(line.associationId);
    this.clearLineCog();
    return removed !== false;
  }

  /**
   * Select a line, as clicking it does: its end handles show (each marking
   * whether it follows its note, is pinned or is free) and the host hears of it
   * through onSelectionFrame. False when the note holds no such line.
   */
  public selectLine(nodeId: string, associationId: string): boolean {
    const node: any = this.nodes.one(nodeId);
    return !!node?.connector?.selectConnection?.(associationId);
  }

  /**
   * Where an end of a line is on its note now, as a normalized anchor {x, y}
   * (pinning it there keeps it exactly where it is), or null for a free end.
   */
  public lineEndAnchor(nodeId: string, associationId: string, which: LineEnd): EndAnchor | null {
    const node: any = this.nodes.one(nodeId);
    return node?.connector?.currentAnchor?.(associationId, which) ?? null;
  }

  /** Whether an end of a line follows its note, is pinned to a spot on its edge, or is free. */
  public lineEndState(nodeId: string, associationId: string, which: LineEnd): EndState | null {
    const node: any = this.nodes.one(nodeId);
    return node?.connector?.endState?.(associationId, which) ?? null;
  }

  /**
   * Pin an end of a line where it is now ("pinned"), at a spot on its note's
   * edge ({x, y}), or let it follow its note ("follow"). Saved, shared and
   * undoable. False for a free end, or when the slate cannot be edited.
   */
  public setLineEnd(nodeId: string, associationId: string, which: LineEnd, mode: "follow" | "pinned" | EndAnchor): boolean {
    if (this.isReadOnly() || this.isCommentOnly()) return false;
    const node: any = this.nodes.one(nodeId);
    return !!node?.connector?.setEnd?.(associationId, which, mode);
  }

  /**
   * The line tool: a line follows the pointer from the note; a click or tap on
   * another note connects to it, on empty canvas leaves its end free there;
   * Escape cancels. Resolves with what happened (see LineTool.ts).
   */
  public startLineFrom(node: Node | string): Promise<LineToolResult> {
    const from: any = typeof node === "string" ? this.nodes.one(node) : node;
    return startLineTool(this, from);
  }

  /** Stop the line tool, if it is drawing. */
  public cancelLineTool(): void {
    this._lineTool?.cancel();
  }

  /** True while the line tool is drawing a line. */
  public isDrawingLine(): boolean {
    return !!this._lineTool;
  }

  /** Called by the connector when a line is selected on the canvas. */
  public setSelectedLine(node: Node, associationId: string, childId: string, connectable: any): void {
    // A line and notes are not selected together: selecting the line ends the notes' selection.
    if (this.selectedNodes.length) this.clearSelection();
    this._selectedLine = { node, associationId, childId, connectable };
    this.scheduleSelectionFrame();
  }

  /** A gesture of the selection started (drag, resize, rotate, pan). See onSelectionFrame. */
  public frameGestureStart(key: string): void {
    if (this._frameGestures.has(key)) return;
    this._frameGestures.add(key);
    if (this._frameSettleTimer) {
      clearTimeout(this._frameSettleTimer);
      this._frameSettleTimer = null;
    }
    this.sendMovingFrame();
  }

  /** That gesture ended: once nothing else is moving, the frame is sent again, still. */
  public frameGestureEnd(key: string): void {
    if (!this._frameGestures.delete(key)) return;
    this.settleFrameSoon();
  }

  /**
   * The view changed (a pan or zoom step, or the canvas was resized). Each step
   * restarts a short wait; the frame is still again once the steps stop.
   */
  public frameViewChanged(): void {
    if (this._destroyed) return;
    if (this._frameViewTimer) clearTimeout(this._frameViewTimer);
    this._frameViewTimer = setTimeout(() => {
      this._frameViewTimer = null;
      this.settleFrameSoon();
    }, 180);
    this.sendMovingFrame();
  }

  /** A note's place or size changed outside a gesture: the frame may have moved. */
  public nodeGeometryChanged(node: Node): void {
    if (this._frameGestures.size || this._frameViewTimer) return;
    const line = this._selectedLine;
    if (
      this.selectedNodes.includes(node) ||
      (line && (line.node === node || line.childId === node.id))
    ) {
      this.scheduleSelectionFrame();
    }
  }

  private sendMovingFrame(): void {
    if (this._frameMovingSent || this._destroyed) return;
    const frame = this.getSelectionFrame();
    if (frame.kind === "none") return;
    this._frameMovingSent = true;
    this.emitSelectionFrame({ ...frame, moving: true });
  }

  private settleFrameSoon(): void {
    if (this._frameSettleTimer) clearTimeout(this._frameSettleTimer);
    // Let the engine finish its own end-of-gesture work (snapping, the note
    // re-selected after a drag, handles put back) before the place is read.
    this._frameSettleTimer = setTimeout(() => {
      this._frameSettleTimer = null;
      if (this._destroyed || this._frameGestures.size || this._frameViewTimer) return;
      // After a move the still frame is always sent, even where the selection
      // came back to the same place, so the host shows its bar again.
      if (this._frameMovingSent) this._frameLastKey = "";
      this._frameMovingSent = false;
      this.emitSelectionFrame(this.getSelectionFrame());
    }, 60);
  }

  /** Send the frame once the current change has settled (coalesced, and only when it changed). */
  private scheduleSelectionFrame(): void {
    if (this._frameQueued || this._destroyed) return;
    this._frameQueued = true;
    queueMicrotask(() => {
      this._frameQueued = false;
      if (this._destroyed) return;
      // While something moves, the frame is sent once it stops.
      if (this._frameGestures.size || this._frameViewTimer || this._frameSettleTimer) return;
      this.emitSelectionFrame(this.getSelectionFrame());
      // Handles drawn a frame later can change the clearance; check once more then.
      if (typeof requestAnimationFrame !== "undefined" && this._frameRecheck === null) {
        this._frameRecheck = requestAnimationFrame(() => {
          this._frameRecheck = null;
          if (this._destroyed || this._frameGestures.size || this._frameViewTimer) return;
          this.emitSelectionFrame(this.getSelectionFrame());
        });
      }
    });
  }

  private emitSelectionFrame(frame: SelectionFrame): void {
    const r = frame.rect;
    const key = [
      frame.kind,
      frame.ids.join(","),
      frame.moving,
      r ? [r.left, r.top, r.width, r.height].map((v) => Math.round(v)).join(",") : "-",
      Math.round(frame.topClearance),
    ].join("|");
    if (key === this._frameLastKey) return;
    this._frameLastKey = key;
    try {
      this.options.events?.onSelectionFrame?.(frame);
    } catch (error) {
      console.warn("SELECTION: onSelectionFrame threw", error);
    }
  }

  /** The notes' (rotated) boxes, together, on screen. */
  private screenRectOfNodes(nodes: Node[]): ScreenRect | null {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const node of nodes) {
      const rb = this.rotatedBounds(node);
      for (const [x, y] of [
        [rb.minX, rb.minY],
        [rb.maxX, rb.minY],
        [rb.maxX, rb.maxY],
        [rb.minX, rb.maxY],
      ]) {
        const p = this.worldToClient({ x, y });
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      }
    }
    if (![minX, minY, maxX, maxY].every(Number.isFinite)) return null;
    return { left: minX, top: minY, right: maxX, bottom: maxY, width: maxX - minX, height: maxY - minY };
  }

  /**
   * Room above the frame taken by the engine's handles: the top connect dot and
   * the rotate handle of one note, or the group's rotate knob. Read from what is
   * drawn when it is there, otherwise from the handles' known offsets.
   */
  private measureTopClearance(nodes: Node[], rect: ScreenRect): number {
    const zoom = this.getZoom?.() || 1;
    let top = Infinity;
    // Only handles drawn just above this selection count (a stale handle elsewhere does not).
    const consider = (el: Element | null | undefined) => {
      if (!el || !(el as any).isConnected) return;
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) return;
      if (r.right < rect.left - 4 || r.left > rect.right + 4) return;
      if (r.top < rect.top - 120 * Math.max(1, zoom) || r.top > rect.bottom) return;
      top = Math.min(top, r.top);
    };
    if (nodes.length === 1) {
      const node: any = nodes[0];
      consider(node.connectionHandles?.top?.node);
      // svg.select draws the rotate handle in its own layer beside the note.
      this.element?.querySelectorAll?.(".svg_select_handle_rot").forEach((el) => consider(el));
    } else if (this.groupResizeRotate) {
      try {
        (this.groupResizeRotate.node as Element).querySelectorAll("circle").forEach((el) => consider(el));
      } catch (e) {
        /* nothing drawn */
      }
    }
    if (Number.isFinite(top) && top < rect.top) return Math.ceil(rect.top - top);
    // Not drawn (yet): the top dot sits 35 world units above the note, 8px tall.
    return nodes.length === 1 ? Math.ceil(35 * zoom + 9) : Math.ceil(28 * zoom + 8);
  }

  /** Deselect a single node. */
  public deselectNode(node: Node) {
    if (this.selectedNodes.includes(node)) {
      console.log("SELECTION_DEBUG: Deselecting node", node.id);
      this.selectedNodes = this.selectedNodes.filter((n) => n !== node);
      node.onDeselected();
      this.putAwaySelectionUi(node);
      this.selectionChanged();

      // Update group resize/rotate
      if (this.selectedNodes.length === 0) {
        this.disableGroupResizeRotate();
      } else {
        this.updateSelectionResizeRotate();
      }
    }
  }

  /**
   * A note's outline, handles, plugs and cog live outside the note, in an overlay
   * the selection pass reaches only through the notes still on the slate. A note
   * leaving the selection (deselected, removed, or replaced by an undo) puts them
   * away itself, or they stay round empty canvas.
   */
  private putAwaySelectionUi(node: Node) {
    try {
      if (node.resizeRotate?.isEnabled?.()) node.resizeRotate.disable();
      if (node.isConnectionHandlesEnabled?.()) node.disableConnectionHandles();
      (node as any).hideNodeCog?.();
    } catch (error) {
      /* its drawing is already gone */
    }
  }

  /** Deselect all currently selected nodes. */
  /** Remove the active line cog + endpoint handles (M1/L1), if any. */
  public clearLineCog(): void {
    if (this._activeLineCog) {
      try {
        this._activeLineCog.remove();
      } catch (e) {
        /* noop */
      }
      this._activeLineCog = undefined;
    }
    if (this._activeLineConnectable) {
      try {
        // Release the pinned endpoint handles so they hide again (Miro-style).
        (this._activeLineConnectable as any)._handlesPinned = false;
        (this._activeLineConnectable as any)._revealHandles?.(false);
        this._activeLineConnectable.deselectConnector?.();
      } catch (e) {
        /* noop */
      }
      this._activeLineConnectable = undefined;
    }
    if (this._selectedLine) {
      this._selectedLine = null;
      this.scheduleSelectionFrame();
    }
  }

  public clearSelection() {
    console.log("SELECTION_DEBUG: Clearing selection");

    // Notify all selected nodes they're being deselected
    this.selectedNodes.forEach((node) => {
      node.onDeselected();
    });

    // Clear the selection array
    if (this.selectedNodes.length) this.selectionChanged();
    this.selectedNodes = [];

    // Disable all resize/rotate controls and connection handles - CENTRALIZED CONTROL
    this.updateSelectionResizeRotate();

    // v1 contract: a group selection ending notifies the host with []
    if (this._hadGroupSelection) {
      this._hadGroupSelection = false;
      this.options.events?.onGroupSelection?.([]);
    }
  }

  /** @returns Array of currently selected nodes. */
  public getSelectedNodes(): Node[] {
    return this.selectedNodes;
  }

  // Backward compatibility
  /** @returns The first selected node, or null if none selected. */
  public getSelectedNode(): Node | null {
    return this.selectedNodes.length > 0 ? this.selectedNodes[0] : null;
  }

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
  private rotatedBounds(node: Node): {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  } {
    const o = node.options;
    const x = o.x || 0;
    const y = o.y || 0;
    const w = o.width || 0;
    const h = o.height || 0;
    const angle = o.rotate?.rotationAngle || 0;
    if (!angle) return { minX: x, minY: y, maxX: x + w, maxY: y + h };
    const cxp = x + w / 2;
    const cyp = y + h / 2;
    const rad = (angle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const corners: number[][] = [
      [x, y],
      [x + w, y],
      [x + w, y + h],
      [x, y + h],
    ];
    for (const [px, py] of corners) {
      const dx = px - cxp;
      const dy = py - cyp;
      const rx = cxp + dx * cos - dy * sin;
      const ry = cyp + dx * sin + dy * cos;
      minX = Math.min(minX, rx);
      minY = Math.min(minY, ry);
      maxX = Math.max(maxX, rx);
      maxY = Math.max(maxY, ry);
    }
    return { minX, minY, maxX, maxY };
  }

  public alignNodes(mode: string, nodes?: Node[]): void {
    const sel = this.freeNodes(nodes || this.getSelectedNodes());
    if (!sel || sel.length < 2) return;
    if (!["left", "right", "centerH", "top", "bottom", "middle"].includes(mode)) return;
    // The shared rule (operations/layout), the one arrange_nodes align-* uses:
    // align by each node's VISUAL (rotation-aware) box and move by a delta on
    // its own position, so a rotation is kept and the edges you see line up.
    this.moveToPositions(sel, alignPositions(mode as AlignMode, sel.map((n) => this.layoutBoxOf(n))));
  }

  /**
   * Evenly distribute the selected (or given) nodes along an axis so the gaps
   * between them are equal; the outermost two stay put. axis: horizontal |
   * vertical. Broadcasts onNodesMove. No-op for < 3 nodes.
   */
  public distributeNodes(axis: string, nodes?: Node[]): void {
    const sel = this.freeNodes(nodes || this.getSelectedNodes());
    if (!sel || sel.length < 3) return;
    if (axis !== "horizontal" && axis !== "vertical") return;
    // The shared rule, the one arrange_nodes distribute-* uses: by each node's
    // VISUAL (rotation-aware) box, so the gaps you SEE come out equal.
    this.moveToPositions(sel, distributePositions(axis, sel.map((n) => this.layoutBoxOf(n))));
  }

  private layoutBoxOf(node: Node): LayoutBox {
    const o = node.options;
    return { id: node.id, x: o.x || 0, y: o.y || 0, width: o.width || 0, height: o.height || 0, rotationAngle: o.rotate?.rotationAngle || 0 };
  }

  private moveToPositions(sel: Node[], positions: Position[]): void {
    positions.forEach((position, index) => sel[index].position(position.x, position.y));
    this.broadcast("onNodesMove", {
      nodeOptions: sel.map((n) => v2NodeToV1(n.options)),
    });
    // The nodes moved — refresh the selection UI so the dashed group outline (and the
    // per-node handles) re-wrap the NEW positions. Without this the outline kept its
    // stale pre-align extent, making aligned nodes look like they'd moved "to the
    // center" of a too-wide box.
    this.updateSelectionResizeRotate();
  }

  // ─── Grouping (Miro-style) ──────────────────────────────────────────
  //
  // A group is simply a set of nodes sharing a `groupId`. There is NO reparenting:
  // nodes stay in the canvas, so connectors/serialization are untouched. Group
  // behaviour is layered on the existing multi-selection machinery — selecting a
  // member selects all members, and drag/rotate/lock then act on the whole set.

  /** All nodes belonging to the given groupId (empty if none/falsy). */
  public getGroupMembers(groupId: string | null | undefined): Node[] {
    if (!groupId) return [];
    return this.nodes.allNodes.filter(
      (n) => (n.options.groupId as string) === groupId
    );
  }

  /** The groupId of a node, or null if it isn't grouped. */
  public getGroupIdOf(node: Node): string | null {
    return (node?.options?.groupId as string) || null;
  }

  /** True if the node is a member of any group. */
  public isGrouped(node: Node): boolean {
    return !!this.getGroupIdOf(node);
  }

  /** The groupId currently entered for member editing, or null. */
  public getEnteredGroupId(): string | null {
    return this.enteredGroupId;
  }

  /**
   * Expand a node list to include every group-mate of any grouped node in it
   * (deduped, order-stable). Used so lock/rotate/etc. apply to whole groups.
   */
  private expandToGroups(nodes: Node[]): Node[] {
    const out = new Map<string, Node>();
    nodes.forEach((n) => {
      out.set(n.id, n);
      const g = this.getGroupIdOf(n);
      if (g) this.getGroupMembers(g).forEach((m) => out.set(m.id, m));
    });
    return [...out.values()];
  }

  /**
   * Group the selected (or given) nodes into ONE group so they select/move/rotate/
   * lock as a unit. Assigns a fresh groupId to every member (flattening any prior
   * groups in the selection into the new one, Miro-style). Persists via onNodesMove
   * and re-selects the whole new group. No-op for < 2 nodes.
   * @returns the new groupId, or null if nothing was grouped.
   */
  public groupNodes(nodes?: Node[]): string | null {
    const sel = this.freeNodes(nodes || this.getSelectedNodes()).slice();
    if (sel.length < 2) return null;
    const gid = "grp-" + guid(8);
    sel.forEach((n) => {
      n.options.groupId = gid;
    });
    this.enteredGroupId = null;
    this.broadcast("onNodesMove", {
      nodeOptions: sel.map((n) => v2NodeToV1(n.options)),
    });
    // Re-select as a group (single outline, no per-node handles).
    this.selectNodes(sel);
    return gid;
  }

  /**
   * Ungroup: dissolve every group represented in the selected (or given) nodes by
   * clearing each member's groupId. Persists and keeps the nodes multi-selected.
   */
  public ungroupNodes(nodes?: Node[]): void {
    const sel = this.freeNodes(nodes || this.getSelectedNodes());
    const gids = new Set<string>();
    sel.forEach((n) => {
      const g = this.getGroupIdOf(n);
      if (g) gids.add(g);
    });
    if (!gids.size) return;
    const affected: Node[] = [];
    gids.forEach((g) => {
      this.getGroupMembers(g).forEach((m) => {
        m.options.groupId = undefined;
        affected.push(m);
      });
    });
    this.enteredGroupId = null;
    this.broadcast("onNodesMove", {
      // Use an explicit null tombstone in the collaboration package. JSON/Yjs
      // transports may omit `undefined`, which would leave peers in the old
      // group forever instead of clearing it.
      nodeOptions: affected.map((n) => ({
        ...v2NodeToV1(n.options),
        groupId: null,
      })),
    });
    this.selectNodes(affected);
  }

  /**
   * Lock the selected (or given) nodes — and, for any grouped node, its whole
   * group — disabling drag/resize. Persists via onNodesMove.
   */
  public lockNodes(nodes?: Node[]): void {
    const targets = this.freeNodes(this.expandToGroups(nodes || this.getSelectedNodes()));
    if (!targets.length) return;
    targets.forEach((n) => n.lock());
    this.broadcast("onNodesMove", {
      nodeOptions: targets.map((n) => v2NodeToV1(n.options)),
    });
    this.updateSelectionResizeRotate();
  }

  /** Unlock the selected (or given) nodes and their groups. */
  public unlockNodes(nodes?: Node[]): void {
    const targets = this.freeNodes(this.expandToGroups(nodes || this.getSelectedNodes()));
    if (!targets.length) return;
    targets.forEach((n) => n.unlock());
    this.broadcast("onNodesMove", {
      nodeOptions: targets.map((n) => v2NodeToV1(n.options)),
    });
    this.updateSelectionResizeRotate();
  }

  /** True if every given (or selected) node is locked. */
  public isSelectionLocked(nodes?: Node[]): boolean {
    const t = nodes || this.getSelectedNodes();
    return t.length > 0 && t.every((n) => !!n.options.isLocked);
  }

  /**
   * Enter a group for individual-member editing (Miro double-click-into-group).
   * Selects `member` if given, else the first member. While entered, clicking a
   * member selects just that member instead of the whole group.
   */
  public enterGroup(groupId: string, member?: Node): void {
    const members = this.getGroupMembers(groupId);
    if (!members.length) return;
    this.enteredGroupId = groupId;
    this.selectNodes([member && members.includes(member) ? member : members[0]]);
  }

  /** Exit the currently-entered group and re-select it as a whole. */
  public exitGroup(): void {
    const gid = this.enteredGroupId;
    this.enteredGroupId = null;
    if (!gid) return;
    const members = this.getGroupMembers(gid);
    if (members.length) this.selectNodes(members);
  }

  // ─── Governed notes (host drag policies) ─────────────────────────────

  /**
   * Register a host policy for some notes (see {@link DragPolicy}). The policy says
   * which notes it governs and what a person may do to each; it is asked before a
   * governed note is dragged, while it moves, and when it is released.
   *
   * @returns a function that removes the policy and returns its notes to ordinary behaviour.
   */
  public setDragPolicy(policy: DragPolicy): () => void {
    if (!policy || typeof policy.governs !== "function" || typeof policy.onEnd !== "function") {
      throw new Error("A drag policy needs governs() and onEnd().");
    }
    if (!this._dragPolicies.includes(policy)) this._dragPolicies.push(policy);
    this.refreshGovernance();
    let removed = false;
    return () => {
      if (removed) return;
      removed = true;
      if (this._governedDragNode && this.governanceOf(this._governedDragNode)?.policy === policy) {
        this.cancelGovernedDrag("host");
      }
      this._dragPolicies = this._dragPolicies.filter((p) => p !== policy);
      this.refreshGovernance();
    };
  }

  /** The policy governing `node` and the note's capabilities, or null for an ordinary note. */
  public governanceOf(node: Node | null | undefined): NodeGovernance | null {
    if (!node || this._dragPolicies.length === 0) return null;
    return resolveGovernance(this._dragPolicies, node);
  }

  /**
   * What may be done to `node` right now. Ordinary notes can do everything; so can
   * governed notes while their host is changing them (withPolicyAuthority).
   */
  public capabilitiesOf(node: Node | null | undefined): Readonly<NodeCapabilities> {
    if (this._dragPolicies.length === 0 || this._policyAuthority > 0) return FREE_NODE;
    return this.governanceOf(node)?.capabilities ?? FREE_NODE;
  }

  /** True for a governed note that is a drawing of host state (left out of saves and undo). */
  public isDerivedNode(node: Node | null | undefined): boolean {
    const governance = this.governanceOf(node);
    return !!governance && !governance.capabilities.persist;
  }

  /** The notes among `nodes` (default: all) that no policy governs. */
  public freeNodes(nodes?: Node[]): Node[] {
    const list = nodes ?? this.nodes.allNodes;
    if (this._dragPolicies.length === 0) return list;
    return list.filter((n) => !this.governanceOf(n));
  }

  /**
   * Run `fn` as the host that owns the governed notes: capability checks pass
   * (the host may remove or connect its own notes) and nothing is broadcast.
   */
  public withPolicyAuthority<T>(fn: () => T): T {
    this._policyAuthority++;
    try {
      return fn();
    } finally {
      this._policyAuthority--;
    }
  }

  /** End a governed drag in progress as a refusal. Returns whether there was one. */
  public cancelGovernedDrag(reason: DragCancelReason = "host"): boolean {
    const node: any = this._governedDragNode;
    if (!node || typeof node.cancelGovernedDrag !== "function") return false;
    return node.cancelGovernedDrag(reason);
  }

  /**
   * Re-apply what governance shows on each note (cursor, focusability, pointer
   * input). Call it after a policy starts or stops claiming notes.
   */
  public refreshGovernance(): void {
    this.nodes?.allNodes.forEach((node: any) => node.applyGovernance?.());
    const selectable = this.selectedNodes.filter((n) => this.capabilitiesOf(n).canSelect);
    if (selectable.length !== this.selectedNodes.length) this.selectionChanged();
    this.selectedNodes = selectable;
    if (this.selectedNodes.length) this.updateSelectionResizeRotate();
  }

  /**
   * Take the inline edit in progress, if any, before a load replaces every note
   * (loadJSON, or an undo or redo, this person's or someone else's): the load
   * destroys the note being edited and its editor with it. Give the result to
   * {@link resumeInlineDraft} once the load has finished.
   */
  public takeInlineDraft(): { id: string; draft: InlineDraft } | null {
    for (const node of this.nodes?.allNodes ?? []) {
      const draft = (node as any).editor?.draft?.();
      if (draft) return { id: node.id, draft };
    }
    return null;
  }

  /**
   * Open the edit taken by {@link takeInlineDraft} again on the note's new copy,
   * with the text typed so far and the caret where it was, so the person goes on
   * typing as if nothing had happened. Nothing is opened when the note is gone,
   * or when an edit is already open elsewhere.
   */
  public resumeInlineDraft(saved: { id: string; draft: InlineDraft } | null): boolean {
    if (!saved || this._destroyed) return false;
    const node: any = this.nodes?.one?.(saved.id);
    if (!node?.editor || node.editor.isInlineEditing?.()) return false;
    if (this.nodes.allNodes.some((n: any) => n.editor?.isInlineEditing?.())) return false;
    const { text, selection, returnFocus } = saved.draft;
    return node.editor.startInline({ text, selection: selection ?? { start: text.length, end: text.length }, returnFocus, preventScroll: true }) === true;
  }

  /**
   * Show the policies an ordinary note on the move (see DragPolicy.onFreeMove). Only a
   * single ordinary note is offered; a group drag and a governed note are not.
   */
  public offerFreeMove(node: Node, point: WorldPoint): void {
    if (!this._dragPolicies.length || this.governanceOf(node)) return;
    for (const policy of this._dragPolicies.slice()) {
      try {
        policy.onFreeMove?.(node, point);
      } catch (error) {
        console.warn("DRAG_POLICY: onFreeMove threw", error);
      }
    }
  }

  /**
   * Offer a dropped ordinary note to the policies (see DragPolicy.onFreeDrop). The first
   * that takes or refuses it decides; with none, the drop is an ordinary move.
   */
  public offerFreeDrop(node: Node, point: WorldPoint, from: WorldPoint): "taken" | "refused" | null {
    if (!this._dragPolicies.length || this.governanceOf(node)) return null;
    for (const policy of this._dragPolicies.slice()) {
      let verdict: "taken" | "refused" | void = undefined;
      try {
        verdict = policy.onFreeDrop?.(node, point, from);
      } catch (error) {
        console.warn("DRAG_POLICY: onFreeDrop threw; the drop stays an ordinary move", error);
      }
      if (verdict === "taken" || verdict === "refused") return verdict;
    }
    return null;
  }

  /**
   * Offer several ordinary notes dropped together to the policies (see
   * DragPolicy.onFreeGroupDrop). The first that takes or refuses them decides; with none,
   * the drop is an ordinary move.
   */
  public offerFreeGroupDrop(nodes: Node[], point: WorldPoint, from?: WorldPoint[]): "taken" | "refused" | null {
    if (!this._dragPolicies.length || nodes.some((node) => this.governanceOf(node))) return null;
    for (const policy of this._dragPolicies.slice()) {
      let verdict: "taken" | "refused" | void = undefined;
      try {
        verdict = policy.onFreeGroupDrop?.(nodes, point, from);
      } catch (error) {
        console.warn("DRAG_POLICY: onFreeGroupDrop threw; the drop stays an ordinary move", error);
      }
      if (verdict === "taken" || verdict === "refused") return verdict;
    }
    return null;
  }

  /** Tell the policies an ordinary note's words were committed (see DragPolicy.onFreeTextCommit). */
  public offerFreeTextCommit(node: Node): void {
    if (!this._dragPolicies.length || this.governanceOf(node)) return;
    for (const policy of this._dragPolicies.slice()) {
      try {
        policy.onFreeTextCommit?.(node);
      } catch (error) {
        console.warn("DRAG_POLICY: onFreeTextCommit threw", error);
      }
    }
  }

  /** What each policy keeps with an undo record (see DragPolicy.undoState). Null when none keeps anything. */
  public undoHostState(): Map<DragPolicy, unknown> | null {
    const kept = new Map<DragPolicy, unknown>();
    for (const policy of this._dragPolicies) {
      if (typeof policy.undoState !== "function") continue;
      try {
        kept.set(policy, policy.undoState());
      } catch (error) {
        console.warn("DRAG_POLICY: undoState threw", error);
      }
    }
    return kept.size ? kept : null;
  }

  /** This person's undo or redo went back to a record: hand each policy what it kept with it. */
  public restoreUndoHostState(state: unknown, notes: { added: string[]; removed: string[] }): void {
    const kept = state instanceof Map ? state : null;
    for (const policy of this._dragPolicies.slice()) {
      if (typeof policy.onUndoRestore !== "function") continue;
      try {
        policy.onUndoRestore(kept?.get(policy), notes);
      } catch (error) {
        console.warn("DRAG_POLICY: onUndoRestore threw", error);
      }
    }
  }

  /**
   * A host is about to change its own state and the drawing together as one step (a
   * note becoming one of its governed notes, or the other way round). Records any edit
   * still waiting to be recorded as its own step, and brings what the host keeps with
   * the current record up to date, so an undo goes back to exactly this moment.
   */
  public beginHostStep(): void {
    this.undoRedo?.flushPending?.();
    this.undoRedo?.refreshHostState?.();
  }

  /** Record the step begun with {@link beginHostStep} once its changes are made. */
  public endHostStep(): void {
    this.undoRedo?.snapAfterGesture?.();
  }

  /** Tell each policy that loadJSON / undo / redo replaced the slate's notes. */
  public notifyNotesReplaced(): void {
    if (this._dragPolicies.length === 0) {
      this.dropReplacedFromSelection();
      return;
    }
    // Governed notes that were selected are gone, but the selection still holds
    // them. Once their policy forgets them they would pass for ordinary notes
    // (Ctrl+D would copy a card into the saved drawing), so they leave the selection.
    const gone = this.selectedNodes.filter(
      (n) => this.nodes.one(n.id) !== n && !!this.governanceOf(n)
    );
    for (const policy of this._dragPolicies.slice()) {
      try {
        policy.onNotesReplaced?.();
      } catch (error) {
        console.warn("DRAG_POLICY: onNotesReplaced threw", error);
      }
    }
    if (gone.length && this.selectedNodes.some((n) => gone.includes(n))) {
      this.selectedNodes = this.selectedNodes.filter((n) => !gone.includes(n));
      this.selectionChanged();
      for (const node of gone) {
        try {
          node.onDeselected();
        } catch (error) {
          /* its drawing is already gone */
        }
        this.putAwaySelectionUi(node);
      }
      try {
        this.updateSelectionResizeRotate();
      } catch (error) {
        /* nothing left to outline */
      }
    }
    this.dropReplacedFromSelection();
  }

  /**
   * loadJSON, undo and redo replace every note by a new one, even where the id
   * stays the same. A selection kept across that holds notes that are no longer
   * on the slate: nothing shows as selected, yet Delete still acts on them, and
   * the next selection change tries to draw connectors for a note that is gone
   * ("Cannot read properties of null (reading 'screenCTM')"). Notes that were
   * replaced leave the selection.
   */
  private dropReplacedFromSelection(): void {
    const kept = this.selectedNodes.filter((n) => this.nodes.one(n.id) === n);
    if (kept.length === this.selectedNodes.length) return;
    for (const node of this.selectedNodes) if (!kept.includes(node)) this.putAwaySelectionUi(node);
    this.selectedNodes = kept;
    this.selectionChanged();
    try {
      this.updateSelectionResizeRotate();
    } catch (error) {
      /* nothing left to outline */
    }
    if (this._hadGroupSelection && kept.length < 2) {
      this._hadGroupSelection = false;
      this.options.events?.onGroupSelection?.([]);
    }
  }

  /**
   * Remove governed notes from a change package, or return null when nothing is
   * left of it. Used for packages leaving this slate (broadcast) and arriving from
   * collaborators, so a governed note is changed only by its host.
   */
  public screenGovernedPackage(
    type: string,
    data: Record<string, any> | any[] | undefined
  ): any {
    // A package with no data names no note, so there is nothing to screen. It is
    // never the "nothing left" answer (null), whatever its sender passed as data.
    if (!data) return undefined;
    if (this._dragPolicies.length === 0) return data;
    const governed = (id: unknown) =>
      typeof id === "string" && !!this.governanceOf(this.nodes.one(id));
    if (Array.isArray(data)) {
      const kept = data.filter((entry) => !governed(entry?.id));
      return kept.length ? (kept.length === data.length ? data : kept) : null;
    }
    if (type === "addRelationship" || type === "removeRelationship") {
      return governed(data.parentId) || governed(data.childId) ? null : data;
    }
    let out = data;
    for (const key of ["nodeOptions", "nodes"] as const) {
      const list = out[key];
      if (Array.isArray(list)) {
        const kept = list.filter((entry: any) => !governed(entry?.id));
        if (kept.length === list.length) continue;
        if (!kept.length) return null;
        out = { ...out, [key]: kept };
      } else if (list && typeof list === "object" && governed(list.id)) {
        return null;
      }
    }
    if (/^onNode|^onLine/.test(type) && governed(out.id)) return null;
    return out;
  }

  /** A note arrived and is drawn: each policy hears of it (DragPolicy.onNodeAdded). */
  public nodeAdded(node: Node): void {
    if (this._destroyed) return;
    for (const policy of this._dragPolicies.slice()) {
      if (typeof policy.onNodeAdded !== "function") continue;
      try {
        policy.onNodeAdded(node);
      } catch (error) {
        console.warn("DRAG_POLICY: onNodeAdded threw", error);
      }
    }
  }

  /** Hand a line change that touches a governed note to the policy that governs it (once per policy). */
  private offerGovernedLine(type: string, data: any): void {
    if (type !== "addRelationship" && type !== "removeRelationship" && type !== "onLinePropertiesChanged") return;
    const ids: unknown[] = type === "onLinePropertiesChanged"
      ? (Array.isArray(data) ? data : [data]).map((item: any) => item?.id)
      : [data?.parentId, data?.childId];
    const told = new Set<DragPolicy>();
    for (const id of ids) {
      const governance = typeof id === "string" ? this.governanceOf(this.nodes.one(id)) : null;
      if (!governance || told.has(governance.policy)) continue;
      told.add(governance.policy);
      try {
        governance.policy.onLine?.(type, data);
      } catch (error) {
        console.warn("DRAG_POLICY: onLine threw", error);
      }
    }
  }

  /** Keep governed and decoration notes out of selections they may not join. */
  private screenSelection(
    nodes: Node[],
    addToSelection: boolean
  ): { nodes: Node[]; addToSelection: boolean } {
    nodes = nodes.filter((n) => this.capabilitiesOf(n).canSelect);
    if (this._policyAuthority > 0) return { nodes, addToSelection };
    const isGoverned = (n: Node) => !!this.governanceOf(n);
    if (nodes.length > 1) {
      // Marquee, select-all and programmatic multi-selects pick ordinary notes only.
      nodes = nodes.filter((n) => !isGoverned(n));
    } else if (nodes.length === 1 && isGoverned(nodes[0])) {
      addToSelection = false;
    }
    if (addToSelection && this.selectedNodes.some(isGoverned)) addToSelection = false;
    return { nodes, addToSelection };
  }

  // ─── Coordinates and hit testing ────────────────────────────────────

  /** Convert a point on screen (clientX/clientY) to world coordinates. */
  public clientToWorld(point: { x: number; y: number }): WorldPoint {
    const p = (this.canvas as any).point(point.x, point.y);
    return { x: p.x, y: p.y };
  }

  /** Convert a world point to screen (client) coordinates, through the current pan and zoom. */
  public worldToClient(point: WorldPoint): { x: number; y: number } {
    const svg = this.canvas.node as SVGSVGElement;
    const m = svg.getScreenCTM?.();
    if (!m) return { x: point.x, y: point.y };
    return {
      x: m.a * point.x + m.c * point.y + m.e,
      y: m.b * point.x + m.d * point.y + m.f,
    };
  }

  /**
   * The topmost note under a world point, by each note's (rotated) box.
   *
   * @param point  world coordinates (see clientToWorld)
   * @param nodes  the notes to consider; defaults to every note on the slate
   * @param options.padding  extra world units around each box that still count
   * @param options.exclude  a note to ignore (for example the one being dragged)
   */
  public hitTestNodes(
    point: WorldPoint,
    nodes?: Node[],
    options: { padding?: number; exclude?: Node | null } = {}
  ): Node | null {
    const list = (nodes ?? this.nodes.allNodes).filter((n) => n && n !== options.exclude);
    return hitTestNodeBoxes(point, list, options.padding ?? 0);
  }

  // ─── Serialization API ──────────────────────────────────────────────

  /**
   * Export the slate to a JSON string in v1-compatible format.
   *
   * @param nodes - Optional subset of nodes to include
   * @param asPresentation - If true, includes presentation ordering
   * @returns JSON string
   */
  public exportJSON(nodes?: Node[], asPresentation?: boolean): string {
    const json = serialize(this, nodes, asPresentation);
    return JSON.stringify(json);
  }

  /**
   * Load a v1-compatible JSON string or object into this slate.
   *
   * @param json - JSON string or SlateJSON object
   * @param preserve - If true, merge with existing nodes instead of replacing
   * @param skipZoom - If true, don't adjust zoom/pan after load
   * @param useMainCanvas - Reserved for future use
   */
  public async loadJSON(
    json: string | SlateJSON,
    preserve: boolean = false,
    skipZoom: boolean = false,
    useMainCanvas?: boolean
  ): Promise<void> {
    await deserialize(json, this, preserve, skipZoom);
    this.collab?.documentLoaded?.();
    // Baseline snapshot of the loaded document so the first edit is undoable.
    this.undoRedo?.clear?.();
    this.undoRedo?.snap?.(true);
  }

  /**
   * Take a snapshot of the current slate state.
   * Used by undo/redo system.
   *
   * @returns SlateJSON object (not stringified)
   */
  public snapshot(): SlateJSON {
    return takeSnapshot(this);
  }

  // ─── Export API ─────────────────────────────────────────────────

  /**
   * Export the slate as an SVG string.
   */
  public svg(
    opts?: ExportOptions,
    callback?: (svg: string) => void
  ): string {
    return exportSVG(this, opts, callback);
  }

  /**
   * Export the slate as a PNG (async).
   */
  public async png(
    opts?: ExportOptions,
    callback?: (result: string | Blob) => void
  ): Promise<string | Blob> {
    return exportPNG(this, opts, callback);
  }

  /**
   * Synchronous-style PNG export (returns a Promise).
   * Alias for png() for v1 compatibility.
   */
  public pngSync(opts?: ExportOptions): Promise<string | Blob> {
    return this.png(opts);
  }

  // ─── Theme API ──────────────────────────────────────────────────

  /** Apply a theme to this slate */
  public applyTheme(
    theme: ThemeDefinition,
    syncWithTheme?: boolean,
    revertTheme?: boolean
  ): void {
    applyTheme(this, theme, syncWithTheme, revertTheme);
  }

  // ─── Layout API ─────────────────────────────────────────────────

  /** Remove overlapping nodes by pushing them apart */
  /** Optimize Layout: the shared tidy layout over the slate's notes, saved as one move. */
  public removeLayoutOverlaps(gap?: number): void {
    removeLayoutOverlaps(this, gap);
  }

  /** Apply pre-computed layout moves */
  public applyLayout(
    moves: LayoutMove[],
    cb?: () => void,
    noAnimation?: boolean
  ): void {
    applyLayoutMoves(this, moves, cb, noAnimation);
  }

  /** Package current node positions for layout transfer */
  public packageLayout(): LayoutMove[] {
    return packageLayout(this);
  }

  // ─── Lock display API ───────────────────────────────────────────

  /** Show lock icons on all locked nodes */
  public displayLocks(): void {
    this.nodes.allNodes.forEach((node: Node) => {
      if (node.options.isLocked) {
        // Visual lock indicator could be added here
        console.log("LOCK_DEBUG: Displaying lock for", node.id);
      }
    });
  }

  /** Hide all lock icons */
  public hideLocks(): void {
    console.log("LOCK_DEBUG: Hiding all locks");
  }

  // ─── Font loading ───────────────────────────────────────────────

  /** Load all fonts used by nodes in this slate */
  public async loadAllFonts(): Promise<void> {
    await loadAllFontsForSlate(this);
  }
}
