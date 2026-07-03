import { test, expect } from "@playwright/test";

// Perpendicular-port curve: the connector leaves the source and enters the
// target along each node's center line, so the arrowhead meets the edge at ~90°
// pointing at the node center — and it curves (not a straight/plain bezier) when
// a fixed anchor pulls a port off the center line. Adapts as nodes move.
test.describe("connector perpendicular approach (§curve)", () => {
  test("arrow points at the target center; a fixed anchor bends the curve", async ({
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
      // cos angle between the incoming tangent at the target and the direction
      // from the endpoint to the target center (1 == points exactly at center).
      const pointsAtCenter = () => {
        const p = pathEl();
        const total = p.getTotalLength();
        const end = p.getPointAtLength(total);
        const near = p.getPointAtLength(Math.max(0, total - 12));
        const inx = end.x - near.x, iny = end.y - near.y;
        const im = Math.hypot(inx, iny) || 1;
        const bo = s.v2.nodes.one("B").options;
        const tx = bo.x + bo.width / 2 - end.x, ty = bo.y + bo.height / 2 - end.y;
        const tm = Math.hypot(tx, ty) || 1;
        return (inx / im) * (tx / tm) + (iny / im) * (ty / tm);
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

      const dotDefault = pointsAtCenter();

      // Pin the target endpoint to the TOP edge (off the center line) → the curve
      // must bend to still enter perpendicular / point at center.
      s.v2.nodes.one("A").relationships.applyLineProperty(
        s.v2.nodes.one("A").relationships.associations[0].id,
        "targetAnchor",
        { x: 0.5, y: 0 } // top-center of B
      );
      await new Promise((r) => setTimeout(r, 200));
      const dotAnchored = pointsAtCenter();
      const bendAnchored = bend();

      return { dotDefault, dotAnchored, bendAnchored };
    });

    // Default auto-flow: arrow points at the target center.
    expect(res.dotDefault).toBeGreaterThan(0.9);
    // With a top-edge anchor the arrow still approaches pointing at center...
    expect(res.dotAnchored).toBeGreaterThan(0.8);
    // ...and the path visibly bends (not a straight line).
    expect(res.bendAnchored).toBeGreaterThan(8);
  });
});
