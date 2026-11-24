import { workshopRules as N, validateWorkshop as z, workshopReferences as F, workshopCandidate as O, workshopRefusal as D, workshopHardLimit as B, workshopRulesLoaded as H, workshopLaneHeld as M, said as P, registerRulebook as U, roundedBox as W } from "./workshop-model.mjs";
import { D as C } from "./NoteDefaults-1xFW0br8.mjs";
const de = ["capacity", "path", "gate", "bin"], K = 12, T = { pipeline: [{ id: "amount", noun: "an amount" }] }, A = (n) => Object.values(T).flat().find((e) => e.id === n)?.noun ?? n, Z = /* @__PURE__ */ new Set(["label", "text", "title", "name", "words"]), g = (n) => H(n.kind) ? N(n.kind).rulebook : void 0;
function I(n) {
  return n.kind === "pipeline" ? "pipeline" : g(n) ? "time" : n.kind || n.experience || n.lanes.some((e) => e.station) ? null : "lanes";
}
const $ = () => ({ version: 1, rev: 0, rules: [] });
function y(n) {
  return n.behaviour ?? $();
}
function E(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error(e);
  return n;
}
const J = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function L(n, e) {
  const s = E(n, "Unsupported behaviour version.");
  if (s.version !== 1) throw new Error("Unsupported behaviour version.");
  const r = I(e);
  if (!r) throw new Error("Only boards of columns and pipelines take rules for now.");
  if (typeof s.rev != "number" || !Number.isInteger(s.rev) || s.rev < 0 || s.rev > 1e9) throw new Error("A rulebook needs a whole revision number.");
  if (!Array.isArray(s.rules)) throw new Error("A rulebook needs a list of rules.");
  if (s.rules.length > K) throw new Error("A board has up to 12 rules.");
  const a = (i) => {
    if (typeof i != "string" || !e.lanes.some((t) => t.id === i)) throw new Error("That rule names a column that is no longer on the board.");
    return i;
  }, l = s.rules.map((i) => {
    const t = E(i, "A rule is an object.");
    if (typeof t.id != "string" || !J.test(t.id)) throw new Error("Rule IDs must be short alphanumeric slugs.");
    if (typeof t.on != "boolean") throw new Error("Say whether the rule is on.");
    if (t.severity !== "refuse" && t.severity !== "warn") throw new Error("A rule refuses or warns.");
    const f = E(t.set, "A rule says who set it.");
    if (typeof f.by != "string" || f.by.length > 80 || typeof f.at != "string" || f.at.length > 40 || !["chat", "exec", "preset"].includes(f.via)) throw new Error("A rule says who set it, when and how.");
    const p = { id: t.id, on: t.on, severity: t.severity, set: { by: f.by, at: f.at, via: f.via } }, u = g(e);
    if (u) {
      if (u.keys[t.kind] === void 0) throw new Error("This board does not know the rule " + String(t.kind) + ".");
      return u.read(t, p, e, a);
    }
    const h = (d) => {
      const m = Object.keys(t).find((k) => !["id", "on", "severity", "set", "kind", ...d].includes(k));
      if (m) throw new Error("A " + t.kind + " rule does not take " + m + ".");
    };
    switch (t.kind) {
      case "capacity": {
        if (h(["where", "max"]), typeof t.max != "number" || !Number.isInteger(t.max) || t.max < 1 || t.max > 24) throw new Error("A column can hold from 1 to 24 cards.");
        return { ...p, kind: "capacity", where: a(t.where), max: t.max };
      }
      case "path": {
        h(["from", "to", "noSkip"]);
        const d = t.from === "any" ? "any" : a(t.from), m = { ...p, kind: "path", from: d };
        if (t.noSkip !== void 0) {
          if (t.noSkip !== !0) throw new Error("noSkip is true or left out.");
          m.noSkip = !0;
        }
        if (t.to !== void 0) {
          if (!Array.isArray(t.to) || t.to.length < 1 || t.to.length > 4) throw new Error("Say where cards in " + w(e, d) + " may go.");
          if (m.to = t.to.map(a), new Set(m.to).size !== m.to.length) throw new Error("Name each column once.");
          if (m.to.includes(d)) throw new Error("A path leads to another column.");
        }
        if (!m.to && !m.noSkip) throw new Error("Say where cards in " + w(e, d) + " may go.");
        if (d === "any" && m.to) throw new Error("A path from any column is one column at a time; name a column to send cards somewhere.");
        return m;
      }
      case "gate": {
        if (h(["into", "needs"]), !Array.isArray(t.needs) || t.needs.length < 1 || t.needs.length > 3 || t.needs.some((v) => typeof v != "string"))
          throw new Error("Say which field the column asks for.");
        const d = t.needs;
        if (d.some((v) => Z.has(v))) throw new Error("A rule reads a card’s fields, never its words.");
        const m = T[r] ?? [], k = d.find((v) => !m.some((j) => j.id === v));
        if (k) throw new Error("Cards on this board carry no " + A(k).replace(/^an? /, "") + ", so a column can’t ask for one.");
        return { ...p, kind: "gate", into: a(t.into), needs: [...d] };
      }
      case "bin":
        return h(["lane"]), { ...p, kind: "bin", lane: a(t.lane) };
    }
    throw new Error("This board does not know the rule " + String(t.kind) + ".");
  });
  if (new Set(l.map((i) => i.id)).size !== l.length) throw new Error("Duplicate rule ID.");
  const c = { version: 1, rev: s.rev, rules: l }, o = Y(c, e);
  if (o) throw new Error(o);
  return c;
}
function w(n, e) {
  return e === "any" ? "any column" : n.lanes.find((s) => s.id === e)?.label ?? e;
}
function Y(n, e) {
  const s = g(e);
  if (s) return s.contradiction(n, e);
  const r = new Set(n.rules.filter((o) => o.kind === "bin").map((o) => o.lane)), a = /* @__PURE__ */ new Map();
  for (const o of n.rules) {
    let i = "", t = "";
    if (o.kind === "capacity") {
      if (r.has(o.where)) return w(e, o.where) + " archives cards, so it takes every card.";
      if (o.where && e.lanes.find((f) => f.id === o.where)?.capacity !== void 0)
        return w(e, o.where) + " already has a limit. Change it instead.";
      i = "capacity:" + o.where, t = w(e, o.where) + " already has a limit. Change it instead.";
    } else if (o.kind === "path")
      i = "path:" + o.from, t = "There is already a rule for cards leaving " + w(e, o.from) + ". Change that one instead.";
    else if (o.kind === "gate") {
      if (r.has(o.into)) return w(e, o.into) + " archives cards, so it takes every card.";
      i = "gate:" + o.into, t = w(e, o.into) + " already asks for something. Change that rule instead.";
    } else {
      const f = o.lane;
      i = "bin:" + f, t = w(e, f) + " already archives cards.";
    }
    if (a.has(i)) return t;
    a.set(i, o.id);
  }
  const l = n.rules.filter((o) => o.on && o.severity === "refuse"), c = e.lanes.map((o) => o.id);
  for (const o of l) if (o.kind === "path") {
    for (const i of o.to ?? [])
      if (Math.abs(c.indexOf(i) - c.indexOf(o.from)) > 1 && !l.some((t) => t.kind === "bin" && t.lane === i) && l.some((t) => t.kind === "path" && (t.from === "any" || t.from === o.from) && (t.noSkip || !t.to)))
        return "Cards move one column at a time, so cards in " + w(e, o.from) + " could never reach " + w(e, i) + ".";
  }
  return null;
}
function q(n) {
  if (!I(n)) return [];
  const e = new Set(y(n).rules.filter((s) => s.kind === "capacity").map((s) => s.where));
  return n.lanes.filter((s) => s.capacity !== void 0 && !e.has(s.id)).map((s) => ({ lane: s, max: s.capacity }));
}
const b = {
  capacity: {
    sentence: (n, e) => w(e, n.where) + " holds " + n.max + ".",
    check(n, e, s, r) {
      const { where: a, max: l } = n;
      if (r.to !== a || r.from === a) return null;
      const c = M(e, a), o = M(s, a);
      return o > l && o > c ? { sentence: w(e, a) + " holds " + l + ". It has " + c + "." } : null;
    }
  },
  path: {
    sentence(n, e) {
      const { from: s, to: r, noSkip: a } = n;
      if (!r) return "Cards move one column at a time.";
      const l = r.map((o) => w(e, o)), c = l.length > 1 ? l.slice(0, -1).join(", ") + " or " + l.at(-1) : l[0];
      return "From " + w(e, s) + ", cards go only to " + c + "." + (a ? " One column at a time." : "");
    },
    check(n, e, s, r) {
      const { from: a, to: l, noSkip: c } = n;
      if (r.from === null || r.from === r.to || a !== "any" && a !== r.from) return null;
      if (l && !l.includes(r.to)) return { sentence: b.path.sentence(n, e) };
      if (c || !l) {
        const o = e.lanes.map((f) => f.id), i = o.indexOf(r.from), t = o.indexOf(r.to);
        if (Math.abs(t - i) > 1) {
          const f = e.lanes[i + Math.sign(t - i)];
          return { sentence: "Cards move one column at a time. " + r.card.label + " is in " + w(e, r.from) + ", so " + f.label + " comes first." };
        }
      }
      return null;
    }
  },
  gate: {
    sentence: (n, e) => w(e, n.into) + " needs " + n.needs.map(A).join(" and ") + ".",
    check(n, e, s, r) {
      const { into: a, needs: l } = n;
      if (r.to !== a || r.from === a) return null;
      const c = l.find((o) => r.card[o] === void 0);
      return c ? { sentence: w(e, a) + " needs " + A(c) + ". " + r.card.label + " has none." } : null;
    }
  },
  bin: {
    sentence: (n, e) => w(e, n.lane) + " archives cards: they stay on the board, never deleted.",
    check: () => null
  }
}, G = ["path", "gate", "capacity", "bin"], Q = (n) => G.flatMap((e) => n.filter((s) => s.kind === e));
function x(n, e) {
  const s = g(e);
  if (s) return s.sentence(n, e);
  const r = b[n.kind].sentence(n, e);
  return n.severity === "warn" ? r.replace(/\.$/, " (a warning only).") : r;
}
function V(n) {
  return g(n)?.builtIn(n) ?? (n.kind === "pipeline" ? ["Deals move one stage at a time.", "A won deal needs an amount."] : []);
}
function R(n) {
  return I(n) ? [
    ...V(n),
    ...q(n).map(({ lane: e, max: s }) => e.label + " holds " + s + "."),
    ...y(n).rules.filter((e) => e.on).map((e) => x(e, n))
  ] : [];
}
function _(n, e) {
  return y(n).rules.find((r) => r.on && r.kind === "capacity" && r.where === e)?.max ?? n.lanes.find((r) => r.id === e)?.capacity;
}
function S(n, e) {
  const s = g(n);
  if (s) return s.check(n, e);
  const r = Q(y(n).rules.filter((i) => i.on)), a = [];
  if (!r.length) return { ok: !0, warnings: a };
  const l = (i) => r.find((t) => t.kind === "bin" && t.lane === i);
  for (const i of n.cards) {
    const t = l(i.laneId);
    if (!t || e.cards.some((p) => p.id === i.id)) continue;
    const f = b.bin.sentence(t, n);
    if (t.severity === "refuse") return { refused: { sentence: f, ruleId: t.id, set: t.set, cardId: i.id, laneId: i.laneId } };
    a.push(f);
  }
  const c = new Map(n.cards.map((i) => [i.id, i.laneId])), o = new Map(n.cards.map((i) => [i.id, i.override]));
  for (const i of e.cards) {
    const t = c.get(i.id) ?? null;
    if (t === i.laneId || l(i.laneId) || t !== null && i.override?.from === t || o.get(i.id)?.from === i.laneId) continue;
    const f = { card: i, from: t, to: i.laneId };
    for (const p of r) {
      const u = b[p.kind].check(p, n, e, f);
      if (u) {
        if (p.severity === "warn") {
          a.push(u.sentence);
          continue;
        }
        return { refused: { sentence: u.sentence, ruleId: p.id, set: p.set, cardId: i.id, laneId: i.laneId } };
      }
    }
  }
  return { ok: !0, warnings: a };
}
function X(n, e) {
  const s = y(n), r = y(e), a = [], l = (o, i) => x(o, i) + (o.on ? "" : " (off)");
  for (const o of r.rules) {
    const i = s.rules.find((t) => t.id === o.id);
    i ? l(i, n) !== l(o, e) && a.push("~ " + l(i, n) + " → " + l(o, e)) : a.push("+ " + l(o, e));
  }
  for (const o of s.rules) r.rules.some((i) => i.id === o.id) || a.push("- " + l(o, n));
  const c = e.lanes.flatMap((o) => {
    const i = _(e, o.id), t = e.cards.filter((f) => f.laneId === o.id).length;
    return i !== void 0 && t > i ? [o.label + " shows " + t + " of " + i + "."] : [];
  });
  return { from: s.rev, to: r.rev, lines: a, over: c };
}
const ee = { capacity: "where max", path: "from to noSkip", gate: "into needs", bin: "lane" };
function ne(n) {
  let e = 1;
  for (; n.rules.some((s) => s.id === "rule-" + e); ) e++;
  return "rule-" + e;
}
function re(n, e) {
  const s = n.rules.flatMap((r) => {
    if (r.kind === "capacity" && r.where === e) return [];
    if (r.kind === "gate" && r.into === e) return [];
    if (r.kind === "bin" && r.lane === e) return [];
    if (r.kind === "path") {
      if (r.from === e) return [];
      if (r.to?.includes(e)) {
        const a = r.to.filter((l) => l !== e);
        return a.length ? [{ ...r, to: a }] : [];
      }
    }
    return [r];
  });
  return s.length === n.rules.length ? n : { ...n, rev: n.rev + 1, rules: s };
}
function te(n, e, s, r) {
  if (e.kind !== "add_rule" && e.kind !== "set_rule" && e.kind !== "remove_rule") return r.refuse("That is not a rule edit.", { code: "invalid_edit" });
  const a = y(n), l = (u, h) => {
    let d;
    try {
      d = L(u, n);
    } catch (m) {
      return r.refuse(m instanceof Error ? m.message : String(m));
    }
    return r.done({ ...n, behaviour: d }, h);
  }, c = (u) => a.rules.find((h) => h.id === u) ?? r.refuse("There is no rule " + P(u) + " on this board.", { code: "unknown_reference" }), o = (u) => u === "any" ? "any" : typeof u != "string" && !(u && typeof u == "object") ? r.refuse("Name the column the rule is about.", { code: "invalid_edit" }) : r.lane(u).id;
  if (e.kind === "remove_rule") {
    const u = c(e.rule);
    return l({ ...a, rev: a.rev + 1, rules: a.rules.filter((h) => h !== u) }, "Removed the rule: " + x(u, n));
  }
  if (e.kind === "set_rule") {
    const u = { ...c(e.rule), set: s };
    if (e.on !== void 0 && (u.on = e.on), e.severity !== void 0 && (u.severity = e.severity), e.max !== void 0) {
      if (!("max" in u)) return r.refuse("Only a limit takes a number.");
      u.max = e.max;
    }
    if (e.to !== void 0) {
      if (u.kind !== "path") return r.refuse("Only a path rule says where cards go.");
      u.to = e.to.map(o);
    }
    for (const h of ["floor", "onConflict", "unit", "under", "by", "drop", "mode"]) if (e[h] !== void 0) {
      if (!(h in u)) return r.refuse("That rule does not take " + h + ".");
      u[h] = e[h];
    }
    return l(
      { ...a, rev: a.rev + 1, rules: a.rules.map((h) => h.id === u.id ? u : h) },
      u.on ? "The rule now says: " + x(u, n) : "Turned off: " + x(u, n)
    );
  }
  const i = e.rule, t = g(n)?.keys ?? ee;
  if (t[i.kind] === void 0) return r.refuse("This board does not know the rule " + String(i.kind) + ".", { code: "invalid_edit" });
  const f = Object.keys(i).find((u) => !("kind severity " + t[i.kind]).split(" ").includes(u));
  if (f) return r.refuse("A " + String(i.kind) + " rule does not take " + f + ".", { code: "invalid_edit" });
  const p = { id: ne(a), kind: i.kind, on: !0, severity: i.severity ?? "refuse", set: s };
  for (const [u, h] of Object.entries(i))
    u === "kind" || u === "severity" || (p[u] = u === "where" || u === "into" || u === "lane" || u === "from" ? o(h) : u === "to" && Array.isArray(h) ? h.map(o) : u === "cards" && Array.isArray(h) ? h.map((d) => r.card(d).id) : h);
  return l({ ...a, rev: a.rev + 1, rules: [...a.rules, p] }, "New rule: " + x(p, n));
}
function oe(n, e, s) {
  const r = z(n), a = F(r), l = (d, m, k) => typeof k == "object" ? d.find((v) => v.id === k.id) : d.find((v) => v.id === k) ?? m.attempt(k), c = l(r.cards, a.cards, e), o = l(r.lanes, a.lanes, s);
  if (!c || !o) return { refused: { sentence: c ? "There is no such column on this board." : "There is no such card on this board.", ruleId: null, nearest: null, overridable: !1 } };
  const i = r.lanes.map((d) => d.id), t = () => r.lanes.filter((d) => d.id !== c.laneId && d.id !== o.id && O(r, c.id, d.id)).sort((d, m) => Math.abs(i.indexOf(d.id) - i.indexOf(o.id)) - Math.abs(i.indexOf(m.id) - i.indexOf(o.id)))[0]?.label ?? null, f = O(r, c.id, o.id);
  if (f) {
    const d = f === r || !r.behaviour ? null : S(r, f);
    return { ok: !0, warnings: d && "ok" in d ? d.warnings : [] };
  }
  const p = D(r, c.id, o.id) ?? "That move is not available.", u = y(r).rules.find((d) => d.on && p === ie(r, c.id, o.id, d)), h = B(r, c.id, o.id) === null;
  return { refused: { sentence: p, ruleId: u?.id ?? null, nearest: t(), overridable: h, ...u && { set: u.set } } };
}
function ie(n, e, s, r) {
  const a = { ...n, behaviour: { ...y(n), rules: [r] } }, l = S(a, { ...a, cards: a.cards.map((c) => c.id === e ? { ...c, laneId: s } : c) });
  return "refused" in l ? l.refused.sentence : null;
}
function se(n, e, s = {}) {
  if (!n.behaviour) return null;
  const r = R(n), a = ["How this board behaves", ...r.length ? r : ["No rules yet. Say “Let a column hold 2”."]].join(`
`), l = Math.max(12, (s.fontSize ?? C.fontSize) - 2), c = Math.max(12, Math.floor((e.width - 24) / (l * 0.55))), o = a.split(`
`).reduce((t, f) => t + Math.max(1, Math.ceil(f.length / c)), 0), i = Math.round(o * l * 1.4 + 24);
  return { options: {
    id: "rules-board",
    name: "How this board behaves",
    text: a,
    xPos: e.x,
    yPos: e.y,
    width: e.width,
    height: i,
    shapeHint: "rectangle",
    vectorPath: W(e.width, i, s.cornerRadius ?? 0),
    backgroundColor: "#f4f1e8",
    foregroundColor: s.textColor ?? C.fontColor,
    borderColor: "#b8b2a0",
    borderWidth: 1,
    borderStyle: "dashed",
    fontSize: l,
    ...s.fontFamily ? { fontFamily: s.fontFamily } : {}
  }, relationships: { associations: [] } };
}
function ae(n, e, s, r) {
  const a = n.behaviour?.rules.find((c) => c.kind === "capacity" && c.where === e);
  if (!a) return null;
  if (s !== null && (!Number.isInteger(s) || s < 1 || s > 24)) return "A column can hold from 1 to 24 cards.";
  const l = s === null ? n.behaviour.rules.filter((c) => c !== a) : n.behaviour.rules.map((c) => c === a ? { ...c, max: s, on: !0, set: r } : c);
  return { ...n, behaviour: { ...n.behaviour, rev: n.behaviour.rev + 1, rules: l } };
}
function le(n, e) {
  const s = y(n), r = y(e), a = JSON.stringify, l = (o) => a(o.cards.map((i) => [i.id, i.laneId]));
  if (a(s.rules) !== a(r.rules)) {
    if (r.rev <= s.rev) return "The rules changed. Save them with a new revision.";
    if (l(n) !== l(e)) return "Change the rules on their own, then move cards.";
  }
  const c = n.behaviour ? S(n, e) : null;
  return c && "refused" in c ? c.refused.sentence : null;
}
U({
  replacement: le,
  move: oe,
  diff: X,
  note: se,
  setLimit: ae,
  validate: L,
  check: S,
  laneLimit: _,
  lines: R,
  dropLane: re,
  edit: te
});
export {
  te as applyRuleEdit,
  Y as behaviourContradiction,
  X as behaviourDiff,
  I as behaviourFamily,
  _ as behaviourLaneLimit,
  R as behaviourLines,
  y as behaviourOf,
  S as checkBehaviour,
  oe as checkWorkshopMove,
  re as dropLaneRules,
  $ as emptyBehaviour,
  K as maxBehaviourRules,
  ne as nextRuleId,
  de as ruleKindIds,
  x as ruleSentence,
  ae as setRuledLimit,
  L as validateBehaviour
};
