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
/**
 * A note and a card trading places, as the server stored it: at workshop revision `r`, note `id`
 * became a card (`as: "card"`: the note left the drawing) or a card became that note
 * (`as: "note"`; `note` is the note as saved, v1 node JSON). The server writes the trade with the
 * board and the drawing, in one write, and keeps the newest trade of each note.
 */
export interface NoteTrade {
    r: number;
    as: "card" | "note";
    note?: {
        options?: Record<string, any>;
    };
}
/** The trades a stored slate records, with the workshop revision the document was stored at. */
export interface NoteTrades {
    through: number;
    trades: Record<string, NoteTrade>;
}
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
    /**
     * The latest time on any package this client has written or seen. Each package
     * it writes is stamped later than this, so the room has one order that every
     * client can rebuild, whatever their own clocks say and whichever client's
     * packages Yjs happens to deliver first.
     */
    private clock;
    /** The whole-slate replacement this slate was last built on, if any. */
    private baseline;
    /** Packages from the room still being applied, one after the other. */
    private applying;
    /** Whether this client has the room: its first exchange with the relay is done. */
    private synced;
    /** The newest trade the host has told of, per note (see settleTrades). */
    private trades;
    /**
     * What each traded note is while the room has not been told of its trade: its v1 options, or
     * null for no note. From the stored slate for trades it already held when loaded, else from the
     * trade itself.
     */
    private tradeTruth;
    /** The workshop revision every trade this screen draws is settled through (see settleTrades). */
    private tradesThrough;
    private tradeFixTimer;
    /** Notes with a trade of this person's own on its way to the server: left as this screen has them. */
    private ownTrades;
    /**
     * Traded notes this screen drew from the server's record (the publication's trade, or the stored
     * slate it loaded), not from the room: the room's half of that trade, when it arrives, is drawn
     * over them (it holds what the trader did to the note before its answer came back).
     */
    private fromRecord;
    /** When this client last handed its host a change to the document (see noteHostChange). */
    private hostChangeAt;
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
     * Packages arrived from the room: one edit from a person on the slate, or the
     * whole room when this client joins.
     *
     * They are applied in the order they were written, one after the other, each
     * waiting until the notes before it are drawn. Yjs hands them over grouped by
     * the client that wrote them, not by time, and a note is built a moment after
     * it is added: applied as they came, in one go, a rename reached a note that
     * was not drawn yet and was lost, and a replacement written by one client
     * could land on top of later work by another.
     */
    private applyRemoteChanges;
    private latestLabels;
    /**
     * Apply packages in the given order. Returns nothing when all of them could be
     * applied at once, or a promise when one had to wait for notes to be drawn or
     * for a document load to finish.
     */
    private applyInOrder;
    /**
     * Rebuild the slate from a whole-slate replacement in the room, then apply
     * everything else the room holds, in the order it was written. Those packages
     * were written by people who had not seen the replacement yet, or after it, so
     * they belong on top of it: this client may have applied some of them before,
     * and the replacement has just removed what they did.
     */
    private rebuildFrom;
    /** Run a batch now if nothing from the room is still being applied, else after it. */
    private run;
    /** Resolves when every package received from the room so far has been applied. */
    whenApplied(): Promise<void>;
    /** The slate just before packages from the room are applied, for the undo history (see afterRemote). */
    private beforeRemote;
    /**
     * Packages from the room have been applied. The person's undo history takes
     * them in, so a later undo of their own work does not also take away what
     * other people did, before or after that work (see UndoRedo.absorbRemote).
     */
    private afterRemote;
    /**
     * The host tells of the trades its server has stored (the newest per note) and the workshop
     * revision they are complete through. A trade not heard of before is drawn here at once (the
     * note leaves the canvas, or arrives as the server saved it), as a change from someone else;
     * and when the room has not been told of it (the page that made it went away first), this
     * client tells it a moment later, unless someone else has by then.
     */
    settleTrades(trades: Record<string, NoteTrade> | null | undefined, through?: number): void;
    /** The workshop revision this screen has every trade drawn through: what its drawing save holds. */
    tradesSettledThrough(): number;
    /**
     * This person's own copy of a traded note was taken away (someone else made the same trade
     * first): the note is drawn again as the server has it, when the server's trade says it is one.
     */
    keepTrade(id: string): void;
    /**
     * The page that made a trade heard the server took it: the room is told now. Returns false when
     * the host has told of no trade of this note, so the caller sends its packages as before.
     */
    tellRoomOfTrade(id: string): boolean;
    /**
     * A trade of this person's own, of note `id`, is on its way to the server until `answered`
     * settles. Until then this screen's copy of the note is the newest there is: an older trade the
     * server tells of meanwhile is not drawn over it, and the room is not told from it.
     */
    holdTrade(id: string, answered: Promise<unknown>): void;
    /**
     * The slate handed its host a change (onSlateChanged), which the host saves. A whole-slate
     * replacement from someone else that this client rebuilds from soon after was not in that save:
     * the host is then handed the slate again, as rebuilt (see rebuildFrom).
     */
    noteHostChange(type: string): void;
    /** The room has been synced with (or lost). */
    private roomSynced;
    /**
     * The trades the loaded document records (options.collabTrades), once it is drawn: what that
     * document holds of each traded note is what the note is until the room is told.
     */
    private absorbLoadedTrades;
    private learnTrades;
    /** The newest trade of `id` the host told of is later than the one the room was told of. */
    private staleTrade;
    private staleTradesIn;
    /** The package less what it says about notes whose trade the room has not been told of. */
    private screenTraded;
    /**
     * A package from the room. The room's half of a trade (an arrival marked `traded`) is the note as
     * the trader had it when the room was told: a screen that drew the note from the server's record
     * (which holds it as the play saved it) takes the half's copy instead, so a move or an edit the
     * trader made before its answer came back is not lost there. Anything else is applied as it is.
     */
    private applyRoomPackage;
    /** Draw note `id` as its trade says, when it is not: take it off, or put it on. */
    private enforceTrade;
    private enforceStaleTrades;
    /**
     * Some trade the room has not been told of: tell it in a moment (a second or two, so the page
     * that made the trade, or another screen, usually does first). Only once this client has the
     * room: before that it cannot know what the room was told.
     */
    private scheduleTradeFix;
    /**
     * Tell the room of the trades of these notes, in one step: every package about each note goes,
     * then the note as this screen draws it (its arrival, or its removal), then the record that the
     * room has been told. A client that joins after replays the note from there on.
     */
    private writeTrades;
    /** Stamp for a package this client is about to write: later than all it has seen. */
    private tick;
    private sawTime;
    /**
     * The replacement this slate is built on: the one this client last applied or
     * wrote, or the one the loaded document says it already holds, whichever is
     * later. A document stored after an undo carries that undo's stamp, so the
     * client that loads it keeps the stored document and applies only what the
     * room holds beside the replacement, instead of rebuilding the slate from the
     * room's copy.
     */
    private knownBaseline;
    /**
     * The host loaded a document into this slate (loadJSON). If the slate already
     * holds a later replacement than that document says it does (an older version
     * put back by the host), the slate keeps saying so: the next stored document
     * must not send the clients that load it back to the room's copy.
     */
    documentLoaded(): void;
    private adoptBaseline;
    /** The latest whole-slate replacement the room holds. */
    private newestReplacement;
    /** Take replacements that lost to a later one out of the room. */
    private dropOlderReplacements;
    private storeNodeOrder;
    private storeNodeText;
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
    exe(pkg: SlatePackage): Promise<unknown> | void;
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
