import { test, expect } from "@playwright/test";

// Miro parity: double-clicking EMPTY canvas drops a new node at the cursor. Double-
// clicking a NODE still edits its text (the isCanvasClick guard keeps them separate).
// The node is created via slate.addNode, so it persists/syncs like any other node.
test.describe("double-click empty canvas creates a node (§canvas)", () => {
  test("dbl-click empty → node at cursor; dbl-click node → edit, not create", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      // One existing node in a corner so the empty-canvas dbl-click lands on nothing.
      s.nodes.add(
        new sb.node({ id: "A", xPos: 40, yPos: 40, width: 90, height: 56, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 300));
    });

    const count = () =>
      page.evaluate(() => (window as any).__s.v2.nodes.allNodes.length);
    expect(await count()).toBe(1);

    // Double-click empty canvas (center-right, away from node A).
    const spot = { x: 500, y: 380 };
    await page.mouse.dblclick(spot.x, spot.y);
    await page.waitForTimeout(400);

    const afterCreate = await page.evaluate((spot) => {
      const s = (window as any).__s.v2;
      const nodes = s.nodes.allNodes;
      const last = nodes[nodes.length - 1];
      const g = document.querySelector(
        `#slateCanvas [data-node-id="${last.id}"]`
      ) as Element;
      const r = g.getBoundingClientRect();
      const dist = Math.hypot(
        r.x + r.width / 2 - spot.x,
        r.y + r.height / 2 - spot.y
      );
      return { count: nodes.length, dist, id: last.id };
    }, spot);

    // A new node was created near the cursor.
    expect(afterCreate.count).toBe(2);
    expect(afterCreate.dist).toBeLessThan(60);

    // Double-click the NEW node → edits text (does NOT create a third node).
    const nodeCenter = await page.evaluate((id) => {
      const r = document
        .querySelector(`#slateCanvas [data-node-id="${id}"]`)!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, afterCreate.id);
    await page.mouse.dblclick(nodeCenter.x, nodeCenter.y);
    await page.waitForTimeout(300);

    const afterNodeDbl = await page.evaluate(() => {
      const editing = !!document.querySelector(
        '[contenteditable="true"], textarea'
      );
      return { editing, count: (window as any).__s.v2.nodes.allNodes.length };
    });
    expect(afterNodeDbl.count).toBe(2); // no extra node
    expect(afterNodeDbl.editing).toBe(true); // edits instead
  });
});
