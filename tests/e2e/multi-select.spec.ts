import { test, expect } from "@playwright/test";

// U20: rubber-band multi-select was broken by three issues — (1) left-drag also
// panned (panButton was left mouse), (2) selectNodesInRect compared the world-
// space selection rect against the node's LOCAL bbox (never overlapped), and
// (3) move/up were on the canvas so pointer capture stole them. Now left-drag on
// empty canvas rubber-band-selects the overlapped nodes.
test.describe("rubber-band multi-select (§U20)", () => {
  test("dragging a box over nodes selects them", async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 120, height: 80, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 200, yPos: 320, width: 120, height: 80, text: "B" }));
      s.nodes.add(new sb.node({ id: "C", xPos: 600, yPos: 150, width: 120, height: 80, text: "C" }));
      await new Promise((r) => setTimeout(r, 300));

      const svg = document.querySelector("#slateCanvas svg") as SVGSVGElement;
      // Screen box around A + B (but not C).
      const ra = (document.querySelector('#slateCanvas [data-node-id="A"]') as SVGGraphicsElement).getBoundingClientRect();
      const rb = (document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement).getBoundingClientRect();
      const sx = Math.min(ra.x, rb.x) - 30, sy = Math.min(ra.y, rb.y) - 30;
      const ex = Math.max(ra.x + ra.width, rb.x + rb.width) + 30, ey = Math.max(ra.y + ra.height, rb.y + rb.height) + 30;

      const fire = (type: string, x: number, y: number) =>
        svg.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));

      fire("pointerdown", sx, sy);
      await new Promise((r) => setTimeout(r, 20));
      let midW = "0";
      for (let i = 1; i <= 8; i++) {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: sx + (ex - sx) * i / 8, clientY: sy + (ey - sy) * i / 8, bubbles: true, pointerId: 1, pointerType: "mouse", buttons: 1 }));
        await new Promise((r) => setTimeout(r, 15));
        if (i === 6) {
          const sr = document.querySelector('#slateCanvas rect[stroke-dasharray="4,4"][pointer-events="none"]');
          midW = sr?.getAttribute("width") || "0";
        }
      }
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: ex, clientY: ey, bubbles: true, pointerId: 1, pointerType: "mouse" }));
      await new Promise((r) => setTimeout(r, 80));

      const ids = s.v2.getSelectedNodes().map((n: any) => n.id).sort();
      return { ids, count: ids.length, midW: Number(midW) };
    });

    // A + B selected (inside the box); C excluded.
    expect(res.count).toBe(2);
    expect(res.ids).toEqual(["A", "B"]);
    // The rubber-band rect grew during the drag (visual feedback).
    expect(res.midW).toBeGreaterThan(0);
  });

  // A REAL-mouse rubber-band ends with a `click` on the canvas (pointerdown +
  // pointerup on the same element). The canvas click handler deselects on empty-
  // space clicks, so it used to WIPE the selection the instant it was made — the
  // drag-selection never survived long enough to group-move. The synthetic test
  // above never fires that click, so it missed the bug. This asserts the trailing
  // canvas click does NOT clear a fresh rubber-band selection.
  test("a trailing canvas click does not wipe the rubber-band selection", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText = "width:900px;height:700px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate({ container: "slateCanvas", allowCollaboration: false }, {}).init();
      s.nodes.add(new sb.node({ id: "A", xPos: 200, yPos: 150, width: 120, height: 80, text: "A" }));
      s.nodes.add(new sb.node({ id: "B", xPos: 200, yPos: 320, width: 120, height: 80, text: "B" }));
      await new Promise((r) => setTimeout(r, 300));

      const svg = document.querySelector("#slateCanvas svg") as SVGSVGElement;
      const ra = (document.querySelector('#slateCanvas [data-node-id="A"]') as SVGGraphicsElement).getBoundingClientRect();
      const rb = (document.querySelector('#slateCanvas [data-node-id="B"]') as SVGGraphicsElement).getBoundingClientRect();
      const sx = Math.min(ra.x, rb.x) - 30, sy = Math.min(ra.y, rb.y) - 30;
      const ex = Math.max(ra.x + ra.width, rb.x + rb.width) + 30, ey = Math.max(ra.y + ra.height, rb.y + rb.height) + 30;

      svg.dispatchEvent(new PointerEvent("pointerdown", { clientX: sx, clientY: sy, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
      await new Promise((r) => setTimeout(r, 20));
      for (let i = 1; i <= 8; i++) {
        window.dispatchEvent(new PointerEvent("pointermove", { clientX: sx + (ex - sx) * i / 8, clientY: sy + (ey - sy) * i / 8, bubbles: true, pointerId: 1, pointerType: "mouse", buttons: 1 }));
        await new Promise((r) => setTimeout(r, 15));
      }
      window.dispatchEvent(new PointerEvent("pointerup", { clientX: ex, clientY: ey, bubbles: true, pointerId: 1, pointerType: "mouse" }));
      await new Promise((r) => setTimeout(r, 40));
      const afterUp = s.v2.getSelectedNodes().length;

      // The trailing real-mouse click on the canvas (target = the svg element).
      svg.dispatchEvent(new MouseEvent("click", { clientX: ex, clientY: ey, bubbles: true, cancelable: true }));
      await new Promise((r) => setTimeout(r, 40));
      const afterClick = s.v2.getSelectedNodes().map((n: any) => n.id).sort();

      return { afterUp, afterClick };
    });

    expect(res.afterUp).toBe(2); // rubber-band selected A + B
    expect(res.afterClick).toEqual(["A", "B"]); // trailing click did NOT wipe it
  });
});
