import { test, expect } from "@playwright/test";

// U19: undo/redo was non-functional in practice — UndoRedo.snap() was never
// called by the engine, so nothing was recorded unless a host manually called
// forceSnapshot(), and undo was never available. Slate.broadcast() now AUTO-
// records a snapshot on state-mutating changes (with an initial baseline).
//
// This proves the wiring the fix adds: an engine change is recorded WITHOUT any
// manual forceSnapshot, so undo becomes available. (Restore correctness is
// covered by undo-redo.spec.ts.)
test.describe("undo/redo auto-records on change (§U19)", () => {
  test("an engine broadcast grows the undo stack (no manual snapshot)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 150, yPos: 150, width: 140, height: 90, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));
      // Establish a clean known baseline.
      s.v2.undoRedo.forceSnapshot();
      const stackBase = s.v2.undoRedo.undoStack.length;
      const canUndoBase = s.v2.undoRedo.canUndo();

      // A state-mutating change routed ONLY through broadcast() — no manual snap.
      n.v2.options.x += 200;
      n.v2.applyPositionAndRotation();
      s.v2.broadcast("onNodePositioned", { id: "N", x: n.v2.options.x, y: n.v2.options.y });
      await new Promise((r) => setTimeout(r, 700)); // debounce (500ms) fires

      const stackAfter = s.v2.undoRedo.undoStack.length;
      const canUndoAfter = s.v2.undoRedo.canUndo();

      // A view-only broadcast must NOT record (excluded from undo).
      s.v2.broadcast("onZoom", { level: 1.5 });
      await new Promise((r) => setTimeout(r, 700));
      const stackAfterZoom = s.v2.undoRedo.undoStack.length;

      return { stackBase, canUndoBase, stackAfter, canUndoAfter, stackAfterZoom };
    });

    expect(res.stackBase).toBeGreaterThanOrEqual(1); // baseline present
    // The mutating change was auto-recorded → undo now available.
    expect(res.stackAfter).toBe(res.stackBase + 1);
    expect(res.canUndoAfter).toBe(true);
    // A view-only (zoom) broadcast is excluded — the stack does not grow.
    expect(res.stackAfterZoom).toBe(res.stackAfter);
  });
});
