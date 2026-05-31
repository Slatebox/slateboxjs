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
}
export declare class Connector {
    private node;
    private slate;
    private options;
    private connections;
    private isActive;
    constructor(node: Node, options?: ConnectorOptions);
    enable(): void;
    disable(): void;
    destroy(): void;
    private ensureContainers;
    connectTo(targetNode: any, connectionOptions?: Partial<Connection>): Connection | null;
    disconnectFrom(targetNode: any): boolean;
    disconnectById(connectionId: string): boolean;
    disconnectAll(): void;
    getConnections(): Connection[];
    getConnection(targetNodeId: string): Connection | null;
    updateConnection(connectionId: string, updates: Partial<Connection>): boolean;
    isEnabled(): boolean;
    updateOptions(options: Partial<ConnectorOptions>): void;
}
