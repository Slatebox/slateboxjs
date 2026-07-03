import { test, expect } from "@playwright/test";

// Presentation parity: stepping through the slate must zoom+pan so each step's
// node is centered in the viewport. Previously goToStep used a local bbox + a
// hardcoded 400/300 center, leaving the node thousands of px off-screen.
test.describe("presentation step centers each node (§presentation)", () => {
  test("extractLayout orders nodes; start/next center the viewport on each", async ({
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

      // Nodes far apart so centering is unambiguous.
      const mk = (id: string, x: number, y: number) =>
        s.nodes.add(new sb.node({ id, xPos: x, yPos: y, width: 150, height: 90, text: id }));
      mk("one", 200, 200);
      mk("two", 1400, 700);
      mk("three", 300, 1600);
      await new Promise((r) => setTimeout(r, 400));

      const pres = s.v2.presentation;
      const steps = pres.extractLayout();
      const canvas = s.v2.canvas;

      // After focusing a node, the viewbox center should equal the node's world center.
      const offsetFor = (nodeId: string) => {
        const n = s.v2.nodes.one(nodeId).options;
        const nx = n.x + n.width / 2;
        const ny = n.y + n.height / 2;
        const vb = canvas.viewbox();
        const vcx = vb.x + vb.width / 2;
        const vcy = vb.y + vb.height / 2;
        return { dx: Math.round(vcx - nx), dy: Math.round(vcy - ny) };
      };

      pres.start();
      await new Promise((r) => setTimeout(r, 100));
      const off0 = offsetFor(steps[0].nodeId);
      pres.next();
      await new Promise((r) => setTimeout(r, 100));
      const off1 = offsetFor(steps[1].nodeId);
      pres.next();
      await new Promise((r) => setTimeout(r, 100));
      const off2 = offsetFor(steps[2].nodeId);

      return { stepCount: steps.length, off0, off1, off2 };
    });

    expect(res.stepCount).toBe(3);
    for (const off of [res.off0, res.off1, res.off2]) {
      expect(Math.abs(off.dx)).toBeLessThan(3); // viewbox center == node center
      expect(Math.abs(off.dy)).toBeLessThan(3);
    }
  });
});
