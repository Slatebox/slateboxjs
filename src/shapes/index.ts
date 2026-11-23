/**
 * Custom shapes as data (slateboxjs/shapes). A custom shape is ONE SVG path
 * `d` string: it may hold several closed sub-paths (parts and holes) and comes
 * with a fill rule. Never markup. This module is pure (no DOM, no
 * dependencies) so the browser, a server and the operation contract all check
 * shapes with the same code.
 *
 *   validateShapePath(d, {fillRule})  -> {ok} | {ok:false, code, message}
 *   normalizeShapePath(d)             -> {d, aspect}   absolute, at 0,0, longer side 100
 *   shapeTextBox(d, fillRule)         -> {x,y,w,h} in 0..1 of the bounds, or null
 *   prepareShape({name, d, fillRule}) -> the validated, normalised shape a note stores
 */

export type FillRule = "nonzero" | "evenodd";

export interface ShapeTextBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** What a note stores for a custom shape (beside `shape: "custom"`). */
export interface CustomShape {
  name: string;
  d: string;
  fillRule: FillRule;
  /** width / height of the outline. */
  aspect: number;
  /** Where a label sits, in 0..1 of the outline's bounds; null when none fits well. */
  textBox: ShapeTextBox | null;
  /** The library entry the shape came from, when it came from one. */
  ref?: { id: string; name?: string };
}

export type ShapeProblemCode =
  | "empty"
  | "bad_character"
  | "bad_syntax"
  | "too_long"
  | "too_many_segments"
  | "too_many_parts"
  | "bad_number"
  | "not_closed"
  | "degenerate"
  | "too_thin"
  | "bad_fill_rule"
  | "bad_name";

export type ShapeCheck = { ok: true } | { ok: false; code: ShapeProblemCode; message: string };

export const SHAPE_LIMITS = Object.freeze({
  /** Raw input characters. */
  maxInput: 8000,
  /** Normalised output characters. */
  maxNormalized: 6000,
  maxSegments: 300,
  maxParts: 24,
  maxMagnitude: 10000,
  /** A sub-path whose end is this close to its start (of the larger side) is closed for you. */
  closeTolerance: 0.02,
  /** A side shorter than this fraction of the other is a line, not a shape. */
  minSideRatio: 0.05,
  /** The filled area must cover at least this much of the bounds. */
  minFill: 0.08,
  /** Text never touches an edge. */
  textBoxCap: 0.92,
  /** A smaller best box than this (each side) means text will not fit well. */
  minTextBox: 0.15,
  maxName: 60,
  /**
   * Flattened outline points, all parts together. Curves and arcs are drawn
   * with fewer steps when a path would go over it, so a check costs about the
   * same for every path the grammar allows.
   */
  maxPoints: 2400,
});

const MESSAGES: Record<ShapeProblemCode, string> = {
  empty: "The shape has no path.",
  bad_character: "The shape path may hold only path commands and plain numbers.",
  bad_syntax: "The shape path could not be read.",
  too_long: `The shape path is too long (at most ${SHAPE_LIMITS.maxInput} characters).`,
  too_many_segments: `The shape has too many segments (at most ${SHAPE_LIMITS.maxSegments}).`,
  too_many_parts: `The shape has too many parts (at most ${SHAPE_LIMITS.maxParts}).`,
  bad_number: `The shape path has a number out of range (at most ${SHAPE_LIMITS.maxMagnitude} either way).`,
  not_closed: "Every part of the shape must be closed.",
  degenerate: "The shape is too flat to hold a note.",
  too_thin: "The shape is too thin to hold a note.",
  bad_fill_rule: "The fill rule must be nonzero or evenodd.",
  bad_name: `The shape needs a name of 1 to ${SHAPE_LIMITS.maxName} characters.`,
};

const fail = (code: ShapeProblemCode): ShapeCheck => ({ ok: false, code, message: MESSAGES[code] });

export class ShapePathError extends Error {
  constructor(public code: ShapeProblemCode) {
    super(MESSAGES[code]);
  }
}

/** Only path commands, digits, signs, dots, commas and spaces. No exponents. */
const ALLOWED = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+-]*$/;
const ARITY: Record<string, number> = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

