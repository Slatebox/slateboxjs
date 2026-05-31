import { test, expect } from "@playwright/test";

test.describe("Images", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      (window as any).slate = s;
    });
    await page.waitForTimeout(500);
  });

  test("should add image node", async ({ page }) => {
    const before = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    await page.evaluate(() => {
      const node = (window as any).slate.addNode({
        x: 100, y: 100, width: 160, height: 120,
        text: "Image", id: "img-" + Date.now(),
      });
      if (node?.images) node.images.set("https://picsum.photos/320/240", 320, 240, true);
    });
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(after).toBeGreaterThan(before);
  });

  test("should have image after set", async ({ page }) => {
    await page.evaluate(() => {
      const node = (window as any).slate.addNode({
        x: 100, y: 100, width: 160, height: 120,
        text: "Image", id: "img-2-" + Date.now(),
      });
      if (node?.images) node.images.set("https://picsum.photos/320/240", 320, 240, true);
    });
    await page.waitForTimeout(500);

    const hasImage = await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      return nodes.some((n: any) => n.options.image);
    });
    expect(hasImage).toBe(true);
  });

  test("should clear image", async ({ page }) => {
    await page.evaluate(() => {
      const node = (window as any).slate.addNode({
        x: 100, y: 100, width: 160, height: 120,
        text: "Image", id: "img-3-" + Date.now(),
      });
      if (node?.images) node.images.set("https://picsum.photos/320/240", 320, 240, true);
    });
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      const imgNode = nodes.find((n: any) => n.options.image);
      if (imgNode?.images) imgNode.images.clear();
    });
    await page.waitForTimeout(200);

    const hasImage = await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      const imgNode = nodes.find((n: any) => n.options.image);
      return imgNode?.images?.hasImage() || false;
    });
    expect(hasImage).toBe(false);
  });
});
