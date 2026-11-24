import { describe, expect, it } from "vitest";
import {
  KNOB_OFFSET,
  KNOB_OFFSET_SMALL,
  KNOB_SIZE,
  KNOB_SIZE_SMALL,
  knobMetrics,
  shortSidePx,
  normalizeAngle,
  rotateKnobPosition,
  chooseKnobSide,
  clearPoints,
  rotationFromPointer,
  snapAngle,
} from "../../src/core/RotateKnob";

const c = { x: 100, y: 100 };
const at = (deg: number, r = 50) => ({
  x: c.x + r * Math.cos((deg * Math.PI) / 180),
  y: c.y + r * Math.sin((deg * Math.PI) / 180),
});

describe("normalizeAngle", () => {
  it("maps any angle into (-180, 180]", () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(180)).toBe(180);
    expect(normalizeAngle(-180)).toBe(180);
    expect(normalizeAngle(190)).toBe(-170);
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(-725)).toBe(-5);
    expect(Object.is(normalizeAngle(-360), -0)).toBe(false);
  });
});

describe("rotationFromPointer", () => {
  it("is the start angle plus the pointer's sweep around the centre", () => {
    expect(rotationFromPointer(0, c, at(-90), at(-45))).toBe(45);
    expect(rotationFromPointer(10, c, at(-90), at(-135))).toBe(-35);
  });

  it("turns the right way whatever side the grab started on (corner knob)", () => {
    // Grab at the top-right corner (-45°), move clockwise on screen by 30°.
    expect(rotationFromPointer(0, c, at(-45), at(-15))).toBe(30);
    // Grab below the centre and move left: clockwise on screen too.
    expect(rotationFromPointer(0, c, at(90), at(120))).toBe(30);
  });

  it("rounds to whole degrees without Shift", () => {
    expect(rotationFromPointer(0, c, at(0), at(12.4))).toBe(12);
    expect(rotationFromPointer(0, c, at(0), at(12.6))).toBe(13);
  });

  it("snaps to 15° steps with Shift", () => {
    expect(rotationFromPointer(0, c, at(0), at(22), { shift: true })).toBe(15);
    expect(rotationFromPointer(0, c, at(0), at(23), { shift: true })).toBe(30);
    expect(rotationFromPointer(5, c, at(0), at(-52), { shift: true })).toBe(-45);
  });

  it("sticks to right angles within 4° on touch only", () => {
    expect(snapAngle(87, { coarse: true })).toBe(90);
    expect(snapAngle(93.9, { coarse: true })).toBe(90);
    expect(snapAngle(85, { coarse: true })).toBe(85);
    expect(snapAngle(87)).toBe(87);
    expect(snapAngle(-2, { coarse: true })).toBe(0);
  });

  it("normalises the result", () => {
    expect(rotationFromPointer(170, c, at(0), at(30))).toBe(-160);
  });
});

describe("rotateKnobPosition", () => {
  // lt, t, rt, r, rb, b, lb, l of a 160x68 box at (0,0)
  const box = (w: number, h: number) =>
    [
      [0, 0], [w / 2, 0], [w, 0], [w, h / 2], [w, h], [w / 2, h], [0, h], [0, h / 2],
    ] as Array<[number, number]>;

  it("sits outside the top-right corner, KNOB_OFFSET screen px along each axis", () => {
    const [x, y] = rotateKnobPosition(box(160, 68), 1)!;
    expect(x).toBeCloseTo(160 + KNOB_OFFSET);
    expect(y).toBeCloseTo(-KNOB_OFFSET);
  });

  it("keeps a constant screen distance at any zoom", () => {
    for (const zoom of [0.5, 1, 2]) {
      const [x, y] = rotateKnobPosition(box(160, 68), zoom)!;
      expect((x - 160) * zoom).toBeCloseTo(KNOB_OFFSET);
      expect(-y * zoom).toBeCloseTo(KNOB_OFFSET);
    }
  });

  it("turns with the note", () => {
    // The same box rotated 90° clockwise about the origin: (x, y) -> (-y, x).
    const pts = box(160, 68).map(([x, y]) => [-y, x]) as Array<[number, number]>;
    const [x, y] = rotateKnobPosition(pts, 1)!;
    // Top-right corner is now (0, 160); "along" is +y, "up" is +x.
    expect(x).toBeCloseTo(KNOB_OFFSET);
    expect(y).toBeCloseTo(160 + KNOB_OFFSET);
  });

  it("stays clear of the top and right connect dots", () => {
    // Top dot is 35 units above top-centre, right dot 20 units right of mid-right.
    for (const [w, h] of [[160, 68], [40, 30], [300, 200]]) {
      const [x, y] = rotateKnobPosition(box(w, h), 1)!;
      expect(Math.hypot(x - w / 2, y + 35)).toBeGreaterThan(22 + 8);
      expect(Math.hypot(x - (w + 20), y - h / 2)).toBeGreaterThan(14 + 8);
    }
  });

  it("returns null for missing points and survives a collapsed box", () => {
    expect(rotateKnobPosition([], 1)).toBeNull();
    const p = rotateKnobPosition(box(0, 0), 1)!;
    expect(p.every(Number.isFinite)).toBe(true);
  });
});

