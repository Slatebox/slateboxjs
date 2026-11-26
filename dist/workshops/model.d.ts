export * from './offlineHandoff';
export * from './listeningRoom';
export * from './appearance';
import { type WorkshopAppearance } from './appearance';
export { releaseLoad, releasePlan } from './release';
import type { Behaviour } from './behaviour';
import type { GridCell, GridFields } from './gridGeometry';
export type { GridCell, GridFields, GridPageSize, GridOrientation } from './gridGeometry';
export type { Behaviour, BehaviourRule, BehaviourVerdict, RuleAudit, RuleBody, RuleInput, RuleKindId, WorkshopMoveCheck } from './behaviour';
export { registerRulebook, rulebook, rulebookLoaded, registerWorkshopRules, workshopRulesLoaded, workshopRules, workshopNewCardName, type RulebookHooks, type BusinessBoardRules, type BusinessEditStep, type BusinessEditTools, type WorkshopFieldReader, type WorkshopLimits } from './kinds';
import type { NodeJSON, SlateJSON } from '../core/Serialization';
import { DEFAULT_NOTE_STYLE } from '../core/NoteDefaults';
import { type HeaderBox } from './laneHeader';
/** How the engine draws an ordinary note when nothing says otherwise: what a card looks like with no style. */
export { DEFAULT_NOTE_STYLE };
export interface StationImage {
    src: string;
    alt: string;
}
/** The kinds of tile a grid sheet composes a page from. */
export type GridTileType = 'heading' | 'text' | 'image' | 'question' | 'answer-lines' | 'word-bank' | 'diagram' | 'qr' | 'panel' | 'speech' | 'term' | 'sticker';
/**
 * A grid sheet's tile: its kind, its words (up to 600 characters, line breaks kept), a word bank's words (3 to 24), a
 * picture (an empty frame prints its alt), a QR code's web address, and whether it is a stamp (a tray tile that stays
 * in the tray: dropping it on a page makes a copy).
 */
export interface GridTile {
    type: GridTileType;
    body?: string;
    words?: string[];
    image?: {
        src?: string;
        alt: string;
    };
    link?: string;
    stamp?: true;
}
export interface WorkshopLane {
    id: string;
    label: string;
    capacity?: number;
    /** Pipeline: the chance a deal in this open stage is won, 0 to 1. */
    probability?: number;
    /** Pipeline: the stage that holds won deals, or lost ones. */
    role?: 'won' | 'lost';
    /** Budget: what this team is given, and the least and most it may be given. */
    allocation?: number;
    floor?: number;
    cap?: number;
    station?: {
        column: number;
        row: number;
        next: string[];
        outcome: string;
        image?: StationImage;
    };
}
export interface WorkshopCard {
    id: string;
    label: string;
    laneId: string;
    allowedLaneIds?: string[];
    points?: number;
    dependsOn?: string[];
    /** Launch plan: whole days the task takes, and whole days it waits after what it depends on. */
    duration?: number;
    lag?: number;
    /** Pipeline and budget: whole currency units. */
    amount?: number;
    /** Hiring plan: the role band the hire is in (cost is per band, never per person). */
    band?: string;
    /** Nest board: the card it sits under, what it is (pile, outcome…), its place among its siblings (a fractional key), who said it, and numbers chat added. */
    parentId?: string;
    role?: string;
    order?: string;
    source?: string;
    fields?: Record<string, number>;
    /** Nest board with owners (Goals & owners): the team that owns it, by id. */
    owner?: string;
    /** Grid sheet: what kind of tile it is and what it holds (read only by the grid's rules, grid.ts). */
    tile?: GridTile;
    /** Grid sheet: the cell a tile on a page sits in (0-based; 1-based in every sentence) and its span. A tile in the tray has none. */
    cell?: GridCell;
    /** How the card is drawn when it differs from the board's: the look of the note it was made from. */
    look?: WorkshopCardLook;
    /** What the note it was made from had that a card does not show, so it comes back as it was. */
    asNote?: WorkshopCardAsNote;
    /** The id of the note it was made from, when the card could not take it: the note comes back under it. */
    noteId?: string;
    /**
     * Map: a card the paths don't constrain (a note dropped on a step becomes one): it goes to any step and back to
     * the canvas. A map's token is a card without it, and only the token follows the paths (boards S2b).
     */
    free?: true;
    /**
     * A move made anyway, past the rule that refused it, once the person confirmed it ("Move anyway"): who, when, the
     * rule's sentence, and the lane it came from (Undo puts it back there). Shown on the card. Lane boards and maps only.
     */
    override?: WorkshopOverride;
}
/** A card moved past a rule (WorkshopCard.override). */
export interface WorkshopOverride {
    by: string;
    /** ISO time. */
    at: string;
    /** The rule's sentence, as the refusal said it. */
    sentence: string;
    /** The lane the card was in before. */
    from: string;
    /**
     * What else the move changed, as it was before, where it is more than the lane (Undo puts these back too): a plan's
     * task moved in time (its `lag` and `duration`), a nested board's card moved under another (`parentId`, null at the
     * top of its area).
     */
    was?: {
        lag?: number;
        duration?: number;
        parentId?: string | null;
    };
}
/**
 * What an ordinary note had that its card does not show: its words with their line breaks,
 * its shape and its size. A card dropped on the canvas becomes that note again.
 */
