import { type StoredNode, type StoredSlate } from "./stored";
/**
 * Apply the end keys of one update_connections change to one connector, in
 * place. Returns the note that holds the connector afterwards (the starting end
 * moving to another note, or being let go, hands it to another note).
 */
export declare function moveLineEnds(slate: StoredSlate, owner: StoredNode, association: Record<string, any>, changes: Record<string, any>, prefix: string, idFactory: () => string): StoredNode;
/** How each end of a stored connector behaves, for reads. */
export declare function readEnds(association: Record<string, any>): {
    fromEnd: string;
    toEnd: string;
};
