/** The room a lane's name leaves on its right for its color button: a finger's 44 and a 4 gap. */
export declare const HEADER_SLOT = 48;
/** A finger's target, in board units: the height of the strip and the size of every header control. */
export declare const HEADER_TARGET = 44;
/** The gap between a header row and the next. */
export declare const HEADER_GAP = 4;
/** A board of columns' name: its height (the strip under it ends before the first card, at 98). */
export declare const LANE_NAME_HEIGHT = 40;
/** A board of columns' counter ("2 / 3"): its least height, and the widest it gets (it sits between − and +). */
export declare const LANE_COUNTER_HEIGHT = 22;
export declare const LANE_COUNTER_MAX = 84;
/**
 * The counter's height as the canvas draws it: a note grows to fit its words (Node.ts fitHeightToText: the text's height
 * and 14 of padding), so a box shorter than that is drawn taller, from the same top, and sits lower than the − and + it
 * stands between. The layout takes the drawn height, so the counter is centred in the strip as drawn.
 */
export declare const laneCounterHeight: (fontSize: number) => number;
/** A board of columns' first card (its header's foot) and one card's slot, as model.ts workshopLayout draws them. */
export declare const LANE_TOP = 98;
export declare const LANE_ROW = 88;
/** A box in board coordinates. */
export interface HeaderBox {
    x: number;
    y: number;
    width: number;
    height: number;
}
/** A board of columns' header, in a column at (x, y): its name, its counter, and its strip. */
export declare function laneHeaderBoxes(x: number, y: number, counterWidth: number, noteWidth?: number, counterHeight?: number): {
    label: HeaderBox;
    counter: HeaderBox;
    strip: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
};
/**
 * A name set in a box: the largest size from `size` down to 11 at which it fits, and at 11 the words that fit with an
 * ellipsis (the full name stays the note's name, so a screen reader and a tooltip still say all of it).
 */
export declare function fitName(text: string, size: number, width: number, height: number): {
    text: string;
    fontSize: number;
};
/** Whether two boxes overlap (touching edges do not). */
export declare function boxesOverlap(a: HeaderBox, b: HeaderBox): boolean;
/** A kit's parts as the controls' layout: its column parts, each with its name part and its caption (when it has words). */
export declare function ruleControlsLayoutOf(parts: {
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text?: string;
}[], width: number, height: number): {
    width: number;
    height: number;
    places: {
        laneId: string;
        x: number;
        y: number;
        width: number;
        height: number;
        row: number;
        label?: HeaderBox;
        caption?: HeaderBox;
    }[];
};
