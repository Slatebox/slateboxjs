import { test, expect } from "@playwright/test";

// The OUTLINE text effect used to paint a hardcoded #ff0000 red stroke — a placeholder
// that looked wrong on virtually any text. It now contrasts the element's fill so it
// reads as a clean halo: dark text → white outline, light text → black outline.
test.describe("outline effect uses a contrasting color (§effects)", () => {
  test("dark text gets a white outline, light text gets a black outline (never red)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const r = await page.evaluate(async () => {
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
      s.nodes.add(
        new sb.node({
          id: "A",
          xPos: 300,
          yPos: 250,
          width: 180,
          height: 110,
          text: "Outline",
          fontColor: "#333333",
        })
      );
      await new Promise((res) => setTimeout(res, 400));

      const a = s.v2.nodes.one("A");
      const te = () =>
        document.querySelector('#slateCanvas [data-node-id="A"] text');

      // Dark text → white outline.
      a.filters.apply("outline", "text");
      await new Promise((res) => setTimeout(res, 200));
      const darkOutline = (te()?.getAttribute("stroke") || "").toLowerCase();

      // Light text → black outline.
      a.filters.remove?.("outline", "text");
      a.options.fontColor = "#ffffff";
      a.applyTextStyle();
      await new Promise((res) => setTimeout(res, 200));
      a.filters.apply("outline", "text");
      await new Promise((res) => setTimeout(res, 200));
      const lightOutline = (te()?.getAttribute("stroke") || "").toLowerCase();

      return { darkOutline, lightOutline };
    });

    // Never the old red placeholder.
    expect(r.darkOutline).not.toBe("#ff0000");
    expect(r.lightOutline).not.toBe("#ff0000");
    // Contrasting halo.
    expect(r.darkOutline).toBe("#ffffff");
    expect(r.lightOutline).toBe("#000000");
  });
});
