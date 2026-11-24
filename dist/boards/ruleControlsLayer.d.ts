import type { RuleControl } from '../workshops/ruleControls';
import type { WorkshopEdit } from '../workshops/edits';
export interface RuleControlsLayerOptions {
    /** The edits a gesture made, and what the control says it does; true once they are saved. */
    onRuleEdit?: (edits: WorkshopEdit[], sentence: string) => Promise<boolean> | boolean;
    /** Where the board's origin is (world units): the layer is drawn in board coordinates. */
    origin?: {
        x: number;
        y: number;
    };
    /** Tell a screen reader something (the host's live region). */
    announce?: (text: string) => void;
}
export interface RuleControlsLayer {
    update(controls: RuleControl[], origin?: {
        x: number;
        y: number;
    }): void;
    remove(): void;
}
/** The controls' colours: the chrome's tokens (light and dark), with these defaults behind them. */
export declare const controlInk: {
    on: string;
    onInk: string;
    off: string;
    offLine: string;
    ink: string;
    line: string;
    warn: string;
    refuse: string;
    halo: string;
    ghost: string;
    chip: string;
};
/** A control's hint: the first sentence of its label ("Make To do a bin that archives cards"), short enough to sit above it. */
export declare function hintOf(control: RuleControl): string;
/** Draw a board's rule controls on `slate`, in board coordinates at `options.origin`. */
export declare function drawRuleControls(slate: unknown, boardId: string, controls: RuleControl[], options?: RuleControlsLayerOptions): RuleControlsLayer;