/** An absolute segment: M, L, C, Q, A or Z (H/V become L, S becomes C, T becomes Q). */
export type Segment =
  | { c: "M"; x: number; y: number }
  | { c: "L"; x: number; y: number }
  | { c: "C"; x1: number; y1: number; x2: number; y2: number; x: number; y: number }
  | { c: "Q"; x1: number; y1: number; x: number; y: number }
  | { c: "A"; rx: number; ry: number; rot: number; large: 0 | 1; sweep: 0 | 1; x: number; y: number }
  | { c: "Z" };

/** One sub-path: starts with M, may end with Z. */
export type SubPath = Segment[];

function tokenize(d: string): Array<string | number> {
  const tokens: Array<string | number> = [];
  const re = /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.?\d*|\.\d+))|([\s,]+)/y;
  let index = 0;
  while (index < d.length) {
    re.lastIndex = index;
    const match = re.exec(d);
    if (!match || match[0].length === 0) throw new ShapePathError("bad_syntax");
    if (match[1]) tokens.push(match[1]);
    else if (match[2]) tokens.push(match[2]);
    index = re.lastIndex;
  }
  return tokens;
}

/**
 * Parse a path into absolute sub-paths. Throws ShapePathError on anything
 * that is not a plain path. Arc flags may be written without separators.
 */
export function parseShapePath(d: string): SubPath[] {
  if (typeof d !== "string" || !d.trim()) throw new ShapePathError("empty");
  if (d.length > SHAPE_LIMITS.maxInput) throw new ShapePathError("too_long");
  if (!ALLOWED.test(d)) throw new ShapePathError("bad_character");
  const raw = tokenize(d);
  // Split compact arc flags ("0 01" or "011") later: keep strings for numbers.
  const parts: SubPath[] = [];
  let current: SubPath | null = null;
  let x = 0, y = 0, startX = 0, startY = 0;
  let lastC: { x: number; y: number } | null = null; // reflection for S
  let lastQ: { x: number; y: number } | null = null; // reflection for T
  let i = 0;
  let command = "";
  let segments = 0;

  const isCommand = (t: unknown) => typeof t === "string" && /^[A-Za-z]$/.test(t);
  const num = (): number => {
    const t = raw[i];
    if (t === undefined || isCommand(t)) throw new ShapePathError("bad_syntax");
    i++;
    const v = Number(t);
    if (!Number.isFinite(v)) throw new ShapePathError("bad_syntax");
    if (Math.abs(v) > SHAPE_LIMITS.maxMagnitude) throw new ShapePathError("bad_number");
    return v;
  };
  const flag = (): 0 | 1 => {
    const t = raw[i];
    if (typeof t !== "string" || isCommand(t)) throw new ShapePathError("bad_syntax");
    // A flag is one character; the rest of a compact token stays for the next read.
    const ch = t.replace(/^\+/, "")[0];
    if (ch !== "0" && ch !== "1") throw new ShapePathError("bad_syntax");
    const rest = t.replace(/^\+/, "").slice(1);
    if (rest) raw[i] = rest;
    else i++;
    return ch === "1" ? 1 : 0;
  };
  const push = (segment: Segment) => {
    if (!current) throw new ShapePathError("bad_syntax");
    current.push(segment);
    if (++segments > SHAPE_LIMITS.maxSegments) throw new ShapePathError("too_many_segments");
  };

  while (i < raw.length) {
    const t = raw[i];
    if (isCommand(t)) {
      command = t as string;
      i++;
    } else if (!command) {
      throw new ShapePathError("bad_syntax");
    }
    const rel = command === command.toLowerCase();
    const C = command.toUpperCase();
    const arity = ARITY[C];
    // Z takes no numbers: handle once and continue.
    if (C === "Z") {
      push({ c: "Z" });
      x = startX;
      y = startY;
      lastC = lastQ = null;
      command = "";
      continue;
    }
    // At least one full set of numbers must follow a command.
    if (i >= raw.length || isCommand(raw[i])) throw new ShapePathError("bad_syntax");
    let first = true;
    while (i < raw.length && !isCommand(raw[i])) {
      const ox = rel ? x : 0, oy = rel ? y : 0;
      switch (C) {
        case "M": {
          const nx = num() + ox, ny = num() + oy;
          if (first) {
            if (parts.length >= SHAPE_LIMITS.maxParts) throw new ShapePathError("too_many_parts");
            current = [];
            parts.push(current);
            push({ c: "M", x: nx, y: ny });
            startX = nx;
            startY = ny;
          } else {
            push({ c: "L", x: nx, y: ny }); // extra M pairs are lines
          }
          x = nx; y = ny; lastC = lastQ = null;
          break;
        }
        case "L": {
          const nx = num() + ox, ny = num() + oy;
          push({ c: "L", x: nx, y: ny });
          x = nx; y = ny; lastC = lastQ = null;
          break;
        }
        case "H": {
          const nx = num() + ox;
          push({ c: "L", x: nx, y });
          x = nx; lastC = lastQ = null;
          break;
        }
        case "V": {
          const ny = num() + oy;
          push({ c: "L", x, y: ny });
          y = ny; lastC = lastQ = null;
          break;
        }
        case "C": {
          const x1 = num() + ox, y1 = num() + oy, x2 = num() + ox, y2 = num() + oy, nx = num() + ox, ny = num() + oy;
          push({ c: "C", x1, y1, x2, y2, x: nx, y: ny });
          lastC = { x: x2, y: y2 }; lastQ = null; x = nx; y = ny;
          break;
        }
        case "S": {
          const x1: number = lastC ? 2 * x - lastC.x : x, y1: number = lastC ? 2 * y - lastC.y : y;
          const x2 = num() + ox, y2 = num() + oy, nx = num() + ox, ny = num() + oy;
          push({ c: "C", x1, y1, x2, y2, x: nx, y: ny });
          lastC = { x: x2, y: y2 }; lastQ = null; x = nx; y = ny;
          break;
        }
        case "Q": {
          const x1 = num() + ox, y1 = num() + oy, nx = num() + ox, ny = num() + oy;
          push({ c: "Q", x1, y1, x: nx, y: ny });
          lastQ = { x: x1, y: y1 }; lastC = null; x = nx; y = ny;
          break;
        }
        case "T": {
          const x1: number = lastQ ? 2 * x - lastQ.x : x, y1: number = lastQ ? 2 * y - lastQ.y : y;
          const nx = num() + ox, ny = num() + oy;
          push({ c: "Q", x1, y1, x: nx, y: ny });
          lastQ = { x: x1, y: y1 }; lastC = null; x = nx; y = ny;
          break;
        }
        case "A": {
          const rx = Math.abs(num()), ry = Math.abs(num()), rot = num();
          const large = flag(), sweep = flag();
          const nx = num() + ox, ny = num() + oy;
          push({ c: "A", rx, ry, rot, large, sweep, x: nx, y: ny });
          x = nx; y = ny; lastC = lastQ = null;
          break;
        }
        default:
          throw new ShapePathError("bad_syntax");
      }
      first = false;
      if (arity === 0) break;
    }
  }
  if (!parts.length) throw new ShapePathError("bad_syntax");
  return parts;
}

