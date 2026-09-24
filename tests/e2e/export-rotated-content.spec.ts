import { test, expect } from "@playwright/test";

// Export of ROTATED content, driven through the real rotation pipeline
// (setRotation → group transform), unlike export-rotated-node.spec.ts which
// assigns options.rotate directly. Two guarantees:
//  1. The PNG/SVG frame is computed from the RENDERED rotated extent — a
//     rotated custom shape must not clip in the raster.
//  2. The exported SVG actually CARRIES the rotation (group transform + the
//     visible artwork path). During the "dashed outline rotates, box doesn't"
//     bug the live DOM never received a rotation transform; these assertions
//     would have been empty then, instead of silently passing.

test.describe("export of rotated content", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("rotated diamond: PNG is sized to the RENDERED rotated extent", async ({
    page,
  }) => {
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
        new sb.node({ id: "RX", xPos: 300, yPos: 250, width: 200, height: 140, text: "DIA", shape: "diamond" })
      );
      await new Promise((r) => setTimeout(r, 500));

      const v2 = n.v2;
      // unrotated rendered extent (screen px, zoom=1 → canvas units)
      const rectBefore = v2.svgGroup.node.getBoundingClientRect();

      v2.setRotation(45);
      await new Promise((r) => setTimeout(r, 400));

      const rectAfter = v2.svgGroup.node.getBoundingClientRect();
      const grewW = rectAfter.width - rectBefore.width;
      const grewH = rectAfter.height - rectBefore.height;

      const realSlate = s.v2 || s;
      const png = await (window as any).Export.exportPNG(realSlate, { scale: 2 });
      const dim = await new Promise<{ w: number; h: number } | null>((r) => {
        const im = new Image();
        im.onload = () => r({ w: im.width, h: im.height });
        im.onerror = () => r(null);
        im.src = png;
      });
      const svg = (window as any).Export.exportSVG(realSlate);
      const m = svg.match(/viewBox="([\d.\-]+) ([\d.\-]+) ([\d.\-]+) ([\d.\-]+)"/);
      const vb = m ? { w: +m[3], h: +m[4] } : null;
      return { grewW, grewH, dim, vb, rectW: rectAfter.width, rectH: rectAfter.height };
    });
    // Sanity: rotation actually changed the rendered extent (anti-vacuous).
    expect(res.grewW).toBeGreaterThan(20);
    expect(res.grewH).toBeGreaterThan(20);
    // Export frame must cover the rendered rotated extent (+padding).
    expect(res.vb).not.toBeNull();
    expect(res.vb!.w).toBeGreaterThanOrEqual(res.rectW + 40);
    expect(res.vb!.h).toBeGreaterThanOrEqual(res.rectH + 40);
    // PNG raster sized from the export frame (content-sized), 2x scale.
    expect(res.dim).not.toBeNull();
    expect(Math.abs(res.dim!.w - res.vb!.w * 2)).toBeLessThanOrEqual(4);
    expect(Math.abs(res.dim!.h - res.vb!.h * 2)).toBeLessThanOrEqual(4);
  });

  test("exported SVG carries the rotation and the visible artwork path", async ({
    page,
  }) => {
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
        new sb.node({ id: "RY", xPos: 320, yPos: 260, width: 160, height: 160, text: "D", shape: "diamond" })
      );
      await new Promise((r) => setTimeout(r, 500));
      n.v2.setRotation(40);
      await new Promise((r) => setTimeout(r, 400));

      const svg = (window as any).Export.exportSVG(s.v2 || s);
      // The exported markup must contain the diamond artwork AND a rotate()
      // transform somewhere near it (group-level rotation carried over).
      const hasDiamondPath = /data-shape-path/.test(svg);
      const hasRotate = /rotate\(\s*[2-9][0-9.]*|rotate\(\s*4[0-9.]/.test(svg);
      const liveTr = document
        .querySelector('#slateCanvas [data-node-id="RY"]')!
        .getAttribute("transform");
      return { hasDiamondPath, hasRotate, liveTr };
    });
    expect(res.liveTr).toContain("rotate"); // live canvas rotated
    expect(res.hasDiamondPath).toBe(true); // artwork present in export
    expect(res.hasRotate).toBe(true); // rotation present in export
  });
});
