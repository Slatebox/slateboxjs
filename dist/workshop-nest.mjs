import { registerWorkshopRules as ge, workshopEditKinds as G, workshopRuleSchema as Q, said as m, applyWorkshopEdits as ee, validateWorkshop as Ie, workshopReferences as ke } from "./workshop-model.mjs";
const D = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", ve = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function ne(e, n) {
  if (n !== null) {
    let o = 0;
    for (; (e[o] ?? "0") === n[o]; ) o++;
    if (o > 0) return n.slice(0, o) + ne(e.slice(o), n.slice(o));
  }
  const t = e ? D.indexOf(e[0]) : 0, r = n !== null ? D.indexOf(n[0]) : D.length;
  return r - t > 1 ? D[Math.round((t + r) / 2)] : n && n.length > 1 ? n.slice(0, 1) : D[t] + ne(e.slice(1), null);
}
function M(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return ne(e ?? "", n ?? null);
}
const se = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function de(e) {
  const n = [];
  for (let t = 0; t < e; t++) n.push(M(n[t - 1] ?? null, null));
  return n;
}
const L = 6, T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", z = (e) => e.charAt(0).toUpperCase() + e.slice(1), re = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, be = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
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
let b = null;
function $e(e) {
  b = e, Object.assign(oe, e.keys);
}
const S = (e, n, t) => {
  const r = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!r || r.length > n || /[<>\u0000-\u001f]/.test(r)) throw new Error(t);
  return r;
}, _ = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), k = (e, n) => n === void 0 ? void 0 : e.cards.find((t) => t.id === n);
function v(e, n, t) {
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
function xe(e, n) {
  return $(e, n).slice(1).map((t) => k(e, t)).filter((t) => !e.cards.some((r) => r.parentId === t.id));
}
function F(e, n, t) {
  const r = xe(e, n);
  if (t === "count") return r.length;
  if (t === "sources") return new Set(r.flatMap((d) => d.source ? [d.source.toLowerCase()] : [])).size;
  const o = /* @__PURE__ */ new Map();
  for (const d of r) {
    const i = d.fields?.[t];
    if (i === void 0) continue;
    const c = d.source ? d.source.toLowerCase() : "#" + d.id;
    o.set(c, Math.max(o.get(c) ?? 0, i));
  }
  return [...o.values()].reduce((d, i) => d + i, 0);
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
  const t = v(e, null, n), r = J(e);
  if (!r || n !== _(e).main) return t;
  const o = new Map(t.map((d) => [d.id, F(e, d.id, r)]));
  return t.sort((d, i) => o.get(i.id) - o.get(d.id) || se(d, i));
}
function Z(e, n, t) {
  const r = k(e, n);
  if (!r) return null;
  const o = $(e, n), d = t.under === null ? null : k(e, t.under);
  if (d === void 0 || d && o.includes(d.id)) return null;
  const i = d ? d.laneId : t.laneId, { tray: c } = _(e);
  if (i === c && (d || o.length > 1)) return null;
  const l = (d ? v(e, d.id) : v(e, null, i)).filter((y) => y.id !== n);
  let p = t.before === null ? l.length : l.findIndex((y) => y.id === t.before);
  p < 0 && (p = l.length);
  const w = d ? v(e, d.id) : v(e, null, i);
  if ((r.parentId ?? null) === (d?.id ?? null) && r.laneId === i && w.indexOf(r) === p) return e;
  const s = l[p - 1]?.order, a = l[p]?.order;
  let f = /* @__PURE__ */ new Map(), h;
  if ((p === 0 || s) && (p === l.length || a) && (!s || !a || s < a)) h = M(s, a);
  else {
    const y = de(l.length + 1);
    l.forEach((g, x) => f.set(g.id, y[x < p ? x : x + 1])), h = y[p];
  }
  const u = e.cards.map((y) => {
    if (y.id === n) {
      const I = { ...y, laneId: i, order: h };
      return d ? I.parentId = d.id : delete I.parentId, I;
    }
    const g = f.get(y.id), x = o.includes(y.id) ? i : y.laneId;
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
    o.sort(se).forEach((i, c) => t.set(i.id, d[c]));
  }
  return t.size ? { ...e, cards: e.cards.map((o) => t.has(o.id) ? { ...o, order: t.get(o.id) } : o) } : e;
}
function Ae(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = _(e), t = new Set((e.nest?.fields ?? []).map((o) => o.id));
  if (e.nest?.layout === "matrix" && !b) return "A 2 by 2 needs its rules loaded.";
  const r = J(e);
  if (r && r !== "count" && r !== "sources" && !t.has(r)) return "Cards on this board carry no " + r + ", so piles can’t rank by it.";
  for (const o of e.cards) {
    if (o.parentId !== void 0) {
      const i = k(e, o.parentId);
      if (!i) return m(o.label) + " sits under a card that is no longer on the board.";
      if (i.laneId !== o.laneId) return m(o.label) + " is in another area than the card it sits under.";
      if (o.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (P(e, o.id) > Math.min(L, e.cards.length)) return "Cards nest up to " + L + " levels deep, and never under themselves.";
    }
    if (Object.keys(o.fields ?? {}).find((i) => !t.has(i))) return m(o.label) + " has a number this board has no field for.";
  }
  return b?.validate(e) ?? null;
}
function te(e, n) {
  const t = e.severity === "warn" ? " (a warning only)" : "";
  let r = "";
  switch (e.kind) {
    case "nests":
      r = z(T(e.role)) + " sit under " + be(e.under.map(re));
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
      r = (b?.sentence(e, n) ?? e.kind).replace(/\.$/, "");
  }
  return r + t + ".";
}
const Y = ["nests", "depth", "children"];
function W(e, n) {
  const t = (e.behaviour?.rules ?? []).filter((l) => l.on && Y.includes(l.kind)).sort((l, p) => Y.indexOf(l.kind) - Y.indexOf(p.kind)), r = [];
  if (!t.length) return b?.check(e, n, r) ?? { ok: !0, warnings: r };
  const o = new Map(e.cards.map((l) => [l.id, l])), { tray: d } = _(n), i = n.cards.filter((l) => {
    const p = o.get(l.id);
    return l.laneId !== d && (!p || p.parentId !== l.parentId || p.laneId !== l.laneId || p.role !== l.role);
  }), c = (l, p) => l.cards.filter((w) => w.parentId === p).length;
  for (const l of t) {
    let p = null;
    if (l.kind === "nests") {
      const w = i.find((s) => s.role === l.role && !l.under.includes(k(n, s.parentId)?.role ?? ""));
      w && (p = { sentence: te({ ...l, severity: "refuse" }, e), card: w });
    } else if (l.kind === "depth") {
      const w = i.find((s) => P(n, s.id) + U(n, s.id) > l.max);
      w && (p = { sentence: te({ ...l, severity: "refuse" }, e) + " " + w.label + " would be " + (P(n, w.id) + U(n, w.id)) + " deep.", card: w });
    } else if (l.kind === "children")
      for (const w of i) {
        const s = k(n, w.parentId);
        if (!s || l.role && s.role !== l.role) continue;
        const a = c(e, s.id), f = c(n, s.id);
        if (f > l.max && f > a) {
          p = { sentence: s.label + " holds " + l.max + ". It has " + a + ".", card: w };
          break;
        }
      }
    if (p) {
      if (l.severity === "warn") {
        r.push(p.sentence);
        continue;
      }
      return { refused: { sentence: p.sentence, ruleId: l.id, set: l.set, cardId: p.card.id, laneId: p.card.laneId } };
    }
  }
  return b?.check(e, n, r) ?? { ok: !0, warnings: r };
}
function Ne(e) {
  const n = e.filter((o) => o.kind === "nests" && o.on && o.severity === "refuse"), t = /* @__PURE__ */ new Map(), r = (o, d) => {
    if (t.has(o)) return t.get(o);
    const i = n.find((l) => l.role === o);
    if (!i) return 0;
    if (d.includes(o)) return 1 / 0;
    const c = 1 + Math.min(...i.under.map((l) => r(l, [...d, o])));
    return d.length || t.set(o, c), c;
  };
  for (const o of n) t.set(o.role, r(o.role, []));
  return t;
}
function _e(e, n) {
  const t = /* @__PURE__ */ new Set();
  for (const d of e.rules) {
    if (!(d.kind in ue)) continue;
    const i = d.kind + ":" + (d.kind === "nests" ? d.role : d.kind === "children" ? d.role ?? "" : "");
    if (t.has(i))
      return d.kind === "nests" ? "There is already a rule for where " + T(d.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    t.add(i);
  }
  const r = Ne(e.rules), o = e.rules.find((d) => d.kind === "depth" && d.on && d.severity === "refuse");
  for (const [d, i] of r) {
    if (i === 1 / 0) return z(T(d)) + " could never be placed: what they sit under would have to sit under them first.";
    if (o && i > o.max) return z(T(d)) + " sit " + i + " levels down, but cards nest only " + o.max + " deep.";
  }
  return b?.contradiction(e, n) ?? null;
}
const ue = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" }, oe = { ...ue };
function Ee(e, n, t) {
  const r = Object.keys(e).find((i) => !["id", "on", "severity", "set", "kind", ...oe[e.kind].split(" ")].includes(i));
  if (r) throw new Error("A " + e.kind + " rule does not take " + r + ".");
  const o = (i, c, l) => {
    if (typeof i != "number" || !Number.isInteger(i) || i < 1 || i > c) throw new Error(l);
    return i;
  };
  switch (e.kind) {
    case "nests": {
      const i = j(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + T(i) + " sit under.");
      const c = [...new Set(e.under.map(j))];
      if (c.includes(i)) throw new Error(z(T(i)) + " can’t sit only under " + T(i) + ".");
      return { ...n, kind: "nests", role: i, under: c };
    }
    case "children": {
      const i = { ...n, kind: "children", max: o(e.max, 40, "A card holds from 1 to 40 cards under it.") };
      return e.role !== void 0 && (i.role = j(e.role)), i;
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
  const d = b?.read(e, n, t);
  if (d) return d;
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const Ce = {
  keys: oe,
  read: (e, n, t) => Ee(e, n, t),
  sentence: te,
  contradiction: _e,
  check: W,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, fe = (e, n) => !e.behaviour || !("refused" in W(e, n));
function pe(e, n) {
  if (!k(e, n)) return [];
  const r = [], o = new Set($(e, n)), d = U(e, n), i = [null, ...e.cards.filter((c) => !o.has(c.id) && c.laneId === _(e).main && P(e, c.id) + 1 + d <= L)];
  for (const c of e.lanes) for (const l of i) {
    if (l && c.id !== l.laneId) continue;
    const p = (l ? v(e, l.id) : v(e, null, c.id)).filter((w) => w.id !== n);
    for (let w = 0; w <= p.length; w++) {
      const s = { laneId: c.id, under: l?.id ?? null, before: p[w]?.id ?? null }, a = Z(e, n, s);
      a && (a === e || fe(e, a)) && r.push({ spot: s, next: a });
    }
  }
  return r;
}
function Re(e, n) {
  const t = k(e, n);
  if (!t) return null;
  const r = R(e, "emptyDrop")[0], { main: o, tray: d } = _(e), i = r?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!i) return null;
  let c;
  if (i === "unsorted") c = t.laneId === d ? null : Z(e, n, { laneId: d, under: null, before: null });
  else {
    if (e.cards.some((p) => p.parentId === n)) return null;
    const l = ee(e, [{ kind: "start_pile", card: { id: n } }]);
    c = "refused" in l ? null : l.workshop;
  }
  return c && c !== e && fe(e, c) ? c : null;
}
const Me = (e) => (b?.drags(e) ?? "") + JSON.stringify([
  e.nest?.layout,
  J(e),
  R(e, "emptyDrop")[0]?.kind && R(e, "emptyDrop")[0].drop,
  le(e, _(e).main).map((n) => n.id),
  e.cards.map((n) => pe(e, n.id).map(({ spot: t }) => t.under ?? t.laneId).filter((t, r, o) => o.indexOf(t) === r))
]);
function he(e, n) {
  let t = n;
  for (let r = 0; r < 12 && !k(e, t); r++) {
    const o = e.nest?.aliases?.find(([d]) => d === t)?.[1];
    if (!o) return null;
    t = o;
  }
  return k(e, t) ? t : null;
}
function We(e, n, t) {
  const r = Ie(e), o = ke(r), d = (u) => typeof u == "object" ? k(r, he(r, u.id) ?? "") : k(r, u) ?? o.cards.attempt(u) ?? void 0, i = d(n), c = t.under === void 0 ? null : d(t.under);
  if (!i || c === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null, overridable: !1 } };
  const l = { kind: "nest_card", card: { id: i.id }, ...c ? { under: { id: c.id } } : t.lane ? { lane: t.lane } : {} }, p = ee(r, [l]);
  if (!("refused" in p)) {
    const u = W(r, p.workshop);
    return { ok: !0, warnings: "warnings" in u ? u.warnings : [] };
  }
  const w = p.refused.reason, s = (r.behaviour?.rules ?? []).find((u) => {
    if (!u.on) return !1;
    const y = { ...r, behaviour: { ...r.behaviour, rules: [{ ...u, severity: "refuse" }] } }, g = ee(y, [l]);
    return "refused" in g && g.refused.reason === w;
  }), a = new Set(pe(r, i.id).flatMap(({ spot: u }) => u.under ? [u.under] : [])), h = (c ? [...v(r, c.id), ...c.parentId ? v(r, c.parentId) : v(r, null, c.laneId)] : []).find((u) => a.has(u.id) && u.id !== i.parentId)?.label ?? null;
  return { refused: { sentence: w, ruleId: s?.id ?? null, nearest: h, overridable: !1, ...s && { set: s.set } } };
}
const N = (e) => ({ type: "ref", of: "card", about: e }), C = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), A = ["nest"];
function Oe(e) {
  const n = (t) => G.find((r) => r.kind === t);
  for (const t of e.kinds) G.some((r) => r.kind === t.kind) || G.push(t);
  for (const [t, r] of Object.entries(e.boards)) for (const o of r) {
    const d = n(t);
    d.boards.includes(o) || (d.boards.push(o), delete d.refusals[o]);
  }
  for (const [t, r] of Object.entries(e.fields)) Object.assign(n(t).fields, r);
  Q.kinds.push(...e.rules.kinds.filter((t) => !Q.kinds.includes(t))), Object.assign(Q.keys, e.rules.keys);
}
Oe({
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
      fields: { card: N("The card."), label: C(80, "The pile’s name. Left out, “New pile”.", !0) },
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
      fields: { card: N("The card."), role: C(24, "A word or two.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: N("The card."), source: C(60, "Who said it.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: {
        label: C(20, "Its name."),
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
      fields: { card: N("The card."), field: C(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
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
      by: C(20, "Nest board: what piles rank by: count, sources, or a number field.", !0),
      drop: { type: "choice", values: ["new-pile", "unsorted"], optional: !0, about: "Nest board: where a far drop goes." }
    },
    add_card: { under: { ...N("Nest board: the card it goes under."), optional: !0 }, role: C(24, "Nest board: what it is.", !0), source: C(60, "Nest board: who said it.", !0) }
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
function ye(e, n) {
  const t = n === void 0 ? null : e.cards.find((o) => o.id === n) ?? null, r = me(e, t);
  return r && /^[a-z][a-z ]{0,30}$/.test(r) ? r : e.nest?.layout === "matrix" ? "idea" : e.nest?.layout === "clusters" ? "note" : "card";
}
function me(e, n) {
  return n ? (e.behaviour?.rules ?? []).find((r) => r.kind === "nests" && r.under.includes(n.role ?? ""))?.role ?? (n.role === "pile" ? "note" : void 0) : void 0;
}
const B = (e, n, t) => M(v(e, n, t).at(-1)?.order ?? null, null);
function Te(e, n, t) {
  const r = e, { main: o, tray: d } = _(r), i = r.lanes[1].label, c = (s, a, f) => t.settle(ce(s), a, f), l = b?.edit(r, n, t, c);
  if (l) return l;
  const p = (s) => {
    if (typeof s == "object" && !k(r, s.id)) {
      const a = he(r, s.id);
      if (a) return k(r, a);
    }
    return t.card(s);
  }, w = (s, a) => {
    const f = Z(r, s.id, a);
    return f || (a.under && $(r, s.id).includes(a.under) && t.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), t.refuse(i + " holds loose cards. Move what is under " + m(s.label) + " first.", { cardId: s.id, laneId: a.laneId })), c(f, a.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.nest?.layout === "matrix" ? r.lanes[1] : t.lane(n.lane), a = n.under === void 0 ? null : p(n.under), f = n.label?.replace(/\s+/g, " ").trim() || "New " + ye(r, a?.id);
      a && s.id === d && t.refuse(i + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const h = n.role === void 0 ? me(r, a) : j(n.role), u = { id: V(r), label: f, laneId: a?.laneId ?? s.id, ...h && { role: h }, ...a?.owner && { owner: a.owner }, ...n.source && { source: S(n.source, 60, "Say who said it in plain words.") } };
      if (!a && s.id === o && r.nest?.layout === "clusters" && n.role === void 0) {
        if ((R(r, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const K = c({ ...r, cards: [...r.cards, { ...u, laneId: d, order: B(r, null, d) }] }, d);
          return t.done(K, "Added " + m(f) + " to " + m(i) + ".", { laneId: d, cardId: u.id });
        }
        const x = { id: u.id, label: "New pile", laneId: o, role: "pile", order: B(r, null, o) }, I = { ...u, id: V({ ...r, cards: [...r.cards, x] }), parentId: x.id, role: h ?? "note", order: M(null, null) }, O = c({ ...r, cards: [...r.cards, x, I] }, o);
        return t.done(O, "Added " + m(f) + " to a new pile.", { laneId: o, cardId: I.id });
      }
      a && (u.parentId = a.id), u.order = B(r, a?.id ?? null, u.laneId);
      const y = c({ ...r, cards: [...r.cards, u] }, u.laneId);
      return t.done(y, "Added " + m(f) + " to " + m(a?.label ?? r.lanes.find((g) => g.id === u.laneId).label) + ".", { laneId: u.laneId, cardId: u.id });
    }
    case "nest_card": {
      const s = t.card(n.card), a = n.under === void 0 ? null : p(n.under), f = a?.laneId ?? (n.lane === void 0 ? s.laneId : t.lane(n.lane).id), h = n.before === void 0 ? null : t.card(n.before).id, u = w(s, { laneId: f, under: a?.id ?? null, before: h });
      if (u === r) return t.done(r, m(s.label) + " is there already.", { laneId: f, cardId: s.id });
      const y = a ? "under " + m(a.label) : f === d ? "to " + m(i) : "to the top of " + m(r.lanes[0].label);
      return t.done(u, "Moved " + m(s.label) + " " + y + ".", { laneId: f, cardId: s.id });
    }
    case "start_pile": {
      const s = t.card(n.card);
      r.cards.some((y) => y.parentId === s.id) && t.refuse(m(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const a = n.label === void 0 ? "New pile" : S(n.label, 80, "Name the pile in plain words."), f = { id: V(r), label: a, laneId: o, role: "pile", order: B(r, null, o) }, h = r.cards.map((y) => {
        if (y.id !== s.id) return y;
        const g = { ...y, laneId: o, parentId: f.id, order: M(null, null) };
        return (!g.role || g.role === "pile") && (g.role = "note"), g;
      }), u = c({ ...r, cards: [...h, f] }, o, s.id);
      return t.done(u, "Started a new pile, " + m(a) + ", with " + m(s.label) + " in it.", { laneId: o, cardId: f.id });
    }
    case "merge_cards": {
      const s = t.card(n.card), a = t.card(n.into);
      s.id === a.id && t.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), $(r, s.id).includes(a.id) && t.refuse(m(a.label) + " is under " + m(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (a.laneId === d || s.laneId === d) && t.refuse("Merge cards on the board, not in " + m(i) + ".", { cardId: s.id, laneId: d });
      const f = v(r, s.id);
      let h = v(r, a.id).at(-1)?.order ?? null;
      const u = new Map(f.map((I) => (h = M(h, null), [I.id, h]))), y = [...(r.nest.aliases ?? []).map(([I, O]) => [I, O === s.id ? a.id : O]), [s.id, a.id]].slice(-12), g = r.cards.filter((I) => I.id !== s.id).map((I) => u.has(I.id) ? { ...I, parentId: a.id, order: u.get(I.id) } : I), x = c({ ...r, nest: { ...r.nest, aliases: y }, cards: g }, a.laneId, a.id);
      return t.done(x, "Merged " + m(s.label) + " into " + m(a.label) + (f.length ? ": " + f.length + (f.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: a.laneId, cardId: a.id });
    }
    case "remove_card": {
      const s = t.card(n.card), a = v(r, s.id), f = (g) => {
        let x = !1, I = v(r, s.parentId ?? null, s.laneId).at(-1)?.order ?? null, O = v(r, null, d).at(-1)?.order ?? null;
        const K = new Map(a.map((E) => {
          const H = (g || !s.parentId) && !r.cards.some((q) => q.parentId === E.id);
          return x || (x = H), [E.id, H ? { laneId: d, order: O = M(O, null) } : { laneId: s.laneId, order: I = M(I, null), ...s.parentId && { parentId: s.parentId } }];
        })), we = r.cards.flatMap((E) => E.id === s.id ? [] : K.has(E.id) ? [(({ parentId: H, ...q }) => ({ ...q, ...K.get(E.id) }))(E)] : [E]);
        return { board: { ...r, cards: we }, tidy: x };
      };
      let h = f(!1);
      if (s.parentId && r.behaviour && "refused" in W(r, h.board)) {
        const g = f(!0);
        "refused" in W(r, g.board) || (h = g);
      }
      const { tidy: u } = h, y = c(h.board, s.laneId);
      return t.done(y, "Removed " + m(s.label) + "." + (a.length ? u ? " What was in it went to " + m(i) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = t.card(n.card);
      let a = "";
      try {
        a = j(n.role);
      } catch (h) {
        t.refuse(h.message, { cardId: s.id, laneId: s.laneId });
      }
      const f = c({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, role: a } : h) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " is " + re(a) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = t.card(n.card);
      let a = "";
      try {
        a = S(n.source, 60, "Say who said it in plain words.");
      } catch (h) {
        t.refuse(h.message, { cardId: s.id });
      }
      const f = c({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, source: a } : h) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " came from " + a + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = r.nest.fields ?? [];
      let a = "";
      try {
        a = S(n.label, 20, "Name the field in a word or two.");
      } catch (u) {
        t.refuse(u.message);
      }
      const f = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((u) => u.id === f || u.label.toLowerCase() === a.toLowerCase()) && t.refuse("Cards already carry " + a + "."), s.length >= 4 && t.refuse("Cards carry up to 4 number fields.");
      const h = c({ ...r, nest: { ...r.nest, fields: [...s, { id: f, label: a, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } }] } });
      return t.done(h, "Cards can carry " + a + (n.flag ? " (yes or no)" : "") + " now.");
    }
    case "set_field": {
      const s = t.card(n.card), a = (r.nest.fields ?? []).find((u) => u.id === n.field || u.label.toLowerCase() === String(n.field).toLowerCase());
      a || t.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && t.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const f = r.cards.map((u) => {
        if (u.id !== s.id) return u;
        const y = { ...u.fields };
        n.value === null ? delete y[a.id] : y[a.id] = n.value;
        const g = { ...u, fields: y };
        return Object.keys(y).length || delete g.fields, g;
      }), h = c({ ...r, cards: f }, s.laneId, s.id);
      return t.done(h, m(s.label) + (n.value === null ? " has no " + a.label + " now." : "’s " + a.label + " is " + (a.currency ? ae(n.value, a.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && t.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = c({ ...r, nest: { ...r.nest, layout: n.layout } });
      return t.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function Se(e, n) {
  const t = b?.cardText(e, n);
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
function je(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [t, r] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(t) || typeof r != "number" || !Number.isInteger(r) || r < 0 || r > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[t] = r;
  }
  return Object.keys(n).length ? n : void 0;
}
function De(e, n) {
  const t = JSON.stringify, r = (o) => t(o.cards.map((d) => [d.id, d.laneId, d.parentId, d.order, d.role]));
  return t(e.behaviour?.rules) !== t(n.behaviour?.rules) && r(e) !== r(n) ? "Change the rules on their own, then move cards." : null;
}
const Le = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: Ce,
  drags: Me,
  fixed: De,
  order: (e, n) => le(e, n).map((t) => t.id),
  readCard(e, n, t) {
    if (e.parentId !== void 0 && (n.parentId = t.id(e.parentId)), e.role !== void 0 && (n.role = j(e.role)), e.order !== void 0) {
      if (!ve(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = S(e.source, 60, "Say who said it in plain words."));
    const r = je(e.fields);
    if (r && (n.fields = r), b) b.readCard(e, n, t);
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
        const i = d ?? {};
        if (typeof i.id != "string" || !/^[a-z0-9-]{1,20}$/.test(i.id)) throw new Error("A field’s id is a short slug.");
        const c = { id: i.id, label: S(i.label, 20, "Name the field in a word or two.") };
        if (i.currency !== void 0) {
          if (i.currency !== "$" && i.currency !== "€" && i.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          c.currency = i.currency;
        }
        if (i.flag !== void 0) {
          if (i.flag !== !0 || i.currency !== void 0) throw new Error("A yes/no field is a flag, never money.");
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
    if (b) b.readBoard(r, o, t);
    else if (r.axes !== void 0 || r.owners !== void 0) throw new Error("This board needs its rules loaded.");
    n.nest = o;
  },
  validate: Ae,
  planMove(e, n, t) {
    const r = k(e, n);
    return !r || !e.lanes.some((o) => o.id === t) ? null : r.laneId === t && !r.parentId ? e : Z(e, n, { laneId: t, under: null, before: null });
  },
  refusal(e, n, t) {
    const r = k(e, n);
    return r && t === _(e).tray && e.cards.some((o) => o.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + m(r.label) + " first." : null;
  },
  caption(e, n) {
    const t = b?.caption(e, n);
    if (t) return t;
    const r = e.cards.filter((d) => d.laneId === n).length;
    if (n === _(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const o = v(e, null, n).length;
    return e.nest?.layout === "clusters" ? o + (o === 1 ? " pile" : " piles") + " · " + (r - o) + (r - o === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: Se,
  noteText: (e, n) => n.label,
  fromNote: (e, n, t) => ({ label: (n.replace(/\s+/g, " ").trim() || t).slice(0, 80) }),
  newCard: ye,
  renamed: (e, n, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: Te
};
ge(Le);
export {
  se as byOrder,
  W as checkNest,
  We as checkNestMove,
  Oe as extend,
  ve as isOrderKey,
  he as nestAlias,
  _ as nestAreas,
  Se as nestCardText,
  P as nestDepth,
  Me as nestDrags,
  Re as nestEmptyDrop,
  Ce as nestFamily,
  v as nestKids,
  pe as nestLegal,
  F as nestMeasure,
  X as nestMeasureWords,
  Z as nestPlace,
  le as nestRoots,
  Le as nestRules,
  te as nestSentence,
  $ as nestSubtree,
  M as orderBetween,
  de as orderKeys,
  $e as registerNestPlus,
  j as roleOf,
  ce as tidyKeys,
  Ae as validateNest
};
