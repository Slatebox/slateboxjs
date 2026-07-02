import { Node, NodeOptions } from './Node'
import type { Slate } from './Slate'

export class NodesManager {
  private slate: Slate
  private nodes: Map<string, Node> = new Map()

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
    
    return node
  }

  public remove(id: string): boolean {
    const node = this.nodes.get(id)
    if (node) {
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
   *  - v1: `data.nodeOptions: [{id, xPos, yPos}]` (what drag-end broadcasts)
   */
  public moveNodes(packageData: any, options: { animate?: boolean } = {}) {
    const data = packageData?.data ?? packageData ?? {};
    // Programmatic/collab moves GLIDE (v1 animated); a drag-end broadcast
    // carries no dur, so default to a smooth ~400ms unless explicitly 0.
    const duration =
      options.animate === false || data.dur === 0
        ? 0
        : data.dur ?? 400;

    const moves: Array<{ id: string; x: number; y: number }> = [];
    if (Array.isArray(data.nodes)) {
      data.nodes.forEach((n: any) => moves.push({ id: n.id, x: n.x, y: n.y }));
    }
    if (Array.isArray(data.nodeOptions)) {
      data.nodeOptions.forEach((n: any) =>
        moves.push({ id: n.id, x: n.xPos ?? n.x, y: n.yPos ?? n.y })
      );
    }

    moves.forEach((m) => {
      const node = this.one(m.id);
      if (node && typeof m.x === "number" && typeof m.y === "number") {
        node.position(m.x, m.y, undefined, undefined, duration);
      }
    });
  }

  /** Create an association from a collab package: `{parentId, childId, ...opts}` */
  public addRelationship(relationshipData: any) {
    const { parentId, childId, targetPoint } = relationshipData || {};
    const parent = parentId ? this.one(parentId) : undefined;
    if (!parent) {
      console.warn("NODESMANAGER_DEBUG: addRelationship missing parent", parentId);
      return;
    }
    // Idempotent: skip if the association already exists (guards duplicate line
    // / echo loop when the same package arrives via multiple collab paths).
    if ((parent as any).relationships?.getAssociation?.(childId)) return;

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

  /** Remove an association from a collab package: `{parentId, childId}` */
  public removeRelationship(relationshipData: any) {
    const { parentId, childId } = relationshipData || {};
    const parent = parentId ? this.one(parentId) : undefined;
    if (!parent || !childId) return;
    (parent as any).relationships?.removeAssociation(childId);
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