import { workshopEditKinds as z, workshopRuleSchema as P, registerWorkshopRules as en, said as p } from "./workshop-model.mjs";
const v = 864e5, On = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], Y = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function m(n) {
  if (typeof n != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(n)) return NaN;
  const e = Date.UTC(+n.slice(0, 4), +n.slice(5, 7) - 1, +n.slice(8, 10));
  return new Date(e).toISOString().slice(0, 10) === n ? e : NaN;
}
const tn = (n, e) => new Date(m(n) + Math.round(e) * v).toISOString().slice(0, 10), R = (n, e) => Math.round((m(e) - m(n)) / v), Cn = (n, e) => new Date(m(n) + Math.floor(e) * v).getUTCDay(), an = (n, e) => {
  const t = Cn(n, e);
  return t === 0 || t === 6;
};
function $(n, e) {
  const t = new Date(m(n) + Math.floor(e) * v);
  return On[t.getUTCDay()] + " " + t.getUTCDate() + " " + Y[t.getUTCMonth()];
}
function L(n) {
  const e = new Date(m(n));
  return e.getUTCDate() + " " + Y[e.getUTCMonth()];
}
function J(n) {
  const e = m(n) || Date.UTC((/* @__PURE__ */ new Date()).getUTCFullYear(), (/* @__PURE__ */ new Date()).getUTCMonth(), (/* @__PURE__ */ new Date()).getUTCDate()), t = new Date(e).toISOString().slice(0, 10);
  return tn(t, (8 - new Date(e).getUTCDay()) % 7);
}
function Mn(n, e, t = 0) {
  const a = e.trim().replace(/[,.]/g, " ").replace(/\s+/g, " ").toLowerCase();
  if (m(a)) return R(n, a);
  const s = (d) => Y.findIndex((h) => d.startsWith(h.toLowerCase())), i = new Date(m(n) + t * v);
  let o, r, l;
  if ((o = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+([a-z]{3,9})$/.exec(a)) && s(o[2]) >= 0)
    r = +o[1], l = s(o[2]);
  else if ((o = /^(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+)?([a-z]{3,9})\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) && s(o[1]) >= 0)
    r = +o[2], l = s(o[1]);
  else if ((o = /^(?:early\s+)?([a-z]{3,9})$/.exec(a)) && s(o[1]) >= 0)
    r = 1, l = s(o[1]);
  else if (o = /^(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*\s+(\d{1,2})(?:st|nd|rd|th)?$/.exec(a)) {
    for (let d = 0; d < 13; d++) {
      const h = Date.UTC(i.getUTCFullYear(), i.getUTCMonth() + d, +o[1]);
      if (new Date(h).getUTCDate() === +o[1] && h >= i.getTime()) return Math.round((h - m(n)) / v);
    }
    return null;
  } else return null;
  for (const d of [i.getUTCFullYear(), i.getUTCFullYear() + 1]) {
    const h = Date.UTC(d, l, r);
    if (new Date(h).getUTCDate() !== r) return null;
    if (h >= i.getTime() || d > i.getUTCFullYear()) return Math.round((h - m(n)) / v);
  }
  return null;
}
const Tn = { cal: (n) => n, idx: (n) => n }, Q = /* @__PURE__ */ new Map();
function sn(n) {
  if (!n?.workdays) return Tn;
  const e = Q.get(n.origin);
  if (e) return e;
  const t = [];
  for (let s = 0; t.length < 800; s++) an(n.origin, s) || t.push(s);
  const a = {
    cal(s) {
      const i = Math.floor(s), o = s - i;
      return i < 0 ? i : (t[Math.min(i, t.length - 1)] ?? i) + o;
    },
    idx(s) {
      let i = 0, o = t.length;
      for (; i < o; ) {
        const r = i + o >> 1;
        t[r] < s ? i = r + 1 : o = r;
      }
      return i;
    }
  };
  return Q.set(n.origin, a), a;
}
function C(n) {
  if (n.clock)
    return { origin: n.clock.origin, workdays: !!n.behaviour?.rules.some((e) => e.on && e.kind === "workdays") };
}
const Sn = /(?:^|\s)(\d{1,3}(?:[.,]\d+)?)\s*(d|days?|w|wks?|weeks?)\b\.?/i, Dn = /(?:^|\s)([$€£¥])?\s?(\d+(?:[.,]\d+)?)\s*([kKmM])?(?=\s|$|[.,;])/g;
function on(n) {
  let e = String(n ?? "").replace(/\s+/g, " ").trim();
  const t = { label: e }, a = Sn.exec(e);
  if (a) {
    const o = Number(a[1].replace(",", ".")), r = /^w/i.test(a[2]);
    t.days = Math.max(1, Math.ceil(r ? o * 5 : o)), e = e.slice(0, a.index) + " " + e.slice(a.index + a[0].length);
  }
  const s = [...e.matchAll(Dn)].filter((o) => o[1] || o[3] || Number(o[2].replace(",", "")) >= 1e3), i = s.find((o) => o[1] || o[3]) ?? s[0];
  if (i) {
    const o = /k/i.test(i[3] ?? "") ? 1e3 : /m/i.test(i[3] ?? "") ? 1e6 : 1;
    t.amount = Math.round(Number(i[2].replace(",", i[3] ? "." : "")) * o), i[1] && (t.currency = i[1]), e = e.slice(0, i.index) + " " + e.slice(i.index + i[0].length);
  }
  return t.label = e.replace(/\s+/g, " ").replace(/\s*[·,;:-]\s*$/, "").trim(), t;
}
function En(n, e = "$") {
  const t = n < 0 ? "-" : "", a = Math.abs(n), s = (o, r) => (Math.round(o * 10) / 10).toString() + r, i = a >= 1e6 ? s(a / 1e6, "M") : a >= 1e3 ? s(a / 1e3, "k") : String(Math.round(a));
  return t + e + i;
}
const j = (n) => n + (n === 1 ? " day" : " days"), ne = { field: "amount", min: 0, max: 1e9, reasons: { min: "An amount is not below zero.", max: "An amount is at most 1,000,000,000." } };
function $n(n) {
  const e = on(n);
  return e.label ? e : "A card needs some words as well as a number.";
}
function Ln(n) {
  const e = on(n);
  return e.label ? e : { label: n };
}
function rn(n) {
  const e = new Set([...n.lanes, ...n.cards].map((a) => a.id));
  let t = 1;
  for (; e.has("card-" + t); ) t++;
  return "card-" + t;
}
function w(n, e, t, a, s = !1) {
  if (typeof n != "number" || !Number.isFinite(n) || n < e || n > t || !s && !Number.isInteger(n)) throw new Error(a);
  return n;
}
function ee(n) {
  if (typeof n != "string" || !/^(?:[$€£¥₹]|[A-Z]{3} )$/.test(n)) throw new Error("Use a currency sign such as $ or €.");
  return n;
}
function ln(n, e, t) {
  const a = n[e];
  if (!a || typeof a != "object" || Array.isArray(a)) throw new Error(t);
  return a;
}
function dn(n) {
  const e = (t) => z.find((a) => a.kind === t);
  for (const t of n.kinds ?? []) z.some((a) => a.kind === t.kind) || z.push(t);
  for (const [t, a] of Object.entries(n.boards ?? {})) {
    const s = e(t);
    for (const i of a) s.boards.includes(i) || (s.boards.push(i), delete s.refusals[i]);
  }
  for (const [t, a] of Object.entries(n.fields ?? {})) Object.assign(e(t).fields, a);
  n.rules && (P.kinds.push(...n.rules.kinds.filter((t) => !P.kinds.includes(t))), Object.assign(P.keys, n.rules.keys));
}
function k(n) {
  const e = new Map(n.cards.map((d) => [d.id, d])), t = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Set(), s = (d) => {
    const h = t.get(d.id);
    if (h) return h;
    if (a.has(d.id)) throw new Error("Tasks can't wait on each other in a circle.");
    a.add(d.id);
    let c = 0;
    for (const f of d.dependsOn ?? []) {
      const g = e.get(f);
      if (!g) throw new Error("A task waits on a task that is not on the plan.");
      c = Math.max(c, s(g).end);
    }
    c += d.lag ?? 0;
    const u = { start: c, end: c + (d.duration ?? 1), slack: 0, critical: !1, from: 0, to: 0 };
    return t.set(d.id, u), a.delete(d.id), u;
  };
  n.cards.forEach(s);
  const i = Math.max(0, ...[...t.values()].map((d) => d.end)), o = /* @__PURE__ */ new Map(), r = (d) => {
    const h = o.get(d.id);
    if (h !== void 0) return h;
    let c = i;
    for (const u of n.cards)
      u.dependsOn?.includes(d.id) && (c = Math.min(c, r(u) - (u.duration ?? 1) - (u.lag ?? 0)));
    return o.set(d.id, c), c;
  }, l = sn(C(n));
  for (const d of n.cards) {
    const h = t.get(d.id);
    h.slack = r(d) - h.end, h.critical = h.slack === 0, h.from = l.cal(h.start), h.to = l.cal(h.end - 1) + 1;
  }
  return t;
}
function cn(n) {
  return Math.max(0, ...[...k(n).values()].map((e) => e.end));
}
const M = (n) => sn(C(n)).idx(n.launch?.day ?? 0), x = (n) => n.launch?.name ?? "launch", b = (n, e) => n.clock ? $(n.clock.origin, e) : "day " + e;
function _(n) {
  return !n.behaviour || n.behaviour.rules.some((e) => e.on && e.kind === "deadline" && e.at === "launch" && e.severity === "refuse");
}
const un = (n) => !!n.behaviour?.rules.some((e) => e.on && e.kind === "cascade" && e.onConflict === "stop");
function hn(n) {
  const e = n.behaviour?.rules.find((t) => t.on && t.kind === "snap");
  return e && e.kind === "snap" && e.unit === "week" ? C(n)?.workdays ? 5 : 7 : 1;
}
function _n(n, e) {
  const t = /* @__PURE__ */ new Set(), a = (s) => {
    for (const i of n.cards) i.dependsOn?.includes(s) && !t.has(i.id) && (t.add(i.id), a(i.id));
  };
  return a(e), t;
}
function I(n, e) {
  const t = n.launch?.day ?? 0, a = M(n), s = k(n), i = e ? s.get(e) : void 0, o = i && i.end > a ? { label: "That", t: i } : n.cards.map((r) => ({ label: r.label, t: s.get(r.id) })).filter((r) => r.t.end > a).sort((r, l) => l.t.end - r.t.end)[0];
  return o ? n.clock ? o.label + " would run until " + b(n, o.t.to - 1) + "; " + x(n) + " is " + b(n, t) + "." : (o.label === "That" ? "That ends on day " : "That pushes " + o.label + " to day ") + o.t.end + ", after launch on day " + t + "." : null;
}
function N(n, e, t) {
  return e.field === "day" ? { ...n, launch: { ...n.launch, day: t } } : { ...n, cards: n.cards.map((a) => a.id === e.cardId ? { ...a, [e.field]: t } : a) };
}
function W(n, e, t, a = !1) {
  const s = k(n);
  return { ...n, cards: n.cards.map((i) => {
    if (i.id !== e) return i;
    const o = a ? (i.dependsOn ?? []).filter((d) => d !== t) : [...i.dependsOn ?? [], t], r = Math.max(0, ...o.map((d) => s.get(d)?.end ?? 0)), l = { ...i, dependsOn: o, lag: Math.max(0, s.get(i.id).start - r) };
    return o.length || delete l.dependsOn, l.lag || delete l.lag, l;
  }) };
}
function fn(n, e, t) {
  const a = k(n), s = new Map(e.cards.map((l) => [l.id, { ...l }])), i = /* @__PURE__ */ new Map();
  let o = null;
  const r = (l) => {
    const d = i.get(l.id);
    if (d !== void 0) return d;
    let h = 0, c;
    for (const g of l.dependsOn ?? []) {
      const y = r(s.get(g));
      y > h && (h = y, c = s.get(g));
    }
    const u = a.get(l.id);
    if (u && !t.has(l.id)) {
      const g = u.start - h;
      g < -1e-9 && !o && (o = c.label + " would end after " + l.label + " starts on " + b(n, u.from) + ". " + l.label + " waits on it, and a slip stops at the tasks that wait on it."), g > 1e-9 ? l.lag = g : delete l.lag;
    }
    const f = h + (l.lag ?? 0) + (l.duration ?? 1);
    return i.set(l.id, f), f;
  };
  for (const l of s.values()) r(l);
  return o ?? { ...e, cards: e.cards.map((l) => s.get(l.id)) };
}
const D = 120;
function B(n) {
  const e = n.hiring;
  if (!e) return D;
  const t = k(n), a = n.cards.map((i) => ({ day: t.get(i.id).to, monthly: e.bands.find((o) => o.id === i.band)?.monthly ?? 0 }));
  let s = e.cash;
  for (let i = 0; i < D * 52 / 12; i++) {
    const o = i * 7;
    e.funding && e.funding.day >= o && e.funding.day < o + 7 && (s += e.funding.amount);
    const r = (e.burn + a.reduce((l, d) => l + (d.day <= o ? d.monthly : 0), 0)) * 12 / 52;
    if (s < r) return Math.floor((i + Math.max(0, s) / r) * 12 / 52 * 10) / 10;
    s -= r;
  }
  return D;
}
const gn = (n) => n >= D ? "10 years or more" : n + (n === 1 ? " month" : " months"), F = (n) => n.charAt(0).toUpperCase() + n.slice(1), Nn = (n) => n.length > 1 ? n.slice(0, -1).join(", ") + " and " + n.at(-1) : n[0] ?? "", K = (n, e) => n.lanes.find((t) => t.id === e)?.label ?? e ?? "", Z = (n) => n.kind === "hiring-plan" ? "Hires" : "Tasks";
function O(n, e) {
  const t = n.severity === "warn";
  switch (n.kind) {
    case "deadline":
      return n.at === "runway" ? t ? "Runway under " + n.floor + " months is flagged." : "Runway stays above " + n.floor + " months." : t ? F(x(e)) + " is a soft line: a task may slip past it, shown in red." : F(x(e)) + " is a hard line: every task ends by " + b(e, e.launch?.day ?? 0) + ".";
    case "overlap": {
      const a = n.lane ? K(e, n.lane) : "a team";
      return t ? "Overlapping tasks in " + a + " are flagged." : n.lane ? a + "’s tasks can’t overlap." : "Tasks in a team can’t overlap.";
    }
    case "snap":
      return Z(e) + " snap to whole " + n.unit + "s.";
    case "workdays":
      return "Days are working days: weekends don’t count.";
    case "blackout": {
      const a = L(n.start) + " – " + L(n.end);
      return t ? F(n.label) + ", " + a + ", is flagged." : "Nothing ships in " + n.label + ", " + a + ".";
    }
    case "cascade":
      return "A slip " + (n.onConflict === "stop" ? "stops at" : "pushes") + " the " + Z(e).toLowerCase() + " that wait on it.";
    case "locked": {
      const a = n.cards.map((s) => e.cards.find((i) => i.id === s)?.label ?? s);
      return Nn(a) + (a.length > 1 ? " are" : " is") + " locked.";
    }
  }
  return "";
}
const te = ["deadline", "overlap", "snap", "workdays", "blackout", "cascade", "locked"], V = ["locked", "cascade", "blackout", "overlap", "snap", "deadline"], Un = (n, e) => (n.dependsOn ?? []).join() === (e.dependsOn ?? []).join();
function pn(n, e) {
  const t = (n.behaviour?.rules ?? []).filter((c) => c.on).sort((c, u) => V.indexOf(c.kind) - V.indexOf(u.kind)), a = [];
  if (!t.length) return { ok: !0, warnings: a };
  const s = k(n), i = k(e), o = new Map(n.cards.map((c) => [c.id, c])), r = e.cards.filter((c) => {
    const u = o.get(c.id);
    return !u || (u.lag ?? 0) !== (c.lag ?? 0) || u.duration !== c.duration || u.laneId !== c.laneId || !Un(u, c);
  }), l = e.cards.filter((c) => {
    const u = i.get(c.id), f = s.get(c.id);
    return !f || u.from !== f.from || u.to !== f.to || o.get(c.id).laneId !== c.laneId;
  }), d = r[0] ?? l[0], h = (c) => {
    switch (c.kind) {
      case "locked":
        for (const u of l) if (c.cards.includes(u.id) && s.has(u.id)) return u.label + " is locked: it stays on " + b(n, s.get(u.id).from) + ".";
        return null;
      case "cascade": {
        if (c.onConflict !== "stop") return null;
        const u = l.find((f) => s.has(f.id) && !r.includes(f));
        return u ? "That would push " + u.label + ", which waits on it. " + O(c, n) : null;
      }
      case "blackout": {
        const u = C(n);
        if (!u) return null;
        const f = R(u.origin, c.start), g = R(u.origin, c.end), y = l.find((T) => {
          const A = i.get(T.id);
          for (let U = Math.max(Math.floor(A.from), f); U < Math.min(Math.ceil(A.to), g + 1); U++) if (!u.workdays || !an(u.origin, U)) return !0;
          return !1;
        });
        return y ? y.label + " would run into " + c.label + " (" + L(c.start) + " – " + L(c.end) + ")." : null;
      }
      case "overlap": {
        const u = (f, g) => f.from < g.to && g.from < f.to;
        for (const f of l) for (const g of e.cards)
          if (!(f === g || f.laneId !== g.laneId || c.lane && f.laneId !== c.lane || !u(i.get(f.id), i.get(g.id))))
            return f.label + " and " + g.label + " would overlap in " + K(e, f.laneId) + ". " + O(c, n);
        return null;
      }
      case "snap": {
        if (c.unit !== "week") return null;
        const u = C(n)?.workdays ? 5 : 7;
        return r.find((g) => {
          const y = o.get(g.id);
          return (g.lag ?? 0) % u && (!y || (y.lag ?? 0) !== (g.lag ?? 0)) || (g.duration ?? 0) % u && (!y || y.duration !== g.duration);
        }) ? O(c, n) : null;
      }
      case "deadline": {
        if (c.at === "runway") {
          const y = B(e);
          return y < c.floor && y < B(n) ? "That takes runway to " + gn(y) + ". " + O(c, n) : null;
        }
        const u = M(e), f = M(n);
        return e.cards.some((y) => {
          const T = i.get(y.id), A = s.get(y.id);
          return T.end > u && (!A || A.end <= f || T.end > A.end || u < f);
        }) ? I(e, d?.id) : null;
      }
    }
    return null;
  };
  for (const c of t) {
    const u = h(c);
    if (u) {
      if (c.severity === "warn") {
        a.push(u);
        continue;
      }
      return { refused: { sentence: u, ruleId: c.id, set: c.set, cardId: d?.id ?? "", laneId: d?.laneId ?? "" } };
    }
  }
  return { ok: !0, warnings: a };
}
const zn = (n) => {
  if (typeof n != "string" || !n.trim() || n.trim().length > 40 || /[<>\u0000-\u001f]/.test(n)) throw new Error("Name the freeze in plain words, up to 40 letters.");
  return n.trim();
};
function mn(n) {
  return {
    keys: n,
    read(e, t, a, s) {
      const i = Object.keys(e).find((r) => !["id", "on", "severity", "set", "kind", ...n[e.kind].split(" ").filter(Boolean)].includes(r));
      if (i) throw new Error("A " + e.kind + " rule does not take " + i + ".");
      const o = { ...t, kind: e.kind };
      switch (e.kind) {
        case "deadline":
          if (e.at !== (a.kind === "hiring-plan" ? "runway" : "launch")) throw new Error(a.kind === "hiring-plan" ? "A hiring plan’s line is its runway." : "A launch plan’s line is launch day.");
          if (o.at = e.at, e.at === "runway") {
            if (typeof e.floor != "number" || !(e.floor >= 1 && e.floor <= 60) || Math.round(e.floor * 10) !== e.floor * 10) throw new Error("A runway floor is 1 to 60 months.");
            o.floor = e.floor;
          }
          break;
        case "overlap":
          e.lane !== void 0 && (o.lane = s(e.lane));
          break;
        case "snap":
          if (e.unit !== "day" && e.unit !== "week") throw new Error("A plan snaps to days or weeks.");
          o.unit = e.unit;
          break;
        case "blackout": {
          if (!m(e.start) || !m(e.end) || m(e.end) < m(e.start)) throw new Error("A freeze runs from one date to the same or a later one.");
          if (m(e.end) - m(e.start) > 92 * 864e5) throw new Error("A freeze lasts up to 3 months.");
          Object.assign(o, { start: e.start, end: e.end, label: zn(e.label) });
          break;
        }
        case "cascade":
          if (e.onConflict !== "push" && e.onConflict !== "stop") throw new Error("A slip pushes the tasks that wait on it, or stops at them.");
          o.onConflict = e.onConflict;
          break;
        case "locked": {
          if (!Array.isArray(e.cards) || !e.cards.length || e.cards.length > 6) throw new Error("Say which tasks are locked.");
          if (e.cards.some((r) => !a.cards.some((l) => l.id === r))) throw new Error("A locked task stays on the plan. Unlock it first.");
          o.cards = [...new Set(e.cards)];
          break;
        }
      }
      return o;
    },
    sentence: O,
    contradiction(e, t) {
      const a = /* @__PURE__ */ new Set();
      let s = 0;
      for (const i of e.rules) {
        const o = i.kind === "overlap" ? "overlap:" + (i.lane ?? "") : i.kind === "blackout" ? "blackout:" + s++ : i.kind === "locked" ? "" : i.kind;
        if (o && a.has(o)) return "There is already a " + (i.kind === "deadline" ? x(t) + " line" : i.kind + " rule") + ". Change that one instead.";
        if (a.add(o), i.kind === "locked") for (const r of i.cards) {
          if (a.has("locked:" + r)) return K({ ...t, lanes: t.cards.map((l) => ({ id: l.id, label: l.label })) }, r) + " is already locked.";
          a.add("locked:" + r);
        }
      }
      return s > 6 ? "A plan has up to 6 freezes." : null;
    },
    check: pn,
    builtIn: (e) => e.kind === "launch-plan" && !e.behaviour ? ["Every task ends by " + x(e) + ".", "A slip pushes the tasks that wait on it."] : []
  };
}
function ae(n) {
  if (n.kind !== "launch-plan") return /* @__PURE__ */ new Set();
  const e = M(n);
  return new Set([...k(n)].filter(([, t]) => t.end > e).map(([t]) => t));
}
const Pn = mn({ deadline: "at", overlap: "lane", snap: "unit", workdays: "", blackout: "start end label", cascade: "onConflict", locked: "cards" }), Fn = { anyOf: [{ type: "string", minLength: 1, maxLength: 200 }, { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }] }, G = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" };
dn({
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
      start: G,
      end: G,
      label: { type: "string", minLength: 1, maxLength: 40 },
      onConflict: { enum: ["push", "stop"] },
      cards: { type: "array", items: Fn, minItems: 1, maxItems: 6 }
    }
  }
});
function yn(n, e, t) {
  if (!n.behaviour) return n.kind === "launch-plan" ? I(e, t) : null;
  const a = pn(n, e);
  return "refused" in a ? a.refused.sentence : null;
}
function H(n, e, t) {
  let a = { ...n, cards: n.cards.map((s) => {
    if (s.id !== e) return s;
    const i = { ...s, ...t };
    return i.lag || delete i.lag, i;
  }) };
  if (un(n)) {
    const s = fn(n, a, /* @__PURE__ */ new Set([e]));
    if (typeof s == "string") return s;
    a = s;
  }
  return yn(n, a, e) ?? a;
}
const kn = {
  day: (n, e, t = 0) => n.clock ? Mn(n.clock.origin, e, t) : null,
  iso: (n, e) => tn(n.clock.origin, e),
  name: (n, e) => b(n, e)
}, wn = (n) => JSON.stringify(n.cards.map((e) => [X(n, e.id, "lag"), X(n, e.id, "duration")]));
function X(n, e, t, a) {
  const s = hn(n), i = n.kind === "hiring-plan", o = t === "duration" ? i ? 140 : 60 : i ? 728 : _(n) ? n.launch.day : 120, r = [];
  for (let l = t === "duration" ? s : 0; l <= o; l += s) {
    if (typeof H(n, e, { [t]: l, ...a && { laneId: a } }) == "string") continue;
    const d = r.at(-1);
    d && d[1] === l - s ? d[1] = l : r.push([l, l]);
  }
  return r;
}
function Rn(n) {
  if (n.lanes.length > 4) return "A launch plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 12) return "A launch plan has 1 to 12 tasks.";
  const e = n.launch?.day;
  if (typeof e != "number" || !Number.isInteger(e) || e < 5 || e > 120) return "Launch day is a whole day from 5 to 120.";
  const t = _(n);
  for (const i of n.cards) {
    if (!Number.isInteger(i.duration) || i.duration < 1 || i.duration > 60) return "A task takes 1 to 60 days.";
    if (!Number.isInteger(i.lag ?? 0) || (i.lag ?? 0) < 0 || (i.lag ?? 0) > (t ? e : 120)) return "A task waits 0 days or more, and no later than launch.";
    if ((i.dependsOn?.length ?? 0) > 3) return "A task waits on up to 3 others.";
    if (i.dependsOn?.includes(i.id)) return "A task can't wait on itself.";
  }
  if (!n.clock && n.behaviour?.rules.some((i) => i.kind === "workdays" || i.kind === "blackout")) return "Working days and freezes need dates; this plan counts day numbers.";
  try {
    k(n);
  } catch (i) {
    return i.message;
  }
  const a = k(n), s = cn(n);
  if (t && s > M(n)) {
    const i = n.cards.find((o) => a.get(o.id).end === s);
    return n.clock ? I(n) : `${i.label} ends on day ${s}, after launch on day ${e}.`;
  }
  return null;
}
function bn(n, e, t) {
  const a = n.cards.find((s) => s.id === e);
  return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
}
function se(n, e, t) {
  return bn(n, e, t) ? "" : "That move is not available.";
}
function jn(n, e, t) {
  const a = n.cards.find((i) => i.id === e), s = n.cards.find((i) => i.id === t);
  return !a || !s ? "That task is no longer on the plan." : a === s ? "A task can't wait on itself." : a.dependsOn?.includes(s.id) ? `${a.label} already waits on ${s.label}.` : _n(n, a.id).has(s.id) ? `${s.label} already waits on ${a.label}, so ${a.label} can't wait on ${s.label}.` : (a.dependsOn?.length ?? 0) >= 3 ? `${a.label} already waits on 3 tasks.` : yn(n, W(n, e, t), e);
}
function Wn(n, e) {
  const t = k(n), a = n.cards.filter((i) => i.laneId === e), s = a.filter((i) => t.get(i.id).critical).length;
  return `${a.length} ${a.length === 1 ? "task" : "tasks"} · ${s} on the critical path`;
}
function vn(n, e) {
  const t = n.launch.day;
  if (e.field === "day") {
    const h = k(n), c = cn(n), u = n.cards.find((g) => h.get(g.id).end === c), f = u ? h.get(u.id).to : 0;
    return _(n) ? {
      field: "day",
      min: Math.max(5, f),
      max: 120,
      reasons: { min: u ? n.clock ? `${u.label} ends ${b(n, f - 1)}.` : `${u.label} ends on day ${c}.` : void 0, max: "Launch day is at most day 120." }
    } : { field: "day", min: 5, max: 120, reasons: { min: "Launch day is day 5 at the earliest.", max: "Launch day is at most day 120." } };
  }
  const a = n.cards.find((h) => h.id === e.cardId), s = hn(n), i = e.field, o = i === "duration" ? s : 0, r = i === "duration" ? 60 : _(n) ? t : 120;
  let l = a[i] ?? o;
  for (; l + s <= r && typeof H(n, a.id, { [i]: l + s }) != "string"; ) l += s;
  const d = l + s <= r ? H(n, a.id, { [i]: l + s }) : null;
  return {
    field: i,
    min: o,
    max: Math.max(o, l),
    reasons: {
      min: i === "duration" ? "A task takes at least 1 day." : `${a.label} starts as early as it can.`,
      max: typeof d == "string" ? d : i === "duration" ? "A task takes at most 60 days." : `Launch is ${b(n, t)}.`
    }
  };
}
function Bn(n) {
  return n.label + " · " + j(n.duration ?? 1);
}
function ie() {
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
const Hn = (n = "Slatebox") => ({ by: n, at: "2026-11-21T00:00:00.000Z", via: "preset" });
function q(n) {
  return { version: 1, rev: 0, rules: n.map((e, t) => ({ id: "rule-" + (t + 1), on: !0, severity: "refuse", set: Hn(), ...e })) };
}
function oe(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Launch plan",
    launch: { day: 18 },
    clock: { origin: J(n) },
    lanes: [{ id: "product", label: "Product" }, { id: "engineering", label: "Engineering" }, { id: "marketing", label: "Marketing" }],
    cards: [
      { id: "design", label: "Design", laneId: "product", duration: 4 },
      { id: "build", label: "Build", laneId: "engineering", duration: 6, dependsOn: ["design"] },
      { id: "qa", label: "QA", laneId: "engineering", duration: 2, dependsOn: ["build"] },
      { id: "copy", label: "Copy", laneId: "product", duration: 2 },
      { id: "post", label: "Launch post", laneId: "marketing", duration: 2, dependsOn: ["copy"], lag: 3 }
    ],
    behaviour: q([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function re(n) {
  return {
    version: 1,
    kind: "launch-plan",
    title: "Customer go-live",
    launch: { day: 25, name: "go-live" },
    clock: { origin: J(n) },
    lanes: [{ id: "us", label: "Us" }, { id: "customer", label: "Customer" }],
    cards: [
      { id: "kickoff", label: "Kickoff", laneId: "us", duration: 1 },
      { id: "data", label: "Send data", laneId: "customer", duration: 3, dependsOn: ["kickoff"] },
      { id: "configure", label: "Configure", laneId: "us", duration: 5, dependsOn: ["data"] },
      { id: "security", label: "Security review", laneId: "customer", duration: 4, dependsOn: ["kickoff"] },
      { id: "train", label: "Train admins", laneId: "us", duration: 2, dependsOn: ["configure"] },
      { id: "signoff", label: "Sign-off", laneId: "customer", duration: 1, dependsOn: ["train", "security"] }
    ],
    behaviour: q([{ kind: "workdays" }, { kind: "deadline", at: "launch" }, { kind: "cascade", onConflict: "push" }])
  };
}
function An(n, e, t, a) {
  switch (e.kind) {
    case "set_task": {
      const s = t.card(e.card), i = { laneId: s.laneId, cardId: s.id };
      e.duration === void 0 && e.lag === void 0 && t.refuse("Say how many days " + p(s.label) + " takes, or waits.", { ...i, code: "invalid_edit" });
      const o = n.kind === "hiring-plan";
      let r = n;
      for (const d of ["duration", "lag"]) {
        const h = e[d];
        if (h === void 0) continue;
        if (Number.isInteger(h) || t.refuse("A task's days are whole days.", i), !n.behaviour && !o) {
          const f = vn(r, { cardId: s.id, field: d }), g = N(r, { cardId: s.id, field: d }, h);
          (h < f.min || h > f.max) && t.refuse(h < f.min ? f.reasons.min : I(g, s.id) ?? f.reasons.max, { ...i, limits: f }), r = g;
          continue;
        }
        const [c, u] = d === "duration" ? o ? [7, 140] : [1, 60] : [0, o ? 728 : 120];
        (h < c || h > u) && t.refuse(d === "duration" ? o ? "Recruiting takes 1 to 20 weeks." : "A task takes 1 to 60 days." : "That is further out than the plan runs.", i), r = N(r, { cardId: s.id, field: d }, h);
      }
      if (un(n)) {
        const d = fn(n, r, /* @__PURE__ */ new Set([s.id]));
        typeof d == "string" && t.refuse(d, i), r = d;
      }
      const l = t.settle(r, s.laneId, s.id);
      return t.done(l, a(l.cards.find((d) => d.id === s.id), l), i);
    }
    case "link_tasks":
    case "unlink_tasks": {
      const s = t.card(e.card), i = t.card(e.waitsOn), o = { laneId: s.laneId, cardId: s.id };
      if (e.kind === "unlink_tasks")
        return s.dependsOn?.includes(i.id) || t.refuse(p(s.label) + " doesn’t wait on " + p(i.label) + ".", o), t.done(t.settle(W(n, s.id, i.id, !0), s.laneId, s.id), p(s.label) + " no longer waits on " + p(i.label) + ".", o);
      const r = jn(n, s.id, i.id);
      return r && t.refuse(r, o), t.done(t.settle(W(n, s.id, i.id), s.laneId, s.id), p(s.label) + " now waits on " + p(i.label) + ".", o);
    }
  }
  return null;
}
const Yn = {
  kind: "launch-plan",
  cards: [12, "A launch plan holds up to 12 tasks."],
  rulebook: Pn,
  drags: wn,
  words: kn,
  readCard(n, e, t) {
    if (e.duration = w(n.duration, 1, 60, "A task takes 1 to 60 days."), n.lag !== void 0 && n.lag !== 0 && (e.lag = w(n.lag, 0, 120, "A task waits 0 days or more, and no later than launch.")), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A task waits on a list of tasks.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e) {
    const t = ln(n, "launch", "A launch plan needs a launch day.");
    if (e.launch = { day: w(t.day, 5, 120, "Launch day is a whole day from 5 to 120.") }, t.name !== void 0) {
      if (typeof t.name != "string" || !/^[a-z][a-z -]{1,23}$/i.test(t.name)) throw new Error("Name the line in a word or two, such as go-live.");
      e.launch.name = t.name.toLowerCase();
    }
    xn(n, e);
  },
  validate: Rn,
  planMove: bn,
  caption: Wn,
  cardText: (n, e) => e.label + " · " + e.duration + "d",
  noteText: (n, e) => Bn(e),
  fromNote(n, e) {
    const t = $n(e);
    return typeof t == "string" ? t : { label: t.label, duration: Math.min(60, Math.max(1, t.days ?? 2)) };
  },
  renamed(n, e, t) {
    const a = Ln(t);
    return { label: a.label, edits: a.days !== void 0 ? [{ kind: "set_task", card: { id: e }, duration: a.days }] : [] };
  },
  edit(n, e, t) {
    switch (e.kind) {
      case "add_card": {
        const a = t.lane(e.lane), s = e.label?.trim();
        s || t.refuse("Say what the card should say, such as “Add Docs to " + a.label + "”.", { laneId: a.id });
        const i = { id: rn(n), label: s, laneId: a.id, duration: e.duration ?? 2 };
        e.lag && (i.lag = e.lag);
        const o = [...new Set((e.waitsOn ?? []).map((d) => t.card(d).id))];
        o.length && (i.dependsOn = o);
        const r = { ...n, cards: [...n.cards, i] }, l = n.behaviour ? null : I(r, i.id);
        return l && t.refuse(l, { laneId: a.id }), t.done(t.settle(r, a.id), "Added " + p(s) + " to " + p(a.label) + ".", { laneId: a.id, cardId: i.id });
      }
      case "set_launch_day": {
        const a = vn(n, { field: "day" });
        if (!Number.isInteger(e.day) || e.day < a.min || e.day > a.max) {
          const i = N(n, { field: "day" }, e.day);
          t.refuse(e.day < a.min && I(i) || (e.day < a.min ? a.reasons.min : a.reasons.max), { limits: a });
        }
        const s = N(n, { field: "day" }, e.day);
        return t.done(t.settle(s), Jn(x(n)) + " is now " + b(n, e.day) + ".");
      }
    }
    return An(n, e, t, (a) => p(a.label) + " now takes " + j(a.duration) + (a.lag ? " and waits " + j(a.lag) + "." : "."));
  }
}, Jn = (n) => n.charAt(0).toUpperCase() + n.slice(1);
function xn(n, e) {
  if (n.clock === void 0) return;
  const t = n.clock?.origin;
  if (!m(t)) throw new Error("A plan starts on a real date, written as 2026-12-07.");
  e.clock = { origin: t };
}
en(Yn);
const Kn = mn({ deadline: "at floor", snap: "unit", cascade: "onConflict", locked: "cards" }), nn = (n, e, t) => ({ type: "integer", min: e, max: t, about: n });
dn({
  kinds: [
    {
      kind: "set_band_cost",
      summary: "Hiring plan: what a role band costs a month, loaded. Cost is per band, never per person.",
      intent: !1,
      fields: { band: { type: "text", max: 40, about: "The band, by id or name." }, monthly: nn("Whole currency units a month.", 1, 1e7) },
      boards: ["hiring-plan"],
      refusals: {}
    },
    {
      kind: "set_funding",
      summary: "Hiring plan: the day the funding round closes, in days from the plan’s first day.",
      intent: !1,
      fields: { day: nn("Days from the first day.", 0, 728) },
      boards: ["hiring-plan"],
      refusals: {}
    }
  ],
  boards: { set_task: ["hiring-plan"], link_tasks: ["hiring-plan"], unlink_tasks: ["hiring-plan"] },
  fields: { add_card: { band: { type: "text", max: 40, optional: !0, about: "Hiring plan: the role band (by id or name). Left out, the team’s first band." } } }
});
const In = (n, e) => k(n).get(e).to;
function qn(n, e, t) {
  const a = n.cards.find((r) => r.id === e), i = k(n).get(e).start - (a.lag ?? 0), o = Math.max(0, t - (a.duration ?? 7) - i);
  return Math.ceil(o / 7) * 7;
}
function S(n, e) {
  const t = e.trim().toLowerCase();
  return n.bands.find((a) => a.id === e) ?? n.bands.find((a) => a.label.toLowerCase() === t) ?? n.bands.find((a) => new RegExp("\\b" + a.label.toLowerCase().replace(/[^a-z0-9 ]/g, "") + "\\b").test(t));
}
const Qn = ["salary", "pay", "wage", "cost", "amount", "monthly", "comp", "compensation"];
function Zn(n) {
  if (n.lanes.length > 4) return "A hiring plan has 2 to 4 teams.";
  if (n.cards.length < 1 || n.cards.length > 16) return "A hiring plan has 1 to 16 hires.";
  if (!n.clock) return "A hiring plan starts on a date.";
  for (const e of n.cards) {
    if (!n.hiring.bands.some((t) => t.id === e.band)) return p(e.label) + " needs a role band on this plan.";
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
const E = (n) => "Runway with these hires: " + gn(B(n));
function le(n) {
  return {
    version: 1,
    kind: "hiring-plan",
    title: "Hiring plan",
    clock: { origin: J(n) },
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
    behaviour: q([{ kind: "snap", unit: "week" }, { kind: "cascade", onConflict: "push" }])
  };
}
const Vn = (n, e) => p(e.label) + " now starts " + $(n.clock.origin, In(n, e.id)) + ", after " + Math.round(e.duration / 7) + " weeks of recruiting. " + E(n) + ".", Gn = {
  kind: "hiring-plan",
  cards: [16, "A hiring plan holds up to 16 hires."],
  rulebook: Kn,
  drags: wn,
  words: { ...kn, startLag: qn, band: (n, e) => S(n.hiring, e) },
  readCard(n, e, t) {
    if (Qn.some((a) => n[a] !== void 0)) throw new Error("Cost is per role band, never per person. Say what the band costs instead.");
    if (e.duration = w(n.duration, 7, 140, "Recruiting takes 1 to 20 weeks."), n.lag !== void 0 && n.lag !== 0 && (e.lag = w(n.lag, 0, 728, "That is further out than the plan runs.")), typeof n.band != "string") throw new Error("Each hire is in a role band.");
    if (e.band = t.id(n.band), n.dependsOn !== void 0) {
      if (!Array.isArray(n.dependsOn)) throw new Error("A hire waits on a list of hires.");
      const a = n.dependsOn.map(t.id);
      if (new Set(a).size !== a.length) throw new Error("Duplicate dependency.");
      a.length && (e.dependsOn = a);
    }
  },
  readBoard(n, e, t) {
    const a = ln(n, "hiring", "A hiring plan needs its cash, burn and role bands.");
    if (!Array.isArray(a.bands) || a.bands.length < 1 || a.bands.length > 8) throw new Error("A hiring plan has 1 to 8 role bands.");
    const s = a.bands.map((o) => {
      const r = o;
      if (typeof r.label != "string" || !r.label.trim() || r.label.length > 40 || /[<>\u0000-\u001f]/.test(r.label)) throw new Error("Name each role band in plain words.");
      return { id: t.id(r.id), label: r.label.trim(), monthly: w(r.monthly, 1, 1e7, "A band costs 1 to 10,000,000 a month."), lane: t.id(r.lane) };
    });
    if (new Set(s.map((o) => o.id)).size !== s.length) throw new Error("Duplicate role band.");
    const i = typeof a.currency == "string" && /^[$€£¥]$/.test(a.currency) ? a.currency : "$";
    if (e.hiring = {
      cash: w(a.cash, 0, 1e10, "Cash is 0 to 10 billion."),
      burn: w(a.burn, 0, 1e9, "Burn is 0 to a billion a month."),
      currency: i,
      weeks: w(a.weeks ?? 52, 13, 104, "A hiring plan runs 13 to 104 weeks."),
      bands: s
    }, a.funding !== void 0) {
      const o = a.funding;
      e.hiring.funding = { day: w(o?.day, 0, 728, "A round closes within two years."), amount: w(o?.amount, 1, 1e10, "A round raises 1 to 10 billion.") };
    }
    xn(n, e);
  },
  validate: Zn,
  planMove(n, e, t) {
    const a = n.cards.find((s) => s.id === e);
    return !a || !n.lanes.some((s) => s.id === t) ? null : a.laneId === t ? n : { ...n, cards: n.cards.map((s) => s === a ? { ...a, laneId: t } : s) };
  },
  caption(n, e) {
    const t = n.cards.filter((a) => a.laneId === e);
    return t.length + (t.length === 1 ? " hire" : " hires");
  },
  cardText: (n, e) => e.label + " · " + $(n.clock.origin, In(n, e.id)).replace(/^\w+ /, ""),
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
        const o = e.band ? S(a, e.band) : a.bands.find((h) => h.lane === s.id) ?? S(a, i);
        o || t.refuse("Say which role band, such as " + a.bands.map((h) => p(h.label)).join(" or ") + ".", { laneId: s.id });
        const r = { id: rn(n), label: i, laneId: s.id, band: o.id, duration: e.duration ?? 42 };
        e.lag && (r.lag = e.lag);
        const l = [...new Set((e.waitsOn ?? []).map((h) => t.card(h).id))];
        l.length && (r.dependsOn = l);
        const d = t.settle({ ...n, cards: [...n.cards, r] }, s.id);
        return t.done(d, "Added " + p(i) + " to " + p(s.label) + ". " + E(d) + ".", { laneId: s.id, cardId: r.id });
      }
      case "set_band_cost": {
        const s = S(a, e.band);
        s || t.refuse("There is no role band " + p(e.band) + ". The bands are " + a.bands.map((o) => p(o.label)).join(", ") + ".", { code: "unknown_reference" });
        const i = t.settle({ ...n, hiring: { ...a, bands: a.bands.map((o) => o === s ? { ...o, monthly: e.monthly } : o) } });
        return t.done(i, p(s.label) + " now costs " + En(e.monthly, a.currency) + " a month. " + E(i) + ".");
      }
      case "set_funding": {
        a.funding || t.refuse("This plan has no funding round.");
        const s = t.settle({ ...n, hiring: { ...a, funding: { ...a.funding, day: e.day } } });
        return t.done(s, "The round now closes " + $(n.clock.origin, e.day) + ". " + E(s) + ".");
      }
    }
    return An(n, e, t, (s, i) => Vn(i, s));
  }
};
en(Gn);
export {
  fn as $,
  wn as A,
  X as B,
  Rn as C,
  bn as D,
  se as E,
  jn as F,
  Wn as G,
  vn as H,
  Bn as I,
  ie as J,
  q as K,
  An as L,
  Yn as M,
  xn as N,
  dn as O,
  k as P,
  cn as Q,
  M as R,
  x as S,
  b as T,
  _ as U,
  un as V,
  hn as W,
  _n as X,
  I as Y,
  N as Z,
  W as _,
  ne as a,
  O as a0,
  te as a1,
  pn as a2,
  mn as a3,
  ae as a4,
  In as a5,
  qn as a6,
  S as a7,
  Zn as a8,
  E as a9,
  Gn as aa,
  B as ab,
  gn as ac,
  D as ad,
  on as ae,
  j as af,
  $n as b,
  ee as c,
  w as d,
  Y as e,
  tn as f,
  re as g,
  le as h,
  m as i,
  R as j,
  an as k,
  oe as l,
  En as m,
  rn as n,
  ln as o,
  $ as p,
  J as q,
  Ln as r,
  L as s,
  Mn as t,
  sn as u,
  C as v,
  Cn as w,
  yn as x,
  H as y,
  kn as z
};
