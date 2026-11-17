import { test, expect } from "@playwright/test";

// Presentation parity: stepping through the slate must zoom+pan so each step's
// node is centered in the viewport. Previously goToStep used a local bbox + a
// hardcoded 400/300 center, leaving the node thousands of px off-screen.
test.describe("presentation step centers each node (§presentation)", () => {
  test("extractLayout orders nodes; start/next center the viewport on each", async ({
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

      // Nodes far apart so centering is unambiguous.
      const mk = (id: string, x: number, y: number) =>
        s.nodes.add(new sb.node({ id, xPos: x, yPos: y, width: 150, height: 90, text: id }));
      mk("one", 200, 200);
      mk("two", 1400, 700);
      mk("three", 300, 1600);
      await new Promise((r) => setTimeout(r, 400));

      const pres = s.v2.presentation;
      const steps = pres.extractLayout();
      const canvas = s.v2.canvas;

      // After focusing a node, the viewbox center should equal the node's world center.
      const offsetFor = (nodeId: string) => {
        const n = s.v2.nodes.one(nodeId).options;
        const nx = n.x + n.width / 2;
        const ny = n.y + n.height / 2;
        const vb = canvas.viewbox();
        const vcx = vb.x + vb.width / 2;
        const vcy = vb.y + vb.height / 2;
        return { dx: Math.round(vcx - nx), dy: Math.round(vcy - ny) };
      };

      pres.start();
      await new Promise((r) => setTimeout(r, 700));
      const off0 = offsetFor(steps[0].nodeId);
      pres.next();
      await new Promise((r) => setTimeout(r, 700));
      const off1 = offsetFor(steps[1].nodeId);
      pres.next();
      await new Promise((r) => setTimeout(r, 700));
      const off2 = offsetFor(steps[2].nodeId);

      return { stepCount: steps.length, off0, off1, off2 };
    });

    expect(res.stepCount).toBe(3);
    for (const off of [res.off0, res.off1, res.off2]) {
      expect(Math.abs(off.dx)).toBeLessThan(3); // viewbox center == node center
      expect(Math.abs(off.dy)).toBeLessThan(3);
    }
  });

  test("step transition is animated (P3) — viewbox tweens, not an instant jump", async ({
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
      s.nodes.add(new sb.node({ id: "one", xPos: 200, yPos: 200, width: 150, height: 90, text: "one" }));
      s.nodes.add(new sb.node({ id: "two", xPos: 1800, yPos: 1200, width: 150, height: 90, text: "two" }));
      await new Promise((r) => setTimeout(r, 400));
      const pres = s.v2.presentation;
      pres.extractLayout();
      const canvas = s.v2.canvas;

      pres.goToStep(0, 0); // instant to node one
      await new Promise((r) => setTimeout(r, 50));
      const start = canvas.viewbox();

      // Animate to node two; sample mid-flight (~120ms into a 450ms tween).
      pres.goToStep(1, 450);
      await new Promise((r) => setTimeout(r, 120));
      const mid = canvas.viewbox();
      await new Promise((r) => setTimeout(r, 600));
      const end = canvas.viewbox();

      return {
        startX: start.x,
        midX: mid.x,
        endX: end.x,
      };
    });

    // Mid-flight viewbox is strictly between start and end (i.e. it tweened).
    const lo = Math.min(res.startX, res.endX);
    const hi = Math.max(res.startX, res.endX);
    expect(res.midX).toBeGreaterThan(lo + 1);
    expect(res.midX).toBeLessThan(hi - 1);
  });
});

for (const width of [320, 1024]) {
  test(`read-only camera keeps each whole node centered after fit and repeated navigation at ${width}px`, async ({page}) => {
    await page.goto('/test.html');
    await page.waitForFunction(() => (window as any).Slatebox);
    const samples = await page.evaluate(async viewportWidth => {
      const sb = (window as any).Slatebox;
      const host = document.createElement('div');
      host.id = 'repeated-presentation';
      host.style.cssText = `position:fixed;left:0;top:0;width:${viewportWidth}px;height:360px`;
      document.body.append(host);
      const facade = await new sb.slate({container: host.id, allowCollaboration:false}, {}).init();
      facade.nodes.add(new sb.node({id:'signal', xPos:10500, yPos:11000, width:210, height:90, text:'Signal'}));
      facade.nodes.add(new sb.node({id:'trial', xPos:11900, yPos:11200, width:580, height:130, text:'Trial', rotate:{rotationAngle:18}}));
      const slate = facade.v2;
      await Promise.all(slate.nodes.allNodes.map((node: any) => node.ready));
      slate.fitToContent();
      slate.panZoom.disable();
      const player = facade.presentation;
      player.extractLayout();
      const readings = [];
      const record = (id:string) => {
        const rect = host.querySelector(`[data-node-id="${id}"]`)!.getBoundingClientRect();
        const bounds = host.getBoundingClientRect();
        readings.push({id, dx:rect.left + rect.width / 2 - bounds.left - bounds.width / 2,
          dy:rect.top + rect.height / 2 - bounds.top - bounds.height / 2,
          fits:rect.left >= bounds.left && rect.right <= bounds.right && rect.top >= bounds.top && rect.bottom <= bounds.bottom,
          width:slate.canvas.viewbox().width});
      };
      player.start(0);
      record('signal');
      for (let lap = 0; lap < 8; lap++) {
        player.next(0); record('trial');
        player.previous(0); record('signal');
      }
      return readings;
    }, width);
    for (const sample of samples) {
      expect(Math.abs(sample.dx)).toBeLessThan(3);
      expect(Math.abs(sample.dy)).toBeLessThan(3);
      expect(sample.fits).toBe(true);
      expect(sample.width).toBeCloseTo(samples.find(item => item.id === sample.id)!.width, 4);
    }
  });
}
