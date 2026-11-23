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
    private _viewObserver;
    private _sizeObserver;
    private fitButton;
    private zoomInButton;
    private zoomOutButton;
    private rule;
    /** Whether the control is laid out for a narrow canvas (null before it is laid out). */
    private compact;
    constructor(slate: any, options?: ZoomSliderOptions);
    /** Show the zoom slider */
    show(): void;
    /** Hide the zoom slider */
    hide(): void;
    /** Destroy the zoom slider */
    destroy(): void;
    /** Update the slider to reflect current zoom level */
    update(): void;
    /** Lay the control out for the canvas's width now: a slim column on a phone, a short pill on a wider screen. */
    private arrange;
    private create;
}
