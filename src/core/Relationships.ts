/**
 * Relationships.ts - Manages parent-child associations on a Node
 *
 * Following the isolated class pattern (like ResizeRotate, Connector):
 * - Constructor takes node and options
 * - Has enable(), disable(), serialize() methods
 * - Owned by Node, coordinates with Connector for rendering
 */

import { Association, createDefaultAssociation } from "./Relationship";

export interface RelationshipsOptions {
  enabled?: boolean;
}

export class Relationships {
  private node: any;
  private slate: any;
  private associations: Map<string, Association> = new Map();
  private isActive: boolean = false;

  constructor(node: any, options: RelationshipsOptions = {}) {
    this.node = node;
    this.slate = node.slate;
    this.isActive = options.enabled ?? true;
  }

  // ─── Association management ──────────────────────────────────────

  /**
   * Add an association from this node (parent) to a child node.
   * Creates the visual connection via the Connector system.
   */
  public addAssociation(
    childNode: any,
    data?: Partial<Association>
  ): Association {
    const assoc = createDefaultAssociation(this.node.id, childNode.id, data);

    // Store the association
    this.associations.set(assoc.id, assoc);

    // Create visual connection through Connector
    this.renderAssociation(assoc, childNode);

    console.log(
      "RELATIONSHIP_DEBUG: Added association",
      assoc.id,
      "from",
      this.node.id,
      "to",
      childNode.id
    );

    return assoc;
  }

  /**
   * Remove a specific association by child node ID.
   */
  public removeAssociation(childId: string): boolean {
    const assocId = `${this.node.id}->${childId}`;
    const assoc = this.associations.get(assocId);

    if (!assoc) {
      console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        assocId
      );
      return false;
    }

    // Remove visual connection
    const childNode = this.slate.nodes.one(childId);
    if (childNode && this.node.connector) {
      this.node.connector.disconnectFrom(childNode);
    }

    this.associations.delete(assocId);
    console.log("RELATIONSHIP_DEBUG: Removed association", assocId);
    return true;
  }

  /**
   * Remove all associations from this node.
   */
  public removeAll(): void {
    const ids = Array.from(this.associations.keys());
    for (const id of ids) {
      const assoc = this.associations.get(id)!;
      this.removeAssociation(assoc.childId);
    }
  }

  /**
   * Update all associations with new options (e.g., line color change).
   */
  public updateAssociationsWith(opts: Partial<Association>): void {
    for (const [id, assoc] of this.associations) {
      Object.assign(assoc, opts);

      // Update visual if connector supports it
      if (this.node.connector) {
        const connId = `${this.node.id}->${assoc.childId}`;
        this.node.connector.updateConnection(connId, {
          lineColor: assoc.lineColor,
          lineWidth: assoc.lineWidth,
        });
      }
    }
  }

  /**
   * Refresh all visual connections (e.g., after drag/move).
   * Called during node drag to update connector positions.
   */
  public refresh(): void {
    // svg.connectable.js handles position updates automatically during drag
    // This method is here for compatibility with v1 API
    // and for any manual refresh needs
    console.log(
      "RELATIONSHIP_DEBUG: Refreshing associations for",
      this.node.id
    );
  }

  /**
   * Refresh only this node's own relationships (as parent).
   * Used by Invoker when line color changes.
   */
  public refreshOwnRelationships(): void {
    for (const [id, assoc] of this.associations) {
      const childNode = this.slate.nodes.one(assoc.childId);
      if (childNode && this.node.connector) {
        // Re-render the connection with current association data
        const connId = `${this.node.id}->${assoc.childId}`;
        this.node.connector.updateConnection(connId, {
          lineColor: assoc.lineColor,
          lineWidth: assoc.lineWidth,
        });
      }
    }
  }

  // ─── Query methods ───────────────────────────────────────────────

  /** Get all associations where this node is the parent */
  public getAssociations(): Association[] {
    return Array.from(this.associations.values());
  }

  /** Get a specific association by child ID */
  public getAssociation(childId: string): Association | undefined {
    return this.associations.get(`${this.node.id}->${childId}`);
  }

  /** Check if this node has any associations */
  public hasAssociations(): boolean {
    return this.associations.size > 0;
  }

  /** Get count of associations */
  public count(): number {
    return this.associations.size;
  }

  // ─── Serialization ───────────────────────────────────────────────

  /** Serialize all associations to JSON-compatible format */
  public serialize(): { associations: Association[] } {
    return {
      associations: Array.from(this.associations.values()),
    };
  }

  // ─── Lifecycle ───────────────────────────────────────────────────

  public enable(): void {
    this.isActive = true;
  }

  public disable(): void {
    this.isActive = false;
  }

  public isEnabled(): boolean {
    return this.isActive;
  }

  /** Destroy the relationships, removing all associations and clearing references */
  public destroy(): void {
    this.removeAll();
    this.disable();
    this.associations.clear();
    this.node = null;
    this.slate = null;
  }

  // ─── Private helpers ─────────────────────────────────────────────

  private renderAssociation(assoc: Association, childNode: any): void {
    if (!this.node.connector) return;

    // Ensure connector is enabled
    if (!this.node.connector.isEnabled()) {
      this.node.connector.enable();
    }

    // Create connection with association's visual properties
    this.node.connector.connectTo(childNode, {
      lineColor: assoc.lineColor,
      lineWidth: assoc.lineWidth,
    });
  }
}
