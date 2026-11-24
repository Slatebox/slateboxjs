import { Vec2 as mt, getElementPositionCheap as bt, translate as tn, dragSpecToBehavior as nn, param as Ot, moreThan as At, lessThan as Et, inOrder as en } from "./dragology.mjs";
import { workshopOverrideLine as Pt, createBoardLayer as dt, laneColors as G, layerInk as y, workshopDestinations as Ft, workshopCandidate as Bt } from "./workshop-model.mjs";
import { renderLayerShapes as xe } from "./workshop-model.mjs";
import { startHandleCard as b, dayWords as $, scheduleLaunch as P, e as Ct, m as R, dateName as at, lineWord as U, withPlanStart as sn, offsetOf as ot, launchLinkRefusal as Dt, snapStep as j, dayMap as an, clockOf as Nt, waitsRefusal as yt, tryTask as Ht, launchPlanLimits as rn, launchOverrun as on, withTaskValue as tt, isoAt as D, launchHard as ln, pastTheLine as cn, dragTaskEdge as hn, moveLaunch as wt, movePlanStart as un, planWeeksProblem as dn, cascadeStops as fn, legalRuns as gn, startHandle as xn, checkTime as pn, holdOthers as mn, withLink as Gt, launchFinish as Kt, weekdayAt as kt, shortDate as B, brokenWaits as yn, hireStarts as wn, runwayMonths as kn, runwayWords as Mn } from "./workshop-plans.mjs";
import { a as me, d as ye, bandOf as we, c as ke, dayFromWords as Me, g as ve, downstreamTasks as We, earliestLaunch as Se, edgeValues as _e, extendWorkshopEdits as Le, goLiveSample as Re, hireLagFor as $e, hiringPlanRules as Te, hiringPlanSample as ze, isoTime as Oe, landPlanNote as Ae, launchDayOn as Ee, launchIndex as Pe, launchPlanCaption as Fe, launchPlanRefusal as Be, launchPlanRules as Ce, launchPlanSample as De, launchTaskText as Ne, launchTooEarly as He, monthNames as Ge, n as Ke, nextMonday as Ue, b as Ve, o as Ie, planDrags as Je, planEdit as Ye, planFixed as je, planLaunchPlanMove as Xe, planProblem as Ze, planStartBy as qe, planWords as Qe, presetRules as be, readClock as ti, f as ni, r as ei, runwayCap as ii, runwayHeader as si, sampleLaunchPlan as ai, timeFamily as ri, timeRuleKindIds as oi, timeSentence as li, validateHiringPlan as ci, validateLaunchPlan as hi, weekendAt as ui } from "./workshop-plans.mjs";
import X from "react";
import { withBudgetTotal as lt, pipelineForecast as ft, pipelineLimits as vn, pipelineRefusal as Wn, pipelineCaption as Mt, pipelineStageOver as vt, budgetLimits as Sn, budgetRefusal as _n, budgetOver as Ln, budgetCaption as Wt, budgetTotalBounds as Rn, shiftBudget as St, budgetCommitted as $n } from "./workshop-rules.mjs";
import { amountRules as fi, behaviourEditsBetween as gi, budgetRules as xi, budgetShiftLimits as pi, budgetShiftRefusal as mi, budgetTotalFixed as yi, pipelineRules as wi, planBudgetMove as ki, planPipelineMove as Mi, planSamples as vi, restoreWorkshop as Wi, sampleBudget as Si, samplePipeline as _i, validateBudget as Li, validatePipeline as Ri } from "./workshop-rules.mjs";
import { byOrder as Ti, checkNest as zi, checkNestMove as Oi, extend as Ai, isOrderKey as Ei, nestAlias as Pi, nestAreas as Fi, nestCardText as Bi, nestDepth as Ci, nestDrags as Di, nestEmptyDrop as Ni, nestFamily as Hi, nestKids as Gi, nestLegal as Ki, nestMeasure as Ui, nestMeasureWords as Vi, nestPlace as Ii, nestRoots as Ji, nestRules as Yi, nestSentence as ji, nestSubtree as Xi, orderBetween as Zi, orderKeys as qi, registerNestPlus as Qi, roleOf as bi, tidyKeys as ts, validateNest as ns } from "./workshop-nest.mjs";
import { isOrgChart as is, nestAxes as ss, nestQuadrants as as, nestScores as rs, quadrantOf as os, scoreBoard as ls, scoresIn as cs } from "./workshop-nest-plus.mjs";
function V(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return X.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ X.createElement("g", { id: s.name, transform: tn(s.x, s.y) }, /* @__PURE__ */ X.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ X.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function I(t, e, n, s, a) {
  let c;
  const i = {
    draggable: (l) => (c ?? (c = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: mt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!bt(i, t) || !c) return null;
  const o = nn(a(c, t), i);
  return (l) => o({ pointer: mt(l.x, l.y) }).dropState;
}
const nt = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Ut(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((r) => r.id === n).laneId;
  return (r) => {
    const i = t(r);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const o = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + c && nt(l, r));
    return o && a.find((l) => l.cards.find((u) => u.id === n).laneId === o.name.slice(7)) || i;
  };
}
function Vt(t, e) {
  const n = Pt(e);
  return n ? t + `
` + n : t;
}
const H = { fill: "#fde3d7", line: "#c2410c", ink: "#9a3412" };
function z(t, e) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function J(t, e) {
  if (t.clock && e.clock && t.clock.origin !== e.clock.origin) {
    const i = sn(t, ot(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...J(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (u) => JSON.stringify(u.lanes.map((m) => m.allocation)), o = ["end", "start"].map((u) => ({ edge: u, made: lt(t, e.budget.total, u) })).filter((u) => typeof u.made != "string"), l = o.find((u) => i(u.made) === i(e)) ?? o[0];
    if (l) return [{ kind: "set_budget_total", amount: e.budget.total, ...l.edge === "start" && { edge: "start" } }, ...J(l.made, e)];
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
        ...i.dependsOn && { waitsOn: i.dependsOn.map((m) => ({ id: m })) },
        ...i.amount !== void 0 && { amount: i.amount }
      });
      continue;
    }
    o.label !== i.label && n.push({ kind: "rename_card", card: l, label: i.label });
    const u = n.length;
    for (const m of o.dependsOn ?? []) i.dependsOn?.includes(m) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: m } });
    for (const m of i.dependsOn ?? []) o.dependsOn?.includes(m) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: m } });
    o.laneId !== i.laneId && n.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (n.length > u && i.duration !== void 0 && n.slice(u).some((m) => m.kind !== "move_card") || o.duration !== i.duration || (o.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && o.amount !== i.amount && n.push({ kind: "set_amount", card: l, amount: i.amount });
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
function Tn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${R(ft(t), e)} of ${R(t.forecast?.target ?? 0, e)}`;
}
function zn(t) {
  return `${Ct(t.budget?.total ?? 0, t.budget?.currency)} · balanced`;
}
function It(t, e) {
  return t.cards.filter((n) => Dt(t, e, n.id) === null).map((n) => n.id);
}
function On(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function gt(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", r = s.fontSize ?? 14;
  return t.map((i) => {
    const o = i.name.startsWith("handle-"), l = i.text ?? "";
    return { options: {
      id: i.name,
      text: l,
      name: e.cards.find((u) => "card-" + u.id === i.name)?.label ?? l,
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
      fontSize: On(l, i.fontSize ?? r, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function Jt(t, e) {
  const n = e.slice(7), s = b(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${$(t, P(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Ct(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${R(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${at(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${at(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${at(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${U(t).charAt(0).toUpperCase() + U(t).slice(1)}, ${$(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const r = t.lanes.findIndex((i) => i.id === n);
  return r >= 0 && t.lanes[r + 1] ? `Divider between ${t.lanes[r].label} and ${t.lanes[r + 1].label}. Left and Right move money.` : null;
}
const Yt = "#c2410c", et = "handle-_first", it = "handle-_last", An = 32, En = 44, Pn = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function E(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = P(t), c = s ? t.hiring.weeks * 7 : ln(t) ? t.launch.day : Math.ceil(t.launch.day * 4 / 3), r = cn(t), i = [], o = /* @__PURE__ */ new Map(), l = n ? 8 : 168, u = n ? 88 : l + 40, m = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), d = e.dayWidth ? Math.max(m, Math.ceil(u + c * e.dayWidth)) : m, f = e.maxWidth !== void 0 && d > e.maxWidth ? Math.max(m, Math.floor(e.maxWidth)) : d, g = e.dayWidth && f === d ? e.dayWidth : (f - u) / c, h = (w) => G[t.lanes.findIndex((M) => M.id === w) % G.length], x = (w, M) => {
    const v = t.cards.find((O) => O.id === w), S = a.get(w), _ = { x: l + S.from * g, y: M, width: (S.to - S.from) * g, height: n ? En : An };
    o.set(w, _);
    const F = r.has(w);
    if (i.push({
      name: "card-" + w,
      ..._,
      text: n ? "" : s ? v.label : `${v.label} · ${v.duration}d`,
      fill: F ? "#fde3d7" : n ? h(v.laneId) : s ? z(h(v.laneId), 0.45) : "#fffdf6",
      line: F || S.critical && !s ? Yt : "#667872",
      lineWidth: F || S.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const O = Pn(n, _.width), st = n ? 44 : 22, xt = _.y + _.height / 2 - 22, pt = n ? Math.max(-12, _.x - st) : _.x - st;
      i.push({ name: xn(w), x: pt, y: xt, width: Math.max(24, _.x + O - pt), height: 44 }), i.push({ name: "handle-" + w, x: _.x + _.width - O, y: xt, width: O + st, height: 44 });
    }
  };
  let p, k, W;
  if (n) {
    const w = (f - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, v) => {
      const S = 8 + v * (w + 8);
      i.push({ name: "column-" + M.id, x: S, y: 30, width: w, height: 72, fill: z(h(M.id), 0.6), line: z(h(M.id), 0.1) }), i.push({ name: "lane-" + M.id, x: S + 4, y: 34, width: w - 8, height: 28, text: M.label, fill: h(M.id), fontSize: 14 }), i.push({ name: "caption-" + M.id, x: S + 4, y: 64, width: w - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), W = 124, k = 130, p = 138;
    for (const M of t.cards)
      x(M.id, p + 20), p += 64;
  } else {
    W = 48, k = 56, p = k;
    for (const w of t.lanes) {
      const M = t.cards.filter((S) => S.laneId === w.id), v = Math.max(92, M.length * 44 + 20);
      i.push({ name: "column-" + w.id, x: 0, y: p, width: f, height: v, fill: z(h(w.id), 0.65), line: z(h(w.id), 0.1) }), i.push({ name: "lane-" + w.id, x: 8, y: p + 8, width: l - 24, height: 32, text: w.label, fill: h(w.id), fontSize: 15 }), i.push({ name: "caption-" + w.id, x: 8, y: p + 44, width: l - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((S, _) => x(S.id, p + 10 + _ * 44)), p += v + 4;
    }
  }
  return s ? t.hiring.funding && !n && i.push({ name: "handle-funding", x: l + t.hiring.funding.day * g - 22, y: 4, width: 44, height: 44 }) : i.push({ name: "handle-launch", x: l + t.launch.day * g - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && i.push({ name: et, x: l - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && i.push({ name: it, x: l + c * g - 22, y: 8, width: 44, height: 44 }), { parts: i, width: f, height: p + 8, narrow: n, x0: l, dayW: g, gridTop: k, axisY: W, bars: o };
}
function Fn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Bn(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), c = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, r = e.y + e.height / 2;
  return { d: `M ${s} ${c} V ${r} H ${e.x}`, arrow: { x: e.x, y: r, angle: 0 } };
}
const Cn = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function Dn(t, e) {
  const n = E(t, e.layout), s = t.kind === "hiring-plan", a = P(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), r = Nt(t), i = [];
  if (r?.workdays)
    for (let d = 0; d < c; d++) kt(r.origin, d) === 6 && i.push({ t: "rect", x: n.x0 + d * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? y.canvasTrack : y.track, opacity: 0.7 });
  for (const d of t.behaviour?.rules ?? []) if (r && d.on && d.kind === "blackout") {
    const f = ot(r.origin, d.start), g = ot(r.origin, d.end) + 1, h = n.x0 + Math.max(0, f) * n.dayW, x = (Math.min(c, g) - Math.max(0, f)) * n.dayW;
    if (x <= 0) continue;
    i.push({ t: "rect", x: h, y: n.gridTop, w: x, h: n.height - 8 - n.gridTop, color: y.refuse, opacity: 0.12 });
    for (let p = h; p < h + x; p += 10) i.push({ t: "line", x1: p, y1: n.gridTop, x2: Math.min(h + x, p + 10), y2: n.gridTop + 10, color: y.refuse, width: 0.6 });
    i.push({ t: "text", x: h + 3, y: n.gridTop + 22, text: d.label + " · " + B(d.start) + "–" + B(d.end), color: y.refuse, size: 11, bold: !0 });
  }
  for (let d = 0; d <= c; d++) {
    const f = n.x0 + d * n.dayW, g = r ? kt(r.origin, d) === 1 : d % 7 === 0;
    if (!g && n.dayW < 6) continue;
    i.push({ t: "line", x1: f, y1: n.gridTop, x2: f, y2: n.height - 8, color: n.narrow ? g ? y.canvasWeek : y.canvasFaint : g ? y.week : y.faint, width: g ? 1 : 0.5 });
    const h = s && r && D(r.origin, d).slice(8) <= "07" && g, x = r ? s ? h ? B(D(r.origin, d)).replace(/^\d+ /, "") : "" : B(D(r.origin, d)) : (n.narrow ? "W" : "Week ") + (d / 7 + 1);
    g && x && (!r || s || n.dayW * 7 > 44) && i.push({ t: "text", x: f + 3, y: n.axisY, text: x, color: y.canvasInk, size: 12 });
  }
  const o = new Set(yn(t).map((d) => d.from + ">" + d.to));
  for (const d of t.cards) {
    for (const x of d.dependsOn ?? []) {
      const p = n.bars.get(x), k = n.bars.get(d.id);
      if (!p || !k) continue;
      const W = a.get(x).critical && a.get(d.id).critical, w = t.cards.find((v) => v.id === x).label, M = o.has(x + ">" + d.id);
      i.push({
        t: "path",
        ...Bn(p, k),
        color: M ? y.refuse : W ? Yt : y.ink,
        width: M || W ? 2 : 1.5,
        ...M && { dash: "5 4", role: "broken-" + x + "-" + d.id },
        unlink: { cardId: d.id, waitsOn: x, label: M ? `Remove the link: ${d.label} waits on ${w}, and starts before it ends` : `Remove the link: ${d.label} waits on ${w}` }
      });
    }
    const f = Pt(d), g = a.get(d.id), h = n.bars.get(d.id);
    if (s) {
      const x = t.hiring.bands.find((W) => W.id === d.band), p = h.x + h.width, k = n.x0 + c * n.dayW;
      k > p && i.push({ t: "rect", x: p, y: h.y + h.height / 2 - 3, w: k - p, h: 6, rx: 3, color: y.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(p + 6, k - 120),
        y: n.narrow ? h.y - 6 : h.y + h.height / 2 - 6,
        text: (n.narrow ? d.label + " · " : "") + "starts " + B(D(r.origin, wn(t, d.id))) + (x ? " · " + R(x.monthly, t.hiring.currency) + "/mo" : "") + (f ? " · " + f : ""),
        color: f ? y.refuse : y.ink,
        size: 12,
        role: "start-" + d.id
      });
      continue;
    }
    if (n.narrow) {
      const x = `${d.label} · ${d.duration}d` + (f ? " · moved anyway" : ""), p = Cn(x, g.critical), k = h.x + 2 + p <= n.width - 8;
      i.push({
        t: "text",
        x: k ? h.x + 2 : Math.max(8 + p, Math.min(n.width - 8, h.x + h.width)),
        anchor: k ? "start" : "end",
        y: h.y - 7,
        text: x,
        color: y.canvasInk,
        size: 13,
        bold: g.critical,
        halo: y.halo,
        role: "words-" + d.id
      });
    }
    g.critical || i.push({ t: "text", x: h.x + h.width + (n.narrow ? 48 : 24), y: h.y + h.height / 2 + 4, text: "+" + g.slack + "d", color: n.narrow ? y.canvasInk : y.ink, size: 12, role: "slack-" + d.id }), f && !n.narrow && i.push({ t: "text", x: h.x + h.width + (g.critical ? 24 : 64), y: h.y + h.height / 2 + 4, text: f, color: y.refuse, size: 12, bold: !0, halo: y.halo, role: "mark-" + d.id });
  }
  if (r && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: y.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: y.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && r) {
    const d = n.height + 2;
    i.push({ t: "text", x: n.x0, y: d, text: "Starts " + $(t, 0), color: y.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const f = s ? "Ends " + $(t, t.hiring.weeks * 7 - 1) : U(t).charAt(0).toUpperCase() + U(t).slice(1) + " " + $(t, t.launch.day), g = n.x0 + (s ? c : t.launch.day) * n.dayW;
    i.push({ t: "text", x: g, y: d, text: f, color: s ? y.ink : y.launch, size: 11, bold: !0, anchor: "end", role: "span-end" });
  }
  if (!(s && n.narrow)) for (const d of t.cards) {
    if (!n.narrow && e.focus !== d.id) continue;
    const f = n.bars.get(d.id), g = f.y + 6, h = f.height - 12, [x, p] = n.narrow ? [f.x - 10, f.x + f.width + 4] : [f.x + 3, f.x + f.width - 9], k = n.narrow ? 0.55 : 0.8;
    i.push(
      { t: "rect", x, y: g, w: 6, h, rx: 3, color: y.ink, opacity: k, role: "grip-start-" + d.id },
      { t: "rect", x: p, y: g, w: 6, h, rx: 3, color: y.ink, opacity: k, role: "grip-end-" + d.id }
    );
  }
  if (s) {
    const d = kn(t), f = t.behaviour?.rules.find((x) => x.on && x.kind === "deadline"), g = f && f.kind === "deadline" && d < f.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + Mn(d),
      color: g || e.refused ? y.refuse : y.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const h = t.hiring.funding;
    if (h && h.day <= c) {
      const x = n.x0 + h.day * n.dayW;
      i.push({ t: "line", x1: x, y1: 26, x2: x, y2: n.height - 8, color: y.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: x - 4, y: 26, w: 8, h: 18, rx: 4, color: y.accept }), i.push({ t: "text", x: Math.max(x + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + R(h.amount, t.hiring.currency) + " · " + B(D(r.origin, h.day)), color: y.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: y.ink, size: 12 }), e.clamp) {
      const x = n.parts.find((p) => p.name === e.clamp.name);
      x && i.push(...Lt(n, i, e.clamp.text, x, e.view));
    }
    return i;
  }
  const l = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: l, y1: n.narrow ? 112 : 26, x2: l, y2: n.height - 8, color: y.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: l - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: y.launch });
  const u = Kt(t), m = Math.max(0, ...[...a.values()].map((d) => d.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: r ? "Done " + $(t, Math.ceil(m) - 1) + " · " + U(t) + " " + $(t, t.launch.day) : `Done day ${u} · launch day ${t.launch.day}`,
    color: e.refused ? y.refuse : y.canvasInk,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const d = n.parts.find((f) => f.name === e.clamp.name);
    d && i.push(...Lt(n, i, e.clamp.text, d, e.view));
  }
  return i;
}
const Z = 13, _t = 16, jt = (t, e) => t * (e ? 0.64 : 0.6), Nn = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function Hn(t) {
  const e = t.size ?? 13, n = t.text.length * jt(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function Gn(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let rt = null;
function Lt(t, e, n, s, a) {
  const c = [...t.bars.values()].map((p) => ({ x: p.x - 4, y: p.y - 3, w: p.width + 8, h: p.height + 6 }));
  for (const p of e)
    p.t === "text" ? c.push(Hn(p)) : p.t === "rect" && c.push({ x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 });
  let r = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, o = t.gridTop + 2, l = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(r, a.x + 8) >= 160 && (r = Math.max(r, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(o, a.y + 8) >= 40 && (o = Math.max(o, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const u = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, m = JSON.stringify([n, u, r, i, o, l, c.map((p) => [p.x, p.y, p.w, p.h].map(Math.round))]);
  if (rt?.key === m) return rt.shapes;
  const d = jt(Z, !0), f = Math.floor((i - r) / d), g = /* @__PURE__ */ new Map();
  for (const p of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const k = Gn(n, Math.max(8, Math.floor(f * p)));
    k.length <= 4 && g.set(k.join(`
`), k);
  }
  let h = null;
  for (const p of g.values()) {
    const k = Math.max(...p.map((w) => w.length)) * d, W = p.length * _t + 2;
    if (!(k > i - r))
      for (let w = o; w + W <= l; w += 3)
        for (let M = r; M + k <= i; M += 6) {
          const v = { x: M, y: w, w: k, h: W }, S = Math.max(v.x - u.x, 0, u.x - (v.x + v.w)), _ = Math.max(v.y - u.y, 0, u.y - (v.y + v.h)), F = Math.hypot(S, _) + (p.length - 1) * 24;
          h && F >= h.score || c.every((O) => Nn(v, O)) && (h = { box: v, lines: p, score: F });
        }
  }
  const x = h ? [{ t: "text", x: h.box.x, y: h.box.y + Z - 1, text: n, lines: h.lines, lineHeight: _t, color: y.refuse, size: Z, bold: !0, role: "clamp" }] : [{
    t: "text",
    x: Math.min(s.x + 40, t.width - 4),
    y: s.y + 14,
    text: n,
    color: y.refuse,
    size: Z,
    anchor: s.x + 40 > t.width - 160 ? "end" : "start",
    bold: !0,
    role: "clamp"
  }];
  return rt = { key: m, shapes: x }, x;
}
const q = (t, e = 1, n) => {
  const s = (c, r) => Math.round(c / r) * r, a = { ...t, cards: t.cards.map((c) => {
    const r = c.id === n ? e : 1, i = { ...c, duration: Math.max(r, s(c.duration, r)), lag: Math.max(0, s(c.lag ?? 0, r)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, Rt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Kn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((o) => o.id === i)?.label ?? i, r = [
    ...It(t, a.id).map((i) => ({
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
function Un(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * j(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === et && t.clock) return [{ kind: "set_plan_start", start: D(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === it && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = b(e), r = c !== null && t.cards.find((l) => l.id === c);
  if (r) return [{ kind: "set_task", card: { id: r.id }, duration: r.duration - a, lag: (r.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), o = i && t.cards.find((l) => l.id === i[2]);
  return o ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + a }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + a }] : null;
}
const ct = {
  laneCues: !1,
  notes(t, e, n, s) {
    return gt(ct.places(t, e).parts, t, n, s);
  },
  editsBetween: J,
  label: Jt,
  places(t, e) {
    const n = Fn(t, E(t, e), (s) => {
      const a = t.cards.filter((r) => r.laneId === s), c = P(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((r) => c.get(r.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => dt(t, Dn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (Rt(t) ? Jn : Qn)(t, e, a, It(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = E(t, a);
    for (const d of t.cards) {
      if (d.id === e || !nt(c.bars.get(d.id), s)) continue;
      const f = Dt(t, e, d.id);
      return f ? { laneId: d.laneId, reason: f } : null;
    }
    const r = t.cards.find((d) => d.id === e), i = (r.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW), o = (d) => ({ edit: { kind: "set_task", card: { id: e }, lag: d }, to: "to start " + $(t, ht(t, e, d)) }), l = j(t);
    if (Rt(t)) {
      const d = P(t).get(e), f = Math.round(d.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), g = (r.lag ?? 0) + an(Nt(t)).idx(f) - d.start, h = Math.round(g / l) * l;
      if (h < -l && r.dependsOn?.length) return { laneId: r.laneId, reason: yt(t, e, h), override: o(h) };
      const x = Ht(t, e, { lag: Math.max(0, h) });
      return typeof x == "string" ? { laneId: r.laneId, reason: x, lands: !0, override: o(Math.max(0, h)) } : null;
    }
    const u = Math.round(i / l) * l;
    if (u < -l && r.dependsOn?.length) return { laneId: r.laneId, reason: yt(t, e, u), override: o(u) };
    const m = rn(t, { cardId: e, field: "lag" });
    return i > m.max ? { laneId: r.laneId, reason: on(tt(t, { cardId: e, field: "lag" }, i), e) ?? m.reasons.max, override: o(i) } : null;
  },
  handleDrag(t, e, n, s) {
    const a = E(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = b(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? $t(t, c, "start", n, a, e) : null;
    const r = e.slice(7);
    return t.cards.some((i) => i.id === r) ? $t(t, r, "end", n, a, e) : e === "handle-launch" ? Yn(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? Zn(t, n, a) : e === et && t.clock ? jn(t, n, a, s) : e === it && t.hiring ? Xn(t, n, a, s) : null;
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(t, e, n) {
    const s = E(t, n);
    return s.narrow || e.x < s.x0 ? null : (e.x - s.x0) / s.dayW;
  },
  keyEdit: Un,
  keyChoices: Kn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = b(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function $t(t, e, n, s, a, c) {
  const r = a.parts.find((i) => i.name === c);
  return r ? (i) => {
    const o = hn(t, e, n, (i.x - s.x - r.x) / a.dayW);
    if (o.next) return { next: o.next, ...o.reason && { clampedReason: o.reason } };
    const l = o.values.lag, u = ht(t, e, l) + Vn(t, e, l, o.values.duration) - 1;
    return {
      next: In(t, e, o.values) ?? t,
      clampedReason: o.refusal,
      refusal: o.refusal,
      override: {
        edit: { kind: "set_task", card: { id: e }, lag: l, duration: o.values.duration },
        to: n === "start" ? "to start " + $(t, ht(t, e, l)) : "to end " + $(t, u)
      }
    };
  } : null;
}
function ht(t, e, n) {
  return P(tt(t, { cardId: e, field: "lag" }, n)).get(e).from;
}
function Vn(t, e, n, s) {
  const a = P(tt(tt(t, { cardId: e, field: "lag" }, n), { cardId: e, field: "duration" }, s)).get(e);
  return a.to - a.from;
}
function In(t, e, n) {
  const s = t.cards.find((o) => o.id === e), a = j(t), c = s.lag ?? 0, r = s.duration ?? 1, i = (o, l) => Math.sign(l - o) * a;
  for (let o = { ...n }; o.lag !== c || o.duration !== r; ) {
    if (o.lag !== c) {
      const u = i(o.lag, c);
      o = { lag: o.lag + u, duration: o.duration - u };
    } else o = { lag: c, duration: o.duration + i(o.duration, r) };
    const l = Ht(t, e, { lag: o.lag, duration: o.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function Jn(t, e, n, s, a, c) {
  const r = j(t), i = fn(t), o = t.cards[n].laneId, l = (h) => {
    if (!i) return h;
    const x = mn(t, h, /* @__PURE__ */ new Set([e]));
    return typeof x == "string" ? h : x;
  }, u = (h) => l(q(h, r, e)), m = (h) => V(E(l(h), c).parts, s.map((x) => "card-" + x)), f = (c.narrow ? [o] : t.lanes.map((h) => h.id)).flatMap((h) => gn(t, e, "lag", h === o ? void 0 : h).map((x) => ({ laneId: h, run: x })));
  if (!f.length) return () => t;
  const g = I(t, "card-" + e, a, m, (h, x) => {
    const p = h.closest(f.map(({ laneId: k, run: [W, w] }) => h.vary(
      { ...x, cards: x.cards.map((M, v) => v === n ? { ...M, laneId: k, lag: Math.min(w, Math.max(W, M.lag ?? 0)) } : M) },
      Ot("cards", n, "lag"),
      { constraint: (M) => [At(M.cards[n].lag ?? 0, W - 0.49), Et(M.cards[n].lag ?? 0, w + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? h.closest(s.map((k) => h.dropTarget("target-" + k, Gt(x, e, k)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop(u) : p.onDrop(u);
  });
  return g ? (h) => u(g(h)) : null;
}
function Yn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = wt(t, t.launch.day + Math.round((r.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let o = t;
    const l = Math.sign(t.launch.day - i.day);
    for (let u = i.day + l; l && u !== t.launch.day; u += l) {
      const m = wt(t, u);
      if (m.next) {
        o = m.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function jn(t, e, n, s) {
  const a = n.parts.find((r) => r.name === et);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (r) => {
    const i = un(t, (r.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function Xn(t, e, n, s) {
  const a = n.parts.find((i) => i.name === it);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, r = t.hiring.weeks;
  return (i) => {
    const o = r + Math.round((i.x - e.x - a.x) / n.dayW / 7), l = dn(t, o);
    return l ? { next: t, layout: c, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function Zn(t, e, n) {
  const s = n.parts.find((o) => o.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = j(t), r = t.hiring.weeks * 7, i = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const l = a + Math.round((o.x - e.x - s.x) / n.dayW / c) * c, u = Math.min(r, Math.max(0, l)), m = qn(t, i(u));
    return m ? { next: t, clampedReason: m, refusal: m } : { next: i(u), ...u !== l && { clampedReason: u > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function qn(t, e) {
  const n = t.behaviour ? pn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function Qn(t, e, n, s, a, c) {
  const r = t.launch.day, i = (l) => V(E(l, c).parts, s.map((u) => "card-" + u)), o = I(t, "card-" + e, a, i, (l, u) => {
    const m = c.narrow ? u.lanes.filter((f) => f.id === u.cards[n].laneId) : u.lanes, d = l.closest(m.map((f) => l.vary(
      { ...u, cards: u.cards.map((g, h) => h === n ? { ...g, laneId: f.id, lag: g.lag ?? 0 } : g) },
      Ot("cards", n, "lag"),
      { constraint: (g) => [At(g.cards[n].lag ?? 0, -1e-3), Et(Kt(g), r + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((f) => l.dropTarget("target-" + f, Gt(u, e, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(d).withBranchTransition(120).onDrop((f) => q(f)) : d.onDrop((f) => q(f));
  });
  return o ? (l) => q(o(l)) : null;
}
const C = 76;
function A(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((u) => t.cards.filter((m) => m.laneId === u.id).length), c = (u) => t.lanes[u].role === "won" ? "#bfe3cf" : t.lanes[u].role === "lost" ? "#e4dcdc" : G[u % G.length], r = (u) => vt(t, t.lanes[u].id) ? { fill: H.fill, line: H.line, lineWidth: 2 } : { fill: z(c(u), 0.6), line: z(c(u), 0.1) }, i = (u) => vt(t, t.lanes[u].id) ? { ink: H.ink } : {};
  let o, l;
  if (n) {
    o = Math.max(300, e.width ?? 390);
    let u = C;
    t.lanes.forEach((m, d) => {
      const f = 96 + (a[d] + 1) * 64;
      s.push({ name: "column-" + m.id, x: 2, y: u, width: o - 4, height: f, ...r(d) });
      const g = (o - 16) * 0.36;
      s.push({ name: "lane-" + m.id, x: 8, y: u + 6, width: g, height: 36, text: m.label, fill: c(d), fontSize: 15 }), s.push({ name: "caption-" + m.id, x: 8 + g + 6, y: u + 6, width: o - 16 - g - 6, height: 56, text: Mt(t, m.id), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(d) }), t.cards.filter((h) => h.laneId === m.id).forEach((h, x) => s.push({ name: "card-" + h.id, x: 8, y: u + 72 + x * 64, width: o - 16, height: 56, text: Tt(t, h.id), fontSize: 15 })), u += f + 10;
    }), l = u;
  } else {
    const d = 116 + (Math.max(...a) + 1) * 88;
    t.lanes.forEach((f, g) => {
      const h = g * 244;
      s.push({ name: "column-" + f.id, x: h + 2, y: C, width: 240, height: d, ...r(g) }), s.push({ name: "lane-" + f.id, x: h + 8, y: C + 6, width: 228, height: 58, text: f.label, fill: c(g), fontSize: 16 }), s.push({ name: "caption-" + f.id, x: h + 8, y: C + 66, width: 228, height: 48, text: Mt(t, f.id), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(g) }), t.cards.filter((x) => x.laneId === f.id).forEach((x, p) => s.push({ name: "card-" + x.id, x: h + 8, y: C + 116 + p * 88, width: 228, height: 76, text: Tt(t, x.id), fontSize: 15 }));
    }), o = t.lanes.length * 244, l = C + d;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(o, 520), height: 34, text: Tn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: K(t, e, o) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: o, height: l };
}
const Y = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, ft(t)), K = (t, e, n) => 4 + (n - 8) * t.forecast.target / Y(t, e);
function ut(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function bn(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = ut(Y(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function Tt(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return Vt(n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + R(n.amount, t.forecast.currency), n);
}
function te(t, e) {
  const { width: n } = A(t, e.layout), s = t.forecast.target, a = ft(t), c = Y(t, e.layout), r = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: r, h: 14, rx: 7, color: y.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? y.accept : y.bar },
    { t: "line", x1: K(t, e.layout, n), y1: 36, x2: K(t, e.layout, n), y2: 62, color: y.ink, width: 2 },
    { t: "rect", x: K(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: y.ink, role: "edge-target" },
    { t: "text", x: K(t, e.layout, n), y: 72, text: "Target " + R(s, t.forecast.currency), color: y.ink, size: 14, anchor: "middle" }
  ];
}
const ne = {
  laneCues: !0,
  places: (t, e) => A(t, e),
  notes: (t, e, n, s) => gt(A(t, e).parts, t, n, s),
  editsBetween: J,
  layer: (t) => dt(t, te),
  chooser(t, e, n, s = {}) {
    const a = Ft(t, e).map((c) => Bt(t, e, c.id));
    return a.length < 2 ? null : Ut(I(t, "card-" + e, n, (c) => V(A(c, s).parts), (c, r) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r, { gapIn: 40, gapOut: 56 })), t, e, A(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = A(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !nt(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = Wn(t, e, i.id);
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
    const a = A(t, s), c = a.parts.find((m) => m.name === "handle-target"), r = Y(t, s), i = ut(r), o = r / (a.width - 8), l = { ...s, gaugeScale: r }, u = vn(t, { field: "target" });
    return (m) => {
      const d = t.forecast.target + Math.round((m.x - n.x - c.x) * o / i) * i, f = Math.min(u.max, Math.max(i, d));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: l, ...f !== d && { clampedReason: f < d ? u.reasons.max : "A target is at least " + R(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: bn,
  label: (t, e) => e === "handle-target" ? "Target, " + R(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + R(ut(Y(t)), t.forecast.currency) + "." : null
}, L = 48, N = 960, Q = 900;
function T(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, r = [], i = [], o = t.lanes.map((f) => t.cards.filter((g) => g.laneId === f.id).length);
  let l, u;
  if (n) {
    l = Math.max(300, e.width ?? 390);
    let f = L + c / a * Q;
    t.lanes.forEach((g, h) => {
      const x = Math.max(100 + (o[h] + 1) * 64, g.allocation / a * Q);
      i.push({ laneId: g.id, start: f, size: x }), f += x;
    }), u = f + 8;
  } else {
    let f = c / a * N;
    for (const g of t.lanes)
      i.push({ laneId: g.id, start: f, size: g.allocation / a * N }), f += g.allocation / a * N;
    l = Math.max(N, f), u = L + 100 + (Math.max(...o) + 1) * 64;
  }
  t.lanes.forEach((f, g) => {
    const { start: h, size: x } = i[g], p = G[g % G.length], k = n ? { x: 2, y: h + 1, width: l - 4, height: x - 2 } : { x: h + 1, y: L, width: Math.max(4, x - 2), height: u - L }, W = { x: k.x + 5, y: k.y, width: Math.max(10, k.width - 10) }, w = Ln(t, f.id) > 0;
    r.push({ name: "column-" + f.id, ...k, ...w ? { fill: H.fill, line: H.line, lineWidth: 2 } : { fill: z(p, 0.6), line: z(p, 0.1) } });
    const M = n ? W.width * 0.36 : W.width;
    if (r.push({ name: "lane-" + f.id, x: W.x, y: W.y + 6, width: M, height: 32, text: f.label, fill: p, fontSize: 15 }), r.push({
      name: "caption-" + f.id,
      x: n ? W.x + M + 6 : W.x,
      y: W.y + (n ? 6 : 40),
      width: n ? W.width - M - 6 : W.width,
      height: n ? 50 : 40,
      text: n ? Wt(t, f.id).replace(" · ", `
`) : Wt(t, f.id),
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12,
      ...w && { ink: H.ink }
    }), t.cards.filter((v) => v.laneId === f.id).forEach((v, S) => r.push({
      name: "card-" + v.id,
      x: W.x,
      y: W.y + 100 + S * 64,
      width: W.width,
      height: 56,
      text: Vt(v.label + `
` + R(v.amount, t.budget.currency), v),
      fontSize: 14
    })), g < t.lanes.length - 1) {
      const v = h + x;
      r.push(n ? { name: "handle-" + f.id, x: l - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + f.id, x: v - 22, y: L - 6, width: 44, height: 48 });
    }
  });
  const m = i[0], d = i.at(-1);
  for (const [f, g] of [[Xt, m.start], [Zt, d.start + d.size]])
    r.push(n ? { name: f, x: l - 96, y: g - 22, width: 88, height: 44 } : { name: f, x: g - 22, y: L - 6, width: 44, height: 48 });
  return { parts: r, width: l, height: u, segments: i, narrow: n, k: (n ? Q : N) / a };
}
const Xt = "handle-_first", Zt = "handle-_last", zt = (t) => t === Xt ? "start" : t === Zt ? "end" : null;
function ee(t, e) {
  const n = T(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: zn(t), color: y.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const r = n.segments[c], i = a.allocation, o = $n(t, a.id);
    if (n.narrow) {
      const l = r.start + 50, u = 8, m = n.width - 16;
      s.push({ t: "rect", x: u, y: l, w: m, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: u, y: l, w: Math.min(m, m * o / i || 0), h: 10, rx: 5, color: o > i ? y.refuse : y.bar }), a.floor !== void 0 && s.push({ t: "line", x1: u + m * a.floor / i, y1: l - 4, x2: u + m * a.floor / i, y2: l + 14, color: y.ink, width: 2 });
    } else {
      const l = n.k, u = L + 86;
      s.push({ t: "rect", x: r.start + 6, y: u, w: r.size - 12, h: 10, rx: 5, color: y.track }), s.push({ t: "rect", x: r.start + 6, y: u, w: Math.max(0, Math.min(r.size - 12, (r.size - 12) * o / i || 0)), h: 10, rx: 5, color: o > i ? y.refuse : y.bar }), a.floor !== void 0 && s.push({ t: "line", x1: r.start + a.floor * l, y1: u - 6, x2: r.start + a.floor * l, y2: u + 16, color: y.ink, width: 2 }), a.cap !== void 0 && r.start + a.cap * l <= n.width && s.push({ t: "line", x1: r.start + a.cap * l, y1: u - 6, x2: r.start + a.cap * l, y2: u + 16, color: y.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const l = r.start + r.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: l, x2: n.width - 2, y2: l, color: y.ink, width: 2 } : { t: "line", x1: l, y1: L, x2: l, y2: n.height, color: y.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: y.ink } : { t: "rect", x: l - 4, y: L + 2, w: 8, h: 30, rx: 4, color: y.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const c = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: y.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: L + 2, w: 8, h: 30, rx: 4, color: y.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((c) => c.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : L - 12,
      text: e.clamp.text,
      color: y.refuse,
      size: 13,
      bold: !0,
      anchor: n.narrow ? "start" : "middle",
      role: "clamp"
    });
  }
  return s;
}
const qt = (t, e) => Math.round(t / e) * e, ie = {
  laneCues: !0,
  notes: (t, e, n, s) => gt(T(t, e).parts, t, n, s),
  editsBetween: J,
  label: Jt,
  places(t, e) {
    const { parts: n, width: s, height: a } = T(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => dt(t, ee),
  chooser(t, e, n, s = {}) {
    const a = Ft(t, e).map((c) => Bt(t, e, c.id));
    return a.length < 2 ? null : Ut(I(t, "card-" + e, n, (c) => V(T(c, s).parts), (c, r) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(r)), t, e, T(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = T(t, a), r = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === r.laneId || !nt(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const o = _n(t, e, i.id);
      return o ? { laneId: i.id, reason: o, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = zt(e);
    if (a) return se(t, a, e, n, s);
    const c = e.slice(7), r = t.lanes.findIndex((h) => h.id === c), i = t.lanes[r + 1];
    if (r < 0 || !i) return null;
    const o = Sn(t, { laneId: c }), l = t.budget.step, u = (h) => {
      const x = Math.min(o.max, Math.max(o.min, qt(h, l)));
      return St(t, i.id, c, x);
    }, m = T(t, s), d = m.narrow ? Q / t.budget.total : N / t.budget.total, f = m.parts.find((h) => h.name === e), g = I(t, e, n, (h) => V(T(h, s).parts), (h) => h.varyFunc([0], ([x]) => St(t, i.id, c, x), { constraint: (x) => [
      ...en([o.min, x.lanes[r].allocation - t.lanes[r].allocation, o.max])
    ] }));
    return (h) => {
      const p = (m.narrow ? h.y - n.y - f.y : h.x - n.x - f.x) / d, k = g?.(h), W = k ? k.lanes[r].allocation - t.lanes[r].allocation : p, w = { next: u(W) };
      return p > o.max + l / 2 ? { ...w, clampedReason: o.reasons.max } : p < o.min - l / 2 ? { ...w, clampedReason: o.reasons.min } : w;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = zt(e);
    if (s) {
      const u = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (u ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], c = t.lanes.findIndex((u) => u.id === a), r = t.lanes[c + 1];
    if (c < 0 || !r) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", o = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: r.id }, to: { id: a }, amount: o } : { kind: "shift_budget", from: { id: a }, to: { id: r.id }, amount: o }];
  }
};
function se(t, e, n, s, a) {
  const c = T(t, a), r = c.parts.find((m) => m.name === n);
  if (!r) return null;
  const i = t.budget.total, o = t.budget.step, l = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, u = Rn(t);
  return (m) => {
    const d = (c.narrow ? m.y - s.y - r.y : m.x - s.x - r.x) / c.k, f = i + qt(e === "end" ? d : -d, o), g = lt(t, f, e);
    if (typeof g != "string") return { next: g, layout: l };
    const h = lt(t, Math.min(u.max, Math.max(u.min, f)), e);
    return { next: typeof h == "string" ? t : h, layout: l, clampedReason: g, refusal: g };
  };
}
const Qt = { "launch-plan": ct, "hiring-plan": ct, pipeline: ne, budget: ie };
function he(t, e) {
  Qt[t] = e;
}
function ue(t) {
  const e = Qt[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function de(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  me as amountLimits,
  ye as amountOf,
  fi as amountRules,
  we as bandOf,
  gi as behaviourEditsBetween,
  de as boardLayoutFor,
  yn as brokenWaits,
  Wt as budgetCaption,
  $n as budgetCommitted,
  zn as budgetHeader,
  ie as budgetKit,
  T as budgetLayout,
  Sn as budgetLimits,
  Ln as budgetOver,
  _n as budgetRefusal,
  xi as budgetRules,
  pi as budgetShiftLimits,
  mi as budgetShiftRefusal,
  Rn as budgetTotalBounds,
  yi as budgetTotalFixed,
  Ti as byOrder,
  fn as cascadeStops,
  zi as checkNest,
  Oi as checkNestMove,
  pn as checkTime,
  Nt as clockOf,
  dt as createBoardLayer,
  ke as currencyOf,
  at as dateName,
  Me as dayFromWords,
  an as dayMap,
  $ as dayWords,
  ve as days,
  We as downstreamTasks,
  hn as dragTaskEdge,
  Se as earliestLaunch,
  _e as edgeValues,
  Ai as extend,
  Le as extendWorkshopEdits,
  Re as goLiveSample,
  Jt as handleLabel,
  I as headlessDrag,
  $e as hireLagFor,
  wn as hireStarts,
  Te as hiringPlanRules,
  ze as hiringPlanSample,
  mn as holdOthers,
  nt as inside,
  Ei as isOrderKey,
  is as isOrgChart,
  D as isoAt,
  Oe as isoTime,
  ue as kitFor,
  Ae as landPlanNote,
  Ee as launchDayOn,
  Kt as launchFinish,
  ln as launchHard,
  Pe as launchIndex,
  E as launchLayout,
  Dt as launchLinkRefusal,
  It as launchLinkTargets,
  on as launchOverrun,
  Fe as launchPlanCaption,
  ct as launchPlanKit,
  rn as launchPlanLimits,
  Be as launchPlanRefusal,
  Ce as launchPlanRules,
  De as launchPlanSample,
  Ne as launchTaskText,
  He as launchTooEarly,
  y as layerInk,
  gn as legalRuns,
  U as lineWord,
  R as money,
  Ct as moneyExact,
  Ge as monthNames,
  wt as moveLaunch,
  un as movePlanStart,
  Pi as nestAlias,
  Fi as nestAreas,
  ss as nestAxes,
  Bi as nestCardText,
  Ci as nestDepth,
  Di as nestDrags,
  Ni as nestEmptyDrop,
  Hi as nestFamily,
  Gi as nestKids,
  Ki as nestLegal,
  Ui as nestMeasure,
  Vi as nestMeasureWords,
  Ii as nestPlace,
  as as nestQuadrants,
  Ji as nestRoots,
  Yi as nestRules,
  rs as nestScores,
  ji as nestSentence,
  Xi as nestSubtree,
  Ke as nextCardId,
  Ue as nextMonday,
  Ve as noteNumbers,
  ot as offsetOf,
  Zi as orderBetween,
  qi as orderKeys,
  Ie as ownField,
  gt as partNotes,
  V as partsGeometry,
  cn as pastTheLine,
  Mt as pipelineCaption,
  ft as pipelineForecast,
  Tn as pipelineGauge,
  ne as pipelineKit,
  A as pipelineLayout,
  vn as pipelineLimits,
  Wn as pipelineRefusal,
  wi as pipelineRules,
  vt as pipelineStageOver,
  ki as planBudgetMove,
  Je as planDrags,
  Ye as planEdit,
  je as planFixed,
  Xe as planLaunchPlanMove,
  Mi as planPipelineMove,
  Ze as planProblem,
  vi as planSamples,
  qe as planStartBy,
  dn as planWeeksProblem,
  Qe as planWords,
  be as presetRules,
  os as quadrantOf,
  ti as readClock,
  ni as readNoteNumbers,
  he as registerBoardKit,
  Qi as registerNestPlus,
  ei as renamedNumbers,
  xe as renderLayerShapes,
  Wi as restoreWorkshop,
  bi as roleOf,
  ii as runwayCap,
  si as runwayHeader,
  kn as runwayMonths,
  Mn as runwayWords,
  Si as sampleBudget,
  ai as sampleLaunchPlan,
  _i as samplePipeline,
  P as scheduleLaunch,
  ls as scoreBoard,
  cs as scoresIn,
  St as shiftBudget,
  B as shortDate,
  j as snapStep,
  xn as startHandle,
  b as startHandleCard,
  ts as tidyKeys,
  ri as timeFamily,
  oi as timeRuleKindIds,
  li as timeSentence,
  z as tint,
  Ht as tryTask,
  Li as validateBudget,
  ci as validateHiringPlan,
  hi as validateLaunchPlan,
  ns as validateNest,
  Ri as validatePipeline,
  Vt as w,
  yt as waitsRefusal,
  kt as weekdayAt,
  ui as weekendAt,
  lt as withBudgetTotal,
  Gt as withLink,
  sn as withPlanStart,
  tt as withTaskValue,
  J as workshopEditsBetween
};
