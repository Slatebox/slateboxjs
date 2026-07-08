import { test, expect } from "@playwright/test";

// U5: changing a node's shape must RE-RENDER it. onNodeShapeChanged used to be a
// stub (updated options.shape but never re-drew), so the node stayed a rect.
// Node.setShape now removes the old shape and re-renders the new one (named or a
// raw SVG path), keeping the text centered.
test.describe("node shape change re-renders (§U5)", () => {
  test("setShape with a raw path and a named shape re-renders the node", async ({
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
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const n = s.nodes.add(new sb.node({ id: "N", xPos: 300, yPos: 250, width: 160, height: 100, text: "N" }));
      await new Promise((r) => setTimeout(r, 400));

      const g = () => document.querySelector('#slateCanvas [data-node-id="N"]') as SVGGElement;
      // Exclude the transparent resize-proxy rect that custom shapes add as their
      // svg.resize target — it's not the shape's own background rect.
      const bareRect = () => g().querySelector(":scope > rect:not([data-resize-proxy])");
      const start = { hasRect: !!bareRect(), hasPath: !!g().querySelector("path") };

      // 1) raw SVG path (a star)
      const starPath = "M 50 0 L 61.8 38.2 L 100 38.2 L 69.1 61.8 L 80.9 100 L 50 76.4 L 19.1 100 L 30.9 61.8 L 0 38.2 L 38.2 38.2 Z";
      n.v2.setShape(starPath);
      await new Promise((r) => setTimeout(r, 150));
      const afterPath = {
        shapeIsPath: (n.v2.options.shape || "").trim().startsWith("M"),
        hasPath: !!g().querySelector("path"),
        hasBareRect: !!bareRect(),
        textStillThere: !!g().querySelector("text"),
        // vectorPath must track the current shape (never stale, and readable by the
        // app's Shape tab to highlight the active swatch), not be left empty.
        vectorPathSyncsShape:
          n.v2.options.vectorPath === n.v2.options.shape &&
          (n.v2.options.vectorPath || "").startsWith("M"),
      };

      // 2) named shape
      n.v2.setShape("circle");
      await new Promise((r) => setTimeout(r, 150));
      const afterNamed = {
        shape: n.v2.options.shape,
        hasCircleOrPath: !!g().querySelector("circle, path, ellipse"),
      };

      return { start, afterPath, afterNamed };
    });

    // Started as a native rounded rect.
    expect(res.start.hasRect).toBe(true);
    // Raw path → re-rendered as a path, no bare rect, text preserved.
    expect(res.afterPath.shapeIsPath).toBe(true);
    expect(res.afterPath.hasPath).toBe(true);
    expect(res.afterPath.hasBareRect).toBe(false);
    expect(res.afterPath.textStillThere).toBe(true);
    expect(res.afterPath.vectorPathSyncsShape).toBe(true);
    // Named shape → re-rendered.
    expect(res.afterNamed.shape).toBe("circle");
    expect(res.afterNamed.hasCircleOrPath).toBe(true);
  });
});
