import { applyWorkshopEdits as R, said as p } from "./workshop-model.mjs";
import { registerNestPlus as K, extend as U, nestAreas as x, nestPlace as Q, orderKeys as Z, nestSubtree as b, roleOf as L } from "./workshop-nest.mjs";
const E = (e) => e.charAt(0).toUpperCase() + e.slice(1), T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", _ = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, g = (e, n) => n === void 0 ? void 0 : e.cards.find((a) => a.id === n), P = (e, n, a) => {
  const s = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!s || s.length > n || /[<>\u0000-\u001f]/.test(s)) throw new Error(a);
  return s;
}, D = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "item", O = [
  { id: "do-now", label: "Do now", high: [!1, !0] },
  { id: "plan", label: "Plan it", high: [!0, !0] },
  { id: "later", label: "Later", high: [!1, !1] },
  { id: "skip", label: "Skip", high: [!0, !1] }
], j = (e) => O.find((n) => n.id === e), J = (e) => e >= 5;
function k(e) {
  const [n, a] = e.nest?.axes ?? [], s = (t) => e.nest?.fields?.find((o) => o.id === t);
  return e.nest?.layout === "matrix" && n && a ? { x: s(n), y: s(a) } : null;
}
function I(e, n) {
  const a = k(e);
  if (!a || n.laneId !== x(e).main) return null;
  const s = n.fields?.[a.x.id], t = n.fields?.[a.y.id];
  return s === void 0 || t === void 0 ? null : { x: s, y: t };
}
function S(e, n) {
  const a = I(e, n);
  return a ? O.find((s) => s.high[0] === J(a.x) && s.high[1] === J(a.y)).id : null;
}
function H(e, n, a) {
  const s = j(a), t = I(e, n) ?? { x: s.high[0] ? 7 : 2, y: s.high[1] ? 7 : 2 }, o = (i, r) => r ? Math.max(5, i) : Math.min(4, i);
  return { x: o(t.x, s.high[0]), y: o(t.y, s.high[1]) };
}
const A = (e, n) => e.nest?.fields?.find((a) => a.flag && a.id === n), N = (e, n, a) => A(e, a) ? n.fields?.[a] === 1 : n.role === a, V = (e, n) => T((A(e, n)?.label ?? n).toLowerCase()), v = (e, n) => e.nest?.owners?.find((a) => a.id === n);
function W(e, n) {
  switch (e.kind) {
    case "quadrant":
      return (j(e.quadrant)?.label ?? e.quadrant) + " holds " + e.max;
    case "parent":
      return E(V(n, e.not)) + " don’t manage";
    case "contains": {
      const a = A(n, e.of)?.label.toLowerCase() ?? e.of;
      return "Every " + e.role + " has " + (e.atLeast === 1 ? _(a) : "at least " + e.atLeast + " " + T(a)) + " under them";
    }
    case "sameOwnerAs":
      return (e.role ? E(T(e.role)) + " are" : "A card is") + " owned by the team that owns what " + (e.role ? "they sit" : "it sits") + " under" + (e.mode === "carry" ? "; moving one to a team brings what is under it along" : e.mode === "ask" ? "; moving one to a team asks about what is under it" : "");
  }
  return null;
}
const X = { quadrant: "quadrant max", parent: "not", contains: "role of atLeast", sameOwnerAs: "mode role" };
function Y(e, n, a) {
  const s = (t, o, i) => {
    if (typeof t != "number" || !Number.isInteger(t) || t < 1 || t > o) throw new Error(i);
    return t;
  };
  switch (e.kind) {
    case "quadrant": {
      const t = j(String(e.quadrant));
      if (!t) throw new Error("A 2 by 2’s squares are Do now, Plan it, Later and Skip.");
      return { ...n, kind: "quadrant", quadrant: t.id, max: s(e.max, 40, "A square holds from 1 to 40 cards.") };
    }
    case "parent":
      return { ...n, kind: "parent", not: L(e.not) };
    case "contains":
      return { ...n, kind: "contains", role: L(e.role), of: L(e.of), atLeast: s(e.atLeast, 12, "Say at least 1 to 12.") };
    case "sameOwnerAs": {
      if (e.mode !== "warn" && e.mode !== "ask" && e.mode !== "carry") throw new Error("When a card changes team, what is under it stays (warn), is asked about (ask) or comes along (carry).");
      const t = { ...n, kind: "sameOwnerAs", mode: e.mode };
      return e.role !== void 0 && (t.role = L(e.role)), t;
    }
  }
  return null;
}
function ee(e, n) {
  const a = new Map(e.cards.map((s) => [s.id, s]));
  return n.cards.filter((s) => {
    const t = a.get(s.id);
    return !t || t.parentId !== s.parentId || t.laneId !== s.laneId || t.role !== s.role || t.owner !== s.owner || JSON.stringify(t.fields ?? {}) !== JSON.stringify(s.fields ?? {});
  });
}
const C = ["parent", "quadrant", "sameOwnerAs", "contains"];
function ne(e, n, a) {
  const s = (e.behaviour?.rules ?? []).filter((r) => r.on && C.includes(r.kind)).sort((r, c) => C.indexOf(r.kind) - C.indexOf(c.kind));
  if (!s.length) return null;
  const { tray: t } = x(n), o = ee(e, n).filter((r) => r.laneId !== t), i = (r, c) => r.cards.filter((h) => h.parentId === c).map((h) => h.id);
  for (const r of s) {
    let c = null;
    const h = W(r, e) + ".";
    if (r.kind === "quadrant") {
      const m = o.find((f) => {
        const l = g(e, f.id);
        return S(n, f) === r.quadrant && (!l || S(e, l) !== r.quadrant);
      });
      if (m) {
        const f = e.cards.filter((u) => S(e, u) === r.quadrant), l = n.cards.filter((u) => S(n, u) === r.quadrant).length;
        if (l > r.max && l > f.length) {
          const u = k(e), d = [...f].sort((y, M) => I(e, y).y - I(e, M).y)[0];
          c = { sentence: h + (d ? " " + d.label + " has the lowest " + u.y.label.toLowerCase() + " there." : ""), card: m };
        }
      }
    } else if (r.kind === "parent")
      for (const m of n.cards) {
        if (!N(n, m, r.not)) continue;
        const f = i(n, m.id), l = g(e, m.id), u = l && N(e, l, r.not) ? i(e, m.id) : [], d = f.find((y) => !u.includes(y));
        if (d) {
          c = { sentence: h + " " + m.label + " is " + (A(n, r.not) ? _(A(n, r.not).label.toLowerCase()) : _(r.not)) + ".", card: g(n, d) };
          break;
        }
      }
    else if (r.kind === "contains") {
      const m = (f, l) => b(f, l).slice(1).filter((u) => N(f, g(f, u), r.of)).length;
      for (const f of [...n.cards].sort((l, u) => b(n, l.id).length - b(n, u.id).length)) {
        if (f.role !== r.role || f.laneId === t) continue;
        const l = m(n, f.id);
        if (l >= r.atLeast) continue;
        const u = g(e, f.id), d = u && u.role === r.role ? m(e, f.id) : -1, y = b(n, f.id);
        if (d === -1 || d >= r.atLeast || y.some(($) => o.some((F) => F.id === $))) {
          c = { sentence: h + " " + f.label + " would have " + (l || "none") + ".", card: f };
          break;
        }
      }
    } else if (r.kind === "sameOwnerAs") {
      const m = (l) => !r.role || l.role === r.role, f = new Set(o.map((l) => l.id));
      for (const l of n.cards) {
        if (!m(l) || !l.owner || l.laneId === t) continue;
        const u = g(n, l.parentId);
        if (!u?.owner || u.owner === l.owner) continue;
        const d = g(e, u.id);
        if (!(!f.has(l.id) && d?.owner === u.owner)) {
          c = { sentence: l.label + " is " + v(n, l.owner).label + "’s; what it sits under is " + v(n, u.owner).label + "’s.", card: l };
          break;
        }
      }
      if (r.mode === "ask") for (const l of o) {
        const u = g(e, l.id);
        if (!u?.owner || !l.owner || u.owner === l.owner) continue;
        const d = b(n, l.id).slice(1).filter((y) => g(n, y).owner === u.owner);
        d.length && a.push(d.length + (d.length === 1 ? " card" : " cards") + " under " + l.label + " stayed with " + v(n, u.owner).label + ". Say “Move what is under " + l.label + " to " + v(n, l.owner).label + " too” to bring " + (d.length === 1 ? "it" : "them") + ".");
      }
    }
    if (c) {
      if (r.severity === "warn") {
        a.push(c.sentence);
        continue;
      }
      return { refused: { sentence: c.sentence, ruleId: r.id, set: r.set, cardId: c.card.id, laneId: c.card.laneId } };
    }
  }
  return { ok: !0, warnings: a };
}
function te(e, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.rules) {
    if (!C.includes(s.kind)) continue;
    const t = s.kind + ":" + (s.kind === "quadrant" ? s.quadrant : s.kind === "parent" ? s.not : s.kind === "contains" ? s.role + ">" + s.of : "");
    if (a.has(t)) return "There is already a rule like that on this board. Change that one instead.";
    if (a.add(t), s.kind === "contains" && s.on && s.severity === "refuse" && e.rules.some((o) => o.on && o.severity === "refuse" && o.kind === "parent" && o.not === s.role))
      return E(T(s.role)) + " would need someone under them, and " + V(n, s.role) + " don’t manage.";
  }
  return null;
}
function ae(e, n, a) {
  if (e.axes !== void 0) {
    if (!Array.isArray(e.axes) || e.axes.length !== 2 || e.axes[0] === e.axes[1]) throw new Error("A 2 by 2 reads two fields, one across and one up.");
    n.axes = [a.id(e.axes[0]), a.id(e.axes[1])];
  }
  if (e.owners !== void 0) {
    if (!Array.isArray(e.owners) || e.owners.length > 8) throw new Error("A board has up to 8 teams that own cards.");
    if (n.owners = e.owners.map((s) => {
      const t = s ?? {};
      return { id: a.id(t.id), label: P(t.label, 30, "Name a team in a few words.") };
    }), new Set(n.owners.map((s) => s.id)).size !== n.owners.length) throw new Error("Duplicate team.");
  }
}
function se(e, n, a) {
  e.owner !== void 0 && (n.owner = a.id(e.owner));
}
function re(e) {
  const n = e.nest, { main: a } = x(e), s = e.behaviour?.rules ?? [];
  if (n.layout !== "matrix" && s.some((o) => o.kind === "quadrant")) return "Only a 2 by 2 has squares to fill.";
  if (!n.owners?.length && s.some((o) => o.kind === "sameOwnerAs")) return "This board has no teams that own cards. Say “Add Growth as an owner” first.";
  for (const o of n.fields ?? []) if (o.flag) {
    const i = e.cards.find((r) => r.fields?.[o.id] !== void 0 && r.fields[o.id] > 1);
    if (i) return p(i.label) + "’s " + o.label + " is yes (1) or no (0).";
  }
  for (const o of e.cards) if (o.owner !== void 0 && !v(e, o.owner)) return p(o.label) + " is owned by a team that is no longer on the board.";
  if (n.layout !== "matrix") return n.axes ? "Only a 2 by 2 has axes." : null;
  const t = k(e);
  if (!t?.x || !t.y || t.x.flag || t.y.flag) return "A 2 by 2 reads two number fields, one across and one up.";
  for (const o of e.cards) {
    if (o.parentId) return "A 2 by 2 places cards side by side: nothing sits under another.";
    if (o.laneId !== a) continue;
    const i = I(e, o);
    if (!i) return p(o.label) + " needs a score on both axes. Say “Score " + o.label + " " + t.y.label.toLowerCase() + " 8, " + t.x.label.toLowerCase() + " 3”.";
    if (i.x > 10 || i.y > 10) return "Scores run from 0 to 10.";
  }
  return null;
}
function oe(e, n, a, s) {
  const t = k(e), o = g(e, n);
  if (!t || !o || e.cards.some((c) => c.parentId === n)) return null;
  const { main: i } = x(e), r = o.laneId === i ? e : Q(e, n, { laneId: i, under: null, before: null });
  return r ? { ...r, cards: r.cards.map((c) => c.id === n ? { ...c, fields: { ...c.fields, [t.x.id]: a, [t.y.id]: s } } : c) } : null;
}
const ie = (e, n) => (e.nest?.fields ?? []).find((a) => a.id === n || a.label.toLowerCase() === String(n).toLowerCase()), le = (e, n, a, s) => {
  switch (n.kind) {
    case "score_card": {
      const t = a.card(n.card), o = k(e);
      o || a.refuse("Only a 2 by 2 scores cards.", { code: "invalid_edit" });
      for (const h of [n.x, n.y]) (!Number.isInteger(h) || h < 0 || h > 10) && a.refuse("Scores run from 0 to 10.", { cardId: t.id });
      const i = oe(e, t.id, n.x, n.y);
      i || a.refuse(p(t.label) + " has cards under it, so it can’t be scored.", { cardId: t.id });
      const r = s(i, x(e).main, t.id), c = O.find((h) => h.id === S(r, r.cards.find((m) => m.id === t.id)));
      return a.done(r, "Scored " + p(t.label) + ": " + o.y.label + " " + n.y + ", " + o.x.label + " " + n.x + " (" + c.label + ").", { laneId: x(e).main, cardId: t.id });
    }
    case "rename_field": {
      const t = ie(e, n.field);
      t || a.refuse("Cards on this board carry no " + n.field + ".", { code: "unknown_reference" });
      let o = "";
      try {
        o = P(n.label, 20, "Name the field in a word or two.");
      } catch (r) {
        a.refuse(r.message);
      }
      e.nest.fields.some((r) => r !== t && r.label.toLowerCase() === o.toLowerCase()) && a.refuse("Cards already carry " + o + ".");
      const i = s({ ...e, nest: { ...e.nest, fields: e.nest.fields.map((r) => r === t ? { ...r, label: o } : r) } });
      return a.done(i, "Renamed " + p(t.label) + " to " + p(o) + ".");
    }
    case "add_owner": {
      let t = "";
      try {
        t = P(n.label, 30, "Name the team in a few words.");
      } catch (c) {
        a.refuse(c.message);
      }
      const o = e.nest.owners ?? [];
      o.some((c) => c.label.toLowerCase() === t.toLowerCase()) && a.refuse(t + " owns cards here already."), o.length >= 8 && a.refuse("A board has up to 8 teams that own cards.");
      let i = D(t);
      for (let c = 2; o.some((h) => h.id === i); c++) i = D(t).slice(0, 17) + "-" + c;
      const r = s({ ...e, nest: { ...e.nest, owners: [...o, { id: i, label: t }] } });
      return a.done(r, t + " can own cards now.");
    }
    case "set_owner": {
      const t = a.card(n.card), o = e.nest?.owners ?? [], i = o.find((d) => d.id === n.owner || d.label.toLowerCase() === String(n.owner).toLowerCase());
      i || a.refuse(o.length ? "The teams on this board are " + o.map((d) => d.label).join(", ") + "." : "This board has no teams that own cards. Say “Add Growth as an owner” first.", { cardId: t.id, code: "unknown_reference" });
      const r = (e.behaviour?.rules ?? []).find((d) => d.on && d.kind === "sameOwnerAs"), c = b(e, t.id).slice(1), h = r?.mode === "carry" && t.owner !== i.id ? c.filter((d) => g(e, d).owner === t.owner) : [];
      let m = h;
      if (n.carry !== void 0) {
        const d = n.carry.map((y) => a.card(y).id);
        d.some((y) => !c.includes(y)) && a.refuse("Only cards under " + p(t.label) + " come along with it.", { cardId: t.id }), (h.length || r?.mode === "carry" && t.owner !== i.id) && [...d].sort().join() !== [...h].sort().join() && a.refuse("The board changed while you were dragging. Try again.", { cardId: t.id }), m = d;
      }
      const f = /* @__PURE__ */ new Set([t.id, ...m]), l = s({ ...e, cards: e.cards.map((d) => f.has(d.id) ? { ...d, owner: i.id } : d) }, t.laneId, t.id), u = m.length ? " " + m.length + (m.length === 1 ? " card" : " cards") + " under it came along." : "";
      return a.done(l, t.owner === i.id && m.length ? "Moved what is under " + p(t.label) + " to " + i.label + "." : p(t.label) + " is " + i.label + "’s now." + u, { laneId: t.laneId, cardId: t.id });
    }
  }
  return null;
}, de = (e) => e.nest?.layout === "tree" && e.cards.some((n) => n.role === "manager" || n.role === "open role");
function ce(e, n) {
  const a = I(e, n);
  if (a) {
    const s = k(e);
    return n.label + `
` + s.y.label + " " + a.y + " · " + s.x.label + " " + a.x;
  }
  if (e.nest?.layout === "matrix") return n.label;
  if (e.nest?.owners?.length) {
    const s = v(e, n.owner), t = g(e, n.parentId), o = s && t?.owner && t.owner !== n.owner;
    return n.label + (s ? `
` + s.label + (o ? " · cross-team" : "") : "");
  }
  if (de(e)) {
    const s = e.cards.filter((r) => r.parentId === n.id).length, t = (e.behaviour?.rules ?? []).find((r) => r.on && r.kind === "children" && (!r.role || r.role === n.role)), o = (e.nest?.fields ?? []).filter((r) => r.flag && n.fields?.[r.id] === 1).map((r) => r.label.toLowerCase()), i = [n.role ?? "", ...o, s ? s + (s === 1 ? " report" : " reports") + (t && s > t.max ? ", limit " + t.max : "") : ""].filter(Boolean);
    return n.label + (i.length ? `
` + i.join(" · ") : "");
  }
  return null;
}
function ue(e) {
  const n = k(e);
  return e.nest?.owners?.length ? JSON.stringify(e.cards.map((a) => e.nest.owners.map((s) => {
    const t = R(e, [{ kind: "set_owner", card: { id: a.id }, owner: s.id }]);
    return "refused" in t ? 0 : t.workshop.cards.filter((o) => o.owner === s.id).length;
  }))) : n ? JSON.stringify([e.nest.axes, n.x.label, n.y.label, e.cards.map((a) => O.map((s) => {
    const { x: t, y: o } = H(e, a, s.id);
    return "refused" in R(e, [{ kind: "score_card", card: { id: a.id }, x: t, y: o }]) ? 0 : 1;
  }).join(""))]) : null;
}
function fe(e, n) {
  if (e.nest?.layout !== "matrix") return null;
  const a = e.cards.filter((s) => s.laneId === n).length;
  return n === x(e).tray ? a ? a + " not scored yet" : "Everything is scored" : a + (a === 1 ? " card scored" : " cards scored");
}
K({ keys: X, read: Y, sentence: W, check: ne, contradiction: te, readBoard: ae, readCard: se, validate: re, edit: le, cardText: ce, drags: ue, caption: fe });
const q = ["nest"], B = (e) => ({ type: "ref", of: "card", about: e }), z = (e) => ({ type: "integer", min: 0, max: 10, about: e });
U({
  kinds: [
    {
      kind: "score_card",
      summary: "Impact × effort: place a card by its two scores, 0 to 10 (x across, y up). A card in the tray comes onto the 2 by 2.",
      intent: !0,
      fields: { card: B("The card."), x: z("The score across (effort)."), y: z("The score up (impact).") },
      boards: q,
      refusals: {}
    },
    {
      kind: "rename_field",
      summary: "Nest board: rename a field (an axis of a 2 by 2: Reach, Confidence…).",
      intent: !1,
      fields: { field: { type: "text", max: 20, about: "The field, by id or name." }, label: { type: "text", max: 20, about: "Its new name." } },
      boards: q,
      refusals: {}
    },
    {
      kind: "add_owner",
      summary: "Goals & owners: add a team that can own cards. Up to 8.",
      intent: !1,
      fields: { label: { type: "text", max: 30, about: "The team’s name." } },
      boards: q,
      refusals: {}
    },
    {
      kind: "set_owner",
      summary: "Goals & owners: give a card to a team. carry: the cards under it that come along (left out, the ownership rule decides; a different carry than it works out is refused).",
      intent: !0,
      fields: {
        card: B("The card."),
        owner: { type: "text", max: 30, about: "The team, by id or name." },
        carry: { type: "refs", of: "card", min: 0, max: 40, optional: !0, about: "The cards under it that come along." }
      },
      boards: q,
      refusals: {}
    }
  ],
  boards: {},
  fields: { set_rule: { mode: { type: "choice", values: ["warn", "ask", "carry"], optional: !0, about: "Goals & owners: what a change of team does to the cards under a card." } } },
  rules: {
    kinds: ["quadrant", "parent", "contains", "sameOwnerAs"],
    keys: {
      quadrant: { enum: O.map((e) => e.id) },
      not: { type: "string", maxLength: 24 },
      of: { type: "string", maxLength: 24 },
      atLeast: { type: "integer", minimum: 1, maximum: 12 },
      mode: { enum: ["warn", "ask", "carry"] }
    }
  }
});
function w(e, n, a) {
  const s = Z(n.length);
  return n.map(([t, o, i], r) => ({ id: t, label: o, laneId: e, order: s[r], ...a && { parentId: a }, ...i }));
}
const G = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((n, a) => ({ id: "rule-" + (a + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...n }))
});
function we() {
  const e = (n, a) => ({ fields: { effort: n, impact: a } });
  return {
    version: 1,
    kind: "nest",
    title: "Impact × effort",
    nest: { layout: "matrix", fields: [{ id: "effort", label: "Effort" }, { id: "impact", label: "Impact" }], axes: ["effort", "impact"] },
    lanes: [{ id: "matrix", label: "Impact × effort" }, { id: "unscored", label: "Not scored yet" }],
    cards: [
      ...w("matrix", [
        ["search", "Faster search", e(3, 8)],
        ["sso", "SSO", e(4, 9)],
        ["exports", "Exports", e(2, 6)],
        ["mobile", "Mobile app", e(9, 7)],
        ["summaries", "AI summaries", e(7, 6)],
        ["dark-mode", "Dark mode", e(2, 3)],
        ["billing", "Rewrite billing", e(9, 2)]
      ]),
      ...w("unscored", [["alerts", "Slack alerts"], ["audit", "Audit log"]])
    ],
    behaviour: G([{ kind: "quadrant", quadrant: "do-now", max: 3 }])
  };
}
function ge() {
  const e = (n, a = !1) => ({ role: n, ...a && { fields: { contractor: 1 } } });
  return {
    version: 1,
    kind: "nest",
    title: "Reorg & hiring sandbox",
    nest: { layout: "tree", fields: [{ id: "contractor", label: "Contractor", flag: !0 }] },
    lanes: [{ id: "org", label: "Org chart" }, { id: "unplaced", label: "Not placed yet" }],
    cards: [
      ...w("org", [["dana", "Dana Ito, CEO", e("manager")]]),
      ...w("org", [["maya", "Maya Chen, VP Product", e("manager")], ["priya", "Priya Rao, VP Eng", e("manager")], ["vp-sales", "VP Sales", e("open role")]], "dana"),
      ...w("org", [["jo", "Jo Park, Growth", e("manager")]], "maya"),
      ...w("org", [["ravi", "Ravi Shah", e("engineer")], ["lena", "Lena Ortiz", e("designer")], ["sam", "Sam Lee", e("engineer", !0)]], "jo"),
      ...w("org", [["kai", "Kai Wong, Platform", e("manager")]], "priya"),
      ...w("org", [["tom", "Tom Berg", e("engineer")], ["ivy", "Ivy Moss", e("engineer")]], "kai"),
      ...w("unplaced", [["ae-1", "Account exec 1", e("open role")], ["ae-2", "Account exec 2", e("open role")]])
    ],
    behaviour: G([
      { kind: "children", role: "manager", max: 6 },
      { kind: "parent", not: "open role" },
      { kind: "parent", not: "contractor" },
      { kind: "contains", role: "manager", of: "designer", atLeast: 1, severity: "warn" },
      { kind: "depth", max: 5 }
    ])
  };
}
function ye() {
  const e = (n, a) => ({ role: n, owner: a });
  return {
    version: 1,
    kind: "nest",
    title: "Goals & owners",
    nest: { layout: "tree", owners: [{ id: "growth", label: "Growth" }, { id: "platform", label: "Platform" }, { id: "sales", label: "Sales" }] },
    lanes: [{ id: "goals", label: "Goals" }, { id: "unplaced", label: "Not placed yet" }],
    cards: [
      ...w("goals", [["activation", "Activation to 40%", e("objective", "growth")], ["uptime", "99.9% uptime", e("objective", "platform")]]),
      ...w("goals", [["fast-onboarding", "Onboarding under 10 min", e("key result", "growth")], ["self-serve", "Self-serve upgrades 30%", e("key result", "growth")]], "activation"),
      ...w("goals", [["guided", "Guided setup", e("initiative", "growth")], ["starters", "Starter templates", e("initiative", "growth")]], "fast-onboarding"),
      ...w("goals", [["pricing-page", "New pricing page", e("initiative", "growth")]], "self-serve"),
      ...w("goals", [["latency", "p95 under 300 ms", e("key result", "platform")]], "uptime"),
      ...w("goals", [["cache", "Cache the hot paths", e("initiative", "platform")]], "latency"),
      ...w("unplaced", [["partners", "Partner channel live", e("key result", "sales")]])
    ],
    behaviour: G([
      { kind: "nests", role: "key result", under: ["objective"] },
      { kind: "nests", role: "initiative", under: ["key result"] },
      { kind: "sameOwnerAs", mode: "warn", severity: "warn" },
      { kind: "depth", max: 3 }
    ])
  };
}
export {
  ye as goalsSample,
  we as impactEffortSample,
  de as isOrgChart,
  k as nestAxes,
  O as nestQuadrants,
  I as nestScores,
  S as quadrantOf,
  ge as reorgSample,
  oe as scoreBoard,
  H as scoresIn
};
