import { Vec2 as vt, getElementPositionCheap as ln, translate as cn, dragSpecToBehavior as hn, param as Bt, moreThan as Dt, lessThan as Nt, inOrder as dn } from "./dragology.mjs";
import { workshopOverrideLine as Ht, appearanceEditsBetween as un, appearanceLook as fn, f as gn, createBoardLayer as xt, laneColors as H, H as tt, layerInk as w, workshopDestinations as Gt, workshopCandidate as It, L as St } from "./workshop-model.mjs";
import { renderLayerShapes as Re } from "./workshop-model.mjs";
import { startHandleCard as it, dayWords as L, scheduleLaunch as z, e as Kt, m as $, dateName as lt, lineWord as X, withPlanStart as pn, offsetOf as dt, launchLinkRefusal as Vt, snapStep as q, dayMap as xn, clockOf as Xt, waitsRefusal as _t, tryTask as Ut, launchPlanLimits as mn, launchOverrun as yn, withTaskValue as G, hireStarts as Yt, isoAt as D, launchHard as Wt, pastTheLine as wn, dragTaskEdge as kn, moveLaunch as Rt, movePlanStart as Mn, planWeeksProblem as vn, cascadeStops as Sn, legalRuns as _n, startHandle as Wn, checkTime as Rn, holdOthers as Ln, weekdayAt as Lt, shortDate as F, brokenWaits as Tn, runwayMonths as $n, runwayWords as On, launchFinish as Jt, withLink as jt } from "./workshop-plans.mjs";
import { a as Te, d as $e, bandOf as Oe, c as Ae, dayFromWords as ze, g as Ee, downstreamTasks as Pe, earliestLaunch as Ce, edgeValues as Fe, extendWorkshopEdits as Be, goLiveSample as De, hireLagFor as Ne, hiringPlanRules as He, hiringPlanSample as Ge, isoTime as Ie, landPlanNote as Ke, launchDayOn as Ve, launchIndex as Xe, launchPlanCaption as Ue, launchPlanRefusal as Ye, launchPlanRules as Je, launchPlanSample as je, launchTaskText as Ze, launchTooEarly as qe, monthNames as Qe, n as be, nextMonday as ti, b as ni, o as ei, planDrags as ii, planEdit as si, planFixed as ai, planLaunchPlanMove as ri, planPastRule as oi, planProblem as li, planProblems as ci, planStartBy as hi, planWords as di, presetRules as ui, readClock as fi, f as gi, r as pi, runwayCap as xi, runwayHeader as mi, sampleLaunchPlan as yi, timeFamily as wi, timeProblems as ki, timeRuleKindIds as Mi, timeSentence as vi, validateHiringPlan as Si, validateLaunchPlan as _i, weekendAt as Wi } from "./workshop-plans.mjs";
import Q from "react";
import { withBudgetTotal as ut, pipelineForecast as mt, budgetOver as yt, pipelineLimits as An, pipelineRefusal as zn, pipelineCaption as Tt, pipelineStageOver as ct, budgetLimits as En, budgetRefusal as Pn, budgetTotalBounds as Cn, budgetCaption as Fn, shiftBudget as $t, budgetCommitted as Bn } from "./workshop-rules.mjs";
import { amountRules as Li, behaviourEditsBetween as Ti, budgetRules as $i, budgetShiftLimits as Oi, budgetShiftRefusal as Ai, budgetTotalFixed as zi, pipelineRules as Ei, planBudgetMove as Pi, planPipelineMove as Ci, planSamples as Fi, restoreWorkshop as Bi, sampleBudget as Di, samplePipeline as Ni, validateBudget as Hi, validatePipeline as Gi } from "./workshop-rules.mjs";
import { byOrder as Ki, checkNest as Vi, checkNestMove as Xi, extend as Ui, isOrderKey as Yi, nestAlias as Ji, nestAreas as ji, nestCardText as Zi, nestDepth as qi, nestDrags as Qi, nestEmptyDrop as bi, nestFamily as ts, nestKids as ns, nestLegal as es, nestMeasure as is, nestMeasureWords as ss, nestPlace as as, nestRoots as rs, nestRules as os, nestSentence as ls, nestSubtree as cs, orderBetween as hs, orderKeys as ds, registerNestPlus as us, roleOf as fs, tidyKeys as gs, validateNest as ps } from "./workshop-nest.mjs";
import { isOrgChart as ms, nestAxes as ys, nestQuadrants as ws, nestScores as ks, quadrantOf as Ms, scoreBoard as vs, scoresIn as Ss } from "./workshop-nest-plus.mjs";
import { GRID_MAX_STAMPS as Ws, GRID_MAX_TILES as Rs, GRID_TRAY as Ls, MIN_CELL as Ts, PX_PER_INCH as $s, bingoSample as Os, cellAt as As, cellBox as zs, cellSize as Es, cellSizeProblem as Ps, checkGrid as Cs, defaultSpan as Fs, fits as Bs, flashcardSample as Ds, freeCells as Ns, gridCaption as Hs, gridCardText as Gs, gridFamily as Is, gridFromNote as Ks, gridNeeds as Vs, gridNoteText as Xs, gridOverridable as Us, gridPages as Ys, gridPrintProblems as Js, gridRuleSentence as js, gridRules as Zs, gridSamples as qs, gridSheet as Qs, gridTileTypes as bs, inBounds as ta, occupancy as na, pageName as ea, pageSize as ia, printSize as sa, readingOrder as aa, reflow as ra, spanOf as oa, tileName as la, tileTypeOf as ca, tileWords as ha, usedCells as da, validateGrid as ua, worksheetSample as fa } from "./workshop-grid.mjs";
function Y(t, e = []) {
  const n = t.filter((s) => s.name.startsWith("card-") || s.name.startsWith("handle-"));
  return Q.createElement(
    "g",
    null,
    ...n.map((s) => /* @__PURE__ */ Q.createElement("g", { id: s.name, transform: cn(s.x, s.y) }, /* @__PURE__ */ Q.createElement("rect", { width: s.width, height: s.height }))),
    ...t.filter((s) => e.includes(s.name)).map((s) => /* @__PURE__ */ Q.createElement("rect", { id: "target-" + s.name.slice(5), x: s.x, y: s.y, width: s.width, height: s.height }))
  );
}
function J(t, e, n, s, a) {
  let c;
  const i = {
    draggable: (r) => (c ?? (c = r.d), s(r.state)),
    draggedPath: e + "/",
    draggedId: e,
    anchorPos: vt(n.x, n.y),
    startState: t,
    debug: { varyVisualizer: !1 }
  };
  if (!ln(i, t) || !c) return null;
  const o = hn(a(c, t), i);
  return (r) => o({ pointer: vt(r.x, r.y) }).dropState;
}
const st = (t, e, n = 0) => !!t && e.x >= t.x - n && e.x <= t.x + t.width + n && e.y >= t.y - n && e.y <= t.y + t.height + n;
function Zt(t, e, n, s, a) {
  if (!t) return null;
  const c = e.cards.find((l) => l.id === n).laneId;
  return (l) => {
    const i = t(l);
    if (i !== e && JSON.stringify(i) !== JSON.stringify(e)) return i;
    const o = s.find((r) => r.name.startsWith("column-") && r.name !== "column-" + c && st(r, l));
    return o && a.find((r) => r.cards.find((u) => u.id === n).laneId === o.name.slice(7)) || i;
  };
}
function qt(t, e) {
  const n = Ht(e);
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
    const i = pn(t, dt(t.clock.origin, e.clock.origin));
    return [{ kind: "set_plan_start", start: e.clock.origin }, ...j(i, e)];
  }
  if (t.budget && e.budget && t.budget.total !== e.budget.total) {
    const i = (u) => JSON.stringify(u.lanes.map((m) => m.allocation)), o = ["end", "start"].map((u) => ({ edge: u, made: ut(t, e.budget.total, u) })).filter((u) => typeof u.made != "string"), r = o.find((u) => i(u.made) === i(e)) ?? o[0];
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
  return t.title !== e.title && n.push({ kind: "rename_workshop", title: e.title }), n.push(...un(t, e)), n;
}
function Dn(t) {
  const e = t.forecast?.currency;
  return `Forecast ${$(mt(t), e)} of ${$(t.forecast?.target ?? 0, e)}`;
}
function Nn(t) {
  const e = t.lanes.filter((n) => yt(t, n.id) > 0).length;
  return `${Kt(t.budget?.total ?? 0, t.budget?.currency)} · ` + (e ? `${e} ${e === 1 ? "team" : "teams"} over budget` : "balanced");
}
function Qt(t, e) {
  return t.cards.filter((n) => Vt(t, e, n.id) === null).map((n) => n.id);
}
function Hn(t, e, n, s) {
  for (let a = e; a > 11; a--) {
    const c = Math.max(1, Math.floor(n / (a * 0.55)));
    if (t.split(`
`).reduce((i, o) => i + Math.max(1, Math.ceil(o.length / c)), 0) * a * 1.3 <= s) return a;
  }
  return Math.min(e, 11);
}
function wt(t, e, n, s) {
  const a = s.textColor ?? "#18302d", c = s.borderColor ?? "#667872", l = s.fontSize ?? 14;
  return t.map((i) => {
    const o = fn(e.appearance, i.name, i), r = { ...i, ...o, height: o.height ?? i.height }, u = r.name.startsWith("handle-"), m = r.text ?? "", h = r.name.startsWith("lane-") ? gn(m, r.fontSize ?? l, r.width - 12, r.height - 6) : null, f = h?.text ?? m;
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
      fontSize: h?.fontSize ?? Hn(f, r.fontSize ?? l, r.width - 12, r.height - 6)
    }, relationships: { associations: [] } };
  });
}
function bt(t, e) {
  const n = e.slice(7), s = it(e), a = s !== null && t.cards.find((i) => i.id === s);
  if (a) return `${a.label} start, ${L(t, z(t).get(a.id).from)}. Left and Right move it; the end stays.`;
  if (t.budget && (n === "_first" || n === "_last")) {
    const i = n === "_first" ? t.lanes[0] : t.lanes.at(-1);
    return `Budget ${n === "_first" ? "start" : "end"}, total ${Kt(t.budget.total, t.budget.currency)}. ${n === "_first" ? "Left" : "Right"} grows it, ${n === "_first" ? "Right" : "Left"} shrinks it, by ${$(t.budget.step, t.budget.currency)}; ${i.label} gains or gives first.`;
  }
  if (n === "_first" && t.clock) return `First day, ${lt(t.clock.origin, 0)}. Left and Right move it; every task keeps its dates.`;
  if (n === "_last" && t.hiring && t.clock) return `Last week, to ${lt(t.clock.origin, t.hiring.weeks * 7 - 1)} (${t.hiring.weeks} weeks). Left and Right move it a week.`;
  if (n === "funding" && t.hiring?.funding && t.clock) return `Funding round, ${lt(t.clock.origin, t.hiring.funding.day)}. Left and Right move it a week.`;
  if (n === "launch") return t.clock ? `${X(t).charAt(0).toUpperCase() + X(t).slice(1)}, ${L(t, t.launch.day)}. Left and Right move it.` : `Launch day, day ${t.launch?.day}. Left and Right move it.`;
  const c = t.cards.find((i) => i.id === n);
  if (c) return `${c.label} length, ${c.duration} days. Left and Right change it.`;
  const l = t.lanes.findIndex((i) => i.id === n);
  return l >= 0 && t.lanes[l + 1] ? `Divider between ${t.lanes[l].label} and ${t.lanes[l + 1].label}. Left and Right move money.` : null;
}
const tn = "#c2410c", at = "handle-_first", rt = "handle-_last", Gn = 32, In = 44, Kn = (t, e) => t ? 0 : Math.min(22, Math.max(4, Math.floor(e / 3)));
function C(t, e = {}) {
  const n = !!e.narrow, s = t.kind === "hiring-plan", a = z(t), c = !s && Wt(t) && t.cards.some((k) => k.override), l = s ? t.hiring.weeks * 7 : Wt(t) ? Math.max(t.launch.day, c ? Math.max(...[...a.values()].map((k) => Math.ceil(k.to))) : 0) : Math.ceil(t.launch.day * 4 / 3), i = wn(t), o = [], r = /* @__PURE__ */ new Map(), u = n ? 8 : 168, m = n ? 88 : u + 40, h = n ? Math.max(300, e.width ?? 390) : Math.max(720, e.width ?? 1200), f = e.dayWidth ? Math.max(h, Math.ceil(m + l * e.dayWidth)) : h, g = e.maxWidth !== void 0 && f > e.maxWidth ? Math.max(h, Math.floor(e.maxWidth)) : f, d = e.dayWidth && g === f ? e.dayWidth : (g - m) / l, p = (k) => H[t.lanes.findIndex((M) => M.id === k) % H.length], x = (k, M) => {
    const R = t.cards.find((K) => K.id === k), v = a.get(k), W = { x: u + v.from * d, y: M, width: (v.to - v.from) * d, height: n ? In : Gn };
    r.set(k, W);
    const I = i.has(k);
    if (o.push({
      name: "card-" + k,
      ...W,
      text: n ? "" : s ? R.label : `${R.label} · ${R.duration}d`,
      fill: I ? "#fde3d7" : n ? p(R.laneId) : s ? A(p(R.laneId), 0.45) : "#fffdf6",
      line: I || v.critical && !s ? tn : "#667872",
      lineWidth: I || v.critical && !s ? 2.5 : 1,
      fontSize: 13
    }), !(s && n)) {
      const K = Kn(n, W.width), ot = n ? 44 : 22, kt = W.y + W.height / 2 - 22, Mt = n ? Math.max(-12, W.x - ot) : W.x - ot;
      o.push({ name: Wn(k), x: Mt, y: kt, width: Math.max(24, W.x + K - Mt), height: 44 }), o.push({ name: "handle-" + k, x: W.x + W.width - K, y: kt, width: K + ot, height: 44 });
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
      x(M.id, y + 20), y += 64;
  } else {
    S = 48, _ = 56, y = _;
    for (const k of t.lanes) {
      const M = t.cards.filter((v) => v.laneId === k.id), R = Math.max(92, M.length * 44 + 20);
      o.push({ name: "column-" + k.id, x: 0, y, width: g, height: R, fill: A(p(k.id), 0.65), line: A(p(k.id), 0.1) }), o.push({ name: "lane-" + k.id, x: 8, y: y + 8, width: u - 24 - tt, height: 32, text: k.label, fill: p(k.id), fontSize: 15 }), o.push({ name: "caption-" + k.id, x: 8, y: y + 44, width: u - 24, height: 40, text: "", fill: "transparent", lineWidth: 0, fontSize: 13 }), M.forEach((v, W) => x(v.id, y + 10 + W * 44)), y += R + 4;
    }
  }
  return s ? t.hiring.funding && !n && o.push({ name: "handle-funding", x: u + t.hiring.funding.day * d - 22, y: 4, width: 44, height: 44 }) : o.push({ name: "handle-launch", x: u + t.launch.day * d - 22, y: n ? 104 : 4, width: 44, height: 44 }), t.clock && !(s && n) && o.push({ name: at, x: u - 22, y: n ? 104 : 8, width: 44, height: 44 }), s && !n && o.push({ name: rt, x: u + l * d - 22, y: 8, width: 44, height: 44 }), { parts: o, width: g, height: y + 8, narrow: n, x0: u, dayW: d, gridTop: _, axisY: S, bars: r };
}
function Vn(t, e, n) {
  for (const s of e.parts) s.name.startsWith("caption-") && (s.text = n(s.name.slice(8)));
  return e;
}
function Xn(t, e) {
  const n = t.x + t.width, s = Math.max(t.x + 4, n - 10), c = e.y + e.height / 2 > t.y + t.height / 2 ? t.y + t.height : t.y, l = e.y + e.height / 2;
  return { d: `M ${s} ${c} V ${l} H ${e.x}`, arrow: { x: e.x, y: l, angle: 0 } };
}
const Un = (t, e = !1) => Math.ceil(t.length * 13 * (e ? 0.6 : 0.56));
function Yn(t, e) {
  const n = C(t, e.layout), s = t.kind === "hiring-plan", a = z(t), c = Math.round((n.width - (n.narrow ? 88 : n.x0 + 40)) / n.dayW), l = Xt(t), i = [];
  if (l?.workdays)
    for (let h = 0; h < c; h++) Lt(l.origin, h) === 6 && i.push({ t: "rect", x: n.x0 + h * n.dayW, y: n.gridTop, w: 2 * n.dayW, h: n.height - 8 - n.gridTop, color: n.narrow ? w.canvasTrack : w.track, opacity: 0.7 });
  for (const h of t.behaviour?.rules ?? []) if (l && h.on && h.kind === "blackout") {
    const f = dt(l.origin, h.start), g = dt(l.origin, h.end) + 1, d = n.x0 + Math.max(0, f) * n.dayW, p = (Math.min(c, g) - Math.max(0, f)) * n.dayW;
    if (p <= 0) continue;
    i.push({ t: "rect", x: d, y: n.gridTop, w: p, h: n.height - 8 - n.gridTop, color: w.refuse, opacity: 0.12 });
    for (let x = d; x < d + p; x += 10) i.push({ t: "line", x1: x, y1: n.gridTop, x2: Math.min(d + p, x + 10), y2: n.gridTop + 10, color: w.refuse, width: 0.6 });
    i.push({ t: "text", x: d + 3, y: n.gridTop + 22, text: h.label + " · " + F(h.start) + "–" + F(h.end), color: w.refuse, size: 11, bold: !0 });
  }
  for (let h = 0; h <= c; h++) {
    const f = n.x0 + h * n.dayW, g = l ? Lt(l.origin, h) === 1 : h % 7 === 0;
    if (!g && n.dayW < 6) continue;
    i.push({ t: "line", x1: f, y1: n.gridTop, x2: f, y2: n.height - 8, color: n.narrow ? g ? w.canvasWeek : w.canvasFaint : g ? w.week : w.faint, width: g ? 1 : 0.5 });
    const d = s && l && D(l.origin, h).slice(8) <= "07" && g, p = l ? s ? d ? F(D(l.origin, h)).replace(/ \d+$/, "") : "" : F(D(l.origin, h)) : (n.narrow ? "W" : "Week ") + (h / 7 + 1);
    g && p && (!l || s || n.dayW * 7 > 44) && i.push({ t: "text", x: f + 3, y: n.axisY, text: p, color: w.canvasInk, size: 12 });
  }
  const o = new Set(Tn(t).map((h) => h.from + ">" + h.to));
  for (const h of t.cards) {
    for (const p of h.dependsOn ?? []) {
      const x = n.bars.get(p), y = n.bars.get(h.id);
      if (!x || !y) continue;
      const _ = a.get(p).critical && a.get(h.id).critical, S = t.cards.find((M) => M.id === p).label, k = o.has(p + ">" + h.id);
      i.push({
        t: "path",
        ...Xn(x, y),
        color: k ? w.refuse : _ ? tn : w.ink,
        width: k || _ ? 2 : 1.5,
        ...k && { dash: "5 4", role: "broken-" + p + "-" + h.id },
        unlink: { cardId: h.id, waitsOn: p, label: k ? `Remove the link: ${h.label} waits on ${S}, and starts before it ends` : `Remove the link: ${h.label} waits on ${S}` }
      });
    }
    const f = Ht(h), g = a.get(h.id), d = n.bars.get(h.id);
    if (s) {
      const p = t.hiring.bands.find((_) => _.id === h.band), x = d.x + d.width, y = n.x0 + c * n.dayW;
      y > x && i.push({ t: "rect", x, y: d.y + d.height / 2 - 3, w: y - x, h: 6, rx: 3, color: w.bar, opacity: 0.45 }), i.push({
        t: "text",
        x: n.narrow ? 8 : Math.min(x + 6, y - 120),
        y: n.narrow ? d.y - 6 : d.y + d.height / 2 - 6,
        text: (n.narrow ? h.label + " · " : "") + "starts " + F(D(l.origin, Yt(t, h.id))) + (p ? " · " + $(p.monthly, t.hiring.currency) + "/mo" : "") + (f ? " · " + f : ""),
        color: f ? E.ink : w.ink,
        size: 12,
        role: "start-" + h.id
      });
      continue;
    }
    if (n.narrow) {
      const p = `${h.label} · ${h.duration}d` + (f ? " · moved anyway" : ""), x = Un(p, g.critical), y = d.x + 2 + x <= n.width - 8;
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
    const h = $n(t), f = t.behaviour?.rules.find((p) => p.on && p.kind === "deadline"), g = f && f.kind === "deadline" && h < f.floor;
    i.push({
      t: "text",
      x: n.narrow ? 8 : n.x0,
      y: n.narrow ? 18 : 20,
      text: "Runway with these hires: " + On(h),
      color: g || e.refused ? w.refuse : w.canvasInk,
      size: 14,
      bold: !0,
      role: "header"
    });
    const d = t.hiring.funding;
    if (d && d.day <= c) {
      const p = n.x0 + d.day * n.dayW;
      i.push({ t: "line", x1: p, y1: 26, x2: p, y2: n.height - 8, color: w.accept, width: 2, dash: "6 4" }), n.narrow || i.push({ t: "rect", x: p - 4, y: 26, w: 8, h: 18, rx: 4, color: w.accept }), i.push({ t: "text", x: Math.max(p + 8, n.narrow ? 8 : n.x0 + 330), y: n.narrow ? 40 : 20, text: "Round +" + $(d.amount, t.hiring.currency) + " · " + F(D(l.origin, d.day)), color: w.accept, size: 12, bold: !0 });
    }
    if (n.narrow && i.push({ t: "text", x: 8, y: 58, text: "Read-only here: say a change in the chat.", color: w.ink, size: 12 }), e.clamp) {
      const p = n.parts.find((x) => x.name === e.clamp.name);
      p && i.push(...At(n, i, e.clamp.text, p, e.view));
    }
    return i;
  }
  const r = n.x0 + t.launch.day * n.dayW;
  i.push({ t: "line", x1: r, y1: n.narrow ? 112 : 26, x2: r, y2: n.height - 8, color: w.launch, width: 2, dash: "6 4" }), i.push({ t: "rect", x: r - 4, y: n.narrow ? 112 : 26, w: 8, h: 18, rx: 4, color: w.launch });
  const u = Jt(t), m = Math.max(0, ...[...a.values()].map((h) => h.to));
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
    h && i.push(...At(n, i, e.clamp.text, h, e.view));
  }
  return i;
}
const b = 13, Ot = 16, nn = (t, e) => t * (e ? 0.64 : 0.6), Jn = (t, e) => t.x + t.w <= e.x || e.x + e.w <= t.x || t.y + t.h <= e.y || e.y + e.h <= t.y;
function jn(t) {
  const e = t.size ?? 13, n = t.text.length * nn(e, t.bold);
  return { x: t.anchor === "end" ? t.x - n : t.anchor === "middle" ? t.x - n / 2 : t.x, y: t.y - e, w: n, h: e * 1.3 };
}
function Zn(t, e) {
  const n = [];
  for (const s of t.split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= e ? n[n.length - 1] = a + " " + s : n.push(s);
  }
  return n;
}
let ht = null;
function At(t, e, n, s, a) {
  const c = [...t.bars.values()].map((x) => ({ x: x.x - 4, y: x.y - 3, w: x.width + 8, h: x.height + 6 }));
  for (const x of e)
    x.t === "text" ? c.push(jn(x)) : x.t === "rect" && c.push({ x: x.x - 2, y: x.y - 2, w: x.w + 4, h: x.h + 4 });
  let l = t.narrow ? 6 : t.x0 + 2, i = t.width - 4, o = t.gridTop + 2, r = t.height - 6;
  a && Math.min(i, a.x + a.width - 8) - Math.max(l, a.x + 8) >= 160 && (l = Math.max(l, a.x + 8), i = Math.min(i, a.x + a.width - 8), Math.min(r, a.y + a.height - 8) - Math.max(o, a.y + 8) >= 40 && (o = Math.max(o, a.y + 8), r = Math.min(r, a.y + a.height - 8)));
  const u = { x: s.x + s.width / 2, y: s.y + s.height / 2 }, m = JSON.stringify([n, u, l, i, o, r, c.map((x) => [x.x, x.y, x.w, x.h].map(Math.round))]);
  if (ht?.key === m) return ht.shapes;
  const h = nn(b, !0), f = Math.floor((i - l) / h), g = /* @__PURE__ */ new Map();
  for (const x of [1, 0.75, 0.6, 0.5, 0.42, 0.36]) {
    const y = Zn(n, Math.max(8, Math.floor(f * x)));
    y.length <= 4 && g.set(y.join(`
`), y);
  }
  let d = null;
  for (const x of g.values()) {
    const y = Math.max(...x.map((S) => S.length)) * h, _ = x.length * Ot + 2;
    if (!(y > i - l))
      for (let S = o; S + _ <= r; S += 3)
        for (let k = l; k + y <= i; k += 6) {
          const M = { x: k, y: S, w: y, h: _ }, R = Math.max(M.x - u.x, 0, u.x - (M.x + M.w)), v = Math.max(M.y - u.y, 0, u.y - (M.y + M.h)), W = Math.hypot(R, v) + (x.length - 1) * 24;
          d && W >= d.score || c.every((I) => Jn(M, I)) && (d = { box: M, lines: x, score: W });
        }
  }
  const p = d ? [{ t: "text", x: d.box.x, y: d.box.y + b - 1, text: n, lines: d.lines, lineHeight: Ot, color: w.refuse, size: b, bold: !0, role: "clamp" }] : [{
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
  return ht = { key: m, shapes: p }, p;
}
const nt = (t, e = 1, n) => {
  const s = (c, l) => Math.round(c / l) * l, a = { ...t, cards: t.cards.map((c) => {
    const l = c.id === n ? e : 1, i = { ...c, duration: Math.max(l, s(c.duration, l)), lag: Math.max(0, s(c.lag ?? 0, l)) };
    return i.lag || delete i.lag, i;
  }) };
  return t.launch && (a.launch = { ...t.launch, day: Math.round(t.launch.day) }), t.hiring?.funding && (a.hiring = { ...t.hiring, funding: { ...t.hiring.funding, day: Math.round(t.hiring.funding.day) } }), a;
}, zt = (t) => !!t.behaviour || t.kind === "hiring-plan";
function qn(t, e, n) {
  if (n !== "l" && n !== "L") return null;
  const s = /^card-(.+)$/.exec(e), a = s && t.cards.find((i) => i.id === s[1]);
  if (!a) return null;
  const c = (i) => t.cards.find((o) => o.id === i)?.label ?? i, l = [
    ...Qt(t, a.id).map((i) => ({
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
function Qn(t, e, { key: n, shiftKey: s }) {
  if (n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const a = (n === "ArrowLeft" ? -1 : 1) * q(t);
  if (e === "handle-launch") return [{ kind: "set_launch_day", day: t.launch.day + Math.sign(a) }];
  if (e === "handle-funding") return [{ kind: "set_funding", day: t.hiring.funding.day + Math.sign(a) * 7 }];
  if (e === at && t.clock) return [{ kind: "set_plan_start", start: D(t.clock.origin, Math.sign(a) * (t.kind === "hiring-plan" || Math.abs(a) > 1 ? 7 : 1)) }];
  if (e === rt && t.hiring) return [{ kind: "set_plan_weeks", weeks: t.hiring.weeks + Math.sign(a) }];
  const c = it(e), l = c !== null && t.cards.find((r) => r.id === c);
  if (l) return [{ kind: "set_task", card: { id: l.id }, duration: l.duration - a, lag: (l.lag ?? 0) + a }];
  const i = /^(card|handle)-(.+)$/.exec(e), o = i && t.cards.find((r) => r.id === i[2]);
  return o ? s || i[1] === "handle" ? [{ kind: "set_task", card: { id: o.id }, duration: o.duration + a }] : [{ kind: "set_task", card: { id: o.id }, lag: (o.lag ?? 0) + a }] : null;
}
const ft = {
  laneCues: !1,
  notes(t, e, n, s) {
    return wt(ft.places(t, e).parts, t, n, s);
  },
  editsBetween: j,
  label: bt,
  places(t, e) {
    const n = Vn(t, C(t, e), (s) => {
      const a = t.cards.filter((l) => l.laneId === s), c = z(t);
      return t.kind === "hiring-plan" ? a.length + (a.length === 1 ? " hire" : " hires") : `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${a.filter((l) => c.get(l.id).critical).length} on the critical path`;
    });
    return { parts: n.parts, width: n.width, height: n.height };
  },
  layer: (t) => xt(t, Yn),
  chooser(t, e, n, s = {}) {
    const a = t.cards.findIndex((c) => c.id === e);
    return a < 0 ? null : t.kind === "hiring-plan" && s.narrow ? () => t : (zt(t) ? ee : le)(t, e, a, Qt(t, e), n, s);
  },
  refusalAt(t, e, n, s, a) {
    const c = C(t, a);
    for (const g of t.cards) {
      if (g.id === e || !st(c.bars.get(g.id), s)) continue;
      const d = Vt(t, e, g.id);
      return d ? { laneId: g.laneId, reason: d } : null;
    }
    const l = t.cards.find((g) => g.id === e), i = (l.lag ?? 0) + Math.round((s.x - n.x - c.bars.get(e).x) / c.dayW), o = (g) => {
      const d = { kind: "set_task", card: { id: e }, lag: g };
      return { edit: d, to: gt(t, d) };
    }, r = q(t), u = z(t).get(e).start - (l.lag ?? 0), m = (g) => Math.max(g, -u);
    if (zt(t)) {
      const g = z(t).get(e), d = Math.round(g.from + (s.x - n.x - c.bars.get(e).x) / c.dayW), p = (l.lag ?? 0) + xn(Xt(t)).idx(d) - g.start, x = m(Math.round(p / r) * r);
      if (x < -r && l.dependsOn?.length) return { laneId: l.laneId, reason: _t(t, e, x), override: o(x) };
      const y = Ut(t, e, { lag: Math.max(0, x) });
      return typeof y == "string" ? { laneId: l.laneId, reason: y, lands: !0, override: o(Math.max(0, x)) } : null;
    }
    const h = m(Math.round(i / r) * r);
    if (h < -r && l.dependsOn?.length) return { laneId: l.laneId, reason: _t(t, e, h), override: o(h) };
    const f = mn(t, { cardId: e, field: "lag" });
    return i > f.max ? { laneId: l.laneId, reason: yn(G(t, { cardId: e, field: "lag" }, i), e) ?? f.reasons.max, override: o(i) } : null;
  },
  handleDrag(t, e, n, s) {
    const a = C(t, s);
    if (t.kind === "hiring-plan" && s.narrow) return null;
    const c = it(e);
    if (c !== null) return t.cards.some((i) => i.id === c) ? Et(t, c, "start", n, a, e) : null;
    const l = e.slice(7);
    return t.cards.some((i) => i.id === l) ? Et(t, l, "end", n, a, e) : e === "handle-launch" ? ie(t, n, a, s) : e === "handle-funding" && t.hiring?.funding ? re(t, n, a) : e === at && t.clock ? se(t, n, a, s) : e === rt && t.hiring ? ae(t, n, a, s) : null;
  },
  // A note let go over the days starts its task on the day under it; on the team names, or on a phone (rows, not days), at the start.
  noteDay(t, e, n) {
    const s = C(t, n);
    return s.narrow || e.x < s.x0 ? null : (e.x - s.x0) / s.dayW;
  },
  keyEdit: Qn,
  overrideWords: gt,
  keyChoices: qn,
  cardKeys: "Left and Right move it a day, Shift changes its length, L chooses what it waits on.",
  cardOfPart(t, e) {
    const n = it(e) ?? /^(?:card|handle)-(.+)$/.exec(e)?.[1] ?? null;
    return n !== null && t.cards.some((s) => s.id === n) ? n : null;
  }
};
function Et(t, e, n, s, a, c) {
  const l = a.parts.find((i) => i.name === c);
  return l ? (i) => {
    const o = kn(t, e, n, (i.x - s.x - l.x) / a.dayW);
    if (o.next) return { next: o.next, ...o.reason && { clampedReason: o.reason } };
    const r = o.values.lag, u = bn(t, e, r) + te(t, e, r, o.values.duration) - 1;
    return {
      next: ne(t, e, o.values) ?? t,
      clampedReason: o.refusal,
      refusal: o.refusal,
      override: {
        edit: { kind: "set_task", card: { id: e }, lag: r, duration: o.values.duration },
        to: n === "start" || t.kind === "hiring-plan" ? gt(t, { kind: "set_task", card: { id: e }, lag: r, duration: o.values.duration }) : "to end " + L(t, u)
      }
    };
  } : null;
}
function gt(t, e) {
  if (e.kind !== "set_task") return;
  const n = typeof e.card == "object" && e.card && "id" in e.card ? e.card.id : null, s = n ? t.cards.find((i) => i.id === n) : void 0;
  if (!s) return;
  let a = t;
  e.lag !== void 0 && (a = G(a, { cardId: s.id, field: "lag" }, e.lag)), e.duration !== void 0 && (a = G(a, { cardId: s.id, field: "duration" }, e.duration));
  const c = z(a).get(s.id);
  return t.kind === "hiring-plan" && t.clock ? "to start work " + L(a, Yt(a, s.id)) + " (recruiting from " + L(a, c.from) + ")" : (e.lag === void 0 || e.lag === (s.lag ?? 0)) && e.duration !== void 0 && e.duration !== s.duration ? "to end " + L(a, c.to - 1) : "to start " + L(a, c.from);
}
function bn(t, e, n) {
  return z(G(t, { cardId: e, field: "lag" }, n)).get(e).from;
}
function te(t, e, n, s) {
  const a = z(G(G(t, { cardId: e, field: "lag" }, n), { cardId: e, field: "duration" }, s)).get(e);
  return a.to - a.from;
}
function ne(t, e, n) {
  const s = t.cards.find((o) => o.id === e), a = q(t), c = s.lag ?? 0, l = s.duration ?? 1, i = (o, r) => Math.sign(r - o) * a;
  for (let o = { ...n }; o.lag !== c || o.duration !== l; ) {
    if (o.lag !== c) {
      const u = i(o.lag, c);
      o = { lag: o.lag + u, duration: o.duration - u };
    } else o = { lag: c, duration: o.duration + i(o.duration, l) };
    const r = Ut(t, e, { lag: o.lag, duration: o.duration });
    if (typeof r != "string") return r;
  }
  return null;
}
function ee(t, e, n, s, a, c) {
  const l = q(t), i = Sn(t), o = t.cards[n].laneId, r = (d) => {
    if (!i) return d;
    const p = Ln(t, d, /* @__PURE__ */ new Set([e]));
    return typeof p == "string" ? d : p;
  }, u = (d) => r(nt(d, l, e)), m = (d) => Y(C(r(d), c).parts, s.map((p) => "card-" + p)), f = (c.narrow ? [o] : t.lanes.map((d) => d.id)).flatMap((d) => _n(t, e, "lag", d === o ? void 0 : d).map((p) => ({ laneId: d, run: p })));
  if (!f.length) return () => t;
  const g = J(t, "card-" + e, a, m, (d, p) => {
    const x = d.closest(f.map(({ laneId: y, run: [_, S] }) => d.vary(
      { ...p, cards: p.cards.map((k, M) => M === n ? { ...k, laneId: y, lag: Math.min(S, Math.max(_, k.lag ?? 0)) } : k) },
      Bt("cards", n, "lag"),
      { constraint: (k) => [Dt(k.cards[n].lag ?? 0, _ - 0.49), Nt(k.cards[n].lag ?? 0, S + 0.49)] }
    ))).withBranchTransition(100);
    return s.length ? d.closest(s.map((y) => d.dropTarget("target-" + y, jt(p, e, y)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(x).withBranchTransition(120).onDrop(u) : x.onDrop(u);
  });
  return g ? (d) => u(g(d)) : null;
}
function ie(t, e, n, s) {
  const a = n.parts.find((l) => l.name === "handle-launch");
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (l) => {
    const i = Rt(t, t.launch.day + Math.round((l.x - e.x - a.x) / n.dayW));
    if (i.next) return { next: i.next, layout: c, ...i.reason && { clampedReason: i.reason } };
    let o = t;
    const r = Math.sign(t.launch.day - i.day);
    for (let u = i.day + r; r && u !== t.launch.day; u += r) {
      const m = Rt(t, u);
      if (m.next) {
        o = m.next;
        break;
      }
    }
    return { next: o, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function se(t, e, n, s) {
  const a = n.parts.find((l) => l.name === at);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW };
  return (l) => {
    const i = Mn(t, (l.x - e.x - a.x) / n.dayW);
    return i.next ? { next: i.next, layout: c } : { next: t, layout: c, clampedReason: i.refusal, refusal: i.refusal };
  };
}
function ae(t, e, n, s) {
  const a = n.parts.find((i) => i.name === rt);
  if (!a) return null;
  const c = { ...s, dayWidth: n.dayW }, l = t.hiring.weeks;
  return (i) => {
    const o = l + Math.round((i.x - e.x - a.x) / n.dayW / 7), r = vn(t, o);
    return r ? { next: t, layout: c, clampedReason: r, refusal: r } : { next: { ...t, hiring: { ...t.hiring, weeks: o } }, layout: c };
  };
}
function re(t, e, n) {
  const s = n.parts.find((o) => o.name === "handle-funding");
  if (!s) return null;
  const a = t.hiring.funding.day, c = q(t), l = t.hiring.weeks * 7, i = (o) => ({ ...t, hiring: { ...t.hiring, funding: { ...t.hiring.funding, day: o } } });
  return (o) => {
    const r = a + Math.round((o.x - e.x - s.x) / n.dayW / c) * c, u = Math.min(l, Math.max(0, r)), m = oe(t, i(u));
    return m ? { next: t, clampedReason: m, refusal: m } : { next: i(u), ...u !== r && { clampedReason: u > r ? "The round closes on the plan’s first day at the earliest." : "The round closes within the plan’s " + t.hiring.weeks + " weeks." } };
  };
}
function oe(t, e) {
  const n = t.behaviour ? Rn(t, e) : null;
  return n && "refused" in n ? n.refused.sentence : null;
}
function le(t, e, n, s, a, c) {
  const l = t.launch.day, i = (r) => Y(C(r, c).parts, s.map((u) => "card-" + u)), o = J(t, "card-" + e, a, i, (r, u) => {
    const m = c.narrow ? u.lanes.filter((f) => f.id === u.cards[n].laneId) : u.lanes, h = r.closest(m.map((f) => r.vary(
      { ...u, cards: u.cards.map((g, d) => d === n ? { ...g, laneId: f.id, lag: g.lag ?? 0 } : g) },
      Bt("cards", n, "lag"),
      { constraint: (g) => [Dt(g.cards[n].lag ?? 0, -1e-3), Nt(Jt(g), l + 1e-3)] }
    )));
    return s.length ? r.closest(s.map((f) => r.dropTarget("target-" + f, jt(u, e, f)))).withFloating({ ghost: { opacity: 0.35 } }).whenFar(h).withBranchTransition(120).onDrop((f) => nt(f)) : h.onDrop((f) => nt(f));
  });
  return o ? (r) => nt(o(r)) : null;
}
const B = 76;
function P(t, e = {}) {
  const n = !!e.narrow, s = [], a = t.lanes.map((u) => t.cards.filter((m) => m.laneId === u.id).length), c = (u) => t.lanes[u].role === "won" ? "#bfe3cf" : t.lanes[u].role === "lost" ? "#e4dcdc" : H[u % H.length], l = (u) => ct(t, t.lanes[u].id) ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: A(c(u), 0.6), line: A(c(u), 0.1) }, i = (u) => ct(t, t.lanes[u].id) ? { ink: E.ink } : {};
  let o, r;
  if (n) {
    o = Math.max(300, e.width ?? 390);
    let u = B;
    t.lanes.forEach((m, h) => {
      const f = t.cards.filter((x) => x.laneId === m.id && x.override).length, g = 138 + (a[h] + 1) * 64 + f * 18;
      s.push({ name: "column-" + m.id, x: 2, y: u, width: o - 4, height: g, ...l(h) });
      const d = Math.floor((o - 16) * 0.36);
      s.push({ name: "lane-" + m.id, x: 8, y: u + 6, width: d, height: St, text: m.label, fill: c(h), fontSize: 15 }), s.push({ name: "caption-" + m.id, x: 8 + d + tt, y: u + 6, width: o - 16 - d - tt, height: 56, text: Tt(t, m.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(h) });
      let p = u + 114;
      for (const x of t.cards.filter((y) => y.laneId === m.id)) {
        const y = x.override ? 18 : 0;
        s.push({ name: "card-" + x.id, x: 8, y: p, width: o - 16, height: 56 + y, text: Pt(t, x.id), fontSize: 15 }), p += 64 + y;
      }
      u += g + 10;
    }), r = u;
  } else {
    const m = Math.max(...a), h = t.lanes.some((g) => ct(t, g.id)) ? 24 : 0, f = 148 + h + (m + 1) * 88;
    t.lanes.forEach((g, d) => {
      const p = d * 244;
      s.push({ name: "column-" + g.id, x: p + 2, y: B, width: 240, height: f, ...l(d) }), s.push({ name: "lane-" + g.id, x: p + 8, y: B + 6, width: 228 - tt, height: St, text: g.label, fill: c(d), fontSize: 16 }), s.push({ name: "caption-" + g.id, x: p + 8, y: B + 48, width: 228, height: 48 + h, text: Tt(t, g.id).replace(" · over its limit", `
over its limit`), fill: "transparent", lineWidth: 0, fontSize: 15, ...i(d) }), t.cards.filter((x) => x.laneId === g.id).forEach((x, y) => s.push({ name: "card-" + x.id, x: p + 8, y: B + 148 + h + y * 88, width: 228, height: 76, text: Pt(t, x.id), fontSize: 15 }));
    }), o = t.lanes.length * 244, r = B + f;
  }
  return s.push({ name: "gauge-forecast", x: 0, y: 0, width: Math.min(o, 520), height: 34, text: Dn(t), fill: "transparent", lineWidth: 0, fontSize: 17 }), s.push({ name: "handle-target", x: V(t, e, o) - 22, y: 27, width: 44, height: 44 }), { parts: s, width: o, height: r };
}
const Z = (t, e = {}) => e.gaugeScale ?? Math.max(t.forecast.target * 1.25, mt(t)), V = (t, e, n) => 4 + (n - 8) * t.forecast.target / Z(t, e);
function pt(t) {
  for (const e of [1e3, 5e3, 1e4, 5e4, 1e5, 5e5, 1e6, 5e6, 1e7]) if (e * 100 >= t) return e;
  return 5e7;
}
function ce(t, e, { key: n }) {
  if (e !== "handle-target" || n !== "ArrowLeft" && n !== "ArrowRight") return null;
  const s = pt(Z(t));
  return [{ kind: "set_target", amount: Math.max(s, t.forecast.target + (n === "ArrowLeft" ? -s : s)) }];
}
function Pt(t, e) {
  const n = t.cards.find((s) => s.id === e);
  return qt(n.amount === void 0 ? n.label + `
no amount yet` : n.label + `
` + $(n.amount, t.forecast.currency), n);
}
function he(t, e) {
  const { width: n } = P(t, e.layout), s = t.forecast.target, a = mt(t), c = Z(t, e.layout), l = Math.max(n - 8, (n - 8) * s * 1.1 / c), i = a >= s;
  return [
    { t: "rect", x: 4, y: 42, w: l, h: 14, rx: 7, color: w.track },
    { t: "rect", x: 4, y: 42, w: (n - 8) * a / c, h: 14, rx: 7, color: i ? w.accept : w.bar },
    { t: "line", x1: V(t, e.layout, n), y1: 36, x2: V(t, e.layout, n), y2: 62, color: w.ink, width: 2 },
    { t: "rect", x: V(t, e.layout, n) - 4, y: 30, w: 8, h: 12, rx: 4, color: w.ink, role: "edge-target" },
    { t: "text", x: V(t, e.layout, n), y: 72, text: "Target " + $(s, t.forecast.currency), color: w.ink, size: 14, anchor: "middle" }
  ];
}
const de = {
  laneCues: !0,
  places: (t, e) => P(t, e),
  notes: (t, e, n, s) => wt(P(t, e).parts, t, n, s),
  editsBetween: j,
  layer: (t) => xt(t, he),
  chooser(t, e, n, s = {}) {
    const a = Gt(t, e).map((c) => It(t, e, c.id));
    return a.length < 2 ? null : Zt(J(t, "card-" + e, n, (c) => Y(P(c, s).parts), (c, l) => c.closest(a, { stickiness: 4 }).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l, { gapIn: 40, gapOut: 56 })), t, e, P(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = P(t, a), l = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === l.laneId || !st(c.find((r) => r.name === "column-" + i.id), s)) continue;
      const o = zn(t, e, i.id);
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
    const a = P(t, s), c = a.parts.find((m) => m.name === "handle-target"), l = Z(t, s), i = pt(l), o = l / (a.width - 8), r = { ...s, gaugeScale: l }, u = An(t, { field: "target" });
    return (m) => {
      const h = t.forecast.target + Math.round((m.x - n.x - c.x) * o / i) * i, f = Math.min(u.max, Math.max(i, h));
      return { next: { ...t, forecast: { ...t.forecast, target: f } }, layout: r, ...f !== h && { clampedReason: f < h ? u.reasons.max : "A target is at least " + $(i, t.forecast.currency) + "." } };
    };
  },
  keyEdit: ce,
  label: (t, e) => e === "handle-target" ? "Target, " + $(t.forecast.target, t.forecast.currency) + ". Left and Right change it by " + $(pt(Z(t)), t.forecast.currency) + "." : null
}, T = 48, N = 960, et = 900, ue = { phone: 14, desktop: 32 }, en = 18, U = (t, e = !1) => t.lanes.some((n) => yt(t, n.id) > 0) ? ue[e ? "phone" : "desktop"] : 0, Ct = (t, e) => t.cards.reduce((n, s) => n + (s.laneId === e ? 64 + (s.override ? en : 0) : 0), 0);
function O(t, e = {}) {
  const n = !!e.narrow, s = t.budget.total, a = e.gaugeScale ?? s, c = e.gaugeAnchor === "start" ? a - s : 0, l = [], i = [];
  let o, r;
  if (n) {
    o = Math.max(300, e.width ?? 390);
    let h = T + c / a * et;
    t.lanes.forEach((f, g) => {
      const d = Math.max(100 + U(t, !0) + Ct(t, f.id) + 64, f.allocation / a * et);
      i.push({ laneId: f.id, start: h, size: d }), h += d;
    }), r = h + 8;
  } else {
    let h = c / a * N;
    for (const f of t.lanes)
      i.push({ laneId: f.id, start: h, size: f.allocation / a * N }), h += f.allocation / a * N;
    o = Math.max(N, h), r = T + 100 + U(t, !1) + Math.max(...t.lanes.map((f) => Ct(t, f.id))) + 64;
  }
  t.lanes.forEach((h, f) => {
    const { start: g, size: d } = i[f], p = H[f % H.length], x = n ? { x: 2, y: g + 1, width: o - 4, height: d - 2 } : { x: g + 1, y: T, width: Math.max(4, d - 2), height: r - T }, y = { x: x.x + 5, y: x.y, width: Math.max(10, x.width - 10) }, _ = yt(t, h.id) > 0;
    l.push({ name: "column-" + h.id, ...x, ..._ ? { fill: E.fill, line: E.line, lineWidth: 2 } : { fill: A(p, 0.6), line: A(p, 0.1) } });
    const S = n ? y.width * 0.36 : y.width;
    l.push({ name: "lane-" + h.id, x: y.x, y: y.y + 6, width: S, height: 32, text: h.label, fill: p, fontSize: 15 });
    const k = U(t, n), M = Fn(t, h.id).replace(" · over budget", `
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
      const W = v.override ? en : 0;
      l.push({
        name: "card-" + v.id,
        x: y.x,
        y: R,
        width: y.width,
        height: 56 + W,
        text: qt(v.label + `
` + $(v.amount, t.budget.currency), v),
        fontSize: 14
      }), R += 64 + W;
    }
    if (f < t.lanes.length - 1) {
      const v = g + d;
      l.push(n ? { name: "handle-" + h.id, x: o - 96, y: v - 22, width: 88, height: 44 } : { name: "handle-" + h.id, x: v - 22, y: T - 6, width: 44, height: 48 });
    }
  });
  const u = i[0], m = i.at(-1);
  for (const [h, f] of [[sn, u.start], [an, m.start + m.size]])
    l.push(n ? { name: h, x: o - 96, y: f - 22, width: 88, height: 44 } : { name: h, x: f - 22, y: T - 6, width: 44, height: 48 });
  return { parts: l, width: o, height: r, segments: i, narrow: n, k: (n ? et : N) / a };
}
const sn = "handle-_first", an = "handle-_last", Ft = (t) => t === sn ? "start" : t === an ? "end" : null;
function fe(t, e) {
  const n = O(t, e.layout);
  t.budget.total;
  const s = [{ t: "text", x: 4, y: 28, text: Nn(t), color: w.ink, size: 16, bold: !0, role: "header" }];
  t.lanes.forEach((a, c) => {
    const l = n.segments[c], i = a.allocation, o = Bn(t, a.id);
    if (n.narrow) {
      const r = l.start + 50 + U(t, !0), u = 8, m = n.width - 16;
      s.push({ t: "rect", x: u, y: r, w: m, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: u, y: r, w: Math.min(m, m * o / i || 0), h: 10, rx: 5, color: o > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: u + m * a.floor / i, y1: r - 4, x2: u + m * a.floor / i, y2: r + 14, color: w.ink, width: 2 });
    } else {
      const r = n.k, u = T + 86 + U(t, !1);
      s.push({ t: "rect", x: l.start + 6, y: u, w: l.size - 12, h: 10, rx: 5, color: w.track }), s.push({ t: "rect", x: l.start + 6, y: u, w: Math.max(0, Math.min(l.size - 12, (l.size - 12) * o / i || 0)), h: 10, rx: 5, color: o > i ? w.refuse : w.bar }), a.floor !== void 0 && s.push({ t: "line", x1: l.start + a.floor * r, y1: u - 6, x2: l.start + a.floor * r, y2: u + 16, color: w.ink, width: 2 }), a.cap !== void 0 && l.start + a.cap * r <= n.width && s.push({ t: "line", x1: l.start + a.cap * r, y1: u - 6, x2: l.start + a.cap * r, y2: u + 16, color: w.refuse, width: 2, dash: "3 2" });
    }
    if (c < t.lanes.length - 1) {
      const r = l.start + l.size;
      s.push(n.narrow ? { t: "line", x1: 2, y1: r, x2: n.width - 2, y2: r, color: w.ink, width: 2 } : { t: "line", x1: r, y1: T, x2: r, y2: n.height, color: w.ink, width: 2 }), s.push(n.narrow ? { t: "rect", x: n.width - 68, y: r - 4, w: 32, h: 8, rx: 4, color: w.ink } : { t: "rect", x: r - 4, y: T + 2, w: 8, h: 30, rx: 4, color: w.ink });
    }
  });
  for (const a of [n.segments[0], n.segments.at(-1)]) {
    const c = a === n.segments[0] ? a.start : a.start + a.size;
    s.push(n.narrow ? { t: "rect", x: n.width - 68, y: c - 4, w: 32, h: 8, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") } : { t: "rect", x: c - 4, y: T + 2, w: 8, h: 30, rx: 4, color: w.ink, opacity: 0.7, role: "edge-" + (a === n.segments[0] ? "first" : "last") });
  }
  if (e.clamp) {
    const a = n.parts.find((c) => c.name === e.clamp.name);
    a && s.push({
      t: "text",
      x: n.narrow ? 8 : Math.min(Math.max(a.x + 22, 120), n.width - 120),
      y: n.narrow ? a.y + 8 : T - 12,
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
const rn = (t, e) => Math.round(t / e) * e, ge = {
  laneCues: !0,
  notes: (t, e, n, s) => wt(O(t, e).parts, t, n, s),
  editsBetween: j,
  label: bt,
  places(t, e) {
    const { parts: n, width: s, height: a } = O(t, e);
    return { parts: n, width: s, height: a };
  },
  layer: (t) => xt(t, fe),
  chooser(t, e, n, s = {}) {
    const a = Gt(t, e).map((c) => It(t, e, c.id));
    return a.length < 2 ? null : Zt(J(t, "card-" + e, n, (c) => Y(O(c, s).parts), (c, l) => c.closest(a).withFloating({ ghost: { opacity: 0.3 } }).whenFar(l)), t, e, O(t, s).parts, a);
  },
  refusalAt(t, e, n, s, a) {
    const { parts: c } = O(t, a), l = t.cards.find((i) => i.id === e);
    for (const i of t.lanes) {
      if (i.id === l.laneId || !st(c.find((r) => r.name === "column-" + i.id), s)) continue;
      const o = Pn(t, e, i.id);
      return o ? { laneId: i.id, reason: o, override: { edit: { kind: "move_card", card: { id: e }, lane: { id: i.id } } } } : null;
    }
    return null;
  },
  handleDrag(t, e, n, s) {
    const a = Ft(e);
    if (a) return pe(t, a, e, n, s);
    const c = e.slice(7), l = t.lanes.findIndex((d) => d.id === c), i = t.lanes[l + 1];
    if (l < 0 || !i) return null;
    const o = En(t, { laneId: c }), r = t.budget.step, u = (d) => {
      const p = Math.min(o.max, Math.max(o.min, rn(d, r)));
      return $t(t, i.id, c, p);
    }, m = O(t, s), h = m.narrow ? et / t.budget.total : N / t.budget.total, f = m.parts.find((d) => d.name === e), g = J(t, e, n, (d) => Y(O(d, s).parts), (d) => d.varyFunc([0], ([p]) => $t(t, i.id, c, p), { constraint: (p) => [
      ...dn([o.min, p.lanes[l].allocation - t.lanes[l].allocation, o.max])
    ] }));
    return (d) => {
      const x = (m.narrow ? d.y - n.y - f.y : d.x - n.x - f.x) / h, y = g?.(d), _ = y ? y.lanes[l].allocation - t.lanes[l].allocation : x, S = { next: u(_) };
      return x > o.max + r / 2 ? { ...S, clampedReason: o.reasons.max } : x < o.min - r / 2 ? { ...S, clampedReason: o.reasons.min } : S;
    };
  },
  keyEdit(t, e, { key: n }) {
    if (n !== "ArrowLeft" && n !== "ArrowRight" && n !== "ArrowUp" && n !== "ArrowDown") return null;
    const s = Ft(e);
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
function pe(t, e, n, s, a) {
  const c = O(t, a), l = c.parts.find((m) => m.name === n);
  if (!l) return null;
  const i = t.budget.total, o = t.budget.step, r = { ...a, gaugeScale: i, ...e === "start" && { gaugeAnchor: "start" } }, u = Cn(t);
  return (m) => {
    const h = (c.narrow ? m.y - s.y - l.y : m.x - s.x - l.x) / c.k, f = i + rn(e === "end" ? h : -h, o), g = ut(t, f, e);
    if (typeof g != "string") return { next: g, layout: r };
    const d = ut(t, Math.min(u.max, Math.max(u.min, f)), e);
    return { next: typeof d == "string" ? t : d, layout: r, clampedReason: g, refusal: g };
  };
}
const on = { "launch-plan": ft, "hiring-plan": ft, pipeline: de, budget: ge };
function Me(t, e) {
  on[t] = e;
}
function ve(t) {
  const e = on[t];
  if (!e && t === "nest") throw new Error("The nested board's kit has not loaded: import slateboxjs/boards/nest first.");
  if (!e && t === "grid") throw new Error("The grid sheet's kit has not loaded: import slateboxjs/boards/grid first.");
  if (!e) throw new Error(`No board kit for "${t}". Only a launch plan, a hiring plan, a pipeline, a budget, a nested board and a grid sheet have one.`);
  return e;
}
function Se(t) {
  return t < 600 ? { narrow: !0, width: Math.max(300, Math.round(t - 32)) } : {};
}
export {
  Ws as GRID_MAX_STAMPS,
  Rs as GRID_MAX_TILES,
  Ls as GRID_TRAY,
  Ts as MIN_CELL,
  $s as PX_PER_INCH,
  Te as amountLimits,
  $e as amountOf,
  Li as amountRules,
  Oe as bandOf,
  Ti as behaviourEditsBetween,
  Os as bingoSample,
  Se as boardLayoutFor,
  Tn as brokenWaits,
  Fn as budgetCaption,
  Bn as budgetCommitted,
  Nn as budgetHeader,
  ge as budgetKit,
  O as budgetLayout,
  En as budgetLimits,
  yt as budgetOver,
  Pn as budgetRefusal,
  $i as budgetRules,
  Oi as budgetShiftLimits,
  Ai as budgetShiftRefusal,
  Cn as budgetTotalBounds,
  zi as budgetTotalFixed,
  Ki as byOrder,
  Sn as cascadeStops,
  As as cellAt,
  zs as cellBox,
  Es as cellSize,
  Ps as cellSizeProblem,
  Cs as checkGrid,
  Vi as checkNest,
  Xi as checkNestMove,
  Rn as checkTime,
  Xt as clockOf,
  xt as createBoardLayer,
  Ae as currencyOf,
  lt as dateName,
  ze as dayFromWords,
  xn as dayMap,
  L as dayWords,
  Ee as days,
  Fs as defaultSpan,
  Pe as downstreamTasks,
  kn as dragTaskEdge,
  Ce as earliestLaunch,
  Fe as edgeValues,
  Ui as extend,
  Be as extendWorkshopEdits,
  Bs as fits,
  Ds as flashcardSample,
  Ns as freeCells,
  De as goLiveSample,
  Hs as gridCaption,
  Gs as gridCardText,
  Is as gridFamily,
  Ks as gridFromNote,
  Vs as gridNeeds,
  Xs as gridNoteText,
  Us as gridOverridable,
  Ys as gridPages,
  Js as gridPrintProblems,
  js as gridRuleSentence,
  Zs as gridRules,
  qs as gridSamples,
  Qs as gridSheet,
  bs as gridTileTypes,
  bt as handleLabel,
  J as headlessDrag,
  Ne as hireLagFor,
  Yt as hireStarts,
  He as hiringPlanRules,
  Ge as hiringPlanSample,
  Ln as holdOthers,
  ta as inBounds,
  st as inside,
  Yi as isOrderKey,
  ms as isOrgChart,
  D as isoAt,
  Ie as isoTime,
  ve as kitFor,
  Ke as landPlanNote,
  Ve as launchDayOn,
  Jt as launchFinish,
  Wt as launchHard,
  Xe as launchIndex,
  C as launchLayout,
  Vt as launchLinkRefusal,
  Qt as launchLinkTargets,
  yn as launchOverrun,
  Ue as launchPlanCaption,
  ft as launchPlanKit,
  mn as launchPlanLimits,
  Ye as launchPlanRefusal,
  Je as launchPlanRules,
  je as launchPlanSample,
  Ze as launchTaskText,
  qe as launchTooEarly,
  w as layerInk,
  _n as legalRuns,
  X as lineWord,
  $ as money,
  Kt as moneyExact,
  Qe as monthNames,
  Rt as moveLaunch,
  Mn as movePlanStart,
  Ji as nestAlias,
  ji as nestAreas,
  ys as nestAxes,
  Zi as nestCardText,
  qi as nestDepth,
  Qi as nestDrags,
  bi as nestEmptyDrop,
  ts as nestFamily,
  ns as nestKids,
  es as nestLegal,
  is as nestMeasure,
  ss as nestMeasureWords,
  as as nestPlace,
  ws as nestQuadrants,
  rs as nestRoots,
  os as nestRules,
  ks as nestScores,
  ls as nestSentence,
  cs as nestSubtree,
  be as nextCardId,
  ti as nextMonday,
  ni as noteNumbers,
  E as o,
  na as occupancy,
  dt as offsetOf,
  hs as orderBetween,
  ds as orderKeys,
  ei as ownField,
  ea as pageName,
  ia as pageSize,
  wt as partNotes,
  Y as partsGeometry,
  wn as pastTheLine,
  Tt as pipelineCaption,
  mt as pipelineForecast,
  Dn as pipelineGauge,
  de as pipelineKit,
  P as pipelineLayout,
  An as pipelineLimits,
  zn as pipelineRefusal,
  Ei as pipelineRules,
  ct as pipelineStageOver,
  Pi as planBudgetMove,
  ii as planDrags,
  si as planEdit,
  ai as planFixed,
  ri as planLaunchPlanMove,
  oi as planPastRule,
  Ci as planPipelineMove,
  li as planProblem,
  ci as planProblems,
  Fi as planSamples,
  hi as planStartBy,
  vn as planWeeksProblem,
  di as planWords,
  ui as presetRules,
  sa as printSize,
  Ms as quadrantOf,
  fi as readClock,
  gi as readNoteNumbers,
  aa as readingOrder,
  ra as reflow,
  Me as registerBoardKit,
  us as registerNestPlus,
  pi as renamedNumbers,
  Re as renderLayerShapes,
  Bi as restoreWorkshop,
  fs as roleOf,
  xi as runwayCap,
  mi as runwayHeader,
  $n as runwayMonths,
  On as runwayWords,
  Di as sampleBudget,
  yi as sampleLaunchPlan,
  Ni as samplePipeline,
  z as scheduleLaunch,
  vs as scoreBoard,
  Ss as scoresIn,
  $t as shiftBudget,
  F as shortDate,
  q as snapStep,
  oa as spanOf,
  Wn as startHandle,
  it as startHandleCard,
  gs as tidyKeys,
  la as tileName,
  ca as tileTypeOf,
  ha as tileWords,
  wi as timeFamily,
  ki as timeProblems,
  Mi as timeRuleKindIds,
  vi as timeSentence,
  A as tint,
  Ut as tryTask,
  da as usedCells,
  Hi as validateBudget,
  ua as validateGrid,
  Si as validateHiringPlan,
  _i as validateLaunchPlan,
  ps as validateNest,
  Gi as validatePipeline,
  qt as w,
  _t as waitsRefusal,
  Lt as weekdayAt,
  Wi as weekendAt,
  ut as withBudgetTotal,
  jt as withLink,
  pn as withPlanStart,
  G as withTaskValue,
  fa as worksheetSample,
  j as workshopEditsBetween
};
