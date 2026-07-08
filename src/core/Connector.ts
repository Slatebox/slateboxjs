import { SVG } from "@svgdotjs/svg.js";
import type { Node } from "./Node";
import type { Slate } from "./Slate";
// NOTE: svg.connectable.js is imported in src/index.ts - do not import here to avoid conflicts

// Ensure SVG is available globally for svg.connectable.js
if (typeof window !== "undefined") {
  (window as any).SVG = SVG;
}

export interface ConnectorOptions {
  enabled?: boolean;
  lineContainer?: any; // SVG group for line elements
  markerContainer?: any; // SVG group for marker elements
  padEllipse?: boolean;
  defaultLineColor?: string;
  defaultLineWidth?: number;
  onConnect?: (connection: Connection) => void;
  onDisconnect?: (connection: Connection) => void;

  // svg.connectable.js specific options with defaults
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
  source: Node; // Source node
  target: Node; // Target node
  connectable: any; // The svg.connectable.js object
  lineColor?: string;
  lineWidth?: number;
  label?: string; // Optional text label centered on the edge (Miro-style).
  // Edge-pin mode: normalized local anchor {x,y} in 0..1 on source/target.
  // Omitted/undefined = auto-flow (endpoint re-solves to the nearest edge).
  sourceAnchor?: { x: number; y: number } | null;
  targetAnchor?: { x: number; y: number } | null;
}

export class Connector {
  private node: Node;
  private slate: Slate;
  private options: ConnectorOptions;
  private connections: Map<string, Connection> = new Map();
  private isActive: boolean = false;

  /**
   * Creates a connector for a node. Manages connection lines to other nodes.
   *
   * @param node    - The parent Node instance
   * @param options - Connector configuration (line color, width, type, etc.)
   */
  constructor(node: Node, options: ConnectorOptions = {}) {
    this.node = node;
    this.slate = node.slate;
    this.options = {
      enabled: false,
      padEllipse: true,
      defaultLineColor: "#666666",
      defaultLineWidth: 2,

      // svg.connectable.js defaults as specified by user
      type: "curved",
      color: "#007cff",
      strokeWidth: 3,
      sourceAttach: "perifery",
      targetAttach: "perifery",
      markerSource: "null",
      markerTarget: "default",
      showHandles: true,
      curveRadius: 30,

      ...options,
    };

    console.log("CONNECTOR_DEBUG: Created connector for node", this.node.id);
  }

  /** Enable the connector, making connection handles available. */
  public enable() {
    if (this.isActive) return;

    try {
      console.log("CONNECTOR_DEBUG: Enabling connector for node", this.node.id);

      // Check if svg.connectable.js is compatible
      if (!(this.node.svgGroup as any).connectable) {
        console.warn(
          "CONNECTOR_DEBUG: svg.connectable.js not available - may need SVG.js 3+ compatibility update"
        );
        console.warn(
          "CONNECTOR_DEBUG: Connector functionality will be limited until svg.connectable.js is updated"
        );
        // Don't return here - allow the connector to be "enabled" but with limited functionality
      }

      // Ensure we have containers for lines and markers
      this.ensureContainers();

      this.isActive = true;
      console.log("CONNECTOR_DEBUG: Connector enabled for node", this.node.id);
    } catch (error) {
      console.warn("CONNECTOR_DEBUG: Failed to enable connector:", error);
    }
  }

  /** Disable the connector and remove all connections. */
  public disable() {
    if (!this.isActive) return;

    try {
      console.log(
        "CONNECTOR_DEBUG: Disabling connector for node",
        this.node.id
      );

      // Disconnect all existing connections
      this.disconnectAll();

      this.isActive = false;
      console.log("CONNECTOR_DEBUG: Connector disabled for node", this.node.id);
    } catch (error) {
      console.warn("CONNECTOR_DEBUG: Failed to disable connector:", error);
    }
  }

  public destroy(): void {
    this.disable();
    this.connections.clear();
  }

  private ensureContainers() {
    // Use existing containers or create new ones
    if (!this.options.lineContainer) {
      // Create a lines container in the slate if it doesn't exist
      if (!this.slate.linesContainer) {
        this.slate.linesContainer = this.slate.canvas.group();
        console.log("CONNECTOR_DEBUG: Created global lines container");
      }
      this.options.lineContainer = this.slate.linesContainer;
    }

    if (!this.options.markerContainer) {
      // Create a markers container in the slate if it doesn't exist
      if (!this.slate.markersContainer) {
        this.slate.markersContainer = this.slate.canvas.group();
        console.log("CONNECTOR_DEBUG: Created global markers container");
      }
      this.options.markerContainer = this.slate.markersContainer;
    }
  }

