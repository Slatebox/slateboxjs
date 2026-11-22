import { registerWorkshopRules as me, workshopEditKinds as G, workshopRuleSchema as Q, said as m, applyWorkshopEdits as ee, validateWorkshop as we, workshopReferences as ge } from "./workshop-model.mjs";
const D = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", Ie = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function ne(e, n) {
  if (n !== null) {
    let o = 0;
    for (; (e[o] ?? "0") === n[o]; ) o++;
    if (o > 0) return n.slice(0, o) + ne(e.slice(o), n.slice(o));
  }
  const t = e ? D.indexOf(e[0]) : 0, r = n !== null ? D.indexOf(n[0]) : D.length;
  return r - t > 1 ? D[Math.round((t + r) / 2)] : n && n.length > 1 ? n.slice(0, 1) : D[t] + ne(e.slice(1), null);
}
function O(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return ne(e ?? "", n ?? null);
}
const se = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function de(e) {
  const n = [];
  for (let t = 0; t < e; t++) n.push(O(n[t - 1] ?? null, null));
  return n;
}
const L = 6, T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", z = (e) => e.charAt(0).toUpperCase() + e.slice(1), re = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, ke = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
function j(e) {
  const n = typeof e == "string" ? e.trim().toLowerCase().replace(/\s+/g, " ") : "";
  if (!/^[a-z][a-z -]{0,23}$/.test(n)) throw new Error("A role is a word or two, such as “pile” or “opportunity”.");
  return n;
}
const ae = (e, n) => n + (e >= 1e6 ? Math.round(e / 1e5) / 10 + "M" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : String(e)), V = (e) => {
  let n = 1;
  for (; e.cards.some((t) => t.id === "card-" + n) || e.lanes.some((t) => t.id === "card-" + n); ) n++;
  return "card-" + n;
};
let v = null;
function ze(e) {
  v = e, Object.assign(oe, e.keys);
}
const S = (e, n, t) => {
  const r = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!r || r.length > n || /[<>\u0000-\u001f]/.test(r)) throw new Error(t);
  return r;
}, _ = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), k = (e, n) => n === void 0 ? void 0 : e.cards.find((t) => t.id === n);
function b(e, n, t) {
  return e.cards.filter((r) => (r.parentId ?? null) === n && (n !== null || r.laneId === t)).sort(se);
}
function $(e, n) {
  const t = [n];
  for (let r = 0; r < t.length; r++) for (const o of e.cards) o.parentId === t[r] && t.push(o.id);
  return t;
}
function P(e, n) {
  let t = 0;
  for (let r = k(e, n); r?.parentId && t <= e.cards.length; r = k(e, r.parentId)) t++;
  return t;
}
function U(e, n) {
  const t = e.cards.filter((r) => r.parentId === n);
  return t.length ? 1 + Math.max(...t.map((r) => U(e, r.id))) : 0;
}
function be(e, n) {
  return $(e, n).slice(1).map((t) => k(e, t)).filter((t) => !e.cards.some((r) => r.parentId === t.id));
}
function F(e, n, t) {
  const r = be(e, n);
  if (t === "count") return r.length;
  if (t === "sources") return new Set(r.flatMap((d) => d.source ? [d.source.toLowerCase()] : [])).size;
  const o = /* @__PURE__ */ new Map();
  for (const d of r) {
    const a = d.fields?.[t];
    if (a === void 0) continue;
    const c = d.source ? d.source.toLowerCase() : "#" + d.id;
    o.set(c, Math.max(o.get(c) ?? 0, a));
  }
  return [...o.values()].reduce((d, a) => d + a, 0);
}
const ie = (e, n) => e.nest?.fields?.find((t) => t.id === n);
function X(e, n, t) {
  if (n === "count") return t + (t === 1 ? " note" : " notes");
  if (n === "sources") return t + (t === 1 ? " customer" : " customers");
  const r = ie(e, n);
  return (r?.currency ? ae(t, r.currency) : String(t)) + " " + (r?.label ?? n);
}
const R = (e, n) => (e.behaviour?.rules ?? []).filter((t) => t.on && t.kind === n), J = (e) => R(e, "rank")[0]?.by;
function le(e, n) {
  const t = b(e, null, n), r = J(e);
  if (!r || n !== _(e).main) return t;
  const o = new Map(t.map((d) => [d.id, F(e, d.id, r)]));
  return t.sort((d, a) => o.get(a.id) - o.get(d.id) || se(d, a));
}
function Z(e, n, t) {
  const r = k(e, n);
  if (!r) return null;
  const o = $(e, n), d = t.under === null ? null : k(e, t.under);
  if (d === void 0 || d && o.includes(d.id)) return null;
  const a = d ? d.laneId : t.laneId, { tray: c } = _(e);
  if (a === c && (d || o.length > 1)) return null;
  const l = (d ? b(e, d.id) : b(e, null, a)).filter((y) => y.id !== n);
  let h = t.before === null ? l.length : l.findIndex((y) => y.id === t.before);
  h < 0 && (h = l.length);
  const w = d ? b(e, d.id) : b(e, null, a);
  if ((r.parentId ?? null) === (d?.id ?? null) && r.laneId === a && w.indexOf(r) === h) return e;
  const s = l[h - 1]?.order, i = l[h]?.order;
  let f = /* @__PURE__ */ new Map(), p;
  if ((h === 0 || s) && (h === l.length || i) && (!s || !i || s < i)) p = O(s, i);
  else {
    const y = de(l.length + 1);
    l.forEach((g, x) => f.set(g.id, y[x < h ? x : x + 1])), p = y[h];
  }
  const u = e.cards.map((y) => {
    if (y.id === n) {
      const I = { ...y, laneId: a, order: p };
      return d ? I.parentId = d.id : delete I.parentId, I;
    }
    const g = f.get(y.id), x = o.includes(y.id) ? a : y.laneId;
    return g || x !== y.laneId ? { ...y, laneId: x, ...g && { order: g } } : y;
  });
  return ce({ ...e, cards: u });
}
function ce(e) {
  var r;
  const n = {}, t = /* @__PURE__ */ new Map();
  for (const o of e.cards) (n[r = o.parentId ?? "#" + o.laneId] ?? (n[r] = [])).push(o);
  for (const o of Object.values(n)) if (o.some((d) => d.order?.length > 16)) {
    const d = de(o.length);
    o.sort(se).forEach((a, c) => t.set(a.id, d[c]));
  }
  return t.size ? { ...e, cards: e.cards.map((o) => t.has(o.id) ? { ...o, order: t.get(o.id) } : o) } : e;
}
function ve(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = _(e), t = new Set((e.nest?.fields ?? []).map((o) => o.id));
  if (e.nest?.layout === "matrix" && !v) return "A 2 by 2 needs its rules loaded.";
  const r = J(e);
  if (r && r !== "count" && r !== "sources" && !t.has(r)) return "Cards on this board carry no " + r + ", so piles can’t rank by it.";
  for (const o of e.cards) {
    if (o.parentId !== void 0) {
      const a = k(e, o.parentId);
      if (!a) return m(o.label) + " sits under a card that is no longer on the board.";
      if (a.laneId !== o.laneId) return m(o.label) + " is in another area than the card it sits under.";
      if (o.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (P(e, o.id) > Math.min(L, e.cards.length)) return "Cards nest up to " + L + " levels deep, and never under themselves.";
    }
    if (Object.keys(o.fields ?? {}).find((a) => !t.has(a))) return m(o.label) + " has a number this board has no field for.";
  }
  return v?.validate(e) ?? null;
}
function te(e, n) {
  const t = e.severity === "warn" ? " (a warning only)" : "";
  let r = "";
  switch (e.kind) {
    case "nests":
      r = z(T(e.role)) + " sit under " + ke(e.under.map(re));
      break;
    case "children":
      r = e.role ? z(re(e.role)) + " holds at most " + e.max : "A card holds at most " + e.max + " under it";
      break;
    case "depth":
      r = e.max === 1 ? "Cards nest one level deep" : "Cards nest up to " + e.max + " levels deep";
      break;
    case "rank":
      r = "Piles rank by " + (e.by === "count" ? "number of notes" : e.by === "sources" ? "number of customers" : ie(n, e.by)?.label ?? e.by);
      break;
    case "emptyDrop":
      r = "A card let go in empty space " + (e.drop === "new-pile" ? "starts a new pile" : "goes to " + n.lanes[1].label);
      break;
    default:
      r = (v?.sentence(e, n) ?? e.kind).replace(/\.$/, "");
  }
  return r + t + ".";
}
const Y = ["nests", "depth", "children"];
function W(e, n) {
  const t = (e.behaviour?.rules ?? []).filter((l) => l.on && Y.includes(l.kind)).sort((l, h) => Y.indexOf(l.kind) - Y.indexOf(h.kind)), r = [];
  if (!t.length) return v?.check(e, n, r) ?? { ok: !0, warnings: r };
  const o = new Map(e.cards.map((l) => [l.id, l])), { tray: d } = _(n), a = n.cards.filter((l) => {
    const h = o.get(l.id);
    return l.laneId !== d && (!h || h.parentId !== l.parentId || h.laneId !== l.laneId || h.role !== l.role);
  }), c = (l, h) => l.cards.filter((w) => w.parentId === h).length;
  for (const l of t) {
    let h = null;
    if (l.kind === "nests") {
      const w = a.find((s) => s.role === l.role && !l.under.includes(k(n, s.parentId)?.role ?? ""));
      w && (h = { sentence: te({ ...l, severity: "refuse" }, e), card: w });
    } else if (l.kind === "depth") {
      const w = a.find((s) => P(n, s.id) + U(n, s.id) > l.max);
      w && (h = { sentence: te({ ...l, severity: "refuse" }, e) + " " + w.label + " would be " + (P(n, w.id) + U(n, w.id)) + " deep.", card: w });
    } else if (l.kind === "children")
      for (const w of a) {
        const s = k(n, w.parentId);
        if (!s || l.role && s.role !== l.role) continue;
        const i = c(e, s.id), f = c(n, s.id);
        if (f > l.max && f > i) {
          h = { sentence: s.label + " holds " + l.max + ". It has " + i + ".", card: w };
          break;
        }
      }
    if (h) {
      if (l.severity === "warn") {
        r.push(h.sentence);
        continue;
      }
      return { refused: { sentence: h.sentence, ruleId: l.id, set: l.set, cardId: h.card.id, laneId: h.card.laneId } };
    }
  }
  return v?.check(e, n, r) ?? { ok: !0, warnings: r };
}
function xe(e) {
  const n = e.filter((o) => o.kind === "nests" && o.on && o.severity === "refuse"), t = /* @__PURE__ */ new Map(), r = (o, d) => {
    if (t.has(o)) return t.get(o);
    const a = n.find((l) => l.role === o);
    if (!a) return 0;
    if (d.includes(o)) return 1 / 0;
    const c = 1 + Math.min(...a.under.map((l) => r(l, [...d, o])));
    return d.length || t.set(o, c), c;
  };
  for (const o of n) t.set(o.role, r(o.role, []));
  return t;
}
function Ae(e, n) {
  const t = /* @__PURE__ */ new Set();
  for (const d of e.rules) {
    if (!(d.kind in ue)) continue;
    const a = d.kind + ":" + (d.kind === "nests" ? d.role : d.kind === "children" ? d.role ?? "" : "");
    if (t.has(a))
      return d.kind === "nests" ? "There is already a rule for where " + T(d.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    t.add(a);
  }
  const r = xe(e.rules), o = e.rules.find((d) => d.kind === "depth" && d.on && d.severity === "refuse");
  for (const [d, a] of r) {
    if (a === 1 / 0) return z(T(d)) + " could never be placed: what they sit under would have to sit under them first.";
    if (o && a > o.max) return z(T(d)) + " sit " + a + " levels down, but cards nest only " + o.max + " deep.";
  }
  return v?.contradiction(e, n) ?? null;
}
const ue = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" }, oe = { ...ue };
function Ne(e, n, t) {
  const r = Object.keys(e).find((a) => !["id", "on", "severity", "set", "kind", ...oe[e.kind].split(" ")].includes(a));
  if (r) throw new Error("A " + e.kind + " rule does not take " + r + ".");
  const o = (a, c, l) => {
    if (typeof a != "number" || !Number.isInteger(a) || a < 1 || a > c) throw new Error(l);
    return a;
  };
  switch (e.kind) {
    case "nests": {
      const a = j(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + T(a) + " sit under.");
      const c = [...new Set(e.under.map(j))];
      if (c.includes(a)) throw new Error(z(T(a)) + " can’t sit only under " + T(a) + ".");
      return { ...n, kind: "nests", role: a, under: c };
    }
    case "children": {
      const a = { ...n, kind: "children", max: o(e.max, 40, "A card holds from 1 to 40 cards under it.") };
      return e.role !== void 0 && (a.role = j(e.role)), a;
    }
    case "depth":
      return { ...n, kind: "depth", max: o(e.max, L, "Cards nest from 1 to " + L + " levels deep.") };
    case "rank":
      if (typeof e.by != "string" || !/^[a-z0-9-]{1,20}$/.test(e.by)) throw new Error("Piles rank by number of notes, number of customers, or a number field this board has.");
      return { ...n, kind: "rank", by: e.by };
    case "emptyDrop":
      if (e.drop !== "new-pile" && e.drop !== "unsorted") throw new Error("A card let go in empty space starts a new pile or goes to " + t.lanes[1].label + ".");
      return { ...n, kind: "emptyDrop", drop: e.drop };
  }
  const d = v?.read(e, n, t);
  if (d) return d;
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const _e = {
  keys: oe,
  read: (e, n, t) => Ne(e, n, t),
  sentence: te,
  contradiction: Ae,
  check: W,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, fe = (e, n) => !e.behaviour || !("refused" in W(e, n));
function he(e, n) {
  if (!k(e, n)) return [];
  const r = [], o = new Set($(e, n)), d = U(e, n), a = [null, ...e.cards.filter((c) => !o.has(c.id) && c.laneId === _(e).main && P(e, c.id) + 1 + d <= L)];
  for (const c of e.lanes) for (const l of a) {
    if (l && c.id !== l.laneId) continue;
    const h = (l ? b(e, l.id) : b(e, null, c.id)).filter((w) => w.id !== n);
    for (let w = 0; w <= h.length; w++) {
      const s = { laneId: c.id, under: l?.id ?? null, before: h[w]?.id ?? null }, i = Z(e, n, s);
      i && (i === e || fe(e, i)) && r.push({ spot: s, next: i });
    }
  }
  return r;
}
function $e(e, n) {
  const t = k(e, n);
  if (!t) return null;
  const r = R(e, "emptyDrop")[0], { main: o, tray: d } = _(e), a = r?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!a) return null;
  let c;
  if (a === "unsorted") c = t.laneId === d ? null : Z(e, n, { laneId: d, under: null, before: null });
  else {
    if (e.cards.some((h) => h.parentId === n)) return null;
    const l = ee(e, [{ kind: "start_pile", card: { id: n } }]);
    c = "refused" in l ? null : l.workshop;
  }
  return c && c !== e && fe(e, c) ? c : null;
}
const Ee = (e) => (v?.drags(e) ?? "") + JSON.stringify([
  e.nest?.layout,
  J(e),
  R(e, "emptyDrop")[0]?.kind && R(e, "emptyDrop")[0].drop,
  le(e, _(e).main).map((n) => n.id),
  e.cards.map((n) => he(e, n.id).map(({ spot: t }) => t.under ?? t.laneId).filter((t, r, o) => o.indexOf(t) === r))
]);
function pe(e, n) {
  let t = n;
  for (let r = 0; r < 12 && !k(e, t); r++) {
    const o = e.nest?.aliases?.find(([d]) => d === t)?.[1];
    if (!o) return null;
    t = o;
  }
  return k(e, t) ? t : null;
}
function Re(e, n, t) {
  const r = we(e), o = ge(r), d = (u) => typeof u == "object" ? k(r, pe(r, u.id) ?? "") : k(r, u) ?? o.cards.attempt(u) ?? void 0, a = d(n), c = t.under === void 0 ? null : d(t.under);
  if (!a || c === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null } };
  const l = { kind: "nest_card", card: { id: a.id }, ...c ? { under: { id: c.id } } : t.lane ? { lane: t.lane } : {} }, h = ee(r, [l]);
  if (!("refused" in h)) {
    const u = W(r, h.workshop);
    return { ok: !0, warnings: "warnings" in u ? u.warnings : [] };
  }
  const w = h.refused.reason, s = (r.behaviour?.rules ?? []).find((u) => {
    if (!u.on) return !1;
    const y = { ...r, behaviour: { ...r.behaviour, rules: [{ ...u, severity: "refuse" }] } }, g = ee(y, [l]);
    return "refused" in g && g.refused.reason === w;
  }), i = new Set(he(r, a.id).flatMap(({ spot: u }) => u.under ? [u.under] : [])), p = (c ? [...b(r, c.id), ...c.parentId ? b(r, c.parentId) : b(r, null, c.laneId)] : []).find((u) => i.has(u.id) && u.id !== a.parentId)?.label ?? null;
  return { refused: { sentence: w, ruleId: s?.id ?? null, nearest: p, ...s && { set: s.set } } };
}
const N = (e) => ({ type: "ref", of: "card", about: e }), M = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), A = ["nest"];
function Me(e) {
  const n = (t) => G.find((r) => r.kind === t);
  for (const t of e.kinds) G.some((r) => r.kind === t.kind) || G.push(t);
  for (const [t, r] of Object.entries(e.boards)) for (const o of r) {
    const d = n(t);
    d.boards.includes(o) || (d.boards.push(o), delete d.refusals[o]);
  }
  for (const [t, r] of Object.entries(e.fields)) Object.assign(n(t).fields, r);
  Q.kinds.push(...e.rules.kinds.filter((t) => !Q.kinds.includes(t))), Object.assign(Q.keys, e.rules.keys);
}
Me({
  kinds: [
    {
      kind: "nest_card",
      summary: "Nest board: put a card under another (under), at the top of an area (lane), before a sibling (before). The cards under it come with it.",
      intent: !0,
      fields: {
        card: N("The card."),
        under: { ...N("The card it goes under."), optional: !0 },
        lane: { type: "ref", of: "lane", optional: !0, about: "The area it goes to the top of." },
        before: { ...N("The sibling it goes before. Left out, last."), optional: !0 }
      },
      boards: A,
      refusals: {}
    },
    {
      kind: "start_pile",
      summary: "Nest board: start a new pile with this card in it.",
      intent: !0,
      fields: { card: N("The card."), label: M(80, "The pile’s name. Left out, “New pile”.", !0) },
      boards: A,
      refusals: {}
    },
    {
      kind: "merge_cards",
      summary: "Nest board: merge a card into another. What was under it goes under that one; a drop still on its way lands there too.",
      intent: !1,
      fields: { card: N("The card that goes."), into: N("The card it merges into.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_role",
      summary: "Nest board: say what a card is (pile, outcome, opportunity, solution, cause, action…).",
      intent: !1,
      fields: { card: N("The card."), role: M(24, "A word or two.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: N("The card."), source: M(60, "Who said it.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: {
        label: M(20, "Its name."),
        currency: { type: "choice", values: ["$", "€", "£"], optional: !0, about: "A money field’s sign." },
        flag: { type: "flag", optional: !0, about: "A yes/no field (contractor…): cards carry 1 for yes." }
      },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_field",
      summary: "Nest board: set (or with null clear) a card’s number in a field.",
      intent: !1,
      fields: { card: N("The card."), field: M(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_layout",
      summary: "Nest board: draw it as piles or as a tree (a phone shows an outline).",
      intent: !1,
      fields: { layout: { type: "choice", values: ["clusters", "tree"], about: "clusters or tree." } },
      boards: A,
      refusals: {}
    }
  ],
  boards: { add_rule: A, set_rule: A, remove_rule: A },
  fields: {
    set_rule: {
      under: { type: "refs", of: "card", min: 1, max: 4, optional: !0, about: "Nest board: the roles a role may sit under (words, such as opportunity)." },
      by: M(20, "Nest board: what piles rank by: count, sources, or a number field.", !0),
      drop: { type: "choice", values: ["new-pile", "unsorted"], optional: !0, about: "Nest board: where a far drop goes." }
    },
    add_card: { under: { ...N("Nest board: the card it goes under."), optional: !0 }, role: M(24, "Nest board: what it is.", !0), source: M(60, "Nest board: who said it.", !0) }
  },
  rules: {
    kinds: ["nests", "children", "depth", "rank", "emptyDrop"],
    keys: {
      role: { type: "string", minLength: 1, maxLength: 24 },
      under: { type: "array", items: { type: "string", maxLength: 24 }, minItems: 1, maxItems: 4 },
      max: { type: "integer", minimum: 1, maximum: 40 },
      by: { type: "string", maxLength: 20 },
      drop: { enum: ["new-pile", "unsorted"] }
    }
  }
});
function Oe(e, n) {
  return n ? (e.behaviour?.rules ?? []).find((r) => r.kind === "nests" && r.under.includes(n.role ?? ""))?.role ?? (n.role === "pile" ? "note" : void 0) : void 0;
}
const B = (e, n, t) => O(b(e, n, t).at(-1)?.order ?? null, null);
function Ce(e, n, t) {
  const r = e, { main: o, tray: d } = _(r), a = r.lanes[1].label, c = (s, i, f) => t.settle(ce(s), i, f), l = v?.edit(r, n, t, c);
  if (l) return l;
  const h = (s) => {
    if (typeof s == "object" && !k(r, s.id)) {
      const i = pe(r, s.id);
      if (i) return k(r, i);
    }
    return t.card(s);
  }, w = (s, i) => {
    const f = Z(r, s.id, i);
    return f || (i.under && $(r, s.id).includes(i.under) && t.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), t.refuse(a + " holds loose cards. Move what is under " + m(s.label) + " first.", { cardId: s.id, laneId: i.laneId })), c(f, i.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.nest?.layout === "matrix" ? r.lanes[1] : t.lane(n.lane), i = n.label?.replace(/\s+/g, " ").trim();
      i || t.refuse("Say what the card should say, such as “Add a note called Slow exports to Reporting”.", { laneId: s.id });
      const f = n.under === void 0 ? null : h(n.under);
      f && s.id === d && t.refuse(a + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const p = n.role === void 0 ? Oe(r, f) : j(n.role), u = { id: V(r), label: i, laneId: f?.laneId ?? s.id, ...p && { role: p }, ...f?.owner && { owner: f.owner }, ...n.source && { source: S(n.source, 60, "Say who said it in plain words.") } };
      if (!f && s.id === o && r.nest?.layout === "clusters" && n.role === void 0) {
        if ((R(r, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const K = c({ ...r, cards: [...r.cards, { ...u, laneId: d, order: B(r, null, d) }] }, d);
          return t.done(K, "Added " + m(i) + " to " + m(a) + ".", { laneId: d, cardId: u.id });
        }
        const x = { id: u.id, label: "New pile", laneId: o, role: "pile", order: B(r, null, o) }, I = { ...u, id: V({ ...r, cards: [...r.cards, x] }), parentId: x.id, role: p ?? "note", order: O(null, null) }, C = c({ ...r, cards: [...r.cards, x, I] }, o);
        return t.done(C, "Added " + m(i) + " to a new pile.", { laneId: o, cardId: I.id });
      }
      f && (u.parentId = f.id), u.order = B(r, f?.id ?? null, u.laneId);
      const y = c({ ...r, cards: [...r.cards, u] }, u.laneId);
      return t.done(y, "Added " + m(i) + " to " + m(f?.label ?? r.lanes.find((g) => g.id === u.laneId).label) + ".", { laneId: u.laneId, cardId: u.id });
    }
    case "nest_card": {
      const s = t.card(n.card), i = n.under === void 0 ? null : h(n.under), f = i?.laneId ?? (n.lane === void 0 ? s.laneId : t.lane(n.lane).id), p = n.before === void 0 ? null : t.card(n.before).id, u = w(s, { laneId: f, under: i?.id ?? null, before: p });
      if (u === r) return t.done(r, m(s.label) + " is there already.", { laneId: f, cardId: s.id });
      const y = i ? "under " + m(i.label) : f === d ? "to " + m(a) : "to the top of " + m(r.lanes[0].label);
      return t.done(u, "Moved " + m(s.label) + " " + y + ".", { laneId: f, cardId: s.id });
    }
    case "start_pile": {
      const s = t.card(n.card);
      r.cards.some((y) => y.parentId === s.id) && t.refuse(m(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const i = n.label === void 0 ? "New pile" : S(n.label, 80, "Name the pile in plain words."), f = { id: V(r), label: i, laneId: o, role: "pile", order: B(r, null, o) }, p = r.cards.map((y) => {
        if (y.id !== s.id) return y;
        const g = { ...y, laneId: o, parentId: f.id, order: O(null, null) };
        return (!g.role || g.role === "pile") && (g.role = "note"), g;
      }), u = c({ ...r, cards: [...p, f] }, o, s.id);
      return t.done(u, "Started a new pile, " + m(i) + ", with " + m(s.label) + " in it.", { laneId: o, cardId: f.id });
    }
    case "merge_cards": {
      const s = t.card(n.card), i = t.card(n.into);
      s.id === i.id && t.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), $(r, s.id).includes(i.id) && t.refuse(m(i.label) + " is under " + m(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (i.laneId === d || s.laneId === d) && t.refuse("Merge cards on the board, not in " + m(a) + ".", { cardId: s.id, laneId: d });
      const f = b(r, s.id);
      let p = b(r, i.id).at(-1)?.order ?? null;
      const u = new Map(f.map((I) => (p = O(p, null), [I.id, p]))), y = [...(r.nest.aliases ?? []).map(([I, C]) => [I, C === s.id ? i.id : C]), [s.id, i.id]].slice(-12), g = r.cards.filter((I) => I.id !== s.id).map((I) => u.has(I.id) ? { ...I, parentId: i.id, order: u.get(I.id) } : I), x = c({ ...r, nest: { ...r.nest, aliases: y }, cards: g }, i.laneId, i.id);
      return t.done(x, "Merged " + m(s.label) + " into " + m(i.label) + (f.length ? ": " + f.length + (f.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: i.laneId, cardId: i.id });
    }
    case "remove_card": {
      const s = t.card(n.card), i = b(r, s.id), f = (g) => {
        let x = !1, I = b(r, s.parentId ?? null, s.laneId).at(-1)?.order ?? null, C = b(r, null, d).at(-1)?.order ?? null;
        const K = new Map(i.map((E) => {
          const H = (g || !s.parentId) && !r.cards.some((q) => q.parentId === E.id);
          return x || (x = H), [E.id, H ? { laneId: d, order: C = O(C, null) } : { laneId: s.laneId, order: I = O(I, null), ...s.parentId && { parentId: s.parentId } }];
        })), ye = r.cards.flatMap((E) => E.id === s.id ? [] : K.has(E.id) ? [(({ parentId: H, ...q }) => ({ ...q, ...K.get(E.id) }))(E)] : [E]);
        return { board: { ...r, cards: ye }, tidy: x };
      };
      let p = f(!1);
      if (s.parentId && r.behaviour && "refused" in W(r, p.board)) {
        const g = f(!0);
        "refused" in W(r, g.board) || (p = g);
      }
      const { tidy: u } = p, y = c(p.board, s.laneId);
      return t.done(y, "Removed " + m(s.label) + "." + (i.length ? u ? " What was in it went to " + m(a) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = t.card(n.card);
      let i = "";
      try {
        i = j(n.role);
      } catch (p) {
        t.refuse(p.message, { cardId: s.id, laneId: s.laneId });
      }
      const f = c({ ...r, cards: r.cards.map((p) => p.id === s.id ? { ...p, role: i } : p) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " is " + re(i) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = t.card(n.card);
      let i = "";
      try {
        i = S(n.source, 60, "Say who said it in plain words.");
      } catch (p) {
        t.refuse(p.message, { cardId: s.id });
      }
      const f = c({ ...r, cards: r.cards.map((p) => p.id === s.id ? { ...p, source: i } : p) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " came from " + i + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = r.nest.fields ?? [];
      let i = "";
      try {
        i = S(n.label, 20, "Name the field in a word or two.");
      } catch (u) {
        t.refuse(u.message);
      }
      const f = i.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((u) => u.id === f || u.label.toLowerCase() === i.toLowerCase()) && t.refuse("Cards already carry " + i + "."), s.length >= 4 && t.refuse("Cards carry up to 4 number fields.");
      const p = c({ ...r, nest: { ...r.nest, fields: [...s, { id: f, label: i, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } }] } });
      return t.done(p, "Cards can carry " + i + (n.flag ? " (yes or no)" : "") + " now.");
    }
    case "set_field": {
      const s = t.card(n.card), i = (r.nest.fields ?? []).find((u) => u.id === n.field || u.label.toLowerCase() === String(n.field).toLowerCase());
      i || t.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && t.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const f = r.cards.map((u) => {
        if (u.id !== s.id) return u;
        const y = { ...u.fields };
        n.value === null ? delete y[i.id] : y[i.id] = n.value;
        const g = { ...u, fields: y };
        return Object.keys(y).length || delete g.fields, g;
      }), p = c({ ...r, cards: f }, s.laneId, s.id);
      return t.done(p, m(s.label) + (n.value === null ? " has no " + i.label + " now." : "’s " + i.label + " is " + (i.currency ? ae(n.value, i.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && t.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = c({ ...r, nest: { ...r.nest, layout: n.layout } });
      return t.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function Te(e, n) {
  const t = v?.cardText(e, n);
  if (t != null) return t;
  if (e.cards.some((r) => r.parentId === n.id) || n.role === "pile") {
    const r = [X(e, "count", F(e, n.id, "count"))];
    if (e.nest?.layout === "clusters") {
      const o = F(e, n.id, "sources");
      o && r.push(X(e, "sources", o));
      const d = J(e);
      d && d !== "count" && d !== "sources" && r.push(X(e, d, F(e, n.id, d)));
    }
    return n.label + `
` + r.join(" · ");
  }
  return n.source ? n.label + `
— ` + n.source : n.label;
}
function Se(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [t, r] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(t) || typeof r != "number" || !Number.isInteger(r) || r < 0 || r > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[t] = r;
  }
  return Object.keys(n).length ? n : void 0;
}
function je(e, n) {
  const t = JSON.stringify, r = (o) => t(o.cards.map((d) => [d.id, d.laneId, d.parentId, d.order, d.role]));
  return t(e.behaviour?.rules) !== t(n.behaviour?.rules) && r(e) !== r(n) ? "Change the rules on their own, then move cards." : null;
}
const De = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: _e,
  drags: Ee,
  fixed: je,
  order: (e, n) => le(e, n).map((t) => t.id),
  readCard(e, n, t) {
    if (e.parentId !== void 0 && (n.parentId = t.id(e.parentId)), e.role !== void 0 && (n.role = j(e.role)), e.order !== void 0) {
      if (!Ie(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = S(e.source, 60, "Say who said it in plain words."));
    const r = Se(e.fields);
    if (r && (n.fields = r), v) v.readCard(e, n, t);
    else if (e.owner !== void 0) throw new Error("This board needs its rules loaded.");
  },
  readBoard(e, n, t) {
    const r = e.nest;
    if (!r || typeof r != "object" || Array.isArray(r)) throw new Error("A nested board says how it is drawn.");
    if (r.layout !== "clusters" && r.layout !== "tree" && r.layout !== "matrix") throw new Error("A nested board is drawn as piles, as a tree or as a 2 by 2.");
    const o = { layout: r.layout };
    if (r.fields !== void 0) {
      if (!Array.isArray(r.fields) || r.fields.length > 4) throw new Error("Cards carry up to 4 number fields.");
      if (o.fields = r.fields.map((d) => {
        const a = d ?? {};
        if (typeof a.id != "string" || !/^[a-z0-9-]{1,20}$/.test(a.id)) throw new Error("A field’s id is a short slug.");
        const c = { id: a.id, label: S(a.label, 20, "Name the field in a word or two.") };
        if (a.currency !== void 0) {
          if (a.currency !== "$" && a.currency !== "€" && a.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          c.currency = a.currency;
        }
        if (a.flag !== void 0) {
          if (a.flag !== !0 || a.currency !== void 0) throw new Error("A yes/no field is a flag, never money.");
          c.flag = !0;
        }
        return c;
      }), new Set(o.fields.map((d) => d.id)).size !== o.fields.length) throw new Error("Duplicate field.");
    }
    if (r.aliases !== void 0) {
      if (!Array.isArray(r.aliases) || r.aliases.length > 12) throw new Error("A board keeps up to 12 merged cards’ new homes.");
      o.aliases = r.aliases.map((d) => {
        if (!Array.isArray(d) || d.length !== 2) throw new Error("A merged card’s new home is a pair of ids.");
        return [t.id(d[0]), t.id(d[1])];
      });
    }
    if (v) v.readBoard(r, o, t);
    else if (r.axes !== void 0 || r.owners !== void 0) throw new Error("This board needs its rules loaded.");
    n.nest = o;
  },
  validate: ve,
  planMove(e, n, t) {
    const r = k(e, n);
    return !r || !e.lanes.some((o) => o.id === t) ? null : r.laneId === t && !r.parentId ? e : Z(e, n, { laneId: t, under: null, before: null });
  },
  refusal(e, n, t) {
    const r = k(e, n);
    return r && t === _(e).tray && e.cards.some((o) => o.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + m(r.label) + " first." : null;
  },
  caption(e, n) {
    const t = v?.caption(e, n);
    if (t) return t;
    const r = e.cards.filter((d) => d.laneId === n).length;
    if (n === _(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const o = b(e, null, n).length;
    return e.nest?.layout === "clusters" ? o + (o === 1 ? " pile" : " piles") + " · " + (r - o) + (r - o === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: Te,
  noteText: (e, n) => n.label,
  fromNote: (e, n) => ({ label: n.replace(/\s+/g, " ").trim().slice(0, 80) }),
  renamed: (e, n, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: Ce
};
me(De);
export {
  se as byOrder,
  W as checkNest,
  Re as checkNestMove,
  Me as extend,
  Ie as isOrderKey,
  pe as nestAlias,
  _ as nestAreas,
  Te as nestCardText,
  P as nestDepth,
  Ee as nestDrags,
  $e as nestEmptyDrop,
  _e as nestFamily,
  b as nestKids,
  he as nestLegal,
  F as nestMeasure,
  X as nestMeasureWords,
  Z as nestPlace,
  le as nestRoots,
  De as nestRules,
  te as nestSentence,
  $ as nestSubtree,
  O as orderBetween,
  de as orderKeys,
  ze as registerNestPlus,
  j as roleOf,
  ce as tidyKeys,
  ve as validateNest
};
