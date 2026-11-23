import { describe, expect, it } from "vitest";
import {
  SHAPE_LIMITS,
  normalizeShapePath,
  parseShapePath,
  prepareShape,
  shapeTextBox,
  validateShapePath,
} from "../../../src/shapes";

// The six stand-ins from the design mock (work-shapes/mock/shapes.html).
export const MOCK = {
  rocket: { fillRule: "evenodd", d: "M50,0 C64,10 72,28 72,50 L72,74 L88,90 L88,100 L70,92 L30,92 L12,100 L12,90 L28,74 L28,50 C28,28 36,10 50,0 Z M41,34 A9,9 0 1 1 59,34 A9,9 0 1 1 41,34 Z M40,92 L50,100 L60,92 Z", box: { x: 0.23, y: 0.44, w: 0.54, h: 0.48 } },
  bubble: { fillRule: "nonzero", d: "M28,0 H92 Q100,0 100,8 V62 Q100,70 92,70 H28 Q20,70 20,62 V44 L0,52 L20,30 V8 Q20,0 28,0 Z", box: { x: 0.21, y: 0.06, w: 0.77, h: 0.79 } },
  cloud: { fillRule: "nonzero", d: "M30,60 A14,14 0 0 1 22,34 A16,16 0 0 1 46,18 A18,18 0 0 1 78,22 A14,14 0 0 1 92,46 A13,13 0 0 1 78,64 A16,16 0 0 1 52,68 A14,14 0 0 1 30,60 Z M16,78 A6,6 0 1 0 28,78 A6,6 0 1 0 16,78 Z M6,92 A4,4 0 1 0 14,92 A4,4 0 1 0 6,92 Z", box: { x: 0.21, y: 0.15, w: 0.71, h: 0.42 } },
  hexagon: { fillRule: "evenodd", d: "M50,0 L93,25 L93,75 L50,100 L7,75 L7,25 Z M50,12 L68,24 L62,28 L50,20 L38,28 L32,24 Z", box: { x: 0, y: 0.29, w: 1, h: 0.46 } },
  tag: { fillRule: "evenodd", d: "M0,10 Q0,0 10,0 H75 L100,50 L75,100 H10 Q0,100 0,90 Z M78,50 A6,6 0 1 1 90,50 A6,6 0 1 1 78,50 Z", box: { x: 0, y: 0.1, w: 0.77, h: 0.79 } },
  shield: { fillRule: "nonzero", d: "M50,0 L92,12 V45 C92,72 74,90 50,100 C26,90 8,72 8,45 V12 Z", box: { x: 0.08, y: 0.1, w: 0.83, h: 0.6 } },
} as const;

describe("validateShapePath", () => {
  for (const [name, shape] of Object.entries(MOCK)) {
    it(`accepts the ${name}`, () => {
      expect(validateShapePath(shape.d, { fillRule: shape.fillRule })).toEqual({ ok: true });
    });
  }

  const refuse = (d: string, code: string, fillRule?: string) =>
    expect(validateShapePath(d, fillRule ? { fillRule } : {})).toMatchObject({ ok: false, code });

  it("refuses markup", () => refuse('<path d="M0 0 L10 0 L10 10 Z"/>', "bad_character"));
  it("refuses url( and quotes", () => {
    refuse("M0 0 L10 0 url(#x) Z", "bad_character");
    refuse("M0 0 L10 0 L10 10 Z'", "bad_character");
  });
  it("refuses exponent numbers", () => refuse("M0 0 L1e9 0 L0 10 Z", "bad_character"));
  it("refuses letters outside the path commands", () => refuse("M0 0 X10 0 L0 10 Z", "bad_character"));
  it("refuses NaN", () => refuse("M0 0 LNaN 0 Z", "bad_character"));
  it("refuses huge numbers", () => refuse("M0 0 L20000 0 L0 10 Z", "bad_number"));
  it("refuses an open far path", () => refuse("M0,0 L10,0 L10,10", "not_closed"));
  it("refuses a degenerate path", () => refuse("M0,0 L100,0 L100,0.1 Z", "degenerate"));
  it("refuses too many parts", () => {
    const parts = Array.from({ length: 25 }, (_, i) => `M${i * 4} 0 L${i * 4 + 2} 0 L${i * 4 + 2} 40 L${i * 4} 40 Z`).join(" ");
    refuse(parts, "too_many_parts");
  });
  it("refuses too long input", () => refuse("M0 0 " + "L10 10 ".repeat(1300) + "Z", "too_long"));
  it("refuses too many segments", () => {
    const pts = Array.from({ length: SHAPE_LIMITS.maxSegments + 2 }, (_, i) => `L${(i % 50) * 2} ${Math.floor(i / 50) * 10 + 5}`).join("");
    refuse("M0 0" + pts + "Z", "too_many_segments");
  });
  it("refuses a bad fill rule", () => refuse(MOCK.shield.d, "bad_fill_rule", "inherit"));
  it("refuses a path that is not a path", () => {
    refuse("", "empty");
    refuse("10 10 20 20", "bad_syntax");
    refuse("M10", "bad_syntax");
  });
  it("refuses a hairline shape", () => refuse("M0 0 L100 0 L100 100 L0 100 Z M1 1 L99 1 L99 99 L1 99 Z", "too_thin", "evenodd"));
});