// ---- geometry -------------------------------------------------------------

type Pt = [number, number];

function arcPoints(x0: number, y0: number, s: Extract<Segment, { c: "A" }>, perQuarter = 12): Pt[] {
  // SVG arc implementation notes F.6.5 (endpoint to centre parameterisation).
  let { rx, ry } = s;
  const { x, y } = s;
  if (rx === 0 || ry === 0 || (x0 === x && y0 === y)) return [[x, y]];
  const phi = (s.rot * Math.PI) / 180;
  const cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x0 - x) / 2, dy = (y0 - y) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    const k = Math.sqrt(lambda);
    rx *= k;
    ry *= k;
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coef = Math.sqrt(Math.max(0, num / den));
  if (s.large === s.sweep) coef = -coef;
  const cxp = (coef * rx * y1p) / ry, cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x0 + x) / 2, cy = sin * cxp + cos * cyp + (y0 + y) / 2;
  const angle = (ux: number, uy: number, vx: number, vy: number) => {
    const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy);
    return a;
  };
  const theta1 = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let delta = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!s.sweep && delta > 0) delta -= 2 * Math.PI;
  if (s.sweep && delta < 0) delta += 2 * Math.PI;
  const steps = Math.max(2, Math.ceil((Math.abs(delta) / (Math.PI / 2)) * perQuarter));
  const out: Pt[] = [];
  for (let k = 1; k <= steps; k++) {
    const t = theta1 + (delta * k) / steps;
    const ex = rx * Math.cos(t), ey = ry * Math.sin(t);
    out.push([cos * ex - sin * ey + cx, sin * ex + cos * ey + cy]);
  }
  out[out.length - 1] = [x, y];
  return out;
}

