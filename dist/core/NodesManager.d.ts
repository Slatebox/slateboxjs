import { Node, NodeOptions } from './Node';
import type { Slate } from './Slate';
export declare class NodesManager {
    private slate;
    private nodes;
    constructor(slate: Slate);
    add(options?: Partial<NodeOptions>): Node;
    remove(id: string): boolean;
    one(id: string): Node | undefined;
    get allNodes(): Node[];
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
    addRelationship(relationshipData: any): void;
    /** Remove an association from a collab package: `{parentId, childId, id?}` */
    removeRelationship(relationshipData: any): void;
    private generateId;
    count(): number;
    forEach(callback: (node: Node, id: string) => void): void;
    filter(predicate: (node: Node) => boolean): Node[];
    find(predicate: (node: Node) => boolean): Node | undefined;
}