  public connectTo(
    targetNode: any,
    connectionOptions: Partial<Connection> = {}
  ): Connection | null {
    if (!this.isActive) {
      console.warn(
        "CONNECTOR_DEBUG: Connector not enabled for node",
        this.node.id
      );
      return null;
    }

    try {
      console.log(
        "CONNECTOR_DEBUG: Connecting",
        this.node.id,
        "to",
        targetNode.id
      );

      // Parallel edges: the association drives the connection id (e.g.
      // `A->B~2`), so a second line to the same node gets its own key instead of
      // colliding with the first. Falls back to the pair id for direct callers.
      const connectionId =
        (connectionOptions as any).connectionId ||
        `${this.node.id}->${targetNode.id}`;

      // Check if connection already exists
      if (this.connections.has(connectionId)) {
        console.warn(
          "CONNECTOR_DEBUG: Connection already exists:",
          connectionId
        );
        return this.connections.get(connectionId)!;
      }

      // Compatibility check for svg.connectable.js
      if (!(this.node.svgGroup as any).connectable) {
        console.error(
          "CONNECTOR_DEBUG: svg.connectable.js not properly loaded or incompatible with SVG.js 3+"
        );
        return null;
      }

      // Per-connection overrides (from the association record) so a saved line
      // type / curviness / arrows render correctly on create AND after reload.
      const co = connectionOptions as any;
      const typeMap: Record<string, string> = {
        bezier: "curved",
        curved: "curved",
        orthogonal: "orthogonal",
        straight: "straight",
        linear: "straight",
      };
      const connType = co.lineType
        ? typeMap[co.lineType] || "curved"
        : this.options.type;
      const markerSource =
        co.showParentArrow != null
          ? co.showParentArrow
            ? this.options.markerSource || "arrow"
            : "null"
          : this.options.markerSource;
      const markerTarget =
        co.showChildArrow != null
          ? co.showChildArrow
            ? this.options.markerTarget || "arrow"
            : "null"
          : this.options.markerTarget;

      // Use svg.connectable.js to create the connection with full options
      const connectableObj = (this.node.svgGroup as any).connectable(
        {
          container: this.options.lineContainer,
          markers: this.options.markerContainer,
          type: connType,
          color: co.lineColor || this.options.color,
          strokeWidth: co.lineWidth || this.options.strokeWidth,
          sourceAttach: this.options.sourceAttach,
          targetAttach: this.options.targetAttach,
          markerSource,
          markerTarget,
          showHandles: this.options.showHandles,
          curveRadius: this.options.curveRadius,
          lineCurviness: co.lineCurviness,
          // Edge-pin mode (optional): normalized local anchors {x,y} 0..1
          sourceAnchor: connectionOptions.sourceAnchor,
          targetAnchor: connectionOptions.targetAnchor,
        },
        targetNode.svgGroup
      );

      // Verify the connection was created successfully
      if (!connectableObj) {
        console.error("CONNECTOR_DEBUG: Failed to create connectable object");
        return null;
      }

      // Create connection object
      const connection: Connection = {
        id: connectionId,
        source: this.node,
        target: targetNode,
        connectable: connectableObj,
        lineColor: connectionOptions.lineColor || this.options.defaultLineColor,
        lineWidth: connectionOptions.lineWidth || this.options.defaultLineWidth,
        ...connectionOptions,
      };

      // Apply styling if available
      if (connection.lineColor && connectableObj.setLineColor) {
        connectableObj.setLineColor(connection.lineColor);
      }
      // Render the edge label (if this connection carries one).
      if (connection.label && connectableObj.setLabel) {
        connectableObj.setLabel(connection.label);
      }

      // Store the connection
      this.connections.set(connectionId, connection);

      // Keep arrowheads above the nodes (M4): the markers container is a lazy
      // canvas group whose z-order otherwise depends on creation order, so a
      // node created later would cover the arrowhead pointing into it.
      try {
        this.slate.markersContainer?.front?.();
      } catch (e) {
        /* noop */
      }

      // Wire endpoint-drag → model. When the user drags a source/target handle
      // and drops it, the vendored lib reattaches the VIEW; this callback
      // updates the association model, broadcasts to peers, and persists (L1).
      connectableObj.onEndpointChange = (info: any) =>
        this.handleEndpointChange(connection, info);

      // Also store on target node (for bidirectional lookup)
      if (targetNode.connector) {
        // Keyed by the unique connection id (not the pair) so parallel edges each
        // get their own reverse-lookup entry instead of overwriting one another.
        const reverseId = `${targetNode.id}<-${connectionId}`;
        targetNode.connector.connections.set(reverseId, connection);
      }

      console.log("CONNECTOR_DEBUG: Successfully connected", connectionId);

      // Clicking a connection line shows a cog affordance; clicking the cog
      // asks the HOST to open its line-properties pane (M1/M2). Wired via the
      // vendored onLineClick hook (fires on a clean click of the line/hit area).
      connectableObj.onLineClick = () => {
        if (this.node.slate?.isReadOnly?.()) return;
        this.showLineCog(connection, connectableObj, targetNode.id);
      };

      // Miro-style: endpoint handles are hidden (CSS) until the connection is
      // hovered or selected. Wire the hover reveal here (handles are created
      // lazily, so we read them at hover time, not now).
      this.wireHandleReveal(connectableObj);

      // Trigger callback
      this.options.onConnect?.(connection);

      return connection;
    } catch (error) {
      console.error("CONNECTOR_DEBUG: Failed to create connection:", error);
      console.error(
        "CONNECTOR_DEBUG: This might be due to SVG.js 3+ compatibility issues with svg.connectable.js"
      );
      return null;
    }
  }

