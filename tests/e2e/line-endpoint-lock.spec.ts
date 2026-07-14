import { test, expect } from "@playwright/test";

// L5: per-endpoint locking. RELATIVE = auto-flow (no anchor); ABSOLUTE = pin the
// endpoint to its current normalized spot on the node (an anchor that rotates/
// moves with the node). The pane sends prop 'targetLock'/'sourceLock' →
// applyLineProperty → Connector.setEndpointLock; the resolved anchor persists.
test.describe("line endpoint locking relative/absolute (§L5)", () => {
  test("absolute pins the endpoint anchor and persists; relative clears it", async ({
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
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 200, yPos: 220, width: 150, height: 90, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 520, yPos: 300, width: 150, height: 90, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 300));
      const assocId = n1.v2.relationships.associations[0].id;
      const apply = (prop: string, val: any) =>
        s.v2.invoker.onLinePropertiesChanged({
          type: "onLinePropertiesChanged",
          data: { id: "p1", associationId: assocId, prop, val },
        });

      const relStart = n1.v2.relationships.associations[0].targetAnchor ?? null;

      // Lock target to ABSOLUTE → an anchor is captured
      apply("targetLock", "absolute");
      await new Promise((r) => setTimeout(r, 150));
      const absAnchor = n1.v2.relationships.associations[0].targetAnchor ?? null;

      // Persist via serialize → load
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
      const reloadedAnchor =
        s2.v2.nodes.one("p1")?.relationships?.associations?.[0]?.targetAnchor ?? null;

      // Back to RELATIVE → anchor cleared
      apply("targetLock", "relative");
      await new Promise((r) => setTimeout(r, 150));
      const relAnchor = n1.v2.relationships.associations[0].targetAnchor ?? null;

      return { relStart, absAnchor, reloadedAnchor, relAnchor };
    });

    expect(result.relStart).toBeNull(); // default is relative (auto-flow)
    expect(result.absAnchor).not.toBeNull(); // absolute captured an anchor
    expect(typeof result.absAnchor.x).toBe("number");
    // Persisted across serialize → load
    expect(result.reloadedAnchor).not.toBeNull();
    expect(result.reloadedAnchor.x).toBeCloseTo(result.absAnchor.x, 5);
    // Relative clears it
    expect(result.relAnchor).toBeNull();
  });
});
