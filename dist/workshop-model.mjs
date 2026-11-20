import { D as je } from "./NoteDefaults-1xFW0br8.mjs";
const oa = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function aa(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, stage: n, choice: a, fieldNote: s, deskNote: l, fallback: b } = e, g = ($) => typeof $ == "string" && $.trim().length > 0 && $.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test($);
  return t !== "offline-handoff" || o !== 1 || n !== "queued" && n !== "review" && n !== "resolved" || (n === "resolved" ? a !== "field" && a !== "desk" : a !== null) || a === void 0 || !g(s) || !g(l) || !g(b) ? null : { kind: t, version: o, stage: n, choice: a, fieldNote: s.trim(), deskNote: l.trim(), fallback: b.trim() };
}
function ra(e) {
  return { ...e, stage: "review", choice: null };
}
function sa(e, t) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: t } : e;
}
function ia(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const tn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function la(e) {
  if (!e || typeof e != "object") return null;
  const { kind: t, version: o, mix: n, leftLabel: a, rightLabel: s } = e, l = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return t !== "listening-room" || o !== 1 || typeof n != "number" || !Number.isFinite(n) || n < 0 || n > 1 || !l(a) || !l(s) ? null : { kind: t, version: o, mix: n, leftLabel: a.trim(), rightLabel: s.trim() };
}
function da({ mix: e, leftLabel: t, rightLabel: o }) {
  return e < 0.32 ? t === tn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + t + "." : e > 0.68 ? o === tn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : t === tn.leftLabel && o === tn.rightLabel ? "Rain and glass chimes overlap." : t + " and " + o + " overlap.";
}
function Oe(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.points ?? 1 : 0), 0);
}
function Qt(e) {
  const t = new Map(e.cards.map((l) => [l.id, l])), o = new Map(e.lanes.map((l, b) => [l.id, b])), n = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
  function s(l) {
    if (!n.has(l.id)) {
      if (a.has(l.id)) throw new Error("Release dependencies must be acyclic.");
      a.add(l.id);
      for (const b of l.dependsOn ?? []) {
        const g = t.get(b);
        if (!g) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(g.laneId) > o.get(l.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(g);
      }
      a.delete(l.id), n.add(l.id);
    }
  }
  for (const l of e.cards) s(l);
  for (const l of e.lanes) {
    if (l.station) throw new Error("Release windows cannot also be map stations.");
    if (Oe(e, l.id) > (l.capacity ?? 1 / 0)) throw new Error(`Release "${l.label}" exceeds its point budget.`);
  }
}
function pn(e, t, o) {
  if (o === t.laneId) return e;
  const n = new Map(e.lanes.map((u, v) => [u.id, v])), a = n.get(o);
  if (a === void 0) return null;
  const s = a < n.get(t.laneId), l = /* @__PURE__ */ new Set([t.id]), b = [t];
  for (; b.length; ) {
    const u = b.pop();
    for (const v of e.cards) {
      if (l.has(v.id)) continue;
      const k = n.get(v.laneId);
      (s ? k > a && u.dependsOn?.includes(v.id) : k < a && v.dependsOn?.includes(u.id)) && (l.add(v.id), b.push(v));
    }
  }
  if (e.cards.filter((u) => l.has(u.id)).some((u) => u.allowedLaneIds && !u.allowedLaneIds.includes(o))) return null;
  const $ = { ...e, cards: e.cards.map((u) => l.has(u.id) ? { ...u, laneId: o } : u) }, h = e.lanes[a].capacity;
  return h !== void 0 && Oe($, o) > h ? null : $;
}
const ca = {
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
}, Xt = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, eo = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function bt(e) {
  let t = String(e ?? "").replace(/\s+/g, " ").trim();
  const o = { label: t }, n = Xt.exec(t);
  if (n) {
    const l = Number(n[1].replace(",", ".")), b = /^w/i.test(n[2]);
    o.days = Math.max(1, Math.ceil(b ? l * 5 : l)), t = t.slice(0, n.index) + " " + t.slice(n.index + n[0].length);
  }
  const a = [...t.matchAll(eo)].filter((l) => l[1] || l[3] || Number(l[2].replace(",", "")) >= 1e3), s = a.find((l) => l[1] || l[3]) ?? a[0];
  if (s) {
    const l = /k/i.test(s[3] ?? "") ? 1e3 : /m/i.test(s[3] ?? "") ? 1e6 : 1;
    o.amount = Math.round(Number(s[2].replace(",", s[3] ? "." : "")) * l), s[1] && (o.currency = s[1]), t = t.slice(0, s.index) + " " + t.slice(s.index + s[0].length);
  }
  return o.label = t.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), o;
}
function q(e, t = "$") {
  const o = e < 0 ? "-" : "", n = Math.abs(e), a = (l, b) => (Math.round(l * 10) / 10).toString() + b, s = n >= 1e6 ? a(n / 1e6, "M") : n >= 1e3 ? a(n / 1e3, "k") : String(Math.round(n));
  return o + t + s;
}
const no = (e) => e + (e === 1 ? " day" : " days");
function Te(e) {
  const t = new Map(e.cards.map((g) => [g.id, g])), o = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Set(), a = (g) => {
    const $ = o.get(g.id);
    if ($) return $;
    if (n.has(g.id)) throw new Error("Tasks can't wait on each other in a circle.");
    n.add(g.id);
    let h = 0;
    for (const v of g.dependsOn ?? []) {
      const k = t.get(v);
      if (!k) throw new Error("A task waits on a task that is not on the plan.");
      h = Math.max(h, a(k).end);
    }
    h += g.lag ?? 0;
    const u = { start: h, end: h + (g.duration ?? 1), slack: 0, critical: !1 };
    return o.set(g.id, u), n.delete(g.id), u;
  };
  e.cards.forEach(a);
  const s = Math.max(0, ...[...o.values()].map((g) => g.end)), l = /* @__PURE__ */ new Map(), b = (g) => {
    const $ = l.get(g.id);
    if ($ !== void 0) return $;
    let h = s;
    for (const u of e.cards)
      u.dependsOn?.includes(g.id) && (h = Math.min(h, b(u) - (u.duration ?? 1) - (u.lag ?? 0)));
    return l.set(g.id, h), h;
  };
  for (const g of e.cards) {
    const $ = o.get(g.id);
    $.slack = b(g) - $.end, $.critical = $.slack === 0;
  }
  return o;
}
function vt(e) {
  return Math.max(0, ...[...Te(e).values()].map((t) => t.end));
}
function to(e, t) {
  const o = /* @__PURE__ */ new Set(), n = (a) => {
    for (const s of e.cards) s.dependsOn?.includes(a) && !o.has(s.id) && (o.add(s.id), n(s.id));
  };
  return n(t), o;
}
function ze(e, t) {
  const o = e.launch?.day ?? 0, n = Te(e), a = t ? n.get(t) : void 0;
  if (a && a.end > o) return `That ends on day ${a.end}, after launch on day ${o}.`;
  const s = e.cards.map((l) => ({ card: l, end: n.get(l.id).end })).filter((l) => l.end > o).sort((l, b) => b.end - l.end)[0];
  return s ? `That pushes ${s.card.label} to day ${s.end}, after launch on day ${o}.` : null;
}
function oo(e) {
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
    Te(e);
  } catch (n) {
    return n.message;
  }
  const o = vt(e);
  if (o > t) {
    const n = Te(e);
    return `${e.cards.find((s) => n.get(s.id).end === o).label} ends on day ${o}, after launch on day ${t}.`;
  }
  return null;
}
function It(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || !e.lanes.some((a) => a.id === o) ? null : n.laneId === o ? e : { ...e, cards: e.cards.map((a) => a === n ? { ...n, laneId: o } : a) };
}
function ua(e, t, o) {
  return It(e, t, o) ? "" : "That move is not available.";
}
function ao(e, t, o) {
  const n = e.cards.find((s) => s.id === t), a = e.cards.find((s) => s.id === o);
  return !n || !a ? "That task is no longer on the plan." : n === a ? "A task can't wait on itself." : n.dependsOn?.includes(a.id) ? `${n.label} already waits on ${a.label}.` : to(e, n.id).has(a.id) ? `${a.label} already waits on ${n.label}, so ${n.label} can't wait on ${a.label}.` : (n.dependsOn?.length ?? 0) >= 3 ? `${n.label} already waits on 3 tasks.` : ze(En(e, t, o), t);
}
function En(e, t, o, n = !1) {
  const a = Te(e);
  return { ...e, cards: e.cards.map((s) => {
    if (s.id !== t) return s;
    const l = n ? (s.dependsOn ?? []).filter(($) => $ !== o) : [...s.dependsOn ?? [], o], b = Math.max(0, ...l.map(($) => a.get($)?.end ?? 0)), g = { ...s, dependsOn: l, lag: Math.max(0, a.get(s.id).start - b) };
    return l.length || delete g.dependsOn, g.lag || delete g.lag, g;
  }) };
}
function ro(e, t) {
  const o = Te(e), n = e.cards.filter((s) => s.laneId === t), a = n.filter((s) => o.get(s.id).critical).length;
  return `${n.length} ${n.length === 1 ? "task" : "tasks"} · ${a} on the critical path`;
}
function qe(e, t, o) {
  return t.field === "day" ? { ...e, launch: { day: o } } : { ...e, cards: e.cards.map((n) => n.id === t.cardId ? { ...n, [t.field]: o } : n) };
}
function ot(e, t) {
  const o = e.launch.day;
  if (t.field === "day") {
    const g = Te(e), $ = vt(e), h = e.cards.find((u) => g.get(u.id).end === $);
    return {
      field: "day",
      min: Math.max(5, $),
      max: 120,
      reasons: { min: h ? `${h.label} ends on day ${$}.` : void 0, max: "Launch day is at most day 120." }
    };
  }
  const n = e.cards.find((g) => g.id === t.cardId), a = t.field === "duration" ? 1 : 0, s = t.field === "duration" ? 60 : o;
  let l = n[t.field] ?? a;
  for (; l < s && !ze(qe(e, t, l + 1)); ) l++;
  const b = l < s ? ze(qe(e, t, l + 1), n.id) ?? void 0 : void 0;
  return {
    field: t.field,
    min: a,
    max: Math.max(a, l),
    reasons: {
      min: t.field === "duration" ? "A task takes at least 1 day." : `${n.label} starts as early as it can.`,
      max: b ?? (t.field === "duration" ? "A task takes at most 60 days." : `Launch is day ${o}.`)
    }
  };
}
function so(e) {
  return e.label + " · " + no(e.duration ?? 1);
}
function fa() {
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
const Je = (e) => !e.role;
function ha(e) {
  let t = 0;
  for (const o of e.cards) {
    const n = e.lanes.find((a) => a.id === o.laneId);
    t += (o.amount ?? 0) * (n.role === "won" ? 1 : n.role === "lost" ? 0 : n.probability ?? 0);
  }
  return Math.round(t);
}
function io(e) {
  if (e.lanes.length < 3) return "A pipeline has 3 to 5 stages.";
  if (e.cards.length > 16) return "A pipeline holds up to 16 deals.";
  if (!e.forecast) return "A pipeline needs a forecast target.";
  if (e.lanes.filter((n) => n.role === "won").length > 1 || e.lanes.filter((n) => n.role === "lost").length > 1)
    return "A pipeline has one Won stage and one Lost stage at most.";
  if (e.lanes.filter(Je).length < 1) return "A pipeline needs an open stage.";
  for (const n of e.lanes) {
    if (Je(n) && n.probability === void 0) return `Give ${n.label} a chance to win, from 0 to 100%.`;
    const a = e.cards.filter((s) => s.laneId === n.id).length;
    if (n.capacity !== void 0 && a > n.capacity) return `${n.label} already holds ${a} of ${n.capacity} deals.`;
  }
  const t = e.lanes.find((n) => n.role === "won"), o = t && e.cards.find((n) => n.laneId === t.id && n.amount === void 0);
  return o ? `${o.label} needs an amount before it can be won. Write it on the card, like '${o.label} $40k'.` : null;
}
function xt(e, t, o) {
  const n = e.cards.find((g) => g.id === t), a = e.lanes.find((g) => g.id === o);
  if (!n || !a) return "That move is not available.";
  const s = e.lanes.find((g) => g.id === n.laneId);
  if (s === a) return null;
  const l = e.lanes.filter(Je);
  if (s.role === "won" && a.role !== "lost") return "A won deal stays won. Move it to Lost if it fell through.";
  if (s.role === "lost" && a.role === "won") return `Reopen ${n.label} in an open stage first.`;
  if (a.role === "won" || Je(s) && Je(a) && l.indexOf(a) > l.indexOf(s)) {
    const g = l[l.indexOf(s) + 1] ?? e.lanes.find(($) => $.role === "won");
    if (g !== a) return `Deals move one stage at a time. ${n.label} is in ${s.label}, so ${g.label} comes first.`;
  }
  if (a.role === "won" && n.amount === void 0)
    return `${n.label} needs an amount before it can be won. Write it on the card, like '${n.label} $40k'.`;
  const b = e.cards.filter((g) => g.laneId === a.id).length;
  return a.capacity !== void 0 && b >= a.capacity ? `${a.label} already holds ${b} of ${a.capacity} deals.` : null;
}
function lo(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || xt(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function co(e, t) {
  const o = e.lanes.find((l) => l.id === t), n = e.cards.filter((l) => l.laneId === t), a = n.reduce((l, b) => l + (b.amount ?? 0), 0), s = o.role === "won" ? 1 : o.role === "lost" ? 0 : o.probability ?? 0;
  return `${n.length} ${n.length === 1 ? "deal" : "deals"} · ${q(a, e.forecast?.currency)} · ${Math.round(s * 100)}%`;
}
function An(e, t) {
  return t.field === "target" ? { field: "target", min: 1, max: 1e9, reasons: { min: "A target is more than nothing.", max: "A target is at most 1,000,000,000." } } : { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
}
function pa() {
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
function Pe(e, t) {
  return e.cards.reduce((o, n) => o + (n.laneId === t ? n.amount ?? 0 : 0), 0);
}
const at = (e, t) => Math.max(t.floor ?? 0, Pe(e, t.id));
function uo(e) {
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
    const a = Pe(e, n.id);
    if (a > n.allocation) return `${n.label} commits ${q(a, t.currency)} of ${q(n.allocation, t.currency)}.`;
  }
  return e.cards.some((n) => n.amount === void 0) ? "Give every line item a cost." : null;
}
function $t(e, t, o) {
  const n = e.cards.find((b) => b.id === t), a = e.lanes.find((b) => b.id === o);
  if (!n || !a) return "That move is not available.";
  if (n.laneId === o) return null;
  const s = (a.allocation ?? 0) - Pe(e, o), l = e.budget?.currency;
  return (n.amount ?? 0) > s ? `${a.label} has ${q(s, l)} left. ${n.label} costs ${q(n.amount ?? 0, l)}.` : null;
}
function fo(e, t, o) {
  const n = e.cards.find((a) => a.id === t);
  return !n || $t(e, t, o) !== null ? null : n.laneId === o ? e : { ...e, cards: [...e.cards.filter((a) => a !== n), { ...n, laneId: o }] };
}
function ho(e, t, o, n) {
  return { ...e, lanes: e.lanes.map((a) => a.id === t ? { ...a, allocation: (a.allocation ?? 0) - n } : a.id === o ? { ...a, allocation: (a.allocation ?? 0) + n } : a) };
}
function Fn(e, t, o) {
  const n = e.lanes.find((h) => h.id === t), a = e.lanes.find((h) => h.id === o), s = e.budget?.currency, l = (h, u) => {
    if (!u) return `${h.label}'s cap is ${q(h.cap, s)}.`;
    const v = Pe(e, h.id);
    return v >= (h.floor ?? 0) ? `${h.label} already commits ${q(v, s)}.` : `${h.label}'s floor is ${q(h.floor, s)}.`;
  }, b = (h) => h.reduce((u, v) => v.value < u.value ? v : u), g = b([
    { value: n.allocation - at(e, n), why: l(n, !0) },
    ...a.cap !== void 0 ? [{ value: a.cap - a.allocation, why: l(a, !1) }] : []
  ]), $ = b([
    { value: a.allocation - at(e, a), why: l(a, !0) },
    ...n.cap !== void 0 ? [{ value: n.cap - n.allocation, why: l(n, !1) }] : []
  ]);
  return { field: "amount", min: -$.value, max: g.value, reasons: { min: $.why, max: g.why } };
}
function po(e, t, o, n) {
  if (t === o) return "Choose two different teams.";
  if (!Number.isFinite(n) || !Number.isInteger(n)) return "Move a whole amount.";
  const a = Fn(e, t, o);
  if (n > a.max) return a.reasons.max;
  if (n < a.min) return a.reasons.min;
  const s = e.budget?.step;
  return s && n % s !== 0 && n !== a.max && n !== a.min ? `Move money in steps of ${q(s, e.budget?.currency)}.` : null;
}
function ma(e, t) {
  const o = e.lanes.findIndex((a) => a.id === t.laneId), n = e.lanes[o + 1];
  return o < 0 || !n ? { field: "amount", min: 0, max: 0, reasons: {} } : Fn(e, n.id, t.laneId);
}
function mo(e, t) {
  const o = e.lanes.find((a) => a.id === t), n = e.budget?.currency;
  return `${q(o.allocation ?? 0, n)} · ${q(Pe(e, t), n)} committed`;
}
function wa() {
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
const O = (e) => "“" + e.replace(/[“”]/g, '"') + "”", Ce = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], rt = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), Bn = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), Hn = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), ga = (e) => Bn(Hn(e)), wo = [
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
], go = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : wo.indexOf(e.toLowerCase()), yo = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function At(e, t) {
  const o = /* @__PURE__ */ new Set(), n = (a) => {
    const s = Bn(a);
    s && o.add(s);
  };
  n(e), n(Hn(e));
  for (const a of [...o]) n(a.replace(/^(?:the|my|our)\s+/i, ""));
  for (const a of [...o]) n(a.replace(new RegExp("^(?:" + t + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const a of [...o]) n(a.replace(new RegExp("\\s+(?:" + t + ")$", "i"), ""));
  return [...o];
}
const Sn = "[^\\p{L}\\p{N}]", st = [
  (e, t) => e === t,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, t) => e.startsWith(t + " · "),
  (e, t) => t.length > 1 && new RegExp("^" + rt(t) + "(?:$|" + Sn + ")", "u").test(e),
  (e, t) => t.length > 2 && new RegExp("(?:^|" + Sn + ")" + rt(t) + "(?:$|" + Sn + ")", "u").test(e)
], it = ["first", "second", "third", "fourth", "fifth"];
function ko(e, t, o) {
  const n = new RegExp("^(?:the\\s+)?(?:(" + it.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(Bn(Hn(t)));
  if (!n) return null;
  const a = (n[1] ?? n[2]).toLowerCase(), s = a === "last" ? e.length - 1 : n[1] ? it.indexOf(a) : go(a) - 1;
  return e[s] ?? null;
}
function Cn(e, t, o, n, a) {
  const s = At(t, o);
  if (s.some((b) => yo.test(b))) {
    const b = n && e.find((g) => g.id === n);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of s) {
    if (!b.startsWith("@")) continue;
    const g = e.find(($) => $.id === b.slice(1));
    if (g) return { item: g, rank: 0 };
  }
  for (const [b, g] of st.entries())
    for (const $ of s) {
      const h = e.filter((u) => g(u.label.toLowerCase(), $.toLowerCase()));
      if (h.length === 1) return { item: h[0], rank: b };
      if (h.length > 1) return { several: h };
    }
  const l = a ? ko(e, t, o) : null;
  return l ? { item: l, rank: st.length } : {};
}
class rn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(t, o, n = []) {
    super(t), this.reason = o, this.candidates = n;
  }
}
function Nn(e, t, o, n, a = !1) {
  return { find: (g) => {
    const $ = Cn(e, g, t, n, a);
    if ($.item) return $.item;
    const h = At(g, t), u = h[h.length - 1];
    if ($.pointing) throw new rn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if ($.several) {
      const k = [...new Set($.several.map((L) => L.label))];
      throw new rn(k.length === 1 ? $.several.length + " " + o + "s are called " + O(k[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + O(u) + ": " + Ce(k.slice(0, 6).map(O)) + ". Use the whole name.", "ambiguous", $.several.map((L) => L.id));
    }
    const v = e.map((k) => k.label);
    throw new rn("There is no " + o + " called " + O(u) + " here." + (v.length && v.length <= 6 ? " The " + o + "s are " + Ce(v.map(O)) + "." : v.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((k) => k.id));
  }, attempt: (g) => Cn(e, g, t, n, a).item ?? null, rank: (g) => Cn(e, g, t, n, a).rank ?? 1 / 0 };
}
const bo = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget"], we = [...bo], _e = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], St = ["launch-plan", "pipeline", "budget"];
function un(e) {
  if (e.lanes[0]?.station) return "map";
  const t = de(e);
  return t || (e.kind === "release-plan" ? "release-plan" : He(e) ?? "lanes");
}
const F = {
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
}, Mn = { "launch-plan": F.launchLanes, pipeline: F.pipelineLanes, budget: F.budgetLanes }, le = (e, t) => Object.fromEntries(we.filter((o) => !e.includes(o)).map((o) => [o, t])), ae = (e, t, o = !1) => ({ type: "text", max: e, about: t, ...o && { optional: o } }), Y = (e, t = !1) => ({ type: "ref", of: "lane", about: e, ...t && { optional: t } }), te = (e) => ({ type: "ref", of: "card", about: e }), On = (e) => ({ map: e }), he = le(["map"], F.notMap), pe = (e, t = 1e9, o = 0, n = !1) => ({ type: "integer", min: o, max: t, about: e, ...n && { optional: n } }), Dn = [
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
    fields: { card: te("The card or token."), label: ae(80, "The new name, 1 to 80 characters of plain text.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: ae(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, map: F.mapAddLane, ...Mn }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Y("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": F.releaseLanes, "customer-interviews": F.keepsLanes, "experiment-budget": F.keepsLanes, ...Mn }
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
    boards: ["lanes", "experiment-budget", "map", ...St],
    refusals: { "release-plan": F.releaseCards, "customer-interviews": F.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: te("The card or token.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: te("The card or token."), lane: Y("Where it goes.") },
    boards: we,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: te("The token.") },
    boards: ["map"],
    refusals: he
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Y("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: we.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": F.launchLanes, budget: F.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: te("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: _e,
    refusals: { ...On(F.mapCardLanes), ...le([..._e, "map"], F.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: te("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...le(["release-plan"], F.notPoints), map: F.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: te("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...le(["release-plan"], F.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: te("The card."),
      lane: Y("The lane."),
      whenPresent: ae(160, "What it says when the card is there."),
      whenAbsent: ae(160, "What it says otherwise."),
      label: ae(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: _e,
    refusals: { ...On(F.mapOutcome), ...le([..._e, "map"], F.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: te("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: _e,
    refusals: { ...On(F.mapOutcome), ...le([..._e, "map"], F.businessCards) }
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
    fields: { card: te("The task."), duration: pe("Its days, 1 to 60.", 60, 1, !0), lag: pe("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], F.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], F.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: te("The task that waits."), waitsOn: te("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: pe("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], F.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: te("The deal or line item."), amount: pe("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: le(["pipeline", "budget"], F.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: pe("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: le(["pipeline"], F.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Y("The team giving."), to: Y("The team receiving."), amount: pe("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: le(["budget"], F.notBudget)
  }
], vo = new Map(Dn.map((e) => [e.kind, e])), Io = (e, t) => typeof e == "number" ? e : (t && e[t]) ?? e.default;
function xo(e, t) {
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
      return { ...n({ type: "integer", minimum: e.min, maximum: Io(e.max, t) }, e.nullable), description: e.about };
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
const Ct = (e) => "optional" in e && e.optional === !0;
function ya(e) {
  const t = e ? un(V(e)) : void 0;
  return Dn.map((o) => {
    const n = Object.entries(o.fields), a = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...n.filter(([, l]) => !Ct(l)).map(([l]) => l)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(n.map(([l, b]) => [l, xo(b, t)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: a };
    return t && (s.accepted = o.boards.includes(t), s.accepted || (s.refusal = o.refusals[t])), s;
  });
}
const on = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function $o(e, t) {
  const o = !!e.lanes[0]?.station, n = Nn(e.lanes, o ? on.step : on.lane, o ? "step" : "lane", t?.kind === "lane" ? t.id : void 0, !0), a = Nn(e.cards, o ? on.token : on.card, o ? "token" : "card", t?.kind === "card" ? t.id : void 0);
  if (!o) return { lanes: n, cards: a };
  const s = (l) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(l.trim()) ? e.cards[0] : null;
  return { lanes: n, cards: {
    find: (l) => s(l) ?? a.find(l),
    attempt: (l) => s(l) ?? a.attempt(l),
    rank: (l) => s(l) ? 0 : a.rank(l)
  } };
}
class N {
  constructor(t, o, n = null, a, s, l) {
    this.reason = t, this.code = o, this.laneId = n, this.cardId = a, this.candidates = s, this.limits = l;
  }
}
function fn(e, t) {
  return t === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function G(e, t, o = null, n) {
  try {
    return V(e);
  } catch (a) {
    throw new N(fn(a instanceof Error ? a.message : String(a), t), "refused", o, n);
  }
}
function Ao(e, t) {
  for (const n of Object.keys(e)) if (n !== "kind" && !Object.prototype.hasOwnProperty.call(t.fields, n)) return t.kind + " does not take " + n + ".";
  const o = (n) => typeof n == "string" && n.trim().length > 0 || !!n && typeof n == "object" && !Array.isArray(n) && typeof n.id == "string" && Object.keys(n).length === 1;
  for (const [n, a] of Object.entries(t.fields)) {
    const s = e[n];
    if (s === void 0) {
      if (Ct(a)) continue;
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
        if (!s || typeof s != "object" || typeof s.src != "string" || typeof s.alt != "string" || Object.keys(s).some((b) => b !== "src" && b !== "alt")) return l + "{src, alt} or null.";
        break;
      case "choice":
        if (!a.values.includes(s)) return l + a.values.join(", ") + ".";
        break;
    }
  }
  return null;
}
function So(e, t, o, n) {
  const a = structuredClone(e), s = o === "map", l = o === "release-plan", b = $o(a, n), g = { lane: s ? "step" : "lane", card: s ? "token" : "card" };
  function $(r, f, A, I, C = null) {
    if (typeof A == "object") {
      const z = r.find((W) => W.id === A.id);
      if (!z) throw new N("That " + I + " is no longer on the workshop.", "gone", C);
      return z;
    }
    const P = r.find((z) => z.id === A);
    if (P) return P;
    try {
      return f.find(A);
    } catch (z) {
      if (!(z instanceof rn)) throw z;
      const W = z.reason === "ambiguous" ? "ambiguous_reference" : z.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new N(z.message, W, C, void 0, z.candidates.length ? z.candidates : void 0);
    }
  }
  const h = (r, f = null) => $(a.lanes, b.lanes, r, "lane", f), u = (r, f = null) => $(a.cards, b.cards, r, "card", f), v = (r) => {
    try {
      return h(r);
    } catch {
      return null;
    }
  }, k = (r, f, A = {}, I = !0) => ({ board: r, said: f, changed: I, ...A }), L = (r) => a.cards.filter((f) => f.laneId === r).length, R = (r) => s ? "The presentation opens with " + O(r[0].label) + "." : "The presentation now runs " + r.map((f) => O(f.label)).join(", then ") + ".";
  switch (t.kind) {
    case "rename_workshop": {
      a.title = t.title;
      const r = G(a, o);
      return k(r, "Renamed the " + (s ? "map" : "workshop") + " to " + O(r.title) + ".");
    }
    case "rename_lane": {
      const r = h(t.lane), f = r.label;
      r.label = t.label;
      const A = G(a, o, r.id);
      return k(A, "Renamed " + O(f) + " to " + O(A.lanes.find((I) => I.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = u(t.card), f = r.label;
      r.label = t.label;
      const A = G(a, o, r.laneId, r.id);
      return k(A, "Renamed " + O(f) + " to " + O(A.cards.find((I) => I.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (a.lanes.length >= 5) throw new N("A workshop can have up to five lanes. Remove one first.", "refused");
      if (t.capacity !== void 0 && (!Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > 24))
        throw new N("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Jo(a, { label: t.label, ...t.capacity !== void 0 && { capacity: t.capacity } });
      } catch (A) {
        throw new N(fn(A.message, o), "refused");
      }
      const f = r.lanes[r.lanes.length - 1];
      return k(r, "Added the lane " + O(f.label) + ".", { laneId: f.id });
    }
    case "remove_lane": {
      const r = h(t.lane), f = a.cards.filter((A) => A.laneId === r.id);
      if (s) {
        if (f.length) throw new N(O(f[0].label) + " is at " + O(r.label) + ". Move it to another step first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new N("A map needs at least two steps.", "refused", r.id);
      } else {
        if (f.length) throw new N(O(r.label) + " holds " + f.length + (f.length === 1 ? " card" : " cards") + ". Move or remove " + (f.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (a.lanes.length <= 2) throw new N("A workshop needs at least two lanes.", "refused", r.id);
      }
      a.lanes = a.lanes.filter((A) => A !== r);
      for (const A of a.lanes) A.station && (A.station.next = A.station.next.filter((I) => I !== r.id));
      a.presentationOrder && (a.presentationOrder = a.presentationOrder.filter((A) => A !== r.id));
      for (const A of a.cards) A.allowedLaneIds && (A.allowedLaneIds = A.allowedLaneIds.filter((I) => I !== r.id));
      return an(a, (A) => A.laneId === r.id), k(G(a, o), "Removed the " + g.lane + " " + O(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = h(t.lane);
      if (s) {
        if (t.allowedLanes !== void 0) throw new N(F.mapCardLanes, "not_on_this_board", r.id);
        let P = t.label;
        if (P === void 0) {
          let D = a.cards.length + 1;
          for (; a.cards.some((be) => be.label === "Token " + D); ) D++;
          P = "Token " + D;
        }
        const z = new Set([...a.lanes, ...a.cards].map((D) => D.id));
        let W = 1;
        for (; z.has("token-" + W); ) W++;
        a.cards.push({ id: "token-" + W, label: P, laneId: r.id });
        const _ = G(a, o, r.id);
        return k(_, "Added " + O(_.cards[_.cards.length - 1].label) + " at " + O(r.label) + ".", { laneId: r.id, cardId: "token-" + W });
      }
      const f = ["duration", "lag", "waitsOn", "amount"].find((P) => t[P] !== void 0 && !(o === "launch-plan" ? P !== "amount" : (o === "pipeline" || o === "budget") && P === "amount"));
      if (f) throw new N(f === "amount" ? F.notAmounts : F.notTasks, "not_on_this_board", r.id);
      if (St.includes(o)) return K(r);
      if (t.label === void 0 || !t.label.trim()) throw new N("Say what the card should say, such as “Add a card called New idea to " + r.label + "”.", "refused", r.id);
      if (a.cards.length >= 24) throw new N("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && L(r.id) >= r.capacity)
        throw new N(O(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const A = t.allowedLanes && [...new Set(t.allowedLanes.map((P) => h(P).id))];
      let I;
      try {
        I = Yo(a, r.id, { label: t.label, ...A && { allowedLaneIds: A } });
      } catch (P) {
        throw new N(fn(P.message, o), "refused", r.id);
      }
      const C = I.cards[I.cards.length - 1];
      return k(I, "Added " + O(C.label) + " to " + O(r.label) + ".", { laneId: r.id, cardId: C.id });
    }
    case "remove_card": {
      const r = u(t.card);
      if (s && a.cards.length === 1) throw new N("A map needs at least one token.", "refused", r.laneId, r.id);
      if (l && a.cards.length === 1) throw new N("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && a.cards.length === 1) throw new N("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      a.cards = a.cards.filter((f) => f !== r);
      for (const f of a.cards)
        f.dependsOn?.includes(r.id) && (f.dependsOn = f.dependsOn.filter((A) => A !== r.id), f.dependsOn.length || delete f.dependsOn);
      return an(a, (f) => f.cardId === r.id), k(G(a, o, r.laneId), "Removed the " + g.card + " " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof t.lane == "object" ? a.lanes.find((I) => I.id === t.lane.id) ?? null : v(t.lane), f = u(t.card, r?.id ?? null), A = h(t.lane, f.laneId);
      return E(f, A);
    }
    case "advance_card": {
      const r = u(t.card), f = a.lanes.find((I) => I.id === r.laneId), A = f.station.next.map((I) => a.lanes.find((C) => C.id === I)).filter((I) => !!I);
      if (!A.length) throw new N(O(r.label) + " is at " + O(f.label) + ", and no path leads on from there.", "refused", f.id, r.id);
      if (A.length > 1)
        throw new N("From " + O(f.label) + " the path goes to " + A.map((I) => O(I.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + A[0].label + "”.", "refused", f.id, r.id);
      return E(r, A[0]);
    }
    case "set_lane_capacity": {
      const r = h(t.lane), f = s ? "token" : l ? "point" : "card";
      if (t.capacity === null)
        return delete r.capacity, k(G(a, o, r.id), s ? "Removed the limit at " + O(r.label) + "." : O(r.label) + " now holds any number of " + f + "s.", { laneId: r.id });
      const A = l ? 576 : 24;
      if (!Number.isInteger(t.capacity) || t.capacity < 1 || t.capacity > A)
        throw new N((s ? "A step" : "A lane") + " can hold from 1 to " + A + " " + f + "s.", "refused", r.id);
      const I = l ? a.cards.reduce((C, P) => C + (P.laneId === r.id ? P.points ?? 1 : 0), 0) : L(r.id);
      if (I > t.capacity)
        throw new N(O(r.label) + " already holds " + I + " " + f + (I === 1 ? "" : "s") + ". Move some " + (s ? "on" : "out") + " first, or choose a higher " + (l ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = t.capacity, k(G(a, o, r.id), O(r.label) + " now holds up to " + t.capacity + " " + f + (t.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = u(t.card);
      if (t.lanes === null)
        return delete r.allowedLaneIds, k(G(a, o, r.laneId, r.id), O(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const f = [...new Set(t.lanes.map((I) => h(I)))], A = a.lanes.find((I) => I.id === r.laneId);
      if (!f.includes(A)) throw new N(O(r.label) + " is in " + O(A.label) + " now. Include " + O(A.label) + ", or move the card first.", "refused", A.id, r.id);
      return r.allowedLaneIds = f.map((I) => I.id), k(G(a, o, r.laneId, r.id), O(r.label) + " can now go only in " + Ce(f.map((I) => O(I.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = u(t.card);
      if (!Number.isInteger(t.points) || t.points < 1 || t.points > 24) throw new N("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = t.points, k(G(a, o, r.laneId, r.id), O(r.label) + " now takes " + t.points + (t.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = u(t.card), f = [...new Set(t.dependsOn.map((I) => u(I)))], A = { laneId: r.laneId, cardId: r.id };
      if (t.mode === "remove") {
        const I = f.filter((C) => r.dependsOn?.includes(C.id));
        if (!I.length) throw new N(O(r.label) + " does not depend on " + Ce(f.map((C) => O(C.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((C) => !I.some((P) => P.id === C)), r.dependsOn.length || delete r.dependsOn, k(G(a, o, r.laneId, r.id), O(r.label) + " no longer depends on " + Ce(I.map((C) => O(C.label))) + ".", A);
      }
      if (!f.length) {
        if (t.mode === "add") throw new N("Name the features " + O(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, k(G(a, o, r.laneId, r.id), O(r.label) + " no longer depends on anything.", A);
      }
      if (f.includes(r)) throw new N("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...t.mode === "add" ? r.dependsOn ?? [] : [], ...f.map((I) => I.id)])], k(G(a, o, r.laneId, r.id), O(r.label) + " now depends on " + Ce(f.map((I) => O(I.label))) + ".", A);
    }
    case "set_outcome": {
      const r = u(t.card), f = h(t.lane), A = a.signals ?? (a.signals = []), I = t.label, C = I === void 0 ? A.filter((_) => _.cardId === r.id && _.laneId === f.id) : A.filter((_) => _.cardId === r.id && _.label.toLowerCase() === I.toLowerCase());
      if (I !== void 0 && C.length > 1) throw new N("Two outcomes on this card have that name.", "refused", f.id, r.id);
      if (!C.length && A.length >= 24) throw new N("A workshop can have up to 24 outcomes. Remove one first.", "refused", f.id, r.id);
      let P = 1;
      for (; A.some((_) => _.id === "signal-" + P); ) P++;
      const W = { label: I ?? C[0]?.label ?? (r.label + " in " + f.label).slice(0, 80).trim(), cardId: r.id, laneId: f.id, whenPresent: t.whenPresent, whenAbsent: t.whenAbsent };
      return C.length ? Object.assign(C[0], W) : A.push({ id: "signal-" + P, ...W }), k(G(a, o, f.id, r.id), "When " + O(r.label) + " is in " + O(f.label) + " the workshop says " + O(t.whenPresent) + ". Otherwise it says " + O(t.whenAbsent) + ".", { laneId: f.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = u(t.card), f = (a.signals ?? []).filter((A) => A.cardId === r.id);
      if (t.outcome === void 0) {
        if (!f.length) throw new N(O(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        an(a, (A) => A.cardId === r.id);
      } else {
        const A = $(f, Nn(f, "outcomes?", "outcome"), t.outcome, "outcome", r.laneId);
        an(a, (I) => I.id === A.id);
      }
      return k(G(a, o, r.laneId, r.id), "Removed the outcome from " + O(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = t.lanes.map((f) => h(f));
      if (r.length !== a.lanes.length || new Set(r).size !== a.lanes.length) throw new N("Include each scene once in the presentation order.", "refused");
      return a.presentationOrder = r.map((f) => f.id), k(G(a, o), R(r));
    }
    case "present_lane": {
      if (t.before !== void 0 && t.after !== void 0) throw new N("Say before or after, not both.", "invalid_edit");
      const r = h(t.lane), f = t.before ?? t.after, A = f === void 0 ? void 0 : h(f);
      if (A && A.id === r.id) throw new N("Choose two different scenes.", "refused", r.id);
      const I = Gn(a).filter((C) => C.id !== r.id);
      return I.splice(A ? I.findIndex((C) => C.id === A.id) + (t.after !== void 0 ? 1 : 0) : 0, 0, r), a.presentationOrder = I.map((C) => C.id), k(G(a, o, r.id), R(I), { laneId: r.id });
    }
    case "add_station": {
      const r = h(t.from);
      let f;
      try {
        f = gt(a, r.id, { label: t.label, outcome: t.outcome ?? t.label });
      } catch (I) {
        throw new N(I.message, "refused", r.id);
      }
      const A = f.lanes[f.lanes.length - 1];
      return k(f, "Added a path from " + O(r.label) + " to " + O(A.label) + ".", { laneId: A.id });
    }
    case "insert_station": {
      const r = h(t.before), f = t.from === void 0 ? void 0 : h(t.from), A = f ? [f] : a.lanes.filter((P) => P.station.next.includes(r.id));
      if (f && !f.station.next.includes(r.id))
        throw new N("There is no path from " + O(f.label) + " to " + O(r.label) + ". Try “Add " + t.label + " after " + f.label + "”.", "refused", f.id);
      if (!A.length) throw new N("Nothing leads to " + O(r.label) + " yet. Try “Add " + t.label + " after " + r.label + "”.", "refused", r.id);
      let I;
      try {
        I = gt(a, A[0].id, { label: t.label, outcome: t.outcome ?? t.label });
      } catch (P) {
        throw new N(P.message, "refused", r.id);
      }
      const C = I.lanes[I.lanes.length - 1];
      for (const P of I.lanes)
        A.some((z) => z.id === P.id) && (P.station.next = [...new Set(P.station.next.map((z) => z === r.id ? C.id : z))]);
      return C.station.next = [r.id], k(G(I, o, C.id), "Added " + O(C.label) + " before " + O(r.label) + ".", { laneId: C.id });
    }
    case "connect_stations": {
      const r = h(t.from), f = h(t.to);
      if (r.id === f.id) throw new N("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(f.id) ? k(a, O(r.label) + " already leads to " + O(f.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(f.id), k(G(a, o, r.id), "Connected " + O(r.label) + " to " + O(f.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = h(t.from), f = h(t.to);
      if (!r.station.next.includes(f.id)) throw new N("There is no path between " + O(r.label) + " and " + O(f.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((A) => A !== f.id), k(G(a, o, r.id), "Removed the path from " + O(r.label) + " to " + O(f.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = h(t.station);
      return r.station.outcome = t.outcome, k(G(a, o, r.id), "Changed what happens at " + O(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = h(t.station);
      return Object.assign(r.station, { column: t.column, row: t.row }), k(G(a, o, r.id), "Moved " + O(r.label) + " to column " + (t.column + 1) + ", row " + (t.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = h(t.station);
      return t.image === null ? (delete r.station.image, k(G(a, o, r.id), "Removed the image at " + O(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: t.image.src, alt: t.image.alt }, k(G(a, o, r.id), "Updated the image at " + O(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = h(t.station);
      if (!r.station.image) throw new N("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = t.alt, k(G(a, o, r.id), "Updated the image description at " + O(r.label) + ".", { laneId: r.id });
    }
    case "set_task": {
      const r = u(t.card);
      if (t.duration === void 0 && t.lag === void 0) throw new N("Say how many days " + O(r.label) + " takes, or waits.", "invalid_edit", r.laneId, r.id);
      let f = a;
      for (const I of ["duration", "lag"]) {
        const C = t[I];
        if (C === void 0) continue;
        const P = ot(f, { cardId: r.id, field: I });
        if (!Number.isInteger(C)) throw new N("A task's days are whole days.", "refused", r.laneId, r.id, void 0, P);
        const z = qe(f, { cardId: r.id, field: I }, C);
        if (C < P.min || C > P.max)
          throw new N(C < P.min ? P.reasons.min : ze(z, r.id) ?? P.reasons.max, "refused", r.laneId, r.id, void 0, P);
        f = z;
      }
      const A = f.cards.find((I) => I.id === r.id);
      return k(G(f, o, r.laneId, r.id), O(r.label) + " now takes " + A.duration + (A.duration === 1 ? " day" : " days") + (A.lag ? " and waits " + A.lag + (A.lag === 1 ? " day." : " days.") : "."), { laneId: r.laneId, cardId: r.id });
    }
    case "link_tasks":
    case "unlink_tasks": {
      const r = u(t.card), f = u(t.waitsOn), A = { laneId: r.laneId, cardId: r.id };
      if (t.kind === "unlink_tasks") {
        if (!r.dependsOn?.includes(f.id)) throw new N(O(r.label) + " doesn’t wait on " + O(f.label) + ".", "refused", r.laneId, r.id);
        return k(G(En(a, r.id, f.id, !0), o, r.laneId, r.id), O(r.label) + " no longer waits on " + O(f.label) + ".", A);
      }
      const I = ao(a, r.id, f.id);
      if (I) throw new N(I, "refused", r.laneId, r.id);
      return k(G(En(a, r.id, f.id), o, r.laneId, r.id), O(r.label) + " now waits on " + O(f.label) + ".", A);
    }
    case "set_launch_day": {
      const r = ot(a, { field: "day" });
      if (!Number.isInteger(t.day) || t.day < r.min || t.day > r.max) {
        const f = qe(a, { field: "day" }, t.day);
        throw new N(t.day < r.min && ze(f) || (t.day < r.min ? r.reasons.min : r.reasons.max), "refused", null, void 0, void 0, r);
      }
      return k(G(qe(a, { field: "day" }, t.day), o), "Launch is now day " + t.day + ".");
    }
    case "set_amount": {
      const r = u(t.card), f = a.forecast?.currency ?? a.budget?.currency;
      let A = An(a, { field: "amount" });
      if (o === "budget") {
        const I = a.lanes.find((P) => P.id === r.laneId), C = I.allocation - Pe(a, I.id) + (r.amount ?? 0);
        if (A = { field: "amount", min: 1, max: C, reasons: { min: "A line item costs something.", max: O(I.label) + " has " + q(C, f) + " for it." } }, t.amount > C) throw new N(I.label + " has " + q(C - (r.amount ?? 0), f) + " left. " + r.label + " costs " + q(t.amount, f) + ".", "refused", I.id, r.id, void 0, A);
      }
      if (!Number.isInteger(t.amount) || t.amount < A.min || t.amount > A.max)
        throw new N(t.amount < A.min ? A.reasons.min : A.reasons.max, "refused", r.laneId, r.id, void 0, A);
      return r.amount = t.amount, k(G(a, o, r.laneId, r.id), O(r.label) + " is now " + q(t.amount, f) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_target": {
      const r = An(a, { field: "target" });
      if (!Number.isInteger(t.amount) || t.amount < 1 || t.amount > r.max) throw new N(t.amount < 1 ? r.reasons.min : r.reasons.max, "refused", null, void 0, void 0, r);
      return a.forecast.target = t.amount, k(G(a, o), "The target is now " + q(t.amount, a.forecast.currency) + ".");
    }
    case "shift_budget": {
      const r = h(t.from), f = h(t.to), A = po(a, r.id, f.id, t.amount);
      if (A) throw new N(A, "refused", r.id, void 0, void 0, r.id === f.id ? void 0 : Fn(a, r.id, f.id));
      return k(G(ho(a, r.id, f.id, t.amount), o, f.id), "Moved " + q(t.amount, a.budget.currency) + " from " + O(r.label) + " to " + O(f.label) + ".", { laneId: f.id });
    }
  }
  function K(r) {
    if (t.kind !== "add_card") throw new Error("add_card only");
    const f = t.label?.trim();
    if (!f) throw new N("Say what the card should say, such as “Add Docs to " + r.label + "”.", "refused", r.id);
    const A = new Set([...a.lanes, ...a.cards].map((_) => _.id));
    let I = 1;
    for (; A.has("card-" + I); ) I++;
    const C = { id: "card-" + I, label: f, laneId: r.id }, P = a.forecast?.currency ?? a.budget?.currency;
    if (o === "launch-plan") {
      C.duration = t.duration ?? 2, t.lag && (C.lag = t.lag);
      const _ = [...new Set((t.waitsOn ?? []).map((D) => u(D).id))];
      _.length && (C.dependsOn = _);
    } else t.amount !== void 0 && (C.amount = t.amount);
    if (o === "budget" && t.amount === void 0) throw new N("Give the line item a cost, like 'Contractor $45k'.", "refused", r.id);
    if (t.amount !== void 0 && o !== "launch-plan") {
      const _ = An(a, { field: "amount" }), D = o === "budget" ? 1 : _.min;
      if (!Number.isInteger(t.amount) || t.amount < D)
        throw new N(o === "budget" ? "A line item costs something." : _.reasons.min, "refused", r.id, void 0, void 0, { ..._, min: D });
      if (t.amount > _.max) throw new N(_.reasons.max, "refused", r.id, void 0, void 0, _);
    }
    if (o === "pipeline" && r.role) throw new N("A new deal starts in an open stage, not in " + r.label + ".", "refused", r.id);
    const z = a.cards.filter((_) => _.laneId === r.id);
    if (o === "pipeline" && r.capacity !== void 0 && z.length >= r.capacity) throw new N(r.label + " already holds " + z.length + " of " + r.capacity + " deals.", "refused", r.id);
    if (o === "budget") {
      const _ = r.allocation - Pe(a, r.id);
      if (C.amount > _) throw new N(r.label + " has " + q(_, P) + " left. " + f + " costs " + q(C.amount, P) + ".", "refused", r.id);
    }
    const W = { ...a, cards: [...a.cards, C] };
    if (o === "launch-plan") {
      const _ = ze(W, C.id);
      if (_) throw new N(_, "refused", r.id);
    }
    return k(G(W, o, r.id), "Added " + O(f) + " to " + O(r.label) + ".", { laneId: r.id, cardId: C.id });
  }
  function E(r, f) {
    const A = { laneId: f.id, cardId: r.id };
    if (r.laneId === f.id)
      return k(e, O(r.label) + " is already " + (s ? "at " : "in ") + O(f.label) + ".", A, !1);
    const I = Be(e, r.id, f.id);
    if (!I) throw new N(sn(e, r.id, f.id) ?? "That move is not available.", "refused", f.id, r.id);
    return k(G(I, o, f.id, r.id), "Moved " + O(r.label) + " to " + O(f.label) + ".", A);
  }
}
function an(e, t) {
  e.signals && (e.signals = e.signals.filter((o) => !t(o)), e.signals.length || delete e.signals);
}
function Ue(e, t, o = {}) {
  const n = ($) => ({ refused: { index: 0, kind: null, laneId: null, ...$ } });
  let a;
  try {
    a = V(e);
  } catch ($) {
    return n({ reason: "The workshop cannot be read: " + ($ instanceof Error ? $.message : String($)), code: "invalid_board" });
  }
  if (!Array.isArray(t) || t.length < 1 || t.length > 50) return n({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = a, l = [];
  for (const [$, h] of t.entries()) {
    const u = h?.kind, v = typeof u == "string" ? vo.get(u) : void 0;
    if (!h || typeof h != "object" || !v)
      return n({
        index: $,
        kind: typeof u == "string" ? u : null,
        code: "invalid_edit",
        reason: "There is no edit called " + O(String(u)) + ". The edits are " + Ce(Dn.map((E) => E.kind)) + "."
      });
    const k = Ao(h, v);
    if (k) return n({ index: $, kind: v.kind, code: "invalid_edit", reason: k });
    const L = un(a);
    if (!v.boards.includes(L))
      return n({ index: $, kind: v.kind, code: "not_on_this_board", reason: v.refusals[L] ?? "This workshop does not take " + v.kind + "." });
    let R;
    try {
      R = So(a, h, L, o.selection);
    } catch (E) {
      if (!(E instanceof N)) throw E;
      return n({
        index: $,
        kind: v.kind,
        reason: E.reason,
        code: E.code,
        laneId: E.laneId,
        ...E.cardId && { cardId: E.cardId },
        ...E.candidates && { candidates: E.candidates },
        ...E.limits && { limits: E.limits }
      });
    }
    const K = Oo(a, R.board);
    if (K) return n({ index: $, kind: v.kind, reason: K, code: "not_on_this_board", laneId: R.laneId ?? null });
    a = R.board, l.push({
      index: $,
      kind: v.kind,
      said: R.said,
      changed: R.changed ?? !0,
      ...R.laneId && { laneId: R.laneId },
      ...R.cardId && { cardId: R.cardId }
    });
  }
  const b = new Map(s.cards.map(($) => [$.id, $.laneId])), g = a.cards.flatMap(($) => {
    const h = b.get($.id);
    return h === void 0 || h === $.laneId ? [] : [{ cardId: $.id, fromLaneId: h, toLaneId: $.laneId }];
  });
  return { workshop: a, report: { edits: l, movedCards: g } };
}
const Co = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget"
};
function Oo(e, t) {
  const o = V(e), n = un(o);
  let a;
  try {
    a = V(t);
  } catch (g) {
    return fn(g instanceof Error ? g.message : String(g), n);
  }
  const s = un(a), l = (g, $) => g.lanes.length === $.lanes.length && g.lanes.every((h) => $.lanes.some((u) => u.id === h.id)), b = (g, $) => g.lanes.every((h, u) => $.lanes[u]?.id === h.id);
  if ((n === "customer-interviews" || n === "experiment-budget") && s !== n)
    return l(o, a) ? F.keepsCards : F.keepsLanes;
  if ((n === "customer-interviews" || n === "experiment-budget") && !b(o, a)) return F.keepsOrder;
  if (de(o) && s === n && !(l(o, a) && b(o, a))) return Mn[n];
  if (n === "release-plan" && s === "release-plan") {
    if (!l(o, a)) return F.releaseLanes;
    if (!b(o, a)) return F.releaseOrder;
    if (a.cards.some((g) => !o.cards.some(($) => $.id === g.id))) return F.releaseCards;
  }
  return n !== s ? "This slate holds a " + Co[n] + ", and it stays one. Start a new slate for another kind of workshop." : null;
}
const ka = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function ba(e) {
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
    let b = s.after;
    for (; b !== null; ) {
      if (l.has(b) || !n.has(b) || a.includes(s.id) && !a.includes(b)) return null;
      l.add(b), b = n.get(b).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: a };
}
function To(e, t) {
  const o = e.panels.find((n) => n.id === t);
  return !!o && !e.hung.includes(t) && (o.after === null || e.hung.includes(o.after));
}
function va(e, t) {
  return To(e, t) ? { ...e, hung: [...e.hung, t] } : e;
}
const Ot = ["firstPrint", "secondPrint", "thirdPrint"], Tt = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Ia(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const t = e;
  if (t.kind !== void 0 && t.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (t.version !== 1) throw new Error("Unknown darkroom version.");
  if (t.route !== null && t.route !== "start" && t.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...Tt, route: t.route };
  for (const n of Ot) {
    const a = t[n];
    if (typeof a != "string" || !a.trim() || a.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[n] = a.trim();
  }
  return o;
}
function xa(e = new URLSearchParams()) {
  const t = { ...Tt };
  for (const n of Ot) {
    const a = e.get(n)?.trim();
    a && a.length <= 48 && (t[n] = a);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (t.route = o), t;
}
function $a(e) {
  const t = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + t;
}
function Po(e) {
  const t = { ...e };
  return e.xPos !== void 0 && t.x === void 0 && (t.x = e.xPos, delete t.xPos), e.yPos !== void 0 && t.y === void 0 && (t.y = e.yPos, delete t.yPos), e.foregroundColor !== void 0 && t.fontColor === void 0 && (t.fontColor = e.foregroundColor, delete t.foregroundColor), e.shapeHint !== void 0 && t.shape === void 0 && (t.shape = Mo(e.shapeHint), delete t.shapeHint), e.svgString !== void 0 && t.svgContent === void 0 && (t.svgContent = e.svgString, delete t.svgString), e.blnStraight !== void 0 && (t.isStraightLine = e.blnStraight, delete t.blnStraight), Eo(t), t;
}
function Lo(e) {
  if (!e || typeof e != "object") return !1;
  const t = e;
  return t.width !== void 0 || t.height !== void 0;
}
function Eo(e) {
  return e && Lo(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function lt(e) {
  const t = { ...e };
  return t.xPos = e.x, t.yPos = e.y, t.foregroundColor = e.fontColor, e.shape && (t.shapeHint = e.shape), e.svgContent && (t.svgString = e.svgContent), t;
}
function No(e) {
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
function Mo(e) {
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
function Tn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const dt = "#1f7a5c", ct = "#5b9a85", Pn = "#c2410c", _o = "#2f5fd0", Ro = { canMove: !1, canSelect: !1 };
function Wo(e) {
  const t = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return t ? { kind: t[1], key: t[2] } : null;
}
function Aa(e, t, o = {}) {
  let n = V(t);
  const a = o.kit, s = (i) => !!de(i) && !a;
  if (s(n) && !o.readOnly) throw new Error(`A ${n.kind} board needs its kit: pass kit: kitFor('${n.kind}') from slateboxjs/boards.`);
  const l = a?.layer(e);
  let b = null, g = null, $ = !!o.readOnly, h = $ || s(n), u = !1;
  const v = /* @__PURE__ */ new Map(), k = /* @__PURE__ */ new Map(), L = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), K = /* @__PURE__ */ new Map();
  let E = null, r = null, f = null;
  const A = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map();
  let C = null, P = null;
  function z(i, d) {
    P && clearTimeout(P.timer), P = { name: i, reason: d, timer: setTimeout(() => {
      P = null, u || H(g ?? n);
    }, 3e3) };
  }
  let W = Promise.resolve(), _ = null, D = ft(o.layout);
  const be = { ...o.style };
  let re = /* @__PURE__ */ new Map(), ve = /* @__PURE__ */ new Set(), Le = null, ne = !1;
  Ee(n);
  const J = o.origin ? { x: o.origin.x, y: o.origin.y } : Fo(e), Ie = (i) => K.get(i) ?? i, se = (i) => Wo(Ie(i));
  function oe(i) {
    const d = R.get(i);
    if (d) return d;
    if (v.has(i) && !K.has(i) || !e.nodes.one?.(i)) return i;
    const m = Bt(i, (y) => !!e.nodes.one?.(y) || K.has(y));
    return R.set(i, m), K.set(m, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${m}".`), m;
  }
  const xe = {
    governs(i) {
      if (v.get(i.id) !== i) return null;
      const d = se(i.id)?.kind;
      return d === "card" ? { canMove: !h, canEditText: !h && !g && n.kind !== "release-plan" } : d === "lane" ? { canMove: !1, canEditText: !h && !g } : d === "handle" ? { canMove: !h && !g, canEditText: !1 } : Ro;
    },
    onStart(i, d) {
      const m = se(i.id), y = { x: d.x - (i.options.x ?? 0), y: d.y - (i.options.y ?? 0) };
      if (m.kind === "handle") {
        const p = !h && !g && a ? a.handleDrag(n, Ie(i.id), y, D) : null;
        return p ? (Z(), Ae(), P && (clearTimeout(P.timer), P = null), b = { name: Ie(i.id), follow: p, last: null }, !0) : !1;
      }
      const S = m.key;
      if (h || g || !n.cards.some((p) => p.id === S)) return !1;
      Z(), Ae();
      let c = null;
      try {
        c = (a?.chooser ?? o.chooseCandidate)?.(n, S, y, D) ?? null;
      } catch (p) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", p);
      }
      return E = { cardId: S, evaluate: c, grab: y, outcome: { kind: "home" } }, H(n, { skip: S }), !0;
    },
    onMove(i, d) {
      if (b) {
        b.last = b.follow(xn(d)), H(b.last.next, { grip: b.name }), U(o.onPreview, b.last.next === n ? null : b.last.next);
        return;
      }
      if (!E) return;
      const m = Jn(E.cardId, d, E.evaluate);
      if (zo(m, E.outcome)) return;
      E.outcome = m;
      const y = m.kind === "candidate" ? m.next : null;
      H(y ?? n, { skip: E.cardId }), U(o.onPreview, y);
    },
    onEnd(i, d) {
      if (b) {
        const { follow: p, name: w } = b, x = p(xn(d));
        b = null, U(o.onPreview, null), x.refusal ? (z(w, x.refusal), H(n), e.announce?.(x.refusal), U(o.onRefuse, { laneId: null, reason: x.refusal })) : nn(x.next, {}) || H(n);
        const M = $n(n, w);
        return M ? { accept: !0, settle: M } : { accept: !1 };
      }
      if (!E) return { accept: !1 };
      const { cardId: m, evaluate: y } = E, S = Jn(m, d, y), c = n.cards.find((p) => p.id === m);
      if (E = null, U(o.onPreview, null), S.kind === "candidate" && a) {
        if (!nn(S.next, { cardId: m, laneId: S.laneId }, m))
          return H(n, { skip: m }), { accept: !1 };
        const p = $n(n, Ie(i.id));
        return p ? { accept: !0, settle: p } : { accept: !0 };
      }
      if (S.kind === "candidate") {
        n = S.next, H(n, { skip: m });
        const p = n.lanes.find((x) => x.id === S.laneId);
        e.announce?.(`${c.label} moved to ${p.label}. ${ge(n, p.id)}.`), U(o.onChange, n, { cardId: m, laneId: S.laneId });
        const w = $n(n, Ie(i.id));
        return w ? { accept: !0, settle: w } : { accept: !0 };
      }
      if (S.kind === "refused")
        Yt(c.label, { cardId: m, laneId: S.laneId, reason: S.reason });
      else if (S.kind === "outside" && ln(n) && !Ve()) {
        const p = dn(n, m);
        if (!p)
          return In(m, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        H(n, { skip: m }), e.announce?.(p), U(o.onRefuse, { cardId: m, laneId: null, reason: p });
      } else
        H(n, { skip: m }), S.kind === "outside" && (e.announce?.(`${c.label} was not dropped on a lane. It stays where it was.`), U(o.onRefuse, { cardId: m, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (b) {
        b = null, U(o.onPreview, null), H(n);
        return;
      }
      const d = E && n.cards.find((m) => m.id === E.cardId);
      E = null, U(o.onPreview, null), H(n, { skip: se(i.id)?.key }), d && e.announce?.(`Move cancelled. ${d.label} stays where it was.`);
    },
    onTextCommit(i, d, m) {
      const y = se(i.id);
      if (!y || h || g) return !1;
      let S = d.replace(/\s+/g, " ").trim();
      const c = [], p = de(n) && y.kind === "card" ? bt(S) : null;
      p?.label && (S = p.label, p.days !== void 0 && n.kind === "launch-plan" && c.push({ kind: "set_task", card: { id: y.key }, duration: p.days }), p.amount !== void 0 && n.kind !== "launch-plan" && c.push({ kind: "set_amount", card: { id: y.key }, amount: p.amount }));
      const w = y.kind === "lane" ? { laneId: y.key, label: S } : { cardId: y.key, label: S };
      c.unshift(y.kind === "lane" ? { kind: "rename_lane", lane: { id: y.key }, label: S } : { kind: "rename_card", card: { id: y.key }, label: S });
      const x = Ue(n, c);
      if ("refused" in x) {
        const { reason: M } = x.refused;
        return e.announce?.(`${m} keeps its name. ${M}`), U(o.onRefuse, { ...y.kind === "lane" ? { laneId: y.key } : { cardId: y.key }, rename: w, reason: M }), !1;
      }
      return JSON.stringify(x.workshop) === JSON.stringify(n) ? (H(n), !1) : (n = x.workshop, H(n), e.announce?.(p ? x.report.edits.map((M) => M.said).join(" ") : `${m} renamed to ${S}.`), U(o.onChange, n, { rename: w, ...a ? { edits: c } : {} }), p ? !1 : S);
    },
    onKeyDown(i, d) {
      const m = se(i.id);
      if (h || g || E || b || d.ctrlKey || d.metaKey || d.altKey) return !1;
      const y = a?.keyEdit?.(n, Ie(i.id), { key: d.key, shiftKey: d.shiftKey });
      if (y) {
        d.preventDefault();
        const c = Ue(n, y);
        return "refused" in c ? (e.announce?.(c.refused.reason), U(o.onRefuse, { laneId: c.refused.laneId, ...m?.kind === "card" ? { cardId: m.key } : {}, reason: c.refused.reason })) : nn(c.workshop, m?.kind === "card" ? { cardId: m.key } : {}), !0;
      }
      if (m?.kind !== "card") return !1;
      const S = n.cards.find((c) => c.id === m.key);
      if (!S) return !1;
      if (d.key === "ArrowLeft" || d.key === "ArrowRight")
        return d.preventDefault(), Yn(S.id, d.key === "ArrowLeft" ? -1 : 1), !0;
      if ((d.key === "ArrowUp" || d.key === "ArrowDown") && Gt())
        return d.preventDefault(), Yn(S.id, d.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== S.id) return !1;
      if (d.key === "Enter") {
        d.preventDefault();
        const { laneId: c, next: p, spot: w } = r;
        if (r = null, c === null)
          return U(o.onPreview, null), In(S.id, w), !0;
        const x = n;
        n = p, H(n), $e(c), U(o.onPreview, null);
        const M = n.lanes.find((T) => T.id === c);
        return e.announce?.(`${S.label} moved to ${M.label}. ${ge(n, c)}.`), U(o.onChange, n, { cardId: S.id, laneId: c, ...a ? { edits: a.editsBetween(x, n) } : {} }), !0;
      }
      return d.key === "Escape" ? (d.preventDefault(), Ae(), e.announce?.(`Move cancelled. ${S.label} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((d) => v.get(d.id) === d).map((d) => d.id);
      ne = i.length === 1, v.clear(), k.clear(), L.clear(), R.clear(), K.clear(), E = null, r = null, H(g ?? n, { animate: !1 }), i.length === 1 && (W = W.then(() => {
        ne = !1;
        const d = v.get(i[0]);
        if (!u && d && !(e.getSelectedNodes?.() ?? []).length) {
          const m = () => e.selectNodes?.([d]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(m) : m();
        }
        yn();
      }));
    }
  };
  xe.onFreeMove = (i, d) => {
    if (!Ze() || i.options?.isComment) return kn();
    const m = Qe(d), y = Xe(i), S = n.lanes.filter((p) => !De(i) && Re(n, p.id, y) === null).map((p) => p.id), c = m ? De(i) ?? Re(n, m, y) : null;
    f && f.noteId === i.id && f.laneId === m && f.refusal === c || (f = { noteId: i.id, laneId: m, refusal: c, open: S }, Se());
  }, xe.onFreeDrop = (i, d, m) => {
    if (kn(), !Ze() || i.options?.isComment) return;
    const y = Qe(d);
    if (!y) return;
    const S = Xe(i), c = n.lanes.find((w) => w.id === y), p = De(i) ?? Re(n, y, S);
    return p ? (Z(!1), C = { laneId: y, reason: p, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${bn(S.label)} can't go in ${c.label}. ${p}`), U(o.onRefuse, { noteId: i.id, laneId: y, reason: p }), "refused") : (vn([{ node: i, offer: S, from: m }], y), "taken");
  }, xe.onFreeGroupDrop = (i, d, m) => {
    if (kn(), !Ze() || i.some((w) => w.options?.isComment)) return;
    const y = Qe(d);
    if (!y) return;
    const S = n.lanes.find((w) => w.id === y), c = i.map((w) => ({ node: w, offer: Xe(w) })), p = Kt(c, y);
    if (p) {
      Z(!1), C = { laneId: y, reason: p, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${Vn(c.map((w) => bn(w.offer.label)))} can't go in ${S.label}. ${p}`);
      for (const { node: w } of c) U(o.onRefuse, { noteId: w.id, laneId: y, reason: p });
      return "refused";
    }
    return vn(c.map((w, x) => ({ ...w, from: m?.[x] })), y), "taken";
  }, xe.onFreeTextCommit = (i) => {
    if (!Ze() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const d = i.options ?? {}, m = Qe({ x: (d.x ?? 0) + (d.width ?? 0) / 2, y: (d.y ?? 0) + (d.height ?? 0) / 2 });
    if (!m) return;
    const y = Xe(i), S = n.lanes.find((M) => M.id === m), c = De(i) ?? Re(n, m, y);
    if (!c) {
      vn([{ node: i, offer: y }], m);
      return;
    }
    Z(!1), C = { laneId: m, reason: c, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${bn(y.label)} can't go in ${S.label}. ${c} It is beside the board.`), U(o.onRefuse, { noteId: i.id, laneId: m, reason: c });
    const { width: p } = Ee(n), w = Math.round(J.x + p + 32), x = Math.round(d.y ?? J.y);
    i.position(w, x, () => e.updateSelectionResizeRotate?.(), void 0, Tn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [lt({ ...i.options, x: w, y: x })] });
  }, xe.undoState = () => ({ cards: n.cards.map((i) => ({ ...i })), pairs: [...A] }), xe.onUndoRestore = (i, d) => {
    if (u) return;
    const m = new Map((i?.cards ?? []).map((c) => [c.id, c])), y = new Map(i?.pairs ?? []), S = (c) => A.get(c) ?? y.get(c) ?? c;
    for (const c of d.added) {
      const p = S(c), w = n.cards.find((x) => x.id === p);
      w && (n = V({ ...n, cards: n.cards.filter((x) => x !== w) }), H(n), ut(U(o.onChange, n, { cardId: p, cardToNote: { noteId: c } })));
    }
    for (const c of d.removed) {
      const p = S(c), w = m.get(p);
      if (!w || n.cards.some((B) => B.id === p)) continue;
      const x = { id: p, label: w.label, ...w.look ? { look: w.look } : {}, ...w.asNote ? { asNote: w.asNote } : {} }, M = [w.laneId, ...n.lanes.map((B) => B.id)].find((B) => Ge(n, B, x));
      if (!M) {
        e.announce?.(`${w.label} could not go back on the board: there is no room for it.`);
        continue;
      }
      n = qt(Ge(n, M, x), p, i?.cards ?? []), p !== c && A.set(c, p), H(n);
      const T = n.cards.findIndex((B) => B.id === p), j = n.cards.slice(T + 1).find((B) => B.laneId === M)?.id;
      ut(U(o.onChange, n, { cardId: p, laneId: M, noteToCard: {
        noteId: c,
        label: w.label,
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {},
        ...j ? { before: j } : {}
      } }));
    }
  };
  const Dt = e.setDragPolicy(xe), jt = o.onSelect && e.onSelectionChange?.(() => yn()), qn = () => {
    r && Ae();
  };
  e.element?.addEventListener?.("pointerdown", qn, !0), H(n, { animate: !1 });
  function Jn(i, d, m) {
    const y = n.cards.find((T) => T.id === i);
    if (!y) return { kind: "outside" };
    if (a) {
      const T = xn(d), j = a.refusalAt(n, i, E?.grab ?? { x: 0, y: 0 }, T, D);
      if (j) return { kind: "refused", ...j };
      const { width: B, height: ie } = Ee(n);
      if (T.x < -40 || T.y < -40 || T.x > B + 40 || T.y > ie + 40) return { kind: "outside" };
      let Q = n;
      try {
        Q = m?.(T) ?? n;
      } catch (Me) {
        console.warn("WORKSHOP: the board kit's chooser threw", Me);
      }
      return JSON.stringify(Q) === JSON.stringify(n) ? { kind: "home" } : { kind: "candidate", laneId: Q.cards.find((Me) => Me.id === i)?.laneId ?? y.laneId, next: Q };
    }
    const S = n.lanes.map((T) => v.get(oe(ee.column(T.id)))).filter(Boolean), c = e.hitTestNodes(d, S, { padding: 6 }), p = c ? se(c.id).key : null;
    if (!p) return { kind: "outside" };
    if (p === y.laneId) return { kind: "home" };
    const w = Be(n, i, p);
    if (!w) return { kind: "refused", laneId: p, reason: sn(n, i, p) ?? "That move is not available." };
    if (!m) return { kind: "candidate", laneId: p, next: w };
    let x = null;
    try {
      x = m({ x: d.x - J.x, y: d.y - J.y });
    } catch (T) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", T), { kind: "candidate", laneId: p, next: w };
    }
    const M = x?.cards.find((T) => T.id === i)?.laneId;
    return !x || !M || M === y.laneId ? { kind: "home" } : { kind: "candidate", laneId: M, next: x };
  }
  function Gt() {
    return a ? !1 : new Set(We(n, { layout: D }).places.map((i) => i.row)).size > 1;
  }
  function Yn(i, d, m = !1) {
    const y = n.cards.find((T) => T.id === i), S = mt(n, i), c = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (c !== void 0) {
      if (m || d === c) return;
      const T = c > 0 ? n.lanes[n.lanes.length - 1] : n.lanes[0];
      if (Ae(), T.id === y.laneId) {
        $e(T.id, g ?? n), e.announce?.(`${y.label} is back in ${T.label}.`);
        return;
      }
      if (S.includes(T)) {
        const B = Be(n, i, T.id);
        r = { cardId: i, laneId: T.id, next: B }, H(B), $e(T.id, B), U(o.onPreview, B), e.announce?.(`${y.label} to ${T.label}: ${ge(B, T.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const j = sn(n, i, T.id) ?? "That move is not available.";
      Z(), C = { laneId: T.id, reason: j, timer: setTimeout(() => Z(), 1500) }, H(g ?? n), $e(T.id, g ?? n), e.announce?.(`${y.label} can't move to ${T.label}. ${j}`), U(o.onRefuse, { cardId: i, laneId: T.id, reason: j });
      return;
    }
    const p = r?.cardId === i ? r.laneId : y.laneId;
    let w;
    if (m) {
      const { places: T } = We(n, { layout: D }), j = T.find((B) => B.laneId === p);
      w = T.filter((B) => B.column === j.column && (B.row - j.row) * d > 0).sort((B, ie) => (B.row - ie.row) * d).map((B) => n.lanes.find((ie) => ie.id === B.laneId));
    } else {
      const T = n.lanes.findIndex((j) => j.id === p);
      w = d > 0 ? n.lanes.slice(T + 1) : n.lanes.slice(0, T).reverse();
    }
    const x = w.find((T) => S.includes(T));
    if (Z(), !x) {
      const T = w[0];
      if (!T) {
        if (!m && ln(n)) {
          const B = dn(n, i);
          if (B) {
            e.announce?.(B), U(o.onRefuse, { cardId: i, laneId: null, reason: B });
            return;
          }
          Ut(y, d);
          return;
        }
        e.announce?.(`${y.label} has no lane to move to on that side.`);
        return;
      }
      const j = sn(n, i, T.id) ?? "That move is not available.";
      C = { laneId: T.id, reason: j, timer: setTimeout(() => Z(), 1500) }, H(r?.next ?? g ?? n), $e(T.id, r?.next ?? g ?? n), e.announce?.(`${y.label} can't move to ${T.label}. ${j}`), U(o.onRefuse, { cardId: i, laneId: T.id, reason: j });
      return;
    }
    if (x.id === y.laneId) {
      Ae(), $e(x.id, g ?? n), e.announce?.(`${y.label} is back in ${x.label}.`);
      return;
    }
    const M = Be(n, i, x.id);
    r = { cardId: i, laneId: x.id, next: M }, H(M), $e(x.id, M), U(o.onPreview, M), e.announce?.(`${y.label} to ${x.label}: ${ge(M, x.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function $e(i, d = n) {
    const m = a ? Zt(d, ee.column(i)) : We(d, { layout: D, rows: Xn() }).places.find((x) => x.laneId === i), y = e.canvas?.viewbox?.();
    if (!m || !y || !(y.width > 0) || !(y.height > 0)) return;
    const S = 16, c = (x, M, T, j) => M + S * 2 >= j || x - S < T ? x - S - T : x + M + S > T + j ? x + M + S - (T + j) : 0, p = c(J.x + m.x, m.width, y.x, y.width), w = c(J.y + m.y, m.height, y.y, y.height);
    (p || w) && e.panBy?.({ x: p, y: w });
  }
  function yn() {
    if (!o.onSelect || ne) return;
    const i = u ? [] : e.getSelectedNodes?.() ?? [], d = i.length === 1 && v.get(i[0].id) === i[0] ? se(i[0].id) : null, m = d?.kind === "card" ? { cardId: d.key } : d?.kind === "lane" ? { laneId: d.key } : null, y = m ? JSON.stringify(m) : null;
    y !== Le && (Le = y, U(o.onSelect, m));
  }
  function Ae() {
    r && (r = null, U(o.onPreview, null), H(g ?? n));
  }
  function Ut(i, d) {
    const { width: m } = Ee(n), y = v.get(oe(ee.card(i.id)))?.options, S = y?.width ?? 228, c = { x: d > 0 ? J.x + m + 32 : J.x - S - 32, y: y?.y ?? J.y }, p = wt(n, i.id);
    r = { cardId: i.id, laneId: null, side: d, spot: c, next: n }, H(n), U(o.onPreview, p), e.announce?.(`${i.label} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ve() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function Ze() {
    return !u && !h && !g && !E && !Ve() && ln(n);
  }
  function kn() {
    f && (f = null, u || Se());
  }
  function Qe(i) {
    const d = n.lanes.map((y) => v.get(oe(ee.column(y.id)))).filter(Boolean), m = e.hitTestNodes(i, d, { padding: 6 });
    return m ? se(m.id)?.key ?? null : null;
  }
  function Xe(i) {
    const d = i.options ?? {}, m = Go({
      backgroundColor: d.backgroundColor,
      textColor: d.fontColor,
      fontFamily: d.fontFamily,
      fontSize: d.fontSize,
      borderColor: d.borderColor,
      borderWidth: d.borderWidth
    }), y = String(d.text ?? ""), S = y.replace(/\s+/g, " ").trim(), c = {};
    y.trim() !== S && y.length <= 400 && (c.text = y.trim()), typeof d.shape == "string" && /^[a-z]{1,24}$/i.test(d.shape) && (c.shape = d.shape);
    for (const p of ["width", "height"]) Number.isFinite(d[p]) && d[p] >= 10 && d[p] <= 4e3 && (c[p] = Math.round(d[p]));
    return { id: i.id, label: S, ...m ? { look: m } : {}, ...Object.keys(c).length ? { asNote: c } : {} };
  }
  function Vn(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Kt(i, d) {
    for (const { node: c } of i) {
      const p = De(c);
      if (p) return p;
    }
    const m = n.lanes.find((c) => c.id === d), y = n.cards.filter((c) => c.laneId === d).length;
    if (m.capacity !== void 0 && y + i.length > m.capacity) {
      const c = m.capacity - y;
      return c > 0 ? `It has room for ${c} more ${c === 1 ? "card" : "cards"}.` : `It already holds ${y} of ${m.capacity} ${m.capacity === 1 ? "card" : "cards"}.`;
    }
    let S = n;
    for (const { offer: c } of i) {
      const p = Re(S, d, c);
      if (p) return p;
      S = Ge(S, d, c);
    }
    return null;
  }
  function De(i) {
    return (i.relationships?.associations?.length ?? 0) > 0 || (e.nodes?.allNodes ?? []).some((m) => m !== i && (m.relationships?.associations ?? []).some((y) => y.child === i || y.childId === i.id)) ? "A note joined to other notes by lines stays a note. Remove its lines first." : i.options?.image ? "A note with a picture stays a note." : i.options?.link?.show && i.options.link.data ? "A note with a link stays a note. Remove its link first." : null;
  }
  const bn = (i) => i || "This note";
  function vn(i, d) {
    let m = n;
    const y = i.map(({ node: p, offer: w, from: x }) => {
      m = Ge(m, d, w);
      const M = { ...p.options ?? {}, ...x ? { x: x.x, y: x.y } : {} };
      return { node: p, card: m.cards[m.cards.length - 1], kept: M };
    });
    e.beginHostStep?.(), n = m;
    let S = n;
    for (const { node: p, card: w } of y)
      w.id !== p.id && A.set(p.id, w.id), I.set(oe(ee.card(w.id)), { x: p.options?.x ?? 0, y: p.options?.y ?? 0 }), en(() => e.removeNode(p.id));
    e.endHostStep?.(), H(n), Jt(oe(ee.card(y[0].card.id)));
    const c = n.lanes.find((p) => p.id === d);
    e.announce?.(y.length === 1 ? `${y[0].card.label} is now a card in ${c.label}. ${ge(n, d)}.` : `${Vn(y.map(({ card: p }) => p.label))} are now cards in ${c.label}. ${ge(n, d)}.`);
    for (const { node: p, card: w, kept: x } of y) {
      const M = { cardId: w.id, laneId: d, noteToCard: {
        noteId: p.id,
        label: w.label,
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {}
      } }, T = () => {
        n !== S || !n.cards.some((j) => j.id === w.id) || (n = V({ ...n, cards: n.cards.filter((j) => j.id !== w.id) }), S = n, H(n));
      };
      Zn(U(o.onChange, n, M), () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: p.id, isComment: !1 } }]);
      }, () => {
        if (!u) {
          if (T(), !e.nodes.one(x.id)) {
            e.beginHostStep?.();
            const j = en(() => e.addNode({ ...x }));
            j && (j.announcedByCreator = !0), e.endHostStep?.();
          }
          e.announce?.(`${w.label} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        u || (T(), e.announce?.(`Someone else put ${w.label} on the board first.`));
      });
    }
  }
  function In(i, d) {
    const m = n.cards.find((X) => X.id === i), y = n.lanes.find((X) => X.id === m.laneId), S = n.cards.findIndex((X) => X.id === i), c = n.cards.slice(S + 1).find((X) => X.laneId === m.laneId)?.id, p = wt(n, i), w = k.get(oe(ee.card(i))) ?? {}, x = e.nodes.one(i) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : i, M = (be.cornerRadius ?? 0) > 0, T = m.asNote, j = T?.text !== void 0 && T.text.replace(/\s+/g, " ").trim() === m.label ? T.text : qo(n, m), B = {
      id: x,
      x: Math.round(d.x),
      y: Math.round(d.y),
      width: T?.width ?? w.width ?? 228,
      height: T?.height ?? w.height ?? 76,
      text: j,
      shape: T?.shape ?? (M ? "roundedrectangle" : "rectangle"),
      backgroundColor: m.look?.backgroundColor ?? w.backgroundColor,
      fontColor: m.look?.textColor ?? w.foregroundColor,
      fontSize: m.look?.fontSize ?? w.fontSize,
      borderColor: m.look?.borderColor ?? w.borderColor,
      borderWidth: m.look?.borderWidth ?? w.borderWidth,
      ...m.look?.fontFamily ?? w.fontFamily ? { fontFamily: m.look?.fontFamily ?? w.fontFamily } : {}
    };
    for (const X of Object.keys(B)) B[X] === void 0 && delete B[X];
    e.beginHostStep?.(), n = p;
    const ie = n;
    x !== i ? A.set(x, i) : A.delete(x);
    const Q = en(() => e.addNode(B));
    Q && (Q.announcedByCreator = !0), e.endHostStep?.(), H(n), Q?.ready?.then?.(() => {
      if (u || e.nodes.one(x) !== Q) return;
      const X = () => e.selectNodes?.([Q]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(X) : X();
    }), e.announce?.(`${m.label} is now a note on the canvas. ${y.label}: ${ge(n, y.id)}.`);
    const Me = () => {
      e.nodes.one(x) === Q && (e.beginHostStep?.(), en(() => e.removeNode(x)), e.endHostStep?.());
    };
    Zn(U(o.onChange, n, { cardId: i, cardToNote: { noteId: x } }), () => {
      Q && e.nodes.one(x) === Q && e.sendHeld?.([{ type: "onNodeAdded", data: { id: x, nodeOptions: lt(Q.options) } }]);
    }, () => {
      if (!u) {
        if (Me(), n === ie && !n.cards.some((X) => X.id === i)) {
          const X = { id: i, label: m.label, ...m.look ? { look: m.look } : {}, ...m.asNote ? { asNote: m.asNote } : {} }, tt = Ge(n, m.laneId, X, c);
          tt && (n = tt, H(n));
        }
        e.announce?.(`${m.label} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      u || (Me(), e.announce?.(`Someone else took ${m.label} off the lanes first.`));
    });
  }
  function qt(i, d, m) {
    const y = m.map((x) => x.id), S = y.indexOf(d), c = i.cards.find((x) => x.id === d);
    if (S < 0 || !c) return i;
    const p = i.cards.filter((x) => x !== c), w = p.findIndex((x) => y.indexOf(x.id) > S);
    return p.splice(w < 0 ? p.length : w, 0, c), V({ ...i, cards: p });
  }
  function Jt(i) {
    W = W.then(() => {
      const d = v.get(i);
      if (u || !d) return;
      const m = () => e.selectNodes?.([d]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(m) : m();
    });
  }
  function en(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function Zn(i, d, m, y) {
    if (!i || typeof i.then != "function") return d();
    const S = i.then((c) => {
      c === !0 ? d() : c === !1 ? m() : c === "taken" && y();
    }, () => m());
    e.holdUntil?.(S);
  }
  function Yt(i, d) {
    Z(!1), C = { laneId: d.laneId, reason: d.reason, timer: setTimeout(() => Z(), 1500) }, H(n, { skip: d.cardId });
    const m = n.lanes.find((y) => y.id === d.laneId);
    e.announce?.(`${i} can't move to ${m?.label ?? "that lane"}. ${d.reason}`), U(o.onRefuse, d);
  }
  function Z(i = !0) {
    C && (clearTimeout(C.timer), C = null, i && !u && Se());
  }
  function Se() {
    H(E && E.outcome.kind === "candidate" ? E.outcome.next : r?.next ?? g ?? n, { skip: E?.cardId });
  }
  function Qn(i) {
    const d = et(i, Xn()), m = new Map(d.map((c) => [c.options.id, c.options])), y = (c, p, w, x = !1) => {
      const M = m.get(ee.column(c));
      M && (M.borderColor = p, M.borderWidth = w, delete M.borderStyle);
      const T = x && m.get(ee.lane(c));
      T && (T.borderColor = p, T.borderWidth = w);
    }, S = E?.cardId ?? r?.cardId;
    if (re = /* @__PURE__ */ new Map(), S) {
      const c = n.cards.find((x) => x.id === S)?.laneId, p = mt(n, S);
      if (!a || a.laneCues)
        for (const x of p) x.id !== c && (y(x.id, ct, 2), re.set(x.id, "open"));
      if (a?.laneCues) {
        for (const x of n.lanes) if (!p.includes(x)) {
          const M = m.get(ee.column(x.id));
          M && (M.backgroundColor = "#e9e8e2"), re.set(x.id, "closed");
        }
      }
      const w = E ? E.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      w?.kind === "candidate" && (y(w.laneId, dt, 3, !0), re.set(w.laneId, "over")), w?.kind === "refused" && (y(w.laneId, Pn, 3), re.set(w.laneId, "refused"));
    }
    if (f && !S) {
      for (const c of f.open) c !== f.laneId && (y(c, ct, 2), re.set(c, "open"));
      f.laneId && !f.refusal && (y(f.laneId, dt, 3, !0), re.set(f.laneId, "over")), f.laneId && f.refusal && (y(f.laneId, Pn, 3), re.set(f.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const c = m.get(ee.card(r.cardId));
      c && (c.xPos = r.spot.x, c.yPos = r.spot.y);
    }
    if (C) {
      re.set(C.laneId, "refused"), y(C.laneId, Pn, 3, !0);
      const c = m.get(ee.caption(C.laneId));
      c && (c.text = C.reason, c.foregroundColor = "#b42318");
    }
    if (ve = /* @__PURE__ */ new Set(), g && i === g) {
      const c = (w, x) => JSON.stringify(w) === JSON.stringify(x), p = (w) => {
        const x = m.get(w);
        x && (x.borderStyle = "dashed", x.borderColor = _o, x.borderWidth = 2, ve.add(oe(w)));
      };
      for (const w of i.cards) c(w, n.cards.find((x) => x.id === w.id)) || p(ee.card(w.id));
      for (const w of i.lanes) c(w, n.lanes.find((x) => x.id === w.id)) || p(ee.lane(w.id));
    }
    for (const c of d) {
      c.options.id = oe(c.options.id);
      for (const p of c.relationships.associations)
        p.parentId = oe(p.parentId), p.childId = oe(p.childId);
    }
    return d;
  }
  function Xn() {
    return E || r ? n.lanes.map((i) => n.cards.filter((d) => d.laneId === i.id).length) : void 0;
  }
  function H(i, d = {}) {
    if (u) return;
    _ = { model: i, skip: d.skip, grip: d.grip, animate: d.animate !== !1 };
    const m = Qn(i), y = [];
    for (const { options: c } of m) {
      const p = c.id;
      if (v.has(p)) continue;
      const w = I.get(p);
      I.delete(p);
      const x = w && d.animate !== !1 && !Tn() ? { ...c, xPos: w.x, yPos: w.y } : c, M = e.nodes.add(Po(x));
      v.set(p, M), k.set(p, { ...x }), M.ready && y.push(M.ready.then(() => {
        if (v.get(p) !== M) return;
        M.applyGovernance?.(), se(p)?.kind === "column" && M.toBack?.(!1), se(p)?.kind === "handle" && M.svgGroup?.front?.();
        const T = nt(_?.model ?? i, p);
        T && M.svgGroup?.node?.setAttribute("aria-label", T);
      }).catch(() => {
      }));
    }
    const S = _;
    W = Promise.all([W, ...y]).then(() => {
      u || _ !== S || Vt(Qn(S.model), S);
    }).catch((c) => console.warn("WORKSHOP: could not draw the workshop", c));
  }
  function Vt(i, d) {
    const m = new Set(i.map((S) => S.options.id)), y = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [c, p] of [...v]) {
        if (m.has(c)) continue;
        for (const [x, M] of [...L])
          M.parentId !== c && M.childId !== c || (M.parent.relationships?.removeAssociation(x), L.delete(x));
        e.deselectNode?.(p), p.editor?.cancelInline?.(), v.delete(c), k.delete(c);
        const w = K.get(c);
        w && (K.delete(c), R.delete(w)), e.nodes.remove(c);
      }
      for (const { options: c } of i) {
        const p = c.id, w = v.get(p);
        if (!w?.svgGroup) continue;
        const x = k.get(p) ?? {}, M = w.editor?.isInlineEditing?.();
        (c.fontSize !== x.fontSize || c.foregroundColor !== x.foregroundColor) && (w.options.fontSize = c.fontSize, w.options.fontColor = c.foregroundColor, w.applyTextStyle?.()), c.text !== x.text && !M && w.setText?.(c.text), (c.width !== x.width || c.height !== x.height) && (c.vectorPath ? (w.options.width = c.width, w.options.height = c.height, w.setShape?.(w.options.shape, c.vectorPath), se(p)?.kind === "column" && w.toBack?.(!1)) : w.setSize?.(c.width, c.height)), c.backgroundColor !== x.backgroundColor && w.setColors?.(c.backgroundColor), (c.borderColor !== x.borderColor || c.borderWidth !== x.borderWidth || c.borderStyle !== x.borderStyle) && (w.options.borderColor = c.borderColor, w.options.borderWidth = c.borderWidth, w.options.borderStyle = c.borderStyle, w.applyBorder?.());
        const T = c.xPos !== x.xPos || c.yPos !== x.yPos || Math.abs((w.options.x ?? 0) - c.xPos) > 0.5 || Math.abs((w.options.y ?? 0) - c.yPos) > 0.5;
        if (p !== (d.skip && oe(ee.card(d.skip))) && p !== (d.grip && oe(d.grip)) && T) {
          const ie = d.animate && !Tn() ? 180 : 0, Q = y.includes(w) ? () => {
            !u && v.get(p) === w && (e.getSelectedNodes?.() ?? []).includes(w) && e.updateSelectionResizeRotate?.();
          } : void 0;
          Q && ie && y.length === 1 && w.resizeRotate?.disable?.(), w.position(c.xPos, c.yPos, Q, void 0, ie);
        }
        const j = nt(d.model, p);
        j && w.svgGroup.node.getAttribute("aria-label") !== j && w.svgGroup.node.setAttribute("aria-label", j), ve.has(p) ? w.svgGroup.node.setAttribute("data-workshop-proposed", "") : w.svgGroup.node.removeAttribute("data-workshop-proposed");
        const B = se(p);
        if (B?.kind === "column") {
          const ie = re.get(B.key);
          ie ? w.svgGroup.node.setAttribute("data-workshop-drop", ie) : w.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        B?.kind === "handle" && w.svgGroup.front?.(), k.set(p, { ...c });
      }
      const S = /* @__PURE__ */ new Map();
      for (const c of i) for (const p of c.relationships.associations) S.set(p.id, p);
      for (const [c, p] of [...L])
        S.has(c) && v.get(p.parentId) === p.parent && v.get(p.childId) === p.child || (p.parent.relationships?.removeAssociation(c), L.delete(c));
      for (const [c, p] of S) {
        if (L.has(c)) continue;
        const w = v.get(p.parentId), x = v.get(p.childId);
        !w?.relationships || !x?.svgGroup || (w.relationships.addAssociation(x, No(p)), L.set(c, { parentId: p.parentId, childId: p.childId, parent: w, child: x }));
      }
    }), l) {
      const S = n.lanes.map((p) => v.get(oe(ee.column(p.id)))?.svgGroup?.node).reduce((p, w) => w && (!p || p.compareDocumentPosition(w) & 4) ? w : p, null), c = d.model;
      l.draw(n, c === n ? null : c, {
        origin: J,
        layout: D,
        above: S,
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : !b && P ? { name: P.name, text: P.reason } : null,
        refused: !!b?.last?.refusal || !b && !!P,
        onUnlink: (p, w) => {
          if (h || g || E || b || Ve()) return;
          const x = Ue(n, [{ kind: "unlink_tasks", card: { id: p }, waitsOn: { id: w } }]);
          "refused" in x ? e.announce?.(x.refused.reason) : nn(x.workshop, { cardId: p });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function xn(i) {
    return { x: i.x - J.x, y: i.y - J.y };
  }
  function Ee(i) {
    return a ? a.places(i, D) : { ...We(i, { layout: D }), parts: [] };
  }
  function Zt(i, d) {
    const m = a.places(i, D).parts.find((y) => y.name === d);
    return m ? { x: m.x, y: m.y, width: m.width, height: m.height } : void 0;
  }
  function et(i, d) {
    return a ? a.notes(i, D, J, be) : Xo(i, { native: !0, origin: J, rows: d, layout: D, style: be }).nodes;
  }
  function nn(i, d, m) {
    const y = a.editsBetween(n, i);
    if (!y.length) return !1;
    const S = Ue(n, y);
    return "refused" in S ? (e.announce?.(S.refused.reason), U(o.onRefuse, { ...d, laneId: S.refused.laneId, reason: S.refused.reason }), !1) : (n = S.workshop, H(n, { skip: m }), e.announce?.(S.report.edits.map((c) => c.said).join(" ")), U(o.onChange, n, { ...d, edits: y }), !0);
  }
  function nt(i, d) {
    const m = se(d);
    if (m?.kind === "lane") {
      const y = i.lanes.find((S) => S.id === m.key);
      return y ? `${y.label}, ${ge(i, y.id)}` : null;
    }
    if (m?.kind === "card") {
      const y = i.cards.find((c) => c.id === m.key), S = y && i.lanes.find((c) => c.id === y.laneId);
      return y && S ? `${y.label}, in ${S.label}` : null;
    }
    return m?.kind === "handle" ? a?.label?.(i, Ie(d)) ?? null : null;
  }
  function $n(i, d) {
    const m = et(i).find((y) => y.options.id === d)?.options;
    return m ? { x: m.xPos, y: m.yPos } : null;
  }
  function Ne() {
    (E || b) && e.cancelGovernedDrag?.("host"), E = null, b = null, r && (r = null, U(o.onPreview, null)), Z(!1);
  }
  return {
    toCanvas(i) {
      if (u || h || Ve()) return "This workshop is view-only here.";
      if (!n.cards.some((S) => S.id === i)) return "That card is no longer on the board.";
      const d = dn(n, i);
      if (d) return d;
      r && Ae(), g && (Ne(), g = null, H(n), e.refreshGovernance?.());
      const { width: m } = Ee(n), y = v.get(oe(ee.card(i)))?.options;
      return In(i, { x: J.x + m + 32, y: y?.y ?? J.y }), null;
    },
    get value() {
      return n;
    },
    get origin() {
      return { ...J };
    },
    get layout() {
      return { ...D };
    },
    get bounds() {
      const { width: i, height: d } = Ee(n);
      return { x: J.x, y: J.y, width: i, height: d };
    },
    setLayout(i) {
      if (u) throw new Error("This workshop has been detached.");
      const d = ft(i);
      a ? a.places(n, d) : We(n, { layout: d }), JSON.stringify(d) !== JSON.stringify(D) && (Ne(), D = d, H(g ?? n));
    },
    whenDrawn: () => W,
    update(i) {
      if (u) throw new Error("This workshop has been detached.");
      const d = V(i);
      Ne(), n = d;
      const m = h;
      h = $ || s(n), H(g ?? n), h !== m && e.refreshGovernance?.();
    },
    preview(i) {
      if (u) throw new Error("This workshop has been detached.");
      const d = i ? V(i) : null;
      Ne(), g = d, H(g ?? n), e.refreshGovernance?.();
    },
    refuse(i, d) {
      const m = n.lanes.find((y) => y.id === i);
      u || !m || (Z(!1), C = { laneId: i, reason: d, timer: setTimeout(() => Z(), 1500) }, Se(), e.announce?.(`${m.label}: ${d}`));
    },
    setReadOnly(i) {
      $ = !!i;
      const d = $ || s(n);
      u || h === d || (Ne(), h = d, H(g ?? n), e.refreshGovernance?.());
    },
    destroy() {
      u || (Ne(), u = !0, P && clearTimeout(P.timer), e.element?.removeEventListener?.("pointerdown", qn, !0), jt?.(), e.withPolicyAuthority(() => {
        for (const [i, d] of L) d.parent.relationships?.removeAssociation(i);
        for (const [i, d] of v)
          e.deselectNode?.(d), d.editor?.cancelInline?.(), e.nodes.one(i) === d && e.nodes.remove(i);
      }), L.clear(), v.clear(), k.clear(), R.clear(), K.clear(), Dt(), l?.destroy(), ne = !1, yn(), e.notifyNodeChanged?.());
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
function ut(e, t, o) {
  !e || typeof e.then != "function" || e.then((n) => {
  }, () => {
  });
}
function zo(e, t) {
  return e.kind === "candidate" && t.kind === "candidate" ? e.next === t.next || JSON.stringify(e.next) === JSON.stringify(t.next) : e.kind === t.kind && e.laneId === t.laneId && e.reason === t.reason;
}
function ft(e) {
  const t = {};
  return e?.lanesPerRow !== void 0 && (t.lanesPerRow = e.lanesPerRow), e?.narrow && (t.narrow = !0), e?.width !== void 0 && (t.width = e.width), t;
}
function Fo(e) {
  const t = e.nodes?.allNodes ?? [];
  if (!t.length) return { x: 40, y: 40 };
  let o = -1 / 0, n = 1 / 0;
  for (const a of t)
    o = Math.max(o, (a.options.x ?? 0) + (a.options.width ?? 0)), n = Math.min(n, a.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(n) };
}
const Bo = ["launch-plan", "pipeline", "budget"];
function de(e) {
  return Bo.includes(e.kind) ? e.kind : void 0;
}
const ht = {
  "launch-plan": [12, "A launch plan holds up to 12 tasks."],
  pipeline: [16, "A pipeline holds up to 16 deals."],
  budget: [16, "A budget holds up to 16 line items."]
};
function me(e, t, o, n, a = !1) {
  if (typeof e != "number" || !Number.isFinite(e) || e < t || e > o || !a && !Number.isInteger(e)) throw new Error(n);
  return e;
}
const Ho = /^(?:[$€£¥₹]|[A-Z]{3} )$/;
function pt(e) {
  if (typeof e != "string" || !Ho.test(e)) throw new Error("Use a currency sign such as $ or €.");
  return e;
}
function fe(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function ce(e, t = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > t)
    throw new Error(`Labels must contain 1 to ${t} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function Pt(e) {
  const t = fe(e);
  let o;
  try {
    o = new URL(ce(t.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: ce(t.alt, 240) };
}
function ue(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const Do = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, jo = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function Ye(e) {
  const t = fe(e), o = {}, n = (s) => {
    if (typeof s != "string" || !Do.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, a = (s, l, b) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < l || s > b) throw new Error("A card size is out of range.");
    return s;
  };
  if (t.backgroundColor !== void 0 && (o.backgroundColor = n(t.backgroundColor)), t.textColor !== void 0 && (o.textColor = n(t.textColor)), t.borderColor !== void 0 && (o.borderColor = n(t.borderColor)), t.fontFamily !== void 0) {
    if (typeof t.fontFamily != "string" || !jo.test(t.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = t.fontFamily;
  }
  return t.fontSize !== void 0 && (o.fontSize = a(t.fontSize, 6, 200)), t.borderWidth !== void 0 && (o.borderWidth = a(t.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function Go(e) {
  const t = {};
  for (const [o, n] of Object.entries(e ?? {}))
    if (n !== void 0)
      try {
        Ye({ [o]: n }) && (t[o] = n);
      } catch {
      }
  return Ye(t);
}
function jn(e) {
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
function ye(e, t) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${t}.`);
}
function Gn({ lanes: e, presentationOrder: t }) {
  if (t === void 0) return e.slice();
  if (!Array.isArray(t) || t.length !== e.length || new Set(t).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(t, (o) => {
    const n = e.find((a) => a.id === o);
    if (!n) throw new Error("Presentation order refers to an unknown lane.");
    return n;
  });
}
function Uo(e) {
  return (e.signals ?? []).map((t) => {
    const o = e.cards.some((n) => n.id === t.cardId && n.laneId === t.laneId);
    return { ...t, present: o, text: o ? t.whenPresent : t.whenAbsent };
  });
}
const Fe = (e) => "lane-" + e, ke = (e) => "card-" + e, mn = (e) => "image-" + e;
function Sa(e) {
  const t = Uo(e);
  return Gn(e).map((o) => {
    const n = e.cards.filter((l) => l.laneId === o.id), a = t.filter((l) => l.laneId === o.id), s = [Fe(o.id)];
    return o.station?.image && s.push(mn(o.id)), { lane: o, cards: n, signals: a, nodeIds: [...s, ...n.map((l) => ke(l.id))] };
  });
}
const Lt = 5, Et = 24, _n = 3;
function V(e) {
  const t = fe(e);
  if (t.version !== 1) throw new Error("Unsupported workshop version.");
  if (t.kind !== void 0 && t.kind !== "release-plan" && !de(t)) throw new Error("Unsupported workshop kind.");
  const o = t.kind === "release-plan", n = de(t), a = 1e9, s = ce(t.title, 120);
  if (!Array.isArray(t.lanes) || t.lanes.length < 2 || t.lanes.length > Lt)
    throw new Error("A workshop needs 2 to 5 lanes.");
  if (!Array.isArray(t.cards) || t.cards.length > Et)
    throw new Error("A workshop supports up to 24 cards.");
  if (n && t.cards.length > ht[n][0]) throw new Error(ht[n][1]);
  const l = t.lanes.map((h) => {
    const u = fe(h), v = { id: ue(u.id), label: ce(u.label) };
    if (u.capacity !== void 0 && n && n !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (u.capacity !== void 0) {
      const k = o ? 576 : 24;
      if (typeof u.capacity != "number" || !Number.isInteger(u.capacity) || u.capacity < 1 || u.capacity > k)
        throw new Error(`Lane capacity must be a whole number from 1 to ${k}.`);
      v.capacity = u.capacity;
    }
    if (n === "pipeline") {
      if (u.role !== void 0) {
        if (u.role !== "won" && u.role !== "lost") throw new Error("A stage is won, lost or open.");
        v.role = u.role;
      }
      u.probability !== void 0 && (v.probability = me(u.probability, 0, 1, "A stage's chance is from 0 to 100%.", !0));
    }
    if (n === "budget") {
      const k = (L) => {
        u[L] !== void 0 && (v[L] = me(u[L], 0, a, "Team amounts are whole amounts."));
      };
      k("allocation"), k("floor"), k("cap");
    }
    if (u.station !== void 0) {
      const k = fe(u.station), L = (K) => {
        if (typeof K != "number" || !Number.isInteger(K) || K < 0 || K >= _n)
          throw new Error("Use map coordinates from 0 to 2.");
        return K;
      };
      if (!Array.isArray(k.next) || k.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const R = k.next.map(ue);
      ye(R, "onward stop"), v.station = { column: L(k.column), row: L(k.row), next: R, outcome: ce(k.outcome, 160) }, k.image !== void 0 && (v.station.image = Pt(k.image));
    }
    return v;
  }), b = l.map((h) => h.id);
  if (ye(b, "lane ID"), n && l.some((h) => h.station)) throw new Error("A business board has no map stations.");
  if ((o || l.some((h) => h.station)) && !t.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (l.some((h) => h.station)) {
    if (!l.every((h) => h.station)) throw new Error("Give every station on the map a position.");
    ye(l.map((h) => h.station.column + "," + h.station.row), "map position");
    for (const h of l)
      if (h.station.next.some((u) => u === h.id || !b.includes(u))) throw new Error("Connect each stop to another station on this map.");
  }
  const g = t.cards.map((h) => {
    const u = fe(h), v = { id: ue(u.id), label: ce(u.label), laneId: ue(u.laneId) };
    if (!b.includes(v.laneId)) throw new Error("Card refers to an unknown lane.");
    if (u.allowedLaneIds !== void 0) {
      if (!Array.isArray(u.allowedLaneIds) || u.allowedLaneIds.length > l.length) throw new Error("Invalid allowed lanes.");
      if (v.allowedLaneIds = u.allowedLaneIds.map(ue), ye(v.allowedLaneIds, "allowed lane"), !v.allowedLaneIds.includes(v.laneId) || !v.allowedLaneIds.every((k) => b.includes(k)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (u.look !== void 0) {
      const k = Ye(u.look);
      k && (v.look = k);
    }
    if (u.asNote !== void 0) {
      const k = jn(u.asNote);
      k && (v.asNote = k);
    }
    if (n === "launch-plan" && (v.duration = me(u.duration, 1, 60, "A task takes 1 to 60 days."), u.lag !== void 0 && u.lag !== 0 && (v.lag = me(u.lag, 0, 120, "A task waits 0 days or more, and no later than launch."))), (n === "pipeline" || n === "budget") && u.amount !== void 0 && (v.amount = me(u.amount, 0, a, "An amount is a whole amount, not below zero.")), n === "launch-plan" && u.dependsOn !== void 0) {
      if (!Array.isArray(u.dependsOn)) throw new Error("A task waits on a list of tasks.");
      v.dependsOn = u.dependsOn.map(ue), ye(v.dependsOn, "dependency"), v.dependsOn.length || delete v.dependsOn;
    }
    if (o) {
      if (typeof u.points != "number" || !Number.isInteger(u.points) || u.points < 1 || u.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (v.points = u.points, u.dependsOn !== void 0) {
        if (!Array.isArray(u.dependsOn) || u.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        v.dependsOn = u.dependsOn.map(ue), ye(v.dependsOn, "dependency");
      }
    }
    return v;
  });
  ye(g.map((h) => h.id), "card ID");
  const $ = { version: 1, title: s, lanes: l, cards: g };
  if (t.experience !== void 0) {
    const h = fe(t.experience);
    if (h.version !== 1 || h.kind !== "customer-interviews" && h.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    $.experience = { version: 1, kind: h.kind };
  }
  if (t.signals !== void 0) {
    if (!Array.isArray(t.signals) || t.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    $.signals = t.signals.map((h) => {
      const u = fe(h), v = ue(u.cardId), k = ue(u.laneId);
      if (!g.some((L) => L.id === v) || !b.includes(k))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ue(u.id),
        label: ce(u.label),
        cardId: v,
        laneId: k,
        whenPresent: ce(u.whenPresent, 160),
        whenAbsent: ce(u.whenAbsent, 160)
      };
    }), ye($.signals.map((h) => h.id), "placement outcome ID");
  }
  if (t.presentationOrder !== void 0) {
    if (!Array.isArray(t.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    $.presentationOrder = Gn({ lanes: l, presentationOrder: t.presentationOrder }).map((h) => h.id);
  }
  if (o)
    return $.kind = "release-plan", Qt($), $;
  if (n) {
    $.kind = n;
    const h = (v, k) => {
      if (!t[v] || typeof t[v] != "object") throw new Error(k);
      return fe(t[v]);
    };
    if (n === "launch-plan" && ($.launch = { day: me(h("launch", "A launch plan needs a launch day.").day, 5, 120, "Launch day is a whole day from 5 to 120.") }), n === "pipeline") {
      const v = h("forecast", "A pipeline needs a forecast target.");
      $.forecast = { target: me(v.target, 1, a, "A target is a whole amount above zero."), currency: pt(v.currency) };
    }
    if (n === "budget") {
      const v = h("budget", "A budget needs a total.");
      $.budget = {
        total: me(v.total, 1, a, "A total is a whole amount above zero."),
        currency: pt(v.currency),
        step: v.step === void 0 ? 5e3 : me(v.step, 1, a, "A step is a whole amount above zero.")
      };
    }
    const u = (n === "launch-plan" ? oo : n === "pipeline" ? io : uo)($);
    if (u) throw new Error(u);
    return $;
  }
  for (const h of l)
    if (g.filter((u) => u.laneId === h.id).length > (h.capacity ?? 1 / 0))
      throw new Error(`Lane "${h.label}" exceeds its capacity.`);
  return $;
}
const Nt = 65536;
function Ca(e) {
  const t = JSON.stringify(V(e)), o = "#" + new URLSearchParams({ model: t }).toString();
  if (o.length > Nt) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function Oa(e) {
  if (e.length > Nt) throw new Error("This workshop is too large to open from a link.");
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
function Un(e, t, o) {
  const n = de(e);
  if (n)
    return (n === "launch-plan" ? It : n === "pipeline" ? lo : fo)(e, t, o);
}
function hn(e, t) {
  if (de(e)) return e.lanes.filter((n) => Un(e, t.id, n.id));
  if (e.kind === "release-plan") return e.lanes.filter((n) => pn(e, t, n.id) !== null);
  const o = e.lanes.find((n) => n.id === t.laneId)?.station;
  return e.lanes.filter((n) => n.id === t.laneId || (!o || o.next.includes(n.id)) && (!t.allowedLaneIds || t.allowedLaneIds.includes(n.id)) && e.cards.filter((a) => a.laneId === n.id).length < (n.capacity ?? 1 / 0));
}
function Rn(e, t, o) {
  const n = e.cards.find((s) => s.id === t), a = Un(e, t, o);
  if (a !== void 0) {
    if (!a) throw new Error("Move is unavailable.");
    return a;
  }
  if (n && e.kind === "release-plan") {
    const s = pn(e, n, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!n || !hn(e, n).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return n.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === n ? { ...n, laneId: o } : s) };
}
function Be(e, t, o) {
  const n = e.cards.find((l) => l.id === t);
  if (!n || !e.lanes.some((l) => l.id === o)) return null;
  if (n.laneId === o) return e;
  if (e.kind === "release-plan") return pn(e, n, o);
  const a = Un(e, t, o);
  if (a !== void 0) return a;
  const s = ea(e, t, o);
  return s || (o === "prototype" && He(e) === "customer-interviews" ? null : hn(e, n).some((l) => l.id === o) ? Rn(e, t, o) : null);
}
function mt(e, t) {
  return e.lanes.filter((o) => Be(e, t, o.id) !== null);
}
function sn(e, t, o) {
  if (Be(e, t, o) !== null) return null;
  const n = e.cards.find((g) => g.id === t), a = e.lanes.find((g) => g.id === o);
  if (!n || !a) return "That move is not available.";
  if (e.kind === "pipeline") return xt(e, t, o);
  if (e.kind === "budget") return $t(e, t, o);
  const s = `This card can't go in ${a.label}.`;
  if (n.allowedLaneIds && !n.allowedLaneIds.includes(o)) return s;
  if (e.kind === "release-plan") {
    if (a.capacity === void 0) return s;
    const g = Oe(e, o), $ = { ...e, lanes: e.lanes.map((u) => u === a ? { id: a.id, label: a.label } : u) }, h = pn($, n, o);
    return h ? `Needs ${Oe(h, o) - g} points. It already holds ${g} of ${a.capacity} points.` : s;
  }
  const l = e.lanes.find((g) => g.id === n.laneId);
  if (l?.station && !l.station.next.includes(o)) return `${a.label} can't be reached from ${l.label}.`;
  const b = e.cards.filter((g) => g.laneId === o).length;
  return a.capacity !== void 0 && b >= a.capacity ? `It already holds ${b} of ${a.capacity} ${a.capacity === 1 ? "card" : "cards"}.` : s;
}
function ln(e) {
  return (!e.kind || !!de(e)) && !e.lanes.some((t) => t.station) && !He(e);
}
const Ko = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function Mt(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((n) => n.id));
  return typeof t == "string" && Ko.test(t) && !o.has(t) ? t : gn(e, "card");
}
function Re(e, t, o) {
  const n = e.lanes.find((l) => l.id === t);
  if (!n) return "That lane is no longer on the board.";
  if (e.lanes.some((l) => l.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (He(e)) return "This workshop keeps the cards it came with.";
  const a = typeof o?.label == "string" ? o.label.replace(/\s+/g, " ").trim() : "";
  if (!a) return "A card needs some words. Type on the note first.";
  if (de(e)) {
    const l = _t(e, t, o);
    return typeof l == "string" ? l : null;
  }
  if (a.length > 80) return "A card holds up to 80 characters. Shorten the note first.";
  if (/[<>\u0000-\u001f]/.test(a)) return "A card holds plain words only.";
  if (e.cards.length >= Et) return "A workshop holds up to 24 cards.";
  const s = e.cards.filter((l) => l.laneId === t).length;
  if (n.capacity !== void 0 && s >= n.capacity) return `It already holds ${s} of ${n.capacity} ${n.capacity === 1 ? "card" : "cards"}.`;
  if (o.look !== void 0)
    try {
      Ye(o.look);
    } catch {
      return "This note's look can't be kept on a card.";
    }
  if (o.asNote !== void 0)
    try {
      jn(o.asNote);
    } catch {
      return "This note's shape or words can't be kept on a card.";
    }
  return null;
}
function Ge(e, t, o, n) {
  if (Re(e, t, o) !== null) return null;
  if (de(e)) {
    const $ = _t(e, t, o), h = $.cards[$.cards.length - 1], u = n === void 0 ? -1 : e.cards.findIndex((v) => v.id === n && v.laneId === t);
    return u < 0 ? $ : { ...$, cards: [...e.cards.slice(0, u), h, ...e.cards.slice(u)] };
  }
  const a = o.look === void 0 ? void 0 : Ye(o.look), s = o.asNote === void 0 ? void 0 : jn(o.asNote), l = {
    id: Mt(e, o.id),
    label: o.label.replace(/\s+/g, " ").trim(),
    laneId: t,
    ...a ? { look: a } : {},
    ...s ? { asNote: s } : {}
  }, b = n === void 0 ? -1 : e.cards.findIndex(($) => $.id === n && $.laneId === t), g = b < 0 ? [...e.cards, l] : [...e.cards.slice(0, b), l, ...e.cards.slice(b)];
  return V({ ...e, cards: g });
}
function _t(e, t, o) {
  const n = bt(o.label);
  if (!n.label) return "A card needs some words as well as a number.";
  if (e.kind === "budget" && n.amount === void 0) return "Write the cost on the note, like 'Contractor $45k', then drop it.";
  const a = Ue(e, [{
    kind: "add_card",
    lane: { id: t },
    label: n.label,
    ...e.kind === "launch-plan" ? { duration: Math.min(60, Math.max(1, n.days ?? 2)) } : n.amount !== void 0 ? { amount: n.amount } : {}
  }]);
  if ("refused" in a) return a.refused.reason;
  const s = a.workshop.cards;
  return s[s.length - 1] = { ...s[s.length - 1], id: Mt(e, o.id) }, a.workshop;
}
function Rt(e, t) {
  return e.kind === "release-plan" ? t.label + `
` + t.points + " points" : e.kind === "launch-plan" ? t.label + " · " + t.duration + "d" : (e.kind === "pipeline" || e.kind === "budget") && t.amount !== void 0 ? t.label + `
` + q(t.amount, e.forecast?.currency ?? e.budget?.currency) : t.label;
}
function qo(e, t) {
  return e.kind === "launch-plan" ? so(t) : de(e) && t.amount !== void 0 ? t.label + " · " + q(t.amount, e.forecast?.currency ?? e.budget?.currency) : t.label;
}
function dn(e, t) {
  const o = e.cards.find((n) => n.id === t);
  if (!o) return "That card is no longer on the board.";
  if (!ln(e)) return e.lanes.some((n) => n.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((n) => n.cardId === t)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const n = o.allowedLaneIds.map((s) => e.lanes.find((l) => l.id === s).label), a = n.length > 1 ? n.slice(0, -1).join(", ") + " or " + n.at(-1) : n[0];
    return `${o.label} may only be in ${a}, so it stays a card.`;
  }
  return null;
}
function wt(e, t) {
  if (dn(e, t) !== null) return null;
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
    const s = Oe(e, t);
    return o.capacity ? s + " / " + o.capacity + " points" : s + " points";
  }
  if (e.kind === "launch-plan") return ro(e, t);
  if (e.kind === "pipeline") return co(e, t);
  if (e.kind === "budget") return mo(e, t);
  const n = na(e, t);
  if (n) return "$" + n.amount + " · " + n.description;
  const a = e.cards.filter((s) => s.laneId === t).length;
  return o.capacity !== void 0 ? a + " of " + o.capacity : a + (a === 1 ? " card" : " cards");
}
const wn = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, cn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function Wt(e, t = wn, o = 28) {
  const { pitch: n, row: a, top: s } = t, l = !!e.lanes[0].station, b = e.lanes.map((h) => e.cards.filter((u) => u.laneId === h.id).length), g = s + Math.max(1, ...b) * a + 36, $ = e.lanes.map((h, u) => ({
    x: l ? h.station.column * (n + o) : u * n,
    y: l ? h.station.row * g : 0
  }));
  return {
    points: $,
    width: Math.max(...$.map((h) => h.x)) + n,
    height: Math.max(...$.map((h, u) => h.y + s + (l ? Math.max(1, b[u]) : b[u] + 1) * a))
  };
}
function Ta() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function gn(e, t) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((a) => a.id));
  let n = 1;
  for (; o.has(t + "-" + n); ) n++;
  return t + "-" + n;
}
function zt(e) {
  const t = V(e);
  if (t.kind || t.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return t;
}
function Jo(e, t) {
  const o = zt(e), n = gn(o, "lane");
  return o.lanes.push({ id: n, label: t.label, ...t.capacity === void 0 ? {} : { capacity: t.capacity } }), o.presentationOrder?.push(n), V(o);
}
function Yo(e, t, o) {
  const n = zt(e);
  return n.cards.push({
    id: gn(n, "card"),
    label: o.label,
    laneId: t,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), V(n);
}
function Pa() {
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
function gt(e, t, o) {
  const n = V(e);
  if (n.kind || !n.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const a = n.lanes.find((h) => h.id === t);
  if (!a?.station) throw new Error("Choose a station on this map.");
  if (n.lanes.length >= Lt) throw new Error("A map can have up to five stations.");
  const s = ce(o?.label), l = ce(o?.outcome, 160), b = gn(n, "station");
  let g, $ = 1 / 0;
  for (let h = 0; h < _n; h++)
    for (let u = 0; u < _n; u++) {
      if (n.lanes.some((k) => k.station.column === u && k.station.row === h)) continue;
      const v = Math.abs(a.station.column - u) + Math.abs(a.station.row - h);
      v < $ && ($ = v, g = { column: u, row: h });
    }
  if (!g) throw new Error("There is no free station position.");
  return a.station.next.push(b), n.lanes.push({ id: b, label: s, station: { ...g, next: [], outcome: l, ...o.image === void 0 ? {} : { image: Pt(o.image) } } }), n.presentationOrder?.push(b), n;
}
const La = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, Ft = (e) => "caption-" + e, Ke = (e) => "column-" + e, ee = { lane: Fe, card: ke, image: mn, caption: Ft, column: Ke };
function Bt(e, t) {
  let o = 2;
  for (; t(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Ln(e, t, o) {
  const n = Math.max(0, Math.min(o, e / 2, t / 2)), a = e, s = t;
  return n ? `M ${n} 0 H ${a - n} Q ${a} 0 ${a} ${n} V ${s - n} Q ${a} ${s} ${a - n} ${s} H ${n} Q 0 ${s} 0 ${s - n} V ${n} Q 0 0 ${n} 0 Z` : `M 0 0 H ${a} V ${s} H 0 Z`;
}
function yt(e, t) {
  const o = (n) => Math.round(parseInt(e.slice(n, n + 2), 16) * (1 - t) + 255 * t).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function kt(e, t, o, n) {
  for (let a = t; a > 11; a--) {
    const s = Math.max(1, Math.floor(o / (a * 0.55)));
    if (e.split(`
`).reduce((b, g) => b + Math.max(1, Math.ceil(g.length / s)), 0) * a * 1.3 <= n) return a;
  }
  return Math.min(t, 11);
}
const Ht = 152, Wn = Ht + 12, Vo = 12;
function Zo(e, t) {
  const o = e?.lanesPerRow;
  if (o === void 0) return t;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, t);
}
function We(e, t = {}) {
  const o = V(e), { pitch: n, row: a, top: s } = wn, l = o.lanes.map((v) => o.cards.filter((k) => k.laneId === v.id).length), b = (v) => Math.max(l[v], (Array.isArray(t.rows) ? t.rows[v] : t.rows) ?? 0), g = !!o.lanes[0].station, $ = o.lanes.some((v) => v.station?.image), h = Zo(t.layout, o.lanes.length), u = [];
  if (g) {
    const { points: v } = Wt(o);
    o.lanes.forEach((k, L) => u.push({
      laneId: k.id,
      x: v[L].x,
      y: v[L].y + ($ ? k.station.row * Wn : 0),
      width: n,
      height: s + (k.station.image ? Wn : 0) + Math.max(1, l[L]) * a,
      column: k.station.column,
      row: k.station.row
    }));
  } else {
    let v = 0;
    for (let k = 0; k < o.lanes.length; k += h) {
      const L = o.lanes.slice(k, k + h), R = s + (Math.max(...L.map((K, E) => b(k + E))) + 1) * a;
      L.forEach((K, E) => u.push({ laneId: K.id, x: E * n, y: v, width: n, height: R, column: E, row: k / h })), v += R + Vo;
    }
  }
  return { places: u, width: Math.max(...u.map((v) => v.x + v.width)), height: Math.max(...u.map((v) => v.y + v.height)) };
}
function Qo(e, t) {
  const { pitch: o, width: n, row: a, height: s, top: l } = wn, b = t.origin ?? { x: 0, y: 0 }, g = !!e.lanes[0].station, { places: $ } = We(e, t), h = t.style ?? {}, u = h.textColor ?? je.fontColor, v = h.borderColor ?? je.borderColor, k = h.borderWidth ?? je.borderWidth, L = h.cornerRadius ?? 0, R = h.fontSize ?? je.fontSize, K = h.laneFontSize ?? R + 2, E = h.captionFontSize ?? Math.max(11, R - 1), r = [], f = (I) => {
    const C = { options: {
      shapeHint: "rectangle",
      vectorPath: Ln(I.width, I.height, L),
      foregroundColor: u,
      borderColor: v,
      borderWidth: k,
      ...h.fontFamily ? { fontFamily: h.fontFamily } : {},
      ...I
    }, relationships: { associations: [] } };
    return r.push(C), C;
  };
  e.lanes.forEach((I, C) => {
    const P = $[C], z = b.x + P.x, W = b.y + P.y, _ = I.station?.image;
    f({
      id: Ke(I.id),
      text: "",
      name: I.label,
      xPos: z + 2,
      yPos: W,
      width: o - 4,
      height: P.height,
      vectorPath: Ln(o - 4, P.height, L ? L + 2 : 0),
      backgroundColor: g ? "#fcf9ed" : yt(cn[C], 0.6),
      borderColor: g ? "#a8b5aa" : yt(cn[C], 0.1),
      borderWidth: 1,
      ...g ? { borderStyle: "dashed" } : {}
    }), f({
      id: Fe(I.id),
      text: I.label,
      name: I.label,
      xPos: z + 8,
      yPos: W + 6,
      width: n,
      height: 58,
      backgroundColor: cn[C],
      fontSize: kt(I.label, K, n - 16, 50)
    }), f({
      id: Ft(I.id),
      text: ge(e, I.id),
      name: I.label,
      xPos: z + 8,
      yPos: W + 66,
      width: n,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: E
    }), _ && r.push({ options: {
      id: mn(I.id),
      name: _.alt,
      text: "",
      xPos: z + 8,
      yPos: W + l,
      width: n,
      height: Ht,
      shapeHint: "rectangle",
      image: _.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((D) => D.laneId === I.id).forEach((D, be) => {
      const re = Rt(e, D), ve = g ? n - 20 : n, Le = g ? s - 6 : s, ne = g ? {} : { ...h.card, ...D.look }, J = g ? L : h.card?.cornerRadius ?? L;
      f({
        id: ke(D.id),
        text: re,
        name: D.label,
        xPos: z + (g ? 18 : 8),
        yPos: W + l + (_ ? Wn : 0) + be * a,
        width: ve,
        height: Le,
        ...J !== L ? { vectorPath: Ln(ve, Le, J) } : {},
        backgroundColor: g ? "#ffda75" : ne.backgroundColor ?? h.backgroundColor ?? je.backgroundColor,
        ...ne.textColor ? { foregroundColor: ne.textColor } : {},
        ...ne.fontFamily ? { fontFamily: ne.fontFamily } : {},
        ...ne.borderColor ? { borderColor: ne.borderColor } : {},
        ...ne.borderWidth !== void 0 ? { borderWidth: ne.borderWidth } : {},
        fontSize: kt(re, ne.fontSize ?? R, ve - 16, Le - 8)
      });
    });
  });
  const A = new Map(r.map((I) => [I.options.id, I]));
  for (const I of e.lanes)
    I.station && (A.get(Ke(I.id)).relationships.associations = I.station.next.map((C) => ({
      id: I.id + "-to-" + C,
      parentId: Ke(I.id),
      childId: Ke(C),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const I of e.cards)
      for (const C of I.dependsOn ?? []) {
        const P = ke(C), z = ke(I.id);
        A.get(P).relationships.associations.push({
          id: `dependency-${C.length}-${C}-${I.id}`,
          parentId: P,
          childId: z,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (t.beside) {
    const I = new Set(t.beside), C = new Set(r.map((W) => W.options.id)), P = /* @__PURE__ */ new Map();
    for (const W of [...C]) {
      if (!I.has(W)) continue;
      const _ = Bt(W, (D) => I.has(D) || C.has(D));
      C.add(_), P.set(W, _);
    }
    const z = (W) => P.get(W) ?? W;
    for (const W of r) {
      W.options.id = z(W.options.id);
      for (const _ of W.relationships.associations)
        _.parentId = z(_.parentId), _.childId = z(_.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function Xo(e, t) {
  const o = V(e);
  if (t?.native) return Qo(o, t);
  const { width: n, row: a, height: s, top: l } = wn, b = [];
  function g(k, L, R, K, E, r) {
    b.push({ options: {
      id: k,
      text: L,
      name: L,
      xPos: R,
      yPos: K,
      width: n,
      height: E,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: $ } = Wt(o), h = 152, u = h + 12, v = o.lanes.some((k) => k.station?.image);
  o.lanes.forEach((k, L) => {
    const R = $[L].x, K = $[L].y + (v ? (k.station?.row ?? 0) * u : 0), E = k.station?.image, r = o.kind === "release-plan" ? k.label + `
` + (k.capacity ? Oe(o, k.id) + " / " + k.capacity + " points" : Oe(o, k.id) + " points") : k.label;
    g(Fe(k.id), r, R, K, l - 12, cn[L]), E && b.push({ options: {
      id: mn(k.id),
      name: E.alt,
      text: "",
      xPos: R,
      yPos: K + l,
      width: n,
      height: h,
      shapeHint: "rectangle",
      image: E.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((f) => f.laneId === k.id).forEach((f, A) => g(ke(f.id), Rt(o, f), R, K + l + (E ? u : 0) + A * a, s, "#fffdf6"));
  });
  for (const k of o.lanes) {
    if (!k.station) continue;
    const L = b.find((R) => R.options.id === Fe(k.id));
    L.relationships.associations = k.station.next.map((R) => ({ id: k.id + "-to-" + R, parentId: L.options.id, childId: Fe(R), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), L.options.text = k.label + `
` + k.station.outcome, L.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const k = new Map(b.map((L) => [L.options.id, L]));
    for (const L of o.cards)
      for (const R of L.dependsOn ?? []) {
        const K = ke(R), E = ke(L.id);
        k.get(K).relationships.associations.push({
          id: `dependency-${R.length}-${R}-${L.id}`,
          parentId: K,
          childId: E,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
}
const Ea = {
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
}, zn = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], Kn = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function Na() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: zn.map(({ id: e, who: t, quote: o }) => ({ id: e, label: t + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: zn.map(({ id: e, action: t, signal: o }) => ({ id: "test-" + e, label: t, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function Ma() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...Kn.map(({ id: e, label: t, rate: o }) => ({ id: e, label: t + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, t) => ({ id: "fund-" + t, label: e + " $200", laneId: t === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function He(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((n) => n.station)) return;
  const t = e.experience.kind, o = t === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...Kn.map((n) => n.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((n) => o.includes(n.id))) && !(t === "customer-interviews" && (!e.cards.every((n) => zn.some((a) => a.id === n.id)) || e.cards.filter((n) => n.laneId === "prototype").length > 1)))
    return t;
}
function ea(e, t, o) {
  const n = He(e), a = e.cards.find((l) => l.id === t);
  if (!n || !a || a.laneId === o) return null;
  let s = e;
  if (n === "customer-interviews") {
    if (o !== "prototype") return null;
    const l = e.cards.find((b) => b.laneId === o);
    if (l) {
      if (!hn(e, l).some((b) => b.id === "interviews")) return null;
      s = Rn(e, l.id, "interviews");
    }
  }
  return hn(s, a).some((l) => l.id === o) ? Rn(s, t, o) : null;
}
function na(e, t) {
  if (He(e) !== "experiment-budget") return null;
  const o = Kn.find((s) => s.id === t), n = e.cards.filter((s) => s.laneId === t).length, a = n * (o?.per ?? 0);
  return { amount: n * 200, description: o ? a + " " + (a === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  je as DEFAULT_NOTE_STYLE,
  bo as WORKSHOP_BOARD_KINDS,
  rn as WorkshopReferenceError,
  gt as addWorkshopBranch,
  Yo as addWorkshopCard,
  Jo as addWorkshopLane,
  Ue as applyWorkshopEdits,
  Aa as attachWorkshop,
  hn as availableLanes,
  mo as budgetCaption,
  Pe as budgetCommitted,
  ma as budgetLimits,
  $t as budgetRefusal,
  Fn as budgetShiftLimits,
  po as budgetShiftRefusal,
  Bo as businessBoardKinds,
  de as businessKind,
  To as canHangPanel,
  Kn as channels,
  Oo as checkWorkshopReplacement,
  go as countWord,
  Ma as createBudgetWorkshop,
  Na as createInterviewWorkshop,
  Ta as createLaneWorkshop,
  Pa as createWorkshopMap,
  no as days,
  Oa as decodeWorkshopFragment,
  $a as describeFocusDarkroom,
  ya as describeWorkshopEdits,
  to as downstreamTasks,
  Ca as encodeWorkshopFragment,
  ia as handoffSummary,
  va as hangGalleryPanel,
  Ea as industrialWorkshop,
  xa as initialFocusDarkroom,
  zn as interviews,
  cn as laneColors,
  vt as launchFinish,
  ao as launchLinkRefusal,
  ze as launchOverrun,
  ro as launchPlanCaption,
  ot as launchPlanLimits,
  ua as launchPlanRefusal,
  so as launchTaskText,
  Ce as listed,
  tn as listeningRoom,
  da as listeningRoomCaption,
  Et as maxWorkshopCards,
  q as money,
  ka as moonGallery,
  Rn as moveWorkshopCard,
  ga as named,
  La as nightTransfer,
  Ia as normalizeFocusDarkroom,
  la as normalizeListeningRoom,
  ba as normalizeMoonGallery,
  aa as normalizeOfflineHandoff,
  oa as offlineHandoff,
  co as pipelineCaption,
  ha as pipelineForecast,
  An as pipelineLimits,
  xt as pipelineRefusal,
  fo as planBudgetMove,
  It as planLaunchPlanMove,
  lo as planPipelineMove,
  ea as planStartupMove,
  yo as pointing,
  Ot as printFields,
  bt as readNoteNumbers,
  Oe as releaseLoad,
  ca as releasePlan,
  sa as resolveHandoff,
  Uo as resolveWorkshopSignals,
  ra as reviewHandoff,
  O as said,
  wa as sampleBudget,
  fa as sampleLaunchPlan,
  pa as samplePipeline,
  Te as scheduleLaunch,
  ho as shiftBudget,
  He as startupExperienceKind,
  Bn as unquoted,
  uo as validateBudget,
  oo as validateLaunchPlan,
  io as validatePipeline,
  V as validateWorkshop,
  En as withLink,
  qe as withTaskValue,
  un as workshopBoardKind,
  na as workshopBudgetResult,
  Be as workshopCandidate,
  wt as workshopCardAsNote,
  dn as workshopCardAsNoteRefusal,
  Go as workshopCardLookOf,
  qo as workshopCardNoteText,
  Rt as workshopCardText,
  mt as workshopDestinations,
  Dn as workshopEditKinds,
  Nn as workshopFinder,
  ge as workshopLaneCaption,
  We as workshopLanePlaces,
  wn as workshopLayout,
  ee as workshopNodeIds,
  Ge as workshopNoteCandidate,
  Re as workshopNoteRefusal,
  Wt as workshopPositions,
  Gn as workshopPresentationLanes,
  Sa as workshopPresentationScenes,
  $o as workshopReferences,
  sn as workshopRefusal,
  Bt as workshopStandInId,
  ln as workshopTakesNotes,
  Xo as workshopToSlate
};
