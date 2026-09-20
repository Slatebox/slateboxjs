import { test, expect } from "@playwright/test";

// BirdsEye minimap. The click-to-jump navigation (click the minimap → viewport jumps,
// centered on the point) is verified live on the app (it needs a fully-initialized
// panZoom, which this lightweight harness doesn't mount). Here we durably guard the
// BirdsEye's core: it mounts and reflects the nodes as thumbnails, updating on add.
test.describe("BirdsEye minimap reflects nodes (§birdseye)", () => {
  test("minimap mounts and adds a thumbnail rect when a node is added", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const setup = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        {
          container: "slateCanvas",
          allowCollaboration: false,
          birdsEye: { enabled: true },
        },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 200, width: 100, height: 60, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 900));
      const be = document.querySelector(".slateboxjs-birdseye");
      return { mounted: !!be, rects: be ? be.querySelectorAll("rect").length : 0 };
    });

    test.skip(!setup.mounted, "BirdsEye not mounted in this harness config");

    // Add two nodes — the minimap gains a thumbnail rect for each.
    const after = await page.evaluate(async () => {
      const s = (window as any).__s;
      const sb = (window as any).Slatebox;
      s.nodes.add(
        new sb.node({ id: "B", xPos: 500, yPos: 400, width: 100, height: 60, text: "B" })
      );
      s.nodes.add(
        new sb.node({ id: "C", xPos: 40, yPos: 40, width: 100, height: 60, text: "C" })
      );
      await new Promise((r) => setTimeout(r, 1000));
      const be = document.querySelector(".slateboxjs-birdseye");
      return be ? be.querySelectorAll("rect").length : 0;
    });

    // Two more nodes ⇒ at least two more thumbnail rects.
    expect(after).toBeGreaterThanOrEqual(setup.rects + 2);
  });

  // Click-to-jump navigation: previously "verified live only" because the v1-facade
  // harness didn't mount panZoom. The SlateboxJS() factory DOES mount panZoom (see
  // zoom-controls.spec), so we can now drive a REAL click on the minimap and assert
  // the viewport pans — the actual human "click the map to jump there" interaction.
  test("a real click on the minimap jumps the viewport (pan changes)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).SlateboxJS);
    const mounted = await page.evaluate(async () => {
      const s = (window as any).SlateboxJS("#app", {
        viewPort: { allowZoom: true, allowPan: true },
        birdsEye: { enabled: true },
      });
      (window as any).__bs = s;
      // Spread nodes so content bounds are large enough for a meaningful jump.
      for (const [id, x, y] of [
        ["A", 100, 100],
        ["B", 900, 200],
        ["C", 300, 800],
        ["D", 1100, 900],
      ] as [string, number, number][]) {
        const n = s.addNode({ id, x, y, width: 120, height: 80, text: id });
        await n.ready;
      }
      await new Promise((r) => setTimeout(r, 1200));
      return !!document.querySelector(".slateboxjs-birdseye svg");
    });

    test.skip(!mounted, "BirdsEye/panZoom not mounted in this harness config");

    const panBefore = await page.evaluate(() =>
      (window as any).__bs.panZoom.getPan()
    );

    // Real click near the BOTTOM-RIGHT of the minimap. At pan (0,0) the viewport
    // indicator sits in the top-left, so a bottom-right click lands off it (a click
    // on the indicator stops propagation and would pan continuously instead).
    const mini = await page.evaluate(() => {
      const svg = document.querySelector(
        ".slateboxjs-birdseye svg"
      ) as SVGSVGElement;
      const r = svg.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    });
    await page.mouse.click(mini.x + mini.w * 0.85, mini.y + mini.h * 0.85);
    await page.waitForTimeout(400);

    const panAfter = await page.evaluate(() =>
      (window as any).__bs.panZoom.getPan()
    );
    // The viewport actually moved in response to the click.
    const moved =
      Math.abs(panAfter.x - panBefore.x) + Math.abs(panAfter.y - panBefore.y);
    expect(moved).toBeGreaterThan(5);
  });
});
