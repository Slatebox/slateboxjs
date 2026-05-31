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
  cursor?: { x: number; y: number };
}

export interface CollabPackage {
  type: string;
  data: any;
  clientID?: number;
  timestamp?: number;
}

export class Collab {
  private slate: any;
  private options: CollabOptions;
  private doc: any = null; // Y.Doc
  private provider: any = null; // WebsocketProvider
  private collabMap: any = null; // Y.Map
  private awareness: any = null;
  private isConnected: boolean = false;
  private clientID: number = 0;
  private cursorElements: Map<number, any> = new Map();

  constructor(slate: any, options: CollabOptions = {}) {
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
      // Dynamic import to keep yjs optional
      // @ts-ignore - yjs is an optional peer dependency
      const Y = await (Function('return import("yjs")')()) as any;
      // @ts-ignore - y-websocket is an optional peer dependency
      const { WebsocketProvider } = await (Function('return import("y-websocket")')()) as any;

      // Create Y.Doc
      this.doc = new Y.Doc();
      this.clientID = this.doc.clientID;

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

      // Create WebSocket provider
      this.provider = new WebsocketProvider(
        this.options.wsUrl!,
        this.options.roomName!,
        this.doc
      );

      // Set up awareness (user presence)
      this.awareness = this.provider.awareness;
      this.awareness.setLocalStateField("user", {
        name: this.options.userName,
        color: this.options.userColor,
      });

      // Listen for awareness changes
      this.awareness.on("change", () => {
        const users = this.getCollabUsers();
        this.options.onAwarenessChange?.(users);
        this.slate.options.events?.onCollaborationUsersChanged?.(users);
      });

      // Connection status
      this.provider.on("status", (event: any) => {
        this.isConnected = event.status === "connected";
        this.options.onStatusChange?.(event.status);
      });

      this.isConnected = true;

      // Trigger init event
      this.slate.options.events?.onInitCollaboration?.(
        this.clientID.toString()
      );

      console.log(
        "COLLAB_DEBUG: Initialized collaboration for room",
        this.options.roomName,
        "clientID:",
        this.clientID
      );
    } catch (error: any) {
      if (
        error.code === "MODULE_NOT_FOUND" ||
        error.message?.includes("Cannot find module")
      ) {
        console.warn(
          "COLLAB_DEBUG: yjs/y-websocket not installed. Collaboration disabled.",
          "Install with: npm install yjs y-websocket"
        );
      } else {
        console.error("COLLAB_DEBUG: Failed to initialize collaboration:", error);
      }
    }
  }

  /**
   * Execute collab packages locally (from Invoker).
   */
  public invoke(packages: CollabPackage | CollabPackage[]): void {
    const pkgs = Array.isArray(packages) ? packages : [packages];

    for (const pkg of pkgs) {
      this.exe(pkg);
    }
  }

  /**
   * Send collab packages to remote peers.
   */
  public send(packages: CollabPackage | CollabPackage[]): void {
    if (!this.collabMap) {
      console.warn("COLLAB_DEBUG: Collaboration not initialized");
      return;
    }

    const pkgs = Array.isArray(packages) ? packages : [packages];

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
  }

  /**
   * Execute a single collab package using the Invoker.
   */
  public exe(pkg: CollabPackage): void {
    const invoker = this.slate.invoker;
    if (!invoker) {
      console.warn("COLLAB_DEBUG: No invoker available");
      return;
    }

    const methodName = pkg.type;

    if (typeof (invoker as any)[methodName] === "function") {
      (invoker as any)[methodName](pkg);
    } else {
      console.warn("COLLAB_DEBUG: Unknown collab type:", methodName);
    }

    // Trigger collab event
    this.slate.options.events?.onCollaboration?.(pkg);
  }

  /**
   * Update local cursor position and broadcast to peers.
   */
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

  /** Get client ID */
  public getClientID(): number {
    return this.clientID;
  }

  // ─── Private ─────────────────────────────────────────────────────

  private handleRemotePackage(pkg: CollabPackage): void {
    console.log("COLLAB_DEBUG: Received remote package:", pkg.type);

    // Execute the package locally
    this.exe(pkg);

    // Notify via callback
    this.options.onReceive?.(pkg);
  }
}
