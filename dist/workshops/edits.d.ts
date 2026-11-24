import { type StationImage, type Workshop, type WorkshopCard, type WorkshopLane } from './model';
import { type WorkshopLimits } from './kinds';
import { type WorkshopFinder } from './names';
import type { RuleAudit, RuleInput } from './behaviour';
import { type AppearanceEdit } from './appearance';
/** The kinds of board, each with its own rules. */
export type WorkshopBoardKind = 'lanes' | 'release-plan' | 'customer-interviews' | 'experiment-budget' | 'map' | 'launch-plan' | 'pipeline' | 'budget' | 'hiring-plan' | 'nest';
/** Every kind of board, for a schema that names them (the app's Workshop record, an MCP tool). */
export declare const WORKSHOP_BOARD_KINDS: readonly WorkshopBoardKind[];
export declare function workshopBoardKind(board: Workshop): WorkshopBoardKind;
/** A lane, card, station, token or outcome: its id, or what a person calls it (see workshopFinder). `{ id }` names only an id the caller saw on the board. */
export type WorkshopRef = string | {
    id: string;
};
export type WorkshopEdit = {
    kind: 'rename_workshop';
    title: string;
} | {
    kind: 'rename_lane';
    lane: WorkshopRef;
    label: string;
} | {
    kind: 'rename_card';
    card: WorkshopRef;
    label: string;
} | {
    kind: 'add_lane';
    label: string;
    capacity?: number;
} | {
    kind: 'remove_lane';
    lane: WorkshopRef;
} | {
    kind: 'add_card';
    lane: WorkshopRef;
    label?: string;
    allowedLanes?: WorkshopRef[];
    duration?: number;
    lag?: number;
    waitsOn?: WorkshopRef[];
    amount?: number;
    band?: string;
    free?: boolean;
    under?: WorkshopRef;
    role?: string;
    source?: string;
} | {
    kind: 'remove_card';
    card: WorkshopRef;
} | {
    kind: 'move_card';
    card: WorkshopRef;
    lane: WorkshopRef;
    override?: boolean;
} | {
    kind: 'advance_card';
    card: WorkshopRef;
} | {
    kind: 'set_lane_capacity';
    lane: WorkshopRef;
    capacity: number | null;
} | {
    kind: 'set_card_lanes';
    card: WorkshopRef;
    lanes: WorkshopRef[] | null;
} | {
    kind: 'set_card_points';
    card: WorkshopRef;
    points: number;
} | {
    kind: 'set_card_dependencies';
    card: WorkshopRef;
    dependsOn: WorkshopRef[];
    mode?: 'replace' | 'add' | 'remove';
} | {
    kind: 'set_outcome';
    card: WorkshopRef;
    lane: WorkshopRef;
    whenPresent: string;
    whenAbsent: string;
    label?: string;
} | {
    kind: 'remove_outcome';
    card: WorkshopRef;
    outcome?: WorkshopRef;
} | {
    kind: 'set_presentation_order';
    lanes: WorkshopRef[];
} | {
    kind: 'present_lane';
    lane: WorkshopRef;
    before?: WorkshopRef;
    after?: WorkshopRef;
} | {
    kind: 'add_station';
    from: WorkshopRef;
    label: string;
    outcome?: string;
} | {
    kind: 'insert_station';
    before: WorkshopRef;
    from?: WorkshopRef;
    label: string;
    outcome?: string;
} | {
    kind: 'connect_stations';
    from: WorkshopRef;
    to: WorkshopRef;
} | {
    kind: 'disconnect_stations';
    from: WorkshopRef;
    to: WorkshopRef;
} | {
    kind: 'set_station_outcome';
    station: WorkshopRef;
    outcome: string;
} | {
    kind: 'set_station_position';
    station: WorkshopRef;
    column: number;
    row: number;
} | {
    kind: 'set_station_image';
    station: WorkshopRef;
    image: StationImage | null;
} | {
    kind: 'set_station_image_alt';
    station: WorkshopRef;
    alt: string;
} | {
    kind: 'connect_cards';
    card: WorkshopRef;
    to: WorkshopRef;
    label?: string;
} | {
    kind: 'disconnect_cards';
    card: WorkshopRef;
    to: WorkshopRef;
} | {
    kind: 'connect_note';
    card: WorkshopRef;
    note: string;
    direction?: 'to_note' | 'from_note';
    label?: string;
} | {
    kind: 'disconnect_note';
    card: WorkshopRef;
    note: string;
} | {
    kind: 'set_task';
    card: WorkshopRef;
    duration?: number;
    lag?: number;
    override?: boolean;
} | {
    kind: 'link_tasks';
    card: WorkshopRef;
    waitsOn: WorkshopRef;
} | {
    kind: 'unlink_tasks';
    card: WorkshopRef;
    waitsOn: WorkshopRef;
} | {
    kind: 'set_launch_day';
    day: number;
} | {
    kind: 'set_amount';
    card: WorkshopRef;
    amount: number;
} | {
    kind: 'set_target';
    amount: number;
} | {
    kind: 'shift_budget';
    from: WorkshopRef;
    to: WorkshopRef;
    amount: number;
} | {
    kind: 'set_budget_total';
    amount: number;
    edge?: 'start' | 'end';
} | {
    kind: 'add_rule';
    rule: RuleInput;
} | {
    kind: 'set_rule';
    rule: string;
    on?: boolean;
    severity?: 'refuse' | 'warn';
    max?: number;
    to?: WorkshopRef[];
    floor?: number;
    onConflict?: 'push' | 'stop';
    unit?: 'day' | 'week';
    under?: string[];
    by?: string;
    drop?: 'new-pile' | 'unsorted';
    mode?: 'warn' | 'ask' | 'carry';
} | {
    kind: 'remove_rule';
    rule: string;
} | ({
    kind: 'set_appearance';
    lane?: WorkshopRef;
} & AppearanceEdit) | {
    kind: 'set_band_cost';
    band: string;
    monthly: number;
} | {
    kind: 'set_funding';
    day: number;
} | {
    kind: 'set_plan_start';
    start: string;
} | {
    kind: 'set_plan_weeks';
    weeks: number;
} | {
    kind: 'nest_card';
    card: WorkshopRef;
    under?: WorkshopRef;
    lane?: WorkshopRef;
    before?: WorkshopRef;
    override?: boolean;
} | {
    kind: 'start_pile';
    card: WorkshopRef;
    label?: string;
} | {
    kind: 'merge_cards';
    card: WorkshopRef;
    into: WorkshopRef;
} | {
    kind: 'set_role';
    card: WorkshopRef;
    role: string;
} | {
    kind: 'set_source';
    card: WorkshopRef;
    source: string;
} | {
    kind: 'add_field';
    label: string;
    currency?: string;
    flag?: boolean;
} | {
    kind: 'set_field';
    card: WorkshopRef;
    field: string;
    value: number | null;
} | {
    kind: 'set_layout';
    layout: 'clusters' | 'tree';
} | {
    kind: 'score_card';
    card: WorkshopRef;
    x: number;
    y: number;
} | {
    kind: 'rename_field';
    field: string;
    label: string;
} | {
    kind: 'add_owner';
    label: string;
} | {
    kind: 'set_owner';
    card: WorkshopRef;
    owner: string;
    carry?: WorkshopRef[];
};
export type WorkshopEditKindName = WorkshopEdit['kind'];
/** What one edit did: the sentence a person is told, and the ids it concerned or made. */
export interface WorkshopEditDone {
    index: number;
    kind: WorkshopEditKindName;
    said: string;
    /** False when the board already was that way (a move to where the card is, a path that is there). */
    changed: boolean;
    laneId?: string;
    cardId?: string;
}
export interface WorkshopEditReport {
    edits: WorkshopEditDone[];
    /** Every card that ended in another lane, including the ones a release plan brought along. */
    movedCards: {
        cardId: string;
        fromLaneId: string;
        toLaneId: string;
    }[];
    /**
     * Every move made anyway (an edit with override true that a rule refused), by the edit that made it, even when a later
     * edit of the same list moves the card on again: what the exec gate holds for the person (breaks_board_rule). Left
     * out when there is none.
     */
    overrides?: {
        index: number;
        cardId: string;
        laneId: string;
        fromLaneId: string;
        sentence: string;
    }[];
}
export type WorkshopEditRefusalCode = 
/** The edit is malformed: an unknown kind, a missing or mistyped field. */
'invalid_edit'
/** The board's kind does not take this edit (see describeWorkshopEdits). */
 | 'not_on_this_board'
