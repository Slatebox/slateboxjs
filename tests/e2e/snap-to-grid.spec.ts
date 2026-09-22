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

  // The test above calls grid.snapPoint directly. This drives a REAL mouse drag
  // with snapping enabled and asserts the node LANDS on grid multiples — proving
  // the drag handlers actually invoke snapPoint (the wiring), not just the math.
  test("a real drag lands the node on grid multiples when snapping is on", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 120, width: 100, height: 60, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 300));
      s.v2.grid.updateOptions({ snapToGrid: true, gridSize: 20 });
    });

    const c = await page.evaluate(() => {
      const r = (
        document.querySelector('#slateCanvas [data-node-id="A"]') as SVGGraphicsElement
      ).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Real drag by a deliberately off-grid delta (+53, +37).
    await page.mouse.move(c.x, c.y);
    await page.mouse.down();
    await page.waitForTimeout(60);
    for (let i = 1; i <= 6; i++) {
      await page.mouse.move(c.x + (53 * i) / 6, c.y + (37 * i) / 6, { steps: 2 });
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(400);

    const pos = await page.evaluate(() => {
      const o = (window as any).__s.v2.nodes.one("A").options;
      return { x: Math.round(o.x), y: Math.round(o.y) };
    });
    // Landed exactly on the 20px grid (the drag pipeline applied snapPoint).
    expect(pos.x % 20).toBe(0);
    expect(pos.y % 20).toBe(0);
    // And it actually moved from the start (120,120), not a no-op.
    expect(pos.x).toBeGreaterThan(120);
  });
});
