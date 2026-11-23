import { Vec2 as ft, getElementPositionCheap as Vt, translate as Jt, dragSpecToBehavior as jt, param as Lt, moreThan as Rt, lessThan as Wt, inOrder as Yt } from "./dragology.mjs";
import { i as lt, n as C, l as m, o as $t, b as Tt } from "./model-DSiU3YcW.mjs";
import { p as se } from "./model-DSiU3YcW.mjs";
import { C as Q, a4 as A, a0 as K, e as zt, m as W, q as et, a3 as G, S as qt, k as st, K as At, v as Xt, x as Ot, a7 as j, A as Et, M as Zt, aa as Qt, ab as bt, j as P, a5 as tn, ai as nn, D as en, Q as gt, T as sn, U as an, a6 as rn, G as on, B as ln, ag as cn, ad as hn, ac as Pt, a1 as Ft, w as xt, s as O, aj as un, ap as dn, aq as fn } from "./plans-UwRdyRG0.mjs";
import { a as re, d as oe, al as le, c as ce, u as he, at as ue, a9 as de, O as fe, a8 as ge, $ as xe, g as pe, ak as me, ao as ye, h as we, i as ke, N as Me, a2 as Se, L as _e, J as ve, Z as Le, l as Re, V as We, P as $e, f as Te, n as ze, t as Ae, b as Oe, o as Ee, F as Pe, Y as Fe, z as Be, I as Ce, y as De, R as Ne, E as He, X as Ge, _ as Ke, as as Ie, r as Ue, ar as Ve, an as Je, W as je, ah as Ye, af as qe, ae as Xe, am as Ze, H as Qe, p as be } from "./plans-UwRdyRG0.mjs";
import Y from "react";
import { withBudgetTotal as at, pipelineForecast as ct, pipelineLimits as gn, pipelineRefusal as xn, pipelineCaption as pt, budgetLimits as pn, budgetRefusal as mn, budgetCaption as mt, budgetTotalBounds as yn, shiftBudget as yt, budgetCommitted as wn } from "./workshop-rules.mjs";
import { amountRules as ni, behaviourEditsBetween as ei, budgetRules as ii, budgetShiftLimits as si, budgetShiftRefusal as ai, budgetTotalFixed as ri, pipelineRules as oi, planBudgetMove as li, planPipelineMove as ci, planSamples as hi, restoreWorkshop as ui, sampleBudget as di, samplePipeline as fi, validateBudget as gi, validatePipeline as xi } from "./workshop-rules.mjs";
import { byOrder as mi, checkNest as yi, checkNestMove as wi, extend as ki, isOrderKey as Mi, nestAlias as Si, nestAreas as _i, nestCardText as vi, nestDepth as Li, nestDrags as Ri, nestEmptyDrop as Wi, nestFamily as $i, nestKids as Ti, nestLegal as zi, nestMeasure as Ai, nestMeasureWords as Oi, nestPlace as Ei, nestRoots as Pi, nestRules as Fi, nestSentence as Bi, nestSubtree as Ci, orderBetween as Di, orderKeys as Ni, registerNestPlus as Hi, roleOf as Gi, tidyKeys as Ki, validateNest as Ii } from "./workshop-nest.mjs";
import { isOrgChart as Vi, nestAxes as Ji, nestQuadrants as ji, nestScores as Yi, quadrantOf as qi, scoreBoard as Xi, scoresIn as Zi } from "./workshop-nest-plus.mjs";
function I(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return Y.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ Y.createElement("g", { id: s.name, transform: Jt(s.x, s.y) }, /* @__PURE__ */ Y.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ Y.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function U(t, e, n, s, a) {
  let c;
  const i = {
    draggable: (l) => (c ?? (c = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: ft(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Vt(i, t) || !c) return null;
  const o = jt(a(c, t), i);
  return (l) => o({ pointer: ft(l.x, l.y) }).dropState;
}
const b = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Bt(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((r) => r.id === n).laneId;
  return (r) => {
    const i = t(r);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const o = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + c && b(l, r));
    return o && a.find((l) => l.cards.find((d) => d.id === n).laneId === o.name.slice(7)) || i;
  };
}
function R(t, e) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function V(t, e) {
  if (t.clock && e.clock && t.clock.origin !== e.clock.origin) {
    const i = qt(t, st(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...V(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (d) => JSON.stringify(d.lanes.map((h) => h.allocation)), o = ["end", "start"].map((d) => ({ edge: d, made: at(t, e.budget.total, d) })).filter((d) => typeof d.made != "string"), l = o.find((d) => i(d.made) === i(e)) ?? o[0];
    if (l) return [{ kind: "set_budget_total", amount: e.budget.total, ...l.edge === "start" && { edge: "start" } }, ...V(l.made, e)];
  }
  const n = [];
  t.hiring && e.hiring && t.hiring.weeks !== e.hiring.weeks && n.push({ kind: "set_plan_weeks", weeks: e.hiring.weeks });
  const s = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of e.cards) {
    const o = s.get(i.id), l = { id: i.id };
    if (!o) {
      n.push({
        kind: "add_card",
        lane: { id: i.laneId },
        label: i.label,
        ...i.duration !== void 0 && { duration: i.duration },
        ...i.lag && { lag: i.lag },
        ...i.dependsOn && { waitsOn: i.dependsOn.map((h) => ({ id: h })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    o.label !== i.label && n.push({ kind: "rename_card", card: l, label: i.label });
    const d = n.length;
    for (const h of o.dependsOn ?? []) i.dependsOn?.includes(h) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: h } });
    for (const h of i.dependsOn ?? []) o.dependsOn?.includes(h) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: h } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (n.length > d && i.duration !== void 0 && n.slice(d).some((h) => h.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: l, amount: i.amount });
  }
  for (const i of t.cards) e.cards.some((o) => o.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  e.launch && t.launch?.day !== e.launch.day && n.push({ kind: "set_launch_day", day: e.launch.day }), e.hiring?.funding && t.hiring?.funding?.day !== e.hiring.funding.day && n.push({ kind: "set_funding", day: e.hiring.funding.day }), e.forecast && t.forecast?.target !== e.forecast.target && n.push({ kind: "set_target", amount: e.forecast.target });
  const a = e.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((o) => o.id === i.id)?.allocation ?? 0) })), c = a.filter((i) => i.by < 0), r = a.filter((i) => i.by > 0);
  for (const i of r)
    for (const o of c) {
      const l = Math.min(i.by, -o.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: i.id }, amount: l }), i.by -= l, o.by += l);
    }
  for (const i of e.lanes) {
    const o = t.lanes.find((l) => l.id === i.id);
    o && o.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label }), o && o.capacity !== i.capacity && n.push({ kind: "set_lane_capacity", lane: { id: i.id }, capacity: i.capacity ?? null });
  }
  return t.title !== e.title && n.push({ kind: "rename_workshop", title: e.title }), n;
}
function kn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${W(ct(t), e)} of ${W(t.forecast?.target ?? 0, e)}`;
}
function Mn(t) {
  return `${zt(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Ct(t, e) {
  return t.cards.filter((n) => At(t, e, n.id) === null).map((n) => n.id);
}
function Sn(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function ht(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", r = s.fontSize ?? 14;
  return t.map((i) => {
    const o = i.name.startsWith("handle-"), l = i.text ?? "";
    return { options: {
      id: i.name,
      text: l,
      name: e.cards.find((d) => "card-" + d.id === i.name)?.label ?? l,
      xPos: n.x + i.x,
      yPos: n.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: o ? "transparent" : i.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? a,
      borderColor: i.line ?? c,
      borderWidth: o ? 0 : i.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      fontSize: Sn(l, i.fontSize ?? r, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Dt(t, e) {
  const n = e.slice(7), s = Q(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${A(t, K(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${zt(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${W(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${et(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${et(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${et(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${G(t).charAt(0).toUpperCase() + G(t).slice(1)}, ${A(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((i) => i.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const Nt = "#c2410c", tt = "handle-_first", nt = "handle-_last", _n = 32, vn = 44, Ln = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function B(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = K(t), c = s ? t.hiring.weeks * 7 : tn(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), r = nn(t), i = [], o = /* @__PURE__ */ new Map(), l = n ? 8 : 168, d = n ? 88 : l + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), x = e.dayWidth ? Math.max(h, Math.ceil(d + c * e.dayWidth)) : h, u = e.dayWidth ?? (x - d) / c, g = (w) => C[t.lanes.findIndex((k) => k.id === w) % C.length], f = (w, k) => {
    const M = t.cards.find((T) => T.id === w), _ = a.get(w), v = { x: l + _.from * u, y: k, width: (_.to - _.from) * u, height: n ? vn : _n };
    o.set(w, v);
    const D = r.has(w);
    if (i.push({
      name: "card-" + w,
      ...v,
      text: n ? "" : s ? M.label : `${M.label} · ${M.duration}d`,
      fill: D ? "#fde3d7" : n ? g(M.laneId) : s ? R(g(M.laneId), 0.45) : "#fffdf6",
      line: D || _.critical && !s ? Nt : "#667872",
      lineWidth: D || _.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const T = Ln(n, v.width), N = n ? 44 : 22, ut = v.y + v.height / 2 - 22, dt = n ? Math.max(-12, v.x - N) : v.x - N;
      i.push({ name: ln(w), x: dt, y: ut, width: Math.max(24, v.x + T - dt), height: 44 }), i.push({ name: "handle-" + w, x: v.x + v.width - T, y: ut, width: T + N, height: 44 });
    }
  };
  let p, y, S;
  if (n) {
    const w = (x - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((k, M) => {
      const _ = 8 + M * (w + 8);
      i.push({ name: "column-" + k.id, x: _, y: 30, width: w, height: 72, fill: R(g(k.id), 0.6), line: R(g(k.id), 0.1) }), i.push({ name: "lane-" + k.id, x: _ + 4, y: 34, width: w - 8, height: 28, text: k.label, fill: g(k.id), fontSize: 14 }), i.push({ name: "caption-" + k.id, x: _ + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), S = 124, y = 130, p = 138;
    for (const k of t.cards)
      f(k.id, p + 20), p += 64;
  } else {
    S = 48, y = 56, p = y;
    for (const w of t.lanes) {
      const k = t.cards.filter((_) => _.laneId === w.id), M = Math.max(92, k.length * 44 + 20);
      i.push({ name: "column-" + w.id, x: 0, y: p, width: x, height: M, fill: R(g(w.id), 0.65), line: R(g(w.id), 0.1) }), i.push({ name: "lane-" + w.id, x: 8, y: p + 8, width: l - 24, height: 32, text: w.label, fill: g(w.id), fontSize: 15 }), i.push({ name: "caption-" + w.id, x: 8, y: p + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), k.forEach((_, v) => f(_.id, p + 10 + v * 44)), p += M + 4;
    }
  }
  return s ? t.hiring.funding && !n && i.push({ name: "handle-funding", x: l + t.hiring.funding.day * u - 22, y: 4, width: 44, height: 44 }) : i.push({ name: "handle-launch", x: l + t.launch.day * u - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && i.push({ name: tt, x: l - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && i.push({ name: nt, x: l + c * u - 22, y: 8, width: 44, height: 44 }), { parts: i, width: x, height: p + 8, narrow: n, x0: l, dayW: u, gridTop: y, axisY: S, bars: o };
}
function Rn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Wn(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), c = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, r = e.y + e.height / 2;
  return { d: `M ${s} ${c} V ${r} H ${e.x}`, arrow: { x: e.x, y: r, angle: 0 } };
}
function $n(t, e) {
  const n = B(t, e.layout), s = t.kind === "hiring-plan", a = K(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), r = Ot(t), i = [];
  if (r?.workdays)
    for (let h = 0; h < c; h++) xt(r.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: m.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (r && h.on && h.kind === "blackout") {
    const x = st(r.origin, h.start), u = st(r.origin, h.end) + 1, g = n.x0 + Math.max(0, x) * n.dayW, f = (Math.min(c, u) - Math.max(0, x)) * n.dayW;
    if (f <= 0) continue;
    i.push({ t: "rect", x: g, y: n.gridTop, w: f, h: n.height - 8 - n.gridTop, color: m.refuse, opacity: 0.12 });
    for (let p = g; p < g + f; p += 10) i.push({ t: "line", x1: p, y1: n.gridTop, x2: Math.min(g + f, p + 10), y2: n.gridTop + 10, color: m.refuse, width: 0.6 });
    i.push({ t: "text", x: g + 3, y: n.gridTop + 22, text: h.label + " · " + O(h.start) + "–" + O(h.end), color: m.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const x = n.x0 + h * n.dayW, u = r ? xt(r.origin, h) === 1 : h % 7 === 0;
    if (!u && n.dayW < 6) continue;
    i.push({ t: "line", x1: x, y1: n.gridTop, x2: x, y2: n.height - 8, color: u ? m.week : m.faint, width: u ? 1 : 0.5 });
    const g = s && r && P(r.origin, h).slice(8) <= "07" && u, f = r ? s ? g ? O(P(r.origin, h)).replace(/^\d+ /, "") : "" : O(P(r.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    u && f && (!r || s || n.dayW * 7 > 44) && i.push({ t: "text", x: x + 3, y: n.axisY, text: f, color: m.ink, size: 12 });
  }
  for (const h of t.cards) {
    for (const g of h.dependsOn ?? []) {
      const f = n.bars.get(g), p = n.bars.get(h.id);
      if (!f || !p) continue;
      const y = a.get(g).critical && a.get(h.id).critical, S = t.cards.find((w) => w.id === g).label;
      i.push({
        t: "path",
        ...Wn(f, p),
        color: y ? Nt : m.ink,
        width: y ? 2 : 1.5,
        unlink: { cardId: h.id, waitsOn: g, label: `Remove the link: ${h.label} waits on ${S}` }
      });
    }
    const x = a.get(h.id), u = n.bars.get(h.id);
    if (s) {
      const g = t.hiring.bands.find((y) => y.id === h.band), f = u.x + u.width, p = n.x0 + c * n.dayW;
      p > f && i.push({ t: "rect", x: f, y: u.y + u.height / 2 - 3, w: p - f, h: 6, rx: 3, color: m.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(f + 6, p - 120),
        y: n.narrow ? u.y - 6 : u.y + u.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + O(P(r.origin, un(t, h.id))) + (g ? " · " + W(g.monthly, t.hiring.currency) + "/mo" : ""),
        color: m.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    n.narrow && i.push({ t: "text", x: 8, y: u.y - 6, text: `${h.label} · ${h.duration}d`, color: m.ink, size: 13, bold: x.critical }), x.critical || i.push({ t: "text", x: u.x + u.width + (n.narrow ? 48 : 24), y: u.y + u.height / 2 + 4, text: "+" + x.slack + "d", color: m.ink, size: 12, role: "slack-" + h.id });
  }
  if (r && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: m.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: m.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && r) {
    const h = n.height + 2;
    i.push({ t: "text", x: n.x0, y: h, text: "Starts " + A(t, 0), color: m.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const x = s ? "Ends " + A(t, t.hiring.weeks * 7 - 1) : G(t).charAt(0).toUpperCase() + G(t).slice(1) + " " + A(t, t.launch.day), u = n.x0 + (s ? c : t.launch.day) * n.dayW;
    i.push({ t: "text", x: u, y: h, text: x, color: s ? m.ink : m.launch, size: 11, bold: !0, anchor: "end", role: "span-end" });
  }
  if (!(s && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && e.focus !== h.id) continue;
    const x = n.bars.get(h.id), u = x.y + 6, g = x.height - 12, [f, p] = n.narrow ? [x.x - 10, x.x + x.width + 4] : [x.x + 3, x.x + x.width - 9], y = n.narrow ? 0.55 : 0.8;
    i.push(
      { t: "rect", x: f, y: u, w: 6, h: g, rx: 3, color: m.ink, opacity: y, role: "grip-start-" + h.id },
      { t: "rect", x: p, y: u, w: 6, h: g, rx: 3, color: m.ink, opacity: y, role: "grip-end-" + h.id }
    );
  }
  if (s) {
    const h = dn(t), x = t.behaviour?.rules.find((f) => f.on && f.kind === "deadline"), u = x && x.kind === "deadline" && h < x.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + fn(h),
      color: u || e.refused ? m.refuse : m.ink,
      size: 14,
      bold: !0,
      role: "header"
    });
    const g = t.hiring.funding;
    if (g && g.day <= c) {
      const f = n.x0 + g.day * n.dayW;
      i.push({ t: "line", x1: f, y1: 26, x2: f, y2: n.height - 8, color: m.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: f - 4, y: 26, w: 8, h: 18, rx: 4, color: m.accept }), i.push({ t: "text", x: Math.max(f + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + W(g.amount, t.hiring.currency) + " · " + O(P(r.origin, g.day)), color: m.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: m.ink, size: 12 }), e.clamp) {
      const f = n.parts.find((p) => p.name === e.clamp.name);
      f && i.push(...kt(n, i, e.clamp.text, f, e.view));
    }
    return i;
  }
  const o = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: o, y1: n.narrow ? 112 : 26, x2: o, y2: n.height - 8, color: m.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: o - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: m.launch });
  const l = Ft(t), d = Math.max(0, ...[...a.values()].map((h) => h.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: r ? "Done " + A(t, Math.ceil(d) - 1) + " · " + G(t) + " " + A(t, t.launch.day) : `Done day ${l} · launch day ${t.launch.day}`,
    color: e.refused ? m.refuse : m.ink,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const h = n.parts.find((x) => x.name === e.clamp.name);
    h && i.push(...kt(n, i, e.clamp.text, h, e.view));
  }
  return i;
}
const q = 13, wt = 16, Ht = (t, e) => t * (e ? 0.64 : 0.6), Tn = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function zn(t) {
  const e = t.size ?? 13, n = t.text.length * Ht(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function An(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let it = null;
function kt(t, e, n, s, a) {
  const c = [...t.bars.values()].map((y) => ({ x: y.x - 4, y: y.y - 3, w: y.width + 8, h: y.height + 6 }));
  for (const y of e)
    y.t === "text" ? c.push(zn(y)) : y.t === "rect" && c.push({ x: y.x - 2, y: y.y - 2, w: y.w + 4, h: y.h + 4 });
  let r = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(r, a.x + 8) >= 160 && (r = Math.max(r, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(o, a.y + 8) >= 40 && (o = Math.max(o, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const d = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, h = JSON.stringify([n, d, r, i, o, l, c.map((y) => [y.x, y.y, y.w, y.h].map(Math.round))]);
  if (it?.key === h) return it.shapes;
  const x = Ht(q, !0), u = Math.floor((i - r) / x), g = /* @__PURE__ */ new Map();
  for (const y of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const S = An(n, Math.max(8, Math.floor(u * y)));
    S.length <= 4 && g.set(S.join(`
`), S);
  }
  let f = null;
  for (const y of g.values()) {
    const S = Math.max(...y.map((k) => k.length)) * x, w = y.length * wt + 2;
    if (!(S > i - r))
      for (let k = o; k + w <= l; k += 3)
        for (let M = r; M + S <= i; M += 6) {
          const _ = { x: M, y: k, w: S, h: w }, v = Math.max(_.x - d.x, 0, d.x - (_.x + _.w)), D = Math.max(_.y - d.y, 0, d.y - (_.y + _.h)), T = Math.hypot(v, D) + (y.length - 1) * 24;
          f && T >= f.score || c.every((N) => Tn(_, N)) && (f = { box: _, lines: y, score: T });
        }
  }
  const p = f ? [{ t: "text", x: f.box.x, y: f.box.y + q - 1, text: n, lines: f.lines, lineHeight: wt, color: m.refuse, size: q, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, t.width - 4),
    y: s.y + 14,
    text: n,
    color: m.refuse,
    size: q,
    anchor: s.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return it = { key: h, shapes: p }, p;
}
const X = (t, e = 1, n) => {
  const s = (c, r) => Math.round(c / r) * r, a = { ...t, cards: t.cards.map((c) => {
    const r = c.id === n ? e : 1, i = { ...c, duration: Math.max(r, s(c.duration, r)), lag: Math.max(0, s(c.lag ?? 0, r)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, Mt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function On(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((o) => o.id === i)?.label ?? i, r = [
    ...Ct(t, a.id).map((i) => ({
      said: `${a.label} waits on ${c(i)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    })),
    ...(a.dependsOn ?? []).map((i) => ({
      said: `${a.label} stops waiting on ${c(i)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    }))
  ];
  return r.length ? r : `${a.label} has no task it can wait on.`;
}
function En(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * j(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === tt && t.clock) return [{ kind: "set_plan_start", start: P(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === nt && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = Q(e), r = c !== null && t.cards.find((l) => l.id === c);
  if (r) return [{ kind: "set_task", card: { id: r.id }, duration: r.duration - a, lag: (r.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), o = i && t.cards.find((l) => l.id === i[2]);
  return o ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + a }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + a }] : null;
}
const rt = {
  laneCues: !1,
  notes(t, e, n, s) {
    return ht(rt.places(t, e).parts, t, n, s);
  },
  editsBetween: V,
  label: Dt,
  places(t, e) {
    const n = Rn(t, B(t, e), (s) => {
      const a = t.cards.filter((r) => r.laneId === s), c = K(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((r) => c.get(r.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => lt(t, $n),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (Mt(t) ? Fn : Gn)(t, e, a, Ct(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = B(t, a);
    for (const l of t.cards) {
      if (l.id === e || !b(c.bars.get(l.id), s)) continue;
      const d = At(t, e, l.id);
      return d ? { laneId: l.laneId, reason: d } : null;
    }
    const r = t.cards.find((l) => l.id === e), i = (r.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW);
    if (Mt(t)) {
      const l = K(t).get(e), d = Math.round(l.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), h = (r.lag ?? 0) + Xt(Ot(t)).idx(d) - l.start, x = j(t), u = Et(t, e, { lag: Math.max(0, Math.round(h / x) * x) });
      return typeof u == "string" ? { laneId: r.laneId, reason: u, lands: !0 } : null;
    }
    const o = Zt(t, { cardId: e, field: "lag" });
    return i > o.max ? { laneId: r.laneId, reason: Qt(bt(t, { cardId: e, field: "lag" }, i), e) ?? o.reasons.max } : null;
  },
  handleDrag(t, e, n, s) {
    const a = B(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = Q(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? St(t, c, "start", n, a, e) : null;
    const r = e.slice(7);
    return t.cards.some((i) => i.id === r) ? St(t, r, "end", n, a, e) : e === "handle-launch" ? Bn(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? Nn(t, n, a) : e === tt && t.clock ? Cn(t, n, a, s) : e === nt && t.hiring ? Dn(t, n, a, s) : null;
  },
  keyEdit: En,
  keyChoices: On,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = Q(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function St(t, e, n, s, a, c) {
  const r = a.parts.find((i) => i.name === c);
  return r ? (i) => {
    const o = en(t, e, n, (i.x - s.x - r.x) / a.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: Pn(t, e, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function Pn(t, e, n) {
  const s = t.cards.find((o) => o.id === e), a = j(t), c = s.lag ?? 0, r = s.duration ?? 1, i = (o, l) => Math.sign(l - o) * a;
  for (let o = { ...n }; o.lag !== c || o.duration !== r; ) {
    if (o.lag !== c) {
      const d = i(o.lag, c);
      o = { lag: o.lag + d, duration: o.duration - d };
    } else o = { lag: c, duration: o.duration + i(o.duration, r) };
    const l = Et(t, e, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function Fn(t, e, n, s, a, c) {
  const r = j(t), i = rn(t), o = t.cards[n].laneId, l = (f) => {
    if (!i) return f;
    const p = hn(t, f, /* @__PURE__ */ new Set([e]));
    return typeof p == "string" ? f : p;
  }, d = (f) => l(X(f, r, e)), h = (f) => I(B(l(f), c).parts, s.map((p) => "card-" + p)), u = (c.narrow ? [o] : t.lanes.map((f) => f.id)).flatMap((f) => on(t, e, "lag", f === o ? void 0 : f).map((p) => ({ laneId: f, run: p })));
  if (!u.length) return () => t;
  const g = U(t, "card-" + e, a, h, (f, p) => {
    const y = f.closest(u.map(({ laneId: S, run: [w, k] }) => f.vary(
      { ...p, cards: p.cards.map((M, _) => _ === n ? { ...M, laneId: S, lag: Math.min(k, Math.max(w, M.lag ?? 0)) } : M) },
      Lt("cards", n, "lag"),
      { constraint: (M) => [Rt(M.cards[n].lag ?? 0, w - 0.49), Wt(M.cards[n].lag ?? 0, k + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? f.closest(s.map((S) => f.dropTarget("target-" + S, Pt(p, e, S)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(y).withBranchTransition(120).onDrop(d) : y.onDrop(d);
  });
  return g ? (f) => d(g(f)) : null;
}
function Bn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = gt(t, t.launch.day + Math.round((r.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - i.day);
    for (let d = i.day + l; l && d !== t.launch.day; d += l) {
      const h = gt(t, d);
      if (h.next) {
        o = h.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function Cn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === tt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = sn(t, (r.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function Dn(t, e, n, s) {
  const a = n.parts.find((i) => i.name === nt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, r = t.hiring.weeks;
  return (i) => {
    const o = r + Math.round((i.x - e.x - a.x) / n.dayW / 7), l = an(t, o);
    return l ? { next: t, layout: c, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function Nn(t, e, n) {
  const s = n.parts.find((o) => o.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = j(t), r = t.hiring.weeks * 7, i = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = a + Math.round((o.x - e.x - s.x) / n.dayW / c) * c, d = Math.min(r, Math.max(0, l)), h = Hn(t, i(d));
    return h ? { next: t, clampedReason: h, refusal: h } : { next: i(d), ...d !== l && { clampedReason: d > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function Hn(t, e) {
  const n = t.behaviour ? cn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Gn(t, e, n, s, a, c) {
  const r = t.launch.day, i = (l) => I(B(l, c).parts, s.map((d) => "card-" + d)), o = U(t, "card-" + e, a, i, (l, d) => {
    const h = c.narrow ? d.lanes.filter((u) => u.id === d.cards[n].laneId) : d.lanes, x = l.closest(h.map((u) => l.vary(
      { ...d, cards: d.cards.map((g, f) => f === n ? { ...g, laneId: u.id, lag: g.lag ?? 0 } : g) },
      Lt("cards", n, "lag"),
      { constraint: (g) => [Rt(g.cards[n].lag ?? 0, -1e-3), Wt(Ft(g), r + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((u) => l.dropTarget("target-" + u, Pt(d, e, u)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop((u) => X(u)) : x.onDrop((u) => X(u));
  });
  return o ? (l) => X(o(l)) : null;
}
const E = 76;
function z(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), c = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : C[o % C.length];
  let r, i;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let o = E;
    t.lanes.forEach((l, d) => {
      const h = 96 + (a[d] + 1) * 64;
      s.push({ name: "column-" + l.id, x: 2, y: o, width: r - 4, height: h, fill: R(c(d), 0.6), line: R(c(d), 0.1) });
      const x = (r - 16) * 0.36;
      s.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: x, height: 36, text: l.label, fill: c(d), fontSize: 15 }), s.push({ name: "caption-" + l.id, x: 8 + x + 6, y: o + 6, width: r - 16 - x - 6, height: 56, text: pt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((u) => u.laneId === l.id).forEach((u, g) => s.push({ name: "card-" + u.id, x: 8, y: o + 72 + g * 64, width: r - 16, height: 56, text: _t(t, u.id), fontSize: 15 })), o += h + 10;
    }), i = o;
  } else {
    const d = 116 + (Math.max(...a) + 1) * 88;
    t.lanes.forEach((h, x) => {
      const u = x * 244;
      s.push({ name: "column-" + h.id, x: u + 2, y: E, width: 240, height: d, fill: R(c(x), 0.6), line: R(c(x), 0.1) }), s.push({ name: "lane-" + h.id, x: u + 8, y: E + 6, width: 228, height: 58, text: h.label, fill: c(x), fontSize: 16 }), s.push({ name: "caption-" + h.id, x: u + 8, y: E + 66, width: 228, height: 48, text: pt(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((g) => g.laneId === h.id).forEach((g, f) => s.push({ name: "card-" + g.id, x: u + 8, y: E + 116 + f * 88, width: 228, height: 76, text: _t(t, g.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, i = E + d;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: kn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: H(t, e, r) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: r, height: i };
}
const J = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, ct(t)), H = (t, e, n) => 4 + (n - 8) * t.forecast.target / J(t, e);
function ot(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function Kn(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = ot(J(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function _t(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + W(n.amount, t.forecast.currency);
}
function In(t, e) {
  const { width: n } = z(t, e.layout), s = t.forecast.target, a = ct(t), c = J(t, e.layout), r = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: m.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? m.accept : m.bar },
    { t: "line", x1: H(t, e.layout, n), y1: 36, x2: H(t, e.layout, n), y2: 62, color: m.ink, width: 2 },
    { t: "rect", x: H(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: m.ink, role: "edge-target" },
    { t: "text", x: H(t, e.layout, n), y: 72, text: "Target " + W(s, t.forecast.currency), color: m.ink, size: 14, anchor: "middle" }
  ];
}
const Un = {
  laneCues: !0,
  places: (t, e) => z(t, e),
  notes: (t, e, n, s) => ht(z(t, e).parts, t, n, s),
  editsBetween: V,
  layer: (t) => lt(t, In),
  chooser(t, e, n, s = {}) {
    const a = $t(t, e).map((c) => Tt(t, e, c.id));
    return a.length < 2 ? null : Bt(U(t, "card-" + e, n, (c) => I(z(c, s).parts), (c, r) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), t, e, z(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = z(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !b(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = xn(t, e, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  /**
   * The target's grip: dragged right it raises the target, left it lowers it, in the gauge's steps, on the scale the
   * drag started with (the gauge draws on past its end for a target held beyond it). One set_target on the drop.
   */
  handleDrag(t, e, n, s) {
    if (e !== "handle-target") return null;
    const a = z(t, s), c = a.parts.find((h) => h.name === "handle-target"), r = J(t, s), i = ot(r), o = r / (a.width - 8), l = { ...s, gaugeScale: r }, d = gn(t, { field: "target" });
    return (h) => {
      const x = t.forecast.target + Math.round((h.x - n.x - c.x) * o / i) * i, u = Math.min(d.max, Math.max(i, x));
      return { next: { ...t, forecast: { ...t.forecast, target: u } }, layout: l, ...u !== x && { clampedReason: u < x ? d.reasons.max : "A target is at least " + W(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: Kn,
  label: (t, e) => e === "handle-target" ? "Target, " + W(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + W(ot(J(t)), t.forecast.currency) + "." : null
}, L = 48, F = 960, Z = 900;
function $(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, r = [], i = [], o = t.lanes.map((u) => t.cards.filter((g) => g.laneId === u.id).length);
  let l, d;
  if (n) {
    l = Math.max(300, e.width ?? 390);
    let u = L + c / a * Z;
    t.lanes.forEach((g, f) => {
      const p = Math.max(100 + (o[f] + 1) * 64, g.allocation / a * Z);
      i.push({ laneId: g.id, start: u, size: p }), u += p;
    }), d = u + 8;
  } else {
    let u = c / a * F;
    for (const g of t.lanes)
      i.push({ laneId: g.id, start: u, size: g.allocation / a * F }), u += g.allocation / a * F;
    l = Math.max(F, u), d = L + 100 + (Math.max(...o) + 1) * 64;
  }
  t.lanes.forEach((u, g) => {
    const { start: f, size: p } = i[g], y = C[g % C.length], S = n ? { x: 2, y: f + 1, width: l - 4, height: p - 2 } : { x: f + 1, y: L, width: Math.max(4, p - 2), height: d - L }, w = { x: S.x + 5, y: S.y, width: Math.max(10, S.width - 10) };
    r.push({ name: "column-" + u.id, ...S, fill: R(y, 0.6), line: R(y, 0.1) });
    const k = n ? w.width * 0.36 : w.width;
    if (r.push({ name: "lane-" + u.id, x: w.x, y: w.y + 6, width: k, height: 32, text: u.label, fill: y, fontSize: 15 }), r.push({
      name: "caption-" + u.id,
      x: n ? w.x + k + 6 : w.x,
      y: w.y + (n ? 6 : 40),
      width: n ? w.width - k - 6 : w.width,
      height: n ? 50 : 40,
      text: n ? mt(t, u.id).replace(" · ", `
`) : mt(t, u.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((M) => M.laneId === u.id).forEach((M, _) => r.push({
      name: "card-" + M.id,
      x: w.x,
      y: w.y + 100 + _ * 64,
      width: w.width,
      height: 56,
      text: M.label + `
` + W(M.amount, t.budget.currency),
      fontSize: 14
    })), g < t.lanes.length - 1) {
      const M = f + p;
      r.push(n ? { name: "handle-" + u.id, x: l - 96, y: M - 22, width: 88, height: 44 } : { name: "handle-" + u.id, x: M - 22, y: L - 6, width: 44, height: 48 });
    }
  });
  const h = i[0], x = i.at(-1);
  for (const [u, g] of [[Gt, h.start], [Kt, x.start + x.size]])
    r.push(n ? { name: u, x: l - 96, y: g - 22, width: 88, height: 44 } : { name: u, x: g - 22, y: L - 6, width: 44, height: 48 });
  return { parts: r, width: l, height: d, segments: i, narrow: n, k: (n ? Z : F) / a };
}
const Gt = "handle-_first", Kt = "handle-_last", vt = (t) => t === Gt ? "start" : t === Kt ? "end" : null;
function Vn(t, e) {
  const n = $(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: Mn(t), color: m.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const r = n.segments[c], i = a.allocation, o = wn(t, a.id);
    if (n.narrow) {
      const l = r.start + 50, d = 8, h = n.width - 16;
      s.push({ t: "rect", x: d, y: l, w: h, h: 10, rx: 5, color: m.track }), s.push({ t: "rect", x: d, y: l, w: h * o / i || 0, h: 10, rx: 5, color: m.bar }), a.floor !== void 0 && s.push({ t: "line", x1: d + h * a.floor / i, y1: l - 4, x2: d + h * a.floor / i, y2: l + 14, color: m.ink, width: 2 });
    } else {
      const l = n.k, d = L + 86;
      s.push({ t: "rect", x: r.start + 6, y: d, w: r.size - 12, h: 10, rx: 5, color: m.track }), s.push({ t: "rect", x: r.start + 6, y: d, w: Math.max(0, (r.size - 12) * o / i || 0), h: 10, rx: 5, color: m.bar }), a.floor !== void 0 && s.push({ t: "line", x1: r.start + a.floor * l, y1: d - 6, x2: r.start + a.floor * l, y2: d + 16, color: m.ink, width: 2 }), a.cap !== void 0 && r.start + a.cap * l <= n.width && s.push({ t: "line", x1: r.start + a.cap * l, y1: d - 6, x2: r.start + a.cap * l, y2: d + 16, color: m.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const l = r.start + r.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: l, x2: n.width - 2, y2: l, color: m.ink, width: 2 } : { t: "line", x1: l, y1: L, x2: l, y2: n.height, color: m.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: m.ink } : { t: "rect", x: l - 4, y: L + 2, w: 8, h: 30, rx: 4, color: m.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const c = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: m.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: L + 2, w: 8, h: 30, rx: 4, color: m.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((c) => c.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : L - 12,
      text: e.clamp.text,
      color: m.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const It = (t, e) => Math.round(t / e) * e, Jn = {
  laneCues: !0,
  notes: (t, e, n, s) => ht($(t, e).parts, t, n, s),
  editsBetween: V,
  label: Dt,
  places(t, e) {
    const { parts: n, width: s, height: a } = $(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => lt(t, Vn),
  chooser(t, e, n, s = {}) {
    const a = $t(t, e).map((c) => Tt(t, e, c.id));
    return a.length < 2 ? null : Bt(U(t, "card-" + e, n, (c) => I($(c, s).parts), (c, r) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), t, e, $(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = $(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !b(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = mn(t, e, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = vt(e);
    if (a) return jn(t, a, e, n, s);
    const c = e.slice(7), r = t.lanes.findIndex((f) => f.id === c), i = t.lanes[r + 1];
    if (r < 0 || !i) return null;
    const o = pn(t, { laneId: c }), l = t.budget.step, d = (f) => {
      const p = Math.min(o.max, Math.max(o.min, It(f, l)));
      return yt(t, i.id, c, p);
    }, h = $(t, s), x = h.narrow ? Z / t.budget.total : F / t.budget.total, u = h.parts.find((f) => f.name === e), g = U(t, e, n, (f) => I($(f, s).parts), (f) => f.varyFunc([0], ([p]) => yt(t, i.id, c, p), { constraint: (p) => [
      ...Yt([o.min, p.lanes[r].allocation - t.lanes[r].allocation, o.max])
    ] }));
    return (f) => {
      const y = (h.narrow ? f.y - n.y - u.y : f.x - n.x - u.x) / x, S = g?.(f), w = S ? S.lanes[r].allocation - t.lanes[r].allocation : y, k = { next: d(w) };
      return y > o.max + l / 2 ? { ...k, clampedReason: o.reasons.max } : y < o.min - l / 2 ? { ...k, clampedReason: o.reasons.min } : k;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = vt(e);
    if (s) {
      const d = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (d ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], c = t.lanes.findIndex((d) => d.id === a), r = t.lanes[c + 1];
    if (c < 0 || !r) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", o = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: o } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: o }];
  }
};
function jn(t, e, n, s, a) {
  const c = $(t, a), r = c.parts.find((h) => h.name === n);
  if (!r) return null;
  const i = t.budget.total, o = t.budget.step, l = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, d = yn(t);
  return (h) => {
    const x = (c.narrow ? h.y - s.y - r.y : h.x - s.x - r.x) / c.k, u = i + It(e === "end" ? x : -x, o), g = at(t, u, e);
    if (typeof g != "string") return { next: g, layout: l };
    const f = at(t, Math.min(d.max, Math.max(d.min, u)), e);
    return { next: typeof f == "string" ? t : f, layout: l, clampedReason: g, refusal: g };
  };
}
const Ut = { "launch-plan": rt, "hiring-plan": rt, pipeline: Un, budget: Jn };
function bn(t, e) {
  Ut[t] = e;
}
function te(t) {
  const e = Ut[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function ne(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  re as amountLimits,
  oe as amountOf,
  ni as amountRules,
  le as bandOf,
  ei as behaviourEditsBetween,
  ne as boardLayoutFor,
  mt as budgetCaption,
  wn as budgetCommitted,
  Mn as budgetHeader,
  Jn as budgetKit,
  $ as budgetLayout,
  pn as budgetLimits,
  mn as budgetRefusal,
  ii as budgetRules,
  si as budgetShiftLimits,
  ai as budgetShiftRefusal,
  yn as budgetTotalBounds,
  ri as budgetTotalFixed,
  mi as byOrder,
  rn as cascadeStops,
  yi as checkNest,
  wi as checkNestMove,
  cn as checkTime,
  Ot as clockOf,
  lt as createBoardLayer,
  ce as currencyOf,
  et as dateName,
  he as dayFromWords,
  Xt as dayMap,
  A as dayWords,
  ue as days,
  de as downstreamTasks,
  en as dragTaskEdge,
  fe as earliestLaunch,
  ge as edgeValues,
  ki as extend,
  xe as extendWorkshopEdits,
  pe as goLiveSample,
  Dt as handleLabel,
  U as headlessDrag,
  me as hireLagFor,
  un as hireStarts,
  ye as hiringPlanRules,
  we as hiringPlanSample,
  hn as holdOthers,
  b as inside,
  Mi as isOrderKey,
  Vi as isOrgChart,
  P as isoAt,
  ke as isoTime,
  te as kitFor,
  Me as launchDayOn,
  Ft as launchFinish,
  tn as launchHard,
  Se as launchIndex,
  B as launchLayout,
  At as launchLinkRefusal,
  Ct as launchLinkTargets,
  Qt as launchOverrun,
  _e as launchPlanCaption,
  rt as launchPlanKit,
  Zt as launchPlanLimits,
  ve as launchPlanRefusal,
  Le as launchPlanRules,
  Re as launchPlanSample,
  We as launchTaskText,
  $e as launchTooEarly,
  m as layerInk,
  on as legalRuns,
  G as lineWord,
  W as money,
  zt as moneyExact,
  Te as monthNames,
  gt as moveLaunch,
  sn as movePlanStart,
  Si as nestAlias,
  _i as nestAreas,
  Ji as nestAxes,
  vi as nestCardText,
  Li as nestDepth,
  Ri as nestDrags,
  Wi as nestEmptyDrop,
  $i as nestFamily,
  Ti as nestKids,
  zi as nestLegal,
  Ai as nestMeasure,
  Oi as nestMeasureWords,
  Ei as nestPlace,
  ji as nestQuadrants,
  Pi as nestRoots,
  Fi as nestRules,
  Yi as nestScores,
  Bi as nestSentence,
  Ci as nestSubtree,
  ze as nextCardId,
  Ae as nextMonday,
  Oe as noteNumbers,
  st as offsetOf,
  Di as orderBetween,
  Ni as orderKeys,
  Ee as ownField,
  ht as partNotes,
  I as partsGeometry,
  nn as pastTheLine,
  pt as pipelineCaption,
  ct as pipelineForecast,
  kn as pipelineGauge,
  Un as pipelineKit,
  z as pipelineLayout,
  gn as pipelineLimits,
  xn as pipelineRefusal,
  oi as pipelineRules,
  li as planBudgetMove,
  Pe as planDrags,
  Fe as planEdit,
  Be as planFixed,
  Ce as planLaunchPlanMove,
  ci as planPipelineMove,
  De as planProblem,
  hi as planSamples,
  Ne as planStartBy,
  an as planWeeksProblem,
  He as planWords,
  Ge as presetRules,
  qi as quadrantOf,
  Ke as readClock,
  Ie as readNoteNumbers,
  bn as registerBoardKit,
  Hi as registerNestPlus,
  Ue as renamedNumbers,
  se as renderLayerShapes,
  ui as restoreWorkshop,
  Gi as roleOf,
  Ve as runwayCap,
  Je as runwayHeader,
  dn as runwayMonths,
  fn as runwayWords,
  di as sampleBudget,
  je as sampleLaunchPlan,
  fi as samplePipeline,
  K as scheduleLaunch,
  Xi as scoreBoard,
  Zi as scoresIn,
  yt as shiftBudget,
  O as shortDate,
  j as snapStep,
  ln as startHandle,
  Q as startHandleCard,
  Ki as tidyKeys,
  Ye as timeFamily,
  qe as timeRuleKindIds,
  Xe as timeSentence,
  R as tint,
  Et as tryTask,
  gi as validateBudget,
  Ze as validateHiringPlan,
  Qe as validateLaunchPlan,
  Ii as validateNest,
  xi as validatePipeline,
  xt as weekdayAt,
  be as weekendAt,
  at as withBudgetTotal,
  Pt as withLink,
  qt as withPlanStart,
  bt as withTaskValue,
  V as workshopEditsBetween
};
