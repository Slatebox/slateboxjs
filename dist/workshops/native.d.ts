/**
 * native.ts - run a workshop as real notes on a live Slate.
 *
 * attachWorkshop draws a validated workshop model onto a Slate the host already
 * has (pan, zoom, minimap, selection, inline editing and all) and keeps the notes
 * in step with the model. The model stays the one saved source of truth: the notes
 * are its drawing, they are never written into the slate's own document, and the
 * workshop's rules decide where a card may be dropped.
 *
 * Plain JavaScript, no React. The only thing it asks of the engine is the drag
 * policy in core/DragPolicy.ts.
 */
import type { NodeJSON } from '../core/Serialization';
import { type Workshop, type WorkshopBoardLayout, type WorkshopCardAsNote, type WorkshopCardLook, type WorkshopLine, type WorkshopNoteStyle } from './model';
import { type WorkshopEdit } from './edits';
/**
 * What a person changed. A move names the card and its new lane; a rename names the lane or
 * card and its new label. `noteToCard`: an ordinary note became card `cardId` at the foot of
 * `laneId`, or just before card `before` when that is where an undo puts it back (it left the
 * slate's drawing). `asNote` is what the note had that the card does not show (line breaks,
 * shape, size), kept for its way back. `cardToNote`: card `cardId` left the board and is now
 * the ordinary note `noteId` in the drawing. A note's lines stay joined to it either way:
 * `noteToCard.lines` are the note's lines as the drawing had them (a card's lines are the board's,
 * see Workshop.lines); `noteToCard.day` is the plan day the note was let go on, where its task starts. `line`: a person drew or changed a line with a card at one end (`set`), or
 * took one away (`remove`, its id). `via: 'undo'`: the change is this person's undo or redo putting
 * a trade back, not a gesture of their own (a host says nothing about it that a drop would).
 */
export interface WorkshopChangeEvent {
    cardId?: string;
    laneId?: string;
    rename?: {
        laneId?: string;
        cardId?: string;
        label: string;
    };
    noteToCard?: {
        noteId: string;
        label: string;
        look?: WorkshopCardLook;
        asNote?: WorkshopCardAsNote;
        before?: string;
        lines?: WorkshopLine[];
        under?: string;
        day?: number;
    };
    cardToNote?: {
        noteId: string;
    };
    line?: {
        set: WorkshopLine;
        remove?: undefined;
    } | {
        remove: string;
        set?: undefined;
    };
    /**
     * A business board's change as edits for applyWorkshopEdits (every drag, handle, key and rename on a
     * launch plan, pipeline or budget): a server applies them to its board as it stands, so two people
     * changing different tasks or deals both keep their change.
     */
    edits?: WorkshopEdit[];
    via?: 'undo';
    /** A move a rule refused, made anyway once the person confirmed it (confirmOverride): the server marks who and when. */
    override?: true;
}
/** A drop a rule refuses that may be made anyway: what confirmOverride shows the person. */
export interface WorkshopOverrideAsk {
    cardId: string;
    laneId: string;
    /** The card's and the lane's names. */
    card: string;
    lane: string;
    /** The rule's sentence: what moving it anyway breaks. */
    reason: string;
}
/** One note a board kit draws: its artwork name (lane-, card-, caption-, column-, handle-, gauge-), box from the origin and look. */
export interface PartPlace {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
    fill?: string;
    ink?: string;
    line?: string;
    lineWidth?: number;
    fontSize?: number;
}
/** What a board layer is told on each redraw. */
export interface BoardLayerState {
    origin: {
        x: number;
        y: number;
    };
    layout: WorkshopBoardLayout;
    /** A continuous drag held at a bound: the handle and the sentence shown beside it. */
    clamp: {
        name: string;
        text: string;
    } | null;
    /** The board on show is a preview the rules refuse. */
    refused: boolean;
    /** Draw above this element (the last lane column), so the layer sits under every other note. */
    above?: Element | null;
    /** A person clicked the arrow from `waitsOn` to `cardId` (launch plan). */
    onUnlink?(cardId: string, waitsOn: string): void;
    /** What the canvas shows of the board now, in board coordinates: words the board says are set inside it. */
    view?: {
        x: number;
        y: number;
        width: number;
        height: number;
    } | null;
    /** Say something to a screen reader (the slate's announcer). */
    announce?(text: string): void;
    /** The card the person is on: selected, under the pointer, or held by one of its grips (a plan shows that bar's grips). */
    focus?: string | null;
    /** The host has put the whole board in focus (setFocused): a kit shows what only a board in focus shows (a plan's span grips, a map's path controls). */
    boardFocused?: boolean;
    /** A map's path the person picked outside focus ("from>to"), outlined; the host offers "Change this board". */
    picked?: string | null;
    /** A map's grip size in board units: a finger's on screen at the zoom the board is shown at (mapGripSize). */
    gripSize?: number;
    /** A person picked a map's path (outside focus). */
    onPick?(key: string): void;
}
export interface BoardLayer {
    draw(board: Workshop, preview: Workshop | null, state: BoardLayerState): void;
    destroy(): void;
}
/** What a handle drag means at a pointer position: the board to show, and why it stops when it is held at a bound. */
export interface HandleResult {
    next: Workshop;
    clampedReason?: string;
    refusal?: string;
    /** The layout to draw `next` in while the grip is held (a plan's line keeps its day width and the plan grows); left out, the board's own. */
    layout?: WorkshopBoardLayout;
}
/**
 * Everything a business board (launch plan, pipeline, budget) adds to the native drawing: where its
 * notes go, its board layer, its Dragology chooser and handles, and its keys. Kits come from
 * slateboxjs/boards (kitFor(kind)), loaded only for a slate that holds one of these boards.
 */
