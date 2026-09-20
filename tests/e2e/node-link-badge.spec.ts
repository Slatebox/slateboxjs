import { test, expect } from "@playwright/test";

// Node link badge (Miro-style indicator): a node carrying a link renders a small
// "↗" badge; clicking it follows the link (Links.navigate → window.open). Wires
// the previously-dead navigate() and adds the missing visual indicator. The link
// target lives in the canonical NodeLinkOptions.data field.
test.describe("node link badge (§links)", () => {
  test("badge renders on a linked node, click navigates, unset removes it", async ({
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
      const n = s.nodes.add(new sb.node({ id: "LB", xPos: 120, yPos: 120, width: 160, height: 100, text: "L" }));
      await new Promise((r) => setTimeout(r, 200));

      const badgeSel = '#slateCanvas [data-node-id="LB"] .node-link-badge';
      const before = !!document.querySelector(badgeSel);

      // Set a link with the canonical .data field.
      n.v2.links.set({ show: true, type: "url", data: "https://example.com/x" });
      await new Promise((r) => setTimeout(r, 100));
      const badge = document.querySelector(badgeSel);
      const glyph = badge?.querySelector("text")?.textContent;

      // (Click-navigates is covered robustly by the real-mouse test below; this
      // test focuses on render / glyph / resize-tracking / unset.)

      // Badge follows a resize (it's anchored to the node width).
      const circleX = () => ((document.querySelector(badgeSel + " circle") as any)?.getBBox?.().x ?? 0);
      const badgeXBefore = circleX();
      n.v2.setSize(320, 100);
      await new Promise((r) => setTimeout(r, 50));
      const badgeXAfter = circleX();

      // Unset removes the badge.
      n.v2.links.unset();
      await new Promise((r) => setTimeout(r, 100));
      const afterUnset = !!document.querySelector(badgeSel);

      return { before, hasBadge: !!badge, glyph, afterUnset, badgeXBefore, badgeXAfter };
    });

    expect(res.before).toBe(false); // no badge before a link
    expect(res.hasBadge).toBe(true); // badge appears when linked
    expect(res.glyph).toBe("↗");
    expect(res.badgeXAfter).toBeGreaterThan(res.badgeXBefore + 100); // badge tracks the wider node
    expect(res.afterUnset).toBe(false); // badge removed on unset
  });

  test("whole-node click follows the link in read-only/view mode only", async ({
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
      const n = s.nodes.add(new sb.node({ id: "VL", xPos: 150, yPos: 120, width: 160, height: 100, text: "V" }));
      await new Promise((r) => setTimeout(r, 200));
      n.v2.links.set({ show: true, type: "url", data: "https://example.com/view" });

      const bodyClick = () => {
        const g = document.querySelector('#slateCanvas [data-node-id="VL"]') as SVGGraphicsElement;
        const r = g.getBoundingClientRect();
        // click the node's LEFT side (away from the top-right badge)
        const x = r.x + 20, y = r.y + r.height / 2;
        g.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y, bubbles: true }));
        g.dispatchEvent(new PointerEvent("pointerup", { clientX: x, clientY: y, bubbles: true }));
      };

      // Edit mode (isReadOnly false): body click selects, does NOT navigate.
      let openedEdit: string | null = null;
      const orig = window.open;
      (window as any).open = (u: string) => { openedEdit = u; return null; };
      bodyClick();
      await new Promise((r) => setTimeout(r, 50));

      // View mode (isReadOnly true): body click follows the link.
      s.v2.options.events = { isReadOnly: () => true };
      let openedView: string | null = null;
      (window as any).open = (u: string) => { openedView = u; return null; };
      bodyClick();
      await new Promise((r) => setTimeout(r, 50));
      window.open = orig;

      return { openedEdit, openedView };
    });

    expect(res.openedEdit).toBe(null); // edit-mode click selects, not navigate
    expect(res.openedView).toBe("https://example.com/view"); // view-mode click follows
  });

  // The tests above dispatch synthetic events. This drives a REAL page.mouse click
  // directly on the "↗" badge and asserts the link is followed (window.open) — the
  // exact interaction a person performs when they click the badge.
  test("a real click on the badge follows the link", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:600px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const n = s.nodes.add(
        new sb.node({ id: "LB", xPos: 140, yPos: 120, width: 180, height: 100, text: "L" })
      );
      await new Promise((r) => setTimeout(r, 250));
      n.v2.links.set({ show: true, type: "url", data: "https://example.com/real" });
      await new Promise((r) => setTimeout(r, 150));
      // Capture navigations through the real click pipeline.
      (window as any).__opened = [];
      (window as any).open = (url: string) => {
        (window as any).__opened.push(url);
        return null;
      };
    });

    const badge = page.locator('#slateCanvas [data-node-id="LB"] .node-link-badge');
    await expect(badge).toBeVisible();
    const box = await badge.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.waitForTimeout(150);

    const opened = await page.evaluate(() => (window as any).__opened);
    expect(opened).toContain("https://example.com/real");
  });
});
