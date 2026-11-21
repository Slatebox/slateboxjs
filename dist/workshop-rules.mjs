import { registerWorkshopRules as x, said as f } from "./workshop-model.mjs";
const W = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, G = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function S(n) {
  let a = String(n ?? "").replace(/\s+/g, " ").trim();
  const t = { label: a }, e = W.exec(a);
  if (e) {
    const s = Number(e[1].replace(",", ".")), r = /^w/i.test(e[2]);
    t.days = Math.max(1, Math.ceil(r ? s * 5 : s)), a = a.slice(0, e.index) + " " + a.slice(e.index + e[0].length);
  }
  const l = [...a.matchAll(G)].filter((s) => s[1] || s[3] || Number(s[2].replace(",", "")) >= 1e3), i = l.find((s) => s[1] || s[3]) ?? l[0];
  if (i) {
    const s = /k/i.test(i[3] ?? "") ? 1e3 : /m/i.test(i[3] ?? "") ? 1e6 : 1;
    t.amount = Math.round(Number(i[2].replace(",", i[3] ? "." : "")) * s), i[1] && (t.currency = i[1]), a = a.slice(0, i.index) + " " + a.slice(i.index + i[0].length);
  }
  return t.label = a.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), t;
}
function u(n, a = "$") {
  const t = n < 0 ? "-" : "", e = Math.abs(n), l = (s, r) => (Math.round(s * 10) / 10).toString() + r, i = e >= 1e6 ? l(e / 1e6, "M") : e >= 1e3 ? l(e / 1e3, "k") : String(Math.round(e));
  return t + a + i;
}
const v = (n) => n + (n === 1 ? " day" : " days"), m = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function A(n) {
  const a = S(n);
  return a.label ? a : "A card needs some words as well as a number.";
}
function C(n) {
  const a = S(n);
  return a.label ? a : { label: n };
}
function M(n) {
  const a = new Set([...n.lanes, ...n.cards].map((e) => e.id));
  let t = 1;
  for (; a.has("card-" + t); ) t++;
  return "card-" + t;
}
function p(n, a, t, e, l = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < a || n > t || !l && !Number.isInteger(n)) throw new Error(e);
  return n;
}
function R(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function N(n, a, t) {
  const e = n[a];
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error(t);
  return e;
}
function y(n) {
  const a = new Map(n.cards.map((o) => [o.id, o])), t = /* @__PURE__ */ new Map(), e = /* @__PURE__ */ new Set(), l = (o) => {
    const d = t.get(o.id);
    if (d) return d;
    if (e.has(o.id)) throw new Error("Tasks can't wait on each other in a circle.");
    e.add(o.id);
    let c = 0;
    for (const g of o.dependsOn ?? []) {
      const _ = a.get(g);
      if (!_) throw new Error("A task waits on a task that is not on the plan.");
      c = Math.max(c, l(_).end);
    }
    c += o.lag ?? 0;
    const h = { start: c, end: c + (o.duration ?? 1), slack: 0, critical: !1 };
    return t.set(o.id, h), e.delete(o.id), h;
  };
  n.cards.forEach(l);
  const i = Math.max(0, ...[...t.values()].map((o) => o.end)), s = /* @__PURE__ */ new Map(), r = (o) => {
    const d = s.get(o.id);
    if (d !== void 0) return d;
    let c = i;
    for (const h of n.cards)
      h.dependsOn?.includes(o.id) && (c = Math.min(c, r(h) - (h.duration ?? 1) - (h.lag ?? 0)));
    return s.set(o.id, c), c;
  };
  for (const o of n.cards) {
    const d = t.get(o.id);
    d.slack = r(o) - d.end, d.critical = d.slack === 0;
  }
  return t;
}
function B(n) {
  return Math.max(0, ...[...y(n).values()].map((a) => a.end));
}
function q(n, a) {
  const t = /* @__PURE__ */ new Set(), e = (l) => {
    for (const i of n.cards) i.dependsOn?.includes(l) && !t.has(i.id) && (t.add(i.id), e(i.id));
  };
  return e(a), t;
}
function w(n, a) {
  const t = n.launch?.day ?? 0, e = y(n), l = a ? e.get(a) : void 0;
  if (l && l.end > t) return `That ends on day ${l.end}, after launch on day ${t}.`;
  const i = n.cards.map((s) => ({ card: s, end: e.get(s.id).end })).filter((s) => s.end > t).sort((s, r) => r.end - s.end)[0];
  return i ? `That pushes ${i.card.label} to day ${i.end}, after launch on day ${t}.` : null;
}
function Q(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const a = n.launch?.day;
  if (typeof a != "number" || !Number.isInteger(a) || a < 5 || a > 120) return "Launch day is a whole day from 5 to 120.";
  for (const e of n.cards) {
    if (!Number.isInteger(e.duration) || e.duration < 1 || e.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(e.lag ?? 0) || (e.lag ?? 0) < 0 || (e.lag ?? 0) > a) return "A task waits 0 days or more, and no later than launch.";
    if ((e.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (e.dependsOn?.includes(e.id)) return "A task can't wait on itself.";
  }
  try {
    y(n);
  } catch (e) {
    return e.message;
  }
  const t = B(n);
  if (t > a) {
    const e = y(n);
    return `${n.cards.find((i) => e.get(i.id).end === t).label} ends on day ${t}, after launch on day ${a}.`;
  }
  return null;
}
function E(n, a, t) {
  const e = n.cards.find((l) => l.id === a);
  return !e || !n.lanes.some((l) => l.id === t) ? null : e.laneId === t ? n : { ...n, cards: n.cards.map((l) => l === e ? { ...e, laneId: t } : l) };
}
function oe(n, a, t) {
  return E(n, a, t) ? "" : "That move is not available.";
}
function j(n, a, t) {
  const e = n.cards.find((i) => i.id === a), l = n.cards.find((i) => i.id === t);
  return !e || !l ? "That task is no longer on the plan." : e === l ? "A task can't wait on itself." : e.dependsOn?.includes(l.id) ? `${e.label} already waits on ${l.label}.` : q(n, e.id).has(l.id) ? `${l.label} already waits on ${e.label}, so ${e.label} can't wait on ${l.label}.` : (e.dependsOn?.length ?? 0) >= 3 ? `${e.label} already waits on 3 tasks.` : w($(n, a, t), a);
}
function $(n, a, t, e = !1) {
  const l = y(n);
  return { ...n, cards: n.cards.map((i) => {
    if (i.id !== a) return i;
    const s = e ? (i.dependsOn ?? []).filter((d) => d !== t) : [...i.dependsOn ?? [], t], r = Math.max(0, ...s.map((d) => l.get(d)?.end ?? 0)), o = { ...i, dependsOn: s, lag: Math.max(0, l.get(i.id).start - r) };
    return s.length || delete o.dependsOn, o.lag || delete o.lag, o;
  }) };
}
function H(n, a) {
  const t = y(n), e = n.cards.filter((i) => i.laneId === a), l = e.filter((i) => t.get(i.id).critical).length;
  return `${e.length} ${e.length === 1 ? "task" : "tasks"} · ${l} on the critical path`;
}
function I(n, a, t) {
  return a.field === "day" ? { ...n, launch: { day: t } } : { ...n, cards: n.cards.map((e) => e.id === a.cardId ? { ...e, [a.field]: t } : e) };
}
function L(n, a) {
  const t = n.launch.day;
  if (a.field === "day") {
    const o = y(n), d = B(n), c = n.cards.find((h) => o.get(h.id).end === d);
    return {
      field: "day",
      min: Math.max(5, d),
      max: 120,
      reasons: { min: c ? `${c.label} ends on day ${d}.` : void 0, max: "Launch day is at most day 120." }
    };
  }
  const e = n.cards.find((o) => o.id === a.cardId), l = a.field === "duration" ? 1 : 0, i = a.field === "duration" ? 60 : t;
  let s = e[a.field] ?? l;
  for (; s < i && !w(I(n, a, s + 1)); ) s++;
  const r = s < i ? w(I(n, a, s + 1), e.id) ?? void 0 : void 0;
  return {
    field: a.field,
    min: l,
    max: Math.max(l, s),
    reasons: {
      min: a.field === "duration" ? "A task takes at least 1 day." : `${e.label} starts as early as it can.`,
      max: r ?? (a.field === "duration" ? "A task takes at most 60 days." : `Launch is day ${t}.`)
    }
  };
}
function K(n) {
  return n.label + " · " + v(n.duration ?? 1);
}
function re() {
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
const U = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  readCard(n, a, t) {
    if (a.duration = p(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (a.lag = p(n.lag, 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const e = n.dependsOn.map(t.id);
      if (new Set(e).size !== e.length) throw new Error("Duplicate dependency.");
      e.length && (a.dependsOn = e);
    }
  },
  readBoard(n, a) {
    a.launch = { day: p(N(n, "launch", "A launch plan needs a launch day.").day, 5, 120, "Launch day is a whole day from 5 to 120.") };
  },
  validate: Q,
  planMove: E,
  caption: H,
  cardText: (n, a) => a.label + " · " + a.duration + "d",
  noteText: (n, a) => K(a),
  fromNote(n, a) {
    const t = A(a);
    return typeof t == "string" ? t : { label: t.label, duration: Math.min(60, Math.max(1, t.days ?? 2)) };
  },
  renamed(n, a, t) {
    const e = C(t);
    return { label: e.label, edits: e.days !== void 0 ? [{ kind: "set_task", card: { id: a }, duration: e.days }] : [] };
  },
  edit(n, a, t) {
    switch (a.kind) {
      case "add_card": {
        const e = t.lane(a.lane), l = a.label?.trim();
        l || t.refuse("Say what the card should say, such as “Add Docs to " + e.label + "”.", { laneId: e.id });
        const i = { id: M(n), label: l, laneId: e.id, duration: a.duration ?? 2 };
        a.lag && (i.lag = a.lag);
        const s = [...new Set((a.waitsOn ?? []).map((d) => t.card(d).id))];
        s.length && (i.dependsOn = s);
        const r = { ...n, cards: [...n.cards, i] }, o = w(r, i.id);
        return o && t.refuse(o, { laneId: e.id }), t.done(t.settle(r, e.id), "Added " + f(l) + " to " + f(e.label) + ".", { laneId: e.id, cardId: i.id });
      }
      case "set_task": {
        const e = t.card(a.card), l = { laneId: e.laneId, cardId: e.id };
        a.duration === void 0 && a.lag === void 0 && t.refuse("Say how many days " + f(e.label) + " takes, or waits.", { ...l, code: "invalid_edit" });
        let i = n;
        for (const r of ["duration", "lag"]) {
          const o = a[r];
          if (o === void 0) continue;
          const d = L(i, { cardId: e.id, field: r });
          Number.isInteger(o) || t.refuse("A task's days are whole days.", { ...l, limits: d });
          const c = I(i, { cardId: e.id, field: r }, o);
          (o < d.min || o > d.max) && t.refuse(o < d.min ? d.reasons.min : w(c, e.id) ?? d.reasons.max, { ...l, limits: d }), i = c;
        }
        const s = i.cards.find((r) => r.id === e.id);
        return t.done(t.settle(i, e.laneId, e.id), f(e.label) + " now takes " + v(s.duration) + (s.lag ? " and waits " + v(s.lag) + "." : "."), l);
      }
      case "link_tasks":
      case "unlink_tasks": {
        const e = t.card(a.card), l = t.card(a.waitsOn), i = { laneId: e.laneId, cardId: e.id };
        if (a.kind === "unlink_tasks")
          return e.dependsOn?.includes(l.id) || t.refuse(f(e.label) + " doesn’t wait on " + f(l.label) + ".", i), t.done(t.settle($(n, e.id, l.id, !0), e.laneId, e.id), f(e.label) + " no longer waits on " + f(l.label) + ".", i);
        const s = j(n, e.id, l.id);
        return s && t.refuse(s, i), t.done(t.settle($(n, e.id, l.id), e.laneId, e.id), f(e.label) + " now waits on " + f(l.label) + ".", i);
      }
      case "set_launch_day": {
        const e = L(n, { field: "day" });
        if (!Number.isInteger(a.day) || a.day < e.min || a.day > e.max) {
          const l = I(n, { field: "day" }, a.day);
          t.refuse(a.day < e.min && w(l) || (a.day < e.min ? e.reasons.min : e.reasons.max), { limits: e });
        }
        return t.done(t.settle(I(n, { field: "day" }, a.day)), "Launch is now day " + a.day + ".");
      }
    }
    return null;
  }
};
x(U);
const k = (n) => !n.role;
function de(n) {
  let a = 0;
  for (const t of n.cards) {
    const e = n.lanes.find((l) => l.id === t.laneId);
    a += (t.amount ?? 0) * (e.role === "won" ? 1 : e.role === "lost" ? 0 : e.probability ?? 0);
  }
  return Math.round(a);
}
function V(n) {
  if (n.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (n.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!n.forecast) return "A pipeline needs a forecast target.";
  if (n.lanes.filter((e) => e.role === "won").length > 1 || n.lanes.filter((e) => e.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (n.lanes.filter(k).length < 1) return "A pipeline needs an open stage.";
  for (const e of n.lanes) {
    if (k(e) && e.probability === void 0) return `Give ${e.label} a chance to win, from 0 to 100%.`;
    const l = n.cards.filter((i) => i.laneId === e.id).length;
    if (e.capacity !== void 0 && l > e.capacity) return `${e.label} already holds ${l} of ${e.capacity} deals.`;
  }
  const a = n.lanes.find((e) => e.role === "won"), t = a && n.cards.find((e) => e.laneId === a.id && e.amount === void 0);
  return t ? `${t.label} needs an amount before it can be won. Write it on the card, like '${t.label} $40k'.` : null;
}
function D(n, a, t) {
  const e = n.cards.find((o) => o.id === a), l = n.lanes.find((o) => o.id === t);
  if (!e || !l) return "That move is not available.";
  const i = n.lanes.find((o) => o.id === e.laneId);
  if (i === l) return null;
  const s = n.lanes.filter(k);
  if (i.role === "won" && l.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (i.role === "lost" && l.role === "won") return `Reopen ${e.label} in an open stage first.`;
  if (l.role === "won" || k(i) && k(l) && s.indexOf(l) > s.indexOf(i)) {
    const o = s[s.indexOf(i) + 1] ?? n.lanes.find((d) => d.role === "won");
    if (o !== l) return `Deals move one stage at a time. ${e.label} is in ${i.label}, so ${o.label} comes first.`;
  }
  if (l.role === "won" && e.amount === void 0)
    return `${e.label} needs an amount before it can be won. Write it on the card, like '${e.label} $40k'.`;
  const r = n.cards.filter((o) => o.laneId === l.id).length;
  return l.capacity !== void 0 && r >= l.capacity ? `${l.label} already holds ${r} of ${l.capacity} deals.` : null;
}
function Z(n, a, t) {
  const e = n.cards.find((l) => l.id === a);
  return !e || D(n, a, t) !== null ? null : e.laneId === t ? n : { ...n, cards: [...n.cards.filter((l) => l !== e), { ...e, laneId: t }] };
}
function J(n, a) {
  const t = n.lanes.find((s) => s.id === a), e = n.cards.filter((s) => s.laneId === a), l = e.reduce((s, r) => s + (r.amount ?? 0), 0), i = t.role === "won" ? 1 : t.role === "lost" ? 0 : t.probability ?? 0;
  return `${e.length} ${e.length === 1 ? "deal" : "deals"} · ${u(l, n.forecast?.currency)} · ${Math.round(i * 100)}%`;
}
function X(n, a) {
  return a.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : m;
}
function ce() {
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
const T = (n, a, t) => a.amount === void 0 ? a.label : a.label + t + u(a.amount, n.forecast?.currency ?? n.budget?.currency), z = {
  readCard(n, a) {
    n.amount !== void 0 && (a.amount = p(n.amount, 0, 1e9, "An amount is a whole amount, not below zero."));
  },
  cardText: (n, a) => T(n, a, `
`),
  noteText: (n, a) => T(n, a, " · "),
  renamed(n, a, t) {
    const e = C(t);
    return { label: e.label, edits: e.amount !== void 0 ? [{ kind: "set_amount", card: { id: a }, amount: e.amount }] : [] };
  }
}, Y = {
  ...z,
  kind: "pipeline",
  cards: [16, "A pipeline holds up to 16 deals."],
  readLane(n, a) {
    if (n.role !== void 0) {
      if (n.role !== "won" && n.role !== "lost") throw new Error("A stage is won, lost or open.");
      a.role = n.role;
    }
    n.probability !== void 0 && (a.probability = p(n.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
  },
  readBoard(n, a) {
    const t = N(n, "forecast", "A pipeline needs a forecast target.");
    a.forecast = { target: p(t.target, 1, 1e9, "A target is a whole amount above zero."), currency: R(t.currency) };
  },
  validate: V,
  planMove: Z,
  refusal: D,
  caption: J,
  fromNote(n, a) {
    const t = A(a);
    return typeof t == "string" ? t : { label: t.label, ...t.amount !== void 0 && { amount: t.amount } };
  },
  edit(n, a, t) {
    const e = n.forecast.currency;
    switch (a.kind) {
      case "add_card": {
        const l = t.lane(a.lane), i = a.label?.trim();
        i || t.refuse("Say what the card should say, such as “Add Docs to " + l.label + "”.", { laneId: l.id });
        const s = { id: M(n), label: i, laneId: l.id };
        a.amount !== void 0 && ((!Number.isInteger(a.amount) || a.amount < m.min) && t.refuse(m.reasons.min, { laneId: l.id, limits: m }), a.amount > m.max && t.refuse(m.reasons.max, { laneId: l.id, limits: m }), s.amount = a.amount), l.role && t.refuse("A new deal starts in an open stage, not in " + l.label + ".", { laneId: l.id });
        const r = n.cards.filter((o) => o.laneId === l.id).length;
        return l.capacity !== void 0 && r >= l.capacity && t.refuse(l.label + " already holds " + r + " of " + l.capacity + " deals.", { laneId: l.id }), t.done(t.settle({ ...n, cards: [...n.cards, s] }, l.id), "Added " + f(i) + " to " + f(l.label) + ".", { laneId: l.id, cardId: s.id });
      }
      case "set_amount": {
        const l = t.card(a.card), i = { laneId: l.laneId, cardId: l.id, limits: m };
        return (!Number.isInteger(a.amount) || a.amount < m.min || a.amount > m.max) && t.refuse(a.amount < m.min ? m.reasons.min : m.reasons.max, i), l.amount = a.amount, t.done(t.settle(n, l.laneId, l.id), f(l.label) + " is now " + u(a.amount, e) + ".", { laneId: l.laneId, cardId: l.id });
      }
      case "set_target": {
        const l = X(n, { field: "target" });
        return (!Number.isInteger(a.amount) || a.amount < 1 || a.amount > l.max) && t.refuse(a.amount < 1 ? l.reasons.min : l.reasons.max, { limits: l }), n.forecast.target = a.amount, t.done(t.settle(n), "The target is now " + u(a.amount, e) + ".");
      }
    }
    return null;
  }
};
x(Y);
function b(n, a) {
  return n.cards.reduce((t, e) => t + (e.laneId === a ? e.amount ?? 0 : 0), 0);
}
const P = (n, a) => Math.max(a.floor ?? 0, b(n, a.id));
function ee(n) {
  const a = n.budget;
  if (!a) return "A budget needs a total.";
  if (n.cards.length > 16) return "A budget holds up to 16 line items.";
  const t = n.lanes.reduce((e, l) => e + (l.allocation ?? 0), 0);
  if (t !== a.total) return `The teams' allocations add up to ${u(t, a.currency)}, not ${u(a.total, a.currency)}.`;
  for (const e of n.lanes) {
    if (e.allocation === void 0) return `Give ${e.label} an allocation.`;
    if (e.floor !== void 0 && e.cap !== void 0 && e.floor > e.cap) return `${e.label}'s floor is above its cap.`;
    if (e.floor !== void 0 && e.allocation < e.floor) return `${e.label}'s floor is ${u(e.floor, a.currency)}.`;
    if (e.cap !== void 0 && e.allocation > e.cap) return `${e.label}'s cap is ${u(e.cap, a.currency)}.`;
    const l = b(n, e.id);
    if (l > e.allocation) return `${e.label} commits ${u(l, a.currency)} of ${u(e.allocation, a.currency)}.`;
  }
  return n.cards.some((e) => e.amount === void 0) ? "Give every line item a cost." : null;
}
function F(n, a, t) {
  const e = n.cards.find((r) => r.id === a), l = n.lanes.find((r) => r.id === t);
  if (!e || !l) return "That move is not available.";
  if (e.laneId === t) return null;
  const i = (l.allocation ?? 0) - b(n, t), s = n.budget?.currency;
  return (e.amount ?? 0) > i ? `${l.label} has ${u(i, s)} left. ${e.label} costs ${u(e.amount ?? 0, s)}.` : null;
}
function ne(n, a, t) {
  const e = n.cards.find((l) => l.id === a);
  return !e || F(n, a, t) !== null ? null : e.laneId === t ? n : { ...n, cards: [...n.cards.filter((l) => l !== e), { ...e, laneId: t }] };
}
function ae(n, a, t, e) {
  return { ...n, lanes: n.lanes.map((l) => l.id === a ? { ...l, allocation: (l.allocation ?? 0) - e } : l.id === t ? { ...l, allocation: (l.allocation ?? 0) + e } : l) };
}
function O(n, a, t) {
  const e = n.lanes.find((c) => c.id === a), l = n.lanes.find((c) => c.id === t), i = n.budget?.currency, s = (c, h) => {
    if (!h) return `${c.label}'s cap is ${u(c.cap, i)}.`;
    const g = b(n, c.id);
    return g >= (c.floor ?? 0) ? `${c.label} already commits ${u(g, i)}.` : `${c.label}'s floor is ${u(c.floor, i)}.`;
  }, r = (c) => c.reduce((h, g) => g.value < h.value ? g : h), o = r([
    { value: e.allocation - P(n, e), why: s(e, !0) },
    ...l.cap !== void 0 ? [{ value: l.cap - l.allocation, why: s(l, !1) }] : []
  ]), d = r([
    { value: l.allocation - P(n, l), why: s(l, !0) },
    ...e.cap !== void 0 ? [{ value: e.cap - e.allocation, why: s(e, !1) }] : []
  ]);
  return { field: "amount", min: -d.value, max: o.value, reasons: { min: d.why, max: o.why } };
}
function te(n, a, t, e) {
  if (a === t) return "Choose two different teams.";
  if (!Number.isFinite(e) || !Number.isInteger(e)) return "Move a whole amount.";
  const l = O(n, a, t);
  if (e > l.max) return l.reasons.max;
  if (e < l.min) return l.reasons.min;
  const i = n.budget?.step;
  return i && e % i !== 0 && e !== l.max && e !== l.min ? `Move money in steps of ${u(i, n.budget?.currency)}.` : null;
}
function ue(n, a) {
  const t = n.lanes.findIndex((l) => l.id === a.laneId), e = n.lanes[t + 1];
  return t < 0 || !e ? { field: "amount", min: 0, max: 0, reasons: {} } : O(n, e.id, a.laneId);
}
function le(n, a) {
  const t = n.lanes.find((l) => l.id === a), e = n.budget?.currency;
  return `${u(t.allocation ?? 0, e)} · ${u(b(n, a), e)} committed`;
}
function fe() {
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
const ie = {
  ...z,
  kind: "budget",
  cards: [16, "A budget holds up to 16 line items."],
  readLane(n, a) {
    for (const t of ["allocation", "floor", "cap"]) n[t] !== void 0 && (a[t] = p(n[t], 0, 1e9, "Team amounts are whole amounts."));
  },
  readBoard(n, a) {
    const t = N(n, "budget", "A budget needs a total.");
    a.budget = {
      total: p(t.total, 1, 1e9, "A total is a whole amount above zero."),
      currency: R(t.currency),
      step: t.step === void 0 ? 5e3 : p(t.step, 1, 1e9, "A step is a whole amount above zero.")
    };
  },
  validate: ee,
  planMove: ne,
  refusal: F,
  caption: le,
  fromNote(n, a) {
    const t = A(a);
    return typeof t == "string" ? t : t.amount === void 0 ? "Write the cost on the note, like 'Contractor $45k', then drop it." : { label: t.label, amount: t.amount };
  },
  edit(n, a, t) {
    const e = n.budget.currency;
    switch (a.kind) {
      case "add_card": {
        const l = t.lane(a.lane), i = a.label?.trim();
        i || t.refuse("Say what the card should say, such as “Add Docs to " + l.label + "”.", { laneId: l.id }), a.amount === void 0 && t.refuse("Give the line item a cost, like 'Contractor $45k'.", { laneId: l.id });
        const s = { ...m, min: 1 };
        (!Number.isInteger(a.amount) || a.amount < 1) && t.refuse("A line item costs something.", { laneId: l.id, limits: s }), a.amount > m.max && t.refuse(m.reasons.max, { laneId: l.id, limits: m });
        const r = l.allocation - b(n, l.id);
        a.amount > r && t.refuse(l.label + " has " + u(r, e) + " left. " + i + " costs " + u(a.amount, e) + ".", { laneId: l.id });
        const o = { id: M(n), label: i, laneId: l.id, amount: a.amount };
        return t.done(t.settle({ ...n, cards: [...n.cards, o] }, l.id), "Added " + f(i) + " to " + f(l.label) + ".", { laneId: l.id, cardId: o.id });
      }
      case "set_amount": {
        const l = t.card(a.card), i = n.lanes.find((d) => d.id === l.laneId), s = i.allocation - b(n, i.id) + (l.amount ?? 0), r = { field: "amount", min: 1, max: s, reasons: { min: "A line item costs something.", max: f(i.label) + " has " + u(s, e) + " for it." } }, o = { laneId: l.laneId, cardId: l.id, limits: r };
        return a.amount > s && t.refuse(i.label + " has " + u(s - (l.amount ?? 0), e) + " left. " + l.label + " costs " + u(a.amount, e) + ".", { ...o, laneId: i.id }), (!Number.isInteger(a.amount) || a.amount < r.min) && t.refuse(r.reasons.min, o), l.amount = a.amount, t.done(t.settle(n, l.laneId, l.id), f(l.label) + " is now " + u(a.amount, e) + ".", { laneId: l.laneId, cardId: l.id });
      }
      case "shift_budget": {
        const l = t.lane(a.from), i = t.lane(a.to), s = te(n, l.id, i.id, a.amount);
        return s && t.refuse(s, { laneId: l.id, ...l.id !== i.id && { limits: O(n, l.id, i.id) } }), t.done(t.settle(ae(n, l.id, i.id, a.amount), i.id), "Moved " + u(a.amount, e) + " from " + f(l.label) + " to " + f(i.label) + ".", { laneId: i.id });
      }
    }
    return null;
  }
};
x(ie);
export {
  m as amountLimits,
  p as amountOf,
  z as amountRules,
  le as budgetCaption,
  b as budgetCommitted,
  ue as budgetLimits,
  F as budgetRefusal,
  ie as budgetRules,
  O as budgetShiftLimits,
  te as budgetShiftRefusal,
  R as currencyOf,
  v as days,
  q as downstreamTasks,
  B as launchFinish,
  j as launchLinkRefusal,
  w as launchOverrun,
  H as launchPlanCaption,
  L as launchPlanLimits,
  oe as launchPlanRefusal,
  U as launchPlanRules,
  K as launchTaskText,
  u as money,
  M as nextCardId,
  A as noteNumbers,
  N as ownField,
  J as pipelineCaption,
  de as pipelineForecast,
  X as pipelineLimits,
  D as pipelineRefusal,
  Y as pipelineRules,
  ne as planBudgetMove,
  E as planLaunchPlanMove,
  Z as planPipelineMove,
  S as readNoteNumbers,
  C as renamedNumbers,
  fe as sampleBudget,
  re as sampleLaunchPlan,
  ce as samplePipeline,
  y as scheduleLaunch,
  ae as shiftBudget,
  ee as validateBudget,
  Q as validateLaunchPlan,
  V as validatePipeline,
  $ as withLink,
  I as withTaskValue
};
