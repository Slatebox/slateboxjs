import { test, expect } from "@playwright/test";

// SVG/PNG export must be a clean diagram: content (shapes/text/connectors) present,
// UI chrome (badges, cog, selection pill, resize/connection/connector handles)
// stripped — even when nodes/lines are decorated or selected.
test.describe("export is chrome-free (§export)", () => {
  test("decorated + selected scene exports with content only, no UI classes", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:700px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 100, yPos: 150, width: 120, height: 70, text: "Alpha" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 400, yPos: 150, width: 120, height: 70, text: "Beta" })
      );
      await new Promise((r) => setTimeout(r, 300));
      // Decorate: comment + link badge on A, connect A->B, select both node + line.
      a.v2.setCommentBadge(4, "unresolved");
      a.v2.links?.set?.({ show: true, type: "url", data: "https://ex.com" });
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      s.v2.selectNodes?.([a.v2]); // node handles + cog
      // Select the connector so its pill + endpoint handles render.
      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      (assoc?.connector || assoc)?.select?.();
      await new Promise((r) => setTimeout(r, 200));

      const svg = await s.v2.svg();
      const classes = [...svg.matchAll(/class="([^"]*)"/g)].map((m) => m[1]);
      const uiPattern =
        /handle|cog|toolbar|badge|svg_select|node-tool|line-tool|point|anchor/i;
      const uiLeaks = [...new Set(classes.filter((c) => uiPattern.test(c)))];

      return {
        uiLeaks,
        hasNodeText: /Alpha/.test(svg) && /Beta/.test(svg),
        hasConnector: /connectortype|marker-end|<path/i.test(svg),
      };
    });

    // No UI chrome leaked...
    expect(res.uiLeaks).toEqual([]);
    // ...and all diagram content is present.
    expect(res.hasNodeText).toBe(true);
    expect(res.hasConnector).toBe(true);
  });
});
