import type { Workshop, WorkshopCard } from './model';
type Board = Workshop;
/** The four squares: which way each axis runs in it (true: the high half, a score of 5 or more). */
export declare const nestQuadrants: readonly [{
    readonly id: "do-now";
    readonly label: "Do now";
    readonly high: readonly [false, true];
}, {
    readonly id: "plan";
    readonly label: "Plan it";
    readonly high: readonly [true, true];
}, {
    readonly id: "later";
    readonly label: "Later";
    readonly high: readonly [false, false];
}, {
    readonly id: "skip";
    readonly label: "Skip";
    readonly high: readonly [true, false];
}];
/** A 2 by 2's axes: the fields across and up. */
export declare function nestAxes(board: Board): {
    x: {
        id: string;
        label: string;
        currency?: string;
        flag?: true;
    };
    y: {
        id: string;
        label: string;
        currency?: string;
        flag?: true;
    };
} | null;
/** A card's two scores, or null (in the tray, or not on a 2 by 2). */
export declare function nestScores(board: Board, card: WorkshopCard): {
    x: number;
    y: number;
} | null;
/** The square a card is in, or null. */
export declare function quadrantOf(board: Board, card: WorkshopCard): string | null;
/** The scores a card takes to land in a square, as near as it can to where it is. */
export declare function scoresIn(board: Board, card: WorkshopCard, quadrant: string): {
    x: number;
    y: number;
};
/** The board with a card at these scores (from the tray too): null when it can't be placed. */
export declare function scoreBoard(board: Board, cardId: string, x: number, y: number): Board | null;
/** An org chart: a board whose cards are people (a manager or an open role among them). */
export declare const isOrgChart: (board: Board) => boolean;
/** Impact × effort: what to work on next, scored; Do now already holds its three. */
export declare function impactEffortSample(): Board;
/** Reorg & hiring sandbox: who reports to whom, open roles, a contractor; spans, open roles and designers as rules. */
export declare function reorgSample(): Board;
/** Goals & owners: objectives, key results and initiatives, each owned by a team; a key result owned outside its objective's team is flagged. */
export declare function goalsSample(): Board;
export {};
