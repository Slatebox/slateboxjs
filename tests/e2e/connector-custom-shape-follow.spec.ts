import { test, expect } from "@playwright/test";

// A connector to a custom vector shape must (a) follow the node when it moves and
// (b) not recompute the whole path outline (240 getPointAtLength calls) every
// frame — the local outline is cached on the element, so dragging complex shapes
// stays fast (the slowness previously made the line appear "static" during drag).
test.describe("connector follows custom shape + caches outline (§connector)", () => {
  test("star connector follows on move; outline samples are cached", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:760px;height:560px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 60, yPos: 250, width: 90, height: 60, text: "A" })
      );
      const star = s.nodes.add(
        new sb.node({ id: "STAR", xPos: 380, yPos: 200, width: 160, height: 160, text: "", shape: "star" })
      );
      await new Promise((r) => setTimeout(r, 500));
      a.v2.relationships.addAssociation(star.v2);
      await new Promise((r) => setTimeout(r, 400));

      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
      const before = p.getPointAtLength(p.getTotalLength());

      // Move the star + refresh the connector (simulates a drag frame).
      star.v2.options.x = 560;
      star.v2.options.y = 340;
      star.v2.applyPositionAndRotation();
      assoc.connector?.updateConnection?.(`${a.v2.id}->${assoc.childId}`, {});
      await new Promise((r) => setTimeout(r, 300));
      const after = p.getPointAtLength(p.getTotalLength());

      // The tagged shape path should have cached local outline samples.
      const pathEl = star.v2.backgroundRect.node.querySelector("path[data-shape-path]");
      const cached = !!(pathEl && (pathEl as any).__outlineSamples);

      return {
        followed: Math.hypot(after.x - before.x, after.y - before.y),
        cached,
      };
    });

    // Connector endpoint moved with the node.
    expect(res.followed).toBeGreaterThan(80);
    // Outline samples cached (fast path for subsequent frames).
    expect(res.cached).toBe(true);
  });
});