/** Each sub-path as a closed polygon (curves flattened, at most SHAPE_LIMITS.maxPoints points). */
export function flattenShape(parts: SubPath[]): Pt[][] {
  // Full detail when it fits the point budget; otherwise fewer steps per curve.
  let curves = 0, arcs = 0, lines = 0;
  for (const part of parts) for (const s of part) {
    if (s.c === "C" || s.c === "Q") curves++;
    else if (s.c === "A") arcs++;
    else if (s.c !== "Z") lines++;
  }
  const full = lines + curves * 16 + arcs * 48;
  const k = full > SHAPE_LIMITS.maxPoints ? Math.max(0, SHAPE_LIMITS.maxPoints - lines) / Math.max(1, full - lines) : 1;
  const cSteps = Math.max(2, Math.floor(16 * k));
  const qSteps = Math.max(2, Math.floor(12 * k));
  const arcQuarter = Math.max(0.5, 12 * k);
  const polys: Pt[][] = [];
  for (const part of parts) {
    const poly: Pt[] = [];
    let cx = 0, cy = 0;
    for (const s of part) {
      switch (s.c) {
        case "M":
        case "L":
          poly.push([s.x, s.y]);
          break;
        case "C":
          for (let k = 1; k <= cSteps; k++) {
            const t = k / cSteps, u = 1 - t;
            poly.push([
              u * u * u * cx + 3 * u * u * t * s.x1 + 3 * u * t * t * s.x2 + t * t * t * s.x,
              u * u * u * cy + 3 * u * u * t * s.y1 + 3 * u * t * t * s.y2 + t * t * t * s.y,
            ]);
          }
          break;
        case "Q":
          for (let k = 1; k <= qSteps; k++) {
            const t = k / qSteps, u = 1 - t;
            poly.push([u * u * cx + 2 * u * t * s.x1 + t * t * s.x, u * u * cy + 2 * u * t * s.y1 + t * t * s.y]);
          }
          break;
        case "A":
          poly.push(...arcPoints(cx, cy, s, arcQuarter));
          break;
        case "Z":
          break;
      }
      if (s.c !== "Z") {
        cx = s.x;
        cy = s.y;
      } else if (poly.length) {
        [cx, cy] = poly[0];
      }
    }
    if (poly.length) polys.push(poly);
  }
  return polys;
}

function bounds(polys: Pt[][]) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const poly of polys) {
    for (const [x, y] of poly) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
}

const GRID = 48;

/**
 * Fill along one horizontal line: which of the sample xs (ascending) are
 * filled at height py, under the fill rule (the winding number of a ray to
 * the right). Each edge is read once per line, not once per point.
 */
function fillAlongRow(polys: Pt[][], py: number, xs: number[], fillRule: FillRule): boolean[] {
  const crossings: Array<[number, number]> = [];
  for (const poly of polys) {
    for (let i = 0, n = poly.length; i < n; i++) {
      const [x0, y0] = poly[i];
      const [x1, y1] = poly[(i + 1) % n];
      let dir = 0;
      if (y0 <= py) {
        if (y1 > py) dir = 1;
      } else if (y1 <= py) dir = -1;
      if (dir) crossings.push([x0 + ((py - y0) * (x1 - x0)) / (y1 - y0), dir]);
    }
  }
  crossings.sort((a, b) => a[0] - b[0]);
  // Totals of the crossings right of each sample, walking right to left.
  const out = new Array<boolean>(xs.length);
  let winding = 0, count = 0, j = crossings.length - 1;
  for (let i = xs.length - 1; i >= 0; i--) {
    while (j >= 0 && crossings[j][0] > xs[i]) {
      winding += crossings[j][1];
      count++;
      j--;
    }
    out[i] = fillRule === "evenodd" ? count % 2 === 1 : winding !== 0;
  }
  return out;
}

