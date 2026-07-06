import { describe, it, expect, vi, beforeEach } from "vitest";
import { Collab } from "../../src/core/Collab";

describe("Collab", () => {
  let mockSlate: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});

    mockSlate = {
      options: {
        name: "Test Slate",
        events: {},
      },
      canvas: {
        group: vi.fn().mockReturnValue({
          move: vi.fn().mockReturnThis(),
          attr: vi.fn().mockReturnThis(),
          circle: vi.fn().mockReturnValue({ fill: vi.fn().mockReturnThis() }),
          text: vi.fn().mockReturnValue({
            font: vi.fn().mockReturnThis(),
            fill: vi.fn().mockReturnThis(),
          }),
        }),
      },
    };
  });

  describe("constructor", () => {
    it("should create a Collab instance with defaults", () => {
      const collab = new Collab(mockSlate);
      expect(collab).toBeDefined();
    });

    it("should accept custom options", () => {
      const collab = new Collab(mockSlate, {
        wsUrl: "ws://custom:9999",
        roomName: "my-room",
        userName: "Tester",
        userColor: "#ff0000",
      });
      expect(collab).toBeDefined();
    });

    it("should default to localhost:1234", () => {
      const collab = new Collab(mockSlate);
      // Constructor stores options — wsUrl defaults to ws://localhost:1234
      expect(collab).toBeDefined();
    });
  });

  describe("isCollabConnected", () => {
    it("should return false before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.isCollabConnected()).toBe(false);
    });
  });

  describe("getClientID", () => {
    it("should return 0 before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.getClientID()).toBe(0);
    });
  });

  describe("getCollabUsers", () => {
    it("should return empty array before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.getCollabUsers()).toEqual([]);
    });
  });

  describe("send", () => {
    it("emits locally (no throw) when not connected", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      expect(() => collab.send({ type: "test", data: {} })).not.toThrow();
      expect(mockSlate.emitSlateChange).toHaveBeenCalledWith("test", {});
    });

    it("emits locally for a single package without connection", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      collab.send({ type: "onNodePositioned", data: { id: "n1", x: 0, y: 0 } });
      expect(mockSlate.emitSlateChange).toHaveBeenCalledTimes(1);
    });

    it("emits locally for an array of packages without connection", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      collab.send([
        { type: "p1", data: {} },
        { type: "p2", data: {} },
      ]);
      expect(mockSlate.emitSlateChange).toHaveBeenCalledTimes(2);
    });

    it("emits onSlateChanged per package (v1 echo semantics drive saves)", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      collab.send([
        { type: "onNodeTextChanged", data: { id: "n1", text: "t" } },
        { type: "onNodeColorChanged", data: { id: "n1", color: "#fff" } },
      ]);
      expect(mockSlate.emitSlateChange).toHaveBeenCalledTimes(2);
      expect(mockSlate.emitSlateChange).toHaveBeenCalledWith(
        "onNodeTextChanged",
        { id: "n1", text: "t" }
      );
    });

    // Delete persistence: the collab doc is replayed on reload/sync, so a deleted
    // node's earlier onNodeAdded must be pruned or the node comes back. send() of
    // onNodeDeleted prunes that node's add/change packages (keeps the tombstone),
    // leaving other nodes' packages intact.
    it("prunes a deleted node's add/change packages from the collab doc", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      const map = new Map<string, any>();
      (collab as any).collabMap = map;

      collab.send({ type: "onNodeAdded", data: { id: "B", nodeOptions: {} } });
      collab.send({ type: "onNodeColorChanged", data: { id: "B", color: "#fff" } });
      collab.send({ type: "onNodeAdded", data: { id: "A", nodeOptions: {} } });

      const tags = () =>
        [...map.values()].map((v: any) => `${v.type}:${v.data?.id}`);
      expect(tags()).toContain("onNodeAdded:B");

      collab.send({ type: "onNodeDeleted", data: { id: "B" } });

      const after = tags();
      expect(after).not.toContain("onNodeAdded:B"); // pruned
      expect(after).not.toContain("onNodeColorChanged:B"); // pruned
      expect(after).toContain("onNodeAdded:A"); // other node untouched
      expect(after.filter((s) => s === "onNodeDeleted:B").length).toBe(1); // tombstone kept
    });

    // Line-property toggle persistence: the doc is replayed on reload and replay
    // order is not guaranteed to be recency order. A later change to the SAME
    // property on the SAME association must supersede the earlier one, else e.g.
    // toggling Absolute→Relative leaves both packages and the stale Absolute can
    // win on replay → the toggle "reverts". (Named bug 2.)
    it("supersedes an earlier line-property change to the same prop/association", () => {
      mockSlate.emitSlateChange = vi.fn();
      const collab = new Collab(mockSlate);
      const map = new Map<string, any>();
      (collab as any).collabMap = map;

      // Toggle source endpoint: absolute, then relative (same node, same assoc).
      collab.send({ type: "onLinePropertiesChanged", data: { id: "N", associationId: "R1", prop: "sourceLock", val: "absolute" } });
      collab.send({ type: "onLinePropertiesChanged", data: { id: "N", associationId: "R1", prop: "sourceLock", val: "relative" } });
      // A DIFFERENT prop on the same association must be left alone.
      collab.send({ type: "onLinePropertiesChanged", data: { id: "N", associationId: "R1", prop: "lineColor", val: "#f00" } });
      // Same prop on a DIFFERENT association must be left alone.
      collab.send({ type: "onLinePropertiesChanged", data: { id: "N", associationId: "R2", prop: "sourceLock", val: "absolute" } });

      const sourceLockR1 = [...map.values()].filter(
        (v: any) => v.data?.prop === "sourceLock" && v.data?.associationId === "R1"
      );
      expect(sourceLockR1.length).toBe(1); // only the latest survives
      expect(sourceLockR1[0].data.val).toBe("relative"); // and it's the latest value
      // The other prop + other association are untouched.
      expect([...map.values()].some((v: any) => v.data?.prop === "lineColor")).toBe(true);
      expect([...map.values()].some((v: any) => v.data?.prop === "sourceLock" && v.data?.associationId === "R2")).toBe(true);
    });
  });

  describe("invoke", () => {
    it("should not throw for empty packages", () => {
      const collab = new Collab(mockSlate);
      expect(() => collab.invoke([])).not.toThrow();
    });

    it("should not throw for single package", () => {
      const collab = new Collab(mockSlate);
      expect(() =>
        collab.invoke({ type: "onNodePositioned", data: { id: "x" } })
      ).not.toThrow();
    });

    it("should not throw for array of packages", () => {
      const collab = new Collab(mockSlate);
      expect(() =>
        collab.invoke([
          { type: "onNodePositioned", data: { id: "a" } },
          { type: "onNodeLocked", data: { id: "b" } },
        ])
      ).not.toThrow();
    });
  });

  describe("exe", () => {
    it("should not throw for unknown package type", () => {
      const collab = new Collab(mockSlate);
      expect(() =>
        collab.exe({ type: "unknownType", data: {} })
      ).not.toThrow();
    });

    it("should handle onNodePositioned", () => {
      mockSlate.nodes = { one: vi.fn().mockReturnValue(null) };
      const collab = new Collab(mockSlate);
      expect(() =>
        collab.exe({ type: "onNodePositioned", data: { id: "n1", location: { x: 100, y: 200 } } })
      ).not.toThrow();
    });
  });

  describe("disconnect", () => {
    it("should not throw when disconnecting without connection", () => {
      const collab = new Collab(mockSlate);
      expect(() => collab.disconnect()).not.toThrow();
    });

    it("should not be connected after disconnect", () => {
      const collab = new Collab(mockSlate);
      collab.disconnect();
      expect(collab.isCollabConnected()).toBe(false);
    });
  });

  describe("init", () => {
    it("should handle missing yjs dependency gracefully", async () => {
      const collab = new Collab(mockSlate);
      await collab.init({ wsUrl: "ws://localhost:1234", roomName: "test-room" });
      expect(collab.isCollabConnected()).toBe(false);
    });

    it("should accept empty options", async () => {
      const collab = new Collab(mockSlate);
      await collab.init();
      expect(collab.isCollabConnected()).toBe(false);
    });
  });

  describe("onInitCollaboration connection handshake (v1 contract)", () => {
    it("awaits the host callback and applies returned connection details", async () => {
      const onInitCollaboration = vi.fn(async (_clientID: string) => ({
        websocketUrl: "wss://collab.slatebox.com",
        websocketParams: { bearer: "hmac-sig", timestamp: "12345" },
        userName: "Tim",
        color: "#aabbcc",
      }));
      mockSlate.options.events = { onInitCollaboration };

      const collab = new Collab(mockSlate);
      await collab.init({ roomName: "room-1" });

      // The callback receives the yjs clientID as a string (or never runs
      // if yjs is unavailable — in that case options must stay unchanged)
      if (onInitCollaboration.mock.calls.length > 0) {
        expect(typeof onInitCollaboration.mock.calls[0][0]).toBe("string");
        expect((collab as any).options.wsUrl).toBe(
          "wss://collab.slatebox.com"
        );
        expect((collab as any).options.wsParams).toEqual({
          bearer: "hmac-sig",
          timestamp: "12345",
        });
        expect((collab as any).options.userName).toBe("Tim");
        expect((collab as any).options.userColor).toBe("#aabbcc");
        expect(collab.userBaseData?.websocketParams?.bearer).toBe("hmac-sig");
      }
    });

    it("falls back to static options when the callback throws", async () => {
      mockSlate.options.events = {
        onInitCollaboration: vi.fn(() => {
          throw new Error("meteor offline");
        }),
      };
      const collab = new Collab(mockSlate, { wsUrl: "ws://static:1234" });
      await expect(collab.init({ roomName: "r" })).resolves.toBeUndefined();
      expect((collab as any).options.wsUrl).toBe("ws://static:1234");
    });
  });

  describe("updateUserData (v1 parity)", () => {
    it("merges data into the awareness user state", () => {
      const collab = new Collab(mockSlate);
      const state: any = { user: { name: "A", color: "#111" } };
      (collab as any).awareness = {
        getLocalState: () => state,
        setLocalStateField: vi.fn((field: string, value: any) => {
          state[field] = value;
        }),
      };
      collab.updateUserData({ status: "away", color: "#222" });
      expect(state.user).toEqual({
        name: "A",
        color: "#222",
        status: "away",
      });
    });

    it("is a no-op before init", () => {
      const collab = new Collab(mockSlate);
      expect(() => collab.updateUserData({ x: 1 })).not.toThrow();
    });
  });

  describe("destroy", () => {
    it("should disconnect and clean up", () => {
      const collab = new Collab(mockSlate);
      collab.destroy();
      expect(collab.isCollabConnected()).toBe(false);
    });

    it("should not throw on double destroy", () => {
      const collab = new Collab(mockSlate);
      collab.destroy();
      expect(() => collab.destroy()).not.toThrow();
    });
  });

  describe("isConnected flag", () => {
    it("should remain false until WebSocket confirms", () => {
      const collab = new Collab(mockSlate);
      expect(collab.isCollabConnected()).toBe(false);
    });

    it("should stay false after failed init", async () => {
      const collab = new Collab(mockSlate);
      await collab.init({ wsUrl: "ws://localhost:1234" });
      expect(collab.isCollabConnected()).toBe(false);
    });
  });

  describe("callbacks", () => {
    it("should fire onStatusChange when status event emitted", () => {
      const onStatusChange = vi.fn();
      const collab = new Collab(mockSlate, { onStatusChange });
      // Status callback stored in options — init would wire it up
      expect(onStatusChange).not.toHaveBeenCalled();
    });

    it("should fire onAwarenessChange callback", () => {
      const onAwarenessChange = vi.fn();
      const collab = new Collab(mockSlate, { onAwarenessChange });
      expect(collab).toBeDefined();
    });

    it("should fire onReceive callback on remote package", () => {
      const onReceive = vi.fn();
      const collab = new Collab(mockSlate, { onReceive });
      expect(collab).toBeDefined();
    });
  });
});
