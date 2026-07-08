import { test, expect } from "@playwright/test";

// Miro parity: arrow keys nudge the selected node by nudgeDistance; Shift+arrow moves
// by a LARGER step (4×) for coarse positioning. Both persist (the nudge broadcasts
// onNodesMove — verified live).
test.describe("arrow-key nudge with Shift = larger step (§keyboard)", () => {
  test("plain arrow nudges the base step; Shift+arrow nudges 4× further", async ({
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
      s.nodes.add(
        new sb.node({ id: "N", xPos: 300, yPos: 250, width: 120, height: 70, text: "N" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    const x = () =>
      page.evaluate(() =>
        Math.round((window as any).__s.v2.nodes.one("N").options.x)
      );

    // Select the node.
    const c = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="N"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(400);

    const x0 = await x();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(150);
    const x1 = await x();
    await page.keyboard.press("Shift+ArrowRight");
    await page.waitForTimeout(150);
    const x2 = await x();

    const plainStep = x1 - x0;
    const shiftStep = x2 - x1;

    // Plain arrow moved a positive step; Shift moved strictly further (4×).
    expect(plainStep).toBeGreaterThan(0);
    expect(shiftStep).toBe(plainStep * 4);
  });
});
