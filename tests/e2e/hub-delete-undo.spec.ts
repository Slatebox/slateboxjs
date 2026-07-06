import { test, expect } from "@playwright/test";

// Deleting a node with multiple connections must remove ALL its connectors (no
// rogue lines / fly-aways), leave the other nodes intact, and be undoable — undo
// restores the node AND every connection. Guards the user's explicit "no rogue
// lines" concern for the messy multi-connection case.
test.describe("hub delete + undo (§no-rogue-lines)", () => {
  test("deleting a 3-spoke hub removes all connectors; undo restores them", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:1000px;height:800px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const hub = s.nodes.add(new sb.node({ id: "HUB", xPos: 460, yPos: 380, width: 130, height: 90, text: "Hub" }));
      const spokes = [
        { id: "S0", x: 150, y: 150 },
        { id: "S1", x: 780, y: 150 },
        { id: "S2", x: 460, y: 680 },
      ];
      for (const sp of spokes) s.nodes.add(new sb.node({ id: sp.id, xPos: sp.x, yPos: sp.y, width: 110, height: 70, text: sp.id }));
      await new Promise((r) => setTimeout(r, 400));
      for (const sp of spokes) {
        hub.v2.relationships.addAssociation(s.v2.nodes.one(sp.id));
        await new Promise((r) => setTimeout(r, 150));
      }
      await new Promise((r) => setTimeout(r, 300));
      s.v2.undoRedo.forceSnapshot();

      const lines = () => document.querySelectorAll('#slateCanvas path[connectortype="default"]').length;
      const before = { lines: lines(), nodes: s.v2.nodes.allNodes.length, assoc: hub.v2.relationships.associations.length };

      // Delete the hub (what Delete-key → deleteSelected → removeNode does).
      s.v2.removeNode("HUB");
      await new Promise((r) => setTimeout(r, 300));
      const afterDelete = { hubGone: !s.v2.nodes.one("HUB"), lines: lines(), nodes: s.v2.nodes.allNodes.length };

      // Undo → hub + all 3 connectors return.
      s.v2.undoRedo.undo();
      await new Promise((r) => setTimeout(r, 500));
      const hub2 = s.v2.nodes.one("HUB");
      const afterUndo = { hubBack: !!hub2, lines: lines(), nodes: s.v2.nodes.allNodes.length, assoc: hub2?.relationships?.associations?.length };

      return { before, afterDelete, afterUndo };
    });

    // Before: hub + 3 spokes, 3 connectors.
    expect(res.before.lines).toBe(3);
    expect(res.before.nodes).toBe(4);
    // Delete: hub gone, ALL connectors removed (no rogue lines), 3 spokes remain.
    expect(res.afterDelete.hubGone).toBe(true);
    expect(res.afterDelete.lines).toBe(0);
    expect(res.afterDelete.nodes).toBe(3);
    // Undo: hub back with all 3 connectors + associations.
    expect(res.afterUndo.hubBack).toBe(true);
    expect(res.afterUndo.lines).toBe(3);
    expect(res.afterUndo.assoc).toBe(3);
  });
});
