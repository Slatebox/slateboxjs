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
  /** Connection/user payload returned by the host's onInitCollaboration */
  public userBaseData?: Record<string, any>;

  constructor(slate: Slate, options: CollabOptions = {}) {
    this.slate = slate;
    this.options = {
      wsUrl: "ws://localhost:1234",
      roomName: "default-slate",
      userName: "Anonymous",
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

        event.changes.keys.forEach((change: any, key: string) => {
          if (change.action === "add" || change.action === "update") {
            const pkg = this.collabMap.get(key);
            if (pkg) {
              this.handleRemotePackage(pkg);
            }
          }
        });
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
        this.options.onStatusChange?.(event.status);
      });

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
      this.exe(pkg);
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
    const pkgs = Array.isArray(packages) ? packages : [packages];

    if (this.collabMap) {
      for (const pkg of pkgs) {
        const key = `${pkg.type}_${Date.now()}_${Math.random()
          .toString(36)
          .substr(2, 5)}`;

        // A line-property change (lineType, sourceLock/targetLock, lineColor…)
        // supersedes any earlier change to the SAME property on the SAME
        // association. The collab doc accumulates and is replayed on reload, and
        // the replay order is not guaranteed to be recency order — so leaving the
        // old package in means e.g. toggling Absolute→Relative can be re-applied
        // as Absolute and the toggle "reverts". Prune the superseded ones first.
        if (pkg.type === "onLinePropertiesChanged") {
          this.pruneSupersededLineProperty(pkg.data);
        }

        this.collabMap.set(key, {
          ...pkg,
          clientID: this.clientID,
          timestamp: Date.now(),
        });

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
  public exe(pkg: SlatePackage): void {
    const invoker = this.slate.invoker;
    if (!invoker) {
      console.warn("COLLAB_DEBUG: No invoker available");
      return;
    }

    const methodName = pkg.type;

    if (typeof (invoker as any)[methodName] === "function") {
      // Applying a remote package must not re-emit onSlateChanged (echo)
      this.slate.beginRemoteApply?.();
      try {
        (invoker as any)[methodName](pkg);
      } finally {
        this.slate.endRemoteApply?.();
      }
    } else {
      console.warn("COLLAB_DEBUG: Unknown collab type:", methodName);
    }

    // Trigger collab event
    this.slate.options.events?.onCollaboration?.(pkg);
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

  /**
   * Render (or update) remote collaborators' cursors and remove cursors for
   * clients that have left. Called on every awareness change.
   */
  private renderRemoteCursors(users: CollabUser[]): void {
    if (!this.slate.canvas) return;
    const present = new Set(users.map((u) => u.clientID));
    for (const [id, el] of this.cursorElements) {
      if (!present.has(id)) {
        try {
          el.remove();
        } catch (_) {
          /* noop */
        }
        this.cursorElements.delete(id);
      }
    }
    for (const u of users) {
      if (u.cursor) this.renderCursor(u);
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
      // color on top (matches the pre-regression presence style).
      const label = g.group();
      const name = user.userName || "Anonymous";
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
        userName: state.user?.name || "Anonymous",
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

  private handleRemotePackage(pkg: SlatePackage): void {
    console.log("COLLAB_DEBUG: Received remote package:", pkg.type);

    // Execute the package locally
    this.exe(pkg);

    // Notify via callback
    this.options.onReceive?.(pkg);
  }
}
