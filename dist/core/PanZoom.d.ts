import '@svgdotjs/svg.panzoom.js';
export interface PanZoomOptions {
    enabled?: boolean;
    panning?: boolean;
    pinchZoom?: boolean;
    wheelZoom?: boolean;
    panButton?: number;
    oneFingerPan?: boolean;
    margins?: {
        top?: number;
        left?: number;
        right?: number;
        bottom?: number;
    } | false;
    zoomFactor?: number;
    zoomMin?: number;
    zoomMax?: number;
    wheelZoomDeltaModeLinePixels?: number;
    wheelZoomDeltaModeScreenPixels?: number;
    momentum?: boolean;
    momentumSlowdown?: number;
    showControls?: boolean;
    controlsPosition?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    onPan?: (event: any) => void;
    onZoom?: (event: any) => void;
    onPanStart?: (event: any) => void;
    onPanEnd?: (event: any) => void;
}
export declare class PanZoom {
    private canvas;
    private slate;
    private options;
    private isEnabled;
    private controlsContainer;
    /**
     * Creates the pan/zoom handler. Enables panning and zooming on the canvas.
     *
     * @param slate   - The parent Slate instance
     * @param options - Pan/zoom configuration (zoom factor, min/max, controls, etc.)
     */
    constructor(slate: any, options?: PanZoomOptions);
    private init;
    private createZoomControls;
    private removeZoomControls;
    enable(): void;
    disable(): void;
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
    zoom(level: number, point?: {
        x: number;
        y: number;
    }): void;
    zoomBy(factor: number): void;
    /** Zoom in one step. */
    zoomIn(): void;
    /** Zoom out one step. */
    zoomOut(): void;
    zoomAtPoint(level: number, point: {
        x: number;
        y: number;
    }): void;
    reset(): void;
    /** Container pixel size (the infinite canvas fills its element). */
    private containerPx;
    resetZoom(): void;
    resetPan(): void;
    fit(): void;
    center(): void;
    /** @returns Current zoom level (1 = 100%). */
    getZoom(): number;
    /** @returns Current pan position as { x, y }. */
    getPan(): {
        x: number;
        y: number;
    };
    resize(): void;
    destroy(): void;
    /** @returns Whether pan/zoom is initialized and enabled. */
    isInitialized(): boolean;
    private getAllOptions;
}
