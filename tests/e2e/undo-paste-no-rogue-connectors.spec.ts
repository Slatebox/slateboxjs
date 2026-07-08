import { test, expect } from "@playwright/test";

// No rogue lines: undoing a paste of a connected group must leave NO orphaned connector
// paths. Connectors render in a global container (slate.linesContainer), so the undo's
// deserialize (which clears nodes) previously left the pasted copies' connector paths
// behind as rogue lines. deserialize now wipes linesContainer before rebuilding, so the
// DOM connector count always matches the model.
test.describe("undo of a paste leaves no rogue connectors (§undo)", () => {
  test("paste A→B then undo → exactly 1 connector path, no orphans", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const ids = await page.evaluate(async () => {
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
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 200, yPos: 250, width: 110, height: 70, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 440, yPos: 250, width: 110, height: 70, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));
      return { aid: a.v2.id, bid: b.v2.id };
    });

    const connPaths = () =>
      page.evaluate(
        () =>
          document.querySelectorAll('#slateCanvas path[connectortype="default"]')
            .length
      );
    expect(await connPaths()).toBe(1);

    // Select both, copy, paste.
    const c = await page.evaluate(() => {
      const r = document
        .querySelector('#slateCanvas [data-node-id="A"]')!
        .getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(c.x, c.y);
    await page.evaluate((ids) => {
      const s = (window as any).__s.v2;
      s.selectNodes([s.nodes.one(ids.aid), s.nodes.one(ids.bid)]);
    }, ids);
    await page.waitForTimeout(300);
    await page.keyboard.press("Control+c");
    await page.waitForTimeout(200);
    await page.keyboard.press("Control+v");
    await page.waitForTimeout(800);

    expect(await connPaths()).toBe(2); // A→B and A'→B'
    const nodesAfterPaste = await page.evaluate(
      () => (window as any).__s.v2.nodes.allNodes.length
    );
    expect(nodesAfterPaste).toBe(4);

    // Undo the paste.
    await page.mouse.click(700, 120);
    await page.waitForTimeout(200);
    await page.keyboard.press("Control+z");
    await page.waitForTimeout(900);

    const nodesAfterUndo = await page.evaluate(
      () => (window as any).__s.v2.nodes.allNodes.length
    );
    // Back to 2 nodes and EXACTLY 1 rendered connector — no rogue paths.
    expect(nodesAfterUndo).toBe(2);
    expect(await connPaths()).toBe(1);
  });
});
