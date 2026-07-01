import { test, expect } from "@playwright/test";

// Proves §A against the real built bundle: window.Slatebox exists with the
// v1 namespace shape, and the v1 idiom
//   const s = await new Slatebox.slate({ container: 'slateCanvas' }, {}).init()
//   s.nodes.add(new Slatebox.node({ ... }))
// renders real nodes on the canvas.
test.describe("v1 compat facade (window.Slatebox)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
  });

  test("window.Slatebox has the v1 namespace shape", async ({ page }) => {
    const shape = await page.evaluate(() => {
      const sb = (window as any).Slatebox;
      return {
        slate: typeof sb.slate,
        node: typeof sb.node,
        base: typeof sb.base,
        guid: typeof sb.utils?.guid,
      };
    });
    expect(shape).toEqual({
      slate: "function",
      node: "function",
      base: "function",
      guid: "function",
    });
  });

  test("v1 idiom creates a working slate with nodes", async ({ page }) => {
    const result = await page.evaluate(async () => {
      // The Meteor app mounts into a bare div located by element id
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.width = "800px";
      div.style.height = "600px";
      document.body.appendChild(div);

      const sb = (window as any).Slatebox;
      const s = await new sb.slate(
        { container: "slateCanvas", name: "compat test" },
        {}
      ).init();

      const n1 = new sb.node({
        id: "c1",
        xPos: 100,
        yPos: 100,
        width: 120,
        height: 80,
        text: "facade A",
      });
      s.nodes.add(n1);
      s.nodes.add(new sb.node({ id: "c2", xPos: 300, yPos: 150, text: "facade B" }));

      // Give async node creation a beat
      await new Promise((r) => setTimeout(r, 500));

      return {
        initResolvedToSlate: !!s && typeof s.exportJSON === "function",
        nodeCount: s.nodes.allNodes.length,
        oneIsSame: s.nodes.one("c1") === n1,
        svgRendered: div.querySelectorAll("svg").length > 0,
        exportParses: !!JSON.parse(s.exportJSON()),
      };
    });

    expect(result.initResolvedToSlate).toBe(true);
    expect(result.nodeCount).toBe(2);
    expect(result.oneIsSame).toBe(true);
    expect(result.svgRendered).toBe(true);
    expect(result.exportParses).toBe(true);
  });
});
