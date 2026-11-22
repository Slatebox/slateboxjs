import { type PartPlace, type Workshop, type WorkshopBoardKit, type WorkshopBoardLayout, type WorkshopEdit } from '../workshops/model';
/** Where every note of a nest board goes, in board coordinates. */
export declare function nestLayout(board: Workshop, layout?: WorkshopBoardLayout): {
    parts: PartPlace[];
    width: number;
    height: number;
};
/**
 * The edits that turn one nest board into another: what a drag, a far drop, a key, a rename or a kept chat
 * change made. The server makes a whole save again from these, by the reducer, so they say everything an
 * edit can change: merges (by the alias they leave), removals, new fields, the layout, new cards (a parent
 * before what goes under it), moves (shallowest first; siblings last to first, each before its neighbour, so
 * the order comes out the same whatever keys were made), roles, sources and numbers. Moves and roles are
 * said in whichever order the rules let through (a pile moved under the outcome, then made an opportunity).
 */
export declare function nestEditsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
export declare const nestKit: WorkshopBoardKit;
