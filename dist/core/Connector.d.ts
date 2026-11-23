import type { Node } from "./Node";
import { type EndAnchor, type EndState, type LineEnd } from "./LineEnds";
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
    lineOpacity?: number;
    lineEffect?: string;
    /** "solid" (the default), "dashed" or "dotted". */
    lineDash?: LineDash;
    label?: string;
    /** Where the label sits along the line, 0.05 (its start) to 0.95 (its end); the middle when unset. */
    labelPosition?: number;
    sourceAnchor?: {
        x: number;
        y: number;
    } | null;
    targetAnchor?: {
        x: number;
        y: number;
    } | null;
}
export type LineDash = "solid" | "dashed" | "dotted";
/**
 * The SVG stroke-dasharray for a line's dash style, scaled by its width, or null
 * for a solid line (and for any value the engine does not know).
 */
export declare function lineDashArray(dash: string | undefined | null, width: number): string | null;
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
    /** Apply v1 line opacity/effect fields to the visible connector path. */
    private applyLineAppearance;
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
    /** Whether an end of one of this note's lines follows its note, is pinned to a spot on its edge, or is free. */
    endState(connectionId: string, which: LineEnd): EndState | null;
    /**
     * Where an end is on its note now, as an anchor: read from the line as drawn,
     * so pinning an end that follows keeps it exactly where it is. Null for a free end.
     */
    currentAnchor(connectionId: string, which: LineEnd): EndAnchor | null;
    /**
     * Pin an end where it is now ("pinned"), at a given spot ({x, y}), or let it
     * follow its note ("follow"). Saved on the line, shared and undoable, like
     * every line property. False for a free end or a line this note does not hold.
     */
    setEnd(connectionId: string, which: LineEnd, mode: "follow" | "pinned" | EndAnchor): boolean;
    /**
     * An end was dropped (the vendored lib has already moved the VIEW). The model
     * follows: on another note the end moves there, pinned to the spot when dropped
     * near the note's edge and following the note when dropped on its middle; on
     * empty canvas the end stays where it was let go, free. A line whose starting
     * end is let go belongs to the note at its far end from then on (drawn the same
     * way). The line keeps its id. Deferred a tick so the lib's dragend finishes
     * before the connection is drawn again.
     */
    private handleEndpointChange;
    private applyEndDrop;
    /** Select a line again once it has been drawn anew (after its end moved). */
    private reselect;
    /** Select one of this note's lines, as clicking it does. */
    selectConnection(connectionId: string): boolean;
    /**
     * Name each end handle of a selected line for what it is and does (a button
     * in the tab order, with a tooltip), and handle its keys: Enter or Space pins
     * an end where it is or lets it follow again; the arrow keys slide a pinned
     * end round its note's edge; Delete removes the line; Escape leaves it.
     */
    private describeHandles;
    /**
     * Miro-style hover reveal for a connection's endpoint handles. Handles are
     * hidden by default (CSS) and shown while the pointer is over the line, its
     * hit area, or a handle — then hidden again on leave, UNLESS the connection is
     * selected (`_handlesPinned`, set by showLineCog / cleared by clearLineCog).
     * Handles are created lazily by the vendored lib, so we resolve them at event
     * time rather than capturing them now.
     */
    private wireHandleReveal;
    private showLineCog;
    /**
     * Select the connector so its endpoint handles show — this is what makes the
     * endpoints draggable (L1 snap-anywhere). Tracked on the slate so
     * clearLineCog() (canvas click / node select) deselects it — no stuck state.
     */
    private selectLineConnectable;
    private openLinePane;
    isEnabled(): boolean;
    updateOptions(options: Partial<ConnectorOptions>): void;
}
