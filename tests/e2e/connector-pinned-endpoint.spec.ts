import { test, expect } from "@playwright/test";

// Endpoint behavior (user-chosen "drop-to-pin"): a RELATIVE endpoint points at the
// node center (#7); a PINNED endpoint (absolute anchor, dropped at a spot) meets
// the edge at ~90° at the pin point (edge normal), not at the center — and stays
// pinned there as the node moves.
test.describe("pinned endpoint meets edge at 90° (§connector)", () => {
  test("pinned off-midpoint anchor: arrow aligns to edge normal, not center", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:760px;height:620px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 60, yPos: 420, width: 90, height: 60, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 420, yPos: 120, width: 190, height: 140, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      // Pin the target at the RIGHT edge, upper (x=1, y=0.2) — off the midpoint.
      a.v2.relationships.applyLineProperty(assoc.id, "targetAnchor", { x: 1, y: 0.2 });
      if (assoc.connector?.updateConnection)
        assoc.connector.updateConnection(`${a.v2.id}->${assoc.childId}`, {});
      await new Promise((r) => setTimeout(r, 400));

      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      const total = p.getTotalLength();
      const end = p.getPointAtLength(total);
      const back = p.getPointAtLength(total - 8);
      const tanx = end.x - back.x;
      const tany = end.y - back.y;
      const bo = b.v2.options;
      // Right-edge inward normal = (-1, 0).
      const nDot = (tanx * -1 + tany * 0) / (Math.hypot(tanx, tany) || 1);
      const angleToNormal = Math.acos(Math.max(-1, Math.min(1, nDot))) * (180 / Math.PI);
      const cx = bo.x + bo.width / 2;
      const cy = bo.y + bo.height / 2;
      const cDot =
        (tanx * (cx - end.x) + tany * (cy - end.y)) /
        ((Math.hypot(tanx, tany) || 1) * (Math.hypot(cx - end.x, cy - end.y) || 1));
      const angleToCenter = Math.acos(Math.max(-1, Math.min(1, cDot))) * (180 / Math.PI);
      const pinnedAtRightEdge = Math.abs(end.x - (bo.x + bo.width)) < 4;
      return {
        angleToNormal: Math.round(angleToNormal),
        angleToCenter: Math.round(angleToCenter),
        pinnedAtRightEdge,
      };
    });

    // Pinned exactly on the right edge.
    expect(res.pinnedAtRightEdge).toBe(true);
    // Arrow aligns to the edge normal, clearly more than to the center.
    expect(res.angleToNormal).toBeLessThan(res.angleToCenter - 10);
  });
});