export interface WorkshopCardAsNote {
    text?: string;
    shape?: string;
    width?: number;
    height?: number;
    /** Its picture (an http(s) or site address), with the picture's own size. */
    image?: {
        src: string;
        width?: number;
        height?: number;
    };
    /** Its link, as a note keeps one. */
    link?: {
        type?: string;
        data: string | Record<string, string>;
        show?: boolean;
    };
}
/** The look of one card: what an ordinary note dropped on a lane brings with it. */
export interface WorkshopCardLook {
    backgroundColor?: string;
    textColor?: string;
    fontFamily?: string;
    fontSize?: number;
    borderColor?: string;
    borderWidth?: number;
}
/**
 * A line with a card at one end or both: an ordinary connector, drawn and edited like any other.
 * `parentId` and `childId` name a card on this board by its id, or an ordinary note of the slate's
 * drawing by its note id. A line between two ordinary notes belongs to the drawing, not here: when
 * a card becomes a note again, its lines to notes go back to the drawing. The rest of the fields
 * are the connector's look, as the slate saves a connector.
 */
export interface WorkshopLine {
    id: string;
    parentId: string;
    childId: string;
    lineColor?: string;
    lineOpacity?: number;
    lineWidth?: number;
    lineDash?: 'solid' | 'dashed' | 'dotted';
    lineType?: string;
    lineCurveType?: 'cubic' | 'quadratic';
    lineCurviness?: number;
    lineEffect?: string;
    showParentArrow?: boolean;
    showChildArrow?: boolean;
    label?: string;
    /** An end pinned to one spot on its note's edge ({x, y} in 0..1 on the unturned note); none follows its note. */
    sourceAnchor?: WorkshopLineAnchor;
    targetAnchor?: WorkshopLineAnchor;
    /**
     * A free end: the line ends at this point on the canvas, on no note. Only the far end of a line
     * held by a card is free (`parentId` names the card; `childId` is the free end's own id, as the
     * slate saves it). The point stays where it is when the card moves, as a free end does on the
     * canvas, and the line goes back to the drawing with it when the card becomes a note.
     */
    targetPoint?: WorkshopLinePoint;
}
/** A point on the canvas where a line's free end is. */
export interface WorkshopLinePoint {
    x: number;
    y: number;
}
/** A spot on a note's edge, as a pinned line end keeps it (see core/LineEnds.ts). */
export interface WorkshopLineAnchor {
    x: number;
    y: number;
}
export interface WorkshopSignal {
    id: string;
    label: string;
    cardId: string;
    laneId: string;
    whenPresent: string;
    whenAbsent: string;
}
export interface ResolvedWorkshopSignal extends WorkshopSignal {
    present: boolean;
    text: string;
}
export interface Workshop {
    experience?: StartupExperience;
    version: 1;
    kind?: WorkshopKind;
    title: string;
    /** Launch plan: the day every task must end by (a go-live names it). */
    launch?: {
        day: number;
        name?: string;
    };
    /** Launch and hiring plans: the plan's first day (YYYY-MM-DD); days are offsets from it. */
    clock?: {
        origin: string;
    };
    /** Hiring plan: cash, monthly burn without new hires, the role bands and a funding round. */
    hiring?: HiringFields;
    /** Nest board: how it is drawn (piles or a tree), the number fields chat added, and merged cards' new homes. */
    nest?: NestFields;
    /** Grid sheet: its page (size, orientation, margin in inches) and its cells (rows, columns, gutter in inches). */
    grid?: GridFields;
    /** Pipeline: the forecast target, and the currency sign amounts are written with. */
    forecast?: {
        target: number;
        currency: string;
    };
    /** Budget: the envelope, its currency sign and the step allocations snap to. */
    budget?: {
        total: number;
        currency: string;
        step: number;
    };
    lanes: WorkshopLane[];
    /** Lane IDs in playback order. Boards without an authored order present their lanes in layout order. */
    presentationOrder?: string[];
    signals?: WorkshopSignal[];
    cards: WorkshopCard[];
    /** The lines joined to its cards (see WorkshopLine). */
    lines?: WorkshopLine[];
    /** How the board behaves, as data: its rulebook (behaviour.ts). Lane boards and pipelines only. */
    behaviour?: Behaviour;
    /** How the board looks, as data (appearance.ts): every kind of board. */
    appearance?: WorkshopAppearance;
}
/** The kinds of board with rules of their own. A board without a kind is a board of plain lanes. */
export type WorkshopKind = 'release-plan' | BusinessBoardKind;
/** A hiring plan's money: what a role band costs a month (loaded), on one team. */
export interface HiringBand {
    id: string;
    label: string;
    monthly: number;
    lane: string;
}
export interface HiringFields {
    cash: number;
    burn: number;
    currency: string;
    weeks: number;
    bands: HiringBand[];
    funding?: {
        day: number;
        amount: number;
    };
}
/** The business boards: drawn by a board kit (slateboxjs/boards) on a live slate. */
export type BusinessBoardKind = 'launch-plan' | 'pipeline' | 'budget' | 'hiring-plan' | 'nest' | 'grid';
export declare const businessBoardKinds: readonly BusinessBoardKind[];
export interface NestFields {
    /** Piles, a tree, or a 2 by 2 (impact × effort: cards placed by two scores). */
    layout: 'clusters' | 'tree' | 'matrix';
    /** Fields cards carry: numbers (a money sign for money), or yes/no flags (1 for yes). */
    fields?: {
        id: string;
        label: string;
        currency?: string;
        flag?: true;
    }[];
    aliases?: [string, string][];
    /** A 2 by 2: the fields its across and up axes read (scores 0 to 10). */
    axes?: [string, string];
    /** The teams that own cards (Goals & owners). */
    owners?: {
        id: string;
        label: string;
    }[];
}
export declare function businessKind(board: Pick<Workshop, 'kind'>): BusinessBoardKind | undefined;
/** The id of the note a card stands for: the note it was made from, when that note's id is not the card's. */
export declare function workshopNoteIdOf(card: Pick<WorkshopCard, 'id' | 'noteId'>): string;
/** The words a card shows for a note's words: its words in one line, the first 80 characters of longer ones. */
export declare function workshopCardLabelOf(words: string): string;
/** The parts of a note's look a card can keep; anything a card cannot draw is left out. Undefined when nothing is left. */
export declare function workshopCardLookOf(input: Record<string, unknown>): WorkshopCardLook | undefined;
/** A picture's address a card can keep for its note: http(s) or on this site, not one held in the page. */
export declare function workshopKeepsPicture(src: unknown): boolean;
/** Whether a card can keep a note's link for it. */
export declare function workshopKeepsLink(link: unknown): boolean;
/** How many lines a workshop's cards may have between them. */
export declare const maxWorkshopLines = 96;
/** Resolve the original lanes for playback without changing their board positions or rules. */
export declare function workshopPresentationLanes({ lanes, presentationOrder }: Pick<Workshop, 'lanes' | 'presentationOrder'>): WorkshopLane[];
/** Resolve authored outcomes against this exact committed or transient candidate board. */
export declare function resolveWorkshopSignals(board: Workshop): ResolvedWorkshopSignal[];
export interface WorkshopPresentationScene {
    lane: WorkshopLane;
    cards: WorkshopCard[];
    signals: ResolvedWorkshopSignal[];
    /** Native node IDs for this viewpoint in the artwork produced by workshopToSlate. */
    nodeIds: string[];
}
/**
 * Describe each authored viewpoint from the committed state, including empty lanes. `scope`: the
 * board's scope on a slate of many boards (see workshopNodeIds.of), so the node ids are that board's.
 */
