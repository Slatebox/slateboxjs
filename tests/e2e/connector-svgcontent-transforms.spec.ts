import { test, expect } from "@playwright/test";

// The svgContent-outline attach must stay flush as the artwork node is transformed
// (move / resize / rotate), since the connector geometry re-solves per frame against
// the node's current screen CTM. Guards the robustness of the Image-#10 fix beyond
// the initial create.
test.describe("svgContent connector stays flush under transforms (§connector)", () => {
  test("arrow tip stays inside the flower fill after move, resize, and rotate", async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);

    const res = await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:820px;height:640px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      const s = await new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      ).init();
      (window as any).__s = s;
      const flower =
        "M 50 5 Q 60 5 62 15 Q 72 10 78 18 Q 88 18 88 30 Q 96 38 90 48 Q 96 58 86 64 Q 86 76 74 74 Q 68 84 58 78 Q 50 88 42 78 Q 32 84 26 74 Q 14 76 14 64 Q 4 58 10 48 Q 4 38 12 30 Q 12 18 22 18 Q 28 10 38 15 Q 40 5 50 5 Z";
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="${flower}" fill="#4051b5"/></svg>`;
      // Source well below-left so the approach is steeply diagonal into a lobe
      // (avoids the horizontal-into-a-concave-notch boundary case).
      const a = s.nodes.add(
        new sb.node({ id: "A", xPos: 90, yPos: 470, width: 90, height: 60, text: "A" })
      );
      const f = s.nodes.add(
        new sb.node({ id: "F", xPos: 380, yPos: 120, width: 130, height: 130, text: "", svgContent })
      );
      await new Promise((r) => setTimeout(r, 500));
      a.v2.relationships.addAssociation(f.v2);
      await new Promise((r) => setTimeout(r, 400));

      const assoc = Array.from(a.v2.relationships.assocMap.values())[0] as any;
      const resolve = () =>
        assoc.connector?.updateConnection?.(`${a.v2.id}->${assoc.childId}`, {});

      const tipInFill = () => {
        const p = document.querySelector('#slateCanvas path[connectortype="default"]') as any;
        const t = p.getTotalLength();
        const e = p.getPointAtLength(t);
        const back = p.getPointAtLength(Math.max(0, t - 6));
        const m = document.getElementById(
          (p.getAttribute("marker-end") || "").replace(/url\(#|\)/g, "")
        );
        const aw = m ? Number((m.getAttribute("viewBox") || "0 0 0 0").split(/\s+/)[2]) : 0;
        const tx = e.x - back.x, ty = e.y - back.y;
        const tm = Math.hypot(tx, ty) || 1;
        const tip = { x: e.x + (tx / tm) * aw, y: e.y + (ty / tm) * aw };
        // Nudge ~6px toward the node center before the fill test: a flush attach
        // (lobe OR shallow concave notch) is then inside the fill, while a bbox
        // corner float stays well outside — robust against boundary precision.
        const fo = (window as any).__s.v2.nodes.one("F").options;
        const cx = fo.x + fo.width / 2, cy = fo.y + fo.height / 2;
        const ndx = cx - tip.x, ndy = cy - tip.y;
        const nm = Math.hypot(ndx, ndy) || 1;
        tip.x += (ndx / nm) * 6;
        tip.y += (ndy / nm) * 6;
        const pathEl = document.querySelector('#slateCanvas [data-node-id="F"] path') as any;
        let root = pathEl.ownerSVGElement;
        while (root.ownerSVGElement) root = root.ownerSVGElement;
        const rc = root.getScreenCTM();
        const sx = tip.x * rc.a + tip.y * rc.c + rc.e;
        const sy = tip.x * rc.b + tip.y * rc.d + rc.f;
        const inv = pathEl.getScreenCTM().inverse();
        const q = root.createSVGPoint();
        q.x = sx * inv.a + sy * inv.c + inv.e;
        q.y = sx * inv.b + sy * inv.d + inv.f;
        return pathEl.isPointInFill(q);
      };

      const onCreate = tipInFill();

      // Move (keep the flower up-right of A so the approach stays diagonal)
      f.v2.options.x = 460;
      f.v2.options.y = 90;
      f.v2.applyPositionAndRotation();
      resolve();
      await new Promise((r) => setTimeout(r, 250));
      const afterMove = tipInFill();

      // Resize
      f.v2.setSize(210, 210);
      resolve();
      await new Promise((r) => setTimeout(r, 250));
      const afterResize = tipInFill();

      // Rotate
      f.v2.options.rotate = { rotationAngle: 60 };
      f.v2.applyPositionAndRotation();
      resolve();
      await new Promise((r) => setTimeout(r, 250));
      const afterRotate = tipInFill();

      return { onCreate, afterMove, afterResize, afterRotate };
    });

    expect(res.onCreate).toBe(true);
    expect(res.afterMove).toBe(true);
    expect(res.afterResize).toBe(true);
    expect(res.afterRotate).toBe(true);
  });
});
