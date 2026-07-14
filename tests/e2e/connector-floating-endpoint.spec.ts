import { test, expect } from "@playwright/test";

// L1b: free-floating endpoints (drop on empty canvas → a bare {x,y} point) +
// L4: no rogue lines (disconnect fully removes the connectable via con.remove).
test.describe("connector floating endpoint + no rogue lines (§L1b/L4)", () => {
  test("a floating endpoint persists through serialize→load and leaves no rogue lines", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
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
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 200, yPos: 200, width: 150, height: 90, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 500, yPos: 300, width: 150, height: 90, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 300));
      const pathsAfterConnect = document.querySelectorAll(
        "#slateCanvas path[stroke]:not([data-shape-path])"
      ).length;

      // Simulate the endpoint-drag-to-canvas result: rebuild as floating (this
      // is exactly what handleEndpointChange does on a phantom drop).
      n1.v2.relationships.removeAssociation("c1");
      const fa = n1.v2.relationships.addFloatingAssociation({ x: 700, y: 150 });
      await new Promise((r) => setTimeout(r, 200));

      const assocs = n1.v2.relationships.associations;
      const pathsAfterFloat = document.querySelectorAll(
        "#slateCanvas path[stroke]:not([data-shape-path])"
      ).length;

      // Persist: serialize → load into a fresh slate
      const json = s.exportJSON();
      const div2 = document.createElement("div");
      div2.id = "slateCanvas2";
      div2.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1001;background:#fff";
      document.body.appendChild(div2);
      const s2 = await new sb.slate(
        { container: "slateCanvas2", allowCollaboration: false },
        {}
      ).init();
      await s2.loadJSON(json);
      await new Promise((r) => setTimeout(r, 600));
      const reAssocs = s2.v2.nodes.one("p1")?.relationships?.associations ?? [];
      const reloadedFloat = reAssocs.find((a: any) => a.targetPoint);
      const reloadedPaths = document
        .querySelector("#slateCanvas2")!
        .querySelectorAll("path[stroke]:not([data-shape-path])").length;

      return {
        pathsAfterConnect,
        assocCount: assocs.length,
        hasFloat: assocs.some((a: any) => a.targetPoint),
        floatPoint: fa.targetPoint,
        pathsAfterFloat,
        reloadedAssocCount: reAssocs.length,
        reloadedHasFloat: !!reloadedFloat,
        reloadedPoint: reloadedFloat?.targetPoint,
        reloadedPaths,
      };
    });

    // One clean connection before and after floating (no rogue lines — L4)
    expect(result.pathsAfterConnect).toBe(2);
    expect(result.assocCount).toBe(1);
    expect(result.hasFloat).toBe(true);
    expect(result.pathsAfterFloat).toBe(2); // rebuild left no orphan paths
    // Persisted floating endpoint (L1b)
    expect(result.reloadedAssocCount).toBe(1);
    expect(result.reloadedHasFloat).toBe(true);
    expect(result.reloadedPoint).toEqual({ x: 700, y: 150 });
    expect(result.reloadedPaths).toBe(2);
  });
});
