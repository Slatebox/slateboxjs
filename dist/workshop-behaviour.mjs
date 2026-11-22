import { validateWorkshop as _, workshopReferences as L, workshopCandidate as A, workshopRefusal as R, said as j, registerRulebook as N } from "./workshop-model.mjs";
import { D as M } from "./NoteDefaults-1xFW0br8.mjs";
const z = ["capacity", "path", "gate", "bin"], F = 12, $ = { pipeline: [{ id: "amount", noun: "an amount" }] }, b = (n) => Object.values($).flat().find((e) => e.id === n)?.noun ?? n, D = /* @__PURE__ */ new Set(["label", "text", "title", "name", "words"]);
function x(n) {
  return n.kind === "pipeline" ? "pipeline" : n.kind || n.experience || n.lanes.some((e) => e.station) ? null : "lanes";
}
const H = () => ({ version: 1, rev: 0, rules: [] });
function v(n) {
  return n.behaviour ?? H();
}
function g(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error(e);
  return n;
}
const B = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function I(n, e) {
  const i = g(n, "Unsupported behaviour version.");
  if (i.version !== 1) throw new Error("Unsupported behaviour version.");
  const r = x(e);
  if (!r) throw new Error("Only lane boards and pipelines take rules for now.");
  if (typeof i.rev != "number" || !Number.isInteger(i.rev) || i.rev < 0 || i.rev > 1e9) throw new Error("A rulebook needs a whole revision number.");
  if (!Array.isArray(i.rules)) throw new Error("A rulebook needs a list of rules.");
  if (i.rules.length > F) throw new Error("A board has up to 12 rules.");
  const t = (c) => {
    if (typeof c != "string" || !e.lanes.some((s) => s.id === c)) throw new Error("That rule names a lane that is no longer on the board.");
    return c;
  }, l = i.rules.map((c) => {
    const s = g(c, "A rule is an object.");
    if (typeof s.id != "string" || !B.test(s.id)) throw new Error("Rule IDs must be short alphanumeric slugs.");
    if (typeof s.on != "boolean") throw new Error("Say whether the rule is on.");
    if (s.severity !== "refuse" && s.severity !== "warn") throw new Error("A rule refuses or warns.");
    const a = g(s.set, "A rule says who set it.");
    if (typeof a.by != "string" || a.by.length > 80 || typeof a.at != "string" || a.at.length > 40 || !["chat", "exec", "preset"].includes(a.via)) throw new Error("A rule says who set it, when and how.");
    const f = { id: s.id, on: s.on, severity: s.severity, set: { by: a.by, at: a.at, via: a.via } }, p = (d) => {
      const h = Object.keys(s).find((m) => !["id", "on", "severity", "set", "kind", ...d].includes(m));
      if (h) throw new Error("A " + s.kind + " rule does not take " + h + ".");
    };
    switch (s.kind) {
      case "capacity": {
        if (p(["where", "max"]), typeof s.max != "number" || !Number.isInteger(s.max) || s.max < 1 || s.max > 24) throw new Error("A lane can hold from 1 to 24 cards.");
        return { ...f, kind: "capacity", where: t(s.where), max: s.max };
      }
      case "path": {
        p(["from", "to", "noSkip"]);
        const d = s.from === "any" ? "any" : t(s.from), h = { ...f, kind: "path", from: d };
        if (s.noSkip !== void 0) {
          if (s.noSkip !== !0) throw new Error("noSkip is true or left out.");
          h.noSkip = !0;
        }
        if (s.to !== void 0) {
          if (!Array.isArray(s.to) || s.to.length < 1 || s.to.length > 4) throw new Error("Say where cards in " + w(e, d) + " may go.");
          if (h.to = s.to.map(t), new Set(h.to).size !== h.to.length) throw new Error("Name each lane once.");
          if (h.to.includes(d)) throw new Error("A path leads to another lane.");
        }
        if (!h.to && !h.noSkip) throw new Error("Say where cards in " + w(e, d) + " may go.");
        if (d === "any" && h.to) throw new Error("A path from any lane is one lane at a time; name a lane to send cards somewhere.");
        return h;
      }
      case "gate": {
        if (p(["into", "needs"]), !Array.isArray(s.needs) || s.needs.length < 1 || s.needs.length > 3 || s.needs.some((y) => typeof y != "string"))
          throw new Error("Say which field the lane asks for.");
        const d = s.needs;
        if (d.some((y) => D.has(y))) throw new Error("A rule reads a card’s fields, never its words.");
        const h = $[r] ?? [], m = d.find((y) => !h.some((T) => T.id === y));
        if (m) throw new Error("Cards on this board carry no " + b(m).replace(/^an? /, "") + ", so a lane can’t ask for one.");
        return { ...f, kind: "gate", into: t(s.into), needs: [...d] };
      }
      case "bin":
        return p(["lane"]), { ...f, kind: "bin", lane: t(s.lane) };
    }
    throw new Error("This board does not know the rule " + String(s.kind) + ".");
  });
  if (new Set(l.map((c) => c.id)).size !== l.length) throw new Error("Duplicate rule ID.");
  const o = { version: 1, rev: i.rev, rules: l }, u = Q(o, e);
  if (u) throw new Error(u);
  return o;
}
function w(n, e) {
  return e === "any" ? "any lane" : n.lanes.find((i) => i.id === e)?.label ?? e;
}
function Q(n, e) {
  const i = new Set(n.rules.filter((t) => t.kind === "bin").map((t) => t.lane)), r = /* @__PURE__ */ new Map();
  for (const t of n.rules) {
    let l = "", o = "";
    if (t.kind === "capacity") {
      if (i.has(t.where)) return w(e, t.where) + " archives cards, so it takes every card.";
      if (t.where && e.lanes.find((u) => u.id === t.where)?.capacity !== void 0)
        return w(e, t.where) + " already has a limit. Change it instead.";
      l = "capacity:" + t.where, o = w(e, t.where) + " already has a limit. Change it instead.";
    } else if (t.kind === "path")
      l = "path:" + t.from, o = "There is already a rule for cards leaving " + w(e, t.from) + ". Change that one instead.";
    else if (t.kind === "gate") {
      if (i.has(t.into)) return w(e, t.into) + " archives cards, so it takes every card.";
      l = "gate:" + t.into, o = w(e, t.into) + " already asks for something. Change that rule instead.";
    } else
      l = "bin:" + t.lane, o = w(e, t.lane) + " already archives cards.";
    if (r.has(l)) return o;
    r.set(l, t.id);
  }
  return null;
}
function Z(n) {
  if (!x(n)) return [];
  const e = new Set(v(n).rules.filter((i) => i.kind === "capacity").map((i) => i.where));
  return n.lanes.filter((i) => i.capacity !== void 0 && !e.has(i.id)).map((i) => ({ lane: i, max: i.capacity }));
}
const E = {
  capacity: {
    sentence: (n, e) => w(e, n.where) + " holds " + n.max + ".",
    check(n, e, i, r) {
      const { where: t, max: l } = n;
      if (r.to !== t || r.from === t) return null;
      const o = e.cards.filter((c) => c.laneId === t).length, u = i.cards.filter((c) => c.laneId === t).length;
      return u > l && u > o ? { sentence: w(e, t) + " holds " + l + ". It has " + o + "." } : null;
    }
  },
  path: {
    sentence(n, e) {
      const { from: i, to: r, noSkip: t } = n;
      if (!r) return "Cards move one lane at a time.";
      const l = r.map((u) => w(e, u)), o = l.length > 1 ? l.slice(0, -1).join(", ") + " or " + l.at(-1) : l[0];
      return "From " + w(e, i) + ", cards go only to " + o + "." + (t ? " One lane at a time." : "");
    },
    check(n, e, i, r) {
      const { from: t, to: l, noSkip: o } = n;
      if (r.from === null || r.from === r.to || t !== "any" && t !== r.from) return null;
      if (l && !l.includes(r.to)) return { sentence: E.path.sentence(n, e) };
      if (o || !l) {
        const u = e.lanes.map((a) => a.id), c = u.indexOf(r.from), s = u.indexOf(r.to);
        if (Math.abs(s - c) > 1) {
          const a = e.lanes[c + Math.sign(s - c)];
          return { sentence: "Cards move one lane at a time. " + r.card.label + " is in " + w(e, r.from) + ", so " + a.label + " comes first." };
        }
      }
      return null;
    }
  },
  gate: {
    sentence: (n, e) => w(e, n.into) + " needs " + n.needs.map(b).join(" and ") + ".",
    check(n, e, i, r) {
      const { into: t, needs: l } = n;
      if (r.to !== t || r.from === t) return null;
      const o = l.find((u) => r.card[u] === void 0);
      return o ? { sentence: w(e, t) + " needs " + b(o) + ". " + r.card.label + " has none." } : null;
    }
  },
  bin: {
    sentence: (n, e) => w(e, n.lane) + " archives cards: they stay on the board, never deleted.",
    check: () => null
  }
}, P = ["path", "gate", "capacity", "bin"], U = (n) => P.flatMap((e) => n.filter((i) => i.kind === e));
function k(n, e) {
  const i = E[n.kind].sentence(n, e);
  return n.severity === "warn" ? i.replace(/\.$/, " (a warning only).") : i;
}
function V(n) {
  return n.kind === "pipeline" ? ["Deals move one stage at a time.", "A won deal needs an amount."] : [];
}
function O(n) {
  return x(n) ? [
    ...V(n),
    ...Z(n).map(({ lane: e, max: i }) => e.label + " holds " + i + "."),
    ...v(n).rules.filter((e) => e.on).map((e) => k(e, n))
  ] : [];
}
function C(n, e) {
  return v(n).rules.find((r) => r.on && r.kind === "capacity" && r.where === e)?.max ?? n.lanes.find((r) => r.id === e)?.capacity;
}
function S(n, e) {
  const i = U(v(e).rules.filter((o) => o.on)), r = [];
  if (!i.length) return { ok: !0, warnings: r };
  const t = new Set(i.filter((o) => o.kind === "bin").map((o) => o.lane)), l = new Map(n.cards.map((o) => [o.id, o.laneId]));
  for (const o of e.cards) {
    const u = l.get(o.id) ?? null;
    if (u === o.laneId || t.has(o.laneId)) continue;
    const c = { card: o, from: u, to: o.laneId };
    for (const s of i) {
      const a = E[s.kind].check(s, n, e, c);
      if (a) {
        if (s.severity === "warn") {
          r.push(a.sentence);
          continue;
        }
        return { refused: { sentence: a.sentence, ruleId: s.id, set: s.set, cardId: o.id, laneId: o.laneId } };
      }
    }
  }
  return { ok: !0, warnings: r };
}
function W(n, e) {
  const i = v(n), r = v(e), t = [], l = (u, c) => k(u, c) + (u.on ? "" : " (off)");
  for (const u of r.rules) {
    const c = i.rules.find((s) => s.id === u.id);
    c ? l(c, n) !== l(u, e) && t.push("~ " + l(c, n) + " → " + l(u, e)) : t.push("+ " + l(u, e));
  }
  for (const u of i.rules) r.rules.some((c) => c.id === u.id) || t.push("- " + l(u, n));
  const o = e.lanes.flatMap((u) => {
    const c = C(e, u.id), s = e.cards.filter((a) => a.laneId === u.id).length;
    return c !== void 0 && s > c ? [u.label + " shows " + s + " of " + c + "."] : [];
  });
  return { from: i.rev, to: r.rev, lines: t, over: o };
}
function K(n) {
  let e = 1;
  for (; n.rules.some((i) => i.id === "rule-" + e); ) e++;
  return "rule-" + e;
}
function Y(n, e) {
  const i = n.rules.flatMap((r) => {
    if (r.kind === "capacity" && r.where === e) return [];
    if (r.kind === "gate" && r.into === e) return [];
    if (r.kind === "bin" && r.lane === e) return [];
    if (r.kind === "path") {
      if (r.from === e) return [];
      if (r.to?.includes(e)) {
        const t = r.to.filter((l) => l !== e);
        return t.length ? [{ ...r, to: t }] : [];
      }
    }
    return [r];
  });
  return i.length === n.rules.length ? n : { ...n, rev: n.rev + 1, rules: i };
}
function q(n, e, i, r) {
  if (e.kind !== "add_rule" && e.kind !== "set_rule" && e.kind !== "remove_rule") return r.refuse("That is not a rule edit.", { code: "invalid_edit" });
  const t = v(n), l = (a, f) => {
    let p;
    try {
      p = I(a, n);
    } catch (d) {
      return r.refuse(d instanceof Error ? d.message : String(d));
    }
    return r.done({ ...n, behaviour: p }, f);
  }, o = (a) => t.rules.find((f) => f.id === a) ?? r.refuse("There is no rule " + j(a) + " on this board.", { code: "unknown_reference" }), u = (a) => a === "any" ? "any" : typeof a != "string" && !(a && typeof a == "object") ? r.refuse("Name the lane the rule is about.", { code: "invalid_edit" }) : r.lane(a).id;
  if (e.kind === "remove_rule") {
    const a = o(e.rule);
    return l({ ...t, rev: t.rev + 1, rules: t.rules.filter((f) => f !== a) }, "Removed the rule: " + k(a, n));
  }
  if (e.kind === "set_rule") {
    const a = { ...o(e.rule), set: i };
    if (e.on !== void 0 && (a.on = e.on), e.severity !== void 0 && (a.severity = e.severity), e.max !== void 0) {
      if (a.kind !== "capacity") return r.refuse("Only a lane limit takes a number.");
      a.max = e.max;
    }
    if (e.to !== void 0) {
      if (a.kind !== "path") return r.refuse("Only a path rule says where cards go.");
      a.to = e.to.map(u);
    }
    return l(
      { ...t, rev: t.rev + 1, rules: t.rules.map((f) => f.id === a.id ? a : f) },
      a.on ? "The rule now says: " + k(a, n) : "Turned off: " + k(a, n)
    );
  }
  const c = e.rule, s = { id: K(t), kind: c.kind, on: !0, severity: c.severity ?? "refuse", set: i };
  for (const [a, f] of Object.entries(c))
    a === "kind" || a === "severity" || (s[a] = a === "where" || a === "into" || a === "lane" || a === "from" ? u(f) : a === "to" && Array.isArray(f) ? f.map(u) : f);
  return z.includes(c.kind) ? l({ ...t, rev: t.rev + 1, rules: [...t.rules, s] }, "New rule: " + k(s, n)) : r.refuse("This board does not know the rule " + String(c.kind) + ".", { code: "invalid_edit" });
}
function G(n, e, i) {
  const r = _(n), t = L(r), l = (d, h, m) => typeof m == "object" ? d.find((y) => y.id === m.id) : d.find((y) => y.id === m) ?? h.attempt(m), o = l(r.cards, t.cards, e), u = l(r.lanes, t.lanes, i);
  if (!o || !u) return { refused: { sentence: o ? "There is no such lane on this board." : "There is no such card on this board.", ruleId: null, nearest: null } };
  const c = r.lanes.map((d) => d.id), s = () => r.lanes.filter((d) => d.id !== o.laneId && d.id !== u.id && A(r, o.id, d.id)).sort((d, h) => Math.abs(c.indexOf(d.id) - c.indexOf(u.id)) - Math.abs(c.indexOf(h.id) - c.indexOf(u.id)))[0]?.label ?? null, a = A(r, o.id, u.id);
  if (a) {
    const d = a === r || !r.behaviour ? null : S(r, a);
    return { ok: !0, warnings: d && "ok" in d ? d.warnings : [] };
  }
  const f = R(r, o.id, u.id) ?? "That move is not available.", p = v(r).rules.find((d) => d.on && f === J(r, o.id, u.id, d));
  return { refused: { sentence: f, ruleId: p?.id ?? null, nearest: s(), ...p && { set: p.set } } };
}
function J(n, e, i, r) {
  const t = { ...n, behaviour: { ...v(n), rules: [r] } }, l = S(t, { ...t, cards: t.cards.map((o) => o.id === e ? { ...o, laneId: i } : o) });
  return "refused" in l ? l.refused.sentence : null;
}
function X(n, e, i = {}) {
  if (!n.behaviour) return null;
  const r = O(n), t = ["How this board behaves", ...r.length ? r : ["No rules yet. Say “Let a lane hold 2”."]].join(`
`), l = Math.max(12, (i.fontSize ?? M.fontSize) - 2), o = Math.max(12, Math.floor((e.width - 24) / (l * 0.55))), u = t.split(`
`).reduce((s, a) => s + Math.max(1, Math.ceil(a.length / o)), 0), c = Math.round(u * l * 1.4 + 24);
  return { options: {
    id: "rules-board",
    name: "How this board behaves",
    text: t,
    xPos: e.x,
    yPos: e.y,
    width: e.width,
    height: c,
    shapeHint: "rectangle",
    vectorPath: ee(e.width, c, i.cornerRadius ?? 0),
    backgroundColor: "#f4f1e8",
    foregroundColor: i.textColor ?? M.fontColor,
    borderColor: "#b8b2a0",
    borderWidth: 1,
    borderStyle: "dashed",
    fontSize: l,
    ...i.fontFamily ? { fontFamily: i.fontFamily } : {}
  }, relationships: { associations: [] } };
}
const ee = (n, e, i) => {
  const r = Math.max(0, Math.min(i, n / 2, e / 2));
  return r ? `M ${r} 0 H ${n - r} Q ${n} 0 ${n} ${r} V ${e - r} Q ${n} ${e} ${n - r} ${e} H ${r} Q 0 ${e} 0 ${e - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${n} V ${e} H 0 Z`;
};
function ne(n, e, i, r) {
  const t = n.behaviour?.rules.find((o) => o.kind === "capacity" && o.where === e);
  if (!t) return null;
  if (i !== null && (!Number.isInteger(i) || i < 1 || i > 24)) return "A lane can hold from 1 to 24 cards.";
  const l = i === null ? n.behaviour.rules.filter((o) => o !== t) : n.behaviour.rules.map((o) => o === t ? { ...o, max: i, on: !0, set: r } : o);
  return { ...n, behaviour: { ...n.behaviour, rev: n.behaviour.rev + 1, rules: l } };
}
N({
  move: G,
  diff: W,
  note: X,
  setLimit: ne,
  validate: I,
  check: S,
  laneLimit: C,
  lines: O,
  dropLane: Y,
  edit: q
});
export {
  q as applyRuleEdit,
  Q as behaviourContradiction,
  W as behaviourDiff,
  x as behaviourFamily,
  C as behaviourLaneLimit,
  O as behaviourLines,
  v as behaviourOf,
  S as checkBehaviour,
  G as checkWorkshopMove,
  Y as dropLaneRules,
  H as emptyBehaviour,
  F as maxBehaviourRules,
  K as nextRuleId,
  z as ruleKindIds,
  k as ruleSentence,
  ne as setRuledLimit,
  I as validateBehaviour
};
