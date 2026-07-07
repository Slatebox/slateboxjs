import { test, expect } from "@playwright/test";

// Custom vector shapes (diamond/star/…) must resize via the select handles. Their
// backgroundRect is a nested <svg>, which svg.resize.js can't resize (its
// point()/bbox() map to the child viewBox space), so a transparent proxy <rect>
// is the select/resize target and setSize() syncs the nested svg. Regression guard
// for the "custom shapes won't resize by dragging a corner handle" bug.
test.describe("custom shape resize via handle (§resize)", () => {
  test("dragging a corner handle grows a diamond; proxy stays in sync", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    // Build a diamond in a fixed-position canvas.
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:640px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "DIA", xPos: 220, yPos: 180, width: 140, height: 140, text: "D", shape: "diamond" })
      );
      await new Promise((r) => setTimeout(r, 500));
    });

    // The custom shape must have a transparent proxy rect as its resize target.
    const proxy = await page.evaluate(() => {
      const d = (window as any).__s.v2.nodes.one("DIA");
      return {
        hasProxy: !!d.resizeTarget,
        isRect: d.resizeTarget?.node?.tagName?.toLowerCase() === "rect",
        proxyW: Math.round(d.resizeTarget?.width?.() || 0),
      };
    });
    expect(proxy.hasProxy).toBe(true);
    expect(proxy.isRect).toBe(true);
    expect(proxy.proxyW).toBe(140);

    // Select the diamond, then drag its bottom-right handle outward.
    const c = await page.evaluate(() => {
      const g = document.querySelector('#slateCanvas [data-node-id="DIA"]')!;
      const r = g.getBoundingClientRect();
      return { cx: Math.round(r.x + r.width / 2), cy: Math.round(r.y + r.height / 2) };
    });
    await page.mouse.click(c.cx, c.cy);
    await page.waitForTimeout(400);
    const rb = await page.evaluate(() => {
      const h = document.querySelector(".svg_select_handle_rb")!;
      const r = h.getBoundingClientRect();
      return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) };
    });
    await page.mouse.move(rb.x, rb.y);
    await page.mouse.down();
    await page.waitForTimeout(150);
    await page.mouse.move(rb.x + 50, rb.y + 50, { steps: 10 });
    await page.mouse.move(rb.x + 100, rb.y + 100, { steps: 10 });
    await page.waitForTimeout(150);
    await page.mouse.up();
    await page.waitForTimeout(400);

    const after = await page.evaluate(() => {
      const d = (window as any).__s.v2.nodes.one("DIA");
      return {
        w: Math.round(d.options.width),
        proxyW: Math.round(d.resizeTarget?.width?.() || 0),
        pathOk: !!document
          .querySelector('#slateCanvas [data-node-id="DIA"] path[data-shape-path]')
          ?.getAttribute("d"),
      };
    });

    // Diamond grew substantially, proxy tracks it, shape path intact.
    expect(after.w).toBeGreaterThan(180);
    expect(Math.abs(after.proxyW - after.w)).toBeLessThan(3);
    expect(after.pathOk).toBe(true);
  });
});
