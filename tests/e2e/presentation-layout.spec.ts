import { test, expect } from "@playwright/test";

// AI-presentation step 1: the library builds a HIERARCHICAL preziData (root
// nodes → children with metrics/descriptions) for the AI to order, and can set
// the step order from an explicit (AI-decided) node id list.
test.describe("presentation hierarchical layout + AI ordering (§presentation)", () => {
  test("extractPresentationLayout builds the tree; setStepOrder applies an order", async ({
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
      const a = s.nodes.add(new sb.node({ id: "root", xPos: 400, yPos: 100, width: 160, height: 90, text: "Root" }));
      const b = s.nodes.add(new sb.node({ id: "childB", xPos: 200, yPos: 400, width: 150, height: 90, text: "Child B" }));
      const c = s.nodes.add(new sb.node({ id: "childC", xPos: 600, yPos: 400, width: 150, height: 90, text: "Child C" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      a.v2.relationships.addAssociation(c.v2);
      await new Promise((r) => setTimeout(r, 300));

      const pres = s.v2.presentation;
      const prezi = pres.extractPresentationLayout();

      // Apply an explicit (AI-style) order, plus one that omits a node.
      const stepsFull = pres.setStepOrder(["childC", "root", "childB"]);
      const stepsPartial = pres.setStepOrder(["childB"]); // rest appended

      return {
        rootCount: prezi.nodes.length,
        rootId: prezi.nodes[0]?.nodeId,
        rootChildren: prezi.nodes[0]?.numberOfChildrenNodes,
        rootChildIds: (prezi.nodes[0]?.childrenNodes || []).map((n: any) => n.nodeId).sort(),
        rootDesc: prezi.nodes[0]?.description,
        hasBbox: typeof prezi.nodes[0]?.metrics?.bbox?.width === "number",
        fullOrder: stepsFull.map((x: any) => x.nodeId),
        partialOrder: stepsPartial.map((x: any) => x.nodeId),
      };
    });

    // One root (Root), with B and C as children.
    expect(res.rootCount).toBe(1);
    expect(res.rootId).toBe("root");
    expect(res.rootChildren).toBe(2);
    expect(res.rootChildIds).toEqual(["childB", "childC"]);
    expect(res.rootDesc).toBe("Root");
    expect(res.hasBbox).toBe(true);
    // Explicit AI order is honored exactly.
    expect(res.fullOrder).toEqual(["childC", "root", "childB"]);
    // Partial order keeps the given node first, appends the rest.
    expect(res.partialOrder[0]).toBe("childB");
    expect(res.partialOrder.length).toBe(3);
  });
});