  /**
   * Connect this node to a bare WORLD point (free-floating endpoint, L1b).
   * Backed by an invisible 1px "phantom" rect at the point so the existing
   * svg.connectable geometry (edge-solve on the target's bbox) works unchanged.
   * The synthetic id keys the connection like a normal one.
   */
  public connectToPoint(
    point: { x: number; y: number },
    synthId: string,
    connectionOptions: Partial<Connection> = {}
  ): Connection | null {
    if (!this.isActive) this.enable();
    const container: any = this.options.lineContainer || this.slate.canvas;
    if (!container) return null;
    const phantom = container
      .rect(1, 1)
      .move(point.x - 0.5, point.y - 0.5)
      .fill("none")
      .opacity(0);
    (phantom as any)._isPhantomRect = true;
    const fakeTarget: any = { id: synthId, svgGroup: phantom, _isFloating: true };
    const conn = this.connectTo(fakeTarget, connectionOptions);
    if (conn) (conn as any)._phantom = phantom;
    return conn;
  }

  public disconnectFrom(targetNode: any): boolean {
    // Disconnect EVERY edge to this target (the canonical `A->B` plus any parallel
    // `A->B~N`), so node deletion / disconnect-from-child never orphans a line.
    const base = `${this.node.id}->${targetNode.id}`;
    const ids = [...this.connections.keys()].filter(
      (id) => id === base || id.startsWith(`${base}~`)
    );
    if (ids.length === 0) return this.disconnectById(base);
    let ok = false;
    for (const id of ids) ok = this.disconnectById(id) || ok;
    return ok;
  }

  public disconnectById(connectionId: string): boolean {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        console.warn("CONNECTOR_DEBUG: Connection not found:", connectionId);
        return false;
      }

      console.log("CONNECTOR_DEBUG: Disconnecting", connectionId);

      // Fully remove the connectable's DOM (line + hit area + handles + markers
      // + phantoms). The connectable exposes con.remove(); the old code removed
      // con.line/con.marker which don't exist, leaving rogue lines behind (L4).
      try {
        if (connection.connectable?.remove) {
          connection.connectable.remove();
        } else {
          connection.connectable?.connector?.remove?.();
          connection.connectable?.hitArea?.remove?.();
        }
        (connection as any)._phantom?.remove?.();
      } catch (e) {
        /* noop */
      }

      // Remove from both nodes' connection maps
      this.connections.delete(connectionId);

      // Remove reverse connection from target node (unique-id keyed, matching
      // how it was stored in connectTo — so parallel edges clean up individually).
      if (connection.target && connection.target.connector) {
        const reverseId = `${connection.target.id}<-${connectionId}`;
        connection.target.connector.connections.delete(reverseId);
      }

      console.log("CONNECTOR_DEBUG: Successfully disconnected", connectionId);

      // Trigger callback
      this.options.onDisconnect?.(connection);

