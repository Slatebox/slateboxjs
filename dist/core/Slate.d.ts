import { Svg } from "@svgdotjs/svg.js";
import { Node } from "./Node";
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
import { Collab } from "./Collab";
import { type ThemeDefinition } from "./Theme";
import { type LayoutMove } from "./Layout";
import { ZoomSlider } from "./ZoomSlider";
import { Presentation } from "./Presentation";
export interface SlateEvents {
    onSlateChanged?: (pkg: any, collabUsers?: any[]) => void;
    onInitCollaboration?: (clientID: string) => void;
    onTextPaneRequested?: (node: any, cb: Function) => void;
    onLineMenuRequested?: (node: any, association: any, cb: Function) => void;
    onTakeSnapshot?: (opts?: any) => void;
    onConfirmRequested?: (title: string, msg: string, cb: Function) => void;
    onCollaborationUsersChanged?: (users: any[]) => void;
    onCollaborationUsersRemoved?: (users: any[]) => void;
    onCollaboration?: (pkg: any) => void;
    onNodeDragged?: (node: any, evt: any) => void;
    onCanvasClicked?: (evt: any) => void;
    onImagesRequested?: (opts: any) => void;
    onRequestSave?: (opts?: any) => void;
    onCreateImage?: (opts: any, cb: Function) => void;
    onMenuRequested?: (node: any, cb: Function) => void;
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
    private selectedNodes;
    private groupResizeRotate;
    private _coordinateIntervalId;
    constructor(element: string | HTMLElement, options?: SlateOptions);
    private init;
    private setupCoordinateCallbacks;
    private addCoordinateDisplay;
    private startCoordinatePolling;
    private updateCoordinateDisplay;
    private makeResponsive;
    addNode(options?: any): Node;
    removeNode(id: string): boolean;
    /**
     * Notify that a node has changed (position, rotation, added, removed)
     * This triggers BirdsEye refresh if enabled
     */
    notifyNodeChanged(node?: Node): void;
    getNode(id: string): Node | undefined;
    getAllNodes(): Node[];
    getViewport(): any;
    getViewportAsync(): Promise<any>;
    enablePanZoom(): void;
    disablePanZoom(): void;
    enablePan(): void;
    disablePan(): void;
    enableZoom(): void;
    disableZoom(): void;
    pan(point: {
        x: number;
        y: number;
    }): void;
    panBy(delta: {
        x: number;
        y: number;
    }): void;
    zoom(level: number): void;
    zoomBy(factor: number): void;
    zoomIn(): void;
    zoomOut(): void;
    zoomAtPoint(level: number, point: {
        x: number;
        y: number;
    }): void;
    resetPanZoom(): void;
    resetZoom(): void;
    resetPan(): void;
    fitToContent(): void;
    centerContent(): void;
    getZoom(): number;
    getPan(): {
        x: number;
        y: number;
    };
    resizePanZoom(): void;
    private setupSelectionHandling;
    selectNodes(nodes: Node[], addToSelection?: boolean): void;
    updateSelectionResizeRotate(): void;
    enableNodeResizeRotate(node: Node): void;
    disableNodeResizeRotate(node: Node): void;
    private disableGroupResizeRotate;
    private createGroupResizeRotate;
    private calculateGroupBoundingBox;
    private createGroupHandle;
    private updateGroupHandle;
    private handleGroupResize;
    private handleGroupRotate;
    selectNode(node: Node): void;
    deselectNode(node: Node): void;
    clearSelection(): void;
    getSelectedNodes(): Node[];
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
