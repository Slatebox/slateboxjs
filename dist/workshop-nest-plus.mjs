import { applyWorkshopEdits as M, said as p } from "./workshop-model.mjs";
import { registerNestPlus as $, extend as F, nestAreas as x, nestPlace as K, orderKeys as U, nestSubtree as b, roleOf as L } from "./workshop-nest.mjs";
const E = (e) => e.charAt(0).toUpperCase() + e.slice(1), T = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", _ = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, g = (e, n) => n === void 0 ? void 0 : e.cards.find((a) => a.id === n), P = (e, n, a) => {
  const s = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!s || s.length > n || /[<>\u0000-\u001f]/.test(s)) throw new Error(a);
  return s;
}, R = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "item", O = [
  { id: "do-now", label: "Do now", high: [!1, !0] },
  { id: "plan", label: "Plan it", high: [!0, !0] },
  { id: "later", label: "Later", high: [!1, !1] },
  { id: "skip", label: "Skip", high: [!0, !1] }
], j = (e) => O.find((n) => n.id === e), D = (e) => e >= 5;
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
  return a ? O.find((s) => s.high[0] === D(a.x) && s.high[1] === D(a.y)).id : null;
}
function Q(e, n, a) {
  const s = j(a), t = I(e, n) ?? { x: s.high[0] ? 7 : 2, y: s.high[1] ? 7 : 2 }, o = (l, r) => r ? Math.max(5, l) : Math.min(4, l);
  return { x: o(t.x, s.high[0]), y: o(t.y, s.high[1]) };
}
const A = (e, n) => e.nest?.fields?.find((a) => a.flag && a.id === n), N = (e, n, a) => A(e, a) ? n.fields?.[a] === 1 : n.role === a, z = (e, n) => T((A(e, n)?.label ?? n).toLowerCase()), v = (e, n) => e.nest?.owners?.find((a) => a.id === n);
function V(e, n) {
  switch (e.kind) {
    case "quadrant":
      return (j(e.quadrant)?.label ?? e.quadrant) + " holds " + e.max;
    case "parent":
      return E(z(n, e.not)) + " don’t manage";
    case "contains": {
      const a = A(n, e.of)?.label.toLowerCase() ?? e.of;
      return "Every " + e.role + " has " + (e.atLeast === 1 ? _(a) : "at least " + e.atLeast + " " + T(a)) + " under them";
    }
    case "sameOwnerAs":
      return (e.role ? E(T(e.role)) + " are" : "A card is") + " owned by the team that owns what " + (e.role ? "they sit" : "it sits") + " under" + (e.mode === "carry" ? "; moving one to a team brings what is under it along" : e.mode === "ask" ? "; moving one to a team asks about what is under it" : "");
  }
  return null;
}
const Z = { quadrant: "quadrant max", parent: "not", contains: "role of atLeast", sameOwnerAs: "mode role" };
function H(e, n, a) {
  const s = (t, o, l) => {
    if (typeof t != "number" || !Number.isInteger(t) || t < 1 || t > o) throw new Error(l);
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
function X(e, n) {
  const a = new Map(e.cards.map((s) => [s.id, s]));
  return n.cards.filter((s) => {
    const t = a.get(s.id);
    return !t || t.parentId !== s.parentId || t.laneId !== s.laneId || t.role !== s.role || t.owner !== s.owner || JSON.stringify(t.fields ?? {}) !== JSON.stringify(s.fields ?? {});
  });
}
const C = ["parent", "quadrant", "sameOwnerAs", "contains"];
function Y(e, n, a) {
  const s = (e.behaviour?.rules ?? []).filter((r) => r.on && C.includes(r.kind)).sort((r, u) => C.indexOf(r.kind) - C.indexOf(u.kind));
  if (!s.length) return null;
  const { tray: t } = x(n), o = X(e, n).filter((r) => r.laneId !== t), l = (r, u) => r.cards.filter((h) => h.parentId === u).map((h) => h.id);
  for (const r of s) {
    let u = null;
    const h = V(r, e) + ".";
    if (r.kind === "quadrant") {
      const m = o.find((f) => {
        const i = g(e, f.id);
        return S(n, f) === r.quadrant && (!i || S(e, i) !== r.quadrant);
      });
      if (m) {
        const f = e.cards.filter((d) => S(e, d) === r.quadrant), i = n.cards.filter((d) => S(n, d) === r.quadrant).length;
        if (i > r.max && i > f.length) {
          const d = k(e), c = [...f].sort((y, W) => I(e, y).y - I(e, W).y)[0];
          u = { sentence: h + (c ? " " + c.label + " has the lowest " + d.y.label.toLowerCase() + " there." : ""), card: m };
        }
      }
    } else if (r.kind === "parent")
      for (const m of n.cards) {
        if (!N(n, m, r.not)) continue;
        const f = l(n, m.id), i = g(e, m.id), d = i && N(e, i, r.not) ? l(e, m.id) : [], c = f.find((y) => !d.includes(y));
        if (c) {
          u = { sentence: h + " " + m.label + " is " + (A(n, r.not) ? _(A(n, r.not).label.toLowerCase()) : _(r.not)) + ".", card: g(n, c) };
          break;
        }
      }
    else if (r.kind === "contains") {
      const m = (f, i) => b(f, i).slice(1).filter((d) => N(f, g(f, d), r.of)).length;
      for (const f of [...n.cards].sort((i, d) => b(n, i.id).length - b(n, d.id).length)) {
        if (f.role !== r.role || f.laneId === t || !b(n, f.id).slice(1).length) continue;
        const d = m(n, f.id);
        if (d >= r.atLeast) continue;
        const c = g(e, f.id), y = c && c.role === r.role ? m(e, f.id) : -1;
        if (y === -1 || y >= r.atLeast) {
          u = { sentence: h + " " + f.label + " would have " + (d || "none") + ".", card: f };
          break;
        }
      }
    } else if (r.kind === "sameOwnerAs") {
      const m = (i) => !r.role || i.role === r.role, f = new Set(o.filter((i) => {
        const d = g(e, i.id);
        return !d || d.parentId !== i.parentId || d.laneId !== i.laneId || d.owner !== i.owner;
      }).map((i) => i.id));
      for (const i of n.cards) {
        if (!m(i) || !i.owner || i.laneId === t) continue;
        const d = g(n, i.parentId);
        if (!d?.owner || d.owner === i.owner) continue;
        const c = g(e, d.id);
        if (!(!f.has(i.id) && c?.owner === d.owner)) {
          u = { sentence: i.label + " is " + v(n, i.owner).label + "’s; what it sits under is " + v(n, d.owner).label + "’s.", card: i };
          break;
        }
      }
      if (r.mode === "ask") for (const i of o) {
        const d = g(e, i.id);
        if (!d?.owner || !i.owner || d.owner === i.owner) continue;
        const c = b(n, i.id).slice(1).filter((y) => g(n, y).owner === d.owner);
        c.length && a.push(c.length + (c.length === 1 ? " card" : " cards") + " under " + i.label + " stayed with " + v(n, d.owner).label + ". Say “Move what is under " + i.label + " to " + v(n, i.owner).label + " too” to bring " + (c.length === 1 ? "it" : "them") + ".");
      }
    }
    if (u) {
      if (r.severity === "warn") {
        a.push(u.sentence);
        continue;
      }
      return { refused: { sentence: u.sentence, ruleId: r.id, set: r.set, cardId: u.card.id, laneId: u.card.laneId } };
    }
  }
  return { ok: !0, warnings: a };
}
function ee(e, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.rules) {
    if (!C.includes(s.kind)) continue;
    const t = s.kind + ":" + (s.kind === "quadrant" ? s.quadrant : s.kind === "parent" ? s.not : s.kind === "contains" ? s.role + ">" + s.of : "");
    if (a.has(t)) return "There is already a rule like that on this board. Change that one instead.";
    if (a.add(t), s.kind === "contains" && s.on && s.severity === "refuse" && e.rules.some((o) => o.on && o.severity === "refuse" && o.kind === "parent" && o.not === s.role))
      return E(T(s.role)) + " would need someone under them, and " + z(n, s.role) + " don’t manage.";
  }
  return null;
}
function ne(e, n, a) {
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
function te(e, n, a) {
  e.owner !== void 0 && (n.owner = a.id(e.owner));
}
function ae(e) {
  const n = e.nest, { main: a } = x(e), s = e.behaviour?.rules ?? [];
  if (n.layout !== "matrix" && s.some((o) => o.kind === "quadrant")) return "Only a 2 by 2 has squares to fill.";
  if (!n.owners?.length && s.some((o) => o.kind === "sameOwnerAs")) return "This board has no teams that own cards. Say “Add Growth as an owner” first.";
  for (const o of n.fields ?? []) if (o.flag) {
    const l = e.cards.find((r) => r.fields?.[o.id] !== void 0 && r.fields[o.id] > 1);
    if (l) return p(l.label) + "’s " + o.label + " is yes (1) or no (0).";
  }
  for (const o of e.cards) if (o.owner !== void 0 && !v(e, o.owner)) return p(o.label) + " is owned by a team that is no longer on the board.";
  if (n.layout !== "matrix") return n.axes ? "Only a 2 by 2 has axes." : null;
  const t = k(e);
  if (!t?.x || !t.y || t.x.flag || t.y.flag) return "A 2 by 2 reads two number fields, one across and one up.";
  for (const o of e.cards) {
    if (o.parentId) return "A 2 by 2 places cards side by side: nothing sits under another.";
    if (o.laneId !== a) continue;
    const l = I(e, o);
    if (!l) return p(o.label) + " needs a score on both axes. Say “Score " + o.label + " " + t.y.label.toLowerCase() + " 8, " + t.x.label.toLowerCase() + " 3”.";
    if (l.x > 10 || l.y > 10) return "Scores run from 0 to 10.";
  }
  return null;
}
function se(e, n, a, s) {
  const t = k(e), o = g(e, n);
  if (!t || !o || e.cards.some((u) => u.parentId === n)) return null;
  const { main: l } = x(e), r = o.laneId === l ? e : K(e, n, { laneId: l, under: null, before: null });
  return r ? { ...r, cards: r.cards.map((u) => u.id === n ? { ...u, fields: { ...u.fields, [t.x.id]: a, [t.y.id]: s } } : u) } : null;
}
const re = (e, n) => (e.nest?.fields ?? []).find((a) => a.id === n || a.label.toLowerCase() === String(n).toLowerCase()), oe = (e, n, a, s) => {
  switch (n.kind) {
    case "score_card": {
      const t = a.card(n.card), o = k(e);
      o || a.refuse("Only a 2 by 2 scores cards.", { code: "invalid_edit" });
      for (const h of [n.x, n.y]) (!Number.isInteger(h) || h < 0 || h > 10) && a.refuse("Scores run from 0 to 10.", { cardId: t.id });
      const l = se(e, t.id, n.x, n.y);
      l || a.refuse(p(t.label) + " has cards under it, so it can’t be scored.", { cardId: t.id });
      const r = s(l, x(e).main, t.id), u = O.find((h) => h.id === S(r, r.cards.find((m) => m.id === t.id)));
      return a.done(r, "Scored " + p(t.label) + ": " + o.y.label + " " + n.y + ", " + o.x.label + " " + n.x + " (" + u.label + ").", { laneId: x(e).main, cardId: t.id });
    }
    case "rename_field": {
      const t = re(e, n.field);
      t || a.refuse("Cards on this board carry no " + n.field + ".", { code: "unknown_reference" });
      let o = "";
      try {
        o = P(n.label, 20, "Name the field in a word or two.");
      } catch (r) {
        a.refuse(r.message);
      }
      e.nest.fields.some((r) => r !== t && r.label.toLowerCase() === o.toLowerCase()) && a.refuse("Cards already carry " + o + ".");
      const l = s({ ...e, nest: { ...e.nest, fields: e.nest.fields.map((r) => r === t ? { ...r, label: o } : r) } });
      return a.done(l, "Renamed " + p(t.label) + " to " + p(o) + ".");
    }
    case "add_owner": {
      let t = "";
      try {
        t = P(n.label, 30, "Name the team in a few words.");
      } catch (u) {
        a.refuse(u.message);
      }
      const o = e.nest.owners ?? [];
      o.some((u) => u.label.toLowerCase() === t.toLowerCase()) && a.refuse(t + " owns cards here already."), o.length >= 8 && a.refuse("A board has up to 8 teams that own cards.");
      let l = R(t);
      for (let u = 2; o.some((h) => h.id === l); u++) l = R(t).slice(0, 17) + "-" + u;
      const r = s({ ...e, nest: { ...e.nest, owners: [...o, { id: l, label: t }] } });
      return a.done(r, t + " can own cards now.");
    }
    case "set_owner": {
      const t = a.card(n.card), o = e.nest?.owners ?? [], l = o.find((c) => c.id === n.owner || c.label.toLowerCase() === String(n.owner).toLowerCase());
      l || a.refuse(o.length ? "The teams on this board are " + o.map((c) => c.label).join(", ") + "." : "This board has no teams that own cards. Say “Add Growth as an owner” first.", { cardId: t.id, code: "unknown_reference" });
      const r = (e.behaviour?.rules ?? []).find((c) => c.on && c.kind === "sameOwnerAs"), u = b(e, t.id).slice(1), h = r?.mode === "carry" && t.owner !== l.id ? u.filter((c) => g(e, c).owner === t.owner) : [];
      let m = h;
      if (n.carry !== void 0) {
        const c = n.carry.map((y) => a.card(y).id);
        c.some((y) => !u.includes(y)) && a.refuse("Only cards under " + p(t.label) + " come along with it.", { cardId: t.id }), (h.length || r?.mode === "carry" && t.owner !== l.id) && [...c].sort().join() !== [...h].sort().join() && a.refuse("The board changed while you were dragging. Try again.", { cardId: t.id }), m = c;
      }
      const f = /* @__PURE__ */ new Set([t.id, ...m]), i = s({ ...e, cards: e.cards.map((c) => f.has(c.id) ? { ...c, owner: l.id } : c) }, t.laneId, t.id), d = m.length ? " " + m.length + (m.length === 1 ? " card" : " cards") + " under it came along." : "";
      return a.done(i, t.owner === l.id && m.length ? "Moved what is under " + p(t.label) + " to " + l.label + "." : p(t.label) + " is " + l.label + "’s now." + d, { laneId: t.laneId, cardId: t.id });
    }
  }
  return null;
}, ie = (e) => e.nest?.layout === "tree" && e.cards.some((n) => n.role === "manager" || n.role === "open role");
function le(e, n) {
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
  if (ie(e)) {
    const s = e.cards.filter((r) => r.parentId === n.id).length, t = (e.behaviour?.rules ?? []).find((r) => r.on && r.kind === "children" && (!r.role || r.role === n.role)), o = (e.nest?.fields ?? []).filter((r) => r.flag && n.fields?.[r.id] === 1).map((r) => r.label.toLowerCase()), l = [n.role ?? "", ...o, s ? s + (s === 1 ? " report" : " reports") + (t && s > t.max ? ", limit " + t.max : "") : ""].filter(Boolean);
    return n.label + (l.length ? `
` + l.join(" · ") : "");
  }
  return null;
}
function de(e) {
  const n = k(e);
  return e.nest?.owners?.length ? JSON.stringify(e.cards.map((a) => e.nest.owners.map((s) => {
    const t = M(e, [{ kind: "set_owner", card: { id: a.id }, owner: s.id }]);
    return "refused" in t ? 0 : t.workshop.cards.filter((o) => o.owner === s.id).length;
  }))) : n ? JSON.stringify([e.nest.axes, n.x.label, n.y.label, e.cards.map((a) => O.map((s) => {
    const { x: t, y: o } = Q(e, a, s.id);
    return "refused" in M(e, [{ kind: "score_card", card: { id: a.id }, x: t, y: o }]) ? 0 : 1;
  }).join(""))]) : null;
}
function ce(e, n) {
  if (e.nest?.layout !== "matrix") return null;
  const a = e.cards.filter((s) => s.laneId === n).length;
  return n === x(e).tray ? a ? a + " not scored yet" : "Everything is scored" : a + (a === 1 ? " card scored" : " cards scored");
}
$({ keys: Z, read: H, sentence: V, check: Y, contradiction: ee, readBoard: ne, readCard: te, validate: ae, edit: oe, cardText: le, drags: de, caption: ce });
const q = ["nest"], J = (e) => ({ type: "ref", of: "card", about: e }), B = (e) => ({ type: "integer", min: 0, max: 10, about: e });
F({
  kinds: [
    {
      kind: "score_card",
      summary: "Impact × effort: place a card by its two scores, 0 to 10 (x across, y up). A card in the tray comes onto the 2 by 2.",
      intent: !0,
      fields: { card: J("The card."), x: B("The score across (effort)."), y: B("The score up (impact).") },
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
        card: J("The card."),
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
  const s = U(n.length);
  return n.map(([t, o, l], r) => ({ id: t, label: o, laneId: e, order: s[r], ...a && { parentId: a }, ...l }));
}
const G = (e) => ({
  version: 1,
  rev: 0,
  rules: e.map((n, a) => ({ id: "rule-" + (a + 1), on: !0, severity: "refuse", set: { by: "Slatebox", at: "2026-11-21T00:00:00.000Z", via: "preset" }, ...n }))
});
function me() {
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
function he() {
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
function we() {
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
  we as goalsSample,
  me as impactEffortSample,
  ie as isOrgChart,
  k as nestAxes,
  O as nestQuadrants,
  I as nestScores,
  S as quadrantOf,
  he as reorgSample,
  se as scoreBoard,
  Q as scoresIn
};
