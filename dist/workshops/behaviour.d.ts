import type { Workshop } from './model';
import type { WorkshopEdit, WorkshopRef } from './edits';
import type { BusinessEditStep, BusinessEditTools } from './kinds';
export type RuleKindId = 'capacity' | 'path' | 'gate' | 'bin' | TimeRuleKindId | NestRuleKindId | GridRuleKindId;
export declare const ruleKindIds: readonly RuleKindId[];
/** A plan's rule kinds (timeRules.ts, with the plans' rules): a launch plan's and a hiring plan's. */
export type TimeRuleKindId = 'deadline' | 'overlap' | 'snap' | 'workdays' | 'blackout' | 'cascade' | 'locked';
/** A nest board's rule kinds (nest.ts): what sits under what, how many, how deep, how piles rank, where a far drop goes. */
export type NestRuleKindId = 'nests' | 'children' | 'depth' | 'rank' | 'emptyDrop' | 'quadrant' | 'parent' | 'contains' | 'sameOwnerAs';
/** A grid sheet's rule kinds (grid.ts): the tiles it uses, how many of a kind, what every page needs, how big a kind spans. */
export type GridRuleKindId = 'tileTypes' | 'tileMax' | 'tileNeeds' | 'tileSpan';
/** Who set a rule, when, and from where (canvas: a rule control drawn on the board). Shown when a refusal is explained. */
export interface RuleAudit {
    by: string;
    at: string;
    via: 'chat' | 'exec' | 'preset' | 'canvas';
}
export type RuleBody = {
    kind: 'capacity';
    where: string;
    max: number;
} | {
    kind: 'path';
    from: string;
    to?: string[];
    noSkip?: boolean;
} | {
    kind: 'gate';
    into: string;
    needs: string[];
} | {
    kind: 'bin';
    lane: string;
} | {
    kind: 'deadline';
    at: 'launch' | 'runway';
    floor?: number;
} | {
    kind: 'overlap';
    lane?: string;
} | {
    kind: 'snap';
    unit: 'day' | 'week';
} | {
    kind: 'workdays';
} | {
    kind: 'blackout';
    start: string;
    end: string;
    label: string;
} | {
    kind: 'cascade';
    onConflict: 'push' | 'stop';
} | {
    kind: 'locked';
    cards: string[];
} | {
    kind: 'nests';
    role: string;
    under: string[];
} | {
    kind: 'children';
    max: number;
    role?: string;
} | {
    kind: 'depth';
    max: number;
} | {
    kind: 'rank';
    by: string;
} | {
    kind: 'emptyDrop';
    drop: 'new-pile' | 'unsorted';
} | {
    kind: 'quadrant';
    quadrant: string;
    max: number;
} | {
    kind: 'parent';
    not: string;
} | {
    kind: 'contains';
    role: string;
    of: string;
    atLeast: number;
} | {
    kind: 'sameOwnerAs';
    mode: 'warn' | 'ask' | 'carry';
    role?: string;
} | {
    kind: 'tileTypes';
    types: string[];
} | {
    kind: 'tileMax';
    type: string;
    max: number;
    per: 'page' | 'sheet';
} | {
    kind: 'tileNeeds';
    type: string;
    atLeast: number;
    per: 'page';
} | {
    kind: 'tileSpan';
    type: string;
    rows: number;
    cols: number;
};
export type BehaviourRule = RuleBody & {
    id: string;
    on: boolean;
    severity: 'refuse' | 'warn';
    set: RuleAudit;
};
export interface Behaviour {
    version: 1;
    /** Bumped by every rule edit; a drop made under an older revision is checked again under this one. */
    rev: number;
    rules: BehaviourRule[];
}
export declare const maxBehaviourRules = 12;
type Family = 'lanes' | 'pipeline' | 'time' | null;
/** Which boards take rules: lane boards, the sales pipeline and the plans (null for every other). */
export declare function behaviourFamily(board: Pick<Workshop, 'kind' | 'lanes' | 'experience'>): Family;
export declare const emptyBehaviour: () => Behaviour;
/** The board's rulebook, or an empty one. */
export declare function behaviourOf(board: Pick<Workshop, 'behaviour'>): Behaviour;
/**
 * Read a stored or proposed rulebook for this board: only declared rule kinds, lanes that exist,
 * fields the board has, at most 12 rules, no contradictions. Throws the sentence a person is given.
 */
