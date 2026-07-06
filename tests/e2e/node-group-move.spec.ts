import { test, expect } from "@playwright/test";

// U21: dragging one node in a multi-selection only moved that node — the others
// stayed put. The node drag now captures the other selected nodes on dragstart
// and shifts them by the same delta on dragmove/dragend (group move).
test.describe("group move: dragging one selected node moves all (§U21)", () => {
  test("both selected nodes move by the same delta", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__s = s;
      s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 200, width: 120, height: 80, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 200, yPos: 380, width: 120, height: 80, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));
      s.v2.selectNodes([s.v2.nodes.one("A"), s.v2.nodes.one("B")]);
      await new Promise((r) => setTimeout(r, 200));
    });

    const before = await page.evaluate(() => {
      const s = (window as any).__s.v2;
      return { a: { ...s.nodes.one("A").options }, b: { ...s.nodes.one("B").options } };
    });
    const box = await page.evaluate(() => {
      const r = (document.querySelector('#slateCanvas [data-node-id="A"]') as SVGGraphicsElement).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Real-mouse drag node A.
    await page.mouse.move(box.x, box.y);
    await page.mouse.down();
    await page.waitForTimeout(60);
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(box.x + i * 15, box.y + i * 9, { steps: 2 });
      await page.waitForTimeout(20);
    }
    await page.mouse.up();
    await page.waitForTimeout(500);

    const res = await page.evaluate((before) => {
      const s = (window as any).__s.v2;
      const a = s.nodes.one("A").options, b = s.nodes.one("B").options;
      return {
        aDx: Math.round(a.x - before.a.x), aDy: Math.round(a.y - before.a.y),
        bDx: Math.round(b.x - before.b.x), bDy: Math.round(b.y - before.b.y),
      };
    }, before);

    expect(res.aDx).not.toBe(0); // A moved
    // B moved by the same delta as A.
    expect(Math.abs(res.bDx - res.aDx)).toBeLessThan(4);
    expect(Math.abs(res.bDy - res.aDy)).toBeLessThan(4);
  });
});
