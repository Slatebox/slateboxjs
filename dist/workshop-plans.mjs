import { workshopEditKinds as Q, workshopRuleSchema as Z, workshopHasMarks as An, workshopFreshOverride as Mn, workshopOverrideUndone as Yn, registerWorkshopRules as On, said as w, workshopShedMark as Jn, workshopOverrideMark as Kn } from "./workshop-model.mjs";
const L = 864e5, qn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], tn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function v(n) {
  if (typeof n != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(n)) return NaN;
  const e = Date.UTC(+n.slice(0, 4), +n.slice(5, 7) - 1, +n.slice(8, 10));
  return new Date(e).toISOString().slice(0, 10) === n ? e : NaN;
}
const K = (n, e) => new Date(v(n) + Math.round(e) * L).toISOString().slice(0, 10), E = (n, e) => Math.round((v(e) - v(n)) / L), Vn = (n, e) => new Date(v(n) + Math.floor(e) * L).getUTCDay(), q = (n, e) => {
  const t = Vn(n, e);
  return t === 0 || t === 6;
};
function I(n, e) {
  const t = new Date(v(n) + Math.floor(e) * L);
  return qn[t.getUTCDay()] + " " + t.getUTCDate() + " " + tn[t.getUTCMonth()];
}
function Y(n) {
  const e = new Date(v(n));
  return e.getUTCDate() + " " + tn[e.getUTCMonth()];
}
function an(n) {
  const e = v(n) || Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), (/* @__PURE__ */ new Date()).getUTCMonth(), (/* @__PURE__ */ new Date()).getUTCDate()), t = new Date(e).toISOString().slice(0, 10);
  return K(t, (8 - new Date(e).getUTCDay()) % 7);
}
function Gn(n, e, t = 0) {
  const a = e.trim().replace(/[,.]/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (v(a)) return E(n, a);
  const s = (d) => tn.findIndex((c) => d.startsWith(c.toLowerCase())), i = new Date(v(n) + t * L);
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
      if (new Date(c).getUTCDate() === +r[1] && c >= i.getTime()) return Math.round((c - v(n)) / L);
    }
    return null;
  } else return null;
  for (const d of [i.getUTCFullYear(), i.getUTCFullYear() + 1]) {
    const c = Date.UTC(d, l, o);
    if (new Date(c).getUTCDate() !== o) return null;
    if (c >= i.getTime() || d > i.getUTCFullYear()) return Math.round((c - v(n)) / L);
  }
  return null;
}
const Qn = { cal: (n) => n, idx: (n) => n }, fn = /* @__PURE__ */ new Map();
function _(n) {
  if (!n?.workdays) return Qn;
  const e = fn.get(n.origin);
  if (e) return e;
  const t = [];
  for (let s = 0; t.length < 800; s++) q(n.origin, s) || t.push(s);
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
  return fn.set(n.origin, a), a;
}
function T(n) {
  if (n.clock)
    return { origin: n.clock.origin, workdays: !!n.behaviour?.rules.some((e) => e.on && e.kind === "workdays") };
}
const Zn = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, Xn = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function Tn(n) {
  let e = String(n ?? "").replace(/\s+/g, " ").trim();
  const t = { label: e }, a = Zn.exec(e);
  if (a) {
    const r = Number(a[1].replace(",", ".")), o = /^w/i.test(a[2]);
    t.days = Math.max(1, Math.ceil(o ? r * 5 : r)), e = e.slice(0, a.index) + " " + e.slice(a.index + a[0].length);
  }
  const s = [...e.matchAll(Xn)].filter((r) => r[1] || r[3] || Number(r[2].replace(",", "")) >= 1e3), i = s.find((r) => r[1] || r[3]) ?? s[0];
  if (i) {
    const r = /k/i.test(i[3] ?? "") ? 1e3 : /m/i.test(i[3] ?? "") ? 1e6 : 1;
    t.amount = Math.round(Number(i[2].replace(",", i[3] ? "." : "")) * r), i[1] && (t.currency = i[1]), e = e.slice(0, i.index) + " " + e.slice(i.index + i[0].length);
  }
  return t.label = e.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), t;
}
function ne(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = (r, o) => (Math.round(r * 10) / 10).toString() + o, i = a >= 1e6 ? s(a / 1e6, "M") : a >= 1e3 ? s(a / 1e3, "k") : String(Math.round(a));
  return t + e + i;
}
function De(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = a >= 1e6 ? +(a / 1e6).toFixed(6) + "M" : a >= 1e3 ? +(a / 1e3).toFixed(3) + "k" : String(Math.round(a));
  return t + e + s;
}
const J = (n) => n + (n === 1 ? " day" : " days"), Le = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function ee(n, e) {
  const t = Tn(n);
  return t.label ? t : { ...t, label: e };
}
function te(n) {
  const e = Tn(n);
  return e.label ? e : { label: n };
}
function bn(n) {
  const e = new Set([...n.lanes, ...n.cards].map((a) => a.id));
  let t = 1;
  for (; e.has("card-" + t); ) t++;
  return "card-" + t;
}
function b(n, e, t, a, s = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < e || n > t || !s && !Number.isInteger(n)) throw new Error(a);
  return n;
}
function Ne(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function In(n, e, t) {
  const a = n[e];
  if (!a || typeof a != "object" || Array.isArray(a)) throw new Error(t);
  return a;
}
function Cn(n) {
  const e = (t) => Q.find((a) => a.kind === t);
  for (const t of n.kinds ?? []) Q.some((a) => a.kind === t.kind) || Q.push(t);
  for (const [t, a] of Object.entries(n.boards ?? {})) {
    const s = e(t);
    for (const i of a) s.boards.includes(i) || (s.boards.push(i), delete s.refusals[i]);
  }
  for (const [t, a] of Object.entries(n.fields ?? {})) Object.assign(e(t).fields, a);
  n.rules && (Z.kinds.push(...n.rules.kinds.filter((t) => !Z.kinds.includes(t))), Object.assign(Z.keys, n.rules.keys));
}
function k(n) {
  const e = new Map(n.cards.map((d) => [d.id, d])), t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d) => {
    const c = t.get(d.id);
    if (c) return c;
    if (a.has(d.id)) throw new Error("Tasks can't wait on each other in a circle.");
    a.add(d.id);
    let g = 0;
    for (const y of d.dependsOn ?? []) {
      const f = e.get(y);
      if (!f) throw new Error("A task waits on a task that is not on the plan.");
      g = Math.max(g, s(f).end);
    }
    g += d.lag ?? 0;
    const p = { start: g, end: g + (d.duration ?? 1), slack: 0, critical: !1, from: 0, to: 0 };
    return t.set(d.id, p), a.delete(d.id), p;
  };
  n.cards.forEach(s);
  const i = Math.max(0, ...[...t.values()].map((d) => d.end)), r = /* @__PURE__ */ new Map(), o = (d) => {
    const c = r.get(d.id);
    if (c !== void 0) return c;
    let g = i;
    for (const p of n.cards)
      p.dependsOn?.includes(d.id) && (g = Math.min(g, o(p) - (p.duration ?? 1) - (p.lag ?? 0)));
    return r.set(d.id, g), g;
  }, l = _(T(n));
  for (const d of n.cards) {
    const c = t.get(d.id);
    c.slack = o(d) - c.end, c.critical = c.slack === 0, c.from = l.cal(c.start), c.to = l.cal(c.end - 1) + 1;
  }
  return t;
}
function $e(n) {
  const e = k(n), t = [];
  for (const a of n.cards) for (const s of a.dependsOn ?? [])
    e.get(a.id).start < (e.get(s)?.end ?? 0) && t.push({ from: s, to: a.id });
  return t;
}
function Sn(n) {
  return Math.max(0, ...[...k(n).values()].map((e) => e.end));
}
const D = (n) => _(T(n)).idx(n.launch?.day ?? 0), S = (n) => n.launch?.name ?? "launch", M = (n, e) => n.clock ? I(n.clock.origin, e) : "day " + e;
function R(n) {
  return !n.behaviour || n.behaviour.rules.some((e) => e.on && e.kind === "deadline" && e.at === "launch" && e.severity === "refuse");
}
const sn = (n) => !!n.behaviour?.rules.some((e) => e.on && e.kind === "cascade" && e.onConflict === "stop");
function N(n) {
  const e = n.behaviour?.rules.find((t) => t.on && t.kind === "snap");
  return e && e.kind === "snap" && e.unit === "week" ? T(n)?.workdays ? 5 : 7 : 1;
}
function ae(n, e, t, a) {
  const s = n.cards.find((f) => f.id === e);
  if (!s) throw new Error("That task is no longer on the plan.");
  const i = k(n).get(e), r = _(T(n)), o = N(n), l = s.lag ?? 0, d = s.duration ?? 1, c = (f) => Math.round(f / o) * o;
  if (t === "end") {
    const f = c(r.idx(Math.round(i.to + a)) - i.start), x = n.kind === "hiring-plan" ? 140 : 60;
    return f > x ? { lag: l, duration: Math.floor(x / o) * o, held: "longest" } : f < o ? { lag: l, duration: o, held: "length" } : { lag: l, duration: f };
  }
  const g = Math.round(i.from + a);
  let p = c((g < 0 ? g : r.idx(g)) - i.start), y;
  return l + p < 0 && (p = -Math.floor(l / o) * o, y = "ready"), d - p < o && (p = Math.floor((d - o) / o) * o, y = "length"), { lag: l + p, duration: d - p, ...y && { held: y } };
}
function se(n, e) {
  const t = /* @__PURE__ */ new Set(), a = (s) => {
    for (const i of n.cards) i.dependsOn?.includes(s) && !t.has(i.id) && (t.add(i.id), a(i.id));
  };
  return a(e), t;
}
function C(n, e) {
  const t = n.launch?.day ?? 0, a = D(n), s = k(n), i = e ? s.get(e) : void 0, r = i && i.end > a ? { label: "That", t: i } : n.cards.map((o) => ({ label: o.label, t: s.get(o.id) })).filter((o) => o.t.end > a).sort((o, l) => l.t.end - o.t.end)[0];
  return r ? n.clock ? r.label + " would run until " + M(n, r.t.to - 1) + "; " + S(n) + " is " + M(n, t) + "." : (r.label === "That" ? "That ends on day " : "That pushes " + r.label + " to day ") + r.t.end + ", after launch on day " + t + "." : null;
}
function P(n, e, t) {
  return e.field === "day" ? { ...n, launch: { ...n.launch, day: t } } : { ...n, cards: n.cards.map((a) => a.id === e.cardId ? { ...a, [e.field]: t } : a) };
}
function nn(n, e, t, a = !1) {
  const s = k(n);
  return { ...n, cards: n.cards.map((i) => {
    if (i.id !== e) return i;
    const r = a ? (i.dependsOn ?? []).filter((d) => d !== t) : [...i.dependsOn ?? [], t], o = Math.max(0, ...r.map((d) => s.get(d)?.end ?? 0)), l = { ...i, dependsOn: r, lag: Math.max(0, s.get(i.id).start - o) };
    return r.length || delete l.dependsOn, l.lag || delete l.lag, l;
  }) };
}
function rn(n, e, t) {
  const a = k(n), s = new Map(e.cards.map((l) => [l.id, { ...l }])), i = /* @__PURE__ */ new Map();
  let r = null;
  const o = (l) => {
    const d = i.get(l.id);
    if (d !== void 0) return d;
    let c = 0, g;
    for (const f of l.dependsOn ?? []) {
      const x = o(s.get(f));
      x > c && (c = x, g = s.get(f));
    }
    const p = a.get(l.id);
    if (p && !t.has(l.id)) {
      const f = p.start - c;
      f < -1e-9 && !r && (r = g.label + " would end after " + l.label + " starts on " + M(n, p.from) + ". " + l.label + " waits on it, and a slip stops at the tasks that wait on it."), f > 1e-9 ? l.lag = f : delete l.lag;
    }
    const y = c + (l.lag ?? 0) + (l.duration ?? 1);
    return i.set(l.id, y), y;
  };
  for (const l of s.values()) o(l);
  return r ?? { ...e, cards: e.cards.map((l) => s.get(l.id)) };
}
const H = 120;
function en(n) {
  const e = n.hiring;
  if (!e) return H;
  const t = k(n), a = n.cards.map((i) => ({ day: t.get(i.id).to, monthly: e.bands.find((r) => r.id === i.band)?.monthly ?? 0 }));
  let s = e.cash;
  for (let i = 0; i < H * 52 / 12; i++) {
    const r = i * 7;
    e.funding && e.funding.day >= r && e.funding.day < r + 7 && (s += e.funding.amount);
    const o = (e.burn + a.reduce((l, d) => l + (d.day <= r ? d.monthly : 0), 0)) * 12 / 52;
    if (s < o) return Math.floor((i + Math.max(0, s) / o) * 12 / 52 * 10) / 10;
    s -= o;
  }
  return H;
}
const En = (n) => n >= H ? "10 years or more" : n + (n === 1 ? " month" : " months"), X = (n) => n.charAt(0).toUpperCase() + n.slice(1), ie = (n) => n.length > 1 ? n.slice(0, -1).join(", ") + " and " + n.at(-1) : n[0] ?? "", on = (n, e) => n.lanes.find((t) => t.id === e)?.label ?? e ?? "", gn = (n) => n.kind === "hiring-plan" ? "Hires" : "Tasks";
function U(n, e) {
  const t = n.severity === "warn";
  switch (n.kind) {
    case "deadline":
      return n.at === "runway" ? t ? "Runway under " + n.floor + " months is flagged." : "Runway stays above " + n.floor + " months." : t ? X(S(e)) + " is a soft line: a task may slip past it, shown in red." : X(S(e)) + " is a hard line: every task ends by " + M(e, e.launch?.day ?? 0) + ".";
    case "overlap": {
      const a = n.lane ? on(e, n.lane) : "a team";
      return t ? "Overlapping tasks in " + a + " are flagged." : n.lane ? a + "’s tasks can’t overlap." : "Tasks in a team can’t overlap.";
    }
    case "snap":
      return gn(e) + " snap to whole " + n.unit + "s.";
    case "workdays":
      return "Days are working days: weekends don’t count.";
    case "blackout": {
      const a = Y(n.start) + " – " + Y(n.end);
      return t ? X(n.label) + ", " + a + ", is flagged." : "Nothing ships in " + n.label + ", " + a + ".";
    }
    case "cascade":
      return "A slip " + (n.onConflict === "stop" ? "stops at" : "pushes") + " the " + gn(e).toLowerCase() + " that wait on it.";
    case "locked": {
      const a = n.cards.map((s) => e.cards.find((i) => i.id === s)?.label ?? s);
      return ie(a) + (a.length > 1 ? " are" : " is") + " locked.";
    }
  }
  return "";
}
const Pe = ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"], pn = ["locked", "cascade", "blackout", "overlap", "snap", "deadline"], re = (n, e) => (n.dependsOn ?? []).join() === (e.dependsOn ?? []).join();
function _n(n, e) {
  return An(n, e) && e.cards.some((t) => Mn(n, t)) ? { ok: !0, warnings: [] } : Dn(n, e, !1).verdict;
}
function oe(n, e) {
  return Dn(n, e, !0).all;
}
function Dn(n, e, t) {
  const a = (n.behaviour?.rules ?? []).filter((u) => u.on).sort((u, h) => pn.indexOf(u.kind) - pn.indexOf(h.kind)), s = [], i = [];
  if (!a.length) return { verdict: { ok: !0, warnings: s }, all: i };
  const r = An(n, e), o = n.clock && e.clock ? E(n.clock.origin, e.clock.origin) : 0, l = k(n), d = o ? new Map([...k(e)].map(([u, h]) => [u, { ...h, from: h.from + o, to: h.to + o }])) : k(e), c = new Map(n.cards.map((u) => [u.id, u])), g = new Set(r ? e.cards.filter((u) => c.has(u.id) && Yn(n, u)).map((u) => u.id) : []), p = e.cards.filter((u) => {
    const h = c.get(u.id);
    return !h || (h.lag ?? 0) !== (u.lag ?? 0) || h.duration !== u.duration || h.laneId !== u.laneId || !re(h, u);
  }), y = e.cards.filter((u) => {
    const h = d.get(u.id), m = l.get(u.id);
    return !m || h.from !== m.from || h.to !== m.to || c.get(u.id).laneId !== u.laneId;
  }), f = p[0] ?? y[0], x = (u) => {
    switch (u.kind) {
      case "locked":
        for (const h of y) if (u.cards.includes(h.id) && l.has(h.id) && !g.has(h.id)) return h.label + " is locked: it stays on " + M(n, l.get(h.id).from) + ".";
        return null;
      case "cascade": {
        if (u.onConflict !== "stop" || g.size) return null;
        const h = y.find((m) => l.has(m.id) && !p.includes(m));
        return h ? "That would push " + h.label + ", which waits on it. " + U(u, n) : null;
      }
      case "blackout": {
        const h = T(n);
        if (!h) return null;
        const m = E(h.origin, u.start), A = E(h.origin, u.end), O = y.find((j) => {
          const $ = d.get(j.id);
          for (let G = Math.max(Math.floor($.from), m); G < Math.min(Math.ceil($.to), A + 1); G++) if (!h.workdays || !q(h.origin, G)) return !0;
          return !1;
        });
        return O ? O.label + " would run into " + u.label + " (" + Y(u.start) + " – " + Y(u.end) + ")." : null;
      }
      case "overlap": {
        const h = (m, A) => m.from < A.to && A.from < m.to;
        for (const m of y) for (const A of e.cards)
          if (!(m === A || m.laneId !== A.laneId || u.lane && m.laneId !== u.lane || !h(d.get(m.id), d.get(A.id))))
            return m.label + " and " + A.label + " would overlap in " + on(e, m.laneId) + ". " + U(u, n);
        return null;
      }
      case "snap": {
        if (u.unit !== "week") return null;
        const h = T(n)?.workdays ? 5 : 7;
        return p.find((A) => {
          const O = c.get(A.id);
          return (A.lag ?? 0) % h && (!O || (O.lag ?? 0) !== (A.lag ?? 0)) || (A.duration ?? 0) % h && (!O || O.duration !== A.duration);
        }) ? U(u, n) : null;
      }
      case "deadline": {
        if (u.at === "runway") {
          const O = en(e);
          return O < u.floor && O < en(n) ? "That takes runway to " + En(O) + ". " + U(u, n) : null;
        }
        const h = D(e), m = D(n);
        return e.cards.some((O) => {
          const j = d.get(O.id), $ = l.get(O.id);
          return j.end > h && (!$ || $.end <= m || j.end > $.end || h < m);
        }) ? C(e, t ? void 0 : f?.id) : null;
      }
    }
    return null;
  };
  let z = null;
  for (const u of a) {
    const h = x(u);
    if (h) {
      if (u.severity === "warn") {
        s.push(h);
        continue;
      }
      if (i.push(h), z ?? (z = { refused: { sentence: h, ruleId: u.id, set: u.set, cardId: f?.id ?? "", laneId: f?.laneId ?? "" } }), !t) break;
    }
  }
  return { verdict: z ?? { ok: !0, warnings: s }, all: i };
}
const le = (n) => {
  if (typeof n != "string" || !n.trim() || n.trim().length > 40 || /[<>\u0000-\u001f]/.test(n)) throw new Error("Name the freeze in plain words, up to 40 letters.");
  return n.trim();
};
function Ln(n) {
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
          if (!v(e.start) || !v(e.end) || v(e.end) < v(e.start)) throw new Error("A freeze runs from one date to the same or a later one.");
          if (v(e.end) - v(e.start) > 92 * 864e5) throw new Error("A freeze lasts up to 3 months.");
          Object.assign(r, { start: e.start, end: e.end, label: le(e.label) });
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
    sentence: U,
    contradiction(e, t) {
      const a = /* @__PURE__ */ new Set();
      let s = 0;
      for (const i of e.rules) {
        const r = i.kind === "overlap" ? "overlap:" + (i.lane ?? "") : i.kind === "blackout" ? "blackout:" + s++ : i.kind === "locked" ? "" : i.kind;
        if (r && a.has(r)) return "There is already a " + (i.kind === "deadline" ? S(t) + " line" : i.kind + " rule") + ". Change that one instead.";
        if (a.add(r), i.kind === "locked") for (const o of i.cards) {
          if (a.has("locked:" + o)) return on({ ...t, lanes: t.cards.map((l) => ({ id: l.id, label: l.label })) }, o) + " is already locked.";
          a.add("locked:" + o);
        }
      }
      return s > 6 ? "A plan has up to 6 freezes." : null;
    },
    check: _n,
    builtIn: (e) => e.kind === "launch-plan" && !e.behaviour ? ["Every task ends by " + S(e) + ".", "A slip pushes the tasks that wait on it."] : []
  };
}
function Ue(n) {
  if (n.kind !== "launch-plan") return /* @__PURE__ */ new Set();
  const e = D(n);
  return new Set([...k(n)].filter(([, t]) => t.end > e).map(([t]) => t));
}
const de = Ln({ deadline: "at", overlap: "lane", snap: "unit", workdays: "", blackout: "start end label", cascade: "onConflict", locked: "cards" }), ce = { anyOf: [{ type: "string", minLength: 1, maxLength: 200 }, { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }] }, kn = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
Cn({
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
      start: kn,
      end: kn,
      label: { type: "string", minLength: 1, maxLength: 40 },
      onConflict: { enum: ["push", "stop"] },
      cards: { type: "array", items: ce, minItems: 1, maxItems: 6 }
    }
  }
});
function V(n, e, t) {
  if (!n.behaviour) return n.kind === "launch-plan" ? ln(n, e, t) : null;
  const a = _n(n, e);
  return "refused" in a ? a.refused.sentence : null;
}
function ue(n, e, t) {
  if (!n.behaviour) {
    const a = n.kind === "launch-plan" ? ln(n, e, t) : null;
    return a ? [a] : [];
  }
  return oe(n, e);
}
function ln(n, e, t) {
  if (e.cards.some((l) => Mn(n, l))) return null;
  if (!C(n)) return C(e, t);
  const a = D(e), s = D(n), i = k(n), r = k(e);
  return e.cards.some((l) => {
    const d = r.get(l.id), c = i.get(l.id);
    return d.end > a && (!c || c.end <= s || d.end > c.end || a < s);
  }) ? C(e, t) : null;
}
function Nn(n, e, t) {
  if (t >= 0) return null;
  const a = n.cards.find((r) => r.id === e);
  if (!a) return "That task is no longer on the plan.";
  const s = (a.dependsOn ?? []).map((r) => n.cards.find((o) => o.id === r)?.label).filter(Boolean), i = _(T(n)).cal(k(n).get(e).start - (a.lag ?? 0));
  return s.length ? a.label + " waits on " + s.join(" and ") + ": it starts " + M(n, i) + " at the earliest." : a.label + " starts on the plan’s first day at the earliest.";
}
function $n(n, e) {
  const t = JSON.stringify;
  if (t(n.clock) !== t(e.clock)) {
    const i = n.clock && e.clock && t({ ...n.clock, origin: e.clock.origin }) === t(e.clock) ? un(n, E(n.clock.origin, e.clock.origin)) : null, r = (o) => t([o.launch, o.hiring?.funding?.day, o.hiring?.weeks, o.cards.map((l) => [l.id, l.lag ?? 0])]);
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
function F(n, e, t) {
  let a = { ...n, cards: n.cards.map((s) => {
    if (s.id !== e) return s;
    const i = { ...s, ...t };
    return i.lag || delete i.lag, i;
  }) };
  if (sn(n)) {
    const s = rn(n, a, /* @__PURE__ */ new Set([e]));
    if (typeof s == "string") return s;
    a = s;
  }
  return V(n, a, e) ?? a;
}
function Pn(n, e, t) {
  const a = n.cards.find((o) => o.id === e);
  if (!a || !Number.isFinite(t)) return n;
  const s = k(n).get(e).start - (a.lag ?? 0), i = n.kind === "hiring-plan" ? Math.max(7, N(n)) : N(n), r = Math.max(0, Math.round((_(T(n)).idx(Math.max(0, Math.floor(t))) - s) / i) * i);
  for (let o = r; o > 0; o -= i) {
    const l = F(n, e, { lag: o });
    if (typeof l != "string") return l;
  }
  return n;
}
const he = (n) => "handle-_start-" + n, yn = he(""), Re = (n) => n.startsWith(yn) ? n.slice(yn.length) : null;
function Fe(n, e, t, a) {
  const s = ae(n, e, t, a), i = n.cards.find((g) => g.id === e), r = { kind: "set_task", card: { id: e }, duration: s.duration, lag: s.lag }, o = F(n, e, { lag: s.lag, duration: s.duration }), l = n.kind === "hiring-plan", d = i.dependsOn?.map((g) => n.cards.find((p) => p.id === g)?.label).filter(Boolean) ?? [], c = s.held === "length" ? l ? "Recruiting takes at least 1 week." : N(n) > 1 ? "A task takes at least a week." : "A task takes at least 1 day." : s.held === "longest" ? l ? "Recruiting takes at most 20 weeks." : "A task takes at most 60 days." : s.held === "ready" ? d.length ? i.label + " starts as early as it can: it waits on " + d.join(" and ") + "." : i.label + " starts on the plan’s first day." : void 0;
  return typeof o == "string" ? { values: s, edit: r, next: null, refusal: o, reason: c } : { values: s, edit: r, next: o, refusal: null, reason: c };
}
const Un = {
  day: (n, e, t = 0) => n.clock ? Gn(n.clock.origin, e, t) : null,
  iso: (n, e) => K(n.clock.origin, e),
  name: (n, e) => M(n, e),
  readyDay(n, e) {
    const t = n.cards.find((a) => a.id === e);
    return _(T(n)).cal(k(n).get(e).start - (t.lag ?? 0));
  },
  lagAt(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return _(T(n)).idx(t) - (k(n).get(e).start - (a.lag ?? 0));
  }
}, Rn = (n) => JSON.stringify(n.cards.map((e) => [mn(n, e.id, "lag"), mn(n, e.id, "duration")]));
function mn(n, e, t, a) {
  const s = N(n), i = n.kind === "hiring-plan", r = t === "duration" ? i ? 140 : 60 : i ? 728 : R(n) ? n.launch.day : 120, o = [];
  for (let l = t === "duration" ? s : 0; l <= r; l += s) {
    if (typeof F(n, e, { [t]: l, ...a && { laneId: a } }) == "string") continue;
    const d = o.at(-1);
    d && d[1] === l - s ? d[1] = l : o.push([l, l]);
  }
  return o;
}
function fe(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const e = n.launch?.day;
  if (typeof e != "number" || !Number.isInteger(e) || e < 5 || e > 120) return "Launch day is a whole day from 5 to 120.";
  const t = R(n);
  for (const i of n.cards) {
    if (!Number.isInteger(i.duration) || i.duration < 1 || i.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(i.lag ?? 0) || (i.lag ?? 0) < 0 && !i.override || Math.abs(i.lag ?? 0) > 120) return "A task waits 0 days or more, and no later than launch.";
    if ((i.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (i.dependsOn?.includes(i.id)) return "A task can't wait on itself.";
  }
  if (!n.clock && n.behaviour?.rules.some((i) => i.kind === "workdays" || i.kind === "blackout")) return "Working days and freezes need dates; this plan counts day numbers.";
  try {
    k(n);
  } catch (i) {
    return i.message;
  }
  const a = k(n);
  if ([...a.values()].some((i) => i.start < 0)) return "A task starts on the plan’s first day or later.";
  const s = Sn(n);
  if (t && s > D(n) && !n.cards.some((i) => i.override)) {
    const i = n.cards.find((r) => a.get(r.id).end === s);
    return n.clock ? C(n) : `${i.label} ends on day ${s}, after launch on day ${e}.`;
  }
  return null;
}
function Fn(n, e, t) {
  const a = n.cards.find((s) => s.id === e);
  return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
}
function ze(n, e, t) {
  return Fn(n, e, t) ? "" : "That move is not available.";
}
function ge(n, e, t) {
  const a = n.cards.find((i) => i.id === e), s = n.cards.find((i) => i.id === t);
  return !a || !s ? "That task is no longer on the plan." : a === s ? "A task can't wait on itself." : a.dependsOn?.includes(s.id) ? `${a.label} already waits on ${s.label}.` : se(n, a.id).has(s.id) ? `${s.label} already waits on ${a.label}, so ${a.label} can't wait on ${s.label}.` : (a.dependsOn?.length ?? 0) >= 3 ? `${a.label} already waits on 3 tasks.` : V(n, nn(n, e, t), e);
}
function pe(n, e) {
  const t = k(n), a = n.cards.filter((i) => i.laneId === e), s = a.filter((i) => t.get(i.id).critical).length;
  return `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${s} on the critical path`;
}
function dn(n, e) {
  const t = n.launch.day;
  if (e.field === "day") {
    const c = k(n), g = Sn(n), p = n.cards.find((f) => c.get(f.id).end === g), y = p ? c.get(p.id).to : 0;
    return R(n) ? {
      field: "day",
      min: Math.max(5, y),
      max: 120,
      reasons: { min: p ? n.clock ? `${p.label} ends ${M(n, y - 1)}.` : `${p.label} ends on day ${g}.` : void 0, max: "Launch day is at most day 120." }
    } : { field: "day", min: 5, max: 120, reasons: { min: "Launch day is day 5 at the earliest.", max: "Launch day is at most day 120." } };
  }
  const a = n.cards.find((c) => c.id === e.cardId), s = N(n), i = e.field, r = i === "duration" ? s : 0, o = i === "duration" ? 60 : R(n) ? t : 120;
  let l = a[i] ?? r;
  for (; l + s <= o && typeof F(n, a.id, { [i]: l + s }) != "string"; ) l += s;
  const d = l + s <= o ? F(n, a.id, { [i]: l + s }) : null;
  return {
    field: i,
    min: r,
    max: Math.max(r, l),
    reasons: {
      min: i === "duration" ? "A task takes at least 1 day." : `${a.label} starts as early as it can.`,
      max: typeof d == "string" ? d : i === "duration" ? "A task takes at most 60 days." : `Launch is ${M(n, t)}.`
    }
  };
}
function cn(n, e, t = n.launch?.day ?? e) {
  const a = Math.min(120, Math.max(5, Math.round(e))), s = T(n);
  if (!s?.workdays) return a;
  const i = (l, d) => {
    let c = l;
    for (; q(s.origin, c); ) c += d;
    return c;
  }, r = a < t ? -1 : 1, o = i(a, r);
  return o < 5 || o > 120 ? i(a, -r) : o;
}
function ke(n) {
  const { min: e } = dn(n, { field: "day" });
  return cn(n, e, -1 / 0);
}
function zn(n, e) {
  if (!R(n)) return null;
  const t = C(P(n, { field: "day" }, e));
  return t && t + " The earliest " + S(n) + " that fits is " + M(n, ke(n)) + ".";
}
function je(n, e) {
  const t = n.launch.day, a = cn(n, e, t), s = e > 120 ? "Launch day is at most day 120." : e < 5 ? "Launch day is day 5 at the earliest." : void 0, i = zn(n, a);
  if (i) return { day: a, next: null, refusal: i };
  const r = P(n, { field: "day" }, a), o = n.behaviour ? V(n, r) : null;
  return o ? { day: a, next: null, refusal: o } : { day: a, next: r, refusal: null, ...s && { reason: s } };
}
function wn(n, e) {
  const t = Math.round(e);
  if (N(n) > 1 || n.kind === "hiring-plan") return Math.round(t / 7) * 7;
  const a = T(n);
  if (!a?.workdays || !t) return t;
  let s = t;
  for (; q(a.origin, s); ) s += t > 0 ? 1 : -1;
  return s;
}
function un(n, e) {
  const t = K(n.clock.origin, e), a = k(n), s = { ...n, clock: { ...n.clock, origin: t }, cards: n.cards.map((r) => ({ ...r })) };
  n.launch && (s.launch = { ...n.launch, day: n.launch.day - e }), n.hiring && (s.hiring = {
    ...n.hiring,
    weeks: n.hiring.weeks - Math.round(e / 7),
    ...n.hiring.funding && { funding: { ...n.hiring.funding, day: n.hiring.funding.day - e } }
  });
  const i = _(T(s));
  for (const r of [...n.cards].sort((o, l) => a.get(o.id).start - a.get(l.id).start)) {
    const o = s.cards.find((g) => g.id === r.id), l = k(s).get(r.id).start - (o.lag ?? 0), d = a.get(r.id).from - e, c = Math.max(0, (d <= 0 ? 0 : i.idx(d)) - l);
    c ? o.lag = c : delete o.lag;
  }
  return s;
}
function vn(n, e) {
  const t = un(n, e);
  if (n.launch && t.launch.day > 120) return "A plan runs at most 120 days to " + S(n) + ".";
  if (n.launch && t.launch.day < 5) return "A plan runs at least 5 days to " + S(n) + ".";
  if (n.hiring) {
    if (t.hiring.weeks > 104) return "A hiring plan runs at most 104 weeks.";
    if (t.hiring.weeks < 13) return "A hiring plan runs at least 13 weeks.";
    if (t.hiring.funding && t.hiring.funding.day < 0) return "The round closes " + I(n.clock.origin, n.hiring.funding.day) + ", before that first day.";
  }
  return n.behaviour ? V(n, t) : C(t);
}
function ye(n, e) {
  if (!n.clock) return { by: 0, next: null, refusal: "A plan in day numbers starts on day 0. Give it dates to move its first day." };
  const t = wn(n, e);
  if (!t) return { by: t, next: n, refusal: null };
  const a = vn(n, t);
  if (!a) return { by: t, next: un(n, t), refusal: null };
  const s = t > 0 ? -1 : 1;
  for (let i = t + s; i !== 0; i += s)
    if (!(wn(n, i) !== i || vn(n, i)))
      return { by: t, next: null, refusal: a + " The " + (t > 0 ? "latest" : "earliest") + " first day that fits is " + I(n.clock.origin, i) + "." };
  return { by: t, next: null, refusal: a };
}
function me(n, e) {
  if (!Number.isInteger(e) || e < 13 || e > 104) return "A hiring plan runs 13 to 104 weeks.";
  const t = e * 7, a = k(n), s = n.cards.map((r) => ({ card: r, day: a.get(r.id).to })).filter((r) => r.day > t).sort((r, o) => o.day - r.day)[0];
  if (s) return s.card.label + " starts " + I(n.clock.origin, s.day) + ", after the plan’s last week.";
  const i = n.hiring?.funding;
  return i && i.day > t ? "The round closes " + I(n.clock.origin, i.day) + ", after the plan’s last week." : null;
}
function we(n) {
  return n.label + " · " + J(n.duration ?? 1);
}
function We() {
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
const ve = (n = "Slatebox") => ({ by: n, at: "2026-11-21T00:00:00.000Z", via: "preset" });
function hn(n) {
  return { version: 1, rev: 0, rules: n.map((e, t) => ({ id: "rule-" + (t + 1), on: !0, severity: "refuse", set: ve(), ...e })) };
}
function He(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Launch plan",
    launch: { day: 18 },
    clock: { origin: an(n) },
    lanes: [{ id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }, { id: "marketing", label: "Marketing" }],
    cards: [
      { id: "design", label: "Design", laneId: "product", duration: 4 },
      { id: "build", label: "Build", laneId: "engineering", duration: 6, dependsOn: ["design"] },
      { id: "qa", label: "QA", laneId: "engineering", duration: 2, dependsOn: ["build"] },
      { id: "copy", label: "Copy", laneId: "product", duration: 2 },
      { id: "post", label: "Launch post", laneId: "marketing", duration: 2, dependsOn: ["copy"], lag: 3 }
    ],
    behaviour: hn([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function Be(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Customer go-live",
    launch: { day: 25, name: "go-live" },
    clock: { origin: an(n) },
    lanes: [{ id: "us", label: "Us" }, { id: "customer", label: "Customer" }],
    cards: [
      { id: "kickoff", label: "Kickoff", laneId: "us", duration: 1 },
      { id: "data", label: "Send data", laneId: "customer", duration: 3, dependsOn: ["kickoff"] },
      { id: "configure", label: "Configure", laneId: "us", duration: 5, dependsOn: ["data"] },
      { id: "security", label: "Security review", laneId: "customer", duration: 4, dependsOn: ["kickoff"] },
      { id: "train", label: "Train admins", laneId: "us", duration: 2, dependsOn: ["configure"] },
      { id: "signoff", label: "Sign-off", laneId: "customer", duration: 1, dependsOn: ["train", "security"] }
    ],
    behaviour: hn([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function jn(n, e, t, a) {
  switch (e.kind) {
    case "set_task": {
      const s = t.card(e.card), i = { laneId: s.laneId, cardId: s.id };
      e.duration === void 0 && e.lag === void 0 && t.refuse("Say how many days " + w(s.label) + " takes, or waits.", { ...i, code: "invalid_edit" });
      const r = n.kind === "hiring-plan";
      if (e.override === !0) {
        const d = Ae(n, s, e, t);
        if (d) return d;
      }
      let o = n;
      for (const d of ["duration", "lag"]) {
        const c = e[d];
        if (c === void 0) continue;
        if (Number.isInteger(c) || t.refuse("A task's days are whole days.", i), d === "lag" && c < 0 && t.refuse(Nn(o, s.id, c), i), !n.behaviour && !r) {
          const y = dn(o, { cardId: s.id, field: d }), f = P(o, { cardId: s.id, field: d }, c), x = c > y.max && C(o) !== null && ln(o, f, s.id) === null;
          (c < y.min || c > y.max) && !x && t.refuse(c < y.min ? y.reasons.min : C(f, s.id) ?? y.reasons.max, { ...i, limits: y }), o = f;
          continue;
        }
        const [g, p] = d === "duration" ? r ? [7, 140] : [1, 60] : [0, r ? 728 : 120];
        (c < g || c > p) && t.refuse(d === "duration" ? r ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", i), o = P(o, { cardId: s.id, field: d }, c);
      }
      if (sn(n)) {
        const d = rn(n, o, /* @__PURE__ */ new Set([s.id]));
        typeof d == "string" && t.refuse(d, i), o = d;
      }
      o = Jn(n, o, s.id);
      const l = t.settle(o, s.laneId, s.id);
      return t.done(l, a(l.cards.find((d) => d.id === s.id), l), i);
    }
    case "set_plan_start": {
      n.clock || t.refuse("A plan in day numbers starts on day 0. Give it dates to move its first day."), v(e.start) || t.refuse("Say the first day as a date, such as " + K(n.clock.origin, 7) + ".");
      const s = ye(n, E(n.clock.origin, e.start));
      s.refusal && t.refuse(s.refusal);
      const i = t.settle(s.next), r = s.by !== E(n.clock.origin, e.start) ? " (" + I(n.clock.origin, E(n.clock.origin, e.start)) + (n.kind === "hiring-plan" ? " is not a whole week away" : " is a weekend") + ")." : ".";
      return t.done(i, "The plan now starts " + I(i.clock.origin, 0) + r);
    }
    case "set_plan_weeks": {
      n.kind !== "hiring-plan" && t.refuse("Only a hiring plan runs a number of weeks; move " + S(n) + " instead.");
      const s = me(n, e.weeks);
      s && t.refuse(s);
      const i = t.settle({ ...n, hiring: { ...n.hiring, weeks: e.weeks } });
      return t.done(i, "The plan now runs " + e.weeks + " weeks, to " + I(n.clock.origin, e.weeks * 7 - 1) + ".");
    }
    case "link_tasks":
    case "unlink_tasks": {
      const s = t.card(e.card), i = t.card(e.waitsOn), r = { laneId: s.laneId, cardId: s.id };
      if (e.kind === "unlink_tasks")
        return s.dependsOn?.includes(i.id) || t.refuse(w(s.label) + " doesn’t wait on " + w(i.label) + ".", r), t.done(t.settle(nn(n, s.id, i.id, !0), s.laneId, s.id), w(s.label) + " no longer waits on " + w(i.label) + ".", r);
      const o = ge(n, s.id, i.id);
      return o && t.refuse(o, r), t.done(t.settle(nn(n, s.id, i.id), s.laneId, s.id), w(s.label) + " now waits on " + w(i.label) + ".", r);
    }
  }
  return null;
}
function Wn(n, e) {
  const t = n.cards.find((a) => a.id === e);
  return t ? (t.lag ?? 0) < 0 ? !0 : n.kind === "launch-plan" && k(n).get(e).end > D(n) : !1;
}
const xe = (n) => {
  const { override: e, ...t } = n;
  return t;
};
function Ae(n, e, t, a) {
  const s = { laneId: e.laneId, cardId: e.id }, i = n.kind === "hiring-plan";
  let r = n, o = null;
  for (const f of ["duration", "lag"]) {
    const x = t[f];
    if (x === void 0) continue;
    Number.isInteger(x) || a.refuse("A task's days are whole days.", s);
    const [z, u] = f === "duration" ? i ? [7, 140] : [1, 60] : [-(i ? 728 : 120), i ? 728 : 120];
    (x < z || x > u) && a.refuse(f === "duration" ? i ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", s), f === "lag" && (o = Nn(r, e.id, x)), r = P(r, { cardId: e.id, field: f }, x);
  }
  k(r).get(e.id).start < 0 && a.refuse(e.label + " can’t start before the plan’s first day.", s);
  let l = r;
  sn(n) && (l = rn(n, r, /* @__PURE__ */ new Set([e.id])));
  const d = [...o ? [o] : [], ...typeof l == "string" ? [l] : ue(n, l, e.id)];
  if (o = [...new Set(d)].join(" ") || null, typeof l != "string" && (r = l), !o) return null;
  const c = Kn(e, o, a.who ?? { by: "an agent", at: (/* @__PURE__ */ new Date()).toISOString() }, { lag: e.lag ?? 0, duration: e.duration ?? 1 }), g = a.settle({ ...r, cards: r.cards.map((f) => f.id === e.id ? { ...xe(f), override: c } : f) }, e.laneId, e.id), p = g.cards.find((f) => f.id === e.id), y = k(g).get(e.id);
  return a.done(g, "Moved " + w(e.label) + " anyway: it " + (i ? "starts " + M(g, y.to) : "runs " + M(g, y.from) + " to " + M(g, y.to - 1)) + (p.duration !== e.duration ? ", " + J(p.duration) : "") + ". " + o, s);
}
const Me = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  rulebook: de,
  drags: Rn,
  fixed: $n,
  words: Un,
  pastRule: Wn,
  readCard(n, e, t) {
    if (e.duration = b(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (e.lag = b(n.lag, n.override !== void 0 ? -120 : 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e) {
    const t = In(n, "launch", "A launch plan needs a launch day.");
    if (e.launch = { day: b(t.day, 5, 120, "Launch day is a whole day from 5 to 120.") }, t.name !== void 0) {
      if (typeof t.name != "string" || !/^[a-z][a-z -]{1,23}$/i.test(t.name)) throw new Error("Name the line in a word or two, such as go-live.");
      e.launch.name = t.name.toLowerCase();
    }
    Hn(n, e);
  },
  validate: fe,
  planMove: Fn,
  caption: pe,
  cardText: (n, e) => e.label + " · " + e.duration + "d",
  noteText: (n, e) => we(e),
  fromNote(n, e, t) {
    const a = ee(e, t);
    return { label: a.label, duration: Math.min(60, Math.max(1, a.days ?? 2)) };
  },
  newCard: () => "task",
  landNote: Pn,
  renamed(n, e, t) {
    const a = te(t);
    return { label: a.label, edits: a.days !== void 0 ? [{ kind: "set_task", card: { id: e }, duration: a.days }] : [] };
  },
  edit(n, e, t) {
    switch (e.kind) {
      case "add_card": {
        const a = t.lane(e.lane), s = e.label?.trim() || "New task", i = { id: bn(n), label: s, laneId: a.id, duration: e.duration ?? 2 };
        e.lag && (i.lag = e.lag);
        const r = [...new Set((e.waitsOn ?? []).map((d) => t.card(d).id))];
        r.length && (i.dependsOn = r);
        const o = { ...n, cards: [...n.cards, i] }, l = n.behaviour ? null : C(o, i.id);
        return l && t.refuse(l, { laneId: a.id }), t.done(t.settle(o, a.id), "Added " + w(s) + " to " + w(a.label) + ".", { laneId: a.id, cardId: i.id });
      }
      case "set_launch_day": {
        const a = dn(n, { field: "day" }), s = Number.isInteger(e.day) && e.day >= 5 && e.day <= 120 ? cn(n, e.day) : e.day;
        (!Number.isInteger(s) || s < a.min || s > a.max) && t.refuse(s < a.min && zn(n, s) || (s < a.min ? a.reasons.min : a.reasons.max), { limits: a });
        const i = P(n, { field: "day" }, s), r = s !== e.day ? ": " + M(n, e.day) + " is a weekend, and weekends don’t count on this plan." : ".";
        return t.done(t.settle(i), Oe(S(n)) + " is now " + M(n, s) + r);
      }
    }
    return jn(n, e, t, (a) => w(a.label) + " now takes " + J(a.duration) + (a.lag ? " and waits " + J(a.lag) + "." : "."));
  }
}, Oe = (n) => n.charAt(0).toUpperCase() + n.slice(1);
function Hn(n, e) {
  if (n.clock === void 0) return;
  const t = n.clock?.origin;
  if (!v(t)) throw new Error("A plan starts on a real date, written as 2026-12-07.");
  e.clock = { origin: t };
}
On(Me);
const Te = Ln({ deadline: "at floor", snap: "unit", cascade: "onConflict", locked: "cards" }), xn = (n, e, t) => ({ type: "integer", min: e, max: t, about: n });
Cn({
  kinds: [
    {
      kind: "set_band_cost",
      summary: "Hiring plan: what a role band costs a month, loaded. Cost is per band, never per person.",
      intent: !1,
      fields: { band: { type: "text", max: 40, about: "The band, by id or name." }, monthly: xn("Whole currency units a month.", 1, 1e7) },
      boards: ["hiring-plan"],
      refusals: {}
    },
    {
      kind: "set_funding",
      summary: "Hiring plan: the day the funding round closes, in days from the plan’s first day.",
      intent: !1,
      fields: { day: xn("Days from the first day.", 0, 728) },
      boards: ["hiring-plan"],
      refusals: {}
    }
  ],
  boards: { set_task: ["hiring-plan"], link_tasks: ["hiring-plan"], unlink_tasks: ["hiring-plan"] },
  fields: { add_card: { band: { type: "text", max: 40, optional: !0, about: "Hiring plan: the role band (by id or name). Left out, the team’s first band." } } }
});
const Bn = (n, e) => k(n).get(e).to;
function be(n, e, t) {
  const a = n.cards.find((o) => o.id === e), i = k(n).get(e).start - (a.lag ?? 0), r = Math.max(0, t - (a.duration ?? 7) - i);
  return Math.ceil(r / 7) * 7;
}
function W(n, e) {
  const t = e.trim().toLowerCase();
  return n.bands.find((a) => a.id === e) ?? n.bands.find((a) => a.label.toLowerCase() === t) ?? n.bands.find((a) => new RegExp("\\b" + a.label.toLowerCase().replace(/[^a-z0-9 ]/g, "") + "\\b").test(t));
}
const Ie = ["salary", "pay", "wage", "cost", "amount", "monthly", "comp", "compensation"];
function Ce(n) {
  if (n.lanes.length > 4) return "A hiring plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 16) return "A hiring plan has 1 to 16 hires.";
  if (!n.clock) return "A hiring plan starts on a date.";
  for (const e of n.cards) {
    if (!n.hiring.bands.some((t) => t.id === e.band)) return w(e.label) + " needs a role band on this plan.";
    if ((e.dependsOn?.length ?? 0) > 3) return "A hire waits on up to 3 others.";
  }
  if (n.hiring.bands.some((e) => !n.lanes.some((t) => t.id === e.lane))) return "Each role band belongs to a team on the plan.";
  try {
    k(n);
  } catch (e) {
    return e.message;
  }
  for (const e of n.cards) {
    if ((e.lag ?? 0) < 0 && !e.override) return "A hire waits 0 days or more.";
    if (k(n).get(e.id).start < 0) return w(e.label) + " starts recruiting on the plan’s first day or later.";
  }
  return null;
}
const B = (n) => "Runway with these hires: " + En(en(n));
function Ye(n) {
  return {
    version: 1,
    kind: "hiring-plan",
    title: "Hiring plan",
    clock: { origin: an(n) },
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
    behaviour: hn([{ kind: "snap", unit: "week" }, { kind: "cascade", onConflict: "push" }])
  };
}
const Se = (n, e) => w(e.label) + " now starts " + I(n.clock.origin, Bn(n, e.id)) + ", after " + Math.round(e.duration / 7) + " weeks of recruiting. " + B(n) + ".", Ee = {
  kind: "hiring-plan",
  cards: [16, "A hiring plan holds up to 16 hires."],
  rulebook: Te,
  drags: Rn,
  fixed: $n,
  pastRule: Wn,
  words: { ...Un, startLag: be, band: (n, e) => W(n.hiring, e) },
  readCard(n, e, t) {
    if (Ie.some((a) => n[a] !== void 0)) throw new Error("Cost is per role band, never per person. Say what the band costs instead.");
    if (e.duration = b(n.duration, 7, 140, "Recruiting takes 1 to 20 weeks."), n.lag !== void 0 && n.lag !== 0 && (e.lag = b(n.lag, n.override !== void 0 ? -728 : 0, 728, "That is further out than the plan runs.")), typeof n.band != "string") throw new Error("Each hire is in a role band.");
    if (e.band = t.id(n.band), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A hire waits on a list of hires.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e, t) {
    const a = In(n, "hiring", "A hiring plan needs its cash, burn and role bands.");
    if (!Array.isArray(a.bands) || a.bands.length < 1 || a.bands.length > 8) throw new Error("A hiring plan has 1 to 8 role bands.");
    const s = a.bands.map((r) => {
      const o = r;
      if (typeof o.label != "string" || !o.label.trim() || o.label.length > 40 || /[<>\u0000-\u001f]/.test(o.label)) throw new Error("Name each role band in plain words.");
      return { id: t.id(o.id), label: o.label.trim(), monthly: b(o.monthly, 1, 1e7, "A band costs 1 to 10,000,000 a month."), lane: t.id(o.lane) };
    });
    if (new Set(s.map((r) => r.id)).size !== s.length) throw new Error("Duplicate role band.");
    const i = typeof a.currency == "string" && /^[$€£¥]$/.test(a.currency) ? a.currency : "$";
    if (e.hiring = {
      cash: b(a.cash, 0, 1e10, "Cash is 0 to 10 billion."),
      burn: b(a.burn, 0, 1e9, "Burn is 0 to a billion a month."),
      currency: i,
      weeks: b(a.weeks ?? 52, 13, 104, "A hiring plan runs 13 to 104 weeks."),
      bands: s
    }, a.funding !== void 0) {
      const r = a.funding;
      e.hiring.funding = { day: b(r?.day, 0, 728, "A round closes within two years."), amount: b(r?.amount, 1, 1e10, "A round raises 1 to 10 billion.") };
    }
    Hn(n, e);
  },
  validate: Ce,
  planMove(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
  },
  caption(n, e) {
    const t = n.cards.filter((a) => a.laneId === e);
    return t.length + (t.length === 1 ? " hire" : " hires");
  },
  cardText: (n, e) => e.label + " · " + I(n.clock.origin, Bn(n, e.id)).replace(/^\w+ /, ""),
  noteText: (n, e) => e.label,
  fromNote(n, e, t) {
    return { label: (e.replace(/\s+/g, " ").trim() || t).slice(0, 80), duration: 42 };
  },
  newCard: () => "hire",
  landNote: Pn,
  renamed: (n, e, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit(n, e, t) {
    const a = n.hiring;
    switch (e.kind) {
      case "add_card": {
        const s = t.lane(e.lane), i = e.label?.trim() || "New hire", r = e.band ? W(a, e.band) : a.bands.find((c) => c.lane === s.id) ?? W(a, i);
        r || t.refuse("Say which role band, such as " + a.bands.map((c) => w(c.label)).join(" or ") + ".", { laneId: s.id });
        const o = { id: bn(n), label: i, laneId: s.id, band: r.id, duration: e.duration ?? 42 };
        e.lag && (o.lag = e.lag);
        const l = [...new Set((e.waitsOn ?? []).map((c) => t.card(c).id))];
        l.length && (o.dependsOn = l);
        const d = t.settle({ ...n, cards: [...n.cards, o] }, s.id);
        return t.done(d, "Added " + w(i) + " to " + w(s.label) + ". " + B(d) + ".", { laneId: s.id, cardId: o.id });
      }
      case "set_band_cost": {
        const s = W(a, e.band);
        s || t.refuse("There is no role band " + w(e.band) + ". The bands are " + a.bands.map((r) => w(r.label)).join(", ") + ".", { code: "unknown_reference" });
        const i = t.settle({ ...n, hiring: { ...a, bands: a.bands.map((r) => r === s ? { ...r, monthly: e.monthly } : r) } });
        return t.done(i, w(s.label) + " now costs " + ne(e.monthly, a.currency) + " a month. " + B(i) + ".");
      }
      case "set_funding": {
        a.funding || t.refuse("This plan has no funding round.");
        const s = t.settle({ ...n, hiring: { ...a, funding: { ...a.funding, day: e.day } } });
        return t.done(s, "The round now closes " + I(n.clock.origin, e.day) + ". " + B(s) + ".");
      }
    }
    return jn(n, e, t, (s, i) => Se(i, s));
  }
};
On(Ee);
export {
  Le as a,
  ee as b,
  W as bandOf,
  $e as brokenWaits,
  Ne as c,
  sn as cascadeStops,
  _n as checkTime,
  T as clockOf,
  b as d,
  I as dateName,
  Gn as dayFromWords,
  _ as dayMap,
  M as dayWords,
  se as downstreamTasks,
  Fe as dragTaskEdge,
  De as e,
  ke as earliestLaunch,
  ae as edgeValues,
  Cn as extendWorkshopEdits,
  Tn as f,
  J as g,
  Be as goLiveSample,
  be as hireLagFor,
  Bn as hireStarts,
  Ee as hiringPlanRules,
  Ye as hiringPlanSample,
  rn as holdOthers,
  K as isoAt,
  v as isoTime,
  Pn as landPlanNote,
  cn as launchDayOn,
  Sn as launchFinish,
  R as launchHard,
  D as launchIndex,
  ge as launchLinkRefusal,
  C as launchOverrun,
  pe as launchPlanCaption,
  dn as launchPlanLimits,
  ze as launchPlanRefusal,
  Me as launchPlanRules,
  He as launchPlanSample,
  we as launchTaskText,
  zn as launchTooEarly,
  mn as legalRuns,
  S as lineWord,
  ne as m,
  tn as monthNames,
  je as moveLaunch,
  ye as movePlanStart,
  bn as n,
  an as nextMonday,
  In as o,
  E as offsetOf,
  Ue as pastTheLine,
  Rn as planDrags,
  jn as planEdit,
  $n as planFixed,
  Fn as planLaunchPlanMove,
  Wn as planPastRule,
  V as planProblem,
  ue as planProblems,
  wn as planStartBy,
  me as planWeeksProblem,
  Un as planWords,
  hn as presetRules,
  te as r,
  Hn as readClock,
  H as runwayCap,
  B as runwayHeader,
  en as runwayMonths,
  En as runwayWords,
  We as sampleLaunchPlan,
  k as scheduleLaunch,
  Y as shortDate,
  N as snapStep,
  he as startHandle,
  Re as startHandleCard,
  Ln as timeFamily,
  oe as timeProblems,
  Pe as timeRuleKindIds,
  U as timeSentence,
  F as tryTask,
  Ce as validateHiringPlan,
  fe as validateLaunchPlan,
  Nn as waitsRefusal,
  Vn as weekdayAt,
  q as weekendAt,
  nn as withLink,
  un as withPlanStart,
  P as withTaskValue
};
