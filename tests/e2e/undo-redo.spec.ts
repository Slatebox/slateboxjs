import { test, expect } from "@playwright/test";

test.describe("Undo/Redo", () => {
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
      s.undoRedo.forceSnapshot(); // baseline snapshot of empty state
    });
  });

  test("should undo after adding a node", async ({ page }) => {
    const before = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Test" });
      s.undoRedo.forceSnapshot();
    });
    await page.waitForTimeout(200);
    const after = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(after).toBeGreaterThan(before);

    await page.evaluate(() => (window as any).slate.undoRedo.undo());
    await page.waitForTimeout(200);
    const undone = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(undone).toBe(before);
  });

  test("should redo after undo", async ({ page }) => {
    const initial = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "Test" });
      s.undoRedo.forceSnapshot();
    });
    await page.waitForTimeout(200);
    const afterAdd = await page.evaluate(() => (window as any).slate.getAllNodes().length);

    await page.evaluate(() => (window as any).slate.undoRedo.undo());
    await page.waitForTimeout(200);
    const afterUndo = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(afterUndo).toBe(initial);

    await page.evaluate(() => (window as any).slate.undoRedo.redo());
    await page.waitForTimeout(200);
    const afterRedo = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(afterRedo).toBe(afterAdd);
  });

  test("should support multiple undo/redo operations", async ({ page }) => {
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.addNode({ x: 100, y: 100, width: 120, height: 80, text: "A", id: "nA" });
      s.undoRedo.forceSnapshot();
    });
    await page.waitForTimeout(200);
    await page.evaluate(() => {
      const s = (window as any).slate;
      s.addNode({ x: 200, y: 200, width: 100, height: 60, text: "B", id: "nB" });
      s.undoRedo.forceSnapshot();
    });
    await page.waitForTimeout(200);

    const count2 = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(count2).toBeGreaterThanOrEqual(2);

    await page.evaluate(() => (window as any).slate.undoRedo.undo());
    await page.waitForTimeout(200);
    const count1 = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(count1).toBeLessThan(count2);

    await page.evaluate(() => (window as any).slate.undoRedo.undo());
    await page.waitForTimeout(200);
    const count0 = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(count0).toBeLessThanOrEqual(count1);

    await page.evaluate(() => (window as any).slate.undoRedo.redo());
    await page.waitForTimeout(200);
    const countR1 = await page.evaluate(() => (window as any).slate.getAllNodes().length);
    expect(countR1).toBeGreaterThan(count0);
  });
});
