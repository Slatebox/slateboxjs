export * from './offlineHandoff';
export * from './listeningRoom';
export { releaseLoad, releasePlan } from './release';
import type { Behaviour } from './behaviour';
export type { Behaviour, BehaviourRule, BehaviourVerdict, RuleAudit, RuleBody, RuleInput, RuleKindId, WorkshopMoveCheck } from './behaviour';
export { registerRulebook, rulebook, rulebookLoaded, registerWorkshopRules, workshopRulesLoaded, workshopRules, type RulebookHooks, type BusinessBoardRules, type BusinessEditStep, type BusinessEditTools, type WorkshopFieldReader, type WorkshopLimits } from './kinds';
import type { NodeJSON, SlateJSON } from '../core/Serialization';
import { DEFAULT_NOTE_STYLE } from '../core/NoteDefaults';
/** How the engine draws an ordinary note when nothing says otherwise: what a card looks like with no style. */
export { DEFAULT_NOTE_STYLE };
export interface StationImage {
    src: string;
    alt: string;
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
    /** How the card is drawn when it differs from the board's: the look of the note it was made from. */
    look?: WorkshopCardLook;
    /** What the note it was made from had that a card does not show, so it comes back as it was. */
    asNote?: WorkshopCardAsNote;
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
    /** How the board behaves, as data: its rulebook (behaviour.ts). Lane boards and pipelines only. */
    behaviour?: Behaviour;
}
/** The kinds of board with rules of their own. A board without a kind is a board of plain lanes. */
export type WorkshopKind = 'release-plan' | 'launch-plan' | 'pipeline' | 'budget' | 'hiring-plan';
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
export type BusinessBoardKind = 'launch-plan' | 'pipeline' | 'budget' | 'hiring-plan';
export declare const businessBoardKinds: readonly BusinessBoardKind[];
export declare function businessKind(board: Pick<Workshop, 'kind'>): BusinessBoardKind | undefined;
/** The parts of a note's look a card can keep; anything a card cannot draw is left out. Undefined when nothing is left. */
export declare function workshopCardLookOf(input: Record<string, unknown>): WorkshopCardLook | undefined;
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
/** Describe each authored viewpoint from the committed state, including empty lanes. */
export declare function workshopPresentationScenes(board: Workshop): WorkshopPresentationScene[];
export declare const maxWorkshopCards = 24;
export declare function validateWorkshop(input: unknown): Workshop;
/** Build the fragment for /new/workshop from portable workshop data. */
export declare function encodeWorkshopFragment(value: Workshop): string;
/** Read location.hash before creating a slate. Only the validated model is imported. */
export declare function decodeWorkshopFragment(fragment: string): Workshop;
export declare function availableLanes(board: Workshop, card: WorkshopCard): WorkshopLane[];
export declare function moveWorkshopCard(board: Workshop, cardId: string, laneId: string): Workshop;
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
/** Every lane the card may be dropped in, including the one it is in. */
export declare function workshopDestinations(board: Workshop, cardId: string): WorkshopLane[];
/** Why workshopCandidate refuses this move, as a sentence for the person moving the card. Null when the move is available. */
export declare function workshopRefusal(board: Workshop, cardId: string, laneId: string): string | null;
/**
 * Whether ordinary notes and this board's cards are the same thing: a board of plain lanes.
 * A map's token, a release plan's features (they need points) and a startup experience's
 * cards are pieces of their own and are not made from notes.
 */
export declare function workshopTakesNotes(board: Workshop): boolean;
/** An ordinary note offered to a lane: its id, its words and how it is drawn. */
export interface WorkshopNoteOffer {
    id: string;
    label: string;
    look?: WorkshopCardLook;
    /** What the note has that the card will not show (line breaks, shape, size), kept for its way back. */
    asNote?: WorkshopCardAsNote;
}
/** Why `note` may not become a card in `laneId`, as a sentence; null when it may. */
export declare function workshopNoteRefusal(board: Workshop, laneId: string, note: WorkshopNoteOffer): string | null;
/**
 * The board with `note` as a card in `laneId`, or null when the lane's rules refuse it
 * (workshopNoteRefusal says why). The card goes at the foot of the lane, or just before the
 * card `before` when that card is in the lane (a card put back by an undo returns to its
 * place). The card keeps the note's id where it can.
 */
export declare function workshopNoteCandidate(board: Workshop, laneId: string, note: WorkshopNoteOffer, before?: string): Workshop | null;
/** What a card says on the board: its name, with its points, days or amount. */
export declare function workshopCardText(board: Workshop, card: WorkshopCard): string;
/** The words a card takes back to the canvas as a note, numbers and all: "Copy · 3 days", "Acme · $25k". */
export declare function workshopCardNoteText(board: Workshop, card: WorkshopCard): string;
/** Why the card may not leave the lanes as an ordinary note; null when it may. */
export declare function workshopCardAsNoteRefusal(board: Workshop, cardId: string): string | null;
/** The board without the card, for a card taken off the lanes as an ordinary note; null when it must stay. */
export declare function workshopCardAsNote(board: Workshop, cardId: string): Workshop | null;
/** The second line under a lane's name: how full it is, or what its cards add up to. */
export declare function workshopLaneCaption(board: Workshop, laneId: string): string;
export declare const workshopLayout: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
};
export declare const laneColors: string[];
export declare function workshopPositions(board: Workshop, layout?: {
    pitch: number;
    width: number;
    row: number;
    height: number;
    top: number;
}, stationGap?: number): {
    points: {
        x: number;
        y: number;
    }[];
    width: number;
    height: number;
};
/** Start with two empty, editable lanes. IDs have no special meaning to the renderer. */
export declare function createLaneWorkshop(): Workshop;
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
}
/** The names of the notes workshopToSlate draws for a lane or a card. */
export declare const workshopNodeIds: {
    lane: (id: string) => string;
    card: (id: string) => string;
    image: (id: string) => string;
    caption: (id: string) => string;
    column: (id: string) => string;
    rules: string;
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
/** The "How this board behaves" note of a board with a rulebook (behaviour.ts draws it); null without one. */
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
export declare const industrialWorkshop: Workshop;
export * from './moonGallery';
export * from './darkroom/model';
export * from './edits';
export { said, listed, unquoted, named, countWord, pointing, workshopFinder, WorkshopReferenceError, type WorkshopFinder } from './names';
export { attachWorkshop, type AttachWorkshopOptions, type AttachedWorkshop, type WorkshopCandidateChooser, type WorkshopChangeEvent, type WorkshopRefusalEvent, type WorkshopSelection, type WorkshopBoardKit, type PartPlace, type BoardLayer, type BoardLayerState, type HandleResult } from './native';
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
