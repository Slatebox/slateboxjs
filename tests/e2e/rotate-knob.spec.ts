import { expect, test, type Page } from "@playwright/test";

// The rotate knob: a screen-sized control outside the top-right corner, absolute
// angle maths, Shift = 15° steps, a live angle readout, touch and keyboard.

async function mount(page: Page, size = { w: 950, h: 620 }, at = { x: 260, y: 180 }, note = { w: 160, h: 68 }) {
  await page.goto("/test.html");
  await page.waitForFunction(() => !!(window as any).Slatebox);
  await page.evaluate(
    async ({ size, at, note }) => {
      const sb = (window as any).Slatebox;
      const host = document.createElement("div");
      host.id = "knob";
      host.style.cssText = `position:fixed;left:0;top:0;width:${size.w}px;height:${size.h}px;background:white`;
      document.body.append(host);
      const f = await new sb.slate({ container: "knob", allowCollaboration: false }, {}).init();
      f.nodes.add(
        new sb.node({
          id: "n",
          text: "Turn me",
          xPos: at.x,
          yPos: at.y,
          width: note.w,
          height: note.h,
          shape: "roundedrectangle",
        }),
      );
      (window as any).knobFacade = f;
      const s = ((window as any).knobSlate = f.v2);
      await s.nodes.one("n").ready;
    },
    { size, at, note },
  );
}

async function select(page: Page) {
  await page.evaluate(() => {
    const s = (window as any).knobSlate;
    s.selectNodes([]);
    s.selectNodes([s.nodes.one("n")]);
  });
  await expect(page.locator(".svg_select_handle_rot circle")).toBeVisible();
}

async function measure(page: Page) {
  return page.evaluate(() => {
    const s = (window as any).knobSlate;
    const n = s.nodes.one("n");
    const g = document.querySelector("g.svg_select_handle_rot") as SVGGElement;
    const knob = g.querySelector("circle")!.getBoundingClientRect();
    const hit = g.querySelector("rect")!.getBoundingClientRect();
    const poly = document.querySelector(".svg_select_shape") as SVGPolygonElement;
    const pt = (i: number) => poly.points.getItem(i).matrixTransform(poly.getScreenCTM()!);
    const lt = pt(0), rt = pt(2), rb = pt(4);
    const plug = (document.querySelector(".connection-handle-top") as SVGElement | null)?.getBoundingClientRect();
    const kc = { x: knob.x + knob.width / 2, y: knob.y + knob.height / 2 };
    const top = document.elementFromPoint(kc.x, kc.y);
    const m = (n.backgroundRect.node as SVGGraphicsElement).getScreenCTM()!;
    return {
      circles: g.querySelectorAll("circle").length,
      knobSize: knob.width,
      hitSize: hit.width,
      knob: kc,
      corner: { x: rt.x, y: rt.y },
      centre: { x: (lt.x + rb.x) / 2, y: (lt.y + rb.y) / 2 },
      plugGap: plug?.width ? Math.hypot(plug.x + plug.width / 2 - kc.x, plug.y + plug.height / 2 - kc.y) : null,
      onTop: !!top && g.contains(top),
      angle: n.options.rotate?.rotationAngle ?? 0,
      shapeAngle: (Math.atan2(m.b, m.a) * 180) / Math.PI,
      x: n.options.x,
      y: n.options.y,
    };
  });
}

const readout = (page: Page) => page.locator(".slatebox-rotate-readout");

function around(c: { x: number; y: number }, p: { x: number; y: number }, deg: number) {
  const a = (deg * Math.PI) / 180, dx = p.x - c.x, dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(a) - dy * Math.sin(a), y: c.y + dx * Math.sin(a) + dy * Math.cos(a) };
}

