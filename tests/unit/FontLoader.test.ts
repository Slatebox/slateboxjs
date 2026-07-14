import { describe, it, expect, vi, beforeEach } from "vitest";
import { loadFont, loadAllFonts, isFontLoaded } from "../../src/core/FontLoader";

describe("FontLoader", () => {
  beforeEach(() => {
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  describe("loadFont", () => {
    it("should resolve immediately for system fonts", async () => {
      await expect(loadFont("Arial")).resolves.toBeUndefined();
      await expect(loadFont("sans-serif")).resolves.toBeUndefined();
      await expect(loadFont("Courier New")).resolves.toBeUndefined();
    });

    it("should create a link element for Google Fonts", async () => {
      const originalAppend = document.head.appendChild.bind(document.head);
      const spy = vi.spyOn(document.head, "appendChild").mockImplementation((child: any) => {
        // Simulate successful load
        setTimeout(() => child.onload?.(), 0);
        return originalAppend(child);
      });

      await loadFont("Roboto");
      expect(spy).toHaveBeenCalled();

      spy.mockRestore();
    });

    it("should resolve even on font load error", async () => {
      vi.spyOn(document.head, "appendChild").mockImplementation((child: any) => {
        setTimeout(() => child.onerror?.(), 0);
        return child;
      });

      await expect(loadFont("NonexistentFont12345")).resolves.toBeUndefined();
    });
  });

  describe("loadAllFonts", () => {
    it("should load unique fonts from all nodes", async () => {
      const mockSlate = {
        nodes: {
          allNodes: [
            { options: { fontFamily: "Arial" } },
            { options: { fontFamily: "Roboto" } },
            { options: { fontFamily: "Roboto" } }, // Duplicate
            { options: {} }, // No font
          ],
        },
      };

      // System fonts (Arial) resolve immediately, so this should complete
      await expect(loadAllFonts(mockSlate)).resolves.toBeUndefined();
    });

    it("should handle missing nodes", async () => {
      const mockSlate = { nodes: {} };
      await expect(loadAllFonts(mockSlate)).resolves.toBeUndefined();
    });
  });

  describe("isFontLoaded", () => {
    it("should return false for never-loaded fonts", () => {
      expect(isFontLoaded("NeverLoadedFont")).toBe(false);
    });
  });
});
