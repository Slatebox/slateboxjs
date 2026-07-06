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
});
