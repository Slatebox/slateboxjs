import { test, expect } from "@playwright/test";

// The drawn line is trimmed back to the arrowhead's BASE so the thin stroke never
// runs under the narrowing arrowhead and pokes out its sides near the tip (which
// made the line look like it didn't conform to the arrow). The base-anchored
// marker (refX=0) still extends the head forward so its TIP lands on the node edge.
// Regression guard: path end ≈ one arrow-length back from the tip; tip on the edge.
test.describe("connector line stops at the arrowhead base (§curve)", () => {
  test("path end is inset ~arrowWidth from the tip; tip sits on the node edge", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      // A left, B right — target arrow lands on B's LEFT edge (x = B.x).
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 200, width: 120, height: 80, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 560, yPos: 200, width: 140, height: 100, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      const total = p.getTotalLength();
      const end = p.getPointAtLength(total);
      const back = p.getPointAtLength(Math.max(0, total - 6));
      const url = p.getAttribute("marker-end") || "";
      const m = document.getElementById(url.replace(/url\(#|\)/g, ""));
      const refX = m ? Number(m.getAttribute("refX")) : null;
      const aw = m
        ? Number((m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/)[2])
        : 0;
      const tx = end.x - back.x, ty = end.y - back.y;
      const tm = Math.hypot(tx, ty) || 1;
      const tip = { x: end.x + (tx / tm) * aw, y: end.y + (ty / tm) * aw };
      return {
        refX,
        arrowWidth: aw,
        endToTipDist: Math.hypot(tip.x - end.x, tip.y - end.y),
        tipGapToLeftEdge: Math.abs(tip.x - b.v2.options.x),
      };
    });

    // Marker is base-anchored.
    expect(res.refX).toBe(0);
    // Path end (stroke) is one arrow-length back from the tip.
    expect(Math.abs(res.endToTipDist - res.arrowWidth)).toBeLessThan(2);
    // Tip lands on B's left edge (#4 — exact endpoint), not short, not overshooting.
    expect(res.tipGapToLeftEdge).toBeLessThan(5);
  });
});
