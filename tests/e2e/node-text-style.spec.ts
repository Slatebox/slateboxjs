import { test, expect } from "@playwright/test";

// U14: the text pane's font controls (size / color / family / alignment) were
// inert — onNodeTextChanged set options AFTER setText and never re-rendered the
// text element. It now updates options first, then applyTextStyle() re-applies
// font + alignment to the <text>.
test.describe("node text font/alignment apply (§U14)", () => {
  test("font size, color, family, and alignment render", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "N", xPos: 250, yPos: 180, width: 220, height: 120, text: "Hello" }));
      await new Promise((r) => setTimeout(r, 300));
      const inv = s.v2.invoker;
      const txt = () => document.querySelector('#slateCanvas [data-node-id="N"] text') as SVGTextElement;

      const xCenter = txt().getAttribute("x");
      inv.onNodeTextChanged({ data: { id: "N", text: "Hello", fontSize: 28, fontColor: "#ff0000", fontFamily: "Georgia" } });
      await new Promise((r) => setTimeout(r, 100));
      const font = {
        size: txt().getAttribute("font-size"),
        fill: txt().getAttribute("fill"),
        family: txt().getAttribute("font-family"),
      };
      inv.onNodeTextChanged({ data: { id: "N", textXAlign: "left" } });
      await new Promise((r) => setTimeout(r, 100));
      const xLeft = txt().getAttribute("x");

      return { font, xCenter, xLeft };
    });

    expect(res.font.size).toBe("28");
    expect(res.font.fill).toBe("#ff0000");
    expect(res.font.family).toContain("Georgia");
    // Left-align shifts the text x from the centered position.
    expect(res.xLeft).not.toBe(res.xCenter);
    expect(Number(res.xLeft)).toBeLessThan(Number(res.xCenter));
  });
});
