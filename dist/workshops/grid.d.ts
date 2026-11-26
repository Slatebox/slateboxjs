import type { BehaviourRule, BehaviourVerdict } from './behaviour';
import type { GridTile, GridTileType, Workshop, WorkshopCard, WorkshopNoteOffer } from './model';
import type { BusinessBoardRules, RuleFamily } from './kinds';
import { type GridCell, type GridFields } from './gridGeometry';
export * from './gridGeometry';
type Board = Workshop;
type Rule = BehaviourRule;
export declare const GRID_TRAY = "tray";
export declare const GRID_MAX_TILES = 120;
export declare const GRID_MAX_STAMPS = 12;
export declare const gridTileTypes: readonly GridTileType[];
/** "a heading", "2 headings", "answer lines". */
export declare function tileWords(type: GridTileType, n: number): string;
/** The name a tile of a kind takes when it is made without one: "Heading", "Word bank". */
export declare const tileName: (type: GridTileType) => string;
/** The kind of tile these words name ("word banks", "pictures", "QR code"), or null. */
export declare function tileTypeOf(words: string): GridTileType | null;
/** The pages of a sheet (every lane but the tray). */
export declare const gridPages: (board: Pick<Board, "lanes">) => import("./model").WorkshopLane[];
/** How big a kind of tile is by default: a heading the full row, every other 1 by 1. */
export declare function defaultSpan(board: Pick<Board, 'grid'>, type: GridTileType): {
    rows: number;
    cols: number;
};
/** The sheet's own rule over the whole board: null when it holds, else the sentence. */
export declare function validateGrid(board: Board): string | null;
export declare function gridRuleSentence(rule: Rule): string;
/** Whether `after` keeps the sheet's rules for every tile that arrived on a page (or a new tray tile, for its kind). */
export declare function checkGrid(before: Board, after: Board): BehaviourVerdict;
/** Whether a refusal of checkGrid may be made anyway (Move anyway): a limit or the sheet's tiles, never a span. */
export declare function gridOverridable(board: Board, ruleId: string | null): boolean;
/** What a page still needs by its tileNeeds rules ("a heading"), as words; empty when it has all of it. */
export declare function gridNeeds(board: Board, pageId: string): string[];
export declare const gridFamily: RuleFamily;
/** "Letter · 4 × 2 · 6 of 8 cells · Needs a heading"; the tray: "7 stamps · drag one onto a page". */
export declare function gridCaption(board: Board, laneId: string): string;
/**
 * What a tile says on the page: its own words and nothing else. A tile's name (its label) is what the sheet calls it
 * ("B column number square"); it is printed only when the tile has no words of its own. A word bank its words, a
 * picture its words when it has no picture.
 */
export declare function gridCardText(_board: Board, card: WorkshopCard): string;
/** The words a tile takes back to the canvas as a note: everything it says. */
export declare function gridNoteText(_board: Board, card: WorkshopCard): string;
/**
 * The tile an ordinary note makes: a note with a picture an image tile that keeps it; one of two or more lines that
 * ends in a question mark a question (its first line the name, the rest its words); anything else text.
 */
export declare function gridFromNote(_board: Board, text: string, unnamed: string, note?: WorkshopNoteOffer): {
    label: string;
    type: "image";
    image: {
        src: string;
        alt: string;
    };
    body?: undefined;
} | {
    label: string;
    type: "question";
    body: string;
    image?: undefined;
} | {
    body?: string | undefined;
    label: string;
    type: "text";
    image?: undefined;
};
/**
 * What would print badly, as sentences, before a print or a PDF: a page short of what its rules need, a picture frame
 * with no picture, a QR code with no web address. Empty when there is nothing to ask about.
 */
export declare function gridPrintProblems(board: Board, pageIds?: string[]): string[];
/** The grid sheet's part of the one gate (see kinds.ts). */
export declare const gridRules: BusinessBoardRules;
type TileSpec = [label: string, tile: GridTile, cell?: GridCell];
/** A sheet from its page, its stamps and page 1's tiles. */
export declare function gridSheet(title: string, grid: GridFields, stamps: TileSpec[], placed: TileSpec[], rules: Array<Record<string, unknown>>, more?: {
    pages?: TileSpec[][];
}): Board;
/** A worksheet: a heading, questions with answer lines and a word bank, on a Letter page of 6 by 2 cells. */
export declare function worksheetSample(): Board;
/** Bingo: a title across the top and 5 by 5 squares of animals, Free in the middle; duplicate it shuffled for each player. */
export declare function bingoSample(): Board;
/** Flashcards: eight terms with what they mean, on a Letter page of 4 by 2 cards with a wide gap to cut along. */
export declare function flashcardSample(): Board;
export declare const gridSamples: {
    worksheet: typeof worksheetSample;
    bingo: typeof bingoSample;
    flashcards: typeof flashcardSample;
};
