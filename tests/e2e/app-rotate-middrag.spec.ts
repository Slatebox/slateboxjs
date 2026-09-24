import { test, expect } from "@playwright/test";
import { bootstrapGuestSlate } from "./app-host.shared";

// App-host mid-drag rotation verification.
// Manual gate tool (excluded from default CI via testIgnore). Run with a live
// Meteor app:  SLATEBOX_APP_EXTERNAL=true SLATEBOX_APP_URL=http://localhost:3100 \
//   npx playwright test app-rotate-middrag --config playwright.app.config.ts
// Samples element CTMs with the mouse STILL DOWN inside the real Meteor app.
// NOTE the two DOM traps the app has and the harness doesn't: (1) a
// BirdsEye/minimap second <svg> may exist — always scope to the MAIN canvas
// svg; (2) app chrome overlays can swallow mouse events — we log the drag
// state so a grip failure is distinguishable from a render failure
// (mid.dragModel moved but mid.visAngle didn't => render bug; neither
// moved => the drag never engaged the rotate plugin).
test.describe("app-host: rotation rotates visible content during the drag", () => {
  test("diamond + a seeded node: mid-drag artwork angle tracks the handle", async ({
    page,
  }) => {
    test.setTimeout(180_000);
    const APP_URL = process.env.SLATEBOX_APP_URL || "http://localhost:3000";
    await bootstrapGuestSlate(page, APP_URL);

    const svgSel = `(() => {
      const main = document.querySelector("#slateCanvas > svg") ||
        Array.from(document.querySelectorAll("#slateCanvas svg")).find(
          (s) => (s.querySelector("[data-node-id]")).length >= 1 && !s.closest("[class*=bird],[id*=bird],[class*=Bird],[class*=mini],[id*=mini]")
        ) || document.querySelector("#slateCanvas svg");
      return main;
    })()`;

    const made = await page.evaluate(() => {
      const w = window as any;
      if (!w.slate || typeof w.Node !== "function") {
        return { ok: false, why: `globals: slate=${!!w.slate} Node=${typeof w.Node}` };
      }
      const s = w.slate.v2 || w.slate;
      const vb = s.canvas?.viewbox?.();
      // center-ish placement in canvas coords, away from chrome edges
      const cx = vb ? vb.x + vb.w * 0.15 : 100;
      const cy = vb ? vb.y + vb.h * 0.6 : 400;
      const n = new w.Node({
        id: "APPR1",
        xPos: cx,
        yPos: cy,
        width: 140,
        height: 140,
        text: "DIAMOND",
        shape: "diamond",
      });
      s.nodes.add(n);
      return { ok: true, n: s.nodes.allNodes.length };
    });
    expect(made.ok, made.why || "diamond created").toBe(true);
    // give the async node pipeline time to finish (createAsync + finishCreate)
    await page.waitForTimeout(1600);

    const ids = ["APPR1"];
    const firstSeed = await page.evaluate(() => {
      const s = (window as any).slate.v2 || (window as any).slate;
      return s.nodes.allNodes.find((x: any) => x.id !== "APPR1")?.id;
    });
    if (firstSeed) ids.push(firstSeed);

    for (const id of ids) {
      // Pan the viewport so the node is on-screen (app canvases can span
      // thousands of units; an off-screen grip point tests nothing).
      await page.evaluate((nid: string) => {
        const s = (window as any).slate.v2 || (window as any).slate;
        const n = s.nodes.one(nid);
        const o = n?.options || {};
        s.canvas.viewbox(
          (o.x || 0) + (o.width || 0) / 2 - 600,
          (o.y || 0) + (o.height || 0) / 2 - 450,
          1200,
          900
        );
      }, id);
      await page.waitForTimeout(400);
      await page.evaluate((nid: string) => {
        const s = (window as any).slate.v2 || (window as any).slate;
        s.selectNodes([s.nodes.one(nid)]);
      }, id);
      await page.waitForTimeout(700);

      const geom = await page.evaluate((nid: string) => {
        // main canvas svg = biggest svg on the page (minimap is small)
        const svgs = Array.from(document.querySelectorAll("#slateCanvas svg"));
        const main = svgs.sort(
          (a: any, b: any) =>
            b.getBoundingClientRect().width - a.getBoundingClientRect().width
        )[0] as SVGSVGElement;
        const g = main.querySelector(`[data-node-id="${nid}"]`) as SVGGElement;
        if (!g) return null;
        const r = g.getBoundingClientRect();
        // look for the rotate handle INSIDE the main canvas svg first
        let rot = main.querySelector("g.svg_select_handle_rot");
        let layer = "mainSvg";
        if (!rot) {
          rot = document.querySelector("g.svg_select_handle_rot");
          layer = rot ? "DOCUMENT-OTHER (not main svg!)" : "NONE";
        }
        const c: any = rot ? rot.querySelector("circle") || rot : null;
        if (!c) return { layer, miss: "no handle"};
        const cr = c.getBoundingClientRect();
        const hit = document.elementFromPoint(cr.x + cr.width / 2, cr.y + cr.height / 2);
        return {
          layer,
          hitEl: hit ? hit.tagName + "." + (hit.getAttribute?.("class") || "") : "none",
          mainW: Math.round(main.getBoundingClientRect().width),
          cx: Math.round(r.x + r.width / 2), cy: Math.round(r.y + r.height / 2),
          hx: Math.round(cr.x + cr.width / 2), hy: Math.round(cr.y + cr.height / 2),
        };
      }, id);
      console.log(`GEOM ${id}:`, JSON.stringify(geom));
      console.log(`GEOM ${id}:`, JSON.stringify(geom));
      const gx = geom && (geom as any).hx;
      expect(gx, `grip x on-screen for ${id}: ${JSON.stringify(geom)}`).toBeGreaterThan(0);
      expect(gx, `grip y on-screen for ${id}`).toBeGreaterThan(0);

      const sample = () =>
        page.evaluate((nid: string) => {
          const svgs = Array.from(document.querySelectorAll("#slateCanvas svg"));
          const main = svgs.sort(
            (a: any, b: any) =>
              b.getBoundingClientRect().width - a.getBoundingClientRect().width
          )[0] as SVGSVGElement;
          const rm: any = (main as any).getScreenCTM?.();
          const ra = rm ? Math.atan2(rm.b, rm.a) * (180 / Math.PI) : 0;
          const g = main.querySelector(`[data-node-id="${nid}"]`)!;
          const vis: any =
            g.querySelector("path[data-shape-path]") || g.querySelector("svg");
          const m = vis ? vis.getScreenCTM() : null;
          const ang = m
            ? +(Math.atan2(m.b, m.a) * (180 / Math.PI) - ra).toFixed(1)
            : null;
          const n = ((window as any).slate.v2 || (window as any).slate).nodes.one(nid);
          return {
            ang,
            model: +(n?.options?.rotate?.rotationAngle ?? 0).toFixed(1),
          };
        }, id);

      const before = await sample();
      const r0 = Math.hypot(geom!.hx - geom!.cx, geom!.hy - geom!.cy);
      const a0 = Math.atan2(geom!.hy - geom!.cy, geom!.hx - geom!.cx);
      await page.mouse.move(geom!.hx, geom!.hy);
      await page.mouse.down();
      for (let s = 1; s <= 12; s++) {
        const a = a0 + (Math.PI / 4) * (s / 12);
        await page.mouse.move(
          geom!.cx + r0 * Math.cos(a),
          geom!.cy + r0 * Math.sin(a),
          { steps: 1 }
        );
        await page.waitForTimeout(20);
      }
      const mid = await sample(); // MOUSE STILL DOWN
      await page.screenshot({ path: `test-results/mid-drag-${id}.png` });
      console.log(`MID-DIAG ${id}: before=${JSON.stringify(before)} mid=${JSON.stringify(mid)}`);
      await page.mouse.up();
      await page.waitForTimeout(800);
      const after = await sample();
      console.log(`AFTER-DIAG ${id}: ${JSON.stringify(after)}`);

      // Render assertion: visible artwork rotated during the drag.
      expect(Math.abs(mid.ang ?? 0) - Math.abs(before.ang ?? 0)).toBeGreaterThan(20);
      expect(Math.abs(after.model)).toBeGreaterThan(20);
    }
  });
});
