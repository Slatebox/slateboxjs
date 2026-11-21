import { SVG } from "@svgdotjs/svg.js";
import type { Node } from "./Node";
import type { Slate } from "./Slate";
import {
  anchorForDrop,
  flipLine,
  normalizedOn,
  nudgeAnchor,
  NUDGE_STEP,
  snapToEdge,
  type EndAnchor,
  type EndState,
  type LineEnd,
} from "./LineEnds";
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
  lineOpacity?: number;
  lineEffect?: string;
  /** "solid" (the default), "dashed" or "dotted". */
  lineDash?: LineDash;
  label?: string; // Optional text label centered on the edge (Miro-style).
  // Edge-pin mode: normalized local anchor {x,y} in 0..1 on source/target.
  // Omitted/undefined = auto-flow (endpoint re-solves to the nearest edge).
  sourceAnchor?: { x: number; y: number } | null;
  targetAnchor?: { x: number; y: number } | null;
}

export type LineDash = "solid" | "dashed" | "dotted";

/**
 * The SVG stroke-dasharray for a line's dash style, scaled by its width, or null
 * for a solid line (and for any value the engine does not know).
 */
export function lineDashArray(dash: string | undefined | null, width: number): string | null {
  const w = Math.max(1, Number(width) || 1);
  if (dash === "dashed") return `${w * 4} ${w * 3}`;
  // A near-zero dash with a round cap draws a dot.
  if (dash === "dotted") return `0.1 ${w * 2.5}`;
  return null;
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
          lineCurveType: (co as any).lineCurveType,
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

      // Keep relationship ownership in the exported SVG. Presentation and
      // other read-only consumers clone the canvas without the live Connector
      // instances, so they need durable endpoint metadata to decide which
      // line belongs to the focused node while panning and zooming.
      connectableObj.connector?.attr?.({
        rel: `association-${this.node.id}-${targetNode.id}`,
        "data-connection-id": connectionId,
        "data-source-node-id": this.node.id,
        "data-target-node-id": targetNode.id,
      });

      // A line a host draws between two of its governed notes (a workshop's map)
      // is part of that drawing: it takes no pointer input, so nobody can select
      // it, re-plug it or delete it, and a press on a note it crosses reaches the note.
      const ruled = (n: any) => (this.slate as any).governanceOf?.(n)?.capabilities?.canConnect === false;
      if (ruled(this.node) && ruled(targetNode)) {
        connectableObj.connector?.attr?.({ "pointer-events": "none", "data-governed": "line" });
        connectableObj.hitArea?.attr?.({ "pointer-events": "none" });
        if (connectableObj.hitArea?.node?.style) connectableObj.hitArea.node.style.cursor = "";
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
      this.applyLineAppearance(connectableObj, connection);
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
    // Matched by the line's two notes, not its id: a line whose end was moved keeps its id.
    const base = `${this.node.id}->${targetNode.id}`;
    const ids = [...this.connections.entries()]
      .filter(([, c]) => c.source === this.node && (c.target as any)?.id === targetNode.id)
      .map(([id]) => id);
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
    return (
      this.connections.get(connectionId) ||
      [...this.connections.values()].find((c) => c.source === this.node && (c.target as any)?.id === targetNodeId) ||
      null
    );
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
        this.applyLineAppearance(c, connection);
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
        if ((updates as any).lineCurveType != null) {
          // Bezier sub-type: 'cubic' | 'quadratic' — re-solve so the curve redraws.
          c.lineCurveType = (updates as any).lineCurveType;
          c.update?.();
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

  /** Apply v1 line opacity/effect fields to the visible connector path. */
  private applyLineAppearance(connectable: any, connection: Connection): void {
    const line = connectable?.connector;
    if (!line?.attr) return;
    // Dash pattern, scaled by the line's width so a thick dashed line still reads as dashes.
    line.attr(
      "stroke-dasharray",
      lineDashArray(connection.lineDash, connection.lineWidth || this.options.strokeWidth || 3)
    );
    line.attr("stroke-linecap", connection.lineDash === "dotted" ? "round" : null);
    if (connection.lineOpacity != null) {
      line.attr("stroke-opacity", connection.lineOpacity);
    }
    if (connection.lineEffect !== undefined) {
      const filters: Record<string, string> = {
        dropShadow: "drop-shadow(3px 3px 4px rgba(0,0,0,0.3))",
        postItNote: "drop-shadow(0 4px 2px rgba(0,0,0,0.5))",
        blur: "blur(2px)",
        pencil: "url(#sb-pencil-filter)",
      };
      line.attr("filter", filters[connection.lineEffect] || null);
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
    const connection = this.getConnection(targetNodeId);
    if (!connection) return false;
    if (which === "source") connection.sourceAnchor = anchor;
    else connection.targetAnchor = anchor;
    connection.connectable?.setAttachmentAnchor?.(which, anchor);
    return true;
  }

  // ─── A line's ends (see LineEnds.ts) ─────────────────────────────

  /** Whether an end of one of this note's lines follows its note, is pinned to a spot on its edge, or is free. */
  public endState(connectionId: string, which: LineEnd): EndState | null {
    const connection = this.connections.get(connectionId);
    const con: any = connection?.connectable;
    if (!con) return null;
    const shape = which === "source" ? con.source : con.target;
    if (shape?._isPhantomRect || (which === "target" && (connection as any)._phantom)) return "free";
    return (which === "source" ? con.sourceAnchor : con.targetAnchor) ? "pinned" : "follow";
  }

  /**
   * Where an end is on its note now, as an anchor: read from the line as drawn,
   * so pinning an end that follows keeps it exactly where it is. Null for a free end.
   */
  public currentAnchor(connectionId: string, which: LineEnd): EndAnchor | null {
    const connection = this.connections.get(connectionId);
    if (!connection || this.endState(connectionId, which) === "free") return null;
    const note: any = which === "source" ? connection.source : connection.target;
    const o = note?.options || {};
    const pinned = which === "source" ? connection.connectable?.sourceAnchor : connection.connectable?.targetAnchor;
    if (pinned) return { x: pinned.x, y: pinned.y };
    try {
      const path: any = connection.connectable?.connector?.node;
      const length = path.getTotalLength();
      const p = path.getPointAtLength(which === "source" ? 0 : length);
      const n = normalizedOn(
        { x: o.x || 0, y: o.y || 0, width: o.width || 1, height: o.height || 1, rotation: o.rotate?.rotationAngle || 0 },
        { x: p.x, y: p.y }
      );
      return snapToEdge(n);
    } catch (e) {
      return connection.connectable?.getCurrentAnchor?.(which) ?? null;
    }
  }

  /**
   * Pin an end where it is now ("pinned"), at a given spot ({x, y}), or let it
   * follow its note ("follow"). Saved on the line, shared and undoable, like
   * every line property. False for a free end or a line this note does not hold.
   */
  public setEnd(connectionId: string, which: LineEnd, mode: "follow" | "pinned" | EndAnchor): boolean {
    const connection = this.connections.get(connectionId);
    const owner: any = connection?.source;
    if (!connection || owner !== this.node || this.endState(connectionId, which) === "free") return false;
    const anchor = mode === "follow" ? null : mode === "pinned" ? this.currentAnchor(connectionId, which) : snapToEdge(mode);
    const prop = which === "source" ? "sourceAnchor" : "targetAnchor";
    owner.relationships?.applyLineProperty(connection.id, prop, anchor);
    (this.slate as any).broadcast?.("onLinePropertiesChanged", { id: owner.id, associationId: connection.id, prop, val: anchor });
    this.describeHandles(connection);
    (this.slate as any).scheduleSelectionFrame?.();
    return true;
  }

  /**
   * An end was dropped (the vendored lib has already moved the VIEW). The model
   * follows: on another note the end moves there, pinned to the spot when dropped
   * near the note's edge and following the note when dropped on its middle; on
   * empty canvas the end stays where it was let go, free. A line whose starting
   * end is let go belongs to the note at its far end from then on (drawn the same
   * way). The line keeps its id. Deferred a tick so the lib's dragend finishes
   * before the connection is drawn again.
   */
  private handleEndpointChange(
    connection: Connection,
    info: { which: LineEnd; targetNodeId: string | null; isPhantom: boolean; point: any }
  ): void {
    const { which, targetNodeId, isPhantom, point } = info;
    setTimeout(() => {
      try {
        this.applyEndDrop(connection, which, isPhantom ? null : targetNodeId, point);
      } catch (e) {
        console.warn("CONNECTOR_DEBUG: endpoint change → model failed:", e);
      }
    }, 0);
  }

  private applyEndDrop(connection: Connection, which: LineEnd, nodeId: string | null, point: { x: number; y: number } | null): void {
    const slate: any = this.slate;
    const owner: any = connection.source;
    const rels: any = owner?.relationships;
    const assoc: any = rels?.getAssociations?.().find((a: any) => a.id === connection.id);
    if (!rels || !assoc) return;
    const id = assoc.id;
    const drop: any = nodeId ? slate.nodes?.one?.(nodeId) : null;
    // Put the line back as the model has it (a drop that changes nothing, or is refused).
    const restore = () => {
      rels.redraw?.(id);
      this.reselect(owner.id, id);
    };
    const anchorOn = (node: any) => {
      if (!point) return null;
      const o = node.options || {};
      const n = normalizedOn(
        { x: o.x || 0, y: o.y || 0, width: o.width || 1, height: o.height || 1, rotation: o.rotate?.rotationAngle || 0 },
        point
      );
      return anchorForDrop(n.x, n.y);
    };
    if (drop && (slate.capabilitiesOf?.(drop)?.canConnect === false || !drop.relationships)) return restore();
    const free = !!assoc.targetPoint;
    const { parent: _p, child: _c, ...record } = assoc;

    if (which === "target") {
      if (!drop) {
        if (!point) return restore();
        // Free at the point it was let go.
        rels.removeAssociation(id);
        rels.addFloatingAssociation(
          { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 },
          { ...record, childId: free ? assoc.childId : undefined, targetAnchor: null }
        );
        return this.reselect(owner.id, id);
      }
      if (drop.id === owner.id) return restore();
      const anchor = anchorOn(drop);
      if (!free && drop.id === assoc.childId) {
        // Back on its own note: pinned to this spot, or following the note.
        rels.applyLineProperty(id, "targetAnchor", anchor);
        slate.broadcast?.("onLinePropertiesChanged", { id: owner.id, associationId: id, prop: "targetAnchor", val: anchor });
        return restore();
      }
      const { targetPoint: _t, ...attached } = record;
      rels.removeAssociation(id);
      // The pin travels in the line's add (one package per move, so two people moving the
      // same end at once converge on one of the moves; see Collab.lineStamps).
      rels.addAssociation(drop, { ...attached, childId: drop.id, targetAnchor: anchor });
      return this.reselect(owner.id, id);
    }

    // The starting end.
    if (!drop) {
      // A line keeps one end on a note: a free line's start cannot be let go too.
      if (!point || free) return restore();
      const far: any = slate.nodes?.one?.(assoc.childId);
      if (!far?.relationships) return restore();
      rels.removeAssociation(id);
      far.relationships.addFloatingAssociation(
        { x: Math.round(point.x * 100) / 100, y: Math.round(point.y * 100) / 100 },
        { ...flipLine(record), parentId: far.id, childId: undefined }
      );
      return this.reselect(far.id, id);
    }
    if (!free && drop.id === assoc.childId) return restore();
    const anchor = anchorOn(drop);
    if (drop.id === owner.id) {
      rels.applyLineProperty(id, "sourceAnchor", anchor);
      slate.broadcast?.("onLinePropertiesChanged", { id: owner.id, associationId: id, prop: "sourceAnchor", val: anchor });
      return restore();
    }
    rels.removeAssociation(id);
    const moved = { ...record, parentId: drop.id, sourceAnchor: anchor };
    if (free) drop.relationships.addFloatingAssociation(assoc.targetPoint, moved);
    else {
      const child: any = slate.nodes?.one?.(assoc.childId);
      if (!child) return;
      drop.relationships.addAssociation(child, moved);
    }
    this.reselect(drop.id, id);
  }

  /** Select a line again once it has been drawn anew (after its end moved). */
  private reselect(nodeId: string, associationId: string): void {
    setTimeout(() => (this.slate as any).selectLine?.(nodeId, associationId), 0);
  }

  /** Select one of this note's lines, as clicking it does. */
  public selectConnection(connectionId: string): boolean {
    const connection = this.connections.get(connectionId);
    if (!connection || connection.source !== this.node) return false;
    this.showLineCog(connection, connection.connectable, (connection.target as any)?.id);
    return true;
  }

  /**
   * Name each end handle of a selected line for what it is and does (a button
   * in the tab order, with a tooltip), and handle its keys: Enter or Space pins
   * an end where it is or lets it follow again; the arrow keys slide a pinned
   * end round its note's edge; Delete removes the line; Escape leaves it.
   */
  private describeHandles(connection: Connection, selected = true): void {
    const con: any = connection.connectable;
    const text = (node: any) => {
      const t = String(node?.options?.text ?? "").replace(/\s+/g, " ").trim();
      return t ? `“${t.length > 40 ? t.slice(0, 39) + "…" : t}”` : "its note";
    };
    for (const which of ["source", "target"] as LineEnd[]) {
      const handle: any = which === "source" ? con?.sourceHandle : con?.targetHandle;
      const el: any = handle?.element?.node;
      if (!el) continue;
      const state = this.endState(connection.id, which);
      const name = which === "source" ? "Start of the line" : "End of the line";
      const note = text(which === "source" ? connection.source : connection.target);
      const label =
        state === "free"
          ? `${name}: free, on no note`
          : state === "pinned"
            ? `${name}: pinned to a spot on ${note}`
            : `${name}: follows ${note}`;
      const how =
        state === "free"
          ? "Drag it onto a note to attach it there."
          : state === "pinned"
            ? "Arrow keys move it along the edge; Enter lets it follow the note again. Drag it onto a note's middle to follow, onto empty canvas to leave it free."
            : "Enter pins it where it is; the arrow keys pin it and move it along the edge. Drag it onto a note's edge to pin it there, or onto empty canvas to leave it free.";
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", selected ? "0" : "-1");
      el.setAttribute("aria-label", label);
      let title = el.querySelector("title");
      if (!title) {
        title = document.createElementNS("http://www.w3.org/2000/svg", "title");
        el.appendChild(title);
      }
      title.textContent = `${label}. ${how}`;
      if (el._sbEndKeys) continue;
      el._sbEndKeys = true;
      el.addEventListener("keydown", (event: KeyboardEvent) => {
        const end = which;
        const current = this.connections.get(connection.id);
        if (!current) return;
        const key = event.key;
        const state = this.endState(current.id, end);
        if (key === "Enter" || key === " ") {
          if (state === "free") return;
          this.setEnd(current.id, end, state === "pinned" ? "follow" : "pinned");
        } else if (key.startsWith("Arrow")) {
          if (state === "free") return;
          const from = this.currentAnchor(current.id, end);
          if (!from) return;
          this.setEnd(current.id, end, nudgeAnchor(from, key, event.shiftKey ? NUDGE_STEP / 5 : NUDGE_STEP));
        } else if (key === "Delete" || key === "Backspace") {
          (this.slate as any).removeSelectedLine?.();
        } else if (key === "Escape") {
          (this.slate as any).clearLineCog?.();
          el.blur?.();
        } else {
          return;
        }
        event.preventDefault();
        event.stopPropagation();
      });
    }
  }

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
    // The marks on the ends show and hide with their handles.
    const marks = (): any[] =>
      [con.sourceHandle?.glyph, con.targetHandle?.glyph].filter((g: any) => g && g.node);
    const reveal = (visible: boolean): void => {
      [...handleEls(), ...marks()].forEach((h: any) => {
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

    // A host that draws its own context toolbar gets no pill: the line is selected
    // (its end handles shown, each marking whether it follows its note, is pinned
    // or is free) and the host hears of it through onSelectionFrame.
    if (slate.hostDrawsToolbar?.()) {
      this.selectLineConnectable(con);
      slate.setSelectedLine?.(this.node, connection.id, targetId, con);
      this.describeHandles(connection);
      return;
    }

    // Line context toolbar (G2/Q2) — modern Miro-style pill at the line midpoint:
    // delete + cog (the host's line settings).
    //
    // Delete is the engine's own. The cog is the entry to the host's line settings
    // (events.onLineMenuRequested), so it is drawn only when the host supplied that
    // callback: a settings button with no settings to open is not shown.
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
    ];
    if (typeof slate.options?.events?.onLineMenuRequested === "function") {
      tools.push({
        key: "cog",
        color: NEUTRAL,
        onClick: () => this.openLinePane(connection, con, targetId),
      });
    }
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
    this.selectLineConnectable(con);
    slate.setSelectedLine?.(this.node, connection.id, targetId, con);
    this.describeHandles(connection);
  }

  /**
   * Select the connector so its endpoint handles show — this is what makes the
   * endpoints draggable (L1 snap-anywhere). Tracked on the slate so
   * clearLineCog() (canvas click / node select) deselects it — no stuck state.
   */
  private selectLineConnectable(con: any): void {
    const slate: any = this.slate;
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

  public isEnabled(): boolean {
    return this.isActive;
  }

  public updateOptions(options: Partial<ConnectorOptions>) {
    this.options = { ...this.options, ...options };
    console.log("CONNECTOR_DEBUG: Updated options for node", this.node.id);
  }
}
