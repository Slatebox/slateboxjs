import { test, expect } from "@playwright/test";

// The arrowhead should always point at the target node's CENTER (Miro-style),
// even when the endpoint lands off the edge midpoint — the curve enters along the
// center→port line so the incoming tangent aims at the center.
test.describe("connector arrow points at node center (§connector)", () => {
  test("off-center endpoint: incoming tangent aims at the target center", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      // Source upper-left, big target lower-right → endpoint lands off-center.
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 60, yPos: 40, width: 90, height: 60, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 380, yPos: 350, width: 180, height: 110, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 500));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      const total = p.getTotalLength();
      const end = p.getPointAtLength(total);
      const back = p.getPointAtLength(total - 12);
      const tanx = end.x - back.x;
      const tany = end.y - back.y;
      const bo = b.v2.options;
      const cx = bo.x + bo.width / 2;
      const cy = bo.y + bo.height / 2;
      const toCx = cx - end.x;
      const toCy = cy - end.y;
      const dot =
        (tanx * toCx + tany * toCy) /
        ((Math.hypot(tanx, tany) || 1) * (Math.hypot(toCx, toCy) || 1));
      const angleDeg = Math.acos(Math.max(-1, Math.min(1, dot))) * (180 / Math.PI);
      // Endpoint is genuinely off the horizontal/vertical center line.
      const offCenter = Math.abs(end.x - cx) > 15 || Math.abs(end.y - cy) > 15;
      return { angleDeg: Math.round(angleDeg), offCenter };
    });

    expect(res.offCenter).toBe(true);
    // Arrow tangent aims at center (within a few degrees).
    expect(res.angleDeg).toBeLessThan(12);
  });
});
