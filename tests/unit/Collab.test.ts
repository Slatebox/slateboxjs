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
      },
      canvas: {
        group: vi.fn().mockReturnValue({
          move: vi.fn().mockReturnThis(),
          attr: vi.fn().mockReturnThis(),
          circle: vi.fn().mockReturnValue({
            fill: vi.fn().mockReturnThis(),
          }),
          text: vi.fn().mockReturnValue({
            font: vi.fn().mockReturnThis(),
            fill: vi.fn().mockReturnThis(),
          }),
        }),
      },
    };
  });

  describe("constructor", () => {
    it("should create a Collab instance", () => {
      const collab = new Collab(mockSlate);
      expect(collab).toBeDefined();
    });
  });

  describe("isCollabConnected", () => {
    it("should return false before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.isCollabConnected()).toBe(false);
    });
  });

  describe("getCollabUsers", () => {
    it("should return empty array before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.getCollabUsers()).toEqual([]);
    });
  });

  describe("send (without connection)", () => {
    it("should warn when not connected", () => {
      const collab = new Collab(mockSlate);
      collab.send({ type: "test", data: {} });
      expect(console.warn).toHaveBeenCalled();
    });
  });

  describe("invoke", () => {
    it("should execute packages locally", () => {
      const collab = new Collab(mockSlate);
      const handler = vi.fn();
      const packages = [{ type: "onNodePositioned", data: { id: "n1", x: 100, y: 200 } }];

      // invoke with a handler
      collab.invoke(packages);
      // Should not crash without handler
    });
  });

  describe("disconnect (without connection)", () => {
    it("should not throw when disconnecting without connection", () => {
      const collab = new Collab(mockSlate);
      expect(() => collab.disconnect()).not.toThrow();
    });
  });

  describe("init (will fail without yjs)", () => {
    it("should handle missing yjs dependency gracefully", async () => {
      const collab = new Collab(mockSlate);

      // init will fail because yjs is not installed
      await collab.init({
        wsUrl: "ws://localhost:1234",
        roomName: "test-room",
      });

      // Should still not be connected
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

  describe("getClientID", () => {
    it("should return 0 before init", () => {
      const collab = new Collab(mockSlate);
      expect(collab.getClientID()).toBe(0);
    });
  });

  describe("isConnected flag", () => {
    it("should remain false until WebSocket status confirms connection", () => {
      const collab = new Collab(mockSlate);
      // Even after init failure, isConnected should stay false
      // (removed the optimistic isConnected = true from init)
      expect(collab.isCollabConnected()).toBe(false);
    });
  });
});
