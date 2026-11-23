import { describe, it, expect, vi, beforeEach } from "vitest";
import { Camera, cameraBetween, cameraFor, viewboxFor } from "../../src/core/Camera";
import { Images } from "../../src/core/Images";

// A slate whose canvas records every viewbox write, in a 1000×600 host.
function fakeSlate(w = 1000, h = 600) {
  const writes: number[][] = [];
  let vb = { x: 0, y: 0, width: w, height: h };
  const canvas = {
    viewbox(...args: number[]) {
      if (!args.length) return vb;
      writes.push(args);
      vb = { x: args[0], y: args[1], width: args[2], height: args[3] };
      return canvas;
    },
  };
  const element = { getBoundingClientRect: () => ({ width: w, height: h }), style: {} as Record<string, string> };
  return { canvas, element, panZoom: { getViewportSize: () => ({ w, h }) }, writes };
}

// Run requestAnimationFrame by hand: each call advances the clock by `step` ms.
function manualFrames(step = 16) {
  let now = 0;
  const queue: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => { queue.push(cb); return queue.length; });
  vi.stubGlobal("cancelAnimationFrame", () => {});
  vi.spyOn(performance, "now").mockImplementation(() => now);
  return {
    run(limit = 1000) {
      let n = 0;
      while (queue.length && n < limit) { now += step; queue.shift()!(now); n += 1; }
      return n;
    },
  };
}

describe("Camera maths", () => {
  it("frames a box in the room left above a caption band", () => {
    const c = cameraFor({ x: 0, y: 0, width: 200, height: 100 }, { w: 1000, h: 600 }, { fill: 1, bottom: 100 });
    // 1000×500 of room: the box is height-bound (500/100 = 5) and width-bound (1000/200 = 5).
    expect(c.scale).toBeCloseTo(5);
    expect(c.cx).toBe(100);
    expect(c.cy).toBe(50);
    expect(c.dy).toBeCloseTo(-50);
  });

  it("cover fills the viewport (crops), fit leaves margins", () => {
    const box = { x: 0, y: 0, width: 400, height: 100 };
    const fit = cameraFor(box, { w: 1000, h: 1000 }, { fill: 1 });
    const cover = cameraFor(box, { w: 1000, h: 1000 }, { cover: true });
    expect(fit.scale).toBeCloseTo(2.5);
    expect(cover.scale).toBeCloseTo(10);
  });

  it("a prezi arc pulls back mid-flight when the travel is longer than a viewport", () => {
    const view = { w: 1000, h: 600 };
    const a = { cx: 0, cy: 0, scale: 2, roll: 0, dy: 0 };
    const b = { cx: 3000, cy: 0, scale: 2, roll: 8, dy: 0 };
    const mid = cameraBetween(a, b, 0.5, view, "prezi");
    expect(mid.scale).toBeLessThan(a.scale);
    expect(mid.scale).toBeLessThan(b.scale);
    expect(mid.roll).toBeCloseTo(4, 0);
    const direct = cameraBetween(a, b, 0.5, view, "direct");
    expect(direct.scale).toBeCloseTo(2);
    expect(cameraBetween(a, b, 1, view, "prezi")).toMatchObject({ cx: 3000, scale: 2, roll: 8 });
  });

  it("the viewbox maps the screen offset through the roll", () => {
    const level = viewboxFor({ cx: 100, cy: 100, scale: 2, roll: 0, dy: 0 }, { w: 1000, h: 600 }, 1000);
    expect(level).toEqual({ x: -150, y: -150, width: 500, height: 500 });
    // Rolled 90°: a screen offset down is a canvas offset sideways.
    const rolled = viewboxFor({ cx: 0, cy: 0, scale: 1, roll: 90, dy: 100 }, { w: 1000, h: 1000 }, 1000);
    expect(rolled.x + rolled.width / 2).toBeCloseTo(-100);
    expect(rolled.y + rolled.height / 2).toBeCloseTo(0);
  });
});

