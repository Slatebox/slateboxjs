import { test, expect } from "@playwright/test";

// Connector endpoint handles are Miro-style: hidden by default, revealed when the
// connection is hovered or selected. Persistent dots on every line were clutter.
// The handles stay draggable when revealed so reconnection still works.
test.describe("connector handle reveal (§connector)", () => {
  test("endpoint handles hide by default and reveal on hover", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    // Build a connection and return the line's on-screen midpoint.
    const mid = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 120, yPos: 200, width: 150, height: 90, text: "A" }));
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 520, yPos: 200, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));
      A.v2.relationships.addAssociation(B.v2);
      await new Promise((r) => setTimeout(r, 300));
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGPathElement;
      const m = p.getPointAtLength(p.getTotalLength() * 0.5);
      const svg = document.querySelector("#slateCanvas svg") as SVGSVGElement;
      const dp = svg.createSVGPoint();
      dp.x = m.x;
      dp.y = m.y;
      const sp = dp.matrixTransform(svg.getScreenCTM()!);
      return { x: sp.x, y: sp.y };
    });

    const revealed = () =>
      page.evaluate(
        () =>
          Array.from(document.querySelectorAll("#slateCanvas .connector-handle")).filter(
            (h) => getComputedStyle(h).opacity !== "0"
          ).length
      );
    const total = await page.evaluate(
      () => document.querySelectorAll("#slateCanvas .connector-handle").length
    );

    // Hidden by default.
    expect(total).toBeGreaterThanOrEqual(2);
    expect(await revealed()).toBe(0);

    // Hover the line → handles reveal.
    await page.mouse.move(mid.x, mid.y);
    await page.waitForTimeout(250);
    expect(await revealed()).toBeGreaterThan(0);

    // Move away → handles hide again.
    await page.mouse.move(mid.x, mid.y - 180);
    await page.waitForTimeout(250);
    expect(await revealed()).toBe(0);
  });
});
