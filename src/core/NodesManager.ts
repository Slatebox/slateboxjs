import { Node, NodeOptions } from './Node'
import type { Slate } from './Slate'

/** Whether a line is drawn between the same ends (notes or free point) as a package says. */
function sameEnds(here: any, data: any): boolean {
  if (!here) return false;
  const point = (p: any) => (p ? `${p.x},${p.y}` : "");
  return here.childId === data.childId && point(here.targetPoint) === point(data.targetPoint);
}

export class NodesManager {
  private slate: Slate
  private nodes: Map<string, Node> = new Map()
  /** Notes added but not yet drawn (a note is built a moment after it is added). */
  private unbuilt: Set<Promise<void>> = new Set()

  constructor(slate: Slate) {
    this.slate = slate
  }

  public add(options: Partial<NodeOptions> = {}): Node {
    // Ensure we have an ID
    if (!options.id) {
      options.id = this.generateId()
    }

    // Check if node with this ID already exists
    if (this.nodes.has(options.id)) {
      console.warn(`Node with id "${options.id}" already exists`)
      return this.nodes.get(options.id)!
    }

    // Create the node
    const node = new Node(options as NodeOptions, this.slate)
    
    // Add to collection
    this.nodes.set(node.id, node)

    const built = node.ready
    if (built && typeof built.then === 'function') {
      this.unbuilt.add(built)
      const done = () => { this.unbuilt.delete(built) }
      built.then(done, done)
    }

    return node
  }

  /** The notes still being drawn, as promises that settle when each is ready. */
  public building(): Promise<void>[] {
    return Array.from(this.unbuilt)
  }

  /** Give up on notes that never finished drawing (see Slate.whenBuilt). */
  public stopWaitingFor(stuck: Promise<void>[]): void {
    stuck.forEach((wait) => this.unbuilt.delete(wait))
  }

  public remove(id: string): boolean {
    const node = this.nodes.get(id)
    if (node) {
      // Clean up EVERY association involving this node so no rogue connector
      // lines or stale associations survive the delete (parity + no-rogue-lines):
      //  (a) this node's own outgoing associations (it is the parent)
      try {
        (node as any).relationships?.removeAll?.()
      } catch (e) {
        /* noop */
      }
      //  (b) incoming associations from other nodes (this node is the child)
      this.allNodes.forEach((other) => {
        if (other.id === id) return
        try {
          // By where each line ends, not by its id: a line keeps its id when an end moves.
          const rels = (other as any).relationships
          const ending = (rels?.getAssociations?.() || []).some((a: any) => a.childId === id)
          if (ending || rels?.getAssociation?.(id)) rels.removeAssociation(id)
        } catch (e) {
          /* noop */
        }
      })
      node.remove()
      this.nodes.delete(id)
      return true
    }
    return false
  }

  public one(id: string): Node | undefined {
    return this.nodes.get(id)
  }

  public get allNodes(): Node[] {
    return Array.from(this.nodes.values())
  }

  /**
   * Move a note to the front (the end of the list, drawn last) or the back
   * (the start). The list is the order notes are saved and loaded in, so a
   * reload keeps the z-order a person or an agent chose.
   */
  public reorder(id: string, place: "front" | "back"): void {
    const node = this.nodes.get(id)
    if (!node) return
    this.nodes.delete(id)
    if (place === "front") {
      this.nodes.set(id, node)
      return
    }
    this.nodes = new Map([[id, node], ...this.nodes])
  }

  /**
   * Take a z-order result from the room: the notes `order` names go, in that
   * order, into the places those notes hold now; a note it does not name (one
   * added after the order was sent) keeps its place. Then the drawing follows
   * the list, the last note on top.
   */
  public applyOrder(order: string[]): void {
    const current = Array.from(this.nodes.keys())
    const named = order.filter((id, index) => this.nodes.has(id) && order.indexOf(id) === index)
    const wanted = new Set(named)
    let next = 0
    const ids = current.map((id) => (wanted.has(id) ? named[next++] : id))
    this.nodes = new Map(ids.map((id) => [id, this.nodes.get(id)!]))
    this.nodes.forEach((node) => (node as any).svgGroup?.front?.())
  }

  public clear(): void {
    this.allNodes.forEach(node => node.remove())
    this.nodes.clear()
  }

  /** Destroy the nodes manager, clearing all nodes */
  public destroy(): void {
    this.clear();
    (this as any).slate = null;
  }

