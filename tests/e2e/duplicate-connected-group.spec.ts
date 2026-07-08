import { test, expect } from "@playwright/test";

// Miro parity: duplicating a CONNECTED group (Cmd/Ctrl+D) must recreate the internal
// connector between the copies — createCopies previously copied only the nodes, so the
// copies came out disconnected. The recreated edge must derive its parent/child/id
// from the COPIES (the cloned edge's stale parentId is stripped) or persistence adds a
// phantom edge back to the source on reload.
test.describe("duplicate a connected group keeps the internal connector (§keyboard)", () => {
  test("Ctrl+D on A→B produces A'→B' connected, with the copy edge owned by the copy", async ({
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
        new sb.node({ id: "A", xPos: 150, yPos: 250, width: 110, height: 70, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 400, yPos: 250, width: 110, height: 70, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));
      return { aid: a.v2.id, bid: b.v2.id };
    });

    const conns = () =>
      page.evaluate(
        () =>
          document.querySelectorAll('#slateCanvas path[connectortype="default"]')
            .length
      );
    expect(await conns()).toBe(1);

    // Select both nodes and duplicate with Ctrl+D.
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
    await page.keyboard.press("Control+d");
    await page.waitForTimeout(700);

    const res = await page.evaluate((ids) => {
      const s = (window as any).__s.v2;
      const nodes = s.nodes.allNodes.length;
      // the copy edge: an association whose parent is NOT the original A and whose
      // child is NOT the original B.
      let copyEdge: any = null;
      s.nodes.allNodes.forEach((n: any) => {
        if (!n.relationships?.assocMap) return;
        for (const as of n.relationships.assocMap.values()) {
          if (n.id !== ids.aid && as.childId !== ids.bid) {
            copyEdge = { parent: n.id, child: as.childId };
          }
        }
      });
      // total associations
      let assoc = 0;
      s.nodes.allNodes.forEach((n: any) => {
        if (n.relationships?.assocMap) assoc += n.relationships.assocMap.size;
      });
      return { nodes, assoc, copyEdge };
    }, ids);

    // 4 nodes, exactly 2 associations, and a copy edge exists.
    expect(res.nodes).toBe(4);
    expect(res.assoc).toBe(2);
    expect(res.copyEdge).not.toBeNull();
    // The copy edge is owned by a COPY node (not the original A) — proves the stale
    // parentId was stripped, so it won't reattach to A on reload.
    expect(res.copyEdge.parent).not.toBe(ids.aid);
    expect(res.copyEdge.child).not.toBe(ids.bid);
    expect(await conns()).toBe(2);
  });
});