describe("Camera.flyTo", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("cut writes the viewbox once and resolves", async () => {
    const slate = fakeSlate();
    const camera = new Camera(slate as any);
    await camera.flyTo({ bbox: { x: 0, y: 0, width: 100, height: 100 } }, { arc: "cut" });
    expect(slate.writes.length).toBe(1);
    expect(camera.current()?.cx).toBe(50);
  });

  it("a flight writes the viewbox over many frames, zooming out mid-way", async () => {
    const frames = manualFrames(16);
    const slate = fakeSlate();
    const camera = new Camera(slate as any);
    await camera.flyTo({ bbox: { x: 0, y: 0, width: 100, height: 100 } }, { arc: "cut" });
    const widths: number[] = [];
    const flight = camera.flyTo({ bbox: { x: 4000, y: 0, width: 100, height: 100 } }, { duration: 800, onFrame: () => widths.push(slate.canvas.viewbox().width) });
    frames.run();
    await flight;
    expect(widths.length).toBeGreaterThan(10);
    // The viewbox is widest (zoomed out) somewhere in the middle of the flight.
    const widest = Math.max(...widths);
    expect(widest).toBeGreaterThan(widths[0]);
    expect(widest).toBeGreaterThan(widths.at(-1)!);
  });

  it("an abort signal stops a flight and rejects", async () => {
    manualFrames(16);
    const slate = fakeSlate();
    const camera = new Camera(slate as any);
    const controller = new AbortController();
    const flight = camera.flyTo({ bbox: { x: 2000, y: 0, width: 50, height: 50 } }, { duration: 800, signal: controller.signal });
    controller.abort();
    await expect(flight).rejects.toThrow(/abort/i);
  });

  it("a newer flight cancels the one in progress", async () => {
    const frames = manualFrames(16);
    const slate = fakeSlate();
    const camera = new Camera(slate as any);
    const first = camera.flyTo({ bbox: { x: 2000, y: 0, width: 50, height: 50 } }, { duration: 800 });
    const second = camera.flyTo({ bbox: { x: 0, y: 0, width: 50, height: 50 } }, { duration: 300 });
    frames.run();
    await expect(first).rejects.toThrow(/abort/i);
    await second;
    expect(camera.current()?.cx).toBe(25);
  });

  it("roll is applied to the roll host and forced level when reduced", async () => {
    const slate = fakeSlate();
    const camera = new Camera(slate as any);
    const host = { style: { transform: "" } };
    camera.setRollHost(host as any);
    await camera.flyTo({ bbox: { x: 0, y: 0, width: 100, height: 100 }, roll: 8 }, { arc: "cut" });
    expect(host.style.transform).toBe("rotate(8deg)");
    await camera.flyTo({ bbox: { x: 0, y: 0, width: 100, height: 100 }, roll: 8 }, { arc: "cut", reduced: true });
    expect(host.style.transform).toBe("rotate(0deg)");
  });
});

describe("imageFit", () => {
  it("cover fills the shape (slice), the default letterboxes (meet)", () => {
    const attrs: Record<string, string>[] = [];
    const node: any = {
      id: "n",
      options: { width: 100, height: 60, imageFit: "cover" },
      backgroundRect: { fill: vi.fn() },
      svgGroup: {
        root: () => ({
          defs: () => ({
            pattern: (_w: number, _h: number, add: (a: any) => void) => {
              const image: any = { size: () => image, attr: (k: string, v: string) => { attrs.push({ [k]: v }); return image; } };
              add({ image: () => image });
              const pattern: any = { attr: () => pattern, remove: () => {} };
              return pattern;
            },
          }),
        }),
      },
    };
    vi.spyOn(console, "log").mockImplementation(() => {});
    new Images(node).set("https://example.com/a.png", 100, 60);
    expect(attrs).toContainEqual({ preserveAspectRatio: "xMidYMid slice" });
    attrs.length = 0;
    node.options.imageFit = undefined;
    new Images(node).set("https://example.com/a.png", 100, 60);
    expect(attrs).toContainEqual({ preserveAspectRatio: "xMidYMid meet" });
  });
});
