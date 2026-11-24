import { Vec2 as Mt, getElementPositionCheap as rn, translate as on, dragSpecToBehavior as ln, param as Ft, moreThan as Bt, lessThan as Ct, inOrder as cn } from "./dragology.mjs";
import { workshopOverrideLine as Dt, createBoardLayer as xt, laneColors as H, layerInk as w, workshopDestinations as Nt, workshopCandidate as Ht } from "./workshop-model.mjs";
import { renderLayerShapes as Me } from "./workshop-model.mjs";
import { startHandleCard as et, dayWords as $, scheduleLaunch as A, e as Kt, m as T, dateName as ot, lineWord as U, withPlanStart as hn, offsetOf as ht, launchLinkRefusal as Gt, snapStep as q, dayMap as dn, clockOf as It, waitsRefusal as vt, tryTask as Vt, launchPlanLimits as un, launchOverrun as fn, withTaskValue as K, hireStarts as Ut, isoAt as D, launchHard as Wt, pastTheLine as gn, dragTaskEdge as xn, moveLaunch as _t, movePlanStart as pn, planWeeksProblem as mn, cascadeStops as yn, legalRuns as wn, startHandle as kn, checkTime as Mn, holdOthers as vn, withLink as Jt, launchFinish as jt, weekdayAt as St, shortDate as B, brokenWaits as Wn, runwayMonths as _n, runwayWords as Sn } from "./workshop-plans.mjs";
import { a as We, d as _e, bandOf as Se, c as Re, dayFromWords as $e, g as Le, downstreamTasks as Te, earliestLaunch as Oe, edgeValues as ze, extendWorkshopEdits as Ae, goLiveSample as Ee, hireLagFor as Pe, hiringPlanRules as Fe, hiringPlanSample as Be, isoTime as Ce, landPlanNote as De, launchDayOn as Ne, launchIndex as He, launchPlanCaption as Ke, launchPlanRefusal as Ge, launchPlanRules as Ie, launchPlanSample as Ve, launchTaskText as Ue, launchTooEarly as Je, monthNames as je, n as Ye, nextMonday as Xe, b as Ze, o as qe, planDrags as Qe, planEdit as be, planFixed as ti, planLaunchPlanMove as ni, planPastRule as ei, planProblem as ii, planProblems as si, planStartBy as ai, planWords as ri, presetRules as oi, readClock as li, f as ci, r as hi, runwayCap as di, runwayHeader as ui, sampleLaunchPlan as fi, timeFamily as gi, timeProblems as xi, timeRuleKindIds as pi, timeSentence as mi, validateHiringPlan as yi, validateLaunchPlan as wi, weekendAt as ki } from "./workshop-plans.mjs";
import Q from "react";
import { withBudgetTotal as dt, pipelineForecast as pt, budgetOver as mt, pipelineLimits as Rn, pipelineRefusal as $n, pipelineCaption as Rt, pipelineStageOver as lt, budgetLimits as Ln, budgetRefusal as Tn, budgetCaption as On, budgetTotalBounds as zn, shiftBudget as $t, budgetCommitted as An } from "./workshop-rules.mjs";
import { amountRules as vi, behaviourEditsBetween as Wi, budgetRules as _i, budgetShiftLimits as Si, budgetShiftRefusal as Ri, budgetTotalFixed as $i, pipelineRules as Li, planBudgetMove as Ti, planPipelineMove as Oi, planSamples as zi, restoreWorkshop as Ai, sampleBudget as Ei, samplePipeline as Pi, validateBudget as Fi, validatePipeline as Bi } from "./workshop-rules.mjs";
import { byOrder as Di, checkNest as Ni, checkNestMove as Hi, extend as Ki, isOrderKey as Gi, nestAlias as Ii, nestAreas as Vi, nestCardText as Ui, nestDepth as Ji, nestDrags as ji, nestEmptyDrop as Yi, nestFamily as Xi, nestKids as Zi, nestLegal as qi, nestMeasure as Qi, nestMeasureWords as bi, nestPlace as ts, nestRoots as ns, nestRules as es, nestSentence as is, nestSubtree as ss, orderBetween as as, orderKeys as rs, registerNestPlus as os, roleOf as ls, tidyKeys as cs, validateNest as hs } from "./workshop-nest.mjs";
import { isOrgChart as us, nestAxes as fs, nestQuadrants as gs, nestScores as xs, quadrantOf as ps, scoreBoard as ms, scoresIn as ys } from "./workshop-nest-plus.mjs";
function j(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return Q.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ Q.createElement("g", { id: s.name, transform: on(s.x, s.y) }, /* @__PURE__ */ Q.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ Q.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function Y(t, e, n, s, a) {
  let l;
  const i = {
    draggable: (c) => (l ?? (l = c.d), s(c.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: Mt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!rn(i, t) || !l) return null;
  const r = ln(a(l, t), i);
  return (c) => r({ pointer: Mt(c.x, c.y) }).dropState;
}
const it = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Yt(t, e, n, s, a) {
  if (!t) return null;
  const l = e.cards.find((o) => o.id === n).laneId;
  return (o) => {
    const i = t(o);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const r = s.find((c) => c.name.startsWith("column-") && c.name !== "column-" + l && it(c, o));
    return r && a.find((c) => c.cards.find((u) => u.id === n).laneId === r.name.slice(7)) || i;
  };
}
function Xt(t, e) {
  const n = Dt(e);
  return n ? t + `
` + n : t;
}
const E = { fill: "#fde3d7", line: "#c2410c", ink: "#9a3412" };
function z(t, e) {
  const n = (s) => Math.round(parseInt(t.slice(s, s + 2), 16) * (1 - e) + 255 * e).toString(16).padStart(2, "0");
  return "#" + n(1) + n(3) + n(5);
}
function X(t, e) {
  if (t.clock && e.clock && t.clock.origin !== e.clock.origin) {
    const i = hn(t, ht(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...X(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (u) => JSON.stringify(u.lanes.map((m) => m.allocation)), r = ["end", "start"].map((u) => ({ edge: u, made: dt(t, e.budget.total, u) })).filter((u) => typeof u.made != "string"), c = r.find((u) => i(u.made) === i(e)) ?? r[0];
    if (c) return [{ kind: "set_budget_total", amount: e.budget.total, ...c.edge === "start" && { edge: "start" } }, ...X(c.made, e)];
  }
  const n = [];
  t.hiring && e.hiring && t.hiring.weeks !== e.hiring.weeks && n.push({ kind: "set_plan_weeks", weeks: e.hiring.weeks });
  const s = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of e.cards) {
    const r = s.get(i.id), c = { id: i.id };
    if (!r) {
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
    r.label !== i.label && n.push({ kind: "rename_card", card: c, label: i.label });
    const u = n.length;
    for (const m of r.dependsOn ?? []) i.dependsOn?.includes(m) || n.push({ kind: "unlink_tasks", card: c, waitsOn: { id: m } });
    for (const m of i.dependsOn ?? []) r.dependsOn?.includes(m) || n.push({ kind: "link_tasks", card: c, waitsOn: { id: m } });
    r.laneId !== i.laneId && n.push({ kind: "move_card", card: c, lane: { id: i.laneId } }), (n.length > u && i.duration !== void 0 && n.slice(u).some((m) => m.kind !== "move_card") || r.duration !== i.duration || (r.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: c, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && r.amount !== i.amount && n.push({ kind: "set_amount", card: c, amount: i.amount });
  }
  for (const i of t.cards) e.cards.some((r) => r.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  e.launch && t.launch?.day !== e.launch.day && n.push({ kind: "set_launch_day", day: e.launch.day }), e.hiring?.funding && t.hiring?.funding?.day !== e.hiring.funding.day && n.push({ kind: "set_funding", day: e.hiring.funding.day }), e.forecast && t.forecast?.target !== e.forecast.target && n.push({ kind: "set_target", amount: e.forecast.target });
  const a = e.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((r) => r.id === i.id)?.allocation ?? 0) })), l = a.filter((i) => i.by < 0), o = a.filter((i) => i.by > 0);
  for (const i of o)
    for (const r of l) {
      const c = Math.min(i.by, -r.by);
      c <= 0 || (n.push({ kind: "shift_budget", from: { id: r.id }, to: { id: i.id }, amount: c }), i.by -= c, r.by += c);
    }
  for (const i of e.lanes) {
    const r = t.lanes.find((c) => c.id === i.id);
    r && r.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label }), r && r.capacity !== i.capacity && n.push({ kind: "set_lane_capacity", lane: { id: i.id }, capacity: i.capacity ?? null });
  }
  return t.title !== e.title && n.push({ kind: "rename_workshop", title: e.title }), n;
}
function En(t) {
  const e = t.forecast?.currency;
  return `Forecast ${T(pt(t), e)} of ${T(t.forecast?.target ?? 0, e)}`;
}
function Pn(t) {
  const e = t.lanes.filter((n) => mt(t, n.id) > 0).length;
  return `${Kt(t.budget?.total ?? 0, t.budget?.currency)} · ` + (e ? `${e} ${e === 1 ? "team" : "teams"} over budget` : "balanced");
}
function Zt(t, e) {
  return t.cards.filter((n) => Gt(t, e, n.id) === null).map((n) => n.id);
}
function Fn(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const l = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, r) => i + Math.max(1, Math.ceil(r.length / l)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function yt(t, e, n, s) {
  const a = s.textColor ?? "#18302d", l = s.borderColor ?? "#667872", o = s.fontSize ?? 14;
  return t.map((i) => {
    const r = i.name.startsWith("handle-"), c = i.text ?? "";
    return { options: {
      id: i.name,
      text: c,
      name: e.cards.find((u) => "card-" + u.id === i.name)?.label ?? c,
      xPos: n.x + i.x,
      yPos: n.y + i.y,
      width: i.width,
      height: i.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${i.width} V ${i.height} H 0 Z`,
      backgroundColor: r ? "transparent" : i.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: i.ink ?? a,
      borderColor: i.line ?? l,
      borderWidth: r ? 0 : i.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      fontSize: Fn(c, i.fontSize ?? o, i.width - 12, i.height - 6)
    }, relationships: { associations: [] } };
  });
}
function qt(t, e) {
  const n = e.slice(7), s = et(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${$(t, A(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Kt(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${T(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${ot(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${ot(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${ot(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${U(t).charAt(0).toUpperCase() + U(t).slice(1)}, ${$(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const l = t.cards.find((i) => i.id === n);
  if (l) return `${l.label} length, ${l.duration} days. Left and Right change it.`;
  const o = t.lanes.findIndex((i) => i.id === n);
  return o >= 0 && t.lanes[o + 1] ? `Divider between ${t.lanes[o].label} and ${t.lanes[o + 1].label}. Left and Right move money.` : null;
}
const Qt = "#c2410c", st = "handle-_first", at = "handle-_last", Bn = 32, Cn = 44, Dn = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function F(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = A(t), l = !s && Wt(t) && t.cards.some((k) => k.override), o = s ? t.hiring.weeks * 7 : Wt(t) ? Math.max(t.launch.day, l ? Math.max(...[...a.values()].map((k) => Math.ceil(k.to))) : 0) : Math.ceil(t.launch.day * 4 / 3), i = gn(t), r = [], c = /* @__PURE__ */ new Map(), u = n ? 8 : 168, m = n ? 88 : u + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), f = e.dayWidth ? Math.max(h, Math.ceil(m + o * e.dayWidth)) : h, g = e.maxWidth !== void 0 && f > e.maxWidth ? Math.max(h, Math.floor(e.maxWidth)) : f, d = e.dayWidth && g === f ? e.dayWidth : (g - m) / o, x = (k) => H[t.lanes.findIndex((M) => M.id === k) % H.length], p = (k, M) => {
    const R = t.cards.find((I) => I.id === k), v = a.get(k), S = { x: u + v.from * d, y: M, width: (v.to - v.from) * d, height: n ? Cn : Bn };
    c.set(k, S);
    const G = i.has(k);
    if (r.push({
      name: "card-" + k,
      ...S,
      text: n ? "" : s ? R.label : `${R.label} · ${R.duration}d`,
      fill: G ? "#fde3d7" : n ? x(R.laneId) : s ? z(x(R.laneId), 0.45) : "#fffdf6",
      line: G || v.critical && !s ? Qt : "#667872",
      lineWidth: G || v.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const I = Dn(n, S.width), rt = n ? 44 : 22, wt = S.y + S.height / 2 - 22, kt = n ? Math.max(-12, S.x - rt) : S.x - rt;
      r.push({ name: kn(k), x: kt, y: wt, width: Math.max(24, S.x + I - kt), height: 44 }), r.push({ name: "handle-" + k, x: S.x + S.width - I, y: wt, width: I + rt, height: 44 });
    }
  };
  let y, _, W;
  if (n) {
    const k = (g - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, R) => {
      const v = 8 + R * (k + 8);
      r.push({ name: "column-" + M.id, x: v, y: 30, width: k, height: 72, fill: z(x(M.id), 0.6), line: z(x(M.id), 0.1) }), r.push({ name: "lane-" + M.id, x: v + 4, y: 34, width: k - 8, height: 28, text: M.label, fill: x(M.id), fontSize: 14 }), r.push({ name: "caption-" + M.id, x: v + 4, y: 64, width: k - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), W = 124, _ = 130, y = 138;
    for (const M of t.cards)
      p(M.id, y + 20), y += 64;
  } else {
    W = 48, _ = 56, y = _;
    for (const k of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === k.id), R = Math.max(92, M.length * 44 + 20);
      r.push({ name: "column-" + k.id, x: 0, y, width: g, height: R, fill: z(x(k.id), 0.65), line: z(x(k.id), 0.1) }), r.push({ name: "lane-" + k.id, x: 8, y: y + 8, width: u - 24, height: 32, text: k.label, fill: x(k.id), fontSize: 15 }), r.push({ name: "caption-" + k.id, x: 8, y: y + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, S) => p(v.id, y + 10 + S * 44)), y += R + 4;
    }
  }
  return s ? t.hiring.funding && !n && r.push({ name: "handle-funding", x: u + t.hiring.funding.day * d - 22, y: 4, width: 44, height: 44 }) : r.push({ name: "handle-launch", x: u + t.launch.day * d - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && r.push({ name: st, x: u - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && r.push({ name: at, x: u + o * d - 22, y: 8, width: 44, height: 44 }), { parts: r, width: g, height: y + 8, narrow: n, x0: u, dayW: d, gridTop: _, axisY: W, bars: c };
}
function Nn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Hn(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), l = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, o = e.y + e.height / 2;
  return { d: `M ${s} ${l} V ${o} H ${e.x}`, arrow: { x: e.x, y: o, angle: 0 } };
}
const Kn = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function Gn(t, e) {
  const n = F(t, e.layout), s = t.kind === "hiring-plan", a = A(t), l = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), o = It(t), i = [];
  if (o?.workdays)
    for (let h = 0; h < l; h++) St(o.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? w.canvasTrack : w.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (o && h.on && h.kind === "blackout") {
    const f = ht(o.origin, h.start), g = ht(o.origin, h.end) + 1, d = n.x0 + Math.max(0, f) * n.dayW, x = (Math.min(l, g) - Math.max(0, f)) * n.dayW;
    if (x <= 0) continue;
    i.push({ t: "rect", x: d, y: n.gridTop, w: x, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let p = d; p < d + x; p += 10) i.push({ t: "line", x1: p, y1: n.gridTop, x2: Math.min(d + x, p + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: n.gridTop + 22, text: h.label + " · " + B(h.start) + "–" + B(h.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= l; h++) {
    const f = n.x0 + h * n.dayW, g = o ? St(o.origin, h) === 1 : h % 7 === 0;
    if (!g && n.dayW < 6) continue;
    i.push({ t: "line", x1: f, y1: n.gridTop, x2: f, y2: n.height - 8, color: n.narrow ? g ? w.canvasWeek : w.canvasFaint : g ? w.week : w.faint, width: g ? 1 : 0.5 });
    const d = s && o && D(o.origin, h).slice(8) <= "07" && g, x = o ? s ? d ? B(D(o.origin, h)).replace(/^\d+ /, "") : "" : B(D(o.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    g && x && (!o || s || n.dayW * 7 > 44) && i.push({ t: "text", x: f + 3, y: n.axisY, text: x, color: w.canvasInk, size: 12 });
  }
  const r = new Set(Wn(t).map((h) => h.from + ">" + h.to));
  for (const h of t.cards) {
    for (const x of h.dependsOn ?? []) {
      const p = n.bars.get(x), y = n.bars.get(h.id);
      if (!p || !y) continue;
      const _ = a.get(x).critical && a.get(h.id).critical, W = t.cards.find((M) => M.id === x).label, k = r.has(x + ">" + h.id);
      i.push({
        t: "path",
        ...Hn(p, y),
        color: k ? w.refuse : _ ? Qt : w.ink,
        width: k || _ ? 2 : 1.5,
        ...k && { dash: "5 4", role: "broken-" + x + "-" + h.id },
        unlink: { cardId: h.id, waitsOn: x, label: k ? `Remove the link: ${h.label} waits on ${W}, and starts before it ends` : `Remove the link: ${h.label} waits on ${W}` }
      });
    }
    const f = Dt(h), g = a.get(h.id), d = n.bars.get(h.id);
    if (s) {
      const x = t.hiring.bands.find((_) => _.id === h.band), p = d.x + d.width, y = n.x0 + l * n.dayW;
      y > p && i.push({ t: "rect", x: p, y: d.y + d.height / 2 - 3, w: y - p, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(p + 6, y - 120),
        y: n.narrow ? d.y - 6 : d.y + d.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + B(D(o.origin, Ut(t, h.id))) + (x ? " · " + T(x.monthly, t.hiring.currency) + "/mo" : "") + (f ? " · " + f : ""),
        color: f ? E.ink : w.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    if (n.narrow) {
      const x = `${h.label} · ${h.duration}d` + (f ? " · moved anyway" : ""), p = Kn(x, g.critical), y = d.x + 2 + p <= n.width - 8;
      i.push({
        t: "text",
        x: y ? d.x + 2 : Math.max(8 + p, Math.min(n.width - 8, d.x + d.width)),
        anchor: y ? "start" : "end",
        y: d.y - 7,
        text: x,
        color: w.canvasInk,
        size: 13,
        bold: g.critical,
        halo: w.halo,
        role: "words-" + h.id
      });
    }
    g.critical || i.push({ t: "text", x: d.x + d.width + (n.narrow ? 48 : 24), y: d.y + d.height / 2 + 4, text: "+" + g.slack + "d", color: n.narrow ? w.canvasInk : w.ink, size: 12, role: "slack-" + h.id }), f && !n.narrow && i.push({ t: "text", x: d.x + d.width + (g.critical ? 24 : 64), y: d.y + d.height / 2 + 4, text: f, color: E.ink, size: 12, halo: w.halo, role: "mark-" + h.id });
  }
  if (o && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + l * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && o) {
    const h = n.height + 2;
    i.push({ t: "text", x: n.x0, y: h, text: "Starts " + $(t, 0), color: w.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const f = s ? "Ends " + $(t, t.hiring.weeks * 7 - 1) : U(t).charAt(0).toUpperCase() + U(t).slice(1) + " " + $(t, t.launch.day), g = n.x0 + (s ? l : t.launch.day) * n.dayW;
    i.push({ t: "text", x: g, y: h, text: f, color: s ? w.ink : w.launch, size: 11, bold: !0, anchor: "end", role: "span-end" });
  }
  if (!(s && n.narrow)) for (const h of t.cards) {
    if (!n.narrow && e.focus !== h.id) continue;
    const f = n.bars.get(h.id), g = f.y + 6, d = f.height - 12, [x, p] = n.narrow ? [f.x - 10, f.x + f.width + 4] : [f.x + 3, f.x + f.width - 9], y = n.narrow ? 0.55 : 0.8;
    i.push(
      { t: "rect", x, y: g, w: 6, h: d, rx: 3, color: w.ink, opacity: y, role: "grip-start-" + h.id },
      { t: "rect", x: p, y: g, w: 6, h: d, rx: 3, color: w.ink, opacity: y, role: "grip-end-" + h.id }
    );
  }
  if (s) {
    const h = _n(t), f = t.behaviour?.rules.find((x) => x.on && x.kind === "deadline"), g = f && f.kind === "deadline" && h < f.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + Sn(h),
      color: g || e.refused ? w.refuse : w.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = t.hiring.funding;
    if (d && d.day <= l) {
      const x = n.x0 + d.day * n.dayW;
      i.push({ t: "line", x1: x, y1: 26, x2: x, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: x - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), i.push({ t: "text", x: Math.max(x + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + T(d.amount, t.hiring.currency) + " · " + B(D(o.origin, d.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), e.clamp) {
      const x = n.parts.find((p) => p.name === e.clamp.name);
      x && i.push(...Tt(n, i, e.clamp.text, x, e.view));
    }
    return i;
  }
  const c = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: c, y1: n.narrow ? 112 : 26, x2: c, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: c - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  const u = jt(t), m = Math.max(0, ...[...a.values()].map((h) => h.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: o ? "Done " + $(t, Math.ceil(m) - 1) + " · " + U(t) + " " + $(t, t.launch.day) : `Done day ${u} · launch day ${t.launch.day}`,
    color: e.refused ? w.refuse : w.canvasInk,
    size: 14,
    bold: !0,
    role: "header"
  }), e.clamp) {
    const h = n.parts.find((f) => f.name === e.clamp.name);
    h && i.push(...Tt(n, i, e.clamp.text, h, e.view));
  }
  return i;
}
const b = 13, Lt = 16, bt = (t, e) => t * (e ? 0.64 : 0.6), In = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function Vn(t) {
  const e = t.size ?? 13, n = t.text.length * bt(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function Un(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let ct = null;
function Tt(t, e, n, s, a) {
  const l = [...t.bars.values()].map((p) => ({ x: p.x - 4, y: p.y - 3, w: p.width + 8, h: p.height + 6 }));
  for (const p of e)
    p.t === "text" ? l.push(Vn(p)) : p.t === "rect" && l.push({ x: p.x - 2, y: p.y - 2, w: p.w + 4, h: p.h + 4 });
  let o = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, r = t.gridTop + 2, c = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(o, a.x + 8) >= 160 && (o = Math.max(o, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(c, a.y + a.height - 8) - Math.max(r, a.y + 8) >= 40 && (r = Math.max(r, a.y + 8), c = Math.min(c, a.y + a.height - 8)));
  const u = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, m = JSON.stringify([n, u, o, i, r, c, l.map((p) => [p.x, p.y, p.w, p.h].map(Math.round))]);
  if (ct?.key === m) return ct.shapes;
  const h = bt(b, !0), f = Math.floor((i - o) / h), g = /* @__PURE__ */ new Map();
  for (const p of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = Un(n, Math.max(8, Math.floor(f * p)));
    y.length <= 4 && g.set(y.join(`
`), y);
  }
  let d = null;
  for (const p of g.values()) {
    const y = Math.max(...p.map((W) => W.length)) * h, _ = p.length * Lt + 2;
    if (!(y > i - o))
      for (let W = r; W + _ <= c; W += 3)
        for (let k = o; k + y <= i; k += 6) {
          const M = { x: k, y: W, w: y, h: _ }, R = Math.max(M.x - u.x, 0, u.x - (M.x + M.w)), v = Math.max(M.y - u.y, 0, u.y - (M.y + M.h)), S = Math.hypot(R, v) + (p.length - 1) * 24;
          d && S >= d.score || l.every((G) => In(M, G)) && (d = { box: M, lines: p, score: S });
        }
  }
  const x = d ? [{ t: "text", x: d.box.x, y: d.box.y + b - 1, text: n, lines: d.lines, lineHeight: Lt, color: w.refuse, size: b, bold: !0, role: "clamp" }] : [{
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
  return ct = { key: m, shapes: x }, x;
}
const tt = (t, e = 1, n) => {
  const s = (l, o) => Math.round(l / o) * o, a = { ...t, cards: t.cards.map((l) => {
    const o = l.id === n ? e : 1, i = { ...l, duration: Math.max(o, s(l.duration, o)), lag: Math.max(0, s(l.lag ?? 0, o)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, Ot = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Jn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const l = (i) => t.cards.find((r) => r.id === i)?.label ?? i, o = [
    ...Zt(t, a.id).map((i) => ({
      said: `${a.label} waits on ${l(i)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    })),
    ...(a.dependsOn ?? []).map((i) => ({
      said: `${a.label} stops waiting on ${l(i)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    }))
  ];
  return o.length ? o : `${a.label} has no task it can wait on.`;
}
function jn(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * q(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === st && t.clock) return [{ kind: "set_plan_start", start: D(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === at && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const l = et(e), o = l !== null && t.cards.find((c) => c.id === l);
  if (o) return [{ kind: "set_task", card: { id: o.id }, duration: o.duration - a, lag: (o.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), r = i && t.cards.find((c) => c.id === i[2]);
  return r ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: r.id }, duration: r.duration + a }] : [{ kind: "set_task", card: { id: r.id }, lag: (r.lag ?? 0) + a }] : null;
}
const ut = {
  laneCues: !1,
  notes(t, e, n, s) {
    return yt(ut.places(t, e).parts, t, n, s);
  },
  editsBetween: X,
  label: qt,
  places(t, e) {
    const n = Nn(t, F(t, e), (s) => {
      const a = t.cards.filter((o) => o.laneId === s), l = A(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((o) => l.get(o.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => xt(t, Gn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((l) => l.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (Ot(t) ? qn : ie)(t, e, a, Zt(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const l = F(t, a);
    for (const g of t.cards) {
      if (g.id === e || !it(l.bars.get(g.id), s)) continue;
      const d = Gt(t, e, g.id);
      return d ? { laneId: g.laneId, reason: d } : null;
    }
    const o = t.cards.find((g) => g.id === e), i = (o.lag ?? 0) + Math.round((s.x - n.x - l.bars.get(e).x) / l.dayW), r = (g) => {
      const d = { kind: "set_task", card: { id: e }, lag: g };
      return { edit: d, to: ft(t, d) };
    }, c = q(t), u = A(t).get(e).start - (o.lag ?? 0), m = (g) => Math.max(g, -u);
    if (Ot(t)) {
      const g = A(t).get(e), d = Math.round(g.from + (s.x - n.x - l.bars.get(e).x) / l.dayW), x = (o.lag ?? 0) + dn(It(t)).idx(d) - g.start, p = m(Math.round(x / c) * c);
      if (p < -c && o.dependsOn?.length) return { laneId: o.laneId, reason: vt(t, e, p), override: r(p) };
      const y = Vt(t, e, { lag: Math.max(0, p) });
      return typeof y == "string" ? { laneId: o.laneId, reason: y, lands: !0, override: r(Math.max(0, p)) } : null;
    }
    const h = m(Math.round(i / c) * c);
    if (h < -c && o.dependsOn?.length) return { laneId: o.laneId, reason: vt(t, e, h), override: r(h) };
    const f = un(t, { cardId: e, field: "lag" });
    return i > f.max ? { laneId: o.laneId, reason: fn(K(t, { cardId: e, field: "lag" }, i), e) ?? f.reasons.max, override: r(i) } : null;
  },
  handleDrag(t, e, n, s) {
    const a = F(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const l = et(e);
    if (l !== null) return t.cards.some((i) => i.id === l) ? zt(t, l, "start", n, a, e) : null;
    const o = e.slice(7);
    return t.cards.some((i) => i.id === o) ? zt(t, o, "end", n, a, e) : e === "handle-launch" ? Qn(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? ne(t, n, a) : e === st && t.clock ? bn(t, n, a, s) : e === at && t.hiring ? te(t, n, a, s) : null;
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(t, e, n) {
    const s = F(t, n);
    return s.narrow || e.x < s.x0 ? null : (e.x - s.x0) / s.dayW;
  },
  keyEdit: jn,
  overrideWords: ft,
  keyChoices: Jn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = et(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function zt(t, e, n, s, a, l) {
  const o = a.parts.find((i) => i.name === l);
  return o ? (i) => {
    const r = xn(t, e, n, (i.x - s.x - o.x) / a.dayW);
    if (r.next) return { next: r.next, ...r.reason && { clampedReason: r.reason } };
    const c = r.values.lag, u = Yn(t, e, c) + Xn(t, e, c, r.values.duration) - 1;
    return {
      next: Zn(t, e, r.values) ?? t,
      clampedReason: r.refusal,
      refusal: r.refusal,
      override: {
        edit: { kind: "set_task", card: { id: e }, lag: c, duration: r.values.duration },
        to: n === "start" || t.kind === "hiring-plan" ? ft(t, { kind: "set_task", card: { id: e }, lag: c, duration: r.values.duration }) : "to end " + $(t, u)
      }
    };
  } : null;
}
function ft(t, e) {
  if (e.kind !== "set_task") return;
  const n = typeof e.card == "object" && e.card && "id" in e.card ? e.card.id : null, s = n ? t.cards.find((i) => i.id === n) : void 0;
  if (!s) return;
  let a = t;
  e.lag !== void 0 && (a = K(a, { cardId: s.id, field: "lag" }, e.lag)), e.duration !== void 0 && (a = K(a, { cardId: s.id, field: "duration" }, e.duration));
  const l = A(a).get(s.id);
  return t.kind === "hiring-plan" && t.clock ? "to start work " + $(a, Ut(a, s.id)) + " (recruiting from " + $(a, l.from) + ")" : (e.lag === void 0 || e.lag === (s.lag ?? 0)) && e.duration !== void 0 && e.duration !== s.duration ? "to end " + $(a, l.to - 1) : "to start " + $(a, l.from);
}
function Yn(t, e, n) {
  return A(K(t, { cardId: e, field: "lag" }, n)).get(e).from;
}
function Xn(t, e, n, s) {
  const a = A(K(K(t, { cardId: e, field: "lag" }, n), { cardId: e, field: "duration" }, s)).get(e);
  return a.to - a.from;
}
function Zn(t, e, n) {
  const s = t.cards.find((r) => r.id === e), a = q(t), l = s.lag ?? 0, o = s.duration ?? 1, i = (r, c) => Math.sign(c - r) * a;
  for (let r = { ...n }; r.lag !== l || r.duration !== o; ) {
    if (r.lag !== l) {
      const u = i(r.lag, l);
      r = { lag: r.lag + u, duration: r.duration - u };
    } else r = { lag: l, duration: r.duration + i(r.duration, o) };
    const c = Vt(t, e, { lag: r.lag, duration: r.duration });
    if (typeof c != "string") return c;
  }
  return null;
}
function qn(t, e, n, s, a, l) {
  const o = q(t), i = yn(t), r = t.cards[n].laneId, c = (d) => {
    if (!i) return d;
    const x = vn(t, d, /* @__PURE__ */ new Set([e]));
    return typeof x == "string" ? d : x;
  }, u = (d) => c(tt(d, o, e)), m = (d) => j(F(c(d), l).parts, s.map((x) => "card-" + x)), f = (l.narrow ? [r] : t.lanes.map((d) => d.id)).flatMap((d) => wn(t, e, "lag", d === r ? void 0 : d).map((x) => ({ laneId: d, run: x })));
  if (!f.length) return () => t;
  const g = Y(t, "card-" + e, a, m, (d, x) => {
    const p = d.closest(f.map(({ laneId: y, run: [_, W] }) => d.vary(
      { ...x, cards: x.cards.map((k, M) => M === n ? { ...k, laneId: y, lag: Math.min(W, Math.max(_, k.lag ?? 0)) } : k) },
      Ft("cards", n, "lag"),
      { constraint: (k) => [Bt(k.cards[n].lag ?? 0, _ - 0.49), Ct(k.cards[n].lag ?? 0, W + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? d.closest(s.map((y) => d.dropTarget("target-" + y, Jt(x, e, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(p).withBranchTransition(120).onDrop(u) : p.onDrop(u);
  });
  return g ? (d) => u(g(d)) : null;
}
function Qn(t, e, n, s) {
  const a = n.parts.find((o) => o.name === "handle-launch");
  if (!a) return null;
  const l = { ...s, dayWidth: n.dayW };
  return (o) => {
    const i = _t(t, t.launch.day + Math.round((o.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: l, ...i.reason && { clampedReason: i.reason } };
    let r = t;
    const c = Math.sign(t.launch.day - i.day);
    for (let u = i.day + c; c && u !== t.launch.day; u += c) {
      const m = _t(t, u);
      if (m.next) {
        r = m.next;
        break;
      }
    }
    return { next: r, layout: l, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function bn(t, e, n, s) {
  const a = n.parts.find((o) => o.name === st);
  if (!a) return null;
  const l = { ...s, dayWidth: n.dayW };
  return (o) => {
    const i = pn(t, (o.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: l } : { next: t, layout: l, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function te(t, e, n, s) {
  const a = n.parts.find((i) => i.name === at);
  if (!a) return null;
  const l = { ...s, dayWidth: n.dayW }, o = t.hiring.weeks;
  return (i) => {
    const r = o + Math.round((i.x - e.x - a.x) / n.dayW / 7), c = mn(t, r);
    return c ? { next: t, layout: l, clampedReason: c, refusal: c } : { next: { ...t, hiring: { ...t.hiring, weeks: r } }, layout: l };
  };
}
function ne(t, e, n) {
  const s = n.parts.find((r) => r.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, l = q(t), o = t.hiring.weeks * 7, i = (r) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: r } } });
  return (r) => {
    const c = a + Math.round((r.x - e.x - s.x) / n.dayW / l) * l, u = Math.min(o, Math.max(0, c)), m = ee(t, i(u));
    return m ? { next: t, clampedReason: m, refusal: m } : { next: i(u), ...u !== c && { clampedReason: u > c ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function ee(t, e) {
  const n = t.behaviour ? Mn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function ie(t, e, n, s, a, l) {
  const o = t.launch.day, i = (c) => j(F(c, l).parts, s.map((u) => "card-" + u)), r = Y(t, "card-" + e, a, i, (c, u) => {
    const m = l.narrow ? u.lanes.filter((f) => f.id === u.cards[n].laneId) : u.lanes, h = c.closest(m.map((f) => c.vary(
      { ...u, cards: u.cards.map((g, d) => d === n ? { ...g, laneId: f.id, lag: g.lag ?? 0 } : g) },
      Ft("cards", n, "lag"),
      { constraint: (g) => [Bt(g.cards[n].lag ?? 0, -1e-3), Ct(jt(g), o + 1e-3)] }
    )));
    return s.length ? c.closest(s.map((f) => c.dropTarget("target-" + f, Jt(u, e, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(h).withBranchTransition(120).onDrop((f) => tt(f)) : h.onDrop((f) => tt(f));
  });
  return r ? (c) => tt(r(c)) : null;
}
const C = 76;
function P(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((u) => t.cards.filter((m) => m.laneId === u.id).length), l = (u) => t.lanes[u].role === "won" ? "#bfe3cf" : t.lanes[u].role === "lost" ? "#e4dcdc" : H[u % H.length], o = (u) => lt(t, t.lanes[u].id) ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: z(l(u), 0.6), line: z(l(u), 0.1) }, i = (u) => lt(t, t.lanes[u].id) ? { ink: E.ink } : {};
  let r, c;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let u = C;
    t.lanes.forEach((m, h) => {
      const f = t.cards.filter((p) => p.laneId === m.id && p.override).length, g = 96 + (a[h] + 1) * 64 + f * 18;
      s.push({ name: "column-" + m.id, x: 2, y: u, width: r - 4, height: g, ...o(h) });
      const d = (r - 16) * 0.36;
      s.push({ name: "lane-" + m.id, x: 8, y: u + 6, width: d, height: 36, text: m.label, fill: l(h), fontSize: 15 }), s.push({ name: "caption-" + m.id, x: 8 + d + 6, y: u + 6, width: r - 16 - d - 6, height: 56, text: Rt(t, m.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(h) });
      let x = u + 72;
      for (const p of t.cards.filter((y) => y.laneId === m.id)) {
        const y = p.override ? 18 : 0;
        s.push({ name: "card-" + p.id, x: 8, y: x, width: r - 16, height: 56 + y, text: At(t, p.id), fontSize: 15 }), x += 64 + y;
      }
      u += g + 10;
    }), c = u;
  } else {
    const m = Math.max(...a), h = t.lanes.some((g) => lt(t, g.id)) ? 24 : 0, f = 116 + h + (m + 1) * 88;
    t.lanes.forEach((g, d) => {
      const x = d * 244;
      s.push({ name: "column-" + g.id, x: x + 2, y: C, width: 240, height: f, ...o(d) }), s.push({ name: "lane-" + g.id, x: x + 8, y: C + 6, width: 228, height: 58, text: g.label, fill: l(d), fontSize: 16 }), s.push({ name: "caption-" + g.id, x: x + 8, y: C + 66, width: 228, height: 48 + h, text: Rt(t, g.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(d) }), t.cards.filter((p) => p.laneId === g.id).forEach((p, y) => s.push({ name: "card-" + p.id, x: x + 8, y: C + 116 + h + y * 88, width: 228, height: 76, text: At(t, p.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, c = C + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: En(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: V(t, e, r) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: r, height: c };
}
const Z = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, pt(t)), V = (t, e, n) => 4 + (n - 8) * t.forecast.target / Z(t, e);
function gt(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function se(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = gt(Z(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function At(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return Xt(n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + T(n.amount, t.forecast.currency), n);
}
function ae(t, e) {
  const { width: n } = P(t, e.layout), s = t.forecast.target, a = pt(t), l = Z(t, e.layout), o = Math.max(n - 8, (n - 8) * s * 1.1 / l), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: o, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / l, h: 14, rx: 7, color: i ? w.accept : w.bar },
    { t: "line", x1: V(t, e.layout, n), y1: 36, x2: V(t, e.layout, n), y2: 62, color: w.ink, width: 2 },
    { t: "rect", x: V(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: w.ink, role: "edge-target" },
    { t: "text", x: V(t, e.layout, n), y: 72, text: "Target " + T(s, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const re = {
  laneCues: !0,
  places: (t, e) => P(t, e),
  notes: (t, e, n, s) => yt(P(t, e).parts, t, n, s),
  editsBetween: X,
  layer: (t) => xt(t, ae),
  chooser(t, e, n, s = {}) {
    const a = Nt(t, e).map((l) => Ht(t, e, l.id));
    return a.length < 2 ? null : Yt(Y(t, "card-" + e, n, (l) => j(P(l, s).parts), (l, o) => l.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(o, { gapIn: 40, gapOut: 56 })), t, e, P(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: l } = P(t, a), o = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === o.laneId || !it(l.find((c) => c.name === "column-" + i.id), s)) continue;
      const r = $n(t, e, i.id);
      return r ? { laneId: i.id, reason: r, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  /**
   * The target's grip: dragged right it raises the target, left it lowers it, in the gauge's steps, on the scale the
   * drag started with (the gauge draws on past its end for a target held beyond it). One set_target on the drop.
   */
  handleDrag(t, e, n, s) {
    if (e !== "handle-target") return null;
    const a = P(t, s), l = a.parts.find((m) => m.name === "handle-target"), o = Z(t, s), i = gt(o), r = o / (a.width - 8), c = { ...s, gaugeScale: o }, u = Rn(t, { field: "target" });
    return (m) => {
      const h = t.forecast.target + Math.round((m.x - n.x - l.x) * r / i) * i, f = Math.min(u.max, Math.max(i, h));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: c, ...f !== h && { clampedReason: f < h ? u.reasons.max : "A target is at least " + T(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: se,
  label: (t, e) => e === "handle-target" ? "Target, " + T(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + T(gt(Z(t)), t.forecast.currency) + "." : null
}, L = 48, N = 960, nt = 900, oe = { phone: 14, desktop: 32 }, tn = 18, J = (t, e = !1) => t.lanes.some((n) => mt(t, n.id) > 0) ? oe[e ? "phone" : "desktop"] : 0, Et = (t, e) => t.cards.reduce((n, s) => n + (s.laneId === e ? 64 + (s.override ? tn : 0) : 0), 0);
function O(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, l = e.gaugeAnchor === "start" ? a - s : 0, o = [], i = [];
  let r, c;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let h = L + l / a * nt;
    t.lanes.forEach((f, g) => {
      const d = Math.max(100 + J(t, !0) + Et(t, f.id) + 64, f.allocation / a * nt);
      i.push({ laneId: f.id, start: h, size: d }), h += d;
    }), c = h + 8;
  } else {
    let h = l / a * N;
    for (const f of t.lanes)
      i.push({ laneId: f.id, start: h, size: f.allocation / a * N }), h += f.allocation / a * N;
    r = Math.max(N, h), c = L + 100 + J(t, !1) + Math.max(...t.lanes.map((f) => Et(t, f.id))) + 64;
  }
  t.lanes.forEach((h, f) => {
    const { start: g, size: d } = i[f], x = H[f % H.length], p = n ? { x: 2, y: g + 1, width: r - 4, height: d - 2 } : { x: g + 1, y: L, width: Math.max(4, d - 2), height: c - L }, y = { x: p.x + 5, y: p.y, width: Math.max(10, p.width - 10) }, _ = mt(t, h.id) > 0;
    o.push({ name: "column-" + h.id, ...p, ..._ ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: z(x, 0.6), line: z(x, 0.1) } });
    const W = n ? y.width * 0.36 : y.width;
    o.push({ name: "lane-" + h.id, x: y.x, y: y.y + 6, width: W, height: 32, text: h.label, fill: x, fontSize: 15 });
    const k = J(t, n), M = On(t, h.id).replace(" · over budget", `
over budget`);
    o.push({
      name: "caption-" + h.id,
      x: n ? y.x + W + 6 : y.x,
      y: y.y + (n ? 6 : 40),
      width: n ? y.width - W - 6 : y.width,
      height: (n ? 50 : 40) + k,
      text: n ? M.replace(" · ", `
`) : M,
      fill: "transparent",
      lineWidth: 0,
      fontSize: n ? 15 : 12,
      ..._ && { ink: E.ink }
    });
    let R = y.y + 100 + k;
    for (const v of t.cards.filter((S) => S.laneId === h.id)) {
      const S = v.override ? tn : 0;
      o.push({
        name: "card-" + v.id,
        x: y.x,
        y: R,
        width: y.width,
        height: 56 + S,
        text: Xt(v.label + `
` + T(v.amount, t.budget.currency), v),
        fontSize: 14
      }), R += 64 + S;
    }
    if (f < t.lanes.length - 1) {
      const v = g + d;
      o.push(n ? { name: "handle-" + h.id, x: r - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + h.id, x: v - 22, y: L - 6, width: 44, height: 48 });
    }
  });
  const u = i[0], m = i.at(-1);
  for (const [h, f] of [[nn, u.start], [en, m.start + m.size]])
    o.push(n ? { name: h, x: r - 96, y: f - 22, width: 88, height: 44 } : { name: h, x: f - 22, y: L - 6, width: 44, height: 48 });
  return { parts: o, width: r, height: c, segments: i, narrow: n, k: (n ? nt : N) / a };
}
const nn = "handle-_first", en = "handle-_last", Pt = (t) => t === nn ? "start" : t === en ? "end" : null;
function le(t, e) {
  const n = O(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: Pn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, l) => {
    const o = n.segments[l], i = a.allocation, r = An(t, a.id);
    if (n.narrow) {
      const c = o.start + 50 + J(t, !0), u = 8, m = n.width - 16;
      s.push({ t: "rect", x: u, y: c, w: m, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: u, y: c, w: Math.min(m, m * r / i || 0), h: 10, rx: 5, color: r > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: u + m * a.floor / i, y1: c - 4, x2: u + m * a.floor / i, y2: c + 14, color: w.ink, width: 2 });
    } else {
      const c = n.k, u = L + 86 + J(t, !1);
      s.push({ t: "rect", x: o.start + 6, y: u, w: o.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: o.start + 6, y: u, w: Math.max(0, Math.min(o.size - 12, (o.size - 12) * r / i || 0)), h: 10, rx: 5, color: r > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: o.start + a.floor * c, y1: u - 6, x2: o.start + a.floor * c, y2: u + 16, color: w.ink, width: 2 }), a.cap !== void 0 && o.start + a.cap * c <= n.width && s.push({ t: "line", x1: o.start + a.cap * c, y1: u - 6, x2: o.start + a.cap * c, y2: u + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (l < t.lanes.length - 1) {
      const c = o.start + o.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: c, x2: n.width - 2, y2: c, color: w.ink, width: 2 } : { t: "line", x1: c, y1: L, x2: c, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: c - 4, y: L + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const l = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: l - 4, y: L + 2, w: 8, h: 30, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((l) => l.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : L - 12,
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
const sn = (t, e) => Math.round(t / e) * e, ce = {
  laneCues: !0,
  notes: (t, e, n, s) => yt(O(t, e).parts, t, n, s),
  editsBetween: X,
  label: qt,
  places(t, e) {
    const { parts: n, width: s, height: a } = O(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => xt(t, le),
  chooser(t, e, n, s = {}) {
    const a = Nt(t, e).map((l) => Ht(t, e, l.id));
    return a.length < 2 ? null : Yt(Y(t, "card-" + e, n, (l) => j(O(l, s).parts), (l, o) => l.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(o)), t, e, O(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: l } = O(t, a), o = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === o.laneId || !it(l.find((c) => c.name === "column-" + i.id), s)) continue;
      const r = Tn(t, e, i.id);
      return r ? { laneId: i.id, reason: r, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = Pt(e);
    if (a) return he(t, a, e, n, s);
    const l = e.slice(7), o = t.lanes.findIndex((d) => d.id === l), i = t.lanes[o + 1];
    if (o < 0 || !i) return null;
    const r = Ln(t, { laneId: l }), c = t.budget.step, u = (d) => {
      const x = Math.min(r.max, Math.max(r.min, sn(d, c)));
      return $t(t, i.id, l, x);
    }, m = O(t, s), h = m.narrow ? nt / t.budget.total : N / t.budget.total, f = m.parts.find((d) => d.name === e), g = Y(t, e, n, (d) => j(O(d, s).parts), (d) => d.varyFunc([0], ([x]) => $t(t, i.id, l, x), { constraint: (x) => [
      ...cn([r.min, x.lanes[o].allocation - t.lanes[o].allocation, r.max])
    ] }));
    return (d) => {
      const p = (m.narrow ? d.y - n.y - f.y : d.x - n.x - f.x) / h, y = g?.(d), _ = y ? y.lanes[o].allocation - t.lanes[o].allocation : p, W = { next: u(_) };
      return p > r.max + c / 2 ? { ...W, clampedReason: r.reasons.max } : p < r.min - c / 2 ? { ...W, clampedReason: r.reasons.min } : W;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = Pt(e);
    if (s) {
      const u = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (u ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], l = t.lanes.findIndex((u) => u.id === a), o = t.lanes[l + 1];
    if (l < 0 || !o) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", r = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: o.id }, to: { id: a }, amount: r } : { kind: "shift_budget", from: { id: a }, to: { id: o.id }, amount: r }];
  }
};
function he(t, e, n, s, a) {
  const l = O(t, a), o = l.parts.find((m) => m.name === n);
  if (!o) return null;
  const i = t.budget.total, r = t.budget.step, c = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, u = zn(t);
  return (m) => {
    const h = (l.narrow ? m.y - s.y - o.y : m.x - s.x - o.x) / l.k, f = i + sn(e === "end" ? h : -h, r), g = dt(t, f, e);
    if (typeof g != "string") return { next: g, layout: c };
    const d = dt(t, Math.min(u.max, Math.max(u.min, f)), e);
    return { next: typeof d == "string" ? t : d, layout: c, clampedReason: g, refusal: g };
  };
}
const an = { "launch-plan": ut, "hiring-plan": ut, pipeline: re, budget: ce };
function pe(t, e) {
  an[t] = e;
}
function me(t) {
  const e = an[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function ye(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  We as amountLimits,
  _e as amountOf,
  vi as amountRules,
  Se as bandOf,
  Wi as behaviourEditsBetween,
  ye as boardLayoutFor,
  Wn as brokenWaits,
  On as budgetCaption,
  An as budgetCommitted,
  Pn as budgetHeader,
  ce as budgetKit,
  O as budgetLayout,
  Ln as budgetLimits,
  mt as budgetOver,
  Tn as budgetRefusal,
  _i as budgetRules,
  Si as budgetShiftLimits,
  Ri as budgetShiftRefusal,
  zn as budgetTotalBounds,
  $i as budgetTotalFixed,
  Di as byOrder,
  yn as cascadeStops,
  Ni as checkNest,
  Hi as checkNestMove,
  Mn as checkTime,
  It as clockOf,
  xt as createBoardLayer,
  Re as currencyOf,
  ot as dateName,
  $e as dayFromWords,
  dn as dayMap,
  $ as dayWords,
  Le as days,
  Te as downstreamTasks,
  xn as dragTaskEdge,
  Oe as earliestLaunch,
  ze as edgeValues,
  Ki as extend,
  Ae as extendWorkshopEdits,
  Ee as goLiveSample,
  qt as handleLabel,
  Y as headlessDrag,
  Pe as hireLagFor,
  Ut as hireStarts,
  Fe as hiringPlanRules,
  Be as hiringPlanSample,
  vn as holdOthers,
  it as inside,
  Gi as isOrderKey,
  us as isOrgChart,
  D as isoAt,
  Ce as isoTime,
  me as kitFor,
  De as landPlanNote,
  Ne as launchDayOn,
  jt as launchFinish,
  Wt as launchHard,
  He as launchIndex,
  F as launchLayout,
  Gt as launchLinkRefusal,
  Zt as launchLinkTargets,
  fn as launchOverrun,
  Ke as launchPlanCaption,
  ut as launchPlanKit,
  un as launchPlanLimits,
  Ge as launchPlanRefusal,
  Ie as launchPlanRules,
  Ve as launchPlanSample,
  Ue as launchTaskText,
  Je as launchTooEarly,
  w as layerInk,
  wn as legalRuns,
  U as lineWord,
  T as money,
  Kt as moneyExact,
  je as monthNames,
  _t as moveLaunch,
  pn as movePlanStart,
  Ii as nestAlias,
  Vi as nestAreas,
  fs as nestAxes,
  Ui as nestCardText,
  Ji as nestDepth,
  ji as nestDrags,
  Yi as nestEmptyDrop,
  Xi as nestFamily,
  Zi as nestKids,
  qi as nestLegal,
  Qi as nestMeasure,
  bi as nestMeasureWords,
  ts as nestPlace,
  gs as nestQuadrants,
  ns as nestRoots,
  es as nestRules,
  xs as nestScores,
  is as nestSentence,
  ss as nestSubtree,
  Ye as nextCardId,
  Xe as nextMonday,
  Ze as noteNumbers,
  ht as offsetOf,
  as as orderBetween,
  rs as orderKeys,
  qe as ownField,
  yt as partNotes,
  j as partsGeometry,
  gn as pastTheLine,
  Rt as pipelineCaption,
  pt as pipelineForecast,
  En as pipelineGauge,
  re as pipelineKit,
  P as pipelineLayout,
  Rn as pipelineLimits,
  $n as pipelineRefusal,
  Li as pipelineRules,
  lt as pipelineStageOver,
  Ti as planBudgetMove,
  Qe as planDrags,
  be as planEdit,
  ti as planFixed,
  ni as planLaunchPlanMove,
  ei as planPastRule,
  Oi as planPipelineMove,
  ii as planProblem,
  si as planProblems,
  zi as planSamples,
  ai as planStartBy,
  mn as planWeeksProblem,
  ri as planWords,
  oi as presetRules,
  ps as quadrantOf,
  li as readClock,
  ci as readNoteNumbers,
  pe as registerBoardKit,
  os as registerNestPlus,
  hi as renamedNumbers,
  Me as renderLayerShapes,
  Ai as restoreWorkshop,
  ls as roleOf,
  di as runwayCap,
  ui as runwayHeader,
  _n as runwayMonths,
  Sn as runwayWords,
  Ei as sampleBudget,
  fi as sampleLaunchPlan,
  Pi as samplePipeline,
  A as scheduleLaunch,
  ms as scoreBoard,
  ys as scoresIn,
  $t as shiftBudget,
  B as shortDate,
  q as snapStep,
  kn as startHandle,
  et as startHandleCard,
  cs as tidyKeys,
  gi as timeFamily,
  xi as timeProblems,
  pi as timeRuleKindIds,
  mi as timeSentence,
  z as tint,
  Vt as tryTask,
  Fi as validateBudget,
  yi as validateHiringPlan,
  wi as validateLaunchPlan,
  hs as validateNest,
  Bi as validatePipeline,
  Xt as w,
  vt as waitsRefusal,
  St as weekdayAt,
  ki as weekendAt,
  dt as withBudgetTotal,
  Jt as withLink,
  hn as withPlanStart,
  K as withTaskValue,
  X as workshopEditsBetween
};
