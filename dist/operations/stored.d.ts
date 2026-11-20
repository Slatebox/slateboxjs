import type { NodeSelector } from "./keys/selector";
export interface StoredNode {
    options: Record<string, any>;
    relationships: {
        associations: Record<string, any>[];
    };
}
export interface StoredSlate {
    options: Record<string, any>;
    nodes: StoredNode[];
    [key: string]: any;
}
export declare const noteId: (node: StoredNode) => string;
export declare const read: (node: StoredNode, key: string) => any;
export declare const box: (node: StoredNode) => {
    x: any;
    y: any;
    width: number;
    height: number;
};
export declare const isFreeEnd: (association: Record<string, any>) => boolean;
/** The engine's own default id for a connector stored without one (compat.v1AssociationToV2). */
export declare const defaultConnectorId: (parentId: string, childId: string) => string;
/**
 * A stored copy of whatever was passed: stored JSON (cloned) or a live engine
 * slate (its free notes, in stored form). Every connector gets an id and a
 * parentId, the way the engine's loader gives them.
 */
export declare function toStoredSlate(input: any): StoredSlate;
export declare function allConnectors(slate: StoredSlate): Array<{
    node: StoredNode;
    association: Record<string, any>;
}>;
/** The notes a selector names. A text selector naming several needs all: true. */
export declare function selectNotes(slate: StoredSlate, selector: NodeSelector, label: string): StoredNode[];
