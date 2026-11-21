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
  cursor?: { x: number; y: number };
}

export type CollabPackage = SlatePackage; // Backward-compat alias

/**
 * Where a package stands in the order its room was written in: the writer's
 * clock (never behind any package the writer had seen), then the writer, then
 * the package's key.
 */
interface Stamp {
  t: number;
  c: number;
  k?: string;
}

function compareStamps(a: Stamp, b: Stamp): number {
  if (a.t !== b.t) return a.t - b.t;
  if (a.c !== b.c) return a.c - b.c;
  const ak = a.k ?? "";
  const bk = b.k ?? "";
  return ak < bk ? -1 : ak > bk ? 1 : 0;
}

const REPLACED = "onSlateReplaced";

/** Packages about the view or about who is present: they change nothing an undo could put back. */
const VIEW_ONLY = new Set<string>([
  "onZoom",
  "onCanvasMove",
  "onFollowMeChanged",
  "onSlateFollowMeChanged",
  "onSlateHuddleChanged",
  "onCursorMoved",
  "onPresenceChanged",
  "onMouseMoved",
]);

interface RoomEntry {
  key: string;
  pkg: SlatePackage;
}

function stampOf(key: string, pkg: SlatePackage): Stamp {
  return {
    t: typeof pkg.timestamp === "number" ? pkg.timestamp : 0,
    c: typeof pkg.clientID === "number" ? pkg.clientID : 0,
    k: key,
  };
}

/** The line an add or remove of a line names, by its id (older packages without one name none). */
function lineChangeId(pkg: SlatePackage): string | null {
  if (pkg.type !== "addRelationship" && pkg.type !== "removeRelationship") return null;
  const id = (pkg.data as any)?.id;
  return typeof id === "string" && id ? id : null;
}

const byStamp = (a: RoomEntry, b: RoomEntry) =>
  compareStamps(stampOf(a.key, a.pkg), stampOf(b.key, b.pkg));

/**
 * A note and a card trading places, as the server stored it: at workshop revision `r`, note `id`
 * became a card (`as: "card"`: the note left the drawing) or a card became that note
 * (`as: "note"`; `note` is the note as saved, v1 node JSON). The server writes the trade with the
 * board and the drawing, in one write, and keeps the newest trade of each note.
 */
export interface NoteTrade {
  r: number;
  as: "card" | "note";
  note?: { options?: Record<string, any> };
}

/** The trades a stored slate records, with the workshop revision the document was stored at. */
export interface NoteTrades {
  through: number;
  trades: Record<string, NoteTrade>;
}

/**
 * The room's record that it has been told of a note's trade: `data.trade` (the note), `data.r`
 * (the trade's revision), `data.as` (which way it went; missing in records written before 2026-11-21). One per note, never pruned with the note's packages: a room that holds
 * it for a revision holds what happened to the note from then on, so its packages apply as usual.
 */
const TRADED = "onNoteTraded";
/**
 * How long after this client handed its host a change a replacement from someone else still makes
 * it save again once rebuilt: the host's save of that change (debounced, then a round trip) may
 * land after the replacer's save.
 */
const RESAVE_WINDOW_MS = 5000;
const tradeKey = (id: string) => "trade:" + id;

/**
 * The package without what it says about note `id`: unchanged when it says nothing about it,
 * null when it is only about it, else a copy with that note left out of its list. A whole-slate
 * replacement and a trade record are left alone, and so is a note added under parent `id`.
 */
function withoutNote(pkg: SlatePackage, id: string): SlatePackage | null {
  if (!pkg || pkg.type === REPLACED || pkg.type === TRADED) return pkg;
  const data: any = pkg.data;
  if (!data || typeof data !== "object") return pkg;
  if (Array.isArray(data)) {
    const rest = data.filter((item: any) => item?.id !== id);
    if (rest.length === data.length) return pkg;
    return rest.length ? { ...pkg, data: rest as any } : null;
  }
  // A connected note added under a parent names the parent as data.id: that note is not this one.
  const parented = pkg.type === "onNodeAdded" && data.options && !data.nodeOptions;
  if (data.id === id && !parented) return null;
  let next: any = data;
  for (const field of ["nodeOptions", "nodes"]) {
    const list = next[field];
    if (Array.isArray(list)) {
      const rest = list.filter((item: any) => item?.id !== id);
      if (rest.length !== list.length) next = { ...next, [field]: rest };
    } else if (list && typeof list === "object" && list.id === id) {
      next = { ...next, [field]: [] };
    }
  }
  if (next === data) return pkg;
  const empty = ["nodeOptions", "nodes"].every((field) => !Array.isArray(next[field]) || next[field].length === 0);
  return empty && !parented ? null : { ...pkg, data: next };
}

import type { Slate } from "./Slate";
import type { SlatePackage } from "./SlatePackage";
import { v2NodeToV1 } from "./compat";

/** Packages that change the z-order (the note list's order). */
const Z_ORDER_PACKAGES = new Set(["onNodeToFront", "onNodeToBack"]);
/** The one room entry that holds the latest z-order. */
const NODE_ORDER_KEY = "node-order";

export class Collab {
  private slate: Slate;
  private options: CollabOptions;
  private doc: any = null; // Y.Doc
  private provider: any = null; // WebsocketProvider
  private collabMap: any = null; // Y.Map
  private awareness: any = null;
  private isConnected: boolean = false;
  private clientID: number = 0;
  private cursorElements: Map<number, any> = new Map();
  private _cursorMoveHandler: ((e: any) => void) | null = null;
  private _cursorTrackingNode: any = null;
  private _cursorSweepTimer: ReturnType<typeof setInterval> | null = null;
  private _cursorLastSeen: Map<number, number> = new Map();
  /**
   * The latest time on any package this client has written or seen. Each package
   * it writes is stamped later than this, so the room has one order that every
   * client can rebuild, whatever their own clocks say and whichever client's
   * packages Yjs happens to deliver first.
   */
  private clock = 0;
  /** The whole-slate replacement this slate was last built on, if any. */
  private baseline: Stamp | null = null;
  /** Packages from the room still being applied, one after the other. */
  private applying: Promise<void> | null = null;
  /** Whether this client has the room: its first exchange with the relay is done. */
  private synced = false;
  /** The newest trade the host has told of, per note (see settleTrades). */
  private trades = new Map<string, NoteTrade>();
  /**
   * What each traded note is while the room has not been told of its trade: its v1 options, or
   * null for no note. From the stored slate for trades it already held when loaded, else from the
   * trade itself.
   */
  private tradeTruth = new Map<string, Record<string, any> | null>();
  /** The workshop revision every trade this screen draws is settled through (see settleTrades). */
  private tradesThrough = 0;
  private tradeFixTimer: ReturnType<typeof setTimeout> | null = null;
  /** Notes with a trade of this person's own on its way to the server: left as this screen has them. */
  private ownTrades = new Map<string, number>();
  /**
   * Traded notes this screen drew from the server's record (the publication's trade, or the stored
   * slate it loaded), not from the room: the room's half of that trade, when it arrives, is drawn
   * over them (it holds what the trader did to the note before its answer came back).
   */
  private fromRecord = new Set<string>();
  /**
   * The latest add or remove of each line (by its id) that this screen has made or
   * applied. A line keeps its id when one of its ends moves, and a move is its remove
   * and its add again: when two people move the same line's end at once, the later
   * move (in the room's order) wins on every screen, and an earlier one arriving after
   * it is not applied (see staleLineChange).
   */
  private lineStamps = new Map<string, Stamp>();
  /** When this client last handed its host a change to the document (see noteHostChange). */
  private hostChangeAt = 0;
  /** Connection/user payload returned by the host's onInitCollaboration */
  public userBaseData?: Record<string, any>;

