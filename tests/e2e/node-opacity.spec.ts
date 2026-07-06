import { test, expect } from "@playwright/test";

// U15: the color pane's opacity slider was inert — onNodeColorChanged set
// options.opacity but never applied it. Node.applyOpacity() now pushes it onto
// the shape element (matching createBackground's load path), and it persists.
test.describe("node opacity applies + persists (§U15)", () => {
  test("opacity renders and survives a reload", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const mk = (id: string) => {
        const d = document.createElement("div");
        d.id = id;
        d.style.cssText = "width:700px;height:450px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
        document.body.appendChild(d);
      };
      mk("op1");
      const s1 = await new sb.slate({ container: "op1", allowCollaboration: false }, {}).init();
      s1.nodes.add(new sb.node({ id: "N", xPos: 200, yPos: 150, width: 180, height: 110, text: "N", backgroundColor: "#3366cc" }));
      await new Promise((r) => setTimeout(r, 300));

      const rect1 = () => document.querySelector('#op1 [data-node-id="N"] rect') as SVGElement;
      const before = rect1().getAttribute("opacity");
      s1.v2.invoker.onNodeColorChanged({ data: { id: "N", color: "#3366cc", opacity: 0.35 } });
      await new Promise((r) => setTimeout(r, 100));
      const applied = rect1().getAttribute("opacity");

      const json = s1.exportJSON();
      s1.v2.destroy();

      mk("op2");
      const s2 = await new sb.slate({ container: "op2", allowCollaboration: false }, {}).init();
      await s2.loadJSON(json);
      await new Promise((r) => setTimeout(r, 500));
      const persisted = (document.querySelector('#op2 [data-node-id="N"] rect') as SVGElement).getAttribute("opacity");

      return { before, applied, persisted };
    });

    expect(res.before === null || res.before === "1").toBe(true);
    expect(Number(res.applied)).toBeCloseTo(0.35, 2);
    expect(Number(res.persisted)).toBeCloseTo(0.35, 2);
  });
});
