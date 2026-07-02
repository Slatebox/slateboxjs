import { test, expect } from "@playwright/test";

// Regression guard for line-editing L2 (line-type properties render) + L3
// (line edits apply + persist; the collab path uses this same invoker method,
// verified live two-window). onLinePropertiesChanged routes {prop,val,
// associationId,id} to relationships.applyLineProperty, which updates the
// association record and re-renders the connector.
test.describe("line properties apply + persist (§L2/L3)", () => {
  test("changing line type re-renders the connector and survives serialize→load", async ({
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
      const a = s.nodes.add(
        new sb.node({ id: "p1", xPos: 200, yPos: 220, width: 160, height: 100, text: "p" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "c1", xPos: 520, yPos: 320, width: 160, height: 100, text: "c" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      const assocId = a.v2.relationships.associations[0].id;

      const pathInfo = () => {
        const p = document.querySelector("#slateCanvas path[stroke]");
        const d = p ? p.getAttribute("d") || "" : "";
        return { hasCubic: d.includes("C"), hasLine: /\dL|\sL/.test(d) };
      };
      const beforeType = pathInfo();

      // Change line type to orthogonal via the apply path (same one collab uses)
      s.v2.invoker.onLinePropertiesChanged({
        type: "onLinePropertiesChanged",
        data: { id: "p1", associationId: assocId, prop: "lineType", val: "orthogonal" },
      });
      await new Promise((r) => setTimeout(r, 150));
      const afterType = pathInfo();
      const storedType = a.v2.relationships.associations[0].lineType;

      // Also change color through the same path
      s.v2.invoker.onLinePropertiesChanged({
        type: "onLinePropertiesChanged",
        data: { id: "p1", associationId: assocId, prop: "lineColor", val: "#ff0066" },
      });
      await new Promise((r) => setTimeout(r, 100));
      const storedColor = a.v2.relationships.associations[0].lineColor;

      // Persist: serialize → load into a fresh slate → type must render orthogonal
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
      const reloadedType = s2.v2.nodes.one("p1")?.relationships?.associations?.[0]?.lineType;
      const reloadedPath = (() => {
        const p = document.querySelector("#slateCanvas2 path[stroke]");
        const d = p ? p.getAttribute("d") || "" : "";
        return { hasCubic: d.includes("C"), hasLine: /\dL|\sL/.test(d) };
      })();

      return { beforeType, afterType, storedType, storedColor, reloadedType, reloadedPath };
    });

    // Started curved (bezier), became orthogonal (straight segments)
    expect(result.beforeType.hasCubic).toBe(true);
    expect(result.afterType.hasCubic).toBe(false);
    expect(result.afterType.hasLine).toBe(true);
    expect(result.storedType).toBe("orthogonal");
    expect(result.storedColor).toBe("#ff0066");
    // Persisted: reloaded association is orthogonal and renders straight segments
    expect(result.reloadedType).toBe("orthogonal");
    expect(result.reloadedPath.hasCubic).toBe(false);
    expect(result.reloadedPath.hasLine).toBe(true);
  });
});
