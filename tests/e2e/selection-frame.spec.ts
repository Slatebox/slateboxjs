import { expect, test, type Page } from "@playwright/test";

// A host that draws its own style bar asks the engine for two things: no pill of its
// own (`contextToolbar: 'host'`), and one event, `onSelectionFrame`, that says what is
// selected and where it is on screen, with `moving: true` while a drag, resize, rotate,
// pan or zoom is under way and `moving: false` (with the new place) once it ends.

type Shape = "v2" | "facade";

async function openBoard(page: Page, opts: { shape?: Shape; host?: boolean } = {}) {
  const { shape = "v2", host = true } = opts;
  await page.goto("/test.html");
  await page.waitForFunction(() => (window as any).Slatebox);
  await page.evaluate(
    async ({ shape, host }) => {
      const w = window as any;
      const div = document.createElement("div");
      div.id = "board";
      div.style.cssText = "position:fixed;left:0;top:0;width:1000px;height:700px;background:white";
      document.body.replaceChildren(div);
      w.frames = [] as any[];
      const events: Record<string, Function> = {
        onSlateChanged: () => {},
        onMenuRequested: () => {},
        onLineMenuRequested: () => {},
        onSelectionFrame: (frame: any) => w.frames.push(JSON.parse(JSON.stringify(frame))),
      };
      const options: Record<string, any> = {
        viewPort: { originalWidth: 1000, originalHeight: 700 },
        showbirdsEye: false,
        showZoom: false,
        allowCollaboration: false,
      };
      if (host) options.contextToolbar = "host";
      let board: any;
      if (shape === "facade") {
        const sb = w.Slatebox;
        const s = await new sb.slate({ container: "board", ...options }, events).init();
        for (const [id, x, y] of [["a", 160, 300], ["b", 620, 300], ["c", 400, 520]] as const) {
          s.nodes.add(new sb.node({ id, xPos: x, yPos: y, width: 150, height: 80, text: id.toUpperCase() }));
        }
        w.facade = s;
        board = s.v2;
      } else {
        const { Slate } = await import("/src/index.ts");
        board = new Slate(div, { ...options, events });
        for (const [id, x, y] of [["a", 160, 300], ["b", 620, 300], ["c", 400, 520]] as const) {
          board.addNode({ id, x, y, width: 150, height: 80, text: id.toUpperCase() });
        }
      }
      w.board = board;
      await Promise.all(board.getAllNodes().map((n: any) => n.ready));
      board.getNode("a").relationships.addAssociation(board.getNode("b"));
      await new Promise((r) => setTimeout(r, 300));
      w.frames.length = 0;
    },
    { shape, host }
  );
}

const frames = (page: Page) => page.evaluate(() => (window as any).frames as any[]);
const last = async (page: Page) => (await frames(page)).at(-1);
const clearFrames = (page: Page) => page.evaluate(() => ((window as any).frames.length = 0));

/** The note's box on screen, read from its drawing. */
const noteBox = (page: Page, id: string) =>
  page.evaluate((id) => {
    const r = document.querySelector(`#board g[data-node-id="${id}"]`)!.getBoundingClientRect();
    return { left: r.left, top: r.top, right: r.right, bottom: r.bottom };
  }, id);

async function clickNote(page: Page, id: string, modifiers: ("Shift")[] = []) {
  const b = await noteBox(page, id);
  for (const m of modifiers) await page.keyboard.down(m);
  await page.mouse.click((b.left + b.right) / 2, (b.top + b.bottom) / 2);
  for (const m of modifiers) await page.keyboard.up(m);
}

const near = (a: number, b: number, tol = 3) => Math.abs(a - b) <= tol;

for (const shape of ["v2", "facade"] as const) {
  test(`(${shape}) a selected note: no engine pill, one frame with its screen box`, async ({ page }) => {
    await openBoard(page, { shape });
    await clickNote(page, "a");
    await expect.poll(async () => (await last(page))?.kind).toBe("node");
    const f = await last(page);
    expect(f.ids).toEqual(["a"]);
    expect(f.moving).toBe(false);
    const box = await noteBox(page, "a");
    // The frame is the note's own box (its shape), not the handles drawn around it.
    expect(f.rect.left).toBeGreaterThanOrEqual(box.left - 2);
    expect(f.rect.right).toBeLessThanOrEqual(box.right + 2);
    expect(near(f.rect.width, 150)).toBe(true);
    expect(near(f.rect.height, 80, 30)).toBe(true);
    expect(f.topClearance).toBeGreaterThan(20);
    await expect(page.locator("#board .node-toolbar")).toHaveCount(0);
    // The method gives the same answer as the event.
    const now = await page.evaluate((shape) => {
      const w = window as any;
      return (shape === "facade" ? w.facade : w.board).getSelectionFrame();
    }, shape);
    expect(now.kind).toBe("node");
    expect(now.ids).toEqual(["a"]);
    expect(near(now.rect.left, f.rect.left, 1)).toBe(true);
  });
}

test("a host without the option still gets the pill, and the frame too", async ({ page }) => {
  await openBoard(page, { host: false });
  await clickNote(page, "a");
  await expect(page.locator("#board .node-toolbar")).toHaveCount(1);
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
});

