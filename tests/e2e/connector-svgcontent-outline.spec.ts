import { test, expect } from "@playwright/test";

// User report (Image #10): connecting to a custom svgContent shape (flower/cloud)
// attached the arrow to the bounding BOX, so on a diagonal approach the tip floated
// in the empty corner instead of touching the artwork. svgContent nodes have no
// data-shape-path, so closestPointOnPathOutline fell back to the bbox. Fix: use the
// largest <path> in the node's nested <svg> as the outline. Guard: the arrow tip
// lands INSIDE the flower's fill on a diagonal approach.
test.describe("connector attaches to svgContent artwork outline (§connector)", () => {
  test("diagonal approach to a flower svgContent node — tip is on the artwork, not the box", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:760px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const flower =
        "M 50 5 Q 60 5 62 15 Q 72 10 78 18 Q 88 18 88 30 Q 96 38 90 48 Q 96 58 86 64 Q 86 76 74 74 Q 68 84 58 78 Q 50 88 42 78 Q 32 84 26 74 Q 14 76 14 64 Q 4 58 10 48 Q 4 38 12 30 Q 12 18 22 18 Q 28 10 38 15 Q 40 5 50 5 Z";
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${flower}" fill="#4051b5"/></svg>`;
      // Flower target upper-right; source lower-left → diagonal approach into the
      // bottom-left, where the bbox corner is empty (the flower doesn't reach it).
      const f = s.nodes.add(
        new sb.node({ id: "F", xPos: 320, yPos: 120, width: 150, height: 150, text: "", svgContent })
      );
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 420, width: 90, height: 60, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 500));
      a.v2.relationships.addAssociation(f.v2);
      await new Promise((r) => setTimeout(r, 500));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      const total = p.getTotalLength();
      const e = p.getPointAtLength(total);
      const back = p.getPointAtLength(Math.max(0, total - 6));
      const m = document.getElementById(
        (p.getAttribute("marker-end") || "").replace(/url\(#|\)/g, "")
      );
      const aw = m ? Number((m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/)[2]) : 0;
      const tx = e.x - back.x, ty = e.y - back.y;
      const tm = Math.hypot(tx, ty) || 1;
      const tip = { x: e.x + (tx / tm) * aw, y: e.y + (ty / tm) * aw };

      // Is the tip inside the flower artwork's fill?
      const pathEl = document.querySelector('#slateCanvas [data-node-id="F"] path') as any;
      let root = pathEl.ownerSVGElement;
      while (root.ownerSVGElement) root = root.ownerSVGElement;
      const rc = root.getScreenCTM();
      const sx = tip.x * rc.a + tip.y * rc.c + rc.e;
      const sy = tip.x * rc.b + tip.y * rc.d + rc.f;
      const inv = pathEl.getScreenCTM().inverse();
      const pt = root.createSVGPoint();
      pt.x = sx * inv.a + sy * inv.c + inv.e;
      pt.y = sx * inv.b + sy * inv.d + inv.f;
      const tipInFill = pathEl.isPointInFill(pt);

      const bo = f.v2.options;
      // Sanity: the tip is NOT floating in the far bbox corner.
      const distFromBboxCorner = Math.hypot(tip.x - bo.x, tip.y - (bo.y + bo.height));
      return { tipInFill, distFromBboxCorner: Math.round(distFromBboxCorner) };
    });

    // The arrow tip sits on the flower artwork, not the empty bounding-box corner.
    expect(res.tipInFill).toBe(true);
    expect(res.distFromBboxCorner).toBeGreaterThan(20);
  });
});