  constructor(slate: Slate, options: CollabOptions = {}) {
    this.slate = slate;
    this.options = {
      wsUrl: "ws://localhost:1234",
      roomName: "default-slate",
      userName: "", // empty = no label rendered (see renderCursor); hosts pass real names via onInitCollaboration
      userColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
      ...options,
    };
  }

  /**
   * Initialize collaboration.
   * Requires yjs and y-websocket to be installed.
   */
  public async init(opts?: Partial<CollabOptions>): Promise<void> {
    if (opts) {
      Object.assign(this.options, opts);
    }

    try {
      // Lazy dynamic imports keep yjs optional at install time while letting
      // the CONSUMER's bundler resolve the specifiers (a Function()-wrapped
      // import is invisible to bundlers and can never resolve in a browser).
      // Hosts may also inject the modules directly via options.
      const Y =
        this.options.Y ||
        ((await import(/* @vite-ignore */ "yjs" as any)) as any);
      const WebsocketProvider =
        this.options.WebsocketProvider ||
        ((await import(/* @vite-ignore */ "y-websocket" as any)) as any)
          .WebsocketProvider;

      // Create Y.Doc
      this.doc = new Y.Doc();
      this.clientID = this.doc.clientID;

      // Ask the host app for connection details BEFORE connecting.
      // The app returns `{websocketUrl, websocketParams: {bearer, timestamp},
      // color, userName, ...}` — websocketParams carries the HMAC auth the
      // production collab server requires. (v1 semantics: awaited.)
      let userBaseData: Record<string, any> | undefined;
      const initCb = this.slate.options.events?.onInitCollaboration;
      if (initCb) {
        try {
          userBaseData =
            (await initCb(this.clientID.toString())) || undefined;
        } catch (error) {
          console.warn(
            "COLLAB_DEBUG: onInitCollaboration threw; using static options",
            error
          );
        }
      }
      if (userBaseData) {
        this.userBaseData = userBaseData;
        if (userBaseData.websocketUrl) {
          this.options.wsUrl = userBaseData.websocketUrl;
        }
        if (userBaseData.websocketParams) {
          this.options.wsParams = userBaseData.websocketParams;
        }
        if (userBaseData.userName) {
          this.options.userName = userBaseData.userName;
        }
        if (userBaseData.color) {
          this.options.userColor = userBaseData.color;
        }
      }

      // Create shared map for collab packages
      this.collabMap = this.doc.getMap("collabPackages");

      // Set up observer for remote changes
      this.collabMap.observe((event: any) => {
        if (event.transaction.local) return; // Skip local changes

        this.applyRemoteChanges(event.keysChanged);
      });

      // Create WebSocket provider — params carry auth (e.g. HMAC bearer +
      // timestamp) as query string values, matching y-websocket's API
      this.provider = new WebsocketProvider(
        this.options.wsUrl!,
        this.options.roomName!,
        this.doc,
        {
          connect: true,
          params: this.options.wsParams || {},
        }
      );

      // Set up awareness (user presence)
      this.awareness = this.provider.awareness;
      this.awareness.setLocalStateField("user", {
        name: this.options.userName,
        color: this.options.userColor,
      });

      // Listen for awareness changes (presence + remote cursor movement)
      const notifyUsersChanged = () => {
        const users = this.getCollabUsers();
        this.options.onAwarenessChange?.(users);
        this.slate.options.events?.onCollaborationUsersChanged?.(users);
        this.renderRemoteCursors(users);
      };
      this.awareness.on("change", notifyUsersChanged);

      // Track awareness FRESHNESS per peer: any update (new cursor, heartbeat,
      // re-add) revives/extends its cursor; silence past cursorStaleMs makes
      // it a ghost the sweep can then remove (see renderRemoteCursors).
      this.awareness.on(
        "update",
        ({
          added,
          updated,
          removed,
        }: {
          added: number[];
          updated: number[];
          removed: number[];
        }) => {
          const now = Date.now();
          for (const id of added) this._cursorLastSeen.set(id, now);
          for (const id of updated) this._cursorLastSeen.set(id, now);
          for (const id of removed) this._cursorLastSeen.delete(id);
        },
      );

      // Broadcast this client's pointer position so peers can show its cursor
      this.setupCursorTracking();

      // Same-origin peers sync over y-websocket's BroadcastChannel INSIDE the
      // provider constructor — their states can land before the listener
      // above attaches. Emit the initial roster if remote states already exist.
      if (this.getCollabUsers().length > 0) {
        notifyUsersChanged();
      }

      // Connection status
      this.provider.on("status", (event: any) => {
        this.isConnected = event.status === "connected";
        if (event.status !== "connected") this.synced = false;
        if (event.status !== "connected") {
          // WS dropped: every rendered remote cursor is now unverifiable
          // state. Wipe them (ghost-cursor class, F1); reconnect re-renders
          // still-present peers via awareness change or the sweep below.
          this.clearRemoteCursors();
        }
        this.options.onStatusChange?.(event.status);
      });

      // The room is in hand once the first exchange with the relay is done: only then can this
      // client tell whether the room has been told of a trade (see tellRoomOfTrades). A room that
      // is empty (a relay that restarted) changes no key, so the exchange itself is the signal.
      this.provider.on("sync", (synced: boolean) => this.roomSynced(synced));
      if (this.provider.synced) this.roomSynced(true);

      // Reconcile cursor DOM against awareness every 4s even when no
      // 'change' event fires (missed events, provider-internal removals,
      // BroadcastChannel echoes after reload). Without this, a peer that
      // vanishes leaves its cursor painted forever.
      this._cursorSweepTimer = setInterval(() => {
        if (this.slate?.canvas && this.awareness) {
          this.renderRemoteCursors(this.getCollabUsers());
        }
      }, 4000);
      // isConnected will be set by the status event handler above when the
      // WebSocket actually connects. (onInitCollaboration already ran —
      // awaited before the provider was created.)

      console.log(
        "COLLAB_DEBUG: Initialized collaboration for room",
        this.options.roomName,
        "clientID:",
        this.clientID
      );
    } catch (error: unknown) {
      const e = error as any;
      if (
        e.code === "MODULE_NOT_FOUND" ||
        e.message?.includes("Cannot find module")
      ) {
        console.warn(
          "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
          "Install with: npm install yjs y-websocket"
        );
      } else {
        console.error("COLLAB_DEBUG: Failed to initialize collaboration:", e);
      }
    }
  }

  /**
   * Execute collab packages locally (from Invoker).
   */
  public invoke(packages: SlatePackage | SlatePackage[]): void {
    const pkgs = Array.isArray(packages) ? packages : [packages];

    for (const pkg of pkgs) {
      // A package wholly about a governed note changes nothing here, so it is not
      // an undo step either.
      if ((this.slate as any).screenGovernedPackage?.(pkg.type, pkg.data) === null) continue;
      this.exe(pkg);
      // Host-owned panes use invoke() to apply locally and send() to sync/save.
      // Unlike engine-originated mutations, that path never called
      // Slate.broadcast(), so it silently skipped undo history. Remote Yjs
      // packages call exe() directly and therefore do not create local history.
      this.slate.recordUndoFor?.(pkg.type);
    }
  }

