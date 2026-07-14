/**
 * raphael-path.ts — focused TypeScript port of Raphael.js path/transform
 * helpers (parsePathString, pathToAbsolute, path2curve, transformPath).
 *
 * Ported from Raphael 2.3.0 (MIT License, Copyright (c) 2008-2013 Dmitry
 * Baranovskiy, Copyright (c) 2008-2013 Sencha Labs) to preserve the exact
 * output semantics of v1's `Slatebox.utils._transformPath(path, transform)`:
 * the input path is curve-ified (M + C commands only) and the transform
 * string uses Raphael grammar — `t/T dx,dy`, `s/S sx[,sy[,cx,cy]]`,
 * `r/R deg[,cx,cy]`, `m/M a,b,c,d,e,f` — with scale/rotate defaulting to the
 * path's bounding-box center.
 */

type PathSegment = [string, ...number[]];
export type PathArray = PathSegment[];

const SPACES = "\x09\x0a\x0b\x0c\x0d\x20\xa0 ᠎             　  ";
const PATH_COMMAND = new RegExp(
  `([a-z])[${SPACES},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${SPACES}]*,?[${SPACES}]*)+)`,
  "ig"
);
const PATH_VALUES = new RegExp(
  `(-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?)[${SPACES}]*,?[${SPACES}]*`,
  "ig"
);
const TRANSFORM_COMMAND = new RegExp(
  `([rstm])[${SPACES},]*((-?\\d*\\.?\\d*(?:e[\\-+]?\\d+)?[${SPACES}]*,?[${SPACES}]*)+)`,
  "ig"
);

/** Parse an SVG path string into Raphael's array-of-segments form. */
export function parsePathString(pathString: string | PathArray): PathArray {
  if (!pathString) return [];
  if (Array.isArray(pathString)) return pathString as PathArray;

  const paramCounts: Record<string, number> = {
    a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0,
  };
  const data: PathArray = [];

  String(pathString).replace(
    PATH_COMMAND,
    (_a: string, b: string, c: string) => {
      const params: number[] = [];
      let name = b.toLowerCase();
      c.replace(PATH_VALUES, (_all: string, param: string) => {
        if (param) params.push(+param);
        return "";
      });
      if (name === "m" && params.length > 2) {
        data.push([b, ...params.splice(0, 2)] as PathSegment);
        name = "l";
        b = b === "m" ? "l" : "L";
      }
      if (name === "r") {
        data.push([b, ...params] as PathSegment);
      } else {
        while (params.length >= paramCounts[name]) {
          data.push([b, ...params.splice(0, paramCounts[name])] as PathSegment);
          if (!paramCounts[name]) break;
        }
      }
      return "";
    }
  );
  return data;
}

/** Convert a path to absolute coordinates. */
export function pathToAbsolute(pathArray: string | PathArray): PathArray {
  const pathArr = parsePathString(pathArray as any);
  if (!pathArr.length) return [["M", 0, 0]];

  const res: PathArray = [];
  let x = 0, y = 0, mx = 0, my = 0, start = 0;

  if (pathArr[0][0] === "M") {
    x = +pathArr[0][1];
    y = +pathArr[0][2];
    mx = x;
    my = y;
    start++;
    res[0] = ["M", x, y];
  }

  for (let i = start; i < pathArr.length; i++) {
    const r: PathSegment = [""] as any;
    const pa = pathArr[i];
    res.push(r);
    if (pa[0] !== pa[0].toUpperCase()) {
      r[0] = pa[0].toUpperCase();
      switch (r[0]) {
        case "A":
          r[1] = pa[1] as number; r[2] = pa[2] as number; r[3] = pa[3] as number;
          r[4] = pa[4] as number; r[5] = pa[5] as number;
          r[6] = +(pa[6] as number) + x; r[7] = +(pa[7] as number) + y;
          break;
        case "V":
          r[1] = +pa[1] + y;
          break;
        case "H":
          r[1] = +pa[1] + x;
          break;
        case "M":
          mx = +pa[1] + x;
          my = +pa[2] + y;
          r[1] = mx; r[2] = my;
          break;
        default:
          for (let j = 1; j < pa.length; j++) {
            r[j] = +(pa[j] as number) + (j % 2 ? x : y);
          }
      }
    } else {
      for (let k = 0; k < pa.length; k++) r[k] = pa[k] as any;
    }
    switch (r[0]) {
      case "Z":
        x = mx; y = my;
        break;
      case "H":
        x = r[1] as number;
        break;
      case "V":
        y = r[1] as number;
        break;
      case "M":
        mx = r[r.length - 2] as number;
        my = r[r.length - 1] as number;
        x = r[r.length - 2] as number;
        y = r[r.length - 1] as number;
        break;
      default:
        x = r[r.length - 2] as number;
        y = r[r.length - 1] as number;
    }
  }
  return res;
}

