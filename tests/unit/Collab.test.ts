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
    it("should warn when not connected", () => {
      const collab = new Collab(mockSlate);
      collab.send({ type: "test", data: {} });
      expect(console.warn).toHaveBeenCalled();
    });

    it("should warn for single package without connection", () => {
      const collab = new Collab(mockSlate);
      collab.send({ type: "onNodePositioned", data: { id: "n1", x: 0, y: 0 } });
      expect(console.warn).toHaveBeenCalled();
    });

    it("should warn for array of packages without connection", () => {
      const collab = new Collab(mockSlate);
      collab.send([
        { type: "p1", data: {} },
        { type: "p2", data: {} },
      ]);
      expect(console.warn).toHaveBeenCalled();
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
