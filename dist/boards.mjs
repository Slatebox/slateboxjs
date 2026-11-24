import { Vec2 as Mt, getElementPositionCheap as rn, translate as on, dragSpecToBehavior as ln, param as Ft, moreThan as Bt, lessThan as Ct, inOrder as cn } from "./dragology.mjs";
import { workshopOverrideLine as Dt, appearanceEditsBetween as hn, appearanceLook as dn, createBoardLayer as pt, laneColors as H, layerInk as w, workshopDestinations as Nt, workshopCandidate as Ht } from "./workshop-model.mjs";
import { renderLayerShapes as We } from "./workshop-model.mjs";
import { startHandleCard as et, dayWords as L, scheduleLaunch as A, e as Kt, m as T, dateName as ot, lineWord as U, withPlanStart as un, offsetOf as ht, launchLinkRefusal as Gt, snapStep as q, dayMap as fn, clockOf as It, waitsRefusal as vt, tryTask as Vt, launchPlanLimits as gn, launchOverrun as pn, withTaskValue as K, hireStarts as Ut, isoAt as D, launchHard as Wt, pastTheLine as xn, dragTaskEdge as mn, moveLaunch as _t, movePlanStart as yn, planWeeksProblem as wn, cascadeStops as kn, legalRuns as Mn, startHandle as vn, checkTime as Wn, holdOthers as _n, withLink as Jt, launchFinish as jt, weekdayAt as St, shortDate as B, brokenWaits as Sn, runwayMonths as Rn, runwayWords as Ln } from "./workshop-plans.mjs";
import { a as Se, d as Re, bandOf as Le, c as $e, dayFromWords as Te, g as Oe, downstreamTasks as ze, earliestLaunch as Ae, edgeValues as Ee, extendWorkshopEdits as Pe, goLiveSample as Fe, hireLagFor as Be, hiringPlanRules as Ce, hiringPlanSample as De, isoTime as Ne, landPlanNote as He, launchDayOn as Ke, launchIndex as Ge, launchPlanCaption as Ie, launchPlanRefusal as Ve, launchPlanRules as Ue, launchPlanSample as Je, launchTaskText as je, launchTooEarly as Ye, monthNames as Xe, n as Ze, nextMonday as qe, b as Qe, o as be, planDrags as ti, planEdit as ni, planFixed as ei, planLaunchPlanMove as ii, planPastRule as si, planProblem as ai, planProblems as ri, planStartBy as oi, planWords as li, presetRules as ci, readClock as hi, f as di, r as ui, runwayCap as fi, runwayHeader as gi, sampleLaunchPlan as pi, timeFamily as xi, timeProblems as mi, timeRuleKindIds as yi, timeSentence as wi, validateHiringPlan as ki, validateLaunchPlan as Mi, weekendAt as vi } from "./workshop-plans.mjs";
import Q from "react";
import { withBudgetTotal as dt, pipelineForecast as xt, budgetOver as mt, pipelineLimits as $n, pipelineRefusal as Tn, pipelineCaption as Rt, pipelineStageOver as lt, budgetLimits as On, budgetRefusal as zn, budgetCaption as An, budgetTotalBounds as En, shiftBudget as Lt, budgetCommitted as Pn } from "./workshop-rules.mjs";
import { amountRules as _i, behaviourEditsBetween as Si, budgetRules as Ri, budgetShiftLimits as Li, budgetShiftRefusal as $i, budgetTotalFixed as Ti, pipelineRules as Oi, planBudgetMove as zi, planPipelineMove as Ai, planSamples as Ei, restoreWorkshop as Pi, sampleBudget as Fi, samplePipeline as Bi, validateBudget as Ci, validatePipeline as Di } from "./workshop-rules.mjs";
import { byOrder as Hi, checkNest as Ki, checkNestMove as Gi, extend as Ii, isOrderKey as Vi, nestAlias as Ui, nestAreas as Ji, nestCardText as ji, nestDepth as Yi, nestDrags as Xi, nestEmptyDrop as Zi, nestFamily as qi, nestKids as Qi, nestLegal as bi, nestMeasure as ts, nestMeasureWords as ns, nestPlace as es, nestRoots as is, nestRules as ss, nestSentence as as, nestSubtree as rs, orderBetween as os, orderKeys as ls, registerNestPlus as cs, roleOf as hs, tidyKeys as ds, validateNest as us } from "./workshop-nest.mjs";
import { isOrgChart as gs, nestAxes as ps, nestQuadrants as xs, nestScores as ms, quadrantOf as ys, scoreBoard as ws, scoresIn as ks } from "./workshop-nest-plus.mjs";
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
  let c;
  const i = {
    draggable: (l) => (c ?? (c = l.d), s(l.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: Mt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!rn(i, t) || !c) return null;
  const r = ln(a(c, t), i);
  return (l) => r({ pointer: Mt(l.x, l.y) }).dropState;
}
const it = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Yt(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((o) => o.id === n).laneId;
  return (o) => {
    const i = t(o);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const r = s.find((l) => l.name.startsWith("column-") && l.name !== "column-" + c && it(l, o));
    return r && a.find((l) => l.cards.find((u) => u.id === n).laneId === r.name.slice(7)) || i;
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
    const i = un(t, ht(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...X(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (u) => JSON.stringify(u.lanes.map((m) => m.allocation)), r = ["end", "start"].map((u) => ({ edge: u, made: dt(t, e.budget.total, u) })).filter((u) => typeof u.made != "string"), l = r.find((u) => i(u.made) === i(e)) ?? r[0];
    if (l) return [{ kind: "set_budget_total", amount: e.budget.total, ...l.edge === "start" && { edge: "start" } }, ...X(l.made, e)];
  }
  const n = [];
  t.hiring && e.hiring && t.hiring.weeks !== e.hiring.weeks && n.push({ kind: "set_plan_weeks", weeks: e.hiring.weeks });
  const s = new Map(t.cards.map((i) => [i.id, i]));
  for (const i of e.cards) {
    const r = s.get(i.id), l = { id: i.id };
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
    r.label !== i.label && n.push({ kind: "rename_card", card: l, label: i.label });
    const u = n.length;
    for (const m of r.dependsOn ?? []) i.dependsOn?.includes(m) || n.push({ kind: "unlink_tasks", card: l, waitsOn: { id: m } });
    for (const m of i.dependsOn ?? []) r.dependsOn?.includes(m) || n.push({ kind: "link_tasks", card: l, waitsOn: { id: m } });
    r.laneId !== i.laneId && n.push({ kind: "move_card", card: l, lane: { id: i.laneId } }), (n.length > u && i.duration !== void 0 && n.slice(u).some((m) => m.kind !== "move_card") || r.duration !== i.duration || (r.lag ?? 0) !== (i.lag ?? 0)) && n.push({ kind: "set_task", card: l, duration: i.duration, lag: i.lag ?? 0 }), i.amount !== void 0 && r.amount !== i.amount && n.push({ kind: "set_amount", card: l, amount: i.amount });
  }
  for (const i of t.cards) e.cards.some((r) => r.id === i.id) || n.push({ kind: "remove_card", card: { id: i.id } });
  e.launch && t.launch?.day !== e.launch.day && n.push({ kind: "set_launch_day", day: e.launch.day }), e.hiring?.funding && t.hiring?.funding?.day !== e.hiring.funding.day && n.push({ kind: "set_funding", day: e.hiring.funding.day }), e.forecast && t.forecast?.target !== e.forecast.target && n.push({ kind: "set_target", amount: e.forecast.target });
  const a = e.lanes.map((i) => ({ id: i.id, by: (i.allocation ?? 0) - (t.lanes.find((r) => r.id === i.id)?.allocation ?? 0) })), c = a.filter((i) => i.by < 0), o = a.filter((i) => i.by > 0);
  for (const i of o)
    for (const r of c) {
      const l = Math.min(i.by, -r.by);
      l <= 0 || (n.push({ kind: "shift_budget", from: { id: r.id }, to: { id: i.id }, amount: l }), i.by -= l, r.by += l);
    }
  for (const i of e.lanes) {
    const r = t.lanes.find((l) => l.id === i.id);
    r && r.label !== i.label && n.push({ kind: "rename_lane", lane: { id: i.id }, label: i.label }), r && r.capacity !== i.capacity && n.push({ kind: "set_lane_capacity", lane: { id: i.id }, capacity: i.capacity ?? null });
  }
  return t.title !== e.title && n.push({ kind: "rename_workshop", title: e.title }), n.push(...hn(t, e)), n;
}
function Fn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${T(xt(t), e)} of ${T(t.forecast?.target ?? 0, e)}`;
}
function Bn(t) {
  const e = t.lanes.filter((n) => mt(t, n.id) > 0).length;
  return `${Kt(t.budget?.total ?? 0, t.budget?.currency)} · ` + (e ? `${e} ${e === 1 ? "team" : "teams"} over budget` : "balanced");
}
function Zt(t, e) {
  return t.cards.filter((n) => Gt(t, e, n.id) === null).map((n) => n.id);
}
function Cn(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, r) => i + Math.max(1, Math.ceil(r.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function yt(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", o = s.fontSize ?? 14;
  return t.map((i) => {
    const r = dn(e.appearance, i.name, i), l = { ...i, ...r, height: r.height ?? i.height }, u = l.name.startsWith("handle-"), m = l.text ?? "";
    return { options: {
      id: l.name,
      text: m,
      name: e.cards.find((h) => "card-" + h.id === l.name)?.label ?? m,
      xPos: n.x + l.x,
      yPos: n.y + l.y,
      width: l.width,
      height: l.height,
      shapeHint: "rectangle",
      vectorPath: `M 0 0 H ${l.width} V ${l.height} H 0 Z`,
      backgroundColor: u ? "transparent" : l.fill ?? s.backgroundColor ?? "#fffdf6",
      foregroundColor: l.ink ?? a,
      borderColor: l.line ?? c,
      borderWidth: u ? 0 : l.lineWidth ?? 1,
      ...s.fontFamily ? { fontFamily: s.fontFamily } : {},
      ...l.weight && { fontWeight: l.weight },
      fontSize: Cn(m, l.fontSize ?? o, l.width - 12, l.height - 6)
    }, relationships: { associations: [] } };
  });
}
function qt(t, e) {
  const n = e.slice(7), s = et(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${L(t, A(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Kt(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${T(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${ot(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${ot(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${ot(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${U(t).charAt(0).toUpperCase() + U(t).slice(1)}, ${L(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const o = t.lanes.findIndex((i) => i.id === n);
  return o >= 0 && t.lanes[o + 1] ? `Divider between ${t.lanes[o].label} and ${t.lanes[o + 1].label}. Left and Right move money.` : null;
}
const Qt = "#c2410c", st = "handle-_first", at = "handle-_last", Dn = 32, Nn = 44, Hn = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function F(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = A(t), c = !s && Wt(t) && t.cards.some((k) => k.override), o = s ? t.hiring.weeks * 7 : Wt(t) ? Math.max(t.launch.day, c ? Math.max(...[...a.values()].map((k) => Math.ceil(k.to))) : 0) : Math.ceil(t.launch.day * 4 / 3), i = xn(t), r = [], l = /* @__PURE__ */ new Map(), u = n ? 8 : 168, m = n ? 88 : u + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), f = e.dayWidth ? Math.max(h, Math.ceil(m + o * e.dayWidth)) : h, g = e.maxWidth !== void 0 && f > e.maxWidth ? Math.max(h, Math.floor(e.maxWidth)) : f, d = e.dayWidth && g === f ? e.dayWidth : (g - m) / o, p = (k) => H[t.lanes.findIndex((M) => M.id === k) % H.length], x = (k, M) => {
    const R = t.cards.find((I) => I.id === k), v = a.get(k), S = { x: u + v.from * d, y: M, width: (v.to - v.from) * d, height: n ? Nn : Dn };
    l.set(k, S);
    const G = i.has(k);
    if (r.push({
      name: "card-" + k,
      ...S,
      text: n ? "" : s ? R.label : `${R.label} · ${R.duration}d`,
      fill: G ? "#fde3d7" : n ? p(R.laneId) : s ? z(p(R.laneId), 0.45) : "#fffdf6",
      line: G || v.critical && !s ? Qt : "#667872",
      lineWidth: G || v.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const I = Hn(n, S.width), rt = n ? 44 : 22, wt = S.y + S.height / 2 - 22, kt = n ? Math.max(-12, S.x - rt) : S.x - rt;
      r.push({ name: vn(k), x: kt, y: wt, width: Math.max(24, S.x + I - kt), height: 44 }), r.push({ name: "handle-" + k, x: S.x + S.width - I, y: wt, width: I + rt, height: 44 });
    }
  };
  let y, _, W;
  if (n) {
    const k = (g - 16 - 8 * (t.lanes.length - 1)) / t.lanes.length;
    t.lanes.forEach((M, R) => {
      const v = 8 + R * (k + 8);
      r.push({ name: "column-" + M.id, x: v, y: 30, width: k, height: 72, fill: z(p(M.id), 0.6), line: z(p(M.id), 0.1) }), r.push({ name: "lane-" + M.id, x: v + 4, y: 34, width: k - 8, height: 28, text: M.label, fill: p(M.id), fontSize: 14 }), r.push({ name: "caption-" + M.id, x: v + 4, y: 64, width: k - 8, height: 34, text: "", fill: "transparent", lineWidth: 0, fontSize: 11 });
    }), W = 124, _ = 130, y = 138;
    for (const M of t.cards)
      x(M.id, y + 20), y += 64;
  } else {
    W = 48, _ = 56, y = _;
    for (const k of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === k.id), R = Math.max(92, M.length * 44 + 20);
      r.push({ name: "column-" + k.id, x: 0, y, width: g, height: R, fill: z(p(k.id), 0.65), line: z(p(k.id), 0.1) }), r.push({ name: "lane-" + k.id, x: 8, y: y + 8, width: u - 24, height: 32, text: k.label, fill: p(k.id), fontSize: 15 }), r.push({ name: "caption-" + k.id, x: 8, y: y + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, S) => x(v.id, y + 10 + S * 44)), y += R + 4;
    }
  }
  return s ? t.hiring.funding && !n && r.push({ name: "handle-funding", x: u + t.hiring.funding.day * d - 22, y: 4, width: 44, height: 44 }) : r.push({ name: "handle-launch", x: u + t.launch.day * d - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && r.push({ name: st, x: u - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && r.push({ name: at, x: u + o * d - 22, y: 8, width: 44, height: 44 }), { parts: r, width: g, height: y + 8, narrow: n, x0: u, dayW: d, gridTop: _, axisY: W, bars: l };
}
function Kn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Gn(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), c = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, o = e.y + e.height / 2;
  return { d: `M ${s} ${c} V ${o} H ${e.x}`, arrow: { x: e.x, y: o, angle: 0 } };
}
const In = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function Vn(t, e) {
  const n = F(t, e.layout), s = t.kind === "hiring-plan", a = A(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), o = It(t), i = [];
  if (o?.workdays)
    for (let h = 0; h < c; h++) St(o.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? w.canvasTrack : w.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (o && h.on && h.kind === "blackout") {
    const f = ht(o.origin, h.start), g = ht(o.origin, h.end) + 1, d = n.x0 + Math.max(0, f) * n.dayW, p = (Math.min(c, g) - Math.max(0, f)) * n.dayW;
    if (p <= 0) continue;
    i.push({ t: "rect", x: d, y: n.gridTop, w: p, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let x = d; x < d + p; x += 10) i.push({ t: "line", x1: x, y1: n.gridTop, x2: Math.min(d + p, x + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: n.gridTop + 22, text: h.label + " · " + B(h.start) + "–" + B(h.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const f = n.x0 + h * n.dayW, g = o ? St(o.origin, h) === 1 : h % 7 === 0;
    if (!g && n.dayW < 6) continue;
    i.push({ t: "line", x1: f, y1: n.gridTop, x2: f, y2: n.height - 8, color: n.narrow ? g ? w.canvasWeek : w.canvasFaint : g ? w.week : w.faint, width: g ? 1 : 0.5 });
    const d = s && o && D(o.origin, h).slice(8) <= "07" && g, p = o ? s ? d ? B(D(o.origin, h)).replace(/^\d+ /, "") : "" : B(D(o.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    g && p && (!o || s || n.dayW * 7 > 44) && i.push({ t: "text", x: f + 3, y: n.axisY, text: p, color: w.canvasInk, size: 12 });
  }
  const r = new Set(Sn(t).map((h) => h.from + ">" + h.to));
  for (const h of t.cards) {
    for (const p of h.dependsOn ?? []) {
      const x = n.bars.get(p), y = n.bars.get(h.id);
      if (!x || !y) continue;
      const _ = a.get(p).critical && a.get(h.id).critical, W = t.cards.find((M) => M.id === p).label, k = r.has(p + ">" + h.id);
      i.push({
        t: "path",
        ...Gn(x, y),
        color: k ? w.refuse : _ ? Qt : w.ink,
        width: k || _ ? 2 : 1.5,
        ...k && { dash: "5 4", role: "broken-" + p + "-" + h.id },
        unlink: { cardId: h.id, waitsOn: p, label: k ? `Remove the link: ${h.label} waits on ${W}, and starts before it ends` : `Remove the link: ${h.label} waits on ${W}` }
      });
    }
    const f = Dt(h), g = a.get(h.id), d = n.bars.get(h.id);
    if (s) {
      const p = t.hiring.bands.find((_) => _.id === h.band), x = d.x + d.width, y = n.x0 + c * n.dayW;
      y > x && i.push({ t: "rect", x, y: d.y + d.height / 2 - 3, w: y - x, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(x + 6, y - 120),
        y: n.narrow ? d.y - 6 : d.y + d.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + B(D(o.origin, Ut(t, h.id))) + (p ? " · " + T(p.monthly, t.hiring.currency) + "/mo" : "") + (f ? " · " + f : ""),
        color: f ? E.ink : w.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    if (n.narrow) {
      const p = `${h.label} · ${h.duration}d` + (f ? " · moved anyway" : ""), x = In(p, g.critical), y = d.x + 2 + x <= n.width - 8;
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
  if (o && !(s && n.narrow) && i.push({ t: "rect", x: n.x0 - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-first" }), s && !n.narrow && i.push({ t: "rect", x: n.x0 + c * n.dayW - 3, y: n.gridTop - 22, w: 6, h: 22, rx: 3, color: w.ink, opacity: 0.7, role: "edge-last" }), e.boardFocused && o) {
    const h = n.height + 2;
    i.push({ t: "text", x: n.x0, y: h, text: "Starts " + L(t, 0), color: w.accept, size: 11, bold: !0, anchor: "start", role: "span-start" });
    const f = s ? "Ends " + L(t, t.hiring.weeks * 7 - 1) : U(t).charAt(0).toUpperCase() + U(t).slice(1) + " " + L(t, t.launch.day), g = n.x0 + (s ? c : t.launch.day) * n.dayW;
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
    const h = Rn(t), f = t.behaviour?.rules.find((p) => p.on && p.kind === "deadline"), g = f && f.kind === "deadline" && h < f.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + Ln(h),
      color: g || e.refused ? w.refuse : w.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = t.hiring.funding;
    if (d && d.day <= c) {
      const p = n.x0 + d.day * n.dayW;
      i.push({ t: "line", x1: p, y1: 26, x2: p, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: p - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), i.push({ t: "text", x: Math.max(p + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + T(d.amount, t.hiring.currency) + " · " + B(D(o.origin, d.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), e.clamp) {
      const p = n.parts.find((x) => x.name === e.clamp.name);
      p && i.push(...Tt(n, i, e.clamp.text, p, e.view));
    }
    return i;
  }
  const l = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: l, y1: n.narrow ? 112 : 26, x2: l, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: l - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  const u = jt(t), m = Math.max(0, ...[...a.values()].map((h) => h.to));
  if (i.push({
    t: "text",
    x: n.narrow ? 8 : n.x0,
    y: n.narrow ? 18 : 20,
    text: o ? "Done " + L(t, Math.ceil(m) - 1) + " · " + U(t) + " " + L(t, t.launch.day) : `Done day ${u} · launch day ${t.launch.day}`,
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
const b = 13, $t = 16, bt = (t, e) => t * (e ? 0.64 : 0.6), Un = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function Jn(t) {
  const e = t.size ?? 13, n = t.text.length * bt(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function jn(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let ct = null;
function Tt(t, e, n, s, a) {
  const c = [...t.bars.values()].map((x) => ({ x: x.x - 4, y: x.y - 3, w: x.width + 8, h: x.height + 6 }));
  for (const x of e)
    x.t === "text" ? c.push(Jn(x)) : x.t === "rect" && c.push({ x: x.x - 2, y: x.y - 2, w: x.w + 4, h: x.h + 4 });
  let o = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, r = t.gridTop + 2, l = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(o, a.x + 8) >= 160 && (o = Math.max(o, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(l, a.y + a.height - 8) - Math.max(r, a.y + 8) >= 40 && (r = Math.max(r, a.y + 8), l = Math.min(l, a.y + a.height - 8)));
  const u = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, m = JSON.stringify([n, u, o, i, r, l, c.map((x) => [x.x, x.y, x.w, x.h].map(Math.round))]);
  if (ct?.key === m) return ct.shapes;
  const h = bt(b, !0), f = Math.floor((i - o) / h), g = /* @__PURE__ */ new Map();
  for (const x of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = jn(n, Math.max(8, Math.floor(f * x)));
    y.length <= 4 && g.set(y.join(`
`), y);
  }
  let d = null;
  for (const x of g.values()) {
    const y = Math.max(...x.map((W) => W.length)) * h, _ = x.length * $t + 2;
    if (!(y > i - o))
      for (let W = r; W + _ <= l; W += 3)
        for (let k = o; k + y <= i; k += 6) {
          const M = { x: k, y: W, w: y, h: _ }, R = Math.max(M.x - u.x, 0, u.x - (M.x + M.w)), v = Math.max(M.y - u.y, 0, u.y - (M.y + M.h)), S = Math.hypot(R, v) + (x.length - 1) * 24;
          d && S >= d.score || c.every((G) => Un(M, G)) && (d = { box: M, lines: x, score: S });
        }
  }
  const p = d ? [{ t: "text", x: d.box.x, y: d.box.y + b - 1, text: n, lines: d.lines, lineHeight: $t, color: w.refuse, size: b, bold: !0, role: "clamp" }] : [{
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
  return ct = { key: m, shapes: p }, p;
}
const tt = (t, e = 1, n) => {
  const s = (c, o) => Math.round(c / o) * o, a = { ...t, cards: t.cards.map((c) => {
    const o = c.id === n ? e : 1, i = { ...c, duration: Math.max(o, s(c.duration, o)), lag: Math.max(0, s(c.lag ?? 0, o)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, Ot = (t) => !!t.behaviour || t.kind === "hiring-plan";
function Yn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((r) => r.id === i)?.label ?? i, o = [
    ...Zt(t, a.id).map((i) => ({
      said: `${a.label} waits on ${c(i)}`,
      edits: [{ kind: "link_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    })),
    ...(a.dependsOn ?? []).map((i) => ({
      said: `${a.label} stops waiting on ${c(i)}`,
      edits: [{ kind: "unlink_tasks", card: { id: a.id }, waitsOn: { id: i } }]
    }))
  ];
  return o.length ? o : `${a.label} has no task it can wait on.`;
}
function Xn(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * q(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === st && t.clock) return [{ kind: "set_plan_start", start: D(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === at && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = et(e), o = c !== null && t.cards.find((l) => l.id === c);
  if (o) return [{ kind: "set_task", card: { id: o.id }, duration: o.duration - a, lag: (o.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), r = i && t.cards.find((l) => l.id === i[2]);
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
    const n = Kn(t, F(t, e), (s) => {
      const a = t.cards.filter((o) => o.laneId === s), c = A(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((o) => c.get(o.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => pt(t, Vn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (Ot(t) ? bn : ae)(t, e, a, Zt(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = F(t, a);
    for (const g of t.cards) {
      if (g.id === e || !it(c.bars.get(g.id), s)) continue;
      const d = Gt(t, e, g.id);
      return d ? { laneId: g.laneId, reason: d } : null;
    }
    const o = t.cards.find((g) => g.id === e), i = (o.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW), r = (g) => {
      const d = { kind: "set_task", card: { id: e }, lag: g };
      return { edit: d, to: ft(t, d) };
    }, l = q(t), u = A(t).get(e).start - (o.lag ?? 0), m = (g) => Math.max(g, -u);
    if (Ot(t)) {
      const g = A(t).get(e), d = Math.round(g.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), p = (o.lag ?? 0) + fn(It(t)).idx(d) - g.start, x = m(Math.round(p / l) * l);
      if (x < -l && o.dependsOn?.length) return { laneId: o.laneId, reason: vt(t, e, x), override: r(x) };
      const y = Vt(t, e, { lag: Math.max(0, x) });
      return typeof y == "string" ? { laneId: o.laneId, reason: y, lands: !0, override: r(Math.max(0, x)) } : null;
    }
    const h = m(Math.round(i / l) * l);
    if (h < -l && o.dependsOn?.length) return { laneId: o.laneId, reason: vt(t, e, h), override: r(h) };
    const f = gn(t, { cardId: e, field: "lag" });
    return i > f.max ? { laneId: o.laneId, reason: pn(K(t, { cardId: e, field: "lag" }, i), e) ?? f.reasons.max, override: r(i) } : null;
  },
  handleDrag(t, e, n, s) {
    const a = F(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = et(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? zt(t, c, "start", n, a, e) : null;
    const o = e.slice(7);
    return t.cards.some((i) => i.id === o) ? zt(t, o, "end", n, a, e) : e === "handle-launch" ? te(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? ie(t, n, a) : e === st && t.clock ? ne(t, n, a, s) : e === at && t.hiring ? ee(t, n, a, s) : null;
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(t, e, n) {
    const s = F(t, n);
    return s.narrow || e.x < s.x0 ? null : (e.x - s.x0) / s.dayW;
  },
  keyEdit: Xn,
  overrideWords: ft,
  keyChoices: Yn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = et(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function zt(t, e, n, s, a, c) {
  const o = a.parts.find((i) => i.name === c);
  return o ? (i) => {
    const r = mn(t, e, n, (i.x - s.x - o.x) / a.dayW);
    if (r.next) return { next: r.next, ...r.reason && { clampedReason: r.reason } };
    const l = r.values.lag, u = Zn(t, e, l) + qn(t, e, l, r.values.duration) - 1;
    return {
      next: Qn(t, e, r.values) ?? t,
      clampedReason: r.refusal,
      refusal: r.refusal,
      override: {
        edit: { kind: "set_task", card: { id: e }, lag: l, duration: r.values.duration },
        to: n === "start" || t.kind === "hiring-plan" ? ft(t, { kind: "set_task", card: { id: e }, lag: l, duration: r.values.duration }) : "to end " + L(t, u)
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
  const c = A(a).get(s.id);
  return t.kind === "hiring-plan" && t.clock ? "to start work " + L(a, Ut(a, s.id)) + " (recruiting from " + L(a, c.from) + ")" : (e.lag === void 0 || e.lag === (s.lag ?? 0)) && e.duration !== void 0 && e.duration !== s.duration ? "to end " + L(a, c.to - 1) : "to start " + L(a, c.from);
}
function Zn(t, e, n) {
  return A(K(t, { cardId: e, field: "lag" }, n)).get(e).from;
}
function qn(t, e, n, s) {
  const a = A(K(K(t, { cardId: e, field: "lag" }, n), { cardId: e, field: "duration" }, s)).get(e);
  return a.to - a.from;
}
function Qn(t, e, n) {
  const s = t.cards.find((r) => r.id === e), a = q(t), c = s.lag ?? 0, o = s.duration ?? 1, i = (r, l) => Math.sign(l - r) * a;
  for (let r = { ...n }; r.lag !== c || r.duration !== o; ) {
    if (r.lag !== c) {
      const u = i(r.lag, c);
      r = { lag: r.lag + u, duration: r.duration - u };
    } else r = { lag: c, duration: r.duration + i(r.duration, o) };
    const l = Vt(t, e, { lag: r.lag, duration: r.duration });
    if (typeof l != "string") return l;
  }
  return null;
}
function bn(t, e, n, s, a, c) {
  const o = q(t), i = kn(t), r = t.cards[n].laneId, l = (d) => {
    if (!i) return d;
    const p = _n(t, d, /* @__PURE__ */ new Set([e]));
    return typeof p == "string" ? d : p;
  }, u = (d) => l(tt(d, o, e)), m = (d) => j(F(l(d), c).parts, s.map((p) => "card-" + p)), f = (c.narrow ? [r] : t.lanes.map((d) => d.id)).flatMap((d) => Mn(t, e, "lag", d === r ? void 0 : d).map((p) => ({ laneId: d, run: p })));
  if (!f.length) return () => t;
  const g = Y(t, "card-" + e, a, m, (d, p) => {
    const x = d.closest(f.map(({ laneId: y, run: [_, W] }) => d.vary(
      { ...p, cards: p.cards.map((k, M) => M === n ? { ...k, laneId: y, lag: Math.min(W, Math.max(_, k.lag ?? 0)) } : k) },
      Ft("cards", n, "lag"),
      { constraint: (k) => [Bt(k.cards[n].lag ?? 0, _ - 0.49), Ct(k.cards[n].lag ?? 0, W + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? d.closest(s.map((y) => d.dropTarget("target-" + y, Jt(p, e, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(u) : x.onDrop(u);
  });
  return g ? (d) => u(g(d)) : null;
}
function te(t, e, n, s) {
  const a = n.parts.find((o) => o.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (o) => {
    const i = _t(t, t.launch.day + Math.round((o.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let r = t;
    const l = Math.sign(t.launch.day - i.day);
    for (let u = i.day + l; l && u !== t.launch.day; u += l) {
      const m = _t(t, u);
      if (m.next) {
        r = m.next;
        break;
      }
    }
    return { next: r, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function ne(t, e, n, s) {
  const a = n.parts.find((o) => o.name === st);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (o) => {
    const i = yn(t, (o.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function ee(t, e, n, s) {
  const a = n.parts.find((i) => i.name === at);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, o = t.hiring.weeks;
  return (i) => {
    const r = o + Math.round((i.x - e.x - a.x) / n.dayW / 7), l = wn(t, r);
    return l ? { next: t, layout: c, clampedReason: l, refusal: l } : { next: { ...t, hiring: { ...t.hiring, weeks: r } }, layout: c };
  };
}
function ie(t, e, n) {
  const s = n.parts.find((r) => r.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = q(t), o = t.hiring.weeks * 7, i = (r) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: r } } });
  return (r) => {
    const l = a + Math.round((r.x - e.x - s.x) / n.dayW / c) * c, u = Math.min(o, Math.max(0, l)), m = se(t, i(u));
    return m ? { next: t, clampedReason: m, refusal: m } : { next: i(u), ...u !== l && { clampedReason: u > l ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function se(t, e) {
  const n = t.behaviour ? Wn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function ae(t, e, n, s, a, c) {
  const o = t.launch.day, i = (l) => j(F(l, c).parts, s.map((u) => "card-" + u)), r = Y(t, "card-" + e, a, i, (l, u) => {
    const m = c.narrow ? u.lanes.filter((f) => f.id === u.cards[n].laneId) : u.lanes, h = l.closest(m.map((f) => l.vary(
      { ...u, cards: u.cards.map((g, d) => d === n ? { ...g, laneId: f.id, lag: g.lag ?? 0 } : g) },
      Ft("cards", n, "lag"),
      { constraint: (g) => [Bt(g.cards[n].lag ?? 0, -1e-3), Ct(jt(g), o + 1e-3)] }
    )));
    return s.length ? l.closest(s.map((f) => l.dropTarget("target-" + f, Jt(u, e, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(h).withBranchTransition(120).onDrop((f) => tt(f)) : h.onDrop((f) => tt(f));
  });
  return r ? (l) => tt(r(l)) : null;
}
const C = 76;
function P(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((u) => t.cards.filter((m) => m.laneId === u.id).length), c = (u) => t.lanes[u].role === "won" ? "#bfe3cf" : t.lanes[u].role === "lost" ? "#e4dcdc" : H[u % H.length], o = (u) => lt(t, t.lanes[u].id) ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: z(c(u), 0.6), line: z(c(u), 0.1) }, i = (u) => lt(t, t.lanes[u].id) ? { ink: E.ink } : {};
  let r, l;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let u = C;
    t.lanes.forEach((m, h) => {
      const f = t.cards.filter((x) => x.laneId === m.id && x.override).length, g = 96 + (a[h] + 1) * 64 + f * 18;
      s.push({ name: "column-" + m.id, x: 2, y: u, width: r - 4, height: g, ...o(h) });
      const d = (r - 16) * 0.36;
      s.push({ name: "lane-" + m.id, x: 8, y: u + 6, width: d, height: 36, text: m.label, fill: c(h), fontSize: 15 }), s.push({ name: "caption-" + m.id, x: 8 + d + 6, y: u + 6, width: r - 16 - d - 6, height: 56, text: Rt(t, m.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(h) });
      let p = u + 72;
      for (const x of t.cards.filter((y) => y.laneId === m.id)) {
        const y = x.override ? 18 : 0;
        s.push({ name: "card-" + x.id, x: 8, y: p, width: r - 16, height: 56 + y, text: At(t, x.id), fontSize: 15 }), p += 64 + y;
      }
      u += g + 10;
    }), l = u;
  } else {
    const m = Math.max(...a), h = t.lanes.some((g) => lt(t, g.id)) ? 24 : 0, f = 116 + h + (m + 1) * 88;
    t.lanes.forEach((g, d) => {
      const p = d * 244;
      s.push({ name: "column-" + g.id, x: p + 2, y: C, width: 240, height: f, ...o(d) }), s.push({ name: "lane-" + g.id, x: p + 8, y: C + 6, width: 228, height: 58, text: g.label, fill: c(d), fontSize: 16 }), s.push({ name: "caption-" + g.id, x: p + 8, y: C + 66, width: 228, height: 48 + h, text: Rt(t, g.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(d) }), t.cards.filter((x) => x.laneId === g.id).forEach((x, y) => s.push({ name: "card-" + x.id, x: p + 8, y: C + 116 + h + y * 88, width: 228, height: 76, text: At(t, x.id), fontSize: 15 }));
    }), r = t.lanes.length * 244, l = C + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(r, 520), height: 34, text: Fn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: V(t, e, r) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: r, height: l };
}
const Z = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, xt(t)), V = (t, e, n) => 4 + (n - 8) * t.forecast.target / Z(t, e);
function gt(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function re(t, e, { key: n }) {
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
function oe(t, e) {
  const { width: n } = P(t, e.layout), s = t.forecast.target, a = xt(t), c = Z(t, e.layout), o = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: o, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? w.accept : w.bar },
    { t: "line", x1: V(t, e.layout, n), y1: 36, x2: V(t, e.layout, n), y2: 62, color: w.ink, width: 2 },
    { t: "rect", x: V(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: w.ink, role: "edge-target" },
    { t: "text", x: V(t, e.layout, n), y: 72, text: "Target " + T(s, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const le = {
  laneCues: !0,
  places: (t, e) => P(t, e),
  notes: (t, e, n, s) => yt(P(t, e).parts, t, n, s),
  editsBetween: X,
  layer: (t) => pt(t, oe),
  chooser(t, e, n, s = {}) {
    const a = Nt(t, e).map((c) => Ht(t, e, c.id));
    return a.length < 2 ? null : Yt(Y(t, "card-" + e, n, (c) => j(P(c, s).parts), (c, o) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(o, { gapIn: 40, gapOut: 56 })), t, e, P(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = P(t, a), o = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === o.laneId || !it(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const r = Tn(t, e, i.id);
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
    const a = P(t, s), c = a.parts.find((m) => m.name === "handle-target"), o = Z(t, s), i = gt(o), r = o / (a.width - 8), l = { ...s, gaugeScale: o }, u = $n(t, { field: "target" });
    return (m) => {
      const h = t.forecast.target + Math.round((m.x - n.x - c.x) * r / i) * i, f = Math.min(u.max, Math.max(i, h));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: l, ...f !== h && { clampedReason: f < h ? u.reasons.max : "A target is at least " + T(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: re,
  label: (t, e) => e === "handle-target" ? "Target, " + T(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + T(gt(Z(t)), t.forecast.currency) + "." : null
}, $ = 48, N = 960, nt = 900, ce = { phone: 14, desktop: 32 }, tn = 18, J = (t, e = !1) => t.lanes.some((n) => mt(t, n.id) > 0) ? ce[e ? "phone" : "desktop"] : 0, Et = (t, e) => t.cards.reduce((n, s) => n + (s.laneId === e ? 64 + (s.override ? tn : 0) : 0), 0);
function O(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, o = [], i = [];
  let r, l;
  if (n) {
    r = Math.max(300, e.width ?? 390);
    let h = $ + c / a * nt;
    t.lanes.forEach((f, g) => {
      const d = Math.max(100 + J(t, !0) + Et(t, f.id) + 64, f.allocation / a * nt);
      i.push({ laneId: f.id, start: h, size: d }), h += d;
    }), l = h + 8;
  } else {
    let h = c / a * N;
    for (const f of t.lanes)
      i.push({ laneId: f.id, start: h, size: f.allocation / a * N }), h += f.allocation / a * N;
    r = Math.max(N, h), l = $ + 100 + J(t, !1) + Math.max(...t.lanes.map((f) => Et(t, f.id))) + 64;
  }
  t.lanes.forEach((h, f) => {
    const { start: g, size: d } = i[f], p = H[f % H.length], x = n ? { x: 2, y: g + 1, width: r - 4, height: d - 2 } : { x: g + 1, y: $, width: Math.max(4, d - 2), height: l - $ }, y = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) }, _ = mt(t, h.id) > 0;
    o.push({ name: "column-" + h.id, ...x, ..._ ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: z(p, 0.6), line: z(p, 0.1) } });
    const W = n ? y.width * 0.36 : y.width;
    o.push({ name: "lane-" + h.id, x: y.x, y: y.y + 6, width: W, height: 32, text: h.label, fill: p, fontSize: 15 });
    const k = J(t, n), M = An(t, h.id).replace(" · over budget", `
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
      o.push(n ? { name: "handle-" + h.id, x: r - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + h.id, x: v - 22, y: $ - 6, width: 44, height: 48 });
    }
  });
  const u = i[0], m = i.at(-1);
  for (const [h, f] of [[nn, u.start], [en, m.start + m.size]])
    o.push(n ? { name: h, x: r - 96, y: f - 22, width: 88, height: 44 } : { name: h, x: f - 22, y: $ - 6, width: 44, height: 48 });
  return { parts: o, width: r, height: l, segments: i, narrow: n, k: (n ? nt : N) / a };
}
const nn = "handle-_first", en = "handle-_last", Pt = (t) => t === nn ? "start" : t === en ? "end" : null;
function he(t, e) {
  const n = O(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: Bn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const o = n.segments[c], i = a.allocation, r = Pn(t, a.id);
    if (n.narrow) {
      const l = o.start + 50 + J(t, !0), u = 8, m = n.width - 16;
      s.push({ t: "rect", x: u, y: l, w: m, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: u, y: l, w: Math.min(m, m * r / i || 0), h: 10, rx: 5, color: r > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: u + m * a.floor / i, y1: l - 4, x2: u + m * a.floor / i, y2: l + 14, color: w.ink, width: 2 });
    } else {
      const l = n.k, u = $ + 86 + J(t, !1);
      s.push({ t: "rect", x: o.start + 6, y: u, w: o.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: o.start + 6, y: u, w: Math.max(0, Math.min(o.size - 12, (o.size - 12) * r / i || 0)), h: 10, rx: 5, color: r > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: o.start + a.floor * l, y1: u - 6, x2: o.start + a.floor * l, y2: u + 16, color: w.ink, width: 2 }), a.cap !== void 0 && o.start + a.cap * l <= n.width && s.push({ t: "line", x1: o.start + a.cap * l, y1: u - 6, x2: o.start + a.cap * l, y2: u + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const l = o.start + o.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: l, x2: n.width - 2, y2: l, color: w.ink, width: 2 } : { t: "line", x1: l, y1: $, x2: l, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: l - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: l - 4, y: $ + 2, w: 8, h: 30, rx: 4, color: w.ink });
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
const sn = (t, e) => Math.round(t / e) * e, de = {
  laneCues: !0,
  notes: (t, e, n, s) => yt(O(t, e).parts, t, n, s),
  editsBetween: X,
  label: qt,
  places(t, e) {
    const { parts: n, width: s, height: a } = O(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => pt(t, he),
  chooser(t, e, n, s = {}) {
    const a = Nt(t, e).map((c) => Ht(t, e, c.id));
    return a.length < 2 ? null : Yt(Y(t, "card-" + e, n, (c) => j(O(c, s).parts), (c, o) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(o)), t, e, O(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = O(t, a), o = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === o.laneId || !it(c.find((l) => l.name === "column-" + i.id), s)) continue;
      const r = zn(t, e, i.id);
      return r ? { laneId: i.id, reason: r, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = Pt(e);
    if (a) return ue(t, a, e, n, s);
    const c = e.slice(7), o = t.lanes.findIndex((d) => d.id === c), i = t.lanes[o + 1];
    if (o < 0 || !i) return null;
    const r = On(t, { laneId: c }), l = t.budget.step, u = (d) => {
      const p = Math.min(r.max, Math.max(r.min, sn(d, l)));
      return Lt(t, i.id, c, p);
    }, m = O(t, s), h = m.narrow ? nt / t.budget.total : N / t.budget.total, f = m.parts.find((d) => d.name === e), g = Y(t, e, n, (d) => j(O(d, s).parts), (d) => d.varyFunc([0], ([p]) => Lt(t, i.id, c, p), { constraint: (p) => [
      ...cn([r.min, p.lanes[o].allocation - t.lanes[o].allocation, r.max])
    ] }));
    return (d) => {
      const x = (m.narrow ? d.y - n.y - f.y : d.x - n.x - f.x) / h, y = g?.(d), _ = y ? y.lanes[o].allocation - t.lanes[o].allocation : x, W = { next: u(_) };
      return x > r.max + l / 2 ? { ...W, clampedReason: r.reasons.max } : x < r.min - l / 2 ? { ...W, clampedReason: r.reasons.min } : W;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = Pt(e);
    if (s) {
      const u = s === "start" ? n === "ArrowLeft" || n === "ArrowUp" : n === "ArrowRight" || n === "ArrowDown";
      return [{ kind: "set_budget_total", amount: t.budget.total + (u ? 1 : -1) * t.budget.step, edge: s }];
    }
    const a = /^handle-(.+)$/.exec(e)?.[1], c = t.lanes.findIndex((u) => u.id === a), o = t.lanes[c + 1];
    if (c < 0 || !o) return null;
    const i = n === "ArrowRight" || n === "ArrowDown", r = t.budget.step;
    return [i ? { kind: "shift_budget", from: { id: o.id }, to: { id: a }, amount: r } : { kind: "shift_budget", from: { id: a }, to: { id: o.id }, amount: r }];
  }
};
function ue(t, e, n, s, a) {
  const c = O(t, a), o = c.parts.find((m) => m.name === n);
  if (!o) return null;
  const i = t.budget.total, r = t.budget.step, l = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, u = En(t);
  return (m) => {
    const h = (c.narrow ? m.y - s.y - o.y : m.x - s.x - o.x) / c.k, f = i + sn(e === "end" ? h : -h, r), g = dt(t, f, e);
    if (typeof g != "string") return { next: g, layout: l };
    const d = dt(t, Math.min(u.max, Math.max(u.min, f)), e);
    return { next: typeof d == "string" ? t : d, layout: l, clampedReason: g, refusal: g };
  };
}
const an = { "launch-plan": ut, "hiring-plan": ut, pipeline: le, budget: de };
function ye(t, e) {
  an[t] = e;
}
function we(t) {
  const e = an[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget and a nested board have one.`);
  return e;
}
function ke(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Se as amountLimits,
  Re as amountOf,
  _i as amountRules,
  Le as bandOf,
  Si as behaviourEditsBetween,
  ke as boardLayoutFor,
  Sn as brokenWaits,
  An as budgetCaption,
  Pn as budgetCommitted,
  Bn as budgetHeader,
  de as budgetKit,
  O as budgetLayout,
  On as budgetLimits,
  mt as budgetOver,
  zn as budgetRefusal,
  Ri as budgetRules,
  Li as budgetShiftLimits,
  $i as budgetShiftRefusal,
  En as budgetTotalBounds,
  Ti as budgetTotalFixed,
  Hi as byOrder,
  kn as cascadeStops,
  Ki as checkNest,
  Gi as checkNestMove,
  Wn as checkTime,
  It as clockOf,
  pt as createBoardLayer,
  $e as currencyOf,
  ot as dateName,
  Te as dayFromWords,
  fn as dayMap,
  L as dayWords,
  Oe as days,
  ze as downstreamTasks,
  mn as dragTaskEdge,
  Ae as earliestLaunch,
  Ee as edgeValues,
  Ii as extend,
  Pe as extendWorkshopEdits,
  Fe as goLiveSample,
  qt as handleLabel,
  Y as headlessDrag,
  Be as hireLagFor,
  Ut as hireStarts,
  Ce as hiringPlanRules,
  De as hiringPlanSample,
  _n as holdOthers,
  it as inside,
  Vi as isOrderKey,
  gs as isOrgChart,
  D as isoAt,
  Ne as isoTime,
  we as kitFor,
  He as landPlanNote,
  Ke as launchDayOn,
  jt as launchFinish,
  Wt as launchHard,
  Ge as launchIndex,
  F as launchLayout,
  Gt as launchLinkRefusal,
  Zt as launchLinkTargets,
  pn as launchOverrun,
  Ie as launchPlanCaption,
  ut as launchPlanKit,
  gn as launchPlanLimits,
  Ve as launchPlanRefusal,
  Ue as launchPlanRules,
  Je as launchPlanSample,
  je as launchTaskText,
  Ye as launchTooEarly,
  w as layerInk,
  Mn as legalRuns,
  U as lineWord,
  T as money,
  Kt as moneyExact,
  Xe as monthNames,
  _t as moveLaunch,
  yn as movePlanStart,
  Ui as nestAlias,
  Ji as nestAreas,
  ps as nestAxes,
  ji as nestCardText,
  Yi as nestDepth,
  Xi as nestDrags,
  Zi as nestEmptyDrop,
  qi as nestFamily,
  Qi as nestKids,
  bi as nestLegal,
  ts as nestMeasure,
  ns as nestMeasureWords,
  es as nestPlace,
  xs as nestQuadrants,
  is as nestRoots,
  ss as nestRules,
  ms as nestScores,
  as as nestSentence,
  rs as nestSubtree,
  Ze as nextCardId,
  qe as nextMonday,
  Qe as noteNumbers,
  E as o,
  ht as offsetOf,
  os as orderBetween,
  ls as orderKeys,
  be as ownField,
  yt as partNotes,
  j as partsGeometry,
  xn as pastTheLine,
  Rt as pipelineCaption,
  xt as pipelineForecast,
  Fn as pipelineGauge,
  le as pipelineKit,
  P as pipelineLayout,
  $n as pipelineLimits,
  Tn as pipelineRefusal,
  Oi as pipelineRules,
  lt as pipelineStageOver,
  zi as planBudgetMove,
  ti as planDrags,
  ni as planEdit,
  ei as planFixed,
  ii as planLaunchPlanMove,
  si as planPastRule,
  Ai as planPipelineMove,
  ai as planProblem,
  ri as planProblems,
  Ei as planSamples,
  oi as planStartBy,
  wn as planWeeksProblem,
  li as planWords,
  ci as presetRules,
  ys as quadrantOf,
  hi as readClock,
  di as readNoteNumbers,
  ye as registerBoardKit,
  cs as registerNestPlus,
  ui as renamedNumbers,
  We as renderLayerShapes,
  Pi as restoreWorkshop,
  hs as roleOf,
  fi as runwayCap,
  gi as runwayHeader,
  Rn as runwayMonths,
  Ln as runwayWords,
  Fi as sampleBudget,
  pi as sampleLaunchPlan,
  Bi as samplePipeline,
  A as scheduleLaunch,
  ws as scoreBoard,
  ks as scoresIn,
  Lt as shiftBudget,
  B as shortDate,
  q as snapStep,
  vn as startHandle,
  et as startHandleCard,
  ds as tidyKeys,
  xi as timeFamily,
  mi as timeProblems,
  yi as timeRuleKindIds,
  wi as timeSentence,
  z as tint,
  Vt as tryTask,
  Ci as validateBudget,
  ki as validateHiringPlan,
  Mi as validateLaunchPlan,
  us as validateNest,
  Di as validatePipeline,
  Xt as w,
  vt as waitsRefusal,
  St as weekdayAt,
  vi as weekendAt,
  dt as withBudgetTotal,
  Jt as withLink,
  un as withPlanStart,
  K as withTaskValue,
  X as workshopEditsBetween
};
