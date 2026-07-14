import { test, expect } from "@playwright/test";

// Core Miro interaction: DRAG from a node's connection handle (plug) to another
// node creates a connection. Guards the full gesture — reveal handles, pointerdown
// on the plug, move past the threshold to hand off to startConnectDrag, drop on the
// target, and confirm an association is created (no rogue phantom line).
test.describe("create connection by dragging from a plug (§connector)", () => {
  test("drag A's right plug onto B creates an A→B association", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const ids = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      // Fixed at the top-left so screen coords == client coords (no viewport clip).
      div.style.cssText =
        "width:640px;height:420px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 180, width: 110, height: 70, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 380, yPos: 180, width: 110, height: 70, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      return { aId: a.v2.id };
    });

    const assocCount = () =>
      page.evaluate(() => {
        const a = (window as any).__s.v2.nodes.one("A");
        return a ? a.relationships.assocMap.size : -1;
      });
    expect(await assocCount()).toBe(0);

    // Select A to reveal its connection handles, then locate the right plug.
    const aBox = await page.evaluate(() => {
      const g = document.querySelector('#slateCanvas [data-node-id="A"]')!;
      const r = g.getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, right: r.right };
    });
    await page.mouse.move(aBox.cx, aBox.cy);
    await page.mouse.click(aBox.cx, aBox.cy);
    await page.waitForTimeout(300);
    await page.mouse.move(aBox.right - 4, aBox.cy);
    await page.waitForTimeout(400);

    const plug = await page.evaluate(() => {
      const hs = [
        ...document.querySelectorAll(".connection-handle-right, .connection-handle"),
      ].filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 4 && r.width < 32;
      });
      if (!hs.length) return null;
      const r = hs[0].getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    expect(plug).not.toBeNull();

    const bCenter = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="B"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Drag: plug → past threshold → B center → drop.
    await page.mouse.move(plug!.x, plug!.y);
    await page.mouse.down();
    await page.waitForTimeout(120);
    await page.mouse.move(plug!.x + 14, plug!.y, { steps: 3 });
    await page.waitForTimeout(120);
    await page.mouse.move(bCenter.x, bCenter.y, { steps: 12 });
    await page.waitForTimeout(200);
    await page.mouse.up();
    await page.waitForTimeout(500);

    // An association to B now exists, and no stray phantom line was left behind.
    const result = await page.evaluate(() => {
      const a = (window as any).__s.v2.nodes.one("A");
      const childIds = a
        ? Array.from(a.relationships.assocMap.values()).map((x: any) => x.childId)
        : [];
      const connectors = document.querySelectorAll(
        '#slateCanvas path[connectortype="default"]'
      ).length;
      const strays = document.querySelectorAll(".connect-drag-line").length;
      return { childIds, connectors, strays };
    });
    expect(result.childIds).toContain("B");
    expect(result.connectors).toBe(1);
    expect(result.strays).toBe(0);
  });
});
