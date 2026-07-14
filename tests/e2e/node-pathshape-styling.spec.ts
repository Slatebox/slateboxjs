import { test, expect } from "@playwright/test";

// U13: on a path (vector) shape, backgroundRect is the nested <svg> wrapper while
// fill/stroke live on the inner <path>. setColors/applyBorder styled the wrapper,
// so recoloring or bordering a star/diamond/etc. did nothing. They now target the
// stored contentPath (inner <path>) for vector shapes.
test.describe("path-shaped nodes restyle correctly (§U13)", () => {
  test("color + border apply to the inner path of a vector shape", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:800px;height:500px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 250, yPos: 180, width: 160, height: 120, text: "N", backgroundColor: "#3366cc" }));
      await new Promise((r) => setTimeout(r, 300));

      // Turn it into a star (vector path shape).
      const star = "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z";
      n.v2.setShape(star);
      await new Promise((r) => setTimeout(r, 150));

      const path = () => document.querySelector('#slateCanvas [data-node-id="N"] path') as SVGElement;
      n.v2.setColors("#ff0000");
      n.v2.options.borderWidth = 8;
      n.v2.options.borderColor = "#00aa00";
      n.v2.options.borderStyle = "-";
      n.v2.applyBorder();
      await new Promise((r) => setTimeout(r, 100));

      return {
        fill: path().getAttribute("fill"),
        stroke: path().getAttribute("stroke"),
        width: path().getAttribute("stroke-width"),
        dash: path().getAttribute("stroke-dasharray"),
      };
    });

    expect(res.fill).toBe("#ff0000");
    expect(res.stroke).toBe("#00aa00");
    expect(res.width).toBe("8");
    expect(res.dash).toBe("24,8");
  });
});
