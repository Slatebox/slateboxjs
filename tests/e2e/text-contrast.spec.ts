import { test, expect } from "@playwright/test";

// Node text must stay readable when the background changes: an AUTO (black/white)
// font color flips to whichever contrasts with the new fill (white default text on
// a light fill was invisible). A CUSTOM font color is preserved. setColors runs
// whiteOrBlack; both windows compute the same value so it stays in sync.
test.describe("node text auto-contrast (§node)", () => {
  test("auto text color flips for contrast; custom color is preserved", async ({
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
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 160, height: 90, text: "Readable" }));
      await new Promise((r) => setTimeout(r, 300));

      // Default white text → light background should flip it to dark.
      A.v2.options.fontColor = "#ffffff";
      A.v2.setColors("#fafafa");
      const onLight = A.v2.options.fontColor;
      // Dark background → flip to white.
      A.v2.setColors("#111111");
      const onDark = A.v2.options.fontColor;
      // A CUSTOM font color is preserved across a background change.
      A.v2.options.fontColor = "#e5484d";
      A.v2.setColors("#fafafa");
      const custom = A.v2.options.fontColor;
      return { onLight, onDark, custom };
    });

    expect(res.onLight.toLowerCase()).toBe("#000000");
    expect(res.onDark.toLowerCase()).toBe("#ffffff");
    expect(res.custom.toLowerCase()).toBe("#e5484d");
  });
});