/** A name picks nothing here. `candidates` lists what is there. */
 | 'unknown_reference'
/** A name picks several things. `candidates` lists them. */
 | 'ambiguous_reference'
/** “this” with nothing selected. */
 | 'no_selection'
/** An `{ id }` the caller saw is no longer on the board. */
 | 'gone'
/** The board's rules refuse it. */
 | 'refused'
/** The board given cannot be read. */
 | 'invalid_board';
export interface WorkshopEditRefusal {
    /** The sentence for the person, the same one the canvas and the conversation say. */
    reason: string;
    code: WorkshopEditRefusalCode;
    /** The edit refused, by its place in the list. Nothing of the list was made. */
    index: number;
    kind: string | null;
    /** The lane to show the refusal on, when there is one. */
    laneId: string | null;
    cardId?: string;
    candidates?: string[];
    /** A number out of range: the range a person may use, and the sentence at each end. */
    limits?: WorkshopLimits;
    /** A move a rule refused that the person may make anyway: the same move_card again with override true, once they agree. */
    overridable?: boolean;
}
export type WorkshopEditResult = {
    workshop: Workshop;
    report: WorkshopEditReport;
} | {
    refused: WorkshopEditRefusal;
};
export interface WorkshopEditOptions {
    /**
     * What “this” means: the lane or card selected on the canvas, or the whole board in focus (the
     * gear's "Change this board"). With the board in focus, “this lane” and “this card” still ask
     * for one to be selected: the board is never read as one of its lanes or cards.
     */
    selection?: {
        kind: 'lane' | 'card' | 'board';
        id: string;
    } | null;
    /** Who makes a rule edit, and how: the audit line every rule keeps. Left out, an agent over exec. */
    actor?: {
        by: string;
        via: RuleAudit['via'];
    };
    /** When, as an ISO time (for tests and replays). Left out, now. */
    now?: string;
}
type Limit = number | Partial<Record<WorkshopBoardKind, number>> & {
    default: number;
};
export type WorkshopEditField = {
    type: 'text';
    max: number;
    min?: number;
    optional?: boolean;
    about: string;
} | {
    type: 'ref';
    of: 'lane' | 'card' | 'outcome';
    optional?: boolean;
    about: string;
} | {
    type: 'refs';
    of: 'lane' | 'card';
    min: number;
    max: number;
    nullable?: boolean;
    optional?: boolean;
    about: string;
} | {
    type: 'integer';
    min: number;
    max: Limit;
    nullable?: boolean;
    optional?: boolean;
    about: string;
} | {
    type: 'image';
    about: string;
} | {
    type: 'choice';
    values: string[];
    optional?: boolean;
    about: string;
} | {
    type: 'flag';
    optional?: boolean;
    about: string;
} | {
    type: 'rule';
    about: string;
};
export interface WorkshopEditKind {
    kind: WorkshopEditKindName;
    summary: string;
    /** A change of intent (a move, a rename) that can be replayed on the latest board without a revision. */
    intent: boolean;
    fields: Record<string, WorkshopEditField>;
    /** The boards that take this edit. */
    boards: WorkshopBoardKind[];
    /** What the other boards say. */
    refusals: Partial<Record<WorkshopBoardKind, string>>;
}
export declare const workshopEditKinds: WorkshopEditKind[];
export declare const isRuleEdit: (kind: string) => kind is "add_rule" | "set_rule" | "remove_rule";
/**
 * What add_rule's body may hold: the rulebook's kinds and keys. A rules module that brings its own
 * (slateboxjs/workshops/plans) adds to these and to the table above as it loads.
 */
