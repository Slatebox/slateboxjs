import { registerWorkshopRules as ue, workshopEditKinds as B, workshopRuleSchema as F, said as m, applyWorkshopEdits as G, validateWorkshop as fe, workshopReferences as pe } from "./workshop-model.mjs";
const T = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", he = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function V(e, n) {
  if (n !== null) {
    let a = 0;
    for (; (e[a] ?? "0") === n[a]; ) a++;
    if (a > 0) return n.slice(0, a) + V(e.slice(a), n.slice(a));
  }
  const r = e ? T.indexOf(e[0]) : 0, t = n !== null ? T.indexOf(n[0]) : T.length;
  return t - r > 1 ? T[Math.round((r + t) / 2)] : n && n.length > 1 ? n.slice(0, 1) : T[r] + V(e.slice(1), null);
}
function _(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return V(e ?? "", n ?? null);
}
const ne = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function re(e) {
  const n = [];
  for (let r = 0; r < e; r++) n.push(_(n[r - 1] ?? null, null));
  return n;
}
const D = 6, O = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", R = (e) => e.charAt(0).toUpperCase() + e.slice(1), Q = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, ye = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
function M(e) {
  const n = typeof e == "string" ? e.trim().toLowerCase().replace(/\s+/g, " ") : "";
  if (!/^[a-z][a-z -]{0,23}$/.test(n)) throw new Error("A role is a word or two, such as “pile” or “opportunity”.");
  return n;
}
const te = (e, n) => n + (e >= 1e6 ? Math.round(e / 1e5) / 10 + "M" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : String(e)), H = (e) => {
  let n = 1;
  for (; e.cards.some((r) => r.id === "card-" + n) || e.lanes.some((r) => r.id === "card-" + n); ) n++;
  return "card-" + n;
}, E = (e, n, r) => {
  const t = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!t || t.length > n || /[<>\u0000-\u001f]/.test(t)) throw new Error(r);
  return t;
}, N = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), I = (e, n) => n === void 0 ? void 0 : e.cards.find((r) => r.id === n);
function v(e, n, r) {
  return e.cards.filter((t) => (t.parentId ?? null) === n && (n !== null || t.laneId === r)).sort(ne);
}
function j(e, n) {
  const r = [n];
  for (let t = 0; t < r.length; t++) for (const a of e.cards) a.parentId === r[t] && r.push(a.id);
  return r;
}
function W(e, n) {
  let r = 0;
  for (let t = I(e, n); t?.parentId && r <= e.cards.length; t = I(e, t.parentId)) r++;
  return r;
}
function P(e, n) {
  const r = e.cards.filter((t) => t.parentId === n);
  return r.length ? 1 + Math.max(...r.map((t) => P(e, t.id))) : 0;
}
function me(e, n) {
  return j(e, n).slice(1).map((r) => I(e, r)).filter((r) => !e.cards.some((t) => t.parentId === r.id));
}
function z(e, n, r) {
  const t = me(e, n);
  if (r === "count") return t.length;
  if (r === "sources") return new Set(t.flatMap((o) => o.source ? [o.source.toLowerCase()] : [])).size;
  const a = /* @__PURE__ */ new Map();
  for (const o of t) {
    const l = o.fields?.[r];
    if (l === void 0) continue;
    const f = o.source ? o.source.toLowerCase() : "#" + o.id;
    a.set(f, Math.max(a.get(f) ?? 0, l));
  }
  return [...a.values()].reduce((o, l) => o + l, 0);
}
const se = (e, n) => e.nest?.fields?.find((r) => r.id === n);
function J(e, n, r) {
  if (n === "count") return r + (r === 1 ? " note" : " notes");
  if (n === "sources") return r + (r === 1 ? " customer" : " customers");
  const t = se(e, n);
  return (t?.currency ? te(r, t.currency) : String(r)) + " " + (t?.label ?? n);
}
const L = (e, n) => (e.behaviour?.rules ?? []).filter((r) => r.on && r.kind === n), U = (e) => L(e, "rank")[0]?.by;
function oe(e, n) {
  const r = v(e, null, n), t = U(e);
  if (!t || n !== N(e).main) return r;
  const a = new Map(r.map((o) => [o.id, z(e, o.id, t)]));
  return r.sort((o, l) => a.get(l.id) - a.get(o.id) || ne(o, l));
}
function K(e, n, r) {
  const t = I(e, n);
  if (!t) return null;
  const a = j(e, n), o = r.under === null ? null : I(e, r.under);
  if (o === void 0 || o && a.includes(o.id)) return null;
  const l = o ? o.laneId : r.laneId, { tray: f } = N(e);
  if (l === f && (o || a.length > 1)) return null;
  const c = (o ? v(e, o.id) : v(e, null, l)).filter((w) => w.id !== n);
  let s = r.before === null ? c.length : c.findIndex((w) => w.id === r.before);
  s < 0 && (s = c.length);
  const i = o ? v(e, o.id) : v(e, null, l);
  if ((t.parentId ?? null) === (o?.id ?? null) && t.laneId === l && i.indexOf(t) === s) return e;
  const d = c[s - 1]?.order, u = c[s]?.order;
  let p = /* @__PURE__ */ new Map(), g;
  if ((s === 0 || d) && (s === c.length || u) && (!d || !u || d < u)) g = _(d, u);
  else {
    const w = re(c.length + 1);
    c.forEach((h, k) => p.set(h.id, w[k < s ? k : k + 1])), g = w[s];
  }
  const y = e.cards.map((w) => {
    if (w.id === n) {
      const x = { ...w, laneId: l, order: g };
      return o ? x.parentId = o.id : delete x.parentId, x;
    }
    const h = p.get(w.id), k = a.includes(w.id) ? l : w.laneId;
    return h || k !== w.laneId ? { ...w, laneId: k, ...h && { order: h } } : w;
  });
  return { ...e, cards: y };
}
function we(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = N(e), r = new Set((e.nest?.fields ?? []).map((a) => a.id)), t = U(e);
  if (t && t !== "count" && t !== "sources" && !r.has(t)) return "Cards on this board carry no " + t + ", so piles can’t rank by it.";
  for (const a of e.cards) {
    if (a.parentId !== void 0) {
      const l = I(e, a.parentId);
      if (!l) return m(a.label) + " sits under a card that is no longer on the board.";
      if (l.laneId !== a.laneId) return m(a.label) + " is in another area than the card it sits under.";
      if (a.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (W(e, a.id) > Math.min(D, e.cards.length)) return "Cards nest up to " + D + " levels deep, and never under themselves.";
    }
    if (Object.keys(a.fields ?? {}).find((l) => !r.has(l))) return m(a.label) + " has a number this board has no field for.";
  }
  return null;
}
function q(e, n) {
  const r = e.severity === "warn" ? " (a warning only)" : "";
  let t = "";
  switch (e.kind) {
    case "nests":
      t = R(O(e.role)) + " sit under " + ye(e.under.map(Q));
      break;
    case "children":
      t = e.role ? R(Q(e.role)) + " holds at most " + e.max : "A card holds at most " + e.max + " under it";
      break;
    case "depth":
      t = e.max === 1 ? "Cards nest one level deep" : "Cards nest up to " + e.max + " levels deep";
      break;
    case "rank":
      t = "Piles rank by " + (e.by === "count" ? "number of notes" : e.by === "sources" ? "number of customers" : se(n, e.by)?.label ?? e.by);
      break;
    case "emptyDrop":
      t = "A card let go in empty space " + (e.drop === "new-pile" ? "starts a new pile" : "goes to " + n.lanes[1].label);
      break;
  }
  return t + r + ".";
}
const Z = ["nests", "depth", "children"];
function X(e, n) {
  const r = (e.behaviour?.rules ?? []).filter((c) => c.on && Z.includes(c.kind)).sort((c, s) => Z.indexOf(c.kind) - Z.indexOf(s.kind)), t = [];
  if (!r.length) return { ok: !0, warnings: t };
  const a = new Map(e.cards.map((c) => [c.id, c])), { tray: o } = N(n), l = n.cards.filter((c) => {
    const s = a.get(c.id);
    return c.laneId !== o && (!s || s.parentId !== c.parentId || s.laneId !== c.laneId || s.role !== c.role);
  }), f = (c, s) => c.cards.filter((i) => i.parentId === s).length;
  for (const c of r) {
    let s = null;
    if (c.kind === "nests") {
      const i = l.find((d) => d.role === c.role && !c.under.includes(I(n, d.parentId)?.role ?? ""));
      i && (s = { sentence: q({ ...c, severity: "refuse" }, e), card: i });
    } else if (c.kind === "depth") {
      const i = l.find((d) => W(n, d.id) + P(n, d.id) > c.max);
      i && (s = { sentence: q({ ...c, severity: "refuse" }, e) + " " + i.label + " would be " + (W(n, i.id) + P(n, i.id)) + " deep.", card: i });
    } else if (c.kind === "children")
      for (const i of l) {
        const d = I(n, i.parentId);
        if (!d || c.role && d.role !== c.role) continue;
        const u = f(e, d.id), p = f(n, d.id);
        if (p > c.max && p > u) {
          s = { sentence: d.label + " holds " + c.max + ". It has " + u + ".", card: i };
          break;
        }
      }
    if (s) {
      if (c.severity === "warn") {
        t.push(s.sentence);
        continue;
      }
      return { refused: { sentence: s.sentence, ruleId: c.id, set: c.set, cardId: s.card.id, laneId: s.card.laneId } };
    }
  }
  return { ok: !0, warnings: t };
}
function ge(e) {
  const n = e.filter((a) => a.kind === "nests" && a.on && a.severity === "refuse"), r = /* @__PURE__ */ new Map(), t = (a, o) => {
    if (r.has(a)) return r.get(a);
    const l = n.find((c) => c.role === a);
    if (!l) return 0;
    if (o.includes(a)) return 1 / 0;
    const f = 1 + Math.min(...l.under.map((c) => t(c, [...o, a])));
    return o.length || r.set(a, f), f;
  };
  for (const a of n) r.set(a.role, t(a.role, []));
  return r;
}
function ke(e, n) {
  const r = /* @__PURE__ */ new Set();
  for (const o of e.rules) {
    const l = o.kind + ":" + (o.kind === "nests" ? o.role : o.kind === "children" ? o.role ?? "" : "");
    if (r.has(l))
      return o.kind === "nests" ? "There is already a rule for where " + O(o.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    r.add(l);
  }
  const t = ge(e.rules), a = e.rules.find((o) => o.kind === "depth" && o.on && o.severity === "refuse");
  for (const [o, l] of t) {
    if (l === 1 / 0) return R(O(o)) + " could never be placed: what they sit under would have to sit under them first.";
    if (a && l > a.max) return R(O(o)) + " sit " + l + " levels down, but cards nest only " + a.max + " deep.";
  }
  return null;
}
const ae = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" };
function be(e, n, r) {
  const t = Object.keys(e).find((o) => !["id", "on", "severity", "set", "kind", ...ae[e.kind].split(" ")].includes(o));
  if (t) throw new Error("A " + e.kind + " rule does not take " + t + ".");
  const a = (o, l, f) => {
    if (typeof o != "number" || !Number.isInteger(o) || o < 1 || o > l) throw new Error(f);
    return o;
  };
  switch (e.kind) {
    case "nests": {
      const o = M(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + O(o) + " sit under.");
      const l = [...new Set(e.under.map(M))];
      if (l.includes(o)) throw new Error(R(O(o)) + " can’t sit only under " + O(o) + ".");
      return { ...n, kind: "nests", role: o, under: l };
    }
    case "children": {
      const o = { ...n, kind: "children", max: a(e.max, 40, "A card holds from 1 to 40 cards under it.") };
      return e.role !== void 0 && (o.role = M(e.role)), o;
    }
    case "depth":
      return { ...n, kind: "depth", max: a(e.max, D, "Cards nest from 1 to " + D + " levels deep.") };
    case "rank":
      if (typeof e.by != "string" || !/^[a-z0-9-]{1,20}$/.test(e.by)) throw new Error("Piles rank by number of notes, number of customers, or a number field this board has.");
      return { ...n, kind: "rank", by: e.by };
    case "emptyDrop":
      if (e.drop !== "new-pile" && e.drop !== "unsorted") throw new Error("A card let go in empty space starts a new pile or goes to " + r.lanes[1].label + ".");
      return { ...n, kind: "emptyDrop", drop: e.drop };
  }
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const Ie = {
  keys: ae,
  read: (e, n, r) => be(e, n, r),
  sentence: q,
  contradiction: ke,
  check: X,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, Y = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((n, r) => ({ id: "rule-" + (r + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...n }))
}), ie = (e, n) => !e.behaviour || !("refused" in X(e, n));
function le(e, n) {
  if (!I(e, n)) return [];
  const t = [], a = new Set(j(e, n)), o = P(e, n), l = [null, ...e.cards.filter((f) => !a.has(f.id) && f.laneId === N(e).main && W(e, f.id) + 1 + o <= D)];
  for (const f of e.lanes) for (const c of l) {
    if (c && f.id !== c.laneId) continue;
    const s = (c ? v(e, c.id) : v(e, null, f.id)).filter((i) => i.id !== n);
    for (let i = 0; i <= s.length; i++) {
      const d = { laneId: f.id, under: c?.id ?? null, before: s[i]?.id ?? null }, u = K(e, n, d);
      u && (u === e || ie(e, u)) && t.push({ spot: d, next: u });
    }
  }
  return t;
}
function Me(e, n) {
  const r = I(e, n);
  if (!r) return null;
  const t = L(e, "emptyDrop")[0], { main: a, tray: o } = N(e), l = t?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!l) return null;
  let f;
  if (l === "unsorted") f = r.laneId === o ? null : K(e, n, { laneId: o, under: null, before: null });
  else {
    if (e.cards.some((s) => s.parentId === n)) return null;
    const c = G(e, [{ kind: "start_pile", card: { id: n } }]);
    f = "refused" in c ? null : c.workshop;
  }
  return f && f !== e && ie(e, f) ? f : null;
}
const ve = (e) => JSON.stringify([
  e.nest?.layout,
  U(e),
  L(e, "emptyDrop")[0]?.kind && L(e, "emptyDrop")[0].drop,
  oe(e, N(e).main).map((n) => n.id),
  e.cards.map((n) => le(e, n.id).map(({ spot: r }) => r.under ?? r.laneId).filter((r, t, a) => a.indexOf(r) === t))
]);
function de(e, n) {
  let r = n;
  for (let t = 0; t < 12 && !I(e, r); t++) {
    const a = e.nest?.aliases?.find(([o]) => o === r)?.[1];
    if (!a) return null;
    r = a;
  }
  return I(e, r) ? r : null;
}
function Te(e, n, r) {
  const t = fe(e), a = pe(t), o = (y) => typeof y == "object" ? I(t, de(t, y.id) ?? "") : I(t, y) ?? a.cards.attempt(y) ?? void 0, l = o(n), f = r.under === void 0 ? null : o(r.under);
  if (!l || f === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null } };
  const c = { kind: "nest_card", card: { id: l.id }, ...f ? { under: { id: f.id } } : r.lane ? { lane: r.lane } : {} }, s = G(t, [c]);
  if (!("refused" in s)) {
    const y = X(t, s.workshop);
    return { ok: !0, warnings: "warnings" in y ? y.warnings : [] };
  }
  const i = s.refused.reason, d = (t.behaviour?.rules ?? []).find((y) => {
    if (!y.on) return !1;
    const w = { ...t, behaviour: { ...t.behaviour, rules: [{ ...y, severity: "refuse" }] } }, h = G(w, [c]);
    return "refused" in h && h.refused.reason === i;
  }), u = new Set(le(t, l.id).flatMap(({ spot: y }) => y.under ? [y.under] : [])), g = (f ? [...v(t, f.id), ...f.parentId ? v(t, f.parentId) : v(t, null, f.laneId)] : []).find((y) => u.has(y.id) && y.id !== l.parentId)?.label ?? null;
  return { refused: { sentence: i, ruleId: d?.id ?? null, nearest: g, ...d && { set: d.set } } };
}
const S = (e) => ({ type: "ref", of: "card", about: e }), C = (e, n, r = !1) => ({ type: "text", max: e, about: n, ...r && { optional: r } }), A = ["nest"];
function xe(e) {
  const n = (r) => B.find((t) => t.kind === r);
  for (const r of e.kinds) B.some((t) => t.kind === r.kind) || B.push(r);
  for (const [r, t] of Object.entries(e.boards)) for (const a of t) {
    const o = n(r);
    o.boards.includes(a) || (o.boards.push(a), delete o.refusals[a]);
  }
  for (const [r, t] of Object.entries(e.fields)) Object.assign(n(r).fields, t);
  F.kinds.push(...e.rules.kinds.filter((r) => !F.kinds.includes(r))), Object.assign(F.keys, e.rules.keys);
}
xe({
  kinds: [
    {
      kind: "nest_card",
      summary: "Nest board: put a card under another (under), at the top of an area (lane), before a sibling (before). The cards under it come with it.",
      intent: !0,
      fields: {
        card: S("The card."),
        under: { ...S("The card it goes under."), optional: !0 },
        lane: { type: "ref", of: "lane", optional: !0, about: "The area it goes to the top of." },
        before: { ...S("The sibling it goes before. Left out, last."), optional: !0 }
      },
      boards: A,
      refusals: {}
    },
    {
      kind: "start_pile",
      summary: "Nest board: start a new pile with this card in it.",
      intent: !0,
      fields: { card: S("The card."), label: C(80, "The pile’s name. Left out, “New pile”.", !0) },
      boards: A,
      refusals: {}
    },
    {
      kind: "merge_cards",
      summary: "Nest board: merge a card into another. What was under it goes under that one; a drop still on its way lands there too.",
      intent: !1,
      fields: { card: S("The card that goes."), into: S("The card it merges into.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_role",
      summary: "Nest board: say what a card is (pile, outcome, opportunity, solution, cause, action…).",
      intent: !1,
      fields: { card: S("The card."), role: C(24, "A word or two.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: S("The card."), source: C(60, "Who said it.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: { label: C(20, "Its name."), currency: { type: "choice", values: ["$", "€", "£"], optional: !0, about: "A money field’s sign." } },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_field",
      summary: "Nest board: set (or with null clear) a card’s number in a field.",
      intent: !1,
      fields: { card: S("The card."), field: C(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
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
    add_card: { under: { ...S("Nest board: the card it goes under."), optional: !0 }, role: C(24, "Nest board: what it is.", !0), source: C(60, "Nest board: who said it.", !0) }
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
function Ae(e, n) {
  return n ? (e.behaviour?.rules ?? []).find((t) => t.kind === "nests" && t.under.includes(n.role ?? ""))?.role ?? (n.role === "pile" ? "note" : void 0) : void 0;
}
const $ = (e, n, r) => _(v(e, n, r).at(-1)?.order ?? null, null);
function Se(e, n, r) {
  const t = e, { main: a, tray: o } = N(t), l = t.lanes[1].label, f = (s) => {
    if (typeof s == "object" && !I(t, s.id)) {
      const i = de(t, s.id);
      if (i) return I(t, i);
    }
    return r.card(s);
  }, c = (s, i) => {
    const d = K(t, s.id, i);
    return d || (i.under && j(t, s.id).includes(i.under) && r.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), r.refuse(l + " holds loose cards. Move what is under " + m(s.label) + " first.", { cardId: s.id, laneId: i.laneId })), r.settle(d, i.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.lane(n.lane), i = n.label?.replace(/\s+/g, " ").trim();
      i || r.refuse("Say what the card should say, such as “Add a note called Slow exports to Reporting”.", { laneId: s.id });
      const d = n.under === void 0 ? null : f(n.under);
      d && s.id === o && r.refuse(l + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const u = n.role === void 0 ? Ae(t, d) : M(n.role), p = { id: H(t), label: i, laneId: d?.laneId ?? s.id, ...u && { role: u }, ...n.source && { source: E(n.source, 60, "Say who said it in plain words.") } };
      if (!d && s.id === a && t.nest?.layout === "clusters" && n.role === void 0) {
        if ((L(t, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const x = r.settle({ ...t, cards: [...t.cards, { ...p, laneId: o, order: $(t, null, o) }] }, o);
          return r.done(x, "Added " + m(i) + " to " + m(l) + ".", { laneId: o, cardId: p.id });
        }
        const w = { id: p.id, label: "New pile", laneId: a, role: "pile", order: $(t, null, a) }, h = { ...p, id: H({ ...t, cards: [...t.cards, w] }), parentId: w.id, role: u ?? "note", order: _(null, null) }, k = r.settle({ ...t, cards: [...t.cards, w, h] }, a);
        return r.done(k, "Added " + m(i) + " to a new pile.", { laneId: a, cardId: h.id });
      }
      d && (p.parentId = d.id), p.order = $(t, d?.id ?? null, p.laneId);
      const g = r.settle({ ...t, cards: [...t.cards, p] }, p.laneId);
      return r.done(g, "Added " + m(i) + " to " + m(d?.label ?? t.lanes.find((y) => y.id === p.laneId).label) + ".", { laneId: p.laneId, cardId: p.id });
    }
    case "nest_card": {
      const s = r.card(n.card), i = n.under === void 0 ? null : f(n.under), d = i?.laneId ?? (n.lane === void 0 ? s.laneId : r.lane(n.lane).id), u = n.before === void 0 ? null : r.card(n.before).id, p = c(s, { laneId: d, under: i?.id ?? null, before: u });
      if (p === t) return r.done(t, m(s.label) + " is there already.", { laneId: d, cardId: s.id });
      const g = i ? "under " + m(i.label) : d === o ? "to " + m(l) : "to the top of " + m(t.lanes[0].label);
      return r.done(p, "Moved " + m(s.label) + " " + g + ".", { laneId: d, cardId: s.id });
    }
    case "start_pile": {
      const s = r.card(n.card);
      t.cards.some((g) => g.parentId === s.id) && r.refuse(m(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const i = n.label === void 0 ? "New pile" : E(n.label, 80, "Name the pile in plain words."), d = { id: H(t), label: i, laneId: a, role: "pile", order: $(t, null, a) }, u = t.cards.map((g) => {
        if (g.id !== s.id) return g;
        const y = { ...g, laneId: a, parentId: d.id, order: _(null, null) };
        return (!y.role || y.role === "pile") && (y.role = "note"), y;
      }), p = r.settle({ ...t, cards: [...u, d] }, a, s.id);
      return r.done(p, "Started a new pile, " + m(i) + ", with " + m(s.label) + " in it.", { laneId: a, cardId: d.id });
    }
    case "merge_cards": {
      const s = r.card(n.card), i = r.card(n.into);
      s.id === i.id && r.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), j(t, s.id).includes(i.id) && r.refuse(m(i.label) + " is under " + m(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (i.laneId === o || s.laneId === o) && r.refuse("Merge cards on the board, not in " + m(l) + ".", { cardId: s.id, laneId: o });
      const d = v(t, s.id);
      let u = v(t, i.id).at(-1)?.order ?? null;
      const p = new Map(d.map((h) => (u = _(u, null), [h.id, u]))), g = [...(t.nest.aliases ?? []).map(([h, k]) => [h, k === s.id ? i.id : k]), [s.id, i.id]].slice(-12), y = t.cards.filter((h) => h.id !== s.id).map((h) => p.has(h.id) ? { ...h, parentId: i.id, order: p.get(h.id) } : h), w = r.settle({ ...t, nest: { ...t.nest, aliases: g }, cards: y }, i.laneId, i.id);
      return r.done(w, "Merged " + m(s.label) + " into " + m(i.label) + (d.length ? ": " + d.length + (d.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: i.laneId, cardId: i.id });
    }
    case "remove_card": {
      const s = r.card(n.card), i = v(t, s.id), d = (h) => s.parentId || t.cards.some((k) => k.parentId === h.id) ? s.laneId : o, u = /* @__PURE__ */ new Map(), p = new Map(i.map((h) => {
        const k = d(h), x = k === o ? null : s.parentId ?? null, ee = _(u.has(k) ? u.get(k) : v(t, x, k).at(-1)?.order ?? null, null);
        return u.set(k, ee), [h.id, { key: ee, lane: k }];
      })), g = t.cards.filter((h) => h.id !== s.id).map((h) => {
        const k = p.get(h.id);
        if (!k) return h;
        const x = { ...h, order: k.key, laneId: k.lane };
        return s.parentId ? x.parentId = s.parentId : delete x.parentId, x;
      }), y = i.some((h) => d(h) === o), w = r.settle({ ...t, cards: g }, s.laneId);
      return r.done(w, "Removed " + m(s.label) + "." + (i.length ? y ? " What was in it went to " + m(l) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = r.card(n.card);
      let i = "";
      try {
        i = M(n.role);
      } catch (u) {
        r.refuse(u.message, { cardId: s.id, laneId: s.laneId });
      }
      const d = r.settle({ ...t, cards: t.cards.map((u) => u.id === s.id ? { ...u, role: i } : u) }, s.laneId, s.id);
      return r.done(d, m(s.label) + " is " + Q(i) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = r.card(n.card);
      let i = "";
      try {
        i = E(n.source, 60, "Say who said it in plain words.");
      } catch (u) {
        r.refuse(u.message, { cardId: s.id });
      }
      const d = r.settle({ ...t, cards: t.cards.map((u) => u.id === s.id ? { ...u, source: i } : u) }, s.laneId, s.id);
      return r.done(d, m(s.label) + " came from " + i + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = t.nest.fields ?? [];
      let i = "";
      try {
        i = E(n.label, 20, "Name the field in a word or two.");
      } catch (p) {
        r.refuse(p.message);
      }
      const d = i.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((p) => p.id === d || p.label.toLowerCase() === i.toLowerCase()) && r.refuse("Cards already carry " + i + "."), s.length >= 4 && r.refuse("Cards carry up to 4 number fields.");
      const u = r.settle({ ...t, nest: { ...t.nest, fields: [...s, { id: d, label: i, ...n.currency && { currency: n.currency } }] } });
      return r.done(u, "Cards can carry " + i + " now.");
    }
    case "set_field": {
      const s = r.card(n.card), i = (t.nest.fields ?? []).find((p) => p.id === n.field || p.label.toLowerCase() === String(n.field).toLowerCase());
      i || r.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && r.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const d = t.cards.map((p) => {
        if (p.id !== s.id) return p;
        const g = { ...p.fields };
        n.value === null ? delete g[i.id] : g[i.id] = n.value;
        const y = { ...p, fields: g };
        return Object.keys(g).length || delete y.fields, y;
      }), u = r.settle({ ...t, cards: d }, s.laneId, s.id);
      return r.done(u, m(s.label) + (n.value === null ? " has no " + i.label + " now." : "’s " + i.label + " is " + (i.currency ? te(n.value, i.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && r.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = r.settle({ ...t, nest: { ...t.nest, layout: n.layout } });
      return r.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function Ne(e, n) {
  if (e.cards.some((r) => r.parentId === n.id) || n.role === "pile") {
    const r = [J(e, "count", z(e, n.id, "count"))];
    if (e.nest?.layout === "clusters") {
      const t = z(e, n.id, "sources");
      t && r.push(J(e, "sources", t));
      const a = U(e);
      a && a !== "count" && a !== "sources" && r.push(J(e, a, z(e, n.id, a)));
    }
    return n.label + `
` + r.join(" · ");
  }
  return n.source ? n.label + `
— ` + n.source : n.label;
}
function Ce(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [r, t] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(r) || typeof t != "number" || !Number.isInteger(t) || t < 0 || t > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[r] = t;
  }
  return Object.keys(n).length ? n : void 0;
}
function _e(e, n) {
  const r = JSON.stringify, t = (a) => r(a.cards.map((o) => [o.id, o.laneId, o.parentId, o.order, o.role]));
  return r(e.behaviour?.rules) !== r(n.behaviour?.rules) && t(e) !== t(n) ? "Change the rules on their own, then move cards." : null;
}
const Oe = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: Ie,
  drags: ve,
  fixed: _e,
  order: (e, n) => oe(e, n).map((r) => r.id),
  readCard(e, n, r) {
    if (e.parentId !== void 0 && (n.parentId = r.id(e.parentId)), e.role !== void 0 && (n.role = M(e.role)), e.order !== void 0) {
      if (!he(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = E(e.source, 60, "Say who said it in plain words."));
    const t = Ce(e.fields);
    t && (n.fields = t);
  },
  readBoard(e, n, r) {
    const t = e.nest;
    if (!t || typeof t != "object" || Array.isArray(t)) throw new Error("A nested board says how it is drawn.");
    if (t.layout !== "clusters" && t.layout !== "tree") throw new Error("A nested board is drawn as piles or as a tree.");
    const a = { layout: t.layout };
    if (t.fields !== void 0) {
      if (!Array.isArray(t.fields) || t.fields.length > 4) throw new Error("Cards carry up to 4 number fields.");
      if (a.fields = t.fields.map((o) => {
        const l = o ?? {};
        if (typeof l.id != "string" || !/^[a-z0-9-]{1,20}$/.test(l.id)) throw new Error("A field’s id is a short slug.");
        const f = { id: l.id, label: E(l.label, 20, "Name the field in a word or two.") };
        if (l.currency !== void 0) {
          if (l.currency !== "$" && l.currency !== "€" && l.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          f.currency = l.currency;
        }
        return f;
      }), new Set(a.fields.map((o) => o.id)).size !== a.fields.length) throw new Error("Duplicate field.");
    }
    if (t.aliases !== void 0) {
      if (!Array.isArray(t.aliases) || t.aliases.length > 12) throw new Error("A board keeps up to 12 merged cards’ new homes.");
      a.aliases = t.aliases.map((o) => {
        if (!Array.isArray(o) || o.length !== 2) throw new Error("A merged card’s new home is a pair of ids.");
        return [r.id(o[0]), r.id(o[1])];
      });
    }
    n.nest = a;
  },
  validate: we,
  planMove(e, n, r) {
    const t = I(e, n);
    return !t || !e.lanes.some((a) => a.id === r) ? null : t.laneId === r && !t.parentId ? e : K(e, n, { laneId: r, under: null, before: null });
  },
  refusal(e, n, r) {
    const t = I(e, n);
    return t && r === N(e).tray && e.cards.some((a) => a.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + m(t.label) + " first." : null;
  },
  caption(e, n) {
    const r = e.cards.filter((a) => a.laneId === n).length;
    if (n === N(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const t = v(e, null, n).length;
    return e.nest?.layout === "clusters" ? t + (t === 1 ? " pile" : " piles") + " · " + (r - t) + (r - t === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: Ne,
  noteText: (e, n) => n.label,
  fromNote: (e, n) => ({ label: n.replace(/\s+/g, " ").trim().slice(0, 80) }),
  renamed: (e, n, r) => ({ label: r.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: Se
};
ue(Oe);
function b(e, n, r) {
  const t = re(n.length);
  return n.map(([a, o, l], f) => ({ id: a, label: o, laneId: e, order: t[f], ...r && { parentId: r }, ...l }));
}
function De() {
  const e = (n, r) => ({ role: "note", source: n, fields: { arr: r } });
  return {
    version: 1,
    kind: "nest",
    title: "Sort the evidence",
    nest: { layout: "clusters", fields: [{ id: "arr", label: "ARR", currency: "$" }] },
    lanes: [{ id: "piles", label: "Piles" }, { id: "unsorted", label: "Unsorted" }],
    cards: [
      ...b("piles", [["onboarding", "Onboarding", { role: "pile" }], ["reporting", "Reporting", { role: "pile" }], ["pricing", "Pricing", { role: "pile" }]]),
      ...b("piles", [
        ["setup-days", "Setup took two days", e("Acme", 24e3)],
        ["where-start", "Didn’t know where to start", e("Globex", 36e3)],
        ["invites", "Invite flow is confusing", e("Initech", 12e3)]
      ], "onboarding"),
      ...b("piles", [["csv-export", "Couldn’t find CSV export", e("Acme", 24e3)], ["finance-match", "Charts don’t match finance", e("Umbrella", 6e4)]], "reporting"),
      ...b("piles", [["seats", "Seats are too expensive", e("Initech", 12e3)], ["annual", "Want annual billing", e("Hooli", 3e4)]], "pricing"),
      ...b("unsorted", [["trust", "I don’t trust the numbers", e("Umbrella", 6e4)], ["mobile", "Mobile app please", e("Hooli", 3e4)]])
    ],
    behaviour: Y([{ kind: "nests", role: "note", under: ["pile"] }, { kind: "depth", max: 1 }, { kind: "rank", by: "sources" }, { kind: "emptyDrop", drop: "new-pile" }])
  };
}
function Re() {
  return {
    version: 1,
    kind: "nest",
    title: "Discovery tree",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "Discovery tree" }, { id: "parked", label: "Parked ideas" }],
    cards: [
      ...b("tree", [["outcome", "Activation to 40%", { role: "outcome" }]]),
      ...b("tree", [
        ["slow-onboarding", "Onboarding is slow", { role: "opportunity" }],
        ["data-trust", "Data trust", { role: "opportunity" }],
        ["sharing", "Hard to share results", { role: "opportunity" }]
      ], "outcome"),
      ...b("tree", [["guided-setup", "Guided setup", { role: "solution" }], ["csv-import", "CSV import", { role: "solution" }]], "slow-onboarding"),
      ...b("tree", [["reconcile", "Reconcile with finance", { role: "solution" }]], "data-trust"),
      ...b("parked", [["templates", "Templates gallery", { role: "solution" }], ["digest", "Slack digest", { role: "solution" }]])
    ],
    behaviour: Y([
      { kind: "nests", role: "opportunity", under: ["outcome"] },
      { kind: "nests", role: "solution", under: ["opportunity"] },
      { kind: "depth", max: 3 },
      { kind: "children", role: "opportunity", max: 4 }
    ])
  };
}
const ce = () => Y([{ kind: "nests", role: "action", under: ["cause"], severity: "warn" }, { kind: "depth", max: 6, severity: "warn" }]);
function je() {
  return {
    version: 1,
    kind: "nest",
    title: "Break down a problem",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The problem" }, { id: "parked", label: "Ideas to place" }],
    cards: [
      ...b("tree", [["problem", "Churn rose in Q3", { role: "problem" }]]),
      ...b("tree", [
        ["drop-off", "Onboarding drop-off", { role: "cause" }],
        ["price-rise", "Price rise in July", { role: "cause" }],
        ["free-tier", "A competitor’s free tier", { role: "cause" }]
      ], "problem"),
      ...b("tree", [["needs-engineer", "Setup needs an engineer", { role: "cause" }]], "drop-off"),
      ...b("tree", [["guided", "Ship guided setup", { role: "action" }]], "needs-engineer"),
      ...b("parked", [["survey", "Survey churned accounts", { role: "action" }]])
    ],
    behaviour: ce()
  };
}
function Le() {
  return {
    version: 1,
    kind: "nest",
    title: "Incident review",
    nest: { layout: "tree" },
    lanes: [{ id: "tree", label: "The incident" }, { id: "parked", label: "Not placed yet" }],
    cards: [
      ...b("tree", [["outage", "Sign-in outage, 14 Nov", { role: "problem" }]]),
      ...b("tree", [["certificate", "Expired certificate", { role: "cause" }], ["rollback", "Slow rollback", { role: "cause" }]], "outage"),
      ...b("tree", [["alert-inbox", "Renewal alert went to an old inbox", { role: "cause" }]], "certificate"),
      ...b("tree", [["rota-alerts", "Send alerts to the on-call rota", { role: "action" }]], "alert-inbox"),
      ...b("tree", [["script-rollback", "Script the rollback", { role: "action" }]], "rollback"),
      ...b("parked", [["status-page", "Status page went up late", { role: "cause" }]])
    ],
    behaviour: ce()
  };
}
export {
  je as breakDownSample,
  ne as byOrder,
  X as checkNest,
  Te as checkNestMove,
  Re as discoveryTreeSample,
  Le as incidentReviewSample,
  he as isOrderKey,
  de as nestAlias,
  N as nestAreas,
  Ne as nestCardText,
  W as nestDepth,
  ve as nestDrags,
  Me as nestEmptyDrop,
  Ie as nestFamily,
  v as nestKids,
  le as nestLegal,
  z as nestMeasure,
  J as nestMeasureWords,
  K as nestPlace,
  oe as nestRoots,
  Oe as nestRules,
  q as nestSentence,
  j as nestSubtree,
  _ as orderBetween,
  re as orderKeys,
  M as roleOf,
  De as sortEvidenceSample,
  we as validateNest
};
