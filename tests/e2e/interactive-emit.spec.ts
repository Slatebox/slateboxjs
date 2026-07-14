import { test, expect } from "@playwright/test";

// §F of docs/drop-in-contract.md: interactive resize/rotate must broadcast a
// single v1 package (onNodeResized / onNodeRotated) at the END of the drag,
// not per-move.
test.describe("interactive resize/rotate emission (§F)", () => {
  test("dragging a corner handle emits one onNodeResized at release", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      // Fixed overlay so handle coordinates stay inside the viewport
      // (test.html's #app occupies the first 100vh)
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);

      const pkgs: any[] = [];
      (window as any).__pkgs = pkgs;
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        { onSlateChanged: (pkg: any) => pkgs.push(pkg) }
      ).init();
      (window as any).__slate = s;
      const n = s.nodes.add(
        new sb.node({
          id: "ir1",
          xPos: 300,
          yPos: 250,
          width: 150,
          height: 100,
          text: "resize me",
        })
      );
      await new Promise((r) => setTimeout(r, 500));
      s.v2.selectNodes([n.v2]);
      await new Promise((r) => setTimeout(r, 400));
    });

    // Find the bottom-right resize handle
    const handle = await page.evaluate(() => {
      const handles = Array.from(
        document.querySelectorAll(
          "#slateCanvas .svg_select_handle_rb, #slateCanvas .svg_select_handle"
        )
      ) as SVGGraphicsElement[];
      // Pick the handle furthest to the bottom-right
      let best: DOMRect | null = null;
      for (const h of handles) {
        const r = h.getBoundingClientRect();
        if (!best || r.x + r.y > best.x + best.y) best = r;
      }
      return best
        ? { x: best.x + best.width / 2, y: best.y + best.height / 2 }
        : null;
    });
    expect(handle).not.toBeNull();

    // Drag the handle 60px right/down
    await page.mouse.move(handle!.x, handle!.y);
    await page.mouse.down();
    for (let i = 1; i <= 6; i++) {
      await page.mouse.move(handle!.x + i * 10, handle!.y + i * 10);
      await page.waitForTimeout(30);
    }

    // No package should have been emitted mid-drag
    const midDrag = await page.evaluate(() =>
      (window as any).__pkgs.filter((p: any) => p.type === "onNodeResized")
        .length
    );

    await page.mouse.up();
    await page.waitForTimeout(300);

    const result = await page.evaluate(() => {
      const pkgs = (window as any).__pkgs;
      const resized = pkgs.filter((p: any) => p.type === "onNodeResized");
      return {
        resizedCount: resized.length,
        pkg: resized[0],
        width: (window as any).__slate.nodes.one("ir1")?.v2.options.width,
      };
    });

    expect(midDrag).toBe(0);
    expect(result.resizedCount).toBe(1);
    expect(result.pkg.data.id).toBe("ir1");
    expect(result.pkg.data.width).toBeGreaterThan(150);
    expect(result.width).toBeGreaterThan(150);
  });
});
