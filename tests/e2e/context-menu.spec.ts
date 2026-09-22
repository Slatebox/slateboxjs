import { test, expect } from "@playwright/test";

// Right-click context menu (ContextMenu): right-clicking a node opens an HTML menu
// with Bring to front / Send to back / Duplicate / Delete. Each item triggers a
// node op that broadcasts (so it persists + syncs). The menu surfaces actions that
// otherwise only had keyboard shortcuts — Miro parity.
test.describe("node right-click context menu (§contextmenu)", () => {
  test("opens with 4 items; Duplicate, Delete, Bring-to-front work", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      // Two clearly SEPARATE nodes so a z-order reorder is unambiguous.
      s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 120, height: 80, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 500, yPos: 150, width: 120, height: 80, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));

      const rightClick = (id: string) => {
        const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`) as SVGGraphicsElement;
        const r = g.getBoundingClientRect();
        g.dispatchEvent(new MouseEvent("contextmenu", { clientX: r.x + r.width / 2, clientY: r.y + r.height / 2, bubbles: true, cancelable: true }));
      };
      const clickItem = (label: string) => {
        const rows = Array.from(document.querySelectorAll(".sb-context-menu > div"));
        const row = rows.find((r) => new RegExp(label, "i").test(r.textContent || "")) as HTMLElement | undefined;
        row?.click();
      };
      const order = () =>
        Array.from(document.querySelectorAll("#slateCanvas [data-node-id]")).map((g) => g.getAttribute("data-node-id"));

      // 1) Menu opens with the 4 items.
      rightClick("A");
      await new Promise((r) => setTimeout(r, 50));
      const menu = document.querySelector(".sb-context-menu");
      const items = menu ? Array.from(menu.children).map((c) => c.textContent) : [];

      // 2) Bring A to front (A started first/behind; should move last/on-top).
      const orderBefore = order();
      clickItem("bring to front");
      await new Promise((r) => setTimeout(r, 50));
      const orderAfterFront = order();

      // 3) Duplicate B.
      const countBefore = s.v2.nodes.allNodes.length;
      rightClick("B");
      await new Promise((r) => setTimeout(r, 50));
      clickItem("duplicate");
      await new Promise((r) => setTimeout(r, 100));
      const countAfterDup = s.v2.nodes.allNodes.length;

      // 4) Delete A.
      rightClick("A");
      await new Promise((r) => setTimeout(r, 50));
      clickItem("delete");
      await new Promise((r) => setTimeout(r, 100));
      const aGone = !s.v2.nodes.one("A");

      return { items, orderBefore, orderAfterFront, countBefore, countAfterDup, aGone };
    });

    expect(res.items).toEqual(["Bring to front", "Send to back", "Duplicate", "Delete"]);
    expect(res.orderAfterFront[res.orderAfterFront.length - 1]).toBe("A"); // A brought to front
    expect(res.countAfterDup).toBe(res.countBefore + 1); // Duplicate added one
    expect(res.aGone).toBe(true); // Delete removed A
  });

  // The test above dispatches a synthetic `contextmenu` event and clicks the row
  // programmatically. This one uses a REAL right-click (page.mouse button:right)
  // and a REAL click on the menu row — the exact interaction a person performs.
  test("a real right-click opens the menu; a real click on Delete removes the node", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 180, width: 130, height: 80, text: "A" }));
      await new Promise((r) => setTimeout(r, 300));
    });

    const c = await page.evaluate(() => {
      const g = document.querySelector(
        '#slateCanvas [data-node-id="A"]'
      ) as SVGGraphicsElement;
      const r = g.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Real right-click opens the HTML menu.
    await page.mouse.click(c.x, c.y, { button: "right" });
    const menu = page.locator(".sb-context-menu");
    await expect(menu).toBeVisible();
    await expect(menu.locator("> div")).toHaveCount(4);

    // Real click on the Delete row removes the node.
    await menu.locator("> div", { hasText: /delete/i }).click();
    await page.waitForTimeout(150);
    const aGone = await page.evaluate(() => !(window as any).__s.nodes.one("A"));
    expect(aGone).toBe(true);
    // Menu closes after an action.
    await expect(menu).toHaveCount(0);
  });
});
