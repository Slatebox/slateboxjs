import { Node, NodeOptions } from './Node';
export declare class NodesManager {
    private slate;
    private nodes;
    constructor(slate: any);
    add(options?: Partial<NodeOptions>): Node;
    remove(id: string): boolean;
    one(id: string): Node | undefined;
    get allNodes(): Node[];
    clear(): void;
    /** Destroy the nodes manager, clearing all nodes */
    destroy(): void;
    moveNodes(packageData: any, options?: {
        animate?: boolean;
    }): void;
    addRelationship(relationshipData: any): void;
    removeRelationship(relationshipData: any): void;
    private generateId;
    count(): number;
    forEach(callback: (node: Node, id: string) => void): void;
    filter(predicate: (node: Node) => boolean): Node[];
    find(predicate: (node: Node) => boolean): Node | undefined;
}
