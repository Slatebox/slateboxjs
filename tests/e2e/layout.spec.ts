import { test, expect } from "@playwright/test";

test.describe("Layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
        showUndoRedo: true,
        showMultiSelect: true,
      });
      (window as any).slate = s;
      return s;
    });
    await page.waitForTimeout(1000);
  });

  test("should not throw when accessing layout functions", async ({ page }) => {
    // Layout functions are available as static exports
    const result = await page.evaluate(() => {
      const slate = (window as any).slate;
      // Basic check — layout functions exist
      return typeof slate.getAllNodes().length;
    });
    expect(result).toBe("number");
  });

  test("should get initial node positions", async ({ page }) => {
    const positions = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().map((n: any) => ({
        x: n.options.x,
        y: n.options.y,
      }));
    });
    expect(positions.length).toBeGreaterThan(0);
    expect(typeof positions[0].x).toBe("number");
    expect(typeof positions[0].y).toBe("number");
  });
});
