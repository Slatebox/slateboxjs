import type { Behaviour, BehaviourRule, BehaviourVerdict, WorkshopMoveCheck } from './behaviour';
import type { NestFields, Workshop, WorkshopCard } from './model';
import type { BusinessBoardRules, BusinessEditTools, RuleFamily } from './kinds';
import type { WorkshopEdit, WorkshopEditField, WorkshopEditKind, WorkshopEditKindName, WorkshopRef } from './edits';
export { orderBetween, orderKeys, byOrder, isOrderKey } from './order';
type Rule = BehaviourRule;
type Board = Workshop;
/** A role: lowercase words, such as "pile", "opportunity" or "root cause". */
export declare function roleOf(value: unknown): string;
type Verdict = BehaviourVerdict;
export interface NestPlus {
    keys: Record<string, string>;
    read(rule: Record<string, unknown>, base: Record<string, unknown>, board: Board): Rule | null;
    sentence(rule: Rule, board: Board): string | null;
    /** Its rules' check, after the core rules: a refusal, or warnings added to `warnings`. */
    check(before: Board, after: Board, warnings: string[]): Verdict | null;
    contradiction(behaviour: Behaviour, board: Board): string | null;
    readBoard(raw: Record<string, unknown>, out: NestFields, read: {
        id(value: unknown): string;
    }): void;
    readCard(raw: Record<string, unknown>, card: WorkshopCard, read: {
        id(value: unknown): string;
    }): void;
    validate(board: Board): string | null;
    edit(board: Board, edit: WorkshopEdit, t: BusinessEditTools, settle: (next: Board, laneId?: string | null, cardId?: string) => Board): ReturnType<BusinessBoardRules['edit']>;
    cardText(board: Board, card: WorkshopCard): string | null;
    drags(board: Board): string | null;
    caption(board: Board, laneId: string): string | null;
}
/** Plug in nestPlus.ts (it calls this once as it loads). */
export declare function registerNestPlus(more: NestPlus): void;
/** The board's two areas: where cards are placed, and the tray of cards not placed yet. */
export declare const nestAreas: (board: Pick<Board, "lanes">) => {
    main: string;
    tray: string;
};
/** The cards directly under `parentId` (or at the top of `laneId`), in their order. */
export declare function nestKids(board: Board, parentId: string | null, laneId?: string): WorkshopCard[];
/** A card and every card under it, the card first. */
export declare function nestSubtree(board: Board, id: string): string[];
/** How many cards a card sits under (0 at the top). */
export declare function nestDepth(board: Board, id: string): number;
/** What a pile counts: its notes, the customers they came from, or a number field (each customer once). */
export declare function nestMeasure(board: Board, id: string, by: string): number;
/** "5 notes", "4 customers", "$84k ARR". */
export declare function nestMeasureWords(board: Board, by: string, n: number): string;
/** The top of an area as it is drawn: by the rank rule's measure (most first), then by order. */
export declare function nestRoots(board: Board, laneId: string): WorkshopCard[];
/** Where a card goes: under a card, or at the top of an area; before a sibling, or last. */
export interface NestSpot {
    laneId: string;
    under: string | null;
    before: string | null;
}
/**
 * The board with `cardId` (and everything under it) at `spot`, its key between its new neighbours. Null when
 * the spot can't hold it: under itself or a card under it, a card that is gone, or the tray for a card with
 * cards under it (the tray holds loose cards). The board itself when the card is there already.
 */
export declare function nestPlace(board: Board, cardId: string, spot: NestSpot): Board | null;
/**
 * Siblings whose keys have grown long get fresh short keys, in the same order. A key put at one end of a
 * list again and again grows by a character every few moves; without this a card moved to the end of a pile
 * a few hundred times would carry a key too long to keep, and the board could no longer be saved.
 */
export declare function tidyKeys(board: Board): Board;
/** The structure every nest board keeps, rules or not: null when it holds, otherwise the sentence. */
export declare function validateNest(board: Board): string | null;
/** What one rule says: the caption, the refusal, the note's line, the loop's caption. */
export declare function nestSentence(rule: Rule, board: Board): string;
/**
 * Whether `after` keeps the rules `before` has, for every card that arrived somewhere (a new parent, area
 * or role, or new): one rule named per refusal, by a fixed order; a rule that only warns lets the card land
 * and says its sentence. Only arrivals are held to a rule, and the tray is outside the rules.
 */
export declare function checkNest(before: Board, after: Board): BehaviourVerdict;
/** The nest board's rule kinds, for the rulebook (behaviour.ts). */
export declare const nestFamily: RuleFamily;
/**
 * Every place the card may be let go, with the board each makes: each slot under each card it may sit under,
 * and each slot at the top of each area; the place it is now is the board itself. Cycles are never offered.
 */
export declare function nestLegal(board: Board, cardId: string): {
    spot: NestSpot;
    next: Board;
}[];
/** Where a far drop goes (the emptyDrop rule; a new pile when piles have none): the board, or null when it goes nowhere new. */
export declare function nestEmptyDrop(board: Board, cardId: string): Board | null;
/** Where every card may go, as one string: two boards drag alike when these are equal (the library's gate). */
export declare const nestDrags: (board: Board) => string;
/** A card a merge took away answers for the card it went into: a drop already on its way lands there. */
export declare function nestAlias(board: Board, id: string): string | null;
/**
 * check_move on a nest board: whether a card may go under another (or to the top of an area), read-only,
 * with the verdict a drag gets: ok (and any warning), or the one rule that refuses it, who set it, and the
 * nearest card it may go under instead.
 */
export declare function checkNestMove(input: Board, cardRef: WorkshopRef, to: {
    under?: WorkshopRef;
    lane?: WorkshopRef;
}): WorkshopMoveCheck;
export declare function extend(more: {
    kinds: WorkshopEditKind[];
    boards: Partial<Record<WorkshopEditKindName, 'nest'[]>>;
    fields: Partial<Record<WorkshopEditKindName, Record<string, WorkshopEditField>>>;
    rules: {
        kinds: string[];
        keys: Record<string, unknown>;
    };
}): void;
/** What a card says on the board: a card with cards under it says what it counts. */
export declare function nestCardText(board: Board, card: WorkshopCard): string;
/** The nest board's part of the one gate (see kinds.ts). */
export declare const nestRules: BusinessBoardRules;
