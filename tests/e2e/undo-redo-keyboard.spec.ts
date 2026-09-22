import { test, expect } from "@playwright/test";

// Undo/redo as a real human uses it: real mouse edits + real Ctrl/Cmd+Z / +Y keys,
// across a sequence (move, then delete). The undo-redo.spec suite drives the API
// (undoRedo.undo()); this proves the whole keyboard journey — including the crucial
// "accidental delete → Ctrl+Z brings the node back" case.
test.describe("undo/redo keyboard journey (§undo)", () => {
  test("real drag + delete, then Ctrl+Z twice restores, Ctrl+Y re-applies", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    await page.evaluate(async () => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
        showUndoRedo: true,
      });
      (window as any).slate = s;
      const n = s.addNode({
        id: "U",
        x: 180,
        y: 180,
        width: 140,
        height: 90,
        text: "U",
      });
      if (n.ready) await n.ready;
      s.undoRedo.forceSnapshot(); // baseline @ (180,180)
    });
    await page.waitForTimeout(200);

    const center = () =>
      page.evaluate(() => {
        const el = document.querySelector(
          '#app [data-node-id="U"]'
        ) as SVGGraphicsElement;
        const r = el.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });
    const xOf = () =>
      page.evaluate(() => {
        const n = (window as any).slate.nodes.one("U");
        return n ? Math.round(n.options.x) : null;
      });
    const exists = () =>
      page.evaluate(() => !!(window as any).slate.nodes.one("U"));

    // 1) Real drag right+down.
    const c = await center();
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.waitForTimeout(60);
    for (let i = 1; i <= 8; i++) {
      await page.mouse.move(c.x + i * 22, c.y + i * 11, { steps: 2 });
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(800); // let the debounced autosnap fire
    const movedX = await xOf();
    expect(movedX).toBeGreaterThan(180); // node moved right

    // 2) Real Delete (node is selected from the drag) removes it.
    await page.keyboard.press("Delete");
    await page.waitForTimeout(300);
    expect(await exists()).toBe(false);

    // 3) Ctrl+Z → undo the delete: the node comes back (the accidental-delete save).
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(400);
    expect(await exists()).toBe(true);

    // 4) Ctrl+Z → undo the move: node returns toward its original x.
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(400);
    const afterSecondUndo = await xOf();
    expect(afterSecondUndo).toBeLessThan(movedX!);

    // 5) Ctrl+Y → redo the move: node goes back to the moved x.
    await page.keyboard.press("Control+y");
    await page.waitForTimeout(400);
    const afterRedo = await xOf();
    expect(afterRedo).toBeGreaterThan(afterSecondUndo!);
  });
});
