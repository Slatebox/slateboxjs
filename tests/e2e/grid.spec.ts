import { test, expect } from "@playwright/test";

test.describe("Grid", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800, showGrid: false, gridSize: 20 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
    });
    await page.waitForTimeout(500);
  });

  test("should show grid", async ({ page }) => {
    await page.evaluate(() => (window as any).slate.grid.show());
    await page.waitForTimeout(200);
    // Grid should not throw
  });

  test("should hide grid", async ({ page }) => {
    await page.evaluate(() => {
      const g = (window as any).slate.grid;
      g.show();
      g.hide();
    });
    await page.waitForTimeout(200);
  });

  test("should toggle show/hide", async ({ page }) => {
    await page.evaluate(() => {
      const g = (window as any).slate.grid;
      g.show();
    });
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      const g = (window as any).slate.grid;
      g.hide();
    });
    await page.waitForTimeout(100);
  });
});