      return true;
    } catch (error) {
      console.error("CONNECTOR_DEBUG: Failed to disconnect:", error);
      return false;
    }
  }

  public disconnectAll(): void {
    console.log(
      "CONNECTOR_DEBUG: Disconnecting all connections for node",
      this.node.id
    );

    const connectionIds = Array.from(this.connections.keys());
    for (const connectionId of connectionIds) {
      this.disconnectById(connectionId);
    }
  }

  public getConnections(): Connection[] {
    return Array.from(this.connections.values());
  }

  public getConnection(targetNodeId: string): Connection | null {
    const connectionId = `${this.node.id}->${targetNodeId}`;
    return this.connections.get(connectionId) || null;
  }

  public updateConnection(
    connectionId: string,
    updates: Partial<Connection>
  ): boolean {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        console.warn(
          "CONNECTOR_DEBUG: Connection not found for update:",
          connectionId
        );
        return false;
      }

      // Update connection properties
      Object.assign(connection, updates);

      const c = connection.connectable;
      if (c) {
        // Color (the connectable exposes setConnectorColor, not setLineColor)
        if (updates.lineColor != null && c.setConnectorColor) {
          c.setConnectorColor(updates.lineColor);
        }
        if (updates.lineWidth != null && c.setStrokeWidth) {
          c.setStrokeWidth(updates.lineWidth);
        }
        // Edge label (Miro-style): set/update/clear the text centered on the line.
        if ((updates as any).label != null && c.setLabel) {
          c.setLabel((updates as any).label);
        }
        // Line type: pane uses bezier/orthogonal; connectable uses
        // straight/curved/orthogonal.
        if ((updates as any).lineType != null && c.setType) {
          const map: Record<string, string> = {
            bezier: "curved",
            curved: "curved",
            orthogonal: "orthogonal",
            straight: "straight",
            linear: "straight",
          };
          c.setType(map[(updates as any).lineType] || "curved");
        }
        if ((updates as any).lineCurviness != null) {
          // 0..1 bezier bow fraction (NOT the pixel curveRadius).
          c.lineCurviness = (updates as any).lineCurviness;
        }
        // Arrow markers: source = parent arrow, target = child arrow
        if (
          (updates as any).showParentArrow != null ||
          (updates as any).showChildArrow != null
        ) {
          const src =
            ((updates as any).showParentArrow ??
            (connection as any).showParentArrow)
              ? "arrow"
              : "null";
          const tgt =
            ((updates as any).showChildArrow ??
            (connection as any).showChildArrow ??
            true)
              ? "arrow"
              : "null";
          c.setMarker?.(src, tgt);
        }
        // Re-solve the path so any geometry-affecting change takes effect
        c.update?.();
      }

      console.log("CONNECTOR_DEBUG: Updated connection", connectionId);
      return true;
    } catch (error) {
      console.error("CONNECTOR_DEBUG: Failed to update connection:", error);
      return false;
    }
  }

  /**
   * Edge-pin mode: pin (or unpin with null) a connection's endpoint to a
   * normalized local anchor {x,y} in 0..1 on the source or target node.
   * A pinned endpoint stays on that point and rotates with the node; null
   * restores auto-flow (nearest-edge). Re-solves immediately.
   */
  public setConnectionAnchor(
    targetNodeId: string,
    which: "source" | "target",
    anchor: { x: number; y: number } | null
  ): boolean {
    const connection = this.connections.get(`${this.node.id}->${targetNodeId}`);
    if (!connection) return false;
    if (which === "source") connection.sourceAnchor = anchor;
    else connection.targetAnchor = anchor;
    connection.connectable?.setAttachmentAnchor?.(which, anchor);
    return true;
  }

  /**
   * Endpoint-drag → model (L1). The vendored lib has already reattached the
   * VIEW when this fires; we reconcile the association MODEL so the change
   * broadcasts to peers and persists. Reattaching to a node rebuilds the
   * association (remove old + add new) through the already-synced/persisted
   * addAssociation/removeAssociation. Deferred a tick so the lib's dragend
   * finishes before we tear down/recreate the connection.
   *
   * Free-floating (phantom) drops are L1b — not yet persisted; left as a
   * view-only endpoint for now (no rogue model state).
   */
  private handleEndpointChange(
    connection: Connection,
    info: { which: "source" | "target"; targetNodeId: string | null; isPhantom: boolean; point: any }
  ): void {
    const { which, targetNodeId, isPhantom, point } = info;
    const props = {
      lineColor: connection.lineColor,
      lineWidth: connection.lineWidth,
      lineType: (connection as any).lineType,
      lineCurviness: (connection as any).lineCurviness,
      showParentArrow: (connection as any).showParentArrow,
      showChildArrow: (connection as any).showChildArrow,
    };
    // The connection's ORIGINAL child id (stable in the id `parent->child`),
    // used to remove the outgoing association before we rebuild it.
    const origChildId = (connection.id.split("->")[1] || "").trim();

    setTimeout(() => {
      try {
        if (which === "target") {
          const parent: any = connection.source;
          if (!parent?.relationships) return;
          if (isPhantom || !targetNodeId) {
            // Dropped on empty canvas → free-floating target endpoint (L1b)
            if (!point) return;
            if (origChildId) parent.relationships.removeAssociation(origChildId);
            parent.relationships.addFloatingAssociation(point, props);
          } else {
            // Reattach to a node (L1a) — pin the TARGET endpoint at the DROP
            // POINT so the arrow connects exactly where the user dropped (U3).
            const newNode = this.slate.nodes.one(targetNodeId);
            if (!newNode) return;
            if (newNode.id === origChildId) {
              // Dropped back on the SAME target node → just RE-PIN the anchor at
              // the new drop point (reposition the pin) instead of bailing. This
              // is how you move a pinned endpoint along its own node's edge.
              this.pinDropAnchor(parent, origChildId, newNode, "targetAnchor", point);
              return;
            }
            if (origChildId) parent.relationships.removeAssociation(origChildId);
            parent.relationships.addAssociation(newNode, props);
            this.pinDropAnchor(parent, newNode.id, newNode, "targetAnchor", point);
          }
        } else {
          // Source-end reattach to a node (source floating not yet modeled)
          if (isPhantom || !targetNodeId) return;
          const oldParent: any = connection.source;
          const child: any = connection.target;
          const newNode = this.slate.nodes.one(targetNodeId);
          if (!newNode || !child || !oldParent?.relationships) return;
          if (newNode.id === oldParent.id) {
            // Dropped back on the SAME source node → re-pin the source anchor at
            // the new drop point instead of bailing.
            this.pinDropAnchor(oldParent, child.id, newNode, "sourceAnchor", point);
            return;
          }
          oldParent.relationships.removeAssociation(child.id);
          newNode.relationships?.addAssociation(child, props);
          // Pin the SOURCE endpoint at the drop point on the new source node.
          this.pinDropAnchor(newNode, child.id, newNode, "sourceAnchor", point);
        }
      } catch (e) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", e);
      }
    }, 0);
  }

  /**
   * U3: pin an endpoint at the exact drop point on a node. Converts the world
   * drop point into a normalized [0,1] anchor on the node's box and stores it as
   * the source/target anchor (persists + renders there). Skipped for rotated
   * nodes (world→local normalization would be wrong) — those fall back to
   * auto-flow. relationships owner is `ownerNode`; the association is childId.
   */
  private pinDropAnchor(
    ownerNode: any,
    childId: string,
    anchorNode: any,
    which: "sourceAnchor" | "targetAnchor",
    point: { x: number; y: number } | null
  ): void {
    try {
      if (!point) return;
      const o = anchorNode?.options || {};
      if (!o.width || !o.height) return;
      if (o.rotate?.rotationAngle) return; // non-rotated only for now
      const clamp = (v: number) => Math.max(0, Math.min(1, v));
      let ax = clamp((point.x - (o.x || 0)) / o.width);
      let ay = clamp((point.y - (o.y || 0)) / o.height);
      // Snap to the nearest EDGE so the arrowhead sits ON the node's boundary
      // (touching it, on the side the user dropped) instead of at an interior
      // point — an interior anchor put the arrowhead inside/covered by the node
      // and made the line's edge-solve disagree with the pinned arrowhead,
      // rendering a detached/inverted arrow that didn't track the node cleanly.
      const dl = ax;
      const dr = 1 - ax;
      const dt = ay;
      const db = 1 - ay;
      const nearest = Math.min(dl, dr, dt, db);
      if (nearest === dl) ax = 0;
      else if (nearest === dr) ax = 1;
      else if (nearest === dt) ay = 0;
      else ay = 1;
      const anchor = { x: ax, y: ay };
      const rels = ownerNode?.relationships;
      const assoc = rels?.associations?.find((a: any) => a.childId === childId);
      if (assoc?.id) {
        rels.applyLineProperty(assoc.id, which, anchor);
        // Broadcast the pinned anchor so it PERSISTS and syncs. The reconnect's
        // addAssociation save fires before this anchor is set, so without a
        // broadcast the drop-side anchor is lost on reload (reverts to auto-edge).
        (ownerNode.slate as any)?.broadcast?.("onLinePropertiesChanged", {
          id: ownerNode.id,
          prop: which,
          val: anchor,
          associationId: assoc.id,
        });
      }
    } catch (e) {
      /* noop */
    }
  }

  /**
   * L5 per-endpoint locking. mode "absolute" freezes the endpoint at its
   * current spot on the node (a normalized local anchor that then moves/rotates
   * with the node); "relative" clears it back to auto-flow (nearest-edge).
   * Returns the anchor that was set (or null) so callers can persist it.
   */
  public setEndpointLock(
    connectionId: string,
    which: "source" | "target",
    mode: "absolute" | "relative"
  ): { x: number; y: number } | null {
    const connection = this.connections.get(connectionId);
    if (!connection) return null;
    const c: any = connection.connectable;
    if (mode === "absolute") {
      const anchor = c?.getCurrentAnchor?.(which) || { x: 0.5, y: 0.5 };
      (connection as any)[which + "Anchor"] = anchor;
      c?.setAttachmentAnchor?.(which, anchor);
      return anchor;
    }
    (connection as any)[which + "Anchor"] = null;
    c?.setAttachmentAnchor?.(which, null);
    return null;
  }

  /**
   * Show a cog affordance at the midpoint of a clicked line (M1/M2). Clicking
   * the cog opens the host's line-properties pane. Only one cog is shown at a
   * time (tracked on the slate) and it clears on canvas/node interaction.
   */
  /**
   * Miro-style hover reveal for a connection's endpoint handles. Handles are
   * hidden by default (CSS) and shown while the pointer is over the line, its
   * hit area, or a handle — then hidden again on leave, UNLESS the connection is
   * selected (`_handlesPinned`, set by showLineCog / cleared by clearLineCog).
   * Handles are created lazily by the vendored lib, so we resolve them at event
   * time rather than capturing them now.
   */
  private wireHandleReveal(con: any): void {
    const handleEls = (): any[] =>
      [con.sourceHandle?.element, con.targetHandle?.element].filter(
        (h: any) => h && h.node
      );
    const reveal = (visible: boolean): void => {
      handleEls().forEach((h: any) => {
        if (visible) h.node.classList.add("connector-handle--revealed");
        // Keep shown while selected (pinned) OR while a handle is mid-drag —
        // otherwise dragging an endpoint off the line hides it and breaks the
        // reconnect.
        else if (!con._handlesPinned && !con._handlesDragging)
          h.node.classList.remove("connector-handle--revealed");
      });
    };
    // Exposed so selection (showLineCog) can pin and clearLineCog can release.
    con._revealHandles = reveal;
    const armHandleHover = (): void =>
      handleEls().forEach((h: any) => {
        if (h._revealArmed) return;
        h._revealArmed = true;
        h.on?.("mouseenter", () => reveal(true));
        h.on?.("mouseleave", () => reveal(false));
        // Keep the endpoint visible + draggable for the whole drag gesture.
        h.on?.("dragstart", () => {
          con._handlesDragging = true;
          reveal(true);
        });
        h.on?.("dragend", () => {
          con._handlesDragging = false;
          if (!con._handlesPinned) reveal(false);
        });
      });
    [con.hitArea, con.connector].forEach((el: any) => {
      el?.on?.("mouseenter", () => {
        reveal(true);
        armHandleHover();
      });
      el?.on?.("mouseleave", () => reveal(false));
    });
  }

  private showLineCog(connection: Connection, con: any, targetId: string): void {
    const slate: any = this.slate;
    slate.clearLineCog?.();
    const line = con?.connector;
    let cx: number, cy: number;
    try {
      const bb = line.bbox();
      cx = bb.cx;
      cy = bb.cy;
    } catch (e) {
      return;
    }
    const container: any = slate.markersContainer || slate.canvas;
    if (!container) return;

    // Line context toolbar (G2/Q2) — modern Miro-style pill at the line midpoint:
    // delete + cog. (The old "plug" did nothing and was dropped; the cog opens
    // the line pane AND shows per-endpoint lock/relative toggles — Q3.)
    const R = 15;
    const GAP = 6;
    const NEUTRAL = "#5b6472";
    const tools: Array<{ key: string; color: string; onClick: () => void }> = [
      {
        key: "delete",
        color: "#e5484d",
        onClick: () => {
          (this.node as any).relationships?.removeAssociation?.(targetId);
          slate.clearLineCog?.();
        },
      },
      {
        key: "cog",
        color: NEUTRAL,
        onClick: () => {
          this.openLinePane(connection, con, targetId);
          this.showEndpointLockToggles(connection, con, targetId);
        },
      },
    ];
    const n = tools.length;
    const stepX = R * 2 + GAP;
    const totalW = n * (R * 2) + (n - 1) * GAP;
    const startX = cx - totalW / 2 + R;

    const bar = container.group().addClass("line-cog").addClass("line-toolbar");
    bar
      .rect(totalW + 14, R * 2 + 10)
      .radius((R * 2 + 10) / 2)
      .center(cx, cy)
      .fill("#ffffff")
      .stroke({ color: "#e3e5ea", width: 1 });
    const NodeCls: any = (this.node as any).constructor;
    tools.forEach((t, i) => {
      const bx = startX + i * stepX;
      const btn = bar.group().addClass(`line-tool-${t.key}`);
      btn.circle(R * 2).center(bx, cy).fill("#ffffff").attr("fill-opacity", 0.001);
      NodeCls.drawToolIcon?.(btn, t.key, bx, cy, t.color);
      btn.attr("pointer-events", "all");
      try {
        btn.node.style.cursor = "pointer";
      } catch (e) {
        /* noop */
      }
      btn.on("mousedown", (e: any) => e.stopPropagation?.());
      btn.on("click", (e: any) => {
        e.stopPropagation?.();
        t.onClick();
      });
    });
    bar.attr("pointer-events", "all");
    slate._activeLineCog = bar;
    // Also select the connector so its endpoint handles show — this is what
    // makes the endpoints draggable (L1 snap-anywhere). Tracked on the slate so
    // clearLineCog() (canvas click / node select) deselects it — no stuck state.
    try {
      con.selectConnector?.();
      slate._activeLineConnectable = con;
      // Pin the endpoint handles visible while this connection is selected.
      con._handlesPinned = true;
      con._revealHandles?.(true);
    } catch (e) {
      /* noop */
    }
    // markers/cog stay on top
    try {
      slate.markersContainer?.front?.();
    } catch (e) {
      /* noop */
    }
  }

  private openLinePane(connection: Connection, con: any, targetId: string): void {
    const events = this.node.slate?.options?.events;
    if (!events?.onLineMenuRequested) return;
    // The host pane (LineProperties) reads association.child.options.id, so pass
    // the ENRICHED association (live parent/child refs) from the .associations
    // getter, not the raw assocMap record (which lacks .child → pane crash).
    const rels: any = (this.node as any).relationships;
    const association =
      rels?.associations?.find((a: any) => a.childId === targetId) ??
      rels?.getAssociation?.(targetId) ??
      connection;
    events.onLineMenuRequested(this.node, association, (opts: any = {}) => {
      // Apply pane edits through the association model (syncs + persists)
      if (association?.id && (this.node as any).relationships) {
        for (const [prop, val] of Object.entries(opts)) {
          (this.node as any).relationships.applyLineProperty(
            association.id,
            prop,
            val
          );
        }
      }
    });
  }

  /**
   * Q3: show a lock/relative toggle at EACH endpoint (source + target) when the
   * line cog is clicked. Clicking a toggle flips absolute (pinned anchor) ↔
   * relative (auto-flow) via applyLineProperty, and broadcasts for collab parity.
   */
  private showEndpointLockToggles(
    connection: Connection,
    con: any,
    targetId: string
  ): void {
    const slate: any = this.slate;
    // clear any previous toggle set
    if (slate._activeEndpointToggles) {
      slate._activeEndpointToggles.forEach((g: any) => {
        try {
          g.remove();
        } catch (e) {
          /* noop */
        }
      });
    }
    slate._activeEndpointToggles = [];

    const lineNode: any = con?.connector?.node;
    if (!lineNode || !lineNode.getPointAtLength) return;
    let total = 0;
    try {
      total = lineNode.getTotalLength();
    } catch (e) {
      return;
    }
    const p0 = lineNode.getPointAtLength(0);
    const p1 = lineNode.getPointAtLength(total);

    const rels: any = (this.node as any).relationships;
    const assoc = rels?.associations?.find((a: any) => a.childId === targetId);
    if (!assoc) return;

    // Match path ends to nodes: p0/p1 → source(this.node) / target(targetId),
    // then INSET the toggle inward from each end so it sits clear of the node
    // edge + the endpoint drag-handle (and is reliably clickable).
    const centerOf = (n: any) => {
      const o = n?.options || {};
      return { x: (o.x || 0) + (o.width || 0) / 2, y: (o.y || 0) + (o.height || 0) / 2 };
    };
    const dist = (p: any, c: any) => Math.hypot(p.x - c.x, p.y - c.y);
    const srcC = centerOf(this.node);
    const srcAtStart = dist(p0, srcC) <= dist(p1, srcC);
    const inset = Math.min(34, total * 0.28);
    const srcPt = lineNode.getPointAtLength(srcAtStart ? inset : total - inset);
    const tgtPt = lineNode.getPointAtLength(srcAtStart ? total - inset : inset);

    const container: any = slate.markersContainer || slate.canvas;
    const NEUTRAL = "#5b6472";
    const ABS = "#4051B5";

    const makeToggle = (pt: any, which: "source" | "target") => {
      const absolute =
        which === "source" ? !!assoc.sourceAnchor : !!assoc.targetAnchor;
      const color = absolute ? ABS : NEUTRAL;
      const g = container
        .group()
        .addClass("endpoint-lock")
        .addClass(`endpoint-lock-${which}`)
        .addClass(absolute ? "endpoint-lock-absolute" : "endpoint-lock-relative");
      g.circle(24).center(pt.x, pt.y).fill("#ffffff").stroke({ color, width: 1.5 });
      Connector.drawLockIcon(g, pt.x, pt.y, color, absolute);
      // Transparent hit circle ON TOP so a click anywhere on the toggle registers
      // (the padlock's fill:none paths are not hit-testable at their centers).
      g.circle(24).center(pt.x, pt.y).fill("#ffffff").attr("fill-opacity", 0.001);
      g.attr("pointer-events", "all");
      try {
        g.node.style.cursor = "pointer";
      } catch (e) {
        /* noop */
      }
      g.on("mousedown", (e: any) => e.stopPropagation?.());
      g.on("click", (e: any) => {
        e.stopPropagation?.();
        const prop = which === "source" ? "sourceLock" : "targetLock";
        const val = absolute ? "relative" : "absolute";
        try {
          rels.applyLineProperty(assoc.id, prop, val);
        } catch (err) {
          /* noop */
        }
        // Collab parity: mirror the on-canvas toggle to peers.
        try {
          slate.broadcast?.("onLinePropertiesChanged", {
            id: this.node.id,
            associationId: assoc.id,
            prop,
            val,
          });
        } catch (err) {
          /* noop */
        }
        // Re-render toggles to reflect the new state.
        this.showEndpointLockToggles(connection, con, targetId);
      });
      slate._activeEndpointToggles.push(g);
    };

    makeToggle(srcPt, "source");
    makeToggle(tgtPt, "target");
    try {
      slate.markersContainer?.front?.();
    } catch (e) {
      /* noop */
    }
  }

  /** Draw a small padlock (closed = absolute/locked, open = relative). */
  private static drawLockIcon(
    g: any,
    cx: number,
    cy: number,
    color: string,
    locked: boolean
  ): void {
    const s = { color, width: 1.4, linecap: "round", linejoin: "round" };
    // body
    g.rect(11, 8)
      .radius(1.5)
      .move(cx - 5.5, cy - 0.5)
      .fill("none")
      .stroke(s);
    // shackle: closed arc when locked, open (raised/partial) when relative
    if (locked) {
      g.path(
        `M ${cx - 3.4} ${cy - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 0 v 2.2`
      )
        .fill("none")
        .stroke(s);
    } else {
      g.path(`M ${cx - 3.4} ${cy - 0.5} v -2.2 a 3.4 3.4 0 0 1 6.8 -0.6`)
        .fill("none")
        .stroke(s);
    }
    // keyhole dot
    g.circle(1.6).center(cx, cy + 3).fill(color);
  }

  public isEnabled(): boolean {
    return this.isActive;
  }

  public updateOptions(options: Partial<ConnectorOptions>) {
    this.options = { ...this.options, ...options };
    console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
