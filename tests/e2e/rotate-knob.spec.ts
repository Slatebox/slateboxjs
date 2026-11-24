import { expect, test, type Page } from "@playwright/test";

// The rotate knob: a screen-sized control outside the top-right corner, absolute
// angle maths, Shift = 15° steps, a live angle readout, touch and keyboard.

async function mount(page: Page, size = { w: 950, h: 620 }, at = { x: 260, y: 180 }) {
  await page.goto("/test.html");
  await page.waitForFunction(() => !!(window as any).Slatebox);
  await page.evaluate(
    async ({ size, at }) => {
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
          width: 160,
          height: 68,
          shape: "roundedrectangle",
        }),
      );
      const s = ((window as any).knobSlate = f.v2);
      await s.nodes.one("n").ready;
    },
    { size, at },
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
    await mount(page);
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
    await touch("touchMove", around(m.centre, m.knob, 60));
    expect(Math.abs((await measure(page)).angle - 60)).toBeLessThanOrEqual(1);
    await touch("touchEnd");
    await expect(readout(page)).toHaveCount(0);
    await expect.poll(async () => Math.abs((await measure(page)).angle - 60)).toBeLessThanOrEqual(1);
  });
});
