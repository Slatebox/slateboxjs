import { describe, it, expect, vi, beforeEach } from "vitest";
import { Links } from "../../src/core/Links";

describe("Links", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {},
      slate: {
        collab: {
          isCollabConnected: vi.fn().mockReturnValue(false),
          send: vi.fn(),
        },
      },
    };
  });

  describe("set", () => {
    it("should set a URL link", () => {
      const links = new Links(mockNode);
      links.set({ show: true, type: "url", data: "https://example.com" });

      expect(links.hasLink()).toBe(true);
      expect(links.getType()).toBe("url");
      expect(links.get()!.data).toBe("https://example.com");
    });

    it("should update node options", () => {
      const links = new Links(mockNode);
      links.set({ show: true, type: "url", data: "https://test.com" });

      expect(mockNode.options.link).toBeDefined();
      expect(mockNode.options.link.show).toBe(true);
      expect(mockNode.options.link.type).toBe("url");
    });

    it("should set show: true by default", () => {
      const links = new Links(mockNode);
      links.set({ type: "url", data: "https://test.com" });

      expect(links.get()!.show).toBe(true);
    });

    it("should broadcast via collab when connected", () => {
      mockNode.slate.collab.isCollabConnected.mockReturnValue(true);
      const links = new Links(mockNode);
      links.set({ show: true, type: "url", data: "https://test.com" });

      expect(mockNode.slate.collab.send).toHaveBeenCalledWith(
        expect.objectContaining({ type: "onNodeLinkAdded" })
      );
    });

    it("should not broadcast when sendCollab is false", () => {
      mockNode.slate.collab.isCollabConnected.mockReturnValue(true);
      const links = new Links(mockNode);
      links.set({ show: true, type: "url", data: "test" }, false);

      expect(mockNode.slate.collab.send).not.toHaveBeenCalled();
    });
  });

  describe("unset", () => {
    it("should remove the link", () => {
      const links = new Links(mockNode);
      links.set({ show: true, type: "url", data: "https://test.com" });
      links.unset();

      expect(links.hasLink()).toBe(false);
      expect(links.get()).toBeNull();
      expect(mockNode.options.link).toBeUndefined();
    });
  });

  describe("hasLink", () => {
    it("should return false when no link is set", () => {
      const links = new Links(mockNode);
      expect(links.hasLink()).toBe(false);
    });
  });

  describe("constructor initialization", () => {
    it("should initialize from existing node options", () => {
      mockNode.options.link = { show: true, type: "url", data: "https://init.com" };
      const links = new Links(mockNode);

      expect(links.hasLink()).toBe(true);
      expect(links.get()!.data).toBe("https://init.com");
    });
  });

  describe("navigate", () => {
    it("should not throw when no link is set", () => {
      const links = new Links(mockNode);
      expect(() => links.navigate()).not.toThrow();
    });
  });
});
