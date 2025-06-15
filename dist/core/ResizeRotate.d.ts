import '@svgdotjs/svg.select.js';
import '@svgdotjs/svg.resize.js';
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
    private options;
    private isActive;
    constructor(node: any, options?: ResizeRotateOptions);
    enable(): void;
    disable(): void;
    private addEventListeners;
    private removeEventListeners;
    private handleResize;
    private handleRotate;
    private updateBackground;
    isEnabled(): boolean;
    updateOptions(options: Partial<ResizeRotateOptions>): void;
}
