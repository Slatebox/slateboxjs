import { test, expect } from "@playwright/test";

// M1/M2: clicking a connector line shows a cog affordance (no stuck selection),
// and clicking the cog asks the host to open the line-properties pane. Clicking
// away clears the cog. Guards the fix where the old vendored toggleSelection
// left the canvas stuck and the pane-open handler (on a nonexistent con.line)
// never fired.
test.describe("line cog → open properties pane (§M1/M2)", () => {
  test("line click shows a cog; cog click requests the line menu; away clears it", async ({
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
      (window as any).__lineMenu = 0;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {
          onLineMenuRequested: () => {
            (window as any).__lineMenu++;
          },
        }
      ).init();
      (window as any).__slate = s;
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 150, yPos: 150, width: 160, height: 100, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 620, yPos: 420, width: 160, height: 100, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGraphicsElement;
      const r = p.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Click the line → cog appears
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(300);
    const cogCount = await page.evaluate(
      () => document.querySelectorAll("#slateCanvas .line-cog").length
    );
    expect(cogCount).toBe(1);

    // Click the cog → host line-menu requested
    const cogPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .line-cog") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cogPt.x, cogPt.y);
    await page.waitForTimeout(300);
    const menuCount = await page.evaluate(() => (window as any).__lineMenu);
    expect(menuCount).toBe(1);

    // Click empty canvas → cog cleared (not stuck)
    await page.mouse.click(900, 120);
    await page.waitForTimeout(300);
    const cogAfter = await page.evaluate(
      () => document.querySelectorAll("#slateCanvas .line-cog").length
    );
    expect(cogAfter).toBe(0);

    // And the canvas isn't stuck — a node is still selectable afterward
    const nodeSelectable = await page.evaluate(async () => {
      const s = (window as any).__slate;
      s.v2.selectNodes([s.v2.nodes.one("c1")]);
      await new Promise((r) => setTimeout(r, 100));
      return s.v2.getSelectedNodes().length === 1;
    });
    expect(nodeSelectable).toBe(true);
  });
});
