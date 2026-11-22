import { D as nn } from "./NoteDefaults-1xFW0br8.mjs";
const Rr = {
  kind: "offline-handoff",
  version: 1,
  stage: "queued",
  choice: null,
  fieldNote: "Visitor badge rejected at Gate B.",
  deskNote: "Visitor access ready at Gate B.",
  fallback: "Use the staffed lane after 17:00."
};
function Mr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, stage: t, choice: l, fieldNote: s, deskNote: p, fallback: b } = e, I = (E) => typeof E == "string" && E.trim().length > 0 && E.trim().length <= 240 && !/[<>\u0000-\u001f]/u.test(E);
  return n !== "offline-handoff" || o !== 1 || t !== "queued" && t !== "review" && t !== "resolved" || (t === "resolved" ? l !== "field" && l !== "desk" : l !== null) || l === void 0 || !I(s) || !I(p) || !I(b) ? null : { kind: n, version: o, stage: t, choice: l, fieldNote: s.trim(), deskNote: p.trim(), fallback: b.trim() };
}
function Wr(e) {
  return { ...e, stage: "review", choice: null };
}
function jr(e, n) {
  return e.stage === "review" ? { ...e, stage: "resolved", choice: n } : e;
}
function Fr(e) {
  return e.stage === "resolved" ? (e.choice === "field" ? e.fieldNote : e.deskNote) + " " + e.fallback : e.stage === "queued" ? "One edit waiting to sync." : "Which result should the crew use?";
}
const mn = {
  kind: "listening-room",
  version: 1,
  mix: 0.15,
  leftLabel: "Copper rain",
  rightLabel: "Glass chimes"
};
function zr(e) {
  if (!e || typeof e != "object") return null;
  const { kind: n, version: o, mix: t, leftLabel: l, rightLabel: s } = e, p = (b) => typeof b == "string" && b.trim().length > 0 && b.trim().length <= 80 && !/[<>\u0000-\u001f]/u.test(b);
  return n !== "listening-room" || o !== 1 || typeof t != "number" || !Number.isFinite(t) || t < 0 || t > 1 || !p(l) || !p(s) ? null : { kind: n, version: o, mix: t, leftLabel: l.trim(), rightLabel: s.trim() };
}
function Dr({ mix: e, leftLabel: n, rightLabel: o }) {
  return e < 0.32 ? n === mn.leftLabel ? "Rain ticks on the copper roof." : "You hear " + n + "." : e > 0.68 ? o === mn.rightLabel ? "Glass chimes ring, then fade." : "You hear " + o + "." : n === mn.leftLabel && o === mn.rightLabel ? "Rain and glass chimes overlap." : n + " and " + o + " overlap.";
}
function Ne(e, n) {
  return e.cards.reduce((o, t) => o + (t.laneId === n ? t.points ?? 1 : 0), 0);
}
function zo(e) {
  const n = new Map(e.cards.map((p) => [p.id, p])), o = new Map(e.lanes.map((p, b) => [p.id, b])), t = /* @__PURE__ */ new Set(), l = /* @__PURE__ */ new Set();
  function s(p) {
    if (!t.has(p.id)) {
      if (l.has(p.id)) throw new Error("Release dependencies must be acyclic.");
      l.add(p.id);
      for (const b of p.dependsOn ?? []) {
        const I = n.get(b);
        if (!I) throw new Error("A release dependency refers to an unknown feature.");
        if (o.get(I.laneId) > o.get(p.laneId))
          throw new Error("Schedule each dependency in the same window as its feature or earlier.");
        s(I);
      }
      l.delete(p.id), t.add(p.id);
    }
  }
  for (const p of e.cards) s(p);
  for (const p of e.lanes) {
    if (p.station) throw new Error("Release windows cannot also be map stations.");
    if (Ne(e, p.id) > (p.capacity ?? 1 / 0)) throw new Error(`Release "${p.label}" exceeds its point budget.`);
  }
}
function Ln(e, n, o) {
  if (o === n.laneId) return e;
  const t = new Map(e.lanes.map((y, k) => [y.id, k])), l = t.get(o);
  if (l === void 0) return null;
  const s = l < t.get(n.laneId), p = /* @__PURE__ */ new Set([n.id]), b = [n];
  for (; b.length; ) {
    const y = b.pop();
    for (const k of e.cards) {
      if (p.has(k.id)) continue;
      const v = t.get(k.laneId);
      (s ? v > l && y.dependsOn?.includes(k.id) : v < l && k.dependsOn?.includes(y.id)) && (p.add(k.id), b.push(k));
    }
  }
  if (e.cards.filter((y) => p.has(y.id)).some((y) => y.allowedLaneIds && !y.allowedLaneIds.includes(o))) return null;
  const E = { ...e, cards: e.cards.map((y) => p.has(y.id) ? { ...y, laneId: o } : y) }, T = e.lanes[l].capacity;
  return T !== void 0 && Ne(E, o) > T ? null : E;
}
const Hr = {
  version: 1,
  kind: "release-plan",
  title: "What makes the Friday release?",
  lanes: [
    { id: "friday", label: "Friday release", capacity: 8 },
    { id: "next", label: "Next week", capacity: 12 },
    { id: "backlog", label: "Unscheduled" }
  ],
  cards: [
    { id: "guardrails", label: "Permission checks", laneId: "next", points: 2 },
    { id: "invite", label: "Team invitations", laneId: "backlog", points: 3, dependsOn: ["guardrails"] },
    { id: "billing", label: "Invoice download", laneId: "friday", points: 3 },
    { id: "export", label: "Workspace export", laneId: "next", points: 4 }
  ]
}, at = /* @__PURE__ */ new Map(), Do = { "launch-plan": "launch plan", pipeline: "sales pipeline", budget: "budget", "hiring-plan": "hiring plan", nest: "nested board" };
function Br(e) {
  at.set(e.kind, e);
}
function Ur(e) {
  return typeof e == "string" && at.has(e);
}
function ye(e) {
  const n = at.get(e);
  if (!n) throw new Error(`The ${Do[e] ?? e} rules have not loaded. Load slateboxjs/boards (in a browser) or slateboxjs/workshops/rules (on a server) first.`);
  return n;
}
let An = null;
function Gr(e) {
  An = e;
}
function Kr() {
  return An !== null;
}
function me() {
  if (!An) throw new Error("This board has rules, and they have not loaded. Load slateboxjs/workshops/behaviour first.");
  return An;
}
const P = (e) => "“" + e.replace(/[“”]/g, '"') + "”", _e = (e) => e.length < 2 ? e.join("") : e.slice(0, -1).join(", ") + " and " + e[e.length - 1], Et = (e) => e.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), lt = (e) => e.trim().replace(/^["'“‘](.+)["'”’]$/, "$1").trim(), dt = (e) => e.trim().replace(/([^.…])[.!]$/, "$1"), qr = (e) => lt(dt(e)), Ho = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
  "twenty"
], Bo = (e) => /^\d+$/.test(e) ? Number(e) : /^an?$|^a single$/i.test(e) ? 1 : Ho.indexOf(e.toLowerCase()), Uo = /^(?:this|it|that|here|there|this one|that one|(?:this|that|the selected|the current) (?:lane|column|card|feature|step|station|stop|token|one))$/i;
function Zt(e, n) {
  const o = /* @__PURE__ */ new Set(), t = (l) => {
    const s = lt(l);
    s && o.add(s);
  };
  t(e), t(dt(e));
  for (const l of [...o]) t(l.replace(/^(?:the|my|our)\s+/i, ""));
  for (const l of [...o]) t(l.replace(new RegExp("^(?:" + n + ")\\s+(?:(?:called|named)\\s+)?", "i"), ""));
  for (const l of [...o]) t(l.replace(new RegExp("\\s+(?:" + n + ")$", "i"), ""));
  return [...o];
}
const Bn = "[^\\p{L}\\p{N}]", _t = [
  (e, n) => e === n,
  // “Customer calls” for “Customer calls · $50 per call”.
  (e, n) => e.startsWith(n + " · "),
  (e, n) => n.length > 1 && new RegExp("^" + Et(n) + "(?:$|" + Bn + ")", "u").test(e),
  (e, n) => n.length > 2 && new RegExp("(?:^|" + Bn + ")" + Et(n) + "(?:$|" + Bn + ")", "u").test(e)
], Nt = ["first", "second", "third", "fourth", "fifth"];
function Go(e, n, o) {
  const t = new RegExp("^(?:the\\s+)?(?:(" + Nt.join("|") + "|last)\\s+(?:" + o + ")|(?:" + o + ")\\s+(\\d|one|two|three|four|five))$", "i").exec(lt(dt(n)));
  if (!t) return null;
  const l = (t[1] ?? t[2]).toLowerCase(), s = l === "last" ? e.length - 1 : t[1] ? Nt.indexOf(l) : Bo(l) - 1;
  return e[s] ?? null;
}
function Un(e, n, o, t, l) {
  const s = Zt(n, o);
  if (s.some((b) => Uo.test(b))) {
    const b = t && e.find((I) => I.id === t);
    return b ? { item: b, rank: 0 } : { pointing: !0 };
  }
  for (const b of s) {
    if (!b.startsWith("@")) continue;
    const I = e.find((E) => E.id === b.slice(1));
    if (I) return { item: I, rank: 0 };
  }
  for (const [b, I] of _t.entries())
    for (const E of s) {
      const T = e.filter((y) => I(y.label.toLowerCase(), E.toLowerCase()));
      if (T.length === 1) return { item: T[0], rank: b };
      if (T.length > 1) return { several: T };
    }
  const p = l ? Go(e, n, o) : null;
  return p ? { item: p, rank: _t.length } : {};
}
class kn extends Error {
  /** `unknown`: nothing has that name; `ambiguous`: several things do; `no-selection`: “this” with nothing selected. */
  constructor(n, o, t = []) {
    super(n), this.reason = o, this.candidates = t;
  }
}
function Zn(e, n, o, t, l = !1) {
  return { find: (I) => {
    const E = Un(e, I, n, t, l);
    if (E.item) return E.item;
    const T = Zt(I, n), y = T[T.length - 1];
    if (E.pointing) throw new kn("Select a " + o + " on the canvas first, or use its name.", "no-selection");
    if (E.several) {
      const v = [...new Set(E.several.map((A) => A.label))];
      throw new kn(v.length === 1 ? E.several.length + " " + o + "s are called " + P(v[0]) + ". Select the one you mean on the canvas and say “this " + o + "”." : "More than one " + o + " matches " + P(y) + ": " + _e(v.slice(0, 6).map(P)) + ". Use the whole name.", "ambiguous", E.several.map((A) => A.id));
    }
    const k = e.map((v) => v.label);
    throw new kn("There is no " + o + " called " + P(y) + " here." + (k.length && k.length <= 6 ? " The " + o + "s are " + _e(k.map(P)) + "." : k.length ? "" : " There are no " + o + "s yet."), "unknown", e.map((v) => v.id));
  }, attempt: (I) => Un(e, I, n, t, l).item ?? null, rank: (I) => Un(e, I, n, t, l).rank ?? 1 / 0 };
}
const Vt = ["lanes", "release-plan", "customer-interviews", "experiment-budget", "map", "launch-plan", "pipeline", "budget", "hiring-plan", "nest"], Ie = [...Vt], ze = ["lanes", "release-plan", "customer-interviews", "experiment-budget"], Qt = Vt.slice(5);
function Cn(e) {
  if (e.lanes[0]?.station) return "map";
  const n = ie(e);
  return n || (e.kind === "release-plan" ? "release-plan" : Je(e) ?? "lanes");
}
const W = {
  releaseLanes: "A release plan keeps the releases it came with. You can rename them and set how many points each holds.",
  releaseOrder: "A release plan keeps its releases in the order they came in: that order says which release is earlier. You can rename them and set how many points each holds.",
  releaseCards: "A release plan keeps the features it came with. You can rename them, move them and set their points.",
  keepsLanes: "This workshop keeps the lanes it came with. You can rename them, and rename and move its cards.",
  keepsOrder: "This workshop keeps its lanes in the order they came in. You can rename them, and rename and move its cards.",
  keepsCards: "This workshop keeps the cards it came with. You can rename them and move them between its lanes.",
  notPoints: "This workshop counts cards, not points. You can set how many cards a lane holds.",
  mapPoints: "A map counts tokens, not points. You can set how many tokens a step holds.",
  notDepends: "Only a release plan keeps track of what depends on what.",
  notMap: "Choose an interactive map to edit its stations.",
  mapAddLane: "On a map a new step follows another one. Say which step it comes after.",
  mapCardLanes: "A map’s tokens go where its paths lead. Connect or disconnect steps instead.",
  mapOutcome: "A map says what happens when a token reaches a step. Change what that step says instead.",
  lines: "Lines join the cards of a lane workshop to notes and to each other. This board keeps the cards it came with.",
  businessLines: "Lines join the cards of a lane workshop to notes and to each other. Cards on this board carry no lines.",
  launchLanes: "A launch plan keeps the teams it came with. You can rename them and move tasks between them.",
  pipelineLanes: "A pipeline keeps the stages it came with. You can rename them and set how many deals a stage holds.",
  budgetLanes: "A budget keeps the teams it came with. Move money between them instead.",
  notTasks: "Only a launch plan's tasks take days and wait on each other.",
  notAmounts: "Only a pipeline's deals and a budget's line items carry an amount.",
  notTarget: "Only a pipeline has a forecast target.",
  notBudget: "Only a budget moves money between teams.",
  businessCards: "Cards on this board go where its rules let them.",
  noRules: "Only lane boards and pipelines take rules for now."
}, Vn = {
  "launch-plan": W.launchLanes,
  pipeline: W.pipelineLanes,
  budget: W.budgetLanes,
  "hiring-plan": W.launchLanes.replace("launch", "hiring").replace("tasks", "hires"),
  nest: "This board keeps its two areas. You can rename them."
}, le = (e, n) => Object.fromEntries(Ie.filter((o) => !e.includes(o)).map((o) => [o, n])), oe = (e, n, o = !1) => ({ type: "text", max: e, about: n, ...o && { optional: o } }), Q = (e, n = !1) => ({ type: "ref", of: "lane", about: e, ...n && { optional: n } }), ne = (e) => ({ type: "ref", of: "card", about: e }), Gn = (e) => ({ map: e }), be = le(["map"], W.notMap), ve = (e, n = 1e9, o = 0, t = !1) => ({ type: "integer", min: o, max: n, about: e, ...t && { optional: t } }), Qn = [
  {
    kind: "rename_workshop",
    summary: "Rename the workshop or map. The slate takes the same name.",
    intent: !0,
    fields: { title: oe(120, "The new name, 1 to 120 characters of plain text.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "rename_lane",
    summary: "Rename a lane, or a step on a map.",
    intent: !0,
    fields: { lane: Q("The lane or step."), label: oe(80, "The new name, 1 to 80 characters of plain text.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "rename_card",
    summary: "Rename a card, a feature or a token.",
    intent: !0,
    fields: { card: ne("The card or token."), label: { type: "text", max: 80, min: 0, about: "The new words, up to 80 characters of plain text. Empty makes an empty card, except on a launch plan, pipeline, budget, hiring plan or nest board, where a card is named: 1 to 80 characters." } },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "add_lane",
    summary: "Add a lane at the end, optionally with how many cards it holds. A workshop has up to five lanes.",
    intent: !1,
    fields: { label: oe(80, "The lane’s name."), capacity: { type: "integer", min: 1, max: 24, optional: !0, about: "How many cards it holds, 1 to 24. Leave it out for any number." } },
    boards: ["lanes"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, map: W.mapAddLane, ...Vn }
  },
  {
    kind: "remove_lane",
    summary: "Remove an empty lane, or a step no token is at, with everything that pointed at it. Two always stay.",
    intent: !1,
    fields: { lane: Q("The lane or step.") },
    boards: ["lanes", "map"],
    refusals: { "release-plan": W.releaseLanes, "customer-interviews": W.keepsLanes, "experiment-budget": W.keepsLanes, ...Vn }
  },
  {
    kind: "add_card",
    summary: "Add a card to a lane that has room, or a token at a step. A workshop has up to 24 cards.",
    intent: !1,
    fields: {
      lane: Q("The lane or step it starts in."),
      label: oe(80, "What the card says. Left out, the card is empty (on a map, the token is numbered); a launch plan, pipeline, budget, hiring plan or nest board needs it.", !0),
      allowedLanes: { type: "refs", of: "lane", min: 1, max: 5, optional: !0, about: "Lane boards only: the lanes it may go in, including the one it starts in. Leave it out for any lane." },
      duration: ve("Launch plan: days, 1 to 60 (2).", 60, 1, !0),
      lag: ve("Launch plan: days it waits.", 120, 0, !0),
      waitsOn: { type: "refs", of: "card", min: 0, max: 3, optional: !0, about: "Launch plan: what it waits on." },
      amount: ve("Pipeline or budget: the amount.", 1e9, 0, !0)
    },
    boards: ["lanes", "experiment-budget", "map", ...Qt],
    refusals: { "release-plan": W.releaseCards, "customer-interviews": W.keepsCards }
  },
  {
    kind: "remove_card",
    summary: "Remove a card or token, with the dependencies and outcomes that named it.",
    intent: !1,
    fields: { card: ne("The card or token.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "move_card",
    summary: "Move a card to a lane, or a token to a step, by the board’s rules. A release plan brings the features that must move with it.",
    intent: !0,
    fields: { card: ne("The card or token."), lane: Q("Where it goes.") },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "advance_card",
    summary: "Move a token on along the one path that leads on from its step.",
    intent: !0,
    fields: { card: ne("The token.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_lane_capacity",
    summary: "Set how many cards (on a release plan, points; on a map, tokens) a lane holds, or null for any number.",
    intent: !1,
    fields: { lane: Q("The lane or step."), capacity: { type: "integer", min: 1, max: { default: 24, "release-plan": 576 }, nullable: !0, about: "The limit, or null to remove it." } },
    boards: Ie.filter((e) => e !== "launch-plan" && e !== "budget"),
    refusals: { "launch-plan": W.launchLanes, budget: W.budgetLanes }
  },
  {
    kind: "set_card_lanes",
    summary: "Say which lanes a card may go in (including the one it is in), or null for any lane.",
    intent: !1,
    fields: { card: ne("The card."), lanes: { type: "refs", of: "lane", min: 1, max: 5, nullable: !0, about: "The lanes, or null for any lane." } },
    boards: ze,
    refusals: { ...Gn(W.mapCardLanes), ...le([...ze, "map"], W.businessCards) }
  },
  {
    kind: "set_card_points",
    summary: "On a release plan, set a feature’s effort, 1 to 24 points.",
    intent: !1,
    fields: { card: ne("The feature."), points: { type: "integer", min: 1, max: 24, about: "Its points." } },
    boards: ["release-plan"],
    refusals: { ...le(["release-plan"], W.notPoints), map: W.mapPoints }
  },
  {
    kind: "set_card_dependencies",
    summary: "On a release plan, set (or add to, or remove from) the features a feature depends on. Each must be planned in the same release or an earlier one.",
    intent: !1,
    fields: {
      card: ne("The feature."),
      dependsOn: { type: "refs", of: "card", min: 0, max: 23, about: "The features it depends on. An empty list with mode replace removes them all." },
      mode: { type: "choice", values: ["replace", "add", "remove"], optional: !0, about: "replace (the default), add or remove." }
    },
    boards: ["release-plan"],
    refusals: { ...le(["release-plan"], W.notDepends), "launch-plan": "On a launch plan, link and unlink tasks instead." }
  },
  {
    kind: "set_outcome",
    summary: "Set what the workshop says when a card is in a lane, and when it is not. A label names the outcome; the same label on the same card replaces it.",
    intent: !1,
    fields: {
      card: ne("The card."),
      lane: Q("The lane."),
      whenPresent: oe(160, "What it says when the card is there."),
      whenAbsent: oe(160, "What it says otherwise."),
      label: oe(80, "The outcome’s name. Left out, it is “CARD in LANE”, and an outcome for that card and lane is replaced.", !0)
    },
    boards: ze,
    refusals: { ...Gn(W.mapOutcome), ...le([...ze, "map"], W.businessCards) }
  },
  {
    kind: "remove_outcome",
    summary: "Remove one outcome from a card, or all of them.",
    intent: !1,
    fields: { card: ne("The card."), outcome: { type: "ref", of: "outcome", optional: !0, about: "The outcome. Left out, every outcome of the card goes." } },
    boards: ze,
    refusals: { ...Gn(W.mapOutcome), ...le([...ze, "map"], W.businessCards) }
  },
  {
    kind: "set_presentation_order",
    summary: "Set the order the lanes or steps are presented in: each once.",
    intent: !1,
    fields: { lanes: { type: "refs", of: "lane", min: 2, max: 5, about: "Every lane or step, once, in order." } },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "present_lane",
    summary: "Present one lane or step first, or just before or after another, keeping the rest in order.",
    intent: !1,
    fields: { lane: Q("The lane or step."), before: Q("Present it just before this one.", !0), after: Q("Present it just after this one.", !0) },
    boards: Ie,
    refusals: {}
  },
  {
    kind: "add_station",
    summary: "Add a step after another on a map, at the nearest free place. A map has up to five steps.",
    intent: !1,
    fields: { from: Q("The step it follows."), label: oe(80, "The new step’s name."), outcome: oe(160, "What it says when a token arrives. Left out, its name.", !0) },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "insert_station",
    summary: "Put a new step in front of another: whatever led there (or only `from`) now leads to the new step, and it leads on.",
    intent: !1,
    fields: {
      before: Q("The step it goes in front of."),
      from: Q("Only the path from this step is taken over.", !0),
      label: oe(80, "The new step’s name."),
      outcome: oe(160, "What it says when a token arrives. Left out, its name.", !0)
    },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "connect_stations",
    summary: "Open a path from one step to another.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "disconnect_stations",
    summary: "Remove the path between two steps.",
    intent: !1,
    fields: { from: Q("Where the path starts."), to: Q("Where it leads.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_outcome",
    summary: "Set what a step says when a token arrives.",
    intent: !1,
    fields: { station: Q("The step."), outcome: oe(160, "What it says.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_position",
    summary: "Place a step on the map’s 3 by 3 grid (column and row from 0 to 2), on a free place.",
    intent: !1,
    fields: { station: Q("The step."), column: { type: "integer", min: 0, max: 2, about: "Column, 0 to 2." }, row: { type: "integer", min: 0, max: 2, about: "Row, 0 to 2." } },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_image",
    summary: "Put a picture (an HTTPS address and a description) on a step, or null to remove it.",
    intent: !1,
    fields: { station: Q("The step."), image: { type: "image", about: "{src, alt}: an HTTPS address and what the picture shows; or null." } },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "set_station_image_alt",
    summary: "Change the description of a step’s picture.",
    intent: !1,
    fields: { station: Q("The step."), alt: oe(240, "What the picture shows.") },
    boards: ["map"],
    refusals: be
  },
  {
    kind: "connect_cards",
    summary: "Draw a line from one card to another, as a person draws a connector between two notes. The line stays with both cards wherever they move, on or off the lanes.",
    intent: !1,
    fields: { card: ne("The card the line starts at."), to: ne("The card it points to."), label: oe(200, "Words on the line.", !0) },
    boards: ["lanes"],
    refusals: wn()
  },
  {
    kind: "disconnect_cards",
    summary: "Take away the lines between two cards.",
    intent: !1,
    fields: { card: ne("One card."), to: ne("The other card.") },
    boards: ["lanes"],
    refusals: wn()
  },
  {
    kind: "connect_note",
    summary: "Draw a line between a card and an ordinary note of the slate (by the note’s id). The line stays when the card moves, and when either becomes the other.",
    intent: !1,
    fields: {
      card: ne("The card."),
      note: oe(64, "The id of an ordinary note on the slate."),
      direction: { type: "choice", values: ["to_note", "from_note"], optional: !0, about: "to_note (the default): the line points from the card to the note; from_note: from the note to the card." },
      label: oe(200, "Words on the line.", !0)
    },
    boards: ["lanes"],
    refusals: wn()
  },
  {
    kind: "disconnect_note",
    summary: "Take away the lines between a card and an ordinary note of the slate.",
    intent: !1,
    fields: { card: ne("The card."), note: oe(64, "The id of the note.") },
    boards: ["lanes"],
    refusals: wn()
  },
  {
    kind: "set_task",
    summary: "Set a task's days, or the days it waits. Every task ends by launch.",
    intent: !1,
    fields: { card: ne("The task."), duration: ve("Its days, 1 to 60.", 60, 1, !0), lag: ve("Days it waits, 0 or more.", 120, 0, !0) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "link_tasks",
    summary: "Make a task wait on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "unlink_tasks",
    summary: "Stop a task waiting on another.",
    intent: !1,
    fields: { card: ne("The task that waits."), waitsOn: ne("The task it waits on.") },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_launch_day",
    summary: "Set launch day. Every task ends by it.",
    intent: !1,
    fields: { day: ve("Launch day.", 120, 5) },
    boards: ["launch-plan"],
    refusals: le(["launch-plan"], W.notTasks)
  },
  {
    kind: "set_amount",
    summary: "Set a deal's amount or a line item's cost.",
    intent: !1,
    fields: { card: ne("The deal or line item."), amount: ve("Whole currency units.") },
    boards: ["pipeline", "budget"],
    refusals: le(["pipeline", "budget"], W.notAmounts)
  },
  {
    kind: "set_target",
    summary: "Set a pipeline's forecast target.",
    intent: !1,
    fields: { amount: ve("Whole currency units.", 1e9, 1) },
    boards: ["pipeline"],
    refusals: le(["pipeline"], W.notTarget)
  },
  {
    kind: "shift_budget",
    summary: "Move money between teams. The total stays.",
    intent: !1,
    fields: { from: Q("The team giving."), to: Q("The team receiving."), amount: ve("Whole currency units.", 1e9, 1) },
    boards: ["budget"],
    refusals: le(["budget"], W.notBudget)
  },
  {
    kind: "add_rule",
    summary: 'Add a rule (capacity, path from a lane or "any", gate or bin; refuse or warn). It moves no card.',
    intent: !1,
    fields: { rule: { type: "rule", about: "The rule, lanes by id or name." } },
    boards: ["lanes", "pipeline"],
    refusals: le(["lanes", "pipeline"], W.noRules)
  },
  {
    kind: "set_rule",
    summary: "Change a rule: on, severity, max (a limit) or to (a path).",
    intent: !1,
    fields: {
      rule: oe(64, "The rule id."),
      on: { type: "flag", optional: !0, about: "On or off." },
      severity: { type: "choice", values: ["refuse", "warn"], optional: !0, about: "refuse or warn." },
      max: { type: "integer", min: 1, max: 24, optional: !0, about: "A limit." },
      to: { type: "refs", of: "lane", min: 1, max: 4, optional: !0, about: "Where a path leads." }
    },
    boards: ["lanes", "pipeline"],
    refusals: le(["lanes", "pipeline"], W.noRules)
  },
  { kind: "remove_rule", summary: "Remove a rule.", intent: !1, fields: { rule: oe(64, "The rule id.") }, boards: ["lanes", "pipeline"], refusals: le(["lanes", "pipeline"], W.noRules) }
];
function wn() {
  return { ...le(["lanes"], W.businessLines), "release-plan": W.lines, "customer-interviews": W.lines, "experiment-budget": W.lines, map: W.lines };
}
const Ko = (e) => e === "add_rule" || e === "set_rule" || e === "remove_rule", Rt = { kinds: ["capacity", "path", "gate", "bin"], keys: {} }, qo = (e, n) => typeof e == "number" ? e : (n && e[n]) ?? e.default;
function Jo(e, n) {
  const o = { anyOf: [
    { type: "string", minLength: 1, maxLength: 200 },
    { type: "object", additionalProperties: !1, required: ["id"], properties: { id: { type: "string", minLength: 1, maxLength: 64 } } }
  ] }, t = (l, s) => s ? { anyOf: [l, { type: "null" }] } : l;
  switch (e.type) {
    case "text":
      return { type: "string", minLength: e.min ?? 1, maxLength: e.max, description: e.about };
    case "ref":
      return { ...o, description: e.about };
    case "refs":
      return { ...t({ type: "array", items: o, minItems: e.min, maxItems: e.max }, e.nullable), description: e.about };
    case "integer":
      return { ...t({ type: "integer", minimum: e.min, maximum: qo(e.max, n) }, e.nullable), description: e.about };
    case "image":
      return { ...t({
        type: "object",
        additionalProperties: !1,
        required: ["src", "alt"],
        properties: { src: { type: "string", minLength: 1, maxLength: 2048 }, alt: { type: "string", minLength: 1, maxLength: 240 } }
      }, !0), description: e.about };
    case "choice":
      return { enum: e.values, description: e.about };
    case "flag":
      return { type: "boolean", description: e.about };
    case "rule":
      return { type: "object", required: ["kind"], additionalProperties: !1, properties: {
        kind: { enum: Rt.kinds },
        severity: { enum: ["refuse", "warn"] },
        where: o,
        max: { type: "integer", minimum: 1, maximum: 24 },
        from: o,
        to: { type: "array", items: o, minItems: 1, maxItems: 4 },
        noSkip: { const: !0 },
        into: o,
        needs: { type: "array", items: { type: "string", maxLength: 40 }, minItems: 1, maxItems: 3 },
        lane: o,
        ...Rt.keys
      }, description: e.about };
  }
}
const Xt = (e) => "optional" in e && e.optional === !0;
function Jr(e) {
  const n = e ? Cn(Z(e)) : void 0;
  return Qn.map((o) => {
    const t = Object.entries(o.fields), l = {
      type: "object",
      additionalProperties: !1,
      description: o.summary,
      required: ["kind", ...t.filter(([, p]) => !Xt(p)).map(([p]) => p)],
      properties: { kind: { const: o.kind }, ...Object.fromEntries(t.map(([p, b]) => [p, Jo(b, n)])) }
    }, s = { kind: o.kind, summary: o.summary, intent: o.intent, boards: [...o.boards], schema: l };
    return n && (s.accepted = o.boards.includes(n), s.accepted || (s.refusal = o.refusals[n])), s;
  });
}
const gn = {
  lane: "lanes?|columns?|lists?|stages?|windows?|releases?|teams?",
  card: "cards?|features?|notes?|items?|tasks?|deals?|line items?|piles?|themes?",
  step: "steps?|stations?|stops?|stages?|places?",
  token: "tokens?|cards?|pieces?|markers?"
};
function Yo(e, n) {
  const o = !!e.lanes[0]?.station, t = Zn(e.lanes, o ? gn.step : gn.lane, o ? "step" : "lane", n?.kind === "lane" ? n.id : void 0, !0), l = Zn(e.cards, o ? gn.token : gn.card, o ? "token" : "card", n?.kind === "card" ? n.id : void 0);
  if (!o) return { lanes: t, cards: l };
  const s = (p) => e.cards.length === 1 && /^(?:(?:the|our|my)\s+)?(?:token|card|piece|marker)$/i.test(p.trim()) ? e.cards[0] : null;
  return { lanes: t, cards: {
    find: (p) => s(p) ?? l.find(p),
    attempt: (p) => s(p) ?? l.attempt(p),
    rank: (p) => s(p) ? 0 : l.rank(p)
  } };
}
class F {
  constructor(n, o, t = null, l, s, p) {
    this.reason = n, this.code = o, this.laneId = t, this.cardId = l, this.candidates = s, this.limits = p;
  }
}
function Tn(e, n) {
  return n === "map" ? e : /acyclic/.test(e) ? "Those features would end up waiting on each other. Choose a dependency that does not lead back." : /same window as its feature or earlier/.test(e) ? "A feature can only depend on one planned in the same release or an earlier one. Move one of them first." : /exceeds its (?:capacity|point budget)/.test(e) ? e.replace(/^(?:Lane|Release) "(.+)" exceeds its (?:capacity|point budget)\.$/, "“$1” would hold more than its limit. Raise the limit or move something out first.") : /2 to 5 lanes/.test(e) ? "A workshop has from two to five lanes." : /effort points/.test(e) ? "A feature takes from 1 to 24 points." : e;
}
function K(e, n, o = null, t) {
  try {
    return Z(e);
  } catch (l) {
    throw new F(Tn(l instanceof Error ? l.message : String(l), n), "refused", o, t);
  }
}
function Zo(e, n) {
  for (const t of Object.keys(e)) if (t !== "kind" && !Object.prototype.hasOwnProperty.call(n.fields, t)) return n.kind + " does not take " + t + ".";
  const o = (t) => typeof t == "string" && t.trim().length > 0 || !!t && typeof t == "object" && !Array.isArray(t) && typeof t.id == "string" && Object.keys(t).length === 1;
  for (const [t, l] of Object.entries(n.fields)) {
    const s = e[t];
    if (s === void 0) {
      if (Xt(l)) continue;
      return n.kind + " needs " + t + ".";
    }
    const p = n.kind + " needs " + t + " as ";
    switch (l.type) {
      case "text":
        if (typeof s != "string") return p + "text.";
        break;
      case "ref":
        if (!o(s)) return p + "an id or a name.";
        break;
      case "refs":
        if (s === null && l.nullable) break;
        if (!Array.isArray(s) || s.length > l.max || !s.every(o)) return p + "a list of up to " + l.max + " ids or names" + (l.nullable ? ", or null." : ".");
        break;
      case "integer":
        if (s === null && l.nullable) break;
        if (typeof s != "number" || !Number.isFinite(s)) return p + "a number" + (l.nullable ? " or null." : ".");
        break;
      case "image":
        if (s === null) break;
        if (!s || typeof s != "object" || typeof s.src != "string" || typeof s.alt != "string" || Object.keys(s).some((b) => b !== "src" && b !== "alt")) return p + "{src, alt} or null.";
        break;
      case "choice":
        if (!l.values.includes(s)) return p + l.values.join(", ") + ".";
        break;
      case "flag":
        if (typeof s != "boolean") return p + "true or false.";
        break;
      case "rule":
        if (!s || typeof s != "object" || Array.isArray(s) || typeof s.kind != "string") return p + "an object with a kind.";
        break;
    }
  }
  return null;
}
function Vo(e, n, o, t, l) {
  const s = structuredClone(e), p = o === "map", b = o === "release-plan", I = Yo(s, t), E = { lane: p ? "step" : "lane", card: p ? "token" : "card" };
  function T(r, m, x, S, O = null) {
    if (typeof x == "object") {
      const M = r.find((q) => q.id === x.id);
      if (!M) throw new F("That " + S + " is no longer on the workshop.", "gone", O);
      return M;
    }
    const $ = r.find((M) => M.id === x);
    if ($) return $;
    try {
      return m.find(x);
    } catch (M) {
      if (!(M instanceof kn)) throw M;
      const q = M.reason === "ambiguous" ? "ambiguous_reference" : M.reason === "no-selection" ? "no_selection" : "unknown_reference";
      throw new F(M.message, q, O, void 0, M.candidates.length ? M.candidates : void 0);
    }
  }
  const y = (r, m = null) => T(s.lanes, I.lanes, r, "lane", m), k = (r, m = null) => T(s.cards, I.cards, r, "card", m), v = (r) => {
    try {
      return y(r);
    } catch {
      return null;
    }
  }, A = (r, m, x = {}, S = !0) => ({ board: r, said: m, changed: S, ...x }), N = (r) => s.cards.filter((m) => m.laneId === r).length, D = (r) => p ? "The presentation opens with " + P(r[0].label) + "." : "The presentation now runs " + r.map((m) => P(m.label)).join(", then ") + ".";
  if (n.kind === "add_rule" || n.kind === "set_rule" || n.kind === "remove_rule")
    return me().edit(s, n, l, {
      lane: (r) => y(r),
      card: (r) => k(r),
      done: (r, m, x) => A(r, m, x),
      refuse: (r, m = {}) => {
        throw new F(r, m.code ?? "refused", m.laneId ?? null, m.cardId);
      }
    });
  if (Qt.includes(o)) {
    n.kind === "add_card" && Mt(n, o, y(n.lane).id);
    const r = {
      card: (x) => k(x),
      lane: (x) => y(x),
      refuse: (x, S = {}) => {
        throw new F(x, S.code ?? "refused", S.laneId ?? null, S.cardId, void 0, S.limits);
      },
      settle: (x, S = null, O) => K(x, o, S, O),
      done: (x, S, O) => A(x, S, O)
    }, m = ye(o).edit(s, n, r);
    if (m) return m;
  }
  switch (n.kind) {
    case "rename_workshop": {
      s.title = n.title;
      const r = K(s, o);
      return A(r, "Renamed the " + (p ? "map" : "workshop") + " to " + P(r.title) + ".");
    }
    case "rename_lane": {
      const r = y(n.lane), m = r.label;
      r.label = n.label;
      const x = K(s, o, r.id);
      return A(x, "Renamed " + P(m) + " to " + P(x.lanes.find((S) => S.id === r.id).label) + ".", { laneId: r.id });
    }
    case "rename_card": {
      const r = k(n.card), m = r.label;
      r.label = n.label;
      const x = K(s, o, r.laneId, r.id);
      return A(x, "Renamed " + P(m) + " to " + P(x.cards.find((S) => S.id === r.id).label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "add_lane": {
      if (s.lanes.length >= 5) throw new F("A workshop can have up to five lanes. Remove one first.", "refused");
      if (n.capacity !== void 0 && (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > 24))
        throw new F("A lane can hold from 1 to 24 cards.", "refused");
      let r;
      try {
        r = Tr(s, { label: n.label, ...n.capacity !== void 0 && { capacity: n.capacity } });
      } catch (x) {
        throw new F(Tn(x.message, o), "refused");
      }
      const m = r.lanes[r.lanes.length - 1];
      return A(r, "Added the lane " + P(m.label) + ".", { laneId: m.id });
    }
    case "remove_lane": {
      const r = y(n.lane), m = s.cards.filter((x) => x.laneId === r.id);
      if (p) {
        if (m.length) throw new F(P(m[0].label) + " is at " + P(r.label) + ". Move it to another step first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A map needs at least two steps.", "refused", r.id);
      } else {
        if (m.length) throw new F(P(r.label) + " holds " + m.length + (m.length === 1 ? " card" : " cards") + ". Move or remove " + (m.length === 1 ? "it" : "them") + " first.", "refused", r.id);
        if (s.lanes.length <= 2) throw new F("A workshop needs at least two lanes.", "refused", r.id);
      }
      s.lanes = s.lanes.filter((x) => x !== r);
      for (const x of s.lanes) x.station && (x.station.next = x.station.next.filter((S) => S !== r.id));
      s.presentationOrder && (s.presentationOrder = s.presentationOrder.filter((x) => x !== r.id));
      for (const x of s.cards) x.allowedLaneIds && (x.allowedLaneIds = x.allowedLaneIds.filter((S) => S !== r.id));
      return yn(s, (x) => x.laneId === r.id), s.behaviour && (s.behaviour = me().dropLane(s.behaviour, r.id)), A(K(s, o), "Removed the " + E.lane + " " + P(r.label) + ".", { laneId: r.id });
    }
    case "add_card": {
      const r = y(n.lane);
      if (p) {
        if (n.allowedLanes !== void 0) throw new F(W.mapCardLanes, "not_on_this_board", r.id);
        let O = n.label;
        if (O === void 0) {
          let j = s.cards.length + 1;
          for (; s.cards.some((Y) => Y.label === "Token " + j); ) j++;
          O = "Token " + j;
        }
        const $ = new Set([...s.lanes, ...s.cards].map((j) => j.id));
        let M = 1;
        for (; $.has("token-" + M); ) M++;
        s.cards.push({ id: "token-" + M, label: O, laneId: r.id });
        const q = K(s, o, r.id);
        return A(q, "Added " + P(q.cards[q.cards.length - 1].label) + " at " + P(r.label) + ".", { laneId: r.id, cardId: "token-" + M });
      }
      if (Mt(n, o, r.id), s.cards.length >= 24) throw new F("A workshop can have up to 24 cards. Remove one first.", "refused", r.id);
      if (r.capacity !== void 0 && N(r.id) >= r.capacity)
        throw new F(P(r.label) + " is full: it holds " + r.capacity + (r.capacity === 1 ? " card" : " cards") + ". Add the card to another lane, or raise the limit.", "refused", r.id);
      const m = n.allowedLanes && [...new Set(n.allowedLanes.map((O) => y(O).id))];
      let x;
      try {
        x = Sr(s, r.id, { label: n.label?.trim() ?? "", ...m && { allowedLaneIds: m } });
      } catch (O) {
        throw new F(Tn(O.message, o), "refused", r.id);
      }
      const S = x.cards[x.cards.length - 1];
      return A(x, "Added " + (S.label ? P(S.label) : "an empty card") + " to " + P(r.label) + ".", { laneId: r.id, cardId: S.id });
    }
    case "remove_card": {
      const r = k(n.card);
      if (p && s.cards.length === 1) throw new F("A map needs at least one token.", "refused", r.laneId, r.id);
      if (b && s.cards.length === 1) throw new F("A release plan needs at least one feature.", "refused", r.laneId, r.id);
      if (o === "launch-plan" && s.cards.length === 1) throw new F("A launch plan needs at least one task.", "refused", r.laneId, r.id);
      s.cards = s.cards.filter((m) => m !== r);
      for (const m of s.cards)
        m.dependsOn?.includes(r.id) && (m.dependsOn = m.dependsOn.filter((x) => x !== r.id), m.dependsOn.length || delete m.dependsOn);
      return yn(s, (m) => m.cardId === r.id), A(K(Cr(s, r.id), o, r.laneId), "Removed the " + E.card + " " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "move_card": {
      const r = typeof n.lane == "object" ? s.lanes.find((S) => S.id === n.lane.id) ?? null : v(n.lane), m = k(n.card, r?.id ?? null), x = y(n.lane, m.laneId);
      return R(m, x);
    }
    case "advance_card": {
      const r = k(n.card), m = s.lanes.find((S) => S.id === r.laneId), x = m.station.next.map((S) => s.lanes.find((O) => O.id === S)).filter((S) => !!S);
      if (!x.length) throw new F(P(r.label) + " is at " + P(m.label) + ", and no path leads on from there.", "refused", m.id, r.id);
      if (x.length > 1)
        throw new F("From " + P(m.label) + " the path goes to " + x.map((S) => P(S.label)).join(" or ") + ". Say which, such as “Move " + r.label + " to " + x[0].label + "”.", "refused", m.id, r.id);
      return R(r, x[0]);
    }
    case "set_lane_capacity": {
      const r = y(n.lane), m = s.behaviour && me().setLimit(s, r.id, n.capacity, l);
      if (typeof m == "string") throw new F(m, "refused", r.id);
      if (m) return A(m, P(r.label) + (n.capacity === null ? " now holds any number of cards." : " now holds up to " + n.capacity + " cards."), { laneId: r.id });
      const x = p ? "token" : b ? "point" : "card";
      if (n.capacity === null)
        return delete r.capacity, A(K(s, o, r.id), p ? "Removed the limit at " + P(r.label) + "." : P(r.label) + " now holds any number of " + x + "s.", { laneId: r.id });
      const S = b ? 576 : 24;
      if (!Number.isInteger(n.capacity) || n.capacity < 1 || n.capacity > S)
        throw new F((p ? "A step" : "A lane") + " can hold from 1 to " + S + " " + x + "s.", "refused", r.id);
      const O = b ? s.cards.reduce(($, M) => $ + (M.laneId === r.id ? M.points ?? 1 : 0), 0) : N(r.id);
      if (O > n.capacity)
        throw new F(P(r.label) + " already holds " + O + " " + x + (O === 1 ? "" : "s") + ". Move some " + (p ? "on" : "out") + " first, or choose a higher " + (b ? "budget" : "number") + ".", "refused", r.id);
      return r.capacity = n.capacity, A(K(s, o, r.id), P(r.label) + " now holds up to " + n.capacity + " " + x + (n.capacity === 1 ? "" : "s") + ".", { laneId: r.id });
    }
    case "set_card_lanes": {
      const r = k(n.card);
      if (n.lanes === null)
        return delete r.allowedLaneIds, A(K(s, o, r.laneId, r.id), P(r.label) + " can now go in any lane.", { laneId: r.laneId, cardId: r.id });
      const m = [...new Set(n.lanes.map((S) => y(S)))], x = s.lanes.find((S) => S.id === r.laneId);
      if (!m.includes(x)) throw new F(P(r.label) + " is in " + P(x.label) + " now. Include " + P(x.label) + ", or move the card first.", "refused", x.id, r.id);
      return r.allowedLaneIds = m.map((S) => S.id), A(K(s, o, r.laneId, r.id), P(r.label) + " can now go only in " + _e(m.map((S) => P(S.label))) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_points": {
      const r = k(n.card);
      if (!Number.isInteger(n.points) || n.points < 1 || n.points > 24) throw new F("A feature takes from 1 to 24 points.", "refused", r.laneId, r.id);
      return r.points = n.points, A(K(s, o, r.laneId, r.id), P(r.label) + " now takes " + n.points + (n.points === 1 ? " point." : " points."), { laneId: r.laneId, cardId: r.id });
    }
    case "set_card_dependencies": {
      const r = k(n.card), m = [...new Set(n.dependsOn.map((S) => k(S)))], x = { laneId: r.laneId, cardId: r.id };
      if (n.mode === "remove") {
        const S = m.filter((O) => r.dependsOn?.includes(O.id));
        if (!S.length) throw new F(P(r.label) + " does not depend on " + _e(m.map((O) => P(O.label))) + ".", "refused", r.laneId, r.id);
        return r.dependsOn = r.dependsOn.filter((O) => !S.some(($) => $.id === O)), r.dependsOn.length || delete r.dependsOn, A(K(s, o, r.laneId, r.id), P(r.label) + " no longer depends on " + _e(S.map((O) => P(O.label))) + ".", x);
      }
      if (!m.length) {
        if (n.mode === "add") throw new F("Name the features " + P(r.label) + " depends on.", "refused", r.laneId, r.id);
        return delete r.dependsOn, A(K(s, o, r.laneId, r.id), P(r.label) + " no longer depends on anything.", x);
      }
      if (m.includes(r)) throw new F("A feature can’t depend on itself.", "refused", r.laneId, r.id);
      return r.dependsOn = [.../* @__PURE__ */ new Set([...n.mode === "add" ? r.dependsOn ?? [] : [], ...m.map((S) => S.id)])], A(K(s, o, r.laneId, r.id), P(r.label) + " now depends on " + _e(m.map((S) => P(S.label))) + ".", x);
    }
    case "set_outcome": {
      const r = k(n.card), m = y(n.lane), x = s.signals ?? (s.signals = []), S = n.label, O = S === void 0 ? x.filter((j) => j.cardId === r.id && j.laneId === m.id) : x.filter((j) => j.cardId === r.id && j.label.toLowerCase() === S.toLowerCase());
      if (S !== void 0 && O.length > 1) throw new F("Two outcomes on this card have that name.", "refused", m.id, r.id);
      if (!O.length && x.length >= 24) throw new F("A workshop can have up to 24 outcomes. Remove one first.", "refused", m.id, r.id);
      let $ = 1;
      for (; x.some((j) => j.id === "signal-" + $); ) $++;
      const q = { label: S ?? O[0]?.label ?? (r.label + " in " + m.label).slice(0, 80).trim(), cardId: r.id, laneId: m.id, whenPresent: n.whenPresent, whenAbsent: n.whenAbsent };
      return O.length ? Object.assign(O[0], q) : x.push({ id: "signal-" + $, ...q }), A(K(s, o, m.id, r.id), "When " + P(r.label) + " is in " + P(m.label) + " the workshop says " + P(n.whenPresent) + ". Otherwise it says " + P(n.whenAbsent) + ".", { laneId: m.id, cardId: r.id });
    }
    case "remove_outcome": {
      const r = k(n.card), m = (s.signals ?? []).filter((x) => x.cardId === r.id);
      if (n.outcome === void 0) {
        if (!m.length) throw new F(P(r.label) + " has no outcome to remove.", "refused", r.laneId, r.id);
        yn(s, (x) => x.cardId === r.id);
      } else {
        const x = T(m, Zn(m, "outcomes?", "outcome"), n.outcome, "outcome", r.laneId);
        yn(s, (S) => S.id === x.id);
      }
      return A(K(s, o, r.laneId, r.id), "Removed the outcome from " + P(r.label) + ".", { laneId: r.laneId, cardId: r.id });
    }
    case "set_presentation_order": {
      const r = n.lanes.map((m) => y(m));
      if (r.length !== s.lanes.length || new Set(r).size !== s.lanes.length) throw new F("Include each scene once in the presentation order.", "refused");
      return s.presentationOrder = r.map((m) => m.id), A(K(s, o), D(r));
    }
    case "present_lane": {
      if (n.before !== void 0 && n.after !== void 0) throw new F("Say before or after, not both.", "invalid_edit");
      const r = y(n.lane), m = n.before ?? n.after, x = m === void 0 ? void 0 : y(m);
      if (x && x.id === r.id) throw new F("Choose two different scenes.", "refused", r.id);
      const S = ft(s).filter((O) => O.id !== r.id);
      return S.splice(x ? S.findIndex((O) => O.id === x.id) + (n.after !== void 0 ? 1 : 0) : 0, 0, r), s.presentationOrder = S.map((O) => O.id), A(K(s, o, r.id), D(S), { laneId: r.id });
    }
    case "add_station": {
      const r = y(n.from);
      let m;
      try {
        m = qt(s, r.id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch (S) {
        throw new F(S.message, "refused", r.id);
      }
      const x = m.lanes[m.lanes.length - 1];
      return A(m, "Added a path from " + P(r.label) + " to " + P(x.label) + ".", { laneId: x.id });
    }
    case "insert_station": {
      const r = y(n.before), m = n.from === void 0 ? void 0 : y(n.from), x = m ? [m] : s.lanes.filter(($) => $.station.next.includes(r.id));
      if (m && !m.station.next.includes(r.id))
        throw new F("There is no path from " + P(m.label) + " to " + P(r.label) + ". Try “Add " + n.label + " after " + m.label + "”.", "refused", m.id);
      if (!x.length) throw new F("Nothing leads to " + P(r.label) + " yet. Try “Add " + n.label + " after " + r.label + "”.", "refused", r.id);
      let S;
      try {
        S = qt(s, x[0].id, { label: n.label, outcome: n.outcome ?? n.label });
      } catch ($) {
        throw new F($.message, "refused", r.id);
      }
      const O = S.lanes[S.lanes.length - 1];
      for (const $ of S.lanes)
        x.some((M) => M.id === $.id) && ($.station.next = [...new Set($.station.next.map((M) => M === r.id ? O.id : M))]);
      return O.station.next = [r.id], A(K(S, o, O.id), "Added " + P(O.label) + " before " + P(r.label) + ".", { laneId: O.id });
    }
    case "connect_stations": {
      const r = y(n.from), m = y(n.to);
      if (r.id === m.id) throw new F("Connect two different steps.", "refused", r.id);
      return r.station.next.includes(m.id) ? A(s, P(r.label) + " already leads to " + P(m.label) + ".", { laneId: r.id }, !1) : (r.station.next.push(m.id), A(K(s, o, r.id), "Connected " + P(r.label) + " to " + P(m.label) + ".", { laneId: r.id }));
    }
    case "disconnect_stations": {
      const r = y(n.from), m = y(n.to);
      if (!r.station.next.includes(m.id)) throw new F("There is no path between " + P(r.label) + " and " + P(m.label) + ".", "refused", r.id);
      return r.station.next = r.station.next.filter((x) => x !== m.id), A(K(s, o, r.id), "Removed the path from " + P(r.label) + " to " + P(m.label) + ".", { laneId: r.id });
    }
    case "set_station_outcome": {
      const r = y(n.station);
      return r.station.outcome = n.outcome, A(K(s, o, r.id), "Changed what happens at " + P(r.label) + ".", { laneId: r.id });
    }
    case "set_station_position": {
      const r = y(n.station);
      return Object.assign(r.station, { column: n.column, row: n.row }), A(K(s, o, r.id), "Moved " + P(r.label) + " to column " + (n.column + 1) + ", row " + (n.row + 1) + ".", { laneId: r.id });
    }
    case "set_station_image": {
      const r = y(n.station);
      return n.image === null ? (delete r.station.image, A(K(s, o, r.id), "Removed the image at " + P(r.label) + ".", { laneId: r.id })) : (r.station.image = { src: n.image.src, alt: n.image.alt }, A(K(s, o, r.id), "Updated the image at " + P(r.label) + ".", { laneId: r.id }));
    }
    case "set_station_image_alt": {
      const r = y(n.station);
      if (!r.station.image) throw new F("Add a station image before changing its description.", "refused", r.id);
      return r.station.image.alt = n.alt, A(K(s, o, r.id), "Updated the image description at " + P(r.label) + ".", { laneId: r.id });
    }
    case "connect_cards":
    case "connect_note": {
      const r = k(n.card);
      let m = r.id, x, S;
      if (n.kind === "connect_cards") {
        const j = k(n.to, r.laneId);
        if (j.id === r.id) throw new F("A line joins two different cards.", "refused", r.laneId, r.id);
        x = j.id, S = P(j.label);
      } else {
        const j = n.note.trim();
        if (s.cards.some((Y) => Y.id === j) || s.lanes.some((Y) => Y.id === j))
          throw new F("That id is a card or a lane of the workshop. Use connect_cards for two cards.", "refused", r.laneId, r.id);
        x = j, S = "the note " + j, n.direction === "from_note" && ([m, x] = [x, m]);
      }
      const O = wo(s, m, x, n.label ? { label: n.label } : {}), $ = ln(s, O);
      if ($) throw new F($, "refused", r.laneId, r.id);
      const M = In(s, O), q = m === r.id;
      return A(
        M,
        q ? "Drew a line from " + P(r.label) + " to " + S + "." : "Drew a line from " + S + " to " + P(r.label) + ".",
        { laneId: r.laneId, cardId: r.id }
      );
    }
    case "disconnect_cards":
    case "disconnect_note": {
      const r = k(n.card), m = n.kind === "disconnect_cards" ? k(n.to, r.laneId).id : n.note.trim(), x = n.kind === "disconnect_cards" ? P(s.cards.find(($) => $.id === m).label) : "the note " + m, S = ($) => $.parentId === r.id && $.childId === m || $.parentId === m && $.childId === r.id, O = s.lines ?? [];
      return O.some(S) ? (s.lines = O.filter(($) => !S($)), A(K(s, o, r.laneId, r.id), "Took away the line between " + P(r.label) + " and " + x + ".", { laneId: r.laneId, cardId: r.id })) : A(e, P(r.label) + " and " + x + " are not joined by a line.", { laneId: r.laneId, cardId: r.id }, !1);
    }
  }
  throw new F("This workshop does not take " + n.kind + ".", "not_on_this_board");
  function R(r, m) {
    const x = { laneId: m.id, cardId: r.id };
    if (r.laneId === m.id)
      return A(e, P(r.label) + " is already " + (p ? "at " : "in ") + P(m.label) + ".", x, !1);
    const S = an(e, r.id, m.id);
    if (!S) throw new F(bn(e, r.id, m.id) ?? "That move is not available.", "refused", m.id, r.id);
    return A(K(S, o, m.id, r.id), "Moved " + P(r.label) + " to " + P(m.label) + ".", x);
  }
}
function Mt(e, n, o) {
  const t = ["duration", "lag", "waitsOn", "amount", "band"].find((l) => e[l] !== void 0 && !(n === "launch-plan" || n === "hiring-plan" ? l !== "amount" && (l !== "band" || n === "hiring-plan") : (n === "pipeline" || n === "budget") && l === "amount"));
  if (t) throw new F(t === "amount" ? W.notAmounts : W.notTasks, "not_on_this_board", o);
}
function yn(e, n) {
  e.signals && (e.signals = e.signals.filter((o) => !n(o)), e.signals.length || delete e.signals);
}
function He(e, n, o = {}) {
  const t = (T) => ({ refused: { index: 0, kind: null, laneId: null, ...T } });
  let l;
  try {
    l = Z(e);
  } catch (T) {
    return t({ reason: "The workshop cannot be read: " + (T instanceof Error ? T.message : String(T)), code: "invalid_board" });
  }
  if (!Array.isArray(n) || n.length < 1 || n.length > 50) return t({ reason: "Send 1 to 50 edits.", code: "invalid_edit" });
  const s = l, p = [], b = { by: (o.actor?.by ?? "an agent").slice(0, 80), at: o.now ?? (/* @__PURE__ */ new Date()).toISOString(), via: o.actor?.via ?? "exec" };
  for (const [T, y] of n.entries()) {
    const k = y?.kind, v = Qn.find((m) => m.kind === k);
    if (!y || typeof y != "object" || !v)
      return t({
        index: T,
        kind: typeof k == "string" ? k : null,
        code: "invalid_edit",
        reason: "There is no edit called " + P(String(k)) + ". The edits are " + _e(Qn.map((m) => m.kind)) + "."
      });
    const A = Zo(y, v);
    if (A) return t({ index: T, kind: v.kind, code: "invalid_edit", reason: A });
    const N = Cn(l);
    if (!v.boards.includes(N))
      return t({ index: T, kind: v.kind, code: "not_on_this_board", reason: v.refusals[N] ?? "This workshop does not take " + v.kind + "." });
    let D;
    try {
      D = Vo(l, y, N, o.selection, b);
    } catch (m) {
      if (!(m instanceof F)) throw m;
      return t({
        index: T,
        kind: v.kind,
        reason: m.reason,
        code: m.code,
        laneId: m.laneId,
        ...m.cardId && { cardId: m.cardId },
        ...m.candidates && { candidates: m.candidates },
        ...m.limits && { limits: m.limits }
      });
    }
    const R = l.behaviour && !Ko(v.kind) ? me().check(l, D.board) : null;
    if (R && "refused" in R)
      return t({ index: T, kind: v.kind, reason: R.refused.sentence, code: "refused", laneId: R.refused.laneId, cardId: R.refused.cardId });
    const r = er(l, D.board);
    if (r) return t({ index: T, kind: v.kind, reason: r, code: "not_on_this_board", laneId: D.laneId ?? null });
    l = D.board, p.push({
      index: T,
      kind: v.kind,
      said: D.said,
      changed: D.changed ?? !0,
      ...D.laneId && { laneId: D.laneId },
      ...D.cardId && { cardId: D.cardId }
    });
  }
  const I = new Map(s.cards.map((T) => [T.id, T.laneId])), E = l.cards.flatMap((T) => {
    const y = I.get(T.id);
    return y === void 0 || y === T.laneId ? [] : [{ cardId: T.id, fromLaneId: y, toLaneId: T.laneId }];
  });
  return { workshop: l, report: { edits: p, movedCards: E } };
}
function Qo(e, n) {
  const o = ie(e);
  if (o === "pipeline") {
    if (e.forecast?.currency !== n.forecast?.currency) return "A pipeline keeps the currency it was made in.";
    const t = e.lanes.find((l) => {
      const s = n.lanes.find((p) => p.id === l.id);
      return l.role !== s.role || l.probability !== s.probability;
    });
    if (t) return `${t.label} keeps its chance to win and what it holds (open, won or lost). Rename it or set how many deals it holds instead.`;
  }
  if (o === "budget") {
    const t = e.budget, l = n.budget;
    if (!l || t.total !== l.total || t.currency !== l.currency || t.step !== l.step) return "The total cannot change. Move money between teams instead.";
    const s = e.lanes.find((p) => {
      const b = n.lanes.find((I) => I.id === p.id);
      return p.floor !== b.floor || p.cap !== b.cap || p.capacity !== b.capacity;
    });
    if (s) return `${s.label} keeps its floor and cap. Move money between teams instead.`;
  }
  return o === "launch-plan" && e.lanes.some((t) => t.capacity !== n.lanes.find((l) => l.id === t.id).capacity) ? W.launchLanes : o && ye(o).fixed?.(e, n) || null;
}
const Xo = {
  lanes: "lane workshop",
  "release-plan": "release plan",
  "customer-interviews": "interview workshop",
  "experiment-budget": "budget workshop",
  map: "map",
  "launch-plan": "launch plan",
  pipeline: "sales pipeline",
  budget: "budget",
  "hiring-plan": "hiring plan",
  nest: "nested board"
};
function er(e, n) {
  const o = Z(e), t = Cn(o);
  let l;
  try {
    l = Z(n);
  } catch (I) {
    return Tn(I instanceof Error ? I.message : String(I), t);
  }
  const s = Cn(l), p = (I, E) => I.lanes.length === E.lanes.length && I.lanes.every((T) => E.lanes.some((y) => y.id === T.id)), b = (I, E) => I.lanes.every((T, y) => E.lanes[y]?.id === T.id);
  if ((t === "customer-interviews" || t === "experiment-budget") && s !== t)
    return p(o, l) ? W.keepsCards : W.keepsLanes;
  if ((t === "customer-interviews" || t === "experiment-budget") && !b(o, l)) return W.keepsOrder;
  if (ie(o) && s === t && !(p(o, l) && b(o, l))) return Vn[t];
  if (ie(o) && s === t) {
    const I = Qo(o, l);
    if (I) return I;
  }
  if (t === "release-plan" && s === "release-plan") {
    if (!p(o, l)) return W.releaseLanes;
    if (!b(o, l)) return W.releaseOrder;
    if (l.cards.some((I) => !o.cards.some((E) => E.id === I.id))) return W.releaseCards;
  }
  return t !== s ? "This slate holds a " + Xo[t] + ", and it stays one. Start a new slate for another kind of workshop." : o.behaviour || l.behaviour ? me().replacement(o, l) : null;
}
const Yr = {
  kind: "moon-gallery",
  version: 1,
  panels: [
    { id: "dunes", label: "Dunes", artwork: "dunes", after: null },
    { id: "moon", label: "Moon", artwork: "moon", after: "dunes" },
    { id: "coast", label: "Coast", artwork: "coast", after: "moon" }
  ],
  hung: ["dunes"]
};
function Zr(e) {
  if (!e || typeof e != "object") return null;
  const n = e;
  if (n.kind !== "moon-gallery" || n.version !== 1 || !Array.isArray(n.panels) || n.panels.length !== 3 || !Array.isArray(n.hung)) return null;
  const o = [];
  for (const s of n.panels) {
    if (!s || typeof s.id != "string" || !/^[a-z][\w-]{0,31}$/.test(s.id) || typeof s.label != "string" || !s.label.trim() || s.label.trim().length > 48 || !["dunes", "moon", "coast"].includes(s.artwork) || !(s.after === null || typeof s.after == "string")) return null;
    o.push({ id: s.id, label: s.label.trim(), artwork: s.artwork, after: s.after });
  }
  const t = new Map(o.map((s) => [s.id, s])), l = [...new Set(n.hung)];
  if (t.size !== o.length || l.length !== n.hung.length || l.some((s) => !t.has(s))) return null;
  for (const s of o) {
    const p = /* @__PURE__ */ new Set([s.id]);
    let b = s.after;
    for (; b !== null; ) {
      if (p.has(b) || !t.has(b) || l.includes(s.id) && !l.includes(b)) return null;
      p.add(b), b = t.get(b).after;
    }
  }
  return { kind: "moon-gallery", version: 1, panels: o, hung: l };
}
function nr(e, n) {
  const o = e.panels.find((t) => t.id === n);
  return !!o && !e.hung.includes(n) && (o.after === null || e.hung.includes(o.after));
}
function Vr(e, n) {
  return nr(e, n) ? { ...e, hung: [...e.hung, n] } : e;
}
const eo = ["firstPrint", "secondPrint", "thirdPrint"], no = {
  kind: "focus-darkroom",
  version: 1,
  firstPrint: "Fern",
  secondPrint: "Silk moth",
  thirdPrint: "Sea fan",
  route: null
};
function Qr(e) {
  if (!e || typeof e != "object") throw new Error("Expected a darkroom.");
  const n = e;
  if (n.kind !== void 0 && n.kind !== "focus-darkroom") throw new Error("Expected a darkroom.");
  if (n.version !== 1) throw new Error("Unknown darkroom version.");
  if (n.route !== null && n.route !== "start" && n.route !== "opener") throw new Error("Unknown return path.");
  const o = { ...no, route: n.route };
  for (const t of eo) {
    const l = n[t];
    if (typeof l != "string" || !l.trim() || l.trim().length > 48)
      throw new Error("Give each print a name of up to 48 characters.");
    o[t] = l.trim();
  }
  return o;
}
function Xr(e = new URLSearchParams()) {
  const n = { ...no };
  for (const t of eo) {
    const l = e.get(t)?.trim();
    l && l.length <= 48 && (n[t] = l);
  }
  const o = e.get("route");
  return (o === "start" || o === "opener") && (n.route = o), n;
}
function es(e) {
  const n = e.route === "start" ? "Every viewer returns to the first print." : e.route === "opener" ? "Each viewer returns to the print that opened it." : "No wire attached. The viewer uses its native return path.";
  return [e.firstPrint, e.secondPrint, e.thirdPrint].join(" · ") + ". " + n;
}
function tr(e) {
  const n = { ...e };
  return e.xPos !== void 0 && n.x === void 0 && (n.x = e.xPos, delete n.xPos), e.yPos !== void 0 && n.y === void 0 && (n.y = e.yPos, delete n.yPos), e.foregroundColor !== void 0 && n.fontColor === void 0 && (n.fontColor = e.foregroundColor, delete n.foregroundColor), e.shapeHint !== void 0 && n.shape === void 0 && (n.shape = sr(e.shapeHint), delete n.shapeHint), e.svgString !== void 0 && n.svgContent === void 0 && (n.svgContent = e.svgString, delete n.svgString), e.blnStraight !== void 0 && (n.isStraightLine = e.blnStraight, delete n.blnStraight), rr(n), n;
}
function or(e) {
  if (!e || typeof e != "object") return !1;
  const n = e;
  return n.width !== void 0 || n.height !== void 0;
}
function rr(e) {
  return e && or(e.textOffset) && (e.textOffset = { x: 0, y: 0 }), e;
}
function Wt(e) {
  const n = { ...e };
  return n.xPos = e.x, n.yPos = e.y, n.foregroundColor = e.fontColor, e.shape && (n.shapeHint = e.shape), e.svgContent && (n.svgString = e.svgContent), n;
}
function tn(e) {
  return {
    id: e.id || `${e.parentId}->${e.childId}`,
    childId: e.childId,
    parentId: e.parentId,
    isStraightLine: e.isStraightLine ?? e.blnStraight ?? !1,
    lineColor: e.lineColor || "#666666",
    lineEffect: e.lineEffect || "",
    lineDash: e.lineDash === "dashed" || e.lineDash === "dotted" ? e.lineDash : "solid",
    lineOpacity: e.lineOpacity ?? 1,
    lineType: e.lineType || "bezier",
    lineCurveType: e.lineCurveType || "cubic",
    lineCurviness: e.lineCurviness ?? 0.1,
    lineWidth: e.lineWidth ?? 3,
    showParentArrow: e.showParentArrow ?? !1,
    showChildArrow: e.showChildArrow ?? !0,
    sourcePoint: e.sourcePoint ?? null,
    targetPoint: e.targetPoint ?? null,
    sourceAnchor: e.sourceAnchor ?? null,
    targetAnchor: e.targetAnchor ?? null,
    label: e.label ?? ""
  };
}
function sr(e) {
  return {
    rect: "rectangle",
    rectangle: "rectangle",
    roundedrectangle: "roundedrectangle",
    ellipse: "ellipse",
    circle: "circle",
    star: "star",
    trapezium: "trapezium",
    triangle: "triangle",
    pentagon: "pentagon",
    parallelogram: "parallelogram",
    octagon: "octagon",
    hexagon: "hexagon",
    rarrow: "rarrow",
    larrow: "larrow"
  }[e.toLowerCase()] || e;
}
function Kn() {
  try {
    return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return !1;
  }
}
const jt = "#1f7a5c", Ft = "#5b9a85", qn = "#c2410c", ir = "#2f5fd0", ar = { canMove: !1, canSelect: !1 };
function lr(e) {
  const n = /^(lane|card|caption|column|image|handle|gauge)-(.+)$/.exec(e);
  return n ? { kind: n[1], key: n[2] } : null;
}
function ns(e, n, o = {}) {
  let t = Z(n);
  const l = o.kit, s = (i) => !!ie(i) && !l;
  if (s(t) && !o.readOnly) throw new Error(`A ${t.kind} board needs its kit: pass kit: kitFor('${t.kind}') from slateboxjs/boards.`);
  const p = l?.layer(e);
  let b = null, I = null, E = !!o.readOnly, T = E || s(t), y = !1;
  const k = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map(), A = /* @__PURE__ */ new Map(), N = /* @__PURE__ */ new Map(), D = /* @__PURE__ */ new Map();
  let R = null, r = null, m = null, x = null;
  const S = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map();
  let $ = null, M = null;
  function q(i, a) {
    M && clearTimeout(M.timer), M = { name: i, reason: a, timer: setTimeout(() => {
      M = null, y || z(I ?? t);
    }, 3e3) };
  }
  let j = Promise.resolve(), Y = null, J = zt(o.layout);
  const Re = { ...o.style };
  let pe = /* @__PURE__ */ new Map(), Oe = /* @__PURE__ */ new Set(), Me = null, de = !1;
  const re = /* @__PURE__ */ new Map();
  je(t);
  const X = o.origin ? { x: o.origin.x, y: o.origin.y } : cr(e), Ae = (i) => D.get(i) ?? i, he = (i) => lr(Ae(i));
  function ce(i) {
    const a = N.get(i);
    if (a) return a;
    if (k.has(i) && !D.has(i) || !e.nodes.one?.(i)) return i;
    const d = bo(i, (c) => !!e.nodes.one?.(c) || D.has(c));
    return N.set(i, d), D.set(d, i), console.warn(`WORKSHOP: the slate already has a note named "${i}". It stays the slate's own; the workshop draws its note as "${d}".`), d;
  }
  const ke = {
    governs(i) {
      if (k.get(i.id) !== i) return null;
      const a = he(i.id)?.kind;
      return a === "card" ? { canMove: !T, canEditText: !T && !I && t.kind !== "release-plan", canConnect: Ve() } : a === "lane" ? { canMove: !1, canEditText: !T && !I } : a === "handle" ? { canMove: !T && !I, canEditText: !1 } : ar;
    },
    onStart(i, a) {
      const d = he(i.id), c = { x: a.x - (i.options.x ?? 0), y: a.y - (i.options.y ?? 0) };
      if (d.kind === "handle") {
        const h = !T && !I && l ? l.handleDrag(t, Ae(i.id), c, J) : null;
        return h ? (ae(), Pe(), M && (clearTimeout(M.timer), M = null), b = { name: Ae(i.id), follow: h, last: null }, !0) : !1;
      }
      const g = d.key;
      if (T || I || !t.cards.some((h) => h.id === g)) return !1;
      ae(), Pe();
      let u = null;
      try {
        u = (l?.chooser ?? o.chooseCandidate)?.(t, g, c, J) ?? null;
      } catch (h) {
        console.warn("WORKSHOP: chooseCandidate threw; using the lane under the pointer", h);
      }
      return R = { cardId: g, evaluate: u, grab: c, outcome: { kind: "home" } }, z(t, { skip: g }), !0;
    },
    onMove(i, a) {
      if (b) {
        b.last = b.follow(en(a)), z(b.last.next, { grip: b.name }), B(o.onPreview, b.last.next === t ? null : b.last.next);
        return;
      }
      if (!R) return;
      const d = gt(R.cardId, a, R.evaluate);
      if (dr(d, R.outcome)) return;
      R.outcome = d;
      const c = d.kind === "candidate" ? d.next : null;
      z(c ?? t, { skip: R.cardId }), B(o.onPreview, c);
    },
    onEnd(i, a) {
      if (b) {
        const { follow: h, name: f } = b, w = h(en(a));
        b = null, B(o.onPreview, null), w.refusal ? (q(f, w.refusal), z(t), e.announce?.(w.refusal), B(o.onRefuse, { laneId: null, reason: w.refusal })) : hn(w.next, {}) || z(t);
        const L = Hn(t, f);
        return L ? { accept: !0, settle: L } : { accept: !1 };
      }
      if (!R) return { accept: !1 };
      const { cardId: d, evaluate: c } = R, g = gt(d, a, c), u = t.cards.find((h) => h.id === d);
      if (R = null, B(o.onPreview, null), g.kind === "candidate" && l) {
        if (!hn(g.next, { cardId: d, laneId: g.laneId }, d))
          return z(t, { skip: d }), { accept: !1 };
        g.said && (q("card-" + d, g.said), e.announce?.(g.said));
        const h = Hn(t, Ae(i.id));
        return h ? { accept: !0, settle: h } : { accept: !0 };
      }
      if (g.kind === "candidate") {
        t = g.next, z(t, { skip: d });
        const h = t.lanes.find((w) => w.id === g.laneId);
        e.announce?.(`${V(u)} moved to ${h.label}. ${xe(t, h.id)}.`), B(o.onChange, t, { cardId: d, laneId: g.laneId });
        const f = Hn(t, Ae(i.id));
        return f ? { accept: !0, settle: f } : { accept: !0 };
      }
      if (g.kind === "refused")
        Wo(V(u), { cardId: d, laneId: g.laneId, reason: g.reason }), g.near && q("card-" + d, g.reason);
      else if (g.kind === "outside" && rn(t) && !Ye()) {
        const h = vn(t, d);
        if (!h)
          return Dn(d, { x: i.options.x ?? 0, y: i.options.y ?? 0 }), { accept: !0 };
        z(t, { skip: d }), e.announce?.(h), B(o.onRefuse, { cardId: d, laneId: null, reason: h });
      } else
        z(t, { skip: d }), g.kind === "outside" && (e.announce?.(`${V(u)} was not dropped on a lane. It stays where it was.`), B(o.onRefuse, { cardId: d, laneId: null, reason: "" }));
      return { accept: !1 };
    },
    onCancel(i) {
      if (b) {
        b = null, B(o.onPreview, null), z(t);
        return;
      }
      const a = R && t.cards.find((d) => d.id === R.cardId);
      R = null, B(o.onPreview, null), z(t, { skip: he(i.id)?.key }), a && e.announce?.(`Move cancelled. ${V(a)} stays where it was.`);
    },
    onTextCommit(i, a, d) {
      const c = he(i.id);
      if (!c || T || I) return !1;
      let g = a.replace(/\s+/g, " ").trim();
      const u = [], h = ie(t), f = h && c.kind === "card" ? ye(h).renamed(t, c.key, g) : null;
      f && (g = f.label, u.push(...f.edits));
      const w = c.kind === "lane" ? { laneId: c.key, label: g } : { cardId: c.key, label: g };
      u.unshift(c.kind === "lane" ? { kind: "rename_lane", lane: { id: c.key }, label: g } : { kind: "rename_card", card: { id: c.key }, label: g });
      const L = He(t, u);
      if ("refused" in L) {
        const { reason: C } = L.refused;
        return e.announce?.(`${d} keeps its name. ${C}`), B(o.onRefuse, { ...c.kind === "lane" ? { laneId: c.key } : { cardId: c.key }, rename: w, reason: C }), !1;
      }
      return JSON.stringify(L.workshop) === JSON.stringify(t) ? (z(t), !1) : (t = L.workshop, z(t), e.announce?.(f ? L.report.edits.map((C) => C.said).join(" ") : `${d} renamed to ${g}.`), B(o.onChange, t, { rename: w, ...l ? { edits: u } : {} }), f ? !1 : g);
    },
    onKeyDown(i, a) {
      const d = he(i.id);
      if (T || I || R || b || a.ctrlKey || a.metaKey || a.altKey) return !1;
      if (m && (m.node !== i.id || !["Enter", "Escape"].includes(a.key) && a.key.toLowerCase() !== m.key) && kt(), m && a.key === "Escape")
        return a.preventDefault(), kt(), e.announce?.("Cancelled. Nothing changed."), !0;
      if (m && a.key === "Enter") {
        a.preventDefault();
        const h = m.choices[m.at];
        return m = null, B(o.onPreview, null), t = h.next, z(t), e.announce?.(h.done), B(o.onChange, t, { ...d?.kind === "card" ? { cardId: d.key } : {}, edits: h.edits }), !0;
      }
      const c = l?.keyChoices?.(t, Ae(i.id), a.key);
      if (c) {
        a.preventDefault();
        const h = [], f = [];
        for (const C of typeof c == "string" ? [] : c) {
          const _ = He(t, C.edits);
          "refused" in _ ? f.push(`${C.said}: ${_.refused.reason}`) : h.push({ ...C, next: _.workshop, done: _.report.edits.map((H) => H.said).join(" ") });
        }
        if (!h.length)
          return e.announce?.(typeof c == "string" ? c : f.join(" ")), !0;
        const w = m && m.node === i.id ? (m.at + 1) % h.length : 0;
        m = { node: i.id, key: a.key.toLowerCase(), choices: h, at: w }, z(h[w].next), B(o.onPreview, h[w].next);
        const L = h.length > 1 ? ` (${w + 1} of ${h.length}). Press ${a.key.toUpperCase()} for the next,` : ". Press";
        return e.announce?.(`${h[w].said}${L} Enter to make it, Escape to cancel.`), !0;
      }
      const g = l?.keyEdit?.(t, Ae(i.id), { key: a.key, shiftKey: a.shiftKey });
      if (g) {
        a.preventDefault();
        const h = He(t, g);
        return "refused" in h ? (e.announce?.(h.refused.reason), B(o.onRefuse, { laneId: h.refused.laneId, ...d?.kind === "card" ? { cardId: d.key } : {}, reason: h.refused.reason })) : hn(h.workshop, d?.kind === "card" ? { cardId: d.key } : {}), !0;
      }
      if (d?.kind !== "card") return !1;
      const u = t.cards.find((h) => h.id === d.key);
      if (!u) return !1;
      if (a.key === "ArrowLeft" || a.key === "ArrowRight")
        return a.preventDefault(), yt(u.id, a.key === "ArrowLeft" ? -1 : 1), !0;
      if ((a.key === "ArrowUp" || a.key === "ArrowDown") && So())
        return a.preventDefault(), yt(u.id, a.key === "ArrowUp" ? -1 : 1, !0), !0;
      if (r?.cardId !== u.id) return !1;
      if (a.key === "Enter") {
        a.preventDefault();
        const { laneId: h, next: f, spot: w } = r;
        if (r = null, h === null)
          return B(o.onPreview, null), Dn(u.id, w), !0;
        const L = t;
        t = f, z(t), Le(h), B(o.onPreview, null);
        const C = t.lanes.find((_) => _.id === h);
        return e.announce?.(`${V(u)} moved to ${C.label}. ${xe(t, h)}.`), B(o.onChange, t, { cardId: u.id, laneId: h, ...l ? { edits: l.editsBetween(L, t) } : {} }), !0;
      }
      return a.key === "Escape" ? (a.preventDefault(), Pe(), e.announce?.(`Move cancelled. ${V(u)} stays where it was.`), !0) : !1;
    },
    onNotesReplaced() {
      const i = (e.getSelectedNodes?.() ?? []).filter((a) => k.get(a.id) === a).map((a) => a.id);
      de = i.length === 1, k.clear(), v.clear(), A.clear(), re.clear(), N.clear(), D.clear(), R = null, r = null, z(I ?? t, { animate: !1 }), i.length === 1 && (j = j.then(() => {
        de = !1;
        const a = k.get(i[0]);
        if (!y && a && !(e.getSelectedNodes?.() ?? []).length) {
          const d = () => e.selectNodes?.([a]);
          typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
        }
        Mn();
      }));
    }
  };
  ke.onFreeMove = (i, a) => {
    if (!dn() || i.options?.isComment) return Wn();
    const d = cn(a), c = un(i), g = t.lanes.filter((f) => !Ze(i) && Be(t, f.id, c) === null).map((f) => f.id), u = d && l?.noteUnder?.(t, en(a), J);
    u && (c.under = u);
    const h = d ? Ze(i) ?? Be(t, d, c) : null;
    x && x.noteId === i.id && x.laneId === d && x.refusal === h || (x = { noteId: i.id, laneId: d, refusal: h, open: g }, Ce());
  }, ke.onFreeDrop = (i, a, d) => {
    if (Wn(), !dn() || i.options?.isComment) return;
    const c = cn(a);
    if (!c) return;
    const g = un(i), u = l?.noteUnder?.(t, en(a), J);
    u && (g.under = u);
    const h = t.lanes.find((w) => w.id === c), f = Ze(i) ?? Be(t, c, g);
    return f ? (ae(!1), $ = { laneId: c, reason: f, timer: setTimeout(() => ae(), 1500) }, Ce(), e.announce?.(`${jn(g.label)} can't go in ${h.label}. ${f}`), B(o.onRefuse, { noteId: i.id, laneId: c, reason: f }), "refused") : (zn([{ node: i, offer: g, from: d }], c), "taken");
  }, ke.onFreeGroupDrop = (i, a, d) => {
    if (Wn(), !dn() || i.some((f) => f.options?.isComment)) return;
    const c = cn(a);
    if (!c) return;
    const g = t.lanes.find((f) => f.id === c), u = i.map((f) => ({ node: f, offer: un(f) })), h = Po(u, c);
    if (h) {
      ae(!1), $ = { laneId: c, reason: h, timer: setTimeout(() => ae(), 1500) }, Ce(), e.announce?.(`${bt(u.map((f) => jn(f.offer.label)))} can't go in ${g.label}. ${h}`);
      for (const { node: f } of u) B(o.onRefuse, { noteId: f.id, laneId: c, reason: h });
      return "refused";
    }
    return zn(u.map((f, w) => ({ ...f, from: d?.[w] })), c), "taken";
  }, ke.onFreeTextCommit = (i) => {
    if (!dn() || i.options?.isComment || !e.nodes.one(i.id)) return;
    const a = i.options ?? {}, d = cn({ x: (a.x ?? 0) + (a.width ?? 0) / 2, y: (a.y ?? 0) + (a.height ?? 0) / 2 });
    if (!d) return;
    const c = un(i), g = t.lanes.find((L) => L.id === d), u = Ze(i) ?? Be(t, d, c);
    if (!u) {
      zn([{ node: i, offer: c }], d);
      return;
    }
    ae(!1), $ = { laneId: d, reason: u, timer: setTimeout(() => ae(), 1500) }, Ce(), e.announce?.(`${jn(c.label)} can't go in ${g.label}. ${u} It is beside the board.`), B(o.onRefuse, { noteId: i.id, laneId: d, reason: u });
    const { width: h } = je(t), f = Math.round(X.x + h + 32), w = Math.round(a.y ?? X.y);
    i.position(f, w, () => e.updateSelectionResizeRotate?.(), void 0, Kn() ? 0 : 180), e.broadcast?.("onNodesMove", { nodeOptions: [Wt({ ...i.options, x: f, y: w })] });
  }, ke.undoState = () => ({ cards: t.cards.map((i) => ({ ...i })), pairs: [...S], lines: (t.lines ?? []).map((i) => ({ ...i })) }), ke.onUndoRestore = (i, a) => {
    if (y) return;
    const d = new Map((i?.cards ?? []).map((u) => [u.id, u])), c = new Map(i?.pairs ?? []), g = (u) => S.get(u) ?? c.get(u) ?? u;
    for (const u of a.added) {
      const h = g(u), f = t.cards.find((L) => L.id === h);
      if (!f) continue;
      t = Z({ ...t, cards: t.cards.filter((L) => L !== f), lines: De(t.lines, h, u) }), z(t);
      const w = B(o.onChange, t, { cardId: h, cardToNote: { noteId: u } });
      e.holdTrade?.(u, w), Jn(w);
    }
    for (const u of a.removed) {
      const h = g(u), f = d.get(h);
      if (!f || t.cards.some((G) => G.id === h)) continue;
      const w = (i?.lines ?? []).filter((G) => G.parentId === h || G.childId === h), L = {
        id: h,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...w.length ? { lines: w } : {}
      }, C = [f.laneId, ...t.lanes.map((G) => G.id)].find((G) => on(t, G, L));
      if (!C) {
        e.announce?.(`${V(f)} could not go back on the board: there is no room for it.`);
        continue;
      }
      t = Ro(on(t, C, L), h, i?.cards ?? []), h !== u && S.set(u, h), z(t);
      const _ = t.cards.findIndex((G) => G.id === h), H = t.cards.slice(_ + 1).find((G) => G.laneId === C)?.id, U = B(o.onChange, t, { cardId: h, laneId: C, noteToCard: {
        noteId: u,
        label: f.label,
        ...f.look ? { look: f.look } : {},
        ...f.asNote ? { asNote: f.asNote } : {},
        ...H ? { before: H } : {},
        ...w.length ? { lines: De(w, h, u) } : {}
      } });
      e.holdTrade?.(u, U), Jn(U);
    }
    Array.isArray(i?.lines) && No(i.lines);
  };
  let Rn = !1;
  ke.onNodeAdded = (i) => {
    y || Rn || k.get(i.id) === i || (t.lines ?? []).some((a) => a.parentId === i.id || a.childId === i.id) && (Rn = !0, queueMicrotask(() => {
      Rn = !1, y || Ce();
    }));
  }, ke.onLine = (i, a) => {
    y || queueMicrotask(() => {
      y || Eo(i, a);
    });
  };
  const Co = e.setDragPolicy(ke), To = o.onSelect && e.onSelectionChange?.(() => Mn()), wt = () => {
    r && Pe();
  };
  e.element?.addEventListener?.("pointerdown", wt, !0), z(t, { animate: !1 });
  function gt(i, a, d) {
    const c = t.cards.find((C) => C.id === i);
    if (!c) return { kind: "outside" };
    if (l) {
      const C = en(a), _ = l.refusalAt(t, i, R?.grab ?? { x: 0, y: 0 }, C, J);
      if (_ && !_.lands) return { kind: "refused", laneId: _.laneId, reason: _.reason };
      const { width: H, height: U } = je(t);
      if (C.x < -40 || C.y < -40 || C.x > H + 40 || C.y > U + 40) return { kind: "outside" };
      let G = t;
      try {
        G = d?.(C) ?? t;
      } catch (ee) {
        console.warn("WORKSHOP: the board kit's chooser threw", ee);
      }
      return JSON.stringify(G) === JSON.stringify(t) ? _ ? { kind: "refused", laneId: _.laneId, reason: _.reason, near: !0 } : { kind: "home" } : { kind: "candidate", laneId: G.cards.find((ee) => ee.id === i)?.laneId ?? c.laneId, next: G, ..._ && { said: _.reason } };
    }
    const g = t.lanes.map((C) => k.get(ce(se.column(C.id)))).filter(Boolean), u = e.hitTestNodes(a, g, { padding: 6 }), h = u ? he(u.id).key : null;
    if (!h) return { kind: "outside" };
    if (h === c.laneId) return { kind: "home" };
    const f = an(t, i, h);
    if (!f) return { kind: "refused", laneId: h, reason: bn(t, i, h) ?? "That move is not available." };
    if (!d) return { kind: "candidate", laneId: h, next: f };
    let w = null;
    try {
      w = d({ x: a.x - X.x, y: a.y - X.y });
    } catch (C) {
      return console.warn("WORKSHOP: the candidate chooser threw; using the lane under the pointer", C), { kind: "candidate", laneId: h, next: f };
    }
    const L = w?.cards.find((C) => C.id === i)?.laneId;
    return !w || !L || L === c.laneId ? { kind: "home" } : { kind: "candidate", laneId: L, next: w };
  }
  function So() {
    return l ? !1 : new Set(Ue(t, { layout: J }).places.map((i) => i.row)).size > 1;
  }
  function yt(i, a, d = !1) {
    const c = t.cards.find((C) => C.id === i), g = Ht(t, i), u = r?.cardId === i && r.laneId === null ? r.side : void 0;
    if (u !== void 0) {
      if (d || a === u) return;
      const C = u > 0 ? t.lanes[t.lanes.length - 1] : t.lanes[0];
      if (Pe(), C.id === c.laneId) {
        Le(C.id, I ?? t), e.announce?.(`${V(c)} is back in ${C.label}.`);
        return;
      }
      if (g.includes(C)) {
        const H = an(t, i, C.id);
        r = { cardId: i, laneId: C.id, next: H }, z(H), Le(C.id, H), B(o.onPreview, H), e.announce?.(`${V(c)} to ${C.label}: ${xe(H, C.id)}. Press Enter to move it, Escape to cancel.`);
        return;
      }
      const _ = bn(t, i, C.id) ?? "That move is not available.";
      ae(), $ = { laneId: C.id, reason: _, timer: setTimeout(() => ae(), 1500) }, z(I ?? t), Le(C.id, I ?? t), e.announce?.(`${V(c)} can't move to ${C.label}. ${_}`), B(o.onRefuse, { cardId: i, laneId: C.id, reason: _ });
      return;
    }
    const h = r?.cardId === i ? r.laneId : c.laneId;
    let f;
    if (d) {
      const { places: C } = Ue(t, { layout: J }), _ = C.find((H) => H.laneId === h);
      f = C.filter((H) => H.column === _.column && (H.row - _.row) * a > 0).sort((H, U) => (H.row - U.row) * a).map((H) => t.lanes.find((U) => U.id === H.laneId));
    } else {
      const C = t.lanes.findIndex((_) => _.id === h);
      f = a > 0 ? t.lanes.slice(C + 1) : t.lanes.slice(0, C).reverse();
    }
    const w = f.find((C) => g.includes(C));
    if (ae(), !w) {
      const C = f[0];
      if (!C) {
        if (!d && rn(t)) {
          const H = vn(t, i);
          if (H) {
            e.announce?.(H), B(o.onRefuse, { cardId: i, laneId: null, reason: H });
            return;
          }
          Oo(c, a);
          return;
        }
        e.announce?.(`${V(c)} has no lane to move to on that side.`);
        return;
      }
      const _ = bn(t, i, C.id) ?? "That move is not available.";
      $ = { laneId: C.id, reason: _, timer: setTimeout(() => ae(), 1500) }, z(r?.next ?? I ?? t), Le(C.id, r?.next ?? I ?? t), e.announce?.(`${V(c)} can't move to ${C.label}. ${_}`), B(o.onRefuse, { cardId: i, laneId: C.id, reason: _ });
      return;
    }
    if (w.id === c.laneId) {
      Pe(), Le(w.id, I ?? t), e.announce?.(`${V(c)} is back in ${w.label}.`);
      return;
    }
    const L = an(t, i, w.id);
    r = { cardId: i, laneId: w.id, next: L }, z(L), Le(w.id, L), B(o.onPreview, L), e.announce?.(`${V(c)} to ${w.label}: ${xe(L, w.id)}. Press Enter to move it, Escape to cancel.`);
  }
  function Le(i, a = t) {
    const d = l ? Fo(a, se.column(i)) : Ue(a, { layout: J, rows: Tt() }).places.find((w) => w.laneId === i), c = e.canvas?.viewbox?.();
    if (!d || !c || !(c.width > 0) || !(c.height > 0)) return;
    const g = 16, u = (w, L, C, _) => L + g * 2 >= _ || w - g < C ? w - g - C : w + L + g > C + _ ? w + L + g - (C + _) : 0, h = u(X.x + d.x, d.width, c.x, c.width), f = u(X.y + d.y, d.height, c.y, c.height);
    (h || f) && e.panBy?.({ x: h, y: f });
  }
  function Mn() {
    if (!o.onSelect || de) return;
    const i = y ? [] : e.getSelectedNodes?.() ?? [], a = i.length === 1 && k.get(i[0].id) === i[0] ? he(i[0].id) : null, d = a?.kind === "card" ? { cardId: a.key } : a?.kind === "lane" ? { laneId: a.key } : null, c = d ? JSON.stringify(d) : null;
    c !== Me && (Me = c, B(o.onSelect, d));
  }
  function kt() {
    m && (m = null, z(t), B(o.onPreview, null));
  }
  function Pe() {
    r && (r = null, B(o.onPreview, null), z(I ?? t));
  }
  function Oo(i, a) {
    const { width: d } = je(t), c = k.get(ce(se.card(i.id)))?.options, g = c?.width ?? 228, u = { x: a > 0 ? X.x + d + 32 : X.x - g - 32, y: c?.y ?? X.y }, h = Ut(t, i.id);
    r = { cardId: i.id, laneId: null, side: a, spot: u, next: t }, z(t), B(o.onPreview, h), e.announce?.(`${V(i)} to the canvas, outside the lanes: it becomes an ordinary note. Press Enter to move it, Escape to cancel.`);
  }
  function Ye() {
    return !!(e.isReadOnly?.() || e.isCommentOnly?.());
  }
  function dn() {
    return !y && !T && !I && !R && !Ye() && rn(t);
  }
  function Wn() {
    x && (x = null, y || Ce());
  }
  function cn(i) {
    const a = t.lanes.map((c) => k.get(ce(se.column(c.id)))).filter(Boolean), d = e.hitTestNodes(i, a, { padding: 6 });
    return d ? he(d.id)?.key ?? null : null;
  }
  function un(i) {
    const a = i.options ?? {}, d = so({
      backgroundColor: a.backgroundColor,
      textColor: a.fontColor,
      fontFamily: a.fontFamily,
      fontSize: a.fontSize,
      borderColor: a.borderColor,
      borderWidth: a.borderWidth
    }), c = String(a.text ?? ""), g = c.replace(/\s+/g, " ").trim(), u = {};
    c.trim() !== g && c.length <= 4e3 && (u.text = c.trim()), typeof a.shape == "string" && /^[a-z]{1,24}$/i.test(a.shape) && (u.shape = a.shape);
    for (const f of ["width", "height"]) Number.isFinite(a[f]) && a[f] >= 10 && a[f] <= 4e3 && (u[f] = Math.round(a[f]));
    if (nt(a.image)) {
      u.image = { src: a.image };
      for (const [f, w] of [["width", "imageOrigWidth"], ["height", "imageOrigHeight"]])
        Number.isFinite(a[w]) && a[w] >= 1 && a[w] <= 2e4 && (u.image[f] = a[w]);
    }
    a.link?.data && Dt({ ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} }) && (u.link = { ...a.link.type ? { type: a.link.type } : {}, data: a.link.data, ...typeof a.link.show == "boolean" ? { show: a.link.show } : {} });
    const h = Lo(i);
    return { id: i.id, label: g, ...d ? { look: d } : {}, ...Object.keys(u).length ? { asNote: u } : {}, ...h.length ? { lines: h } : {} };
  }
  function Lo(i) {
    const a = /* @__PURE__ */ new Map(), d = (c) => typeof c == "string" && !!k.get(c) && k.get(c) === e.nodes.one(c);
    for (const c of i.relationships?.getAssociations?.() ?? [])
      (c.targetPoint || !d(c.childId)) && a.set(c.id, Qe(c));
    for (const c of e.nodes?.allNodes ?? [])
      if (!(c === i || d(c.id)))
        for (const g of c.relationships?.getAssociations?.() ?? [])
          g.childId === i.id && !g.targetPoint && a.set(g.id, Qe(g));
    for (const c of Gt(t, i.id)) a.set(c.id, c);
    return [...a.values()];
  }
  function bt(i) {
    return i.length > 1 ? i.slice(0, -1).join(", ") + " and " + i.at(-1) : i[0] ?? "";
  }
  function Po(i, a) {
    for (const { node: u } of i) {
      const h = Ze(u);
      if (h) return h;
    }
    const d = t.lanes.find((u) => u.id === a), c = t.cards.filter((u) => u.laneId === a).length;
    if (d.capacity !== void 0 && c + i.length > d.capacity) {
      const u = d.capacity - c;
      return u > 0 ? `It has room for ${u} more ${u === 1 ? "card" : "cards"}.` : `It already holds ${c} of ${d.capacity} ${d.capacity === 1 ? "card" : "cards"}.`;
    }
    let g = t;
    for (const { offer: u } of i) {
      const h = Be(g, a, u);
      if (h) return h;
      g = on(g, a, u);
    }
    return null;
  }
  function Ze(i) {
    if (i.options?.image && !nt(i.options.image)) return "A note with a picture kept in the page itself stays a note.";
    const a = i.options?.link;
    return a?.data && !Dt({ ...a.type ? { type: a.type } : {}, data: a.data }) ? "A note with this link stays a note." : null;
  }
  const jn = (i) => i || "This note", V = (i) => i.label || "The empty card";
  function Ve() {
    return !y && !T && !I && !Ye() && !t.kind && rn(t);
  }
  function Qe(i) {
    const a = { id: i.id, parentId: i.parentId, childId: i.childId };
    for (const c of [
      "lineColor",
      "lineOpacity",
      "lineWidth",
      "lineDash",
      "lineType",
      "lineCurveType",
      "lineCurviness",
      "lineEffect",
      "showParentArrow",
      "showChildArrow",
      "label"
    ]) {
      const g = i[c];
      g != null && g !== "" && (a[c] = g);
    }
    for (const c of ["sourceAnchor", "targetAnchor"]) {
      const g = i[c];
      g && Number.isFinite(g.x) && Number.isFinite(g.y) && (a[c] = { x: g.x, y: g.y });
    }
    const d = i.targetPoint;
    return d && Number.isFinite(d.x) && Number.isFinite(d.y) && (a.targetPoint = { x: d.x, y: d.y }, delete a.targetAnchor), a;
  }
  function vt(i, a) {
    const d = { ...i };
    return d.showParentArrow = a.showChildArrow ?? !0, d.showChildArrow = a.showParentArrow ?? !1, delete d.sourceAnchor, delete d.targetAnchor, a.targetAnchor && (d.sourceAnchor = a.targetAnchor), a.sourceAnchor && (d.targetAnchor = a.sourceAnchor), d;
  }
  function It(i) {
    if (!i || e.nodes.one(i.id) !== i) return null;
    if (k.get(i.id) === i) {
      const a = he(i.id);
      return a?.kind === "card" && t.cards.some((d) => d.id === a.key) ? a.key : null;
    }
    return i.options?.isComment ? null : i.id;
  }
  function Fn(i, a) {
    if (i.cards.some((c) => c.id === a)) {
      const c = k.get(ce(se.card(a)));
      return c?.relationships && c.svgGroup ? c : null;
    }
    const d = e.nodes.one(a);
    return d && k.get(a) !== d && d.svgGroup ? d : null;
  }
  function xt(i) {
    const a = [];
    for (const d of i) {
      const c = e.nodes.one(d.parentId);
      if (!c?.relationships || k.get(c.id) === c || c.relationships.hasAssociationId?.(d.id)) continue;
      if (d.targetPoint) {
        const h = c.relationships.addFloatingAssociation(d.targetPoint, tn(d));
        a.push({ type: "addRelationship", data: { ...h } });
        continue;
      }
      const g = e.nodes.one(d.childId);
      if (!g || k.get(g.id) === g) continue;
      const u = c.relationships.addAssociation(g, tn(d));
      a.push({ type: "addRelationship", data: { ...u } });
    }
    return a;
  }
  function $o(i) {
    const a = /* @__PURE__ */ new Set();
    for (const d of i.lines ?? []) {
      if (d.targetPoint) {
        const _ = Fn(i, d.parentId);
        if (!_ || k.get(_.id) !== _) continue;
        const H = { ...d, parentId: _.id }, U = JSON.stringify(H);
        a.add(d.id);
        const G = re.get(d.id);
        if (G && G.key === U && G.holder === _ && !G.other && _.relationships.hasAssociationId?.(d.id)) continue;
        G && e.nodes.one(G.holder.id) === G.holder && G.holder.relationships?.removeAssociation?.(d.id), _.relationships.addFloatingAssociation(d.targetPoint, tn(H)), re.set(d.id, { holder: _, other: null, swapped: !1, key: U });
        continue;
      }
      const c = Fn(i, d.parentId), g = Fn(i, d.childId);
      if (!c || !g || c === g) continue;
      const u = k.get(c.id) !== c, h = u ? g : c, f = u ? c : g, w = u ? vt({ ...d, parentId: h.id, childId: f.id }, d) : { ...d, parentId: h.id, childId: f.id }, L = JSON.stringify(w);
      a.add(d.id);
      const C = re.get(d.id);
      C && C.key === L && C.holder === h && C.other === f && h.relationships.hasAssociationId?.(d.id) || (C && e.nodes.one(C.holder.id) === C.holder && C.holder.relationships?.removeAssociation?.(d.id), h.relationships.addAssociation(f, tn(w)), re.set(d.id, { holder: h, other: f, swapped: u, key: L }));
    }
    for (const [d, c] of [...re])
      a.has(d) || (e.nodes.one(c.holder.id) === c.holder && c.holder.relationships?.hasAssociationId?.(d) && c.holder.relationships.removeAssociation(d), re.delete(d));
  }
  function fn(i) {
    const a = i.parentId ? e.nodes.one(i.parentId) : null, d = i.id ?? i.childId;
    !a?.relationships || !d || e.withPolicyAuthority(() => {
      (a.relationships.hasAssociationId?.(d) || !i.id) && a.relationships.removeAssociation(d);
    });
  }
  let Xe = null;
  function Eo(i, a) {
    if (i === "addRelationship") {
      if (re.get(a?.id)?.holder.id === a?.parentId) return;
      const d = !!a?.targetPoint, c = e.nodes.one(a?.parentId), g = d ? null : e.nodes.one(a?.childId), u = It(c), h = d ? null : It(g), f = Xe?.lineId === a?.id ? t.lines?.find((H) => H.id === a?.id) : void 0;
      f && (Xe = null);
      const w = (H) => {
        fn(a), f && z(I ?? t), e.announce?.(H), B(o.onRefuse, { reason: H, laneId: null });
      };
      if (!Ve()) {
        fn(a), f && z(I ?? t);
        return;
      }
      if (!u || !h && !d) return w(f ? "A card's line ends on a note or another card, so that end went back." : "A line from a card ends on a note or another card.");
      const L = d ? String(a.childId) : h;
      if (f) {
        const H = t.cards.some((Ee) => Ee.id === u), U = !d && t.cards.some((Ee) => Ee.id === h);
        if (!H && !U) return $e({ remove: f.id });
        const G = { ...Qe(a), id: f.id, parentId: u, childId: L }, ee = ln(t, G);
        if (ee) return w(ee);
        fn(a), $e({ set: G });
        return;
      }
      const C = wo(t, u, L, Qe(a)), _ = ln(t, C);
      if (_) return w(_);
      fn(a), $e({ set: C });
      return;
    }
    if (i === "removeRelationship") {
      const d = [...re].find(([g, u]) => (g === a?.id || !a?.id && u.other?.id === a?.childId) && u.holder.id === a?.parentId)?.[0];
      if (!d) return;
      const c = re.get(d);
      if (re.delete(d), e.nodes.one(c.holder.id) !== c.holder || c.other && e.nodes.one(c.other.id) !== c.other || !Ve())
        return Ve() || y ? void 0 : z(I ?? t);
      Xe = { lineId: d }, queueMicrotask(() => {
        y || Xe?.lineId !== d || (Xe = null, $e({ remove: d }));
      });
      return;
    }
    if (i === "onLinePropertiesChanged")
      for (const d of Array.isArray(a) ? a : [a]) {
        const c = [...re].find(([C, _]) => C === d?.associationId && _.holder.id === d?.id);
        if (!c) continue;
        const [g, u] = c, h = t.lines?.find((C) => C.id === g), f = u.holder.relationships?.getAssociations?.().find((C) => C.id === g);
        if (!h || !f) continue;
        if (!Ve()) {
          z(I ?? t);
          continue;
        }
        const w = Qe(f), L = u.swapped ? vt({ ...w, id: h.id, parentId: h.parentId, childId: h.childId }, w) : { ...w, id: h.id, parentId: h.parentId, childId: h.childId };
        JSON.stringify(_o(L)) !== JSON.stringify(h) && (re.set(g, { ...u, key: "" }), $e({ set: L }));
      }
  }
  function _o(i) {
    return In({ ...t, lines: [] }, i)?.lines?.[0] ?? null;
  }
  function $e(i) {
    const a = t.lines?.find((f) => f.id === ("set" in i ? i.set.id : i.remove)), d = "set" in i ? In(t, i.set) : Kt(t, i.remove);
    if (!d || d === t) return;
    e.beginHostStep?.(), t = d, e.endHostStep?.(), z(I ?? t);
    const c = "set" in i ? i.set : a, g = [c.parentId, c.childId].map((f) => t.cards.find((w) => w.id === f)?.label ?? e.nodes.one(f)?.options?.text?.replace(/\s+/g, " ").trim() ?? ""), u = (f) => g[f] || (f === 1 && c.targetPoint ? "a point on the canvas" : "a note");
    e.announce?.("set" in i ? a ? `The line from ${u(0)} to ${u(1)} changed.` : c.targetPoint ? `${u(0)} has a line to a point on the canvas.` : `${u(0)} is joined to ${u(1)}.` : `The line from ${u(0)} to ${u(1)} was taken away.`);
    const h = B(o.onChange, t, { line: i });
    Jn(h, () => {
      if (y || t !== d) return;
      const f = a ? In(t, a) : "set" in i ? Kt(t, i.set.id) : null;
      f && (t = f, z(I ?? t));
    });
  }
  function No(i) {
    const a = new Map(i.map((c) => [c.id, c])), d = new Map((t.lines ?? []).map((c) => [c.id, c]));
    for (const c of d.keys()) a.has(c) || $e({ remove: c });
    for (const [c, g] of a)
      JSON.stringify(d.get(c)) !== JSON.stringify(g) && ln(t, g) === null && $e({ set: g });
  }
  function zn(i, a) {
    let d = t;
    const c = /* @__PURE__ */ new Map(), g = i.map(({ node: f, offer: w, from: L }) => {
      let C = w.lines;
      for (const [U, G] of c) C = De(C, U, G);
      d = on(d, a, { ...w, ...C ? { lines: C } : {} });
      const _ = d.cards[d.cards.length - 1];
      _.id !== f.id && c.set(f.id, _.id);
      const H = { ...f.options ?? {}, ...L ? { x: L.x, y: L.y } : {} };
      return { node: f, card: _, kept: H, lines: De(C ?? [], f.id, _.id), under: w.under };
    });
    e.beginHostStep?.(), t = d;
    let u = t;
    for (const { node: f, card: w } of g)
      w.id !== f.id && S.set(f.id, w.id), O.set(ce(se.card(w.id)), { x: f.options?.x ?? 0, y: f.options?.y ?? 0 }), We(() => e.removeNode(f.id));
    e.endHostStep?.(), z(t), Mo(ce(se.card(g[0].card.id)));
    const h = t.lanes.find((f) => f.id === a);
    e.announce?.(g.length === 1 ? `${V(g[0].card)} is now a card in ${h.label}. ${xe(t, a)}.` : `${bt(g.map(({ card: f }) => V(f)))} are now cards in ${h.label}. ${xe(t, a)}.`);
    for (const { node: f, card: w, kept: L, lines: C, under: _ } of g) {
      const H = { cardId: w.id, laneId: a, noteToCard: {
        noteId: f.id,
        label: w.label,
        ..._ && { under: _ },
        ...w.look ? { look: w.look } : {},
        ...w.asNote ? { asNote: w.asNote } : {},
        ...C.length ? { lines: C } : {}
      } }, U = () => {
        t !== u || !t.cards.some((ee) => ee.id === w.id) || (t = Z({ ...t, cards: t.cards.filter((ee) => ee.id !== w.id), lines: De(t.lines, w.id, f.id) }), u = t, z(t));
      }, G = B(o.onChange, t, H);
      e.holdTrade?.(f.id, G), At(G, () => {
        e.sendHeld?.([{ type: "onNodeDeleted", data: { id: f.id, isComment: !1 } }]);
      }, () => {
        if (!y) {
          if (U(), !e.nodes.one(L.id)) {
            e.beginHostStep?.();
            const ee = We(() => e.addNode({ ...L }));
            ee && (ee.announcedByCreator = !0), e.endHostStep?.();
            const Ee = De(C, w.id, f.id).filter((ue) => !t.cards.some((pn) => pn.id === ue.parentId || pn.id === ue.childId));
            ee?.ready?.then?.(() => {
              y || We(() => xt(Ee));
            });
          }
          e.announce?.(`${V(w)} could not be saved as a card. It is a note on the canvas again.`);
        }
      }, () => {
        y || (U(), e.keepTrade?.(f.id), e.announce?.(`Someone else put ${V(w)} on the board first.`));
      });
    }
  }
  function Dn(i, a) {
    const d = t.cards.find((te) => te.id === i), c = t.lanes.find((te) => te.id === d.laneId), g = t.cards.findIndex((te) => te.id === i), u = t.cards.slice(g + 1).find((te) => te.laneId === d.laneId)?.id, h = v.get(ce(se.card(i))) ?? {}, f = to(d), w = e.nodes.one(f) ? "node_" + Math.random().toString(36).slice(2, 11) + "_" + Date.now() : f, L = Gt(t, i), { leave: C } = xr(t, i, w), _ = Ut(t, i, w), H = (Re.cornerRadius ?? 0) > 0, U = d.asNote, G = U?.text !== void 0 && ut(U.text) === d.label ? U.text : Ir(t, d), ee = {
      id: w,
      x: Math.round(a.x),
      y: Math.round(a.y),
      width: U?.width ?? h.width ?? 228,
      height: U?.height ?? h.height ?? 76,
      text: G,
      shape: U?.shape ?? (H ? "roundedrectangle" : "rectangle"),
      backgroundColor: d.look?.backgroundColor ?? h.backgroundColor,
      fontColor: d.look?.textColor ?? h.foregroundColor,
      fontSize: d.look?.fontSize ?? h.fontSize,
      borderColor: d.look?.borderColor ?? h.borderColor,
      borderWidth: d.look?.borderWidth ?? h.borderWidth,
      ...d.look?.fontFamily ?? h.fontFamily ? { fontFamily: d.look?.fontFamily ?? h.fontFamily } : {}
    };
    U?.image && Object.assign(ee, {
      image: U.image.src,
      ...U.image.width ? { imageOrigWidth: U.image.width } : {},
      ...U.image.height ? { imageOrigHeight: U.image.height } : {}
    }), U?.link && (ee.link = { ...U.link });
    for (const te of Object.keys(ee)) ee[te] === void 0 && delete ee[te];
    e.beginHostStep?.(), t = _;
    const Ee = t;
    w !== i ? S.set(w, i) : S.delete(w);
    const ue = We(() => e.addNode(ee));
    ue && (ue.announcedByCreator = !0), e.endHostStep?.(), z(t);
    const pn = Promise.resolve(ue?.ready).then(() => y || !ue || e.nodes.one(w) !== ue ? [] : We(() => xt(C))).catch(() => []);
    ue?.ready?.then?.(() => {
      if (y || e.nodes.one(w) !== ue) return;
      const te = () => e.selectNodes?.([ue]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(te) : te();
    }), e.announce?.(`${V(d)} is now a note on the canvas. ${c.label}: ${xe(t, c.id)}.`);
    const Lt = () => {
      e.nodes.one(w) === ue && (e.beginHostStep?.(), We(() => e.removeNode(w)), e.endHostStep?.());
    }, Pt = B(o.onChange, t, { cardId: i, cardToNote: { noteId: w } });
    e.holdTrade?.(w, Pt), At(Pt, () => {
      pn.then((te) => {
        ue && e.nodes.one(w) === ue && e.sendHeld?.([{ type: "onNodeAdded", data: { id: w, nodeOptions: Wt(ue.options) } }, ...te]);
      });
    }, () => {
      if (!y) {
        if (Lt(), t === Ee && !t.cards.some((te) => te.id === i)) {
          const te = {
            id: i,
            label: d.label,
            ...d.look ? { look: d.look } : {},
            ...d.asNote ? { asNote: d.asNote } : {},
            ...L.length ? { lines: L } : {}
          }, $t = on(t, d.laneId, te, u);
          $t && (t = $t, z(t));
        }
        e.announce?.(`${V(d)} could not be saved as a note. It is a card again.`);
      }
    }, () => {
      y || (Lt(), e.keepTrade?.(w), e.announce?.(`Someone else took ${V(d)} off the lanes first.`));
    });
  }
  function Ro(i, a, d) {
    const c = d.map((w) => w.id), g = c.indexOf(a), u = i.cards.find((w) => w.id === a);
    if (g < 0 || !u) return i;
    const h = i.cards.filter((w) => w !== u), f = h.findIndex((w) => c.indexOf(w.id) > g);
    return h.splice(f < 0 ? h.length : f, 0, u), Z({ ...i, cards: h });
  }
  function Mo(i) {
    j = j.then(() => {
      const a = k.get(i);
      if (y || !a) return;
      const d = () => e.selectNodes?.([a]);
      typeof e.withoutAnnouncements == "function" ? e.withoutAnnouncements(d) : d();
    });
  }
  function We(i) {
    return typeof e.onlyHere == "function" ? e.onlyHere(i) : i();
  }
  function At(i, a, d, c) {
    if (!i || typeof i.then != "function") return a();
    const g = i.then((u) => {
      u === !0 ? a() : u === !1 ? d() : u === "taken" && c();
    }, () => d());
    e.holdUntil?.(g);
  }
  function Wo(i, a) {
    ae(!1), $ = { laneId: a.laneId, reason: a.reason, timer: setTimeout(() => ae(), 1500) }, z(t, { skip: a.cardId });
    const d = t.lanes.find((c) => c.id === a.laneId);
    e.announce?.(`${i || "The empty card"} can't move to ${d?.label ?? "that lane"}. ${a.reason}`), B(o.onRefuse, a);
  }
  function ae(i = !0) {
    $ && (clearTimeout($.timer), $ = null, i && !y && Ce());
  }
  function Ce() {
    z(R && R.outcome.kind === "candidate" ? R.outcome.next : r?.next ?? I ?? t, { skip: R?.cardId });
  }
  function Ct(i) {
    const a = St(i, Tt()), d = new Map(a.map((u) => [u.options.id, u.options])), c = (u, h, f, w = !1) => {
      const L = d.get(se.column(u));
      L && (L.borderColor = h, L.borderWidth = f, delete L.borderStyle);
      const C = w && d.get(se.lane(u));
      C && (C.borderColor = h, C.borderWidth = f);
    }, g = R?.cardId ?? r?.cardId;
    if (pe = /* @__PURE__ */ new Map(), g) {
      const u = t.cards.find((w) => w.id === g)?.laneId, h = Ht(t, g);
      if (!l || l.laneCues)
        for (const w of h) w.id !== u && (c(w.id, Ft, 2), pe.set(w.id, "open"));
      if (l?.laneCues) {
        for (const w of t.lanes) if (!h.includes(w)) {
          const L = d.get(se.column(w.id));
          L && (L.backgroundColor = "#e9e8e2"), pe.set(w.id, "closed");
        }
      }
      const f = R ? R.outcome : r?.laneId ? { kind: "candidate", laneId: r.laneId } : null;
      f?.kind === "candidate" && (c(f.laneId, jt, 3, !0), pe.set(f.laneId, "over")), f?.kind === "refused" && (c(f.laneId, qn, 3), pe.set(f.laneId, "refused"));
    }
    if (x && !g) {
      for (const u of x.open) u !== x.laneId && (c(u, Ft, 2), pe.set(u, "open"));
      x.laneId && !x.refusal && (c(x.laneId, jt, 3, !0), pe.set(x.laneId, "over")), x.laneId && x.refusal && (c(x.laneId, qn, 3), pe.set(x.laneId, "refused"));
    }
    if (r?.laneId === null && r.spot) {
      const u = d.get(se.card(r.cardId));
      u && (u.xPos = r.spot.x, u.yPos = r.spot.y);
    }
    if ($) {
      pe.set($.laneId, "refused"), c($.laneId, qn, 3, !0);
      const u = d.get(se.caption($.laneId));
      u && (u.text = $.reason, u.foregroundColor = "#b42318");
    }
    if (Oe = /* @__PURE__ */ new Set(), I && i === I) {
      const u = (f, w) => JSON.stringify(f) === JSON.stringify(w), h = (f) => {
        const w = d.get(f);
        w && (w.borderStyle = "dashed", w.borderColor = ir, w.borderWidth = 2, Oe.add(ce(f)));
      };
      for (const f of i.cards) u(f, t.cards.find((w) => w.id === f.id)) || h(se.card(f.id));
      for (const f of i.lanes) u(f, t.lanes.find((w) => w.id === f.id)) || h(se.lane(f.id));
    }
    for (const u of a) {
      u.options.id = ce(u.options.id);
      for (const h of u.relationships.associations)
        h.parentId = ce(h.parentId), h.childId = ce(h.childId);
    }
    return a;
  }
  function Tt() {
    return R || r ? t.lanes.map((i) => t.cards.filter((a) => a.laneId === i.id).length) : void 0;
  }
  function z(i, a = {}) {
    if (y) return;
    Y = { model: i, skip: a.skip, grip: a.grip, animate: a.animate !== !1 };
    const d = Ct(i), c = [];
    for (const { options: u } of d) {
      const h = u.id;
      if (k.has(h)) continue;
      const f = O.get(h);
      O.delete(h);
      const w = f && a.animate !== !1 && !Kn() ? { ...u, xPos: f.x, yPos: f.y } : u, L = e.nodes.add(tr(w));
      k.set(h, L), v.set(h, { ...w }), L.ready && c.push(L.ready.then(() => {
        if (k.get(h) !== L) return;
        L.applyGovernance?.(), he(h)?.kind === "column" && L.toBack?.(!1), he(h)?.kind === "handle" && L.svgGroup?.front?.();
        const C = Ot(Y?.model ?? i, h);
        C && L.svgGroup?.node?.setAttribute("aria-label", C);
      }).catch(() => {
      }));
    }
    const g = Y;
    j = Promise.all([j, ...c]).then(() => {
      y || Y !== g || jo(Ct(g.model), g);
    }).catch((u) => console.warn("WORKSHOP: could not draw the workshop", u));
  }
  function jo(i, a) {
    const d = new Set(i.map((g) => g.options.id)), c = e.getSelectedNodes?.() ?? [];
    if (e.withPolicyAuthority(() => {
      for (const [u, h] of [...k]) {
        if (d.has(u)) continue;
        for (const [w, L] of [...A])
          L.parentId !== u && L.childId !== u || (L.parent.relationships?.removeAssociation(w), A.delete(w));
        e.deselectNode?.(h), h.editor?.cancelInline?.(), k.delete(u), v.delete(u);
        const f = D.get(u);
        f && (D.delete(u), N.delete(f)), e.nodes.remove(u);
      }
      for (const { options: u } of i) {
        const h = u.id, f = k.get(h);
        if (!f?.svgGroup) continue;
        const w = v.get(h) ?? {}, L = f.editor?.isInlineEditing?.();
        (u.fontSize !== w.fontSize || u.foregroundColor !== w.foregroundColor) && (f.options.fontSize = u.fontSize, f.options.fontColor = u.foregroundColor, f.applyTextStyle?.()), u.text !== w.text && !L && f.setText?.(u.text), (u.width !== w.width || u.height !== w.height) && (u.vectorPath ? (f.options.width = u.width, f.options.height = u.height, f.setShape?.(f.options.shape, u.vectorPath), he(h)?.kind === "column" && f.toBack?.(!1)) : f.setSize?.(u.width, u.height)), u.backgroundColor !== w.backgroundColor && f.setColors?.(u.backgroundColor), (u.borderColor !== w.borderColor || u.borderWidth !== w.borderWidth || u.borderStyle !== w.borderStyle) && (f.options.borderColor = u.borderColor, f.options.borderWidth = u.borderWidth, f.options.borderStyle = u.borderStyle, f.applyBorder?.());
        const C = u.xPos !== w.xPos || u.yPos !== w.yPos || Math.abs((f.options.x ?? 0) - u.xPos) > 0.5 || Math.abs((f.options.y ?? 0) - u.yPos) > 0.5;
        if (h !== (a.skip && ce(se.card(a.skip))) && h !== (a.grip && ce(a.grip)) && C) {
          const U = a.animate && !Kn() ? 180 : 0, G = c.includes(f) ? () => {
            !y && k.get(h) === f && (e.getSelectedNodes?.() ?? []).includes(f) && e.updateSelectionResizeRotate?.();
          } : void 0;
          G && U && c.length === 1 && f.resizeRotate?.disable?.(), f.position(u.xPos, u.yPos, G, void 0, U);
        }
        const _ = Ot(a.model, h);
        _ && f.svgGroup.node.getAttribute("aria-label") !== _ && f.svgGroup.node.setAttribute("aria-label", _), Oe.has(h) ? f.svgGroup.node.setAttribute("data-workshop-proposed", "") : f.svgGroup.node.removeAttribute("data-workshop-proposed");
        const H = he(h);
        if (H?.kind === "column") {
          const U = pe.get(H.key);
          U ? f.svgGroup.node.setAttribute("data-workshop-drop", U) : f.svgGroup.node.removeAttribute("data-workshop-drop");
        }
        H?.kind === "handle" && f.svgGroup.front?.(), v.set(h, { ...u });
      }
      const g = /* @__PURE__ */ new Map();
      for (const u of i) for (const h of u.relationships.associations) g.set(h.id, h);
      for (const [u, h] of [...A])
        g.has(u) && k.get(h.parentId) === h.parent && k.get(h.childId) === h.child || (h.parent.relationships?.removeAssociation(u), A.delete(u));
      for (const [u, h] of g) {
        if (A.has(u)) continue;
        const f = k.get(h.parentId), w = k.get(h.childId);
        !f?.relationships || !w?.svgGroup || (f.relationships.addAssociation(w, tn(h)), A.set(u, { parentId: h.parentId, childId: h.childId, parent: f, child: w }));
      }
      $o(a.model);
    }), p) {
      const g = t.lanes.map((w) => k.get(ce(se.column(w.id)))?.svgGroup?.node).reduce((w, L) => L && (!w || w.compareDocumentPosition(L) & 4) ? L : w, null), u = a.model, h = e.canvas?.viewbox?.(), f = h && [h.x, h.y, h.width, h.height].every(Number.isFinite) ? { x: h.x - X.x, y: h.y - X.y, width: h.width, height: h.height } : null;
      p.draw(t, u === t ? null : u, {
        origin: X,
        layout: J,
        above: g,
        view: f,
        announce: (w) => e.announce?.(w),
        clamp: b?.last?.clampedReason ? { name: b.name, text: b.last.clampedReason } : R?.outcome.kind === "candidate" && R.outcome.said ? { name: "card-" + R.cardId, text: R.outcome.said } : !b && M ? { name: M.name, text: M.reason } : null,
        refused: !!b?.last?.refusal || !b && !!M,
        onUnlink: (w, L) => {
          if (T || I || R || b || Ye()) return;
          const C = He(t, [{ kind: "unlink_tasks", card: { id: w }, waitsOn: { id: L } }]);
          "refused" in C ? e.announce?.(C.refused.reason) : hn(C.workshop, { cardId: w });
        }
      });
    }
    e.notifyNodeChanged?.();
  }
  function en(i) {
    return { x: i.x - X.x, y: i.y - X.y };
  }
  function je(i) {
    return l ? l.places(i, J) : { ...Ue(i, { layout: J }), parts: [] };
  }
  function Fo(i, a) {
    const d = l.places(i, J).parts.find((c) => c.name === a);
    return d ? { x: d.x, y: d.y, width: d.width, height: d.height } : void 0;
  }
  function St(i, a) {
    if (!l) return $r(i, { native: !0, origin: X, rows: a, layout: J, style: Re }).nodes;
    const d = l.notes(i, J, X, Re);
    if (i.behaviour && d.length) {
      const c = d.map((f) => f.options), g = Math.min(...c.map((f) => f.xPos)), u = Math.max(...c.map((f) => f.xPos + f.width)), h = Ao(i, { x: g, y: Math.max(...c.map((f) => f.yPos + f.height)) + 16, width: Math.min(u - g, 484) }, Re);
      h && d.push(h);
    }
    return d;
  }
  function hn(i, a, d) {
    const c = l.editsBetween(t, i);
    if (!c.length) return !1;
    const g = He(t, c);
    return "refused" in g ? (e.announce?.(g.refused.reason), B(o.onRefuse, { ...a, laneId: g.refused.laneId, reason: g.refused.reason }), !1) : (t = g.workshop, z(t, { skip: d }), e.announce?.(g.report.edits.map((u) => u.said).join(" ")), B(o.onChange, t, { ...a, edits: c }), !0);
  }
  function Ot(i, a) {
    const d = he(a);
    if (d?.kind === "lane") {
      const c = i.lanes.find((g) => g.id === d.key);
      return c ? `${c.label}, ${xe(i, c.id)}` : null;
    }
    if (d?.kind === "card") {
      const c = i.cards.find((u) => u.id === d.key), g = c && i.lanes.find((u) => u.id === c.laneId);
      return c && g ? `${c.label || "Empty card"}, in ${g.label}${l?.cardKeys ? ". " + l.cardKeys : ""}` : null;
    }
    return d?.kind === "handle" ? l?.label?.(i, Ae(a)) ?? null : null;
  }
  function Hn(i, a) {
    const d = St(i).find((c) => c.options.id === a)?.options;
    return d ? { x: d.xPos, y: d.yPos } : null;
  }
  function Fe() {
    (R || b) && e.cancelGovernedDrag?.("host"), R = null, b = null, r && (r = null, B(o.onPreview, null)), ae(!1);
  }
  return {
    toCanvas(i) {
      if (y || T || Ye()) return "This workshop is view-only here.";
      if (!t.cards.some((g) => g.id === i)) return "That card is no longer on the board.";
      const a = vn(t, i);
      if (a) return a;
      r && Pe(), I && (Fe(), I = null, z(t), e.refreshGovernance?.());
      const { width: d } = je(t), c = k.get(ce(se.card(i)))?.options;
      return Dn(i, { x: X.x + d + 32, y: c?.y ?? X.y }), null;
    },
    get value() {
      return t;
    },
    get origin() {
      return { ...X };
    },
    get layout() {
      return { ...J };
    },
    get bounds() {
      const { width: i, height: a } = je(t);
      return { x: X.x, y: X.y, width: i, height: a };
    },
    setLayout(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = zt(i);
      l ? l.places(t, a) : Ue(t, { layout: a }), JSON.stringify(a) !== JSON.stringify(J) && (Fe(), J = a, z(I ?? t));
    },
    whenDrawn: () => j,
    update(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = Z(i);
      Fe(), t = a;
      const d = T;
      T = E || s(t), z(I ?? t), T !== d && e.refreshGovernance?.();
    },
    preview(i) {
      if (y) throw new Error("This workshop has been detached.");
      const a = i ? Z(i) : null;
      Fe(), I = a, z(I ?? t), e.refreshGovernance?.();
    },
    refuse(i, a) {
      const d = t.lanes.find((c) => c.id === i);
      y || !d || (ae(!1), $ = { laneId: i, reason: a, timer: setTimeout(() => ae(), 1500) }, Ce(), e.announce?.(`${d.label}: ${a}`));
    },
    setReadOnly(i) {
      E = !!i;
      const a = E || s(t);
      y || T === a || (Fe(), T = a, z(I ?? t), e.refreshGovernance?.());
    },
    destroy() {
      y || (Fe(), y = !0, M && clearTimeout(M.timer), e.element?.removeEventListener?.("pointerdown", wt, !0), To?.(), e.withPolicyAuthority(() => {
        for (const [i, a] of re) e.nodes.one(a.holder.id) === a.holder && a.holder.relationships?.removeAssociation?.(i);
        for (const [i, a] of A) a.parent.relationships?.removeAssociation(i);
        for (const [i, a] of k)
          e.deselectNode?.(a), a.editor?.cancelInline?.(), e.nodes.one(i) === a && e.nodes.remove(i);
      }), A.clear(), re.clear(), k.clear(), v.clear(), N.clear(), D.clear(), Co(), p?.destroy(), de = !1, Mn(), e.notifyNodeChanged?.());
    }
  };
}
function B(e, ...n) {
  try {
    return e?.(...n);
  } catch (o) {
    console.error("WORKSHOP: a host callback threw", o);
    return;
  }
}
function Jn(e, n, o) {
  !e || typeof e.then != "function" || e.then((t) => {
    t === !1 && n?.();
  }, () => {
  });
}
function dr(e, n) {
  return e.kind === "candidate" && n.kind === "candidate" ? e.said === n.said && (e.next === n.next || JSON.stringify(e.next) === JSON.stringify(n.next)) : e.kind === n.kind && e.laneId === n.laneId && e.reason === n.reason;
}
function zt(e) {
  const n = {};
  return e?.lanesPerRow !== void 0 && (n.lanesPerRow = e.lanesPerRow), e?.narrow && (n.narrow = !0), e?.width !== void 0 && (n.width = e.width), n;
}
function cr(e) {
  const n = e.nodes?.allNodes ?? [];
  if (!n.length) return { x: 40, y: 40 };
  let o = -1 / 0, t = 1 / 0;
  for (const l of n)
    o = Math.max(o, (l.options.x ?? 0) + (l.options.width ?? 0)), t = Math.min(t, l.options.y ?? 0);
  return { x: Math.round(o + 80), y: Math.round(t) };
}
const ur = ["launch-plan", "pipeline", "budget", "hiring-plan", "nest"];
function ie(e) {
  return ur.includes(e.kind) ? e.kind : void 0;
}
function fe(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) throw new Error("Expected a workshop object.");
  return e;
}
function we(e, n = 80) {
  if (typeof e != "string" || !e.trim() || e.trim().length > n)
    throw new Error(`Labels must contain 1 to ${n} characters.`);
  if (/[<>\u0000-\u001f]/.test(e)) throw new Error("Use plain text without markup or control characters.");
  return e.trim();
}
function fr(e) {
  if (e == null) return "";
  if (typeof e != "string") throw new Error("Labels must contain 1 to 80 characters.");
  const n = Pn(e);
  if (n.length > 80) throw new Error("A card holds up to 80 characters.");
  return n;
}
function Pn(e) {
  return e.replace(/[\t\n\r\f\v]/g, " ").replace(/[\u0000-\u001f\u007f]/g, "").replace(/\s+/g, " ").trim();
}
const ct = /^(?!\$)[^\u0000-\u001f\u007f]{1,200}$/;
function Xn(e) {
  if (typeof e != "string" || !ct.test(e)) throw new Error("A line names its notes by their ids.");
  return e;
}
function to(e) {
  return e.noteId ?? e.id;
}
function ut(e) {
  const n = Pn(String(e ?? ""));
  if (n.length <= 80) return n;
  const o = n.slice(0, 79), t = o.lastIndexOf(" ");
  return (t > 40 ? o.slice(0, t) : o).trimEnd() + "…";
}
function oo(e) {
  const n = fe(e);
  let o;
  try {
    o = new URL(we(n.src, 2048));
  } catch {
    throw new Error("Use a full HTTPS address for the image.");
  }
  if (o.protocol !== "https:" || o.username || o.password || o.href.length > 2048)
    throw new Error("Use an HTTPS image address without sign-in details.");
  return { src: o.href, alt: we(n.alt, 240) };
}
function ge(e) {
  if (typeof e != "string" || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/.test(e))
    throw new Error("IDs must be short alphanumeric slugs.");
  return e;
}
const ro = /^(?:#[0-9a-fA-F]{3,8}|rgba?\(\s*[\d.]+%?\s*,\s*[\d.]+%?\s*,\s*[\d.]+%?\s*(?:,\s*[\d.]+%?\s*)?\)|transparent|[a-zA-Z]{3,20})$/, hr = /^[A-Za-z0-9 ,'"_-]{1,120}$/;
function et(e) {
  const n = fe(e), o = {}, t = (s) => {
    if (typeof s != "string" || !ro.test(s)) throw new Error("Use a colour such as #f0f0f0 for a card.");
    return s;
  }, l = (s, p, b) => {
    if (typeof s != "number" || !Number.isFinite(s) || s < p || s > b) throw new Error("A card size is out of range.");
    return s;
  };
  if (n.backgroundColor !== void 0 && (o.backgroundColor = t(n.backgroundColor)), n.textColor !== void 0 && (o.textColor = t(n.textColor)), n.borderColor !== void 0 && (o.borderColor = t(n.borderColor)), n.fontFamily !== void 0) {
    if (typeof n.fontFamily != "string" || !hr.test(n.fontFamily)) throw new Error("Use a plain type family for a card.");
    o.fontFamily = n.fontFamily;
  }
  return n.fontSize !== void 0 && (o.fontSize = l(n.fontSize, 6, 200)), n.borderWidth !== void 0 && (o.borderWidth = l(n.borderWidth, 0, 20)), Object.keys(o).length ? o : void 0;
}
function so(e) {
  const n = {};
  for (const [o, t] of Object.entries(e ?? {}))
    if (t !== void 0)
      try {
        et({ [o]: t }) && (n[o] = t);
      } catch {
      }
  return et(n);
}
function nt(e) {
  if (typeof e != "string" || !e) return !1;
  if (/^data:image\/(?:png|jpe?g|gif|webp|bmp|svg\+xml);base64,[A-Za-z0-9+/=\s]+$/i.test(e)) return e.length <= 16e6;
  if (e.length > 4096) return !1;
  if (/^\/(?!\/)/.test(e)) return !0;
  try {
    return ["https:", "http:"].includes(new URL(e).protocol);
  } catch {
    return !1;
  }
}
function Dt(e) {
  try {
    return !!Sn({ link: e });
  } catch {
    return !1;
  }
}
function Sn(e) {
  const n = fe(e), o = {};
  if (n.text !== void 0) {
    if (typeof n.text != "string") throw new Error("A card keeps the note's words as text.");
    const t = n.text.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
    if (t.length > 4e3) throw new Error("A card keeps up to 4000 characters of the note's words.");
    o.text = t;
  }
  if (n.image !== void 0) {
    const t = fe(n.image);
    if (!nt(t.src)) throw new Error("A card keeps a picture by its web address only.");
    o.image = { src: t.src };
    for (const l of ["width", "height"]) {
      const s = t[l];
      if (s !== void 0) {
        if (typeof s != "number" || !Number.isFinite(s) || s < 1 || s > 2e4) throw new Error("A picture size is out of range.");
        o.image[l] = s;
      }
    }
  }
  if (n.link !== void 0) {
    const t = fe(n.link), l = t.data;
    if (!(typeof l == "string" ? l.length <= 2048 : !!l && typeof l == "object" && !Array.isArray(l) && JSON.stringify(l).length <= 2048 && Object.values(l).every((p) => typeof p == "string")) || t.type !== void 0 && (typeof t.type != "string" || !/^[A-Za-z]{1,40}$/.test(t.type)) || t.show !== void 0 && typeof t.show != "boolean") throw new Error("A card keeps a link as a note does.");
    o.link = {
      ...t.type !== void 0 ? { type: t.type } : {},
      data: l,
      ...t.show !== void 0 ? { show: t.show } : {}
    };
  }
  if (n.shape !== void 0) {
    if (typeof n.shape != "string" || !/^[a-z]{1,24}$/i.test(n.shape)) throw new Error("A card keeps a shape by its name only.");
    o.shape = n.shape;
  }
  for (const t of ["width", "height"]) {
    const l = n[t];
    if (l !== void 0) {
      if (typeof l != "number" || !Number.isFinite(l) || l < 10 || l > 4e3) throw new Error("A note size is out of range.");
      o[t] = l;
    }
  }
  return Object.keys(o).length ? o : void 0;
}
const Ke = 96, pr = /^[A-Za-z0-9_][A-Za-z0-9_.:~>-]{0,159}$/, mr = ["solid", "dashed", "dotted"], wr = 1e7;
function qe(e) {
  const n = fe(e);
  if (typeof n.id != "string" || !pr.test(n.id)) throw new Error("A line needs a short id.");
  const o = { id: n.id, parentId: Xn(n.parentId), childId: Xn(n.childId) };
  if (o.parentId === o.childId) throw new Error("A line joins two different notes.");
  const t = (l, s, p) => {
    const b = n[l];
    if (b != null) {
      if (typeof b != "number" || !Number.isFinite(b) || b < s || b > p) throw new Error("A line's look is out of range.");
      o[l] = b;
    }
  };
  if (n.lineColor !== void 0 && n.lineColor !== null) {
    if (typeof n.lineColor != "string" || !ro.test(n.lineColor)) throw new Error("Use a colour such as #666666 for a line.");
    o.lineColor = n.lineColor;
  }
  if (t("lineOpacity", 0, 1), t("lineWidth", 0, 40), t("lineCurviness", -10, 10), n.lineDash !== void 0 && n.lineDash !== null) {
    if (!mr.includes(n.lineDash)) throw new Error("A line is solid, dashed or dotted.");
    o.lineDash = n.lineDash;
  }
  if (n.lineType !== void 0 && n.lineType !== null) {
    if (typeof n.lineType != "string" || !/^[a-z]{1,24}$/i.test(n.lineType)) throw new Error("A line keeps its kind by its name only.");
    o.lineType = n.lineType;
  }
  if (n.lineCurveType !== void 0 && n.lineCurveType !== null) {
    if (n.lineCurveType !== "cubic" && n.lineCurveType !== "quadratic") throw new Error("A line curves cubic or quadratic.");
    o.lineCurveType = n.lineCurveType;
  }
  if (n.lineEffect !== void 0 && n.lineEffect !== null && n.lineEffect !== "") {
    if (typeof n.lineEffect != "string" || !/^[a-z-]{1,24}$/i.test(n.lineEffect)) throw new Error("A line keeps its effect by its name only.");
    o.lineEffect = n.lineEffect;
  }
  for (const l of ["showParentArrow", "showChildArrow"])
    if (!(n[l] === void 0 || n[l] === null)) {
      if (typeof n[l] != "boolean") throw new Error("A line's arrows are on or off.");
      o[l] = n[l];
    }
  if (n.label !== void 0 && n.label !== null && n.label !== "") {
    if (typeof n.label != "string" || n.label.length > 200 || /[<>\u0000-\u001f]/.test(n.label)) throw new Error("A line's label is plain words, up to 200 characters.");
    o.label = n.label;
  }
  if (n.targetPoint !== void 0 && n.targetPoint !== null) {
    const l = fe(n.targetPoint), s = (p) => typeof p == "number" && Number.isFinite(p) && Math.abs(p) <= wr;
    if (!s(l.x) || !s(l.y) || Object.keys(l).some((p) => p !== "x" && p !== "y"))
      throw new Error("A free line end is a point on the canvas.");
    o.targetPoint = { x: Math.round(l.x * 100) / 100, y: Math.round(l.y * 100) / 100 };
  }
  for (const l of ["sourceAnchor", "targetAnchor"]) {
    if (l === "targetAnchor" && o.targetPoint) continue;
    const s = n[l];
    if (s == null) continue;
    const p = fe(s), b = (I) => typeof I == "number" && Number.isFinite(I) && I >= 0 && I <= 1;
    if (!b(p.x) || !b(p.y) || Object.keys(p).some((I) => I !== "x" && I !== "y")) throw new Error("A pinned line end is a spot on its note's edge.");
    o[l] = { x: p.x, y: p.y };
  }
  return o;
}
function gr(e, n) {
  if (!Array.isArray(e)) throw new Error("A workshop's lines are a list.");
  const o = e.map(qe).map((t) => io(t, n)).filter((t) => t.targetPoint ? n.has(t.parentId) : n.has(t.parentId) || n.has(t.childId));
  if (Te(o.map((t) => t.id), "line ID"), o.length > Ke) throw new Error(`A workshop holds up to ${Ke} lines.`);
  return o;
}
function io(e, n) {
  if (!e.targetPoint || !n.has(e.childId)) return e;
  const { targetPoint: o, ...t } = e;
  return t;
}
function Te(e, n) {
  if (new Set(e).size !== e.length) throw new Error(`Duplicate ${n}.`);
}
function ft({ lanes: e, presentationOrder: n }) {
  if (n === void 0) return e.slice();
  if (!Array.isArray(n) || n.length !== e.length || new Set(n).size !== e.length)
    throw new Error("Presentation order must include every lane exactly once.");
  return Array.from(n, (o) => {
    const t = e.find((l) => l.id === o);
    if (!t) throw new Error("Presentation order refers to an unknown lane.");
    return t;
  });
}
function yr(e) {
  return (e.signals ?? []).map((n) => {
    const o = e.cards.some((t) => t.id === n.cardId && t.laneId === n.laneId);
    return { ...n, present: o, text: o ? n.whenPresent : n.whenAbsent };
  });
}
const Ge = (e) => "lane-" + e, Se = (e) => "card-" + e, $n = (e) => "image-" + e;
function ts(e) {
  const n = yr(e);
  return ft(e).map((o) => {
    const t = e.cards.filter((p) => p.laneId === o.id), l = n.filter((p) => p.laneId === o.id), s = [Ge(o.id)];
    return o.station?.image && s.push($n(o.id)), { lane: o, cards: t, signals: l, nodeIds: [...s, ...t.map((p) => Se(p.id))] };
  });
}
const ao = 5, tt = 24, ot = 3;
function Z(e) {
  const n = fe(e);
  if (n.version !== 1) throw new Error("Unsupported workshop version.");
  if (n.kind !== void 0 && n.kind !== "release-plan" && !ie(n)) throw new Error("Unsupported workshop kind.");
  const o = n.kind === "release-plan", t = ie(n), l = t ? ye(t) : void 0, s = { id: ge }, p = we(n.title, 120);
  if (!Array.isArray(n.lanes) || n.lanes.length < 2 || n.lanes.length > ao)
    throw new Error("A workshop needs 2 to 5 lanes.");
  const b = l?.cards ?? [tt, "A workshop supports up to 24 cards."];
  if (!Array.isArray(n.cards) || n.cards.length > b[0]) throw new Error(b[1]);
  const I = n.lanes.map((k) => {
    const v = fe(k), A = { id: ge(v.id), label: we(v.label) };
    if (v.capacity !== void 0 && t && t !== "pipeline") throw new Error("Only a pipeline's stages hold a set number of cards.");
    if (v.capacity !== void 0) {
      const N = o ? 576 : 24;
      if (typeof v.capacity != "number" || !Number.isInteger(v.capacity) || v.capacity < 1 || v.capacity > N)
        throw new Error(`Lane capacity must be a whole number from 1 to ${N}.`);
      A.capacity = v.capacity;
    }
    if (l?.readLane?.(v, A, s), v.station !== void 0) {
      const N = fe(v.station), D = (r) => {
        if (typeof r != "number" || !Number.isInteger(r) || r < 0 || r >= ot)
          throw new Error("Use map coordinates from 0 to 2.");
        return r;
      };
      if (!Array.isArray(N.next) || N.next.length > 4) throw new Error("A station needs a list of onward stops.");
      const R = N.next.map(ge);
      Te(R, "onward stop"), A.station = { column: D(N.column), row: D(N.row), next: R, outcome: we(N.outcome, 160) }, N.image !== void 0 && (A.station.image = oo(N.image));
    }
    return A;
  }), E = I.map((k) => k.id);
  if (Te(E, "lane ID"), t && I.some((k) => k.station)) throw new Error("A business board has no map stations.");
  if ((o || I.some((k) => k.station)) && !n.cards.length)
    throw new Error("Maps and release plans need at least one card.");
  if (I.some((k) => k.station)) {
    if (!I.every((k) => k.station)) throw new Error("Give every station on the map a position.");
    Te(I.map((k) => k.station.column + "," + k.station.row), "map position");
    for (const k of I)
      if (k.station.next.some((v) => v === k.id || !E.includes(v))) throw new Error("Connect each stop to another station on this map.");
  }
  const T = n.cards.map((k) => {
    const v = fe(k), A = { id: ge(v.id), label: t ? we(v.label) : fr(v.label), laneId: ge(v.laneId) };
    if (!E.includes(A.laneId)) throw new Error("Card refers to an unknown lane.");
    if (v.allowedLaneIds !== void 0) {
      if (!Array.isArray(v.allowedLaneIds) || v.allowedLaneIds.length > I.length) throw new Error("Invalid allowed lanes.");
      if (A.allowedLaneIds = v.allowedLaneIds.map(ge), Te(A.allowedLaneIds, "allowed lane"), !A.allowedLaneIds.includes(A.laneId) || !A.allowedLaneIds.every((N) => E.includes(N)))
        throw new Error("Allowed lanes must exist and include the starting lane.");
    }
    if (v.look !== void 0) {
      const N = et(v.look);
      N && (A.look = N);
    }
    if (v.asNote !== void 0) {
      const N = Sn(v.asNote);
      N && (A.asNote = N);
    }
    if (v.noteId !== void 0 && v.noteId !== A.id && (A.noteId = Xn(v.noteId)), l?.readCard(v, A, s), o) {
      if (typeof v.points != "number" || !Number.isInteger(v.points) || v.points < 1 || v.points > 24)
        throw new Error("Give each feature 1 to 24 effort points.");
      if (A.points = v.points, v.dependsOn !== void 0) {
        if (!Array.isArray(v.dependsOn) || v.dependsOn.length > 23) throw new Error("Invalid release dependencies.");
        A.dependsOn = v.dependsOn.map(ge), Te(A.dependsOn, "dependency");
      }
    }
    return A;
  });
  Te(T.map((k) => k.id), "card ID");
  const y = { version: 1, title: p, lanes: I, cards: T };
  if (n.experience !== void 0) {
    const k = fe(n.experience);
    if (k.version !== 1 || k.kind !== "customer-interviews" && k.kind !== "experiment-budget")
      throw new Error("Unsupported workshop experience.");
    y.experience = { version: 1, kind: k.kind };
  }
  if (n.signals !== void 0) {
    if (!Array.isArray(n.signals) || n.signals.length > 24) throw new Error("A workshop supports up to 24 placement outcomes.");
    y.signals = n.signals.map((k) => {
      const v = fe(k), A = ge(v.cardId), N = ge(v.laneId);
      if (!T.some((D) => D.id === A) || !E.includes(N))
        throw new Error("Each placement outcome must refer to a card and lane on this board.");
      return {
        id: ge(v.id),
        label: we(v.label),
        cardId: A,
        laneId: N,
        whenPresent: we(v.whenPresent, 160),
        whenAbsent: we(v.whenAbsent, 160)
      };
    }), Te(y.signals.map((k) => k.id), "placement outcome ID");
  }
  if (n.lines !== void 0 && !t) {
    const k = gr(n.lines, new Set(T.map((v) => v.id)));
    k.length && (y.lines = k);
  }
  if (n.presentationOrder !== void 0) {
    if (!Array.isArray(n.presentationOrder)) throw new Error("Presentation order must be a list of lane IDs.");
    y.presentationOrder = ft({ lanes: I, presentationOrder: n.presentationOrder }).map((k) => k.id);
  }
  if (n.behaviour !== void 0 && (y.behaviour = me().validate(n.behaviour, { ...y, kind: n.kind })), o)
    return y.kind = "release-plan", zo(y), y;
  if (t && l) {
    y.kind = t, l.readBoard(n, y, s);
    const k = l.validate(y);
    if (k) throw new Error(k);
    return y;
  }
  for (const k of I)
    if (T.filter((v) => v.laneId === k.id).length > (k.capacity ?? 1 / 0))
      throw new Error(`Lane "${k.label}" exceeds its capacity.`);
  return y;
}
const lo = 65536;
function os(e) {
  const n = JSON.stringify(Z(e)), o = "#" + new URLSearchParams({ model: n }).toString();
  if (o.length > lo) throw new Error("This workshop is too large to open from a link.");
  return o;
}
function rs(e) {
  if (e.length > lo) throw new Error("This workshop is too large to open from a link.");
  const n = new URLSearchParams(e.slice(1)), o = n.get("model");
  if (!e.startsWith("#") || !o || Array.from(n.keys()).length !== 1)
    throw new Error("This link needs one workshop model.");
  let t;
  try {
    t = JSON.parse(o);
  } catch {
    throw new Error("This link contains unreadable workshop data.");
  }
  return Z(t);
}
function ht(e, n, o) {
  const t = ie(e);
  return t ? ye(t).planMove(e, n, o) : void 0;
}
function On(e, n) {
  if (ie(e)) return e.lanes.filter((t) => ht(e, n.id, t.id));
  if (e.kind === "release-plan") return e.lanes.filter((t) => Ln(e, n, t.id) !== null);
  const o = e.lanes.find((t) => t.id === n.laneId)?.station;
  return e.lanes.filter((t) => t.id === n.laneId || (!o || o.next.includes(t.id)) && (!n.allowedLaneIds || n.allowedLaneIds.includes(t.id)) && e.cards.filter((l) => l.laneId === t.id).length < (t.capacity ?? 1 / 0));
}
function rt(e, n, o) {
  const t = e.cards.find((s) => s.id === n), l = ht(e, n, o);
  if (l !== void 0) {
    if (!l) throw new Error("Move is unavailable.");
    return l;
  }
  if (t && e.kind === "release-plan") {
    const s = Ln(e, t, o);
    if (!s) throw new Error("Move is unavailable.");
    return s;
  }
  if (!t || !On(e, t).some((s) => s.id === o)) throw new Error("Move is unavailable.");
  return t.laneId === o ? e : { ...e, cards: e.cards.map((s) => s === t ? { ...t, laneId: o } : s) };
}
function an(e, n, o) {
  const t = co(e, n, o);
  return !t || t === e || !e.behaviour ? t : "refused" in me().check(e, t) ? null : t;
}
function co(e, n, o) {
  const t = e.cards.find((p) => p.id === n);
  if (!t || !e.lanes.some((p) => p.id === o)) return null;
  if (t.laneId === o) return e;
  if (e.kind === "release-plan") return Ln(e, t, o);
  const l = ht(e, n, o);
  if (l !== void 0) return l;
  const s = Er(e, n, o);
  return s || (o === "prototype" && Je(e) === "customer-interviews" ? null : On(e, t).some((p) => p.id === o) ? rt(e, n, o) : null);
}
function Ht(e, n) {
  return e.lanes.filter((o) => an(e, n, o.id) !== null);
}
function bn(e, n, o) {
  const t = co(e, n, o);
  if (t !== null) {
    const y = t === e || !e.behaviour ? null : me().check(e, t);
    return y && "refused" in y ? y.refused.sentence : null;
  }
  const l = e.cards.find((y) => y.id === n), s = e.lanes.find((y) => y.id === o);
  if (!l || !s) return "That move is not available.";
  const p = ie(e), b = p && ye(p).refusal;
  if (b) return b(e, n, o);
  const I = `This card can't go in ${s.label}.`;
  if (l.allowedLaneIds && !l.allowedLaneIds.includes(o)) return I;
  if (e.kind === "release-plan") {
    if (s.capacity === void 0) return I;
    const y = Ne(e, o), k = { ...e, lanes: e.lanes.map((A) => A === s ? { id: s.id, label: s.label } : A) }, v = Ln(k, l, o);
    return v ? `Needs ${Ne(v, o) - y} points. It already holds ${y} of ${s.capacity} points.` : I;
  }
  const E = e.lanes.find((y) => y.id === l.laneId);
  if (E?.station && !E.station.next.includes(o)) return `${s.label} can't be reached from ${E.label}.`;
  const T = e.cards.filter((y) => y.laneId === o).length;
  return s.capacity !== void 0 && T >= s.capacity ? `It already holds ${T} of ${s.capacity} ${s.capacity === 1 ? "card" : "cards"}.` : I;
}
function rn(e) {
  return (!e.kind || !!ie(e)) && !e.lanes.some((n) => n.station) && !Je(e);
}
const kr = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
function pt(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((t) => t.id));
  return typeof n == "string" && kr.test(n) && !o.has(n) ? n : Nn(e, "card");
}
function Be(e, n, o) {
  const t = e.lanes.find((s) => s.id === n);
  if (!t) return "That lane is no longer on the board.";
  if (e.lanes.some((s) => s.station)) return "A map's stations hold its token only.";
  if (e.kind === "release-plan") return "A release plan's features need effort points, so a note can't become one.";
  if (Je(e)) return "This workshop keeps the cards it came with.";
  if (ie(e)) {
    if (!(typeof o?.label == "string" && Pn(o.label))) return "A card needs some words. Type on the note first.";
    if (Array.isArray(o.lines) ? o.lines.length : o.lines !== void 0) return "A note joined to other notes by lines stays a note on this board.";
    const s = ho(e, n, o);
    return typeof s == "string" ? s : Bt(e, s);
  }
  if (e.cards.length >= tt) return `This board is at its size limit of ${tt} cards. Remove a card to make room.`;
  const l = e.cards.filter((s) => s.laneId === n).length;
  if (t.capacity !== void 0 && l >= t.capacity) return `It already holds ${l} of ${t.capacity} ${t.capacity === 1 ? "card" : "cards"}.`;
  if (o.lines !== void 0) {
    const s = uo(o.lines);
    if (!s) return "A line of this note can't be joined to a card.";
    const p = new Set((e.lines ?? []).map((b) => b.id));
    if ((e.lines?.length ?? 0) + s.filter((b) => !p.has(b.id)).length > Ke)
      return `A workshop holds up to ${Ke} lines.`;
  }
  return Bt(e, { ...e, cards: [...e.cards, { id: pt(e, o.id), label: ut(typeof o.label == "string" ? o.label : ""), laneId: n }] });
}
function Bt(e, n) {
  if (!e.behaviour) return null;
  const o = me().check(e, n);
  return "refused" in o ? o.refused.sentence : null;
}
function br(e) {
  try {
    return e && typeof e == "object" ? so(e) : void 0;
  } catch {
    return;
  }
}
function vr(e) {
  if (!e || typeof e != "object" || Array.isArray(e)) return;
  const n = {};
  for (const [o, t] of Object.entries(e))
    try {
      Sn({ [o]: t }) && (n[o] = t);
    } catch {
    }
  return Object.keys(n).length ? Sn(n) : void 0;
}
function uo(e) {
  const n = Array.isArray(e) ? e : [e], o = [];
  for (const t of n) {
    let l = null;
    try {
      l = qe(t);
    } catch {
      const s = (b) => {
        const { id: I, parentId: E, childId: T, targetPoint: y } = fe(t);
        return qe({ id: I, parentId: E, childId: T, ...b ? { targetPoint: y } : {} });
      }, p = t?.targetPoint !== void 0 && t?.targetPoint !== null;
      try {
        l = s(!0);
      } catch {
        try {
          l = p ? null : s(!1);
        } catch {
          l = null;
        }
      }
    }
    if (!l) return null;
    o.push(l);
  }
  return o;
}
function En(e, n, o) {
  return n === o || e.parentId !== n && e.childId !== n ? e : { ...e, parentId: e.parentId === n ? o : e.parentId, childId: e.childId === n ? o : e.childId };
}
function De(e, n, o) {
  return e && e.map((t) => En(t, n, o));
}
function fo(e, n) {
  const o = new Map(n.map((t) => [t.id, t]));
  return [...(e.lines ?? []).filter((t) => !o.has(t.id)), ...o.values()];
}
function on(e, n, o, t) {
  if (Be(e, n, o) !== null) return null;
  if (ie(e)) {
    const v = ho(e, n, o), A = v.cards[v.cards.length - 1], N = t === void 0 ? -1 : e.cards.findIndex((D) => D.id === t && D.laneId === n);
    return N < 0 ? v : { ...v, cards: [...e.cards.slice(0, N), A, ...e.cards.slice(N)] };
  }
  const l = br(o.look), s = typeof o.label == "string" ? Pn(o.label) : "";
  let p = vr(o.asNote);
  s.length > 80 && p?.text === void 0 && s.length <= 4e3 && (p = { ...p, text: s });
  const b = pt(e, o.id), I = b !== o.id && typeof o.id == "string" && ct.test(o.id) ? o.id : void 0, E = {
    id: b,
    label: ut(s),
    laneId: n,
    ...l ? { look: l } : {},
    ...p ? { asNote: p } : {},
    ...I ? { noteId: I } : {}
  }, T = t === void 0 ? -1 : e.cards.findIndex((v) => v.id === t && v.laneId === n), y = T < 0 ? [...e.cards, E] : [...e.cards.slice(0, T), E, ...e.cards.slice(T)], k = o.lines === void 0 ? void 0 : fo(e, uo(o.lines).map((v) => En(v, o.id, E.id)));
  return Z({ ...e, cards: y, ...k ? { lines: k } : {} });
}
function ho(e, n, o) {
  const t = ye(ie(e)).fromNote(e, o.label);
  if (typeof t == "string") return t;
  const l = He(e, [{ kind: "add_card", lane: { id: n }, ...t, ...o.under && { under: { id: o.under } } }]);
  if ("refused" in l) return l.refused.reason;
  const s = l.workshop.cards, p = pt(e, o.id), b = p !== o.id && typeof o.id == "string" && ct.test(o.id) ? o.id : void 0;
  return s[s.length - 1] = { ...s[s.length - 1], id: p, ...b ? { noteId: b } : {} }, l.workshop;
}
function po(e, n) {
  if (e.kind === "release-plan") return n.label + `
` + n.points + " points";
  const o = ie(e);
  return o ? ye(o).cardText(e, n) : n.label;
}
function Ir(e, n) {
  const o = ie(e);
  return o ? ye(o).noteText(e, n) : n.label;
}
function vn(e, n) {
  const o = e.cards.find((t) => t.id === n);
  if (!o) return "That card is no longer on the board.";
  if (!rn(e)) return e.lanes.some((t) => t.station) ? "The token stays on the map." : "This card stays on the board.";
  if (e.kind === "launch-plan" && e.cards.length === 1) return "A launch plan needs at least one task.";
  if ((e.signals ?? []).some((t) => t.cardId === n)) return `An outcome on this board depends on ${o.label}, so it stays a card.`;
  if (e.cards.some((t) => t.parentId === n)) return `${o.label} has cards under it, so it stays a card. Move them first.`;
  if (o.allowedLaneIds && o.allowedLaneIds.length < e.lanes.length) {
    const t = o.allowedLaneIds.map((s) => e.lanes.find((p) => p.id === s).label), l = t.length > 1 ? t.slice(0, -1).join(", ") + " or " + t.at(-1) : t[0];
    return `${o.label} may only be in ${l}, so it stays a card.`;
  }
  return null;
}
function Ut(e, n, o = mo(e, n)) {
  if (vn(e, n) !== null) return null;
  const t = e.cards.filter((s) => s.id !== n).map((s) => {
    if (!s.dependsOn?.includes(n)) return s;
    const p = { ...s, dependsOn: s.dependsOn.filter((b) => b !== n) };
    return p.dependsOn.length || delete p.dependsOn, p;
  }), l = e.lines?.map((s) => En(s, n, o));
  return Z({ ...e, cards: t, ...l ? { lines: l } : {} });
}
function xr(e, n, o = mo(e, n)) {
  const t = new Set(e.cards.filter((p) => p.id !== n).map((p) => p.id)), l = (e.lines ?? []).filter((p) => p.parentId === n || p.childId === n).map((p) => En(p, n, o)), s = (p) => t.has(p.parentId) || t.has(p.childId);
  return { stay: l.filter(s), leave: l.filter((p) => !s(p)) };
}
function mo(e, n) {
  const o = e.cards.find((t) => t.id === n);
  return o ? to(o) : n;
}
function Gt(e, n) {
  return (e.lines ?? []).filter((o) => o.parentId === n || o.childId === n);
}
function ln(e, n) {
  if (e.kind) return Ar;
  let o;
  try {
    o = qe(n);
  } catch (s) {
    return s instanceof Error ? s.message : "That line can't be drawn.";
  }
  const t = new Set(e.cards.map((s) => s.id));
  return o = io(o, t), (o.targetPoint ? !t.has(o.parentId) : !t.has(o.parentId) && !t.has(o.childId)) ? "That card is no longer on the board." : e.lanes.some((s) => s.id === o.parentId || s.id === o.childId) ? "A line joins notes and cards, not lanes." : !(e.lines ?? []).some((s) => s.id === o.id) && (e.lines?.length ?? 0) >= Ke ? `A workshop holds up to ${Ke} lines.` : null;
}
const Ar = "Lines join the cards of a lane workshop to notes and to each other.";
function In(e, n) {
  return ln(e, n) !== null ? null : Z({ ...e, lines: fo(e, [qe(n)]) });
}
function Kt(e, n) {
  return (e.lines ?? []).some((o) => o.id === n) ? Z({ ...e, lines: e.lines.filter((o) => o.id !== n) }) : e;
}
function wo(e, n, o, t = {}) {
  const l = new Set((e.lines ?? []).map((p) => p.id));
  let s = `${n}->${o}`;
  for (let p = 2; l.has(s); p++) s = `${n}->${o}~${p}`;
  return qe({ showChildArrow: !0, ...t, id: s, parentId: n, childId: o });
}
function Cr(e, n) {
  const o = (e.lines ?? []).filter((t) => t.parentId !== n && t.childId !== n);
  return o.length === (e.lines?.length ?? 0) ? e : { ...e, lines: o };
}
function xe(e, n) {
  const o = e.lanes.find((b) => b.id === n);
  if (!o) return "";
  if (e.kind === "release-plan") {
    const b = Ne(e, n);
    return o.capacity ? b + " / " + o.capacity + " points" : b + " points";
  }
  const t = ie(e);
  if (t) return ye(t).caption(e, n);
  const l = _r(e, n);
  if (l) return "$" + l.amount + " · " + l.description;
  const s = e.cards.filter((b) => b.laneId === n).length, p = e.behaviour ? me().laneLimit(e, n) : o.capacity;
  return p !== void 0 ? s + " of " + p : s + (s === 1 ? " card" : " cards");
}
const _n = { pitch: 244, width: 228, row: 88, height: 76, top: 98 }, xn = ["#d5e9e3", "#fbdfac", "#dedef4", "#dcebf3", "#efd7dc"];
function go(e, n = _n, o = 28, t) {
  const { pitch: l, row: s, top: p } = n, b = !!e.lanes[0].station, I = e.lanes.map((y) => e.cards.filter((k) => k.laneId === y.id).length), E = p + Math.max(1, ...t ?? I) * s + 36, T = e.lanes.map((y, k) => ({
    x: b ? y.station.column * (l + o) : k * l,
    y: b ? y.station.row * E : 0
  }));
  return {
    points: T,
    width: Math.max(...T.map((y) => y.x)) + l,
    height: Math.max(...T.map((y, k) => y.y + p + (b ? Math.max(1, I[k]) : I[k] + 1) * s))
  };
}
function ss() {
  return {
    version: 1,
    title: "Untitled workshop",
    lanes: [{ id: "lane-1", label: "Lane 1" }, { id: "lane-2", label: "Lane 2" }],
    cards: []
  };
}
function Nn(e, n) {
  const o = new Set([...e.lanes, ...e.cards, ...e.signals ?? []].map((l) => l.id));
  let t = 1;
  for (; o.has(n + "-" + t); ) t++;
  return n + "-" + t;
}
function yo(e) {
  const n = Z(e);
  if (n.kind || n.lanes[0].station) throw new Error("Choose a lane workshop to add lanes or cards.");
  return n;
}
function Tr(e, n) {
  const o = yo(e), t = Nn(o, "lane");
  return o.lanes.push({ id: t, label: n.label, ...n.capacity === void 0 ? {} : { capacity: n.capacity } }), o.presentationOrder?.push(t), Z(o);
}
function Sr(e, n, o) {
  const t = yo(e);
  return t.cards.push({
    id: Nn(t, "card"),
    label: o.label,
    laneId: n,
    ...o.allowedLaneIds === void 0 ? {} : { allowedLaneIds: o.allowedLaneIds }
  }), Z(t);
}
function is() {
  return {
    version: 1,
    title: "Untitled map",
    lanes: [
      { id: "start", label: "Start", station: { column: 0, row: 0, next: ["next"], outcome: "The token is at the start." } },
      { id: "next", label: "Next step", station: { column: 1, row: 0, next: [], outcome: "The token has reached the next step." } }
    ],
    cards: [{ id: "token", label: "Token", laneId: "start" }]
  };
}
function qt(e, n, o) {
  const t = Z(e);
  if (t.kind || !t.lanes[0].station) throw new Error("Add branches to an interactive map.");
  const l = t.lanes.find((T) => T.id === n);
  if (!l?.station) throw new Error("Choose a station on this map.");
  if (t.lanes.length >= ao) throw new Error("A map can have up to five stations.");
  const s = we(o?.label), p = we(o?.outcome, 160), b = Nn(t, "station");
  let I, E = 1 / 0;
  for (let T = 0; T < ot; T++)
    for (let y = 0; y < ot; y++) {
      if (t.lanes.some((v) => v.station.column === y && v.station.row === T)) continue;
      const k = Math.abs(l.station.column - y) + Math.abs(l.station.row - T);
      k < E && (E = k, I = { column: y, row: T });
    }
  if (!I) throw new Error("There is no free station position.");
  return l.station.next.push(b), t.lanes.push({ id: b, label: s, station: { ...I, next: [], outcome: p, ...o.image === void 0 ? {} : { image: oo(o.image) } } }), t.presentationOrder?.push(b), t;
}
const as = {
  version: 1,
  title: "Can the last train meet the shuttle?",
  lanes: [
    { id: "platform", label: "Last train", station: { column: 0, row: 0, next: ["stairs", "lift"], outcome: "The platform closes at 23:40. Find a step-free transfer before the last shuttle leaves." } },
    { id: "stairs", label: "East stairs", station: { column: 1, row: 0, next: ["platform"], outcome: "The east doors open onto the closed platform. Follow the signs back to the lift." } },
    { id: "lift", label: "Market St lift", station: { column: 0, row: 1, next: ["shuttle"], outcome: "The lift opens on Market Street. The marked path leads to shuttle bay B." } },
    { id: "shuttle", label: "Shuttle · Bay B", station: { column: 1, row: 1, next: [], outcome: "The rider makes the connection. Run it again to try the other exit." } }
  ],
  cards: [{ id: "rider", label: "Last rider", laneId: "platform" }]
}, ko = (e) => "caption-" + e, sn = (e) => "column-" + e, Or = "rules-board", se = { lane: Ge, card: Se, image: $n, caption: ko, column: sn, rules: Or };
function bo(e, n) {
  let o = 2;
  for (; n(`${e}--${o}`); ) o++;
  return `${e}--${o}`;
}
function Yn(e, n, o) {
  const t = Math.max(0, Math.min(o, e / 2, n / 2)), l = e, s = n;
  return t ? `M ${t} 0 H ${l - t} Q ${l} 0 ${l} ${t} V ${s - t} Q ${l} ${s} ${l - t} ${s} H ${t} Q 0 ${s} 0 ${s - t} V ${t} Q 0 0 ${t} 0 Z` : `M 0 0 H ${l} V ${s} H 0 Z`;
}
function Jt(e, n) {
  const o = (t) => Math.round(parseInt(e.slice(t, t + 2), 16) * (1 - n) + 255 * n).toString(16).padStart(2, "0");
  return "#" + o(1) + o(3) + o(5);
}
function Yt(e, n, o, t) {
  for (let l = n; l > 11; l--) {
    const s = Math.max(1, Math.floor(o / (l * 0.55)));
    if (e.split(`
`).reduce((b, I) => b + Math.max(1, Math.ceil(I.length / s)), 0) * l * 1.3 <= t) return l;
  }
  return Math.min(n, 11);
}
const vo = 152, st = vo + 12, Lr = 12;
function Io(e, n) {
  const o = e?.lanesPerRow;
  if (o === void 0) return n;
  if (typeof o != "number" || !Number.isInteger(o) || o < 1) throw new Error("lanesPerRow must be a whole number, 1 or more.");
  return Math.min(o, n);
}
function Ue(e, n = {}) {
  const o = Z(e), { pitch: t, row: l, top: s } = _n, p = o.lanes.map((k) => o.cards.filter((v) => v.laneId === k.id).length), b = (k) => Math.max(p[k], (Array.isArray(n.rows) ? n.rows[k] : n.rows) ?? 0), I = !!o.lanes[0].station, E = o.lanes.some((k) => k.station?.image), T = Io(n.layout, o.lanes.length), y = [];
  if (I) {
    const { points: k } = go(o, void 0, void 0, Array.isArray(n.rows) ? n.rows : void 0);
    o.lanes.forEach((v, A) => y.push({
      laneId: v.id,
      x: k[A].x,
      y: k[A].y + (E ? v.station.row * st : 0),
      width: t,
      height: s + (v.station.image ? st : 0) + Math.max(1, b(A)) * l,
      column: v.station.column,
      row: v.station.row
    }));
  } else {
    let k = xo(o, T)?.below ?? 0;
    for (let v = 0; v < o.lanes.length; v += T) {
      const A = o.lanes.slice(v, v + T), N = s + (Math.max(...A.map((D, R) => b(v + R))) + 1) * l;
      A.forEach((D, R) => y.push({ laneId: D.id, x: R * t, y: k, width: t, height: N, column: R, row: v / T })), k += N + Lr;
    }
  }
  return { places: y, width: Math.max(...y.map((k) => k.x + k.width)), height: Math.max(...y.map((k) => k.y + k.height)) };
}
function xo(e, n, o = 2, t = 0) {
  const l = e.behaviour && n < 2 && e.lanes.length > 1 && !e.lanes[0].station ? me().note(e, { x: o, y: t, width: 240 }, { fontSize: 14 }) : null;
  return l ? { note: l, below: l.options.height + 16 } : null;
}
function Pr(e, n) {
  const { pitch: o, width: t, row: l, height: s, top: p } = _n, b = n.origin ?? { x: 0, y: 0 }, I = !!e.lanes[0].station, { places: E } = Ue(e, n), T = n.style ?? {}, y = T.textColor ?? nn.fontColor, k = T.borderColor ?? nn.borderColor, v = T.borderWidth ?? nn.borderWidth, A = T.cornerRadius ?? 0, N = T.fontSize ?? nn.fontSize, D = T.laneFontSize ?? N + 2, R = T.captionFontSize ?? Math.max(11, N - 1), r = [], m = (O) => {
    const $ = { options: {
      shapeHint: "rectangle",
      vectorPath: Yn(O.width, O.height, A),
      foregroundColor: y,
      borderColor: k,
      borderWidth: v,
      ...T.fontFamily ? { fontFamily: T.fontFamily } : {},
      ...O
    }, relationships: { associations: [] } };
    return r.push($), $;
  };
  e.lanes.forEach((O, $) => {
    const M = E[$], q = b.x + M.x, j = b.y + M.y, Y = O.station?.image;
    m({
      id: sn(O.id),
      text: "",
      name: O.label,
      xPos: q + 2,
      yPos: j,
      width: o - 4,
      height: M.height,
      vectorPath: Yn(o - 4, M.height, A ? A + 2 : 0),
      backgroundColor: I ? "#fcf9ed" : Jt(xn[$], 0.6),
      borderColor: I ? "#a8b5aa" : Jt(xn[$], 0.1),
      borderWidth: 1,
      ...I ? { borderStyle: "dashed" } : {}
    }), m({
      id: Ge(O.id),
      text: O.label,
      name: O.label,
      xPos: q + 8,
      yPos: j + 6,
      width: t,
      height: 58,
      backgroundColor: xn[$],
      fontSize: Yt(O.label, D, t - 16, 50)
    }), m({
      id: ko(O.id),
      text: xe(e, O.id),
      name: O.label,
      xPos: q + 8,
      yPos: j + 66,
      width: t,
      height: 30,
      backgroundColor: "transparent",
      borderWidth: 0,
      fontSize: R
    }), Y && r.push({ options: {
      id: $n(O.id),
      name: Y.alt,
      text: "",
      xPos: q + 8,
      yPos: j + p,
      width: t,
      height: vo,
      shapeHint: "rectangle",
      image: Y.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), e.cards.filter((J) => J.laneId === O.id).forEach((J, Re) => {
      const pe = po(e, J), Oe = I ? t - 20 : t, Me = I ? s - 6 : s, de = I ? {} : { ...T.card, ...J.look }, re = I ? A : T.card?.cornerRadius ?? A;
      m({
        id: Se(J.id),
        text: pe,
        name: J.label,
        xPos: q + (I ? 18 : 8),
        yPos: j + p + (Y ? st : 0) + Re * l,
        width: Oe,
        height: Me,
        ...re !== A ? { vectorPath: Yn(Oe, Me, re) } : {},
        backgroundColor: I ? "#ffda75" : de.backgroundColor ?? T.backgroundColor ?? nn.backgroundColor,
        ...de.textColor ? { foregroundColor: de.textColor } : {},
        ...de.fontFamily ? { fontFamily: de.fontFamily } : {},
        ...de.borderColor ? { borderColor: de.borderColor } : {},
        ...de.borderWidth !== void 0 ? { borderWidth: de.borderWidth } : {},
        fontSize: Yt(pe, de.fontSize ?? N, Oe - 16, Me - 8)
      });
    });
  });
  const x = xo(e, Io(n.layout, e.lanes.length), b.x + 2, b.y)?.note ?? Ao(e, {
    x: b.x,
    y: b.y + Math.max(...E.map((O) => O.y + O.height)) + 16,
    width: Math.min(Math.max(...E.map((O) => O.x + O.width)), o * 2) - 4
  }, T);
  x && r.push(x);
  const S = new Map(r.map((O) => [O.options.id, O]));
  for (const O of e.lanes)
    O.station && (S.get(sn(O.id)).relationships.associations = O.station.next.map(($) => ({
      id: O.id + "-to-" + $,
      parentId: sn(O.id),
      childId: sn($),
      lineType: "straight",
      lineColor: "#506b61",
      lineWidth: 2,
      showChildArrow: !0
    })));
  if (e.kind === "release-plan")
    for (const O of e.cards)
      for (const $ of O.dependsOn ?? []) {
        const M = Se($), q = Se(O.id);
        S.get(M).relationships.associations.push({
          id: `dependency-${$.length}-${$}-${O.id}`,
          parentId: M,
          childId: q,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  if (n.beside) {
    const O = new Set(n.beside), $ = new Set(r.map((j) => j.options.id)), M = /* @__PURE__ */ new Map();
    for (const j of [...$]) {
      if (!O.has(j)) continue;
      const Y = bo(j, (J) => O.has(J) || $.has(J));
      $.add(Y), M.set(j, Y);
    }
    const q = (j) => M.get(j) ?? j;
    for (const j of r) {
      j.options.id = q(j.options.id);
      for (const Y of j.relationships.associations)
        Y.parentId = q(Y.parentId), Y.childId = q(Y.childId);
    }
  }
  return { options: { name: e.title }, shareId: "", nodes: r };
}
function Ao(e, n, o = {}) {
  return e.behaviour ? me().note(e, n, o) : null;
}
function $r(e, n) {
  const o = Z(e);
  if (n?.native) return Pr(o, n);
  const { width: t, row: l, height: s, top: p } = _n, b = [];
  function I(v, A, N, D, R, r) {
    b.push({ options: {
      id: v,
      text: A,
      name: A,
      xPos: N,
      yPos: D,
      width: t,
      height: R,
      shapeHint: "rectangle",
      backgroundColor: r,
      foregroundColor: "#18302d",
      fontSize: 18,
      borderColor: "#667872",
      borderWidth: 1
    }, relationships: { associations: [] } });
  }
  const { points: E } = go(o), T = 152, y = T + 12, k = o.lanes.some((v) => v.station?.image);
  o.lanes.forEach((v, A) => {
    const N = E[A].x, D = E[A].y + (k ? (v.station?.row ?? 0) * y : 0), R = v.station?.image, r = o.kind === "release-plan" ? v.label + `
` + (v.capacity ? Ne(o, v.id) + " / " + v.capacity + " points" : Ne(o, v.id) + " points") : v.label;
    I(Ge(v.id), r, N, D, p - 12, xn[A]), R && b.push({ options: {
      id: $n(v.id),
      name: R.alt,
      text: "",
      xPos: N,
      yPos: D + p,
      width: t,
      height: T,
      shapeHint: "rectangle",
      image: R.src,
      borderWidth: 0
    }, relationships: { associations: [] } }), o.cards.filter((m) => m.laneId === v.id).forEach((m, x) => I(Se(m.id), po(o, m), N, D + p + (R ? y : 0) + x * l, s, "#fffdf6"));
  });
  for (const v of o.lanes) {
    if (!v.station) continue;
    const A = b.find((N) => N.options.id === Ge(v.id));
    A.relationships.associations = v.station.next.map((N) => ({ id: v.id + "-to-" + N, parentId: A.options.id, childId: Ge(N), lineType: "straight", lineColor: "#506b61", lineWidth: 2, showChildArrow: !0 })), A.options.text = v.label + `
` + v.station.outcome, A.options.fontSize = 13;
  }
  if (o.kind === "release-plan") {
    const v = new Map(b.map((A) => [A.options.id, A]));
    for (const A of o.cards)
      for (const N of A.dependsOn ?? []) {
        const D = Se(N), R = Se(A.id);
        v.get(D).relationships.associations.push({
          id: `dependency-${N.length}-${N}-${A.id}`,
          parentId: D,
          childId: R,
          lineType: "straight",
          lineColor: "#566a67",
          lineWidth: 2,
          showChildArrow: !0
        });
      }
  }
  return { options: { name: o.title }, shareId: "", nodes: b };
}
const ls = {
  version: 1,
  title: "Which field trials should run before the winter shutdown?",
  lanes: [
    { id: "proposed", label: "Proposed trials" },
    { id: "pilot", label: "Fund this quarter", capacity: 2 },
    { id: "evidence", label: "Gather evidence" }
  ],
  cards: [
    { id: "sensors", label: "Test bearing sensors on line four", laneId: "proposed" },
    { id: "spares", label: "Stage a spare drive at the north mill", laneId: "proposed" },
    { id: "cooling", label: "Measure cooling losses at shift change", laneId: "evidence", allowedLaneIds: ["evidence", "pilot"] },
    { id: "training", label: "Rehearse the overnight restart", laneId: "pilot" }
  ]
}, it = [
  { id: "preview", who: "Jo · agency owner", quote: "“Will this email every client on my list?”", action: "Show a ten-row preview", signal: "Mara will test whether Jo can import a list without contacting a client." },
  { id: "duplicate", who: "Bea · studio manager", quote: "“I already added half these clients by hand.”", action: "Review matching clients", signal: "Imani will test whether Bea can keep the existing client and skip its duplicate." },
  { id: "undo", who: "Sam · founder", quote: "“I’d try it if I could take the whole import back.”", action: "Undo the last import", signal: "Dev will test whether Sam can restore the original list without support." }
], mt = [
  { id: "calls", label: "Customer calls", unit: "customer calls", single: "customer call", per: 4, rate: "$50 per call" },
  { id: "newsletter", label: "Partner newsletter", unit: "placements", single: "placement", per: 1, rate: "$200 per placement" },
  { id: "pilot", label: "Concierge onboarding", unit: "assisted imports", single: "assisted import", per: 2, rate: "$100 per import" }
];
function ds() {
  return {
    version: 1,
    experience: { version: 1, kind: "customer-interviews" },
    title: "Design partner interviews · first client import",
    lanes: [{ id: "interviews", label: "Customer interviews" }, { id: "prototype", label: "Prototype to test", capacity: 1 }],
    presentationOrder: ["prototype", "interviews"],
    cards: it.map(({ id: e, who: n, quote: o }) => ({ id: e, label: n + " · " + o, laneId: e === "preview" ? "prototype" : "interviews" })),
    signals: it.map(({ id: e, action: n, signal: o }) => ({ id: "test-" + e, label: n, cardId: e, laneId: "prototype", whenPresent: o, whenAbsent: "Still in the interview notes." }))
  };
}
function cs() {
  return {
    version: 1,
    experience: { version: 1, kind: "experiment-budget" },
    title: "Design partner pilot · $600 launch budget",
    lanes: [{ id: "reserve", label: "Unallocated" }, ...mt.map(({ id: e, label: n, rate: o }) => ({ id: e, label: n + " · " + o }))],
    cards: ["First", "Second", "Third"].map((e, n) => ({ id: "fund-" + n, label: e + " $200", laneId: n === 0 ? "calls" : "reserve" })),
    presentationOrder: ["calls", "newsletter", "pilot", "reserve"]
  };
}
function Je(e) {
  if (e.experience?.version !== 1 || e.kind || e.lanes.some((t) => t.station)) return;
  const n = e.experience.kind, o = n === "customer-interviews" ? ["interviews", "prototype"] : ["reserve", ...mt.map((t) => t.id)];
  if (!(e.lanes.length !== o.length || !e.lanes.every((t) => o.includes(t.id))) && !(n === "customer-interviews" && (!e.cards.every((t) => it.some((l) => l.id === t.id)) || e.cards.filter((t) => t.laneId === "prototype").length > 1)))
    return n;
}
function Er(e, n, o) {
  const t = Je(e), l = e.cards.find((p) => p.id === n);
  if (!t || !l || l.laneId === o) return null;
  let s = e;
  if (t === "customer-interviews") {
    if (o !== "prototype") return null;
    const p = e.cards.find((b) => b.laneId === o);
    if (p) {
      if (!On(e, p).some((b) => b.id === "interviews")) return null;
      s = rt(e, p.id, "interviews");
    }
  }
  return On(s, l).some((p) => p.id === o) ? rt(s, n, o) : null;
}
function _r(e, n) {
  if (Je(e) !== "experiment-budget") return null;
  const o = mt.find((s) => s.id === n), t = e.cards.filter((s) => s.laneId === n).length, l = t * (o?.per ?? 0);
  return { amount: t * 200, description: o ? l + " " + (l === 1 ? o.single : o.unit) : "unallocated" };
}
export {
  nn as DEFAULT_NOTE_STYLE,
  Vt as WORKSHOP_BOARD_KINDS,
  kn as WorkshopReferenceError,
  qt as addWorkshopBranch,
  Sr as addWorkshopCard,
  Tr as addWorkshopLane,
  He as applyWorkshopEdits,
  ns as attachWorkshop,
  On as availableLanes,
  Ao as behaviourNote,
  ur as businessBoardKinds,
  ie as businessKind,
  nr as canHangPanel,
  mt as channels,
  er as checkWorkshopReplacement,
  Bo as countWord,
  cs as createBudgetWorkshop,
  ds as createInterviewWorkshop,
  ss as createLaneWorkshop,
  is as createWorkshopMap,
  rs as decodeWorkshopFragment,
  es as describeFocusDarkroom,
  Jr as describeWorkshopEdits,
  os as encodeWorkshopFragment,
  Fr as handoffSummary,
  Vr as hangGalleryPanel,
  ls as industrialWorkshop,
  Xr as initialFocusDarkroom,
  it as interviews,
  Ko as isRuleEdit,
  xn as laneColors,
  _e as listed,
  mn as listeningRoom,
  Dr as listeningRoomCaption,
  tt as maxWorkshopCards,
  Ke as maxWorkshopLines,
  Yr as moonGallery,
  rt as moveWorkshopCard,
  qr as named,
  as as nightTransfer,
  Qr as normalizeFocusDarkroom,
  zr as normalizeListeningRoom,
  Zr as normalizeMoonGallery,
  Mr as normalizeOfflineHandoff,
  Rr as offlineHandoff,
  Er as planStartupMove,
  Uo as pointing,
  eo as printFields,
  Gr as registerRulebook,
  Br as registerWorkshopRules,
  Ne as releaseLoad,
  Hr as releasePlan,
  jr as resolveHandoff,
  yr as resolveWorkshopSignals,
  Wr as reviewHandoff,
  Yn as roundedBox,
  me as rulebook,
  Kr as rulebookLoaded,
  P as said,
  Je as startupExperienceKind,
  lt as unquoted,
  Z as validateWorkshop,
  Cn as workshopBoardKind,
  _r as workshopBudgetResult,
  an as workshopCandidate,
  Ut as workshopCardAsNote,
  vn as workshopCardAsNoteRefusal,
  ut as workshopCardLabelOf,
  xr as workshopCardLines,
  so as workshopCardLookOf,
  Ir as workshopCardNoteText,
  po as workshopCardText,
  Ht as workshopDestinations,
  Qn as workshopEditKinds,
  Zn as workshopFinder,
  Dt as workshopKeepsLink,
  nt as workshopKeepsPicture,
  xe as workshopLaneCaption,
  Ue as workshopLanePlaces,
  _n as workshopLayout,
  ln as workshopLineRefusal,
  Gt as workshopLinesOf,
  Ar as workshopLinesSentence,
  wo as workshopNewLine,
  se as workshopNodeIds,
  on as workshopNoteCandidate,
  to as workshopNoteIdOf,
  Be as workshopNoteRefusal,
  go as workshopPositions,
  ft as workshopPresentationLanes,
  ts as workshopPresentationScenes,
  Yo as workshopReferences,
  bn as workshopRefusal,
  De as workshopRenamedLines,
  Rt as workshopRuleSchema,
  ye as workshopRules,
  Ur as workshopRulesLoaded,
  bo as workshopStandInId,
  rn as workshopTakesNotes,
  $r as workshopToSlate,
  In as workshopWithLine,
  Cr as workshopWithoutCardLines,
  Kt as workshopWithoutLine
};
