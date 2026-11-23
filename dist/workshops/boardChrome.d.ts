import type { Workshop, WorkshopBoardLayout } from './model';
import { type LayerShape } from './boardLayer';
/** Colours of the chrome, as tokens a host sets (light and dark) with these defaults behind them. */
export declare const chromeInk: {
    title: string;
    chip: string;
    chipInk: string;
    focus: string;
    focusInk: string;
    focusTint: string;
    preview: string;
    previewFill: string;
    previewInk: string;
    halo: string;
    badge: string;
    badgeLine: string;
    badgeInk: string;
};
export type LegendIcon = 'bin' | 'gate' | 'step' | 'oneway' | 'clock' | 'flag' | 'push' | 'lock' | 'rule';
/** One thing a board's legend says: an icon, a few words, and where on the board the same icon stands (if anywhere). */
export interface LegendItem {
    icon: LegendIcon;
    /** A few words ("One column at a time"); the rule's full sentence stays the refusal and the chat's answer. */
    text: string;
    /** A rule that only warns: its chip is outlined dashed. */
    warn?: boolean;
    /** The column whose header carries the icon. */
    lane?: string;
    /** The seams (from column, to column) that carry the icon. */
    seams?: [string, string][];
}
/**
 * What a board's legend says, from its rules (as data). A column's limit is left out: its counter says it.
 * - A board of columns: its rulebook's rules that are on (a bin, a gate, a path).
 * - A launch plan, hiring plan or pipeline: its own sentences, a few words each (the rulebook must have loaded;
 *   until it has, the legend is empty).
 * - A map: nothing (its stations say what they hold).
 */
export declare function boardLegend(board: Workshop): LegendItem[];
/** The width of words at a type size (the layer measures nothing: an average glyph is about half an em). */
export declare const chromeTextWidth: (text: string, size: number, bold?: boolean) => number;
export interface ChromeOptions {
    /** The board's layout (columns per row), as it is drawn: where a badge stands. */
    layout?: WorkshopBoardLayout;
    /** The board is in focus: a solid frame with "Editing" and "Done". */
    focused?: boolean;
    /** The board is a draft not yet added (a library preview): a dashed frame tagged "Preview · not added yet". */
    draft?: boolean;
    /**
     * The chrome's type scale: max(1, 0.75 / zoom), at most CHROME_MAX_SCALE, so a board's name stays readable in an overview of
     * many boards (chromeScaleAt). Past CHROME_CHIPS_MAX_SCALE the chips are left out.
     */
    scale?: number;
    /** The scale of the frame's tags (chromeTagScaleAt): at least `scale`. */
    tagScale?: number;
    /** A phone: the legend starts on the row under the title. */
    narrow?: boolean;
    /**
     * The width the board keeps on its slate (workshopReserve): its name may use that much before it is shortened.
     * Left out, the board's own width.
     */
    room?: number;
    /** Where each column is drawn (board coordinates), for the badges. A kit or a map has none. */
    places?: {
        laneId: string;
        x: number;
        y: number;
        width: number;
        row: number;
    }[];
}
/** The words of the draft tag. */
export declare const DRAFT_TAG = "Preview \u00B7 not added yet";
/** The largest the chrome's type grows when zoomed out: a board's name stays about 12px on screen down to an 11% overview. */
export declare const CHROME_MAX_SCALE = 6;
/** Past this scale (a zoom under 30%) the legend's chips are left out and the board's name alone is drawn. */
export declare const CHROME_CHIPS_MAX_SCALE = 2.5;
/** The chrome's type scale at a zoom: max(1, 0.75 / zoom), at most CHROME_MAX_SCALE (in steps of 0.05, so a redraw waits for a real change). */
export declare const chromeScaleAt: (zoom: number) => number;
/**
 * The scale of a frame's tags ("Editing", "Done", the draft's tag) at a zoom: never smaller on screen than at 100%, and with
 * `finger` (a board in focus on a phone, where "Done" is a button) at least a finger's 40px tall.
 */
