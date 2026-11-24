import type { Workshop } from './model';
import type { WorkshopEdit } from './edits';
export type RuleControlPrimitive = 'capacity' | 'path' | 'bin' | 'gate' | 'deadline' | 'blackout' | 'snap' | 'locked' | 'cascade' | 'depth' | 'children' | 'nests' | 'emptyDrop' | 'rank' | 'quadrant' | 'addLane';
/** A box in board (chrome) coordinates; at least 44 by 44 at a finger's chrome scale. */
export interface RuleControlBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/**
 * How a control is drawn (ruleControlsLayer.ts):
 * - line: a limit line across a column from x1 to x2 at y, with a grip pill (`label`) in its middle;
 * - chip: a pill with words (`on`: filled; `icon`: a glyph before the words);
 * - badge: a round button with a glyph;
 * - step: a small round − or + button;
 * - ghost: a dashed column with a + (a column not there yet);
 * - ladder: rungs from y down, `rungs` of them, `on` of them lit, with a grip on the top lit rung.
 */
export interface RuleControlLook {
    shape: 'line' | 'chip' | 'badge' | 'step' | 'ghost' | 'ladder';
    on?: boolean;
    label?: string;
    icon?: 'bin' | 'gate' | 'oneway' | 'twoway' | 'step' | 'minus' | 'plus' | 'flag' | 'push' | 'snap' | 'drop' | 'rank' | 'depth' | 'holds';
    warn?: boolean;
    x1?: number;
    x2?: number;
    y?: number;
    rungs?: number;
    lit?: number;
    rungGap?: number;
}
export interface RuleControl {
    id: string;
    primitive: RuleControlPrimitive;
    /** What it sits on: a lane, a card, the time axis, or a line between lanes. */
    anchor: {
        kind: 'lane' | 'card' | 'axis' | 'edge' | 'board';
        id?: string;
        to?: string;
    };
    hit: RuleControlBox;
    /** The rule as it stands: its value and its sentence ("Review holds 3"). */
    state: {
        value?: unknown;
        sentence: string;
        ruleId?: string;
    };
    /** What a screen reader calls it, and what its keys do. */
    label: string;
    look: RuleControlLook;
    gestures: {
        tap?: WorkshopEdit[];
        /** A drag by `delta` (board units): the edits it makes, [] when it changes nothing. */
        drag?: (delta: {
            dx: number;
            dy: number;
        }) => WorkshopEdit[];
        /** What a drag by `delta` would say, while it is held ("Review holds 2"). */
        preview?: (delta: {
            dx: number;
            dy: number;
        }) => string;
        /** One arrow key moves a drag this far (board units), along `axis`. */
        step?: number;
        axis?: 'x' | 'y';
        /** A long press, a right-click, or Shift+Enter (a limit's refuse or warn). */
        hold?: WorkshopEdit[];
        /** Delete or Backspace, or a drag off the board: the rule goes. */
        remove?: WorkshopEdit[];
    };
}
/** Where the board's columns are drawn (workshopLanePlaces, or a kit's column parts), and its drawn size. */
export interface RuleControlsLayout {
    places?: {
        laneId: string;
        x: number;
        y: number;
        width: number;
        height: number;
        row?: number;
    }[];
    width: number;
    height: number;
}
export interface RuleControlsOptions {
    finger?: boolean;
    scale?: number;
}
type Family = 'lanes' | 'pipeline' | 'time' | 'nest' | null;
/** Which rules a board takes (behaviour.ts behaviourFamily, read here without loading the rulebook). */
export declare function ruleControlsFamily(board: Pick<Workshop, 'kind' | 'lanes' | 'experience'>): Family;
/**
 * The controls a board shows, where, and what each gesture makes. `layout` is where the board is drawn
 * (its columns' places for a board of columns or a pipeline; its size always). A board that takes no
 * rules (a map, a budget, a decision board) shows none.
 */
export declare function ruleControls(board: Workshop, layout: RuleControlsLayout | null | undefined, options?: RuleControlsOptions): RuleControl[];
/** The edit kinds a rule control makes: what a canvas change of rules may hold (and never a move with them). */
export declare const RULE_CONTROL_EDITS: readonly string[];
export {};
