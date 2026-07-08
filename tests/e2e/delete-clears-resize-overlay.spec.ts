import { test, expect } from "@playwright/test";

// No rogue UI: deleting a SELECTED node must tear down its svg.select resize/rotate
// overlay (selection box + handles). Those handles live in a separate overlay and
// select(false) needs the element to still exist — so slate.removeNode disables the
// resize/rotate on a selected node BEFORE removing it, or the whole selection box is
// left floating with nothing selected.
test.describe("deleting a node clears its resize/rotate overlay (§selection)", () => {
  test("no visible svg_select elements remain after deleting a selected node", async ({
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
        new sb.node({ id: "A", xPos: 300, yPos: 250, width: 150, height: 100, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    const visibleSelectEls = () =>
      page.evaluate(
        () =>
          [...document.querySelectorAll("[class*=svg_select]")].filter((e) => {
            const r = e.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }).length
      );

    // Select the node — the resize/rotate overlay appears.
    const c = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(400);
    expect(await visibleSelectEls()).toBeGreaterThan(0);

    // Delete the node.
    await page.keyboard.press("Delete");
    await page.waitForTimeout(500);

    const after = await page.evaluate(() => ({
      nodeGone: !(window as any).__s.v2.nodes.one("A"),
      overlay: [...document.querySelectorAll("[class*=svg_select]")].filter(
        (e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        }
      ).length,
    }));
    expect(after.nodeGone).toBe(true);
    // No rogue selection box / handles.
    expect(after.overlay).toBe(0);
  });
});
