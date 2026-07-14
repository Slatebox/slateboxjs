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
    private assocMap;
    /**
     * v1 contract: `.associations` is a plain ARRAY whose entries carry live
     * `parent`/`child` node references (host apps read `a.parent.options.id`
     * and PropType it as an array). The Map stays internal.
     */
    get associations(): Array<Association & {
        parent: any;
        child: any;
    }>;
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
    removeAssociation(childIdOrAssocId: string): boolean;
    /**
     * Remove all associations from this node.
     */
    removeAll(): void;
    /**
     * Apply a single line property (from the line-properties pane) to one
     * association: update the stored record (so it serializes/persists) AND
     * re-render the connector. Used by the onLinePropertiesChanged apply path
     * (local invoke + remote collab), which is why line edits now sync + persist.
     */
    applyLineProperty(associationId: string, prop: string, val: any): boolean;
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
    /** Get a specific association by child ID (the canonical edge to that child) */
    getAssociation(childId: string): Association | undefined;
    /** True if an association with this exact id exists (parallel-edge aware). */
    hasAssociationId(id: string): boolean;
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
    /**
     * Add a free-floating association whose target is a bare world point rather
     * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
     * a normal association (targetPoint travels in the record).
     */
    addFloatingAssociation(point: {
        x: number;
        y: number;
    }, data?: Partial<Association>): Association;
}
