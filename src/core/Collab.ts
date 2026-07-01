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

      // Listen for awareness changes
      const notifyUsersChanged = () => {
        const users = this.getCollabUsers();
        this.options.onAwarenessChange?.(users);
        this.slate.options.events?.onCollaborationUsersChanged?.(users);
      };
      this.awareness.on("change", notifyUsersChanged);

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

        this.collabMap.set(key, {
          ...pkg,
          clientID: this.clientID,
          timestamp: Date.now(),
        });
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
   * Render a remote cursor on the canvas.
   */
  public renderCursor(user: CollabUser): void {
    if (!user.cursor || !this.slate.canvas) return;

    // Remove old cursor
    const existing = this.cursorElements.get(user.clientID);
    if (existing) {
      existing.remove();
    }

    // Create cursor group
    const g = this.slate.canvas.group();

    // Cursor triangle
    g.polygon("0,0 0,15 10,12")
      .fill(user.color)
      .stroke({ color: "#fff", width: 1 });

    // Username label
    g.text(user.userName)
      .font({ size: 10, fill: "#fff" })
      .move(12, 8)
      .attr("paint-order", "stroke")
      .attr("stroke", user.color)
      .attr("stroke-width", 3);

    // Position at cursor location
    g.move(user.cursor.x, user.cursor.y);
    g.attr("pointer-events", "none");

    this.cursorElements.set(user.clientID, g);
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
    // Remove all cursor elements
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
