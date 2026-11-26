import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopCard, type WorkshopEdit } from '../workshops/model';
/** Where each page and the tray sit, and the scale a page is drawn at (1, or less on a phone). */
export declare function gridFrames(board: Workshop, layout?: WorkshopBoardLayout): {
    scale: number;
    pages: {
        id: string;
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    tile: {
        width: number;
        height: number;
    };
    narrow: boolean;
    tray: {
        x: number;
        y: number;
        width: number;
    };
};
/** How one tile is drawn: one table, every kind (spec §4 "Tile looks"). */
export declare function tileLook(board: Workshop, card: WorkshopCard, box: {
    width: number;
    height: number;
}, scale?: number): Omit<PartPlace, 'name' | 'x' | 'y' | 'width' | 'height'>;
/** Where every note of a grid sheet goes, in board coordinates. */
export declare function gridLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
};
/**
 * The edits that turn one grid sheet into another: what a drag, a key, a rename or a kept chat change made. The page and
 * grid first (they reflow), then pages added and removed, tiles removed, new tiles (a stamp's copy is a new tile), then
 * tiles placed (in an order the cells let through: one leaving a cell before another takes it), changed and renamed.
 */
export declare function gridEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
/** The pages to print or save as a PDF: each page's frame on the slate (its note), the notes on it, and its size. */
export declare function gridPrintPages(board: Workshop, layout?: WorkshopBoardLayout, origin?: {
    x: number;
    y: number;
}, pageIds?: string[]): {
    pageId: string;
    label: string;
    frame: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    nodeIds: string[];
    size: {
        in: [number, number];
        pt: [number, number];
    };
}[];
export declare const gridKit: WorkshopBoardKit;
