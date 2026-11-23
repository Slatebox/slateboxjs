import { test, expect } from "@playwright/test";

// Custom (AI or library) shapes in a real browser: a hole drawn with fillRule evenodd is a hole
// (not filled, not clickable), the border is not clipped or stretched, text sits in the shape's
// text box, and a line into a concave speech bubble ends on its outline.
test.describe("custom shapes: fill rule, text box and lines (§shapes)", () => {
  test("a rocket's window is a hole; its label sits in the text box; a line ends on the bubble", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:1000px;height:800px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      const rocketPath = "M50,0 C64,10 72,28 72,50 L72,74 L88,90 L88,100 L70,92 L30,92 L12,100 L12,90 L28,74 L28,50 C28,28 36,10 50,0 Z M41,34 A9,9 0 1 1 59,34 A9,9 0 1 1 41,34 Z M40,92 L50,100 L60,92 Z";
      const bubblePath = "M28,0 H92 Q100,0 100,8 V62 Q100,70 92,70 H28 Q20,70 20,62 V44 L0,52 L20,30 V8 Q20,0 28,0 Z";
      const rocketBox = { x: 0.23, y: 0.44, w: 0.54, h: 0.48 };
      const a = s.nodes.add(new sb.node({ id: "R", xPos: 150, yPos: 150, width: 152, height: 200, text: "Go", shape: "custom", vectorPath: rocketPath, fillRule: "evenodd", textBox: rocketBox, borderWidth: 2 }));
      const b = s.nodes.add(new sb.node({ id: "B", xPos: 600, yPos: 200, width: 240, height: 170, text: "Hi", shape: "custom", vectorPath: bubblePath, fillRule: "nonzero", textBox: { x: 0.21, y: 0.06, w: 0.77, h: 0.79 }, borderWidth: 2 }));
      await new Promise((r) => setTimeout(r, 400));
      const path = document.querySelector('#slateCanvas [data-node-id="R"] path[data-shape-path]') as SVGGeometryElement;
      const nested = path.closest("svg")!;
      const box = nested.getBoundingClientRect();
      const local = (x: number, y: number) => {
        const p = (path.ownerSVGElement as SVGSVGElement).createSVGPoint();
        p.x = x; p.y = y;
        return p.matrixTransform(path.getScreenCTM()!.inverse());
      };
      // The window's centre (50, 34 in the 0..100 outline) on screen.
      const bb = path.getBBox();
      const win = { x: box.x + ((50 - bb.x) / bb.width) * box.width, y: box.y + ((34 - bb.y) / bb.height) * box.height };
      const body = { x: box.x + ((50 - bb.x) / bb.width) * box.width, y: box.y + ((60 - bb.y) / bb.height) * box.height };
      const hit = (p: { x: number; y: number }) => document.elementFromPoint(p.x, p.y)?.closest("[data-node-id]")?.getAttribute("data-node-id") ?? null;
      const text = (document.querySelector('#slateCanvas [data-node-id="R"] text') as SVGTextElement).getBoundingClientRect();
      const area = { x: box.x + rocketBox.x * box.width, y: box.y + rocketBox.y * box.height, w: rocketBox.w * box.width, h: rocketBox.h * box.height };

      a.v2.relationships.addAssociation(b.v2);
      await new Promise((r) => setTimeout(r, 300));
      b.v2.options.x += 1;
      b.v2.applyPositionAndRotation();
      await new Promise((r) => setTimeout(r, 300));
      const line = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGeometryElement;
      const end = line.getPointAtLength(line.getTotalLength());
      const bubble = document.querySelector('#slateCanvas [data-node-id="B"] path[data-shape-path]') as SVGGeometryElement;
      const svg = document.querySelector("#slateCanvas svg") as SVGSVGElement;
      const rootInv = svg.getScreenCTM()!.inverse();
      const toUser = (lp: DOMPoint) => { const dp = svg.createSVGPoint(); dp.x = lp.x; dp.y = lp.y; return dp.matrixTransform(bubble.getScreenCTM()!).matrixTransform(rootInv); };
      let toOutline = 1e9;
      const total = bubble.getTotalLength();
      for (let i = 0; i < 400; i++) {
        const w = toUser(bubble.getPointAtLength((i / 400) * total));
        toOutline = Math.min(toOutline, Math.hypot(w.x - end.x, w.y - end.y));
      }
      return {
        fillRule: path.getAttribute("fill-rule"),
        vectorEffect: path.getAttribute("vector-effect"),
        overflow: nested.getAttribute("overflow"),
        windowFilled: path.isPointInFill(local(win.x, win.y)),
        bodyFilled: path.isPointInFill(local(body.x, body.y)),
        windowHit: hit(win),
        bodyHit: hit(body),
        textInside: text.width > 0 && text.x >= area.x - 2 && text.right <= area.x + area.w + 2 && text.y >= area.y - 2 && text.bottom <= area.y + area.h + 2,
        toOutline,
      };
    });

    expect(res.fillRule).toBe("evenodd");
    expect(res.vectorEffect).toBe("non-scaling-stroke");
    expect(res.overflow).toBe("visible");
    expect(res.windowFilled).toBe(false);
    expect(res.bodyFilled).toBe(true);
    expect(res.windowHit).not.toBe("R");
    expect(res.bodyHit).toBe("R");
    expect(res.textInside).toBe(true);
    // The arrow's end is at most an arrowhead away from the bubble's outline.
    expect(res.toOutline).toBeLessThan(20);
  });
});
