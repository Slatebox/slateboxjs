import { test, expect } from "@playwright/test";

// Long node text must WRAP within the node's width (like Miro), not render as a
// single line spilling far outside the shape. createText/setText now word-wrap to
// the node's inner width (SVG.js renders one tspan per line) and centerText shifts
// the multi-line block up to stay vertically centered.
test.describe("node text wrapping (§node)", () => {
  test("long text wraps to multiple lines that fit the node width", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:700px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 175, height: 100, text: "short" }));
      await new Promise((r) => setTimeout(r, 300));

      A.v2.setText(
        "This is a much longer piece of text that should wrap nicely inside the node instead of overflowing the shape"
      );
      await new Promise((r) => setTimeout(r, 200));

      const te = A.v2.textElement.node;
      const lines = te.querySelectorAll("tspan").length;
      const tb = te.getBBox();
      return { lines, textWidth: Math.round(tb.width), nodeWidth: A.v2.options.width };
    });

    // Wrapped to multiple lines, and each line fits within the node width.
    expect(res.lines).toBeGreaterThan(1);
    expect(res.textWidth).toBeLessThanOrEqual(res.nodeWidth);
  });

  test("short text stays a single line (no regression)", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const lines = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:500px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 175, height: 100, text: "Hello" }));
      await new Promise((r) => setTimeout(r, 300));
      return A.v2.textElement.node.querySelectorAll("tspan").length;
    });
    expect(lines).toBeLessThanOrEqual(1);
  });
});
