import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopEdit } from '../workshops/model';
/** Where every note of a nest board goes, in board coordinates. */
export declare function nestLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
};
/** The edits that turn one nest board into another: what a drag, a far drop, a key or a rename made. */
export declare function nestEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
export declare const nestKit: WorkshopBoardKit;
