import { m as c, a as f, n as L, b as N, o as P, c as C, d as v, r as O, h as _, g as W, l as B } from "./plans-BUBYIcpl.mjs";
import { a7 as ie, V as re, a2 as ue, v as ce, p as de, t as fe, u as me, T as pe, af as he, X as ge, O as ye, a6 as be, a5 as ve, aa as we, $ as Ie, f as ke, i as $e, Q as xe, U as Ae, R as Le, F as Ne, Y as Pe, G as Ce, H as Me, E as Se, M as Te, I as Re, B as Oe, S as _e, e as We, q as Be, j as Fe, a4 as De, A as Ge, L as ze, D as Ee, x as He, z as Je, K as qe, N as Ke, ae as Qe, ad as je, a9 as Ve, ab as Ue, ac as Xe, J as Ye, P as Ze, s as en, W as nn, a3 as an, a1 as tn, a0 as on, y as ln, a8 as sn, C as rn, w as un, k as cn, _ as dn, Z as fn } from "./plans-BUBYIcpl.mjs";
import { registerWorkshopRules as M, said as y } from "./workshop-model.mjs";
const w = (n) => !n.role;
function ee(n) {
  let a = 0;
  for (const o of n.cards) {
    const t = n.lanes.find((e) => e.id === o.laneId);
    a += (o.amount ?? 0) * (t.role === "won" ? 1 : t.role === "lost" ? 0 : t.probability ?? 0);
  }
  return Math.round(a);
}
function F(n) {
  if (n.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (n.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!n.forecast) return "A pipeline needs a forecast target.";
  if (n.lanes.filter((t) => t.role === "won").length > 1 || n.lanes.filter((t) => t.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (n.lanes.filter(w).length < 1) return "A pipeline needs an open stage.";
  for (const t of n.lanes) {
    if (w(t) && t.probability === void 0) return `Give ${t.label} a chance to win, from 0 to 100%.`;
    const e = n.cards.filter((l) => l.laneId === t.id).length;
    if (t.capacity !== void 0 && e > t.capacity) return `${t.label} already holds ${e} of ${t.capacity} deals.`;
  }
  const a = n.lanes.find((t) => t.role === "won"), o = a && n.cards.find((t) => t.laneId === a.id && t.amount === void 0);
  return o ? `${o.label} needs an amount before it can be won. Write it on the card, like '${o.label} $40k'.` : null;
}
function S(n, a, o) {
  const t = n.cards.find((d) => d.id === a), e = n.lanes.find((d) => d.id === o);
  if (!t || !e) return "That move is not available.";
  const l = n.lanes.find((d) => d.id === t.laneId);
  if (l === e) return null;
  const i = n.lanes.filter(w);
  if (l.role === "won" && e.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (l.role === "lost" && e.role === "won") return `Reopen ${t.label} in an open stage first.`;
  if (e.role === "won" || w(l) && w(e) && i.indexOf(e) > i.indexOf(l)) {
    const d = i[i.indexOf(l) + 1] ?? n.lanes.find((s) => s.role === "won");
    if (d !== e) return `Deals move one stage at a time. ${t.label} is in ${l.label}, so ${d.label} comes first.`;
  }
  if (e.role === "won" && t.amount === void 0)
    return `${t.label} needs an amount before it can be won. Write it on the card, like '${t.label} $40k'.`;
  const u = n.cards.filter((d) => d.laneId === e.id).length;
  return e.capacity !== void 0 && u >= e.capacity ? `${e.label} already holds ${u} of ${e.capacity} deals.` : null;
}
function D(n, a, o) {
  const t = n.cards.find((e) => e.id === a);
  return !t || S(n, a, o) !== null ? null : t.laneId === o ? n : { ...n, cards: [...n.cards.filter((e) => e !== t), { ...t, laneId: o }] };
}
function G(n, a) {
  const o = n.lanes.find((i) => i.id === a), t = n.cards.filter((i) => i.laneId === a), e = t.reduce((i, u) => i + (u.amount ?? 0), 0), l = o.role === "won" ? 1 : o.role === "lost" ? 0 : o.probability ?? 0;
  return `${t.length} ${t.length === 1 ? "deal" : "deals"} · ${c(e, n.forecast?.currency)} · ${Math.round(l * 100)}%`;
}
function z(n, a) {
  return a.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : f;
}
function E() {
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
const $ = (n, a, o) => a.amount === void 0 ? a.label : a.label + o + c(a.amount, n.forecast?.currency ?? n.budget?.currency), T = {
  readCard(n, a) {
    n.amount !== void 0 && (a.amount = v(n.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (n, a) => $(n, a, `
`),
  noteText: (n, a) => $(n, a, " · "),
  renamed(n, a, o) {
    const t = O(o);
    return { label: t.label, edits: t.amount !== void 0 ? [{ kind: "set_amount", card: { id: a }, amount: t.amount }] : [] };
  }
}, H = {
  ...T,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(n, a) {
    if (n.role !== void 0) {
      if (n.role !== "won" && n.role !== "lost") throw new Error("A stage is won, lost or open.");
      a.role = n.role;
    }
    n.probability !== void 0 && (a.probability = v(n.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(n, a) {
    const o = P(n, "forecast", "A pipeline needs a forecast target.");
    a.forecast = { target: v(o.target, 1, 1e9, "A target is a whole amount above zero."), currency: C(o.currency) };
  },
  validate: F,
  planMove: D,
  refusal: S,
  caption: G,
  fromNote(n, a) {
    const o = N(a);
    return typeof o == "string" ? o : { label: o.label, ...o.amount !== void 0 && { amount: o.amount } };
  },
  edit(n, a, o) {
    const t = n.forecast.currency;
    switch (a.kind) {
      case "add_card": {
        const e = o.lane(a.lane), l = a.label?.trim();
        l || o.refuse("Say what the card should say, such as “Add Docs to " + e.label + "”.", { laneId: e.id });
        const i = { id: L(n), label: l, laneId: e.id };
        a.amount !== void 0 && ((!Number.isInteger(a.amount) || a.amount < f.min) && o.refuse(f.reasons.min, { laneId: e.id, limits: f }), a.amount > f.max && o.refuse(f.reasons.max, { laneId: e.id, limits: f }), i.amount = a.amount), e.role && o.refuse("A new deal starts in an open stage, not in " + e.label + ".", { laneId: e.id });
        const u = n.cards.filter((d) => d.laneId === e.id).length;
        return e.capacity !== void 0 && u >= e.capacity && o.refuse(e.label + " already holds " + u + " of " + e.capacity + " deals.", { laneId: e.id }), o.done(o.settle({ ...n, cards: [...n.cards, i] }, e.id), "Added " + y(l) + " to " + y(e.label) + ".", { laneId: e.id, cardId: i.id });
      }
      case "set_amount": {
        const e = o.card(a.card), l = { laneId: e.laneId, cardId: e.id, limits: f };
        return (!Number.isInteger(a.amount) || a.amount < f.min || a.amount > f.max) && o.refuse(a.amount < f.min ? f.reasons.min : f.reasons.max, l), e.amount = a.amount, o.done(o.settle(n, e.laneId, e.id), y(e.label) + " is now " + c(a.amount, t) + ".", { laneId: e.laneId, cardId: e.id });
      }
      case "set_target": {
        const e = z(n, { field: "target" });
        return (!Number.isInteger(a.amount) || a.amount < 1 || a.amount > e.max) && o.refuse(a.amount < 1 ? e.reasons.min : e.reasons.max, { limits: e }), n.forecast.target = a.amount, o.done(o.settle(n), "The target is now " + c(a.amount, t) + ".");
      }
    }
    return null;
  }
};
M(H);
function b(n, a) {
  return n.cards.reduce((o, t) => o + (t.laneId === a ? t.amount ?? 0 : 0), 0);
}
const x = (n, a) => Math.max(a.floor ?? 0, b(n, a.id));
function J(n) {
  const a = n.budget;
  if (!a) return "A budget needs a total.";
  if (n.cards.length > 16) return "A budget holds up to 16 line items.";
  const o = n.lanes.reduce((t, e) => t + (e.allocation ?? 0), 0);
  if (o !== a.total) return `The teams' allocations add up to ${c(o, a.currency)}, not ${c(a.total, a.currency)}.`;
  for (const t of n.lanes) {
    if (t.allocation === void 0) return `Give ${t.label} an allocation.`;
    if (t.floor !== void 0 && t.cap !== void 0 && t.floor > t.cap) return `${t.label}'s floor is above its cap.`;
    if (t.floor !== void 0 && t.allocation < t.floor) return `${t.label}'s floor is ${c(t.floor, a.currency)}.`;
    if (t.cap !== void 0 && t.allocation > t.cap) return `${t.label}'s cap is ${c(t.cap, a.currency)}.`;
    const e = b(n, t.id);
    if (e > t.allocation) return `${t.label} commits ${c(e, a.currency)} of ${c(t.allocation, a.currency)}.`;
  }
  return n.cards.some((t) => t.amount === void 0) ? "Give every line item a cost." : null;
}
function R(n, a, o) {
  const t = n.cards.find((u) => u.id === a), e = n.lanes.find((u) => u.id === o);
  if (!t || !e) return "That move is not available.";
  if (t.laneId === o) return null;
  const l = (e.allocation ?? 0) - b(n, o), i = n.budget?.currency;
  return (t.amount ?? 0) > l ? `${e.label} has ${c(l, i)} left. ${t.label} costs ${c(t.amount ?? 0, i)}.` : null;
}
function q(n, a, o) {
  const t = n.cards.find((e) => e.id === a);
  return !t || R(n, a, o) !== null ? null : t.laneId === o ? n : { ...n, cards: [...n.cards.filter((e) => e !== t), { ...t, laneId: o }] };
}
function K(n, a, o, t) {
  return { ...n, lanes: n.lanes.map((e) => e.id === a ? { ...e, allocation: (e.allocation ?? 0) - t } : e.id === o ? { ...e, allocation: (e.allocation ?? 0) + t } : e) };
}
function k(n, a, o) {
  const t = n.lanes.find((r) => r.id === a), e = n.lanes.find((r) => r.id === o), l = n.budget?.currency, i = (r, g) => {
    if (!g) return `${r.label}'s cap is ${c(r.cap, l)}.`;
    const m = b(n, r.id);
    return m >= (r.floor ?? 0) ? `${r.label} already commits ${c(m, l)}.` : `${r.label}'s floor is ${c(r.floor, l)}.`;
  }, u = (r) => r.reduce((g, m) => m.value < g.value ? m : g), d = u([
    { value: t.allocation - x(n, t), why: i(t, !0) },
    ...e.cap !== void 0 ? [{ value: e.cap - e.allocation, why: i(e, !1) }] : []
  ]), s = u([
    { value: e.allocation - x(n, e), why: i(e, !0) },
    ...t.cap !== void 0 ? [{ value: t.cap - t.allocation, why: i(t, !1) }] : []
  ]);
  return { field: "amount", min: -s.value, max: d.value, reasons: { min: s.why, max: d.why } };
}
function Q(n, a, o, t) {
  if (a === o) return "Choose two different teams.";
  if (!Number.isFinite(t) || !Number.isInteger(t)) return "Move a whole amount.";
  const e = k(n, a, o);
  if (t > e.max) return e.reasons.max;
  if (t < e.min) return e.reasons.min;
  const l = n.budget?.step;
  return l && t % l !== 0 && t !== e.max && t !== e.min ? `Move money in steps of ${c(l, n.budget?.currency)}.` : null;
}
function ne(n, a) {
  const o = n.lanes.findIndex((e) => e.id === a.laneId), t = n.lanes[o + 1];
  return o < 0 || !t ? { field: "amount", min: 0, max: 0, reasons: {} } : k(n, t.id, a.laneId);
}
function j(n, a) {
  const o = n.lanes.find((e) => e.id === a), t = n.budget?.currency;
  return `${c(o.allocation ?? 0, t)} · ${c(b(n, a), t)} committed`;
}
function V() {
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
const U = {
  ...T,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(n, a) {
    for (const o of ["allocation", "floor", "cap"]) n[o] !== void 0 && (a[o] = v(n[o], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(n, a) {
    const o = P(n, "budget", "A budget needs a total.");
    a.budget = {
      total: v(o.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: C(o.currency),
      step: o.step === void 0 ? 5e3 : v(o.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: J,
  planMove: q,
  refusal: R,
  caption: j,
  fromNote(n, a) {
    const o = N(a);
    return typeof o == "string" ? o : o.amount === void 0 ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: o.label, amount: o.amount };
  },
  edit(n, a, o) {
    const t = n.budget.currency;
    switch (a.kind) {
      case "add_card": {
        const e = o.lane(a.lane), l = a.label?.trim();
        l || o.refuse("Say what the card should say, such as “Add Docs to " + e.label + "”.", { laneId: e.id }), a.amount === void 0 && o.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: e.id });
        const i = { ...f, min: 1 };
        (!Number.isInteger(a.amount) || a.amount < 1) && o.refuse("A line item costs something.", { laneId: e.id, limits: i }), a.amount > f.max && o.refuse(f.reasons.max, { laneId: e.id, limits: f });
        const u = e.allocation - b(n, e.id);
        a.amount > u && o.refuse(e.label + " has " + c(u, t) + " left. " + l + " costs " + c(a.amount, t) + ".", { laneId: e.id });
        const d = { id: L(n), label: l, laneId: e.id, amount: a.amount };
        return o.done(o.settle({ ...n, cards: [...n.cards, d] }, e.id), "Added " + y(l) + " to " + y(e.label) + ".", { laneId: e.id, cardId: d.id });
      }
      case "set_amount": {
        const e = o.card(a.card), l = n.lanes.find((s) => s.id === e.laneId), i = l.allocation - b(n, l.id) + (e.amount ?? 0), u = { field: "amount", min: 1, max: i, reasons: { min: "A line item costs something.", max: y(l.label) + " has " + c(i, t) + " for it." } }, d = { laneId: e.laneId, cardId: e.id, limits: u };
        return a.amount > i && o.refuse(l.label + " has " + c(i - (e.amount ?? 0), t) + " left. " + e.label + " costs " + c(a.amount, t) + ".", { ...d, laneId: l.id }), (!Number.isInteger(a.amount) || a.amount < u.min) && o.refuse(u.reasons.min, d), e.amount = a.amount, o.done(o.settle(n, e.laneId, e.id), y(e.label) + " is now " + c(a.amount, t) + ".", { laneId: e.laneId, cardId: e.id });
      }
      case "shift_budget": {
        const e = o.lane(a.from), l = o.lane(a.to), i = Q(n, e.id, l.id, a.amount);
        return i && o.refuse(i, { laneId: e.id, ...e.id !== l.id && { limits: k(n, e.id, l.id) } }), o.done(o.settle(K(n, e.id, l.id, a.amount), l.id), "Moved " + c(a.amount, t) + " from " + y(e.label) + " to " + y(l.label) + ".", { laneId: l.id });
      }
    }
    return null;
  }
};
M(U);
const A = {
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
  locked: ["cards"]
}, X = ["max", "to", "floor", "onConflict", "unit"], I = (n) => n.behaviour ?? { version: 1, rev: 0, rules: [] };
function ae(n, a) {
  const o = I(n).rules, t = I(a).rules, e = [], l = [], i = [], u = (s) => s === "any" ? "any" : { id: s }, d = (s) => JSON.stringify(A[s.kind].filter((r) => !X.includes(r)).map((r) => [r, s[r]]));
  for (const s of t) {
    const r = o.find((h) => h.id === s.id), g = s;
    if (!r) {
      const h = { kind: s.kind, ...s.severity === "warn" && { severity: "warn" } };
      for (const p of A[s.kind])
        g[p] !== void 0 && (h[p] = p === "to" || p === "cards" ? g[p].map(u) : ["where", "into", "lane", "from"].includes(p) ? u(g[p]) : g[p]);
      e.push({ kind: "add_rule", rule: h }), s.on || l.push({ kind: "set_rule", rule: s.id, on: !1 });
      continue;
    }
    if (r.kind !== s.kind || d(r) !== d(s)) return null;
    const m = {};
    if (r.on !== s.on && (m.on = s.on), r.severity !== s.severity && (m.severity = s.severity), s.kind === "capacity" && r.max !== s.max && (m.max = s.max), s.kind === "path") {
      const h = s.to, p = r.to;
      if (JSON.stringify(h ?? null) !== JSON.stringify(p ?? null)) {
        if (!h) return null;
        m.to = h.map(u);
      }
    }
    for (const h of ["floor", "onConflict", "unit"]) {
      const p = s[h];
      p !== r[h] && (m[h] = p);
    }
    Object.keys(m).length && l.push({ kind: "set_rule", rule: s.id, ...m });
  }
  for (const s of o) t.some((r) => r.id === s.id) || i.push({ kind: "remove_rule", rule: s.id });
  return [...e, ...l, ...i];
}
function te(n, a) {
  if (!n.behaviour && !a.behaviour) return a;
  const o = Math.max(I(n).rev, I(a).rev) + 1;
  return { ...a, behaviour: { ...I(a), rev: o } };
}
const oe = { "launch-plan": B, "go-live": W, "hiring-plan": _, pipeline: E, budget: V };
export {
  f as amountLimits,
  v as amountOf,
  T as amountRules,
  ie as bandOf,
  ae as behaviourEditsBetween,
  j as budgetCaption,
  b as budgetCommitted,
  ne as budgetLimits,
  R as budgetRefusal,
  U as budgetRules,
  k as budgetShiftLimits,
  Q as budgetShiftRefusal,
  re as cascadeStops,
  oe as catalogSamples,
  ue as checkTime,
  ce as clockOf,
  C as currencyOf,
  de as dateName,
  fe as dayFromWords,
  me as dayMap,
  pe as dayWords,
  he as days,
  ge as downstreamTasks,
  ye as extendWorkshopEdits,
  W as goLiveSample,
  be as hireLagFor,
  ve as hireStarts,
  we as hiringPlanRules,
  _ as hiringPlanSample,
  Ie as holdOthers,
  ke as isoAt,
  $e as isoTime,
  xe as launchFinish,
  Ae as launchHard,
  Le as launchIndex,
  Ne as launchLinkRefusal,
  Pe as launchOverrun,
  Ce as launchPlanCaption,
  Me as launchPlanLimits,
  Se as launchPlanRefusal,
  Te as launchPlanRules,
  B as launchPlanSample,
  Re as launchTaskText,
  Oe as legalRuns,
  _e as lineWord,
  c as money,
  We as monthNames,
  L as nextCardId,
  Be as nextMonday,
  N as noteNumbers,
  Fe as offsetOf,
  P as ownField,
  De as pastTheLine,
  G as pipelineCaption,
  ee as pipelineForecast,
  z as pipelineLimits,
  S as pipelineRefusal,
  H as pipelineRules,
  q as planBudgetMove,
  Ge as planDrags,
  ze as planEdit,
  Ee as planLaunchPlanMove,
  D as planPipelineMove,
  He as planProblem,
  Je as planWords,
  qe as presetRules,
  Ke as readClock,
  Qe as readNoteNumbers,
  O as renamedNumbers,
  te as restoreWorkshop,
  je as runwayCap,
  Ve as runwayHeader,
  Ue as runwayMonths,
  Xe as runwayWords,
  V as sampleBudget,
  Ye as sampleLaunchPlan,
  E as samplePipeline,
  Ze as scheduleLaunch,
  K as shiftBudget,
  en as shortDate,
  nn as snapStep,
  an as timeFamily,
  tn as timeRuleKindIds,
  on as timeSentence,
  ln as tryTask,
  J as validateBudget,
  sn as validateHiringPlan,
  rn as validateLaunchPlan,
  F as validatePipeline,
  un as weekdayAt,
  cn as weekendAt,
  dn as withLink,
  fn as withTaskValue
};
