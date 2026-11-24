import { test, expect, type Page } from "@playwright/test";

// Owner report (test.slatebox.com, slate 301898fc07): a star added from the
// quick-add menu on a zoomed slate (1) animated wildly across the canvas before
// settling, and (2) its plug dot added a sibling with a giant diagonal line,
// a square preview and squares in the bird's-eye view; zoom to fit then showed
// what looked like a third note. The saved notes carry the star in CANVAS
// coordinates ("M10041.91,10057.85 C…", the app's quick-add translates the path
// to where the note lands). Everything that took the outline's own bounds as the
// note's box went thousands of pixels astray.
//
// These checks drive each shape the way the app makes it, at several zoom
// levels and after panning: every animation is sampled frame by frame and must
// stay with its note; the plug dot's preview, the new note, its line, the
// bird's-eye view, zoom to fit and the saved/reloaded slate must keep the shape.

const STAR_24 =
  "M16.985 19.501l-.952-5.55 4.033-3.932-5.574-.81L12 4.16 9.508 9.21l-5.574.81 4.033 3.931-.952 5.551L12 16.881l4.985 2.62z";
// A shape-maker outline (normalised, with its custom-shape options).
const BLOB = "M50 0C80 0 100 20 100 50C100 80 80 100 50 100C20 100 0 80 0 50C0 20 20 0 50 0ZM50 30C40 30 30 40 30 50C30 60 40 70 50 70C60 70 70 60 70 50C70 40 60 30 50 30Z";
// An AI-generated outline: a lightning bolt drawn in a 0..200 box, offset.
const AI_BOLT = "M120 10 L60 110 L100 110 L70 190 L150 80 L108 80 L140 10 Z";

const ANIMATIONS = [
  "mystery", "fadeSlideUp", "fadeSlideDown", "bumpUpIn", "bumpDownIn", "impactSlide",
  "powerSmash", "torqueWarp", "unroll", "smoke", "fractured", "flux", "springy",
  "breathe", "pulse", "rotate",
];

type Variant = "quickAddStar" | "namedStar" | "customShape" | "aiShape" | "circle" | "diamond" | "rotatedStar" | "rectangle";
const VARIANTS: Variant[] = ["quickAddStar", "namedStar", "customShape", "aiShape", "circle", "diamond", "rotatedStar", "rectangle"];

async function boot(page: Page) {
  page.on("pageerror", (e) => console.log("pageerror", e.message));
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(({ STAR_24, BLOB, AI_BOLT }) => {
    const w = window as any;
    const sb = w.Slatebox;
    // The options the app hands the engine for each kind of note.
    w.__optsFor = (variant: string, id: string, x: number, y: number) => {
      const base: any = { id, xPos: x, yPos: y, text: "", backgroundColor: "#f5c518", borderColor: "#333", borderWidth: 2 };
      switch (variant) {
        case "quickAddStar":
        case "rotatedStar": {
          // ui/components/node/addNote.js on a slate's first note: T10000,10000s6,6.
          const path = sb.utils._transformPath(STAR_24, "T10000,10000s6,6");
          const bb = sb.utils.getBBox({ path });
          return { ...base, width: bb.width, height: bb.height, vectorPath: path, shapeHint: "star",
            ...(variant === "rotatedStar" ? { rotate: { rotationAngle: 30 } } : {}) };
        }
        case "namedStar": return { ...base, width: 120, height: 110, shape: "star" };
        case "customShape": return { ...base, width: 150, height: 150, shape: "custom", vectorPath: BLOB, fillRule: "evenodd", textBox: null, shapeRef: { name: "ring" } };
        case "aiShape": {
          // AI outlines arrive in their own drawing box, then get placed like quick-add shapes.
          const path = sb.utils._transformPath(AI_BOLT, "T9800,9900");
          const bb = sb.utils.getBBox({ path });
          return { ...base, width: bb.width, height: bb.height, vectorPath: path, shapeHint: "custom" };
        }
        case "circle": return { ...base, width: 110, height: 110, shape: "circle" };
        case "diamond": return { ...base, width: 140, height: 100, shape: "diamond" };
        // A plain note: no resize proxy, the animation runs on the rectangle itself.
        case "rectangle": return { ...base, width: 160, height: 90 };
      }
      return base;
    };
    w.__mkSlate = async (id: string) => {
      document.getElementById(id)?.remove();
      const div = document.createElement("div");
      div.id = id;
      div.style.cssText = "width:1100px;height:760px;position:fixed;top:0;left:0;z-index:1000;background:#fff";
      document.body.appendChild(div);
      return new sb.slate({ container: id, allowCollaboration: false, showbirdsEye: true }, {}).init();
    };
    w.__rect = (e: Element) => { const q = e.getBoundingClientRect(); return { x: q.x, y: q.y, w: q.width, h: q.height, cx: q.x + q.width / 2, cy: q.y + q.height / 2 }; };
    // A note's box on screen: the selector's proxy rectangle, which no animation moves;
    // a plain note (no proxy, its rectangle is what animates) from its saved box.
    w.__box = (n: any) => {
      if (n.resizeTarget) return w.__rect(n.resizeTarget.node);
      const m = (n.svgGroup.root().node as SVGSVGElement).getScreenCTM()!;
      const { x, y, width, height } = n.options;
      const p = (px: number, py: number) => ({ x: px * m.a + py * m.c + m.e, y: px * m.b + py * m.d + m.f });
      const a = p(x, y);
      const b = p(x + width, y + height);
      return { x: a.x, y: a.y, w: b.x - a.x, h: b.y - a.y, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 };
    };
    w.__wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
  }, { STAR_24, BLOB, AI_BOLT });
}