for (const zoom of [0.5, 1, 2]) {
  test(`knob is screen-sized, clear of the plugs and rotates by drag at ${zoom * 100}% zoom`, async ({ page }) => {
    // 100 tall, so it is at least 48px on screen at every zoom here (the full knob;
    // smaller notes are the next test's).
    await mount(page, undefined, undefined, { w: 160, h: 100 });
    await page.evaluate((z) => (window as any).knobSlate.zoom(z), zoom);
    await select(page);
    const m = await measure(page);
    expect(m.circles).toBe(1);
    expect(Math.abs(m.knobSize - 28)).toBeLessThan(1.5);
    expect(m.hitSize).toBeGreaterThanOrEqual(43);
    // Outside the top-right corner (the note is unrotated).
    expect(m.knob.x).toBeGreaterThan(m.corner.x + 10);
    expect(m.knob.y).toBeLessThan(m.corner.y - 10);
    expect(m.plugGap === null || m.plugGap > 30).toBe(true);
    expect(m.onTop).toBe(true);

    await page.mouse.move(m.knob.x, m.knob.y);
    await page.mouse.down();
    for (const deg of [10, 20, 30]) {
      const p = around(m.centre, m.knob, deg);
      await page.mouse.move(p.x, p.y, { steps: 3 });
    }
    const live = await measure(page);
    expect(Math.abs(live.angle - 30)).toBeLessThanOrEqual(1);
    expect(Math.abs(live.shapeAngle - 30)).toBeLessThan(1.5);
    await expect(readout(page)).toBeVisible();
    await expect(readout(page)).toHaveText(`${Math.round(live.angle)}°`);
    expect(await page.evaluate(() => document.documentElement.style.cursor)).toContain("data:image/svg+xml");
    await page.mouse.up();
    await expect(readout(page)).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.style.cursor)).toBe("");
    // The knob follows the note round.
    await expect.poll(async () => {
      const after = await measure(page);
      return Math.hypot(after.knob.x - around(m.centre, m.knob, 30).x, after.knob.y - around(m.centre, m.knob, 30).y);
    }).toBeLessThan(3);
  });
}

test("Shift snaps the drag to 15° steps", async ({ page }) => {
  await mount(page);
  await select(page);
  const m = await measure(page);
  await page.mouse.move(m.knob.x, m.knob.y);
  await page.mouse.down();
  await page.keyboard.down("Shift");
  let p = around(m.centre, m.knob, 22);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  expect((await measure(page)).angle).toBe(15);
  await expect(readout(page)).toHaveText("15°");
  p = around(m.centre, m.knob, -38);
  await page.mouse.move(p.x, p.y, { steps: 6 });
  expect((await measure(page)).angle).toBe(-45);
  await page.mouse.up();
  await page.keyboard.up("Shift");
  await expect.poll(async () => (await measure(page)).angle).toBe(-45);
});

test("keyboard: a slider (reached by Tab after the plugs), arrows turn by 1°, Shift by 15°, Home resets", async ({ page }) => {
  await mount(page);
  await select(page);
  const knob = page.locator("g.svg_select_handle_rot");
  await expect(knob).toHaveAttribute("role", "slider");
  // Out of the page's own tab order; keyboard-connector.spec covers Tab from the last plug.
  await expect(knob).toHaveAttribute("tabindex", "-1");
  const start = await measure(page);
  await knob.focus();
  await page.keyboard.press("ArrowRight");
  await page.keyboard.press("ArrowRight");
  expect((await measure(page)).angle).toBe(2);
  await page.keyboard.press("Shift+ArrowRight");
  expect((await measure(page)).angle).toBe(15);
  await page.keyboard.press("Shift+ArrowLeft");
  expect((await measure(page)).angle).toBe(0);
  await page.keyboard.press("ArrowLeft");
  expect((await measure(page)).angle).toBe(-1);
  await expect(knob).toHaveAttribute("aria-valuenow", "-1");
  await page.keyboard.press("Home");
  const end = await measure(page);
  expect(end.angle).toBe(0);
  // The arrows turned the note; they did not nudge it.
  expect(end.x).toBe(start.x);
  expect(end.y).toBe(start.y);
});

test.describe("touch at 390px", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("drag the knob with a finger; it sticks to right angles", async ({ page }) => {
    await mount(page, { w: 390, h: 844 }, { x: 110, y: 380 });
    await select(page);
    const m = await measure(page);
    expect(Math.abs(m.knobSize - 28)).toBeLessThan(1.5);
    expect(m.hitSize).toBeGreaterThanOrEqual(43);
    expect(m.onTop).toBe(true);
    const cdp = await page.context().newCDPSession(page);
    const touch = (type: string, p?: { x: number; y: number }) =>
      cdp.send("Input.dispatchTouchEvent", {
        type,
        touchPoints: p ? [{ x: Math.round(p.x), y: Math.round(p.y) }] : [],
      } as any);
    await touch("touchStart", m.knob);
    for (const deg of [20, 45, 70, 87]) await touch("touchMove", around(m.centre, m.knob, deg));
    expect((await measure(page)).angle).toBe(90);
    await expect(readout(page)).toHaveText("90°");
    // Above the finger, where the hand does not cover it.
    const finger = around(m.centre, m.knob, 87);
    const pill = (await readout(page).boundingBox())!;
    expect(pill.y + pill.height).toBeLessThan(finger.y - 30);
    expect(Math.abs(pill.x + pill.width / 2 - finger.x)).toBeLessThan(pill.width);
    await touch("touchMove", around(m.centre, m.knob, 60));
    expect(Math.abs((await measure(page)).angle - 60)).toBeLessThanOrEqual(1);
    await touch("touchEnd");
    await expect(readout(page)).toHaveCount(0);
    await expect.poll(async () => Math.abs((await measure(page)).angle - 60)).toBeLessThanOrEqual(1);
  });
});

