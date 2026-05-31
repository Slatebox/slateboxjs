import { test, expect } from "@playwright/test";

test.describe("Export", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Export", id: "export-test" });
    });
    await page.waitForTimeout(500);
  });

  test("should export valid SVG XML", async ({ page }) => {
    const svgXml = await page.evaluate(async () => {
      const slate = (window as any).slate;
      return new Promise<string>((resolve) => {
        slate.svg(undefined, (xml: string) => resolve(xml));
      });
    });
    expect(svgXml).toContain("<svg");
    expect(svgXml).toContain("</svg>");
    expect(svgXml.length).toBeGreaterThan(100);
  });

  test("should export PNG as data URL", async ({ page }) => {
    const dataUrl = await page.evaluate(async () => {
      const slate = (window as any).slate;
      return new Promise<string>((resolve) => {
        slate.png(undefined, (result: string) => resolve(result));
      });
    });
    expect(dataUrl).toContain("data:image/png;base64,");
  });
});
