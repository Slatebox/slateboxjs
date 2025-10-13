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
    constructor(slate: any, options?: PanZoomOptions);
    private init;
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
    zoomIn(): void;
    zoomOut(): void;
    zoomAtPoint(level: number, point: {
        x: number;
        y: number;
    }): void;
    reset(): void;
    resetZoom(): void;
    resetPan(): void;
    fit(): void;
    center(): void;
    getZoom(): number;
    getPan(): {
        x: number;
        y: number;
    };
    resize(): void;
    destroy(): void;
    isInitialized(): boolean;
    private getAllOptions;
}
