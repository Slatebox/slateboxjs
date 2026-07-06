import { test, expect } from "@playwright/test";

// U18: the arrowhead was anchored at its BASE (refX=0 for the target marker), so
// the tip overshot ~arrowWidth*strokeWidth PAST the endpoint and buried itself
// inside the node. The marker must be anchored at its TIP so the point sits on
// the line's endpoint (the node edge) — "just touching" the node.
test.describe("arrowhead tip sits on the node edge (§U18)", () => {
  test("target marker is anchored at its tip, source at its tip", async ({
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
      const readMarker = (attr: string) => {
        const url = p.getAttribute(attr);
        if (!url) return null;
        const m = document.getElementById(url.replace(/url\(#|\)/g, ""));
        if (!m) return null;
        const vb = (m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/).map(Number);
        return { refX: Number(m.getAttribute("refX")), vbWidth: vb[2] };
      };
      return { target: readMarker("marker-end"), source: readMarker("marker-start") };
    });

    // Target arrow tip is at x = viewBox width → refX must equal it.
    expect(res.target).not.toBeNull();
    expect(res.target!.refX).toBe(res.target!.vbWidth);
    // Source arrow tip is at x = 0 → refX must be 0.
    expect(res.source).not.toBeNull();
    expect(res.source!.refX).toBe(0);
  });
});
