import { test, expect } from "@playwright/test";

// User bug: "drop-to-pin an endpoint on a node, then drag that node — the connector
// must FOLLOW." A pinned (absolute-anchor) endpoint tracks its normalized anchor as
// the node moves. Regression guard: pin the target at a known anchor, move the node,
// assert the connector endpoint tracks the anchor to the node's new position.
test.describe("pinned endpoint follows the node on move (§connector)", () => {
  test("target pinned at {1,0.3} tracks the node when it moves", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 80, yPos: 260, width: 90, height: 60, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 420, yPos: 220, width: 160, height: 130, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));

      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      // Pin the target at the RIGHT edge, upper third.
      const anchor = { x: 1, y: 0.3 };
      a.v2.relationships.applyLineProperty(assoc.id, "targetAnchor", anchor);
      assoc.connector?.updateConnection?.(`${a.v2.id}->${assoc.childId}`, {});
      await new Promise((r) => setTimeout(r, 300));

      const p = () =>
        document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      // Arrow TIP = path end + tangent*arrowWidth (path end is the arrowhead base).
      const tip = () => {
        const path = p();
        const total = path.getTotalLength();
        const e = path.getPointAtLength(total);
        const back = path.getPointAtLength(Math.max(0, total - 6));
        const m = document.getElementById(
          (path.getAttribute("marker-end") || "").replace(/url\(#|\)/g, "")
        );
        const aw = m
          ? Number((m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/)[2])
          : 0;
        const tx = e.x - back.x, ty = e.y - back.y;
        const tm = Math.hypot(tx, ty) || 1;
        return { x: e.x + (tx / tm) * aw, y: e.y + (ty / tm) * aw };
      };
      const expectedTip = () => {
        const o = b.v2.options;
        return { x: o.x + anchor.x * o.width, y: o.y + anchor.y * o.height };
      };

      const tipBefore = tip();
      const expBefore = expectedTip();
      const errBefore = Math.hypot(tipBefore.x - expBefore.x, tipBefore.y - expBefore.y);

      // Move B and re-solve (the real per-frame path: move + fire transform).
      b.v2.options.x = 560;
      b.v2.options.y = 340;
      b.v2.applyPositionAndRotation();
      assoc.connector?.updateConnection?.(`${a.v2.id}->${assoc.childId}`, {});
      await new Promise((r) => setTimeout(r, 300));

      const tipAfter = tip();
      const expAfter = expectedTip();
      const errAfter = Math.hypot(tipAfter.x - expAfter.x, tipAfter.y - expAfter.y);
      const moved = Math.hypot(tipAfter.x - tipBefore.x, tipAfter.y - tipBefore.y);

      return { errBefore, errAfter, moved };
    });

    // Pinned exactly on the anchor before and after the move.
    expect(res.errBefore).toBeLessThan(8);
    expect(res.errAfter).toBeLessThan(8);
    // And the endpoint actually tracked the node (didn't stay put).
    expect(res.moved).toBeGreaterThan(80);
  });
});