test("several notes give kind 'nodes'; clearing gives 'none'", async ({ page }) => {
  await openBoard(page);
  await page.evaluate(() => {
    const b = (window as any).board;
    b.selectNodes([b.getNode("a"), b.getNode("c")]);
  });
  await expect.poll(async () => (await last(page))?.kind).toBe("nodes");
  const f = await last(page);
  expect(f.ids.sort()).toEqual(["a", "c"]);
  const a = await noteBox(page, "a");
  const c = await noteBox(page, "c");
  expect(f.rect.left).toBeLessThanOrEqual(Math.min(a.left, c.left) + 2);
  expect(f.rect.bottom).toBeGreaterThanOrEqual(Math.max(a.bottom, c.bottom) - 30);
  await page.evaluate(() => (window as any).board.clearSelection());
  await expect.poll(async () => (await last(page))?.kind).toBe("none");
  expect((await last(page)).rect).toBeNull();
});

test("a selected line: no line pill, a 'line' frame over its span, endpoint locks on the canvas", async ({ page }) => {
  await openBoard(page);
  const pt = await page.evaluate(() => {
    const p = document.querySelector('#board path[connectortype="default"]') as SVGGeometryElement;
    const len = p.getTotalLength();
    const m = p.getPointAtLength(len / 2).matrixTransform(p.getScreenCTM()!);
    return { x: m.x, y: m.y };
  });
  await page.mouse.click(pt.x, pt.y);
  await expect.poll(async () => (await last(page))?.kind).toBe("line");
  const f = await last(page);
  expect(f.line).toMatchObject({ nodeId: "a", childId: "b" });
  expect(f.ids).toEqual([f.line.associationId]);
  expect(f.rect.width).toBeGreaterThan(100);
  await expect(page.locator("#board .line-toolbar")).toHaveCount(0);
  // The start/end lock toggles are on the canvas while the line is selected.
  await expect.poll(() => page.evaluate(() => ((window as any).board as any)._activeEndpointToggles?.length ?? 0)).toBe(2);
  expect(await page.evaluate(() => (window as any).board.getSelectedLine()?.association?.childId)).toBe("b");
  // A press on empty canvas ends it.
  await page.mouse.click(60, 650);
  await expect.poll(async () => (await last(page))?.kind).toBe("none");
  expect(await page.evaluate(() => (window as any).board.getSelectedLine())).toBeNull();
});

test("removeSelectedLine deletes the selected line through the normal path", async ({ page }) => {
  await openBoard(page);
  const pt = await page.evaluate(() => {
    const p = document.querySelector('#board path[connectortype="default"]') as SVGGeometryElement;
    const m = p.getPointAtLength(p.getTotalLength() / 2).matrixTransform(p.getScreenCTM()!);
    return { x: m.x, y: m.y };
  });
  await page.mouse.click(pt.x, pt.y);
  await expect.poll(async () => (await last(page))?.kind).toBe("line");
  expect(await page.evaluate(() => (window as any).board.removeSelectedLine())).toBe(true);
  expect(await page.evaluate(() => (window as any).board.getNode("a").relationships.getAssociations().length)).toBe(0);
  await expect.poll(async () => (await last(page))?.kind).toBe("none");
});

test("drag: moving on the first move, then still with the new place", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "a");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  const before = await last(page);
  await clearFrames(page);
  const b = await noteBox(page, "a");
  const cx = (b.left + b.right) / 2, cy = (b.top + b.bottom) / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx + 40, cy + 30, { steps: 8 });
  await expect.poll(async () => (await frames(page)).some((f) => f.moving)).toBe(true);
  // While the button is held and the pointer rests, the frame stays "moving".
  await page.waitForTimeout(400);
  expect((await last(page)).moving).toBe(true);
  await page.mouse.up();
  await expect.poll(async () => (await last(page))?.moving).toBe(false);
  const after = await last(page);
  expect(after.kind).toBe("node");
  expect(near(after.rect.left - before.rect.left, 40, 4)).toBe(true);
  expect(near(after.rect.top - before.rect.top, 30, 4)).toBe(true);
  // One "moving" frame per gesture, not one per pointer move.
  expect((await frames(page)).filter((f) => f.moving).length).toBe(1);
});

test("a click is not a move", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "a");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  await clearFrames(page);
  await clickNote(page, "a");
  await page.waitForTimeout(300);
  expect((await frames(page)).filter((f) => f.moving)).toHaveLength(0);
});

