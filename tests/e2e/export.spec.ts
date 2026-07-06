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

  test("should export valid SVG XML containing the node content", async ({ page }) => {
    const svgXml = await page.evaluate(async () => {
      const slate = (window as any).slate;
      slate.nodes.one("export-test")?.setColors?.("#4caf50");
      await new Promise((r) => setTimeout(r, 100));
      return new Promise<string>((resolve) => {
        slate.svg(undefined, (xml: string) => resolve(xml));
      });
    });
    expect(svgXml).toContain("<svg");
    expect(svgXml).toContain("</svg>");
    // Not just well-formed — it must carry the actual diagram (an empty <svg>
    // would still pass the structural checks above).
    expect(svgXml).toContain("Export"); // the node's text
    expect(/<(rect|path)\b/i.test(svgXml)).toBe(true); // the node's shape
    expect(svgXml.toLowerCase()).toContain("4caf50"); // the node's fill color
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