// ─── curve conversion helpers ────────────────────────────────────────

function l2c(x1: number, y1: number, x2: number, y2: number): number[] {
  return [x1, y1, x2, y2, x2, y2];
}

function q2c(x1: number, y1: number, ax: number, ay: number, x2: number, y2: number): number[] {
  const _13 = 1 / 3, _23 = 2 / 3;
  return [
    _13 * x1 + _23 * ax, _13 * y1 + _23 * ay,
    _13 * x2 + _23 * ax, _13 * y2 + _23 * ay,
    x2, y2,
  ];
}

function rotate(x: number, y: number, rad: number): { x: number; y: number } {
  return { x: x * Math.cos(rad) - y * Math.sin(rad), y: x * Math.sin(rad) + y * Math.cos(rad) };
}

function a2c(
  x1: number, y1: number, rx: number, ry: number, angle: number,
  largeArcFlag: number, sweepFlag: number, x2: number, y2: number,
  recursive?: number[]
): number[] {
  const _120 = (Math.PI * 120) / 180;
  const rad = (Math.PI / 180) * (+angle || 0);
  let res: number[] = [];
  let xy: { x: number; y: number };
  let f1 = 0, f2 = 0, cx = 0, cy = 0;

  if (!recursive) {
    xy = rotate(x1, y1, -rad);
    x1 = xy.x; y1 = xy.y;
    xy = rotate(x2, y2, -rad);
    x2 = xy.x; y2 = xy.y;
    const x = (x1 - x2) / 2;
    const y = (y1 - y2) / 2;
    let h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    const rx2 = rx * rx, ry2 = ry * ry;
    const k =
      (largeArcFlag === sweepFlag ? -1 : 1) *
      Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x)));
    cx = (k * rx * y) / ry + (x1 + x2) / 2;
    cy = (k * -ry * x) / rx + (y1 + y2) / 2;
    f1 = Math.asin(Number(((y1 - cy) / ry).toFixed(9)));
    f2 = Math.asin(Number(((y2 - cy) / ry).toFixed(9)));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    if (f1 < 0) f1 = Math.PI * 2 + f1;
    if (f2 < 0) f2 = Math.PI * 2 + f2;
    if (sweepFlag && f1 > f2) f1 -= Math.PI * 2;
    if (!sweepFlag && f2 > f1) f2 -= Math.PI * 2;
  } else {
    f1 = recursive[0]; f2 = recursive[1]; cx = recursive[2]; cy = recursive[3];
  }

  let df = f2 - f1;
  if (Math.abs(df) > _120) {
    const f2old = f2, x2old = x2, y2old = y2;
    f2 = f1 + _120 * (sweepFlag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweepFlag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;

  const c1 = Math.cos(f1), s1 = Math.sin(f1);
  const c2 = Math.cos(f2), s2 = Math.sin(f2);
  const t = Math.tan(df / 4);
  const hx = (4 / 3) * rx * t;
  const hy = (4 / 3) * ry * t;
  const m1 = [x1, y1];
  const m2 = [x1 + hx * s1, y1 - hy * c1];
  const m3 = [x2 + hx * s2, y2 - hy * c2];
  const m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];

  if (recursive) {
    return [m2[0], m2[1], m3[0], m3[1], m4[0], m4[1]].concat(res);
  }
  res = [m2[0], m2[1], m3[0], m3[1], m4[0], m4[1]].concat(res);
  const newres: number[] = [];
  for (let i = 0; i < res.length; i++) {
    newres[i] =
      i % 2
        ? rotate(res[i - 1], res[i], rad).y
        : rotate(res[i], res[i + 1], rad).x;
  }
  return newres;
}

