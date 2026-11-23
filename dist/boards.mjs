import { Vec2 as gt, getElementPositionCheap as Jt, translate as jt, dragSpecToBehavior as Yt, param as Lt, moreThan as Rt, lessThan as $t, inOrder as qt } from "./dragology.mjs";
import { i as ct, n as N, l as p, o as Tt, b as zt } from "./model-CAMMBhgP.mjs";
import { p as re } from "./model-CAMMBhgP.mjs";
import { C as Q, a4 as O, a0 as G, e as At, m as $, q as it, a3 as H, S as Xt, k as at, K as Ot, v as Zt, x as Et, a7 as j, A as Ft, M as Qt, aa as bt, ab as tn, j as B, a5 as nn, ai as en, D as sn, Q as xt, T as an, U as rn, a6 as on, G as ln, B as cn, ag as hn, ad as un, ac as Pt, a1 as Bt, w as pt, s as F, aj as dn, ap as fn, aq as gn } from "./plans-C_6baHho.mjs";
import { a as le, d as ce, al as he, c as ue, u as de, at as fe, a9 as ge, O as xe, a8 as pe, $ as me, g as ye, ak as we, ao as ke, h as Me, i as ve, N as We, a2 as Se, L as _e, J as Le, Z as Re, l as $e, V as Te, P as ze, f as Ae, n as Oe, t as Ee, b as Fe, o as Pe, F as Be, Y as Ce, z as De, I as Ne, y as Ie, R as He, E as Ge, X as Ke, _ as Ue, as as Ve, r as Je, ar as je, an as Ye, W as qe, ah as Xe, af as Ze, ae as Qe, am as be, H as ti, p as ni } from "./plans-C_6baHho.mjs";
import Y from "react";
import { withBudgetTotal as rt, pipelineForecast as ht, pipelineLimits as xn, pipelineRefusal as pn, pipelineCaption as mt, budgetLimits as mn, budgetRefusal as yn, budgetCaption as yt, budgetTotalBounds as wn, shiftBudget as wt, budgetCommitted as kn } from "./workshop-rules.mjs";
import { amountRules as ii, behaviourEditsBetween as si, budgetRules as ai, budgetShiftLimits as ri, budgetShiftRefusal as oi, budgetTotalFixed as li, pipelineRules as ci, planBudgetMove as hi, planPipelineMove as ui, planSamples as di, restoreWorkshop as fi, sampleBudget as gi, samplePipeline as xi, validateBudget as pi, validatePipeline as mi } from "./workshop-rules.mjs";
import { byOrder as wi, checkNest as ki, checkNestMove as Mi, extend as vi, isOrderKey as Wi, nestAlias as Si, nestAreas as _i, nestCardText as Li, nestDepth as Ri, nestDrags as $i, nestEmptyDrop as Ti, nestFamily as zi, nestKids as Ai, nestLegal as Oi, nestMeasure as Ei, nestMeasureWords as Fi, nestPlace as Pi, nestRoots as Bi, nestRules as Ci, nestSentence as Di, nestSubtree as Ni, orderBetween as Ii, orderKeys as Hi, registerNestPlus as Gi, roleOf as Ki, tidyKeys as Ui, validateNest as Vi } from "./workshop-nest.mjs";
import { isOrgChart as ji, nestAxes as Yi, nestQuadrants as qi, nestScores as Xi, quadrantOf as Zi, scoreBoard as Qi, scoresIn as bi } from "./workshop-nest-plus.mjs";
function K(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return Y.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ Y.createElement("g", { id: s.name, transform: jt(s.x, s.y) }, /* @__PURE__ */ Y.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ Y.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function U(t, e, n, s, a) {
  let c;
  const i = {
    draggable: (l) => (c ?? (c = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: gt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!Jt(i, t) || !c) return null;
  const o = Yt(a(c, t), i);
  return (l) => o({ pointer: gt(l.x, l.y) }).dropState;
}
const b = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Ct(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((r) => r.id === n).laneId;
  return (r) => {
    const i = t(r);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const o = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + c && b(l, r));
    return o && a.find((l) => l.cards.find((f) => f.id === n).laneId === o.name.slice(7)) || i;
  };
}
function R(t, e) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function V(t, e) {
  if (t.clock && e.clock && t.clock.origin !== e.clock.origin) {
    const i = Xt(t, at(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...V(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (f) => JSON.stringify(f.lanes.map((h) => h.allocation)), o = ["end", "start"].map((f) => ({ edge: f, made: rt(t, e.budget.total, f) })).filter((f) => typeof f.made != "string"), l = o.find((f) => i(f.made) === i(e)) ?? o[0];
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
    const f = n.length;
    for (const h of o.dependsOn ?? []) i.dependsOn?.includes(h) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: h } });
    for (const h of i.dependsOn ?? []) o.dependsOn?.includes(h) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: h } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (n.length > f && i.duration !== void 0 && n.slice(f).some((h) => h.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: l, amount: i.amount });
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
function Mn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${$(ht(t), e)} of ${$(t.forecast?.target ?? 0, e)}`;
}
function vn(t) {
  return `${At(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function Dt(t, e) {
  return t.cards.filter((n) => Ot(t, e, n.id) === null).map((n) => n.id);
}
function Wn(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function ut(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", r = s.fontSize ?? 14;
  return t.map((i) => {
    const o = i.name.startsWith("handle-"), l = i.text ?? "";
    return { options: {
      id: i.name,
      text: l,
      name: e.cards.find((f) => "card-" + f.id === i.name)?.label ?? l,
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
      fontSize: Wn(l, i.fontSize ?? r, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Nt(t, e) {
  const n = e.slice(7), s = Q(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${O(t, G(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${At(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${$(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${it(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${it(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${it(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${H(t).charAt(0).toUpperCase() + H(t).slice(1)}, ${O(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((i) => i.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const It = "#c2410c", tt = "handle-_first", nt = "handle-_last", Sn = 32, _n = 44, Ln = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function D(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = G(t), c = s ? t.hiring.weeks * 7 : nn(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), r = en(t), i = [], o = /* @__PURE__ */ new Map(), l = n ? 8 : 168, f = n ? 88 : l + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), x = e.dayWidth ? Math.max(h, Math.ceil(f + c * e.dayWidth)) : h, u = e.maxWidth !== void 0 && x > e.maxWidth ? Math.max(h, Math.floor(e.maxWidth)) : x, g = e.dayWidth && u === x ? e.dayWidth : (u - f) / c, d = (w) => N[t.lanes.findIndex((k) => k.id === w) % N.length], y = (w, k) => {
    const W = t.cards.find((z) => z.id === w), S = a.get(w), _ = { x: l + S.from * g, y: k, width: (S.to - S.from) * g, height: n ? _n : Sn };
    o.set(w, _);
    const E = r.has(w);
    if (i.push({
      name: "card-" + w,
      ..._,
      text: n ? "" : s ? W.label : `${W.label} · ${W.duration}d`,
      fill: E ? "#fde3d7" : n ? d(W.laneId) : s ? R(d(W.laneId), 0.45) : "#fffdf6",
      line: E || S.critical && !s ? It : "#667872",
      lineWidth: E || S.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const z = Ln(n, _.width), et = n ? 44 : 22, dt = _.y + _.height / 2 - 22, ft = n ? Math.max(-12, _.x - et) : _.x - et;
      i.push({ name: cn(w), x: ft, y: dt, width: Math.max(24, _.x + z - ft), height: 44 }), i.push({ name: "handle-" + w, x: _.x + _.width - z, y: dt, width: z + et, height: 44 });
    }
  };
  let m, M, v;
  if (n) {
    const w = (u - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((k, W) => {
      const S = 8 + W * (w + 8);
      i.push({ name: "column-" + k.id, x: S, y: 30, width: w, height: 72, fill: R(d(k.id), 0.6), line: R(d(k.id), 0.1) }), i.push({ name: "lane-" + k.id, x: S + 4, y: 34, width: w - 8, height: 28, text: k.label, fill: d(k.id), fontSize: 14 }), i.push({ name: "caption-" + k.id, x: S + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), v = 124, M = 130, m = 138;
    for (const k of t.cards)
      y(k.id, m + 20), m += 64;
  } else {
    v = 48, M = 56, m = M;
    for (const w of t.lanes) {
      const k = t.cards.filter((S) => S.laneId === w.id), W = Math.max(92, k.length * 44 + 20);
      i.push({ name: "column-" + w.id, x: 0, y: m, width: u, height: W, fill: R(d(w.id), 0.65), line: R(d(w.id), 0.1) }), i.push({ name: "lane-" + w.id, x: 8, y: m + 8, width: l - 24, height: 32, text: w.label, fill: d(w.id), fontSize: 15 }), i.push({ name: "caption-" + w.id, x: 8, y: m + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), k.forEach((S, _) => y(S.id, m + 10 + _ * 44)), m += W + 4;
    }
  }
  return s ? t.hiring.funding && !n && i.push({ name: "handle-funding", x: l + t.hiring.funding.day * g - 22, y: 4, width: 44, height: 44 }) : i.push({ name: "handle-launch", x: l + t.launch.day * g - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && i.push({ name: tt, x: l - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && i.push({ name: nt, x: l + c * g - 22, y: 8, width: 44, height: 44 }), { parts: i, width: u, height: m + 8, narrow: n, x0: l, dayW: g, gridTop: M, axisY: v, bars: o };
}
function Rn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function $n(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), c = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, r = e.y + e.height / 2;
  return { d: `M ${s} ${c} V ${r} H ${e.x}`, arrow: { x: e.x, y: r, angle: 0 } };
}
const Tn = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function zn(t, e) {
  const n = D(t, e.layout), s = t.kind === "hiring-plan", a = G(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), r = Et(t), i = [];
  if (r?.workdays)
    for (let h = 0; h < c; h++) pt(r.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? p.canvasTrack : p.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (r && h.on && h.kind === "blackout") {
    const x = at(r.origin, h.start), u = at(r.origin, h.end) + 1, g = n.x0 + Math.max(0, x) * n.dayW, d = (Math.min(c, u) - Math.max(0, x)) * n.dayW;
    if (d <= 0) continue;
    i.push({ t: "rect", x: g, y: n.gridTop, w: d, h: n.height - 8 - n.gridTop, color: p.refuse, opacity: 0.12 });
    for (let y = g; y < g + d; y += 10) i.push({ t: "line", x1: y, y1: n.gridTop, x2: Math.min(g + d, y + 10), y2: n.gridTop + 10, color: p.refuse, width: 0.6 });
    i.push({ t: "text", x: g + 3, y: n.gridTop + 22, text: h.label + " · " + F(h.start) + "–" + F(h.end), color: p.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const x = n.x0 + h * n.dayW, u = r ? pt(r.origin, h) === 1 : h % 7 === 0;
    if (!u && n.dayW < 6) continue;
    i.push({ t: "line", x1: x, y1: n.gridTop, x2: x, y2: n.height - 8, color: n.narrow ? u ? p.canvasWeek : p.canvasFaint : u ? p.week : p.faint, width: u ? 1 : 0.5 });
    const g = s && r && B(r.origin, h).slice(8) <= "07" && u, d = r ? s ? g ? F(B(r.origin, h)).replace(/^\d+ /, "") : "" : F(B(r.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    u && d && (!r || s || n.dayW * 7 > 44) && i.push({ t: "text", x: x + 3, y: n.axisY, text: d, color: p.canvasInk, size: 12 });
  }
  for (const h of t.cards) {
    for (const g of h.dependsOn ?? []) {
      const d = n.bars.get(g), y = n.bars.get(h.id);
      if (!d || !y) continue;
      const m = a.get(g).critical && a.get(h.id).critical, M = t.cards.find((v) => v.id === g).label;
      i.push({
        t: "path",
        ...$n(d, y),
        color: m ? It : p.ink,
        width: m ? 2 : 1.5,
        unlink: { cardId: h.id, waitsOn: g, label: `Remove the link: ${h.label} waits on ${M}` }
      });
    }
    const x = a.get(h.id), u = n.bars.get(h.id);
    if (s) {
      const g = t.hiring.bands.find((m) => m.id === h.band), d = u.x + u.width, y = n.x0 + c * n.dayW;
      y > d && i.push({ t: "rect", x: d, y: u.y + u.height / 2 - 3, w: y - d, h: 6, rx: 3, color: p.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(d + 6, y - 120),
        y: n.narrow ? u.y - 6 : u.y + u.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + F(B(r.origin, dn(t, h.id))) + (g ? " · " + $(g.monthly, t.hiring.currency) + "/mo" : ""),
        color: p.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    if (n.narrow) {
      const g = `${h.label} · ${h.duration}d`, d = Tn(g, x.critical), y = u.x + 2 + d <= n.width - 8;
      i.push({
        t: "text",
        x: y ? u.x + 2 : Math.max(8 + d, Math.min(n.width - 8, u.x + u.width)),
        anchor: y ? "start" : "end",
        y: u.y - 7,
        text: g,
        color: p.canvasInk,
        size: 13,
        bold: x.critical,
        halo: p.halo,
        role: "words-" + h.id
      });
    }
    x.critical || i.push({ t: "text", x: u.x + u.width + (n.narrow ? 48 : 24), y: u.y + u.height / 2 + 4, text: "+" + x.slack + "d", color: n.narrow ? p.canvasInk : p.ink, size: 12, role: "slack-" + h.id });
  }
  if (r && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: p.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: p.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && r) {
    const h = n.height + 2;
    i.push({ t: "text", x: n.x0, y: h, text: "Starts " + O(t, 0), color: p.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const x = s ? "Ends " + O(t, t.hiring.weeks * 7 - 1) : H(t).charAt(0).toUpperCase() + H(t).slice(1) + " " + O(t, t.launch.day), u = n.x0 + (s ? c : t.launch.day) * n.dayW;
    i.push({ t: "text", x: u, y: h, text: x, color: s ? p.ink : p.launch, size: 11, bold: !0, anchor: "end", role: "span-end" });
  }
  if (!(s && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && e.focus !== h.id) continue;
    const x = n.bars.get(h.id), u = x.y + 6, g = x.height - 12, [d, y] = n.narrow ? [x.x - 10, x.x + x.width + 4] : [x.x + 3, x.x + x.width - 9], m = n.narrow ? 0.55 : 0.8;
    i.push(
      { t: "rect", x: d, y: u, w: 6, h: g, rx: 3, color: p.ink, opacity: m, role: "grip-start-" + h.id },
      { t: "rect", x: y, y: u, w: 6, h: g, rx: 3, color: p.ink, opacity: m, role: "grip-end-" + h.id }
    );
  }
  if (s) {
    const h = fn(t), x = t.behaviour?.rules.find((d) => d.on && d.kind === "deadline"), u = x && x.kind === "deadline" && h < x.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + gn(h),
      color: u || e.refused ? p.refuse : p.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const g = t.hiring.funding;
    if (g && g.day <= c) {
      const d = n.x0 + g.day * n.dayW;
      i.push({ t: "line", x1: d, y1: 26, x2: d, y2: n.height - 8, color: p.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: d - 4, y: 26, w: 8, h: 18, rx: 4, color: p.accept }), i.push({ t: "text", x: Math.max(d + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + $(g.amount, t.hiring.currency) + " · " + F(B(r.origin, g.day)), color: p.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: p.ink, size: 12 }), e.clamp) {
      const d = n.parts.find((y) => y.name === e.clamp.name);
      d && i.push(...Mt(n, i, e.clamp.text, d, e.view));
    }
    return i;
  }
  const o = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: o, y1: n.narrow ? 112 : 26, x2: o, y2: n.height - 8, color: p.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: o - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: p.launch });
  const l = Bt(t), f = Math.max(0, ...[...a.values()].map((h) => h.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: r ? "Done " + O(t, Math.ceil(f) - 1) + " · " + H(t) + " " + O(t, t.launch.day) : `Done day ${l} · launch day ${t.launch.day}`,
    color: e.refused ? p.refuse : p.canvasInk,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const h = n.parts.find((x) => x.name === e.clamp.name);
    h && i.push(...Mt(n, i, e.clamp.text, h, e.view));
  }
  return i;
}
const q = 13, kt = 16, Ht = (t, e) => t * (e ? 0.64 : 0.6), An = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function On(t) {
  const e = t.size ?? 13, n = t.text.length * Ht(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function En(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let st = null;
function Mt(t, e, n, s, a) {
  const c = [...t.bars.values()].map((m) => ({ x: m.x - 4, y: m.y - 3, w: m.width + 8, h: m.height + 6 }));
  for (const m of e)
    m.t === "text" ? c.push(On(m)) : m.t === "rect" && c.push({ x: m.x - 2, y: m.y - 2, w: m.w + 4, h: m.h + 4 });
  let r = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(r, a.x + 8) >= 160 && (r = Math.max(r, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(o, a.y + 8) >= 40 && (o = Math.max(o, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const f = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, h = JSON.stringify([n, f, r, i, o, l, c.map((m) => [m.x, m.y, m.w, m.h].map(Math.round))]);
  if (st?.key === h) return st.shapes;
  const x = Ht(q, !0), u = Math.floor((i - r) / x), g = /* @__PURE__ */ new Map();
  for (const m of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const M = En(n, Math.max(8, Math.floor(u * m)));
    M.length <= 4 && g.set(M.join(`
`), M);
  }
  let d = null;
  for (const m of g.values()) {
    const M = Math.max(...m.map((w) => w.length)) * x, v = m.length * kt + 2;
    if (!(M > i - r))
      for (let w = o; w + v <= l; w += 3)
        for (let k = r; k + M <= i; k += 6) {
          const W = { x: k, y: w, w: M, h: v }, S = Math.max(W.x - f.x, 0, f.x - (W.x + W.w)), _ = Math.max(W.y - f.y, 0, f.y - (W.y + W.h)), E = Math.hypot(S, _) + (m.length - 1) * 24;
          d && E >= d.score || c.every((z) => An(W, z)) && (d = { box: W, lines: m, score: E });
        }
  }
  const y = d ? [{ t: "text", x: d.box.x, y: d.box.y + q - 1, text: n, lines: d.lines, lineHeight: kt, color: p.refuse, size: q, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, t.width - 4),
    y: s.y + 14,
    text: n,
    color: p.refuse,
    size: q,
    anchor: s.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return st = { key: h, shapes: y }, y;
}
const X = (t, e = 1, n) => {
  const s = (c, r) => Math.round(c / r) * r, a = { ...t, cards: t.cards.map((c) => {
    const r = c.id === n ? e : 1, i = { ...c, duration: Math.max(r, s(c.duration, r)), lag: Math.max(0, s(c.lag ?? 0, r)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, vt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Fn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((o) => o.id === i)?.label ?? i, r = [
    ...Dt(t, a.id).map((i) => ({
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
function Pn(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * j(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === tt && t.clock) return [{ kind: "set_plan_start", start: B(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === nt && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = Q(e), r = c !== null && t.cards.find((l) => l.id === c);
  if (r) return [{ kind: "set_task", card: { id: r.id }, duration: r.duration - a, lag: (r.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), o = i && t.cards.find((l) => l.id === i[2]);
  return o ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + a }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + a }] : null;
}
const ot = {
  laneCues: !1,
  notes(t, e, n, s) {
    return ut(ot.places(t, e).parts, t, n, s);
  },
  editsBetween: V,
  label: Nt,
  places(t, e) {
    const n = Rn(t, D(t, e), (s) => {
      const a = t.cards.filter((r) => r.laneId === s), c = G(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((r) => c.get(r.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => ct(t, zn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (vt(t) ? Cn : Kn)(t, e, a, Dt(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = D(t, a);
    for (const l of t.cards) {
      if (l.id === e || !b(c.bars.get(l.id), s)) continue;
      const f = Ot(t, e, l.id);
      return f ? { laneId: l.laneId, reason: f } : null;
    }
    const r = t.cards.find((l) => l.id === e), i = (r.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW);
    if (vt(t)) {
      const l = G(t).get(e), f = Math.round(l.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), h = (r.lag ?? 0) + Zt(Et(t)).idx(f) - l.start, x = j(t), u = Ft(t, e, { lag: Math.max(0, Math.round(h / x) * x) });
      return typeof u == "string" ? { laneId: r.laneId, reason: u, lands: !0 } : null;
    }
    const o = Qt(t, { cardId: e, field: "lag" });
    return i > o.max ? { laneId: r.laneId, reason: bt(tn(t, { cardId: e, field: "lag" }, i), e) ?? o.reasons.max } : null;
  },
  handleDrag(t, e, n, s) {
    const a = D(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = Q(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? Wt(t, c, "start", n, a, e) : null;
    const r = e.slice(7);
    return t.cards.some((i) => i.id === r) ? Wt(t, r, "end", n, a, e) : e === "handle-launch" ? Dn(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? Hn(t, n, a) : e === tt && t.clock ? Nn(t, n, a, s) : e === nt && t.hiring ? In(t, n, a, s) : null;
  },
  keyEdit: Pn,
  keyChoices: Fn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = Q(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function Wt(t, e, n, s, a, c) {
  const r = a.parts.find((i) => i.name === c);
  return r ? (i) => {
    const o = sn(t, e, n, (i.x - s.x - r.x) / a.dayW);
    return o.next ? { next: o.next, ...o.reason && { clampedReason: o.reason } } : { next: Bn(t, e, o.values) ?? t, clampedReason: o.refusal, refusal: o.refusal };
  } : null;
}
function Bn(t, e, n) {
  const s = t.cards.find((o) => o.id === e), a = j(t), c = s.lag ?? 0, r = s.duration ?? 1, i = (o, l) => Math.sign(l - o) * a;
  for (let o = { ...n }; o.lag !== c || o.duration !== r; ) {
    if (o.lag !== c) {
      const f = i(o.lag, c);
      o = { lag: o.lag + f, duration: o.duration - f };
    } else o = { lag: c, duration: o.duration + i(o.duration, r) };
    const l = Ft(t, e, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function Cn(t, e, n, s, a, c) {
  const r = j(t), i = on(t), o = t.cards[n].laneId, l = (d) => {
    if (!i) return d;
    const y = un(t, d, /* @__PURE__ */ new Set([e]));
    return typeof y == "string" ? d : y;
  }, f = (d) => l(X(d, r, e)), h = (d) => K(D(l(d), c).parts, s.map((y) => "card-" + y)), u = (c.narrow ? [o] : t.lanes.map((d) => d.id)).flatMap((d) => ln(t, e, "lag", d === o ? void 0 : d).map((y) => ({ laneId: d, run: y })));
  if (!u.length) return () => t;
  const g = U(t, "card-" + e, a, h, (d, y) => {
    const m = d.closest(u.map(({ laneId: M, run: [v, w] }) => d.vary(
      { ...y, cards: y.cards.map((k, W) => W === n ? { ...k, laneId: M, lag: Math.min(w, Math.max(v, k.lag ?? 0)) } : k) },
      Lt("cards", n, "lag"),
      { constraint: (k) => [Rt(k.cards[n].lag ?? 0, v - 0.49), $t(k.cards[n].lag ?? 0, w + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? d.closest(s.map((M) => d.dropTarget("target-" + M, Pt(y, e, M)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(m).withBranchTransition(120).onDrop(f) : m.onDrop(f);
  });
  return g ? (d) => f(g(d)) : null;
}
function Dn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = xt(t, t.launch.day + Math.round((r.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - i.day);
    for (let f = i.day + l; l && f !== t.launch.day; f += l) {
      const h = xt(t, f);
      if (h.next) {
        o = h.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function Nn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === tt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = an(t, (r.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function In(t, e, n, s) {
  const a = n.parts.find((i) => i.name === nt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, r = t.hiring.weeks;
  return (i) => {
    const o = r + Math.round((i.x - e.x - a.x) / n.dayW / 7), l = rn(t, o);
    return l ? { next: t, layout: c, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function Hn(t, e, n) {
  const s = n.parts.find((o) => o.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = j(t), r = t.hiring.weeks * 7, i = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = a + Math.round((o.x - e.x - s.x) / n.dayW / c) * c, f = Math.min(r, Math.max(0, l)), h = Gn(t, i(f));
    return h ? { next: t, clampedReason: h, refusal: h } : { next: i(f), ...f !== l && { clampedReason: f > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function Gn(t, e) {
  const n = t.behaviour ? hn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Kn(t, e, n, s, a, c) {
  const r = t.launch.day, i = (l) => K(D(l, c).parts, s.map((f) => "card-" + f)), o = U(t, "card-" + e, a, i, (l, f) => {
    const h = c.narrow ? f.lanes.filter((u) => u.id === f.cards[n].laneId) : f.lanes, x = l.closest(h.map((u) => l.vary(
      { ...f, cards: f.cards.map((g, d) => d === n ? { ...g, laneId: u.id, lag: g.lag ?? 0 } : g) },
      Lt("cards", n, "lag"),
      { constraint: (g) => [Rt(g.cards[n].lag ?? 0, -1e-3), $t(Bt(g), r + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((u) => l.dropTarget("target-" + u, Pt(f, e, u)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop((u) => X(u)) : x.onDrop((u) => X(u));
  });
  return o ? (l) => X(o(l)) : null;
}
const P = 76;
function A(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((o) => t.cards.filter((l) => l.laneId === o.id).length), c = (o) => t.lanes[o].role === "won" ? "#bfe3cf" : t.lanes[o].role === "lost" ? "#e4dcdc" : N[o % N.length];
  let r, i;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let o = P;
    t.lanes.forEach((l, f) => {
      const h = 96 + (a[f] + 1) * 64;
      s.push({ name: "column-" + l.id, x: 2, y: o, width: r - 4, height: h, fill: R(c(f), 0.6), line: R(c(f), 0.1) });
      const x = (r - 16) * 0.36;
      s.push({ name: "lane-" + l.id, x: 8, y: o + 6, width: x, height: 36, text: l.label, fill: c(f), fontSize: 15 }), s.push({ name: "caption-" + l.id, x: 8 + x + 6, y: o + 6, width: r - 16 - x - 6, height: 56, text: mt(t, l.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((u) => u.laneId === l.id).forEach((u, g) => s.push({ name: "card-" + u.id, x: 8, y: o + 72 + g * 64, width: r - 16, height: 56, text: St(t, u.id), fontSize: 15 })), o += h + 10;
    }), i = o;
  } else {
    const f = 116 + (Math.max(...a) + 1) * 88;
    t.lanes.forEach((h, x) => {
      const u = x * 244;
      s.push({ name: "column-" + h.id, x: u + 2, y: P, width: 240, height: f, fill: R(c(x), 0.6), line: R(c(x), 0.1) }), s.push({ name: "lane-" + h.id, x: u + 8, y: P + 6, width: 228, height: 58, text: h.label, fill: c(x), fontSize: 16 }), s.push({ name: "caption-" + h.id, x: u + 8, y: P + 66, width: 228, height: 48, text: mt(t, h.id), fill: "transparent", lineWidth: 0, fontSize: 15 }), t.cards.filter((g) => g.laneId === h.id).forEach((g, d) => s.push({ name: "card-" + g.id, x: u + 8, y: P + 116 + d * 88, width: 228, height: 76, text: St(t, g.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, i = P + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: Mn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: I(t, e, r) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: r, height: i };
}
const J = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, ht(t)), I = (t, e, n) => 4 + (n - 8) * t.forecast.target / J(t, e);
function lt(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function Un(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = lt(J(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function St(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + $(n.amount, t.forecast.currency);
}
function Vn(t, e) {
  const { width: n } = A(t, e.layout), s = t.forecast.target, a = ht(t), c = J(t, e.layout), r = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: p.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? p.accept : p.bar },
    { t: "line", x1: I(t, e.layout, n), y1: 36, x2: I(t, e.layout, n), y2: 62, color: p.ink, width: 2 },
    { t: "rect", x: I(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: p.ink, role: "edge-target" },
    { t: "text", x: I(t, e.layout, n), y: 72, text: "Target " + $(s, t.forecast.currency), color: p.ink, size: 14, anchor: "middle" }
  ];
}
const Jn = {
  laneCues: !0,
  places: (t, e) => A(t, e),
  notes: (t, e, n, s) => ut(A(t, e).parts, t, n, s),
  editsBetween: V,
  layer: (t) => ct(t, Vn),
  chooser(t, e, n, s = {}) {
    const a = Tt(t, e).map((c) => zt(t, e, c.id));
    return a.length < 2 ? null : Ct(U(t, "card-" + e, n, (c) => K(A(c, s).parts), (c, r) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), t, e, A(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = A(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !b(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = pn(t, e, i.id);
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
    const a = A(t, s), c = a.parts.find((h) => h.name === "handle-target"), r = J(t, s), i = lt(r), o = r / (a.width - 8), l = { ...s, gaugeScale: r }, f = xn(t, { field: "target" });
    return (h) => {
      const x = t.forecast.target + Math.round((h.x - n.x - c.x) * o / i) * i, u = Math.min(f.max, Math.max(i, x));
      return { next: { ...t, forecast: { ...t.forecast, target: u } }, layout: l, ...u !== x && { clampedReason: u < x ? f.reasons.max : "A target is at least " + $(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: Un,
  label: (t, e) => e === "handle-target" ? "Target, " + $(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + $(lt(J(t)), t.forecast.currency) + "." : null
}, L = 48, C = 960, Z = 900;
function T(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, r = [], i = [], o = t.lanes.map((u) => t.cards.filter((g) => g.laneId === u.id).length);
  let l, f;
  if (n) {
    l = Math.max(300, e.width ?? 390);
    let u = L + c / a * Z;
    t.lanes.forEach((g, d) => {
      const y = Math.max(100 + (o[d] + 1) * 64, g.allocation / a * Z);
      i.push({ laneId: g.id, start: u, size: y }), u += y;
    }), f = u + 8;
  } else {
    let u = c / a * C;
    for (const g of t.lanes)
      i.push({ laneId: g.id, start: u, size: g.allocation / a * C }), u += g.allocation / a * C;
    l = Math.max(C, u), f = L + 100 + (Math.max(...o) + 1) * 64;
  }
  t.lanes.forEach((u, g) => {
    const { start: d, size: y } = i[g], m = N[g % N.length], M = n ? { x: 2, y: d + 1, width: l - 4, height: y - 2 } : { x: d + 1, y: L, width: Math.max(4, y - 2), height: f - L }, v = { x: M.x + 5, y: M.y, width: Math.max(10, M.width - 10) };
    r.push({ name: "column-" + u.id, ...M, fill: R(m, 0.6), line: R(m, 0.1) });
    const w = n ? v.width * 0.36 : v.width;
    if (r.push({ name: "lane-" + u.id, x: v.x, y: v.y + 6, width: w, height: 32, text: u.label, fill: m, fontSize: 15 }), r.push({
      name: "caption-" + u.id,
      x: n ? v.x + w + 6 : v.x,
      y: v.y + (n ? 6 : 40),
      width: n ? v.width - w - 6 : v.width,
      height: n ? 50 : 40,
      text: n ? yt(t, u.id).replace(" · ", `
`) : yt(t, u.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12
    }), t.cards.filter((k) => k.laneId === u.id).forEach((k, W) => r.push({
      name: "card-" + k.id,
      x: v.x,
      y: v.y + 100 + W * 64,
      width: v.width,
      height: 56,
      text: k.label + `
` + $(k.amount, t.budget.currency),
      fontSize: 14
    })), g < t.lanes.length - 1) {
      const k = d + y;
      r.push(n ? { name: "handle-" + u.id, x: l - 96, y: k - 22, width: 88, height: 44 } : { name: "handle-" + u.id, x: k - 22, y: L - 6, width: 44, height: 48 });
    }
  });
  const h = i[0], x = i.at(-1);
  for (const [u, g] of [[Gt, h.start], [Kt, x.start + x.size]])
    r.push(n ? { name: u, x: l - 96, y: g - 22, width: 88, height: 44 } : { name: u, x: g - 22, y: L - 6, width: 44, height: 48 });
  return { parts: r, width: l, height: f, segments: i, narrow: n, k: (n ? Z : C) / a };
}
const Gt = "handle-_first", Kt = "handle-_last", _t = (t) => t === Gt ? "start" : t === Kt ? "end" : null;
function jn(t, e) {
  const n = T(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: vn(t), color: p.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const r = n.segments[c], i = a.allocation, o = kn(t, a.id);
    if (n.narrow) {
      const l = r.start + 50, f = 8, h = n.width - 16;
      s.push({ t: "rect", x: f, y: l, w: h, h: 10, rx: 5, color: p.track }), s.push({ t: "rect", x: f, y: l, w: h * o / i || 0, h: 10, rx: 5, color: p.bar }), a.floor !== void 0 && s.push({ t: "line", x1: f + h * a.floor / i, y1: l - 4, x2: f + h * a.floor / i, y2: l + 14, color: p.ink, width: 2 });
    } else {
      const l = n.k, f = L + 86;
      s.push({ t: "rect", x: r.start + 6, y: f, w: r.size - 12, h: 10, rx: 5, color: p.track }), s.push({ t: "rect", x: r.start + 6, y: f, w: Math.max(0, (r.size - 12) * o / i || 0), h: 10, rx: 5, color: p.bar }), a.floor !== void 0 && s.push({ t: "line", x1: r.start + a.floor * l, y1: f - 6, x2: r.start + a.floor * l, y2: f + 16, color: p.ink, width: 2 }), a.cap !== void 0 && r.start + a.cap * l <= n.width && s.push({ t: "line", x1: r.start + a.cap * l, y1: f - 6, x2: r.start + a.cap * l, y2: f + 16, color: p.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const l = r.start + r.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: l, x2: n.width - 2, y2: l, color: p.ink, width: 2 } : { t: "line", x1: l, y1: L, x2: l, y2: n.height, color: p.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: p.ink } : { t: "rect", x: l - 4, y: L + 2, w: 8, h: 30, rx: 4, color: p.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const c = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: p.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: L + 2, w: 8, h: 30, rx: 4, color: p.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((c) => c.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : L - 12,
      text: e.clamp.text,
      color: p.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const Ut = (t, e) => Math.round(t / e) * e, Yn = {
  laneCues: !0,
  notes: (t, e, n, s) => ut(T(t, e).parts, t, n, s),
  editsBetween: V,
  label: Nt,
  places(t, e) {
    const { parts: n, width: s, height: a } = T(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => ct(t, jn),
  chooser(t, e, n, s = {}) {
    const a = Tt(t, e).map((c) => zt(t, e, c.id));
    return a.length < 2 ? null : Ct(U(t, "card-" + e, n, (c) => K(T(c, s).parts), (c, r) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), t, e, T(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = T(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !b(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = yn(t, e, i.id);
      return o ? { laneId: i.id, reason: o } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = _t(e);
    if (a) return qn(t, a, e, n, s);
    const c = e.slice(7), r = t.lanes.findIndex((d) => d.id === c), i = t.lanes[r + 1];
    if (r < 0 || !i) return null;
    const o = mn(t, { laneId: c }), l = t.budget.step, f = (d) => {
      const y = Math.min(o.max, Math.max(o.min, Ut(d, l)));
      return wt(t, i.id, c, y);
    }, h = T(t, s), x = h.narrow ? Z / t.budget.total : C / t.budget.total, u = h.parts.find((d) => d.name === e), g = U(t, e, n, (d) => K(T(d, s).parts), (d) => d.varyFunc([0], ([y]) => wt(t, i.id, c, y), { constraint: (y) => [
      ...qt([o.min, y.lanes[r].allocation - t.lanes[r].allocation, o.max])
    ] }));
    return (d) => {
      const m = (h.narrow ? d.y - n.y - u.y : d.x - n.x - u.x) / x, M = g?.(d), v = M ? M.lanes[r].allocation - t.lanes[r].allocation : m, w = { next: f(v) };
      return m > o.max + l / 2 ? { ...w, clampedReason: o.reasons.max } : m < o.min - l / 2 ? { ...w, clampedReason: o.reasons.min } : w;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = _t(e);
    if (s) {
      const f = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (f ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], c = t.lanes.findIndex((f) => f.id === a), r = t.lanes[c + 1];
    if (c < 0 || !r) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", o = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: o } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: o }];
  }
};
function qn(t, e, n, s, a) {
  const c = T(t, a), r = c.parts.find((h) => h.name === n);
  if (!r) return null;
  const i = t.budget.total, o = t.budget.step, l = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, f = wn(t);
  return (h) => {
    const x = (c.narrow ? h.y - s.y - r.y : h.x - s.x - r.x) / c.k, u = i + Ut(e === "end" ? x : -x, o), g = rt(t, u, e);
    if (typeof g != "string") return { next: g, layout: l };
    const d = rt(t, Math.min(f.max, Math.max(f.min, u)), e);
    return { next: typeof d == "string" ? t : d, layout: l, clampedReason: g, refusal: g };
  };
}
const Vt = { "launch-plan": ot, "hiring-plan": ot, pipeline: Jn, budget: Yn };
function ne(t, e) {
  Vt[t] = e;
}
function ee(t) {
  const e = Vt[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function ie(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  le as amountLimits,
  ce as amountOf,
  ii as amountRules,
  he as bandOf,
  si as behaviourEditsBetween,
  ie as boardLayoutFor,
  yt as budgetCaption,
  kn as budgetCommitted,
  vn as budgetHeader,
  Yn as budgetKit,
  T as budgetLayout,
  mn as budgetLimits,
  yn as budgetRefusal,
  ai as budgetRules,
  ri as budgetShiftLimits,
  oi as budgetShiftRefusal,
  wn as budgetTotalBounds,
  li as budgetTotalFixed,
  wi as byOrder,
  on as cascadeStops,
  ki as checkNest,
  Mi as checkNestMove,
  hn as checkTime,
  Et as clockOf,
  ct as createBoardLayer,
  ue as currencyOf,
  it as dateName,
  de as dayFromWords,
  Zt as dayMap,
  O as dayWords,
  fe as days,
  ge as downstreamTasks,
  sn as dragTaskEdge,
  xe as earliestLaunch,
  pe as edgeValues,
  vi as extend,
  me as extendWorkshopEdits,
  ye as goLiveSample,
  Nt as handleLabel,
  U as headlessDrag,
  we as hireLagFor,
  dn as hireStarts,
  ke as hiringPlanRules,
  Me as hiringPlanSample,
  un as holdOthers,
  b as inside,
  Wi as isOrderKey,
  ji as isOrgChart,
  B as isoAt,
  ve as isoTime,
  ee as kitFor,
  We as launchDayOn,
  Bt as launchFinish,
  nn as launchHard,
  Se as launchIndex,
  D as launchLayout,
  Ot as launchLinkRefusal,
  Dt as launchLinkTargets,
  bt as launchOverrun,
  _e as launchPlanCaption,
  ot as launchPlanKit,
  Qt as launchPlanLimits,
  Le as launchPlanRefusal,
  Re as launchPlanRules,
  $e as launchPlanSample,
  Te as launchTaskText,
  ze as launchTooEarly,
  p as layerInk,
  ln as legalRuns,
  H as lineWord,
  $ as money,
  At as moneyExact,
  Ae as monthNames,
  xt as moveLaunch,
  an as movePlanStart,
  Si as nestAlias,
  _i as nestAreas,
  Yi as nestAxes,
  Li as nestCardText,
  Ri as nestDepth,
  $i as nestDrags,
  Ti as nestEmptyDrop,
  zi as nestFamily,
  Ai as nestKids,
  Oi as nestLegal,
  Ei as nestMeasure,
  Fi as nestMeasureWords,
  Pi as nestPlace,
  qi as nestQuadrants,
  Bi as nestRoots,
  Ci as nestRules,
  Xi as nestScores,
  Di as nestSentence,
  Ni as nestSubtree,
  Oe as nextCardId,
  Ee as nextMonday,
  Fe as noteNumbers,
  at as offsetOf,
  Ii as orderBetween,
  Hi as orderKeys,
  Pe as ownField,
  ut as partNotes,
  K as partsGeometry,
  en as pastTheLine,
  mt as pipelineCaption,
  ht as pipelineForecast,
  Mn as pipelineGauge,
  Jn as pipelineKit,
  A as pipelineLayout,
  xn as pipelineLimits,
  pn as pipelineRefusal,
  ci as pipelineRules,
  hi as planBudgetMove,
  Be as planDrags,
  Ce as planEdit,
  De as planFixed,
  Ne as planLaunchPlanMove,
  ui as planPipelineMove,
  Ie as planProblem,
  di as planSamples,
  He as planStartBy,
  rn as planWeeksProblem,
  Ge as planWords,
  Ke as presetRules,
  Zi as quadrantOf,
  Ue as readClock,
  Ve as readNoteNumbers,
  ne as registerBoardKit,
  Gi as registerNestPlus,
  Je as renamedNumbers,
  re as renderLayerShapes,
  fi as restoreWorkshop,
  Ki as roleOf,
  je as runwayCap,
  Ye as runwayHeader,
  fn as runwayMonths,
  gn as runwayWords,
  gi as sampleBudget,
  qe as sampleLaunchPlan,
  xi as samplePipeline,
  G as scheduleLaunch,
  Qi as scoreBoard,
  bi as scoresIn,
  wt as shiftBudget,
  F as shortDate,
  j as snapStep,
  cn as startHandle,
  Q as startHandleCard,
  Ui as tidyKeys,
  Xe as timeFamily,
  Ze as timeRuleKindIds,
  Qe as timeSentence,
  R as tint,
  Ft as tryTask,
  pi as validateBudget,
  be as validateHiringPlan,
  ti as validateLaunchPlan,
  Vi as validateNest,
  mi as validatePipeline,
  pt as weekdayAt,
  ni as weekendAt,
  rt as withBudgetTotal,
  Pt as withLink,
  Xt as withPlanStart,
  tn as withTaskValue,
  V as workshopEditsBetween
};
