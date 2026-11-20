import type { Workshop } from './model';
import type { BoardLayer, BoardLayerState } from './native';
export type LayerShape = {
    t: 'line';
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    color: string;
    width?: number;
    dash?: string;
} | {
    t: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    rx?: number;
    opacity?: number;
}
/** A path; `arrow` puts an arrowhead at its end, `unlink` makes a 12px stroke under it that removes that link when clicked. */
 | {
    t: 'path';
    d: string;
    color: string;
    width?: number;
    arrow?: {
        x: number;
        y: number;
        angle: number;
    };
    unlink?: {
        cardId: string;
        waitsOn: string;
        label: string;
    };
} | {
    t: 'text';
    x: number;
    y: number;
    text: string;
    color: string;
    size?: number;
    anchor?: 'start' | 'middle' | 'end';
    bold?: boolean;
    role?: string;
};
/** Colours of the layer, as CSS custom properties with the board's own colours behind them. */
export declare const layerInk: {
    ink: string;
    faint: string;
    week: string;
    accept: string;
    refuse: string;
    bar: string;
    track: string;
    launch: string;
};
/** Draw `shapes` into `group`, replacing what was there. */
export declare function renderLayerShapes(group: SVGGElement, shapes: LayerShape[], onUnlink?: (cardId: string, waitsOn: string) => void): void;
/**
 * The layer for one attached board. `paint` says what to draw for the board on show; the
 * committed board is passed too, for what a preview is compared against.
 */
export declare function createBoardLayer(slate: any, paint: (shown: Workshop, state: BoardLayerState, committed: Workshop) => LayerShape[]): BoardLayer;
