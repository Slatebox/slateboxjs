import { test, expect } from "@playwright/test";

// As you drag a connection toward a node, the preview line CURVES so its arrow
// tip meets the node edge at ~90°, pointing at the node center.
test.describe("connect drag preview curves to perpendicular (§curve)", () => {
  test("dragging the plug over a node curves the preview + points at center", async ({
    page,
  }) => {
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
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 250, yPos: 220, width: 150, height: 90, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 720, yPos: 540, width: 160, height: 100, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      s.v2.selectNodes([a.v2]); // toolbar w/ plug
      await new Promise((r) => setTimeout(r, 200));
    });

    const res = await page.evaluate(async () => {
      const plug = document.querySelector("#slateCanvas .node-tool-plug") as SVGGraphicsElement;
      const bG = document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement;
      const pr = plug.getBoundingClientRect();
      const br = bG.getBoundingClientRect();
      const sx = pr.x + pr.width / 2, sy = pr.y + pr.height / 2;
      const ex = br.x + br.width / 2, ey = br.y + br.height / 2;
      const fire = (el: any, t: string, x: number, y: number) => {
        el.dispatchEvent(new PointerEvent(t, { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
        el.dispatchEvent(new MouseEvent(t.replace("pointer", "mouse"), { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
      };
      fire(plug, "pointerdown", sx, sy);
      await new Promise((r) => setTimeout(r, 40));
      let curved = false, dot = 0;
      for (let i = 1; i <= 10; i++) {
        fire(window, "pointermove", sx + (ex - sx) * i / 10, sy + (ey - sy) * i / 10);
        await new Promise((r) => setTimeout(r, 35));
        const p = document.querySelector("#slateCanvas .connect-drag-line") as SVGGeometryElement;
        if (p) {
          if ((p.getAttribute("d") || "").includes("C")) curved = true;
          if (i >= 9) {
            const total = p.getTotalLength();
            const end = p.getPointAtLength(total);
            const near = p.getPointAtLength(Math.max(0, total - 10));
            const bo = (window as any).__slate.v2.nodes.one("B").options;
            const tcx = bo.x + bo.width / 2, tcy = bo.y + bo.height / 2;
            const inx = end.x - near.x, iny = end.y - near.y, im = Math.hypot(inx, iny) || 1;
            const tx = tcx - end.x, ty = tcy - end.y, tm = Math.hypot(tx, ty) || 1;
            dot = (inx / im) * (tx / tm) + (iny / im) * (ty / tm);
          }
        }
      }
      fire(window, "pointerup", ex, ey);
      await new Promise((r) => setTimeout(r, 300));
      const connected = (window as any).__slate.v2.nodes.one("A").relationships.associations.some((x: any) => x.childId === "B");
      const cleaned = !document.querySelector("#slateCanvas .connect-drag-line");
      return { curved, dot, connected, cleaned };
    });

    expect(res.curved).toBe(true); // preview bends toward the node
    expect(res.dot).toBeGreaterThan(0.9); // arrow tip points at the node center
    expect(res.connected).toBe(true); // drop connects
    expect(res.cleaned).toBe(true); // preview cleaned up
  });
});
