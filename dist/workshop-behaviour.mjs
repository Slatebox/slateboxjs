import { validateWorkshop as _, workshopReferences as L, workshopCandidate as A, workshopRefusal as R, said as j, registerRulebook as N } from "./workshop-model.mjs";
import { D as I } from "./NoteDefaults-1xFW0br8.mjs";
const z = ["capacity", "path", "gate", "bin"], F = 12, O = { pipeline: [{ id: "amount", noun: "an amount" }] }, S = (n) => Object.values(O).flat().find((e) => e.id === n)?.noun ?? n, D = /* @__PURE__ */ new Set(["label", "text", "title", "name", "words"]);
function E(n) {
  return n.kind === "pipeline" ? "pipeline" : n.kind || n.experience || n.lanes.some((e) => e.station) ? null : "lanes";
}
const H = () => ({ version: 1, rev: 0, rules: [] });
function w(n) {
  return n.behaviour ?? H();
}
function x(n, e) {
  if (!n || typeof n != "object" || Array.isArray(n)) throw new Error(e);
  return n;
}
const B = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function M(n, e) {
  const i = x(n, "Unsupported behaviour version.");
  if (i.version !== 1) throw new Error("Unsupported behaviour version.");
  const r = E(e);
  if (!r) throw new Error("Only lane boards and pipelines take rules for now.");
  if (typeof i.rev != "number" || !Number.isInteger(i.rev) || i.rev < 0 || i.rev > 1e9) throw new Error("A rulebook needs a whole revision number.");
  if (!Array.isArray(i.rules)) throw new Error("A rulebook needs a list of rules.");
  if (i.rules.length > F) throw new Error("A board has up to 12 rules.");
  const a = (o) => {
    if (typeof o != "string" || !e.lanes.some((l) => l.id === o)) throw new Error("That rule names a lane that is no longer on the board.");
    return o;
  }, c = i.rules.map((o) => {
    const l = x(o, "A rule is an object.");
    if (typeof l.id != "string" || !B.test(l.id)) throw new Error("Rule IDs must be short alphanumeric slugs.");
    if (typeof l.on != "boolean") throw new Error("Say whether the rule is on.");
    if (l.severity !== "refuse" && l.severity !== "warn") throw new Error("A rule refuses or warns.");
    const f = x(l.set, "A rule says who set it.");
    if (typeof f.by != "string" || f.by.length > 80 || typeof f.at != "string" || f.at.length > 40 || !["chat", "exec", "preset"].includes(f.via)) throw new Error("A rule says who set it, when and how.");
    const u = { id: l.id, on: l.on, severity: l.severity, set: { by: f.by, at: f.at, via: f.via } }, h = (d) => {
      const m = Object.keys(l).find((y) => !["id", "on", "severity", "set", "kind", ...d].includes(y));
      if (m) throw new Error("A " + l.kind + " rule does not take " + m + ".");
    };
    switch (l.kind) {
      case "capacity": {
        if (h(["where", "max"]), typeof l.max != "number" || !Number.isInteger(l.max) || l.max < 1 || l.max > 24) throw new Error("A lane can hold from 1 to 24 cards.");
        return { ...u, kind: "capacity", where: a(l.where), max: l.max };
      }
      case "path": {
        h(["from", "to", "noSkip"]);
        const d = l.from === "any" ? "any" : a(l.from), m = { ...u, kind: "path", from: d };
        if (l.noSkip !== void 0) {
          if (l.noSkip !== !0) throw new Error("noSkip is true or left out.");
          m.noSkip = !0;
        }
        if (l.to !== void 0) {
          if (!Array.isArray(l.to) || l.to.length < 1 || l.to.length > 4) throw new Error("Say where cards in " + p(e, d) + " may go.");
          if (m.to = l.to.map(a), new Set(m.to).size !== m.to.length) throw new Error("Name each lane once.");
          if (m.to.includes(d)) throw new Error("A path leads to another lane.");
        }
        if (!m.to && !m.noSkip) throw new Error("Say where cards in " + p(e, d) + " may go.");
        if (d === "any" && m.to) throw new Error("A path from any lane is one lane at a time; name a lane to send cards somewhere.");
        return m;
      }
      case "gate": {
        if (h(["into", "needs"]), !Array.isArray(l.needs) || l.needs.length < 1 || l.needs.length > 3 || l.needs.some((v) => typeof v != "string"))
          throw new Error("Say which field the lane asks for.");
        const d = l.needs;
        if (d.some((v) => D.has(v))) throw new Error("A rule reads a card’s fields, never its words.");
        const m = O[r] ?? [], y = d.find((v) => !m.some((T) => T.id === v));
        if (y) throw new Error("Cards on this board carry no " + S(y).replace(/^an? /, "") + ", so a lane can’t ask for one.");
        return { ...u, kind: "gate", into: a(l.into), needs: [...d] };
      }
      case "bin":
        return h(["lane"]), { ...u, kind: "bin", lane: a(l.lane) };
    }
    throw new Error("This board does not know the rule " + String(l.kind) + ".");
  });
  if (new Set(c.map((o) => o.id)).size !== c.length) throw new Error("Duplicate rule ID.");
  const t = { version: 1, rev: i.rev, rules: c }, s = Q(t, e);
  if (s) throw new Error(s);
  return t;
}
function p(n, e) {
  return e === "any" ? "any lane" : n.lanes.find((i) => i.id === e)?.label ?? e;
}
function Q(n, e) {
  const i = new Set(n.rules.filter((t) => t.kind === "bin").map((t) => t.lane)), r = /* @__PURE__ */ new Map();
  for (const t of n.rules) {
    let s = "", o = "";
    if (t.kind === "capacity") {
      if (i.has(t.where)) return p(e, t.where) + " archives cards, so it takes every card.";
      if (t.where && e.lanes.find((l) => l.id === t.where)?.capacity !== void 0)
        return p(e, t.where) + " already has a limit. Change it instead.";
      s = "capacity:" + t.where, o = p(e, t.where) + " already has a limit. Change it instead.";
    } else if (t.kind === "path")
      s = "path:" + t.from, o = "There is already a rule for cards leaving " + p(e, t.from) + ". Change that one instead.";
    else if (t.kind === "gate") {
      if (i.has(t.into)) return p(e, t.into) + " archives cards, so it takes every card.";
      s = "gate:" + t.into, o = p(e, t.into) + " already asks for something. Change that rule instead.";
    } else
      s = "bin:" + t.lane, o = p(e, t.lane) + " already archives cards.";
    if (r.has(s)) return o;
    r.set(s, t.id);
  }
  const a = n.rules.filter((t) => t.on && t.severity === "refuse"), c = e.lanes.map((t) => t.id);
  for (const t of a) if (t.kind === "path") {
    for (const s of t.to ?? [])
      if (Math.abs(c.indexOf(s) - c.indexOf(t.from)) > 1 && !a.some((o) => o.kind === "bin" && o.lane === s) && a.some((o) => o.kind === "path" && (o.from === "any" || o.from === t.from) && (o.noSkip || !o.to)))
        return "Cards move one lane at a time, so cards in " + p(e, t.from) + " could never reach " + p(e, s) + ".";
  }
  return null;
}
function Z(n) {
  if (!E(n)) return [];
  const e = new Set(w(n).rules.filter((i) => i.kind === "capacity").map((i) => i.where));
  return n.lanes.filter((i) => i.capacity !== void 0 && !e.has(i.id)).map((i) => ({ lane: i, max: i.capacity }));
}
const g = {
  capacity: {
    sentence: (n, e) => p(e, n.where) + " holds " + n.max + ".",
    check(n, e, i, r) {
      const { where: a, max: c } = n;
      if (r.to !== a || r.from === a) return null;
      const t = e.cards.filter((o) => o.laneId === a).length, s = i.cards.filter((o) => o.laneId === a).length;
      return s > c && s > t ? { sentence: p(e, a) + " holds " + c + ". It has " + t + "." } : null;
    }
  },
  path: {
    sentence(n, e) {
      const { from: i, to: r, noSkip: a } = n;
      if (!r) return "Cards move one lane at a time.";
      const c = r.map((s) => p(e, s)), t = c.length > 1 ? c.slice(0, -1).join(", ") + " or " + c.at(-1) : c[0];
      return "From " + p(e, i) + ", cards go only to " + t + "." + (a ? " One lane at a time." : "");
    },
    check(n, e, i, r) {
      const { from: a, to: c, noSkip: t } = n;
      if (r.from === null || r.from === r.to || a !== "any" && a !== r.from) return null;
      if (c && !c.includes(r.to)) return { sentence: g.path.sentence(n, e) };
      if (t || !c) {
        const s = e.lanes.map((f) => f.id), o = s.indexOf(r.from), l = s.indexOf(r.to);
        if (Math.abs(l - o) > 1) {
          const f = e.lanes[o + Math.sign(l - o)];
          return { sentence: "Cards move one lane at a time. " + r.card.label + " is in " + p(e, r.from) + ", so " + f.label + " comes first." };
        }
      }
      return null;
    }
  },
  gate: {
    sentence: (n, e) => p(e, n.into) + " needs " + n.needs.map(S).join(" and ") + ".",
    check(n, e, i, r) {
      const { into: a, needs: c } = n;
      if (r.to !== a || r.from === a) return null;
      const t = c.find((s) => r.card[s] === void 0);
      return t ? { sentence: p(e, a) + " needs " + S(t) + ". " + r.card.label + " has none." } : null;
    }
  },
  bin: {
    sentence: (n, e) => p(e, n.lane) + " archives cards: they stay on the board, never deleted.",
    check: () => null
  }
}, P = ["path", "gate", "capacity", "bin"], U = (n) => P.flatMap((e) => n.filter((i) => i.kind === e));
function k(n, e) {
  const i = g[n.kind].sentence(n, e);
  return n.severity === "warn" ? i.replace(/\.$/, " (a warning only).") : i;
}
function V(n) {
  return n.kind === "pipeline" ? ["Deals move one stage at a time.", "A won deal needs an amount."] : [];
}
function $(n) {
  return E(n) ? [
    ...V(n),
    ...Z(n).map(({ lane: e, max: i }) => e.label + " holds " + i + "."),
    ...w(n).rules.filter((e) => e.on).map((e) => k(e, n))
  ] : [];
}
function C(n, e) {
  return w(n).rules.find((r) => r.on && r.kind === "capacity" && r.where === e)?.max ?? n.lanes.find((r) => r.id === e)?.capacity;
}
function b(n, e) {
  const i = U(w(n).rules.filter((t) => t.on)), r = [];
  if (!i.length) return { ok: !0, warnings: r };
  const a = (t) => i.find((s) => s.kind === "bin" && s.lane === t);
  for (const t of n.cards) {
    const s = a(t.laneId);
    if (!s || e.cards.some((l) => l.id === t.id)) continue;
    const o = g.bin.sentence(s, n);
    if (s.severity === "refuse") return { refused: { sentence: o, ruleId: s.id, set: s.set, cardId: t.id, laneId: t.laneId } };
    r.push(o);
  }
  const c = new Map(n.cards.map((t) => [t.id, t.laneId]));
  for (const t of e.cards) {
    const s = c.get(t.id) ?? null;
    if (s === t.laneId || a(t.laneId)) continue;
    const o = { card: t, from: s, to: t.laneId };
    for (const l of i) {
      const f = g[l.kind].check(l, n, e, o);
      if (f) {
        if (l.severity === "warn") {
          r.push(f.sentence);
          continue;
        }
        return { refused: { sentence: f.sentence, ruleId: l.id, set: l.set, cardId: t.id, laneId: t.laneId } };
      }
    }
  }
  return { ok: !0, warnings: r };
}
function W(n, e) {
  const i = w(n), r = w(e), a = [], c = (s, o) => k(s, o) + (s.on ? "" : " (off)");
  for (const s of r.rules) {
    const o = i.rules.find((l) => l.id === s.id);
    o ? c(o, n) !== c(s, e) && a.push("~ " + c(o, n) + " → " + c(s, e)) : a.push("+ " + c(s, e));
  }
  for (const s of i.rules) r.rules.some((o) => o.id === s.id) || a.push("- " + c(s, n));
  const t = e.lanes.flatMap((s) => {
    const o = C(e, s.id), l = e.cards.filter((f) => f.laneId === s.id).length;
    return o !== void 0 && l > o ? [s.label + " shows " + l + " of " + o + "."] : [];
  });
  return { from: i.rev, to: r.rev, lines: a, over: t };
}
const K = { capacity: "where max", path: "from to noSkip", gate: "into needs", bin: "lane" };
function J(n) {
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
        const a = r.to.filter((c) => c !== e);
        return a.length ? [{ ...r, to: a }] : [];
      }
    }
    return [r];
  });
  return i.length === n.rules.length ? n : { ...n, rev: n.rev + 1, rules: i };
}
function q(n, e, i, r) {
  if (e.kind !== "add_rule" && e.kind !== "set_rule" && e.kind !== "remove_rule") return r.refuse("That is not a rule edit.", { code: "invalid_edit" });
  const a = w(n), c = (u, h) => {
    let d;
    try {
      d = M(u, n);
    } catch (m) {
      return r.refuse(m instanceof Error ? m.message : String(m));
    }
    return r.done({ ...n, behaviour: d }, h);
  }, t = (u) => a.rules.find((h) => h.id === u) ?? r.refuse("There is no rule " + j(u) + " on this board.", { code: "unknown_reference" }), s = (u) => u === "any" ? "any" : typeof u != "string" && !(u && typeof u == "object") ? r.refuse("Name the lane the rule is about.", { code: "invalid_edit" }) : r.lane(u).id;
  if (e.kind === "remove_rule") {
    const u = t(e.rule);
    return c({ ...a, rev: a.rev + 1, rules: a.rules.filter((h) => h !== u) }, "Removed the rule: " + k(u, n));
  }
  if (e.kind === "set_rule") {
    const u = { ...t(e.rule), set: i };
    if (e.on !== void 0 && (u.on = e.on), e.severity !== void 0 && (u.severity = e.severity), e.max !== void 0) {
      if (u.kind !== "capacity") return r.refuse("Only a lane limit takes a number.");
      u.max = e.max;
    }
    if (e.to !== void 0) {
      if (u.kind !== "path") return r.refuse("Only a path rule says where cards go.");
      u.to = e.to.map(s);
    }
    return c(
      { ...a, rev: a.rev + 1, rules: a.rules.map((h) => h.id === u.id ? u : h) },
      u.on ? "The rule now says: " + k(u, n) : "Turned off: " + k(u, n)
    );
  }
  const o = e.rule;
  if (!z.includes(o.kind)) return r.refuse("This board does not know the rule " + String(o.kind) + ".", { code: "invalid_edit" });
  const l = Object.keys(o).find((u) => !("kind severity " + K[o.kind]).split(" ").includes(u));
  if (l) return r.refuse("A " + String(o.kind) + " rule does not take " + l + ".", { code: "invalid_edit" });
  const f = { id: J(a), kind: o.kind, on: !0, severity: o.severity ?? "refuse", set: i };
  for (const [u, h] of Object.entries(o))
    u === "kind" || u === "severity" || (f[u] = u === "where" || u === "into" || u === "lane" || u === "from" ? s(h) : u === "to" && Array.isArray(h) ? h.map(s) : h);
  return c({ ...a, rev: a.rev + 1, rules: [...a.rules, f] }, "New rule: " + k(f, n));
}
function G(n, e, i) {
  const r = _(n), a = L(r), c = (d, m, y) => typeof y == "object" ? d.find((v) => v.id === y.id) : d.find((v) => v.id === y) ?? m.attempt(y), t = c(r.cards, a.cards, e), s = c(r.lanes, a.lanes, i);
  if (!t || !s) return { refused: { sentence: t ? "There is no such lane on this board." : "There is no such card on this board.", ruleId: null, nearest: null } };
  const o = r.lanes.map((d) => d.id), l = () => r.lanes.filter((d) => d.id !== t.laneId && d.id !== s.id && A(r, t.id, d.id)).sort((d, m) => Math.abs(o.indexOf(d.id) - o.indexOf(s.id)) - Math.abs(o.indexOf(m.id) - o.indexOf(s.id)))[0]?.label ?? null, f = A(r, t.id, s.id);
  if (f) {
    const d = f === r || !r.behaviour ? null : b(r, f);
    return { ok: !0, warnings: d && "ok" in d ? d.warnings : [] };
  }
  const u = R(r, t.id, s.id) ?? "That move is not available.", h = w(r).rules.find((d) => d.on && u === X(r, t.id, s.id, d));
  return { refused: { sentence: u, ruleId: h?.id ?? null, nearest: l(), ...h && { set: h.set } } };
}
function X(n, e, i, r) {
  const a = { ...n, behaviour: { ...w(n), rules: [r] } }, c = b(a, { ...a, cards: a.cards.map((t) => t.id === e ? { ...t, laneId: i } : t) });
  return "refused" in c ? c.refused.sentence : null;
}
function ee(n, e, i = {}) {
  if (!n.behaviour) return null;
  const r = $(n), a = ["How this board behaves", ...r.length ? r : ["No rules yet. Say “Let a lane hold 2”."]].join(`
`), c = Math.max(12, (i.fontSize ?? I.fontSize) - 2), t = Math.max(12, Math.floor((e.width - 24) / (c * 0.55))), s = a.split(`
`).reduce((l, f) => l + Math.max(1, Math.ceil(f.length / t)), 0), o = Math.round(s * c * 1.4 + 24);
  return { options: {
    id: "rules-board",
    name: "How this board behaves",
    text: a,
    xPos: e.x,
    yPos: e.y,
    width: e.width,
    height: o,
    shapeHint: "rectangle",
    vectorPath: ne(e.width, o, i.cornerRadius ?? 0),
    backgroundColor: "#f4f1e8",
    foregroundColor: i.textColor ?? I.fontColor,
    borderColor: "#b8b2a0",
    borderWidth: 1,
    borderStyle: "dashed",
    fontSize: c,
    ...i.fontFamily ? { fontFamily: i.fontFamily } : {}
  }, relationships: { associations: [] } };
}
const ne = (n, e, i) => {
  const r = Math.max(0, Math.min(i, n / 2, e / 2));
  return r ? `M ${r} 0 H ${n - r} Q ${n} 0 ${n} ${r} V ${e - r} Q ${n} ${e} ${n - r} ${e} H ${r} Q 0 ${e} 0 ${e - r} V ${r} Q 0 0 ${r} 0 Z` : `M 0 0 H ${n} V ${e} H 0 Z`;
};
function re(n, e, i, r) {
  const a = n.behaviour?.rules.find((t) => t.kind === "capacity" && t.where === e);
  if (!a) return null;
  if (i !== null && (!Number.isInteger(i) || i < 1 || i > 24)) return "A lane can hold from 1 to 24 cards.";
  const c = i === null ? n.behaviour.rules.filter((t) => t !== a) : n.behaviour.rules.map((t) => t === a ? { ...t, max: i, on: !0, set: r } : t);
  return { ...n, behaviour: { ...n.behaviour, rev: n.behaviour.rev + 1, rules: c } };
}
function te(n, e) {
  const i = w(n), r = w(e), a = JSON.stringify, c = (s) => a(s.cards.map((o) => [o.id, o.laneId]));
  if (a(i.rules) !== a(r.rules)) {
    if (r.rev <= i.rev) return "The rules changed. Save them with a new revision.";
    if (c(n) !== c(e)) return "Change the rules on their own, then move cards.";
  }
  const t = n.behaviour ? b(n, e) : null;
  return t && "refused" in t ? t.refused.sentence : null;
}
N({
  replacement: te,
  move: G,
  diff: W,
  note: ee,
  setLimit: re,
  validate: M,
  check: b,
  laneLimit: C,
  lines: $,
  dropLane: Y,
  edit: q
});
export {
  q as applyRuleEdit,
  Q as behaviourContradiction,
  W as behaviourDiff,
  E as behaviourFamily,
  C as behaviourLaneLimit,
  $ as behaviourLines,
  w as behaviourOf,
  b as checkBehaviour,
  G as checkWorkshopMove,
  Y as dropLaneRules,
  H as emptyBehaviour,
  F as maxBehaviourRules,
  J as nextRuleId,
  z as ruleKindIds,
  k as ruleSentence,
  re as setRuledLimit,
  M as validateBehaviour
};
