import { workshopEditKinds as Y, workshopRuleSchema as J, registerWorkshopRules as gn, said as m } from "./workshop-model.mjs";
const O = 864e5, Ln = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], V = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function y(n) {
  if (typeof n != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(n)) return NaN;
  const e = Date.UTC(+n.slice(0, 4), +n.slice(5, 7) - 1, +n.slice(8, 10));
  return new Date(e).toISOString().slice(0, 10) === n ? e : NaN;
}
const j = (n, e) => new Date(y(n) + Math.round(e) * O).toISOString().slice(0, 10), T = (n, e) => Math.round((y(e) - y(n)) / O), $n = (n, e) => new Date(y(n) + Math.floor(e) * O).getUTCDay(), W = (n, e) => {
  const t = $n(n, e);
  return t === 0 || t === 6;
};
function x(n, e) {
  const t = new Date(y(n) + Math.floor(e) * O);
  return Ln[t.getUTCDay()] + " " + t.getUTCDate() + " " + V[t.getUTCMonth()];
}
function F(n) {
  const e = new Date(y(n));
  return e.getUTCDate() + " " + V[e.getUTCMonth()];
}
function Z(n) {
  const e = y(n) || Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), (/* @__PURE__ */ new Date()).getUTCMonth(), (/* @__PURE__ */ new Date()).getUTCDate()), t = new Date(e).toISOString().slice(0, 10);
  return j(t, (8 - new Date(e).getUTCDay()) % 7);
}
function Nn(n, e, t = 0) {
  const a = e.trim().replace(/[,.]/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (y(a)) return T(n, a);
  const s = (d) => V.findIndex((u) => d.startsWith(u.toLowerCase())), i = new Date(y(n) + t * O);
  let r, o, l;
  if ((r = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})$/.exec(a)) && s(r[2]) >= 0)
    o = +r[1], l = s(r[2]);
  else if ((r = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) && s(r[1]) >= 0)
    o = +r[2], l = s(r[1]);
  else if ((r = /^(?:early\s+)?([a-z]{3,9})$/.exec(a)) && s(r[1]) >= 0)
    o = 1, l = s(r[1]);
  else if (r = /^(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) {
    for (let d = 0; d < 13; d++) {
      const u = Date.UTC(i.getUTCFullYear(), i.getUTCMonth() + d, +r[1]);
      if (new Date(u).getUTCDate() === +r[1] && u >= i.getTime()) return Math.round((u - y(n)) / O);
    }
    return null;
  } else return null;
  for (const d of [i.getUTCFullYear(), i.getUTCFullYear() + 1]) {
    const u = Date.UTC(d, l, o);
    if (new Date(u).getUTCDate() !== o) return null;
    if (u >= i.getTime() || d > i.getUTCFullYear()) return Math.round((u - y(n)) / O);
  }
  return null;
}
const Un = { cal: (n) => n, idx: (n) => n }, sn = /* @__PURE__ */ new Map();
function S(n) {
  if (!n?.workdays) return Un;
  const e = sn.get(n.origin);
  if (e) return e;
  const t = [];
  for (let s = 0; t.length < 800; s++) W(n.origin, s) || t.push(s);
  const a = {
    cal(s) {
      const i = Math.floor(s), r = s - i;
      return i < 0 ? i : (t[Math.min(i, t.length - 1)] ?? i) + r;
    },
    idx(s) {
      let i = 0, r = t.length;
      for (; i < r; ) {
        const o = i + r >> 1;
        t[o] < s ? i = o + 1 : r = o;
      }
      return i;
    }
  };
  return sn.set(n.origin, a), a;
}
function A(n) {
  if (n.clock)
    return { origin: n.clock.origin, workdays: !!n.behaviour?.rules.some((e) => e.on && e.kind === "workdays") };
}
const Pn = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, zn = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function pn(n) {
  let e = String(n ?? "").replace(/\s+/g, " ").trim();
  const t = { label: e }, a = Pn.exec(e);
  if (a) {
    const r = Number(a[1].replace(",", ".")), o = /^w/i.test(a[2]);
    t.days = Math.max(1, Math.ceil(o ? r * 5 : r)), e = e.slice(0, a.index) + " " + e.slice(a.index + a[0].length);
  }
  const s = [...e.matchAll(zn)].filter((r) => r[1] || r[3] || Number(r[2].replace(",", "")) >= 1e3), i = s.find((r) => r[1] || r[3]) ?? s[0];
  if (i) {
    const r = /k/i.test(i[3] ?? "") ? 1e3 : /m/i.test(i[3] ?? "") ? 1e6 : 1;
    t.amount = Math.round(Number(i[2].replace(",", i[3] ? "." : "")) * r), i[1] && (t.currency = i[1]), e = e.slice(0, i.index) + " " + e.slice(i.index + i[0].length);
  }
  return t.label = e.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), t;
}
function Fn(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = (r, o) => (Math.round(r * 10) / 10).toString() + o, i = a >= 1e6 ? s(a / 1e6, "M") : a >= 1e3 ? s(a / 1e3, "k") : String(Math.round(a));
  return t + e + i;
}
const K = (n) => n + (n === 1 ? " day" : " days"), fe = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function Rn(n) {
  const e = pn(n);
  return e.label ? e : "A card needs some words as well as a number.";
}
function jn(n) {
  const e = pn(n);
  return e.label ? e : { label: n };
}
function kn(n) {
  const e = new Set([...n.lanes, ...n.cards].map((a) => a.id));
  let t = 1;
  for (; e.has("card-" + t); ) t++;
  return "card-" + t;
}
function v(n, e, t, a, s = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < e || n > t || !s && !Number.isInteger(n)) throw new Error(a);
  return n;
}
function ge(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function yn(n, e, t) {
  const a = n[e];
  if (!a || typeof a != "object" || Array.isArray(a)) throw new Error(t);
  return a;
}
function mn(n) {
  const e = (t) => Y.find((a) => a.kind === t);
  for (const t of n.kinds ?? []) Y.some((a) => a.kind === t.kind) || Y.push(t);
  for (const [t, a] of Object.entries(n.boards ?? {})) {
    const s = e(t);
    for (const i of a) s.boards.includes(i) || (s.boards.push(i), delete s.refusals[i]);
  }
  for (const [t, a] of Object.entries(n.fields ?? {})) Object.assign(e(t).fields, a);
  n.rules && (J.kinds.push(...n.rules.kinds.filter((t) => !J.kinds.includes(t))), Object.assign(J.keys, n.rules.keys));
}
function k(n) {
  const e = new Map(n.cards.map((d) => [d.id, d])), t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d) => {
    const u = t.get(d.id);
    if (u) return u;
    if (a.has(d.id)) throw new Error("Tasks can't wait on each other in a circle.");
    a.add(d.id);
    let g = 0;
    for (const h of d.dependsOn ?? []) {
      const f = e.get(h);
      if (!f) throw new Error("A task waits on a task that is not on the plan.");
      g = Math.max(g, s(f).end);
    }
    g += d.lag ?? 0;
    const c = { start: g, end: g + (d.duration ?? 1), slack: 0, critical: !1, from: 0, to: 0 };
    return t.set(d.id, c), a.delete(d.id), c;
  };
  n.cards.forEach(s);
  const i = Math.max(0, ...[...t.values()].map((d) => d.end)), r = /* @__PURE__ */ new Map(), o = (d) => {
    const u = r.get(d.id);
    if (u !== void 0) return u;
    let g = i;
    for (const c of n.cards)
      c.dependsOn?.includes(d.id) && (g = Math.min(g, o(c) - (c.duration ?? 1) - (c.lag ?? 0)));
    return r.set(d.id, g), g;
  }, l = S(A(n));
  for (const d of n.cards) {
    const u = t.get(d.id);
    u.slack = o(d) - u.end, u.critical = u.slack === 0, u.from = l.cal(u.start), u.to = l.cal(u.end - 1) + 1;
  }
  return t;
}
function wn(n) {
  return Math.max(0, ...[...k(n).values()].map((e) => e.end));
}
const E = (n) => S(A(n)).idx(n.launch?.day ?? 0), M = (n) => n.launch?.name ?? "launch", b = (n, e) => n.clock ? x(n.clock.origin, e) : "day " + e;
function _(n) {
  return !n.behaviour || n.behaviour.rules.some((e) => e.on && e.kind === "deadline" && e.at === "launch" && e.severity === "refuse");
}
const vn = (n) => !!n.behaviour?.rules.some((e) => e.on && e.kind === "cascade" && e.onConflict === "stop");
function $(n) {
  const e = n.behaviour?.rules.find((t) => t.on && t.kind === "snap");
  return e && e.kind === "snap" && e.unit === "week" ? A(n)?.workdays ? 5 : 7 : 1;
}
function Wn(n, e, t, a) {
  const s = n.cards.find((f) => f.id === e);
  if (!s) throw new Error("That task is no longer on the plan.");
  const i = k(n).get(e), r = S(A(n)), o = $(n), l = s.lag ?? 0, d = s.duration ?? 1, u = (f) => Math.round(f / o) * o;
  if (t === "end") {
    const f = u(r.idx(Math.round(i.to + a)) - i.start), p = n.kind === "hiring-plan" ? 140 : 60;
    return f > p ? { lag: l, duration: Math.floor(p / o) * o, held: "longest" } : f < o ? { lag: l, duration: o, held: "length" } : { lag: l, duration: f };
  }
  const g = Math.round(i.from + a);
  let c = u((g < 0 ? g : r.idx(g)) - i.start), h;
  return l + c < 0 && (c = -Math.floor(l / o) * o, h = "ready"), d - c < o && (c = Math.floor((d - o) / o) * o, h = "length"), { lag: l + c, duration: d - c, ...h && { held: h } };
}
function Hn(n, e) {
  const t = /* @__PURE__ */ new Set(), a = (s) => {
    for (const i of n.cards) i.dependsOn?.includes(s) && !t.has(i.id) && (t.add(i.id), a(i.id));
  };
  return a(e), t;
}
function I(n, e) {
  const t = n.launch?.day ?? 0, a = E(n), s = k(n), i = e ? s.get(e) : void 0, r = i && i.end > a ? { label: "That", t: i } : n.cards.map((o) => ({ label: o.label, t: s.get(o.id) })).filter((o) => o.t.end > a).sort((o, l) => l.t.end - o.t.end)[0];
  return r ? n.clock ? r.label + " would run until " + b(n, r.t.to - 1) + "; " + M(n) + " is " + b(n, t) + "." : (r.label === "That" ? "That ends on day " : "That pushes " + r.label + " to day ") + r.t.end + ", after launch on day " + t + "." : null;
}
function L(n, e, t) {
  return e.field === "day" ? { ...n, launch: { ...n.launch, day: t } } : { ...n, cards: n.cards.map((a) => a.id === e.cardId ? { ...a, [e.field]: t } : a) };
}
function G(n, e, t, a = !1) {
  const s = k(n);
  return { ...n, cards: n.cards.map((i) => {
    if (i.id !== e) return i;
    const r = a ? (i.dependsOn ?? []).filter((d) => d !== t) : [...i.dependsOn ?? [], t], o = Math.max(0, ...r.map((d) => s.get(d)?.end ?? 0)), l = { ...i, dependsOn: r, lag: Math.max(0, s.get(i.id).start - o) };
    return r.length || delete l.dependsOn, l.lag || delete l.lag, l;
  }) };
}
function xn(n, e, t) {
  const a = k(n), s = new Map(e.cards.map((l) => [l.id, { ...l }])), i = /* @__PURE__ */ new Map();
  let r = null;
  const o = (l) => {
    const d = i.get(l.id);
    if (d !== void 0) return d;
    let u = 0, g;
    for (const f of l.dependsOn ?? []) {
      const p = o(s.get(f));
      p > u && (u = p, g = s.get(f));
    }
    const c = a.get(l.id);
    if (c && !t.has(l.id)) {
      const f = c.start - u;
      f < -1e-9 && !r && (r = g.label + " would end after " + l.label + " starts on " + b(n, c.from) + ". " + l.label + " waits on it, and a slip stops at the tasks that wait on it."), f > 1e-9 ? l.lag = f : delete l.lag;
    }
    const h = u + (l.lag ?? 0) + (l.duration ?? 1);
    return i.set(l.id, h), h;
  };
  for (const l of s.values()) o(l);
  return r ?? { ...e, cards: e.cards.map((l) => s.get(l.id)) };
}
const P = 120;
function Q(n) {
  const e = n.hiring;
  if (!e) return P;
  const t = k(n), a = n.cards.map((i) => ({ day: t.get(i.id).to, monthly: e.bands.find((r) => r.id === i.band)?.monthly ?? 0 }));
  let s = e.cash;
  for (let i = 0; i < P * 52 / 12; i++) {
    const r = i * 7;
    e.funding && e.funding.day >= r && e.funding.day < r + 7 && (s += e.funding.amount);
    const o = (e.burn + a.reduce((l, d) => l + (d.day <= r ? d.monthly : 0), 0)) * 12 / 52;
    if (s < o) return Math.floor((i + Math.max(0, s) / o) * 12 / 52 * 10) / 10;
    s -= o;
  }
  return P;
}
const An = (n) => n >= P ? "10 years or more" : n + (n === 1 ? " month" : " months"), q = (n) => n.charAt(0).toUpperCase() + n.slice(1), Bn = (n) => n.length > 1 ? n.slice(0, -1).join(", ") + " and " + n.at(-1) : n[0] ?? "", X = (n, e) => n.lanes.find((t) => t.id === e)?.label ?? e ?? "", rn = (n) => n.kind === "hiring-plan" ? "Hires" : "Tasks";
function D(n, e) {
  const t = n.severity === "warn";
  switch (n.kind) {
    case "deadline":
      return n.at === "runway" ? t ? "Runway under " + n.floor + " months is flagged." : "Runway stays above " + n.floor + " months." : t ? q(M(e)) + " is a soft line: a task may slip past it, shown in red." : q(M(e)) + " is a hard line: every task ends by " + b(e, e.launch?.day ?? 0) + ".";
    case "overlap": {
      const a = n.lane ? X(e, n.lane) : "a team";
      return t ? "Overlapping tasks in " + a + " are flagged." : n.lane ? a + "’s tasks can’t overlap." : "Tasks in a team can’t overlap.";
    }
    case "snap":
      return rn(e) + " snap to whole " + n.unit + "s.";
    case "workdays":
      return "Days are working days: weekends don’t count.";
    case "blackout": {
      const a = F(n.start) + " – " + F(n.end);
      return t ? q(n.label) + ", " + a + ", is flagged." : "Nothing ships in " + n.label + ", " + a + ".";
    }
    case "cascade":
      return "A slip " + (n.onConflict === "stop" ? "stops at" : "pushes") + " the " + rn(e).toLowerCase() + " that wait on it.";
    case "locked": {
      const a = n.cards.map((s) => e.cards.find((i) => i.id === s)?.label ?? s);
      return Bn(a) + (a.length > 1 ? " are" : " is") + " locked.";
    }
  }
  return "";
}
const pe = ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"], on = ["locked", "cascade", "blackout", "overlap", "snap", "deadline"], Yn = (n, e) => (n.dependsOn ?? []).join() === (e.dependsOn ?? []).join();
function bn(n, e) {
  const t = (n.behaviour?.rules ?? []).filter((c) => c.on).sort((c, h) => on.indexOf(c.kind) - on.indexOf(h.kind)), a = [];
  if (!t.length) return { ok: !0, warnings: a };
  const s = n.clock && e.clock ? T(n.clock.origin, e.clock.origin) : 0, i = k(n), r = s ? new Map([...k(e)].map(([c, h]) => [c, { ...h, from: h.from + s, to: h.to + s }])) : k(e), o = new Map(n.cards.map((c) => [c.id, c])), l = e.cards.filter((c) => {
    const h = o.get(c.id);
    return !h || (h.lag ?? 0) !== (c.lag ?? 0) || h.duration !== c.duration || h.laneId !== c.laneId || !Yn(h, c);
  }), d = e.cards.filter((c) => {
    const h = r.get(c.id), f = i.get(c.id);
    return !f || h.from !== f.from || h.to !== f.to || o.get(c.id).laneId !== c.laneId;
  }), u = l[0] ?? d[0], g = (c) => {
    switch (c.kind) {
      case "locked":
        for (const h of d) if (c.cards.includes(h.id) && i.has(h.id)) return h.label + " is locked: it stays on " + b(n, i.get(h.id).from) + ".";
        return null;
      case "cascade": {
        if (c.onConflict !== "stop") return null;
        const h = d.find((f) => i.has(f.id) && !l.includes(f));
        return h ? "That would push " + h.label + ", which waits on it. " + D(c, n) : null;
      }
      case "blackout": {
        const h = A(n);
        if (!h) return null;
        const f = T(h.origin, c.start), p = T(h.origin, c.end), w = d.find((N) => {
          const C = r.get(N.id);
          for (let B = Math.max(Math.floor(C.from), f); B < Math.min(Math.ceil(C.to), p + 1); B++) if (!h.workdays || !W(h.origin, B)) return !0;
          return !1;
        });
        return w ? w.label + " would run into " + c.label + " (" + F(c.start) + " – " + F(c.end) + ")." : null;
      }
      case "overlap": {
        const h = (f, p) => f.from < p.to && p.from < f.to;
        for (const f of d) for (const p of e.cards)
          if (!(f === p || f.laneId !== p.laneId || c.lane && f.laneId !== c.lane || !h(r.get(f.id), r.get(p.id))))
            return f.label + " and " + p.label + " would overlap in " + X(e, f.laneId) + ". " + D(c, n);
        return null;
      }
      case "snap": {
        if (c.unit !== "week") return null;
        const h = A(n)?.workdays ? 5 : 7;
        return l.find((p) => {
          const w = o.get(p.id);
          return (p.lag ?? 0) % h && (!w || (w.lag ?? 0) !== (p.lag ?? 0)) || (p.duration ?? 0) % h && (!w || w.duration !== p.duration);
        }) ? D(c, n) : null;
      }
      case "deadline": {
        if (c.at === "runway") {
          const w = Q(e);
          return w < c.floor && w < Q(n) ? "That takes runway to " + An(w) + ". " + D(c, n) : null;
        }
        const h = E(e), f = E(n);
        return e.cards.some((w) => {
          const N = r.get(w.id), C = i.get(w.id);
          return N.end > h && (!C || C.end <= f || N.end > C.end || h < f);
        }) ? I(e, u?.id) : null;
      }
    }
    return null;
  };
  for (const c of t) {
    const h = g(c);
    if (h) {
      if (c.severity === "warn") {
        a.push(h);
        continue;
      }
      return { refused: { sentence: h, ruleId: c.id, set: c.set, cardId: u?.id ?? "", laneId: u?.laneId ?? "" } };
    }
  }
  return { ok: !0, warnings: a };
}
const Jn = (n) => {
  if (typeof n != "string" || !n.trim() || n.trim().length > 40 || /[<>\u0000-\u001f]/.test(n)) throw new Error("Name the freeze in plain words, up to 40 letters.");
  return n.trim();
};
function Mn(n) {
  return {
    keys: n,
    read(e, t, a, s) {
      const i = Object.keys(e).find((o) => !["id", "on", "severity", "set", "kind", ...n[e.kind].split(" ").filter(Boolean)].includes(o));
      if (i) throw new Error("A " + e.kind + " rule does not take " + i + ".");
      const r = { ...t, kind: e.kind };
      switch (e.kind) {
        case "deadline":
          if (e.at !== (a.kind === "hiring-plan" ? "runway" : "launch")) throw new Error(a.kind === "hiring-plan" ? "A hiring plan’s line is its runway." : "A launch plan’s line is launch day.");
          if (r.at = e.at, e.at === "runway") {
            if (typeof e.floor != "number" || !(e.floor >= 1 && e.floor <= 60) || Math.round(e.floor * 10) !== e.floor * 10) throw new Error("A runway floor is 1 to 60 months.");
            r.floor = e.floor;
          }
          break;
        case "overlap":
          e.lane !== void 0 && (r.lane = s(e.lane));
          break;
        case "snap":
          if (e.unit !== "day" && e.unit !== "week") throw new Error("A plan snaps to days or weeks.");
          r.unit = e.unit;
          break;
        case "blackout": {
          if (!y(e.start) || !y(e.end) || y(e.end) < y(e.start)) throw new Error("A freeze runs from one date to the same or a later one.");
          if (y(e.end) - y(e.start) > 92 * 864e5) throw new Error("A freeze lasts up to 3 months.");
          Object.assign(r, { start: e.start, end: e.end, label: Jn(e.label) });
          break;
        }
        case "cascade":
          if (e.onConflict !== "push" && e.onConflict !== "stop") throw new Error("A slip pushes the tasks that wait on it, or stops at them.");
          r.onConflict = e.onConflict;
          break;
        case "locked": {
          if (!Array.isArray(e.cards) || !e.cards.length || e.cards.length > 6) throw new Error("Say which tasks are locked.");
          if (e.cards.some((o) => !a.cards.some((l) => l.id === o))) throw new Error("A locked task stays on the plan. Unlock it first.");
          r.cards = [...new Set(e.cards)];
          break;
        }
      }
      return r;
    },
    sentence: D,
    contradiction(e, t) {
      const a = /* @__PURE__ */ new Set();
      let s = 0;
      for (const i of e.rules) {
        const r = i.kind === "overlap" ? "overlap:" + (i.lane ?? "") : i.kind === "blackout" ? "blackout:" + s++ : i.kind === "locked" ? "" : i.kind;
        if (r && a.has(r)) return "There is already a " + (i.kind === "deadline" ? M(t) + " line" : i.kind + " rule") + ". Change that one instead.";
        if (a.add(r), i.kind === "locked") for (const o of i.cards) {
          if (a.has("locked:" + o)) return X({ ...t, lanes: t.cards.map((l) => ({ id: l.id, label: l.label })) }, o) + " is already locked.";
          a.add("locked:" + o);
        }
      }
      return s > 6 ? "A plan has up to 6 freezes." : null;
    },
    check: bn,
    builtIn: (e) => e.kind === "launch-plan" && !e.behaviour ? ["Every task ends by " + M(e) + ".", "A slip pushes the tasks that wait on it."] : []
  };
}
function ke(n) {
  if (n.kind !== "launch-plan") return /* @__PURE__ */ new Set();
  const e = E(n);
  return new Set([...k(n)].filter(([, t]) => t.end > e).map(([t]) => t));
}
const qn = Mn({ deadline: "at", overlap: "lane", snap: "unit", workdays: "", blackout: "start end label", cascade: "onConflict", locked: "cards" }), Kn = { anyOf: [{ type: "string", minLength: 1, maxLength: 200 }, { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }] }, ln = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
mn({
  kinds: [
    {
      kind: "set_plan_start",
      summary: "Launch or hiring plan: move the plan’s first day. Every task, the line and a funding round keep their dates; a task that would start before the new first day starts on it. Working days and week snap as the plan’s rules say.",
      intent: !1,
      fields: { start: { type: "text", min: 10, max: 10, about: "The new first day, as 2026-11-30." } },
      boards: ["launch-plan", "hiring-plan"],
      refusals: {}
    },
    {
      kind: "set_plan_weeks",
      summary: "Hiring plan: how many weeks the plan runs (its last day). The first day stays.",
      intent: !1,
      fields: { weeks: { type: "integer", min: 13, max: 104, about: "Weeks, 13 to 104." } },
      boards: ["hiring-plan"],
      refusals: {}
    }
  ],
  boards: { add_rule: ["launch-plan", "hiring-plan"], set_rule: ["launch-plan", "hiring-plan"], remove_rule: ["launch-plan", "hiring-plan"] },
  fields: { set_rule: {
    floor: { type: "integer", min: 1, max: 60, optional: !0, about: "A runway floor, in months." },
    onConflict: { type: "choice", values: ["push", "stop"], optional: !0, about: "A slip pushes the tasks that wait on it, or stops at them." },
    unit: { type: "choice", values: ["day", "week"], optional: !0, about: "Snap to days or weeks." }
  } },
  rules: {
    kinds: ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"],
    keys: {
      at: { enum: ["launch", "runway"] },
      floor: { type: "number", minimum: 1, maximum: 60 },
      unit: { enum: ["day", "week"] },
      start: ln,
      end: ln,
      label: { type: "string", minLength: 1, maxLength: 40 },
      onConflict: { enum: ["push", "stop"] },
      cards: { type: "array", items: Kn, minItems: 1, maxItems: 6 }
    }
  }
});
function H(n, e, t) {
  if (!n.behaviour) return n.kind === "launch-plan" ? I(e, t) : null;
  const a = bn(n, e);
  return "refused" in a ? a.refused.sentence : null;
}
function Tn(n, e) {
  const t = JSON.stringify;
  if (t(n.clock) !== t(e.clock)) {
    const i = n.clock && e.clock && t({ ...n.clock, origin: e.clock.origin }) === t(e.clock) ? tn(n, T(n.clock.origin, e.clock.origin)) : null, r = (o) => t([o.launch, o.hiring?.funding?.day, o.hiring?.weeks, o.cards.map((l) => [l.id, l.lag ?? 0])]);
    if (!i || r(i) !== r(e)) return "A plan keeps its first day. Move tasks, or launch, instead.";
  }
  if (n.launch?.name !== e.launch?.name) return "A plan keeps what it calls its line.";
  const a = (i) => {
    const r = i.hiring;
    return t(r && [r.cash, r.burn, r.currency, r.funding?.amount, r.bands.map((o) => [o.id, o.label, o.lane])]);
  };
  if (a(n) !== a(e)) return "A hiring plan keeps its cash, burn, round and role bands. Say what a band costs, or when the round closes, instead.";
  const s = (i) => t(i.cards.map((r) => [r.id, r.laneId, r.lag, r.duration, r.dependsOn, r.band]));
  return t(n.behaviour?.rules) !== t(e.behaviour?.rules) && s(n) !== s(e) ? "Change the rules on their own, then move tasks." : null;
}
function R(n, e, t) {
  let a = { ...n, cards: n.cards.map((s) => {
    if (s.id !== e) return s;
    const i = { ...s, ...t };
    return i.lag || delete i.lag, i;
  }) };
  if (vn(n)) {
    const s = xn(n, a, /* @__PURE__ */ new Set([e]));
    if (typeof s == "string") return s;
    a = s;
  }
  return H(n, a, e) ?? a;
}
const Gn = (n) => "handle-_start-" + n, dn = Gn(""), ye = (n) => n.startsWith(dn) ? n.slice(dn.length) : null;
function me(n, e, t, a) {
  const s = Wn(n, e, t, a), i = n.cards.find((g) => g.id === e), r = { kind: "set_task", card: { id: e }, duration: s.duration, lag: s.lag }, o = R(n, e, { lag: s.lag, duration: s.duration }), l = n.kind === "hiring-plan", d = i.dependsOn?.map((g) => n.cards.find((c) => c.id === g)?.label).filter(Boolean) ?? [], u = s.held === "length" ? l ? "Recruiting takes at least 1 week." : $(n) > 1 ? "A task takes at least a week." : "A task takes at least 1 day." : s.held === "longest" ? l ? "Recruiting takes at most 20 weeks." : "A task takes at most 60 days." : s.held === "ready" ? d.length ? i.label + " starts as early as it can: it waits on " + d.join(" and ") + "." : i.label + " starts on the plan’s first day." : void 0;
  return typeof o == "string" ? { values: s, edit: r, next: null, refusal: o, reason: u } : { values: s, edit: r, next: o, refusal: null, reason: u };
}
const On = {
  day: (n, e, t = 0) => n.clock ? Nn(n.clock.origin, e, t) : null,
  iso: (n, e) => j(n.clock.origin, e),
  name: (n, e) => b(n, e),
  readyDay(n, e) {
    const t = n.cards.find((a) => a.id === e);
    return S(A(n)).cal(k(n).get(e).start - (t.lag ?? 0));
  },
  lagAt(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return S(A(n)).idx(t) - (k(n).get(e).start - (a.lag ?? 0));
  }
}, In = (n) => JSON.stringify(n.cards.map((e) => [cn(n, e.id, "lag"), cn(n, e.id, "duration")]));
function cn(n, e, t, a) {
  const s = $(n), i = n.kind === "hiring-plan", r = t === "duration" ? i ? 140 : 60 : i ? 728 : _(n) ? n.launch.day : 120, o = [];
  for (let l = t === "duration" ? s : 0; l <= r; l += s) {
    if (typeof R(n, e, { [t]: l, ...a && { laneId: a } }) == "string") continue;
    const d = o.at(-1);
    d && d[1] === l - s ? d[1] = l : o.push([l, l]);
  }
  return o;
}
function Qn(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const e = n.launch?.day;
  if (typeof e != "number" || !Number.isInteger(e) || e < 5 || e > 120) return "Launch day is a whole day from 5 to 120.";
  const t = _(n);
  for (const i of n.cards) {
    if (!Number.isInteger(i.duration) || i.duration < 1 || i.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(i.lag ?? 0) || (i.lag ?? 0) < 0 || (i.lag ?? 0) > 120) return "A task waits 0 days or more, and no later than launch.";
    if ((i.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (i.dependsOn?.includes(i.id)) return "A task can't wait on itself.";
  }
  if (!n.clock && n.behaviour?.rules.some((i) => i.kind === "workdays" || i.kind === "blackout")) return "Working days and freezes need dates; this plan counts day numbers.";
  try {
    k(n);
  } catch (i) {
    return i.message;
  }
  const a = k(n), s = wn(n);
  if (t && s > E(n)) {
    const i = n.cards.find((r) => a.get(r.id).end === s);
    return n.clock ? I(n) : `${i.label} ends on day ${s}, after launch on day ${e}.`;
  }
  return null;
}
function Cn(n, e, t) {
  const a = n.cards.find((s) => s.id === e);
  return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
}
function we(n, e, t) {
  return Cn(n, e, t) ? "" : "That move is not available.";
}
function Vn(n, e, t) {
  const a = n.cards.find((i) => i.id === e), s = n.cards.find((i) => i.id === t);
  return !a || !s ? "That task is no longer on the plan." : a === s ? "A task can't wait on itself." : a.dependsOn?.includes(s.id) ? `${a.label} already waits on ${s.label}.` : Hn(n, a.id).has(s.id) ? `${s.label} already waits on ${a.label}, so ${a.label} can't wait on ${s.label}.` : (a.dependsOn?.length ?? 0) >= 3 ? `${a.label} already waits on 3 tasks.` : H(n, G(n, e, t), e);
}
function Zn(n, e) {
  const t = k(n), a = n.cards.filter((i) => i.laneId === e), s = a.filter((i) => t.get(i.id).critical).length;
  return `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${s} on the critical path`;
}
function nn(n, e) {
  const t = n.launch.day;
  if (e.field === "day") {
    const u = k(n), g = wn(n), c = n.cards.find((f) => u.get(f.id).end === g), h = c ? u.get(c.id).to : 0;
    return _(n) ? {
      field: "day",
      min: Math.max(5, h),
      max: 120,
      reasons: { min: c ? n.clock ? `${c.label} ends ${b(n, h - 1)}.` : `${c.label} ends on day ${g}.` : void 0, max: "Launch day is at most day 120." }
    } : { field: "day", min: 5, max: 120, reasons: { min: "Launch day is day 5 at the earliest.", max: "Launch day is at most day 120." } };
  }
  const a = n.cards.find((u) => u.id === e.cardId), s = $(n), i = e.field, r = i === "duration" ? s : 0, o = i === "duration" ? 60 : _(n) ? t : 120;
  let l = a[i] ?? r;
  for (; l + s <= o && typeof R(n, a.id, { [i]: l + s }) != "string"; ) l += s;
  const d = l + s <= o ? R(n, a.id, { [i]: l + s }) : null;
  return {
    field: i,
    min: r,
    max: Math.max(r, l),
    reasons: {
      min: i === "duration" ? "A task takes at least 1 day." : `${a.label} starts as early as it can.`,
      max: typeof d == "string" ? d : i === "duration" ? "A task takes at most 60 days." : `Launch is ${b(n, t)}.`
    }
  };
}
function en(n, e, t = n.launch?.day ?? e) {
  const a = Math.min(120, Math.max(5, Math.round(e))), s = A(n);
  if (!s?.workdays) return a;
  const i = (l, d) => {
    let u = l;
    for (; W(s.origin, u); ) u += d;
    return u;
  }, r = a < t ? -1 : 1, o = i(a, r);
  return o < 5 || o > 120 ? i(a, -r) : o;
}
function Xn(n) {
  const { min: e } = nn(n, { field: "day" });
  return en(n, e, -1 / 0);
}
function Sn(n, e) {
  if (!_(n)) return null;
  const t = I(L(n, { field: "day" }, e));
  return t && t + " The earliest " + M(n) + " that fits is " + b(n, Xn(n)) + ".";
}
function ve(n, e) {
  const t = n.launch.day, a = en(n, e, t), s = e > 120 ? "Launch day is at most day 120." : e < 5 ? "Launch day is day 5 at the earliest." : void 0, i = Sn(n, a);
  if (i) return { day: a, next: null, refusal: i };
  const r = L(n, { field: "day" }, a), o = n.behaviour ? H(n, r) : null;
  return o ? { day: a, next: null, refusal: o } : { day: a, next: r, refusal: null, ...s && { reason: s } };
}
function un(n, e) {
  const t = Math.round(e);
  if ($(n) > 1 || n.kind === "hiring-plan") return Math.round(t / 7) * 7;
  const a = A(n);
  if (!a?.workdays || !t) return t;
  let s = t;
  for (; W(a.origin, s); ) s += t > 0 ? 1 : -1;
  return s;
}
function tn(n, e) {
  const t = j(n.clock.origin, e), a = k(n), s = { ...n, clock: { ...n.clock, origin: t }, cards: n.cards.map((r) => ({ ...r })) };
  n.launch && (s.launch = { ...n.launch, day: n.launch.day - e }), n.hiring && (s.hiring = {
    ...n.hiring,
    weeks: n.hiring.weeks - Math.round(e / 7),
    ...n.hiring.funding && { funding: { ...n.hiring.funding, day: n.hiring.funding.day - e } }
  });
  const i = S(A(s));
  for (const r of [...n.cards].sort((o, l) => a.get(o.id).start - a.get(l.id).start)) {
    const o = s.cards.find((g) => g.id === r.id), l = k(s).get(r.id).start - (o.lag ?? 0), d = a.get(r.id).from - e, u = Math.max(0, (d <= 0 ? 0 : i.idx(d)) - l);
    u ? o.lag = u : delete o.lag;
  }
  return s;
}
function hn(n, e) {
  const t = tn(n, e);
  if (n.launch && t.launch.day > 120) return "A plan runs at most 120 days to " + M(n) + ".";
  if (n.launch && t.launch.day < 5) return "A plan runs at least 5 days to " + M(n) + ".";
  if (n.hiring) {
    if (t.hiring.weeks > 104) return "A hiring plan runs at most 104 weeks.";
    if (t.hiring.weeks < 13) return "A hiring plan runs at least 13 weeks.";
    if (t.hiring.funding && t.hiring.funding.day < 0) return "The round closes " + x(n.clock.origin, n.hiring.funding.day) + ", before that first day.";
  }
  return n.behaviour ? H(n, t) : I(t);
}
function ne(n, e) {
  if (!n.clock) return { by: 0, next: null, refusal: "A plan in day numbers starts on day 0. Give it dates to move its first day." };
  const t = un(n, e);
  if (!t) return { by: t, next: n, refusal: null };
  const a = hn(n, t);
  if (!a) return { by: t, next: tn(n, t), refusal: null };
  const s = t > 0 ? -1 : 1;
  for (let i = t + s; i !== 0; i += s)
    if (!(un(n, i) !== i || hn(n, i)))
      return { by: t, next: null, refusal: a + " The " + (t > 0 ? "latest" : "earliest") + " first day that fits is " + x(n.clock.origin, i) + "." };
  return { by: t, next: null, refusal: a };
}
function ee(n, e) {
  if (!Number.isInteger(e) || e < 13 || e > 104) return "A hiring plan runs 13 to 104 weeks.";
  const t = e * 7, a = k(n), s = n.cards.map((r) => ({ card: r, day: a.get(r.id).to })).filter((r) => r.day > t).sort((r, o) => o.day - r.day)[0];
  if (s) return s.card.label + " starts " + x(n.clock.origin, s.day) + ", after the plan’s last week.";
  const i = n.hiring?.funding;
  return i && i.day > t ? "The round closes " + x(n.clock.origin, i.day) + ", after the plan’s last week." : null;
}
function te(n) {
  return n.label + " · " + K(n.duration ?? 1);
}
function xe() {
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
const ae = (n = "Slatebox") => ({ by: n, at: "2026-11-21T00:00:00.000Z", via: "preset" });
function an(n) {
  return { version: 1, rev: 0, rules: n.map((e, t) => ({ id: "rule-" + (t + 1), on: !0, severity: "refuse", set: ae(), ...e })) };
}
function Ae(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Launch plan",
    launch: { day: 18 },
    clock: { origin: Z(n) },
    lanes: [{ id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }, { id: "marketing", label: "Marketing" }],
    cards: [
      { id: "design", label: "Design", laneId: "product", duration: 4 },
      { id: "build", label: "Build", laneId: "engineering", duration: 6, dependsOn: ["design"] },
      { id: "qa", label: "QA", laneId: "engineering", duration: 2, dependsOn: ["build"] },
      { id: "copy", label: "Copy", laneId: "product", duration: 2 },
      { id: "post", label: "Launch post", laneId: "marketing", duration: 2, dependsOn: ["copy"], lag: 3 }
    ],
    behaviour: an([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function be(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Customer go-live",
    launch: { day: 25, name: "go-live" },
    clock: { origin: Z(n) },
    lanes: [{ id: "us", label: "Us" }, { id: "customer", label: "Customer" }],
    cards: [
      { id: "kickoff", label: "Kickoff", laneId: "us", duration: 1 },
      { id: "data", label: "Send data", laneId: "customer", duration: 3, dependsOn: ["kickoff"] },
      { id: "configure", label: "Configure", laneId: "us", duration: 5, dependsOn: ["data"] },
      { id: "security", label: "Security review", laneId: "customer", duration: 4, dependsOn: ["kickoff"] },
      { id: "train", label: "Train admins", laneId: "us", duration: 2, dependsOn: ["configure"] },
      { id: "signoff", label: "Sign-off", laneId: "customer", duration: 1, dependsOn: ["train", "security"] }
    ],
    behaviour: an([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function Dn(n, e, t, a) {
  switch (e.kind) {
    case "set_task": {
      const s = t.card(e.card), i = { laneId: s.laneId, cardId: s.id };
      e.duration === void 0 && e.lag === void 0 && t.refuse("Say how many days " + m(s.label) + " takes, or waits.", { ...i, code: "invalid_edit" });
      const r = n.kind === "hiring-plan";
      let o = n;
      for (const d of ["duration", "lag"]) {
        const u = e[d];
        if (u === void 0) continue;
        if (Number.isInteger(u) || t.refuse("A task's days are whole days.", i), !n.behaviour && !r) {
          const h = nn(o, { cardId: s.id, field: d }), f = L(o, { cardId: s.id, field: d }, u);
          (u < h.min || u > h.max) && t.refuse(u < h.min ? h.reasons.min : I(f, s.id) ?? h.reasons.max, { ...i, limits: h }), o = f;
          continue;
        }
        const [g, c] = d === "duration" ? r ? [7, 140] : [1, 60] : [0, r ? 728 : 120];
        (u < g || u > c) && t.refuse(d === "duration" ? r ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", i), o = L(o, { cardId: s.id, field: d }, u);
      }
      if (vn(n)) {
        const d = xn(n, o, /* @__PURE__ */ new Set([s.id]));
        typeof d == "string" && t.refuse(d, i), o = d;
      }
      const l = t.settle(o, s.laneId, s.id);
      return t.done(l, a(l.cards.find((d) => d.id === s.id), l), i);
    }
    case "set_plan_start": {
      n.clock || t.refuse("A plan in day numbers starts on day 0. Give it dates to move its first day."), y(e.start) || t.refuse("Say the first day as a date, such as " + j(n.clock.origin, 7) + ".");
      const s = ne(n, T(n.clock.origin, e.start));
      s.refusal && t.refuse(s.refusal);
      const i = t.settle(s.next), r = s.by !== T(n.clock.origin, e.start) ? " (" + x(n.clock.origin, T(n.clock.origin, e.start)) + (n.kind === "hiring-plan" ? " is not a whole week away" : " is a weekend") + ")." : ".";
      return t.done(i, "The plan now starts " + x(i.clock.origin, 0) + r);
    }
    case "set_plan_weeks": {
      n.kind !== "hiring-plan" && t.refuse("Only a hiring plan runs a number of weeks; move " + M(n) + " instead.");
      const s = ee(n, e.weeks);
      s && t.refuse(s);
      const i = t.settle({ ...n, hiring: { ...n.hiring, weeks: e.weeks } });
      return t.done(i, "The plan now runs " + e.weeks + " weeks, to " + x(n.clock.origin, e.weeks * 7 - 1) + ".");
    }
    case "link_tasks":
    case "unlink_tasks": {
      const s = t.card(e.card), i = t.card(e.waitsOn), r = { laneId: s.laneId, cardId: s.id };
      if (e.kind === "unlink_tasks")
        return s.dependsOn?.includes(i.id) || t.refuse(m(s.label) + " doesn’t wait on " + m(i.label) + ".", r), t.done(t.settle(G(n, s.id, i.id, !0), s.laneId, s.id), m(s.label) + " no longer waits on " + m(i.label) + ".", r);
      const o = Vn(n, s.id, i.id);
      return o && t.refuse(o, r), t.done(t.settle(G(n, s.id, i.id), s.laneId, s.id), m(s.label) + " now waits on " + m(i.label) + ".", r);
    }
  }
  return null;
}
const se = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  rulebook: qn,
  drags: In,
  fixed: Tn,
  words: On,
  readCard(n, e, t) {
    if (e.duration = v(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (e.lag = v(n.lag, 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e) {
    const t = yn(n, "launch", "A launch plan needs a launch day.");
    if (e.launch = { day: v(t.day, 5, 120, "Launch day is a whole day from 5 to 120.") }, t.name !== void 0) {
      if (typeof t.name != "string" || !/^[a-z][a-z -]{1,23}$/i.test(t.name)) throw new Error("Name the line in a word or two, such as go-live.");
      e.launch.name = t.name.toLowerCase();
    }
    En(n, e);
  },
  validate: Qn,
  planMove: Cn,
  caption: Zn,
  cardText: (n, e) => e.label + " · " + e.duration + "d",
  noteText: (n, e) => te(e),
  fromNote(n, e) {
    const t = Rn(e);
    return typeof t == "string" ? t : { label: t.label, duration: Math.min(60, Math.max(1, t.days ?? 2)) };
  },
  renamed(n, e, t) {
    const a = jn(t);
    return { label: a.label, edits: a.days !== void 0 ? [{ kind: "set_task", card: { id: e }, duration: a.days }] : [] };
  },
  edit(n, e, t) {
    switch (e.kind) {
      case "add_card": {
        const a = t.lane(e.lane), s = e.label?.trim();
        s || t.refuse("Say what the card should say, such as “Add Docs to " + a.label + "”.", { laneId: a.id });
        const i = { id: kn(n), label: s, laneId: a.id, duration: e.duration ?? 2 };
        e.lag && (i.lag = e.lag);
        const r = [...new Set((e.waitsOn ?? []).map((d) => t.card(d).id))];
        r.length && (i.dependsOn = r);
        const o = { ...n, cards: [...n.cards, i] }, l = n.behaviour ? null : I(o, i.id);
        return l && t.refuse(l, { laneId: a.id }), t.done(t.settle(o, a.id), "Added " + m(s) + " to " + m(a.label) + ".", { laneId: a.id, cardId: i.id });
      }
      case "set_launch_day": {
        const a = nn(n, { field: "day" }), s = Number.isInteger(e.day) && e.day >= 5 && e.day <= 120 ? en(n, e.day) : e.day;
        (!Number.isInteger(s) || s < a.min || s > a.max) && t.refuse(s < a.min && Sn(n, s) || (s < a.min ? a.reasons.min : a.reasons.max), { limits: a });
        const i = L(n, { field: "day" }, s), r = s !== e.day ? ": " + b(n, e.day) + " is a weekend, and weekends don’t count on this plan." : ".";
        return t.done(t.settle(i), ie(M(n)) + " is now " + b(n, s) + r);
      }
    }
    return Dn(n, e, t, (a) => m(a.label) + " now takes " + K(a.duration) + (a.lag ? " and waits " + K(a.lag) + "." : "."));
  }
}, ie = (n) => n.charAt(0).toUpperCase() + n.slice(1);
function En(n, e) {
  if (n.clock === void 0) return;
  const t = n.clock?.origin;
  if (!y(t)) throw new Error("A plan starts on a real date, written as 2026-12-07.");
  e.clock = { origin: t };
}
gn(se);
const re = Mn({ deadline: "at floor", snap: "unit", cascade: "onConflict", locked: "cards" }), fn = (n, e, t) => ({ type: "integer", min: e, max: t, about: n });
mn({
  kinds: [
    {
      kind: "set_band_cost",
      summary: "Hiring plan: what a role band costs a month, loaded. Cost is per band, never per person.",
      intent: !1,
      fields: { band: { type: "text", max: 40, about: "The band, by id or name." }, monthly: fn("Whole currency units a month.", 1, 1e7) },
      boards: ["hiring-plan"],
      refusals: {}
    },
    {
      kind: "set_funding",
      summary: "Hiring plan: the day the funding round closes, in days from the plan’s first day.",
      intent: !1,
      fields: { day: fn("Days from the first day.", 0, 728) },
      boards: ["hiring-plan"],
      refusals: {}
    }
  ],
  boards: { set_task: ["hiring-plan"], link_tasks: ["hiring-plan"], unlink_tasks: ["hiring-plan"] },
  fields: { add_card: { band: { type: "text", max: 40, optional: !0, about: "Hiring plan: the role band (by id or name). Left out, the team’s first band." } } }
});
const _n = (n, e) => k(n).get(e).to;
function oe(n, e, t) {
  const a = n.cards.find((o) => o.id === e), i = k(n).get(e).start - (a.lag ?? 0), r = Math.max(0, t - (a.duration ?? 7) - i);
  return Math.ceil(r / 7) * 7;
}
function U(n, e) {
  const t = e.trim().toLowerCase();
  return n.bands.find((a) => a.id === e) ?? n.bands.find((a) => a.label.toLowerCase() === t) ?? n.bands.find((a) => new RegExp("\\b" + a.label.toLowerCase().replace(/[^a-z0-9 ]/g, "") + "\\b").test(t));
}
const le = ["salary", "pay", "wage", "cost", "amount", "monthly", "comp", "compensation"];
function de(n) {
  if (n.lanes.length > 4) return "A hiring plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 16) return "A hiring plan has 1 to 16 hires.";
  if (!n.clock) return "A hiring plan starts on a date.";
  for (const e of n.cards) {
    if (!n.hiring.bands.some((t) => t.id === e.band)) return m(e.label) + " needs a role band on this plan.";
    if ((e.dependsOn?.length ?? 0) > 3) return "A hire waits on up to 3 others.";
  }
  if (n.hiring.bands.some((e) => !n.lanes.some((t) => t.id === e.lane))) return "Each role band belongs to a team on the plan.";
  try {
    k(n);
  } catch (e) {
    return e.message;
  }
  return null;
}
const z = (n) => "Runway with these hires: " + An(Q(n));
function Me(n) {
  return {
    version: 1,
    kind: "hiring-plan",
    title: "Hiring plan",
    clock: { origin: Z(n) },
    hiring: { cash: 12e5, burn: 95e3, currency: "$", weeks: 52, funding: { day: 210, amount: 1e6 }, bands: [
      { id: "senior-eng", label: "Senior eng", monthly: 15e3, lane: "engineering" },
      { id: "designer", label: "Designer", monthly: 12e3, lane: "product" },
      { id: "ae", label: "AE", monthly: 11e3, lane: "sales" }
    ] },
    lanes: [{ id: "engineering", label: "Engineering" }, { id: "product", label: "Product" }, { id: "sales", label: "Sales" }],
    cards: [
      { id: "eng-1", label: "Senior eng", laneId: "engineering", band: "senior-eng", duration: 56 },
      { id: "eng-2", label: "Senior eng #2", laneId: "engineering", band: "senior-eng", duration: 56, lag: 14, dependsOn: ["eng-1"] },
      { id: "designer", label: "Designer", laneId: "product", band: "designer", duration: 42, lag: 56 },
      { id: "ae-1", label: "AE", laneId: "sales", band: "ae", duration: 42, lag: 14 },
      { id: "ae-2", label: "AE #2", laneId: "sales", band: "ae", duration: 42, lag: 126 }
    ],
    behaviour: an([{ kind: "snap", unit: "week" }, { kind: "cascade", onConflict: "push" }])
  };
}
const ce = (n, e) => m(e.label) + " now starts " + x(n.clock.origin, _n(n, e.id)) + ", after " + Math.round(e.duration / 7) + " weeks of recruiting. " + z(n) + ".", ue = {
  kind: "hiring-plan",
  cards: [16, "A hiring plan holds up to 16 hires."],
  rulebook: re,
  drags: In,
  fixed: Tn,
  words: { ...On, startLag: oe, band: (n, e) => U(n.hiring, e) },
  readCard(n, e, t) {
    if (le.some((a) => n[a] !== void 0)) throw new Error("Cost is per role band, never per person. Say what the band costs instead.");
    if (e.duration = v(n.duration, 7, 140, "Recruiting takes 1 to 20 weeks."), n.lag !== void 0 && n.lag !== 0 && (e.lag = v(n.lag, 0, 728, "That is further out than the plan runs.")), typeof n.band != "string") throw new Error("Each hire is in a role band.");
    if (e.band = t.id(n.band), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A hire waits on a list of hires.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e, t) {
    const a = yn(n, "hiring", "A hiring plan needs its cash, burn and role bands.");
    if (!Array.isArray(a.bands) || a.bands.length < 1 || a.bands.length > 8) throw new Error("A hiring plan has 1 to 8 role bands.");
    const s = a.bands.map((r) => {
      const o = r;
      if (typeof o.label != "string" || !o.label.trim() || o.label.length > 40 || /[<>\u0000-\u001f]/.test(o.label)) throw new Error("Name each role band in plain words.");
      return { id: t.id(o.id), label: o.label.trim(), monthly: v(o.monthly, 1, 1e7, "A band costs 1 to 10,000,000 a month."), lane: t.id(o.lane) };
    });
    if (new Set(s.map((r) => r.id)).size !== s.length) throw new Error("Duplicate role band.");
    const i = typeof a.currency == "string" && /^[$€£¥]$/.test(a.currency) ? a.currency : "$";
    if (e.hiring = {
      cash: v(a.cash, 0, 1e10, "Cash is 0 to 10 billion."),
      burn: v(a.burn, 0, 1e9, "Burn is 0 to a billion a month."),
      currency: i,
      weeks: v(a.weeks ?? 52, 13, 104, "A hiring plan runs 13 to 104 weeks."),
      bands: s
    }, a.funding !== void 0) {
      const r = a.funding;
      e.hiring.funding = { day: v(r?.day, 0, 728, "A round closes within two years."), amount: v(r?.amount, 1, 1e10, "A round raises 1 to 10 billion.") };
    }
    En(n, e);
  },
  validate: de,
  planMove(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
  },
  caption(n, e) {
    const t = n.cards.filter((a) => a.laneId === e);
    return t.length + (t.length === 1 ? " hire" : " hires");
  },
  cardText: (n, e) => e.label + " · " + x(n.clock.origin, _n(n, e.id)).replace(/^\w+ /, ""),
  noteText: (n, e) => e.label,
  fromNote(n, e) {
    const t = e.replace(/\s+/g, " ").trim();
    return t ? { label: t.slice(0, 80), duration: 42 } : "Say who to hire, such as “Designer”.";
  },
  renamed: (n, e, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit(n, e, t) {
    const a = n.hiring;
    switch (e.kind) {
      case "add_card": {
        const s = t.lane(e.lane), i = e.label?.trim();
        i || t.refuse("Say who to hire, such as “Add a Designer to " + s.label + "”.", { laneId: s.id });
        const r = e.band ? U(a, e.band) : a.bands.find((u) => u.lane === s.id) ?? U(a, i);
        r || t.refuse("Say which role band, such as " + a.bands.map((u) => m(u.label)).join(" or ") + ".", { laneId: s.id });
        const o = { id: kn(n), label: i, laneId: s.id, band: r.id, duration: e.duration ?? 42 };
        e.lag && (o.lag = e.lag);
        const l = [...new Set((e.waitsOn ?? []).map((u) => t.card(u).id))];
        l.length && (o.dependsOn = l);
        const d = t.settle({ ...n, cards: [...n.cards, o] }, s.id);
        return t.done(d, "Added " + m(i) + " to " + m(s.label) + ". " + z(d) + ".", { laneId: s.id, cardId: o.id });
      }
      case "set_band_cost": {
        const s = U(a, e.band);
        s || t.refuse("There is no role band " + m(e.band) + ". The bands are " + a.bands.map((r) => m(r.label)).join(", ") + ".", { code: "unknown_reference" });
        const i = t.settle({ ...n, hiring: { ...a, bands: a.bands.map((r) => r === s ? { ...r, monthly: e.monthly } : r) } });
        return t.done(i, m(s.label) + " now costs " + Fn(e.monthly, a.currency) + " a month. " + z(i) + ".");
      }
      case "set_funding": {
        a.funding || t.refuse("This plan has no funding round.");
        const s = t.settle({ ...n, hiring: { ...a, funding: { ...a.funding, day: e.day } } });
        return t.done(s, "The round now closes " + x(n.clock.origin, e.day) + ". " + z(s) + ".");
      }
    }
    return Dn(n, e, t, (s, i) => ce(i, s));
  }
};
gn(ue);
export {
  k as $,
  Gn as A,
  ye as B,
  me as C,
  On as D,
  In as E,
  cn as F,
  Qn as G,
  Cn as H,
  we as I,
  Vn as J,
  Zn as K,
  nn as L,
  en as M,
  Xn as N,
  Sn as O,
  ve as P,
  un as Q,
  tn as R,
  ne as S,
  ee as T,
  te as U,
  xe as V,
  an as W,
  Dn as X,
  se as Y,
  En as Z,
  mn as _,
  fe as a,
  wn as a0,
  E as a1,
  M as a2,
  b as a3,
  _ as a4,
  vn as a5,
  $ as a6,
  Wn as a7,
  Hn as a8,
  I as a9,
  L as aa,
  G as ab,
  xn as ac,
  D as ad,
  pe as ae,
  bn as af,
  Mn as ag,
  ke as ah,
  _n as ai,
  oe as aj,
  U as ak,
  de as al,
  z as am,
  ue as an,
  Q as ao,
  An as ap,
  P as aq,
  pn as ar,
  K as as,
  Rn as b,
  ge as c,
  v as d,
  V as e,
  j as f,
  be as g,
  Me as h,
  y as i,
  T as j,
  W as k,
  Ae as l,
  Fn as m,
  kn as n,
  yn as o,
  x as p,
  Z as q,
  jn as r,
  F as s,
  Nn as t,
  S as u,
  A as v,
  $n as w,
  H as x,
  Tn as y,
  R as z
};
