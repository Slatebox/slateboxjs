import { test, expect } from "@playwright/test";

// Miro-style: the connection plug-circles appear when you HOVER a node (not only
// when it's selected), so you can drag-to-connect without selecting first. A hide
// debounce bridges the gap between the node edge and the offset circles; a
// selected node keeps them pinned.
test.describe("plug-circle hover reveal (§node)", () => {
  test("plug-circles reveal on node hover and hide on leave", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const center = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 300, yPos: 200, width: 180, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 300));
      const g = document.querySelector('#slateCanvas [data-node-id="N"]') as SVGGElement;
      const r = g.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, left: r.x, top: r.y };
    });

    const plugsShown = () =>
      page.evaluate(
        () =>
          Array.from(document.querySelectorAll("#slateCanvas .connection-handle")).filter(
            (h) => {
              const c = h.closest("g");
              return c && getComputedStyle(c).display !== "none";
            }
          ).length
      );

    // Park the pointer away → plugs hidden.
    await page.mouse.move(center.left - 150, center.top);
    await page.waitForTimeout(400);
    expect(await plugsShown()).toBe(0);

    // Hover the node → 4 plugs appear (no selection).
    await page.mouse.move(center.x, center.y);
    await page.waitForTimeout(400);
    expect(await plugsShown()).toBe(4);

    // Leave → plugs hide (after the debounce).
    await page.mouse.move(center.left - 200, center.top - 150);
    await page.waitForTimeout(500);
    expect(await plugsShown()).toBe(0);
  });
});