describe("normalizeShapePath", () => {
  it("puts the bounds at 0,0 with the longer side 100 and returns the aspect", () => {
    const out = normalizeShapePath("M200,300 L400,300 L400,400 L200,400 Z");
    expect(out.d).toBe("M0 0L100 0L100 50L0 50Z");
    expect(out.aspect).toBeCloseTo(2, 5);
  });

  it("is idempotent", () => {
    for (const shape of Object.values(MOCK)) {
      const once = normalizeShapePath(shape.d).d;
      expect(normalizeShapePath(once).d).toBe(once);
    }
  });

  it("closes a nearly closed sub-path", () => {
    const out = normalizeShapePath("M0 0 L100 0 L100 100 L0 100 L0 1");
    expect(out.d.endsWith("Z")).toBe(true);
    expect(validateShapePath("M0 0 L100 0 L100 100 L0 100 L0 1")).toEqual({ ok: true });
  });

  it("writes absolute commands only and keeps arcs", () => {
    const out = normalizeShapePath("m10 10 h80 v80 h-80 z m30 30 a10 10 0 1 1 20 0 a10 10 0 1 1 -20 0 z");
    expect(out.d).not.toMatch(/[a-z]/);
    expect(out.d).toContain("A");
  });

  it("keeps the result small", () => {
    for (const shape of Object.values(MOCK)) expect(normalizeShapePath(shape.d).d.length).toBeLessThan(600);
  });
});

describe("shapeTextBox", () => {
  for (const [name, shape] of Object.entries(MOCK)) {
    it(`matches the measured box for the ${name}`, () => {
      const box = shapeTextBox(shape.d, shape.fillRule)!;
      expect(box).not.toBeNull();
      const cap = (v: number) => Math.min(v, SHAPE_LIMITS.textBoxCap);
      expect(box.w).toBeCloseTo(cap(shape.box.w), 1);
      expect(box.h).toBeCloseTo(cap(shape.box.h), 1);
      expect(Math.abs(box.x + box.w / 2 - (shape.box.x + shape.box.w / 2))).toBeLessThan(0.05);
      expect(Math.abs(box.y + box.h / 2 - (shape.box.y + shape.box.h / 2))).toBeLessThan(0.05);
    });
  }

  it("leaves the tag's hole out under evenodd", () => {
    const box = shapeTextBox(MOCK.tag.d, "evenodd")!;
    // The hole sits at x .78-.90: the box must end before it.
    expect(box.x + box.w).toBeLessThanOrEqual(0.79);
  });

  it("returns null for a thin ring", () => {
    expect(shapeTextBox("M0 0 L100 0 L100 100 L0 100 Z M8 8 L92 8 L92 92 L8 92 Z", "evenodd")).toBeNull();
  });
});

describe("prepareShape", () => {
  it("returns everything a note stores", () => {
    const shape = prepareShape({ name: "Rocket", d: MOCK.rocket.d, fillRule: "evenodd" });
    expect(shape.ok).toBe(true);
    if (!shape.ok) return;
    expect(shape.shape).toMatchObject({ name: "Rocket", fillRule: "evenodd" });
    expect(shape.shape.d.startsWith("M")).toBe(true);
    expect(shape.shape.textBox).toBeTruthy();
    expect(shape.shape.aspect).toBeGreaterThan(0);
  });

  it("refuses a bad path with the validator's code", () => {
    expect(prepareShape({ name: "x", d: "<svg/>" })).toMatchObject({ ok: false, code: "bad_character" });
  });

  it("parses into sub-paths", () => {
    expect(parseShapePath(MOCK.rocket.d).length).toBe(3);
  });
});

describe("a nearly full arc that rounding would close", () => {
  it("is refused rather than stored as an outline that draws nothing", () => {
    const result = prepareShape({ d: "M50,0 A50,50 0 1 1 49.99,0 Z" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.code).toBe("degenerate");
  });

  it("a circle drawn as two arcs is kept", () => {
    const result = prepareShape({ d: "M50,0 A50,50 0 1 1 50,100 A50,50 0 1 1 50,0 Z" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(validateShapePath(result.shape.d).ok).toBe(true);
  });
});
