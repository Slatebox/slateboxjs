import { test, expect } from "@playwright/test";

// M7: connectors follow LIVE during node resize. svg.connectable re-solves on a
// "transform" event on the connected group; handleResize now fires it each
// resize frame, so attached lines track in real time (not only at the end).
test.describe("connectors follow live during resize (§M7)", () => {
  test("resizing a connected node re-solves the connector each frame", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 200, yPos: 220, width: 150, height: 90, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 600, yPos: 360, width: 150, height: 90, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 300));

      const pathD = () => {
        const p = document.querySelector('#slateCanvas path[connectortype="default"]');
        return p ? p.getAttribute("d") : null;
      };
      const before = pathD();

      // Simulate incremental resize frames (what handleResize does): grow the
      // node and fire "transform" each step; the connector must re-solve.
      const seen = new Set<string>();
      for (let w = 170; w <= 300; w += 30) {
        n1.v2.setSize(w, 90);
        n1.v2.svgGroup.fire("transform");
        await new Promise((r) => setTimeout(r, 30));
        const d = pathD();
        if (d) seen.add(d);
      }
      const after = pathD();
      return { before, distinctFrames: seen.size, after };
    });

    expect(result.before).not.toBeNull();
    // Multiple distinct paths across the resize frames → it tracked live.
    expect(result.distinctFrames).toBeGreaterThan(1);
    expect(result.after).not.toBe(result.before);
  });
});
