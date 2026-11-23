import { partNotes as de, headlessDrag as le, inside as U, tint as E, partsGeometry as ce, registerBoardKit as ae } from "./boards.mjs";
import { createBoardLayer as fe, applyWorkshopEdits as H, layerInk as ue } from "./workshop-model.mjs";
import { nestKids as D, nestAreas as q, nestSubtree as J, nestPlace as V, checkNest as he, nestLegal as pe, nestEmptyDrop as me, nestCardText as we, nestRules as xe, nestRoots as ee } from "./workshop-nest.mjs";
import { nestScores as K, nestAxes as ne, nestQuadrants as ye, quadrantOf as ge } from "./workshop-nest-plus.mjs";
const ke = {
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
}, Ie = (e) => ke[e.role ?? ""] ?? "#fffdf6", W = 64, j = 8, N = 220, $ = 84, Z = { "do-now": "#d5e9e3", plan: "#dedef4", later: "#f3eee0", skip: "#efd7dc" }, F = (e, t) => e.nest?.layout === "matrix" ? "matrix" : t.narrow ? "outline" : e.nest?.layout ?? "clusters", te = (e, t) => !t.narrow && !!e.nest?.owners?.length && e.nest?.layout === "tree";
function ie(e) {
  const t = !!e.narrow, l = t ? Math.max(260, Math.min(358, (e.width ?? 358) - 16)) : 560;
  return { narrow: t, size: l, left: t ? 8 : N + 16, top: t ? 56 : $ + 26, w: t ? 92 : 136, h: t ? 34 : 44 };
}
function ze(e, t, l, s = 0) {
  const i = e.left + t / 10 * e.size, r = e.top + (10 - l) / 10 * e.size;
  return { x: Math.min(e.left + e.size - e.w, Math.max(e.left, i - e.w / 2 + s)), y: Math.min(e.top + e.size - e.h, Math.max(e.top, r - e.h / 2 + s)) };
}
function Me(e, t) {
  const l = (s) => Math.max(0, Math.min(10, Math.round(s)));
  return { x: l((t.x + e.w / 2 - e.left) / e.size * 10), y: l(10 - (t.y + e.h / 2 - e.top) / e.size * 10) };
}
function G(e, t) {
  const l = [], s = (i, r) => {
    l.push({ card: i, depth: r });
    for (const c of D(e, i.id)) s(c, r + 1);
  };
  for (const i of ee(e, t)) s(i, 0);
  return l;
}
const b = we;
function L(e, t = {}) {
  const l = F(e, t), { main: s, tray: i } = q(e), r = [], c = (d, f, M, I, z) => {
    r.push({ name: "lane-" + d, x: f, y: M, width: I, height: 40, text: e.lanes.find((k) => k.id === d).label, fill: d === i ? "#e9e5da" : "#d5e9e3", fontSize: 16 }), r.push({ name: "caption-" + d, x: f, y: M + 44, width: I, height: 26, text: z, fill: "transparent", lineWidth: 0, fontSize: 14 });
  }, y = (d) => xe.caption(e, d), x = (d, f, M, I, z = W) => r.push({ name: "card-" + d.id, x: f, y: M, width: I, height: z, text: b(e, d), fill: Ie(d), fontSize: 14 });
  if (l === "matrix") {
    const d = ie(t), f = ne(e), M = (a) => (e.behaviour?.rules ?? []).find((g) => g.on && g.kind === "quadrant" && g.quadrant === a);
    for (const a of ye) {
      const g = d.left + (a.high[0] ? d.size / 2 : 0), O = d.top + (a.high[1] ? 0 : d.size / 2), S = e.cards.filter((C) => ge(e, C) === a.id).length, v = M(a.id);
      r.push({ name: "column-q-" + a.id, x: g, y: O, width: d.size / 2, height: d.size / 2, fill: E(Z[a.id], 0.35), line: E(Z[a.id], 0.1) }), r.push({
        name: "caption-q-" + a.id,
        x: g + 6,
        y: O + (a.high[1] ? 6 : d.size / 2 - 32),
        width: d.size / 2 - 12,
        height: 26,
        fill: "transparent",
        lineWidth: 0,
        fontSize: d.narrow ? 12 : 14,
        text: a.label + " · " + (v ? S + " / " + v.max : String(S)),
        ...v && S > v.max && { ink: "#c2410c" }
      });
    }
    r.push({ name: "caption-axis-y", x: d.left, y: d.top - 26, width: 200, height: 22, text: "↑ " + f.y.label, fill: "transparent", lineWidth: 0, fontSize: 13 }), r.push({ name: "caption-axis-x", x: d.left + d.size - 200, y: d.top + d.size + 4, width: 200, height: 22, text: f.x.label + " →", fill: "transparent", lineWidth: 0, fontSize: 13 });
    const I = /* @__PURE__ */ new Map();
    for (const a of e.cards) {
      const g = K(e, a);
      if (!g) continue;
      const O = g.x + ":" + g.y, S = (I.get(O) ?? 0) * 8;
      I.set(O, (I.get(O) ?? 0) + 1);
      const v = ze(d, g.x, g.y, S);
      r.push({ name: "card-" + a.id, x: v.x, y: v.y, width: d.w, height: d.h, text: b(e, a), fill: "#fffdf6", fontSize: d.narrow ? 11 : 13 });
    }
    const z = G(e, i);
    let k, A;
    if (d.narrow) {
      let a = d.top + d.size + 34;
      c(i, 8, a, d.size, y(i)), a += 76, z.forEach(({ card: g }) => {
        x(g, 8, a, d.size, 40), a += 46;
      }), k = d.size + 16, A = a + 10, r.unshift({ name: "column-" + i, x: 2, y: d.top + d.size + 30, width: k - 4, height: A - d.top - d.size - 30, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) });
    } else
      c(i, 8, 6, N - 16, y(i)), z.forEach(({ card: a }, g) => x(a, 8, $ + g * (W + j), N - 16)), k = d.left + d.size + 16, A = Math.max($ + Math.max(1, z.length + 1) * (W + j), d.top + d.size + 34), r.unshift({ name: "column-" + i, x: 2, y: 0, width: N - 4, height: A, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) });
    return c(s, d.left, d.narrow ? 0 : 6, d.narrow ? d.size : Math.min(d.size, 640), y(s)), r.splice(r.findIndex((a) => a.name === "caption-" + s), 1), r.unshift({ name: "column-" + s, x: d.left - 6, y: (d.narrow, 0), width: d.size + 12, height: d.top + d.size + 30, fill: E("#d5e9e3", 0.75), line: E("#d5e9e3", 0.1) }), { parts: r, width: k, height: A };
  }
  if (l === "outline") {
    const d = Math.max(300, t.width ?? 358);
    let f = 0;
    for (const M of [s, i]) {
      const I = f;
      c(M, 8, f + 6, d - 16, y(M)), f += 82;
      for (const { card: z, depth: k } of G(e, M))
        x(z, 8 + 20 * k, f, d - 16 - 20 * k, 44), f += 52;
      f += 44, r.unshift({ name: "column-" + M, x: 2, y: I, width: d - 4, height: f - I, fill: E(M === i ? "#e9e5da" : "#d5e9e3", 0.6), line: E("#d5e9e3", 0.1) }), f += 10;
    }
    return { parts: r, width: d, height: f };
  }
  const p = G(e, i);
  c(i, 8, 6, N - 16, y(i)), p.forEach(({ card: d }, f) => x(d, 8, $ + f * (W + j), N - 16));
  const _ = $ + Math.max(1, p.length + 1) * (W + j), h = N + 16;
  let w, m;
  if (l === "clusters") {
    const M = ee(e, s);
    let I = $, z = 0;
    M.forEach((k, A) => {
      A && A % 4 === 0 && (I += z + 16, z = 0);
      const a = h + A % 4 * 220;
      let g = I;
      const O = (S, v) => {
        x(S, a + 12 * v, g, 208 - 12 * v, v ? W : 56), g += (v ? W : 56) + 6;
        for (const C of D(e, S.id)) O(C, v + 1);
      };
      O(k, 0), z = Math.max(z, g - I);
    }), w = h + 4 * 220 + 8, m = Math.max(_, I + z + W + 40), c(s, h, 6, Math.min(w - h - 8, 640), y(s));
  } else {
    const f = W + 44, M = te(e, t) ? e.nest.owners : [], I = $ + (M.length ? 64 : 0);
    M.forEach((a, g) => {
      const O = e.cards.filter((S) => S.owner === a.id).length;
      r.push({ name: "caption-owner-" + a.id, x: h + g * 152, y: $ - 4, width: 140, height: 52, text: a.label + `
` + O, fill: "#f3eee0", fontSize: 14 });
    });
    let z = 0, k = 0;
    const A = (a, g) => {
      k = Math.max(k, g);
      const S = D(e, a.id).map((C) => A(C, g + 1)), v = S.length ? (S[0] + S[S.length - 1]) / 2 : z++;
      return x(a, h + v * 192, I + g * f, 176), v;
    };
    for (const a of D(e, null, s)) A(a, 0);
    w = h + Math.max(3, z, M.length * 152 / 192) * 192 + 8, m = Math.max(_, I + (k + 1) * f + 56), c(s, h, 6, Math.min(w - h - 8, 640), y(s));
  }
  return r.unshift(
    { name: "column-" + s, x: h - 6, y: 0, width: w - h + 4, height: m, fill: E("#d5e9e3", 0.75), line: E("#d5e9e3", 0.1) },
    { name: "column-" + i, x: 2, y: 0, width: N - 4, height: m, fill: E("#e9e5da", 0.5), line: E("#e9e5da", 0.1) }
  ), { parts: r, width: w, height: m };
}
function _e(e, t) {
  if (F(e, t.layout) !== "tree") return [];
  const { parts: l } = L(e, t.layout), s = new Map(l.map((i) => [i.name, i]));
  return e.cards.flatMap((i) => {
    const r = i.parentId && s.get("card-" + i.parentId), c = s.get("card-" + i.id);
    if (!r || !c) return [];
    const y = r.x + r.width / 2, x = r.y + r.height, p = c.x + c.width / 2, _ = c.y, h = (x + _) / 2;
    return [{ t: "path", d: `M ${y} ${x} V ${h} H ${p} V ${_}`, color: ue.week, width: 2 }];
  });
}
function P(e, t, l) {
  for (let s = e.length - 1; s >= 0; s--) {
    const i = e[s];
    if (i.name.startsWith("card-") && !l.has(i.name.slice(5)) && U(i, t)) return i.name.slice(5);
  }
  return null;
}
function Q(e, t, l) {
  const s = e.cards.find((i) => i.id === l);
  return s.laneId === q(e).tray ? null : t === "tree" || !s.parentId || e.cards.some((i) => i.parentId === l) ? l : s.parentId;
}
function Se(e, t, l, s, i, r) {
  const c = e.cards.find((h) => h.id === l);
  if (Q(e, t, l) === l) return { laneId: c.laneId, under: l, before: null };
  const x = c.parentId ?? null, p = (x ? D(e, x) : D(e, null, c.laneId)).filter((h) => h.id !== r), _ = s.y > i.y + i.height / 2;
  return { laneId: c.laneId, under: x, before: _ ? p[p.findIndex((h) => h.id === l) + 1]?.id ?? null : l };
}
const Ae = (e, t) => e === t || JSON.stringify(e.cards) === JSON.stringify(t.cards);
function ve(e, t) {
  const l = [], s = new Set((e.nest?.aliases ?? []).map(([n]) => n));
  for (const [n, o] of t.nest?.aliases ?? [])
    !s.has(n) && e.cards.some((u) => u.id === n) && !t.cards.some((u) => u.id === n) && l.push({ kind: "merge_cards", card: { id: n }, into: { id: o } });
  let i = e;
  if (l.length) {
    const n = H(e, l);
    "refused" in n || (i = n.workshop);
  }
  const r = new Map(i.cards.map((n) => [n.id, n])), c = /* @__PURE__ */ new Set(), y = [], x = [], p = [], _ = [], h = [], w = [], m = [];
  for (const n of t.cards) {
    if (r.has(n.id) || n.parentId || n.role !== "pile") continue;
    const o = t.cards.filter((u) => u.parentId === n.id);
    o.length !== 1 || !r.has(o[0].id) || (y.push({ kind: "start_pile", card: { id: o[0].id }, ...n.label !== "New pile" && { label: n.label } }), c.add(n.id).add(o[0].id));
  }
  for (const n of i.cards) t.cards.some((o) => o.id === n.id) || x.push({ kind: "remove_card", card: { id: n.id } });
  for (const n of t.nest?.fields ?? [])
    (i.nest?.fields ?? []).some((o) => o.id === n.id) || p.push({ kind: "add_field", label: n.label, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } });
  for (const n of t.nest?.fields ?? []) {
    const o = (i.nest?.fields ?? []).find((u) => u.id === n.id);
    o && o.label !== n.label && p.push({ kind: "rename_field", field: n.id, label: n.label });
  }
  for (const n of t.nest?.owners ?? []) (i.nest?.owners ?? []).some((o) => o.id === n.id) || p.push({ kind: "add_owner", label: n.label });
  t.nest && i.nest?.layout !== t.nest.layout && p.push({ kind: "set_layout", layout: t.nest.layout });
  const d = ne(t), f = new Set(d ? t.cards.filter((n) => {
    const o = r.get(n.id), u = K(t, n);
    if (!u || c.has(n.id)) return !1;
    const R = o && K(i, o);
    return !R || R.x !== u.x || R.y !== u.y;
  }).map((n) => n.id) : []), M = [...f].map((n) => {
    const o = K(t, t.cards.find((u) => u.id === n));
    return { kind: "score_card", card: { id: n }, x: o.x, y: o.y };
  }), I = t.cards.filter((n) => !r.has(n.id) && !c.has(n.id)), z = /* @__PURE__ */ new Set();
  for (; z.size < I.length; ) {
    const n = I.filter((o) => !z.has(o.id) && (!o.parentId || !I.some((u) => u.id === o.parentId) || z.has(o.parentId)));
    if (!n.length) break;
    for (const o of n)
      z.add(o.id), _.push({
        kind: "add_card",
        lane: { id: o.laneId },
        label: o.label,
        ...o.parentId && { under: { id: o.parentId } },
        ...o.role && { role: o.role },
        ...o.source && { source: o.source }
      });
  }
  const k = (n) => {
    let o = 0;
    for (let u = t.cards.find((R) => R.id === n); u?.parentId && o < 12; u = t.cards.find((R) => R.id === u.parentId)) o++;
    return o;
  }, A = (n, o) => (o.parentId ? D(n, o.parentId) : D(n, null, o.laneId)).map((u) => u.id), a = t.cards.filter((n) => {
    const o = r.get(n.id);
    if (!o || c.has(n.id) || f.has(n.id)) return !1;
    if (o.parentId !== n.parentId || o.laneId !== n.laneId && !n.parentId) return !0;
    const u = A(t, n).filter((B) => r.has(B)), R = A(i, o).filter((B) => u.includes(B));
    return u[u.indexOf(n.id) - 1] !== R[R.indexOf(n.id) - 1];
  }), g = new Map(a.map((n) => [n.id, A(t, n).indexOf(n.id)]));
  a.sort((n, o) => k(n.id) - k(o.id) || (n.parentId ?? n.laneId).localeCompare(o.parentId ?? o.laneId) || g.get(o.id) - g.get(n.id));
  for (const n of a) {
    const o = A(t, n), u = o[o.indexOf(n.id) + 1];
    h.push({ kind: "nest_card", card: { id: n.id }, ...n.parentId ? { under: { id: n.parentId } } : { lane: { id: n.laneId } }, ...u && { before: { id: u } } });
  }
  for (const n of t.cards) {
    const o = r.get(n.id);
    !o || c.has(n.id) || (o.label !== n.label && m.push({ kind: "rename_card", card: { id: n.id }, label: n.label }), n.role && o.role !== n.role && w.push({ kind: "set_role", card: { id: n.id }, role: n.role }), n.source && o.source !== n.source && m.push({ kind: "set_source", card: { id: n.id }, source: n.source }));
  }
  for (const n of t.cards) {
    const o = r.get(n.id);
    for (const u of /* @__PURE__ */ new Set([...Object.keys(o?.fields ?? {}), ...Object.keys(n.fields ?? {})]))
      f.has(n.id) && (u === d.x.id || u === d.y.id) || o?.fields?.[u] !== n.fields?.[u] && m.push({ kind: "set_field", card: { id: n.id }, field: u, value: n.fields?.[u] ?? null });
  }
  const O = [], S = /* @__PURE__ */ new Map(), v = (n) => {
    if (S.has(n.id)) return S.get(n.id);
    const o = t.cards.find((R) => R.id === n.parentId), u = r.has(n.id) ? r.get(n.id).owner : o ? r.has(o.id) ? r.get(o.id).owner : v(o) : void 0;
    return S.set(n.id, u), u;
  };
  t.cards.forEach(v);
  for (const n of [...t.cards].sort((o, u) => k(o.id) - k(u.id))) {
    const o = S.get(n.id);
    if (!n.owner || n.owner === o) continue;
    const R = J(t, n.id).slice(1).filter((B) => S.get(B) === o && t.cards.find((oe) => oe.id === B).owner === n.owner);
    O.push({ kind: "set_owner", card: { id: n.id }, owner: n.owner, carry: R.map((B) => ({ id: B })) });
    for (const B of [n.id, ...R]) S.set(B, n.owner);
  }
  for (const n of t.lanes) {
    const o = i.lanes.find((u) => u.id === n.id);
    o && o.label !== n.label && m.push({ kind: "rename_lane", lane: { id: n.id }, label: n.label });
  }
  e.title !== t.title && m.push({ kind: "rename_workshop", title: t.title });
  const C = [...l, ...y, ...x, ...p, ..._], Y = [...M, ...m, ...O], T = [...C, ...h, ...w, ...Y];
  if (!h.length || !w.length) return T;
  const X = [...C, ...w, ...h, ...Y];
  return "refused" in H(e, T) && !("refused" in H(e, X)) ? X : T;
}
function se(e, t, l) {
  if (!te(e, l)) return null;
  const s = L(e, l).parts.find((i) => i.name.startsWith("caption-owner-") && U(i, t));
  return s ? s.name.slice(14) : null;
}
function Oe(e, t, l) {
  const s = /* @__PURE__ */ new Map();
  return (i) => {
    const r = se(e, i, l);
    if (r) {
      if (!s.has(r)) {
        const c = H(e, [{ kind: "set_owner", card: { id: t }, owner: r }]);
        s.set(r, "refused" in c ? null : c.workshop);
      }
      return s.get(r);
    }
  };
}
function re(e, t, l, s, i) {
  const r = ie(i), { parts: c } = L(e, i), y = e.cards.find((m) => m.id === t);
  if (y.laneId !== q(e).tray && U(c.find((m) => m.name === "column-" + q(e).tray), s)) {
    const m = V(e, t, { laneId: q(e).tray, under: null, before: null });
    return m ? { board: m } : null;
  }
  const x = { x: s.x - l.x, y: s.y - l.y };
  if (!U({ x: r.left - r.w / 2, y: r.top - r.h / 2, width: r.size + r.w, height: r.size + r.h }, { x: x.x + r.w / 2, y: x.y + r.h / 2 })) return null;
  const { x: p, y: _ } = Me(r, x), h = K(e, y);
  if (h && h.x === p && h.y === _) return { board: e };
  const w = H(e, [{ kind: "score_card", card: { id: t }, x: p, y: _ }]);
  return "refused" in w ? { refused: w.refused.reason } : { board: w.workshop };
}
function Re(e, t, l, s) {
  const i = /* @__PURE__ */ new Map();
  return (r) => {
    const c = Math.round(r.x) + ":" + Math.round(r.y);
    if (!i.has(c)) {
      const y = re(e, t, l, r, s);
      i.size > 400 && i.clear(), i.set(c, y && "board" in y ? y.board : e);
    }
    return i.get(c);
  };
}
const Ee = {
  laneCues: !0,
  places: (e, t) => L(e, t),
  notes: (e, t, l, s) => de(L(e, t).parts, e, l, s),
  editsBetween: ve,
  layer: (e) => fe(e, _e),
  cardKeys: "Right puts it under the card above it, Left takes it out, Up and Down move it among its neighbours.",
  label(e, t) {
    const l = e.cards.find((i) => "card-" + i.id === t);
    if (!l) return null;
    const s = e.cards.find((i) => i.id === l.parentId);
    return l.label + (l.role ? ", " + l.role : "") + (s ? ", under " + s.label : ", in " + e.lanes.find((i) => i.id === l.laneId).label);
  },
  chooser(e, t, l, s = {}) {
    if (F(e, s) === "matrix") return Re(e, t, l, s);
    const i = Oe(e, t, s), r = pe(e, t), c = r.map((f) => f.next), { main: y, tray: x } = q(e), p = e.cards.find((f) => f.id === t), _ = F(e, s), h = c.length > 1 ? le(e, "card-" + t, l, (f) => ce(L(f, s).parts), (f, M) => f.closest(c, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(M, { gapIn: 40, gapOut: 56 })) : null, { parts: w } = L(e, s), m = new Set(J(e, t));
    let d;
    return (f) => {
      const M = i(f);
      if (M !== void 0) return M ?? e;
      const I = _ === "outline" ? null : P(w, f, m);
      if (I) {
        const k = Se(e, _, I, f, w.find((a) => a.name === "card-" + I), t), A = r.find((a) => a.spot.laneId === k.laneId && a.spot.under === k.under && a.spot.before === k.before);
        if (A) return A.next;
      }
      const z = h ? h(f) : e;
      return Ae(z, e) ? p.laneId !== x && U(w.find((k) => k.name === "column-" + x), f) ? V(e, t, { laneId: x, under: null, before: null }) ?? e : U(w.find((k) => k.name === "column-" + y), f) && !P(w, f, /* @__PURE__ */ new Set()) ? (d === void 0 && (d = me(e, t)), d ?? e) : z : z;
    };
  },
  refusalAt(e, t, l, s, i) {
    const r = F(e, i);
    if (r === "matrix") {
      const m = re(e, t, l, s, i);
      return m && "refused" in m ? { laneId: q(e).main, reason: m.refused } : null;
    }
    const c = se(e, s, i);
    if (c) {
      const m = H(e, [{ kind: "set_owner", card: { id: t }, owner: c }]);
      return "refused" in m ? { laneId: q(e).main, reason: m.refused.reason } : null;
    }
    if (r === "outline") return null;
    const { parts: y } = L(e, i), x = P(y, s, new Set(J(e, t))), p = x && Q(e, r, x), _ = e.cards.find((m) => m.id === t);
    if (!p || p === _.parentId) return null;
    const h = V(e, t, { laneId: q(e).main, under: p, before: null }), w = h && e.behaviour ? he(e, h) : null;
    return w && "refused" in w ? { laneId: q(e).main, reason: w.refused.sentence } : null;
  },
  noteUnder(e, t, l) {
    if (F(e, l) === "matrix") return null;
    const s = P(L(e, l).parts, t, /* @__PURE__ */ new Set());
    return s ? Q(e, F(e, l), s) : null;
  },
  keyEdit(e, t, l) {
    const s = e.cards.find((p) => "card-" + p.id === t);
    if (!s) return null;
    const i = K(e, s);
    if (e.nest?.layout === "matrix") {
      const p = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }, [_, h] = p[l.key] ?? [0, 0];
      if (!i || !_ && !h) return null;
      const w = i.x + _, m = i.y + h;
      return w < 0 || w > 10 || m < 0 || m > 10 ? null : [{ kind: "score_card", card: { id: s.id }, x: w, y: m }];
    }
    const r = s.parentId ? D(e, s.parentId) : D(e, null, s.laneId), c = r.findIndex((p) => p.id === s.id), y = { id: s.id }, x = (p) => p ? { under: { id: p } } : { lane: { id: s.laneId } };
    switch (l.key) {
      case "ArrowRight":
        return c > 0 && s.laneId !== q(e).tray ? [{ kind: "nest_card", card: y, under: { id: r[c - 1].id } }] : null;
      case "ArrowLeft": {
        const p = e.cards.find((w) => w.id === s.parentId);
        if (!p) return null;
        const _ = p.parentId ? D(e, p.parentId) : D(e, null, p.laneId), h = _[_.findIndex((w) => w.id === p.id) + 1];
        return [{ kind: "nest_card", card: y, ...x(p.parentId), ...h && { before: { id: h.id } } }];
      }
      case "ArrowUp":
        return c > 0 ? [{ kind: "nest_card", card: y, ...x(s.parentId), before: { id: r[c - 1].id } }] : null;
      case "ArrowDown":
        return c >= 0 && c < r.length - 1 ? [{ kind: "nest_card", card: y, ...x(s.parentId), ...r[c + 2] && { before: { id: r[c + 2].id } } }] : null;
    }
    return null;
  },
  handleDrag: () => null
};
ae("nest", Ee);
export {
  ve as nestEditsBetween,
  Ee as nestKit,
  L as nestLayout
};