export interface WorkshopBoardKit {
    places(board: Workshop, layout: WorkshopBoardLayout): {
        parts: PartPlace[];
        width: number;
        height: number;
    };
    /** The parts as slate notes at `origin`, in the host's note style. */
    notes(board: Workshop, layout: WorkshopBoardLayout, origin: {
        x: number;
        y: number;
    }, style: WorkshopNoteStyle): NodeJSON[];
    /** The edits that turn one board into another (WorkshopChangeEvent.edits). */
    editsBetween(before: Workshop, after: Workshop): WorkshopEdit[];
    /** What a screen reader calls a handle. */
    label?(board: Workshop, part: string): string | null;
    layer(slate: any): BoardLayer;
    /** Always used for this kind: the lane under the pointer is never the whole answer. */
    chooser: WorkshopCandidateChooser;
    /**
     * Why a drop at this point is refused (an illegal stage, a task that may not wait on that one); null when it is not.
     * `lands`: the chooser still places the card where the rules let it (a plan's bar stops at its line or hops a
     * freeze), and the reason is said beside it; when that place is where the card already is, the drop is refused.
     */
    refusalAt(board: Workshop, cardId: string, grab: {
        x: number;
        y: number;
    }, point: {
        x: number;
        y: number;
    }, layout: WorkshopBoardLayout): {
        laneId: string;
        reason: string;
        lands?: boolean;
    } | null;
    handleDrag(board: Workshop, handleId: string, grab: {
        x: number;
        y: number;
    }, layout: WorkshopBoardLayout): ((point: {
        x: number;
        y: number;
    }) => HandleResult) | null;
    keyEdit?(board: Workshop, part: string, key: {
        key: string;
        shiftKey: boolean;
    }): WorkshopEdit[] | null;
    /**
     * A key that offers a choice on a focused part (a launch plan's L: what this task waits on). Null when
     * the key means nothing here; a sentence when there is nothing to choose. The key again offers the next
     * choice, Enter makes it, Escape cancels.
     */
    keyChoices?(board: Workshop, part: string, key: string): {
        said: string;
        edits: WorkshopEdit[];
    }[] | string | null;
    /** What a screen reader is told a focused card's keys do, after its name. */
    cardKeys?: string;
    /** Outline the lanes a held card may go to. Off for a launch plan, where every team takes every task. */
    laneCues: boolean;
    /** The card a part belongs to (a card, or one of its grips); null for any other part. Left out, only a card's own note. */
    cardOfPart?(board: Workshop, part: string): string | null;
    /** A nest board: the card an ordinary note dropped at this point sits under; null for none. */
    noteUnder?(board: Workshop, point: {
        x: number;
        y: number;
    }, layout: WorkshopBoardLayout): string | null;
    /** A plan: the calendar day (a fraction, from its first day) under this point, where a note dropped there starts; null off the days. */
    noteDay?(board: Workshop, point: {
        x: number;
        y: number;
    }, layout: WorkshopBoardLayout): number | null;
}
/**
 * A change the workshop's rules did not allow, with the reason as a sentence (empty when a card
 * that cannot become a note was dropped outside every lane). `noteId` names an ordinary note
 * a lane refused.
 */
