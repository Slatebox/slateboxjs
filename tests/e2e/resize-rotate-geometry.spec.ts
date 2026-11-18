import { expect, test, type Page } from "@playwright/test";

// Compare the plugin's actual root-SVG polygon with the rendered hit target in
// client pixels. Model coordinates alone cannot detect a detached selection UI.
async function geometry(page: Page) {
  return page.evaluate(() => {
    const slate = (window as any).geometrySlate;
    const n = slate.nodes.one("part");
    const target = (n.resizeTarget ?? n.backgroundRect).node;
    const poly = document.querySelector(
      ".svg_select_shape",
    ) as SVGPolygonElement;
    const box = target.getBBox();
    const actual = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ].map(([x, y]) =>
      new DOMPoint(
        box.x + x * box.width,
        box.y + y * box.height,
      ).matrixTransform(target.getScreenCTM()),
    );
    const errors = actual.map((pt, i) => {
      const handle = poly.points
        .getItem(i * 2)
        .matrixTransform(poly.getScreenCTM());
      return Math.hypot(handle.x - pt.x, handle.y - pt.y);
    });
    const offsets = [
      [0.5, 0, 0, -35],
      [1, 0.5, 20, 0],
      [0.5, 1, 0, 20],
      [0, 0.5, -20, 0],
    ];
    const plugs = ["top", "right", "bottom", "left"].map((name, i) => {
      const el = document.querySelector(
        ".connection-handle-" + name,
      ) as SVGCircleElement;
      const r = el?.getBoundingClientRect();
      if (!r?.width) return null;
      const [x, y, dx, dy] = offsets[i];
      const expected = new DOMPoint(
        box.x + x * box.width + dx,
        box.y + y * box.height + dy,
      ).matrixTransform(target.getScreenCTM());
      return Math.hypot(
        r.x + r.width / 2 - expected.x,
        r.y + r.height / 2 - expected.y,
      );
    });
    const center = {
      x: (actual[0].x + actual[2].x) / 2,
      y: (actual[0].y + actual[2].y) / 2,
    };
    const world = new DOMPoint(
      n.options.x + n.options.width / 2,
      n.options.y + n.options.height / 2,
    ).matrixTransform(slate.canvas.node.getScreenCTM());
    const angle = (el: SVGGraphicsElement) => {
      const m = el.getScreenCTM()!;
      return (Math.atan2(m.b, m.a) * 180) / Math.PI;
    };
    const artwork =
      n.contentPath?.node ??
      n.nestedSvg?.node.querySelector("path") ??
      n.backgroundRect.node;
    const label =
      n.textElement?.node ?? n.nestedSvg?.node.querySelector("text");
    return {
      center,
      plugs,
      corner: { x: actual[0].x, y: actual[0].y },
      overlayError: Math.max(...errors),
      worldError: Math.hypot(center.x - world.x, center.y - world.y),
      shapeAngle: angle(artwork),
      labelAngle: angle(label),
      width: box.width,
      nodeWidth: n.options.width,
    };
  });
}

