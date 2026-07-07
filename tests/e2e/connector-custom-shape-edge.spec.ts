import { test, expect } from "@playwright/test";

// A connector to a custom vector shape (star/triangle/etc.) must attach to the
// shape's ACTUAL outline, not its bounding box — otherwise the line ends in the
// empty space between the shape's arms. The outline attach relies on a correct
// path-local → root-user coordinate transform (walk to the OUTERMOST svg, not the
// nested shape svg which ownerSVGElement returns).
test.describe("connector attaches to custom shape outline (§connector)", () => {
  test("star: connector endpoint is inset onto the outline, not the bbox gap", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const src = s.nodes.add(
        new sb.node({ id: "SRC", xPos: 60, yPos: 200, width: 90, height: 60, text: "S" })
      );
      const star = s.nodes.add(
        new sb.node({ id: "STAR", xPos: 380, yPos: 170, width: 140, height: 140, text: "", shape: "star" })
      );
      await new Promise((r) => setTimeout(r, 400));
      src.v2.relationships.addAssociation(star.v2);
      await new Promise((r) => setTimeout(r, 500));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      // The path END is the arrowhead base (line is trimmed back by the arrow
      // length); the arrow TIP — the actual attach point on the outline — is one
      // arrow-length further along the tangent.
      const total = p.getTotalLength();
      const pe = p.getPointAtLength(total);
      const back = p.getPointAtLength(Math.max(0, total - 6));
      const url = p.getAttribute("marker-end") || "";
      const m = document.getElementById(url.replace(/url\(#|\)/g, ""));
      const aw = m ? Number((m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/)[2]) : 0;
      const tx = pe.x - back.x, ty = pe.y - back.y;
      const tm = Math.hypot(tx, ty) || 1;
      const end = { x: pe.x + (tx / tm) * aw, y: pe.y + (ty / tm) * aw };
      const bo = star.v2.options;
      // The source is to the LEFT, so a bbox attach would land at bbox-left,
      // center-y (the empty gap between the star's two left arms). The real
      // outline is inset from that.
      const atBboxLeftGap =
        Math.abs(end.x - bo.x) < 4 && Math.abs(end.y - (bo.y + bo.height / 2)) < 8;
      return { endX: Math.round(end.x), bboxLeft: bo.x, atBboxLeftGap };
    });

    // Endpoint must NOT be at the exact bbox-left/center empty gap; it's inset
    // onto the star's real outline.
    expect(res.atBboxLeftGap).toBe(false);
    expect(res.endX).toBeGreaterThan(res.bboxLeft + 5);
  });
});
