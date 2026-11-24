import { partNotes as de, headlessDrag as le, inside as U, tint as E, w as ce, partsGeometry as ae, registerBoardKit as fe } from "./boards.mjs";
import { createBoardLayer as ue, applyWorkshopEdits as H, layerInk as he } from "./workshop-model.mjs";
import { nestKids as D, nestAreas as q, nestSubtree as J, nestPlace as V, checkNest as pe, nestLegal as me, nestEmptyDrop as we, nestRules as xe, nestRoots as ee, nestCardText as ye } from "./workshop-nest.mjs";
import { nestScores as K, nestAxes as ne, nestQuadrants as ge, quadrantOf as ke } from "./workshop-nest-plus.mjs";
const Ie = {
  pile: "#fbdfac",
  theme: "#efd7dc",
  outcome: "#d5e9e3",
  opportunity: "#dedef4",
  problem: "#efd7dc",
  cause: "#fbdfac",
  action: "#dcebf3",
  objective: "#d5e9e3",
  "key result": "#dedef4",
  initiative: "#dcebf3",
  manager: "#d5e9e3",
  "open role": "#f3eee0",
  designer: "#efd7dc"
}, ze = (e) => Ie[e.role ?? ""] ?? "#fffdf6", W = 64, j = 8, N = 220, $ = 84, Z = { "do-now": "#d5e9e3", plan: "#dedef4", later: "#f3eee0", skip: "#efd7dc" }, F = (e, t) => e.nest?.layout === "matrix" ? "matrix" : t.narrow ? "outline" : e.nest?.layout ?? "clusters", te = (e, t) => !t.narrow && !!e.nest?.owners?.length && e.nest?.layout === "tree";
function ie(e) {
  const t = !!e.narrow, l = t ? Math.max(260, Math.min(358, (e.width ?? 358) - 16)) : 560;
  return { narrow: t, size: l, left: t ? 8 : N + 16, top: t ? 56 : $ + 26, w: t ? 92 : 136, h: t ? 34 : 44 };
}
function Me(e, t, l, r = 0) {
  const i = e.left + t / 10 * e.size, o = e.top + (10 - l) / 10 * e.size;
  return { x: Math.min(e.left + e.size - e.w, Math.max(e.left, i - e.w / 2 + r)), y: Math.min(e.top + e.size - e.h, Math.max(e.top, o - e.h / 2 + r)) };
}
function _e(e, t) {
  const l = (r) => Math.max(0, Math.min(10, Math.round(r)));
  return { x: l((t.x + e.w / 2 - e.left) / e.size * 10), y: l(10 - (t.y + e.h / 2 - e.top) / e.size * 10) };
}
function G(e, t) {
  const l = [], r = (i, o) => {
    l.push({ card: i, depth: o });
    for (const c of D(e, i.id)) r(c, o + 1);
  };
  for (const i of ee(e, t)) r(i, 0);
  return l;
}
const b = (e, t) => ce(ye(e, t), t);
function L(e, t = {}) {
  const l = F(e, t), { main: r, tray: i } = q(e), o = [], c = (s, f, M, I, z) => {
    o.push({ name: "lane-" + s, x: f, y: M, width: I, height: 40, text: e.lanes.find((g) => g.id === s).label, fill: s === i ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), o.push({ name: "caption-" + s, x: f, y: M + 44, width: I, height: 26, text: z, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, x = (s) => xe.caption(e, s), w = (s, f, M, I, z = W) => o.push({ name: "card-" + s.id, x: f, y: M, width: I, height: z, text: b(e, s), fill: ze(s), fontSize: 14 });
  if (l === "matrix") {
    const s = ie(t), f = ne(e), M = (a) => (e.behaviour?.rules ?? []).find((y) => y.on && y.kind === "quadrant" && y.quadrant === a);
    for (const a of ge) {
      const y = s.left + (a.high[0] ? s.size / 2 : 0), O = s.top + (a.high[1] ? 0 : s.size / 2), S = e.cards.filter((C) => ke(e, C) === a.id).length, v = M(a.id);
      o.push({ name: "column-q-" + a.id, x: y, y: O, width: s.size / 2, height: s.size / 2, fill: E(Z[a.id], 0.35), line: E(Z[a.id], 0.1) }), o.push({
        name: "caption-q-" + a.id,
        x: y + 6,
        y: O + (a.high[1] ? 6 : s.size / 2 - 32),
        width: s.size / 2 - 12,
        height: 26,
        fill: "transparent",
        lineWidth: 0,
        fontSize: s.narrow ? 12 : 14,
        text: a.label + " · " + (v ? S + " / " + v.max : String(S)),
        ...v && S > v.max && { ink: "#c2410c" }
      });
    }
    o.push({ name: "caption-axis-y", x: s.left, y: s.top - 26, width: 200, height: 22, text: "↑ " + f.y.label, fill: "transparent", lineWidth: 0, fontSize: 13 }), o.push({ name: "caption-axis-x", x: s.left + s.size - 200, y: s.top + s.size + 4, width: 200, height: 22, text: f.x.label + " →", fill: "transparent", lineWidth: 0, fontSize: 13 });
    const I = /* @__PURE__ */ new Map();
    for (const a of e.cards) {
      const y = K(e, a);
      if (!y) continue;
      const O = y.x + ":" + y.y, S = (I.get(O) ?? 0) * 8;
      I.set(O, (I.get(O) ?? 0) + 1);
      const v = Me(s, y.x, y.y, S);
      o.push({ name: "card-" + a.id, x: v.x, y: v.y, width: s.w, height: s.h, text: b(e, a), fill: "#fffdf6", fontSize: s.narrow ? 11 : 13 });
    }
    const z = G(e, i);
    let g, A;
    if (s.narrow) {
      let a = s.top + s.size + 34;
      c(i, 8, a, s.size, x(i)), a += 76, z.forEach(({ card: y }) => {
        w(y, 8, a, s.size, 40), a += 46;
      }), g = s.size + 16, A = a + 10, o.unshift({ name: "column-" + i, x: 2, y: s.top + s.size + 30, width: g - 4, height: A - s.top - s.size - 30, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) });
    } else
      c(i, 8, 6, N - 16, x(i)), z.forEach(({ card: a }, y) => w(a, 8, $ + y * (W + j), N - 16)), g = s.left + s.size + 16, A = Math.max($ + Math.max(1, z.length + 1) * (W + j), s.top + s.size + 34), o.unshift({ name: "column-" + i, x: 2, y: 0, width: N - 4, height: A, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) });
    return c(r, s.left, s.narrow ? 0 : 6, s.narrow ? s.size : Math.min(s.size, 640), x(r)), o.splice(o.findIndex((a) => a.name === "caption-" + r), 1), o.unshift({ name: "column-" + r, x: s.left - 6, y: (s.narrow, 0), width: s.size + 12, height: s.top + s.size + 30, fill: E("#d5e9e3", 0.75), line: E("#d5e9e3", 0.1) }), { parts: o, width: g, height: A };
  }
  if (l === "outline") {
    const s = Math.max(300, t.width ?? 358);
    let f = 0;
    for (const M of [r, i]) {
      const I = f;
      c(M, 8, f + 6, s - 16, x(M)), f += 82;
      for (const { card: z, depth: g } of G(e, M))
        w(z, 8 + 20 * g, f, s - 16 - 20 * g, 44), f += 52;
      f += 44, o.unshift({ name: "column-" + M, x: 2, y: I, width: s - 4, height: f - I, fill: E(M === i ? "#e9e5da" : "#d5e9e3", 0.6), line: E("#d5e9e3", 0.1) }), f += 10;
    }
    return { parts: o, width: s, height: f };
  }
  const h = G(e, i);
  c(i, 8, 6, N - 16, x(i)), h.forEach(({ card: s }, f) => w(s, 8, $ + f * (W + j), N - 16));
  const _ = $ + Math.max(1, h.length + 1) * (W + j), p = N + 16;
  let m, k;
  if (l === "clusters") {
    const M = ee(e, r);
    let I = $, z = 0;
    M.forEach((g, A) => {
      A && A % 4 === 0 && (I += z + 16, z = 0);
      const a = p + A % 4 * 220;
      let y = I;
      const O = (S, v) => {
        w(S, a + 12 * v, y, 208 - 12 * v, v ? W : 56), y += (v ? W : 56) + 6;
        for (const C of D(e, S.id)) O(C, v + 1);
      };
      O(g, 0), z = Math.max(z, y - I);
    }), m = p + 4 * 220 + 8, k = Math.max(_, I + z + W + 40), c(r, p, 6, Math.min(m - p - 8, 640), x(r));
  } else {
    const f = W + 44, M = te(e, t) ? e.nest.owners : [], I = $ + (M.length ? 64 : 0);
    M.forEach((a, y) => {
      const O = e.cards.filter((S) => S.owner === a.id).length;
      o.push({ name: "caption-owner-" + a.id, x: p + y * 152, y: $ - 4, width: 140, height: 52, text: a.label + `
` + O, fill: "#f3eee0", fontSize: 14 });
    });
    let z = 0, g = 0;
    const A = (a, y) => {
      g = Math.max(g, y);
      const S = D(e, a.id).map((C) => A(C, y + 1)), v = S.length ? (S[0] + S[S.length - 1]) / 2 : z++;
      return w(a, p + v * 192, I + y * f, 176), v;
    };
    for (const a of D(e, null, r)) A(a, 0);
    m = p + Math.max(3, z, M.length * 152 / 192) * 192 + 8, k = Math.max(_, I + (g + 1) * f + 56), c(r, p, 6, Math.min(m - p - 8, 640), x(r));
  }
  return o.unshift(
    { name: "column-" + r, x: p - 6, y: 0, width: m - p + 4, height: k, fill: E("#d5e9e3", 0.75), line: E("#d5e9e3", 0.1) },
    { name: "column-" + i, x: 2, y: 0, width: N - 4, height: k, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) }
  ), { parts: o, width: m, height: k };
}
function Se(e, t) {
  if (F(e, t.layout) !== "tree") return [];
  const { parts: l } = L(e, t.layout), r = new Map(l.map((i) => [i.name, i]));
  return e.cards.flatMap((i) => {
    const o = i.parentId && r.get("card-" + i.parentId), c = r.get("card-" + i.id);
    if (!o || !c) return [];
    const x = o.x + o.width / 2, w = o.y + o.height, h = c.x + c.width / 2, _ = c.y, p = (w + _) / 2;
    return [{ t: "path", d: `M ${x} ${w} V ${p} H ${h} V ${_}`, color: he.week, width: 2 }];
  });
}
function P(e, t, l) {
  for (let r = e.length - 1; r >= 0; r--) {
    const i = e[r];
    if (i.name.startsWith("card-") && !l.has(i.name.slice(5)) && U(i, t)) return i.name.slice(5);
  }
  return null;
}
function Q(e, t, l) {
  const r = e.cards.find((i) => i.id === l);
  return r.laneId === q(e).tray ? null : t === "tree" || !r.parentId || e.cards.some((i) => i.parentId === l) ? l : r.parentId;
}
function Ae(e, t, l, r, i, o) {
  const c = e.cards.find((p) => p.id === l);
  if (Q(e, t, l) === l) return { laneId: c.laneId, under: l, before: null };
  const w = c.parentId ?? null, h = (w ? D(e, w) : D(e, null, c.laneId)).filter((p) => p.id !== o), _ = r.y > i.y + i.height / 2;
  return { laneId: c.laneId, under: w, before: _ ? h[h.findIndex((p) => p.id === l) + 1]?.id ?? null : l };
}
const ve = (e, t) => e === t || JSON.stringify(e.cards) === JSON.stringify(t.cards);
function Oe(e, t) {
  const l = [], r = new Set((e.nest?.aliases ?? []).map(([n]) => n));
  for (const [n, d] of t.nest?.aliases ?? [])
    !r.has(n) && e.cards.some((u) => u.id === n) && !t.cards.some((u) => u.id === n) && l.push({ kind: "merge_cards", card: { id: n }, into: { id: d } });
  let i = e;
  if (l.length) {
    const n = H(e, l);
    "refused" in n || (i = n.workshop);
  }
  const o = new Map(i.cards.map((n) => [n.id, n])), c = /* @__PURE__ */ new Set(), x = [], w = [], h = [], _ = [], p = [], m = [], k = [];
  for (const n of t.cards) {
    if (o.has(n.id) || n.parentId || n.role !== "pile") continue;
    const d = t.cards.filter((u) => u.parentId === n.id);
    d.length !== 1 || !o.has(d[0].id) || (x.push({ kind: "start_pile", card: { id: d[0].id }, ...n.label !== "New pile" && { label: n.label } }), c.add(n.id).add(d[0].id));
  }
  for (const n of i.cards) t.cards.some((d) => d.id === n.id) || w.push({ kind: "remove_card", card: { id: n.id } });
  for (const n of t.nest?.fields ?? [])
    (i.nest?.fields ?? []).some((d) => d.id === n.id) || h.push({ kind: "add_field", label: n.label, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } });
  for (const n of t.nest?.fields ?? []) {
    const d = (i.nest?.fields ?? []).find((u) => u.id === n.id);
    d && d.label !== n.label && h.push({ kind: "rename_field", field: n.id, label: n.label });
  }
  for (const n of t.nest?.owners ?? []) (i.nest?.owners ?? []).some((d) => d.id === n.id) || h.push({ kind: "add_owner", label: n.label });
  t.nest && i.nest?.layout !== t.nest.layout && h.push({ kind: "set_layout", layout: t.nest.layout });
  const s = ne(t), f = new Set(s ? t.cards.filter((n) => {
    const d = o.get(n.id), u = K(t, n);
    if (!u || c.has(n.id)) return !1;
    const R = d && K(i, d);
    return !R || R.x !== u.x || R.y !== u.y;
  }).map((n) => n.id) : []), M = [...f].map((n) => {
    const d = K(t, t.cards.find((u) => u.id === n));
    return { kind: "score_card", card: { id: n }, x: d.x, y: d.y };
  }), I = t.cards.filter((n) => !o.has(n.id) && !c.has(n.id)), z = /* @__PURE__ */ new Set();
  for (; z.size < I.length; ) {
    const n = I.filter((d) => !z.has(d.id) && (!d.parentId || !I.some((u) => u.id === d.parentId) || z.has(d.parentId)));
    if (!n.length) break;
    for (const d of n)
      z.add(d.id), _.push({
        kind: "add_card",
        lane: { id: d.laneId },
        label: d.label,
        ...d.parentId && { under: { id: d.parentId } },
        ...d.role && { role: d.role },
        ...d.source && { source: d.source }
      });
  }
  const g = (n) => {
    let d = 0;
    for (let u = t.cards.find((R) => R.id === n); u?.parentId && d < 12; u = t.cards.find((R) => R.id === u.parentId)) d++;
    return d;
  }, A = (n, d) => (d.parentId ? D(n, d.parentId) : D(n, null, d.laneId)).map((u) => u.id), a = t.cards.filter((n) => {
    const d = o.get(n.id);
    if (!d || c.has(n.id) || f.has(n.id)) return !1;
    if (d.parentId !== n.parentId || d.laneId !== n.laneId && !n.parentId) return !0;
    const u = A(t, n).filter((B) => o.has(B)), R = A(i, d).filter((B) => u.includes(B));
    return u[u.indexOf(n.id) - 1] !== R[R.indexOf(n.id) - 1];
  }), y = new Map(a.map((n) => [n.id, A(t, n).indexOf(n.id)]));
  a.sort((n, d) => g(n.id) - g(d.id) || (n.parentId ?? n.laneId).localeCompare(d.parentId ?? d.laneId) || y.get(d.id) - y.get(n.id));
  for (const n of a) {
    const d = A(t, n), u = d[d.indexOf(n.id) + 1];
    p.push({ kind: "nest_card", card: { id: n.id }, ...n.parentId ? { under: { id: n.parentId } } : { lane: { id: n.laneId } }, ...u && { before: { id: u } } });
  }
  for (const n of t.cards) {
    const d = o.get(n.id);
    !d || c.has(n.id) || (d.label !== n.label && k.push({ kind: "rename_card", card: { id: n.id }, label: n.label }), n.role && d.role !== n.role && m.push({ kind: "set_role", card: { id: n.id }, role: n.role }), n.source && d.source !== n.source && k.push({ kind: "set_source", card: { id: n.id }, source: n.source }));
  }
  for (const n of t.cards) {
    const d = o.get(n.id);
    for (const u of /* @__PURE__ */ new Set([...Object.keys(d?.fields ?? {}), ...Object.keys(n.fields ?? {})]))
      f.has(n.id) && (u === s.x.id || u === s.y.id) || d?.fields?.[u] !== n.fields?.[u] && k.push({ kind: "set_field", card: { id: n.id }, field: u, value: n.fields?.[u] ?? null });
  }
  const O = [], S = /* @__PURE__ */ new Map(), v = (n) => {
    if (S.has(n.id)) return S.get(n.id);
    const d = t.cards.find((R) => R.id === n.parentId), u = o.has(n.id) ? o.get(n.id).owner : d ? o.has(d.id) ? o.get(d.id).owner : v(d) : void 0;
    return S.set(n.id, u), u;
  };
  t.cards.forEach(v);
  for (const n of [...t.cards].sort((d, u) => g(d.id) - g(u.id))) {
    const d = S.get(n.id);
    if (!n.owner || n.owner === d) continue;
    const R = J(t, n.id).slice(1).filter((B) => S.get(B) === d && t.cards.find((oe) => oe.id === B).owner === n.owner);
    O.push({ kind: "set_owner", card: { id: n.id }, owner: n.owner, carry: R.map((B) => ({ id: B })) });
    for (const B of [n.id, ...R]) S.set(B, n.owner);
  }
  for (const n of t.lanes) {
    const d = i.lanes.find((u) => u.id === n.id);
    d && d.label !== n.label && k.push({ kind: "rename_lane", lane: { id: n.id }, label: n.label });
  }
  e.title !== t.title && k.push({ kind: "rename_workshop", title: t.title });
  const C = [...l, ...x, ...w, ...h, ..._], Y = [...M, ...k, ...O], T = [...C, ...p, ...m, ...Y];
  if (!p.length || !m.length) return T;
  const X = [...C, ...m, ...p, ...Y];
  return "refused" in H(e, T) && !("refused" in H(e, X)) ? X : T;
}
function se(e, t, l) {
  if (!te(e, l)) return null;
  const r = L(e, l).parts.find((i) => i.name.startsWith("caption-owner-") && U(i, t));
  return r ? r.name.slice(14) : null;
}
function Re(e, t, l) {
  const r = /* @__PURE__ */ new Map();
  return (i) => {
    const o = se(e, i, l);
    if (o) {
      if (!r.has(o)) {
        const c = H(e, [{ kind: "set_owner", card: { id: t }, owner: o }]);
        r.set(o, "refused" in c ? null : c.workshop);
      }
      return r.get(o);
    }
  };
}
function re(e, t, l, r, i) {
  const o = ie(i), { parts: c } = L(e, i), x = e.cards.find((k) => k.id === t);
  if (x.laneId !== q(e).tray && U(c.find((k) => k.name === "column-" + q(e).tray), r)) {
    const k = V(e, t, { laneId: q(e).tray, under: null, before: null });
    return k ? { board: k } : null;
  }
  const w = { x: r.x - l.x, y: r.y - l.y };
  if (!U({ x: o.left - o.w / 2, y: o.top - o.h / 2, width: o.size + o.w, height: o.size + o.h }, { x: w.x + o.w / 2, y: w.y + o.h / 2 })) return null;
  const { x: h, y: _ } = _e(o, w), p = K(e, x);
  if (p && p.x === h && p.y === _) return { board: e };
  const m = H(e, [{ kind: "score_card", card: { id: t }, x: h, y: _ }]);
  return "refused" in m ? { refused: m.refused.reason } : { board: m.workshop };
}
function Ee(e, t, l, r) {
  const i = /* @__PURE__ */ new Map();
  return (o) => {
    const c = Math.round(o.x) + ":" + Math.round(o.y);
    if (!i.has(c)) {
      const x = re(e, t, l, o, r);
      i.size > 400 && i.clear(), i.set(c, x && "board" in x ? x.board : e);
    }
    return i.get(c);
  };
}
const De = {
  laneCues: !0,
  places: (e, t) => L(e, t),
  notes: (e, t, l, r) => de(L(e, t).parts, e, l, r),
  editsBetween: Oe,
  layer: (e) => ue(e, Se),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(e, t) {
    const l = e.cards.find((i) => "card-" + i.id === t);
    if (!l) return null;
    const r = e.cards.find((i) => i.id === l.parentId);
    return l.label + (l.role ? ", " + l.role : "") + (r ? ", under " + r.label : ", in " + e.lanes.find((i) => i.id === l.laneId).label);
  },
  chooser(e, t, l, r = {}) {
    if (F(e, r) === "matrix") return Ee(e, t, l, r);
    const i = Re(e, t, r), o = me(e, t), c = o.map((f) => f.next), { main: x, tray: w } = q(e), h = e.cards.find((f) => f.id === t), _ = F(e, r), p = c.length > 1 ? le(e, "card-" + t, l, (f) => ae(L(f, r).parts), (f, M) => f.closest(c, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(M, { gapIn: 40, gapOut: 56 })) : null, { parts: m } = L(e, r), k = new Set(J(e, t));
    let s;
    return (f) => {
      const M = i(f);
      if (M !== void 0) return M ?? e;
      const I = _ === "outline" ? null : P(m, f, k);
      if (I) {
        const g = Ae(e, _, I, f, m.find((a) => a.name === "card-" + I), t), A = o.find((a) => a.spot.laneId === g.laneId && a.spot.under === g.under && a.spot.before === g.before);
        if (A) return A.next;
      }
      const z = p ? p(f) : e;
      return ve(z, e) ? h.laneId !== w && U(m.find((g) => g.name === "column-" + w), f) ? V(e, t, { laneId: w, under: null, before: null }) ?? e : U(m.find((g) => g.name === "column-" + x), f) && !P(m, f, /* @__PURE__ */ new Set()) ? (s === void 0 && (s = we(e, t)), s ?? e) : z : z;
    };
  },
  refusalAt(e, t, l, r, i) {
    const o = F(e, i);
    if (o === "matrix") {
      const s = re(e, t, l, r, i);
      return s && "refused" in s ? { laneId: q(e).main, reason: s.refused } : null;
    }
    const c = se(e, r, i);
    if (c) {
      const s = H(e, [{ kind: "set_owner", card: { id: t }, owner: c }]);
      return "refused" in s ? { laneId: q(e).main, reason: s.refused.reason } : null;
    }
    if (o === "outline") return null;
    const { parts: x } = L(e, i), w = P(x, r, new Set(J(e, t))), h = w && Q(e, o, w), _ = e.cards.find((s) => s.id === t);
    if (!h || h === _.parentId) return null;
    const p = V(e, t, { laneId: q(e).main, under: h, before: null }), m = p && e.behaviour ? pe(e, p) : null, k = e.cards.find((s) => s.id === h);
    return m && "refused" in m ? {
      laneId: q(e).main,
      reason: m.refused.sentence,
      override: { edit: { kind: "nest_card", card: { id: t }, under: { id: h } }, to: "under " + (k?.label || "that card") }
    } : null;
  },
  noteUnder(e, t, l) {
    if (F(e, l) === "matrix") return null;
    const r = P(L(e, l).parts, t, /* @__PURE__ */ new Set());
    return r ? Q(e, F(e, l), r) : null;
  },
  keyEdit(e, t, l) {
    const r = e.cards.find((h) => "card-" + h.id === t);
    if (!r) return null;
    const i = K(e, r);
    if (e.nest?.layout === "matrix") {
      const h = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }, [_, p] = h[l.key] ?? [0, 0];
      if (!i || !_ && !p) return null;
      const m = i.x + _, k = i.y + p;
      return m < 0 || m > 10 || k < 0 || k > 10 ? null : [{ kind: "score_card", card: { id: r.id }, x: m, y: k }];
    }
    const o = r.parentId ? D(e, r.parentId) : D(e, null, r.laneId), c = o.findIndex((h) => h.id === r.id), x = { id: r.id }, w = (h) => h ? { under: { id: h } } : { lane: { id: r.laneId } };
    switch (l.key) {
      case "ArrowRight":
        return c > 0 && r.laneId !== q(e).tray ? [{ kind: "nest_card", card: x, under: { id: o[c - 1].id } }] : null;
      case "ArrowLeft": {
        const h = e.cards.find((m) => m.id === r.parentId);
        if (!h) return null;
        const _ = h.parentId ? D(e, h.parentId) : D(e, null, h.laneId), p = _[_.findIndex((m) => m.id === h.id) + 1];
        return [{ kind: "nest_card", card: x, ...w(h.parentId), ...p && { before: { id: p.id } } }];
      }
      case "ArrowUp":
        return c > 0 ? [{ kind: "nest_card", card: x, ...w(r.parentId), before: { id: o[c - 1].id } }] : null;
      case "ArrowDown":
        return c >= 0 && c < o.length - 1 ? [{ kind: "nest_card", card: x, ...w(r.parentId), ...o[c + 2] && { before: { id: o[c + 2].id } } }] : null;
    }
    return null;
  },
  handleDrag: () => null
};
fe("nest", De);
export {
  Oe as nestEditsBetween,
  De as nestKit,
  L as nestLayout
};
