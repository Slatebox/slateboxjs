import { m as d, a as m, n as O, b as T, o as L, c as M, d as b, r as F, e as w, hiringPlanSample as D, goLiveSample as E, launchPlanSample as H } from "./workshop-plans.mjs";
import { bandOf as pe, brokenWaits as he, cascadeStops as ge, checkTime as ye, clockOf as ve, dateName as be, dayFromWords as we, dayMap as xe, dayWords as ke, g as Ie, downstreamTasks as $e, dragTaskEdge as Ae, earliestLaunch as Ne, edgeValues as Oe, extendWorkshopEdits as Te, hireLagFor as Le, hireStarts as Me, hiringPlanRules as Se, holdOthers as Pe, isoAt as Ce, isoTime as Re, landPlanNote as We, launchDayOn as _e, launchFinish as Be, launchHard as Fe, launchIndex as De, launchLinkRefusal as Ee, launchOverrun as He, launchPlanCaption as Je, launchPlanLimits as Ke, launchPlanRefusal as qe, launchPlanRules as ze, launchTaskText as Ge, launchTooEarly as Qe, legalRuns as je, lineWord as Ve, monthNames as Ue, moveLaunch as Xe, movePlanStart as Ye, nextMonday as Ze, offsetOf as en, pastTheLine as nn, planDrags as tn, planEdit as an, planFixed as on, planLaunchPlanMove as ln, planProblem as sn, planStartBy as rn, planWeeksProblem as cn, planWords as un, presetRules as dn, readClock as mn, f as fn, runwayCap as pn, runwayHeader as hn, runwayMonths as gn, runwayWords as yn, sampleLaunchPlan as vn, scheduleLaunch as bn, shortDate as wn, snapStep as xn, startHandle as kn, startHandleCard as In, timeFamily as $n, timeRuleKindIds as An, timeSentence as Nn, tryTask as On, validateHiringPlan as Tn, validateLaunchPlan as Ln, waitsRefusal as Mn, weekdayAt as Sn, weekendAt as Pn, withLink as Cn, withPlanStart as Rn, withTaskValue as Wn } from "./workshop-plans.mjs";
import { byOrder as Bn, checkNest as Fn, checkNestMove as Dn, extend as En, isOrderKey as Hn, nestAlias as Jn, nestAreas as Kn, nestCardText as qn, nestDepth as zn, nestDrags as Gn, nestEmptyDrop as Qn, nestFamily as jn, nestKids as Vn, nestLegal as Un, nestMeasure as Xn, nestMeasureWords as Yn, nestPlace as Zn, nestRoots as et, nestRules as nt, nestSentence as tt, nestSubtree as at, orderBetween as ot, orderKeys as lt, registerNestPlus as it, roleOf as st, tidyKeys as rt, validateNest as ct } from "./workshop-nest.mjs";
import { isOrgChart as dt, nestAxes as mt, nestQuadrants as ft, nestScores as pt, quadrantOf as ht, scoreBoard as gt, scoresIn as yt } from "./workshop-nest-plus.mjs";
import { registerWorkshopRules as S, said as y, workshopLaneOverridden as P } from "./workshop-model.mjs";
const x = (e) => !e.role;
function ie(e) {
  let t = 0;
  for (const o of e.cards) {
    const n = e.lanes.find((a) => a.id === o.laneId);
    t += (o.amount ?? 0) * (n.role === "won" ? 1 : n.role === "lost" ? 0 : n.probability ?? 0);
  }
  return Math.round(t);
}
function J(e) {
  if (e.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (e.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!e.forecast) return "A pipeline needs a forecast target.";
  if (e.lanes.filter((n) => n.role === "won").length > 1 || e.lanes.filter((n) => n.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (e.lanes.filter(x).length < 1) return "A pipeline needs an open stage.";
  for (const n of e.lanes) {
    if (x(n) && n.probability === void 0) return `Give ${n.label} a chance to win, from 0 to 100%.`;
    const a = e.cards.filter((l) => l.laneId === n.id).length;
    if (n.capacity !== void 0 && a > n.capacity && !P(e, n.id)) return `${n.label} already holds ${a} of ${n.capacity} deals.`;
  }
  const t = e.lanes.find((n) => n.role === "won"), o = t && e.cards.find((n) => n.laneId === t.id && n.amount === void 0);
  return o ? `${o.label} needs an amount before it can be won. Write it on the card, like '${o.label} $40k'.` : null;
}
function C(e, t, o) {
  const n = e.cards.find((c) => c.id === t), a = e.lanes.find((c) => c.id === o);
  if (!n || !a) return "That move is not available.";
  const l = e.lanes.find((c) => c.id === n.laneId);
  if (l === a) return null;
  const r = e.lanes.filter(x);
  if (l.role === "won" && a.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (l.role === "lost" && a.role === "won") return `Reopen ${n.label} in an open stage first.`;
  if (a.role === "won" || x(l) && x(a) && r.indexOf(a) > r.indexOf(l)) {
    const c = r[r.indexOf(l) + 1] ?? e.lanes.find((i) => i.role === "won");
    if (c !== a) return `Deals move one stage at a time. ${n.label} is in ${l.label}, so ${c.label} comes first.`;
  }
  if (a.role === "won" && n.amount === void 0)
    return `${n.label} needs an amount before it can be won. Write it on the card, like '${n.label} $40k'.`;
  const s = e.cards.filter((c) => c.laneId === a.id).length;
  return a.capacity !== void 0 && s >= a.capacity ? `${a.label} already holds ${s} of ${a.capacity} deals.` : null;
}
function K(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || C(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function q(e, t) {
  const o = e.lanes.find((s) => s.id === t), n = e.cards.filter((s) => s.laneId === t), a = n.reduce((s, c) => s + (c.amount ?? 0), 0), l = o.role === "won" ? 1 : o.role === "lost" ? 0 : o.probability ?? 0, r = o.capacity !== void 0 && n.length > o.capacity ? ` · over its limit of ${o.capacity}` : "";
  return `${n.length} ${n.length === 1 ? "deal" : "deals"} · ${d(a, e.forecast?.currency)} · ${Math.round(l * 100)}%${r}`;
}
function se(e, t) {
  const o = e.lanes.find((n) => n.id === t);
  return !!(o && o.capacity !== void 0 && e.cards.filter((n) => n.laneId === t).length > o.capacity);
}
function z(e, t) {
  return t.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : m;
}
function G() {
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
const A = (e, t, o) => t.amount === void 0 ? t.label : t.label + o + d(t.amount, e.forecast?.currency ?? e.budget?.currency), R = {
  readCard(e, t) {
    e.amount !== void 0 && (t.amount = b(e.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (e, t) => A(e, t, `
`),
  noteText: (e, t) => A(e, t, " · "),
  renamed(e, t, o) {
    const n = F(o);
    return { label: n.label, edits: n.amount !== void 0 ? [{ kind: "set_amount", card: { id: t }, amount: n.amount }] : [] };
  }
}, Q = {
  ...R,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(e, t) {
    if (e.role !== void 0) {
      if (e.role !== "won" && e.role !== "lost") throw new Error("A stage is won, lost or open.");
      t.role = e.role;
    }
    e.probability !== void 0 && (t.probability = b(e.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(e, t) {
    const o = L(e, "forecast", "A pipeline needs a forecast target.");
    t.forecast = { target: b(o.target, 1, 1e9, "A target is a whole amount above zero."), currency: M(o.currency) };
  },
  validate: J,
  planMove: K,
  refusal: C,
  caption: q,
  fromNote(e, t, o) {
    const n = T(t, o);
    return { label: n.label, ...n.amount !== void 0 && { amount: n.amount } };
  },
  newCard: () => "deal",
  edit(e, t, o) {
    const n = e.forecast.currency;
    switch (t.kind) {
      case "add_card": {
        const a = o.lane(t.lane), l = t.label?.trim() || "New deal", r = { id: O(e), label: l, laneId: a.id };
        t.amount !== void 0 && ((!Number.isInteger(t.amount) || t.amount < m.min) && o.refuse(m.reasons.min, { laneId: a.id, limits: m }), t.amount > m.max && o.refuse(m.reasons.max, { laneId: a.id, limits: m }), r.amount = t.amount), a.role && o.refuse("A new deal starts in an open stage, not in " + a.label + ".", { laneId: a.id });
        const s = e.cards.filter((c) => c.laneId === a.id).length;
        return a.capacity !== void 0 && s >= a.capacity && o.refuse(a.label + " already holds " + s + " of " + a.capacity + " deals.", { laneId: a.id }), o.done(o.settle({ ...e, cards: [...e.cards, r] }, a.id), "Added " + y(l) + " to " + y(a.label) + ".", { laneId: a.id, cardId: r.id });
      }
      case "set_amount": {
        const a = o.card(t.card), l = { laneId: a.laneId, cardId: a.id, limits: m };
        return (!Number.isInteger(t.amount) || t.amount < m.min || t.amount > m.max) && o.refuse(t.amount < m.min ? m.reasons.min : m.reasons.max, l), a.amount = t.amount, o.done(o.settle(e, a.laneId, a.id), y(a.label) + " is now " + d(t.amount, n) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_target": {
        const a = z(e, { field: "target" });
        return (!Number.isInteger(t.amount) || t.amount < 1 || t.amount > a.max) && o.refuse(t.amount < 1 ? a.reasons.min : a.reasons.max, { limits: a }), e.forecast.target = t.amount, o.done(o.settle(e), "The target is now " + d(t.amount, n) + ".");
      }
    }
    return null;
  }
};
S(Q);
function v(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.amount ?? 0 : 0), 0);
}
const I = (e, t) => Math.max(t.floor ?? 0, Math.min(v(e, t.id), t.allocation ?? 0));
function j(e, t) {
  const o = e.lanes.find((n) => n.id === t);
  return o ? Math.max(0, v(e, t) - (o.allocation ?? 0)) : 0;
}
function V(e) {
  const t = e.budget;
  if (!t) return "A budget needs a total.";
  if (e.cards.length > 16) return "A budget holds up to 16 line items.";
  const o = e.lanes.reduce((n, a) => n + (a.allocation ?? 0), 0);
  if (o !== t.total) return `The teams' allocations add up to ${d(o, t.currency)}, not ${d(t.total, t.currency)}.`;
  for (const n of e.lanes) {
    if (n.allocation === void 0) return `Give ${n.label} an allocation.`;
    if (n.floor !== void 0 && n.cap !== void 0 && n.floor > n.cap) return `${n.label}'s floor is above its cap.`;
    if (n.floor !== void 0 && n.allocation < n.floor) return `${n.label}'s floor is ${d(n.floor, t.currency)}.`;
    if (n.cap !== void 0 && n.allocation > n.cap) return `${n.label}'s cap is ${d(n.cap, t.currency)}.`;
    const a = v(e, n.id);
    if (a > n.allocation && !P(e, n.id)) return `${n.label} commits ${d(a, t.currency)} of ${d(n.allocation, t.currency)}.`;
  }
  return e.cards.some((n) => n.amount === void 0) ? "Give every line item a cost." : null;
}
function W(e, t, o) {
  const n = e.cards.find((s) => s.id === t), a = e.lanes.find((s) => s.id === o);
  if (!n || !a) return "That move is not available.";
  if (n.laneId === o) return null;
  const l = (a.allocation ?? 0) - v(e, o), r = e.budget?.currency;
  return (n.amount ?? 0) > l ? `${a.label} has ${d(l, r)} left. ${n.label} costs ${d(n.amount ?? 0, r)}.` : null;
}
function U(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || W(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function X(e, t, o, n) {
  return { ...e, lanes: e.lanes.map((a) => a.id === t ? { ...a, allocation: (a.allocation ?? 0) - n } : a.id === o ? { ...a, allocation: (a.allocation ?? 0) + n } : a) };
}
function $(e, t, o) {
  const n = e.lanes.find((u) => u.id === t), a = e.lanes.find((u) => u.id === o), l = e.budget?.currency, r = (u, g) => {
    if (!g) return `${u.label}'s cap is ${d(u.cap, l)}.`;
    const f = v(e, u.id);
    return f >= (u.floor ?? 0) ? `${u.label} already commits ${d(f, l)}.` : `${u.label}'s floor is ${d(u.floor, l)}.`;
  }, s = (u) => u.reduce((g, f) => f.value < g.value ? f : g), c = s([
    { value: n.allocation - I(e, n), why: r(n, !0) },
    ...a.cap !== void 0 ? [{ value: a.cap - a.allocation, why: r(a, !1) }] : []
  ]), i = s([
    { value: a.allocation - I(e, a), why: r(a, !0) },
    ...n.cap !== void 0 ? [{ value: n.cap - n.allocation, why: r(n, !1) }] : []
  ]);
  return { field: "amount", min: -i.value, max: c.value, reasons: { min: i.why, max: c.why } };
}
function Y(e, t, o, n) {
  if (t === o) return "Choose two different teams.";
  if (!Number.isFinite(n) || !Number.isInteger(n)) return "Move a whole amount.";
  const a = $(e, t, o);
  if (n > a.max) return a.reasons.max;
  if (n < a.min) return a.reasons.min;
  const l = e.budget?.step;
  return l && n % l !== 0 && n !== a.max && n !== a.min ? `Move money in steps of ${d(l, e.budget?.currency)}.` : null;
}
function re(e, t) {
  const o = e.lanes.findIndex((a) => a.id === t.laneId), n = e.lanes[o + 1];
  return o < 0 || !n ? { field: "amount", min: 0, max: 0, reasons: {} } : $(e, n.id, t.laneId);
}
function _(e) {
  const t = e.lanes.reduce((n, a) => n + I(e, a), 0), o = e.lanes.every((n) => n.cap !== void 0) ? e.lanes.reduce((n, a) => n + a.cap, 0) : 1e9;
  return { min: Math.max(1, t), max: o };
}
function B(e, t, o = "end") {
  const n = e.budget.currency;
  if (!Number.isInteger(t) || t < 1) return "A total is a whole amount above zero.";
  const a = _(e);
  if (t < a.min) return "The teams keep " + w(a.min, n) + " between them: their floors and what they commit. The smallest total that fits is " + w(a.min, n) + ".";
  if (t > a.max) return "Every team is at its cap. The largest total that fits is " + w(a.max, n) + ".";
  let l = t - e.budget.total;
  const r = e.lanes.map((s) => ({ ...s }));
  for (const s of o === "end" ? [...r].reverse() : r) {
    if (!l) break;
    const c = l > 0 ? (s.cap ?? 1 / 0) - s.allocation : I(e, s) - s.allocation, i = l > 0 ? Math.min(l, c) : Math.max(l, c);
    s.allocation += i, l -= i;
  }
  return { ...e, budget: { ...e.budget, total: t }, lanes: r };
}
function Z(e, t) {
  if (e.budget?.total === t.budget?.total) return null;
  const o = (a) => JSON.stringify(a.lanes.map((l) => [l.id, l.allocation]));
  return ["end", "start"].map((a) => B(e, t.budget.total, a)).filter((a) => typeof a != "string").some((a) => o(a) === o(t)) ? null : "The total changes only at the envelope’s edges: drag one, or say the new total.";
}
function ee(e, t) {
  const o = e.lanes.find((l) => l.id === t), n = e.budget?.currency, a = j(e, t);
  return `${d(o.allocation ?? 0, n)} · ${d(v(e, t), n)} committed` + (a ? ` · over budget by ${d(a, n)}` : "");
}
function ne() {
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
const te = {
  ...R,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(e, t) {
    for (const o of ["allocation", "floor", "cap"]) e[o] !== void 0 && (t[o] = b(e[o], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(e, t) {
    const o = L(e, "budget", "A budget needs a total.");
    t.budget = {
      total: b(o.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: M(o.currency),
      step: o.step === void 0 ? 5e3 : b(o.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: V,
  fixed: Z,
  planMove: U,
  refusal: W,
  caption: ee,
  fromNote(e, t, o) {
    const n = T(t, o);
    return n.amount !== void 0 ? { label: n.label, amount: n.amount } : t.trim() ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: n.label, amount: e.budget.step };
  },
  newCard: () => "line item",
  edit(e, t, o) {
    const n = e.budget.currency;
    switch (t.kind) {
      case "add_card": {
        const a = o.lane(t.lane), l = t.label?.trim() || "New line item";
        t.amount === void 0 && o.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: a.id });
        const r = { ...m, min: 1 };
        (!Number.isInteger(t.amount) || t.amount < 1) && o.refuse("A line item costs something.", { laneId: a.id, limits: r }), t.amount > m.max && o.refuse(m.reasons.max, { laneId: a.id, limits: m });
        const s = a.allocation - v(e, a.id);
        t.amount > s && o.refuse(a.label + " has " + d(s, n) + " left. " + l + " costs " + d(t.amount, n) + ".", { laneId: a.id });
        const c = { id: O(e), label: l, laneId: a.id, amount: t.amount };
        return o.done(o.settle({ ...e, cards: [...e.cards, c] }, a.id), "Added " + y(l) + " to " + y(a.label) + ".", { laneId: a.id, cardId: c.id });
      }
      case "set_amount": {
        const a = o.card(t.card), l = e.lanes.find((i) => i.id === a.laneId), r = l.allocation - v(e, l.id) + (a.amount ?? 0), s = { field: "amount", min: 1, max: r, reasons: { min: "A line item costs something.", max: y(l.label) + " has " + d(r, n) + " for it." } }, c = { laneId: a.laneId, cardId: a.id, limits: s };
        return t.amount > r && o.refuse(l.label + " has " + d(r - (a.amount ?? 0), n) + " left. " + a.label + " costs " + d(t.amount, n) + ".", { ...c, laneId: l.id }), (!Number.isInteger(t.amount) || t.amount < s.min) && o.refuse(s.reasons.min, c), a.amount = t.amount, o.done(o.settle(e, a.laneId, a.id), y(a.label) + " is now " + d(t.amount, n) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_budget_total": {
        const a = t.edge ?? "end", l = B(e, t.amount, a);
        typeof l == "string" && o.refuse(l, { limits: { field: "amount", ..._(e), reasons: {} } });
        const r = l, s = r.lanes.filter((c, i) => c.allocation !== e.lanes[i].allocation).map((c) => c.label + " " + w(c.allocation, n));
        return o.done(o.settle(r), "The budget is now " + w(t.amount, n) + (s.length ? ": " + s.join(", ") + "." : "."));
      }
      case "shift_budget": {
        const a = o.lane(t.from), l = o.lane(t.to), r = Y(e, a.id, l.id, t.amount);
        return r && o.refuse(r, { laneId: a.id, ...a.id !== l.id && { limits: $(e, a.id, l.id) } }), o.done(o.settle(X(e, a.id, l.id, t.amount), l.id), "Moved " + d(t.amount, n) + " from " + y(a.label) + " to " + y(l.label) + ".", { laneId: l.id });
      }
    }
    return null;
  }
};
S(te);
const N = {
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
  sameOwnerAs: ["mode", "role"]
}, ae = ["max", "to", "floor", "onConflict", "unit", "under", "by", "drop", "mode"], k = (e) => e.behaviour ?? { version: 1, rev: 0, rules: [] };
function ce(e, t) {
  const o = k(e).rules, n = k(t).rules, a = [], l = [], r = [], s = (i) => i === "any" ? "any" : { id: i }, c = (i) => JSON.stringify(N[i.kind].filter((u) => !ae.includes(u)).map((u) => [u, i[u]]));
  for (const i of n) {
    const u = o.find((h) => h.id === i.id), g = i;
    if (!u) {
      const h = { kind: i.kind, ...i.severity === "warn" && { severity: "warn" } };
      for (const p of N[i.kind])
        g[p] !== void 0 && (h[p] = p === "to" || p === "cards" ? g[p].map(s) : ["where", "into", "lane", "from"].includes(p) ? s(g[p]) : g[p]);
      a.push({ kind: "add_rule", rule: h }), i.on || l.push({ kind: "set_rule", rule: i.id, on: !1 });
      continue;
    }
    if (u.kind !== i.kind || c(u) !== c(i)) return null;
    const f = {};
    if (u.on !== i.on && (f.on = i.on), u.severity !== i.severity && (f.severity = i.severity), i.kind === "capacity" && u.max !== i.max && (f.max = i.max), i.kind === "path") {
      const h = i.to, p = u.to;
      if (JSON.stringify(h ?? null) !== JSON.stringify(p ?? null)) {
        if (!h) return null;
        f.to = h.map(s);
      }
    }
    for (const h of ["floor", "onConflict", "unit", "under", "by", "drop", "mode", ...i.kind === "capacity" ? [] : ["max"]]) {
      const p = i[h];
      JSON.stringify(p) !== JSON.stringify(u[h]) && (f[h] = p);
    }
    Object.keys(f).length && l.push({ kind: "set_rule", rule: i.id, ...f });
  }
  for (const i of o) n.some((u) => u.id === i.id) || r.push({ kind: "remove_rule", rule: i.id });
  return [...a, ...l, ...r];
}
function ue(e, t) {
  if (!e.behaviour && !t.behaviour) return t;
  const o = Math.max(k(e).rev, k(t).rev) + 1;
  return { ...t, behaviour: { ...k(t), rev: o } };
}
const de = { "launch-plan": H, "go-live": E, "hiring-plan": D, pipeline: G, budget: ne };
export {
  m as amountLimits,
  b as amountOf,
  R as amountRules,
  pe as bandOf,
  ce as behaviourEditsBetween,
  he as brokenWaits,
  ee as budgetCaption,
  v as budgetCommitted,
  re as budgetLimits,
  j as budgetOver,
  W as budgetRefusal,
  te as budgetRules,
  $ as budgetShiftLimits,
  Y as budgetShiftRefusal,
  _ as budgetTotalBounds,
  Z as budgetTotalFixed,
  Bn as byOrder,
  ge as cascadeStops,
  Fn as checkNest,
  Dn as checkNestMove,
  ye as checkTime,
  ve as clockOf,
  M as currencyOf,
  be as dateName,
  we as dayFromWords,
  xe as dayMap,
  ke as dayWords,
  Ie as days,
  $e as downstreamTasks,
  Ae as dragTaskEdge,
  Ne as earliestLaunch,
  Oe as edgeValues,
  En as extend,
  Te as extendWorkshopEdits,
  E as goLiveSample,
  Le as hireLagFor,
  Me as hireStarts,
  Se as hiringPlanRules,
  D as hiringPlanSample,
  Pe as holdOthers,
  Hn as isOrderKey,
  dt as isOrgChart,
  Ce as isoAt,
  Re as isoTime,
  We as landPlanNote,
  _e as launchDayOn,
  Be as launchFinish,
  Fe as launchHard,
  De as launchIndex,
  Ee as launchLinkRefusal,
  He as launchOverrun,
  Je as launchPlanCaption,
  Ke as launchPlanLimits,
  qe as launchPlanRefusal,
  ze as launchPlanRules,
  H as launchPlanSample,
  Ge as launchTaskText,
  Qe as launchTooEarly,
  je as legalRuns,
  Ve as lineWord,
  d as money,
  w as moneyExact,
  Ue as monthNames,
  Xe as moveLaunch,
  Ye as movePlanStart,
  Jn as nestAlias,
  Kn as nestAreas,
  mt as nestAxes,
  qn as nestCardText,
  zn as nestDepth,
  Gn as nestDrags,
  Qn as nestEmptyDrop,
  jn as nestFamily,
  Vn as nestKids,
  Un as nestLegal,
  Xn as nestMeasure,
  Yn as nestMeasureWords,
  Zn as nestPlace,
  ft as nestQuadrants,
  et as nestRoots,
  nt as nestRules,
  pt as nestScores,
  tt as nestSentence,
  at as nestSubtree,
  O as nextCardId,
  Ze as nextMonday,
  T as noteNumbers,
  en as offsetOf,
  ot as orderBetween,
  lt as orderKeys,
  L as ownField,
  nn as pastTheLine,
  q as pipelineCaption,
  ie as pipelineForecast,
  z as pipelineLimits,
  C as pipelineRefusal,
  Q as pipelineRules,
  se as pipelineStageOver,
  U as planBudgetMove,
  tn as planDrags,
  an as planEdit,
  on as planFixed,
  ln as planLaunchPlanMove,
  K as planPipelineMove,
  sn as planProblem,
  de as planSamples,
  rn as planStartBy,
  cn as planWeeksProblem,
  un as planWords,
  dn as presetRules,
  ht as quadrantOf,
  mn as readClock,
  fn as readNoteNumbers,
  it as registerNestPlus,
  F as renamedNumbers,
  ue as restoreWorkshop,
  st as roleOf,
  pn as runwayCap,
  hn as runwayHeader,
  gn as runwayMonths,
  yn as runwayWords,
  ne as sampleBudget,
  vn as sampleLaunchPlan,
  G as samplePipeline,
  bn as scheduleLaunch,
  gt as scoreBoard,
  yt as scoresIn,
  X as shiftBudget,
  wn as shortDate,
  xn as snapStep,
  kn as startHandle,
  In as startHandleCard,
  rt as tidyKeys,
  $n as timeFamily,
  An as timeRuleKindIds,
  Nn as timeSentence,
  On as tryTask,
  V as validateBudget,
  Tn as validateHiringPlan,
  Ln as validateLaunchPlan,
  ct as validateNest,
  J as validatePipeline,
  Mn as waitsRefusal,
  Sn as weekdayAt,
  Pn as weekendAt,
  B as withBudgetTotal,
  Cn as withLink,
  Rn as withPlanStart,
  Wn as withTaskValue
};
