import { test, expect } from "@playwright/test";

// A theme restyles the WHOLE slate. It recolored nodes + set defaultLineColor for
// future lines, but EXISTING connections kept their old color — a visual mismatch
// (themed nodes, un-themed lines). applyTheme now re-colors existing connections via
// updateAssociationsWith, which keys on the association id so parallel edges
// (`A->B~2`) recolor too.
test.describe("theme recolors existing connections (§theme)", () => {
  test("applying a theme recolors nodes AND all existing lines (incl. parallel)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 120, yPos: 200, width: 110, height: 64, text: "Root" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 380, yPos: 160, width: 110, height: 64, text: "B" })
      );
      const c = s.nodes.add(
        new sb.node({ id: "C", xPos: 380, yPos: 320, width: 110, height: 64, text: "C" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2); // A->B
      a.v2.relationships.addAssociation(b.v2); // A->B~2 (parallel)
      a.v2.relationships.addAssociation(c.v2); // A->C
      await new Promise((r) => setTimeout(r, 400));

      // Read the rendered connector stroke (computed, so it resolves whether the
      // color is set via attribute or style).
      const lineColors = () =>
        [
          ...document.querySelectorAll('#slateCanvas path[connectortype="default"]'),
        ].map((p) => getComputedStyle(p as Element).stroke);

      const before = lineColors();

      const theme = {
        _id: "t",
        name: "Dark",
        containerStyle: { backgroundColor: "#1a1a2e" },
        defaultLineColor: "#e94560",
        styles: {
          parent: { backgroundColor: "#e94560" },
          child_1: { backgroundColor: "#0f3460" },
        },
      };
      a.v2.slate.applyTheme(theme);
      await new Promise((r) => setTimeout(r, 500));

      const after = lineColors();
      const nodeColors = a.v2.slate.nodes.allNodes.map(
        (n: any) => n.options.backgroundColor
      );
      return { before, after, nodeColors, connectorCount: after.length };
    });

    // Three connectors (incl. the parallel edge), all recolored to the theme line
    // (#e94560 = rgb(233, 69, 96)).
    expect(res.connectorCount).toBe(3);
    expect(res.after.every((c) => c === "rgb(233, 69, 96)")).toBe(true);
    // And they were NOT that color before (started at the #666 default).
    expect(res.before.every((c) => c !== "rgb(233, 69, 96)")).toBe(true);
    // Nodes were restyled too (theme parent/child).
    expect(res.nodeColors).toContain("#e94560");
    expect(res.nodeColors).toContain("#0f3460");
  });
});
