import { test, expect } from "@playwright/test";

// Miro-style node affordances: a node shows a "move" cursor (it's draggable) and
// a subtle drop-shadow lift on hover. Previously the cursor was the default arrow
// (no affordance) and hover gave no feedback.
test.describe("node hover affordance (§node)", () => {
  test("node shows move cursor + hover lift", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const center = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 260, yPos: 180, width: 180, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));
      const g = document.querySelector('#slateCanvas [data-node-id="N"]') as SVGGElement;
      const r = g.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Move cursor is set on the group (draggable affordance).
    const cursor = await page.evaluate(
      () => getComputedStyle(document.querySelector('#slateCanvas [data-node-id="N"]')!).cursor
    );
    expect(cursor).toBe("move");

    // Hover → subtle drop-shadow lift.
    await page.mouse.move(center.x, center.y);
    await page.waitForTimeout(250);
    const filter = await page.evaluate(
      () => getComputedStyle(document.querySelector('#slateCanvas [data-node-id="N"]')!).filter
    );
    expect(filter).toContain("drop-shadow");
  });
});
