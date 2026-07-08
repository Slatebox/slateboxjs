import { test, expect } from "@playwright/test";

// Text auto-fit used the full bounding-box width, so text in a TAPERING shape (diamond,
// triangle, star) spilled past the angled edges — e.g. "Approve the request?" overflowed
// a diamond's left/right points. wrapTextToWidth + fitTextToNode now apply a shape inset
// (diamond 0.6, triangle 0.55, star 0.5, ellipse 0.82) so text wraps/shrinks to the
// inscribed area. Verified by the rendered (transform-inclusive) text vs shape fit.
test.describe("text fits inside tapering shapes (§text)", () => {
  test("diamond text stays within the diamond (rendered fit <= 1)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      s.nodes.add(
        new sb.node({
          id: "A",
          xPos: 300,
          yPos: 250,
          width: 160,
          height: 140,
          text: "Approve the request?",
        })
      );
      await new Promise((res) => setTimeout(res, 300));
      const a = s.v2.nodes.one("A");
      a.setShape("diamond");
      await new Promise((res) => setTimeout(res, 300));

      const g = document.querySelector('#slateCanvas [data-node-id="A"]');
      const te = g?.querySelector("text") as any;
      const shape = g?.querySelector("path,polygon,rect,ellipse") as any;
      const tr = te.getBoundingClientRect();
      const sr = shape.getBoundingClientRect();
      // Rendered text half-extents as a fraction of the diamond half-extents; the
      // diamond edge constraint is |x|/hw + |y|/hh <= 1 at the text's corner.
      const relW = tr.width / 2 / (sr.width / 2);
      const relH = tr.height / 2 / (sr.height / 2);
      return { fit: relW + relH, textW: tr.width, shapeW: sr.width };
    });

    // Text corner lies inside the diamond (small tolerance for glyph descenders).
    expect(r.fit).toBeLessThanOrEqual(1.05);
    // And it's not wider than the diamond itself.
    expect(r.textW).toBeLessThanOrEqual(r.shapeW);
  });
});
