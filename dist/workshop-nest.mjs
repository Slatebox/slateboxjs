import { registerWorkshopRules as ge, workshopEditKinds as G, workshopRuleSchema as Q, said as g, workshopOverrideMark as Ie, workshopShedMark as ke, workshopHasMarks as ve, workshopFreshOverride as be, applyWorkshopEdits as ee, validateWorkshop as xe, workshopReferences as Ae } from "./workshop-model.mjs";
const z = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", Ne = (e) => typeof e == "string" && /^[0-9A-Za-z]{0,47}[1-9A-Za-z]$/.test(e);
function ne(e, n) {
  if (n !== null) {
    let o = 0;
    for (; (e[o] ?? "0") === n[o]; ) o++;
    if (o > 0) return n.slice(0, o) + ne(e.slice(o), n.slice(o));
  }
  const t = e ? z.indexOf(e[0]) : 0, r = n !== null ? z.indexOf(n[0]) : z.length;
  return r - t > 1 ? z[Math.round((t + r) / 2)] : n && n.length > 1 ? n.slice(0, 1) : z[t] + ne(e.slice(1), null);
}
function C(e, n) {
  if (e && n && e >= n) throw new Error("Order keys out of order.");
  return ne(e ?? "", n ?? null);
}
const se = (e, n) => (e.order ?? "") < (n.order ?? "") ? -1 : (e.order ?? "") > (n.order ?? "") ? 1 : e.id < n.id ? -1 : e.id > n.id ? 1 : 0;
function de(e) {
  const n = [];
  for (let t = 0; t < e; t++) n.push(C(n[t - 1] ?? null, null));
  return n;
}
const $ = 6, T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", R = (e) => e.charAt(0).toUpperCase() + e.slice(1), re = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, _e = (e) => e.length > 1 ? e.slice(0, -1).join(", ") + " or " + e.at(-1) : e[0] ?? "";
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
let x = null;
function Fe(e) {
  x = e, Object.assign(oe, e.keys);
}
const D = (e, n, t) => {
  const r = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!r || r.length > n || /[<>\u0000-\u001f]/.test(r)) throw new Error(t);
  return r;
}, _ = (e) => ({ main: e.lanes[0].id, tray: e.lanes[1].id }), v = (e, n) => n === void 0 ? void 0 : e.cards.find((t) => t.id === n);
function b(e, n, t) {
  return e.cards.filter((r) => (r.parentId ?? null) === n && (n !== null || r.laneId === t)).sort(se);
}
function W(e, n) {
  const t = [n];
  for (let r = 0; r < t.length; r++) for (const o of e.cards) o.parentId === t[r] && t.push(o.id);
  return t;
}
function P(e, n) {
  let t = 0;
  for (let r = v(e, n); r?.parentId && t <= e.cards.length; r = v(e, r.parentId)) t++;
  return t;
}
function U(e, n) {
  const t = e.cards.filter((r) => r.parentId === n);
  return t.length ? 1 + Math.max(...t.map((r) => U(e, r.id))) : 0;
}
function Me(e, n) {
  return W(e, n).slice(1).map((t) => v(e, t)).filter((t) => !e.cards.some((r) => r.parentId === t.id));
}
function B(e, n, t) {
  const r = Me(e, n);
  if (t === "count") return r.length;
  if (t === "sources") return new Set(r.flatMap((d) => d.source ? [d.source.toLowerCase()] : [])).size;
  const o = /* @__PURE__ */ new Map();
  for (const d of r) {
    const i = d.fields?.[t];
    if (i === void 0) continue;
    const l = d.source ? d.source.toLowerCase() : "#" + d.id;
    o.set(l, Math.max(o.get(l) ?? 0, i));
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
const K = (e, n) => (e.behaviour?.rules ?? []).filter((t) => t.on && t.kind === n), H = (e) => K(e, "rank")[0]?.by;
function le(e, n) {
  const t = b(e, null, n), r = H(e);
  if (!r || n !== _(e).main) return t;
  const o = new Map(t.map((d) => [d.id, B(e, d.id, r)]));
  return t.sort((d, i) => o.get(i.id) - o.get(d.id) || se(d, i));
}
function J(e, n, t) {
  const r = v(e, n);
  if (!r) return null;
  const o = W(e, n), d = t.under === null ? null : v(e, t.under);
  if (d === void 0 || d && o.includes(d.id)) return null;
  const i = d ? d.laneId : t.laneId, { tray: l } = _(e);
  if (i === l && (d || o.length > 1)) return null;
  const y = (d ? b(e, d.id) : b(e, null, i)).filter((u) => u.id !== n);
  let c = t.before === null ? y.length : y.findIndex((u) => u.id === t.before);
  c < 0 && (c = y.length);
  const m = d ? b(e, d.id) : b(e, null, i);
  if ((r.parentId ?? null) === (d?.id ?? null) && r.laneId === i && m.indexOf(r) === c) return e;
  const s = y[c - 1]?.order, a = y[c]?.order;
  let p = /* @__PURE__ */ new Map(), h;
  if ((c === 0 || s) && (c === y.length || a) && (!s || !a || s < a)) h = C(s, a);
  else {
    const u = de(y.length + 1);
    y.forEach((w, k) => p.set(w.id, u[k < c ? k : k + 1])), h = u[c];
  }
  const f = e.cards.map((u) => {
    if (u.id === n) {
      const I = { ...u, laneId: i, order: h };
      return d ? I.parentId = d.id : delete I.parentId, I;
    }
    const w = p.get(u.id), k = o.includes(u.id) ? i : u.laneId;
    return w || k !== u.laneId ? { ...u, laneId: k, ...w && { order: w } } : u;
  });
  return ce({ ...e, cards: f });
}
function ce(e) {
  var r;
  const n = {}, t = /* @__PURE__ */ new Map();
  for (const o of e.cards) (n[r = o.parentId ?? "#" + o.laneId] ?? (n[r] = [])).push(o);
  for (const o of Object.values(n)) if (o.some((d) => d.order?.length > 16)) {
    const d = de(o.length);
    o.sort(se).forEach((i, l) => t.set(i.id, d[l]));
  }
  return t.size ? { ...e, cards: e.cards.map((o) => t.has(o.id) ? { ...o, order: t.get(o.id) } : o) } : e;
}
function Oe(e) {
  if (e.lanes.length !== 2) return "A nested board has two areas: the board and a tray for cards not placed yet.";
  const { tray: n } = _(e), t = new Set((e.nest?.fields ?? []).map((o) => o.id));
  if (e.nest?.layout === "matrix" && !x) return "A 2 by 2 needs its rules loaded.";
  const r = H(e);
  if (r && r !== "count" && r !== "sources" && !t.has(r)) return "Cards on this board carry no " + r + ", so piles can’t rank by it.";
  for (const o of e.cards) {
    if (o.parentId !== void 0) {
      const i = v(e, o.parentId);
      if (!i) return g(o.label) + " sits under a card that is no longer on the board.";
      if (i.laneId !== o.laneId) return g(o.label) + " is in another area than the card it sits under.";
      if (o.laneId === n) return e.lanes[1].label + " holds loose cards: nothing sits under another there.";
      if (P(e, o.id) > Math.min($, e.cards.length)) return "Cards nest up to " + $ + " levels deep, and never under themselves.";
    }
    if (Object.keys(o.fields ?? {}).find((i) => !t.has(i))) return g(o.label) + " has a number this board has no field for.";
  }
  return x?.validate(e) ?? null;
}
function te(e, n) {
  const t = e.severity === "warn" ? " (a warning only)" : "";
  let r = "";
  switch (e.kind) {
    case "nests":
      r = R(T(e.role)) + " sit under " + _e(e.under.map(re));
      break;
    case "children":
      r = e.role ? R(re(e.role)) + " holds at most " + e.max : "A card holds at most " + e.max + " under it";
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
      r = (x?.sentence(e, n) ?? e.kind).replace(/\.$/, "");
  }
  return r + t + ".";
}
const Y = ["nests", "depth", "children"];
function L(e, n) {
  const t = (e.behaviour?.rules ?? []).filter((c) => c.on && Y.includes(c.kind)).sort((c, m) => Y.indexOf(c.kind) - Y.indexOf(m.kind)), r = [];
  if (!t.length) return x?.check(e, n, r) ?? { ok: !0, warnings: r };
  const o = new Map(e.cards.map((c) => [c.id, c])), { tray: d } = _(n), i = ve(e, n), l = n.cards.filter((c) => {
    const m = o.get(c.id);
    return i && be(e, c) ? !1 : c.laneId !== d && (!m || m.parentId !== c.parentId || m.laneId !== c.laneId || m.role !== c.role);
  }), y = (c, m) => c.cards.filter((s) => s.parentId === m).length;
  for (const c of t) {
    let m = null;
    if (c.kind === "nests") {
      const s = l.find((a) => a.role === c.role && !c.under.includes(v(n, a.parentId)?.role ?? ""));
      s && (m = { sentence: te({ ...c, severity: "refuse" }, e), card: s });
    } else if (c.kind === "depth") {
      const s = l.find((a) => P(n, a.id) + U(n, a.id) > c.max);
      s && (m = { sentence: te({ ...c, severity: "refuse" }, e) + " " + s.label + " would be " + (P(n, s.id) + U(n, s.id)) + " deep.", card: s });
    } else if (c.kind === "children")
      for (const s of l) {
        const a = v(n, s.parentId);
        if (!a || c.role && a.role !== c.role) continue;
        const p = y(e, a.id), h = y(n, a.id);
        if (h > c.max && h > p) {
          m = { sentence: a.label + " holds " + c.max + ". It has " + p + ".", card: s };
          break;
        }
      }
    if (m) {
      if (c.severity === "warn") {
        r.push(m.sentence);
        continue;
      }
      return { refused: { sentence: m.sentence, ruleId: c.id, set: c.set, cardId: m.card.id, laneId: m.card.laneId } };
    }
  }
  return x?.check(e, n, r) ?? { ok: !0, warnings: r };
}
function Ee(e) {
  const n = e.filter((o) => o.kind === "nests" && o.on && o.severity === "refuse"), t = /* @__PURE__ */ new Map(), r = (o, d) => {
    if (t.has(o)) return t.get(o);
    const i = n.find((y) => y.role === o);
    if (!i) return 0;
    if (d.includes(o)) return 1 / 0;
    const l = 1 + Math.min(...i.under.map((y) => r(y, [...d, o])));
    return d.length || t.set(o, l), l;
  };
  for (const o of n) t.set(o.role, r(o.role, []));
  return t;
}
function Ce(e, n) {
  const t = /* @__PURE__ */ new Set();
  for (const d of e.rules) {
    if (!(d.kind in ue)) continue;
    const i = d.kind + ":" + (d.kind === "nests" ? d.role : d.kind === "children" ? d.role ?? "" : "");
    if (t.has(i))
      return d.kind === "nests" ? "There is already a rule for where " + T(d.role) + " sit. Change that one instead." : "There is already a rule like that on this board. Change that one instead.";
    t.add(i);
  }
  const r = Ee(e.rules), o = e.rules.find((d) => d.kind === "depth" && d.on && d.severity === "refuse");
  for (const [d, i] of r) {
    if (i === 1 / 0) return R(T(d)) + " could never be placed: what they sit under would have to sit under them first.";
    if (o && i > o.max) return R(T(d)) + " sit " + i + " levels down, but cards nest only " + o.max + " deep.";
  }
  return x?.contradiction(e, n) ?? null;
}
const ue = { nests: "role under", children: "max role", depth: "max", rank: "by", emptyDrop: "drop" }, oe = { ...ue };
function Te(e, n, t) {
  const r = Object.keys(e).find((i) => !["id", "on", "severity", "set", "kind", ...oe[e.kind].split(" ")].includes(i));
  if (r) throw new Error("A " + e.kind + " rule does not take " + r + ".");
  const o = (i, l, y) => {
    if (typeof i != "number" || !Number.isInteger(i) || i < 1 || i > l) throw new Error(y);
    return i;
  };
  switch (e.kind) {
    case "nests": {
      const i = j(e.role);
      if (!Array.isArray(e.under) || e.under.length < 1 || e.under.length > 4) throw new Error("Say what " + T(i) + " sit under.");
      const l = [...new Set(e.under.map(j))];
      if (l.includes(i)) throw new Error(R(T(i)) + " can’t sit only under " + T(i) + ".");
      return { ...n, kind: "nests", role: i, under: l };
    }
    case "children": {
      const i = { ...n, kind: "children", max: o(e.max, 40, "A card holds from 1 to 40 cards under it.") };
      return e.role !== void 0 && (i.role = j(e.role)), i;
    }
    case "depth":
      return { ...n, kind: "depth", max: o(e.max, $, "Cards nest from 1 to " + $ + " levels deep.") };
    case "rank":
      if (typeof e.by != "string" || !/^[a-z0-9-]{1,20}$/.test(e.by)) throw new Error("Piles rank by number of notes, number of customers, or a number field this board has.");
      return { ...n, kind: "rank", by: e.by };
    case "emptyDrop":
      if (e.drop !== "new-pile" && e.drop !== "unsorted") throw new Error("A card let go in empty space starts a new pile or goes to " + t.lanes[1].label + ".");
      return { ...n, kind: "emptyDrop", drop: e.drop };
  }
  const d = x?.read(e, n, t);
  if (d) return d;
  throw new Error("This board does not know the rule " + String(e.kind) + ".");
}
const Se = {
  keys: oe,
  read: (e, n, t) => Te(e, n, t),
  sentence: te,
  contradiction: Ce,
  check: L,
  builtIn: (e) => [e.lanes[1].label + " holds cards not placed yet: no rule applies there."]
}, fe = (e, n) => !e.behaviour || !("refused" in L(e, n));
function pe(e, n) {
  if (!v(e, n)) return [];
  const r = [], o = new Set(W(e, n)), d = U(e, n), i = [null, ...e.cards.filter((l) => !o.has(l.id) && l.laneId === _(e).main && P(e, l.id) + 1 + d <= $)];
  for (const l of e.lanes) for (const y of i) {
    if (y && l.id !== y.laneId) continue;
    const c = (y ? b(e, y.id) : b(e, null, l.id)).filter((m) => m.id !== n);
    for (let m = 0; m <= c.length; m++) {
      const s = { laneId: l.id, under: y?.id ?? null, before: c[m]?.id ?? null }, a = J(e, n, s);
      a && (a === e || fe(e, a)) && r.push({ spot: s, next: a });
    }
  }
  return r;
}
function Be(e, n) {
  const t = v(e, n);
  if (!t) return null;
  const r = K(e, "emptyDrop")[0], { main: o, tray: d } = _(e), i = r?.drop ?? (e.nest?.layout === "clusters" ? "new-pile" : null);
  if (!i) return null;
  let l;
  if (i === "unsorted") l = t.laneId === d ? null : J(e, n, { laneId: d, under: null, before: null });
  else {
    if (e.cards.some((c) => c.parentId === n)) return null;
    const y = ee(e, [{ kind: "start_pile", card: { id: n } }]);
    l = "refused" in y ? null : y.workshop;
  }
  return l && l !== e && fe(e, l) ? l : null;
}
const De = (e) => (x?.drags(e) ?? "") + JSON.stringify([
  e.nest?.layout,
  H(e),
  K(e, "emptyDrop")[0]?.kind && K(e, "emptyDrop")[0].drop,
  le(e, _(e).main).map((n) => n.id),
  e.cards.map((n) => pe(e, n.id).map(({ spot: t }) => t.under ?? t.laneId).filter((t, r, o) => o.indexOf(t) === r))
]);
function he(e, n) {
  let t = n;
  for (let r = 0; r < 12 && !v(e, t); r++) {
    const o = e.nest?.aliases?.find(([d]) => d === t)?.[1];
    if (!o) return null;
    t = o;
  }
  return v(e, t) ? t : null;
}
function Pe(e, n, t) {
  const r = xe(e), o = Ae(r), d = (u) => typeof u == "object" ? v(r, he(r, u.id) ?? "") : v(r, u) ?? o.cards.attempt(u) ?? void 0, i = d(n), l = t.under === void 0 ? null : d(t.under);
  if (!i || l === void 0) return { refused: { sentence: "There is no such card on this board.", ruleId: null, nearest: null, overridable: !1 } };
  const y = { kind: "nest_card", card: { id: i.id }, ...l ? { under: { id: l.id } } : t.lane ? { lane: t.lane } : {} }, c = ee(r, [y]);
  if (!("refused" in c)) {
    const u = L(r, c.workshop);
    return { ok: !0, warnings: "warnings" in u ? u.warnings : [] };
  }
  const m = c.refused.reason, s = (r.behaviour?.rules ?? []).find((u) => {
    if (!u.on) return !1;
    const w = { ...r, behaviour: { ...r.behaviour, rules: [{ ...u, severity: "refuse" }] } }, k = ee(w, [y]);
    return "refused" in k && k.refused.reason === m;
  }), a = new Set(pe(r, i.id).flatMap(({ spot: u }) => u.under ? [u.under] : [])), h = (l ? [...b(r, l.id), ...l.parentId ? b(r, l.parentId) : b(r, null, l.laneId)] : []).find((u) => a.has(u.id) && u.id !== i.parentId)?.label ?? null, f = c.refused.overridable === !0;
  return { refused: { sentence: m, ruleId: s?.id ?? null, nearest: h, overridable: f, ...s && { set: s.set } } };
}
const N = (e) => ({ type: "ref", of: "card", about: e }), E = (e, n, t = !1) => ({ type: "text", max: e, about: n, ...t && { optional: t } }), A = ["nest"];
function je(e) {
  const n = (t) => G.find((r) => r.kind === t);
  for (const t of e.kinds) G.some((r) => r.kind === t.kind) || G.push(t);
  for (const [t, r] of Object.entries(e.boards)) for (const o of r) {
    const d = n(t);
    d.boards.includes(o) || (d.boards.push(o), delete d.refusals[o]);
  }
  for (const [t, r] of Object.entries(e.fields)) Object.assign(n(t).fields, r);
  Q.kinds.push(...e.rules.kinds.filter((t) => !Q.kinds.includes(t))), Object.assign(Q.keys, e.rules.keys);
}
je({
  kinds: [
    {
      kind: "nest_card",
      summary: "Nest board: put a card under another (under), at the top of an area (lane), before a sibling (before). The cards under it come with it.",
      intent: !0,
      fields: {
        card: N("The card."),
        under: { ...N("The card it goes under."), optional: !0 },
        lane: { type: "ref", of: "lane", optional: !0, about: "The area it goes to the top of." },
        before: { ...N("The sibling it goes before. Left out, last."), optional: !0 },
        override: { type: "flag", optional: !0, about: "True to nest it anyway when a rule refuses it (a role, a depth, a parent’s limit), once the person agreed to break that rule. The card shows who moved it anyway and when." }
      },
      boards: A,
      refusals: {}
    },
    {
      kind: "start_pile",
      summary: "Nest board: start a new pile with this card in it.",
      intent: !0,
      fields: { card: N("The card."), label: E(80, "The pile’s name. Left out, “New pile”.", !0) },
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
      fields: { card: N("The card."), role: E(24, "A word or two.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "set_source",
      summary: "Nest board: say who a card came from (a customer, an interview).",
      intent: !1,
      fields: { card: N("The card."), source: E(60, "Who said it.") },
      boards: A,
      refusals: {}
    },
    {
      kind: "add_field",
      summary: "Nest board: add a number field cards can carry (ARR, seats…). Up to 4.",
      intent: !1,
      fields: {
        label: E(20, "Its name."),
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
      fields: { card: N("The card."), field: E(20, "The field, by id or name."), value: { type: "integer", min: 0, max: 1e9, nullable: !0, about: "A whole number, or null." } },
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
      by: E(20, "Nest board: what piles rank by: count, sources, or a number field.", !0),
      drop: { type: "choice", values: ["new-pile", "unsorted"], optional: !0, about: "Nest board: where a far drop goes." }
    },
    add_card: { under: { ...N("Nest board: the card it goes under."), optional: !0 }, role: E(24, "Nest board: what it is.", !0), source: E(60, "Nest board: who said it.", !0) }
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
const F = (e, n, t) => C(b(e, n, t).at(-1)?.order ?? null, null);
function Le(e, n, t) {
  const r = e, { main: o, tray: d } = _(r), i = r.lanes[1].label, l = (s, a, p) => t.settle(ce(s), a, p), y = x?.edit(r, n, t, l);
  if (y) return y;
  const c = (s) => {
    if (typeof s == "object" && !v(r, s.id)) {
      const a = he(r, s.id);
      if (a) return v(r, a);
    }
    return t.card(s);
  }, m = (s, a) => {
    const p = J(r, s.id, a);
    return p || (a.under && W(r, s.id).includes(a.under) && t.refuse("A card can’t go under itself or a card under it.", { cardId: s.id, laneId: s.laneId }), t.refuse(i + " holds loose cards. Move what is under " + g(s.label) + " first.", { cardId: s.id, laneId: a.laneId })), l(p, a.laneId, s.id);
  };
  switch (n.kind) {
    case "add_card": {
      const s = r.nest?.layout === "matrix" ? r.lanes[1] : t.lane(n.lane), a = n.under === void 0 ? null : c(n.under), p = n.label?.replace(/\s+/g, " ").trim() || "New " + ye(r, a?.id);
      a && s.id === d && t.refuse(i + " holds loose cards: nothing sits under another there.", { laneId: s.id });
      const h = n.role === void 0 ? me(r, a) : j(n.role), f = { id: V(r), label: p, laneId: a?.laneId ?? s.id, ...h && { role: h }, ...a?.owner && { owner: a.owner }, ...n.source && { source: D(n.source, 60, "Say who said it in plain words.") } };
      if (!a && s.id === o && r.nest?.layout === "clusters" && n.role === void 0) {
        if ((K(r, "emptyDrop")[0]?.drop ?? "new-pile") === "unsorted") {
          const S = l({ ...r, cards: [...r.cards, { ...f, laneId: d, order: F(r, null, d) }] }, d);
          return t.done(S, "Added " + g(p) + " to " + g(i) + ".", { laneId: d, cardId: f.id });
        }
        const k = { id: f.id, label: "New pile", laneId: o, role: "pile", order: F(r, null, o) }, I = { ...f, id: V({ ...r, cards: [...r.cards, k] }), parentId: k.id, role: h ?? "note", order: C(null, null) }, M = l({ ...r, cards: [...r.cards, k, I] }, o);
        return t.done(M, "Added " + g(p) + " to a new pile.", { laneId: o, cardId: I.id });
      }
      a && (f.parentId = a.id), f.order = F(r, a?.id ?? null, f.laneId);
      const u = l({ ...r, cards: [...r.cards, f] }, f.laneId);
      return t.done(u, "Added " + g(p) + " to " + g(a?.label ?? r.lanes.find((w) => w.id === f.laneId).label) + ".", { laneId: f.laneId, cardId: f.id });
    }
    case "nest_card": {
      const s = t.card(n.card), a = n.under === void 0 ? null : c(n.under), p = a?.laneId ?? (n.lane === void 0 ? s.laneId : t.lane(n.lane).id), h = n.before === void 0 ? null : t.card(n.before).id;
      let f = m(s, { laneId: p, under: a?.id ?? null, before: h });
      if (f === r) return t.done(r, g(s.label) + " is there already.", { laneId: p, cardId: s.id });
      const u = a ? "under " + g(a.label) : p === d ? "to " + g(i) : "to the top of " + g(r.lanes[0].label), w = n.override === !0 ? L(r, f) : null, k = w && "refused" in w ? Ie(s, w.refused.sentence, t.who ?? { by: "an agent", at: (/* @__PURE__ */ new Date()).toISOString() }, { parentId: s.parentId ?? null }) : null;
      return f = k ? { ...f, cards: f.cards.map((I) => {
        if (I.id !== s.id) return I;
        const { override: M, ...S } = I;
        return { ...S, override: k };
      }) } : ke(r, f, s.id), f = l(f, p, s.id), t.done(f, "Moved " + g(s.label) + " " + u + (k ? " anyway. " + k.sentence : "."), { laneId: p, cardId: s.id });
    }
    case "start_pile": {
      const s = t.card(n.card);
      r.cards.some((u) => u.parentId === s.id) && t.refuse(g(s.label) + " has cards under it already.", { cardId: s.id, laneId: s.laneId });
      const a = n.label === void 0 ? "New pile" : D(n.label, 80, "Name the pile in plain words."), p = { id: V(r), label: a, laneId: o, role: "pile", order: F(r, null, o) }, h = r.cards.map((u) => {
        if (u.id !== s.id) return u;
        const w = { ...u, laneId: o, parentId: p.id, order: C(null, null) };
        return (!w.role || w.role === "pile") && (w.role = "note"), w;
      }), f = l({ ...r, cards: [...h, p] }, o, s.id);
      return t.done(f, "Started a new pile, " + g(a) + ", with " + g(s.label) + " in it.", { laneId: o, cardId: p.id });
    }
    case "merge_cards": {
      const s = t.card(n.card), a = t.card(n.into);
      s.id === a.id && t.refuse("Name two different cards to merge.", { cardId: s.id, laneId: s.laneId }), W(r, s.id).includes(a.id) && t.refuse(g(a.label) + " is under " + g(s.label) + ", so it can’t take it in.", { cardId: s.id, laneId: s.laneId }), (a.laneId === d || s.laneId === d) && t.refuse("Merge cards on the board, not in " + g(i) + ".", { cardId: s.id, laneId: d });
      const p = b(r, s.id);
      let h = b(r, a.id).at(-1)?.order ?? null;
      const f = new Map(p.map((I) => (h = C(h, null), [I.id, h]))), u = [...(r.nest.aliases ?? []).map(([I, M]) => [I, M === s.id ? a.id : M]), [s.id, a.id]].slice(-12), w = r.cards.filter((I) => I.id !== s.id).map((I) => f.has(I.id) ? { ...I, parentId: a.id, order: f.get(I.id) } : I), k = l({ ...r, nest: { ...r.nest, aliases: u }, cards: w }, a.laneId, a.id);
      return t.done(k, "Merged " + g(s.label) + " into " + g(a.label) + (p.length ? ": " + p.length + (p.length === 1 ? " card" : " cards") + " moved." : "."), { laneId: a.laneId, cardId: a.id });
    }
    case "remove_card": {
      const s = t.card(n.card), a = b(r, s.id), p = (w) => {
        let k = !1, I = b(r, s.parentId ?? null, s.laneId).at(-1)?.order ?? null, M = b(r, null, d).at(-1)?.order ?? null;
        const S = new Map(a.map((O) => {
          const Z = (w || !s.parentId) && !r.cards.some((q) => q.parentId === O.id);
          return k || (k = Z), [O.id, Z ? { laneId: d, order: M = C(M, null) } : { laneId: s.laneId, order: I = C(I, null), ...s.parentId && { parentId: s.parentId } }];
        })), we = r.cards.flatMap((O) => O.id === s.id ? [] : S.has(O.id) ? [(({ parentId: Z, ...q }) => ({ ...q, ...S.get(O.id) }))(O)] : [O]);
        return { board: { ...r, cards: we }, tidy: k };
      };
      let h = p(!1);
      if (s.parentId && r.behaviour && "refused" in L(r, h.board)) {
        const w = p(!0);
        "refused" in L(r, w.board) || (h = w);
      }
      const { tidy: f } = h, u = l(h.board, s.laneId);
      return t.done(u, "Removed " + g(s.label) + "." + (a.length ? f ? " What was in it went to " + g(i) + "." : " What was under it moved up." : ""), { laneId: s.laneId, cardId: s.id });
    }
    case "set_role": {
      const s = t.card(n.card);
      let a = "";
      try {
        a = j(n.role);
      } catch (h) {
        t.refuse(h.message, { cardId: s.id, laneId: s.laneId });
      }
      const p = l({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, role: a } : h) }, s.laneId, s.id);
      return t.done(p, g(s.label) + " is " + re(a) + " now.", { laneId: s.laneId, cardId: s.id });
    }
    case "set_source": {
      const s = t.card(n.card);
      let a = "";
      try {
        a = D(n.source, 60, "Say who said it in plain words.");
      } catch (h) {
        t.refuse(h.message, { cardId: s.id });
      }
      const p = l({ ...r, cards: r.cards.map((h) => h.id === s.id ? { ...h, source: a } : h) }, s.laneId, s.id);
      return t.done(p, g(s.label) + " came from " + a + ".", { laneId: s.laneId, cardId: s.id });
    }
    case "add_field": {
      const s = r.nest.fields ?? [];
      let a = "";
      try {
        a = D(n.label, 20, "Name the field in a word or two.");
      } catch (f) {
        t.refuse(f.message);
      }
      const p = a.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "field";
      s.some((f) => f.id === p || f.label.toLowerCase() === a.toLowerCase()) && t.refuse("Cards already carry " + a + "."), s.length >= 4 && t.refuse("Cards carry up to 4 number fields.");
      const h = l({ ...r, nest: { ...r.nest, fields: [...s, { id: p, label: a, ...n.currency && { currency: n.currency }, ...n.flag && { flag: !0 } }] } });
      return t.done(h, "Cards can carry " + a + (n.flag ? " (yes or no)" : "") + " now.");
    }
    case "set_field": {
      const s = t.card(n.card), a = (r.nest.fields ?? []).find((f) => f.id === n.field || f.label.toLowerCase() === String(n.field).toLowerCase());
      a || t.refuse("Cards on this board carry no " + n.field + ". Add it as a field first.", { code: "unknown_reference", cardId: s.id }), n.value !== null && (!Number.isInteger(n.value) || n.value < 0 || n.value > 1e9) && t.refuse("A number field takes a whole number from 0.", { cardId: s.id });
      const p = r.cards.map((f) => {
        if (f.id !== s.id) return f;
        const u = { ...f.fields };
        n.value === null ? delete u[a.id] : u[a.id] = n.value;
        const w = { ...f, fields: u };
        return Object.keys(u).length || delete w.fields, w;
      }), h = l({ ...r, cards: p }, s.laneId, s.id);
      return t.done(h, g(s.label) + (n.value === null ? " has no " + a.label + " now." : "’s " + a.label + " is " + (a.currency ? ae(n.value, a.currency) : n.value) + "."), { laneId: s.laneId, cardId: s.id });
    }
    case "set_layout": {
      n.layout !== "clusters" && n.layout !== "tree" && t.refuse("A nested board is drawn as piles or as a tree.", { code: "invalid_edit" });
      const s = l({ ...r, nest: { ...r.nest, layout: n.layout } });
      return t.done(s, n.layout === "tree" ? "Drawn as a tree." : "Drawn as piles.");
    }
  }
  return null;
}
function ze(e, n) {
  const t = x?.cardText(e, n);
  if (t != null) return t;
  if (e.cards.some((r) => r.parentId === n.id) || n.role === "pile") {
    const r = [X(e, "count", B(e, n.id, "count"))];
    if (e.nest?.layout === "clusters") {
      const o = B(e, n.id, "sources");
      o && r.push(X(e, "sources", o));
      const d = H(e);
      d && d !== "count" && d !== "sources" && r.push(X(e, d, B(e, n.id, d)));
    }
    return n.label + `
` + r.join(" · ");
  }
  return n.source ? n.label + `
— ` + n.source : n.label;
}
function $e(e) {
  if (e === void 0) return;
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("A card’s numbers are a list of fields.");
  const n = {};
  for (const [t, r] of Object.entries(e)) {
    if (!/^[a-z0-9-]{1,20}$/.test(t) || typeof r != "number" || !Number.isInteger(r) || r < 0 || r > 1e9) throw new Error("A card’s number is a whole number from 0.");
    n[t] = r;
  }
  return Object.keys(n).length ? n : void 0;
}
function Re(e, n) {
  const t = JSON.stringify, r = (o) => t(o.cards.map((d) => [d.id, d.laneId, d.parentId, d.order, d.role]));
  return t(e.behaviour?.rules) !== t(n.behaviour?.rules) && r(e) !== r(n) ? "Change the rules on their own, then move cards." : null;
}
const We = {
  kind: "nest",
  cards: [40, "A nested board holds up to 40 cards."],
  rulebook: Se,
  drags: De,
  fixed: Re,
  order: (e, n) => le(e, n).map((t) => t.id),
  readCard(e, n, t) {
    if (e.parentId !== void 0 && (n.parentId = t.id(e.parentId)), e.role !== void 0 && (n.role = j(e.role)), e.order !== void 0) {
      if (!Ne(e.order)) throw new Error("A card’s place is a short key.");
      n.order = e.order;
    }
    e.source !== void 0 && (n.source = D(e.source, 60, "Say who said it in plain words."));
    const r = $e(e.fields);
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
      if (o.fields = r.fields.map((d) => {
        const i = d ?? {};
        if (typeof i.id != "string" || !/^[a-z0-9-]{1,20}$/.test(i.id)) throw new Error("A field’s id is a short slug.");
        const l = { id: i.id, label: D(i.label, 20, "Name the field in a word or two.") };
        if (i.currency !== void 0) {
          if (i.currency !== "$" && i.currency !== "€" && i.currency !== "£") throw new Error("A money field’s sign is $, € or £.");
          l.currency = i.currency;
        }
        if (i.flag !== void 0) {
          if (i.flag !== !0 || i.currency !== void 0) throw new Error("A yes/no field is a flag, never money.");
          l.flag = !0;
        }
        return l;
      }), new Set(o.fields.map((d) => d.id)).size !== o.fields.length) throw new Error("Duplicate field.");
    }
    if (r.aliases !== void 0) {
      if (!Array.isArray(r.aliases) || r.aliases.length > 12) throw new Error("A board keeps up to 12 merged cards’ new homes.");
      o.aliases = r.aliases.map((d) => {
        if (!Array.isArray(d) || d.length !== 2) throw new Error("A merged card’s new home is a pair of ids.");
        return [t.id(d[0]), t.id(d[1])];
      });
    }
    if (x) x.readBoard(r, o, t);
    else if (r.axes !== void 0 || r.owners !== void 0) throw new Error("This board needs its rules loaded.");
    n.nest = o;
  },
  validate: Oe,
  planMove(e, n, t) {
    const r = v(e, n);
    return !r || !e.lanes.some((o) => o.id === t) ? null : r.laneId === t && !r.parentId ? e : J(e, n, { laneId: t, under: null, before: null });
  },
  refusal(e, n, t) {
    const r = v(e, n);
    return r && t === _(e).tray && e.cards.some((o) => o.parentId === n) ? e.lanes[1].label + " holds loose cards. Move what is under " + g(r.label) + " first." : null;
  },
  caption(e, n) {
    const t = x?.caption(e, n);
    if (t) return t;
    const r = e.cards.filter((d) => d.laneId === n).length;
    if (n === _(e).tray) return r ? r + " not placed yet" : "Nothing waiting";
    const o = b(e, null, n).length;
    return e.nest?.layout === "clusters" ? o + (o === 1 ? " pile" : " piles") + " · " + (r - o) + (r - o === 1 ? " note" : " notes") : r + (r === 1 ? " card" : " cards");
  },
  cardText: ze,
  noteText: (e, n) => n.label,
  fromNote: (e, n, t) => ({ label: (n.replace(/\s+/g, " ").trim() || t).slice(0, 80) }),
  newCard: ye,
  renamed: (e, n, t) => ({ label: t.replace(/\s+/g, " ").trim(), edits: [] }),
  edit: Le
};
ge(We);
export {
  se as byOrder,
  L as checkNest,
  Pe as checkNestMove,
  je as extend,
  Ne as isOrderKey,
  he as nestAlias,
  _ as nestAreas,
  ze as nestCardText,
  P as nestDepth,
  De as nestDrags,
  Be as nestEmptyDrop,
  Se as nestFamily,
  b as nestKids,
  pe as nestLegal,
  B as nestMeasure,
  X as nestMeasureWords,
  J as nestPlace,
  le as nestRoots,
  We as nestRules,
  te as nestSentence,
  W as nestSubtree,
  C as orderBetween,
  de as orderKeys,
  Fe as registerNestPlus,
  j as roleOf,
  ce as tidyKeys,
  Oe as validateNest
};