  /**
   * Move nodes from a collab package. Accepts BOTH shapes:
   *  - v2: `data.nodes: [{id, x, y}]`
   *  - v1: `data.nodeOptions: [{id, xPos, yPos, groupId, isLocked}]`
   *    (drag, arrangement, grouping, and group-lock broadcasts)
   */
  public moveNodes(packageData: any, options: { animate?: boolean } = {}) {
    const data = packageData?.data ?? packageData ?? {};
    // Programmatic/collab moves GLIDE (v1 animated); a drag-end broadcast
    // carries no dur, so default to a smooth ~400ms unless explicitly 0.
    const duration =
      options.animate === false || data.dur === 0
        ? 0
        : data.dur ?? 400;

    const moves: Array<{
      id: string
      x: number
      y: number
      groupId?: string | null
      hasGroupId: boolean
      isLocked?: boolean
    }> = [];
    if (Array.isArray(data.nodes)) {
      data.nodes.forEach((n: any) =>
        moves.push({
          id: n.id,
          x: n.x,
          y: n.y,
          groupId: n.groupId,
          hasGroupId: Object.prototype.hasOwnProperty.call(n, 'groupId'),
          isLocked: n.isLocked,
        })
      );
    }
    if (Array.isArray(data.nodeOptions)) {
      data.nodeOptions.forEach((n: any) =>
        moves.push({
          id: n.id,
          x: n.xPos ?? n.x,
          y: n.yPos ?? n.y,
          groupId: n.groupId,
          hasGroupId: Object.prototype.hasOwnProperty.call(n, 'groupId'),
          isLocked: n.isLocked,
        })
      );
    }

    moves.forEach((m) => {
      const node = this.one(m.id);
      if (!node) return;
      if (typeof m.x === "number" && typeof m.y === "number") {
        node.position(m.x, m.y, undefined, undefined, duration);
      }
      // onNodesMove is also the established persistence/collaboration package
      // for groups and group locks. Applying only x/y made those mutations look
      // correct locally and in Mongo while every remote client silently dropped
      // the grouping/lock state.
      if (m.hasGroupId) {
        node.options.groupId = m.groupId || undefined;
      }
      if (m.isLocked === true && !node.options.isLocked) {
        node.lock();
      } else if (m.isLocked === false && node.options.isLocked) {
        node.unlock();
      }
    });
  }

  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  public addRelationship(relationshipData: any, waited = false) {
    const { parentId, childId, targetPoint } = relationshipData || {};
    const parent = parentId ? this.one(parentId) : undefined;
    if (!parent) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", parentId);
      return;
    }
    // A starting note made a moment ago (a duplicate) is still being drawn and
    // has no relationships yet: join it once it is ready instead of dropping
    // the connector. (A new far end is joined at once, as before.)
    const pending = [parent].filter((node: any) => !node.relationships && node.ready);
    // Wait once: a note that is ready and still has no relationships never will.
    if (pending.length && !waited) {
      Promise.all(pending.map((node: any) => node.ready))
        .then(() => this.addRelationship(relationshipData, true))
        .catch((error) => console.warn("NODESMANAGER_DEBUG: addRelationship after ready failed", error));
      return;
    }
    // Idempotent by the EXACT association id (parallel edges have distinct ids
    // like `A->B~2`, so keying on childId alone would wrongly drop the second
    // line). Falls back to childId for legacy packages that carry no id.
    // A line keeps its id when one of its ends moves, so an add of a line this screen
    // already has, drawn elsewhere (another person moved its end), moves it there: the
    // line is taken off the note that holds it here and added as the package says.
    // The same line, drawn the same way, is left alone.
    const rid = (relationshipData as any).id;
    if (rid) {
      const holder: any = this.allNodes.find((node: any) => node.relationships?.hasAssociationId?.(rid));
      if (holder) {
        const here = holder.relationships.getAssociations?.().find((a: any) => a.id === rid);
        if (holder === parent && sameEnds(here, relationshipData)) return;
        holder.relationships.removeAssociation(rid);
      }
    } else if ((parent as any).relationships?.getAssociation?.(childId)) {
      return;
    }

    // Free-floating endpoint (L1b): target is a bare point, no child node.
    if (targetPoint) {
      (parent as any).relationships?.addFloatingAssociation(
        targetPoint,
        relationshipData
      );
      return;
    }

    const child = childId ? this.one(childId) : undefined;
    if (!child) {
      console.warn(
        "NODESMANAGER_DEBUG: addRelationship missing child",
        parentId,
        childId
      );
      return;
    }
    (parent as any).relationships?.addAssociation(child, relationshipData);
  }

  /** Remove an association from a collab package: `{parentId, childId, id?}` */
  public removeRelationship(relationshipData: any) {
    const { parentId, childId, id } = relationshipData || {};
    const parent = parentId ? this.one(parentId) : undefined;
    if (!parent || (!childId && !id)) return;
    // Prefer the exact association id so a peer removes only the intended
    // parallel edge; fall back to childId (removes all edges to that child).
    (parent as any).relationships?.removeAssociation(id || childId);
  }

  private generateId(): string {
    return 'node_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now()
  }

  public count(): number {
    return this.nodes.size
  }

  public forEach(callback: (node: Node, id: string) => void): void {
    this.nodes.forEach(callback)
  }

  public filter(predicate: (node: Node) => boolean): Node[] {
    return this.allNodes.filter(predicate)
  }

  public find(predicate: (node: Node) => boolean): Node | undefined {
    return this.allNodes.find(predicate)
  }
}
