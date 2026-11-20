import { Node, NodeOptions } from './Node';
import type { Slate } from './Slate';
export declare class NodesManager {
    private slate;
    private nodes;
    /** Notes added but not yet drawn (a note is built a moment after it is added). */
    private unbuilt;
    constructor(slate: Slate);
    add(options?: Partial<NodeOptions>): Node;
    /** The notes still being drawn, as promises that settle when each is ready. */
    building(): Promise<void>[];
    /** Give up on notes that never finished drawing (see Slate.whenBuilt). */
    stopWaitingFor(stuck: Promise<void>[]): void;
    remove(id: string): boolean;
    one(id: string): Node | undefined;
    get allNodes(): Node[];
    /**
     * Move a note to the front (the end of the list, drawn last) or the back
     * (the start). The list is the order notes are saved and loaded in, so a
     * reload keeps the z-order a person or an agent chose.
     */
    reorder(id: string, place: "front" | "back"): void;
    /**
     * Take a z-order result from the room: the notes `order` names go, in that
     * order, into the places those notes hold now; a note it does not name (one
     * added after the order was sent) keeps its place. Then the drawing follows
     * the list, the last note on top.
     */
    applyOrder(order: string[]): void;
    clear(): void;
    /** Destroy the nodes manager, clearing all nodes */
    destroy(): void;
    /**
     * Move nodes from a collab package. Accepts BOTH shapes:
     *  - v2: `data.nodes: [{id, x, y}]`
     *  - v1: `data.nodeOptions: [{id, xPos, yPos, groupId, isLocked}]`
     *    (drag, arrangement, grouping, and group-lock broadcasts)
     */
    moveNodes(packageData: any, options?: {
        animate?: boolean;
    }): void;
    /** Create an association from a collab package: `{parentId, childId, ...opts}` */
    addRelationship(relationshipData: any, waited?: boolean): void;
    /** Remove an association from a collab package: `{parentId, childId, id?}` */
    removeRelationship(relationshipData: any): void;
    private generateId;
    count(): number;
    forEach(callback: (node: Node, id: string) => void): void;
    filter(predicate: (node: Node) => boolean): Node[];
    find(predicate: (node: Node) => boolean): Node | undefined;
}
