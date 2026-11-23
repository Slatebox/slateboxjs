import { w as N, v as z, a as F, b as O, c as D, d as B, e as C, s as H, r as P, f as U } from "./model-DSiU3YcW.mjs";
import { D as M } from "./NoteDefaults-1xFW0br8.mjs";
const ce = ["capacity", "path", "gate", "bin"], W = 12, T = { pipeline: [{ id: "amount", noun: "an amount" }] }, A = (n) => Object.values(T).flat().find((e) => e.id === n)?.noun ?? n, K = /* @__PURE__ */ new Set(["label", "text", "title", "name", "words"]), v = (n) => B(n.kind) ? N(n.kind).rulebook : void 0;
function I(n) {
  return n.kind === "pipeline" ? "pipeline" : v(n) ? "time" : n.kind || n.experience || n.lanes.some((e) => e.station) ? null : "lanes";
}
const Z = () => ({ version: 1, rev: 0, rules: [] });
function y(n) {
  return n.behaviour ?? Z();
}
function E(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error(e);
  return n;
}
const $ = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function L(n, e) {
  const s = E(n, "Unsupported behaviour version.");
  if (s.version !== 1) throw new Error("Unsupported behaviour version.");
  const t = I(e);
  if (!t) throw new Error("Only lane boards and pipelines take rules for now.");
  if (typeof s.rev != "number" || !Number.isInteger(s.rev) || s.rev < 0 || s.rev > 1e9) throw new Error("A rulebook needs a whole revision number.");
  if (!Array.isArray(s.rules)) throw new Error("A rulebook needs a list of rules.");
  if (s.rules.length > W) throw new Error("A board has up to 12 rules.");
  const o = (a) => {
    if (typeof a != "string" || !e.lanes.some((i) => i.id === a)) throw new Error("That rule names a lane that is no longer on the board.");
    return a;
  }, l = s.rules.map((a) => {
    const i = E(a, "A rule is an object.");
    if (typeof i.id != "string" || !$.test(i.id)) throw new Error("Rule IDs must be short alphanumeric slugs.");
    if (typeof i.on != "boolean") throw new Error("Say whether the rule is on.");
    if (i.severity !== "refuse" && i.severity !== "warn") throw new Error("A rule refuses or warns.");
    const f = E(i.set, "A rule says who set it.");
    if (typeof f.by != "string" || f.by.length > 80 || typeof f.at != "string" || f.at.length > 40 || !["chat", "exec", "preset"].includes(f.via)) throw new Error("A rule says who set it, when and how.");
    const m = { id: i.id, on: i.on, severity: i.severity, set: { by: f.by, at: f.at, via: f.via } }, c = v(e);
    if (c) {
      if (c.keys[i.kind] === void 0) throw new Error("This board does not know the rule " + String(i.kind) + ".");
      return c.read(i, m, e, o);
    }
    const d = (w) => {
      const h = Object.keys(i).find((k) => !["id", "on", "severity", "set", "kind", ...w].includes(k));
      if (h) throw new Error("A " + i.kind + " rule does not take " + h + ".");
    };
    switch (i.kind) {
      case "capacity": {
        if (d(["where", "max"]), typeof i.max != "number" || !Number.isInteger(i.max) || i.max < 1 || i.max > 24) throw new Error("A lane can hold from 1 to 24 cards.");
        return { ...m, kind: "capacity", where: o(i.where), max: i.max };
      }
      case "path": {
        d(["from", "to", "noSkip"]);
        const w = i.from === "any" ? "any" : o(i.from), h = { ...m, kind: "path", from: w };
        if (i.noSkip !== void 0) {
          if (i.noSkip !== !0) throw new Error("noSkip is true or left out.");
          h.noSkip = !0;
        }
        if (i.to !== void 0) {
          if (!Array.isArray(i.to) || i.to.length < 1 || i.to.length > 4) throw new Error("Say where cards in " + p(e, w) + " may go.");
          if (h.to = i.to.map(o), new Set(h.to).size !== h.to.length) throw new Error("Name each lane once.");
          if (h.to.includes(w)) throw new Error("A path leads to another lane.");
        }
        if (!h.to && !h.noSkip) throw new Error("Say where cards in " + p(e, w) + " may go.");
        if (w === "any" && h.to) throw new Error("A path from any lane is one lane at a time; name a lane to send cards somewhere.");
        return h;
      }
      case "gate": {
        if (d(["into", "needs"]), !Array.isArray(i.needs) || i.needs.length < 1 || i.needs.length > 3 || i.needs.some((x) => typeof x != "string"))
          throw new Error("Say which field the lane asks for.");
        const w = i.needs;
        if (w.some((x) => K.has(x))) throw new Error("A rule reads a card’s fields, never its words.");
        const h = T[t] ?? [], k = w.find((x) => !h.some((j) => j.id === x));
        if (k) throw new Error("Cards on this board carry no " + A(k).replace(/^an? /, "") + ", so a lane can’t ask for one.");
        return { ...m, kind: "gate", into: o(i.into), needs: [...w] };
      }
      case "bin":
        return d(["lane"]), { ...m, kind: "bin", lane: o(i.lane) };
    }
    throw new Error("This board does not know the rule " + String(i.kind) + ".");
  });
  if (new Set(l.map((a) => a.id)).size !== l.length) throw new Error("Duplicate rule ID.");
  const u = { version: 1, rev: s.rev, rules: l }, r = J(u, e);
  if (r) throw new Error(r);
  return u;
}
function p(n, e) {
  return e === "any" ? "any lane" : n.lanes.find((s) => s.id === e)?.label ?? e;
}
function J(n, e) {
  const s = v(e);
  if (s) return s.contradiction(n, e);
  const t = new Set(n.rules.filter((r) => r.kind === "bin").map((r) => r.lane)), o = /* @__PURE__ */ new Map();
  for (const r of n.rules) {
    let a = "", i = "";
    if (r.kind === "capacity") {
      if (t.has(r.where)) return p(e, r.where) + " archives cards, so it takes every card.";
      if (r.where && e.lanes.find((f) => f.id === r.where)?.capacity !== void 0)
        return p(e, r.where) + " already has a limit. Change it instead.";
      a = "capacity:" + r.where, i = p(e, r.where) + " already has a limit. Change it instead.";
    } else if (r.kind === "path")
      a = "path:" + r.from, i = "There is already a rule for cards leaving " + p(e, r.from) + ". Change that one instead.";
    else if (r.kind === "gate") {
      if (t.has(r.into)) return p(e, r.into) + " archives cards, so it takes every card.";
      a = "gate:" + r.into, i = p(e, r.into) + " already asks for something. Change that rule instead.";
    } else {
      const f = r.lane;
      a = "bin:" + f, i = p(e, f) + " already archives cards.";
    }
    if (o.has(a)) return i;
    o.set(a, r.id);
  }
  const l = n.rules.filter((r) => r.on && r.severity === "refuse"), u = e.lanes.map((r) => r.id);
  for (const r of l) if (r.kind === "path") {
    for (const a of r.to ?? [])
      if (Math.abs(u.indexOf(a) - u.indexOf(r.from)) > 1 && !l.some((i) => i.kind === "bin" && i.lane === a) && l.some((i) => i.kind === "path" && (i.from === "any" || i.from === r.from) && (i.noSkip || !i.to)))
        return "Cards move one lane at a time, so cards in " + p(e, r.from) + " could never reach " + p(e, a) + ".";
  }
  return null;
}
function Y(n) {
  if (!I(n)) return [];
  const e = new Set(y(n).rules.filter((s) => s.kind === "capacity").map((s) => s.where));
  return n.lanes.filter((s) => s.capacity !== void 0 && !e.has(s.id)).map((s) => ({ lane: s, max: s.capacity }));
}
const b = {
  capacity: {
    sentence: (n, e) => p(e, n.where) + " holds " + n.max + ".",
    check(n, e, s, t) {
      const { where: o, max: l } = n;
      if (t.to !== o || t.from === o) return null;
      const u = C(e, o), r = C(s, o);
      return r > l && r > u ? { sentence: p(e, o) + " holds " + l + ". It has " + u + "." } : null;
    }
  },
  path: {
    sentence(n, e) {
      const { from: s, to: t, noSkip: o } = n;
      if (!t) return "Cards move one lane at a time.";
      const l = t.map((r) => p(e, r)), u = l.length > 1 ? l.slice(0, -1).join(", ") + " or " + l.at(-1) : l[0];
      return "From " + p(e, s) + ", cards go only to " + u + "." + (o ? " One lane at a time." : "");
    },
    check(n, e, s, t) {
      const { from: o, to: l, noSkip: u } = n;
      if (t.from === null || t.from === t.to || o !== "any" && o !== t.from) return null;
      if (l && !l.includes(t.to)) return { sentence: b.path.sentence(n, e) };
      if (u || !l) {
        const r = e.lanes.map((f) => f.id), a = r.indexOf(t.from), i = r.indexOf(t.to);
        if (Math.abs(i - a) > 1) {
          const f = e.lanes[a + Math.sign(i - a)];
          return { sentence: "Cards move one lane at a time. " + t.card.label + " is in " + p(e, t.from) + ", so " + f.label + " comes first." };
        }
      }
      return null;
    }
  },
  gate: {
    sentence: (n, e) => p(e, n.into) + " needs " + n.needs.map(A).join(" and ") + ".",
    check(n, e, s, t) {
      const { into: o, needs: l } = n;
      if (t.to !== o || t.from === o) return null;
      const u = l.find((r) => t.card[r] === void 0);
      return u ? { sentence: p(e, o) + " needs " + A(u) + ". " + t.card.label + " has none." } : null;
    }
  },
  bin: {
    sentence: (n, e) => p(e, n.lane) + " archives cards: they stay on the board, never deleted.",
    check: () => null
  }
}, q = ["path", "gate", "capacity", "bin"], G = (n) => q.flatMap((e) => n.filter((s) => s.kind === e));
function g(n, e) {
  const s = v(e);
  if (s) return s.sentence(n, e);
  const t = b[n.kind].sentence(n, e);
  return n.severity === "warn" ? t.replace(/\.$/, " (a warning only).") : t;
}
function Q(n) {
  return v(n)?.builtIn(n) ?? (n.kind === "pipeline" ? ["Deals move one stage at a time.", "A won deal needs an amount."] : []);
}
function R(n) {
  return I(n) ? [
    ...Q(n),
    ...Y(n).map(({ lane: e, max: s }) => e.label + " holds " + s + "."),
    ...y(n).rules.filter((e) => e.on).map((e) => g(e, n))
  ] : [];
}
function _(n, e) {
  return y(n).rules.find((t) => t.on && t.kind === "capacity" && t.where === e)?.max ?? n.lanes.find((t) => t.id === e)?.capacity;
}
function S(n, e) {
  const s = v(n);
  if (s) return s.check(n, e);
  const t = G(y(n).rules.filter((r) => r.on)), o = [];
  if (!t.length) return { ok: !0, warnings: o };
  const l = (r) => t.find((a) => a.kind === "bin" && a.lane === r);
  for (const r of n.cards) {
    const a = l(r.laneId);
    if (!a || e.cards.some((f) => f.id === r.id)) continue;
    const i = b.bin.sentence(a, n);
    if (a.severity === "refuse") return { refused: { sentence: i, ruleId: a.id, set: a.set, cardId: r.id, laneId: r.laneId } };
    o.push(i);
  }
  const u = new Map(n.cards.map((r) => [r.id, r.laneId]));
  for (const r of e.cards) {
    const a = u.get(r.id) ?? null;
    if (a === r.laneId || l(r.laneId)) continue;
    const i = { card: r, from: a, to: r.laneId };
    for (const f of t) {
      const m = b[f.kind].check(f, n, e, i);
      if (m) {
        if (f.severity === "warn") {
          o.push(m.sentence);
          continue;
        }
        return { refused: { sentence: m.sentence, ruleId: f.id, set: f.set, cardId: r.id, laneId: r.laneId } };
      }
    }
  }
  return { ok: !0, warnings: o };
}
function V(n, e) {
  const s = y(n), t = y(e), o = [], l = (r, a) => g(r, a) + (r.on ? "" : " (off)");
  for (const r of t.rules) {
    const a = s.rules.find((i) => i.id === r.id);
    a ? l(a, n) !== l(r, e) && o.push("~ " + l(a, n) + " → " + l(r, e)) : o.push("+ " + l(r, e));
  }
  for (const r of s.rules) t.rules.some((a) => a.id === r.id) || o.push("- " + l(r, n));
  const u = e.lanes.flatMap((r) => {
    const a = _(e, r.id), i = e.cards.filter((f) => f.laneId === r.id).length;
    return a !== void 0 && i > a ? [r.label + " shows " + i + " of " + a + "."] : [];
  });
  return { from: s.rev, to: t.rev, lines: o, over: u };
}
const X = { capacity: "where max", path: "from to noSkip", gate: "into needs", bin: "lane" };
function ee(n) {
  let e = 1;
  for (; n.rules.some((s) => s.id === "rule-" + e); ) e++;
  return "rule-" + e;
}
function ne(n, e) {
  const s = n.rules.flatMap((t) => {
    if (t.kind === "capacity" && t.where === e) return [];
    if (t.kind === "gate" && t.into === e) return [];
    if (t.kind === "bin" && t.lane === e) return [];
    if (t.kind === "path") {
      if (t.from === e) return [];
      if (t.to?.includes(e)) {
        const o = t.to.filter((l) => l !== e);
        return o.length ? [{ ...t, to: o }] : [];
      }
    }
    return [t];
  });
  return s.length === n.rules.length ? n : { ...n, rev: n.rev + 1, rules: s };
}
function re(n, e, s, t) {
  if (e.kind !== "add_rule" && e.kind !== "set_rule" && e.kind !== "remove_rule") return t.refuse("That is not a rule edit.", { code: "invalid_edit" });
  const o = y(n), l = (c, d) => {
    let w;
    try {
      w = L(c, n);
    } catch (h) {
      return t.refuse(h instanceof Error ? h.message : String(h));
    }
    return t.done({ ...n, behaviour: w }, d);
  }, u = (c) => o.rules.find((d) => d.id === c) ?? t.refuse("There is no rule " + H(c) + " on this board.", { code: "unknown_reference" }), r = (c) => c === "any" ? "any" : typeof c != "string" && !(c && typeof c == "object") ? t.refuse("Name the lane the rule is about.", { code: "invalid_edit" }) : t.lane(c).id;
  if (e.kind === "remove_rule") {
    const c = u(e.rule);
    return l({ ...o, rev: o.rev + 1, rules: o.rules.filter((d) => d !== c) }, "Removed the rule: " + g(c, n));
  }
  if (e.kind === "set_rule") {
    const c = { ...u(e.rule), set: s };
    if (e.on !== void 0 && (c.on = e.on), e.severity !== void 0 && (c.severity = e.severity), e.max !== void 0) {
      if (!("max" in c)) return t.refuse("Only a limit takes a number.");
      c.max = e.max;
    }
    if (e.to !== void 0) {
      if (c.kind !== "path") return t.refuse("Only a path rule says where cards go.");
      c.to = e.to.map(r);
    }
    for (const d of ["floor", "onConflict", "unit", "under", "by", "drop", "mode"]) if (e[d] !== void 0) {
      if (!(d in c)) return t.refuse("That rule does not take " + d + ".");
      c[d] = e[d];
    }
    return l(
      { ...o, rev: o.rev + 1, rules: o.rules.map((d) => d.id === c.id ? c : d) },
      c.on ? "The rule now says: " + g(c, n) : "Turned off: " + g(c, n)
    );
  }
  const a = e.rule, i = v(n)?.keys ?? X;
  if (i[a.kind] === void 0) return t.refuse("This board does not know the rule " + String(a.kind) + ".", { code: "invalid_edit" });
  const f = Object.keys(a).find((c) => !("kind severity " + i[a.kind]).split(" ").includes(c));
  if (f) return t.refuse("A " + String(a.kind) + " rule does not take " + f + ".", { code: "invalid_edit" });
  const m = { id: ee(o), kind: a.kind, on: !0, severity: a.severity ?? "refuse", set: s };
  for (const [c, d] of Object.entries(a))
    c === "kind" || c === "severity" || (m[c] = c === "where" || c === "into" || c === "lane" || c === "from" ? r(d) : c === "to" && Array.isArray(d) ? d.map(r) : c === "cards" && Array.isArray(d) ? d.map((w) => t.card(w).id) : d);
  return l({ ...o, rev: o.rev + 1, rules: [...o.rules, m] }, "New rule: " + g(m, n));
}
function te(n, e, s) {
  const t = z(n), o = F(t), l = (d, w, h) => typeof h == "object" ? d.find((k) => k.id === h.id) : d.find((k) => k.id === h) ?? w.attempt(h), u = l(t.cards, o.cards, e), r = l(t.lanes, o.lanes, s);
  if (!u || !r) return { refused: { sentence: u ? "There is no such lane on this board." : "There is no such card on this board.", ruleId: null, nearest: null } };
  const a = t.lanes.map((d) => d.id), i = () => t.lanes.filter((d) => d.id !== u.laneId && d.id !== r.id && O(t, u.id, d.id)).sort((d, w) => Math.abs(a.indexOf(d.id) - a.indexOf(r.id)) - Math.abs(a.indexOf(w.id) - a.indexOf(r.id)))[0]?.label ?? null, f = O(t, u.id, r.id);
  if (f) {
    const d = f === t || !t.behaviour ? null : S(t, f);
    return { ok: !0, warnings: d && "ok" in d ? d.warnings : [] };
  }
  const m = D(t, u.id, r.id) ?? "That move is not available.", c = y(t).rules.find((d) => d.on && m === ie(t, u.id, r.id, d));
  return { refused: { sentence: m, ruleId: c?.id ?? null, nearest: i(), ...c && { set: c.set } } };
}
function ie(n, e, s, t) {
  const o = { ...n, behaviour: { ...y(n), rules: [t] } }, l = S(o, { ...o, cards: o.cards.map((u) => u.id === e ? { ...u, laneId: s } : u) });
  return "refused" in l ? l.refused.sentence : null;
}
function se(n, e, s = {}) {
  if (!n.behaviour) return null;
  const t = R(n), o = ["How this board behaves", ...t.length ? t : ["No rules yet. Say “Let a lane hold 2”."]].join(`
`), l = Math.max(12, (s.fontSize ?? M.fontSize) - 2), u = Math.max(12, Math.floor((e.width - 24) / (l * 0.55))), r = o.split(`
`).reduce((i, f) => i + Math.max(1, Math.ceil(f.length / u)), 0), a = Math.round(r * l * 1.4 + 24);
  return { options: {
    id: "rules-board",
    name: "How this board behaves",
    text: o,
    xPos: e.x,
    yPos: e.y,
    width: e.width,
    height: a,
    shapeHint: "rectangle",
    vectorPath: U(e.width, a, s.cornerRadius ?? 0),
    backgroundColor: "#f4f1e8",
    foregroundColor: s.textColor ?? M.fontColor,
    borderColor: "#b8b2a0",
    borderWidth: 1,
    borderStyle: "dashed",
    fontSize: l,
    ...s.fontFamily ? { fontFamily: s.fontFamily } : {}
  }, relationships: { associations: [] } };
}
function oe(n, e, s, t) {
  const o = n.behaviour?.rules.find((u) => u.kind === "capacity" && u.where === e);
  if (!o) return null;
  if (s !== null && (!Number.isInteger(s) || s < 1 || s > 24)) return "A lane can hold from 1 to 24 cards.";
  const l = s === null ? n.behaviour.rules.filter((u) => u !== o) : n.behaviour.rules.map((u) => u === o ? { ...u, max: s, on: !0, set: t } : u);
  return { ...n, behaviour: { ...n.behaviour, rev: n.behaviour.rev + 1, rules: l } };
}
function ae(n, e) {
  const s = y(n), t = y(e), o = JSON.stringify, l = (r) => o(r.cards.map((a) => [a.id, a.laneId]));
  if (o(s.rules) !== o(t.rules)) {
    if (t.rev <= s.rev) return "The rules changed. Save them with a new revision.";
    if (l(n) !== l(e)) return "Change the rules on their own, then move cards.";
  }
  const u = n.behaviour ? S(n, e) : null;
  return u && "refused" in u ? u.refused.sentence : null;
}
P({
  replacement: ae,
  move: te,
  diff: V,
  note: se,
  setLimit: oe,
  validate: L,
  check: S,
  laneLimit: _,
  lines: R,
  dropLane: ne,
  edit: re
});
export {
  re as applyRuleEdit,
  J as behaviourContradiction,
  V as behaviourDiff,
  I as behaviourFamily,
  _ as behaviourLaneLimit,
  R as behaviourLines,
  y as behaviourOf,
  S as checkBehaviour,
  te as checkWorkshopMove,
  ne as dropLaneRules,
  Z as emptyBehaviour,
  W as maxBehaviourRules,
  ee as nextRuleId,
  ce as ruleKindIds,
  g as ruleSentence,
  oe as setRuledLimit,
  L as validateBehaviour
};
