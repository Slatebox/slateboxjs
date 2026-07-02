import { test, expect } from "@playwright/test";

// Regression guard for collab bugs #3 (connector not synced) and #6 (connector
// not surviving refresh). Root cause was Node.connectToNode() calling
// connector.connectTo() directly (visual only), bypassing the relationships
// model that (a) broadcasts "addRelationship" for peer sync and (b) records the
// association so it serializes and reloads.
test.describe("connector sync + persist (§3/§6)", () => {
  test("associating nodes broadcasts a package and survives serialize→load", async ({
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

      const pkgs: any[] = [];
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        { onSlateChanged: (pkg: any) => pkgs.push(pkg) }
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "p1", xPos: 200, yPos: 200, text: "parent" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "c1", xPos: 480, yPos: 320, text: "child" })
      );
      await new Promise((r) => setTimeout(r, 400));

      // Associate through the relationships model (the path connectToNode now
      // uses). This must broadcast an addRelationship package (peer sync)…
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 200));

      const broadcastFired = pkgs.some(
        (p) =>
          p.type === "addRelationship" &&
          p.data?.parentId === "p1" &&
          p.data?.childId === "c1"
      );
      const connectorLinesBeforeReload = document.querySelectorAll(
        "#slateCanvas path[stroke]"
      ).length;

      // …and the association must survive a serialize → load (persist/reload).
      const json = s.exportJSON();
      const parsed = JSON.parse(json);
      const parentJson = parsed.nodes.find(
        (n: any) => (n.options.id || n.options.xPos) && n.options.id === "p1"
      );
      const serializedAssocCount =
        parentJson?.relationships?.associations?.length ?? 0;

      // Fresh slate, load the JSON, confirm the association + connector return
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
      const reloadedAssoc =
        s2.v2.nodes.one("p1")?.relationships?.associations?.length ?? 0;
      const connectorLinesAfterReload = document
        .querySelector("#slateCanvas2")!
        .querySelectorAll("path[stroke]").length;

      return {
        broadcastFired,
        connectorLinesBeforeReload,
        serializedAssocCount,
        reloadedAssoc,
        connectorLinesAfterReload,
      };
    });

    // #3: association broadcast so peers get it
    expect(result.broadcastFired).toBe(true);
    expect(result.connectorLinesBeforeReload).toBeGreaterThan(0);
    // #6: association serialized and restored on load, connector re-rendered
    expect(result.serializedAssocCount).toBe(1);
    expect(result.reloadedAssoc).toBe(1);
    expect(result.connectorLinesAfterReload).toBeGreaterThan(0);
  });
});
