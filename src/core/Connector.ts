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

      const connectionId = `${this.node.id}->${targetNode.id}`;

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
          curveRadius: co.lineCurviness ?? this.options.curveRadius,
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

      // Store the connection
      this.connections.set(connectionId, connection);

      // Wire endpoint-drag → model. When the user drags a source/target handle
      // and drops it, the vendored lib reattaches the VIEW; this callback
      // updates the association model, broadcasts to peers, and persists (L1).
      connectableObj.onEndpointChange = (info: any) =>
        this.handleEndpointChange(connection, info);

      // Also store on target node (for bidirectional lookup)
      if (targetNode.connector) {
        const reverseId = `${targetNode.id}<-${this.node.id}`;
        targetNode.connector.connections.set(reverseId, connection);
      }

      console.log("CONNECTOR_DEBUG: Successfully connected", connectionId);

      // v1 contract: clicking a connection line asks the HOST to render its
      // line-properties menu; the cb applies updates to the association
      const lineEl = (connectableObj as any).line;
      if (lineEl?.on) {
        lineEl.on("click", (evt: any) => {
          const events = this.node.slate?.options?.events;
          if (!events?.onLineMenuRequested) return;
          if (this.node.slate?.isReadOnly?.()) return;
          evt.stopPropagation?.();
          const association =
            (this.node as any).relationships?.getAssociation?.(
              targetNode.id
            ) ?? connection;
          events.onLineMenuRequested(this.node, association, (opts: any = {}) => {
            if (opts.lineColor && connectableObj.setLineColor) {
              connectableObj.setLineColor(opts.lineColor);
              connection.lineColor = opts.lineColor;
            }
            if (opts.lineWidth && lineEl.attr) {
              lineEl.attr({ "stroke-width": opts.lineWidth });
              connection.lineWidth = opts.lineWidth;
            }
            // Persist onto the association record so exportJSON carries it
            if (association && association.id) {
              Object.assign(association, opts);
            }
          });
        });
      }

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

  public disconnectFrom(targetNode: any): boolean {
    const connectionId = `${this.node.id}->${targetNode.id}`;
    return this.disconnectById(connectionId);
  }

  public disconnectById(connectionId: string): boolean {
    try {
      const connection = this.connections.get(connectionId);
      if (!connection) {
        console.warn("CONNECTOR_DEBUG: Connection not found:", connectionId);
        return false;
      }

      console.log("CONNECTOR_DEBUG: Disconnecting", connectionId);

      // Remove the connectable object (this should remove the line/marker)
      if (connection.connectable && connection.connectable.line) {
        connection.connectable.line.remove();
      }
      if (connection.connectable && connection.connectable.marker) {
        connection.connectable.marker.remove();
      }

      // Remove from both nodes' connection maps
      this.connections.delete(connectionId);

      // Remove reverse connection from target node
      if (connection.target && connection.target.connector) {
        const reverseId = `${connection.target.id}<-${this.node.id}`;
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
          c.curveRadius = (updates as any).lineCurviness;
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
    const { which, targetNodeId, isPhantom } = info;
    if (isPhantom || !targetNodeId) return; // L1b pending
    const newNode = this.slate.nodes.one(targetNodeId);
    if (!newNode) return;

    const props = {
      lineColor: connection.lineColor,
      lineWidth: connection.lineWidth,
      lineType: (connection as any).lineType,
      lineCurviness: (connection as any).lineCurviness,
      showParentArrow: (connection as any).showParentArrow,
      showChildArrow: (connection as any).showChildArrow,
    };

    setTimeout(() => {
      try {
        if (which === "target") {
          const parent: any = connection.source;
          const oldChildId = (connection.target as any)?.id;
          if (!parent?.relationships || newNode.id === oldChildId) return;
          if (oldChildId) parent.relationships.removeAssociation(oldChildId);
          parent.relationships.addAssociation(newNode, props);
        } else {
          const oldParent: any = connection.source;
          const child: any = connection.target;
          if (!child || !oldParent?.relationships || newNode.id === oldParent.id)
            return;
          oldParent.relationships.removeAssociation(child.id);
          newNode.relationships?.addAssociation(child, props);
        }
      } catch (e) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", e);
      }
    }, 0);
  }

  public isEnabled(): boolean {
    return this.isActive;
  }

  public updateOptions(options: Partial<ConnectorOptions>) {
    this.options = { ...this.options, ...options };
    console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