/**
 * Put one note per animation on a slate, zoom/pan it, run them all at once and
 * report, per animation, how far the animated outline's centre strayed from the
 * note's resting centre (in note sizes), and whether it came back.
 */
async function sampleAnimations(page: Page, variant: Variant, zoom: number, pan: { x: number; y: number }) {
  return page.evaluate(async ({ variant, zoom, pan, ANIMATIONS }) => {
    const w = window as any;
    const sb = w.Slatebox;
    const s = await w.__mkSlate("animSlate");
    const nodes = ANIMATIONS.map((name: string, i: number) =>
      s.nodes.add(new sb.node(w.__optsFor(variant, `N${i}`, 200 + (i % 4) * 260, 150 + Math.floor(i / 4) * 240))).v2);
    await Promise.all(nodes.map((n: any) => n.ready));
    s.v2.zoom(zoom);
    s.v2.panZoom.panBy(pan);
    await w.__wait(300);
    // What the person sees of each note: its outline (the path inside a path shape).
    const visual = (n: any) => (n.contentPath ?? n.backgroundRect).node as Element;
    const rest = nodes.map((n: any) => w.__rect(visual(n)));
    nodes.forEach((n: any, i: number) => n.filters.applyAnimation(ANIMATIONS[i], "vect"));
    const worst = nodes.map(() => 0);
    const changed = nodes.map(() => false);
    const t0 = performance.now();
    await new Promise<void>((done) => {
      const tick = () => {
        nodes.forEach((n: any, i: number) => {
          const f = w.__rect(visual(n));
          const size = Math.max(rest[i].w, rest[i].h, 1);
          const dev = Math.hypot(f.cx - rest[i].cx, f.cy - rest[i].cy) / size;
          if (!Number.isFinite(dev)) worst[i] = Infinity;
          else worst[i] = Math.max(worst[i], dev);
          if (Math.abs(f.w - rest[i].w) > 1 || Math.abs(f.cx - rest[i].cx) > 1 || Math.abs(f.cy - rest[i].cy) > 1) changed[i] = true;
        });
        if (performance.now() - t0 < 900) requestAnimationFrame(tick); else done();
      };
      requestAnimationFrame(tick);
    });
    const settled = nodes.map((n: any, i: number) => {
      if (ANIMATIONS[i] === "breathe" || ANIMATIONS[i] === "pulse" || ANIMATIONS[i] === "rotate") return true;
      const f = w.__rect(visual(n));
      return Math.abs(f.cx - rest[i].cx) < 2 && Math.abs(f.cy - rest[i].cy) < 2;
    });
    return ANIMATIONS.map((name: string, i: number) => ({ name, worst: Math.round(worst[i] * 100) / 100, changed: changed[i], settled: settled[i] }));
  }, { variant, zoom, pan, ANIMATIONS });
}