  /**
   * Send collab packages to remote peers.
   *
   * v1 contract: every send() surfaced back to the host through
   * `onSlateChanged` (the yjs local-echo drove the app's save flow), so
   * emit for each package after transmitting — the host's persistence
   * depends on it even when no collab server is connected.
   */
  public send(packages: SlatePackage | SlatePackage[]): void {
    // Nothing about a governed note is sent or handed to the host's save path, even
    // when a host pane sends the package itself instead of going through
    // Slate.broadcast. (On a slate with no drag policy this returns every package as it is.)
    const pkgs = (Array.isArray(packages) ? packages : [packages]).flatMap((pkg) => {
      const data = (this.slate as any).screenGovernedPackage?.(pkg.type, pkg.data);
      if (data === null) return [];
      const sent = data === undefined || data === pkg.data ? pkg : { ...pkg, data };
      // A z-order change goes out as the list order it left (see storeNodeOrder).
      if (Z_ORDER_PACKAGES.has(sent.type) && !Array.isArray(sent.data?.order)) {
        const order = ((this.slate as any).nodes?.allNodes || []).map((node: any) => node.id ?? node.options?.id);
        return [{ ...sent, data: { ...sent.data, order } }];
      }
      return [sent];
    });

    if (this.collabMap) {
      for (const pkg of pkgs) {
        // This person changed the note: their copy is their own now, not the record's.
        for (const id of this.fromRecord) if (withoutNote(pkg, id) !== pkg) this.fromRecord.delete(id);
        // A package about a note whose trade the room has not been told of would be screened out
        // by everyone (see screenTraded): the room is told first, so this package comes after.
        for (const id of this.staleTradesIn(pkg)) this.tellRoomOfTrade(id);
        const key = `${pkg.type}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 5)}`;

        // A full-state replacement (undo/redo) supersedes every package this
        // client has seen: they leave the room in the same step that puts the
        // replacement in. Whatever is in the room beside a replacement was
        // therefore written without sight of it or after it, and is applied on
        // top of it (see rebuildFrom).
        if (pkg.type === REPLACED) {
          const timestamp = this.tick();
          // The notes whose trade this person has on its way (an undo of a trade holds it before its
          // replacement goes out): until that trade is saved and the room told, the replacement says
          // nothing about whether they are notes (see rebuildFrom).
          const held = [...this.ownTrades.keys()];
          const data = held.length && pkg.data && typeof pkg.data === "object" ? { ...(pkg.data as any), held } : pkg.data;
          const entry = { ...pkg, data, clientID: this.clientID, timestamp };
          const write = () => {
            this.pruneBeforeSlateReplacement();
            this.collabMap.set(key, entry);
          };
          if (this.doc) this.doc.transact(write);
          else write();
          this.adoptBaseline({ t: timestamp, c: this.clientID, k: key });
          // The replacement was drawn from this person's own history, which may predate a trade the
          // room has been told of: this screen does what every other screen does on receiving it
          // (see rebuildFrom), once the host has drawn it.
          this.run(async () => {
            const before = this.beforeRemote();
            await this.dropRoomCards(new Set(held));
            this.afterRemote(before);
          });
          continue;
        }

        // A line-property change (lineType, sourceAnchor/targetAnchor, lineColor…)
        // supersedes any earlier change to the SAME property on the SAME
        // association. The collab doc accumulates and is replayed on reload, and
        // the replay order is not guaranteed to be recency order — so leaving the
        // old package in means e.g. toggling Absolute→Relative can be re-applied
        // as Absolute and the toggle "reverts". Prune the superseded ones first.
        if (pkg.type === "onLinePropertiesChanged") {
          this.pruneSupersededLineProperty(pkg.data);
        }

        const entry = { ...pkg, clientID: this.clientID, timestamp: this.tick() };
        const lineId = lineChangeId(pkg);
        if (lineId) this.lineStamps.set(lineId, { t: entry.timestamp, c: this.clientID, k: key });
        if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string") {
          this.storeNodeText(key, entry);
        } else if (Z_ORDER_PACKAGES.has(pkg.type)) {
          this.storeNodeOrder(entry);
        } else {
          this.collabMap.set(key, entry);
        }

        // The collab doc accumulates every package and is replayed on reload/
        // sync. Without this, a deleted node's earlier onNodeAdded would be
        // re-applied on reload and the node would come back. When a node is
        // deleted, prune its add/change packages so the replay can't recreate it.
        if (pkg.type === "onNodeDeleted") {
          const deletedId = (pkg.data as any)?.id;
          if (deletedId != null) this.pruneNodePackages(deletedId);
        }
      }
    } else {
      // Normal pre-init / no-server path: still surface to the host below
      console.log(
        "COLLAB_DEBUG: send() before collab init — emitting locally only"
      );
    }

