import { m as u, a as m, n as P, b as O, o as L, c as M, d as v, r as F, e as w, hiringPlanSample as G, goLiveSample as z, launchPlanSample as H } from "./workshop-plans.mjs";
import { bandOf as he, brokenWaits as ge, cascadeStops as ye, checkTime as be, clockOf as ve, dateName as we, dayFromWords as xe, dayMap as ke, dayWords as Ie, g as $e, downstreamTasks as Se, dragTaskEdge as Ae, earliestLaunch as Ne, edgeValues as Te, extendWorkshopEdits as Pe, hireLagFor as Oe, hireStarts as Le, hiringPlanRules as Me, holdOthers as Ce, isoAt as Re, isoTime as _e, landPlanNote as Be, launchDayOn as We, launchFinish as De, launchHard as Ee, launchIndex as Fe, launchLinkRefusal as Ge, launchOverrun as ze, launchPlanCaption as He, launchPlanLimits as Je, launchPlanRefusal as Ke, launchPlanRules as qe, launchTaskText as je, launchTooEarly as Qe, legalRuns as Xe, lineWord as Ve, monthNames as Ye, moveLaunch as Ue, movePlanStart as Ze, nextMonday as en, offsetOf as nn, pastTheLine as tn, planDrags as an, planEdit as ln, planFixed as on, planLaunchPlanMove as sn, planPastRule as rn, planProblem as cn, planProblems as un, planStartBy as dn, planWeeksProblem as mn, planWords as fn, presetRules as pn, readClock as hn, f as gn, runwayCap as yn, runwayHeader as bn, runwayMonths as vn, runwayWords as wn, sampleLaunchPlan as xn, scheduleLaunch as kn, shortDate as In, snapStep as $n, startHandle as Sn, startHandleCard as An, timeFamily as Nn, timeProblems as Tn, timeRuleKindIds as Pn, timeSentence as On, tryTask as Ln, validateHiringPlan as Mn, validateLaunchPlan as Cn, waitsRefusal as Rn, weekdayAt as _n, weekendAt as Bn, withLink as Wn, withPlanStart as Dn, withTaskValue as En } from "./workshop-plans.mjs";
import { byOrder as Gn, checkNest as zn, checkNestMove as Hn, extend as Jn, isOrderKey as Kn, nestAlias as qn, nestAreas as jn, nestCardText as Qn, nestDepth as Xn, nestDrags as Vn, nestEmptyDrop as Yn, nestFamily as Un, nestKids as Zn, nestLegal as et, nestMeasure as nt, nestMeasureWords as tt, nestPlace as at, nestRoots as lt, nestRules as ot, nestSentence as it, nestSubtree as st, orderBetween as rt, orderKeys as ct, registerNestPlus as ut, roleOf as dt, tidyKeys as mt, validateNest as ft } from "./workshop-nest.mjs";
import { isOrgChart as ht, nestAxes as gt, nestQuadrants as yt, nestScores as bt, quadrantOf as vt, scoreBoard as wt, scoresIn as xt } from "./workshop-nest-plus.mjs";
import { GRID_MAX_STAMPS as It, GRID_MAX_TILES as $t, GRID_TRAY as St, MIN_CELL as At, PX_PER_INCH as Nt, bingoSample as Tt, cellAt as Pt, cellBox as Ot, cellSize as Lt, cellSizeProblem as Mt, checkGrid as Ct, defaultSpan as Rt, fits as _t, flashcardSample as Bt, freeCells as Wt, gridCaption as Dt, gridCardText as Et, gridFamily as Ft, gridFromNote as Gt, gridNeeds as zt, gridNoteText as Ht, gridOverridable as Jt, gridPages as Kt, gridPrintProblems as qt, gridRuleSentence as jt, gridRules as Qt, gridSamples as Xt, gridSheet as Vt, gridTileTypes as Yt, inBounds as Ut, occupancy as Zt, pageName as ea, pageSize as na, printSize as ta, readingOrder as aa, reflow as la, spanOf as oa, tileName as ia, tileTypeOf as sa, tileWords as ra, usedCells as ca, validateGrid as ua, worksheetSample as da } from "./workshop-grid.mjs";
import { registerWorkshopRules as C, said as g, workshopLaneOverridden as R } from "./workshop-model.mjs";
const x = (e) => !e.role;
function se(e) {
  let n = 0;
  for (const l of e.cards) {
    const t = e.lanes.find((a) => a.id === l.laneId);
    n += (l.amount ?? 0) * (t.role === "won" ? 1 : t.role === "lost" ? 0 : t.probability ?? 0);
  }
  return Math.round(n);
}
function J(e) {
  if (e.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (e.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!e.forecast) return "A pipeline needs a forecast target.";
  if (e.lanes.filter((t) => t.role === "won").length > 1 || e.lanes.filter((t) => t.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (e.lanes.filter(x).length < 1) return "A pipeline needs an open stage.";
  for (const t of e.lanes) {
    if (x(t) && t.probability === void 0) return `Give ${t.label} a chance to win, from 0 to 100%.`;
    const a = e.cards.filter((o) => o.laneId === t.id).length;
    if (t.capacity !== void 0 && a > t.capacity && !R(e, t.id)) return `${t.label} already holds ${a} of ${t.capacity} deals.`;
  }
  const n = e.lanes.find((t) => t.role === "won"), l = n && e.cards.find((t) => t.laneId === n.id && t.amount === void 0);
  return l ? `${l.label} needs an amount before it can be won. Write it on the card, like '${l.label} $40k'.` : null;
}
function _(e, n, l) {
  const t = e.cards.find((i) => i.id === n), a = e.lanes.find((i) => i.id === l);
  if (!t || !a) return "That move is not available.";
  const o = e.lanes.find((i) => i.id === t.laneId);
  if (o === a) return null;
  const r = e.lanes.filter(x);
  if (o.role === "won" && a.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (o.role === "lost" && a.role === "won") return `Reopen ${t.label} in an open stage first.`;
  if (a.role === "won" && t.amount === void 0)
    return `${t.label} needs an amount before it can be won. Write it on the card, like '${t.label} $40k'.`;
  const s = [];
  if (a.role === "won" || x(o) && x(a) && r.indexOf(a) > r.indexOf(o)) {
    const i = r[r.indexOf(o) + 1] ?? e.lanes.find((c) => c.role === "won");
    i !== a && s.push(`Deals move one stage at a time. ${t.label} is in ${o.label}, so ${i.label} comes first.`);
  }
  const d = e.cards.filter((i) => i.laneId === a.id).length;
  return a.capacity !== void 0 && d >= a.capacity && s.push(`${a.label} already holds ${d} of ${a.capacity} deals.`), s.length ? s.join(" ") : null;
}
function K(e, n, l) {
  const t = e.cards.find((a) => a.id === n);
  return !t || _(e, n, l) !== null ? null : t.laneId === l ? e : { ...e, cards: [...e.cards.filter((a) => a !== t), { ...t, laneId: l }] };
}
function q(e, n) {
  const l = e.lanes.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n), a = t.reduce((s, d) => s + (d.amount ?? 0), 0), o = l.role === "won" ? 1 : l.role === "lost" ? 0 : l.probability ?? 0, r = l.capacity !== void 0 && t.length > l.capacity ? ` · over its limit of ${l.capacity}` : "";
  return `${t.length} ${t.length === 1 ? "deal" : "deals"} · ${u(a, e.forecast?.currency)} · ${Math.round(o * 100)}%${r}`;
}
function re(e, n) {
  const l = e.lanes.find((t) => t.id === n);
  return !!(l && l.capacity !== void 0 && e.cards.filter((t) => t.laneId === n).length > l.capacity);
}
function j(e, n) {
  return n.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : m;
}
function Q() {
  return {
    version: 1,
    kind: "pipeline",
    title: "Q3 sales pipeline",
    forecast: { target: 25e4, currency: "$" },
    lanes: [
      { id: "lead", label: "Lead", probability: 0.1 },
      { id: "qualified", label: "Qualified", probability: 0.3 },
      { id: "proposal", label: "Proposal", probability: 0.6, capacity: 3 },
      { id: "won", label: "Won", role: "won" },
      { id: "lost", label: "Lost", role: "lost" }
    ],
    cards: [
      { id: "northwind", label: "Northwind", laneId: "lead", amount: 4e4 },
      { id: "globex", label: "Globex", laneId: "lead", amount: 6e4 },
      { id: "acme", label: "Acme", laneId: "qualified", amount: 25e3 },
      { id: "brightline", label: "Brightline", laneId: "proposal", amount: 55e3 },
      { id: "copperleaf", label: "Copperleaf", laneId: "proposal", amount: 8e4 },
      { id: "harbor", label: "Harbor & Co", laneId: "proposal", amount: 35e3 },
      { id: "bluefin", label: "Bluefin", laneId: "won", amount: 7e4 }
    ]
  };
}
const N = (e, n, l) => n.amount === void 0 ? n.label : n.label + l + u(n.amount, e.forecast?.currency ?? e.budget?.currency), B = {
  readCard(e, n) {
    e.amount !== void 0 && (n.amount = v(e.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (e, n) => N(e, n, `
`),
  noteText: (e, n) => N(e, n, " · "),
  renamed(e, n, l) {
    const t = F(l);
    return { label: t.label, edits: t.amount !== void 0 ? [{ kind: "set_amount", card: { id: n }, amount: t.amount }] : [] };
  }
}, X = {
  ...B,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(e, n) {
    if (e.role !== void 0) {
      if (e.role !== "won" && e.role !== "lost") throw new Error("A stage is won, lost or open.");
      n.role = e.role;
    }
    e.probability !== void 0 && (n.probability = v(e.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(e, n) {
    const l = L(e, "forecast", "A pipeline needs a forecast target.");
    n.forecast = { target: v(l.target, 1, 1e9, "A target is a whole amount above zero."), currency: M(l.currency) };
  },
  validate: J,
  planMove: K,
  refusal: _,
  caption: q,
  fromNote(e, n, l) {
    const t = O(n, l);
    return { label: t.label, ...t.amount !== void 0 && { amount: t.amount } };
  },
  newCard: () => "deal",
  edit(e, n, l) {
    const t = e.forecast.currency;
    switch (n.kind) {
      case "add_card": {
        const a = l.lane(n.lane), o = n.label?.trim() || "New deal", r = { id: P(e), label: o, laneId: a.id };
        n.amount !== void 0 && ((!Number.isInteger(n.amount) || n.amount < m.min) && l.refuse(m.reasons.min, { laneId: a.id, limits: m }), n.amount > m.max && l.refuse(m.reasons.max, { laneId: a.id, limits: m }), r.amount = n.amount), a.role && l.refuse("A new deal starts in an open stage, not in " + a.label + ".", { laneId: a.id });
        const s = e.cards.filter((d) => d.laneId === a.id).length;
        return a.capacity !== void 0 && s >= a.capacity && l.refuse(a.label + " already holds " + s + " of " + a.capacity + " deals.", { laneId: a.id }), l.done(l.settle({ ...e, cards: [...e.cards, r] }, a.id), "Added " + g(o) + " to " + g(a.label) + ".", { laneId: a.id, cardId: r.id });
      }
      case "set_amount": {
        const a = l.card(n.card), o = { laneId: a.laneId, cardId: a.id, limits: m };
        return (!Number.isInteger(n.amount) || n.amount < m.min || n.amount > m.max) && l.refuse(n.amount < m.min ? m.reasons.min : m.reasons.max, o), a.amount = n.amount, l.done(l.settle(e, a.laneId, a.id), g(a.label) + " is now " + u(n.amount, t) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_target": {
        const a = j(e, { field: "target" });
        return (!Number.isInteger(n.amount) || n.amount < 1 || n.amount > a.max) && l.refuse(n.amount < 1 ? a.reasons.min : a.reasons.max, { limits: a }), e.forecast.target = n.amount, l.done(l.settle(e), "The target is now " + u(n.amount, t) + ".");
      }
    }
    return null;
  }
};
C(X);
function b(e, n) {
  return e.cards.reduce((l, t) => l + (t.laneId === n ? t.amount ?? 0 : 0), 0);
}
const I = (e, n) => Math.max(n.floor ?? 0, Math.min(b(e, n.id), n.allocation ?? 0)), $ = (e, n) => n.label + " is over budget by " + u(S(e, n.id), e.budget?.currency) + ".";
function S(e, n) {
  const l = e.lanes.find((t) => t.id === n);
  return l ? Math.max(0, b(e, n) - (l.allocation ?? 0)) : 0;
}
function V(e) {
  const n = e.budget;
  if (!n) return "A budget needs a total.";
  if (e.cards.length > 16) return "A budget holds up to 16 line items.";
  const l = e.lanes.reduce((t, a) => t + (a.allocation ?? 0), 0);
  if (l !== n.total) return `The teams' allocations add up to ${u(l, n.currency)}, not ${u(n.total, n.currency)}.`;
  for (const t of e.lanes) {
    if (t.allocation === void 0) return `Give ${t.label} an allocation.`;
    if (t.floor !== void 0 && t.cap !== void 0 && t.floor > t.cap) return `${t.label}'s floor is above its cap.`;
    if (t.floor !== void 0 && t.allocation < t.floor) return `${t.label}'s floor is ${u(t.floor, n.currency)}.`;
    if (t.cap !== void 0 && t.allocation > t.cap) return `${t.label}'s cap is ${u(t.cap, n.currency)}.`;
    const a = b(e, t.id);
    if (a > t.allocation && !R(e, t.id)) return `${t.label} commits ${u(a, n.currency)} of ${u(t.allocation, n.currency)}.`;
  }
  return e.cards.some((t) => t.amount === void 0) ? "Give every line item a cost." : null;
}
function W(e, n, l) {
  const t = e.cards.find((s) => s.id === n), a = e.lanes.find((s) => s.id === l);
  if (!t || !a) return "That move is not available.";
  if (t.laneId === l) return null;
  const o = (a.allocation ?? 0) - b(e, l), r = e.budget?.currency;
  return (t.amount ?? 0) > o ? `${a.label} has ${u(o, r)} left. ${t.label} costs ${u(t.amount ?? 0, r)}.` : null;
}
function Y(e, n, l) {
  const t = e.cards.find((a) => a.id === n);
  return !t || W(e, n, l) !== null ? null : t.laneId === l ? e : { ...e, cards: [...e.cards.filter((a) => a !== t), { ...t, laneId: l }] };
}
function U(e, n, l, t) {
  return { ...e, lanes: e.lanes.map((a) => a.id === n ? { ...a, allocation: (a.allocation ?? 0) - t } : a.id === l ? { ...a, allocation: (a.allocation ?? 0) + t } : a) };
}
function A(e, n, l) {
  const t = e.lanes.find((c) => c.id === n), a = e.lanes.find((c) => c.id === l), o = e.budget?.currency, r = (c, y) => {
    if (!y) return `${c.label}'s cap is ${u(c.cap, o)}.`;
    const f = b(e, c.id);
    return f >= (c.floor ?? 0) ? `${c.label} already commits ${u(f, o)}.` : `${c.label}'s floor is ${u(c.floor, o)}.`;
  }, s = (c) => c.reduce((y, f) => f.value < y.value ? f : y), d = s([
    { value: t.allocation - I(e, t), why: r(t, !0) },
    ...a.cap !== void 0 ? [{ value: a.cap - a.allocation, why: r(a, !1) }] : []
  ]), i = s([
    { value: a.allocation - I(e, a), why: r(a, !0) },
    ...t.cap !== void 0 ? [{ value: t.cap - t.allocation, why: r(t, !1) }] : []
  ]);
  return { field: "amount", min: -i.value, max: d.value, reasons: { min: i.why, max: d.why } };
}
function Z(e, n, l, t) {
  if (n === l) return "Choose two different teams.";
  if (!Number.isFinite(t) || !Number.isInteger(t)) return "Move a whole amount.";
  const a = A(e, n, l);
  if (t > a.max) return a.reasons.max;
  if (t < a.min) return a.reasons.min;
  const o = e.budget?.step;
  return o && t % o !== 0 && t !== a.max && t !== a.min ? `Move money in steps of ${u(o, e.budget?.currency)}.` : null;
}
function ce(e, n) {
  const l = e.lanes.findIndex((a) => a.id === n.laneId), t = e.lanes[l + 1];
  return l < 0 || !t ? { field: "amount", min: 0, max: 0, reasons: {} } : A(e, t.id, n.laneId);
}
function D(e) {
  const n = e.lanes.reduce((t, a) => t + I(e, a), 0), l = e.lanes.every((t) => t.cap !== void 0) ? e.lanes.reduce((t, a) => t + a.cap, 0) : 1e9;
  return { min: Math.max(1, n), max: l };
}
function E(e, n, l = "end") {
  const t = e.budget.currency;
  if (!Number.isInteger(n) || n < 1) return "A total is a whole amount above zero.";
  const a = D(e);
  if (n < a.min) return "The teams keep " + w(a.min, t) + " between them: their floors and what they commit. The smallest total that fits is " + w(a.min, t) + ".";
  if (n > a.max) return "Every team is at its cap. The largest total that fits is " + w(a.max, t) + ".";
  let o = n - e.budget.total;
  const r = e.lanes.map((s) => ({ ...s }));
  for (const s of l === "end" ? [...r].reverse() : r) {
    if (!o) break;
    const d = o > 0 ? (s.cap ?? 1 / 0) - s.allocation : I(e, s) - s.allocation, i = o > 0 ? Math.min(o, d) : Math.max(o, d);
    s.allocation += i, o -= i;
  }
  return { ...e, budget: { ...e.budget, total: n }, lanes: r };
}
function ee(e, n) {
  if (e.budget?.total === n.budget?.total) return null;
  const l = (a) => JSON.stringify(a.lanes.map((o) => [o.id, o.allocation]));
  return ["end", "start"].map((a) => E(e, n.budget.total, a)).filter((a) => typeof a != "string").some((a) => l(a) === l(n)) ? null : "The total changes only at the envelope’s edges: drag one, or say the new total.";
}
function ne(e, n) {
  const l = e.lanes.find((o) => o.id === n), t = e.budget?.currency, a = S(e, n);
  return `${u(l.allocation ?? 0, t)} · ${u(b(e, n), t)} committed` + (a ? ` · over budget by ${u(a, t)}` : "");
}
function te() {
  return {
    version: 1,
    kind: "budget",
    title: "Next year’s budget",
    budget: { total: 12e5, currency: "$", step: 5e3 },
    lanes: [
      { id: "product", label: "Product", allocation: 4e5, floor: 3e5 },
      { id: "sales", label: "Sales", allocation: 4e5 },
      { id: "design", label: "Design", allocation: 15e4 },
      { id: "marketing", label: "Marketing", allocation: 25e4, cap: 3e5 }
    ],
    cards: [
      { id: "contractor", label: "Contractor", laneId: "product", amount: 45e3 },
      { id: "licences", label: "Platform licences", laneId: "product", amount: 2e5 },
      { id: "hires", label: "Two account executives", laneId: "sales", amount: 32e4 },
      { id: "panel", label: "Research panel", laneId: "design", amount: 12e4 },
      { id: "ads", label: "Launch ads", laneId: "marketing", amount: 15e4 }
    ]
  };
}
const ae = {
  ...B,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(e, n) {
    for (const l of ["allocation", "floor", "cap"]) e[l] !== void 0 && (n[l] = v(e[l], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(e, n) {
    const l = L(e, "budget", "A budget needs a total.");
    n.budget = {
      total: v(l.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: M(l.currency),
      step: l.step === void 0 ? 5e3 : v(l.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: V,
  fixed: ee,
  planMove: Y,
  refusal: W,
  caption: ne,
  fromNote(e, n, l) {
    const t = O(n, l);
    return t.amount !== void 0 ? { label: t.label, amount: t.amount } : n.trim() ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: t.label, amount: e.budget.step };
  },
  newCard: () => "line item",
  edit(e, n, l) {
    const t = e.budget.currency;
    switch (n.kind) {
      case "add_card": {
        const a = l.lane(n.lane), o = n.label?.trim() || "New line item";
        n.amount === void 0 && l.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: a.id });
        const r = { ...m, min: 1 };
        (!Number.isInteger(n.amount) || n.amount < 1) && l.refuse("A line item costs something.", { laneId: a.id, limits: r }), n.amount > m.max && l.refuse(m.reasons.max, { laneId: a.id, limits: m });
        const s = a.allocation - b(e, a.id);
        n.amount > s && l.refuse((s < 0 ? $(e, a) : a.label + " has " + u(s, t) + " left.") + " " + o + " costs " + u(n.amount, t) + ".", { laneId: a.id });
        const d = { id: P(e), label: o, laneId: a.id, amount: n.amount };
        return l.done(l.settle({ ...e, cards: [...e.cards, d] }, a.id), "Added " + g(o) + " to " + g(a.label) + ".", { laneId: a.id, cardId: d.id });
      }
      case "set_amount": {
        const a = l.card(n.card), o = e.lanes.find((c) => c.id === a.laneId), r = Math.max(o.allocation - b(e, o.id) + (a.amount ?? 0), a.amount ?? 0), s = S(e, o.id) > 0, d = { field: "amount", min: 1, max: r, reasons: { min: "A line item costs something.", max: s ? $(e, o) + " " + g(a.label) + " can cost " + u(r, t) + " at most." : g(o.label) + " has " + u(r, t) + " for it." } }, i = { laneId: a.laneId, cardId: a.id, limits: d };
        return n.amount > r && l.refuse((s ? $(e, o) : o.label + " has " + u(r - (a.amount ?? 0), t) + " left.") + " " + a.label + " costs " + u(n.amount, t) + ".", { ...i, laneId: o.id }), (!Number.isInteger(n.amount) || n.amount < d.min) && l.refuse(d.reasons.min, i), a.amount = n.amount, l.done(l.settle(e, a.laneId, a.id), g(a.label) + " is now " + u(n.amount, t) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_budget_total": {
        const a = n.edge ?? "end", o = E(e, n.amount, a);
        typeof o == "string" && l.refuse(o, { limits: { field: "amount", ...D(e), reasons: {} } });
        const r = o, s = r.lanes.filter((d, i) => d.allocation !== e.lanes[i].allocation).map((d) => d.label + " " + w(d.allocation, t));
        return l.done(l.settle(r), "The budget is now " + w(n.amount, t) + (s.length ? ": " + s.join(", ") + "." : "."));
      }
      case "shift_budget": {
        const a = l.lane(n.from), o = l.lane(n.to), r = Z(e, a.id, o.id, n.amount);
        return r && l.refuse(r, { laneId: a.id, ...a.id !== o.id && { limits: A(e, a.id, o.id) } }), l.done(l.settle(U(e, a.id, o.id, n.amount), o.id), "Moved " + u(n.amount, t) + " from " + g(a.label) + " to " + g(o.label) + ".", { laneId: o.id });
      }
    }
    return null;
  }
};
C(ae);
const T = {
  capacity: ["where", "max"],
  path: ["from", "to", "noSkip"],
  gate: ["into", "needs"],
  bin: ["lane"],
  deadline: ["at", "floor"],
  overlap: ["lane"],
  snap: ["unit"],
  workdays: [],
  blackout: ["start", "end", "label"],
  cascade: ["onConflict"],
  locked: ["cards"],
  nests: ["role", "under"],
  children: ["max", "role"],
  depth: ["max"],
  rank: ["by"],
  emptyDrop: ["drop"],
  quadrant: ["quadrant", "max"],
  parent: ["not"],
  contains: ["role", "of", "atLeast"],
  sameOwnerAs: ["mode", "role"],
  tileTypes: ["types"],
  tileMax: ["type", "max", "per"],
  tileNeeds: ["type", "atLeast", "per"],
  tileSpan: ["type", "rows", "cols"]
}, le = ["max", "to", "floor", "onConflict", "unit", "under", "by", "drop", "mode", "types", "per", "atLeast", "rows", "cols"], k = (e) => e.behaviour ?? { version: 1, rev: 0, rules: [] };
function ue(e, n) {
  const l = k(e).rules, t = k(n).rules, a = [], o = [], r = [], s = (i) => i === "any" ? "any" : { id: i }, d = (i) => JSON.stringify(T[i.kind].filter((c) => !le.includes(c)).map((c) => [c, i[c]]));
  for (const i of t) {
    const c = l.find((h) => h.id === i.id), y = i;
    if (!c) {
      const h = { kind: i.kind, ...i.severity === "warn" && { severity: "warn" } };
      for (const p of T[i.kind])
        y[p] !== void 0 && (h[p] = p === "to" || p === "cards" ? y[p].map(s) : ["where", "into", "lane", "from"].includes(p) ? s(y[p]) : y[p]);
      a.push({ kind: "add_rule", rule: h }), i.on || o.push({ kind: "set_rule", rule: i.id, on: !1 });
      continue;
    }
    if (c.kind !== i.kind || d(c) !== d(i)) return null;
    const f = {};
    if (c.on !== i.on && (f.on = i.on), c.severity !== i.severity && (f.severity = i.severity), i.kind === "capacity" && c.max !== i.max && (f.max = i.max), i.kind === "path") {
      const h = i.to, p = c.to;
      if (JSON.stringify(h ?? null) !== JSON.stringify(p ?? null)) {
        if (!h) return null;
        f.to = h.map(s);
      }
    }
    for (const h of ["floor", "onConflict", "unit", "under", "by", "drop", "mode", ...i.kind === "capacity" ? [] : ["max"]]) {
      const p = i[h];
      JSON.stringify(p) !== JSON.stringify(c[h]) && (f[h] = p);
    }
    Object.keys(f).length && o.push({ kind: "set_rule", rule: i.id, ...f });
  }
  for (const i of l) t.some((c) => c.id === i.id) || r.push({ kind: "remove_rule", rule: i.id });
  return [...a, ...o, ...r];
}
function de(e, n) {
  if (!e.behaviour && !n.behaviour) return n;
  const l = Math.max(k(e).rev, k(n).rev) + 1;
  return { ...n, behaviour: { ...k(n), rev: l } };
}
const me = { "launch-plan": H, "go-live": z, "hiring-plan": G, pipeline: Q, budget: te };
export {
  It as GRID_MAX_STAMPS,
  $t as GRID_MAX_TILES,
  St as GRID_TRAY,
  At as MIN_CELL,
  Nt as PX_PER_INCH,
  m as amountLimits,
  v as amountOf,
  B as amountRules,
  he as bandOf,
  ue as behaviourEditsBetween,
  Tt as bingoSample,
  ge as brokenWaits,
  ne as budgetCaption,
  b as budgetCommitted,
  ce as budgetLimits,
  S as budgetOver,
  W as budgetRefusal,
  ae as budgetRules,
  A as budgetShiftLimits,
  Z as budgetShiftRefusal,
  D as budgetTotalBounds,
  ee as budgetTotalFixed,
  Gn as byOrder,
  ye as cascadeStops,
  Pt as cellAt,
  Ot as cellBox,
  Lt as cellSize,
  Mt as cellSizeProblem,
  Ct as checkGrid,
  zn as checkNest,
  Hn as checkNestMove,
  be as checkTime,
  ve as clockOf,
  M as currencyOf,
  we as dateName,
  xe as dayFromWords,
  ke as dayMap,
  Ie as dayWords,
  $e as days,
  Rt as defaultSpan,
  Se as downstreamTasks,
  Ae as dragTaskEdge,
  Ne as earliestLaunch,
  Te as edgeValues,
  Jn as extend,
  Pe as extendWorkshopEdits,
  _t as fits,
  Bt as flashcardSample,
  Wt as freeCells,
  z as goLiveSample,
  Dt as gridCaption,
  Et as gridCardText,
  Ft as gridFamily,
  Gt as gridFromNote,
  zt as gridNeeds,
  Ht as gridNoteText,
  Jt as gridOverridable,
  Kt as gridPages,
  qt as gridPrintProblems,
  jt as gridRuleSentence,
  Qt as gridRules,
  Xt as gridSamples,
  Vt as gridSheet,
  Yt as gridTileTypes,
  Oe as hireLagFor,
  Le as hireStarts,
  Me as hiringPlanRules,
  G as hiringPlanSample,
  Ce as holdOthers,
  Ut as inBounds,
  Kn as isOrderKey,
  ht as isOrgChart,
  Re as isoAt,
  _e as isoTime,
  Be as landPlanNote,
  We as launchDayOn,
  De as launchFinish,
  Ee as launchHard,
  Fe as launchIndex,
  Ge as launchLinkRefusal,
  ze as launchOverrun,
  He as launchPlanCaption,
  Je as launchPlanLimits,
  Ke as launchPlanRefusal,
  qe as launchPlanRules,
  H as launchPlanSample,
  je as launchTaskText,
  Qe as launchTooEarly,
  Xe as legalRuns,
  Ve as lineWord,
  u as money,
  w as moneyExact,
  Ye as monthNames,
  Ue as moveLaunch,
  Ze as movePlanStart,
  qn as nestAlias,
  jn as nestAreas,
  gt as nestAxes,
  Qn as nestCardText,
  Xn as nestDepth,
  Vn as nestDrags,
  Yn as nestEmptyDrop,
  Un as nestFamily,
  Zn as nestKids,
  et as nestLegal,
  nt as nestMeasure,
  tt as nestMeasureWords,
  at as nestPlace,
  yt as nestQuadrants,
  lt as nestRoots,
  ot as nestRules,
  bt as nestScores,
  it as nestSentence,
  st as nestSubtree,
  P as nextCardId,
  en as nextMonday,
  O as noteNumbers,
  Zt as occupancy,
  nn as offsetOf,
  rt as orderBetween,
  ct as orderKeys,
  L as ownField,
  ea as pageName,
  na as pageSize,
  tn as pastTheLine,
  q as pipelineCaption,
  se as pipelineForecast,
  j as pipelineLimits,
  _ as pipelineRefusal,
  X as pipelineRules,
  re as pipelineStageOver,
  Y as planBudgetMove,
  an as planDrags,
  ln as planEdit,
  on as planFixed,
  sn as planLaunchPlanMove,
  rn as planPastRule,
  K as planPipelineMove,
  cn as planProblem,
  un as planProblems,
  me as planSamples,
  dn as planStartBy,
  mn as planWeeksProblem,
  fn as planWords,
  pn as presetRules,
  ta as printSize,
  vt as quadrantOf,
  hn as readClock,
  gn as readNoteNumbers,
  aa as readingOrder,
  la as reflow,
  ut as registerNestPlus,
  F as renamedNumbers,
  de as restoreWorkshop,
  dt as roleOf,
  yn as runwayCap,
  bn as runwayHeader,
  vn as runwayMonths,
  wn as runwayWords,
  te as sampleBudget,
  xn as sampleLaunchPlan,
  Q as samplePipeline,
  kn as scheduleLaunch,
  wt as scoreBoard,
  xt as scoresIn,
  U as shiftBudget,
  In as shortDate,
  $n as snapStep,
  oa as spanOf,
  Sn as startHandle,
  An as startHandleCard,
  mt as tidyKeys,
  ia as tileName,
  sa as tileTypeOf,
  ra as tileWords,
  Nn as timeFamily,
  Tn as timeProblems,
  Pn as timeRuleKindIds,
  On as timeSentence,
  Ln as tryTask,
  ca as usedCells,
  V as validateBudget,
  ua as validateGrid,
  Mn as validateHiringPlan,
  Cn as validateLaunchPlan,
  ft as validateNest,
  J as validatePipeline,
  Rn as waitsRefusal,
  _n as weekdayAt,
  Bn as weekendAt,
  E as withBudgetTotal,
  Wn as withLink,
  Dn as withPlanStart,
  En as withTaskValue,
  da as worksheetSample
};