export declare const chromeTagScaleAt: (zoom: number, finger?: boolean, k?: number) => number;
/** Where the chrome's parts go, in board coordinates (0,0 is the board's origin, `size` its drawn box). */
export declare function boardChromeLayout(board: Workshop, size: {
    x?: number;
    y?: number;
    width: number;
    height: number;
}, options?: ChromeOptions): {
    k: number;
    tagK: number;
    legend: LegendItem[];
    placed: {
        x: number;
        row: number;
        item: LegendItem;
        width: number;
    }[];
    rows: number;
    title: string;
    titleY: number;
    titleSize: number;
    titleRight: number;
    rowH: number;
    frame: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    top: number;
};
/**
 * The box the chrome fills with the board, in board coordinates: the board's drawn box grown by the title row and
 * legend, and by the frame and its tags while there is one.
 */
export declare function boardChromeBox(board: Workshop, size: {
    width: number;
    height: number;
}, options?: ChromeOptions): {
    x: number;
    y: number;
    width: number;
    height: number;
};
/** The chrome of one board in board coordinates: its title row, and in focus or as a draft its frame and tags. */
export declare function boardChromeShapes(board: Workshop, size: {
    x?: number;
    y?: number;
    width: number;
    height: number;
}, options?: ChromeOptions): LayerShape[];
/** The badges where the rules act (a column's header corner, the seam between two columns): drawn above the board's notes. */
export declare function boardBadgeShapes(board: Workshop, options?: ChromeOptions): LayerShape[];
/** What a screen reader hears of a board's chrome: its title, then its legend. */
export declare function boardChromeLabel(board: Workshop): string;
/**
 * The styles a host adds once for boards: the board in focus brings the rest of the canvas down to 32% while the
 * host's canvas element carries the `focusing` class, and a draft's notes are see-through.
 */
export declare const boardChromeStyles = "\n.focusing [data-node-id]:not([data-workshop-focused]),\n.focusing g[data-board-layer=\"\"]:not([data-workshop-focused]),\n.focusing g[data-board-layer-top]:not([data-workshop-focused]),\n.focusing g[data-board-chrome]:not([data-workshop-focused]) { opacity: .32; transition: opacity .2s ease; }\n[data-node-id][data-workshop-draft] { opacity: .78; }\n@media (prefers-reduced-motion: reduce) { .focusing [data-node-id] { transition: none; } }\n";
export interface BoardChromeState extends ChromeOptions {
    board: Workshop;
    /** The board's scope on a slate of many boards ('main' for the first): said on the chrome's groups (data-board-scope). */
    scope?: string;
    origin: {
        x: number;
        y: number;
    };
    /** The board's drawn box, in board coordinates. */
    size: {
        width: number;
        height: number;
    };
    /** The first of the board's notes in the canvas: the title row goes just under it (under every note of the board). */
    under?: Element | null;
    /** A person pressed "Done" on the focus frame. */
    onDone?: () => void;
}
export interface BoardChrome {
    draw(state: BoardChromeState): void;
    destroy(): void;
}
/**
 * What a slate knows of each board's chrome (slate.boardChromes): the box it fills at a zoom, so a fit to the content
 * includes every board's name and legend; and its plain drawing (the title row and badges at full size, no frame or tags),
 * which an export (a PNG, an SVG, Present) shows in place of the chrome as it is drawn for the view now.
 */
export interface BoardChromeEntry {
    /** The board's scope on its slate ('main' for the first). */
    readonly scope: string;
    /** A library preview, not part of the slate: left out of an export. */
    readonly draft: boolean;
    /** The box the board and its chrome fill at a zoom (world units), as the chrome would be drawn at that zoom. */
    box(zoom: number): {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    /** The box of the plain drawing (world units). */
    plainBox(): {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    /** Draw the plain chrome into an export's copies of this board's two groups (under the notes, and its badges). */
    paintPlain(under: Element, over: Element | null): void;
}
/** The chrome entries of a slate's boards (see BoardChromeEntry). */
export declare function boardChromesOf(slate: any): Set<BoardChromeEntry>;
/** The chrome of one attached board: a group under the board's notes (title, legend, frame) and one above them (badges). */
export declare function createBoardChrome(slate: any): BoardChrome;
