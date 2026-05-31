import { test, expect } from "@playwright/test";

test.describe("Multi-selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
        showMultiSelect: true,
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "A", id: "ms1" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "B", id: "ms2" });
    });
    await page.waitForTimeout(1000);
  });

  test("should select a single node", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.selectNodes([(window as any).slate.getAllNodes()[0]]);
    });
    await page.waitForTimeout(200);
    const selected = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    expect(selected).toBe(1);
  });

  test("should add to selection", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.selectNodes([s.getAllNodes()[0]]);
      s.selectNodes([s.getAllNodes()[1]], true);
    });
    await page.waitForTimeout(200);
    const selected = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    expect(selected).toBe(2);
  });

  test("should clear selection", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.selectNodes([s.getAllNodes()[0]]);
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => (window as any).slate.clearSelection());
    await page.waitForTimeout(200);
    const selected = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    expect(selected).toBe(0);
  });

  test("should support selecting all nodes", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.selectNodes((window as any).slate.getAllNodes());
    });
    await page.waitForTimeout(200);
    const selected = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    const total = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(selected).toBe(total);
  });
});