describe("knob size for small notes", () => {
  const box = (w: number, h: number): Array<[number, number]> => [
    [0, 0], [w / 2, 0], [w, 0], [w, h / 2], [w, h], [w / 2, h], [0, h], [0, h / 2],
  ];
  it("no knob under 24px, the small knob under 48px, the full knob otherwise", () => {
    expect(knobMetrics(17).visible).toBe(false); // a 160x68 note at 25%
    expect(knobMetrics(23.9).visible).toBe(false);
    expect(knobMetrics(24)).toMatchObject({ visible: true, size: KNOB_SIZE_SMALL, offset: KNOB_OFFSET_SMALL });
    expect(knobMetrics(34)).toMatchObject({ visible: true, size: KNOB_SIZE_SMALL }); // 160x68 at 50%
    expect(knobMetrics(48)).toMatchObject({ visible: true, size: KNOB_SIZE, offset: KNOB_OFFSET });
    expect(knobMetrics(68).hit).toBeGreaterThanOrEqual(44);
    expect(knobMetrics(Number.NaN).size).toBe(KNOB_SIZE);
  });

  it("with a finger the knob keeps its full size and 44px target until it goes", () => {
    expect(knobMetrics(34, true)).toMatchObject({ visible: true, size: KNOB_SIZE });
    expect(knobMetrics(34, true).hit).toBeGreaterThanOrEqual(44);
    expect(knobMetrics(20, true).visible).toBe(false);
  });

  it("the small knob is never bigger than the note it turns", () => {
    for (let side = 24; side < 48; side++) expect(knobMetrics(side).size).toBeLessThanOrEqual(side);
  });

  it("measures the shorter side on screen, rotated or not", () => {
    expect(shortSidePx(box(160, 68), 0.25)).toBeCloseTo(17);
    expect(shortSidePx(box(160, 68), 1)).toBeCloseTo(68);
    const turned = box(160, 68).map(([x, y]) => [-y, x]) as Array<[number, number]>;
    expect(shortSidePx(turned, 2)).toBeCloseTo(136);
    expect(shortSidePx([], 1)).toBe(Infinity);
  });
});

describe("the knob's corner when the right one is covered (a host side panel)", () => {
  const box = (w: number, h: number) =>
    [
      [0, 0], [w / 2, 0], [w, 0], [w, h / 2], [w, h], [w / 2, h], [0, h], [0, h / 2],
    ] as Array<[number, number]>;

  it("the left side sits outside the top-left corner, as far out as the right one", () => {
    for (const zoom of [0.5, 1, 2]) {
      const [x, y] = rotateKnobPosition(box(160, 68), zoom, KNOB_OFFSET, "left")!;
      expect(x * zoom).toBeCloseTo(-KNOB_OFFSET);
      expect(y * zoom).toBeCloseTo(-KNOB_OFFSET);
    }
  });

  it("the left side turns with the note", () => {
    // Rotated 90° clockwise about the origin: (x, y) -> (-y, x); top-left stays at the origin,
    // "along" is +y and "up" is +x, so the knob is at (+offset, -offset).
    const pts = box(160, 68).map(([x, y]) => [-y, x]) as Array<[number, number]>;
    const [x, y] = rotateKnobPosition(pts, 1, KNOB_OFFSET, "left")!;
    expect(x).toBeCloseTo(KNOB_OFFSET);
    expect(y).toBeCloseTo(-KNOB_OFFSET);
  });

  it("keeps the right corner when it is clear, flips left only when left is clearer", () => {
    expect(chooseKnobSide(() => 5, 5)).toBe("right");
    expect(chooseKnobSide((s) => (s === "right" ? 0 : 5), 5)).toBe("left");
    expect(chooseKnobSide((s) => (s === "right" ? 2 : 3), 5)).toBe("left");
    // Both covered alike (or the left worse): it stays right.
    expect(chooseKnobSide(() => 0, 5)).toBe("right");
    expect(chooseKnobSide((s) => (s === "right" ? 3 : 1), 5)).toBe("right");
  });

  it("a point is clear only where the slate's own drawing is on top, inside the window", () => {
    const canvas = document.createElement("div");
    const inside = document.createElement("span");
    canvas.appendChild(inside);
    const panel = document.createElement("aside");
    document.body.append(canvas, panel);
    const original = document.elementFromPoint;
    // A side panel over everything right of x = 300.
    (document as any).elementFromPoint = (x: number) => (x > 300 ? panel : inside);
    try {
      expect(clearPoints([{ x: 100, y: 10 }, { x: 200, y: 10 }], canvas)).toBe(2);
      expect(clearPoints([{ x: 290, y: 10 }, { x: 310, y: 10 }], canvas)).toBe(1);
      expect(clearPoints([{ x: -5, y: 10 }, { x: 100, y: -1 }], canvas)).toBe(0);
    } finally {
      (document as any).elementFromPoint = original;
      canvas.remove();
      panel.remove();
    }
  });
});
