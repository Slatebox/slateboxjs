import { test, expect } from "@playwright/test";

// PNG export must be sized to the CONTENT (fit-to-content SVG viewBox × scale), not the
// canvas's current pan/zoom viewport — else a scrolled/zoomed view renders a
// viewport-sized PNG with the diagram letterboxed/mis-scaled. exportPNG now reads the
// exported SVG's viewBox dimensions.
test.describe("PNG export is sized to content (§export)", () => {
  test("PNG dimensions match the content bbox × scale, regardless of the view", async ({
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
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 200, width: 120, height: 80, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 600, yPos: 450, width: 120, height: 80, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));

      const nodes = a.v2.slate.nodes.allNodes.map((n: any) => n.options);
      const cw =
        Math.max(...nodes.map((o: any) => o.x + o.width)) -
        Math.min(...nodes.map((o: any) => o.x)) +
        80; // + padding (40 each side)
      const ch =
        Math.max(...nodes.map((o: any) => o.y + o.height)) -
        Math.min(...nodes.map((o: any) => o.y)) +
        80;

      // Scroll the view away from the content.
      const c = a.v2.slate.canvas;
      const vb = c.viewbox();
      c.viewbox(vb.x + 3000, vb.y + 3000, vb.width, vb.height);
      await new Promise((r) => setTimeout(r, 150));

      const scale = 2;
      const png = await (window as any).Export.exportPNG(a.v2.slate, { scale });
      const dim = await new Promise<{ w: number; h: number } | null>((r) => {
        const im = new Image();
        im.onload = () => r({ w: im.width, h: im.height });
        im.onerror = () => r(null);
        im.src = png;
      });
      return {
        expectedW: Math.round(cw * scale),
        expectedH: Math.round(ch * scale),
        isPng: typeof png === "string" && png.startsWith("data:image/png"),
        len: png.length,
        dim,
      };
    });

    expect(res.isPng).toBe(true);
    expect(res.len).toBeGreaterThan(1000);
    expect(res.dim).not.toBeNull();
    // PNG sized to content × scale (± rounding), NOT the viewport.
    expect(Math.abs(res.dim!.w - res.expectedW)).toBeLessThan(12);
    expect(Math.abs(res.dim!.h - res.expectedH)).toBeLessThan(12);
  });
});
