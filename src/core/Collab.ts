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

const byStamp = (a: RoomEntry, b: RoomEntry) =>
  compareStamps(stampOf(a.key, a.pkg), stampOf(b.key, b.pkg));

import type { Slate } from "./Slate";
import type { SlatePackage } from "./SlatePackage";

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
        if (event.status !== "connected") {
          // WS dropped: every rendered remote cursor is now unverifiable
          // state. Wipe them (ghost-cursor class, F1); reconnect re-renders
          // still-present peers via awareness change or the sweep below.
          this.clearRemoteCursors();
        }
        this.options.onStatusChange?.(event.status);
      });

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
      return data === undefined || data === pkg.data ? [pkg] : [{ ...pkg, data }];
    });

    if (this.collabMap) {
      for (const pkg of pkgs) {
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
          const entry = { ...pkg, clientID: this.clientID, timestamp };
          const write = () => {
            this.pruneBeforeSlateReplacement();
            this.collabMap.set(key, entry);
          };
          if (this.doc) this.doc.transact(write);
          else write();
          this.adoptBaseline({ t: timestamp, c: this.clientID, k: key });
          continue;
        }

        // A line-property change (lineType, sourceLock/targetLock, lineColor…)
        // supersedes any earlier change to the SAME property on the SAME
        // association. The collab doc accumulates and is replayed on reload, and
        // the replay order is not guaranteed to be recency order — so leaving the
        // old package in means e.g. toggling Absolute→Relative can be re-applied
        // as Absolute and the toggle "reverts". Prune the superseded ones first.
        if (pkg.type === "onLinePropertiesChanged") {
          this.pruneSupersededLineProperty(pkg.data);
        }

        const entry = { ...pkg, clientID: this.clientID, timestamp: this.tick() };
        if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string") {
          this.storeNodeText(key, entry);
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

    if (changes.length === 0) return;
    changes.sort(byStamp);
    const latest = this.latestLabels(labelIds);
    const documentChanged = changes.some(({ pkg }) => !VIEW_ONLY.has(pkg.type));
    this.run(() => {
      const pending = this.applyInOrder(changes, latest);
      if (!documentChanged) return pending;
      if (pending) return pending.then(() => this.afterRemote(false));
      this.afterRemote(false);
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
      if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string" && latestLabel.get(pkg.data.id) !== key) {
        // Not the node's current label: only the formatting it carried applies.
        const { text, ...style } = pkg.data;
        if (!Object.keys(style).some(field => field !== "id")) continue;
        pkg = { ...pkg, data: style };
      }
      let pending: Promise<unknown> | void = undefined;
      try {
        pending = this.handleRemotePackage(pkg);
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
    this.adoptBaseline(replacement.stamp);
    try {
      await this.handleRemotePackage(replacement.pkg);
    } catch (error) {
      console.warn("COLLAB_DEBUG: The room's replacement could not be applied:", error);
    }
    if (!this.collabMap || !this.slate) return;
    // Loading the replacement put its own (older) marker back into the options.
    this.adoptBaseline(replacement.stamp);
    this.dropOlderReplacements(replacement);

    const rest: RoomEntry[] = [];
    const labelIds = new Set<string>();
    this.collabMap.forEach((pkg: SlatePackage, key: string) => {
      if (!pkg || pkg.type === REPLACED) return;
      rest.push({ key, pkg });
      if (pkg.type === "onNodeTextChanged" && typeof pkg.data?.text === "string") labelIds.add(pkg.data.id);
    });
    rest.sort(byStamp);
    await this.applyInOrder(rest, this.latestLabels(labelIds));
    this.afterRemote(true);
    // The host stored this client's own undo a moment ago, and that save may
    // land after the other person's. Hand it the slate again, as it now is, so
    // the stored document ends on what everyone sees.
    if (lostOwn && this.slate) {
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

  /**
   * Packages from the room have been applied. The person's undo history takes
   * them in, so a later undo of their own work does not also take away what
   * other people did in the meantime (see UndoRedo.absorbRemote).
   */
  private afterRemote(replaced: boolean): void {
    try {
      (this.slate as any)?.undoRedo?.absorbRemote?.(replaced);
    } catch (error) {
      console.warn("COLLAB_DEBUG: Undo history could not take in the room's changes:", error);
    }
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
      this.collabMap.forEach((_val: any, key: string) => keys.push(key));
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
