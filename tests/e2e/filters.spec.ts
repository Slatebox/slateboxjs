import { test, expect } from "@playwright/test";

test.describe("Filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "A", id: "fa" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "B", id: "fb" });
    });
    await page.waitForTimeout(500);
  });

  test("should apply outline filter", async ({ page }) => {
    await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      nodes[0].filters?.apply("outline", "vect");
    });
    await page.waitForTimeout(200);
    const active = await page.evaluate(() => {
      return (window as any).slate.getAllNodes()[0].filters?.getActive() || [];
    });
    expect(active).toContain("outline");
  });

  test("should apply dropShadow filter", async ({ page }) => {
    await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      nodes[0].filters?.apply("dropShadow", "vect");
    });
    await page.waitForTimeout(200);
    const active = await page.evaluate(() => {
      return (window as any).slate.getAllNodes()[0].filters?.getActive() || [];
    });
    expect(active).toContain("dropShadow");
  });

  test("should clear filters", async ({ page }) => {
    await page.evaluate(() => {
      const n = (window as any).slate.getAllNodes()[0];
      n.filters?.apply("outline", "vect");
      n.filters?.removeAll();
    });
    await page.waitForTimeout(200);
    const active = await page.evaluate(() => {
      return (window as any).slate.getAllNodes()[0].filters?.getActive() || [];
    });
    expect(active).toHaveLength(0);
  });

  test("should apply blur filter", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.getAllNodes()[0].filters?.apply("blur", "vect");
    });
    await page.waitForTimeout(200);
    const active = await page.evaluate(() => {
      return (window as any).slate.getAllNodes()[0].filters?.getActive() || [];
    });
    expect(active).toContain("blur");
  });
});
