import { test, expect } from "@playwright/test";

// Regression guard for L1a: dragging a connector's endpoint handle onto a
// different node re-endpoints the association (remove old + add new), which the
// model does via addAssociation/removeAssociation so it also broadcasts +
// persists (verified live two-window). Here we assert the local model rebuild
// through a real handle drag.
test.describe("connector endpoint drag → reattach to node (§L1a)", () => {
  test("dragging the target handle onto another node re-endpoints the association", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const ids = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__slate = s;
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 120, yPos: 120, width: 150, height: 90, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 120, yPos: 420, width: 150, height: 90, text: "C1" }));
      s.nodes.add(new sb.node({ id: "c2", xPos: 620, yPos: 420, width: 150, height: 90, text: "C2" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 400));
      return {
        before: n1.v2.relationships.associations.map((a: any) => a.childId),
      };
    });
    expect(ids.before).toEqual(["c1"]);

    // Locate the target handle and node c2's center
    const coords = await page.evaluate(() => {
      const th = document.querySelector(
        "#slateCanvas .connector-handle-target"
      ) as SVGGraphicsElement;
      const hr = th.getBoundingClientRect();
      const g = document.querySelector(
        '#slateCanvas [data-node-id="c2"]'
      ) as SVGGraphicsElement;
      const r = g.getBoundingClientRect();
      return {
        handle: { x: hr.x + hr.width / 2, y: hr.y + hr.height / 2 },
        c2: { x: r.x + r.width / 2, y: r.y + r.height / 2 },
      };
    });

    // Real drag of the endpoint handle onto c2
    await page.mouse.move(coords.handle.x, coords.handle.y);
    await page.mouse.down();
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(
        coords.handle.x + ((coords.c2.x - coords.handle.x) * i) / 10,
        coords.handle.y + ((coords.c2.y - coords.handle.y) * i) / 10,
        { steps: 2 }
      );
      await page.waitForTimeout(30);
    }
    await page.mouse.move(coords.c2.x, coords.c2.y, { steps: 3 });
    await page.waitForTimeout(100);
    await page.mouse.up();
    await page.waitForTimeout(500);

    const after = await page.evaluate(() =>
      (window as any).__slate.v2.nodes
        .one("p1")
        .relationships.associations.map((a: any) => a.childId)
    );

    // Re-endpointed from c1 → c2
    expect(after).toEqual(["c2"]);
  });
});
