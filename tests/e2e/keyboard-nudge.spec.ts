import { test, expect } from "@playwright/test";

// Arrow-key nudge moves the selected node(s). Previously node.position() was
// called but nothing broadcast, so the nudge never persisted / synced (the node
// snapped back on reload). Nudge now broadcasts onNodesMove (debounced) — the
// same package a drag-end emits — so the host saves it.
test.describe("keyboard arrow-nudge persists (§keyboard)", () => {
  test("arrow keys move the node AND broadcast onNodesMove", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);

    const res = await page.evaluate(async () => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { originalWidth: 1200, originalHeight: 800 },
        panZoom: { enabled: false },
      });
      const a = s.addNode({ id: "N", x: 200, y: 200, width: 120, height: 80, text: "N" });
      if (a.ready) await a.ready;
      s.selectNodes([a], false);
      await new Promise((r) => setTimeout(r, 100));

      // Record onNodesMove broadcasts.
      const moves: any[] = [];
      const orig = s.broadcast.bind(s);
      s.broadcast = (type: string, data: any) => {
        if (type === "onNodesMove") moves.push(data);
        return orig(type, data);
      };

      const x0 = Math.round(s.nodes.one("N").options.x);
      const y0 = Math.round(s.nodes.one("N").options.y);

      const key = (k: string) =>
        document.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true, cancelable: true }));
      key("ArrowRight");
      key("ArrowRight");
      key("ArrowDown");
      await new Promise((r) => setTimeout(r, 400)); // let the debounced broadcast fire

      const x1 = Math.round(s.nodes.one("N").options.x);
      const y1 = Math.round(s.nodes.one("N").options.y);
      return { x0, y0, x1, y1, moveBroadcasts: moves.length, lastMoveHasNode: moves.length > 0 && Array.isArray(moves[moves.length - 1]?.nodeOptions) };
    });

    expect(res.x1).toBeGreaterThan(res.x0); // moved right
    expect(res.y1).toBeGreaterThan(res.y0); // moved down
    expect(res.moveBroadcasts).toBeGreaterThan(0); // persisted via broadcast
    expect(res.lastMoveHasNode).toBe(true); // package carries the node options
  });
});
