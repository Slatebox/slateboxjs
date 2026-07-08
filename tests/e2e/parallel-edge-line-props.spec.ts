import { test, expect } from "@playwright/test";

// Parallel edges (`A->B` and `A->B~2`) must accept INDEPENDENT line properties. Before,
// applyLineProperty keyed updateConnection on the pair (`A->B`), so a property set on
// one parallel edge landed on / overwrote the canonical one. Now it keys on the
// association id, so each parallel edge gets its own label + color.
test.describe("parallel edges get independent line properties (§labels)", () => {
  test("label + color set per-edge land on the correct parallel connector", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
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
        new sb.node({ id: "A", xPos: 150, yPos: 300, width: 110, height: 70, text: "A" })
      );
      const b = s.nodes.add(
        new sb.node({ id: "B", xPos: 450, yPos: 300, width: 110, height: 70, text: "B" })
      );
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2); // A->B
      a.v2.relationships.addAssociation(b.v2); // A->B~2
      await new Promise((r) => setTimeout(r, 500));

      const ids: string[] = [];
      a.v2.relationships.assocMap.forEach((as: any) => ids.push(as.id));
      // Distinct label + color per parallel edge.
      a.v2.relationships.applyLineProperty(ids[0], "label", "First");
      a.v2.relationships.applyLineProperty(ids[1], "label", "Second");
      a.v2.relationships.applyLineProperty(ids[1], "lineColor", "#E91E63");
      await new Promise((r) => setTimeout(r, 500));

      const texts = [...document.querySelectorAll("#slateCanvas text")].map(
        (t) => t.textContent
      );
      const modelColors: Record<string, string> = {};
      a.v2.relationships.assocMap.forEach((as: any) => {
        modelColors[as.id] = as.lineColor;
      });
      return {
        ids,
        first: texts.filter((t) => t === "First").length,
        second: texts.filter((t) => t === "Second").length,
        colorEdge0: modelColors[ids[0]],
        colorEdge1: modelColors[ids[1]],
      };
    });

    // Both distinct labels render (neither overwrote the other).
    expect(res.first).toBe(1);
    expect(res.second).toBe(1);
    // Color landed ONLY on the parallel edge it was set on.
    expect(res.colorEdge1.toUpperCase()).toBe("#E91E63");
    expect(res.colorEdge0.toUpperCase()).not.toBe("#E91E63");
  });
});
