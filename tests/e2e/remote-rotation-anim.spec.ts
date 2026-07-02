import { test, expect } from "@playwright/test";

// Regression guard for collab bug #5: a remotely-applied rotation must animate
// in this window (like drag), not snap. The Invoker calls setRotation(angle,
// 400) on remote apply; setRotation tweens the angle when given a duration.
test.describe("remote rotation animates (§5)", () => {
  test("setRotation with a duration tweens through intermediate angles", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const result = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:800px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const n = s.nodes.add(
        new sb.node({ id: "r1", xPos: 300, yPos: 250, text: "rot" })
      );
      await new Promise((r) => setTimeout(r, 300));

      // Animate to 90° over 400ms; sample the angle mid-flight.
      n.v2.setRotation(90, 400);
      const angles: number[] = [];
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 45));
        angles.push(n.v2.options.rotate?.rotationAngle || 0);
      }
      await new Promise((r) => setTimeout(r, 200));
      const finalAngle = n.v2.options.rotate?.rotationAngle || 0;
      const intermediate = angles.filter((a) => a > 2 && a < 88).length;
      return { angles, intermediate, finalAngle };
    });

    // Multiple intermediate frames (animated), settling exactly at 90.
    expect(result.intermediate).toBeGreaterThanOrEqual(2);
    expect(Math.round(result.finalAngle)).toBe(90);
  });

  test("setRotation without a duration snaps immediately (local)", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    const angle = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:800px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const n = s.nodes.add(
        new sb.node({ id: "r2", xPos: 300, yPos: 250, text: "rot" })
      );
      await new Promise((r) => setTimeout(r, 300));
      n.v2.setRotation(60);
      // Immediately after (no wait) it should already be at the target.
      return n.v2.options.rotate?.rotationAngle || 0;
    });
    expect(Math.round(angle)).toBe(60);
  });
});