export declare function workshopPresentationScenes(board: Workshop, options?: {
    scope?: string;
}): WorkshopPresentationScene[];
export declare const maxWorkshopCards = 24;
export declare function validateWorkshop(input: unknown): Workshop;
/**
 * The cards a lane's limit counts: every card, except on a map, where a step's limit counts tokens only. A card made
 * from a note there (free) is free of the paths and of the limit alike, wherever it is checked (boards S2b).
 */
export declare function workshopLaneHeld(board: Pick<Workshop, 'cards'>, laneId: string): number;
/** Build the fragment for /new/workshop from portable workshop data. */
export declare function encodeWorkshopFragment(value: Workshop): string;
/** Read location.hash before creating a slate. Only the validated model is imported. */
export declare function decodeWorkshopFragment(fragment: string): Workshop;
export declare function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[];
export declare function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop;
/**
 * `next`, an ordinary edit of `before` that moved card `cardId`, with the card's move-anyway mark taken away once the
 * card stands where no rule refuses it. While the card is still past a rule (a late task nudged a day earlier but still
 * late, a task that still starts before what it waits on ends, a deal moved on to a stage still over its limit) the
 * mark stays as it was: who, when and the rule they agreed to break. Otherwise the board would refuse an ordinary
 * nudge of a card moved anyway, and that refusal could not be made anyway either.
 */
