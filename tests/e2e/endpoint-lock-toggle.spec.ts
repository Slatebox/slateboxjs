import { test, expect } from "@playwright/test";

// Q3: clicking the line cog shows a lock/relative toggle at EACH endpoint
// (source + target). Clicking a toggle flips absolute (pinned anchor) ↔ relative
// (auto-flow) via applyLineProperty — baked into the library, on-canvas.
test.describe("on-canvas endpoint lock toggles (§Q3)", () => {
  test("cog shows per-endpoint toggles; clicking flips absolute/relative", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      // The line gear (the way to the endpoint locks) is drawn only for a host that
      // supplies a line menu, so this host supplies one.
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        { onLineMenuRequested: () => {} }
      ).init();
      (window as any).__slate = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 150, yPos: 150, width: 160, height: 100, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 640, yPos: 430, width: 160, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    // Click the line, then the cog
    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGraphicsElement;
      const r = p.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(250);
    const cogPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .line-tool-cog") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(cogPt.x, cogPt.y);
    await page.waitForTimeout(300);

    // Two toggles appear, both relative initially
    const initial = await page.evaluate(() => ({
      toggles: document.querySelectorAll("#slateCanvas .endpoint-lock").length,
      source: document.querySelectorAll("#slateCanvas .endpoint-lock-source").length,
      target: document.querySelectorAll("#slateCanvas .endpoint-lock-target").length,
      absoluteCount: document.querySelectorAll("#slateCanvas .endpoint-lock-absolute").length,
      sourceAnchor:
        (window as any).__slate.v2.nodes.one("A").relationships.associations[0].sourceAnchor ?? null,
    }));
    expect(initial.toggles).toBe(2);
    expect(initial.source).toBe(1);
    expect(initial.target).toBe(1);
    expect(initial.absoluteCount).toBe(0);
    expect(initial.sourceAnchor).toBeNull();

    // Click the SOURCE toggle → becomes absolute (anchor captured)
    const srcPt = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .endpoint-lock-source") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(srcPt.x, srcPt.y);
    await page.waitForTimeout(300);
    const afterLock = await page.evaluate(() => ({
      sourceAbsolute: document.querySelectorAll(
        "#slateCanvas .endpoint-lock-source.endpoint-lock-absolute"
      ).length,
      sourceAnchor:
        (window as any).__slate.v2.nodes.one("A").relationships.associations[0].sourceAnchor ?? null,
    }));
    expect(afterLock.sourceAbsolute).toBe(1);
    expect(afterLock.sourceAnchor).not.toBeNull();

    // Click again → back to relative (anchor cleared)
    const srcPt2 = await page.evaluate(() => {
      const c = document.querySelector("#slateCanvas .endpoint-lock-source") as SVGGraphicsElement;
      const r = c.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(srcPt2.x, srcPt2.y);
    await page.waitForTimeout(300);
    const afterUnlock = await page.evaluate(
      () =>
        (window as any).__slate.v2.nodes.one("A").relationships.associations[0].sourceAnchor ?? null
    );
    expect(afterUnlock).toBeNull();
  });
});
