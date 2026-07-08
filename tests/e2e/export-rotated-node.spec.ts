import { test, expect } from "@playwright/test";

// A rotated node's corners extend past its un-rotated bbox, so the export's
// fit-to-content viewBox must be computed from the ROTATED corner extent — otherwise
// a rotated node is clipped in the export.
test.describe("SVG export frames rotated nodes without clipping (§export)", () => {
  test("a 45deg-rotated node's rotated corners are inside the exported viewBox", async ({
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
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 300, yPos: 300, width: 300, height: 200, text: "Big" })
      );
      await new Promise((r) => setTimeout(r, 300));
      a.v2.options.rotate = 45;
      a.v2.applyPositionAndRotation();
      if (a.v2.finalizeInteraction) a.v2.finalizeInteraction();
      await new Promise((r) => setTimeout(r, 300));

      const o = a.v2.options;
      const cx = o.x + o.width / 2;
      const cy = o.y + o.height / 2;
      const rad = (45 * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const corners = [
        [o.x, o.y],
        [o.x + o.width, o.y],
        [o.x + o.width, o.y + o.height],
        [o.x, o.y + o.height],
      ].map(([px, py]) => {
        const dx = px - cx;
        const dy = py - cy;
        return [cx + dx * cos - dy * sin, cy + dx * sin + dy * cos];
      });
      const rMinX = Math.min(...corners.map((c) => c[0]));
      const rMinY = Math.min(...corners.map((c) => c[1]));
      const rMaxX = Math.max(...corners.map((c) => c[0]));
      const rMaxY = Math.max(...corners.map((c) => c[1]));

      const svg = (window as any).Export.exportSVG(a.v2.slate);
      const m = svg.match(
        /viewBox="([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+)"/
      );
      const vb = m ? { x: +m[1], y: +m[2], w: +m[3], h: +m[4] } : null;
      return { rMinX, rMinY, rMaxX, rMaxY, vb };
    });

    expect(res.vb).not.toBeNull();
    const { x, y, w, h } = res.vb!;
    // Every rotated corner is inside the exported viewBox (no clipping).
    expect(res.rMinX).toBeGreaterThanOrEqual(x);
    expect(res.rMinY).toBeGreaterThanOrEqual(y);
    expect(res.rMaxX).toBeLessThanOrEqual(x + w);
    expect(res.rMaxY).toBeLessThanOrEqual(y + h);
  });
});
