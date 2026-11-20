/**
 * Note keys: what an operation may set on a note, how each value is checked,
 * and where it is stored in the saved JSON so the engine's loader reads it
 * back (Serialization.deserialize -> compat.v1NodeToV2 -> Node).
 */
import { type Lists, type ValueSpec } from "./values";
export interface NodeKey {
    spec: (lists: Lists) => ValueSpec;
    description: string;
    /** Write the (already valid) value into stored note options. */
    store: (options: Record<string, any>, value: any, lists: Lists) => void;
    /** Read the value back from stored note options. */
    read: (options: Record<string, any>) => any;
}
export declare const BORDER_STYLES: readonly ["solid", "dashed", "dotted", "combo"];
/**
 * The note effects the canvas offers: the engine's filters (core/Filters.ts,
 * kept equal by a test). Listed here so this module loads without the DOM.
 */
export declare const EFFECTS: readonly string[];
export declare const ORDERS: readonly ["front", "back"];
export declare const TEXT_X_ALIGN: readonly ["left", "middle", "right"];
export declare const TEXT_Y_ALIGN: readonly ["top", "middle", "bottom"];
export declare const NODE_KEYS: Record<string, NodeKey>;
/**
 * A change that is not stored on the note: order moves the note to the front
 * (the end of the slate's note list, drawn last) or the back (the start). The
 * engine saves and loads notes in that order, so the list is the z-order.
 */
export declare const NODE_INTENT_KEYS: Record<string, {
    spec: ValueSpec;
    description: string;
}>;
/** Every key update_nodes accepts in changes. */
export declare const NODE_CHANGE_KEYS: string[];
/** Keys set on add_nodes at the top level of the operation, not in style. */
export declare const ADD_LEVEL_KEYS: Set<string>;
export declare const NODE_STYLE_KEYS: string[];