export declare function workshopShedMark(before: Workshop, next: Workshop, cardId: string): Workshop;
/**
 * The board a move would produce, for every kind of workshop: `board` itself when the
 * card is already in that lane, or null when the move is unavailable.
 *
 * This is the one question each board asks before a drag, a preview or a commit.
 * Release plans answer with planReleaseMove (which may bring dependent features
 * along), a startup experience with planStartupMove (an interview dropped on the
 * occupied prototype swaps with it, or is refused when the one there cannot leave),
 * and everything else with the lane rules: capacity, allowedLaneIds and, on a map,
 * the stations reachable from here.
 */
export declare function workshopCandidate(board: Workshop, cardId: string, laneId: string): Workshop | null;
/** Whether either board carries a move-anyway mark at all: the checks below are asked only then. */
export declare function workshopHasMarks(before: Pick<Workshop, 'cards'>, after: Pick<Workshop, 'cards'>): boolean;
/** Whether `card` (on the board after a change) was moved anyway by that change: marked now, and not as it was. */
export declare function workshopFreshOverride(before: Workshop, card: WorkshopCard): boolean;
/** Whether `card`, moved anyway before (on `before`), is back where the move took it from: an Undo. */
export declare function workshopOverrideUndone(before: Workshop, card: WorkshopCard): boolean;
/** The lanes of `laneId` that hold a card moved anyway: the lane may be past its limit (or its money) because of it. */
export declare function workshopLaneOverridden(board: Pick<Workshop, 'cards'>, laneId: string): boolean;
/**
 * Why this refused move may not be made even with a confirmation, as a sentence; null when it may be made anyway
 * (or needs no override at all). See "Moving a card anyway" above for the hard limits.
 */
export declare function workshopHardLimit(board: Workshop, cardId: string, laneId: string): string | null;
/** The mark a card moved anyway carries: who, when, the rule's sentence and where it came from. */
export declare function workshopOverrideMark(card: WorkshopCard, sentence: string, who: {
    by: string;
    at: string;
}, was?: WorkshopOverride['was']): WorkshopOverride;
/**
 * The board a refused move makes once the person confirmed it ("Move anyway"): the card in that lane, marked with who
 * (`by`), when (`at`, ISO), the rule's sentence and the lane it came from. Null when the move needs no override
 * (workshopCandidate has it) or when it is a hard limit (workshopHardLimit says why).
 */
export declare function workshopOverrideCandidate(board: Workshop, cardId: string, laneId: string, who: {
    by: string;
    at: string;
}): Workshop | null;
/**
 * A whole board sent to replace `before` (a kept chat proposal, an Undo) with its move-anyway marks made true by the
 * one who saves it: a card that moved past a rule is marked with `who` and the rule `before` refused it by; a mark on
 * a card that did not move stays as stored; a mark on a move no rule refused, or on a new card, is dropped. A page
 * never writes who moved a card anyway. A plan's task moved in time and a card nested under another are checked by the
 * edit that makes them (set_task, nest_card with override).
 */
export declare function workshopStampOverrides(before: Workshop, after: Workshop, who: {
    by: string;
    at: string;
}): Workshop;
/** What a card moved anyway says under its name: "Moved anyway by Sam · Nov 23". */
export declare function workshopOverrideLine(card: Pick<WorkshopCard, 'override'>): string | null;
/** Every lane the card may be dropped in, including the one it is in. */
export declare function workshopDestinations(board: Workshop, cardId: string): WorkshopLane[];
/** Why workshopCandidate refuses this move, as a sentence for the person moving the card. Null when the move is available. */
export declare function workshopRefusal(board: Workshop, cardId: string, laneId: string): string | null;
/**
 * Whether an ordinary note dropped on this board is offered to it. Every board is (boards S2b, owner: "notes
 * ALWAYS convert on boards"): a map makes it a card at the step (free of the paths: the token stays the only
 * piece they constrain), a release plan a feature with the points written on it. A board that truly cannot
 * hold one more card (a startup experience, whose cards are its interviews or its budget) refuses it in its
 * own sentence (workshopNoteRefusal), shown on the board, never ignored.
 */
