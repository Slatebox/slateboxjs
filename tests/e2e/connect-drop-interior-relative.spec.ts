import { test, expect } from "@playwright/test";

// User report: dropping a connect-drag on a node's INTERIOR/center pinned the arrow to an
// arbitrary bbox edge (e.g. bottom), routing it awkwardly and obscuring the head. Fix:
// only pin an absolute anchor when the drop is DELIBERATELY near an edge (<0.25); an
// interior drop uses relative auto-flow so the arrow attaches at the natural source-facing
// edge (head visible). Also: nodeUnder now sees THROUGH connection handles to the node.
test.describe("connect-drag interior drop attaches at the source-facing edge (§connectors)", () => {
  test("dropping on a node's center connects relatively (no pinned anchor)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 250, width: 120, height: 70, text: "A" })
      );
      s.nodes.add(
        new sb.node({ id: "B", xPos: 560, yPos: 240, width: 150, height: 100, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    // Select A, grab its right plug.
    const ac = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, right: r.right };
    });
    await page.mouse.click(ac.cx, ac.cy);
    await page.waitForTimeout(400);
    const handle = await page.evaluate((right) => {
      const dots = [...document.querySelectorAll("circle")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 6 && r.width < 28;
        })
        .map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
      return (
        dots.filter((h) => h.x > right - 30).sort((a, b) => b.x - a.x)[0] ||
        dots[0] ||
        null
      );
    }, ac.right);
    expect(handle).not.toBeNull();

    // Drop on B's CENTER.
    const bC = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="B"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.move(handle!.x, handle!.y);
    await page.mouse.down();
    await page.mouse.move(bC.x, bC.y, { steps: 12 });
    await page.mouse.up();
    await page.waitForTimeout(500);

    const r = await page.evaluate(() => {
      const a = (window as any).__s.v2.nodes.one("A");
      const as = a.relationships.associations[0];
      return { connected: !!as, childId: as?.childId, targetAnchor: as?.targetAnchor ?? null };
    });
    expect(r.connected).toBe(true);
    expect(r.childId).toBe("B");
    // Interior drop → relative (no pinned anchor), so it flows to the source-facing edge.
    expect(r.targetAnchor).toBeNull();
  });
});
