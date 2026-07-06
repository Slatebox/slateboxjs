import { test, expect } from "@playwright/test";

// Changing a node's shape must render the NEW shape's path — not fall back to a
// rectangle. Root cause of the "I changed the shape but it stayed a rectangle"
// bug: the default node carries options.vectorPath="rectangle", and setShape set
// options.shape to the new path but left vectorPath stale; resolveShapePath()
// prioritizes vectorPath, so it kept resolving the registry rectangle. setShape
// now syncs (clears) vectorPath so the new shape wins.
test.describe("node shape change renders the actual path (§node)", () => {
  test("setShape overrides a stale vectorPath and renders the new shape", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:600px;height:400px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 160, height: 100, text: "A" }));
      await new Promise((r) => setTimeout(r, 300));
      // Reproduce the default-node condition: a stale vectorPath="rectangle".
      A.v2.options.vectorPath = "rectangle";

      const star = "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z";
      A.v2.setShape(star);
      await new Promise((r) => setTimeout(r, 300));

      const d = A.v2.contentPath ? A.v2.contentPath.node.getAttribute("d") : null;
      return {
        renderedD: (d || "").slice(0, 30),
        isRectangleFallback: !!(d && /^M ?0 ?0 ?H ?100/.test(d)),
        vectorPathCleared: A.v2.options.vectorPath !== "rectangle",
      };
    });

    // The rendered path is the star, NOT the rectangle fallback.
    expect(res.isRectangleFallback).toBe(false);
    expect(res.renderedD.startsWith("M 50 0")).toBe(true);
    expect(res.vectorPathCleared).toBe(true);
  });
});
