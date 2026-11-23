const M = Object.freeze({
  /** Raw input characters. */
  maxInput: 8e3,
  /** Normalised output characters. */
  maxNormalized: 6e3,
  maxSegments: 300,
  maxParts: 24,
  maxMagnitude: 1e4,
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
  maxPoints: 2400
}), N = {
  empty: "The shape has no path.",
  bad_character: "The shape path may hold only path commands and plain numbers.",
  bad_syntax: "The shape path could not be read.",
  too_long: `The shape path is too long (at most ${M.maxInput} characters).`,
  too_many_segments: `The shape has too many segments (at most ${M.maxSegments}).`,
  too_many_parts: `The shape has too many parts (at most ${M.maxParts}).`,
  bad_number: `The shape path has a number out of range (at most ${M.maxMagnitude} either way).`,
  not_closed: "Every part of the shape must be closed.",
  degenerate: "The shape is too flat to hold a note.",
  too_thin: "The shape is too thin to hold a note.",
  bad_fill_rule: "The fill rule must be nonzero or evenodd.",
  bad_name: `The shape needs a name of 1 to ${M.maxName} characters.`
}, L = (t) => ({ ok: !1, code: t, message: N[t] });
class g extends Error {
  constructor(e) {
    super(N[e]), this.code = e;
  }
}
const D = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s+-]*$/, G = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };
function J(t) {
  const e = [], r = /([MmLlHhVvCcSsQqTtAaZz])|([+-]?(?:\d+\.?\d*|\.\d+))|([\s,]+)/y;
  let c = 0;
  for (; c < t.length; ) {
    r.lastIndex = c;
    const n = r.exec(t);
    if (!n || n[0].length === 0) throw new g("bad_syntax");
    n[1] ? e.push(n[1]) : n[2] && e.push(n[2]), c = r.lastIndex;
  }
  return e;
}
function q(t) {
  if (typeof t != "string" || !t.trim()) throw new g("empty");
  if (t.length > M.maxInput) throw new g("too_long");
  if (!D.test(t)) throw new g("bad_character");
  const e = J(t), r = [];
  let c = null, n = 0, o = 0, a = 0, x = 0, l = null, h = null, f = 0, y = "", k = 0;
  const m = (u) => typeof u == "string" && /^[A-Za-z]$/.test(u), s = () => {
    const u = e[f];
    if (u === void 0 || m(u)) throw new g("bad_syntax");
    f++;
    const _ = Number(u);
    if (!Number.isFinite(_)) throw new g("bad_syntax");
    if (Math.abs(_) > M.maxMagnitude) throw new g("bad_number");
    return _;
  }, b = () => {
    const u = e[f];
    if (typeof u != "string" || m(u)) throw new g("bad_syntax");
    const _ = u.replace(/^\+/, "")[0];
    if (_ !== "0" && _ !== "1") throw new g("bad_syntax");
    const $ = u.replace(/^\+/, "").slice(1);
    return $ ? e[f] = $ : f++, _ === "1" ? 1 : 0;
  }, i = (u) => {
    if (!c) throw new g("bad_syntax");
    if (c.push(u), ++k > M.maxSegments) throw new g("too_many_segments");
  };
  for (; f < e.length; ) {
    const u = e[f];
    if (m(u))
      y = u, f++;
    else if (!y)
      throw new g("bad_syntax");
    const _ = y === y.toLowerCase(), $ = y.toUpperCase(), v = G[$];
    if ($ === "Z") {
      i({ c: "Z" }), n = a, o = x, l = h = null, y = "";
      continue;
    }
    if (f >= e.length || m(e[f])) throw new g("bad_syntax");
    let Q = !0;
    for (; f < e.length && !m(e[f]); ) {
      const C = _ ? n : 0, A = _ ? o : 0;
      switch ($) {
        case "M": {
          const d = s() + C, p = s() + A;
          if (Q) {
            if (r.length >= M.maxParts) throw new g("too_many_parts");
            c = [], r.push(c), i({ c: "M", x: d, y: p }), a = d, x = p;
          } else
            i({ c: "L", x: d, y: p });
          n = d, o = p, l = h = null;
          break;
        }
        case "L": {
          const d = s() + C, p = s() + A;
          i({ c: "L", x: d, y: p }), n = d, o = p, l = h = null;
          break;
        }
        case "H": {
          const d = s() + C;
          i({ c: "L", x: d, y: o }), n = d, l = h = null;
          break;
        }
        case "V": {
          const d = s() + A;
          i({ c: "L", x: n, y: d }), o = d, l = h = null;
          break;
        }
        case "C": {
          const d = s() + C, p = s() + A, R = s() + C, S = s() + A, T = s() + C, I = s() + A;
          i({ c: "C", x1: d, y1: p, x2: R, y2: S, x: T, y: I }), l = { x: R, y: S }, h = null, n = T, o = I;
          break;
        }
        case "S": {
          const d = l ? 2 * n - l.x : n, p = l ? 2 * o - l.y : o, R = s() + C, S = s() + A, T = s() + C, I = s() + A;
          i({ c: "C", x1: d, y1: p, x2: R, y2: S, x: T, y: I }), l = { x: R, y: S }, h = null, n = T, o = I;
          break;
        }
        case "Q": {
          const d = s() + C, p = s() + A, R = s() + C, S = s() + A;
          i({ c: "Q", x1: d, y1: p, x: R, y: S }), h = { x: d, y: p }, l = null, n = R, o = S;
          break;
        }
        case "T": {
          const d = h ? 2 * n - h.x : n, p = h ? 2 * o - h.y : o, R = s() + C, S = s() + A;
          i({ c: "Q", x1: d, y1: p, x: R, y: S }), h = { x: d, y: p }, l = null, n = R, o = S;
          break;
        }
        case "A": {
          const d = Math.abs(s()), p = Math.abs(s()), R = s(), S = b(), T = b(), I = s() + C, P = s() + A;
          i({ c: "A", rx: d, ry: p, rot: R, large: S, sweep: T, x: I, y: P }), n = I, o = P, l = h = null;
          break;
        }
        default:
          throw new g("bad_syntax");
      }
      if (Q = !1, v === 0) break;
    }
  }
  if (!r.length) throw new g("bad_syntax");
  return r;
}
function U(t, e, r, c = 12) {
  let { rx: n, ry: o } = r;
  const { x: a, y: x } = r;
  if (n === 0 || o === 0 || t === a && e === x) return [[a, x]];
  const l = r.rot * Math.PI / 180, h = Math.cos(l), f = Math.sin(l), y = (t - a) / 2, k = (e - x) / 2, m = h * y + f * k, s = -f * y + h * k, b = m * m / (n * n) + s * s / (o * o);
  if (b > 1) {
    const T = Math.sqrt(b);
    n *= T, o *= T;
  }
  const i = n * n * o * o - n * n * s * s - o * o * m * m, u = n * n * s * s + o * o * m * m;
  let _ = Math.sqrt(Math.max(0, i / u));
  r.large === r.sweep && (_ = -_);
  const $ = _ * n * s / o, v = -_ * o * m / n, Q = h * $ - f * v + (t + a) / 2, C = f * $ + h * v + (e + x) / 2, A = (T, I, P, z) => Math.atan2(T * z - I * P, T * P + I * z), d = A(1, 0, (m - $) / n, (s - v) / o);
  let p = A((m - $) / n, (s - v) / o, (-m - $) / n, (-s - v) / o);
  !r.sweep && p > 0 && (p -= 2 * Math.PI), r.sweep && p < 0 && (p += 2 * Math.PI);
  const R = Math.max(2, Math.ceil(Math.abs(p) / (Math.PI / 2) * c)), S = [];
  for (let T = 1; T <= R; T++) {
    const I = d + p * T / R, P = n * Math.cos(I), z = o * Math.sin(I);
    S.push([h * P - f * z + Q, f * P + h * z + C]);
  }
  return S[S.length - 1] = [a, x], S;
}
function F(t) {
  let e = 0, r = 0, c = 0;
  for (const f of t) for (const y of f)
    y.c === "C" || y.c === "Q" ? e++ : y.c === "A" ? r++ : y.c !== "Z" && c++;
  const n = c + e * 16 + r * 48, o = n > M.maxPoints ? Math.max(0, M.maxPoints - c) / Math.max(1, n - c) : 1, a = Math.max(2, Math.floor(16 * o)), x = Math.max(2, Math.floor(12 * o)), l = Math.max(0.5, 12 * o), h = [];
  for (const f of t) {
    const y = [];
    let k = 0, m = 0;
    for (const s of f) {
      switch (s.c) {
        case "M":
        case "L":
          y.push([s.x, s.y]);
          break;
        case "C":
          for (let b = 1; b <= a; b++) {
            const i = b / a, u = 1 - i;
            y.push([
              u * u * u * k + 3 * u * u * i * s.x1 + 3 * u * i * i * s.x2 + i * i * i * s.x,
              u * u * u * m + 3 * u * u * i * s.y1 + 3 * u * i * i * s.y2 + i * i * i * s.y
            ]);
          }
          break;
        case "Q":
          for (let b = 1; b <= x; b++) {
            const i = b / x, u = 1 - i;
            y.push([u * u * k + 2 * u * i * s.x1 + i * i * s.x, u * u * m + 2 * u * i * s.y1 + i * i * s.y]);
          }
          break;
        case "A":
          y.push(...U(k, m, s, l));
          break;
      }
      s.c !== "Z" ? (k = s.x, m = s.y) : y.length && ([k, m] = y[0]);
    }
    y.length && h.push(y);
  }
  return h;
}
function E(t) {
  let e = 1 / 0, r = 1 / 0, c = -1 / 0, n = -1 / 0;
  for (const o of t)
    for (const [a, x] of o)
      a < e && (e = a), x < r && (r = x), a > c && (c = a), x > n && (n = x);
  return { x: e, y: r, w: c - e, h: n - r };
}
const w = 48;
function O(t, e, r, c) {
  const n = [];
  for (const h of t)
    for (let f = 0, y = h.length; f < y; f++) {
      const [k, m] = h[f], [s, b] = h[(f + 1) % y];
      let i = 0;
      m <= e ? b > e && (i = 1) : b <= e && (i = -1), i && n.push([k + (e - m) * (s - k) / (b - m), i]);
    }
  n.sort((h, f) => h[0] - f[0]);
  const o = new Array(r.length);
  let a = 0, x = 0, l = n.length - 1;
  for (let h = r.length - 1; h >= 0; h--) {
    for (; l >= 0 && n[l][0] > r[h]; )
      a += n[l][1], x++, l--;
    o[h] = c === "evenodd" ? x % 2 === 1 : a !== 0;
  }
  return o;
}
function W(t, e) {
  const r = E(t), c = (l) => Math.min(l, 0.99999) || 1e-5, n = Array.from({ length: w + 1 }, (l, h) => r.x + c(h / w) * r.w), o = Array.from({ length: w }, (l, h) => r.x + (h + 0.5) / w * r.w), a = [];
  for (let l = 0; l <= w; l++) a[l] = O(t, r.y + c(l / w) * r.h, n, e);
  const x = [];
  for (let l = 0; l < w; l++) {
    const h = O(t, r.y + (l + 0.5) / w * r.h, o, e);
    x[l] = [];
    for (let f = 0; f < w; f++)
      x[l][f] = a[l][f] && a[l][f + 1] && a[l + 1][f] && a[l + 1][f + 1] && h[f];
  }
  return x;
}
function K(t, e) {
  const r = E(t), c = Array.from({ length: w }, (o, a) => r.x + (a + 0.5) / w * r.w);
  let n = 0;
  for (let o = 0; o < w; o++)
    for (const a of O(t, r.y + (o + 0.5) / w * r.h, c, e)) a && n++;
  return n / (w * w);
}
const X = (t) => t === "nonzero" || t === "evenodd";
function Y(t, e) {
  for (const r of t) {
    const c = r[r.length - 1];
    if (c.c === "Z") continue;
    const n = r[0], o = c;
    if (Math.hypot(o.x - n.x, o.y - n.y) > M.closeTolerance * e) return !1;
    r.push({ c: "Z" });
  }
  return !0;
}
function tt(t, e = {}) {
  if (e.fillRule !== void 0 && !X(e.fillRule)) return L("bad_fill_rule");
  const r = X(e.fillRule) ? e.fillRule : "nonzero";
  let c;
  try {
    c = q(t);
  } catch (a) {
    return L(a instanceof g ? a.code : "bad_syntax");
  }
  const n = F(c), o = E(n);
  return !(o.w > 0) || !(o.h > 0) || Math.min(o.w, o.h) < M.minSideRatio * Math.max(o.w, o.h) ? L("degenerate") : Y(c, Math.max(o.w, o.h)) ? K(n, r) < M.minFill ? L("too_thin") : { ok: !0 } : L("not_closed");
}
const et = (t) => {
  const e = Math.round(t * 10) / 10;
  return Object.is(e, -0) ? 0 : e;
}, B = (t) => String(et(t));
function nt(t, e, r) {
  let c = "";
  const n = (o, a) => {
    const [x, l] = e(o, a);
    return `${B(x)} ${B(l)}`;
  };
  for (const o of t)
    for (const a of o)
      switch (a.c) {
        case "M":
        case "L":
          c += `${a.c}${n(a.x, a.y)}`;
          break;
        case "C":
          c += `C${n(a.x1, a.y1)} ${n(a.x2, a.y2)} ${n(a.x, a.y)}`;
          break;
        case "Q":
          c += `Q${n(a.x1, a.y1)} ${n(a.x, a.y)}`;
          break;
        case "A":
          c += `A${B(a.rx * r)} ${B(a.ry * r)} ${B(a.rot)} ${a.large} ${a.sweep} ${n(a.x, a.y)}`;
          break;
        case "Z":
          c += "Z";
          break;
      }
  return c;
}
function ot(t) {
  const e = q(t), r = F(e), c = E(r);
  if (!(c.w > 0) || !(c.h > 0)) throw new g("degenerate");
  if (!Y(e, Math.max(c.w, c.h))) throw new g("not_closed");
  const n = Math.max(c.w, c.h), o = Math.abs(c.x) <= 0.15 && Math.abs(c.y) <= 0.15 && Math.abs(n - 100) <= 0.3, a = o ? 1 : 100 / n, l = nt(e, o ? (h, f) => [h, f] : (h, f) => [(h - c.x) * a, (f - c.y) * a], a);
  if (l.length > M.maxNormalized) throw new g("too_long");
  return { d: l, aspect: c.w / c.h };
}
function at(t, e = "nonzero") {
  let r;
  try {
    r = F(q(t));
  } catch {
    return null;
  }
  const n = W(r, e === "evenodd" ? "evenodd" : "nonzero"), o = new Array(w).fill(0);
  let a = null;
  for (let m = 0; m < w; m++) {
    for (let s = 0; s < w; s++) o[s] = n[m][s] ? o[s] + 1 : 0;
    for (let s = 0; s < w; s++) {
      let b = 1 / 0;
      for (let i = s; i < w && o[i] > 0; i++) {
        b = Math.min(b, o[i]);
        const u = (i - s + 1) / w, _ = b / w, $ = u * _ * Math.min(1, u / _);
        (!a || $ > a.score) && (a = { score: $, x: s / w, y: (m - b + 1) / w, w: u, h: _ });
      }
    }
  }
  if (!a || a.w < M.minTextBox || a.h < M.minTextBox) return null;
  const x = M.textBoxCap;
  let { x: l, y: h, w: f, h: y } = a;
  f > x && (l += (f - x) / 2, f = x), y > x && (h += (y - x) / 2, y = x);
  const k = (m) => Math.round(m * 1e3) / 1e3;
  return { x: k(l), y: k(h), w: k(f), h: k(y) };
}
function H(t) {
  if (typeof t != "string") return null;
  const e = t.replace(/[<>"'`\\\u0000-\u001f]/g, "").replace(/\s+/g, " ").trim();
  return e && e.length <= M.maxName ? e : null;
}
const Z = /* @__PURE__ */ new Map(), st = 32;
function ct(t) {
  let e = null;
  try {
    e = JSON.stringify([t?.name ?? null, t?.d ?? null, t?.fillRule ?? null, t?.ref ?? null]);
  } catch {
    e = null;
  }
  if (e !== null && e.length <= M.maxInput * 2 + 400) {
    const r = Z.get(e);
    if (r) return j(r);
    const c = V(t);
    return Z.size >= st && Z.delete(Z.keys().next().value), Z.set(e, c), j(c);
  }
  return V(t);
}
function j(t) {
  if (!t.ok) return { ...t };
  const { shape: e } = t;
  return {
    ok: !0,
    shape: { ...e, textBox: e.textBox ? { ...e.textBox } : null, ...e.ref ? { ref: { ...e.ref } } : {} }
  };
}
function V(t) {
  const e = H(t?.name ?? "custom");
  if (!e) return { ok: !1, code: "bad_name", message: N.bad_name };
  const r = tt(t?.d, { fillRule: t?.fillRule });
  if (!r.ok) return r;
  const c = t.fillRule === "evenodd" ? "evenodd" : "nonzero";
  let n;
  try {
    n = ot(t.d);
  } catch (a) {
    const x = a instanceof g ? a.code : "bad_syntax";
    return { ok: !1, code: x, message: N[x] };
  }
  const o = t.ref && typeof t.ref == "object" && typeof t.ref.id == "string" && /^[A-Za-z0-9_-]{1,64}$/.test(t.ref.id) ? { id: t.ref.id, ...H(t.ref.name) ? { name: H(t.ref.name) } : {} } : void 0;
  return {
    ok: !0,
    shape: {
      name: e,
      d: n.d,
      fillRule: c,
      aspect: Math.round(n.aspect * 1e3) / 1e3,
      textBox: at(n.d, c),
      ...o ? { ref: o } : {}
    }
  };
}
function lt(t) {
  return !t || t.shape !== "custom" || !/^[Mm]/.test(String(t.vectorPath || "").trim()) ? !1 : t.fillRule === "evenodd" || t.fillRule === "nonzero" || t.textBox !== void 0 || !!t.shapeRef;
}
function ht(t, e) {
  t.shape = "custom", t.shapeHint = "custom", t.vectorPath = e.d, t.fillRule = e.fillRule, t.textBox = e.textBox, t.shapeRef = { ...e.ref || {}, name: e.name }, e.ref || delete t.shapeRef.id;
}
export {
  M as SHAPE_LIMITS,
  g as ShapePathError,
  H as cleanShapeName,
  F as flattenShape,
  lt as isCustomShapeOptions,
  ot as normalizeShapePath,
  q as parseShapePath,
  ct as prepareShape,
  at as shapeTextBox,
  ht as storeCustomShape,
  tt as validateShapePath
};
