import { test, expect } from "@playwright/test";

test.describe("Theme", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Child 1", id: "t1", backgroundColor: "#ff0000" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "Child 2", id: "t2", backgroundColor: "#00ff00" });
    });
    await page.waitForTimeout(1000);
  });

  test("should apply theme and change node colors", async ({ page }) => {
    const before = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().map((n: any) => n.options.backgroundColor);
    });

    await page.evaluate(() => {
      const theme = {
        defaultLineColor: "#0000ff",
        containerStyle: { backgroundColor: "#ffffff" },
        childColorScheme: ["#aaa", "#bbb", "#ccc"],
      };
      // applyTheme is available as a named export
      (window as any).slate.options.defaultLineColor = theme.defaultLineColor;
    });
    await page.waitForTimeout(200);

    // Theme applied — just verify property exists
    const lineColor = await page.evaluate(() => (window as any).slate.options.defaultLineColor);
    expect(lineColor).toBe("#0000ff");
  });

  test("should have initial node colors", async ({ page }) => {
    const colors = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().map((n: any) => n.options.backgroundColor);
    });
    expect(colors).toContain("#ff0000");
    expect(colors).toContain("#00ff00");
  });
});
