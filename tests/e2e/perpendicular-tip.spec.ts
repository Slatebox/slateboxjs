import { test, expect } from "@playwright/test";

// The arrow tip must meet a node's edge at ~90° (perpendicular), regardless of
// where the source sits — a Miro hallmark. The curved connector bowed its control
// points along the RADIAL direction (center→port, i.e. toward the source), which
// only equals the edge normal at edge midpoints; on a rectangle the tip was off
// by up to ~45°. Now it bows along the true axis-aligned edge normal.
test.describe("connector perpendicular tip (§connector)", () => {
  test("arrow tip meets the node edge at ~90°", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const measure = async (dx: number, dy: number) =>
      page.evaluate(
        async ({ dx, dy }) => {
          const sb = (window as any).Slatebox;
          document.querySelectorAll("#slateCanvas").forEach((n) => n.remove());
          const div = document.createElement("div");
          div.id = "slateCanvas";
          div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
          document.body.appendChild(div);
          const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
          const A = s.nodes.add(new sb.node({ id: "A", xPos: 300, yPos: 260, width: 160, height: 90, text: "A" }));
          const B = s.nodes.add(new sb.node({ id: "B", xPos: 300 + dx, yPos: 260 + dy, width: 180, height: 110, text: "B" }));
          await new Promise((r) => setTimeout(r, 300));
          A.v2.relationships.addAssociation(B.v2);
          await new Promise((r) => setTimeout(r, 300));

          const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
          const t = p.getTotalLength();
          const bo = B.v2.options;
          const cc = { x: bo.x + bo.width / 2, y: bo.y + bo.height / 2 };
          const e0 = p.getPointAtLength(0), e1 = p.getPointAtLength(t);
          const atB0 = Math.hypot(e0.x - cc.x, e0.y - cc.y) < Math.hypot(e1.x - cc.x, e1.y - cc.y);
          const endB = atB0 ? e0 : e1;
          const near = atB0 ? p.getPointAtLength(6) : p.getPointAtLength(t - 6);
          const ang = (Math.atan2(endB.y - near.y, endB.x - near.x) * 180) / Math.PI;
          const nx = (endB.x - bo.x) / bo.width, ny = (endB.y - bo.y) / bo.height;
          // Pick the edge by the DOMINANT proximity (avoids the corner ambiguity).
          const dl = nx, dr = 1 - nx, dt = ny, db = 1 - ny;
          const m = Math.min(dl, dr, dt, db);
          const normalAng = m === dl ? 0 : m === dr ? 180 : m === dt ? 90 : -90;
          const off = Math.abs(((ang - normalAng + 540) % 360) - 180);
          return Math.round(off);
        },
        { dx, dy }
      );

    // Node to the right → tip perpendicular to the left edge.
    expect(await measure(360, 20)).toBeLessThan(15);
    // Node below → tip perpendicular to the top edge.
    expect(await measure(20, 340)).toBeLessThan(15);
    // Node to the left → tip perpendicular to the right edge.
    expect(await measure(-380, 10)).toBeLessThan(15);
  });
});