export declare function validateBehaviour(input: unknown, board: Workshop): Behaviour;
/** A rulebook that contradicts itself, as a sentence; null when it holds together. */
export declare function behaviourContradiction(behaviour: Behaviour, board: Workshop): string | null;
/** A rule's sentence: its caption, its line in the note, and the loop's caption in the library. */
export declare function ruleSentence(rule: BehaviourRule, board: Workshop): string;
/** The lines of the "How this board behaves" note: built-in rules, lane limits, then the rulebook's rules that are on. */
export declare function behaviourLines(board: Workshop): string[];
/** The limit a lane shows in its caption ("3 of 2"): its rule's, or its own capacity. */
export declare function behaviourLaneLimit(board: Workshop, laneId: string): number | undefined;
export type BehaviourVerdict = {
    ok: true;
    warnings: string[];
} | {
    refused: {
        sentence: string;
        ruleId: string;
        set: RuleAudit;
        cardId: string;
        laneId: string;
    };
};
/**
 * The one check: whether `after` keeps this board's rules for every card that arrived in a lane
 * (moved there, or new). The rules are the board's as it was (`before`): a save that brings other
 * rules is a rule edit, checked on its own (checkWorkshopReplacement), never a way round them. A bin
 * takes any card, and never loses one: a card in a bin may become a note, but it is not deleted.
 * A `warn` rule lets the card land and says its sentence.
 */
export declare function checkBehaviour(before: Workshop, after: Workshop): BehaviourVerdict;
/** What changed between two rulebooks, as the chat's diff preview says it, and what already breaks the new rules. */
export declare function behaviourDiff(before: Workshop, after: Workshop): {
    from: number;
    to: number;
    lines: string[];
    over: string[];
};
/** The input of add_rule: a rule body, with lanes by id or name (resolved by the reducer), and an optional severity. */
export type RuleInput = RuleBody & {
    severity?: 'refuse' | 'warn';
};
/** A rule id not yet on the board. */
export declare function nextRuleId(behaviour: Behaviour): string;
/** The rulebook without the rules that name a lane (a lane removed takes its rules with it). */
export declare function dropLaneRules(behaviour: Behaviour, laneId: string): Behaviour;
type RuleTools = Pick<BusinessEditTools, 'lane' | 'card' | 'refuse' | 'done'>;
/** add_rule, set_rule and remove_rule: one rule at a time, the revision bumped, the audit line kept. */
export declare function applyRuleEdit(board: Workshop, edit: WorkshopEdit, audit: RuleAudit, t: RuleTools): BusinessEditStep;
export type WorkshopMoveCheck = {
    ok: true;
    warnings: string[];
} | {
    refused: {
        sentence: string;
        ruleId: string | null;
        nearest: string | null;
        set?: RuleAudit;
        overridable: boolean;
    };
};
/**
 * Whether a card may move to a lane, read-only: exec's check_move and "Why can't I move X?". The same
 * verdict a drag gets. A refusal names one rule (or the board kind's own rule: ruleId null), who set
 * it, and the nearest lane the card may go to instead.
 */
export declare function checkWorkshopMove(input: Workshop, cardRef: WorkshopRef, laneRef: WorkshopRef): WorkshopMoveCheck;
/** A lane whose limit is a rule: set_lane_capacity changes the rule (a new limit never moves a card). Null for a lane without one. */
export declare function setRuledLimit(board: Workshop, laneId: string, capacity: number | null, audit: RuleAudit): Workshop | string | null;
export {};
