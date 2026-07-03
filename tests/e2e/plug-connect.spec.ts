import { test, expect } from "@playwright/test";

// G3: plug press-drag-to-connect. Pressing the node toolbar's plug and dragging
// draws a dashed rubber-band line; dropping on another node creates an
// association (connector) to it.
test.describe("plug drag-to-connect (§G3)", () => {
  test("press plug + drag onto another node connects them", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1100px;height:760px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      (window as any).__slate = s;
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 250, yPos: 250, width: 150, height: 90, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 700, yPos: 480, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([a.v2]); // shows the node toolbar (with plug)
      await new Promise((r) => setTimeout(r, 200));
    });

    // No association yet
    expect(
      await page.evaluate(() => (window as any).__slate.v2.nodes.one("A").relationships.associations.length)
    ).toBe(0);

    const res = await page.evaluate(async () => {
      const plug = document.querySelector("#slateCanvas .node-tool-plug") as SVGGraphicsElement;
      const bG = document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement;
      const pr = plug.getBoundingClientRect();
      const br = bG.getBoundingClientRect();
      const sx = pr.x + pr.width / 2, sy = pr.y + pr.height / 2;
      const ex = br.x + br.width / 2, ey = br.y + br.height / 2;
      const fire = (el: any, type: string, x: number, y: number) => {
        el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
        el.dispatchEvent(new MouseEvent(type.replace("pointer", "mouse"), { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
      };
      fire(plug, "pointerdown", sx, sy);
      await new Promise((r) => setTimeout(r, 40));
      let sawTemp = false;
      for (let i = 1; i <= 10; i++) {
        fire(window, "pointermove", sx + (ex - sx) * i / 10, sy + (ey - sy) * i / 10);
        await new Promise((r) => setTimeout(r, 30));
        if (document.querySelector("#slateCanvas .connect-drag-line")) sawTemp = true;
      }
      fire(window, "pointerup", ex, ey);
      await new Promise((r) => setTimeout(r, 400));
      const s = (window as any).__slate;
      const connected = s.v2.nodes.one("A").relationships.associations.some((x: any) => x.childId === "B");
      const lines = document.querySelectorAll('#slateCanvas path[connectortype="default"]').length;
      const tempGone = !document.querySelector("#slateCanvas .connect-drag-line");
      return { sawTemp, connected, lines, tempGone };
    });

    expect(res.sawTemp).toBe(true); // rubber-band line during drag
    expect(res.connected).toBe(true); // association A→B created
    expect(res.lines).toBeGreaterThan(0); // connector rendered
    expect(res.tempGone).toBe(true); // temp line cleaned up
  });
});
