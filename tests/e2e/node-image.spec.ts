import { test, expect } from "@playwright/test";

// U7: onNodeImageChanged was a stub (console.log) — picking an image did nothing.
// It now sets an image pattern fill on the node (and clears back to the solid
// color when the image is removed).
test.describe("node image fill applies + clears (§U7)", () => {
  test("setting an image fills the node with a pattern; clearing restores color", async ({
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
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "N", xPos: 300, yPos: 250, width: 160, height: 100, text: "N", backgroundColor: "#123456" }));
      await new Promise((r) => setTimeout(r, 300));

      const shape = () =>
        document.querySelector(
          '#slateCanvas [data-node-id="N"] path[data-shape-path]'
        ) as SVGElement;
      const fillBefore = shape().getAttribute("fill");

      const img =
        "data:image/svg+xml;base64," +
        btoa('<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="orange"/></svg>');
      s.v2.invoker.onNodeImageChanged({ data: { id: "N", img, w: 40, h: 40 } });
      await new Promise((r) => setTimeout(r, 300));
      const fillAfter = shape().getAttribute("fill");
      const optImage = !!s.v2.nodes.one("N").options.image;

      s.v2.invoker.onNodeImageChanged({ data: { id: "N", img: null } });
      await new Promise((r) => setTimeout(r, 200));
      const fillCleared = shape().getAttribute("fill");
      const optCleared = s.v2.nodes.one("N").options.image;

      return { fillBefore, fillAfter, optImage, fillCleared, optCleared };
    });

    expect(res.fillBefore).not.toContain("url(");
    // Image applied → fill references an SVG pattern.
    expect(res.fillAfter).toContain("url(");
    expect(res.optImage).toBe(true);
    // Cleared → back to a solid color, no pattern reference, option removed.
    expect(res.fillCleared).not.toContain("url(");
    expect(res.optCleared).toBeFalsy();
  });
});
