import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";
export interface ResizeRotateOptions {
    resizeEnabled?: boolean;
    rotateEnabled?: boolean;
    preserveAspectRatio?: boolean;
    aroundCenter?: boolean;
    grid?: number;
    degree?: number;
    onResize?: (event: any) => void;
    onRotate?: (event: any) => void;
}
export declare class ResizeRotate {
    private node;
    private target;
    private options;
    private isActive;
    constructor(node: any, options?: ResizeRotateOptions);
    enable(): void;
    /**
     * Make the L-shaped polyline handles easier to grab by setting a wider
     * stroke directly on the SVG elements (overrides CSS from svg.select.js).
     */
    private widenHandleHitAreas;
    disable(): void;
    private addEventListeners;
    private isResizeRotateHandle;
    private removeEventListeners;
    private handleResize;
    isEnabled(): boolean;
    updateOptions(options: Partial<ResizeRotateOptions>): void;
    refresh(): void;
}
