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
    private _endTimer?;
    private _start?;
    private _rot?;
    private _readout;
    private _cancelled;
    private _keyCommitTimer?;
    private _keyPending;
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
    /** The rotate knob's group in the overlay, if drawn. */
    private knobElement;
    /**
     * The knob is a keyboard control too: Tab reaches it, arrows turn the note by 1°
     * (Shift: to the next 15°), Home puts it back to 0°. It handles its own keys so
     * the canvas's arrow-key nudge never sees them.
     */
    private wireKnobKeyboard;
    /** Move keyboard focus to the rotate knob, if it is drawn and usable. */
    focusKnob(): boolean;
    /** Turn the note from the keyboard now; save it when the key is released or after a pause. */
    private previewKeyRotation;
    /** Save the keyboard's pending turn as one step (broadcast + announce), if there is one. */
    private commitKeyRotation;
    /** Turn the note to an absolute angle as one finished step (keyboard). */
    rotateTo(angle: number): void;
    private overlayScale;
    /** A client point in the canvas's world coordinates (the note's options space). */
    private toWorld;
    /** Keep the selection outline but remove the handles a governed note may not use. */
    private hideHandles;
    /** Disable resize and rotate handles on the node. */
    disable(): void;
    private addEventListeners;
    /**
     * Escape while rotating: put the note back at its start angle and end the gesture
     * without saving (the canvas does not also deselect).
     */
    private onGestureKey;
    private scheduleFinish;
    private finish;
    private removeEventListeners;
    syncOverlay(): void;
    isEnabled(): boolean;
    /** Destroy the resize/rotate instance, disabling all plugins and clearing references */
    destroy(): void;
    updateOptions(options: Partial<ResizeRotateOptions>): void;
    refresh(): void;
}
