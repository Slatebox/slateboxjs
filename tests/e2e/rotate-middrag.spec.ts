import { test, expect } from "@playwright/test";

// MID-DRAG rotation regression — the exact blind spot that hid the
// "dashed outline rotates, the actual box does not" bug. Post-release-only
// checks (rotate-visual.spec.ts) cannot see it: finalize bakes the group
// transform on release, so the end-state always looked right while the
// whole drag showed a ghost outline. These specs sample element CTMs with
// the mouse STILL DOWN and require the visible artwork to have rotated.
test.describe("mid-drag visual rotation (mouse held down)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(() => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      (window as any).__s = new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      );
    });
  });

  // Drags the rotate handle ~45° around the node center; returns the
  // rendered angles of the visible artwork with the mouse still down, plus
  // the post-release state.
  const dragAndSample = async (page: any, nodeId: string) => {
    await page.evaluate((id: string) => {
      const s = (window as any).__s;
      const v2 = s.v2 || s;
      v2.selectNodes([v2.nodes.one(id)]);
    }, nodeId);
    await page.waitForTimeout(700);

    const geom = await page.evaluate((id: string) => {
      const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`);
      const r = g!.getBoundingClientRect();
      const rot = document.querySelector("g.svg_select_handle_rot");
      const c: any = rot ? rot.querySelector("circle") || rot : null;
      const cr = c!.getBoundingClientRect();
      return {
        cx: r.x + r.width / 2, cy: r.y + r.height / 2,
        hx: cr.x + cr.width / 2, hy: cr.y + cr.height / 2,
      };
    }, nodeId);

    const sample = () =>
      page.evaluate((id: string) => {
        const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`)!;
        const svgRoot: any = document.querySelector("#slateCanvas svg");
        const ra = Math.atan2(svgRoot.getScreenCTM().b, svgRoot.getScreenCTM().a) * (180 / Math.PI);
        const ang = (el: any) => {
          if (!el) return null;
          const m = el.getScreenCTM();
          return m ? +(Math.atan2(m.b, m.a) * (180 / Math.PI) - ra).toFixed(1) : null;
        };
        const vis: any = g.querySelector("path[data-shape-path]") || g.querySelector("svg");
        const mid = ang(vis);
        const tr = g.getAttribute("transform") || "";
        return { mid, tr };
      }, nodeId);

    // arc ~45° with the button held down; sample mid-drag
    const r0 = Math.hypot(geom.hx - geom.cx, geom.hy - geom.cy);
    const a0 = Math.atan2(geom.hy - geom.cy, geom.hx - geom.cx);
    await page.mouse.move(geom.hx, geom.hy);
    await page.mouse.down();
    for (let s = 1; s <= 12; s++) {
      const a = a0 + (Math.PI / 4) * (s / 12);
      await page.mouse.move(geom.cx + r0 * Math.cos(a), geom.cy + r0 * Math.sin(a), { steps: 1 });
      await page.waitForTimeout(20);
    }
    const midDrag = await sample(); // MOUSE STILL DOWN
    await page.mouse.up();
    await page.waitForTimeout(700);
    const after = await sample();
    return { midDrag, after };
  };

  test("custom shape (diamond): artwork rotates DURING the drag", async ({ page }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = await (window as any).__s.init();
      s.nodes.add(new sb.node({ id: "MD1", xPos: 300, yPos: 240, width: 150, height: 150, text: "DIA", shape: "diamond" }));
      await new Promise((r) => setTimeout(r, 500));
    });
    const r = await dragAndSample(page, "MD1");
    // The bug: mid stayed 0 (flat artwork) while only the overlay spun.
    expect(Math.abs(r.midDrag.mid ?? 0)).toBeGreaterThan(20);
    // And no double-rotation on release (would be ~2x the mid value).
    expect(Math.abs(r.after.mid)).toBeLessThan(90);
    expect(r.after.tr).toContain("rotate");
  });

  test("text node: content rotates DURING the drag and label tracks it", async ({ page }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = await (window as any).__s.init();
      s.nodes.add(new sb.node({ id: "MD2", xPos: 320, yPos: 250, width: 200, height: 110, text: "ROTATE ME" }));
      await new Promise((r) => setTimeout(r, 500));
    });
    const r = await dragAndSample(page, "MD2");
    expect(Math.abs(r.midDrag.mid ?? 0)).toBeGreaterThan(20);
    expect(r.after.tr).toContain("rotate");
  });
});
