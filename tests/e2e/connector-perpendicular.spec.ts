import { test, expect } from "@playwright/test";

// Endpoint direction model (user preference): a RELATIVE endpoint aims the arrow
// at the node CENTER; a PINNED endpoint (fixed anchor) meets its edge at ~90°
// (perpendicular). The connector is a curve (has control points) in both cases.
test.describe("connector direction: relative→center, pinned→perpendicular (§curve)", () => {
  test("relative arrow points at center; a fixed anchor meets the edge at 90°", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1100px;height:760px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 200, width: 150, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 700, yPos: 520, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));

      const pathEl = () => document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
      // cos angle between the incoming tangent at the target and the INWARD normal
      // of the edge the endpoint sits on (1 == meets the edge exactly at 90°).
      const perpToEdge = () => {
        const p = pathEl();
        const total = p.getTotalLength();
        const end = p.getPointAtLength(total);
        const near = p.getPointAtLength(Math.max(0, total - 12));
        const inx = end.x - near.x, iny = end.y - near.y;
        const im = Math.hypot(inx, iny) || 1;
        const bo = s.v2.nodes.one("B").options;
        const nx = (end.x - bo.x) / bo.width, ny = (end.y - bo.y) / bo.height;
        const dl = nx, dr = 1 - nx, dt = ny, db = 1 - ny;
        const m = Math.min(dl, dr, dt, db);
        // inward normal of the nearest edge
        let normX = 0, normY = 0;
        if (m === dl) normX = 1;
        else if (m === dr) normX = -1;
        else if (m === dt) normY = 1;
        else normY = -1;
        return (inx / im) * normX + (iny / im) * normY;
      };
      // curvature proxy: max deviation of the path midpoint from the straight
      // chord between endpoints.
      const bend = () => {
        const p = pathEl();
        const total = p.getTotalLength();
        const s0 = p.getPointAtLength(0);
        const s1 = p.getPointAtLength(total);
        const mid = p.getPointAtLength(total / 2);
        // distance of mid from the chord s0→s1
        const vx = s1.x - s0.x, vy = s1.y - s0.y;
        const L = Math.hypot(vx, vy) || 1;
        return Math.abs((mid.x - s0.x) * vy - (mid.y - s0.y) * vx) / L;
      };

      // Default (RELATIVE) endpoint aims at the node CENTER (user preference #7),
      // NOT perpendicular to the edge. Measure alignment with the center direction.
      const perpToCenter = () => {
        const p = pathEl();
        const total = p.getTotalLength();
        const end = p.getPointAtLength(total);
        const near = p.getPointAtLength(Math.max(0, total - 12));
        const inx = end.x - near.x, iny = end.y - near.y;
        const im = Math.hypot(inx, iny) || 1;
        const bo = s.v2.nodes.one("B").options;
        const cx = bo.x + bo.width / 2, cy = bo.y + bo.height / 2;
        const tx = cx - end.x, ty = cy - end.y;
        const tm = Math.hypot(tx, ty) || 1;
        return (inx / im) * (tx / tm) + (iny / im) * (ty / tm);
      };
      const dotDefault = perpToCenter();

      // Pin the target endpoint to the TOP edge → the arrow must now meet the TOP
      // edge perpendicular (pointing straight down into B), and the curve bends.
      s.v2.nodes.one("A").relationships.applyLineProperty(
        s.v2.nodes.one("A").relationships.associations[0].id,
        "targetAnchor",
        { x: 0.5, y: 0 } // top-center of B
      );
      await new Promise((r) => setTimeout(r, 200));
      const dotAnchored = perpToEdge();
      // The path is a cubic curve (has control points) — not a plain straight line.
      const isCurve = ((pathEl().getAttribute("d") || "").includes("C"));

      return { dotDefault, dotAnchored, isCurve };
    });

    // Default auto-flow (RELATIVE): arrow points at the node CENTER (#7).
    expect(res.dotDefault).toBeGreaterThan(0.9);
    // Pinned to the top edge, it meets that edge PERPENDICULAR (points down into B).
    expect(res.dotAnchored).toBeGreaterThan(0.85);
    // ...and it's a curved connector, not a straight bezier.
    expect(res.isCurve).toBe(true);
  });
});
