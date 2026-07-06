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

      // Clicking the badge follows the link.
      let opened: string | null = null;
      const orig = window.open;
      (window as any).open = (url: string) => { opened = url; return null; };
      (badge as HTMLElement)?.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
      await new Promise((r) => setTimeout(r, 50));
      window.open = orig;

      // Unset removes the badge.
      n.v2.links.unset();
      await new Promise((r) => setTimeout(r, 100));
      const afterUnset = !!document.querySelector(badgeSel);

      return { before, hasBadge: !!badge, glyph, opened, afterUnset };
    });

    expect(res.before).toBe(false); // no badge before a link
    expect(res.hasBadge).toBe(true); // badge appears when linked
    expect(res.glyph).toBe("↗");
    expect(res.opened).toBe("https://example.com/x"); // click navigates
    expect(res.afterUnset).toBe(false); // badge removed on unset
  });
});
