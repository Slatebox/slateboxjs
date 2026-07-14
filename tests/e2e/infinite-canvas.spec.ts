import { test, expect } from "@playwright/test";

// Infinite canvas + Miro-style pan/zoom, against the library test page.
test.describe("infinite canvas + pan/zoom", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "position:fixed;inset:0;width:100vw;height:100vh;background:#fff";
      document.body.appendChild(div);
      const sb = (window as any).Slatebox;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      s.nodes.add(
        new sb.node({ id: "c1", xPos: 5000, yPos: 5000, width: 160, height: 100, text: "n" })
      );
      (window as any).__s = s;
      await new Promise((r) => setTimeout(r, 400));
    });
  });

  test("SVG fills the container (never a fixed cut-off box)", async ({
    page,
  }) => {
    const r = await page.evaluate(() => {
      const c = document.getElementById("slateCanvas")!;
      const svg = c.querySelector("svg")!;
      const cr = svg.getBoundingClientRect();
      return {
        fills:
          Math.abs(cr.width - c.clientWidth) < 2 &&
          Math.abs(cr.height - c.clientHeight) < 2,
        hasFixedWidthAttr: svg.hasAttribute("width"),
      };
    });
    expect(r.fills).toBe(true);
    expect(r.hasFixedWidthAttr).toBe(false);
  });

  test("content beyond the initial view is reachable by panning (infinite)", async ({
    page,
  }) => {
    // Place a node far away, then pan to it — it must render (not clipped)
    const seen = await page.evaluate(async () => {
      const s = (window as any).__s;
      s.nodes.add({
        id: "far",
        xPos: 5000,
        yPos: 9000,
        width: 120,
        height: 80,
        text: "far",
      });
      await new Promise((r) => setTimeout(r, 300));
      // Pan the viewBox down to the far node
      s.v2.pan({ x: 4900, y: 8800 });
      await new Promise((r) => setTimeout(r, 300));
      const g = document.querySelector('#slateCanvas [data-node-id="far"]');
      const r = g!.getBoundingClientRect();
      // On-screen and inside the viewport
      return r.width > 0 && r.top >= 0 && r.top < window.innerHeight;
    });
    expect(seen).toBe(true);
  });

  test("two-finger scroll pans; ctrl+wheel zooms at cursor", async ({
    page,
  }) => {
    const before = await page.evaluate(() => {
      const vb = (window as any).__s.v2.canvas.viewbox();
      return { x: vb.x, y: vb.y, w: vb.width };
    });

    // Plain wheel = pan
    await page.mouse.move(600, 400);
    await page.mouse.wheel(140, 90);
    await page.waitForTimeout(200);
    const afterPan = await page.evaluate(() => {
      const vb = (window as any).__s.v2.canvas.viewbox();
      return { x: vb.x, y: vb.y, w: vb.width };
    });

    expect(Math.abs(afterPan.x - before.x)).toBeGreaterThan(5);
    expect(Math.abs(afterPan.y - before.y)).toBeGreaterThan(5);
    expect(Math.abs(afterPan.w - before.w)).toBeLessThan(1); // pan, not zoom

    // Ctrl+wheel = zoom (viewBox width shrinks when zooming in)
    const zBefore = await page.evaluate(() => (window as any).__s.v2.getZoom());
    await page.keyboard.down("Control");
    await page.mouse.wheel(0, -300);
    await page.keyboard.up("Control");
    await page.waitForTimeout(200);
    const zAfter = await page.evaluate(() => (window as any).__s.v2.getZoom());

    expect(zAfter).toBeGreaterThan(zBefore + 0.05);
  });
});
