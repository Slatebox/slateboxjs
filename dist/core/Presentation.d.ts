/**
 * Presentation.ts - Step-through presentation mode
 *
 * Allows stepping through nodes in order, zooming/panning to each.
 */
export interface PresentationStep {
    nodeId: string;
    index: number;
}
export declare class Presentation {
    private slate;
    private steps;
    private currentStep;
    private isActive;
    /** Zoom level applied when focusing a step's node. */
    zoomLevel: number;
    constructor(slate: any);
    /**
     * Extract presentation layout from current nodes.
     * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
     */
    extractLayout(opts?: {
        nodeIds?: string[];
    }): PresentationStep[];
    /** Start presentation mode */
    start(): void;
    /** Stop presentation mode */
    stop(): void;
    /** Go to next step */
    next(): boolean;
    /** Go to previous step */
    previous(): boolean;
    /**
     * Go to a specific step, smoothly panning+zooming the viewport so the step's
     * node is centered (P3). Pass duration 0 for an instant jump.
     */
    goToStep(index: number, duration?: number): void;
    private _animRaf;
    /** Tween the canvas viewbox from → to over `duration` ms (easeInOutQuad). */
    private animateViewbox;
    /** Get current step index */
    getCurrentStep(): number;
    /** Get total steps */
    getTotalSteps(): number;
    /** Check if presentation is active */
    isPresenting(): boolean;
    /** Destroy the presentation, stopping if active */
    destroy(): void;
}
