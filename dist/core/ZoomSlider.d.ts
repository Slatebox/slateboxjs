/**
 * ZoomSlider.ts - Visual zoom slider control
 *
 * Creates a zoom slider UI element that integrates with PanZoom.
 */
export interface ZoomSliderOptions {
    enabled?: boolean;
    position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
    minZoom?: number;
    maxZoom?: number;
}
export declare class ZoomSlider {
    private slate;
    private options;
    private container;
    private slider;
    private label;
    constructor(slate: any, options?: ZoomSliderOptions);
    /** Show the zoom slider */
    show(): void;
    /** Hide the zoom slider */
    hide(): void;
    /** Destroy the zoom slider */
    destroy(): void;
    /** Update the slider to reflect current zoom level */
    update(): void;
    private create;
}
