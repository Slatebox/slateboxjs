import { test, expect } from "@playwright/test";

// Miro-style: dragging from a node's plug-circle connects to the node you drop on
// (a plain click still creates a new node in that direction). Previously the
// plug-circles were click-only, so a Miro user's drag-to-connect did nothing.
test.describe("plug-circle drag to connect (§connector)", () => {
  test("dragging from a plug-circle onto another node connects them", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__slate = s;
      const A = s.nodes.add(new sb.node({ id: "A", xPos: 120, yPos: 200, width: 150, height: 90, text: "A" }));
      const B = s.nodes.add(new sb.node({ id: "B", xPos: 520, yPos: 200, width: 170, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));

      // Select A so its plug-circles appear.
      A.v2.selectNode?.() ?? s.v2.selectNodes?.([A.v2]);
      await new Promise((r) => setTimeout(r, 300));

      const plug = document.querySelector("#slateCanvas .connection-handle-right") as SVGGraphicsElement;
      if (!plug) return { noPlug: true };
      const pr = plug.getBoundingClientRect();
      const bG = document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement;
      const br = bG.getBoundingClientRect();
      const sx = pr.x + pr.width / 2, sy = pr.y + pr.height / 2;
      const ex = br.x + br.width * 0.15, ey = br.y + br.height * 0.5; // B's left edge

      plug.dispatchEvent(new PointerEvent("pointerdown", { clientX: sx, clientY: sy, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
      // Move past the threshold to trigger the connect-drag hand-off.
      for (let i = 1; i <= 12; i++) {
        const x = sx + (ex - sx) * i / 12, y = sy + (ey - sy) * i / 12;
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: x, clientY: y, bubbles: true, pointerId: 1, pointerType: "mouse", buttons: 1 }));
        await new Promise((r) => setTimeout(r, 25));
      }
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: ex, clientY: ey, bubbles: true, pointerId: 1, pointerType: "mouse" }));
      await new Promise((r) => setTimeout(r, 800));

      const assoc = A.v2.relationships.associations.find((x: any) => x.childId === "B");
      return { connected: !!assoc };
    });

    expect(res.noPlug).toBeFalsy();
    expect(res.connected).toBe(true);
  });
});
