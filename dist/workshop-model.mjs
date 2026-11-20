import { D as Fe } from "./NoteDefaults-1xFW0br8.mjs";
const Xo = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function ea(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, stage: n, choice: a, fieldNote: s, deskNote: l, fallback: y } = e, b = (k) => typeof k == "string" && k.trim().length > 0 && k.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(k);
  return t !== "offline-handoff" || o !== 1 || n !== "queued" && n !== "review" && n !== "resolved" || (n === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !b(s) || !b(l) || !b(y) ? null : { kind: t, version: o, stage: n, choice: a, fieldNote: s.trim(), deskNote: l.trim(), fallback: y.trim() };
}
function na(e) {
  return { ...e, stage: "review", choice: null };
}
function ta(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function oa(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const Qe = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function aa(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, mix: n, leftLabel: a, rightLabel: s } = e, l = (y) => typeof y == "string" && y.trim().length > 0 && y.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(y);
  return t !== "listening-room" || o !== 1 || typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1 || !l(a) || !l(s) ? null : { kind: t, version: o, mix: n, leftLabel: a.trim(), rightLabel: s.trim() };
}
function ra({ mix: e, leftLabel: t, rightLabel: o }) {
  return e < 0.32 ? t === Qe.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? o === Qe.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : t === Qe.leftLabel && o === Qe.rightLabel ? "Rain and glass chimes overlap." : t + " and " + o + " overlap.";
}
function Ae(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.points ?? 1 : 0), 0);
}
function Jt(e) {
  const t = new Map(e.cards.map((l) => [l.id, l])), o = new Map(e.lanes.map((l, y) => [l.id, y])), n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function s(l) {
    if (!n.has(l.id)) {
      if (a.has(l.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(l.id);
      for (const y of l.dependsOn ?? []) {
        const b = t.get(y);
        if (!b) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(b.laneId) > o.get(l.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(b);
      }
      a.delete(l.id), n.add(l.id);
    }
  }
  for (const l of e.cards) s(l);
  for (const l of e.lanes) {
    if (l.station) throw new Error("Release windows cannot also be map stations.");
    if (Ae(e, l.id) > (l.capacity ?? 1 / 0)) throw new Error(`Release "${l.label}" exceeds its point budget.`);
  }
}
function cn(e, t, o) {
  if (o === t.laneId) return e;
  const n = new Map(e.lanes.map((m, A) => [m.id, A])), a = n.get(o);
  if (a === void 0) return null;
  const s = a < n.get(t.laneId), l = /* @__PURE__ */ new Set([t.id]), y = [t];
  for (; y.length; ) {
    const m = y.pop();
    for (const A of e.cards) {
      if (l.has(A.id)) continue;
      const v = n.get(A.laneId);
      (s ? v > a && m.dependsOn?.includes(A.id) : v < a && A.dependsOn?.includes(m.id)) && (l.add(A.id), y.push(A));
    }
  }
  if (e.cards.filter((m) => l.has(m.id)).some((m) => m.allowedLaneIds && !m.allowedLaneIds.includes(o))) return null;
  const k = { ...e, cards: e.cards.map((m) => l.has(m.id) ? { ...m, laneId: o } : m) }, c = e.lanes[a].capacity;
  return c !== void 0 && Ae(k, o) > c ? null : k;
}
const sa = {
  version: 1,
  kind: "release-plan",
  title: "What makes the Friday release?",
  lanes: [
    { id: "friday", label: "Friday release", capacity: 8 },
    { id: "next", label: "Next week", capacity: 12 },
    { id: "backlog", label: "Unscheduled" }
  ],
  cards: [
    { id: "guardrails", label: "Permission checks", laneId: "next", points: 2 },
    { id: "invite", label: "Team invitations", laneId: "backlog", points: 3, dependsOn: ["guardrails"] },
    { id: "billing", label: "Invoice download", laneId: "friday", points: 3 },
    { id: "export", label: "Workspace export", laneId: "next", points: 4 }
  ]
}, Yt = /(?:^|\s)(\d{1,3})\s*(?:d|days?)\b\.?/i, Vt = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/;
function wt(e) {
  let t = String(e ?? "").replace(/\s+/g, " ").trim();
  const o = { label: t }, n = Yt.exec(t);
  n && (o.days = Number(n[1]), t = t.slice(0, n.index) + " " + t.slice(n.index + n[0].length));
  const a = Vt.exec(t);
  if (a && (a[1] || a[3] || Number(a[2].replace(",", "")) >= 1e3)) {
    const s = /k/i.test(a[3] ?? "") ? 1e3 : /m/i.test(a[3] ?? "") ? 1e6 : 1;
    o.amount = Math.round(Number(a[2].replace(",", a[3] ? "." : "")) * s), a[1] && (o.currency = a[1]), t = t.slice(0, a.index) + " " + t.slice(a.index + a[0].length);
  }
  return o.label = t.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), o;
}
function q(e, t = "$") {
  const o = e < 0 ? "-" : "", n = Math.abs(e), a = (l, y) => (Math.round(l * 10) / 10).toString() + y, s = n >= 1e6 ? a(n / 1e6, "M") : n >= 1e3 ? a(n / 1e3, "k") : String(Math.round(n));
  return o + t + s;
}
const Zt = (e) => e + (e === 1 ? " day" : " days");
function Se(e) {
  const t = new Map(e.cards.map((b) => [b.id, b])), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), a = (b) => {
    const k = o.get(b.id);
    if (k) return k;
    if (n.has(b.id)) throw new Error("Tasks can't wait on each other in a circle.");
    n.add(b.id);
    let c = 0;
    for (const A of b.dependsOn ?? []) {
      const v = t.get(A);
      if (!v) throw new Error("A task waits on a task that is not on the plan.");
      c = Math.max(c, a(v).end);
    }
    c += b.lag ?? 0;
    const m = { start: c, end: c + (b.duration ?? 1), slack: 0, critical: !1 };
    return o.set(b.id, m), n.delete(b.id), m;
  };
  e.cards.forEach(a);
  const s = Math.max(0, ...[...o.values()].map((b) => b.end)), l = /* @__PURE__ */ new Map(), y = (b) => {
    const k = l.get(b.id);
    if (k !== void 0) return k;
    let c = s;
    for (const m of e.cards)
      m.dependsOn?.includes(b.id) && (c = Math.min(c, y(m) - (m.duration ?? 1) - (m.lag ?? 0)));
    return l.set(b.id, c), c;
  };
  for (const b of e.cards) {
    const k = o.get(b.id);
    k.slack = y(b) - k.end, k.critical = k.slack === 0;
  }
  return o;
}
function gt(e) {
  return Math.max(0, ...[...Se(e).values()].map((t) => t.end));
}
function Qt(e, t) {
  const o = /* @__PURE__ */ new Set(), n = (a) => {
    for (const s of e.cards) s.dependsOn?.includes(a) && !o.has(s.id) && (o.add(s.id), n(s.id));
  };
  return n(t), o;
}
function Me(e, t) {
  const o = e.launch?.day ?? 0, n = Se(e), a = t ? n.get(t) : void 0;
  if (a && a.end > o) return `That ends on day ${a.end}, after launch on day ${o}.`;
  const s = e.cards.map((l) => ({ card: l, end: n.get(l.id).end })).filter((l) => l.end > o).sort((l, y) => y.end - l.end)[0];
  return s ? `That pushes ${s.card.label} to day ${s.end}, after launch on day ${o}.` : null;
}
function Xt(e) {
  if (e.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (e.cards.length < 1 || e.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const t = e.launch?.day;
  if (typeof t != "number" || !Number.isInteger(t) || t < 5 || t > 120) return "Launch day is a whole day from 5 to 120.";
  for (const n of e.cards) {
    if (!Number.isInteger(n.duration) || n.duration < 1 || n.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(n.lag ?? 0) || (n.lag ?? 0) < 0 || (n.lag ?? 0) > t) return "A task waits 0 days or more, and no later than launch.";
    if ((n.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (n.dependsOn?.includes(n.id)) return "A task can't wait on itself.";
  }
  try {
    Se(e);
  } catch (n) {
    return n.message;
  }
  const o = gt(e);
  if (o > t) {
    const n = Se(e);
    return `${e.cards.find((s) => n.get(s.id).end === o).label} ends on day ${o}, after launch on day ${t}.`;
  }
  return null;
}
function yt(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || !e.lanes.some((a) => a.id === o) ? null : n.laneId === o ? e : { ...e, cards: e.cards.map((a) => a === n ? { ...n, laneId: o } : a) };
}
function ia(e, t, o) {
  return yt(e, t, o) ? "" : "That move is not available.";
}
function eo(e, t, o) {
  const n = e.cards.find((s) => s.id === t), a = e.cards.find((s) => s.id === o);
  return !n || !a ? "That task is no longer on the plan." : n === a ? "A task can't wait on itself." : n.dependsOn?.includes(a.id) ? `${n.label} already waits on ${a.label}.` : Qt(e, n.id).has(a.id) ? `${a.label} already waits on ${n.label}, so ${n.label} can't wait on ${a.label}.` : (n.dependsOn?.length ?? 0) >= 3 ? `${n.label} already waits on 3 tasks.` : Me(Cn(e, t, o), t);
}
function Cn(e, t, o, n = !1) {
  const a = Se(e);
  return { ...e, cards: e.cards.map((s) => {
    if (s.id !== t) return s;
    const l = n ? (s.dependsOn ?? []).filter((k) => k !== o) : [...s.dependsOn ?? [], o], y = Math.max(0, ...l.map((k) => a.get(k)?.end ?? 0)), b = { ...s, dependsOn: l, lag: Math.max(0, a.get(s.id).start - y) };
    return l.length || delete b.dependsOn, b.lag || delete b.lag, b;
  }) };
}
function no(e, t) {
  const o = Se(e), n = e.cards.filter((s) => s.laneId === t), a = n.filter((s) => o.get(s.id).critical).length;
  return `${n.length} ${n.length === 1 ? "task" : "tasks"} · ${a} on the critical path`;
}
function je(e, t, o) {
  return t.field === "day" ? { ...e, launch: { day: o } } : { ...e, cards: e.cards.map((n) => n.id === t.cardId ? { ...n, [t.field]: o } : n) };
}
function Qn(e, t) {
  const o = e.launch.day;
  if (t.field === "day") {
    const b = Se(e), k = gt(e), c = e.cards.find((m) => b.get(m.id).end === k);
    return {
      field: "day",
      min: Math.max(5, k),
      max: 120,
      reasons: { min: c ? `${c.label} ends on day ${k}.` : void 0, max: "Launch day is at most day 120." }
    };
  }
  const n = e.cards.find((b) => b.id === t.cardId), a = t.field === "duration" ? 1 : 0, s = t.field === "duration" ? 60 : o;
  let l = n[t.field] ?? a;
  for (; l < s && !Me(je(e, t, l + 1)); ) l++;
  const y = l < s ? Me(je(e, t, l + 1), n.id) ?? void 0 : void 0;
  return {
    field: t.field,
    min: a,
    max: Math.max(a, l),
    reasons: {
      min: t.field === "duration" ? "A task takes at least 1 day." : `${n.label} starts as early as it can.`,
      max: y ?? (t.field === "duration" ? "A task takes at most 60 days." : `Launch is day ${o}.`)
    }
  };
}
function to(e) {
  return e.label + " · " + Zt(e.duration ?? 1);
}
function la() {
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
const Ge = (e) => !e.role;
function da(e) {
  let t = 0;
  for (const o of e.cards) {
    const n = e.lanes.find((a) => a.id === o.laneId);
    t += (o.amount ?? 0) * (n.role === "won" ? 1 : n.role === "lost" ? 0 : n.probability ?? 0);
  }
  return Math.round(t);
}
function oo(e) {
  if (e.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (e.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!e.forecast) return "A pipeline needs a forecast target.";
  if (e.lanes.filter((n) => n.role === "won").length > 1 || e.lanes.filter((n) => n.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (e.lanes.filter(Ge).length < 1) return "A pipeline needs an open stage.";
  for (const n of e.lanes) {
    if (Ge(n) && n.probability === void 0) return `Give ${n.label} a chance to win, from 0 to 100%.`;
    const a = e.cards.filter((s) => s.laneId === n.id).length;
    if (n.capacity !== void 0 && a > n.capacity) return `${n.label} already holds ${a} of ${n.capacity} deals.`;
  }
  const t = e.lanes.find((n) => n.role === "won"), o = t && e.cards.find((n) => n.laneId === t.id && n.amount === void 0);
  return o ? `${o.label} needs an amount before it can be won. Write it on the card, like '${o.label} $40k'.` : null;
}
function kt(e, t, o) {
  const n = e.cards.find((b) => b.id === t), a = e.lanes.find((b) => b.id === o);
  if (!n || !a) return "That move is not available.";
  const s = e.lanes.find((b) => b.id === n.laneId);
  if (s === a) return null;
  const l = e.lanes.filter(Ge);
  if (s.role === "won" && a.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (s.role === "lost" && a.role === "won") return `Reopen ${n.label} in an open stage first.`;
  if (a.role === "won" || Ge(s) && Ge(a) && l.indexOf(a) > l.indexOf(s)) {
    const b = l[l.indexOf(s) + 1] ?? e.lanes.find((k) => k.role === "won");
    if (b !== a) return `Deals move one stage at a time. ${n.label} is in ${s.label}, so ${b.label} comes first.`;
  }
  if (a.role === "won" && n.amount === void 0)
    return `${n.label} needs an amount before it can be won. Write it on the card, like '${n.label} $40k'.`;
  const y = e.cards.filter((b) => b.laneId === a.id).length;
  return a.capacity !== void 0 && y >= a.capacity ? `${a.label} already holds ${y} of ${a.capacity} deals.` : null;
}
function ao(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || kt(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function ro(e, t) {
  const o = e.lanes.find((l) => l.id === t), n = e.cards.filter((l) => l.laneId === t), a = n.reduce((l, y) => l + (y.amount ?? 0), 0), s = o.role === "won" ? 1 : o.role === "lost" ? 0 : o.probability ?? 0;
  return `${n.length} ${n.length === 1 ? "deal" : "deals"} · ${q(a, e.forecast?.currency)} · ${Math.round(s * 100)}%`;
}
function Xn(e, t) {
  return t.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
}
function ca() {
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
function Ce(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.amount ?? 0 : 0), 0);
}
const et = (e, t) => Math.max(t.floor ?? 0, Ce(e, t.id));
function so(e) {
  const t = e.budget;
  if (!t) return "A budget needs a total.";
  if (e.cards.length > 16) return "A budget holds up to 16 line items.";
  const o = e.lanes.reduce((n, a) => n + (a.allocation ?? 0), 0);
  if (o !== t.total) return `The teams' allocations add up to ${q(o, t.currency)}, not ${q(t.total, t.currency)}.`;
  for (const n of e.lanes) {
    if (n.allocation === void 0) return `Give ${n.label} an allocation.`;
    if (n.floor !== void 0 && n.cap !== void 0 && n.floor > n.cap) return `${n.label}'s floor is above its cap.`;
    if (n.floor !== void 0 && n.allocation < n.floor) return `${n.label}'s floor is ${q(n.floor, t.currency)}.`;
    if (n.cap !== void 0 && n.allocation > n.cap) return `${n.label}'s cap is ${q(n.cap, t.currency)}.`;
    const a = Ce(e, n.id);
    if (a > n.allocation) return `${n.label} commits ${q(a, t.currency)} of ${q(n.allocation, t.currency)}.`;
  }
  return e.cards.some((n) => n.amount === void 0) ? "Give every line item a cost." : null;
}
function bt(e, t, o) {
  const n = e.cards.find((y) => y.id === t), a = e.lanes.find((y) => y.id === o);
  if (!n || !a) return "That move is not available.";
  if (n.laneId === o) return null;
  const s = (a.allocation ?? 0) - Ce(e, o), l = e.budget?.currency;
  return (n.amount ?? 0) > s ? `${a.label} has ${q(s, l)} left. ${n.label} costs ${q(n.amount ?? 0, l)}.` : null;
}
function io(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || bt(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function lo(e, t, o, n) {
  return { ...e, lanes: e.lanes.map((a) => a.id === t ? { ...a, allocation: (a.allocation ?? 0) - n } : a.id === o ? { ...a, allocation: (a.allocation ?? 0) + n } : a) };
}
function Mn(e, t, o) {
  const n = e.lanes.find((c) => c.id === t), a = e.lanes.find((c) => c.id === o), s = e.budget?.currency, l = (c, m) => {
    if (!m) return `${c.label}'s cap is ${q(c.cap, s)}.`;
    const A = Ce(e, c.id);
    return A >= (c.floor ?? 0) ? `${c.label} already commits ${q(A, s)}.` : `${c.label}'s floor is ${q(c.floor, s)}.`;
  }, y = (c) => c.reduce((m, A) => A.value < m.value ? A : m), b = y([
    { value: n.allocation - et(e, n), why: l(n, !0) },
    ...a.cap !== void 0 ? [{ value: a.cap - a.allocation, why: l(a, !1) }] : []
  ]), k = y([
    { value: a.allocation - et(e, a), why: l(a, !0) },
    ...n.cap !== void 0 ? [{ value: n.cap - n.allocation, why: l(n, !1) }] : []
  ]);
  return { field: "amount", min: -k.value, max: b.value, reasons: { min: k.why, max: b.why } };
}
function co(e, t, o, n) {
  if (t === o) return "Choose two different teams.";
  if (!Number.isFinite(n) || !Number.isInteger(n)) return "Move a whole amount.";
  const a = Mn(e, t, o);
  return n > a.max ? a.reasons.max : n < a.min ? a.reasons.min : null;
}
function ua(e, t) {
  const o = e.lanes.findIndex((a) => a.id === t.laneId), n = e.lanes[o + 1];
  return o < 0 || !n ? { field: "amount", min: 0, max: 0, reasons: {} } : Mn(e, n.id, t.laneId);
}
function uo(e, t) {
  const o = e.lanes.find((a) => a.id === t), n = e.budget?.currency;
  return `${q(o.allocation ?? 0, n)} · ${q(Ce(e, t), n)} committed`;
}
function fa() {
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
const C = (e) => "“" + e.replace(/[“”]/g, '"') + "”", $e = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], nt = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), _n = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Rn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ha = (e) => _n(Rn(e)), fo = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty"
], ho = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : fo.indexOf(e.toLowerCase()), po = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function vt(e, t) {
  const o = /* @__PURE__ */ new Set(), n = (a) => {
    const s = _n(a);
    s && o.add(s);
  };
  n(e), n(Rn(e));
  for (const a of [...o]) n(a.replace(/^(?:the|my|our)\s+/i, ""));
  for (const a of [...o]) n(a.replace(new RegExp("^(?:" + t + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const a of [...o]) n(a.replace(new RegExp("\\s+(?:" + t + ")$", "i"), ""));
  return [...o];
}
const vn = "[^\\p{L}\\p{N}]", tt = [
  (e, t) => e === t,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, t) => e.startsWith(t + " · "),
  (e, t) => t.length > 1 && new RegExp("^" + nt(t) + "(?:$|" + vn + ")", "u").test(e),
  (e, t) => t.length > 2 && new RegExp("(?:^|" + vn + ")" + nt(t) + "(?:$|" + vn + ")", "u").test(e)
], ot = ["first", "second", "third", "fourth", "fifth"];
function mo(e, t, o) {
  const n = new RegExp("^(?:the\\s+)?(?:(" + ot.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(_n(Rn(t)));
  if (!n) return null;
  const a = (n[1] ?? n[2]).toLowerCase(), s = a === "last" ? e.length - 1 : n[1] ? ot.indexOf(a) : ho(a) - 1;
  return e[s] ?? null;
}
function In(e, t, o, n, a) {
  const s = vt(t, o);
  if (s.some((y) => po.test(y))) {
    const y = n && e.find((b) => b.id === n);
    return y ? { item: y, rank: 0 } : { pointing: !0 };
  }
  for (const y of s) {
    if (!y.startsWith("@")) continue;
    const b = e.find((k) => k.id === y.slice(1));
    if (b) return { item: b, rank: 0 };
  }
  for (const [y, b] of tt.entries())
    for (const k of s) {
      const c = e.filter((m) => b(m.label.toLowerCase(), k.toLowerCase()));
      if (c.length === 1) return { item: c[0], rank: y };
      if (c.length > 1) return { several: c };
    }
  const l = a ? mo(e, t, o) : null;
  return l ? { item: l, rank: tt.length } : {};
}
class nn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(t, o, n = []) {
    super(t), this.reason = o, this.candidates = n;
  }
}
function On(e, t, o, n, a = !1) {
  return { find: (b) => {
    const k = In(e, b, t, n, a);
    if (k.item) return k.item;
    const c = vt(b, t), m = c[c.length - 1];
    if (k.pointing) throw new nn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (k.several) {
      const v = [...new Set(k.several.map((E) => E.label))];
      throw new nn(v.length === 1 ? k.several.length + " " + o + "s are called " + C(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + C(m) + ": " + $e(v.slice(0, 6).map(C)) + ". Use the whole name.", "ambiguous", k.several.map((E) => E.id));
    }
    const A = e.map((v) => v.label);
    throw new nn("There is no " + o + " called " + C(m) + " here." + (A.length && A.length <= 6 ? " The " + o + "s are " + $e(A.map(C)) + "." : A.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (b) => In(e, b, t, n, a).item ?? null, rank: (b) => In(e, b, t, n, a).rank ?? 1 / 0 };
}
const wo = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget"], we = [...wo], Le = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], It = ["launch-plan", "pipeline", "budget"];
function sn(e) {
  if (e.lanes[0]?.station) return "map";
  const t = ie(e);
  return t || (e.kind === "release-plan" ? "release-plan" : We(e) ?? "lanes");
}
const B = {
  releaseLanes: "A release plan keeps the releases it came with. You can rename them and set how many points each holds.",
  releaseOrder: "A release plan keeps its releases in the order they came in: that order says which release is earlier. You can rename them and set how many points each holds.",
  releaseCards: "A release plan keeps the features it came with. You can rename them, move them and set their points.",
  keepsLanes: "This workshop keeps the lanes it came with. You can rename them, and rename and move its cards.",
  keepsOrder: "This workshop keeps its lanes in the order they came in. You can rename them, and rename and move its cards.",
  keepsCards: "This workshop keeps the cards it came with. You can rename them and move them between its lanes.",
  notPoints: "This workshop counts cards, not points. You can set how many cards a lane holds.",
  mapPoints: "A map counts tokens, not points. You can set how many tokens a step holds.",
  notDepends: "Only a release plan keeps track of what depends on what.",
  notMap: "Choose an interactive map to edit its stations.",
  mapAddLane: "On a map a new step follows another one. Say which step it comes after.",
  mapCardLanes: "A map’s tokens go where its paths lead. Connect or disconnect steps instead.",
  mapOutcome: "A map says what happens when a token reaches a step. Change what that step says instead.",
  launchLanes: "A launch plan keeps the teams it came with. You can rename them and move tasks between them.",
  pipelineLanes: "A pipeline keeps the stages it came with. You can rename them and set how many deals a stage holds.",
  budgetLanes: "A budget keeps the teams it came with. Move money between them instead.",
  notTasks: "Only a launch plan's tasks take days and wait on each other.",
  notAmounts: "Only a pipeline's deals and a budget's line items carry an amount.",
  notTarget: "Only a pipeline has a forecast target.",
  notBudget: "Only a budget moves money between teams.",
  businessCards: "Cards on this board go where its rules let them."
}, Tn = { "launch-plan": B.launchLanes, pipeline: B.pipelineLanes, budget: B.budgetLanes }, se = (e, t) => Object.fromEntries(we.filter((o) => !e.includes(o)).map((o) => [o, t])), ae = (e, t, o = !1) => ({ type: "text", max: e, about: t, ...o && { optional: o } }), Y = (e, t = !1) => ({ type: "ref", of: "lane", about: e, ...t && { optional: t } }), oe = (e) => ({ type: "ref", of: "card", about: e }), xn = (e) => ({ map: e }), he = se(["map"], B.notMap), pe = (e, t = 1e9, o = 0, n = !1) => ({ type: "integer", min: o, max: t, about: e, ...n && { optional: n } }), Wn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: ae(120, "The new name, 1 to 120 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Y("The lane or step."), label: ae(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: oe("The card or token."), label: ae(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ae(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": B.releaseLanes, "customer-interviews": B.keepsLanes, "experiment-budget": B.keepsLanes, map: B.mapAddLane, ...Tn }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Y("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": B.releaseLanes, "customer-interviews": B.keepsLanes, "experiment-budget": B.keepsLanes, ...Tn }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Y("The lane or step it starts in."),
      label: ae(80, "What the card says. On a map it may be left out: the token is numbered.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: pe("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: pe("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: pe("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...It],
    refusals: { "release-plan": B.releaseCards, "customer-interviews": B.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: oe("The card or token.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: oe("The card or token."), lane: Y("Where it goes.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: oe("The token.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Y("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: we.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": B.launchLanes, budget: B.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: oe("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: Le,
    refusals: { ...xn(B.mapCardLanes), ...se([...Le, "map"], B.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: oe("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...se(["release-plan"], B.notPoints), map: B.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: oe("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...se(["release-plan"], B.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: oe("The card."),
      lane: Y("The lane."),
      whenPresent: ae(160, "What it says when the card is there."),
      whenAbsent: ae(160, "What it says otherwise."),
      label: ae(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: Le,
    refusals: { ...xn(B.mapOutcome), ...se([...Le, "map"], B.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: oe("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: Le,
    refusals: { ...xn(B.mapOutcome), ...se([...Le, "map"], B.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: we,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Y("The lane or step."), before: Y("Present it just before this one.", !0), after: Y("Present it just after this one.", !0) },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Y("The step it follows."), label: ae(80, "The new step’s name."), outcome: ae(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Y("The step it goes in front of."),
      from: Y("Only the path from this step is taken over.", !0),
      label: ae(80, "The new step’s name."),
      outcome: ae(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Y("Where the path starts."), to: Y("Where it leads.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Y("Where the path starts."), to: Y("Where it leads.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Y("The step."), outcome: ae(160, "What it says.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Y("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Y("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Y("The step."), alt: ae(240, "What the picture shows.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: oe("The task."), duration: pe("Its days, 1 to 60.", 60, 1, !0), lag: pe("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], B.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], B.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: oe("The task that waits."), waitsOn: oe("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], B.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: pe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: se(["launch-plan"], B.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: oe("The deal or line item."), amount: pe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: se(["pipeline", "budget"], B.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: pe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: se(["pipeline"], B.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Y("The team giving."), to: Y("The team receiving."), amount: pe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: se(["budget"], B.notBudget)
  }
], go = new Map(Wn.map((e) => [e.kind, e])), yo = (e, t) => typeof e == "number" ? e : (t && e[t]) ?? e.default;
function ko(e, t) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, n = (a, s) => s ? { anyOf: [a, { type: "null" }] } : a;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...n({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...n({ type: "integer", minimum: e.min, maximum: yo(e.max, t) }, e.nullable), description: e.about };
    case "image":
      return { ...n({
        type: "object",
        additionalProperties: !1,
        required: ["src", "alt"],
        properties: { src: { type: "string", minLength: 1, maxLength: 2048 }, alt: { type: "string", minLength: 1, maxLength: 240 } }
      }, !0), description: e.about };
    case "choice":
      return { enum: e.values, description: e.about };
  }
}
const xt = (e) => "optional" in e && e.optional === !0;
function pa(e) {
  const t = e ? sn(V(e)) : void 0;
  return Wn.map((o) => {
    const n = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...n.filter(([, l]) => !xt(l)).map(([l]) => l)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(n.map(([l, y]) => [l, ko(y, t)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: a };
    return t && (s.accepted = o.boards.includes(t), s.accepted || (s.refusal = o.refusals[t])), s;
  });
}
const Xe = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function bo(e, t) {
  const o = !!e.lanes[0]?.station, n = On(e.lanes, o ? Xe.step : Xe.lane, o ? "step" : "lane", t?.kind === "lane" ? t.id : void 0, !0), a = On(e.cards, o ? Xe.token : Xe.card, o ? "token" : "card", t?.kind === "card" ? t.id : void 0);
  if (!o) return { lanes: n, cards: a };
  const s = (l) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(l.trim()) ? e.cards[0] : null;
  return { lanes: n, cards: {
    find: (l) => s(l) ?? a.find(l),
    attempt: (l) => s(l) ?? a.attempt(l),
    rank: (l) => s(l) ? 0 : a.rank(l)
  } };
}
class M {
  constructor(t, o, n = null, a, s, l) {
    this.reason = t, this.code = o, this.laneId = n, this.cardId = a, this.candidates = s, this.limits = l;
  }
}
function ln(e, t) {
  return t === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, t, o = null, n) {
  try {
    return V(e);
  } catch (a) {
    throw new M(ln(a instanceof Error ? a.message : String(a), t), "refused", o, n);
  }
}
function vo(e, t) {
  for (const n of Object.keys(e)) if (n !== "kind" && !Object.prototype.hasOwnProperty.call(t.fields, n)) return t.kind + " does not take " + n + ".";
  const o = (n) => typeof n == "string" && n.trim().length > 0 || !!n && typeof n == "object" && !Array.isArray(n) && typeof n.id == "string" && Object.keys(n).length === 1;
  for (const [n, a] of Object.entries(t.fields)) {
    const s = e[n];
    if (s === void 0) {
      if (xt(a)) continue;
      return t.kind + " needs " + n + ".";
    }
    const l = t.kind + " needs " + n + " as ";
    switch (a.type) {
      case "text":
        if (typeof s != "string") return l + "text.";
        break;
      case "ref":
        if (!o(s)) return l + "an id or a name.";
        break;
      case "refs":
        if (s === null && a.nullable) break;
        if (!Array.isArray(s) || s.length > a.max || !s.every(o)) return l + "a list of up to " + a.max + " ids or names" + (a.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (s === null && a.nullable) break;
        if (typeof s != "number" || !Number.isFinite(s)) return l + "a number" + (a.nullable ? " or null." : ".");
        break;
      case "image":
        if (s === null) break;
        if (!s || typeof s != "object" || typeof s.src != "string" || typeof s.alt != "string" || Object.keys(s).some((y) => y !== "src" && y !== "alt")) return l + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(s)) return l + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function Io(e, t, o, n) {
  const a = structuredClone(e), s = o === "map", l = o === "release-plan", y = bo(a, n), b = { lane: s ? "step" : "lane", card: s ? "token" : "card" };
  function k(r, p, x, I, O = null) {
    if (typeof x == "object") {
      const z = r.find((W) => W.id === x.id);
      if (!z) throw new M("That " + I + " is no longer on the workshop.", "gone", O);
      return z;
    }
    const P = r.find((z) => z.id === x);
    if (P) return P;
    try {
      return p.find(x);
    } catch (z) {
      if (!(z instanceof nn)) throw z;
      const W = z.reason === "ambiguous" ? "ambiguous_reference" : z.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new M(z.message, W, O, void 0, z.candidates.length ? z.candidates : void 0);
    }
  }
  const c = (r, p = null) => k(a.lanes, y.lanes, r, "lane", p), m = (r, p = null) => k(a.cards, y.cards, r, "card", p), A = (r) => {
    try {
      return c(r);
    } catch {
      return null;
    }
  }, v = (r, p, x = {}, I = !0) => ({ board: r, said: p, changed: I, ...x }), E = (r) => a.cards.filter((p) => p.laneId === r).length, L = (r) => s ? "The presentation opens with " + C(r[0].label) + "." : "The presentation now runs " + r.map((p) => C(p.label)).join(", then ") + ".";
  switch (t.kind) {
    case "rename_workshop": {
      a.title = t.title;
      const r = G(a, o);
      return v(r, "Renamed the " + (s ? "map" : "workshop") + " to " + C(r.title) + ".");
    }
    case "rename_lane": {
      const r = c(t.lane), p = r.label;
      r.label = t.label;
      const x = G(a, o, r.id);
      return v(x, "Renamed " + C(p) + " to " + C(x.lanes.find((I) => I.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = m(t.card), p = r.label;
      r.label = t.label;
      const x = G(a, o, r.laneId, r.id);
      return v(x, "Renamed " + C(p) + " to " + C(x.cards.find((I) => I.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new M("A workshop can have up to five lanes. Remove one first.", "refused");
      if (t.capacity !== void 0 && (!Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > 24))
        throw new M("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Go(a, { label: t.label, ...t.capacity !== void 0 && { capacity: t.capacity } });
      } catch (x) {
        throw new M(ln(x.message, o), "refused");
      }
      const p = r.lanes[r.lanes.length - 1];
      return v(r, "Added the lane " + C(p.label) + ".", { laneId: p.id });
    }
    case "remove_lane": {
      const r = c(t.lane), p = a.cards.filter((x) => x.laneId === r.id);
      if (s) {
        if (p.length) throw new M(C(p[0].label) + " is at " + C(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A map needs at least two steps.", "refused", r.id);
      } else {
        if (p.length) throw new M(C(r.label) + " holds " + p.length + (p.length === 1 ? " card" : " cards") + ". Move or remove " + (p.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new M("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((x) => x !== r);
      for (const x of a.lanes) x.station && (x.station.next = x.station.next.filter((I) => I !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((x) => x !== r.id));
      for (const x of a.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((I) => I !== r.id));
      return en(a, (x) => x.laneId === r.id), v(G(a, o), "Removed the " + b.lane + " " + C(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = c(t.lane);
      if (s) {
        if (t.allowedLanes !== void 0) throw new M(B.mapCardLanes, "not_on_this_board", r.id);
        let P = t.label;
        if (P === void 0) {
          let Z = a.cards.length + 1;
          for (; a.cards.some((ye) => ye.label === "Token " + Z); ) Z++;
          P = "Token " + Z;
        }
        const z = new Set([...a.lanes, ...a.cards].map((Z) => Z.id));
        let W = 1;
        for (; z.has("token-" + W); ) W++;
        a.cards.push({ id: "token-" + W, label: P, laneId: r.id });
        const F = G(a, o, r.id);
        return v(F, "Added " + C(F.cards[F.cards.length - 1].label) + " at " + C(r.label) + ".", { laneId: r.id, cardId: "token-" + W });
      }
      const p = ["duration", "lag", "waitsOn", "amount"].find((P) => t[P] !== void 0 && !(o === "launch-plan" ? P !== "amount" : (o === "pipeline" || o === "budget") && P === "amount"));
      if (p) throw new M(p === "amount" ? B.notAmounts : B.notTasks, "not_on_this_board", r.id);
      if (It.includes(o)) return _(r);
      if (t.label === void 0 || !t.label.trim()) throw new M("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new M("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && E(r.id) >= r.capacity)
        throw new M(C(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const x = t.allowedLanes && [...new Set(t.allowedLanes.map((P) => c(P).id))];
      let I;
      try {
        I = Uo(a, r.id, { label: t.label, ...x && { allowedLaneIds: x } });
      } catch (P) {
        throw new M(ln(P.message, o), "refused", r.id);
      }
      const O = I.cards[I.cards.length - 1];
      return v(I, "Added " + C(O.label) + " to " + C(r.label) + ".", { laneId: r.id, cardId: O.id });
    }
    case "remove_card": {
      const r = m(t.card);
      if (s && a.cards.length === 1) throw new M("A map needs at least one token.", "refused", r.laneId, r.id);
      if (l && a.cards.length === 1) throw new M("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new M("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((p) => p !== r);
      for (const p of a.cards)
        p.dependsOn?.includes(r.id) && (p.dependsOn = p.dependsOn.filter((x) => x !== r.id), p.dependsOn.length || delete p.dependsOn);
      return en(a, (p) => p.cardId === r.id), v(G(a, o, r.laneId), "Removed the " + b.card + " " + C(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof t.lane == "object" ? a.lanes.find((I) => I.id === t.lane.id) ?? null : A(t.lane), p = m(t.card, r?.id ?? null), x = c(t.lane, p.laneId);
      return R(p, x);
    }
    case "advance_card": {
      const r = m(t.card), p = a.lanes.find((I) => I.id === r.laneId), x = p.station.next.map((I) => a.lanes.find((O) => O.id === I)).filter((I) => !!I);
      if (!x.length) throw new M(C(r.label) + " is at " + C(p.label) + ", and no path leads on from there.", "refused", p.id, r.id);
      if (x.length > 1)
        throw new M("From " + C(p.label) + " the path goes to " + x.map((I) => C(I.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", p.id, r.id);
      return R(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = c(t.lane), p = s ? "token" : l ? "point" : "card";
      if (t.capacity === null)
        return delete r.capacity, v(G(a, o, r.id), s ? "Removed the limit at " + C(r.label) + "." : C(r.label) + " now holds any number of " + p + "s.", { laneId: r.id });
      const x = l ? 576 : 24;
      if (!Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > x)
        throw new M((s ? "A step" : "A lane") + " can hold from 1 to " + x + " " + p + "s.", "refused", r.id);
      const I = l ? a.cards.reduce((O, P) => O + (P.laneId === r.id ? P.points ?? 1 : 0), 0) : E(r.id);
      if (I > t.capacity)
        throw new M(C(r.label) + " already holds " + I + " " + p + (I === 1 ? "" : "s") + ". Move some " + (s ? "on" : "out") + " first, or choose a higher " + (l ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = t.capacity, v(G(a, o, r.id), C(r.label) + " now holds up to " + t.capacity + " " + p + (t.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = m(t.card);
      if (t.lanes === null)
        return delete r.allowedLaneIds, v(G(a, o, r.laneId, r.id), C(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const p = [...new Set(t.lanes.map((I) => c(I)))], x = a.lanes.find((I) => I.id === r.laneId);
      if (!p.includes(x)) throw new M(C(r.label) + " is in " + C(x.label) + " now. Include " + C(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = p.map((I) => I.id), v(G(a, o, r.laneId, r.id), C(r.label) + " can now go only in " + $e(p.map((I) => C(I.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = m(t.card);
      if (!Number.isInteger(t.points) || t.points < 1 || t.points > 24) throw new M("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = t.points, v(G(a, o, r.laneId, r.id), C(r.label) + " now takes " + t.points + (t.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = m(t.card), p = [...new Set(t.dependsOn.map((I) => m(I)))], x = { laneId: r.laneId, cardId: r.id };
      if (t.mode === "remove") {
        const I = p.filter((O) => r.dependsOn?.includes(O.id));
        if (!I.length) throw new M(C(r.label) + " does not depend on " + $e(p.map((O) => C(O.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((O) => !I.some((P) => P.id === O)), r.dependsOn.length || delete r.dependsOn, v(G(a, o, r.laneId, r.id), C(r.label) + " no longer depends on " + $e(I.map((O) => C(O.label))) + ".", x);
      }
      if (!p.length) {
        if (t.mode === "add") throw new M("Name the features " + C(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, v(G(a, o, r.laneId, r.id), C(r.label) + " no longer depends on anything.", x);
      }
      if (p.includes(r)) throw new M("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...t.mode === "add" ? r.dependsOn ?? [] : [], ...p.map((I) => I.id)])], v(G(a, o, r.laneId, r.id), C(r.label) + " now depends on " + $e(p.map((I) => C(I.label))) + ".", x);
    }
    case "set_outcome": {
      const r = m(t.card), p = c(t.lane), x = a.signals ?? (a.signals = []), I = t.label, O = I === void 0 ? x.filter((F) => F.cardId === r.id && F.laneId === p.id) : x.filter((F) => F.cardId === r.id && F.label.toLowerCase() === I.toLowerCase());
      if (I !== void 0 && O.length > 1) throw new M("Two outcomes on this card have that name.", "refused", p.id, r.id);
      if (!O.length && x.length >= 24) throw new M("A workshop can have up to 24 outcomes. Remove one first.", "refused", p.id, r.id);
      let P = 1;
      for (; x.some((F) => F.id === "signal-" + P); ) P++;
      const W = { label: I ?? O[0]?.label ?? (r.label + " in " + p.label).slice(0, 80).trim(), cardId: r.id, laneId: p.id, whenPresent: t.whenPresent, whenAbsent: t.whenAbsent };
      return O.length ? Object.assign(O[0], W) : x.push({ id: "signal-" + P, ...W }), v(G(a, o, p.id, r.id), "When " + C(r.label) + " is in " + C(p.label) + " the workshop says " + C(t.whenPresent) + ". Otherwise it says " + C(t.whenAbsent) + ".", { laneId: p.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = m(t.card), p = (a.signals ?? []).filter((x) => x.cardId === r.id);
      if (t.outcome === void 0) {
        if (!p.length) throw new M(C(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        en(a, (x) => x.cardId === r.id);
      } else {
        const x = k(p, On(p, "outcomes?", "outcome"), t.outcome, "outcome", r.laneId);
        en(a, (I) => I.id === x.id);
      }
      return v(G(a, o, r.laneId, r.id), "Removed the outcome from " + C(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = t.lanes.map((p) => c(p));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new M("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((p) => p.id), v(G(a, o), L(r));
    }
    case "present_lane": {
      if (t.before !== void 0 && t.after !== void 0) throw new M("Say before or after, not both.", "invalid_edit");
      const r = c(t.lane), p = t.before ?? t.after, x = p === void 0 ? void 0 : c(p);
      if (x && x.id === r.id) throw new M("Choose two different scenes.", "refused", r.id);
      const I = Fn(a).filter((O) => O.id !== r.id);
      return I.splice(x ? I.findIndex((O) => O.id === x.id) + (t.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = I.map((O) => O.id), v(G(a, o, r.id), L(I), { laneId: r.id });
    }
    case "add_station": {
      const r = c(t.from);
      let p;
      try {
        p = ht(a, r.id, { label: t.label, outcome: t.outcome ?? t.label });
      } catch (I) {
        throw new M(I.message, "refused", r.id);
      }
      const x = p.lanes[p.lanes.length - 1];
      return v(p, "Added a path from " + C(r.label) + " to " + C(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = c(t.before), p = t.from === void 0 ? void 0 : c(t.from), x = p ? [p] : a.lanes.filter((P) => P.station.next.includes(r.id));
      if (p && !p.station.next.includes(r.id))
        throw new M("There is no path from " + C(p.label) + " to " + C(r.label) + ". Try “Add " + t.label + " after " + p.label + "”.", "refused", p.id);
      if (!x.length) throw new M("Nothing leads to " + C(r.label) + " yet. Try “Add " + t.label + " after " + r.label + "”.", "refused", r.id);
      let I;
      try {
        I = ht(a, x[0].id, { label: t.label, outcome: t.outcome ?? t.label });
      } catch (P) {
        throw new M(P.message, "refused", r.id);
      }
      const O = I.lanes[I.lanes.length - 1];
      for (const P of I.lanes)
        x.some((z) => z.id === P.id) && (P.station.next = [...new Set(P.station.next.map((z) => z === r.id ? O.id : z))]);
      return O.station.next = [r.id], v(G(I, o, O.id), "Added " + C(O.label) + " before " + C(r.label) + ".", { laneId: O.id });
    }
    case "connect_stations": {
      const r = c(t.from), p = c(t.to);
      if (r.id === p.id) throw new M("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(p.id) ? v(a, C(r.label) + " already leads to " + C(p.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(p.id), v(G(a, o, r.id), "Connected " + C(r.label) + " to " + C(p.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = c(t.from), p = c(t.to);
      if (!r.station.next.includes(p.id)) throw new M("There is no path between " + C(r.label) + " and " + C(p.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== p.id), v(G(a, o, r.id), "Removed the path from " + C(r.label) + " to " + C(p.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = c(t.station);
      return r.station.outcome = t.outcome, v(G(a, o, r.id), "Changed what happens at " + C(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = c(t.station);
      return Object.assign(r.station, { column: t.column, row: t.row }), v(G(a, o, r.id), "Moved " + C(r.label) + " to column " + (t.column + 1) + ", row " + (t.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = c(t.station);
      return t.image === null ? (delete r.station.image, v(G(a, o, r.id), "Removed the image at " + C(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: t.image.src, alt: t.image.alt }, v(G(a, o, r.id), "Updated the image at " + C(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = c(t.station);
      if (!r.station.image) throw new M("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = t.alt, v(G(a, o, r.id), "Updated the image description at " + C(r.label) + ".", { laneId: r.id });
    }
    case "set_task": {
      const r = m(t.card);
      if (t.duration === void 0 && t.lag === void 0) throw new M("Say how many days " + C(r.label) + " takes, or waits.", "invalid_edit", r.laneId, r.id);
      let p = a;
      for (const I of ["duration", "lag"]) {
        const O = t[I];
        if (O === void 0) continue;
        const P = Qn(p, { cardId: r.id, field: I });
        if (!Number.isInteger(O)) throw new M("A task's days are whole days.", "refused", r.laneId, r.id, void 0, P);
        const z = je(p, { cardId: r.id, field: I }, O);
        if (O < P.min || O > P.max)
          throw new M(O < P.min ? P.reasons.min : Me(z, r.id) ?? P.reasons.max, "refused", r.laneId, r.id, void 0, P);
        p = z;
      }
      const x = p.cards.find((I) => I.id === r.id);
      return v(G(p, o, r.laneId, r.id), C(r.label) + " now takes " + x.duration + (x.duration === 1 ? " day" : " days") + (x.lag ? " and waits " + x.lag + (x.lag === 1 ? " day." : " days.") : "."), { laneId: r.laneId, cardId: r.id });
    }
    case "link_tasks":
    case "unlink_tasks": {
      const r = m(t.card), p = m(t.waitsOn), x = { laneId: r.laneId, cardId: r.id };
      if (t.kind === "unlink_tasks") {
        if (!r.dependsOn?.includes(p.id)) throw new M(C(r.label) + " doesn’t wait on " + C(p.label) + ".", "refused", r.laneId, r.id);
        return v(G(Cn(a, r.id, p.id, !0), o, r.laneId, r.id), C(r.label) + " no longer waits on " + C(p.label) + ".", x);
      }
      const I = eo(a, r.id, p.id);
      if (I) throw new M(I, "refused", r.laneId, r.id);
      return v(G(Cn(a, r.id, p.id), o, r.laneId, r.id), C(r.label) + " now waits on " + C(p.label) + ".", x);
    }
    case "set_launch_day": {
      const r = Qn(a, { field: "day" });
      if (!Number.isInteger(t.day) || t.day < r.min || t.day > r.max) {
        const p = je(a, { field: "day" }, t.day);
        throw new M(t.day < r.min && Me(p) || (t.day < r.min ? r.reasons.min : r.reasons.max), "refused", null, void 0, void 0, r);
      }
      return v(G(je(a, { field: "day" }, t.day), o), "Launch is now day " + t.day + ".");
    }
    case "set_amount": {
      const r = m(t.card), p = a.forecast?.currency ?? a.budget?.currency;
      let x = Xn(a, { field: "amount" });
      if (o === "budget") {
        const I = a.lanes.find((P) => P.id === r.laneId), O = I.allocation - Ce(a, I.id) + (r.amount ?? 0);
        if (x = { field: "amount", min: 1, max: O, reasons: { min: "A line item costs something.", max: C(I.label) + " has " + q(O, p) + " for it." } }, t.amount > O) throw new M(I.label + " has " + q(O - (r.amount ?? 0), p) + " left. " + r.label + " costs " + q(t.amount, p) + ".", "refused", I.id, r.id, void 0, x);
      }
      if (!Number.isInteger(t.amount) || t.amount < x.min || t.amount > x.max)
        throw new M(t.amount < x.min ? x.reasons.min : x.reasons.max, "refused", r.laneId, r.id, void 0, x);
      return r.amount = t.amount, v(G(a, o, r.laneId, r.id), C(r.label) + " is now " + q(t.amount, p) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_target": {
      const r = Xn(a, { field: "target" });
      if (!Number.isInteger(t.amount) || t.amount < 1 || t.amount > r.max) throw new M(t.amount < 1 ? r.reasons.min : r.reasons.max, "refused", null, void 0, void 0, r);
      return a.forecast.target = t.amount, v(G(a, o), "The target is now " + q(t.amount, a.forecast.currency) + ".");
    }
    case "shift_budget": {
      const r = c(t.from), p = c(t.to), x = co(a, r.id, p.id, t.amount);
      if (x) throw new M(x, "refused", r.id, void 0, void 0, r.id === p.id ? void 0 : Mn(a, r.id, p.id));
      return v(G(lo(a, r.id, p.id, t.amount), o, p.id), "Moved " + q(t.amount, a.budget.currency) + " from " + C(r.label) + " to " + C(p.label) + ".", { laneId: p.id });
    }
  }
  function _(r) {
    if (t.kind !== "add_card") throw new Error("add_card only");
    const p = t.label?.trim();
    if (!p) throw new M("Say what the card should say, such as “Add Docs to " + r.label + "”.", "refused", r.id);
    const x = new Set([...a.lanes, ...a.cards].map((F) => F.id));
    let I = 1;
    for (; x.has("card-" + I); ) I++;
    const O = { id: "card-" + I, label: p, laneId: r.id }, P = a.forecast?.currency ?? a.budget?.currency;
    if (o === "launch-plan") {
      O.duration = t.duration ?? 2, t.lag && (O.lag = t.lag);
      const F = [...new Set((t.waitsOn ?? []).map((Z) => m(Z).id))];
      F.length && (O.dependsOn = F);
    } else t.amount !== void 0 && (O.amount = t.amount);
    if (o === "budget" && t.amount === void 0) throw new M("Give the line item a cost, like 'Contractor $45k'.", "refused", r.id);
    if (o === "pipeline" && r.role) throw new M("A new deal starts in an open stage, not in " + r.label + ".", "refused", r.id);
    const z = a.cards.filter((F) => F.laneId === r.id);
    if (o === "pipeline" && r.capacity !== void 0 && z.length >= r.capacity) throw new M(r.label + " already holds " + z.length + " of " + r.capacity + " deals.", "refused", r.id);
    if (o === "budget") {
      const F = r.allocation - Ce(a, r.id);
      if (O.amount > F) throw new M(r.label + " has " + q(F, P) + " left. " + p + " costs " + q(O.amount, P) + ".", "refused", r.id);
    }
    const W = { ...a, cards: [...a.cards, O] };
    if (o === "launch-plan") {
      const F = Me(W, O.id);
      if (F) throw new M(F, "refused", r.id);
    }
    return v(G(W, o, r.id), "Added " + C(p) + " to " + C(r.label) + ".", { laneId: r.id, cardId: O.id });
  }
  function R(r, p) {
    const x = { laneId: p.id, cardId: r.id };
    if (r.laneId === p.id)
      return v(e, C(r.label) + " is already " + (s ? "at " : "in ") + C(p.label) + ".", x, !1);
    const I = Re(e, r.id, p.id);
    if (!I) throw new M(tn(e, r.id, p.id) ?? "That move is not available.", "refused", p.id, r.id);
    return v(G(I, o, p.id, r.id), "Moved " + C(r.label) + " to " + C(p.label) + ".", x);
  }
}
function en(e, t) {
  e.signals && (e.signals = e.signals.filter((o) => !t(o)), e.signals.length || delete e.signals);
}
function He(e, t, o = {}) {
  const n = (k) => ({ refused: { index: 0, kind: null, laneId: null, ...k } });
  let a;
  try {
    a = V(e);
  } catch (k) {
    return n({ reason: "The workshop cannot be read: " + (k instanceof Error ? k.message : String(k)), code: "invalid_board" });
  }
  if (!Array.isArray(t) || t.length < 1 || t.length > 50) return n({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = a, l = [];
  for (const [k, c] of t.entries()) {
    const m = c?.kind, A = typeof m == "string" ? go.get(m) : void 0;
    if (!c || typeof c != "object" || !A)
      return n({
        index: k,
        kind: typeof m == "string" ? m : null,
        code: "invalid_edit",
        reason: "There is no edit called " + C(String(m)) + ". The edits are " + $e(Wn.map((R) => R.kind)) + "."
      });
    const v = vo(c, A);
    if (v) return n({ index: k, kind: A.kind, code: "invalid_edit", reason: v });
    const E = sn(a);
    if (!A.boards.includes(E))
      return n({ index: k, kind: A.kind, code: "not_on_this_board", reason: A.refusals[E] ?? "This workshop does not take " + A.kind + "." });
    let L;
    try {
      L = Io(a, c, E, o.selection);
    } catch (R) {
      if (!(R instanceof M)) throw R;
      return n({
        index: k,
        kind: A.kind,
        reason: R.reason,
        code: R.code,
        laneId: R.laneId,
        ...R.cardId && { cardId: R.cardId },
        ...R.candidates && { candidates: R.candidates },
        ...R.limits && { limits: R.limits }
      });
    }
    const _ = $o(a, L.board);
    if (_) return n({ index: k, kind: A.kind, reason: _, code: "not_on_this_board", laneId: L.laneId ?? null });
    a = L.board, l.push({
      index: k,
      kind: A.kind,
      said: L.said,
      changed: L.changed ?? !0,
      ...L.laneId && { laneId: L.laneId },
      ...L.cardId && { cardId: L.cardId }
    });
  }
  const y = new Map(s.cards.map((k) => [k.id, k.laneId])), b = a.cards.flatMap((k) => {
    const c = y.get(k.id);
    return c === void 0 || c === k.laneId ? [] : [{ cardId: k.id, fromLaneId: c, toLaneId: k.laneId }];
  });
  return { workshop: a, report: { edits: l, movedCards: b } };
}
const xo = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget"
};
function $o(e, t) {
  const o = V(e), n = sn(o);
  let a;
  try {
    a = V(t);
  } catch (b) {
    return ln(b instanceof Error ? b.message : String(b), n);
  }
  const s = sn(a), l = (b, k) => b.lanes.length === k.lanes.length && b.lanes.every((c) => k.lanes.some((m) => m.id === c.id)), y = (b, k) => b.lanes.every((c, m) => k.lanes[m]?.id === c.id);
  if ((n === "customer-interviews" || n === "experiment-budget") && s !== n)
    return l(o, a) ? B.keepsCards : B.keepsLanes;
  if ((n === "customer-interviews" || n === "experiment-budget") && !y(o, a)) return B.keepsOrder;
  if (ie(o) && s === n && !(l(o, a) && y(o, a))) return Tn[n];
  if (n === "release-plan" && s === "release-plan") {
    if (!l(o, a)) return B.releaseLanes;
    if (!y(o, a)) return B.releaseOrder;
    if (a.cards.some((b) => !o.cards.some((k) => k.id === b.id))) return B.releaseCards;
  }
  return n !== s ? "This slate holds a " + xo[n] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
const ma = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function wa(e) {
  if (!e || typeof e != "object") return null;
  const t = e;
  if (t.kind !== "moon-gallery" || t.version !== 1 || !Array.isArray(t.panels) || t.panels.length !== 3 || !Array.isArray(t.hung)) return null;
  const o = [];
  for (const s of t.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    o.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const n = new Map(o.map((s) => [s.id, s])), a = [...new Set(t.hung)];
  if (n.size !== o.length || a.length !== t.hung.length || a.some((s) => !n.has(s))) return null;
  for (const s of o) {
    const l = /* @__PURE__ */ new Set([s.id]);
    let y = s.after;
    for (; y !== null; ) {
      if (l.has(y) || !n.has(y) || a.includes(s.id) && !a.includes(y)) return null;
      l.add(y), y = n.get(y).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function Ao(e, t) {
  const o = e.panels.find((n) => n.id === t);
  return !!o && !e.hung.includes(t) && (o.after === null || e.hung.includes(o.after));
}
function ga(e, t) {
  return Ao(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const $t = ["firstPrint", "secondPrint", "thirdPrint"], At = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function ya(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...At, route: t.route };
  for (const n of $t) {
    const a = t[n];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[n] = a.trim();
  }
  return o;
}
function ka(e = new URLSearchParams()) {
  const t = { ...At };
  for (const n of $t) {
    const a = e.get(n)?.trim();
    a && a.length <= 48 && (t[n] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (t.route = o), t;
}
function ba(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function So(e) {
  const t = { ...e };
  return e.xPos !== void 0 && t.x === void 0 && (t.x = e.xPos, delete t.xPos), e.yPos !== void 0 && t.y === void 0 && (t.y = e.yPos, delete t.yPos), e.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = e.foregroundColor, delete t.foregroundColor), e.shapeHint !== void 0 && t.shape === void 0 && (t.shape = Po(e.shapeHint), delete t.shapeHint), e.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = e.svgString, delete t.svgString), e.blnStraight !== void 0 && (t.isStraightLine = e.blnStraight, delete t.blnStraight), Oo(t), t;
}
function Co(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.width !== void 0 || t.height !== void 0;
}
function Oo(e) {
  return e && Co(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function at(e) {
  const t = { ...e };
  return t.xPos = e.x, t.yPos = e.y, t.foregroundColor = e.fontColor, e.shape && (t.shapeHint = e.shape), e.svgContent && (t.svgString = e.svgContent), t;
}
function To(e) {
  return {
    id: e.id || `${e.parentId}->${e.childId}`,
    childId: e.childId,
    parentId: e.parentId,
    isStraightLine: e.isStraightLine ?? e.blnStraight ?? !1,
    lineColor: e.lineColor || "#666666",
    lineEffect: e.lineEffect || "",
    lineDash: e.lineDash === "dashed" || e.lineDash === "dotted" ? e.lineDash : "solid",
    lineOpacity: e.lineOpacity ?? 1,
    lineType: e.lineType || "bezier",
    lineCurveType: e.lineCurveType || "cubic",
    lineCurviness: e.lineCurviness ?? 0.1,
    lineWidth: e.lineWidth ?? 3,
    showParentArrow: e.showParentArrow ?? !1,
    showChildArrow: e.showChildArrow ?? !0,
    sourcePoint: e.sourcePoint ?? null,
    targetPoint: e.targetPoint ?? null,
    sourceAnchor: e.sourceAnchor ?? null,
    targetAnchor: e.targetAnchor ?? null,
    label: e.label ?? ""
  };
}
function Po(e) {
  return {
    rect: "rectangle",
    rectangle: "rectangle",
    roundedrectangle: "roundedrectangle",
    ellipse: "ellipse",
    circle: "circle",
    star: "star",
    trapezium: "trapezium",
    triangle: "triangle",
    pentagon: "pentagon",
    parallelogram: "parallelogram",
    octagon: "octagon",
    hexagon: "hexagon",
    rarrow: "rarrow",
    larrow: "larrow"
  }[e.toLowerCase()] || e;
}
function $n() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const rt = "#1f7a5c", st = "#5b9a85", An = "#c2410c", Lo = "#2f5fd0", Eo = { canMove: !1, canSelect: !1 };
function No(e) {
  const t = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return t ? { kind: t[1], key: t[2] } : null;
}
function va(e, t, o = {}) {
  let n = V(t);
  const a = o.kit;
  if (ie(n) && !a) throw new Error(`A ${n.kind} board needs its kit: pass kit: kitFor('${n.kind}') from slateboxjs/boards.`);
  const s = a?.layer(e);
  let l = null, y = null, b = !!o.readOnly, k = !1;
  const c = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), E = /* @__PURE__ */ new Map();
  let L = null, _ = null, R = null;
  const r = /* @__PURE__ */ new Map(), p = /* @__PURE__ */ new Map();
  let x = null, I = Promise.resolve(), O = null, P = lt(o.layout);
  const z = { ...o.style };
  let W = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Set(), Z = null, ye = !1;
  Oe(n);
  const J = o.origin ? { x: o.origin.x, y: o.origin.y } : _o(e), le = (i) => E.get(i) ?? i, Q = (i) => No(le(i));
  function K(i) {
    const u = v.get(i);
    if (u) return u;
    if (c.has(i) && !E.has(i) || !e.nodes.one?.(i)) return i;
    const h = Rt(i, (g) => !!e.nodes.one?.(g) || E.has(g));
    return v.set(i, h), E.set(h, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${h}".`), h;
  }
  const ce = {
    governs(i) {
      if (c.get(i.id) !== i) return null;
      const u = Q(i.id)?.kind;
      return u === "card" ? { canMove: !b, canEditText: !b && !y && n.kind !== "release-plan" } : u === "lane" ? { canMove: !1, canEditText: !b && !y } : u === "handle" ? { canMove: !b && !y, canEditText: !1 } : Eo;
    },
    onStart(i, u) {
      const h = Q(i.id), g = { x: u.x - (i.options.x ?? 0), y: u.y - (i.options.y ?? 0) };
      if (h.kind === "handle") {
        const f = !b && !y && a ? a.handleDrag(n, le(i.id), g, P) : null;
        return f ? (X(), Ie(), l = { name: le(i.id), follow: f, last: null }, !0) : !1;
      }
      const S = h.key;
      if (b || y || !n.cards.some((f) => f.id === S)) return !1;
      X(), Ie();
      let d = null;
      try {
        d = (a?.chooser ?? o.chooseCandidate)?.(n, S, g, P) ?? null;
      } catch (f) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", f);
      }
      return L = { cardId: S, evaluate: d, grab: g, outcome: { kind: "home" } }, D(n, { skip: S }), !0;
    },
    onMove(i, u) {
      if (l) {
        l.last = l.follow(kn(u)), D(l.last.next, { grip: l.name }), U(o.onPreview, l.last.next === n ? null : l.last.next);
        return;
      }
      if (!L) return;
      const h = jn(L.cardId, u, L.evaluate);
      if (Mo(h, L.outcome)) return;
      L.outcome = h;
      const g = h.kind === "candidate" ? h.next : null;
      D(g ?? n, { skip: L.cardId }), U(o.onPreview, g);
    },
    onEnd(i, u) {
      if (l) {
        const { follow: f, name: w } = l, $ = f(kn(u));
        l = null, U(o.onPreview, null), $.refusal ? (D(n), e.announce?.($.refusal), U(o.onRefuse, { laneId: null, reason: $.refusal })) : Ze($.next, {}) || D(n);
        const N = bn(n, w);
        return N ? { accept: !0, settle: N } : { accept: !1 };
      }
      if (!L) return { accept: !1 };
      const { cardId: h, evaluate: g } = L, S = jn(h, u, g), d = n.cards.find((f) => f.id === h);
      if (L = null, U(o.onPreview, null), S.kind === "candidate" && a) {
        if (!Ze(S.next, { cardId: h, laneId: S.laneId }, h))
          return D(n, { skip: h }), { accept: !1 };
        const f = bn(n, le(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (S.kind === "candidate") {
        n = S.next, D(n, { skip: h });
        const f = n.lanes.find(($) => $.id === S.laneId);
        e.announce?.(`${d.label} moved to ${f.label}. ${ge(n, f.id)}.`), U(o.onChange, n, { cardId: h, laneId: S.laneId });
        const w = bn(n, le(i.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (S.kind === "refused")
        Ut(d.label, { cardId: h, laneId: S.laneId, reason: S.reason });
      else if (S.kind === "outside" && on(n) && !Ke()) {
        const f = an(n, h);
        if (!f)
          return yn(h, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        D(n, { skip: h }), e.announce?.(f), U(o.onRefuse, { cardId: h, laneId: null, reason: f });
      } else
        D(n, { skip: h }), S.kind === "outside" && (e.announce?.(`${d.label} was not dropped on a lane. It stays where it was.`), U(o.onRefuse, { cardId: h, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (l) {
        l = null, U(o.onPreview, null), D(n);
        return;
      }
      const u = L && n.cards.find((h) => h.id === L.cardId);
      L = null, U(o.onPreview, null), D(n, { skip: Q(i.id)?.key }), u && e.announce?.(`Move cancelled. ${u.label} stays where it was.`);
    },
    onTextCommit(i, u, h) {
      const g = Q(i.id);
      if (!g || b || y) return !1;
      let S = u.replace(/\s+/g, " ").trim();
      const d = [], f = ie(n) && g.kind === "card" ? wt(S) : null;
      f?.label && (S = f.label, f.days !== void 0 && n.kind === "launch-plan" && d.push({ kind: "set_task", card: { id: g.key }, duration: f.days }), f.amount !== void 0 && n.kind !== "launch-plan" && d.push({ kind: "set_amount", card: { id: g.key }, amount: f.amount }));
      const w = g.kind === "lane" ? { laneId: g.key, label: S } : { cardId: g.key, label: S };
      d.unshift(g.kind === "lane" ? { kind: "rename_lane", lane: { id: g.key }, label: S } : { kind: "rename_card", card: { id: g.key }, label: S });
      const $ = He(n, d);
      if ("refused" in $) {
        const { reason: N } = $.refused;
        return e.announce?.(`${h} keeps its name. ${N}`), U(o.onRefuse, { ...g.kind === "lane" ? { laneId: g.key } : { cardId: g.key }, rename: w, reason: N }), !1;
      }
      return JSON.stringify($.workshop) === JSON.stringify(n) ? (D(n), !1) : (n = $.workshop, D(n), e.announce?.(f ? $.report.edits.map((N) => N.said).join(" ") : `${h} renamed to ${S}.`), U(o.onChange, n, { rename: w, ...a ? { edits: d } : {} }), f ? !1 : S);
    },
    onKeyDown(i, u) {
      const h = Q(i.id);
      if (b || y || L || l || u.ctrlKey || u.metaKey || u.altKey) return !1;
      const g = a?.keyEdit?.(n, le(i.id), { key: u.key, shiftKey: u.shiftKey });
      if (g) {
        u.preventDefault();
        const d = He(n, g);
        return "refused" in d ? (e.announce?.(d.refused.reason), U(o.onRefuse, { laneId: d.refused.laneId, ...h?.kind === "card" ? { cardId: h.key } : {}, reason: d.refused.reason })) : Ze(d.workshop, h?.kind === "card" ? { cardId: h.key } : {}), !0;
      }
      if (h?.kind !== "card") return !1;
      const S = n.cards.find((d) => d.id === h.key);
      if (!S) return !1;
      if (u.key === "ArrowLeft" || u.key === "ArrowRight")
        return u.preventDefault(), Gn(S.id, u.key === "ArrowLeft" ? -1 : 1), !0;
      if ((u.key === "ArrowUp" || u.key === "ArrowDown") && Bt())
        return u.preventDefault(), Gn(S.id, u.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (_?.cardId !== S.id) return !1;
      if (u.key === "Enter") {
        u.preventDefault();
        const { laneId: d, next: f, spot: w } = _;
        if (_ = null, d === null)
          return U(o.onPreview, null), yn(S.id, w), !0;
        const $ = n;
        n = f, D(n), ve(d), U(o.onPreview, null);
        const N = n.lanes.find((T) => T.id === d);
        return e.announce?.(`${S.label} moved to ${N.label}. ${ge(n, d)}.`), U(o.onChange, n, { cardId: S.id, laneId: d, ...a ? { edits: a.editsBetween($, n) } : {} }), !0;
      }
      return u.key === "Escape" ? (u.preventDefault(), Ie(), e.announce?.(`Move cancelled. ${S.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((u) => c.get(u.id) === u).map((u) => u.id);
      ye = i.length === 1, c.clear(), m.clear(), A.clear(), v.clear(), E.clear(), L = null, _ = null, D(y ?? n, { animate: !1 }), i.length === 1 && (I = I.then(() => {
        ye = !1;
        const u = c.get(i[0]);
        if (!k && u && !(e.getSelectedNodes?.() ?? []).length) {
          const h = () => e.selectNodes?.([u]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(h) : h();
        }
        pn();
      }));
    }
  };
  ce.onFreeMove = (i, u) => {
    if (!qe() || i.options?.isComment) return mn();
    const h = Je(u), g = Ye(i), S = n.lanes.filter((f) => !ze(i) && Ee(n, f.id, g) === null).map((f) => f.id), d = h ? ze(i) ?? Ee(n, h, g) : null;
    R && R.noteId === i.id && R.laneId === h && R.refusal === d || (R = { noteId: i.id, laneId: h, refusal: d, open: S }, xe());
  }, ce.onFreeDrop = (i, u, h) => {
    if (mn(), !qe() || i.options?.isComment) return;
    const g = Je(u);
    if (!g) return;
    const S = Ye(i), d = n.lanes.find((w) => w.id === g), f = ze(i) ?? Ee(n, g, S);
    return f ? (X(!1), x = { laneId: g, reason: f, timer: setTimeout(() => X(), 1500) }, xe(), e.announce?.(`${wn(S.label)} can't go in ${d.label}. ${f}`), U(o.onRefuse, { noteId: i.id, laneId: g, reason: f }), "refused") : (gn([{ node: i, offer: S, from: h }], g), "taken");
  }, ce.onFreeGroupDrop = (i, u, h) => {
    if (mn(), !qe() || i.some((w) => w.options?.isComment)) return;
    const g = Je(u);
    if (!g) return;
    const S = n.lanes.find((w) => w.id === g), d = i.map((w) => ({ node: w, offer: Ye(w) })), f = Dt(d, g);
    if (f) {
      X(!1), x = { laneId: g, reason: f, timer: setTimeout(() => X(), 1500) }, xe(), e.announce?.(`${Un(d.map((w) => wn(w.offer.label)))} can't go in ${S.label}. ${f}`);
      for (const { node: w } of d) U(o.onRefuse, { noteId: w.id, laneId: g, reason: f });
      return "refused";
    }
    return gn(d.map((w, $) => ({ ...w, from: h?.[$] })), g), "taken";
  }, ce.onFreeTextCommit = (i) => {
    if (!qe() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const u = i.options ?? {}, h = Je({ x: (u.x ?? 0) + (u.width ?? 0) / 2, y: (u.y ?? 0) + (u.height ?? 0) / 2 });
    if (!h) return;
    const g = Ye(i), S = n.lanes.find((N) => N.id === h), d = ze(i) ?? Ee(n, h, g);
    if (!d) {
      gn([{ node: i, offer: g }], h);
      return;
    }
    X(!1), x = { laneId: h, reason: d, timer: setTimeout(() => X(), 1500) }, xe(), e.announce?.(`${wn(g.label)} can't go in ${S.label}. ${d} It is beside the board.`), U(o.onRefuse, { noteId: i.id, laneId: h, reason: d });
    const { width: f } = Oe(n), w = Math.round(J.x + f + 32), $ = Math.round(u.y ?? J.y);
    i.position(w, $, () => e.updateSelectionResizeRotate?.(), void 0, $n() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [at({ ...i.options, x: w, y: $ })] });
  }, ce.undoState = () => ({ cards: n.cards.map((i) => ({ ...i })), pairs: [...r] }), ce.onUndoRestore = (i, u) => {
    if (k) return;
    const h = new Map((i?.cards ?? []).map((d) => [d.id, d])), g = new Map(i?.pairs ?? []), S = (d) => r.get(d) ?? g.get(d) ?? d;
    for (const d of u.added) {
      const f = S(d), w = n.cards.find(($) => $.id === f);
      w && (n = V({ ...n, cards: n.cards.filter(($) => $ !== w) }), D(n), it(U(o.onChange, n, { cardId: f, cardToNote: { noteId: d } })));
    }
    for (const d of u.removed) {
      const f = S(d), w = h.get(f);
      if (!w || n.cards.some((H) => H.id === f)) continue;
      const $ = { id: f, label: w.label, ...w.look ? { look: w.look } : {}, ...w.asNote ? { asNote: w.asNote } : {} }, N = [w.laneId, ...n.lanes.map((H) => H.id)].find((H) => Be(n, H, $));
      if (!N) {
        e.announce?.(`${w.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      n = jt(Be(n, N, $), f, i?.cards ?? []), f !== d && r.set(d, f), D(n);
      const T = n.cards.findIndex((H) => H.id === f), j = n.cards.slice(T + 1).find((H) => H.laneId === N)?.id;
      it(U(o.onChange, n, { cardId: f, laneId: N, noteToCard: {
        noteId: d,
        label: w.label,
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {},
        ...j ? { before: j } : {}
      } }));
    }
  };
  const zt = e.setDragPolicy(ce), Ft = o.onSelect && e.onSelectionChange?.(() => pn()), Dn = () => {
    _ && Ie();
  };
  e.element?.addEventListener?.("pointerdown", Dn, !0), D(n, { animate: !1 });
  function jn(i, u, h) {
    const g = n.cards.find((T) => T.id === i);
    if (!g) return { kind: "outside" };
    if (a) {
      const T = kn(u), j = a.refusalAt(n, i, L?.grab ?? { x: 0, y: 0 }, T, P);
      if (j) return { kind: "refused", ...j };
      const { width: H, height: re } = Oe(n);
      if (T.x < -40 || T.y < -40 || T.x > H + 40 || T.y > re + 40) return { kind: "outside" };
      let ee = n;
      try {
        ee = h?.(T) ?? n;
      } catch (Pe) {
        console.warn("WORKSHOP: the board kit's chooser threw", Pe);
      }
      return JSON.stringify(ee) === JSON.stringify(n) ? { kind: "home" } : { kind: "candidate", laneId: ee.cards.find((Pe) => Pe.id === i)?.laneId ?? g.laneId, next: ee };
    }
    const S = n.lanes.map((T) => c.get(K(te.column(T.id)))).filter(Boolean), d = e.hitTestNodes(u, S, { padding: 6 }), f = d ? Q(d.id).key : null;
    if (!f) return { kind: "outside" };
    if (f === g.laneId) return { kind: "home" };
    const w = Re(n, i, f);
    if (!w) return { kind: "refused", laneId: f, reason: tn(n, i, f) ?? "That move is not available." };
    if (!h) return { kind: "candidate", laneId: f, next: w };
    let $ = null;
    try {
      $ = h({ x: u.x - J.x, y: u.y - J.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: f, next: w };
    }
    const N = $?.cards.find((T) => T.id === i)?.laneId;
    return !$ || !N || N === g.laneId ? { kind: "home" } : { kind: "candidate", laneId: N, next: $ };
  }
  function Bt() {
    return a ? !1 : new Set(Ne(n, { layout: P }).places.map((i) => i.row)).size > 1;
  }
  function Gn(i, u, h = !1) {
    const g = n.cards.find((T) => T.id === i), S = ut(n, i), d = _?.cardId === i && _.laneId === null ? _.side : void 0;
    if (d !== void 0) {
      if (h || u === d) return;
      const T = d > 0 ? n.lanes[n.lanes.length - 1] : n.lanes[0];
      if (Ie(), T.id === g.laneId) {
        ve(T.id, y ?? n), e.announce?.(`${g.label} is back in ${T.label}.`);
        return;
      }
      if (S.includes(T)) {
        const H = Re(n, i, T.id);
        _ = { cardId: i, laneId: T.id, next: H }, D(H), ve(T.id, H), U(o.onPreview, H), e.announce?.(`${g.label} to ${T.label}: ${ge(H, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const j = tn(n, i, T.id) ?? "That move is not available.";
      X(), x = { laneId: T.id, reason: j, timer: setTimeout(() => X(), 1500) }, D(y ?? n), ve(T.id, y ?? n), e.announce?.(`${g.label} can't move to ${T.label}. ${j}`), U(o.onRefuse, { cardId: i, laneId: T.id, reason: j });
      return;
    }
    const f = _?.cardId === i ? _.laneId : g.laneId;
    let w;
    if (h) {
      const { places: T } = Ne(n, { layout: P }), j = T.find((H) => H.laneId === f);
      w = T.filter((H) => H.column === j.column && (H.row - j.row) * u > 0).sort((H, re) => (H.row - re.row) * u).map((H) => n.lanes.find((re) => re.id === H.laneId));
    } else {
      const T = n.lanes.findIndex((j) => j.id === f);
      w = u > 0 ? n.lanes.slice(T + 1) : n.lanes.slice(0, T).reverse();
    }
    const $ = w.find((T) => S.includes(T));
    if (X(), !$) {
      const T = w[0];
      if (!T) {
        if (!h && on(n)) {
          const H = an(n, i);
          if (H) {
            e.announce?.(H), U(o.onRefuse, { cardId: i, laneId: null, reason: H });
            return;
          }
          Ht(g, u);
          return;
        }
        e.announce?.(`${g.label} has no lane to move to on that side.`);
        return;
      }
      const j = tn(n, i, T.id) ?? "That move is not available.";
      x = { laneId: T.id, reason: j, timer: setTimeout(() => X(), 1500) }, D(_?.next ?? y ?? n), ve(T.id, _?.next ?? y ?? n), e.announce?.(`${g.label} can't move to ${T.label}. ${j}`), U(o.onRefuse, { cardId: i, laneId: T.id, reason: j });
      return;
    }
    if ($.id === g.laneId) {
      Ie(), ve($.id, y ?? n), e.announce?.(`${g.label} is back in ${$.label}.`);
      return;
    }
    const N = Re(n, i, $.id);
    _ = { cardId: i, laneId: $.id, next: N }, D(N), ve($.id, N), U(o.onPreview, N), e.announce?.(`${g.label} to ${$.label}: ${ge(N, $.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function ve(i, u = n) {
    const h = a ? qt(u, te.column(i)) : Ne(u, { layout: P, rows: Jn() }).places.find(($) => $.laneId === i), g = e.canvas?.viewbox?.();
    if (!h || !g || !(g.width > 0) || !(g.height > 0)) return;
    const S = 16, d = ($, N, T, j) => N + S * 2 >= j || $ - S < T ? $ - S - T : $ + N + S > T + j ? $ + N + S - (T + j) : 0, f = d(J.x + h.x, h.width, g.x, g.width), w = d(J.y + h.y, h.height, g.y, g.height);
    (f || w) && e.panBy?.({ x: f, y: w });
  }
  function pn() {
    if (!o.onSelect || ye) return;
    const i = k ? [] : e.getSelectedNodes?.() ?? [], u = i.length === 1 && c.get(i[0].id) === i[0] ? Q(i[0].id) : null, h = u?.kind === "card" ? { cardId: u.key } : u?.kind === "lane" ? { laneId: u.key } : null, g = h ? JSON.stringify(h) : null;
    g !== Z && (Z = g, U(o.onSelect, h));
  }
  function Ie() {
    _ && (_ = null, U(o.onPreview, null), D(y ?? n));
  }
  function Ht(i, u) {
    const { width: h } = Oe(n), g = c.get(K(te.card(i.id)))?.options, S = g?.width ?? 228, d = { x: u > 0 ? J.x + h + 32 : J.x - S - 32, y: g?.y ?? J.y }, f = ft(n, i.id);
    _ = { cardId: i.id, laneId: null, side: u, spot: d, next: n }, D(n), U(o.onPreview, f), e.announce?.(`${i.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ke() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function qe() {
    return !k && !b && !y && !L && !Ke() && on(n);
  }
  function mn() {
    R && (R = null, k || xe());
  }
  function Je(i) {
    const u = n.lanes.map((g) => c.get(K(te.column(g.id)))).filter(Boolean), h = e.hitTestNodes(i, u, { padding: 6 });
    return h ? Q(h.id)?.key ?? null : null;
  }
  function Ye(i) {
    const u = i.options ?? {}, h = Bo({
      backgroundColor: u.backgroundColor,
      textColor: u.fontColor,
      fontFamily: u.fontFamily,
      fontSize: u.fontSize,
      borderColor: u.borderColor,
      borderWidth: u.borderWidth
    }), g = String(u.text ?? ""), S = g.replace(/\s+/g, " ").trim(), d = {};
    g.trim() !== S && g.length <= 400 && (d.text = g.trim()), typeof u.shape == "string" && /^[a-z]{1,24}$/i.test(u.shape) && (d.shape = u.shape);
    for (const f of ["width", "height"]) Number.isFinite(u[f]) && u[f] >= 10 && u[f] <= 4e3 && (d[f] = Math.round(u[f]));
    return { id: i.id, label: S, ...h ? { look: h } : {}, ...Object.keys(d).length ? { asNote: d } : {} };
  }
  function Un(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Dt(i, u) {
    for (const { node: d } of i) {
      const f = ze(d);
      if (f) return f;
    }
    const h = n.lanes.find((d) => d.id === u), g = n.cards.filter((d) => d.laneId === u).length;
    if (h.capacity !== void 0 && g + i.length > h.capacity) {
      const d = h.capacity - g;
      return d > 0 ? `It has room for ${d} more ${d === 1 ? "card" : "cards"}.` : `It already holds ${g} of ${h.capacity} ${h.capacity === 1 ? "card" : "cards"}.`;
    }
    let S = n;
    for (const { offer: d } of i) {
      const f = Ee(S, u, d);
      if (f) return f;
      S = Be(S, u, d);
    }
    return null;
  }
  function ze(i) {
    return (i.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((h) => h !== i && (h.relationships?.associations ?? []).some((g) => g.child === i || g.childId === i.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : i.options?.image ? "A note with a picture stays a note." : i.options?.link?.show && i.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const wn = (i) => i || "This note";
  function gn(i, u) {
    let h = n;
    const g = i.map(({ node: f, offer: w, from: $ }) => {
      h = Be(h, u, w);
      const N = { ...f.options ?? {}, ...$ ? { x: $.x, y: $.y } : {} };
      return { node: f, card: h.cards[h.cards.length - 1], kept: N };
    });
    e.beginHostStep?.(), n = h;
    let S = n;
    for (const { node: f, card: w } of g)
      w.id !== f.id && r.set(f.id, w.id), p.set(K(te.card(w.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), Ve(() => e.removeNode(f.id));
    e.endHostStep?.(), D(n), Gt(K(te.card(g[0].card.id)));
    const d = n.lanes.find((f) => f.id === u);
    e.announce?.(g.length === 1 ? `${g[0].card.label} is now a card in ${d.label}. ${ge(n, u)}.` : `${Un(g.map(({ card: f }) => f.label))} are now cards in ${d.label}. ${ge(n, u)}.`);
    for (const { node: f, card: w, kept: $ } of g) {
      const N = { cardId: w.id, laneId: u, noteToCard: {
        noteId: f.id,
        label: w.label,
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {}
      } }, T = () => {
        n !== S || !n.cards.some((j) => j.id === w.id) || (n = V({ ...n, cards: n.cards.filter((j) => j.id !== w.id) }), S = n, D(n));
      };
      Kn(U(o.onChange, n, N), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!k) {
          if (T(), !e.nodes.one($.id)) {
            e.beginHostStep?.();
            const j = Ve(() => e.addNode({ ...$ }));
            j && (j.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${w.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        k || (T(), e.announce?.(`Someone else put ${w.label} on the board first.`));
      });
    }
  }
  function yn(i, u) {
    const h = n.cards.find((ne) => ne.id === i), g = n.lanes.find((ne) => ne.id === h.laneId), S = n.cards.findIndex((ne) => ne.id === i), d = n.cards.slice(S + 1).find((ne) => ne.laneId === h.laneId)?.id, f = ft(n, i), w = m.get(K(te.card(i))) ?? {}, $ = e.nodes.one(i) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : i, N = (z.cornerRadius ?? 0) > 0, T = h.asNote, j = T?.text !== void 0 && T.text.replace(/\s+/g, " ").trim() === h.label ? T.text : jo(n, h), H = {
      id: $,
      x: Math.round(u.x),
      y: Math.round(u.y),
      width: T?.width ?? w.width ?? 228,
      height: T?.height ?? w.height ?? 76,
      text: j,
      shape: T?.shape ?? (N ? "roundedrectangle" : "rectangle"),
      backgroundColor: h.look?.backgroundColor ?? w.backgroundColor,
      fontColor: h.look?.textColor ?? w.foregroundColor,
      fontSize: h.look?.fontSize ?? w.fontSize,
      borderColor: h.look?.borderColor ?? w.borderColor,
      borderWidth: h.look?.borderWidth ?? w.borderWidth,
      ...h.look?.fontFamily ?? w.fontFamily ? { fontFamily: h.look?.fontFamily ?? w.fontFamily } : {}
    };
    for (const ne of Object.keys(H)) H[ne] === void 0 && delete H[ne];
    e.beginHostStep?.(), n = f;
    const re = n;
    $ !== i ? r.set($, i) : r.delete($);
    const ee = Ve(() => e.addNode(H));
    ee && (ee.announcedByCreator = !0), e.endHostStep?.(), D(n), ee?.ready?.then?.(() => {
      if (k || e.nodes.one($) !== ee) return;
      const ne = () => e.selectNodes?.([ee]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(ne) : ne();
    }), e.announce?.(`${h.label} is now a note on the canvas. ${g.label}: ${ge(n, g.id)}.`);
    const Pe = () => {
      e.nodes.one($) === ee && (e.beginHostStep?.(), Ve(() => e.removeNode($)), e.endHostStep?.());
    };
    Kn(U(o.onChange, n, { cardId: i, cardToNote: { noteId: $ } }), () => {
      ee && e.nodes.one($) === ee && e.sendHeld?.([{ type: "onNodeAdded", data: { id: $, nodeOptions: at(ee.options) } }]);
    }, () => {
      if (!k) {
        if (Pe(), n === re && !n.cards.some((ne) => ne.id === i)) {
          const ne = { id: i, label: h.label, ...h.look ? { look: h.look } : {}, ...h.asNote ? { asNote: h.asNote } : {} }, Zn = Be(n, h.laneId, ne, d);
          Zn && (n = Zn, D(n));
        }
        e.announce?.(`${h.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      k || (Pe(), e.announce?.(`Someone else took ${h.label} off the lanes first.`));
    });
  }
  function jt(i, u, h) {
    const g = h.map(($) => $.id), S = g.indexOf(u), d = i.cards.find(($) => $.id === u);
    if (S < 0 || !d) return i;
    const f = i.cards.filter(($) => $ !== d), w = f.findIndex(($) => g.indexOf($.id) > S);
    return f.splice(w < 0 ? f.length : w, 0, d), V({ ...i, cards: f });
  }
  function Gt(i) {
    I = I.then(() => {
      const u = c.get(i);
      if (k || !u) return;
      const h = () => e.selectNodes?.([u]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(h) : h();
    });
  }
  function Ve(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Kn(i, u, h, g) {
    if (!i || typeof i.then != "function") return u();
    const S = i.then((d) => {
      d === !0 ? u() : d === !1 ? h() : d === "taken" && g();
    }, () => h());
    e.holdUntil?.(S);
  }
  function Ut(i, u) {
    X(!1), x = { laneId: u.laneId, reason: u.reason, timer: setTimeout(() => X(), 1500) }, D(n, { skip: u.cardId });
    const h = n.lanes.find((g) => g.id === u.laneId);
    e.announce?.(`${i} can't move to ${h?.label ?? "that lane"}. ${u.reason}`), U(o.onRefuse, u);
  }
  function X(i = !0) {
    x && (clearTimeout(x.timer), x = null, i && !k && xe());
  }
  function xe() {
    D(L && L.outcome.kind === "candidate" ? L.outcome.next : _?.next ?? y ?? n, { skip: L?.cardId });
  }
  function qn(i) {
    const u = Yn(i, Jn()), h = new Map(u.map((d) => [d.options.id, d.options])), g = (d, f, w, $ = !1) => {
      const N = h.get(te.column(d));
      N && (N.borderColor = f, N.borderWidth = w, delete N.borderStyle);
      const T = $ && h.get(te.lane(d));
      T && (T.borderColor = f, T.borderWidth = w);
    }, S = L?.cardId ?? _?.cardId;
    if (W = /* @__PURE__ */ new Map(), S) {
      const d = n.cards.find(($) => $.id === S)?.laneId, f = ut(n, S);
      if (!a || a.laneCues)
        for (const $ of f) $.id !== d && (g($.id, st, 2), W.set($.id, "open"));
      if (a?.laneCues) {
        for (const $ of n.lanes) if (!f.includes($)) {
          const N = h.get(te.column($.id));
          N && (N.backgroundColor = "#e9e8e2"), W.set($.id, "closed");
        }
      }
      const w = L ? L.outcome : _?.laneId ? { kind: "candidate", laneId: _.laneId } : null;
      w?.kind === "candidate" && (g(w.laneId, rt, 3, !0), W.set(w.laneId, "over")), w?.kind === "refused" && (g(w.laneId, An, 3), W.set(w.laneId, "refused"));
    }
    if (R && !S) {
      for (const d of R.open) d !== R.laneId && (g(d, st, 2), W.set(d, "open"));
      R.laneId && !R.refusal && (g(R.laneId, rt, 3, !0), W.set(R.laneId, "over")), R.laneId && R.refusal && (g(R.laneId, An, 3), W.set(R.laneId, "refused"));
    }
    if (_?.laneId === null && _.spot) {
      const d = h.get(te.card(_.cardId));
      d && (d.xPos = _.spot.x, d.yPos = _.spot.y);
    }
    if (x) {
      W.set(x.laneId, "refused"), g(x.laneId, An, 3, !0);
      const d = h.get(te.caption(x.laneId));
      d && (d.text = x.reason, d.foregroundColor = "#b42318");
    }
    if (F = /* @__PURE__ */ new Set(), y && i === y) {
      const d = (w, $) => JSON.stringify(w) === JSON.stringify($), f = (w) => {
        const $ = h.get(w);
        $ && ($.borderStyle = "dashed", $.borderColor = Lo, $.borderWidth = 2, F.add(K(w)));
      };
      for (const w of i.cards) d(w, n.cards.find(($) => $.id === w.id)) || f(te.card(w.id));
      for (const w of i.lanes) d(w, n.lanes.find(($) => $.id === w.id)) || f(te.lane(w.id));
    }
    for (const d of u) {
      d.options.id = K(d.options.id);
      for (const f of d.relationships.associations)
        f.parentId = K(f.parentId), f.childId = K(f.childId);
    }
    return u;
  }
  function Jn() {
    return L || _ ? n.lanes.map((i) => n.cards.filter((u) => u.laneId === i.id).length) : void 0;
  }
  function D(i, u = {}) {
    if (k) return;
    O = { model: i, skip: u.skip, grip: u.grip, animate: u.animate !== !1 };
    const h = qn(i), g = [];
    for (const { options: d } of h) {
      const f = d.id;
      if (c.has(f)) continue;
      const w = p.get(f);
      p.delete(f);
      const $ = w && u.animate !== !1 && !$n() ? { ...d, xPos: w.x, yPos: w.y } : d, N = e.nodes.add(So($));
      c.set(f, N), m.set(f, { ...$ }), N.ready && g.push(N.ready.then(() => {
        if (c.get(f) !== N) return;
        N.applyGovernance?.(), Q(f)?.kind === "column" && N.toBack?.(!1), Q(f)?.kind === "handle" && N.svgGroup?.front?.();
        const T = Vn(O?.model ?? i, f);
        T && N.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const S = O;
    I = Promise.all([I, ...g]).then(() => {
      k || O !== S || Kt(qn(S.model), S);
    }).catch((d) => console.warn("WORKSHOP: could not draw the workshop", d));
  }
  function Kt(i, u) {
    const h = new Set(i.map((S) => S.options.id)), g = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [d, f] of [...c]) {
        if (h.has(d)) continue;
        for (const [$, N] of [...A])
          N.parentId !== d && N.childId !== d || (N.parent.relationships?.removeAssociation($), A.delete($));
        e.deselectNode?.(f), f.editor?.cancelInline?.(), c.delete(d), m.delete(d);
        const w = E.get(d);
        w && (E.delete(d), v.delete(w)), e.nodes.remove(d);
      }
      for (const { options: d } of i) {
        const f = d.id, w = c.get(f);
        if (!w?.svgGroup) continue;
        const $ = m.get(f) ?? {}, N = w.editor?.isInlineEditing?.();
        (d.fontSize !== $.fontSize || d.foregroundColor !== $.foregroundColor) && (w.options.fontSize = d.fontSize, w.options.fontColor = d.foregroundColor, w.applyTextStyle?.()), d.text !== $.text && !N && w.setText?.(d.text), (d.width !== $.width || d.height !== $.height) && (d.vectorPath ? (w.options.width = d.width, w.options.height = d.height, w.setShape?.(w.options.shape, d.vectorPath), Q(f)?.kind === "column" && w.toBack?.(!1)) : w.setSize?.(d.width, d.height)), d.backgroundColor !== $.backgroundColor && w.setColors?.(d.backgroundColor), (d.borderColor !== $.borderColor || d.borderWidth !== $.borderWidth || d.borderStyle !== $.borderStyle) && (w.options.borderColor = d.borderColor, w.options.borderWidth = d.borderWidth, w.options.borderStyle = d.borderStyle, w.applyBorder?.());
        const T = d.xPos !== $.xPos || d.yPos !== $.yPos || Math.abs((w.options.x ?? 0) - d.xPos) > 0.5 || Math.abs((w.options.y ?? 0) - d.yPos) > 0.5;
        if (f !== (u.skip && K(te.card(u.skip))) && f !== (u.grip && K(u.grip)) && T) {
          const re = u.animate && !$n() ? 180 : 0, ee = g.includes(w) ? () => {
            !k && c.get(f) === w && (e.getSelectedNodes?.() ?? []).includes(w) && e.updateSelectionResizeRotate?.();
          } : void 0;
          ee && re && g.length === 1 && w.resizeRotate?.disable?.(), w.position(d.xPos, d.yPos, ee, void 0, re);
        }
        const j = Vn(u.model, f);
        j && w.svgGroup.node.getAttribute("aria-label") !== j && w.svgGroup.node.setAttribute("aria-label", j), F.has(f) ? w.svgGroup.node.setAttribute("data-workshop-proposed", "") : w.svgGroup.node.removeAttribute("data-workshop-proposed");
        const H = Q(f);
        if (H?.kind === "column") {
          const re = W.get(H.key);
          re ? w.svgGroup.node.setAttribute("data-workshop-drop", re) : w.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && w.svgGroup.front?.(), m.set(f, { ...d });
      }
      const S = /* @__PURE__ */ new Map();
      for (const d of i) for (const f of d.relationships.associations) S.set(f.id, f);
      for (const [d, f] of [...A])
        S.has(d) && c.get(f.parentId) === f.parent && c.get(f.childId) === f.child || (f.parent.relationships?.removeAssociation(d), A.delete(d));
      for (const [d, f] of S) {
        if (A.has(d)) continue;
        const w = c.get(f.parentId), $ = c.get(f.childId);
        !w?.relationships || !$?.svgGroup || (w.relationships.addAssociation($, To(f)), A.set(d, { parentId: f.parentId, childId: f.childId, parent: w, child: $ }));
      }
    }), s) {
      const S = n.lanes.map((f) => c.get(K(te.column(f.id)))?.svgGroup?.node).reduce((f, w) => w && (!f || f.compareDocumentPosition(w) & 4) ? w : f, null), d = u.model;
      s.draw(n, d === n ? null : d, {
        origin: J,
        layout: P,
        above: S,
        clamp: l?.last?.clampedReason ? { name: l.name, text: l.last.clampedReason } : null,
        refused: !!l?.last?.refusal,
        onUnlink: (f, w) => {
          if (b || y || L || l || Ke()) return;
          const $ = He(n, [{ kind: "unlink_tasks", card: { id: f }, waitsOn: { id: w } }]);
          "refused" in $ ? e.announce?.($.refused.reason) : Ze($.workshop, { cardId: f });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function kn(i) {
    return { x: i.x - J.x, y: i.y - J.y };
  }
  function Oe(i) {
    return a ? a.places(i, P) : { ...Ne(i, { layout: P }), parts: [] };
  }
  function qt(i, u) {
    const h = a.places(i, P).parts.find((g) => g.name === u);
    return h ? { x: h.x, y: h.y, width: h.width, height: h.height } : void 0;
  }
  function Yn(i, u) {
    return a ? a.notes(i, P, J, z) : Yo(i, { native: !0, origin: J, rows: u, layout: P, style: z }).nodes;
  }
  function Ze(i, u, h) {
    const g = a.editsBetween(n, i);
    if (!g.length) return !1;
    const S = He(n, g);
    return "refused" in S ? (e.announce?.(S.refused.reason), U(o.onRefuse, { ...u, laneId: S.refused.laneId, reason: S.refused.reason }), !1) : (n = S.workshop, D(n, { skip: h }), e.announce?.(S.report.edits.map((d) => d.said).join(" ")), U(o.onChange, n, { ...u, edits: g }), !0);
  }
  function Vn(i, u) {
    const h = Q(u);
    if (h?.kind === "lane") {
      const g = i.lanes.find((S) => S.id === h.key);
      return g ? `${g.label}, ${ge(i, g.id)}` : null;
    }
    if (h?.kind === "card") {
      const g = i.cards.find((d) => d.id === h.key), S = g && i.lanes.find((d) => d.id === g.laneId);
      return g && S ? `${g.label}, in ${S.label}` : null;
    }
    return h?.kind === "handle" ? a?.label?.(i, le(u)) ?? null : null;
  }
  function bn(i, u) {
    const h = Yn(i).find((g) => g.options.id === u)?.options;
    return h ? { x: h.xPos, y: h.yPos } : null;
  }
  function Te() {
    (L || l) && e.cancelGovernedDrag?.("host"), L = null, l = null, _ && (_ = null, U(o.onPreview, null)), X(!1);
  }
  return {
    toCanvas(i) {
      if (k || b || Ke()) return "This workshop is view-only here.";
      if (!n.cards.some((S) => S.id === i)) return "That card is no longer on the board.";
      const u = an(n, i);
      if (u) return u;
      _ && Ie(), y && (Te(), y = null, D(n), e.refreshGovernance?.());
      const { width: h } = Oe(n), g = c.get(K(te.card(i)))?.options;
      return yn(i, { x: J.x + h + 32, y: g?.y ?? J.y }), null;
    },
    get value() {
      return n;
    },
    get origin() {
      return { ...J };
    },
    get layout() {
      return { ...P };
    },
    get bounds() {
      const { width: i, height: u } = Oe(n);
      return { x: J.x, y: J.y, width: i, height: u };
    },
    setLayout(i) {
      if (k) throw new Error("This workshop has been detached.");
      const u = lt(i);
      a ? a.places(n, u) : Ne(n, { layout: u }), JSON.stringify(u) !== JSON.stringify(P) && (Te(), P = u, D(y ?? n));
    },
    whenDrawn: () => I,
    update(i) {
      if (k) throw new Error("This workshop has been detached.");
      const u = V(i);
      Te(), n = u, D(y ?? n);
    },
    preview(i) {
      if (k) throw new Error("This workshop has been detached.");
      const u = i ? V(i) : null;
      Te(), y = u, D(y ?? n), e.refreshGovernance?.();
    },
    refuse(i, u) {
      const h = n.lanes.find((g) => g.id === i);
      k || !h || (X(!1), x = { laneId: i, reason: u, timer: setTimeout(() => X(), 1500) }, xe(), e.announce?.(`${h.label}: ${u}`));
    },
    setReadOnly(i) {
      k || b === !!i || (Te(), b = !!i, D(y ?? n), e.refreshGovernance?.());
    },
    destroy() {
      k || (Te(), k = !0, e.element?.removeEventListener?.("pointerdown", Dn, !0), Ft?.(), e.withPolicyAuthority(() => {
        for (const [i, u] of A) u.parent.relationships?.removeAssociation(i);
        for (const [i, u] of c)
          e.deselectNode?.(u), u.editor?.cancelInline?.(), e.nodes.one(i) === u && e.nodes.remove(i);
      }), A.clear(), c.clear(), m.clear(), v.clear(), E.clear(), zt(), s?.destroy(), ye = !1, pn(), e.notifyNodeChanged?.());
    }
  };
}
function U(e, ...t) {
  try {
    return e?.(...t);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function it(e, t, o) {
  !e || typeof e.then != "function" || e.then((n) => {
  }, () => {
  });
}
function Mo(e, t) {
  return e.kind === "candidate" && t.kind === "candidate" ? e.next === t.next || JSON.stringify(e.next) === JSON.stringify(t.next) : e.kind === t.kind && e.laneId === t.laneId && e.reason === t.reason;
}
function lt(e) {
  const t = {};
  return e?.lanesPerRow !== void 0 && (t.lanesPerRow = e.lanesPerRow), e?.narrow && (t.narrow = !0), e?.width !== void 0 && (t.width = e.width), t;
}
function _o(e) {
  const t = e.nodes?.allNodes ?? [];
  if (!t.length) return { x: 40, y: 40 };
  let o = -1 / 0, n = 1 / 0;
  for (const a of t)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), n = Math.min(n, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(n) };
}
const Ro = ["launch-plan", "pipeline", "budget"];
function ie(e) {
  return Ro.includes(e.kind) ? e.kind : void 0;
}
const dt = {
  "launch-plan": [12, "A launch plan holds up to 12 tasks."],
  pipeline: [16, "A pipeline holds up to 16 deals."],
  budget: [16, "A budget holds up to 16 line items."]
};
function me(e, t, o, n, a = !1) {
  if (typeof e != "number" || !Number.isFinite(e) || e < t || e > o || !a && !Number.isInteger(e)) throw new Error(n);
  return e;
}
const Wo = /^(?:[$€£¥₹]|[A-Z]{3} )$/;
function ct(e) {
  if (typeof e != "string" || !Wo.test(e)) throw new Error("Use a currency sign such as $ or €.");
  return e;
}
function fe(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function de(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function St(e) {
  const t = fe(e);
  let o;
  try {
    o = new URL(de(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: de(t.alt, 240) };
}
function ue(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const zo = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, Fo = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Ue(e) {
  const t = fe(e), o = {}, n = (s) => {
    if (typeof s != "string" || !zo.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, a = (s, l, y) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < l || s > y) throw new Error("A card size is out of range.");
    return s;
  };
  if (t.backgroundColor !== void 0 && (o.backgroundColor = n(t.backgroundColor)), t.textColor !== void 0 && (o.textColor = n(t.textColor)), t.borderColor !== void 0 && (o.borderColor = n(t.borderColor)), t.fontFamily !== void 0) {
    if (typeof t.fontFamily != "string" || !Fo.test(t.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = t.fontFamily;
  }
  return t.fontSize !== void 0 && (o.fontSize = a(t.fontSize, 6, 200)), t.borderWidth !== void 0 && (o.borderWidth = a(t.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Bo(e) {
  const t = {};
  for (const [o, n] of Object.entries(e ?? {}))
    if (n !== void 0)
      try {
        Ue({ [o]: n }) && (t[o] = n);
      } catch {
      }
  return Ue(t);
}
function zn(e) {
  const t = fe(e), o = {};
  if (t.text !== void 0) {
    if (typeof t.text != "string" || t.text.length > 400 || /[<>\u0000-\u0009\u000b-\u001f]/.test(t.text)) throw new Error("A card keeps plain words only.");
    o.text = t.text;
  }
  if (t.shape !== void 0) {
    if (typeof t.shape != "string" || !/^[a-z]{1,24}$/i.test(t.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = t.shape;
  }
  for (const n of ["width", "height"]) {
    const a = t[n];
    if (a !== void 0) {
      if (typeof a != "number" || !Number.isFinite(a) || a < 10 || a > 4e3) throw new Error("A note size is out of range.");
      o[n] = a;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
function ke(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function Fn({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (o) => {
    const n = e.find((a) => a.id === o);
    if (!n) throw new Error("Presentation order refers to an unknown lane.");
    return n;
  });
}
function Ho(e) {
  return (e.signals ?? []).map((t) => {
    const o = e.cards.some((n) => n.id === t.cardId && n.laneId === t.laneId);
    return { ...t, present: o, text: o ? t.whenPresent : t.whenAbsent };
  });
}
const _e = (e) => "lane-" + e, be = (e) => "card-" + e, un = (e) => "image-" + e;
function Ia(e) {
  const t = Ho(e);
  return Fn(e).map((o) => {
    const n = e.cards.filter((l) => l.laneId === o.id), a = t.filter((l) => l.laneId === o.id), s = [_e(o.id)];
    return o.station?.image && s.push(un(o.id)), { lane: o, cards: n, signals: a, nodeIds: [...s, ...n.map((l) => be(l.id))] };
  });
}
const Ct = 5, Ot = 24, Pn = 3;
function V(e) {
  const t = fe(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan" && !ie(t)) throw new Error("Unsupported workshop kind.");
  const o = t.kind === "release-plan", n = ie(t), a = 1e9, s = de(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > Ct)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > Ot)
    throw new Error("A workshop supports up to 24 cards.");
  if (n && t.cards.length > dt[n][0]) throw new Error(dt[n][1]);
  const l = t.lanes.map((c) => {
    const m = fe(c), A = { id: ue(m.id), label: de(m.label) };
    if (m.capacity !== void 0 && n && n !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (m.capacity !== void 0) {
      const v = o ? 576 : 24;
      if (typeof m.capacity != "number" || !Number.isInteger(m.capacity) || m.capacity < 1 || m.capacity > v)
        throw new Error(`Lane capacity must be a whole number from 1 to ${v}.`);
      A.capacity = m.capacity;
    }
    if (n === "pipeline") {
      if (m.role !== void 0) {
        if (m.role !== "won" && m.role !== "lost") throw new Error("A stage is won, lost or open.");
        A.role = m.role;
      }
      m.probability !== void 0 && (A.probability = me(m.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
    }
    if (n === "budget") {
      const v = (E) => {
        m[E] !== void 0 && (A[E] = me(m[E], 0, a, "Team amounts are whole amounts."));
      };
      v("allocation"), v("floor"), v("cap");
    }
    if (m.station !== void 0) {
      const v = fe(m.station), E = (_) => {
        if (typeof _ != "number" || !Number.isInteger(_) || _ < 0 || _ >= Pn)
          throw new Error("Use map coordinates from 0 to 2.");
        return _;
      };
      if (!Array.isArray(v.next) || v.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const L = v.next.map(ue);
      ke(L, "onward stop"), A.station = { column: E(v.column), row: E(v.row), next: L, outcome: de(v.outcome, 160) }, v.image !== void 0 && (A.station.image = St(v.image));
    }
    return A;
  }), y = l.map((c) => c.id);
  if (ke(y, "lane ID"), n && l.some((c) => c.station)) throw new Error("A business board has no map stations.");
  if ((o || l.some((c) => c.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (l.some((c) => c.station)) {
    if (!l.every((c) => c.station)) throw new Error("Give every station on the map a position.");
    ke(l.map((c) => c.station.column + "," + c.station.row), "map position");
    for (const c of l)
      if (c.station.next.some((m) => m === c.id || !y.includes(m))) throw new Error("Connect each stop to another station on this map.");
  }
  const b = t.cards.map((c) => {
    const m = fe(c), A = { id: ue(m.id), label: de(m.label), laneId: ue(m.laneId) };
    if (!y.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (m.allowedLaneIds !== void 0) {
      if (!Array.isArray(m.allowedLaneIds) || m.allowedLaneIds.length > l.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = m.allowedLaneIds.map(ue), ke(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((v) => y.includes(v)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (m.look !== void 0) {
      const v = Ue(m.look);
      v && (A.look = v);
    }
    if (m.asNote !== void 0) {
      const v = zn(m.asNote);
      v && (A.asNote = v);
    }
    if (n === "launch-plan" && (A.duration = me(m.duration, 1, 60, "A task takes 1 to 60 days."), m.lag !== void 0 && m.lag !== 0 && (A.lag = me(m.lag, 0, 120, "A task waits 0 days or more, and no later than launch."))), (n === "pipeline" || n === "budget") && m.amount !== void 0 && (A.amount = me(m.amount, 0, a, "An amount is a whole amount, not below zero.")), n === "launch-plan" && m.dependsOn !== void 0) {
      if (!Array.isArray(m.dependsOn)) throw new Error("A task waits on a list of tasks.");
      A.dependsOn = m.dependsOn.map(ue), ke(A.dependsOn, "dependency"), A.dependsOn.length || delete A.dependsOn;
    }
    if (o) {
      if (typeof m.points != "number" || !Number.isInteger(m.points) || m.points < 1 || m.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (A.points = m.points, m.dependsOn !== void 0) {
        if (!Array.isArray(m.dependsOn) || m.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        A.dependsOn = m.dependsOn.map(ue), ke(A.dependsOn, "dependency");
      }
    }
    return A;
  });
  ke(b.map((c) => c.id), "card ID");
  const k = { version: 1, title: s, lanes: l, cards: b };
  if (t.experience !== void 0) {
    const c = fe(t.experience);
    if (c.version !== 1 || c.kind !== "customer-interviews" && c.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    k.experience = { version: 1, kind: c.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    k.signals = t.signals.map((c) => {
      const m = fe(c), A = ue(m.cardId), v = ue(m.laneId);
      if (!b.some((E) => E.id === A) || !y.includes(v))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ue(m.id),
        label: de(m.label),
        cardId: A,
        laneId: v,
        whenPresent: de(m.whenPresent, 160),
        whenAbsent: de(m.whenAbsent, 160)
      };
    }), ke(k.signals.map((c) => c.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    k.presentationOrder = Fn({ lanes: l, presentationOrder: t.presentationOrder }).map((c) => c.id);
  }
  if (o)
    return k.kind = "release-plan", Jt(k), k;
  if (n) {
    k.kind = n;
    const c = (A, v) => {
      if (!t[A] || typeof t[A] != "object") throw new Error(v);
      return fe(t[A]);
    };
    if (n === "launch-plan" && (k.launch = { day: me(c("launch", "A launch plan needs a launch day.").day, 5, 120, "Launch day is a whole day from 5 to 120.") }), n === "pipeline") {
      const A = c("forecast", "A pipeline needs a forecast target.");
      k.forecast = { target: me(A.target, 1, a, "A target is a whole amount above zero."), currency: ct(A.currency) };
    }
    if (n === "budget") {
      const A = c("budget", "A budget needs a total.");
      k.budget = {
        total: me(A.total, 1, a, "A total is a whole amount above zero."),
        currency: ct(A.currency),
        step: A.step === void 0 ? 5e3 : me(A.step, 1, a, "A step is a whole amount above zero.")
      };
    }
    const m = (n === "launch-plan" ? Xt : n === "pipeline" ? oo : so)(k);
    if (m) throw new Error(m);
    return k;
  }
  for (const c of l)
    if (b.filter((m) => m.laneId === c.id).length > (c.capacity ?? 1 / 0))
      throw new Error(`Lane "${c.label}" exceeds its capacity.`);
  return k;
}
const Tt = 65536;
function xa(e) {
  const t = JSON.stringify(V(e)), o = "#" + new URLSearchParams({ model: t }).toString();
  if (o.length > Tt) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function $a(e) {
  if (e.length > Tt) throw new Error("This workshop is too large to open from a link.");
  const t = new URLSearchParams(e.slice(1)), o = t.get("model");
  if (!e.startsWith("#") || !o || Array.from(t.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let n;
  try {
    n = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return V(n);
}
function Bn(e, t, o) {
  const n = ie(e);
  if (n)
    return (n === "launch-plan" ? yt : n === "pipeline" ? ao : io)(e, t, o);
}
function dn(e, t) {
  if (ie(e)) return e.lanes.filter((n) => Bn(e, t.id, n.id));
  if (e.kind === "release-plan") return e.lanes.filter((n) => cn(e, t, n.id) !== null);
  const o = e.lanes.find((n) => n.id === t.laneId)?.station;
  return e.lanes.filter((n) => n.id === t.laneId || (!o || o.next.includes(n.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(n.id)) && e.cards.filter((a) => a.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function Ln(e, t, o) {
  const n = e.cards.find((s) => s.id === t), a = Bn(e, t, o);
  if (a !== void 0) {
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (n && e.kind === "release-plan") {
    const s = cn(e, n, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!n || !dn(e, n).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return n.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === n ? { ...n, laneId: o } : s) };
}
function Re(e, t, o) {
  const n = e.cards.find((l) => l.id === t);
  if (!n || !e.lanes.some((l) => l.id === o)) return null;
  if (n.laneId === o) return e;
  if (e.kind === "release-plan") return cn(e, n, o);
  const a = Bn(e, t, o);
  if (a !== void 0) return a;
  const s = Vo(e, t, o);
  return s || (o === "prototype" && We(e) === "customer-interviews" ? null : dn(e, n).some((l) => l.id === o) ? Ln(e, t, o) : null);
}
function ut(e, t) {
  return e.lanes.filter((o) => Re(e, t, o.id) !== null);
}
function tn(e, t, o) {
  if (Re(e, t, o) !== null) return null;
  const n = e.cards.find((b) => b.id === t), a = e.lanes.find((b) => b.id === o);
  if (!n || !a) return "That move is not available.";
  if (e.kind === "pipeline") return kt(e, t, o);
  if (e.kind === "budget") return bt(e, t, o);
  const s = `This card can't go in ${a.label}.`;
  if (n.allowedLaneIds && !n.allowedLaneIds.includes(o)) return s;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return s;
    const b = Ae(e, o), k = { ...e, lanes: e.lanes.map((m) => m === a ? { id: a.id, label: a.label } : m) }, c = cn(k, n, o);
    return c ? `Needs ${Ae(c, o) - b} points. It already holds ${b} of ${a.capacity} points.` : s;
  }
  const l = e.lanes.find((b) => b.id === n.laneId);
  if (l?.station && !l.station.next.includes(o)) return `${a.label} can't be reached from ${l.label}.`;
  const y = e.cards.filter((b) => b.laneId === o).length;
  return a.capacity !== void 0 && y >= a.capacity ? `It already holds ${y} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : s;
}
function on(e) {
  return (!e.kind || !!ie(e)) && !e.lanes.some((t) => t.station) && !We(e);
}
const Do = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Pt(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((n) => n.id));
  return typeof t == "string" && Do.test(t) && !o.has(t) ? t : hn(e, "card");
}
function Ee(e, t, o) {
  const n = e.lanes.find((l) => l.id === t);
  if (!n) return "That lane is no longer on the board.";
  if (e.lanes.some((l) => l.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (We(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (ie(e)) {
    const l = Lt(e, t, o);
    return typeof l == "string" ? l : null;
  }
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= Ot) return "A workshop holds up to 24 cards.";
  const s = e.cards.filter((l) => l.laneId === t).length;
  if (n.capacity !== void 0 && s >= n.capacity) return `It already holds ${s} of ${n.capacity} ${n.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Ue(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      zn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function Be(e, t, o, n) {
  if (Ee(e, t, o) !== null) return null;
  if (ie(e)) {
    const k = Lt(e, t, o), c = k.cards[k.cards.length - 1], m = n === void 0 ? -1 : e.cards.findIndex((A) => A.id === n && A.laneId === t);
    return m < 0 ? k : { ...k, cards: [...e.cards.slice(0, m), c, ...e.cards.slice(m)] };
  }
  const a = o.look === void 0 ? void 0 : Ue(o.look), s = o.asNote === void 0 ? void 0 : zn(o.asNote), l = {
    id: Pt(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: t,
    ...a ? { look: a } : {},
    ...s ? { asNote: s } : {}
  }, y = n === void 0 ? -1 : e.cards.findIndex((k) => k.id === n && k.laneId === t), b = y < 0 ? [...e.cards, l] : [...e.cards.slice(0, y), l, ...e.cards.slice(y)];
  return V({ ...e, cards: b });
}
function Lt(e, t, o) {
  const n = wt(o.label);
  if (!n.label) return "A card needs some words as well as a number.";
  if (e.kind === "budget" && n.amount === void 0) return "Write the cost on the note, like 'Contractor $45k', then drop it.";
  const a = He(e, [{
    kind: "add_card",
    lane: { id: t },
    label: n.label,
    ...e.kind === "launch-plan" ? { duration: Math.min(60, Math.max(1, n.days ?? 2)) } : n.amount !== void 0 ? { amount: n.amount } : {}
  }]);
  if ("refused" in a) return a.refused.reason;
  const s = a.workshop.cards;
  return s[s.length - 1] = { ...s[s.length - 1], id: Pt(e, o.id) }, a.workshop;
}
function Et(e, t) {
  return e.kind === "release-plan" ? t.label + `
` + t.points + " points" : e.kind === "launch-plan" ? t.label + " · " + t.duration + "d" : (e.kind === "pipeline" || e.kind === "budget") && t.amount !== void 0 ? t.label + `
` + q(t.amount, e.forecast?.currency ?? e.budget?.currency) : t.label;
}
function jo(e, t) {
  return e.kind === "launch-plan" ? to(t) : ie(e) && t.amount !== void 0 ? t.label + " · " + q(t.amount, e.forecast?.currency ?? e.budget?.currency) : t.label;
}
function an(e, t) {
  const o = e.cards.find((n) => n.id === t);
  if (!o) return "That card is no longer on the board.";
  if (!on(e)) return e.lanes.some((n) => n.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((n) => n.cardId === t)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const n = o.allowedLaneIds.map((s) => e.lanes.find((l) => l.id === s).label), a = n.length > 1 ? n.slice(0, -1).join(", ") + " or " + n.at(-1) : n[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function ft(e, t) {
  if (an(e, t) !== null) return null;
  const o = e.cards.filter((n) => n.id !== t).map((n) => {
    if (!n.dependsOn?.includes(t)) return n;
    const a = { ...n, dependsOn: n.dependsOn.filter((s) => s !== t) };
    return a.dependsOn.length || delete a.dependsOn, a;
  });
  return V({ ...e, cards: o });
}
function ge(e, t) {
  const o = e.lanes.find((s) => s.id === t);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const s = Ae(e, t);
    return o.capacity ? s + " / " + o.capacity + " points" : s + " points";
  }
  if (e.kind === "launch-plan") return no(e, t);
  if (e.kind === "pipeline") return ro(e, t);
  if (e.kind === "budget") return uo(e, t);
  const n = Zo(e, t);
  if (n) return "$" + n.amount + " · " + n.description;
  const a = e.cards.filter((s) => s.laneId === t).length;
  return o.capacity !== void 0 ? a + " of " + o.capacity : a + (a === 1 ? " card" : " cards");
}
const fn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, rn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Nt(e, t = fn, o = 28) {
  const { pitch: n, row: a, top: s } = t, l = !!e.lanes[0].station, y = e.lanes.map((c) => e.cards.filter((m) => m.laneId === c.id).length), b = s + Math.max(1, ...y) * a + 36, k = e.lanes.map((c, m) => ({
    x: l ? c.station.column * (n + o) : m * n,
    y: l ? c.station.row * b : 0
  }));
  return {
    points: k,
    width: Math.max(...k.map((c) => c.x)) + n,
    height: Math.max(...k.map((c, m) => c.y + s + (l ? Math.max(1, y[m]) : y[m] + 1) * a))
  };
}
function Aa() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function hn(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((a) => a.id));
  let n = 1;
  for (; o.has(t + "-" + n); ) n++;
  return t + "-" + n;
}
function Mt(e) {
  const t = V(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function Go(e, t) {
  const o = Mt(e), n = hn(o, "lane");
  return o.lanes.push({ id: n, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), o.presentationOrder?.push(n), V(o);
}
function Uo(e, t, o) {
  const n = Mt(e);
  return n.cards.push({
    id: hn(n, "card"),
    label: o.label,
    laneId: t,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), V(n);
}
function Sa() {
  return {
    version: 1,
    title: "Untitled map",
    lanes: [
      { id: "start", label: "Start", station: { column: 0, row: 0, next: ["next"], outcome: "The token is at the start." } },
      { id: "next", label: "Next step", station: { column: 1, row: 0, next: [], outcome: "The token has reached the next step." } }
    ],
    cards: [{ id: "token", label: "Token", laneId: "start" }]
  };
}
function ht(e, t, o) {
  const n = V(e);
  if (n.kind || !n.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = n.lanes.find((c) => c.id === t);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (n.lanes.length >= Ct) throw new Error("A map can have up to five stations.");
  const s = de(o?.label), l = de(o?.outcome, 160), y = hn(n, "station");
  let b, k = 1 / 0;
  for (let c = 0; c < Pn; c++)
    for (let m = 0; m < Pn; m++) {
      if (n.lanes.some((v) => v.station.column === m && v.station.row === c)) continue;
      const A = Math.abs(a.station.column - m) + Math.abs(a.station.row - c);
      A < k && (k = A, b = { column: m, row: c });
    }
  if (!b) throw new Error("There is no free station position.");
  return a.station.next.push(y), n.lanes.push({ id: y, label: s, station: { ...b, next: [], outcome: l, ...o.image === void 0 ? {} : { image: St(o.image) } } }), n.presentationOrder?.push(y), n;
}
const Ca = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, _t = (e) => "caption-" + e, De = (e) => "column-" + e, te = { lane: _e, card: be, image: un, caption: _t, column: De };
function Rt(e, t) {
  let o = 2;
  for (; t(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Sn(e, t, o) {
  const n = Math.max(0, Math.min(o, e / 2, t / 2)), a = e, s = t;
  return n ? `M ${n} 0 H ${a - n} Q ${a} 0 ${a} ${n} V ${s - n} Q ${a} ${s} ${a - n} ${s} H ${n} Q 0 ${s} 0 ${s - n} V ${n} Q 0 0 ${n} 0 Z` : `M 0 0 H ${a} V ${s} H 0 Z`;
}
function pt(e, t) {
  const o = (n) => Math.round(parseInt(e.slice(n, n + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function mt(e, t, o, n) {
  for (let a = t; a > 11; a--) {
    const s = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((y, b) => y + Math.max(1, Math.ceil(b.length / s)), 0) * a * 1.3 <= n) return a;
  }
  return Math.min(t, 11);
}
const Wt = 152, En = Wt + 12, Ko = 12;
function qo(e, t) {
  const o = e?.lanesPerRow;
  if (o === void 0) return t;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, t);
}
function Ne(e, t = {}) {
  const o = V(e), { pitch: n, row: a, top: s } = fn, l = o.lanes.map((A) => o.cards.filter((v) => v.laneId === A.id).length), y = (A) => Math.max(l[A], (Array.isArray(t.rows) ? t.rows[A] : t.rows) ?? 0), b = !!o.lanes[0].station, k = o.lanes.some((A) => A.station?.image), c = qo(t.layout, o.lanes.length), m = [];
  if (b) {
    const { points: A } = Nt(o);
    o.lanes.forEach((v, E) => m.push({
      laneId: v.id,
      x: A[E].x,
      y: A[E].y + (k ? v.station.row * En : 0),
      width: n,
      height: s + (v.station.image ? En : 0) + Math.max(1, l[E]) * a,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let A = 0;
    for (let v = 0; v < o.lanes.length; v += c) {
      const E = o.lanes.slice(v, v + c), L = s + (Math.max(...E.map((_, R) => y(v + R))) + 1) * a;
      E.forEach((_, R) => m.push({ laneId: _.id, x: R * n, y: A, width: n, height: L, column: R, row: v / c })), A += L + Ko;
    }
  }
  return { places: m, width: Math.max(...m.map((A) => A.x + A.width)), height: Math.max(...m.map((A) => A.y + A.height)) };
}
function Jo(e, t) {
  const { pitch: o, width: n, row: a, height: s, top: l } = fn, y = t.origin ?? { x: 0, y: 0 }, b = !!e.lanes[0].station, { places: k } = Ne(e, t), c = t.style ?? {}, m = c.textColor ?? Fe.fontColor, A = c.borderColor ?? Fe.borderColor, v = c.borderWidth ?? Fe.borderWidth, E = c.cornerRadius ?? 0, L = c.fontSize ?? Fe.fontSize, _ = c.laneFontSize ?? L + 2, R = c.captionFontSize ?? Math.max(11, L - 1), r = [], p = (I) => {
    const O = { options: {
      shapeHint: "rectangle",
      vectorPath: Sn(I.width, I.height, E),
      foregroundColor: m,
      borderColor: A,
      borderWidth: v,
      ...c.fontFamily ? { fontFamily: c.fontFamily } : {},
      ...I
    }, relationships: { associations: [] } };
    return r.push(O), O;
  };
  e.lanes.forEach((I, O) => {
    const P = k[O], z = y.x + P.x, W = y.y + P.y, F = I.station?.image;
    p({
      id: De(I.id),
      text: "",
      name: I.label,
      xPos: z + 2,
      yPos: W,
      width: o - 4,
      height: P.height,
      vectorPath: Sn(o - 4, P.height, E ? E + 2 : 0),
      backgroundColor: b ? "#fcf9ed" : pt(rn[O], 0.6),
      borderColor: b ? "#a8b5aa" : pt(rn[O], 0.1),
      borderWidth: 1,
      ...b ? { borderStyle: "dashed" } : {}
    }), p({
      id: _e(I.id),
      text: I.label,
      name: I.label,
      xPos: z + 8,
      yPos: W + 6,
      width: n,
      height: 58,
      backgroundColor: rn[O],
      fontSize: mt(I.label, _, n - 16, 50)
    }), p({
      id: _t(I.id),
      text: ge(e, I.id),
      name: I.label,
      xPos: z + 8,
      yPos: W + 66,
      width: n,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: R
    }), F && r.push({ options: {
      id: un(I.id),
      name: F.alt,
      text: "",
      xPos: z + 8,
      yPos: W + l,
      width: n,
      height: Wt,
      shapeHint: "rectangle",
      image: F.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((Z) => Z.laneId === I.id).forEach((Z, ye) => {
      const J = Et(e, Z), le = b ? n - 20 : n, Q = b ? s - 6 : s, K = b ? {} : { ...c.card, ...Z.look }, ce = b ? E : c.card?.cornerRadius ?? E;
      p({
        id: be(Z.id),
        text: J,
        name: Z.label,
        xPos: z + (b ? 18 : 8),
        yPos: W + l + (F ? En : 0) + ye * a,
        width: le,
        height: Q,
        ...ce !== E ? { vectorPath: Sn(le, Q, ce) } : {},
        backgroundColor: b ? "#ffda75" : K.backgroundColor ?? c.backgroundColor ?? Fe.backgroundColor,
        ...K.textColor ? { foregroundColor: K.textColor } : {},
        ...K.fontFamily ? { fontFamily: K.fontFamily } : {},
        ...K.borderColor ? { borderColor: K.borderColor } : {},
        ...K.borderWidth !== void 0 ? { borderWidth: K.borderWidth } : {},
        fontSize: mt(J, K.fontSize ?? L, le - 16, Q - 8)
      });
    });
  });
  const x = new Map(r.map((I) => [I.options.id, I]));
  for (const I of e.lanes)
    I.station && (x.get(De(I.id)).relationships.associations = I.station.next.map((O) => ({
      id: I.id + "-to-" + O,
      parentId: De(I.id),
      childId: De(O),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const I of e.cards)
      for (const O of I.dependsOn ?? []) {
        const P = be(O), z = be(I.id);
        x.get(P).relationships.associations.push({
          id: `dependency-${O.length}-${O}-${I.id}`,
          parentId: P,
          childId: z,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (t.beside) {
    const I = new Set(t.beside), O = new Set(r.map((W) => W.options.id)), P = /* @__PURE__ */ new Map();
    for (const W of [...O]) {
      if (!I.has(W)) continue;
      const F = Rt(W, (Z) => I.has(Z) || O.has(Z));
      O.add(F), P.set(W, F);
    }
    const z = (W) => P.get(W) ?? W;
    for (const W of r) {
      W.options.id = z(W.options.id);
      for (const F of W.relationships.associations)
        F.parentId = z(F.parentId), F.childId = z(F.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function Yo(e, t) {
  const o = V(e);
  if (t?.native) return Jo(o, t);
  const { width: n, row: a, height: s, top: l } = fn, y = [];
  function b(v, E, L, _, R, r) {
    y.push({ options: {
      id: v,
      text: E,
      name: E,
      xPos: L,
      yPos: _,
      width: n,
      height: R,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: k } = Nt(o), c = 152, m = c + 12, A = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, E) => {
    const L = k[E].x, _ = k[E].y + (A ? (v.station?.row ?? 0) * m : 0), R = v.station?.image, r = o.kind === "release-plan" ? v.label + `
` + (v.capacity ? Ae(o, v.id) + " / " + v.capacity + " points" : Ae(o, v.id) + " points") : v.label;
    b(_e(v.id), r, L, _, l - 12, rn[E]), R && y.push({ options: {
      id: un(v.id),
      name: R.alt,
      text: "",
      xPos: L,
      yPos: _ + l,
      width: n,
      height: c,
      shapeHint: "rectangle",
      image: R.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((p) => p.laneId === v.id).forEach((p, x) => b(be(p.id), Et(o, p), L, _ + l + (R ? m : 0) + x * a, s, "#fffdf6"));
  });
  for (const v of o.lanes) {
    if (!v.station) continue;
    const E = y.find((L) => L.options.id === _e(v.id));
    E.relationships.associations = v.station.next.map((L) => ({ id: v.id + "-to-" + L, parentId: E.options.id, childId: _e(L), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), E.options.text = v.label + `
` + v.station.outcome, E.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const v = new Map(y.map((E) => [E.options.id, E]));
    for (const E of o.cards)
      for (const L of E.dependsOn ?? []) {
        const _ = be(L), R = be(E.id);
        v.get(_).relationships.associations.push({
          id: `dependency-${L.length}-${L}-${E.id}`,
          parentId: _,
          childId: R,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: y };
}
const Oa = {
  version: 1,
  title: "Which field trials should run before the winter shutdown?",
  lanes: [
    { id: "proposed", label: "Proposed trials" },
    { id: "pilot", label: "Fund this quarter", capacity: 2 },
    { id: "evidence", label: "Gather evidence" }
  ],
  cards: [
    { id: "sensors", label: "Test bearing sensors on line four", laneId: "proposed" },
    { id: "spares", label: "Stage a spare drive at the north mill", laneId: "proposed" },
    { id: "cooling", label: "Measure cooling losses at shift change", laneId: "evidence", allowedLaneIds: ["evidence", "pilot"] },
    { id: "training", label: "Rehearse the overnight restart", laneId: "pilot" }
  ]
}, Nn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Hn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Ta() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: Nn.map(({ id: e, who: t, quote: o }) => ({ id: e, label: t + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: Nn.map(({ id: e, action: t, signal: o }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Pa() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Hn.map(({ id: e, label: t, rate: o }) => ({ id: e, label: t + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function We(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((n) => n.station)) return;
  const t = e.experience.kind, o = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Hn.map((n) => n.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((n) => o.includes(n.id))) && !(t === "customer-interviews" && (!e.cards.every((n) => Nn.some((a) => a.id === n.id)) || e.cards.filter((n) => n.laneId === "prototype").length > 1)))
    return t;
}
function Vo(e, t, o) {
  const n = We(e), a = e.cards.find((l) => l.id === t);
  if (!n || !a || a.laneId === o) return null;
  let s = e;
  if (n === "customer-interviews") {
    if (o !== "prototype") return null;
    const l = e.cards.find((y) => y.laneId === o);
    if (l) {
      if (!dn(e, l).some((y) => y.id === "interviews")) return null;
      s = Ln(e, l.id, "interviews");
    }
  }
  return dn(s, a).some((l) => l.id === o) ? Ln(s, t, o) : null;
}
function Zo(e, t) {
  if (We(e) !== "experiment-budget") return null;
  const o = Hn.find((s) => s.id === t), n = e.cards.filter((s) => s.laneId === t).length, a = n * (o?.per ?? 0);
  return { amount: n * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  Fe as DEFAULT_NOTE_STYLE,
  wo as WORKSHOP_BOARD_KINDS,
  nn as WorkshopReferenceError,
  ht as addWorkshopBranch,
  Uo as addWorkshopCard,
  Go as addWorkshopLane,
  He as applyWorkshopEdits,
  va as attachWorkshop,
  dn as availableLanes,
  uo as budgetCaption,
  Ce as budgetCommitted,
  ua as budgetLimits,
  bt as budgetRefusal,
  Mn as budgetShiftLimits,
  co as budgetShiftRefusal,
  Ro as businessBoardKinds,
  ie as businessKind,
  Ao as canHangPanel,
  Hn as channels,
  $o as checkWorkshopReplacement,
  ho as countWord,
  Pa as createBudgetWorkshop,
  Ta as createInterviewWorkshop,
  Aa as createLaneWorkshop,
  Sa as createWorkshopMap,
  Zt as days,
  $a as decodeWorkshopFragment,
  ba as describeFocusDarkroom,
  pa as describeWorkshopEdits,
  Qt as downstreamTasks,
  xa as encodeWorkshopFragment,
  oa as handoffSummary,
  ga as hangGalleryPanel,
  Oa as industrialWorkshop,
  ka as initialFocusDarkroom,
  Nn as interviews,
  rn as laneColors,
  gt as launchFinish,
  eo as launchLinkRefusal,
  Me as launchOverrun,
  no as launchPlanCaption,
  Qn as launchPlanLimits,
  ia as launchPlanRefusal,
  to as launchTaskText,
  $e as listed,
  Qe as listeningRoom,
  ra as listeningRoomCaption,
  Ot as maxWorkshopCards,
  q as money,
  ma as moonGallery,
  Ln as moveWorkshopCard,
  ha as named,
  Ca as nightTransfer,
  ya as normalizeFocusDarkroom,
  aa as normalizeListeningRoom,
  wa as normalizeMoonGallery,
  ea as normalizeOfflineHandoff,
  Xo as offlineHandoff,
  ro as pipelineCaption,
  da as pipelineForecast,
  Xn as pipelineLimits,
  kt as pipelineRefusal,
  io as planBudgetMove,
  yt as planLaunchPlanMove,
  ao as planPipelineMove,
  Vo as planStartupMove,
  po as pointing,
  $t as printFields,
  wt as readNoteNumbers,
  Ae as releaseLoad,
  sa as releasePlan,
  ta as resolveHandoff,
  Ho as resolveWorkshopSignals,
  na as reviewHandoff,
  C as said,
  fa as sampleBudget,
  la as sampleLaunchPlan,
  ca as samplePipeline,
  Se as scheduleLaunch,
  lo as shiftBudget,
  We as startupExperienceKind,
  _n as unquoted,
  so as validateBudget,
  Xt as validateLaunchPlan,
  oo as validatePipeline,
  V as validateWorkshop,
  Cn as withLink,
  je as withTaskValue,
  sn as workshopBoardKind,
  Zo as workshopBudgetResult,
  Re as workshopCandidate,
  ft as workshopCardAsNote,
  an as workshopCardAsNoteRefusal,
  Bo as workshopCardLookOf,
  jo as workshopCardNoteText,
  Et as workshopCardText,
  ut as workshopDestinations,
  Wn as workshopEditKinds,
  On as workshopFinder,
  ge as workshopLaneCaption,
  Ne as workshopLanePlaces,
  fn as workshopLayout,
  te as workshopNodeIds,
  Be as workshopNoteCandidate,
  Ee as workshopNoteRefusal,
  Nt as workshopPositions,
  Fn as workshopPresentationLanes,
  Ia as workshopPresentationScenes,
  bo as workshopReferences,
  tn as workshopRefusal,
  Rt as workshopStandInId,
  on as workshopTakesNotes,
  Yo as workshopToSlate
};
