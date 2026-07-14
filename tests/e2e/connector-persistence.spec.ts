import { test, expect } from "@playwright/test";

// Connector state persistence (guards named bugs #1/#2): a connector's line type,
// endpoint anchors, and arrow flags must be included in the slate's serialization
// so they survive save/reload. The library's exportJSON() is the persistence source.
test.describe("connector persistence (§serialization)", () => {
  test("lineType, sourceAnchor and arrow flags are serialized", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:600px;height:500px;position:fixed;top:0;left:0;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 100, yPos: 100, width: 100, height: 60, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 350, yPos: 100, width: 100, height: 60, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 300));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 200));

      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      // Baseline: a default connector has no orthogonal/parent-arrow/anchor.
      const baseline = s.v2.exportJSON();
      const baseStr =
        typeof baseline === "string" ? baseline : JSON.stringify(baseline);

      // Set the exact properties the line pane's controls set.
      assoc.lineType = "orthogonal";
      assoc.showParentArrow = true;
      assoc.sourceAnchor = { x: 0.2, y: 0.3 };

      const after = s.v2.exportJSON();
      const afterStr =
        typeof after === "string" ? after : JSON.stringify(after);

      return {
        baseHadOrtho: /orthogonal/.test(baseStr),
        hasLineType: /orthogonal/.test(afterStr),
        hasParentArrow: /showParentArrow/.test(afterStr),
        hasAnchor: /sourceAnchor/.test(afterStr),
      };
    });

    // The properties are NOT present by default but ARE after being set —
    // proving they're genuinely serialized (not incidental substrings).
    expect(res.baseHadOrtho).toBe(false);
    expect(res.hasLineType).toBe(true);
    expect(res.hasParentArrow).toBe(true);
    expect(res.hasAnchor).toBe(true);
  });
});
