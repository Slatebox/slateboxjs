import { workshopRules as j, validateWorkshop as N, workshopReferences as z, workshopCandidate as O, workshopRefusal as F, workshopRulesLoaded as D, said as B, registerRulebook as H, roundedBox as P } from "./workshop-model.mjs";
import { D as C } from "./NoteDefaults-1xFW0br8.mjs";
const ue = ["capacity", "path", "gate", "bin"], U = 12, M = { pipeline: [{ id: "amount", noun: "an amount" }] }, A = (n) => Object.values(M).flat().find((e) => e.id === n)?.noun ?? n, W = /* @__PURE__ */ new Set(["label", "text", "title", "name", "words"]), v = (n) => D(n.kind) ? j(n.kind).rulebook : void 0;
function I(n) {
  return n.kind === "pipeline" ? "pipeline" : v(n) ? "time" : n.kind || n.experience || n.lanes.some((e) => e.station) ? null : "lanes";
}
const K = () => ({ version: 1, rev: 0, rules: [] });
function y(n) {
  return n.behaviour ?? K();
}
function E(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error(e);
  return n;
}
const Z = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function T(n, e) {
  const o = E(n, "Unsupported behaviour version.");
  if (o.version !== 1) throw new Error("Unsupported behaviour version.");
  const t = I(e);
  if (!t) throw new Error("Only lane boards and pipelines take rules for now.");
  if (typeof o.rev != "number" || !Number.isInteger(o.rev) || o.rev < 0 || o.rev > 1e9) throw new Error("A rulebook needs a whole revision number.");
  if (!Array.isArray(o.rules)) throw new Error("A rulebook needs a list of rules.");
  if (o.rules.length > U) throw new Error("A board has up to 12 rules.");
  const a = (s) => {
    if (typeof s != "string" || !e.lanes.some((i) => i.id === s)) throw new Error("That rule names a lane that is no longer on the board.");
    return s;
  }, l = o.rules.map((s) => {
    const i = E(s, "A rule is an object.");
    if (typeof i.id != "string" || !Z.test(i.id)) throw new Error("Rule IDs must be short alphanumeric slugs.");
    if (typeof i.on != "boolean") throw new Error("Say whether the rule is on.");
    if (i.severity !== "refuse" && i.severity !== "warn") throw new Error("A rule refuses or warns.");
    const f = E(i.set, "A rule says who set it.");
    if (typeof f.by != "string" || f.by.length > 80 || typeof f.at != "string" || f.at.length > 40 || !["chat", "exec", "preset"].includes(f.via)) throw new Error("A rule says who set it, when and how.");
    const m = { id: i.id, on: i.on, severity: i.severity, set: { by: f.by, at: f.at, via: f.via } }, c = v(e);
    if (c) {
      if (c.keys[i.kind] === void 0) throw new Error("This board does not know the rule " + String(i.kind) + ".");
      return c.read(i, m, e, a);
    }
    const d = (w) => {
      const h = Object.keys(i).find((k) => !["id", "on", "severity", "set", "kind", ...w].includes(k));
      if (h) throw new Error("A " + i.kind + " rule does not take " + h + ".");
    };
    switch (i.kind) {
      case "capacity": {
        if (d(["where", "max"]), typeof i.max != "number" || !Number.isInteger(i.max) || i.max < 1 || i.max > 24) throw new Error("A lane can hold from 1 to 24 cards.");
        return { ...m, kind: "capacity", where: a(i.where), max: i.max };
      }
      case "path": {
        d(["from", "to", "noSkip"]);
        const w = i.from === "any" ? "any" : a(i.from), h = { ...m, kind: "path", from: w };
        if (i.noSkip !== void 0) {
          if (i.noSkip !== !0) throw new Error("noSkip is true or left out.");
          h.noSkip = !0;
        }
        if (i.to !== void 0) {
          if (!Array.isArray(i.to) || i.to.length < 1 || i.to.length > 4) throw new Error("Say where cards in " + p(e, w) + " may go.");
          if (h.to = i.to.map(a), new Set(h.to).size !== h.to.length) throw new Error("Name each lane once.");
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
        if (w.some((x) => W.has(x))) throw new Error("A rule reads a card’s fields, never its words.");
        const h = M[t] ?? [], k = w.find((x) => !h.some((L) => L.id === x));
        if (k) throw new Error("Cards on this board carry no " + A(k).replace(/^an? /, "") + ", so a lane can’t ask for one.");
        return { ...m, kind: "gate", into: a(i.into), needs: [...w] };
      }
      case "bin":
        return d(["lane"]), { ...m, kind: "bin", lane: a(i.lane) };
    }
    throw new Error("This board does not know the rule " + String(i.kind) + ".");
  });
  if (new Set(l.map((s) => s.id)).size !== l.length) throw new Error("Duplicate rule ID.");
  const u = { version: 1, rev: o.rev, rules: l }, r = $(u, e);
  if (r) throw new Error(r);
  return u;
}
function p(n, e) {
  return e === "any" ? "any lane" : n.lanes.find((o) => o.id === e)?.label ?? e;
}
function $(n, e) {
  const o = v(e);
  if (o) return o.contradiction(n, e);
  const t = new Set(n.rules.filter((r) => r.kind === "bin").map((r) => r.lane)), a = /* @__PURE__ */ new Map();
  for (const r of n.rules) {
    let s = "", i = "";
    if (r.kind === "capacity") {
      if (t.has(r.where)) return p(e, r.where) + " archives cards, so it takes every card.";
      if (r.where && e.lanes.find((f) => f.id === r.where)?.capacity !== void 0)
        return p(e, r.where) + " already has a limit. Change it instead.";
      s = "capacity:" + r.where, i = p(e, r.where) + " already has a limit. Change it instead.";
    } else if (r.kind === "path")
      s = "path:" + r.from, i = "There is already a rule for cards leaving " + p(e, r.from) + ". Change that one instead.";
    else if (r.kind === "gate") {
      if (t.has(r.into)) return p(e, r.into) + " archives cards, so it takes every card.";
      s = "gate:" + r.into, i = p(e, r.into) + " already asks for something. Change that rule instead.";
    } else {
      const f = r.lane;
      s = "bin:" + f, i = p(e, f) + " already archives cards.";
    }
    if (a.has(s)) return i;
    a.set(s, r.id);
  }
  const l = n.rules.filter((r) => r.on && r.severity === "refuse"), u = e.lanes.map((r) => r.id);
  for (const r of l) if (r.kind === "path") {
    for (const s of r.to ?? [])
      if (Math.abs(u.indexOf(s) - u.indexOf(r.from)) > 1 && !l.some((i) => i.kind === "bin" && i.lane === s) && l.some((i) => i.kind === "path" && (i.from === "any" || i.from === r.from) && (i.noSkip || !i.to)))
        return "Cards move one lane at a time, so cards in " + p(e, r.from) + " could never reach " + p(e, s) + ".";
  }
  return null;
}
function J(n) {
  if (!I(n)) return [];
  const e = new Set(y(n).rules.filter((o) => o.kind === "capacity").map((o) => o.where));
  return n.lanes.filter((o) => o.capacity !== void 0 && !e.has(o.id)).map((o) => ({ lane: o, max: o.capacity }));
}
const b = {
  capacity: {
    sentence: (n, e) => p(e, n.where) + " holds " + n.max + ".",
    check(n, e, o, t) {
      const { where: a, max: l } = n;
      if (t.to !== a || t.from === a) return null;
      const u = e.cards.filter((s) => s.laneId === a).length, r = o.cards.filter((s) => s.laneId === a).length;
      return r > l && r > u ? { sentence: p(e, a) + " holds " + l + ". It has " + u + "." } : null;
    }
  },
  path: {
    sentence(n, e) {
      const { from: o, to: t, noSkip: a } = n;
      if (!t) return "Cards move one lane at a time.";
      const l = t.map((r) => p(e, r)), u = l.length > 1 ? l.slice(0, -1).join(", ") + " or " + l.at(-1) : l[0];
      return "From " + p(e, o) + ", cards go only to " + u + "." + (a ? " One lane at a time." : "");
    },
    check(n, e, o, t) {
      const { from: a, to: l, noSkip: u } = n;
      if (t.from === null || t.from === t.to || a !== "any" && a !== t.from) return null;
      if (l && !l.includes(t.to)) return { sentence: b.path.sentence(n, e) };
      if (u || !l) {
        const r = e.lanes.map((f) => f.id), s = r.indexOf(t.from), i = r.indexOf(t.to);
        if (Math.abs(i - s) > 1) {
          const f = e.lanes[s + Math.sign(i - s)];
          return { sentence: "Cards move one lane at a time. " + t.card.label + " is in " + p(e, t.from) + ", so " + f.label + " comes first." };
        }
      }
      return null;
    }
  },
  gate: {
    sentence: (n, e) => p(e, n.into) + " needs " + n.needs.map(A).join(" and ") + ".",
    check(n, e, o, t) {
      const { into: a, needs: l } = n;
      if (t.to !== a || t.from === a) return null;
      const u = l.find((r) => t.card[r] === void 0);
      return u ? { sentence: p(e, a) + " needs " + A(u) + ". " + t.card.label + " has none." } : null;
    }
  },
  bin: {
    sentence: (n, e) => p(e, n.lane) + " archives cards: they stay on the board, never deleted.",
    check: () => null
  }
}, Y = ["path", "gate", "capacity", "bin"], q = (n) => Y.flatMap((e) => n.filter((o) => o.kind === e));
function g(n, e) {
  const o = v(e);
  if (o) return o.sentence(n, e);
  const t = b[n.kind].sentence(n, e);
  return n.severity === "warn" ? t.replace(/\.$/, " (a warning only).") : t;
}
function G(n) {
  return v(n)?.builtIn(n) ?? (n.kind === "pipeline" ? ["Deals move one stage at a time.", "A won deal needs an amount."] : []);
}
function R(n) {
  return I(n) ? [
    ...G(n),
    ...J(n).map(({ lane: e, max: o }) => e.label + " holds " + o + "."),
    ...y(n).rules.filter((e) => e.on).map((e) => g(e, n))
  ] : [];
}
function _(n, e) {
  return y(n).rules.find((t) => t.on && t.kind === "capacity" && t.where === e)?.max ?? n.lanes.find((t) => t.id === e)?.capacity;
}
function S(n, e) {
  const o = v(n);
  if (o) return o.check(n, e);
  const t = q(y(n).rules.filter((r) => r.on)), a = [];
  if (!t.length) return { ok: !0, warnings: a };
  const l = (r) => t.find((s) => s.kind === "bin" && s.lane === r);
  for (const r of n.cards) {
    const s = l(r.laneId);
    if (!s || e.cards.some((f) => f.id === r.id)) continue;
    const i = b.bin.sentence(s, n);
    if (s.severity === "refuse") return { refused: { sentence: i, ruleId: s.id, set: s.set, cardId: r.id, laneId: r.laneId } };
    a.push(i);
  }
  const u = new Map(n.cards.map((r) => [r.id, r.laneId]));
  for (const r of e.cards) {
    const s = u.get(r.id) ?? null;
    if (s === r.laneId || l(r.laneId)) continue;
    const i = { card: r, from: s, to: r.laneId };
    for (const f of t) {
      const m = b[f.kind].check(f, n, e, i);
      if (m) {
        if (f.severity === "warn") {
          a.push(m.sentence);
          continue;
        }
        return { refused: { sentence: m.sentence, ruleId: f.id, set: f.set, cardId: r.id, laneId: r.laneId } };
      }
    }
  }
  return { ok: !0, warnings: a };
}
function Q(n, e) {
  const o = y(n), t = y(e), a = [], l = (r, s) => g(r, s) + (r.on ? "" : " (off)");
  for (const r of t.rules) {
    const s = o.rules.find((i) => i.id === r.id);
    s ? l(s, n) !== l(r, e) && a.push("~ " + l(s, n) + " → " + l(r, e)) : a.push("+ " + l(r, e));
  }
  for (const r of o.rules) t.rules.some((s) => s.id === r.id) || a.push("- " + l(r, n));
  const u = e.lanes.flatMap((r) => {
    const s = _(e, r.id), i = e.cards.filter((f) => f.laneId === r.id).length;
    return s !== void 0 && i > s ? [r.label + " shows " + i + " of " + s + "."] : [];
  });
  return { from: o.rev, to: t.rev, lines: a, over: u };
}
const V = { capacity: "where max", path: "from to noSkip", gate: "into needs", bin: "lane" };
function X(n) {
  let e = 1;
  for (; n.rules.some((o) => o.id === "rule-" + e); ) e++;
  return "rule-" + e;
}
function ee(n, e) {
  const o = n.rules.flatMap((t) => {
    if (t.kind === "capacity" && t.where === e) return [];
    if (t.kind === "gate" && t.into === e) return [];
    if (t.kind === "bin" && t.lane === e) return [];
    if (t.kind === "path") {
      if (t.from === e) return [];
      if (t.to?.includes(e)) {
        const a = t.to.filter((l) => l !== e);
        return a.length ? [{ ...t, to: a }] : [];
      }
    }
    return [t];
  });
  return o.length === n.rules.length ? n : { ...n, rev: n.rev + 1, rules: o };
}
function ne(n, e, o, t) {
  if (e.kind !== "add_rule" && e.kind !== "set_rule" && e.kind !== "remove_rule") return t.refuse("That is not a rule edit.", { code: "invalid_edit" });
  const a = y(n), l = (c, d) => {
    let w;
    try {
      w = T(c, n);
    } catch (h) {
      return t.refuse(h instanceof Error ? h.message : String(h));
    }
    return t.done({ ...n, behaviour: w }, d);
  }, u = (c) => a.rules.find((d) => d.id === c) ?? t.refuse("There is no rule " + B(c) + " on this board.", { code: "unknown_reference" }), r = (c) => c === "any" ? "any" : typeof c != "string" && !(c && typeof c == "object") ? t.refuse("Name the lane the rule is about.", { code: "invalid_edit" }) : t.lane(c).id;
  if (e.kind === "remove_rule") {
    const c = u(e.rule);
    return l({ ...a, rev: a.rev + 1, rules: a.rules.filter((d) => d !== c) }, "Removed the rule: " + g(c, n));
  }
  if (e.kind === "set_rule") {
    const c = { ...u(e.rule), set: o };
    if (e.on !== void 0 && (c.on = e.on), e.severity !== void 0 && (c.severity = e.severity), e.max !== void 0) {
      if (!("max" in c)) return t.refuse("Only a limit takes a number.");
      c.max = e.max;
    }
    if (e.to !== void 0) {
      if (c.kind !== "path") return t.refuse("Only a path rule says where cards go.");
      c.to = e.to.map(r);
    }
    for (const d of ["floor", "onConflict", "unit", "under", "by", "drop"]) if (e[d] !== void 0) {
      if (!(d in c)) return t.refuse("That rule does not take " + d + ".");
      c[d] = e[d];
    }
    return l(
      { ...a, rev: a.rev + 1, rules: a.rules.map((d) => d.id === c.id ? c : d) },
      c.on ? "The rule now says: " + g(c, n) : "Turned off: " + g(c, n)
    );
  }
  const s = e.rule, i = v(n)?.keys ?? V;
  if (i[s.kind] === void 0) return t.refuse("This board does not know the rule " + String(s.kind) + ".", { code: "invalid_edit" });
  const f = Object.keys(s).find((c) => !("kind severity " + i[s.kind]).split(" ").includes(c));
  if (f) return t.refuse("A " + String(s.kind) + " rule does not take " + f + ".", { code: "invalid_edit" });
  const m = { id: X(a), kind: s.kind, on: !0, severity: s.severity ?? "refuse", set: o };
  for (const [c, d] of Object.entries(s))
    c === "kind" || c === "severity" || (m[c] = c === "where" || c === "into" || c === "lane" || c === "from" ? r(d) : c === "to" && Array.isArray(d) ? d.map(r) : c === "cards" && Array.isArray(d) ? d.map((w) => t.card(w).id) : d);
  return l({ ...a, rev: a.rev + 1, rules: [...a.rules, m] }, "New rule: " + g(m, n));
}
function re(n, e, o) {
  const t = N(n), a = z(t), l = (d, w, h) => typeof h == "object" ? d.find((k) => k.id === h.id) : d.find((k) => k.id === h) ?? w.attempt(h), u = l(t.cards, a.cards, e), r = l(t.lanes, a.lanes, o);
  if (!u || !r) return { refused: { sentence: u ? "There is no such lane on this board." : "There is no such card on this board.", ruleId: null, nearest: null } };
  const s = t.lanes.map((d) => d.id), i = () => t.lanes.filter((d) => d.id !== u.laneId && d.id !== r.id && O(t, u.id, d.id)).sort((d, w) => Math.abs(s.indexOf(d.id) - s.indexOf(r.id)) - Math.abs(s.indexOf(w.id) - s.indexOf(r.id)))[0]?.label ?? null, f = O(t, u.id, r.id);
  if (f) {
    const d = f === t || !t.behaviour ? null : S(t, f);
    return { ok: !0, warnings: d && "ok" in d ? d.warnings : [] };
  }
  const m = F(t, u.id, r.id) ?? "That move is not available.", c = y(t).rules.find((d) => d.on && m === te(t, u.id, r.id, d));
  return { refused: { sentence: m, ruleId: c?.id ?? null, nearest: i(), ...c && { set: c.set } } };
}
function te(n, e, o, t) {
  const a = { ...n, behaviour: { ...y(n), rules: [t] } }, l = S(a, { ...a, cards: a.cards.map((u) => u.id === e ? { ...u, laneId: o } : u) });
  return "refused" in l ? l.refused.sentence : null;
}
function ie(n, e, o = {}) {
  if (!n.behaviour) return null;
  const t = R(n), a = ["How this board behaves", ...t.length ? t : ["No rules yet. Say “Let a lane hold 2”."]].join(`
`), l = Math.max(12, (o.fontSize ?? C.fontSize) - 2), u = Math.max(12, Math.floor((e.width - 24) / (l * 0.55))), r = a.split(`
`).reduce((i, f) => i + Math.max(1, Math.ceil(f.length / u)), 0), s = Math.round(r * l * 1.4 + 24);
  return { options: {
    id: "rules-board",
    name: "How this board behaves",
    text: a,
    xPos: e.x,
    yPos: e.y,
    width: e.width,
    height: s,
    shapeHint: "rectangle",
    vectorPath: P(e.width, s, o.cornerRadius ?? 0),
    backgroundColor: "#f4f1e8",
    foregroundColor: o.textColor ?? C.fontColor,
    borderColor: "#b8b2a0",
    borderWidth: 1,
    borderStyle: "dashed",
    fontSize: l,
    ...o.fontFamily ? { fontFamily: o.fontFamily } : {}
  }, relationships: { associations: [] } };
}
function oe(n, e, o, t) {
  const a = n.behaviour?.rules.find((u) => u.kind === "capacity" && u.where === e);
  if (!a) return null;
  if (o !== null && (!Number.isInteger(o) || o < 1 || o > 24)) return "A lane can hold from 1 to 24 cards.";
  const l = o === null ? n.behaviour.rules.filter((u) => u !== a) : n.behaviour.rules.map((u) => u === a ? { ...u, max: o, on: !0, set: t } : u);
  return { ...n, behaviour: { ...n.behaviour, rev: n.behaviour.rev + 1, rules: l } };
}
function se(n, e) {
  const o = y(n), t = y(e), a = JSON.stringify, l = (r) => a(r.cards.map((s) => [s.id, s.laneId]));
  if (a(o.rules) !== a(t.rules)) {
    if (t.rev <= o.rev) return "The rules changed. Save them with a new revision.";
    if (l(n) !== l(e)) return "Change the rules on their own, then move cards.";
  }
  const u = n.behaviour ? S(n, e) : null;
  return u && "refused" in u ? u.refused.sentence : null;
}
H({
  replacement: se,
  move: re,
  diff: Q,
  note: ie,
  setLimit: oe,
  validate: T,
  check: S,
  laneLimit: _,
  lines: R,
  dropLane: ee,
  edit: ne
});
export {
  ne as applyRuleEdit,
  $ as behaviourContradiction,
  Q as behaviourDiff,
  I as behaviourFamily,
  _ as behaviourLaneLimit,
  R as behaviourLines,
  y as behaviourOf,
  S as checkBehaviour,
  re as checkWorkshopMove,
  ee as dropLaneRules,
  K as emptyBehaviour,
  U as maxBehaviourRules,
  X as nextRuleId,
  ue as ruleKindIds,
  g as ruleSentence,
  oe as setRuledLimit,
  T as validateBehaviour
};
