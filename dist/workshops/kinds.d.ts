import type { BusinessBoardKind, Workshop, WorkshopCard, WorkshopLane, WorkshopNoteOffer, WorkshopNoteStyle } from './model';
import type { NodeJSON } from '../core/Serialization';
import type { WorkshopEdit, WorkshopEditRefusalCode, WorkshopRef } from './edits';
import type { Behaviour, BehaviourVerdict, RuleAudit, WorkshopMoveCheck } from './behaviour';
/** A numeric edit's legal range, with the sentence a person gets at each end. */
export interface WorkshopLimits {
    field: string;
    min: number;
    max: number;
    reasons: {
        min?: string;
        max?: string;
    };
}
/** The model's own reader for stored ids, so a rule module checks them as the gate does. */
export interface WorkshopFieldReader {
    id(value: unknown): string;
}
/** What one business edit made: the board, the sentence a person is told, and the ids it concerned. */
export interface BusinessEditStep {
    board: Workshop;
    said: string;
    changed?: boolean;
    laneId?: string;
    cardId?: string;
}
/** What the edit reducer lends a rule module while it makes one edit. */
export interface BusinessEditTools {
    card(ref: WorkshopRef): WorkshopCard;
    lane(ref: WorkshopRef): WorkshopLane;
    /** Refuse the edit with the sentence a person sees. Nothing of the list is made. */
    refuse(reason: string, at?: {
        laneId?: string | null;
        cardId?: string;
        limits?: WorkshopLimits;
        code?: WorkshopEditRefusalCode;
    }): never;
    /** The board through validateWorkshop, or a refusal in the model's words. */
    settle(board: Workshop, laneId?: string | null, cardId?: string): Workshop;
    done(board: Workshop, said: string, ids?: {
        laneId?: string;
        cardId?: string;
    }): BusinessEditStep;
    /** Who makes the edit, and when: the mark a move made anyway carries (model.ts workshopOverrideMark). */
    who?: {
        by: string;
        at: string;
    };
}
/** Everything the gate asks of one kind of business board. Pure: no DOM, no drawing. */
export interface BusinessBoardRules {
    kind: BusinessBoardKind;
    /** The most cards the board holds, and the sentence past it. */
    cards: [number, string];
    /** Read the kind's own fields of a stored lane, card and board (validateWorkshop keeps only these). */
    readLane?(raw: Record<string, unknown>, lane: WorkshopLane, read: WorkshopFieldReader): void;
    readCard(raw: Record<string, unknown>, card: WorkshopCard, read: WorkshopFieldReader): void;
    readBoard(raw: Record<string, unknown>, board: Workshop, read: WorkshopFieldReader): void;
    /** The kind's rule over the whole board: null when it holds, otherwise the sentence. */
    validate(board: Workshop): string | null;
    /**
     * Whether card `cardId` still stands past one of the kind's own rules that validate lets through (a plan's task
     * that ends after its line or starts before what it waits on ends): an ordinary edit keeps its move-anyway mark then
     * (model.ts workshopShedMark).
     */
    pastRule?(board: Workshop, cardId: string): boolean;
    /** The board a card's move makes, `board` when it is there already, or null when the rule refuses. */
    planMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
    /** Why planMove refuses, as a sentence. */
    refusal?(board: Workshop, cardId: string, laneId: string): string | null;
    /** The second line under a lane's name. */
    caption(board: Workshop, laneId: string): string;
    /** What a card says on the board, and as a note again off it ("Copy · 3 days"). */
    cardText(board: Workshop, card: WorkshopCard): string;
    noteText(board: Workshop, card: WorkshopCard): string;
    /**
     * The add_card fields a note's words make (its name and the number written on it), or why it can't become a card.
     * `unnamed` is the name a card takes when the note has no words of its own (empty, or only a number): see newCard.
     */
    fromNote(board: Workshop, text: string, unnamed: string, note?: WorkshopNoteOffer): {
        label: string;
        duration?: number;
        amount?: number;
        type?: string;
        body?: string;
        image?: {
            src: string;
            alt: string;
        };
    } | string;
    /** A plan: the board with card `cardId` (just made from a note, at the plan's start) starting on calendar `day`, as near as the plan's rules let it. */
    landNote?(board: Workshop, cardId: string, day: number): Workshop;
    /**
     * The board's own word for a new item ("hire", "task", "deal"): the catalog adds cards with it ("Add a hire"), and a
     * card made without words is named with it ("New hire"). `under` is the card a nested board's card goes under.
     */
    newCard(board: Workshop, under?: string): string;
    /** A card's new words: its name, and the edits the numbers typed on it make. */
    renamed(board: Workshop, cardId: string, text: string): {
        label: string;
        edits: WorkshopEdit[];
    };
    /** Make one of the kind's own edits (and add_card); null for an edit the generic reducer makes. */
    edit(board: Workshop, edit: WorkshopEdit, tools: BusinessEditTools): BusinessEditStep | null;
    /** The kind's own rule kinds (a plan's time rules): the rulebook asks these for a board of this kind. */
    rulebook?: RuleFamily;
    /** Where every card may be dragged to, as one string: two boards drag alike when these are equal (a plan's legal runs). */
    drags?(board: Workshop): string;
    /**
     * A plan's words, for a chat that does not load the plans itself: the day offset a date names ("Dec 20",
     * "May", on or after `after`), its ISO date and short name, the lag that starts a hire on a day, a band by name.
     */
    words?: PlanWords;
    /** What a whole-board save may not change on this kind (no edit changes it), as a sentence; null when it keeps it. */
    fixed?(before: Workshop, after: Workshop): string | null;
    /** A nested board: the cards at the top of an area in the order they are drawn (ranked by its rank rule). */
    order?(board: Workshop, laneId: string): string[];
}
export interface PlanWords {
    day(board: Workshop, text: string, after?: number): number | null;
    iso(board: Workshop, day: number): string;
    name(board: Workshop, day: number): string;
    startLag?(board: Workshop, cardId: string, day: number): number;
    /** The calendar day a task can first start (what it waits on has ended), and the lag that starts it on `day` (the first working day from it). */
    readyDay?(board: Workshop, cardId: string): number;
    lagAt?(board: Workshop, cardId: string, day: number): number;
    band?(board: Workshop, name: string): {
        id: string;
        label: string;
        lane: string;
    } | undefined;
}
/**
 * Rule kinds a board kind brings with its rules module (timeRules.ts: deadline, overlap, snap,
 * workdays, blackout, cascade, locked). The rulebook (behaviour.ts) reads, says and checks a board's
 * rules through these, so its own chunk does not carry them.
 */
