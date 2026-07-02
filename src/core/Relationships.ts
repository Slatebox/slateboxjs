/**
 * Relationships.ts - Manages parent-child associations on a Node
 *
 * Following the isolated class pattern (like ResizeRotate, Connector):
 * - Constructor takes node and options
 * - Has enable(), disable(), serialize() methods
 * - Owned by Node, coordinates with Connector for rendering
 */

import { Association, createDefaultAssociation } from "./Relationship";
import type { Node } from "./Node";
import type { Slate } from "./Slate";

export interface RelationshipsOptions {
  enabled?: boolean;
}

export class Relationships {
  private node: Node;
  private slate: Slate;
  private assocMap: Map<string, Association> = new Map();

  /**
   * v1 contract: `.associations` is a plain ARRAY whose entries carry live
   * `parent`/`child` node references (host apps read `a.parent.options.id`
   * and PropType it as an array). The Map stays internal.
   */
  public get associations(): Array<Association & { parent: any; child: any }> {
    const slate = (this.node as any)?.slate;
    return Array.from(this.assocMap.values()).map((a) => ({
      ...a,
      parent:
        slate?.nodes?.one?.(a.parentId) ??
        (a.parentId === this.node.id ? this.node : undefined),
      child:
        slate?.nodes?.one?.(a.childId) ??
        (a.childId === this.node.id ? this.node : undefined),
    }));
  }
  private isActive: boolean = false;

  constructor(node: Node, options: RelationshipsOptions = {}) {
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
    this.assocMap.set(assoc.id, assoc);

    // Create visual connection through Connector
    this.renderAssociation(assoc, childNode);

    // Broadcast to collaborators (suppressed during remote apply/load)
    (this.node as any).slate?.broadcast?.("addRelationship", { ...assoc });

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
    const assoc = this.assocMap.get(assocId);

    if (!assoc) {
      console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        assocId
      );
      return false;
    }

    // Remove visual connection (floating endpoints have no child node → remove
    // by connection id; node-backed ones disconnect from the child node).
    if ((assoc as any).targetPoint && this.node.connector) {
      this.node.connector.disconnectById(assocId);
    } else {
      const childNode = this.slate.nodes.one(childId);
      if (childNode && this.node.connector) {
        this.node.connector.disconnectFrom(childNode);
      }
    }

    this.assocMap.delete(assocId);
    console.log("RELATIONSHIP_DEBUG: Removed association", assocId);

    // Broadcast to collaborators (suppressed during remote apply/teardown)
    (this.node as any).slate?.broadcast?.("removeRelationship", {
      parentId: this.node.id,
      childId,
    });
    return true;
  }

  /**
   * Remove all associations from this node.
   */
  public removeAll(): void {
    const ids = Array.from(this.assocMap.keys());
    for (const id of ids) {
      const assoc = this.assocMap.get(id)!;
      this.removeAssociation(assoc.childId);
    }
  }

  /**
   * Apply a single line property (from the line-properties pane) to one
   * association: update the stored record (so it serializes/persists) AND
   * re-render the connector. Used by the onLinePropertiesChanged apply path
   * (local invoke + remote collab), which is why line edits now sync + persist.
   */
  public applyLineProperty(
    associationId: string,
    prop: string,
    val: any
  ): boolean {
    let assoc = this.assocMap.get(associationId);
    if (!assoc) {
      for (const a of this.assocMap.values()) {
        if (a.id === associationId) {
          assoc = a;
          break;
        }
      }
    }
    if (!assoc) return false;
    (assoc as any)[prop] = val;
    const connId = `${this.node.id}->${assoc.childId}`;
    this.node.connector?.updateConnection(connId, { [prop]: val } as any);
    return true;
  }

  /**
   * Update all associations with new options (e.g., line color change).
   */
  public updateAssociationsWith(opts: Partial<Association>): void {
    for (const [id, assoc] of this.assocMap) {
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
    for (const [id, assoc] of this.assocMap) {
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
    return Array.from(this.assocMap.values());
  }

  /** Get a specific association by child ID */
  public getAssociation(childId: string): Association | undefined {
    return this.assocMap.get(`${this.node.id}->${childId}`);
  }

  /** Check if this node has any associations */
  public hasAssociations(): boolean {
    return this.assocMap.size > 0;
  }

  /** Get count of associations */
  public count(): number {
    return this.assocMap.size;
  }

  // ─── Serialization ───────────────────────────────────────────────

  /** Serialize all associations to JSON-compatible format */
  public serialize(): { associations: Association[] } {
    return {
      associations: Array.from(this.assocMap.values()),
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
    this.assocMap.clear();
    (this as any).node = null;
    (this as any).slate = null;
  }

  // ─── Private helpers ─────────────────────────────────────────────

  private renderAssociation(assoc: Association, childNode: any): void {
    if (!this.node.connector) return;

    // Ensure connector is enabled
    if (!this.node.connector.isEnabled()) {
      this.node.connector.enable();
    }

    const props: any = {
      lineColor: assoc.lineColor,
      lineWidth: assoc.lineWidth,
      lineType: (assoc as any).lineType,
      lineCurviness: (assoc as any).lineCurviness,
      showParentArrow: (assoc as any).showParentArrow,
      showChildArrow: (assoc as any).showChildArrow,
      sourceAnchor: (assoc as any).sourceAnchor,
      targetAnchor: (assoc as any).targetAnchor,
    };

    // Free-floating target endpoint (L1b): connect to a bare point, not a node.
    if ((assoc as any).targetPoint) {
      this.node.connector.connectToPoint(
        (assoc as any).targetPoint,
        assoc.childId,
        props
      );
      return;
    }

    if (!childNode) return;
    // Create connection with the association's full visual properties so a
    // saved line type / curviness / arrows render correctly (incl. on reload).
    this.node.connector.connectTo(childNode, props);
  }

  /**
   * Add a free-floating association whose target is a bare world point rather
   * than a node (L1b). Backed by a phantom endpoint; broadcasts + persists like
   * a normal association (targetPoint travels in the record).
   */
  public addFloatingAssociation(
    point: { x: number; y: number },
    data?: Partial<Association>
  ): Association {
    const childId =
      (data as any)?.childId ||
      `__free_${Math.random().toString(36).slice(2, 10)}`;
    const assoc = createDefaultAssociation(this.node.id, childId, {
      ...data,
      childId,
      targetPoint: point,
    });
    this.assocMap.set(assoc.id, assoc);
    this.renderAssociation(assoc, null);
    (this.node as any).slate?.broadcast?.("addRelationship", { ...assoc });
    return assoc;
  }
}
