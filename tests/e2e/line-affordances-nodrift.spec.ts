import { test, expect } from "@playwright/test";

// U2: the line cog is positioned at the connector's geometry when shown. A node
// move re-solves the connector, so leaving it up makes it DRIFT. It must clear on
// any node move (Miro hides connector UI during moves); the user re-clicks for a
// fresh, correctly-placed one. (The endpoint padlocks it once cleared too were
// retired by the owner on 2026-11-21; there are none to clear.)
test.describe("line affordances clear on node move (no drift) (§U2)", () => {
  test("moving a connected node clears the line cog, and no padlocks are shown", async ({
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
      // The line gear (the way to the endpoint locks) is drawn only for a host that
      // supplies a line menu, so this host supplies one.
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        { onLineMenuRequested: () => {} }
      ).init();
      (window as any).__slate = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 160, height: 100, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 620, yPos: 430, width: 160, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    // Click line → cog.
    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGraphicsElement;
      const r = p.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(200);
    const cogPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .line-tool-cog") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cogPt.x, cogPt.y);
    await page.waitForTimeout(250);

    const before = await page.evaluate(() => ({
      locks: document.querySelectorAll("#slateCanvas .endpoint-lock").length,
      bar: document.querySelectorAll("#slateCanvas .line-toolbar").length,
    }));
    expect(before.locks).toBe(0);
    expect(before.bar).toBe(1);

    // Move node B (programmatic — like a collab/peer move) and re-solve.
    await page.evaluate(() => {
      const b = (window as any).__slate.v2.nodes.one("B");
      b.options.x += 250;
      b.options.y -= 180;
      b.applyPositionAndRotation();
    });
    await page.waitForTimeout(250);

    const after = await page.evaluate(() => ({
      locks: document.querySelectorAll("#slateCanvas .endpoint-lock").length,
      bar: document.querySelectorAll("#slateCanvas .line-toolbar").length,
    }));
    expect(after.locks).toBe(0);
    expect(after.bar).toBe(0);
  });
});
