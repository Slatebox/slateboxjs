import { registerWorkshopRules as ke, workshopEditKinds as Q, workshopRuleSchema as q, said as m, applyWorkshopEdits as ne, validateWorkshop as Ie, workshopReferences as be } from "./workshop-model.mjs";
const R = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", ve = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function re(e, n) {
  if (n !== null) {
    let o = 0;
    for (; (e[o] ?? "0") === n[o]; ) o++;
    if (o > 0) return n.slice(0, o) + re(e.slice(o), n.slice(o));
  }
  const t = e ? R.indexOf(e[0]) : 0, r = n !== null ? R.indexOf(n[0]) : R.length;
  return r - t > 1 ? R[Math.round((t + r) / 2)] : n && n.length > 1 ? n.slice(0, 1) : R[t] + re(e.slice(1), null);
}
function _(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return re(e ?? "", n ?? null);
}
const oe = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function ie(e) {
  const n = [];
  for (let t = 0; t < e; t++) n.push(_(n[t - 1] ?? null, null));
  return n;
}
const L = 6, T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", $ = (e) => e.charAt(0).toUpperCase() + e.slice(1), te = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, xe = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
function j(e) {
  const n = typeof e == "string" ? e.trim().toLowerCase().replace(/\s+/g, " ") : "";
  if (!/^[a-z][a-z -]{0,23}$/.test(n)) throw new Error("A role is a word or two, such as “pile” or “opportunity”.");
  return n;
}
const de = (e, n) => n + (e >= 1e6 ? Math.round(e / 1e5) / 10 + "M" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : String(e)), X = (e) => {
  let n = 1;
  for (; e.cards.some((t) => t.id === "card-" + n) || e.lanes.some((t) => t.id === "card-" + n); ) n++;
  return "card-" + n;
};
let x = null;
function We(e) {
  x = e, Object.assign(ae, e.keys);
}
const D = (e, n, t) => {
  const r = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!r || r.length > n || /[<>\u0000-\u001f]/.test(r)) throw new Error(t);
  return r;
}, C = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), b = (e, n) => n === void 0 ? void 0 : e.cards.find((t) => t.id === n);
function v(e, n, t) {
  return e.cards.filter((r) => (r.parentId ?? null) === n && (n !== null || r.laneId === t)).sort(oe);
}
function z(e, n) {
  const t = [n];
  for (let r = 0; r < t.length; r++) for (const o of e.cards) o.parentId === t[r] && t.push(o.id);
  return t;
}
function F(e, n) {
  let t = 0;
  for (let r = b(e, n); r?.parentId && t <= e.cards.length; r = b(e, r.parentId)) t++;
  return t;
}
function H(e, n) {
  const t = e.cards.filter((r) => r.parentId === n);
  return t.length ? 1 + Math.max(...t.map((r) => H(e, r.id))) : 0;
}
function Ae(e, n) {
  return z(e, n).slice(1).map((t) => b(e, t)).filter((t) => !e.cards.some((r) => r.parentId === t.id));
}
function B(e, n, t) {
  const r = Ae(e, n);
  if (t === "count") return r.length;
  if (t === "sources") return new Set(r.flatMap((i) => i.source ? [i.source.toLowerCase()] : [])).size;
  const o = /* @__PURE__ */ new Map();
  for (const i of r) {
    const a = i.fields?.[t];
    if (a === void 0) continue;
    const d = i.source ? i.source.toLowerCase() : "#" + i.id;
    o.set(d, Math.max(o.get(d) ?? 0, a));
  }
  return [...o.values()].reduce((i, a) => i + a, 0);
}
const ce = (e, n) => e.nest?.fields?.find((t) => t.id === n);
function Y(e, n, t) {
  if (n === "count") return t + (t === 1 ? " note" : " notes");
  if (n === "sources") return t + (t === 1 ? " customer" : " customers");
  const r = ce(e, n);
  return (r?.currency ? de(t, r.currency) : String(t)) + " " + (r?.label ?? n);
}
const W = (e, n) => (e.behaviour?.rules ?? []).filter((t) => t.on && t.kind === n), J = (e) => W(e, "rank")[0]?.by;
function ue(e, n) {
  const t = v(e, null, n), r = J(e);
  if (!r || n !== C(e).main) return t;
  const o = new Map(t.map((i) => [i.id, B(e, i.id, r)]));
  return t.sort((i, a) => o.get(a.id) - o.get(i.id) || oe(i, a));
}
function Z(e, n, t) {
  const r = b(e, n);
  if (!r) return null;
  const o = z(e, n), i = t.under === null ? null : b(e, t.under);
  if (i === void 0 || i && o.includes(i.id)) return null;
  const a = i ? i.laneId : t.laneId, { tray: d } = C(e);
  if (a === d && (i || o.length > 1)) return null;
  const c = (i ? v(e, i.id) : v(e, null, a)).filter((y) => y.id !== n);
  let p = t.before === null ? c.length : c.findIndex((y) => y.id === t.before);
  p < 0 && (p = c.length);
  const w = i ? v(e, i.id) : v(e, null, a);
  if ((r.parentId ?? null) === (i?.id ?? null) && r.laneId === a && w.indexOf(r) === p) return e;
  const s = c[p - 1]?.order, l = c[p]?.order;
  let f = /* @__PURE__ */ new Map(), h;
  if ((p === 0 || s) && (p === c.length || l) && (!s || !l || s < l)) h = _(s, l);
  else {
    const y = ie(c.length + 1);
    c.forEach((g, A) => f.set(g.id, y[A < p ? A : A + 1])), h = y[p];
  }
  const u = e.cards.map((y) => {
    if (y.id === n) {
      const I = { ...y, laneId: a, order: h };
      return i ? I.parentId = i.id : delete I.parentId, I;
    }
    const g = f.get(y.id), A = o.includes(y.id) ? a : y.laneId;
    return g || A !== y.laneId ? { ...y, laneId: A, ...g && { order: g } } : y;
  });
  return fe({ ...e, cards: u });
}
function fe(e) {
  var r;
  const n = {}, t = /* @__PURE__ */ new Map();
  for (const o of e.cards) (n[r = o.parentId ?? "#" + o.laneId] ?? (n[r] = [])).push(o);
  for (const o of Object.values(n)) if (o.some((i) => i.order?.length > 16)) {
    const i = ie(o.length);
    o.sort(oe).forEach((a, d) => t.set(a.id, i[d]));
  }
  return t.size ? { ...e, cards: e.cards.map((o) => t.has(o.id) ? { ...o, order: t.get(o.id) } : o) } : e;
}
function Se(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = C(e), t = new Set((e.nest?.fields ?? []).map((o) => o.id));
  if (e.nest?.layout === "matrix" && !x) return "A 2 by 2 needs its rules loaded.";
  const r = J(e);
  if (r && r !== "count" && r !== "sources" && !t.has(r)) return "Cards on this board carry no " + r + ", so piles can’t rank by it.";
  for (const o of e.cards) {
    if (o.parentId !== void 0) {
      const a = b(e, o.parentId);
      if (!a) return m(o.label) + " sits under a card that is no longer on the board.";
      if (a.laneId !== o.laneId) return m(o.label) + " is in another area than the card it sits under.";
      if (o.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (F(e, o.id) > Math.min(L, e.cards.length)) return "Cards nest up to " + L + " levels deep, and never under themselves.";
    }
    if (Object.keys(o.fields ?? {}).find((a) => !t.has(a))) return m(o.label) + " has a number this board has no field for.";
  }
  return x?.validate(e) ?? null;
}
function se(e, n) {
  const t = e.severity === "warn" ? " (a warning only)" : "";
  let r = "";
  switch (e.kind) {
    case "nests":
      r = $(T(e.role)) + " sit under " + xe(e.under.map(te));
      break;
    case "children":
      r = e.role ? $(te(e.role)) + " holds at most " + e.max : "A card holds at most " + e.max + " under it";
      break;
    case "depth":
      r = e.max === 1 ? "Cards nest one level deep" : "Cards nest up to " + e.max + " levels deep";
      break;
    case "rank":
      r = "Piles rank by " + (e.by === "count" ? "number of notes" : e.by === "sources" ? "number of customers" : ce(n, e.by)?.label ?? e.by);
      break;
    case "emptyDrop":
      r = "A card let go in empty space " + (e.drop === "new-pile" ? "starts a new pile" : "goes to " + n.lanes[1].label);
      break;
    default:
      r = (x?.sentence(e, n) ?? e.kind).replace(/\.$/, "");
  }
  return r + t + ".";
}
const ee = ["nests", "depth", "children"];
function P(e, n) {
  const t = (e.behaviour?.rules ?? []).filter((c) => c.on && ee.includes(c.kind)).sort((c, p) => ee.indexOf(c.kind) - ee.indexOf(p.kind)), r = [];
  if (!t.length) return x?.check(e, n, r) ?? { ok: !0, warnings: r };
  const o = new Map(e.cards.map((c) => [c.id, c])), { tray: i } = C(n), a = n.cards.filter((c) => {
    const p = o.get(c.id);
    return c.laneId !== i && (!p || p.parentId !== c.parentId || p.laneId !== c.laneId || p.role !== c.role);
  }), d = (c, p) => c.cards.filter((w) => w.parentId === p).length;
  for (const c of t) {
    let p = null;
    if (c.kind === "nests") {
      const w = a.find((s) => s.role === c.role && !c.under.includes(b(n, s.parentId)?.role ?? ""));
      w && (p = { sentence: se({ ...c, severity: "refuse" }, e), card: w });
    } else if (c.kind === "depth") {
      const w = a.find((s) => F(n, s.id) + H(n, s.id) > c.max);
      w && (p = { sentence: se({ ...c, severity: "refuse" }, e) + " " + w.label + " would be " + (F(n, w.id) + H(n, w.id)) + " deep.", card: w });
    } else if (c.kind === "children")
      for (const w of a) {
        const s = b(n, w.parentId);
        if (!s || c.role && s.role !== c.role) continue;
        const l = d(e, s.id), f = d(n, s.id);
        if (f > c.max && f > l) {
          p = { sentence: s.label + " holds " + c.max + ". It has " + l + ".", card: w };
          break;
        }
      }
    if (p) {
      if (c.severity === "warn") {
        r.push(p.sentence);
        continue;
      }
      return { refused: { sentence: p.sentence, ruleId: c.id, set: c.set, cardId: p.card.id, laneId: p.card.laneId } };
    }
  }
  return x?.check(e, n, r) ?? { ok: !0, warnings: r };
}
function Ne(e) {
  const n = e.filter((o) => o.kind === "nests" && o.on && o.severity === "refuse"), t = /* @__PURE__ */ new Map(), r = (o, i) => {
    if (t.has(o)) return t.get(o);
    const a = n.find((c) => c.role === o);
    if (!a) return 0;
    if (i.includes(o)) return 1 / 0;
    const d = 1 + Math.min(...a.under.map((c) => r(c, [...i, o])));
    return i.length || t.set(o, d), d;
  };
  for (const o of n) t.set(o.role, r(o.role, []));
  return t;
}
function Ce(e, n) {
  const t = /* @__PURE__ */ new Set();
  for (const i of e.rules) {
    if (!(i.kind in pe)) continue;
    const a = i.kind + ":" + (i.kind === "nests" ? i.role : i.kind === "children" ? i.role ?? "" : "");
    if (t.has(a))
      return i.kind === "nests" ? "There is already a rule for where " + T(i.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    t.add(a);
  }
  const r = Ne(e.rules), o = e.rules.find((i) => i.kind === "depth" && i.on && i.severity === "refuse");
  for (const [i, a] of r) {
    if (a === 1 / 0) return $(T(i)) + " could never be placed: what they sit under would have to sit under them first.";
    if (o && a > o.max) return $(T(i)) + " sit " + a + " levels down, but cards nest only " + o.max + " deep.";
  }
  return x?.contradiction(e, n) ?? null;
}
const pe = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" }, ae = { ...pe };
function Ee(e, n, t) {
  const r = Object.keys(e).find((a) => !["id", "on", "severity", "set", "kind", ...ae[e.kind].split(" ")].includes(a));
  if (r) throw new Error("A " + e.kind + " rule does not take " + r + ".");
  const o = (a, d, c) => {
    if (typeof a != "number" || !Number.isInteger(a) || a < 1 || a > d) throw new Error(c);
    return a;
  };
  switch (e.kind) {
    case "nests": {
      const a = j(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + T(a) + " sit under.");
      const d = [...new Set(e.under.map(j))];
      if (d.includes(a)) throw new Error($(T(a)) + " can’t sit only under " + T(a) + ".");
      return { ...n, kind: "nests", role: a, under: d };
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
  const i = x?.read(e, n, t);
  if (i) return i;
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const Oe = {
  keys: ae,
  read: (e, n, t) => Ee(e, n, t),
  sentence: se,
  contradiction: Ce,
  check: P,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, le = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((n, t) => ({ id: "rule-" + (t + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...n }))
}), he = (e, n) => !e.behaviour || !("refused" in P(e, n));
function ye(e, n) {
  if (!b(e, n)) return [];
  const r = [], o = new Set(z(e, n)), i = H(e, n), a = [null, ...e.cards.filter((d) => !o.has(d.id) && d.laneId === C(e).main && F(e, d.id) + 1 + i <= L)];
  for (const d of e.lanes) for (const c of a) {
    if (c && d.id !== c.laneId) continue;
    const p = (c ? v(e, c.id) : v(e, null, d.id)).filter((w) => w.id !== n);
    for (let w = 0; w <= p.length; w++) {
      const s = { laneId: d.id, under: c?.id ?? null, before: p[w]?.id ?? null }, l = Z(e, n, s);
      l && (l === e || he(e, l)) && r.push({ spot: s, next: l });
    }
  }
  return r;
}
function Pe(e, n) {
  const t = b(e, n);
  if (!t) return null;
  const r = W(e, "emptyDrop")[0], { main: o, tray: i } = C(e), a = r?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!a) return null;
  let d;
  if (a === "unsorted") d = t.laneId === i ? null : Z(e, n, { laneId: i, under: null, before: null });
  else {
    if (e.cards.some((p) => p.parentId === n)) return null;
    const c = ne(e, [{ kind: "start_pile", card: { id: n } }]);
    d = "refused" in c ? null : c.workshop;
  }
  return d && d !== e && he(e, d) ? d : null;
}
const _e = (e) => (x?.drags(e) ?? "") + JSON.stringify([
  e.nest?.layout,
  J(e),
  W(e, "emptyDrop")[0]?.kind && W(e, "emptyDrop")[0].drop,
  ue(e, C(e).main).map((n) => n.id),
  e.cards.map((n) => ye(e, n.id).map(({ spot: t }) => t.under ?? t.laneId).filter((t, r, o) => o.indexOf(t) === r))
]);
function me(e, n) {
  let t = n;
  for (let r = 0; r < 12 && !b(e, t); r++) {
    const o = e.nest?.aliases?.find(([i]) => i === t)?.[1];
    if (!o) return null;
    t = o;
  }
  return b(e, t) ? t : null;
}
function Ke(e, n, t) {
  const r = Ie(e), o = be(r), i = (u) => typeof u == "object" ? b(r, me(r, u.id) ?? "") : b(r, u) ?? o.cards.attempt(u) ?? void 0, a = i(n), d = t.under === void 0 ? null : i(t.under);
  if (!a || d === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null } };
  const c = { kind: "nest_card", card: { id: a.id }, ...d ? { under: { id: d.id } } : t.lane ? { lane: t.lane } : {} }, p = ne(r, [c]);
  if (!("refused" in p)) {
    const u = P(r, p.workshop);
    return { ok: !0, warnings: "warnings" in u ? u.warnings : [] };
  }
  const w = p.refused.reason, s = (r.behaviour?.rules ?? []).find((u) => {
    if (!u.on) return !1;
    const y = { ...r, behaviour: { ...r.behaviour, rules: [{ ...u, severity: "refuse" }] } }, g = ne(y, [c]);
    return "refused" in g && g.refused.reason === w;
  }), l = new Set(ye(r, a.id).flatMap(({ spot: u }) => u.under ? [u.under] : [])), h = (d ? [...v(r, d.id), ...d.parentId ? v(r, d.parentId) : v(r, null, d.laneId)] : []).find((u) => l.has(u.id) && u.id !== a.parentId)?.label ?? null;
  return { refused: { sentence: w, ruleId: s?.id ?? null, nearest: h, ...s && { set: s.set } } };
}
const N = (e) => ({ type: "ref", of: "card", about: e }), O = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), S = ["nest"];
function Me(e) {
  const n = (t) => Q.find((r) => r.kind === t);
  for (const t of e.kinds) Q.some((r) => r.kind === t.kind) || Q.push(t);
  for (const [t, r] of Object.entries(e.boards)) for (const o of r) {
    const i = n(t);
    i.boards.includes(o) || (i.boards.push(o), delete i.refusals[o]);
  }
  for (const [t, r] of Object.entries(e.fields)) Object.assign(n(t).fields, r);
  q.kinds.push(...e.rules.kinds.filter((t) => !q.kinds.includes(t))), Object.assign(q.keys, e.rules.keys);
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
      boards: S,
      refusals: {}
    },
    {
      kind: "start_pile",
      summary: "Nest board: start a new pile with this card in it.",
      intent: !0,
      fields: { card: N("The card."), label: O(80, "The pile’s name. Left out, “New pile”.", !0) },
      boards: S,
      refusals: {}
    },
    {
      kind: "merge_cards",
      summary: "Nest board: merge a card into another. What was under it goes under that one; a drop still on its way lands there too.",
      intent: !1,
      fields: { card: N("The card that goes."), into: N("The card it merges into.") },
      boards: S,
      refusals: {}
    },
    {
      kind: "set_role",
      summary: "Nest board: say what a card is (pile, outcome, opportunity, solution, cause, action…).",
      intent: !1,
      fields: { card: N("The card."), role: O(24, "A word or two.") },
      boards: S,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: N("The card."), source: O(60, "Who said it.") },
      boards: S,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: {
        label: O(20, "Its name."),
        currency: { type: "choice", values: ["$", "€", "£"], optional: !0, about: "A money field’s sign." },
        flag: { type: "flag", optional: !0, about: "A yes/no field (contractor…): cards carry 1 for yes." }
      },
      boards: S,
      refusals: {}
    },
    {
      kind: "set_field",
      summary: "Nest board: set (or with null clear) a card’s number in a field.",
      intent: !1,
      fields: { card: N("The card."), field: O(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
      boards: S,
      refusals: {}
    },
    {
      kind: "set_layout",
      summary: "Nest board: draw it as piles or as a tree (a phone shows an outline).",
      intent: !1,
      fields: { layout: { type: "choice", values: ["clusters", "tree"], about: "clusters or tree." } },
      boards: S,
      refusals: {}
    }
  ],
  boards: { add_rule: S, set_rule: S, remove_rule: S },
  fields: {
    set_rule: {
      under: { type: "refs", of: "card", min: 1, max: 4, optional: !0, about: "Nest board: the roles a role may sit under (words, such as opportunity)." },
      by: O(20, "Nest board: what piles rank by: count, sources, or a number field.", !0),
      drop: { type: "choice", values: ["new-pile", "unsorted"], optional: !0, about: "Nest board: where a far drop goes." }
    },
    add_card: { under: { ...N("Nest board: the card it goes under."), optional: !0 }, role: O(24, "Nest board: what it is.", !0), source: O(60, "Nest board: who said it.", !0) }
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
function Te(e, n) {
  return n ? (e.behaviour?.rules ?? []).find((r) => r.kind === "nests" && r.under.includes(n.role ?? ""))?.role ?? (n.role === "pile" ? "note" : void 0) : void 0;
}
const U = (e, n, t) => _(v(e, n, t).at(-1)?.order ?? null, null);
function De(e, n, t) {
  const r = e, { main: o, tray: i } = C(r), a = r.lanes[1].label, d = (s, l, f) => t.settle(fe(s), l, f), c = x?.edit(r, n, t, d);
  if (c) return c;
  const p = (s) => {
    if (typeof s == "object" && !b(r, s.id)) {
      const l = me(r, s.id);
      if (l) return b(r, l);
    }
    return t.card(s);
  }, w = (s, l) => {
    const f = Z(r, s.id, l);
    return f || (l.under && z(r, s.id).includes(l.under) && t.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), t.refuse(a + " holds loose cards. Move what is under " + m(s.label) + " first.", { cardId: s.id, laneId: l.laneId })), d(f, l.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.nest?.layout === "matrix" ? r.lanes[1] : t.lane(n.lane), l = n.label?.replace(/\s+/g, " ").trim();
      l || t.refuse("Say what the card should say, such as “Add a note called Slow exports to Reporting”.", { laneId: s.id });
      const f = n.under === void 0 ? null : p(n.under);
      f && s.id === i && t.refuse(a + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const h = n.role === void 0 ? Te(r, f) : j(n.role), u = { id: X(r), label: l, laneId: f?.laneId ?? s.id, ...h && { role: h }, ...f?.owner && { owner: f.owner }, ...n.source && { source: D(n.source, 60, "Say who said it in plain words.") } };
      if (!f && s.id === o && r.nest?.layout === "clusters" && n.role === void 0) {
        if ((W(r, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const K = d({ ...r, cards: [...r.cards, { ...u, laneId: i, order: U(r, null, i) }] }, i);
          return t.done(K, "Added " + m(l) + " to " + m(a) + ".", { laneId: i, cardId: u.id });
        }
        const A = { id: u.id, label: "New pile", laneId: o, role: "pile", order: U(r, null, o) }, I = { ...u, id: X({ ...r, cards: [...r.cards, A] }), parentId: A.id, role: h ?? "note", order: _(null, null) }, M = d({ ...r, cards: [...r.cards, A, I] }, o);
        return t.done(M, "Added " + m(l) + " to a new pile.", { laneId: o, cardId: I.id });
      }
      f && (u.parentId = f.id), u.order = U(r, f?.id ?? null, u.laneId);
      const y = d({ ...r, cards: [...r.cards, u] }, u.laneId);
      return t.done(y, "Added " + m(l) + " to " + m(f?.label ?? r.lanes.find((g) => g.id === u.laneId).label) + ".", { laneId: u.laneId, cardId: u.id });
    }
    case "nest_card": {
      const s = t.card(n.card), l = n.under === void 0 ? null : p(n.under), f = l?.laneId ?? (n.lane === void 0 ? s.laneId : t.lane(n.lane).id), h = n.before === void 0 ? null : t.card(n.before).id, u = w(s, { laneId: f, under: l?.id ?? null, before: h });
      if (u === r) return t.done(r, m(s.label) + " is there already.", { laneId: f, cardId: s.id });
      const y = l ? "under " + m(l.label) : f === i ? "to " + m(a) : "to the top of " + m(r.lanes[0].label);
      return t.done(u, "Moved " + m(s.label) + " " + y + ".", { laneId: f, cardId: s.id });
    }
    case "start_pile": {
      const s = t.card(n.card);
      r.cards.some((y) => y.parentId === s.id) && t.refuse(m(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const l = n.label === void 0 ? "New pile" : D(n.label, 80, "Name the pile in plain words."), f = { id: X(r), label: l, laneId: o, role: "pile", order: U(r, null, o) }, h = r.cards.map((y) => {
        if (y.id !== s.id) return y;
        const g = { ...y, laneId: o, parentId: f.id, order: _(null, null) };
        return (!g.role || g.role === "pile") && (g.role = "note"), g;
      }), u = d({ ...r, cards: [...h, f] }, o, s.id);
      return t.done(u, "Started a new pile, " + m(l) + ", with " + m(s.label) + " in it.", { laneId: o, cardId: f.id });
    }
    case "merge_cards": {
      const s = t.card(n.card), l = t.card(n.into);
      s.id === l.id && t.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), z(r, s.id).includes(l.id) && t.refuse(m(l.label) + " is under " + m(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (l.laneId === i || s.laneId === i) && t.refuse("Merge cards on the board, not in " + m(a) + ".", { cardId: s.id, laneId: i });
      const f = v(r, s.id);
      let h = v(r, l.id).at(-1)?.order ?? null;
      const u = new Map(f.map((I) => (h = _(h, null), [I.id, h]))), y = [...(r.nest.aliases ?? []).map(([I, M]) => [I, M === s.id ? l.id : M]), [s.id, l.id]].slice(-12), g = r.cards.filter((I) => I.id !== s.id).map((I) => u.has(I.id) ? { ...I, parentId: l.id, order: u.get(I.id) } : I), A = d({ ...r, nest: { ...r.nest, aliases: y }, cards: g }, l.laneId, l.id);
      return t.done(A, "Merged " + m(s.label) + " into " + m(l.label) + (f.length ? ": " + f.length + (f.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: l.laneId, cardId: l.id });
    }
    case "remove_card": {
      const s = t.card(n.card), l = v(r, s.id), f = (g) => {
        let A = !1, I = v(r, s.parentId ?? null, s.laneId).at(-1)?.order ?? null, M = v(r, null, i).at(-1)?.order ?? null;
        const K = new Map(l.map((E) => {
          const G = (g || !s.parentId) && !r.cards.some((V) => V.parentId === E.id);
          return A || (A = G), [E.id, G ? { laneId: i, order: M = _(M, null) } : { laneId: s.laneId, order: I = _(I, null), ...s.parentId && { parentId: s.parentId } }];
        })), ge = r.cards.flatMap((E) => E.id === s.id ? [] : K.has(E.id) ? [(({ parentId: G, ...V }) => ({ ...V, ...K.get(E.id) }))(E)] : [E]);
        return { board: { ...r, cards: ge }, tidy: A };
      };
      let h = f(!1);
      if (s.parentId && r.behaviour && "refused" in P(r, h.board)) {
        const g = f(!0);
        "refused" in P(r, g.board) || (h = g);
      }
      const { tidy: u } = h, y = d(h.board, s.laneId);
      return t.done(y, "Removed " + m(s.label) + "." + (l.length ? u ? " What was in it went to " + m(a) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = t.card(n.card);
      let l = "";
      try {
        l = j(n.role);
      } catch (h) {
        t.refuse(h.message, { cardId: s.id, laneId: s.laneId });
      }
      const f = d({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, role: l } : h) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " is " + te(l) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = t.card(n.card);
      let l = "";
      try {
        l = D(n.source, 60, "Say who said it in plain words.");
      } catch (h) {
        t.refuse(h.message, { cardId: s.id });
      }
      const f = d({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, source: l } : h) }, s.laneId, s.id);
      return t.done(f, m(s.label) + " came from " + l + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = r.nest.fields ?? [];
      let l = "";
      try {
        l = D(n.label, 20, "Name the field in a word or two.");
      } catch (u) {
        t.refuse(u.message);
      }
      const f = l.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((u) => u.id === f || u.label.toLowerCase() === l.toLowerCase()) && t.refuse("Cards already carry " + l + "."), s.length >= 4 && t.refuse("Cards carry up to 4 number fields.");
      const h = d({ ...r, nest: { ...r.nest, fields: [...s, { id: f, label: l, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } }] } });
      return t.done(h, "Cards can carry " + l + (n.flag ? " (yes or no)" : "") + " now.");
    }
    case "set_field": {
      const s = t.card(n.card), l = (r.nest.fields ?? []).find((u) => u.id === n.field || u.label.toLowerCase() === String(n.field).toLowerCase());
      l || t.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && t.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const f = r.cards.map((u) => {
        if (u.id !== s.id) return u;
        const y = { ...u.fields };
        n.value === null ? delete y[l.id] : y[l.id] = n.value;
        const g = { ...u, fields: y };
        return Object.keys(y).length || delete g.fields, g;
      }), h = d({ ...r, cards: f }, s.laneId, s.id);
      return t.done(h, m(s.label) + (n.value === null ? " has no " + l.label + " now." : "’s " + l.label + " is " + (l.currency ? de(n.value, l.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && t.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = d({ ...r, nest: { ...r.nest, layout: n.layout } });
      return t.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function je(e, n) {
  const t = x?.cardText(e, n);
  if (t != null) return t;
  if (e.cards.some((r) => r.parentId === n.id) || n.role === "pile") {
    const r = [Y(e, "count", B(e, n.id, "count"))];
    if (e.nest?.layout === "clusters") {
      const o = B(e, n.id, "sources");
      o && r.push(Y(e, "sources", o));
      const i = J(e);
      i && i !== "count" && i !== "sources" && r.push(Y(e, i, B(e, n.id, i)));
    }
    return n.label + `
` + r.join(" · ");
  }
  return n.source ? n.label + `
— ` + n.source : n.label;
}
function Re(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [t, r] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(t) || typeof r != "number" || !Number.isInteger(r) || r < 0 || r > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[t] = r;
  }
  return Object.keys(n).length ? n : void 0;
}
function Le(e, n) {
  const t = JSON.stringify, r = (o) => t(o.cards.map((i) => [i.id, i.laneId, i.parentId, i.order, i.role]));
  return t(e.behaviour?.rules) !== t(n.behaviour?.rules) && r(e) !== r(n) ? "Change the rules on their own, then move cards." : null;
}
const $e = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: Oe,
  drags: _e,
  fixed: Le,
  order: (e, n) => ue(e, n).map((t) => t.id),
  readCard(e, n, t) {
    if (e.parentId !== void 0 && (n.parentId = t.id(e.parentId)), e.role !== void 0 && (n.role = j(e.role)), e.order !== void 0) {
      if (!ve(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = D(e.source, 60, "Say who said it in plain words."));
    const r = Re(e.fields);
    if (r && (n.fields = r), x) x.readCard(e, n, t);
    else if (e.owner !== void 0) throw new Error("This board needs its rules loaded.");
  },
  readBoard(e, n, t) {
    const r = e.nest;
    if (!r || typeof r != "object" || Array.isArray(r)) throw new Error("A nested board says how it is drawn.");
    if (r.layout !== "clusters" && r.layout !== "tree" && r.layout !== "matrix") throw new Error("A nested board is drawn as piles, as a tree or as a 2 by 2.");
    const o = { layout: r.layout };
    if (r.fields !== void 0) {
      if (!Array.isArray(r.fields) || r.fields.length > 4) throw new Error("Cards carry up to 4 number fields.");
      if (o.fields = r.fields.map((i) => {
        const a = i ?? {};
        if (typeof a.id != "string" || !/^[a-z0-9-]{1,20}$/.test(a.id)) throw new Error("A field’s id is a short slug.");
        const d = { id: a.id, label: D(a.label, 20, "Name the field in a word or two.") };
        if (a.currency !== void 0) {
          if (a.currency !== "$" && a.currency !== "€" && a.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          d.currency = a.currency;
        }
        if (a.flag !== void 0) {
          if (a.flag !== !0 || a.currency !== void 0) throw new Error("A yes/no field is a flag, never money.");
          d.flag = !0;
        }
        return d;
      }), new Set(o.fields.map((i) => i.id)).size !== o.fields.length) throw new Error("Duplicate field.");
    }
    if (r.aliases !== void 0) {
      if (!Array.isArray(r.aliases) || r.aliases.length > 12) throw new Error("A board keeps up to 12 merged cards’ new homes.");
      o.aliases = r.aliases.map((i) => {
        if (!Array.isArray(i) || i.length !== 2) throw new Error("A merged card’s new home is a pair of ids.");
        return [t.id(i[0]), t.id(i[1])];
      });
    }
    if (x) x.readBoard(r, o, t);
    else if (r.axes !== void 0 || r.owners !== void 0) throw new Error("This board needs its rules loaded.");
    n.nest = o;
  },
  validate: Se,
  planMove(e, n, t) {
    const r = b(e, n);
    return !r || !e.lanes.some((o) => o.id === t) ? null : r.laneId === t && !r.parentId ? e : Z(e, n, { laneId: t, under: null, before: null });
  },
  refusal(e, n, t) {
    const r = b(e, n);
    return r && t === C(e).tray && e.cards.some((o) => o.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + m(r.label) + " first." : null;
  },
  caption(e, n) {
    const t = x?.caption(e, n);
    if (t) return t;
    const r = e.cards.filter((i) => i.laneId === n).length;
    if (n === C(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const o = v(e, null, n).length;
    return e.nest?.layout === "clusters" ? o + (o === 1 ? " pile" : " piles") + " · " + (r - o) + (r - o === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: je,
  noteText: (e, n) => n.label,
  fromNote: (e, n) => ({ label: n.replace(/\s+/g, " ").trim().slice(0, 80) }),
  renamed: (e, n, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: De
};
ke($e);
function k(e, n, t) {
  const r = ie(n.length);
  return n.map(([o, i, a], d) => ({ id: o, label: i, laneId: e, order: r[d], ...t && { parentId: t }, ...a }));
}
function Ue() {
  const e = (n, t) => ({ role: "note", source: n, fields: { arr: t } });
  return {
    version: 1,
    kind: "nest",
    title: "Sort the evidence",
    nest: { layout: "clusters", fields: [{ id: "arr", label: "ARR", currency: "$" }] },
    lanes: [{ id: "piles", label: "Piles" }, { id: "unsorted", label: "Unsorted" }],
    cards: [
      ...k("piles", [["onboarding", "Onboarding", { role: "pile" }], ["reporting", "Reporting", { role: "pile" }], ["pricing", "Pricing", { role: "pile" }]]),
      ...k("piles", [
        ["setup-days", "Setup took two days", e("Acme", 24e3)],
        ["where-start", "Didn’t know where to start", e("Globex", 36e3)],
        ["invites", "Invite flow is confusing", e("Initech", 12e3)]
      ], "onboarding"),
      ...k("piles", [["csv-export", "Couldn’t find CSV export", e("Acme", 24e3)], ["finance-match", "Charts don’t match finance", e("Umbrella", 6e4)]], "reporting"),
      ...k("piles", [["seats", "Seats are too expensive", e("Initech", 12e3)], ["annual", "Want annual billing", e("Hooli", 3e4)]], "pricing"),
      ...k("unsorted", [["trust", "I don’t trust the numbers", e("Umbrella", 6e4)], ["mobile", "Mobile app please", e("Hooli", 3e4)]])
    ],
    behaviour: le([{ kind: "nests", role: "note", under: ["pile"] }, { kind: "depth", max: 1 }, { kind: "rank", by: "sources" }, { kind: "emptyDrop", drop: "new-pile" }])
  };
}
function Be() {
  return {
    version: 1,
    kind: "nest",
    title: "Discovery tree",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "Discovery tree" }, { id: "parked", label: "Parked ideas" }],
    cards: [
      ...k("tree", [["outcome", "Activation to 40%", { role: "outcome" }]]),
      ...k("tree", [
        ["slow-onboarding", "Onboarding is slow", { role: "opportunity" }],
        ["data-trust", "Data trust", { role: "opportunity" }],
        ["sharing", "Hard to share results", { role: "opportunity" }]
      ], "outcome"),
      ...k("tree", [["guided-setup", "Guided setup", { role: "solution" }], ["csv-import", "CSV import", { role: "solution" }]], "slow-onboarding"),
      ...k("tree", [["reconcile", "Reconcile with finance", { role: "solution" }]], "data-trust"),
      ...k("parked", [["templates", "Templates gallery", { role: "solution" }], ["digest", "Slack digest", { role: "solution" }]])
    ],
    behaviour: le([
      { kind: "nests", role: "opportunity", under: ["outcome"] },
      { kind: "nests", role: "solution", under: ["opportunity"] },
      { kind: "depth", max: 3 },
      { kind: "children", role: "opportunity", max: 4 }
    ])
  };
}
const we = () => le([{ kind: "nests", role: "action", under: ["cause"], severity: "warn" }, { kind: "depth", max: 6, severity: "warn" }]);
function Fe() {
  return {
    version: 1,
    kind: "nest",
    title: "Break down a problem",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The problem" }, { id: "parked", label: "Ideas to place" }],
    cards: [
      ...k("tree", [["problem", "Churn rose in Q3", { role: "problem" }]]),
      ...k("tree", [
        ["drop-off", "Onboarding drop-off", { role: "cause" }],
        ["price-rise", "Price rise in July", { role: "cause" }],
        ["free-tier", "A competitor’s free tier", { role: "cause" }]
      ], "problem"),
      ...k("tree", [["needs-engineer", "Setup needs an engineer", { role: "cause" }]], "drop-off"),
      ...k("tree", [["guided", "Ship guided setup", { role: "action" }]], "needs-engineer"),
      ...k("parked", [["survey", "Survey churned accounts", { role: "action" }]])
    ],
    behaviour: we()
  };
}
function He() {
  return {
    version: 1,
    kind: "nest",
    title: "Incident review",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The incident" }, { id: "parked", label: "Not placed yet" }],
    cards: [
      ...k("tree", [["outage", "Sign-in outage, 14 Nov", { role: "problem" }]]),
      ...k("tree", [["certificate", "Expired certificate", { role: "cause" }], ["rollback", "Slow rollback", { role: "cause" }]], "outage"),
      ...k("tree", [["alert-inbox", "Renewal alert went to an old inbox", { role: "cause" }]], "certificate"),
      ...k("tree", [["rota-alerts", "Send alerts to the on-call rota", { role: "action" }]], "alert-inbox"),
      ...k("tree", [["script-rollback", "Script the rollback", { role: "action" }]], "rollback"),
      ...k("parked", [["status-page", "Status page went up late", { role: "cause" }]])
    ],
    behaviour: we()
  };
}
export {
  Fe as breakDownSample,
  oe as byOrder,
  P as checkNest,
  Ke as checkNestMove,
  Be as discoveryTreeSample,
  Me as extend,
  He as incidentReviewSample,
  ve as isOrderKey,
  me as nestAlias,
  C as nestAreas,
  je as nestCardText,
  F as nestDepth,
  _e as nestDrags,
  Pe as nestEmptyDrop,
  Oe as nestFamily,
  v as nestKids,
  ye as nestLegal,
  B as nestMeasure,
  Y as nestMeasureWords,
  Z as nestPlace,
  ue as nestRoots,
  $e as nestRules,
  se as nestSentence,
  z as nestSubtree,
  _ as orderBetween,
  ie as orderKeys,
  We as registerNestPlus,
  j as roleOf,
  Ue as sortEvidenceSample,
  fe as tidyKeys,
  Se as validateNest
};