/** Which grid cells of the bounds are wholly filled (corners and centre). */
function filledCells(polys: Pt[][], fillRule: FillRule): boolean[][] {
  const b = bounds(polys);
  const edge = (f: number) => Math.min(f, 0.99999) || 0.00001;
  const latticeXs = Array.from({ length: GRID + 1 }, (_, c) => b.x + edge(c / GRID) * b.w);
  const centreXs = Array.from({ length: GRID }, (_, c) => b.x + ((c + 0.5) / GRID) * b.w);
  // Sample on a (GRID+1)^2 lattice once, then cells read their four corners.
  const lattice: boolean[][] = [];
  for (let r = 0; r <= GRID; r++) lattice[r] = fillAlongRow(polys, b.y + edge(r / GRID) * b.h, latticeXs, fillRule);
  const cells: boolean[][] = [];
  for (let r = 0; r < GRID; r++) {
    const centre = fillAlongRow(polys, b.y + ((r + 0.5) / GRID) * b.h, centreXs, fillRule);
    cells[r] = [];
    for (let c = 0; c < GRID; c++) {
      cells[r][c] = lattice[r][c] && lattice[r][c + 1] && lattice[r + 1][c] && lattice[r + 1][c + 1] && centre[c];
    }
  }
  return cells;
}

function fillFraction(polys: Pt[][], fillRule: FillRule): number {
  const b = bounds(polys);
  const xs = Array.from({ length: GRID }, (_, c) => b.x + ((c + 0.5) / GRID) * b.w);
  let hit = 0;
  for (let r = 0; r < GRID; r++) {
    for (const filled of fillAlongRow(polys, b.y + ((r + 0.5) / GRID) * b.h, xs, fillRule)) if (filled) hit++;
  }
  return hit / (GRID * GRID);
}

const isFillRule = (v: unknown): v is FillRule => v === "nonzero" || v === "evenodd";

/** Closes any sub-path whose end is within the tolerance of its start; reports far-open ones. */
function closeParts(parts: SubPath[], size: number): boolean {
  for (const part of parts) {
    const last = part[part.length - 1];
    if (last.c === "Z") continue;
    const start = part[0] as { x: number; y: number };
    const end = last as { x: number; y: number };
    if (Math.hypot(end.x - start.x, end.y - start.y) > SHAPE_LIMITS.closeTolerance * size) return false;
    part.push({ c: "Z" });
  }
  return true;
}

/** Check a path. Never throws. */
export function validateShapePath(d: unknown, options: { fillRule?: unknown } = {}): ShapeCheck {
  if (options.fillRule !== undefined && !isFillRule(options.fillRule)) return fail("bad_fill_rule");
  const fillRule: FillRule = isFillRule(options.fillRule) ? options.fillRule : "nonzero";
  let parts: SubPath[];
  try {
    parts = parseShapePath(d as string);
  } catch (error) {
    return fail(error instanceof ShapePathError ? error.code : "bad_syntax");
  }
  const polys = flattenShape(parts);
  const b = bounds(polys);
  if (!(b.w > 0) || !(b.h > 0) || Math.min(b.w, b.h) < SHAPE_LIMITS.minSideRatio * Math.max(b.w, b.h)) return fail("degenerate");
  if (!closeParts(parts, Math.max(b.w, b.h))) return fail("not_closed");
  if (fillFraction(polys, fillRule) < SHAPE_LIMITS.minFill) return fail("too_thin");
  return { ok: true };
}

const round = (v: number) => {
  const r = Math.round(v * 10) / 10;
  return Object.is(r, -0) ? 0 : r;
};
const fmt = (v: number) => String(round(v));

function serialize(parts: SubPath[], map: (x: number, y: number) => Pt, scale: number): string {
  let out = "";
  const pair = (x: number, y: number) => {
    const [a, b] = map(x, y);
    return `${fmt(a)} ${fmt(b)}`;
  };
  for (const part of parts) {
    for (const s of part) {
      switch (s.c) {
        case "M":
        case "L":
          out += `${s.c}${pair(s.x, s.y)}`;
          break;
        case "C":
          out += `C${pair(s.x1, s.y1)} ${pair(s.x2, s.y2)} ${pair(s.x, s.y)}`;
          break;
        case "Q":
          out += `Q${pair(s.x1, s.y1)} ${pair(s.x, s.y)}`;
          break;
        case "A":
          out += `A${fmt(s.rx * scale)} ${fmt(s.ry * scale)} ${fmt(s.rot)} ${s.large} ${s.sweep} ${pair(s.x, s.y)}`;
          break;
        case "Z":
          out += "Z";
          break;
      }
    }
  }
  return out;
}

