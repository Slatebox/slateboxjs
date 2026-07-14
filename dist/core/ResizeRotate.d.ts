import type { Node } from "./Node";
/**
 * Compute the L-bracket polyline points for one svg.select.js resize handle.
 * Mirrors svg.select.js' default updateHandle, but guards the divide-by-distance
 * (adjacent handle points can transiently coincide → r/c = 0 → NaN) and returns
 * `null` when any input/result is non-finite so the caller skips the plot. This
 * is what kept multi-select (Cmd+A/Cmd+D) from flooding the console with
 * "<polyline> points: Expected number, NaN" errors.
 */
export declare function computeSelectHandlePlot(point: [number, number], prev: [number, number], next: [number, number]): Array<[number, number]> | null;
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
