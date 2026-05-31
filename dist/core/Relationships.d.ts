/**
 * Relationships.ts - Manages parent-child associations on a Node
 *
 * Following the isolated class pattern (like ResizeRotate, Connector):
 * - Constructor takes node and options
 * - Has enable(), disable(), serialize() methods
 * - Owned by Node, coordinates with Connector for rendering
 */
import { Association } from "./Relationship";
import type { Node } from "./Node";
export interface RelationshipsOptions {
    enabled?: boolean;
}
export declare class Relationships {
    private node;
    private slate;
    private associations;
    private isActive;
    constructor(node: Node, options?: RelationshipsOptions);
    /**
     * Add an association from this node (parent) to a child node.
     * Creates the visual connection via the Connector system.
     */
    addAssociation(childNode: any, data?: Partial<Association>): Association;
    /**
     * Remove a specific association by child node ID.
     */
    removeAssociation(childId: string): boolean;
    /**
     * Remove all associations from this node.
     */
    removeAll(): void;
    /**
     * Update all associations with new options (e.g., line color change).
     */
    updateAssociationsWith(opts: Partial<Association>): void;
    /**
     * Refresh all visual connections (e.g., after drag/move).
     * Called during node drag to update connector positions.
     */
    refresh(): void;
    /**
     * Refresh only this node's own relationships (as parent).
     * Used by Invoker when line color changes.
     */
    refreshOwnRelationships(): void;
    /** Get all associations where this node is the parent */
    getAssociations(): Association[];
    /** Get a specific association by child ID */
    getAssociation(childId: string): Association | undefined;
    /** Check if this node has any associations */
    hasAssociations(): boolean;
    /** Get count of associations */
    count(): number;
    /** Serialize all associations to JSON-compatible format */
    serialize(): {
        associations: Association[];
    };
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    /** Destroy the relationships, removing all associations and clearing references */
    destroy(): void;
    private renderAssociation;
}
