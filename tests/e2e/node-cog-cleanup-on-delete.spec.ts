import { test, expect } from "@playwright/test";

// No rogue UI: the node selection toolbar (.node-cog — delete/connect/gear pill) is
// rendered in a GLOBAL container, not the node's svgGroup. Node.remove() removed the
// group but not the cog, so deleting a selected node left a stale toolbar floating for
// a node that no longer existed. Node.remove() now calls hideNodeCog().
test.describe("node cog is removed when the node is deleted (§selection)", () => {
  test("deleting a selected node leaves no stale .node-cog", async ({ page }) => {
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
        new sb.node({ id: "A", xPos: 300, yPos: 250, width: 140, height: 90, text: "A" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    // Select the node — the cog appears.
    const c = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(c.x, c.y);
    await page.waitForTimeout(400);
    const cogsBefore = await page.evaluate(
      () => document.querySelectorAll(".node-cog").length
    );
    expect(cogsBefore).toBe(1);

    // Delete the node.
    await page.keyboard.press("Delete");
    await page.waitForTimeout(500);

    const after = await page.evaluate(() => ({
      nodeGone: !(window as any).__s.v2.nodes.one("A"),
      cogs: document.querySelectorAll(".node-cog").length,
    }));
    expect(after.nodeGone).toBe(true);
    // No stale cog left behind.
    expect(after.cogs).toBe(0);
  });
});
