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

  public moveNodes(packageData: any, options: { animate?: boolean } = {}) {
    // Implementation for moving multiple nodes
    if (packageData.data && Array.isArray(packageData.data.nodes)) {
      packageData.data.nodes.forEach((nodeData: any) => {
        const node = this.one(nodeData.id)
        if (node) {
          const duration = options.animate ? (packageData.data.dur || 500) : 0
          node.position(nodeData.x, nodeData.y, undefined, undefined, duration)
        }
      })
    }
  }

  public addRelationship(relationshipData: any) {
    // Placeholder for relationship functionality
    // This would connect nodes with lines/arrows
    console.log('Adding relationship:', relationshipData)
  }

  public removeRelationship(relationshipData: any) {
    // Placeholder for relationship functionality
    console.log('Removing relationship:', relationshipData)
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