import { registerWorkshopRules as O, said as m } from "./workshop-model.mjs";
const J = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, Q = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function B(n) {
  let t = String(n ?? "").replace(/\s+/g, " ").trim();
  const a = { label: t }, e = J.exec(t);
  if (e) {
    const s = Number(e[1].replace(",", ".")), d = /^w/i.test(e[2]);
    a.days = Math.max(1, Math.ceil(d ? s * 5 : s)), t = t.slice(0, e.index) + " " + t.slice(e.index + e[0].length);
  }
  const i = [...t.matchAll(Q)].filter((s) => s[1] || s[3] || Number(s[2].replace(",", "")) >= 1e3), l = i.find((s) => s[1] || s[3]) ?? i[0];
  if (l) {
    const s = /k/i.test(l[3] ?? "") ? 1e3 : /m/i.test(l[3] ?? "") ? 1e6 : 1;
    a.amount = Math.round(Number(l[2].replace(",", l[3] ? "." : "")) * s), l[1] && (a.currency = l[1]), t = t.slice(0, l.index) + " " + t.slice(l.index + l[0].length);
  }
  return a.label = t.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), a;
}
function u(n, t = "$") {
  const a = n < 0 ? "-" : "", e = Math.abs(n), i = (s, d) => (Math.round(s * 10) / 10).toString() + d, l = e >= 1e6 ? i(e / 1e6, "M") : e >= 1e3 ? i(e / 1e3, "k") : String(Math.round(e));
  return a + t + l;
}
const A = (n) => n + (n === 1 ? " day" : " days"), h = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function N(n) {
  const t = B(n);
  return t.label ? t : "A card needs some words as well as a number.";
}
function E(n) {
  const t = B(n);
  return t.label ? t : { label: n };
}
function _(n) {
  const t = new Set([...n.lanes, ...n.cards].map((e) => e.id));
  let a = 1;
  for (; t.has("card-" + a); ) a++;
  return "card-" + a;
}
function b(n, t, a, e, i = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < t || n > a || !i && !Number.isInteger(n)) throw new Error(e);
  return n;
}
function D(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function L(n, t, a) {
  const e = n[t];
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(a);
  return e;
}
function w(n) {
  const t = new Map(n.cards.map((o) => [o.id, o])), a = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), i = (o) => {
    const r = a.get(o.id);
    if (r) return r;
    if (e.has(o.id)) throw new Error("Tasks can't wait on each other in a circle.");
    e.add(o.id);
    let c = 0;
    for (const p of o.dependsOn ?? []) {
      const y = t.get(p);
      if (!y) throw new Error("A task waits on a task that is not on the plan.");
      c = Math.max(c, i(y).end);
    }
    c += o.lag ?? 0;
    const f = { start: c, end: c + (o.duration ?? 1), slack: 0, critical: !1 };
    return a.set(o.id, f), e.delete(o.id), f;
  };
  n.cards.forEach(i);
  const l = Math.max(0, ...[...a.values()].map((o) => o.end)), s = /* @__PURE__ */ new Map(), d = (o) => {
    const r = s.get(o.id);
    if (r !== void 0) return r;
    let c = l;
    for (const f of n.cards)
      f.dependsOn?.includes(o.id) && (c = Math.min(c, d(f) - (f.duration ?? 1) - (f.lag ?? 0)));
    return s.set(o.id, c), c;
  };
  for (const o of n.cards) {
    const r = a.get(o.id);
    r.slack = d(o) - r.end, r.critical = r.slack === 0;
  }
  return a;
}
function W(n) {
  return Math.max(0, ...[...w(n).values()].map((t) => t.end));
}
function j(n, t) {
  const a = /* @__PURE__ */ new Set(), e = (i) => {
    for (const l of n.cards) l.dependsOn?.includes(i) && !a.has(l.id) && (a.add(l.id), e(l.id));
  };
  return e(t), a;
}
function k(n, t) {
  const a = n.launch?.day ?? 0, e = w(n), i = t ? e.get(t) : void 0;
  if (i && i.end > a) return `That ends on day ${i.end}, after launch on day ${a}.`;
  const l = n.cards.map((s) => ({ card: s, end: e.get(s.id).end })).filter((s) => s.end > a).sort((s, d) => d.end - s.end)[0];
  return l ? `That pushes ${l.card.label} to day ${l.end}, after launch on day ${a}.` : null;
}
function K(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const t = n.launch?.day;
  if (typeof t != "number" || !Number.isInteger(t) || t < 5 || t > 120) return "Launch day is a whole day from 5 to 120.";
  for (const e of n.cards) {
    if (!Number.isInteger(e.duration) || e.duration < 1 || e.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(e.lag ?? 0) || (e.lag ?? 0) < 0 || (e.lag ?? 0) > t) return "A task waits 0 days or more, and no later than launch.";
    if ((e.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (e.dependsOn?.includes(e.id)) return "A task can't wait on itself.";
  }
  try {
    w(n);
  } catch (e) {
    return e.message;
  }
  const a = W(n);
  if (a > t) {
    const e = w(n);
    return `${n.cards.find((l) => e.get(l.id).end === a).label} ends on day ${a}, after launch on day ${t}.`;
  }
  return null;
}
function z(n, t, a) {
  const e = n.cards.find((i) => i.id === t);
  return !e || !n.lanes.some((i) => i.id === a) ? null : e.laneId === a ? n : { ...n, cards: n.cards.map((i) => i === e ? { ...e, laneId: a } : i) };
}
function ce(n, t, a) {
  return z(n, t, a) ? "" : "That move is not available.";
}
function H(n, t, a) {
  const e = n.cards.find((l) => l.id === t), i = n.cards.find((l) => l.id === a);
  return !e || !i ? "That task is no longer on the plan." : e === i ? "A task can't wait on itself." : e.dependsOn?.includes(i.id) ? `${e.label} already waits on ${i.label}.` : j(n, e.id).has(i.id) ? `${i.label} already waits on ${e.label}, so ${e.label} can't wait on ${i.label}.` : (e.dependsOn?.length ?? 0) >= 3 ? `${e.label} already waits on 3 tasks.` : k(M(n, t, a), t);
}
function M(n, t, a, e = !1) {
  const i = w(n);
  return { ...n, cards: n.cards.map((l) => {
    if (l.id !== t) return l;
    const s = e ? (l.dependsOn ?? []).filter((r) => r !== a) : [...l.dependsOn ?? [], a], d = Math.max(0, ...s.map((r) => i.get(r)?.end ?? 0)), o = { ...l, dependsOn: s, lag: Math.max(0, i.get(l.id).start - d) };
    return s.length || delete o.dependsOn, o.lag || delete o.lag, o;
  }) };
}
function U(n, t) {
  const a = w(n), e = n.cards.filter((l) => l.laneId === t), i = e.filter((l) => a.get(l.id).critical).length;
  return `${e.length} ${e.length === 1 ? "task" : "tasks"} · ${i} on the critical path`;
}
function I(n, t, a) {
  return t.field === "day" ? { ...n, launch: { day: a } } : { ...n, cards: n.cards.map((e) => e.id === t.cardId ? { ...e, [t.field]: a } : e) };
}
function S(n, t) {
  const a = n.launch.day;
  if (t.field === "day") {
    const o = w(n), r = W(n), c = n.cards.find((f) => o.get(f.id).end === r);
    return {
      field: "day",
      min: Math.max(5, r),
      max: 120,
      reasons: { min: c ? `${c.label} ends on day ${r}.` : void 0, max: "Launch day is at most day 120." }
    };
  }
  const e = n.cards.find((o) => o.id === t.cardId), i = t.field === "duration" ? 1 : 0, l = t.field === "duration" ? 60 : a;
  let s = e[t.field] ?? i;
  for (; s < l && !k(I(n, t, s + 1)); ) s++;
  const d = s < l ? k(I(n, t, s + 1), e.id) ?? void 0 : void 0;
  return {
    field: t.field,
    min: i,
    max: Math.max(i, s),
    reasons: {
      min: t.field === "duration" ? "A task takes at least 1 day." : `${e.label} starts as early as it can.`,
      max: d ?? (t.field === "duration" ? "A task takes at most 60 days." : `Launch is day ${a}.`)
    }
  };
}
function V(n) {
  return n.label + " · " + A(n.duration ?? 1);
}
function ue() {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Friday launch",
    launch: { day: 14 },
    lanes: [{ id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }],
    cards: [
      { id: "design", label: "Design", laneId: "product", duration: 4 },
      { id: "build", label: "Build", laneId: "engineering", duration: 6, dependsOn: ["design"] },
      { id: "copy", label: "Copy", laneId: "product", duration: 2 },
      { id: "qa", label: "QA", laneId: "engineering", duration: 2, dependsOn: ["build"] }
    ]
  };
}
const Z = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  readCard(n, t, a) {
    if (t.duration = b(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (t.lag = b(n.lag, 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const e = n.dependsOn.map(a.id);
      if (new Set(e).size !== e.length) throw new Error("Duplicate dependency.");
      e.length && (t.dependsOn = e);
    }
  },
  readBoard(n, t) {
    t.launch = { day: b(L(n, "launch", "A launch plan needs a launch day.").day, 5, 120, "Launch day is a whole day from 5 to 120.") };
  },
  validate: K,
  planMove: z,
  caption: U,
  cardText: (n, t) => t.label + " · " + t.duration + "d",
  noteText: (n, t) => V(t),
  fromNote(n, t) {
    const a = N(t);
    return typeof a == "string" ? a : { label: a.label, duration: Math.min(60, Math.max(1, a.days ?? 2)) };
  },
  renamed(n, t, a) {
    const e = E(a);
    return { label: e.label, edits: e.days !== void 0 ? [{ kind: "set_task", card: { id: t }, duration: e.days }] : [] };
  },
  edit(n, t, a) {
    switch (t.kind) {
      case "add_card": {
        const e = a.lane(t.lane), i = t.label?.trim();
        i || a.refuse("Say what the card should say, such as “Add Docs to " + e.label + "”.", { laneId: e.id });
        const l = { id: _(n), label: i, laneId: e.id, duration: t.duration ?? 2 };
        t.lag && (l.lag = t.lag);
        const s = [...new Set((t.waitsOn ?? []).map((r) => a.card(r).id))];
        s.length && (l.dependsOn = s);
        const d = { ...n, cards: [...n.cards, l] }, o = k(d, l.id);
        return o && a.refuse(o, { laneId: e.id }), a.done(a.settle(d, e.id), "Added " + m(i) + " to " + m(e.label) + ".", { laneId: e.id, cardId: l.id });
      }
      case "set_task": {
        const e = a.card(t.card), i = { laneId: e.laneId, cardId: e.id };
        t.duration === void 0 && t.lag === void 0 && a.refuse("Say how many days " + m(e.label) + " takes, or waits.", { ...i, code: "invalid_edit" });
        let l = n;
        for (const d of ["duration", "lag"]) {
          const o = t[d];
          if (o === void 0) continue;
          const r = S(l, { cardId: e.id, field: d });
          Number.isInteger(o) || a.refuse("A task's days are whole days.", { ...i, limits: r });
          const c = I(l, { cardId: e.id, field: d }, o);
          (o < r.min || o > r.max) && a.refuse(o < r.min ? r.reasons.min : k(c, e.id) ?? r.reasons.max, { ...i, limits: r }), l = c;
        }
        const s = l.cards.find((d) => d.id === e.id);
        return a.done(a.settle(l, e.laneId, e.id), m(e.label) + " now takes " + A(s.duration) + (s.lag ? " and waits " + A(s.lag) + "." : "."), i);
      }
      case "link_tasks":
      case "unlink_tasks": {
        const e = a.card(t.card), i = a.card(t.waitsOn), l = { laneId: e.laneId, cardId: e.id };
        if (t.kind === "unlink_tasks")
          return e.dependsOn?.includes(i.id) || a.refuse(m(e.label) + " doesn’t wait on " + m(i.label) + ".", l), a.done(a.settle(M(n, e.id, i.id, !0), e.laneId, e.id), m(e.label) + " no longer waits on " + m(i.label) + ".", l);
        const s = H(n, e.id, i.id);
        return s && a.refuse(s, l), a.done(a.settle(M(n, e.id, i.id), e.laneId, e.id), m(e.label) + " now waits on " + m(i.label) + ".", l);
      }
      case "set_launch_day": {
        const e = S(n, { field: "day" });
        if (!Number.isInteger(t.day) || t.day < e.min || t.day > e.max) {
          const i = I(n, { field: "day" }, t.day);
          a.refuse(t.day < e.min && k(i) || (t.day < e.min ? e.reasons.min : e.reasons.max), { limits: e });
        }
        return a.done(a.settle(I(n, { field: "day" }, t.day)), "Launch is now day " + t.day + ".");
      }
    }
    return null;
  }
};
O(Z);
const $ = (n) => !n.role;
function fe(n) {
  let t = 0;
  for (const a of n.cards) {
    const e = n.lanes.find((i) => i.id === a.laneId);
    t += (a.amount ?? 0) * (e.role === "won" ? 1 : e.role === "lost" ? 0 : e.probability ?? 0);
  }
  return Math.round(t);
}
function X(n) {
  if (n.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (n.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!n.forecast) return "A pipeline needs a forecast target.";
  if (n.lanes.filter((e) => e.role === "won").length > 1 || n.lanes.filter((e) => e.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (n.lanes.filter($).length < 1) return "A pipeline needs an open stage.";
  for (const e of n.lanes) {
    if ($(e) && e.probability === void 0) return `Give ${e.label} a chance to win, from 0 to 100%.`;
    const i = n.cards.filter((l) => l.laneId === e.id).length;
    if (e.capacity !== void 0 && i > e.capacity) return `${e.label} already holds ${i} of ${e.capacity} deals.`;
  }
  const t = n.lanes.find((e) => e.role === "won"), a = t && n.cards.find((e) => e.laneId === t.id && e.amount === void 0);
  return a ? `${a.label} needs an amount before it can be won. Write it on the card, like '${a.label} $40k'.` : null;
}
function F(n, t, a) {
  const e = n.cards.find((o) => o.id === t), i = n.lanes.find((o) => o.id === a);
  if (!e || !i) return "That move is not available.";
  const l = n.lanes.find((o) => o.id === e.laneId);
  if (l === i) return null;
  const s = n.lanes.filter($);
  if (l.role === "won" && i.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (l.role === "lost" && i.role === "won") return `Reopen ${e.label} in an open stage first.`;
  if (i.role === "won" || $(l) && $(i) && s.indexOf(i) > s.indexOf(l)) {
    const o = s[s.indexOf(l) + 1] ?? n.lanes.find((r) => r.role === "won");
    if (o !== i) return `Deals move one stage at a time. ${e.label} is in ${l.label}, so ${o.label} comes first.`;
  }
  if (i.role === "won" && e.amount === void 0)
    return `${e.label} needs an amount before it can be won. Write it on the card, like '${e.label} $40k'.`;
  const d = n.cards.filter((o) => o.laneId === i.id).length;
  return i.capacity !== void 0 && d >= i.capacity ? `${i.label} already holds ${d} of ${i.capacity} deals.` : null;
}
function Y(n, t, a) {
  const e = n.cards.find((i) => i.id === t);
  return !e || F(n, t, a) !== null ? null : e.laneId === a ? n : { ...n, cards: [...n.cards.filter((i) => i !== e), { ...e, laneId: a }] };
}
function ee(n, t) {
  const a = n.lanes.find((s) => s.id === t), e = n.cards.filter((s) => s.laneId === t), i = e.reduce((s, d) => s + (d.amount ?? 0), 0), l = a.role === "won" ? 1 : a.role === "lost" ? 0 : a.probability ?? 0;
  return `${e.length} ${e.length === 1 ? "deal" : "deals"} · ${u(i, n.forecast?.currency)} · ${Math.round(l * 100)}%`;
}
function ne(n, t) {
  return t.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : h;
}
function me() {
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
const P = (n, t, a) => t.amount === void 0 ? t.label : t.label + a + u(t.amount, n.forecast?.currency ?? n.budget?.currency), G = {
  readCard(n, t) {
    n.amount !== void 0 && (t.amount = b(n.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (n, t) => P(n, t, `
`),
  noteText: (n, t) => P(n, t, " · "),
  renamed(n, t, a) {
    const e = E(a);
    return { label: e.label, edits: e.amount !== void 0 ? [{ kind: "set_amount", card: { id: t }, amount: e.amount }] : [] };
  }
}, te = {
  ...G,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(n, t) {
    if (n.role !== void 0) {
      if (n.role !== "won" && n.role !== "lost") throw new Error("A stage is won, lost or open.");
      t.role = n.role;
    }
    n.probability !== void 0 && (t.probability = b(n.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(n, t) {
    const a = L(n, "forecast", "A pipeline needs a forecast target.");
    t.forecast = { target: b(a.target, 1, 1e9, "A target is a whole amount above zero."), currency: D(a.currency) };
  },
  validate: X,
  planMove: Y,
  refusal: F,
  caption: ee,
  fromNote(n, t) {
    const a = N(t);
    return typeof a == "string" ? a : { label: a.label, ...a.amount !== void 0 && { amount: a.amount } };
  },
  edit(n, t, a) {
    const e = n.forecast.currency;
    switch (t.kind) {
      case "add_card": {
        const i = a.lane(t.lane), l = t.label?.trim();
        l || a.refuse("Say what the card should say, such as “Add Docs to " + i.label + "”.", { laneId: i.id });
        const s = { id: _(n), label: l, laneId: i.id };
        t.amount !== void 0 && ((!Number.isInteger(t.amount) || t.amount < h.min) && a.refuse(h.reasons.min, { laneId: i.id, limits: h }), t.amount > h.max && a.refuse(h.reasons.max, { laneId: i.id, limits: h }), s.amount = t.amount), i.role && a.refuse("A new deal starts in an open stage, not in " + i.label + ".", { laneId: i.id });
        const d = n.cards.filter((o) => o.laneId === i.id).length;
        return i.capacity !== void 0 && d >= i.capacity && a.refuse(i.label + " already holds " + d + " of " + i.capacity + " deals.", { laneId: i.id }), a.done(a.settle({ ...n, cards: [...n.cards, s] }, i.id), "Added " + m(l) + " to " + m(i.label) + ".", { laneId: i.id, cardId: s.id });
      }
      case "set_amount": {
        const i = a.card(t.card), l = { laneId: i.laneId, cardId: i.id, limits: h };
        return (!Number.isInteger(t.amount) || t.amount < h.min || t.amount > h.max) && a.refuse(t.amount < h.min ? h.reasons.min : h.reasons.max, l), i.amount = t.amount, a.done(a.settle(n, i.laneId, i.id), m(i.label) + " is now " + u(t.amount, e) + ".", { laneId: i.laneId, cardId: i.id });
      }
      case "set_target": {
        const i = ne(n, { field: "target" });
        return (!Number.isInteger(t.amount) || t.amount < 1 || t.amount > i.max) && a.refuse(t.amount < 1 ? i.reasons.min : i.reasons.max, { limits: i }), n.forecast.target = t.amount, a.done(a.settle(n), "The target is now " + u(t.amount, e) + ".");
      }
    }
    return null;
  }
};
O(te);
function v(n, t) {
  return n.cards.reduce((a, e) => a + (e.laneId === t ? e.amount ?? 0 : 0), 0);
}
const C = (n, t) => Math.max(t.floor ?? 0, v(n, t.id));
function ae(n) {
  const t = n.budget;
  if (!t) return "A budget needs a total.";
  if (n.cards.length > 16) return "A budget holds up to 16 line items.";
  const a = n.lanes.reduce((e, i) => e + (i.allocation ?? 0), 0);
  if (a !== t.total) return `The teams' allocations add up to ${u(a, t.currency)}, not ${u(t.total, t.currency)}.`;
  for (const e of n.lanes) {
    if (e.allocation === void 0) return `Give ${e.label} an allocation.`;
    if (e.floor !== void 0 && e.cap !== void 0 && e.floor > e.cap) return `${e.label}'s floor is above its cap.`;
    if (e.floor !== void 0 && e.allocation < e.floor) return `${e.label}'s floor is ${u(e.floor, t.currency)}.`;
    if (e.cap !== void 0 && e.allocation > e.cap) return `${e.label}'s cap is ${u(e.cap, t.currency)}.`;
    const i = v(n, e.id);
    if (i > e.allocation) return `${e.label} commits ${u(i, t.currency)} of ${u(e.allocation, t.currency)}.`;
  }
  return n.cards.some((e) => e.amount === void 0) ? "Give every line item a cost." : null;
}
function q(n, t, a) {
  const e = n.cards.find((d) => d.id === t), i = n.lanes.find((d) => d.id === a);
  if (!e || !i) return "That move is not available.";
  if (e.laneId === a) return null;
  const l = (i.allocation ?? 0) - v(n, a), s = n.budget?.currency;
  return (e.amount ?? 0) > l ? `${i.label} has ${u(l, s)} left. ${e.label} costs ${u(e.amount ?? 0, s)}.` : null;
}
function ie(n, t, a) {
  const e = n.cards.find((i) => i.id === t);
  return !e || q(n, t, a) !== null ? null : e.laneId === a ? n : { ...n, cards: [...n.cards.filter((i) => i !== e), { ...e, laneId: a }] };
}
function le(n, t, a, e) {
  return { ...n, lanes: n.lanes.map((i) => i.id === t ? { ...i, allocation: (i.allocation ?? 0) - e } : i.id === a ? { ...i, allocation: (i.allocation ?? 0) + e } : i) };
}
function T(n, t, a) {
  const e = n.lanes.find((c) => c.id === t), i = n.lanes.find((c) => c.id === a), l = n.budget?.currency, s = (c, f) => {
    if (!f) return `${c.label}'s cap is ${u(c.cap, l)}.`;
    const p = v(n, c.id);
    return p >= (c.floor ?? 0) ? `${c.label} already commits ${u(p, l)}.` : `${c.label}'s floor is ${u(c.floor, l)}.`;
  }, d = (c) => c.reduce((f, p) => p.value < f.value ? p : f), o = d([
    { value: e.allocation - C(n, e), why: s(e, !0) },
    ...i.cap !== void 0 ? [{ value: i.cap - i.allocation, why: s(i, !1) }] : []
  ]), r = d([
    { value: i.allocation - C(n, i), why: s(i, !0) },
    ...e.cap !== void 0 ? [{ value: e.cap - e.allocation, why: s(e, !1) }] : []
  ]);
  return { field: "amount", min: -r.value, max: o.value, reasons: { min: r.why, max: o.why } };
}
function se(n, t, a, e) {
  if (t === a) return "Choose two different teams.";
  if (!Number.isFinite(e) || !Number.isInteger(e)) return "Move a whole amount.";
  const i = T(n, t, a);
  if (e > i.max) return i.reasons.max;
  if (e < i.min) return i.reasons.min;
  const l = n.budget?.step;
  return l && e % l !== 0 && e !== i.max && e !== i.min ? `Move money in steps of ${u(l, n.budget?.currency)}.` : null;
}
function he(n, t) {
  const a = n.lanes.findIndex((i) => i.id === t.laneId), e = n.lanes[a + 1];
  return a < 0 || !e ? { field: "amount", min: 0, max: 0, reasons: {} } : T(n, e.id, t.laneId);
}
function oe(n, t) {
  const a = n.lanes.find((i) => i.id === t), e = n.budget?.currency;
  return `${u(a.allocation ?? 0, e)} · ${u(v(n, t), e)} committed`;
}
function pe() {
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
const re = {
  ...G,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(n, t) {
    for (const a of ["allocation", "floor", "cap"]) n[a] !== void 0 && (t[a] = b(n[a], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(n, t) {
    const a = L(n, "budget", "A budget needs a total.");
    t.budget = {
      total: b(a.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: D(a.currency),
      step: a.step === void 0 ? 5e3 : b(a.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: ae,
  planMove: ie,
  refusal: q,
  caption: oe,
  fromNote(n, t) {
    const a = N(t);
    return typeof a == "string" ? a : a.amount === void 0 ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: a.label, amount: a.amount };
  },
  edit(n, t, a) {
    const e = n.budget.currency;
    switch (t.kind) {
      case "add_card": {
        const i = a.lane(t.lane), l = t.label?.trim();
        l || a.refuse("Say what the card should say, such as “Add Docs to " + i.label + "”.", { laneId: i.id }), t.amount === void 0 && a.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: i.id });
        const s = { ...h, min: 1 };
        (!Number.isInteger(t.amount) || t.amount < 1) && a.refuse("A line item costs something.", { laneId: i.id, limits: s }), t.amount > h.max && a.refuse(h.reasons.max, { laneId: i.id, limits: h });
        const d = i.allocation - v(n, i.id);
        t.amount > d && a.refuse(i.label + " has " + u(d, e) + " left. " + l + " costs " + u(t.amount, e) + ".", { laneId: i.id });
        const o = { id: _(n), label: l, laneId: i.id, amount: t.amount };
        return a.done(a.settle({ ...n, cards: [...n.cards, o] }, i.id), "Added " + m(l) + " to " + m(i.label) + ".", { laneId: i.id, cardId: o.id });
      }
      case "set_amount": {
        const i = a.card(t.card), l = n.lanes.find((r) => r.id === i.laneId), s = l.allocation - v(n, l.id) + (i.amount ?? 0), d = { field: "amount", min: 1, max: s, reasons: { min: "A line item costs something.", max: m(l.label) + " has " + u(s, e) + " for it." } }, o = { laneId: i.laneId, cardId: i.id, limits: d };
        return t.amount > s && a.refuse(l.label + " has " + u(s - (i.amount ?? 0), e) + " left. " + i.label + " costs " + u(t.amount, e) + ".", { ...o, laneId: l.id }), (!Number.isInteger(t.amount) || t.amount < d.min) && a.refuse(d.reasons.min, o), i.amount = t.amount, a.done(a.settle(n, i.laneId, i.id), m(i.label) + " is now " + u(t.amount, e) + ".", { laneId: i.laneId, cardId: i.id });
      }
      case "shift_budget": {
        const i = a.lane(t.from), l = a.lane(t.to), s = se(n, i.id, l.id, t.amount);
        return s && a.refuse(s, { laneId: i.id, ...i.id !== l.id && { limits: T(n, i.id, l.id) } }), a.done(a.settle(le(n, i.id, l.id, t.amount), l.id), "Moved " + u(t.amount, e) + " from " + m(i.label) + " to " + m(l.label) + ".", { laneId: l.id });
      }
    }
    return null;
  }
};
O(re);
const R = { capacity: ["where", "max"], path: ["from", "to", "noSkip"], gate: ["into", "needs"], bin: ["lane"] }, x = (n) => n.behaviour ?? { version: 1, rev: 0, rules: [] };
function ye(n, t) {
  const a = x(n).rules, e = x(t).rules, i = [], l = [], s = [], d = (r) => r === "any" ? "any" : { id: r }, o = (r) => JSON.stringify(R[r.kind].filter((c) => c !== "max" && c !== "to").map((c) => [c, r[c]]));
  for (const r of e) {
    const c = a.find((y) => y.id === r.id), f = r;
    if (!c) {
      const y = { kind: r.kind, ...r.severity === "warn" && { severity: "warn" } };
      for (const g of R[r.kind])
        f[g] !== void 0 && (y[g] = g === "to" ? f[g].map(d) : ["where", "into", "lane", "from"].includes(g) ? d(f[g]) : f[g]);
      i.push({ kind: "add_rule", rule: y }), r.on || l.push({ kind: "set_rule", rule: r.id, on: !1 });
      continue;
    }
    if (c.kind !== r.kind || o(c) !== o(r)) return null;
    const p = {};
    if (c.on !== r.on && (p.on = r.on), c.severity !== r.severity && (p.severity = r.severity), r.kind === "capacity" && c.max !== r.max && (p.max = r.max), r.kind === "path") {
      const y = r.to, g = c.to;
      if (JSON.stringify(y ?? null) !== JSON.stringify(g ?? null)) {
        if (!y) return null;
        p.to = y.map(d);
      }
    }
    Object.keys(p).length && l.push({ kind: "set_rule", rule: r.id, ...p });
  }
  for (const r of a) e.some((c) => c.id === r.id) || s.push({ kind: "remove_rule", rule: r.id });
  return [...i, ...l, ...s];
}
function ge(n, t) {
  if (!n.behaviour && !t.behaviour) return t;
  const a = Math.max(x(n).rev, x(t).rev) + 1;
  return { ...t, behaviour: { ...x(t), rev: a } };
}
export {
  h as amountLimits,
  b as amountOf,
  G as amountRules,
  ye as behaviourEditsBetween,
  oe as budgetCaption,
  v as budgetCommitted,
  he as budgetLimits,
  q as budgetRefusal,
  re as budgetRules,
  T as budgetShiftLimits,
  se as budgetShiftRefusal,
  D as currencyOf,
  A as days,
  j as downstreamTasks,
  W as launchFinish,
  H as launchLinkRefusal,
  k as launchOverrun,
  U as launchPlanCaption,
  S as launchPlanLimits,
  ce as launchPlanRefusal,
  Z as launchPlanRules,
  V as launchTaskText,
  u as money,
  _ as nextCardId,
  N as noteNumbers,
  L as ownField,
  ee as pipelineCaption,
  fe as pipelineForecast,
  ne as pipelineLimits,
  F as pipelineRefusal,
  te as pipelineRules,
  ie as planBudgetMove,
  z as planLaunchPlanMove,
  Y as planPipelineMove,
  B as readNoteNumbers,
  E as renamedNumbers,
  ge as restoreWorkshop,
  pe as sampleBudget,
  ue as sampleLaunchPlan,
  me as samplePipeline,
  w as scheduleLaunch,
  le as shiftBudget,
  ae as validateBudget,
  K as validateLaunchPlan,
  X as validatePipeline,
  M as withLink,
  I as withTaskValue
};