/** Convert any path to absolute cubic-curve form (M + C segments only). */
export function path2curve(path: string | PathArray): PathArray {
  const p = pathToAbsolute(path);
  const attrs = { x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null as number | null, qy: null as number | null };

  const processPath = (seg: PathSegment, d: typeof attrs, pcom: string): PathSegment => {
    let nx: number, ny: number;
    if (!seg) return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
    if (seg[0] !== "T" && seg[0] !== "Q") {
      d.qx = null;
      d.qy = null;
    }
    switch (seg[0]) {
      case "M":
        d.X = seg[1] as number;
        d.Y = seg[2] as number;
        break;
      case "A":
        return ["C", ...a2c(d.x, d.y, ...(seg.slice(1) as number[]) as [number, number, number, number, number, number, number])] as PathSegment;
      case "S": {
        let cx: number, cy: number;
        if (pcom === "C" || pcom === "S") {
          cx = d.x * 2 - d.bx;
          cy = d.y * 2 - d.by;
        } else {
          cx = d.x;
          cy = d.y;
        }
        return ["C", cx, cy, ...(seg.slice(1) as number[])] as PathSegment;
      }
      case "T":
        if (pcom === "Q" || pcom === "T") {
          d.qx = d.x * 2 - (d.qx as number);
          d.qy = d.y * 2 - (d.qy as number);
        } else {
          d.qx = d.x;
          d.qy = d.y;
        }
        return ["C", ...q2c(d.x, d.y, d.qx!, d.qy!, seg[1] as number, seg[2] as number)] as PathSegment;
      case "Q":
        d.qx = seg[1] as number;
        d.qy = seg[2] as number;
        return ["C", ...q2c(d.x, d.y, seg[1] as number, seg[2] as number, seg[3] as number, seg[4] as number)] as PathSegment;
      case "L":
        return ["C", ...l2c(d.x, d.y, seg[1] as number, seg[2] as number)] as PathSegment;
      case "H":
        return ["C", ...l2c(d.x, d.y, seg[1] as number, d.y)] as PathSegment;
      case "V":
        return ["C", ...l2c(d.x, d.y, d.x, seg[1] as number)] as PathSegment;
      case "Z":
        return ["C", ...l2c(d.x, d.y, d.X, d.Y)] as PathSegment;
    }
    return seg;
  };

  const fixArc = (pp: PathArray, i: number, pcoms: string[]) => {
    if (pp[i].length > 7) {
      pp[i].shift();
      const pi = pp[i] as unknown as number[];
      while (pi.length) {
        pcoms[i] = "A";
        pp.splice(i++, 0, ["C", ...pi.splice(0, 6)] as PathSegment);
      }
      pp.splice(i, 1);
    }
  };

  const pcoms: string[] = [];
  let pfirst = "";
  let pcom = "";

  for (let i = 0; i < p.length; i++) {
    pfirst = "";
    if (p[i]) pfirst = p[i][0];
    if (pfirst !== "C") {
      pcoms[i] = pfirst;
      if (i) pcom = pcoms[i - 1];
    }
    p[i] = processPath(p[i], attrs, pcom);
    if (pcoms[i] !== "A" && pfirst === "C") pcoms[i] = "C";
    fixArc(p, i, pcoms);

    const seg = p[i];
    const seglen = seg.length;
    attrs.x = seg[seglen - 2] as number;
    attrs.y = seg[seglen - 1] as number;
    attrs.bx = parseFloat(seg[seglen - 4] as any) || attrs.x;
    attrs.by = parseFloat(seg[seglen - 3] as any) || attrs.y;
  }
  return p;
}

// ─── bbox ────────────────────────────────────────────────────────────

