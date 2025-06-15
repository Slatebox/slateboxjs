export interface PanZoomOptions {
    enabled?: boolean;
    panEnabled?: boolean;
    zoomEnabled?: boolean;
    controlIconsEnabled?: boolean;
    dblClickZoomEnabled?: boolean;
    mouseWheelZoomEnabled?: boolean;
    zoomScaleSensitivity?: number;
    minZoom?: number;
    maxZoom?: number;
    fit?: boolean;
    center?: boolean;
    onPan?: (event: any) => void;
    onZoom?: (event: any) => void;
}
export declare class PanZoom {
    private panZoomInstance;
    private slate;
    private options;
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
    zoom(level: number): void;
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
}
