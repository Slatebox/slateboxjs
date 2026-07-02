import "@svgdotjs/svg.select.js";
import "@svgdotjs/svg.resize.js";
import type { Node } from "./Node";
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
    private _interacting;
    private _didRotate;
    private _didResize;
    private _endListener;
    private _preInteractionPos;
    /**
     * Creates resize/rotate handle management for a node.
     *
     * @param node    - The parent Node instance
     * @param options - Resize/rotate configuration
     */
    constructor(node: Node, options?: ResizeRotateOptions);
    /** Enable resize and rotate handles on the node. */
    enable(): void;
    /**
     * Keep svg.select.js' generated control layer non-obscuring and make the
     * L-shaped polyline handles easier to grab. These inline attributes are
     * intentional because consumers can use the built JS without loading CSS.
     */
    private styleSelectionUi;
    /** Disable resize and rotate handles on the node. */
    disable(): void;
    private addEventListeners;
    private isResizeRotateHandle;
    private removeEventListeners;
    private handleResize;
    isEnabled(): boolean;
    /** Destroy the resize/rotate instance, disabling all plugins and clearing references */
    destroy(): void;
    updateOptions(options: Partial<ResizeRotateOptions>): void;
    refresh(): void;
}
