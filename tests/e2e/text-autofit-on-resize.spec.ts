import { test, expect } from "@playwright/test";

// Miro text auto-fit must respond to the RESIZE HANDLE, not just programmatic
// setSize. During a handle drag, fitTextToNode measures transient mid-rewrap
// geometry and could leave the text unscaled/overflowing on a shrunk node. The
// resize-end listener now re-runs centerText on the settled DOM (deferred a frame),
// so the text ends up correctly shrunk to fit.
test.describe("text auto-fits when resized via the handle (§text)", () => {
  test("dragging the resize handle inward shrinks overflowing text to fit", async ({
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
        new sb.node({
          id: "N",
          xPos: 250,
          yPos: 180,
          width: 320,
          height: 180,
          text: "Hello Wonderful World",
        })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    const scaleOf = () =>
      page.evaluate(() => {
        const t = document.querySelector(
          '#slateCanvas [data-node-id="N"] text'
        );
        const m = (t?.getAttribute("transform") || "").match(
          /scale\(([\d.]+)\)/
        );
        return m ? Number(m[1]) : 1;
      });

    // Big node → text fits → no scaling.
    expect(await scaleOf()).toBeCloseTo(1, 1);

    // Select the node, grab its bottom-right resize handle.
    const center = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="N"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(center.x, center.y);
    await page.waitForTimeout(400);

    const rb = await page.evaluate(() => {
      const h = document.querySelector(".svg_select_handle_rb");
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    expect(rb).not.toBeNull();

    // Drag the handle well inward to shrink the node so the text overflows.
    await page.mouse.move(rb!.x, rb!.y);
    await page.mouse.down();
    await page.mouse.move(rb!.x - 220, rb!.y - 130, { steps: 16 });
    await page.mouse.up();
    await page.waitForTimeout(600); // let the resize-end rAF re-fit run

    const nodeSize = await page.evaluate(
      () => {
        const a = (window as any).__s.v2.nodes.one("N");
        return { w: Math.round(a.options.width), h: Math.round(a.options.height) };
      }
    );
    // Sanity: the handle drag actually shrank the node (else the test proves nothing).
    expect(nodeSize.w).toBeLessThan(260);

    const finalScale = await scaleOf();
    const fits = await page.evaluate(() => {
      const g = document.querySelector('#slateCanvas [data-node-id="N"]')!;
      const t = g.querySelector("text")!.getBoundingClientRect();
      const gr = g.getBoundingClientRect();
      return t.width <= gr.width + 6 && t.height <= gr.height + 6;
    });

    // Text shrank to fit the now-smaller node.
    expect(finalScale).toBeLessThan(0.95);
    expect(fits).toBe(true);
  });
});