test.describe("a zoomed slate keeps every shape's animations, sibling, line and preview on the note", () => {
  test.describe.configure({ mode: "parallel" });

  for (const variant of VARIANTS) {
    test(`animations stay with the note: ${variant} at several zoom levels and after panning`, async ({ page }) => {
      test.setTimeout(90_000);
      await boot(page);
      const views = [
        { zoom: 0.5, pan: { x: 0, y: 0 } },
        { zoom: 1, pan: { x: 0, y: 0 } },
        { zoom: 1.6, pan: { x: -180, y: 90 } },
        { zoom: 2.5, pan: { x: -600, y: -300 } },
      ];
      for (const view of views) {
        const res = await sampleAnimations(page, variant, view.zoom, view.pan);
        for (const r of res) {
          // The strongest entrances travel about two note sizes by design
          // (impact slide starts two widths to the left); anything further is the
          // outline flying across the canvas.
          expect.soft(r.worst, `${variant} ${r.name} at ${view.zoom}x strayed ${r.worst} note sizes`).toBeLessThanOrEqual(3);
          expect.soft(r.settled, `${variant} ${r.name} at ${view.zoom}x settles on the note`).toBe(true);
        }
        // The outline really animates (WebKit ignored transforms on the shape's nested <svg>).
        const smash = res.find((r) => r.name === "powerSmash")!;
        expect.soft(smash.changed, `${variant} power smash moves the outline`).toBe(true);
      }
    });

    // As the owner did: an animation chosen first (power smash, finished; rotate, still running), or none;
    // and an entrance caught mid-flight (impact slide held at 20 ms, the note drawn far to its left).
    for (const animation of ["none", "powerSmash", "rotate", "impactSlideHeld"]) test(`the plug dot adds a matching sibling: ${variant}, zoomed and panned, animation ${animation}`, async ({ page }) => {
      test.setTimeout(60_000);
      await boot(page);
      const zoom = 1.6;
      const setup = await page.evaluate(async ({ variant, zoom, animation }) => {
        const w = window as any;
        const sb = w.Slatebox;
        const s = await w.__mkSlate("slateCanvas");
        w.__slate = s;
        // The saved quick-add note sat at x 815.6, y 403.5 on the owner's slate.
        const a = s.nodes.add(new sb.node(w.__optsFor(variant, "A", 300, 250))).v2;
        await a.ready;
        s.v2.zoom(zoom);
        s.v2.panZoom.panBy({ x: -120, y: 60 });
        await w.__wait(300);
        if (animation === "impactSlideHeld") {
          a.filters.applyAnimation("impactSlide", "vect");
          await w.__wait(30);
          document.getAnimations().forEach((an: any) => { an.pause(); an.currentTime = 20; });
        } else if (animation !== "none") {
          a.filters.applyAnimation(animation, "vect");
          await w.__wait(800);
        }
        s.v2.selectNodes([a]);
        await w.__wait(300);
        const h = document.querySelector("#slateCanvas .connection-handle-right") as SVGGraphicsElement | null;
        const hr = h && h.getBoundingClientRect();
        return {
          handle: hr ? { x: hr.x + hr.width / 2, y: hr.y + hr.height / 2 } : null,
          aBefore: w.__box(a),
          aOpts: { x: a.options.x, y: a.options.y, w: a.options.width, h: a.options.height, shape: a.options.shape, vectorPath: a.options.vectorPath, rot: a.options.rotate?.rotationAngle || 0 },
        };
      }, { variant, zoom, animation });
      expect(setup.handle).not.toBeNull();

      // The ghost the plug dot shows has the note's shape, next to the note.
      await page.mouse.move(setup.handle!.x, setup.handle!.y);
      await page.waitForTimeout(300);
      const preview = await page.evaluate(() => {
        const w = window as any;
        const a = w.__slate.v2.nodes.one("A") as any;
        const p = a.connectionPreview;
        if (!p?.node) return null;
        const el = p.node.node as Element;
        return { tag: el.tagName.toLowerCase(), outline: el.getAttribute("data-preview-shape"), rect: w.__rect(el) };
      });
      expect.soft(preview, "the plug dot shows a preview").not.toBeNull();
      if (variant === "circle") expect.soft(preview!.tag).toBe("circle");
      else if (variant === "rectangle") expect.soft(preview!.outline).not.toBe("path");
      else expect.soft(preview!.outline, `${variant} preview is the note's outline, not a square`).toBe("path");
      const size = Math.max(setup.aBefore.w, setup.aBefore.h);
      expect.soft(Math.hypot(preview!.rect.cx - setup.aBefore.cx, preview!.rect.cy - setup.aBefore.cy)).toBeLessThan(size * 3);

      await page.mouse.click(setup.handle!.x, setup.handle!.y);
      await page.waitForTimeout(700);
      // The sibling was placed while the entrance was held; measure the result at rest.
      if (animation === "impactSlideHeld") await page.evaluate(() => document.getAnimations().forEach((an: any) => an.finish()));

      const after = await page.evaluate(() => {
        const w = window as any;
        const s = w.__slate.v2;
        const a = s.nodes.one("A");
        const b = s.nodes.allNodes.find((n: any) => n.id !== "A");
        const lines = [...document.querySelectorAll('#slateCanvas path[connectortype="default"]')].map((p) => w.__rect(p));
        const mini = [...document.querySelectorAll("#slateCanvas .slateboxjs-birdseye-nodes > *")].map((e) => ({ tag: e.tagName.toLowerCase(), outline: e.getAttribute("data-birdseye-outline") }));
        const json = JSON.parse(typeof s.exportJSON() === "string" ? s.exportJSON() : JSON.stringify(s.exportJSON()));
        const saved = (json.nodes || []).map((n: any) => ({ id: n.options?.id ?? n.id, vectorPath: n.options?.vectorPath ?? n.vectorPath, shape: n.options?.shape ?? n.shape }));
        return {
          aRect: w.__box(a),
          aOutline: w.__rect((a.contentPath ?? a.backgroundRect).node),
          bRect: b && w.__box(b),
          bOutline: b && w.__rect((b.contentPath ?? b.backgroundRect).node),
          bOpts: b && { x: b.options.x, y: b.options.y, w: b.options.width, h: b.options.height, shape: b.options.shape, vectorPath: b.options.vectorPath, rot: b.options.rotate?.rotationAngle || 0 },
          aVectorPath: a.options.vectorPath,
          linked: !!a.relationships?.getAssociation?.(b?.id),
          lines,
          mini,
          saved,
        };
      });
      expect(after.bOpts, "a sibling was added").toBeTruthy();
      // The view may follow the new note into sight, but both notes stay on the
      // canvas: adding the sibling does not throw the view thousands of pixels away.
      for (const r of [after.aRect, after.bRect!]) {
        expect.soft(r.x, "note on the canvas after the sibling is added").toBeGreaterThanOrEqual(-2);
        expect.soft(r.y).toBeGreaterThanOrEqual(-2);
        expect.soft(r.x + r.w).toBeLessThanOrEqual(1100 + 2);
        expect.soft(r.y + r.h).toBeLessThanOrEqual(760 + 2);
      }
      expect.soft(Math.abs(after.aRect.cx - setup.aBefore.cx)).toBeLessThan(1100);
      // The sibling keeps the shape, size and turn.
      expect.soft(after.bOpts!.shape).toBe(setup.aOpts.shape);
      expect.soft(after.bOpts!.vectorPath).toBe(after.aVectorPath);
      expect.soft(after.bOpts!.w).toBeCloseTo(setup.aOpts.w, 1);
      expect.soft(after.bOpts!.h).toBeCloseTo(setup.aOpts.h, 1);
      expect.soft(after.bOpts!.rot).toBe(setup.aOpts.rot);
      // Placed beside the note: 75 world units edge to edge for an unturned note.
      if (!setup.aOpts.rot) {
        expect.soft(after.bOpts!.x).toBeCloseTo(setup.aOpts.x + setup.aOpts.w + 75, 0);
        expect.soft(after.bOpts!.y).toBeCloseTo(setup.aOpts.y, 0);
        expect.soft(after.bRect!.x - (after.aRect.x + after.aRect.w)).toBeGreaterThan(75 * zoom * 0.8);
        expect.soft(after.bRect!.x - (after.aRect.x + after.aRect.w)).toBeLessThan(75 * zoom * 1.2);
      }
      const centres = Math.hypot(after.bOutline!.cx - after.aOutline.cx, after.bOutline!.cy - after.aOutline.cy);
      expect.soft(centres).toBeLessThan(size * 3);
      // The outline is drawn where the note is (not offset from it).
      expect.soft(Math.abs(after.bOutline!.cx - after.bRect!.cx)).toBeLessThan(size * 0.3);
      // The line joins the two notes and is short.
      expect.soft(after.linked).toBe(true);
      expect.soft(after.lines.length).toBeGreaterThan(0);
      const box = {
        x1: Math.min(after.aRect.x, after.bRect!.x) - size, y1: Math.min(after.aRect.y, after.bRect!.y) - size,
        x2: Math.max(after.aRect.x + after.aRect.w, after.bRect!.x + after.bRect!.w) + size,
        y2: Math.max(after.aRect.y + after.aRect.h, after.bRect!.y + after.bRect!.h) + size,
      };
      for (const l of after.lines) {
        expect.soft(l.x, "line starts by the notes").toBeGreaterThanOrEqual(box.x1);
        expect.soft(l.y).toBeGreaterThanOrEqual(box.y1);
        expect.soft(l.x + l.w, "line ends by the notes").toBeLessThanOrEqual(box.x2);
        expect.soft(l.y + l.h).toBeLessThanOrEqual(box.y2);
      }
      // The bird's-eye view draws both notes with the note's outline.
      expect.soft(after.mini.length).toBe(2);
      for (const m of after.mini) {
        if (variant === "circle") expect.soft(m.tag).toBe("circle");
        else if (variant === "rectangle") expect.soft(m.tag).toBe("rect");
        else expect.soft(m.outline, `${variant} minimap draws the outline, not a square`).toBe("1");
      }
      // Saved: both notes carry the same outline, at its own origin (not canvas coordinates).
      expect.soft(after.saved.length).toBe(2);
      expect.soft(after.saved[0].vectorPath).toBe(after.saved[1].vectorPath);
      const displaced = await page.evaluate((paths: string[]) => paths.map((p) => {
        if (!p || !/^\s*[Mm]/.test(p)) return false;
        const bb = (window as any).Slatebox.utils.getBBox({ path: p });
        return Math.abs(bb.x) > Math.max(bb.width, bb.height) || Math.abs(bb.y) > Math.max(bb.width, bb.height);
      }), after.saved.map((n: any) => n.vectorPath));
      expect.soft(displaced).toEqual([false, false]);

      // Zoom to fit shows the two notes and nothing else: no line running off the canvas.
      const fit = await page.evaluate(async () => {
        const w = window as any;
        const s = w.__slate.v2;
        s.fitToContent();
        await w.__wait(500);
        const c = document.getElementById("slateCanvas")!.getBoundingClientRect();
        const rects = s.nodes.allNodes.map((n: any) => w.__box(n));
        const lines = [...document.querySelectorAll('#slateCanvas path[connectortype="default"]')].map((p) => w.__rect(p));
        return { c: { x: c.x, y: c.y, w: c.width, h: c.height }, rects, lines };
      });
      for (const r of [...fit.rects, ...fit.lines]) {
        expect(r.x).toBeGreaterThanOrEqual(fit.c.x - 2);
        expect(r.y).toBeGreaterThanOrEqual(fit.c.y - 2);
        expect(r.x + r.w).toBeLessThanOrEqual(fit.c.x + fit.c.w + 2);
        expect(r.y + r.h).toBeLessThanOrEqual(fit.c.y + fit.c.h + 2);
      }
    });
  }

  // Review of the first fix: animating the outline inside the stretched nested <svg>
  // squashed turning shapes, and showed animated notes with a thicker border.
  test("a turning shape on a stretched note turns rigidly, and an animated note looks like an unanimated one", async ({ page }) => {
    await boot(page);
    const res = await page.evaluate(async () => {
      const w = window as any;
      const sb = w.Slatebox;
      const s = await w.__mkSlate("turnSlate");
      const quick = w.__optsFor("quickAddStar", "Q", 0, 0);
      const specs = [
        { id: "D", opts: { ...w.__optsFor("diamond", "D", 120, 120), width: 140, height: 100 } },
        { id: "S", opts: { ...w.__optsFor("namedStar", "S", 420, 120), width: 330, height: 110 } },
        { id: "Q", opts: { ...quick, xPos: 120, yPos: 420, width: 300, height: 100 } },
        { id: "C", opts: { ...w.__optsFor("customShape", "C", 520, 420), width: 260, height: 100 } },
      ];
      const nodes = specs.map((sp) => s.nodes.add(new sb.node(sp.opts)).v2);
      // Twins without animation, to compare how the shape element looks at rest.
      const twin = s.nodes.add(new sb.node({ ...w.__optsFor("namedStar", "T", 420, 520), width: 330, height: 110 })).v2;
      await Promise.all([...nodes, twin].map((n: any) => n.ready));
      s.v2.zoom(1.3);
      await w.__wait(200);
      const out: any = {};
      for (const n of nodes) {
        const outline = (n.contentPath ?? n.backgroundRect).node as SVGGraphicsElement;
        const rest = w.__rect(outline);
        n.filters.applyAnimation("rotate", "vect");
        await w.__wait(50);
        const host = (n.backgroundRect.node as Element).parentNode as Element;
        // Every animation running in this note, wherever the engine plays it.
        const anims = document.getAnimations().filter((an: any) => n.svgGroup.node.contains(an.effect?.target));
        const at = (ms: number) => {
          anims.forEach((a: any) => { a.pause(); a.currentTime = ms; });
          return w.__rect(outline);
        };
        // rotate: 8s per turn → 2000 ms is 90°, 4000 ms is 180°.
        out[n.id] = { rest, d90: at(2000), d180: at(4000), animations: anims.length, hostTag: host.tagName.toLowerCase() };
      }
      // A finished entrance on the star: same overflow (border clipping) as its unanimated twin.
      const star = nodes[1];
      star.filters.applyAnimation("powerSmash", "vect");
      await w.__wait(900);
      out.overflow = {
        animated: getComputedStyle(star.backgroundRect.node).overflow,
        twin: getComputedStyle(twin.backgroundRect.node).overflow,
      };
      // Reshaping an animated note leaves no empty animation host behind.
      star.setShape("diamond");
      await w.__wait(50);
      out.emptyHosts = [...document.querySelectorAll("#turnSlate [data-sb-animation-host]")].filter((g) => !g.firstElementChild).length;
      // Removing the animation puts the shape back where it was.
      nodes[0].filters.removeAnimation("vect");
      out.unwrapped = (nodes[0].backgroundRect.node as Element).parentNode === nodes[0].svgGroup.node;
      return out;
    });
    for (const id of ["D", "S", "Q", "C"]) {
      const r = res[id];
      expect.soft(r.animations, `${id}: the rotation runs`).toBeGreaterThan(0);
      expect.soft(r.hostTag, `${id}: the host is a plain group`).toBe("g");
      // A 90° turn swaps the outline's width and height; a 180° turn keeps them.
      expect.soft(Math.abs(r.d90.w - r.rest.h), `${id} at 90°: width ${r.d90.w} vs resting height ${r.rest.h}`).toBeLessThan(3);
      expect.soft(Math.abs(r.d90.h - r.rest.w), `${id} at 90°: height ${r.d90.h} vs resting width ${r.rest.w}`).toBeLessThan(3);
      expect.soft(Math.abs(r.d180.w - r.rest.w), `${id} at 180°: width kept`).toBeLessThan(3);
      expect.soft(Math.abs(r.d180.h - r.rest.h), `${id} at 180°: height kept`).toBeLessThan(3);
      // It turns about the note's centre.
      expect.soft(Math.hypot(r.d90.cx - r.rest.cx, r.d90.cy - r.rest.cy), `${id} turns about its centre`).toBeLessThan(3);
    }
    expect.soft(res.overflow.animated, "an animated note clips its border like an unanimated one").toBe(res.overflow.twin);
    expect.soft(res.emptyHosts).toBe(0);
    expect.soft(res.unwrapped).toBe(true);
  });

  // Review of the first fix: in Firefox the line started inside the note (the nested
  // <svg>'s matrix leaves out its viewBox stretch). The line's end must sit on the outline.
  for (const animation of ["none", "rotate"]) test(`a line's end sits on the outline of a stretched named star (animation ${animation})`, async ({ page }) => {
    await boot(page);
    const res = await page.evaluate(async (animation) => {
      const w = window as any;
      const sb = w.Slatebox;
      const s = await w.__mkSlate("lineSlate");
      w.__slate = s;
      const a = s.nodes.add(new sb.node({ ...w.__optsFor("namedStar", "A", 200, 200), width: 200, height: 80 })).v2;
      const b = s.nodes.add(new sb.node({ ...w.__optsFor("namedStar", "B", 600, 200), width: 200, height: 80 })).v2;
      await Promise.all([a.ready, b.ready]);
      s.v2.zoom(1.2);
      await w.__wait(200);
      if (animation !== "none") {
        a.filters.applyAnimation(animation, "vect");
        b.filters.applyAnimation(animation, "vect");
        await w.__wait(700);
      }
      a.relationships.addAssociation(b);
      await w.__wait(500);
      const line = document.querySelector('#lineSlate path[connectortype="default"]') as SVGPathElement | null;
      if (!line) return null;
      const lm = line.getScreenCTM()!;
      const pt = (p: DOMPoint, m: DOMMatrix) => ({ x: p.x * m.a + p.y * m.c + m.e, y: p.x * m.b + p.y * m.d + m.f });
      const ends = [pt(line.getPointAtLength(0), lm), pt(line.getPointAtLength(line.getTotalLength()), lm)];
      // Each outline at rest, on screen: path points through the resting matrix
      // (the animation host's frame undone), sampled densely.
      const outlinePts = (n: any) => {
        const p = n.contentPath.node as SVGPathElement;
        let m = p.getScreenCTM()!;
        const host = (n.backgroundRect.node as Element).parentNode as any;
        if (host?.hasAttribute?.("data-sb-animation-host")) {
          m = (host.parentNode.getScreenCTM() as DOMMatrix).multiply(host.getScreenCTM().inverse()).multiply(m);
        }
        const L = p.getTotalLength();
        return Array.from({ length: 600 }, (_, i) => pt(p.getPointAtLength((L * i) / 600), m));
      };
      const dist = (e: any, pts: any[]) => Math.min(...pts.map((q) => Math.hypot(q.x - e.x, q.y - e.y)));
      const pa = outlinePts(a);
      const pb = outlinePts(b);
      // The start sits on A's outline; the end stops short of B's by the arrowhead.
      return { start: dist(ends[0], pa), end: dist(ends[1], pb) };
    }, animation);
    expect(res, "a line was drawn").not.toBeNull();
    expect.soft(res!.start, `line start ${res!.start.toFixed(2)}px from the source outline`).toBeLessThan(2.5);
    expect.soft(res!.end, `line end ${res!.end.toFixed(2)}px from the target outline (arrowhead gap)`).toBeLessThan(25);
  });

  test("a slate saved with quick-add stars in canvas coordinates reloads with a short line and stars everywhere", async ({ page }) => {
    await boot(page);
    // The owner's slate as saved (slatebox-test, shareId 301898fc07): two stars whose
    // vectorPath sits around the 10000 canvas origin, joined by one line.
    const res = await page.evaluate(async ({ STAR_24 }) => {
      const w = window as any;
      const sb = w.Slatebox;
      const path = sb.utils._transformPath(STAR_24, "T10000,10000s6,6");
      const common = { width: 96.792, height: 92.052, vectorPath: path, shapeHint: "star", text: "", backgroundColor: "#f5c518" };
      const json = {
        options: { id: "legacy" },
        nodes: [
          { options: { ...common, id: "Joz4E8TuAIzH", xPos: 815.6, yPos: 403.5 }, relationships: { associations: [{ parentId: "Joz4E8TuAIzH", childId: "node_kt67ombtf" }] } },
          { options: { ...common, id: "node_kt67ombtf", xPos: 987.4, yPos: 403.5 }, relationships: { associations: [] } },
        ],
      };
      const s = await w.__mkSlate("legacySlate");
      await s.loadJSON(JSON.stringify(json));
      await w.__wait(800);
      s.v2.zoom(1.4);
      await w.__wait(300);
      const a = s.v2.nodes.one("Joz4E8TuAIzH");
      const b = s.v2.nodes.one("node_kt67ombtf");
      const lines = [...document.querySelectorAll('#legacySlate path[connectortype="default"]')].map((p) => w.__rect(p));
      const mini = [...document.querySelectorAll("#legacySlate .slateboxjs-birdseye-nodes > *")].map((e) => e.getAttribute("data-birdseye-outline"));
      const bb = sb.utils.getBBox({ path: a.options.vectorPath });
      return { a: w.__box(a), b: w.__box(b), lines, mini, origin: [bb.x, bb.y], same: a.options.vectorPath === b.options.vectorPath };
    }, { STAR_24 });
    expect.soft(res.lines.length).toBeGreaterThan(0);
    const span = Math.max(res.a.w, res.a.h);
    for (const l of res.lines) {
      expect.soft(l.w, "the line spans the gap between the stars, not the canvas").toBeLessThan(res.b.x + res.b.w - res.a.x + span);
      expect.soft(l.h).toBeLessThan(res.a.h + span * 2);
    }
    expect.soft(res.mini).toEqual(["1", "1"]);
    expect.soft(Math.abs(res.origin[0])).toBeLessThan(1);
    expect.soft(Math.abs(res.origin[1])).toBeLessThan(1);
    expect.soft(res.same).toBe(true);
  });
});
