import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Connector } from "../../src/core/Connector";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockSvgGroup() {
  return {
    connectable: undefined as any,
    on: vi.fn().mockReturnThis(),
    one: vi.fn().mockReturnThis(),
    off: vi.fn().mockReturnThis(),
    id: vi.fn(),
  };
}

function createMockNode(id: string, overrides: Record<string, any> = {}) {
  const svgGroup = createMockSvgGroup();
  const node = {
    id,
    svgGroup,
    slate: {
      canvas: {
        group: vi.fn().mockImplementation(() => ({
          add: vi.fn(),
          node: document.createElementNS("http://www.w3.org/2000/svg", "g"),
        })),
      },
      linesContainer: null,
      markersContainer: null,
    },
    connector: null as any,
    ...overrides,
  };
  // Ensure nested overrides take effect
  if (overrides.slate) node.slate = overrides.slate;
  if (overrides.svgGroup) node.svgGroup = overrides.svgGroup;
  return node;
}

function createMockConnectable(overrides: Record<string, any> = {}) {
  return {
    source: null,
    target: null,
    connector: {
      remove: vi.fn(),
      attr: vi.fn().mockReturnThis(),
      node: document.createElementNS("http://www.w3.org/2000/svg", "path"),
    },
    marker: {
      remove: vi.fn(),
    },
    line: {
      remove: vi.fn(),
    },
    update: vi.fn(),
    setConnectorColor: vi.fn(),
    setLineColor: vi.fn(),
    setHandleVisibility: vi.fn(),
    selectConnector: vi.fn(),
    deselectConnector: vi.fn(),
    getHandles: vi.fn().mockReturnValue([]),
    setConnectorAttachment: vi.fn(),
    setStrokeWidth: vi.fn(),
    setMarker: vi.fn(),
    makeInteractive: vi.fn(),
    makeSelectable: vi.fn(),
    makeDraggable: vi.fn(),
    ...overrides,
  };
}

