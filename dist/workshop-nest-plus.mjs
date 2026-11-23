import { h as G, s as g } from "./model-DSiU3YcW.mjs";
import { registerNestPlus as z, extend as U, nestAreas as p, nestPlace as W, nestSubtree as k, roleOf as A } from "./workshop-nest.mjs";
const _ = (e) => e.charAt(0).toUpperCase() + e.slice(1), C = (e) => /[^aeiou]y$/.test(e) ? e.slice(0, -1) + "ies" : /(?:s|sh|ch|x)$/.test(e) ? e + "es" : e + "s", N = (e) => (/^[aeiou]/i.test(e) ? "an " : "a ") + e, m = (e, n) => n === void 0 ? void 0 : e.cards.find((t) => t.id === n), E = (e, n, t) => {
  const r = typeof e == "string" ? e.replace(/\s+/g, " ").trim() : "";
  if (!r || r.length > n || /[<>\u0000-\u001f]/.test(r)) throw new Error(t);
  return r;
}, M = (e) => e.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 20) || "item", v = [
  { id: "do-now", label: "Do now", high: [!1, !0] },
  { id: "plan", label: "Plan it", high: [!0, !0] },
  { id: "later", label: "Later", high: [!1, !1] },
  { id: "skip", label: "Skip", high: [!0, !1] }
], j = (e) => v.find((n) => n.id === e), J = (e) => e >= 5;
function x(e) {
  const [n, t] = e.nest?.axes ?? [], r = (s) => e.nest?.fields?.find((o) => o.id === s);
  return e.nest?.layout === "matrix" && n && t ? { x: r(n), y: r(t) } : null;
}
function I(e, n) {
  const t = x(e);
  if (!t || n.laneId !== p(e).main) return null;
  const r = n.fields?.[t.x.id], s = n.fields?.[t.y.id];
  return r === void 0 || s === void 0 ? null : { x: r, y: s };
}
function q(e, n) {
  const t = I(e, n);
  return t ? v.find((r) => r.high[0] === J(t.x) && r.high[1] === J(t.y)).id : null;
}
function F(e, n, t) {
  const r = j(t), s = I(e, n) ?? { x: r.high[0] ? 7 : 2, y: r.high[1] ? 7 : 2 }, o = (d, a) => a ? Math.max(5, d) : Math.min(4, d);
  return { x: o(s.x, r.high[0]), y: o(s.y, r.high[1]) };
}
const L = (e, n) => e.nest?.fields?.find((t) => t.flag && t.id === n), T = (e, n, t) => L(e, t) ? n.fields?.[t] === 1 : n.role === t, D = (e, n) => C((L(e, n)?.label ?? n).toLowerCase()), b = (e, n) => e.nest?.owners?.find((t) => t.id === n);
function R(e, n) {
  switch (e.kind) {
    case "quadrant":
      return (j(e.quadrant)?.label ?? e.quadrant) + " holds " + e.max;
    case "parent":
      return _(D(n, e.not)) + " don’t manage";
    case "contains": {
      const t = L(n, e.of)?.label.toLowerCase() ?? e.of;
      return "Every " + e.role + " has " + (e.atLeast === 1 ? N(t) : "at least " + e.atLeast + " " + C(t)) + " under them";
    }
    case "sameOwnerAs":
      return (e.role ? _(C(e.role)) + " are" : "A card is") + " owned by the team that owns what " + (e.role ? "they sit" : "it sits") + " under" + (e.mode === "carry" ? "; moving one to a team brings what is under it along" : e.mode === "ask" ? "; moving one to a team asks about what is under it" : "");
  }
  return null;
}
const Q = { quadrant: "quadrant max", parent: "not", contains: "role of atLeast", sameOwnerAs: "mode role" };
function H(e, n, t) {
  const r = (s, o, d) => {
    if (typeof s != "number" || !Number.isInteger(s) || s < 1 || s > o) throw new Error(d);
    return s;
  };
  switch (e.kind) {
    case "quadrant": {
      const s = j(String(e.quadrant));
      if (!s) throw new Error("A 2 by 2’s squares are Do now, Plan it, Later and Skip.");
      return { ...n, kind: "quadrant", quadrant: s.id, max: r(e.max, 40, "A square holds from 1 to 40 cards.") };
    }
    case "parent":
      return { ...n, kind: "parent", not: A(e.not) };
    case "contains":
      return { ...n, kind: "contains", role: A(e.role), of: A(e.of), atLeast: r(e.atLeast, 12, "Say at least 1 to 12.") };
    case "sameOwnerAs": {
      if (e.mode !== "warn" && e.mode !== "ask" && e.mode !== "carry") throw new Error("When a card changes team, what is under it stays (warn), is asked about (ask) or comes along (carry).");
      const s = { ...n, kind: "sameOwnerAs", mode: e.mode };
      return e.role !== void 0 && (s.role = A(e.role)), s;
    }
  }
  return null;
}
function K(e, n) {
  const t = new Map(e.cards.map((r) => [r.id, r]));
  return n.cards.filter((r) => {
    const s = t.get(r.id);
    return !s || s.parentId !== r.parentId || s.laneId !== r.laneId || s.role !== r.role || s.owner !== r.owner || JSON.stringify(s.fields ?? {}) !== JSON.stringify(r.fields ?? {});
  });
}
const S = ["parent", "quadrant", "sameOwnerAs", "contains"];
function V(e, n, t) {
  const r = (e.behaviour?.rules ?? []).filter((a) => a.on && S.includes(a.kind)).sort((a, u) => S.indexOf(a.kind) - S.indexOf(u.kind));
  if (!r.length) return null;
  const { tray: s } = p(n), o = K(e, n).filter((a) => a.laneId !== s), d = (a, u) => a.cards.filter((w) => w.parentId === u).map((w) => w.id);
  for (const a of r) {
    let u = null;
    const w = R(a, e) + ".";
    if (a.kind === "quadrant") {
      const h = o.find((f) => {
        const i = m(e, f.id);
        return q(n, f) === a.quadrant && (!i || q(e, i) !== a.quadrant);
      });
      if (h) {
        const f = e.cards.filter((l) => q(e, l) === a.quadrant), i = n.cards.filter((l) => q(n, l) === a.quadrant).length;
        if (i > a.max && i > f.length) {
          const l = x(e), c = [...f].sort((y, $) => I(e, y).y - I(e, $).y)[0];
          u = { sentence: w + (c ? " " + c.label + " has the lowest " + l.y.label.toLowerCase() + " there." : ""), card: h };
        }
      }
    } else if (a.kind === "parent")
      for (const h of n.cards) {
        if (!T(n, h, a.not)) continue;
        const f = d(n, h.id), i = m(e, h.id), l = i && T(e, i, a.not) ? d(e, h.id) : [], c = f.find((y) => !l.includes(y));
        if (c) {
          u = { sentence: w + " " + h.label + " is " + (L(n, a.not) ? N(L(n, a.not).label.toLowerCase()) : N(a.not)) + ".", card: m(n, c) };
          break;
        }
      }
    else if (a.kind === "contains") {
      const h = (f, i) => k(f, i).slice(1).filter((l) => T(f, m(f, l), a.of)).length;
      for (const f of [...n.cards].sort((i, l) => k(n, i.id).length - k(n, l.id).length)) {
        if (f.role !== a.role || f.laneId === s || !k(n, f.id).slice(1).length) continue;
        const l = h(n, f.id);
        if (l >= a.atLeast) continue;
        const c = m(e, f.id), y = c && c.role === a.role ? h(e, f.id) : -1;
        if (y === -1 || y >= a.atLeast) {
          u = { sentence: w + " " + f.label + " would have " + (l || "none") + ".", card: f };
          break;
        }
      }
    } else if (a.kind === "sameOwnerAs") {
      const h = (i) => !a.role || i.role === a.role, f = new Set(o.filter((i) => {
        const l = m(e, i.id);
        return !l || l.parentId !== i.parentId || l.laneId !== i.laneId || l.owner !== i.owner;
      }).map((i) => i.id));
      for (const i of n.cards) {
        if (!h(i) || !i.owner || i.laneId === s) continue;
        const l = m(n, i.parentId);
        if (!l?.owner || l.owner === i.owner) continue;
        const c = m(e, l.id);
        if (!(!f.has(i.id) && c?.owner === l.owner)) {
          u = { sentence: i.label + " is " + b(n, i.owner).label + "’s; what it sits under is " + b(n, l.owner).label + "’s.", card: i };
          break;
        }
      }
      if (a.mode === "ask") for (const i of o) {
        const l = m(e, i.id);
        if (!l?.owner || !i.owner || l.owner === i.owner) continue;
        const c = k(n, i.id).slice(1).filter((y) => m(n, y).owner === l.owner);
        c.length && t.push(c.length + (c.length === 1 ? " card" : " cards") + " under " + i.label + " stayed with " + b(n, l.owner).label + ". Say “Move what is under " + i.label + " to " + b(n, i.owner).label + " too” to bring " + (c.length === 1 ? "it" : "them") + ".");
      }
    }
    if (u) {
      if (a.severity === "warn") {
        t.push(u.sentence);
        continue;
      }
      return { refused: { sentence: u.sentence, ruleId: a.id, set: a.set, cardId: u.card.id, laneId: u.card.laneId } };
    }
  }
  return { ok: !0, warnings: t };
}
function X(e, n) {
  const t = /* @__PURE__ */ new Set();
  for (const r of e.rules) {
    if (!S.includes(r.kind)) continue;
    const s = r.kind + ":" + (r.kind === "quadrant" ? r.quadrant : r.kind === "parent" ? r.not : r.kind === "contains" ? r.role + ">" + r.of : "");
    if (t.has(s)) return "There is already a rule like that on this board. Change that one instead.";
    if (t.add(s), r.kind === "contains" && r.on && r.severity === "refuse" && e.rules.some((o) => o.on && o.severity === "refuse" && o.kind === "parent" && o.not === r.role))
      return _(C(r.role)) + " would need someone under them, and " + D(n, r.role) + " don’t manage.";
  }
  return null;
}
function Y(e, n, t) {
  if (e.axes !== void 0) {
    if (!Array.isArray(e.axes) || e.axes.length !== 2 || e.axes[0] === e.axes[1]) throw new Error("A 2 by 2 reads two fields, one across and one up.");
    n.axes = [t.id(e.axes[0]), t.id(e.axes[1])];
  }
  if (e.owners !== void 0) {
    if (!Array.isArray(e.owners) || e.owners.length > 8) throw new Error("A board has up to 8 teams that own cards.");
    if (n.owners = e.owners.map((r) => {
      const s = r ?? {};
      return { id: t.id(s.id), label: E(s.label, 30, "Name a team in a few words.") };
    }), new Set(n.owners.map((r) => r.id)).size !== n.owners.length) throw new Error("Duplicate team.");
  }
}
function Z(e, n, t) {
  e.owner !== void 0 && (n.owner = t.id(e.owner));
}
function ee(e) {
  const n = e.nest, { main: t } = p(e), r = e.behaviour?.rules ?? [];
  if (n.layout !== "matrix" && r.some((o) => o.kind === "quadrant")) return "Only a 2 by 2 has squares to fill.";
  if (!n.owners?.length && r.some((o) => o.kind === "sameOwnerAs")) return "This board has no teams that own cards. Say “Add Growth as an owner” first.";
  for (const o of n.fields ?? []) if (o.flag) {
    const d = e.cards.find((a) => a.fields?.[o.id] !== void 0 && a.fields[o.id] > 1);
    if (d) return g(d.label) + "’s " + o.label + " is yes (1) or no (0).";
  }
  for (const o of e.cards) if (o.owner !== void 0 && !b(e, o.owner)) return g(o.label) + " is owned by a team that is no longer on the board.";
  if (n.layout !== "matrix") return n.axes ? "Only a 2 by 2 has axes." : null;
  const s = x(e);
  if (!s?.x || !s.y || s.x.flag || s.y.flag) return "A 2 by 2 reads two number fields, one across and one up.";
  for (const o of e.cards) {
    if (o.parentId) return "A 2 by 2 places cards side by side: nothing sits under another.";
    if (o.laneId !== t) continue;
    const d = I(e, o);
    if (!d) return g(o.label) + " needs a score on both axes. Say “Score " + o.label + " " + s.y.label.toLowerCase() + " 8, " + s.x.label.toLowerCase() + " 3”.";
    if (d.x > 10 || d.y > 10) return "Scores run from 0 to 10.";
  }
  return null;
}
function ne(e, n, t, r) {
  const s = x(e), o = m(e, n);
  if (!s || !o || e.cards.some((u) => u.parentId === n)) return null;
  const { main: d } = p(e), a = o.laneId === d ? e : W(e, n, { laneId: d, under: null, before: null });
  return a ? { ...a, cards: a.cards.map((u) => u.id === n ? { ...u, fields: { ...u.fields, [s.x.id]: t, [s.y.id]: r } } : u) } : null;
}
const se = (e, n) => (e.nest?.fields ?? []).find((t) => t.id === n || t.label.toLowerCase() === String(n).toLowerCase()), te = (e, n, t, r) => {
  switch (n.kind) {
    case "score_card": {
      const s = t.card(n.card), o = x(e);
      o || t.refuse("Only a 2 by 2 scores cards.", { code: "invalid_edit" });
      for (const w of [n.x, n.y]) (!Number.isInteger(w) || w < 0 || w > 10) && t.refuse("Scores run from 0 to 10.", { cardId: s.id });
      const d = ne(e, s.id, n.x, n.y);
      d || t.refuse(g(s.label) + " has cards under it, so it can’t be scored.", { cardId: s.id });
      const a = r(d, p(e).main, s.id), u = v.find((w) => w.id === q(a, a.cards.find((h) => h.id === s.id)));
      return t.done(a, "Scored " + g(s.label) + ": " + o.y.label + " " + n.y + ", " + o.x.label + " " + n.x + " (" + u.label + ").", { laneId: p(e).main, cardId: s.id });
    }
    case "rename_field": {
      const s = se(e, n.field);
      s || t.refuse("Cards on this board carry no " + n.field + ".", { code: "unknown_reference" });
      let o = "";
      try {
        o = E(n.label, 20, "Name the field in a word or two.");
      } catch (a) {
        t.refuse(a.message);
      }
      e.nest.fields.some((a) => a !== s && a.label.toLowerCase() === o.toLowerCase()) && t.refuse("Cards already carry " + o + ".");
      const d = r({ ...e, nest: { ...e.nest, fields: e.nest.fields.map((a) => a === s ? { ...a, label: o } : a) } });
      return t.done(d, "Renamed " + g(s.label) + " to " + g(o) + ".");
    }
    case "add_owner": {
      let s = "";
      try {
        s = E(n.label, 30, "Name the team in a few words.");
      } catch (u) {
        t.refuse(u.message);
      }
      const o = e.nest.owners ?? [];
      o.some((u) => u.label.toLowerCase() === s.toLowerCase()) && t.refuse(s + " owns cards here already."), o.length >= 8 && t.refuse("A board has up to 8 teams that own cards.");
      let d = M(s);
      for (let u = 2; o.some((w) => w.id === d); u++) d = M(s).slice(0, 17) + "-" + u;
      const a = r({ ...e, nest: { ...e.nest, owners: [...o, { id: d, label: s }] } });
      return t.done(a, s + " can own cards now.");
    }
    case "set_owner": {
      const s = t.card(n.card), o = e.nest?.owners ?? [], d = o.find((c) => c.id === n.owner || c.label.toLowerCase() === String(n.owner).toLowerCase());
      d || t.refuse(o.length ? "The teams on this board are " + o.map((c) => c.label).join(", ") + "." : "This board has no teams that own cards. Say “Add Growth as an owner” first.", { cardId: s.id, code: "unknown_reference" });
      const a = (e.behaviour?.rules ?? []).find((c) => c.on && c.kind === "sameOwnerAs"), u = k(e, s.id).slice(1), w = a?.mode === "carry" && s.owner !== d.id ? u.filter((c) => m(e, c).owner === s.owner) : [];
      let h = w;
      if (n.carry !== void 0) {
        const c = n.carry.map((y) => t.card(y).id);
        c.some((y) => !u.includes(y)) && t.refuse("Only cards under " + g(s.label) + " come along with it.", { cardId: s.id }), (w.length || a?.mode === "carry" && s.owner !== d.id) && [...c].sort().join() !== [...w].sort().join() && t.refuse("The board changed while you were dragging. Try again.", { cardId: s.id }), h = c;
      }
      const f = /* @__PURE__ */ new Set([s.id, ...h]), i = r({ ...e, cards: e.cards.map((c) => f.has(c.id) ? { ...c, owner: d.id } : c) }, s.laneId, s.id), l = h.length ? " " + h.length + (h.length === 1 ? " card" : " cards") + " under it came along." : "";
      return t.done(i, s.owner === d.id && h.length ? "Moved what is under " + g(s.label) + " to " + d.label + "." : g(s.label) + " is " + d.label + "’s now." + l, { laneId: s.laneId, cardId: s.id });
    }
  }
  return null;
}, re = (e) => e.nest?.layout === "tree" && e.cards.some((n) => n.role === "manager" || n.role === "open role");
function ae(e, n) {
  const t = I(e, n);
  if (t) {
    const r = x(e);
    return n.label + `
` + r.y.label + " " + t.y + " · " + r.x.label + " " + t.x;
  }
  if (e.nest?.layout === "matrix") return n.label;
  if (e.nest?.owners?.length) {
    const r = b(e, n.owner), s = m(e, n.parentId), o = r && s?.owner && s.owner !== n.owner;
    return n.label + (r ? `
` + r.label + (o ? " · cross-team" : "") : "");
  }
  if (re(e)) {
    const r = e.cards.filter((a) => a.parentId === n.id).length, s = (e.behaviour?.rules ?? []).find((a) => a.on && a.kind === "children" && (!a.role || a.role === n.role)), o = (e.nest?.fields ?? []).filter((a) => a.flag && n.fields?.[a.id] === 1).map((a) => a.label.toLowerCase()), d = [n.role ?? "", ...o, r ? r + (r === 1 ? " report" : " reports") + (s && r > s.max ? ", limit " + s.max : "") : ""].filter(Boolean);
    return n.label + (d.length ? `
` + d.join(" · ") : "");
  }
  return null;
}
function oe(e) {
  const n = x(e);
  return e.nest?.owners?.length ? JSON.stringify(e.cards.map((t) => e.nest.owners.map((r) => {
    const s = G(e, [{ kind: "set_owner", card: { id: t.id }, owner: r.id }]);
    return "refused" in s ? 0 : s.workshop.cards.filter((o) => o.owner === r.id).length;
  }))) : n ? JSON.stringify([e.nest.axes, n.x.label, n.y.label, e.cards.map((t) => v.map((r) => {
    const { x: s, y: o } = F(e, t, r.id);
    return "refused" in G(e, [{ kind: "score_card", card: { id: t.id }, x: s, y: o }]) ? 0 : 1;
  }).join(""))]) : null;
}
function ie(e, n) {
  if (e.nest?.layout !== "matrix") return null;
  const t = e.cards.filter((r) => r.laneId === n).length;
  return n === p(e).tray ? t ? t + " not scored yet" : "Everything is scored" : t + (t === 1 ? " card scored" : " cards scored");
}
z({ keys: Q, read: H, sentence: R, check: V, contradiction: X, readBoard: Y, readCard: Z, validate: ee, edit: te, cardText: ae, drags: oe, caption: ie });
const O = ["nest"], P = (e) => ({ type: "ref", of: "card", about: e }), B = (e) => ({ type: "integer", min: 0, max: 10, about: e });
U({
  kinds: [
    {
      kind: "score_card",
      summary: "Impact × effort: place a card by its two scores, 0 to 10 (x across, y up). A card in the tray comes onto the 2 by 2.",
      intent: !0,
      fields: { card: P("The card."), x: B("The score across (effort)."), y: B("The score up (impact).") },
      boards: O,
      refusals: {}
    },
    {
      kind: "rename_field",
      summary: "Nest board: rename a field (an axis of a 2 by 2: Reach, Confidence…).",
      intent: !1,
      fields: { field: { type: "text", max: 20, about: "The field, by id or name." }, label: { type: "text", max: 20, about: "Its new name." } },
      boards: O,
      refusals: {}
    },
    {
      kind: "add_owner",
      summary: "Goals & owners: add a team that can own cards. Up to 8.",
      intent: !1,
      fields: { label: { type: "text", max: 30, about: "The team’s name." } },
      boards: O,
      refusals: {}
    },
    {
      kind: "set_owner",
      summary: "Goals & owners: give a card to a team. carry: the cards under it that come along (left out, the ownership rule decides; a different carry than it works out is refused).",
      intent: !0,
      fields: {
        card: P("The card."),
        owner: { type: "text", max: 30, about: "The team, by id or name." },
        carry: { type: "refs", of: "card", min: 0, max: 40, optional: !0, about: "The cards under it that come along." }
      },
      boards: O,
      refusals: {}
    }
  ],
  boards: {},
  fields: { set_rule: { mode: { type: "choice", values: ["warn", "ask", "carry"], optional: !0, about: "Goals & owners: what a change of team does to the cards under a card." } } },
  rules: {
    kinds: ["quadrant", "parent", "contains", "sameOwnerAs"],
    keys: {
      quadrant: { enum: v.map((e) => e.id) },
      not: { type: "string", maxLength: 24 },
      of: { type: "string", maxLength: 24 },
      atLeast: { type: "integer", minimum: 1, maximum: 12 },
      mode: { enum: ["warn", "ask", "carry"] }
    }
  }
});
export {
  re as isOrgChart,
  x as nestAxes,
  v as nestQuadrants,
  I as nestScores,
  q as quadrantOf,
  ne as scoreBoard,
  F as scoresIn
};
