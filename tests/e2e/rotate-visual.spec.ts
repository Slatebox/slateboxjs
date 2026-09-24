import { test, expect } from "@playwright/test";

// Visual rotation regression suite.
//
// Why this exists: earlier rotation verification measured MODEL state / plugin
// transforms, not rendered pixels — a class of bug ("the dashed selection
// outline rotates, the actual box does not") slipped through because nothing
// asserted that the VISIBLE content angle changes after a rotate-handle drag.
// Every test here measures the visual angle of the rendered artwork via
// getScreenCTM, in node-local terms (relative to the canvas root CTM).

test.describe("visual rotation via rotate-handle drag", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => (window as any).Slatebox);
    await page.evaluate(() => {
      const sb = (window as any).Slatebox;
      const div = document.createElement("div");
      div.id = "slateCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      (window as any).__s = new sb.slate(
        { container: "slateCanvas", allowCollaboration: false },
        {}
      );
    });
  });

  // Select a node and grab its rotate handle, then drag 90° around the node
  // center. Selects via slate.selectNodes (the canonical selection pipeline)
  // so handles are mounted deterministically.
  const rotateDrag = async (page: any, nodeId: string) => {
    const ok = await page.evaluate(
      (id: string) => {
        const s = (window as any).__s;
        const v2 = s.v2 || s;
        const n = v2.nodes.one(id);
        if (!n) return false;
        v2.selectNodes([n]);
        return true;
      },
      nodeId
    );
    if (!ok) throw new Error(`node ${nodeId} not found`);
    await page.waitForTimeout(700);

    const geom = await page.evaluate((id: string) => {
      const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`);
      const r = g?.getBoundingClientRect();
      const rot = document.querySelector("g.svg_select_handle_rot");
      const c = rot ? (rot.querySelector("circle") || rot) : null;
      const cr = c?.getBoundingClientRect();
      if (!r || !cr) return null;
      return {
        cx: r.x + r.width / 2,
        cy: r.y + r.height / 2,
        hx: cr.x + cr.width / 2,
        hy: cr.y + cr.height / 2,
      };
    }, nodeId);
    if (!geom) throw new Error(`no rotate handle for ${nodeId}`);

    const r0 = Math.hypot(geom.hx - geom.cx, geom.hy - geom.cy);
    const a0 = Math.atan2(geom.hy - geom.cy, geom.hx - geom.cx);
    await page.mouse.move(geom.hx, geom.hy);
    await page.mouse.down();
    for (let s = 1; s <= 24; s++) {
      const a = a0 + (Math.PI / 2) * (s / 24);
      await page.mouse.move(
        geom.cx + r0 * Math.cos(a),
        geom.cy + r0 * Math.sin(a),
        { steps: 2 }
      );
      await page.waitForTimeout(16);
    }
    await page.mouse.up();
    await page.waitForTimeout(900);
  };

  const measure = async (page: any, nodeId: string) =>
    page.evaluate((id: string) => {
      const g = document.querySelector(`#slateCanvas [data-node-id="${id}"]`);
      const svgRoot: any = document.querySelector("#slateCanvas svg");
      const rootM = svgRoot?.getScreenCTM?.();
      const rootAngle = rootM
        ? (Math.atan2(rootM.b, rootM.a) * 180) / Math.PI
        : 0;
      // find the VISIBLE artwork: content path (shapes) or nested svg
      const vis: any =
        g?.querySelector("path[data-shape-path]") ||
        g?.querySelector("svg") ||
        g?.querySelector("rect");
      const m: any = vis?.getScreenCTM?.();
      const visualAngle = m
        ? (Math.atan2(m.b, m.a) * 180) / Math.PI - rootAngle
        : null;
      const gb = g?.getBoundingClientRect();
      const sel = document.querySelector(".svg_select_shape");
      const sb_ = sel?.getBoundingClientRect();
      // ghost distance: |AABB(selected-outline) - AABB(node content)| manhattan
      const ghostGap = sel && gb && sb_
        ? Math.abs(sb_.x - gb.x) + Math.abs(sb_.y - gb.y) +
          Math.abs(sb_.width - gb.width) + Math.abs(sb_.height - gb.height)
        : null;
      const n = (window as any).__s.v2.nodes.one(id) || (window as any).__s.nodes.one(id);
      return {
        visualAngle,
        modelRot: n?.options?.rotate?.rotationAngle ?? 0,
        ghostGap,
        groupHasRotate: (g?.getAttribute("transform") || "").includes("rotate"),
      };
    }, nodeId);

  test("text node: visible content rotates after drag (not just the overlay)", async ({
    page,
  }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = await (window as any).__s.init();
      s.nodes.add(
        new sb.node({ id: "RV1", xPos: 300, yPos: 250, width: 200, height: 110, text: "ROTATE ME" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });
    await rotateDrag(page, "RV1");
    const m = await measure(page, "RV1");
    expect(Math.abs(m.visualAngle ?? 0)).toBeGreaterThan(30); // VISIBLE change
    expect(Math.abs(m.modelRot)).toBeGreaterThan(30); // model agrees
    expect(m.groupHasRotate).toBe(true); // canonical: group transform carries it
  });

  test("custom shape (diamond): artwork rotates, no ghost-only outline", async ({
    page,
  }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = await (window as any).__s.init();
      s.nodes.add(
        new sb.node({ id: "RD1", xPos: 300, yPos: 240, width: 150, height: 150, text: "DIA", shape: "diamond" })
      );
      await new Promise((r) => setTimeout(r, 500));
    });
    await rotateDrag(page, "RD1");
    const m = await measure(page, "RD1");
    expect(Math.abs(m.visualAngle ?? 0)).toBeGreaterThan(30);
    expect(Math.abs(m.modelRot)).toBeGreaterThan(30);
    // After release the selection overlay must re-sync (finalizeInteraction
    // refreshes selection): a large persistent gap = ghost-outline bug.
    expect(m.ghostGap).not.toBeNull();
    expect(m.ghostGap!).toBeLessThan(120); // AABB gap tolerance for ~150px diamond
  });

  test("rotation persists through serialize → reload and re-applies", async ({
    page,
  }) => {
    await page.evaluate(async () => {
      const sb = (window as any).Slatebox;
      const s = await (window as any).__s.init();
      s.nodes.add(
        new sb.node({ id: "RS1", xPos: 300, yPos: 250, width: 160, height: 100, text: "PERSIST", shape: "diamond" })
      );
      await new Promise((r) => setTimeout(r, 400));
    });
    await rotateDrag(page, "RS1");
    const after = await measure(page, "RS1");
    expect(Math.abs(after.modelRot)).toBeGreaterThan(30);

    // reload path: fresh slate loads the exported JSON; rotation must re-apply
    const reloaded = await page.evaluate(() => {
      const sb = (window as any).Slatebox;
      const s = (window as any).__s;
      const json = s.exportJSON();
      const div = document.createElement("div");
      div.id = "reloadCanvas";
      div.style.cssText =
        "width:900px;height:600px;position:fixed;top:0;left:910px;z-index:1000;background:#fff";
      document.body.appendChild(div);
      return new sb.slate({ container: "reloadCanvas", allowCollaboration: false }, {})
        .init()
        .then(async (s2: any) => {
          await s2.loadJSON(json);
          await new Promise((r) => setTimeout(r, 800));
          const g = document.querySelector('#reloadCanvas [data-node-id="RS1"]');
          const vis: any =
            g?.querySelector("path[data-shape-path]") || g?.querySelector("svg");
          const m: any = vis?.getScreenCTM?.();
          const rootM: any = (document.querySelector("#reloadCanvas svg") as any)?.getScreenCTM?.();
          const ang = m && rootM
            ? (Math.atan2(m.b, m.a) * 180) / Math.PI -
              (Math.atan2(rootM.b, rootM.a) * 180) / Math.PI
            : null;
          return {
            ang,
            tr: g?.getAttribute("transform") || "",
            count: document.querySelectorAll("#reloadCanvas [data-node-id]").length,
          };
        });
    });
    expect(reloaded.count).toBe(1);
    expect(reloaded.tr).toContain("rotate");
    expect(Math.abs(reloaded.ang ?? 0)).toBeGreaterThan(30);
  });
});
