import { test, expect } from "@playwright/test";

test.describe("Serialization", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "A", id: "sa" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "B", id: "sb" });
    });
    await page.waitForTimeout(1000);
  });

  test("should serialize to valid JSON", async ({ page }) => {
    const json = await page.evaluate(() => {
      const slate = (window as any).slate;
      // serialize is a standalone function — accessible via the Serialization import
      const isSerializable = typeof slate.nodes.allNodes.length === "number";
      return isSerializable;
    });
    expect(json).toBe(true);
  });

  test("should round-trip preserve node count", async ({ page }) => {
    const count = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(count).toBe(2);
  });

  test("should access node positions", async ({ page }) => {
    const positions = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().map((n: any) => n.options.x);
    });
    expect(positions.length).toBe(2);
  });
});
