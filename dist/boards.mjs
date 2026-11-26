import { Vec2 as St, getElementPositionCheap as hn, translate as dn, dragSpecToBehavior as un, param as Nt, moreThan as Ht, lessThan as Gt, inOrder as fn } from "./dragology.mjs";
import { workshopOverrideLine as It, appearanceEditsBetween as gn, appearanceLook as pn, f as xn, createBoardLayer as mt, laneColors as H, H as tt, layerInk as w, workshopDestinations as Kt, workshopCandidate as Vt, L as _t } from "./workshop-model.mjs";
import { renderLayerShapes as Le } from "./workshop-model.mjs";
import { startHandleCard as it, dayWords as L, scheduleLaunch as z, e as Xt, m as T, dateName as ct, lineWord as X, withPlanStart as mn, offsetOf as ut, launchLinkRefusal as Ut, snapStep as q, dayMap as yn, clockOf as Yt, waitsRefusal as Wt, tryTask as Jt, launchPlanLimits as wn, launchOverrun as kn, withTaskValue as G, hireStarts as jt, isoAt as D, launchHard as Rt, pastTheLine as Mn, dragTaskEdge as vn, moveLaunch as Lt, movePlanStart as Sn, planWeeksProblem as _n, cascadeStops as Wn, legalRuns as Rn, startHandle as Ln, checkTime as $n, holdOthers as Tn, weekdayAt as $t, shortDate as F, brokenWaits as On, runwayMonths as An, runwayWords as zn, launchFinish as Zt, withLink as qt } from "./workshop-plans.mjs";
import { a as Te, d as Oe, bandOf as Ae, c as ze, dayFromWords as Ee, g as Pe, downstreamTasks as Ce, earliestLaunch as Fe, edgeValues as Be, extendWorkshopEdits as De, goLiveSample as Ne, hireLagFor as He, hiringPlanRules as Ge, hiringPlanSample as Ie, isoTime as Ke, landPlanNote as Ve, launchDayOn as Xe, launchIndex as Ue, launchPlanCaption as Ye, launchPlanRefusal as Je, launchPlanRules as je, launchPlanSample as Ze, launchTaskText as qe, launchTooEarly as Qe, monthNames as be, n as ti, nextMonday as ni, b as ei, o as ii, planDrags as si, planEdit as ai, planFixed as ri, planLaunchPlanMove as oi, planPastRule as li, planProblem as ci, planProblems as hi, planStartBy as di, planWords as ui, presetRules as fi, readClock as gi, f as pi, r as xi, runwayCap as mi, runwayHeader as yi, sampleLaunchPlan as wi, timeFamily as ki, timeProblems as Mi, timeRuleKindIds as vi, timeSentence as Si, validateHiringPlan as _i, validateLaunchPlan as Wi, weekendAt as Ri } from "./workshop-plans.mjs";
import Q from "react";
import { withBudgetTotal as ft, pipelineForecast as yt, budgetOver as wt, pipelineLimits as En, pipelineRefusal as Pn, pipelineCaption as Tt, pipelineStageOver as ht, budgetLimits as Cn, budgetRefusal as Fn, budgetTotalBounds as Bn, budgetCaption as Dn, shiftBudget as Ot, budgetCommitted as Nn } from "./workshop-rules.mjs";
import { amountRules as $i, behaviourEditsBetween as Ti, budgetRules as Oi, budgetShiftLimits as Ai, budgetShiftRefusal as zi, budgetTotalFixed as Ei, pipelineRules as Pi, planBudgetMove as Ci, planPipelineMove as Fi, planSamples as Bi, restoreWorkshop as Di, sampleBudget as Ni, samplePipeline as Hi, validateBudget as Gi, validatePipeline as Ii } from "./workshop-rules.mjs";
import { byOrder as Vi, checkNest as Xi, checkNestMove as Ui, extend as Yi, isOrderKey as Ji, nestAlias as ji, nestAreas as Zi, nestCardText as qi, nestDepth as Qi, nestDrags as bi, nestEmptyDrop as ts, nestFamily as ns, nestKids as es, nestLegal as is, nestMeasure as ss, nestMeasureWords as as, nestPlace as rs, nestRoots as os, nestRules as ls, nestSentence as cs, nestSubtree as hs, orderBetween as ds, orderKeys as us, registerNestPlus as fs, roleOf as gs, tidyKeys as ps, validateNest as xs } from "./workshop-nest.mjs";
import { isOrgChart as ys, nestAxes as ws, nestQuadrants as ks, nestScores as Ms, quadrantOf as vs, scoreBoard as Ss, scoresIn as _s } from "./workshop-nest-plus.mjs";
import { GRID_MAX_STAMPS as Rs, GRID_MAX_TILES as Ls, GRID_TRAY as $s, MIN_CELL as Ts, PX_PER_INCH as Os, bingoSample as As, cellAt as zs, cellBox as Es, cellSize as Ps, cellSizeProblem as Cs, checkGrid as Fs, defaultSpan as Bs, fits as Ds, flashcardSample as Ns, freeCells as Hs, gridCaption as Gs, gridCardText as Is, gridFamily as Ks, gridFromNote as Vs, gridNeeds as Xs, gridNoteText as Us, gridOverridable as Ys, gridPages as Js, gridPrintProblems as js, gridRuleSentence as Zs, gridRules as qs, gridSamples as Qs, gridSheet as bs, gridTileTypes as ta, inBounds as na, occupancy as ea, pageName as ia, pageSize as sa, printSize as aa, readingOrder as ra, reflow as oa, spanOf as la, tileName as ca, tileTypeOf as ha, tileWords as da, usedCells as ua, validateGrid as fa, worksheetSample as ga } from "./workshop-grid.mjs";
function Y(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return Q.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ Q.createElement("g", { id: s.name, transform: dn(s.x, s.y) }, /* @__PURE__ */ Q.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ Q.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function J(t, e, n, s, a) {
  let c;
  const i = {
    draggable: (r) => (c ?? (c = r.d), s(r.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: St(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!hn(i, t) || !c) return null;
  const o = un(a(c, t), i);
  return (r) => o({ pointer: St(r.x, r.y) }).dropState;
}
const at = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Qt(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((l) => l.id === n).laneId;
  return (l) => {
    const i = t(l);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const o = s.find((r) => r.name.startsWith("column-") && r.name !== "column-" + c && at(r, l));
    return o && a.find((r) => r.cards.find((u) => u.id === n).laneId === o.name.slice(7)) || i;
  };
}
function bt(t, e) {
  const n = It(e);
  return n ? t + `
` + n : t;
}
const E = { fill: "#fde3d7", line: "#c2410c", ink: "#9a3412" };
function A(t, e) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function j(t, e) {
  if (t.clock && e.clock && t.clock.origin !== e.clock.origin) {
    const i = mn(t, ut(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...j(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (u) => JSON.stringify(u.lanes.map((m) => m.allocation)), o = ["end", "start"].map((u) => ({ edge: u, made: ft(t, e.budget.total, u) })).filter((u) => typeof u.made != "string"), r = o.find((u) => i(u.made) === i(e)) ?? o[0];
    if (r) return [{ kind: "set_budget_total", amount: e.budget.total, ...r.edge === "start" && { edge: "start" } }, ...j(r.made, e)];
  }
  const n = [];
  t.hiring && e.hiring && t.hiring.weeks !== e.hiring.weeks && n.push({ kind: "set_plan_weeks", weeks: e.hiring.weeks });
  const s = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of e.cards) {
    const o = s.get(i.id), r = { id: i.id };
    if (!o) {
      n.push({
        kind: "add_card",
        lane: { id: i.laneId },
        label: i.label,
        ...i.duration !== void 0 && { duration: i.duration },
        ...i.lag && { lag: i.lag },
        ...i.dependsOn && { waitsOn: i.dependsOn.map((m) => ({ id: m })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    o.label !== i.label && n.push({ kind: "rename_card", card: r, label: i.label });
    const u = n.length;
    for (const m of o.dependsOn ?? []) i.dependsOn?.includes(m) || n.push({ kind: "unlink_tasks", card: r, waitsOn: { id: m } });
    for (const m of i.dependsOn ?? []) o.dependsOn?.includes(m) || n.push({ kind: "link_tasks", card: r, waitsOn: { id: m } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: r, lane: { id: i.laneId } }), (n.length > u && i.duration !== void 0 && n.slice(u).some((m) => m.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: r, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: r, amount: i.amount });
  }
  for (const i of t.cards) e.cards.some((o) => o.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  e.launch && t.launch?.day !== e.launch.day && n.push({ kind: "set_launch_day", day: e.launch.day }), e.hiring?.funding && t.hiring?.funding?.day !== e.hiring.funding.day && n.push({ kind: "set_funding", day: e.hiring.funding.day }), e.forecast && t.forecast?.target !== e.forecast.target && n.push({ kind: "set_target", amount: e.forecast.target });
  const a = e.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((o) => o.id === i.id)?.allocation ?? 0) })), c = a.filter((i) => i.by < 0), l = a.filter((i) => i.by > 0);
  for (const i of l)
    for (const o of c) {
      const r = Math.min(i.by, -o.by);
      r <= 0 || (n.push({ kind: "shift_budget", from: { id: o.id }, to: { id: i.id }, amount: r }), i.by -= r, o.by += r);
    }
  for (const i of e.lanes) {
    const o = t.lanes.find((r) => r.id === i.id);
    o && o.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label }), o && o.capacity !== i.capacity && n.push({ kind: "set_lane_capacity", lane: { id: i.id }, capacity: i.capacity ?? null });
  }
  return t.title !== e.title && n.push({ kind: "rename_workshop", title: e.title }), n.push(...gn(t, e)), n;
}
function Hn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${T(yt(t), e)} of ${T(t.forecast?.target ?? 0, e)}`;
}
function Gn(t) {
  const e = t.lanes.filter((n) => wt(t, n.id) > 0).length;
  return `${Xt(t.budget?.total ?? 0, t.budget?.currency)} · ` + (e ? `${e} ${e === 1 ? "team" : "teams"} over budget` : "balanced");
}
function tn(t, e) {
  return t.cards.filter((n) => Ut(t, e, n.id) === null).map((n) => n.id);
}
function In(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function kt(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", l = s.fontSize ?? 14;
  return t.map((i) => {
    const o = pn(e.appearance, i.name, i), r = { ...i, ...o, height: o.height ?? i.height }, u = r.name.startsWith("handle-"), m = r.text ?? "", h = r.name.startsWith("lane-") ? xn(m, r.fontSize ?? l, r.width - 12, r.height - 6) : null, f = h?.text ?? m;
    return { options: {
      id: r.name,
      text: f,
      name: e.cards.find((g) => "card-" + g.id === r.name)?.label ?? m,
      xPos: n.x + r.x,
      yPos: n.y + r.y,
      width: r.width,
      height: r.height,
      shapeHint: "rectangle",
      vectorPath: r.vectorPath ?? `M 0 0 H ${r.width} V ${r.height} H 0 Z`,
      // A tile's picture (a grid sheet's image, QR code or sticker), with the picture's own size so it is drawn true.
      ...r.image && { image: r.image, imageOrigWidth: r.imageOrigWidth ?? r.width, imageOrigHeight: r.imageOrigHeight ?? r.height },
      ...r.borderStyle && { borderStyle: r.borderStyle },
      ...r.textXAlign && { textXAlign: r.textXAlign },
      ...r.textYAlign && { textYAlign: r.textYAlign },
      backgroundColor: u ? "transparent" : r.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: r.ink ?? a,
      borderColor: r.line ?? c,
      borderWidth: u ? 0 : r.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      ...r.weight && { fontWeight: r.weight },
      fontSize: h?.fontSize ?? In(f, r.fontSize ?? l, r.width - 12, r.height - 6)
    }, relationships: { associations: [] } };
  });
}
function nn(t, e) {
  const n = e.slice(7), s = it(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${L(t, z(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Xt(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${T(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${ct(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${ct(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${ct(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${X(t).charAt(0).toUpperCase() + X(t).slice(1)}, ${L(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const l = t.lanes.findIndex((i) => i.id === n);
  return l >= 0 && t.lanes[l + 1] ? `Divider between ${t.lanes[l].label} and ${t.lanes[l + 1].label}. Left and Right move money.` : null;
}
const en = "#c2410c", rt = "handle-_first", ot = "handle-_last", Kn = 32, At = 44, st = 20, Vn = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function C(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = z(t), c = !s && Rt(t) && t.cards.some((k) => k.override), l = s ? t.hiring.weeks * 7 : Rt(t) ? Math.max(t.launch.day, c ? Math.max(...[...a.values()].map((k) => Math.ceil(k.to))) : 0) : Math.ceil(t.launch.day * 4 / 3), i = Mn(t), o = [], r = /* @__PURE__ */ new Map(), u = n ? 8 : 168, m = n ? 88 : u + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), f = e.dayWidth ? Math.max(h, Math.ceil(m + l * e.dayWidth)) : h, g = e.maxWidth !== void 0 && f > e.maxWidth ? Math.max(h, Math.floor(e.maxWidth)) : f, d = e.dayWidth && g === f ? e.dayWidth : (g - m) / l, p = (k) => H[t.lanes.findIndex((M) => M.id === k) % H.length], x = (k, M) => {
    const R = t.cards.find((K) => K.id === k), v = a.get(k), W = { x: u + v.from * d, y: M, width: (v.to - v.from) * d, height: n ? At : Kn };
    r.set(k, W);
    const I = i.has(k);
    if (o.push({
      name: "card-" + k,
      ...W,
      text: n ? "" : s ? R.label : `${R.label} · ${R.duration}d`,
      fill: I ? "#fde3d7" : n ? p(R.laneId) : s ? A(p(R.laneId), 0.45) : "#fffdf6",
      line: I || v.critical && !s ? en : "#667872",
      lineWidth: I || v.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const K = Vn(n, W.width), lt = n ? 44 : 22, Mt = W.y + W.height / 2 - 22, vt = n ? Math.max(-12, W.x - lt) : W.x - lt;
      o.push({ name: Ln(k), x: vt, y: Mt, width: Math.max(24, W.x + K - vt), height: 44 }), o.push({ name: "handle-" + k, x: W.x + W.width - K, y: Mt, width: K + lt, height: 44 });
    }
  };
  let y, _, S;
  if (n) {
    const k = (g - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, R) => {
      const v = 8 + R * (k + 8);
      o.push({ name: "column-" + M.id, x: v, y: 30, width: k, height: 72, fill: A(p(M.id), 0.6), line: A(p(M.id), 0.1) }), o.push({ name: "lane-" + M.id, x: v + 4, y: 34, width: k - 8, height: 28, text: M.label, fill: p(M.id), fontSize: 14 }), o.push({ name: "caption-" + M.id, x: v + 4, y: 64, width: k - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), S = 124, _ = 130, y = 138;
    for (const M of t.cards)
      x(M.id, y + st), y += At + st;
  } else {
    S = 48, _ = 56, y = _;
    for (const k of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === k.id), R = Math.max(92, M.length * 44 + 20);
      o.push({ name: "column-" + k.id, x: 0, y, width: g, height: R, fill: A(p(k.id), 0.65), line: A(p(k.id), 0.1) }), o.push({ name: "lane-" + k.id, x: 8, y: y + 8, width: u - 24 - tt, height: 32, text: k.label, fill: p(k.id), fontSize: 15 }), o.push({ name: "caption-" + k.id, x: 8, y: y + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, W) => x(v.id, y + 10 + W * 44)), y += R + 4;
    }
  }
  return s ? t.hiring.funding && !n && o.push({ name: "handle-funding", x: u + t.hiring.funding.day * d - 22, y: 4, width: 44, height: 44 }) : o.push({ name: "handle-launch", x: u + t.launch.day * d - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && o.push({ name: rt, x: u - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && o.push({ name: ot, x: u + l * d - 22, y: 8, width: 44, height: 44 }), { parts: o, width: g, height: y + 8, narrow: n, x0: u, dayW: d, gridTop: _, axisY: S, bars: r };
}
function Xn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Un(t, e, n = !1) {
  const s = t.x + t.width, a = Math.max(t.x + 4, s - 10), c = e.y + e.height / 2 > t.y + t.height / 2, l = c ? t.y + t.height : t.y, i = e.y + e.height / 2;
  if (n) {
    const o = e.x + Math.min(6, e.width / 2), r = c ? e.y : e.y + e.height, u = c ? r - st / 2 : r + st / 2;
    return { d: `M ${a} ${l} V ${u} H ${o} V ${r}`, arrow: { x: o, y: r, angle: c ? 90 : -90, note: { x: e.x - 6, y: i - 14 } } };
  }
  return { d: `M ${a} ${l} V ${i} H ${e.x}`, arrow: { x: e.x, y: i, angle: 0 } };
}
const Yn = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function Jn(t, e) {
  const n = C(t, e.layout), s = t.kind === "hiring-plan", a = z(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), l = Yt(t), i = [];
  if (l?.workdays)
    for (let h = 0; h < c; h++) $t(l.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? w.canvasTrack : w.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (l && h.on && h.kind === "blackout") {
    const f = ut(l.origin, h.start), g = ut(l.origin, h.end) + 1, d = n.x0 + Math.max(0, f) * n.dayW, p = (Math.min(c, g) - Math.max(0, f)) * n.dayW;
    if (p <= 0) continue;
    i.push({ t: "rect", x: d, y: n.gridTop, w: p, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let x = d; x < d + p; x += 10) i.push({ t: "line", x1: x, y1: n.gridTop, x2: Math.min(d + p, x + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: n.gridTop + 22, text: h.label + " · " + F(h.start) + "–" + F(h.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const f = n.x0 + h * n.dayW, g = l ? $t(l.origin, h) === 1 : h % 7 === 0;
    if (!g && n.dayW < 6) continue;
    i.push({ t: "line", x1: f, y1: n.gridTop, x2: f, y2: n.height - 8, color: n.narrow ? g ? w.canvasWeek : w.canvasFaint : g ? w.week : w.faint, width: g ? 1 : 0.5 });
    const d = s && l && D(l.origin, h).slice(8) <= "07" && g, p = l ? s ? d ? F(D(l.origin, h)).replace(/ \d+$/, "") : "" : F(D(l.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    g && p && (!l || s || n.dayW * 7 > 44) && i.push({ t: "text", x: f + 3, y: n.axisY, text: p, color: w.canvasInk, size: 12 });
  }
  const o = new Set(On(t).map((h) => h.from + ">" + h.to));
  for (const h of t.cards) {
    for (const p of h.dependsOn ?? []) {
      const x = n.bars.get(p), y = n.bars.get(h.id);
      if (!x || !y) continue;
      const _ = a.get(p).critical && a.get(h.id).critical, S = t.cards.find((M) => M.id === p).label, k = o.has(p + ">" + h.id);
      i.push({
        t: "path",
        ...Un(x, y, n.narrow),
        color: k ? w.refuse : _ ? en : w.ink,
        width: k || _ ? 2 : 1.5,
        ...k && { dash: "5 4", role: "broken-" + p + "-" + h.id },
        unlink: { cardId: h.id, waitsOn: p, label: k ? `Remove the link: ${h.label} waits on ${S}, and starts before it ends` : `Remove the link: ${h.label} waits on ${S}` }
      });
    }
    const f = It(h), g = a.get(h.id), d = n.bars.get(h.id);
    if (s) {
      const p = t.hiring.bands.find((_) => _.id === h.band), x = d.x + d.width, y = n.x0 + c * n.dayW;
      y > x && i.push({ t: "rect", x, y: d.y + d.height / 2 - 3, w: y - x, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(x + 6, y - 120),
        y: n.narrow ? d.y - 6 : d.y + d.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + F(D(l.origin, jt(t, h.id))) + (p ? " · " + T(p.monthly, t.hiring.currency) + "/mo" : "") + (f ? " · " + f : ""),
        color: f ? E.ink : w.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    if (n.narrow) {
      const p = `${h.label} · ${h.duration}d` + (f ? " · moved anyway" : ""), x = Yn(p, g.critical), y = d.x + 2 + x <= n.width - 8;
      i.push({
        t: "text",
        x: y ? d.x + 2 : Math.max(8 + x, Math.min(n.width - 8, d.x + d.width)),
        anchor: y ? "start" : "end",
        y: d.y - 7,
        text: p,
        color: w.canvasInk,
        size: 13,
        bold: g.critical,
        halo: w.halo,
        role: "words-" + h.id
      });
    }
    g.critical || i.push({ t: "text", x: d.x + d.width + (n.narrow ? 48 : 24), y: d.y + d.height / 2 + 4, text: "+" + g.slack + "d", color: n.narrow ? w.canvasInk : w.ink, size: 12, role: "slack-" + h.id }), f && !n.narrow && i.push({ t: "text", x: d.x + d.width + (g.critical ? 24 : 64), y: d.y + d.height / 2 + 4, text: f, color: E.ink, size: 12, halo: w.halo, role: "mark-" + h.id });
  }
  if (l && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && l) {
    const h = n.height + 2;
    i.push({ t: "text", x: n.x0, y: h, text: "Starts " + L(t, 0), color: w.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const f = s ? "Ends " + L(t, t.hiring.weeks * 7 - 1) : X(t).charAt(0).toUpperCase() + X(t).slice(1) + " " + L(t, t.launch.day), g = n.x0 + (s ? c : t.launch.day) * n.dayW;
    i.push({ t: "text", x: g, y: h, text: f, color: s ? w.ink : w.launch, size: 11, bold: !0, anchor: "end", role: "span-end" });
  }
  if (!(s && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && e.focus !== h.id) continue;
    const f = n.bars.get(h.id), g = f.y + 6, d = f.height - 12, [p, x] = n.narrow ? [f.x - 10, f.x + f.width + 4] : [f.x + 3, f.x + f.width - 9], y = n.narrow ? 0.55 : 0.8;
    i.push(
      { t: "rect", x: p, y: g, w: 6, h: d, rx: 3, color: w.ink, opacity: y, role: "grip-start-" + h.id },
      { t: "rect", x, y: g, w: 6, h: d, rx: 3, color: w.ink, opacity: y, role: "grip-end-" + h.id }
    );
  }
  if (s) {
    const h = An(t), f = t.behaviour?.rules.find((p) => p.on && p.kind === "deadline"), g = f && f.kind === "deadline" && h < f.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + zn(h),
      color: g || e.refused ? w.refuse : w.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = t.hiring.funding;
    if (d && d.day <= c) {
      const p = n.x0 + d.day * n.dayW;
      i.push({ t: "line", x1: p, y1: 26, x2: p, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: p - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), i.push({ t: "text", x: Math.max(p + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + T(d.amount, t.hiring.currency) + " · " + F(D(l.origin, d.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), e.clamp) {
      const p = n.parts.find((x) => x.name === e.clamp.name);
      p && i.push(...Et(n, i, e.clamp.text, p, e.view));
    }
    return i;
  }
  const r = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: r, y1: n.narrow ? 112 : 26, x2: r, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: r - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  const u = Zt(t), m = Math.max(0, ...[...a.values()].map((h) => h.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: l ? "Done " + L(t, Math.ceil(m) - 1) + " · " + X(t) + " " + L(t, t.launch.day) : `Done day ${u} · launch day ${t.launch.day}`,
    color: e.refused ? w.refuse : w.canvasInk,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const h = n.parts.find((f) => f.name === e.clamp.name);
    h && i.push(...Et(n, i, e.clamp.text, h, e.view));
  }
  return i;
}
const b = 13, zt = 16, sn = (t, e) => t * (e ? 0.64 : 0.6), jn = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function Zn(t) {
  const e = t.size ?? 13, n = t.text.length * sn(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function qn(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let dt = null;
function Et(t, e, n, s, a) {
  const c = [...t.bars.values()].map((x) => ({ x: x.x - 4, y: x.y - 3, w: x.width + 8, h: x.height + 6 }));
  for (const x of e)
    x.t === "text" ? c.push(Zn(x)) : x.t === "rect" && c.push({ x: x.x - 2, y: x.y - 2, w: x.w + 4, h: x.h + 4 });
  let l = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, o = t.gridTop + 2, r = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(l, a.x + 8) >= 160 && (l = Math.max(l, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(r, a.y + a.height - 8) - Math.max(o, a.y + 8) >= 40 && (o = Math.max(o, a.y + 8), r = Math.min(r, a.y + a.height - 8)));
  const u = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, m = JSON.stringify([n, u, l, i, o, r, c.map((x) => [x.x, x.y, x.w, x.h].map(Math.round))]);
  if (dt?.key === m) return dt.shapes;
  const h = sn(b, !0), f = Math.floor((i - l) / h), g = /* @__PURE__ */ new Map();
  for (const x of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = qn(n, Math.max(8, Math.floor(f * x)));
    y.length <= 4 && g.set(y.join(`
`), y);
  }
  let d = null;
  for (const x of g.values()) {
    const y = Math.max(...x.map((S) => S.length)) * h, _ = x.length * zt + 2;
    if (!(y > i - l))
      for (let S = o; S + _ <= r; S += 3)
        for (let k = l; k + y <= i; k += 6) {
          const M = { x: k, y: S, w: y, h: _ }, R = Math.max(M.x - u.x, 0, u.x - (M.x + M.w)), v = Math.max(M.y - u.y, 0, u.y - (M.y + M.h)), W = Math.hypot(R, v) + (x.length - 1) * 24;
          d && W >= d.score || c.every((I) => jn(M, I)) && (d = { box: M, lines: x, score: W });
        }
  }
  const p = d ? [{ t: "text", x: d.box.x, y: d.box.y + b - 1, text: n, lines: d.lines, lineHeight: zt, color: w.refuse, size: b, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, t.width - 4),
    y: s.y + 14,
    text: n,
    color: w.refuse,
    size: b,
    anchor: s.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return dt = { key: m, shapes: p }, p;
}
const nt = (t, e = 1, n) => {
  const s = (c, l) => Math.round(c / l) * l, a = { ...t, cards: t.cards.map((c) => {
    const l = c.id === n ? e : 1, i = { ...c, duration: Math.max(l, s(c.duration, l)), lag: Math.max(0, s(c.lag ?? 0, l)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, Pt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Qn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((o) => o.id === i)?.label ?? i, l = [
    ...tn(t, a.id).map((i) => ({
      said: `${a.label} waits on ${c(i)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    })),
    ...(a.dependsOn ?? []).map((i) => ({
      said: `${a.label} stops waiting on ${c(i)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    }))
  ];
  return l.length ? l : `${a.label} has no task it can wait on.`;
}
function bn(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * q(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === rt && t.clock) return [{ kind: "set_plan_start", start: D(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === ot && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = it(e), l = c !== null && t.cards.find((r) => r.id === c);
  if (l) return [{ kind: "set_task", card: { id: l.id }, duration: l.duration - a, lag: (l.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), o = i && t.cards.find((r) => r.id === i[2]);
  return o ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + a }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + a }] : null;
}
const gt = {
  laneCues: !1,
  notes(t, e, n, s) {
    return kt(gt.places(t, e).parts, t, n, s);
  },
  editsBetween: j,
  label: nn,
  places(t, e) {
    const n = Xn(t, C(t, e), (s) => {
      const a = t.cards.filter((l) => l.laneId === s), c = z(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((l) => c.get(l.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => mt(t, Jn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (Pt(t) ? ie : ce)(t, e, a, tn(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = C(t, a);
    for (const g of t.cards) {
      if (g.id === e || !at(c.bars.get(g.id), s)) continue;
      const d = Ut(t, e, g.id);
      return d ? { laneId: g.laneId, reason: d } : null;
    }
    const l = t.cards.find((g) => g.id === e), i = (l.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW), o = (g) => {
      const d = { kind: "set_task", card: { id: e }, lag: g };
      return { edit: d, to: pt(t, d) };
    }, r = q(t), u = z(t).get(e).start - (l.lag ?? 0), m = (g) => Math.max(g, -u);
    if (Pt(t)) {
      const g = z(t).get(e), d = Math.round(g.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), p = (l.lag ?? 0) + yn(Yt(t)).idx(d) - g.start, x = m(Math.round(p / r) * r);
      if (x < -r && l.dependsOn?.length) return { laneId: l.laneId, reason: Wt(t, e, x), override: o(x) };
      const y = Jt(t, e, { lag: Math.max(0, x) });
      return typeof y == "string" ? { laneId: l.laneId, reason: y, lands: !0, override: o(Math.max(0, x)) } : null;
    }
    const h = m(Math.round(i / r) * r);
    if (h < -r && l.dependsOn?.length) return { laneId: l.laneId, reason: Wt(t, e, h), override: o(h) };
    const f = wn(t, { cardId: e, field: "lag" });
    return i > f.max ? { laneId: l.laneId, reason: kn(G(t, { cardId: e, field: "lag" }, i), e) ?? f.reasons.max, override: o(i) } : null;
  },
  handleDrag(t, e, n, s) {
    const a = C(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = it(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? Ct(t, c, "start", n, a, e) : null;
    const l = e.slice(7);
    return t.cards.some((i) => i.id === l) ? Ct(t, l, "end", n, a, e) : e === "handle-launch" ? se(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? oe(t, n, a) : e === rt && t.clock ? ae(t, n, a, s) : e === ot && t.hiring ? re(t, n, a, s) : null;
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(t, e, n) {
    const s = C(t, n);
    return s.narrow || e.x < s.x0 ? null : (e.x - s.x0) / s.dayW;
  },
  keyEdit: bn,
  overrideWords: pt,
  keyChoices: Qn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = it(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function Ct(t, e, n, s, a, c) {
  const l = a.parts.find((i) => i.name === c);
  return l ? (i) => {
    const o = vn(t, e, n, (i.x - s.x - l.x) / a.dayW);
    if (o.next) return { next: o.next, ...o.reason && { clampedReason: o.reason } };
    const r = o.values.lag, u = te(t, e, r) + ne(t, e, r, o.values.duration) - 1;
    return {
      next: ee(t, e, o.values) ?? t,
      clampedReason: o.refusal,
      refusal: o.refusal,
      override: {
        edit: { kind: "set_task", card: { id: e }, lag: r, duration: o.values.duration },
        to: n === "start" || t.kind === "hiring-plan" ? pt(t, { kind: "set_task", card: { id: e }, lag: r, duration: o.values.duration }) : "to end " + L(t, u)
      }
    };
  } : null;
}
function pt(t, e) {
  if (e.kind !== "set_task") return;
  const n = typeof e.card == "object" && e.card && "id" in e.card ? e.card.id : null, s = n ? t.cards.find((i) => i.id === n) : void 0;
  if (!s) return;
  let a = t;
  e.lag !== void 0 && (a = G(a, { cardId: s.id, field: "lag" }, e.lag)), e.duration !== void 0 && (a = G(a, { cardId: s.id, field: "duration" }, e.duration));
  const c = z(a).get(s.id);
  return t.kind === "hiring-plan" && t.clock ? "to start work " + L(a, jt(a, s.id)) + " (recruiting from " + L(a, c.from) + ")" : (e.lag === void 0 || e.lag === (s.lag ?? 0)) && e.duration !== void 0 && e.duration !== s.duration ? "to end " + L(a, c.to - 1) : "to start " + L(a, c.from);
}
function te(t, e, n) {
  return z(G(t, { cardId: e, field: "lag" }, n)).get(e).from;
}
function ne(t, e, n, s) {
  const a = z(G(G(t, { cardId: e, field: "lag" }, n), { cardId: e, field: "duration" }, s)).get(e);
  return a.to - a.from;
}
function ee(t, e, n) {
  const s = t.cards.find((o) => o.id === e), a = q(t), c = s.lag ?? 0, l = s.duration ?? 1, i = (o, r) => Math.sign(r - o) * a;
  for (let o = { ...n }; o.lag !== c || o.duration !== l; ) {
    if (o.lag !== c) {
      const u = i(o.lag, c);
      o = { lag: o.lag + u, duration: o.duration - u };
    } else o = { lag: c, duration: o.duration + i(o.duration, l) };
    const r = Jt(t, e, { lag: o.lag, duration: o.duration });
    if (typeof r != "string") return r;
  }
  return null;
}
function ie(t, e, n, s, a, c) {
  const l = q(t), i = Wn(t), o = t.cards[n].laneId, r = (d) => {
    if (!i) return d;
    const p = Tn(t, d, /* @__PURE__ */ new Set([e]));
    return typeof p == "string" ? d : p;
  }, u = (d) => r(nt(d, l, e)), m = (d) => Y(C(r(d), c).parts, s.map((p) => "card-" + p)), f = (c.narrow ? [o] : t.lanes.map((d) => d.id)).flatMap((d) => Rn(t, e, "lag", d === o ? void 0 : d).map((p) => ({ laneId: d, run: p })));
  if (!f.length) return () => t;
  const g = J(t, "card-" + e, a, m, (d, p) => {
    const x = d.closest(f.map(({ laneId: y, run: [_, S] }) => d.vary(
      { ...p, cards: p.cards.map((k, M) => M === n ? { ...k, laneId: y, lag: Math.min(S, Math.max(_, k.lag ?? 0)) } : k) },
      Nt("cards", n, "lag"),
      { constraint: (k) => [Ht(k.cards[n].lag ?? 0, _ - 0.49), Gt(k.cards[n].lag ?? 0, S + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? d.closest(s.map((y) => d.dropTarget("target-" + y, qt(p, e, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(u) : x.onDrop(u);
  });
  return g ? (d) => u(g(d)) : null;
}
function se(t, e, n, s) {
  const a = n.parts.find((l) => l.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (l) => {
    const i = Lt(t, t.launch.day + Math.round((l.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let o = t;
    const r = Math.sign(t.launch.day - i.day);
    for (let u = i.day + r; r && u !== t.launch.day; u += r) {
      const m = Lt(t, u);
      if (m.next) {
        o = m.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function ae(t, e, n, s) {
  const a = n.parts.find((l) => l.name === rt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (l) => {
    const i = Sn(t, (l.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function re(t, e, n, s) {
  const a = n.parts.find((i) => i.name === ot);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, l = t.hiring.weeks;
  return (i) => {
    const o = l + Math.round((i.x - e.x - a.x) / n.dayW / 7), r = _n(t, o);
    return r ? { next: t, layout: c, clampedReason: r, refusal: r } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function oe(t, e, n) {
  const s = n.parts.find((o) => o.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = q(t), l = t.hiring.weeks * 7, i = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const r = a + Math.round((o.x - e.x - s.x) / n.dayW / c) * c, u = Math.min(l, Math.max(0, r)), m = le(t, i(u));
    return m ? { next: t, clampedReason: m, refusal: m } : { next: i(u), ...u !== r && { clampedReason: u > r ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function le(t, e) {
  const n = t.behaviour ? $n(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function ce(t, e, n, s, a, c) {
  const l = t.launch.day, i = (r) => Y(C(r, c).parts, s.map((u) => "card-" + u)), o = J(t, "card-" + e, a, i, (r, u) => {
    const m = c.narrow ? u.lanes.filter((f) => f.id === u.cards[n].laneId) : u.lanes, h = r.closest(m.map((f) => r.vary(
      { ...u, cards: u.cards.map((g, d) => d === n ? { ...g, laneId: f.id, lag: g.lag ?? 0 } : g) },
      Nt("cards", n, "lag"),
      { constraint: (g) => [Ht(g.cards[n].lag ?? 0, -1e-3), Gt(Zt(g), l + 1e-3)] }
    )));
    return s.length ? r.closest(s.map((f) => r.dropTarget("target-" + f, qt(u, e, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(h).withBranchTransition(120).onDrop((f) => nt(f)) : h.onDrop((f) => nt(f));
  });
  return o ? (r) => nt(o(r)) : null;
}
const B = 76;
function P(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((u) => t.cards.filter((m) => m.laneId === u.id).length), c = (u) => t.lanes[u].role === "won" ? "#bfe3cf" : t.lanes[u].role === "lost" ? "#e4dcdc" : H[u % H.length], l = (u) => ht(t, t.lanes[u].id) ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: A(c(u), 0.6), line: A(c(u), 0.1) }, i = (u) => ht(t, t.lanes[u].id) ? { ink: E.ink } : {};
  let o, r;
  if (n) {
    o = Math.max(300, e.width ?? 390);
    let u = B;
    t.lanes.forEach((m, h) => {
      const f = t.cards.filter((x) => x.laneId === m.id && x.override).length, g = 138 + (a[h] + 1) * 64 + f * 18;
      s.push({ name: "column-" + m.id, x: 2, y: u, width: o - 4, height: g, ...l(h) });
      const d = Math.floor((o - 16) * 0.36);
      s.push({ name: "lane-" + m.id, x: 8, y: u + 6, width: d, height: _t, text: m.label, fill: c(h), fontSize: 15 }), s.push({ name: "caption-" + m.id, x: 8 + d + tt, y: u + 6, width: o - 16 - d - tt, height: 56, text: Tt(t, m.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(h) });
      let p = u + 114;
      for (const x of t.cards.filter((y) => y.laneId === m.id)) {
        const y = x.override ? 18 : 0;
        s.push({ name: "card-" + x.id, x: 8, y: p, width: o - 16, height: 56 + y, text: Ft(t, x.id), fontSize: 15 }), p += 64 + y;
      }
      u += g + 10;
    }), r = u;
  } else {
    const m = Math.max(...a), h = t.lanes.some((g) => ht(t, g.id)) ? 24 : 0, f = 148 + h + (m + 1) * 88;
    t.lanes.forEach((g, d) => {
      const p = d * 244;
      s.push({ name: "column-" + g.id, x: p + 2, y: B, width: 240, height: f, ...l(d) }), s.push({ name: "lane-" + g.id, x: p + 8, y: B + 6, width: 228 - tt, height: _t, text: g.label, fill: c(d), fontSize: 16 }), s.push({ name: "caption-" + g.id, x: p + 8, y: B + 48, width: 228, height: 48 + h, text: Tt(t, g.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(d) }), t.cards.filter((x) => x.laneId === g.id).forEach((x, y) => s.push({ name: "card-" + x.id, x: p + 8, y: B + 148 + h + y * 88, width: 228, height: 76, text: Ft(t, x.id), fontSize: 15 }));
    }), o = t.lanes.length * 244, r = B + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(o, 520), height: 34, text: Hn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: V(t, e, o) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: o, height: r };
}
const Z = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, yt(t)), V = (t, e, n) => 4 + (n - 8) * t.forecast.target / Z(t, e);
function xt(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function he(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = xt(Z(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function Ft(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return bt(n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + T(n.amount, t.forecast.currency), n);
}
function de(t, e) {
  const { width: n } = P(t, e.layout), s = t.forecast.target, a = yt(t), c = Z(t, e.layout), l = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: l, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? w.accept : w.bar },
    { t: "line", x1: V(t, e.layout, n), y1: 36, x2: V(t, e.layout, n), y2: 62, color: w.ink, width: 2 },
    { t: "rect", x: V(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: w.ink, role: "edge-target" },
    { t: "text", x: V(t, e.layout, n), y: 72, text: "Target " + T(s, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const ue = {
  laneCues: !0,
  places: (t, e) => P(t, e),
  notes: (t, e, n, s) => kt(P(t, e).parts, t, n, s),
  editsBetween: j,
  layer: (t) => mt(t, de),
  chooser(t, e, n, s = {}) {
    const a = Kt(t, e).map((c) => Vt(t, e, c.id));
    return a.length < 2 ? null : Qt(J(t, "card-" + e, n, (c) => Y(P(c, s).parts), (c, l) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l, { gapIn: 40, gapOut: 56 })), t, e, P(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = P(t, a), l = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === l.laneId || !at(c.find((r) => r.name === "column-" + i.id), s)) continue;
      const o = Pn(t, e, i.id);
      return o ? { laneId: i.id, reason: o, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  /**
   * The target's grip: dragged right it raises the target, left it lowers it, in the gauge's steps, on the scale the
   * drag started with (the gauge draws on past its end for a target held beyond it). One set_target on the drop.
   */
  handleDrag(t, e, n, s) {
    if (e !== "handle-target") return null;
    const a = P(t, s), c = a.parts.find((m) => m.name === "handle-target"), l = Z(t, s), i = xt(l), o = l / (a.width - 8), r = { ...s, gaugeScale: l }, u = En(t, { field: "target" });
    return (m) => {
      const h = t.forecast.target + Math.round((m.x - n.x - c.x) * o / i) * i, f = Math.min(u.max, Math.max(i, h));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: r, ...f !== h && { clampedReason: f < h ? u.reasons.max : "A target is at least " + T(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: he,
  label: (t, e) => e === "handle-target" ? "Target, " + T(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + T(xt(Z(t)), t.forecast.currency) + "." : null
}, $ = 48, N = 960, et = 900, fe = { phone: 14, desktop: 32 }, an = 18, U = (t, e = !1) => t.lanes.some((n) => wt(t, n.id) > 0) ? fe[e ? "phone" : "desktop"] : 0, Bt = (t, e) => t.cards.reduce((n, s) => n + (s.laneId === e ? 64 + (s.override ? an : 0) : 0), 0);
function O(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, l = [], i = [];
  let o, r;
  if (n) {
    o = Math.max(300, e.width ?? 390);
    let h = $ + c / a * et;
    t.lanes.forEach((f, g) => {
      const d = Math.max(100 + U(t, !0) + Bt(t, f.id) + 64, f.allocation / a * et);
      i.push({ laneId: f.id, start: h, size: d }), h += d;
    }), r = h + 8;
  } else {
    let h = c / a * N;
    for (const f of t.lanes)
      i.push({ laneId: f.id, start: h, size: f.allocation / a * N }), h += f.allocation / a * N;
    o = Math.max(N, h), r = $ + 100 + U(t, !1) + Math.max(...t.lanes.map((f) => Bt(t, f.id))) + 64;
  }
  t.lanes.forEach((h, f) => {
    const { start: g, size: d } = i[f], p = H[f % H.length], x = n ? { x: 2, y: g + 1, width: o - 4, height: d - 2 } : { x: g + 1, y: $, width: Math.max(4, d - 2), height: r - $ }, y = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) }, _ = wt(t, h.id) > 0;
    l.push({ name: "column-" + h.id, ...x, ..._ ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: A(p, 0.6), line: A(p, 0.1) } });
    const S = n ? y.width * 0.36 : y.width;
    l.push({ name: "lane-" + h.id, x: y.x, y: y.y + 6, width: S, height: 32, text: h.label, fill: p, fontSize: 15 });
    const k = U(t, n), M = Dn(t, h.id).replace(" · over budget", `
over budget`);
    l.push({
      name: "caption-" + h.id,
      x: n ? y.x + S + 6 : y.x,
      y: y.y + (n ? 6 : 40),
      width: n ? y.width - S - 6 : y.width,
      height: (n ? 50 : 40) + k,
      text: n ? M.replace(" · ", `
`) : M,
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12,
      ..._ && { ink: E.ink }
    });
    let R = y.y + 100 + k;
    for (const v of t.cards.filter((W) => W.laneId === h.id)) {
      const W = v.override ? an : 0;
      l.push({
        name: "card-" + v.id,
        x: y.x,
        y: R,
        width: y.width,
        height: 56 + W,
        text: bt(v.label + `
` + T(v.amount, t.budget.currency), v),
        fontSize: 14
      }), R += 64 + W;
    }
    if (f < t.lanes.length - 1) {
      const v = g + d;
      l.push(n ? { name: "handle-" + h.id, x: o - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + h.id, x: v - 22, y: $ - 6, width: 44, height: 48 });
    }
  });
  const u = i[0], m = i.at(-1);
  for (const [h, f] of [[rn, u.start], [on, m.start + m.size]])
    l.push(n ? { name: h, x: o - 96, y: f - 22, width: 88, height: 44 } : { name: h, x: f - 22, y: $ - 6, width: 44, height: 48 });
  return { parts: l, width: o, height: r, segments: i, narrow: n, k: (n ? et : N) / a };
}
const rn = "handle-_first", on = "handle-_last", Dt = (t) => t === rn ? "start" : t === on ? "end" : null;
function ge(t, e) {
  const n = O(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: Gn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const l = n.segments[c], i = a.allocation, o = Nn(t, a.id);
    if (n.narrow) {
      const r = l.start + 50 + U(t, !0), u = 8, m = n.width - 16;
      s.push({ t: "rect", x: u, y: r, w: m, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: u, y: r, w: Math.min(m, m * o / i || 0), h: 10, rx: 5, color: o > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: u + m * a.floor / i, y1: r - 4, x2: u + m * a.floor / i, y2: r + 14, color: w.ink, width: 2 });
    } else {
      const r = n.k, u = $ + 86 + U(t, !1);
      s.push({ t: "rect", x: l.start + 6, y: u, w: l.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: l.start + 6, y: u, w: Math.max(0, Math.min(l.size - 12, (l.size - 12) * o / i || 0)), h: 10, rx: 5, color: o > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: l.start + a.floor * r, y1: u - 6, x2: l.start + a.floor * r, y2: u + 16, color: w.ink, width: 2 }), a.cap !== void 0 && l.start + a.cap * r <= n.width && s.push({ t: "line", x1: l.start + a.cap * r, y1: u - 6, x2: l.start + a.cap * r, y2: u + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const r = l.start + l.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: r, x2: n.width - 2, y2: r, color: w.ink, width: 2 } : { t: "line", x1: r, y1: $, x2: r, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: r - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: r - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const c = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((c) => c.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : $ - 12,
      text: e.clamp.text,
      color: w.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const ln = (t, e) => Math.round(t / e) * e, pe = {
  laneCues: !0,
  notes: (t, e, n, s) => kt(O(t, e).parts, t, n, s),
  editsBetween: j,
  label: nn,
  places(t, e) {
    const { parts: n, width: s, height: a } = O(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => mt(t, ge),
  chooser(t, e, n, s = {}) {
    const a = Kt(t, e).map((c) => Vt(t, e, c.id));
    return a.length < 2 ? null : Qt(J(t, "card-" + e, n, (c) => Y(O(c, s).parts), (c, l) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l)), t, e, O(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = O(t, a), l = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === l.laneId || !at(c.find((r) => r.name === "column-" + i.id), s)) continue;
      const o = Fn(t, e, i.id);
      return o ? { laneId: i.id, reason: o, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = Dt(e);
    if (a) return xe(t, a, e, n, s);
    const c = e.slice(7), l = t.lanes.findIndex((d) => d.id === c), i = t.lanes[l + 1];
    if (l < 0 || !i) return null;
    const o = Cn(t, { laneId: c }), r = t.budget.step, u = (d) => {
      const p = Math.min(o.max, Math.max(o.min, ln(d, r)));
      return Ot(t, i.id, c, p);
    }, m = O(t, s), h = m.narrow ? et / t.budget.total : N / t.budget.total, f = m.parts.find((d) => d.name === e), g = J(t, e, n, (d) => Y(O(d, s).parts), (d) => d.varyFunc([0], ([p]) => Ot(t, i.id, c, p), { constraint: (p) => [
      ...fn([o.min, p.lanes[l].allocation - t.lanes[l].allocation, o.max])
    ] }));
    return (d) => {
      const x = (m.narrow ? d.y - n.y - f.y : d.x - n.x - f.x) / h, y = g?.(d), _ = y ? y.lanes[l].allocation - t.lanes[l].allocation : x, S = { next: u(_) };
      return x > o.max + r / 2 ? { ...S, clampedReason: o.reasons.max } : x < o.min - r / 2 ? { ...S, clampedReason: o.reasons.min } : S;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = Dt(e);
    if (s) {
      const u = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (u ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], c = t.lanes.findIndex((u) => u.id === a), l = t.lanes[c + 1];
    if (c < 0 || !l) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", o = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: l.id }, to: { id: a }, amount: o } : { kind: "shift_budget", from: { id: a }, to: { id: l.id }, amount: o }];
  }
};
function xe(t, e, n, s, a) {
  const c = O(t, a), l = c.parts.find((m) => m.name === n);
  if (!l) return null;
  const i = t.budget.total, o = t.budget.step, r = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, u = Bn(t);
  return (m) => {
    const h = (c.narrow ? m.y - s.y - l.y : m.x - s.x - l.x) / c.k, f = i + ln(e === "end" ? h : -h, o), g = ft(t, f, e);
    if (typeof g != "string") return { next: g, layout: r };
    const d = ft(t, Math.min(u.max, Math.max(u.min, f)), e);
    return { next: typeof d == "string" ? t : d, layout: r, clampedReason: g, refusal: g };
  };
}
const cn = { "launch-plan": gt, "hiring-plan": gt, pipeline: ue, budget: pe };
function ve(t, e) {
  cn[t] = e;
}
function Se(t) {
  const e = cn[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e && t === "grid") throw new Error("The grid sheet's kit has not loaded: import slateboxjs/boards/grid first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget, a nested board and a grid sheet have one.`);
  return e;
}
function _e(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Rs as GRID_MAX_STAMPS,
  Ls as GRID_MAX_TILES,
  $s as GRID_TRAY,
  Ts as MIN_CELL,
  Os as PX_PER_INCH,
  Te as amountLimits,
  Oe as amountOf,
  $i as amountRules,
  Ae as bandOf,
  Ti as behaviourEditsBetween,
  As as bingoSample,
  _e as boardLayoutFor,
  On as brokenWaits,
  Dn as budgetCaption,
  Nn as budgetCommitted,
  Gn as budgetHeader,
  pe as budgetKit,
  O as budgetLayout,
  Cn as budgetLimits,
  wt as budgetOver,
  Fn as budgetRefusal,
  Oi as budgetRules,
  Ai as budgetShiftLimits,
  zi as budgetShiftRefusal,
  Bn as budgetTotalBounds,
  Ei as budgetTotalFixed,
  Vi as byOrder,
  Wn as cascadeStops,
  zs as cellAt,
  Es as cellBox,
  Ps as cellSize,
  Cs as cellSizeProblem,
  Fs as checkGrid,
  Xi as checkNest,
  Ui as checkNestMove,
  $n as checkTime,
  Yt as clockOf,
  mt as createBoardLayer,
  ze as currencyOf,
  ct as dateName,
  Ee as dayFromWords,
  yn as dayMap,
  L as dayWords,
  Pe as days,
  Bs as defaultSpan,
  Ce as downstreamTasks,
  vn as dragTaskEdge,
  Fe as earliestLaunch,
  Be as edgeValues,
  Yi as extend,
  De as extendWorkshopEdits,
  Ds as fits,
  Ns as flashcardSample,
  Hs as freeCells,
  Ne as goLiveSample,
  Gs as gridCaption,
  Is as gridCardText,
  Ks as gridFamily,
  Vs as gridFromNote,
  Xs as gridNeeds,
  Us as gridNoteText,
  Ys as gridOverridable,
  Js as gridPages,
  js as gridPrintProblems,
  Zs as gridRuleSentence,
  qs as gridRules,
  Qs as gridSamples,
  bs as gridSheet,
  ta as gridTileTypes,
  nn as handleLabel,
  J as headlessDrag,
  He as hireLagFor,
  jt as hireStarts,
  Ge as hiringPlanRules,
  Ie as hiringPlanSample,
  Tn as holdOthers,
  na as inBounds,
  at as inside,
  Ji as isOrderKey,
  ys as isOrgChart,
  D as isoAt,
  Ke as isoTime,
  Se as kitFor,
  Ve as landPlanNote,
  Xe as launchDayOn,
  Zt as launchFinish,
  Rt as launchHard,
  Ue as launchIndex,
  C as launchLayout,
  Ut as launchLinkRefusal,
  tn as launchLinkTargets,
  kn as launchOverrun,
  Ye as launchPlanCaption,
  gt as launchPlanKit,
  wn as launchPlanLimits,
  Je as launchPlanRefusal,
  je as launchPlanRules,
  Ze as launchPlanSample,
  qe as launchTaskText,
  Qe as launchTooEarly,
  w as layerInk,
  Rn as legalRuns,
  X as lineWord,
  T as money,
  Xt as moneyExact,
  be as monthNames,
  Lt as moveLaunch,
  Sn as movePlanStart,
  ji as nestAlias,
  Zi as nestAreas,
  ws as nestAxes,
  qi as nestCardText,
  Qi as nestDepth,
  bi as nestDrags,
  ts as nestEmptyDrop,
  ns as nestFamily,
  es as nestKids,
  is as nestLegal,
  ss as nestMeasure,
  as as nestMeasureWords,
  rs as nestPlace,
  ks as nestQuadrants,
  os as nestRoots,
  ls as nestRules,
  Ms as nestScores,
  cs as nestSentence,
  hs as nestSubtree,
  ti as nextCardId,
  ni as nextMonday,
  ei as noteNumbers,
  E as o,
  ea as occupancy,
  ut as offsetOf,
  ds as orderBetween,
  us as orderKeys,
  ii as ownField,
  ia as pageName,
  sa as pageSize,
  kt as partNotes,
  Y as partsGeometry,
  Mn as pastTheLine,
  Tt as pipelineCaption,
  yt as pipelineForecast,
  Hn as pipelineGauge,
  ue as pipelineKit,
  P as pipelineLayout,
  En as pipelineLimits,
  Pn as pipelineRefusal,
  Pi as pipelineRules,
  ht as pipelineStageOver,
  Ci as planBudgetMove,
  si as planDrags,
  ai as planEdit,
  ri as planFixed,
  oi as planLaunchPlanMove,
  li as planPastRule,
  Fi as planPipelineMove,
  ci as planProblem,
  hi as planProblems,
  Bi as planSamples,
  di as planStartBy,
  _n as planWeeksProblem,
  ui as planWords,
  fi as presetRules,
  aa as printSize,
  vs as quadrantOf,
  gi as readClock,
  pi as readNoteNumbers,
  ra as readingOrder,
  oa as reflow,
  ve as registerBoardKit,
  fs as registerNestPlus,
  xi as renamedNumbers,
  Le as renderLayerShapes,
  Di as restoreWorkshop,
  gs as roleOf,
  mi as runwayCap,
  yi as runwayHeader,
  An as runwayMonths,
  zn as runwayWords,
  Ni as sampleBudget,
  wi as sampleLaunchPlan,
  Hi as samplePipeline,
  z as scheduleLaunch,
  Ss as scoreBoard,
  _s as scoresIn,
  Ot as shiftBudget,
  F as shortDate,
  q as snapStep,
  la as spanOf,
  Ln as startHandle,
  it as startHandleCard,
  ps as tidyKeys,
  ca as tileName,
  ha as tileTypeOf,
  da as tileWords,
  ki as timeFamily,
  Mi as timeProblems,
  vi as timeRuleKindIds,
  Si as timeSentence,
  A as tint,
  Jt as tryTask,
  ua as usedCells,
  Gi as validateBudget,
  fa as validateGrid,
  _i as validateHiringPlan,
  Wi as validateLaunchPlan,
  xs as validateNest,
  Ii as validatePipeline,
  bt as w,
  Wt as waitsRefusal,
  $t as weekdayAt,
  Ri as weekendAt,
  ft as withBudgetTotal,
  qt as withLink,
  mn as withPlanStart,
  G as withTaskValue,
  ga as worksheetSample,
  j as workshopEditsBetween
};
