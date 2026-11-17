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
    /** Query-string params sent on connect (e.g. HMAC bearer + timestamp) */
    wsParams?: Record<string, string>;
    /** Optionally inject the yjs module (skips the dynamic import) */
    Y?: any;
    /** Optionally inject the y-websocket WebsocketProvider class */
    WebsocketProvider?: any;
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
    /**
     * A remote cursor whose awareness state has received NO update for this
     * long is treated as a ghost (provider v3 has no heartbeat; a vanished
     * peer's state otherwise persists forever). Default 45s; idle real users
     * re-materialize instantly on their next pointer move.
     */
    cursorStaleMs?: number;
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
    private _cursorMoveHandler;
    private _cursorTrackingNode;
    private _cursorSweepTimer;
    private _cursorLastSeen;
    /** Connection/user payload returned by the host's onInitCollaboration */
    userBaseData?: Record<string, any>;
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
     *
     * v1 contract: every send() surfaced back to the host through
     * `onSlateChanged` (the yjs local-echo drove the app's save flow), so
     * emit for each package after transmitting — the host's persistence
     * depends on it even when no collab server is connected.
     */
    send(packages: SlatePackage | SlatePackage[]): void;
    /**
     * Remove a node's accumulated packages (onNodeAdded + onNodeXXXChanged) from
     * the shared collab doc so a reload/sync replay can't recreate a deleted node.
     * Keeps onNodeDeleted tombstones (harmless no-ops on replay). Node packages
     * carry data.id; move/batch packages use array data and are left alone.
     */
    private pruneNodePackages;
    /** Remove the mutation replay log before installing a full-state baseline. */
    private pruneBeforeSlateReplacement;
    /**
     * Remove earlier onLinePropertiesChanged packages that target the SAME
     * property on the SAME association, so a reload/sync replay applies only the
     * latest value. Matches on (node id, associationId, prop). Guards the "the
     * Absolute/Relative (and Bezier/Orthogonal) toggle reverts after reload" bug:
     * the doc kept both the old and new value and replay order — not recency —
     * decided the winner.
     */
    private pruneSupersededLineProperty;
    /**
     * Execute a single collab package using the Invoker.
     */
    exe(pkg: SlatePackage): void;
    /**
     * Update local cursor position and broadcast to peers.
     */
    /**
     * Merge additional data into this client's awareness "user" state
     * (v1 parity: `collab.updateUserData(data)`), e.g. custom status the
     * host app broadcasts to other collaborators.
     */
    updateUserData(data: Record<string, any>): void;
    updateCursor(x: number, y: number): void;
    /**
     * Track this client's pointer over the canvas and broadcast its WORLD
     * position (via the SVG CTM, so it's pan/zoom-independent) to peers. Remote
     * clients render it through renderCursor(). Throttled to ~25fps.
     */
    private setupCursorTracking;
    /** Remove every rendered remote cursor (drops/reconnects, disconnect). */
    private clearRemoteCursors;
    /**
     * Render (or update) remote collaborators' cursors and remove cursors for
     * clients that have left. Called on every awareness change.
     */
    private renderRemoteCursors;
    /**
     * Render a remote cursor on the canvas, reusing its group across updates so
     * frequent cursor moves don't thrash the DOM.
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