export interface WorkshopRefusalEvent {
    cardId?: string;
    noteId?: string;
    laneId?: string | null;
    rename?: {
        laneId?: string;
        cardId?: string;
        label: string;
    };
    reason: string;
}
/**
 * The one workshop note that is selected: a card or a lane; or a map's path the person picked (outside focus,
 * where a path is fixed: the host offers "Change this board"). Null when the selection is anything else.
 */
export type WorkshopSelection = {
    cardId: string;
} | {
    laneId: string;
} | {
    path: {
        from: string;
        to: string;
    };
} | null;
/**
 * Chooses the board a pointer position means while a card is held. Called once as
 * the drag begins with the board, the card and where on the card it was grabbed;
 * returns a function from a pointer position (in board coordinates: world units
 * from the artwork's origin) to the board that a drop there would produce. Return
 * null to leave the choice to the lane under the pointer.
 */
export type WorkshopCandidateChooser = (board: Workshop, cardId: string, grab: {
    x: number;
    y: number;
}, layout?: WorkshopBoardLayout) => ((point: {
    x: number;
    y: number;
}) => Workshop) | null;
export interface AttachWorkshopOptions {
    /**
     * A move, rename or conversion was committed. `next` is validated; the host persists it.
     * For a conversion, return a promise of what the save came to. The conversion shows on this
     * screen at once, but collaborators (and the slate's onSlateChanged) hear of it only once
     * the promise says true; until then the slate holds its drawing saves (Slate.whenHeldSettled).
     * A host that returns no promise has saved it already.
     * - true: it was saved, and is sent to collaborators.
     * - false (or a rejected promise): it was refused. The drawing is put back (the note returns to the canvas, or
     *   leaves it again). The board is put back too, unless the host has drawn a newer one.
     * - 'taken': someone else made this same trade first (they put the note in a lane, or took
     *   the card off the lanes). This person's copy of the note leaves the canvas, nothing is
     *   brought back, and the board is the host's to draw.
     * - anything else (the host went away before it knew): nothing is sent or put back.
     */
    onChange?: (next: Workshop, change: WorkshopChangeEvent) => void | Promise<boolean | 'taken' | void>;
    /** A drop or rename was refused. */
    onRefuse?: (refusal: WorkshopRefusalEvent) => void;
    /**
     * A drop a rule refuses on a lane board or a map, which the person may make anyway: show them the rule's sentence
     * with "Move anyway" and "Cancel", and answer true (or a promise of true) to move it. The card goes back first, as
     * a refused drop does; confirmed, it moves and is marked with who (overrideBy) and when, and onChange hears it with
     * `override: true`. Left out, a refused drop is only refused. A hard limit (model.ts workshopHardLimit) is never offered.
     */
    confirmOverride?: (ask: WorkshopOverrideAsk) => boolean | Promise<boolean>;
    /** The name a card moved anyway is marked with on this screen (the server stamps its own). Left out, "You". */
    overrideBy?: () => string;
    /** The board a held or keyboard-staged card would produce, or null when there is none. */
    onPreview?: (candidate: Workshop | null) => void;
    /** Draw the same artwork with nothing draggable or editable. */
    readOnly?: boolean;
    /** Top-left corner of the artwork in world units. Defaults to the right of what the slate already holds. */
    origin?: {
        x: number;
        y: number;
    };
    /** Replace how a pointer position picks among the legal boards (see dragologyCandidates). */
    chooseCandidate?: WorkshopCandidateChooser;
    /** Wrap the lanes into rows, for a host too narrow for all of them side by side. Change it later with setLayout. */
    layout?: WorkshopBoardLayout;
    /** Draw lanes and cards in the host's note style. What is left out is what an ordinary engine note gets. */
    style?: WorkshopNoteStyle;
    /**
     * The selection came to rest on one card or one lane of this workshop, moved from
     * one to another, or left them (null): for a host that talks about what is
     * selected. Also called with null when the workshop is destroyed with one selected.
     */
    onSelect?: (selection: WorkshopSelection) => void;
    /** Required for a launch plan, a pipeline or a budget: its kit from slateboxjs/boards. */
    kit?: WorkshopBoardKit;
    /**
     * The board's scope on a slate of many boards (1 to 12 lowercase letters and digits): each of its notes
     * is named `<scope>:<name>` (`b2:card-<id>`, see workshopNodeIds.of), so two boards made from one preset
     * never share a name, and a board only ever treats its own notes as its parts. Left out, or `main`, the
     * notes keep the names a slate of one board has always had.
     */
    scope?: string;
    /**
     * The boxes (world units) a note this board puts "beside the board" must stay clear of: the other boards
     * on the slate. Asked each time (a card taken to the canvas, a note a lane refuses, a keyboard move off
     * the lanes, a card let go on top of another board); the note goes past them along its row.
     */
    avoid?: () => {
        x: number;
        y: number;
        width: number;
        height: number;
    }[];
    /**
     * Draw the board as a draft not yet added (a library preview): view-only, its notes see-through
     * (`data-workshop-draft`), inside a dashed frame tagged "Preview · not added yet".
     */
    draft?: boolean;
    /**
     * Draw the board as a still picture (a slate's card in a list, a thumbnail): view-only, and its chrome at the
     * board's own size whatever the zoom, as an export shows it, so a card shrinks the title with the board instead of
     * growing it to stay readable as the live canvas does when zoomed out. Not redrawn as the view changes.
     */
    still?: boolean;
    /**
     * Draw the board's chrome: its title and its rules as a legend above it, badges where the rules act, and the
     * frame of a board in focus or of a draft (boardChrome.ts). Drawn from data, never saved. On unless false.
     */
    chrome?: boolean;
    /** A person pressed "Done" on the frame of the board in focus: the host takes it out of focus. */
    onFocusDone?: () => void;
}
export interface AttachedWorkshop {
    /** Redraw from a new model, moving only what changed. A drag in progress is cancelled first. */
    update(next: Workshop): void;
    /** Show a proposed model without committing it; null restores the committed one. Cards cannot be moved while a proposal is shown. */
    preview(candidate: Workshop | null): void;
    /** Switch between playable and view-only. */
    setReadOnly(readOnly: boolean): void;
    /**
     * Show the refusal cue on a lane (outline, reason on its caption, announcement)
     * for a move the host itself had to turn down, such as a save that lost a race.
     */
    refuse(laneId: string, reason: string): void;
    /**
     * Arrange the lanes differently (a phone turned on its side, a pane opened beside
     * the canvas). The same notes glide to their new places; a drag in progress is
     * cancelled first.
     */
    setLayout(layout: WorkshopBoardLayout): void;
    /**
     * Take a card off the lanes as an ordinary note just beside the board, as a drop on the
     * canvas would (a conversation's "make this a note"). Null when it was done; otherwise the
     * reason it stays a card.
     */
    toCanvas(cardId: string): string | null;
    /** Remove the workshop's notes and its policy. Every other note on the slate is left as it was. */
    destroy(): void;
    /** The committed model. */
    readonly value: Workshop;
    /** Where the artwork's top-left corner is, in world units. */
    readonly origin: {
        x: number;
        y: number;
    };
    /** The layout in use. */
    readonly layout: WorkshopBoardLayout;
    /** The box the committed board fills in the current layout, in world units (for slate.fitToWidth). */
    readonly bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /**
     * The box the board and its chrome fill (world units): the bounds, grown upward by the title row and legend, and
     * out by the frame while the board is in focus or a draft. What a host fits to, so the title is never cut off.
     */
    readonly frame: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    /** Resolves once the artwork for the current model is on the slate. */
    whenDrawn(): Promise<void>;
    /**
     * Put the board in focus (true) or take it out (false): the host's "Change this board" is about
     * this board. Every note of the board carries `data-workshop-focused` while it is in focus, through
     * redraws, so a kit can show what only a focused board shows and assistive tools can tell. Focus
     * changes nothing a person can move; it is the host's to give and to take away.
     */
    setFocused(focused: boolean): void;
    /** Whether the board is in focus (setFocused). */
    readonly focused: boolean;
}
/**
 * Draw `workshop` on `slate` as native notes and let people play it.
 *
 * @example
 * const board = attachWorkshop(slate, model, {
 *   onChange: (next, change) => save(next),
 *   onRefuse: ({ reason }) => toast(reason),
 * })
 * board.update(modelFromServer)
 * board.destroy()
 */
export declare function attachWorkshop(slate: any, workshop: Workshop, options?: AttachWorkshopOptions): AttachedWorkshop;
