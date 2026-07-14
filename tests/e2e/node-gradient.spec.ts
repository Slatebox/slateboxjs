import { test, expect } from "@playwright/test";

// slatebox.com stores gradient fills as a dash-separated "colorA-colorB" string.
// setColors/createBackground passed that straight to SVG fill, which is invalid →
// the node rendered black. Now a dash-separated fill becomes an SVG linearGradient.
// (Matters for the drop-in: real v1 slates carry gradient node fills.)
test.describe("node gradient fill (§node)", () => {
  test("a 'colorA-colorB' background renders as a linear gradient", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();

      // (1) via a runtime color change.
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 100, yPos: 100, width: 140, height: 80, text: "A" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.setColors("#ff0000-#0000ff");
      const aEl = (A.v2.contentPath ?? A.v2.backgroundRect).node;
      const aFillIsGradient = (aEl.getAttribute("fill") || "").includes("url(");

      // (2) a node CREATED with a gradient fill (the v1-data / initial-load path).
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 100, width: 140, height: 80, text: "B", backgroundColor: "#00ff00-#ffff00" }));
      await new Promise((r) => setTimeout(r, 300));
      const bEl = (B.v2.contentPath ?? B.v2.backgroundRect).node;
      const bFillIsGradient = (bEl.getAttribute("fill") || "").includes("url(");

      const gradientDefs = document.querySelectorAll("#slateCanvas linearGradient").length;
      return { aFillIsGradient, bFillIsGradient, gradientDefs };
    });

    expect(res.aFillIsGradient).toBe(true);
    expect(res.bFillIsGradient).toBe(true);
    expect(res.gradientDefs).toBeGreaterThanOrEqual(2);
  });
});