export declare function workshopTakesNotes(_board: Workshop): boolean;
/**
 * Whether lines join this board's cards to notes and to each other: a board of plain lanes. A map's paths are its
 * lines, and a business board's, a release plan's and a startup experience's cards carry none.
 */
export declare function workshopTakesLines(board: Workshop): boolean;
/** An ordinary note offered to a lane: its id, its words and how it is drawn. */
export interface WorkshopNoteOffer {
    id: string;
    label: string;
    look?: WorkshopCardLook;
    /** What the note has that the card will not show (line breaks, shape, size), kept for its way back. */
    asNote?: WorkshopCardAsNote;
    /** The note's lines, with the note named by `id`: they stay joined to the card it becomes. */
    lines?: WorkshopLine[];
    /** Nest board: the card it was dropped on, to sit under. */
    under?: string;
    /** Launch or hiring plan: the calendar day (from the plan's first day) it was let go on: its task starts there, snapped by the plan's rules. */
    day?: number;
    /** Grid sheet: the cell it was let go on (1-based, as said): it becomes a tile there. */
    cell?: {
        row: number;
        col: number;
    };
}
/** Why `note` may not become a card in `laneId`, as a sentence; null when it may. */
export declare function workshopNoteRefusal(board: Workshop, laneId: string, note: WorkshopNoteOffer): string | null;
/** `lines` with every end named `from` renamed `to` (a note that became a card under another id, or the way back). */
export declare function workshopRenamedLines<T extends WorkshopLine[] | undefined>(lines: T, from: string, to: string): T;
/**
 * The board with `note` as a card in `laneId`, or null when the lane's rules refuse it
 * (workshopNoteRefusal says why). The card goes at the foot of the lane, or just before the
 * card `before` when that card is in the lane (a card put back by an undo returns to its
 * place). The card keeps the note's id where it can.
 */
export declare function workshopNoteCandidate(board: Workshop, laneId: string, note: WorkshopNoteOffer, before?: string): Workshop | null;
/**
 * The words a card takes back to the canvas as a note: none for a card made from an empty note and
 * still called by the board's name for a new item; the note's own words (line breaks and all) unless
 * the card has been renamed since; otherwise its words as the board writes them ("Copy · 3 days").
 */
export declare function workshopCardNoteWords(board: Workshop, card: WorkshopCard): string;
/** What a card says on the board: its name, with its points, days or amount. */
export declare function workshopCardText(board: Workshop, card: WorkshopCard): string;
/** The words a card takes back to the canvas as a note, numbers and all: "Copy · 3 days", "Acme · $25k". */
export declare function workshopCardNoteText(board: Workshop, card: WorkshopCard): string;
/** Why the card may not leave the lanes as an ordinary note; null when it may. */
export declare function workshopCardAsNoteRefusal(board: Workshop, cardId: string): string | null;
/**
 * The board without the card, for a card taken off the lanes as an ordinary note; null when it
 * must stay. The card's lines stay joined to the note, named `noteId` (the card's own id unless
 * the note had to take another): a line to another card stays on the board, and a line to an
 * ordinary note leaves it for the drawing (see workshopCardLines).
 */
export declare function workshopCardAsNote(board: Workshop, cardId: string, noteId?: string): Workshop | null;
/**
 * The lines of card `cardId` once it is the ordinary note `noteId`: those that stay on the board
 * (another card is at their other end) and those that leave it, joining two ordinary notes of the
 * drawing now. Both name the note by `noteId`.
 */
export declare function workshopCardLines(board: Workshop, cardId: string, noteId?: string): {
    stay: WorkshopLine[];
    leave: WorkshopLine[];
};
/** The lines of the board with `id` at either end. */
export declare function workshopLinesOf(board: Workshop, id: string): WorkshopLine[];
/** Why `line` may not be drawn on the board, as a sentence; null when it may. */
export declare function workshopLineRefusal(board: Workshop, line: WorkshopLine): string | null;
/** Why a board with a kind (a release plan, a map, a business board) takes no lines. */
export declare const workshopLinesSentence = "Lines join the cards of a lane workshop to notes and to each other.";
/** The board with `line` drawn, in place of a line with the same id; null when it may not be (see workshopLineRefusal). */
export declare function workshopWithLine(board: Workshop, line: WorkshopLine): Workshop | null;
/** The board without the line `lineId` (the same board when it has no such line). */
export declare function workshopWithoutLine(board: Workshop, lineId: string): Workshop;
/**
 * A new line from `parentId` to `childId` (a card, or an ordinary note), with an arrow at the
 * child as the canvas draws one. Its id is the canvas's own for a first line between the two, and
 * the next free one after that.
 */
