import { test, expect } from "@playwright/test";

test.describe("Keyboard shortcuts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(() => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
        showUndoRedo: true,
      });
      (window as any).slate = s;
      s.undoRedo.forceSnapshot(); // baseline
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Node1", id: "kn1" });
      s.addNode({ x: 300, y: 100, width: 120, height: 80, text: "Node2", id: "kn2" });
      s.undoRedo.forceSnapshot(); // snapshot: 2 nodes
    });
    await page.waitForTimeout(1000);
  });

  test("should deselect all with Escape", async ({ page }) => {
    await page.evaluate(() => {
      (window as any).slate.selectNodes([(window as any).slate.getAllNodes()[0]]);
    });
    await page.waitForTimeout(200);
    const selected = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    expect(selected).toBe(1);

    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as any).slate.getSelectedNodes().length);
    expect(after).toBe(0);
  });

  test("should undo with Ctrl+Z", async ({ page }) => {
    const before = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.addNode({ x: 500, y: 500, width: 100, height: 60, text: "X" });
      s.undoRedo.forceSnapshot();
    });
    await page.waitForTimeout(200);

    await page.keyboard.press("Control+KeyZ");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(after).toBe(before);
  });

  test("should delete selected node", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.selectNodes([s.getAllNodes()[0]]);
    });
    await page.waitForTimeout(200);
    const before = await page.evaluate(() => (window as any).slate.getAllNodes().length);

    await page.keyboard.press("Delete");
    await page.waitForTimeout(300);
    const after = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(after).toBeLessThan(before);
  });
});
