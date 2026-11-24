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
     * The notes a presentation may stop at. Decoration a host draws behind or beside
     * its own notes (a drag policy's `canSelect: false`: a workshop's lane columns and
     * captions) is scenery, never a stop.
     */
    private stops;
    /**
     * Extract presentation layout from current nodes.
     * Orders nodes by their _presentationIndex or by position (top-to-bottom, left-to-right).
     */
    extractLayout(opts?: {
        nodeIds?: string[];
    }): PresentationStep[];
    /**
     * Build the hierarchical presentation layout (preziData) — a tree of root
     * nodes → children with per-node metrics + descriptions. This is the structure
     * the AI consumes to decide the presentation ORDER (ported from v1
     * slate.extractPresentationLayout). Bbox is relative to `orientData`'s left/top
     * when the host gives it (as v1 did: the origin of the SVG export the host
     * plays the presentation over), otherwise to the stops' own top-left.
     */
    extractPresentationLayout(options?: {
        orientData?: {
            left?: number;
            top?: number;
        };
    }): any;
    /**
     * Set the step order explicitly (e.g. from the AI's returned ordering). IDs
     * that don't exist are skipped; any nodes the AI omitted are appended in the
     * default layout order so nothing is lost.
     */
    setStepOrder(nodeIds: string[]): PresentationStep[];
    /** Start presentation mode */
    start(duration?: number): void;
    /** Stop presentation mode */
    stop(): void;
    /** Stop every video playing on the slate (media notes play only while their step shows). */
    private stopMedia;
    /** Go to next step */
    next(duration?: number): boolean;
    /** Go to previous step */
    previous(duration?: number): boolean;
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