function curveDim(
  p1x: number, p1y: number, c1x: number, c1y: number,
  c2x: number, c2y: number, p2x: number, p2y: number
) {
  const dot = (t: number, pA: number, cA: number, cB: number, pB: number) => {
    const mt = 1 - t;
    return mt * mt * mt * pA + 3 * mt * mt * t * cA + 3 * mt * t * t * cB + t * t * t * pB;
  };

  const xs = [p1x, p2x];
  const ys = [p1y, p2y];

  const roots = (A: number, B: number, C: number): number[] => {
    const out: number[] = [];
    if (Math.abs(A) < 1e-12) {
      if (Math.abs(B) > 1e-12) {
        const t = -C / B;
        if (t > 0 && t < 1) out.push(t);
      }
    } else {
      const disc = B * B - 4 * A * C;
      if (disc >= 0) {
        const sq = Math.sqrt(disc);
        const t1 = (-B + sq) / (2 * A);
        const t2 = (-B - sq) / (2 * A);
        if (t1 > 0 && t1 < 1) out.push(t1);
        if (t2 > 0 && t2 < 1) out.push(t2);
      }
    }
    return out;
  };

  // dx/dt = 3[ (c1-p1) + 2(c2-2c1+p1)... ] — use standard derivative coeffs
  const droots = (pA: number, cA: number, cB: number, pB: number): number[] => {
    const A = 3 * (pB - 3 * cB + 3 * cA - pA);
    const B = 6 * (cB - 2 * cA + pA);
    const C = 3 * (cA - pA);
    return roots(A, B, C);
  };

  droots(p1x, c1x, c2x, p2x).forEach((t) => xs.push(dot(t, p1x, c1x, c2x, p2x)));
  droots(p1y, c1y, c2y, p2y).forEach((t) => ys.push(dot(t, p1y, c1y, c2y, p2y)));

  return {
    min: { x: Math.min(...xs), y: Math.min(...ys) },
    max: { x: Math.max(...xs), y: Math.max(...ys) },
  };
}

export interface PathBBox {
  x: number;
  y: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  cx: number;
  cy: number;
}

/** Bounding box of a path (computed analytically from its curve form). */
export function pathBBox(path: string | PathArray): PathBBox {
  const p = path2curve(path);
  if (!p.length) {
    return { x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0 };
  }
  let x = 0, y = 0;
  const X: number[] = [];
  const Y: number[] = [];
  for (const seg of p) {
    if (seg[0] === "M") {
      x = seg[1] as number;
      y = seg[2] as number;
      X.push(x);
      Y.push(y);
    } else {
      const dim = curveDim(x, y, ...(seg.slice(1) as number[]) as [number, number, number, number, number, number]);
      X.push(dim.min.x, dim.max.x);
      Y.push(dim.min.y, dim.max.y);
      x = seg[5] as number;
      y = seg[6] as number;
    }
  }
  const xmin = Math.min(...X);
  const ymin = Math.min(...Y);
  const xmax = Math.max(...X);
  const ymax = Math.max(...Y);
  const width = xmax - xmin;
  const height = ymax - ymin;
  return {
    x: xmin, y: ymin, x2: xmax, y2: ymax,
    width, height,
    cx: xmin + width / 2, cy: ymin + height / 2,
  };
}

// ─── transform ───────────────────────────────────────────────────────

/** Minimal affine matrix matching Raphael's Matrix semantics. */
export class Matrix {
  a = 1; b = 0; c = 0; d = 1; e = 0; f = 0;

  constructor(a?: number, b?: number, c?: number, d?: number, e?: number, f?: number) {
    if (a != null) {
      this.a = +a; this.b = +b!; this.c = +c!;
      this.d = +d!; this.e = +e!; this.f = +f!;
    }
  }

  add(a: number, b: number, c: number, d: number, e: number, f: number): void {
    const m: number[][] = [
      [this.a, this.c, this.e],
      [this.b, this.d, this.f],
      [0, 0, 1],
    ];
    const matrix: number[][] = [
      [a, c, e],
      [b, d, f],
      [0, 0, 1],
    ];
    const out: number[][] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let x = 0; x < 3; x++) {
      for (let yy = 0; yy < 3; yy++) {
        let res = 0;
        for (let z = 0; z < 3; z++) {
          res += m[x][z] * matrix[z][yy];
        }
        out[x][yy] = res;
      }
    }
    this.a = out[0][0]; this.b = out[1][0]; this.c = out[0][1];
    this.d = out[1][1]; this.e = out[0][2]; this.f = out[1][2];
  }

  translate(x: number, y: number): void {
    this.add(1, 0, 0, 1, x, y);
  }

  scale(x: number, y?: number, cx?: number, cy?: number): void {
    if (y == null) y = x;
    if (cx || cy) this.add(1, 0, 0, 1, cx || 0, cy || 0);
    this.add(x, 0, 0, y, 0, 0);
    if (cx || cy) this.add(1, 0, 0, 1, -(cx || 0), -(cy || 0));
  }

  rotate(a: number, x?: number, y?: number): void {
    a = (a * Math.PI) / 180;
    x = x || 0;
    y = y || 0;
    const cos = +Math.cos(a).toFixed(9);
    const sin = +Math.sin(a).toFixed(9);
    this.add(cos, sin, -sin, cos, x, y);
    this.add(1, 0, 0, 1, -x, -y);
  }

  x(x: number, y: number): number {
    return x * this.a + y * this.c + this.e;
  }

  y(x: number, y: number): number {
    return x * this.b + y * this.d + this.f;
  }
}

