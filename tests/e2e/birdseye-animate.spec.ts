import { test, expect } from "@playwright/test";

// Q4: the birds-eye minimap should ANIMATE when nodes change (move) instead of
// snapping. updateNodePosition now tweens the shape via requestAnimationFrame.
test.describe("birds-eye animates on node change (§Q4)", () => {
  test("moving a node tweens its minimap shape (not an instant snap)", async ({
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
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false, birdsEye: { enabled: true } },
        {}
      ).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 200, width: 150, height: 90, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 900, yPos: 700, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 500));

      const be = s.v2.birdsEye;
      const shape = be.nodeShapes.get("A");
      const startX = shape.x();

      // Move node A far, then let the minimap tween catch up.
      a.v2.options.x = 200 + 4000;
      be.updateNodePosition(a.v2);

      await new Promise((r) => setTimeout(r, 90));
      const midX = shape.x();
      await new Promise((r) => setTimeout(r, 400));
      const endX = shape.x();

      return { startX, midX, endX };
    });

    // The shape moved overall, and the mid-flight sample is strictly between
    // start and end → it tweened rather than snapping.
    expect(res.endX).not.toBeCloseTo(res.startX, 1);
    const lo = Math.min(res.startX, res.endX);
    const hi = Math.max(res.startX, res.endX);
    expect(res.midX).toBeGreaterThan(lo + 0.5);
    expect(res.midX).toBeLessThan(hi - 0.5);
  });
});
