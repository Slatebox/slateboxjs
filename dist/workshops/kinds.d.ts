import type { BusinessBoardKind, Workshop, WorkshopCard, WorkshopLane, WorkshopNoteStyle } from './model';
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
    /** The board a card's move makes, `board` when it is there already, or null when the rule refuses. */
    planMove(board: Workshop, cardId: string, laneId: string): Workshop | null;
    /** Why planMove refuses, as a sentence. */
    refusal?(board: Workshop, cardId: string, laneId: string): string | null;
    /** The second line under a lane's name. */
    caption(board: Workshop, laneId: string): string;
    /** What a card says on the board, and as a note again off it ("Copy · 3 days"). */
    cardText(board: Workshop, card: WorkshopCard): string;
    noteText(board: Workshop, card: WorkshopCard): string;
    /** The add_card fields a note's words make (its name and the number written on it), or why it can't become a card. */
    fromNote(board: Workshop, text: string): {
        label: string;
        duration?: number;
        amount?: number;
    } | string;
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
}
export interface PlanWords {
    day(board: Workshop, text: string, after?: number): number | null;
    iso(board: Workshop, day: number): string;
    name(board: Workshop, day: number): string;
    startLag?(board: Workshop, cardId: string, day: number): number;
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
