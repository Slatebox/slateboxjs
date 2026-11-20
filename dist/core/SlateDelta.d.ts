/**
 * SlateDelta.ts - What changed between two serialized slates, note by note, and
 * how to carry that change into another serialized slate.
 *
 * Undo records are whole slates. When other people change the slate, their
 * change is carried into every record this person holds (UndoRedo.absorbRemote),
 * so that going back to a record takes back only this person's own steps and
 * never the others' work, whenever it was done.
 */
import type { NodeJSON, SlateJSON } from "./Serialization";
interface FieldDelta {
    set: Record<string, any>;
    unset: string[];
}
interface NodeChange extends FieldDelta {
    id: string;
    /** Lines leaving this note, keyed by linkKey: set (added or changed) and removed. */
    links: {
        set: Record<string, any>[];
        removed: string[];
    };
}
export interface SlateDelta {
    options: FieldDelta;
    added: NodeJSON[];
    removed: string[];
    changed: NodeChange[];
}
/** One line's identity: its association id, or its two ends for lines stored without one. */
export declare function linkKey(link: Record<string, any>): string;
/** What changed from `before` to `after`, or null when nothing did. */
export declare function diffSlates(before: SlateJSON, after: SlateJSON): SlateDelta | null;
/**
 * `record` with `delta` carried into it. The record is not modified: the result
 * shares the notes the delta does not touch.
 *
 * - A note added by the delta is added (or replaces the record's copy).
 * - A note removed by the delta is removed, with the lines into it.
 * - A note the delta changed is changed field by field, if the record has it: a
 *   record taken before the note existed stays without it.
 */
export declare function applyDelta(record: SlateJSON, delta: SlateDelta): SlateJSON;
export {};