test("small notes: the knob shrinks under 48px on screen and goes under 24px, never bigger than the note", async ({ page }) => {
  await mount(page);
  const at = async (z: number) => {
    await page.evaluate((z) => (window as any).knobSlate.zoom(z), z);
    await page.evaluate(() => {
      const s = (window as any).knobSlate;
      s.selectNodes([]);
      s.selectNodes([s.nodes.one("n")]);
    });
    return page.evaluate(() => {
      const g = document.querySelector("g.svg_select_handle_rot") as SVGGElement | null;
      const r = g?.querySelector("circle")?.getBoundingClientRect();
      return { size: r ? Math.round(r.width) : 0, attr: g?.getAttribute("data-knob-size") };
    });
  };
  // 160x68: 17px tall at 25% (no knob), 34px at 50% (small knob), 68px at 100% (full).
  expect(await at(0.25)).toEqual({ size: 0, attr: "0" });
  const half = await at(0.5);
  expect(half.attr).toBe("20");
  expect(Math.abs(half.size - 20)).toBeLessThan(1.5);
  const full = await at(1);
  expect(full.attr).toBe("28");
  expect(Math.abs(full.size - 28)).toBeLessThan(1.5);
});

test("Escape during a rotate puts the note back and saves nothing", async ({ page }) => {
  await mount(page);
  await select(page);
  await page.evaluate(() => {
    const s = (window as any).knobSlate;
    (window as any).__sent = [];
    const orig = s.broadcast.bind(s);
    s.broadcast = (type: string, data: any) => {
      (window as any).__sent.push(type);
      return orig(type, data);
    };
  });
  const m = await measure(page);
  await page.mouse.move(m.knob.x, m.knob.y);
  await page.mouse.down();
  const p = around(m.centre, m.knob, 60);
  await page.mouse.move(p.x, p.y, { steps: 5 });
  expect(Math.abs((await measure(page)).angle - 60)).toBeLessThanOrEqual(1);
  await page.keyboard.press("Escape");
  expect((await measure(page)).angle).toBe(0);
  await expect(readout(page)).toHaveCount(0);
  // Moving on before the release changes nothing.
  await page.mouse.move(m.centre.x + 200, m.centre.y + 40, { steps: 3 });
  await page.mouse.up();
  await page.waitForTimeout(50);
  const end = await measure(page);
  expect(end.angle).toBe(0);
  expect(Math.abs(end.shapeAngle)).toBeLessThan(0.5);
  expect(await page.evaluate(() => (window as any).__sent)).not.toContain("onNodeRotated");
  // Escape cancelled the rotate only: the note is still selected.
  expect(await page.evaluate(() => (window as any).knobSlate.getSelectedNodes().length)).toBe(1);
  expect(await page.evaluate(() => document.documentElement.style.cursor)).toBe("");
});

test("keyboard: a held arrow saves once, when the key is released", async ({ page }) => {
  await mount(page);
  await select(page);
  await page.evaluate(() => {
    const s = (window as any).knobSlate;
    (window as any).__sent = [];
    const orig = s.broadcast.bind(s);
    s.broadcast = (type: string, data: any) => {
      (window as any).__sent.push([type, data?.rotate?.rotationAngle]);
      return orig(type, data);
    };
  });
  const knob = page.locator("g.svg_select_handle_rot");
  await knob.focus();
  await page.keyboard.down("ArrowRight");
  for (let i = 0; i < 5; i++) await page.keyboard.down("ArrowRight"); // auto-repeat
  expect((await measure(page)).angle).toBe(6);
  expect(await page.evaluate(() => (window as any).__sent.length)).toBe(0);
  await page.keyboard.up("ArrowRight");
  expect(await page.evaluate(() => (window as any).__sent)).toEqual([["onNodeRotated", 6]]);
  // A pause saves too, if the release never comes (focus moved away mid-press).
  await page.keyboard.down("ArrowLeft");
  await expect.poll(() => page.evaluate(() => (window as any).__sent.length), { timeout: 3000 }).toBe(2);
  await page.keyboard.up("ArrowLeft");
  expect(await page.evaluate(() => (window as any).__sent.length)).toBe(2);
});

