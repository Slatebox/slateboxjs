import { test, expect } from "@playwright/test";

// SVG export must frame the whole diagram (content bounds), NOT the canvas's current
// pan/zoom viewport — otherwise a scrolled or zoomed-in view exports clipped or blank.
// exportSVG now sets a fit-to-content viewBox (node bbox + padding).
test.describe("SVG export frames the content, not the viewport (§export)", () => {
  test("exported viewBox tightly contains all nodes regardless of the view", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      // Two spread-apart nodes.
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 200, width: 120, height: 80, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 620, yPos: 460, width: 120, height: 80, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));

      const nodes = a.v2.slate.nodes.allNodes.map((n: any) => n.options);
      const minX = Math.min(...nodes.map((o: any) => o.x));
      const minY = Math.min(...nodes.map((o: any) => o.y));
      const maxX = Math.max(...nodes.map((o: any) => o.x + o.width));
      const maxY = Math.max(...nodes.map((o: any) => o.y + o.height));

      // Scroll the canvas far away so the current view no longer shows the content.
      const c = a.v2.slate.canvas;
      const vb = c.viewbox();
      c.viewbox(vb.x + 3000, vb.y + 3000, vb.width, vb.height);
      await new Promise((r) => setTimeout(r, 200));

      const svg = (window as any).Export.exportSVG(a.v2.slate);
      const m = svg.match(
        /viewBox="([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+)"/
      );
      const evb = m
        ? { x: +m[1], y: +m[2], w: +m[3], h: +m[4] }
        : null;
      return { minX, minY, maxX, maxY, evb };
    });

    expect(res.evb).not.toBeNull();
    const { x, y, w, h } = res.evb!;
    // The exported viewBox contains all content...
    expect(res.minX).toBeGreaterThanOrEqual(x - 1);
    expect(res.minY).toBeGreaterThanOrEqual(y - 1);
    expect(res.maxX).toBeLessThanOrEqual(x + w + 1);
    expect(res.maxY).toBeLessThanOrEqual(y + h + 1);
    // ...and is TIGHT (content bbox + padding), not the whole infinite canvas.
    expect(w).toBeLessThan(1200);
    expect(h).toBeLessThan(1200);
  });
});
