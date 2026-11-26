import type { Workshop, WorkshopNoteStyle, AttachedWorkshop } from '../workshops/model';
type Box = {
    x: number;
    y: number;
    width: number;
    height: number;
};
type Point = {
    x: number;
    y: number;
};
/** The boards drawn by a kit of their own (slateboxjs/boards); a nested board's kit is a chunk of its own too. */
export declare const KIT_KINDS: string[];
export declare const workshopNoteStyle: {
    fontFamily: string;
    fontSize: number;
    laneFontSize: number;
    captionFontSize: number;
    textColor: string;
    borderColor: string;
    borderWidth: number;
    cornerRadius: number;
};
/**
 * How many lanes sit side by side on a canvas this wide. One to a row on a phone, so card text stays at its full size;
 * on a wider canvas as many as fit at 70% or more. A map keeps its stations where its author put them.
 */
export declare function lanesPerRow(width: number, workshop: any): number | undefined;
/**
 * Where a slate's first board sits when the slate has not recorded a place for it: to the right of the slate's own
 * notes, level with their top, or near the corner of an empty slate. The same rule attachWorkshop applies on the canvas.
 */
export declare function workshopOrigin(options: any, nodes: any[] | undefined): Point;
type ModelModule = typeof import('../workshops/model');
type ModelParts = Pick<ModelModule, 'attachWorkshop' | 'rulebookLoaded' | 'DEFAULT_NOTE_STYLE' | 'workshopCardLookOf'> & {
    boardChromeStyles?: string;
};
type KitsModule = {
    kitFor(kind: string): unknown;
    boardLayoutFor(width: number): any;
};
/** What the renderer is given by its host: a loader for each part of the engine it draws with. */
export interface StillModules {
    /** slateboxjs/workshops/model */
    model: () => Promise<ModelParts>;
    /** slateboxjs/boards (the business boards' kits) */
    boards: () => Promise<KitsModule>;
    /** slateboxjs/boards/nest (the nested boards' kit; registers itself with the kits) */
    nest: () => Promise<unknown>;
    /** slateboxjs/boards/grid (the grid sheet's kit; registers itself with the kits). Needed only to draw a grid sheet. */
    grid?: () => Promise<unknown>;
    /** slateboxjs/workshops/behaviour (the rulebook; registers itself with the model) */
    behaviour: () => Promise<unknown>;
    /** slateboxjs (or slateboxjs/canvas): the canvas class renderStill draws on */
    Slate?: () => Promise<any>;
    /** The host's type for lanes and captions (a page without Manrope passes its own family, e.g. 'Arial, sans-serif'). */
    noteStyle?: Partial<typeof workshopNoteStyle>;
}
/**
 * What a card looks like on this slate: the slate's own first note with words on it, so a card and a note side by side
 * are the same kind of thing. A slate with no notes yet draws its cards as the canvas draws a note made there by a
 * double-click. Accepts stored notes (xPos, foregroundColor, vectorPath) and live ones (x, fontColor, shape).
 */
export declare function workshopCardLook(nodes: any[] | undefined, model: Pick<ModelModule, 'DEFAULT_NOTE_STYLE' | 'workshopCardLookOf'>, base?: typeof workshopNoteStyle): any;
/** The style a board is drawn in on a slate holding `nodes`: the lanes in the lane style, the cards as the slate's own notes. */
export declare function workshopStyle(nodes: any[] | undefined, model: Pick<ModelModule, 'DEFAULT_NOTE_STYLE' | 'workshopCardLookOf'>, base?: typeof workshopNoteStyle): WorkshopNoteStyle;
export interface StillBoard {
    id: string;
    workshop: Workshop;
    origin: Point | null;
}
/**
 * Every board a saved slate holds, first board first. The first board (creative) sits at options.workshopOrigin, or
 * beside the slate's notes when none is stored; each further board (boards.<id>, b2, b3, … in the order they were
 * added) at its own origin, null when not recorded.
 */
export declare function slateBoards(slate: any): StillBoard[];
/** Whether a saved slate holds a board (its first in creative, any further in boards). */
export declare const holdsBoards: (slate: any) => boolean;
/** A slate holding one board and nothing else: how a smart component (a library item's board) is drawn as a still. */
export declare function componentSlate(workshop: Workshop, name?: string): any;
/** The box a slate's notes fill, in world units (stored notes: xPos, yPos, width, height). */
export declare function notesBox(nodes: any[] | undefined): Box | null;
/**
 * The world box of everything drawn on the canvas in `host` (its first svg's user space), or null where the browser
 * cannot measure (no layout, or a DOM without SVG geometry, as in unit tests).
 */
export declare function drawnBox(host: Element): Box | null;
/** The viewbox that shows `frame` whole and centred in a host `w` by `h` pixels, with `pad` world units around it. */
export declare function fitViewbox(frame: Box, w: number, h: number, pad?: number): Box;
export interface BoardKit {
    kit?: unknown;
    layoutFor: (width: number) => any;
}
export interface DrawBoardOptions {
    /** 'still' (read-only, a card's picture) or 'draft' (dashed, see-through, view-only, scope pv). */
    how?: 'still' | 'draft';
    origin?: Point;
    scope?: string;
    /** The screen width the board is laid out for. */
    width?: number;
    style?: WorkshopNoteStyle;
}
export interface StillOptions {
    /** The world box to show; by default everything the slate holds (its notes and each board with its chrome). */
    frame?: Box;
    /** The screen width the boards are laid out for (1440: as a desktop canvas shows them). */
    width?: number;
}
export interface Still {
    /** The read-only canvas. */
    slate: any;
    /** The boards drawn on it. */
    boards: AttachedWorkshop[];
    /** The world box shown. */
    frame: Box;
    /** Fit the frame to the host again (a resize). */
    fit(): void;
    /** Take the picture away: the boards, the observer and the canvas. */
    destroy(): void;
}
export interface StillRenderer {
    loadBoardKit(workshop: any): Promise<BoardKit>;
    drawBoard(engine: any, workshop: Workshop, options?: DrawBoardOptions): Promise<AttachedWorkshop>;
    drawSlateBoards(engine: any, slate: any, options?: {
        width?: number;
    }): Promise<AttachedWorkshop[]>;
    renderStill(host: HTMLElement, slateJson: any, options?: StillOptions): Promise<Still>;
}
/** The one renderer, drawing with the engine modules its host loads (StillModules). */
export declare function createStillRenderer(modules: StillModules): StillRenderer;
export {};
