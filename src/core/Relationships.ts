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

    // A governed note is connected only by its host (slate.withPolicyAuthority).
    const slate: any = (this.node as any).slate;
    if (
      slate?.capabilitiesOf?.(this.node).canConnect === false ||
      slate?.capabilitiesOf?.(childNode).canConnect === false
    ) {
      return assoc;
    }

    // Parallel edges (Miro-style): allow MORE THAN ONE line between the same pair.
    // The first edge keeps the canonical `parent->child` id (back-compat with saved
    // slates + collab + the reverse lookup); an additional edge to a child that's
    // already connected gets a unique `~N` suffix so it renders as a SEPARATE line
    // instead of being deduped away. A caller that passes an explicit id
    // (deserialize / remote collab add) keeps that id verbatim.
    if (!data?.id) assoc.id = this.unusedId(assoc.id);

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
  public removeAssociation(childIdOrAssocId: string): boolean {
    // Accept either a specific association id (`A->B~2` → remove just that
    // parallel edge) or a child id (`B` → remove EVERY edge to that child, so
    // node deletion / disconnect-from-child never orphans a parallel line).
    const direct = this.assocMap.get(childIdOrAssocId);
    const matches = direct
      ? [direct]
      : Array.from(this.assocMap.values()).filter(
          (a) => a.childId === childIdOrAssocId
        );

    if (matches.length === 0) {
      console.warn(
        "RELATIONSHIP_DEBUG: Association not found:",
        childIdOrAssocId
      );
      return false;
    }

    for (const assoc of matches) {
      // Each edge (canonical or parallel) is keyed by its unique association id
      // in the connector, so remove by that id.
      if (this.node.connector) {
        this.node.connector.disconnectById(assoc.id);
      }
      this.assocMap.delete(assoc.id);
      console.log("RELATIONSHIP_DEBUG: Removed association", assoc.id);

      // Broadcast to collaborators (suppressed during remote apply/teardown).
      // Include the id so a peer removes the exact parallel edge, not all of them.
      (this.node as any).slate?.broadcast?.("removeRelationship", {
        parentId: this.node.id,
        childId: assoc.childId,
        id: assoc.id,
      });
    }
    return true;
  }

  /**
   * Remove all associations from this node.
   */
  public removeAll(): void {
    const ids = Array.from(this.assocMap.keys());
    for (const id of ids) {
      // Remove by the exact association id (handles parallel edges correctly).
      this.removeAssociation(id);
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
    // Key the connector op on the ASSOCIATION id, not the pair — else parallel
    // edges (`A->B~2`) all collapse onto the canonical `A->B` connection, so a line
    // property (color/width/type/anchor/label) set on one parallel edge lands on (or
    // overwrites) the wrong one. For a canonical edge assoc.id === `A->B` anyway.
    const connId = assoc.id;

    (assoc as any)[prop] = val;
    // Anchor props set directly re-solve the connector; others restyle it.
    if (prop === "sourceAnchor" || prop === "targetAnchor") {
      const which = prop === "sourceAnchor" ? "source" : "target";
      const connection = this.node.connector?.getConnections?.()
        .find((c: any) => c.id === connId);
      (connection as any)?.connectable?.setAttachmentAnchor?.(which, val);
    } else {
      this.node.connector?.updateConnection(connId, { [prop]: val } as any);
    }
    return true;
  }

  /**
   * Update all associations with new options (e.g., line color change).
   */
  public updateAssociationsWith(opts: Partial<Association>): void {
    for (const [id, assoc] of this.assocMap) {
      Object.assign(assoc, opts);

      // Update visual if connector supports it. Key by the association id (not the
      // pair) so parallel edges (`A->B~2`) recolor the correct connection.
      if (this.node.connector) {
        this.node.connector.updateConnection(assoc.id, {
          lineColor: assoc.lineColor,
          lineWidth: assoc.lineWidth,
          lineOpacity: assoc.lineOpacity,
          lineEffect: assoc.lineEffect,
          lineDash: assoc.lineDash,
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
          lineOpacity: assoc.lineOpacity,
          lineEffect: assoc.lineEffect,
          lineDash: assoc.lineDash,
        });
      }
    }
  }

  // ─── Query methods ───────────────────────────────────────────────

  /** Get all associations where this node is the parent */
  public getAssociations(): Association[] {
    return Array.from(this.assocMap.values());
  }

  /** Get a specific association by child ID (the canonical edge to that child) */
  public getAssociation(childId: string): Association | undefined {
    return this.assocMap.get(`${this.node.id}->${childId}`);
  }

  /** True if an association with this exact id exists (parallel-edge aware). */
  public hasAssociationId(id: string): boolean {
    return this.assocMap.has(id);
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

  /**
   * `id`, or `id~N` when a line on the slate already has it. Ids are unique across
   * the slate, not only on this note: a line keeps its id when its starting end moves
   * to another note, so `A->B` may be held by B while A connects to B again.
   */
  private unusedId(id: string): string {
    const others: any[] = (this.slate as any)?.nodes?.allNodes || [];
    const taken = (candidate: string) =>
      this.assocMap.has(candidate) ||
      others.some((n: any) => n && n !== this.node && n.relationships !== this && n.relationships?.hasAssociationId?.(candidate));
    if (!taken(id)) return id;
    let n = 2;
    while (taken(`${id}~${n}`)) n++;
    return `${id}~${n}`;
  }

  private renderAssociation(assoc: Association, childNode: any): void {
    if (!this.node.connector) return;

    // Ensure connector is enabled
    if (!this.node.connector.isEnabled()) {
      this.node.connector.enable();
    }

    const props: any = {
      // Drive the connection identity from the association id so parallel edges
      // (`parent->child~N`) render as separate connections instead of colliding
      // on the pair-based key.
      connectionId: assoc.id,
      lineColor: assoc.lineColor,
      lineWidth: assoc.lineWidth,
      lineOpacity: assoc.lineOpacity,
      lineEffect: assoc.lineEffect,
      lineDash: assoc.lineDash,
      lineType: (assoc as any).lineType,
      lineCurviness: (assoc as any).lineCurviness,
      lineCurveType: (assoc as any).lineCurveType,
      showParentArrow: (assoc as any).showParentArrow,
      showChildArrow: (assoc as any).showChildArrow,
      sourceAnchor: (assoc as any).sourceAnchor,
      targetAnchor: (assoc as any).targetAnchor,
      label: (assoc as any).label,
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
   * Draw one of this note's lines again from its record (no change to the
   * model, nothing sent): puts back a line whose end was dropped somewhere it
   * cannot go, and redraws one whose end was re-pinned on its own note.
   */
  public redraw(associationId: string): boolean {
    const assoc = this.assocMap.get(associationId);
    if (!assoc || !this.node.connector) return false;
    this.node.connector.disconnectById(assoc.id);
    this.renderAssociation(assoc, (assoc as any).targetPoint ? null : this.slate.nodes.one(assoc.childId));
    return true;
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
      parentId: this.node.id,
      childId,
      targetPoint: point,
      // A free end is on no note, so it is not pinned to one.
      targetAnchor: null,
    });
    // A line made here for the first time gets its own id; one moved here keeps its id.
    if (!data?.id) assoc.id = this.unusedId(assoc.id);
    this.assocMap.set(assoc.id, assoc);
    this.renderAssociation(assoc, null);
    (this.node as any).slate?.broadcast?.("addRelationship", { ...assoc });
    return assoc;
  }
}
