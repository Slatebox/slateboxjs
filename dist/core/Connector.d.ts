import type { Node } from "./Node";
export interface ConnectorOptions {
    enabled?: boolean;
    lineContainer?: any;
    markerContainer?: any;
    padEllipse?: boolean;
    defaultLineColor?: string;
    defaultLineWidth?: number;
    onConnect?: (connection: Connection) => void;
    onDisconnect?: (connection: Connection) => void;
    type?: "straight" | "curved" | "orthogonal";
    color?: string;
    strokeWidth?: number;
    sourceAttach?: "center" | "perifery";
    targetAttach?: "center" | "perifery";
    markerSource?: string;
    markerTarget?: string;
    showHandles?: boolean;
    curveRadius?: number;
}
export interface Connection {
    id: string;
    source: Node;
    target: Node;
    connectable: any;
    lineColor?: string;
    lineWidth?: number;
    sourceAnchor?: {
        x: number;
        y: number;
    } | null;
    targetAnchor?: {
        x: number;
        y: number;
    } | null;
}
export declare class Connector {
    private node;
    private slate;
    private options;
    private connections;
    private isActive;
    /**
     * Creates a connector for a node. Manages connection lines to other nodes.
     *
     * @param node    - The parent Node instance
     * @param options - Connector configuration (line color, width, type, etc.)
     */
    constructor(node: Node, options?: ConnectorOptions);
    /** Enable the connector, making connection handles available. */
    enable(): void;
    /** Disable the connector and remove all connections. */
    disable(): void;
    destroy(): void;
    private ensureContainers;
    connectTo(targetNode: any, connectionOptions?: Partial<Connection>): Connection | null;
    /**
     * Connect this node to a bare WORLD point (free-floating endpoint, L1b).
     * Backed by an invisible 1px "phantom" rect at the point so the existing
     * svg.connectable geometry (edge-solve on the target's bbox) works unchanged.
     * The synthetic id keys the connection like a normal one.
     */
    connectToPoint(point: {
        x: number;
        y: number;
    }, synthId: string, connectionOptions?: Partial<Connection>): Connection | null;
    disconnectFrom(targetNode: any): boolean;
    disconnectById(connectionId: string): boolean;
    disconnectAll(): void;
    getConnections(): Connection[];
    getConnection(targetNodeId: string): Connection | null;
    updateConnection(connectionId: string, updates: Partial<Connection>): boolean;
    /**
     * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
     * normalized local anchor {x,y} in 0..1 on the source or target node.
     * A pinned endpoint stays on that point and rotates with the node; null
     * restores auto-flow (nearest-edge). Re-solves immediately.
     */
    setConnectionAnchor(targetNodeId: string, which: "source" | "target", anchor: {
        x: number;
        y: number;
    } | null): boolean;
    /**
     * Endpoint-drag → model (L1). The vendored lib has already reattached the
     * VIEW when this fires; we reconcile the association MODEL so the change
     * broadcasts to peers and persists. Reattaching to a node rebuilds the
     * association (remove old + add new) through the already-synced/persisted
     * addAssociation/removeAssociation. Deferred a tick so the lib's dragend
     * finishes before we tear down/recreate the connection.
     *
     * Free-floating (phantom) drops are L1b — not yet persisted; left as a
     * view-only endpoint for now (no rogue model state).
     */
    private handleEndpointChange;
    /**
     * L5 per-endpoint locking. mode "absolute" freezes the endpoint at its
     * current spot on the node (a normalized local anchor that then moves/rotates
     * with the node); "relative" clears it back to auto-flow (nearest-edge).
     * Returns the anchor that was set (or null) so callers can persist it.
     */
    setEndpointLock(connectionId: string, which: "source" | "target", mode: "absolute" | "relative"): {
        x: number;
        y: number;
    } | null;
    isEnabled(): boolean;
    updateOptions(options: Partial<ConnectorOptions>): void;
}
