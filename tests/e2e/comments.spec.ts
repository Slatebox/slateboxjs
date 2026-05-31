import { test, expect } from "@playwright/test";

test.describe("Comments", () => {
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

  test("should create a comment node", async ({ page }) => {
    const before = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    await page.evaluate(() => {
      (window as any).slate.addNode({
        x: 100, y: 100, width: 200, height: 80,
        text: "Comment", backgroundColor: "#fff9c4", isComment: true, id: "comment-1",
      });
    });
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(after).toBeGreaterThan(before);
  });

  test("comment node should have yellow styling", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.addNode({
        x: 100, y: 100, width: 200, height: 80,
        text: "Comment", backgroundColor: "#fff9c4", isComment: true, id: "comment-2",
      });
    });
    await page.waitForTimeout(300);

    const bg = await page.evaluate(() => {
      const nodes = (window as any).slate.getAllNodes();
      const comment = nodes.find((n: any) => n.options.isComment);
      return comment?.options.backgroundColor;
    });
    expect(bg).toBe("#fff9c4");
  });

  test("should be marked as isComment", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.addNode({
        x: 100, y: 100, width: 200, height: 80,
        text: "Comment", backgroundColor: "#fff9c4", isComment: true, id: "comment-3",
      });
    });
    await page.waitForTimeout(300);

    const isComment = await page.evaluate(() => {
      return (window as any).slate.getAllNodes().some((n: any) => n.options.isComment);
    });
    expect(isComment).toBe(true);
  });
});