export interface RuleFamily {
    /** add_rule's body keys per rule kind ("at floor"). */
    keys: Record<string, string>;
    /** A stored rule of one of these kinds, read (throws the sentence a person is given). */
    read(rule: Record<string, unknown>, base: Record<string, unknown>, board: Workshop, laneId: (value: unknown) => string): Behaviour['rules'][number];
    sentence(rule: Behaviour['rules'][number], board: Workshop): string;
    /** A rulebook that contradicts itself, as a sentence. */
    contradiction(behaviour: Behaviour, board: Workshop): string | null;
    /** Whether `after` keeps the rules of `before`. */
    check(before: Workshop, after: Workshop): BehaviourVerdict;
    /** The note's lines for a board of this kind with no rulebook (its built-in rules). */
    builtIn(board: Workshop): string[];
}
/** Plug a kind's rules into the gate. Each rule module calls it once when it loads. */
export declare function registerWorkshopRules(rules: BusinessBoardRules): void;
/** Whether a kind's rules have loaded here (in a browser, with its kit). */
export declare function workshopRulesLoaded(kind: string | undefined): boolean;
/**
 * The name a card takes when it is made without words: an empty note dropped on a board, or add_card with no
 * label from chat or exec. It is the board's own word for a new item, "New hire" on a hiring plan, "New task" on
 * a launch plan, "New card" on lanes, "New stop" on a map. Notes always become cards on boards, empty or not.
 */
export declare function workshopNewCardName(board: Pick<Workshop, 'kind' | 'lanes'> & Partial<Workshop>, under?: string): string;
/** The rules of a business board's kind. Throws while they have not loaded. */
export declare function workshopRules(kind: BusinessBoardKind): BusinessBoardRules;
/**
 * The rulebook (behaviour.ts): how a lane board or pipeline behaves, as data. It loads on its own
 * (slateboxjs/workshops/behaviour), for a board that has rules and on a server, so a slate without one never
 * downloads it. Until it has loaded, a board that carries rules can't be read: the gate refuses it.
 */
export interface RulebookHooks {
    validate(input: unknown, board: Workshop): Behaviour;
    check(before: Workshop, after: Workshop): BehaviourVerdict;
    laneLimit(board: Workshop, laneId: string): number | undefined;
    lines(board: Workshop): string[];
    dropLane(behaviour: Behaviour, laneId: string): Behaviour;
    edit(board: Workshop, edit: WorkshopEdit, audit: RuleAudit, tools: Pick<BusinessEditTools, 'lane' | 'card' | 'refuse' | 'done'>): BusinessEditStep;
    note(board: Workshop, box: {
        x: number;
        y: number;
        width: number;
    }, style: WorkshopNoteStyle): NodeJSON | null;
    setLimit(board: Workshop, laneId: string, capacity: number | null, audit: RuleAudit): Workshop | string | null;
    /** check_move: whether a card may go to a lane, and which rule says no. */
    move(board: Workshop, card: WorkshopRef, lane: WorkshopRef): WorkshopMoveCheck;
    /** checkWorkshopReplacement's rulebook part: a sentence, or null. */
    replacement(original: Workshop, next: Workshop): string | null;
    /** The diff a rule edit is previewed as. */
    diff(before: Workshop, after: Workshop): {
        from: number;
        to: number;
        lines: string[];
        over: string[];
    };
}
export declare function registerRulebook(hooks: RulebookHooks): void;
export declare function rulebookLoaded(): boolean;
export declare function rulebook(): RulebookHooks;
