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
    private _wheelHandler;
    /**
     * Miro-style wheel behavior on the canvas:
     *  - two-finger trackpad scroll (plain wheel) → PAN
     *  - ctrl/⌘ + wheel (pinch on trackpads, or modifier + wheel) → ZOOM at
     *    the cursor
     * Works directly on the viewBox so it's consistent with the infinite
     * canvas and independent of the plugin's wheel logic.
     */
    private attachWheelHandler;
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
    getViewportSize(): {
        w: number;
        h: number;
    };
    resetZoom(): void;
    resetPan(): void;
    fit(): void;
    /**
     * Show a region of the world at the largest scale at which its whole width is
     * visible, up to `maxZoom` (100% unless the host allows more, as a phone does to
     * fill its width with one lane), with `padding` world units of room at each side.
     * A region shorter than the canvas is centred in it; a taller one starts at the
     * top and the rest is reached by panning.
     */
    fitWidth(region: {
        x: number;
        y: number;
        width: number;
        height: number;
    }, padding?: number, maxZoom?: number): void;
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