/** Parse a Raphael transform string into command segments. */
export function parseTransformString(tstr: string | any[]): any[] {
  if (!tstr) return [];
  if (Array.isArray(tstr)) return tstr;
  const data: any[] = [];
  String(tstr).replace(TRANSFORM_COMMAND, (_all: string, b: string, c: string) => {
    const params: number[] = [];
    c.replace(PATH_VALUES, (_a: string, param: string) => {
      if (param) params.push(+param);
      return "";
    });
    data.push([b, ...params]);
    return "";
  });
  return data;
}

/**
 * Build the affine matrix for a transform string applied to a path (Raphael
 * `transform2matrix`): scale/rotate without explicit centers pivot on the
 * path's bounding-box center; uppercase T/S/R behave like their lowercase
 * forms here because a raw path carries no prior transform state.
 */
export function transform2matrix(tstr: string, bbox: PathBBox): Matrix {
  const tdata = parseTransformString(tstr);
  const m = new Matrix();
  for (const t of tdata) {
    const tlen = t.length;
    const command = String(t[0]).toLowerCase();
    const absolute = t[0] !== command; // uppercase
    const inver = absolute ? new Matrix() : null;

    if (command === "t" && tlen === 3) {
      if (absolute) {
        const x1 = inver!.x(0, 0);
        const y1 = inver!.y(0, 0);
        m.translate(t[1] - x1, t[2] - y1);
      } else {
        m.translate(t[1], t[2]);
      }
    } else if (command === "r") {
      if (tlen === 2) {
        m.rotate(t[1], bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      } else if (tlen === 4) {
        if (absolute) {
          const x2 = inver!.x(t[2], t[3]);
          const y2 = inver!.y(t[2], t[3]);
          m.rotate(t[1], x2, y2);
        } else {
          m.rotate(t[1], t[2], t[3]);
        }
      }
    } else if (command === "s") {
      if (tlen === 2 || tlen === 3) {
        m.scale(t[1], t[tlen - 1], bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      } else if (tlen === 4) {
        if (absolute) {
          const x2 = inver!.x(t[2], t[3]);
          const y2 = inver!.y(t[2], t[3]);
          m.scale(t[1], t[1], x2, y2);
        } else {
          m.scale(t[1], t[1], t[2], t[3]);
        }
      } else if (tlen === 5) {
        if (absolute) {
          const x2 = inver!.x(t[3], t[4]);
          const y2 = inver!.y(t[3], t[4]);
          m.scale(t[1], t[2], x2, y2);
        } else {
          m.scale(t[1], t[2], t[3], t[4]);
        }
      }
    } else if (command === "m" && tlen === 7) {
      m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
    }
  }
  return m;
}

/** Apply an affine matrix to every coordinate of a curve-ified path. */
export function mapPath(path: PathArray, matrix: Matrix): PathArray {
  if (!matrix || !path) return path;
  const res: PathArray = [];
  for (let i = 0; i < path.length; i++) {
    const seg = path[i];
    const out: PathSegment = [seg[0]] as any;
    for (let j = 1; j < seg.length; j += 2) {
      const x = matrix.x(seg[j] as number, seg[j + 1] as number);
      const y = matrix.y(seg[j] as number, seg[j + 1] as number);
      out[j] = x;
      out[j + 1] = y;
    }
    res.push(out);
  }
  return res;
}

/**
 * Raphael.transformPath equivalent: curve-ify `path`, apply the Raphael
 * transform string, return the transformed path as a string ("M…C…").
 */
export function transformPath(path: string, tstr: string): string {
  const curves = path2curve(path);
  const bbox = pathBBox(curves);
  const matrix = transform2matrix(tstr, bbox);
  return mapPath(curves, matrix)
    .map((seg) => seg[0] + (seg.slice(1) as number[]).join(","))
    .join("");
}
