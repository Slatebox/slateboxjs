import { test, expect } from "@playwright/test";

// User request ("match Miro"): text that doesn't fit a node used to spill outside
// the shape. Miro shrinks the text to fit the shape (node stays fixed). Node.centerText
// now calls fitTextToNode(), which scales the rendered text down to fit — preserving
// the stored fontSize, not scaling text that already fits, and un-shrinking when the
// node grows.
test.describe("text auto-fits inside the node (Miro shape behavior) (§text)", () => {
  test("overflowing text shrinks to fit; fitting text is untouched; grow un-shrinks", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const n = s.nodes.add(
        new sb.node({ id: "N", xPos: 200, yPos: 200, width: 200, height: 100, text: "Hi" })
      );
      await new Promise((r) => setTimeout(r, 300));

      const textEl = () =>
        document.querySelector('#slateCanvas [data-node-id="N"] text') as any;
      const scaleOf = () => {
        const tf = textEl()?.getAttribute("transform") || "";
        const m = tf.match(/scale\(([\d.]+)\)/);
        return m ? Number(m[1]) : 1;
      };
      const fitsInside = () => {
        const t = textEl().getBoundingClientRect();
        const g = document
          .querySelector('#slateCanvas [data-node-id="N"]')!
          .getBoundingClientRect();
        return t.width <= g.width + 6 && t.height <= g.height + 6;
      };

      // 1) Small text that fits → no scaling.
      n.v2.setText("Hi");
      n.v2.options.fontSize = 20;
      n.v2.textElement.font({ size: 20 });
      n.v2.centerText();
      await new Promise((r) => setTimeout(r, 100));
      const fitCase = { scale: scaleOf(), fits: fitsInside() };

      // 2) Big text that overflows → shrinks to fit.
      n.v2.setText("Hello World");
      n.v2.options.fontSize = 60;
      n.v2.textElement.font({ size: 60 });
      n.v2.centerText();
      await new Promise((r) => setTimeout(r, 100));
      const overflowCase = {
        scale: scaleOf(),
        fits: fitsInside(),
        fontSizeKept: n.v2.options.fontSize,
      };

      // 3) Grow the node → text un-shrinks back to full size.
      n.v2.setSize(600, 400);
      n.v2.centerText();
      await new Promise((r) => setTimeout(r, 100));
      const grownCase = { scale: scaleOf() };

      return { fitCase, overflowCase, grownCase };
    });

    // Fitting text: not scaled, inside the node.
    expect(res.fitCase.scale).toBeCloseTo(1, 1);
    expect(res.fitCase.fits).toBe(true);
    // Overflowing text: scaled DOWN, now fits, fontSize preserved.
    expect(res.overflowCase.scale).toBeLessThan(0.95);
    expect(res.overflowCase.fits).toBe(true);
    expect(res.overflowCase.fontSizeKept).toBe(60);
    // Growing the node restores full size.
    expect(res.grownCase.scale).toBeCloseTo(1, 1);
  });
});
