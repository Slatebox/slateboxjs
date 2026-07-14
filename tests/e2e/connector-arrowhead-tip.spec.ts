import { test, expect } from "@playwright/test";

// U18: the arrowhead tip must sit on the node edge ("just touching"). The target
// marker is now BASE-anchored (refX=0) and the drawn line is trimmed back by the
// arrow length, so the head fills that gap and its TIP lands on the edge while the
// thin stroke stops at the base (never poking out the head's sides near the tip).
// So the PATH END is the arrowhead base; the TIP = end + tangent*arrowWidth.
test.describe("arrowhead tip sits on the node edge (§U18)", () => {
  test("target marker base-anchored; computed tip lands on the node edge", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 300, yPos: 120, width: 160, height: 100, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 450, width: 160, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      // show both a parent (source) and child (target) arrow
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      const assocId = a.v2.relationships.associations[0].id;
      a.v2.relationships.applyLineProperty(assocId, "showParentArrow", true);
      await new Promise((r) => setTimeout(r, 200));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGPathElement;
      // B is below A, so the target end lands on B's TOP edge. The path END is the
      // arrowhead BASE; the arrow TIP is one arrow-length further along the tangent.
      const total = p.getTotalLength();
      const start = p.getPointAtLength(0);
      const ahead = p.getPointAtLength(Math.min(total, 6));
      const end = p.getPointAtLength(total);
      const back = p.getPointAtLength(Math.max(0, total - 6));
      const bTop = b.v2.options.y;
      const aBottom = a.v2.options.y + a.v2.options.height;
      const readMarker = (attr: string) => {
        const url = p.getAttribute(attr);
        if (!url) return null;
        const m = document.getElementById(url.replace(/url\(#|\)/g, ""));
        if (!m) return null;
        const vb = (m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/).map(Number);
        return { refX: Number(m.getAttribute("refX")), vbWidth: vb[2] };
      };
      const target = readMarker("marker-end");
      // Tip = end + unit-tangent * arrowWidth.
      const tx = end.x - back.x, ty = end.y - back.y;
      const tm = Math.hypot(tx, ty) || 1;
      const aw = target ? target.vbWidth : 0;
      const tipY = end.y + (ty / tm) * aw;
      const stx = ahead.x - start.x, sty = ahead.y - start.y;
      const stm = Math.hypot(stx, sty) || 1;
      const source = readMarker("marker-start");
      const sourceTipY = start.y - (sty / stm) * (source?.vbWidth || 0);
      return {
        target,
        source,
        tipGapToEdge: Math.abs(tipY - bTop),
        sourceTipGapToEdge: Math.abs(sourceTipY - aBottom),
      };
    });

    // Target arrow is base-anchored (refX=0).
    expect(res.target).not.toBeNull();
    expect(res.target!.refX).toBe(0);
    // Source arrow is base-anchored too; geometry trims the line at its base.
    expect(res.source).not.toBeNull();
    expect(res.source!.refX).toBe(res.source!.vbWidth);
    // The computed TIP sits on the node edge (no gap, no overshoot).
    expect(res.tipGapToEdge).toBeLessThan(5);
    expect(res.sourceTipGapToEdge).toBeLessThan(5);
  });
});