export declare function workshopNewLine(board: Workshop, parentId: string, childId: string, look?: Partial<WorkshopLine>): WorkshopLine;
/** The board without card `cardId`'s lines: a card removed from the board takes its lines with it. */
export declare function workshopWithoutCardLines(board: Workshop, cardId: string): Workshop;
/**
 * The counter under a column's name: how full it is, or what its cards add up to. One format everywhere:
 * "2 / 3" with a limit, "2" without; a step whose cards came from notes says those apart ("1 / 1 · +2").
 * A screen reader hears it in words (workshopLaneSpoken).
 */
export declare function workshopLaneCaption(board: Workshop, laneId: string): string;
/** What a screen reader hears of a column's counter: "2 of 3", "2 cards", "1 of 1 · 2 cards", "5 of 8 points". */
export declare function workshopLaneSpoken(board: Workshop, laneId: string): string;
/** Whether a column holds as many as its limit lets it (its counter pill takes the header's colour). */
export declare function workshopLaneFull(board: Workshop, laneId: string): boolean;
export declare const workshopLayout: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
};
export declare const laneColors: string[];
/**
 * Where each lane starts. `held` (cards per lane on the committed board) keeps a map's
 * rows the height they had when a card was picked up, so no station moves under the pointer.
 */
export declare function workshopPositions(board: Workshop, layout?: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
}, stationGap?: number, held?: number[]): {
    points: {
        x: number;
        y: number;
    }[];
    width: number;
    height: number;
};
/** Start with two empty, editable lanes. IDs have no special meaning to the renderer. */
export declare function createLaneWorkshop(): Workshop;
export declare function nextWorkshopId(board: Workshop, prefix: string): string;
export declare function addWorkshopLane(input: Workshop, lane: Pick<WorkshopLane, 'label' | 'capacity'>): Workshop;
export declare function addWorkshopCard(input: Workshop, laneId: string, card: Pick<WorkshopCard, 'label' | 'allowedLaneIds'>): Workshop;
/** A fresh editable map, with enough structure to move a token or add a second path. */
export declare function createWorkshopMap(): Workshop;
/** Append a destination without moving any existing stations or relaxing token restrictions. */
export declare function addWorkshopBranch(board: Workshop, fromStationId: string, branch: {
    label: string;
    outcome: string;
    image?: StationImage;
}): Workshop;
export declare const nightTransfer: Workshop;
/** How the native artwork arranges a board's lanes. */
export interface WorkshopBoardLayout {
    /** Business boards: draw the narrow (phone) arrangement. */
    narrow?: boolean;
    /** Business boards: the world width the board should fill. */
    width?: number;
    /**
     * Plans: how wide a day is drawn, in world units. A grip being dragged (launch day) keeps the day width it
     * started with, so a later line draws the days it adds and the plan grows past `width`. Left out, the
     * plan's days fill `width`.
     */
    dayWidth?: number;
    /**
     * Plans: the widest a held grip may draw the plan (on a slate of many boards, the room before the next board).
     * A plan that would grow past it while held keeps this width and its days narrow instead. Left out, it grows.
     */
    maxWidth?: number;
    /**
     * A pipeline's gauge or a budget's envelope: the amount the board's width spans. A target or an envelope edge being
     * dragged keeps the scale it started with. Left out, the gauge fits target and forecast, and the envelope its total.
     */
    gaugeScale?: number;
    /** A budget whose start edge is held: the envelope's end stays where it was, and it grows or shrinks at the start. */
    gaugeAnchor?: 'start' | 'end';
    /**
     * How many lanes sit side by side before the next lane starts a new row. Leave it
     * out for every lane in one row. A narrow host passes 1 or 2 so each lane stays
     * wide enough to read. A map ignores it: its stations stay where they were authored.
     */
    lanesPerRow?: number;
}
/**
 * How the native artwork's notes are drawn, so they match the host's ordinary
 * notes. Anything left out is what an ordinary engine note gets (DEFAULT_NOTE_STYLE).
 * Sizes are world units: CSS pixels at 100% zoom.
 */
