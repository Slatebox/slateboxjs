import { test, expect } from "@playwright/test";

// Q1: while dragging a node, svg.draggable raises it to front — which would push
// connector arrowheads (markers) behind it. The dragmove handler keeps the
// markers container on top, so arrowheads stay visible over the node.
test.describe("arrowheads stay over nodes during drag (§Q1)", () => {
  test("markers container remains the top canvas layer through a node drag", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:1000px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const a = s.nodes.add(new sb.node({ id: "A", xPos: 250, yPos: 250, width: 150, height: 90, text: "A" }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 620, yPos: 430, width: 150, height: 90, text: "B" }));
      await new Promise((r) => setTimeout(r, 400));
      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));

      const markersOnTop = () => {
        const canvasNode = s.v2.canvas.node as SVGElement;
        const mc = s.v2.markersContainer?.node as SVGElement;
        const children = Array.from(canvasNode.children);
        const mcIndex = children.indexOf(mc);
        const lastNodeIndex = Math.max(
          ...children.map((c: any, i: number) =>
            c.getAttribute && c.getAttribute("data-node-id") ? i : -1
          )
        );
        return mcIndex > lastNodeIndex;
      };

      const before = markersOnTop();

      // Faithful pointer drag of node B.
      const g = document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement;
      const r = g.getBoundingClientRect();
      const sx = r.x + r.width / 2, sy = r.y + r.height / 2;
      const fire = (el: any, type: string, x: number, y: number) => {
        el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
        el.dispatchEvent(new MouseEvent(type.replace("pointer", "mouse"), { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
      };
      fire(g, "pointerdown", sx, sy);
      await new Promise((r) => setTimeout(r, 30));
      let during = true;
      for (let i = 1; i <= 5; i++) {
        fire(window, "pointermove", sx - i * 25, sy - i * 12);
        await new Promise((r) => setTimeout(r, 40));
        if (!markersOnTop()) during = false;
      }
      fire(window, "pointerup", sx - 125, sy - 60);
      await new Promise((r) => setTimeout(r, 100));
      const after = markersOnTop();

      return { before, during, after };
    });

    expect(res.before).toBe(true);
    expect(res.during).toBe(true); // arrowheads stayed on top throughout the drag
    expect(res.after).toBe(true);
  });
});
