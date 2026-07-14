import { test, expect } from "@playwright/test";

// SVG export must contain the visible diagram (node text + colors, connector paths,
// edge labels) and NOTHING else — no UI chrome (cogs/handles) and no connector hit
// areas (invisible wide click-detection paths, attribute-tagged so the class-based
// removeSelectors missed them). Stripping the hit areas keeps the export clean and
// avoids near-invisible cruft / bbox skew.
test.describe("SVG export is clean (§export)", () => {
  test("export has content (nodes/connector/label) but no chrome or hit areas", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const svg = await page.evaluate(async () => {
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
        new sb.node({ id: "A", xPos: 150, yPos: 250, width: 120, height: 80, text: "Start" })
      );
      a.v2.setColors("#8E24AA");
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 460, yPos: 300, width: 120, height: 80, text: "Finish" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 400));
      let aid: string | null = null;
      a.v2.relationships.assocMap.forEach((as: any) => {
        if (as.childId === b.v2.id) aid = as.id;
      });
      a.v2.relationships.applyLineProperty(aid, "label", "goes to");
      await new Promise((r) => setTimeout(r, 400));
      // exportSVG lives on the Export module (window.Export) and as a slate method.
      const ex = (window as any).Export;
      return ex && ex.exportSVG
        ? ex.exportSVG(a.v2.slate)
        : a.v2.slate.exportSVG();
    });

    expect(typeof svg).toBe("string");
    // Visible content present.
    expect(svg).toContain("Start");
    expect(svg).toContain("Finish");
    expect(svg).toContain("goes to"); // edge label
    expect(svg).toMatch(/connectortype="default"/); // connector path
    expect(svg.toLowerCase()).toContain("8e24aa"); // node color
    // Chrome + hit areas absent.
    expect(svg).not.toContain('connectortype="hitarea"');
    expect(svg).not.toContain("node-cog");
    expect(svg).not.toContain("line-cog");
    expect(svg).not.toContain("svg_select");
  });
});
