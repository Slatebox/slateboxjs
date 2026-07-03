import { test, expect } from "@playwright/test";

// Parity + no-rogue-lines: deleting a connected node must remove ALL associations
// involving it and their connector lines — no stranded connectors or stale
// associations left behind.
test.describe("delete node cleans up connectors (§parity)", () => {
  test("deleting a connected node removes its associations + connector lines", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 200, width: 150, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 600, yPos: 420, width: 150, height: 90, text: "B" }));
      const c = s.nodes.add(new sb.node({ id: "C", xPos: 200, yPos: 480, width: 150, height: 90, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      // A→B and C→B (B is a shared child); also B→C so B is a parent too
      a.v2.relationships.addAssociation(b.v2);
      c.v2.relationships.addAssociation(b.v2);
      b.v2.relationships.addAssociation(c.v2);
      await new Promise((r) => setTimeout(r, 400));
      const linesBefore = document.querySelectorAll('#slateCanvas path[connectortype="default"]').length;

      // Delete B (child of A & C, parent of C)
      s.v2.removeNode("B");
      await new Promise((r) => setTimeout(r, 400));

      const linesAfter = document.querySelectorAll('#slateCanvas path[connectortype="default"]').length;
      const aAssoc = s.v2.nodes.one("A").relationships.associations.length;
      const cAssoc = s.v2.nodes.one("C").relationships.associations.length;
      const bGone = !s.v2.nodes.one("B");
      return { linesBefore, linesAfter, aAssoc, cAssoc, bGone };
    });

    expect(res.linesBefore).toBe(3);
    expect(res.bGone).toBe(true);
    // A→B removed, C→B removed, B→C removed → only lines NOT involving B remain (none)
    expect(res.linesAfter).toBe(0);
    expect(res.aAssoc).toBe(0); // A→B gone
    expect(res.cAssoc).toBe(0); // C→B gone
  });
});