for (const [kind, shape] of Object.entries({
  rectangle: { shape: "rectangle" },
  ellipse: { shape: "ellipse" },
  circle: { shape: "circle" },
  path: { shape: "custom", vectorPath: "M6 0 L12 4 L11 11 L2 10 L0 3 Z" },
  svg: {
    svgContent:
      '<g><path d="M0 0H100V50H0Z" fill="orange"/><text x="25" y="25">SVG</text></g>',
  },
  image: {
    shape: "roundedrectangle",
    image:
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="3" height="2"%3E%3Crect width="3" height="2" fill="red"/%3E%3C/svg%3E',
  },
})) {
  test(`repeated corner resizes and live rotation keep ${kind} artwork, label and selection together`, async ({
    page,
  }) => {
    await page.goto("/test.html");
    await page.waitForFunction(() => !!(window as any).Slatebox);
    await page.evaluate(async (options) => {
      const sb = (window as any).Slatebox;
      const host = document.createElement("div");
      host.id = "geom";
      host.style.cssText =
        "position:fixed;inset:0;width:950px;height:620px;background:white";
      document.body.append(host);
      const f = await new sb.slate(
        { container: "geom", allowCollaboration: false },
        {},
      ).init();
      f.nodes.add(
        new sb.node({
          id: "part",
          text: "Workshop",
          xPos: 260,
          yPos: 180,
          width: 160,
          height: 95,
          ...options,
        }),
      );
      const s = ((window as any).geometrySlate = f.v2);
      const n = s.nodes.one("part");
      await n.ready;
      s.selectNodes([n]);
    }, shape);
    for (const [handle, dx, dy] of [
      ["lt", -22, -13],
      ["rb", 35, 18],
      ["lt", 12, 8],
      ["rb", -16, -8],
    ] as const) {
      const locator = page.locator(".svg_select_handle_" + handle);
      await expect(locator).toBeVisible();
      const { x, y } = await locator.evaluate((el: SVGPolylineElement) => {
        const pt = el.points.getItem(1).matrixTransform(el.getScreenCTM());
        return { x: pt.x, y: pt.y };
      });
      await page.mouse.move(x, y);
      await page.mouse.down();
      await page.mouse.move(x + dx, y + dy, { steps: 6 });
      expect((await geometry(page)).overlayError).toBeLessThan(2);
      await page.mouse.up();
      await page.evaluate(() => new Promise(requestAnimationFrame));
      await expect
        .poll(async () => (await geometry(page)).worldError)
        .toBeLessThan(2);
      await expect
        .poll(async () =>
          (await geometry(page)).plugs.every((err) => err !== null && err < 2),
        )
        .toBe(true);
    }
    const before = await geometry(page);
    expect(Math.abs(before.width - before.nodeWidth)).toBeLessThan(1);
    const knob = (await page
      .locator(".svg_select_handle_rot circle")
      .boundingBox())!;
    const cx = before.center.x,
      cy = before.center.y,
      dx = knob.x + knob.width / 2 - cx,
      dy = knob.y + knob.height / 2 - cy;
    await page.mouse.move(cx + dx, cy + dy);
    await page.mouse.down();
    for (const degrees of [12, 25, 40, 55]) {
      const angle = (degrees * Math.PI) / 180;
      await page.mouse.move(
        cx + dx * Math.cos(angle) - dy * Math.sin(angle),
        cy + dx * Math.sin(angle) + dy * Math.cos(angle),
        { steps: 4 },
      );
      const live = await geometry(page);
      expect(live.overlayError).toBeLessThan(2);
      expect(
        Math.abs(live.shapeAngle - before.shapeAngle - degrees),
      ).toBeLessThan(3);
      expect(
        Math.abs(live.labelAngle - before.labelAngle - degrees),
      ).toBeLessThan(3);
      expect(live.worldError).toBeLessThan(2);
    }
    await page.mouse.up();
    const last = await geometry(page);
    expect(last.overlayError).toBeLessThan(2);
    expect(last.worldError).toBeLessThan(2);
    const corner = await page
      .locator(".svg_select_handle_rb")
      .evaluate((el: SVGPolylineElement) => {
        const pt = el.points.getItem(1).matrixTransform(el.getScreenCTM());
        return { x: pt.x, y: pt.y };
      });
    await page.mouse.move(corner.x, corner.y);
    await page.mouse.down();
    await page.mouse.move(corner.x + 24, corner.y + 32, { steps: 7 });
    await page.mouse.up();
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const resized = await geometry(page);
    expect(resized.width).toBeGreaterThan(last.width + 5);
    expect(
      Math.hypot(
        resized.corner.x - last.corner.x,
        resized.corner.y - last.corner.y,
      ),
    ).toBeLessThan(2);
    expect(resized.worldError).toBeLessThan(2);
    expect(resized.overlayError).toBeLessThan(2);
  });
}
