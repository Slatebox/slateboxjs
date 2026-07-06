import { test, expect } from "@playwright/test";

// U3: dropping a connector endpoint on a node must attach the arrow AT THE DROP
// POINT (a pinned normalized anchor), not snap to the closest-edge-to-source.
test.describe("endpoint connects at the drop point (§U3)", () => {
  test("dropping the target endpoint on a node's top edge pins the anchor there", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1100px;height:800px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__slate = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 150, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 300, yPos: 450, width: 150, height: 90, text: "B" }));
      s.nodes.add(new sb.node({ id: "C", xPos: 750, yPos: 380, width: 200, height: 140, text: "C" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    // Click the line to reveal the endpoint handles.
    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGraphicsElement;
      const r = p.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(300);

    const res = await page.evaluate(async () => {
      const th =
        (document.querySelector("#slateCanvas .connector-handle-target") as SVGGraphicsElement) ||
        (document.querySelectorAll("#slateCanvas .connector-handle")[1] as SVGGraphicsElement);
      const cG = document.querySelector('#slateCanvas [data-node-id="C"]') as SVGGraphicsElement;
      const hr = th.getBoundingClientRect();
      const cr = cG.getBoundingClientRect();
      const sx = hr.x + hr.width / 2, sy = hr.y + hr.height / 2;
      const ex = cr.x + cr.width / 2, ey = cr.y + 8; // C's TOP-center
      const down = (el: any, x: number, y: number) => {
        el.dispatchEvent(new MouseEvent("mousedown", { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
        el.dispatchEvent(new PointerEvent("pointerdown", { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
      };
      const move = (x: number, y: number) => {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, bubbles: true, pointerId: 1, pointerType: "mouse", buttons: 1 }));
        window.dispatchEvent(new MouseEvent("mousemove", { clientX: x, clientY: y, bubbles: true, buttons: 1 }));
      };
      down(th, sx, sy);
      await new Promise((r) => setTimeout(r, 50));
      for (let i = 1; i <= 10; i++) {
        move(sx + (ex - sx) * i / 10, sy + (ey - sy) * i / 10);
        await new Promise((r) => setTimeout(r, 40));
      }
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: ex, clientY: ey, bubbles: true, pointerId: 1, pointerType: "mouse" }));
      window.dispatchEvent(new MouseEvent("mouseup", { clientX: ex, clientY: ey, bubbles: true }));
      await new Promise((r) => setTimeout(r, 700));

      const s = (window as any).__slate;
      const assoc = s.v2.nodes.one("A").relationships.associations.find((x: any) => x.childId === "C");
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
      const end = p.getPointAtLength(p.getTotalLength());
      const co = s.v2.nodes.one("C").options;
      return {
        connectedToC: !!assoc,
        anchor: assoc?.targetAnchor || null,
        endY: end.y,
        cTopY: co.y,
        cBottomY: co.y + co.height,
      };
    });

    expect(res.connectedToC).toBe(true);
    // Anchor pinned near the TOP where we dropped (y ≈ 0), not center/bottom.
    expect(res.anchor).not.toBeNull();
    expect(res.anchor.y).toBeLessThan(0.35);
    // The arrow endpoint lands near C's top edge, not its center or far edge.
    expect(Math.abs(res.endY - res.cTopY)).toBeLessThan(40);
  });
});
