import { test, expect } from "@playwright/test";

// Miro parity: dragging a connector from a node's plug handle and dropping on EMPTY
// canvas creates a NEW node at the drop point, connected from the source — the core
// fast-mind-map-growth gesture. (Dropping on an existing node connects to it;
// dropping back on the source is a no-op.)
test.describe("connect-drag to empty canvas creates a connected node (§canvas)", () => {
  test("drag from a plug to empty space → new connected node at the drop point", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
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
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({ id: "Root", xPos: 180, yPos: 250, width: 120, height: 70, text: "Root" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });

    const state = () =>
      page.evaluate(() => {
        const s = (window as any).__s.v2;
        return {
          nodes: s.nodes.allNodes.length,
          conns: document.querySelectorAll(
            '#slateCanvas path[connectortype="default"]'
          ).length,
        };
      });

    expect(await state()).toEqual({ nodes: 1, conns: 0 });

    // Select Root to reveal its plug handles.
    const rc = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="Root"]')!
        .getBoundingClientRect();
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2, right: r.right };
    });
    await page.mouse.click(rc.cx, rc.cy);
    await page.waitForTimeout(400);

    const handle = await page.evaluate((right) => {
      const dots = [...document.querySelectorAll("circle")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 6 && r.width < 28;
        })
        .map((e) => {
          const r = e.getBoundingClientRect();
          return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });
      // the plug nearest the node's right edge
      return (
        dots.filter((h) => h.x > right - 30).sort((a, b) => b.x - a.x)[0] ||
        dots.sort((a, b) => b.x - a.x)[0] ||
        null
      );
    }, rc.right);
    expect(handle).not.toBeNull();

    // Drag from the plug to empty canvas (well right of Root).
    const drop = { x: rc.right + 280, y: rc.cy + 40 };
    await page.mouse.move(handle!.x, handle!.y);
    await page.mouse.down();
    await page.mouse.move((handle!.x + drop.x) / 2, (handle!.y + drop.y) / 2, {
      steps: 8,
    });
    await page.mouse.move(drop.x, drop.y, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(900);

    const after = await page.evaluate((drop) => {
      const s = (window as any).__s.v2;
      const newNode = s.nodes.allNodes.find((n: any) => n.id !== "Root");
      const root = s.nodes.one("Root");
      let connected = false;
      if (root?.relationships?.assocMap)
        for (const as of root.relationships.assocMap.values())
          if (newNode && as.childId === newNode.id) connected = true;
      let nearDrop = false;
      if (newNode) {
        const r = document
          .querySelector(`#slateCanvas [data-node-id="${newNode.id}"]`)!
          .getBoundingClientRect();
        nearDrop =
          Math.hypot(
            r.x + r.width / 2 - drop.x,
            r.y + r.height / 2 - drop.y
          ) < 70;
      }
      return {
        nodes: s.nodes.allNodes.length,
        conns: document.querySelectorAll(
          '#slateCanvas path[connectortype="default"]'
        ).length,
        connected,
        nearDrop,
      };
    }, drop);

    // A new node was created at the drop point, connected from Root.
    expect(after.nodes).toBe(2);
    expect(after.conns).toBe(1);
    expect(after.connected).toBe(true);
    expect(after.nearDrop).toBe(true);
  });
});