export declare const workshopRuleSchema: {
    kinds: string[];
    keys: Record<string, unknown>;
};
export interface WorkshopEditDescription {
    kind: WorkshopEditKindName;
    summary: string;
    intent: boolean;
    boards: WorkshopBoardKind[];
    /** A JSON schema of the edit, `kind` included. */
    schema: Record<string, unknown>;
    /** With a board: whether it takes this edit, and if not, the sentence it answers with. */
    accepted?: boolean;
    refusal?: string;
}
/** The edit table as data: every kind, or with a board, every kind and whether that board takes it. */
export declare function describeWorkshopEdits(board?: Workshop): WorkshopEditDescription[];
/**
 * The finders for a board's lanes and cards, worded for its kind (lanes and cards, or steps and
 * tokens). On a map with one token, “the token” is that one. `selection` is what “this” means.
 */
export declare function workshopReferences(board: Workshop, selection?: WorkshopEditOptions['selection']): {
    lanes: WorkshopFinder<WorkshopLane>;
    cards: WorkshopFinder<WorkshopCard>;
};
/**
 * Make `edits` on `board`, in order, all or none. Returns the board that results with a report of
 * what each edit did, or the first refusal: the sentence a person is given, a code, which edit,
 * and the lane to show it on. The board given is never changed.
 */
export declare function applyWorkshopEdits(board: Workshop, edits: readonly WorkshopEdit[], options?: WorkshopEditOptions): WorkshopEditResult;
/**
 * Whether `after` may replace `before` as a whole: the guards the edits keep, said as a diff, for
 * a save that sends a whole board (creativeSlates.save, an agent's set_workshop). Null when it
 * may; otherwise the sentence a person is given. `after` must also be a valid workshop.
 */
export declare function checkWorkshopReplacement(before: Workshop, after: Workshop): string | null;
export {};
