/**
 * Collab.ts - Collaboration core using Yjs + y-websocket
 *
 * Provides CRDT-based real-time collaboration, matching v1's
 * collab system architecture.
 *
 * Note: yjs and y-websocket are optional peer dependencies.
 * If not installed, collaboration features are no-ops.
 */
export interface CollabOptions {
    /** WebSocket URL for y-websocket server */
    wsUrl?: string;
    /** Room/document name (usually the slate ID) */
    roomName?: string;
    /** Client display name */
    userName?: string;
    /** Client color for cursor */
    userColor?: string;
    /** Called when a remote package is received */
    onReceive?: (pkg: any) => void;
    /** Called when connection status changes */
    onStatusChange?: (status: "connected" | "disconnected" | "connecting") => void;
    /** Called when awareness (user presence) changes */
    onAwarenessChange?: (users: CollabUser[]) => void;
}
export interface CollabUser {
    clientID: number;
    userName: string;
    color: string;
    cursor?: {
        x: number;
        y: number;
    };
}
export type CollabPackage = SlatePackage;
import type { Slate } from "./Slate";
import type { SlatePackage } from "./SlatePackage";
export declare class Collab {
    private slate;
    private options;
    private doc;
    private provider;
    private collabMap;
    private awareness;
    private isConnected;
    private clientID;
    private cursorElements;
    constructor(slate: Slate, options?: CollabOptions);
    /**
     * Initialize collaboration.
     * Requires yjs and y-websocket to be installed.
     */
    init(opts?: Partial<CollabOptions>): Promise<void>;
    /**
     * Execute collab packages locally (from Invoker).
     */
    invoke(packages: SlatePackage | SlatePackage[]): void;
    /**
     * Send collab packages to remote peers.
     */
    send(packages: SlatePackage | SlatePackage[]): void;
    /**
     * Execute a single collab package using the Invoker.
     */
    exe(pkg: SlatePackage): void;
    /**
     * Update local cursor position and broadcast to peers.
     */
    updateCursor(x: number, y: number): void;
    /**
     * Render a remote cursor on the canvas.
     */
    renderCursor(user: CollabUser): void;
    /**
     * Get all connected collaboration users.
     */
    getCollabUsers(): CollabUser[];
    /**
     * Disconnect from collaboration.
     */
    disconnect(): void;
    /** Check if collaboration is connected */
    isCollabConnected(): boolean;
    /** Destroy the collab instance, disconnecting and cleaning up all resources */
    destroy(): void;
    /** Get client ID */
    getClientID(): number;
    private handleRemotePackage;
}
