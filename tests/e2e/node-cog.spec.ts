import { test, expect } from "@playwright/test";

// M1/G1 (node): selecting a node shows a context toolbar (delete + plug + cog)
// centered above the node. The cog opens the node properties pane
// (onMenuRequested); delete removes the node. Toolbar clears on deselect.
test.describe("node context toolbar (§M1/G1)", () => {
  test("single-selected node shows a toolbar; cog requests the node menu", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      (window as any).__menu = 0;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {
          onMenuRequested: () => {
            (window as any).__menu++;
          },
        }
      ).init();
      (window as any).__slate = s;
      const n = s.nodes.add(
        new sb.node({ id: "p1", xPos: 300, yPos: 250, width: 160, height: 100, text: "P" })
      );
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([n.v2]);
      await new Promise((r) => setTimeout(r, 200));
    });

    // Toolbar appears on single selection, with delete + plug + cog buttons
    const counts = await page.evaluate(() => ({
      bar: document.querySelectorAll("#slateCanvas .node-toolbar").length,
      del: document.querySelectorAll("#slateCanvas .node-tool-delete").length,
      plug: document.querySelectorAll("#slateCanvas .node-tool-plug").length,
      cog: document.querySelectorAll("#slateCanvas .node-tool-cog").length,
    }));
    expect(counts.bar).toBe(1);
    expect(counts.del).toBe(1);
    expect(counts.plug).toBe(1);
    expect(counts.cog).toBe(1);

    // Click the cog button → host node-menu requested
    const cogPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .node-tool-cog") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cogPt.x, cogPt.y);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => (window as any).__menu)).toBe(1);

    // Deselect → toolbar cleared
    await page.evaluate(() => (window as any).__slate.v2.clearSelection());
    await page.waitForTimeout(150);
    expect(
      await page.evaluate(
        () => document.querySelectorAll("#slateCanvas .node-toolbar").length
      )
    ).toBe(0);
  });

  test("delete button removes the node", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__slate = s;
      const n = s.nodes.add(new sb.node({ id: "d1", xPos: 300, yPos: 250, width: 160, height: 100, text: "D" }));
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([n.v2]);
      await new Promise((r) => setTimeout(r, 200));
    });
    const delPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .node-tool-delete") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(delPt.x, delPt.y);
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => !!(window as any).__slate.v2.nodes.one("d1"))).toBe(false);
  });

  test("no cog on multi-selection", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const cogCount = await page.evaluate(async () => {
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
      const a = s.nodes.add(new sb.node({ id: "a", xPos: 200, yPos: 200, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "b", xPos: 500, yPos: 400, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([a.v2, b.v2]);
      await new Promise((r) => setTimeout(r, 200));
      return document.querySelectorAll("#slateCanvas .node-cog").length;
    });
    expect(cogCount).toBe(0);
  });
});
