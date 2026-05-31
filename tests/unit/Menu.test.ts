import { describe, it, expect, vi, beforeEach } from "vitest";
import { Menu } from "../../src/core/Menu";

describe("Menu", () => {
  let mockNode: any;

  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});

    mockNode = {
      id: "node1",
      options: {
        allowMenu: true,
        showColorTab: true,
        showTextTab: true,
        showShapeTab: true,
        showImageTab: true,
        showEffectTab: true,
        showAITab: true,
      },
      slate: {
        options: {
          events: {
            onMenuRequested: vi.fn(),
          },
        },
      },
    };
  });

  describe("getVisibleTabs", () => {
    it("should return all tabs by default", () => {
      const menu = new Menu(mockNode);
      const tabs = menu.getVisibleTabs();

      expect(tabs).toContain("color");
      expect(tabs).toContain("text");
      expect(tabs).toContain("shape");
      expect(tabs).toContain("image");
      expect(tabs).toContain("effect");
      expect(tabs).toContain("ai");
    });

    it("should hide tabs based on node options", () => {
      mockNode.options.showColorTab = false;
      mockNode.options.showAITab = false;

      const menu = new Menu(mockNode);
      const tabs = menu.getVisibleTabs();

      expect(tabs).not.toContain("color");
      expect(tabs).not.toContain("ai");
      expect(tabs).toContain("text");
    });
  });

  describe("open/close", () => {
    it("should track open state", () => {
      const menu = new Menu(mockNode);
      expect(menu.isMenuOpen()).toBe(false);

      menu.open();
      expect(menu.isMenuOpen()).toBe(true);

      menu.close();
      expect(menu.isMenuOpen()).toBe(false);
    });

    it("should delegate to onMenuRequested event", () => {
      const menu = new Menu(mockNode);
      menu.open();

      expect(mockNode.slate.options.events.onMenuRequested).toHaveBeenCalledWith(
        mockNode,
        expect.any(Function)
      );
    });

    it("should not open when disabled", () => {
      const menu = new Menu(mockNode, { enabled: false });
      menu.open();
      expect(menu.isMenuOpen()).toBe(false);
    });

    it("should not open when allowMenu is false", () => {
      mockNode.options.allowMenu = false;
      const menu = new Menu(mockNode);
      menu.open();
      expect(menu.isMenuOpen()).toBe(false);
    });
  });

  describe("enable/disable", () => {
    it("should toggle enabled state", () => {
      const menu = new Menu(mockNode);
      expect(menu.isEnabled()).toBe(true);

      menu.disable();
      expect(menu.isEnabled()).toBe(false);

      menu.enable();
      expect(menu.isEnabled()).toBe(true);
    });

    it("should close menu on disable", () => {
      const menu = new Menu(mockNode);
      menu.open();
      menu.disable();
      expect(menu.isMenuOpen()).toBe(false);
    });
  });
});
