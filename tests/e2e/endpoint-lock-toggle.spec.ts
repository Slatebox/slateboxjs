import { test, expect } from "@playwright/test";

// The on-canvas padlocks (Q3) were retired by the owner on 2026-11-21. Each end of
// a selected line now has one handle that shows and switches its state: a hollow
// circle follows the note, a filled square is pinned to a spot on its edge.
// Clicking a handle does not move the end; pressing Enter on it switches it.
test.describe("on-canvas end handles replace the padlocks", () => {
  test("the pill's gear opens the host pane; no padlocks; a handle switches follow / pinned", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      (window as any).__pane = 0;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        { onLineMenuRequested: () => ((window as any).__pane += 1) }
      ).init();
      (window as any).__slate = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 160, height: 100, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 640, yPos: 430, width: 160, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
      const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!);
      return { x: m.x, y: m.y };
    });
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(250);
    const cogPt = await page.evaluate(() => {
      const r = (document.querySelector("#slateCanvas .line-tool-cog") as SVGGraphicsElement).getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cogPt.x, cogPt.y);
    await page.waitForTimeout(250);
    expect(await page.evaluate(() => (window as any).__pane)).toBe(1);
    await expect(page.locator("#slateCanvas .endpoint-lock")).toHaveCount(0);

    const source = page.locator("#slateCanvas .connector-handle-source");
    const glyph = page.locator('#slateCanvas .connector-handle-glyph[data-end="source"]');
    await expect(glyph).toHaveAttribute("data-state", "follow");
    const anchor = () =>
      page.evaluate(() => (window as any).__slate.v2.nodes.one("A").relationships.associations[0].sourceAnchor ?? null);
    expect(await anchor()).toBeNull();

    await source.focus();
    await page.keyboard.press("Enter");
    await expect(glyph).toHaveAttribute("data-state", "pinned");
    expect(await anchor()).not.toBeNull();

    await page.keyboard.press("Enter");
    await expect(glyph).toHaveAttribute("data-state", "follow");
    expect(await anchor()).toBeNull();
  });
});
