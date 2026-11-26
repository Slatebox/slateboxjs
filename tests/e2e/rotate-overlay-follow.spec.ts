import { test, expect } from "@playwright/test";

// Regression guard for the rotate/resize interaction family on selection
// persistence and overlay geometry:
//
// 1) A handle-drag released over empty canvas used to DISMISS the whole
//    selection: the browser dispatches the trailing `click` on the nearest
//    common ancestor of the pointerdown/pointerup targets — the SVG root —
//    and the canvas click handler read that as "clicked empty space" and
//    called clearSelection(). Rotating (or resizing) a node therefore made
//    its handles and plug-dots vanish. The handler now ignores drag-tail
//    clicks (pointerdown started on a node/handle, or the pointer travelled).
//
// 2) After finalizeInteraction re-asserts the canonical group transform, the
//    selection overlay + plug-dots must be refreshed to the node's FINAL
//    geometry instead of staying detached at the mid-interaction state.
//
// Detection is self-calibrating: every plug-dot/handle is snapshotted BEFORE
// the drag as a vector from the node center, then must have ORBITED by
// exactly the applied rotation (radius preserved). A detached/stale overlay is
// ~45 degrees off; a correct one is <10.
test.describe("rotate overlay + plug-dots follow the rotated node", () => {
  test("a real rotate-handle drag keeps the selection and drags the harness along", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:640px;height:520px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      s.nodes.add(
        new sb.node({
          id: "ROT",
          xPos: 240,
          yPos: 190,
          width: 160,
          height: 120,
          text: "R",
        })
      );
      await new Promise((r) => setTimeout(r, 500));
    });

    // Node center via getBoundingClientRect of the node group BEFORE any
    // selection overlay exists (the overlay inflates the group bbox).
    const c0 = await page.evaluate(() => {
      const g = document.querySelector('#slateCanvas [data-node-id="ROT"]')!;
      const r = g.getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });

    // Select with a real click (the container hit area accepts it even when
    // the center happens to land on a gap between children).
    await page.mouse.click(c0.x, c0.y);
    await page.waitForTimeout(400);
    const selBefore = await page.evaluate(
      () => (window as any).__s.v2.selectedNodes.length
    );
    expect(selBefore, "node must be selected before the drag").toBe(1);

    // Snapshot every affordance (plug-dots + rotate handle) before the drag.
    const pre = await page.evaluate(() => {
      const canvas = document.getElementById("slateCanvas")!;
      const out: Record<string, { x: number; y: number; cls: string }> = {};
      canvas
        .querySelectorAll("[class*='connection-handle'], [class*='handle_rot']")
        .forEach((d) => {
          const r = d.getBoundingClientRect();
          const cls = d.getAttribute("class") || "";
          const name =
            cls.match(/connection-handle-(\w+)/)?.[1] ||
            cls.match(/handle_rot(\w*)/)?.[0] ||
            "rot";
          out[name] = { x: r.x + r.width / 2, y: r.y + r.height / 2, cls };
        });
      return out;
    });
    expect(pre["handle_rot"], "rotate handle must exist before the drag").toBeTruthy();
    expect(Object.keys(pre).length).toBeGreaterThanOrEqual(5);

    // Real ~45 degree clockwise arc drag on the rotate handle around the node
    // center, released over empty canvas.
    const rot = pre["handle_rot"];
    const arc = await page.evaluate(
      ({ rp, cx, cy }: { rp: { x: number; y: number }; cx: number; cy: number }) => {
        const vx = rp.x - cx;
        const vy = rp.y - cy;
        const startAngle = Math.atan2(vy, vx);
        const radius = Math.hypot(vx, vy);
        const pts: { x: number; y: number }[] = [];
        for (let deg = 8; deg <= 50; deg += 6) {
          const a = startAngle + (deg * Math.PI) / 180;
          pts.push({ x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) });
        }
        return pts;
      },
      { rp: rot, cx: c0.x, cy: c0.y }
    );

    await page.mouse.move(rot.x, rot.y);
    await page.mouse.down();
    await page.waitForTimeout(120);
    for (const p of arc) {
      await page.mouse.move(p.x, p.y, { steps: 6 });
      await page.waitForTimeout(30);
    }
    await page.waitForTimeout(150);
    await page.mouse.up();
    await page.waitForTimeout(600); // finalize + rAF overlay refresh

    const post = await page.evaluate(() => {
      const canvas = document.getElementById("slateCanvas")!;
      const n = (window as any).__s.v2.nodes.one("ROT");

      // Ground truth via live DOM matrices (no library math copied): the
      // element's LOCAL untransformed bbox mapped through its screen CTM.
      const el = n.backgroundRect.node;
      const ctm = el.getScreenCTM();
      const bb = el.getBBox();
      const toPage = (x: number, y: number) => {
        const p = new DOMPoint(x, y).matrixTransform(ctm);
        return { x: p.x, y: p.y };
      };
      const center = toPage(bb.x + bb.width / 2, bb.y + bb.height / 2);
      const appliedDeg = (Math.atan2(ctm.b, ctm.a) * 180) / Math.PI;

      const dots: Record<string, { x: number; y: number }> = {};
      canvas
        .querySelectorAll("[class*='connection-handle'], [class*='handle_rot']")
        .forEach((d) => {
          const r = d.getBoundingClientRect();
          const cls = d.getAttribute("class") || "";
          const name =
            cls.match(/connection-handle-(\w+)/)?.[1] ||
            cls.match(/handle_rot(\w*)/)?.[0] ||
            "rot";
          dots[name] = { x: r.x + r.width / 2, y: r.y + r.height / 2 };
        });

      return {
        center,
        appliedDeg,
        rotation: n.getRotation(),
        sel: (window as any).__s.v2.selectedNodes.length,
        dots,
      };
    });

    // The rotate must not have dismissed the selection.
    expect(post.sel, "rotate drag released over canvas must keep the node selected").toBe(1);

    // Sanity: the drag really rotated the node a lot.
    expect(post.rotation, "rotate-handle drag must actually rotate the node").toBeGreaterThan(25);
    expect(post.appliedDeg, "live matrix must show the applied rotation").toBeGreaterThan(25);

    // Every affordance must have ORBITED by ~the applied rotation around the
    // (correctly transformed) node center, radius preserved. A stale or
    // detached overlay keeps pre-rotation angles => ~45 deg error.
    const checked = Object.keys(pre).filter((k) => k !== "rot");
    expect(checked.length).toBeGreaterThanOrEqual(4);
    for (const name of checked) {
      const before = pre[name];
      const p = post.dots[name];
      expect(p, `${name} vanished after rotate (overlay lost or hidden)`).toBeTruthy();
      const v0 = { x: before.x - c0.x, y: before.y - c0.y };
      const v1 = { x: p.x - post.center.x, y: p.y - post.center.y };
      const a0 = (Math.atan2(v0.y, v0.x) * 180) / Math.PI;
      const a1 = (Math.atan2(v1.y, v1.x) * 180) / Math.PI;
      let dAngle = a1 - a0 - post.appliedDeg;
      while (dAngle > 180) dAngle -= 360;
      while (dAngle < -180) dAngle += 360;
      const r0 = Math.hypot(v0.x, v0.y);
      const r1 = Math.hypot(v1.x, v1.y);
      // The rotate KNOB's resting placement is svg.select.js legacy geometry:
      // it is positioned above the bbox top edge, it does NOT orbit rigidly,
      // and its resting radius varies with the shape (docs/archive/ROTATION_HANDLE_FIX.md:
      // "current resize/rotate interaction is intentionally retained"). So the
      // knob only gets loose bounds: it moved with the rotation and stayed in
      // the neighborhood. (A detached overlay at the end of a rotate loses the
      // knob entirely — caught by the existence check above — and a fully
      // stalled knob would blow the angle bound.)
      const angleTol = name.startsWith("handle_rot") ? 35 : 10;
      const radiusTol = name.startsWith("handle_rot") ? 0.4 : 0.15;
      expect(
        Math.abs(dAngle),
        `${name} angle off by ${dAngle.toFixed(1)} deg (stale overlay?)`
      ).toBeLessThan(angleTol);
      expect(
        Math.abs(r1 - r0) / r0,
        `${name} radius drifted (stale overlay?)`
      ).toBeLessThan(radiusTol);
    }
  });
});
