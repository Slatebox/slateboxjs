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

  // Regression: a DEBOUNCED snapshot (engine broadcast path, not forceSnapshot)
  // left this.debounceTimer set even after it fired, so undo()'s "flush pending"
  // check ran forceSnapshot() and pushed a DUPLICATE of the current state —
  // undo() then popped one dup and "restored" the still-current state (a no-op
  // undo). The debounce callback now nulls its handle before snapshotting.
  test("undo restores a debounced move (no duplicate-snapshot no-op)", async ({
    page,
  }) => {
    const res = await page.evaluate(async () => {
      const s = (window as any).slate;
      const a = s.addNode({ id: "MV", x: 100, y: 100, width: 120, height: 80, text: "MV" });
      if (a.ready) await a.ready;
      s.undoRedo.forceSnapshot(); // baseline @ x=100
      await new Promise((r) => setTimeout(r, 50));

      // Move + trigger a DEBOUNCED snapshot via the engine broadcast (NOT
      // forceSnapshot), then wait past the debounce so it fires + nulls its timer.
      a.position(400, 300);
      s.broadcast("onNodesMove", { data: [{ id: "MV" }] });
      await new Promise((r) => setTimeout(r, 800));
      const moved = Math.round(s.nodes.one("MV").options.x);

      s.undoRedo.undo();
      await new Promise((r) => setTimeout(r, 400));
      const undone = Math.round(s.nodes.one("MV").options.x);
      return { moved, undone };
    });

    expect(res.moved).toBe(400);
    expect(res.undone).toBe(100); // undo actually restored — not a no-op
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