export interface WorkshopNoteStyle {
    /** Type family of every lane, caption and card. */
    fontFamily?: string;
    /** Card text. A label too long for its card at this size is set smaller, never below 11. */
    fontSize?: number;
    /** Lane names. Defaults to two more than the card text. */
    laneFontSize?: number;
    /** The caption under each lane name. Defaults to one less than the card text. */
    captionFontSize?: number;
    /** Text of lanes, captions and cards. */
    textColor?: string;
    /** Fill of the cards: the host's ordinary note fill. Defaults to an engine note's. */
    backgroundColor?: string;
    /** Outline of lane headers and cards. */
    borderColor?: string;
    borderWidth?: number;
    /** Corner radius of lane headers and cards; 0 is a square-cornered note. */
    cornerRadius?: number;
    /**
     * How cards are drawn when they should look like the host's own notes rather than like the
     * lanes: fill, text, type, border and corners. Overrides the fields above for cards only.
     */
    card?: WorkshopCardLook & {
        cornerRadius?: number;
    };
}
export interface WorkshopArtworkOptions {
    /**
     * Draw for a live slate instead of a presentation: notes in the canvas's own
     * type, a `caption-<lane>` line under each lane name, and a `column-<lane>`
     * shape behind each lane. Lane and card notes keep their `lane-<id>` and
     * `card-<id>` names.
     */
    native?: boolean;
    /** Where the artwork's top-left corner goes, in the slate's world units. */
    origin?: {
        x: number;
        y: number;
    };
    /**
     * Draw each lane column at least this many cards tall: one number for every
     * lane, or one per lane in lane order. A board keeps its shape (and its drop
     * zones) while a held card previews a board with shorter lanes.
     */
    rows?: number | number[];
    /** Native artwork only: wrap the lanes into rows. */
    layout?: WorkshopBoardLayout;
    /** Native artwork only: draw the notes in the host's note style. */
    style?: WorkshopNoteStyle;
    /**
     * Native artwork only: ids of the notes the slate's own document holds. A workshop
     * note whose name one of them already has is drawn under another id (see
     * workshopStandInId), so the artwork can be laid beside those notes as it is.
     */
    beside?: Iterable<string>;
    /**
     * The board's scope on a slate of many boards: every note is named `<scope>:<name>` (and its
     * connectors join those names). Left out, or `main`, the names are the ones a slate of one board has.
     */
    scope?: string;
}
/**
 * A board's scope on a slate of many boards, checked: 1 to 12 lowercase letters and digits. `main` (the
 * slate's first board) and no scope at all are the same thing: undefined, the names a slate of one board has.
 */
export declare function workshopBoardScope(scope?: string | null): string | undefined;
/** The id a board's note is drawn under: `<scope>:<name>`, or the name itself for the first board. */
export declare function workshopScopedId(name: string, scope?: string | null): string;
/** The names of one board's notes, in its scope. */
export interface WorkshopNodeNames {
    lane(id: string): string;
    card(id: string): string;
    image(id: string): string;
    caption(id: string): string;
    column(id: string): string;
    rules: string;
}
/**
 * The names of the notes workshopToSlate draws for a lane or a card. `of(scope)`: the same names for
 * one board of a slate that holds several (`b2:card-<id>`); `of('main')` and `of()` are these names.
 */
export declare const workshopNodeIds: {
    lane: (id: string) => string;
    card: (id: string) => string;
    image: (id: string) => string;
    caption: (id: string) => string;
    column: (id: string) => string;
    rules: string;
    of(scope?: string | null): WorkshopNodeNames;
};
/**
 * The id a workshop note takes when the slate's own document already has a note by
 * its name: `<name>--2`, or the first number after that which `taken` leaves free.
 * The document's note keeps its id. One rule for the live canvas and for every
 * drawing made of it.
 */
export declare function workshopStandInId(name: string, taken: (id: string) => boolean): string;
/** A note's outline: a box with rounded corners (none at radius 0). */
export declare function roundedBox(width: number, height: number, radius: number): string;
/** One lane's place in the native artwork: its column box from the artwork's origin, and its cell in the grid of lanes. */
export interface WorkshopLanePlace {
    laneId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    column: number;
    row: number;
}
/**
 * Where the native artwork puts each lane, in lane order, and how large the whole
 * board is. The same arithmetic workshopToSlate({ native: true }) draws with, for a
 * host that fits the board to its screen or needs to know which lane is above which.
 */
export declare function workshopLanePlaces(input: Workshop, options?: Pick<WorkshopArtworkOptions, 'layout' | 'rows'>): {
    places: WorkshopLanePlace[];
    width: number;
    height: number;
};
/**
 * A board of columns' header in a column at `place` (board coordinates): its name's box and its counter's (the limit's
 * value, between − and +). The rule controls stand around these (ruleControls.ts), the notes are drawn in them.
 */
