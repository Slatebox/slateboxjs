import { workshopEditKinds as K, workshopRuleSchema as q, workshopHasMarks as zn, workshopFreshOverride as mn, workshopOverrideUndone as ln, registerWorkshopRules as wn, said as k, workshopOverrideMark as Rn } from "./workshop-model.mjs";
const S = 864e5, Wn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], Z = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function m(n) {
  if (typeof n != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(n)) return NaN;
  const e = Date.UTC(+n.slice(0, 4), +n.slice(5, 7) - 1, +n.slice(8, 10));
  return new Date(e).toISOString().slice(0, 10) === n ? e : NaN;
}
const B = (n, e) => new Date(m(n) + Math.round(e) * S).toISOString().slice(0, 10), I = (n, e) => Math.round((m(e) - m(n)) / S), jn = (n, e) => new Date(m(n) + Math.floor(e) * S).getUTCDay(), Y = (n, e) => {
  const t = jn(n, e);
  return t === 0 || t === 6;
};
function O(n, e) {
  const t = new Date(m(n) + Math.floor(e) * S);
  return Wn[t.getUTCDay()] + " " + t.getUTCDate() + " " + Z[t.getUTCMonth()];
}
function j(n) {
  const e = new Date(m(n));
  return e.getUTCDate() + " " + Z[e.getUTCMonth()];
}
function X(n) {
  const e = m(n) || Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), (/* @__PURE__ */ new Date()).getUTCMonth(), (/* @__PURE__ */ new Date()).getUTCDate()), t = new Date(e).toISOString().slice(0, 10);
  return B(t, (8 - new Date(e).getUTCDay()) % 7);
}
function Hn(n, e, t = 0) {
  const a = e.trim().replace(/[,.]/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (m(a)) return I(n, a);
  const s = (d) => Z.findIndex((c) => d.startsWith(c.toLowerCase())), i = new Date(m(n) + t * S);
  let r, o, l;
  if ((r = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})$/.exec(a)) && s(r[2]) >= 0)
    o = +r[1], l = s(r[2]);
  else if ((r = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) && s(r[1]) >= 0)
    o = +r[2], l = s(r[1]);
  else if ((r = /^(?:early\s+)?([a-z]{3,9})$/.exec(a)) && s(r[1]) >= 0)
    o = 1, l = s(r[1]);
  else if (r = /^(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) {
    for (let d = 0; d < 13; d++) {
      const c = Date.UTC(i.getUTCFullYear(), i.getUTCMonth() + d, +r[1]);
      if (new Date(c).getUTCDate() === +r[1] && c >= i.getTime()) return Math.round((c - m(n)) / S);
    }
    return null;
  } else return null;
  for (const d of [i.getUTCFullYear(), i.getUTCFullYear() + 1]) {
    const c = Date.UTC(d, l, o);
    if (new Date(c).getUTCDate() !== o) return null;
    if (c >= i.getTime() || d > i.getUTCFullYear()) return Math.round((c - m(n)) / S);
  }
  return null;
}
const Bn = { cal: (n) => n, idx: (n) => n }, dn = /* @__PURE__ */ new Map();
function C(n) {
  if (!n?.workdays) return Bn;
  const e = dn.get(n.origin);
  if (e) return e;
  const t = [];
  for (let s = 0; t.length < 800; s++) Y(n.origin, s) || t.push(s);
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
  return dn.set(n.origin, a), a;
}
function A(n) {
  if (n.clock)
    return { origin: n.clock.origin, workdays: !!n.behaviour?.rules.some((e) => e.on && e.kind === "workdays") };
}
const Yn = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, Jn = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function vn(n) {
  let e = String(n ?? "").replace(/\s+/g, " ").trim();
  const t = { label: e }, a = Yn.exec(e);
  if (a) {
    const r = Number(a[1].replace(",", ".")), o = /^w/i.test(a[2]);
    t.days = Math.max(1, Math.ceil(o ? r * 5 : r)), e = e.slice(0, a.index) + " " + e.slice(a.index + a[0].length);
  }
  const s = [...e.matchAll(Jn)].filter((r) => r[1] || r[3] || Number(r[2].replace(",", "")) >= 1e3), i = s.find((r) => r[1] || r[3]) ?? s[0];
  if (i) {
    const r = /k/i.test(i[3] ?? "") ? 1e3 : /m/i.test(i[3] ?? "") ? 1e6 : 1;
    t.amount = Math.round(Number(i[2].replace(",", i[3] ? "." : "")) * r), i[1] && (t.currency = i[1]), e = e.slice(0, i.index) + " " + e.slice(i.index + i[0].length);
  }
  return t.label = e.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), t;
}
function Kn(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = (r, o) => (Math.round(r * 10) / 10).toString() + o, i = a >= 1e6 ? s(a / 1e6, "M") : a >= 1e3 ? s(a / 1e3, "k") : String(Math.round(a));
  return t + e + i;
}
function Me(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = a >= 1e6 ? +(a / 1e6).toFixed(6) + "M" : a >= 1e3 ? +(a / 1e3).toFixed(3) + "k" : String(Math.round(a));
  return t + e + s;
}
const H = (n) => n + (n === 1 ? " day" : " days"), Oe = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function qn(n, e) {
  const t = vn(n);
  return t.label ? t : { ...t, label: e };
}
function Gn(n) {
  const e = vn(n);
  return e.label ? e : { label: n };
}
function xn(n) {
  const e = new Set([...n.lanes, ...n.cards].map((a) => a.id));
  let t = 1;
  for (; e.has("card-" + t); ) t++;
  return "card-" + t;
}
function M(n, e, t, a, s = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < e || n > t || !s && !Number.isInteger(n)) throw new Error(a);
  return n;
}
function Te(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function An(n, e, t) {
  const a = n[e];
  if (!a || typeof a != "object" || Array.isArray(a)) throw new Error(t);
  return a;
}
function Mn(n) {
  const e = (t) => K.find((a) => a.kind === t);
  for (const t of n.kinds ?? []) K.some((a) => a.kind === t.kind) || K.push(t);
  for (const [t, a] of Object.entries(n.boards ?? {})) {
    const s = e(t);
    for (const i of a) s.boards.includes(i) || (s.boards.push(i), delete s.refusals[i]);
  }
  for (const [t, a] of Object.entries(n.fields ?? {})) Object.assign(e(t).fields, a);
  n.rules && (q.kinds.push(...n.rules.kinds.filter((t) => !q.kinds.includes(t))), Object.assign(q.keys, n.rules.keys));
}
function y(n) {
  const e = new Map(n.cards.map((d) => [d.id, d])), t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d) => {
    const c = t.get(d.id);
    if (c) return c;
    if (a.has(d.id)) throw new Error("Tasks can't wait on each other in a circle.");
    a.add(d.id);
    let f = 0;
    for (const u of d.dependsOn ?? []) {
      const h = e.get(u);
      if (!h) throw new Error("A task waits on a task that is not on the plan.");
      f = Math.max(f, s(h).end);
    }
    f += d.lag ?? 0;
    const g = { start: f, end: f + (d.duration ?? 1), slack: 0, critical: !1, from: 0, to: 0 };
    return t.set(d.id, g), a.delete(d.id), g;
  };
  n.cards.forEach(s);
  const i = Math.max(0, ...[...t.values()].map((d) => d.end)), r = /* @__PURE__ */ new Map(), o = (d) => {
    const c = r.get(d.id);
    if (c !== void 0) return c;
    let f = i;
    for (const g of n.cards)
      g.dependsOn?.includes(d.id) && (f = Math.min(f, o(g) - (g.duration ?? 1) - (g.lag ?? 0)));
    return r.set(d.id, f), f;
  }, l = C(A(n));
  for (const d of n.cards) {
    const c = t.get(d.id);
    c.slack = o(d) - c.end, c.critical = c.slack === 0, c.from = l.cal(c.start), c.to = l.cal(c.end - 1) + 1;
  }
  return t;
}
function be(n) {
  const e = y(n), t = [];
  for (const a of n.cards) for (const s of a.dependsOn ?? [])
    e.get(a.id).start < (e.get(s)?.end ?? 0) && t.push({ from: s, to: a.id });
  return t;
}
function On(n) {
  return Math.max(0, ...[...y(n).values()].map((e) => e.end));
}
const E = (n) => C(A(n)).idx(n.launch?.day ?? 0), T = (n) => n.launch?.name ?? "launch", v = (n, e) => n.clock ? O(n.clock.origin, e) : "day " + e;
function $(n) {
  return !n.behaviour || n.behaviour.rules.some((e) => e.on && e.kind === "deadline" && e.at === "launch" && e.severity === "refuse");
}
const nn = (n) => !!n.behaviour?.rules.some((e) => e.on && e.kind === "cascade" && e.onConflict === "stop");
function _(n) {
  const e = n.behaviour?.rules.find((t) => t.on && t.kind === "snap");
  return e && e.kind === "snap" && e.unit === "week" ? A(n)?.workdays ? 5 : 7 : 1;
}
function Qn(n, e, t, a) {
  const s = n.cards.find((h) => h.id === e);
  if (!s) throw new Error("That task is no longer on the plan.");
  const i = y(n).get(e), r = C(A(n)), o = _(n), l = s.lag ?? 0, d = s.duration ?? 1, c = (h) => Math.round(h / o) * o;
  if (t === "end") {
    const h = c(r.idx(Math.round(i.to + a)) - i.start), p = n.kind === "hiring-plan" ? 140 : 60;
    return h > p ? { lag: l, duration: Math.floor(p / o) * o, held: "longest" } : h < o ? { lag: l, duration: o, held: "length" } : { lag: l, duration: h };
  }
  const f = Math.round(i.from + a);
  let g = c((f < 0 ? f : r.idx(f)) - i.start), u;
  return l + g < 0 && (g = -Math.floor(l / o) * o, u = "ready"), d - g < o && (g = Math.floor((d - o) / o) * o, u = "length"), { lag: l + g, duration: d - g, ...u && { held: u } };
}
function Vn(n, e) {
  const t = /* @__PURE__ */ new Set(), a = (s) => {
    for (const i of n.cards) i.dependsOn?.includes(s) && !t.has(i.id) && (t.add(i.id), a(i.id));
  };
  return a(e), t;
}
function b(n, e) {
  const t = n.launch?.day ?? 0, a = E(n), s = y(n), i = e ? s.get(e) : void 0, r = i && i.end > a ? { label: "That", t: i } : n.cards.map((o) => ({ label: o.label, t: s.get(o.id) })).filter((o) => o.t.end > a).sort((o, l) => l.t.end - o.t.end)[0];
  return r ? n.clock ? r.label + " would run until " + v(n, r.t.to - 1) + "; " + T(n) + " is " + v(n, t) + "." : (r.label === "That" ? "That ends on day " : "That pushes " + r.label + " to day ") + r.t.end + ", after launch on day " + t + "." : null;
}
function L(n, e, t) {
  return e.field === "day" ? { ...n, launch: { ...n.launch, day: t } } : { ...n, cards: n.cards.map((a) => a.id === e.cardId ? { ...a, [e.field]: t } : a) };
}
function Q(n, e, t, a = !1) {
  const s = y(n);
  return { ...n, cards: n.cards.map((i) => {
    if (i.id !== e) return i;
    const r = a ? (i.dependsOn ?? []).filter((d) => d !== t) : [...i.dependsOn ?? [], t], o = Math.max(0, ...r.map((d) => s.get(d)?.end ?? 0)), l = { ...i, dependsOn: r, lag: Math.max(0, s.get(i.id).start - o) };
    return r.length || delete l.dependsOn, l.lag || delete l.lag, l;
  }) };
}
function en(n, e, t) {
  const a = y(n), s = new Map(e.cards.map((l) => [l.id, { ...l }])), i = /* @__PURE__ */ new Map();
  let r = null;
  const o = (l) => {
    const d = i.get(l.id);
    if (d !== void 0) return d;
    let c = 0, f;
    for (const h of l.dependsOn ?? []) {
      const p = o(s.get(h));
      p > c && (c = p, f = s.get(h));
    }
    const g = a.get(l.id);
    if (g && !t.has(l.id)) {
      const h = g.start - c;
      h < -1e-9 && !r && (r = f.label + " would end after " + l.label + " starts on " + v(n, g.from) + ". " + l.label + " waits on it, and a slip stops at the tasks that wait on it."), h > 1e-9 ? l.lag = h : delete l.lag;
    }
    const u = c + (l.lag ?? 0) + (l.duration ?? 1);
    return i.set(l.id, u), u;
  };
  for (const l of s.values()) o(l);
  return r ?? { ...e, cards: e.cards.map((l) => s.get(l.id)) };
}
const R = 120;
function V(n) {
  const e = n.hiring;
  if (!e) return R;
  const t = y(n), a = n.cards.map((i) => ({ day: t.get(i.id).to, monthly: e.bands.find((r) => r.id === i.band)?.monthly ?? 0 }));
  let s = e.cash;
  for (let i = 0; i < R * 52 / 12; i++) {
    const r = i * 7;
    e.funding && e.funding.day >= r && e.funding.day < r + 7 && (s += e.funding.amount);
    const o = (e.burn + a.reduce((l, d) => l + (d.day <= r ? d.monthly : 0), 0)) * 12 / 52;
    if (s < o) return Math.floor((i + Math.max(0, s) / o) * 12 / 52 * 10) / 10;
    s -= o;
  }
  return R;
}
const Tn = (n) => n >= R ? "10 years or more" : n + (n === 1 ? " month" : " months"), G = (n) => n.charAt(0).toUpperCase() + n.slice(1), Zn = (n) => n.length > 1 ? n.slice(0, -1).join(", ") + " and " + n.at(-1) : n[0] ?? "", tn = (n, e) => n.lanes.find((t) => t.id === e)?.label ?? e ?? "", cn = (n) => n.kind === "hiring-plan" ? "Hires" : "Tasks";
function N(n, e) {
  const t = n.severity === "warn";
  switch (n.kind) {
    case "deadline":
      return n.at === "runway" ? t ? "Runway under " + n.floor + " months is flagged." : "Runway stays above " + n.floor + " months." : t ? G(T(e)) + " is a soft line: a task may slip past it, shown in red." : G(T(e)) + " is a hard line: every task ends by " + v(e, e.launch?.day ?? 0) + ".";
    case "overlap": {
      const a = n.lane ? tn(e, n.lane) : "a team";
      return t ? "Overlapping tasks in " + a + " are flagged." : n.lane ? a + "’s tasks can’t overlap." : "Tasks in a team can’t overlap.";
    }
    case "snap":
      return cn(e) + " snap to whole " + n.unit + "s.";
    case "workdays":
      return "Days are working days: weekends don’t count.";
    case "blackout": {
      const a = j(n.start) + " – " + j(n.end);
      return t ? G(n.label) + ", " + a + ", is flagged." : "Nothing ships in " + n.label + ", " + a + ".";
    }
    case "cascade":
      return "A slip " + (n.onConflict === "stop" ? "stops at" : "pushes") + " the " + cn(e).toLowerCase() + " that wait on it.";
    case "locked": {
      const a = n.cards.map((s) => e.cards.find((i) => i.id === s)?.label ?? s);
      return Zn(a) + (a.length > 1 ? " are" : " is") + " locked.";
    }
  }
  return "";
}
const Ie = ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"], un = ["locked", "cascade", "blackout", "overlap", "snap", "deadline"], Xn = (n, e) => (n.dependsOn ?? []).join() === (e.dependsOn ?? []).join();
function bn(n, e) {
  const t = (n.behaviour?.rules ?? []).filter((u) => u.on).sort((u, h) => un.indexOf(u.kind) - un.indexOf(h.kind)), a = [];
  if (!t.length) return { ok: !0, warnings: a };
  const s = zn(n, e);
  if (s && e.cards.some((u) => mn(n, u))) return { ok: !0, warnings: a };
  const i = n.clock && e.clock ? I(n.clock.origin, e.clock.origin) : 0, r = y(n), o = i ? new Map([...y(e)].map(([u, h]) => [u, { ...h, from: h.from + i, to: h.to + i }])) : y(e), l = new Map(n.cards.map((u) => [u.id, u])), d = e.cards.filter((u) => {
    const h = l.get(u.id);
    return s && h && ln(n, u) ? !1 : !h || (h.lag ?? 0) !== (u.lag ?? 0) || h.duration !== u.duration || h.laneId !== u.laneId || !Xn(h, u);
  }), c = e.cards.filter((u) => {
    const h = o.get(u.id), p = r.get(u.id);
    return s && p && ln(n, u) ? !1 : !p || h.from !== p.from || h.to !== p.to || l.get(u.id).laneId !== u.laneId;
  }), f = d[0] ?? c[0], g = (u) => {
    switch (u.kind) {
      case "locked":
        for (const h of c) if (u.cards.includes(h.id) && r.has(h.id)) return h.label + " is locked: it stays on " + v(n, r.get(h.id).from) + ".";
        return null;
      case "cascade": {
        if (u.onConflict !== "stop") return null;
        const h = c.find((p) => r.has(p.id) && !d.includes(p));
        return h ? "That would push " + h.label + ", which waits on it. " + N(u, n) : null;
      }
      case "blackout": {
        const h = A(n);
        if (!h) return null;
        const p = I(h.origin, u.start), w = I(h.origin, u.end), x = c.find((F) => {
          const D = o.get(F.id);
          for (let J = Math.max(Math.floor(D.from), p); J < Math.min(Math.ceil(D.to), w + 1); J++) if (!h.workdays || !Y(h.origin, J)) return !0;
          return !1;
        });
        return x ? x.label + " would run into " + u.label + " (" + j(u.start) + " – " + j(u.end) + ")." : null;
      }
      case "overlap": {
        const h = (p, w) => p.from < w.to && w.from < p.to;
        for (const p of c) for (const w of e.cards)
          if (!(p === w || p.laneId !== w.laneId || u.lane && p.laneId !== u.lane || !h(o.get(p.id), o.get(w.id))))
            return p.label + " and " + w.label + " would overlap in " + tn(e, p.laneId) + ". " + N(u, n);
        return null;
      }
      case "snap": {
        if (u.unit !== "week") return null;
        const h = A(n)?.workdays ? 5 : 7;
        return d.find((w) => {
          const x = l.get(w.id);
          return (w.lag ?? 0) % h && (!x || (x.lag ?? 0) !== (w.lag ?? 0)) || (w.duration ?? 0) % h && (!x || x.duration !== w.duration);
        }) ? N(u, n) : null;
      }
      case "deadline": {
        if (u.at === "runway") {
          const x = V(e);
          return x < u.floor && x < V(n) ? "That takes runway to " + Tn(x) + ". " + N(u, n) : null;
        }
        const h = E(e), p = E(n);
        return e.cards.some((x) => {
          const F = o.get(x.id), D = r.get(x.id);
          return F.end > h && (!D || D.end <= p || F.end > D.end || h < p);
        }) ? b(e, f?.id) : null;
      }
    }
    return null;
  };
  for (const u of t) {
    const h = g(u);
    if (h) {
      if (u.severity === "warn") {
        a.push(h);
        continue;
      }
      return { refused: { sentence: h, ruleId: u.id, set: u.set, cardId: f?.id ?? "", laneId: f?.laneId ?? "" } };
    }
  }
  return { ok: !0, warnings: a };
}
const ne = (n) => {
  if (typeof n != "string" || !n.trim() || n.trim().length > 40 || /[<>\u0000-\u001f]/.test(n)) throw new Error("Name the freeze in plain words, up to 40 letters.");
  return n.trim();
};
function In(n) {
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
          if (!m(e.start) || !m(e.end) || m(e.end) < m(e.start)) throw new Error("A freeze runs from one date to the same or a later one.");
          if (m(e.end) - m(e.start) > 92 * 864e5) throw new Error("A freeze lasts up to 3 months.");
          Object.assign(r, { start: e.start, end: e.end, label: ne(e.label) });
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
    sentence: N,
    contradiction(e, t) {
      const a = /* @__PURE__ */ new Set();
      let s = 0;
      for (const i of e.rules) {
        const r = i.kind === "overlap" ? "overlap:" + (i.lane ?? "") : i.kind === "blackout" ? "blackout:" + s++ : i.kind === "locked" ? "" : i.kind;
        if (r && a.has(r)) return "There is already a " + (i.kind === "deadline" ? T(t) + " line" : i.kind + " rule") + ". Change that one instead.";
        if (a.add(r), i.kind === "locked") for (const o of i.cards) {
          if (a.has("locked:" + o)) return tn({ ...t, lanes: t.cards.map((l) => ({ id: l.id, label: l.label })) }, o) + " is already locked.";
          a.add("locked:" + o);
        }
      }
      return s > 6 ? "A plan has up to 6 freezes." : null;
    },
    check: bn,
    builtIn: (e) => e.kind === "launch-plan" && !e.behaviour ? ["Every task ends by " + T(e) + ".", "A slip pushes the tasks that wait on it."] : []
  };
}
function Ce(n) {
  if (n.kind !== "launch-plan") return /* @__PURE__ */ new Set();
  const e = E(n);
  return new Set([...y(n)].filter(([, t]) => t.end > e).map(([t]) => t));
}
const ee = In({ deadline: "at", overlap: "lane", snap: "unit", workdays: "", blackout: "start end label", cascade: "onConflict", locked: "cards" }), te = { anyOf: [{ type: "string", minLength: 1, maxLength: 200 }, { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }] }, hn = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
Mn({
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
      start: hn,
      end: hn,
      label: { type: "string", minLength: 1, maxLength: 40 },
      onConflict: { enum: ["push", "stop"] },
      cards: { type: "array", items: te, minItems: 1, maxItems: 6 }
    }
  }
});
function P(n, e, t) {
  if (!n.behaviour) return n.kind === "launch-plan" ? ae(n, e, t) : null;
  const a = bn(n, e);
  return "refused" in a ? a.refused.sentence : null;
}
function ae(n, e, t) {
  if (e.cards.some((l) => mn(n, l))) return null;
  if (!b(n)) return b(e, t);
  const a = E(e), s = E(n), i = y(n), r = y(e);
  return e.cards.some((l) => {
    const d = r.get(l.id), c = i.get(l.id);
    return d.end > a && (!c || c.end <= s || d.end > c.end || a < s);
  }) ? b(e, t) : null;
}
function Cn(n, e, t) {
  if (t >= 0) return null;
  const a = n.cards.find((r) => r.id === e);
  if (!a) return "That task is no longer on the plan.";
  const s = (a.dependsOn ?? []).map((r) => n.cards.find((o) => o.id === r)?.label).filter(Boolean), i = C(A(n)).cal(y(n).get(e).start - (a.lag ?? 0));
  return s.length ? a.label + " waits on " + s.join(" and ") + ": it starts " + v(n, i) + " at the earliest." : a.label + " starts on the plan’s first day at the earliest.";
}
function Sn(n, e) {
  const t = JSON.stringify;
  if (t(n.clock) !== t(e.clock)) {
    const i = n.clock && e.clock && t({ ...n.clock, origin: e.clock.origin }) === t(e.clock) ? rn(n, I(n.clock.origin, e.clock.origin)) : null, r = (o) => t([o.launch, o.hiring?.funding?.day, o.hiring?.weeks, o.cards.map((l) => [l.id, l.lag ?? 0])]);
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
function U(n, e, t) {
  let a = { ...n, cards: n.cards.map((s) => {
    if (s.id !== e) return s;
    const i = { ...s, ...t };
    return i.lag || delete i.lag, i;
  }) };
  if (nn(n)) {
    const s = en(n, a, /* @__PURE__ */ new Set([e]));
    if (typeof s == "string") return s;
    a = s;
  }
  return P(n, a, e) ?? a;
}
function En(n, e, t) {
  const a = n.cards.find((o) => o.id === e);
  if (!a || !Number.isFinite(t)) return n;
  const s = y(n).get(e).start - (a.lag ?? 0), i = n.kind === "hiring-plan" ? Math.max(7, _(n)) : _(n), r = Math.max(0, Math.round((C(A(n)).idx(Math.max(0, Math.floor(t))) - s) / i) * i);
  for (let o = r; o > 0; o -= i) {
    const l = U(n, e, { lag: o });
    if (typeof l != "string") return l;
  }
  return n;
}
const se = (n) => "handle-_start-" + n, fn = se(""), Se = (n) => n.startsWith(fn) ? n.slice(fn.length) : null;
function Ee(n, e, t, a) {
  const s = Qn(n, e, t, a), i = n.cards.find((f) => f.id === e), r = { kind: "set_task", card: { id: e }, duration: s.duration, lag: s.lag }, o = U(n, e, { lag: s.lag, duration: s.duration }), l = n.kind === "hiring-plan", d = i.dependsOn?.map((f) => n.cards.find((g) => g.id === f)?.label).filter(Boolean) ?? [], c = s.held === "length" ? l ? "Recruiting takes at least 1 week." : _(n) > 1 ? "A task takes at least a week." : "A task takes at least 1 day." : s.held === "longest" ? l ? "Recruiting takes at most 20 weeks." : "A task takes at most 60 days." : s.held === "ready" ? d.length ? i.label + " starts as early as it can: it waits on " + d.join(" and ") + "." : i.label + " starts on the plan’s first day." : void 0;
  return typeof o == "string" ? { values: s, edit: r, next: null, refusal: o, reason: c } : { values: s, edit: r, next: o, refusal: null, reason: c };
}
const _n = {
  day: (n, e, t = 0) => n.clock ? Hn(n.clock.origin, e, t) : null,
  iso: (n, e) => B(n.clock.origin, e),
  name: (n, e) => v(n, e),
  readyDay(n, e) {
    const t = n.cards.find((a) => a.id === e);
    return C(A(n)).cal(y(n).get(e).start - (t.lag ?? 0));
  },
  lagAt(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return C(A(n)).idx(t) - (y(n).get(e).start - (a.lag ?? 0));
  }
}, Dn = (n) => JSON.stringify(n.cards.map((e) => [gn(n, e.id, "lag"), gn(n, e.id, "duration")]));
function gn(n, e, t, a) {
  const s = _(n), i = n.kind === "hiring-plan", r = t === "duration" ? i ? 140 : 60 : i ? 728 : $(n) ? n.launch.day : 120, o = [];
  for (let l = t === "duration" ? s : 0; l <= r; l += s) {
    if (typeof U(n, e, { [t]: l, ...a && { laneId: a } }) == "string") continue;
    const d = o.at(-1);
    d && d[1] === l - s ? d[1] = l : o.push([l, l]);
  }
  return o;
}
function ie(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const e = n.launch?.day;
  if (typeof e != "number" || !Number.isInteger(e) || e < 5 || e > 120) return "Launch day is a whole day from 5 to 120.";
  const t = $(n);
  for (const i of n.cards) {
    if (!Number.isInteger(i.duration) || i.duration < 1 || i.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(i.lag ?? 0) || (i.lag ?? 0) < 0 && !i.override || Math.abs(i.lag ?? 0) > 120) return "A task waits 0 days or more, and no later than launch.";
    if ((i.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (i.dependsOn?.includes(i.id)) return "A task can't wait on itself.";
  }
  if (!n.clock && n.behaviour?.rules.some((i) => i.kind === "workdays" || i.kind === "blackout")) return "Working days and freezes need dates; this plan counts day numbers.";
  try {
    y(n);
  } catch (i) {
    return i.message;
  }
  const a = y(n);
  if ([...a.values()].some((i) => i.start < 0)) return "A task starts on the plan’s first day or later.";
  const s = On(n);
  if (t && s > E(n) && !n.cards.some((i) => i.override)) {
    const i = n.cards.find((r) => a.get(r.id).end === s);
    return n.clock ? b(n) : `${i.label} ends on day ${s}, after launch on day ${e}.`;
  }
  return null;
}
function Ln(n, e, t) {
  const a = n.cards.find((s) => s.id === e);
  return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
}
function _e(n, e, t) {
  return Ln(n, e, t) ? "" : "That move is not available.";
}
function re(n, e, t) {
  const a = n.cards.find((i) => i.id === e), s = n.cards.find((i) => i.id === t);
  return !a || !s ? "That task is no longer on the plan." : a === s ? "A task can't wait on itself." : a.dependsOn?.includes(s.id) ? `${a.label} already waits on ${s.label}.` : Vn(n, a.id).has(s.id) ? `${s.label} already waits on ${a.label}, so ${a.label} can't wait on ${s.label}.` : (a.dependsOn?.length ?? 0) >= 3 ? `${a.label} already waits on 3 tasks.` : P(n, Q(n, e, t), e);
}
function oe(n, e) {
  const t = y(n), a = n.cards.filter((i) => i.laneId === e), s = a.filter((i) => t.get(i.id).critical).length;
  return `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${s} on the critical path`;
}
function an(n, e) {
  const t = n.launch.day;
  if (e.field === "day") {
    const c = y(n), f = On(n), g = n.cards.find((h) => c.get(h.id).end === f), u = g ? c.get(g.id).to : 0;
    return $(n) ? {
      field: "day",
      min: Math.max(5, u),
      max: 120,
      reasons: { min: g ? n.clock ? `${g.label} ends ${v(n, u - 1)}.` : `${g.label} ends on day ${f}.` : void 0, max: "Launch day is at most day 120." }
    } : { field: "day", min: 5, max: 120, reasons: { min: "Launch day is day 5 at the earliest.", max: "Launch day is at most day 120." } };
  }
  const a = n.cards.find((c) => c.id === e.cardId), s = _(n), i = e.field, r = i === "duration" ? s : 0, o = i === "duration" ? 60 : $(n) ? t : 120;
  let l = a[i] ?? r;
  for (; l + s <= o && typeof U(n, a.id, { [i]: l + s }) != "string"; ) l += s;
  const d = l + s <= o ? U(n, a.id, { [i]: l + s }) : null;
  return {
    field: i,
    min: r,
    max: Math.max(r, l),
    reasons: {
      min: i === "duration" ? "A task takes at least 1 day." : `${a.label} starts as early as it can.`,
      max: typeof d == "string" ? d : i === "duration" ? "A task takes at most 60 days." : `Launch is ${v(n, t)}.`
    }
  };
}
function sn(n, e, t = n.launch?.day ?? e) {
  const a = Math.min(120, Math.max(5, Math.round(e))), s = A(n);
  if (!s?.workdays) return a;
  const i = (l, d) => {
    let c = l;
    for (; Y(s.origin, c); ) c += d;
    return c;
  }, r = a < t ? -1 : 1, o = i(a, r);
  return o < 5 || o > 120 ? i(a, -r) : o;
}
function le(n) {
  const { min: e } = an(n, { field: "day" });
  return sn(n, e, -1 / 0);
}
function Nn(n, e) {
  if (!$(n)) return null;
  const t = b(L(n, { field: "day" }, e));
  return t && t + " The earliest " + T(n) + " that fits is " + v(n, le(n)) + ".";
}
function De(n, e) {
  const t = n.launch.day, a = sn(n, e, t), s = e > 120 ? "Launch day is at most day 120." : e < 5 ? "Launch day is day 5 at the earliest." : void 0, i = Nn(n, a);
  if (i) return { day: a, next: null, refusal: i };
  const r = L(n, { field: "day" }, a), o = n.behaviour ? P(n, r) : null;
  return o ? { day: a, next: null, refusal: o } : { day: a, next: r, refusal: null, ...s && { reason: s } };
}
function pn(n, e) {
  const t = Math.round(e);
  if (_(n) > 1 || n.kind === "hiring-plan") return Math.round(t / 7) * 7;
  const a = A(n);
  if (!a?.workdays || !t) return t;
  let s = t;
  for (; Y(a.origin, s); ) s += t > 0 ? 1 : -1;
  return s;
}
function rn(n, e) {
  const t = B(n.clock.origin, e), a = y(n), s = { ...n, clock: { ...n.clock, origin: t }, cards: n.cards.map((r) => ({ ...r })) };
  n.launch && (s.launch = { ...n.launch, day: n.launch.day - e }), n.hiring && (s.hiring = {
    ...n.hiring,
    weeks: n.hiring.weeks - Math.round(e / 7),
    ...n.hiring.funding && { funding: { ...n.hiring.funding, day: n.hiring.funding.day - e } }
  });
  const i = C(A(s));
  for (const r of [...n.cards].sort((o, l) => a.get(o.id).start - a.get(l.id).start)) {
    const o = s.cards.find((f) => f.id === r.id), l = y(s).get(r.id).start - (o.lag ?? 0), d = a.get(r.id).from - e, c = Math.max(0, (d <= 0 ? 0 : i.idx(d)) - l);
    c ? o.lag = c : delete o.lag;
  }
  return s;
}
function yn(n, e) {
  const t = rn(n, e);
  if (n.launch && t.launch.day > 120) return "A plan runs at most 120 days to " + T(n) + ".";
  if (n.launch && t.launch.day < 5) return "A plan runs at least 5 days to " + T(n) + ".";
  if (n.hiring) {
    if (t.hiring.weeks > 104) return "A hiring plan runs at most 104 weeks.";
    if (t.hiring.weeks < 13) return "A hiring plan runs at least 13 weeks.";
    if (t.hiring.funding && t.hiring.funding.day < 0) return "The round closes " + O(n.clock.origin, n.hiring.funding.day) + ", before that first day.";
  }
  return n.behaviour ? P(n, t) : b(t);
}
function de(n, e) {
  if (!n.clock) return { by: 0, next: null, refusal: "A plan in day numbers starts on day 0. Give it dates to move its first day." };
  const t = pn(n, e);
  if (!t) return { by: t, next: n, refusal: null };
  const a = yn(n, t);
  if (!a) return { by: t, next: rn(n, t), refusal: null };
  const s = t > 0 ? -1 : 1;
  for (let i = t + s; i !== 0; i += s)
    if (!(pn(n, i) !== i || yn(n, i)))
      return { by: t, next: null, refusal: a + " The " + (t > 0 ? "latest" : "earliest") + " first day that fits is " + O(n.clock.origin, i) + "." };
  return { by: t, next: null, refusal: a };
}
function ce(n, e) {
  if (!Number.isInteger(e) || e < 13 || e > 104) return "A hiring plan runs 13 to 104 weeks.";
  const t = e * 7, a = y(n), s = n.cards.map((r) => ({ card: r, day: a.get(r.id).to })).filter((r) => r.day > t).sort((r, o) => o.day - r.day)[0];
  if (s) return s.card.label + " starts " + O(n.clock.origin, s.day) + ", after the plan’s last week.";
  const i = n.hiring?.funding;
  return i && i.day > t ? "The round closes " + O(n.clock.origin, i.day) + ", after the plan’s last week." : null;
}
function ue(n) {
  return n.label + " · " + H(n.duration ?? 1);
}
function Le() {
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
const he = (n = "Slatebox") => ({ by: n, at: "2026-11-21T00:00:00.000Z", via: "preset" });
function on(n) {
  return { version: 1, rev: 0, rules: n.map((e, t) => ({ id: "rule-" + (t + 1), on: !0, severity: "refuse", set: he(), ...e })) };
}
function Ne(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Launch plan",
    launch: { day: 18 },
    clock: { origin: X(n) },
    lanes: [{ id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }, { id: "marketing", label: "Marketing" }],
    cards: [
      { id: "design", label: "Design", laneId: "product", duration: 4 },
      { id: "build", label: "Build", laneId: "engineering", duration: 6, dependsOn: ["design"] },
      { id: "qa", label: "QA", laneId: "engineering", duration: 2, dependsOn: ["build"] },
      { id: "copy", label: "Copy", laneId: "product", duration: 2 },
      { id: "post", label: "Launch post", laneId: "marketing", duration: 2, dependsOn: ["copy"], lag: 3 }
    ],
    behaviour: on([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function $e(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Customer go-live",
    launch: { day: 25, name: "go-live" },
    clock: { origin: X(n) },
    lanes: [{ id: "us", label: "Us" }, { id: "customer", label: "Customer" }],
    cards: [
      { id: "kickoff", label: "Kickoff", laneId: "us", duration: 1 },
      { id: "data", label: "Send data", laneId: "customer", duration: 3, dependsOn: ["kickoff"] },
      { id: "configure", label: "Configure", laneId: "us", duration: 5, dependsOn: ["data"] },
      { id: "security", label: "Security review", laneId: "customer", duration: 4, dependsOn: ["kickoff"] },
      { id: "train", label: "Train admins", laneId: "us", duration: 2, dependsOn: ["configure"] },
      { id: "signoff", label: "Sign-off", laneId: "customer", duration: 1, dependsOn: ["train", "security"] }
    ],
    behaviour: on([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function $n(n, e, t, a) {
  switch (e.kind) {
    case "set_task": {
      const s = t.card(e.card), i = { laneId: s.laneId, cardId: s.id };
      e.duration === void 0 && e.lag === void 0 && t.refuse("Say how many days " + k(s.label) + " takes, or waits.", { ...i, code: "invalid_edit" });
      const r = n.kind === "hiring-plan";
      if (e.override === !0) {
        const d = fe(n, s, e, t);
        if (d) return d;
      }
      let o = n;
      for (const d of ["duration", "lag"]) {
        const c = e[d];
        if (c === void 0) continue;
        if (Number.isInteger(c) || t.refuse("A task's days are whole days.", i), d === "lag" && c < 0 && t.refuse(Cn(o, s.id, c), i), !n.behaviour && !r) {
          const u = an(o, { cardId: s.id, field: d }), h = L(o, { cardId: s.id, field: d }, c);
          (c < u.min || c > u.max) && t.refuse(c < u.min ? u.reasons.min : b(h, s.id) ?? u.reasons.max, { ...i, limits: u }), o = h;
          continue;
        }
        const [f, g] = d === "duration" ? r ? [7, 140] : [1, 60] : [0, r ? 728 : 120];
        (c < f || c > g) && t.refuse(d === "duration" ? r ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", i), o = L(o, { cardId: s.id, field: d }, c);
      }
      if (nn(n)) {
        const d = en(n, o, /* @__PURE__ */ new Set([s.id]));
        typeof d == "string" && t.refuse(d, i), o = d;
      }
      o = { ...o, cards: o.cards.map((d) => d.id === s.id && d.override && (d.lag ?? 0) >= 0 ? Un(d) : d) };
      const l = t.settle(o, s.laneId, s.id);
      return t.done(l, a(l.cards.find((d) => d.id === s.id), l), i);
    }
    case "set_plan_start": {
      n.clock || t.refuse("A plan in day numbers starts on day 0. Give it dates to move its first day."), m(e.start) || t.refuse("Say the first day as a date, such as " + B(n.clock.origin, 7) + ".");
      const s = de(n, I(n.clock.origin, e.start));
      s.refusal && t.refuse(s.refusal);
      const i = t.settle(s.next), r = s.by !== I(n.clock.origin, e.start) ? " (" + O(n.clock.origin, I(n.clock.origin, e.start)) + (n.kind === "hiring-plan" ? " is not a whole week away" : " is a weekend") + ")." : ".";
      return t.done(i, "The plan now starts " + O(i.clock.origin, 0) + r);
    }
    case "set_plan_weeks": {
      n.kind !== "hiring-plan" && t.refuse("Only a hiring plan runs a number of weeks; move " + T(n) + " instead.");
      const s = ce(n, e.weeks);
      s && t.refuse(s);
      const i = t.settle({ ...n, hiring: { ...n.hiring, weeks: e.weeks } });
      return t.done(i, "The plan now runs " + e.weeks + " weeks, to " + O(n.clock.origin, e.weeks * 7 - 1) + ".");
    }
    case "link_tasks":
    case "unlink_tasks": {
      const s = t.card(e.card), i = t.card(e.waitsOn), r = { laneId: s.laneId, cardId: s.id };
      if (e.kind === "unlink_tasks")
        return s.dependsOn?.includes(i.id) || t.refuse(k(s.label) + " doesn’t wait on " + k(i.label) + ".", r), t.done(t.settle(Q(n, s.id, i.id, !0), s.laneId, s.id), k(s.label) + " no longer waits on " + k(i.label) + ".", r);
      const o = re(n, s.id, i.id);
      return o && t.refuse(o, r), t.done(t.settle(Q(n, s.id, i.id), s.laneId, s.id), k(s.label) + " now waits on " + k(i.label) + ".", r);
    }
  }
  return null;
}
const Un = (n) => {
  const { override: e, ...t } = n;
  return t;
};
function fe(n, e, t, a) {
  const s = { laneId: e.laneId, cardId: e.id }, i = n.kind === "hiring-plan";
  let r = n, o = null;
  for (const u of ["duration", "lag"]) {
    const h = t[u];
    if (h === void 0) continue;
    Number.isInteger(h) || a.refuse("A task's days are whole days.", s);
    const [p, w] = u === "duration" ? i ? [7, 140] : [1, 60] : [-(i ? 728 : 120), i ? 728 : 120];
    (h < p || h > w) && a.refuse(u === "duration" ? i ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", s), u === "lag" && (o = Cn(r, e.id, h)), r = L(r, { cardId: e.id, field: u }, h);
  }
  y(r).get(e.id).start < 0 && a.refuse(e.label + " can’t start before the plan’s first day.", s);
  let l = r;
  if (nn(n) && (l = en(n, r, /* @__PURE__ */ new Set([e.id]))), o ?? (o = typeof l == "string" ? l : P(n, l, e.id)), typeof l != "string" && (r = l), !o) return null;
  const d = Rn(e, o, a.who ?? { by: "an agent", at: (/* @__PURE__ */ new Date()).toISOString() }, { lag: e.lag ?? 0, duration: e.duration ?? 1 }), c = a.settle({ ...r, cards: r.cards.map((u) => u.id === e.id ? { ...Un(u), override: d } : u) }, e.laneId, e.id), f = c.cards.find((u) => u.id === e.id), g = y(c).get(e.id);
  return a.done(c, "Moved " + k(e.label) + " anyway: it " + (i ? "starts " + v(c, g.to) : "runs " + v(c, g.from) + " to " + v(c, g.to - 1)) + (f.duration !== e.duration ? ", " + H(f.duration) : "") + ". " + o, s);
}
const ge = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  rulebook: ee,
  drags: Dn,
  fixed: Sn,
  words: _n,
  readCard(n, e, t) {
    if (e.duration = M(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (e.lag = M(n.lag, n.override !== void 0 ? -120 : 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e) {
    const t = An(n, "launch", "A launch plan needs a launch day.");
    if (e.launch = { day: M(t.day, 5, 120, "Launch day is a whole day from 5 to 120.") }, t.name !== void 0) {
      if (typeof t.name != "string" || !/^[a-z][a-z -]{1,23}$/i.test(t.name)) throw new Error("Name the line in a word or two, such as go-live.");
      e.launch.name = t.name.toLowerCase();
    }
    Pn(n, e);
  },
  validate: ie,
  planMove: Ln,
  caption: oe,
  cardText: (n, e) => e.label + " · " + e.duration + "d",
  noteText: (n, e) => ue(e),
  fromNote(n, e, t) {
    const a = qn(e, t);
    return { label: a.label, duration: Math.min(60, Math.max(1, a.days ?? 2)) };
  },
  newCard: () => "task",
  landNote: En,
  renamed(n, e, t) {
    const a = Gn(t);
    return { label: a.label, edits: a.days !== void 0 ? [{ kind: "set_task", card: { id: e }, duration: a.days }] : [] };
  },
  edit(n, e, t) {
    switch (e.kind) {
      case "add_card": {
        const a = t.lane(e.lane), s = e.label?.trim() || "New task", i = { id: xn(n), label: s, laneId: a.id, duration: e.duration ?? 2 };
        e.lag && (i.lag = e.lag);
        const r = [...new Set((e.waitsOn ?? []).map((d) => t.card(d).id))];
        r.length && (i.dependsOn = r);
        const o = { ...n, cards: [...n.cards, i] }, l = n.behaviour ? null : b(o, i.id);
        return l && t.refuse(l, { laneId: a.id }), t.done(t.settle(o, a.id), "Added " + k(s) + " to " + k(a.label) + ".", { laneId: a.id, cardId: i.id });
      }
      case "set_launch_day": {
        const a = an(n, { field: "day" }), s = Number.isInteger(e.day) && e.day >= 5 && e.day <= 120 ? sn(n, e.day) : e.day;
        (!Number.isInteger(s) || s < a.min || s > a.max) && t.refuse(s < a.min && Nn(n, s) || (s < a.min ? a.reasons.min : a.reasons.max), { limits: a });
        const i = L(n, { field: "day" }, s), r = s !== e.day ? ": " + v(n, e.day) + " is a weekend, and weekends don’t count on this plan." : ".";
        return t.done(t.settle(i), pe(T(n)) + " is now " + v(n, s) + r);
      }
    }
    return $n(n, e, t, (a) => k(a.label) + " now takes " + H(a.duration) + (a.lag ? " and waits " + H(a.lag) + "." : "."));
  }
}, pe = (n) => n.charAt(0).toUpperCase() + n.slice(1);
function Pn(n, e) {
  if (n.clock === void 0) return;
  const t = n.clock?.origin;
  if (!m(t)) throw new Error("A plan starts on a real date, written as 2026-12-07.");
  e.clock = { origin: t };
}
wn(ge);
const ye = In({ deadline: "at floor", snap: "unit", cascade: "onConflict", locked: "cards" }), kn = (n, e, t) => ({ type: "integer", min: e, max: t, about: n });
Mn({
  kinds: [
    {
      kind: "set_band_cost",
      summary: "Hiring plan: what a role band costs a month, loaded. Cost is per band, never per person.",
      intent: !1,
      fields: { band: { type: "text", max: 40, about: "The band, by id or name." }, monthly: kn("Whole currency units a month.", 1, 1e7) },
      boards: ["hiring-plan"],
      refusals: {}
    },
    {
      kind: "set_funding",
      summary: "Hiring plan: the day the funding round closes, in days from the plan’s first day.",
      intent: !1,
      fields: { day: kn("Days from the first day.", 0, 728) },
      boards: ["hiring-plan"],
      refusals: {}
    }
  ],
  boards: { set_task: ["hiring-plan"], link_tasks: ["hiring-plan"], unlink_tasks: ["hiring-plan"] },
  fields: { add_card: { band: { type: "text", max: 40, optional: !0, about: "Hiring plan: the role band (by id or name). Left out, the team’s first band." } } }
});
const Fn = (n, e) => y(n).get(e).to;
function ke(n, e, t) {
  const a = n.cards.find((o) => o.id === e), i = y(n).get(e).start - (a.lag ?? 0), r = Math.max(0, t - (a.duration ?? 7) - i);
  return Math.ceil(r / 7) * 7;
}
function z(n, e) {
  const t = e.trim().toLowerCase();
  return n.bands.find((a) => a.id === e) ?? n.bands.find((a) => a.label.toLowerCase() === t) ?? n.bands.find((a) => new RegExp("\\b" + a.label.toLowerCase().replace(/[^a-z0-9 ]/g, "") + "\\b").test(t));
}
const me = ["salary", "pay", "wage", "cost", "amount", "monthly", "comp", "compensation"];
function we(n) {
  if (n.lanes.length > 4) return "A hiring plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 16) return "A hiring plan has 1 to 16 hires.";
  if (!n.clock) return "A hiring plan starts on a date.";
  for (const e of n.cards) {
    if (!n.hiring.bands.some((t) => t.id === e.band)) return k(e.label) + " needs a role band on this plan.";
    if ((e.dependsOn?.length ?? 0) > 3) return "A hire waits on up to 3 others.";
  }
  if (n.hiring.bands.some((e) => !n.lanes.some((t) => t.id === e.lane))) return "Each role band belongs to a team on the plan.";
  try {
    y(n);
  } catch (e) {
    return e.message;
  }
  for (const e of n.cards) {
    if ((e.lag ?? 0) < 0 && !e.override) return "A hire waits 0 days or more.";
    if (y(n).get(e.id).start < 0) return k(e.label) + " starts recruiting on the plan’s first day or later.";
  }
  return null;
}
const W = (n) => "Runway with these hires: " + Tn(V(n));
function Ue(n) {
  return {
    version: 1,
    kind: "hiring-plan",
    title: "Hiring plan",
    clock: { origin: X(n) },
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
    behaviour: on([{ kind: "snap", unit: "week" }, { kind: "cascade", onConflict: "push" }])
  };
}
const ve = (n, e) => k(e.label) + " now starts " + O(n.clock.origin, Fn(n, e.id)) + ", after " + Math.round(e.duration / 7) + " weeks of recruiting. " + W(n) + ".", xe = {
  kind: "hiring-plan",
  cards: [16, "A hiring plan holds up to 16 hires."],
  rulebook: ye,
  drags: Dn,
  fixed: Sn,
  words: { ..._n, startLag: ke, band: (n, e) => z(n.hiring, e) },
  readCard(n, e, t) {
    if (me.some((a) => n[a] !== void 0)) throw new Error("Cost is per role band, never per person. Say what the band costs instead.");
    if (e.duration = M(n.duration, 7, 140, "Recruiting takes 1 to 20 weeks."), n.lag !== void 0 && n.lag !== 0 && (e.lag = M(n.lag, n.override !== void 0 ? -728 : 0, 728, "That is further out than the plan runs.")), typeof n.band != "string") throw new Error("Each hire is in a role band.");
    if (e.band = t.id(n.band), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A hire waits on a list of hires.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e, t) {
    const a = An(n, "hiring", "A hiring plan needs its cash, burn and role bands.");
    if (!Array.isArray(a.bands) || a.bands.length < 1 || a.bands.length > 8) throw new Error("A hiring plan has 1 to 8 role bands.");
    const s = a.bands.map((r) => {
      const o = r;
      if (typeof o.label != "string" || !o.label.trim() || o.label.length > 40 || /[<>\u0000-\u001f]/.test(o.label)) throw new Error("Name each role band in plain words.");
      return { id: t.id(o.id), label: o.label.trim(), monthly: M(o.monthly, 1, 1e7, "A band costs 1 to 10,000,000 a month."), lane: t.id(o.lane) };
    });
    if (new Set(s.map((r) => r.id)).size !== s.length) throw new Error("Duplicate role band.");
    const i = typeof a.currency == "string" && /^[$€£¥]$/.test(a.currency) ? a.currency : "$";
    if (e.hiring = {
      cash: M(a.cash, 0, 1e10, "Cash is 0 to 10 billion."),
      burn: M(a.burn, 0, 1e9, "Burn is 0 to a billion a month."),
      currency: i,
      weeks: M(a.weeks ?? 52, 13, 104, "A hiring plan runs 13 to 104 weeks."),
      bands: s
    }, a.funding !== void 0) {
      const r = a.funding;
      e.hiring.funding = { day: M(r?.day, 0, 728, "A round closes within two years."), amount: M(r?.amount, 1, 1e10, "A round raises 1 to 10 billion.") };
    }
    Pn(n, e);
  },
  validate: we,
  planMove(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
  },
  caption(n, e) {
    const t = n.cards.filter((a) => a.laneId === e);
    return t.length + (t.length === 1 ? " hire" : " hires");
  },
  cardText: (n, e) => e.label + " · " + O(n.clock.origin, Fn(n, e.id)).replace(/^\w+ /, ""),
  noteText: (n, e) => e.label,
  fromNote(n, e, t) {
    return { label: (e.replace(/\s+/g, " ").trim() || t).slice(0, 80), duration: 42 };
  },
  newCard: () => "hire",
  landNote: En,
  renamed: (n, e, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit(n, e, t) {
    const a = n.hiring;
    switch (e.kind) {
      case "add_card": {
        const s = t.lane(e.lane), i = e.label?.trim() || "New hire", r = e.band ? z(a, e.band) : a.bands.find((c) => c.lane === s.id) ?? z(a, i);
        r || t.refuse("Say which role band, such as " + a.bands.map((c) => k(c.label)).join(" or ") + ".", { laneId: s.id });
        const o = { id: xn(n), label: i, laneId: s.id, band: r.id, duration: e.duration ?? 42 };
        e.lag && (o.lag = e.lag);
        const l = [...new Set((e.waitsOn ?? []).map((c) => t.card(c).id))];
        l.length && (o.dependsOn = l);
        const d = t.settle({ ...n, cards: [...n.cards, o] }, s.id);
        return t.done(d, "Added " + k(i) + " to " + k(s.label) + ". " + W(d) + ".", { laneId: s.id, cardId: o.id });
      }
      case "set_band_cost": {
        const s = z(a, e.band);
        s || t.refuse("There is no role band " + k(e.band) + ". The bands are " + a.bands.map((r) => k(r.label)).join(", ") + ".", { code: "unknown_reference" });
        const i = t.settle({ ...n, hiring: { ...a, bands: a.bands.map((r) => r === s ? { ...r, monthly: e.monthly } : r) } });
        return t.done(i, k(s.label) + " now costs " + Kn(e.monthly, a.currency) + " a month. " + W(i) + ".");
      }
      case "set_funding": {
        a.funding || t.refuse("This plan has no funding round.");
        const s = t.settle({ ...n, hiring: { ...a, funding: { ...a.funding, day: e.day } } });
        return t.done(s, "The round now closes " + O(n.clock.origin, e.day) + ". " + W(s) + ".");
      }
    }
    return $n(n, e, t, (s, i) => ve(i, s));
  }
};
wn(xe);
export {
  Oe as a,
  qn as b,
  z as bandOf,
  be as brokenWaits,
  Te as c,
  nn as cascadeStops,
  bn as checkTime,
  A as clockOf,
  M as d,
  O as dateName,
  Hn as dayFromWords,
  C as dayMap,
  v as dayWords,
  Vn as downstreamTasks,
  Ee as dragTaskEdge,
  Me as e,
  le as earliestLaunch,
  Qn as edgeValues,
  Mn as extendWorkshopEdits,
  vn as f,
  H as g,
  $e as goLiveSample,
  ke as hireLagFor,
  Fn as hireStarts,
  xe as hiringPlanRules,
  Ue as hiringPlanSample,
  en as holdOthers,
  B as isoAt,
  m as isoTime,
  En as landPlanNote,
  sn as launchDayOn,
  On as launchFinish,
  $ as launchHard,
  E as launchIndex,
  re as launchLinkRefusal,
  b as launchOverrun,
  oe as launchPlanCaption,
  an as launchPlanLimits,
  _e as launchPlanRefusal,
  ge as launchPlanRules,
  Ne as launchPlanSample,
  ue as launchTaskText,
  Nn as launchTooEarly,
  gn as legalRuns,
  T as lineWord,
  Kn as m,
  Z as monthNames,
  De as moveLaunch,
  de as movePlanStart,
  xn as n,
  X as nextMonday,
  An as o,
  I as offsetOf,
  Ce as pastTheLine,
  Dn as planDrags,
  $n as planEdit,
  Sn as planFixed,
  Ln as planLaunchPlanMove,
  P as planProblem,
  pn as planStartBy,
  ce as planWeeksProblem,
  _n as planWords,
  on as presetRules,
  Gn as r,
  Pn as readClock,
  R as runwayCap,
  W as runwayHeader,
  V as runwayMonths,
  Tn as runwayWords,
  Le as sampleLaunchPlan,
  y as scheduleLaunch,
  j as shortDate,
  _ as snapStep,
  se as startHandle,
  Se as startHandleCard,
  In as timeFamily,
  Ie as timeRuleKindIds,
  N as timeSentence,
  U as tryTask,
  we as validateHiringPlan,
  ie as validateLaunchPlan,
  Cn as waitsRefusal,
  jn as weekdayAt,
  Y as weekendAt,
  Q as withLink,
  rn as withPlanStart,
  L as withTaskValue
};