test("resize and rotate: moving, then the new box", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "a");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  const before = await last(page);
  await clearFrames(page);
  const corner = await page.locator(".svg_select_handle_rb").evaluate((el: SVGPolylineElement) => {
    const pt = el.points.getItem(1).matrixTransform(el.getScreenCTM()!);
    return { x: pt.x, y: pt.y };
  });
  await page.mouse.move(corner.x, corner.y);
  await page.mouse.down();
  await page.mouse.move(corner.x + 40, corner.y + 30, { steps: 6 });
  await expect.poll(async () => (await frames(page)).some((f) => f.moving)).toBe(true);
  await page.mouse.up();
  await expect.poll(async () => (await last(page))?.moving).toBe(false);
  const resized = await last(page);
  expect(resized.rect.width).toBeGreaterThan(before.rect.width + 25);

  await clearFrames(page);
  const knob = (await page.locator(".svg_select_handle_rot circle").boundingBox())!;
  const box = await noteBox(page, "a");
  const cx = (box.left + box.right) / 2, cy = (box.top + box.bottom) / 2;
  const kx = knob.x + knob.width / 2, ky = knob.y + knob.height / 2;
  await page.mouse.move(kx, ky);
  await page.mouse.down();
  const r = Math.hypot(kx - cx, ky - cy);
  await page.mouse.move(cx + r * Math.sin(0.6), cy - r * Math.cos(0.6), { steps: 6 });
  await expect.poll(async () => (await frames(page)).some((f) => f.moving)).toBe(true);
  await page.mouse.up();
  await expect.poll(async () => (await last(page))?.moving).toBe(false);
  // A turned note's frame encloses its turned corners, so it is taller than before.
  expect((await last(page)).rect.height).toBeGreaterThan(resized.rect.height + 10);
});

test("pan and zoom: moving while the view changes, then the new place", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "a");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  const before = await last(page);
  await clearFrames(page);
  await page.evaluate(() => (window as any).board.panBy({ x: 80, y: 0 }));
  await expect.poll(async () => (await frames(page)).some((f) => f.moving)).toBe(true);
  await expect.poll(async () => (await last(page))?.moving).toBe(false);
  const panned = await last(page);
  expect(Math.abs(panned.rect.left - before.rect.left)).toBeGreaterThan(40);

  await clearFrames(page);
  // A wheel zoom, as a person does it.
  await page.mouse.move(500, 350);
  await page.keyboard.down("Control");
  for (let i = 0; i < 3; i++) await page.mouse.wheel(0, -100);
  await page.keyboard.up("Control");
  await expect.poll(async () => (await frames(page)).some((f) => f.moving)).toBe(true);
  await expect.poll(async () => (await last(page))?.moving).toBe(false);
  const zoomed = await last(page);
  expect(zoomed.rect.width).toBeGreaterThan(panned.rect.width + 10);
});

test("deleting the selected note gives kind 'none'", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "c");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  await page.keyboard.press("Delete");
  await expect.poll(async () => (await last(page))?.kind).toBe("none");
  expect(await page.evaluate(() => !!(window as any).board.getNode("c"))).toBe(false);
});

for (const zoom of [0.5, 1, 2]) {
  test(`at ${zoom * 100}% the room above the frame clears the rotate handle and the top connect dot`, async ({ page }) => {
    await openBoard(page);
    await page.evaluate(async (zoom) => {
      const b = (window as any).board;
      b.zoom(zoom);
      const n = b.getNode("a");
      // Centre the note so nothing is clipped at the higher zoom.
      const wx = n.options.x + n.options.width / 2, wy = n.options.y + n.options.height / 2;
      const p = b.worldToClient({ x: wx, y: wy });
      b.panBy({ x: 500 - p.x, y: 380 - p.y });
      await new Promise((r) => setTimeout(r, 300));
      b.selectNodes([n]);
    }, zoom);
    await expect.poll(async () => (await last(page))?.kind).toBe("node");
    await page.waitForTimeout(250);
    const f = await page.evaluate(() => (window as any).board.getSelectionFrame());
    const tops = await page.evaluate(() => {
      const top = (sel: string) => {
        const el = document.querySelector(sel);
        return el ? el.getBoundingClientRect().top : null;
      };
      return { dot: top("#board .connection-handle-top"), rot: top("#board .svg_select_handle_rot") };
    });
    expect(tops.dot).not.toBeNull();
    expect(tops.rot).not.toBeNull();
    const barBottom = f.rect.top - f.topClearance;
    expect(barBottom).toBeLessThanOrEqual(tops.dot! + 0.5);
    expect(barBottom).toBeLessThanOrEqual(tops.rot! + 0.5);
    // ...and does not leave a big empty gap either.
    expect(barBottom).toBeGreaterThan(Math.min(tops.dot!, tops.rot!) - 12);
  });
}

test("connecting still works without the pill: drag from the top connect dot to another note", async ({ page }) => {
  await openBoard(page);
  await clickNote(page, "c");
  await expect.poll(async () => (await last(page))?.kind).toBe("node");
  const dot = (await page.locator("#board .connection-handle-top").boundingBox())!;
  const target = await noteBox(page, "b");
  await page.mouse.move(dot.x + dot.width / 2, dot.y + dot.height / 2);
  await page.waitForTimeout(300);
  await page.mouse.down();
  await page.waitForTimeout(120);
  await page.mouse.move(dot.x + dot.width / 2, dot.y - 14, { steps: 3 });
  await page.mouse.move((target.left + target.right) / 2, (target.top + target.bottom) / 2, { steps: 10 });
  await page.mouse.up();
  await expect
    .poll(() => page.evaluate(() => (window as any).board.getNode("c").relationships.getAssociations().map((a: any) => a.childId)))
    .toContain("b");
});