async function mountPair(page: Page) {
  await mount(page);
  await page.evaluate(async () => {
    const sb = (window as any).Slatebox;
    const s = (window as any).knobSlate;
    (window as any).knobFacade.nodes.add(
      new sb.node({ id: "m", text: "Me too", xPos: 520, yPos: 300, width: 160, height: 68, shape: "roundedrectangle" }),
    );
    await s.nodes.one("m").ready;
    s.selectNodes([s.nodes.one("n"), s.nodes.one("m")]);
  });
}

const groupKnob = (page: Page) =>
  page.evaluate(() => {
    const g = document.querySelector("g.slatebox-group-rotate") as SVGGElement | null;
    if (!g) return null;
    const k = g.querySelector("circle")!.getBoundingClientRect();
    const frame = g.parentNode!.querySelector("rect")!.getBoundingClientRect();
    const s = (window as any).knobSlate;
    return {
      circles: g.querySelectorAll("circle").length,
      icon: !!g.querySelector("path"),
      size: k.width,
      knob: { x: k.x + k.width / 2, y: k.y + k.height / 2 },
      frame: { left: frame.left, right: frame.right, top: frame.top, bottom: frame.bottom },
      cursor: g.style.cursor,
      angles: ["n", "m"].map((id) => s.nodes.one(id).options.rotate?.rotationAngle ?? 0),
      pos: ["n", "m"].map((id) => [s.nodes.one(id).options.x, s.nodes.one(id).options.y]),
    };
  });

for (const zoom of [0.5, 1]) {
  test(`a multi-note selection gets the same knob at its top-right corner (${zoom * 100}% zoom)`, async ({ page }) => {
    await mountPair(page);
    await page.evaluate((z) => {
      const s = (window as any).knobSlate;
      s.zoom(z);
      s.selectNodes([]);
      s.selectNodes([s.nodes.one("n"), s.nodes.one("m")]);
    }, zoom);
    const k = (await groupKnob(page))!;
    expect(k).not.toBeNull();
    expect(k.circles).toBe(1);
    expect(k.icon).toBe(true);
    expect(Math.abs(k.size - 28)).toBeLessThan(1.5);
    expect(k.cursor).toContain("data:image/svg+xml");
    expect(k.knob.x).toBeGreaterThan(k.frame.right + 10);
    expect(k.knob.y).toBeLessThan(k.frame.top - 10);
    // The old knob was a plain dot with a stem above top-centre.
    expect(await page.locator("g.slatebox-group-rotate").locator("..").locator("line").count()).toBe(0);
  });
}

test("multi-note rotate: readout and rotate cursor while dragging, Shift snaps, Escape puts everything back", async ({ page }) => {
  await mountPair(page);
  const k = (await groupKnob(page))!;
  const centre = { x: (k.frame.left + k.frame.right) / 2, y: (k.frame.top + k.frame.bottom) / 2 };
  await page.mouse.move(k.knob.x, k.knob.y);
  await page.mouse.down();
  await page.keyboard.down("Shift");
  let p = around(centre, k.knob, 22);
  await page.mouse.move(p.x, p.y, { steps: 4 });
  await expect(readout(page)).toHaveText("15°");
  expect(await page.evaluate(() => document.documentElement.style.cursor)).toContain("data:image/svg+xml");
  expect((await groupKnob(page))!.angles).toEqual([15, 15]);
  await page.keyboard.up("Shift");
  await page.keyboard.press("Escape");
  const back = (await groupKnob(page))!;
  expect(back.angles).toEqual([0, 0]);
  expect(back.pos).toEqual(k.pos);
  await expect(readout(page)).toHaveCount(0);
  await page.mouse.up();
  expect((await groupKnob(page))!.angles).toEqual([0, 0]);
  expect(await page.evaluate(() => (window as any).knobSlate.getSelectedNodes().length)).toBe(2);

  // A real turn ends with the readout and cursor cleared.
  const k2 = (await groupKnob(page))!;
  await page.mouse.move(k2.knob.x, k2.knob.y);
  await page.mouse.down();
  p = around(centre, k2.knob, 40);
  await page.mouse.move(p.x, p.y, { steps: 5 });
  await expect(readout(page)).toBeVisible();
  await page.mouse.up();
  await expect(readout(page)).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.style.cursor)).toBe("");
  const after = (await groupKnob(page))!;
  for (const a of after.angles) expect(Math.abs(a - 40)).toBeLessThanOrEqual(1);
});

