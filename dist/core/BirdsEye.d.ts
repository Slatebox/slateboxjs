import type { Slate } from "./Slate";
import type { Node } from "./Node";
export interface BirdsEyeOptions {
    enabled?: boolean;
    position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
    width?: number;
    height?: number;
    backgroundColor?: string;
    viewportColor?: string;
    viewportBorderColor?: string;
    nodeColor?: string;
    borderRadius?: number;
    margin?: number;
    showZoomControls?: boolean;
}
export declare class BirdsEye {
    private slate;
    private options;
    private container;
    private miniCanvas;
    private viewportIndicator;
    /**
     * Every note thumbnail lives in this group, drawn BEFORE the viewport rectangle and
     * excluded from hit-testing, so the rectangle is always the top layer: lanes, cards
     * and notes never cover it or swallow a press on it, however often they re-render.
     */
    private nodeLayer;
    private nodeShapes;
    private _enabled;
    private isDragging;
    private scale;
    private dragStartX;
    private dragStartY;
    private viewportStartX;
    private viewportStartY;
    private zoomControlsContainer;
    private boundMouseMove;
    private boundMouseUp;
    private boundTouchMove;
    private boundTouchEnd;
    constructor(slate: Slate, options?: BirdsEyeOptions);
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    refresh(): void;
    updateViewport(): void;
    updateNodePosition(node: Node): void;
    /**
     * Rotate a minimap shape to match the node's rotation, about its center.
     * Absolute (transform, not the relative .rotate()) so repeated updates don't
     * accumulate. Position (x/y attrs from move) is unaffected.
     */
    private applyShapeRotation;
    /**
     * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
     * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
     */
    private animateShapeMove;
    addNodeShape(node: Node): void;
    /** The viewport rectangle is the last thing painted in the minimap. */
    private keepIndicatorOnTop;
    removeNodeShape(nodeId: string): void;
    private createContainer;
    private createMiniCanvas;
    private renderNodes;
    private createViewportIndicator;
    private beginDrag;
    /** Center the view on a point of the minimap. */
    private jumpTo;
    private removeTouchDragListeners;
    private handleMouseMove;
    private handleMouseUp;
    private setupEventListeners;
    private refreshTimeoutId;
    /**
     * Schedule a refresh using trailing-edge debounce.
     * Waits until events settle (300ms of no activity) before refreshing.
     * This avoids unnecessary updates during continuous operations like rotation.
     */
    scheduleRefresh(): void;
    private removeEventListeners;
    private pollIntervalId;
    private startPolling;
    private stopPolling;
    private createZoomControls;
    private getZoomButtonStyle;
    private updateZoomDisplay;
    private zoomDisplayIntervalId;
    private startZoomDisplayUpdates;
    private removeZoomControls;
    private calculateContentBounds;
}
