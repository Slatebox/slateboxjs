import { test, expect } from "@playwright/test";

// M8: dragging a line endpoint over an existing node must clearly show it will
// attach (highlight the target) and attach on drop. Also guards the L1
// regression: clicking a line must show the endpoint handles (the M1/M2 cog
// rework must NOT remove the draggable endpoints).
test.describe("endpoint drop-target highlight + attach (§M8)", () => {
  test("line click shows endpoint handles; dragging an endpoint over a node highlights + attaches", async ({
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
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__slate = s;
      const n1 = s.nodes.add(new sb.node({ id: "p1", xPos: 500, yPos: 200, width: 150, height: 90, text: "P" }));
      const n2 = s.nodes.add(new sb.node({ id: "c1", xPos: 500, yPos: 520, width: 150, height: 90, text: "C" }));
      s.nodes.add(new sb.node({ id: "tgt", xPos: 120, yPos: 360, width: 150, height: 90, text: "T" }));
      await new Promise((r) => setTimeout(r, 400));
      n1.v2.relationships.addAssociation(n2.v2);
      await new Promise((r) => setTimeout(r, 300));
    });

    // Click the line → endpoint handles appear (L1 not regressed)
    const linePt = await page.evaluate(() => {
      const p = document.querySelector('#slateCanvas path[connectortype="default"]') as SVGGraphicsElement;
      const r = p.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(linePt.x, linePt.y);
    await page.waitForTimeout(250);
    const handleCount = await page.evaluate(
      () => document.querySelectorAll("#slateCanvas .connector-handle").length
    );
    expect(handleCount).toBe(2);

    // Drive a faithful pointer-event drag of an endpoint over the target node
    const res = await page.evaluate(async () => {
      const handle = document.querySelector("#slateCanvas .connector-handle") as SVGGraphicsElement;
      const tgtG = document.querySelector('#slateCanvas [data-node-id="tgt"]') as SVGGraphicsElement;
      const hr = handle.getBoundingClientRect();
      const tr = tgtG.getBoundingClientRect();
      const sx = hr.x + hr.width / 2, sy = hr.y + hr.height / 2;
      const ex = tr.x + tr.width / 2, ey = tr.y + tr.height / 2;
      const fire = (el: any, type: string, x: number, y: number) => {
        el.dispatchEvent(new PointerEvent(type, { clientX: x, clientY: y, bubbles: true, cancelable: true, pointerId: 1, pointerType: "mouse", button: 0, buttons: 1 }));
        el.dispatchEvent(new MouseEvent(type.replace("pointer", "mouse"), { clientX: x, clientY: y, bubbles: true, cancelable: true, button: 0, buttons: 1 }));
      };
      const isHi = () => {
        const els = [tgtG, ...Array.from(tgtG.querySelectorAll("*"))];
        return els.some((e: any) => (e.getAttribute?.("stroke") || "").toLowerCase().includes("007cff"));
      };
      let highlight = false;
      fire(handle, "pointerdown", sx, sy);
      await new Promise((r) => setTimeout(r, 40));
      for (let i = 1; i <= 10; i++) {
        fire(window, "pointermove", sx + (ex - sx) * i / 10, sy + (ey - sy) * i / 10);
        await new Promise((r) => setTimeout(r, 40));
        if (isHi()) highlight = true;
      }
      fire(window, "pointerup", ex, ey);
      await new Promise((r) => setTimeout(r, 400));
      const s = (window as any).__slate;
      const attached = s.v2.nodes.allNodes.some((n: any) =>
        (n.relationships?.associations || []).some((a: any) => a.childId === "tgt" || a.parentId === "tgt")
      );
      return { highlight, attached };
    });

    expect(res.highlight).toBe(true); // clear "will attach" feedback
    expect(res.attached).toBe(true); // drop attaches the endpoint
  });
});
