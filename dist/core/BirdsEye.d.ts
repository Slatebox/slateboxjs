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
    constructor(slate: Slate, options?: BirdsEyeOptions);
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    refresh(): void;
    updateViewport(): void;
    updateNodePosition(node: Node): void;
    /**
     * Q4: tween a minimap shape to (x,y) with a short easeInOutQuad rAF animation,
     * cancelling any in-flight tween so it retargets smoothly (e.g. during a drag).
     */
    private animateShapeMove;
    addNodeShape(node: Node): void;
    removeNodeShape(nodeId: string): void;
    private createContainer;
    private createMiniCanvas;
    private renderNodes;
    private createViewportIndicator;
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
