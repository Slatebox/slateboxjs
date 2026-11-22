import { applyWorkshopEdits as R, said as p } from "./workshop-model.mjs";
import { registerNestPlus as F, extend as K, nestAreas as x, nestPlace as U, orderKeys as Q, nestSubtree as b, roleOf as q } from "./workshop-nest.mjs";
const _ = (e) => e.charAt(0).toUpperCase() + e.slice(1), N = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", P = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, w = (e, n) => n === void 0 ? void 0 : e.cards.find((a) => a.id === n), j = (e, n, a) => {
  const s = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!s || s.length > n || /[<>\u0000-\u001f]/.test(s)) throw new Error(a);
  return s;
}, D = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "item", O = [
  { id: "do-now", label: "Do now", high: [!1, !0] },
  { id: "plan", label: "Plan it", high: [!0, !0] },
  { id: "later", label: "Later", high: [!1, !1] },
  { id: "skip", label: "Skip", high: [!0, !1] }
], G = (e) => O.find((n) => n.id === e), J = (e) => e >= 5;
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
function Z(e, n, a) {
  const s = G(a), t = I(e, n) ?? { x: s.high[0] ? 7 : 2, y: s.high[1] ? 7 : 2 }, o = (l, r) => r ? Math.max(5, l) : Math.min(4, l);
  return { x: o(t.x, s.high[0]), y: o(t.y, s.high[1]) };
}
const A = (e, n) => e.nest?.fields?.find((a) => a.flag && a.id === n), E = (e, n, a) => A(e, a) ? n.fields?.[a] === 1 : n.role === a, V = (e, n) => N((A(e, n)?.label ?? n).toLowerCase()), v = (e, n) => e.nest?.owners?.find((a) => a.id === n);
function W(e, n) {
  switch (e.kind) {
    case "quadrant":
      return (G(e.quadrant)?.label ?? e.quadrant) + " holds " + e.max;
    case "parent":
      return _(V(n, e.not)) + " don’t manage";
    case "contains": {
      const a = A(n, e.of)?.label.toLowerCase() ?? e.of;
      return "Every " + e.role + " has " + (e.atLeast === 1 ? P(a) : "at least " + e.atLeast + " " + N(a)) + " under them";
    }
    case "sameOwnerAs":
      return (e.role ? _(N(e.role)) + " are" : "A card is") + " owned by the team that owns what " + (e.role ? "they sit" : "it sits") + " under" + (e.mode === "carry" ? "; moving one to a team brings what is under it along" : e.mode === "ask" ? "; moving one to a team asks about what is under it" : "");
  }
  return null;
}
const H = { quadrant: "quadrant max", parent: "not", contains: "role of atLeast", sameOwnerAs: "mode role" };
function X(e, n, a) {
  const s = (t, o, l) => {
    if (typeof t != "number" || !Number.isInteger(t) || t < 1 || t > o) throw new Error(l);
    return t;
  };
  switch (e.kind) {
    case "quadrant": {
      const t = G(String(e.quadrant));
      if (!t) throw new Error("A 2 by 2’s squares are Do now, Plan it, Later and Skip.");
      return { ...n, kind: "quadrant", quadrant: t.id, max: s(e.max, 40, "A square holds from 1 to 40 cards.") };
    }
    case "parent":
      return { ...n, kind: "parent", not: q(e.not) };
    case "contains":
      return { ...n, kind: "contains", role: q(e.role), of: q(e.of), atLeast: s(e.atLeast, 12, "Say at least 1 to 12.") };
    case "sameOwnerAs": {
      if (e.mode !== "warn" && e.mode !== "ask" && e.mode !== "carry") throw new Error("When a card changes team, what is under it stays (warn), is asked about (ask) or comes along (carry).");
      const t = { ...n, kind: "sameOwnerAs", mode: e.mode };
      return e.role !== void 0 && (t.role = q(e.role)), t;
    }
  }
  return null;
}
function Y(e, n) {
  const a = new Map(e.cards.map((s) => [s.id, s]));
  return n.cards.filter((s) => {
    const t = a.get(s.id);
    return !t || t.parentId !== s.parentId || t.laneId !== s.laneId || t.role !== s.role || t.owner !== s.owner || JSON.stringify(t.fields ?? {}) !== JSON.stringify(s.fields ?? {});
  });
}
const T = ["parent", "quadrant", "sameOwnerAs", "contains"];
function ee(e, n, a) {
  const s = (e.behaviour?.rules ?? []).filter((r) => r.on && T.includes(r.kind)).sort((r, u) => T.indexOf(r.kind) - T.indexOf(u.kind));
  if (!s.length) return null;
  const { tray: t } = x(n), o = Y(e, n).filter((r) => r.laneId !== t), l = (r, u) => r.cards.filter((m) => m.parentId === u).map((m) => m.id);
  for (const r of s) {
    let u = null;
    const m = W(r, e) + ".";
    if (r.kind === "quadrant") {
      const f = o.find((g) => {
        const i = w(e, g.id);
        return S(n, g) === r.quadrant && (!i || S(e, i) !== r.quadrant);
      });
      if (f) {
        const g = e.cards.filter((c) => S(e, c) === r.quadrant), i = n.cards.filter((c) => S(n, c) === r.quadrant).length;
        if (i > r.max && i > g.length) {
          const c = k(e), d = [...g].sort((y, L) => I(e, y).y - I(e, L).y)[0];
          u = { sentence: m + (d ? " " + d.label + " has the lowest " + c.y.label.toLowerCase() + " there." : ""), card: f };
        }
      }
    } else if (r.kind === "parent")
      for (const f of n.cards) {
        if (!E(n, f, r.not)) continue;
        const g = l(n, f.id), i = w(e, f.id), c = i && E(e, i, r.not) ? l(e, f.id) : [], d = g.find((y) => !c.includes(y));
        if (d) {
          u = { sentence: m + " " + f.label + " is " + (A(n, r.not) ? P(A(n, r.not).label.toLowerCase()) : P(r.not)) + ".", card: w(n, d) };
          break;
        }
      }
    else if (r.kind === "contains") {
      const f = (i, c) => b(i, c).slice(1).filter((d) => E(i, w(i, d), r.of)).length, g = new Set(n.cards.filter((i) => {
        const c = w(e, i.id);
        return !c || c.parentId !== i.parentId || c.laneId !== i.laneId;
      }).map((i) => i.id));
      for (const i of [...n.cards].sort((c, d) => b(n, c.id).length - b(n, d.id).length)) {
        if (i.role !== r.role || i.laneId === t) continue;
        const c = b(n, i.id).slice(1);
        if (!c.length) continue;
        const d = f(n, i.id);
        if (d >= r.atLeast) continue;
        const y = w(e, i.id), L = y && y.role === r.role ? f(e, i.id) : -1;
        if (L === -1 || L >= r.atLeast || c.some(($) => g.has($))) {
          u = { sentence: m + " " + i.label + " would have " + (d || "none") + ".", card: i };
          break;
        }
      }
    } else if (r.kind === "sameOwnerAs") {
      const f = (i) => !r.role || i.role === r.role, g = new Set(o.filter((i) => {
        const c = w(e, i.id);
        return !c || c.parentId !== i.parentId || c.laneId !== i.laneId || c.owner !== i.owner;
      }).map((i) => i.id));
      for (const i of n.cards) {
        if (!f(i) || !i.owner || i.laneId === t) continue;
        const c = w(n, i.parentId);
        if (!c?.owner || c.owner === i.owner) continue;
        const d = w(e, c.id);
        if (!(!g.has(i.id) && d?.owner === c.owner)) {
          u = { sentence: i.label + " is " + v(n, i.owner).label + "’s; what it sits under is " + v(n, c.owner).label + "’s.", card: i };
          break;
        }
      }
      if (r.mode === "ask") for (const i of o) {
        const c = w(e, i.id);
        if (!c?.owner || !i.owner || c.owner === i.owner) continue;
        const d = b(n, i.id).slice(1).filter((y) => w(n, y).owner === c.owner);
        d.length && a.push(d.length + (d.length === 1 ? " card" : " cards") + " under " + i.label + " stayed with " + v(n, c.owner).label + ". Say “Move what is under " + i.label + " to " + v(n, i.owner).label + " too” to bring " + (d.length === 1 ? "it" : "them") + ".");
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
function ne(e, n) {
  const a = /* @__PURE__ */ new Set();
  for (const s of e.rules) {
    if (!T.includes(s.kind)) continue;
    const t = s.kind + ":" + (s.kind === "quadrant" ? s.quadrant : s.kind === "parent" ? s.not : s.kind === "contains" ? s.role + ">" + s.of : "");
    if (a.has(t)) return "There is already a rule like that on this board. Change that one instead.";
    if (a.add(t), s.kind === "contains" && s.on && s.severity === "refuse" && e.rules.some((o) => o.on && o.severity === "refuse" && o.kind === "parent" && o.not === s.role))
      return _(N(s.role)) + " would need someone under them, and " + V(n, s.role) + " don’t manage.";
  }
  return null;
}
function te(e, n, a) {
  if (e.axes !== void 0) {
    if (!Array.isArray(e.axes) || e.axes.length !== 2 || e.axes[0] === e.axes[1]) throw new Error("A 2 by 2 reads two fields, one across and one up.");
    n.axes = [a.id(e.axes[0]), a.id(e.axes[1])];
  }
  if (e.owners !== void 0) {
    if (!Array.isArray(e.owners) || e.owners.length > 8) throw new Error("A board has up to 8 teams that own cards.");
    if (n.owners = e.owners.map((s) => {
      const t = s ?? {};
      return { id: a.id(t.id), label: j(t.label, 30, "Name a team in a few words.") };
    }), new Set(n.owners.map((s) => s.id)).size !== n.owners.length) throw new Error("Duplicate team.");
  }
}
function ae(e, n, a) {
  e.owner !== void 0 && (n.owner = a.id(e.owner));
}
function se(e) {
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
function re(e, n, a, s) {
  const t = k(e), o = w(e, n);
  if (!t || !o || e.cards.some((u) => u.parentId === n)) return null;
  const { main: l } = x(e), r = o.laneId === l ? e : U(e, n, { laneId: l, under: null, before: null });
  return r ? { ...r, cards: r.cards.map((u) => u.id === n ? { ...u, fields: { ...u.fields, [t.x.id]: a, [t.y.id]: s } } : u) } : null;
}
const oe = (e, n) => (e.nest?.fields ?? []).find((a) => a.id === n || a.label.toLowerCase() === String(n).toLowerCase()), ie = (e, n, a, s) => {
  switch (n.kind) {
    case "score_card": {
      const t = a.card(n.card), o = k(e);
      o || a.refuse("Only a 2 by 2 scores cards.", { code: "invalid_edit" });
      for (const m of [n.x, n.y]) (!Number.isInteger(m) || m < 0 || m > 10) && a.refuse("Scores run from 0 to 10.", { cardId: t.id });
      const l = re(e, t.id, n.x, n.y);
      l || a.refuse(p(t.label) + " has cards under it, so it can’t be scored.", { cardId: t.id });
      const r = s(l, x(e).main, t.id), u = O.find((m) => m.id === S(r, r.cards.find((f) => f.id === t.id)));
      return a.done(r, "Scored " + p(t.label) + ": " + o.y.label + " " + n.y + ", " + o.x.label + " " + n.x + " (" + u.label + ").", { laneId: x(e).main, cardId: t.id });
    }
    case "rename_field": {
      const t = oe(e, n.field);
      t || a.refuse("Cards on this board carry no " + n.field + ".", { code: "unknown_reference" });
      let o = "";
      try {
        o = j(n.label, 20, "Name the field in a word or two.");
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
        t = j(n.label, 30, "Name the team in a few words.");
      } catch (u) {
        a.refuse(u.message);
      }
      const o = e.nest.owners ?? [];
      o.some((u) => u.label.toLowerCase() === t.toLowerCase()) && a.refuse(t + " owns cards here already."), o.length >= 8 && a.refuse("A board has up to 8 teams that own cards.");
      let l = D(t);
      for (let u = 2; o.some((m) => m.id === l); u++) l = D(t).slice(0, 17) + "-" + u;
      const r = s({ ...e, nest: { ...e.nest, owners: [...o, { id: l, label: t }] } });
      return a.done(r, t + " can own cards now.");
    }
    case "set_owner": {
      const t = a.card(n.card), o = e.nest?.owners ?? [], l = o.find((d) => d.id === n.owner || d.label.toLowerCase() === String(n.owner).toLowerCase());
      l || a.refuse(o.length ? "The teams on this board are " + o.map((d) => d.label).join(", ") + "." : "This board has no teams that own cards. Say “Add Growth as an owner” first.", { cardId: t.id, code: "unknown_reference" });
      const r = (e.behaviour?.rules ?? []).find((d) => d.on && d.kind === "sameOwnerAs"), u = b(e, t.id).slice(1), m = r?.mode === "carry" && t.owner !== l.id ? u.filter((d) => w(e, d).owner === t.owner) : [];
      let f = m;
      if (n.carry !== void 0) {
        const d = n.carry.map((y) => a.card(y).id);
        d.some((y) => !u.includes(y)) && a.refuse("Only cards under " + p(t.label) + " come along with it.", { cardId: t.id }), (m.length || r?.mode === "carry" && t.owner !== l.id) && [...d].sort().join() !== [...m].sort().join() && a.refuse("The board changed while you were dragging. Try again.", { cardId: t.id }), f = d;
      }
      const g = /* @__PURE__ */ new Set([t.id, ...f]), i = s({ ...e, cards: e.cards.map((d) => g.has(d.id) ? { ...d, owner: l.id } : d) }, t.laneId, t.id), c = f.length ? " " + f.length + (f.length === 1 ? " card" : " cards") + " under it came along." : "";
      return a.done(i, t.owner === l.id && f.length ? "Moved what is under " + p(t.label) + " to " + l.label + "." : p(t.label) + " is " + l.label + "’s now." + c, { laneId: t.laneId, cardId: t.id });
    }
  }
  return null;
}, le = (e) => e.nest?.layout === "tree" && e.cards.some((n) => n.role === "manager" || n.role === "open role");
function de(e, n) {
  const a = I(e, n);
  if (a) {
    const s = k(e);
    return n.label + `
` + s.y.label + " " + a.y + " · " + s.x.label + " " + a.x;
  }
  if (e.nest?.layout === "matrix") return n.label;
  if (e.nest?.owners?.length) {
    const s = v(e, n.owner), t = w(e, n.parentId), o = s && t?.owner && t.owner !== n.owner;
    return n.label + (s ? `
` + s.label + (o ? " · cross-team" : "") : "");
  }
  if (le(e)) {
    const s = e.cards.filter((r) => r.parentId === n.id).length, t = (e.behaviour?.rules ?? []).find((r) => r.on && r.kind === "children" && (!r.role || r.role === n.role)), o = (e.nest?.fields ?? []).filter((r) => r.flag && n.fields?.[r.id] === 1).map((r) => r.label.toLowerCase()), l = [n.role ?? "", ...o, s ? s + (s === 1 ? " report" : " reports") + (t && s > t.max ? ", limit " + t.max : "") : ""].filter(Boolean);
    return n.label + (l.length ? `
` + l.join(" · ") : "");
  }
  return null;
}
function ce(e) {
  const n = k(e);
  return e.nest?.owners?.length ? JSON.stringify(e.cards.map((a) => e.nest.owners.map((s) => {
    const t = R(e, [{ kind: "set_owner", card: { id: a.id }, owner: s.id }]);
    return "refused" in t ? 0 : t.workshop.cards.filter((o) => o.owner === s.id).length;
  }))) : n ? JSON.stringify([e.nest.axes, n.x.label, n.y.label, e.cards.map((a) => O.map((s) => {
    const { x: t, y: o } = Z(e, a, s.id);
    return "refused" in R(e, [{ kind: "score_card", card: { id: a.id }, x: t, y: o }]) ? 0 : 1;
  }).join(""))]) : null;
}
function ue(e, n) {
  if (e.nest?.layout !== "matrix") return null;
  const a = e.cards.filter((s) => s.laneId === n).length;
  return n === x(e).tray ? a ? a + " not scored yet" : "Everything is scored" : a + (a === 1 ? " card scored" : " cards scored");
}
F({ keys: H, read: X, sentence: W, check: ee, contradiction: ne, readBoard: te, readCard: ae, validate: se, edit: ie, cardText: de, drags: ce, caption: ue });
const C = ["nest"], B = (e) => ({ type: "ref", of: "card", about: e }), z = (e) => ({ type: "integer", min: 0, max: 10, about: e });
K({
  kinds: [
    {
      kind: "score_card",
      summary: "Impact × effort: place a card by its two scores, 0 to 10 (x across, y up). A card in the tray comes onto the 2 by 2.",
      intent: !0,
      fields: { card: B("The card."), x: z("The score across (effort)."), y: z("The score up (impact).") },
      boards: C,
      refusals: {}
    },
    {
      kind: "rename_field",
      summary: "Nest board: rename a field (an axis of a 2 by 2: Reach, Confidence…).",
      intent: !1,
      fields: { field: { type: "text", max: 20, about: "The field, by id or name." }, label: { type: "text", max: 20, about: "Its new name." } },
      boards: C,
      refusals: {}
    },
    {
      kind: "add_owner",
      summary: "Goals & owners: add a team that can own cards. Up to 8.",
      intent: !1,
      fields: { label: { type: "text", max: 30, about: "The team’s name." } },
      boards: C,
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
      boards: C,
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
function h(e, n, a) {
  const s = Q(n.length);
  return n.map(([t, o, l], r) => ({ id: t, label: o, laneId: e, order: s[r], ...a && { parentId: a }, ...l }));
}
const M = (e) => ({
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
      ...h("matrix", [
        ["search", "Faster search", e(3, 8)],
        ["sso", "SSO", e(4, 9)],
        ["exports", "Exports", e(2, 6)],
        ["mobile", "Mobile app", e(9, 7)],
        ["summaries", "AI summaries", e(7, 6)],
        ["dark-mode", "Dark mode", e(2, 3)],
        ["billing", "Rewrite billing", e(9, 2)]
      ]),
      ...h("unscored", [["alerts", "Slack alerts"], ["audit", "Audit log"]])
    ],
    behaviour: M([{ kind: "quadrant", quadrant: "do-now", max: 3 }])
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
      ...h("org", [["dana", "Dana Ito, CEO", e("manager")]]),
      ...h("org", [["maya", "Maya Chen, VP Product", e("manager")], ["priya", "Priya Rao, VP Eng", e("manager")], ["vp-sales", "VP Sales", e("open role")]], "dana"),
      ...h("org", [["jo", "Jo Park, Growth", e("manager")]], "maya"),
      ...h("org", [["ravi", "Ravi Shah", e("engineer")], ["lena", "Lena Ortiz", e("designer")], ["sam", "Sam Lee", e("engineer", !0)]], "jo"),
      ...h("org", [["kai", "Kai Wong, Platform", e("manager")]], "priya"),
      ...h("org", [["tom", "Tom Berg", e("engineer")], ["ivy", "Ivy Moss", e("engineer")]], "kai"),
      ...h("unplaced", [["ae-1", "Account exec 1", e("open role")], ["ae-2", "Account exec 2", e("open role")]])
    ],
    behaviour: M([
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
      ...h("goals", [["activation", "Activation to 40%", e("objective", "growth")], ["uptime", "99.9% uptime", e("objective", "platform")]]),
      ...h("goals", [["fast-onboarding", "Onboarding under 10 min", e("key result", "growth")], ["self-serve", "Self-serve upgrades 30%", e("key result", "growth")]], "activation"),
      ...h("goals", [["guided", "Guided setup", e("initiative", "growth")], ["starters", "Starter templates", e("initiative", "growth")]], "fast-onboarding"),
      ...h("goals", [["pricing-page", "New pricing page", e("initiative", "growth")]], "self-serve"),
      ...h("goals", [["latency", "p95 under 300 ms", e("key result", "platform")]], "uptime"),
      ...h("goals", [["cache", "Cache the hot paths", e("initiative", "platform")]], "latency"),
      ...h("unplaced", [["partners", "Partner channel live", e("key result", "sales")]])
    ],
    behaviour: M([
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
  le as isOrgChart,
  k as nestAxes,
  O as nestQuadrants,
  I as nestScores,
  S as quadrantOf,
  ge as reorgSample,
  re as scoreBoard,
  Z as scoresIn
};
