import { test, expect } from "@playwright/test";

// U8: the slate background handlers (color / gradient / image) only updated
// options and never painted the container — changing the canvas background did
// nothing. They now call applyContainerStyle(); an image supersedes a gradient.
test.describe("slate background color/gradient/image apply (§U8)", () => {
  test("background changes paint the container element", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      await new Promise((r) => setTimeout(r, 200));
      const el = document.getElementById("slateCanvas") as HTMLElement;
      const inv = s.v2.invoker;

      inv.onSlateBackgroundColorChanged({ data: { color: "#ff8800" } });
      const solid = el.style.backgroundColor;

      inv.onSlateBackgroundColorChanged({
        data: { color: "#000", asGradient: true, gradientType: "linear", gradientColors: ["#ff0000", "#0000ff"] },
      });
      const gradient = el.style.backgroundImage;

      const img =
        "data:image/svg+xml;base64," +
        btoa('<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="green"/></svg>');
      inv.onSlateBackgroundImageChanged({ data: { bg: { url: img, size: "cover" } } });
      const image = el.style.backgroundImage;

      return { solid, gradient, image };
    });

    expect(res.solid).toContain("rgb(255, 136, 0)");
    expect(res.gradient).toContain("gradient");
    // Image supersedes the gradient (was the bug: gradient kept winning).
    expect(res.image).toContain("url(");
    expect(res.image).not.toContain("gradient");
  });
});
