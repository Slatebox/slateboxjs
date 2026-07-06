import { test, expect } from "@playwright/test";

// U10: the "Line Curve" slider (lineCurviness, 0..1) was assigned directly to
// curveRadius (a pixel value), so the bezier handle was always clamped to its
// floor and the slider did nothing. lineCurviness now scales the bezier bow as a
// fraction of the span, so the slider is responsive across its range.
test.describe("line curviness slider reshapes the bezier (§U10)", () => {
  test("changing lineCurviness moves the bezier control points", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 150, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 600, yPos: 500, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      const assocId = a.v2.relationships.associations[0].id;
      a.v2.relationships.applyLineProperty(assocId, "lineType", "bezier");
      await new Promise((r) => setTimeout(r, 150));

      const cp = () => {
        const d = (document.querySelector('#slateCanvas path[connectortype="default"]') as SVGElement).getAttribute("d") || "";
        const m = d.match(/C\s*([\-\d.]+)[ ,]([\-\d.]+)/);
        return m ? [parseFloat(m[1]), parseFloat(m[2])] : null;
      };

      a.v2.relationships.applyLineProperty(assocId, "lineCurviness", 0.05);
      await new Promise((r) => setTimeout(r, 150));
      const low = cp();
      a.v2.relationships.applyLineProperty(assocId, "lineCurviness", 0.95);
      await new Promise((r) => setTimeout(r, 150));
      const high = cp();

      const shift = low && high ? Math.hypot(high[0] - low[0], high[1] - low[1]) : 0;
      return { hasLow: !!low, hasHigh: !!high, shift };
    });

    expect(res.hasLow).toBe(true);
    expect(res.hasHigh).toBe(true);
    // The control point should move substantially between min and max curviness.
    expect(res.shift).toBeGreaterThan(50);
  });
});
