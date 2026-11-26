import type { Workshop, WorkshopCard } from './model';
export declare const PX_PER_INCH = 96;
/** The smallest a cell may be either way: three quarters of an inch. */
export declare const MIN_CELL = 72;
export type GridPageSize = 'letter' | 'a4';
export type GridOrientation = 'portrait' | 'landscape';
export interface GridFields {
    page: {
        size: GridPageSize;
        orientation: GridOrientation;
        margin: number;
    };
    cells: {
        rows: number;
        cols: number;
        gutter: number;
    };
}
export interface GridCell {
    row: number;
    col: number;
    rows?: number;
    cols?: number;
}
export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** "Letter", "A4". */
export declare const pageName: (size: GridPageSize) => "A4" | "Letter";
/** The page in px (96 per inch), turned for landscape. */
export declare function pageSize(fields: Pick<GridFields, 'page'>): {
    width: number;
    height: number;
};
/** The page as a print and a PDF size it: inches (CSS @page, the svg's width) and points (pdf-lib). */
export declare function printSize(fields: Pick<GridFields, 'page'>): {
    in: [number, number];
    pt: [number, number];
};
/** One cell's size in px: what is left of the page after its margins and gutters, shared equally. */
export declare function cellSize(fields: GridFields): {
    width: number;
    height: number;
};
/** Why this page and grid make cells too small, as a sentence; null when every cell is at least ¾ inch either way. */
export declare function cellSizeProblem(fields: GridFields): string | null;
/** A cell's span, 1 by 1 when it says none. */
export declare const spanOf: (cell: GridCell) => {
    rows: number;
    cols: number;
};
/** The box of a (spanned) cell on its page, in px from the page's top-left corner: the gutters it covers included. */
export declare function cellBox(fields: GridFields, cell: GridCell): Box;
/** The cell under a point on the page (px from its top-left corner): the nearest one within the margins; null off the page. */
export declare function cellAt(fields: GridFields, point: {
    x: number;
    y: number;
}): {
    row: number;
    col: number;
} | null;
/** Whether a span at a cell stays inside the grid. */
export declare const inBounds: (fields: GridFields, cell: GridCell) => boolean;
type Placed = Pick<Workshop, 'cards'>;
/** Which tile holds each cell of a page ("row:col" → card id). */
export declare function occupancy(board: Placed, pageId: string, exceptId?: string): Map<string, string>;
/** Whether a span fits at a cell of a page: null when it does, else why ('bounds', or the tile that holds a cell it needs). */
export declare function fits(board: Placed & {
    grid?: GridFields;
}, pageId: string, cell: GridCell, exceptId?: string): null | {
    reason: 'bounds';
} | {
    reason: 'taken';
    by: string;
};
/** Every cell of a page where a span fits, in reading order (row by row). */
export declare function freeCells(board: Placed & {
    grid?: GridFields;
}, pageId: string, span?: {
    rows?: number;
    cols?: number;
}, exceptId?: string): {
    row: number;
    col: number;
}[];
/** How many cells of a page tiles cover. */
export declare const usedCells: (board: Placed, pageId: string) => number;
/** Cards in reading order: by page, then row, then column. */
export declare function readingOrder(board: Pick<Workshop, 'cards' | 'lanes'>): WorkshopCard[];
/**
 * The board with every placed tile in a cell of the grid it has now (after its page or grid changed): a tile keeps its
 * cell when it still fits; otherwise, in reading order, it takes the first free cell that fits its span, its span
 * shrunk to fit when no cell takes it whole. A tile that still finds no room goes back to the tray (its cell cleared),
 * and is named in `sent`, with why.
 */
export declare function reflow<T extends Workshop>(board: T, trayId: string): {
    board: T;
    sent: {
        label: string;
        span: {
            rows: number;
            cols: number;
        };
    }[];
};
export {};