test("zooming with a selection re-sizes the knob (one note and a group)", async ({ page }) => {
  await mountPair(page);
  const size = (sel: string) =>
    page.evaluate((sel) => Math.round(document.querySelector(`${sel} circle`)?.getBoundingClientRect().width ?? -1), sel);
  await page.evaluate(() => {
    const s = (window as any).knobSlate;
    s.selectNodes([]);
    s.selectNodes([s.nodes.one("n")]);
  });
  // A 160x68 note: 28px knob at 100%, still 28 at 150%, the small knob at 50%.
  expect(await size("g.svg_select_handle_rot")).toBe(28);
  await page.evaluate(() => (window as any).knobSlate.zoom(1.5));
  await expect.poll(() => size("g.svg_select_handle_rot")).toBe(28);
  await page.evaluate(() => (window as any).knobSlate.zoom(0.5));
  await expect.poll(() => size("g.svg_select_handle_rot")).toBe(20);
  await page.evaluate(() => {
    const s = (window as any).knobSlate;
    s.zoom(1);
    s.selectNodes([s.nodes.one("n"), s.nodes.one("m")]);
  });
  expect(await size("g.slatebox-group-rotate")).toBe(28);
  await page.evaluate(() => (window as any).knobSlate.zoom(0.5));
  await expect.poll(() => size("g.slatebox-group-rotate")).toBe(28);
  await page.evaluate(() => (window as any).knobSlate.zoom(2));
  await expect.poll(() => size("g.slatebox-group-rotate")).toBe(28);
});

for (const zoom of [0.5, 1]) {
  test(`a host bar over a multi-note selection clears its rotate knob (${zoom * 100}% zoom)`, async ({ page }) => {
    await mountPair(page);
    await page.evaluate((z) => {
      const s = (window as any).knobSlate;
      s.zoom(z);
      s.selectNodes([]);
      s.selectNodes([s.nodes.one("n"), s.nodes.one("m")]);
    }, zoom);
    await page.waitForTimeout(250);
    const r = await page.evaluate(() => {
      const s = (window as any).knobSlate;
      const f = s.getSelectionFrame();
      const knob = document.querySelector("g.slatebox-group-rotate circle")!.getBoundingClientRect();
      return { barBottom: f.rect.top - f.topClearance, knobTop: knob.top };
    });
    expect(r.barBottom).toBeLessThanOrEqual(r.knobTop + 0.5);
    expect(r.barBottom).toBeGreaterThan(r.knobTop - 12);
  });
}

test("a host side panel over the top-right corner sends the knob to the top-left corner, where it still turns the note", async ({ page }) => {
  await mount(page, undefined, undefined, { w: 160, h: 100 });
  await select(page);
  const before = await measure(page);
  expect(await page.locator("g.svg_select_handle_rot").getAttribute("data-knob-side")).toBe("right");
  // A side panel (like Ask Slatebox) laid over the canvas from just right of the note's corner.
  await page.evaluate((left) => {
    const panel = document.createElement("aside");
    panel.id = "side-panel";
    panel.style.cssText = `position:fixed;top:0;bottom:0;left:${left}px;right:0;z-index:10;background:#eef`;
    document.body.append(panel);
  }, Math.round(before.corner.x + 6));
  await select(page);
  const m = await measure(page);
  expect(await page.locator("g.svg_select_handle_rot").getAttribute("data-knob-side")).toBe("left");
  const lt = await page.evaluate(() => {
    const poly = document.querySelector(".svg_select_shape") as SVGPolygonElement;
    const p = poly.points.getItem(0).matrixTransform(poly.getScreenCTM()!);
    return { x: p.x, y: p.y };
  });
  // Outside the top-left corner, as far out as it was on the right, and nothing over it.
  expect(m.knob.x).toBeLessThan(lt.x - 10);
  expect(m.knob.y).toBeLessThan(lt.y - 10);
  expect(Math.abs(lt.x - m.knob.x - (before.knob.x - before.corner.x))).toBeLessThan(1.5);
  expect(m.onTop).toBe(true);
  expect(m.plugGap === null || m.plugGap > 30).toBe(true);

  // It turns the note from there, and keeps its side while held.
  await page.mouse.move(m.knob.x, m.knob.y);
  await page.mouse.down();
  for (const deg of [10, 20, 30]) {
    const p = around(m.centre, m.knob, deg);
    await page.mouse.move(p.x, p.y, { steps: 3 });
  }
  expect(await page.locator("g.svg_select_handle_rot").getAttribute("data-knob-side")).toBe("left");
  const live = await measure(page);
  expect(Math.abs(live.angle - 30)).toBeLessThanOrEqual(1);
  await page.mouse.up();

  // With the panel gone, the knob is back at the top-right corner.
  await page.evaluate(() => document.getElementById("side-panel")?.remove());
  await select(page);
  expect(await page.locator("g.svg_select_handle_rot").getAttribute("data-knob-side")).toBe("right");
});
