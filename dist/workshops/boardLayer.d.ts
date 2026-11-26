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
}
/** A box; `role` names it in the document (data-board-layer), and a `grip-` role is drawn above the notes, on its bar. */
 | {
    t: 'rect';
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    rx?: number;
    opacity?: number;
    role?: string;
}
/**
 * A path; `arrow` puts an arrowhead at its end. `unlink` makes a 24px stroke under it, a button that removes
 * that link: a click, Enter or Space removes it; a tap first selects it, and a second tap removes it (`armed`:
 * what it says while it waits for that tap). `pick` makes the same stroke a button that selects it (a map's path).
 */
 | {
    t: 'path';
    d: string;
    color: string;
    width?: number;
    hit?: number;
    fill?: string;
    dash?: string;
    role?: string;
    /** How strong the line is (stroke-opacity; a fill keeps its own). */
    strokeOpacity?: number;
    arrow?: {
        x: number;
        y: number;
        angle: number;
    };
    unlink?: {
        cardId: string;
        waitsOn: string;
        label: string;
        armed?: string;
    };
    pick?: {
        key: string;
        label: string;
    };
}
/** Words; `lines` sets `text` on several lines (each line a tspan, `lineHeight` apart), whose words together are `text`. */
 | {
    t: 'text';
    x: number;
    y: number;
    text: string;
    color: string;
    size?: number;
    anchor?: 'start' | 'middle' | 'end';
    bold?: boolean;
    role?: string;
    lines?: string[];
    lineHeight?: number;
    /** A ring of `halo` (the canvas's colour) behind the words, so a line or an arrow under them never cuts a letter. */
    halo?: string;
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
    /** Words set on the canvas itself (a plan's header and dates), not on a lane's pale fill: they follow the slate's background. */
    canvasInk: string;
    /** A phone's plan rows lie on the canvas: their grid, week lines and tracks follow the slate's background too. */
    canvasFaint: string;
    canvasWeek: string;
    canvasTrack: string;
    /** The canvas's own colour, for a halo behind words. */
    halo: string;
};
/** A link selected by a tap, waiting for a second tap to be removed. */
export interface LinkSelection {
    armed: string | null;
    arm(key: string | null): void;
}
/** Draw `shapes` into `group`, replacing what was there. */
export declare function renderLayerShapes(group: SVGGElement, shapes: LayerShape[], onUnlink?: (cardId: string, waitsOn: string) => void, links?: LinkSelection, onPick?: (key: string) => void): void;
/**
 * The layer for one attached board. `paint` says what to draw for the board on show; the
 * committed board is passed too, for what a preview is compared against.
 */
export declare function createBoardLayer(slate: any, paint: (shown: Workshop, state: BoardLayerState, committed: Workshop) => LayerShape[], options?: {
    exportNever?: boolean;
}): BoardLayer;
