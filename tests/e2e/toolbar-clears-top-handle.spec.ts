import { test, expect } from "@playwright/test";

// The node selection toolbar (delete/connect/cog pill) must sit ABOVE the top
// connection-handle "plug" dot, not cover it — otherwise the top create-relationship
// dot is unclickable on hover.
test.describe("toolbar clears top connection handle (§node)", () => {
  test("node toolbar does not overlap the top plug handle", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const A = s.nodes.add(
        new sb.node({ id: "A", xPos: 250, yPos: 250, width: 130, height: 80, text: "N" })
      );
      await new Promise((r) => setTimeout(r, 300));
      // Select → toolbar (node cog) + connection handles appear.
      s.v2.selectNodes([A.v2]);
      A.v2.showConnectionHandles?.();
      A.v2.showNodeCog?.();
      await new Promise((r) => setTimeout(r, 300));

      const bar = document.querySelector(".node-cog, .node-toolbar");
      const topH = document.querySelector(".connection-handle-top");
      if (!bar || !topH) return { found: false };
      const b = bar.getBoundingClientRect();
      const h = topH.getBoundingClientRect();
      const overlap = !(
        b.bottom < h.top || b.top > h.bottom || b.right < h.left || b.left > h.right
      );
      return { found: true, overlap, gap: Math.round(h.top - b.bottom) };
    });

    expect(res.found).toBe(true);
    // Toolbar sits above the top handle with a positive gap (no overlap).
    expect(res.overlap).toBe(false);
    expect(res.gap).toBeGreaterThan(0);
  });
});