/**
 * Absolute commands, arcs kept, bounds moved to 0,0, the longer side scaled to
 * 100 (aspect kept and returned), one decimal. Closes nearly closed parts.
 * Throws ShapePathError on a path validateShapePath refuses for its syntax.
 */
export function normalizeShapePath(d: string): { d: string; aspect: number } {
  const parts = parseShapePath(d);
  const polys = flattenShape(parts);
  const b = bounds(polys);
  if (!(b.w > 0) || !(b.h > 0)) throw new ShapePathError("degenerate");
  if (!closeParts(parts, Math.max(b.w, b.h))) throw new ShapePathError("not_closed");
  const longer = Math.max(b.w, b.h);
  // Already normalised (within rounding)? Re-serialise unchanged so the result is stable.
  const settled = Math.abs(b.x) <= 0.15 && Math.abs(b.y) <= 0.15 && Math.abs(longer - 100) <= 0.3;
  const scale = settled ? 1 : 100 / longer;
  const map = settled ? (x: number, y: number): Pt => [x, y] : (x: number, y: number): Pt => [(x - b.x) * scale, (y - b.y) * scale];
  const out = serialize(parts, map, scale);
  if (out.length > SHAPE_LIMITS.maxNormalized) throw new ShapePathError("too_long");
  // Rounding can close a nearly full arc onto its own start (M50,0 A50,50 0 1 1 49.99,0 becomes
  // a zero-length arc that draws nothing): refuse what no longer has an area rather than store
  // an outline that would be invisible.
  const after = bounds(flattenShape(parseShapePath(out)));
  if (!(after.w > 0) || !(after.h > 0) || after.w * after.h < (b.w * scale) * (b.h * scale) * 0.25) throw new ShapePathError("degenerate");
  return { d: out, aspect: b.w / b.h };
}

/**
 * The largest calm rectangle inside the filled area (fill rule respected), in
 * 0..1 of the outline's bounds, each side capped so text never touches an
 * edge. Null when the best box is too small for a label.
 */
export function shapeTextBox(d: string, fillRule: FillRule | string = "nonzero"): ShapeTextBox | null {
  let polys: Pt[][];
  try {
    polys = flattenShape(parseShapePath(d));
  } catch {
    return null;
  }
  const rule: FillRule = fillRule === "evenodd" ? "evenodd" : "nonzero";
  const cells = filledCells(polys, rule);
  const heights = new Array(GRID).fill(0);
  let best: { score: number; x: number; y: number; w: number; h: number } | null = null;
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) heights[c] = cells[r][c] ? heights[c] + 1 : 0;
    for (let c = 0; c < GRID; c++) {
      let minH = Infinity;
      for (let c2 = c; c2 < GRID && heights[c2] > 0; c2++) {
        minH = Math.min(minH, heights[c2]);
        const w = (c2 - c + 1) / GRID, h = minH / GRID;
        const score = w * h * Math.min(1, w / h);
        if (!best || score > best.score) best = { score, x: c / GRID, y: (r - minH + 1) / GRID, w, h };
      }
    }
  }
  if (!best || best.w < SHAPE_LIMITS.minTextBox || best.h < SHAPE_LIMITS.minTextBox) return null;
  const cap = SHAPE_LIMITS.textBoxCap;
  let { x, y, w, h } = best;
  if (w > cap) { x += (w - cap) / 2; w = cap; }
  if (h > cap) { y += (h - cap) / 2; h = cap; }
  const r3 = (v: number) => Math.round(v * 1000) / 1000;
  return { x: r3(x), y: r3(y), w: r3(w), h: r3(h) };
}