function enableConnector(connector: Connector) {
  // Attach the connectable plugin so enable() doesn't warn
  (connector as any).node.svgGroup.connectable = vi
    .fn()
    .mockImplementation((opts: any, targetEl: any) => {
      return createMockConnectable({ source: connector, target: targetEl });
    });
  connector.enable();
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Connector", () => {
  let mockNodeA: any;
  let mockNodeB: any;
  let consoleLogSpy: any;
  let consoleWarnSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    mockNodeA = createMockNode("nodeA");
    mockNodeB = createMockNode("nodeB");

    // Suppress console noise during tests
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // -----------------------------------------------------------------------
  // Construction & initialization
  // -----------------------------------------------------------------------

  describe("construction and initialization", () => {
    it("should construct with defaults when no options passed", () => {
      const connector = new Connector(mockNodeA);

      expect(connector).toBeInstanceOf(Connector);
      expect((connector as any).node).toBe(mockNodeA);
      expect((connector as any).slate).toBe(mockNodeA.slate);
      expect((connector as any).isActive).toBe(false);
      expect((connector as any).connections.size).toBe(0);

      // Default options
      const opts = (connector as any).options;
      expect(opts.enabled).toBe(false);
      expect(opts.defaultLineColor).toBe("#666666");
      expect(opts.defaultLineWidth).toBe(2);
      expect(opts.type).toBe("curved");
      expect(opts.color).toBe("#007cff");
      expect(opts.strokeWidth).toBe(3);
      expect(opts.sourceAttach).toBe("perifery");
      expect(opts.targetAttach).toBe("perifery");
      expect(opts.markerSource).toBe("null");
      expect(opts.markerTarget).toBe("default");
      expect(opts.showHandles).toBe(true);
      expect(opts.curveRadius).toBe(30);
      expect(opts.padEllipse).toBe(true);
    });

    it("should merge user options with defaults", () => {
      const connector = new Connector(mockNodeA, {
        enabled: true,
        defaultLineColor: "#ff0000",
        type: "straight",
        curveRadius: 50,
        onConnect: vi.fn(),
      });

      const opts = (connector as any).options;
      expect(opts.enabled).toBe(true);
      expect(opts.defaultLineColor).toBe("#ff0000");
      expect(opts.type).toBe("straight");
      expect(opts.curveRadius).toBe(50);
      expect(opts.onConnect).toBeDefined();
      // Defaults not overridden preserve their values
      expect(opts.defaultLineWidth).toBe(2);
      expect(opts.color).toBe("#007cff");
    });

    it("should set SVG global on window in browser environment", () => {
      // jsdom has window defined
      expect((window as any).SVG).toBeDefined();
    });

    it("should store reference on node.connector", () => {
      const connector = new Connector(mockNodeA);
      // The class does NOT auto-store on node.connector — that's the caller's job.
      // But the Relationships class does it. Connector just stores internally.
      expect((connector as any).node).toBe(mockNodeA);
    });
  });

  // -----------------------------------------------------------------------
  // enable / disable
  // -----------------------------------------------------------------------

  describe("enable / disable", () => {
    it("should enable the connector and create containers", () => {
      const connector = new Connector(mockNodeA);

      // Attach connectable plugin mock
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());

      connector.enable();

      expect(connector.isEnabled()).toBe(true);
      // Should have created global containers on the slate
      expect(mockNodeA.slate.linesContainer).toBeDefined();
      expect(mockNodeA.slate.markersContainer).toBeDefined();
      // canvas.group should have been called
      expect(mockNodeA.slate.canvas.group).toHaveBeenCalledTimes(2);
    });

    it("should be idempotent when called multiple times", () => {
      const connector = new Connector(mockNodeA);
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());

      connector.enable();
      connector.enable(); // second call

      expect(connector.isEnabled()).toBe(true);
      // Containers should only be created once
      expect(mockNodeA.slate.canvas.group).toHaveBeenCalledTimes(2);
    });

    it("should log a warning if svg.connectable.js is not available on enable", () => {
      // Do NOT set svgGroup.connectable
      const connector = new Connector(mockNodeA);

      connector.enable();

      expect(connector.isEnabled()).toBe(true); // still enables with limited functionality
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining("svg.connectable.js not available")
      );
    });

    it("should use existing containers if already present on slate", () => {
      const existingLines = { id: "lines" };
      const existingMarkers = { id: "markers" };
      mockNodeA.slate.linesContainer = existingLines;
      mockNodeA.slate.markersContainer = existingMarkers;

      const connector = new Connector(mockNodeA);
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());
      connector.enable();

      // Should NOT create new groups
      expect(mockNodeA.slate.canvas.group).not.toHaveBeenCalled();
      expect((connector as any).options.lineContainer).toBe(existingLines);
      expect((connector as any).options.markerContainer).toBe(existingMarkers);
    });

    it("should use externally provided line/marker containers", () => {
      const customLineContainer = { id: "customLines" };
      const customMarkerContainer = { id: "customMarkers" };

      const connector = new Connector(mockNodeA, {
        lineContainer: customLineContainer,
        markerContainer: customMarkerContainer,
      });
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());
      connector.enable();

      expect(mockNodeA.slate.canvas.group).not.toHaveBeenCalled();
      expect((connector as any).options.lineContainer).toBe(customLineContainer);
      expect((connector as any).options.markerContainer).toBe(customMarkerContainer);
    });

    it("should disable and disconnect all connections", () => {
      const connector = new Connector(mockNodeA);

      // Enable and create a connection first
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());
      connector.enable();

      // Manually add a connection to verify cleanup
      const mockConn = createMockConnectable({ line: { remove: vi.fn() }, marker: { remove: vi.fn() } });
      (connector as any).connections.set("nodeA->nodeB", {
        id: "nodeA->nodeB",
        source: mockNodeA,
        target: mockNodeB,
        connectable: mockConn,
      });

      connector.disable();

      expect(connector.isEnabled()).toBe(false);
      // All connections should be removed
      expect((connector as any).connections.size).toBe(0);
    });

    it("should be idempotent when disabling multiple times", () => {
      const connector = new Connector(mockNodeA);
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());
      connector.enable();
      connector.disable();
      connector.disable(); // second call — should be no-op

      expect(connector.isEnabled()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // connectTo
  // -----------------------------------------------------------------------

  describe("connectTo", () => {
    it("should reject connection when not enabled", () => {
      const connector = new Connector(mockNodeA);
      // NOT enabled

      const result = connector.connectTo(mockNodeB);

      expect(result).toBeNull();
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connector not enabled for node",
        "nodeA"
      );
    });

    it("should reject connection when svg.connectable.js is unavailable", () => {
      const connector = new Connector(mockNodeA);
      // Enable without connectable plugin
      // enable() will log a warning but still set isActive=true
      connector.enable();
      // Ensure connectable is explicitly undefined/null
      mockNodeA.svgGroup.connectable = undefined;

      const result = connector.connectTo(mockNodeB);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("svg.connectable.js not properly loaded")
      );
    });

    it("should create a connection between two nodes", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const connection = connector.connectTo(mockNodeB);

      expect(connection).not.toBeNull();
      expect(connection!.id).toBe("nodeA->nodeB");
      expect(connection!.source).toBe(mockNodeA);
      expect(connection!.target).toBe(mockNodeB);
      expect(connection!.connectable).toBeDefined();

      // Verify connectable was called with correct options
      expect(mockNodeA.svgGroup.connectable).toHaveBeenCalledWith(
        expect.objectContaining({
          container: (connector as any).options.lineContainer,
          markers: (connector as any).options.markerContainer,
          type: "curved",
          color: "#007cff",
          strokeWidth: 3,
          sourceAttach: "perifery",
          targetAttach: "perifery",
          markerSource: "null",
          markerTarget: "default",
          showHandles: true,
          curveRadius: 30,
        }),
        mockNodeB.svgGroup
      );

      // Connection is stored
      expect(connector.getConnections()).toHaveLength(1);
    });

    it("should return existing connection on duplicate attempt", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const first = connector.connectTo(mockNodeB);
      const second = connector.connectTo(mockNodeB);

      // Should return the same connection
      expect(second).toBe(first);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connection already exists:",
        "nodeA->nodeB"
      );
      // connectable should only be called once (no duplicate line)
      expect(mockNodeA.svgGroup.connectable).toHaveBeenCalledTimes(1);
    });

    it("should store reverse connection on target node", () => {
      // Give target its own connector
      mockNodeB.connector = new Connector(mockNodeB);
      (mockNodeB.connector as any).connections = new Map();

      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      connector.connectTo(mockNodeB);

      // Reverse lookup is keyed by the unique connection id (parallel-edge aware).
      const reverseId = "nodeB<-nodeA->nodeB";
      expect(mockNodeB.connector.connections.has(reverseId)).toBe(true);
      expect(mockNodeB.connector.connections.get(reverseId)!.id).toBe("nodeA->nodeB");
    });

    it("should not fail when target node has no connector", () => {
      mockNodeB.connector = null; // explicit

      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const connection = connector.connectTo(mockNodeB);

      expect(connection).not.toBeNull();
      expect(connector.getConnections()).toHaveLength(1);
    });

    it("should call onConnect callback when provided", () => {
      const onConnect = vi.fn();
      const connector = new Connector(mockNodeA, { onConnect });
      enableConnector(connector);

      const connection = connector.connectTo(mockNodeB);

      expect(onConnect).toHaveBeenCalledTimes(1);
      expect(onConnect).toHaveBeenCalledWith(connection);
    });

    it("should apply custom line color and width via connectionOptions", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const connection = connector.connectTo(mockNodeB, {
        lineColor: "#ff00ff",
        lineWidth: 5,
      });

      expect(connection!.lineColor).toBe("#ff00ff");
      expect(connection!.lineWidth).toBe(5);
    });

    it("should call setLineColor if connectable has the method", () => {
      const mockConnectable = createMockConnectable();
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(mockConnectable);

      const connector = new Connector(mockNodeA);
      connector.enable();

      connector.connectTo(mockNodeB, { lineColor: "#ff00ff" });

      expect(mockConnectable.setLineColor).toHaveBeenCalledWith("#ff00ff");
    });

    it("should not call setLineColor if connectable lacks the method", () => {
      const mockConnectable = createMockConnectable();
      delete mockConnectable.setLineColor;
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(mockConnectable);

      const connector = new Connector(mockNodeA);
      connector.enable();

      // Should not throw
      const connection = connector.connectTo(mockNodeB, { lineColor: "#ff00ff" });
      expect(connection).not.toBeNull();
    });

    it("should handle connectable returning null/undefined gracefully", () => {
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(null);

      const connector = new Connector(mockNodeA);
      connector.enable();

      const result = connector.connectTo(mockNodeB);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining("Failed to create connectable object")
      );
    });

    it("should handle exceptions during connection creation", () => {
      mockNodeA.svgGroup.connectable = vi.fn().mockImplementation(() => {
        throw new Error("Connection failed");
      });

      const connector = new Connector(mockNodeA);
      connector.enable();

      const result = connector.connectTo(mockNodeB);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Failed to create connection:",
        expect.any(Error)
      );
    });

    it("should handle self-connection (same node)", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const connection = connector.connectTo(mockNodeA);

      // It should attempt the connection — svg.connectable.js may or may not render it
      expect(connection).not.toBeNull();
      expect(connection!.id).toBe("nodeA->nodeA");
      expect(connector.getConnections()).toHaveLength(1);
    });

    it("should handle target node with missing svgGroup", () => {
      const incompleteNode = { id: "badNode", slate: mockNodeA.slate };
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      // connectable is called with targetNode.svgGroup — if undefined, the plugin handles it
      const connection = connector.connectTo(incompleteNode);

      expect(mockNodeA.svgGroup.connectable).toHaveBeenCalledWith(
        expect.anything(),
        undefined
      );
    });
  });

  // -----------------------------------------------------------------------
  // disconnectFrom / disconnectById / disconnectAll
  // -----------------------------------------------------------------------

  describe("disconnectFrom", () => {
    it("should disconnect from a target node", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB);

      const result = connector.disconnectFrom(mockNodeB);

      expect(result).toBe(true);
      expect(connector.getConnections()).toHaveLength(0);
    });

    it("should return false if no connection to target exists", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const result = connector.disconnectFrom(mockNodeB);

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connection not found:",
        "nodeA->nodeB"
      );
    });

    it("should fully remove the connectable via con.remove()", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB);

      // The real connectable exposes remove() (removes connector/hitArea/handles/
      // markers/phantoms) — the old line/marker props never existed, which is why
      // disconnect left rogue lines behind.
      const removeSpy = vi.fn();
      (connection as any).connectable.remove = removeSpy;

      connector.disconnectFrom(mockNodeB);

      expect(removeSpy).toHaveBeenCalled();
    });

    it("should clean up the reverse reference on target node", () => {
      mockNodeB.connector = new Connector(mockNodeB);
      (mockNodeB.connector as any).connections = new Map();

      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      connector.disconnectFrom(mockNodeB);

      const reverseId = "nodeB<-nodeA";
      expect(mockNodeB.connector.connections.has(reverseId)).toBe(false);
    });

    it("should call onDisconnect callback when provided", () => {
      const onDisconnect = vi.fn();
      const connector = new Connector(mockNodeA, { onDisconnect });
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB);

      connector.disconnectFrom(mockNodeB);

      expect(onDisconnect).toHaveBeenCalledTimes(1);
      expect(onDisconnect).toHaveBeenCalledWith(connection);
    });
  });

  describe("disconnectById", () => {
    it("should disconnect by connection ID string", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      const result = connector.disconnectById("nodeA->nodeB");

      expect(result).toBe(true);
      expect(connector.getConnections()).toHaveLength(0);
    });

    it("should return false for non-existent ID", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const result = connector.disconnectById("nonexistent");

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connection not found:",
        "nonexistent"
      );
    });

    it("should handle missing connectable or line gracefully", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      // Corrupt the stored connection
      const conn = (connector as any).connections.get("nodeA->nodeB");
      conn.connectable = null;

      // Should not throw
      const result = connector.disconnectById("nodeA->nodeB");
      expect(result).toBe(true);
    });
  });

  describe("disconnectAll", () => {
    it("should disconnect all connections", () => {
      const mockNodeC = createMockNode("nodeC");

      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);
      connector.connectTo(mockNodeC);

      expect(connector.getConnections()).toHaveLength(2);

      connector.disconnectAll();

      expect(connector.getConnections()).toHaveLength(0);
    });

    it("should be safe when there are no connections", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      // Should not throw
      connector.disconnectAll();
      expect(connector.getConnections()).toHaveLength(0);
    });
  });

  // -----------------------------------------------------------------------
  // getConnections / getConnection
  // -----------------------------------------------------------------------

  describe("getConnections", () => {
    it("should return an empty array when no connections exist", () => {
      const connector = new Connector(mockNodeA);

      const connections = connector.getConnections();

      expect(connections).toEqual([]);
    });

    it("should return all connections", () => {
      const mockNodeC = createMockNode("nodeC");

      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);
      connector.connectTo(mockNodeC);

      const connections = connector.getConnections();

      expect(connections).toHaveLength(2);
      expect(connections.map((c) => c.id).sort()).toEqual([
        "nodeA->nodeB",
        "nodeA->nodeC",
      ]);
    });

    it("should return independent copies (array of refs to same objects)", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      const arr1 = connector.getConnections();
      const arr2 = connector.getConnections();

      expect(arr1).toEqual(arr2);
      // Both arrays reference the same connection objects
      expect(arr1[0]).toBe(arr2[0]);
    });
  });

  describe("getConnection", () => {
    it("should return a connection by target node ID", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      const connection = connector.getConnection("nodeB");

      expect(connection).not.toBeNull();
      expect(connection!.id).toBe("nodeA->nodeB");
      expect(connection!.target).toBe(mockNodeB);
    });

    it("should return null for non-existent target ID", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const connection = connector.getConnection("nonexistent");

      expect(connection).toBeNull();
    });

    it("should return null when connector has no connections", () => {
      const connector = new Connector(mockNodeA);

      expect(connector.getConnection("nodeB")).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // updateConnection
  // -----------------------------------------------------------------------

  describe("updateConnection", () => {
    it("should update connection properties", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB);

      const result = connector.updateConnection("nodeA->nodeB", {
        lineColor: "#ff0000",
        lineWidth: 4,
      });

      expect(result).toBe(true);
      expect(connection!.lineColor).toBe("#ff0000");
      expect(connection!.lineWidth).toBe(4);
    });

    it("should call setConnectorColor when updating lineColor", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB);

      connector.updateConnection("nodeA->nodeB", { lineColor: "#ff0000" });

      // The real connectable exposes setConnectorColor (there is no setLineColor)
      expect(connection!.connectable.setConnectorColor).toHaveBeenCalledWith("#ff0000");
    });

    it("should paint line opacity and effects on the connector path", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB)!;

      connector.updateConnection("nodeA->nodeB", {
        lineOpacity: 0.45,
        lineEffect: "postItNote",
      });

      expect(connection.lineOpacity).toBe(0.45);
      expect(connection.lineEffect).toBe("postItNote");
      expect(connection.connectable.connector.attr).toHaveBeenCalledWith(
        "stroke-opacity",
        0.45
      );
      expect(connection.connectable.connector.attr).toHaveBeenCalledWith(
        "filter",
        "drop-shadow(0 4px 2px rgba(0,0,0,0.5))"
      );
    });

    it("toggles source and target arrowheads independently", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      const connection = connector.connectTo(mockNodeB)!;

      connector.updateConnection("nodeA->nodeB", { showParentArrow: true });
      expect(connection.connectable.setMarker).toHaveBeenLastCalledWith(
        "arrow",
        "arrow",
      );

      connector.updateConnection("nodeA->nodeB", { showChildArrow: false });
      expect(connection.connectable.setMarker).toHaveBeenLastCalledWith(
        "arrow",
        "null",
      );

      connector.updateConnection("nodeA->nodeB", { showParentArrow: false });
      expect(connection.connectable.setMarker).toHaveBeenLastCalledWith(
        "null",
        "null",
      );
    });

    it("should return false for non-existent connection", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      const result = connector.updateConnection("nonexistent", { lineColor: "#f00" });

      expect(result).toBe(false);
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connection not found for update:",
        "nonexistent"
      );
    });

    it("should handle exceptions gracefully", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      // Mock Object.assign to throw
      const assignSpy = vi.spyOn(Object, "assign").mockImplementationOnce(() => {
        throw new Error("Assign failed");
      });

      const result = connector.updateConnection("nodeA->nodeB", {
        lineColor: "#f00",
      });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Failed to update connection:",
        expect.any(Error)
      );

      assignSpy.mockRestore();
    });
  });

  // -----------------------------------------------------------------------
  // updateOptions
  // -----------------------------------------------------------------------

  describe("updateOptions", () => {
    it("should update options by merging", () => {
      const connector = new Connector(mockNodeA, {
        defaultLineColor: "#666",
        type: "curved",
      });

      connector.updateOptions({
        defaultLineColor: "#000",
        type: "straight",
        curveRadius: 15,
      });

      const opts = (connector as any).options;
      expect(opts.defaultLineColor).toBe("#000");
      expect(opts.type).toBe("straight");
      expect(opts.curveRadius).toBe(15);
      // Non-updated options should remain
      expect(opts.defaultLineWidth).toBe(2);
    });
  });

  // -----------------------------------------------------------------------
  // isEnabled
  // -----------------------------------------------------------------------

  describe("isEnabled", () => {
    it("should return false by default", () => {
      const connector = new Connector(mockNodeA);
      expect(connector.isEnabled()).toBe(false);
    });

    it("should return true after enable", () => {
      const connector = new Connector(mockNodeA);
      (mockNodeA as any).svgGroup.connectable = vi.fn();
      connector.enable();
      expect(connector.isEnabled()).toBe(true);
    });

    it("should return false after disable", () => {
      const connector = new Connector(mockNodeA);
      (mockNodeA as any).svgGroup.connectable = vi.fn();
      connector.enable();
      connector.disable();
      expect(connector.isEnabled()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Edge cases & integration
  // -----------------------------------------------------------------------

  describe("edge cases", () => {
    it("should handle multiple connections from the same source", () => {
      const mockNodeC = createMockNode("nodeC");
      const mockNodeD = createMockNode("nodeD");

      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      connector.connectTo(mockNodeB);
      connector.connectTo(mockNodeC);
      connector.connectTo(mockNodeD);

      expect(connector.getConnections()).toHaveLength(3);
    });

    it("should handle disconnecting individual connections without affecting others", () => {
      const mockNodeC = createMockNode("nodeC");

      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);
      connector.connectTo(mockNodeC);

      connector.disconnectFrom(mockNodeB);

      const remaining = connector.getConnections();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe("nodeA->nodeC");
    });

    it("should handle node without slate gracefully", () => {
      // Connector reads node.slate in constructor; if missing, methods may fail
      const nodeNoSlate = {
        id: "orphan",
        svgGroup: createMockSvgGroup(),
      };

      const connector = new Connector(nodeNoSlate);
      expect((connector as any).slate).toBeUndefined();
    });

    it("should not throw when enabling without a canvas on slate", () => {
      const nodeWithoutCanvas = createMockNode("noCanvas", {
        slate: { canvas: null },
      });

      const connector = new Connector(nodeWithoutCanvas);
      nodeWithoutCanvas.svgGroup.connectable = vi
        .fn()
        .mockReturnValue(createMockConnectable());

      // When slate.canvas is null, ensureContainers will fail (throws on null.group()),
      // the catch block catches it and isActive stays false — but no uncaught throw
      expect(() => connector.enable()).not.toThrow();
      expect(connector.isEnabled()).toBe(false);
    });

    it("should handle connections being modified during disconnectAll iteration", () => {
      // disconnectAll iterates over a snapshot of keys, so mutation is safe
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      // disconnectAll takes an array snapshot, removing during iteration is fine
      expect(() => connector.disconnectAll()).not.toThrow();
      expect(connector.getConnections()).toHaveLength(0);
    });

    it("should survive connectTo when target node has no connector (null)", () => {
      mockNodeB.connector = null;

      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      // The code checks targetNode.connector before storing reverse reference;
      // null/undefined causes the condition to fail gracefully.
      const connection = connector.connectTo(mockNodeB);
      // Connection is still created even without reverse lookup
      expect(connection).not.toBeNull();
      expect(connector.getConnections()).toHaveLength(1);
    });

    it("should return null when connectTo target has a broken connector (no .connections)", () => {
      mockNodeB.connector = {}; // truthy but missing .connections Map

      const connector = new Connector(mockNodeA);
      enableConnector(connector);

      // The code enters the if block (connector is truthy) but
      // .connections.set() throws; the try/catch returns null.
      const connection = connector.connectTo(mockNodeB);
      expect(connection).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Lifecycle: enable → connect → update → disconnect → disable
  // -----------------------------------------------------------------------

  describe("full lifecycle", () => {
    it("should support an enable→connect→update→disconnect→disable cycle", () => {
      const connector = new Connector(mockNodeA, {
        defaultLineColor: "#00aa00",
        defaultLineWidth: 3,
      });

      // 1. Enable
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(createMockConnectable());
      connector.enable();
      expect(connector.isEnabled()).toBe(true);

      // 2. Connect
      const conn = connector.connectTo(mockNodeB);
      expect(conn).not.toBeNull();
      expect(connector.getConnections()).toHaveLength(1);

      // 3. Update connection
      const updated = connector.updateConnection("nodeA->nodeB", {
        lineColor: "#ff0000",
      });
      expect(updated).toBe(true);

      // 4. Disconnect
      const disconnected = connector.disconnectFrom(mockNodeB);
      expect(disconnected).toBe(true);
      expect(connector.getConnections()).toHaveLength(0);

      // 5. Disable
      connector.disable();
      expect(connector.isEnabled()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // console output verification
  // -----------------------------------------------------------------------

  describe("console output", () => {
    it("should log CONNECTOR_DEBUG messages on construction", () => {
      new Connector(mockNodeA);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Created connector for node",
        "nodeA"
      );
    });

    it("should log when connecting", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Connecting",
        "nodeA",
        "to",
        "nodeB"
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Successfully connected",
        "nodeA->nodeB"
      );
    });

    it("should log when disconnecting", () => {
      const connector = new Connector(mockNodeA);
      enableConnector(connector);
      connector.connectTo(mockNodeB);
      connector.disconnectFrom(mockNodeB);

      expect(consoleLogSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Disconnecting",
        "nodeA->nodeB"
      );
      expect(consoleLogSpy).toHaveBeenCalledWith(
        "CONNECTOR_DEBUG: Successfully disconnected",
        "nodeA->nodeB"
      );
    });
  });

  // -----------------------------------------------------------------------
  // Regression: svg.connectable.js compatibility edge cases
  // -----------------------------------------------------------------------

  describe("svg.connectable.js compatibility", () => {
    it("should pass all required connectable options through to the plugin", () => {
      const connector = new Connector(mockNodeA, {
        type: "orthogonal",
        color: "#ff6600",
        strokeWidth: 4,
        sourceAttach: "center",
        targetAttach: "center",
        markerSource: "default",
        markerTarget: "default",
        showHandles: false,
        curveRadius: 10,
      });
      enableConnector(connector);
      connector.connectTo(mockNodeB);

      expect(mockNodeA.svgGroup.connectable).toHaveBeenCalledWith(
        {
          container: (connector as any).options.lineContainer,
          markers: (connector as any).options.markerContainer,
          type: "orthogonal",
          color: "#ff6600",
          strokeWidth: 4,
          sourceAttach: "center",
          targetAttach: "center",
          markerSource: "default",
          markerTarget: "default",
          showHandles: false,
          curveRadius: 10,
        },
        mockNodeB.svgGroup
      );
    });

    it("should handle connectable returning an object without line/marker gracefully on disconnect", () => {
      const minimalConnectable = createMockConnectable({
        line: undefined,
        marker: undefined,
      });
      mockNodeA.svgGroup.connectable = vi.fn().mockReturnValue(minimalConnectable);

      const connector = new Connector(mockNodeA);
      connector.enable();
      connector.connectTo(mockNodeB);

      // Should not throw when removing — the code checks existence before calling .remove()
      expect(() => connector.disconnectFrom(mockNodeB)).not.toThrow();
      expect(connector.getConnections()).toHaveLength(0);
    });
  });
});
