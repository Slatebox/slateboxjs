import { registerWorkshopRules as me, workshopEditKinds as G, workshopRuleSchema as V, said as w, applyWorkshopEdits as Y, validateWorkshop as we, workshopReferences as ge } from "./workshop-model.mjs";
const D = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", be = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function ee(e, n) {
  if (n !== null) {
    let o = 0;
    for (; (e[o] ?? "0") === n[o]; ) o++;
    if (o > 0) return n.slice(0, o) + ee(e.slice(o), n.slice(o));
  }
  const r = e ? D.indexOf(e[0]) : 0, t = n !== null ? D.indexOf(n[0]) : D.length;
  return t - r > 1 ? D[Math.round((r + t) / 2)] : n && n.length > 1 ? n.slice(0, 1) : D[r] + ee(e.slice(1), null);
}
function O(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return ee(e ?? "", n ?? null);
}
const te = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function se(e) {
  const n = [];
  for (let r = 0; r < e; r++) n.push(O(n[r - 1] ?? null, null));
  return n;
}
const R = 6, E = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", j = (e) => e.charAt(0).toUpperCase() + e.slice(1), ne = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, Ie = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
function T(e) {
  const n = typeof e == "string" ? e.trim().toLowerCase().replace(/\s+/g, " ") : "";
  if (!/^[a-z][a-z -]{0,23}$/.test(n)) throw new Error("A role is a word or two, such as “pile” or “opportunity”.");
  return n;
}
const ae = (e, n) => n + (e >= 1e6 ? Math.round(e / 1e5) / 10 + "M" : e >= 1e3 ? Math.round(e / 100) / 10 + "k" : String(e)), Q = (e) => {
  let n = 1;
  for (; e.cards.some((r) => r.id === "card-" + n) || e.lanes.some((r) => r.id === "card-" + n); ) n++;
  return "card-" + n;
}, M = (e, n, r) => {
  const t = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!t || t.length > n || /[<>\u0000-\u001f]/.test(t)) throw new Error(r);
  return t;
}, N = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), I = (e, n) => n === void 0 ? void 0 : e.cards.find((r) => r.id === n);
function v(e, n, r) {
  return e.cards.filter((t) => (t.parentId ?? null) === n && (n !== null || t.laneId === r)).sort(te);
}
function L(e, n) {
  const r = [n];
  for (let t = 0; t < r.length; t++) for (const o of e.cards) o.parentId === r[t] && r.push(o.id);
  return r;
}
function U(e, n) {
  let r = 0;
  for (let t = I(e, n); t?.parentId && r <= e.cards.length; t = I(e, t.parentId)) r++;
  return r;
}
function B(e, n) {
  const r = e.cards.filter((t) => t.parentId === n);
  return r.length ? 1 + Math.max(...r.map((t) => B(e, t.id))) : 0;
}
function ke(e, n) {
  return L(e, n).slice(1).map((r) => I(e, r)).filter((r) => !e.cards.some((t) => t.parentId === r.id));
}
function K(e, n, r) {
  const t = ke(e, n);
  if (r === "count") return t.length;
  if (r === "sources") return new Set(t.flatMap((a) => a.source ? [a.source.toLowerCase()] : [])).size;
  const o = /* @__PURE__ */ new Map();
  for (const a of t) {
    const d = a.fields?.[r];
    if (d === void 0) continue;
    const c = a.source ? a.source.toLowerCase() : "#" + a.id;
    o.set(c, Math.max(o.get(c) ?? 0, d));
  }
  return [...o.values()].reduce((a, d) => a + d, 0);
}
const ie = (e, n) => e.nest?.fields?.find((r) => r.id === n);
function q(e, n, r) {
  if (n === "count") return r + (r === 1 ? " note" : " notes");
  if (n === "sources") return r + (r === 1 ? " customer" : " customers");
  const t = ie(e, n);
  return (t?.currency ? ae(r, t.currency) : String(r)) + " " + (t?.label ?? n);
}
const z = (e, n) => (e.behaviour?.rules ?? []).filter((r) => r.on && r.kind === n), F = (e) => z(e, "rank")[0]?.by;
function de(e, n) {
  const r = v(e, null, n), t = F(e);
  if (!t || n !== N(e).main) return r;
  const o = new Map(r.map((a) => [a.id, K(e, a.id, t)]));
  return r.sort((a, d) => o.get(d.id) - o.get(a.id) || te(a, d));
}
function H(e, n, r) {
  const t = I(e, n);
  if (!t) return null;
  const o = L(e, n), a = r.under === null ? null : I(e, r.under);
  if (a === void 0 || a && o.includes(a.id)) return null;
  const d = a ? a.laneId : r.laneId, { tray: c } = N(e);
  if (d === c && (a || o.length > 1)) return null;
  const l = (a ? v(e, a.id) : v(e, null, d)).filter((m) => m.id !== n);
  let h = r.before === null ? l.length : l.findIndex((m) => m.id === r.before);
  h < 0 && (h = l.length);
  const s = a ? v(e, a.id) : v(e, null, d);
  if ((t.parentId ?? null) === (a?.id ?? null) && t.laneId === d && s.indexOf(t) === h) return e;
  const i = l[h - 1]?.order, u = l[h]?.order;
  let p = /* @__PURE__ */ new Map(), f;
  if ((h === 0 || i) && (h === l.length || u) && (!i || !u || i < u)) f = O(i, u);
  else {
    const m = se(l.length + 1);
    l.forEach((k, g) => p.set(k.id, m[g < h ? g : g + 1])), f = m[h];
  }
  const y = e.cards.map((m) => {
    if (m.id === n) {
      const x = { ...m, laneId: d, order: f };
      return a ? x.parentId = a.id : delete x.parentId, x;
    }
    const k = p.get(m.id), g = o.includes(m.id) ? d : m.laneId;
    return k || g !== m.laneId ? { ...m, laneId: g, ...k && { order: k } } : m;
  });
  return le({ ...e, cards: y });
}
function le(e) {
  var t;
  const n = {}, r = /* @__PURE__ */ new Map();
  for (const o of e.cards) (n[t = o.parentId ?? "#" + o.laneId] ?? (n[t] = [])).push(o);
  for (const o of Object.values(n)) if (o.some((a) => a.order?.length > 16)) {
    const a = se(o.length);
    o.sort(te).forEach((d, c) => r.set(d.id, a[c]));
  }
  return r.size ? { ...e, cards: e.cards.map((o) => r.has(o.id) ? { ...o, order: r.get(o.id) } : o) } : e;
}
function ve(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = N(e), r = new Set((e.nest?.fields ?? []).map((o) => o.id)), t = F(e);
  if (t && t !== "count" && t !== "sources" && !r.has(t)) return "Cards on this board carry no " + t + ", so piles can’t rank by it.";
  for (const o of e.cards) {
    if (o.parentId !== void 0) {
      const d = I(e, o.parentId);
      if (!d) return w(o.label) + " sits under a card that is no longer on the board.";
      if (d.laneId !== o.laneId) return w(o.label) + " is in another area than the card it sits under.";
      if (o.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (U(e, o.id) > Math.min(R, e.cards.length)) return "Cards nest up to " + R + " levels deep, and never under themselves.";
    }
    if (Object.keys(o.fields ?? {}).find((d) => !r.has(d))) return w(o.label) + " has a number this board has no field for.";
  }
  return null;
}
function re(e, n) {
  const r = e.severity === "warn" ? " (a warning only)" : "";
  let t = "";
  switch (e.kind) {
    case "nests":
      t = j(E(e.role)) + " sit under " + Ie(e.under.map(ne));
      break;
    case "children":
      t = e.role ? j(ne(e.role)) + " holds at most " + e.max : "A card holds at most " + e.max + " under it";
      break;
    case "depth":
      t = e.max === 1 ? "Cards nest one level deep" : "Cards nest up to " + e.max + " levels deep";
      break;
    case "rank":
      t = "Piles rank by " + (e.by === "count" ? "number of notes" : e.by === "sources" ? "number of customers" : ie(n, e.by)?.label ?? e.by);
      break;
    case "emptyDrop":
      t = "A card let go in empty space " + (e.drop === "new-pile" ? "starts a new pile" : "goes to " + n.lanes[1].label);
      break;
  }
  return t + r + ".";
}
const X = ["nests", "depth", "children"];
function $(e, n) {
  const r = (e.behaviour?.rules ?? []).filter((l) => l.on && X.includes(l.kind)).sort((l, h) => X.indexOf(l.kind) - X.indexOf(h.kind)), t = [];
  if (!r.length) return { ok: !0, warnings: t };
  const o = new Map(e.cards.map((l) => [l.id, l])), { tray: a } = N(n), d = n.cards.filter((l) => {
    const h = o.get(l.id);
    return l.laneId !== a && (!h || h.parentId !== l.parentId || h.laneId !== l.laneId || h.role !== l.role);
  }), c = (l, h) => l.cards.filter((s) => s.parentId === h).length;
  for (const l of r) {
    let h = null;
    if (l.kind === "nests") {
      const s = d.find((i) => i.role === l.role && !l.under.includes(I(n, i.parentId)?.role ?? ""));
      s && (h = { sentence: re({ ...l, severity: "refuse" }, e), card: s });
    } else if (l.kind === "depth") {
      const s = d.find((i) => U(n, i.id) + B(n, i.id) > l.max);
      s && (h = { sentence: re({ ...l, severity: "refuse" }, e) + " " + s.label + " would be " + (U(n, s.id) + B(n, s.id)) + " deep.", card: s });
    } else if (l.kind === "children")
      for (const s of d) {
        const i = I(n, s.parentId);
        if (!i || l.role && i.role !== l.role) continue;
        const u = c(e, i.id), p = c(n, i.id);
        if (p > l.max && p > u) {
          h = { sentence: i.label + " holds " + l.max + ". It has " + u + ".", card: s };
          break;
        }
      }
    if (h) {
      if (l.severity === "warn") {
        t.push(h.sentence);
        continue;
      }
      return { refused: { sentence: h.sentence, ruleId: l.id, set: l.set, cardId: h.card.id, laneId: h.card.laneId } };
    }
  }
  return { ok: !0, warnings: t };
}
function xe(e) {
  const n = e.filter((o) => o.kind === "nests" && o.on && o.severity === "refuse"), r = /* @__PURE__ */ new Map(), t = (o, a) => {
    if (r.has(o)) return r.get(o);
    const d = n.find((l) => l.role === o);
    if (!d) return 0;
    if (a.includes(o)) return 1 / 0;
    const c = 1 + Math.min(...d.under.map((l) => t(l, [...a, o])));
    return a.length || r.set(o, c), c;
  };
  for (const o of n) r.set(o.role, t(o.role, []));
  return r;
}
function Ae(e, n) {
  const r = /* @__PURE__ */ new Set();
  for (const a of e.rules) {
    const d = a.kind + ":" + (a.kind === "nests" ? a.role : a.kind === "children" ? a.role ?? "" : "");
    if (r.has(d))
      return a.kind === "nests" ? "There is already a rule for where " + E(a.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    r.add(d);
  }
  const t = xe(e.rules), o = e.rules.find((a) => a.kind === "depth" && a.on && a.severity === "refuse");
  for (const [a, d] of t) {
    if (d === 1 / 0) return j(E(a)) + " could never be placed: what they sit under would have to sit under them first.";
    if (o && d > o.max) return j(E(a)) + " sit " + d + " levels down, but cards nest only " + o.max + " deep.";
  }
  return null;
}
const ce = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" };
function Se(e, n, r) {
  const t = Object.keys(e).find((a) => !["id", "on", "severity", "set", "kind", ...ce[e.kind].split(" ")].includes(a));
  if (t) throw new Error("A " + e.kind + " rule does not take " + t + ".");
  const o = (a, d, c) => {
    if (typeof a != "number" || !Number.isInteger(a) || a < 1 || a > d) throw new Error(c);
    return a;
  };
  switch (e.kind) {
    case "nests": {
      const a = T(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + E(a) + " sit under.");
      const d = [...new Set(e.under.map(T))];
      if (d.includes(a)) throw new Error(j(E(a)) + " can’t sit only under " + E(a) + ".");
      return { ...n, kind: "nests", role: a, under: d };
    }
    case "children": {
      const a = { ...n, kind: "children", max: o(e.max, 40, "A card holds from 1 to 40 cards under it.") };
      return e.role !== void 0 && (a.role = T(e.role)), a;
    }
    case "depth":
      return { ...n, kind: "depth", max: o(e.max, R, "Cards nest from 1 to " + R + " levels deep.") };
    case "rank":
      if (typeof e.by != "string" || !/^[a-z0-9-]{1,20}$/.test(e.by)) throw new Error("Piles rank by number of notes, number of customers, or a number field this board has.");
      return { ...n, kind: "rank", by: e.by };
    case "emptyDrop":
      if (e.drop !== "new-pile" && e.drop !== "unsorted") throw new Error("A card let go in empty space starts a new pile or goes to " + r.lanes[1].label + ".");
      return { ...n, kind: "emptyDrop", drop: e.drop };
  }
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const Ne = {
  keys: ce,
  read: (e, n, r) => Se(e, n, r),
  sentence: re,
  contradiction: Ae,
  check: $,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, oe = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((n, r) => ({ id: "rule-" + (r + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...n }))
}), ue = (e, n) => !e.behaviour || !("refused" in $(e, n));
function fe(e, n) {
  if (!I(e, n)) return [];
  const t = [], o = new Set(L(e, n)), a = B(e, n), d = [null, ...e.cards.filter((c) => !o.has(c.id) && c.laneId === N(e).main && U(e, c.id) + 1 + a <= R)];
  for (const c of e.lanes) for (const l of d) {
    if (l && c.id !== l.laneId) continue;
    const h = (l ? v(e, l.id) : v(e, null, c.id)).filter((s) => s.id !== n);
    for (let s = 0; s <= h.length; s++) {
      const i = { laneId: c.id, under: l?.id ?? null, before: h[s]?.id ?? null }, u = H(e, n, i);
      u && (u === e || ue(e, u)) && t.push({ spot: i, next: u });
    }
  }
  return t;
}
function Le(e, n) {
  const r = I(e, n);
  if (!r) return null;
  const t = z(e, "emptyDrop")[0], { main: o, tray: a } = N(e), d = t?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!d) return null;
  let c;
  if (d === "unsorted") c = r.laneId === a ? null : H(e, n, { laneId: a, under: null, before: null });
  else {
    if (e.cards.some((h) => h.parentId === n)) return null;
    const l = Y(e, [{ kind: "start_pile", card: { id: n } }]);
    c = "refused" in l ? null : l.workshop;
  }
  return c && c !== e && ue(e, c) ? c : null;
}
const Ce = (e) => JSON.stringify([
  e.nest?.layout,
  F(e),
  z(e, "emptyDrop")[0]?.kind && z(e, "emptyDrop")[0].drop,
  de(e, N(e).main).map((n) => n.id),
  e.cards.map((n) => fe(e, n.id).map(({ spot: r }) => r.under ?? r.laneId).filter((r, t, o) => o.indexOf(r) === t))
]);
function pe(e, n) {
  let r = n;
  for (let t = 0; t < 12 && !I(e, r); t++) {
    const o = e.nest?.aliases?.find(([a]) => a === r)?.[1];
    if (!o) return null;
    r = o;
  }
  return I(e, r) ? r : null;
}
function ze(e, n, r) {
  const t = we(e), o = ge(t), a = (y) => typeof y == "object" ? I(t, pe(t, y.id) ?? "") : I(t, y) ?? o.cards.attempt(y) ?? void 0, d = a(n), c = r.under === void 0 ? null : a(r.under);
  if (!d || c === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null } };
  const l = { kind: "nest_card", card: { id: d.id }, ...c ? { under: { id: c.id } } : r.lane ? { lane: r.lane } : {} }, h = Y(t, [l]);
  if (!("refused" in h)) {
    const y = $(t, h.workshop);
    return { ok: !0, warnings: "warnings" in y ? y.warnings : [] };
  }
  const s = h.refused.reason, i = (t.behaviour?.rules ?? []).find((y) => {
    if (!y.on) return !1;
    const m = { ...t, behaviour: { ...t.behaviour, rules: [{ ...y, severity: "refuse" }] } }, k = Y(m, [l]);
    return "refused" in k && k.refused.reason === s;
  }), u = new Set(fe(t, d.id).flatMap(({ spot: y }) => y.under ? [y.under] : [])), f = (c ? [...v(t, c.id), ...c.parentId ? v(t, c.parentId) : v(t, null, c.laneId)] : []).find((y) => u.has(y.id) && y.id !== d.parentId)?.label ?? null;
  return { refused: { sentence: s, ruleId: i?.id ?? null, nearest: f, ...i && { set: i.set } } };
}
const S = (e) => ({ type: "ref", of: "card", about: e }), _ = (e, n, r = !1) => ({ type: "text", max: e, about: n, ...r && { optional: r } }), A = ["nest"];
function _e(e) {
  const n = (r) => G.find((t) => t.kind === r);
  for (const r of e.kinds) G.some((t) => t.kind === r.kind) || G.push(r);
  for (const [r, t] of Object.entries(e.boards)) for (const o of t) {
    const a = n(r);
    a.boards.includes(o) || (a.boards.push(o), delete a.refusals[o]);
  }
  for (const [r, t] of Object.entries(e.fields)) Object.assign(n(r).fields, t);
  V.kinds.push(...e.rules.kinds.filter((r) => !V.kinds.includes(r))), Object.assign(V.keys, e.rules.keys);
}
_e({
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
      fields: { card: S("The card."), label: _(80, "The pile’s name. Left out, “New pile”.", !0) },
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
      fields: { card: S("The card."), role: _(24, "A word or two.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: S("The card."), source: _(60, "Who said it.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: { label: _(20, "Its name."), currency: { type: "choice", values: ["$", "€", "£"], optional: !0, about: "A money field’s sign." } },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_field",
      summary: "Nest board: set (or with null clear) a card’s number in a field.",
      intent: !1,
      fields: { card: S("The card."), field: _(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
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
      by: _(20, "Nest board: what piles rank by: count, sources, or a number field.", !0),
      drop: { type: "choice", values: ["new-pile", "unsorted"], optional: !0, about: "Nest board: where a far drop goes." }
    },
    add_card: { under: { ...S("Nest board: the card it goes under."), optional: !0 }, role: _(24, "Nest board: what it is.", !0), source: _(60, "Nest board: who said it.", !0) }
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
  return n ? (e.behaviour?.rules ?? []).find((t) => t.kind === "nests" && t.under.includes(n.role ?? ""))?.role ?? (n.role === "pile" ? "note" : void 0) : void 0;
}
const P = (e, n, r) => O(v(e, n, r).at(-1)?.order ?? null, null);
function Ee(e, n, r) {
  const t = e, { main: o, tray: a } = N(t), d = t.lanes[1].label, c = (s, i, u) => r.settle(le(s), i, u), l = (s) => {
    if (typeof s == "object" && !I(t, s.id)) {
      const i = pe(t, s.id);
      if (i) return I(t, i);
    }
    return r.card(s);
  }, h = (s, i) => {
    const u = H(t, s.id, i);
    return u || (i.under && L(t, s.id).includes(i.under) && r.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), r.refuse(d + " holds loose cards. Move what is under " + w(s.label) + " first.", { cardId: s.id, laneId: i.laneId })), c(u, i.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.lane(n.lane), i = n.label?.replace(/\s+/g, " ").trim();
      i || r.refuse("Say what the card should say, such as “Add a note called Slow exports to Reporting”.", { laneId: s.id });
      const u = n.under === void 0 ? null : l(n.under);
      u && s.id === a && r.refuse(d + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const p = n.role === void 0 ? Oe(t, u) : T(n.role), f = { id: Q(t), label: i, laneId: u?.laneId ?? s.id, ...p && { role: p }, ...n.source && { source: M(n.source, 60, "Say who said it in plain words.") } };
      if (!u && s.id === o && t.nest?.layout === "clusters" && n.role === void 0) {
        if ((z(t, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const W = c({ ...t, cards: [...t.cards, { ...f, laneId: a, order: P(t, null, a) }] }, a);
          return r.done(W, "Added " + w(i) + " to " + w(d) + ".", { laneId: a, cardId: f.id });
        }
        const k = { id: f.id, label: "New pile", laneId: o, role: "pile", order: P(t, null, o) }, g = { ...f, id: Q({ ...t, cards: [...t.cards, k] }), parentId: k.id, role: p ?? "note", order: O(null, null) }, x = c({ ...t, cards: [...t.cards, k, g] }, o);
        return r.done(x, "Added " + w(i) + " to a new pile.", { laneId: o, cardId: g.id });
      }
      u && (f.parentId = u.id), f.order = P(t, u?.id ?? null, f.laneId);
      const y = c({ ...t, cards: [...t.cards, f] }, f.laneId);
      return r.done(y, "Added " + w(i) + " to " + w(u?.label ?? t.lanes.find((m) => m.id === f.laneId).label) + ".", { laneId: f.laneId, cardId: f.id });
    }
    case "nest_card": {
      const s = r.card(n.card), i = n.under === void 0 ? null : l(n.under), u = i?.laneId ?? (n.lane === void 0 ? s.laneId : r.lane(n.lane).id), p = n.before === void 0 ? null : r.card(n.before).id, f = h(s, { laneId: u, under: i?.id ?? null, before: p });
      if (f === t) return r.done(t, w(s.label) + " is there already.", { laneId: u, cardId: s.id });
      const y = i ? "under " + w(i.label) : u === a ? "to " + w(d) : "to the top of " + w(t.lanes[0].label);
      return r.done(f, "Moved " + w(s.label) + " " + y + ".", { laneId: u, cardId: s.id });
    }
    case "start_pile": {
      const s = r.card(n.card);
      t.cards.some((y) => y.parentId === s.id) && r.refuse(w(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const i = n.label === void 0 ? "New pile" : M(n.label, 80, "Name the pile in plain words."), u = { id: Q(t), label: i, laneId: o, role: "pile", order: P(t, null, o) }, p = t.cards.map((y) => {
        if (y.id !== s.id) return y;
        const m = { ...y, laneId: o, parentId: u.id, order: O(null, null) };
        return (!m.role || m.role === "pile") && (m.role = "note"), m;
      }), f = c({ ...t, cards: [...p, u] }, o, s.id);
      return r.done(f, "Started a new pile, " + w(i) + ", with " + w(s.label) + " in it.", { laneId: o, cardId: u.id });
    }
    case "merge_cards": {
      const s = r.card(n.card), i = r.card(n.into);
      s.id === i.id && r.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), L(t, s.id).includes(i.id) && r.refuse(w(i.label) + " is under " + w(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (i.laneId === a || s.laneId === a) && r.refuse("Merge cards on the board, not in " + w(d) + ".", { cardId: s.id, laneId: a });
      const u = v(t, s.id);
      let p = v(t, i.id).at(-1)?.order ?? null;
      const f = new Map(u.map((g) => (p = O(p, null), [g.id, p]))), y = [...(t.nest.aliases ?? []).map(([g, x]) => [g, x === s.id ? i.id : x]), [s.id, i.id]].slice(-12), m = t.cards.filter((g) => g.id !== s.id).map((g) => f.has(g.id) ? { ...g, parentId: i.id, order: f.get(g.id) } : g), k = c({ ...t, nest: { ...t.nest, aliases: y }, cards: m }, i.laneId, i.id);
      return r.done(k, "Merged " + w(s.label) + " into " + w(i.label) + (u.length ? ": " + u.length + (u.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: i.laneId, cardId: i.id });
    }
    case "remove_card": {
      const s = r.card(n.card), i = v(t, s.id), u = (m) => {
        let k = !1, g = v(t, s.parentId ?? null, s.laneId).at(-1)?.order ?? null, x = v(t, null, a).at(-1)?.order ?? null;
        const W = new Map(i.map((C) => {
          const J = (m || !s.parentId) && !t.cards.some((Z) => Z.parentId === C.id);
          return k || (k = J), [C.id, J ? { laneId: a, order: x = O(x, null) } : { laneId: s.laneId, order: g = O(g, null), ...s.parentId && { parentId: s.parentId } }];
        })), ye = t.cards.flatMap((C) => C.id === s.id ? [] : W.has(C.id) ? [(({ parentId: J, ...Z }) => ({ ...Z, ...W.get(C.id) }))(C)] : [C]);
        return { board: { ...t, cards: ye }, tidy: k };
      };
      let p = u(!1);
      if (s.parentId && t.behaviour && "refused" in $(t, p.board)) {
        const m = u(!0);
        "refused" in $(t, m.board) || (p = m);
      }
      const { tidy: f } = p, y = c(p.board, s.laneId);
      return r.done(y, "Removed " + w(s.label) + "." + (i.length ? f ? " What was in it went to " + w(d) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = r.card(n.card);
      let i = "";
      try {
        i = T(n.role);
      } catch (p) {
        r.refuse(p.message, { cardId: s.id, laneId: s.laneId });
      }
      const u = c({ ...t, cards: t.cards.map((p) => p.id === s.id ? { ...p, role: i } : p) }, s.laneId, s.id);
      return r.done(u, w(s.label) + " is " + ne(i) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = r.card(n.card);
      let i = "";
      try {
        i = M(n.source, 60, "Say who said it in plain words.");
      } catch (p) {
        r.refuse(p.message, { cardId: s.id });
      }
      const u = c({ ...t, cards: t.cards.map((p) => p.id === s.id ? { ...p, source: i } : p) }, s.laneId, s.id);
      return r.done(u, w(s.label) + " came from " + i + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = t.nest.fields ?? [];
      let i = "";
      try {
        i = M(n.label, 20, "Name the field in a word or two.");
      } catch (f) {
        r.refuse(f.message);
      }
      const u = i.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((f) => f.id === u || f.label.toLowerCase() === i.toLowerCase()) && r.refuse("Cards already carry " + i + "."), s.length >= 4 && r.refuse("Cards carry up to 4 number fields.");
      const p = c({ ...t, nest: { ...t.nest, fields: [...s, { id: u, label: i, ...n.currency && { currency: n.currency } }] } });
      return r.done(p, "Cards can carry " + i + " now.");
    }
    case "set_field": {
      const s = r.card(n.card), i = (t.nest.fields ?? []).find((f) => f.id === n.field || f.label.toLowerCase() === String(n.field).toLowerCase());
      i || r.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && r.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const u = t.cards.map((f) => {
        if (f.id !== s.id) return f;
        const y = { ...f.fields };
        n.value === null ? delete y[i.id] : y[i.id] = n.value;
        const m = { ...f, fields: y };
        return Object.keys(y).length || delete m.fields, m;
      }), p = c({ ...t, cards: u }, s.laneId, s.id);
      return r.done(p, w(s.label) + (n.value === null ? " has no " + i.label + " now." : "’s " + i.label + " is " + (i.currency ? ae(n.value, i.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && r.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = c({ ...t, nest: { ...t.nest, layout: n.layout } });
      return r.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function Me(e, n) {
  if (e.cards.some((r) => r.parentId === n.id) || n.role === "pile") {
    const r = [q(e, "count", K(e, n.id, "count"))];
    if (e.nest?.layout === "clusters") {
      const t = K(e, n.id, "sources");
      t && r.push(q(e, "sources", t));
      const o = F(e);
      o && o !== "count" && o !== "sources" && r.push(q(e, o, K(e, n.id, o)));
    }
    return n.label + `
` + r.join(" · ");
  }
  return n.source ? n.label + `
— ` + n.source : n.label;
}
function Te(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [r, t] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(r) || typeof t != "number" || !Number.isInteger(t) || t < 0 || t > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[r] = t;
  }
  return Object.keys(n).length ? n : void 0;
}
function De(e, n) {
  const r = JSON.stringify, t = (o) => r(o.cards.map((a) => [a.id, a.laneId, a.parentId, a.order, a.role]));
  return r(e.behaviour?.rules) !== r(n.behaviour?.rules) && t(e) !== t(n) ? "Change the rules on their own, then move cards." : null;
}
const Re = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: Ne,
  drags: Ce,
  fixed: De,
  order: (e, n) => de(e, n).map((r) => r.id),
  readCard(e, n, r) {
    if (e.parentId !== void 0 && (n.parentId = r.id(e.parentId)), e.role !== void 0 && (n.role = T(e.role)), e.order !== void 0) {
      if (!be(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = M(e.source, 60, "Say who said it in plain words."));
    const t = Te(e.fields);
    t && (n.fields = t);
  },
  readBoard(e, n, r) {
    const t = e.nest;
    if (!t || typeof t != "object" || Array.isArray(t)) throw new Error("A nested board says how it is drawn.");
    if (t.layout !== "clusters" && t.layout !== "tree") throw new Error("A nested board is drawn as piles or as a tree.");
    const o = { layout: t.layout };
    if (t.fields !== void 0) {
      if (!Array.isArray(t.fields) || t.fields.length > 4) throw new Error("Cards carry up to 4 number fields.");
      if (o.fields = t.fields.map((a) => {
        const d = a ?? {};
        if (typeof d.id != "string" || !/^[a-z0-9-]{1,20}$/.test(d.id)) throw new Error("A field’s id is a short slug.");
        const c = { id: d.id, label: M(d.label, 20, "Name the field in a word or two.") };
        if (d.currency !== void 0) {
          if (d.currency !== "$" && d.currency !== "€" && d.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          c.currency = d.currency;
        }
        return c;
      }), new Set(o.fields.map((a) => a.id)).size !== o.fields.length) throw new Error("Duplicate field.");
    }
    if (t.aliases !== void 0) {
      if (!Array.isArray(t.aliases) || t.aliases.length > 12) throw new Error("A board keeps up to 12 merged cards’ new homes.");
      o.aliases = t.aliases.map((a) => {
        if (!Array.isArray(a) || a.length !== 2) throw new Error("A merged card’s new home is a pair of ids.");
        return [r.id(a[0]), r.id(a[1])];
      });
    }
    n.nest = o;
  },
  validate: ve,
  planMove(e, n, r) {
    const t = I(e, n);
    return !t || !e.lanes.some((o) => o.id === r) ? null : t.laneId === r && !t.parentId ? e : H(e, n, { laneId: r, under: null, before: null });
  },
  refusal(e, n, r) {
    const t = I(e, n);
    return t && r === N(e).tray && e.cards.some((o) => o.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + w(t.label) + " first." : null;
  },
  caption(e, n) {
    const r = e.cards.filter((o) => o.laneId === n).length;
    if (n === N(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const t = v(e, null, n).length;
    return e.nest?.layout === "clusters" ? t + (t === 1 ? " pile" : " piles") + " · " + (r - t) + (r - t === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: Me,
  noteText: (e, n) => n.label,
  fromNote: (e, n) => ({ label: n.replace(/\s+/g, " ").trim().slice(0, 80) }),
  renamed: (e, n, r) => ({ label: r.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: Ee
};
me(Re);
function b(e, n, r) {
  const t = se(n.length);
  return n.map(([o, a, d], c) => ({ id: o, label: a, laneId: e, order: t[c], ...r && { parentId: r }, ...d }));
}
function $e() {
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
    behaviour: oe([{ kind: "nests", role: "note", under: ["pile"] }, { kind: "depth", max: 1 }, { kind: "rank", by: "sources" }, { kind: "emptyDrop", drop: "new-pile" }])
  };
}
function We() {
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
    behaviour: oe([
      { kind: "nests", role: "opportunity", under: ["outcome"] },
      { kind: "nests", role: "solution", under: ["opportunity"] },
      { kind: "depth", max: 3 },
      { kind: "children", role: "opportunity", max: 4 }
    ])
  };
}
const he = () => oe([{ kind: "nests", role: "action", under: ["cause"], severity: "warn" }, { kind: "depth", max: 6, severity: "warn" }]);
function Pe() {
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
    behaviour: he()
  };
}
function Ke() {
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
    behaviour: he()
  };
}
export {
  Pe as breakDownSample,
  te as byOrder,
  $ as checkNest,
  ze as checkNestMove,
  We as discoveryTreeSample,
  Ke as incidentReviewSample,
  be as isOrderKey,
  pe as nestAlias,
  N as nestAreas,
  Me as nestCardText,
  U as nestDepth,
  Ce as nestDrags,
  Le as nestEmptyDrop,
  Ne as nestFamily,
  v as nestKids,
  fe as nestLegal,
  K as nestMeasure,
  q as nestMeasureWords,
  H as nestPlace,
  de as nestRoots,
  Re as nestRules,
  re as nestSentence,
  L as nestSubtree,
  O as orderBetween,
  se as orderKeys,
  T as roleOf,
  $e as sortEvidenceSample,
  le as tidyKeys,
  ve as validateNest
};
