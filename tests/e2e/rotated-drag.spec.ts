import { test, expect } from "@playwright/test";

// Regression guard for the rotated-node drag fix (commit b4019ee).
//
// Dragging a ROTATED node used to fly wildly mid-drag because svg.draggable
// moved the shape's children in the group's rotated local frame. The fix drives
// positioning from the pointer delta in world units (controlled drag), so a
// rotated node tracks the cursor 1:1 and lands exactly where it's dropped.
test.describe("rotated node drag (controlled drag)", () => {
  test("a rotated node tracks the cursor and lands where dropped", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
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
      (window as any).__slate = s;
      const n = s.nodes.add(
        new sb.node({
          id: "rd1",
          xPos: 300,
          yPos: 250,
          width: 160,
          height: 100,
          text: "rotate+drag",
        })
      );
      await new Promise((r) => setTimeout(r, 400));
      // Rotate 40° and select (deterministic — no handle math needed)
      n.v2.setRotation(40);
      s.v2.selectNodes([n.v2]);
      await new Promise((r) => setTimeout(r, 300));
    });

    const nodeCenter = () =>
      page.evaluate(() => {
        const g = document.querySelector(
          "#slateCanvas [data-node-id]"
        ) as SVGGraphicsElement;
        const r = g.getBoundingClientRect();
        return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      });

    const start = await nodeCenter();

    // Drag straight right by 200px in 10 steps, checking the node tracks the
    // cursor each step (deviation stays small — no wild fly).
    await page.mouse.move(start.x, start.y);
    await page.mouse.down();
    let maxDeviation = 0;
    const stepPx = 20;
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(start.x + i * stepPx, start.y, { steps: 2 });
      await page.waitForTimeout(40);
      const c = await nodeCenter();
      // Expected center tracks the cursor delta (rotation must not distort it)
      const expX = start.x + i * stepPx;
      const dev = Math.hypot(c.x - expX, c.y - start.y);
      maxDeviation = Math.max(maxDeviation, dev);
    }
    await page.mouse.up();
    await page.waitForTimeout(300);

    // Never flew off during the drag
    expect(maxDeviation).toBeLessThan(40);

    // Landed where dropped (cursor moved +200px in x, 0 in y)
    const end = await nodeCenter();
    expect(Math.abs(end.x - (start.x + 10 * stepPx))).toBeLessThan(25);
    expect(Math.abs(end.y - start.y)).toBeLessThan(25);

    // Rotation preserved (read the underlying v2 node, not the facade wrapper)
    const rot = await page.evaluate(
      () =>
        (window as any).__slate.v2.nodes.allNodes[0].options.rotate
          ?.rotationAngle || 0
    );
    expect(Math.round(rot)).toBe(40);
  });

  test("animated position() moves a rotated node in a straight line (no fly)", async ({
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
      const n = s.nodes.add(
        new sb.node({
          id: "rd2",
          xPos: 300,
          yPos: 300,
          width: 160,
          height: 100,
          text: "glide",
        })
      );
      await new Promise((r) => setTimeout(r, 400));
      n.v2.setRotation(50);
      await new Promise((r) => setTimeout(r, 100));

      const centerWorld = () => {
        const nn = n.v2;
        return { x: nn.options.x + nn.options.width / 2, y: nn.options.y };
      };
      const startX = centerWorld().x;
      const targetX = 700;
      // Animate to a far target; sample the WORLD x each frame — it must move
      // monotonically toward the target, never overshooting wildly (fly).
      n.v2.position(targetX - 80, 300, undefined, undefined, 400);
      const xs: number[] = [];
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 40));
        xs.push(n.v2.options.x);
      }
      await new Promise((r) => setTimeout(r, 200));
      return {
        startX,
        finalX: n.v2.options.x,
        target: targetX - 80,
        maxX: Math.max(...xs),
        rot: n.v2.options.rotate?.rotationAngle || 0,
      };
    });

    // Settled at the target, rotation intact, and never overshot the target
    // (a fly would push x far beyond the target mid-animation).
    expect(Math.abs(result.finalX - result.target)).toBeLessThan(2);
    expect(result.maxX).toBeLessThan(result.target + 30);
    expect(Math.round(result.rot)).toBe(50);
  });
});
