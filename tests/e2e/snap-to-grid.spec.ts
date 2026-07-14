import { test, expect } from "@playwright/test";

// Snap-to-grid (opt-in via slate.grid.snapToGrid): when enabled, dragging a node
// rounds its final position to the nearest gridSize multiple. OFF by default so
// existing free-drag behavior is unchanged. Snapping is applied in BOTH dragmove
// (live) and dragend (the persisted/broadcast position).
test.describe("snap-to-grid (§node)", () => {
  test("drag snaps to grid only when enabled; free by default", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 100, width: 100, height: 60, text: "A" }));
      await new Promise((r) => setTimeout(r, 300));
      const v2 = A.v2;

      // Simulate what the drag handlers do: set an off-grid position, then apply
      // grid.snapPoint (the exact call wired into dragmove/dragend).
      const move = (x: number, y: number) => {
        v2.options.x = x;
        v2.options.y = y;
        const snapped = s.v2.grid.snapPoint(v2.options.x, v2.options.y);
        v2.options.x = snapped.x;
        v2.options.y = snapped.y;
        return { x: v2.options.x, y: v2.options.y };
      };

      // Default: snapToGrid off → position unchanged (free).
      const free = move(153, 137);

      // Enable snapping at gridSize 20.
      s.v2.grid.updateOptions({ snapToGrid: true, gridSize: 20 });
      const snapped1 = move(153, 137);
      const snapped2 = move(171, 189);

      // Disable → free again.
      s.v2.grid.updateOptions({ snapToGrid: false });
      const freeAgain = move(153, 137);

      return { free, snapped1, snapped2, freeAgain };
    });

    // Off by default → exact position kept.
    expect(res.free).toEqual({ x: 153, y: 137 });
    // Enabled → rounded to nearest 20.
    expect(res.snapped1).toEqual({ x: 160, y: 140 });
    expect(res.snapped2).toEqual({ x: 180, y: 180 });
    // Disabled again → free.
    expect(res.freeAgain).toEqual({ x: 153, y: 137 });
  });
});
