import { m as u, a as m, n as P, b as L, o as M, c as S, d as b, r as E, e as w, hiringPlanSample as H, goLiveSample as J, launchPlanSample as K } from "./workshop-plans.mjs";
import { bandOf as he, brokenWaits as ge, cascadeStops as ye, checkTime as ve, clockOf as be, dateName as we, dayFromWords as xe, dayMap as ke, dayWords as Ie, g as $e, downstreamTasks as Ae, dragTaskEdge as Ne, earliestLaunch as Oe, edgeValues as Te, extendWorkshopEdits as Pe, hireLagFor as Le, hireStarts as Me, hiringPlanRules as Se, holdOthers as Ce, isoAt as Re, isoTime as We, landPlanNote as _e, launchDayOn as Be, launchFinish as Fe, launchHard as De, launchIndex as Ee, launchLinkRefusal as He, launchOverrun as Je, launchPlanCaption as Ke, launchPlanLimits as qe, launchPlanRefusal as ze, launchPlanRules as Ge, launchTaskText as je, launchTooEarly as Qe, legalRuns as Ve, lineWord as Ue, monthNames as Xe, moveLaunch as Ye, movePlanStart as Ze, nextMonday as en, offsetOf as nn, pastTheLine as tn, planDrags as an, planEdit as on, planFixed as ln, planLaunchPlanMove as sn, planPastRule as rn, planProblem as cn, planProblems as un, planStartBy as dn, planWeeksProblem as mn, planWords as fn, presetRules as pn, readClock as hn, f as gn, runwayCap as yn, runwayHeader as vn, runwayMonths as bn, runwayWords as wn, sampleLaunchPlan as xn, scheduleLaunch as kn, shortDate as In, snapStep as $n, startHandle as An, startHandleCard as Nn, timeFamily as On, timeProblems as Tn, timeRuleKindIds as Pn, timeSentence as Ln, tryTask as Mn, validateHiringPlan as Sn, validateLaunchPlan as Cn, waitsRefusal as Rn, weekdayAt as Wn, weekendAt as _n, withLink as Bn, withPlanStart as Fn, withTaskValue as Dn } from "./workshop-plans.mjs";
import { byOrder as Hn, checkNest as Jn, checkNestMove as Kn, extend as qn, isOrderKey as zn, nestAlias as Gn, nestAreas as jn, nestCardText as Qn, nestDepth as Vn, nestDrags as Un, nestEmptyDrop as Xn, nestFamily as Yn, nestKids as Zn, nestLegal as et, nestMeasure as nt, nestMeasureWords as tt, nestPlace as at, nestRoots as ot, nestRules as lt, nestSentence as it, nestSubtree as st, orderBetween as rt, orderKeys as ct, registerNestPlus as ut, roleOf as dt, tidyKeys as mt, validateNest as ft } from "./workshop-nest.mjs";
import { isOrgChart as ht, nestAxes as gt, nestQuadrants as yt, nestScores as vt, quadrantOf as bt, scoreBoard as wt, scoresIn as xt } from "./workshop-nest-plus.mjs";
import { registerWorkshopRules as C, said as g, workshopLaneOverridden as R } from "./workshop-model.mjs";
const x = (e) => !e.role;
function se(e) {
  let n = 0;
  for (const o of e.cards) {
    const t = e.lanes.find((a) => a.id === o.laneId);
    n += (o.amount ?? 0) * (t.role === "won" ? 1 : t.role === "lost" ? 0 : t.probability ?? 0);
  }
  return Math.round(n);
}
function q(e) {
  if (e.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (e.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!e.forecast) return "A pipeline needs a forecast target.";
  if (e.lanes.filter((t) => t.role === "won").length > 1 || e.lanes.filter((t) => t.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (e.lanes.filter(x).length < 1) return "A pipeline needs an open stage.";
  for (const t of e.lanes) {
    if (x(t) && t.probability === void 0) return `Give ${t.label} a chance to win, from 0 to 100%.`;
    const a = e.cards.filter((l) => l.laneId === t.id).length;
    if (t.capacity !== void 0 && a > t.capacity && !R(e, t.id)) return `${t.label} already holds ${a} of ${t.capacity} deals.`;
  }
  const n = e.lanes.find((t) => t.role === "won"), o = n && e.cards.find((t) => t.laneId === n.id && t.amount === void 0);
  return o ? `${o.label} needs an amount before it can be won. Write it on the card, like '${o.label} $40k'.` : null;
}
function W(e, n, o) {
  const t = e.cards.find((i) => i.id === n), a = e.lanes.find((i) => i.id === o);
  if (!t || !a) return "That move is not available.";
  const l = e.lanes.find((i) => i.id === t.laneId);
  if (l === a) return null;
  const r = e.lanes.filter(x);
  if (l.role === "won" && a.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (l.role === "lost" && a.role === "won") return `Reopen ${t.label} in an open stage first.`;
  if (a.role === "won" && t.amount === void 0)
    return `${t.label} needs an amount before it can be won. Write it on the card, like '${t.label} $40k'.`;
  const s = [];
  if (a.role === "won" || x(l) && x(a) && r.indexOf(a) > r.indexOf(l)) {
    const i = r[r.indexOf(l) + 1] ?? e.lanes.find((c) => c.role === "won");
    i !== a && s.push(`Deals move one stage at a time. ${t.label} is in ${l.label}, so ${i.label} comes first.`);
  }
  const d = e.cards.filter((i) => i.laneId === a.id).length;
  return a.capacity !== void 0 && d >= a.capacity && s.push(`${a.label} already holds ${d} of ${a.capacity} deals.`), s.length ? s.join(" ") : null;
}
function z(e, n, o) {
  const t = e.cards.find((a) => a.id === n);
  return !t || W(e, n, o) !== null ? null : t.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== t), { ...t, laneId: o }] };
}
function G(e, n) {
  const o = e.lanes.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n), a = t.reduce((s, d) => s + (d.amount ?? 0), 0), l = o.role === "won" ? 1 : o.role === "lost" ? 0 : o.probability ?? 0, r = o.capacity !== void 0 && t.length > o.capacity ? ` · over its limit of ${o.capacity}` : "";
  return `${t.length} ${t.length === 1 ? "deal" : "deals"} · ${u(a, e.forecast?.currency)} · ${Math.round(l * 100)}%${r}`;
}
function re(e, n) {
  const o = e.lanes.find((t) => t.id === n);
  return !!(o && o.capacity !== void 0 && e.cards.filter((t) => t.laneId === n).length > o.capacity);
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
const O = (e, n, o) => n.amount === void 0 ? n.label : n.label + o + u(n.amount, e.forecast?.currency ?? e.budget?.currency), _ = {
  readCard(e, n) {
    e.amount !== void 0 && (n.amount = b(e.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (e, n) => O(e, n, `
`),
  noteText: (e, n) => O(e, n, " · "),
  renamed(e, n, o) {
    const t = E(o);
    return { label: t.label, edits: t.amount !== void 0 ? [{ kind: "set_amount", card: { id: n }, amount: t.amount }] : [] };
  }
}, V = {
  ..._,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(e, n) {
    if (e.role !== void 0) {
      if (e.role !== "won" && e.role !== "lost") throw new Error("A stage is won, lost or open.");
      n.role = e.role;
    }
    e.probability !== void 0 && (n.probability = b(e.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(e, n) {
    const o = M(e, "forecast", "A pipeline needs a forecast target.");
    n.forecast = { target: b(o.target, 1, 1e9, "A target is a whole amount above zero."), currency: S(o.currency) };
  },
  validate: q,
  planMove: z,
  refusal: W,
  caption: G,
  fromNote(e, n, o) {
    const t = L(n, o);
    return { label: t.label, ...t.amount !== void 0 && { amount: t.amount } };
  },
  newCard: () => "deal",
  edit(e, n, o) {
    const t = e.forecast.currency;
    switch (n.kind) {
      case "add_card": {
        const a = o.lane(n.lane), l = n.label?.trim() || "New deal", r = { id: P(e), label: l, laneId: a.id };
        n.amount !== void 0 && ((!Number.isInteger(n.amount) || n.amount < m.min) && o.refuse(m.reasons.min, { laneId: a.id, limits: m }), n.amount > m.max && o.refuse(m.reasons.max, { laneId: a.id, limits: m }), r.amount = n.amount), a.role && o.refuse("A new deal starts in an open stage, not in " + a.label + ".", { laneId: a.id });
        const s = e.cards.filter((d) => d.laneId === a.id).length;
        return a.capacity !== void 0 && s >= a.capacity && o.refuse(a.label + " already holds " + s + " of " + a.capacity + " deals.", { laneId: a.id }), o.done(o.settle({ ...e, cards: [...e.cards, r] }, a.id), "Added " + g(l) + " to " + g(a.label) + ".", { laneId: a.id, cardId: r.id });
      }
      case "set_amount": {
        const a = o.card(n.card), l = { laneId: a.laneId, cardId: a.id, limits: m };
        return (!Number.isInteger(n.amount) || n.amount < m.min || n.amount > m.max) && o.refuse(n.amount < m.min ? m.reasons.min : m.reasons.max, l), a.amount = n.amount, o.done(o.settle(e, a.laneId, a.id), g(a.label) + " is now " + u(n.amount, t) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_target": {
        const a = j(e, { field: "target" });
        return (!Number.isInteger(n.amount) || n.amount < 1 || n.amount > a.max) && o.refuse(n.amount < 1 ? a.reasons.min : a.reasons.max, { limits: a }), e.forecast.target = n.amount, o.done(o.settle(e), "The target is now " + u(n.amount, t) + ".");
      }
    }
    return null;
  }
};
C(V);
function v(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.amount ?? 0 : 0), 0);
}
const I = (e, n) => Math.max(n.floor ?? 0, Math.min(v(e, n.id), n.allocation ?? 0)), $ = (e, n) => n.label + " is over budget by " + u(A(e, n.id), e.budget?.currency) + ".";
function A(e, n) {
  const o = e.lanes.find((t) => t.id === n);
  return o ? Math.max(0, v(e, n) - (o.allocation ?? 0)) : 0;
}
function U(e) {
  const n = e.budget;
  if (!n) return "A budget needs a total.";
  if (e.cards.length > 16) return "A budget holds up to 16 line items.";
  const o = e.lanes.reduce((t, a) => t + (a.allocation ?? 0), 0);
  if (o !== n.total) return `The teams' allocations add up to ${u(o, n.currency)}, not ${u(n.total, n.currency)}.`;
  for (const t of e.lanes) {
    if (t.allocation === void 0) return `Give ${t.label} an allocation.`;
    if (t.floor !== void 0 && t.cap !== void 0 && t.floor > t.cap) return `${t.label}'s floor is above its cap.`;
    if (t.floor !== void 0 && t.allocation < t.floor) return `${t.label}'s floor is ${u(t.floor, n.currency)}.`;
    if (t.cap !== void 0 && t.allocation > t.cap) return `${t.label}'s cap is ${u(t.cap, n.currency)}.`;
    const a = v(e, t.id);
    if (a > t.allocation && !R(e, t.id)) return `${t.label} commits ${u(a, n.currency)} of ${u(t.allocation, n.currency)}.`;
  }
  return e.cards.some((t) => t.amount === void 0) ? "Give every line item a cost." : null;
}
function B(e, n, o) {
  const t = e.cards.find((s) => s.id === n), a = e.lanes.find((s) => s.id === o);
  if (!t || !a) return "That move is not available.";
  if (t.laneId === o) return null;
  const l = (a.allocation ?? 0) - v(e, o), r = e.budget?.currency;
  return (t.amount ?? 0) > l ? `${a.label} has ${u(l, r)} left. ${t.label} costs ${u(t.amount ?? 0, r)}.` : null;
}
function X(e, n, o) {
  const t = e.cards.find((a) => a.id === n);
  return !t || B(e, n, o) !== null ? null : t.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== t), { ...t, laneId: o }] };
}
function Y(e, n, o, t) {
  return { ...e, lanes: e.lanes.map((a) => a.id === n ? { ...a, allocation: (a.allocation ?? 0) - t } : a.id === o ? { ...a, allocation: (a.allocation ?? 0) + t } : a) };
}
function N(e, n, o) {
  const t = e.lanes.find((c) => c.id === n), a = e.lanes.find((c) => c.id === o), l = e.budget?.currency, r = (c, y) => {
    if (!y) return `${c.label}'s cap is ${u(c.cap, l)}.`;
    const f = v(e, c.id);
    return f >= (c.floor ?? 0) ? `${c.label} already commits ${u(f, l)}.` : `${c.label}'s floor is ${u(c.floor, l)}.`;
  }, s = (c) => c.reduce((y, f) => f.value < y.value ? f : y), d = s([
    { value: t.allocation - I(e, t), why: r(t, !0) },
    ...a.cap !== void 0 ? [{ value: a.cap - a.allocation, why: r(a, !1) }] : []
  ]), i = s([
    { value: a.allocation - I(e, a), why: r(a, !0) },
    ...t.cap !== void 0 ? [{ value: t.cap - t.allocation, why: r(t, !1) }] : []
  ]);
  return { field: "amount", min: -i.value, max: d.value, reasons: { min: i.why, max: d.why } };
}
function Z(e, n, o, t) {
  if (n === o) return "Choose two different teams.";
  if (!Number.isFinite(t) || !Number.isInteger(t)) return "Move a whole amount.";
  const a = N(e, n, o);
  if (t > a.max) return a.reasons.max;
  if (t < a.min) return a.reasons.min;
  const l = e.budget?.step;
  return l && t % l !== 0 && t !== a.max && t !== a.min ? `Move money in steps of ${u(l, e.budget?.currency)}.` : null;
}
function ce(e, n) {
  const o = e.lanes.findIndex((a) => a.id === n.laneId), t = e.lanes[o + 1];
  return o < 0 || !t ? { field: "amount", min: 0, max: 0, reasons: {} } : N(e, t.id, n.laneId);
}
function F(e) {
  const n = e.lanes.reduce((t, a) => t + I(e, a), 0), o = e.lanes.every((t) => t.cap !== void 0) ? e.lanes.reduce((t, a) => t + a.cap, 0) : 1e9;
  return { min: Math.max(1, n), max: o };
}
function D(e, n, o = "end") {
  const t = e.budget.currency;
  if (!Number.isInteger(n) || n < 1) return "A total is a whole amount above zero.";
  const a = F(e);
  if (n < a.min) return "The teams keep " + w(a.min, t) + " between them: their floors and what they commit. The smallest total that fits is " + w(a.min, t) + ".";
  if (n > a.max) return "Every team is at its cap. The largest total that fits is " + w(a.max, t) + ".";
  let l = n - e.budget.total;
  const r = e.lanes.map((s) => ({ ...s }));
  for (const s of o === "end" ? [...r].reverse() : r) {
    if (!l) break;
    const d = l > 0 ? (s.cap ?? 1 / 0) - s.allocation : I(e, s) - s.allocation, i = l > 0 ? Math.min(l, d) : Math.max(l, d);
    s.allocation += i, l -= i;
  }
  return { ...e, budget: { ...e.budget, total: n }, lanes: r };
}
function ee(e, n) {
  if (e.budget?.total === n.budget?.total) return null;
  const o = (a) => JSON.stringify(a.lanes.map((l) => [l.id, l.allocation]));
  return ["end", "start"].map((a) => D(e, n.budget.total, a)).filter((a) => typeof a != "string").some((a) => o(a) === o(n)) ? null : "The total changes only at the envelope’s edges: drag one, or say the new total.";
}
function ne(e, n) {
  const o = e.lanes.find((l) => l.id === n), t = e.budget?.currency, a = A(e, n);
  return `${u(o.allocation ?? 0, t)} · ${u(v(e, n), t)} committed` + (a ? ` · over budget by ${u(a, t)}` : "");
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
  ..._,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(e, n) {
    for (const o of ["allocation", "floor", "cap"]) e[o] !== void 0 && (n[o] = b(e[o], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(e, n) {
    const o = M(e, "budget", "A budget needs a total.");
    n.budget = {
      total: b(o.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: S(o.currency),
      step: o.step === void 0 ? 5e3 : b(o.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: U,
  fixed: ee,
  planMove: X,
  refusal: B,
  caption: ne,
  fromNote(e, n, o) {
    const t = L(n, o);
    return t.amount !== void 0 ? { label: t.label, amount: t.amount } : n.trim() ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: t.label, amount: e.budget.step };
  },
  newCard: () => "line item",
  edit(e, n, o) {
    const t = e.budget.currency;
    switch (n.kind) {
      case "add_card": {
        const a = o.lane(n.lane), l = n.label?.trim() || "New line item";
        n.amount === void 0 && o.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: a.id });
        const r = { ...m, min: 1 };
        (!Number.isInteger(n.amount) || n.amount < 1) && o.refuse("A line item costs something.", { laneId: a.id, limits: r }), n.amount > m.max && o.refuse(m.reasons.max, { laneId: a.id, limits: m });
        const s = a.allocation - v(e, a.id);
        n.amount > s && o.refuse((s < 0 ? $(e, a) : a.label + " has " + u(s, t) + " left.") + " " + l + " costs " + u(n.amount, t) + ".", { laneId: a.id });
        const d = { id: P(e), label: l, laneId: a.id, amount: n.amount };
        return o.done(o.settle({ ...e, cards: [...e.cards, d] }, a.id), "Added " + g(l) + " to " + g(a.label) + ".", { laneId: a.id, cardId: d.id });
      }
      case "set_amount": {
        const a = o.card(n.card), l = e.lanes.find((c) => c.id === a.laneId), r = Math.max(l.allocation - v(e, l.id) + (a.amount ?? 0), a.amount ?? 0), s = A(e, l.id) > 0, d = { field: "amount", min: 1, max: r, reasons: { min: "A line item costs something.", max: s ? $(e, l) + " " + g(a.label) + " can cost " + u(r, t) + " at most." : g(l.label) + " has " + u(r, t) + " for it." } }, i = { laneId: a.laneId, cardId: a.id, limits: d };
        return n.amount > r && o.refuse((s ? $(e, l) : l.label + " has " + u(r - (a.amount ?? 0), t) + " left.") + " " + a.label + " costs " + u(n.amount, t) + ".", { ...i, laneId: l.id }), (!Number.isInteger(n.amount) || n.amount < d.min) && o.refuse(d.reasons.min, i), a.amount = n.amount, o.done(o.settle(e, a.laneId, a.id), g(a.label) + " is now " + u(n.amount, t) + ".", { laneId: a.laneId, cardId: a.id });
      }
      case "set_budget_total": {
        const a = n.edge ?? "end", l = D(e, n.amount, a);
        typeof l == "string" && o.refuse(l, { limits: { field: "amount", ...F(e), reasons: {} } });
        const r = l, s = r.lanes.filter((d, i) => d.allocation !== e.lanes[i].allocation).map((d) => d.label + " " + w(d.allocation, t));
        return o.done(o.settle(r), "The budget is now " + w(n.amount, t) + (s.length ? ": " + s.join(", ") + "." : "."));
      }
      case "shift_budget": {
        const a = o.lane(n.from), l = o.lane(n.to), r = Z(e, a.id, l.id, n.amount);
        return r && o.refuse(r, { laneId: a.id, ...a.id !== l.id && { limits: N(e, a.id, l.id) } }), o.done(o.settle(Y(e, a.id, l.id, n.amount), l.id), "Moved " + u(n.amount, t) + " from " + g(a.label) + " to " + g(l.label) + ".", { laneId: l.id });
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
  sameOwnerAs: ["mode", "role"]
}, oe = ["max", "to", "floor", "onConflict", "unit", "under", "by", "drop", "mode"], k = (e) => e.behaviour ?? { version: 1, rev: 0, rules: [] };
function ue(e, n) {
  const o = k(e).rules, t = k(n).rules, a = [], l = [], r = [], s = (i) => i === "any" ? "any" : { id: i }, d = (i) => JSON.stringify(T[i.kind].filter((c) => !oe.includes(c)).map((c) => [c, i[c]]));
  for (const i of t) {
    const c = o.find((h) => h.id === i.id), y = i;
    if (!c) {
      const h = { kind: i.kind, ...i.severity === "warn" && { severity: "warn" } };
      for (const p of T[i.kind])
        y[p] !== void 0 && (h[p] = p === "to" || p === "cards" ? y[p].map(s) : ["where", "into", "lane", "from"].includes(p) ? s(y[p]) : y[p]);
      a.push({ kind: "add_rule", rule: h }), i.on || l.push({ kind: "set_rule", rule: i.id, on: !1 });
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
    Object.keys(f).length && l.push({ kind: "set_rule", rule: i.id, ...f });
  }
  for (const i of o) t.some((c) => c.id === i.id) || r.push({ kind: "remove_rule", rule: i.id });
  return [...a, ...l, ...r];
}
function de(e, n) {
  if (!e.behaviour && !n.behaviour) return n;
  const o = Math.max(k(e).rev, k(n).rev) + 1;
  return { ...n, behaviour: { ...k(n), rev: o } };
}
const me = { "launch-plan": K, "go-live": J, "hiring-plan": H, pipeline: Q, budget: te };
export {
  m as amountLimits,
  b as amountOf,
  _ as amountRules,
  he as bandOf,
  ue as behaviourEditsBetween,
  ge as brokenWaits,
  ne as budgetCaption,
  v as budgetCommitted,
  ce as budgetLimits,
  A as budgetOver,
  B as budgetRefusal,
  ae as budgetRules,
  N as budgetShiftLimits,
  Z as budgetShiftRefusal,
  F as budgetTotalBounds,
  ee as budgetTotalFixed,
  Hn as byOrder,
  ye as cascadeStops,
  Jn as checkNest,
  Kn as checkNestMove,
  ve as checkTime,
  be as clockOf,
  S as currencyOf,
  we as dateName,
  xe as dayFromWords,
  ke as dayMap,
  Ie as dayWords,
  $e as days,
  Ae as downstreamTasks,
  Ne as dragTaskEdge,
  Oe as earliestLaunch,
  Te as edgeValues,
  qn as extend,
  Pe as extendWorkshopEdits,
  J as goLiveSample,
  Le as hireLagFor,
  Me as hireStarts,
  Se as hiringPlanRules,
  H as hiringPlanSample,
  Ce as holdOthers,
  zn as isOrderKey,
  ht as isOrgChart,
  Re as isoAt,
  We as isoTime,
  _e as landPlanNote,
  Be as launchDayOn,
  Fe as launchFinish,
  De as launchHard,
  Ee as launchIndex,
  He as launchLinkRefusal,
  Je as launchOverrun,
  Ke as launchPlanCaption,
  qe as launchPlanLimits,
  ze as launchPlanRefusal,
  Ge as launchPlanRules,
  K as launchPlanSample,
  je as launchTaskText,
  Qe as launchTooEarly,
  Ve as legalRuns,
  Ue as lineWord,
  u as money,
  w as moneyExact,
  Xe as monthNames,
  Ye as moveLaunch,
  Ze as movePlanStart,
  Gn as nestAlias,
  jn as nestAreas,
  gt as nestAxes,
  Qn as nestCardText,
  Vn as nestDepth,
  Un as nestDrags,
  Xn as nestEmptyDrop,
  Yn as nestFamily,
  Zn as nestKids,
  et as nestLegal,
  nt as nestMeasure,
  tt as nestMeasureWords,
  at as nestPlace,
  yt as nestQuadrants,
  ot as nestRoots,
  lt as nestRules,
  vt as nestScores,
  it as nestSentence,
  st as nestSubtree,
  P as nextCardId,
  en as nextMonday,
  L as noteNumbers,
  nn as offsetOf,
  rt as orderBetween,
  ct as orderKeys,
  M as ownField,
  tn as pastTheLine,
  G as pipelineCaption,
  se as pipelineForecast,
  j as pipelineLimits,
  W as pipelineRefusal,
  V as pipelineRules,
  re as pipelineStageOver,
  X as planBudgetMove,
  an as planDrags,
  on as planEdit,
  ln as planFixed,
  sn as planLaunchPlanMove,
  rn as planPastRule,
  z as planPipelineMove,
  cn as planProblem,
  un as planProblems,
  me as planSamples,
  dn as planStartBy,
  mn as planWeeksProblem,
  fn as planWords,
  pn as presetRules,
  bt as quadrantOf,
  hn as readClock,
  gn as readNoteNumbers,
  ut as registerNestPlus,
  E as renamedNumbers,
  de as restoreWorkshop,
  dt as roleOf,
  yn as runwayCap,
  vn as runwayHeader,
  bn as runwayMonths,
  wn as runwayWords,
  te as sampleBudget,
  xn as sampleLaunchPlan,
  Q as samplePipeline,
  kn as scheduleLaunch,
  wt as scoreBoard,
  xt as scoresIn,
  Y as shiftBudget,
  In as shortDate,
  $n as snapStep,
  An as startHandle,
  Nn as startHandleCard,
  mt as tidyKeys,
  On as timeFamily,
  Tn as timeProblems,
  Pn as timeRuleKindIds,
  Ln as timeSentence,
  Mn as tryTask,
  U as validateBudget,
  Sn as validateHiringPlan,
  Cn as validateLaunchPlan,
  ft as validateNest,
  q as validatePipeline,
  Rn as waitsRefusal,
  Wn as weekdayAt,
  _n as weekendAt,
  D as withBudgetTotal,
  Bn as withLink,
  Fn as withPlanStart,
  Dn as withTaskValue
};