    for (const pkg of pkgs) {
      (this.slate as any).emitSlateChange?.(pkg.type, pkg.data);
    }
  }

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
  private applyRemoteChanges(keys: Iterable<string>): void {
    const changes: RoomEntry[] = [];
    const labelIds = new Set<string>();
    let replaced = false;
    for (const key of keys) {
      const pkg: SlatePackage | undefined = this.collabMap.get(key);
      if (!pkg) continue;
      this.sawTime(pkg.timestamp);
      if (pkg.type === REPLACED) {
        replaced = true;
        continue;
      }
      // A record that the room was told of a trade changes nothing on the canvas.
      if (pkg.type === TRADED) continue;
      changes.push({ key, pkg });
      if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string") labelIds.add(pkg.data.id);
    }

    if (replaced) {
      // The room holds a whole-slate replacement this client has not seen. If it
      // is newer than what this slate is built on, the slate is rebuilt from it
      // and from everything else in the room; the packages of this batch are
      // among those, so they are not applied a second time here.
      const newest = this.newestReplacement();
      const known = this.knownBaseline();
      if (newest && (!known || compareStamps(newest.stamp, known) > 0)) {
        this.run(() => this.rebuildFrom(newest));
        return;
      }
      // Otherwise it lost to the one this slate already holds (two people undid
      // at the same moment, or this client's document was stored after it).
      this.dropOlderReplacements(newest);
    }

    if (changes.length === 0) {
      this.scheduleTradeFix();
      return;
    }
    changes.sort(byStamp);
    const latest = this.latestLabels(labelIds);
    const documentChanged = changes.some(({ pkg }) => !VIEW_ONLY.has(pkg.type));
    this.run(() => {
      const before = documentChanged ? this.beforeRemote() : null;
      const pending = this.applyInOrder(changes, latest);
      const done = () => {
        this.scheduleTradeFix();
        if (documentChanged) this.afterRemote(before);
      };
      if (pending) return pending.then(done);
      done();
    });
  }

  // Old clients gave every label edit a separate key. Even an untouched
  // pre-upgrade room must replay its latest stored label on a late join.
  private latestLabels(labelIds: Set<string>): Map<string, string> {
    const latest = new Map<string, { key: string; timestamp: number }>();
    if (labelIds.size) this.collabMap.forEach((pkg: SlatePackage, key: string) => {
      if (pkg.type !== "onNodeTextChanged" || typeof pkg.data?.text !== "string" || !labelIds.has(pkg.data.id)) return;
      const previous = latest.get(pkg.data.id);
      const timestamp = pkg.timestamp ?? 0;
      if (!previous || timestamp > previous.timestamp || (timestamp === previous.timestamp && key > previous.key)) {
        latest.set(pkg.data.id, { key, timestamp });
      }
    });
    return new Map([...latest].map(([id, entry]) => [id, entry.key]));
  }

  /**
   * Apply packages in the given order. Returns nothing when all of them could be
   * applied at once, or a promise when one had to wait for notes to be drawn or
   * for a document load to finish.
   */
  private applyInOrder(
    entries: RoomEntry[],
    latestLabel: Map<string, string>,
    from: number = 0,
    waitedAt: number = -1
  ): Promise<void> | void {
    for (let i = from; i < entries.length; i++) {
      if (!this.collabMap || !this.slate) return; // disconnected meanwhile
      const building =
        waitedAt === i ? null : ((this.slate as any).whenBuilt?.() as Promise<void> | null | undefined);
      if (building) return building.then(() => this.applyInOrder(entries, latestLabel, i, i));
      const { key } = entries[i];
      let { pkg } = entries[i];
      // Nothing the room says about a note whose trade it has not been told of is applied.
      const screened = this.screenTraded(pkg);
      if (!screened) continue;
      if (this.staleLineChange(key, screened)) continue;
      pkg = screened;
      if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string" && latestLabel.get(pkg.data.id) !== key) {
        // Not the node's current label: only the formatting it carried applies.
        const { text, ...style } = pkg.data;
        if (!Object.keys(style).some(field => field !== "id")) continue;
        pkg = { ...pkg, data: style };
      }
      let pending: Promise<unknown> | void = undefined;
      try {
        pending = this.applyRoomPackage(pkg);
      } catch (error) {
        // One package that cannot be applied must not take the rest of the room with it.
        console.warn("COLLAB_DEBUG: A package from the room could not be applied:", pkg.type, error);
      }
      if (pending && typeof (pending as Promise<unknown>).then === "function") {
        return (pending as Promise<unknown>).then(
          () => this.applyInOrder(entries, latestLabel, i + 1),
          () => this.applyInOrder(entries, latestLabel, i + 1)
        );
      }
    }
  }

  /**
   * Rebuild the slate from a whole-slate replacement in the room, then apply
   * everything else the room holds, in the order it was written. Those packages
   * were written by people who had not seen the replacement yet, or after it, so
   * they belong on top of it: this client may have applied some of them before,
   * and the replacement has just removed what they did.
   */
  private async rebuildFrom(replacement: RoomEntry & { stamp: Stamp }): Promise<void> {
    if (!this.collabMap || !this.slate) return;
    await (this.slate as any).whenBuilt?.();
    if (!this.collabMap || !this.slate) return;
    // A newer one may have arrived while this one waited its turn.
    const known = this.knownBaseline();
    if (known && compareStamps(replacement.stamp, known) <= 0) return;
    // This client's own undo is being superseded by someone else's later one.
    const lostOwn = !!this.baseline && this.baseline.c === this.clientID && this.clientID !== 0;
    // This client's host was handed a change a moment ago: its save of it was made without this
    // replacement and may land after the replacer's own save of it.
    const savedWithout = this.hostChangeAt > 0 && Date.now() - this.hostChangeAt < RESAVE_WINDOW_MS;
    const before = this.beforeRemote();
    // A traded note whose trade the replacement's writer still had on its way stays as this screen
    // has it: whether it is a note is that trade's to say, once saved (its half follows in the room).
    // So does a note whose trade this person has on its way: the replacement was drawn without it
    // (staging-2 F4: someone's undo reached the trader before its answer, the rebuild drew the note
    // back, and the trader then told the room its note -> card trade left a note).
    const held = Array.isArray((replacement.pkg.data as any)?.held) ? ((replacement.pkg.data as any).held as unknown[]) : [];
    const kept = new Map<string, Record<string, any> | null>();
    for (const id of [...held, ...this.ownTrades.keys()]) {
      if (typeof id !== "string" || kept.has(id)) continue;
      const here = this.slate.nodes?.one?.(id);
      kept.set(id, here ? v2NodeToV1(here.options) : null);
    }
    this.adoptBaseline(replacement.stamp);
    // The slate is rebuilt from the replacement, and the room's packages are applied on top, in order.
    this.lineStamps.clear();
    try {
      await this.handleRemotePackage(replacement.pkg);
    } catch (error) {
      console.warn("COLLAB_DEBUG: The room's replacement could not be applied:", error);
    }
    if (!this.collabMap || !this.slate) return;
    // Loading the replacement put its own (older) marker back into the options.
    this.adoptBaseline(replacement.stamp);
    this.dropOlderReplacements(replacement);
    for (const [id, was] of kept) {
      const here = this.slate.nodes?.one?.(id);
      try {
        if (was && !here) await this.handleRemotePackage({ type: "onNodeAdded", data: { id, nodeOptions: [{ ...was, id }] } } as SlatePackage);
        else if (!was && here) await this.handleRemotePackage({ type: "onNodeDeleted", data: { id, isComment: false } } as SlatePackage);
      } catch (error) {
        console.warn("COLLAB_DEBUG: A note whose trade is on its way could not be kept:", error);
      }
    }
    // The replacement was drawn from a history that may predate a trade the room has been told of.
    await this.dropRoomCards(new Set(kept.keys()));

    const rest: RoomEntry[] = [];
    const labelIds = new Set<string>();
    this.collabMap.forEach((pkg: SlatePackage, key: string) => {
      if (!pkg || pkg.type === REPLACED || pkg.type === TRADED) return;
      rest.push({ key, pkg });
      if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string") labelIds.add(pkg.data.id);
    });
    rest.sort(byStamp);
    await this.applyInOrder(rest, this.latestLabels(labelIds));
    // The replacement may hold a note as it was before a trade the room was not told of.
    await this.enforceStaleTrades();
    this.afterRemote(before);
    this.scheduleTradeFix();
    // The host stored this client's own undo a moment ago, and that save may
    // land after the other person's. Hand it the slate again, as it now is, so
    // the stored document ends on what everyone sees.
    if ((lostOwn || savedWithout) && this.slate) {
      (this.slate as any).emitSlateChange?.(REPLACED, { action: "superseded" });
    }
  }

  /** Run a batch now if nothing from the room is still being applied, else after it. */
  private run(task: () => Promise<void> | void): void {
    const start = () => {
      try {
        return task();
      } catch (error) {
        console.warn("COLLAB_DEBUG: Applying packages from the room failed:", error);
      }
    };
    const work = this.applying ? this.applying.then(start) : start();
    if (!work) return;
    const guarded: Promise<void> = work
      .catch((error: unknown) => console.warn("COLLAB_DEBUG: Applying packages from the room failed:", error))
      .then(() => {
        if (this.applying === guarded) this.applying = null;
      });
    this.applying = guarded;
  }

  /** Resolves when every package received from the room so far has been applied. */
  public whenApplied(): Promise<void> {
    return this.applying ?? Promise.resolve();
  }

  /** The slate just before packages from the room are applied, for the undo history (see afterRemote). */
  private beforeRemote(): unknown {
    try {
      return (this.slate as any)?.undoRedo?.beforeRemote?.() ?? null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Packages from the room have been applied. The person's undo history takes
   * them in, so a later undo of their own work does not also take away what
   * other people did, before or after that work (see UndoRedo.absorbRemote).
   */
  private afterRemote(before: unknown): void {
    try {
      (this.slate as any)?.undoRedo?.absorbRemote?.(before);
    } catch (error) {
      console.warn("COLLAB_DEBUG: Undo history could not take in the room's changes:", error);
    }
  }

  // ─── Trades the server decided ───────────────────────────────────

  /**
   * The host tells of the trades its server has stored (the newest per note) and the workshop
   * revision they are complete through. A trade not heard of before is drawn here at once (the
   * note leaves the canvas, or arrives as the server saved it), as a change from someone else;
   * and when the room has not been told of it (the page that made it went away first), this
   * client tells it a moment later, unless someone else has by then.
   */
  public settleTrades(trades: Record<string, NoteTrade> | null | undefined, through?: number): void {
    this.absorbLoadedTrades();
    this.learnTrades(trades, through, false);
  }

  /** The workshop revision this screen has every trade drawn through: what its drawing save holds. */
  public tradesSettledThrough(): number {
    this.absorbLoadedTrades();
    return this.tradesThrough;
  }

  /**
   * This person's own copy of a traded note was taken away (someone else made the same trade
   * first): the note is drawn again as the server has it, when the server's trade says it is one.
   */
  public keepTrade(id: string): void {
    if (!this.tradeTruth.has(id)) return;
    this.run(async () => {
      await this.enforceTrade(id);
    });
  }

  /**
   * The page that made a trade heard the server took it: the room is told now. Returns false when
   * the host has told of no trade of this note, so the caller sends its packages as before.
   */
  public tellRoomOfTrade(id: string): boolean {
    this.absorbLoadedTrades();
    if (!this.trades.has(id)) return false;
    if (this.staleTrade(id)) this.writeTrades([id]);
    return true;
  }

  /**
   * A trade of this person's own, of note `id`, is on its way to the server until `answered`
   * settles. Until then this screen's copy of the note is the newest there is: an older trade the
   * server tells of meanwhile is not drawn over it, and the room is not told from it.
   */
  public holdTrade(id: string, answered: Promise<unknown>): void {
    this.ownTrades.set(id, (this.ownTrades.get(id) ?? 0) + 1);
    const done = () => {
      const left = (this.ownTrades.get(id) ?? 1) - 1;
      if (left > 0) this.ownTrades.set(id, left);
      else this.ownTrades.delete(id);
      this.scheduleTradeFix();
    };
    answered.then(done, done);
  }

  /**
   * The slate handed its host a change (onSlateChanged), which the host saves. A whole-slate
   * replacement from someone else that this client rebuilds from soon after was not in that save:
   * the host is then handed the slate again, as rebuilt (see rebuildFrom).
   */
  public noteHostChange(type: string): void {
    if (!VIEW_ONLY.has(type)) this.hostChangeAt = Date.now();
  }

  /** The room has been synced with (or lost). */
  private roomSynced(synced: boolean): void {
    this.synced = synced;
    if (synced) this.scheduleTradeFix();
  }

  /**
   * The trades the loaded document records (options.collabTrades), once it is drawn: what that
   * document holds of each traded note is what the note is until the room is told.
   */
  private absorbLoadedTrades(loadedNow = false): void {
    const options = this.slate?.options as any;
    const loaded: NoteTrades | undefined = options?.collabTrades;
    if (!loaded || typeof loaded !== "object") return;
    // Not while the document is still being loaded: its notes are not all there yet.
    if (!loadedNow && (this.slate as any).isLoading?.()) return;
    delete options.collabTrades;
    this.learnTrades(loaded.trades, loaded.through, true);
  }

  private learnTrades(trades: Record<string, NoteTrade> | null | undefined, through: number | undefined, loaded: boolean): void {
    if (typeof through === "number" && through > this.tradesThrough) this.tradesThrough = through;
    if (!trades || typeof trades !== "object") return;
    const fresh: string[] = [];
    for (const [id, trade] of Object.entries(trades)) {
      if (!trade || typeof trade.r !== "number" || (trade.as !== "card" && trade.as !== "note")) continue;
      const known = this.trades.get(id);
      if (known && known.r >= trade.r) continue;
      this.trades.set(id, trade);
      if (loaded) {
        const here = this.slate?.nodes?.one?.(id);
        this.tradeTruth.set(id, here ? v2NodeToV1(here.options) : null);
        if (here) this.fromRecord.add(id);
      } else {
        const options = trade.as === "note" ? trade.note?.options : null;
        this.tradeTruth.set(id, options ? { ...options, id } : null);
        fresh.push(id);
      }
    }
    if (fresh.length) {
      this.run(() => {
        const before = this.beforeRemote();
        return Promise.all(fresh.map((id) => this.enforceTrade(id))).then(() => this.afterRemote(before));
      });
    }
    this.scheduleTradeFix();
  }

  /** The newest trade of `id` the host told of is later than the one the room was told of. */
  private staleTrade(id: string): boolean {
    const trade = this.trades.get(id);
    if (!trade || !this.collabMap) return false;
    const told = this.collabMap.get(tradeKey(id));
    const r = told?.type === TRADED && typeof told.data?.r === "number" ? told.data.r : 0;
    return r < trade.r;
  }

  private staleTradesIn(pkg: SlatePackage): string[] {
    this.absorbLoadedTrades();
    if (!this.trades.size || pkg?.type === TRADED || pkg?.type === REPLACED) return [];
    const out: string[] = [];
    for (const id of this.trades.keys()) {
      if (withoutNote(pkg, id) !== pkg && this.staleTrade(id)) out.push(id);
    }
    return out;
  }

  /** The package less what it says about notes whose trade the room has not been told of. */
  private screenTraded(pkg: SlatePackage): SlatePackage | null {
    this.absorbLoadedTrades();
    if (!this.trades.size || !pkg) return pkg;
    let out: SlatePackage | null = pkg;
    for (const id of this.trades.keys()) {
      if (!out) break;
      const next = withoutNote(out, id);
      if (next !== out && this.staleTrade(id)) out = next;
    }
    return out;
  }

  /**
   * A package from the room. The room's half of a trade (an arrival marked `traded`) is the note as
   * the trader had it when the room was told: a screen that drew the note from the server's record
   * (which holds it as the play saved it) takes the half's copy instead, so a move or an edit the
   * trader made before its answer came back is not lost there. Anything else is applied as it is.
   */
  private applyRoomPackage(pkg: SlatePackage): Promise<unknown> | void {
    const data: any = pkg.data;
    if (pkg.type === "onNodeAdded" && typeof data?.traded === "number" && typeof data.id === "string") {
      const id: string = data.id;
      const replace = this.fromRecord.has(id) && !this.ownTrades.has(id) && !!this.slate?.nodes?.one?.(id);
      this.fromRecord.delete(id);
      if (replace) {
        const removed = this.handleRemotePackage({ type: "onNodeDeleted", data: { id, isComment: false } } as SlatePackage);
        if (removed && typeof (removed as Promise<unknown>).then === "function") {
          return (removed as Promise<unknown>).then(() => this.handleRemotePackage(pkg));
        }
      }
    } else if (pkg.type === "onNodeDeleted" && typeof data?.traded === "number" && typeof data.id === "string") {
      this.fromRecord.delete(data.id);
    }
    return this.handleRemotePackage(pkg);
  }

  /**
   * Take off every note the room's trade records say became a card, unless a newer trade of it is
   * known here, or its trade is on its way (`skip`, and this person's own). A whole-slate
   * replacement is drawn from someone's undo history, which can be older than the trade: the room
   * never brings back a note the server's trade record says is a card.
   */
  private async dropRoomCards(skip: Set<string>): Promise<void> {
    if (!this.collabMap || !this.slate) return;
    const cards: string[] = [];
    this.collabMap.forEach((pkg: SlatePackage) => {
      if (pkg?.type !== TRADED) return;
      const { trade: id, r } = (pkg.data ?? {}) as { trade?: unknown; r?: unknown };
      if (typeof id !== "string" || typeof r !== "number" || skip.has(id) || this.ownTrades.has(id)) return;
      const known = this.trades.get(id);
      if (known && known.r > r) return; // a newer trade is drawn its own way (see enforceStaleTrades)
      // Records written before they said which way the trade went: as the host told of it.
      const as = (pkg.data as any).as ?? (known && known.r === r ? known.as : undefined);
      if (as === "card" && this.slate.nodes?.one?.(id)) cards.push(id);
    });
    for (const id of cards) {
      try {
        await this.handleRemotePackage({ type: "onNodeDeleted", data: { id, isComment: false } } as SlatePackage);
      } catch (error) {
        console.warn("COLLAB_DEBUG: A note the room's trade record says is a card could not be taken off:", error);
      }
    }
  }

  /** Draw note `id` as its trade says, when it is not: take it off, or put it on. */
  private enforceTrade(id: string): Promise<unknown> | void {
    if (!this.slate || !this.tradeTruth.has(id) || this.ownTrades.has(id)) return;
    const truth = this.tradeTruth.get(id);
    const here = this.slate.nodes?.one?.(id);
    try {
      if (truth === null && here) return this.handleRemotePackage({ type: "onNodeDeleted", data: { id, isComment: false } } as SlatePackage);
      if (truth && !here) {
        this.fromRecord.add(id);
        return this.handleRemotePackage({ type: "onNodeAdded", data: { id, nodeOptions: [{ ...truth, id }] } } as SlatePackage);
      }
    } catch (error) {
      console.warn("COLLAB_DEBUG: A traded note could not be drawn as the server has it:", error);
    }
  }

  private async enforceStaleTrades(): Promise<void> {
    for (const id of this.trades.keys()) {
      if (this.staleTrade(id)) await this.enforceTrade(id);
    }
  }

  /**
   * Some trade the room has not been told of: tell it in a moment (a second or two, so the page
   * that made the trade, or another screen, usually does first). Only once this client has the
   * room: before that it cannot know what the room was told.
   */
  private scheduleTradeFix(): void {
    if (this.tradeFixTimer || !this.synced || !this.collabMap || !this.trades.size) return;
    if (![...this.trades.keys()].some((id) => this.staleTrade(id) && !this.ownTrades.has(id))) return;
    this.tradeFixTimer = setTimeout(() => {
      this.tradeFixTimer = null;
      if (!this.synced || !this.collabMap) return;
      this.run(async () => {
        await this.enforceStaleTrades();
        const stale = [...this.trades.keys()].filter((id) => this.staleTrade(id) && !this.ownTrades.has(id));
        if (stale.length) this.writeTrades(stale);
      });
    }, 1000 + Math.floor(Math.random() * 1000));
  }

  /**
   * Tell the room of the trades of these notes, in one step: every package about each note goes,
   * then the note as this screen draws it (its arrival, or its removal), then the record that the
   * room has been told. A client that joins after replays the note from there on.
   */
  private writeTrades(ids: string[]): void {
    if (!this.collabMap || !this.synced || !ids.length) return;
    const write = () => {
      for (const id of ids) {
        const trade = this.trades.get(id);
        if (!trade) continue;
        const changed: [string, SlatePackage | null][] = [];
        this.collabMap.forEach((pkg: SlatePackage, key: string) => {
          if (key === tradeKey(id)) return;
          const rest = withoutNote(pkg, id);
          if (rest !== pkg) changed.push([key, rest]);
        });
        for (const [key, rest] of changed) {
          if (rest) this.collabMap.set(key, rest);
          else this.collabMap.delete(key);
        }
        // A note that became a card is not there, whatever this screen draws (staging-2 F4: a
        // rebuild had drawn it back on the trader's own screen). A card that became a note is the
        // note as this screen draws it (moves made before the answer), else as the server saved it.
        const here = trade.as === "card" ? null : this.slate?.nodes?.one?.(id);
        const truth = trade.as === "card" ? null : this.tradeTruth.get(id);
        const options = here ? v2NodeToV1(here.options) : truth;
        // `traded`: this is the room's half of trade r (see applyRoomPackage).
        const half: SlatePackage = options
          ? ({ type: "onNodeAdded", data: { id, nodeOptions: { ...options, id }, traded: trade.r } } as SlatePackage)
          : ({ type: "onNodeDeleted", data: { id, isComment: false, traded: trade.r } } as SlatePackage);
        this.fromRecord.delete(id);
        const key = `${half.type}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        this.collabMap.set(key, { ...half, clientID: this.clientID, timestamp: this.tick() });
        this.collabMap.set(tradeKey(id), {
          type: TRADED, data: { trade: id, r: trade.r, as: trade.as }, clientID: this.clientID, timestamp: this.tick(),
        });
      }
    };
    try {
      if (this.doc) this.doc.transact(write);
      else write();
    } catch (error) {
      console.warn("COLLAB_DEBUG: The room could not be told of a trade:", error);
    }
  }

  /**
   * An add or remove of a line from the room that is older than the latest one this
   * screen has made or applied for that line: someone else's move of the line's end
   * that lost to a later one. True means skip it; otherwise it becomes the latest.
   */
  private staleLineChange(key: string, pkg: SlatePackage): boolean {
    const id = lineChangeId(pkg);
    if (!id) return false;
    const stamp = stampOf(key, pkg);
    const known = this.lineStamps.get(id);
    if (known && compareStamps(stamp, known) < 0) return true;
    this.lineStamps.set(id, stamp);
    return false;
  }

  /** Stamp for a package this client is about to write: later than all it has seen. */
  private tick(): number {
    this.knownBaseline(); // the loaded document's replacement counts as seen
    this.clock = Math.max(Date.now(), this.clock + 1);
    return this.clock;
  }

  private sawTime(timestamp: unknown): void {
    if (typeof timestamp === "number" && timestamp > this.clock) this.clock = timestamp;
  }

  /**
   * The replacement this slate is built on: the one this client last applied or
   * wrote, or the one the loaded document says it already holds, whichever is
   * later. A document stored after an undo carries that undo's stamp, so the
   * client that loads it keeps the stored document and applies only what the
   * room holds beside the replacement, instead of rebuilding the slate from the
   * room's copy.
   */
  private knownBaseline(): Stamp | null {
    const marker = (this.slate?.options as any)?.collabBaseline;
    const fromDocument: Stamp | null =
      marker && typeof marker.t === "number" && marker.id === (this.slate.options as any).id
        ? { t: marker.t, c: typeof marker.c === "number" ? marker.c : 0, k: marker.k }
        : null;
    // Whatever this client writes next is later than the replacement its document holds.
    if (fromDocument) this.sawTime(fromDocument.t);
    if (!this.baseline) return fromDocument;
    if (!fromDocument) return this.baseline;
    return compareStamps(fromDocument, this.baseline) > 0 ? fromDocument : this.baseline;
  }

  /**
   * The host loaded a document into this slate (loadJSON). If the slate already
   * holds a later replacement than that document says it does (an older version
   * put back by the host), the slate keeps saying so: the next stored document
   * must not send the clients that load it back to the room's copy.
   */
  public documentLoaded(): void {
    if (this.baseline && this.knownBaseline() === this.baseline) this.adoptBaseline(this.baseline);
    // The trades the document records, and what it holds of each traded note.
    this.absorbLoadedTrades(true);
  }

  private adoptBaseline(stamp: Stamp): void {
    this.baseline = stamp;
    this.sawTime(stamp.t);
    const options = this.slate?.options as any;
    if (options) options.collabBaseline = { id: options.id, t: stamp.t, c: stamp.c, k: stamp.k };
  }

  /** The latest whole-slate replacement the room holds. */
  private newestReplacement(): (RoomEntry & { stamp: Stamp }) | null {
    let newest: (RoomEntry & { stamp: Stamp }) | null = null;
    this.collabMap?.forEach((pkg: SlatePackage, key: string) => {
      if (pkg?.type !== REPLACED) return;
      const stamp = stampOf(key, pkg);
      if (!newest || compareStamps(stamp, newest.stamp) > 0) newest = { key, pkg, stamp };
    });
    return newest;
  }

  /** Take replacements that lost to a later one out of the room. */
  private dropOlderReplacements(keep: { key: string } | null): void {
    if (!this.collabMap) return;
    const known = this.knownBaseline();
    const stale: string[] = [];
    this.collabMap.forEach((pkg: SlatePackage, key: string) => {
      if (pkg?.type !== REPLACED || key === keep?.key) return;
      if (known && compareStamps(stampOf(key, pkg), known) < 0) stale.push(key);
    });
    if (stale.length === 0) return;
    const remove = () => stale.forEach((key) => this.collabMap.delete(key));
    try {
      if (this.doc) this.doc.transact(remove);
      else remove();
    } catch (e) {
      /* noop */
    }
  }

  // The room is replayed on every reload, in no fixed order, on top of the
  // stored slate. "Bring note x to front" replayed after notes were added would
  // lift x above them, and the next autosave would keep that. So the room keeps
  // one z-order entry, the whole list order of the latest change; applying it
  // (NodesManager.applyOrder) leaves notes added since in their places.
  private storeNodeOrder(entry: SlatePackage): void {
    const write = () => {
      this.collabMap.forEach((old: SlatePackage, oldKey: string) => {
        if (oldKey !== NODE_ORDER_KEY && Z_ORDER_PACKAGES.has(old.type)) this.collabMap.delete(oldKey);
      });
      this.collabMap.set(NODE_ORDER_KEY, entry);
    };
    if (this.doc) this.doc.transact(write);
    else write();
  }

  // Y.Map chooses one convergent label per node, including simultaneous
  // edits. Random keys retain every old label and replay them in varying order.
  private storeNodeText(key: string, entry: SlatePackage): void {
    const { id, text, ...style } = entry.data;
    const labelKey = "node-text:" + id;
    const write = () => {
      // Preserve formatting from older clients' combined text-and-style
      // packets when migrating their accumulated label changes.
      this.collabMap.forEach((old: SlatePackage, oldKey: string) => {
        if (oldKey === labelKey || old.type !== "onNodeTextChanged" ||
            old.data?.id !== id || old.data.text === undefined) return;
        const { text: previousText, ...remaining } = old.data;
        if (Object.keys(remaining).some(field => field !== "id")) {
          this.collabMap.set(oldKey, { ...old, data: remaining });
        } else {
          this.collabMap.delete(oldKey);
        }
      });
      if (Object.keys(style).length) this.collabMap.set(key, { ...entry, data: { id, ...style } });
      this.collabMap.set(labelKey, { ...entry, data: { id, text } });
    };
    if (this.doc) this.doc.transact(write);
    else write();
  }

  /**
   * Remove a node's accumulated packages (onNodeAdded + onNodeXXXChanged) from
   * the shared collab doc so a reload/sync replay can't recreate a deleted node.
   * Keeps onNodeDeleted tombstones (harmless no-ops on replay). Node packages
   * carry data.id; move/batch packages use array data and are left alone.
   */
  private pruneNodePackages(nodeId: string): void {
    if (!this.collabMap) return;
    try {
      const toDelete: string[] = [];
      this.collabMap.forEach((val: any, key: string) => {
        const d: any = val?.data;
        const id = d && !Array.isArray(d) ? d.id : undefined;
        if (id === nodeId && val?.type !== "onNodeDeleted") {
          toDelete.push(key);
        }
      });
      for (const key of toDelete) this.collabMap.delete(key);
    } catch (e) {
      /* noop */
    }
  }

  /** Remove the mutation replay log before installing a full-state baseline. */
  private pruneBeforeSlateReplacement(): void {
    if (!this.collabMap) return;
    try {
      const keys: string[] = [];
      // What the room was told of trades stays: the replacement is drawn from a slate that had them.
      this.collabMap.forEach((val: any, key: string) => {
        if (val?.type !== TRADED) keys.push(key);
      });
      for (const key of keys) this.collabMap.delete(key);
    } catch (e) {
      /* noop */
    }
  }

  /**
   * Remove earlier onLinePropertiesChanged packages that target the SAME
   * property on the SAME association, so a reload/sync replay applies only the
   * latest value. Matches on (node id, associationId, prop). Guards the "the
   * Absolute/Relative (and Bezier/Orthogonal) toggle reverts after reload" bug:
   * the doc kept both the old and new value and replay order — not recency —
   * decided the winner.
   */
  private pruneSupersededLineProperty(data: any): void {
    if (!this.collabMap || !data || Array.isArray(data)) return;
    const { id, associationId, prop } = data as any;
    if (prop == null) return;
    try {
      const toDelete: string[] = [];
      this.collabMap.forEach((val: any, key: string) => {
        if (val?.type !== "onLinePropertiesChanged") return;
        const d: any = val?.data;
        if (!d || Array.isArray(d)) return;
        if (d.id === id && d.associationId === associationId && d.prop === prop) {
          toDelete.push(key);
        }
      });
      for (const key of toDelete) this.collabMap.delete(key);
    } catch (e) {
      /* noop */
    }
  }

  /**
   * Execute a single collab package using the Invoker.
   */
  public exe(pkg: SlatePackage): Promise<unknown> | void {
    const invoker = this.slate.invoker;
    if (!invoker) {
      console.warn("COLLAB_DEBUG: No invoker available");
      return;
    }
    let pending: Promise<unknown> | undefined;

    const methodName = pkg.type;

    // A package aimed at a governed note is dropped (or trimmed to the notes it
    // may touch): only the host that owns such a note changes it.
    const screened = (this.slate as any).screenGovernedPackage?.(pkg.type, pkg.data);
    if (screened === null) return;
    if (screened !== undefined && screened !== pkg.data) pkg = { ...pkg, data: screened };

    if (typeof (invoker as any)[methodName] === "function") {
      // Applying a remote package must not re-emit onSlateChanged (echo)
      this.slate.beginRemoteApply?.();
      try {
        const result = (invoker as any)[methodName](pkg);
        if (result && typeof result.then === "function") {
          // A package that takes time (a whole-slate replacement): the caller
          // waits for it before applying the next one.
          pending = (result as Promise<unknown>).catch((error: unknown) =>
            console.warn("COLLAB_DEBUG: Async invoker failed:", methodName, error)
          );
        }
      } finally {
        this.slate.endRemoteApply?.();
      }
    } else {
      console.warn("COLLAB_DEBUG: Unknown collab type:", methodName);
    }

    // Trigger collab event
    this.slate.options.events?.onCollaboration?.(pkg);
    return pending;
  }

  /**
   * Update local cursor position and broadcast to peers.
   */
  /**
   * Merge additional data into this client's awareness "user" state
   * (v1 parity: `collab.updateUserData(data)`), e.g. custom status the
   * host app broadcasts to other collaborators.
   */
  public updateUserData(data: Record<string, any>): void {
    if (!this.awareness) return;
    const current = this.awareness.getLocalState()?.user || {};
    this.awareness.setLocalStateField("user", { ...current, ...data });
  }

  public updateCursor(x: number, y: number): void {
    if (!this.awareness) return;

    this.awareness.setLocalStateField("cursor", {
      x,
      y,
      zoom: this.slate.getZoom?.() || 1,
    });
  }

  /**
   * Track this client's pointer over the canvas and broadcast its WORLD
   * position (via the SVG CTM, so it's pan/zoom-independent) to peers. Remote
   * clients render it through renderCursor(). Throttled to ~25fps.
   */
  private setupCursorTracking(): void {
    const node = this.slate.canvas?.node;
    if (!node || typeof node.addEventListener !== "function") return;
    if (this._cursorMoveHandler) return; // already tracking
    let last = 0;
    this._cursorMoveHandler = (e: any) => {
      const now =
        typeof performance !== "undefined" ? performance.now() : +new Date();
      if (now - last < 40) return;
      last = now;
      try {
        // canvas.point() maps client coords → SVG user (world) coords
        const p = this.slate.canvas.point(e.clientX, e.clientY);
        this.updateCursor(p.x, p.y);
      } catch (_) {
        /* noop */
      }
    };
    node.addEventListener("pointermove", this._cursorMoveHandler);
    this._cursorTrackingNode = node;
  }

  /** Remove every rendered remote cursor (drops/reconnects, disconnect). */
  private clearRemoteCursors(): void {
    for (const [, element] of this.cursorElements) {
      try {
        element.remove();
      } catch (_) {
        /* noop */
      }
    }
    this.cursorElements.clear();
  }

  /**
   * Render (or update) remote collaborators' cursors and remove cursors for
   * clients that have left. Called on every awareness change.
   */
  private renderRemoteCursors(users: CollabUser[]): void {
    if (!this.slate.canvas) return;
    const staleMs = this.options.cursorStaleMs ?? 45_000;
    const now = Date.now();
    const fresh = users.filter((u) => {
      if (!u.cursor) return false;
      const seen = this._cursorLastSeen.get(u.clientID);
      if (seen === undefined) {
        // first sighting: seed grace so the sweep cannot kill a live cursor
        // that simply arrived between ticks
        this._cursorLastSeen.set(u.clientID, now);
        return true;
      }
      // Ghost rule: no awareness freshness signal for this peer within
      // staleMs -> treat as not present (element removed below; revives on
      // the next real update).
      return now - seen <= staleMs;
    });
    const present = new Set(fresh.map((u) => u.clientID));
    for (const [id, el] of this.cursorElements) {
      if (!present.has(id)) {
        try {
          el.remove();
        } catch (_) {
          /* noop */
        }
        this.cursorElements.delete(id);
        this._cursorLastSeen.delete(id);
      }
    }
    for (const u of fresh) {
      this.renderCursor(u);
    }
  }

  /**
   * Render a remote cursor on the canvas, reusing its group across updates so
   * frequent cursor moves don't thrash the DOM.
   */
  public renderCursor(user: CollabUser): void {
    if (!user.cursor || !this.slate.canvas) return;

    let g = this.cursorElements.get(user.clientID);
    if (!g || !g.node || !g.node.parentNode) {
      g = this.slate.canvas.group();

      // Arrow pointer in the collaborator's color with a white outline.
      g.polygon("0,0 0,17 4.5,13 7.5,19.5 10.5,18 7.5,11.5 13,11.5")
        .fill(user.color)
        .stroke({ color: "#fff", width: 1.2 })
        .attr("stroke-linejoin", "round");

      // Name label: white rounded-rect background with the name in the user's
      // color on top (matches the pre-regression presence style). Peers
      // WITHOUT a real name render the arrow only — a nameless "Anonymous"
      // tag read as a stuck ghost user (F1, Nov 16).
      const name =
        user.userName && user.userName !== "Anonymous" ? user.userName : "";
      if (name) {
      const label = g.group();
      const txt = label
        .text(name)
        .font({ size: 12, family: "Roboto, Helvetica, Arial, sans-serif" })
        .fill(user.color);
      let tw = 60;
      let th = 16;
      try {
        const bb = txt.bbox();
        if (bb && bb.width) {
          tw = bb.width;
          th = bb.height;
        }
      } catch (_) {
        /* bbox unavailable — use fallback size */
      }
      const padX = 8;
      const padY = 4;
      const rect = label
        .rect(tw + padX * 2, th + padY * 2)
        .radius(6)
        .fill("#fff")
        .stroke({ color: user.color, width: 1 });
      rect.back(); // behind the text
      txt.move(padX, padY);
      // Offset the label from the pointer tip
      label.transform({ translateX: 16, translateY: 6 });
      } // if (name)

      g.attr("pointer-events", "none");
      this.cursorElements.set(user.clientID, g);
    }
    // Position in world space (the group lives in the canvas viewBox), so it
    // lands at the right spot regardless of each viewer's pan/zoom.
    g.transform({ translateX: user.cursor.x, translateY: user.cursor.y });
  }

  /**
   * Get all connected collaboration users.
   */
  public getCollabUsers(): CollabUser[] {
    if (!this.awareness) return [];

    const users: CollabUser[] = [];
    const states = this.awareness.getStates();

    states.forEach((state: any, clientID: number) => {
      if (clientID === this.clientID) return; // Skip self

      users.push({
        clientID,
        userName: state.user?.name || "",
        color: state.user?.color || "#999",
        cursor: state.cursor,
      });
    });

    return users;
  }

  /**
   * Disconnect from collaboration.
   */
  public disconnect(): void {
    // Stop broadcasting local pointer + remove all rendered cursors
    if (this._cursorMoveHandler && this._cursorTrackingNode) {
      try {
        this._cursorTrackingNode.removeEventListener(
          "pointermove",
          this._cursorMoveHandler
        );
      } catch (_) {
        /* noop */
      }
    }
    this._cursorMoveHandler = null;
    this._cursorTrackingNode = null;
    if (this._cursorSweepTimer) {
      clearInterval(this._cursorSweepTimer);
      this._cursorSweepTimer = null;
    }
    for (const [, element] of this.cursorElements) {
      element.remove();
    }
    this.cursorElements.clear();

    if (this.provider) {
      this.provider.disconnect();
      this.provider = null;
    }
    if (this.doc) {
      this.doc.destroy();
      this.doc = null;
    }
    this.collabMap = null;
    this.awareness = null;
    this.isConnected = false;
    this.synced = false;
    if (this.tradeFixTimer) clearTimeout(this.tradeFixTimer);
    this.tradeFixTimer = null;
    this.applying = null;
    console.log("COLLAB_DEBUG: Disconnected");
  }

  /** Check if collaboration is connected */
  public isCollabConnected(): boolean {
    return this.isConnected;
  }

  /** Destroy the collab instance, disconnecting and cleaning up all resources */
  public destroy(): void {
    this.disconnect();
    (this as any).slate = null;
    this.options = {} as CollabOptions;
  }

  /** Get client ID */
  public getClientID(): number {
    return this.clientID;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private handleRemotePackage(pkg: SlatePackage): Promise<unknown> | void {
    console.log("COLLAB_DEBUG: Received remote package:", pkg.type);

    // Execute the package locally
    const pending = this.exe(pkg);

    // Notify via callback
    this.options.onReceive?.(pkg);
    return pending;
  }
}