/** Validate a name: 1-60 printable characters, no markup characters. */
export function cleanShapeName(name: unknown): string | null {
  if (typeof name !== "string") return null;
  const clean = name.replace(/[<>"'`\\\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim();
  return clean && clean.length <= SHAPE_LIMITS.maxName ? clean : null;
}

/**
 * Everything a note stores for a custom shape, from a candidate: validated,
 * normalised, with its aspect and text box. The one entry point for model
 * output, library saves and operation values.
 */
type Prepared = { ok: true; shape: CustomShape } | { ok: false; code: ShapeProblemCode; message: string };

/**
 * Recent results by input, so one operation that checks a shape, stores it on
 * many notes and sizes them prepares it once. Results are copied out.
 */
const recentlyPrepared = new Map<string, Prepared>();
const RECENT_LIMIT = 32;

export function prepareShape(input: { name?: unknown; d?: unknown; fillRule?: unknown; ref?: unknown }): Prepared {
  let key: string | null = null;
  try {
    key = JSON.stringify([input?.name ?? null, input?.d ?? null, input?.fillRule ?? null, input?.ref ?? null]);
  } catch {
    key = null;
  }
  if (key !== null && key.length <= SHAPE_LIMITS.maxInput * 2 + 400) {
    const hit = recentlyPrepared.get(key);
    if (hit) return copyPrepared(hit);
    const result = prepareShapeOnce(input);
    if (recentlyPrepared.size >= RECENT_LIMIT) recentlyPrepared.delete(recentlyPrepared.keys().next().value as string);
    recentlyPrepared.set(key, result);
    return copyPrepared(result);
  }
  return prepareShapeOnce(input);
}

function copyPrepared(result: Prepared): Prepared {
  if (!result.ok) return { ...result };
  const { shape } = result;
  return {
    ok: true,
    shape: { ...shape, textBox: shape.textBox ? { ...shape.textBox } : null, ...(shape.ref ? { ref: { ...shape.ref } } : {}) },
  };
}

function prepareShapeOnce(input: { name?: unknown; d?: unknown; fillRule?: unknown; ref?: unknown }): Prepared {
  const name = cleanShapeName(input?.name ?? "custom");
  if (!name) return { ok: false, code: "bad_name", message: MESSAGES.bad_name };
  const check = validateShapePath(input?.d, { fillRule: input?.fillRule });
  if (!check.ok) return check;
  const fillRule: FillRule = input.fillRule === "evenodd" ? "evenodd" : "nonzero";
  let normal: { d: string; aspect: number };
  try {
    normal = normalizeShapePath(input.d as string);
  } catch (error) {
    const code = error instanceof ShapePathError ? error.code : "bad_syntax";
    return { ok: false, code, message: MESSAGES[code] };
  }
  const ref =
    input.ref && typeof input.ref === "object" && typeof (input.ref as any).id === "string" && /^[A-Za-z0-9_-]{1,64}$/.test((input.ref as any).id)
      ? { id: (input.ref as any).id as string, ...(cleanShapeName((input.ref as any).name) ? { name: cleanShapeName((input.ref as any).name)! } : {}) }
      : undefined;
  return {
    ok: true,
    shape: {
      name,
      d: normal.d,
      fillRule,
      aspect: Math.round(normal.aspect * 1000) / 1000,
      textBox: shapeTextBox(normal.d, fillRule),
      ...(ref ? { ref } : {}),
    },
  };
}

/** Is this note option set a custom (path) shape rather than a named one? */
export function isCustomShapeOptions(options: Record<string, any> | undefined): boolean {
  // The same test as the canvas (Node.isCustomShape): older raw-path notes
  // (quick-add shapes, theme outlines, icons) carry none of these options.
  if (!options || options.shape !== "custom") return false;
  if (!/^[Mm]/.test(String(options.vectorPath || "").trim())) return false;
  return options.fillRule === "evenodd" || options.fillRule === "nonzero" || options.textBox !== undefined || !!options.shapeRef;
}

/** Store a prepared shape on note options (the shape of a note the canvas reads back). */
export function storeCustomShape(options: Record<string, any>, shape: CustomShape): void {
  options.shape = "custom";
  options.shapeHint = "custom";
  options.vectorPath = shape.d;
  options.fillRule = shape.fillRule;
  options.textBox = shape.textBox;
  options.shapeRef = { ...(shape.ref || {}), name: shape.name } as any;
  if (!shape.ref) delete options.shapeRef.id;
}