export declare function workshopLaneHeader(board: Workshop, place: {
    laneId: string;
    x: number;
    y: number;
}, style?: Pick<WorkshopNoteStyle, 'fontSize' | 'captionFontSize'>): {
    label: HeaderBox;
    value: HeaderBox;
};
/**
 * The "How this board behaves" note of a board with a rulebook (behaviour.ts draws it); null without one. No board
 * draws it any more (a board's rules are its chrome: boardLegend); it stays for a host that shows the sentences.
 */
export declare function behaviourNote(board: Workshop, box: {
    x: number;
    y: number;
    width: number;
}, style?: WorkshopNoteStyle): NodeJSON | null;
/**
 * Draw a workshop as slate notes. With no options this is the presentation artwork
 * the app and its snapshots already consume; `{ native: true }` is the artwork
 * attachWorkshop keeps on a live slate.
 */
export declare function workshopToSlate(input: Workshop, options?: WorkshopArtworkOptions): SlateJSON;
/** What a board kit tells workshopReserve: its size in a layout (WorkshopBoardKit.places). */
export interface WorkshopReserveKit {
    places(board: Workshop, layout: WorkshopBoardLayout): {
        width: number;
        height: number;
    };
}
/**
 * The room a board needs on a slate of many boards: the widest it can become on a desktop, and how
 * tall it is now (a board grows downward only), in world units. A host places boards side by side
 * in these boxes, so one never grows into the next.
 * - A board of lanes: five lanes (the most a board has), or a map's own width when that is wider.
 * - A launch plan, hiring plan, pipeline, budget or nested board: its kit's desktop width (a launch
 *   plan's is 1200), or `layout.width` when the board is pinned to a width (a desktop layout's). It needs its kit.
 *   A plan held by a grip grows to the right under the pointer only as far as the next board allows
 *   (attachWorkshop's `avoid`, as `layout.maxWidth`); past that its days narrow, and it fits again when let go.
 * A phone's narrow layout is never the reserve: it is always smaller than the desktop one.
 */
export declare function workshopReserve(input: Workshop, layout?: WorkshopBoardLayout, kit?: WorkshopReserveKit): {
    width: number;
    height: number;
};
/**
 * Where a note set "beside a board" goes so it is clear of other boards: `spot` itself when nothing
 * in `avoid` is within `gap` of it on its row, otherwise moved along its row (to the right, or with
 * side -1 to the left) past each box in the way. Only x changes.
 */
export declare function workshopFreeSpot(spot: {
    x: number;
    y: number;
    width: number;
    height: number;
}, avoid: {
    x: number;
    y: number;
    width: number;
    height: number;
}[], side?: 1 | -1, gap?: number): {
    x: number;
    y: number;
};
export declare const industrialWorkshop: Workshop;
export * from './moonGallery';
export * from './darkroom/model';
export * from './edits';
export { said, listed, unquoted, named, countWord, pointing, workshopFinder, WorkshopReferenceError, type WorkshopFinder } from './names';
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop, type WorkshopCandidateChooser, type WorkshopChangeEvent, type WorkshopRefusalEvent, type WorkshopSelection, type WorkshopOverrideAsk, type WorkshopOverrideOffer, type WorkshopBoardKit, type PartPlace, type BoardLayer, type BoardLayerState, type HandleResult, registerRuleControls, type RuleControlsMode, type RuleControlsHooks } from './native';
export { createBoardLayer, layerInk, renderLayerShapes, type LayerShape } from './boardLayer';
export { boardLegend, boardChromeShapes, boardBadgeShapes, boardChromeLayout, boardChromeLabel, boardChromeStyles, chromeInk, DRAFT_TAG, boardChromeBox, chromeScaleAt, chromeTagScaleAt, CHROME_MAX_SCALE, CHROME_CHIPS_MAX_SCALE, type LegendItem, type LegendIcon, type ChromeOptions } from './boardChrome';
export type StartupExperience = {
    version: 1;
    kind: 'customer-interviews' | 'experiment-budget';
};
export declare const interviews: {
    id: string;
    who: string;
    quote: string;
    action: string;
    signal: string;
}[];
export declare const channels: {
    id: string;
    label: string;
    unit: string;
    single: string;
    per: number;
    rate: string;
}[];
export declare function createInterviewWorkshop(): Workshop;
export declare function createBudgetWorkshop(): Workshop;
/** Boards outside the versioned layouts stay editable with the ordinary lane renderer. */
export declare function startupExperienceKind(board: Workshop): "customer-interviews" | "experiment-budget" | undefined;
export declare function planStartupMove(board: Workshop, cardId: string, destination: string): Workshop | null;
export declare function workshopBudgetResult(board: Workshop, laneId: string): {
    amount: number;
    description: string;
} | null;
